/**
 * Serviço de validação do PIN transacional.
 * Valida contra material seguro persistido, controla tentativas e bloqueio.
 * Falha técnica nunca retorna invalid.
 */

import {
  readPinMaterial,
  updatePinMetadata,
  verifyPinAgainstMaterial,
} from "../infra/pinStorage";
import { logSecurityEvent } from "../observability/securityLogger";
import { useSecurityStore } from "../store";
import { hydrateSecurityStore } from "./hydrateSecurityStore";
import { PIN_LENGTH, MAX_INVALID_ATTEMPTS, BLOCK_DURATION_SECONDS } from "../constants";
import { SecurityErrorCode, type SecurityErrorCodeType } from "../errors";
import type { ValidatePinInput, ValidatePinResult } from "../types";

const PIN_FORMAT_REGEX = /^\d{6}$/;

function validatePinFormat(pin: string): boolean {
  return PIN_FORMAT_REGEX.test(pin) && pin.length === PIN_LENGTH;
}

function addSecondsToNow(seconds: number): string {
  const d = new Date();
  d.setSeconds(d.getSeconds() + seconds);
  return d.toISOString();
}

/**
 * Valida o PIN contra o material persistido.
 * Incrementa tentativas em falha, aplica bloqueio ao atingir limite.
 * Sucesso reseta tentativas e bloqueio.
 */
export async function validatePin(input: ValidatePinInput): Promise<ValidatePinResult> {
  const { pin, accountId } = input;

  if (!validatePinFormat(pin)) {
    return {
      status: "unavailable",
      errorCode: SecurityErrorCode.PIN_FORMAT_INVALID,
    };
  }

  const readResult = await readPinMaterial(accountId);
  if (!readResult.success) {
    const code = readResult.errorCode as SecurityErrorCodeType;
    const event =
      code === SecurityErrorCode.STORAGE_DATA_INVALID
        ? "storage_data_invalid"
        : "storage_read_failed";
    logSecurityEvent(event, { code }, "error");
    return {
      status: "unavailable",
      errorCode: readResult.errorCode as SecurityErrorCodeType,
    };
  }

  if (readResult.data === null) {
    return {
      status: "not_configured",
      errorCode: SecurityErrorCode.PIN_NOT_CONFIGURED,
    };
  }

  const material = readResult.data;
  let { metadata } = material;
  const now = new Date();
  let blockUntil = metadata.blockUntil;

  if (blockUntil !== null && new Date(blockUntil) <= now) {
    const clearResult = await updatePinMetadata(accountId, {
      failedAttempts: 0,
      blockUntil: null,
    });
    if (!clearResult.success) {
      logSecurityEvent("storage_write_failed", { code: SecurityErrorCode.STORAGE_WRITE_FAILED }, "error");
      return {
        status: "unavailable",
        errorCode: SecurityErrorCode.STORAGE_WRITE_FAILED,
      };
    }
    await hydrateSecurityStore(accountId);
    metadata = { ...metadata, failedAttempts: 0, blockUntil: null };
    blockUntil = null;
  }

  if (blockUntil !== null && new Date(blockUntil) > now) {
    useSecurityStore.getState().hydrateFromPersistence({
      hasPin: true,
      failedAttempts: metadata.failedAttempts,
      isBlocked: true,
      blockUntil,
    });
    useSecurityStore.getState().setLastErrorCode(SecurityErrorCode.PIN_BLOCKED);
    return {
      status: "blocked",
      blockUntil,
      errorCode: SecurityErrorCode.PIN_BLOCKED,
    };
  }

  let isValid: boolean;
  try {
    isValid = await verifyPinAgainstMaterial(pin, material);
  } catch {
    logSecurityEvent("validation_execution_failed", {
      code: SecurityErrorCode.VALIDATION_EXECUTION_FAILED,
    }, "error");
    return {
      status: "unavailable",
      errorCode: SecurityErrorCode.VALIDATION_EXECUTION_FAILED,
    };
  }

  if (isValid) {
    const updateResult = await updatePinMetadata(accountId, {
      failedAttempts: 0,
      blockUntil: null,
    });
    if (!updateResult.success) {
      logSecurityEvent("storage_write_failed", { code: SecurityErrorCode.STORAGE_WRITE_FAILED }, "error");
      return {
        status: "unavailable",
        errorCode: SecurityErrorCode.STORAGE_WRITE_FAILED,
      };
    }
    await hydrateSecurityStore(accountId);
    useSecurityStore.getState().setIsPinValidated(true);
    useSecurityStore.getState().setLastErrorCode(null);
    return { status: "validated" };
  }

  const newFailedAttempts = metadata.failedAttempts + 1;
  const limitReached = newFailedAttempts >= MAX_INVALID_ATTEMPTS;
  const newBlockUntil = limitReached ? addSecondsToNow(BLOCK_DURATION_SECONDS) : null;

  const updateResult = await updatePinMetadata(accountId, {
    failedAttempts: newFailedAttempts,
    blockUntil: newBlockUntil,
  });

  if (!updateResult.success) {
    logSecurityEvent("storage_write_failed", { code: SecurityErrorCode.STORAGE_WRITE_FAILED }, "error");
    return {
      status: "unavailable",
      errorCode: SecurityErrorCode.STORAGE_WRITE_FAILED,
    };
  }

  await hydrateSecurityStore(accountId);
  useSecurityStore.getState().setIsPinValidated(false);
  useSecurityStore.getState().setLastErrorCode(
    limitReached ? SecurityErrorCode.ATTEMPT_LIMIT_REACHED : SecurityErrorCode.PIN_INVALID
  );

  if (limitReached) {
    logSecurityEvent("validation_block_activated", { blockDurationMs: BLOCK_DURATION_SECONDS * 1000 }, "warn");
    return {
      status: "blocked",
      blockUntil: newBlockUntil!,
      errorCode: SecurityErrorCode.ATTEMPT_LIMIT_REACHED,
    };
  }

  const remainingAttempts = MAX_INVALID_ATTEMPTS - newFailedAttempts;
  logSecurityEvent("validation_invalid", { remainingAttempts }, "info");
  return {
    status: "invalid",
    errorCode: SecurityErrorCode.PIN_INVALID,
    remainingAttempts,
  };
}

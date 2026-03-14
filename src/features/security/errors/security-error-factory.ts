/**
 * Factory e mapper de erros do SECURITY.
 * Centraliza categorização e evita confusão entre erro técnico e erro de credencial.
 */

import { SecurityErrorCode } from "./security-error-codes";
import type {
  SecurityErrorCodeType,
  SecurityErrorCategory,
  SecurityErrorDescriptor,
} from "./security-error-categories.types";

const DESCRIPTOR_MAP: Record<
  SecurityErrorCodeType,
  Omit<SecurityErrorDescriptor, "code">
> = {
  [SecurityErrorCode.PIN_NOT_CONFIGURED]: {
    category: "state",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "pin_not_configured",
  },
  [SecurityErrorCode.PIN_CONFIRMATION_MISMATCH]: {
    category: "validation",
    isCredentialError: true,
    isRetryable: true,
    messageKey: "pin_confirmation_mismatch",
  },
  [SecurityErrorCode.PIN_FORMAT_INVALID]: {
    category: "validation",
    isCredentialError: true,
    isRetryable: true,
    messageKey: "pin_format_invalid",
  },
  [SecurityErrorCode.PIN_INVALID]: {
    category: "validation",
    isCredentialError: true,
    isRetryable: true,
    messageKey: "pin_invalid",
  },
  [SecurityErrorCode.PIN_BLOCKED]: {
    category: "policy",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "pin_blocked",
  },
  [SecurityErrorCode.ATTEMPT_LIMIT_REACHED]: {
    category: "policy",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "attempt_limit_reached",
  },
  [SecurityErrorCode.CHALLENGE_CANCELLED]: {
    category: "flow",
    isCredentialError: false,
    isRetryable: true,
    messageKey: "challenge_cancelled",
  },
  [SecurityErrorCode.CHALLENGE_NOT_ACTIVE]: {
    category: "flow",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "challenge_not_active",
  },
  [SecurityErrorCode.CHALLENGE_RESOLUTION_MISSING]: {
    category: "flow",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "challenge_resolution_missing",
  },
  [SecurityErrorCode.STORAGE_READ_FAILED]: {
    category: "technical",
    isCredentialError: false,
    isRetryable: true,
    messageKey: "storage_read_failed",
  },
  [SecurityErrorCode.STORAGE_WRITE_FAILED]: {
    category: "technical",
    isCredentialError: false,
    isRetryable: true,
    messageKey: "storage_write_failed",
  },
  [SecurityErrorCode.STORAGE_DATA_INVALID]: {
    category: "technical",
    isCredentialError: false,
    isRetryable: false,
    messageKey: "storage_data_invalid",
  },
  [SecurityErrorCode.VALIDATION_EXECUTION_FAILED]: {
    category: "technical",
    isCredentialError: false,
    isRetryable: true,
    messageKey: "validation_execution_failed",
  },
  [SecurityErrorCode.UNKNOWN_ERROR]: {
    category: "technical",
    isCredentialError: false,
    isRetryable: true,
    messageKey: "unknown_error",
  },
};

/**
 * Retorna o descritor completo para um código de erro.
 * Nunca confunde erro técnico com erro de credencial.
 */
export function getSecurityErrorDescriptor(
  code: SecurityErrorCodeType
): SecurityErrorDescriptor {
  const base = DESCRIPTOR_MAP[code];
  return { ...base, code };
}

/**
 * Cria um objeto de erro tipado a partir de um código.
 */
export function createSecurityError(
  code: SecurityErrorCodeType,
  cause?: unknown
): SecurityErrorDescriptor & { cause?: unknown } {
  return {
    ...getSecurityErrorDescriptor(code),
    ...(cause !== undefined && { cause }),
  };
}

/**
 * Mapeia valores unknown (ex: exceções capturadas) para código de erro do SECURITY.
 * NUNCA deve retornar PIN_INVALID para falha técnica.
 */
export function mapUnknownToSecurityError(_cause: unknown): SecurityErrorCodeType {
  return SecurityErrorCode.UNKNOWN_ERROR;
}

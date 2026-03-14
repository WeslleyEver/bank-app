/**
 * Serviço de setup de PIN transacional.
 * Valida formato, consistência, persiste apenas após confirmação.
 * NUNCA persiste antes da confirmação final.
 */

import { persistPinForAccount } from "../infra/pinStorage";
import { useSecurityStore } from "../store";
import { hydrateSecurityStore } from "./hydrateSecurityStore";
import { PIN_LENGTH } from "../constants";
import { SecurityErrorCode } from "../errors";
import type { SetupPinResult, SetupPinInput } from "../types";

const PIN_FORMAT_REGEX = /^\d{6}$/;

function validatePinFormat(pin: string): boolean {
  return PIN_FORMAT_REGEX.test(pin) && pin.length === PIN_LENGTH;
}

/**
 * Cria e persiste PIN transacional após confirmação.
 * Nada é persistido antes da confirmação final.
 */
export async function setupPin(input: SetupPinInput): Promise<SetupPinResult> {
  const { pin, confirmation, accountId } = input;

  if (!validatePinFormat(pin)) {
    return { success: false, errorCode: SecurityErrorCode.PIN_FORMAT_INVALID };
  }

  if (!validatePinFormat(confirmation)) {
    return { success: false, errorCode: SecurityErrorCode.PIN_FORMAT_INVALID };
  }

  if (pin !== confirmation) {
    return {
      success: false,
      errorCode: SecurityErrorCode.PIN_CONFIRMATION_MISMATCH,
    };
  }

  const persistResult = await persistPinForAccount(accountId, pin);

  if (!persistResult.success) {
    return {
      success: false,
      errorCode:
        persistResult.errorCode === SecurityErrorCode.STORAGE_WRITE_FAILED
          ? SecurityErrorCode.STORAGE_WRITE_FAILED
          : SecurityErrorCode.UNKNOWN_ERROR,
    };
  }

  await hydrateSecurityStore(accountId);
  useSecurityStore.getState().setLastErrorCode(null);

  return { success: true };
}

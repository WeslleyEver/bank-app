/**
 * Hook do fluxo de validação de PIN.
 * Encapsula validatePin, expõe loading, resultado e cancelamento.
 * Não duplica regra de domínio nem acessa infra diretamente.
 */

import { useState, useCallback } from "react";
import { validatePin } from "../services/validatePin.service";
import { useSecurityStore } from "../store";
import { SecurityErrorCode } from "../errors";
import type { ValidatePinInput, ValidatePinResult } from "../types";

export type UsePinValidateResult = {
  validate: (input: ValidatePinInput) => Promise<ValidatePinResult>;
  isLoading: boolean;
  lastErrorCode: ReturnType<typeof useSecurityStore.getState>["lastErrorCode"];
  cancelValidation: () => void;
};

export function usePinValidate(): UsePinValidateResult {
  const [isLoading, setIsLoading] = useState(false);
  const setLastErrorCode = useSecurityStore((s) => s.setLastErrorCode);

  const validate = useCallback(
    async (input: ValidatePinInput) => {
      setIsLoading(true);
      setLastErrorCode(null);

      try {
        const result = await validatePin(input);
        if (
          result.status === "invalid" ||
          result.status === "blocked" ||
          result.status === "not_configured" ||
          result.status === "unavailable"
        ) {
          setLastErrorCode("errorCode" in result ? result.errorCode : null);
        } else if (result.status === "validated") {
          setLastErrorCode(null);
        }
        return result;
      } catch {
        setLastErrorCode(SecurityErrorCode.UNKNOWN_ERROR);
        return {
          status: "unavailable",
          errorCode: SecurityErrorCode.UNKNOWN_ERROR,
        } as ValidatePinResult;
      } finally {
        setIsLoading(false);
      }
    },
    [setLastErrorCode]
  );

  const cancelValidation = useCallback(() => {
    setLastErrorCode(null);
  }, [setLastErrorCode]);

  return {
    validate,
    isLoading,
    lastErrorCode: useSecurityStore((s) => s.lastErrorCode),
    cancelValidation,
  };
}

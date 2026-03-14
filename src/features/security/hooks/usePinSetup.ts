/**
 * Hook do fluxo de criação/confirmação de PIN.
 * Encapsula setupPin, expõe loading, resultado e erro tipado.
 * NÃO contém lógica de persistência nem de crypto.
 */

import { useState, useCallback } from "react";
import { setupPin } from "../services/setupPin.service";
import { useSecurityStore } from "../store";
import type { SetupPinResult, SetupPinInput } from "../types";
import { SecurityErrorCode, type SecurityErrorCodeType } from "../errors";

export type UsePinSetupResult = {
  setup: (input: SetupPinInput) => Promise<SetupPinResult>;
  isLoading: boolean;
  lastErrorCode: SecurityErrorCodeType | null;
  clearError: () => void;
  /** Limpa estado temporário da store no cancelamento. UI deve limpar inputs locais também. */
  cancelSetup: () => void;
};

export function usePinSetup(): UsePinSetupResult {
  const [isLoading, setIsLoading] = useState(false);
  const setLastErrorCode = useSecurityStore((s) => s.setLastErrorCode);

  const setup = useCallback(
    async (input: SetupPinInput) => {
      setIsLoading(true);
      setLastErrorCode(null);

      try {
        const result = await setupPin(input);

        if (!result.success) {
          setLastErrorCode(result.errorCode);
          return result;
        }

        setLastErrorCode(null);
        return result;
      } catch {
        const code = SecurityErrorCode.UNKNOWN_ERROR;
        setLastErrorCode(code);
        return { success: false, errorCode: code };
      } finally {
        setIsLoading(false);
      }
    },
    [setLastErrorCode]
  );

  const clearError = useCallback(() => {
    setLastErrorCode(null);
  }, [setLastErrorCode]);

  const cancelSetup = useCallback(() => {
    setLastErrorCode(null);
  }, [setLastErrorCode]);

  return {
    setup,
    isLoading,
    lastErrorCode: useSecurityStore((s) => s.lastErrorCode),
    clearError,
    cancelSetup,
  };
}

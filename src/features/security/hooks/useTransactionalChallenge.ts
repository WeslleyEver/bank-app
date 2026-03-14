/**
 * Hook do challenge transacional reutilizável.
 * Expõe iniciar, resolver e cancelar challenge.
 * Não duplica lógica de validação nem acessa infra diretamente.
 */

import { useState, useCallback } from "react";
import {
  requestTransactionalChallenge,
  resolveTransactionalChallenge,
  cancelTransactionalChallenge,
} from "../services/requestTransactionalChallenge";
import { useSecurityStore } from "../store";
import type {
  SecurityChallengeRequest,
  SecurityChallengeResult,
} from "../types";

export type UseTransactionalChallengeResult = {
  /** Inicia o challenge — retorna Promise que resolve ao concluir */
  requestChallenge: (
    request: SecurityChallengeRequest
  ) => Promise<SecurityChallengeResult>;
  /** Resolve o challenge com credencial (PIN) — chamado pela UI ao submeter */
  resolveChallenge: (
    pin: string,
    accountId: string
  ) => Promise<SecurityChallengeResult>;
  /** Cancela o challenge — não incrementa tentativas */
  cancelChallenge: () => SecurityChallengeResult;
  /** Challenge em andamento */
  currentChallenge: SecurityChallengeRequest | null;
  /** Indica se está resolvendo (validando credencial) */
  isResolving: boolean;
};

export function useTransactionalChallenge(): UseTransactionalChallengeResult {
  const [isResolving, setIsResolving] = useState(false);
  const currentChallenge = useSecurityStore((s) => s.currentChallenge);

  const requestChallenge = useCallback(
    async (request: SecurityChallengeRequest) => {
      return requestTransactionalChallenge(request);
    },
    []
  );

  const resolveChallenge = useCallback(
    async (pin: string, accountId: string) => {
      setIsResolving(true);
      try {
        return await resolveTransactionalChallenge(pin, accountId);
      } finally {
        setIsResolving(false);
      }
    },
    []
  );

  const cancelChallenge = useCallback(() => {
    return cancelTransactionalChallenge();
  }, []);

  return {
    requestChallenge,
    resolveChallenge,
    cancelChallenge,
    currentChallenge,
    isResolving,
  };
}

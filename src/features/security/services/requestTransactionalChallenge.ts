/**
 * Solicita challenge transacional para autorizar operação sensível.
 *
 * PLACEHOLDER ARQUITETURAL (TASK 1):
 * Não implementa fluxo real. Retorna imediatamente `unavailable`.
 * Implementação funcional nas tasks 7–8.
 */

import type {
  SecurityChallengeRequest,
  SecurityChallengeResult,
} from "../types";

/**
 * Placeholder: sempre retorna not_configured.
 * O fluxo real será implementado nas tasks de criação/validação de PIN e challenge.
 */
export async function requestTransactionalChallenge(
  _request: SecurityChallengeRequest
): Promise<SecurityChallengeResult> {
  return {
    status: "unavailable",
    reason: "TASK1_PLACEHOLDER",
  };
}

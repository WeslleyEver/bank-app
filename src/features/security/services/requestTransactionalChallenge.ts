/**
 * Solicita challenge transacional para autorizar operação sensível.
 *
 * PLACEHOLDER ARQUITETURAL (TASK 1-2):
 * Não implementa fluxo real. Retorna not_configured (sem PIN configurado).
 * Implementação funcional nas tasks 7–8.
 */

import type {
  SecurityChallengeRequest,
  SecurityChallengeResult,
} from "../types";

/**
 * Placeholder: sempre retorna not_configured.
 * Domínio definido na TASK 2; fluxo real nas tasks de criação/validação de PIN e challenge.
 */
export async function requestTransactionalChallenge(
  _request: SecurityChallengeRequest
): Promise<SecurityChallengeResult> {
  return { status: "not_configured" };
}

/**
 * API pública da feature SECURITY.
 * Única porta de entrada para consumo externo.
 *
 * SECURITY é responsável por:
 * - credencial transacional
 * - challenge transacional
 * - autorização de operação sensível
 *
 * SECURITY não é responsável por tokens de sessão (AUTH).
 */

export { useSecurityStore } from "./store";
export { useSecurity } from "./hooks";
export { requestTransactionalChallenge, clearSecurityState } from "./services";
export { SecurityErrorCode } from "./errors";

export type {
  SecurityMethod,
  SecurityState,
  SecurityChallengeType,
  SecurityChallengeRequest,
  SecurityChallengeResult,
} from "./types";

export type { SecurityErrorCodeType } from "./errors";

/**
 * Challenge transacional reutilizável.
 * O chamador pede autorização de operação sensível — não validação de PIN.
 * Encapsula validatePin internamente.
 */

import { hasPinForAccount } from "../infra/pinStorage";
import { hydrateSecurityStore } from "./hydrateSecurityStore";
import { validatePin } from "./validatePin.service";
import { useSecurityStore } from "../store";
import { SecurityErrorCode } from "../errors";
import type {
  SecurityChallengeRequest,
  SecurityChallengeResult,
} from "../types";

let pendingResolve: ((result: SecurityChallengeResult) => void) | null = null;

function clearPending(): void {
  pendingResolve = null;
}

function mapValidateResultToChallengeResult(
  result: import("../types").ValidatePinResult,
  accountId: string
): SecurityChallengeResult {
  if (result.status === "validated") {
    return { status: "authorized", method: "PIN" };
  }
  if (result.status === "cancelled") {
    return { status: "cancelled" };
  }
  if (result.status === "not_configured") {
    return { status: "not_configured" };
  }
  if (result.status === "blocked") {
    return {
      status: "blocked",
      until: "blockUntil" in result ? result.blockUntil : "",
    };
  }
  if (result.status === "invalid") {
    return {
      status: "denied",
      errorCode: "errorCode" in result ? result.errorCode : SecurityErrorCode.PIN_INVALID,
    };
  }
  return {
    status: "unavailable",
    errorCode: "errorCode" in result ? result.errorCode : SecurityErrorCode.UNKNOWN_ERROR,
  };
}

/**
 * Solicita challenge transacional.
 * Retorna Promise que resolve quando o challenge for concluído (credencial ou cancelamento).
 * O chamador não conhece validatePin — apenas o resultado tipado.
 */
export async function requestTransactionalChallenge(
  request: SecurityChallengeRequest
): Promise<SecurityChallengeResult> {
  const { accountId } = request;

  const hasPin = await hasPinForAccount(accountId);
  if (!hasPin) {
    return { status: "not_configured" };
  }

  await hydrateSecurityStore(accountId);
  const { isBlocked, blockUntil } = useSecurityStore.getState();
  if (isBlocked && blockUntil) {
    const now = new Date();
    if (new Date(blockUntil) > now) {
      return { status: "blocked", until: blockUntil };
    }
  }

  useSecurityStore.getState().setCurrentChallenge(request);
  useSecurityStore.getState().setLastErrorCode(null);

  return new Promise<SecurityChallengeResult>((resolve) => {
    pendingResolve = resolve;
  });
}

/**
 * Resolve o challenge com a credencial informada.
 * Usa validatePin internamente — API interna, não pública.
 * Chamado pela UI quando o usuário submete o PIN.
 */
export async function resolveTransactionalChallenge(
  pin: string,
  accountId: string
): Promise<SecurityChallengeResult> {
  const resolver = pendingResolve;
  if (!resolver) {
    useSecurityStore.getState().setCurrentChallenge(null);
    return { status: "unavailable", reason: "CHALLENGE_NOT_ACTIVE" };
  }

  const validateResult = await validatePin({ pin, accountId });
  const challengeResult = mapValidateResultToChallengeResult(
    validateResult,
    accountId
  );

  useSecurityStore.getState().setCurrentChallenge(null);
  clearPending();
  resolver(challengeResult);
  return challengeResult;
}

/**
 * Cancela o challenge atual.
 * Não incrementa tentativas. Retorna status cancelled.
 */
export function cancelTransactionalChallenge(): SecurityChallengeResult {
  const resolver = pendingResolve;
  useSecurityStore.getState().setCurrentChallenge(null);
  useSecurityStore.getState().setLastErrorCode(null);
  clearPending();
  if (resolver) {
    resolver({ status: "cancelled" });
  }
  return { status: "cancelled" };
}

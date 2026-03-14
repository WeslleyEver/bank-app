/**
 * Challenge transacional reutilizável.
 * O chamador pede autorização de operação sensível — não validação de PIN.
 * Encapsula validatePin internamente.
 */

import { hasPinForAccount } from "../infra/pinStorage";
import { logSecurityEvent } from "../observability/securityLogger";
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
    logSecurityEvent("challenge_not_configured", { operation: request.type });
    return { status: "not_configured" };
  }

  await hydrateSecurityStore(accountId);
  const { isBlocked, blockUntil } = useSecurityStore.getState();
  if (isBlocked && blockUntil) {
    const now = new Date();
    if (new Date(blockUntil) > now) {
      logSecurityEvent("challenge_blocked", { operation: request.type }, "warn");
      return { status: "blocked", until: blockUntil };
    }
  }

  logSecurityEvent("challenge_started", { operation: request.type });
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
    logSecurityEvent("challenge_unavailable", { code: "CHALLENGE_NOT_ACTIVE" }, "warn");
    return { status: "unavailable", reason: "CHALLENGE_NOT_ACTIVE" };
  }

  const validateResult = await validatePin({ pin, accountId });
  const challengeResult = mapValidateResultToChallengeResult(
    validateResult,
    accountId
  );

  if (challengeResult.status === "authorized") {
    logSecurityEvent("challenge_authorized");
  } else if (challengeResult.status === "denied") {
    logSecurityEvent("challenge_denied", {
      code: "errorCode" in challengeResult ? challengeResult.errorCode : undefined,
    }, "info");
  } else if (challengeResult.status === "blocked") {
    logSecurityEvent("challenge_blocked", { until: challengeResult.until }, "warn");
  } else if (challengeResult.status === "not_configured") {
    logSecurityEvent("challenge_not_configured");
  } else if (challengeResult.status === "unavailable") {
    logSecurityEvent("challenge_unavailable", {
      code: "errorCode" in challengeResult ? challengeResult.errorCode : undefined,
    }, "error");
  }
  // cancelled é logado em cancelTransactionalChallenge

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
  logSecurityEvent("challenge_cancelled");
  useSecurityStore.getState().setCurrentChallenge(null);
  useSecurityStore.getState().setLastErrorCode(null);
  clearPending();
  if (resolver) {
    resolver({ status: "cancelled" });
  }
  return { status: "cancelled" };
}

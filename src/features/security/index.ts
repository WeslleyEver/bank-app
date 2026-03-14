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
export { useSecurity, usePinSetup } from "./hooks";
export {
  requestTransactionalChallenge,
  clearSecurityState,
  type ClearSecurityStateOptions,
} from "./services";
export { SecurityErrorCode } from "./errors";
export { PinSetupScreen } from "./presentation/screens/PinSetupScreen";

export type {
  SecurityMethod,
  SecurityState,
  SecurityChallengeType,
  SecurityChallengeRequest,
  SecurityChallengeResult,
  SecurityChallengeStatus,
  CredentialConfigurationStatus,
  UserWithPinStatus,
  PinValidationResult,
  InvalidAttemptsState,
  BlockState,
  SetupPinResult,
  SetupPinInput,
} from "./types";

export type { SecurityErrorCodeType, SecurityErrorCategory, SecurityErrorDescriptor } from "./errors";

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
export { useSecurity, usePinSetup, usePinValidate } from "./hooks";
export {
  requestTransactionalChallenge,
  clearSecurityState,
  type ClearSecurityStateOptions,
} from "./services";
export { SecurityErrorCode } from "./errors";
export { PinSetupScreen } from "./presentation/screens/PinSetupScreen";
export { PinValidationScreen } from "./presentation/screens/PinValidationScreen";

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
  ValidatePinInput,
  ValidatePinResult,
  ValidatePinStatus,
} from "./types";

export type { SecurityErrorCodeType, SecurityErrorCategory, SecurityErrorDescriptor } from "./errors";

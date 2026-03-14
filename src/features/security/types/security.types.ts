/**
 * Tipos estruturais da feature SECURITY.
 * v1 = PIN; preparado para biometria e OTP.
 */

import type { SecurityChallengeRequest } from "./security-challenge.types";
import type { SecurityErrorCodeType } from "../errors";

/**
 * Métodos de autenticação transacional suportados.
 * v1 implementa apenas PIN; arquitetura preparada para extensão.
 */
export type SecurityMethod = "PIN" | "BIOMETRY" | "OTP";

/**
 * Estado da feature SECURITY refletido na store.
 * Nunca guarda segredo bruto (PIN, hash, salt).
 */
export interface SecurityState {
  /** Usuário tem credencial transacional configurada */
  hasPin: boolean;
  /** Challenge atual foi validado com sucesso */
  isPinValidated: boolean;
  /** Tentativas inválidas consecutivas (v1: max 3) */
  failedAttempts: number;
  /** Bloqueio temporário ativo (v1: 5 min) */
  isBlocked: boolean;
  /** Timestamp ISO até quando o bloqueio está ativo */
  blockUntil: string | null;
  /** Challenge em andamento, se houver */
  currentChallenge: SecurityChallengeRequest | null;
  /** Último código de erro, se houver */
  lastErrorCode: SecurityErrorCodeType | null;
}

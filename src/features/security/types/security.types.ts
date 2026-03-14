/**
 * Tipos estruturais da feature SECURITY.
 * Preparado para evolução futura (PIN, biometria, OTP).
 */

/**
 * Métodos de autenticação transacional suportados.
 * v1 implementa apenas PIN; arquitetura preparada para extensão.
 */
export type SecurityMethod = "PIN" | "BIOMETRY" | "OTP";

/**
 * Estado estrutural da feature SECURITY.
 * Placeholder mínimo — detalhes serão preenchidos nas tasks 2–4.
 */
export interface SecurityState {
  /** Indica se credencial transacional está configurada */
  hasPin: boolean;
  /** Indica se challenge atual foi validado com sucesso */
  isPinValidated: boolean;
  /** Tentativas inválidas consecutivas (placeholder) */
  failedAttempts: number;
  /** Indica bloqueio temporário ativo */
  isBlocked: boolean;
  /** Timestamp ISO até quando o bloqueio está ativo */
  blockUntil: string | null;
  /** Challenge em andamento (placeholder) */
  currentChallenge: unknown | null;
}

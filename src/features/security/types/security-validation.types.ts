/**
 * Tipos de validação e bloqueio.
 * Regras de domínio sem implementar persistência.
 */

/**
 * Resultado da validação do PIN (conceitual).
 * - correct: PIN corresponde ao material seguro persistido
 * - invalid: PIN não corresponde (tentativa inválida)
 * - blocked: bloqueio temporário ativo
 * - not_configured: sem material persistido
 * - technical_error: falha técnica (storage, comparação) — nunca tratar como invalid
 */
export type PinValidationResult =
  | "correct"
  | "invalid"
  | "blocked"
  | "not_configured"
  | "technical_error";

/**
 * Estado de tentativas inválidas.
 * v1: máximo 3, após 3 → bloqueio temporário de 5 minutos.
 */
export interface InvalidAttemptsState {
  /** Tentativas inválidas consecutivas atuais */
  count: number;
  /** Limite configurado (v1 = 3) */
  limit: number;
  /** Indica se o limite foi atingido */
  limitReached: boolean;
}

/**
 * Estado de bloqueio temporário.
 * v1: 5 minutos após 3 tentativas inválidas.
 */
export interface BlockState {
  /** Indica se bloqueio está ativo */
  isActive: boolean;
  /** Timestamp ISO até quando o bloqueio está ativo */
  blockUntil: string | null;
  /** Duração em segundos (v1 = 300) */
  durationSeconds: number;
}

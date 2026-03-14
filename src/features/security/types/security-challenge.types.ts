/**
 * Tipos de contrato do challenge transacional.
 * Placeholder arquitetural — implementação nas tasks 7–8.
 */

/** Tipos de operação que exigem challenge */
export type SecurityChallengeType =
  | "PIX_TRANSFER"
  | "PAYMENT"
  | "CARD_ACTION"
  | "GENERIC_SENSITIVE_ACTION";

/** Requisição de challenge transacional */
export interface SecurityChallengeRequest {
  type: SecurityChallengeType;
  reason?: string;
  metadata?: Record<string, unknown>;
}

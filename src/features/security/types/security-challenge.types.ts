/**
 * Contrato do challenge transacional.
 * Features pedem autorização de operação sensível, não validação de PIN.
 */

/**
 * Tipos de operação que exigem challenge.
 * v1: Pix em 100% dos casos; preparado para expansão.
 */
export type SecurityChallengeType =
  | "PIX_TRANSFER"
  | "PAYMENT"
  | "CARD_ACTION"
  | "GENERIC_SENSITIVE_ACTION";

/**
 * Requisição de challenge transacional.
 * Contexto da operação sensível.
 */
export interface SecurityChallengeRequest {
  /** Tipo da operação */
  type: SecurityChallengeType;
  /** Motivo legível (opcional) */
  reason?: string;
  /** Metadados da operação (não sensíveis) */
  metadata?: Record<string, unknown>;
}

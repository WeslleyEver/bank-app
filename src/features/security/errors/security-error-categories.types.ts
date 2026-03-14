/**
 * Categorias de erro de domínio.
 * Distingue falha de credencial de falha técnica.
 */

import type { SecurityErrorCodeType } from "./security-error-codes";

/**
 * Categoria do erro para tratamento correto.
 * - validation: credencial inválida (PIN errado, confirmação diverge)
 * - state: estado não permite ação (não configurado, bloqueado)
 * - policy: política de negócio (limite de tentativas)
 * - technical: falha de sistema (storage, execução)
 * - flow: contrato de fluxo quebrado
 */
export type SecurityErrorCategory =
  | "validation"
  | "state"
  | "policy"
  | "technical"
  | "flow";

export interface SecurityErrorDescriptor {
  code: SecurityErrorCodeType;
  category: SecurityErrorCategory;
  /** Indica se é erro de credencial (não confundir com técnico) */
  isCredentialError: boolean;
  /** Indica se retry faz sentido para o usuário */
  isRetryable: boolean;
  /** Chave estável para UI mapear mensagem — nunca texto sensível */
  messageKey: string;
}

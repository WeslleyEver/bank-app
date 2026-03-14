/**
 * Códigos de erro da feature SECURITY.
 * Alinhado a security-errors.md — categorias e códigos de domínio.
 */

export const SecurityErrorCode = {
  /** Sem credencial transacional configurada */
  PIN_NOT_CONFIGURED: "PIN_NOT_CONFIGURED",
  /** Confirmação diverge do PIN inicial no setup */
  PIN_CONFIRMATION_MISMATCH: "PIN_CONFIRMATION_MISMATCH",
  /** Formato inválido (v1: 6 dígitos numéricos) */
  PIN_FORMAT_INVALID: "PIN_FORMAT_INVALID",
  /** PIN incorreto — comparação OK, valor não confere */
  PIN_INVALID: "PIN_INVALID",
  /** Bloqueio temporário ativo */
  PIN_BLOCKED: "PIN_BLOCKED",
  /** Limite de tentativas atingido — transição para bloqueio */
  ATTEMPT_LIMIT_REACHED: "ATTEMPT_LIMIT_REACHED",
  /** Usuário cancelou o challenge */
  CHALLENGE_CANCELLED: "CHALLENGE_CANCELLED",
  /** Validação/completar sem challenge ativo */
  CHALLENGE_NOT_ACTIVE: "CHALLENGE_NOT_ACTIVE",
  /** Operação tentou executar sem autorização resolvida */
  CHALLENGE_RESOLUTION_MISSING: "CHALLENGE_RESOLUTION_MISSING",
  /** Falha na leitura do storage seguro */
  STORAGE_READ_FAILED: "STORAGE_READ_FAILED",
  /** Falha na escrita do storage seguro */
  STORAGE_WRITE_FAILED: "STORAGE_WRITE_FAILED",
  /** Dados persistidos inválidos/corrompidos */
  STORAGE_DATA_INVALID: "STORAGE_DATA_INVALID",
  /** Falha na execução do pipeline de validação (não confundir com PIN errado) */
  VALIDATION_EXECUTION_FAILED: "VALIDATION_EXECUTION_FAILED",
  /** Erro desconhecido — fallback quando não há mapeamento explícito */
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type SecurityErrorCodeType =
  (typeof SecurityErrorCode)[keyof typeof SecurityErrorCode];

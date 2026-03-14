/**
 * Constantes de domínio da feature SECURITY.
 * Decisões v1 fechadas.
 */

/** Comprimento do PIN na v1 (6 dígitos numéricos) */
export const PIN_LENGTH = 6;

/** Máximo de tentativas inválidas consecutivas (v1) */
export const MAX_INVALID_ATTEMPTS = 3;

/** Duração do bloqueio temporário em segundos (v1: 5 minutos) */
export const BLOCK_DURATION_SECONDS = 300;

export const SECURITY_CONSTANTS = {
  PIN_LENGTH,
  MAX_INVALID_ATTEMPTS,
  BLOCK_DURATION_SECONDS,
} as const;

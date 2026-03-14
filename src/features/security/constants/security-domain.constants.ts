/**
 * Decisões de domínio da v1 registradas explicitamente.
 *
 * DECISÃO v1: Reset de PIN não será implementado.
 * A arquitetura deve ficar preparada para reset futuro.
 */

export const V1_DOMAIN_DECISIONS = {
  /** Reset de PIN não existe na v1 — arquitetura preparada para futuro */
  RESET_PIN_NOT_IMPLEMENTED: true,
  /** Credencial v1 = PIN numérico de 6 dígitos */
  CREDENTIAL_V1: "PIN" as const,
  /** Pix exige challenge em 100% dos casos */
  PIX_ALWAYS_REQUIRES_CHALLENGE: true,
  /** v1 não tem janela de confiança */
  TRUST_WINDOW_ENABLED: false,
} as const;

/**
 * Status de onboarding do usuário.
 * Conforme contrato do backend.
 */

export type OnboardingStatus =
  | "pendente"
  | "em_analise"
  | "aprovado"
  | "rejeitado"
  | "documentos_pendentes";

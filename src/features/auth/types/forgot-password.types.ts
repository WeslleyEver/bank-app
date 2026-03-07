/**
 * Tipos de recuperação de senha.
 * Usa documento (CPF ou CNPJ).
 */

export interface ForgotPasswordRequest {
  documento: string;
}

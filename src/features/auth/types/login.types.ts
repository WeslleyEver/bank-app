/**
 * Tipos do fluxo de login.
 * Login usa documento (CPF ou CNPJ) + senha.
 */

export interface LoginRequest {
  documento: string;
  senha: string;
}

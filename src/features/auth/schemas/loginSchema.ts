/**
 * Schema de validação para login.
 * Usa documento (CPF ou CNPJ) + senha.
 */

export interface LoginFormValues {
  documento: string;
  senha: string;
}

export const loginInitialValues: LoginFormValues = {
  documento: "",
  senha: "",
};

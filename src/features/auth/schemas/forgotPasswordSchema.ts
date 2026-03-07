/**
 * Schema de validação para recuperação de senha.
 * Usa documento (CPF ou CNPJ).
 */

export interface ForgotPasswordFormValues {
  documento: string;
}

export const forgotPasswordInitialValues: ForgotPasswordFormValues = {
  documento: "",
};

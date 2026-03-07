/**
 * Schema de validação para cadastro de Pessoa Física.
 * Conforme contrato do backend.
 */

export interface RegisterPFFormValues {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  acceptTerms: boolean;
}

export const registerPFInitialValues: RegisterPFFormValues = {
  nomeCompleto: "",
  cpf: "",
  email: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
  acceptTerms: false,
};

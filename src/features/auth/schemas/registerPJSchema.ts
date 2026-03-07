/**
 * Schema de validação para cadastro de Pessoa Jurídica.
 * Conforme contrato do backend.
 */

export interface RegisterPJFormValues {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  representanteNome: string;
  representanteCpf: string;
  acceptTerms: boolean;
}

export const registerPJInitialValues: RegisterPJFormValues = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  email: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
  representanteNome: "",
  representanteCpf: "",
  acceptTerms: false,
};

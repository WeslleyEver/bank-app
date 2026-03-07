/**
 * Tipos de cadastro de Pessoa Jurídica.
 * Conforme contrato do backend.
 */

export interface RegisterPJRequest {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  email: string;
  telefone: string;
  senha: string;
  representanteLegal: {
    nome: string;
    cpf: string;
  };
  acceptTerms: boolean;
}

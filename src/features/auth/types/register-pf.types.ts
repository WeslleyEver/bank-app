/**
 * Tipos de cadastro de Pessoa Física.
 * Conforme contrato do backend.
 */

export interface RegisterPFRequest {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  acceptTerms: boolean;
}

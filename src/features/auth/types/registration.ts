/**
 * Tipos comuns de registro.
 * RegisterPFRequest e RegisterPJRequest estão em arquivos dedicados.
 */

/** Tipo de pessoa: física ou jurídica */
export type PersonType = "PF" | "PJ";

/** Resposta genérica de cadastro */
export interface RegisterResponse {
  userId: string;
  message?: string;
}

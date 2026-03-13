/**
 * Constantes para alternar entre mock e backend real.
 * Centraliza a decisão; não espalhar if de mock em services ou hooks.
 */

export const USE_AUTH_MOCKS = true;

/**
 * Documentos usados nos cenários de mock.
 * Permite aos validadores aceitar esses valores quando mocks estão ativos.
 */
export const MOCK_DOCUMENT_KEYS = [
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "00000000000",
  "99999999999", // cenário: erro de rede
  "88888888888", // cenário: timeout (usa networkError por enquanto)
  "77777777777", // cenário: sessão expirada (expiresIn: 0)
  "11111111000195", // CNPJ para testes de cadastro PJ
] as const;

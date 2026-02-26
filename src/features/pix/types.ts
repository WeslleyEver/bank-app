/**
 * ------------------------------------------------------------------
 * Types: Pix
 * ------------------------------------------------------------------
 *
 * Este arquivo contém os contratos de dados utilizados
 * na comunicação entre:
 *
 * - Screen
 * - UseCase
 * - Service
 *
 * A ideia é simular exatamente o formato que uma API real
 * de banco retornaria.
 *
 * Quando houver integração com backend real,
 * esses tipos devem refletir o contrato oficial da API.
 * ------------------------------------------------------------------
 */

/**
 * Dados necessários para solicitar o envio de um Pix.
 *
 * Representa o payload enviado para a API.
 *
 * @property to - Identificador do destinatário (nome, chave Pix, etc).
 * @property amount - Valor a ser transferido.
 */
export type SendPixRequest = {
  to: string;
  amount: number;
};
/**
 * Resposta simulada da API após envio de Pix.
 *
 * O backend retorna:
 * - A nova transação criada
 * - O novo saldo atualizado
 *
 * @property transaction - Objeto da transação criada.
 * @property newBalance - Saldo atualizado após a operação.
 */
export type SendPixResponse = {
  transaction: {
    id: string;
    name: string;
    type: "pix";
    amount: number;
    date: string;
  };
  newBalance: number;
};

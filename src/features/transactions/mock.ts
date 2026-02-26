import { Transaction } from "./types";
/**
 * Lista de transações fictícias para testes de interface e fluxo de caixa.
 *
 * @description Contém casos de uso variados:
 * - Transações com valores negativos (saídas).
 * - Diferentes tipos de transferência (pix, ted).
 * - Formatos de data ISO 8601 para testes de ordenação.
 *
 * @example
 * // Uso básico em um componente de lista:
 * <FlatList data={mockTransactions} ... />
 */
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    /** @description Representa um pagamento enviado via PIX com valor negativo. */
    name: "Weslley Everton",
    type: "pix",
    amount: -7,
    date: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Banco XPTO",
    type: "ted",
    amount: -150,
    date: "2026-02-19T14:00:00.000Z",
  },
  {
    id: "3",
    /** @description Exemplo de recebimento de valor (positivo). */
    name: "Banco SAFRA",
    type: "ted",
    amount: 15200,
    date: "2026-02-18T09:00:00.000Z",
  },
  {
    id: "4",
    name: "Banco SAFRA",
    type: "ted",
    amount: 100,
    date: "2026-02-21T09:00:00.000Z",
  },
  // {
  //   id: "5",
  //   name: "Welley Everton",
  //   type: "pix",
  //   amount: 220,
  //   date: "2026-02-23T10:00:00.000Z",
  // },
  // {
  //   id: "6",
  //   name: "Mercado Pago",
  //   type: "pix",
  //   amount: 50,
  //   date: "2026-02-21T02:00:00.000Z",
  // },
  // {
  //   id: "7",
  //   name: "XP Investimentos",
  //   type: "doc",
  //   amount: -200,
  //   date: "2026-02-21T09:00:00.000Z",
  // },
  // {
  //   id: "8",
  //   name: "Banco SAFRA",
  //   type: "doc",
  //   amount: -500,
  //   date: "2026-02-22T07:02:00.000Z",
  // },
  // {
  //   id: "9",
  //   name: "Erick Roza",
  //   type: "pix",
  //   amount: 5000,
  //   date: "2026-02-24T09:02:00.000Z",
  // },
  // {
  //   id: "10",
  //   name: "Erick Roza",
  //   type: "pix",
  //   amount: 5000,
  //   date: "2026-02-25T09:02:00.000Z",
  // },
  // {
  //   id: "11",
  //   name: "Banco SAFRA",
  //   type: "ted",
  //   amount: 1520,
  //   date: "2026-02-25T20:32:00.000Z",
  // },
  // {
  //   id: "12",
  //   name: "Weslley Everton",
  //   type: "pix",
  //   amount: 200,
  //   date: "2026-02-25T23:20:00.000Z",
  // },
  // ...
];

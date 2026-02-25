/**
 * useTransactions
 * -------------------------------------------------------
 * Hook responsável por fornecer dados de transações
 * para a aplicação.
 *
 * 📌 RESPONSABILIDADE:
 * - Centralizar a lógica de acesso às transações
 * - Aplicar filtros por tipo (pix, ted, doc)
 * - Servir como única fonte de verdade dos dados
 *
 * 📌 QUEM UTILIZA ESSE HOOK:
 * - Tela de Histórico (app/transactions/index.tsx)
 * - Home (para exibir últimas transações)
 * - Qualquer futura tela que precise de dados de transações
 *
 * 📌 COMO FUNCIONA HOJE:
 * - Utiliza dados mockados (mockTransactions)
 * - Se não receber filtro → retorna todas
 * - Se receber filtro → retorna apenas do tipo informado
 *
 * 📌 COMO FUNCIONARÁ COM API REAL:
 * - mockTransactions será removido
 * - Será feita chamada HTTP (ex: fetch / axios)
 * - O filtro poderá ser:
 *    - Aplicado no backend (ideal)
 *    - Ou aplicado após receber os dados
 *
 * 📌 ESTRUTURA DE RETORNO:
 * {
 *   transactions: Transaction[]
 * }
 *
 * 📌 OBS:
 * useMemo é utilizado para evitar recalcular
 * o filtro desnecessariamente.
 */

import { useMemo } from "react";
import { Transaction } from "../types";

export type TransactionType = "pix" | "ted" | "doc";

const mockTransactions: Transaction[] = [
  {
    id: "1",
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
  {
    id: "5",
    name: "Welley Everton",
    type: "pix",
    amount: 220,
    date: "2026-02-23T10:00:00.000Z",
  },
  {
    id: "6",
    name: "Mercado Pago",
    type: "pix",
    amount: 50,
    date: "2026-02-21T02:00:00.000Z",
  },
  {
    id: "7",
    name: "XP Investimentos",
    type: "doc",
    amount: -200,
    date: "2026-02-21T09:00:00.000Z",
  },
  {
    id: "8",
    name: "Banco SAFRA",
    type: "doc",
    amount: -500,
    date: "2026-02-22T07:02:00.000Z",
  },
  {
    id: "9",
    name: "Erick Roza",
    type: "pix",
    amount: 5000,
    date: "2026-02-24T09:02:00.000Z",
  },
  // ...
];

export function useTransactions(filter?: TransactionType) {
  /**
   * Ordena sempre da mais recente para a mais antiga
   */
  const orderedTransactions = useMemo(() => {
    return [...mockTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  /**
   * Aplica filtro se existir
   */
  const transactions = useMemo(() => {
    if (!filter) return orderedTransactions;

    return orderedTransactions.filter((t) => t.type === filter);
  }, [filter, orderedTransactions]);

  /**
   * Últimas 3 transações (usado na Home)
   */
  const lastThree = useMemo(() => {
    return orderedTransactions.slice(0, 3);
  }, [orderedTransactions]);

  return {
    transactions,
    lastThree,
  };
}

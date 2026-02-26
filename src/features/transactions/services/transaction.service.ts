import { mockTransactions } from "@/src/features/transactions/mock";
import { Transaction } from "@/src/features/transactions/types";

/**
 * ------------------------------------------------------------------
 * Store: useTransactionStore
 * ------------------------------------------------------------------
 *
 * Responsabilidade:
 * Armazenar e gerenciar o estado global das transações.
 *
 * Fonte de verdade do histórico dentro do app.
 *
 * Regras:
 * - Não deve conter regra de negócio complexa.
 * - Não deve conter lógica de UI.
 * - Apenas armazenar e atualizar lista.
 *
 * Controle:
 * - hasLoaded evita múltiplos carregamentos do mock.
 *
 * Funções:
 * - loadTransactions(): carrega dados iniciais (mock/API).
 * - addTransaction(transaction): adiciona nova transação.
 *
 * Observação:
 * Quando integrar API real, loadTransactions
 * deverá buscar dados do backend.
 * ------------------------------------------------------------------
 */
export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 300);
    });
  },
};

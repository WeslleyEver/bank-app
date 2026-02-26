import { create } from "zustand";
import { transactionService } from "../services/transaction.service";
import { Transaction } from "../types";

type TransactionState = {
  transactions: Transaction[];
  hasLoaded: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
};

/**
 * ------------------------------------------------------------------
 * Store: useTransactionStore
 * ------------------------------------------------------------------
 *
 * Camada de estado global responsável por armazenar
 * e gerenciar o histórico de transações da aplicação.
 *
 * Este store representa a "fonte de verdade" (single source of truth)
 * para qualquer tela que exiba movimentações financeiras.
 *
 * Arquitetura:
 * Service → Store → Hook → UI
 *
 * Responsabilidades:
 * - Armazenar lista de transações
 * - Controlar carregamento inicial
 * - Permitir inserção de novas transações
 *
 * Não deve:
 * - Conter lógica de UI
 * - Conter validações financeiras complexas
 * - Realizar chamadas HTTP diretamente (usa service)
 *
 * Controle interno:
 * - hasLoaded evita múltiplas chamadas ao service
 *   quando a tela é montada mais de uma vez.
 *
 * Integração futura:
 * Ao conectar API real, apenas o transactionService
 * deverá ser alterado.
 * ------------------------------------------------------------------
 */
export const useTransactionStore = create<TransactionState>()((set, get) => ({
  /**
   * Lista completa de transações carregadas.
   */
  transactions: [],

  /**
   * Flag de controle para evitar recarregamento
   * desnecessário do mock/API.
   */
  hasLoaded: false,

  /**
   * Carrega transações iniciais.
   *
   * Executa apenas uma vez por ciclo de vida do app,
   * evitando sobrescrita de estado já atualizado.
   */
  loadTransactions: async () => {
    if (get().hasLoaded) return;

    const data = await transactionService.getTransactions();

    set({
      transactions: data,
      hasLoaded: true,
    });
  },

  /**
   * Adiciona nova transação ao topo da lista.
   *
   * Mantém ordenação decrescente (mais recente primeiro).
   *
   * @param transaction - Nova transação criada após operação bem-sucedida.
   */
  addTransaction: (transaction: Transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));

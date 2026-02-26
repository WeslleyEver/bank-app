import { create } from "zustand";
import { transactionService } from "../services/transaction.service";
import { Transaction } from "../types";

type TransactionState = {
  transactions: Transaction[];
  hasLoaded: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
};

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  hasLoaded: false,

  loadTransactions: async () => {
    if (get().hasLoaded) return;

    const data = await transactionService.getTransactions();

    set({
      transactions: data,
      hasLoaded: true,
    });
  },

  addTransaction: (transaction: Transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));

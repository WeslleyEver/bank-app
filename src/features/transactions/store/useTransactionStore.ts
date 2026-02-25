// import { create } from "zustand";
// import { Transaction } from "../types";
// import { transactionService } from "../services/transaction.service";

// type TransactionState = {
//   transactions: Transaction[];
//   loadTransactions: () => Promise<void>;
//   addTransaction: (transaction: Transaction) => void;
// };

// export const useTransactionStore = create<TransactionState>((set) => ({
//   transactions: [],

//   loadTransactions: async () => {
//     const data = await transactionService.getTransactions();
//     set({ transactions: data });
//   },

//   addTransaction: (transaction) =>
//     set((state) => ({
//       transactions: [transaction, ...state.transactions],
//     })),
// }));
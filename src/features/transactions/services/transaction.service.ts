import { mockTransactions } from "@/src/features/transactions/mock";
import { Transaction } from "@/src/features/transactions/types";

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 300);
    });
  },
};
import { mockTransactions } from "../../transactions/mock";
import { Transaction } from "../../transactions/types";

export const pixService = {
  async getTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 500);
    });
  },
};

// import { useTransactionStore } from "../../transactions/store/useTransactionStore";

// export const pixService = {
//   async sendPix(data) {
//     const newTransaction = {
//       id: String(Date.now()),
//       ...data,
//       date: new Date().toISOString(),
//     };

//     useTransactionStore.getState().addTransaction(newTransaction);

//     return newTransaction;
//   },
// };



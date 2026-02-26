import { useBalanceStore } from "../../account/store/useBalanceStore";
import { useTransactionStore } from "../../transactions/store/useTransactionStore";
import { Transaction } from "../../transactions/types";
import { SendPixDTO } from "../types";

export const pixService = {
  async sendPix(data: SendPixDTO): Promise<Transaction> {
    const balanceStore = useBalanceStore.getState();
    const transactionStore = useTransactionStore.getState();

    // 🔎 Validação
    if (data.amount > balanceStore.balance) {
      throw new Error("Saldo insuficiente");
    }

    // 🧾 Criar nova transação
    const newTransaction: Transaction = {
      id: String(Date.now()),
      name: data.name,
      type: "pix",
      amount: -Math.abs(data.amount), // sempre negativo (envio)
      date: new Date().toISOString(),
    };

    // 💰 Atualiza saldo
    balanceStore.withdraw(data.amount);

    // 📜 Atualiza lista de transações
    transactionStore.addTransaction(newTransaction);

    return newTransaction;
  },
};

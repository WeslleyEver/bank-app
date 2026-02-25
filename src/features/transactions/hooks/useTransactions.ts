import { Transaction, TransactionType } from "@/src/features/transactions/types";
import { useEffect, useMemo, useState } from "react";
import { transactionService } from "../services/transaction.service";

export function useTransactions(filter?: TransactionType) {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    async function load() {
      const transactions = await transactionService.getTransactions();
      setData(transactions);
    }

    load();
  }, []);

  const orderedTransactions = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data]);

  const transactions = useMemo(() => {
    if (!filter) return orderedTransactions;
    return orderedTransactions.filter((t) => t.type === filter);
  }, [filter, orderedTransactions]);

  const lastThree = useMemo(() => {
    return orderedTransactions.slice(0, 3);
  }, [orderedTransactions]);

  return {
    transactions,
    lastThree,
  };
}
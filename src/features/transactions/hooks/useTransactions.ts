import { useEffect, useMemo } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { TransactionType } from "../types";

export function useTransactions(filter?: TransactionType) {
  const { transactions, loadTransactions } = useTransactionStore();

  useEffect(() => {
    loadTransactions();
  }, []);

  const orderedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions]);

  const filtered = useMemo(() => {
    if (!filter) return orderedTransactions;
    return orderedTransactions.filter((t) => t.type === filter);
  }, [filter, orderedTransactions]);

  const lastThree = useMemo(() => {
    return orderedTransactions.slice(0, 3);
  }, [orderedTransactions]);

  return {
    transactions: filtered,
    lastThree,
  };
}

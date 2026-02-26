import { create } from "zustand";

type BalanceState = {
  balance: number;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  setBalance: (value: number) => void;
};

export const useBalanceStore = create<BalanceState>()((set) => ({
  balance: 1000.0, // valor inicial mockado

  deposit: (amount: number) =>
    set((state) => ({
      balance: state.balance + amount,
    })),

  withdraw: (amount: number) =>
    set((state) => ({
      balance: state.balance - amount,
    })),

  setBalance: (value: number) =>
    set(() => ({
      balance: value,
    })),
}));

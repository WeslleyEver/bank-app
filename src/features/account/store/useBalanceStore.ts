import { create } from "zustand";

type BalanceState = {
  balance: number;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  setBalance: (value: number) => void;
};

/**
 * ------------------------------------------------------------------
 * Store: useBalanceStore
 * ------------------------------------------------------------------
 *
 * Responsabilidade:
 * Gerenciar o estado global do saldo da conta do usuário.
 *
 * Este store simula o saldo vindo de uma API.
 * No futuro, o valor inicial deverá vir do backend.
 *
 * Regras:
 * - Não contém lógica de UI.
 * - Não contém formatação.
 * - Apenas manipulação numérica do saldo.
 *
 * Funções:
 * - deposit(amount): adiciona valor ao saldo.
 * - withdraw(amount): remove valor do saldo.
 * - setBalance(value): substitui saldo (usado após resposta da API).
 *
 * Observação:
 * Em produção, a atualização do saldo deve vir
 * exclusivamente da resposta do backend.
 * ------------------------------------------------------------------
 */
export const useBalanceStore = create<BalanceState>()((set) => ({
  balance: 5000.0, // valor inicial mockado

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

/**
 * Store da feature SECURITY.
 *
 * Regras obrigatórias:
 * - NUNCA guarda PIN bruto, hash ou salt.
 * - A persistência (TASK 3) é a fonte da verdade do material.
 * - Esta store reflete apenas estado operacional e de UI.
 */

import { create } from "zustand";
import type { SecurityChallengeRequest } from "../types";
import type { SecurityErrorCodeType } from "../errors";
import type { SecurityState } from "../types";
import type { SecurityHydratePayload } from "./security.store.types";

const initialState: SecurityState = {
  hasPin: false,
  isPinValidated: false,
  failedAttempts: 0,
  isBlocked: false,
  blockUntil: null,
  currentChallenge: null,
  lastErrorCode: null,
};

type SecurityStoreActions = {
  /** Sincroniza store com dados derivados da persistência (sem hash/salt) */
  hydrateFromPersistence: (payload: SecurityHydratePayload) => void;
  /** Define o challenge em andamento */
  setCurrentChallenge: (challenge: SecurityChallengeRequest | null) => void;
  /** Registra código de erro tipado */
  setLastErrorCode: (code: SecurityErrorCodeType | null) => void;
  /** Marca se o challenge atual foi validado */
  setIsPinValidated: (value: boolean) => void;
  /** Atualiza contagem de tentativas (reflete persistência) */
  setFailedAttempts: (count: number) => void;
  /** Atualiza estado de bloqueio (reflete persistência) */
  setBlockState: (isBlocked: boolean, blockUntil: string | null) => void;
  /** Limpa estado local da store — NÃO limpa persistência */
  resetLocalState: () => void;
};

export type SecurityStore = SecurityState & SecurityStoreActions;

export const useSecurityStore = create<SecurityStore>()((set) => ({
  ...initialState,

  hydrateFromPersistence: (payload) =>
    set({
      hasPin: payload.hasPin,
      failedAttempts: payload.failedAttempts,
      isBlocked: payload.isBlocked,
      blockUntil: payload.blockUntil,
    }),

  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),

  setLastErrorCode: (code) => set({ lastErrorCode: code }),

  setIsPinValidated: (value) => set({ isPinValidated: value }),

  setFailedAttempts: (count) => set({ failedAttempts: count }),

  setBlockState: (isBlocked, blockUntil) =>
    set({ isBlocked, blockUntil }),

  resetLocalState: () => set(initialState),
}));

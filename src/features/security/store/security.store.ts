/**
 * Store da feature SECURITY.
 * Estado estrutural mínimo — sem segredo, sem lógica de validação.
 * Preparado para evolução nas tasks 4–7.
 */

import { create } from "zustand";
import type { SecurityState } from "../types";

const initialState: SecurityState = {
  hasPin: false,
  isPinValidated: false,
  failedAttempts: 0,
  isBlocked: false,
  blockUntil: null,
  currentChallenge: null,
  lastErrorCode: null,
};

export const useSecurityStore = create<SecurityState>(() => initialState);

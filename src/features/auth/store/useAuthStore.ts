/**
 * Store de autenticação.
 * Responsável por: session state, authenticated user, logout.
 * loadStoredSession usa sessionService.hydrateSession para obter usuário real via /me.
 */

import { create } from "zustand";
import type { AuthSession } from "../types/auth-session.types";
import { sessionService } from "../services/session.service";

type AuthState = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;

  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
  loadStoredSession: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  setSession: (session) =>
    set({
      session,
      isAuthenticated: !!session,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setInitialized: (isInitialized) => set({ isInitialized }),

  login: (session) =>
    set({
      session,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  logout: async () => {
    await sessionService.clearSession();
    set({
      session: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadStoredSession: async () => {
    const { accessToken, refreshToken } =
      await sessionService.loadStoredTokens();

    if (accessToken) {
      const session = await sessionService.hydrateSession(
        accessToken,
        refreshToken
      );
      if (session) {
        set({
          isInitialized: true,
          session,
          isAuthenticated: true,
        });
      } else {
        await sessionService.clearSession();
        set({ isInitialized: true, isAuthenticated: false });
      }
    } else {
      set({ isInitialized: true, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

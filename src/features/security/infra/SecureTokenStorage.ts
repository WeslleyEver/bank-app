/**
 * ------------------------------------------------------------------
 * Secure Token Storage
 * ------------------------------------------------------------------
 *
 * Abstração para armazenamento seguro de tokens (access/refresh).
 * Usa expo-secure-store quando disponível; fallback para AsyncStorage.
 *
 * Chaves isoladas por módulo de autenticação.
 * ------------------------------------------------------------------
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: "auth.accessToken",
  REFRESH_TOKEN: "auth.refreshToken",
} as const;

export interface TokenStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/** Interface pública do storage de tokens */
export interface SecureTokenStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(access: string, refresh: string): Promise<void>;
  clearTokens(): Promise<void>;
}

/** Implementação usando adapter (permite injetar SecureStore ou mock) */
export function createSecureTokenStorage(
  adapter: TokenStorageAdapter
): SecureTokenStorage {
  return {
    async getAccessToken() {
      return adapter.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    },
    async getRefreshToken() {
      return adapter.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    },
    async setTokens(access: string, refresh: string) {
      await Promise.all([
        adapter.setItem(TOKEN_KEYS.ACCESS_TOKEN, access),
        adapter.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh),
      ]);
    },
    async clearTokens() {
      await Promise.all([
        adapter.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
        adapter.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
      ]);
    },
  };
}

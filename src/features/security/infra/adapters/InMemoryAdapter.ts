/**
 * Adapter em memória para testes ou fallback quando SecureStore não está disponível.
 */

import type { TokenStorageAdapter } from "../SecureTokenStorage";

const storage = new Map<string, string>();

export const inMemoryAdapter: TokenStorageAdapter = {
  async getItem(key: string) {
    return storage.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    storage.set(key, value);
  },
  async removeItem(key: string) {
    storage.delete(key);
  },
};

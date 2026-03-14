/**
 * Adapter que usa expo-secure-store para armazenamento seguro.
 * Usado em produção para tokens de sessão.
 */

import type { TokenStorageAdapter } from "../SecureTokenStorage";

let secureStore: {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
} | null = null;

async function getSecureStore() {
  if (!secureStore) {
    const SecureStore = await import("expo-secure-store");
    secureStore = SecureStore;
  }
  return secureStore;
}

export const expoSecureStoreAdapter: TokenStorageAdapter = {
  async getItem(key: string) {
    const store = await getSecureStore();
    return store.getItemAsync(key);
  },

  async setItem(key: string, value: string) {
    const store = await getSecureStore();
    await store.setItemAsync(key, value);
  },

  async removeItem(key: string) {
    const store = await getSecureStore();
    await store.deleteItemAsync(key);
  },
};

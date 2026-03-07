/**
 * Adapter que usa expo-secure-store para armazenar tokens com segurança.
 * Chama import dinâmico para não quebrar se o pacote não estiver instalado.
 */

/**
 * Adapter que usa expo-secure-store para armazenar tokens com segurança.
 * Chama import dinâmico para não quebrar se o pacote não estiver instalado.
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

// import type { TokenStorageAdapter } from "../SecureTokenStorage";

// let secureStore: {
//   getItemAsync: (key: string) => Promise<string | null>;
//   setItemAsync: (key: string, value: string) => Promise<void>;
//   deleteItemAsync: (key: string) => Promise<void>;
// } | null = null;

// async function getSecureStore() {
//   if (!secureStore) {
//     const { default: SecureStore } = await import("expo-secure-store");
//     secureStore = SecureStore;
//   }
//   return secureStore;
// }

// export const expoSecureStoreAdapter: TokenStorageAdapter = {
//   async getItem(key: string) {
//     const store = await getSecureStore();
//     return store.getItemAsync(key);
//   },
//   async setItem(key: string, value: string) {
//     const store = await getSecureStore();
//     await store.setItemAsync(key, value);
//   },
//   async removeItem(key: string) {
//     const store = await getSecureStore();
//     await store.deleteItemAsync(key);
//   },
// };

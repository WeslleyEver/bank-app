/**
 * Infraestrutura de storage seguro de tokens de sessão.
 * Parte do módulo AUTH — AUTH é dono de access/refresh token.
 */

export { sessionTokenStorage } from "./sessionTokenStorage";
export { tokenStorage } from "./tokenStorageInstance";
export { createSecureTokenStorage } from "./SecureTokenStorage";
export type { SecureTokenStorage, TokenStorageAdapter } from "./SecureTokenStorage";
export { expoSecureStoreAdapter } from "./adapters/ExpoSecureStoreAdapter";
export { inMemoryAdapter } from "./adapters/InMemoryAdapter";

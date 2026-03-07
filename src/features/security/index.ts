/**
 * Módulo de segurança - Secure Token Storage
 *
 * Uso: importar tokenStorage ou secureStorageService
 *
 * Requer: npx expo install expo-secure-store
 * Para fallback em testes, use createSecureTokenStorage(inMemoryAdapter)
 */

export { tokenStorage } from "./infra/tokenStorageInstance";

export { createSecureTokenStorage } from "./infra/SecureTokenStorage";
export type { SecureTokenStorage, TokenStorageAdapter } from "./infra/SecureTokenStorage";
export { inMemoryAdapter } from "./infra/adapters/InMemoryAdapter";
export { secureStorageService } from "./services";

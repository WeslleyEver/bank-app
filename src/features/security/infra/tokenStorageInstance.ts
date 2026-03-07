/**
 * Instância do token storage.
 * Arquivo isolado para evitar dependência circular entre index e secure-storage.service.
 */

import { createSecureTokenStorage } from "./SecureTokenStorage";
import { expoSecureStoreAdapter } from "./adapters/ExpoSecureStoreAdapter";

export const tokenStorage = createSecureTokenStorage(expoSecureStoreAdapter);

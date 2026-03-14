/**
 * Instância do token storage para uso pela camada session do AUTH.
 */

import { createSecureTokenStorage } from "./SecureTokenStorage";
import { expoSecureStoreAdapter } from "./adapters/ExpoSecureStoreAdapter";

export const tokenStorage = createSecureTokenStorage(expoSecureStoreAdapter);

/**
 * Serviço de armazenamento seguro.
 * Encapsula SecureTokenStorage para uso pelo módulo de auth.
 * Armazena apenas access e refresh tokens.
 *
 * NUNCA armazena: PIN, OTP, facematch token.
 */

import { tokenStorage } from "../infra/tokenStorageInstance";

export const secureStorageService = {
  async getAccessToken(): Promise<string | null> {
    return tokenStorage.getAccessToken();
  },

  async getRefreshToken(): Promise<string | null> {
    return tokenStorage.getRefreshToken();
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await tokenStorage.setTokens(accessToken, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await tokenStorage.clearTokens();
  },
};

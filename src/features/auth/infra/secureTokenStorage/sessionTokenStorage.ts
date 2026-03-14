/**
 * Serviço de persistência de tokens de sessão.
 * Encapsula tokenStorage para uso pelo sessionStorage do módulo AUTH.
 *
 * Armazena access token, refresh token e expiresAt.
 * NUNCA armazena: PIN, OTP ou credenciais transacionais.
 */

import { tokenStorage } from "./tokenStorageInstance";

export const sessionTokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return tokenStorage.getAccessToken();
  },

  async getRefreshToken(): Promise<string | null> {
    return tokenStorage.getRefreshToken();
  },

  async getExpiresAt(): Promise<number | null> {
    return tokenStorage.getExpiresAt();
  },

  async setTokens(
    accessToken: string,
    refreshToken: string,
    expiresAt?: number
  ): Promise<void> {
    await tokenStorage.setTokens(accessToken, refreshToken, expiresAt);
  },

  async clearTokens(): Promise<void> {
    await tokenStorage.clearTokens();
  },
};

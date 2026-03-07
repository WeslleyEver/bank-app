/**
 * Serviço de gerenciamento de sessão.
 * Responsável por:
 * - Salvar tokens no storage seguro
 * - Limpar tokens no logout
 * - Carregar tokens armazenados
 * - Hidratar sessão via endpoint /me (usuário real)
 */

import { meApi } from "../api/auth.api";
import { mapApiUserToAuthenticatedUser } from "../mappers/session.mapper";
import { secureStorageService } from "@/src/features/security/services";
import type { AuthSession } from "../types/auth-session.types";

export const sessionService = {
  async persistSession(session: AuthSession): Promise<void> {
    await secureStorageService.setTokens(
      session.accessToken,
      session.refreshToken ?? ""
    );
  },

  async clearSession(): Promise<void> {
    await secureStorageService.clearTokens();
  },

  async loadStoredTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorageService.getAccessToken(),
      secureStorageService.getRefreshToken(),
    ]);
    return { accessToken, refreshToken };
  },

  /**
   * Hidrata sessão com usuário real via GET /auth/me.
   * Usado após login ou ao reabrir app com token salvo.
   */
  async hydrateSession(
    accessToken: string,
    refreshToken: string | null
  ): Promise<AuthSession | null> {
    try {
      const apiUser = await meApi(accessToken);
      const user = mapApiUserToAuthenticatedUser(apiUser);
      return {
        accessToken,
        refreshToken: refreshToken ?? undefined,
        user,
      };
    } catch {
      return null;
    }
  },
};

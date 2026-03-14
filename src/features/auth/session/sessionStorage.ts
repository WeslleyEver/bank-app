/**
 * Camada de persistência de tokens.
 * Encapsula operações de storage seguro.
 * Usa a infraestrutura própria do módulo AUTH (AUTH é dono de tokens de sessão).
 */

import { sessionTokenStorage } from "../infra/secureTokenStorage";
import type { StoredTokens, TokensPayload } from "./session.types";

export const sessionStorage = {
  /**
   * Salva tokens no storage seguro.
   * @param tokens Objeto com accessToken, refreshToken e expiresAt opcional.
   */
  async saveTokens(tokens: TokensPayload): Promise<void> {
    await sessionTokenStorage.setTokens(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresAt
    );
  },

  /**
   * Recupera tokens do storage seguro.
   * @returns Objeto com accessToken, refreshToken e expiresAt (podem ser null/undefined).
   */
  async getTokens(): Promise<StoredTokens> {
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      sessionTokenStorage.getAccessToken(),
      sessionTokenStorage.getRefreshToken(),
      sessionTokenStorage.getExpiresAt(),
    ]);
    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt ?? undefined,
    };
  },

  /**
   * Remove todos os tokens do storage.
   */
  async clearTokens(): Promise<void> {
    await sessionTokenStorage.clearTokens();
  },

  /**
   * Verifica se existem tokens armazenados.
   * @returns true se accessToken existe.
   */
  async hasStoredTokens(): Promise<boolean> {
    const { accessToken } = await this.getTokens();
    return !!accessToken;
  },
};

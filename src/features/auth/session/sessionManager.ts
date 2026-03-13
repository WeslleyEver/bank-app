/**
 * Orquestrador principal da camada session.
 * Ponto único de entrada para gerenciar sessão do usuário.
 * Coordena operações entre storage e hydrator.
 *
 * Regras:
 * - clear() SEMPRE limpa sessão local, mesmo se API falhar
 * - restore() retorna resultado tipado, nunca null diretamente
 * - Compatível com mocks via authDataSourceFactory
 */

import { authDataSourceFactory } from "../data/datasources/authDataSourceFactory";
import type { AuthSession } from "../types/auth-session.types";
import type {
  TokensPayload,
  SessionRestoreResult,
  SessionClearResult,
  SessionErrorCode,
} from "./session.types";
import { sessionStorage } from "./sessionStorage";
import { sessionHydrator } from "./sessionHydrator";
import { isSessionExpired } from "./sessionExpirationService";
import { authLogger } from "../observability/authLogger";

export const sessionManager = {
  /**
   * Persiste sessão no storage seguro.
   * Chamado após login bem-sucedido.
   *
   * @param session Sessão autenticada com tokens e usuário.
   */
  async persist(session: AuthSession): Promise<void> {
    const tokens: TokensPayload = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? "",
      expiresAt: session.expiresAt,
    };
    await sessionStorage.saveTokens(tokens);
  },

  /**
   * Limpa sessão completamente.
   * SEMPRE limpa storage local, mesmo se logout na API falhar.
   * Isso garante que o usuário não fique preso em estado inconsistente.
   *
   * @returns Resultado com status do logout na API e limpeza local.
   */
  async clear(): Promise<SessionClearResult> {
    authLogger.info("session.clear.started");

    let apiLogoutSuccess = true;

    try {
      const dataSource = authDataSourceFactory();
      await dataSource.logout();
    } catch (error) {
      apiLogoutSuccess = false;
    }

    try {
      await sessionStorage.clearTokens();
    } catch (error) {
      authLogger.error("session.clear.failed", { code: "STORAGE_ERROR" });
      return {
        success: false,
        apiLogoutSuccess,
        error: {
          code: "STORAGE_ERROR" as SessionErrorCode,
          message: "Falha ao limpar tokens do storage.",
          originalError: error,
        },
      };
    }

    authLogger.info("session.clear.completed", { apiLogoutSuccess });
    return {
      success: true,
      apiLogoutSuccess,
    };
  },

  /**
   * Aplica tokens renovados após refresh bem-sucedido.
   * Centraliza persistência de tokens; não requer sessão completa (sem user).
   *
   * @param tokens Tokens retornados pelo refresh (accessToken, refreshToken, expiresAt?).
   */
  async applyRefreshedTokens(tokens: TokensPayload): Promise<void> {
    await sessionStorage.saveTokens(tokens);
    authLogger.info("session.tokens_applied");
  },

  /**
   * Restaura sessão a partir de tokens armazenados.
   * Carrega tokens do storage e hidrata com dados do usuário via /me.
   *
   * @returns Resultado tipado com session ou erro específico.
   */
  async restore(): Promise<SessionRestoreResult> {
    authLogger.info("session.restore.started");

    const tokens = await sessionStorage.getTokens();

    if (!tokens.accessToken) {
      authLogger.warn("session.restore.failed", { code: "NO_STORED_TOKENS" });
      return {
        success: false,
        session: null,
        error: {
          code: "NO_STORED_TOKENS" as SessionErrorCode,
          message: "Nenhum token armazenado encontrado.",
        },
      };
    }

    if (isSessionExpired(tokens)) {
      authLogger.warn("session.restore.failed", { code: "TOKEN_EXPIRED" });
      await sessionStorage.clearTokens();
      return {
        success: false,
        session: null,
        error: {
          code: "TOKEN_EXPIRED" as SessionErrorCode,
          message: "Sessão expirada.",
        },
      };
    }

    const hydrateResult = await sessionHydrator.hydrate(tokens);

    if (!hydrateResult.success) {
      authLogger.warn("session.restore.failed", {
        code: hydrateResult.error?.code ?? "HYDRATION_FAILED",
      });
      await sessionStorage.clearTokens();
      return {
        success: false,
        session: null,
        error: hydrateResult.error,
      };
    }

    authLogger.info("session.restore.completed");
    return {
      success: true,
      session: hydrateResult.session,
    };
  },

  /**
   * Retorna tokens armazenados.
   * Útil para verificações rápidas sem hidratar.
   */
  async getStoredTokens() {
    return sessionStorage.getTokens();
  },

  /**
   * Verifica se existem tokens armazenados.
   */
  async hasStoredSession(): Promise<boolean> {
    return sessionStorage.hasStoredTokens();
  },
};

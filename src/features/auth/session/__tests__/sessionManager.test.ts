/**
 * Testes do sessionManager.
 * Cobre restore, clear e applyRefreshedTokens com mocks de dependências.
 */

import type { AuthSession } from "../../types/auth-session.types";
import type { StoredTokens, TokensPayload, SessionHydrateResult } from "../session.types";

const mockGetTokens = jest.fn();
const mockSaveTokens = jest.fn();
const mockClearTokens = jest.fn();
const mockHydrate = jest.fn();
const mockLogout = jest.fn();
const mockIsSessionExpired = jest.fn();

jest.mock("../sessionStorage", () => ({
  sessionStorage: {
    getTokens: (...args: unknown[]) => mockGetTokens(...args),
    saveTokens: (...args: unknown[]) => mockSaveTokens(...args),
    clearTokens: (...args: unknown[]) => mockClearTokens(...args),
  },
}));

jest.mock("../sessionHydrator", () => ({
  sessionHydrator: {
    hydrate: (...args: unknown[]) => mockHydrate(...args),
  },
}));

jest.mock("../../data/datasources/authDataSourceFactory", () => ({
  authDataSourceFactory: () => ({
    logout: mockLogout,
  }),
}));

jest.mock("../sessionExpirationService", () => ({
  isSessionExpired: (...args: unknown[]) => mockIsSessionExpired(...args),
}));

jest.mock("../../observability/authLogger", () => ({
  authLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { sessionManager } from "../sessionManager";

const MOCK_USER = {
  id: "user-1",
  nome: "Usuário Teste",
  email: "teste@test.com",
  documento: "11111111111",
  tipoConta: "PF" as const,
  onboardingStatus: "aprovado" as const,
};

const MOCK_SESSION: AuthSession = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  user: MOCK_USER,
};

const MOCK_TOKENS: StoredTokens = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockClearTokens.mockResolvedValue(undefined);
  mockSaveTokens.mockResolvedValue(undefined);
  mockLogout.mockResolvedValue(undefined);
});

describe("sessionManager.restore", () => {
  it("retorna NO_STORED_TOKENS quando não há tokens armazenados", async () => {
    mockGetTokens.mockResolvedValue({ accessToken: null, refreshToken: null });

    const result = await sessionManager.restore();

    expect(result.success).toBe(false);
    expect(result.session).toBeNull();
    expect(result.error?.code).toBe("NO_STORED_TOKENS");
    expect(mockHydrate).not.toHaveBeenCalled();
  });

  it("retorna TOKEN_EXPIRED quando token está expirado e limpa o storage", async () => {
    mockGetTokens.mockResolvedValue({
      ...MOCK_TOKENS,
      expiresAt: Date.now() - 1000,
    });
    mockIsSessionExpired.mockReturnValue(true);

    const result = await sessionManager.restore();

    expect(result.success).toBe(false);
    expect(result.session).toBeNull();
    expect(result.error?.code).toBe("TOKEN_EXPIRED");
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
    expect(mockHydrate).not.toHaveBeenCalled();
  });

  it("retorna HYDRATION_FAILED quando hidratação falha e limpa o storage", async () => {
    mockGetTokens.mockResolvedValue(MOCK_TOKENS);
    mockIsSessionExpired.mockReturnValue(false);
    mockHydrate.mockResolvedValue({
      success: false,
      session: null,
      error: { code: "HYDRATION_FAILED", message: "Falha ao hidratar." },
    } satisfies SessionHydrateResult);

    const result = await sessionManager.restore();

    expect(result.success).toBe(false);
    expect(result.session).toBeNull();
    expect(result.error?.code).toBe("HYDRATION_FAILED");
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
    expect(mockHydrate).toHaveBeenCalledWith(MOCK_TOKENS);
  });

  it("retorna sucesso com sessão populada quando tokens são válidos", async () => {
    mockGetTokens.mockResolvedValue(MOCK_TOKENS);
    mockIsSessionExpired.mockReturnValue(false);
    mockHydrate.mockResolvedValue({
      success: true,
      session: MOCK_SESSION,
    } satisfies SessionHydrateResult);

    const result = await sessionManager.restore();

    expect(result.success).toBe(true);
    expect(result.session).toEqual(MOCK_SESSION);
    expect(result.error).toBeUndefined();
    expect(mockHydrate).toHaveBeenCalledWith(MOCK_TOKENS);
    expect(mockClearTokens).not.toHaveBeenCalled();
  });
});

describe("sessionManager.clear", () => {
  it("retorna success com apiLogoutSuccess true quando tudo funciona", async () => {
    mockLogout.mockResolvedValue(undefined);
    mockClearTokens.mockResolvedValue(undefined);

    const result = await sessionManager.clear();

    expect(result.success).toBe(true);
    expect(result.apiLogoutSuccess).toBe(true);
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
  });

  it("ainda limpa o storage e retorna success mesmo quando logout da API falha", async () => {
    mockLogout.mockRejectedValue(new Error("API error"));
    mockClearTokens.mockResolvedValue(undefined);

    const result = await sessionManager.clear();

    expect(result.success).toBe(true);
    expect(result.apiLogoutSuccess).toBe(false);
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
  });

  it("retorna success false com STORAGE_ERROR quando clearTokens falha", async () => {
    mockLogout.mockResolvedValue(undefined);
    mockClearTokens.mockRejectedValue(new Error("Storage error"));

    const result = await sessionManager.clear();

    expect(result.success).toBe(false);
    expect(result.apiLogoutSuccess).toBe(true);
    expect(result.error?.code).toBe("STORAGE_ERROR");
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
  });

  it("retorna apiLogoutSuccess false quando logout falha e storage também falha", async () => {
    mockLogout.mockRejectedValue(new Error("API error"));
    mockClearTokens.mockRejectedValue(new Error("Storage error"));

    const result = await sessionManager.clear();

    expect(result.success).toBe(false);
    expect(result.apiLogoutSuccess).toBe(false);
    expect(result.error?.code).toBe("STORAGE_ERROR");
  });
});

describe("sessionManager.applyRefreshedTokens", () => {
  it("persiste tokens renovados chamando saveTokens com o payload correto", async () => {
    const tokens: TokensPayload = {
      accessToken: "new-access",
      refreshToken: "new-refresh",
      expiresAt: Date.now() + 3600000,
    };

    await sessionManager.applyRefreshedTokens(tokens);

    expect(mockSaveTokens).toHaveBeenCalledTimes(1);
    expect(mockSaveTokens).toHaveBeenCalledWith(tokens);
  });
});

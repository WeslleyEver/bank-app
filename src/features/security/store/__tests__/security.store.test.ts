/**
 * Testes da store SECURITY (TASK 4).
 * Garante que nenhum segredo é salvo e que o estado é previsível.
 */

import { useSecurityStore } from "../security.store";
import { hydrateSecurityStore } from "../../services/hydrateSecurityStore";
import { clearSecurityState } from "../../services/clearSecurityState";
import { SecurityErrorCode } from "../../errors";

jest.mock("../../infra/pinStorage", () => ({
  readPinMaterial: jest.fn(),
}));

import { readPinMaterial } from "../../infra/pinStorage";

const mockReadPinMaterial = readPinMaterial as jest.MockedFunction<
  typeof readPinMaterial
>;

beforeEach(() => {
  useSecurityStore.getState().resetLocalState();
  mockReadPinMaterial.mockReset();
});

describe("security.store — Estado inicial", () => {
  it("estado inicial está correto", () => {
    const state = useSecurityStore.getState();

    expect(state.hasPin).toBe(false);
    expect(state.isPinValidated).toBe(false);
    expect(state.failedAttempts).toBe(0);
    expect(state.isBlocked).toBe(false);
    expect(state.blockUntil).toBeNull();
    expect(state.currentChallenge).toBeNull();
    expect(state.lastErrorCode).toBeNull();
  });
});

describe("security.store — Hidratação", () => {
  it("hidrata com material inexistente", async () => {
    mockReadPinMaterial.mockResolvedValue({ success: true, data: null });

    await hydrateSecurityStore("account-1");

    const state = useSecurityStore.getState();
    expect(state.hasPin).toBe(false);
    expect(state.failedAttempts).toBe(0);
    expect(state.isBlocked).toBe(false);
    expect(state.blockUntil).toBeNull();
  });

  it("hidrata com material existente", async () => {
    mockReadPinMaterial.mockResolvedValue({
      success: true,
      data: {
        hash: "hashed",
        salt: "salt",
        algorithmVersion: 1,
        metadata: {
          failedAttempts: 2,
          blockUntil: null,
          createdAt: new Date().toISOString(),
        },
      },
    });

    await hydrateSecurityStore("account-2");

    const state = useSecurityStore.getState();
    expect(state.hasPin).toBe(true);
    expect(state.failedAttempts).toBe(2);
    expect(state.isBlocked).toBe(false);
    expect(state.blockUntil).toBeNull();
  });

  it("hidrata com bloqueio ativo", async () => {
    const futureDate = new Date(Date.now() + 60000).toISOString();
    mockReadPinMaterial.mockResolvedValue({
      success: true,
      data: {
        hash: "h",
        salt: "s",
        algorithmVersion: 1,
        metadata: {
          failedAttempts: 3,
          blockUntil: futureDate,
          createdAt: new Date().toISOString(),
        },
      },
    });

    await hydrateSecurityStore("account-3");

    const state = useSecurityStore.getState();
    expect(state.hasPin).toBe(true);
    expect(state.failedAttempts).toBe(3);
    expect(state.isBlocked).toBe(true);
    expect(state.blockUntil).toBe(futureDate);
  });

  it("não extrai hash ou salt para a store", async () => {
    const material = {
      hash: "secret-hash",
      salt: "secret-salt",
      algorithmVersion: 1,
      metadata: {
        failedAttempts: 0,
        blockUntil: null,
        createdAt: new Date().toISOString(),
      },
    };
    mockReadPinMaterial.mockResolvedValue({ success: true, data: material });

    await hydrateSecurityStore("account-4");

    const state = useSecurityStore.getState();
    expect(state).not.toHaveProperty("hash");
    expect(state).not.toHaveProperty("salt");
    expect((state as Record<string, unknown>).hash).toBeUndefined();
    expect((state as Record<string, unknown>).salt).toBeUndefined();
  });
});

describe("security.store — Atualizações", () => {
  it("atualiza hasPin via hidratação", async () => {
    mockReadPinMaterial.mockResolvedValue({
      success: true,
      data: {
        hash: "h",
        salt: "s",
        algorithmVersion: 1,
        metadata: {
          failedAttempts: 0,
          blockUntil: null,
          createdAt: new Date().toISOString(),
        },
      },
    });

    await hydrateSecurityStore("acc");
    expect(useSecurityStore.getState().hasPin).toBe(true);
  });

  it("atualiza failedAttempts via ação", () => {
    useSecurityStore.getState().setFailedAttempts(3);
    expect(useSecurityStore.getState().failedAttempts).toBe(3);
  });

  it("atualiza isBlocked e blockUntil via ação", () => {
    const until = "2026-12-31T23:59:59.000Z";
    useSecurityStore.getState().setBlockState(true, until);
    expect(useSecurityStore.getState().isBlocked).toBe(true);
    expect(useSecurityStore.getState().blockUntil).toBe(until);
  });

  it("define e limpa currentChallenge", () => {
    const challenge = { type: "PIX_TRANSFER" as const };
    useSecurityStore.getState().setCurrentChallenge(challenge);
    expect(useSecurityStore.getState().currentChallenge).toEqual(challenge);

    useSecurityStore.getState().setCurrentChallenge(null);
    expect(useSecurityStore.getState().currentChallenge).toBeNull();
  });

  it("define e limpa lastErrorCode", () => {
    useSecurityStore.getState().setLastErrorCode(SecurityErrorCode.PIN_INVALID);
    expect(useSecurityStore.getState().lastErrorCode).toBe(
      SecurityErrorCode.PIN_INVALID
    );

    useSecurityStore.getState().setLastErrorCode(null);
    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });

  it("atualiza isPinValidated", () => {
    useSecurityStore.getState().setIsPinValidated(true);
    expect(useSecurityStore.getState().isPinValidated).toBe(true);
  });
});

describe("security.store — Reset local", () => {
  it("resetLocalState limpa estado sem tocar persistência", () => {
    useSecurityStore.getState().setFailedAttempts(2);
    useSecurityStore.getState().setLastErrorCode(SecurityErrorCode.PIN_BLOCKED);
    useSecurityStore.getState().setCurrentChallenge({
      type: "PIX_TRANSFER",
    });

    useSecurityStore.getState().resetLocalState();

    const state = useSecurityStore.getState();
    expect(state.failedAttempts).toBe(0);
    expect(state.lastErrorCode).toBeNull();
    expect(state.currentChallenge).toBeNull();
  });
});

describe("security.store — clearSecurityState", () => {
  it("clearLocalStore reseta estado local", async () => {
    useSecurityStore.getState().setFailedAttempts(1);

    await clearSecurityState({ clearLocalStore: true });

    expect(useSecurityStore.getState().failedAttempts).toBe(0);
  });
});

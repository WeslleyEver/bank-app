/**
 * Testes do fluxo de criação de PIN (TASK 5).
 * Cobre: validação, confirmação, persistência após confirmação, store, erros técnicos.
 */

const mockStore = new Map<string, string>();
let mockStorageShouldThrow = false;

jest.mock("../../infra/pinStorage/pinSecureStoreAdapter", () => ({
  pinSecureStoreAdapter: {
    getItem: (accountId: string) =>
      Promise.resolve(mockStore.get(`security.pin.material.${accountId}`) ?? null),
    setItem: async (accountId: string, value: string) => {
      if (mockStorageShouldThrow) throw new Error("Storage fail");
      mockStore.set(`security.pin.material.${accountId}`, value);
    },
    removeItem: (accountId: string) => {
      mockStore.delete(`security.pin.material.${accountId}`);
      return Promise.resolve();
    },
  },
}));

jest.mock("expo-crypto", () => ({
  getRandomBytesAsync: jest.fn(() =>
    Promise.resolve(new Uint8Array(32).fill(0x41))
  ),
  digestStringAsync: jest.fn((_algo: string, data: string) =>
    Promise.resolve("abc123hash456")
  ),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

import { setupPin } from "../setupPin.service";
import { useSecurityStore } from "../../store";
import { SecurityErrorCode } from "../../errors";
import { hasPinForAccount } from "../../infra/pinStorage";

beforeEach(() => {
  mockStore.clear();
  mockStorageShouldThrow = false;
  useSecurityStore.getState().resetLocalState();
});

describe("setupPin — Validação", () => {
  it("retorna sucesso quando PIN e confirmação são válidos e iguais", async () => {
    const result = await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });

    expect(result.success).toBe(true);
  });

  it("retorna PIN_CONFIRMATION_MISMATCH quando confirmação diverge", async () => {
    const result = await setupPin({
      pin: "123456",
      confirmation: "654321",
      accountId: "acc-1",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.PIN_CONFIRMATION_MISMATCH
    );
  });

  it("retorna PIN_FORMAT_INVALID para PIN com menos de 6 dígitos", async () => {
    const result = await setupPin({
      pin: "12345",
      confirmation: "12345",
      accountId: "acc-1",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.PIN_FORMAT_INVALID
    );
  });

  it("retorna PIN_FORMAT_INVALID para PIN com caracteres não numéricos", async () => {
    const result = await setupPin({
      pin: "12345a",
      confirmation: "12345a",
      accountId: "acc-1",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.PIN_FORMAT_INVALID
    );
  });

  it("retorna PIN_FORMAT_INVALID para confirmação com formato inválido", async () => {
    const result = await setupPin({
      pin: "123456",
      confirmation: "12345",
      accountId: "acc-1",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.PIN_FORMAT_INVALID
    );
  });
});

describe("setupPin — Persistência", () => {
  it("persiste apenas após confirmação bem-sucedida", async () => {
    const accountId = "acc-persist";

    const failResult = await setupPin({
      pin: "123456",
      confirmation: "654321",
      accountId,
    });
    expect(failResult.success).toBe(false);
    expect(await hasPinForAccount(accountId)).toBe(false);

    const successResult = await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId,
    });
    expect(successResult.success).toBe(true);
    expect(await hasPinForAccount(accountId)).toBe(true);
  });

  it("nunca persiste PIN em texto puro", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-raw",
    });

    const raw = mockStore.get("security.pin.material.acc-raw");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.pin).toBeUndefined();
    expect(parsed).not.toHaveProperty("pin");
  });
});

describe("setupPin — Store", () => {
  it("atualiza hasPin para true após sucesso", async () => {
    const accountId = "acc-store";

    expect(useSecurityStore.getState().hasPin).toBe(false);

    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId,
    });

    expect(useSecurityStore.getState().hasPin).toBe(true);
  });

  it("não guarda PIN bruto na store", async () => {
    const state = useSecurityStore.getState();
    const keys = Object.keys(state);
    expect(keys).not.toContain("pin");
    expect(keys).not.toContain("pinRaw");
    expect(keys).not.toContain("confirmation");
    expect(keys).not.toContain("rawPin");
  });

  it("metadados iniciais coerentes após setup (failedAttempts 0, não bloqueado)", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-meta",
    });

    expect(useSecurityStore.getState().failedAttempts).toBe(0);
    expect(useSecurityStore.getState().isBlocked).toBe(false);
    expect(useSecurityStore.getState().blockUntil).toBeNull();
  });

  it("limpa lastErrorCode após sucesso", async () => {
    useSecurityStore.getState().setLastErrorCode(SecurityErrorCode.PIN_INVALID);
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-err",
    });

    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });
});

describe("setupPin — Falha técnica", () => {
  it("retorna STORAGE_WRITE_FAILED quando persistência falha", async () => {
    mockStorageShouldThrow = true;

    const result = await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-fail",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.STORAGE_WRITE_FAILED
    );
  });

  it("não converte falha de persistência em PIN_INVALID", async () => {
    mockStorageShouldThrow = true;

    const result = await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-fail",
    });

    expect(result.success === false && result.errorCode).not.toBe(
      SecurityErrorCode.PIN_INVALID
    );
    expect(result.success === false && result.errorCode).toBe(
      SecurityErrorCode.STORAGE_WRITE_FAILED
    );
  });
});

/**
 * Testes do fluxo de validação de PIN (TASK 6).
 */

const mockStore = new Map<string, string>();
let mockStorageReadShouldThrow = false;
let mockStorageWriteShouldThrow = false;

jest.mock("../../infra/pinStorage/pinSecureStoreAdapter", () => ({
  pinSecureStoreAdapter: {
    getItem: async (accountId: string) => {
      if (mockStorageReadShouldThrow) throw new Error("Storage read fail");
      return mockStore.get(`security.pin.material.${accountId}`) ?? null;
    },
    setItem: async (accountId: string, value: string) => {
      if (mockStorageWriteShouldThrow) throw new Error("Storage write fail");
      mockStore.set(`security.pin.material.${accountId}`, value);
    },
    removeItem: (accountId: string) => {
      mockStore.delete(`security.pin.material.${accountId}`);
      return Promise.resolve();
    },
  },
}));

const CORRECT_HASH = "stored-hash-123";
const WRONG_HASH = "wrong-hash";

jest.mock("expo-crypto", () => ({
  getRandomBytesAsync: jest.fn(() =>
    Promise.resolve(new Uint8Array(32).fill(0x41))
  ),
  digestStringAsync: jest.fn((_algo: string, data: string) => {
    if (data === CORRECT_HASH || (data.length > 10 && data.endsWith("123456"))) {
      return Promise.resolve(CORRECT_HASH);
    }
    return Promise.resolve(WRONG_HASH);
  }),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

import { validatePin } from "../validatePin.service";
import { setupPin } from "../setupPin.service";
import { useSecurityStore } from "../../store";
import { SecurityErrorCode } from "../../errors";

beforeEach(() => {
  mockStore.clear();
  mockStorageReadShouldThrow = false;
  mockStorageWriteShouldThrow = false;
  useSecurityStore.getState().resetLocalState();
});

describe("validatePin — Sucesso", () => {
  it("retorna validated quando PIN está correto", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const result = await validatePin({ pin: "123456", accountId: "acc-1" });
    expect(result.status).toBe("validated");
  });

  it("reseta tentativas e bloqueio após sucesso", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-2",
    });
    await validatePin({ pin: "000000", accountId: "acc-2" });
    await validatePin({ pin: "000000", accountId: "acc-2" });
    const successResult = await validatePin({ pin: "123456", accountId: "acc-2" });
    expect(successResult.status).toBe("validated");
    expect(useSecurityStore.getState().failedAttempts).toBe(0);
    expect(useSecurityStore.getState().isBlocked).toBe(false);
    expect(useSecurityStore.getState().blockUntil).toBeNull();
  });

  it("atualiza isPinValidated e lastErrorCode após sucesso", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-s",
    });
    useSecurityStore.getState().setLastErrorCode(SecurityErrorCode.PIN_INVALID);
    await validatePin({ pin: "123456", accountId: "acc-s" });
    expect(useSecurityStore.getState().isPinValidated).toBe(true);
    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });
});

describe("validatePin — not_configured", () => {
  it("retorna not_configured quando não há material persistido", async () => {
    const result = await validatePin({ pin: "123456", accountId: "acc-none" });
    expect(result.status).toBe("not_configured");
    expect("errorCode" in result && result.errorCode).toBe(
      SecurityErrorCode.PIN_NOT_CONFIGURED
    );
  });
});

describe("validatePin — Formato", () => {
  it("retorna unavailable com PIN_FORMAT_INVALID para formato inválido", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-fmt",
    });
    const result = await validatePin({ pin: "12345", accountId: "acc-fmt" });
    expect(result.status).toBe("unavailable");
    expect("errorCode" in result && result.errorCode).toBe(
      SecurityErrorCode.PIN_FORMAT_INVALID
    );
  });

  it("formato inválido não incrementa tentativas", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-fmt2",
    });
    await validatePin({ pin: "12", accountId: "acc-fmt2" });
    const read = mockStore.get("security.pin.material.acc-fmt2");
    const parsed = read ? JSON.parse(read) : null;
    expect(parsed?.metadata?.failedAttempts).toBe(0);
  });
});

describe("validatePin — PIN incorreto e tentativas", () => {
  it("incrementa tentativas ao falhar com PIN incorreto", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-inv",
    });
    const r1 = await validatePin({ pin: "000000", accountId: "acc-inv" });
    expect(r1.status).toBe("invalid");
    expect("remainingAttempts" in r1 && r1.remainingAttempts).toBe(2);
    const r2 = await validatePin({ pin: "000000", accountId: "acc-inv" });
    expect(r2.status).toBe("invalid");
    expect("remainingAttempts" in r2 && r2.remainingAttempts).toBe(1);
  });

  it("retorna blocked ao atingir limite de tentativas", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-block",
    });
    await validatePin({ pin: "000000", accountId: "acc-block" });
    await validatePin({ pin: "000000", accountId: "acc-block" });
    const r3 = await validatePin({ pin: "000000", accountId: "acc-block" });
    expect(r3.status).toBe("blocked");
    expect("blockUntil" in r3 && r3.blockUntil).toBeDefined();
  });

  it("permite nova tentativa após expiração do bloqueio", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-exp",
    });
    await validatePin({ pin: "000000", accountId: "acc-exp" });
    await validatePin({ pin: "000000", accountId: "acc-exp" });
    await validatePin({ pin: "000000", accountId: "acc-exp" });
    const blockedResult = await validatePin({ pin: "123456", accountId: "acc-exp" });
    expect(blockedResult.status).toBe("blocked");
    const blockUntil = "blockUntil" in blockedResult ? blockedResult.blockUntil : null;
    expect(blockUntil).toBeTruthy();
    const pastBlockUntil = new Date(Date.now() - 60_000).toISOString();
    const raw = mockStore.get("security.pin.material.acc-exp");
    const parsed = raw ? JSON.parse(raw) : null;
    parsed.metadata.blockUntil = pastBlockUntil;
    mockStore.set("security.pin.material.acc-exp", JSON.stringify(parsed));
    const successResult = await validatePin({ pin: "123456", accountId: "acc-exp" });
    expect(successResult.status).toBe("validated");
  });

  it("retorna blocked quando bloqueio está ativo", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-b",
    });
    await validatePin({ pin: "000000", accountId: "acc-b" });
    await validatePin({ pin: "000000", accountId: "acc-b" });
    await validatePin({ pin: "000000", accountId: "acc-b" });
    const result = await validatePin({ pin: "123456", accountId: "acc-b" });
    expect(result.status).toBe("blocked");
  });
});

describe("validatePin — Erro técnico", () => {
  it("retorna unavailable quando leitura falha", async () => {
    mockStorageReadShouldThrow = true;
    const result = await validatePin({ pin: "123456", accountId: "acc-read" });
    expect(result.status).toBe("unavailable");
    expect("errorCode" in result && result.errorCode).toBe(
      SecurityErrorCode.STORAGE_READ_FAILED
    );
  });

  it("erro de leitura não é tratado como invalid", async () => {
    mockStorageReadShouldThrow = true;
    const result = await validatePin({ pin: "123456", accountId: "acc-r" });
    expect(result.status).not.toBe("invalid");
    expect(result.status).toBe("unavailable");
  });

  it("retorna unavailable quando escrita de metadados falha após PIN incorreto", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-w",
    });
    mockStorageWriteShouldThrow = true;
    const result = await validatePin({ pin: "000000", accountId: "acc-w" });
    expect(result.status).toBe("unavailable");
  });

  it("erro técnico de escrita não incrementa tentativas na persistência", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-w2",
    });
    mockStorageWriteShouldThrow = true;
    await validatePin({ pin: "000000", accountId: "acc-w2" });
    mockStorageWriteShouldThrow = false;
    const successResult = await validatePin({ pin: "123456", accountId: "acc-w2" });
    expect(successResult.status).toBe("validated");
  });
});

describe("validatePin — Store e segredo", () => {
  it("store não guarda PIN bruto", () => {
    const state = useSecurityStore.getState();
    const keys = Object.keys(state);
    expect(keys).not.toContain("pin");
    expect(keys).not.toContain("pinRaw");
    expect(keys).not.toContain("confirmation");
  });
});

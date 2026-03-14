/**
 * Testes da integração Pix + SECURITY (TASK 8).
 * Garante que Pix só executa após authorized.
 */

const mockStore = new Map<string, string>();
let sendPixCalled = false;
let sendPixArgs: { to: string; amount: number } | null = null;

jest.mock("../../../security/infra/pinStorage/pinSecureStoreAdapter", () => ({
  pinSecureStoreAdapter: {
    getItem: (accountId: string) =>
      Promise.resolve(mockStore.get(`security.pin.material.${accountId}`) ?? null),
    setItem: (accountId: string, value: string) => {
      mockStore.set(`security.pin.material.${accountId}`, value);
      return Promise.resolve();
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
  digestStringAsync: jest.fn((_algo: string, data: string) => {
    const CORRECT = "stored-hash-123";
    if (data === CORRECT || (data.length > 10 && data.endsWith("123456"))) {
      return Promise.resolve(CORRECT);
    }
    return Promise.resolve("wrong-hash");
  }),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

jest.mock("../sendPix.useCase", () => ({
  sendPixUseCase: jest.fn(async (to: string, amount: number) => {
    sendPixCalled = true;
    sendPixArgs = { to, amount };
  }),
}));

import {
  resolveTransactionalChallenge,
  cancelTransactionalChallenge,
} from "@/src/features/security/services/requestTransactionalChallenge";
import { setupPin } from "@/src/features/security/services/setupPin.service";
import { useSecurityStore } from "@/src/features/security/store";
import {
  sendPixWithSecurityChallengeUseCase,
} from "../sendPixWithSecurityChallengeUseCase";

beforeEach(() => {
  mockStore.clear();
  sendPixCalled = false;
  sendPixArgs = null;
  useSecurityStore.getState().resetLocalState();
});

async function waitForChallenge() {
  while (!useSecurityStore.getState().currentChallenge) {
    await new Promise((r) => setImmediate(r));
  }
}

describe("sendPixWithSecurityChallengeUseCase — authorized", () => {
  it("executa Pix somente após authorized", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });

    const resultPromise = sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-1",
    });

    await waitForChallenge();
    await resolveTransactionalChallenge("123456", "acc-1");
    const result = await resultPromise;

    expect(result.success).toBe(true);
    expect(sendPixCalled).toBe(true);
    expect(sendPixArgs).toEqual({ to: "chave@email.com", amount: 100 });
  });
});

describe("sendPixWithSecurityChallengeUseCase — não executa", () => {
  it("não executa após denied", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });

    const resultPromise = sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-1",
    });

    await waitForChallenge();
    await resolveTransactionalChallenge("000000", "acc-1");
    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.success === false && result.challengeResult.status).toBe("denied");
    expect(sendPixCalled).toBe(false);
  });

  it("não executa após blocked", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const raw = mockStore.get("security.pin.material.acc-1");
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed) {
      parsed.metadata.blockUntil = new Date(Date.now() + 60_000).toISOString();
      mockStore.set("security.pin.material.acc-1", JSON.stringify(parsed));
    }

    const result = await sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-1",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.challengeResult.status).toBe("blocked");
    expect(sendPixCalled).toBe(false);
  });

  it("não executa após cancelled", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });

    const resultPromise = sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-1",
    });

    await waitForChallenge();
    cancelTransactionalChallenge();
    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.success === false && result.challengeResult.status).toBe("cancelled");
    expect(sendPixCalled).toBe(false);
  });

  it("não executa após unavailable (falha técnica)", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    jest.spyOn(require("../../../security/services/validatePin.service"), "validatePin")
      .mockResolvedValueOnce({
        status: "unavailable",
        errorCode: "STORAGE_READ_FAILED",
      });

    const resultPromise = sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-1",
    });
    await waitForChallenge();
    await resolveTransactionalChallenge("123456", "acc-1");
    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.success === false && result.challengeResult.status).toBe("unavailable");
    expect(sendPixCalled).toBe(false);
  });

  it("não executa após not_configured", async () => {
    const result = await sendPixWithSecurityChallengeUseCase({
      to: "chave@email.com",
      amount: 100,
      accountId: "acc-none",
    });

    expect(result.success).toBe(false);
    expect(result.success === false && result.challengeResult.status).toBe("not_configured");
    expect(sendPixCalled).toBe(false);
  });
});

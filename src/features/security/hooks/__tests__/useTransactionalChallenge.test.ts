/**
 * Testes do hook useTransactionalChallenge (TASK 7).
 */

const mockStore = new Map<string, string>();
const CORRECT_HASH = "stored-hash-123";
const WRONG_HASH = "wrong-hash";

jest.mock("../../infra/pinStorage/pinSecureStoreAdapter", () => ({
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
    if (data === CORRECT_HASH || (data.length > 10 && data.endsWith("123456"))) {
      return Promise.resolve(CORRECT_HASH);
    }
    return Promise.resolve(WRONG_HASH);
  }),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

import { act, renderHook } from "@testing-library/react-native";
import { useTransactionalChallenge } from "../useTransactionalChallenge";
import { useSecurityStore } from "../../store";
import { setupPin } from "../../services/setupPin.service";

beforeEach(() => {
  mockStore.clear();
  useSecurityStore.getState().resetLocalState();
});

const request = { type: "PIX_TRANSFER" as const, accountId: "acc-1" };

describe("useTransactionalChallenge", () => {
  it("inicia challenge e resolve com sucesso", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => useTransactionalChallenge());

    let resolveResult: { status: string } | null = null;
    await act(async () => {
      const promise = result.current.requestChallenge(request);
      while (!useSecurityStore.getState().currentChallenge) {
        await new Promise((r) => setImmediate(r));
      }
      resolveResult = await result.current.resolveChallenge("123456", "acc-1");
      await promise;
    });

    expect(resolveResult?.status).toBe("authorized");
  });

  it("resolve challenge com sucesso", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => useTransactionalChallenge());

    let res: { status: string } | null = null;
    await act(async () => {
      const promise = result.current.requestChallenge(request);
      while (!useSecurityStore.getState().currentChallenge) {
        await new Promise((r) => setImmediate(r));
      }
      res = await result.current.resolveChallenge("123456", "acc-1");
      await promise;
    });

    expect(res?.status).toBe("authorized");
  });

  it("resolve challenge com falha tipada", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => useTransactionalChallenge());

    let res: { status: string } | null = null;
    await act(async () => {
      const promise = result.current.requestChallenge(request);
      while (!useSecurityStore.getState().currentChallenge) {
        await new Promise((r) => setImmediate(r));
      }
      res = await result.current.resolveChallenge("000000", "acc-1");
      await promise;
    });

    expect(res?.status).toBe("denied");
  });

  it("cancelChallenge retorna cancelled", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => useTransactionalChallenge());

    let awaitedResult: { status: string } | null = null;
    await act(async () => {
      const promise = result.current.requestChallenge(request);
      while (!useSecurityStore.getState().currentChallenge) {
        await new Promise((r) => setImmediate(r));
      }
      const cancelResult = result.current.cancelChallenge();
      expect(cancelResult.status).toBe("cancelled");
      awaitedResult = await promise;
    });

    expect(awaitedResult?.status).toBe("cancelled");
  });

  it("limpa currentChallenge após cancelamento", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => useTransactionalChallenge());

    await act(async () => {
      result.current.requestChallenge(request);
      while (!useSecurityStore.getState().currentChallenge) {
        await new Promise((r) => setImmediate(r));
      }
    });
    expect(useSecurityStore.getState().currentChallenge).not.toBeNull();

    act(() => {
      result.current.cancelChallenge();
    });
    expect(useSecurityStore.getState().currentChallenge).toBeNull();
  });
});

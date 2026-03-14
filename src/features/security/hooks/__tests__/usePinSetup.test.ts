/**
 * Testes do hook usePinSetup (TASK 5).
 * Cobre: limpeza de erro no cancelamento, propagação de resultado.
 */

const mockStore = new Map<string, string>();

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
  digestStringAsync: jest.fn((_algo: string, _data: string) =>
    Promise.resolve("hash")
  ),
  CryptoDigestAlgorithm: { SHA256: "SHA256" },
}));

import { act, renderHook } from "@testing-library/react-native";
import { usePinSetup } from "../usePinSetup";
import { useSecurityStore } from "../../store";
import { SecurityErrorCode } from "../../errors";

beforeEach(() => {
  mockStore.clear();
  useSecurityStore.getState().resetLocalState();
});

describe("usePinSetup", () => {
  it("cancelSetup limpa lastErrorCode (estado temporário da store)", async () => {
    const { result } = renderHook(() => usePinSetup());

    await act(async () => {
      await result.current.setup({
        pin: "123456",
        confirmation: "654321",
        accountId: "acc-1",
      });
    });

    expect(useSecurityStore.getState().lastErrorCode).toBe(
      SecurityErrorCode.PIN_CONFIRMATION_MISMATCH
    );

    act(() => {
      result.current.cancelSetup();
    });

    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });

  it("clearError limpa lastErrorCode após falha", async () => {
    const { result } = renderHook(() => usePinSetup());

    await act(async () => {
      await result.current.setup({
        pin: "123456",
        confirmation: "654321",
        accountId: "acc-1",
      });
    });

    act(() => {
      result.current.clearError();
    });

    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });

  it("retorna sucesso no setup quando PIN e confirmação conferem", async () => {
    const { result } = renderHook(() => usePinSetup());
    let setupResult: { success: boolean } | null = null;

    await act(async () => {
      setupResult = await result.current.setup({
        pin: "123456",
        confirmation: "123456",
        accountId: "acc-1",
      });
    });

    expect(setupResult?.success).toBe(true);
  });

  it("retorna falha tipada quando confirmação diverge", async () => {
    const { result } = renderHook(() => usePinSetup());
    let setupResult: { success: boolean; errorCode?: string } | null = null;

    await act(async () => {
      setupResult = await result.current.setup({
        pin: "123456",
        confirmation: "111111",
        accountId: "acc-1",
      });
    });

    expect(setupResult?.success).toBe(false);
    expect(setupResult && !setupResult.success && setupResult.errorCode).toBe(
      SecurityErrorCode.PIN_CONFIRMATION_MISMATCH
    );
  });
});

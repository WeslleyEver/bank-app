/**
 * Testes do hook usePinValidate (TASK 6).
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
import { usePinValidate } from "../usePinValidate";
import { useSecurityStore } from "../../store";
import { setupPin } from "../../services/setupPin.service";
import { SecurityErrorCode } from "../../errors";

beforeEach(() => {
  mockStore.clear();
  useSecurityStore.getState().resetLocalState();
});

describe("usePinValidate", () => {
  it("retorna validated no sucesso", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-1",
    });
    const { result } = renderHook(() => usePinValidate());
    let validateResult: { status: string } | null = null;

    await act(async () => {
      validateResult = await result.current.validate({
        pin: "123456",
        accountId: "acc-1",
      });
    });

    expect(validateResult?.status).toBe("validated");
  });

  it("retorna invalid quando PIN incorreto", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-2",
    });
    const { result } = renderHook(() => usePinValidate());
    let validateResult: { status: string } | null = null;

    await act(async () => {
      validateResult = await result.current.validate({
        pin: "000000",
        accountId: "acc-2",
      });
    });

    expect(validateResult?.status).toBe("invalid");
  });

  it("cancelValidation limpa lastErrorCode", async () => {
    await setupPin({
      pin: "123456",
      confirmation: "123456",
      accountId: "acc-3",
    });
    const { result } = renderHook(() => usePinValidate());

    await act(async () => {
      await result.current.validate({ pin: "000000", accountId: "acc-3" });
    });
    expect(useSecurityStore.getState().lastErrorCode).toBe(SecurityErrorCode.PIN_INVALID);

    act(() => {
      result.current.cancelValidation();
    });
    expect(useSecurityStore.getState().lastErrorCode).toBeNull();
  });
});

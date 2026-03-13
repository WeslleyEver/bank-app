/**
 * Testes do useLogin hook.
 * Cobre validação, loading, sucesso e tratamento de erros.
 */

import { act, renderHook } from "@testing-library/react-native";
import { AuthErrorCode, authErrorFactory } from "../../errors";
import { useAuthStore } from "../../store/useAuthStore";
import { useLogin, type LoginFormData } from "../useLogin";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("../../services/login.service", () => ({
  loginService: {
    execute: jest.fn(),
  },
}));

jest.mock("../../observability/authLogger", () => ({
  authLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { loginService } from "../../services/login.service";

const mockExecute = loginService.execute as jest.MockedFunction<typeof loginService.execute>;

const VALID_FORM: LoginFormData = {
  documento: "111.111.111-11",
  senha: "123456",
};

const MOCK_SESSION = {
  accessToken: "token",
  refreshToken: "refresh",
  user: {
    id: "1",
    nome: "User",
    email: "user@test.com",
    documento: "11111111111",
    tipoConta: "PF" as const,
    onboardingStatus: "aprovado" as const,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({
    session: null,
    authError: null,
    error: null,
    isAuthenticated: false,
  });
});

describe("useLogin", () => {
  describe("estado inicial", () => {
    it("retorna isSubmitting false e validationErrors null", () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.validationErrors).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe("validação", () => {
    it("retorna erro quando documento está vazio", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login({ documento: "", senha: "123456" });
      });

      expect(result.current.validationErrors?.documento).toBe("Documento é obrigatório");
      expect(mockExecute).not.toHaveBeenCalled();
    });

    it("retorna erro quando senha está vazia", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login({ documento: "111.111.111-11", senha: "" });
      });

      expect(result.current.validationErrors?.senha).toBe("Senha é obrigatória");
      expect(mockExecute).not.toHaveBeenCalled();
    });

    it("retorna erro quando documento é inválido", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login({ documento: "000", senha: "123456" });
      });

      expect(result.current.validationErrors?.documento).toBeDefined();
      expect(mockExecute).not.toHaveBeenCalled();
    });
  });

  describe("login com sucesso", () => {
    it("chama o service, atualiza o store e navega", async () => {
      mockExecute.mockResolvedValue(MOCK_SESSION);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(VALID_FORM);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        documento: "11111111111",
        senha: "123456",
      });
      expect(useAuthStore.getState().session).toEqual(MOCK_SESSION);
      expect(mockReplace).toHaveBeenCalled();
    });

    it("transiciona isSubmitting corretamente", async () => {
      let resolveExecute: (value: typeof MOCK_SESSION) => void;
      mockExecute.mockImplementation(
        () => new Promise((r) => { resolveExecute = r; })
      );

      const { result } = renderHook(() => useLogin());

      expect(result.current.isSubmitting).toBe(false);

      act(() => {
        result.current.login(VALID_FORM);
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolveExecute!(MOCK_SESSION);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("tratamento de erro", () => {
    it("atualiza error e re-lança quando credenciais são inválidas", async () => {
      const authError = {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: "Credenciais inválidas",
        name: "AuthError",
      };
      mockExecute.mockRejectedValue(authError);

      const { result } = renderHook(() => useLogin());

      let thrown: unknown;
      await act(async () => {
        try {
          await result.current.login(VALID_FORM);
        } catch (e) {
          thrown = e;
        }
      });

      expect(useAuthStore.getState().authError?.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
      expect(thrown).toBeDefined();
    });

    it("atualiza error em erro de rede", async () => {
      mockExecute.mockRejectedValue(new Error("Erro de conexão"));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        try {
          await result.current.login(VALID_FORM);
        } catch {
          // esperado
        }
      });

      expect(useAuthStore.getState().authError?.code).toBe(AuthErrorCode.NETWORK_ERROR);
    });
  });

  describe("clearErrors", () => {
    it("limpa validationErrors e authError", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login({ documento: "", senha: "" });
      });
      expect(result.current.validationErrors).not.toBeNull();

      act(() => {
        useAuthStore.setState({ authError: authErrorFactory.invalidCredentials() });
      });

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.validationErrors).toBeNull();
      expect(useAuthStore.getState().authError).toBeNull();
    });
  });
});

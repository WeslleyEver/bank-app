/**
 * Testes do authErrorMapper.
 * Garante mapeamento correto de erros API/infra para AuthError.
 */

import { AuthError, AuthErrorCode } from "../auth-error.types";
import { authErrorMapper } from "../auth-error.mapper";
import { getAuthErrorMessage } from "../auth-error.messages";

describe("authErrorMapper.fromApiCode", () => {
  it("mapeia INVALID_CREDENTIALS e variantes", () => {
    expect(authErrorMapper.fromApiCode("INVALID_CREDENTIALS")).toBe(AuthErrorCode.INVALID_CREDENTIALS);
    expect(authErrorMapper.fromApiCode("WRONG_PASSWORD")).toBe(AuthErrorCode.INVALID_CREDENTIALS);
    expect(authErrorMapper.fromApiCode("wrong_credentials")).toBe(AuthErrorCode.INVALID_CREDENTIALS);
  });

  it("mapeia USER_NOT_FOUND e NOT_FOUND", () => {
    expect(authErrorMapper.fromApiCode("USER_NOT_FOUND")).toBe(AuthErrorCode.USER_NOT_FOUND);
    expect(authErrorMapper.fromApiCode("NOT_FOUND")).toBe(AuthErrorCode.USER_NOT_FOUND);
  });

  it("mapeia SESSION_EXPIRED e UNAUTHORIZED", () => {
    expect(authErrorMapper.fromApiCode("SESSION_EXPIRED")).toBe(AuthErrorCode.SESSION_EXPIRED);
    expect(authErrorMapper.fromApiCode("TOKEN_EXPIRED")).toBe(AuthErrorCode.SESSION_EXPIRED);
    expect(authErrorMapper.fromApiCode("UNAUTHORIZED")).toBe(AuthErrorCode.SESSION_EXPIRED);
  });

  it("mapeia NETWORK_ERROR e TIMEOUT", () => {
    expect(authErrorMapper.fromApiCode("NETWORK_ERROR")).toBe(AuthErrorCode.NETWORK_ERROR);
    expect(authErrorMapper.fromApiCode("TIMEOUT")).toBe(AuthErrorCode.NETWORK_ERROR);
    expect(authErrorMapper.fromApiCode("CONNECTION_ERROR")).toBe(AuthErrorCode.NETWORK_ERROR);
  });

  it("retorna UNKNOWN_ERROR para código não mapeado", () => {
    expect(authErrorMapper.fromApiCode("CODIGO_INVALIDO")).toBe(AuthErrorCode.UNKNOWN_ERROR);
    expect(authErrorMapper.fromApiCode("")).toBe(AuthErrorCode.UNKNOWN_ERROR);
  });
});

describe("authErrorMapper.fromMessage", () => {
  it("mapeia credenciais inválidas por mensagem", () => {
    expect(authErrorMapper.fromMessage("Credenciais inválidas.")).toBe(AuthErrorCode.INVALID_CREDENTIALS);
    expect(authErrorMapper.fromMessage("Senha incorreta")).toBe(AuthErrorCode.INVALID_CREDENTIALS);
  });

  it("mapeia usuário não encontrado por mensagem", () => {
    expect(authErrorMapper.fromMessage("Usuário não encontrado")).toBe(AuthErrorCode.USER_NOT_FOUND);
  });

  it("mapeia sessão expirada por mensagem", () => {
    expect(authErrorMapper.fromMessage("Sessão expirada")).toBe(AuthErrorCode.SESSION_EXPIRED);
    expect(authErrorMapper.fromMessage("Token inválido")).toBe(AuthErrorCode.SESSION_EXPIRED);
  });

  it("mapeia erro de rede/timeout por mensagem", () => {
    expect(authErrorMapper.fromMessage("Erro de conexão")).toBe(AuthErrorCode.NETWORK_ERROR);
    expect(authErrorMapper.fromMessage("Timeout na requisição")).toBe(AuthErrorCode.NETWORK_ERROR);
    expect(authErrorMapper.fromMessage("Sem internet")).toBe(AuthErrorCode.NETWORK_ERROR);
  });

  it("retorna UNKNOWN_ERROR para mensagem não reconhecida", () => {
    expect(authErrorMapper.fromMessage("Erro genérico qualquer")).toBe(AuthErrorCode.UNKNOWN_ERROR);
  });
});

describe("authErrorMapper.fromApiResponse", () => {
  it("cria AuthError a partir de ApiErrorResponse", () => {
    const response = {
      success: false as const,
      error: { code: "INVALID_CREDENTIALS", message: "Login falhou" },
    };

    const result = authErrorMapper.fromApiResponse(response);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
    expect(result.message).toBe(getAuthErrorMessage(AuthErrorCode.INVALID_CREDENTIALS));
    expect(result.originalMessage).toBe("Login falhou");
  });
});

describe("authErrorMapper.fromError", () => {
  it("retorna AuthError inalterado quando já é AuthError", () => {
    const authError = new AuthError(AuthErrorCode.SESSION_EXPIRED, "msg");

    const result = authErrorMapper.fromError(authError);

    expect(result).toBe(authError);
    expect(result.code).toBe(AuthErrorCode.SESSION_EXPIRED);
  });

  it("mapeia ApiErrorResponse para AuthError", () => {
    const response = {
      success: false as const,
      error: { code: "USER_NOT_FOUND", message: "Documento não cadastrado" },
    };

    const result = authErrorMapper.fromError(response);

    expect(result.code).toBe(AuthErrorCode.USER_NOT_FOUND);
    expect(result.originalMessage).toBe("Documento não cadastrado");
  });

  it("mapeia objeto com .code para AuthError", () => {
    const error = { code: "NETWORK_ERROR", message: "Falha de rede" };

    const result = authErrorMapper.fromError(error);

    expect(result.code).toBe(AuthErrorCode.NETWORK_ERROR);
  });

  it("mapeia Error por mensagem (fallback para mocks)", () => {
    const error = new Error("Credenciais inválidas.");

    const result = authErrorMapper.fromError(error);

    expect(result.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
    expect(result.originalError).toBe(error);
  });

  it("mapeia string por mensagem", () => {
    const result = authErrorMapper.fromError("Timeout na conexão");

    expect(result.code).toBe(AuthErrorCode.NETWORK_ERROR);
    expect(result.originalMessage).toBe("Timeout na conexão");
  });

  it("retorna UNKNOWN_ERROR para erro não reconhecido", () => {
    const result = authErrorMapper.fromError({ foo: "bar" });

    expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
    expect(result.originalError).toEqual({ foo: "bar" });
  });
});

/**
 * Testes da factory/mapper de erros do SECURITY (TASK 9).
 */

import { SecurityErrorCode } from "../security-error-codes";
import {
  getSecurityErrorDescriptor,
  createSecurityError,
  mapUnknownToSecurityError,
} from "../security-error-factory";

describe("getSecurityErrorDescriptor", () => {
  it("mapeia PIN inválido corretamente", () => {
    const d = getSecurityErrorDescriptor(SecurityErrorCode.PIN_INVALID);
    expect(d.code).toBe(SecurityErrorCode.PIN_INVALID);
    expect(d.category).toBe("validation");
    expect(d.isCredentialError).toBe(true);
    expect(d.isRetryable).toBe(true);
    expect(d.messageKey).toBe("pin_invalid");
  });

  it("mapeia PIN bloqueado corretamente", () => {
    const d = getSecurityErrorDescriptor(SecurityErrorCode.PIN_BLOCKED);
    expect(d.code).toBe(SecurityErrorCode.PIN_BLOCKED);
    expect(d.category).toBe("policy");
    expect(d.isCredentialError).toBe(false);
    expect(d.isRetryable).toBe(false);
  });

  it("mapeia PIN não configurado corretamente", () => {
    const d = getSecurityErrorDescriptor(SecurityErrorCode.PIN_NOT_CONFIGURED);
    expect(d.code).toBe(SecurityErrorCode.PIN_NOT_CONFIGURED);
    expect(d.category).toBe("state");
    expect(d.isCredentialError).toBe(false);
  });

  it("mapeia falhas de storage corretamente", () => {
    const read = getSecurityErrorDescriptor(SecurityErrorCode.STORAGE_READ_FAILED);
    expect(read.category).toBe("technical");
    expect(read.isCredentialError).toBe(false);
    expect(read.isRetryable).toBe(true);

    const write = getSecurityErrorDescriptor(SecurityErrorCode.STORAGE_WRITE_FAILED);
    expect(write.category).toBe("technical");
    expect(write.isCredentialError).toBe(false);

    const data = getSecurityErrorDescriptor(SecurityErrorCode.STORAGE_DATA_INVALID);
    expect(data.category).toBe("technical");
    expect(data.isCredentialError).toBe(false);
  });

  it("não confunde erro técnico com erro de credencial", () => {
    const storageRead = getSecurityErrorDescriptor(SecurityErrorCode.STORAGE_READ_FAILED);
    expect(storageRead.isCredentialError).toBe(false);
    expect(storageRead.category).toBe("technical");

    const pinInvalid = getSecurityErrorDescriptor(SecurityErrorCode.PIN_INVALID);
    expect(pinInvalid.isCredentialError).toBe(true);
    expect(pinInvalid.category).toBe("validation");
  });

  it("challenge cancelado é tratado como flow, não erro técnico", () => {
    const d = getSecurityErrorDescriptor(SecurityErrorCode.CHALLENGE_CANCELLED);
    expect(d.category).toBe("flow");
    expect(d.isCredentialError).toBe(false);
  });
});

describe("createSecurityError", () => {
  it("cria erro tipado com código", () => {
    const err = createSecurityError(SecurityErrorCode.PIN_INVALID);
    expect(err.code).toBe(SecurityErrorCode.PIN_INVALID);
    expect(err.messageKey).toBe("pin_invalid");
  });

  it("aceita cause opcional", () => {
    const cause = new Error("inner");
    const err = createSecurityError(SecurityErrorCode.UNKNOWN_ERROR, cause);
    expect(err.cause).toBe(cause);
  });
});

describe("mapUnknownToSecurityError", () => {
  it("retorna UNKNOWN_ERROR para qualquer causa", () => {
    expect(mapUnknownToSecurityError(new Error("x"))).toBe(SecurityErrorCode.UNKNOWN_ERROR);
    expect(mapUnknownToSecurityError("string")).toBe(SecurityErrorCode.UNKNOWN_ERROR);
    expect(mapUnknownToSecurityError(null)).toBe(SecurityErrorCode.UNKNOWN_ERROR);
  });

  it("nunca retorna PIN_INVALID para falha técnica", () => {
    const code = mapUnknownToSecurityError(new Error("storage failed"));
    expect(code).not.toBe(SecurityErrorCode.PIN_INVALID);
    expect(code).toBe(SecurityErrorCode.UNKNOWN_ERROR);
  });
});

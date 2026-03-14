/**
 * Mapeamento de resultados/erros da validação para mensagens de UI.
 * Baseado em security-errors.md — mensagens estáveis, sem detalhes técnicos.
 */

import { SecurityErrorCode } from "../../errors";
import type { SecurityErrorCodeType } from "../../errors";
import type { ValidatePinResult } from "../../types";

const VALIDATION_ERROR_MESSAGES: Partial<Record<SecurityErrorCodeType, string>> = {
  [SecurityErrorCode.PIN_NOT_CONFIGURED]: "Configure o PIN antes de continuar.",
  [SecurityErrorCode.PIN_FORMAT_INVALID]: "O PIN deve ter exatamente 6 dígitos numéricos.",
  [SecurityErrorCode.PIN_INVALID]: "PIN incorreto. Tente novamente.",
  [SecurityErrorCode.PIN_BLOCKED]: "PIN bloqueado temporariamente. Tente mais tarde.",
  [SecurityErrorCode.ATTEMPT_LIMIT_REACHED]: "Limite de tentativas atingido. Aguarde alguns minutos.",
  [SecurityErrorCode.STORAGE_READ_FAILED]:
    "Não foi possível verificar o PIN. Tente novamente mais tarde.",
  [SecurityErrorCode.STORAGE_WRITE_FAILED]:
    "Ocorreu um erro ao processar. Tente novamente mais tarde.",
  [SecurityErrorCode.STORAGE_DATA_INVALID]:
    "Dados de segurança inválidos. Entre em contato com o suporte.",
  [SecurityErrorCode.VALIDATION_EXECUTION_FAILED]:
    "Não foi possível verificar o PIN. Tente novamente mais tarde.",
  [SecurityErrorCode.UNKNOWN_ERROR]: "Ocorreu um erro. Tente novamente.",
};

export function getValidatePinErrorMessage(result: ValidatePinResult | null): string | null {
  if (!result) return null;
  if (result.status === "validated" || result.status === "cancelled") return null;
  const code = "errorCode" in result ? result.errorCode : null;
  if (!code) return null;
  return VALIDATION_ERROR_MESSAGES[code] ?? "Ocorreu um erro. Tente novamente.";
}

export function getValidationErrorMessageFromCode(
  code: SecurityErrorCodeType | null
): string | null {
  if (!code) return null;
  return VALIDATION_ERROR_MESSAGES[code] ?? "Ocorreu um erro. Tente novamente.";
}

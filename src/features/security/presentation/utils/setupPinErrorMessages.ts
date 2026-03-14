/**
 * Mapeamento de códigos de erro do setup para mensagens de UI.
 * Baseado em security-errors.md — mensagens estáveis, sem detalhes técnicos.
 */

import { SecurityErrorCode } from "../../errors";
import type { SecurityErrorCodeType } from "../../errors";

const SETUP_ERROR_MESSAGES: Partial<Record<SecurityErrorCodeType, string>> = {
  [SecurityErrorCode.PIN_FORMAT_INVALID]: "O PIN deve ter exatamente 6 dígitos numéricos.",
  [SecurityErrorCode.PIN_CONFIRMATION_MISMATCH]: "O PIN e a confirmação não conferem. Tente novamente.",
  [SecurityErrorCode.STORAGE_WRITE_FAILED]: "Não foi possível salvar o PIN. Tente novamente mais tarde.",
  [SecurityErrorCode.UNKNOWN_ERROR]: "Ocorreu um erro. Tente novamente.",
};

export function getSetupErrorMessage(code: SecurityErrorCodeType | null): string | null {
  if (!code) return null;
  return SETUP_ERROR_MESSAGES[code] ?? "Ocorreu um erro. Tente novamente.";
}

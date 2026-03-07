/**
 * Validação de CPF e CNPJ.
 * Centralizado para uso nos fluxos de auth.
 */

import { sanitizeDocumento } from "../formatters/document.formatter";
import { USE_AUTH_MOCKS, MOCK_DOCUMENT_KEYS } from "../../constants/auth-mock.constants";

function isMockDocument(cleaned: string): boolean {
  if (!USE_AUTH_MOCKS) return false;
  return (MOCK_DOCUMENT_KEYS as readonly string[]).includes(cleaned);
}

/**
 * Valida CPF com algoritmo real.
 * Aceita documentos mock quando USE_AUTH_MOCKS está ativo.
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = sanitizeDocumento(cpf);
  if (cleaned.length !== 11) return false;
  if (isMockDocument(cleaned)) return true;

  if (/^(\d)\1+$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  let sum1 = 0;
  for (let i = 0; i < 9; i++) sum1 += digits[i] * (10 - i);
  let remainder1 = (sum1 * 10) % 11;
  if (remainder1 === 10) remainder1 = 0;
  if (remainder1 !== digits[9]) return false;

  let sum2 = 0;
  for (let i = 0; i < 10; i++) sum2 += digits[i] * (11 - i);
  let remainder2 = (sum2 * 10) % 11;
  if (remainder2 === 10) remainder2 = 0;
  if (remainder2 !== digits[10]) return false;

  return true;
}

/**
 * Valida CNPJ com algoritmo real.
 * Aceita documentos mock quando USE_AUTH_MOCKS está ativo.
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = sanitizeDocumento(cnpj);
  if (cleaned.length !== 14) return false;
  if (isMockDocument(cleaned)) return true;

  if (/^(\d)\1+$/.test(cleaned)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum1 = 0;
  for (let i = 0; i < 12; i++) sum1 += Number(cleaned[i]) * weights1[i];
  let remainder1 = sum1 % 11;
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;
  if (digit1 !== Number(cleaned[12])) return false;

  let sum2 = 0;
  for (let i = 0; i < 13; i++) sum2 += Number(cleaned[i]) * weights2[i];
  let remainder2 = sum2 % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
  if (digit2 !== Number(cleaned[13])) return false;

  return true;
}

/**
 * Valida documento (CPF ou CNPJ) no login.
 * Exige 11 (CPF) ou 14 (CNPJ) dígitos e valida conforme o tipo.
 */
export function isValidDocumentoLogin(documento: string): boolean {
  const cleaned = sanitizeDocumento(documento);
  if (cleaned.length === 11) return isValidCPF(documento);
  if (cleaned.length === 14) return isValidCNPJ(documento);
  return false;
}

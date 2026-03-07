/**
 * Validação de telefone celular.
 * Centralizado para uso nos fluxos de auth.
 */

import { sanitizePhone } from "../formatters/phone.formatter";

const VALID_DDDS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 87, 82, 83, 84, 85, 88, 86,
  89, 91, 93, 94, 92, 97, 95, 96, 98, 99,
];

/**
 * Valida telefone celular brasileiro: 11 dígitos, DDD válido, inicia com 9.
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = sanitizePhone(phone);
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const ddd = Number(cleaned.slice(0, 2));
  const firstDigit = cleaned[2];
  if (!VALID_DDDS.includes(ddd)) return false;
  if (firstDigit !== "9") return false;

  return true;
}

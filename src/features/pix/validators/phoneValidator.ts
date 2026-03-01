/**
 * Lista oficial de DDDs válidos no Brasil.
 *
 * Utilizada para validação estrutural de números de celular
 * no padrão nacional.
 *
 * Observação:
 * A lista deve ser mantida atualizada caso haja alterações
 * na regulamentação da ANATEL.
 */
const VALID_DDDS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 87, 82, 83, 84, 85, 88, 86,
  89, 91, 93, 94, 92, 97, 95, 96, 98, 99,
];

/**
 * Valida um número de telefone celular brasileiro.
 *
 * Regras aplicadas:
 * - Remove caracteres não numéricos
 * - Verifica se possui 11 dígitos (DDD + 9 dígitos)
 * - Bloqueia sequências numéricas repetidas
 * - Valida se o DDD pertence à lista oficial
 * - Verifica se o número inicia com 9 (padrão celular no Brasil)
 *
 * @param phone - Número informado pelo usuário (com ou sem máscara)
 * @returns boolean - true se o número for válido, false caso contrário
 *
 * Observação:
 * Esta função valida apenas a estrutura do número,
 * não verifica existência real ou vínculo com operadora.
 */
export function isValidPhone(phone: string): boolean {
  /**
   * Remove qualquer caractere que não seja número.
   */
  const cleaned = phone.replace(/\D/g, "");

  /**
   * Regra 1: Celular brasileiro deve conter 11 dígitos.
   */
  if (cleaned.length !== 11) return false;

  /**
   * Regra 2: Bloqueia sequências repetidas.
   */
  if (/^(\d)\1+$/.test(cleaned)) return false;

  /**
   * Extrai DDD e primeiro dígito do número.
   */
  const ddd = Number(cleaned.slice(0, 2));
  const firstDigit = cleaned[2];

  /**
   * Regra 3: DDD deve estar na lista oficial.
   */
  if (!VALID_DDDS.includes(ddd)) return false;

  /**
   * Regra 4: Celular no Brasil deve iniciar com 9.
   */
  if (firstDigit !== "9") return false;

  /**
   * Número considerado válido após validação estrutural completa.
   */
  return true;
}

/**
 * Valida um CPF com base nas regras oficiais da Receita Federal.
 *
 * Regras aplicadas:
 * - Remove caracteres não numéricos
 * - Verifica se possui 11 dígitos
 * - Bloqueia sequências numéricas repetidas
 * - Valida os dois dígitos verificadores
 *
 * @param cpf - CPF informado pelo usuário (com ou sem máscara)
 * @returns boolean - true se o CPF for válido, false caso contrário
 *
 * Observação:
 * Esta função valida apenas a estrutura matemática do CPF,
 * não verifica existência real junto a órgãos oficiais.
 */
export function isValidCPF(cpf: string): boolean {
  /**
   * Remove qualquer caractere que não seja número.
   */
  const cleaned = cpf.replace(/\D/g, "");

  /**
   * Regra 1: CPF deve conter exatamente 11 dígitos.
   */
  if (cleaned.length !== 11) return false;

  /**
   * Regra 2: Bloqueia sequências repetidas (ex: 11111111111).
   */
  if (/^(\d)\1+$/.test(cleaned)) return false;

  /**
   * Converte string em array numérico.
   */
  const digits = cleaned.split("").map(Number);

  /**
   * Cálculo do primeiro dígito verificador.
   */
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i);
  }

  let remainder1 = (sum1 * 10) % 11;
  if (remainder1 === 10) remainder1 = 0;

  if (remainder1 !== digits[9]) return false;

  /**
   * Cálculo do segundo dígito verificador.
   */
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += digits[i] * (11 - i);
  }

  let remainder2 = (sum2 * 10) % 11;
  if (remainder2 === 10) remainder2 = 0;

  if (remainder2 !== digits[10]) return false;

  /**
   * CPF considerado válido após validação estrutural completa.
   */
  return true;
}

/**
 * Formatação e sanitização de telefone celular.
 * Centralizado para uso nos fluxos de auth.
 */

/**
 * Remove todos os caracteres não numéricos.
 */
export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formata celular: (00) 00000-0000
 * Até 10 dígitos: (00) 0000-0000 (fixo)
 * 11 dígitos: (00) 00000-0000 (celular)
 */
export function formatPhone(value: string): string {
  const numbers = sanitizePhone(value).slice(0, 11);
  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return numbers
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

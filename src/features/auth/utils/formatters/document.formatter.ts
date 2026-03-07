/**
 * Formatação e sanitização de documentos (CPF, CNPJ).
 * Centralizado para uso nos fluxos de auth.
 */

/**
 * Remove todos os caracteres não numéricos.
 */
export function sanitizeDocumento(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formata CPF: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const numbers = sanitizeDocumento(value).slice(0, 11);
  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");
}

/**
 * Formata CNPJ: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const numbers = sanitizeDocumento(value).slice(0, 14);
  return numbers
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/\/(\d{4})(\d)/, "/$1-$2");
}

/**
 * Formata documento dinamicamente:
 * - até 11 dígitos: CPF
 * - acima de 11: CNPJ
 */
export function formatDocumentoDinamico(value: string): string {
  const numbers = sanitizeDocumento(value);
  if (numbers.length <= 11) return formatCPF(value);
  return formatCNPJ(value);
}

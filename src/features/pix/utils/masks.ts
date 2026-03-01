/**
 * Remove todos os caracteres não numéricos de uma string.
 *
 * Utilizado como função base para normalização de dados
 * antes de aplicar máscaras ou validações.
 *
 * @param value - Valor de entrada contendo números e/ou caracteres especiais
 * @returns string - Apenas os caracteres numéricos
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Aplica máscara de CPF no padrão brasileiro: 000.000.000-00
 *
 * Regras aplicadas:
 * - Remove caracteres não numéricos
 * - Limita a 11 dígitos
 * - Aplica formatação progressiva conforme o usuário digita
 *
 * @param value - CPF informado (com ou sem máscara)
 * @returns string - CPF formatado
 *
 * Observação:
 * Esta função apenas formata o valor visualmente.
 * A validação estrutural deve ser feita separadamente.
 */
export function cpfMask(value: string): string {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

/**
 * Aplica máscara de telefone celular brasileiro.
 *
 * Formatos suportados:
 * - (00) 0000-0000
 * - (00) 00000-0000
 *
 * Regras aplicadas:
 * - Remove caracteres não numéricos
 * - Limita a 11 dígitos
 * - Aplica formatação dinâmica conforme o tamanho do número
 *
 * @param value - Número informado (com ou sem máscara)
 * @returns string - Telefone formatado
 *
 * Observação:
 * Esta função apenas aplica formatação visual.
 * A validação estrutural deve ser realizada separadamente.
 */
export function phoneMask(value: string): string {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numbers
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Normaliza o valor de uma chave PIX antes de persistência ou validação.
 *
 * Objetivo:
 * Garantir que os dados sejam armazenados em formato padronizado,
 * evitando inconsistências causadas por máscaras ou variações
 * de capitalização.
 *
 * Regras aplicadas por tipo:
 * - CPF: remove caracteres não numéricos
 * - Telefone: remove caracteres não numéricos
 * - Email: remove espaços e converte para lowercase
 * - Random: mantém valor original
 *
 * @param type - Tipo da chave PIX
 * @param value - Valor informado pelo usuário
 * @returns string - Valor normalizado conforme o tipo
 *
 * Observação:
 * Esta função deve ser utilizada antes de:
 * - Validar duplicidade
 * - Persistir dados
 * - Comparar valores no domínio
 */
import { PixKeyType } from "../domain/models/PixKey";
import { onlyNumbers } from "./masks";

export function normalizePixValue(type: PixKeyType, value: string): string {
  switch (type) {
    case "cpf":
    case "phone":
      return onlyNumbers(value);

    case "email":
      return value.trim().toLowerCase();

    default:
      return value;
  }
}

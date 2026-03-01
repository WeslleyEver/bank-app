import { PixKeyType } from "../domain/models/PixKey";
import { isValidCPF } from "../validators/cpfValidator";
import { cpfMask, onlyNumbers, phoneMask } from "./masks";

/**
 * ------------------------------------------------------------------
 * Utility: formatPixInput
 * ------------------------------------------------------------------
 *
 * Responsabilidade:
 * - Aplicar máscara conforme o tipo da chave
 * - Realizar validação leve (ex: CPF inválido)
 *
 * NÃO deve:
 * - Executar regra de negócio
 * - Chamar useCase
 * - Alterar estado global
 *
 * Retorna:
 * - value formatado
 * - possível mensagem de erro
 * ------------------------------------------------------------------
 */
export function formatPixInput(type: PixKeyType, text: string) {
  let error: string | null = null;
  let formatted = text;

  if (type === "cpf") {
    const numbers = onlyNumbers(text);

    if (numbers.length === 11 && !isValidCPF(numbers)) {
      error = "CPF inválido";
    }

    formatted = cpfMask(text);
  }

  if (type === "phone") {
    formatted = phoneMask(text);
  }

  if (type === "email") {
    formatted = text.trim();
  }

  return {
    value: formatted,
    error,
  };
}

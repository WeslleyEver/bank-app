import { PIX_LIMITS } from "../constants/pixLimits";
import { PixKey, PixKeyType } from "../domain/models/PixKey";
import { isValidCPF } from "../validators/cpfValidator";
import { isValidEmail } from "../validators/emailValidator";
import { isValidPhone } from "../validators/phoneValidator";

/**
 * Representa o resultado de uma validação.
 *
 * @property valid - Indica se a validação foi bem-sucedida.
 * @property error - Mensagem de erro retornada em caso de falha.
 */
export type ValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Serviço responsável por validar regras de criação de chaves PIX.
 *
 * Regras aplicadas:
 * - Limite máximo de chaves por tipo de conta (PF/PJ)
 * - Prevenção de chaves duplicadas
 * - Validação específica por tipo de chave (CPF, telefone, email)
 *
 * Essa classe centraliza regras de negócio relacionadas à validação,
 * mantendo o domínio desacoplado da camada de interface.
 */
export class PixValidationService {
  /**
   * Detecta automaticamente o tipo da chave Pix
   * baseado no valor informado.
   *
   * Utilizado para:
   * - Clipboard
   * - Fluxo de transferência
   */
  static detectKeyType(value: string): PixKeyType | null {
    const cleaned = value.trim();

    if (isValidCPF(cleaned)) return "cpf";

    if (isValidPhone(cleaned)) return "phone";

    if (isValidEmail(cleaned)) return "email";

    // Chave aleatória Pix (UUID padrão Bacen)
    const randomKeyRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (randomKeyRegex.test(cleaned)) return "random";

    return null;
  }
  /**
   * Executa a validação completa de uma chave PIX antes do cadastro.
   *
   * @param type - Tipo da chave PIX (cpf, phone, email ou random)
   * @param value - Valor da chave informada pelo usuário
   * @param existingKeys - Lista de chaves já cadastradas na conta
   * @param accountType - Tipo da conta (PF ou PJ). Default: PF
   *
   * @returns ValidationResult
   *
   * Fluxo de validação:
   * 1. Verifica limite máximo permitido pelo Bacen
   * 2. Verifica se a chave já está cadastrada
   * 3. Executa validação específica baseada no tipo
   */
  static validate(
    type: PixKeyType,
    value: string,
    existingKeys: PixKey[],
    accountType: "PF" | "PJ" = "PF",
  ): ValidationResult {
    /**
     *  Regra 1 — Limite máximo de chaves por tipo de conta
     */
    if (existingKeys.length >= PIX_LIMITS[accountType]) {
      return {
        valid: false,
        error: "Você atingiu o limite máximo de chaves permitidas.",
      };
    }

    /**
     *  Regra 2 — Impede cadastro de chave duplicada
     */
    const alreadyExists = existingKeys.some(
      (key) => key.type === type && key.value === value,
    );

    if (alreadyExists) {
      return {
        valid: false,
        error: "Essa chave já está cadastrada.",
      };
    }

    /**
     *  Regra 3 — Validação específica por tipo
     */
    switch (type) {
      case "cpf":
        if (!isValidCPF(value)) {
          return {
            valid: false,
            error: "CPF inválido",
          };
        }
        break;

      case "phone":
        if (!isValidPhone(value)) {
          return {
            valid: false,
            error: "Celular inválido",
          };
        }
        break;

      case "email":
        if (!isValidEmail(value)) {
          return {
            valid: false,
            error: "Email inválido",
          };
        }
        break;

      case "random":
        // Chave aleatória não exige validação de formato
        break;
    }

    /**
     * ✅ Caso todas as regras passem, retorna válido
     */
    return { valid: true };
  }
}

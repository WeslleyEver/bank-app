import { PIX_LIMITS } from "../constants/pixLimits";
import { PixKey, PixKeyType } from "../domain/models/PixKey";
import { isValidCPF } from "../utils/cpfValidator";
import { isValidEmail } from "../utils/emailValidator";
import { isValidPhone } from "../utils/phoneValidator";

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export class PixValidationService {
  static validate(
    type: PixKeyType,
    value: string,
    existingKeys: PixKey[],
    accountType: "PF" | "PJ" = "PF",
  ): ValidationResult {
    // 🔒 Limite Bacen
    if (existingKeys.length >= PIX_LIMITS[accountType]) {
      return {
        valid: false,
        error: "Você atingiu o limite máximo de chaves permitidas.",
      };
    }

    //  Duplicadas
    const alreadyExists = existingKeys.some(
      (key) => key.type === type && key.value === value,
    );

    if (alreadyExists) {
      return {
        valid: false,
        error: "Essa chave já está cadastrada.",
      };
    }

    // Validações por tipo
    switch (type) {
      case "cpf":
        if (type === "cpf") {
          if (!isValidCPF(value)) {
            return {
              valid: false,
              error: "CPF inválido",
            };
          }
        }
        break;

      case "phone":
        if (type === "phone") {
          if (!isValidPhone(value)) {
            return {
              valid: false,
              error: "Celular inválido",
            };
          }
        }
        break;

      case "email":
        if (type === "email") {
          if (!isValidEmail(value)) {
            return {
              valid: false,
              error: "Email inválido",
            };
          }
        }
        break;

      case "random":
        break;
    }

    return { valid: true };
  }
}

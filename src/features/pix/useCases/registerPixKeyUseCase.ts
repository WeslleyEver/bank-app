import * as Crypto from "expo-crypto";
import { PixKey } from "../domain/models/PixKey";
import { pixRepository } from "../infra/pix.repository";
import { PixValidationService } from "../services/PixValidationService";
import { normalizePixValue } from "../utils/normalizers";
import { usePixStore } from "../store/pix.store";

/**
 * Caso de Uso: Registro de Chave Pix
 *
 * @description Orquestra a criação de uma nova chave Pix, gerando um UUID único
 * e persistindo-a através do repositório.
 *
 * @param {PixKey["type"]} type - O tipo da chave (phone, email, cpf ou random).
 * @param {string} value - O valor correspondente à chave.
 *
 * @returns {Promise<PixKey>} A chave Pix criada e persistida.
 *
 * @example
 * const key = await registerPixKeyUseCase("email", "contato@exemplo.com");
 */
export async function registerPixKeyUseCase(
  type: PixKey["type"],
  value: string,
  accountType: "PF" | "PJ" = "PF"
): Promise<PixKey> {

  const { keys } = usePixStore.getState();

  // 🔹 1. Normaliza valor antes de qualquer coisa
  const normalizedValue = normalizePixValue(type, value);

  // 🔹 2. Valida regras de negócio
  const validation = PixValidationService.validate(
    type,
    normalizedValue,
    keys,
    accountType
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 🔹 3. Cria objeto definitivo
  const newKey: PixKey = {
    id: Crypto.randomUUID(),
    type,
    value: normalizedValue,
    createdAt: new Date(),
  };

  // 🔹 4. Persiste
  const savedKey = await pixRepository.register(newKey);

  // 🔹 5. Atualiza estado global
  usePixStore.getState().addKey(savedKey);

  return savedKey;
}

// export async function registerPixKeyUseCase(
//   type: PixKey["type"],
//   value: string,
// ) {
//   const newKey: PixKey = {
//     // Utiliza o pacote uuid para garantir a unicidade do ID
//     id: await Crypto.randomUUID(),
//     type,
//     value,
//     createdAt: new Date(),
//   };

//   await pixRepository.register(newKey);

//   // Atualiza store global
//   usePixStore.getState().addKey(newKey);

//   return pixRepository.register(newKey);
// }

import * as Crypto from "expo-crypto";
import { pixRepository } from "../../infra/pix.repository";
import { PixKey } from "../models/PixKey";

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
) {
  const newKey: PixKey = {
    // Utiliza o pacote uuid para garantir a unicidade do ID
    id: await Crypto.randomUUID(),
    type,
    value,
    createdAt: new Date(),
  };
  return pixRepository.register(newKey);
}

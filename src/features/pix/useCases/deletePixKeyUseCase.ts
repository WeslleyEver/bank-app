import { pixRepository } from "../infra/pix.repository";

/**
 * Caso de Uso: Exclusão de Chave Pix
 *
 * Orquestra a remoção de uma chave pelo ID.
 */
export async function deletePixKeyUseCase(id: string): Promise<void> {
  if (!id) {
    throw new Error("ID inválido");
  }

  return pixRepository.delete(id);
}


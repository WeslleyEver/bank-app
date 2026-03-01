import { pixRepository } from "../infra/pix.repository";

/**
 * Caso de Uso: Exclusão de Chave Pix
 *
 * Responsável por orquestrar a remoção de uma chave Pix
 * com base no identificador único.
 *
 * Fluxo executado:
 * 1. Valida se o identificador foi informado
 * 2. Solicita ao repositório a exclusão da chave
 *
 * @param id - Identificador único da chave Pix
 *
 * @returns Promise<void>
 *
 * @throws Error - Caso o identificador não seja informado
 *
 * Observação:
 * Este caso de uso atua como camada intermediária entre
 * a apresentação e a persistência.
 * Regras adicionais futuras (ex: verificação de permissão,
 * auditoria ou logging) devem ser implementadas aqui.
 */
export async function deletePixKeyUseCase(id: string): Promise<void> {
  /**
   * Regra 1: Identificador deve ser informado.
   */
  if (!id) {
    throw new Error("ID inválido");
  }

  /**
   * Delegação da exclusão à camada de persistência.
   */
  return pixRepository.delete(id);
}

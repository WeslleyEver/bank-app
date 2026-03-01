import { PixKey } from "../domain/models/PixKey";
import { pixRepository } from "../infra/pix.repository";

/**
 * Caso de Uso: Listagem de Chaves Pix
 *
 * Responsável por recuperar todas as chaves Pix cadastradas
 * através da camada de persistência.
 *
 * Fluxo executado:
 * 1. Solicita ao repositório a lista de chaves
 * 2. Retorna os dados para a camada de apresentação
 *
 * @returns Promise<PixKey[]> - Lista de chaves Pix cadastradas
 *
 * Observação:
 * Este caso de uso atua como camada de orquestração simples,
 * mantendo a aplicação desacoplada da implementação do repositório.
 * Eventuais regras futuras (como ordenação, filtros ou transformações)
 * devem ser implementadas nesta camada.
 */
export async function listPixKeysUseCase(): Promise<PixKey[]> {
  return pixRepository.list();
}

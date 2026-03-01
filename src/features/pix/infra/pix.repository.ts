import { PixKey } from "../domain/models/PixKey";

/**
 * ------------------------------------------------------------------
 * In-Memory Storage (Mock Database)
 * ------------------------------------------------------------------
 *
 * Armazenamento temporário em memória utilizado para simular
 * persistência de dados de chaves Pix.
 *
 * ⚠️ IMPORTANTE:
 * - Os dados são voláteis.
 * - São perdidos ao recarregar a aplicação.
 * - Não há persistência real em banco de dados.
 *
 * Objetivo:
 * - Permitir testes e desenvolvimento isolado
 * - Simular comportamento de backend
 * - Evitar dependência de API real neste estágio
 *
 * Em produção:
 * Este armazenamento deverá ser substituído por
 * chamadas HTTP para API real.
 * ------------------------------------------------------------------
 */
let pixKeys: PixKey[] = [];

/**
 * ------------------------------------------------------------------
 * Repository: pixRepository (Mock Implementation)
 * ------------------------------------------------------------------
 *
 * Implementação In-Memory do repositório de chaves Pix.
 *
 * Responsabilidade:
 * - Simular operações de persistência
 * - Isolar regras de negócio de dependências externas
 *
 * Arquitetura:
 * UseCase → Repository → (Mock Storage)
 *
 * No futuro:
 * Este arquivo será substituído por uma implementação
 * baseada em HTTP, como:
 *
 *   await api.get("/pix/keys")
 *   await api.post("/pix/keys")
 *   await api.delete(`/pix/keys/${id}`)
 *
 * ------------------------------------------------------------------
 */
export const pixRepository = {
  /**
   * Retorna todas as chaves Pix armazenadas.
   *
   * @returns {Promise<PixKey[]>}
   * Lista completa de chaves cadastradas no mock.
   *
   * @remarks
   * Não realiza paginação ou ordenação.
   * Em backend real, isso pode envolver filtros e query params.
   */
  async list(): Promise<PixKey[]> {
    return pixKeys;
  },

  /**
   * Registra uma nova chave Pix no armazenamento em memória.
   *
   * @param {PixKey} key
   * Objeto representando a chave Pix a ser armazenada.
   *
   * @returns {Promise<PixKey>}
   * Retorna a própria chave após inserção.
   *
   * @remarks
   * Não há validações de duplicidade neste mock.
   * Em ambiente real, o backend deve validar:
   * - Duplicidade de chave
   * - Formato válido
   * - Permissão do usuário
   */
  async register(key: PixKey): Promise<PixKey> {
    pixKeys.push(key);
    return key;
  },

  /**
   * Remove uma chave Pix com base no ID informado.
   *
   * @param {string} id
   * Identificador único da chave Pix.
   *
   * @returns {Promise<void>}
   *
   * @remarks
   * Se o ID não existir, nenhuma ação é executada.
   * Em ambiente real, o backend pode:
   * - Retornar erro 404
   * - Validar autorização
   */
  async delete(id: string): Promise<void> {
    pixKeys = pixKeys.filter((k) => k.id !== id);
  },
};

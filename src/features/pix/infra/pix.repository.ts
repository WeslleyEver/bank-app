import { PixKey } from "../domain/models/PixKey";

/**
 * Armazenamento temporário em memória para chaves Pix.
 * @description Esta variável atua como uma "fonte de verdade" volátil para fins de teste.
 * @type {PixKey[]}
 */
let pixKeys: PixKey[] = [];

/**
 * Repositório Mock para operações de chaves Pix.
 *
 * @description Implementação simplificada (In-Memory Fake) para isolar testes de
 * dependências externas como bancos de dados reais.
 *
 * @example
 * // Uso em testes unitários:
 * await pixRepository.register({ id: '1', type: 'email', value: 'test@me.com', createdAt: new Date() });
 */
export const pixRepository = {
  /**
   * Lista todas as chaves Pix armazenadas no mock.
   * @returns {Promise<PixKey[]>} Array com as chaves cadastradas.
   */
  async list() {
    return pixKeys;
  },

  /**
   * Simula o registro de uma nova chave Pix.
   * @param {PixKey} key Objeto da chave Pix a ser persistido.
   * @returns {Promise<PixKey>} A chave recém-adicionada.
   */
  async register(key: PixKey) {
    pixKeys.push(key);
    return key;
  },

  /**
   * Remove uma chave Pix do estado em memória pelo ID.
   * @param {string} id Identificador único da chave.
   * @returns {Promise<void>}
   */
  async delete(id: string) {
    pixKeys = pixKeys.filter((k) => k.id !== id);
  },
};

// quando colocarmos API;
// await api.get("/pix/keys")
// await api.post("/pix/keys")
// await api.delete(`/pix/keys/${id}`)

/**
 * Store responsável pelo gerenciamento de estado das chaves PIX.
 *
 * Implementada utilizando Zustand como gerenciador de estado leve.
 *
 * Responsabilidades:
 * - Armazenar lista de chaves cadastradas
 * - Permitir atualização completa da lista
 * - Permitir adição de nova chave
 * - Permitir remoção de chave por identificador
 *
 * Observação:
 * Esta store atua apenas como camada de estado.
 * Regras de negócio e validações devem permanecer
 * na camada de services ou useCases.
 * 
 * Aqui Estamos lendo a store dentro do service apenas para simulação.
 * Em ambiente real, o service não dependeria da store — ele receberia dados do backend.
 * Quando migrar para API real, bastará remover essa dependência e manter o mesmo       contrato SendPixResponse
 */

import { create } from "zustand";
import { PixKey } from "../domain/models/PixKey";

/**
 * Define o contrato da store de chaves PIX.
 */
interface PixStore {
  /**
   * Lista de chaves cadastradas na conta.
   */
  keys: PixKey[];

  /**
   * Substitui completamente a lista de chaves.
   *
   * @param keys - Nova lista de chaves
   */
  setKeys: (keys: PixKey[]) => void;

  /**
   * Adiciona uma nova chave à lista existente.
   *
   * @param key - Chave PIX a ser adicionada
   */
  addKey: (key: PixKey) => void;

  /**
   * Remove uma chave com base no identificador.
   *
   * @param id - Identificador único da chave
   */
  removeKey: (id: string) => void;
}

/**
 * Hook de acesso à store de chaves PIX.
 *
 * Deve ser utilizado na camada de apresentação (screens/components)
 * para leitura e manipulação do estado.
 */
export const usePixStore = create<PixStore>((set) => ({
  /**
   * Estado inicial da store.
   */
  keys: [],

  /**
   * Substitui completamente a lista de chaves.
   */
  setKeys: (keys) => set({ keys }),

  /**
   * Adiciona nova chave preservando imutabilidade do estado.
   */
  addKey: (key) =>
    set((state) => ({
      keys: [...state.keys, key],
    })),

  /**
   * Remove chave pelo id preservando imutabilidade.
   */
  removeKey: (id) =>
    set((state) => ({
      keys: state.keys.filter((k) => k.id !== id),
    })),
}));

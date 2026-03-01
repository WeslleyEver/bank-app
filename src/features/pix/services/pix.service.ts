import { useBalanceStore } from "../../account/store/useBalanceStore";
import { SendPixRequest, SendPixResponse } from "../types";

/**
 * Service: pixService
 *
 * Camada responsável por simular comunicação com backend
 * para operações relacionadas ao Pix.
 *
 * Responsabilidade exclusiva:
 * - Receber payload
 * - Simular validações que ocorreriam no backend
 * - Retornar resposta estruturada
 *
 * Restrições arquiteturais:
 * - Não deve conter lógica de UI
 * - Não deve atualizar stores diretamente
 * - Não deve conter regra de negócio de orquestração
 *
 * Fluxo arquitetural:
 * Screen → UseCase → Service → (retorna resposta) → Store
 *
 * Evolução futura:
 * Esta implementação deve ser substituída por integração HTTP real,
 * mantendo o mesmo contrato de entrada e saída.
 */
export const pixService = {
  /**
   * Simula envio de Pix.
   *
   * Fluxo executado:
   * 1. Recebe dados da operação
   * 2. Simula latência de rede
   * 3. Valida saldo disponível (simulação local)
   * 4. Calcula novo saldo
   * 5. Retorna objeto semelhante a uma resposta real de API
   *
   * @param data - Dados necessários para envio do Pix
   *
   * @returns Promise<SendPixResponse>
   *
   * @throws Error - Quando o saldo é insuficiente
   *
   * Observação:
   * A validação de saldo aqui é apenas para simulação.
   * Em ambiente real, essa verificação deve ocorrer exclusivamente no backend.
   */
  async sendPix(data: SendPixRequest): Promise<SendPixResponse> {
    /**
     * Obtém saldo atual apenas para simulação.
     */
    const balanceStore = useBalanceStore.getState();

    /**
     * Simula latência de rede.
     */
    await new Promise((resolve) => setTimeout(resolve, 800));

    /**
     * Validação simulada de saldo.
     */
    if (data.amount > balanceStore.balance) {
      throw new Error("Saldo insuficiente");
    }

    /**
     * Calcula novo saldo após operação.
     */
    const newBalance = balanceStore.balance - data.amount;

    /**
     * Retorna estrutura de resposta padronizada.
     */
    return {
      transaction: {
        id: String(Date.now()),
        name: data.to,
        type: "pix",
        amount: -data.amount,
        date: new Date().toISOString(),
      },
      newBalance,
    };
  },
};

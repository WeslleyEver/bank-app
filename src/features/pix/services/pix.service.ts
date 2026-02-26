import { useBalanceStore } from "../../account/store/useBalanceStore";
import { SendPixRequest, SendPixResponse } from "../types";

/**
 * ------------------------------------------------------------------
 * Service: pixService
 * ------------------------------------------------------------------
 *
 * Camada responsável por simular comunicação com o backend
 * para operações relacionadas ao Pix.
 *
 * ⚠️ IMPORTANTE:
 * Este arquivo representa a camada de API.
 * Ele NÃO deve atualizar stores diretamente.
 * Ele NÃO deve conter lógica de UI.
 *
 * Sua única responsabilidade é:
 * - Receber um payload
 * - Simular validações do backend
 * - Retornar uma resposta no formato esperado
 *
 * Arquitetura:
 * Screen → UseCase → Service → (retorna resposta) → Store
 *
 * No futuro:
 * A implementação abaixo deverá ser substituída por uma
 * chamada HTTP real, como:
 *
 *   return await axios.post("/pix/send", data);
 *
 * ------------------------------------------------------------------
 */
export const pixService = {
  /**
   * Simula envio de Pix para backend.
   *
   * Fluxo simulado:
   * 1. Recebe dados do envio
   * 2. Verifica saldo disponível (simulação local)
   * 3. Calcula novo saldo
   * 4. Retorna estrutura semelhante a uma resposta de API real
   *
   * @param data - Dados necessários para envio do Pix
   * @returns Promise com nova transação e saldo atualizado
   *
   * @throws Error quando saldo é insuficiente
   */
  async sendPix(data: SendPixRequest): Promise<SendPixResponse> {
    const balanceStore = useBalanceStore.getState();

    // Simula latência de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    /**
     * ⚠️ Esta validação está sendo feita no front apenas
     * para simulação.
     *
     * Em ambiente real, a validação deve acontecer
     * exclusivamente no backend.
     */
    if (data.amount > balanceStore.balance) {
      throw new Error("Saldo insuficiente");
    }

    const newBalance = balanceStore.balance - data.amount;

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

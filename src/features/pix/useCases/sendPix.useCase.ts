import { useBalanceStore } from "../../account/store/useBalanceStore";
import { useTransactionStore } from "../../transactions/store/useTransactionStore";
import { pixService } from "../services/pix.service";

/**
 * ------------------------------------------------------------------
 * UseCase: sendPixUseCase
 * ------------------------------------------------------------------
 *
 * Camada de aplicação responsável por orquestrar o fluxo
 * completo de envio de Pix dentro do app.
 *
 * Papel na arquitetura:
 * Screen → UseCase → Service → Store
 *
 * Responsabilidades:
 * - Receber dados vindos da UI
 * - Chamar a camada de serviço (simulação de API)
 * - Processar resposta
 * - Atualizar stores globais
 *
 * O UseCase centraliza a regra de negócio da operação.
 * A UI não deve acessar stores diretamente.
 * A UI não deve chamar services diretamente.
 *
 * Isso permite:
 * - Fácil manutenção
 * - Testabilidade isolada
 * - Substituição simples da API futuramente
 *
 * Quando integrar backend real:
 * Nenhuma alteração será necessária aqui,
 * apenas dentro do pixService.
 *
 * ------------------------------------------------------------------
 */

/**
 * Executa fluxo completo de envio de Pix.
 *
 * @param to - Destinatário da transferência
 * @param amount - Valor a ser transferido
 *
 * @throws Error quando o service retornar falha (ex: saldo insuficiente)
 */
export async function sendPixUseCase(to: string, amount: number) {
  const response = await pixService.sendPix({ to, amount });

  const balanceStore = useBalanceStore.getState();
  const transactionStore = useTransactionStore.getState();

  /**
   * Atualizações de estado acontecem
   * somente após sucesso da "API".
   */
  balanceStore.setBalance(response.newBalance);
  transactionStore.addTransaction(response.transaction);
}
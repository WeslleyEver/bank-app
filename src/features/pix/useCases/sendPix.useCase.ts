import { useBalanceStore } from "../../account/store/useBalanceStore";
import { useTransactionStore } from "../../transactions/store/useTransactionStore";
import { pixService } from "../services/pix.service";

/**
 * Caso de Uso: Envio de Pix
 *
 * Camada de aplicação responsável por orquestrar o fluxo
 * completo de envio de Pix dentro do aplicativo.
 *
 * Papel na arquitetura:
 * Screen → UseCase → Service → Store
 *
 * Responsabilidades:
 * - Receber dados provenientes da camada de apresentação
 * - Acionar a camada de serviço (integração com API ou simulação)
 * - Processar resposta da operação
 * - Atualizar os estados globais da aplicação
 *
 * Princípios aplicados:
 * - A UI não acessa stores diretamente para executar regra de negócio
 * - A UI não chama services diretamente
 * - O UseCase centraliza a orquestração da operação
 *
 * Benefícios:
 * - Separação clara de responsabilidades
 * - Facilidade para testes unitários
 * - Substituição transparente da camada de serviço
 *
 * Observação:
 * Ao integrar um backend real, nenhuma alteração será necessária
 * neste UseCase, apenas na implementação do pixService.
 *
 * @param to - Identificador do destinatário (chave Pix)
 * @param amount - Valor a ser transferido
 *
 * @returns Promise<void>
 *
 * @throws Error - Caso o serviço retorne falha (ex: saldo insuficiente)
 */
export async function sendPixUseCase(
  to: string,
  amount: number,
): Promise<void> {
  /**
   * 1. Executa operação através da camada de serviço.
   */
  const response = await pixService.sendPix({ to, amount });

  /**
   * 2. Obtém instâncias atuais das stores globais.
   */
  const balanceStore = useBalanceStore.getState();
  const transactionStore = useTransactionStore.getState();

  /**
   * 3. Atualiza estado somente após sucesso da operação.
   */
  balanceStore.setBalance(response.newBalance);
  transactionStore.addTransaction(response.transaction);
}

/**
 * ------------------------------------------------------------------
 * Types: Transactions (Domain Layer)
 * ------------------------------------------------------------------
 *
 * Este arquivo define os tipos centrais do domínio de transações.
 *
 * Ele representa o modelo de dados que vem do backend
 * e é utilizado em toda a aplicação.
 *
 * ⚠️ IMPORTANTE:
 * Esses tipos devem refletir exatamente o contrato da API.
 * Caso o backend altere o formato, este arquivo deve ser atualizado.
 *
 * Não deve conter:
 * - Lógica de negócio
 * - Formatação
 * - Helpers
 *
 * Apenas definição estrutural de dados.
 * ------------------------------------------------------------------
 */

/**
 * Modalidades de transferência suportadas pelo banco.
 *
 * - `pix`: Transferência instantânea disponível 24/7.
 * - `ted`: Transferência eletrônica disponível em horário bancário.
 * - `doc`: Modalidade antiga, processamento em D+1.
 *
 * Observação:
 * Caso novas modalidades sejam adicionadas (ex: boleto),
 * devem ser incluídas aqui.
 */
export type TransactionType = "pix" | "ted" | "doc";

/**
 * Representa uma transação bancária completa.
 *
 * Este modelo é considerado a entidade principal
 * do domínio financeiro da aplicação.
 */
export interface Transaction {
  /**
   * Identificador único da transação.
   *
   * Deve ser gerado pelo backend (idealmente UUID).
   */
  id: string;

  /**
   * Nome do favorecido (envio)
   * ou pagador (recebimento).
   */
  name: string;

  /**
   * Valor da transação.
   *
   * 🔐 Recomendação de sistema bancário:
   * Idealmente deve ser armazenado em centavos (inteiro)
   * para evitar problemas de precisão decimal.
   *
   * Exemplo:
   * R$ 10,50 → 1050
   *
   * Atualmente está sendo tratado como number simples
   * para fins de simulação.
   */
  amount: number;

  /**
   * Data da transação no padrão ISO 8601.
   *
   * Exemplo:
   * "2026-02-25T23:20:00.000Z"
   */
  date: string;

  /**
   * Modalidade utilizada na operação.
   */
  type: TransactionType;
}

// o ideal par o futuro
// amountInCents: number
// E toda formatação ficaria isolada em util:
// formatCurrencyFromCents(value: number)
// Isso evita bug clássico de: 0.1 + 0.2 !== 0.3

/**
 * Define as modalidades de transferência permitidas no banco.
 * - `pix`: Instantâneo 24/7.
 * - `ted`: Mesma titularidade ou diferentes bancos (até as 17h).
 * - `doc`: Modalidade em desuso.
 */
export type TransactionType = "pix" | "ted" | "doc";

/**
 * Representa uma transação bancária completa.
 */
export interface Transaction {
  /** Identificador único gerado pelo backend (UUID) */
  id: string;

  /** Nome do favorecido ou pagador */
  name: string;

  /** Valor da transação em centavos para evitar erros de precisão decimal */
  amount: number;

  /** Data no formato ISO 8601 (YYYY-MM-DD) */
  date: string;

  /** O método utilizado para a transferência */
  type: TransactionType;
}

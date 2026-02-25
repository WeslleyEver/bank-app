export type TransactionType = "pix" | "ted" | "doc";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: TransactionType;
}
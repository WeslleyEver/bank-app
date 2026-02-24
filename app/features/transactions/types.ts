export type TransactionType = "pix" | "ted" | "doc";

export interface Transaction {
  id: string;
  name: string;
  // description: string;
  amount: number;
  date: string;
  type: TransactionType;
}

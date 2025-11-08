// types/Transaction.ts
export interface Transaction {
  _id?: string;
  user_id?: string;
  category_id: string;
  name: string;
  amount: number;
  type: string;
  date: Date | null;
  note?: string;
  
  // Enriched data from backend
  category_details?: {
    name: string;
    icon: string;
    type: string;
    group_name: string;
  };
}

export type CreateTransaction = Omit<Transaction, "_id" | "category_details">;
export type UpdateTransactionInput = Partial<Omit<Transaction, "_id" | "category_details">>
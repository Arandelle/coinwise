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
    id?: string;
    name: string;
    icon: string;
    type: string;
    group_id?: string;
    group_name: string;
  };
}

export type CreateTransaction = Omit<Transaction, "_id" | "category_details">;
export type UpdateTransactionInput = Partial<Omit<Transaction, "_id" | "category_details">>

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  category_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: "date" | "name" | "amount";
  order?: "asc" | "desc";
}
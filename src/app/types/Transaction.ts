export interface Transaction {
  id?: string; // mongodb _id
  user_id?: string, // Reference to user
  category_id: string,
  name: string;
  category: string;
  amount: number;
  type: string,
  label?: string,
  note?: string,
  balance_after?: string,
  date: Date | string;
  date_only?:string,
  created_at: string,
}
export interface Transaction {
  _id?: string, 
  category_id?: string,
  name: string;
  category: string;
  amount: number;
  type: string,
  label?: string,
  note?: string,
  balance_after?: string,
  date: Date | null;
}

export interface Category {
  name: string;
  type: string,
  icon: string;
  color: string;
  category_group: string;
}
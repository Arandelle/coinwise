import { Utensils, ShoppingBag, Car, Home, Zap } from "lucide-react";

export const iconMap = {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
};

export type IconKey = keyof typeof iconMap;

export interface Transaction {
  _id?: string; // mongodb _id
  user_id?: string, // Reference to user
  category_id?: string,
  name: string;
  category: string;
  amount: number;
  type: "income" | "expense"
  label?: string,
  note?: string,
  balance_after?: string,
  date: string;
  date_only?:string,
  created_at: string,
}

export interface Category {
  id: string, 
  name: string;
  type: string,
  icon: keyof typeof iconMap;
  color: string;
  category_group: string;
  user_id?: string | null // reference who created this category 
}
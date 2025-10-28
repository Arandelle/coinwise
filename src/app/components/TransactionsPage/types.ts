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
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: IconKey;
  color: string;
}

export interface Category {
  name: string;
  icon: keyof typeof iconMap;
  color: string;
}
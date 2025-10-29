import { Category } from "./types";

export const categories: Category[] = [
  { id: "101", name: "Dining out", type: "expense", icon: "Utensils", color: "bg-rose-500", category_group: "Family" },
  { id: "102", name: "Shopping", type: "expense", icon: "ShoppingBag", color: "bg-purple-500", category_group: "Personal" },
  { id: "103", name: "Transportation", type: "expense", icon: "Car", color: "bg-yellow-500", category_group: "Travel" },
  { id: "104", name: "Utilities", type: "expense", icon: "Home", color: "bg-blue-500", category_group: "Household" },
  { id: "105", name: "Entertainment", type: "expense", icon: "Zap", color: "bg-pink-500", category_group: "Leisure" },
  // { id: "106", name: "Groceries", type: "expense", icon: "ShoppingCart", color: "bg-green-500", category_group: "Family" },
  // { id: "107", name: "Healthcare", type: "expense", icon: "Heart", color: "bg-red-500", category_group: "Personal" },
  // { id: "108", name: "Education", type: "expense", icon: "BookOpen", color: "bg-indigo-500", category_group: "Personal Development" },
  // { id: "109", name: "Savings", type: "income", icon: "PiggyBank", color: "bg-teal-500", category_group: "Financial" },
  // { id: "110", name: "Salary", type: "income", icon: "DollarSign", color: "bg-green-600", category_group: "Financial" },
];

export const MONTHLY_BUDGET = 25000;

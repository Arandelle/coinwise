import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupWithCategories } from "../components/TransactionsPage/TransactionModals/CategoryModal";
import { Category } from "../types/Category";

const GUEST_CATEGORIES_KEY = "guest_categories";

function getDefaultGuestCategories(): GroupWithCategories[] {
  return [
    {
      _id: "guest_group_expense_1",
      group_name: "Essential",
      type: "expense",
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: "guest_cat_1",
          category_name: "Food",
          icon: "Utensils",
          type: "expense",
          group_id: "guest_group_expense_1",
        },
        {
          _id: "guest_cat_2",
          category_name: "Transport",
          icon: "Car",
          type: "expense",
          group_id: "guest_group_expense_1",
        },
        {
          _id: "guest_cat_3",
          category_name: "Shopping",
          icon: "ShoppingBag",
          type: "expense",
          group_id: "guest_group_expense_1",
        },
        {
          _id: "guest_cat_4",
          category_name: "Bills",
          icon: "Receipt",
          type: "expense",
          group_id: "guest_group_expense_1",
        },
      ],
    },
    {
      _id: "guest_group_expense_2",
      group_name: "Lifestyle",
      type: "expense",
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: "guest_cat_5",
          category_name: "Entertainment",
          icon: "Film",
          type: "expense",
          group_id: "guest_group_expense_2",
        },
        {
          _id: "guest_cat_6",
          category_name: "Health",
          icon: "Heart",
          type: "expense",
          group_id: "guest_group_expense_2",
        },
      ],
    },
    {
      _id: "guest_group_income_1",
      group_name: "Income",
      type: "income",
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: "guest_cat_7",
          category_name: "Salary",
          icon: "Wallet",
          type: "income",
          group_id: "guest_group_income_1",
        },
        {
          _id: "guest_cat_8",
          category_name: "Freelance",
          icon: "Briefcase",
          type: "income",
          group_id: "guest_group_income_1",
        },
        {
          _id: "guest_cat_9",
          category_name: "Investment",
          icon: "TrendingUp",
          type: "income",
          group_id: "guest_group_income_1",
        },
      ],
    },
  ];
}

const getGuestCategories = (): GroupWithCategories[] => {
  try {
    const stored = localStorage.getItem(GUEST_CATEGORIES_KEY);
    if (stored) return JSON.parse(stored);

    // Return default categories for first-time guest user
    return getDefaultGuestCategories();
  } catch (error) {
    console.error("Error loading guest categories", error);
    return getDefaultGuestCategories();
  }
};

const saveGuestCategoris = (categories: GroupWithCategories[]) => {
  try {
    localStorage.setItem(GUEST_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error("Error saving guest categories", e);
  }
};

// query hook
export function useGuestCategories() {
  return useQuery({
    queryKey: ["guest_categories"],
    queryFn: () => getGuestCategories(),
    staleTime: Infinity,
  });
}

// Mutation hook for creating categories
export function useCreateGuestCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: Omit<Category, "_id" | "create_at">) => {
      const categories = getGuestCategories();

      // Find or create group
      let group = categories.find(
        (g) =>
          g.group_name === newCategory.group_id && g.type === newCategory.type
      );

      if (!group) {
        group = {
          _id: `guest_group_${Date.now()}`,
          group_name: newCategory.group_id || "Others",
          type: newCategory.type,
          created_at: new Date().toISOString(),
          categories: [],
        };

        categories.push(group)
      }

      // Add category
      const category: Category = {
        ...newCategory,
         _id: `guest_cat_${Date.now()}`,
      }

      group.categories.push(category);
      saveGuestCategoris(categories);

      return category;
    },

    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['guest_categories']});
    }

  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupWithCategories } from "../types/Category";
import { Category } from "../types/Category";

const GUEST_CATEGORIES_KEY = "guest_categories";

function getDefaultGuestCategories(): GroupWithCategories[] {
  return [
    // Essential Group
    {
      _id: 'guest_group_essential',
      group_name: 'Essential',
      type: 'expense',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_food',
          category_name: 'Food',
          icon: 'Utensils',
          type: 'expense',
          group_id: 'guest_group_essential',
          
        },
        {
          _id: 'guest_cat_groceries',
          category_name: 'Groceries',
          icon: 'ShoppingCart',
          type: 'expense',
          group_id: 'guest_group_essential',
          
        },
        {
          _id: 'guest_cat_healthcare',
          category_name: 'Healthcare',
          icon: 'Heart',
          type: 'expense',
          group_id: 'guest_group_essential',
          
        },
      ]
    },
    // Utilities Group
    {
      _id: 'guest_group_utilities',
      group_name: 'Utilities',
      type: 'expense',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_electricity',
          category_name: 'Electricity',
          icon: 'Zap',
          type: 'expense',
          group_id: 'guest_group_utilities',
          
        },
        {
          _id: 'guest_cat_water',
          category_name: 'Water',
          icon: 'Droplet',
          type: 'expense',
          group_id: 'guest_group_utilities',
          
        },
        {
          _id: 'guest_cat_internet',
          category_name: 'Internet',
          icon: 'Wifi',
          type: 'expense',
          group_id: 'guest_group_utilities',
          
        },
        {
          _id: 'guest_cat_phone',
          category_name: 'Phone Bill',
          icon: 'Smartphone',
          type: 'expense',
          group_id: 'guest_group_utilities',
          
        },
      ]
    },
    // Transportation Group
    {
      _id: 'guest_group_transport',
      group_name: 'Transportation',
      type: 'expense',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_gas',
          category_name: 'Gas/Fuel',
          icon: 'Fuel',
          type: 'expense',
          group_id: 'guest_group_transport',
          
        },
        {
          _id: 'guest_cat_public_transport',
          category_name: 'Public Transport',
          icon: 'Bus',
          type: 'expense',
          group_id: 'guest_group_transport',
          
        },
        {
          _id: 'guest_cat_parking',
          category_name: 'Parking',
          icon: 'Car',
          type: 'expense',
          group_id: 'guest_group_transport',
          
        },
      ]
    },
    // Lifestyle Group
    {
      _id: 'guest_group_lifestyle',
      group_name: 'Lifestyle',
      type: 'expense',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_entertainment',
          category_name: 'Entertainment',
          icon: 'Film',
          type: 'expense',
          group_id: 'guest_group_lifestyle',
          
        },
        {
          _id: 'guest_cat_shopping',
          category_name: 'Shopping',
          icon: 'ShoppingBag',
          type: 'expense',
          group_id: 'guest_group_lifestyle',
          
        },
        {
          _id: 'guest_cat_dining',
          category_name: 'Dining Out',
          icon: 'Coffee',
          type: 'expense',
          group_id: 'guest_group_lifestyle',
          
        },
        {
          _id: 'guest_cat_subscription',
          category_name: 'Subscriptions',
          icon: 'Tv',
          type: 'expense',
          group_id: 'guest_group_lifestyle',
          
        },
      ]
    },
    // Others Expense Group
    {
      _id: 'guest_group_others_expense',
      group_name: 'Others',
      type: 'expense',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_other_expense',
          category_name: 'Other',
          icon: 'MoreHorizontal',
          type: 'expense',
          group_id: 'guest_group_others_expense',
          
        },
      ]
    },
    // Income Group
    {
      _id: 'guest_group_income',
      group_name: 'Income',
      type: 'income',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_salary',
          category_name: 'Salary',
          icon: 'Wallet',
          type: 'income',
          group_id: 'guest_group_income',
          
        },
        {
          _id: 'guest_cat_freelance',
          category_name: 'Freelance',
          icon: 'Briefcase',
          type: 'income',
          group_id: 'guest_group_income',
          
        },
        {
          _id: 'guest_cat_bonus',
          category_name: 'Bonus',
          icon: 'Gift',
          type: 'income',
          group_id: 'guest_group_income',
          
        },
      ]
    },
    // Investment Group
    {
      _id: 'guest_group_investment',
      group_name: 'Investment',
      type: 'income',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_stocks',
          category_name: 'Stocks',
          icon: 'TrendingUp',
          type: 'income',
          group_id: 'guest_group_investment',
          
        },
        {
          _id: 'guest_cat_dividend',
          category_name: 'Dividends',
          icon: 'PiggyBank',
          type: 'income',
          group_id: 'guest_group_investment',
          
        },
        {
          _id: 'guest_cat_interest',
          category_name: 'Interest',
          icon: 'Percent',
          type: 'income',
          group_id: 'guest_group_investment',
          
        },
      ]
    },
    // Others Income Group
    {
      _id: 'guest_group_others_income',
      group_name: 'Others',
      type: 'income',
      created_at: new Date().toISOString(),
      categories: [
        {
          _id: 'guest_cat_other_income',
          category_name: 'Other',
          icon: 'MoreHorizontal',
          type: 'income',
          group_id: 'guest_group_others_income',
          
        },
      ]
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

const saveGuestCategories = (categories: GroupWithCategories[]) => {
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
    mutationFn: async (newCategory: Omit<Category, "_id" | "create_at"> & {group_id: string}) => {
      const categories = getGuestCategories();

      // Find the group with group_id
      const group = categories.find(g => g._id === newCategory.group_id);

      if(!group) {
        throw new Error("Group not found")
      }

      // Create new category
      const category: Category = {
        _id: `guest_cat_${Date.now()}`,
        category_name: newCategory.category_name,
        icon: newCategory.icon,
        type: newCategory.type,
        group_id: newCategory.group_id,
      };

      // Add category to the group
      group.categories.push(category);

      saveGuestCategories(categories);

      return category;
    },

    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['guest_categories']});
    }

  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryGroup } from "../types/Category";

const GUEST_CATEGORY_GROUPS_KEY = "guest_category_groups";

// Helper function
const getGuestCategorygroups = (): CategoryGroup[] => {
  try {
    const stored = localStorage.getItem(GUEST_CATEGORY_GROUPS_KEY);
    if (stored) return JSON.parse(stored);

    return getDefaultCategoryGroups();
  } catch (e) {
    console.error("Error loading guest category groups", e);
    return getDefaultCategoryGroups();
  }
};

function saveGuestCategoryGroups(groups: CategoryGroup[]) {
  try {
    localStorage.setItem(GUEST_CATEGORY_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error("Error saving category groups", e);
  }
}

// Default category groups for guest groups
function getDefaultCategoryGroups(): CategoryGroup[] {
  return [
    // Expense Groups
    {
      _id: "guest_group_essential",
      group_name: "Essential",
      type: "expense",
    },
    {
      _id: "guest_group_utilities",
      group_name: "Utilities",
      type: "expense",
    },
    {
      _id: "guest_group_lifestyle",
      group_name: "Lifestyle",
      type: "expense",
    },
    {
      _id: "guest_group_transport",
      group_name: "Transportation",
      type: "expense",
    },
    {
      _id: "guest_group_others_expense",
      group_name: "Others",
      type: "expense",
    },
    // Income Groups
    {
      _id: "guest_group_income",
      group_name: "Income",
      type: "income",
    },
    {
      _id: "guest_group_investment",
      group_name: "Investment",
      type: "income",
    },
    {
      _id: "guest_group_others_income",
      group_name: "Others",
      type: "income",
    },
  ];
}


// Query hook
export function useGuestCategoryGroups() {
  return useQuery({
    queryKey: ["guest-category-groups"],
    queryFn: () => getGuestCategorygroups(),
    staleTime: Infinity,
  });
}

// Create group mutation
export function useCreateGuestCategoryGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGroup: Omit<CategoryGroup, "_id" | "create_at">) => {
      const groups = getGuestCategorygroups();

      const group: CategoryGroup = {
        ...newGroup,
        _id: `guest_group_${Date.now()}`,
      };

      groups.push(group);
      saveGuestCategoryGroups(groups);

      return groups;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['guest-category-groups']});
    }
  });
}

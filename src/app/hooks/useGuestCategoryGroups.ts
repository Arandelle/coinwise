import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CategoryGroup {
  _id: string;
  group_name: string;
  type: 'expense' | 'income';
  created_at: string;
  user_id?: string;
}

const GUEST_CATEGORY_GROUPS_KEY = 'guest_category_groups';

// Helper functions
const getGuestCategoryGroups = (): CategoryGroup[] => {
  try {
    const stored = localStorage.getItem(GUEST_CATEGORY_GROUPS_KEY);
    if (stored) return JSON.parse(stored);
    return getDefaultCategoryGroups();
  } catch (e) {
    console.error("Error loading guest category groups:", e);
    return getDefaultCategoryGroups();
  }
};

const saveGuestCategoryGroups = (groups: CategoryGroup[]) => {
  try {
    localStorage.setItem(GUEST_CATEGORY_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error("Error saving guest category groups:", e);
  }
};

// Default category groups for guest users
function getDefaultCategoryGroups(): CategoryGroup[] {
  return [
    // Expense Groups
    {
      _id: 'guest_group_essential',
      group_name: 'Essential',
      type: 'expense',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_utilities',
      group_name: 'Utilities',
      type: 'expense',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_lifestyle',
      group_name: 'Lifestyle',
      type: 'expense',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_transport',
      group_name: 'Transportation',
      type: 'expense',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_others_expense',
      group_name: 'Others',
      type: 'expense',
      created_at: new Date().toISOString(),
    },
    // Income Groups
    {
      _id: 'guest_group_income',
      group_name: 'Income',
      type: 'income',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_investment',
      group_name: 'Investment',
      type: 'income',
      created_at: new Date().toISOString(),
    },
    {
      _id: 'guest_group_others_income',
      group_name: 'Others',
      type: 'income',
      created_at: new Date().toISOString(),
    },
  ];
}

// Query hook
export function useGuestCategoryGroups() {
  return useQuery({
    queryKey: ['guest-category-groups'],
    queryFn: () => getGuestCategoryGroups(),
    staleTime: Infinity,
  });
}

// Create group mutation
export function useCreateGuestCategoryGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGroup: Omit<CategoryGroup, '_id' | 'created_at'>) => {
      const groups = getGuestCategoryGroups();
      
      const group: CategoryGroup = {
        ...newGroup,
        _id: `guest_group_${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      groups.push(group);
      saveGuestCategoryGroups(groups);
      
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-category-groups'] });
    },
  });
}
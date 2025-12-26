import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  CategoryGroup,
  UpdateCategoryInput,
} from "../types/Category";
import { GroupWithCategories } from "../types/Category";
import { useUser } from "./useUser";
import {
  useCreateGuestCategory,
  useGuestCategories,
} from "./useGuestCategories";
import { useGuestCategoryGroups } from "./useGuestCategoryGroups";

// Helper : Generic fetch function
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  console.log("🌐 API Fetch:", {
    url,
    method: options?.method || "GET",
    status: res.status,
    ok: res.ok,
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = await res.text();
    }

    console.error("❌ API Error:", {
      url,
      status: res.status,
      error,
    });

    throw new Error(
      typeof error === "object"
        ? JSON.stringify(error)
        : error || `HTTP ${res.status}: ${res.statusText}`
    );
  }

  // Handle 204 No Content or empty responses
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    console.log("✅ Empty response (204)");
    return {} as T;
  }

  // Check if response has JSON content
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    console.log("✅ JSON Response:", data);
    return data as T;
  }

  // Fallback: try to parse as JSON
  try {
    const data = await res.json();
    console.log("✅ Response:", data);
    return data as T;
  } catch {
    // If parsing fails, return empty object
    console.log("⚠️ No JSON body, returning empty object");
    return {} as T;
  }
}

// ============================================
// CATEGORIES
// ============================================
export function useGroupWithCategories() {
  const { isAuthenticated} = useUser();
  const guestQuery = useGuestCategories();

  const apiQuery = useQuery({
    queryKey: ["group-with-categories"],
    queryFn: () =>
      apiFetch<GroupWithCategories[]>("/api/group-with-categories"),
    staleTime: 10 * 60 * 1000, // Categories rarely change, cache for 10 min
    enabled: isAuthenticated, // only fetch when user is logged in
  });

  // Return guest data if no user, otherwise return API data
  if (!isAuthenticated) {
    return guestQuery;
  }

  return apiQuery;
}

export function useCategory() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/api/categories"),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryGroups() {

  const { isAuthenticated } = useUser();
  const guestQuery = useGuestCategoryGroups();
  const apiQuery = useQuery({
    queryKey: ["category_group"],
    queryFn: () => apiFetch<CategoryGroup[]>("/api/category-groups"),
    staleTime: 10 * 60 * 1000,
    enabled: isAuthenticated,
  });
  if (!isAuthenticated) {
    return guestQuery;
  }

  return apiQuery;
}

interface TopCategory {
  _id?: string;
  usageCount?: number;
  category: {
    _id?: string;
    group_id?: string;
    category_name: string;
    type: string;
    icon: string;
    created_at?: string;
    user_id?: string;
  };
}

export function useTopCategories() {
  return useQuery({
    queryKey: ["top_categories"],
    queryFn: () => apiFetch<TopCategory[]>("/api/top-categories"),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const { isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const guestMutation = useCreateGuestCategory();

  const apiMutation = useMutation({
    mutationFn: (newCategory: Omit<Category, "_id">) =>
      apiFetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      }),
    onSuccess: () => {
      // invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["group-with-categories"] });
    },
  });

  return useMutation({
    mutationFn: async (newCategory: Omit<Category, "_id">) => {
      if (!isAuthenticated) {
        return await guestMutation.mutateAsync(newCategory);
      }
      return await apiMutation.mutateAsync(newCategory);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateCategoryInput;
    }) =>
      apiFetch(`/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "applicaton/json" },
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

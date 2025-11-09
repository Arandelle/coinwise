import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, CategoryGroup, UpdateCategoryInput } from "../types/Category";
import { GroupWithCategories } from "../components/TransactionsPage/CategoryModal";

// Helper : Generic fetch function
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  console.log("🌐 API Fetch:", {
    url,
    method: options?.method || 'GET',
    status: res.status,
    ok: res.ok
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
      error
    });

    throw new Error(
      typeof error === 'object' ? JSON.stringify(error) : error || `HTTP ${res.status}: ${res.statusText}`
    );
  }

  // Handle 204 No Content or empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    console.log("✅ Empty response (204)");
    return {} as T;
  }

  // Check if response has JSON content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
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
  return useQuery({
    queryKey: ['group-with-categories'],
    queryFn: () => apiFetch<GroupWithCategories[]>('/api/group-with-categories'),
    staleTime: 10 * 60 * 1000, // Categories rarely change, cache for 10 min
  });
}

export function useCategory(){
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => apiFetch<Category[]>('/api/categories'),
        staleTime: 10 * 60 * 1000
    })
}

export function useCategoryGroups(){
  return useQuery({
    queryKey: ["category_group"],
    queryFn: () => apiFetch<CategoryGroup[]>('/api/category-groups'),
    staleTime: 10 * 60 *1000
  })
}


export function useCreateCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (newCategory : Omit<Category , "_id">) =>
            apiFetch('/api/categories', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(newCategory)
            }),
        onSuccess: () => {
            // invalidate and refetch categories
            queryClient.invalidateQueries({queryKey: ['categories']});
        }
    });
}

export function useUpdateCategory(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, updates}: {id: string, updates: UpdateCategoryInput}) => 
            apiFetch(`/api/category/${id}`,{
                method: 'PUT',
                headers: {'Content-Type' : 'applicaton/json'},
                body: JSON.stringify(updates)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categories']});
        },
    });
}

export function useDeleteCategory(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => 
            apiFetch(`/api/categories/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
        }
    })
}
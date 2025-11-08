import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, CreateCategory, UpdateCategoryInput } from "../types/Category";
import { GroupWithCategories } from "../components/TransactionsPage/CategoryModal";

// Helper : Generic fetch function
async function apiFetch<T>(url: string, options?: RequestInit) : Promise<T> {
    const res = await fetch(url, options);

    if(!res.ok){
        const error = await res.text();
        throw new Error(error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json() as Promise<T>;
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

export function useCreateCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (newCategory : CreateCategory) =>
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
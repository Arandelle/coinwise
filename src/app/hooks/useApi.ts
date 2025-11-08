import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Helper : Generic fetch function
async function apiFetch(url: string, options?: RequestInit) {
    const res = await fetch(url, options);

    if(!res.ok){
        const error = await res.text();
        throw new Error(error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
}

// ============================================
// CATEGORIES
// ============================================
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch('/api/category'),
    staleTime: 10 * 60 * 1000, // Categories rarely change, cache for 10 min
  });
}
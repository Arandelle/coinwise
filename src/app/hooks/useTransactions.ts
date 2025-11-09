import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "../types/Transaction";
import { useUser } from "./useUser";
import { apiFetch } from "./useApi";

// For guest users (localStorage)
export function useGuestTransactions() {
  return useQuery({
    queryKey: ["transactions", "guest"],
    queryFn: () => {
      const stored: Record<string, Transaction> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("transaction_")) {
          try {
            stored[key] = JSON.parse(localStorage.getItem(key) || "");
          } catch (e) {
            console.error("Error loading transaction:", e);
          }
        }
      }

      const txList = Object.values(stored);
      return txList.sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );
    },
    staleTime: Infinity, // localStorage doesn't change unless we update it
  });
}

// For logged-in users (API)
export function useUserTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Error fetching transactions");
      }

      const data: Transaction[] = await response.json();
      return data.sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Wrapper hook that chooses the right one
export function useTransactions() {
  const { data: user } = useUser();

  const guestQuery = useGuestTransactions();
  const userQuery = useUserTransactions();

  // Return the appropriate query based on user status
  if (!user) {
    return guestQuery;
  }

  return {
    ...userQuery,
    // Disable guest query when logged in to avoid unnecessary localStorage reads
    data: userQuery.data,
  };
}

// ================ MUTATIONS =========================

// Create Transactions (for logged in users)
export function useCreateTransaction(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (newTransaction : Transaction) =>
            apiFetch('/api/transactions', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(newTransaction)
            }),
        onSuccess: () => {
            // invalidate and refetch categories
            queryClient.invalidateQueries({queryKey: ['transactions']});
        }
    });
}

export function useUpdateTransactions(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: {id: string, data: Omit<Transaction, '_id' | 'category_details'>}) => 
            apiFetch(`/api/transactions/${id}`,{
                method: 'PUT',
                headers: {'Content-Type' : 'applicaton/json'},
                body: JSON.stringify(data)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions']});
        },
    });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiFetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    },
  });
}

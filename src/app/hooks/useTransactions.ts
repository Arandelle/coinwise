// hooks/useTransactions.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "../types/Transaction";
import { useUser } from "./useUser";
import { apiFetch } from "./useApi";

const GUEST_TRANSACTIONS_KEY = 'guest_transactions';

// Helper functions for localStorage
const getGuestTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(GUEST_TRANSACTIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading guest transactions:", e);
    return [];
  }
};

const saveGuestTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(GUEST_TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Error saving guest transactions:", e);
  }
};

// For guest users (localStorage)
export function useGuestTransactions() {
  return useQuery({
    queryKey: ["transactions", "guest"],
    queryFn: () => {
      const txList = getGuestTransactions();
      return txList.sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );
    },
    staleTime: Infinity,
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

  if (!user) {
    return guestQuery;
  }

  return userQuery;
}

// ========== MUTATIONS ==========

// Create Transaction (for logged-in users)
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, '_id' | 'category_details'>) => {
      return await apiFetch<Transaction>("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
    },
    onMutate: async (newTransaction) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      // Snapshot previous value
      const previousTransactions = queryClient.getQueryData(["transactions"]);

      // Optimistically update cache
      queryClient.setQueryData(["transactions"], (old: Transaction[] = []) => {
        const tempTransaction = {
          ...newTransaction,
        } as Transaction;
        return [tempTransaction, ...old];
      });

      return { previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      console.error("Create transaction error:", err);
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["top_categories"] });
    },
  });
}

// Update Transaction (for logged-in users)
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      _id, 
      data 
    }: { 
      _id: string; 
      data: Omit<Transaction, '_id' | 'category_details'> 
    }) => {
      return await apiFetch<Transaction>(`/api/transactions/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onMutate: async ({ _id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData(["transactions"]);

      // Optimistically update
      queryClient.setQueryData(["transactions"], (old: Transaction[] = []) => {
        return old.map((tx) =>
          tx._id === _id ? { ...tx, ...data } : tx
        );
      });

      return { previousTransactions };
    },
    onError: (err, variables, context) => {
      console.error("Update transaction error:", err);
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["top_categories"] });
    },
  });
}

// Delete Transaction (for logged-in users)
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData(["transactions"]);

      // Optimistically remove
      queryClient.setQueryData(["transactions"], (old: Transaction[] = []) => {
        return old.filter((tx) => tx._id !== deletedId);
      });

      return { previousTransactions };
    },
    onError: (err, deletedId, context) => {
      console.error("Delete transaction error:", err);
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["top_categories"] });
    },
  });
}

// ========== GUEST MUTATIONS (localStorage) ==========

// Create/Update Guest Transaction
export function useGuestTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      const transactions = getGuestTransactions();
      
      // Check if updating or creating
      const existingIndex = transactions.findIndex(tx => tx._id === transaction._id);
      
      if (existingIndex >= 0) {
        // Update existing
        transactions[existingIndex] = transaction;
      } else {
        // Create new
        transactions.push(transaction);
      }
      
      saveGuestTransactions(transactions);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "guest"] });
    },
  });
}

// Delete Guest Transaction
export function useDeleteGuestTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const transactions = getGuestTransactions();
      const filtered = transactions.filter(tx => tx._id !== id);
      saveGuestTransactions(filtered);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "guest"] });
    },
  });
}

// ========== UNIFIED MUTATIONS ==========

// Universal create/update that works for both guest and logged-in users
export function useUpsertTransaction() {
  const { data: user } = useUser();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const guestMutation = useGuestTransactionMutation();

  return useMutation({
    mutationFn: async ({ 
      transaction, 
      isEditing 
    }: { 
      transaction: Transaction; 
      isEditing: boolean;
    }) => {
      // Guest user
      if (!user) {
        return await guestMutation.mutateAsync(transaction);
      }

      // Logged-in user
      const { _id, category_details, ...cleanData } = transaction;
      const transactionId = _id;

      console.log(JSON.stringify(category_details));
      
      if (isEditing && transactionId) {
        return await updateMutation.mutateAsync({
          _id: transactionId,
          data: cleanData as Omit<Transaction, '_id' | 'category_details'>
        });
      } else {
        return await createMutation.mutateAsync(
          cleanData as Omit<Transaction, '_id' | 'category_details'>
        );
      }
    },
  });
}

// Universal delete that works for both guest and logged-in users
export function useUniversalDeleteTransaction() {
  const { data: user } = useUser();
  const deleteMutation = useDeleteTransaction();
  const deleteGuestMutation = useDeleteGuestTransaction();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) {
        return await deleteGuestMutation.mutateAsync(id);
      }
      return await deleteMutation.mutateAsync(id);
    },
  });
}
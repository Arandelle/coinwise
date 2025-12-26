// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/Users";

export function useUser() {
  const query = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: query.data,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

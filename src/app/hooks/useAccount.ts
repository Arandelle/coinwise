import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./useApi";

interface Account {
    balance: number
}

export function useWallet(){
    return useQuery({
        queryKey: ["account"],
        queryFn: () => apiFetch<Account[]>("/api/wallet"),
        staleTime: 10 * 60 * 1000
    })
}
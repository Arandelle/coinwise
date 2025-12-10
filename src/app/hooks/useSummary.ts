import { useQuery } from "@tanstack/react-query";
import { Summary, SummaryResponse } from "../types/Summary";

export function useSummary(filters?: Summary){
    return useQuery({
        queryKey: ["summary", filters],
        queryFn: async () => {
            // Build query params
            const params = new URLSearchParams();

            if (filters){
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== ""){
                        params.append(key, value.toString())
                    }
                })
            }

            const response = await fetch(`/api/summary?${params.toString()}`);

            if (!response.ok){
                throw new Error("Error fetching summary");
            }

            const data : SummaryResponse = await response.json();
            return data
        } 
    })
}
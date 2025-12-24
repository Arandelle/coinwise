import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useApi";
import { useUser } from "./useUser";

interface AiChatResponse {
    reply: string;
    history_count: number
}

interface SendChatPayload {
    prompt: string
}
interface ConversationHistory {
    history: Array<{
        role: "user" | "model" | "assistant";
        content: string;
        timestamp: string
    }>;
    count: number,
    total: number,
    has_more: boolean,
    page: number,
    total_pages: number,
    skip?: number, // number of skip used
    limit?: number // limit per page
}

export function useAiChat() {
    return useInfiniteQuery<ConversationHistory>({
        queryKey: ["ai_chat"],
        queryFn: async ({ pageParam = 0 }) => {
            const limit = 20;
            const skip = pageParam as number;
            return apiFetch(`/api/chat-ai?limit=${limit}&skip=${skip}`);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.has_more) return undefined;
            // Calculate total messages loaded so far
            const totalLoaded = allPages.reduce((sum, page) => sum + page.count, 0);
            return totalLoaded;
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}


export function useSendChat(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendChatPayload) => apiFetch<AiChatResponse>("/api/chat-ai", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(payload)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["ai_chat"]});
        },
        onError: (error) => {
            console.error("Error sending AI chat message:", error);
        }
    })
}

// Clear conversation history
export function useClearAiChat(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => apiFetch("/api/chat-ai", {
            method: "DELETE",
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai_chat"]})
        }
    })
}
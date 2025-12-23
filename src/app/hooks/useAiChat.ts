import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useApi";

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
    }>
}

export function useAiChat(){
    return useQuery<ConversationHistory>({
        queryKey: ["ai_chat"],
        queryFn: async () => apiFetch("/api/chat-ai"),
        staleTime: 10 * 60 * 1000
    })
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
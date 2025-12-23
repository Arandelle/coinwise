import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./useApi";

interface AiChatResponse {
    reply: string;
    history_count: number
}

interface SendChatPayload {
    prompt: string
}

export function useAiChat(){
    return useQuery({
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
        }
    })
}
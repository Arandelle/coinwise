import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiFetch } from "./useApi";

interface AiChatResponse {
  reply: string;
  history_count: number;
}

interface SendChatPayload {
  prompt: string;
}

interface ConversationHistory {
  history: Array<{
    role: "user" | "model" | "assistant";
    content: string;
    timestamp: string;
  }>;
  count: number;
  total: number;
  has_more: boolean;
  page: number;
  total_pages: number;
  skip?: number;
  limit?: number;
}

// New infinite query hook for pagination
export function useAiChatInfinite(isAuthenticated: boolean) {
  return useInfiniteQuery<ConversationHistory>({
    queryKey: ["ai_chat_infinite", isAuthenticated],
    queryFn: async ({ pageParam = 0 }) => {
      // For guests, return empty history
      if (!isAuthenticated) {
        return {
          history: [],
          count: 0,
          total: 0,
          has_more: false,
          page: 1,
          total_pages: 1,
          skip: 0,
          limit: 20,
        };
      }

      // For authenticated users, fetch from API
      return apiFetch(`/api/chat-ai?skip=${pageParam}&limit=20`);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return (lastPage.skip || 0) + (lastPage.limit || 20);
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000,
    enabled: isAuthenticated,
  });
}

// Keep the original for backward compatibility if needed
export function useAiChat(isAuthenticated: boolean) {
  return useQuery<ConversationHistory>({
    queryKey: ["ai_chat"],
    queryFn: async () => {
      if (!isAuthenticated) {
        return {
          history: [],
          count: 0,
          total: 0,
          has_more: false,
          page: 1,
          total_pages: 1,
          skip: 0,
          limit: 20,
        };
      }
      return apiFetch("/api/chat-ai?limit=20&skip=0");
    },

    staleTime: 10 * 60 * 1000,
  });
}

export function useSendChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendChatPayload) =>
      apiFetch<AiChatResponse>("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate both query keys
      queryClient.invalidateQueries({ queryKey: ["ai_chat"] });
      queryClient.invalidateQueries({ queryKey: ["ai_chat_infinite"] });
    },
    onError: (error) => {
      console.error("Error sending AI chat message:", error);
    },
  });
}

// Clear conversation history
export function useClearAiChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      apiFetch("/api/chat-ai", {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai_chat"] });
      queryClient.invalidateQueries({ queryKey: ["ai_chat_infinite"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesApi, streamMessageApi } from "../api/chatApi.js";

/**
 * Hook for fetching messages in a chat with cursor-based pagination.
 * Uses TanStack Query's infinite query for "load more" functionality.
 */
export function useMessages(chatId) {
  return useQuery({
    queryKey: ["chats", chatId, "messages"],
    queryFn: () => getMessagesApi(chatId),
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching messages with infinite scroll (cursor pagination).
 */
export function useInfiniteMessages(chatId) {
  return useInfiniteQuery({
    queryKey: ["chats", chatId, "messages", "infinite"],
    queryFn: ({ pageParam }) => getMessagesApi(chatId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook for sending a message in a chat.
 * Invalidates message cache on success.
 */
export function useSendMessage(chatId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, onEvent }) => streamMessageApi(chatId, content, onEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", chatId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

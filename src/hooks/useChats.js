import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatsApi, createChatApi, deleteChatApi, updateChatTitleApi } from "../api/chatApi.js";

/**
 * Hook for fetching the user's chat list with pagination.
 * Uses TanStack Query for caching and automatic refetching.
 */
export function useChats(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["chats", page, limit],
    queryFn: () => getChatsApi(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a new chat.
 * Invalidates chat list cache on success.
 */
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title) => createChatApi(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Hook for deleting a chat.
 * Invalidates chat list cache on success.
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId) => deleteChatApi(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/**
 * Hook for updating a chat's title.
 */
export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, title }) => updateChatTitleApi(chatId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

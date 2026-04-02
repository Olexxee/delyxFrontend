import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchConversationDetail,
  fetchConversationMessages,
  fetchInbox,
  markConversationRead,
  sendConversationMessage,
} from "@/api/conversationService";
import type { ChatMessage } from "@/types/converstionType";

export const conversationKeys = {
  all: ["conversations"] as const,
  inbox: () => [...conversationKeys.all, "inbox"] as const,
  detail: (chatRoomId: string) =>
    [...conversationKeys.all, "detail", chatRoomId] as const,
  messages: (chatRoomId: string) =>
    [...conversationKeys.all, "messages", chatRoomId] as const,
};

export const useInbox = () => {
  return useQuery({
    queryKey: conversationKeys.inbox(),
    queryFn: fetchInbox,
  });
};

export const useConversationDetail = (chatRoomId?: string) => {
  return useQuery({
    queryKey: conversationKeys.detail(chatRoomId || ""),
    queryFn: () => fetchConversationDetail(chatRoomId!),
    enabled: Boolean(chatRoomId),
  });
};

export const useConversationMessages = (chatRoomId?: string) => {
  return useInfiniteQuery({
    queryKey: conversationKeys.messages(chatRoomId || ""),
    queryFn: ({ pageParam }) =>
      fetchConversationMessages({
        chatRoomId: chatRoomId!,
        before: pageParam,
      }),
    enabled: Boolean(chatRoomId),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || lastPage.messages.length === 0) {
        return undefined;
      }

      return lastPage.messages[lastPage.messages.length - 1]?.createdAt;
    },
  });
};

export const useSendConversationMessage = (
  chatRoomId: string,
  currentUserId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendConversationMessage,
    onMutate: async ({ content, mediaIds = [] }) => {
      await queryClient.cancelQueries({
        queryKey: conversationKeys.messages(chatRoomId),
      });

      const previous = queryClient.getQueryData(
        conversationKeys.messages(chatRoomId),
      );

      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        chatRoomId,
        sender: {
          id: currentUserId,
          username: "Me",
          profilePicture: null,
        },
        content: content || "",
        media: mediaIds,
        messageType:
          content && mediaIds.length
            ? "mixed"
            : mediaIds.length
              ? "media"
              : "text",
        meta: null,
        createdAt: new Date().toISOString(),
        isMine: true,
      };

      queryClient.setQueryData(
        conversationKeys.messages(chatRoomId),
        (old: any) => {
          if (!old?.pages?.length) {
            return {
              pages: [
                {
                  messages: [optimisticMessage],
                  count: 1,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                messages: [optimisticMessage, ...firstPage.messages],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          conversationKeys.messages(chatRoomId),
          context.previous,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(chatRoomId),
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.inbox(),
      });
    },
  });
};

export const useMarkConversationRead = (chatRoomId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatRoomId) return;

    markConversationRead(chatRoomId)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.inbox(),
        });
      })
      .catch(() => {});
  }, [chatRoomId, queryClient]);
};
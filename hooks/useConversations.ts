import {
    fetchConversationDetail,
    fetchConversationMessages,
    fetchInbox,
    markConversationRead,
    sendConversationMessage,
} from "@/api/conversationService";
import type { ChatMessage } from "@/types/conversation";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

export const conversationKeys = {
  all: ["conversations"] as const,
  inbox: () => [...conversationKeys.all, "inbox"] as const,
  detail: (chatRoomId: string) =>
    [...conversationKeys.all, "detail", chatRoomId] as const,
  messages: (chatRoomId: string) =>
    [...conversationKeys.all, "messages", chatRoomId] as const,
};

export const sortAscending = (a: ChatMessage, b: ChatMessage): number => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

export const sortDescending = (a: ChatMessage, b: ChatMessage): number => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
    mutationFn: (variables) =>
      sendConversationMessage({ chatRoomId, ...variables }),
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
        kind: "user",
        contentType:
          content && mediaIds.length
            ? "mixed"
            : mediaIds.length
              ? "media"
              : "text",
        sender: {
          id: currentUserId,
          username: "Me",
          profilePicture: null,
        },
        content: content || "",
        media: mediaIds,
        meta: null,
        createdAt: new Date().toISOString(),
        isMine: true,
      };
      queryClient.setQueryData(
        conversationKeys.messages(chatRoomId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, messages: [optimisticMessage, ...page.messages] }
                : page,
            ),
          };
        },
      );

      return { previous };
    },
    onError: (
      _error: unknown,
      _variables: { content: string; mediaIds?: string[] },
      context: { previous: any } | undefined,
    ) => {
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

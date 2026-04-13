import { UserContext } from "@/authContext/UserContext";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatThreadLayout } from "@/components/chat/ChatThreadLayout";
import { GroupContextStrip } from "@/components/chat/GroupContextStrip";
import {
  useConversationDetail,
  useConversationMessages,
  useMarkConversationRead,
  useSendConversationMessage,
} from "@/hooks/useConversations";
import { useRealtimeConversation } from "@/hooks/useRealtimeConversation";
import {
  mapConversationDetailToChatHeaderVM,
  mapConversationDetailToGroupContextStripVM,
} from "@/mappers/conversation.mapper";
import { mapChatMessageToVM } from "@/mappers/message.mapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function ChatRoomScreen() {
  const router = useRouter();
  const { chatRoomId } = useLocalSearchParams<{ chatRoomId: string }>();
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");

  const { data: detail, isLoading: detailLoading } =
    useConversationDetail(chatRoomId);

  const {
    data: messagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversationMessages(chatRoomId);

  const sendMutation = useSendConversationMessage(
    chatRoomId || "",
    user?.id || "",
  );

  useMarkConversationRead(chatRoomId);
  useRealtimeConversation(chatRoomId, user?.id);

  const headerVM = useMemo(() => {
    return detail ? mapConversationDetailToChatHeaderVM(detail) : null;
  }, [detail]);

  const groupContextVM = useMemo(() => {
    return detail ? mapConversationDetailToGroupContextStripVM(detail) : null;
  }, [detail]);

  const messageVMs = useMemo(() => {
    return (
      messagesData?.pages.flatMap((page) =>
        page.messages.map((message) => mapChatMessageToVM(message, user?.id)),
      ) || []
    );
  }, [messagesData, user?.id]);

  const handleSend = async () => {
    const value = text.trim();
    if (!value || !chatRoomId) return;

    setText("");

    try {
      await sendMutation.mutateAsync({
        content: value,
      });
    } catch {
      setText(value);
    }
  };

  const handleSystemAction = (tournamentId: string) => {
    router.push({
      pathname: "/(tabs)/tournaments/[tournamentId]",
      params: { tournamentId },
    });
  };

  const handleOpenGroupContext = (tournamentId: string) => {
    router.push({
      pathname: "/(tabs)/tournaments/[tournamentId]",
      params: { tournamentId },
    });
  };

  const handleOpenInfo = () => {
    if (!detail?.groupMeta?.groupId) return;

    router.push({
      pathname: "/(tabs)/group/[groupId]/info",
      params: { groupId: detail.groupMeta.groupId },
    });
  };

  if (!chatRoomId || detailLoading || messagesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (!detail || !headerVM || !groupContextVM) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-base">Conversation not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ChatThreadLayout
        header={
          <ChatHeader
            vm={headerVM}
            onBack={() => router.back()}
            onOpenInfo={handleOpenInfo}
          />
        }
        contextStrip={
          groupContextVM.visible ? (
            <GroupContextStrip
              vm={groupContextVM}
              onPress={handleOpenGroupContext}
            />
          ) : undefined
        }
        messageList={
          <ChatMessageList
            messages={messageVMs}
            onSystemAction={handleSystemAction}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          />
        }
        composer={
          <ChatComposer
            value={text}
            onChange={setText}
            onSend={handleSend}
            disabled={sendMutation.isPending}
          />
        }
      />
    </View>
  );
}

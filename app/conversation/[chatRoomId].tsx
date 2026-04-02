import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useConversationDetail,
  useConversationMessages,
  useMarkConversationRead,
  useSendConversationMessage,
} from "@/hooks/useConversations";
import { useRealtimeConversation } from "@/hooks/useRealtimeConversation";
import type { ChatMessage } from "@/types/converstionType";

function ConversationHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <View className="px-4 py-3 border-b border-neutral-800 flex-row items-center">
      <Pressable onPress={onBack} className="mr-3">
        <Text className="text-white text-base">Back</Text>
      </Pressable>

      <View className="flex-1">
        <Text className="text-white text-lg font-semibold">{title}</Text>
        {subtitle ? (
          <Text className="text-neutral-400 text-sm mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

function GroupContextStrip({
  tournamentName,
  tournamentStatus,
}: {
  tournamentName?: string;
  tournamentStatus?: string;
}) {
  if (!tournamentName) return null;

  return (
    <View className="mx-4 mt-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
      <Text className="text-white font-medium">{tournamentName}</Text>
      <Text className="text-neutral-400 text-sm mt-1">{tournamentStatus}</Text>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const align = message.isMine ? "items-end" : "items-start";
  const bubble = message.isMine ? "bg-blue-600" : "bg-neutral-800";

  if (message.messageType === "system") {
    return (
      <View className="items-center my-2 px-4">
        <View className="bg-neutral-900 border border-neutral-800 rounded-full px-3 py-2">
          <Text className="text-neutral-300 text-xs">{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`px-4 my-1 ${align}`}>
      {!message.isMine && message.sender?.username ? (
        <Text className="text-neutral-500 text-xs mb-1">
          {message.sender.username}
        </Text>
      ) : null}

      <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${bubble}`}>
        {message.content ? (
          <Text className="text-white">{message.content}</Text>
        ) : null}

        {message.media.length > 0 ? (
          <Text className="text-neutral-200 text-xs mt-2">
            {message.media.length} attachment
            {message.media.length > 1 ? "s" : ""}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function ConversationScreen() {
  const router = useRouter();
  const { chatRoomId, userId } = useLocalSearchParams<{
    chatRoomId: string;
    userId?: string;
  }>();
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

  const sendMutation = useSendConversationMessage(chatRoomId, userId || "");
  useMarkConversationRead(chatRoomId);
  useRealtimeConversation(chatRoomId, userId);

  const messages = useMemo(
    () => messagesData?.pages.flatMap((page) => page.messages) || [],
    [messagesData],
  );

  const handleSend = async () => {
    const value = text.trim();
    if (!value) return;

    setText("");

    try {
      await sendMutation.mutateAsync({
        chatRoomId,
        content: value,
      });
    } catch {
      setText(value);
    }
  };

  if (!chatRoomId || detailLoading || messagesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Conversation not found</Text>
      </View>
    );
  }

  const subtitle =
    detail.conversation.type === "group"
      ? `${detail.groupMeta?.totalMembers || 0} members`
      : detail.directMeta?.isOnline
        ? "Online"
        : "Offline";

  return (
    <View className="flex-1 bg-black">
      <ConversationHeader
        title={detail.conversation.title}
        subtitle={subtitle}
        onBack={() => router.back()}
      />

      {detail.conversation.type === "group" ? (
        <GroupContextStrip
          tournamentName={detail.groupMeta?.activeTournament?.name}
          tournamentStatus={detail.groupMeta?.activeTournament?.status}
        />
      ) : null}

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      <View className="px-4 py-3 border-t border-neutral-800 bg-black flex-row items-center gap-3">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#737373"
          className="flex-1 bg-neutral-900 text-white rounded-2xl px-4 py-3"
        />

        <Pressable
          onPress={handleSend}
          disabled={sendMutation.isPending}
          className="px-4 py-3 rounded-2xl bg-blue-600"
        >
          <Text className="text-white font-medium">
            {sendMutation.isPending ? "..." : "Send"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

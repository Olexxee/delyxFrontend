import { UserContext } from "@/authContext/UserContext";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { GroupContextStrip } from "@/components/chat/GroupContextStrip";
import { useGroupShell } from "@/authContext/GroupShellContext";
import {
  useConversationDetail,
  useConversationMessages,
  useMarkConversationRead,
  useSendConversationMessage,
} from "@/hooks/useConversations";
import { useRealtimeConversation } from "@/hooks/useRealtimeConversation";
import { mapConversationDetailToGroupContextStripVM } from "@/mappers/conversation.mapper";
import { mapChatMessageToVM } from "@/mappers/message.mapper";
import { useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupChatScreen() {
  const router = useRouter();
  const { shell } = useGroupShell();
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  const chatRoomId = shell.chatRoomId;

  const { data: detail, isLoading: detailLoading } = useConversationDetail(chatRoomId);

  const {
    data: messagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversationMessages(chatRoomId);

  const sendMutation = useSendConversationMessage(chatRoomId, user?.id || "");

  useMarkConversationRead(chatRoomId);
  useRealtimeConversation(chatRoomId, user?.id);

  const groupContextVM = useMemo(() => {
    return detail ? mapConversationDetailToGroupContextStripVM(detail) : null;
  }, [detail]);

  const messageVMs = useMemo(() => {
    return (
      messagesData?.pages.flatMap((page) =>
        Array.isArray(page.messages)
          ? page.messages.map((msg) => mapChatMessageToVM(msg, user?.id))
          : []
      ) || []
    );
  }, [messagesData, user?.id]);

  const handleSend = async () => {
    const value = text.trim();
    if (!value || !chatRoomId) return;
    setText("");
    try {
      await sendMutation.mutateAsync({ content: value });
    } catch {
      setText(value);
    }
  };

  if (!chatRoomId) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <Text style={{ color: "#666", fontSize: 14 }}>No chat room linked to this group</Text>
      </View>
    );
  }

  if (detailLoading || messagesLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#000" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Tournament context strip */}
      {groupContextVM?.visible && (
        <GroupContextStrip
          vm={groupContextVM}
          onPress={(tournamentId) =>
            router.push({
              pathname: "/(tabs)/tournaments/[tournamentId]",
              params: { tournamentId },
            })
          }
        />
      )}

      {/* Message list — takes all remaining space */}
      <View style={{ flex: 1 }}>
        <ChatMessageList
          messages={messageVMs}
          onSystemAction={(tournamentId) =>
            router.push({
              pathname: "/(tabs)/tournaments/[tournamentId]",
              params: { tournamentId },
            })
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
        />
      </View>

      {/* Composer pinned to bottom with safe area */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatComposer
          value={text}
          onChange={setText}
          onSend={handleSend}
          disabled={sendMutation.isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
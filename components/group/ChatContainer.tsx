import React, { useContext } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserContext } from "@/authContext/UserContext";
import ChatHeader from "@/components/group/ChatHeader";
import ChatInput from "@/components/group/ChatInput";
import MessageList from "@/components/group/MessageList";
import { useChatEngine } from "@/hooks/useChatEngine";
import { useTheme } from "@/theme/ThemeProvider";

type ChatContainerProps = {
  chatRoomId: string;
  name: string;
  avatarUri?: string;
  onBack: () => void;
};

export default function ChatContainer({ chatRoomId, name, avatarUri, onBack }: ChatContainerProps) {
  const { user } = useContext(UserContext);
  const { colors } = useTheme();

  if (!user) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;

  const userId = user._id;

  const { messages, setMessages: setMessagesInternal, loading } = useChatEngine(chatRoomId, userId);

  const setMessages: React.Dispatch<React.SetStateAction<any[]>> = (updater) => {
    setMessagesInternal((prev) => {
      const safePrev: any[] = prev ?? [];
      if (typeof updater === "function") return (updater as (prevState: any[]) => any[])(safePrev);
      return updater;
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ChatHeader name={name} avatarUri={avatarUri} onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList messages={messages} />

        <ChatInput chatRoomId={chatRoomId} userId={userId} setMessages={setMessages} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

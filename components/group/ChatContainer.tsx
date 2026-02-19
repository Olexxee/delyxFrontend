import React, { useContext } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
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

export default function ChatContainer({
  chatRoomId,
  name,
  avatarUri,
  onBack,
}: ChatContainerProps) {
  const { user, isRestoring } = useContext(UserContext);
  const { colors } = useTheme();

  // Support both _id (MongoDB) and id (REST) shapes so this doesn't silently
  // break if the User type changes. The log showed user._id was undefined.
  const userId = (user as any)?._id ?? (user as any)?.id ?? "";

  // Hooks must always be called unconditionally — before any early returns.
  // userId is "" while the session restores; the hook guards on it internally.
  const { messages, loading, sendMessage, isConnected } = useChatEngine(
    chatRoomId,
    userId,
  );

  // Block render until AsyncStorage finishes restoring the session.
  // Previously we only guarded on !user, but isRestoring=true means user is
  // still null while the async read is in flight — so useChatEngine was firing
  // with userId="" on every mount, the guard blocked hydration, and the effect
  // never re-ran because userId never changed from "" to a real value.
  if (isRestoring || !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <ChatHeader name={name} avatarUri={avatarUri} onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList messages={messages} loading={loading} />

        <ChatInput
          chatRoomId={chatRoomId}
          sendMessage={sendMessage}
          isConnected={isConnected}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
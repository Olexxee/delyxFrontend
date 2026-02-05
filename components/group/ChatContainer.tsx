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
import { useChatEngine } from "@/hooks/useChatEngine";
import ChatHeader from "@/components/group/ChatHeader";
import ChatInput from "@/components/group/ChatInput";
import MessageList from "@/components/group/MessageList";
import { useTheme } from "@/theme/ThemeProvider";

/* ---------------------------------- */
/* Props                               */
/* ---------------------------------- */

type ChatContainerProps = {
  chatRoomId: string;
  name: string;
  avatarUri?: string;
  onBack: () => void;
};

/* ---------------------------------- */
/* Component                           */
/* ---------------------------------- */

export default function ChatContainer({
  chatRoomId,
  name,
  avatarUri,
  onBack,
}: ChatContainerProps) {
  const { user } = useContext(UserContext);
  const { colors } = useTheme();

  if (!user) return <LoadingState />;

  const userId = user._id;

  // 🔹 Engine now returns ONLY what UI needs
  const { messages, setMessages, loading } = useChatEngine(
    chatRoomId,
    userId,
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <ChatHeader
        name={name}
        avatarUri={avatarUri}
        onBack={onBack}
      />

      <View style={styles.content}>
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Pure presentational list */}
            <MessageList messages={messages} />

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              <ChatInput
                chatRoomId={chatRoomId}
                userId={userId}
                setMessages={setMessages}
              />
            </KeyboardAvoidingView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------------- */
/* Loading State                       */
/* ---------------------------------- */

function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  );
}

/* ---------------------------------- */
/* Styles                              */
/* ---------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

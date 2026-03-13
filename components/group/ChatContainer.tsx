import React, { useContext } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { UserContext } from "@/authContext/UserContext";
import ChatHeader from "@/components/group/ChatHeader";
import ChatInput from "@/components/group/ChatInput";
import MessageList from "@/components/group/MessageList";
import TournamentCard from "@/components/tournament/TournamentCard";
import { useChatEngine } from "@/hooks/useChatEngine";
import { useTournamentDetail } from "@/hooks/useTournaments";
import { toTournament } from "@/types/tournament";
import { useTheme } from "@/theme/ThemeProvider";

type ChatContainerProps = {
  chatRoomId: string;
  name: string;
  avatarUri?: string;
  memberCount?: number;
  onBack: () => void;
  tournamentId?: string;
  groupId?: string;
};

export default function ChatContainer({
  chatRoomId,
  name,
  avatarUri,
  memberCount,
  onBack,
  tournamentId,
  groupId,
}: ChatContainerProps) {
  const { user, isRestoring } = useContext(UserContext);
  const { colors } = useTheme();
  const router = useRouter();

  const userId = (user as any)?._id ?? (user as any)?.id ?? "";

  const { messages, loading, sendMessage, isConnected } = useChatEngine(
    chatRoomId,
    userId,
  );

  // Fetch pinned tournament if a tournamentId is linked to this chat room
  const { data: pinnedTournamentRaw } = useTournamentDetail(tournamentId ?? "");
  const pinnedTournament = pinnedTournamentRaw ?? null;

  if (isRestoring || !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function handleTournamentPress() {
    if (!tournamentId) return;
    router.push({
      pathname: "/(tabs)/tournaments/[tournamentId]",
      params: { tournamentId },
    });
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ChatHeader
        name={name}
        avatarUri={avatarUri}
        memberCount={memberCount}
        onBack={onBack}
        groupId={groupId ?? chatRoomId}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Pinned tournament card — shown when a tournament is linked */}
        {pinnedTournament && (
          <TournamentCard
            tournament={pinnedTournament}
            onPress={handleTournamentPress}
          />
        )}

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
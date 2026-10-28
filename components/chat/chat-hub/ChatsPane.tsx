import { useMemo, useState } from "react";
import {
  FlatList,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import type { ConversationListItemVM } from "@/view-models/conversation.vm";
import { ConversationPreviewCard } from "@/components/preview/ConversationPreviewCard";
import { StatePanel } from "@/components/ui/StatePanel";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  items: ConversationListItemVM[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function ChatsPane({ items, isLoading, isError, onRetry }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) =>
      normalizedQuery
        ? item.title.toLowerCase().includes(normalizedQuery)
        : true,
    );
  }, [items, query]);

  const handleOpenConversation = (item: ConversationListItemVM) => {
    router.push({
      pathname: "/(chats)/[chatRoomId]",
      params: { chatRoomId: item.chatRoomId },
    });
  };

  if (isLoading) {
    return <StatePanel variant="loading" title="Loading chats" />;
  }

  if (isError) {
    return (
      <StatePanel
        variant="error"
        title="Couldn’t load chats"
        message="Check your connection and try again."
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  return (
    <View className="flex-1">
      <View className="px-4 pb-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search chats"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search chats"
          style={{ backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 }}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationPreviewCard
            item={item}
            onPress={handleOpenConversation}
          />
        )}
        ListEmptyComponent={
          <StatePanel
            variant="empty"
            title={query.trim() ? "No chats match" : "No direct messages yet"}
            message={query.trim() ? "Try a different search term." : "Your direct conversations will appear here."}
            compact
          />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import type { ConversationListItemVM } from "@/view-models/conversation.vm";
import { ConversationPreviewCard } from "@/components/preview/ConversationPreviewCard";

type Props = {
  items: ConversationListItemVM[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function ChatsPane({ items, isLoading, isError, onRetry }: Props) {
  const router = useRouter();
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
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-white text-base mb-4">Failed to load chats</Text>
        <Pressable
          onPress={onRetry}
          className="px-4 py-2 rounded-xl bg-neutral-800"
        >
          <Text className="text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="px-4 pb-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search chats"
          placeholderTextColor="#737373"
          className="bg-neutral-900 text-white rounded-2xl px-4 py-3"
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
          <View className="mt-20 items-center px-6">
            <Text className="text-neutral-500 text-center">
              No direct messages yet
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

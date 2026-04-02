import { useInbox } from "@/hooks/useConversations";
import type { ConversationItem } from "@/types/converstionType";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const FILTERS = ["all", "group", "direct", "unread"] as const;
type FilterType = (typeof FILTERS)[number];

function ConversationRow({
  item,
  onPress,
}: {
  item: ConversationItem;
  onPress: (item: ConversationItem) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="px-4 py-3 border-b border-neutral-800"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-semibold text-base">
              {item.title}
            </Text>

            {item.type === "group" && item.groupMeta?.activeTournament ? (
              <View className="px-2 py-0.5 rounded-full bg-neutral-800">
                <Text className="text-xs text-neutral-300">
                  {item.groupMeta.activeTournament.status}
                </Text>
              </View>
            ) : null}
          </View>

          <Text numberOfLines={1} className="text-neutral-400 mt-1">
            {item.lastMessage?.text || "No messages yet"}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs text-neutral-500">
            {item.lastMessage?.createdAt
              ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : ""}
          </Text>

          {item.unreadCount > 0 ? (
            <View className="mt-2 min-w-6 h-6 px-2 rounded-full bg-blue-600 items-center justify-center">
              <Text className="text-white text-xs font-semibold">
                {item.unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function ConversationsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useInbox();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const items = useMemo(() => {
    const source = data?.items || [];

    return source.filter((item) => {
      const matchesQuery = item.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unread"
            ? item.unreadCount > 0
            : item.type === filter;

      return matchesQuery && matchesFilter;
    });
  }, [data?.items, query, filter]);

  const handleOpenConversation = (item: ConversationItem) => {
    router.push({
      pathname: "/(chats)/[chatRoomId]",
      params: {
        chatRoomId: item.id,
      },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-base mb-4">
          Failed to load conversations
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="px-4 py-2 rounded-xl bg-neutral-800"
        >
          <Text className="text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold mb-4">Messages</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations"
          placeholderTextColor="#737373"
          className="bg-neutral-900 text-white rounded-2xl px-4 py-3 mb-3"
        />

        <View className="flex-row gap-2">
          {FILTERS.map((item) => {
            const active = filter === item;

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className={`px-3 py-2 rounded-full ${
                  active ? "bg-white" : "bg-neutral-900"
                }`}
              >
                <Text className={active ? "text-black" : "text-white"}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow item={item} onPress={handleOpenConversation} />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

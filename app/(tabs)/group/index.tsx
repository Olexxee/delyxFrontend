import { useMyGroups } from "@/hooks/useMyGroups";
import type { MyGroupItem } from "@/types/group";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

function GroupRow({
  item,
  onPress,
}: {
  item: MyGroupItem;
  onPress: (item: MyGroupItem) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="px-4 py-3 border-b border-neutral-800 flex-row items-center gap-3"
    >
      {/* Avatar */}
      <View className="w-12 h-12 rounded-2xl bg-neutral-800 items-center justify-center">
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            className="w-12 h-12 rounded-2xl"
          />
        ) : (
          <Text className="text-white font-bold text-lg">
            {item.name[0].toUpperCase()}
          </Text>
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-semibold text-base">
            {item.name}
          </Text>
          {item.myRole === "owner" || item.myRole === "admin" ? (
            <View className="px-1.5 py-0.5 rounded bg-neutral-700">
              <Text className="text-neutral-300 text-xs">{item.myRole}</Text>
            </View>
          ) : null}
          {item.activeTournament ? (
            <View className="px-1.5 py-0.5 rounded bg-blue-900">
              <Text className="text-blue-300 text-xs">
                {item.activeTournament.status}
              </Text>
            </View>
          ) : null}
        </View>

        <Text numberOfLines={1} className="text-neutral-400 text-sm mt-0.5">
          {item.lastMessagePreview ?? item.description ?? "No messages yet"}
        </Text>
      </View>

      {/* Members */}
      <Text className="text-neutral-500 text-xs">
        {item.totalMembers} members
      </Text>
    </Pressable>
  );
}

export default function GroupsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useMyGroups();

  const handlePress = (item: MyGroupItem) => {
    router.push({
      pathname: "/group",
      params: { groupId: item.id, chatRoomId: item.chatRoomId },
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
        <Text className="text-white text-base mb-4">Failed to load groups</Text>
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
        <Text className="text-white text-2xl font-bold">Groups</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupRow item={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-neutral-500">
              You haven't joined any groups yet
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

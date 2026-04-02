import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import type { MemberSummary } from "@/types/member";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const useGroupMembers = (groupId: string) =>
  useQuery<MemberSummary[]>({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      const res = await api.get(`/groups/${groupId}/members`);
      return res.data.members;
    },
    enabled: Boolean(groupId),
  });

function MemberRow({ item }: { item: MemberSummary }) {
  return (
    <View className="px-4 py-3 border-b border-neutral-800 flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center">
        <Text className="text-white font-semibold">
          {item.displayName[0].toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-medium">{item.displayName}</Text>
        <Text className="text-neutral-500 text-sm capitalize">{item.role}</Text>
      </View>
      {item.isOnline && <View className="w-2 h-2 rounded-full bg-green-500" />}
    </View>
  );
}

export default function GroupMembersScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { data, isLoading } = useGroupMembers(groupId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">
          Members · {data?.length ?? 0}
        </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberRow item={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

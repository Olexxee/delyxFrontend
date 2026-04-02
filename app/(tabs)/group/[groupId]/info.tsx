import { useGroupInfo } from "@/api/groups.api";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View, ScrollView } from "react-native";

export default function GroupInfoScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { data, isLoading } = useGroupInfo(groupId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="px-4 pt-4 pb-8">
        <Text className="text-white text-2xl font-bold mb-1">{data?.name}</Text>
        <Text className="text-neutral-400 text-sm mb-6">
          {data?.privacy} · {data?.memberCount} members
        </Text>

        {data?.description ? (
          <View className="mb-6">
            <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-2">
              About
            </Text>
            <Text className="text-white">{data.description}</Text>
          </View>
        ) : null}

        <View className="mb-6">
          <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-2">
            Your Role
          </Text>
          <Text className="text-white capitalize">{data?.myRole}</Text>
        </View>

        {data?.pendingJoinRequestCount != null ? (
          <View className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <Text className="text-white font-semibold">
              {data.pendingJoinRequestCount} pending join request
              {data.pendingJoinRequestCount !== 1 ? "s" : ""}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

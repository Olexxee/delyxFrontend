import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import type { GroupListItemVM } from "@/view-models/group.vm";
import { GroupPreviewCard } from "@/components/preview/GroupPreviewCard";

type Props = {
  items: GroupListItemVM[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function GroupsPane({ items, isLoading, isError, onRetry }: Props) {
  const router = useRouter();

  const handleOpenGroup = (item: GroupListItemVM) => {
  router.push({
    pathname: "/(tabs)/group/[groupId]/chat",
    params: { groupId: item.groupId },
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
        <Text className="text-white text-base mb-4">Failed to load groups</Text>
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
    <FlatList
      data={items}
      keyExtractor={(item) => item.groupId}
      renderItem={({ item }) => (
        <GroupPreviewCard item={item} onPress={handleOpenGroup} />
      )}
      ListEmptyComponent={
        <View className="mt-20 items-center px-6">
          <Text className="text-neutral-500 text-center">
            You haven't joined any groups yet
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

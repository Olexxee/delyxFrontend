import {
  FlatList,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import type { GroupListItemVM } from "@/view-models/group.vm";
import { GroupPreviewCard } from "@/components/preview/GroupPreviewCard";
import { StatePanel } from "@/components/ui/StatePanel";

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
    return <StatePanel variant="loading" title="Loading groups" />;
  }

  if (isError) {
    return (
      <StatePanel
        variant="error"
        title="Couldn’t load groups"
        message="Check your connection and try again."
        actionLabel="Retry"
        onAction={onRetry}
      />
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
        <StatePanel variant="empty" title="No groups yet" message="Groups you join will appear here." compact />
      }
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

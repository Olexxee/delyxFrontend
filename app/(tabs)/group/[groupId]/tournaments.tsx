import { useGroupTournaments } from "@/hooks/useTournaments";
import type { TournamentSummary } from "@/types/tournament";
import { STATUS_META } from "@/types/tournament";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

function TournamentRow({
  item,
  onPress,
}: {
  item: TournamentSummary;
  onPress: (id: string) => void;
}) {
  const meta = STATUS_META[item.status];

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="px-4 py-3 border-b border-neutral-800"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-white font-semibold">{item.name}</Text>
          <Text className="text-neutral-400 text-sm mt-0.5">
            {item.type} · {item.participantCount}/{item.maxParticipants}{" "}
            participants
          </Text>
        </View>
        <View className="px-2 py-1 rounded-full bg-neutral-800">
          <Text className="text-xs text-neutral-300">{meta.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function GroupTournamentsScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { data, isLoading, isError, refetch } = useGroupTournaments(groupId);

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
        <Text className="text-white mb-4">Failed to load tournaments</Text>
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
        <Text className="text-white text-2xl font-bold">Tournaments</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TournamentRow
            item={item}
            onPress={(id) =>
              router.push({
                pathname: "/(tabs)/tournaments/[tournamentId]",
                params: { tournamentId: id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Text className="text-neutral-500">No tournaments yet</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

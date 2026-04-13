import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useGroupShell } from "@/authContext/GroupShellContext";
import { useTheme } from "@/theme/ThemeProvider";

export default function GroupTournamentsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { shell } = useGroupShell();

  return (
    <View className="flex-1 bg-black p-4">
      {shell.activeTournament ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/tournaments/[tournamentId]",
              params: { tournamentId: shell.activeTournament!.id },
            })
          }
          className="rounded-3xl border p-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text className="text-white text-lg font-bold">
            {shell.activeTournament.name}
          </Text>
          <Text className="text-neutral-400 mt-2">
            Status: {shell.activeTournament.status}
          </Text>
          <Text className="text-blue-400 mt-3 font-semibold">
            Open tournament
          </Text>
        </Pressable>
      ) : (
        <View
          className="rounded-3xl border p-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text className="text-white text-base font-semibold">
            No active tournament
          </Text>
          <Text className="text-neutral-400 mt-2">
            This group doesn’t have an active tournament right now.
          </Text>
        </View>
      )}
    </View>
  );
}

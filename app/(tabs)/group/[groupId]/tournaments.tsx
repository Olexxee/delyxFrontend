import { useGroupShell } from "@/authContext/GroupShellContext";
import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function GroupTournamentsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { shell } = useGroupShell();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1,
          marginBottom: 12,
        }}
      >
        ACTIVE TOURNAMENT
      </Text>

      {shell.activeTournament ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/tournaments/[tournamentId]",
              params: { tournamentId: shell.activeTournament!.id },
            })
          }
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.surfaceLight : colors.surface,
            borderWidth: 0.5,
            borderColor: colors.accent + "55",
            borderRadius: 20,
            padding: 20,
          })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: colors.accent + "22",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trophy size={22} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {shell.activeTournament.name}
              </Text>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {shell.activeTournament.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Tap to open tournament details →
          </Text>
        </Pressable>
      ) : (
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 0.5,
            borderColor: colors.border,
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Trophy size={32} color={colors.textSecondary} />
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            No active tournament
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            This group doesn't have a running tournament right now.
          </Text>
        </View>
      )}

      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        STATS
      </Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderWidth: 0.5,
          borderColor: colors.border,
          borderRadius: 20,
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            {shell.stats.activeTournaments}
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}
          >
            Active
          </Text>
        </View>
        <View style={{ width: 0.5, backgroundColor: colors.border }} />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            {shell.stats.totalTournaments}
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}
          >
            Total
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

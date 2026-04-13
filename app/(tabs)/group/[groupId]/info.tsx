import { useGroupShell } from "@/authContext/GroupShellContext";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { ScrollView, Text, View } from "react-native";

export default function GroupInfoScreen() {
  const { colors } = useTheme();
  const { shell } = useGroupShell();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16 }}
    >
      <View
        className="rounded-3xl border p-4"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <View className="flex-row items-center gap-3">
          <Avatar uri={shell.avatarUrl} label={shell.fallbackLabel} size={64} />
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{shell.name}</Text>
            <Text className="text-neutral-400 mt-1">
              {shell.memberCount} member{shell.memberCount === 1 ? "" : "s"}
            </Text>
            <Text className="text-neutral-400 mt-1 capitalize">
              {shell.privacy} · {shell.myRole}
            </Text>
          </View>
        </View>

        {shell.description ? (
          <Text className="text-neutral-300 mt-4 leading-6">
            {shell.description}
          </Text>
        ) : null}
      </View>

      <View
        className="rounded-3xl border p-4 mt-4"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <Text className="text-white text-base font-semibold mb-3">Stats</Text>
        <Text className="text-neutral-300">
          Active tournaments: {shell.stats.activeTournaments}
        </Text>
        <Text className="text-neutral-300 mt-2">
          Total tournaments: {shell.stats.totalTournaments}
        </Text>
        {typeof shell.stats.totalMessages === "number" ? (
          <Text className="text-neutral-300 mt-2">
            Total messages: {shell.stats.totalMessages}
          </Text>
        ) : null}
        {typeof shell.stats.activeMembers7d === "number" ? (
          <Text className="text-neutral-300 mt-2">
            Active members (7d): {shell.stats.activeMembers7d}
          </Text>
        ) : null}
      </View>

      <View
        className="rounded-3xl border p-4 mt-4"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <Text className="text-white text-base font-semibold mb-3">
          Permissions
        </Text>
        <Text className="text-neutral-300">
          Create tournaments:{" "}
          {shell.permissions.canCreateTournament ? "Yes" : "No"}
        </Text>
        <Text className="text-neutral-300 mt-2">
          Manage group: {shell.permissions.canManageGroup ? "Yes" : "No"}
        </Text>
        <Text className="text-neutral-300 mt-2">
          Invite members: {shell.permissions.canInviteMembers ? "Yes" : "No"}
        </Text>
        <Text className="text-neutral-300 mt-2">
          View requests: {shell.permissions.canViewRequests ? "Yes" : "No"}
        </Text>
      </View>
    </ScrollView>
  );
}

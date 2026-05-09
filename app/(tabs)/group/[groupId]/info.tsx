import { useGroupShell } from "@/authContext/GroupShellContext";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { ScrollView, Text, View } from "react-native";

function StatRow({ label, value }: { label: string; value: string | number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

function PermissionRow({ label, enabled }: { label: string; enabled: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{label}</Text>
      <View style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: enabled ? "#22c55e22" : colors.surfaceLight,
      }}>
        <Text style={{ color: enabled ? "#22c55e" : colors.textSecondary, fontSize: 11, fontWeight: "700" }}>
          {enabled ? "YES" : "NO"}
        </Text>
      </View>
    </View>
  );
}

export default function GroupInfoScreen() {
  const { colors } = useTheme();
  const { shell } = useGroupShell();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }} contentContainerStyle={{ padding: 16, gap: 16 }}>

      {/* Identity card */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 20, padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Avatar uri={shell.avatarUrl} label={shell.fallbackLabel} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 }}>
              {shell.name}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
              {shell.memberCount} member{shell.memberCount === 1 ? "" : "s"}
            </Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
              <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>
                  {shell.privacy}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.accent + "22", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>
                  {shell.myRole}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {shell.description ? (
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 16, lineHeight: 20 }}>
            {shell.description}
          </Text>
        ) : null}
      </View>

      {/* Stats */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 20, padding: 20 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>STATS</Text>
        <StatRow label="Active tournaments" value={shell.stats.activeTournaments} />
        <StatRow label="Total tournaments" value={shell.stats.totalTournaments} />
        {typeof shell.stats.totalMessages === "number" && (
          <StatRow label="Total messages" value={shell.stats.totalMessages} />
        )}
        {typeof shell.stats.activeMembers7d === "number" && (
          <StatRow label="Active members (7d)" value={shell.stats.activeMembers7d} />
        )}
      </View>

      {/* Permissions */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.border, borderRadius: 20, padding: 20 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>YOUR PERMISSIONS</Text>
        <PermissionRow label="Create tournaments" enabled={shell.permissions.canCreateTournament} />
        <PermissionRow label="Manage group" enabled={shell.permissions.canManageGroup} />
        <PermissionRow label="Invite members" enabled={shell.permissions.canInviteMembers} />
        <PermissionRow label="View requests" enabled={shell.permissions.canViewRequests} />
      </View>

    </ScrollView>
  );
}
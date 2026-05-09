import { useGroupShell } from "@/authContext/GroupShellContext";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import type { MemberSummary } from "@/types/member";
import { useTheme } from "@/theme/ThemeProvider";
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
  const { colors } = useTheme();
  const isAdmin = item.role === "admin" || item.role === "owner";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: colors.surfaceLight,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isAdmin ? 1.5 : 0,
          borderColor: colors.accent,
        }}
      >
        <Text
          style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 15 }}
        >
          {item.displayName[0].toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.textPrimary, fontWeight: "600", fontSize: 14 }}
        >
          {item.displayName}
        </Text>
        <Text
          style={{
            color: isAdmin ? colors.accent : colors.textSecondary,
            fontSize: 12,
            marginTop: 1,
            textTransform: "capitalize",
          }}
        >
          {item.role}
        </Text>
      </View>
      {item.isOnline && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#22c55e",
          }}
        />
      )}
    </View>
  );
}

export default function GroupMembersScreen() {
  const { colors } = useTheme();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { shell } = useGroupShell();
  const { data, isLoading } = useGroupMembers(groupId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          MEMBERS · {data?.length ?? shell.memberCount}
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

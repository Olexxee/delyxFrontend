import { useGroupShell } from "@/authContext/GroupShellContext";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/api/api";
import type { MemberSummary } from "@/types/member";
import { useTheme } from "@/theme/ThemeProvider";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { sendCommunityInvitation } from "@/api/groups.api";

type ApiMember = {
  id: string;
  userId?: string;
  role?: string;
  user?: { username?: string | null; avatar?: string | null } | null;
};

const useGroupMembers = (groupId: string) =>
  useQuery<MemberSummary[]>({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        data: { members: ApiMember[]; total: number };
      }>(`/api/community/${encodeURIComponent(groupId)}/members`);

      const members = res.data.data?.members;
      if (!Array.isArray(members)) {
        throw new Error("The server returned an invalid members response.");
      }

      return members.map((member) => ({
        id: member.userId ?? member.id,
        displayName: member.user?.username?.trim() || "Member",
        ...(member.user?.avatar ? { avatarUrl: member.user.avatar } : {}),
        role: (member.role ?? "MEMBER").toLowerCase() as MemberSummary["role"],
      }));
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
        <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 15 }}>
          {(item.displayName || "M")[0].toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontWeight: "600", fontSize: 14 }}>
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
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" }} />
      )}
    </View>
  );
}

export default function GroupMembersScreen() {
  const { colors } = useTheme();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { shell } = useGroupShell();
  const { data, isLoading, isError, error } = useGroupMembers(groupId);
  const queryClient = useQueryClient();
  const [inviteTarget, setInviteTarget] = useState("");
  const [inviteError, setInviteError] = useState("");
  const canInvite = shell.permissions.canInviteMembers;
  const invite = useMutation({
    mutationFn: () => sendCommunityInvitation(groupId, inviteTarget.trim()),
    onSuccess: () => {
      setInviteTarget("");
      setInviteError("");
      Alert.alert("Invitation sent", "The user will receive a community invitation in Delyx.");
      queryClient.invalidateQueries({ queryKey: ["communityInvitations", groupId] });
    },
    onError: (cause) => setInviteError(cause instanceof Error ? cause.message : "Could not send invitation."),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
          MEMBERS · {data?.length ?? shell.memberCount}
        </Text>
      </View>
      {canInvite && (
        <View style={{ marginHorizontal: 16, marginBottom: 14, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 10 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>Invite to this group</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18 }}>Enter their Delyx username or email. They must accept before they become a member.</Text>
          <TextInput
            value={inviteTarget}
            onChangeText={(value) => { setInviteTarget(value); setInviteError(""); }}
            placeholder="Username or email"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!invite.isPending}
            style={{ minHeight: 44, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, color: colors.textPrimary }}
          />
          {!!inviteError && <Text style={{ color: "#ef4444", fontSize: 12 }}>{inviteError}</Text>}
          <Pressable
            disabled={invite.isPending || inviteTarget.trim().length < 2}
            onPress={() => invite.mutate()}
            style={{ minHeight: 42, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, opacity: invite.isPending || inviteTarget.trim().length < 2 ? 0.55 : 1 }}
          >
            {invite.isPending ? <ActivityIndicator color="#090D18" /> : <Text style={{ color: "#090D18", fontSize: 13, fontWeight: "800" }}>Send invitation</Text>}
          </Pressable>
        </View>
      )}
      {isError ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "600" }}>
            Could not load group members
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6 }}>
            {error instanceof Error ? error.message : "Please try again."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MemberRow item={item} />}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListEmptyComponent={
            <Text style={{ color: colors.textSecondary, padding: 16 }}>No members found.</Text>
          }
        />
      )}
    </View>
  );
}

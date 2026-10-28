import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowUpRight, UsersRound } from "lucide-react-native";
import { AppCard, PillBadge } from "@/components/ui";
import { useTheme } from "@/theme/ThemeProvider";
import type { Community } from "@/src/features/communities/api";

type CommunityCardProps = {
  community: Community;
  isJoining?: boolean;
  onOpen: () => void;
  onJoin: () => void;
};

export function CommunityCard({
  community,
  isJoining = false,
  onOpen,
  onJoin,
}: CommunityCardProps) {
  const { colors } = useTheme();
  const memberCount = community.memberCount ?? community.membersCount;
  const isMember = Boolean(community.isMember);
  const isPrivate = community.visibility?.toUpperCase() === "PRIVATE";

  return (
    <AppCard variant="raised" padding="md" radiusSize="lg" style={[styles.card, { borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isMember ? `Open ${community.name}` : `${community.name} community details`}
        disabled={!isMember}
        onPress={onOpen}
        style={styles.main}
      >
        <View style={[styles.imageFrame, { backgroundColor: colors.primary + "18" }]}>
          {community.imageUrl ? (
            <Image source={{ uri: community.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <UsersRound size={22} color={colors.primary} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {community.name}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {community.description || "A place to connect, organize competitions, and play together."}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {typeof memberCount === "number" ? `${memberCount} members` : "Community"}
            </Text>
            <PillBadge label={isPrivate ? "Private" : "Public"} variant={isPrivate ? "warning" : "neutral"} />
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isMember ? `Open ${community.name}` : `Join ${community.name}`}
        accessibilityState={{ disabled: isJoining, busy: isJoining }}
        disabled={isJoining}
        onPress={onJoin}
        style={({ pressed }) => [
          styles.action,
          { borderColor: isMember ? colors.border : colors.accent, backgroundColor: isMember ? (pressed ? colors.surfaceLight : "transparent") : (pressed ? colors.primary : colors.accent) },
        ]}
      >
        {isJoining ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Text style={[styles.actionText, { color: isMember ? colors.primary : colors.background }]}>{isMember ? "Open" : "Join"}</Text>
            <ArrowUpRight size={15} color={isMember ? colors.primary : colors.background} />
          </>
        )}
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 10 },
  main: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 11 },
  imageFrame: { width: 58, height: 58, borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  content: { flex: 1, minWidth: 0, gap: 5 },
  name: { fontSize: 15, fontWeight: "800", letterSpacing: -0.15 },
  description: { fontSize: 12, lineHeight: 17 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 1 },
  meta: { fontSize: 11, letterSpacing: 0.1 },
  action: { minHeight: 40, minWidth: 66, paddingHorizontal: 10, borderWidth: 1, borderRadius: 11, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3 },
  actionText: { fontSize: 12, fontWeight: "800" },
});

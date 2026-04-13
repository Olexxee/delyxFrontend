import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { PreviewRowShell } from "./PreviewRowShell";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupListItemVM } from "@/view-models/group.vm";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { TournamentStatusBadge } from "@/components/ui/TournamentStatusBadge";
import { UnreadBadge } from "@/components/ui/UnreadBadge";

type GroupPreviewCardProps = {
  item: GroupListItemVM;
  onPress: (item: GroupListItemVM) => void;
};

function formatTime(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getActivityLine(item: GroupListItemVM): string {
  if (item.lastActivityText) return item.lastActivityText;

  if (item.activeTournament?.status) {
    return `${item.activeTournament.status} tournament active`;
  }

  return "No activity yet";
}

export function GroupPreviewCard({ item, onPress }: GroupPreviewCardProps) {
  const { colors } = useTheme();

  return (
    <PreviewRowShell
      onPress={() => onPress(item)}
      leading={
        <Avatar
          uri={item.avatarUrl}
          label={item.fallbackLabel}
          size={52}
          shape="square"
        />
      }
      center={
        <View>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: colors.textPrimary }]}
            >
              {item.name}
            </Text>
          </View>

          <View style={styles.badgesRow}>
            <RoleBadge role={item.myRole} />
            <TournamentStatusBadge status={item.activeTournament?.status} />
          </View>

          <Text
            numberOfLines={1}
            style={[styles.activity, { color: colors.textSecondary }]}
          >
            {getActivityLine(item)}
          </Text>

          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {item.memberCount} member{item.memberCount === 1 ? "" : "s"}
          </Text>
        </View>
      }
      trailing={
        <View style={styles.trailingContent}>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(item.lastActivityAt)}
          </Text>
          <View style={styles.badgeWrap}>
            <UnreadBadge count={item.unreadCount} />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  activity: {
    marginTop: 6,
    fontSize: 13,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
  },
  trailingContent: {
    minHeight: 50,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 11,
  },
  badgeWrap: {
    minHeight: 22,
    justifyContent: "flex-end",
  },
});

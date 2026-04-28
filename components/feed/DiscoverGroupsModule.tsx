import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { DiscoverGroupsModuleItem } from "@/types/feed";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: DiscoverGroupsModuleItem;
};

export function DiscoverGroupsModule({ item }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!item.groups.length) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {item.subtitle}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/discover" as never)}
        >
          <Text style={[styles.viewAll, { color: colors.primary }]}>
            View all
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {item.groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            activeOpacity={0.9}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(groups)/group-info",
                params: { groupId: group.id },
              } as never)
            }
          >
            <View style={styles.topRow}>
              <Avatar uri={group.avatarUrl} size={44} name={group.name} />
              <View style={styles.topText}>
                <Text
                  style={[styles.groupName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {group.name}
                </Text>
                <Text
                  style={[styles.privacy, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {group.privacy} · {group.memberCount} members
                </Text>
              </View>
            </View>

            {!!group.bio && (
              <Text
                style={[styles.bio, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {group.bio}
              </Text>
            )}

            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {group.activeTournamentsCount} active tournament
              {group.activeTournamentsCount === 1 ? "" : "s"}
            </Text>

            {!!group.reason && (
              <Text style={[styles.reason, { color: colors.primary }]}>
                {group.reason}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.joinBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.joinText}>Preview</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 260,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topText: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: "700",
  },
  privacy: {
    fontSize: 12,
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
  },
  reason: {
    fontSize: 12,
    fontWeight: "700",
  },
  joinBtn: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  joinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});

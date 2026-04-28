import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { PlayerPostFeedItem } from "@/types/feeds";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: PlayerPostFeedItem;
};

export function PlayerPostCard({ item }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Author row */}
      <View style={styles.authorRow}>
        <Avatar
          uri={item.author.avatarUrl}
          size={38}
        />
        <View style={styles.authorMeta}>
          <Text style={[styles.username, { color: colors.textPrimary }]}>
            {item.author.username}
          </Text>
          {item.context && (
            <Text style={[styles.context, { color: colors.textSecondary }]}>
              {item.context.label || item.context.type}
            </Text>
          )}
        </View>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Post text */}
      {!!item.text && (
        <Text style={[styles.text, { color: colors.textPrimary }]}>
          {item.text}
        </Text>
      )}

      {/* Media */}
      {item.media && item.media.length > 0 && (
        <Image
          source={{ uri: item.media[0].url }}
          style={styles.media}
          resizeMode="cover"
        />
      )}

      {/* Footer: reactions & comments */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn}>
          <Text
            style={[
              styles.footerText,
              {
                color: item.viewerHasReacted
                  ? colors.primary
                  : colors.textSecondary,
              },
            ]}
          >
            {item.viewerHasReacted ? "❤️" : "🤍"} {item.reactionsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerBtn}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            💬 {item.commentsCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  authorMeta: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
  },
  context: {
    fontSize: 12,
    marginTop: 1,
  },
  time: {
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  media: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: "#222",
  },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 4,
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

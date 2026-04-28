import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentUpdateFeedItem } from "@/types/feeds";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: TournamentUpdateFeedItem;
};

export function FeedHeroBanner({ item }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Text style={styles.status}>{item.tournament.status.toUpperCase()}</Text>

      <Text style={styles.name} numberOfLines={2}>
        {item.tournament.name}
      </Text>

      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>

      {!!item.primaryAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={() => {
            if (item.primaryAction?.route) {
              router.push(item.primaryAction.route as never);
            }
          }}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            {item.primaryAction.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  status: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  message: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

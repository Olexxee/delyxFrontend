import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentUpdateFeedItem } from "@/types/feeds";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: TournamentUpdateFeedItem;
};

export function TournamentUpdateCard({ item }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

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
      <Text style={[styles.status, { color: colors.primary }]}>
        {item.tournament.status.toUpperCase()}
      </Text>

      <Text style={[styles.name, { color: colors.textPrimary }]}>
        {item.tournament.name}
      </Text>

      {!!item.group?.name && (
        <Text style={[styles.group, { color: colors.textSecondary }]}>
          {item.group.name}
        </Text>
      )}

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {item.message}
      </Text>

      {!!item.primaryAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (item.primaryAction?.route) {
              router.push(item.primaryAction.route as never);
            }
          }}
        >
          <Text style={styles.buttonText}>{item.primaryAction.label}</Text>
        </TouchableOpacity>
      )}
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
    gap: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: "800",
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
  },
  group: {
    fontSize: 13,
    fontWeight: "600",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

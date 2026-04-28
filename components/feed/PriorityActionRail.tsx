import { useTheme } from "@/theme/ThemeProvider";
import type { FeedAction } from "@/types/feeds";
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
  actions: FeedAction[];
};

export function PriorityActionRail({ actions }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  if (!actions.length) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {actions.map((action) => (
          <View
            key={action.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {action.title}
            </Text>

            <Text
              style={[styles.message, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {action.message}
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (action.actionUrl) {
                  router.push(action.actionUrl as never);
                }
              }}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.buttonText}>{action.actionLabel}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 240,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});

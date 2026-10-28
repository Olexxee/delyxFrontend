import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, Inbox } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

type StatePanelProps = {
  variant: "loading" | "error" | "empty";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

export function StatePanel({
  variant,
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}: StatePanelProps) {
  const { colors } = useTheme();
  const iconSize = compact ? 24 : 34;

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {variant === "loading" ? (
        <ActivityIndicator size={compact ? "small" : "large"} color={colors.primary} />
      ) : variant === "error" ? (
        <AlertCircle size={iconSize} color={colors.danger} strokeWidth={1.7} />
      ) : (
        <Inbox size={iconSize} color={colors.textSecondary} strokeWidth={1.6} />
      )}
      {!!title && <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>}
      {!!message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      )}
      {!!actionLabel && !!onAction && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 10 },
  compact: { padding: 16, gap: 7 },
  title: { fontSize: 16, fontWeight: "800", textAlign: "center" },
  message: { fontSize: 13, lineHeight: 19, textAlign: "center", maxWidth: 320 },
  action: { marginTop: 5, minHeight: 42, paddingHorizontal: 16, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  actionText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
});

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft, Info } from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { ChatHeaderVM } from "@/view-models/chat.vm";

type Props = {
  vm: ChatHeaderVM;
  onBack: () => void;
  onOpenInfo?: () => void;
};

export function ChatHeader({ vm, onBack, onOpenInfo }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.iconButton, { backgroundColor: pressed ? colors.surfaceLight : "transparent" }]}
      >
        <ArrowLeft size={21} color={colors.textPrimary} />
      </Pressable>

      <Pressable
        accessibilityRole={onOpenInfo ? "button" : undefined}
        accessibilityLabel={onOpenInfo ? `Open details for ${vm.title}` : undefined}
        disabled={!onOpenInfo}
        style={styles.center}
        onPress={onOpenInfo}
      >
        <Avatar uri={vm.avatarUrl} label={vm.fallbackLabel} size={40} />
        <View style={styles.textWrap}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.textPrimary }]}>
            {vm.title}
          </Text>
          {vm.subtitle ? (
            <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
              {vm.subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>

      {onOpenInfo ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open chat information"
          onPress={onOpenInfo}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, { backgroundColor: pressed ? colors.surfaceLight : "transparent" }]}
        >
          <Info size={19} color={colors.textSecondary} />
        </Pressable>
      ) : (
        <View style={styles.trailingSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  trailingSpace: { width: 40 },
});

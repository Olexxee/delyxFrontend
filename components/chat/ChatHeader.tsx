import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={{ color: colors.textPrimary }}>←</Text>
      </Pressable>

      <Pressable style={styles.center} onPress={onOpenInfo}>
        <Avatar uri={vm.avatarUrl} label={vm.fallbackLabel} size={40} />

        <View style={styles.textWrap}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.textPrimary }]}
          >
            {vm.title}
          </Text>

          {vm.subtitle ? (
            <Text
              numberOfLines={1}
              style={[styles.subtitle, { color: colors.textSecondary }]}
            >
              {vm.subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  back: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
});

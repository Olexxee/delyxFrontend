import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type PreviewRowShellProps = {
  leading: React.ReactNode;
  center: React.ReactNode;
  trailing?: React.ReactNode;
  onPress: () => void;
};

export function PreviewRowShell({
  leading,
  center,
  trailing,
  onPress,
}: PreviewRowShellProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.surfaceLight : colors.background,
        },
      ]}
    >
      <View style={styles.leading}>{leading}</View>
      <View style={styles.center}>{center}</View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
  },
  leading: {
    marginRight: 12,
  },
  center: {
    flex: 1,
    minWidth: 0,
  },
  trailing: {
    marginLeft: 12,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

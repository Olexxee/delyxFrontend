import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Shape, Shapes } from "@/theme/shapes";

type AvatarProps = {
  uri?: string | null;
  label?: string | null;
  shape?: Shape;
  size?: number;
  borderColor?: string;
};

function getInitials(label?: string | null): string {
  if (!label || !label.trim()) return "?";

  const words = label.trim().split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function Avatar({
  uri,
  label,
  shape = Shapes.circle,
  size = 44,
  borderColor,
}: AvatarProps) {
  const { colors } = useTheme();

  const resolvedUri = typeof uri === "string" && uri.trim() ? uri.trim() : null;
  const initials = getInitials(label);
  const fontSize = Math.max(12, Math.floor(size * 0.36));

  return (
    <View
      style={[
        styles.base,
        shapeStyles[shape] ?? shapeStyles[Shapes.circle],
        {
          width: size,
          height: size,
          backgroundColor: colors.surfaceLight,
          borderColor: borderColor ?? colors.borderLight,
        },
      ]}
    >
      {resolvedUri ? (
        <Image
          source={{ uri: resolvedUri }}
          resizeMode="cover"
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              color: colors.textPrimary,
              fontSize,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
  },
});

const shapeStyles: Record<Shape, { borderRadius: number }> = {
  [Shapes.circle]: { borderRadius: 999 },
  [Shapes.square]: { borderRadius: 14 },
  [Shapes.triangle]: { borderRadius: 10 },
  [Shapes.x]: { borderRadius: 10 },
};

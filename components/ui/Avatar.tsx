import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Shape, Shapes } from "@/theme/shapes";
import { useTheme } from "@/theme/ThemeProvider";

type AvatarProps = {
  uri?: string;
  shape?: Shape;
  size?: number;
  borderColor?: string;
};

const FALLBACK_AVATAR_URI =
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";

export function Avatar({
  uri,
  shape = Shapes.circle,
  size = 44,
  borderColor,
}: AvatarProps) {
  const { colors } = useTheme();

  const resolvedUri =
    uri && uri.trim().length > 0 ? uri : FALLBACK_AVATAR_URI;

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
      <Image
        key={resolvedUri} // forces reload if avatar URL changes
        source={{ uri: resolvedUri }}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: 1,
  },
});

const shapeStyles: Record<Shape, { borderRadius: number }> = {
  [Shapes.circle]: { borderRadius: 999 },
  [Shapes.square]: { borderRadius: 12 },
  [Shapes.triangle]: { borderRadius: 8 },
  [Shapes.x]: { borderRadius: 8 },
};

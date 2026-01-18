import { Shape, Shapes } from "@/theme/shapes";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
  uri?: string;
  shape?: Shape;
  size?: number;
  borderColor?: string;
};

export function Avatar({
  uri,
  shape = Shapes.circle,
  size = 44,
  borderColor,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        shapeStyles[shape],
        {
          width: size,
          height: size,
          backgroundColor: colors.surfaceLight,
          borderColor: borderColor ?? colors.borderLight,
        },
      ]}
    >
      <Image
        source={{
          uri:
            uri ||
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        }}
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

const shapeStyles = {
  [Shapes.circle]: { borderRadius: 999 },
  [Shapes.square]: { borderRadius: 12 },
  [Shapes.triangle]: { borderRadius: 8 },
  [Shapes.x]: { borderRadius: 8 },
};

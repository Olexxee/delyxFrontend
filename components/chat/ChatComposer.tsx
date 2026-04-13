import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatComposer({ value, onChange, onSend, disabled }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Message..."
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceLight,
            color: colors.textPrimary,
          },
        ]}
      />

      <Pressable onPress={onSend} disabled={disabled}>
        <Text style={{ color: colors.primary, fontWeight: "600" }}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 0.5,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});

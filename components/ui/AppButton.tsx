import { useTheme } from "@/theme/ThemeProvider";
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export function AppButton({
  label,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyle: ViewStyle =
    variant === "primary"
      ? { backgroundColor: colors.primary, borderColor: colors.primary }
      : variant === "secondary"
        ? { backgroundColor: colors.surfaceLight, borderColor: colors.border }
        : variant === "danger"
          ? { backgroundColor: colors.danger, borderColor: colors.danger }
          : {
              backgroundColor: "transparent",
              borderColor: colors.borderLight,
            };

  const labelColor =
    variant === "secondary"
      ? colors.textPrimary
      : variant === "ghost"
        ? colors.textPrimary
        : "#FFFFFF";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        { opacity: isDisabled ? 0.55 : pressed ? 0.82 : 1 },
        style,
      ]}
    >
      <Text
        style={[styles.label, { color: labelColor }, textStyle]}
        numberOfLines={1}
      >
        {loading ? "Loading…" : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
  },
});

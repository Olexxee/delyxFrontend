import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "ghost";

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
  const isGhost = variant === "ghost";

  if (isGhost) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <Text style={[styles.label, { color: "#ffffff" }, textStyle]}>
          {loading ? "Loading..." : label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style, { opacity: disabled ? 0.6 : 1 }]}
    >
      <LinearGradient
        colors={["#3b82f6", "#06b6d4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.label, { color: "#ffffff" }, textStyle]}>
          {loading ? "Loading..." : label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
  },
});

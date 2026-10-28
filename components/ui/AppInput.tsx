import { useTheme } from "@/theme/ThemeProvider";
import { Shape, Shapes } from "@/theme/shapes";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface AppInputProps extends TextInputProps {
  style?: any;
  icon?: string | Shape;
}

export function AppInput({
  style,
  icon,
  secureTextEntry,
  ...props
}: AppInputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const renderIcon = () => {
    if (!icon) return null;

    const iconMap: Record<string, string> = {
      mail: "✉",
      lock: "🔒",
      user: "👤",
    };

    if (Object.values(Shapes).includes(icon as Shape)) {
      switch (icon) {
        case Shapes.circle:
          return (
            <View
              style={[
                styles.shape,
                { borderRadius: 50, backgroundColor: colors.textSecondary },
              ]}
            />
          );
        case Shapes.square:
          return (
            <View
              style={[
                styles.shape,
                { backgroundColor: colors.textSecondary },
              ]}
            />
          );
        case Shapes.triangle:
          return (
            <View
              style={[
                styles.triangle,
                { borderBottomColor: colors.textSecondary },
              ]}
            />
          );
        case Shapes.x:
          return (
            <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>
              X
            </Text>
          );
      }
    }

    const displayIcon = iconMap[icon as string] || icon;
    return (
      <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
        {displayIcon}
      </Text>
    );
  };

  const isPassword = Boolean(secureTextEntry && !showPassword);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconWrapper}>{renderIcon()}</View>}
      <TextInput
        accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
        {...props}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
          },
          props.style,
        ]}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={isPassword}
      />
      {secureTextEntry && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          onPress={() => setShowPassword((visible) => !visible)}
          style={styles.eyeButton}
        >
          <Text style={[styles.eyeIcon, { color: colors.textSecondary }]}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 48,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  iconWrapper: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  eyeIcon: {
    fontSize: 12,
    fontWeight: "600",
  },
  shape: {
    width: 16,
    height: 16,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

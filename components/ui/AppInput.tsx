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

  // Render icon as FontAwesome or a shape
  const renderIcon = () => {
    if (!icon) return null;

    // Icon mapping for common icons
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
                {
                  borderRadius: 50,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                },
              ]}
            />
          );
        case Shapes.square:
          return (
            <View
              style={[
                styles.shape,
                { backgroundColor: "rgba(255, 255, 255, 0.7)" },
              ]}
            />
          );
        case Shapes.triangle:
          return (
            <View
              style={[
                styles.triangle,
                { borderBottomColor: "rgba(255, 255, 255, 0.7)" },
              ]}
            />
          );
        case Shapes.x:
          return (
            <Text
              style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "700" }}
            >
              X
            </Text>
          );
      }
    }

    // Use mapped icon or fallback to the icon string
    const displayIcon = iconMap[icon as string] || icon;
    return (
      <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 18 }}>
        {displayIcon}
      </Text>
    );
  };

  const isPassword = secureTextEntry && !showPassword;

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconWrapper}>{renderIcon()}</View>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        ]}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        secureTextEntry={isPassword}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
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
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  iconWrapper: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  eyeIcon: {
    fontSize: 18,
    opacity: 0.7,
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

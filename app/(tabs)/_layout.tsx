import React, { useEffect, useRef, useContext } from "react";
import { Animated } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { Home, Trophy, User, Users } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "@/authContext/UserContext";

type AnimatedIconProps = {
  Icon: any;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
};

function AnimatedIcon({
  Icon,
  focused,
  activeColor,
  inactiveColor,
}: AnimatedIconProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon size={24} color={focused ? activeColor : inactiveColor} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  const { user, isRestoring } = useContext(UserContext);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // 🔐 Auth guard (this is the ONLY new logic)
  if (isRestoring) return null;

  if (!user) {
    return <Redirect href="/(auth)/authContainer" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "feed":
              return (
                <AnimatedIcon
                  Icon={Home}
                  focused={focused}
                  activeColor={colors.accent}
                  inactiveColor={colors.textSecondary}
                />
              );
            case "group":
              return (
                <AnimatedIcon
                  Icon={Users}
                  focused={focused}
                  activeColor={colors.accent}
                  inactiveColor={colors.textSecondary}
                />
              );
            case "tournament":
              return (
                <AnimatedIcon
                  Icon={Trophy}
                  focused={focused}
                  activeColor={colors.accent}
                  inactiveColor={colors.textSecondary}
                />
              );
            case "profile":
              return (
                <AnimatedIcon
                  Icon={User}
                  focused={focused}
                  activeColor={colors.accent}
                  inactiveColor={colors.textSecondary}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="group" />
      <Tabs.Screen name="tournament" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

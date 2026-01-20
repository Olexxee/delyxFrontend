import { useTheme } from "@/theme/ThemeProvider";
import { Tabs } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { Home, Trophy, User, Users } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

type AnimatedIconProps = {
  Icon: LucideIcon;
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
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon size={24} color={focused ? activeColor : inactiveColor} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
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
            case "tournaments":
              return (
                <AnimatedIcon
                  Icon={Trophy}
                  focused={focused}
                  activeColor={colors.accent}
                  inactiveColor={colors.textSecondary}
                />
              );
            case "groups":
              return (
                <AnimatedIcon
                  Icon={Users}
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
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="tournaments" options={{ title: "Tournaments" }} />
      <Tabs.Screen name="groups" options={{ title: "Groups" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

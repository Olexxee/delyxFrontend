import { UserContext } from "@/authContext/UserContext";
import { useTheme } from "@/theme/ThemeProvider";
import { Redirect, Tabs } from "expo-router";
import {
  Home,
  MessageCircle,
  ShoppingBag,
  Trophy,
  User,
} from "lucide-react-native";
import React, { useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  }, [focused, scale]);

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

  if (isRestoring) return null;
  if (!user) return <Redirect href="/(auth)/authContainer" />;

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
            case "chat":
              return (
                <AnimatedIcon
                  Icon={MessageCircle}
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
            case "mart":
              return (
                <AnimatedIcon
                  Icon={ShoppingBag}
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
      <Tabs.Screen name="chat" options={{ title: "Chats" }} />
      <Tabs.Screen name="tournaments" options={{ title: "Tournaments" }} />
      <Tabs.Screen name="mart" options={{ title: "Mart" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* group folder exists for navigation but is not a visible tab */}
      <Tabs.Screen name="group" options={{ href: null }} />
    </Tabs>
  );
}

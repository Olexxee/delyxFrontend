import { UserContext } from "@/authContext/UserContext";
import { useTheme } from "@/theme/ThemeProvider";
import { Redirect, Tabs } from "expo-router";
import {
  Home,
  MessageCircle,
  UsersRound,
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
          borderTopWidth: 1,
          height: 70 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          elevation: 16,
          shadowColor: "#000000",
          shadowOpacity: 0.22,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -5 },
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          letterSpacing: 0.2,
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
            case "communities/index":
              return (
                <AnimatedIcon
                  Icon={UsersRound}
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
      <Tabs.Screen name="communities/index" options={{ title: "Community" }} />
      <Tabs.Screen name="mart" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* group folder exists for navigation but is not a visible tab */}
      <Tabs.Screen name="group" options={{ href: null }} />
    </Tabs>
  );
}

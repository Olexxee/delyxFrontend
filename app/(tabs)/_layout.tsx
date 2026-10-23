import { UserContext } from "@/authContext/UserContext";
import { useTheme } from "@/theme/ThemeProvider";
import { Redirect, Tabs } from "expo-router";
import { Home, MessageCircle, UsersRound, Trophy } from "lucide-react-native";
import React, { useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AnimatedIconProps = {
  Icon: any;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
};

function AnimatedIcon({ Icon, focused, activeColor, inactiveColor }: AnimatedIconProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.16 : 1,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon size={23} color={focused ? activeColor : inactiveColor} />
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
          height: 66 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 7),
          elevation: 16,
          shadowColor: "#000000",
          shadowOpacity: 0.22,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -5 },
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800", letterSpacing: 0.2 },
        tabBarIcon: ({ focused }) => {
          const common = {
            focused,
            activeColor: colors.accent,
            inactiveColor: colors.textSecondary,
          };
          switch (route.name) {
            case "feed": return <AnimatedIcon Icon={Home} {...common} />;
            case "chat": return <AnimatedIcon Icon={MessageCircle} {...common} />;
            case "tournaments": return <AnimatedIcon Icon={Trophy} {...common} />;
            case "communities/index": return <AnimatedIcon Icon={UsersRound} {...common} />;
            default: return null;
          }
        },
      })}
    >
      <Tabs.Screen name="feed" options={{ title: "Home" }} />
      <Tabs.Screen name="chat" options={{ title: "Messages" }} />
      <Tabs.Screen name="tournaments" options={{ title: "Compete" }} />
      <Tabs.Screen name="communities/index" options={{ title: "Squads" }} />
      <Tabs.Screen name="mart" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      {/* These routes remain available to navigation but are not bottom tabs. */}
      <Tabs.Screen name="group" options={{ href: null }} />
    </Tabs>
  );
}

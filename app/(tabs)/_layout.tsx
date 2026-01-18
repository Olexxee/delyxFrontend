import { useTheme } from "@/theme/ThemeProvider";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
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
      }}
    >
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="tournaments" options={{ title: "TournamentScreen" }} />
      <Tabs.Screen name="groups" options={{ title: "GroupScreen" }} />
      <Tabs.Screen name="profile" options={{ title: "ProfileScreen" }} />
    </Tabs>
  );
}

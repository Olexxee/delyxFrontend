import { useTheme } from "@/theme/ThemeProvider";
import { Tabs, useLocalSearchParams } from "expo-router";
import { MessageCircle, Trophy, Users, Info } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupSpaceLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { groupId, chatRoomId } = useLocalSearchParams<{
    groupId: string;
    chatRoomId: string;
  }>();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="chat"
        initialParams={{ groupId, chatRoomId }}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color }) => <MessageCircle size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tournaments"
        initialParams={{ groupId }}
        options={{
          tabBarLabel: "Tournaments",
          tabBarIcon: ({ color }) => <Trophy size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        initialParams={{ groupId }}
        options={{
          tabBarLabel: "Members",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="info"
        initialParams={{ groupId }}
        options={{
          tabBarLabel: "Info",
          tabBarIcon: ({ color }) => <Info size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

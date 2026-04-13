import { GroupShellProvider } from "@/authContext/GroupShellContext";
import { useGroupHub } from "@/hooks/useGroupHub";
import { mapGroupHubToGroupShellVM } from "@/mappers/group.mapper";
import { useTheme } from "@/theme/ThemeProvider";
import { Tabs, useLocalSearchParams } from "expo-router";
import { Info, MessageCircle, Trophy, Users } from "lucide-react-native";
import { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupSpaceLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { data, isLoading, isError } = useGroupHub(groupId);

  const shell = useMemo(() => {
    return data ? mapGroupHubToGroupShellVM(data) : null;
  }, [data]);

  if (!groupId || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !shell) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-white text-base">Failed to load group</Text>
      </View>
    );
  }

  return (
    <GroupShellProvider shell={shell}>
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
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: ({ color }) => (
              <MessageCircle size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tournaments"
          options={{
            tabBarLabel: "Tournaments",
            tabBarIcon: ({ color }) => <Trophy size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            tabBarLabel: "Members",
            tabBarIcon: ({ color }) => <Users size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            tabBarLabel: "Info",
            tabBarIcon: ({ color }) => <Info size={22} color={color} />,
          }}
        />
      </Tabs>
    </GroupShellProvider>
  );
}

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import { GroupListScreen } from "@/components/group/GroupListScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupsTab() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <GroupListScreen />
    </SafeAreaView>
  );
}

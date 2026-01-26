import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import GroupListScreen from "@/components/group/GroupListScreen";

export default function GroupsTab() {
  const { colors } = useTheme();

  return <GroupListScreen />;
}

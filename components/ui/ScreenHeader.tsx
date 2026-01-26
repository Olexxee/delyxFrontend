import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { UserContext } from "@/authContext/UserContext";
import { HeaderAvatar } from "./HeaderAvatar";
import { HeaderTitle } from "./HeaderTitle";
import { HeaderActions } from "./HeaderActions";
import type { User } from "@/types/auth";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const { user, setUser } = useContext(UserContext);

  /**
   * While session is restoring or user is unauthenticated,
   * do not render the header.
   */
  if (!user) {
    return <View style={{ height: 80 }} />;
  }

  return (
    <View style={styles.container}>
      <HeaderAvatar avatarUri={user.avatar ?? ""} />

      <HeaderTitle
        title={title}
        subtitle={subtitle}
      />

      <HeaderActions
        userId={user._id}
        onLogout={() => setUser(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
});

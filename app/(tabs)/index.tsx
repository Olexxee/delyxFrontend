import { FeedList } from "@/components/feed/FeedList";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

export default function FeedScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FeedList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

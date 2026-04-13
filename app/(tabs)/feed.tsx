import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { AppScreenHeader } from "@/components/ui/ScreenHeader";
import { ActivityFeed } from "@/components/feed/Feedlist";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";

export default function FeedScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ErrorBoundary>
        <AppScreenHeader title="Feed" subtitle="Welcome back!" />
        <ActivityFeed />
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
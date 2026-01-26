import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { AppScreenHeader } from "@/components/ui/ScreenHeader";
import { FeedList } from "@/components/feed/FeedList";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";

export default function FeedScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ErrorBoundary>
        <AppScreenHeader title="Feed" subtitle="Welcome back!" />
        <FeedList />
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
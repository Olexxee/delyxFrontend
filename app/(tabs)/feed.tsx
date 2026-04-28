import { FeedCardRenderer } from "@/components/feed/FeedCardRenderer";
import { FeedHeroBanner } from "@/components/feed/FeedHeroBanner";
import { PriorityActionRail } from "@/components/feed/PriorityActionRail";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { useTheme } from "@/theme/ThemeProvider";
import type { HomeFeedTab } from "@/types/feeds";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: HomeFeedTab[] = ["for-you", "following", "discover"];

export default function HomeScreen() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<HomeFeedTab>("for-you");

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeFeed(tab);

  const actions = data?.pages[0]?.actions ?? [];
  const banner = data?.pages[0]?.banner ?? null;

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Delyx
        </Text>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((item) => {
          const active = tab === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? "#fff" : colors.textSecondary },
                ]}
              >
                {item === "for-you"
                  ? "For You"
                  : item === "following"
                    ? "Following"
                    : "Discover"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        >
          <PriorityActionRail actions={actions} />

          {banner ? <FeedHeroBanner item={banner} /> : null}

          {items.map((item) => (
            <FeedCardRenderer key={item.id} item={item} />
          ))}

          {isFetchingNextPage && (
            <View style={styles.loadMore}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMore: {
    paddingVertical: 16,
  },
});

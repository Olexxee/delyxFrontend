import { FeedCardRenderer } from "@/components/feed/FeedCardRenderer";
import { ProfileDrawer } from "@/components/navigation/ProfileDrawer";
import { Flame, Zap, UserRound, Bell } from "lucide-react-native";
import { FeedHeroBanner } from "@/components/feed/FeedHeroBanner";
import { PriorityActionRail } from "@/components/feed/PriorityActionRail";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { StatePanel } from "@/components/ui/StatePanel";
import type { HomeFeedTab } from "@/types/feeds";
import React, { useMemo, useState } from "react";
import {
  Alert,
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
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeFeed(tab);

  const actions = data?.pages[0]?.actions ?? [];
  const banner = data?.pages[0]?.banner ?? null;
  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open profile and navigation menu"
            activeOpacity={0.78}
            onPress={() => setDrawerVisible(true)}
            style={[styles.avatarButton, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          >
            <UserRound size={21} color={colors.textPrimary} />
            <View style={[styles.onlineDot, { backgroundColor: colors.accent, borderColor: colors.background }]} />
          </TouchableOpacity>

          <View style={styles.brandCenter}>
            <View style={[styles.brandMark, { backgroundColor: colors.accent }]}>
              <Zap size={16} color={colors.background} fill={colors.background} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>DELYX</Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            activeOpacity={0.78}
            onPress={() => Alert.alert("Notifications", "Your notification centre is coming soon.")}
            style={[styles.iconButton, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          >
            <Bell size={19} color={colors.textPrimary} />
            <View style={[styles.notificationDot, { backgroundColor: colors.danger }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeader}>
          <View>
            <Text style={[styles.headerEyebrow, { color: colors.textSecondary }]}>PLAY • CONNECT • COMPETE</Text>
            <Text style={[styles.headerTagline, { color: colors.textPrimary }]}>Your arena. Your rules.</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
            <Flame size={13} color={colors.accent} />
            <Text style={[styles.statusText, { color: colors.accent }]}>ARENA</Text>
          </View>
        </View>
      </View>

      <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
        {TABS.map((item) => {
          const active = tab === item;
          return (
            <TouchableOpacity
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(item)}
              style={[styles.tabBtn, { borderBottomColor: active ? colors.accent : "transparent" }]}
            >
              <Text style={[styles.tabText, { color: active ? colors.textPrimary : colors.textSecondary }]}>
                {item === "for-you" ? "For you" : item === "following" ? "Following" : "Discover"}
              </Text>
              {active ? <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <StatePanel variant="loading" title="Loading your feed" />
      ) : isError ? (
        <StatePanel
          variant="error"
          title="Couldn’t load your feed"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => { void refetch(); }}
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
        >
          <PriorityActionRail actions={actions} />
          {banner ? <FeedHeroBanner item={banner} /> : null}
          {items.length === 0 && !banner && actions.length === 0 ? (
            <StatePanel
              variant="empty"
              title="Your feed is quiet"
              message="Follow communities and join tournaments to see activity here."
              compact
            />
          ) : null}
          {items.map((item) => <FeedCardRenderer key={item.id} item={item} />)}
          {isFetchingNextPage ? (
            <View style={styles.loadMore}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null}
        </ScrollView>
      )}

      <ProfileDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 7, paddingBottom: 0, borderBottomWidth: StyleSheet.hairlineWidth },
  topRow: { minHeight: 47, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarButton: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  onlineDot: { position: "absolute", width: 10, height: 10, borderRadius: 5, right: 0, bottom: 0, borderWidth: 2 },
  brandCenter: { flexDirection: "row", alignItems: "center", gap: 7 },
  brandMark: { width: 25, height: 25, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 19, fontWeight: "900", letterSpacing: 1.5 },
  iconButton: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", width: 7, height: 7, borderRadius: 4, right: 8, top: 7 },
  subHeader: { minHeight: 54, paddingTop: 9, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerEyebrow: { fontSize: 8, fontWeight: "800", letterSpacing: 1.25 },
  headerTagline: { fontSize: 14, fontWeight: "800", marginTop: 3, letterSpacing: -0.2 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  tabsRow: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tabBtn: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 45, borderBottomWidth: 3, paddingTop: 2 },
  tabText: { fontSize: 12, fontWeight: "800" },
  activeIndicator: { position: "absolute", bottom: -3, width: 45, height: 3, borderRadius: 2 },
  scrollContent: { paddingBottom: 32 },
  loadMore: { paddingVertical: 16 },
});

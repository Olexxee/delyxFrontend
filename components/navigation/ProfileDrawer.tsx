import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bookmark,
  ChevronRight,
  CircleHelp,
  Crown,
  Gamepad2,
  MessageCircle,
  Settings,
  Trophy,
  UsersRound,
  X,
  Zap,
} from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type MenuItem = {
  label: string;
  hint?: string;
  icon: typeof Gamepad2;
  route?: string;
  placeholder?: boolean;
};

const PRIMARY_ITEMS: MenuItem[] = [
  { label: "My profile", hint: "Your player identity", icon: Gamepad2, route: "/(tabs)/profile" },
  { label: "Communities", hint: "Your squads and circles", icon: UsersRound, route: "/(tabs)/communities" },
  { label: "Messages", hint: "Direct and group chats", icon: MessageCircle, route: "/(tabs)/chat" },
  { label: "Tournaments", hint: "Compete for your place", icon: Trophy, route: "/(tabs)/tournaments" },
];

const MORE_ITEMS: MenuItem[] = [
  { label: "Bookmarks", hint: "Posts you save", icon: Bookmark, placeholder: true },
  { label: "Delyx Plus", hint: "More ways to stand out", icon: Crown, placeholder: true },
  { label: "Settings & privacy", icon: Settings, placeholder: true },
  { label: "Help centre", icon: CircleHelp, placeholder: true },
];

export function ProfileDrawer({ visible, onClose }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  const navigate = (item: MenuItem) => {
    onClose();
    if (item.route) {
      router.push(item.route as never);
      return;
    }
    Alert.alert(item.label, "This space is reserved for a future Delyx feature.");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close navigation menu"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.drawer, { backgroundColor: colors.background }]}>
          <View style={styles.topRow}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Gamepad2 size={22} color={colors.background} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
            >
              <X size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.identity}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>Your Delyx</Text>
            <Text style={[styles.handle, { color: colors.textSecondary }]}>Player profile · Level up your game</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.accent }]}>LVL 01</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Player</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>YOUR ARENA</Text>
            {PRIMARY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  onPress={() => navigate(item)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    { backgroundColor: pressed ? colors.surfaceLight : "transparent" },
                  ]}
                >
                  <Icon size={21} color={colors.textPrimary} />
                  <View style={styles.menuCopy}>
                    <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                    {!!item.hint && <Text style={[styles.menuHint, { color: colors.textSecondary }]}>{item.hint}</Text>}
                  </View>
                  <ChevronRight size={17} color={colors.textSecondary} />
                </Pressable>
              );
            })}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>COMING TO DELYX</Text>
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  onPress={() => navigate(item)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    { backgroundColor: pressed ? colors.surfaceLight : "transparent" },
                  ]}
                >
                  <Icon size={21} color={item.label === "Delyx Plus" ? colors.accent : colors.textSecondary} />
                  <View style={styles.menuCopy}>
                    <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                    {!!item.hint && <Text style={[styles.menuHint, { color: colors.textSecondary }]}>{item.hint}</Text>}
                  </View>
                  <View style={[styles.soonPill, { backgroundColor: colors.surfaceLight }]}>
                    <Text style={[styles.soonText, { color: colors.textSecondary }]}>SOON</Text>
                  </View>
                </Pressable>
              );
            })}

            <View style={[styles.brandFooter, { borderTopColor: colors.border }]}>
              <View style={[styles.brandMark, { backgroundColor: colors.accent }]}>
                <Zap size={14} color={colors.background} fill={colors.background} />
              </View>
              <Text style={[styles.brandText, { color: colors.textSecondary }]}>DELYX · PLAY YOUR GAME</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.68)" },
  drawer: { width: "86%", maxWidth: 380, height: "100%", paddingTop: 54, paddingHorizontal: 20 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  closeButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  identity: { marginTop: 16, gap: 4 },
  name: { fontSize: 23, fontWeight: "900", letterSpacing: -0.5 },
  handle: { fontSize: 12, lineHeight: 18 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 20, paddingVertical: 14, borderRadius: 15, backgroundColor: "rgba(127,145,170,0.08)" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 15, fontWeight: "900" },
  statLabel: { fontSize: 10, fontWeight: "600" },
  statDivider: { width: 1, height: 28 },
  menuContent: { paddingBottom: 28 },
  sectionLabel: { fontSize: 9, fontWeight: "900", letterSpacing: 1.7, marginBottom: 8, marginTop: 3 },
  menuItem: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 10, borderRadius: 13 },
  menuCopy: { flex: 1, gap: 3 },
  menuLabel: { fontSize: 14, fontWeight: "800" },
  menuHint: { fontSize: 10, lineHeight: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 15 },
  soonPill: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 },
  soonText: { fontSize: 8, fontWeight: "900", letterSpacing: 0.7 },
  brandFooter: { marginTop: 18, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { width: 25, height: 25, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  brandText: { fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
});

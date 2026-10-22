import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Gamepad2, Image, MessageSquare, Pencil, Trophy, UserRound } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

type ProfileTab = "posts" | "media" | "stats";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.navbar, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <ArrowLeft size={21} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.navCopy}>
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Player profile</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Your place in the arena</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.cover, { backgroundColor: colors.surfaceLight }]}>
          <View style={[styles.coverOrb, { borderColor: colors.accent + "45" }]} />
          <View style={[styles.coverOrbSmall, { backgroundColor: colors.accent + "20" }]} />
          <View style={styles.coverLabel}>
            <Trophy size={13} color={colors.accent} />
            <Text style={[styles.coverLabelText, { color: colors.accent }]}>PLAYER CARD</Text>
          </View>
          <Text style={[styles.coverTitle, { color: colors.textPrimary }]}>YOUR GAME.{"\n"}YOUR LEGACY.</Text>
        </View>

        <View style={styles.identitySection}>
          <View style={styles.identityTop}>
            <View style={[styles.avatar, { backgroundColor: colors.accent, borderColor: colors.background }]}>
              <Gamepad2 size={29} color={colors.background} />
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert("Edit profile", "Profile editing will be available in a future Delyx update.")}
              style={[styles.editButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Pencil size={14} color={colors.textPrimary} />
              <Text style={[styles.editButtonText, { color: colors.textPrimary }]}>Edit profile</Text>
            </Pressable>
          </View>

          <Text style={[styles.playerName, { color: colors.textPrimary }]}>Your player name</Text>
          <Text style={[styles.playerHandle, { color: colors.textSecondary }]}>@yourhandle · New challenger</Text>
          <Text style={[styles.bio, { color: colors.textSecondary }]}>Your gaming story starts here. Build your profile, find your squad, and get into the competition.</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <UserRound size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Joined Delyx</Text>
            </View>
            <View style={styles.metaItem}>
              <Trophy size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Rank unclaimed</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          {[
            { value: "—", label: "Posts" },
            { value: "—", label: "Followers" },
            { value: "—", label: "Following" },
            { value: "—", label: "Wins" },
          ].map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.profileTabs, { borderBottomColor: colors.border }]}>
          {([
            { id: "posts", label: "Posts", icon: MessageSquare },
            { id: "media", label: "Media", icon: Image },
            { id: "stats", label: "Game stats", icon: Trophy },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} style={[styles.profileTab, { borderBottomColor: active ? colors.accent : "transparent" }]}>
                <Icon size={15} color={active ? colors.accent : colors.textSecondary} />
                <Text style={[styles.profileTabText, { color: active ? colors.textPrimary : colors.textSecondary }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceLight }]}>
            {activeTab === "posts" ? <MessageSquare size={25} color={colors.accent} /> : activeTab === "media" ? <Image size={25} color={colors.accent} /> : <Trophy size={25} color={colors.accent} />}
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            {activeTab === "posts" ? "Your story starts here" : activeTab === "media" ? "Your highlights will live here" : "Your record is waiting"}
          </Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            {activeTab === "posts"
              ? "Posts, match moments, and community updates will show up on your profile."
              : activeTab === "media"
                ? "Screenshots, clips, and your best match moments will be collected here."
                : "Tournament results, wins, and player statistics will appear as those features go live."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  navbar: { minHeight: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backButton: { width: 34, height: 38, alignItems: "center", justifyContent: "center" },
  navCopy: { gap: 2 },
  navTitle: { fontSize: 17, fontWeight: "900" },
  navSubtitle: { fontSize: 10 },
  scrollContent: { paddingBottom: 40 },
  cover: { height: 154, overflow: "hidden", justifyContent: "flex-end", padding: 18 },
  coverOrb: { position: "absolute", width: 220, height: 220, borderRadius: 110, borderWidth: 28, right: -55, top: -92 },
  coverOrbSmall: { position: "absolute", width: 110, height: 110, borderRadius: 55, right: 70, top: 40 },
  coverLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 9 },
  coverLabelText: { fontSize: 9, fontWeight: "900", letterSpacing: 1.7 },
  coverTitle: { fontSize: 25, fontWeight: "900", letterSpacing: -0.6, lineHeight: 27 },
  identitySection: { paddingHorizontal: 18, paddingBottom: 20 },
  identityTop: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: -33, marginBottom: 12 },
  avatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  editButton: { minHeight: 36, borderRadius: 999, borderWidth: 1, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 7 },
  editButtonText: { fontSize: 11, fontWeight: "800" },
  playerName: { fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  playerHandle: { fontSize: 12, marginTop: 3 },
  bio: { fontSize: 13, lineHeight: 19, marginTop: 13 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 13 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 11 },
  statsRow: { flexDirection: "row", paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 16, fontWeight: "900" },
  statLabel: { fontSize: 10 },
  profileTabs: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  profileTab: { flex: 1, minHeight: 47, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderBottomWidth: 3 },
  profileTabText: { fontSize: 10, fontWeight: "800" },
  emptyState: { paddingHorizontal: 32, paddingTop: 34, alignItems: "center" },
  emptyIcon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: "900", textAlign: "center" },
  emptyDescription: { fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 8 },
});

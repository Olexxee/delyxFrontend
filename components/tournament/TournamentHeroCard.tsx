import { useTournamentMedia } from "@/hooks/useTournamentMedia";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight, Trophy } from "lucide-react-native";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import TournamentProgress from "./TournamentProgress";
import TournamentStatusBadge from "./TournamentStatusBadge";

interface Props {
  tournament: TournamentDetail;
  showProgress?: boolean;
  showWinnerBanner?: boolean;
  showViewerRegistrationState?: boolean;
}

export default function TournamentHero({
  tournament,
  showProgress = true,
  showWinnerBanner = false,
  showViewerRegistrationState = false,
}: Props) {
  const { colors } = useTheme();
  const { data: media = [] } = useTournamentMedia(tournament.groupId, tournament.id);
  const cover = media.find((item) => item.role === "COVER");
  const winner = tournament.outcome?.winner;
  const format = tournament.type.replace(/_/g, " ").toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.coverWrap}>
        {cover?.url ? (
          <ImageBackground source={{ uri: cover.url }} style={styles.cover} imageStyle={styles.coverImage} resizeMode="cover">
            <LinearGradient colors={["rgba(8,12,22,0.08)", "rgba(8,12,22,0.9)"]} style={styles.coverGradient}>
              <View style={styles.coverTop}>
                <View style={styles.gamePill}><Text style={styles.gamePillText}>DELYX COMPETITIVE</Text></View>
                <Trophy size={20} color="#C5F36A" />
              </View>
              <Text style={styles.coverTitle} numberOfLines={3}>{tournament.name}</Text>
              <Text style={styles.coverSubtitle}>{format} · {tournament.participantCount}/{tournament.maxParticipants} PLAYERS</Text>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient colors={["#202C40", "#111827", "#0B1019"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
            <View style={styles.coverTop}>
              <View style={styles.gamePill}><Text style={styles.gamePillText}>DELYX COMPETITIVE</Text></View>
              <Trophy size={20} color="#C5F36A" />
            </View>
            <View style={styles.coverArtwork}>
              <View style={styles.coverOrb} />
              <Trophy size={42} color="#C5F36A" strokeWidth={1.4} />
            </View>
            <Text style={styles.coverTitle} numberOfLines={3}>{tournament.name}</Text>
            <Text style={styles.coverSubtitle}>{format} · {tournament.participantCount}/{tournament.maxParticipants} PLAYERS</Text>
          </LinearGradient>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{tournament.name}</Text>
            <Text style={[styles.groupText, { color: colors.textSecondary }]}>Tournament code · {tournament.tournamentCode || "Not assigned"}</Text>
          </View>
          <TournamentStatusBadge status={tournament.status} />
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{format}</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{tournament.participantCount} of {tournament.maxParticipants} players</Text>
        </View>

        {showViewerRegistrationState && tournament.viewerContext.isRegistered ? (
          <View style={[styles.viewerBadge, { backgroundColor: `${colors.accent}18`, borderColor: colors.accent }]}>
            <Text style={[styles.viewerBadgeText, { color: colors.accent }]}>You are participating</Text>
            <ArrowUpRight size={14} color={colors.accent} />
          </View>
        ) : null}

        {showWinnerBanner && winner ? (
          <View style={[styles.winnerCard, { backgroundColor: `${colors.gold}14`, borderColor: colors.gold }]}>
            <Text style={[styles.winnerLabel, { color: colors.textSecondary }]}>Tournament winner</Text>
            <Text style={[styles.winnerName, { color: colors.textPrimary }]}>{winner.username}</Text>
          </View>
        ) : null}

        {showProgress ? <TournamentProgress progress={tournament.progress} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 24, overflow: "hidden" },
  coverWrap: { padding: 8 },
  cover: { minHeight: 218, borderRadius: 18, overflow: "hidden", padding: 18, justifyContent: "space-between" },
  coverImage: { borderRadius: 18 },
  coverGradient: { flex: 1, minHeight: 182, justifyContent: "space-between", margin: -18, padding: 18 },
  coverTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  gamePill: { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  gamePillText: { color: "#F8FAFC", fontSize: 9, fontWeight: "900", letterSpacing: 1.4 },
  coverArtwork: { position: "absolute", right: 24, top: 64, opacity: 0.22 },
  coverOrb: { position: "absolute", width: 94, height: 94, borderRadius: 47, backgroundColor: "#C5F36A", right: -24, top: -25 },
  coverTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", letterSpacing: -0.6, maxWidth: "90%", marginTop: 24 },
  coverSubtitle: { color: "#D1D5DB", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginTop: 8 },
  body: { padding: 16, paddingTop: 10, gap: 14 },
  topRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  titleBlock: { flex: 1, gap: 4 },
  name: { fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  groupText: { fontSize: 12 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  metaText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  viewerBadge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  viewerBadgeText: { fontSize: 13, fontWeight: "800" },
  winnerCard: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 4 },
  winnerLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  winnerName: { fontSize: 18, fontWeight: "900" },
});

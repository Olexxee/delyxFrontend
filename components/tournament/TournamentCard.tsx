import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import { Calendar, Flame, TrendingUp, Trophy, Users } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { useJoinTournament } from "@/hooks/useTournaments";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { PillBadge } from "@/components/ui/Badge";
import { TournamentStatusBadge } from "@/components/ui/TournamentStatusBadge";

interface TournamentCardProps {
  tournament: Tournament;
  onPress?: () => void;
  style?: ViewStyle;
}

function fmt(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TournamentCard({
  tournament,
  onPress,
  style,
}: TournamentCardProps) {
  const { colors } = useTheme();
  const joinMutation = useJoinTournament(tournament.id);

  const participantCount = tournament.participantCount;
  const spotsLeft = Math.max(0, tournament.maxParticipants - participantCount);
  const fill =
    tournament.maxParticipants > 0
      ? participantCount / tournament.maxParticipants
      : 0;
  const isAlmostFull = fill >= 0.75;
  const isRegistered = tournament.userContext?.isRegistered ?? false;
  const canJoin =
    tournament.status === "registration" &&
    tournament.isRegistrationOpen &&
    !isRegistered;

  function handleJoin() {
    joinMutation.mutate(undefined, {
      onError: (error: unknown) => {
        console.warn(
          "Join tournament failed:",
          error instanceof Error ? error.message : "Unknown error",
        );
      },
    });
  }

  return (
    <AppCard
      variant="default"
      padding="lg"
      radiusSize="lg"
      style={[styles.card, style]}
      accessibilityLabel={`Tournament: ${tournament.name}`}
    >
      <View style={styles.badgeRow}>
        <PillBadge label={tournament.type.replace(/[_-]+/g, " ")} variant="primary" />
        {isAlmostFull && (
          <PillBadge label="Almost full" variant="warning" />
        )}
        {tournament.heatScore != null && (
          <View style={styles.heatBadge}>
            <Flame size={13} color={colors.warning} fill={colors.warning} />
            <Text style={[styles.heatText, { color: colors.textSecondary }]}>
              {tournament.heatScore}
            </Text>
          </View>
        )}
        <View style={styles.status}>
          <TournamentStatusBadge status={tournament.status} />
        </View>
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <Trophy size={17} color={colors.medal} strokeWidth={2} />
          <Text
            style={[styles.tournamentName, { color: colors.textPrimary }]}
            numberOfLines={2}
          >
            {tournament.name}
          </Text>
        </View>
        {tournament.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {tournament.description}
          </Text>
        ) : null}
      </View>

      <View style={[styles.statsGrid, { borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Users size={14} color={colors.textSecondary} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {participantCount} / {tournament.maxParticipants}
          </Text>
          {spotsLeft > 0 && (
            <Text style={[styles.statSub, { color: colors.textSecondary }]}>
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </Text>
          )}
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Register by
          </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {fmt(tournament.registrationDeadline)}
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <TrendingUp size={14} color={colors.textSecondary} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Starts
          </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {fmt(tournament.startDate)}
          </Text>
        </View>
      </View>

      {tournament.prizePool ? (
        <View style={[styles.prizeBlock, { borderTopColor: colors.border }]}>
          <Text style={[styles.prizeLabel, { color: colors.textSecondary }]}>
            Prize pool
          </Text>
          <Text style={[styles.prizeAmount, { color: colors.medal }]}>
            {tournament.prizePool}
          </Text>
        </View>
      ) : null}

      <View style={styles.ctaRow}>
        {isRegistered && (
          <PillBadge
            label="Registered"
            variant="success"
            compact={false}
          />
        )}
        {canJoin ? (
          <AppButton
            label="Join tournament"
            onPress={handleJoin}
            loading={joinMutation.isPending}
            disabled={joinMutation.isPending}
            style={styles.primaryAction}
          />
        ) : null}
        {onPress ? (
          <AppButton
            label={isRegistered || !canJoin ? "View tournament" : "View"}
            onPress={onPress}
            variant="secondary"
            style={styles.viewAction}
          />
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    gap: 14,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  heatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 4,
  },
  heatText: {
    fontSize: 12,
    fontWeight: "600",
  },
  status: {
    marginLeft: "auto",
  },
  titleBlock: {
    gap: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tournamentName: {
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
    lineHeight: 23,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  statItem: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 15,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  statSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  statDivider: {
    width: 1,
    marginVertical: 2,
  },
  prizeBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  prizeLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  prizeAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryAction: {
    flex: 1,
    minWidth: 0,
  },
  viewAction: {
    flex: 1,
    minWidth: 0,
  },
});

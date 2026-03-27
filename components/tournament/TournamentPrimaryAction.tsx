import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentDetail } from "@/types/tournament";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  tournament: TournamentDetail;
  joining?: boolean;
  leaving?: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export default function TournamentPrimaryAction({
  tournament,
  joining = false,
  leaving = false,
  onJoin,
  onLeave,
}: Props) {
  const { colors } = useTheme();
  const { viewerContext, status } = tournament;

  if (status !== "registration") return null;

  const isRegistered = viewerContext.isRegistered;
  const canJoin = viewerContext.canJoin;
  const canLeave = viewerContext.canLeave;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {isRegistered ? (
        <>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            You’re registered
          </Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Your spot in this tournament is secured.
          </Text>

          {canLeave ? (
            <Pressable
              onPress={onLeave}
              disabled={leaving}
              style={[
                styles.secondaryButton,
                { borderColor: colors.danger, opacity: leaving ? 0.7 : 1 },
              ]}
            >
              {leaving ? (
                <ActivityIndicator color={colors.danger} />
              ) : (
                <Text style={[styles.secondaryButtonText, { color: colors.danger }]}>
                  Leave Tournament
                </Text>
              )}
            </Pressable>
          ) : null}
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Registration is open
          </Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Join now to secure your spot before the tournament starts.
          </Text>

          <Pressable
            onPress={onJoin}
            disabled={!canJoin || joining}
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: !canJoin || joining ? 0.7 : 1,
              },
            ]}
          >
            {joining ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Join Tournament</Text>
            )}
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtext: {
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
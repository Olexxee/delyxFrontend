import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    completed: number;
    total: number;
    currentMatchday?: number;
    totalMatchdays?: number;
    asCard?: boolean;
}

export default function TournamentProgress({
    completed,
    total,
    currentMatchday,
    totalMatchdays,
    asCard = false,
}: Props) {
    const { colors } = useTheme();
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const bar = (
        <>
            {/* Matchday line — only shown when the extra props are provided */}
            {currentMatchday != null && totalMatchdays != null && (
                <Text style={[styles.matchdayText, { color: colors.textSecondary }]}>
                    Matchday {currentMatchday} of {totalMatchdays}
                </Text>
            )}

            <Text style={[styles.matchesText, { color: colors.textSecondary }]}>
                {completed}/{total} matches {asCard ? "played" : ""}
            </Text>

            <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: asCard ? colors.primary : colors.accent,
                            width: `${percent}%` as any,
                        },
                    ]}
                />
            </View>

            {asCard && (
                <Text style={[styles.subLabel, { color: colors.textSecondary }]}>
                    {completed} of {total} matches completed
                </Text>
            )}
        </>
    );

    if (asCard) {
        return (
            <View
                style={[
                    styles.card,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
            >
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Progress
                </Text>
                {bar}
            </View>
        );
    }

    return <View style={styles.simple}>{bar}</View>;
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        gap: 6,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
    },

    // Simple mode (row)
    simple: {
        marginBottom: 10,
        gap: 4,
    },

    matchdayText: { fontSize: 13 },
    matchesText: { fontSize: 12 },
    subLabel: { fontSize: 11 },

    track: {
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: 3,
    },
});
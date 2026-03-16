import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    settings: Tournament["settings"];
}

function RuleItem({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    const { colors } = useTheme();
    return (
        <View style={styles.ruleItem}>
            <Text style={[styles.ruleLabel, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.ruleValue, { color }]}>{value}</Text>
        </View>
    );
}

export default function TournamentRulesCard({ settings }: Props) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Rules & Points
            </Text>
            <View style={styles.grid}>
                <RuleItem
                    label="Win"
                    value={`+${settings.pointsForWin} pts`}
                    color={colors.accent}
                />
                <RuleItem
                    label="Draw"
                    value={`+${settings.pointsForDraw} pt`}
                    color={colors.warning}
                />
                <RuleItem
                    label="Loss"
                    value={`${settings.pointsForLoss} pts`}
                    color={colors.danger}
                />
                <RuleItem
                    label="Format"
                    value={`${settings.rounds === "double" ? "Double" : "Single"} round-robin`}
                    color={colors.textSecondary}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    ruleItem: {
        width: "45%",
        gap: 2,
    },
    ruleLabel: {
        fontSize: 11,
    },
    ruleValue: {
        fontSize: 14,
        fontWeight: "700",
    },
});
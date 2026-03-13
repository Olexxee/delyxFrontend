import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TournamentStatusBadge from "./TournamentStatusBadge";

interface TournamentHeaderProps {
    name: string;
    tournamentCode: string;
    status?: "registration" | "ongoing" | "completed";
}

export default function TournamentHeader({
    name,
    tournamentCode,
    status,
}: TournamentHeaderProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text
                    style={[styles.name, { color: colors.textPrimary }]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
                {status && <TournamentStatusBadge status={status} />}
            </View>

            <Text style={[styles.code, { color: colors.textSecondary }]}>
                {tournamentCode}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        gap: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    name: {
        fontWeight: "700",
        fontSize: 16,
        flex: 1,
    },
    code: {
        fontSize: 13,
    },
});
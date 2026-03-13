import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Text, View } from "react-native";

interface Props {
    startDate: string;
    endDate: string;
}

export default function TournamentTimeline({ startDate, endDate }: Props) {
    const { colors } = useTheme();

    function fmt(iso: string) {
        return new Date(iso).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                Start: {fmt(startDate)}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                End: {fmt(endDate)}
            </Text>
        </View>
    );
}
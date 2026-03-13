import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Text, View } from "react-native";

interface Props {
    completed: number;
    total: number;
}

export default function TournamentProgress({ completed, total }: Props) {
    const { colors } = useTheme();
    const percent = total === 0 ? 0 : (completed / total) * 100;

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, marginBottom: 4, color: colors.textSecondary }}>
                Matches: {completed}/{total}
            </Text>

            <View
                style={{
                    height: 6,
                    backgroundColor: colors.border,
                    borderRadius: 3,
                }}
            >
                <View
                    style={{
                        width: `${percent}%`,
                        height: 6,
                        backgroundColor: colors.accent,
                        borderRadius: 3,
                    }}
                />
            </View>
        </View>
    );
}
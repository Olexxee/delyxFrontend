import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Text, View } from "react-native";

interface Props {
    current: number;
    max: number;
}

export default function TournamentParticipants({ current, max }: Props) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                Participants: {current}/{max}
            </Text>
        </View>
    );
}
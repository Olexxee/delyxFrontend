import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TournamentActionsProps {
    canJoin: boolean;
    onJoin?: () => void;
    onView?: () => void;
}

export default function TournamentActions({
    canJoin,
    onJoin,
    onView,
}: TournamentActionsProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.row}>
            {canJoin && (
                <Pressable
                    onPress={onJoin}
                    style={[styles.joinBtn, { backgroundColor: colors.accent }]}
                >
                    <Text style={styles.joinBtnText}>Join</Text>
                </Pressable>
            )}

            <Pressable onPress={onView} style={styles.viewBtn}>
                <Text style={[styles.viewBtnText, { color: colors.accent }]}>View</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 12,
    },
    joinBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    joinBtnText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    viewBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    viewBtnText: {
        fontWeight: "600",
        fontSize: 14,
    },
});
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FeedItem } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { resolveAvatarShapes } from "@/utils/resolveAvatarShape";

export function ResultRow({ item }: { item: FeedItem }) {
    if (!item || item.type !== "RESULT") return null;

    const { colors } = useTheme();

    let shapes;
    try {
        shapes = resolveAvatarShapes(item);
    } catch {
        return null;
    }
    return (
        <View style={styles.rowContainer}>
            <View style={styles.matchRow}>
                {/* You */}
                <View style={styles.avatarColumn}>
                    <Avatar uri={item.yourAvatar} shape={shapes.your} borderColor={colors.accent} />
                    <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>{item.yourName}</Text>
                </View>

                {/* Score */}
                <View style={styles.centerColumn}>
                    <Text style={[styles.score, { color: colors.textPrimary }]}>
                        {item.score ?? "0-0"}
                    </Text>
                    <View style={styles.badgeRow}>
                        {item.outcome === "WIN" && <Badge label="🏆" type="medal" />}
                        {item.outcome === "LOSS" && <Badge label="❌" type="status" />}
                    </View>
                </View>

                {/* Opponent */}
                <View style={styles.avatarColumn}>
                    <Avatar uri={item.opponentAvatar} shape={shapes.opponent} borderColor={colors.accent} />
                    <Text style={[styles.playerLabel, { color: colors.textPrimary }]}>{item.opponentName}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: { paddingVertical: 4 },
    matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    avatarColumn: { alignItems: "center", flex: 1 },
    centerColumn: { alignItems: "center", flex: 1 },
    score: { fontSize: 16, fontWeight: "800" },
    playerLabel: { marginTop: 4, fontSize: 10, fontWeight: "600" },
    badgeRow: { marginTop: 4 }
});
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { STATUS_META } from "@/types/tournament";
import { ProgressBar } from "@/components/ui/groupInfoUi";
import type { Tournament } from "@/types/tournament";
import { useTheme } from "@/theme/ThemeProvider";

interface TournamentRowProps {
    tournament: Tournament;
    isAdmin: boolean;
    expanded?: boolean;
    onPress?: () => void;
}

export function TournamentRow({ tournament, isAdmin, expanded = false, onPress }: TournamentRowProps) {
    const { colors } = useTheme();
    const meta = STATUS_META[tournament.status];
    const fill = tournament.maxParticipants > 0
        ? tournament.participantCount / tournament.maxParticipants
        : 0;
    const canRegister = !isAdmin && tournament.status === "registration";

    return (
        <TouchableOpacity
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.left}>
                <View style={[styles.pill, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.pillText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                        {tournament.name}
                    </Text>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        {tournament.startDate} · {tournament.participantCount}/{tournament.maxParticipants}
                    </Text>
                    {expanded && (
                        <ProgressBar fill={fill} color={meta.color} trackColor={colors.border} style={styles.bar} />
                    )}
                </View>
            </View>

            {canRegister && (
                <TouchableOpacity
                    style={[styles.joinBtn, { backgroundColor: colors.accent }]}
                    onPress={onPress}
                >
                    <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
    left: { flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 },
    pill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginTop: 1 },
    pillText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
    info: { flex: 1 },
    name: { fontSize: 14, fontWeight: "600" },
    sub: { fontSize: 11, marginTop: 2 },
    bar: { marginTop: 6 },
    joinBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginLeft: 8 },
    joinBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
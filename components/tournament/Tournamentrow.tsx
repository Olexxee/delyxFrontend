import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { STATUS_META } from "@/types/group";
import { ProgressBar } from "@/components/ui/groupInfoUi";
import type { Tournament, ThemeColors } from "@/types/group";

interface TournamentRowProps {
    tournament: Tournament;
    isAdmin: boolean;
    colors: ThemeColors;
    /** Show progress bar + extended layout */
    expanded?: boolean;
}

export function TournamentRow({
    tournament,
    isAdmin,
    colors,
    expanded = false,
}: TournamentRowProps) {
    const meta = STATUS_META[tournament.status];
    const fill = tournament.participantCount / tournament.maxParticipants;
    const canRegister = !isAdmin && tournament.status === "open";

    return (
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
            {/* Left: status pill + info */}
            <View style={styles.left}>
                <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                        {tournament.name}
                    </Text>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        {tournament.startDate} · {tournament.participantCount}/{tournament.maxParticipants}
                    </Text>
                    {expanded && (
                        <ProgressBar
                            fill={fill}
                            color={meta.color}
                            trackColor={colors.border}
                            style={styles.bar}
                        />
                    )}
                </View>
            </View>

            {/* Right: register CTA (member + open tournaments only) */}
            {canRegister && (
                <TouchableOpacity
                    style={[styles.registerBtn, { backgroundColor: colors.accent }]}
                    onPress={() => Alert.alert("Register", `Registering for ${tournament.name}`)}
                >
                    <Text style={styles.registerBtnText}>Join</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    left: { flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 },
    statusPill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginTop: 1 },
    statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
    info: { flex: 1 },
    name: { fontSize: 14, fontWeight: "600" },
    sub: { fontSize: 11, marginTop: 2 },
    bar: { marginTop: 6 },
    registerBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginLeft: 8 },
    registerBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
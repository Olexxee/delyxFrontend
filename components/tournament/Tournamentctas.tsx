import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import { CalendarDays, Trophy } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fmt } from "./TournamentHeroCard";

interface Props {
    tournament: Tournament;
    isRegistered: boolean;
    canJoin: boolean;
    isMutating: boolean;
    isLeavePending: boolean;
    onJoin: () => void;
    onLeave: () => void;
    onViewFixtures: () => void;
}

export default function TournamentCTAs({
    tournament,
    isRegistered,
    canJoin,
    isMutating,
    isLeavePending,
    onJoin,
    onLeave,
    onViewFixtures,
}: Props) {
    const { colors } = useTheme();

    const isCompleted = tournament.status === "completed";
    const isOngoing = tournament.status === "ongoing";
    const showFixtures = isOngoing || isCompleted;

    function confirmLeave() {
        Alert.alert(
            "Leave Tournament",
            "Are you sure you want to withdraw?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Leave", style: "destructive", onPress: onLeave },
            ]
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* ── Join button ── */}
            {canJoin && (
                <TouchableOpacity
                    style={[
                        styles.joinBtn,
                        { backgroundColor: colors.accent },
                        isMutating && styles.mutating,
                    ]}
                    onPress={onJoin}
                    disabled={isMutating}
                    activeOpacity={0.85}
                >
                    {isMutating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.joinBtnText}>Join Tournament</Text>
                    )}
                </TouchableOpacity>
            )}

            {/* ── Registered + Leave row ── */}
            {isRegistered && tournament.status === "registration" && (
                <View style={styles.registeredRow}>
                    <View
                        style={[
                            styles.registeredBadge,
                            {
                                backgroundColor: colors.accent + "18",
                                borderColor: colors.accent,
                            },
                        ]}
                    >
                        <Text style={[styles.registeredText, { color: colors.accent }]}>
                            ✓ Registered
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.leaveBtn, { borderColor: colors.danger }]}
                        onPress={confirmLeave}
                        disabled={isMutating}
                        activeOpacity={0.85}
                    >
                        {isLeavePending ? (
                            <ActivityIndicator color={colors.danger} size="small" />
                        ) : (
                            <Text style={[styles.leaveBtnText, { color: colors.danger }]}>
                                Leave
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* ── View Fixtures / Matches ── */}
            {showFixtures && (
                <TouchableOpacity
                    style={[
                        styles.outlineBtn,
                        { backgroundColor: colors.surface, borderColor: colors.primary },
                    ]}
                    onPress={onViewFixtures}
                    activeOpacity={0.85}
                >
                    <CalendarDays size={16} color={colors.primary} />
                    <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
                        {isCompleted ? "View Fixtures & Results" : "View Fixtures & Matches"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* ── View Results (completed only) ── */}
            {isCompleted && (
                <TouchableOpacity
                    style={[
                        styles.outlineBtn,
                        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                    ]}
                    onPress={onViewFixtures}
                    activeOpacity={0.85}
                >
                    <Trophy size={16} color={colors.medal} />
                    <Text style={[styles.outlineBtnText, { color: colors.textPrimary }]}>
                        View Results
                    </Text>
                </TouchableOpacity>
            )}

            {/* ── Registration deadline notice ── */}
            {tournament.status === "registration" && tournament.registrationDeadline ? (
                <Text style={[styles.deadlineNote, { color: colors.textSecondary }]}>
                    Registration closes {fmt(tournament.registrationDeadline)}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 10,
    },
    mutating: {
        opacity: 0.6,
    },

    // Join
    joinBtn: {
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
    },
    joinBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    // Registered + Leave
    registeredRow: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    registeredBadge: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
        alignItems: "center",
    },
    registeredText: {
        fontSize: 16,
        fontWeight: "700",
    },
    leaveBtn: {
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    leaveBtnText: {
        fontSize: 14,
        fontWeight: "700",
    },

    // Outline buttons (Fixtures / Results)
    outlineBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 15,
    },
    outlineBtnText: {
        fontSize: 16,
        fontWeight: "600",
    },

    // Deadline
    deadlineNote: {
        fontSize: 12,
        textAlign: "center",
    },
});
import { Avatar } from "@/components/ui/Avatar";
import type { GroupInfo, ThemeColors } from "@/types/group";
import { Edit2, Shield, Trophy, UserCheck, Users } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupHeroProps {
    group: GroupInfo;
    isAdmin: boolean;
    visibleTournamentsCount: number;
    colors: ThemeColors;
}

export function GroupHero({ group, isAdmin, visibleTournamentsCount, colors }: GroupHeroProps) {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Avatar uri={group.avatar} size={88} />
                {isAdmin && (
                    <TouchableOpacity
                        style={[styles.avatarEditBadge, { backgroundColor: colors.accent }]}
                        onPress={() => Alert.alert("Edit", "Open avatar picker")}
                    >
                        <Edit2 size={11} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Name + privacy pill */}
            <View style={styles.nameMeta}>
                <Text style={[styles.groupName, { color: colors.textPrimary }]}>
                    {group.name}
                </Text>
                <View style={[styles.privacyPill, { borderColor: colors.border }]}>
                    <Shield size={11} color={colors.textSecondary} />
                    <Text style={[styles.privacyLabel, { color: colors.textSecondary }]}>
                        {" "}{group.privacy.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: colors.textSecondary }]}>
                {group.description}
            </Text>

            {/* Stat row */}
            <View style={styles.statRow}>
                <StatChip
                    icon={<Users size={14} color={colors.accent} />}
                    value={`${group.memberCount}`}
                    label="Members"
                    colors={colors}
                />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <StatChip
                    icon={<Trophy size={14} color={colors.accent} />}
                    value={`${visibleTournamentsCount}`}
                    label="Tournaments"
                    colors={colors}
                />
                {isAdmin && !!group.joinRequestCount && (
                    <>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <StatChip
                            icon={<UserCheck size={14} color="#ffd740" />}
                            value={`${group.joinRequestCount}`}
                            label="Requests"
                            colors={colors}
                        />
                    </>
                )}
            </View>
        </View>
    );
}

/* ─── StatChip ─── */
function StatChip({
    icon,
    value,
    label,
    colors,
}: {
    icon: React.ReactNode;
    value: string;
    label: string;
    colors: ThemeColors;
}) {
    return (
        <View style={styles.statChip}>
            {icon}
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 20,
    },
    avatarWrapper: { position: "relative", marginBottom: 14 },
    avatarEditBadge: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    nameMeta: { alignItems: "center", marginBottom: 10 },
    groupName: { fontSize: 24, fontWeight: "800", letterSpacing: 0.2, textAlign: "center" },
    privacyPill: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginTop: 6,
    },
    privacyLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
    description: {
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    statChip: { alignItems: "center", gap: 2 },
    statValue: { fontSize: 18, fontWeight: "800", marginTop: 4 },
    statLabel: { fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
    divider: { width: 1, height: 32 },
});
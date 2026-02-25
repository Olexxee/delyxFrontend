/**
 * group-info/MembersSection.tsx
 * Preview of first 5 members with online indicator and admin crown.
 */

import React from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Crown, Users } from "lucide-react-native";
import { SectionCard, SectionHeader } from "@/components/ui/groupInfoUi";
import type { Member, ThemeColors } from "@/types/group";

const SCREEN_W = Dimensions.get("window").width;

interface MembersSectionProps {
    members: Member[];
    colors: ThemeColors;
}

export function MembersSection({ members, colors }: MembersSectionProps) {
    return (
        <SectionCard colors={colors}>
            <SectionHeader
                title="Members"
                icon={<Users size={16} color={colors.accent} />}
                actionLabel="View All"
                onAction={() => Alert.alert("Members", "Open full members screen")}
                colors={colors}
            />
            <View style={styles.grid}>
                {members.slice(0, 5).map((m) => (
                    <MemberChip key={m.id} member={m} colors={colors} />
                ))}
            </View>
        </SectionCard>
    );
}

/* ─── MemberChip ─── */
function MemberChip({ member, colors }: { member: Member; colors: ThemeColors }) {
    return (
        <View style={[styles.chip, { width: chipWidth() }]}>
            <View style={styles.avatarWrap}>
                <Avatar uri={member.avatarUri} size={42} />
                {member.isOnline && (
                    <View style={[styles.onlineDot, { borderColor: colors.surface }]} />
                )}
            </View>
            <Text
                style={[styles.name, { color: colors.textPrimary }]}
                numberOfLines={1}
            >
                {member.displayName}
            </Text>
            {member.role === "admin" && (
                <Crown size={11} color="#ffd740" style={{ marginTop: 1 }} />
            )}
        </View>
    );
}

/** Divide available width evenly across 5 chips */
function chipWidth() {
    const horizontalPadding = 32; // card paddingHorizontal × 2
    const cardMargin = 32;        // 16 margin each side
    return (SCREEN_W - horizontalPadding - cardMargin - 40) / 5;
}

const styles = StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    chip: { alignItems: "center" },
    avatarWrap: { position: "relative" },
    onlineDot: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#00e676",
        borderWidth: 2,
    },
    name: { fontSize: 10, fontWeight: "600", textAlign: "center", marginTop: 5 },
});
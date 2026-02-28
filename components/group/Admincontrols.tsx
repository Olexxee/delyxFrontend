import {
    ChevronRight,
    Edit2,
    FileText,
    Trash2,
    UserCheck,
    Users,
} from "lucide-react-native";
import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SectionCard } from "@/components/ui/groupInfoUi";
import { useTheme } from "@/theme/ThemeProvider";
import type { ColorsType } from "@/theme/color";


/* ───────────────────────────────────────────── */
/* Admin Controls */
/* ───────────────────────────────────────────── */

interface AdminControlsProps {
    joinRequestCount?: number;
}

export function AdminControls({ joinRequestCount }: AdminControlsProps) {
    const { colors } = useTheme();

    return (
        <SectionCard colors={colors}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
                MANAGEMENT
            </Text>

            <AdminRow
                icon={<Edit2 size={17} color={colors.accent} />}
                label="Edit Group Info"
                onPress={() => Alert.alert("Edit Group")}
                colors={colors}
            />

            <AdminRow
                icon={<Users size={17} color={colors.accent} />}
                label="Manage Members"
                onPress={() => Alert.alert("Manage Members")}
                colors={colors}
            />

            <AdminRow
                icon={<UserCheck size={17} color="#ffd740" />}
                label="Join Requests"
                badge={joinRequestCount}
                onPress={() => Alert.alert("Join Requests")}
                colors={colors}
            />

            <AdminRow
                icon={<FileText size={17} color={colors.accent} />}
                label="Draft Tournaments"
                onPress={() => Alert.alert("Drafts")}
                colors={colors}
                noBorder
            />
        </SectionCard>
    );
}

/* ───────────────────────────────────────────── */
/* Danger Zone */
/* ───────────────────────────────────────────── */

export function DangerZone() {
    const { colors } = useTheme();

    const confirmDelete = () => {
        Alert.alert(
            "Delete Group",
            "This action is irreversible. All data will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
            ]
        );
    };

    return (
        <SectionCard colors={colors} style={styles.dangerCard}>
            <Text style={[styles.groupLabel, { color: "#ef5350" }]}>
                DANGER ZONE
            </Text>

            <TouchableOpacity style={styles.dangerRow} onPress={confirmDelete}>
                <Trash2 size={17} color="#ef5350" />
                <Text style={styles.dangerLabel}>Delete Group</Text>
            </TouchableOpacity>
        </SectionCard>
    );
}

/* ───────────────────────────────────────────── */
/* Admin Row */
/* ───────────────────────────────────────────── */

function AdminRow({
    icon,
    label,
    badge,
    onPress,
    colors,
    noBorder = false,
}: {
    icon: React.ReactNode;
    label: string;
    badge?: number;
    onPress: () => void;
    colors: ColorsType;
    noBorder?: boolean;
}) {
    return (
        <TouchableOpacity
            style={[
                styles.row,
                !noBorder && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
            ]}
            onPress={onPress}
        >
            <View style={styles.rowLeft}>
                {icon}
                <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
                    {label}
                </Text>
            </View>

            <View style={styles.rowRight}>
                {!!badge && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
                <ChevronRight size={16} color={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );
}

/* ───────────────────────────────────────────── */
/* Styles */
/* ───────────────────────────────────────────── */

const styles = StyleSheet.create({
    groupLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 13,
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: "500",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    badge: {
        borderRadius: 20,
        paddingHorizontal: 7,
        paddingVertical: 2,
        backgroundColor: "#ffd740",
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#000",
    },
    dangerCard: {
        borderColor: "rgba(239,83,80,0.3)",
    },
    dangerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
    },
    dangerLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ef5350",
    },
});
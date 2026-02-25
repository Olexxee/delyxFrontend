import type { ThemeColors } from "@/types/group";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/* ─── Card wrapper ─── */
export function SectionCard({
    colors,
    children,
    style,
}: {
    colors: ThemeColors;
    children: React.ReactNode;
    style?: object;
}) {
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.cardBackground ?? colors.surface,
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

/* ─── Section header row ─── */
export function SectionHeader({
    title,
    icon,
    actionLabel,
    onAction,
    colors,
}: {
    title: string;
    icon: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    colors: ThemeColors;
}) {
    return (
        <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
                {icon}
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {title}
                </Text>
            </View>
            {actionLabel && onAction && (
                <TouchableOpacity style={styles.sectionAction} onPress={onAction}>
                    <Text style={[styles.sectionActionText, { color: colors.accent }]}>
                        {actionLabel}
                    </Text>
                    <ChevronRight size={14} color={colors.accent} />
                </TouchableOpacity>
            )}
        </View>
    );
}

/* ─── Progress bar ─── */
export function ProgressBar({
    fill,
    color,
    trackColor,
    style,
}: {
    fill: number; // 0–1
    color: string;
    trackColor: string;
    style?: object;
}) {
    return (
        <View style={[styles.barTrack, { backgroundColor: trackColor }, style]}>
            <View
                style={[styles.barFill, { width: `${Math.min(fill, 1) * 100}%`, backgroundColor: color }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 7 },
    sectionTitle: { fontSize: 15, fontWeight: "700" },
    sectionAction: { flexDirection: "row", alignItems: "center", gap: 2 },
    sectionActionText: { fontSize: 13, fontWeight: "600" },
    barTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
    barFill: { height: 5, borderRadius: 3 },
});
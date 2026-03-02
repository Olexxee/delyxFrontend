import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import { Globe, Lock, Users, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Member = { _id: string; name: string; avatar?: { url: string } | string };

type Props = {
    visible: boolean;
    group: GroupOverview | null;
    onClose: () => void;
    onJoin: (group: GroupOverview) => void;
    onViewInfo: (group: GroupOverview) => void;
    isJoining?: boolean;
};

const AVATAR_STACK_SIZE = 5;
const AVATAR_ITEM_SIZE = 34;
const AVATAR_OVERLAP = 10;

export const GroupInfoModal: React.FC<Props> = ({
    visible,
    group,
    onClose,
    onJoin,
    onViewInfo,
    isJoining,
}) => {
    const { colors } = useTheme();
    const [descExpanded, setDescExpanded] = useState(false);

    if (!group) return null;

    const members: Member[] = (group.membersPreview as any) ?? [];
    const visibleMembers = members.slice(0, AVATAR_STACK_SIZE);
    const extraCount = Math.max(0, (group.totalMembers ?? members.length) - AVATAR_STACK_SIZE);
    const isPrivate = (group as any).privacy === "private";
    const description = (group as any).description as string | undefined;
    const stackWidth =
        visibleMembers.length * (AVATAR_ITEM_SIZE - AVATAR_OVERLAP) + AVATAR_OVERLAP + (extraCount > 0 ? 36 : 0);

    const avatarUrl =
        typeof group.avatar === "string"
            ? group.avatar
            : (group.avatar as any)?.url ?? "";

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surfaceLight,
                            shadowColor: "#000",
                            borderColor: colors.border,
                        },
                    ]}
                >
                    {/* ── Close button ── */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
                        <X size={18} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* ── Hero ── */}
                    <View style={styles.hero}>
                        <View
                            style={[
                                styles.avatarRing,
                                { borderColor: colors.primary + "33", backgroundColor: colors.surface },
                            ]}
                        >
                            <Avatar uri={avatarUrl} size={80} />
                        </View>
                        <Text style={[styles.groupName, { color: colors.textPrimary }]} numberOfLines={2}>
                            {group.name}
                        </Text>

                        {/* ── Stat pills ── */}
                        <View style={styles.pillRow}>
                            <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Users size={12} color={colors.textSecondary} />
                                <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                                    {group.totalMembers ?? members.length} members
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.pill,
                                    {
                                        backgroundColor: isPrivate
                                            ? colors.primary + "18"
                                            : "#22c55e18",
                                        borderColor: isPrivate ? colors.primary + "44" : "#22c55e44",
                                    },
                                ]}
                            >
                                {isPrivate ? (
                                    <Lock size={12} color={colors.primary} />
                                ) : (
                                    <Globe size={12} color="#22c55e" />
                                )}
                                <Text
                                    style={[
                                        styles.pillText,
                                        { color: isPrivate ? colors.primary : "#22c55e" },
                                    ]}
                                >
                                    {isPrivate ? "Private" : "Public"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Divider ── */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* ── Description ── */}
                    {description ? (
                        <View style={styles.descSection}>
                            <Text
                                style={[styles.descText, { color: colors.textSecondary }]}
                                numberOfLines={descExpanded ? undefined : 3}
                            >
                                {description}
                            </Text>
                            {description.length > 120 && (
                                <TouchableOpacity onPress={() => setDescExpanded((p) => !p)}>
                                    <Text style={[styles.readMore, { color: colors.primary }]}>
                                        {descExpanded ? "Show less" : "Read more"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <Text style={[styles.descText, { color: colors.textSecondary, paddingHorizontal: 20, paddingTop: 12 }]}>
                            No description available.
                        </Text>
                    )}

                    {/* ── Member avatar stack ── */}
                    {visibleMembers.length > 0 && (
                        <View style={styles.membersRow}>
                            <View style={[styles.avatarStack, { width: stackWidth }]}>
                                {visibleMembers.map((m, i) => {
                                    const mUrl =
                                        typeof m.avatar === "string" ? m.avatar : m.avatar?.url ?? "";
                                    return (
                                        <View
                                            key={m._id}
                                            style={[
                                                styles.stackedAvatar,
                                                {
                                                    left: i * (AVATAR_ITEM_SIZE - AVATAR_OVERLAP),
                                                    borderColor: colors.surfaceLight,
                                                },
                                            ]}
                                        >
                                            <Avatar uri={mUrl} size={AVATAR_ITEM_SIZE} />
                                        </View>
                                    );
                                })}
                                {extraCount > 0 && (
                                    <View
                                        style={[
                                            styles.stackedAvatar,
                                            styles.extraBadge,
                                            {
                                                left: visibleMembers.length * (AVATAR_ITEM_SIZE - AVATAR_OVERLAP),
                                                backgroundColor: colors.primary + "22",
                                                borderColor: colors.surfaceLight,
                                                width: AVATAR_ITEM_SIZE,
                                                height: AVATAR_ITEM_SIZE,
                                                borderRadius: AVATAR_ITEM_SIZE / 2,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.extraText, { color: colors.primary }]}>
                                            +{extraCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* ── Actions ── */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btnOutline, { borderColor: colors.border }]}
                            onPress={() => onViewInfo(group)}
                            activeOpacity={0.75}
                        >
                            <Text style={[styles.btnOutlineText, { color: colors.textPrimary }]}>
                                View Info
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.btnFill,
                                { backgroundColor: colors.primary },
                                isJoining && { opacity: 0.7 },
                            ]}
                            onPress={() => onJoin(group)}
                            disabled={isJoining}
                            activeOpacity={0.8}
                        >
                            {isJoining ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.btnFillText}>Join Group</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: "100%",
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.18,
                shadowRadius: 24,
            },
            android: { elevation: 10 },
        }),
    },
    closeBtn: {
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 10,
        padding: 4,
    },
    hero: {
        alignItems: "center",
        paddingTop: 32,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    avatarRing: {
        padding: 4,
        borderRadius: 50,
        borderWidth: 3,
        marginBottom: 12,
    },
    groupName: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    pillRow: {
        flexDirection: "row",
        gap: 8,
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 12,
        fontWeight: "500",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 20,
    },
    descSection: {
        paddingHorizontal: 20,
        paddingTop: 14,
    },
    descText: {
        fontSize: 14,
        lineHeight: 20,
    },
    readMore: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 4,
    },
    membersRow: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 4,
    },
    avatarStack: {
        height: AVATAR_ITEM_SIZE,
        position: "relative",
    },
    stackedAvatar: {
        position: "absolute",
        top: 0,
        borderWidth: 2,
        borderRadius: AVATAR_ITEM_SIZE / 2,
        overflow: "hidden",
    },
    extraBadge: {
        justifyContent: "center",
        alignItems: "center",
    },
    extraText: {
        fontSize: 11,
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        padding: 20,
        paddingTop: 18,
    },
    btnOutline: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        alignItems: "center",
    },
    btnOutlineText: {
        fontWeight: "600",
        fontSize: 15,
    },
    btnFill: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    btnFillText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
});
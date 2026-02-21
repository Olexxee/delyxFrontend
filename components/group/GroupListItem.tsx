import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/theme/ThemeProvider";
import { convertToHumanReadableTime } from "@/utils/convertToHumanReadableTime";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    group: {
        name: string;
        avatar?: string | null;
        chatRoomId?: string;
        lastMessage?: string | null;
        lastMessageAt?: string | null;
        unreadCount?: number;
    };
    onPress: (group: any) => void;
};

export const GroupListItem: React.FC<Props> = ({ group, onPress }) => {
    const { colors } = useTheme();
    const hasChat = !!group.chatRoomId;
    const unreadCount = Number(group.unreadCount) || 0;

    return (
        <TouchableOpacity
            activeOpacity={hasChat ? 0.7 : 1}
            onPress={() => hasChat && onPress(group)}
            style={[
                styles.cardContainer,
                { backgroundColor: colors.surfaceLight, borderColor: colors.border },
            ]}
        >
            <Avatar uri={group.avatar ?? undefined} />

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text
                        style={[styles.name, { color: colors.textPrimary }]}
                        numberOfLines={1}
                    >
                        {group.name}
                    </Text>
                    {group.lastMessageAt && (
                        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                            {convertToHumanReadableTime(group.lastMessageAt)}
                        </Text>
                    )}
                </View>

                <View style={styles.footerRow}>
                    <Text
                        style={[styles.message, { color: colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {/* lastMessage is now a plain decrypted string from the backend */}
                        {group.lastMessage || "No messages yet"}
                    </Text>
                    {unreadCount > 0 && (
                        <Badge
                            label={unreadCount > 99 ? "99+" : String(unreadCount)}
                            type="status"
                            size={18}
                        />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    content: { flex: 1, marginLeft: 12 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    name: { fontSize: 16, fontWeight: "600", flex: 1, marginRight: 8 },
    timestamp: { fontSize: 12, fontWeight: "400" },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    message: { flex: 1, fontSize: 14, marginRight: 10 },
});
import { joinGroup } from "@/api/groups.api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    group: GroupOverview;
    onPressInfo: (group: GroupOverview) => void;
    onJoin?: (group: GroupOverview) => void;
};

export const DiscoverGroupItem = React.memo(({ group, onPressInfo, onJoin }: Props) => {
    const { colors } = useTheme();
    const [isJoining, setIsJoining] = useState(false);

    const avatarUrl =
        typeof group.avatar === "string" ? group.avatar : (group.avatar as any)?.url ?? "";

    const handleJoin = async () => {
        if (isJoining) return;
        setIsJoining(true);
        try {
            await joinGroup(group.id);
            onJoin?.(group);
        } catch (err: any) {
            Alert.alert("Error", err?.message || "Failed to join group");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.cardContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
            onPress={() => onPressInfo(group)}
        >
            {/* Avatar clickable separately */}
            <TouchableOpacity onPress={() => onPressInfo(group)} activeOpacity={0.7}>
                <Avatar uri={avatarUrl} size={60} />
            </TouchableOpacity>

            <View style={styles.content}>
                {/* Group Name */}
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                    {group.name}
                </Text>

                {/* Members & Tournaments */}
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                    {group.totalMembers ?? 0} members • {group.activeTournaments ?? 0} active tournaments
                </Text>

                {/* Top 3 Gamers */}
                <View style={styles.topGamers}>
                    {group.topGamers?.slice(0, 3).map((gamer, index) => (
                        <Badge
                            key={gamer.username}
                            label={`${gamer.username}`}
                            type="rank"
                            color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"} // gold, silver, bronze
                            size={18}
                        />
                    ))}
                </View>
            </View>

            {/* Join Button */}
            <TouchableOpacity
                style={[styles.joinBtn, { borderColor: colors.primary }]}
                onPress={handleJoin}
                disabled={isJoining}
                activeOpacity={0.75}
                hitSlop={6}
            >
                {isJoining ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                    <Text style={[styles.joinText, { color: colors.primary }]}>Join</Text>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 16,
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
    content: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        marginTop: 4,
        color: "#666",
    },
    topGamers: {
        flexDirection: "row",
        marginTop: 6,
        gap: 6, // horizontal spacing between badges
    },
    joinBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        minWidth: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    joinText: {
        fontWeight: "700",
        fontSize: 14,
    },
});
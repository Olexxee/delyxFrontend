import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    group: GroupOverview;
    onPressInfo: (group: GroupOverview) => void;
};

export const DiscoverGroupItem = React.memo(({ group, onPressInfo }: Props) => {
    const { colors } = useTheme();

    // Ensure avatar is a string URL
    const avatarUrl = group.avatar ?? "";

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.cardContainer,
                { backgroundColor: colors.surfaceLight, borderColor: colors.border },
            ]}
            onPress={() => onPressInfo(group)}
        >
            <Avatar uri={avatarUrl} size={56} />

            <View style={styles.content}>
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                    {group.name}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                    {group.totalMembers !== undefined
                        ? `${group.totalMembers} members`
                        : "No description"}
                </Text>
            </View>

            <View style={styles.buttonWrapper}>
                <Text style={[styles.joinText, { color: colors.primary }]}>Join</Text>
            </View>
        </TouchableOpacity>
    );
});

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
    name: { fontSize: 16, fontWeight: "600" },
    description: { fontSize: 14, marginTop: 2 },
    buttonWrapper: { paddingHorizontal: 8, paddingVertical: 4 },
    joinText: { fontWeight: "700", fontSize: 14 },
});

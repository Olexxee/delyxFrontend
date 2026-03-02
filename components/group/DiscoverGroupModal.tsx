import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { TopGamersList } from "./TopGamersList";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
    visible: boolean;
    group: any; // ideally GroupOverview with metrics
    onClose: () => void;
    onJoin: (group: any) => void;
};

export function DiscoverGroupModal({ visible, group, onClose, onJoin }: Props) {
    const { colors } = useTheme();

    if (!group) return null;

    return (
        <Modal animationType="slide" visible={visible} transparent>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.surface }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {/* Avatar */}
                        <Avatar uri={group.avatar} size={96} />

                        {/* Name */}
                        <Text style={[styles.name, { color: colors.textPrimary }]}>{group.name}</Text>

                        {/* Stats */}
                        <Text style={[styles.stats, { color: colors.textSecondary }]}>
                            {group.totalMembers ?? 0} members • {group.activeTournamentsCount ?? 0} tournaments
                        </Text>
                        <Text style={[styles.stats, { color: colors.textSecondary }]}>
                            Avg points: {group.avgPoints?.toFixed(1) ?? 0}
                        </Text>

                        {/* Top Gamers */}
                        {group.topGamers?.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                                    Top Gamers
                                </Text>
                                <TopGamersList gamers={group.topGamers} />
                            </>
                        )}

                        {/* Join Button */}
                        <TouchableOpacity
                            style={[styles.joinBtn, { backgroundColor: colors.primary }]}
                            onPress={() => onJoin(group)}
                        >
                            <Text style={[styles.joinText, { color: "#fff" }]}>Join Group</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        maxHeight: "80%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    header: { alignItems: "flex-end" },
    closeText: { fontSize: 16, fontWeight: "700" },
    content: { alignItems: "center", paddingVertical: 16 },
    name: { fontSize: 20, fontWeight: "700", marginTop: 12 },
    stats: { fontSize: 14, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8 },
    joinBtn: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    joinText: { fontSize: 16, fontWeight: "700" },
});
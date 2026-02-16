import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Member = { _id: string; name: string; avatar?: { url: string } | string };

type Props = {
    visible: boolean;
    group: any;
    onClose: () => void;
    onJoin: (group: any) => void;
    isJoining?: boolean;
};

export const GroupInfoModal: React.FC<Props> = ({ visible, group, onClose, onJoin, isJoining }) => {
    const { colors } = useTheme();

    if (!group) return null;

    const renderMember = ({ item }: { item: Member }) => {
        const avatarUrl = typeof item.avatar === "string" ? item.avatar : item.avatar?.url ?? "";

        return (
            <View style={styles.memberContainer}>
                <Avatar uri={avatarUrl} size={36} />
                <Text style={[styles.memberName, { color: colors.textSecondary }]} numberOfLines={1}>
                    {item.name}
                </Text>
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: colors.surfaceLight }]}>
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{group.name}</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {group.description || "No description available."}
                        </Text>

                        <Text style={[styles.membersTitle, { color: colors.textPrimary }]}>
                            Members ({group.members?.length ?? 0})
                        </Text>

                        <FlatList
                            data={group.members || []}
                            renderItem={renderMember}
                            keyExtractor={(item) => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 8 }}
                        />
                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={{ color: colors.textPrimary }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onJoin(group)}
                            style={[styles.joinButton, { backgroundColor: colors.primary }]}
                            disabled={isJoining}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>
                                {isJoining ? "Joining..." : "Join"}
                            </Text>
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
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "90%",
        maxHeight: "80%",
        borderRadius: 16,
        overflow: "hidden",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        marginBottom: 12,
    },
    membersTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    memberContainer: {
        alignItems: "center",
        marginRight: 12,
    },
    memberName: {
        fontSize: 12,
        marginTop: 4,
        maxWidth: 60,
        textAlign: "center",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 16,
    },
    cancelButton: {
        marginRight: 12,
    },
    joinButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
});

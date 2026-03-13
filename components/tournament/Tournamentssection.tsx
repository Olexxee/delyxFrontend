import { SectionCard, SectionHeader } from "@/components/ui/groupInfoUi";
import { useTheme } from "@/theme/ThemeProvider";
import type { Tournament } from "@/types/tournament";
import { PlusCircle, Trophy } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TournamentRow } from "./Tournamentrow";
import { CreateTournamentSheet } from "./CreateTournamentSheet";
import type { ApiTournament } from "@/types/tournament";

// ─── Section (preview) ────────────────────────────────────────────────────

interface TournamentsSectionProps {
    tournaments: Tournament[];
    isAdmin: boolean;
    groupId: string;
    onViewAll: () => void;
    onSelectTournament: (t: Tournament) => void;
    onTournamentCreated: (t: ApiTournament) => void;
}

export function TournamentsSection({
    tournaments,
    isAdmin,
    groupId,
    onViewAll,
    onSelectTournament,
    onTournamentCreated,
}: TournamentsSectionProps) {
    const { colors } = useTheme();
    const [createVisible, setCreateVisible] = useState(false);

    return (
        <SectionCard colors={colors}>
            <SectionHeader
                title="Tournaments"
                icon={<Trophy size={16} color={colors.accent} />}
                actionLabel="View All"
                onAction={onViewAll}
                colors={colors}
            />

            {tournaments.length === 0 && (
                <Text style={[styles.empty, { color: colors.textSecondary }]}>
                    No tournaments yet.
                </Text>
            )}

            {/* Preview: first 3 tournaments as full cards */}
            {tournaments.slice(0, 3).map((t) => (
                <TournamentRow
                    key={t.id}
                    tournament={t}
                    isAdmin={isAdmin}
                    expanded={false}
                    onPress={() => onSelectTournament(t)}
                />
            ))}

            {isAdmin && (
                <TouchableOpacity
                    style={[
                        styles.createBtn,
                        {
                            borderColor: colors.accent,
                            backgroundColor: colors.accent + "10",
                        },
                    ]}
                    onPress={() => setCreateVisible(true)}
                    activeOpacity={0.8}
                >
                    <PlusCircle size={15} color={colors.accent} />
                    <Text style={[styles.createBtnText, { color: colors.accent }]}>
                        Create New Tournament
                    </Text>
                </TouchableOpacity>
            )}

            <CreateTournamentSheet
                visible={createVisible}
                groupId={groupId}
                onClose={() => setCreateVisible(false)}
                onCreated={(t) => {
                    setCreateVisible(false);
                    onTournamentCreated(t);
                }}
            />
        </SectionCard>
    );
}

// ─── Modal (full list) ────────────────────────────────────────────────────

interface TournamentsModalProps {
    visible: boolean;
    tournaments: Tournament[];
    isAdmin: boolean;
    colors: ReturnType<typeof useTheme>["colors"];
    onClose: () => void;
    onSelectTournament: (t: Tournament) => void;
}

export function TournamentsModal({
    visible,
    tournaments,
    isAdmin,
    colors,
    onClose,
    onSelectTournament,
}: TournamentsModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
                {/* Modal header */}
                <View
                    style={[
                        styles.modalHeader,
                        { borderBottomColor: colors.border, backgroundColor: colors.surface },
                    ]}
                >
                    <View style={styles.modalTitleRow}>
                        <Trophy size={18} color={colors.accent} />
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                            Tournaments
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.doneBtn, { backgroundColor: colors.surfaceLight }]}
                    >
                        <Text style={[styles.doneBtnText, { color: colors.accent }]}>Done</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={tournaments}
                    keyExtractor={(t) => t.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Trophy size={40} color={colors.border} strokeWidth={1.5} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No tournaments yet.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TournamentRow
                            tournament={item}
                            isAdmin={isAdmin}
                            expanded
                            onPress={() => onSelectTournament(item)}
                        />
                    )}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    empty: {
        fontSize: 13,
        textAlign: "center",
        paddingVertical: 12,
    },
    createBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        justifyContent: "center",
        marginTop: 4,
    },
    createBtnText: {
        fontSize: 14,
        fontWeight: "600",
    },

    // Modal
    modal: { flex: 1 },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "700",
    },
    doneBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    doneBtnText: {
        fontSize: 15,
        fontWeight: "600",
    },
    list: {
        padding: 16,
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        textAlign: "center",
    },
});
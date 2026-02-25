import React from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlusCircle, Trophy } from "lucide-react-native";
import { SectionCard, SectionHeader } from "@/components/ui/groupInfoUi";
import { TournamentRow } from "./Tournamentrow";
import type { Tournament, ThemeColors } from "@/types/group";

/* ─── Section (preview) ─── */
interface TournamentsSectionProps {
    tournaments: Tournament[];
    isAdmin: boolean;
    colors: ThemeColors;
    onViewAll: () => void;
}

export function TournamentsSection({
    tournaments,
    isAdmin,
    colors,
    onViewAll,
}: TournamentsSectionProps) {
    return (
        <SectionCard colors={colors}>
            <SectionHeader
                title="Tournaments"
                icon={<Trophy size={16} color={colors.accent} />}
                actionLabel="View All"
                onAction={onViewAll}
                colors={colors}
            />

            {tournaments.slice(0, 3).map((t) => (
                <TournamentRow key={t.id} tournament={t} isAdmin={isAdmin} colors={colors} />
            ))}

            {isAdmin && (
                <TouchableOpacity
                    style={[styles.createBtn, { borderColor: colors.accent }]}
                    onPress={() => Alert.alert("Create Tournament")}
                >
                    <PlusCircle size={15} color={colors.accent} />
                    <Text style={[styles.createBtnText, { color: colors.accent }]}>
                        Create New Tournament
                    </Text>
                </TouchableOpacity>
            )}
        </SectionCard>
    );
}

/* ─── Modal (full list) ─── */
interface TournamentsModalProps {
    visible: boolean;
    tournaments: Tournament[];
    isAdmin: boolean;
    colors: ThemeColors;
    onClose: () => void;
}

export function TournamentsModal({
    visible,
    tournaments,
    isAdmin,
    colors,
    onClose,
}: TournamentsModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[styles.modal, { backgroundColor: colors.background ?? colors.surface }]}
            >
                {/* Header */}
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Tournaments</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.doneBtn, { color: colors.accent }]}>Done</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={tournaments}
                    keyExtractor={(t) => t.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TournamentRow
                            tournament={item}
                            isAdmin={isAdmin}
                            colors={colors}
                            expanded
                        />
                    )}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    createBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        justifyContent: "center",
        marginTop: 10,
    },
    createBtnText: { fontSize: 14, fontWeight: "600" },
    modal: { flex: 1 },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalTitle: { fontSize: 17, fontWeight: "700" },
    doneBtn: { fontSize: 16, fontWeight: "600" },
    list: { padding: 16 },
});
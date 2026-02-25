import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Calendar, Users, Bookmark } from "lucide-react-native";

// Placeholder tournament data — replace with real API data when tournament module is built
const PLACEHOLDER_TOURNAMENT = {
    name: "Spring Championship 2026",
    status: "Registration Open",
    date: "Feb 28, 2026",
    participants: "156/256",
    prizePool: "$10,000",
};

type TournamentCardProps = {
    tournamentId: string;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function TournamentCard({
    tournamentId,
    onPress,
    style,
}: TournamentCardProps) {
    // TODO: replace with useTournament(tournamentId) hook when available
    const tournament = PLACEHOLDER_TOURNAMENT;

    return (
        <View style={[styles.wrapper, style]}>
            <LinearGradient
                colors={["#2563EB", "#1E40AF", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Header row */}
                <View style={styles.headerRow}>
                    <View style={styles.titleRow}>
                        <Trophy size={18} color="#FCD34D" strokeWidth={2} />
                        <View style={styles.titleBlock}>
                            <Text style={styles.tournamentName}>{tournament.name}</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>{tournament.status}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bookmarkBtn} hitSlop={8}>
                        <Bookmark size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                {/* Meta row */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Calendar size={14} color="rgba(255,255,255,0.75)" strokeWidth={2} />
                        <Text style={styles.metaText}>{tournament.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Users size={14} color="rgba(255,255,255,0.75)" strokeWidth={2} />
                        <Text style={styles.metaText}>{tournament.participants}</Text>
                    </View>
                </View>

                {/* Prize pool */}
                <View style={styles.prizeBlock}>
                    <Text style={styles.prizeLabel}>Prize Pool</Text>
                    <Text style={styles.prizeAmount}>{tournament.prizePool}</Text>
                </View>

                {/* CTA button */}
                <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={onPress}
                    activeOpacity={0.85}
                >
                    <Text style={styles.viewBtnText}>View Tournament</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        flex: 1,
    },
    titleBlock: {
        flex: 1,
        gap: 4,
    },
    tournamentName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 20,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#4ADE80",
    },
    statusText: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 12,
        fontWeight: "500",
    },
    bookmarkBtn: {
        padding: 4,
    },
    metaRow: {
        flexDirection: "row",
        gap: 20,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 13,
        fontWeight: "500",
    },
    prizeBlock: {
        gap: 2,
    },
    prizeLabel: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 11,
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    prizeAmount: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
    },
    viewBtn: {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 4,
    },
    viewBtnText: {
        color: "#1E40AF",
        fontSize: 14,
        fontWeight: "700",
    },
});
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus } from "@/types/tournament";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TABS: { label: string; value: TournamentStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Registration", value: "registration" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
];

interface TournamentTabsProps {
    activeTab: TournamentStatus | "all";
    tournaments: Array<{ status: string }>;
    onChange: (value: TournamentStatus | "all") => void;
}

export function TournamentTabs({
    activeTab,
    tournaments,
    onChange,
}: TournamentTabsProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.wrapper,
                {
                    borderBottomColor: colors.border,
                    backgroundColor: colors.surface,
                },
            ]}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {TABS.map((tab) => {
                    const active = activeTab === tab.value;

                    const count =
                        tab.value === "all"
                            ? tournaments.length
                            : tournaments.filter((t) => t.status === tab.value).length;

                    return (
                        <TouchableOpacity
                            key={tab.value}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: active
                                        ? colors.surfaceLight
                                        : "transparent",
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => onChange(tab.value)}
                            activeOpacity={0.75}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color: active
                                            ? colors.textPrimary
                                            : colors.textSecondary,
                                        fontWeight: active ? "600" : "500",
                                    },
                                ]}
                            >
                                {tab.label}
                            </Text>

                            {count > 0 && (
                                <View
                                    style={[
                                        styles.badge,
                                        {
                                            backgroundColor: active
                                                ? colors.accent + "22"
                                                : colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            {
                                                color: active
                                                    ? colors.accent
                                                    : colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        zIndex: 10,
        elevation: 2,
    },

    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderWidth: 1,
        gap: 6,
    },

    label: {
        fontSize: 13,
    },

    badge: {
        minWidth: 18,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        alignItems: "center",
    },

    badgeText: {
        fontSize: 10,
        fontWeight: "700",
    },
});
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export const GroupCardSkeleton = () => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.cardContainer,
                {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                },
            ]}
        >
            {/* Avatar Placeholder */}
            <View
                style={[
                    styles.avatar,
                    { backgroundColor: colors.surface },
                ]}
            />

            {/* Text Placeholder */}
            <View style={styles.contentContainer}>
                <View
                    style={[
                        styles.titlePlaceholder,
                        { backgroundColor: colors.surface },
                    ]}
                />
                <View
                    style={[
                        styles.messagePlaceholder,
                        { backgroundColor: colors.surface },
                    ]}
                />
            </View>
        </View>
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
            android: {
                elevation: 2,
            },
        }),
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
    },
    titlePlaceholder: {
        height: 16,
        width: "60%",
        borderRadius: 8,
        marginBottom: 10,
    },
    messagePlaceholder: {
        height: 14,
        width: "80%",
        borderRadius: 8,
    },
});


import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Search } from "lucide-react-native";

type Props = {
    searchQuery: string;
    onSearchChange: (text: string) => void;
};

export const GroupsHeader: React.FC<Props> = ({ searchQuery, onSearchChange }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <Image
                source={{ uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" }}
                style={styles.avatar}
            />
            <Text style={[styles.title, { color: colors.textPrimary }]}>Groups</Text>

            <View style={[styles.searchWrapper, { backgroundColor: colors.surfaceLight }]}>
                <Search size={20} color={colors.textSecondary} />
                <TextInput
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholder="Search groups"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.textPrimary }]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        flex: 1,
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 36,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },
});

import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { Search } from "lucide-react-native";
import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    avatarUri?: string;
};

export const GroupsHeader: React.FC<Props> = ({ searchQuery, onSearchChange, avatarUri }) => {
    const { colors } = useTheme();
    const inputRef = useRef<TextInput>(null);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <Avatar uri={avatarUri} size={36} />

            <Text style={[styles.title, { color: colors.textPrimary }]}>Groups</Text>

            {/* Search takes up remaining space after the title */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                style={[styles.searchWrapper, { backgroundColor: colors.surfaceLight }]}
            >
                <Search size={18} color={colors.textSecondary} />
                <TextInput
                    ref={inputRef}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholder="Search groups"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.textPrimary }]}
                    returnKeyType="search"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        // Fixed width instead of flex:1 so the search bar gets real space
        marginRight: 4,
    },
    searchWrapper: {
        flex: 1,
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
        paddingVertical: 0,
    },
});
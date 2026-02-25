/**
 * group-info/LeaveGroupButton.tsx
 * Destructive leave action — visible to members only.
 */

import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";

export function LeaveGroupButton() {
    const confirmLeave = () => {
        Alert.alert(
            "Leave Group",
            "Are you sure you want to leave this group?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Leave", style: "destructive" },
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.btn} onPress={confirmLeave}>
            <LogOut size={17} color="#ef5350" />
            <Text style={styles.label}>Leave Group</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginHorizontal: 16,
        marginTop: 12,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#ef5350",
    },
    label: { fontSize: 15, fontWeight: "700", color: "#ef5350" },
});
import React from "react";
import { Text, View } from "react-native";

interface Props {
    status: "registration" | "ongoing" | "completed";
}

export default function TournamentStatusBadge({ status }: Props) {
    const statusMap = {
        registration: {
            label: "Registration Open",
            color: "#16a34a",
            bg: "#dcfce7",
        },
        ongoing: {
            label: "Ongoing",
            color: "#2563eb",
            bg: "#dbeafe",
        },
        completed: {
            label: "Completed",
            color: "#6b7280",
            bg: "#f3f4f6",
        },
    };

    const s = statusMap[status];

    return (
        <View
            style={{
                backgroundColor: s.bg,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
            }}
        >
            <Text style={{ color: s.color, fontWeight: "600", fontSize: 12 }}>
                {s.label}
            </Text>
        </View>
    );
}
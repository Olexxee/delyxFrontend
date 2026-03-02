import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { RankBadge } from "../ui/RankBadge";

type Gamer = {
    username: string;
    points: number;
    rank?: "bronze" | "silver" | "gold" | "elite";
};

export function TopGamersList({ gamers }: { gamers: Gamer[] }) {
    return (
        <FlatList
            data={gamers}
            horizontal
            keyExtractor={(item) => item.username}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
                <View style={styles.gamerContainer}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.points}>{item.points} pts</Text>
                    {item.rank && <RankBadge rank={item.rank} />}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    gamerContainer: {
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    username: { fontSize: 14, fontWeight: "600" },
    points: { fontSize: 12, color: "#666" },
});
import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

type Rank = "bronze" | "silver" | "gold" | "elite";

export function RankBadge({ rank }: { rank: Rank }) {
  const { colors } = useTheme();

  const bg = {
    bronze: colors.bronze,
    silver: colors.silver,
    gold: colors.gold,
    elite: colors.primary,
  }[rank];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{rank.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
  },
});

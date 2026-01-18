import { useTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export default function TournamentsScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.textSecondary }}>
        Tournaments coming soon
      </Text>
    </View>
  );
}

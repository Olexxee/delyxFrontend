import { useTheme } from "@/theme/ThemeProvider";
import { Text, View } from "react-native";

export default function GroupScreen() {
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
      <Text style={{ color: colors.textSecondary }}>Groups coming soon</Text>
    </View>
  );
}

import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet, View, ViewStyle } from "react-native";

type FeedCardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function FeedCard({ children, style }: FeedCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
});

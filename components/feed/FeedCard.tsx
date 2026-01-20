import { useTheme } from "@/theme/ThemeProvider";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type FeedCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // <- allow StyleProp
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

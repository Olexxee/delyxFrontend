import { FeedList } from "@/components/feed/FeedList";
import { useTheme } from "@/theme/ThemeProvider";
import { View } from "react-native";

export default function FeedScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FeedList />
    </View>
  );
}

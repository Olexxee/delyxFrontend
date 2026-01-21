import { View } from "react-native";
import { AppScreenHeader } from "@/components/ui/ScreenHeader";
import { FeedList } from "@/components/feed/FeedList";
import { useTheme } from "@/theme/ThemeProvider";

export default function FeedScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppScreenHeader title="Feed" subtitle="Welcome back!" />
      <FeedList />
    </View>
  );
}

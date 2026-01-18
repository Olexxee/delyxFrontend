import { FixtureCard } from "@/components/feed/FixtureCard";
import { LiveMatchCard } from "@/components/feed/LiveMatchCard";
import { ResultCard } from "@/components/feed/ResultCard";
import { ScrollView } from "react-native";

export function FeedList() {
  // For now, we use static cards. Later, this will map over API data.
  return (
    <ScrollView style={{ padding: 12 }}>
      <FixtureCard />
      <LiveMatchCard />
      <ResultCard />
      <FixtureCard />
    </ScrollView>
  );
}

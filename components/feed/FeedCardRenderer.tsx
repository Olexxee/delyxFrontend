import type { FeedItem } from "@/types/feeds";
import React from "react";
import { DiscoverGroupsModule } from "./DiscoverGroupsModule";
import { MatchResultCard } from "./MatchResultCard";
import { PlayerPostCard } from "./PlayerPostCard";
import { TournamentUpdateCard } from "./TournamentUpdateCard";

type Props = {
  item: FeedItem;
};

export function FeedCardRenderer({ item }: Props) {
  switch (item.type) {
    case "match_result":
      return <MatchResultCard item={item} />;

    case "tournament_update":
      return <TournamentUpdateCard item={item} />;

    case "player_post":
      return <PlayerPostCard item={item} />;

    case "discover_groups":
      return <DiscoverGroupsModule item={item} />;

    case "group_activity":
    case "challenge":
    case "milestone":
    case "trending_summary":
      return null;

    default:
      return null;
  }
}

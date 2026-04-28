export type HomeFeedTab = "for-you" | "following" | "discover";

export type FeedItemType =
  | "match_result"
  | "tournament_update"
  | "player_post"
  | "group_activity"
  | "challenge"
  | "milestone"
  | "discover_groups"
  | "trending_summary";

export interface FeedItemBase {
  id: string;
  type: FeedItemType;
  createdAt: string;
}

export interface FeedAction {
  id: string;
  type:
    | "upcoming_match"
    | "registration_deadline"
    | "pending_challenge"
    | "pending_join_requests"
    | "unread_mentions";
  title: string;
  message: string;
  actionLabel: string;
  actionUrl?: string;
  priority: number;
}

export interface FeedActor {
  id: string;
  username: string;
  avatarUrl?: string;
}

export interface FeedGroupRef {
  
  id: string;
  name: string;
  avatarUrl?: string;
  privacy?: "public" | "private" | "protected";
}

export interface FeedTournamentRef {
  id: string;
  name: string;
  status: "registration" | "upcoming" | "ongoing" | "completed";
  type?: "league" | "hybrid" | "group_stage" | "knockout";
  participantCount?: number;
  maxParticipants?: number;
  currentMatchday?: number;
  totalMatchdays?: number;
}

export interface MatchResultFeedItem extends FeedItemBase {
  type: "match_result";
  group?: FeedGroupRef;
  tournament?: FeedTournamentRef;
  homePlayer: FeedActor;
  awayPlayer: FeedActor;
  homeScore: number;
  awayScore: number;
  winnerId?: string;
  statLine?: string;
}

export interface TournamentUpdateFeedItem extends FeedItemBase {
  type: "tournament_update";
  tournament: FeedTournamentRef;
  group?: FeedGroupRef;
  message: string;
  primaryAction?: {
    label: string;
    route?: string;
  };
}

export interface PlayerPostFeedItem extends FeedItemBase {
  type: "player_post";
  author: FeedActor;
  text: string;
  media?: Array<{
    type: "image" | "video";
    url: string;
  }>;
  context?: {
    type: "group" | "tournament" | "match" | "milestone";
    id: string;
    label: string;
  };
  reactionsCount: number;
  commentsCount: number;
  viewerHasReacted?: boolean;
}

export interface GroupActivityFeedItem extends FeedItemBase {
  type: "group_activity";
  group: FeedGroupRef;
  message: string;
  actor?: FeedActor;
}

export interface ChallengeFeedItem extends FeedItemBase {
  type: "challenge";
  challenger: FeedActor;
  opponent?: FeedActor;
  message: string;
  expiresAt?: string;
}

export interface MilestoneFeedItem extends FeedItemBase {
  type: "milestone";
  actor: FeedActor;
  title: string;
  message: string;
}

export interface DiscoverGroupCardVM {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  privacy: "public" | "private" | "protected";
  memberCount: number;
  activeTournamentsCount: number;
  topGamer?: FeedActor;
  reason?: string;
  communityScore?: number;
  isJoined?: boolean;
}

export interface DiscoverGroupsModuleItem extends FeedItemBase {
  type: "discover_groups";
  title: string;
  subtitle?: string;
  groups: DiscoverGroupCardVM[];
}

export interface TrendingSummaryFeedItem extends FeedItemBase {
  type: "trending_summary";
  title: string;
  items: string[];
}

export type FeedItem =
  | MatchResultFeedItem
  | TournamentUpdateFeedItem
  | PlayerPostFeedItem
  | GroupActivityFeedItem
  | ChallengeFeedItem
  | MilestoneFeedItem
  | DiscoverGroupsModuleItem
  | TrendingSummaryFeedItem;

export interface HomeFeedResponse {
  actions: FeedAction[];
  banner: TournamentUpdateFeedItem | null;
  items: FeedItem[];
  nextCursor: string | null;
  meta: { tab: HomeFeedTab };
}
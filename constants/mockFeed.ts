export type FeedItemType = "FIXTURE" | "RESULT" | "LIVE";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  groupName: string;
  tournamentName: string;
  yourAvatar: string;
  opponentAvatar: string;
  yourName: string;
  opponentName: string;
  score?: string; // only for RESULT
  status?: "UPCOMING" | "ACTION_REQUIRED" | "LIVE" | "COMPLETED";
  scheduledAt?: string; // ISO string
  outcome?: "WIN" | "LOSS" | "DRAW";
};

export const mockFeed: FeedItem[] = [
  {
    id: "1",
    type: "FIXTURE",
    groupName: "Elite Gamers",
    tournamentName: "Weekly League",
    yourAvatar: "https://i.pravatar.cc/100?img=10",
    opponentAvatar: "https://i.pravatar.cc/100?img=12",
    yourName: "You",
    opponentName: "RivalPro",
    status: "UPCOMING",
    scheduledAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "RESULT",
    groupName: "Elite Gamers",
    tournamentName: "Weekly League",
    yourAvatar: "https://i.pravatar.cc/100?img=10",
    opponentAvatar: "https://i.pravatar.cc/100?img=14",
    yourName: "You",
    opponentName: "ShadowKick",
    score: "3 : 1",
    status: "COMPLETED",
    outcome: "WIN",
  },
  {
    id: "3",
    type: "LIVE",
    groupName: "Elite Gamers",
    tournamentName: "Qualifier",
    yourAvatar: "https://i.pravatar.cc/100?img=10",
    opponentAvatar: "https://i.pravatar.cc/100?img=13",
    yourName: "You",
    opponentName: "Speedster",
    status: "LIVE",
    scheduledAt: new Date().toISOString(),
  },
  {
    id: "4",
    type: "FIXTURE",
    groupName: "Pro League",
    tournamentName: "Weekly League",
    yourAvatar: "https://i.pravatar.cc/100?img=20",
    opponentAvatar: "https://i.pravatar.cc/100?img=21",
    yourName: "You",
    opponentName: "FastFingers",
    status: "UPCOMING",
    scheduledAt: new Date().toISOString(),
  },
  {
    id: "5",
    type: "RESULT",
    groupName: "Pro League",
    tournamentName: "Weekly League",
    yourAvatar: "https://i.pravatar.cc/100?img=20",
    opponentAvatar: "https://i.pravatar.cc/100?img=22",
    yourName: "You",
    opponentName: "QuickShot",
    score: "2 : 2",
    status: "COMPLETED",
    outcome: "DRAW",
  },
  {
    id: "6",
    type: "LIVE",
    groupName: "Elite Gamers",
    tournamentName: "Qualifier",
    yourAvatar: "https://i.pravatar.cc/100?img=15",
    opponentAvatar: "https://i.pravatar.cc/100?img=16",
    yourName: "You",
    opponentName: "Lightning",
    status: "LIVE",
    scheduledAt: new Date().toISOString(),
  },
];

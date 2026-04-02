import type { Role } from "./group";

export type MemberBadgeType =
  | "admin"
  | "top-performer"
  | "most-active"
  | "new-member"
  | "organizer";

export type MemberBadge = {
  id: string;
  label: string;
  type: MemberBadgeType;
};

export type MemberInsight = {
  member: {
    id: string;
    displayName: string;
    username?: string;
    avatarUrl?: string | null;
    role: Role;
    isOnline?: boolean;
    joinedAt?: string;
  };

  groupStats: {
    messagesSent: number;
    tournamentsJoined: number;
    wins?: number;
    draws?: number;
    losses?: number;
    points?: number;
    contributionScore?: number;
    lastActiveAt?: string;
  };

  generalStats: {
    totalGroups?: number;
    totalTournaments?: number;
    overallWins?: number;
    overallDraws?: number;
    overallLosses?: number;
    overallPoints?: number;
    overallWinRate?: number;
  };

  badges?: MemberBadge[];

  actions: {
    canMessage: boolean;
    canViewProfile: boolean;
    canPromote: boolean;
    canDemote: boolean;
    canRemove: boolean;
  };
};
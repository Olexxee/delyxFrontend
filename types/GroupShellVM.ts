export type GroupShellVM = {
  groupId: string;
  chatRoomId: string | null;

  name: string;
  description: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  privacy: "public" | "private" | "protected";
  memberCount: number;
  myRole: "owner" | "admin" | "member" | null;

  activeTournament: {
    id: string;
    name: string;
    status: string;
  } | null;

  stats: {
    activeTournaments: number;
    totalTournaments: number;
    totalMessages?: number;
    activeMembers7d?: number;
    avgPoints?: number;
  };

  permissions: {
    canEditGroup: boolean;
    canManageMembers: boolean;
    canCreateTournament: boolean;
    canManageRequests: boolean;
    canLeaveGroup: boolean;
    canDeleteGroup: boolean;
  };

  adminSignals?: {
    pendingJoinRequestCount: number;
  };
};
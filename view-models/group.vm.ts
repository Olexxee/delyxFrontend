export type GroupListItemVM = {
  groupId: string;
  chatRoomId: string | null;

  name: string;
  description: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  privacy: string;
  memberCount: number;
  myRole: string | null;

  lastActivityText: string | null;
  lastActivityAt: string | null;
  unreadCount: number;

  activeTournament: {
    id: string;
    name: string;
    status: string;
  } | null;
};

export type GroupShellVM = {
  groupId: string;
  chatRoomId: string;

  name: string;
  description: string | null;
  avatarUrl: string | null;
  fallbackLabel: string;

  privacy: string;
  memberCount: number;
  myRole: string;

  isMuted: boolean;

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
  };

  permissions: {
    canCreateTournament: boolean;
    canManageGroup: boolean;
    canInviteMembers: boolean;
    canViewRequests: boolean;
  };
};
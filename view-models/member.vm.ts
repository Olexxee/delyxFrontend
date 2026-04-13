export type MemberListItemVM = {
  memberId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  fallbackLabel: string;

  role: string;
  isOnline: boolean;

  badges: Array<{
    id: string;
    label: string;
    type: string;
  }>;

  lastActiveAt: string | null;

  actions: {
    canMessage: boolean;
    canViewProfile: boolean;
    canPromote: boolean;
    canDemote: boolean;
    canRemove: boolean;
  };
};
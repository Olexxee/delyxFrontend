export type ChatHeaderVM = {
  title: string;
  subtitle: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  contextType: "direct" | "group";

  actions: {
    canOpenInfo: boolean;
    canOpenMembers: boolean;
    canOpenTournaments: boolean;
  };
};

export type GroupContextStripVM = {
  visible: boolean;
  tournamentId: string | null;
  tournamentName: string | null;
  tournamentStatus: string | null;
  ctaLabel: string | null;
};
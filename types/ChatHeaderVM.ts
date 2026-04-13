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
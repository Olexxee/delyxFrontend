import type {
  TournamentFixture,
  TournamentParticipant,
  TournamentStandingRow,
} from "@/types/tournament";

export const sortParticipantsForViewer = (
  participants: TournamentParticipant[],
  viewerParticipantId?: string | null
) => {
  if (!viewerParticipantId) return participants;

  return [...participants].sort((a, b) => {
    const aIsViewer = a.id === viewerParticipantId;
    const bIsViewer = b.id === viewerParticipantId;

    if (aIsViewer && !bIsViewer) return -1;
    if (!aIsViewer && bIsViewer) return 1;
    return a.username.localeCompare(b.username);
  });
};

export const isViewerInFixture = (
  fixture: TournamentFixture,
  viewerParticipantId?: string | null
) => {
  if (!viewerParticipantId) return false;

  return (
    fixture.homeParticipant.id === viewerParticipantId ||
    fixture.awayParticipant.id === viewerParticipantId
  );
};

export const groupFixturesByMatchday = (fixtures: TournamentFixture[]) => {
  return fixtures.reduce<Record<number, TournamentFixture[]>>((acc, fixture) => {
    if (!acc[fixture.matchday]) {
      acc[fixture.matchday] = [];
    }
    acc[fixture.matchday].push(fixture);
    return acc;
  }, {});
};

export const sortStandingsForDisplay = (
  standings: TournamentStandingRow[],
  viewerParticipantId?: string | null
) => {
  return [...standings].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;

    const aIsViewer = a.participantId === viewerParticipantId;
    const bIsViewer = b.participantId === viewerParticipantId;

    if (aIsViewer && !bIsViewer) return -1;
    if (!aIsViewer && bIsViewer) return 1;

    return a.participantName.localeCompare(b.participantName);
  });
};

export const formatTournamentDate = (iso?: string) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
import type {
  TournamentDetail,
  TournamentTabKey,
  TournamentType,
} from "@/types/tournament";

export type TournamentUIConfig = {
  defaultTab: TournamentTabKey;
  visibleTabs: TournamentTabKey[];
  showPrimaryAction: boolean;
  showProgress: boolean;
  showWinnerBanner: boolean;
  showViewerRegistrationState: boolean;
};

const supportsStandings = (type: TournamentType) =>
  type === "league" || type === "group_stage" || type === "hybrid";

export const getTournamentUIConfig = (
  tournament: TournamentDetail
): TournamentUIConfig => {
  const hasFixtures = Boolean(tournament.fixtures?.length);
  const isStandingsType = supportsStandings(tournament.type);
  const isRegistered = tournament.viewerContext.isRegistered;

  switch (tournament.status) {
    case "registration":
      return {
        defaultTab: "overview",
        visibleTabs: ["overview", "participants"],
        showPrimaryAction: true,
        showProgress: true,
        showWinnerBanner: false,
        showViewerRegistrationState: isRegistered,
      };

    case "upcoming": {
      const visibleTabs: TournamentTabKey[] = ["overview", "participants"];

      if (hasFixtures) visibleTabs.push("fixtures");

      return {
        defaultTab: "overview",
        visibleTabs,
        showPrimaryAction: false,
        showProgress: true,
        showWinnerBanner: false,
        showViewerRegistrationState: isRegistered,
      };
    }

    case "ongoing": {
      const visibleTabs: TournamentTabKey[] = ["overview", "participants"];

      if (hasFixtures) visibleTabs.push("fixtures");
      if (isStandingsType) visibleTabs.push("standings");

      return {
        defaultTab: hasFixtures ? "fixtures" : "overview",
        visibleTabs,
        showPrimaryAction: false,
        showProgress: true,
        showWinnerBanner: false,
        showViewerRegistrationState: isRegistered,
      };
    }

    case "completed": {
      const visibleTabs: TournamentTabKey[] = ["overview", "participants"];

      if (hasFixtures) visibleTabs.push("fixtures");
      if (isStandingsType) visibleTabs.push("standings");
      visibleTabs.push("results");

      return {
        defaultTab: isStandingsType ? "standings" : "results",
        visibleTabs,
        showPrimaryAction: false,
        showProgress: false,
        showWinnerBanner: Boolean(tournament.outcome?.winner),
        showViewerRegistrationState: isRegistered,
      };
    }

    default: {
      const exhaustiveCheck: never = tournament.status;
      return exhaustiveCheck;
    }
  }
};
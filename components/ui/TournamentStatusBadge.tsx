import React from "react";
import { PillBadge, type BadgeVariant } from "./Badge";

type TournamentStatusBadgeProps = {
  status?: string | null;
};

const statusVariants: Record<string, BadgeVariant> = {
  ongoing: "success",
  live: "success",
  in_progress: "success",
  registration: "primary",
  open: "primary",
  upcoming: "warning",
  pending: "warning",
  completed: "neutral",
  finished: "neutral",
  cancelled: "danger",
  canceled: "danger",
  rejected: "danger",
  draft: "neutral",
};

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function formatStatus(status: string): string {
  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  if (!status?.trim()) return null;

  const normalized = normalizeStatus(status);

  return (
    <PillBadge
      label={formatStatus(status)}
      variant={statusVariants[normalized] ?? "neutral"}
    />
  );
}

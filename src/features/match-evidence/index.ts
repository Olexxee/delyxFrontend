export const matchEvidenceFeature = {
  id: "match-evidence",
  backendSupport: "model-only",
  backendModel: "MatchEvidence",
  note: "Evidence rows exist in Prisma, but backend master does not expose upload or read endpoints. Keep evidence upload disabled until the API contract is available.",
} as const;

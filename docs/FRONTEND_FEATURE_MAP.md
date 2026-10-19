# Delyx frontend feature map

This inventory is based on `Olexxee/newDelyx` on `master` (the backend's current default branch), its Express route registration, route modules, and Prisma schema. It intentionally distinguishes **implemented HTTP endpoints** from **domain/data models without a registered HTTP API**. Frontend pages must not be wired until the feature boundaries and API contracts are reviewed.

## Feature modules

| Frontend feature | Backend source / capability | API readiness | Notes |
|---|---|---|---|
| `auth` | `src/modules/auth`; register, login, current user | Exposed | `GET /api/auth/me`, `POST /api/auth/register`, `POST /api/auth/login` |
| `profiles` | `src/modules/users`, `User` model | Partial | User repository/serializer exist, but no user/profile router is mounted |
| `communities` | `src/modules/communities`; discovery, detail, create, join/leave, membership, members, role update, delete | Exposed | Mounted at `/api/community` (singular) |
| `announcements` | `Announcement` model and community relation | Model only | No announcement endpoints/router are mounted on backend master |
| `competitions` | `src/modules/competition`; CRUD and lifecycle | Exposed | Nested at `/api/community/:communityId/competitions`; first-release frontend supports LEAGUE and KNOCKOUT only (SWISS exists in backend schema but is out of launch scope) |
| `registrations` | Competition registration lifecycle and participant model | Partial | Participant endpoints exist; approval/invite semantics are modeled, but verify exact API behavior before wiring |
| `fixtures` | Competition fixture generation and fixture query | Exposed through competition router | Fixture generation is admin-only |
| `matches` | Match/fixture models, result submission and verification | Exposed through competition router | Results are nested under competition. UI must keep pending/unverified results out of standings and stats |
| `match-evidence` | `MatchEvidence` model | Model only | No evidence upload/list endpoint is mounted on backend master |
| `standings` | Competition standing model/calculator and query endpoint | Exposed through competition router | Read-only query; server controls calculated positions |
| `ratings` | Competition rating model/calculator and query endpoint | Exposed through competition router | Read-only query |
| `statistics` | Competition statistic model/calculator and query endpoint | Exposed through competition router | Read-only query |
| `messaging` | `Message` model; frontend also has existing conversation/socket integrations | Backend master incomplete | No chat router is registered in backend `src/app.ts`; do not point new code at assumed endpoints |
| `notifications` | Existing frontend push-token/notification code | Backend contract unverified | Treat as a frontend integration boundary until backend endpoint/event contract is confirmed |
| `admin-review` | Community admin role + competition result verification | Partially exposed | Result verification endpoint exists; separate dispute resolution/rejection workflow is not fully exposed by current route list |

## Rules that apply across features

- Feature modules own endpoint paths, request/response types, API calls, query keys, mutations, and cache invalidation. Screens/components should consume feature hooks and remain presentation-focused.
- Keep the existing Expo Router, Axios/API setup, TanStack Query, auth context, persisted query cache, theme provider, and socket infrastructure; do not replace them with a competing architecture.
- All result submissions are **pending review** until explicitly verified by an authorized community administrator. Only verified results may affect standings, ratings, statistics, or tournament progression.
- Never invent an endpoint because a Prisma model exists. Mark the feature blocked/partial until the backend route is available and its request/response contract is confirmed.
- Do not wire pages during this foundation pass. First complete the module inventory, feature boundaries, API contract gaps, and typed module skeletons; page integration is a later phase.
- Work only in `Olexxee/delyxFrontend` on the dedicated feature-foundation branch. Do not touch `Olexxee/Delyx-social` or modify the backend in this pass.

## Implementation order after the inventory is accepted

1. Shared API/auth boundary and typed response/error conventions.
2. Auth and user/profile.
3. Community discovery, membership, roles, and announcements.
4. Competition setup/lifecycle, participant registration, fixtures.
5. Match submission, evidence, review/verification, disputes.
6. Standings, ratings, statistics.
7. Messaging, notifications, realtime and offline/retry states.
8. UI wiring and visual implementation only after contracts are mapped.

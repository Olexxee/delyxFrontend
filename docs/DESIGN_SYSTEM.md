# Delyx Design System

Status: shared primitive iteration — validate before migrating feature screens.
Target: Delyx mobile app (Expo + React Native), eFootball-first community and tournament platform.

## Product principles

- Competitive, focused, high-energy UI without visual noise.
- Dark mode is the default; light mode remains supported.
- Mobile-first layouts, safe-area aware screens, and keyboard-safe forms.
- One shared token source; avoid one-off hex colors and arbitrary spacing in screen components.
- Status, role, tournament, and match states must use consistent semantic treatments.
- UI primitives remain presentation-only. Keep API calls, tournament rules, and permission logic in feature modules.

## Color tokens

The source of truth currently lives in `theme/color.ts`.

| Token | Dark | Light | Intended use |
|---|---|---|---|
| background | `#090D18` | `#F3F6FB` | App/page background |
| surface | `#111827` | `#FFFFFF` | Cards, sheets, input surfaces |
| surfaceLight | `#1B263B` | `#E7EDF7` | Raised surfaces, chips, subtle fills |
| primary | `#4F7CFF` | `#315FE8` | Main actions, selected states, links |
| accent | `#C7F464` | `#416D0B` | Competitive highlight; use sparingly |
| danger/error | `#FF5D73` | `#D92D4B` | Destructive actions and errors |
| warning | `#FFBF5F` | `#9A5B00` | Warnings and pending attention |
| textPrimary | `#F8FAFC` | `#101827` | Primary content |
| textSecondary | `#9AA8BE` | `#58677F` | Supporting content |
| border | `#253148` | `#D8E0ED` | Standard separators and outlines |
| borderLight | `#3A4964` | `#B5C2D6` | Stronger outline / selected edge |
| status | `#7C8AA5` | `#53627A` | Neutral state |
| gold/medal | `#F6C85F` | `#A87800` | Rankings and achievement only |

### Color rules

1. Use semantic tokens from `useTheme()`; avoid hardcoded colors inside shared components except contrast-safe foregrounds.
2. Primary blue is the main interactive color. Acid lime is an accent, not a second primary.
3. Do not rely on color alone to communicate match or moderation status; pair color with a label/icon.
4. Verify text contrast for every foreground/background pairing, including disabled, placeholder, and badge states.
5. Gradients are optional decoration, not a separate brand palette. If used, derive stops from approved tokens.

## Spacing and shape

Source of truth: `theme/spacing.ts`, `theme/radius.ts`, and `theme/shapes.tsx`.

- Spacing scale: xs 4, sm 8, md 12, lg 16, xl 24, xxl 32.
- Radius scale: sm 6, md 10, lg 16, xl 24, full 999.
- Use the scale rather than introducing arbitrary values unless a platform constraint requires it.
- Keep touch targets at least 44 × 44 points where practical.
- Cards and sheets should use consistent inner padding and spacing; avoid nesting multiple heavy borders.

## Typography

Source of truth: `theme/typography.ts`.

| Style | Size | Line height | Weight |
|---|---:|---:|---:|
| h1 | 28 | 34 | 700 |
| h2 | 22 | 28 | 600 |
| body | 16 | 22 | 400 |
| caption | 12 | — | 400 |

Use a clear hierarchy, short line lengths, and readable contrast. Extend this scale with named styles only when a recurring need appears; do not create per-screen typography scales.

## Shared component inventory

All shared primitives live in `components/ui` and are exported from `components/ui/index.ts`.

- `AppButton`: primary, secondary, ghost, and danger actions; loading/disabled states.
- `AppInput`: themed text and secure input field.
- `AppCard`: default, raised, and outlined surfaces with token-based spacing/radius.
- `StatePanel`: consistent loading, error/retry, and empty states for feature lists.
- `Avatar`: image or initials fallback with shared shape tokens.
- `PillBadge`: neutral, primary, success, warning, danger, and accent semantic variants; custom colors remain supported.
- `RankBadge`: rank accent, readable text, and accessible rank label.
- `RoleBadge`: canonical community role.
- `TournamentStatusBadge`: normalized lifecycle status mapping with a neutral fallback for unknown states.
- `UnreadBadge`: unread message count.
- `HeaderAvatar`, `HeaderTitle`: reusable header elements.
- `StatePanel`: shared loading, retryable error, and empty states.

Feature-specific components stay in `components/chat`, `components/feed`, `components/tournament`, and other feature folders. Promote a component into the shared library only when its behavior and API are genuinely reusable.

## Component contracts

- Prefer typed props, explicit variants, and predictable defaults.
- Shared components read color tokens from `useTheme()`.
- Shared primitives do not fetch data or encode business rules.
- Buttons expose disabled/loading states and must not fire while disabled or loading.
- Inputs preserve native React Native accessibility and keyboard props.
- Badges have a text label; status meaning must not depend on color alone.
- Avatars need a stable initials fallback and must clip images correctly.
- Use `StyleSheet.create` for stable styles; keep dynamic values limited to theme and props.
- Avoid emoji as the only iconography for core actions; use the app's icon library consistently.

## Accessibility and responsive behavior

- Provide accessible labels for icon-only controls.
- Maintain readable contrast in both themes and all states.
- Support font scaling; avoid fixed heights around text that may wrap.
- Use safe-area insets and keyboard-aware layout for forms and chat.
- Provide visible focus/pressed/selected states.
- Respect reduced motion when adding transitions.

## Remaining work

The merged foundation has theme-driven `AppButton` and `AppInput`. This iteration adds `AppCard`, semantic badge variants, stronger rank-badge contrast, normalized tournament-status mapping, a reusable community card, and shared loading/error/empty states. Community discovery, tournament lists, chat/group panes, and group member lists now consume shared components. Chat headers use accessible icon controls and chat search respects theme tokens. Cloud CI still needs to confirm lint and type-check results; continue migrating screens incrementally rather than bulk-rewriting them.

## Workflow

1. Agree token changes here and in `theme/*`.
2. Update shared primitives first.
3. Verify both themes, loading/disabled/error states, and small screens.
4. Migrate feature screens incrementally.
5. Run Expo lint and app smoke tests in cloud CI or a compatible environment.
6. Keep changes on a feature branch; do not merge into `master` without explicit approval.

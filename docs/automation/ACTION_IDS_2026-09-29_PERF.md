# ACTION_IDs — 2026-09-29 Performance Auditor

Implemented this increment: PERF-2026-09-29-133.
Reported only: PERF-2026-09-29-134 through 136.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132.

`webfontActivity.ts` is a new file. `src/frontend/index.html` is disjoint from
open perf PRs #350 / #392 / #412 / #429 / #447 / #511 / #594 / #643 / #687 / #745.

Did **not** wire ChatPanel (114) or WorldExploration (120, 124, 125, 128, 129)
or soundEngine (127, 130). Prefer landing already-open SAFE PRs #350, #392/#412,
#429, #447, #511, #594, #643, #687, #745.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 081 | Folded chat still evaluates 500-row JSX | older ChatPanel PRs |
| 114 | Chat poll 5s race timer never cleared | ChatPanel stack |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 102 | Starfield resize rebuild | #511 |
| 108–109 | debug ring overflow; userRole focus | #594 |
| 115 / 118 | App small-screen equality; toaster theme | #643 |
| 121 | landing chessDrift CSS while hidden | #687 |
| 126 | pause class-based infinite HUD CSS while hidden | #745 |
| 127–132 | AudioContext, HP regen React, attack mousemove, volume localStorage, refetchOnReconnect, EffectsManager survivors | #745 report |
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 082, 086–093, 097–101, 103–107, 110–113, 116–117, 119–120, 122–125 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-29-133
TITLE: Drop unused Share Tech Mono and preconnect fonts.googleapis.com
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/index.html; src/frontend/src/engine/webfontActivity.ts
CURRENT_BEHAVIOUR: Landing HTML preconnected only `fonts.gstatic.com` then requested a render-blocking Google Fonts CSS that included Share Tech Mono. `--font-mono` is self-hosted JetBrains Mono (`index.css` @font-face). No component references Share Tech Mono. The CSS host paid a cold TCP/TLS handshake on every session start while Starfield + landing logo already run.
DESIRED_BEHAVIOUR: Preconnect both `fonts.googleapis.com` and `fonts.gstatic.com`. Request only Baloo 2 + Saira (`display=swap`). Keep JetBrains self-hosted. Do not async-load the stylesheet here (FOUT).
EVIDENCE: index.html stylesheet listed `family=Share+Tech+Mono`; ripgrep finds no Share Tech usage under `src/frontend`; `--font-mono` is JetBrains. Distinct from unused-weight trim (134) and from decorative RAF pause.
RECOMMENDED_ACTION: Land the href + preconnect. Weight list stays until 134.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None for players — unused family. Display/body families and swap behaviour unchanged.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/webfontActivity.test.ts`; landing and character-select still use Baloo/Saira; DevTools no Share Tech Mono request; fonts.googleapis.com is preconnected.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-29-134
TITLE: Google Fonts still lists unused Baloo/Saira weights in the blocking stylesheet
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/index.html; src/frontend/src/index.css (`--font-display` / `--font-body`)
CURRENT_BEHAVIOUR: After 133 the CSS still asks for Baloo 2 400–800 and Saira 300–700. Carved-stone chrome uses display 700/800 and body 400–700. No game UI uses `font-light` / weight 300. Extra `@font-face` blocks inflate the render-blocking Google CSS on landing (mobile TTI). Browsers usually skip unused woff2 files, but the CSS parse still happens on the critical path.
DESIRED_BEHAVIOUR: Request only weights that game chrome actually applies (Baloo 700+800, Saira 400/500/600/700), or self-host those woff2 next to JetBrains.
EVIDENCE: index.html weight lists; index.css stone utilities are 700/800; no `font-light` in game components (only unused shadcn). Distinct from 133 (family + preconnect).
RECOMMENDED_ACTION: Visual-approved weight cut or self-host. Do not drop 400/500 if Tailwind `font-normal`/`font-medium` on body text would faux-synthesize.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Missing weights synthesize and look thinner/heavier on HUD labels.
VALIDATION_REQUIRED: Side-by-side landing, character select, battle HUD on desktop and a narrow viewport; no faux-bold.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-29-135
TITLE: Landing bundle eagerly imports GameFlow → WorldExploration
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/App.tsx; src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: App statically imports GameFlow. GameFlow statically imports WorldExploration (~19k lines plus engine, pieceArt, clickTrace, catalogs). Unauthenticated landing therefore parses the world module before Sign In, concurrent with Starfield RAF, logo RAF, chessDrift, and Google Fonts. AdminDashboard is already `lazy()`. Distinct from PERF-041 (BloodParticles count after login) and from 001 (starfield pause in-world).
DESIRED_BEHAVIOUR: `React.lazy` GameFlow (and keep PostBattleRecap with it) after `isAuthenticated`. Landing fallback stays the existing starfield + carved-stone load spinner. Persist/identity paths unchanged.
EVIDENCE: App.tsx `import GameFlow from "./components/GameFlow"`; GameFlow.tsx `import WorldExploration from "./WorldExploration"`; AdminDashboard is `lazy(() => import(...))`. App.tsx is in #643 — do not restack here.
RECOMMENDED_ACTION: Product-approved Suspense fallback. Do not lazy-load Starfield (covers landing). Do not touch RAF timing.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First Play can flash a fallback; identity must not remount GameFlow on every actor refetch; recap overlay import must stay with the game graph.
VALIDATION_REQUIRED: Cold landing network panel: no WorldExploration chunk until login; Play still hydrates Doka/spells; recap after a fight still mounts.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-29-136
TITLE: WorldExploration statically imports the click-trace debug module in production
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~69–73); src/frontend/src/debug/clickTrace.ts
CURRENT_BEHAVIOUR: Call sites gate `recordClickTrace` with `import.meta.env.DEV`, but the module is a static import. Vite therefore ships ~800 lines of geometry/invariant code (and its debugLogger import) in the world chunk that 135 already pulls onto landing. `getGeometryOverlayEnabled` is also a static import and is read each RAF (cheap boolean). Distinct from PERF-077 (prod debug *ring writes*) and PERF-089 (ungated `console.log`).
DESIRED_BEHAVIOUR: DEV-only import or `import.meta.env.DEV && recordClickTrace(...)` via a thin shim so production does not parse clickTrace. Overlay getter can stay (tiny). Do not change click hit-testing.
EVIDENCE: WorldExploration.tsx static import of clickTrace; recordClickOutcome returns immediately when `!import.meta.env.DEV` (~9714) after the module is already linked. WorldExploration is in the oldest-first combat/map stack.
RECOMMENDED_ACTION: Restack after older WX PRs. Prefer `if (import.meta.env.DEV) { await import(...) }` only on click, or a `debug/clickTrace.dev.ts` excluded from prod.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: DEV Export / Clicks sub-view must still see traces. Production clicks must not wait on a debug chunk.
VALIDATION_REQUIRED: Production build source map / chunk list has no clickTrace; DEV click still records; canvas targeting unchanged.
STATUS: NEW

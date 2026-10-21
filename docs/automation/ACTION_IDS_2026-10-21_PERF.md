# ACTION_IDs — 2026-10-21 Performance Auditor

Implemented this increment: PERF-2026-10-21-137.
Reported only: PERF-2026-10-21-138 through 142.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136.

`clickTrace.prod.ts` and `clickTraceBundle.ts` are new. `vite.config.js` is
disjoint from open perf PRs #350 / #392 / #412 / #429 / #447 / #511 / #594 /
#643 / #687 / #745 / #797.

Did **not** restack WorldExploration (136, 089, 120, 128, 129) or ChatPanel
(114, 081, 103) or soundEngine (062, 127, 130) or App.tsx (115, 135). Prefer
landing already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594, #643,
#687, #745, #797.

Draft ledgers that duplicated 082/115/063/062/067/079/090/119 were discarded.

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
| 133 | unused Share Tech Mono + fonts preconnect | #797 |
| 127–132 | AudioContext, HP regen React, attack mousemove, volume localStorage, refetchOnReconnect, EffectsManager survivors | #745 report |
| 134–136 | unused font weights; eager GameFlow; WX clickTrace static import | #797 report |
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 082, 086–093, 097–101, 103–107, 110–113, 116–117, 119–120, 122–125 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-10-21-137
TITLE: Production Vite build still parses the click-trace recorder
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/vite.config.js; src/frontend/src/debug/clickTrace.prod.ts; src/frontend/src/engine/clickTraceBundle.ts; src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: `clickTrace.ts` is documented as never shipping to players. Call sites gate `recordClickTrace` with `import.meta.env.DEV`, but WorldExploration and ChatPanel static-import the module, so the production world chunk still parses ~800 lines of geometry/invariant code (and ChatPanel's Debug Clicks getter). Distinct from PERF-136 (change the WX import, blocked by the combat/map stack).
DESIRED_BEHAVIOUR: Production `vite build` aliases `debug/clickTrace` to a tiny stub. Dev server and node tests keep the real recorder. Export .txt still works; click-trace tables stay empty in production (they were empty already).
EVIDENCE: WorldExploration.tsx static import; ChatPanel.tsx `getClickTraceBuffer`; `vite.config.js` had no production alias; recordClickOutcome returns immediately when `!DEV` after the module is linked.
RECOMMENDED_ACTION: Keep the production stub plugin. Do not restack WorldExploration. Do not stub `debugExport.ts` (player-facing Debug Export of logs).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Production Debug → Clicks stays empty (same as today). DEV `vite` serve and unit tests must still record. A too-broad `./clickTrace` match could stub a different module (none exists).
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/clickTraceBundle.test.ts`; production `vite build` chunk has no Layer-A/invariant recorder source; `vite` serve still records a DEV click; targeting unchanged.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-21-138
TITLE: Production Vite build leaves JavaScript unminified
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/vite.config.js (`build.minify: false`)
CURRENT_BEHAVIOUR: `vite build` (Caffeine frontend `[build]`) sets `minify: false`. The player download is full identifier names plus the ~19k-line WorldExploration chunk (PERF-135) and ChatPanel. Mobile TTI and parse cost stay high even after 137's stub. Distinct from 135 (split the graph) and from sourcemap (already false).
DESIRED_BEHAVIOUR: Production minify (`esbuild` default) unless Caffeine/IC stack traces require unminified output.
EVIDENCE: vite.config.js `build.minify: false`. No prior PERF ID covered minify.
RECOMMENDED_ACTION: Product/Caffeine call. Do not flip in a perf-only PR if canister error stacks depend on readable names.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Minify can obscure Caffeine/IC exception messages and break code that depends on Function.name.
VALIDATION_REQUIRED: Production bundle size before/after; Play + Admin still boot; a thrown persist error remains diagnosable.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-139
TITLE: Authenticated character select still parses WorldExploration before Play
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx; src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: PERF-135 covers unauthenticated landing (`App` static-imports GameFlow). After Sign In, GameFlow still top-level-imports WorldExploration (~19k lines + pieceArt + DokaGameKeyShop PNG + EnemyRegister) while CharacterSelection mounts Starfield + per-slot BloodParticles (041). Distinct from 135 (landing) and 041 (drip RAF count).
DESIRED_BEHAVIOUR: `React.lazy` WorldExploration until `currentStage === "world"`. Character select keeps Starfield + slot cards. Persist/identity unchanged.
EVIDENCE: GameFlow.tsx `import WorldExploration from "./WorldExploration"`; world branch is `if (isGameMode && selectedCharacter !== null)` after the module already evaluated.
RECOMMENDED_ACTION: Product-approved Suspense fallback on Play. GameFlow is in older persist/UX PRs — restack. Do not lazy Starfield.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First Play can flash a fallback; recap overlay must stay on the game graph; identity refetch must not remount the world.
VALIDATION_REQUIRED: After login, Network panel has no WorldExploration chunk until Play; Play hydrates Doka/spells; recap still mounts.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-140
TITLE: ChatPanel statically imports debugExport into the world chunk
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx; src/frontend/src/debug/debugExport.ts
CURRENT_BEHAVIOUR: ChatPanel always imports `buildDebugReportHtml` / `buildDebugReportText` (~700 lines of HTML/text assembly). That module is only needed when the player clicks Export. Distinct from 137 (clickTrace stub) and from 003 (React mirror of the log ring).
DESIRED_BEHAVIOUR: Dynamic `import()` on Export click. Debug tab list still uses `getDebugLogBuffer`. Do not stub debugExport in production (bug-report Export is player-facing).
EVIDENCE: ChatPanel.tsx static import of debugExport; Export handlers call `buildDebugReportText` / `buildDebugReportHtml`.
RECOMMENDED_ACTION: Restack after older ChatPanel PRs (#350 / #392 / #447). Keep blob URL revoke (073).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First Export pays a chunk fetch; PDF/print path must still see the same report. ChatPanel is in the oldest-first stack.
VALIDATION_REQUIRED: Folded chat does not fetch debugExport; Export .txt and print still include logs after a battle.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-141
TITLE: Every combatant HP write drops the spell-range cache
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/combatantStore.ts (`onMutation`); src/frontend/src/components/WorldExploration.tsx (~1658–1661)
CURRENT_BEHAVIOUR: `initCombatantStore` sets `onMutation` to bump `battleWorldVersion` and `spellRangeCacheRef.current = new Map()`. Lava/DoT/plague `updateCombatant` HP ticks therefore discard the walk/spell tile cache every damage number. Walk-mode RAF then rebuilds MP-reachable tiles (PERF-006) on the next frame. Distinct from 120 (React `enemyHpMap` setState) and from 006 (the cache itself).
DESIRED_BEHAVIOUR: Invalidate spell-range only on position / occupancy / death / spawn / barrier changes — not on HP-only updates. Combat death/victory gates stay store-authoritative.
EVIDENCE: combatantStore comment at ~1653; `updateCombatant` used for lava/DoT HP; onMutation always `new Map()`.
RECOMMENDED_ACTION: Do not land in a perf-only PR. WorldExploration + store are in the oldest-first combat stack. Pair with a targeting fixture so a kill still clears illegal tiles.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale range after a death/summon/knockback if the invalidation set is incomplete.
VALIDATION_REQUIRED: DoT on two enemies while walk highlight is open; kill one; highlight and click targeting match canvas; plague last-hostile still wins.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-142
TITLE: Portal map generation runs up to 100 CA attempts plus per-portal floods on the main thread
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (generateRandomMap ~4689–5120); src/frontend/src/engine/mapGen.ts (`finalizePlayableLayout`, `ensureReachability`, `floodFillReachable`)
CURRENT_BEHAVIOUR: Each portal synchronously retries cellular automata (50, or 100 when fillDensity ≥ 0.4), flood-fills for connectivity, then `finalizePlayableLayout` calls `ensureReachability` per portal. Player-visible hitch on map change. Distinct from 005 (tile draw cache) and from map-integrity PRs that keep the solvability pass (do not skip `finalizePlayableLayout`).
DESIRED_BEHAVIOUR: Keep solvability; reuse one flood; avoid `queue.shift` on larger grids; optional worker. Do not change occupancy/portal rules.
EVIDENCE: WX `maxAttempts = 100` for dense archetypes; mapGen `floodFillReachable` uses `q.shift()`; `finalizePlayableLayout` after generateEnemies is mandatory (AGENTS.md).
RECOMMENDED_ACTION: Human + map fixture. mapGen.ts is in the oldest-first map stack. Do not skip the playable-layout pass.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Skipping a flood or lowering attempts can ship an unsolvable map (portal unreachable).
VALIDATION_REQUIRED: Portal into dungeon, rest-exit, Boss Rush, white sanctuary; maps stay solvable; hitch duration measured.
STATUS: NEW

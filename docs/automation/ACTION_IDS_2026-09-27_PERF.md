# ACTION_IDs — 2026-09-27 Performance Auditor

Implemented this increment: PERF-2026-09-27-121.
Reported only: PERF-2026-09-27-119, 120, 122–125.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118.

`decorativeMotionActivity.ts` is a new file. `LandingPage.tsx` is disjoint from
open perf PRs #350 / #392 / #412 / #429 / #447 / #511 / #594 / #643.

Did **not** wire ChatPanel (114) or WorldExploration (116, 120, 124, 125):
those files are in the oldest-first stack. Prefer landing already-open SAFE
PRs #350, #392/#412, #429, #447, #511, #594, #643.

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
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 082, 086–093, 097–101, 103–107, 110–113, 116–117 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-27-119
TITLE: Modal overlays apply backdrop-filter blur over a still-running world canvas
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/PostBattleRecap.tsx; src/frontend/src/components/BuffShop.tsx; src/frontend/src/components/AchievementsPanel.tsx; src/frontend/src/components/SpellbookModal.tsx; src/frontend/src/components/BossGuideModal.tsx; src/frontend/src/components/GameFlow.tsx (LeaderboardModal)
CURRENT_BEHAVIOUR: Recap, Items, Feats, Spellbook, Boss guide, and Leaderboard each set `backdropFilter: blur(3–4px)` on a full-viewport veil while WorldExploration RAF, the 1 Hz turn timer, and the watchdog keep drawing underneath. Backdrop-filter is a known mobile GPU cost (full-frame readback + blur). Distinct from PERF-110 (Admin stays mounted) and from PERF-117 (toast drop-shadow).
DESIRED_BEHAVIOUR: Solid `rgba(0,0,0,0.75)` veils (already present) without live blur, or pause the canvas only with a product-approved recap/shop freeze. Persist and recap funnel unchanged.
EVIDENCE: PostBattleRecap.tsx ~90; BuffShop.tsx ~292; AchievementsPanel.tsx ~209; SpellbookModal.tsx ~553; BossGuideModal.tsx ~250; GameFlow.tsx LeaderboardModal ~496. App already keeps GameFlow mounted under recap.
RECOMMENDED_ACTION: Visual-approved drop of backdrop-filter. Do not fold into RAF timing. Spellbook/BuffShop/Achievements are in older a11y/shop PRs — restack if implementing.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Frosted-glass mood over the carved-stone HUD changes. Click-outside-to-dismiss must still hit the veil.
VALIDATION_REQUIRED: Open recap, Items, Feats, Spellbook, Board, Bosses on desktop and a narrow viewport; dismiss still works; canvas is not black after close.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-27-120
TITLE: Every enemy HP tick writes enemyHpMap React state and re-renders WorldExploration
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (enemyHpMap)
CURRENT_BEHAVIOUR: Hits, DoT/plague/void ticks, and enemy AI HP writes call `setEnemyHpMap` in addition to `updateCombatant` on the combatant store. The canvas already reads live HP from refs/store; the React map forces the ~19k-line world tree (spell bar, shop hooks, achievements, battle panel) to reconcile on every damage number. Distinct from PERF-013 (walk setState), PERF-007 (1 Hz timer), and PERF-016 (activeEffects lift).
DESIRED_BEHAVIOUR: HP for drawing and last-hostile checks lives on the store/refs. React state only if a DOM HUD island must show enemy HP. Combat death/victory gates stay store-authoritative (Plague Zone comment at ~14644 already warns React-only writes left hostiles alive).
EVIDENCE: `useState<Record<string, number>>({})` ~1682; `setEnemyHpMap` at melee ~3518, plague/void ~14655/14682, and later AI/phase blocks; `render()` does not list enemyHpMap in its deps — the map exists to trip React, not the RAF callback.
RECOMMENDED_ACTION: Do not land in a perf-only PR. WorldExploration is in the oldest-first combat/map stack. Pair with a combat fixture so victory/DoT death still see live HP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Last-hostile, recap, and plague lethal ticks can desync if the store is not the single HP source.
VALIDATION_REQUIRED: Hit, DoT kill, plague last-enemy death, inspect popup HP, and flee-after-last-hostile still match canvas.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-27-121
TITLE: Pause landing chessDrift CSS while the document is hidden
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/decorativeMotionActivity.ts; src/frontend/src/components/LandingPage.tsx
CURRENT_BEHAVIOUR: PERF-058 already stops the logo canvas RAF when hidden. Twelve `chessDrift` CSS transforms (PERF-072) kept running in backgrounded landing tabs. Starfield (001) and logo canvas were already paused; leftover compositor work was the piece drift.
DESIRED_BEHAVIOUR: Set inherited `animation-play-state: paused` on the drift layer while `document.hidden`. Do not remove the pieces (072) or change cube glow (054).
EVIDENCE: LandingPage.tsx FloatingPiece configs set `animationIterationCount: "infinite"`; SkateStyleTitle already uses shouldRunDecorativeCanvasLoop.
RECOMMENDED_ACTION: Keep applyDecorativeCssPlayState. Do not change chessDrift keyframes.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Returning to the tab must resume drift without a stuck frame. Login/II popup must not freeze pieces while the landing document stays visible.
VALIDATION_REQUIRED: node --experimental-strip-types --test src/frontend/src/engine/decorativeMotionActivity.test.ts; landing pieces drift; background the tab; return; pieces still drift; Sign In still works.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-27-122
TITLE: Battle chrome runs Tailwind animate-pulse and an initiative pulse-dot during combat
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/BattleUIPanel.tsx; src/frontend/src/components/InitiativeStrip.tsx
CURRENT_BEHAVIOUR: While `inBattle`, the Battle status pill uses Tailwind `animate-pulse` and the active initiative chip draws an 8px dot with `animation: pulse 1s ease-in-out infinite` plus box-shadow. Distinct from PERF-097 (`.stone-battle-caret` bounce + drop-shadow in index.css).
DESIRED_BEHAVIOUR: Static active styling (scale/opacity already set). Keep the active-turn read. Optional `prefers-reduced-motion`.
EVIDENCE: BattleUIPanel.tsx ~388 and ~902 `className="animate-pulse"`; InitiativeStrip.tsx ~345 pulse animation. BattleUIPanel is not in older open PRs; InitiativeStrip is in #471.
RECOMMENDED_ACTION: Visual-approved. Do not change turn-timer duration (007).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Active-turn affordance is weaker without the pulse. Compact mobile strip must still mark the current unit.
VALIDATION_REQUIRED: Enter battle; current chip and BATTLE pill still read as active; Time Warp 15s unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-27-123
TITLE: Character select still subscribes to callerDokaBalance (staleTime 0)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/hooks/useAdminQueries.ts (useGetCallerDokaBalance); src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: GameFlow always calls `useGetCallerDokaBalance` (staleTime 0, default focus refetch — PERF-009). Character select does not show the Doka chip, but a focus refetch still re-renders GameFlow → CharacterSelection (three BloodParticles RAFs + preview canvases, PERF-041). Distinct from 009 (in-world persist-lock refund) and 095 (profile query).
DESIRED_BEHAVIOUR: Enable the Doka query only on the world stage (first world hydrate still seeds the lock), or `refetchOnWindowFocus: false` (009). Do not change persist-lock math.
EVIDENCE: GameFlow.tsx hooks useGetCallerDokaBalance before the stage split; CharacterSelection mounts BloodParticles per filled slot; useAdminQueries.ts staleTime 0.
RECOMMENDED_ACTION: Product call with 009. GameFlow is in #490 — restack. Do not seed a lobby snapshot over a live world wallet.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First Play must still seed the persist lock from the canister. Alt-tab during select must not become the in-world hydrate path.
VALIDATION_REQUIRED: Character select; alt-tab; Play; HUD Doka matches canister; heal/spend still guarded.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-27-124
TITLE: Overworld wander and combatant list still lift into React because render() closes over enemies
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (render useCallback deps; updateEnemyMovement)
CURRENT_BEHAVIOUR: PERF-014 skips the wander `.map` when nobody is due. When a wanderer is mid-path, setState still re-renders the world tree and rebuilds the large `render()` callback (`enemies` is in that useCallback dep list ~8696). Canvas already has `renderRef` so the RAF loop does not restart, but React still reconciles BattleUIPanel, BuffShop, Achievements, and chat siblings' parent. Distinct from PERF-013 (player walk setState) and from 014 (idle skip).
DESIRED_BEHAVIOUR: `render()` reads `enemiesRef` (same pattern as inBattleRef / hoveredTile). Wander commits React state only when the DOM enemy list must change. Do not change wander intervals or pathfinding.
EVIDENCE: animate() calls updateEnemyMovementRef; render() deps include `enemies` and `playerPosition`; H3 already skips setState when wander output is unchanged.
RECOMMENDED_ACTION: Human + movement fixture. WorldExploration restack required. Do not fold into RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Enemy list HUD, collision, and battle-start destack can miss a step if React lags the ref.
VALIDATION_REQUIRED: Watch wander start/finish; shop freeze; walk into an encounter; enemy count HUD matches canvas.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-27-125
TITLE: Canvas clicked-tile highlight still uses WorldExploration React state
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (clickedTile)
CURRENT_BEHAVIOUR: PERF-002 moved hover to refs so mousemove does not reconcile the world tree. A canvas click still `setClickedTile({ x, y, timestamp })`. `clickedTile` is in the `render()` useCallback deps, so every walk/attack click rebuilds that closure and reconciles the full subtree to flash a diamond the RAF could read from a ref. Distinct from 002 (hover) and 013 (path-step setState).
DESIRED_BEHAVIOUR: Write clicked tile to a ref (timestamp for the existing fade). RAF reads it. Gameplay click handlers stay on the same path.
EVIDENCE: `useState` ~1154; setClickedTile in handleCanvasClick branches ~10556/11140; render() dep `clickedTile` ~8694.
RECOMMENDED_ACTION: Same pattern as 002. WorldExploration restack. Do not change click-to-walk or spell targeting.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Click flash / walk destination diamond can stick or vanish if the ref is not cleared on path end (already cleared ~11262).
VALIDATION_REQUIRED: Click a floor tile and an enemy; highlight matches; hover (002) still does not React-render.
STATUS: NEW

# ACTION_IDs — 2026-09-28 Performance Auditor

Implemented this increment: PERF-2026-09-28-126.
Reported only: PERF-2026-09-28-127 through 132.

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125.

`hiddenTabCssActivity.ts` is a new file. `main.tsx` and `index.css` are disjoint
from open perf PRs #350 / #392 / #412 / #429 / #447 / #511 / #594 / #643 / #687.

Did **not** wire ChatPanel (114) or WorldExploration (120, 124, 125, 128, 129):
those files are in the oldest-first stack. Prefer landing already-open SAFE
PRs #350, #392/#412, #429, #447, #511, #594, #643, #687.

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
| 005–008, 013, 016, 019, 027, 032, 035, 037–041, 054–055, 057, 060, 065–068, 071, 077, 082, 086–093, 097–101, 103–107, 110–113, 116–117, 119–120, 122–125 | Reported earlier | Do not re-file |

---

ACTION_ID: PERF-2026-09-28-126
TITLE: Pause class-based infinite HUD CSS while the document is hidden
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/hiddenTabCssActivity.ts; src/frontend/src/main.tsx; src/frontend/src/index.css
CURRENT_BEHAVIOUR: PERF-058/074 already stop decorative 2D RAF when hidden. Combat still left `.stone-battle-caret`, Tailwind `.animate-pulse` (BATTLE badge, dungeon-chain chip, moving-enemy dots), and `.animate-spin` compositing in backgrounded tabs. Distinct from PERF-121 (inline chessDrift on landing) and from PERF-097/122 (those change visible combat chrome).
DESIRED_BEHAVIOUR: Set `html[data-pbv-hidden="1"]` on visibilitychange and `animation-play-state: paused` only on those infinite classes. One-shot banners (popIn, fadeOut, boss/jackpot) keep running so they can finish off-screen. World RAF, turn timer, and persist unchanged.
EVIDENCE: BattleUIPanel.tsx ~265 `.stone-battle-caret`; WorldExploration.tsx ~17564 dungeon-chain `animate-pulse`, ~18799 BATTLE badge; App.tsx ~468 loading `animate-spin`; index.css ~840 caret keyframes. No prior ACTION_ID paused class-based HUD CSS on hide.
RECOMMENDED_ACTION: Land the hidden-tab CSS helper. Do not use a universal `*` pause (that would freeze one-shot banners mid-flight). Do not restack WorldExploration to convert InitiativeStrip inline `animation: pulse`.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Backgrounded infinite HUD motion stops; it resumes on tab focus. Visible combat feel is unchanged. CSS attribute must stay `data-pbv-hidden`.
VALIDATION_REQUIRED: `node --test src/frontend/src/engine/hiddenTabCssActivity.test.ts`; open a fight, hide the tab, confirm caret/BATTLE badge are paused in computed style; show the tab, motion resumes; recap popIn still plays.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-28-127
TITLE: SoundEngine never suspends AudioContext while the tab is hidden
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/soundEngine.ts
CURRENT_BEHAVIOUR: AudioContext is created on first gesture and stays running for the session. There is no `visibilitychange` → `ctx.suspend()` / `resume()`. Backgrounded mobile Safari still pays the audio render thread even when no SFX play. Distinct from PERF-062 (reuse noise buffer) and from canvas/CSS pause.
DESIRED_BEHAVIOUR: Suspend the context while `document.hidden`; resume on visible. `playEvent` stays a silent no-op until resume. Volume/mute prefs unchanged.
EVIDENCE: soundEngine.ts ~66–102 `wireFirstGesture` / `ensureContext`; no `visibilitychange` listener; `playEvent` ~267 only no-ops when ctx is null, not when suspended.
RECOMMENDED_ACTION: Do not land here — soundEngine.ts is in #350 (062 noise reuse). Restack onto that PR. Pair with a combat SFX after tab-return so the first hit is not clipped.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: First SFX after resume can be silent if `resume()` is still pending. Autoplay policies differ on iOS.
VALIDATION_REQUIRED: Cast in-fight, hide tab (no audio CPU), return, next hit still plays; mute/volume persist.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-28-128
TITLE: Idle HP regen writes characterStats React state every 10s and re-renders WorldExploration
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (HP regen interval)
CURRENT_BEHAVIOUR: A 10s interval calls `setCharacterStats` with a new object whenever HP is below max, even in idle overworld with no combat. That commit reconciles the ~19k-line world tree (spell bar, always-mounted shop/feats/challenge/battle panel, stats HUD). Canvas HP already lives on refs/store. Distinct from PERF-007 (1 Hz turn timer) and PERF-120 (enemyHpMap).
DESIRED_BEHAVIOUR: Keep regen math; only lift HP into React when a DOM HUD island must show it, or isolate the HP chip so the world tree does not reconcile. Combat gates stay store-authoritative.
EVIDENCE: WorldExploration.tsx ~3617–3627 `setInterval` 10000; skips only `inBattleRef` and `prev.hp >= maxHp`; otherwise `{ ...prev, hp: prev.hp + 1 }`.
RECOMMENDED_ACTION: Do not land in a perf-only PR. WorldExploration is in the oldest-first combat/map stack. Pair with an overworld HUD fixture so the HP chip still ticks.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HUD HP, death gates, and saveBattleStats snapshots can desync if refs and React HP diverge.
VALIDATION_REQUIRED: Idle below-max HP ticks the chip; regen pauses in battle; max HP does not rerender; persist still writes current HP.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-28-129
TITLE: Attack-mode canvas mousemove scans live combatants on every pointer event
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (handleCanvasMouseMove)
CURRENT_BEHAVIOUR: Hover tile is deduped on the ref, but `getLiveCombatants(...).find` still runs on every mousemove while `inBattle && battleActionMode === "attack" && selectedSpellId`. That is a full live-list scan per pointer event on the targeting path (input latency on mobile). Distinct from PERF-013 (walk setState) and PERF-125 (clickedTile React).
DESIRED_BEHAVIOUR: Scan occupants only when the hovered tile actually changes (inside the existing prev.x/prev.y guard), or keep last occupant id on a ref. Targeting/LoS unchanged.
EVIDENCE: WorldExploration.tsx ~10661–10693; tile-change guard ~10675–10677 does not wrap the `getLiveCombatants` block at ~10683.
RECOMMENDED_ACTION: Do not land here — WorldExploration is in the oldest-first stack. Tiny, testable once restacked: hover a filled tile, wiggle the mouse inside it, occupant id stays stable without extra scans.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Spell hover highlight / inspect could lag one tile if the guard is too aggressive across attack↔walk mode flips.
VALIDATION_REQUIRED: Attack targeting hover, walk hover, summon-control hover; no extra React renders (handler is already ref-only).
STATUS: NEW

---

ACTION_ID: PERF-2026-09-28-130
TITLE: Volume slider writes localStorage on every input event
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/soundEngine.ts; src/frontend/src/components/SettingsPanel.tsx
CURRENT_BEHAVIOUR: Settings range `onChange` calls `soundEngine.setVolume`, which synchronously `localStorage.setItem` on every tick. GainNode updates should stay live; the persist is the main-thread hitch during drag. Distinct from PERF-062 (buffer reuse).
DESIRED_BEHAVIOUR: Apply gain immediately; debounce or flush persist on pointerup / 100–200ms. Mute toggle can stay synchronous.
EVIDENCE: SettingsPanel.tsx ~18–21 `handleVolume`; soundEngine.ts ~105–111 `setVolume` → `savePref`.
RECOMMENDED_ACTION: Do not land here — soundEngine.ts is in #350; SettingsPanel.tsx is in #642. Restack; keep audible volume live while dragging.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Killing the tab mid-drag could lose the last few slider ticks (acceptable if flush on `pagehide`).
VALIDATION_REQUIRED: Drag volume, hear live change, reload keeps last committed value; mute still instant.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-28-131
TITLE: QueryClient still uses default refetchOnReconnect for every query
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/main.tsx (`new QueryClient()`); src/frontend/src/hooks/useAdminQueries.ts (`useGetCallerDokaBalance`)
CURRENT_BEHAVIOUR: TanStack Query v5 defaults `refetchOnReconnect: true`. A mobile network flap refetches catalog queries plus `callerDokaBalance` (`staleTime: 0`). GameFlow already warns that an absolute wallet snapshot can restore a pre-heal balance. Distinct from PERF-061 (window focus on catalog) and PERF-070 (global `refetchOnWindowFocus`).
DESIRED_BEHAVIOUR: Default `refetchOnReconnect: false` for catalogs; keep an explicit reconnect policy only where a missed write must heal. Wallet must not overwrite the persist lock.
EVIDENCE: main.tsx `new QueryClient()` with no `defaultOptions`; useGetCallerDokaBalance staleTime 0 ~130; GameFlow.tsx ~75–82 comments on focus refetch restoring spent Doka.
RECOMMENDED_ACTION: Product-approved QueryClient defaults. Do not silently change wallet freshness after airplane mode. Catalog flags can follow #350's focus pattern.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: After a real disconnect, stale catalog/wallet until remount or a dedicated invalidation.
VALIDATION_REQUIRED: Toggle offline/online on character select and in-world; Doka chip must not jump to a pre-spend snapshot; spell catalog still loads on first mount.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-28-132
TITLE: EffectsManager.tick allocates a survivors array every world frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/engine/effects.ts
CURRENT_BEHAVIOUR: `tick` builds a new `survivors: Effect[]` then assigns `activeEffects` every RAF while the world canvas is mounted, even with zero live juice. Cap is 100. Distinct from PERF-079 (per-fragment save/restore) and from the world RAF schedule itself.
DESIRED_BEHAVIOUR: Compact in place or skip allocation when `activeEffects.length === 0` and shake/hit-flash are idle. Do not change TTL, hit-stop, or draw order.
EVIDENCE: effects.ts ~99–120 `const survivors: Effect[] = []` inside `tick(dt)`; MAX_LIVE_EFFECTS = 100 at ~76.
RECOMMENDED_ACTION: Report only. Compacting this is RAF-adjacent; do not fold into a timing change. Optional later: early-return when no effects and shake is 0.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: In-place compact bugs can drop a live damage number or keep a finished death fragment.
VALIDATION_REQUIRED: Hit, crit, doka float, death shatter, hit-stop; idle overworld does not grow `activeEffects`.
STATUS: NEW

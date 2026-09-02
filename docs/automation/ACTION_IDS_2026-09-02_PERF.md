# ACTION_IDs — 2026-09-02 Performance Auditor (React / subscriptions)

Implemented this run: PERF-2026-09-02-050, 051, 052, 053, 056.
Reported only: PERF-2026-09-02-054, 055, 057.
Already ledgered (do not re-file): PERF-2026-08-31-001..010, PERF-2026-09-01-011..036.
Reserved by same-day canvas/RAF audit (memory only): PERF-2026-09-02-037..049 — do not reuse.

---

ACTION_ID: PERF-2026-09-02-050
TITLE: Stop playerAchievements staleTime:0 focus refetch from re-rendering WorldExploration
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useAdminQueries.ts (useGetPlayerAchievements); src/frontend/src/components/WorldExploration.tsx (~L2132)
CURRENT_BEHAVIOUR: `useGetPlayerAchievements` used `staleTime: 0` and default `refetchOnWindowFocus`. WorldExploration subscribes to it, so every tab focus hit the canister, logged `[FEATS] LIST` with a mapped claimed[] array, and re-rendered the ~19k-line world tree.
DESIRED_BEHAVIOUR: Reasonable staleTime; no focus refetch while mutations already invalidate the key; DEV-only list logging.
EVIDENCE: useAdminQueries.ts queryKey `["playerAchievements"]` had staleTime 0 + unconditional console.log; WorldExploration.tsx calls useGetPlayerAchievements(). Distinct from PERF-009 (callerDokaBalance).
RECOMMENDED_ACTION: Keep staleTime 30s + refetchOnWindowFocus false + DEV-gated log. Do not weaken unlock/claim invalidate paths.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Achievements unlocked in another tab may lag until invalidate/refetch. Mutations still invalidate.
VALIDATION_REQUIRED: Typecheck; unlock/claim a feat in-session; list updates; alt-tab during exploration does not hitch the canvas.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-02-051
TITLE: Memoize enriched battle turnOrder passed into BattleUIPanel
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (BattleUIPanel turnOrder prop)
CURRENT_BEHAVIOUR: Every WorldExploration render (including the 1 Hz turn timer from PERF-007) allocated `turnOrder.map(...)` with per-combatant spreads and `enemies.find`, forcing BattleUIPanel to rebuild unitStats/effects from new object identities.
DESIRED_BEHAVIOUR: useMemo keyed on turnOrder, AP/MP, character combat stats, enemies, and enraged set.
EVIDENCE: Inline `turnOrder={turnOrder.map(...)}` at the BattleUIPanel mount. Complements PERF-007 (timer island) and PERF-026 (panel-local unitStats memo) without changing combat math.
RECOMMENDED_ACTION: Keep `battleTurnOrderForUi` useMemo. Do not fold combat resolution into the memo.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale AP/MP or enraged flag on the strip if a dep is omitted.
VALIDATION_REQUIRED: Enter battle; spend AP/MP; enrage an enemy; strip HP/AP labels match canvas.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-02-052
TITLE: Memo MapModifiersPanel / SettingsPanel and stabilize modifier list prop
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/MapModifiersPanel.tsx; src/frontend/src/components/SettingsPanel.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Both panels mount for the whole world session. Parent passed `mapModifiers.filter(...)` (new array every render). Timer/HP/doka setStates reconciled Settings (userId-only) and MapModifiers every time.
DESIRED_BEHAVIOUR: `visibleMapModifiers` useMemo + `React.memo` on both panels. Incremental step toward PERF-027 island split.
EVIDENCE: Always-mounted `<MapModifiersPanel>` / `<SettingsPanel userId={userId} />`; neither was memoized.
RECOMMENDED_ACTION: Keep memo wrappers. Pair with stable callbacks before memoizing BattleUIPanel itself (inline onSetWalk still changes each render).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Active-modifier list must still update when modifier types change.
VALIDATION_REQUIRED: Typecheck; open Settings volume; trigger a map modifier; panels still drag/fold.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-02-053
TITLE: Pause BloodParticles canvas work while the document is hidden
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/BloodParticles.tsx; src/frontend/src/components/CharacterSelection.tsx
CURRENT_BEHAVIOUR: CharacterSelection mounts BloodParticles (rAF + save/ellipse/restore up to ~30 particles) under the app Starfield. Hidden tabs still paid particle draw cost whenever the browser delivered rAF.
DESIRED_BEHAVIOUR: Early-return particle simulation/draw when `document.hidden` (rAF may still schedule; no canvas work).
EVIDENCE: BloodParticles.tsx animate loop; CharacterSelection.tsx mounts `<BloodParticles />`. Distinct from Starfield PERF-001/008.
RECOMMENDED_ACTION: Keep the hidden guard. Optional follow-up: stop dual RAF entirely on character select (HUMAN).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Returning to the tab must resume drips on the next frame.
VALIDATION_REQUIRED: Character select animates; background the tab; return; particles resume; no leaked rAF after leaving select.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-02-054
TITLE: Replace LandingPage logo per-cube canvas shadowBlur
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (animated logo canvas)
CURRENT_BEHAVIOUR: Landing logo rAF sets `ctx.shadowBlur = cube.size * 1.5` for bright cubes every frame while Starfield also runs. Same class of cost as PERF-008 but a second surface.
DESIRED_BEHAVIOUR: Cheap glow (second low-alpha fill) or sprite; keep brand look.
EVIDENCE: LandingPage.tsx logo animate loop shadowBlur per cube.
RECOMMENDED_ACTION: Visual-approved substitute. Do not change Starfield in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Landing brand mood lighting changes.
VALIDATION_REQUIRED: Side-by-side landing screenshot on desktop and mobile width.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-02-055
TITLE: Isolate dokaBalance HUD from WorldExploration React tree
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: Live doka uses refs for wallet math, but each `onDokaBalanceChange` updates GameFlow state and passes `dokaBalance` back into WorldExploration. Coin vacuums and shop credits re-render the full world tree to update one HUD chip.
DESIRED_BEHAVIOUR: Doka chip island (or ref-fed subscriber). WorldExploration memo must not see balance churn. Persist lock / applyRewards paths unchanged.
EVIDENCE: GameFlow.tsx `dokaBalance={dokaBalance}` / `onDokaBalanceChange={setDokaBalance}`; WorldExploration credits call onDokaBalanceChange frequently. Overlaps PERF-027 structurally; this is the specific prop churn.
RECOMMENDED_ACTION: Extract DokaChip display. Do not change persist-lock or hydrate guards in a perf-only PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HUD can desync from persist lock if the island reads a stale snapshot after credit.
VALIDATION_REQUIRED: Pickup coins, heal/shop spend, death penalty, idle hydrate; chip matches canister after settle.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-02-056
TITLE: Derive summon battle-log rows once for unread + Summons channel
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx
CURRENT_BEHAVIOUR: Summon unread effect depended on full `battleLogEntries` and filtered the array; Summons channel filtered again during render (up to 500 lines).
DESIRED_BEHAVIOUR: Single `summonLogEntries` useMemo shared by unread tracking and the channel list.
EVIDENCE: ChatPanel.tsx filtered `e.isSummon === true` in an effect and again in JSX. Distinct from PERF-019 (virtualize full battle log).
RECOMMENDED_ACTION: Keep the shared memo. Virtualize Summons with the battle-log virtualizer when 019 lands.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Unread badge must still increment when folded; Clear log must reset.
VALIDATION_REQUIRED: Summon actions while folded; open Summons tab; unread clears; list matches.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-02-057
TITLE: BuffShop stays mounted (hooks run) while closed during world play
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx; src/frontend/src/components/WorldExploration.tsx
CURRENT_BEHAVIOUR: WorldExploration always mounts BuffShop. Closed state returns `null` after hooks (inventory state, several effects, purchase callbacks). Every world setState still re-executes that hook tree.
DESIRED_BEHAVIOUR: Mount shop body only while open, or memo a shell that skips children when closed without breaking inventory persistence.
EVIDENCE: BuffShop early-return after hooks; WorldExploration always renders `<BuffShop ... isOpen={...} />`.
RECOMMENDED_ACTION: Split BuffShopShell / BuffShopBody. Preserve principal-keyed inventory reload.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Inventory can fail to persist or reload on principal change if effects move.
VALIDATION_REQUIRED: Buy potion, close shop, reopen; stacks persist; battle-only items still gated.
STATUS: NEW

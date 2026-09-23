# ACTION_IDs — 2026-09-23 Performance Auditor

Report-only audit of `WorldExploration.tsx` **React side** (useEffect / useState / subscriptions / timers / listeners / allocations that re-render the ~19k-line tree).

Did **not** change WorldExploration gameplay, RAF schedule, or timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060, 09-21-061..070, 09-22-071..085.

## Already ledgered (skipped this pass)

| ID | Why skipped |
|---|---|
| 007 | 1 Hz `setTurnTimeLeft` still present (~14781) — already filed |
| 010 | 1 Hz RAF watchdog (~13778) — already filed |
| 013 | Walk `setPlayerPosition` / `setCurrentStepIndex` per step (~11233) — already filed |
| 015 | Debug context → GameFlow ref — IMPLEMENTED; residual alloc in WX effect is cheap |
| 016 | `onActiveEffectsChange(activeEffects)` (~1851) — already filed |
| 023 | Summon kit resolution IIFE (~18974) — already filed |
| 027 | Split WorldExplorationInner islands — already REPORT_ONLY |
| 028 | 10s HP regen `setCharacterStats` (~3618) — already filed |
| 051 / 052 | `battleTurnOrderForUi` / `visibleMapModifiers` memo — already implemented |
| 057 / 060 / 065 / 068 | BuffShop / Achievements / Challenge / BattleUIPanel always mount — already filed |
| 061 | Catalog focus refetch — already filed |
| 076 | Floor `${x},${y}` string allocs — canvas path, already filed |
| 083 | Feat unlock/claim `console.log` — ChatPanel/hooks, not WX |

## cleanupMap (~11694) — what it clears vs does NOT

**Clears (via cleanupMap and/or nested cleanupBattle):** portal/respawn/camera/movement timers; dungeon-chain + shrine refs; choke/bottleneck sets; effectsManager; dust/leader/coin **refs**; spell/enemy path caches; mirror/barrier/cooldowns/skippedIds; turn order; active effects; doka loot state; achievement toast; boss/illusion battle state; pending AI timeouts; turn timer interval.

**Does NOT clear (NEW gaps → 090):**

- `markedTilesRef` (1058) — never `.clear()` anywhere in the file
- `modifiableRangeBonusRef` (1733) — never reset on battle/map exit
- `claimedGroundLootIdsRef` (1371) — only replaced on portal success paths (~6790/6799), not in cleanupMap
- `coinParticles` **React state** (1718) — cleanupMap zeros `coinParticlesRef` only (~11760), not `setCoinParticles([])`
- `achievementsShownRef` (2181) — session-scoped by design (small)
- `shopCreditTimersRef` — intentionally excluded from cleanupBattle (comment ~1414)

## Intervals / resize (confirmed still present)

| Site | Period | setState? | Ledger |
|---|---|---|---|
| Turn timer ~14781 | 1 Hz while `inBattle` | `setTurnTimeLeft` | 007 |
| HP regen ~3618 | 10s while not in battle | `setCharacterStats` | 028 |
| Watchdog ~13778 | 1 Hz | no (RAF restart) | 010 |
| isDesktop resize ~878 | every resize event | `setIsDesktop` | **NEW 092** |
| Tile-cache resize ~8870 | every resize | no setState (rebuild cache) | — |
| ResizeObserver ~13945 | debounced 50ms | `setCanvasSize` | — |

---

ACTION_ID: PERF-2026-09-23-086
TITLE: Non-memoized filteredBackendSpells invalidates ownedSpells/activeSpells every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~2356–2393, ~2412–2440, ~2746–2764, ~18838)
CURRENT_BEHAVIOUR: Every render allocates a fresh `OLD_SPELL_NAMES_SET`, filters `backendSpells` into a new `filteredBackendSpells` array, and puts that array in the `ownedSpells` useMemo dep list. `ownedSpells` therefore recomputes on every parent setState (1 Hz turn timer, 10s HP regen, AP/MP, etc.). `activeSpells` depends on `ownedSpells`, so BattleUIPanel receives a new `activeSpells` reference even when the bar did not change.
DESIRED_BEHAVIOUR: Hoist the tombstone Set to module scope; `useMemo` the filter on `backendSpells` identity (or a stable query data ref).
EVIDENCE: `OLD_SPELL_NAMES_SET = new Set([...])` at 2356 inside the component body; `filteredBackendSpells = backendSpells.filter(...)` at 2390; `ownedSpells` deps include `filteredBackendSpells` at 2440; `activeSpells` useMemo at 2746; passed as `activeSpells={activeSpells}` at 18838.
RECOMMENDED_ACTION: Module-level Set + `useMemo(() => backendSpells.filter(...), [backendSpells])`. Do not change ownership rules.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale library if memo keys miss a real catalog update (use the React Query data identity).
VALIDATION_REQUIRED: Equip/swap bar; admin save a spell; owned list updates; 1 Hz timer no longer rebuilds ownedSpells (profiler).
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from 051 (turnOrder memo), 050/061 (query refetch), and 023 (summon kit). Root cause is spell-library identity churn on every WX setState.

---

ACTION_ID: PERF-2026-09-23-087
TITLE: BattleUIPanel canAttackNearest JSX IIFE re-runs LoS/resource planning on every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~18852–18896)
CURRENT_BEHAVIOUR: The `canAttackNearest={... && (() => { planPlayerCastResources; canAttackNearestAgainstLive(...) })()}` expression runs on every parent render — including the 1 Hz turn timer — allocating live combatant lists and doing range/LoS checks even when the player is not pressing Attack Nearest.
DESIRED_BEHAVIOUR: Derive a boolean in a useMemo keyed by battle AP, selected spell id/version, caster pos, and combatant store version; or compute only when Attack Nearest is armed.
EVIDENCE: Inline IIFE at 18862–18896 calls `planPlayerCastResources`, `getLiveCombatants`, `canAttackNearestAgainstLive` with barrier map. Parent re-renders from 007/028/086.
RECOMMENDED_ACTION: Memoize or gate on `battleActionMode === "attack"`. Do not change Attack Nearest hit rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Button enable/disable lagging one frame after AP spend or enemy death if deps are incomplete.
VALIDATION_REQUIRED: Attack Nearest enabled only with a legal target; disables after kill / out of AP; mobile tap latency.
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from 023 (summon kit IIFE), 033 (hover damage every RAF), and 006 (MP walk BFS in canvas).

---

ACTION_ID: PERF-2026-09-23-088
TITLE: spellCooldowns Object.fromEntries allocated on every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~18949–18953); BattleUIPanel consumers
CURRENT_BEHAVIOUR: `spellCooldowns={spellCooldownVersion >= 0 ? Object.fromEntries(spellCooldownsRef.current) : {}}` always takes the true branch (`version` starts at 0 and only increments). Every parent render builds a new plain object from the Map, defeating referential stability for the panel even when cooldowns did not change.
DESIRED_BEHAVIOUR: Build the object only when `spellCooldownVersion` bumps (useMemo), or pass the Map/ref and let the panel read on demand.
EVIDENCE: 18949–18953; `setSpellCooldownVersion` sites (~11633, ~12150, ~14288, ~17203); version compared with `>= 0` is always true.
RECOMMENDED_ACTION: `useMemo(() => Object.fromEntries(...), [spellCooldownVersion])`. Do not change cooldown rules.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale cooldown UI if a site mutates the Map without bumping the version.
VALIDATION_REQUIRED: Cast a cooling spell; icon greyout updates; timer ticks do not allocate a new cooldowns object (profiler).
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from 051 (turnOrder enrich memo) and 026 (unitStats inside BattleUIPanel).

---

ACTION_ID: PERF-2026-09-23-089
TITLE: Ungated production console.log on click, victory-gate, and battle-start spellbar bisect
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~10224, ~10367, ~12070, ~13888, ~4673, ~5099, ~5868, ~6189–6204, ~13730, ~13765)
CURRENT_BEHAVIOUR: Several hot paths call `console.log` with no `NODE_ENV === "development"` gate. Enemy click builds a payload object every cast branch; victory-gate effect logs on every qualifying render; battle-start always logs `[SPELLBAR-BISECT]` (the nearby log at 12046 is correctly gated; 12070 is not). Map-gen and init logs also fire in production.
DESIRED_BEHAVIOUR: DEV-gate or route through `logDebugInfo` (already ring-buffered / Debug-tab gated via PERF-003).
EVIDENCE: Ungated `console.log("[CLICK-ENEMY]", …)` 10224/10367; `console.log("[SPELLBAR-BISECT]", …)` 12070 vs gated block 12046–12054; `console.log("[VICTORY-GATE]", …)` 13888; map/init logs 4673/5099/5868/13730/13765.
RECOMMENDED_ACTION: Wrap in DEV checks or delete bisect logs. Do not change combat branching.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None for gameplay; Debug Export must still capture needed bisect via logDebugInfo if retained.
VALIDATION_REQUIRED: Production build: click enemy / win battle — no console noise; DEV still has optional bisect.
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from 083 (feat unlock/claim logs in hooks) and 077 (debug ring buffer append). These are raw `console.log` in WX hot paths.

---

ACTION_ID: PERF-2026-09-23-090
TITLE: cleanupMap leaves markedTiles, range-bonus, loot-claim Set, and coinParticles state across maps
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (cleanupMap ~11694; refs at 1058, 1371, 1733, 1718)
CURRENT_BEHAVIOUR: Across portal/map transitions, Mark glyphs (`markedTilesRef`), Lens/Overcast-style range bonuses (`modifiableRangeBonusRef`), and one-shot loot claim ids (`claimedGroundLootIdsRef`) can survive. cleanupMap clears `coinParticlesRef` but not `setCoinParticles([])`, so React may keep the previous particle array alive until the next writer.
DESIRED_BEHAVIOUR: Clear those refs in cleanupBattle and/or cleanupMap; sync coin particle React state with the ref clear. Keep shopCreditTimers exclusion.
EVIDENCE: Grep shows no `markedTilesRef.current.clear` / no modifiableRange reset; claimed set only reassigned at portal ~6790/6799; cleanupMap 11760 clears ref only; setCoinParticles([]) only at portal ~6302.
RECOMMENDED_ACTION: Add clears next to mirror/barrier clears in cleanupBattle; `setCoinParticles([])` beside the ref clear in cleanupMap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Clearing claimed ids mid-flight could allow a remint if a portal races an in-flight `applyRewards` (pair with existing one-shot settle rules). Range-bonus clear mid-buff is correct for battle exit but must not run during an active player cast.
VALIDATION_REQUIRED: Mark a tile, portal away, confirm no mark on next map; Lens buff does not survive flee/portal; ground Doka cannot double-claim after cleanupMap; coin VFX gone after portal.
STATUS: NEW
WHY_NOT_DUPLICATE: Prior PERF work cleared mirror/barrier/cooldown/path caches (comments LEAK-8 / M-3) but never filed these four leftovers. Not a canvas/RAF finding.

---

ACTION_ID: PERF-2026-09-23-091
TITLE: Dead cameraVersion setState still re-renders the full world tree on every map transition
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~1125–1131)
CURRENT_BEHAVIOUR: `setCameraOffset` writes `cameraRef` then `setCameraVersion((v) => v + 1)`. The state is bound as `_cameraVersion` and never read. Map transitions therefore force a full WorldExploration reconciler pass for no consumer.
DESIRED_BEHAVIOUR: Drop the version state; camera stays ref-only. Tile-corner cache already rebuilds from canvasSize / tile size deps (~8865).
EVIDENCE: 1125 `const [_cameraVersion, setCameraVersion] = useState(0)`; 1130 `setCameraVersion`; no other reads of `_cameraVersion`.
RECOMMENDED_ACTION: Remove the useState and the bump. Confirm tile cache / hit-test still correct after portal.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: If some hidden consumer relied on the re-render to refresh closures, portal camera could look stale (unlikely — camera is ref-read in RAF).
VALIDATION_REQUIRED: Portal desktop + mobile; tile click targets match; no black frame.
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from M7/O8 camera-ref migration and from 013 (walk setState). This is leftover dead state after the ref migration.

---

ACTION_ID: PERF-2026-09-23-092
TITLE: isDesktop window.resize listener setStates on every resize event without debounce
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~877–882); contrast ResizeObserver debounce ~13978
CURRENT_BEHAVIOUR: `window.addEventListener("resize", () => setIsDesktop(window.innerWidth > 1024))` fires on every browser resize event and can flip/reaffirm React state while the player is resizing or rotating. Canvas sizing already uses a 50ms debounce; this listener does not. Crossing 1024px rebuilds tile layout paths that depend on `isDesktop`.
DESIRED_BEHAVIOUR: Debounce (match ResizeObserver) or only `setIsDesktop` when the boolean actually changes.
EVIDENCE: 878–881 vs debounced `scheduleApplySize` at 13976–13986; `isDesktop` feeds tile-corner cache deps at 8862.
RECOMMENDED_ACTION: `const next = innerWidth > 1024; setIsDesktop(prev => prev === next ? prev : next)` plus optional 50–100ms debounce.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Brief wrong zoom/camera mode if debounce delays the breakpoint cross.
VALIDATION_REQUIRED: Drag window across 1024; rotate mobile; no render storm; desktop static camera still applies.
STATUS: NEW
WHY_NOT_DUPLICATE: Distinct from 011 (DraggablePanel pointer listeners) and from canvas ResizeObserver sizing. Not previously filed for WX.

---

ACTION_ID: PERF-2026-09-23-093
TITLE: normalizedSpellPool maps the full catalog on every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~2688–2701, battle-start kit resolve ~12035+)
CURRENT_BEHAVIOUR: `spellPool.map(s => ({ cooldown:0, aoe:false, …, …s }))` runs on every render, allocating a new SpellConfig-shaped array even though battle-start is the primary consumer.
DESIRED_BEHAVIOUR: `useMemo` on `filteredBackendSpells` / starter fallback (pairs with 086).
EVIDENCE: 2695–2701 unconditional `.map` in component body.
RECOMMENDED_ACTION: Memoize with 086. Do not change kit resolution.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale enemy kits if memo misses catalog updates (same as 086).
VALIDATION_REQUIRED: Start battles in zone 0 and higher; kits still resolve; profiler shows one pool alloc per catalog change.
STATUS: NEW
WHY_NOT_DUPLICATE: Sibling alloc to 086 but separate site; not covered by 051/023.

---

## Summary table

| ID | Issue | Impact | Autonomy |
|---|---|---|---|
| 086 | filteredBackendSpells → ownedSpells churn every setState | CPU / frame pacing / mobile | SAFE_TO_AUTO_IMPLEMENT |
| 087 | canAttackNearest LoS IIFE every render | CPU / input latency / mobile | HUMAN_APPROVAL_REQUIRED |
| 088 | spellCooldowns Object.fromEntries every render | CPU / GC | SAFE_TO_AUTO_IMPLEMENT |
| 089 | Ungated console.log on click/victory/battle-start | CPU / input latency / mobile | SAFE_TO_AUTO_IMPLEMENT |
| 090 | cleanupMap misses mark/range/loot-claim/coin state | Memory / correctness bleed | HUMAN_APPROVAL_REQUIRED |
| 091 | Dead cameraVersion setState on portal | CPU on map transition | SAFE_TO_AUTO_IMPLEMENT |
| 092 | isDesktop resize undebounced setState | CPU on resize / mobile rotate | SAFE_TO_AUTO_IMPLEMENT |
| 093 | normalizedSpellPool map every render | CPU / GC | SAFE_TO_AUTO_IMPLEMENT |

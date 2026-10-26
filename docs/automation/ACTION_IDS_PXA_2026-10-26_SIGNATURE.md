# ACTION_IDs — 2026-10-26 signature slice (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor / Hunt Mark·Swap·Sacrifice (`bc-e286c031-b8c3-5848-a3f3-c19fde037f36`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-26_SIGNATURE.md`](./PX_COHERENCE_AUDIT_2026-10-26_SIGNATURE.md)

IDs start at **004** so a concurrent same-day PX pass can keep `PXA-2026-10-26-001`…`003` (Bomber / dungeon Depth / hard_3 HUD) without colliding.

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide is done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD is done)
- `PXA-2026-09-21-001` … `003` (PR **#343**)
- `PXA-2026-09-22-001` … `003` (PR **#393**)
- `PXA-2026-09-23-001` … `003` (PR **#481**)
- `PXA-2026-09-24-001` … `003` (PR **#529**)
- `PXA-2026-09-25-001` … `003` (PR **#579**)
- `PXA-2026-09-26-001` … `003` (PR **#632**)
- `PXA-2026-09-27-001` … `003` (PR **#691** / Inferno copy **#696**)
- `PXA-2026-09-28-001` … `003` (PR **#744**)
- `PXA-2026-09-29-001` … `003` (PR **#784**)
- `PXA-2026-10-21-001` … `003` (PR **#844**)
- `PXA-2026-10-22-001` … `003` (PR **#907** — Barrier 2 vs 3; `res_sp` / drain; three MP-slow names)
- `PXA-2026-10-23-001` … `003` (PR **#955** — Weaken/`healRecv`; Shield vs Crush; **four reflect rates**). **10-23-003 assumes Mirror arms; 10-26-004 is that Mirror never arms on self-cast.**
- `PXA-2026-10-24-001` … `003` (PR **#1008** — SP inbound; `easy_1` heal copy; Iron Skin/Haste/Enrage **“own”**)
- `PXA-2026-10-25-001` … `003` (PR **#1067** — gifted `hitsMultiple`; Haste +2 unread; turn-limit HUD). **10-25 deferred Mark tile vs `targetType` enemy — filed here as 10-26-005.**
- Concurrent same-day PX ids `PXA-2026-10-26-001`…`003` (Bomber / Depth / hard_3) if that pass lands — do not renumber these signature ids onto 001–003.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-25 audits (`0f5363f`). New IDs are new *reads* of the same bytes (Mirror self-cast never reaches `activateMirror`; Mark card/tile vs enemy gate + empty no-op; Strike FAIL exemption unnamed on the card).

**Do not twin** Barrier 2 vs 3 (10-22-002), four reflect *rates* (10-23-003 — rates pile; this run is dead arming), Iron Skin/Haste/Enrage “own” (10-24-003), Haste +2 / log % / summon budget (10-25-002), gifted `hitsMultiple` (10-25-001), Inferno silent CD (09-27-002), Windstorm miss CD (10-21-002), Expose/Veil/`healAmount` (10-22-001), Weaken/`healRecv` (10-23-001), Shield RES vs Crush (10-23-002), Slow/Weaken player apply (EBMA-004 / #528 / #555), three fire DoT names (10-21-001), three MP-slow names (10-22-003), Timestep vs Time Warp **name** (PXA-012), Poison≡Venom catalog MERGE under PXA-002 (numbers match both cards), hit-log SP vs SR (09-27-003).

---

ACTION_ID: PXA-2026-10-26-004  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Mirror self-cast never reaches activateMirror — the gifted one-shot reflect is a 4-AP no-op on its only legal tile  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Card: “Reflects the next incoming spell back at the attacker” (`src/frontend/src/data/spellData.ts` 198–214: `isMirror: true`, `targetType: "self"`, `range: 0n`, `effectType: "defense"`, `apCost: 4n`). Targeting only allows the caster tile (`targeting.ts` 503–508 `targetType === "self"`). `resolvePlayerCast` arms Mirror **only inside** the damage-loop guard `if (targetEnemy || spell.hitsMultiple)` (`spellEngine.ts` 882–926): `activateMirror()` sits at 918–925. On the legal self tile there is no hostile `targetEnemy` (`spellEngine.ts` 737–747 uses `isActiveHostile`) and Mirror is not `hitsMultiple`, so the branch is skipped and the function falls through to bare `return "cast"` (`spellEngine.ts` 1027–1028) — AP is deducted (`WorldExploration.tsx` 17158–17165) with no `activateMirror` call. `effectType: "defense"` also misses the self-buff hoist (`isShieldSpell` requires `effectType === "buff"`, `spellEngine.ts` 634–636). `playerMirror.ts` 1–7 documents an older tile-key bug that made Mirror a 4-AP no-op; `activatePlayerMirror` now writes `"player"` (`playerMirror.ts` 12–14) and enemy cast correctly consumes that key (`WorldExploration.tsx` 16496–16500) — but the player path never writes it. FAIL still rolls on Mirror (`spellEngine.ts` 641–651: `!isPhysical`). 10-23-003’s “Mirror = 100% next-hit” leg assumes this arming works; without it the gifted signature is dead while Field/Void/Reflect Shield still roll. Barrier/Summon were hoisted out of the same guard (`spellEngine.ts` 817–856); Mirror was not.  
SYSTEMS_AFFECTED: spells (Mirror), visual feedback (no “Mirror active!” log on self-cast), enemies (boss kits that list `spell-mirror` still use other paths), admin (`isMirror` flag), challenges (no direct), terminology (Mirror vs Mirror Field)  
RECOMMENDED_ACTION: REWORK — hoist `isMirror` beside Timestep / Barrier / Summon so self-cast calls `activateMirror` before any hostile gate. Keep Mirror as the one-shot commitment once armed (10-23-003 still merges the other three rates). Do not change Field 20% / Void 25% / Reflect Shield 30% here.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT hoist + unit test: `resolvePlayerCast(spell-mirror, playerTile)` calls `activateMirror` once and returns `"cast"`; enemy single-target then `consumePlayerMirror` reflects. HUMAN_DESIGN_REQUIRED only if Mirror should require an enemy click (then reprint `targetType` / card).  
DEPENDENCIES: PXA-2026-10-23-003 (four rates — this ID is dead arming; do not close 003 until Mirror actually arms). PXA-2026-08-31 signature KEEP (Mirror must stay unique). Does not twin Field flavor announce (09-01-002).  
REGRESSION_RISK: LOW if only hoisting activation (fights get a real 4-AP defense). MEDIUM if FAIL exemption is added without card copy. Do not restack enemy consume or RAF / mapGen.  
VALIDATION_REQUIRED: Select Mirror, click self: battle log “Mirror active!…”, `mirrorUnitsRef` has `"player"`. Next enemy single-target spell reflects and clears the token. Empty / enemy tiles are not required. Field/Void/Reflect Shield rates unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-005  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Mark card says “target tile” but targetType is enemy, placeMark only runs with a hostile on the click, and empty highlighted floors spend AP with no mark  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Deferred from 2026-10-25 (“Mark still writes a tile … while targetType is enemy”) — verified on `0f5363f`. Card: “Mark target tile — next spell on that tile deals x2 damage” (`spellData.ts` 161–177: `isMark: true`, `targetType: "enemy"`, `range: 4n`). `placeMark` writes a **tile key** (`WorldExploration.tsx` 9403–9405: `markedTilesRef.current.add(\`${cell.x},${cell.y}\`)`). ×2 + consume use the **cast click** `gridPos` (`WorldExploration.tsx` 3331–3334, 3390–3393 inside `computeDamage` / `calculatePlayerDamage`). Resolve only enters the Mark branch when `targetEnemy || hitsMultiple` (`spellEngine.ts` 882, 928–936) — Mark is not `hitsMultiple`, so an empty floor never calls `placeMark` and still `return "cast"` (1027–1028) after AP spend. Preview for `targetType: "enemy"` accepts any in-range non-barrier floor (`targeting.ts` 669–687); `decideTileCastClick` then executes highlighted empty tiles (`targeting.ts` 965–986). On a living hostile: Mark **does** place the tile and a later damage spell clicked on that same tile gets ×2 — matching the second half of the card — but the mark is **tile-sticky**, so if the enemy walks off or dies the mark strands on empty floor until another hostile (or `hitsMultiple` click) occupies/uses that cell. Sacrifice shares the empty-floor hazard more harshly: `isSacrifice` runs **before** requiring `targetEnemy` (`spellEngine.ts` 749–763) so an empty adjacent click still `loseSelfHp(floor(hp*0.2))` with no damage. Swap skips without a hostile (`spellEngine.ts` 766–775) then falls through to AP-only cast. 10-25 deferred this as weaker than `hitsMultiple`; it is now a full signature identity fracture.  
SYSTEMS_AFFECTED: spells (Mark, and empty-floor cast for Swap / Sacrifice), targeting (enemy-type empty floors), visual feedback (Mark log only when hostile present), challenges (Sacrifice self-HP on empty still records challenge self-loss via `loseSelfHp` at `WX` 9374–9387)  
RECOMMENDED_ACTION: REWORK to one Mark rule. Recommend: (a) `targetType: "ground"` (or `"all"` floor) + hoist `isMark` like Barrier so empty tiles place marks; **or** (b) reprint card/targetType as “Mark an enemy’s cell” and reject empty execute (`abort` / no AP). Strand rule must be on the card if marks stay tile-keyed after the unit moves. Fix Sacrifice to `abort` without `targetEnemy` (do not self-tax on empty). Do not change ×2 math once a mark is live.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT hoist Mark + empty-tile place **or** empty-tile abort, plus unit tests: Mark on empty either places or aborts (never silent AP); Mark on enemy then Strike on that tile ×2 and consumes; Sacrifice without hostile does not call `loseSelfHp`. HUMAN_DESIGN_REQUIRED to pick tile-trap vs enemy-tag identity.  
DEPENDENCIES: PXA-2026-10-25-001 (AoE/click geometry — orthogonal; Mark is not `hitsMultiple`). PXA-2026-10-22-002 (Barrier ground hoist pattern — sibling). Does not twin Barrier duration.  
REGRESSION_RISK: MEDIUM if Mark becomes true ground (players pre-place traps). LOW if only empty execute aborts. HIGH if ×2 applies to every bounce from a marked click without card copy (document if kept). No mapGen / RAF.  
VALIDATION_REQUIRED: Mark selected: empty in-range floor either gains a mark (and log) **or** rejects with no AP loss. Mark on pawn, Strike same tile: ×2 once, mark gone. Mark on pawn, pawn walks away, Strike new tile: no ×2; Strike old empty tile: matches chosen rule. Sacrifice empty adjacent: no HP loss. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-26-006  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Strike silently skips FAIL while the card only teaches RES vs SP  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Prior KEEP: “Physical Strike skipping FAIL is KEEP **if** FAIL remains the only miss **and** the card says so” (`px-coherence` / 10-25 narrative). Card today: “A direct physical attack. Only RES applies (not SP).” (`spellData.ts` 9–25: `isPhysical: true`). No FAIL / fizzle / accuracy sentence. Engine: FAIL roll is `if (!isPhysical)` (`spellEngine.ts` 641–651) — Strike never fizzles. Sheet still shows FAIL% (`StatPopup` / battle debug `spellFailChance` at `WX` ~3646 / 18560). 09-27-003 is the Strike/log **SP-as-inbound** lie on player→enemy math (RES/SR); this ID is the **unnamed miss exemption**. Windstorm 30% still rolls on Strike after the FAIL skip (`spellEngine.ts` 909–914; CD side-effect stays 10-21-002) — so Strike is not “never misses,” only “never FAIL.”  
SYSTEMS_AFFECTED: spells (Strike), visual feedback (FAIL% sheet vs Strike reliability), terminology (FAIL vs Windstorm), challenges (Striker path uses Strike)  
RECOMMENDED_ACTION: SIMPLIFY — reprint Strike as “Cannot FAIL (Windstorm can still blow it off course)” **or** remove the `!isPhysical` exemption so FAIL is universal. Do not change RES/SP mitigation copy here (09-27-003). Do not change Windstorm rates (09-22-001 / 10-21-002).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT card string + spellbook subtitle. HUMAN_DESIGN_REQUIRED to delete the exemption instead of naming it.  
DEPENDENCIES: PXA-2026-09-22-001 (FAIL×Windstorm stack). PXA-2026-09-27-003 (SP/SR card/log — orthogonal). PXA-2026-10-21-002 (Windstorm miss → Inferno CD). Does not close those.  
REGRESSION_RISK: LOW for copy-only. HIGH if FAIL suddenly applies to Strike (melee reliability drops ~20%).  
VALIDATION_REQUIRED: Spellbook Strike names FAIL skip **or** a FAIL roll can fizzle Strike at L1. Windstorm can still miss Strike. RES-only / no-SP line unchanged in meaning. `pnpm typecheck`.  
STATUS: NEW

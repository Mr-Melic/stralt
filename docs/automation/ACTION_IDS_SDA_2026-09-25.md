# ACTION_IDs — 2026-09-25 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-25.md`](./SPELL_ADMIN_DESIGN_2026-09-25.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-25 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design §9 — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **041–055** (queue after #515, plus same-morning #561 / #563 / #564 / #568). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. SDA-relevant additions since #515: **#512** (range/`hitTiles` — already 09-24-040), **#518** (Wave-8 bosses), **#525** (Wave-7 tactical), **#526** (feat toast a11y), **#528** (Weaken/Slow), **#531** (AdminDashboard Visuals), **#533** (Wave-7 SDE), **#536** (Boss Rush WX), **#539** (AdminConfirmDialog / live-publish / `spellTargeting.ts`), **#541** (Swap live tile), **#544** / **#546** / **#547** / **#554** (leftover-walk WX), **#549** (`spellLegacyRange`), **#550** (kit heal-after-buff), **#551** (Mark empty tile), **#555** (damage+`debuffStat`), **#532** / **#540** / **#545** / **#552** (`saveBattleStats` skip), **#558** (Wave-8 elite families), **#561** (enemy/boss admin re-audit), **#563** (Wave-8 tactical), **#564** (`SpellSummonFields`), **#568** (linear ⊕ diagonal). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-25-041  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Compose #512 targeting caps with #549 range greater than maxRange; remaining activate-gate is AP 0 plus targetType  
CATEGORY: lifecycle-tooling  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#512](https://github.com/Mr-Melic/stralt/pull/512) adds `src/frontend/src/utils/adminSafety.spellTargeting.ts` and Motoko `spellTargetingRejected` so `range > 20` or any `hitTiles` offset outside ±20 fails before `spellConfigs.add`. Open [#549](https://github.com/Mr-Melic/stralt/pull/549) adds `adminSafety.spellLegacyRange.ts` and Motoko `spellLegacyRangeRejected` so `range > maxRange` fails (enemy AI uses `Number(spell.range)` from the backend catalog; player clicks use `spellRangeBase → maxRange`; `range=10` / `maxRange=3` lets hostiles outrange the player). Shipped `reflect_barrier` is `range=1` / `maxRange=0` and is grandfathered. Open [#539](https://github.com/Mr-Melic/stralt/pull/539) already restacks `adminSafety.spellTargeting.ts` onto AdminDashboard. Live `validateSpellConfig` (`adminSafety.ts` 578–660) still rejects `apCost < 1` (604–606) and has no `targetType`. Motoko (`adminGuard.mo` 380–382) matches the AP floor. Concatenating both range bodies into `validateSpellConfig` plus keeping the standalone modules ships three `export function` copies and fails Caffeine `vite build`.  
SYSTEMS_AFFECTED: `adminSafety.spellTargeting.ts`; `adminSafety.spellLegacyRange.ts`; `adminSafety.ts` `validateSpellConfig`; `adminGuard.mo`; `main.mo` `adminSetSpellConfig`; Spell Save  
RECOMMENDED_ACTION: If #512 / #549 / #539 have landed, keep **one** client module per clamp (or compose both predicates once into a single `spellRangeRejected`). Do not paste the bodies into `adminSafety.ts`. Motoko stays authoritative; client strings must match. Honour #568 as a separate axis-flag helper (055) — do not recopy it into the range modules. 09-23-006 must still add AP 0 (`isTimestep` / `allowZeroAp`) and required `targetType`. Honour 09-24-040. One `export function validateSpellConfig`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-006; SDA-2026-09-23-020; SDA-2026-09-24-040; SDA-2026-09-25-055; PRs #512 / #549 / #539 / #568  
REGRESSION_RISK: HIGH — duplicate validators diverge; skipping the `range > maxRange` clamp reopens hostile outrange; tightening without the `reflect_barrier` grandfather bricks a built-in re-save.  
VALIDATION_REQUIRED: `range=10` / `maxRange=3` rejected once (same string client and Motoko). `range=1` / `maxRange=0` still saves. `hitTiles` offset 21 rejected once. `isTimestep` + AP 0 accepted after 006. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-042  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-8 boss spectacular ids stay BOSS_ONLY; do not grow a fifth kit source  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#518](https://github.com/Mr-Melic/stralt/pull/518) appends Wave-8 sheets (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) to `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. Spectaculars `NAVE_GAZE` / `DOUBLE_SPAN` / `CHOIR_COVER` / `NAVE_LINTEL` are stamped `BOSS_ONLY`. Player doors reuse existing #411 ids only. Live combat already has three kit sources (09-23-011): `data/bossKits.ts`, Motoko `defaultBossConfigs()` still listing purged ids (`admin.mo` 357–379, Pale Archbishop `fireball`/`cursed_gust`/`entangle`), Admin chips `getSpellConfigs()`. 09-24-030 already forbade a fifth list with Wave-7 `#474`. A Wave-8 sheet that authors another `spellPoolIds` array, or that copies spectacular ids into `starterSpells` with `isBaseSpell: true`, pre-owns them via WX 2395–2440.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; Wave-8 spectacular ids  
RECOMMENDED_ACTION: Unique / spectacular ids on #518 wait for the named `BOSS` / `BOSS_ONLY` route (09-23-009). `BOSS_ONLY` never enters `ownedSpellIds`. When 09-23-011 lands, point the Wave-8 sheets at the same canonical id list as `bossKits.ts`. Ids only — no name matching. Do not implement boss cards in this studio PR. Coordinate with 09-24-030 / 039 rather than forking.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 028 / 09-24-030.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-009; SDA-2026-09-24-030; SDA-2026-09-24-039; PR #518  
REGRESSION_RISK: HIGH if Wave-8 spectaculars are seeded into `spellData.ts` as `isBaseSpell`. MEDIUM if a fifth kit list drifts from live combat.  
VALIDATION_REQUIRED: After a Wave-8 spectacular id exists in the catalog, a new character does not own it (never, if `BOSS_ONLY`). Admin chips, Motoko pools, and `bossKits.ts` still resolve one live id set.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-043  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #533 Wave-7 SDE stamps; do not pre-own generationMin 7 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#533](https://github.com/Mr-Melic/stralt/pull/533) is Wave-7 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md`, 19 unique ids, `generationMin: 7`). Pack Still is `ENEMY_ONLY`. File Fold is `BOSS_ONLY` on `file_regent`. Leftover challenge MULTI doors: Thin Ward ← `hard_1`, Clean Blood ← `legendary_1` — still never `unstoppable` / `level_10`. Wave-1 P0 (`ownedSpellIds`, observe, commit) is still NEW. Copying Wave-7 ids into `starterSpells` or #400’s 32-list would make discovery worse. 09-24-031 already said the same for Wave-6 `#480`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-7 catalog; family pools  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026 and 09-24-031. Honour #533 stamps (`ENEMY_DISCOVERY` default, named `ACHIEVEMENT` / `BOSS` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` children). Do not restamp Wave-1…6 doors. Do not implement Wave-7 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Still / File Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-24-031; PR #533  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-7 ids. HIGH if `ENEMY_ONLY` Pack Still is hydrated because `usableByPlayer !== false`.  
VALIDATION_REQUIRED: After a Wave-7 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-044  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #525 Wave-7 tactical ids; stamp, do not clone into starterSpells  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#525](https://github.com/Mr-Melic/stralt/pull/525) reserves 16 metadata-only tactical ids (`SPELL_PROPOSALS_2026-09-24.md`), including `spell-triple-span`, `spell-cadence-crack`, `spell-shove-face`, kit-only `spell-court-shove`. #533 stamps those onto families and extra doors (`span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `pace_prelate`) rather than cloning cards. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Seeding the reserved ids into `spellData.ts` as starters pre-owns Wave-7 paper before observe→win exists.  
SYSTEMS_AFFECTED: `spellData.ts`; create-character seed; Wave-7 tactical catalog; #533 stamps  
RECOMMENDED_ACTION: When Wave-7 tactical ids are implemented, they enter the catalog with 09-23-009 flags — not `isBaseSpell`. Kit-only `spell-court-shove` is `ENEMY_ONLY` / `BOSS_ONLY` as stamped, never `PLAYER_LEARNABLE`. Do not clone #525 cards into SDE rows. Do not implement the cards in this studio PR. Coordinate with 043 / 050.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-25-043; SDA-2026-09-25-050; PR #525  
REGRESSION_RISK: HIGH if the 16 ids land in `starterSpells`. MEDIUM if kit-only Court Shove is player-learnable by default `usableByPlayer: true` (`newSpell()` 98).  
VALIDATION_REQUIRED: After a Wave-7 tactical id exists, a new character does not own it. Court Shove never appears in the spellbook. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-045  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist advertised statuses; union Weaken/Slow, Mark, and damage plus debuffStat  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `SpellConfig` (`src/backend/types/admin.mo` 92–127) and bindgen (`backend.ts` 118–152) omit `targetType`, `debuffStat`, `isMark`, and mechanic flags. CatalogNote admits Swap/Barrier/Trap/DoT/buff numeric flags drop on reload (`AdminDashboard.tsx` 3641–3644). Open [#528](https://github.com/Mr-Melic/stralt/pull/528) extracts `playerStatusCast.ts` so Weaken/Slow apply catalog `debuffStat` on a highlighted living hostile. Open [#555](https://github.com/Mr-Melic/stralt/pull/555) extracts `playerDamageDebuff.ts` so Frost Bolt / Frost Nova / Cursed Wound / Shadow Veil / Expose / Life Drain / Drain Courage apply `debuffStat` after damage (`damage > 0` so #528 does not double-apply). Open [#551](https://github.com/Mr-Melic/stralt/pull/551) hoists Mark onto empty in-range tiles via `isMark`. Live combat therefore **requires** those frontend fields. 09-23-005 already asked to persist them; these PRs make that a runtime dependency, not a studio nice-to-have. Editor “Heal (targets self)” (`AdminDashboard.tsx` 2685) still infers targeting from `spellType`.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; SpellEditor; `playerStatusCast.ts`; `playerDamageDebuff.ts`; `spellEngine.ts`  
RECOMMENDED_ACTION: Persist 09-23-005 (`targetType` including `chain`, `debuffStat` / duration, `isMark`, other mechanic flags) in the same Motoko + bindgen + editor slice. If #528 / #551 / #555 have landed, keep one extract per name — do not concatenate a second `applyEffect`. Never key Weaken / Slow / Mark / Frost off `spell.name`. New fields need 09-23-016. Drop “Heal (targets self)”.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-006; SDA-2026-09-23-016; SDA-2026-09-24-033; PRs #528 / #551 / #555  
REGRESSION_RISK: HIGH — default `targetType=enemy` on Mark empty-tile or self-heals would break those casts. A lagging actor rejects new-field saves. Double-applying #528 and #555 on Weaken would stack Slow twice.  
VALIDATION_REQUIRED: Save Weaken with `debuffStat` + `targetType=enemy`; refetch matches; highlighted hostile still applies the debuff. Save Mark with `isMark=true`; empty in-range tile still marks. Rename the spell; combat still uses flags. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-046  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist isSwap; union #541 live-tile Swap extract  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#541](https://github.com/Mr-Melic/stralt/pull/541) extracts `engine/swapTeleport.ts` so official Swap (`spell-swap`) resolves from `playerPositionRef.current` and aborts leftover MP walk (`movementGen`). Live combat therefore **requires** `isSwap` metadata. Motoko persist and bindgen omit it. `newSpell()` sets related mechanic bools (`AdminDashboard.tsx` 124–126) but CatalogNote admits they drop on reload (3641–3644). 09-24-033 already covered Timestep/Mirror; Swap is the same class on a different extract. Overlaps WX with leftover-walk siblings.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; SpellEditor; `swapTeleport.ts`; `WorldExploration.tsx` call site  
RECOMMENDED_ACTION: Persist `isSwap` in the 09-23-005 slice. If #541 has landed, keep one `swapTeleport` extract. Never key Swap off `spell.name`. Extract further WX kit/cast resolve rather than growing WX (19 213 lines). New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-016; SDA-2026-09-24-033; SDA-2026-09-25-045; PR #541  
REGRESSION_RISK: HIGH — default `targetType=enemy` without `isSwap` would skip the teleport. Concatenating a second `swapPositions` fails esbuild.  
VALIDATION_REQUIRED: Save Swap with `isSwap=true` and the live `targetType`; refetch matches; mid-walk Swap still uses the live tile and aborts leftover path. Rename the spell; combat still swaps. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-047  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #550 kit heal-after-buff; never name-match Blood Mend  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#550](https://github.com/Mr-Melic/stralt/pull/550) adds `kitHealAfterBuff` so player-controlled Wisp Blood Mend / Rallying Cry, which return from `resolveSpellCast` on `buffStat` before `healAmount`, still commit store HP after the kit AP debit. That is metadata (`healAmount` + `buffStat`), not `spell.name.includes("Blood Mend")`. Summon persist is still thin (`SummonUnitDef` has no `summonKit` / AP/MP — `admin.mo` 85–90 vs `summonSpawn.ts` 22–33). Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139) and `spell.name.replace("Summon ", "")` (165). Overlaps WX.  
SYSTEMS_AFFECTED: `kitHealAfterBuff`; `WorldExploration.tsx`; `summonSpawn.ts`; SpellEditor summon kit  
RECOMMENDED_ACTION: If #550 has landed, keep one `kitHealAfterBuff`. 09-23-002 still persists `displayName` / `summonKit` / AP/MP and drops the hunter default. Do not add `includes(spell.name)` while touching the file. Kit heals stay `healAmount` on the kit spell id. One `export function spawnSummonUnit` with 09-24-034.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-09-24-034; PR #550  
REGRESSION_RISK: MEDIUM — dropping the heal-after-buff while adding `displayName` re-breaks Wisp HP; keeping hunter after 002 silently rewrites empty AI.  
VALIDATION_REQUIRED: Wisp Blood Mend still heals advertised HP after a `buffStat` kit cast. Summon with `summonAI=healer` and name “Orb” still heals. Empty AI fails activate. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-048  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union leftover-walk and summon-spawn WX siblings; do not grow WorldExploration  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` is 19 213 lines. Open leftover-walk cluster: [#544](https://github.com/Mr-Melic/stralt/pull/544) abort leftover walk before mid-walk summon spawn; [#546](https://github.com/Mr-Melic/stralt/pull/546) halt leftover MP walk when the last hostile dies; [#547](https://github.com/Mr-Melic/stralt/pull/547) abort leftover overworld walk when a fight starts; [#554](https://github.com/Mr-Melic/stralt/pull/554) block canvas walks while Death Realm is pending; [#536](https://github.com/Mr-Melic/stralt/pull/536) Boss Rush jackpot `complete(9)` before abort; [#541](https://github.com/Mr-Melic/stralt/pull/541) Swap also bumps `movementGen`. 09-24-034 already unions #486 `summonSpawn.ts` dump occupancy with one `spawnSummonUnit`. Concatenating a second walk-abort helper or a second hunter/name fallback fails esbuild. Discovery writers must not be inlined into these hunks.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `summonSpawn.ts`; `swapTeleport.ts`; Boss Rush hooks  
RECOMMENDED_ACTION: If those PRs have landed, keep one abort/`movementGen` helper family and one `spawnSummonUnit`. Extract further WX kit resolve / observe hooks into helpers next to those files. Do not grow WX. Do not add `recordSpellObservation` inside a walk-abort hunk. One `export function` per name.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-24-034; SDA-2026-09-25-046; PRs #544 / #546 / #547 / #554 / #536 / #486  
REGRESSION_RISK: HIGH — duplicate walk-abort exports fail import; growing WX for discovery wiring is forbidden; dropping occupancy while adding `displayName` reseals corridors.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. Mid-walk summon still dumps on the fight graph. Death Realm still blocks canvas walks. Duplicate-export scan clean. WX line count does not grow for studio work.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-049  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #539 live-publish confirm and #531 Visuals; one SpellEditor extract  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#539](https://github.com/Mr-Melic/stralt/pull/539) adds `AdminConfirmDialog.tsx`, `adminLivePublish.ts`, and restacks `adminOwnerUx.ts` / `adminSafety.spellTargeting.ts` onto `AdminDashboard.tsx` (8 280 lines). Open [#531](https://github.com/Mr-Melic/stralt/pull/531) edits the same dashboard (Visuals palette unused by map walls). 09-23-027 listed #334 / #341 / #413 / #415 / #457. 09-24-037 added #470. Concatenating two SpellEditor copies, two confirm dialogs, or two targeting helpers fails Caffeine `vite build`. Live spell confirm still claims immediate remove (`AdminDashboard.tsx` 3791–3795) and toast is `"Spell deleted"` (6166) — live-publish confirm is **not** lifecycle. This docs PR must **not** touch those files. Spell Save landing remains `useSpellQueries.ts`.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; `AdminConfirmDialog.tsx`; `adminLivePublish.ts`; `adminOwnerUx.ts`; `adminSafety.spellTargeting.ts`; extracted SpellEditor  
RECOMMENDED_ACTION: When 09-23-015 is implemented, restack onto an oldest-first integration that includes #470 / #531 / #539. Keep one confirm dialog, one live-publish helper, one targeting helper, **one** SpellEditor. Do not treat owner-UX / live-publish copy as lifecycle (09-23-001 still owns Retire vs Delete). Run `bash scripts/open-pr-stack-compat.sh --self` and `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-23-027; SDA-2026-09-24-037; SDA-2026-09-25-041; PRs #470 / #531 / #539  
REGRESSION_RISK: HIGH — duplicate exports fail import; overwriting #539’s confirm copy re-lies about live publishes; overwriting 3791–3795 without 001 keeps the “removed immediately” lie.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. Name-pool / Boss Rush / system-config confirms still fire. Spell Save still goes through `useSpellQueries`. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-050  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-8 elite families are CORE stamps, not a fourth ENEMY_KITS  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#558](https://github.com/Mr-Melic/stralt/pull/558) (`ENEMY_ELITE_EVOLUTION_2026-09-25.md`) stamps seventeen world-pack families (`wall_stinger` … `leash_cutter`) onto SPELL_PROPOSALS Wave-7 verbs (#525) plus three SDE Wave-6 unique CORE ids (Dull Edge, Pet Sill, Short Leash). Live `ENEMY_KITS` is still a hardcoded `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Admin `EnemyConfig` has no spell list. `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) still passes a LevelZone object so every kit stays zone 0. 09-23-010 already required admin-authored CORE–SIGNATURE pools. Hardcoding Wave-8 family kits next to `ENEMY_KITS` grows a fourth source alongside Motoko boss seeds / `bossKits.ts` / Admin chips.  
SYSTEMS_AFFECTED: future `enemyKits` store; Admin Kits tab; `buildEnemyKit` call site; Wave-8 family stamps  
RECOMMENDED_ACTION: When 09-23-010 lands, Wave-8 families are rows on the same `EnemyKit` store (ids only, numeric zone). Honour #558 CORE stamps. Must Pace / Court Shove stay boss/closed as stamped. Do not append a second `ENEMY_KITS` table. Pass `minLevel` or a numeric zone — never the LevelZone object. Extract the WX call site; do not grow WX. Coordinate with 044 / 043.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-25-043; SDA-2026-09-25-044; PR #558  
REGRESSION_RISK: MEDIUM — empty kit must not leave enemies unarmed. Fixing zone NaN will suddenly enable ADVANCED ids (`spell-venom-strike`, `spell-inferno`) — confirm those ids exist in the catalog first (007) and are not name-tombstoned (`Inferno` is still in `OLD_SPELL_NAMES_SET`).  
VALIDATION_REQUIRED: Zone 0 pawn kit matches today’s ids including Strike after 007. A Wave-8 family kit resolves stamped ids only. Missing id skipped and logged. No `starterSpells.find(id === "summon-dire-wolf")`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-051  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #526 feat-toast a11y; discovery stays on the root recap  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BattleRecapData` (`PostBattleRecap.tsx` 6–34) still has XP/Doka/feats only; `attachRecapUnlocks` is achievements. Open [#526](https://github.com/Mr-Melic/stralt/pull/526) edits `AchievementToast.tsx` (shop Escape / 44px targets / named overlays) on the same feat-toast surface 09-24-035 already reserved as feat chrome. Wave-1 SDE requires `TECHNIQUE OBSERVED` (existing toast family) and `NEW SPELL DISCOVERED` on the **same** root recap. A second recap or a feat-styled spell toast would fork the atomic funnel (`AGENTS.md` recap rule).  
SYSTEMS_AFFECTED: `AchievementToast.tsx`; `PostBattleRecap.tsx` `BattleRecapData`; observe toast  
RECOMMENDED_ACTION: Keep #526 a11y on feats. When 09-23-009 lands, extend the existing recap object with `discoveredSpells`. Do not open a second popup. `ENEMY_ONLY` / `BOSS_ONLY` optional dim log only. Extract helpers; do not grow WX. Honour 09-24-035.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-24-035; PR #526  
REGRESSION_RISK: MEDIUM — a Feat Unlocked-styled spell toast double-signals; regressing #526 a11y while adding recap fields is unnecessary.  
VALIDATION_REQUIRED: Victory with a new feat and a discovered spell shows one recap containing both. Observe toast is not “Feat Unlocked”. Feat toast still dismisses on Escape. Duplicate victory empty grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-052  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Later saveBattleStats skip-after-keep PRs are not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 09-24-036 already bound observation to II principal + slot on `createProgressPersist`, and forbade piggy-backing [#488](https://github.com/Mr-Melic/stralt/pull/488) / [#493](https://github.com/Mr-Melic/stralt/pull/493) / [#499](https://github.com/Mr-Melic/stralt/pull/499) skip-`saveBattleStats` helpers. After #515 the same class grew: [#532](https://github.com/Mr-Melic/stralt/pull/532) unseeded `handleBattleEnd` keep, [#540](https://github.com/Mr-Melic/stralt/pull/540) unseeded portal keep, [#545](https://github.com/Mr-Melic/stralt/pull/545) unseeded GameKey keep, [#552](https://github.com/Mr-Melic/stralt/pull/552) seeded GameKey keep. `saveBattleStats` never mints and ignores spell-level arrays (`AGENTS.md`). Discovery grants must not ride those skip paths. Display name is not a persist key. `getPlayerAchievements` already requires `identity.getPrincipal()`.  
SYSTEMS_AFFECTED: future observation maps; persist lock; character slot 1–3; `saveBattleStats` callers  
RECOMMENDED_ACTION: Key observed/owned maps `(principal, slot, spellId)`. Enqueue on `createProgressPersist`; `commit` after the canister write. Do not call `updateCharacter`, `upgradeSpell`, or `saveBattleStats` to grant. Honour the later skip helpers for wallet writes; do not add a parallel skip for spell grants. Death 20/40 does not strip owned/observed. `localStorage` is cache only. New stables need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-016; SDA-2026-09-24-036; PRs #532 / #540 / #545 / #552  
REGRESSION_RISK: HIGH if a grant is folded into `saveBattleStats` or keyed by display name. HIGH if a skip helper drops a committed discovery on portal / GameKey keep.  
VALIDATION_REQUIRED: Slot 2 observe does not unlock slot 1. Unseeded portal keep and GameKey keep still do not wipe a committed discovery. Duplicate victory empty grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-053  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #564 SpellSummonFields; still missing displayName, kit, and targetType  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#564](https://github.com/Mr-Melic/stralt/pull/564) (created 2026-09-25T00:16Z, same morning as this run) adds `SpellSummonFields` to `AdminDashboard.tsx` and new helpers `adminOwnerUx.summon.ts` / `adminOwnerUx.catalogPublish.ts` (not a second `adminOwnerUx.ts`). Controls: summon AI, lifespan, piece, level, hp/damage scale. Persist already had those Motoko fields (`admin.mo` 85–90, 121–124). The form did not. Copy on the section says Save is **not** a draft — live overwrite (`main.mo` 869–880) is unchanged. Missing vs 09-23-002 / 005 / 015: `displayName`, `summonKit`, summon AP/MP, `targetType`, Spell Type `<select>` still damage/heal/drain on HEAD (`AdminDashboard.tsx` 2684–2687), acquisition, lifecycle. Concatenating a second summon section with 09-23-015 fails esbuild. Overlaps AdminDashboard with #539 / #531 / #470.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx` SpellSummonFields; `adminOwnerUx.summon.ts`; extracted SpellEditor; Motoko `SummonUnitDef`  
RECOMMENDED_ACTION: If #564 has landed, keep one summon section and one `adminOwnerUx.summon` helper. 09-23-002 still persists `displayName` / `summonKit` / AP/MP and drops `|| "hunter"`. 09-23-013 still owns draft/activate — do not treat “Live catalog” copy as lifecycle. Add `summon` to Spell Type and a `targetType` control in the 015 extract. Do not grow WX. Union with 049.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-015.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-015; SDA-2026-09-23-013; SDA-2026-09-25-049; PR #564  
REGRESSION_RISK: HIGH — a second summon block duplicates exports; treating #564 as activate hides that Save still overwrites combat. MEDIUM — empty `summonAI` is now editor-visible but runtime still hunter-defaults until 002.  
VALIDATION_REQUIRED: Saving a summon with `summonAI=hunter` round-trips the Motoko fields. `displayName` still cannot persist until 002. Spell Type still cannot be `summon` until 015. Duplicate-export scan clean. Stack-compat includes #564.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-054  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #563 Wave-8 tactical ids; stamp, do not clone into starterSpells  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#563](https://github.com/Mr-Melic/stralt/pull/563) reserves 16 metadata-only Wave-8 tactical ids (`SPELL_PROPOSALS_2026-09-25.md`), filling Wave-7 leftover holes: `spell-gait-mend` (heal-if-caster-walked), `spell-pair-hinge` (90° hinge of two hostiles), `spell-cadence-flush` (ally all-CDs → 0). Court Hinge is the mass signature. Live hydrate still grants every `starterSpells` row (`WorldExploration.tsx` 2395–2408). Same failure as #525 (044): seeding these ids as `isBaseSpell` pre-owns Wave-8 paper before observe→win.  
SYSTEMS_AFFECTED: `spellData.ts`; create-character seed; Wave-8 tactical catalog  
RECOMMENDED_ACTION: Same rule as 044. When Wave-8 tactical ids are implemented they enter the catalog with 09-23-009 flags — not `isBaseSpell`. Do not clone #563 cards into SDE rows. Do not implement the cards in this studio PR. Coordinate with 042 / 050.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-25-044; PR #563  
REGRESSION_RISK: HIGH if the 16 ids land in `starterSpells`.  
VALIDATION_REQUIRED: After a Wave-8 tactical id exists, a new character does not own it. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-25-055  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #568 Linear XOR Diagonal clamp; do not concatenate with range helpers  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#568](https://github.com/Mr-Melic/stralt/pull/568) adds `AdminGuard.spellAxisFlagsRejected` and `adminSafety.spellAxisFlags.ts` so Linear and Diagonal together `#err` before `spellConfigs.add`. Official `isTileCastableLive` then leaves only the caster tile; damage rows with `minRange>=1` reject self. Spells have no last-good rollback, so the previous valid catalog row used to be overwritten. Unique helper — PR text already says do not recopy #512 `spellTargetingRejected` or #549 `spellLegacyRangeRejected`. Overlaps `adminGuard.mo` / `adminSafety.ts` / `useSpellQueries.ts` (stack-compat WARNs a conflict on `useSpellQueries.ts` vs #568 as a pre-existing queue break). Remaining 09-23-006 is still AP 0 + `targetType`.  
SYSTEMS_AFFECTED: `adminSafety.spellAxisFlags.ts`; `adminGuard.mo`; `validateSpellConfig`; Spell Save / `useSpellQueries.ts`  
RECOMMENDED_ACTION: If #568 has landed, keep one `spellAxisFlagsRejected`. Do not inline it into `spellTargeting.ts` or `spellLegacyRange.ts`. Compose from `validateSpellConfig` / activate gate. Honour 041. One `export function` per name. Restack `useSpellQueries.ts` with #568 rather than overwriting.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-006; SDA-2026-09-25-041; PR #568  
REGRESSION_RISK: MEDIUM — duplicate axis validators diverge; skipping 006 still leaves Timestep AP 0 illegal. HIGH if Spell Save bypasses the new helper after a restack.  
VALIDATION_REQUIRED: Linear+Diagonal save `#err`s once (same string client and Motoko). Linear-only and diagonal-only still save. `isTimestep` + AP 0 accepted after 006. Duplicate-export scan clean.  
STATUS: NEW  

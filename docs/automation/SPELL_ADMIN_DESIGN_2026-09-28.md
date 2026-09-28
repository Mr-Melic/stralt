# Spell, Discovery & Achievement Admin Design — 2026-09-28 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-28  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). **First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473)** (`SDA-2026-09-23-001` … `028`). 09-24 lives on unmerged [#515](https://github.com/Mr-Melic/stralt/pull/515) (`029` … `040`). 09-25 lives on unmerged [#570](https://github.com/Mr-Melic/stralt/pull/570) (`041` … `055`). 09-26 lives on unmerged [#630](https://github.com/Mr-Melic/stralt/pull/630) (`056` … `069`). 09-27 lives on unmerged [#677](https://github.com/Mr-Melic/stralt/pull/677) (`070` … `083`). **Do not overwrite those files.**

**Live Motoko / client / catalog at `0f5363f` is unchanged since 09-21.** Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist. Treat **09-23-001 … 028 as the current first-cuts**. Do not implement a second 09-28 copy of 001–083.

What changed is the **oldest-first queue after #677** (created 2026-09-27T00:17Z). Sibling PRs are about to: stamp Wave-10 SDE (`generationMin: 10`) and Wave-10 tactical ids onto the same 32-id pre-owned catalog; attach Wave-10 elite CORE while kit zone is still NaN; extract more of `WorldExploration.tsx`; copy kit Shield/Slow/Poison and heal/Enrage buffs that Admin Save still drops; treat Inferno cooldown and Pacifist as metadata; keep CRC’s “Strike is KEEP/FIX”; skip more `saveBattleStats` death-cut paths that are not grant writers.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-28.md`](./ACTION_IDS_SDA_2026-09-28.md) (`SDA-2026-09-28-084` … `098`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

09-27 already recorded Wave-9 SDE (#646), Wave-9 tactical (#636), Wave-10 / Wave-11 bosses (Tables H / I, #638 / #663), iso-grid extract (#639), AdminDashboard shop lock (#631), drain / Soul Rend / Trap / shred / Shield RES persist slices (#644 / #647 / #649 / #658 / #659), 0-HP victory (#652), keep-then-feat skip (#657), and map-modifier pool delete (#650).

It did **not** see:

- [#679](https://github.com/Mr-Melic/stralt/pull/679) Wave-10 SDE (`generationMin: 10`; unique §11 `spell-inch-stride` … `spell-mid-fold`; `spell-pack-close` `ENEMY_ONLY`; `spell-mid-fold` `BOSS_ONLY` on `mid_fold_regent`; leftover `survivor` stays unused as a spell gate).
- [#695](https://github.com/Mr-Melic/stralt/pull/695) Wave-10 tactical (`spell-both-mend` … `spell-court-keep`; `spell-court-keep` `NOT_PLAYER_LEARNABLE`; Penta Span blocked while `ENEMY_SUMMON_CAP` is 2).
- [#686](https://github.com/Mr-Melic/stralt/pull/686) Wave-10 elite families consume #636 CORE; Court Stretch / Pack Tithe / About Hinge stay closed; SDE Wave-9 unique CORE waits for Wave 11.
- [#683](https://github.com/Mr-Melic/stralt/pull/683) ground-Doka extract from WorldExploration (after #639 iso-grid).
- Combat metadata PRs that make more frontend flags a runtime dependency: [#700](https://github.com/Mr-Melic/stralt/pull/700) kit Shield/Slow/Poison copy, [#692](https://github.com/Mr-Melic/stralt/pull/692) Blood Mend / Rallying Cry CHC, [#699](https://github.com/Mr-Melic/stralt/pull/699) ally Enrage on summon outgoing, [#709](https://github.com/Mr-Melic/stralt/pull/709) Sentinel Shield RES on the clicked allied summon, [#696](https://github.com/Mr-Melic/stralt/pull/696) Inferno cooldown copy from `cooldown`, [#714](https://github.com/Mr-Melic/stralt/pull/714) Pacifist after offensive kit casts.
- [#707](https://github.com/Mr-Melic/stralt/pull/707) CRC weekly: `SAFE_TO_REMOVE` persist ids = none; live `physical_attack` is KEEP/FIX, not delete.
- Persist / admin: [#698](https://github.com/Mr-Melic/stralt/pull/698) / [#705](https://github.com/Mr-Melic/stralt/pull/705) / [#710](https://github.com/Mr-Melic/stralt/pull/710) death-cut `saveBattleStats` skips; [#703](https://github.com/Mr-Melic/stralt/pull/703) last-live map-modifier chance of 0; [#690](https://github.com/Mr-Melic/stralt/pull/690) Claim-in-Feats copy.
- Same-day siblings [#660](https://github.com/Mr-Melic/stralt/pull/660) / [#681](https://github.com/Mr-Melic/stralt/pull/681) admin drift — do not overwrite those docs.
- Same-morning [#724](https://github.com/Mr-Melic/stralt/pull/724) Admin UX lifecycle **copy** helpers (`adminOwnerUx.lifecycle.ts` / `deps.ts`). Labels are not canister `lifecycle`. Do not treat AUX DRAFT/ACTIVE as 09-23-001.

If an implementer unions Wave-10 unique ids or Court Keep into `starterSpells` with `isBaseSpell: true`, or treats a death-cut skip as `commitSpellDiscoveries`, the studio gets worse: everyone owns G10 paper, and a corpse or wallet remount unlocks the observe→win funnel.

The 08-31 contract is still the destination. The 09-23 IDs are still the first cuts. This run only adds queue-union IDs. Do not extend the `usableByPlayer=false` retire path.

---

## 2. Current state (pointer — same HEAD as 09-23 … 09-27)

Re-read against `origin/main` @ `0f5363f`. Line numbers match [`SPELL_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/473) §2 and [`SPELL_ADMIN_DESIGN_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/677) §2. Do not rediscover bindgen summon (09-01-002 **LANDED**) or the empty-`summonAI` Motoko reject (empty-AI half of 09-02-006 **LANDED**).

Still true, and still the studio:

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. `BattleRecapData` has no `discoveredSpells`. |
| Acquisition + three flags | Only `usableByPlayer` / `usableByEnemy` (`src/backend/types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools / zone NaN | `ENEMY_KITS` (`enemyAI.ts` 163–185); `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). LevelZone is `{ name, minLevel, maxLevel }` so `Math.floor` is `NaN`. |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches name **and** id (WX 2356–2389), including live `physical_attack`. `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Runtime still `spell.summonAI \|\| "hunter"`. Editor “Heal (targets self)” (`AdminDashboard.tsx` 2685). |
| Strike purged + tombstoned | `OLD_SPELL_IDS` includes `physical_attack` (`main.mo` 689–697). Zone-0 pawn/knight/rook kits resolve empty unless summoner extras append wolf/archer. |
| Retire = cast gate | `adminDeleteSpellConfig` (`main.mo` 882–902) writes `usableByPlayer=false` or `remove`. Confirm copy still claims immediate remove (`AdminDashboard.tsx` 3794). Toast is `"Spell deleted"` (6166). `_spellReferencedByPlayers` is keys+bar only. |
| Closed summon enums | `knownSummonAI` is hunter/guardian/archer/kiter/bomber/kamikaze/healer (`adminGuard.mo` 363–366). `knownPieceType` has no `font` / `dummypost` / `pentaspan` (368–372). Client `SUMMON_AIS` / `PIECE_TYPES` match (`adminSafety.ts` 19–40). |
| Feats / challenges | `AchievementConfig` is Doka-only (`admin.mo` 249–256). 15-key condition whitelist (`adminGuard.mo` 515–531) includes `pacifist_run`. Challenges still `{ doka, xp, badge }`. |
| No spell rollback | Spell Save is a live overwrite (`main.mo` 869–880). Landing is `useSpellQueries.ts`. |
| Thin summon persist | Motoko `SummonUnitDef` is `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). |
| Activate gate vs AP 0 | Client and Motoko still reject `apCost < 1`. Live Timestep is `apCost: BigInt(0)` (`spellData.ts` 216–226). `targetType` has **zero** editor matches. Spell Type `<select>` is still damage/heal/drain (2684–2687). |
| Bar persist | `setSpellBarOrder` still filters to `spellLevelKeys` (`main.mo` 1945–1947). |
| EOP | New stables need a **later** `YYYYMMDD_*.mo` after `20260901_000000`. `check-limit = 5`. |

---

## 3. Queue hazards new since 09-27 (do not treat as landed)

Oldest-first merge order still starts at **#327**, then **#331**, then **#333+**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name. Do **not** touch `AdminDashboard.tsx` / `WorldExploration.tsx` / `adminSafety.ts` / `adminGuard.mo` / `main.mo` in this docs PR.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#677](https://github.com/Mr-Melic/stralt/pull/677) | 09-27 SDA docs (`070` … `083`) | Do not rewrite those two files. |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) / [#398](https://github.com/Mr-Melic/stralt/pull/398) / [#473](https://github.com/Mr-Melic/stralt/pull/473) / [#515](https://github.com/Mr-Melic/stralt/pull/515) / [#570](https://github.com/Mr-Melic/stralt/pull/570) / [#630](https://github.com/Mr-Melic/stralt/pull/630) | 09-21 … 09-26 SDA docs | Do not rewrite those files. 09-23-001…028 remain the first-cuts. |
| [#679](https://github.com/Mr-Melic/stralt/pull/679) | Wave-10 SDE (`generationMin: 10`; unique §11; leftover `survivor` unused) | Honour stamps. SDE unique ids win vs #695 clones. Pack Close / Mid Fold never owned (084). |
| [#695](https://github.com/Mr-Melic/stralt/pull/695) | Wave-10 tactical (`spell-both-mend` … `spell-court-keep`) | Stamp, do not clone. Court Keep never owned. Penta Span stays blocked while summon cap is 2 (085). |
| [#686](https://github.com/Mr-Melic/stralt/pull/686) | Wave-10 elite CORE from #636 | Closed signatures stay closed. Zone NaN still forces CORE-only kits until 09-23-010 (086). |
| [#683](https://github.com/Mr-Melic/stralt/pull/683) | Ground-Doka extract from WX | Union the extract. Do not grow WX for studio wiring (087). |
| [#700](https://github.com/Mr-Melic/stralt/pull/700) | Kit Shield/Slow/Poison metadata copy | Persist buff/debuff/DoT with 09-23-005. Never `name.includes("Shield")` (088). |
| [#692](https://github.com/Mr-Melic/stralt/pull/692) | Blood Mend / Rallying Cry advertised CHC | Persist `buffStat` / `targetType=self`. Heal option text is not targeting (089). |
| [#699](https://github.com/Mr-Melic/stralt/pull/699) | Ally Enrage on summon outgoing | Persist `targetType=ally` + `buffStat=dmg`. Description “own DMG” is a lie (090). |
| [#696](https://github.com/Mr-Melic/stralt/pull/696) | Inferno gifted-card cooldown copy | Description helper reads `cooldown`, never the name “Inferno” (091). |
| [#714](https://github.com/Mr-Melic/stralt/pull/714) | Pacifist fails after offensive kit casts | Feat condition stays the whitelist key. Offensive = metadata categories, not kit names (092). |
| [#707](https://github.com/Mr-Melic/stralt/pull/707) | CRC: no persist id is `SAFE_TO_REMOVE` | Strike is KEEP/FIX. Soft-retire, not `OLD_SPELL_IDS` delete (093). |
| [#709](https://github.com/Mr-Melic/stralt/pull/709) | Sentinel Shield RES on clicked allied summon | Persist Shield `targetType=ally` + RES buff (094). |
| [#698](https://github.com/Mr-Melic/stralt/pull/698) / [#705](https://github.com/Mr-Melic/stralt/pull/705) / [#710](https://github.com/Mr-Melic/stralt/pull/710) | Death-cut `saveBattleStats` skips | Not a grant writer. Discovery stays on recap persist (095). |
| [#703](https://github.com/Mr-Melic/stralt/pull/703) | Reject last-live map-modifier chance of 0 | Same retire-vs-empty class as spells / #650 (096). |
| [#690](https://github.com/Mr-Melic/stralt/pull/690) | Claim-in-Feats copy | Copy is not `unlockOwnedSpell`. Leftover feat doors stay unused (097). |
| [#660](https://github.com/Mr-Melic/stralt/pull/660) / [#681](https://github.com/Mr-Melic/stralt/pull/681) | Enemy/boss + admin-drift docs | Do not overwrite. Kits still one canonical id list (09-23-011). |
| [#724](https://github.com/Mr-Melic/stralt/pull/724) | Owner lifecycle / visual-pool / dependency **copy** helpers | Union one helper per name. Copy ≠ persist `lifecycle`. Do not grow AdminDashboard (098). |
| [#716](https://github.com/Mr-Melic/stralt/pull/716) / [#719](https://github.com/Mr-Melic/stralt/pull/719) | Challenge persist split; WDD Wave-11 | Do not overwrite. Challenge still cannot grant a spell id. |

---

## 4. Owner UI (unchanged)

Live tabs (`AdminDashboard.tsx` 5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing studio tabs: Library, Discovery, Kits, Feats-as-graph, Graph, Versions.

Extract `SpellEditor` onto `useSpellQueries.ts`. Keep admin writes there. Do not grow the 8 280-line dashboard until 09-23-013 activate exists. Do not grow WX. If an implementer PR overlaps #327 / #331 / #639 / #683 / #631, **union** those files.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 §9 / 09-27 §5. 09-01-002 **LANDED**. Empty-AI half of 09-02-006 **LANDED**. Everything else **OPEN** or **PARTIAL / WRONG FIELD**.

Next implementer: **09-23-001**, then **09-23-007**, then **09-23-003** + **09-23-023**. Any persist map is **09-23-016**. Honour 09-24-029…040, 09-25-041…055, 09-26-056…069, and 09-27-070…083 when those siblings have landed. This run’s 084…098 are queue-union only.

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-1…10 spell cards or boss sheets
- Overwriting `SPELL_ADMIN_DESIGN_2026-09-2{1,2,3,4,5,6,7}.md` or their ACTION_ID ledgers
- Re-opening 09-01-002 or the empty-AI Motoko reject
- Editing Cursor dashboard prompts (no write API)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-28.md`](./ACTION_IDS_SDA_2026-09-28.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-28-084 | Honour #679 Wave-10 SDE stamps; do not pre-own generationMin 10 ids | P1 |
| SDA-2026-09-28-085 | Stamp #695 Wave-10 tactical; Court Keep never owned | P1 |
| SDA-2026-09-28-086 | Honour #686 Wave-10 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-09-28-087 | Union #683 ground-Doka extract; do not grow WorldExploration | P1 |
| SDA-2026-09-28-088 | Persist kit Shield/Slow/Poison metadata; union #700 | P0 |
| SDA-2026-09-28-089 | Persist Blood Mend / Rallying Cry CHC; union #692 | P0 |
| SDA-2026-09-28-090 | Persist ally Enrage `targetType` + dmg buff; union #699 | P0 |
| SDA-2026-09-28-091 | Inferno cooldown copy reads `cooldown`, never the name | P1 |
| SDA-2026-09-28-092 | Pacifist uses metadata categories; union #714 | P1 |
| SDA-2026-09-28-093 | Honour #707 CRC: Strike is KEEP/FIX, not hard-delete | P0 |
| SDA-2026-09-28-094 | Persist Sentinel Shield RES on allied summons; union #709 | P1 |
| SDA-2026-09-28-095 | Death-cut saveBattleStats skip is not a grant path | P1 |
| SDA-2026-09-28-096 | Last-live modifier chance 0 is the same class as spell hard-delete | P1 |
| SDA-2026-09-28-097 | Claim-in-Feats copy and leftover feat doors are not grants | P1 |
| SDA-2026-09-28-098 | Union #724 owner-lifecycle copy; do not treat AUX labels as persist | P1 |

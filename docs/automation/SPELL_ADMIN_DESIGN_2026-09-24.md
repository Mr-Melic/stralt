# Spell, Discovery & Achievement Admin Design — 2026-09-24 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-24  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). 09-23 lives on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473) (`SPELL_ADMIN_DESIGN_2026-09-23.md`). **Do not overwrite those files.**

**Live Motoko / client / catalog at `0f5363f` is unchanged since 09-23.** Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist. Treat **09-23-001 … 028 as the current first-cuts** — do not implement a second 09-24 copy of those IDs.

What changed is the **oldest-first queue after #473** (created 2026-09-23T00:24Z). Sibling PRs are about to: wire world-feature attune from `usableByEnemy` catalog rows; extract a boss-aim helper that must not become a fourth kit list; resolve Timestep/Mirror on a self tile that Admin cannot persist; put feat copy and challenge Doka on surfaces that discovery must share, not fork. Those are new hazards on the same HEAD.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-24.md`](./ACTION_IDS_SDA_2026-09-24.md) (`SDA-2026-09-24-029` … `040`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

09-23 already recorded the studio hole and the queue through #466 / #460 / #413 / #400. It did **not** record the spell-bearing world features that already sit on `origin/main` (`WF-SPL-RUNE_BEARER`, `WF-SPL-GRIMOIRE_STALKER`, `WF-SPL-LOANER_MAGE`), and it could not see PRs opened after 00:24Z.

If an implementer unions #503 attune, #498 `bossKitSpell.ts`, and #400’s 32-id allowlist before `ownedSpellIds` exists, players will permanently “own” every `usableByEnemy` catalog row that a Rune Bearer rolled. That is not observe→win→unlock.

The 08-31 contract is still the destination. The 09-23 IDs are still the first cuts. This run only adds queue-union IDs. Do not extend the `usableByPlayer=false` retire path.

---

## 2. Current state (pointer — same HEAD as 09-23)

Re-read against `origin/main` @ `0f5363f`. Line numbers match [`SPELL_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/473) §2. Do not rediscover bindgen summon (09-01-002 **LANDED**) or the empty-`summonAI` Motoko reject (empty-AI half of 09-02-006 **LANDED**).

Still true, and still the studio:

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. |
| Acquisition + three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| `minLevel` is a fake unlock | Documented as unlock (`admin.mo` 119); CatalogNote admits it is not enforced at hydrate (`AdminDashboard.tsx` 3644). Paid `upgradeSpell` appends any usable catalog id (`main.mo` 1008–1014). |
| Enemy pools / zone NaN | `ENEMY_KITS` (`enemyAI.ts` 163–185); `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11915–11923). LevelZone is an object (4683–4687) so `Math.floor` is `NaN`. |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches name **and** id (WX 2356–2389), including live `physical_attack` and display name `Inferno`. `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. `inferSummonArchetype` name fallback (`enemyAI.ts` 218–224). Runtime still `spell.summonAI \|\| "hunter"` (139). |
| Strike purged + tombstoned | `OLD_SPELL_IDS` includes `physical_attack` (`main.mo` 689–697). Zone-0 pawn/knight/rook kits resolve empty unless summoner extras append wolf/archer (WX 11932–11942). |
| Retire = cast gate | `adminDeleteSpellConfig` (`main.mo` 882–902) writes `usableByPlayer=false` or `remove`. Confirm copy still claims immediate remove (`AdminDashboard.tsx` 3791–3795). Toast is `"Spell deleted"` (6166). |
| Feats / challenges | `AchievementConfig` is Doka-only (`admin.mo` 249–256). `DEFAULT_CHALLENGES` is `{ doka, xp, badge }` (`challengeCompletion.ts` 44–109). |
| No spell rollback | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist. Spell Save is a live overwrite (`main.mo` 869–880). |
| Bar persist | `setSpellBarOrder` keeps only `spellLevelKeys` (`main.mo` 1938–1947). |
| Three boss kit sources | Live `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 357–379); Admin chips `getSpellConfigs()` (`AdminDashboard.tsx` 7590–7730). |
| EOP | New stables need a **later** `YYYYMMDD_*.mo` after `20260901_000000`. Never edit a shipped `NewActor`. |

Editor honesty already on the catalog strip (`AdminDashboard.tsx` 3641–3644): summon controls missing; Swap/Barrier/Trap/DoT/buff flags drop on reload; `minLevel` is not hydrate. Keep that until 09-23-005 round-trips.

---

## 3. Queue hazards new since 09-23 (do not treat as landed)

Oldest-first merge order still starts at **#327**, then **#331**, then **#333+**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name. Do **not** touch `AdminDashboard.tsx` / `WorldExploration.tsx` / `adminSafety.ts` in this docs PR.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#473](https://github.com/Mr-Melic/stralt/pull/473) | 09-23 SDA docs (`SPELL_ADMIN_DESIGN_2026-09-23.md` + `ACTION_IDS_SDA_2026-09-23.md`) | Do not rewrite those two files. 09-23-001…028 remain the first-cuts. |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) / [#398](https://github.com/Mr-Melic/stralt/pull/398) | 09-21 / 09-22 SDA docs | Do not rewrite those files. |
| **main** + [#454](https://github.com/Mr-Melic/stralt/pull/454) / [#503](https://github.com/Mr-Melic/stralt/pull/503) | `WF-SPL-RUNE_BEARER` / `GRIMOIRE_STALKER` / `LOANER_MAGE` already on HEAD; wave-7 adds steal-and-disarm page thief + no-paid-AP-spell | Map-scoped attune/loan is legal. Drawing the pool from every `usableByEnemy` row is not ownership and is not `ENEMY_DISCOVERY` (029, 038). |
| [#480](https://github.com/Mr-Melic/stralt/pull/480) | Wave-6 SDE (`generationMin: 6` unique ids + stamps) | Honour stamps. Do not pre-own Wave-6 ids. Do not restamp Wave-1…5 doors (031). Extends 09-23-026. |
| [#474](https://github.com/Mr-Melic/stralt/pull/474) | Wave-7 boss sheets (`BOSS_AND_SPELL_DISCOVERY.md`, `mill_seneschal` … `levy_rector` doors) | Unique boss ids stay unowned until the named `BOSS` route. Do not grow a fifth kit source (030). Extends 09-23-028. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) | New `engine/bossKitSpell.ts` (aim off the boss tile) | Keep the extract. It is **not** a fourth `spellPoolIds` list (032). |
| [#496](https://github.com/Mr-Melic/stralt/pull/496) | `playerSpecialCast.ts` resolves Timestep/Mirror on the highlighted self tile | Live combat now depends on `isTimestep` / `isMirror` that Admin cannot persist (033 / 09-23-005). |
| [#486](https://github.com/Mr-Melic/stralt/pull/486) | `summonSpawn.ts` dump occupancy | Union one `spawnSummonUnit`. Do not concatenate a second hunter/name fallback (034 / 09-23-002). |
| [#485](https://github.com/Mr-Melic/stralt/pull/485) | World toast copy “Feat Unlocked” | Feat chrome only. Discovery stays `TECHNIQUE OBSERVED` + root recap `NEW SPELL DISCOVERED` (035). |
| [#491](https://github.com/Mr-Melic/stralt/pull/491) | Challenge Doka on the immediate victory recap | Same recap object. Add `discoveredSpells` there — do not open a second recap (035 / 09-23-009). |
| [#490](https://github.com/Mr-Melic/stralt/pull/490) | BuffShop / feat counters keyed by II principal | Observation / owned maps are caller Principal + slot, same as `getPlayerAchievements(identity.getPrincipal())` (036). |
| [#488](https://github.com/Mr-Melic/stralt/pull/488) / [#493](https://github.com/Mr-Melic/stralt/pull/493) / [#499](https://github.com/Mr-Melic/stralt/pull/499) | Skip `saveBattleStats` wipe after unseeded feat / one-shot / victory keep | Grant writers stay `recordSpellObservation` / `commitSpellDiscoveries` / `unlockOwnedSpell` on the persist lock. Do not piggy-back `saveBattleStats` (036). |
| [#470](https://github.com/Mr-Melic/stralt/pull/470) | `adminOwnerUx.ts` + AdminDashboard live name-pool / Boss Rush confirm | 09-23-027 missed this sibling (created 00:20Z, four minutes before #473). Union; one SpellEditor (037). |
| [#506](https://github.com/Mr-Melic/stralt/pull/506) | 09-24 enemy AI evolution (docs) | Dependency view includes AI modules. New `aiHint` keys never fall back to `summon.name` (09-23-008 still owns the heuristic ban). |
| [#507](https://github.com/Mr-Melic/stralt/pull/507) | 09-24 enemy/boss admin re-audit (docs) | Same class as #449. One kit list with 09-23-011 / 028 / 030 (039). |
| [#512](https://github.com/Mr-Melic/stralt/pull/512) | `adminSafety.spellTargeting.ts` + Motoko range/`hitTiles` offset caps | Honour the clamp. Do not add a second copy. Remaining 09-23-006 is still AP 0 + `targetType` (040). |

WX / AdminDashboard / `adminSafety.ts` / `summonSpawn.ts` / `spellEngine.ts` / `worldFeatures.ts` are the overlap set. Concatenating two copies of the same helper fails `vite build`.

---

## 4. World-feature attune is not acquisition (missed on 09-23)

Already on HEAD, unwired as overlay data:

| Id | What it offers | Persist rule in the catalog text |
| :--- | :--- | :--- |
| `WF-SPL-RUNE_BEARER` | 1–3 extra `usableByEnemy` ids; on death, attune **one** for the rest of this map | Does not call `upgradeSpell`; does not persist `spellLevel` arrays (`worldFeatures.ts` 511–539) |
| `WF-SPL-GRIMOIRE_STALKER` | 1 extra id; on death, **one remaining cast** this map | Same (`1071–1089`) |
| `WF-SPL-LOANER_MAGE` | 1 AP adjacent loans the same one-cast without the kill | Same (`1550–1568`). Loan is AP, not a spell. |

#503 wave-7 adds a steal-and-disarm page thief and a no-paid-AP-spell event on the same `worldFeatures.ts` file.

**Required owner rule** when any of these overlays land:

1. The borrowed id is a **map-scoped combat buff**, not `ownedSpellIds`. Reload / portal / death drops it.
2. The pool is `PLAYER_LEARNABLE && usableByEnemy && lifecycle=active`, **ids only**. `usableByEnemy === true` includes `ENEMY_ONLY` / `BOSS_ONLY` / unpublished Admin drafts.
3. Attune does not observe, does not commit discovery, and does not call `upgradeSpell` / `updateCharacter`.
4. A later observe→win on a different encounter can still unlock the same id through 09-23-009. Attune is not a shortcut around victory.
5. Do not mint a catalog id from the feature name (`Rune Bearer`, `Page Thief`).

---

## 5. Single recap, single grant funnel (still)

Unchanged from 08-31 §4 and Wave-1 SDE:

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

#485 and #491 make the recap / toast family busier. Discovery still has **one** player-facing unlock card: `NEW SPELL DISCOVERED` on root `PostBattleRecap`. In-battle observe stays the existing toast family (`TECHNIQUE OBSERVED`), not “Feat Unlocked”. `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds`.

`upgradeSpell` is never the grant writer (09-23-023). World-feature attune is never the grant writer (029).

---

## 6. Owner UI (unchanged studio; restack grew)

Live tabs (`AdminDashboard.tsx` 5610–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing: Library, Discovery, Kits, Feats-as-graph, Graph, Versions.

09-23-015 still extracts `SpellEditor` rather than appending. Restack-union list for that extract is now 09-23-027 **plus** #470 (037). Do not grow WX. Carved-stone / slate / crimson. Same `#admin` + lazy gate.

---

## 7. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 §9:

- 09-01-002 **LANDED** (bindgen summon).
- Empty-AI half of 09-02-006 **LANDED**.
- 08-31-005 / 09-01-001 remain **PARTIAL / WRONG FIELD** (`usableByPlayer=false`).
- Everything else **OPEN**.
- 09-21 / 09-22 / 09-23 docs unmerged. **09-23-001 … 020** are the same first-cuts as 09-22-00N. **09-23-021 … 028** are yesterday’s queue-union IDs. **09-24-029 … 040** are this run.

**Next implementer:** **09-23-001** (lifecycle), then **09-23-007** (live Strike missing from kits), then **09-23-003 + 023** (hydrate **and** `upgradeSpell` grant). Persist `targetType` + complete summon def before player-facing unlock UX. Honour 09-23-016 for any new stable. Honour 09-23-017–028 and 09-24-029–040 when those siblings land — union, do not concatenate. Do not land WDD attune (029) before 003.

---

## 8. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-N spell cards, boss sheets, or `WORLD_FEATURES` overlays
- Treating `adminSafety.ts` / `#400` / `#466` / `#503` helpers as the finished lifecycle
- Re-opening 09-01-002 bindgen work or the empty-AI Motoko reject
- Overwriting #353 / #398 / #473 files
- Editing Cursor dashboard prompts (no write API)

---

## 9. ACTION_ID index

**First-cuts (do not re-implement):** `SDA-2026-09-23-001` … `028` on [#473](https://github.com/Mr-Melic/stralt/pull/473).

**This run** — all `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-24.md`](./ACTION_IDS_SDA_2026-09-24.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-24-029 | Fence WDD attune/loan from `ownedSpellIds`; pool is `PLAYER_LEARNABLE` | P0 |
| SDA-2026-09-24-030 | Wave-7 boss unique ids stay unowned; do not grow a fifth kit source | P1 |
| SDA-2026-09-24-031 | Honour #480 Wave-6 SDE stamps; do not pre-own `generationMin: 6` ids | P1 |
| SDA-2026-09-24-032 | Union #498 `bossKitSpell`; aim helper is not a kit catalog | P1 |
| SDA-2026-09-24-033 | Union #496 Timestep/Mirror self-tile; persist mechanic flags | P0 |
| SDA-2026-09-24-034 | Union #486 summon dump occupancy; one `spawnSummonUnit` | P1 |
| SDA-2026-09-24-035 | Single recap: honour #485 / #491; `discoveredSpells` on `BattleRecapData` | P0 |
| SDA-2026-09-24-036 | Observation is II principal + slot on the persist lock | P0 |
| SDA-2026-09-24-037 | Union #470 `adminOwnerUx`; one SpellEditor extract | P1 |
| SDA-2026-09-24-038 | Wave-7 WDD overlays are not `SYSTEM_ONLY` grants | P1 |
| SDA-2026-09-24-039 | One boss-kit id list with #507; do not grow a fifth source | P1 |
| SDA-2026-09-24-040 | Union #512 range/`hitTiles` caps; remaining activate-gate is AP 0 + `targetType` | P1 |

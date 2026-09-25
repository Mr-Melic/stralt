# Spell, Discovery & Achievement Admin Design — 2026-09-25 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-25  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). 09-23 lives on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473). 09-24 lives on unmerged [#515](https://github.com/Mr-Melic/stralt/pull/515). **Do not overwrite those files.**

**Live Motoko / client / catalog at `0f5363f` is unchanged since 09-21.** Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist. Treat **09-23-001 … 028 as the current first-cuts** and **09-24-029 … 040 as yesterday’s queue-union IDs** — do not implement a second 09-25 copy of those IDs.

What changed is the **oldest-first queue after #515** (created 2026-09-24T00:18Z). Sibling PRs are about to: split Admin range into three helper modules (`spellTargeting` vs `spellLegacyRange` vs live `validateSpellConfig`); make Swap / Mark / Weaken / Slow / damage+`debuffStat` **live combat** that Admin still cannot persist; stamp Wave-7 tactical + SDE ids and Wave-8 boss/elite paper onto the same 32-id pre-owned catalog. Those are new hazards on the same HEAD.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-25.md`](./ACTION_IDS_SDA_2026-09-25.md) (`SDA-2026-09-25-041` … `055`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

09-24 already recorded WDD attune/loan (`WF-SPL-RUNE_BEARER` / `GRIMOIRE_STALKER` / `LOANER_MAGE`), Wave-7 boss sheets, Wave-6 SDE, `bossKitSpell` as an aim helper, Timestep/Mirror self-tile, and #512 range/`hitTiles` caps.

It did **not** see:

- [#549](https://github.com/Mr-Melic/stralt/pull/549) `spellLegacyRangeRejected` (`range` must not exceed `maxRange`) — a **second** range helper next to #512’s `spellTargetingRejected` (`range ≤ 20`, `hitTiles` ±20).
- [#539](https://github.com/Mr-Melic/stralt/pull/539) restacking `AdminConfirmDialog` / `adminLivePublish` / `adminOwnerUx` **and** carrying `adminSafety.spellTargeting.ts` onto AdminDashboard.
- Combat PRs that make mechanic flags a **runtime dependency**: [#541](https://github.com/Mr-Melic/stralt/pull/541) Swap live tile, [#551](https://github.com/Mr-Melic/stralt/pull/551) Mark on empty tiles, [#528](https://github.com/Mr-Melic/stralt/pull/528) Weaken/Slow, [#555](https://github.com/Mr-Melic/stralt/pull/555) advertised `debuffStat` after damage, [#550](https://github.com/Mr-Melic/stralt/pull/550) Wisp Blood Mend kit heal.
- Wave-7/8 paper: [#525](https://github.com/Mr-Melic/stralt/pull/525) tactical ids, [#533](https://github.com/Mr-Melic/stralt/pull/533) SDE `generationMin: 7`, [#518](https://github.com/Mr-Melic/stralt/pull/518) Wave-8 bosses, [#558](https://github.com/Mr-Melic/stralt/pull/558) Wave-8 elite families.

If an implementer unions those as `starterSpells` with `isBaseSpell: true`, or concatenates three range validators into `adminSafety.ts`, the studio gets worse: everyone owns Wave-7 paper, and Caffeine `vite build` fails on duplicate `export function`.

The 08-31 contract is still the destination. The 09-23 IDs are still the first cuts. This run only adds queue-union IDs. Do not extend the `usableByPlayer=false` retire path.

---

## 2. Current state (pointer — same HEAD as 09-23 / 09-24)

Re-read against `origin/main` @ `0f5363f`. Line numbers match [`SPELL_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/473) §2. Do not rediscover bindgen summon (09-01-002 **LANDED**) or the empty-`summonAI` Motoko reject (empty-AI half of 09-02-006 **LANDED**).

Still true, and still the studio:

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. |
| Acquisition + three flags | Only `usableByPlayer` / `usableByEnemy` (`src/backend/types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| `minLevel` is a fake unlock | Documented as unlock (`admin.mo` 119); CatalogNote admits it is not enforced at hydrate (`AdminDashboard.tsx` 3644). Paid `upgradeSpell` appends any usable catalog id (`main.mo` 1008–1014). |
| Enemy pools / zone NaN | `ENEMY_KITS` (`enemyAI.ts` 163–185); `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). LevelZone is an object so `Math.floor` is `NaN`. |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches name **and** id (WX 2356–2389), including live `physical_attack` and display name `Inferno` (live `spell-inferno` at `spellData.ts` 502). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. `inferSummonArchetype` name fallback (`enemyAI.ts` 218–224). Runtime still `spell.summonAI \|\| "hunter"` (139). Editor “Heal (targets self)” (`AdminDashboard.tsx` 2685) infers targeting from `spellType`. |
| Strike purged + tombstoned | `OLD_SPELL_IDS` includes `physical_attack` (`main.mo` 689–697). Zone-0 pawn/knight/rook kits resolve empty unless summoner extras append wolf/archer. |
| Retire = cast gate | `adminDeleteSpellConfig` (`main.mo` 882–902) writes `usableByPlayer=false` or `remove`. Confirm copy still claims immediate remove (`AdminDashboard.tsx` 3791–3795). Toast is `"Spell deleted"` (6166). `_spellReferencedByPlayers` (273–284) is keys+bar only. |
| Feats / challenges | `AchievementConfig` is Doka-only (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is a 15-key whitelist (`adminSafety.ts` 306–322). |
| No spell rollback | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist. Spell Save is a live overwrite (`main.mo` 869–880). Landing is `useSpellQueries.ts`. |
| Bar persist | `setSpellBarOrder` keeps only `spellLevelKeys` (`main.mo` 1938–1947). |
| Three boss kit sources | Live `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 357–379); Admin chips `getSpellConfigs()`. |
| Thin summon persist | Motoko `SummonUnitDef` is `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). Bindgen matches Motoko (`backend.ts` 118–152). |
| Activate gate vs AP 0 | Client `validateSpellConfig` still rejects `apCost < 1` (`adminSafety.ts` 604–606). Motoko the same (`adminGuard.mo` 380–382). Editor exposes `isTimestep` (3434) but cannot save AP 0. `targetType` has **zero** editor matches. Spell Type `<select>` is still damage/heal/drain (2684–2687) even though validators accept `summon`. |
| EOP | New stables need a **later** `YYYYMMDD_*.mo` after `20260901_000000`. Never edit a shipped `NewActor`. `check-limit = 5`. |

CatalogNote already on the catalog strip (`AdminDashboard.tsx` 3641–3644): summon controls missing; Swap/Barrier/Trap/DoT/buff flags drop on reload; `minLevel` is not hydrate. Keep that until 09-23-005 round-trips.

---

## 3. Queue hazards new since 09-24 (do not treat as landed)

Oldest-first merge order still starts at **#327**, then **#331**, then **#333+**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name. Do **not** touch `AdminDashboard.tsx` / `WorldExploration.tsx` / `adminSafety.ts` / `adminGuard.mo` / `main.mo` in this docs PR.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#515](https://github.com/Mr-Melic/stralt/pull/515) | 09-24 SDA docs (`029` … `040`) | Do not rewrite those two files. |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) / [#398](https://github.com/Mr-Melic/stralt/pull/398) / [#473](https://github.com/Mr-Melic/stralt/pull/473) | 09-21 / 09-22 / 09-23 SDA docs | Do not rewrite those files. 09-23-001…028 remain the first-cuts. |
| [#512](https://github.com/Mr-Melic/stralt/pull/512) | `adminSafety.spellTargeting.ts` + Motoko `range > 20` / `hitTiles` ±20 | Keep one targeting helper (09-24-040). |
| [#549](https://github.com/Mr-Melic/stralt/pull/549) | `adminSafety.spellLegacyRange.ts` + Motoko `range > maxRange` (enemy AI uses `Number(spell.range)`; player clicks use `maxRange`) | Second clamp, not a second `validateSpellConfig`. Compose with #512 (041). Grandfather `reflect_barrier` `range=1` / `maxRange=0` only. |
| [#539](https://github.com/Mr-Melic/stralt/pull/539) | `AdminConfirmDialog` + `adminLivePublish` + `adminOwnerUx` **and** carries `spellTargeting.ts` onto AdminDashboard | One confirm path. One targeting helper. Do not treat live-publish confirm as lifecycle (049 / 09-23-001). |
| [#531](https://github.com/Mr-Melic/stralt/pull/531) | AdminDashboard Visuals palette copy | Union; one SpellEditor extract (049 / 09-23-027 / 09-24-037). |
| [#518](https://github.com/Mr-Melic/stralt/pull/518) | Wave-8 boss sheets (`gaze_beadle` … `lintel_sacrist`; spectacular `NAVE_GAZE` / `DOUBLE_SPAN` / `CHOIR_COVER` / `NAVE_LINTEL` stay `BOSS_ONLY`) | Unique / spectacular ids stay unowned. Do not grow a fifth kit source (042 / 09-24-030). |
| [#525](https://github.com/Mr-Melic/stralt/pull/525) | Wave-7 tactical proposals (16 reserved ids; `spell-triple-span` / `spell-cadence-crack` / `spell-shove-face` / `spell-court-shove`) | Stamp, do not clone into `starterSpells` (044). |
| [#533](https://github.com/Mr-Melic/stralt/pull/533) | Wave-7 SDE (`generationMin: 7`; Pack Still `ENEMY_ONLY`; File Fold `BOSS_ONLY` on `file_regent`) | Honour stamps. Do not pre-own (043 / 09-24-031). |
| [#558](https://github.com/Mr-Melic/stralt/pull/558) | Wave-8 elite families consuming Wave-7 verbs as CORE | Admin-authored CORE–SIGNATURE pools (050 / 09-23-010). Not a fourth `ENEMY_KITS`. |
| [#528](https://github.com/Mr-Melic/stralt/pull/528) | `playerStatusCast.ts` — Weaken/Slow apply catalog `debuffStat` | Persist statuses with 09-23-005 (045). Never key Weaken off `spell.name`. |
| [#555](https://github.com/Mr-Melic/stralt/pull/555) | `playerDamageDebuff.ts` — Frost Bolt / Nova / Cursed Wound / … apply `debuffStat` after damage | Same persist slice. Do not concatenate a second `applyEffect` (045). |
| [#551](https://github.com/Mr-Melic/stralt/pull/551) | Mark resolves on highlighted empty tiles (`isMark`) | Persist `isMark` + `targetType` (045 / 09-24-033). |
| [#541](https://github.com/Mr-Melic/stralt/pull/541) | Swap uses live tile + aborts leftover walk (`swapTeleport.ts`) | Persist `isSwap` (046). Keep one extract. |
| [#550](https://github.com/Mr-Melic/stralt/pull/550) | `kitHealAfterBuff` — Wisp Blood Mend / Rallying Cry heal after `buffStat` return | Kit heal is metadata (`healAmount` + `buffStat`), not `includes("Blood Mend")` (047). Overlaps WX. |
| [#544](https://github.com/Mr-Melic/stralt/pull/544) / [#546](https://github.com/Mr-Melic/stralt/pull/546) / [#547](https://github.com/Mr-Melic/stralt/pull/547) / [#554](https://github.com/Mr-Melic/stralt/pull/554) | Leftover-walk abort (summon spawn, last hostile, fight start, Death Realm) | Extract; do not grow WX. One `spawnSummonUnit` with 09-24-034 (048). |
| [#526](https://github.com/Mr-Melic/stralt/pull/526) | `AchievementToast.tsx` a11y | Feat chrome only. Discovery stays on root recap (051 / 09-24-035). |
| [#532](https://github.com/Mr-Melic/stralt/pull/532) / [#540](https://github.com/Mr-Melic/stralt/pull/540) / [#545](https://github.com/Mr-Melic/stralt/pull/545) / [#552](https://github.com/Mr-Melic/stralt/pull/552) | More `saveBattleStats` skip-after-keep paths (portal / GameKey) | Observation still does not ride `saveBattleStats` (052 / 09-24-036). |
| [#536](https://github.com/Mr-Melic/stralt/pull/536) | Boss Rush jackpot `complete(9)` before abort | Overlaps WX. Do not add discovery writers there (048). |
| [#561](https://github.com/Mr-Melic/stralt/pull/561) | 09-25 enemy/boss admin re-audit (docs; consumes EBA IDs) | One kit list with 09-23-011 / 028 / 09-24-030 / 042. Do not implement kits twice. |
| [#563](https://github.com/Mr-Melic/stralt/pull/563) | Wave-8 tactical proposals (`spell-gait-mend` / `spell-pair-hinge` / `spell-cadence-flush`, …) | Stamp, do not clone into `starterSpells` (054 / 044). |
| [#564](https://github.com/Mr-Melic/stralt/pull/564) | `SpellSummonFields` + `adminOwnerUx.summon.ts` (AI, lifespan, piece, scales). Save is still live overwrite. No `displayName` / `summonKit` / `targetType`. | Keep one summon section. 09-23-002 still owns persist. Do not treat the new copy as draft/activate (053). |
| [#568](https://github.com/Mr-Melic/stralt/pull/568) | `spellAxisFlagsRejected` — Linear and Diagonal together leave no legal tile | Third clamp next to #512 / #549. Compose, do not concatenate (055 / 041). |

WX / AdminDashboard / `adminSafety.ts` / `adminGuard.mo` / `main.mo` / `summonSpawn.ts` / `spellEngine.ts` / `worldFeatures.ts` / `adminOwnerUx.ts` are the overlap set. Concatenating two copies of the same helper fails `vite build`.

---

## 4. Two range helpers, one enemy-AI field, still no `targetType`

#512 and #549 are both **correct** and **different**:

| Clamp | PR | What it stops |
| :--- | :--- | :--- |
| `range > 20` or any `hitTiles` offset outside ±20 | #512 `spellTargetingRejected` | Map-wide hostile range / unbounded AoE from Admin Range StatRow. |
| `range > maxRange` (except shipped `reflect_barrier` `range=1` / `maxRange=0`) | #549 `spellLegacyRangeRejected` | Enemy AI reads `Number(spell.range)` from the backend catalog; player clicks use `spellRangeBase → maxRange`. `range=10` with `maxRange=3` lets hostiles outrange the player. |

#539 already restacks `adminSafety.spellTargeting.ts` onto AdminDashboard. A studio implementer who inlines both clamps into `validateSpellConfig` **and** keeps the standalone modules ships three `export function` copies.

Required owner rule:

1. Keep **one** client module per clamp (or compose both into a single `spellRangeRejected` that calls both predicates once). Do not paste the bodies into `adminSafety.ts`.
2. Motoko stays authoritative (`adminSetSpellConfig` already sequences Guard calls). Client mirrors must return the **same strings**.
3. Remaining 09-23-006 is still **AP 0** (`isTimestep` / `allowZeroAp`) and **required `targetType`**. Range caps do not replace that gate.
4. Activate still requires `minRange ≤ maxRange ≤ 20`. Legacy `range` is not a targeting type.
5. [#568](https://github.com/Mr-Melic/stralt/pull/568) `spellAxisFlagsRejected` is a **third** clamp (Linear ⊕ Diagonal). Keep it as its own helper. Remaining 09-23-006 is still AP 0 + `targetType`.

Do not “fix” enemy outrange by matching `spell.name`.

---

## 5. Combat now depends on flags Admin cannot persist

09-24-033 already said Timestep/Mirror self-tile makes `isTimestep` / `isMirror` a live combat dependency. After #515 the same class grew:

| Flag / field | Live consumer (open PR) | Admin today |
| :--- | :--- | :--- |
| `isTimestep` / `isMirror` | #496 `playerSpecialCast.ts` | Editor toggle for Timestep; drops on reload (CatalogNote 3641–3644). AP 0 illegal. |
| `isSwap` | #541 `swapTeleport.ts` | Frontend-only; Motoko `SpellConfig` (`admin.mo` 92–127) omits it. |
| `isMark` | #551 empty-tile Mark | Same. |
| `debuffStat` / duration | #528 Weaken/Slow; #555 Frost Bolt / Nova / Cursed Wound / … | Editor has buff/debuff inputs; they do not survive `toBackendSpellConfig`. |
| `healAmount` after `buffStat` | #550 `kitHealAfterBuff` (Wisp Blood Mend / Rallying Cry) | Summon kit heals are combat frontend fields. Motoko unit def has no kit. |

`spellEngine.ts` 6–13 still documents that combat reads the **frontend** fields. Saving from Admin today: mechanic flags vanish; `targetType` is never collected; Spell Type still says “Heal (targets self)” without a `targetType` control.

09-23-005 remains the persist slice. 041–046 do not re-specify it; they forbid restacking combat extracts as a **second** metadata source (`playerStatusCast` is not a kit catalog; `swapTeleport` is not a `SpellConfig`).

Never key Swap / Mark / Weaken / Blood Mend off `spell.name`.

---

## 6. Wave-7 / Wave-8 paper must not enter the 32-id grant

Hydrate still grants every `starterSpells` row (`WorldExploration.tsx` 2395–2408). Copying any of the following into that array with `isBaseSpell: true` pre-owns content the 08-31 contract stamps as `ENEMY_DISCOVERY` / `BOSS` / `BOSS_ONLY` / `ENEMY_ONLY`:

- #525 Wave-7 tactical reserved ids (`spell-triple-span`, `spell-cadence-crack`, `spell-shove-face`, kit-only `spell-court-shove`, …).
- #533 Wave-7 SDE unique ids (`generationMin: 7`): Pack Still is `ENEMY_ONLY`; File Fold is `BOSS_ONLY` on `file_regent`. Leftover challenge MULTI doors Thin Ward ← `hard_1`, Clean Blood ← `legendary_1` — still never `unstoppable` / `level_10`.
- #518 Wave-8 spectaculars `NAVE_GAZE` / `DOUBLE_SPAN` / `CHOIR_COVER` / `NAVE_LINTEL` stay `BOSS_ONLY`. Player doors reuse existing #411 ids only.
- #563 Wave-8 tactical reserved ids (`spell-gait-mend`, `spell-pair-hinge`, `spell-cadence-flush`, Court Hinge). Same unowned rule as #525.
- #558 Wave-8 elite families consume those verbs as CORE. That is a **kit stamp**, not an ownership grant.

Innate seed remains the four ids in 09-23-003 (`physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`) once 007 seeds the canister. Do not restamp Wave-1…6 doors. If a Wave-8 SDE PR opens later today, the same unowned rule applies — do not invent a fifth copy of 018/026/031/043.

`ENEMY_ONLY` / `BOSS_ONLY`: `PLAYER_LEARNABLE = false`, `usableByEnemy = true`, `lifecycle = active`. Setting `usableByPlayer = false` on those ids is **correct as a cast gate** and **wrong as the only retire signal**.

---

## 7. Single recap, single grant funnel (still)

Unchanged from 08-31 §4 and Wave-1 SDE:

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Routes: `ENEMY_DISCOVERY` | `ACHIEVEMENT` | `CHALLENGE` | `BOSS` | `ELITE` | `SPECIAL_ENCOUNTER` | `MULTI_SOURCE` | `ENEMY_ONLY` | `BOSS_ONLY` | `SYSTEM_ONLY`.

Flags on every definition: `OBSERVATION_REQUIRED`, `VICTORY_REQUIRED`, `PLAYER_LEARNABLE`.

Pools: `CORE` | `ADVANCED` | `RARE` | `ELITE` | `SIGNATURE`.

#526 makes feat toast a11y-busier. Discovery still has **one** player-facing unlock card: `NEW SPELL DISCOVERED` on root `PostBattleRecap`. In-battle observe stays `TECHNIQUE OBSERVED`. `upgradeSpell` is never the grant writer (09-23-023). World-feature attune is never the grant writer (09-24-029). `saveBattleStats` still never mints and still ignores spell-level arrays — later skip-after-keep PRs (#532/#540/#545/#552) do not become a grant path (052).

Possession is not observation. Player-side summons do not observe. Hostile summons may.

---

## 8. Owner UI (unchanged studio; restack grew again)

Live tabs (`AdminDashboard.tsx` 5610–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing: Library, Discovery, Kits, Feats-as-graph, Graph, Versions.

09-23-015 still extracts `SpellEditor` rather than appending. Restack-union list for that extract is now 09-23-027 **plus** 09-24-037 (#470) **plus** #539 / #531 (049) **plus** #564 `SpellSummonFields` (053). Do not grow WX. Carved-stone / slate / crimson. Same `#admin` + lazy gate.

#564 is **not** the studio. It adds summon AI / lifespan / piece / scales to the live editor. Save is still a live overwrite (CatalogNote on that section says so). It does **not** add `displayName`, `summonKit`, AP/MP, `targetType`, acquisition, or lifecycle. Keep those controls; do not concatenate a second summon section; do not treat “Live catalog” copy as draft/activate (09-23-013).

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, `range > maxRange`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Drop “Heal (targets self)”. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.

---

## 9. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-24 §7 / 09-23 §9:

- 09-01-002 **LANDED** (bindgen summon).
- Empty-AI half of 09-02-006 **LANDED**.
- 08-31-005 / 09-01-001 remain **PARTIAL / WRONG FIELD** (`usableByPlayer=false`).
- Everything else **OPEN**.
- 09-21 / 09-22 / 09-23 / 09-24 docs unmerged. **09-23-001 … 020** are the same first-cuts as 09-22-00N. **09-23-021 … 028** and **09-24-029 … 040** are prior queue-union IDs. **09-25-041 … 055** are this run.

**Next implementer:** **09-23-001** (lifecycle), then **09-23-007** (live Strike missing from kits), then **09-23-003 + 023** (hydrate **and** `upgradeSpell` grant). Persist `targetType` + complete summon def before player-facing unlock UX. Honour 09-23-016 for any new stable. Honour 09-23-017–028, 09-24-029–040, and 09-25-041–055 when those siblings land — union, do not concatenate. Do not land WDD attune (029) before 003. Do not land Wave-7/8 catalog rows before 003.

---

## 10. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-N spell cards, boss sheets, elite families, or `WORLD_FEATURES` overlays
- Treating `adminSafety.ts` / `#400` / `#466` / `#512` / `#549` helpers as the finished lifecycle
- Re-opening 09-01-002 bindgen work or the empty-AI Motoko reject
- Overwriting #353 / #398 / #473 / #515 files
- Editing Cursor dashboard prompts (no write API)

---

## 11. ACTION_ID index

**First-cuts (do not re-implement):** `SDA-2026-09-23-001` … `028` on [#473](https://github.com/Mr-Melic/stralt/pull/473).

**Prior queue-union (do not re-implement):** `SDA-2026-09-24-029` … `040` on [#515](https://github.com/Mr-Melic/stralt/pull/515).

**This run** — all `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-25.md`](./ACTION_IDS_SDA_2026-09-25.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-25-041 | Compose #512 targeting caps with #549 `range > maxRange`; remaining activate-gate is AP 0 + `targetType` | P0 |
| SDA-2026-09-25-042 | Wave-8 boss spectacular ids stay `BOSS_ONLY`; do not grow a fifth kit source | P1 |
| SDA-2026-09-25-043 | Honour #533 Wave-7 SDE stamps; do not pre-own `generationMin: 7` ids | P1 |
| SDA-2026-09-25-044 | Honour #525 Wave-7 tactical ids; stamp, do not clone into `starterSpells` | P1 |
| SDA-2026-09-25-045 | Persist advertised statuses: union Weaken/Slow, Mark, damage+`debuffStat` | P0 |
| SDA-2026-09-25-046 | Persist `isSwap`; union #541 live-tile Swap extract | P0 |
| SDA-2026-09-25-047 | Union #550 kit heal-after-buff; never name-match Blood Mend | P1 |
| SDA-2026-09-25-048 | Union leftover-walk / summon-spawn WX siblings; do not grow WX | P1 |
| SDA-2026-09-25-049 | Union #539 live-publish confirm + #531 Visuals; one SpellEditor | P1 |
| SDA-2026-09-25-050 | Wave-8 elite families are CORE stamps, not a fourth `ENEMY_KITS` | P1 |
| SDA-2026-09-25-051 | Union #526 feat-toast a11y; discovery stays on the root recap | P1 |
| SDA-2026-09-25-052 | Later `saveBattleStats` skip-after-keep PRs are not a grant path | P0 |
| SDA-2026-09-25-053 | Union #564 `SpellSummonFields`; still missing `displayName` / kit / `targetType` | P1 |
| SDA-2026-09-25-054 | Honour #563 Wave-8 tactical ids; stamp, do not clone into `starterSpells` | P1 |
| SDA-2026-09-25-055 | Union #568 Linear ⊕ Diagonal clamp; do not concatenate with range helpers | P1 |

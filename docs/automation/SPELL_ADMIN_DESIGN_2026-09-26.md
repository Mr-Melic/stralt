# Spell, Discovery & Achievement Admin Design — 2026-09-26 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-26  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). 09-23 lives on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473). 09-24 lives on unmerged [#515](https://github.com/Mr-Melic/stralt/pull/515). 09-25 lives on unmerged [#570](https://github.com/Mr-Melic/stralt/pull/570). **Do not overwrite those files.**

**Live Motoko / client / catalog at `0f5363f` is unchanged since 09-21.** Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist. Treat **09-23-001 … 028 as the current first-cuts**, **09-24-029 … 040 as the 09-24 queue-union IDs**, and **09-25-041 … 055 as yesterday’s queue-union IDs** — do not implement a second 09-26 copy of those IDs.

What changed is the **oldest-first queue after #570** (created 2026-09-25T00:21Z). Sibling PRs are about to: stamp Wave-8 SDE (`generationMin: 8`) and Wave-9 boss sheets onto the same 32-id pre-owned catalog; keep 0-AP Timestep free under Arcane Surge while Admin still rejects `apCost < 1`; preserve feat/session caches across version wipe without a matching observed/owned key family; add more WDD attune/loan/glyph paper that must not call `upgradeSpell`; make ally-summon / occupant / Sacrifice / Haste-on-summon **live combat** that Admin still cannot persist.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-26.md`](./ACTION_IDS_SDA_2026-09-26.md) (`SDA-2026-09-26-056` … `068`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

09-25 already recorded dual range clamps (#512 / #549 / #568), Wave-7/8 tactical + SDE paper, live Swap / Mark / Weaken / `debuffStat`, leftover-walk WX cluster, and #564 `SpellSummonFields` as a live overwrite (not draft/activate).

It did **not** see:

- [#590](https://github.com/Mr-Melic/stralt/pull/590) Wave-8 SDE (`generationMin: 8`; Pack Tithe `ENEMY_ONLY`; About Hinge `BOSS_ONLY`; leftover `leader_slayer` / `spell_master` MULTI children).
- [#572](https://github.com/Mr-Melic/stralt/pull/572) Wave-9 boss sheets + Rush Table G (`toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean`).
- [#581](https://github.com/Mr-Melic/stralt/pull/581) `discountedApCostMinus1Min1` — Arcane Surge must not raise a 0-AP Timestep to 1.
- [#577](https://github.com/Mr-Melic/stralt/pull/577) version-gate keep for feat/session caches; `spellLevelArrayEvolve` alignment is **not** an ownership map.
- [#578](https://github.com/Mr-Melic/stralt/pull/578) / [#613](https://github.com/Mr-Melic/stralt/pull/613) WDD waves 8–9, including a death-tile **one-cast glyph that is not auto-grant**.
- Combat targeting / status PRs that make more frontend flags a runtime dependency: [#597](https://github.com/Mr-Melic/stralt/pull/597) Sentinel Shield on the clicked ally summon, [#601](https://github.com/Mr-Melic/stralt/pull/601) occupant-required kits, [#607](https://github.com/Mr-Melic/stralt/pull/607) Sacrifice occupant, [#596](https://github.com/Mr-Melic/stralt/pull/596) / [#598](https://github.com/Mr-Melic/stralt/pull/598) Haste/Slow on the live player and summon pools.
- Persist skip + Death Realm gates: [#580](https://github.com/Mr-Melic/stralt/pull/580) / [#599](https://github.com/Mr-Melic/stralt/pull/599) seeded keep; [#602](https://github.com/Mr-Melic/stralt/pull/602) skip `upgradeSpell` while Death Realm pending; [#604](https://github.com/Mr-Melic/stralt/pull/604) skip feat claim; [#611](https://github.com/Mr-Melic/stralt/pull/611) recap `victoryPersistPending`.

If an implementer unions Wave-8 unique ids or Wave-9 spectaculars into `starterSpells` with `isBaseSpell: true`, or treats Arcane Surge’s “min 1” copy as the Timestep save rule, the studio gets worse: everyone owns G8 paper, and the only free player spell cannot be re-saved.

The 08-31 contract is still the destination. The 09-23 IDs are still the first cuts. This run only adds queue-union IDs. Do not extend the `usableByPlayer=false` retire path.

---

## 2. Current state (pointer — same HEAD as 09-23 / 09-24 / 09-25)

Re-read against `origin/main` @ `0f5363f`. Line numbers match [`SPELL_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/473) §2 and [`SPELL_ADMIN_DESIGN_2026-09-25.md`](https://github.com/Mr-Melic/stralt/pull/570) §2. Do not rediscover bindgen summon (09-01-002 **LANDED**) or the empty-`summonAI` Motoko reject (empty-AI half of 09-02-006 **LANDED**).

Still true, and still the studio:

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. `BattleRecapData` (`PostBattleRecap.tsx` 6–34) has no `discoveredSpells`. |
| Acquisition + three flags | Only `usableByPlayer` / `usableByEnemy` (`src/backend/types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| `minLevel` is a fake unlock | Documented as unlock (`admin.mo` 119); CatalogNote admits it is not enforced at hydrate (`AdminDashboard.tsx` 3644). Paid `upgradeSpell` appends any usable catalog id (`main.mo` 1008–1014). `void_collapse` still advertises `minLevel` 30 (`admin.mo` 190). |
| Enemy pools / zone NaN | `ENEMY_KITS` (`enemyAI.ts` 163–185); `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). LevelZone is an object so `Math.floor` is `NaN`. |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches name **and** id (WX 2356–2389), including live `physical_attack` and display name `Inferno` (live `spell-inferno` at `spellData.ts` 502). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Runtime still `spell.summonAI \|\| "hunter"` (139). Editor “Heal (targets self)” (`AdminDashboard.tsx` 2685) infers targeting from `spellType`. |
| Strike purged + tombstoned | `OLD_SPELL_IDS` includes `physical_attack` (`main.mo` 689–697). Zone-0 pawn/knight/rook kits resolve empty unless summoner extras append wolf/archer. |
| Retire = cast gate | `adminDeleteSpellConfig` (`main.mo` 882–902) writes `usableByPlayer=false` or `remove`. Confirm copy still claims immediate remove (`AdminDashboard.tsx` 3791–3795). Toast is `"Spell deleted"` (6166). `_spellReferencedByPlayers` (273–284) is keys+bar only. |
| Feats / challenges | `AchievementConfig` is Doka-only (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is a 15-key whitelist (`adminSafety.ts` 306–322). Leftover `leader_slayer` / `spell_master` are still Doka feats, not spell grants. |
| No spell rollback | `adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig` exist. Spell Save is a live overwrite (`main.mo` 869–880). Landing is `useSpellQueries.ts`. |
| Bar persist | `setSpellBarOrder` keeps only `spellLevelKeys` (`main.mo` 1938–1947). |
| Three boss kit sources | Live `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 357–379); Admin chips `getSpellConfigs()`. |
| Thin summon persist | Motoko `SummonUnitDef` is `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). Bindgen matches Motoko (`backend.ts` 118–152). |
| Activate gate vs AP 0 | Client `validateSpellConfig` still rejects `apCost < 1` (`adminSafety.ts` 604–606). Motoko the same (`adminGuard.mo` 380–382). Editor exposes `isTimestep` (3434) but cannot save AP 0. Live Timestep is `apCost: BigInt(0)` (`spellData.ts` 220–226). `targetType` has **zero** editor matches. Spell Type `<select>` is still damage/heal/drain (2684–2687) even though validators accept `summon`. |
| EOP | New stables need a **later** `YYYYMMDD_*.mo` after `20260901_000000`. Never edit a shipped `NewActor`. `check-limit = 5`. |

CatalogNote already on the catalog strip (`AdminDashboard.tsx` 3641–3644): summon controls missing on HEAD (open #564 adds AI/lifespan/piece/scales only); Swap/Barrier/Trap/DoT/buff flags drop on reload; `minLevel` is not hydrate. Keep that until 09-23-005 round-trips.

---

## 3. Queue hazards new since 09-25 (do not treat as landed)

Oldest-first merge order still starts at **#327**, then **#331**, then **#333+**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name. Do **not** touch `AdminDashboard.tsx` / `WorldExploration.tsx` / `adminSafety.ts` / `adminGuard.mo` / `main.mo` in this docs PR.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#570](https://github.com/Mr-Melic/stralt/pull/570) | 09-25 SDA docs (`041` … `055`) | Do not rewrite those two files. |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) / [#398](https://github.com/Mr-Melic/stralt/pull/398) / [#473](https://github.com/Mr-Melic/stralt/pull/473) / [#515](https://github.com/Mr-Melic/stralt/pull/515) | 09-21 … 09-24 SDA docs | Do not rewrite those files. 09-23-001…028 remain the first-cuts. |
| [#590](https://github.com/Mr-Melic/stralt/pull/590) | Wave-8 SDE (`generationMin: 8`; Pack Tithe `ENEMY_ONLY`; About Hinge `BOSS_ONLY`; leftover `leader_slayer` / `spell_master`) | Honour stamps. Do not pre-own (056 / 09-25-043). |
| [#572](https://github.com/Mr-Melic/stralt/pull/572) | Wave-9 sheets + Table G (`toll_ostiary` … `oath_dean`) | Spectaculars stay `BOSS_ONLY`. Do not grow a sixth kit source (057 / 09-25-042). |
| [#581](https://github.com/Mr-Melic/stralt/pull/581) | `discountedApCostMinus1Min1` — 0-AP Timestep stays 0 under Arcane Surge / Overflow | Persist AP 0 with 09-23-006. Do not save Timestep as AP 1 (058). |
| [#577](https://github.com/Mr-Melic/stralt/pull/577) | `versionGateFeatEvolve` keeps feat/shrine/covenant keys; `spellLevelArrayEvolve` refuses misaligned key/value arrays | Observed/owned maps need the same keep family. Alignment is not a grant (059). |
| [#578](https://github.com/Mr-Melic/stralt/pull/578) / [#613](https://github.com/Mr-Melic/stralt/pull/613) | WDD waves 8–9 (`WORLD_FEATURES` + tests). Wave 9 includes a death-tile one-cast glyph that is **not** auto-grant | Attune / loan / glyph never write `ownedSpellIds` (060 / 09-24-029). |
| [#597](https://github.com/Mr-Melic/stralt/pull/597) / [#601](https://github.com/Mr-Melic/stralt/pull/601) / [#607](https://github.com/Mr-Melic/stralt/pull/607) | Sentinel Shield clicked ally summon; occupant-required kits; Sacrifice occupant on the live gate | Persist `targetType` / occupant / `isSacrifice` with 09-23-005 (061). |
| [#596](https://github.com/Mr-Melic/stralt/pull/596) / [#598](https://github.com/Mr-Melic/stralt/pull/598) | Haste MP on the live player pool; Slow/Haste on the summon walk/cast pool | Persist statuses; one extract per name (062 / 09-25-045). |
| [#585](https://github.com/Mr-Melic/stralt/pull/585) | AdminDashboard Ground Doka / landing-ad labels | Union; one SpellEditor (063 / 09-25-049). |
| [#591](https://github.com/Mr-Melic/stralt/pull/591) | `enemyWander.ts` extracted from WX | Keep the extract. Do not grow WX for discovery (064). |
| [#606](https://github.com/Mr-Melic/stralt/pull/606) | Ignore new battle input after the last hostile dies | Union leftover-walk / last-hostile with 09-25-048 (064). |
| [#592](https://github.com/Mr-Melic/stralt/pull/592) | 44px summon End Turn and kit spell slots | Feat/summon chrome only. Kit slots are not ownership (065). |
| [#580](https://github.com/Mr-Melic/stralt/pull/580) / [#599](https://github.com/Mr-Melic/stralt/pull/599) | Seeded victory / portal `saveBattleStats` skip-after-keep | Observation still does not ride `saveBattleStats` (066 / 09-25-052). |
| [#602](https://github.com/Mr-Melic/stralt/pull/602) | Skip rename and **spell upgrade** while Death Realm is pending | Spend gate, not a grant writer (067 / 09-23-023). |
| [#604](https://github.com/Mr-Melic/stralt/pull/604) | Skip feat claim and GameKey redeem while Death Realm is pending | Feat chrome. Discovery stays on root recap (068). |
| [#611](https://github.com/Mr-Melic/stralt/pull/611) | Docs: recap `victoryPersistPending` gates | `NEW SPELL DISCOVERED` waits for the same persist (068). |
| [#605](https://github.com/Mr-Melic/stralt/pull/605) | `adminSafety.mapModifierIdentity` + Motoko id/type mismatch | Compose on `adminGuard.mo`. Do not concatenate into `validateSpellConfig` (063). |
| [#564](https://github.com/Mr-Melic/stralt/pull/564) / [#568](https://github.com/Mr-Melic/stralt/pull/568) / [#539](https://github.com/Mr-Melic/stralt/pull/539) | Still open from 09-25 | Honour 053 / 055 / 049. Do not recopy. |
| [#574](https://github.com/Mr-Melic/stralt/pull/574) | Face/Mute/Span/Brand encounter catalog | `SPECIAL_ENCOUNTER` stamps. Do not grant on the tag (056). |
| [#565](https://github.com/Mr-Melic/stralt/pull/565) | Enemy AI evolution increment (SYS/FUT honesty) | Hints, not grants. Never name-match (062). |

WX / AdminDashboard / `adminSafety.ts` / `adminGuard.mo` / `main.mo` / `summonSpawn.ts` / `spellEngine.ts` / `worldFeatures.ts` / `mapModifiers.ts` / `targeting.ts` are the overlap set. Concatenating two copies of the same helper fails `vite build`.

---

## 4. 0-AP Timestep is now a live modifier dependency

09-23-006 already required `allowZeroAp` / `isTimestep` because live Timestep is `apCost: 0` (`spellData.ts` 220) while both client and Motoko reject `apCost < 1`.

[#581](https://github.com/Mr-Melic/stralt/pull/581) makes that a **modifier** dependency: Arcane Surge / Overflow used `Math.max(1, base - 1)`, which **raised** a 0-AP catalog cost to 1 and gated empty-wallet preview / execute / Attack Nearest. The PR extracts `discountedApCostMinus1Min1` so `base === 0` stays 0.

Owner rule:

1. Activate / Save must accept AP 0 when `isTimestep` (or an explicit `allowZeroAp`) is set. Do not “fix” Timestep by writing AP 1 to satisfy the old floor.
2. Arcane Surge announce copy still says “min 1” for **paid** spells. That string is not the Timestep save rule.
3. Remaining 09-23-006 is still **required `targetType`**. Range clamps (#512 / #549 / #568) do not replace it.
4. Keep one `discountedApCostMinus1Min1`. Do not paste it into `validateSpellConfig`.

Never key Timestep off `spell.name`.

---

## 5. Combat now depends on more flags Admin cannot persist

09-25-045 / 046 already bound Weaken / Slow / Mark / `debuffStat` / `isSwap`. After #570 the same class grew:

| Flag / field | Live consumer (open PR) | Admin today |
| :--- | :--- | :--- |
| `isTimestep` + AP 0 | #581 Arcane Surge | Editor toggle; AP 0 illegal on Save; drops on reload. |
| `targetType=ally` on a summon | #597 Sentinel Shield → clicked ally summon | Spell Type still “Heal (targets self)”. No `targetType` control. |
| Occupant-required kits | #601 live gate share | Frontend-only. Motoko `SpellConfig` omits occupant / `freeCells` relationship to kit. |
| `isSacrifice` | #607 Sacrifice occupant on the live gate | Editor toggle (3434); drops on reload (CatalogNote 3641–3644). |
| Haste / Slow duration | #596 player pool; #598 summon walk/cast pool | Buff/debuff inputs do not survive `toBackendSpellConfig`. |

`spellEngine.ts` still documents that combat reads the **frontend** fields. Saving from Admin today: mechanic flags vanish; `targetType` is never collected.

09-23-005 remains the persist slice. 056–068 do not re-specify it; they forbid restacking combat extracts as a **second** metadata source (`kitAllyBuffTarget` is not a kit catalog; `playerSacrificeLive` is not a `SpellConfig`).

Never key Sentinel Shield / Sacrifice / Haste off `spell.name`.

---

## 6. Wave-8 SDE / Wave-9 bosses must not enter the 32-id grant

Hydrate still grants every `starterSpells` row (`WorldExploration.tsx` 2395–2408). Copying any of the following into that array with `isBaseSpell: true` pre-owns content the 08-31 contract stamps as `ENEMY_DISCOVERY` / `BOSS` / `BOSS_ONLY` / `ENEMY_ONLY` / `ACHIEVEMENT` / `SPECIAL_ENCOUNTER`:

- #590 Wave-8 unique ids (`generationMin: 8`). Pack Tithe is `ENEMY_ONLY`. About Hinge is `BOSS_ONLY` on `about_hinge_regent`. Leftover feat MULTI doors: Crown Cut ← `leader_slayer` (not also Coup de Grace); Full Bar ← `spell_master` (not also Overcast / Hex of Silence). `unstoppable` stays unused as a spell gate. `odd_gallery` is a MULTI observe+win room — not a hydrate grant.
- #572 Wave-9 spectaculars on `toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean` stay `BOSS_ONLY`. Player doors reuse existing ids only. Table G (`G0`–`G3`) is a new Rush namespace — not a catalog seed.
- #574 Face/Mute/Span/Brand encounter tags are `SPECIAL_ENCOUNTER` overlays. The tag is not a grant.
- Honour 09-25-043 / 044 / 042 / 054 (Wave-7 SDE, Wave-7/8 tactical, Wave-8 bosses). Do not restamp those doors.

Innate seed remains the four ids in 09-23-003 (`physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`) once 007 seeds the canister. Do not restamp Wave-1…8 doors.

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

Discovery still has **one** player-facing unlock card: `NEW SPELL DISCOVERED` on root `PostBattleRecap`. In-battle observe stays `TECHNIQUE OBSERVED`. `upgradeSpell` is never the grant writer (09-23-023) — #602 only skips that spend during Death Realm. World-feature attune / loan / death-tile glyph is never the grant writer (09-24-029 / 060). `saveBattleStats` still never mints and still ignores spell-level arrays — seeded skip-after-keep (#580 / #599) does not become a grant path (066).

#611 records `victoryPersistPending` on the recap: the spell card waits for the same atomic funnel as XP/Doka/feats. #604 skip-feat-claim during Death Realm stays feat chrome.

Possession is not observation. Player-side summons do not observe. Hostile summons may.

Version-gate wipe (`utils/versionGate.ts`) already keeps `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. #577 adds feat/shrine/covenant keep. When observation maps exist they join that keep list (059). `localStorage` remains cache only.

---

## 8. Owner UI (unchanged studio; restack grew again)

Live tabs (`AdminDashboard.tsx` 5610–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing: Library, Discovery, Kits, Feats-as-graph, Graph, Versions.

09-23-015 still extracts `SpellEditor` rather than appending. Restack-union list for that extract is now 09-23-027 **plus** 09-24-037 (#470) **plus** 09-25-049 (#539 / #531) **plus** 09-25-053 (#564) **plus** #585 Ground Doka / ads (063) **plus** #605 map-modifier identity on the same `adminGuard.mo`. Do not grow WX. Carved-stone / slate / crimson. Same `#admin` + lazy gate.

#564 is still **not** the studio. Save is still a live overwrite. #581 does not add an AP 0 control.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, `range > maxRange`, Linear ⊕ Diagonal, AP 0 without `isTimestep`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Drop “Heal (targets self)”. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.

Studio actions still required by the 08-31 contract and still absent: duplicate, compare versions, draft, validate, activate, deactivate, dependency inspection, rollback.

---

## 9. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-25 §9 / 09-24 §7 / 09-23 §9:

- 09-01-002 **LANDED** (bindgen summon).
- Empty-AI half of 09-02-006 **LANDED**.
- 08-31-005 / 09-01-001 remain **PARTIAL / WRONG FIELD** (`usableByPlayer=false`).
- Everything else **OPEN**.
- 09-21 / 09-22 / 09-23 / 09-24 / 09-25 docs unmerged. **09-23-001 … 020** are the same first-cuts as 09-22-00N. **09-23-021 … 028**, **09-24-029 … 040**, and **09-25-041 … 055** are prior queue-union IDs. **09-26-056 … 068** are this run.

**Next implementer:** **09-23-001** (lifecycle), then **09-23-007** (live Strike missing from kits), then **09-23-003 + 023** (hydrate **and** `upgradeSpell` grant). Persist `targetType` + complete summon def + AP 0 before player-facing unlock UX. Honour 09-23-016 for any new stable. Honour 09-23-017–028, 09-24-029–040, 09-25-041–055, and 09-26-056–068 when those siblings land — union, do not concatenate. Do not land WDD attune (029 / 060) before 003. Do not land Wave-7/8/9 catalog rows before 003.

---

## 10. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-N spell cards, boss sheets, elite families, or `WORLD_FEATURES` overlays
- Treating `adminSafety.ts` / `#400` / `#466` / `#512` / `#549` / `#568` / `#581` helpers as the finished lifecycle
- Re-opening 09-01-002 bindgen work or the empty-AI Motoko reject
- Overwriting #353 / #398 / #473 / #515 / #570 files
- Editing Cursor dashboard prompts (no write API)

---

## 11. ACTION_ID index

**First-cuts (do not re-implement):** `SDA-2026-09-23-001` … `028` on [#473](https://github.com/Mr-Melic/stralt/pull/473).

**Prior queue-union (do not re-implement):** `SDA-2026-09-24-029` … `040` on [#515](https://github.com/Mr-Melic/stralt/pull/515); `SDA-2026-09-25-041` … `055` on [#570](https://github.com/Mr-Melic/stralt/pull/570).

**This run** — all `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-26.md`](./ACTION_IDS_SDA_2026-09-26.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-26-056 | Honour #590 Wave-8 SDE stamps; do not pre-own `generationMin: 8` ids | P1 |
| SDA-2026-09-26-057 | Wave-9 boss spectacular ids stay `BOSS_ONLY`; do not grow a sixth kit source | P1 |
| SDA-2026-09-26-058 | Persist AP 0 / `isTimestep`; union #581 Arcane Surge 0-AP stay-free | P0 |
| SDA-2026-09-26-059 | Version-gate must keep observed/owned like feat caches; array alignment is not a grant | P0 |
| SDA-2026-09-26-060 | WDD wave-8/9 attune, loan, and death-tile glyph never write `ownedSpellIds` | P0 |
| SDA-2026-09-26-061 | Persist ally / occupant / Sacrifice flags; union #597 / #601 / #607 | P0 |
| SDA-2026-09-26-062 | Persist Haste/Slow onto the summon pool; union #596 / #598 | P1 |
| SDA-2026-09-26-063 | Union #585 AdminDashboard + #605 modifier identity; one SpellEditor | P1 |
| SDA-2026-09-26-064 | Union #591 wander extract + #606 last-hostile; do not grow WX | P1 |
| SDA-2026-09-26-065 | Union #592 summon-kit 44px; kit slots are not acquisition | P2 |
| SDA-2026-09-26-066 | Seeded `saveBattleStats` skip-after-keep PRs are not a grant path | P0 |
| SDA-2026-09-26-067 | Death Realm skip `upgradeSpell` is a spend gate, not a grant writer | P0 |
| SDA-2026-09-26-068 | Death Realm skip feat claim; discovery waits on recap persist | P1 |

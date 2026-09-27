# Spell, Discovery & Achievement Admin Design — 2026-09-27 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-27  
**HEAD audited:** `0f5363f` (`Merge pull request #332`)  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + already-owned legacy, studio tabs, persist sketch). This run does **not** replace that contract.

09-21 lives on unmerged [#353](https://github.com/Mr-Melic/stralt/pull/353). 09-22 lives on unmerged [#398](https://github.com/Mr-Melic/stralt/pull/398). **First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473)** (`SDA-2026-09-23-001` … `028`). 09-24 lives on unmerged [#515](https://github.com/Mr-Melic/stralt/pull/515) (`029` … `040`). 09-25 lives on unmerged [#570](https://github.com/Mr-Melic/stralt/pull/570) (`041` … `055`). 09-26 lives on unmerged [#630](https://github.com/Mr-Melic/stralt/pull/630) (`056` … `069`). **Do not overwrite those files.**

**Live Motoko / client / catalog at `0f5363f` is unchanged since 09-21.** Lifecycle is still `usableByPlayer=false`. Catalog hydrate still grants. Observation still does not persist. Treat **09-23-001 … 028 as the current first-cuts**. Do not implement a second 09-27 copy of 001–069.

What changed is the **oldest-first queue after #630** (created 2026-09-26T00:22Z). Sibling PRs are about to: stamp Wave-9 SDE (`generationMin: 9`) and Wave-9 tactical ids onto the same 32-id pre-owned catalog; add Wave-10 / Wave-11 boss sheets (Tables H / I) as yet more kit sources; extract more of `WorldExploration.tsx` while Admin still cannot persist `targetType` / drain / Trap / DoT; skip `saveBattleStats` after a keep then feat/GameKey commit; refuse victory when live HP is 0.

ACTION_IDs: [`ACTION_IDS_SDA_2026-09-27.md`](./ACTION_IDS_SDA_2026-09-27.md) (`SDA-2026-09-27-070` … `083`).

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists on the canister. Never introduce spell-name heuristics.

---

## 1. Why this run exists

09-26 already recorded Wave-8 SDE (#590), Wave-9 bosses / Table G (#572), Arcane Surge 0-AP Timestep (#581), version-gate feat keep (#577), WDD 8–9 attune/loan/glyph (#578 / #613), ally/occupant/Sacrifice (#597 / #601 / #607), Haste/Slow pools (#596 / #598), AdminDashboard / modifier identity (#585 / #605), WX extracts (#591 / #606), persist skip-after-keep (#580 / #599), Death Realm spend/feat skips (#602 / #604), recap persist (#611), and Wave-9 elite CORE stamps (#625).

It did **not** see:

- [#646](https://github.com/Mr-Melic/stralt/pull/646) Wave-9 SDE (`generationMin: 9`; unique §11 vs #636 stamp; `spell-court-stretch` `NOT_PLAYER_LEARNABLE`; Knight Fold `BOSS_ONLY` on `knight_fold_regent`).
- [#636](https://github.com/Mr-Melic/stralt/pull/636) Wave-9 tactical (`spell-shove-mend` … `spell-court-stretch`; Quad Span blocked while `ENEMY_SUMMON_CAP` is 2).
- [#638](https://github.com/Mr-Melic/stralt/pull/638) Wave-10 sheets + Rush Table H (`crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor`).
- [#663](https://github.com/Mr-Melic/stralt/pull/663) Wave-11 sheets + Rush Table I (`sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`).
- [#639](https://github.com/Mr-Melic/stralt/pull/639) iso-grid extract from WorldExploration.
- [#631](https://github.com/Mr-Melic/stralt/pull/631) AdminDashboard shop busy-lock / owner UX.
- Combat metadata PRs that make more frontend flags a runtime dependency: [#644](https://github.com/Mr-Melic/stralt/pull/644) `spellType` drain as lifesteal, [#647](https://github.com/Mr-Melic/stralt/pull/647) Soul Rend applied damage vs 0-tick DoT, [#649](https://github.com/Mr-Melic/stralt/pull/649) Trap on highlighted legal tiles, [#658](https://github.com/Mr-Melic/stralt/pull/658) catalog `res_sp` shreds, [#659](https://github.com/Mr-Melic/stralt/pull/659) Shield RES on enemy fallback melee.
- Persist / victory: [#657](https://github.com/Mr-Melic/stralt/pull/657) seeded keep then feat/GameKey skip; [#652](https://github.com/Mr-Melic/stralt/pull/652) refuse victory when live HP is 0.
- Admin delete class: [#650](https://github.com/Mr-Melic/stralt/pull/650) refuse emptying the live built-in map-modifier pool (same family as spell hard-delete).
- Same-morning sibling [#660](https://github.com/Mr-Melic/stralt/pull/660) enemy/boss admin re-audit — do not overwrite those docs.

If an implementer unions Wave-9 unique ids or Wave-10/11 spectaculars into `starterSpells` with `isBaseSpell: true`, or treats a 0-HP “win” as `commitSpellDiscoveries`, the studio gets worse: everyone owns G9 paper, and a corpse unlocks the observe→win funnel.

The 08-31 contract is still the destination. The 09-23 IDs are still the first cuts. This run only adds queue-union IDs. Do not extend the `usableByPlayer=false` retire path.

---

## 2. Current state (pointer — same HEAD as 09-23 … 09-26)

Re-read against `origin/main` @ `0f5363f`. Line numbers match [`SPELL_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/473) §2 and [`SPELL_ADMIN_DESIGN_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/630) §2. Do not rediscover bindgen summon (09-01-002 **LANDED**) or the empty-`summonAI` Motoko reject (empty-AI half of 09-02-006 **LANDED**).

Still true, and still the studio:

| Gap | Evidence @ `0f5363f` |
| :--- | :--- |
| Catalog ≠ ownership | `ownedSpells` = all `starterSpells` (forced `isBaseSpell`) ∪ every backend row with `usableByPlayer !== false` (`WorldExploration.tsx` 2395–2440). 32 frontend ids in `spellData.ts` are pre-owned. |
| Observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, or `commitSpellDiscoveries`. `BattleRecapData` has no `discoveredSpells`. |
| Acquisition + three flags | Only `usableByPlayer` / `usableByEnemy` (`src/backend/types/admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY`. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools / zone NaN | `ENEMY_KITS` (`enemyAI.ts` 163–185); `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). LevelZone is `{ name, minLevel, maxLevel }` (4683) so `Math.floor` is `NaN`. |
| Name heuristics | `OLD_SPELL_NAMES_SET` matches name **and** id (WX 2356–2389), including live `physical_attack`. `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. Runtime still `spell.summonAI \|\| "hunter"` (139). Editor “Heal (targets self)” (`AdminDashboard.tsx` 2685). |
| Strike purged + tombstoned | `OLD_SPELL_IDS` includes `physical_attack` (`main.mo` 689–697). Zone-0 pawn/knight/rook kits resolve empty unless summoner extras append wolf/archer (11932–11942). |
| Retire = cast gate | `adminDeleteSpellConfig` (`main.mo` 882–902) writes `usableByPlayer=false` or `remove`. Confirm copy still claims immediate remove (`AdminDashboard.tsx` 3794). Toast is `"Spell deleted"` (6166). `_spellReferencedByPlayers` (273–284) is keys+bar only. |
| Closed summon enums | `knownSummonAI` is hunter/guardian/archer/kiter/bomber/kamikaze/healer (`adminGuard.mo` 363–366). `knownPieceType` has no `font` (368–372). Client `SUMMON_AIS` / `PIECE_TYPES` match (`adminSafety.ts` 19–40). Wave-3 Font / Wave-8 Dummy Post still cannot Admin-Save. |
| Feats / challenges | `AchievementConfig` is Doka-only (`admin.mo` 249–256). 15-key condition whitelist (`adminGuard.mo` 515–531). Challenges still `{ doka, xp, badge }` (`challengeCompletion.ts` 27). |
| No spell rollback | Spell Save is a live overwrite (`main.mo` 869–880). Landing is `useSpellQueries.ts`. |
| Thin summon persist | Motoko `SummonUnitDef` is `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit`, `ap`, `mp` (`summonSpawn.ts` 22–33). |
| Activate gate vs AP 0 | Client and Motoko still reject `apCost < 1`. Live Timestep is `apCost: BigInt(0)` (`spellData.ts` 216–226). `targetType` has **zero** editor matches. Spell Type `<select>` is still damage/heal/drain (2684–2687). |
| EOP | New stables need a **later** `YYYYMMDD_*.mo` after `20260901_000000`. `check-limit = 5`. |

---

## 3. Queue hazards new since 09-26 (do not treat as landed)

Oldest-first merge order still starts at **#327**, then **#331**, then **#333+**. This PR must stay merge-clean vs `origin/main` **and** as the next item after older still-open PRs. Union overlapping files; one `export function` per name. Do **not** touch `AdminDashboard.tsx` / `WorldExploration.tsx` / `adminSafety.ts` / `adminGuard.mo` / `main.mo` in this docs PR.

| PR | What it will freeze if merged as-is | Honour without adopting the wrong field |
| :--- | :--- | :--- |
| [#630](https://github.com/Mr-Melic/stralt/pull/630) | 09-26 SDA docs (`056` … `069`) | Do not rewrite those two files. |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) / [#398](https://github.com/Mr-Melic/stralt/pull/398) / [#473](https://github.com/Mr-Melic/stralt/pull/473) / [#515](https://github.com/Mr-Melic/stralt/pull/515) / [#570](https://github.com/Mr-Melic/stralt/pull/570) | 09-21 … 09-25 SDA docs | Do not rewrite those files. 09-23-001…028 remain the first-cuts. |
| [#646](https://github.com/Mr-Melic/stralt/pull/646) | Wave-9 SDE (`generationMin: 9`; unique §11; leftover feat doors stay unused) | Honour stamps. SDE unique ids win vs #636 clones. Do not pre-own (070). |
| [#636](https://github.com/Mr-Melic/stralt/pull/636) | Wave-9 tactical (`spell-shove-mend` … `spell-court-stretch`) | Stamp, do not clone. `spell-court-stretch` never owned. Quad Span stays blocked while summon cap is 2 (071). |
| [#638](https://github.com/Mr-Melic/stralt/pull/638) | Wave-10 sheets + Table H (`crypt_sexton` … `orbit_succentor`) | Spectaculars stay `BOSS_ONLY`. Extra doors reuse #525 ids only. No seventh kit source (072). |
| [#663](https://github.com/Mr-Melic/stralt/pull/663) | Wave-11 sheets + Table I (`sole_thurifer` … `rebound_almoner`) | Same. Extra doors reuse #563 ids. Table I does not overwrite H0–H3 (073). |
| [#639](https://github.com/Mr-Melic/stralt/pull/639) | Iso-grid extract from WX | Union the extract. Do not grow WX for studio wiring (074). |
| [#631](https://github.com/Mr-Melic/stralt/pull/631) | AdminDashboard shop busy-lock | One SpellEditor. Do not concatenate `export function` copies (075). |
| [#644](https://github.com/Mr-Melic/stralt/pull/644) | Drain `spellType` as lifesteal | Persist `spellType` / healAmount with 09-23-005. Never `name.includes("Drain")` (076). |
| [#647](https://github.com/Mr-Melic/stralt/pull/647) | Soul Rend applied damage vs 0-tick DoT | Persist `isDotSpell` / `dotDamagePerTurn`. Do not infer from “Rend” (077). |
| [#649](https://github.com/Mr-Melic/stralt/pull/649) | Trap on highlighted legal tiles | Persist `isTrap` + `freeCells` + `targetType=ground` (078). |
| [#652](https://github.com/Mr-Melic/stralt/pull/652) | Refuse victory when live HP is 0 | `commitSpellDiscoveries` only on a live win (079). |
| [#657](https://github.com/Mr-Melic/stralt/pull/657) | Skip `saveBattleStats` wipe after keep then feat/GameKey | Not a grant writer. Discovery stays on the recap persist (080). |
| [#650](https://github.com/Mr-Melic/stralt/pull/650) | Refuse emptying the live built-in map-modifier pool | Same retire-vs-delete class as spells (081). |
| [#658](https://github.com/Mr-Melic/stralt/pull/658) | Honor catalog `res_sp` shreds in `getStatModifier` | Persist shred fields; never name-match Expose/Veil (082). |
| [#659](https://github.com/Mr-Melic/stralt/pull/659) | Shield RES on enemy fallback melee | Persist `targetType` / buffStat. Do not infer from “Shield” (083). |
| [#660](https://github.com/Mr-Melic/stralt/pull/660) | Enemy/boss admin 09-27 docs | Do not overwrite. Kits still one canonical id list (09-23-011). |

---

## 4. Owner UI (unchanged)

Live tabs (`AdminDashboard.tsx` 5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush.

Missing studio tabs: Library, Discovery, Kits, Feats-as-graph, Graph, Versions.

Extract `SpellEditor` onto `useSpellQueries.ts`. Keep admin writes there. Do not grow the 8 280-line dashboard until 09-23-013 activate exists. Do not grow WX. If an implementer PR overlaps #327 / #331 / #639 / #631, **union** those files.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 §9 / 09-26 §2. 09-01-002 **LANDED**. Empty-AI half of 09-02-006 **LANDED**. Everything else **OPEN** or **PARTIAL / WRONG FIELD**.

Next implementer: **09-23-001**, then **09-23-007**, then **09-23-003** + **09-23-023**. Any persist map is **09-23-016**. Honour 09-24-029…040, 09-25-041…055, and 09-26-056…069 when those siblings have landed. This run’s 070…083 are queue-union only.

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or `AdminDashboard.tsx`
- Re-authoring Wave-1…9 spell cards or boss sheets
- Overwriting `SPELL_ADMIN_DESIGN_2026-09-2{1,2,3,4,5,6}.md` or their ACTION_ID ledgers
- Re-opening 09-01-002 or the empty-AI Motoko reject
- Editing Cursor dashboard prompts (no write API)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-09-27.md`](./ACTION_IDS_SDA_2026-09-27.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-09-27-070 | Honour #646 Wave-9 SDE stamps; do not pre-own generationMin 9 ids | P1 |
| SDA-2026-09-27-071 | Stamp #636 Wave-9 tactical; Court Stretch never owned | P1 |
| SDA-2026-09-27-072 | Wave-10 boss spectacular ids stay BOSS_ONLY; Table H is a new roomIndex | P1 |
| SDA-2026-09-27-073 | Wave-11 boss spectacular ids stay BOSS_ONLY; Table I does not overwrite H | P1 |
| SDA-2026-09-27-074 | Union #639 iso-grid extract; do not grow WorldExploration | P1 |
| SDA-2026-09-27-075 | Union #631 AdminDashboard shop lock; one SpellEditor | P1 |
| SDA-2026-09-27-076 | Persist drain lifesteal with spellType; union #644 | P0 |
| SDA-2026-09-27-077 | Persist Soul Rend applied DoT; union #647 | P0 |
| SDA-2026-09-27-078 | Persist Trap legal-tile metadata; union #649 | P0 |
| SDA-2026-09-27-079 | Observe→win does not unlock on a 0-HP “victory”; union #652 | P0 |
| SDA-2026-09-27-080 | Keep-then-feat/GameKey saveBattleStats skip is not a grant path | P1 |
| SDA-2026-09-27-081 | Map-modifier built-in-pool delete is the same class as spell hard-delete | P1 |
| SDA-2026-09-27-082 | Persist res/sp shred fields; union #658 | P1 |
| SDA-2026-09-27-083 | Persist Shield RES metadata; union #659 | P1 |

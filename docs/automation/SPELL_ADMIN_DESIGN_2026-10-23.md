# Spell, Discovery & Achievement Admin Design — 2026-10-23 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-23  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-23.md`](./ACTION_IDS_SDA_2026-10-23.md) (**145–159** only).

**Do not overwrite** still-open sibling files:

| PR | Files | IDs |
| :--- | :--- | :--- |
| [#353](https://github.com/Mr-Melic/stralt/pull/353) | `SPELL_ADMIN_DESIGN_2026-09-21.md`, `ACTION_IDS_SDA_2026-09-21.md` | 09-21 001–016 |
| [#398](https://github.com/Mr-Melic/stralt/pull/398) | 09-22 pair | 09-22 |
| [#473](https://github.com/Mr-Melic/stralt/pull/473) | 09-23 pair | **First-cuts `SDA-2026-09-23-001` … `028`** |
| [#515](https://github.com/Mr-Melic/stralt/pull/515) | 09-24 pair | 029–040 |
| [#570](https://github.com/Mr-Melic/stralt/pull/570) | 09-25 pair | 041–055 (includes #568 linear⊕diagonal) |
| [#630](https://github.com/Mr-Melic/stralt/pull/630) | 09-26 pair | 056–069 |
| [#677](https://github.com/Mr-Melic/stralt/pull/677) | 09-27 pair | 070–083 |
| [#729](https://github.com/Mr-Melic/stralt/pull/729) | 09-28 pair | 084–098 |
| [#791](https://github.com/Mr-Melic/stralt/pull/791) | 09-29 pair | 099–115 |
| [#815](https://github.com/Mr-Melic/stralt/pull/815) | 10-21 pair | 116–129 |
| [#892](https://github.com/Mr-Melic/stralt/pull/892) | 10-22 pair | 130–144 |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-22 run closed the queue through #892 (Wave-13 SDE/tactical/elite, Wave-14 bosses / Table L, formations-as-not-grants, hostile vs player summon observe, kit-execute metadata, remount skips, minLevel sidecar). Same `HEAD`. Calendar is **2026-10-23**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-22 audit’s “newest #886 / 555 open” snapshot is stale: the 10-22 same-hour flock plus later combat sidecars opened **#887–#927**. Open queue at this audit start: **596** drafts. Newest sibling before this work: **#927** (remount Doka-heal skip, 2026-10-22 21:23 UTC). The 10-23 same-hour flock continued through at least **#937** while this document was written (EBA #929, AFDA #934, telemetry / PX / a11y). Do not touch `MASTER_ROADMAP.md` (#870 is a pre-existing queue break on that file).

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #892 that 130–144 did not stamp: Wave-14 discovery (#906, `generationMin: 14`, Pack Rank `ENEMY_ONLY`, Rank Fold `BOSS_ONLY`, SDE wins `spell-cadence-floor`), Wave-14 tactical (#890, Wave-**15** family CORE, Court Floor never owned, Nine Span blocked at cap 2), Wave-14 elite CORE (#899), Wave-13 formations drop 14 (#897), Wave-15 bosses / Rush Table M (#903), pack-kit assign when the Motoko catalog misses starter ids (#911), later kit-execute sidecars (Frost Bolt MP through enemy-heal CHC), later remount skips plus death-gated victory recap (#923), persist boss-defeat / condition-id helpers (#893 / #904), WDEAD waves 13–14 (#908), WX portal-whirlpool extract (#901), AFDA 10-22 ledger (#887), and closed `knownSummonAI` still omitting `ninespan` / `poisepost`.

The 08-31 contract is still the destination. The 10-23 IDs are queue-union only. Do not mint a second 001–144.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–901) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only**). Else `remove`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2438. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2395–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 types rollback for the **five** last-good writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–220). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / **`ninespan` / `poisepost`**. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight) and Nine Span (nine) stay activate-blocked. |

`newSpell()` (`AdminDashboard.tsx` 85–135) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…14 unique ids, Pack Rank, Rank Fold, Court Floor, Court Lag, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit.

---

## 3. Queue union after #892 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#906](https://github.com/Mr-Melic/stralt/pull/906) | Wave-14 SDE (`generationMin: 14`). Unique §11: `spell-rank-stride` … `spell-rank-fold`. `spell-pack-rank` is `ENEMY_ONLY`. `spell-rank-fold` is `BOSS_ONLY`. **SDE wins** `spell-cadence-floor` vs same-day #890 clone. Equal Gift is target leftover AP==MP≥1. Wave-14 family CORE is #802 unique + #849 (via #899). Unique §11 stay extras until Wave 16. | Same rule as 10-22-130 for Wave-13. Do not pre-own `generationMin: 14` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Rank / Rank Fold. Do not clone Hollow Gift / Cadence Swap / Gaunt Mend. |
| [#890](https://github.com/Mr-Melic/stralt/pull/890) | Wave-14 tactical. Ids: Poise Mend, Cadence Floor (duplicate — SDE wins), Nine Span, Bar Cross, Poise Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce, Must Poise, Verse Poise, Court Floor. Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. `summonAI: "ninespan"` / `"poisepost"`. Court Floor is `NOT_PLAYER_LEARNABLE`. Nine Span counts as **nine**; live cap is 2. Stamps as Wave **15** family CORE (except Cadence Floor). | Do not clone unique §11. Court Floor never enters `ownedSpellIds`. Do not activate Nine Span until occupy-weight / cap exists. Closed `knownSummonAI` must grow with 09-23-002 when those enums are real. |
| [#899](https://github.com/Mr-Melic/stralt/pull/899) | Wave-14 elite: 31 families. CORE = remaining #802 unique (minus Dry Gait / Pack Cap / Reach Fold) **and** #849 (minus Court Lag). SDE Wave-13 unique and #890 stay Wave **15**. Oct Span still illegal while cap is 2. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Zone NaN still hides paper ADVANCED (09-23-010). Closed Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Rank Fold stay `ENEMY_ONLY` / `BOSS_ONLY` / kit-only. |
| [#903](https://github.com/Mr-Melic/stralt/pull/903) | Wave-15 boss sheets + Rush **Table M**. Bosses `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. Extra doors on leftover #636 Shove Mend / Exit Sting / Cadence Stretch / Far Hood. Spectacular `CHOIR_JOSTLE` / `NAVE_PEEL` / `CHOIR_DILATE` / `NAVE_HOOD` stay `BOSS_ONLY`. Court Hinge / Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table M is four post-Table-L rooms; never canister `roomIndex > 9`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…14 feat doors or #890 extra doors. |
| [#897](https://github.com/Mr-Melic/stralt/pull/897) | Wave-13 synergy formations (drop 14) consuming #840 families. Design only. Live `EnemyFamily` remains the original seven. | Consume CORE ids; clearing a formation is not a grant. Same class as 10-22-134 / #825. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) | `packEnemyKitAssign.ts`: when Motoko `defaultSpells` is the live pool, pack kit ids (`physical_attack`, `starter-frost`, …) miss and every pack enemy gets `spells: []`. Sidecar fills from the starter registry. Does **not** revive `OLD_SPELL_NAMES_SET` Strike. Rallying Cry stays `usableByEnemy: false`. | Filling an empty kit so Frost Bolt can cast is **not** `ownedSpellIds`. Do not treat assign as a discovery grant. Union onto WX `assignEnemySpells`; one `export function` per name. Honour 09-23-007 / 010 instead of growing this workaround. |
| [#888](https://github.com/Mr-Melic/stralt/pull/888) / [#905](https://github.com/Mr-Melic/stralt/pull/905) / [#910](https://github.com/Mr-Melic/stralt/pull/910) / [#913](https://github.com/Mr-Melic/stralt/pull/913) / [#915](https://github.com/Mr-Melic/stralt/pull/915) / [#917](https://github.com/Mr-Melic/stralt/pull/917) / [#921](https://github.com/Mr-Melic/stralt/pull/921) / [#922](https://github.com/Mr-Melic/stralt/pull/922) / [#924](https://github.com/Mr-Melic/stralt/pull/924) | Later kit-execute sidecars: boss first-id range, Frost Bolt MP, boss summon ground range, Expose `res_sp`, Cursed Wound `healRecv`, Frost Nova MP, Life Drain SP, Drain Courage AP, enemy heal CHC. Keys are **metadata flags**, never `spell.name`. | Persist those flags with 09-23-005. Union sidecars. Not grants. Hostile kit / summon execute may observe (10-22-138); player execute must not. |
| [#900](https://github.com/Mr-Melic/stralt/pull/900) / [#909](https://github.com/Mr-Melic/stralt/pull/909) / [#912](https://github.com/Mr-Melic/stralt/pull/912) / [#918](https://github.com/Mr-Melic/stralt/pull/918) / [#919](https://github.com/Mr-Melic/stralt/pull/919) / [#926](https://github.com/Mr-Melic/stralt/pull/926) / [#927](https://github.com/Mr-Melic/stralt/pull/927) | More `saveBattleStats` remount skips (GameKey keep, feat-claim keep, portal XP, victory XP, leftover XP, shop spend, Doka-heal double charge). | Same class as 10-22-140. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. |
| [#923](https://github.com/Mr-Melic/stralt/pull/923) | `victoryRecapAfterPersist.ts` death-gates the recap; `hitsAlliesChallengeDamage.ts` locks challenge debit. | Death is not a victory. Default `VICTORY_REQUIRED` must not commit `ownedSpellIds` on a death-gated recap. Challenge debit is not a `spellRewardIds` grant. |
| [#893](https://github.com/Mr-Melic/stralt/pull/893) / [#904](https://github.com/Mr-Melic/stralt/pull/904) | Persist: `achievementConditionIds.ts` + `victoryAchievements.ts` (boss-defeat id helper; Boss Rush recap wallet/level feats after persist). | Condition whitelist / feat deferral is not `spellRewardIds`. Wallet/level feats still wait until `applyRewards` commits (09-23-012). Union `victoryAchievements.ts`; one implementation per export. |
| [#908](https://github.com/Mr-Melic/stralt/pull/908) | WDEAD 10-22: `enabledWaves` can name catalogWave 13 and 14; ENC rooms ingest Both/Stride/Near + Heave/Dual/Mid; elite waves 13–14 as a second roll; Rush tables L/M extra, never canister `roomIndex > 9`. | Rooms / waves / occupancy unseals are not grants unless a named door is stamped. Skip SEPT / SIX / PENTA / OCT / NINE occupy while cap is 2. |
| [#901](https://github.com/Mr-Melic/stralt/pull/901) | Extract portal whirlpool paint from WX into `engine/portalWhirlpool.ts`. Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798 / #831. | Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites. Do not grow WX (19 213). |
| [#887](https://github.com/Mr-Melic/stralt/pull/887) / [#934](https://github.com/Mr-Melic/stralt/pull/934) | Admin drift 10-22 (`leaderBoost` ignored) and 10-23 (unused HP query comment). Names the three kit sources again. | Consume AFDA / 09-23-011. Do not add a fourth kit table. Buff catalogs are not spell grants. |
| [#929](https://github.com/Mr-Melic/stralt/pull/929) | Same-day enemy/boss admin re-audit. **No new EBA IDs.** | Consume EBA / 09-23-011. Do not add a fourth kit table. |
| [#902](https://github.com/Mr-Melic/stralt/pull/902) / [#885](https://github.com/Mr-Melic/stralt/pull/885) / [#875](https://github.com/Mr-Melic/stralt/pull/875) | WDD wave-14, ENC Heave/Dual/Mid, Expansion 10-22. | Already covered by 10-22-142 / WDEAD-001. Not `spellRewardIds`. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825.

Same-hour 10-22 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity. Those are not spell-studio work.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 §:

| Series | Status |
| :--- | :--- |
| 08-31 001 | **PARTIAL** — cooldown + Motoko/bindgen summon **block**. `targetType` / complete unit def / editor summons / mechanic flags did not. |
| 08-31 002–004, 006–013 | **OPEN** |
| 08-31 005 | **PARTIAL / WRONG FIELD** — soft-retire is `usableByPlayer=false`. |
| 09-01-002 | **LANDED** — do not re-do bindgen summon fields. |
| 09-02-006 | **PARTIAL** — empty-AI reject landed both sides. Not an activate gate. AP 0 still illegal. Client/Motoko still omit `targetType`. |
| 09-23-001 … 028 | **OPEN** on #473 — **current first-cuts**. |
| 09-24 029–040 | **OPEN** on #515. |
| 09-25 041–055 | **OPEN** on #570. |
| 09-26 056–069 | **OPEN** on #630. |
| 09-27 070–083 | **OPEN** on #677. |
| 09-28 084–098 | **OPEN** on #729. |
| 09-29 099–115 | **OPEN** on #791. |
| 10-21 116–129 | **OPEN** on #815. |
| 10-22 130–144 | **OPEN** on #892. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…15 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, or #911 pack-kit fill as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-22 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-23.md`](./ACTION_IDS_SDA_2026-10-23.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-23-145 | Honour #906 Wave-14 SDE stamps; do not pre-own generationMin 14 ids | P1 |
| SDA-2026-10-23-146 | Stamp #890 Wave-14 tactical as Wave-15 CORE; Court Floor never owned | P1 |
| SDA-2026-10-23-147 | Honour #899 Wave-14 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-10-23-148 | Honour #903 Wave-15 boss / Rush Table M; closed signatures never owned | P1 |
| SDA-2026-10-23-149 | Honour #897 Wave-13 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-23-150 | Union #911 pack-kit assign; filling empty kits is not a grant | P0 |
| SDA-2026-10-23-151 | Persist later kit-execute metadata flags; union 10-22 execute sidecars | P1 |
| SDA-2026-10-23-152 | Remount skips continue after #892; death-gated recap is not a victory commit | P1 |
| SDA-2026-10-23-153 | Grow closed `knownSummonAI` with ninespan / poisepost enums | P0 |
| SDA-2026-10-23-154 | Union #893 / #904 persist helpers; condition ids are not spell rewards | P1 |
| SDA-2026-10-23-155 | Honour #908 WDEAD; waves 13–14 / ENC rooms / Table M are not grants | P1 |
| SDA-2026-10-23-156 | Union #901 portal-whirlpool extract; do not grow WorldExploration | P1 |
| SDA-2026-10-23-157 | Honour #887 AFDA; do not add a fourth kit source | P1 |
| SDA-2026-10-23-158 | Honour #906 / #890 extra doors; first-grant only | P1 |
| SDA-2026-10-23-159 | SDE wins `spell-cadence-floor`; do not ship the #890 clone beside it | P0 |

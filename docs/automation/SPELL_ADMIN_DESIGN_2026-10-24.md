# Spell, Discovery & Achievement Admin Design — 2026-10-24 re-audit

**Author:** Spell, Discovery & Achievement Admin Designer  
**Automation:** `4efa22ec-a498-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-24  
**HEAD audited:** `0f5363f` (`Merge pull request #332`) — unchanged since the 09-21 re-audit  
**Scope:** Owner tooling for the complete spell ecosystem. **No production code in this PR.**

This is a **delta** on [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (#116). Sections 2–11 of that document remain the studio contract (canonical `SpellDefinition`, acquisition routes, observe→win→unlock, CORE–SIGNATURE pools, dependency views, soft-retire + legacy owned, studio tabs, persist sketch). 09-01 / 09-02 deltas still stand (bindgen 09-01-002 LANDED; empty-AI half of 09-02-006 LANDED).

It records what is still the wrong field on `main`, and the ACTION_IDs in [`ACTION_IDS_SDA_2026-10-24.md`](./ACTION_IDS_SDA_2026-10-24.md) (**160–174** only).

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
| [#940](https://github.com/Mr-Melic/stralt/pull/940) | 10-23 pair | 145–159 |

Do not implement those IDs unless a human or orchestrator picks one. Do not grow `WorldExploration.tsx` (19 213 lines). Never introduce spell-name heuristics. Next implementer still starts at **09-23-001**, then **007**, then **003+023**. Do not land Wave-9 / 10 / 11 / 12 / 13 / 14 / **15** catalog rows before 003. Persist maps go through **09-23-016** (new later EOP file after `20260901`; `check-limit = 5` today). Do not extend the `usableByPlayer=false` retire path.

---

## 1. Why this run exists

The 10-23 run closed the queue through #940 (Wave-14 SDE/tactical/elite, Wave-15 bosses / Table M, pack-kit fill as not a grant, later kit-execute, remount skips + death-gated recap, `ninespan` / `poisepost` enums, SDE win on `spell-cadence-floor`). Same `HEAD`. Calendar is **2026-10-24**. `origin/main` has not moved since 2026-09-03 (`0f5363f`). The 10-23 audit’s “newest #927 / 596 open” snapshot is stale: the 10-23 same-hour flock plus later combat / remount sidecars opened **#928–#979**, and the 10-24 same-hour flock opened **#980–#1000** while this audit was in flight. Open queue at this patch: **665+** drafts (stack-compat listed 665; #997–#1000 opened during the run). Newest sibling before this work: **#1000** (dead-code / legacy-drift audit, 2026-10-24 00:17 UTC). Do not touch `MASTER_ROADMAP.md` (#870 / #946 / #998 are pre-existing oldest-first conflicts on that file).

The product hole is unchanged: catalog still grants, discovery still does not exist, retirement is still a cast flag.

What *is* new for this studio is the flock **after** #940 that 145–159 did not stamp: Wave-15 discovery (#962, `generationMin: 15`, Pack Diag `ENEMY_ONLY`, Far Fold `BOSS_ONLY`), Wave-15 tactical (#953, Wave-**16** family CORE, Court Prime never owned, Dec Span blocked at cap 2), Wave-15 elite CORE (#941), Wave-14 formations drop 15 (#956), Wave-16 bosses / Rush Table N (#951), later kit-execute/decide sidecars (DoT ticks through Iron Skin buff, then 10-24 pack-heal decide #985/#989 and VAMPIRIC_AOE minion HP #984), later remount skips plus lethal-reflect drain skip (#973) plus 10-24 one-shot Doka keep (#986/#987), WDEAD occupancy unseals (#932), ENC Dry/Lean/Odd (#957), WDD Wave-15 `WF-*` (#949), WX pixel-pattern extract (#961), Admin UX helpers (#945), EBA 10-24 re-audit with **no new IDs** (#980), UX empty-book copy (#943), persist dual-bar schema (#950), AI increment (#958), and closed `knownSummonAI` still omitting `decspan` / `tallypost`.

The 08-31 contract is still the destination. The 10-24 IDs are queue-union only. Do not mint a second 001–159.

---

## 2. Current state (re-verified against `origin/main` @ `0f5363f`)

### 2.1 Still true — do not rediscover as new

| Fact | Where (this HEAD) |
| :--- | :--- |
| Bindgen + `toBackendSpellConfig` include Motoko summon fields | `backend.ts` 130–151; `adminContract.ts`. 09-01-002 **closed**. Motoko `SummonUnitDef` is still `pieceType` / `level` / `hpScale` / `damageScale` (`admin.mo` 85–90). Combat also needs `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). |
| Motoko + client reject empty `summonAI` when `isSummon` | `adminGuard.mo` 423–425; `adminSafety.ts` 625–628. Runtime still does `spell.summonAI \|\| "hunter"` (`summonSpawn.ts` 139) and `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224). |
| Validators accept `spellType="summon"` | `adminGuard.mo` 348–349; `adminSafety.ts` 611. Editor `<select>` is still damage / heal / drain (`AdminDashboard.tsx` 2675–2687). “Heal (targets self)” is a targeting lie — `targetType` has **zero** editor matches. |
| Lifecycle is still `usableByPlayer=false` | `adminDeleteSpellConfig` (`main.mo` 882–902) error copy still says “set usableByPlayer=false to retire it” (887). Soft-retire writes that flag when `_spellReferencedByPlayers` (273–284, **keys+bar only** via `_characterHasSpell` 253–270). Else `remove`. |
| `upgradeSpell` treats the same flag as “Spell is retired” | `main.mo` 1011. Owned-but-never-upgraded ids are not in `spellLevelKeys`, so the check blocks the legacy upgrade 08-31 §8.2 requires. Appearance cannot mint keys (`resolveAppearanceSpellLevels`). |
| Library helper is still inverted | `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true when `usableByPlayer !== false`. Wired at `WorldExploration.tsx` 2412–2440. `ownedIds` is `starterSpells` ∪ `spellLevelKeys` ∪ `spellBarOrder`. All 32 frontend ids are forced `isBaseSpell: true` (2397–2408). |
| No observation / unlock persist | No `ownedSpellIds`, `observedSpellIds`, `recordSpellObservation`, `commitSpellDiscoveries` under `src/` except the **argument name** `ownedSpellIds` on the inverted helper. Recap is still XP / Doka / feats. |
| No acquisition enum / three flags | Only `usableByPlayer` / `usableByEnemy` (`admin.mo` 117–118). No `ENEMY_DISCOVERY` … `SYSTEM_ONLY` in live types. No `OBSERVATION_REQUIRED` / `VICTORY_REQUIRED` / `PLAYER_LEARNABLE`. |
| Enemy pools hardcoded; zone always 0 | `ENEMY_KITS` is `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920) passes `{ name, minLevel, maxLevel }` (4683–4687). `Math.floor` is `NaN`; every kit stays zone 0. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). Summoner extras still `starterSpells.find(id === "summon-dire-wolf")` (11935–11941). |
| Achievement / challenge still Doka-only | `AchievementConfig` is `{ id, name, description, dokaReward, condition, active }` (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is 15 keys (`adminSafety.ts` 306–322). Challenges stay `{ doka, xp, badge }`. |
| Name heuristics still live | `OLD_SPELL_NAMES_SET` matches **name and id**, including live `physical_attack` (`WorldExploration.tsx` 2356–2389). Same id is in `OLD_SPELL_IDS` purge (`main.mo` 689–697). `summonSpawn.ts` 165: `spell.name.replace("Summon ", "")`. |
| Three boss kit sources | Live combat: `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+ `fireball`, `cursed_gust`, `entangle`, `mist_form`, …). Admin chips: `getSpellConfigs()`. Queued #818 / #887 / #929 / #934 name that split — they are not a fourth kit table. |
| Bar persist still upgrade-keys only | `setSpellBarOrder` filters to `spellLevelKeys` (`main.mo` 1945–1947). Queued #950 dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` is a stale-schema lock, not `ownedSpellIds`. |
| Spell Save is a live overwrite | `adminSetSpellConfig` (`main.mo` 869–879). No `adminRollbackSpellConfig`. Queued #838 / #945 types rollback / confirm-dismiss for **other** writers — **not** spells. |
| Enemy hard delete | `adminDeleteEnemyConfig` (`main.mo` 798–804) is unconditional `remove`. |
| Achievement delete | Progress present → `active=false`; else `remove`. Unlock rejects inactive. Official Claim UI hides `active=false` while `claimAchievementReward` still pays Doka (queued #828 sidecar). |
| Activate gate is still a payload clamp | Both validators reject `apCost < 1` (`adminGuard.mo` 380–382; `adminSafety.ts` 604–606) — live Timestep is `apCost: 0` (`spellData.ts` 216–220). Closed `knownSummonAI` / `knownPieceType` still omit `font` / `dummypost` / `pentaspan` / `septspan` (`adminGuard.mo` 363–373) and queued `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / **`decspan` / `tallypost`**. |
| `minLevel` is catalog copy, not a gate | `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book. Queued #828 `spellMinLevelHydrate.ts` locks that fact. Do **not** start enforcing `minLevel` until `ownedSpellIds` exists (09-23-003). |
| Write landing | `useSpellQueries.ts` (293 lines) already calls `validateSpellConfig`. Extract `SpellEditor` here. Do not grow `AdminDashboard.tsx` (8 280 lines) until activate exists. |
| New stables | Later EOP file after `20260901`; bump `check-limit` (today **5**). Never amend a shipped `NewActor`. Queued #950 does **not** approve a new required persist field. |
| Live summon cap | `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Oct Span (eight), Nine Span (nine), and Dec Span (ten) stay activate-blocked. |

`newSpell()` (`AdminDashboard.tsx` 85–134) still seeds cooldown + mechanic bools + empty summon fields and **omits `targetType`**. Default `usableByPlayer: true` still hydrates every account.

Delete confirm (`AdminDashboard.tsx` 3793–3794) still says the live spell is **removed immediately** and dependents **will break**. Toast is always `"Spell deleted"` (6166). Backend may have only flipped a bool.

Live tabs (5611–5626): Enemies, Regions, Player Sprites, Spells, Map Modifiers, Enemy Tiers, Visuals, Settings, Purchases, Achievements, Enemy Names, Bosses, Ad Boxes, Shop, Boss Rush. Still no Library / Discovery / Kits / Feats-as-graph / Graph / Versions. Queued #945 `⌘K` / confirm-dismiss helpers stay over those 15 live tabs.

### 2.2 Superseding rules (unchanged)

Lifecycle ≠ `usableByPlayer`. `PLAYER_LEARNABLE` ≠ the cast gate. `ENEMY_ONLY` / `BOSS_ONLY` stay `lifecycle = active` with `PLAYER_LEARNABLE = false`. Hard delete is legal **only** for `draft` with zero published revisions and zero refs. Already-owned retired spells keep `ownedSpellIds` / levels / bar; `upgradeSpell` stays legal for those ids; Spellbook shows a Retired seal; combat reads the frozen revision; new achievement grants skip a retired reward id and still pay Doka; live kits ignore retired ids at resolve (log once) and activate of a kit that still lists them is blocked.

Ownership migration (when 09-23-003 lands): seed `ownedSpellIds` from the innate four ∪ `spellLevelKeys` ∪ resolving `spellBarOrder` ids. **Do not** grant `getSpellConfigs()`. **Do not** grant the full `starterSpells` array. **Do not** grant Wave-9…15 unique ids, Pack Rank, Rank Fold, Pack Diag, Far Fold, Court Floor, Court Lag, Court Prime, Pack File, Diag Fold, or any `ENEMY_ONLY` / `BOSS_ONLY` row because `usableByPlayer !== false`.

Default discovery (08-31 §4, still inert):

```
eligible unknown spell
  → enemy kit actually contains the id
  → enemy successfully casts it
  → observed (persist)
  → player wins that encounter
  → ownedSpellIds + root recap
```

Possession is not observation. Player-side summons do not observe. Hostile summons may. `upgradeSpell` is never the grant writer. Death-gated recap (#923) is not a victory commit. Lethal-reflect Life Drain that currently resurrects (#973) is not a victory commit either.

---

## 3. Queue union after #940 (do not treat as landed)

| Sibling | What it actually is | Studio rule |
| :--- | :--- | :--- |
| [#962](https://github.com/Mr-Melic/stralt/pull/962) | Wave-15 SDE (`generationMin: 15`). Unique §11: `spell-file-stride` … `spell-far-fold`. `spell-pack-diag` is `ENEMY_ONLY`. `spell-far-fold` is `BOSS_ONLY`. Extra rooms `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave`. Wave-15 family CORE is #837 unique + #890 (via #941), **not** unique §11. Unique §11 stay extras until Wave 17. Unique Wave-14 §11 (#906) stay extras until Wave 16. Same-day #953 stamps as Wave **16** family CORE. Cadence Rise is remaining `n==1` → 2; Lean Gift is leftover AP = 0 **and** leftover MP ≥ 1. | Same rule as 10-23-145 for Wave-14. Do not pre-own `generationMin: 15` ids. Validator rejects `PLAYER_LEARNABLE=true` on Pack Diag / Far Fold. Do not clone Cadence Prime / Tally Mend / Dec Span. |
| [#953](https://github.com/Mr-Melic/stralt/pull/953) | Wave-15 tactical. Ids: Tally Mend, Cadence Prime, Dec Span, Purse Turn, Tally Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce, Must Tally, Verse Tally, Court Prime. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. `summonAI: "decspan"` / `"tallypost"`. Court Prime is `NOT_PLAYER_LEARNABLE`. Dec Span counts as **ten**; live cap is 2. Stamps as Wave **16** family CORE. | Do not clone unique §11. Court Prime never enters `ownedSpellIds`. Do not activate Dec Span until occupy-weight / cap exists. Closed `knownSummonAI` must grow with 09-23-002 when those enums are real. Cadence Prime is remaining `0→1` — **not** a second Cadence Floor and **not** Cadence Rise. |
| [#941](https://github.com/Mr-Melic/stralt/pull/941) | Wave-15 elite: 31 families. CORE = #837 unique (minus Pack File / Diag Fold) **and** #890 (minus Cadence Floor / Court Floor). SDE Wave-15 unique and #953 stay Wave **16** / extras. Nine Span still illegal while cap is 2. | Honour as CORE–SIGNATURE **ids**. Do not pre-own. Zone NaN still hides paper ADVANCED (09-23-010). Closed Pack File / Diag Fold / Pack Rank / Rank Fold / Pack Diag / Far Fold / Court Floor stay `ENEMY_ONLY` / `BOSS_ONLY` / kit-only. |
| [#951](https://github.com/Mr-Melic/stralt/pull/951) | Wave-16 boss sheets + Rush **Table N**. Bosses `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. Extra doors on leftover #636 Gait Wick / Dry Sting / Home Step / Must Span. Spectacular `CHOIR_WICK` / `NAVE_DRY` / `CHOIR_HEARTH` / `NAVE_SPAN` stay `BOSS_ONLY`. Court Hinge / Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table N is four post-Table-M rooms; never canister `roomIndex > 9`. | Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source. Do not restamp Wave-1…15 feat doors or #890 / #903 / #953 extra doors. |
| [#956](https://github.com/Mr-Melic/stralt/pull/956) | Wave-14 synergy formations (drop 15) consuming #899 families (Gaunt Choir / Court / Hold). Design only. Live `EnemyFamily` remains the original seven. Wave-15 families (#941) stay unfamilied for drop 16. | Consume CORE ids; clearing a formation is not a grant. Same class as 10-23-149 / #897. |
| [#947](https://github.com/Mr-Melic/stralt/pull/947) / [#967](https://github.com/Mr-Melic/stralt/pull/967) / [#972](https://github.com/Mr-Melic/stralt/pull/972) / [#974](https://github.com/Mr-Melic/stralt/pull/974) / [#978](https://github.com/Mr-Melic/stralt/pull/978) / [#985](https://github.com/Mr-Melic/stralt/pull/985) / [#989](https://github.com/Mr-Melic/stralt/pull/989) / [#984](https://github.com/Mr-Melic/stralt/pull/984) | Later kit-execute/decide sidecars: pack DoT ticks, DoT decide vs `pickBestDamageSpell`, Inferno CD arm outside `damage>0`, Iron Skin buff execute (`buffStat`), buff decide, then 10-24 pack-heal decide vs `decideHealer` (#985) and vs `pickBestDamageSpell` (#989) on the same `wxEnemyHealDecidePicker.ts` slot, plus Starved Vampire `VAMPIRIC_AOE` minion HP from `damageToTargets` (#984). Keys are **metadata flags** (`spellType`, `healAmount`, `range`, `targetType`, `buffStat`, `damageToTargets`), never `spell.name`. #985 and #989 overlap; union **one** `export function` per name. | Persist those flags with 09-23-005. Union sidecars. Not grants. Hostile kit execute may observe (10-22-138); player execute must not. Blood Mend `targetType: "self"` range 0 is metadata, not a Heal name. Leftover minion HP blocking `shouldAwardVictory` is not a grant. |
| [#973](https://github.com/Mr-Melic/stralt/pull/973) | Skip Life Drain heal after lethal same-cast reflect so HP-watch can set `deathTriggered`. Live path currently resurrects then still awards `applyRewards`. | Death is not a victory. Default `VICTORY_REQUIRED` must not commit `ownedSpellIds` on a lethal-reflect skip. Distinct from #923 death-gated recap. |
| [#964](https://github.com/Mr-Melic/stralt/pull/964) / [#969](https://github.com/Mr-Melic/stralt/pull/969) / [#971](https://github.com/Mr-Melic/stralt/pull/971) / [#977](https://github.com/Mr-Melic/stralt/pull/977) / [#979](https://github.com/Mr-Melic/stralt/pull/979) / [#986](https://github.com/Mr-Melic/stralt/pull/986) / [#987](https://github.com/Mr-Melic/stralt/pull/987) / [#992](https://github.com/Mr-Melic/stralt/pull/992) | More `saveBattleStats` remount skips (shop/heal throw-after-accept Doka wipe, death wipe, Doka-heal double charge, rename/upgrade wallet lie after shop/heal and after victory Doka keep, then 10-24 one-shot shrine/ground/dungeon-complete Doka keep on rename/upgrade, then feat Doka keep). #986 and #987 overlap the same sidecar; union **one** `export function` per name. #992 is a unique `featDokaKeepRemountRenameSpendWriteSkip.ts` slot. | Same class as 10-23-152. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. One-shot / feat Doka keep is not `commitSpellDiscoveries`. |
| [#932](https://github.com/Mr-Melic/stralt/pull/932) | WDEAD 10-23: occupancy unseals after shock compose with Void Grandmaster `ILLUSION_SPLIT` (#914), Broodmother Rook `LARVAE_SPAWN` (#920), Pale Archivist `INK_VEIL` (#925). Persist-keep rails for feat/portal/victory/leftover XP remount cuts. | Occupancy unseals / unique-corridor copies / larvae / glyphs are not grants unless a named door is stamped. Distinct from 10-23-155 (#908 waves 13–14 / Table M). |
| [#957](https://github.com/Mr-Melic/stralt/pull/957) | ENC Dry/Lean/Odd catalog (`ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` / `ENC-DWELL-01` / `ENC-GATE-02` / `ENC-OWN-01` / `ENC-CINDER-02`). | Rooms may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*` does not append `ownedSpellIds`. Do not consume into SDE unique §11. |
| [#949](https://github.com/Mr-Melic/stralt/pull/949) / [#993](https://github.com/Mr-Melic/stralt/pull/993) | WDD Wave-15 `WF-*` overlays. Vow Gate exploration-only. Sheath File / Orth Picket count as hostiles for map-clear. #993 is Wave-16 WDD (`WDD-2026-10-24-001`); world features still are not grants. | World features are not spell grants. Do not consume `WF-*` into unique §11 or extra doors. Do not overwrite #993 WDD dated files. |
| [#961](https://github.com/Mr-Melic/stralt/pull/961) / [#995](https://github.com/Mr-Melic/stralt/pull/995) | Extract pixel-pattern paint from WX into `engine/pixelPattern.ts`. Unique import slot vs #901 `portalWhirlpool`. #995 extracts isometric tile paint into `engine/tilePaint.ts` (restacks WX). Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798 / #831 / #901. | Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites. Do not grow WX (19 213). Prefer #995’s extract over inlining observe/commit. |
| [#945](https://github.com/Mr-Melic/stralt/pull/945) / [#980](https://github.com/Mr-Melic/stralt/pull/980) / [#996](https://github.com/Mr-Melic/stralt/pull/996) | Admin UX: `shouldDismissOwnerConfirm`, Tiers/Visuals hydrate honesty, GameKey Escape, Revert-to-Default copy. Does **not** restack `AdminDashboard.tsx`. #980 EBA 10-24 re-audit is docs only, **no new EBA IDs**. #996 AFDA drift ledger locks `boss_defeated` as never unlocking a spell. | Confirm-dismiss is not spell rollback. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. Do not overwrite #980 EBA or #996 AFDA `*2026-10-24*` files. `boss_defeated` is not `spellRewardIds`. |
| [#943](https://github.com/Mr-Melic/stralt/pull/943) | UX: `spellbookEmptyCopy.ts` must not mention admin; Close copy keeps spent upgrades. SpellbookModal not wired. | Empty-book copy is not a catalog grant. Retired-owned still shows a Retired seal once 09-23-001 lands. |
| [#950](https://github.com/Mr-Melic/stralt/pull/950) | Persist: dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]`; does **not** approve a new required persist field; does **not** attach `(with migration)` to live `main.mo`. | Dual bar schema is not `ownedSpellIds`. New observation maps still go through 09-23-016. |
| [#958](https://github.com/Mr-Melic/stralt/pull/958) / [#999](https://github.com/Mr-Melic/stralt/pull/999) | AI increment SYS-90…95. SYS-90 names pack kits resolving against Motoko `defaultSpells` (open #911 owns the writer). Inspector lists modules by id. #999 is the 10-24 AEE increment (docs only). | Consume AEE / 09-23-010. Do not emit `shadow_strike`. Do not add a fourth kit table. Blood Mend `targetType: "self"` is metadata, not a name. Do not overwrite #999 AEE dated files. |
| [#944](https://github.com/Mr-Melic/stralt/pull/944) | Expansion 041 — gate existing overkill retarget on `bottleneckControl`. | Not a spell catalog. Not `spellRewardIds`. |
| [#929](https://github.com/Mr-Melic/stralt/pull/929) / [#934](https://github.com/Mr-Melic/stralt/pull/934) / [#980](https://github.com/Mr-Melic/stralt/pull/980) | Already covered by 10-23-157. **No new EBA IDs.** #980 is the 10-24 EBA re-audit (docs only; kit-comment citation restored to WX 11915). | Consume AFDA / 09-23-011. Do not add a fourth kit table. Do not grow WX from this studio. |

Still queued (do not re-issue): #564 `SpellSummonFields` (09-25), #568 linear⊕diagonal (09-25-055), 09-28-084…098, 09-29-099…115, 10-21-116…129, 10-22-130…144, 10-23-145…159, #747 / #726 / #752 / #753 / #733 / #730 / #754 / #766 / #757 / #762 / #802 / #787 / #796 / #808 / #837 / #849 / #840 / #836 / #825 / #906 / #890 / #899 / #903 / #897 / #911.

Same-hour 10-23 flock also opened telemetry / PX / balance / long-horizon / Health skip / a11y / map integrity / content-diversity freeze. Those are not spell-studio work. #942 CDA freezes Wave-16 HP clones — this studio does not mint Wave-16 unique §11 (that is the next SDE generation). 10-24 #991 Expansion / #994 TADD / #997 Wave-16 elite / #998 Master roadmap / #1000 dead-code audit are not this studio; do not restamp their files or grow WX from #995.

---

## 4. Owner UI (dev-gated — still the 08-31 studio)

Carved-stone / slate / crimson. Same `#admin` + lazy `AdminDashboard` gate.

Immediate UI honesty (can land with persist 001/004, not a restyle):

- Delete on published ids is **Retire**. Confirm lists dependents. Toast must say retired vs rejected vs draft-deleted. Union #945 `shouldDismissOwnerConfirm` so Shop/GameKey/delete dialogs stay until `#ok`.
- Cast-gate checkboxes stay labeled “player may cast” / “enemy may cast.” Lifecycle is a separate control.
- Validation strip: missing `targetType`, broken kit id, name-heuristic leftover = crimson.
- Spell Type includes `summon`. Summon section: `summonAI`, lifespan, piece, scales, **displayName**, kit ids.
- `⌘K` (queued #838 / #945) stays over the 15 live tabs until activate exists. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs.

Do not grow the 8 280-line dashboard until activate exists on the canister (08-31 SDA-012 / 09-23-013 / 09-23-015). Extract `SpellEditor` onto `useSpellQueries.ts`. Do not grow `WorldExploration.tsx`. Restack AdminDashboard siblings as **one** extract.

Support still required and still missing: duplicate, compare versions, draft, validate (activate gate), activate, deactivate, dependency inspection, rollback.

---

## 5. Prior ACTION_ID status @ `0f5363f`

Unchanged from 09-23 § / 09-29 § / 10-21 § / 10-22 § / 10-23 §:

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
| 10-23 145–159 | **OPEN** on #940. |

---

## 6. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, damage math
- Growing `WorldExploration.tsx` or concatenating a second `export function` on restack
- Re-authoring Wave-1…16 spell cards or boss adaptations
- Treating `adminSafety.ts` helpers, #775 AUX copy, #810 stack rails, #838 five-writer rollback, #911 pack-kit fill, or #945 confirm-dismiss as persist `lifecycle` / ownership
- Re-opening 09-01-002 bindgen work
- Re-issuing 09-21…10-23 IDs
- Editing Cursor dashboard prompts (no write API)
- Landing Wave-11 / Wave-12 / Wave-13 / Wave-14 / Wave-15 catalog rows before 09-23-003
- Enforcing `SpellConfig.minLevel` at hydrate without `ownedSpellIds`
- Treating the merge freeze as “those drafts landed”
- Editing `MASTER_ROADMAP.md` (#338 / #783 / #814 / #870 / #946)
- Minting Wave-16 unique §11 (next SDE generation; #942 CDA freeze)

---

## 7. ACTION_ID index (this run)

All items: `STATUS: NEW`. Full records: [`ACTION_IDS_SDA_2026-10-24.md`](./ACTION_IDS_SDA_2026-10-24.md).

| ID | Title | Priority |
| :--- | :--- | :--- |
| SDA-2026-10-24-160 | Honour #962 Wave-15 SDE stamps; do not pre-own generationMin 15 ids | P1 |
| SDA-2026-10-24-161 | Stamp #953 Wave-15 tactical as Wave-16 CORE; Court Prime never owned | P1 |
| SDA-2026-10-24-162 | Honour #941 Wave-15 elite CORE; zone NaN still hides ADVANCED | P1 |
| SDA-2026-10-24-163 | Honour #951 Wave-16 boss / Rush Table N; closed signatures never owned | P1 |
| SDA-2026-10-24-164 | Honour #956 Wave-14 formations; consume CORE ids, do not grant | P1 |
| SDA-2026-10-24-165 | Persist later kit-execute/decide metadata flags; union 10-23 sidecars and 10-24 heal decide | P1 |
| SDA-2026-10-24-166 | Remount skips continue after #940; lethal-reflect and one-shot Doka keep are not victory commits | P1 |
| SDA-2026-10-24-167 | Grow closed `knownSummonAI` with decspan / tallypost enums | P0 |
| SDA-2026-10-24-168 | Honour #932 WDEAD occupancy / #957 ENC / #949 WF; not grants | P1 |
| SDA-2026-10-24-169 | Union #961 pixel-pattern and #995 tile-paint extracts; do not grow WorldExploration | P1 |
| SDA-2026-10-24-170 | Honour #945 Admin UX helpers, #980 EBA re-audit, and #996 boss_defeated never unlocks; do not add empty studio tabs or a fourth kit source | P1 |
| SDA-2026-10-24-171 | Honour #962 / #953 / #951 extra doors; first-grant only | P1 |
| SDA-2026-10-24-172 | Keep Lean Gift ≠ Tally Mend and Cadence Rise ≠ Cadence Prime | P0 |
| SDA-2026-10-24-173 | Honour #958 AI increment; inspector lists modules by id | P1 |
| SDA-2026-10-24-174 | Honour #943 empty-book copy / #950 dual bar schema; not ownedSpellIds | P1 |

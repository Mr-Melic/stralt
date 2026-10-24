# ACTION_IDs — 2026-10-24 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-24.md`](./SPELL_ADMIN_DESIGN_2026-10-24.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-24 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **160–174** (queue after #940). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **665+** at this patch (648 at audit start; 10-24 same-hour flock opened #980–#1000). Newest sibling before this work: **#1000** (dead-code / legacy-drift audit, 2026-10-24 00:17 UTC). Calendar: 2026-10-24. #870 / #946 / #998 `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped); this PR does not touch that file.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-24-160  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #962 Wave-15 SDE stamps; do not pre-own generationMin 15 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#962](https://github.com/Mr-Melic/stralt/pull/962) is Wave-15 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md`, `generationMin: 15`). Unique §11 ids (`spell-file-stride`, `spell-hexa-oath`, `spell-lava-reel`, `spell-file-bite`, `spell-strike-mark`, `spell-dry-plate`, `spell-shock-skip`, `spell-even-sting`, `spell-summon-rank`, `spell-lean-gift`, `spell-cadence-rise`, `spell-still-toll`, `spell-brick-brace`, `spell-watch-root`, `spell-odd-gait`, `spell-spike-cut`, `spell-summon-plate`, `spell-pack-diag`, `spell-far-fold`) stay this catalog’s. `spell-pack-diag` is `ENEMY_ONLY`. `spell-far-fold` is `BOSS_ONLY`. Lean Gift is leftover AP = 0 **and** leftover MP ≥ 1. Cadence Rise is remaining `n==1` → 2. Wave-15 family CORE is #837 unique + #890 (via #941). Unique §11 stay extras until Wave 17. Unique Wave-14 §11 (#906) stay extras until Wave 16. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2397–2408). Copying Wave-15 unique ids into that array, or hydrating Pack Diag because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-23-145 already said the same for Wave-14 `#906`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-15 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, and 10-23-145. Honour #962 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Lean Gift or Cadence Rise (see 172). Do not restamp Wave-1…14 doors or #890 / #906 / #953 extra doors. Do not implement Wave-15 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Diag / Far Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-23-145; SDA-2026-10-24-172; PR #962; PR #953  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-15 ids. HIGH if `ENEMY_ONLY` Pack Diag is hydrated because `usableByPlayer !== false`. HIGH if `far_fold_regent` also grants File Stride. HIGH if a Lean Gift / Cadence Rise clone ships beside the #962 ids.  
VALIDATION_REQUIRED: After a Wave-15 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Lean Gift / Cadence Rise id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-161  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #953 Wave-15 tactical as Wave-16 CORE; Court Prime never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#953](https://github.com/Mr-Melic/stralt/pull/953) (`SPELL_PROPOSALS_2026-10-23.md`) owns leftover holes #890 / #906 did not take: `spell-tally-mend`, `spell-cadence-prime`, `spell-dec-span`, `spell-purse-turn`, `spell-tally-hood`, `spell-tally-sting`, `spell-tally-step`, `spell-tally-sill`, `spell-tally-hold`, `spell-tally-lend`, `spell-tally-sip`, `spell-tally-post`, `spell-tally-bounce`, `spell-must-tally`, `spell-verse-tally`, `spell-court-prime`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-prime` is `NOT_PLAYER_LEARNABLE`. Dec Span is axis-aligned 2×5 occupy of **ten**; live `ENEMY_SUMMON_CAP` is still 2 (`gameConstants.ts` 300), so that card is implementation-blocked (`summonAI: "decspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` must not be restamped by SDE unique §11 or Wave-16 families. Cadence Prime is remaining `n===0` → 1 (zeros become 1; `n>1` unchanged) — **not** Cadence Floor (`n>1` → 1) and **not** Cadence Rise (`n==1` → 2). Wave **16** families consume the #953 ids as CORE. Live hydrate still pre-owns all 32 `starterSpells`. 10-23-146 covered Wave-14 tactical (#890) only.  
SYSTEMS_AFFECTED: Wave-15 tactical catalog; Wave-16 family CORE; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #953 ids. Do not clone them into SDE unique §11. `spell-court-prime` never enters `ownedSpellIds`. Do not activate Dec Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy / Nine Span / Oct Span. Extra doors are first-grant; do not also hang File Stride / Lean Gift / Far Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `decspan` / `tallypost` are real, not via a name parse (167). Do not mint `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-10-24-160; SDA-2026-10-24-172; SDA-2026-10-23-146; PR #953  
REGRESSION_RISK: HIGH if Court Prime hydrates as a catalog grant. HIGH if Cadence Prime is aliased onto Cadence Floor / Cadence Rise. MEDIUM if Dec Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Prime. Cadence Floor remains the #906 id. Cadence Rise remains the #962 id. Cadence Prime remains the #953 id. Dec Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-162  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #941 Wave-15 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#941](https://github.com/Mr-Melic/stralt/pull/941) stamps Wave-15 family CORE from #837 unique verbs (except Pack File / Diag Fold) plus #890 tactical (except Cadence Floor, already #906, and Court Floor). Pack File / Diag Fold / Pack Rank / Rank Fold / Pack Diag / Far Fold / Court Floor stay kit-only / never-owned. SDE Wave-15 unique CORE waits for Wave 17. Same-day #953 stays Wave 16. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone. 10-23-147 already said the same for Wave-14 `#899`.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-15 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #941 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone. Do not mint Wave-15 unique CORE (`spell-file-stride` …) as this pass’s CORE. Do not CORE Pack Diag / Far Fold (#962). Do not CORE Tally Mend / Court Prime (#953).  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-10-23-147; PR #941  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Pack Diag / Far Fold / Court Prime is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn still does not silently own Knight Stride / Poise Mend. Pack File / Diag Fold / Pack Diag / Far Fold / Court Floor / Court Prime never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-163  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #951 Wave-16 boss / Rush Table N; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#951](https://github.com/Mr-Melic/stralt/pull/951) unions Wave 16 + Rush **Table N** onto `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. New bosses `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` are not in live `BOSS_IDS`. Extra doors on leftover #636 Gait Wick / Dry Sting / Home Step / Must Span. Spectacular `CHOIR_WICK` / `NAVE_DRY` / `CHOIR_HEARTH` / `NAVE_SPAN` stay `BOSS_ONLY`. Court Hinge and Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table N is four post-Table-M rooms; canister `completeBossRushRoom` still must not see `roomIndex > 9`. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. 10-23-148 already said the same for Wave-15 `#903` / Table M.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #951 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-23-157). Do not restamp Wave-1…15 feat doors, leftover #563 Dummy Post / Enter Mend / Split Mend, leftover #636 Quiet Sill / Shove Mend / Exit Sting / Cadence Stretch / Far Hood (#836 / #903), or #890 / #953 extra doors. Table N is owner overlay, never a 10th canister room. Quad Span stays off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-23-148; SDA-2026-10-24-170; PR #951  
REGRESSION_RISK: HIGH if `CHOIR_WICK` hydrates as a player grant. MEDIUM if Table N is written as `currentRoom` 10–13 and `setBossRushProgress` traps on decrease.  
VALIDATION_REQUIRED: After Wave-16 sheets exist on paper, a new character does not own Gait Wick / Must Span from hydrate. Completing Table N does not call `completeBossRushRoom(10)`. Admin Bosses tab still has one live kit source after 011.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-164  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #956 Wave-14 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#956](https://github.com/Mr-Melic/stralt/pull/956) proposes 16 world-pack formations that consume Wave-14 families from [#899](https://github.com/Mr-Melic/stralt/pull/899) (Gaunt Choir, Gaunt Court, Gaunt Hold, and related teaching pairs). Design only — no production spawn tables. Live `EnemyFamily` remains the original seven. Wave-15 families (#941) stay unfamilied for drop 16. 10-23-149 already said the same for Wave-13 formations `#897`. Formations are not `spellRewardIds` and not observe+win.  
SYSTEMS_AFFECTED: future formation catalog; family CORE; `ownedSpellIds`  
RECOMMENDED_ACTION: Same rule as 10-23-149. Consume already-stamped CORE ids. Clearing `FSN-*` does not append `ownedSpellIds` unless a named door is stamped. Do not mint formation-only spell ids. Do not grow WX spawn.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-23-149; PR #956; PR #899  
REGRESSION_RISK: MEDIUM — treating a formation clear as observe+win hydrates a Wave-14 unique id.  
VALIDATION_REQUIRED: A formation encounter that uses Gaunt Mend does not grant Gaunt Mend on clear unless that family already stamped an `ENEMY_DISCOVERY` door and the enemy actually cast it, then the player won.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-165  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/decide metadata flags; union 10-23 sidecars and 10-24 heal decide  
CATEGORY: spell-definition  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #940, open [#947](https://github.com/Mr-Melic/stralt/pull/947) / [#967](https://github.com/Mr-Melic/stralt/pull/967) / [#972](https://github.com/Mr-Melic/stralt/pull/972) / [#974](https://github.com/Mr-Melic/stralt/pull/974) / [#978](https://github.com/Mr-Melic/stralt/pull/978) share execute/decide with advertised Poison/Venom/Inferno ticks, Inferno CD 3 outside `damage>0`, Iron Skin `buffStat: "res"`. 10-24 same-hour flock adds [#985](https://github.com/Mr-Melic/stralt/pull/985) (pack-heal decide vs `decideHealer`; Blood Mend `targetType: "self"` range 0 never reaches a distinct ally) and [#989](https://github.com/Mr-Melic/stralt/pull/989) (pack-heal decide vs `pickBestDamageSpell`, which filters `damage>0` so range-0 heal+CHC never enters the WX heal arm). Both claim `wxEnemyHealDecidePicker.ts` — union **one** `export function` per name. [#984](https://github.com/Mr-Melic/stralt/pull/984) locks Starved Vampire `VAMPIRIC_AOE` minion HP from `damageToTargets` (leftover minion still blocking `shouldAwardVictory` is not a grant). Keys are metadata flags on the spell row (`dotDamage` / `dotDuration` / `cooldown` / `buffStat` / `spellType` / `healAmount` / `range` / `targetType` / `damageToTargets`), never `spell.name`. Motoko `SpellConfig` still has no `targetType` / mechanic flags (`admin.mo` 92–127). 09-23-005 is the persist vehicle. 10-23-151 already covered Frost Bolt MP through enemy-heal CHC.  
SYSTEMS_AFFECTED: kit-execute/decide sidecars; Motoko `SpellConfig`; SpellEditor; observe path  
RECOMMENDED_ACTION: Same rule as 10-23-151. Persist those flags with 09-23-005. Union sidecars; one `export function` per name — #985 and #989 both export `pickWxEnemyHealDecideSpell` / `isWxEnemyHealDecidePickerSpell` on the same file and must not concatenate two copies. Not grants. Hostile kit execute may observe (10-22-138 / #842); player execute must not. Do not write Poison / Inferno / Iron Skin / Blood Mend / Vampiric name tables. Do not steal boss `debuffStat ?? atk` (#843) or summon Shield-on-ward (#865). Blood Mend self-target is persisted `targetType` (173).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 005 exists.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-23-151; SDA-2026-10-24-173; PRs #947 / #967 / #972 / #974 / #978 / #984 / #985 / #989  
REGRESSION_RISK: HIGH if execute branches on `spell.name === "Inferno"` or `"Blood Mend"`. MEDIUM — concatenating a second execute/heal-decide helper fails esbuild.  
VALIDATION_REQUIRED: Rename Iron Skin; advertised RES still executes. Hostile Inferno ticks may observe; player Inferno must not. Rename Blood Mend; self-heal still fires on `targetType`. Duplicate-export scan clean. Leftover VAMPIRIC_AOE minion HP does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-166  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #940; lethal-reflect and one-shot Doka keep are not victory commits  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #940, open [#964](https://github.com/Mr-Melic/stralt/pull/964) / [#969](https://github.com/Mr-Melic/stralt/pull/969) / [#971](https://github.com/Mr-Melic/stralt/pull/971) / [#977](https://github.com/Mr-Melic/stralt/pull/977) / [#979](https://github.com/Mr-Melic/stralt/pull/979) add more `saveBattleStats` remount skips (shop/heal throw-after-accept Doka wipe, death wipe, Doka-heal double charge, rename/upgrade wallet lie after shop/heal and after victory Doka keep). 10-24 same-hour flock adds [#986](https://github.com/Mr-Melic/stralt/pull/986) / [#987](https://github.com/Mr-Melic/stralt/pull/987) (rename/upgrade wallet lie after one-shot shrine/ground/dungeon-complete Doka keep; same sidecar files — union **one** `export function` per name) and [#992](https://github.com/Mr-Melic/stralt/pull/992) (feat Doka keep on a unique `featDokaKeepRemountRenameSpendWriteSkip.ts` slot). Open [#973](https://github.com/Mr-Melic/stralt/pull/973) skips Life Drain heal after lethal same-cast reflect so HP-watch can set `deathTriggered`; live path currently resurrects then still awards `applyRewards`. Default discovery requires **win** after observe (08-31 §4). A remount skip that keeps wallet/XP is not `commitSpellDiscoveries`. A lethal-reflect skip is not a victory. One-shot Doka keep is not a victory commit. 10-23-152 already covered the pre-#940 skip class plus #923 death-gated recap.  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit; recap popup; drain-after-reflect  
RECOMMENDED_ACTION: Same rule as 10-23-152. Union the new skip helpers; one `export function` per name — #986 and #987 both export `committedDokaAfterRenameWithOneShotDokaKeepRemount` / `committedDokaAfterSpellUpgradeWithOneShotDokaKeepRemount` on the same file and must not concatenate two copies. Do not write owned/observed ids inside a remount skip. Death does not clear observation; lethal-reflect skip does not unlock. `ownedSpellIds` / `observedSpellIds` stay append-only on the persist lock (09-23-009).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-23-152; PRs #964 / #969 / #971 / #973 / #977 / #979 / #986 / #987 / #992  
REGRESSION_RISK: HIGH if a victory-Doka, one-shot-Doka, or feat-Doka remount skip is treated as a victory commit and grants an observed id. HIGH if a lethal-reflect resurrect still commits unlocks. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Victory remount does not append `ownedSpellIds`. One-shot / feat Doka keep remount does not append `ownedSpellIds`. Observation from the lost fight stays. Lethal-reflect skip does not unlock. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-167  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Grow closed knownSummonAI with decspan / tallypost enums  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter | guardian | archer | kiter | bomber | kamikaze | healer` (`adminGuard.mo` 363–366; `adminSafety.ts` 19–27). Closed `knownPieceType` still omits `font` / `dummypost` / `pentaspan` / `septspan` (368–373). Queued #953 adds `summonAI: "decspan"` / `"tallypost"`. Queued #890 already added `"ninespan"` / `"poisepost"` (10-23-153). Queued #849 already added `"octspan"` / `"gauntpost"` (10-22-141). Queued #787 adds `"sixspan"`. 09-23-002 / 008 already require the enum on activate and forbid `inferSummonArchetype` name fallback (`enemyAI.ts` 217–224) and `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Empty `summonAI` is a validation error on both client and Motoko when `isSummon` but runtime still coerces `"hunter"` (139).  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` `SUMMON_AIS`; SpellEditor; `enemyAI.ts`; `summonSpawn.ts`  
RECOMMENDED_ACTION: When 09-23-002 ships, extend the **same** closed enum on Motoko and client together: keep today’s seven, add `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `font` / `dummypost` / `pentaspan` / `septspan` only when those cards activate. Never parse `summon.name`. Display name is an explicit `SummonUnitDef.displayName`. Occupy-weight / cap still blocks Dec Span / Nine Span / Oct Span / Six Span / Sept Span activate (161 / 146 / 131).  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-23-153; SDA-2026-10-24-161; PR #953  
REGRESSION_RISK: HIGH if `"decspan"` is inferred from a unit named “Dec”. MEDIUM if the enum grows on one side only (client Save vs Motoko reject).  
VALIDATION_REQUIRED: Activate of a summon with `summonAI="decspan"` and `displayName="Dec Span"` round-trips. Rename the spell; unit name stays. Unknown `summonAI="wolf"` fails client and Motoko with the same string. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-168  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #932 WDEAD occupancy / #957 ENC / #949 WF; not grants  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#932](https://github.com/Mr-Melic/stralt/pull/932) lets occupancy unseals after shock compose with Void Grandmaster `ILLUSION_SPLIT` (#914), Broodmother Rook `LARVAE_SPAWN` (#920), Pale Archivist `INK_VEIL` (#925); unique-corridor copies / larvae / glyphs stay legal. Open [#957](https://github.com/Mr-Melic/stralt/pull/957) adds ENC-DRY-02 / LEAN-01 / ODD-02 / DWELL-01 / GATE-02 / OWN-01 / CINDER-02. Open [#949](https://github.com/Mr-Melic/stralt/pull/949) adds Wave-15 `WF-*` (Vow Gate exploration-only; Sheath File / Orth Picket count as hostiles). Open [#993](https://github.com/Mr-Melic/stralt/pull/993) is Wave-16 WDD (`WDD-2026-10-24-001`); world features still are not grants. Live achievements cannot grant spells. 10-23-155 already said ENC rooms / Table M / enabling wave 14 are not grants. Occupancy unseals and world features are the same class.  
SYSTEMS_AFFECTED: occupancy unseals; encounter rooms; world features; Rush extra tables; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Rooms / features / occupancy unseals may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*`, enabling a `WF-*`, or surviving an illusion/larva/ink-veil copy does not append `ownedSpellIds` unless a named door is stamped. Skip Dec Span / Nine Span occupy while cap is 2. Do not consume #932 / #949 / #957 ids into SDE unique §11. Honour 10-23-155 copy. Never write Rush Table N as canister rooms 10–13. Expansion #944 overkill retarget is not a spell grant.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-10-23-155; SDA-2026-10-24-163; PR #932; PR #957; PR #949; PR #993  
REGRESSION_RISK: MEDIUM — treating an ENC-SPELL-* room clear as observe+win hydrates a Wave-15 unique id. MEDIUM — enabling a Wave-15 `WF-*` hydrates Pack Diag because `usableByPlayer !== false`.  
VALIDATION_REQUIRED: Enabling a Wave-15 world feature does not append `ownedSpellIds`. Clearing ENC-DRY-02 does not grant File Stride. Illusion-split copies do not grant Far Fold. Table N overlay does not call `completeBossRushRoom(10)`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-169  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #961 pixel-pattern and #995 tile-paint extracts; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#961](https://github.com/Mr-Melic/stralt/pull/961) extracts pixel-pattern paint from WX into `engine/pixelPattern.ts`. Unique import slot vs #901 `portalWhirlpool`. Open [#995](https://github.com/Mr-Melic/stralt/pull/995) extracts isometric tile paint into `engine/tilePaint.ts` and restacks WX. Live WX is still 19 213 lines. Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798 / #831 / #901 (10-23-156). Discovery observe/commit helpers belong in `engine/*` / `utils/*`, not another thousand lines on WX. `useSpellQueries.ts` (293 lines) remains the SpellEditor landing. AdminDashboard is 8 280 lines.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/pixelPattern.ts`; `engine/tilePaint.ts`; future observe helpers  
RECOMMENDED_ACTION: Same rule as 10-23-156. Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites; do not grow WX. Prefer #995’s extract over inlining observe/commit. Do not restack AdminDashboard with empty studio tabs. Extract `SpellEditor` onto `useSpellQueries.ts` when 09-23-015 lands. Keep the empty-deps `useCallback` wrapper so #901’s whirlpool context survives.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical extract discipline.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-23-156; PR #961; PR #901; PR #995  
REGRESSION_RISK: HIGH if observe/commit is inlined into WX and the oldest-first restack concatenates a second helper.  
VALIDATION_REQUIRED: WX line count does not grow from this studio. Duplicate-export scan clean. Pixel-pattern paint still runs after the extract lands.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-170  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #945 Admin UX helpers, #980 EBA re-audit, and #996 boss_defeated never unlocks; do not add empty studio tabs or a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#945](https://github.com/Mr-Melic/stralt/pull/945) adds `shouldDismissOwnerConfirm` (Shop/GameKey/delete stay until `#ok`), Tiers/Visuals hydrate honesty, GameKey Escape, Revert-to-Default copy. It does **not** restack `AdminDashboard.tsx`. 10-24 [#980](https://github.com/Mr-Melic/stralt/pull/980) is the EBA re-audit (docs only, **no new EBA IDs**; kit-comment citation restored to WX 11915). Open [#996](https://github.com/Mr-Melic/stralt/pull/996) AFDA drift ledger locks `boss_defeated` as never unlocking a spell (`playerAchievements.ts`). Spell Save is still a live overwrite (`main.mo` 869–879); there is still no `adminRollbackSpellConfig`. Confirm-dismiss is not spell rollback. Three kit sources remain (`data/bossKits.ts`, Motoko `defaultBossConfigs()` purged ids at `admin.mo` 358+, Admin `getSpellConfigs()`). 10-23-157 already covered #887 / #929 / #934. Live tabs (5611–5626) are still the 15 shipped surfaces.  
SYSTEMS_AFFECTED: Admin confirm dialogs; Admin Bosses tab; Motoko boss seed; `bossKits.ts`; achievement unlock helper  
RECOMMENDED_ACTION: Consume #945 helpers; honour #980 as no-new-IDs. Honour #996: `boss_defeated` is not `spellRewardIds`. Union one `export function` per name. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs until activate exists (09-23-015). Do not add a fourth kit table. Prefer #466 for buff id-alias. Do not restack `AdminDashboard.tsx` from this studio. Do not grow WX from this studio. Spell retire toast must still say retired vs deleted once 09-23-001 lands. Do not overwrite #980 EBA or #996 AFDA `*2026-10-24*` files.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 015.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-015; SDA-2026-10-23-157; PR #945; PR #980; PR #996  
REGRESSION_RISK: MEDIUM — a fourth kit table would desync Wave-16 #951 sheets from live combat. MEDIUM — empty studio tabs on the 8 280-line dashboard collide with #334 / #341 / #413 / #470 / #539 / #564. HIGH if `boss_defeated` starts granting Wave-16 signatures.  
VALIDATION_REQUIRED: After 011, live combat, Motoko seed, and Admin chips resolve the same id set. Delete confirm stays until `#ok`. Duplicate-export scan clean. #980 / #996 files stay unique `*2026-10-24*` names; this studio does not overwrite them. `boss_defeated` still does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-171  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #962 / #953 / #951 extra doors; first-grant only  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #962 tags `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` (observe+win teach rooms), `diag_precentor` (Pack Diag `ENEMY_ONLY`), and `far_fold_regent` (Far Fold `BOSS_ONLY`). #953 tags `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. #951 extra-doors leftover #636 Gait Wick / Dry Sting / Home Step / Must Span onto Wave-16 bosses. Prior leftover doors (`poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`, `rank_precentor` / `rank_fold_regent`, Wave-5…15 boss extras) stay first-grant. Live feats cannot grant spells. Restamping a door as a second `spellRewardIds` child double-grants once 012 exists.  
SYSTEMS_AFFECTED: extra-door table; feat/challenge grants; `ownedSpellIds`  
RECOMMENDED_ACTION: First completed child wins; no double copy. Do not hang File Stride / Lean Gift / Tally Mend on `diag_precentor` / `wick_exorcist`. `prime_precentor` stays Cadence Prime’s MULTI child — after 172 that id is the #953 row, not Cadence Rise. `court_prime_regent` is kit-only (`NOT_PLAYER_LEARNABLE`). `far_fold_regent` never writes Far Fold into `ownedSpellIds`. Do not restamp Wave-1…15 leftover feat doors.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012 / 009.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-009; SDA-2026-10-24-160; SDA-2026-10-24-161; SDA-2026-10-24-163; SDA-2026-10-24-172  
REGRESSION_RISK: HIGH if `span_dec` also grants Nine Span / Oct Span. HIGH if `far_fold_regent` writes Far Fold into `ownedSpellIds`.  
VALIDATION_REQUIRED: Extra-door fights grant the stamped id at most once. Pack Diag / Far Fold / Court Prime remain never-owned. Gait Wick door does not also grant Quiet Sill.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-172  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Lean Gift ≠ Tally Mend and Cadence Rise ≠ Cadence Prime  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same-day [#962](https://github.com/Mr-Melic/stralt/pull/962) unique §11 authored `spell-lean-gift` (leftover AP = 0 **and** leftover MP ≥ 1) and `spell-cadence-rise` (remaining `n==1` → 2). Same-day [#953](https://github.com/Mr-Melic/stralt/pull/953) authored `spell-tally-mend` (both-body leftover AP + leftover MP **=== 3**) and `spell-cadence-prime` (remaining `n===0` → 1). These are **distinct holes**, not SDE-wins-the-id collisions like Cadence Floor vs #890 (10-23-159). Aliasing them (`spell-tally-gift`, `spell-cadence-arm`, `spell-lean-mend`, `spell-cd-prime`) would fight activate-id uniqueness and double-grant once ownership exists. SDE law still applies: if a later tactical file clones a unique §11 hole, SDE wins — do not invent a clone to “fix” a collision that does not exist.  
SYSTEMS_AFFECTED: Wave-15 unique catalog; Wave-15 tactical catalog; Wave-16 family CORE; extra doors `prime_precentor` / pale-cantor  
RECOMMENDED_ACTION: Keep all four ids. Do **not** mint `spell-tally-gift` / `spell-lean-mend` / `spell-cadence-arm` / `spell-cd-prime` / `spell-cadence-lift`. Wave-16 family CORE consumes Tally Mend / Cadence Prime / Dec Span / Purse Turn / Tally* / Court Prime, **not** Lean Gift or Cadence Rise. Wave-15 family CORE consumes #837+#890, **not** unique §11. `prime_precentor` remains the MULTI child of the #953 Cadence Prime id. Validator rejects a second catalog row with any of these four ids.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-10-24-160; SDA-2026-10-24-161; SDA-2026-10-23-159; PR #962; PR #953  
REGRESSION_RISK: HIGH if Lean Gift is treated as Tally Mend and hydrate grants it twice. HIGH if Cadence Prime is “fixed” by minting `spell-cadence-arm` (tombstoned as a Floor alias on #890).  
VALIDATION_REQUIRED: After both catalogs exist on paper, the live id set contains exactly one Lean Gift, one Tally Mend, one Cadence Rise, one Cadence Prime, and one Cadence Floor. Wave-16 family CORE lists Tally Mend and does not list Lean Gift. `prime_precentor` grants the #953 id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-173  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #958 AI increment; inspector lists modules by id  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#958](https://github.com/Mr-Melic/stralt/pull/958) adds SYS-90…95. SYS-90 names pack kits resolving only against Motoko `defaultSpells` so bishops ship `spells: []` then Fire Bolt — open #911 owns the writer (10-23-150). SYS-91: Blood Mend is `targetType: "self"` range 0; healer decide targets other allies. Inspector lists modules by **id**, never `spell.name`. Open [#999](https://github.com/Mr-Melic/stralt/pull/999) is the 10-24 AEE increment (docs only). 10-22-143 already said AI increment inspector lists modules by id. Live `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 217–224).  
SYSTEMS_AFFECTED: future AI module inspector; pack kit resolve; SpellEditor targeting  
RECOMMENDED_ACTION: Consume AEE / 09-23-010. Inspector keys off `assignedSpells` / `summonKit` / `aiHint` ids. Do not emit `shadow_strike`. Do not add a fourth kit table. Blood Mend self-target is persisted `targetType` (09-23-005), not a “Heal” name. Prefer #911 over expanding the empty-kit workaround. Filling a kit is still not a grant (150).  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 005.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-005; SDA-2026-10-23-150; SDA-2026-10-22-143; PR #958; PR #911; PR #999  
REGRESSION_RISK: MEDIUM — treating SYS-90 fill as observation hydrates Frost Bolt. HIGH if healer decide starts branching on `spell.name === "Blood Mend"`.  
VALIDATION_REQUIRED: Inspector shows module ids, not display names. Pack-kit fill still does not append `ownedSpellIds`. Blood Mend rename still heals self. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-24-174  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #943 empty-book copy / #950 dual bar schema; not ownedSpellIds  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#943](https://github.com/Mr-Melic/stralt/pull/943) locks `spellbookEmptyCopy.ts` (empty catalog must not mention admin) and `spellbookCancelCopy.ts` (Close keeps spent upgrades). SpellbookModal is not wired. Open [#950](https://github.com/Mr-Melic/stralt/pull/950) locks dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]` and does **not** approve a new required persist field or attach `(with migration)` to live `main.mo`. Live `setSpellBarOrder` still filters to `spellLevelKeys` (`main.mo` 1945–1947). Observation maps still need 09-23-016 (later EOP file after `20260901`; `check-limit = 5`). 10-22-144 already covered #828 minLevel sidecar.  
SYSTEMS_AFFECTED: Spellbook empty/cancel copy; `spellBarOrder`; future `ownedSpellIds` / `observedSpellIds` EOP file  
RECOMMENDED_ACTION: Prefer the sidecars — do not recopy into `adminSafety.ts`. Empty-book copy is not a catalog grant and must not tell players to open Admin. Dual bar schema is not ownership. New persist maps go through 09-23-016; do not sneak `ownedSpellIds` onto a shipped `NewActor`. Retired-owned still shows a Retired seal once 09-23-001 lands. Union helpers; one `export function` per name.  
AUTONOMY: HUMAN_APPROVE — with 09-23-016 / 003.  
DEPENDENCIES: SDA-2026-09-23-016; SDA-2026-09-23-003; SDA-2026-09-23-001; SDA-2026-10-22-144; PR #943; PR #950  
REGRESSION_RISK: HIGH if empty-book copy is “fixed” by hydrating `starterSpells`. HIGH if dual `activeSpells` is migrated as `ownedSpellIds`. MEDIUM — concatenating a second copy helper fails esbuild.  
VALIDATION_REQUIRED: Empty spellbook copy never mentions admin. Close after an upgrade spend does not refund. #950 helpers do not add a Motoko stable. Duplicate-export scan clean.  
STATUS: NEW  

# ACTION_IDs — 2026-10-25 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-25.md`](./SPELL_ADMIN_DESIGN_2026-10-25.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-25 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940); 10-24 queue-union IDs `160` … `174` live on [#1007](https://github.com/Mr-Melic/stralt/pull/1007). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **175–189** (queue after #1007). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **728+** at this patch (same-hour flock continued through **#1074**). Newest sibling before this work: **#1074** (`MASTER_ROADMAP.md` 2026-10-25 — pre-existing oldest-first conflict, skipped; this PR does not touch that file). Calendar: 2026-10-25. Same-hour flock `#1043`–`#1074` uses unique dated filenames — do not overwrite #1044 EBA, #1050 WDEAD, #1055 AFDA, #1056 ENC, #1060 UX, #1063 Wave-17 tactical, #1064 WDD, #1066 Admin UX, #1072 AEE, #1073 Wave-17 elite, or the telemetry/VAL/Expansion/TBC/dead-code pair. #870 / #946 / #998 / #1074 `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-25-175  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1017 Wave-16 SDE stamps; do not pre-own generationMin 16 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1017](https://github.com/Mr-Melic/stralt/pull/1017) is Wave-16 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md`, `generationMin: 16`). Unique §11 ids (`spell-ring-stride`, `spell-hepta-oath`, `spell-rime-reel`, `spell-rank-bite`, `spell-last-mark`, `spell-dual-plate`, `spell-rift-skip`, `spell-fresh-sting`, `spell-summon-file`, `spell-prime-gift`, `spell-cadence-cap`, `spell-gait-toll`, `spell-brick-hold`, `spell-watch-drain`, `spell-even-gait`, `spell-rime-cut`, `spell-cast-plate`, `spell-pack-orth`, `spell-leap-fold`) stay this catalog’s. `spell-pack-orth` is `ENEMY_ONLY`. `spell-leap-fold` is `BOSS_ONLY`. Prime Gift is leftover AP **exactly 1** and leftover MP **exactly 1**. Cadence Cap is remaining `n>2` → 2. Wave-16 family CORE is #906 unique + #953 (via #997). Unique §11 stay extras until Wave 18. Unique Wave-15 §11 (#962) stay extras until Wave 17. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-16 unique ids into that array, or hydrating Pack Orth because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-24-160 already said the same for Wave-15 `#962`. Still-open #982 freezes **shipping** those rows until 09-23-003.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-16 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, 10-23-145, and 10-24-160. Honour #1017 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Prime Gift or Cadence Cap (see 187). Do not restamp Wave-1…15 doors or #890 / #906 / #953 / #962 / #1011 extra doors. Do not implement Wave-16 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Orth / Leap Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-24-160; SDA-2026-10-25-187; PR #1017; PR #1011  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-16 ids. HIGH if `ENEMY_ONLY` Pack Orth is hydrated because `usableByPlayer !== false`. HIGH if `leap_fold_regent` also grants Ring Stride. HIGH if a Prime Gift / Cadence Cap clone ships beside the #1017 ids.  
VALIDATION_REQUIRED: After a Wave-16 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Prime Gift / Cadence Cap id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-176  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #1011 Wave-16 tactical as Wave-17 CORE; Court Snuff never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1011](https://github.com/Mr-Melic/stralt/pull/1011) (`SPELL_PROPOSALS_2026-10-24.md`) owns leftover holes #953 / #962 / #1017 did not take: `spell-score-mend`, `spell-cadence-snuff`, `spell-hendeca-span`, `spell-duel-turn`, `spell-score-hood`, `spell-score-sting`, `spell-score-step`, `spell-score-sill`, `spell-score-hold`, `spell-score-lend`, `spell-score-sip`, `spell-score-post`, `spell-score-bounce`, `spell-must-score`, `spell-verse-score`, `spell-court-snuff`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-snuff` is `NOT_PLAYER_LEARNABLE`. Hendeca Span is stretched-plus occupy of **eleven**; live `ENEMY_SUMMON_CAP` is still 2 (`gameConstants.ts` 300), so that card is implementation-blocked (`summonAI: "hendecaspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` must not be restamped by SDE unique §11 or Wave-17 families. Cadence Snuff is remaining `n===1` → 0 — **not** Cadence Rise (`n==1` → 2), **not** Cadence Prime (`n===0` → 1), **not** Cadence Cap (`n>2` → 2). Wave **17** families consume the #1011 ids as CORE. Live hydrate still pre-owns all 32 `starterSpells`. 10-24-161 covered Wave-15 tactical (#953) only.  
SYSTEMS_AFFECTED: Wave-16 tactical catalog; Wave-17 family CORE; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #1011 ids. Do not clone them into SDE unique §11. `spell-court-snuff` never enters `ownedSpellIds`. Do not activate Hendeca Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy / Dec Span / Nine Span / Oct Span. Extra doors are first-grant; do not also hang Ring Stride / Prime Gift / Leap Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `hendecaspan` / `scorepost` are real, not via a name parse (182). Do not mint `spell-score-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop`. Same-hour [#1063](https://github.com/Mr-Melic/stralt/pull/1063) is Wave-17 tactical / Wave-**18** family CORE (Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn / Court Dock) — do **not** clone those holes onto #1011 ids; Court Dock never owned; Dodeca Span blocked at cap 2. Do not overwrite `SPELL_PROPOSALS_2026-10-25.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-10-25-175; SDA-2026-10-25-187; SDA-2026-10-24-161; PR #1011  
REGRESSION_RISK: HIGH if Court Snuff hydrates as a catalog grant. HIGH if Cadence Snuff is aliased onto Cadence Rise / Cadence Prime / Cadence Cap. MEDIUM if Hendeca Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Snuff. Cadence Floor remains the #906 id. Cadence Rise remains the #962 id. Cadence Prime remains the #953 id. Cadence Cap remains the #1017 id. Cadence Snuff remains the #1011 id. Hendeca Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-177  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #997 Wave-16 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#997](https://github.com/Mr-Melic/stralt/pull/997) stamps Wave-16 family CORE from #906 unique verbs (except Pack Rank / Rank Fold / Cadence Floor) plus #953 tactical (except Court Prime). Pack Rank / Rank Fold / Pack Diag / Far Fold / Pack Orth / Leap Fold / Court Floor / Court Prime / Court Snuff stay kit-only / never-owned. SDE Wave-16 unique CORE waits for Wave 18. Same-day #1011 stays Wave 17. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone. 10-24-162 already said the same for Wave-15 `#941`.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-16 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #997 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone. Do not mint Wave-16 unique CORE (`spell-ring-stride` …) as this pass’s CORE. Do not CORE Pack Orth / Leap Fold (#1017). Do not CORE Score Mend / Court Snuff (#1011). Same-hour [#1073](https://github.com/Mr-Melic/stralt/pull/1073) is Wave-**17** elite (leftover Wave-15 unique §11 except Pack Diag / Far Fold **plus** #1011 except Court Snuff) — honour as ids; do not pre-own; do not overwrite `ENEMY_ELITE_EVOLUTION_2026-10-25.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-10-24-162; PR #997  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Pack Orth / Leap Fold / Court Snuff is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn still does not silently own Rank Stride / Tally Mend. Pack Rank / Rank Fold / Pack Orth / Leap Fold / Court Floor / Court Prime / Court Snuff never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-178  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1004 Wave-17 boss / Rush Table O; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1004](https://github.com/Mr-Melic/stralt/pull/1004) unions Wave 17 + Rush **Table O** onto `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. New bosses `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` are not in live `BOSS_IDS`. Extra doors on leftover #636 Boot Lend / Purse Keep / Tick Plate / Last Mute. Spectacular `CHOIR_BOOT` / `NAVE_KEEP` / `NAVE_TICK` / `CHOIR_MUTE` stay `BOSS_ONLY`. Court Hinge and Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table O is four post-Table-N rooms; canister `completeBossRushRoom` still must not see `roomIndex > 9`. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. 10-24-163 already said the same for Wave-16 `#951` / Table N.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #1004 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-24-170). Do not restamp Wave-1…16 feat doors, leftover #563 Dummy Post / Enter Mend / Split Mend, leftover #636 Quiet Sill / Gait Wick / Dry Sting / Home Step / Must Span / Shove Mend / Exit Sting / Cadence Stretch / Far Hood (#836 / #903 / #951), or #890 / #953 / #1011 extra doors. Table O is owner overlay, never a 10th canister room. Quad Span / Hendeca Span stay off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-24-163; SDA-2026-10-25-185; PR #1004  
REGRESSION_RISK: HIGH if `CHOIR_BOOT` hydrates as a player grant. MEDIUM if Table O is written as `currentRoom` 10–13 and `setBossRushProgress` traps on decrease.  
VALIDATION_REQUIRED: After Wave-17 sheets exist on paper, a new character does not own Boot Lend / Last Mute from hydrate. Completing Table O does not call `completeBossRushRoom(10)`. Admin Bosses tab still has one live kit source after 011.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-179  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1005 Wave-15 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1005](https://github.com/Mr-Melic/stralt/pull/1005) proposes 16 world-pack formations that consume Wave-15 families from [#941](https://github.com/Mr-Melic/stralt/pull/941) (Poise Choir, Nine Plug, Knight Quad, and related teaching pairs). Design only — no production spawn tables. Live `EnemyFamily` remains the original seven. Wave-16 families (#997) stay unfamilied for drop 17. 10-24-164 already said the same for Wave-14 formations `#956`. Formations are not `spellRewardIds` and not observe+win. Nine Plug stays skipped while `ENEMY_SUMMON_CAP` is 2.  
SYSTEMS_AFFECTED: future formation catalog; family CORE; `ownedSpellIds`  
RECOMMENDED_ACTION: Same rule as 10-24-164. Consume already-stamped CORE ids. Clearing `FSN-*` does not append `ownedSpellIds` unless a named door is stamped. Do not mint formation-only spell ids. Do not grow WX spawn. Skip Nine Plug / Hendeca occupy while cap is 2.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-24-164; PR #1005; PR #941  
REGRESSION_RISK: MEDIUM — treating a formation clear as observe+win hydrates a Wave-15 unique id.  
VALIDATION_REQUIRED: A formation encounter that uses Poise Mend does not grant Poise Mend on clear unless that family already stamped an `ENEMY_DISCOVERY` door and the enemy actually cast it, then the player won.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-180  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/decide metadata flags; union heal approach/guard and Paper Windstorm range  
CATEGORY: spell-definition  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #1007, open [#1026](https://github.com/Mr-Melic/stralt/pull/1026) / [#1033](https://github.com/Mr-Melic/stralt/pull/1033) / [#1034](https://github.com/Mr-Melic/stralt/pull/1034) / [#1039](https://github.com/Mr-Melic/stralt/pull/1039) share pack-heal approach and backline-guard with Frost then Inferno fallback on unique `wxEnemyHealApproachFrost.ts` / `wxEnemyHealApproachDot.ts` / `wxEnemyHealGuardFrost.ts` / `wxEnemyHealGuardDot.ts` slots (do **not** concatenate onto #985/#989 `wxEnemyHealDecidePicker.ts`). Open [#1042](https://github.com/Mr-Melic/stralt/pull/1042) gates Paper Windstorm player miss on `spell.range > 1` (`paperWindstormSpellRangeCanMiss`), matching enemy apply — never `spell.name === "Strike"` / `"Paper Windstorm"`. Open [#1040](https://github.com/Mr-Melic/stralt/pull/1040) / [#1022](https://github.com/Mr-Melic/stralt/pull/1022) / [#1027](https://github.com/Mr-Melic/stralt/pull/1027) / [#1035](https://github.com/Mr-Melic/stralt/pull/1035) lock boss `CURSE_ON_HIT` / queen-ray / chain-lightning / Exsanguinated commits from `damageToTargets` / `healRecv` (leftover minion still blocking `shouldAwardVictory` is not a grant). Same-hour [#1054](https://github.com/Mr-Melic/stralt/pull/1054) shares pack-caster wounded-retreat with Frost fallback on unique `wxEnemyCasterRetreatFrost.ts` — still `healAmount` / `range` / `targetType`, never `spell.name`. Same-hour [#1058](https://github.com/Mr-Melic/stralt/pull/1058) commits Midnight Bishop merge onto advertised `MAGIC_REFLECT` (`midnightBishopMagicReflectCommit.ts`) — metadata flag, never `"Midnight Bishop"`. Keys are metadata flags on the spell row (`healAmount` / `range` / `targetType` / `damageToTargets` / `debuffStat` / `MAGIC_REFLECT`), never `spell.name`. Motoko `SpellConfig` still has no `targetType` / mechanic flags (`types/admin.mo` 92–127). 09-23-005 is the persist vehicle. 10-24-165 already covered pack-heal decide vs `decideHealer` / `pickBestDamageSpell`.  
SYSTEMS_AFFECTED: kit-execute/decide sidecars; Motoko `SpellConfig`; SpellEditor; observe path; Paper Windstorm miss  
RECOMMENDED_ACTION: Same rule as 10-24-165. Persist those flags with 09-23-005. Union sidecars; one `export function` per name — do not concatenate approach/guard/retreat helpers onto the 10-24 heal-decide picker. Not grants. Hostile kit execute may observe (10-22-138 / #842); player execute must not. Do not write Blood Mend / Inferno / Frost / Paper Windstorm / Strike name tables. Blood Mend self-target is persisted `targetType` (188). Paper Windstorm miss uses `spell.range`. Caster retreat is not a grant.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 005 exists.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-24-165; SDA-2026-10-25-188; PRs #1026 / #1033 / #1034 / #1039 / #1042 / #1040 / #1022 / #1027 / #1035 / #1054 / #1058  
REGRESSION_RISK: HIGH if execute branches on `spell.name === "Inferno"` or `"Blood Mend"` or `"Strike"`. MEDIUM — concatenating a second heal-approach helper onto `wxEnemyHealDecidePicker.ts` fails esbuild.  
VALIDATION_REQUIRED: Rename Blood Mend; self-heal still fires on `targetType`. Hostile Inferno ticks may observe; player Inferno must not. Strike (`range` 1) does not roll Paper Windstorm miss; a `range` 4 poke does. Duplicate-export scan clean. Leftover VAMPIRIC_AOE / queen-ray minion HP does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-181  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #1007; leftover-XP keep is not a victory commit  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #1007, open [#1019](https://github.com/Mr-Melic/stralt/pull/1019) / [#1020](https://github.com/Mr-Melic/stralt/pull/1020) / [#1021](https://github.com/Mr-Melic/stralt/pull/1021) / [#1024](https://github.com/Mr-Melic/stralt/pull/1024) / [#1025](https://github.com/Mr-Melic/stralt/pull/1025) / [#1028](https://github.com/Mr-Melic/stralt/pull/1028) / [#1029](https://github.com/Mr-Melic/stralt/pull/1029) / [#1031](https://github.com/Mr-Melic/stralt/pull/1031) / [#1032](https://github.com/Mr-Melic/stralt/pull/1032) add more `saveBattleStats` remount skips (rename/upgrade wallet lie after GameKey / Boss Rush Doka keep; feat/GameKey wallet lie after shop/heal throw, spend, Boss Rush, victory, one-shot, GameKey, feat Doka keep) on unique sidecar files. Open [#1036](https://github.com/Mr-Melic/stralt/pull/1036) / [#1037](https://github.com/Mr-Melic/stralt/pull/1037) / [#1041](https://github.com/Mr-Melic/stralt/pull/1041) skip leftover-XP wipe after leftover-XP keep and after portal XP throw keep. Same-hour [#1043](https://github.com/Mr-Melic/stralt/pull/1043) skips leftover-XP wipe after victory XP throw keep; [#1045](https://github.com/Mr-Melic/stralt/pull/1045) / [#1046](https://github.com/Mr-Melic/stralt/pull/1046) share `portalXpKeepRemountRenameSpendWriteSkip.ts` (union **one** export — do not concatenate). Default discovery requires **win** after observe (08-31 §4). A remount skip that keeps wallet/XP is not `commitSpellDiscoveries`. Leftover-XP keep is not a victory. 10-24-166 already covered the pre-#1007 skip class plus #973 lethal-reflect drain skip.  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit; recap popup  
RECOMMENDED_ACTION: Same rule as 10-24-166. Union the new skip helpers; one `export function` per name — these files are unique vs #986/#987/#992 and must not concatenate two copies of `committedDokaAfterRenameWithOneShotDokaKeepRemount` or of `portalXpKeepRemountRenameSpendWriteSkip`. Do not write owned/observed ids inside a remount skip. Death does not clear observation; leftover-XP keep does not unlock. `ownedSpellIds` / `observedSpellIds` stay append-only on the persist lock (09-23-009).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-24-166; PRs #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043 / #1045 / #1046  
REGRESSION_RISK: HIGH if a victory-Doka, leftover-XP, or feat-Doka remount skip is treated as a victory commit and grants an observed id. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Victory remount does not append `ownedSpellIds`. Leftover-XP keep remount does not append `ownedSpellIds`. Observation from the lost fight stays. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-182  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Grow closed knownSummonAI with hendecaspan / scorepost enums  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter | guardian | archer | kiter | bomber | kamikaze | healer` (`adminGuard.mo` 363–366; `adminSafety.ts` 19–27). Closed `knownPieceType` still omits `font` / `dummypost` / `pentaspan` / `septspan` (368–373). Queued #1011 adds `summonAI: "hendecaspan"` / `"scorepost"`. Queued #953 already added `"decspan"` / `"tallypost"` (10-24-167). Queued #890 already added `"ninespan"` / `"poisepost"` (10-23-153). Queued #849 already added `"octspan"` / `"gauntpost"` (10-22-141). Queued #787 adds `"sixspan"`. 09-23-002 / 008 already require the enum on activate and forbid `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224) and `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Empty `summonAI` is a validation error on both client and Motoko when `isSummon` but runtime still coerces `"hunter"` (139). Queued #1018 `formatSummonDisplayName` title-cases `pieceType` and is **not** this enum.  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` `SUMMON_AIS`; SpellEditor; `enemyAI.ts`; `summonSpawn.ts`  
RECOMMENDED_ACTION: When 09-23-002 ships, extend the **same** closed enum on Motoko and client together: keep today’s seven, add `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `font` / `dummypost` / `pentaspan` / `septspan` only when those cards activate. Never parse `summon.name`. Display name is an explicit `SummonUnitDef.displayName`. Occupy-weight / cap still blocks Hendeca Span / Dec Span / Nine Span / Oct Span / Six Span / Sept Span activate (176 / 161 / 146 / 131).  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-24-167; SDA-2026-10-25-176; PR #1011  
REGRESSION_RISK: HIGH if `"hendecaspan"` is inferred from a unit named “Hendeca”. MEDIUM if the enum grows on one side only (client Save vs Motoko reject).  
VALIDATION_REQUIRED: Activate of a summon with `summonAI="hendecaspan"` and `displayName="Hendeca Span"` round-trips. Rename the spell; unit name stays. Unknown `summonAI="wolf"` fails client and Motoko with the same string. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-183  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1015/#1050 WDEAD / #1006/#1056 ENC / #993 WF; not grants  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1015](https://github.com/Mr-Melic/stralt/pull/1015) is the 10-24 world/dungeon/encounter admin design (occupancy / persist-keep rails continue after #932). Same-hour [#1050](https://github.com/Mr-Melic/stralt/pull/1050) is the 10-25 WDEAD re-audit (occupancy/remount rails after #1015; unique `*2026-10-25*` files — **do not overwrite**). Open [#1006](https://github.com/Mr-Melic/stralt/pull/1006) adds ENC-GAUNT-01 / BARE-01 / EVEN-02 / WAKE-01 / GATE-03 / TRI-01 / DUMP-01 / CURTAIN-01 / GLYPH-01 / ALMS-01 / DEBT-01 / PAIR-04 / HOLD-05. Same-hour [#1056](https://github.com/Mr-Melic/stralt/pull/1056) is Poise/Knight/Pit/Spent (`ENC-TEACH-17` / `ENC-POISE-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-SPENT-02` / `ENC-RUSH-63`…`66`). Open [#993](https://github.com/Mr-Melic/stralt/pull/993) is Wave-16 WDD (`WDD-2026-10-24-001`); same-hour [#1064](https://github.com/Mr-Melic/stralt/pull/1064) is Wave-17 WDD (`WDD-2026-10-25-001`, restacks `docs/WORLD_DYNAMICS.md`). World features still are not grants. Live achievements cannot grant spells. 10-24-168 already said ENC rooms / occupancy unseals / world features are not grants. `ENC-EVEN-02` is not Even Gait. `ENC-TRI-01` is not Hepta Oath. `ENC-POISE-01` is not Poise Mend.  
SYSTEMS_AFFECTED: occupancy unseals; encounter rooms; world features; Rush extra tables; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Rooms / features / occupancy unseals may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*`, enabling a `WF-*`, or surviving an occupancy unseal does not append `ownedSpellIds` unless a named door is stamped. Skip Hendeca Span / Dec Span / Nine Span occupy while cap is 2. Do not consume #1015 / #1050 / #1006 / #1056 / #993 ids into SDE unique §11. Honour 10-24-168 copy. Never write Rush Table O as canister rooms 10–13. Do not overwrite #1015 / #1006 / #993 `*2026-10-24*` files or #1050 / #1056 `*2026-10-25*` files. Do not restack `WORLD_DYNAMICS.md` from this studio (#1064 owns Wave-17 ids).  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-10-24-168; SDA-2026-10-25-178; PR #1015; PR #1050; PR #1006; PR #1056; PR #993; PR #1064  
REGRESSION_RISK: MEDIUM — treating an ENC-GAUNT-01 or ENC-POISE-01 room clear as observe+win hydrates a Wave-15/16 unique id. MEDIUM — enabling a Wave-16 `WF-*` hydrates Pack Orth because `usableByPlayer !== false`.  
VALIDATION_REQUIRED: Enabling a Wave-16 world feature does not append `ownedSpellIds`. Clearing ENC-EVEN-02 does not grant Even Gait. Clearing ENC-POISE-01 does not grant Poise Mend. Occupancy unseals do not grant Leap Fold. Table O overlay does not call `completeBossRushRoom(10)`. #1050 / #1056 dated files stay unique.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-184  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep later combat helpers in engine/*; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No new WX extract after [#995](https://github.com/Mr-Melic/stralt/pull/995) (`engine/tilePaint.ts`) and [#961](https://github.com/Mr-Melic/stralt/pull/961) (`engine/pixelPattern.ts`). Later combat/heal helpers after #1007 landed in `engine/wxEnemyHealApproachFrost.ts` / `wxEnemyHealApproachDot.ts` / `wxEnemyHealGuardFrost.ts` / `wxEnemyHealGuardDot.ts` / `paperWindstormRangeMiss.ts` / boss HP commit files. Live WX is still 19 213 lines. Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798 / #831 / #901 (10-23-156 / 10-24-169). Discovery observe/commit helpers belong in `engine/*` / `utils/*`, not another thousand lines on WX. `useSpellQueries.ts` (293 lines) remains the SpellEditor landing. AdminDashboard is 8 280 lines.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; later `engine/*` helpers; future observe helpers  
RECOMMENDED_ACTION: Same rule as 10-24-169. Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites; do not grow WX. Prefer those extracts over inlining observe/commit. Do not restack AdminDashboard with empty studio tabs. Extract `SpellEditor` onto `useSpellQueries.ts` when 09-23-015 lands. Keep the empty-deps `useCallback` wrapper so #901’s whirlpool context survives.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical extract discipline.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-24-169; PR #995; PR #961; PR #901  
REGRESSION_RISK: HIGH if observe/commit is inlined into WX and the oldest-first restack concatenates a second helper.  
VALIDATION_REQUIRED: WX line count does not grow from this studio. Duplicate-export scan clean. Pixel-pattern / tile-paint / heal-approach still run after those extracts land.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-185  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1001 Admin UX helpers, #980/#1044 EBA re-audits, and #996/#1055 boss_defeated never unlocks; do not add empty studio tabs or a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1001](https://github.com/Mr-Melic/stralt/pull/1001) adds names-busy, role-grant, confirm-chrome, and grant-link helpers. It does **not** restack `AdminDashboard.tsx`. 10-24 [#980](https://github.com/Mr-Melic/stralt/pull/980) and same-hour [#1044](https://github.com/Mr-Melic/stralt/pull/1044) are EBA re-audits (docs only, **no new EBA IDs**; unique `*2026-10-25*` files on #1044 — **do not overwrite**). Open [#996](https://github.com/Mr-Melic/stralt/pull/996) AFDA drift ledger locks `boss_defeated` as never unlocking a spell (`playerAchievements.ts`, 042). Same-hour [#1055](https://github.com/Mr-Melic/stralt/pull/1055) adds AFDA-043: Admin `effectParams` JSON round-trips; combat never parses `pushDistance` / `attractDistance` / `teleportMode` — unread JSON is **not** 09-23-005 mechanic-flag persist. Spell Save is still a live overwrite (`main.mo` 869–879); there is still no `adminRollbackSpellConfig`. Confirm-chrome is not spell rollback. Three kit sources remain (`data/bossKits.ts`, Motoko `defaultBossConfigs()` purged ids at `admin.mo` 358+, Admin `getSpellConfigs()`). 10-24-170 already covered #945 / #980 / #996. Live tabs (5611–5626) are still the 15 shipped surfaces.  
SYSTEMS_AFFECTED: Admin confirm dialogs; Admin Bosses tab; Motoko boss seed; `bossKits.ts`; achievement unlock helper  
RECOMMENDED_ACTION: Consume #1001 helpers; honour #980 / #1044 as no-new-IDs. Honour #996 / #1055: `boss_defeated` is not `spellRewardIds`; unread `effectParams` is not mechanic-flag persist. Union one `export function` per name. Do not ship empty Discovery / Kits / Graph / Versions / Challenges / AI / Formations tabs until activate exists (09-23-015). Do not add a fourth kit table. Prefer #466 for buff id-alias. Do not restack `AdminDashboard.tsx` from this studio. Do not grow WX from this studio. Spell retire toast must still say retired vs deleted once 09-23-001 lands. Do not overwrite #980 EBA or #996 AFDA `*2026-10-24*` files, or #1044 EBA / #1055 AFDA / #1066 Admin UX `*2026-10-25*` files. Same-hour [#1066](https://github.com/Mr-Melic/stralt/pull/1066) principal-gate / confirm-enter / reveal-mask / ban-reason helpers still do **not** restack `AdminDashboard.tsx` and are not spell rollback.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 015.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-015; SDA-2026-10-24-170; PR #1001; PR #980; PR #996; PR #1044; PR #1055; PR #1066  
REGRESSION_RISK: MEDIUM — a fourth kit table would desync Wave-17 #1004 sheets from live combat. MEDIUM — empty studio tabs on the 8 280-line dashboard collide with #334 / #341 / #413 / #470 / #539 / #564. HIGH if `boss_defeated` starts granting Wave-17 signatures. HIGH if `effectParams` JSON is treated as shipped `targetType` / mechanic flags.  
VALIDATION_REQUIRED: After 011, live combat, Motoko seed, and Admin chips resolve the same id set. Delete confirm stays until `#ok`. Duplicate-export scan clean. #980 / #996 files stay unique `*2026-10-24*` names; #1044 / #1055 stay unique `*2026-10-25*` names; this studio does not overwrite them. `boss_defeated` still does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-186  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1017 / #1011 / #1004 extra doors; first-grant only  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #1017 tags `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` (observe+win teach rooms), `lane_precentor` (Pack Orth `ENEMY_ONLY`), and `leap_fold_regent` (Leap Fold `BOSS_ONLY`). #1011 tags `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. #1004 extra-doors leftover #636 Boot Lend / Purse Keep / Tick Plate / Last Mute onto Wave-17 bosses. Prior leftover doors (`tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`, `file_gallery` / `diag_precentor` / `far_fold_regent`, Wave-5…16 boss extras) stay first-grant. Live feats cannot grant spells. Restamping a door as a second `spellRewardIds` child double-grants once 012 exists.  
SYSTEMS_AFFECTED: extra-door table; feat/challenge grants; `ownedSpellIds`  
RECOMMENDED_ACTION: First completed child wins; no double copy. Do not hang Ring Stride / Prime Gift / Score Mend on `lane_precentor` / `boot_subprior`. `snuff_precentor` stays Cadence Snuff’s MULTI child — after 187 that id is the #1011 row, not Cadence Cap. `court_snuff_regent` is kit-only (`NOT_PLAYER_LEARNABLE`). `leap_fold_regent` never writes Leap Fold into `ownedSpellIds`. Do not restamp Wave-1…16 leftover feat doors.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012 / 009.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-009; SDA-2026-10-25-175; SDA-2026-10-25-176; SDA-2026-10-25-178; SDA-2026-10-25-187  
REGRESSION_RISK: HIGH if `span_hendeca` also grants Dec Span / Nine Span / Oct Span. HIGH if `leap_fold_regent` writes Leap Fold into `ownedSpellIds`.  
VALIDATION_REQUIRED: Extra-door fights grant the stamped id at most once. Pack Orth / Leap Fold / Court Snuff remain never-owned. Boot Lend door does not also grant Quiet Sill.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-187  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Prime Gift ≠ Score Mend and Cadence Cap ≠ Cadence Snuff  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same-day [#1017](https://github.com/Mr-Melic/stralt/pull/1017) unique §11 authored `spell-prime-gift` (leftover AP **exactly 1** and leftover MP **exactly 1**) and `spell-cadence-cap` (remaining `n>2` → 2). Same-day [#1011](https://github.com/Mr-Melic/stralt/pull/1011) authored `spell-score-mend` (both-body leftover AP + leftover MP **=== 4 AND leftover AP ≠ leftover MP**) and `spell-cadence-snuff` (remaining `n===1` → 0). These are **distinct holes**, not SDE-wins-the-id collisions like Cadence Floor vs #890 (10-23-159). Aliasing them (`spell-score-gift`, `spell-cadence-kill`, `spell-prime-mend`, `spell-cd-snuff`) would fight activate-id uniqueness and double-grant once ownership exists. SDE law still applies: if a later tactical file clones a unique §11 hole, SDE wins — do not invent a clone to “fix” a collision that does not exist. Dual Plate (AND even ≥ 2) is also not Score Hood.  
SYSTEMS_AFFECTED: Wave-16 unique catalog; Wave-16 tactical catalog; Wave-17 family CORE; extra doors `snuff_precentor` / pale-cantor  
RECOMMENDED_ACTION: Keep all four ids. Do **not** mint `spell-score-gift` / `spell-prime-mend` / `spell-cadence-kill` / `spell-cd-snuff` / `spell-cadence-drop`. Same-hour [#1063](https://github.com/Mr-Melic/stralt/pull/1063) Stave Mend (both-body leftover **sum === 5**) and Cadence Dock (`n===2` → 0) are **distinct** Wave-17 tactical ids — not Score Mend, not Prime Gift, not Cadence Snuff, not Cadence Cap. Do not mint `spell-stave-gift` / `spell-cadence-deuce` / `spell-twelve-span`. Wave-17 family CORE consumes Score Mend / Cadence Snuff / Hendeca Span / Duel Turn / Score\* / Court Snuff, **not** Prime Gift or Cadence Cap. Wave-18 family CORE consumes #1063, **not** #1017 unique §11. Wave-16 family CORE consumes #906+#953, **not** unique §11. `snuff_precentor` remains the MULTI child of the #1011 Cadence Snuff id. Validator rejects a second catalog row with any of these four ids.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-10-25-175; SDA-2026-10-25-176; SDA-2026-10-24-172; PR #1017; PR #1011  
REGRESSION_RISK: HIGH if Prime Gift is treated as Score Mend and hydrate grants it twice. HIGH if Cadence Snuff is “fixed” by minting `spell-cadence-kill` (tombstoned as a Floor alias on #890).  
VALIDATION_REQUIRED: After both catalogs exist on paper, the live id set contains exactly one Prime Gift, one Score Mend, one Cadence Cap, one Cadence Snuff, one Cadence Rise, one Cadence Prime, and one Cadence Floor. Wave-17 family CORE lists Score Mend and does not list Prime Gift. `snuff_precentor` grants the #1011 id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-188  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #958 / #999 AI increment; inspector lists modules by id  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#958](https://github.com/Mr-Melic/stralt/pull/958) adds SYS-90…95. SYS-90 names pack kits resolving only against Motoko `defaultSpells` so bishops ship `spells: []` then Fire Bolt — open #911 owns the writer (10-23-150). SYS-91: Blood Mend is `targetType: "self"` range 0; healer decide targets other allies. Inspector lists modules by **id**, never `spell.name`. Open [#999](https://github.com/Mr-Melic/stralt/pull/999) is the 10-24 AEE increment (docs only). Same-hour [#1072](https://github.com/Mr-Melic/stralt/pull/1072) is the 10-25 AEE increment (unique `ENEMY_AI_EVOLUTION_2026-10-25.md` — **do not overwrite**). Later pack-heal approach/guard helpers (#1026/#1033/#1034/#1039) still key off `healAmount` / `range` / `targetType`. 10-24-173 already said AI increment inspector lists modules by id. Live `inferSummonArchetype` still falls back to `summon.name` (`enemyAI.ts` 203–224).  
SYSTEMS_AFFECTED: future AI module inspector; pack kit resolve; SpellEditor targeting  
RECOMMENDED_ACTION: Consume AEE / 09-23-010. Inspector keys off `assignedSpells` / `summonKit` / `aiHint` ids. Do not emit `shadow_strike`. Do not add a fourth kit table. Blood Mend self-target is persisted `targetType` (09-23-005), not a “Heal” name. Prefer #911 over expanding the empty-kit workaround. Filling a kit is still not a grant (150). Later heal-approach/guard helpers stay unique files (180).  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 005.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-005; SDA-2026-10-24-173; SDA-2026-10-23-150; SDA-2026-10-25-180; PR #958; PR #911; PR #999; PR #1072  
REGRESSION_RISK: MEDIUM — treating SYS-90 fill as observation hydrates Frost Bolt. HIGH if healer decide starts branching on `spell.name === "Blood Mend"`.  
VALIDATION_REQUIRED: Inspector shows module ids, not display names. Pack-kit fill still does not append `ownedSpellIds`. Blood Mend rename still heals self. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-25-189  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1018 summon title-case / #1014 persist locks; not ownedSpellIds or lifecycle  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1018](https://github.com/Mr-Melic/stralt/pull/1018) locks journey copy helpers and `formatSummonDisplayName` (title-case `pieceType` / raw name → `"Knight"`). Spawn still does `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Open [#1014](https://github.com/Mr-Melic/stralt/pull/1014) locks `catalogDeletePolicy` (spells/achievements retire when referenced via `usableByPlayer=false` / `active=false`; enemies hard-remove), `summonUnitDefPersist` (Motoko unit def is still `pieceType` / `level` / `hpScale` / `damageScale`; `summonKit` / `ap` / `mp` drop on round-trip), and `legacyActiveSpellsMigrate` (dual `activeSpells : ?[Nat]` vs `spellBarOrder : ?[Text]`). Live `setSpellBarOrder` still filters to `spellLevelKeys` (`main.mo` 1945–1947). Observation maps still need 09-23-016 (later EOP file after `20260901`; `check-limit = 5`). 10-24-174 already covered #943 empty-book copy / #950 dual bar schema.  
SYSTEMS_AFFECTED: Spellbook / summon copy; `spellBarOrder`; future `ownedSpellIds` / `observedSpellIds` EOP file; SpellEditor summon section  
RECOMMENDED_ACTION: Prefer the sidecars — do not recopy into `adminSafety.ts`. Title-case `pieceType` is not persist `displayName` (09-23-002). Catalog-delete lock is not `lifecycle` (09-23-001). Dual bar schema is not ownership. New persist maps go through 09-23-016; do not sneak `ownedSpellIds` onto a shipped `NewActor`. Retired-owned still shows a Retired seal once 09-23-001 lands. Union helpers; one `export function` per name. Do not overwrite #1014 / #1018 `*2026-10-24*` files or #1060 UX `*2026-10-25*` files. Same-hour [#1060](https://github.com/Mr-Melic/stralt/pull/1060) initiative/HUD/tile/turn copy helpers are still not persist `displayName`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-016 / 003 / 001 / 002.  
DEPENDENCIES: SDA-2026-09-23-016; SDA-2026-09-23-003; SDA-2026-09-23-001; SDA-2026-09-23-002; SDA-2026-10-24-174; PR #1018; PR #1014; PR #1060  
REGRESSION_RISK: HIGH if summon title-case is “fixed” by hydrating `starterSpells` or by parsing `spell.name`. HIGH if `catalogDeleteRetiresWhenReferenced` is treated as shipped `lifecycle`. HIGH if dual `activeSpells` is migrated as `ownedSpellIds`. MEDIUM — concatenating a second copy helper fails esbuild.  
VALIDATION_REQUIRED: Empty spellbook copy never mentions admin. `formatSummonDisplayName("knight")` stays `"Knight"` and does not become persist `displayName`. #1014 helpers do not add a Motoko stable. Duplicate-export scan clean.  
STATUS: NEW  

# ACTION_IDs — 2026-10-23 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-23.md`](./SPELL_ADMIN_DESIGN_2026-10-23.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-23 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **145–159** (queue after #892). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **596** at audit start (same-hour flock continued through at least **#937**). Newest sibling before this work: **#927** (2026-10-22 21:23 UTC). Calendar: 2026-10-23. #870 `MASTER_ROADMAP.md` is a pre-existing oldest-first conflict (skipped); this PR does not touch that file.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-23-145  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #906 Wave-14 SDE stamps; do not pre-own generationMin 14 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#906](https://github.com/Mr-Melic/stralt/pull/906) is Wave-14 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md`, `generationMin: 14`). Unique §11 ids (`spell-rank-stride`, `spell-penta-oath`, `spell-spike-reel`, `spell-screen-bite`, `spell-swap-mark`, `spell-odd-plate`, `spell-mire-skip`, `spell-odd-sting`, `spell-summon-verse`, `spell-equal-gift`, `spell-cadence-floor`, `spell-cast-toll`, `spell-brick-step`, `spell-watch-bank`, `spell-tied-gait`, `spell-portal-cut`, `spell-shove-gift`, `spell-pack-rank`, `spell-rank-fold`) stay this catalog’s. `spell-pack-rank` is `ENEMY_ONLY`. `spell-rank-fold` is `BOSS_ONLY`. `spell-equal-gift` (target leftover AP **equals** leftover MP, both ≥ 1) and `spell-cadence-floor` (remaining `n>1` → 1) **win** vs same-day #890 clones of those holes. Wave-14 family CORE is #802 unique + #849 (via #899). Wave-13 unique §11 stays extras until Wave 15. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-14 unique ids into that array, or hydrating Pack Rank because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-22-130 already said the same for Wave-13 `#837`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-14 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, and 10-22-130. Honour #906 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Equal Gift or Cadence Floor (see 159). Do not restamp Wave-1…13 doors or #787 / #849 / #890 extra doors. Do not implement Wave-14 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Rank / Rank Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-22-130; SDA-2026-10-23-159; PR #906; PR #890  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-14 ids. HIGH if `ENEMY_ONLY` Pack Rank is hydrated because `usableByPlayer !== false`. HIGH if `rank_fold_regent` also grants Rank Stride. HIGH if a Cadence Floor clone ships beside `spell-cadence-floor`.  
VALIDATION_REQUIRED: After a Wave-14 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Equal Gift / Cadence Floor id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-146  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #890 Wave-14 tactical as Wave-15 CORE; Court Floor never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#890](https://github.com/Mr-Melic/stralt/pull/890) (`SPELL_PROPOSALS_2026-10-22.md`) owns G≥14 tactical holes: `spell-poise-mend`, `spell-cadence-floor`, `spell-nine-span`, `spell-bar-cross`, `spell-poise-hood`, `spell-poise-sting`, `spell-poise-step`, `spell-poise-sill`, `spell-poise-hold`, `spell-poise-lend`, `spell-poise-sip`, `spell-poise-post`, `spell-poise-bounce`, `spell-must-poise`, `spell-verse-poise`, `spell-court-floor`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-floor` is `NOT_PLAYER_LEARNABLE`. Nine Span is solid 3×3 occupy of **nine**; live `ENEMY_SUMMON_CAP` is still 2 (`gameConstants.ts` 300), so that card is implementation-blocked (`summonAI: "ninespan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` must not be restamped by SDE unique §11 or Wave-15 families. #906 already assigned remaining-CD floor to `spell-cadence-floor` — do **not** ship the #890 clone (159). Wave **15** families consume the #890 ids as CORE (except Cadence Floor). Live hydrate still pre-owns all 32 `starterSpells`. 10-22-131 covered Wave-13 tactical (#849) only.  
SYSTEMS_AFFECTED: Wave-14 tactical catalog; Wave-15 family CORE; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #890 ids. Do not clone them into SDE unique §11. `spell-court-floor` never enters `ownedSpellIds`. Do not activate Nine Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy / Oct Span / Six Span. Extra doors are first-grant; do not also hang Rank Stride / Equal Gift / Rank Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `ninespan` / `poisepost` are real, not via a name parse (153).  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-10-23-145; SDA-2026-10-23-159; SDA-2026-10-22-131; PR #890  
REGRESSION_RISK: HIGH if Court Floor hydrates as a catalog grant. HIGH if Cadence Floor clones ship beside #906. MEDIUM if Nine Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Floor. Cadence Floor remains the #906 id. Nine Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-147  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #899 Wave-14 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#899](https://github.com/Mr-Melic/stralt/pull/899) stamps Wave-14 family CORE from remaining #802 unique (except Dry Gait, already Wave-13 `spell-dry-gait`) plus #849 tactical (except Court Lag). Pack Cap / Reach Fold / Court Lag stay kit-only / never-owned. SDE Wave-13 unique CORE waits for Wave 15. Same-day #890 stays Wave 15. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone. 10-22-132 already said the same for Wave-13 `#840`.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-14 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #899 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone. Do not mint Wave-13 unique CORE (`spell-knight-stride` …) as this pass’s CORE. Do not ship `spell-parched-mend`. Do not CORE Pack Rank / Rank Fold (#906).  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-10-22-132; PR #899  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Pack Rank / Rank Fold / Court Lag is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn still does not silently own Orth Stride / Gaunt Mend. Pack Cap / Reach Fold / Court Lag / Pack Rank / Rank Fold never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-148  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #903 Wave-15 boss / Rush Table M; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#903](https://github.com/Mr-Melic/stralt/pull/903) unions Wave 15 + Rush **Table M** onto `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. New bosses `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` are not in live `BOSS_IDS`. Extra doors on leftover #636 Shove Mend / Exit Sting / Cadence Stretch / Far Hood. Spectacular `CHOIR_JOSTLE` / `NAVE_PEEL` / `CHOIR_DILATE` / `NAVE_HOOD` stay `BOSS_ONLY`. Court Hinge and Court Stretch stay `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Table M is four post-Table-L rooms; canister `completeBossRushRoom` still must not see `roomIndex > 9`. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. 10-22-133 already said the same for Wave-14 `#836` / Table L.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #903 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-22-135). Do not restamp Wave-1…14 feat doors, leftover #563 Dummy Post / Enter Mend / Split Mend, leftover #636 Quiet Sill (#836), or #890 extra doors. Table M is owner overlay, never a 10th canister room.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-22-133; SDA-2026-10-23-157; PR #903  
REGRESSION_RISK: HIGH if `CHOIR_JOSTLE` hydrates as a player grant. MEDIUM if Table M is written as `currentRoom` 10–13 and `setBossRushProgress` traps on decrease.  
VALIDATION_REQUIRED: After Wave-15 sheets exist on paper, a new character does not own Shove Mend / Far Hood from hydrate. Completing Table M does not call `completeBossRushRoom(10)`. Admin Bosses tab still has one live kit source after 011.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-149  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #897 Wave-13 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#897](https://github.com/Mr-Melic/stralt/pull/897) proposes 16 world-pack formations that consume Wave-13 families from [#840](https://github.com/Mr-Melic/stralt/pull/840) (Imprint Choir, Lean Court, Dry Gate, and related teaching pairs). Design only — no production spawn tables. Live `EnemyFamily` remains the original seven. Wave-13 SPELL_PROPOSALS (#849) stay unfamilied for Wave 14 (that is #899’s job). 10-22-134 already said the same for Wave-12 formations `#825`. Formations are not `spellRewardIds` and not observe+win.  
SYSTEMS_AFFECTED: future formation catalog; family CORE; `ownedSpellIds`  
RECOMMENDED_ACTION: Same rule as 10-22-134. Consume already-stamped CORE ids. Clearing `FSN-*` does not append `ownedSpellIds` unless a named door is stamped. Do not mint formation-only spell ids. Do not grow WX spawn.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-22-134; PR #897; PR #840  
REGRESSION_RISK: MEDIUM — treating a formation clear as observe+win hydrates a Wave-13 unique id.  
VALIDATION_REQUIRED: A formation encounter that uses Dry Gait does not grant Dry Gait on clear unless that family already stamped an `ENEMY_DISCOVERY` door and the enemy actually cast it, then the player won.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-150  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #911 pack-kit assign; filling empty kits is not a grant  
CATEGORY: enemy-pools  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#911](https://github.com/Mr-Melic/stralt/pull/911) adds `engine/packEnemyKitAssign.ts`. Battle start (`WorldExploration.tsx` 11919–11923) resolves `buildEnemyKit` ids against `normalizedSpellPool`. When `filteredBackendSpells.length > 0` the pool is Motoko `defaultSpells` (`shadow_strike` / `soul_rend` / `vampire_bite` / `reflect_barrier` / `thunder_clap` / `void_collapse`) — none of the kit ids. `physical_attack` is also in `OLD_SPELL_NAMES_SET` (WX 2356–2389) and stripped. Result: every pack enemy gets `spells: []` and only Crush. The sidecar fills from the starter registry when the catalog row is missing **or** `usableByEnemy === false` by normalize default. It does **not** revive retired Strike. Rallying Cry stays skipped. Unique vs #842 (hostile summon routing) and #861 (player auto-summon empty spells). This papers over catalog ≠ starter without 09-23-007 / 003.  
SYSTEMS_AFFECTED: pack kit resolve; `normalizedSpellPool`; future `ownedSpellIds`; Strike tombstone  
RECOMMENDED_ACTION: Union `assignPackEnemyKitSpells` onto WX `assignEnemySpells` after #911 lands; one `export function` per name. Do **not** treat a filled kit as a player grant or as observation. Observation still requires a hostile **cast** of a `PLAYER_LEARNABLE` id (09-23-009). Do not revive `physical_attack` from this sidecar — that is 09-23-007. Do not grow WX to inline the fill. Prefer 007 + 010 over expanding the workaround.  
AUTONOMY: HUMAN_APPROVE — with 09-23-007 / 010.  
DEPENDENCIES: SDA-2026-09-23-007; SDA-2026-09-23-010; SDA-2026-09-23-009; PR #911  
REGRESSION_RISK: HIGH if filling Strike into the kit also hydrates it into `ownedSpellIds`. HIGH if `usableByEnemy: true` written on a starter row is copied into the player library helper. MEDIUM — concatenating a second assign helper fails esbuild.  
VALIDATION_REQUIRED: With Motoko-only catalog, a zone-0 bishop still casts Frost Bolt after #911 **and** a new character still does not “discover” Frost from that fill. Strike stays Crush-fallback until 007. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-151  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute metadata flags; union 10-22 execute sidecars  
CATEGORY: spell-definition  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #892, open [#905](https://github.com/Mr-Melic/stralt/pull/905) / [#910](https://github.com/Mr-Melic/stralt/pull/910) / [#913](https://github.com/Mr-Melic/stralt/pull/913) / [#915](https://github.com/Mr-Melic/stralt/pull/915) / [#917](https://github.com/Mr-Melic/stralt/pull/917) / [#921](https://github.com/Mr-Melic/stralt/pull/921) / [#922](https://github.com/Mr-Melic/stralt/pull/922) / [#924](https://github.com/Mr-Melic/stralt/pull/924) share execute with advertised Frost Bolt MP, boss-kit first-id **summon** ground range, Expose `res_sp`, Cursed Wound `healRecv`, Frost Nova MP, Life Drain SP, Drain Courage AP, enemy heal CHC. #888 (boss first-id range) was already in 10-22-139. Keys are metadata flags on the spell row, never `spell.name`. Motoko `SpellConfig` still has no `targetType` / mechanic flags (`admin.mo` 92–127). 09-23-005 is the persist vehicle.  
SYSTEMS_AFFECTED: kit-execute sidecars; Motoko `SpellConfig`; SpellEditor; observe path  
RECOMMENDED_ACTION: Same rule as 10-22-139. Persist those flags with 09-23-005. Union sidecars; one `export function` per name. Not grants. Hostile kit / summon execute may observe (10-22-138 / #842 / #910); player execute must not. Do not write Frost / Inferno / Drain name tables.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 005 exists.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-22-138; SDA-2026-10-22-139; PRs #905 / #910 / #913 / #915 / #917 / #921 / #922 / #924  
REGRESSION_RISK: HIGH if execute branches on `spell.name === "Frost Bolt"`. MEDIUM — concatenating a second execute helper fails esbuild.  
VALIDATION_REQUIRED: Rename Frost Bolt; advertised MP still executes. Hostile first-id summon may observe; player Life Drain must not. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-152  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #892; death-gated recap is not a victory commit  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After #892, open [#900](https://github.com/Mr-Melic/stralt/pull/900) / [#909](https://github.com/Mr-Melic/stralt/pull/909) / [#912](https://github.com/Mr-Melic/stralt/pull/912) / [#918](https://github.com/Mr-Melic/stralt/pull/918) / [#919](https://github.com/Mr-Melic/stralt/pull/919) / [#926](https://github.com/Mr-Melic/stralt/pull/926) / [#927](https://github.com/Mr-Melic/stralt/pull/927) add more `saveBattleStats` remount skips (GameKey keep, feat-claim keep, portal XP, victory XP, leftover XP, shop spend, Doka-heal double charge). Open [#923](https://github.com/Mr-Melic/stralt/pull/923) death-gates victory recap (`victoryRecapAfterPersist.ts`) and locks `hitsAllies` challenge debit. Default discovery requires **win** after observe (08-31 §4). A remount skip that keeps wallet/XP is not `commitSpellDiscoveries`. A death-gated recap is not a victory. 10-22-140 already covered the pre-#892 skip class.  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit; recap popup; challenge debit  
RECOMMENDED_ACTION: Same rule as 09-29-113 / 10-21-124 / 10-22-140. Union the new skip helpers; one `export function` per name. Do not write owned/observed ids inside a remount skip. Death does not clear observation; death-gated recap does not unlock. Challenge `hitsAllies` debit is not a `spellRewardIds` grant. `ownedSpellIds` / `observedSpellIds` stay append-only on the persist lock (09-23-009).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-22-140; PRs #900 / #909 / #912 / #918 / #919 / #923 / #926 / #927  
REGRESSION_RISK: HIGH if a victory-XP remount skip is treated as a victory commit and grants an observed id. HIGH if a death recap still commits unlocks. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Victory remount does not append `ownedSpellIds`. Observation from the lost fight stays. Death-gated recap does not unlock. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-153  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Grow closed knownSummonAI with ninespan / poisepost enums  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter | guardian | archer | kiter | bomber | kamikaze | healer` (`adminGuard.mo` 363–366; `adminSafety.ts` 19–27). Closed `knownPieceType` still omits `font` / `dummypost` / `pentaspan` / `septspan` (368–373). Queued #890 adds `summonAI: "ninespan"` / `"poisepost"`. Queued #849 already added `"octspan"` / `"gauntpost"` (10-22-141). Queued #787 adds `"sixspan"`. 09-23-002 / 008 already require the enum on activate and forbid `inferSummonArchetype` name fallback (`enemyAI.ts` 217–224) and `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Empty `summonAI` is a validation error on both client and Motoko when `isSummon` but runtime still coerces `"hunter"` (139).  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` `SUMMON_AIS`; SpellEditor; `enemyAI.ts`; `summonSpawn.ts`  
RECOMMENDED_ACTION: When 09-23-002 ships, extend the **same** closed enum on Motoko and client together: keep today’s seven, add `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `font` / `dummypost` / `pentaspan` / `septspan` only when those cards activate. Never parse `summon.name`. Display name is an explicit `SummonUnitDef.displayName`. Occupy-weight / cap still blocks Nine Span / Oct Span / Six Span / Sept Span activate (146 / 131).  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-22-141; SDA-2026-10-23-146; PR #890  
REGRESSION_RISK: HIGH if `"ninespan"` is inferred from a unit named “Nine”. MEDIUM if the enum grows on one side only (client Save vs Motoko reject).  
VALIDATION_REQUIRED: Activate of a summon with `summonAI="ninespan"` and `displayName="Nine Span"` round-trips. Rename the spell; unit name stays. Unknown `summonAI="wolf"` fails client and Motoko with the same string. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-154  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #893 / #904 persist helpers; condition ids are not spell rewards  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#893](https://github.com/Mr-Melic/stralt/pull/893) adds `achievementConditionIds.ts` plus a boss-defeat id helper on `victoryAchievements.ts`. Open [#904](https://github.com/Mr-Melic/stralt/pull/904) locks Boss Rush recap wallet/level feats after persist on the same `victoryAchievements.ts`. Live `AchievementConfig` still has only `dokaReward` (`admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is a closed 15-key whitelist (`adminSafety.ts` 306–322). Wallet/level feats (`doka_1000`, `doka_10000`, `level_10`) already wait until `applyRewards` commits. A condition-id helper is not `spellRewardIds`. 10-22-144 already covered #828 minLevel / retired-feat sidecars. Both PRs touch `victoryAchievements.ts` — restack union ≠ concatenate.  
SYSTEMS_AFFECTED: achievement condition whitelist; `victoryAchievements.ts`; future `spellRewardIds`; Boss Rush recap  
RECOMMENDED_ACTION: Prefer the sidecars — do not recopy into `adminSafety.ts`. Do not hang a Wave-14 / Wave-15 id on a new condition key. New grants use 09-23-012 explicit ids on **named** unused doors only when a designer claims one. Union `victoryAchievements.ts`; one `export function` per name. Retired unclaimed feats stay Doka-claimable; they are not spell grants.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-10-22-144; PR #893; PR #904  
REGRESSION_RISK: HIGH if a boss-defeat condition is treated as a spell grant. MEDIUM — concatenating a second `victoryAchievements` helper fails esbuild.  
VALIDATION_REQUIRED: Boss Rush recap still pays no spell id. `first_blood` / `unstoppable` / a new boss-defeat key do not append an owned spell id. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-155  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #908 WDEAD; waves 13–14 / ENC rooms / Table M are not grants  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#908](https://github.com/Mr-Melic/stralt/pull/908) lets owner `enabledWaves` name catalogWave 13 and 14, ingests ENC Both/Stride/Near + Heave/Dual/Mid and FSN drops 13–14 by id union, treats elite waves 13–14 as a second roll after `FAMILY_TYPES`, and overlays Rush tables L/M without canister `roomIndex > 9`. Skip SEPT / SIX / PENTA occupy while summon cap is 2. Live achievements cannot grant spells. 10-22-142 already said ENC rooms are not grants. WDEAD-002 / 004 are occupancy and Rush overlays, not `spellRewardIds`.  
SYSTEMS_AFFECTED: `enabledWaves`; encounter rooms; elite second roll; Rush extra tables; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Rooms may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*` or enabling wave 14 does not append `ownedSpellIds` unless a named door is stamped. Skip `oct_prelate` / Nine Span occupy while cap is 2. Do not consume #908 ids into SDE unique §11. Honour 09-29-111 / 10-21-125 / 10-22-142 copy. Never write Rush Table M as canister rooms 10–13.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-10-22-142; SDA-2026-10-23-148; PR #908  
REGRESSION_RISK: MEDIUM — treating an ENC-SPELL-* room clear as observe+win hydrates a Wave-14 unique id. MEDIUM — enabling catalogWave 14 hydrates Pack Rank because `usableByPlayer !== false`.  
VALIDATION_REQUIRED: Enabling wave 14 does not append `ownedSpellIds`. Clearing an ENC room does not grant Rank Stride. Table M overlay does not call `completeBossRushRoom(10)`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-156  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #901 portal-whirlpool extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#901](https://github.com/Mr-Melic/stralt/pull/901) extracts portal whirlpool paint from WX into `engine/portalWhirlpool.ts`. Live WX is still 19 213 lines. Oldest-first already WARN-conflicts WX with #327 / #331 / #730 / #798 / #831 (10-22-137). Discovery observe/commit helpers belong in `engine/*` / `utils/*`, not another thousand lines on WX. `useSpellQueries.ts` (293 lines) remains the SpellEditor landing. AdminDashboard is 8 280 lines.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/portalWhirlpool.ts`; future observe helpers  
RECOMMENDED_ACTION: Same rule as 10-22-137. Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites; do not grow WX. Do not restack AdminDashboard with empty studio tabs. Extract `SpellEditor` onto `useSpellQueries.ts` when 09-23-015 lands.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical extract discipline.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-22-137; PR #901; PR #831  
REGRESSION_RISK: HIGH if observe/commit is inlined into WX and the oldest-first restack concatenates a second helper.  
VALIDATION_REQUIRED: WX line count does not grow from this studio. Duplicate-export scan clean. Portal paint still runs after the extract lands.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-157  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #887 AFDA; do not add a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#887](https://github.com/Mr-Melic/stralt/pull/887) is the 10-22 admin-drift ledger (`leaderBoost` is ignored). Same-day [#934](https://github.com/Mr-Melic/stralt/pull/934) is the 10-23 drift ledger (unused HP query comment). Same-day [#929](https://github.com/Mr-Melic/stralt/pull/929) is the 10-23 enemy/boss admin re-audit with **no new EBA IDs**. They name live `bossKits.ts` vs unused Motoko seed vs Admin chips again. 10-22-135 already covered #817 / #818 / #876. Three kit sources remain (`data/bossKits.ts`, Motoko `defaultBossConfigs()` purged ids at `admin.mo` 358+, Admin `getSpellConfigs()`). Naming the split is not a fourth table. Buff catalogs are not spell grants.  
SYSTEMS_AFFECTED: Admin Bosses tab; Motoko boss seed; `bossKits.ts`  
RECOMMENDED_ACTION: Consume AFDA / 09-23-011. Do not add a fourth kit table. Prefer #466 for buff id-alias. Do not restack `AdminDashboard.tsx` from this studio.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-22-135; PR #887; PR #929; PR #934  
REGRESSION_RISK: MEDIUM — a fourth kit table would desync Wave-15 #903 sheets from live combat.  
VALIDATION_REQUIRED: After 011, live combat, Motoko seed, and Admin chips resolve the same id set. `leaderBoost` remaining ignored is AFDA’s problem, not a spell grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-158  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #906 / #890 extra doors; first-grant only  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #906 tags `rank_precentor` (Pack Rank `ENEMY_ONLY`) and `rank_fold_regent` (Rank Fold `BOSS_ONLY`). #890 tags `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #903 extra-doors leftover #636 Shove Mend / Exit Sting / Cadence Stretch / Far Hood onto Wave-15 bosses. Prior leftover doors (`gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent`, Wave-5…14 boss extras listed in #890 §3) stay first-grant. Live feats cannot grant spells. Restamping a door as a second `spellRewardIds` child double-grants once 012 exists.  
SYSTEMS_AFFECTED: extra-door table; feat/challenge grants; `ownedSpellIds`  
RECOMMENDED_ACTION: First completed child wins; no double copy. Do not hang Rank Stride / Equal Gift / Poise Mend on `rank_precentor` / `jostle_subdeacon`. `floor_precentor` stays Cadence Floor’s MULTI child — after 159 that id is the #906 row, not a #890 clone. `court_floor_regent` is kit-only (`NOT_PLAYER_LEARNABLE`). Do not restamp Wave-1…14 leftover feat doors.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012 / 009.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-009; SDA-2026-10-23-145; SDA-2026-10-23-146; SDA-2026-10-23-148; SDA-2026-10-23-159  
REGRESSION_RISK: HIGH if `span_nine` also grants Oct Span / Six Span. HIGH if `rank_fold_regent` writes Rank Fold into `ownedSpellIds`.  
VALIDATION_REQUIRED: Extra-door fights grant the stamped id at most once. Pack Rank / Rank Fold / Court Floor remain never-owned. Far Hood door does not also grant Quiet Sill.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-23-159  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: SDE wins spell-cadence-floor; do not ship the #890 clone beside it  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same-day [#906](https://github.com/Mr-Melic/stralt/pull/906) unique §11 and [#890](https://github.com/Mr-Melic/stralt/pull/890) both authored `spell-cadence-floor` (remaining `n>1` → 1; zeros stay 0). SDE law: if a later tactical catalog claims a hole unique §11 already authored, **SDE wins** the id; the tactical file must pick a different fantasy. #906 §0.2c and §17 already record that win and tell Wave-15 family CORE to consume #890 **except Cadence Floor**. #890 still lists `SPELL_ID: spell-cadence-floor` as `MULTI_SOURCE` with extra door `floor_precentor`. Shipping both rows would double-grant once ownership exists and would fight activate-id uniqueness. Hollow Gift / Cadence Swap already used this same win vs #849 (10-22-130).  
SYSTEMS_AFFECTED: Wave-14 unique catalog; Wave-14 tactical catalog; Wave-15 family CORE; extra door `floor_precentor`  
RECOMMENDED_ACTION: Keep `spell-cadence-floor` as the #906 unique id (`ENEMY_DISCOVERY`). #890 must not ship a second Cadence Floor row — if it still wants a tactical CD-floor card it needs a **new** id, and SDE already filled the hole, so do **not** mint `spell-cadence-arm` / `spell-cd-floor` / `spell-cadence-ceil` either. Wave-15 family CORE consumes Poise Mend / Nine Span / Bar Cross / Poise* / Must Poise / Verse Poise / Court Floor, **not** a cloned Cadence Floor. `floor_precentor` remains the MULTI child of the #906 id. Validator rejects a second catalog row with this id.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-10-23-145; SDA-2026-10-23-146; PR #906; PR #890  
REGRESSION_RISK: HIGH if both files land a `spell-cadence-floor` row and hydrate grants it twice or activate fails on duplicate id. HIGH if #890 “fixes” the collision by minting `spell-cadence-arm` (remaining 0 → 1), which #890 itself held for Wave 15.  
VALIDATION_REQUIRED: After both catalogs exist on paper, the live id set contains exactly one Cadence Floor. Wave-15 family CORE lists Poise Mend and does not list a second floor id. `floor_precentor` grants the #906 id at most once.  
STATUS: NEW  

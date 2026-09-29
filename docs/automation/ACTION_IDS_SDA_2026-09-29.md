# ACTION_IDs — 2026-09-29 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-29.md`](./SPELL_ADMIN_DESIGN_2026-09-29.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-29 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **099–115** (queue after #729, plus same-hour 09-29 siblings). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21).

Older still-open PRs (union, do not overwrite): **#368** then **#327** / **#331**, then #333+. SDA-relevant additions since #729: **#747** (Wave-11 SDE), **#726** (Wave-11 tactical), **#752** (Wave-11 elite), **#753** (Wave-12 bosses), **#733** (last-live achievement catalog), **#741** (drift / AFDA-034), **#730** (AO extract), **#754** (Swap landing tax), **#766** (Chain bounce), **#757** / **#762** (summon-control kit gates), **#749** / **#758** / **#763** (metadata tests), **#731** (leftover/AP), **#739** / **#719** / **#737** (encounter doors), **#751** (expansion leftover feats), **#746** (EBA no new IDs), **#742** / **#756** / **#759** / **#764** / **#767** (death-cut / leftover-XP skips), plus same-hour **#769** / **#771** (09-29 encounter rooms), **#775** (publish-gate copy), **#778** (AP/MP cap persist), **#780** (drift). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-29-099  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #747 Wave-11 SDE stamps; do not pre-own generationMin 11 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#747](https://github.com/Mr-Melic/stralt/pull/747) is Wave-11 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md`, `generationMin: 11`). Unique §11 ids (`spell-diag-stride`, `spell-mid-oath`, `spell-void-reel`, `spell-foe-bite`, `spell-dwell-mark`, `spell-own-plate`, `spell-cinder-skip`, `spell-full-plate`, `spell-summon-toll`, `spell-still-mend`, `spell-cadence-rest`, `spell-spent-tax`, `spell-brick-crack`, `spell-watch-lend`, `spell-pair-purse`, `spell-escort-cut`, `spell-dry-mend`, `spell-pack-long`, `spell-adj-fold`) stay this catalog’s. `spell-pack-long` is `ENEMY_ONLY` on `long_precentor`. `spell-adj-fold` is `BOSS_ONLY` on `adj_fold_regent`. Tactical Wave-11 ids are stamped from #726, not cloned. Wave-11 family CORE is still #646 + #695. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-11 unique ids into that array, or hydrating Pack Long because `usableByPlayer !== false` (`adminSafety.ts` 711–718), makes discovery worse. 09-28-084 already said the same for Wave-10 `#679`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-11 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-27-070, and 09-28-084. Honour #747 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole. Do not restamp Wave-1…10 doors or #726 extra doors (`heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent`). Do not implement Wave-11 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Long / Adj Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-28-084; PR #747; PR #726  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-11 ids. HIGH if `ENEMY_ONLY` Pack Long is hydrated because `usableByPlayer !== false`. HIGH if `adj_fold_regent` also grants Diag Stride.  
VALIDATION_REQUIRED: After a Wave-11 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-100  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #726 Wave-11 tactical; Court Dual never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#726](https://github.com/Mr-Melic/stralt/pull/726) (`SPELL_PROPOSALS_2026-09-28.md`) owns G≥11 tactical holes: `spell-heave-mend`, `spell-dual-keep`, `spell-sept-span`, `spell-cadence-halve`, `spell-mid-hood`, `spell-ready-sting`, `spell-heave-step`, `spell-drift-sill`, `spell-drift-hold`, `spell-drift-lend`, `spell-drift-sip`, `spell-drift-post`, `spell-heave-bounce`, `spell-must-drift`, `spell-verse-pace`, `spell-court-dual`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-dual` is `NOT_PLAYER_LEARNABLE`. Sept Span is plus-footprint occupy of **seven**; live `ENEMY_SUMMON_CAP` is still 2, so that card is implementation-blocked (`summonAI: "septspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` must not be restamped by SDE unique §11 or Wave-12 families. Live hydrate still pre-owns all 32 `starterSpells`.  
SYSTEMS_AFFECTED: Wave-11 tactical catalog; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #726 ids; do not clone them into SDE unique §11. `spell-court-dual` never enters `ownedSpellIds`. Do not activate Sept Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy. Extra doors are first-grant; do not also hang Diag Stride / Dry Mend / Adj Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `septspan` is real, not via a name parse. Wave 12 families consume #726 as CORE — not Wave 11.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-29-099; SDA-2026-09-28-085; PR #726  
REGRESSION_RISK: HIGH if Court Dual hydrates as a catalog grant. MEDIUM if Sept Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Dual. Sept Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-101  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #752 Wave-11 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#752](https://github.com/Mr-Melic/stralt/pull/752) stamps Wave-11 family CORE from #695 tactical ids and leftover Wave-9 unique CORE. Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual stay boss/closed. SDE Wave-10 unique CORE waits for Wave 12. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-11 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #752 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-09-28-086; PR #752  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Court Dual is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn also gets venom-strike. Closed signatures never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-102  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #730 AO extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#730](https://github.com/Mr-Melic/stralt/pull/730) extracts the ambient occlusion mask from `WorldExploration.tsx` (19 213 lines) into `engine/ambientOcclusion.ts`. Older still-open PRs #327 / #331 / #639 / #683 already edit WX. 09-28-087 already required union with the ground-Doka extract. Studio wiring that appends observation or catalog filters inside WX will fight those extracts and fail duplicate-`export function` restack.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `ambientOcclusion.ts`; `groundDokaSpawn.ts`; future observe hook  
RECOMMENDED_ACTION: Discovery / ownership helpers stay in `engine/*` / `utils/*`. WX only gets one-line call sites. If a persist PR also touches WX, union #327 / #331 / #639 / #683 / #591 / #606 / #730. Keep one `export function` per name. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-003 / 009 exist.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-28-087; PR #730; PR #683; PR #639; PR #327; PR #331  
REGRESSION_RISK: MEDIUM — concatenating a second helper on restack fails `vite build`. Growing WX is forbidden.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Observe hook is not inlined in WX. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-103  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Last-live achievement catalog is the same class as spell hard-delete  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live `adminDeleteAchievementConfig` (`main.mo` 2389–2408) hard-`remove`s when no progress rows exist and only flips `active=false` when progress is present. `markAchievementUnlocked` then `#err("Achievement is retired")` (2473) or misses the id. Official Admin can therefore empty the live 15-row catalog (`admin.mo` `defaultAchievements()` 309–326) so first-win and wallet feats never grant. Open [#733](https://github.com/Mr-Melic/stralt/pull/733) adds `achievementLastLiveRejected` (client mirror in `adminSafety.achievementLastLive.ts`; Motoko `AdminGuard.achievementLastLiveRejected`) — “Cannot empty the live achievement catalog.” AFDA-2026-09-28-034 on [#741](https://github.com/Mr-Melic/stralt/pull/741) points at #733. Spells still have **no** last-live catalog guard: `adminDeleteSpellConfig` (`main.mo` 882–901) can `remove` every non-built-in row the player-key scan misses. Last-live map-modifier chance 0 is already 09-28-096 / #703. `_spellReferencedByPlayers` (273–284) still cannot see kits, bosses, or achievements.  
SYSTEMS_AFFECTED: `adminDeleteAchievementConfig`; `adminSetAchievementConfig`; `adminDeleteSpellConfig`; future last-live spell catalog guard; Admin confirm  
RECOMMENDED_ACTION: Prefer #733’s helper — do not recopy it into `adminSafety.ts` (queued PRs already own that file). Compose the same “cannot empty the live catalog” rule for **active** spell rows after 09-23-001 (lifecycle, not `usableByPlayer`). Hard-delete stays draft-only (09-23-004). Confirm/toast must distinguish last-live reject vs retire vs draft-delete. Do not treat last-live as a spell grant.  
AUTONOMY: HUMAN_APPROVE — catalog emptiness is a live-actor write.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-004; SDA-2026-09-28-096; PR #733; PR #741  
REGRESSION_RISK: HIGH if the last live feat is retired and first-win / `doka_1000` can never unlock. HIGH if a last-live spell `remove` drops enemy kits to empty before 007.  
VALIDATION_REQUIRED: Deactivating the last live achievement `#err`s with the same string on client and Motoko. Already-inactive rows may still be written. After 001, retiring the last **active** spell `#err`s; a draft with zero refs still deletes.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-104  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Swap landing tax as metadata; union #754  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#754](https://github.com/Mr-Melic/stralt/pull/754) taxes Swap landings like walk and enemy AI (`engine/swapLandingHazards.ts`). Live Swap is `spell-swap` with `isSwap` on the frontend record (`spellData.ts` 143+). Motoko persist (`admin.mo` 92–127) and bindgen still omit `isSwap` / `targetType`. Admin Save therefore cannot round-trip the flag `targeting.ts` / hazard helpers use. A name check (`spell.name === "Swap"`) is forbidden. 09-23-005 already requires persisting mechanic flags.  
SYSTEMS_AFFECTED: `SpellConfig` persist; bindgen; `swapLandingHazards.ts`; SpellEditor; `targeting.ts`  
RECOMMENDED_ACTION: Persist `isSwap` (or an effects `#displace { mode = swap }`) with 09-23-005. Union #754 helpers — do not inline a second tax into WX. Landing tax is combat, not a discovery grant. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-015; PR #754  
REGRESSION_RISK: MEDIUM — a default of `enemy` on Swap would break free-cell targeting. Concatenating a second `applySwapLandingHazards` fails esbuild.  
VALIDATION_REQUIRED: Save Swap; refetch keeps `isSwap` / `targetType`. Player and enemy Swap both pay the landing tax. Rename the spell; tax still applies. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-105  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Chain Lightning bounce as chain metadata; union #766  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#766](https://github.com/Mr-Melic/stralt/pull/766) bounces Chain Lightning once from the clicked primary (`engine/shouldApplyChainBounceOnHit.ts`). 09-23-005 already names `targetType` including **chain**. Motoko persist still has no `targetType`. Engine reads frontend fields (`spellEngine.ts`). A name table (`if (spell.name.includes("Chain")`) is forbidden.  
SYSTEMS_AFFECTED: `SpellConfig` persist; bindgen; `shouldApplyChainBounceOnHit.ts`; SpellEditor  
RECOMMENDED_ACTION: Persist chain / bounce as explicit metadata (`targetType` and/or `effectParams` keys), never the display name. Union #766’s helper; one `export function`. Activate rejects a bounce row with no primary-target metadata.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; PR #766  
REGRESSION_RISK: MEDIUM — bouncing from a name match would fire on a renamed row or miss a new chain id.  
VALIDATION_REQUIRED: Clicked primary is the only bounce origin. Rename the spell; bounce still applies. Preview and live cast use metadata only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-106  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist summon-control kit AP+range; union #757 / #762  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#757](https://github.com/Mr-Melic/stralt/pull/757) shares summon-control highlight with execute gates. Open [#762](https://github.com/Mr-Melic/stralt/pull/762) shares summon kit AP+range with WX enemy damage/debuff execute. Combat `SummonUnitDef` already has `summonKit` / `ap` / `mp` (`summonSpawn.ts` 22–32). Motoko unit def does not (`admin.mo` 85–90). Spawn display name is still `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). `inferSummonArchetype` still parses `summon.name` (`enemyAI.ts` 217–224). Closed `knownSummonAI` omits `font` / `dummypost` / `pentaspan` / `septspan`. Editor has no summon section (`AdminDashboard.tsx` 2684–2686).  
SYSTEMS_AFFECTED: Motoko `SummonUnitDef`; bindgen; SpellEditor; `summonControlCast.ts`; `summonSpawn.ts`; `enemyAI.ts`  
RECOMMENDED_ACTION: Ship 09-23-002 (`displayName`, `summonKit`, AP/MP) together with #757 / #762 execute helpers. Never derive kit range or `summonAI` from `spell.name`. Empty `summonAI` is a validation error, not `"hunter"`. Union those PRs; do not grow WX.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-09-02-002; PR #757; PR #762  
REGRESSION_RISK: HIGH — every `adminSetSpellConfig` / `getSpellConfigs` call. Empty `summonKit` must not crash combat (no casts). Concatenating a second range helper fails esbuild.  
VALIDATION_REQUIRED: Save a row with `isSummon=true`, `summonAI="hunter"`, `displayName="Dire Wolf"`, `summonKit=["physical_attack"]`, `ap`/`mp` set; refetch matches. Rename the spell; unit name and kit range stay. Highlight and execute use the same AP+range.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-107  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #753 Wave-12 boss / Rush Table J; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#753](https://github.com/Mr-Melic/stralt/pull/753) extends `docs/design/BOSS_AND_SPELL_DISCOVERY.md` with Wave-12 boss sheets and Rush Table J. Arena verbs (`PROMOTE_QUEEN`, `ATTACK_ALL_LINES`, `VOID_TILES`, `SPLIT_ROOKS`, `ADVANCE_PER_TURN`, `TWIN_FLANK`, `MERGE_BISHOPS`, …) stay `BOSS_ONLY`. Live combat kits live in `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+). Admin chips `getSpellConfigs()` (`AdminDashboard.tsx` Bosses tab). Three sources. 09-23-011 / 028 already require one id list.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko phase pools; Admin chips; `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #753 closed signatures as `BOSS_ONLY` / `ENEMY_ONLY`. Never write them to `ownedSpellIds`. One canonical kit list with 09-23-011 / 028 / #449. Do not add a fourth source. Do not “fix” Motoko pools by matching names. Validator marks unresolved chips crimson.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-003; PR #753; PR #746  
REGRESSION_RISK: MEDIUM — empty resolved pool becomes melee-only. Granting a Table J arena verb hydrates a BOSS_ONLY id.  
VALIDATION_REQUIRED: Table J `BOSS_ONLY` ids never appear in a new character’s spellbook. Every seeded `spellPoolIds` entry exists in `spellConfigs` after 007. Admin chips match live `bossKits.ts`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-108  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Data-evolution leftover/AP is not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#731](https://github.com/Mr-Melic/stralt/pull/731) is a data-evolution audit of leftover XP and AP contracts. Live leftover walk already has execute gates (queued #544 / #546 / #761). `upgradeSpell` (`main.mo` 964–1014) is the sole level writer and **charges Doka**. `saveBattleStats` never mints Doka/XP/atk/res/init. Discovery grants must use `recordSpellObservation` / `commitSpellDiscoveries` / `unlockOwnedSpell` on `createProgressPersist` (08-31 §8 / 09-23-009). Leftover AP/MP on a kit is not observation and is not ownership.  
SYSTEMS_AFFECTED: persist lock; leftover-walk gates; future observe/commit writers  
RECOMMENDED_ACTION: Do not treat leftover AP/MP, leftover XP honour, or `saveBattleStats` skips as `ownedSpellIds` writes. Grants stay append-only on the persist lock. No `updateCharacter`. No `upgradeSpell`. Honour #731 contracts; do not invent a second leftover table.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-003; PR #731  
REGRESSION_RISK: HIGH if leftover-walk refund is mistaken for a discovery commit.  
VALIDATION_REQUIRED: Leftover AP after a turn does not observe or unlock. Victory without a hostile AP-spent cast does not grant. Duplicate leftover honour does not append an owned id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-109  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour encounter / world-dynamics doors; do not restamp leftover feats  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#739](https://github.com/Mr-Melic/stralt/pull/739) (world/dungeon/encounter admin), [#719](https://github.com/Mr-Melic/stralt/pull/719) (Wave-11 world dynamics), and [#737](https://github.com/Mr-Melic/stralt/pull/737) (Pace/Nail/Flush rooms) add encounter tags. Live achievements cannot grant spells (`AchievementConfig` has only `dokaReward`, `admin.mo` 249–256). Challenges still `{ doka, xp, badge }` (`challengeCompletion.ts` 22–27). Wave-1…10 already stamped `spell_scholar`, `explorer`, `easy_3`, `pacifist_run`, `easy_1`, `critical_striker`, `loot_hunter`, Twin Monarchs, `chessboard_lich`, `echo_dummies`, `mist_gallery`, etc. Extra #726 doors (`heave_cantor` … `court_dual_regent`) are first-grant.  
SYSTEMS_AFFECTED: encounter tag table; `spellRewardIds`; challenge `rewards.spellIds`; leftover feat doors  
RECOMMENDED_ACTION: New rooms may carry a **named** `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` child id. Do not restamp Wave-1…10 feat doors or #726 extra doors. `unstoppable` / `level_10` stays unused as a spell gate. Grant through 09-23-012 + 09-23-009, never `updateCharacter`. Do not edit `mapGen.ts` algorithms.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-009; SDA-2026-09-29-100; PR #739; PR #719; PR #737  
REGRESSION_RISK: MEDIUM — a second grant on `pacifist_run` / `easy_1` double-pays a spell id.  
VALIDATION_REQUIRED: Pace/Nail/Flush victory grants only the stamped id, once. Defeat grants nothing. `spell_scholar` does not gain a third spell.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-110  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Tests lock metadata categories, not names  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#749](https://github.com/Mr-Melic/stralt/pull/749) locks auto-summon Pacifist Run after AI offense. [#758](https://github.com/Mr-Melic/stralt/pull/758) locks auto-summon landing tax after AI walk. [#763](https://github.com/Mr-Melic/stralt/pull/763) locks boss-ability landing tax after teleport / advance / knight jump. 09-28-092 already required Pacifist to use metadata categories (`heal` / `buff`, not `spell.name`). `OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) still filters by name. Architecture already states `spell.name` is UI/log only.  
SYSTEMS_AFFECTED: Pacifist / landing-tax tests; `adminSafety.ts`; future observe hook tests  
RECOMMENDED_ACTION: Keep those tests on `spellType` / `effectCategory` / `isPhysical` / hazard helpers. Do not add `includes(spell.name)` branches to make them pass. Observe-hook tests (when 009 lands) key off `spell.id` and `kind === "cast"`. Honour 09-23-008 / 09-28-092.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical.  
DEPENDENCIES: SDA-2026-09-23-008; SDA-2026-09-28-092; PR #749; PR #758; PR #763  
REGRESSION_RISK: MEDIUM — a name assertion on “Strike” / “Inferno” breaks the first rename.  
VALIDATION_REQUIRED: Renaming Inferno does not fail Pacifist or landing-tax tests. Kit offensive `spellType="damage"` still fails Pacifist. Filter tests use ids only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-111  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Expansion leftover feat doors stay unused as spell gates  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#751](https://github.com/Mr-Melic/stralt/pull/751) (Expansion Director 2026-09-28) records achievements as 15 Doka one-shots and keeps `unstoppable` / `level_10` as a capped milestone, never a spell. Leftover doors still unused as spell gates: `first_blood`, `survivor`, `doka_hoarder`, `betrayal_witness`, `leader_slayer`, `jackpot`, `spell_master`, `rich_vampire`, `hard_1`, `legendary_1`. 09-28-097 already locked Claim-in-Feats copy. Wave-3 SDE said `unstoppable` stays unused forever as a spell gate. Live `AchievementConfig` still has no `spellRewardIds`.  
SYSTEMS_AFFECTED: leftover feat-door table; `spellRewardIds`; Expansion catalog  
RECOMMENDED_ACTION: Do not hang a Wave-11 / Wave-12 id on leftover economy / first-blood doors. `unstoppable` stays Doka-only. New grants use 09-23-012 explicit ids on **named** unused doors only when a designer claims one. Honour 09-28-097 copy.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-28-097; PR #751  
REGRESSION_RISK: MEDIUM — restamping `survivor` / `first_blood` collides with a later identity card.  
VALIDATION_REQUIRED: Reaching level 10 still pays Doka only. `first_blood` does not append an owned spell id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-112  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #746 enemy/boss admin; do not add a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#746](https://github.com/Mr-Melic/stralt/pull/746) is a 09-28 enemy/boss admin re-audit that **mints no new EBA IDs** (`HEAD` still `0f5363f`). Live kits: (1) `data/bossKits.ts`, (2) Motoko `defaultBossConfigs()` purged ids (`admin.mo` 358+), (3) Admin chips on `getSpellConfigs()`. `adminDeleteEnemyConfig` (`main.mo` 798–804) is still unconditional `remove`. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). 09-23-011 / 028 already require one id list with #449.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko pools; Admin Enemy / Boss tabs; future `EnemyKit` store  
RECOMMENDED_ACTION: Consume existing EBA / 09-23-011 IDs. Do not file a fourth kit table. Enemy delete follows 09-23-004 (retire + report; hard-delete drafts only). Honour #746 as documentation, not a license to restack AdminDashboard.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-004; PR #746  
REGRESSION_RISK: HIGH if a fourth list diverges from live `bossKits.ts`. HIGH if enemy `remove` drops a family that still lists CORE ids.  
VALIDATION_REQUIRED: Admin chips match `bossKits.ts`. Enemy delete of a referenced config `#err`s with a dependency report after 004. No fourth kit file appears.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-113  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Death-cut remount skips are not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 09-28-095 already covered #698 / #705 / #710 `saveBattleStats` skip after death-cut. Newer siblings [#742](https://github.com/Mr-Melic/stralt/pull/742), [#756](https://github.com/Mr-Melic/stralt/pull/756), [#759](https://github.com/Mr-Melic/stralt/pull/759), [#764](https://github.com/Mr-Melic/stralt/pull/764), [#767](https://github.com/Mr-Melic/stralt/pull/767) add remount / leftover-XP / portal-keep skip variants. `saveBattleStats` never mints and ignores spell-level arrays. Death penalty is 20% XP / 40% Doka via that write. Discovery must not piggy-back these skips. `ownedSpellIds` / `observedSpellIds` are append-only on the persist lock (09-23-009).  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit  
RECOMMENDED_ACTION: Same rule as 09-28-095. Union the new skip helpers; one `export function` per name. Do not write owned/observed ids inside a death-cut skip. Death does not clear observation; victory without re-observation does not unlock (default).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-28-095; PRs #742 / #756 / #759 / #764 / #767  
REGRESSION_RISK: HIGH if a remount skip is treated as a victory commit and grants an observed id. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Death-cut remount does not append `ownedSpellIds`. Observation from the lost fight stays. A later win without re-cast does not unlock. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-114  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #775 owner publish-gate copy; do not treat AUX labels as persist  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same-hour [#775](https://github.com/Mr-Melic/stralt/pull/775) adds owner publish-gate, list-sort, and editor-chrome **copy** helpers. That is the same class as [#724](https://github.com/Mr-Melic/stralt/pull/724) / 09-28-098: AUX labels on AdminDashboard are not Motoko `lifecycle`. Live retire is still `usableByPlayer=false` (`main.mo` 882–901). Spell Save is still a live overwrite (869–879). No draft / activate / rollback API. Restack-union with #564 `SpellSummonFields` and other AdminDashboard siblings; one `export function` per name.  
SYSTEMS_AFFECTED: AdminDashboard copy helpers; future `lifecycle` persist; SpellEditor extract  
RECOMMENDED_ACTION: Prefer #775 helpers for publish-gate **copy** only. Do not treat them as 09-23-001 persist. Do not grow AdminDashboard (8 280 lines) until activate exists (09-23-013 / 015). Restack rather than overwrite #413 / #564 / #724 / #775.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — copy only; persist stays 001.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-013; SDA-2026-09-23-015; SDA-2026-09-28-098; PR #775; PR #724  
REGRESSION_RISK: MEDIUM — concatenating a second publish-gate helper fails esbuild. HIGH if copy is mistaken for a canister `lifecycle` write.  
VALIDATION_REQUIRED: After #775 lands, Admin still cannot activate a draft on the canister. Duplicate-export scan clean. `#admin` stays the only studio gate.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-29-115  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour same-hour #769 / #771 encounter doors; first-grant only  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same-hour [#769](https://github.com/Mr-Melic/stralt/pull/769) is the 2026-09-29 world/dungeon/encounter admin design. [#771](https://github.com/Mr-Melic/stralt/pull/771) adds Bash/Dry/Hood encounter rooms. These sit beside #739 / #719 / #737 (already 109). Live achievements and challenges still cannot grant spells. Extra doors must not restamp Wave-1…11 feat ids or #726 `heave_cantor` … `court_dual_regent`.  
SYSTEMS_AFFECTED: encounter tag table; `spellRewardIds`; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 109. New rooms may carry one **named** `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` child. Do not restamp. Do not edit `mapGen.ts` algorithms. Grant through 09-23-012 + 009.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-29-109; SDA-2026-09-23-012; PR #769; PR #771  
REGRESSION_RISK: MEDIUM — a second grant on an already-stamped door double-pays a spell id.  
VALIDATION_REQUIRED: Bash/Dry/Hood victory grants only the stamped id, once. Defeat grants nothing. `pacifist_run` does not gain another spell.  
STATUS: NEW  

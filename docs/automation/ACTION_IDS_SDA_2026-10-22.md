# ACTION_IDs — 2026-10-22 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-22.md`](./SPELL_ADMIN_DESIGN_2026-10-22.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-22 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **130–144** (queue after #815). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **555**. Newest sibling before this work: **#886** (2026-10-22 00:14 UTC). Calendar: 2026-10-22. #870 `MASTER_ROADMAP.md` is a pre-existing oldest-first conflict (skipped); this PR does not touch that file.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-22-130  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #837 Wave-13 SDE stamps; do not pre-own generationMin 13 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#837](https://github.com/Mr-Melic/stralt/pull/837) is Wave-13 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md`, `generationMin: 13`). Unique §11 ids (`spell-knight-stride`, `spell-quad-oath`, `spell-pit-reel`, `spell-axis-bite`, `spell-shove-mark`, `spell-spent-plate`, `spell-rime-skip`, `spell-full-sting`, `spell-summon-cast`, `spell-hollow-gift`, `spell-cadence-swap`, `spell-strike-debt`, `spell-brick-nudge`, `spell-watch-sip`, `spell-lone-gait`, `spell-hazard-cut`, `spell-drift-gift`, `spell-pack-file`, `spell-diag-fold`) stay this catalog’s. `spell-pack-file` is `ENEMY_ONLY`. `spell-diag-fold` is `BOSS_ONLY`. `spell-hollow-gift` (target leftover AP **and** MP = 0 heal) and `spell-cadence-swap` (exchange remaining CD maps) **win** vs same-day #849 clones. Wave-13 family CORE is #747 unique + #787 tactical (except Parched Mend; Dry Gait already owns leftover-MP=0 heal). Wave-12 unique §11 stays extras until Wave 14. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-13 unique ids into that array, or hydrating Pack File because `usableByPlayer !== false` (`adminSafety.ts` 711–718), makes discovery worse. 10-21-116 already said the same for Wave-12 `#802`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-13 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, and 10-21-116. Honour #837 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Hollow Gift or Cadence Swap. Do not restamp Wave-1…12 doors or #787 / #849 extra doors. Do not implement Wave-13 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack File / Diag Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-21-116; PR #837; PR #849  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-13 ids. HIGH if `ENEMY_ONLY` Pack File is hydrated because `usableByPlayer !== false`. HIGH if `diag_fold_regent` also grants Knight Stride. HIGH if a Hollow Gift clone ships beside `spell-hollow-gift`.  
VALIDATION_REQUIRED: After a Wave-13 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Hollow Gift / Cadence Swap id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-131  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #849 Wave-13 tactical as Wave-14 CORE; Court Lag never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#849](https://github.com/Mr-Melic/stralt/pull/849) (`SPELL_PROPOSALS_2026-10-21.md`) owns G≥13 tactical holes: `spell-gaunt-mend`, `spell-cadence-lag`, `spell-oct-span`, `spell-even-hood`, `spell-gaunt-sting`, `spell-gaunt-step`, `spell-gaunt-sill`, `spell-odd-hold`, `spell-gaunt-lend`, `spell-bare-sip`, `spell-gaunt-post`, `spell-gaunt-bounce`, `spell-must-gaunt`, `spell-verse-gaunt`, `spell-gaunt-hold`, `spell-court-lag`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-lag` is `NOT_PLAYER_LEARNABLE`. Oct Span is plus-footprint occupy of **eight**; live `ENEMY_SUMMON_CAP` is still 2, so that card is implementation-blocked (`summonAI: "octspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` must not be restamped by SDE unique §11 or Wave-14 families. #837 already assigned target both-pools heal to `spell-hollow-gift` and remaining-CD exchange to `spell-cadence-swap` — do **not** ship clones. Wave **14** families consume the #849 ids as CORE. Live hydrate still pre-owns all 32 `starterSpells`. 10-21-117 covered Wave-12 tactical (#787) only.  
SYSTEMS_AFFECTED: Wave-13 tactical catalog; Wave-14 family CORE; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #849 ids. Do not clone them into SDE unique §11. `spell-court-lag` never enters `ownedSpellIds`. Do not activate Oct Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy / Six Span / Sept Span. Extra doors are first-grant; do not also hang Knight Stride / Hollow Gift / Diag Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `octspan` / `gauntpost` are real, not via a name parse.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-10-22-130; SDA-2026-10-21-117; PR #849  
REGRESSION_RISK: HIGH if Court Lag hydrates as a catalog grant. HIGH if Hollow Gift / Cadence Swap clones ship beside #837. MEDIUM if Oct Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Lag. Hollow Gift / Cadence Swap remain the #837 ids. Oct Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-132  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #840 Wave-13 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#840](https://github.com/Mr-Melic/stralt/pull/840) stamps Wave-13 family CORE from #787 tactical ids (except Parched Mend) and leftover Wave-11 unique CORE (#747). Court Imprint / Pack Long / Adj Fold / Pack Cap / Reach Fold stay boss/closed. SDE Wave-12 unique CORE waits for Wave 14. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone. 10-21-118 already said the same for Wave-12 `#796`.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-13 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #840 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone. Do not mint Wave-12 unique CORE (`spell-orth-stride` …) as this pass’s CORE. Do not ship `spell-parched-mend`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-10-21-118; PR #840  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Court Imprint / Pack File / Diag Fold is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn also gets venom-strike. Closed signatures never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-133  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #836 Wave-14 boss / Rush Table L; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#836](https://github.com/Mr-Melic/stralt/pull/836) extends `docs/design/BOSS_AND_SPELL_DISCOVERY.md` with Wave-14 boss sheets (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) and Rush Table L. Extra `ENEMY_DISCOVERY` doors reuse leftover #563 Dummy Post / Enter Mend / Split Mend **and** leftover #636 Quiet Sill only. Spectacular `CHOIR_EFFIGY` / `NAVE_THRESHOLD` / `CHOIR_SPLIT` / `NAVE_QUIET` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Live combat kits live in `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+). Admin chips `getSpellConfigs()`. Three sources. 09-23-011 / 028, 09-29-107, and 10-21-119 already require one id list.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko phase pools; Admin chips; `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #836 closed signatures as `BOSS_ONLY` / `ENEMY_ONLY`. Never write them to `ownedSpellIds`. Extra doors are first-grant on the named leftover #563 / #636 ids only. Do not restamp Wave-1…13 feat doors or #787 / #849 extra doors. One canonical kit list with 09-23-011 / 028 / #449. Do not add a fourth source. Do not “fix” Motoko pools by matching names. Validator marks unresolved chips crimson.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-003; SDA-2026-10-21-119; PR #836; PR #817  
REGRESSION_RISK: MEDIUM — empty resolved pool becomes melee-only. Granting a Table L arena verb hydrates a BOSS_ONLY id. MEDIUM — restamping Dummy Post as a Wave-14-only door double-pays a #563 id.  
VALIDATION_REQUIRED: Table L `BOSS_ONLY` ids never appear in a new character’s spellbook. Extra-door fights grant Dummy Post / Enter Mend / Split Mend / Quiet Sill at most once. Admin chips match live `bossKits.ts`. Court Hinge never enters `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-134  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #825 Wave-12 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#825](https://github.com/Mr-Melic/stralt/pull/825) proposes 16 world-pack formations that consume Wave-12 families from #796. Live `EnemyFamily` remains the original seven (`gameTypes.ts` 12–20). Formations are spawn composition, not `ownedSpellIds` writers. Zone NaN still hides ADVANCED kits (`WorldExploration.tsx` 11920). 09-23-010 / 10-21-118 / 10-21-126 already require numeric zone + CORE–SIGNATURE ids.  
SYSTEMS_AFFECTED: future formation store; Wave-12 family sheets; `ownedSpellIds`  
RECOMMENDED_ACTION: Consume #796 / #840 CORE ids inside formation recipes. Do not pre-own those ids. Do not treat a formation clear as `ENEMY_DISCOVERY` unless a named extra door is stamped. Do not edit `mapGen.ts`. Do not add a fourth kit source.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-22-132; SDA-2026-10-21-126; PR #825; PR #796  
REGRESSION_RISK: MEDIUM — a formation victory that grants every CORE id in the pack hydrates Wave-12 catalog rows.  
VALIDATION_REQUIRED: Clearing a Wave-12 formation does not append `ownedSpellIds` unless a named door is stamped. Live spawn still uses the original seven families until 001 ships.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-135  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #817 / #818; do not add a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#817](https://github.com/Mr-Melic/stralt/pull/817) and same-day [#876](https://github.com/Mr-Melic/stralt/pull/876) are enemy/boss admin re-audits that **mint no new EBA IDs** (`HEAD` still `0f5363f`). Open [#818](https://github.com/Mr-Melic/stralt/pull/818) names the live vs Motoko kit split in `useBossQueries.ts` and records three buff catalogs (`BUFF_ITEMS` / canister `BUFF_CATALOG` / mock `getBuffCatalog`). Live kits: (1) `data/bossKits.ts`, (2) Motoko `defaultBossConfigs()` purged ids (`admin.mo` 358+), (3) Admin chips on `getSpellConfigs()`. `adminDeleteEnemyConfig` (`main.mo` 798–804) is still unconditional `remove`. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). Official shop never calls `purchaseBuff`. 09-23-011 / 028, 09-29-112, and 10-21-120 already require one id list with #449 / #746.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko pools; Admin Enemy / Boss tabs; future `EnemyKit` store; BuffShop  
RECOMMENDED_ACTION: Consume existing EBA / 09-23-011 IDs. Do not file a fourth kit table. Naming the Motoko/live split in `useBossQueries.ts` is honesty, not a new source — union that comment; do not recopy kit ids. Enemy delete follows 09-23-004 (retire + report; hard-delete drafts only). Buff catalogs are not `ownedSpellIds` writers; prefer #466 for buff id-alias. Honour #817 / #818 as documentation, not a license to restack AdminDashboard.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-004; SDA-2026-10-21-120; PR #817; PR #818; PR #876  
REGRESSION_RISK: HIGH if a fourth list diverges from live `bossKits.ts`. HIGH if enemy `remove` drops a family that still lists CORE ids. MEDIUM if `purchaseBuff` is wired as a spell grant.  
VALIDATION_REQUIRED: Admin chips match `bossKits.ts`. Enemy delete of a referenced config `#err`s with a dependency report after 004. No fourth kit file appears. Buying a buff does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-136  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #838 owner UX; five-writer rollback is not spell rollback  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#838](https://github.com/Mr-Melic/stralt/pull/838) adds stack-safe owner helpers (`adminOwnerUx.auditView.ts`, `rollbackConfirm.ts`, `piiRedact.ts`, `dirty.ts`, `entityJump.ts`, `changelogPublish.ts`) and does **not** restack `AdminDashboard.tsx` (8 280 lines). Same-day [#883](https://github.com/Mr-Melic/stralt/pull/883) adds sprite-close / save-feedback / catalog-confirm / config-busy sidecars in the same `adminOwnerUx.*` family. Typed `ROLLBACK` covers the five last-good writers already on the actor (`adminRollbackLevelUpConfig` / `GameConfig` / `TierSpawnConfig` / `ColorPalette` / `BossRushConfig`). `adminSetSpellConfig` (`main.mo` 869–879) is still a live overwrite; **no** `adminRollbackSpellConfig`. `⌘K` indexes the 15 live tabs (5611–5626) and forbids empty Challenges / AI / Formations / Dungeons / Telemetry tabs. 09-23-013 still requires draft / validate / activate / rollback / compare / duplicate for **spells**.  
SYSTEMS_AFFECTED: Admin owner UX helpers; future Spell Versions tab; `useSpellQueries.ts`; not AdminDashboard restack  
RECOMMENDED_ACTION: Union #838 / #883 helpers — one `export function` per name. Do not treat five-writer rollback as spell rollback. Spell draft/activate stays 09-23-013 on the canister before any Versions tab. Do not add empty studio tabs to the `⌘K` index. Extract `SpellEditor` onto `useSpellQueries.ts` (293 lines). Do not grow AdminDashboard. Do not recopy helpers into `adminSafety.ts`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-013 exists.  
DEPENDENCIES: SDA-2026-09-23-013; SDA-2026-09-23-015; SDA-2026-09-23-001; PR #838; PR #883  
REGRESSION_RISK: HIGH if a spell Save is wired to the five-writer rollback confirm and silently no-ops. MEDIUM — concatenating a second `readOwnerAuditLog` fails esbuild. MEDIUM — shipping empty Discovery/Kits tabs leaks an unfinished studio.  
VALIDATION_REQUIRED: Spell Save still has no rollback control until 013. `⌘K` lists the 15 live tabs only. Duplicate-export scan clean. Player `#play` cannot open the studio.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-137  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #831 dust-mote extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#831](https://github.com/Mr-Melic/stralt/pull/831) extracts dust-mote seed/recycle from `WorldExploration.tsx` (19 213 lines) into `engine/dustMotes.ts`. Older still-open PRs #327 / #331 / #639 / #683 / #730 / #798 already edit WX; #831 itself WARN-conflicts WX on oldest-first. 10-21-121 already required union with the camera-follow extract. Studio wiring that appends observation or catalog filters inside WX will fight those extracts and fail duplicate-`export function` restack. Queued #842 also edits WX for hostile summon kit attach.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `dustMotes.ts`; `cameraFollow.ts`; `ambientOcclusion.ts`; future observe hook  
RECOMMENDED_ACTION: Discovery / ownership helpers stay in `engine/*` / `utils/*`. WX only gets one-line call sites. If a persist PR also touches WX, union #327 / #331 / #639 / #683 / #730 / #798 / #831 / #842. Keep one `export function` per name. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-003 / 009 exist.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-21-121; PR #831; PR #798; PR #327; PR #331  
REGRESSION_RISK: MEDIUM — concatenating a second helper on restack fails `vite build`. Growing WX is forbidden.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Observe hook is not inlined in WX. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-138  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Hostile #842 kit casts may observe; player #861 auto-summon must not  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#842](https://github.com/Mr-Melic/stralt/pull/842) attaches catalog `summonKit` on `spawnEnemySummonUnit` and keeps catalog `summonAI` (`engine/enemySummonKit.ts`). Hostile minions then `decideSummonAction` and spend AP on kit ids (Venom Strike, Poison, Slow). 08-31 §5: hostile summons may observe; player-side summons must not. Open [#861](https://github.com/Mr-Melic/stralt/pull/861) resolves player auto-summon catalog kits when spawn left `spells` empty (`engine/autoSummonKitSpells.ts`) so Bomber Inferno / Sentinel Shield decide can find the id. Resolving a kit onto `summon.spells` is not a cast and is not a grant. Live `inferSummonArchetype` still parses `summon.name` (`enemyAI.ts` 217–224). Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139).  
SYSTEMS_AFFECTED: observe hook; `enemySummonKit.ts`; `autoSummonKitSpells.ts`; `summonSpawn.ts`; future `ownedSpellIds` / `observedSpellIds`  
RECOMMENDED_ACTION: On successful hostile summon `kind === "cast"` that spent AP, enqueue `recordSpellObservation` for that kit id (09-23-009). Player auto-summon decide / control-panel casts do **not** observe and do **not** unlock. Do not treat kit attach itself as observation. Empty `summonAI` stays a validation error, not `"hunter"`. Union #842 / #861 helpers — one `export function` per name. Do not restack WX / `summonSpawn.ts` from this studio.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-21-122; PR #842; PR #861  
REGRESSION_RISK: HIGH if player auto-summon Inferno observe-unlocks Inferno without an enemy cast. HIGH if kit attach (no AP) is counted as observation. MEDIUM — concatenating a second attach helper fails esbuild.  
VALIDATION_REQUIRED: Hostile wolf Venom Strike AP-spent cast observes that id; flee keeps observation without unlock; win unlocks once if `PLAYER_LEARNABLE`. Player Sentinel auto-cast Shield does not observe. Rename the summon; observation still keys the spell id. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-139  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist kit-execute metadata flags; union 10-21 execute sidecars  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Motoko persist (`admin.mo` 92–127) and bindgen still omit `targetType`, `isSwap` / `isMark` / `isMirror` / `isTimestep`, buff/debuff/DoT fields, and `bounces`. Open kit-execute sidecars prove combat already keys those flags, **never** `spell.name`: [#850](https://github.com/Mr-Melic/stralt/pull/850) `isSwap`, [#851](https://github.com/Mr-Melic/stralt/pull/851) `isMark`, [#852](https://github.com/Mr-Melic/stralt/pull/852) `isMirror`, [#843](https://github.com/Mr-Melic/stralt/pull/843) / [#865](https://github.com/Mr-Melic/stralt/pull/865) `buffStat`, [#857](https://github.com/Mr-Melic/stralt/pull/857) / [#862](https://github.com/Mr-Melic/stralt/pull/862) heal+`buffStat` CHC, [#856](https://github.com/Mr-Melic/stralt/pull/856) DoT ticks, [#868](https://github.com/Mr-Melic/stralt/pull/868) Chain Lightning `bounces` (helper lives under `utils/`), [#878](https://github.com/Mr-Melic/stralt/pull/878) Slow `debuffStat`. Admin `newSpell()` seeds the mechanic bools (`AdminDashboard.tsx` 124–130) but Save cannot round-trip them. 10-21-122 already forbade writing Inferno `areaRadius: 2` from the bomber blast. 09-23-005 is the persist work.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; SpellEditor; kit-execute sidecars; `spellEngine.ts`  
RECOMMENDED_ACTION: Persist `targetType` plus the mechanic/status/area fields 08-31 §3 requires (or an ordered `effects` list plus a compatibility projection). Activate rejects missing `isSwap`/`isMark`/`isMirror`/`buffStat`/`bounces` when the corresponding flag/id is set. Never key execute off display name. Union the sidecar helpers — one `export function` per name; do not recopy into WX. Ship Motoko + bindgen + editor together. Do not redeploy `backend_extended/`.  
AUTONOMY: HUMAN_APPROVE — Motoko + bindgen + actor together.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-002; SDA-2026-10-21-122; PRs #843 / #850 / #851 / #852 / #856 / #857 / #862 / #865 / #868 / #878  
REGRESSION_RISK: HIGH — a default of `enemy` on self-heals would break Blood Mend / Shield. HIGH if Inferno `areaRadius` becomes 2. MEDIUM — concatenating a second Swap execute helper fails esbuild.  
VALIDATION_REQUIRED: Save Swap (`isSwap=true`), Mark (`isMark=true`), Mirror (`isMirror=true`, `targetType=self`), Rallying Cry (`buffStat=chc`), Chain Lightning (`bounces=2`); refetch matches. Rename Mirror; boss reflect still applies. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-140  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #815; not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 10-21-124 already covered #800 / #807 / #811 / #812 / #813 remount skips. After #815: [#847](https://github.com/Mr-Melic/stralt/pull/847) death HP keep, [#854](https://github.com/Mr-Melic/stralt/pull/854) absolute HP keep, [#860](https://github.com/Mr-Melic/stralt/pull/860) shop/heal throw-after-accept HP, [#864](https://github.com/Mr-Melic/stralt/pull/864) Boss Rush Doka keep, [#866](https://github.com/Mr-Melic/stralt/pull/866) Boss Rush Doka death-cut, [#869](https://github.com/Mr-Melic/stralt/pull/869) victory Doka death-cut, [#877](https://github.com/Mr-Melic/stralt/pull/877) one-shot Doka death-cut. Each is a new sidecar so older PRs keep their files. `saveBattleStats` never mints and ignores spell-level arrays. `claimAchievementReward` pays **Doka only**. Discovery must not piggy-back these skips. `ownedSpellIds` / `observedSpellIds` are append-only on the persist lock (09-23-009).  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit; feat claim  
RECOMMENDED_ACTION: Same rule as 09-29-113 / 10-21-124. Union the new skip helpers; one `export function` per name. Do not write owned/observed ids inside a remount skip. Boss Rush / victory Doka keep is still `applyRewards`, never a `spellRewardIds` commit. Death does not clear observation; victory without re-observation does not unlock (default).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-21-124; PRs #847 / #854 / #860 / #864 / #866 / #869 / #877  
REGRESSION_RISK: HIGH if a Boss Rush Doka remount skip is treated as a victory commit and grants an observed id. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Boss Rush / victory remount does not append `ownedSpellIds`. Observation from the lost fight stays. A later win without re-cast does not unlock. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-141  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Grow closed knownSummonAI with octspan / gauntpost enums  
CATEGORY: no-heuristics  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter | guardian | archer | kiter | bomber | kamikaze | healer` (`adminGuard.mo` 363–366; `adminSafety.ts` 19–27). Closed `knownPieceType` still omits `font` / `dummypost` / `pentaspan` / `septspan` (368–373). Queued #849 adds `summonAI: "octspan"` / `"gauntpost"`. Queued #787 adds `"sixspan"`. 09-23-002 / 008 already require the enum on activate and forbid `inferSummonArchetype` name fallback (`enemyAI.ts` 217–224) and `spell.name.replace("Summon ", "")` (`summonSpawn.ts` 165). Empty `summonAI` is a validation error on both client and Motoko when `isSummon` (423–425 / 625–628) but runtime still coerces `"hunter"` (139).  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` `SUMMON_AIS`; SpellEditor; `enemyAI.ts`; `summonSpawn.ts`  
RECOMMENDED_ACTION: When 09-23-002 ships, extend the **same** closed enum on Motoko and client together: keep today’s seven, add `octspan` / `gauntpost` / `sixspan` / `font` / `dummypost` / `pentaspan` / `septspan` only when those cards activate. Never parse `summon.name`. Display name is an explicit `SummonUnitDef.displayName`. Occupy-weight / cap still blocks Oct Span / Six Span / Sept Span activate (131).  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-22-131; SDA-2026-10-21-117; PR #849  
REGRESSION_RISK: HIGH if `"octspan"` is inferred from a unit named “Oct”. MEDIUM if the enum grows on one side only (client Save vs Motoko reject).  
VALIDATION_REQUIRED: Activate of a summon with `summonAI="octspan"` and `displayName="Oct Span"` round-trips. Rename the spell; unit name stays. Unknown `summonAI="wolf"` fails client and Motoko with the same string. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-142  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #823 / #826; leftover feats and ENC rooms are not grants  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#823](https://github.com/Mr-Melic/stralt/pull/823) mints EXP-2026-10-21-037 (gate enemy healer interpose on `ENEMY_AI_TIER_GATES.groupTactics`) and 038 (one-cell Glyph Plate). Same-day [#875](https://github.com/Mr-Melic/stralt/pull/875) is the 10-22 Expansion catalog. Neither is a `spellRewardIds` slice. Live achievements cannot grant spells (`AchievementConfig` has only `dokaReward`, `admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is a closed 15-key whitelist (`adminSafety.ts` 306–322). Open [#826](https://github.com/Mr-Melic/stralt/pull/826) is an `ENC-*` room catalog (Both/Stride/Near); same-day [#885](https://github.com/Mr-Melic/stralt/pull/885) is Heave/Dual/Mid. Both are explicitly **not** spell catalogs. 09-29-111 / 10-21-125 already locked leftover doors as unused spell gates. 10-21-126 already said formations are not grants.  
SYSTEMS_AFFECTED: leftover feat-door table; `spellRewardIds`; encounter rooms; Expansion catalog  
RECOMMENDED_ACTION: Do not hang a Wave-13 / Wave-14 id on 037 / 038. New grants use 09-23-012 explicit ids on **named** unused doors only when a designer claims one. Encounter rooms may later be `SPECIAL_ENCOUNTER` stamps; clearing `ENC-*` does not append `ownedSpellIds` unless a named door is stamped. Do not consume #826 ids into SDE unique §11. Honour 09-29-111 / 10-21-125 copy.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-10-21-125; PR #823; PR #826; PR #875; PR #885  
REGRESSION_RISK: MEDIUM — restamping Glyph Plate as a spell door collides with a later identity card. MEDIUM — treating an ENC-SPELL-* room clear as observe+win hydrates a Wave-13 unique id.  
VALIDATION_REQUIRED: Healer interpose / Glyph Plate still pay no spell id. Clearing an ENC room does not append `ownedSpellIds` unless a named door is stamped. `first_blood` / `unstoppable` do not append an owned spell id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-143  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #821 AI increment; AI modules in the dependency view  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#821](https://github.com/Mr-Melic/stralt/pull/821) is the 10-21 enemy AI evolution increment (design only; AI-SYS-78…83, FUT-96…101). Same-day [#874](https://github.com/Mr-Melic/stralt/pull/874) is the 10-22 increment (`ENEMY_AI_EVOLUTION_2026-10-22.md`). 08-31 §7 requires spell → AI modules on the inspector. Live `inferArchetype` still classifies healer from `healAmount > 0` and berserker from `family.includes("berserk")` (`enemyAI.ts` 447–477). `inferSummonArchetype` still parses `summon.name` (`enemyAI.ts` 217–224). Closed `knownSummonAI` omits `font` / `dummypost` / `pentaspan` / `septspan` / `octspan` / `gauntpost` / `sixspan`. Retire/delete of a kit id must surface AI-module refs; hard-delete of a draft with an authored AI profile that still lists the id must `#err`. 10-21-127 already said the same for #804.  
SYSTEMS_AFFECTED: future dependency inspector; `enemyAI.ts`; SpellEditor; AI module catalog  
RECOMMENDED_ACTION: Inspector lists AI modules by **id**, not by scanning display names. Honour #821 as documentation of modules; do not grow `enemyAI.ts` tables from this studio. Empty `summonAI` is a validation error (09-23-002 / 008 / 141), not `"hunter"`. `family.includes("berserk")` is a name heuristic — do not add more.  
AUTONOMY: HUMAN_APPROVE — with 09-23-004 / 002.  
DEPENDENCIES: SDA-2026-09-23-004; SDA-2026-09-23-002; SDA-2026-09-23-008; SDA-2026-10-22-141; SDA-2026-10-21-127; PR #821; PR #874  
REGRESSION_RISK: MEDIUM — inferring `summonAI` from “Oct Span” / “Gaunt Post” on activate would fight #849 metadata.  
VALIDATION_REQUIRED: Retire of a CORE id lists the family / AI module that references it. Rename the spell; the AI module still resolves by id. Activate rejects unknown `summonAI`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-22-144  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #828; do not enforce minLevel as an ownership substitute  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#828](https://github.com/Mr-Melic/stralt/pull/828) sidecars `spellMinLevelHydrate.ts` and `retiredFeatClaimHidden.ts`. Live `SpellConfig.minLevel` is catalog copy (`admin.mo` 119). `void_collapse` seeds `minLevel: 30` (`admin.mo` 190) and still hydrates a level-1 book because `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 711–718) only reads `usableByPlayer` + the inverted owned set. `upgradeSpell` does not check minLevel. A future hydrate gate `player.level < minLevel` **without** stored `ownedSpellIds` would strip never-upgraded catalog rows from yesterday / six-month / pre-minLevel cohorts (empty `spellLevelKeys`). Official AchievementsPanel filters `cfg.active`, so an unlocked-but-unclaimed retired feat disappears from Claim while `claimAchievementReward` still pays current Doka. 08-31 §8.2 / 09-23-012: new achievement grants skip a retired **spell** reward id and still pay Doka; they must not hide the Doka claim.  
SYSTEMS_AFFECTED: library hydrate; `ownedSpellIds` migration; `upgradeSpell`; AchievementsPanel; future `spellRewardIds`  
RECOMMENDED_ACTION: Prefer #828’s sidecars — do not recopy into `adminSafety.ts`. Do **not** start enforcing `minLevel` at hydrate, library, or `upgradeSpell` until 09-23-003 stores ownership. After ownership exists, `minLevel` is a post-own cast/equip gate (like `usableByPlayer`), never a reason to drop an already-owned id, and never a migrate-from-catalog filter. Retired unclaimed feats stay claimable for frozen Doka (#437 / SDEG-008); `spellRewardIds` on a retired achievement skip the spell and still pay Doka. Union helpers; one `export function` per name.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 012.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-012; SDA-2026-09-23-001; PR #828; PR #437  
REGRESSION_RISK: HIGH if minLevel is applied as a library filter before `ownedSpellIds` exists (L1 loses `void_collapse` they already played). HIGH if retiring a feat with a future `spellRewardIds` also hides the Doka claim. MEDIUM — concatenating a second minLevel helper fails esbuild.  
VALIDATION_REQUIRED: L1 still sees current catalog rows on this HEAD. After 003, a player who owns a minLevel-30 id keeps it at L1; a new player does not receive it from hydrate. Retired unclaimed feat still claims Doka; retired spell reward id is skipped. Duplicate-export scan clean.  
STATUS: NEW  

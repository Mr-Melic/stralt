# ACTION_IDs — 2026-10-26 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-26.md`](./SPELL_ADMIN_DESIGN_2026-10-26.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-26 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940); 10-24 queue-union IDs `160` … `174` live on [#1007](https://github.com/Mr-Melic/stralt/pull/1007); 10-25 queue-union IDs `175` … `189` live on [#1078](https://github.com/Mr-Melic/stralt/pull/1078). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **190–204** (queue after #1078). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **803+** at this patch (later 10-25 flock continued through **#1107**; same-hour 10-26 flock through **#1139**). Newest sibling before this work: **#1139** (Wave-19 bosses / Rush Table Q). Calendar: 2026-10-26. Same-hour flock uses unique dated filenames — do not overwrite #1078 SDA, #1082 SDE, #1080 boss bible, #1083 SDEG, #1101 CRC, #1106 quality audit `*2026-10-25*` files, or `*2026-10-26*` siblings (#1108–#1139, including `SPELL_PROPOSALS_2026-10-26.md`, `ENEMY_FORMATIONS_2026-10-26.md`, `ENEMY_ELITE_EVOLUTION_2026-10-26.md`, `ENEMY_AI_EVOLUTION_2026-10-26.md`, `ACTION_IDS_ADMIN_UX_2026-10-26.md`, `ACTION_IDS_SDEG_2026-10-26.md`, `ACTION_IDS_WDEAD_2026-10-26.md`, `ACTION_IDS_AFDA_2026-10-26.md`, `ACTION_IDS_AEE_2026-10-26.md`). #870 / #946 / #998 / #1074 / **#1124** `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-26-190  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1082 Wave-17 SDE stamps; do not pre-own generationMin 17 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1082](https://github.com/Mr-Melic/stralt/pull/1082) is Wave-17 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md`, `generationMin: 17`). Unique §11 ids (`spell-tern-stride`, `spell-octa-oath`, `spell-mire-reel`, `spell-diag-bite`, `spell-summon-mark`, `spell-prime-plate`, `spell-slide-skip`, `spell-capped-sting`, `spell-summon-orth`, `spell-gait-gift`, `spell-cadence-tern`, `spell-odd-toll`, `spell-brick-tax`, `spell-watch-tax`, `spell-thin-gait`, `spell-lava-cut`, `spell-strike-plate`, `spell-pack-ring`, `spell-lane-fold`) stay this catalog’s. `spell-pack-ring` is `ENEMY_ONLY`. `spell-lane-fold` is `BOSS_ONLY`. Gait Gift is leftover AP **≥ 2 AND** leftover MP **= 0**. Cadence Tern is remaining `n>3` → 3. Prime Plate is leftover **1/1** negate. Wave-17 family CORE is #962 unique + #1011 (via #1073). Unique §11 stay extras until Wave 19. Unique Wave-16 §11 (#1017) stay extras until Wave 18. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-17 unique ids into that array, or hydrating Pack Ring because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-25-175 already said the same for Wave-16 `#1017`. Still-open #982 freezes **shipping** Wave-15/16 live rows until 09-23-003.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-17 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, 10-23-145, 10-24-160, and 10-25-175. Honour #1082 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Gait Gift or Cadence Tern (see 199). Do not restamp Wave-1…16 doors or #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1132 extra doors. Do not implement Wave-17 or Wave-18 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Ring / Lane Fold / Court Tierce.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-25-175; SDA-2026-10-26-199; PR #1082; PR #1063  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-17 ids. HIGH if `ENEMY_ONLY` Pack Ring is hydrated because `usableByPlayer !== false`. HIGH if `lane_fold_regent` also grants Tern Stride. HIGH if a Gait Gift / Cadence Tern clone ships beside the #1082 ids.  
VALIDATION_REQUIRED: After a Wave-17 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Gait Gift / Cadence Tern id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-191  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1080 Wave-18 boss / Rush Table P; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1080](https://github.com/Mr-Melic/stralt/pull/1080) unions Wave 18 + Rush **Table P** onto `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. New bosses `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` are not in live `BOSS_IDS`. Extra doors on leftover #636 Pair Slide plus leftover #695 / #726 / #787 Both Mend / Heave Mend / Parched Mend. Spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`. Same-hour [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-**19** + Rush **Table Q**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`; `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`. Extra doors leftover #695 Stride Keep / Damp Sting, leftover #726 Dual Keep, leftover #787 Cadence Imprint. No new #137 spell ids. Table P/Q are owner overlays; canister `completeBossRushRoom` still must not see `roomIndex > 9`. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal — do not remap `parched_cantor` / `stride_bursar` / `dual_bursar`. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. 10-25-178 already said the same for Wave-17 `#1004` / Table O.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #1080 / #1139 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-25-185). Do not restamp Wave-1…18 feat doors, leftover #563 Dummy Post / Enter Mend / Split Mend, leftover #636 Quiet Sill / Gait Wick / Dry Sting / Home Step / Must Span / Shove Mend / Exit Sting / Cadence Stretch / Far Hood / Boot Lend / Purse Keep / Tick Plate / Last Mute (#836 / #903 / #951 / #1004), or #890 / #953 / #1011 / #1063 extra doors. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `stride_bursar` / `dual_bursar` / `imprint_precentor`. Table P/Q are owner overlays, never an 11th canister room. Quad Span / Hendeca Span / Dodeca Span / Trideca Span stay off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-25-178; SDA-2026-10-26-200; PR #1080  
REGRESSION_RISK: HIGH if CHOIR_SLIDE hydrates as a catalog grant. MEDIUM if Table P is written as `roomIndex > 9`. MEDIUM if Parched Mend and Dry Gait both grant from `parched_preacher`.  
VALIDATION_REQUIRED: After these bosses exist, a new character does not own CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / NAVE_STRIDE / NAVE_DUAL / CHOIR_IMPRINT / CHOIR_DAMP. `completeBossRushRoom` still rejects `roomIndex > 9`. Extra-door fights grant the stamped leftover id at most once. Admin chips still do not invent a fourth kit table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-192  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1075 Wave-16 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1075](https://github.com/Mr-Melic/stralt/pull/1075) is Wave-16 synergy formations (drop 17) in unique `docs/design/ENEMY_FORMATIONS_2026-10-25.md`. Sixteen proposed ids (`FSN-TALLY-STEP` … `FSN-TALLY-HOLD`) pack #997 families. Same-hour [#1134](https://github.com/Mr-Melic/stralt/pull/1134) is Wave-17 formations drop 18 (`ENEMY_FORMATIONS_2026-10-26.md`, `FSN-SCORE-STEP` … `FSN-SCORE-HOLD`) packing #1073 families. Live `EnemyFamily` remains the original seven. Dec Plug / Hendeca Plug skip while live cap is 2 (`gameConstants.ts` 300). Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Zone NaN still hides paper ADVANCED (WX 11920). 10-25-179 already said the same for Wave-15 `#1005`.  
SYSTEMS_AFFECTED: future formation overlay; Wave-16 family CORE; `ownedSpellIds`; summon cap  
RECOMMENDED_ACTION: Consume CORE ids; clearing a formation is not a grant. Do not copy FSN-* sheets into `starterSpells`. Do not CORE unique Wave-17 §11 (#1082) or Wave-18 family CORE (#1063 / #1132). Honour leftover-AP **and** leftover-MP gates as metadata, never names. Do not PAIR `tally_holder` + `must_tallier` or `score_holder` + `must_scorer`. Do not clone Hollow Gift / Equal Gift / Purse Turn / Watch Bank. Pass a numeric zone before ADVANCED rows can resolve (09-23-010). Do not overwrite `ENEMY_FORMATIONS_2026-10-26.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-25-179; PR #1075; PR #997  
REGRESSION_RISK: HIGH if a formation clear appends Tally Mend / Score Mend to `ownedSpellIds`. MEDIUM if Dec Plug ships while summon cap is 2.  
VALIDATION_REQUIRED: After FSN-* ids exist as design stamps, a new character owns none of them. Clearing Tally Gate does not grant Tally Mend. Pack Diag / Far Fold / Court Snuff stay never-owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-193  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/decide metadata flags; union caster LoS Frost, summon-archer Poison, and Crush CHC  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open sidecars after #1054: [#1081](https://github.com/Mr-Melic/stralt/pull/1081) pack-caster LoS-reposition Frost (`wxEnemyCasterLosFrost.ts` keys `damage>0` + `debuffStat=="mp"`), [#1085](https://github.com/Mr-Melic/stralt/pull/1085) pack-heal fallback-retreat Frost (`wxEnemyHealRetreatFrost.ts`), [#1087](https://github.com/Mr-Melic/stralt/pull/1087) pack-flanker wounded-retreat Strike, [#1090](https://github.com/Mr-Melic/stralt/pull/1090) pack-heal LoS Frost, [#1091](https://github.com/Mr-Melic/stralt/pull/1091) pack-caster wounded-retreat Strike, [#1094](https://github.com/Mr-Melic/stralt/pull/1094) Enthroned Void `DAMAGE_IMMUNE`, [#1095](https://github.com/Mr-Melic/stralt/pull/1095) auto-summon archer LoS Poison (`summonArcherLosPoison.ts`), [#1096](https://github.com/Mr-Melic/stralt/pull/1096) WX summon-archer LoS Poison (`wxSummonArcherLosPoison.ts`), [#1098](https://github.com/Mr-Melic/stralt/pull/1098) summon-archer LoS Slow, [#1104](https://github.com/Mr-Melic/stralt/pull/1104) boss kit damage advertised CHC (`bossKitDamageCritExecute.ts`), [#1107](https://github.com/Mr-Melic/stralt/pull/1107) pack Crush/Fire Bolt fallback CHC (`packEnemyFallbackMeleeCrit.ts` keys `e-crush` / `e-firebolt` **ids**), same-hour [#1123](https://github.com/Mr-Melic/stralt/pull/1123) summon-hunter LoS-blocked Venom (`wxSummonHunterLosVenom.ts` keys kit[1] `spell-venom-strike` **id** + Chebyshev `Number(range)`, never “Venom”). Tests assert “keys off metadata, not the display name.” Unique files vs 10-25 #1026/#1033/#1034/#1054. #1095 and #1096 are two Poison leftovers — concatenating two `pickWx…` copies fails esbuild. Do not rebalance wolf AP 2 vs Venom cost 3.  
SYSTEMS_AFFECTED: `engine/*` kit-execute helpers; future SpellDefinition mechanic flags; observe hook  
RECOMMENDED_ACTION: Persist those flags with 09-23-005 (`targetType`, `debuffStat`, `healAmount`, `chc`, `DAMAGE_IMMUNE`, range, LoS). Union sidecars; **one** `export function` per name. Hostile kit execute may observe (10-22-138); player execute must not. Do not add `if (spell.name === "Frost")` / `"Crush"` / `"Poison"` / `"Venom"` branches. Do not grow WX; restack call sites onto the helpers after older combat PRs land. Do not rebalance wolf AP 2 vs Venom cost 3.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-25-180; SDA-2026-10-26-197  
REGRESSION_RISK: HIGH if two Poison pickers concatenate. HIGH if Crush fallback treats `physical_attack` named “Crush” as `e-crush`. MEDIUM if LoS-reposition Frost steals wounded-retreat Frost (#1054).  
VALIDATION_REQUIRED: Each sidecar’s “not the display name” test still passes. Duplicate `export function` scan is clean. Hostile Frost cast observes once 009 exists; player Frost does not. Pack fallback with id `physical_attack` and name Crush is not a Crush crit.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-194  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #1078; leftover-XP / one-shot keep is not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1088](https://github.com/Mr-Melic/stralt/pull/1088) `victoryXpKeepRemountOneShotCreditWriteSkip.ts`, [#1092](https://github.com/Mr-Melic/stralt/pull/1092) `portalXpKeepRemountOneShotCreditWriteSkip.ts`, [#1099](https://github.com/Mr-Melic/stralt/pull/1099) `xpCreditKeepRemountOneShotCreditWriteSkip.ts` skip remount leftover-XP wipe after one-shot Doka keep following victory XP throw / portal XP throw / leftover-XP keep. Same-hour [#1129](https://github.com/Mr-Melic/stralt/pull/1129) `victoryDokaKeepRemountPortalCreditWriteSkip.ts` skips leftover-Doka wipe after portal persist following victory Doka keep. Unique sidecar files vs 10-25 #1043 / #1045 / #1046 (those two share `portalXpKeepRemountRenameSpendWriteSkip.ts` — union one export). Live recap still has no `discoveredSpells`. `saveBattleStats` is still not a grant writer. 10-25-181 already said leftover-XP keep is not `commitSpellDiscoveries`.  
SYSTEMS_AFFECTED: remount skip helpers; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Same class as 10-24-166 / 10-25-181. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Observe still requires a successful hostile cast; unlock still requires that same-encounter win on the persist lock. Do not treat a remount keep, a portal XP throw, a leftover-Doka honour, or a one-shot Doka keep as victory.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-25-181  
REGRESSION_RISK: HIGH if observe/commit is wired onto a remount skip and double-grants. MEDIUM if two skip helpers concatenate the same export name.  
VALIDATION_REQUIRED: Cast then remount-keep does not unlock. Cast then flee still observes without unlock. Duplicate-export scan is clean across the three new skip files and #1045/#1046.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-195  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Grow closed knownSummonAI with dodecaspan enum  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter|guardian|archer|kiter|bomber|kamikaze|healer` (`adminGuard.mo` 363–366). #1063 Dodeca Span (`spell-dodeca-span`, occupy-weight **twelve**, `summonAI: "dodecaspan"`) is Wave-**18** family CORE and implementation-blocked while `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). 10-25-182 already asked to grow the closed list with `hendecaspan` / `scorepost` (#1011). Unique Wave-17 §11 (#1082) does **not** add an occupy-weight summon — Octa Oath is a Chebyshev-8 **spell gate**, not occupy 8 (`spell-octa-span` stays tombstoned). Runtime empty-AI fallback is still `spell.summonAI || "hunter"` (`summonSpawn.ts` 139).  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` client twin; SpellEditor summon section; #1063 / #1011 occupy cards  
RECOMMENDED_ACTION: When 09-23-002 lands, extend the **same** closed enum on Motoko and client with every queued occupy/post string that a real card stamps: `font` / `dummypost` / `pentaspan` / `septspan` / `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / **`dodecaspan`**. Do not parse `spell.name` (“Dodeca”, “Twelve”). Reject activate of occupy-weight > live cap. Do not re-issue 182. Same-hour #1132 Trideca Span occupy-weight **thirteen** — grow the closed list with **`tridecaspan`** when that card stamps `summonAI`; do not invent `spell-thirteen-span` / `spell-twelve-span`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-10-25-182; PR #1063; PR #1132  
REGRESSION_RISK: HIGH if Dodeca Span activates while cap is 2. HIGH if `dodecaspan` is inferred from the display name. MEDIUM if Motoko and client lists drift.  
VALIDATION_REQUIRED: Saving `isSummon=true` + `summonAI="dodecaspan"` fails activate while cap is 2 and passes the shared validator once occupy-weight / cap exists. Empty `summonAI` still fails both sides. Rename “Summon Dodeca Span” does not change AI.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-196  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1015/#1050 WDEAD / later map snaps / #1006/#1056 ENC / #993/#1064 WF; not grants  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WDEAD 10-24 (#1015) / 10-25 (#1050) occupancy/remount rails already covered by 10-25-183. Later map snaps [#1086](https://github.com/Mr-Melic/stralt/pull/1086) Gutter Steam, [#1093](https://github.com/Mr-Melic/stralt/pull/1093) Frost Pane, [#1103](https://github.com/Mr-Melic/stralt/pull/1103) Triune Pads are leftover-crumb layout, not spell catalogs. ENC #1006 / #1056 already covered: `ENC-POISE-01` is not Gait Gift; `ENC-KNIGHT-01` is not Tern Stride; `ENC-PIT-02` is not Mire Reel. Same-hour [#1121](https://github.com/Mr-Melic/stralt/pull/1121) is the eighteenth ENC catalog (`ENCOUNTER_EVOLUTION_2026-10-26.md`, Dual Keep leftover AP+MP === 3, Tally/Rank/Spike/Odd primer) — clearing those rooms is still not a grant. WDD #993 / #1064 `WF-*` are world features; same-hour [#1114](https://github.com/Mr-Melic/stralt/pull/1114) Wave-18 WDD (`WDD-2026-10-26-001`, Pair Seam … Pair Draft, Ready Gate exploration-only) is not a grant. Live `fog_of_war` is still announce-only.  
SYSTEMS_AFFECTED: encounter tag table; map crumb helpers; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Occupancy unseals / unique-corridor copies / crumb snaps are not grants unless a named door is stamped (`tern_gallery` etc. stay #1082’s). Do not consume `ENC-*` / `WF-*` / ENC-TEACH-18 / ENC-SPELL-35 into unique §11. Do not overwrite #1015 `*2026-10-24*` or #1050 / #1056 / #1064 `*2026-10-25*` or #1114 / #1121 / #1128 `*2026-10-26*` files. Do not edit `mapGen.ts` algorithms from this studio. Do not restack `WORLD_DYNAMICS.md`. Spent Bridge (#1127) is a crumb snap, not Tern Stride’s door.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-10-25-183; SDA-2026-10-26-198; PR #1082  
REGRESSION_RISK: MEDIUM if a crumb snap is later tagged as Tern Stride’s door. MEDIUM if `ENC-KNIGHT-01` is retagged.  
VALIDATION_REQUIRED: Gutter Steam / Frost Pane / Triune Pads snaps do not append `ownedSpellIds`. `ENC-KNIGHT-01` still teaches Knight Stride. `tern_gallery` is the only Tern Stride door once stamped.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-197  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep later combat helpers in engine/*; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `WorldExploration.tsx` is still 19 213 lines. Queued [#1076](https://github.com/Mr-Melic/stralt/pull/1076) extracts hazard overlay paint (`mapHazardPaint.ts`) and would shrink WX to 19 117 — not landed. Same-hour [#1109](https://github.com/Mr-Melic/stralt/pull/1109) extracts in-battle portal cube paint (`battlePortalCube.ts`) and **shrinks** WX. Later kit-execute/soak helpers live in `engine/*` except [#1079](https://github.com/Mr-Melic/stralt/pull/1079) Mirror Field soak and [#1097](https://github.com/Mr-Melic/stralt/pull/1097) battle-walk Thorned/Rift soak, which **restack WX**. AdminDashboard is 8 280. `useSpellQueries.ts` is 293 and already the write landing. 10-25-184 already forbade growing WX after #995.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/*` extracts; SpellEditor extract; AdminDashboard  
RECOMMENDED_ACTION: Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites onto #1076 / #1109 / #1079 / #1097 after those land — do not inline observe/commit into WX, `mapHazardPaint`, or `battlePortalCube`. Do not grow AdminDashboard until activate exists; extract SpellEditor onto `useSpellQueries.ts`. One `export function` per name on restack.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-25-184; SDA-2026-10-26-193  
REGRESSION_RISK: HIGH if observe is inlined into WX and conflicts with #1079 / #1097. MEDIUM if a second SpellEditor copy is appended to the dashboard.  
VALIDATION_REQUIRED: This PR does not touch WX or AdminDashboard. Duplicate-export scan clean. After 009, observe lives in a helper with a single WX call site.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-198  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1082 / #1080 extra doors; first-grant only  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #1082 extra rooms `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` teach Tern Stride / Octa Oath / Mire Reel / Summon Mark / Slide Skip via observe+win. Closed doors `hoop_precentor` (Pack Ring) and `lane_fold_regent` (Lane Fold) never write `ownedSpellIds`. #1080 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` first-grant leftover Pair Slide / Both Mend / Heave Mend / Parched Mend. Same-hour #1132 extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` first-grant; `court_tierce_regent` is kit-only and never writes `ownedSpellIds`. Do not retag `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `span_hendeca` / `span_dodeca` / `mire_nave` / `lava_aisle`. Achievements still Doka-only (`admin.mo` 309–326). 10-25-186 already said the same for #1017 / #1011 / #1004.  
SYSTEMS_AFFECTED: encounter tag table; boss extra-door table; `ownedSpellIds`; recap  
RECOMMENDED_ACTION: Extra doors are first-grant. Do not also hang Gait Gift / Cadence Tern / Leap Fold / Sestet Mend on those fights. Pack Ring / Lane Fold / CHOIR_* / Court Tierce never write `ownedSpellIds`. Do not restamp #890 / #903 / #951 / #1004 / #1011 / #1017 / #1063 extra doors. `survivor` stays leftover. Do not use `unstoppable` / `level_10`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009 / 012.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-012; SDA-2026-10-25-186; SDA-2026-10-26-190; SDA-2026-10-26-191  
REGRESSION_RISK: HIGH if `tern_gallery` also grants Ring Stride. HIGH if `lane_fold_regent` writes owned ids. MEDIUM if Parched Mend and Dry Gait both grant from `parched_preacher`.  
VALIDATION_REQUIRED: Each extra door grants its stamped id at most once. Pack Ring / Lane Fold / CHOIR_SLIDE never appear on a new character. `span_hendeca` still teaches Hendeca Span, not Octa Oath.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-199  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Gait Gift ≠ Stave Mend and Cadence Tern ≠ Cadence Dock  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1082 unique leftover collisions vs already-stamped catalogs: Gait Gift is leftover AP **≥ 2 AND** leftover MP **= 0** — not Score Mend (both-body leftover **sum === 4 AND unequal**, #1011), not Stave Mend (both-body leftover **sum === 5**, #1063), not Sestet Mend (both-body leftover **sum === 6 AND unequal**, #1132), not Prime Gift (leftover **1/1** heal, #1017), not Lean Gift (AP=0 and MP≥1, #962). Cadence Tern is remaining `n>3` → **3** — not Cadence Tierce (`n===3` → 0, #1132), not Cadence Cap (`n>2` → 2, #1017), not Cadence Snuff (`1→0`, #1011), not Cadence Dock (`2→0`, #1063), not Cadence Rise (`1→2`, #962), not Cadence Prime (`0→1`, #953). Prime Plate is leftover **1/1** negate — not Dual Plate, not Score Hood, not Stave Hood. Octa Oath is Chebyshev **exactly 8** spell gate — not Dodeca Span (occupy 12), not Trideca Span (occupy 13, #1132), not Oct Span (occupy 8), not Hepta Oath (7). Same-hour [#1132](https://github.com/Mr-Melic/stralt/pull/1132) filled those next leftovers and did **not** clone Gait Gift / Cadence Tern. 10-25-187 already kept Prime Gift ≠ Score Mend and Cadence Cap ≠ Cadence Snuff.  
SYSTEMS_AFFECTED: Wave-17 unique catalog; Wave-18 family CORE; leftover feat doors; activate validator  
RECOMMENDED_ACTION: SDE unique §11 wins if a later Wave-18 SDE clones a hole. #1132 already picked different leftovers — do not alias Gait Gift onto Sestet Mend or Cadence Tern onto Cadence Tierce. Do not mint `spell-stave-gift` / `spell-cadence-deuce` / `spell-twelve-span` / `spell-thirteen-span` / `spell-octa-span` / `spell-quint-mend`. Do not overwrite `SPELL_PROPOSALS_2026-10-25.md` or `SPELL_PROPOSALS_2026-10-26.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-10-25-187; SDA-2026-10-26-190; PR #1082; PR #1063; PR #1011; PR #1017; PR #1132  
REGRESSION_RISK: HIGH if Gait Gift is implemented as sum===5. HIGH if Cadence Tern is implemented as `2→0` or `n>2→2`. HIGH if Octa Oath is implemented as occupy-weight 8.  
VALIDATION_REQUIRED: After these ids exist, leftover predicates match the stamped cards (unit tests on AP/MP leftover, not on `spell.name`). Cadence Floor / Rise / Prime / Cap / Snuff / Dock / Tern / Tierce remain eight distinct ids. Sestet Mend is sum===6 unequal, not Gait Gift’s AP≥2 AND MP=0.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-200  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Admin UX helpers, EBA/AFDA re-audits, and #1101 CRC zero SAFE_TO_REMOVE; do not add empty studio tabs or a fourth kit source  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin UX #1001 / #1066 helpers (names-busy, role-grant, confirm-chrome, principal-gate) do **not** restack `AdminDashboard.tsx`. Same-hour [#1115](https://github.com/Mr-Melic/stralt/pull/1115) adds confirm-snapshot / mailto-secret / confirm-a11y / hit-target helpers + unique `ACTION_IDS_ADMIN_UX_2026-10-26.md` — **not wired**, not spell rollback. EBA #980 / #1044 / same-hour [#1111](https://github.com/Mr-Melic/stralt/pull/1111) re-audits are docs only, **no new EBA IDs**. AFDA #996 locks `boss_defeated` as never unlocking a spell (042); #1055 AFDA-043: Admin `effectParams` JSON round-trips; combat never parses `pushDistance` / `attractDistance` / `teleportMode`. [#1101](https://github.com/Mr-Melic/stralt/pull/1101) CRC 10-25: **zero** persistent ids `SAFE_TO_REMOVE`; CRC-001 is live Strike still on `OLD_SPELL_IDS` / tombstone — consume 09-23-007, do not twin. Live tabs are still the 15 in AdminDashboard 5611–5626. Three boss kit sources remain. 10-25-185 already forbade empty studio tabs.  
SYSTEMS_AFFECTED: AdminDashboard tabs; confirm/toast; CRC ledger; future studio shell  
RECOMMENDED_ACTION: Confirm-chrome is not spell rollback. Unread `effectParams` is not mechanic-flag persist (09-23-005). CRC-001 is not a deletion and not `lifecycle`. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. Do not overwrite #980 / #996 `*2026-10-24*`, #1044 / #1055 / #1101 `*2026-10-25*`, or #1111 EBA / #1115 Admin UX / #1130 AFDA `*2026-10-26*` files. `boss_defeated` is not `spellRewardIds`. Unused `spellDmgGrowthPercent` (AFDA-044) is not mechanic-flag persist.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-23-013; SDA-2026-09-23-015; SDA-2026-10-25-185; SDA-2026-09-23-007  
REGRESSION_RISK: MEDIUM if CRC-001 is treated as license to hard-delete Strike. MEDIUM if empty studio tabs ship before activate exists. HIGH if a fourth kit source is added for Table P.  
VALIDATION_REQUIRED: Strike remains in `spellData.ts` and is still tombstoned on HEAD until 09-23-007. Admin still has 15 tabs. Motoko boss seeds are not a live fourth table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-201  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1083 persist locks; not ownedSpellIds or lifecycle  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1083](https://github.com/Mr-Melic/stralt/pull/1083) SDEG 10-25 helpers: `groundDokaFeatCounter.ts` (count `loot_10_doka` on credit **commit**, not claim), `uiLayoutStorageKey.ts` (HUD principal key), `shrineCovenantLocalPersist.ts` (write-only localStorage), `shopPackageHardDelete.ts` (catalog `remove`). Explicitly does **not** approve a new required persist field. #1014 already locked catalog-delete as `usableByPlayer=false` and thin `SummonUnitDef`. Same-hour [#1126](https://github.com/Mr-Melic/stralt/pull/1126) SDEG (`mapsVisitedFeatPersist.ts`, `versionGateLiveConfigKeep.ts`, `spellUpgradeCostNat.ts`) explicitly does **not** ship `ownedSpellIds`. `check-limit` is still 5. New observation maps still need a later EOP file after `20260901` (09-23-016). 10-25-189 covered #1014 / #1018 only.  
SYSTEMS_AFFECTED: persist helpers; future `ownedSpellIds` / `observedSpellIds`; EOP chain  
RECOMMENDED_ACTION: Dual bar / catalog-delete / loot_10 counter / HUD key / shrine localStorage is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. Do not add required Character spell-ownership fields in those helper PRs. Do not overwrite #1014 `*2026-10-24*` or #1083 `*2026-10-25*` or #1126 `*2026-10-26*` SDEG files. `loot_10_doka` remaining a Doka feat is correct — do not hang a spell reward on it without 09-23-012. Explorer `explore_25_maps` is a portal counter, not a spell grant.  
AUTONOMY: HUMAN_APPROVE — persist shape.  
DEPENDENCIES: SDA-2026-09-23-016; SDA-2026-10-25-189; PR #1083  
REGRESSION_RISK: HIGH if loot_10 is later given `spellRewardIds` without ownership persist. HIGH if SDEG helpers are treated as license to add `ownedSpellIds` onto a shipped NewActor.  
VALIDATION_REQUIRED: #1083 files do not mention `ownedSpellIds` / `observedSpellIds` as shipped fields. `mops.toml` `check-limit` stays 5 until 016. Ground-Doka commit still does not append a spell id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-202  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Pale Archivist kit-first leftovers; kit ids are not grants  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1089](https://github.com/Mr-Melic/stralt/pull/1089) `bossPagesOfDoomDecideCommit.ts` (phase-2 first-id `spell-mark` shadows PAGES_OF_DOOM), [#1102](https://github.com/Mr-Melic/stralt/pull/1102) `bossScrollSummonDecideCommit.ts` (odd-turn kit Mark shadows SCROLL_SUMMON), [#1105](https://github.com/Mr-Melic/stralt/pull/1105) `bossInkVeilDecideCommit.ts` (phase-1 first-id `spell-cursed-wound` shadows INK_VEIL). Same-hour [#1113](https://github.com/Mr-Melic/stralt/pull/1113) `bossScrollSummonHpCommit.ts` locks advertised SCROLL_SUMMON HP 30 vs WX stamp 20 and **does not restore decide** — leftover scroll HP is not a grant and is not `shouldAwardVictory`. Unique vs #1058 Midnight Bishop kit Mirror / MERGE_BISHOPS and #1065 `spell_physical` remap (execute leftover, not decide). Tests key kit **ids**, never `"Mark"` / `"Pages of Doom"`. Live `pickBossKitSpell` is still called with an empty cooldown Map so first pool id wins. Untouchable Doka/XP from Pages never firing is a challenge leftover, not a spell grant.  
SYSTEMS_AFFECTED: Pale Archivist decide; `bossKits.ts` first-ids; future observe hook; challenge Untouchable  
RECOMMENDED_ACTION: Kit-first leftover is not a grant and not `lifecycle`. Scroll HP stamp (#1113) is not a grant and is not `shouldAwardVictory`. Do not remap `spell_physical` here. Hostile kit cast of Mark / Cursed Wound may observe once 09-23-009 exists; Pages / Scroll / Ink Veil **abilities** are not catalog ids and never enter `ownedSpellIds`. Union the three decide files plus the HP sidecar; one `export function` per name. Do not grow WX / `useBossAI.ts` from this studio.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — combat restack after older boss PRs.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-26-193; PR #1089; PR #1102; PR #1105  
REGRESSION_RISK: HIGH if Pages is later treated as a `spellRewardIds` grant. MEDIUM if the three decide helpers concatenate a shared export. LOW for ownership on HEAD (no observe persist).  
VALIDATION_REQUIRED: After 009, a hostile Mark cast observes Mark, not a synthetic Pages id. New character does not own `spell-mark` from fighting Pale Archivist until the stamped route completes. Duplicate-export scan clean across the three decide files and #1113 HP sidecar. Advertised 30 HP scroll still occupying the graph after two Strike 10 is not a victory commit.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-203  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Soak/reflect packets are not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1079](https://github.com/Mr-Melic/stralt/pull/1079) Mirror Field 20% reflect through RES+Shield (`mirrorFieldReflectHit.ts`; restacks WX), [#1084](https://github.com/Mr-Melic/stralt/pull/1084) Void Mirror (`voidMirrorReflectHit.ts`), [#1097](https://github.com/Mr-Melic/stralt/pull/1097) battle-walk Thorned Ground / Void Rift (`battleWalkHazardHit.ts`; restacks WX), [#1100](https://github.com/Mr-Melic/stralt/pull/1100) leftover-walk lava/spikes (`lavaSpikeWalkHit.ts`). Challenge HP uses HP actually lost so Shield Charm can keep Untouchable. Lethal walk dispatches death and is **not** `shouldAwardVictory`. Distinct from #973 lethal-reflect Life Drain resurrection (10-24-166) and from leftover-XP remount keep (194). Live recap still has no `discoveredSpells`.  
SYSTEMS_AFFECTED: soak helpers; challenge Untouchable; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Soaked Untouchable / lethal walk / reflect is not `commitSpellDiscoveries`. Observe still requires a successful hostile **cast** of an eligible id. Environmental thorn/rift/lava ticks are not spell observation. Union WX call sites onto the helpers; do not grow WX further from this studio (197). Death-gated recap still is not a victory commit.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-26-194; SDA-2026-10-26-197  
REGRESSION_RISK: HIGH if a soaked lethal rift is treated as a win and grants observed ids. MEDIUM if Mirror Field reflect is parsed as a hostile Frost cast by name.  
VALIDATION_REQUIRED: Shield-soaked Thorned walk does not unlock. Lethal rift walk does not call `commitSpellDiscoveries`. Hostile Frost cast then win still unlocks once 009 exists, independent of a same-fight Mirror Field soak.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-26-204  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #958 / #999 / #1072 AI increment; inspector lists modules by id  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AEE [#958](https://github.com/Mr-Melic/stralt/pull/958) / [#999](https://github.com/Mr-Melic/stralt/pull/999) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) plus same-hour [#1135](https://github.com/Mr-Melic/stralt/pull/1135) (`ENEMY_AI_EVOLUTION_2026-10-26.md`, SYS-108…113 / FUT-126…131) remain the AI increments. Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224). Wave-17 unique `aiHint` strings (`walk_chebyshev_3_orthogonal`, `pack_walk_chebyshev_2_not_knight`, `fold_two_player_side_share_axis_chebyshev_3`, …) have no `decide*` branch yet (#1082 SDE-003). Blood Mend `targetType: "self"` is metadata, not a name. 10-25-188 already said the same for #958 / #999. Same-hour #1121 ENC / #1114 WDD / #1128 WDEAD / #1132 tactical / #1134 formations already opened — unique dated names; do not overwrite. Later Wave-18 SDE files, if they open, also use unique dated names.  
SYSTEMS_AFFECTED: AI module inspector; Wave-17 `aiHint` wiring; future Kits / Graph tabs  
RECOMMENDED_ACTION: Consume AEE / 09-23-010. Inspector lists modules by id. Do not emit `shadow_strike`. Do not add a fourth kit table. Missing Wave-17 hint → drop that id, log once (SDE-003). Do not overwrite #1072 / #1135 AEE dated files or any `*2026-10-26*` sibling.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-25-188; PR #1082  
REGRESSION_RISK: HIGH if Pack Ring is assigned without `pack_walk_chebyshev_2_not_knight`. MEDIUM if the inspector matches `summon.name` containing “wolf”.  
VALIDATION_REQUIRED: Graph/inspector rows key `summonAI` / module id. Tern Stride is absent from G≤16 kits. Rename “Summon Dire Wolf” does not change hunter vs healer.  
STATUS: NEW  

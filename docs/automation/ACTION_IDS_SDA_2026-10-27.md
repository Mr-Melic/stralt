# ACTION_IDs — 2026-10-27 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-27.md`](./SPELL_ADMIN_DESIGN_2026-10-27.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-27 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940); 10-24 queue-union IDs `160` … `174` live on [#1007](https://github.com/Mr-Melic/stralt/pull/1007); 10-25 queue-union IDs `175` … `189` live on [#1078](https://github.com/Mr-Melic/stralt/pull/1078); 10-26 queue-union IDs `190` … `204` live on [#1140](https://github.com/Mr-Melic/stralt/pull/1140). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **205–219** (queue after #1140). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **831** at this patch (later 10-26 flock continued through **#1162**). Newest sibling before this work: **#1162** (Spellbook 44px floors). Calendar: 2026-10-27. Same-hour flock uses unique dated filenames — do not overwrite #1140 SDA, #1143 Wave-18 SDE, #1082 Wave-17 SDE, #1080 / #1139 boss bible, #1083 / #1126 SDEG, #1101 CRC, #1106 quality audit `*2026-10-25*` / `*2026-10-26*` files, or `*2026-10-27*` siblings. #870 / #946 / #998 / #1074 / #1124 `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-27-205  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1143 Wave-18 SDE stamps; do not pre-own generationMin 18 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1143](https://github.com/Mr-Melic/stralt/pull/1143) is Wave-18 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`, `generationMin: 18`). Unique §11 ids (`spell-hook-stride`, `spell-nona-oath`, `spell-slide-reel`, `spell-hook-bite`, `spell-idle-mark`, `spell-thin-plate`, `spell-brier-skip`, `spell-wide-sting`, `spell-summon-hook`, `spell-wide-gift`, `spell-cadence-quad`, `spell-even-toll`, `spell-brick-fee`, `spell-watch-bind`, `spell-prime-gait`, `spell-slide-cut`, `spell-idle-plate`, `spell-pack-hook`, `spell-hook-fold`) stay this catalog’s. `spell-pack-hook` is `ENEMY_ONLY`. `spell-hook-fold` is `BOSS_ONLY`. Wide Gift is leftover AP **≥ 2 AND** leftover MP **≥ 1** (one body). Cadence Quad is remaining `n>4` → 4. Thin Plate is leftover **1/0** negate. Hook Stride is a permutation of **(3,1)**. Nona Oath is Chebyshev **exactly 9** spell gate, not occupy 9. `mpCost: 0` on every unique row. Wave-18 family CORE is #1017 unique + #1063 (via #1138). Unique §11 stay extras until Wave 20. Unique Wave-17 §11 (#1082) stay extras until Wave 19. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-18 unique ids into that array, or hydrating Pack Hook because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-26-190 already said the same for Wave-17 `#1082`. Still-open #982 freezes **shipping** Wave-15/16/17/18 live rows until 09-23-003.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-18 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, 10-23-145, 10-24-160, 10-25-175, and 10-26-190. Honour #1143 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Wide Gift or Cadence Quad (see 214). Do not restamp Wave-1…17 doors or #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 extra doors. Do not implement Wave-18 or Wave-19 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Hook / Hook Fold / Court Tierce.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-26-190; SDA-2026-10-27-214; PR #1143; PR #1082; PR #1132  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-18 ids. HIGH if `ENEMY_ONLY` Pack Hook is hydrated because `usableByPlayer !== false`. HIGH if `hook_fold_regent` also grants Hook Stride. HIGH if a Wide Gift / Cadence Quad clone ships beside the #1143 ids.  
VALIDATION_REQUIRED: After a Wave-18 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Wide Gift / Cadence Quad id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-206  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1139 Wave-19 boss / Rush Table Q still stands; no fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No new boss bible after [#1139](https://github.com/Mr-Melic/stralt/pull/1139) (Wave-19 + Rush **Table Q**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`; `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`). [#1080](https://github.com/Mr-Melic/stralt/pull/1080) Wave-18 / Table P already covered by 10-26-191. Later 10-26 combat sidecars (#1148 / #1150 / #1155 / #1158 / #1160 / #1152 / #1159) are execute leftovers, not a fourth kit table. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. Canister `completeBossRushRoom` still must not see `roomIndex > 9`. If a same-hour Wave-20 / Table R bible opens, unique dated restack on `BOSS_AND_SPELL_DISCOVERY.md` — **union**, do not invent an 11th canister room.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #1080 / #1139 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-26-191 / 10-26-200). Do not restamp Wave-1…19 feat doors. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `stride_bursar` / `dual_bursar` / `imprint_precentor`. Table P/Q/R are owner overlays, never an 11th canister room. Quad Span / Hendeca Span / Dodeca Span / Trideca Span stay off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-26-191; SDA-2026-10-27-215; PR #1139  
REGRESSION_RISK: HIGH if CHOIR_IMPRINT hydrates as a catalog grant. MEDIUM if Table R is written as `roomIndex > 9`. MEDIUM if a fourth kit table is added for Enthroned Void leftovers.  
VALIDATION_REQUIRED: After these bosses exist, a new character does not own CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / NAVE_STRIDE / NAVE_DUAL / CHOIR_IMPRINT / CHOIR_DAMP. `completeBossRushRoom` still rejects `roomIndex > 9`. Admin chips still do not invent a fourth kit table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-207  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1134 Wave-17 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1134](https://github.com/Mr-Melic/stralt/pull/1134) is Wave-17 synergy formations (drop 18) in unique `docs/design/ENEMY_FORMATIONS_2026-10-26.md` (`FSN-SCORE-STEP` … `FSN-SCORE-HOLD`) packing #1073 families. Prior [#1075](https://github.com/Mr-Melic/stralt/pull/1075) Wave-16 drop 17 already covered by 10-26-192. No new formation PR after #1134. If a same-hour Wave-18 drop 19 opens, unique `ENEMY_FORMATIONS_2026-10-27.md`. Live `EnemyFamily` remains the original seven. Dec Plug / Hendeca Plug / Dodeca Plug skip while live cap is 2 (`gameConstants.ts` 300). Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Zone NaN still hides paper ADVANCED (WX 11920).  
SYSTEMS_AFFECTED: future formation overlay; Wave-17/18 family CORE; `ownedSpellIds`; summon cap  
RECOMMENDED_ACTION: Consume CORE ids; clearing a formation is not a grant. Do not copy FSN-* sheets into `starterSpells`. Do not CORE unique Wave-18 §11 (#1143) or Wave-19 family CORE (#1082 / #1132). Honour leftover-AP **and** leftover-MP gates as metadata, never names. Pass a numeric zone before ADVANCED rows can resolve (09-23-010). Do not overwrite `ENEMY_FORMATIONS_2026-10-26.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-26-192; PR #1134; PR #1075  
REGRESSION_RISK: HIGH if a formation clear appends Score Mend / Stave Mend / Wide Gift to `ownedSpellIds`. MEDIUM if Dodeca Plug ships while summon cap is 2.  
VALIDATION_REQUIRED: After FSN-* ids exist as design stamps, a new character owns none of them. Clearing Score Gate does not grant Score Mend. Pack Hook / Hook Fold / Court Tierce stay never-owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-208  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/modifier metadata flags; union Inferno CD, Glass Realm, Iron Curse  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open sidecars after #1123: [#1148](https://github.com/Mr-Melic/stralt/pull/1148) Vampiric Ground 15% attacker lifesteal (`vampiricGroundLifesteal.ts`), [#1150](https://github.com/Mr-Melic/stralt/pull/1150) summon-bomber Inferno cooldown shared with `findKitSpell` available (`wxSummonBomberInfernoCooldown.ts` keys kit Inferno **id**, never “Inferno”), [#1155](https://github.com/Mr-Melic/stralt/pull/1155) Iron Curse advertised healing ×0.5 (`ironCurseHealScale.ts`), [#1158](https://github.com/Mr-Melic/stralt/pull/1158) WX summon `availableSpells` pack CD filter (`wxSummonAvailableCooldown.ts`), [#1160](https://github.com/Mr-Melic/stralt/pull/1160) Glass Realm advertised damage ×2 on Strike and incoming (`glassRealmDamageExecute.ts`). Unique files vs 10-26 #1104 / #1107 / #1123. Tests assert metadata / kit ids / modifier multipliers, not display names. Concatenating two `pickWx…` copies fails esbuild.  
SYSTEMS_AFFECTED: `engine/*` kit-execute helpers; future SpellDefinition mechanic flags; observe hook  
RECOMMENDED_ACTION: Persist those flags with 09-23-005 (`targetType`, `healAmount`, `chc`, cooldown, modifier multipliers). Union sidecars; **one** `export function` per name. Hostile kit execute may observe (10-22-138); player execute must not. Glass Realm / Iron Curse / Vampiric Ground are map-modifier execute leftovers, not catalog ids and never enter `ownedSpellIds`. Do not add `if (spell.name === "Inferno")` / `"Glass"` branches. Do not grow WX; restack call sites onto the helpers after older combat PRs land.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-26-193; SDA-2026-10-27-212  
REGRESSION_RISK: HIGH if two Inferno CD pickers concatenate. HIGH if Glass Realm ×2 is treated as a `spellRewardIds` grant. MEDIUM if pack CD filter treats `physical_attack` named “Inferno” as bomber Inferno.  
VALIDATION_REQUIRED: Each sidecar’s “not the display name” test still passes. Duplicate `export function` scan is clean. Hostile Inferno cast observes once 009 exists; player Inferno does not. Pack fallback with id `physical_attack` and name Inferno is not a bomber Inferno CD.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-209  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount leftover-Doka portal skips continue after #1140; shrine settle is not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1145](https://github.com/Mr-Melic/stralt/pull/1145) `oneShotDokaKeepRemountPortalCreditWriteSkip.ts`, [#1147](https://github.com/Mr-Melic/stralt/pull/1147) `gameKeyDokaKeepRemountPortalCreditWriteSkip.ts`, [#1149](https://github.com/Mr-Melic/stralt/pull/1149) `featDokaKeepRemountPortalCreditWriteSkip.ts`, [#1151](https://github.com/Mr-Melic/stralt/pull/1151) `bossRushDokaKeepRemountPortalCreditWriteSkip.ts`, [#1153](https://github.com/Mr-Melic/stralt/pull/1153) `spendKeepRemountPortalCreditWriteSkip.ts`, [#1157](https://github.com/Mr-Melic/stralt/pull/1157) `absoluteDokaThrowKeepRemountPortalCreditWriteSkip.ts` skip remount leftover-Doka wipe after portal persist following one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keeps. [#1156](https://github.com/Mr-Melic/stralt/pull/1156) `shrineAltarCreditFinalize.ts` keeps the shrine room open until altar Doka settle. Unique sidecar files vs 10-26 #1129. Live recap still has no `discoveredSpells`. `saveBattleStats` is still not a grant writer. 10-26-194 already said leftover-XP / leftover-Doka keep is not `commitSpellDiscoveries`.  
SYSTEMS_AFFECTED: remount skip helpers; shrine settle; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Same class as 10-24-166 / 10-25-181 / 10-26-194. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Observe still requires a successful hostile cast; unlock still requires that same-encounter win on the persist lock. Do not treat a remount keep, a leftover-Doka honour, a shrine settle, or a GameKey keep as victory.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-26-194  
REGRESSION_RISK: HIGH if observe/commit is wired onto a remount skip and double-grants. MEDIUM if two skip helpers concatenate the same export name.  
VALIDATION_REQUIRED: Cast then remount-keep does not unlock. Cast then flee still observes without unlock. Duplicate-export scan is clean across the six new skip files, #1129, and #1156. Shrine settle does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-210  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Do not treat Nona Oath as occupy-9; grow closed knownSummonAI only with stamped occupy enums  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter|guardian|archer|kiter|bomber|kamikaze|healer` (`adminGuard.mo` 363–366). Unique Wave-18 §11 (#1143) does **not** add an occupy-weight summon — Nona Oath is a Chebyshev-9 **spell gate**, not occupy 9 (`spell-nona-span` stays tombstoned). 10-26-195 already asked to grow the closed list with `dodecaspan` / `tridecaspan` (#1063 / #1132). Runtime empty-AI fallback is still `spell.summonAI || "hunter"` (`summonSpawn.ts` 139). Live cap is still `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). If a same-hour Wave-19 tactical stamps occupy-weight fourteen, grow the **same** closed enum; do not invent `spell-fourteen-span` / `spell-nona-span`.  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` client twin; SpellEditor summon section; #1063 / #1132 / #1143 occupy vs gate cards  
RECOMMENDED_ACTION: When 09-23-002 lands, extend the **same** closed enum on Motoko and client with every queued occupy/post string that a real card stamps: `font` / `dummypost` / `pentaspan` / `septspan` / `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan` (plus a later occupy-14 string **only** if a card stamps it). Do not parse `spell.name` (“Nona”, “Nine”, “Fourteen”). Reject activate of occupy-weight > live cap. Do not re-issue 195. Do not treat Nona Oath as `ninespan`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-10-26-195; PR #1143; PR #1063; PR #1132  
REGRESSION_RISK: HIGH if Nona Oath activates as occupy-weight 9 while cap is 2. HIGH if `ninespan` is inferred from the display name “Nona Oath”. MEDIUM if Motoko and client lists drift.  
VALIDATION_REQUIRED: Saving `isSummon=true` + `summonAI="ninespan"` is not how Nona Oath ships. Empty `summonAI` still fails both sides. Rename “Summon Nona Oath” does not change AI. Occupy-weight > 2 still fails activate.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-211  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour later map snaps / ENC / WDD / WDEAD; not grants  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Later map snaps [#1146](https://github.com/Mr-Melic/stralt/pull/1146) Slipstream, [#1154](https://github.com/Mr-Melic/stralt/pull/1154) Cinder Barrel, [#1161](https://github.com/Mr-Melic/stralt/pull/1161) MAP_ROTATE / MIRROR_INVERT are leftover-crumb layout, not spell catalogs. ENC #1006 / #1056 / #1121 already covered by 10-26-196: `ENC-POISE-01` is not Wide Gift; `ENC-KNIGHT-01` is not Hook Stride; `ENC-FOLD-01` is a wall fold, not Hook Fold; `ENC-PIT-02` is not Slide Reel. WDD #993 / #1064 / #1114 `WF-*` are world features. WDEAD #1015 / #1050 / #1128 occupancy/remount rails are not grants. If same-hour 10-27 ENC / WDD / WDEAD open, unique dated names. Live `fog_of_war` is still announce-only.  
SYSTEMS_AFFECTED: encounter tag table; map crumb helpers; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Occupancy unseals / unique-corridor copies / crumb snaps are not grants unless a named door is stamped (`hook_gallery` etc. stay #1143’s). Do not consume `ENC-*` / `WF-*` / ENC-TEACH-18 / ENC-SPELL-35 into unique §11. Do not overwrite #1015 `*2026-10-24*` or #1050 / #1056 / #1064 `*2026-10-25*` or #1114 / #1121 / #1128 `*2026-10-26*` files. Do not edit `mapGen.ts` algorithms from this studio. Do not restack `WORLD_DYNAMICS.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-10-26-196; SDA-2026-10-27-213; PR #1143  
REGRESSION_RISK: MEDIUM if a crumb snap is later tagged as Hook Stride’s door. MEDIUM if `ENC-KNIGHT-01` is retagged.  
VALIDATION_REQUIRED: Slipstream / Cinder Barrel / MAP_ROTATE snaps do not append `ownedSpellIds`. `ENC-KNIGHT-01` still teaches Knight Stride. `hook_gallery` is the only Hook Stride door once stamped.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-212  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep later combat helpers in engine/*; Spellbook 44px is not a studio tab  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `WorldExploration.tsx` is still 19 213 lines. Queued [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) extract paint helpers and **shrink** WX — not landed. Later kit-execute/soak helpers live in `engine/*`. AdminDashboard is 8 280. `useSpellQueries.ts` is 293 and already the write landing. [#1162](https://github.com/Mr-Melic/stralt/pull/1162) raises Spellbook Save / Cancel / upgrade to a 44px mobile floor (`spellbookTouchTarget.ts`) — **player** `SpellbookModal.tsx`, not AdminDashboard, not a sixteenth studio tab. 10-26-197 already forbade growing WX after #995.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/*` extracts; SpellEditor extract; AdminDashboard; SpellbookModal  
RECOMMENDED_ACTION: Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites onto #1076 / #1109 after those land — do not inline observe/commit into WX. Do not grow AdminDashboard until activate exists; extract SpellEditor onto `useSpellQueries.ts`. One `export function` per name on restack. Do not treat #1162 Spellbook floors as license to add Discovery / Kits / Graph / Versions tabs.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-26-197; SDA-2026-10-27-208  
REGRESSION_RISK: HIGH if observe is inlined into WX and conflicts with #1079 / #1097. MEDIUM if a second SpellEditor copy is appended to the dashboard. MEDIUM if Spellbook 44px is restacked into AdminDashboard.  
VALIDATION_REQUIRED: This PR does not touch WX or AdminDashboard. Duplicate-export scan clean. After 009, observe lives in a helper with a single WX call site. Admin still has 15 tabs.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-213  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1143 extra doors; first-grant only  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #1143 extra rooms `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` teach Hook Stride / Nona Oath / Slide Reel / Idle Mark / Brier Skip via observe+win. Closed doors `hook_precentor` (Pack Hook) and `hook_fold_regent` (Hook Fold) never write `ownedSpellIds`. Do not retag `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `sestet_cantor` / `tierce_precentor` / `span_trideca` / `span_dodeca` / `court_tierce_regent` / `hoop_precentor` / `lane_fold_regent`. Achievements still Doka-only (`admin.mo` 249–256). 10-26-198 already said the same for #1082 / #1080 / #1132.  
SYSTEMS_AFFECTED: encounter tag table; boss extra-door table; `ownedSpellIds`; recap  
RECOMMENDED_ACTION: Extra doors are first-grant. Do not also hang Wide Gift / Cadence Quad / Hook Fold / Sestet Mend on those fights. Pack Hook / Hook Fold / CHOIR_* / Court Tierce never write `ownedSpellIds`. Do not restamp #890 / #903 / #951 / #1004 / #1011 / #1017 / #1063 / #1082 / #1132 extra doors. `survivor` stays leftover. Do not use `unstoppable` / `level_10`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009 / 012.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-012; SDA-2026-10-26-198; SDA-2026-10-27-205; SDA-2026-10-27-206  
REGRESSION_RISK: HIGH if `hook_gallery` also grants Tern Stride. HIGH if `hook_fold_regent` writes owned ids. MEDIUM if Wide Gift and Gait Gift both grant from `hook_gallery`.  
VALIDATION_REQUIRED: Each extra door grants its stamped id at most once. Pack Hook / Hook Fold / CHOIR_SLIDE never appear on a new character. `tern_gallery` still teaches Tern Stride, not Hook Stride.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-214  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Wide Gift ≠ Gait Gift and Cadence Quad ≠ Cadence Tern  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1143 unique leftover collisions vs already-stamped catalogs: Wide Gift is leftover AP **≥ 2 AND** leftover MP **≥ 1** (one body) — not Gait Gift (AP≥2 AND MP=0, #1082), not Stave Mend (both-body leftover **sum === 5**, #1063), not Sestet Mend (both-body leftover **sum === 6 AND unequal**, #1132), not Prime Gift (leftover **1/1** heal, #1017), not Lean Gift (AP=0 and MP≥1, #962). Cadence Quad is remaining `n>4` → **4** — not Cadence Tern (`n>3` → 3, #1082), not Cadence Tierce (`n===3` → 0, #1132), not Cadence Cap (`n>2` → 2, #1017), not Cadence Snuff (`1→0`, #1011), not Cadence Dock (`2→0`, #1063). Thin Plate is leftover **1/0** negate — not Prime Plate (1/1), not Dual Plate, not Stave Hood, not Sestet Hood. Hook Stride is a permutation of **(3,1)** — not Tern Stride (Chebyshev 3 orthogonal), not Knight Stride ((2,1)), not Ring Stride (Chebyshev 2, knight excluded). Nona Oath is Chebyshev **exactly 9** spell gate — not Octa Oath (8), not Dodeca Span (occupy 12), not Trideca Span (occupy 13), not Nine Span (occupy 9). 10-26-199 already kept Gait Gift ≠ Stave Mend and Cadence Tern ≠ Cadence Dock.  
SYSTEMS_AFFECTED: Wave-18 unique catalog; Wave-19 family CORE; leftover feat doors; activate validator  
RECOMMENDED_ACTION: SDE unique §11 wins if a later Wave-19 SDE clones a hole. #1132 already picked different leftovers — do not alias Wide Gift onto Sestet Mend or Cadence Quad onto Cadence Tierce. Do not mint `spell-sestet-gift` / `spell-cadence-trey` / `spell-nona-span` / `spell-fourteen-span` / `spell-thirteen-span` / `spell-hook-line` as Wave-18 unique. Do not overwrite `SPELL_PROPOSALS_2026-10-25.md`, `SPELL_PROPOSALS_2026-10-26.md`, or `SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-10-26-199; SDA-2026-10-27-205; PR #1143; PR #1082; PR #1063; PR #1132  
REGRESSION_RISK: HIGH if Wide Gift is implemented as sum===5 or sum===6. HIGH if Cadence Quad is implemented as `n>3→3` or `2→0`. HIGH if Nona Oath is implemented as occupy-weight 9. HIGH if Hook Stride is implemented as orthogonal Chebyshev 3.  
VALIDATION_REQUIRED: After these ids exist, leftover predicates match the stamped cards (unit tests on AP/MP leftover and (3,1) geometry, not on `spell.name`). Cadence Floor / Rise / Prime / Cap / Snuff / Dock / Tern / Tierce / Quad remain nine distinct ids. Wide Gift is one-body AP≥2 AND MP≥1, not Gait Gift’s AP≥2 AND MP=0.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-215  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin UX #1001 / #1066 / #1115 helpers (names-busy, role-grant, confirm-chrome, principal-gate, confirm-snapshot, mailto-secret, confirm-a11y, hit-target) do **not** restack `AdminDashboard.tsx` and are **not** spell rollback. EBA #980 / #1044 / #1111 re-audits are docs only, **no new EBA IDs**. AFDA #996 locks `boss_defeated` as never unlocking a spell (042); #1055 AFDA-043 unread `effectParams`; #1130 AFDA-044 unused `spellDmgGrowthPercent` is not mechanic-flag persist. [#1101](https://github.com/Mr-Melic/stralt/pull/1101) CRC 10-25: **zero** persistent ids `SAFE_TO_REMOVE`; CRC-001 is live Strike still on `OLD_SPELL_IDS` / tombstone — consume 09-23-007, do not twin. Live tabs are still the 15 in AdminDashboard 5611–5626. Three boss kit sources remain. #1162 Spellbook 44px is player UI. 10-26-200 already forbade empty studio tabs. If same-hour 10-27 Admin UX / EBA / AFDA / CRC open, unique dated names.  
SYSTEMS_AFFECTED: AdminDashboard tabs; confirm/toast; CRC ledger; future studio shell  
RECOMMENDED_ACTION: Confirm-chrome is not spell rollback. Unread `effectParams` / unused growth percent is not mechanic-flag persist (09-23-005). CRC-001 is not a deletion and not `lifecycle`. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. Do not overwrite #980 / #996 `*2026-10-24*`, #1044 / #1055 / #1101 `*2026-10-25*`, or #1111 EBA / #1115 Admin UX / #1130 AFDA `*2026-10-26*` files. `boss_defeated` is not `spellRewardIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-23-013; SDA-2026-09-23-015; SDA-2026-10-26-200; SDA-2026-09-23-007  
REGRESSION_RISK: MEDIUM if CRC-001 is treated as license to hard-delete Strike. MEDIUM if empty studio tabs ship before activate exists. HIGH if a fourth kit source is added for Table Q.  
VALIDATION_REQUIRED: Strike remains in `spellData.ts` and is still tombstoned on HEAD until 09-23-007. Admin still has 15 tabs. Motoko boss seeds are not a live fourth table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-216  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1156 shrine settle and SDEG persist locks; not ownedSpellIds or lifecycle  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1156](https://github.com/Mr-Melic/stralt/pull/1156) `shrineAltarCreditFinalize.ts` keeps the shrine room open until altar Doka settle — persist lock, not a spell grant. [#1083](https://github.com/Mr-Melic/stralt/pull/1083) / [#1126](https://github.com/Mr-Melic/stralt/pull/1126) SDEG already covered by 10-26-201: ground-Doka feat counter, HUD principal key, shrine/covenant localStorage, shop-package hard-delete, explorer portal-counter, version-gate boss-config keep, spell-upgrade Infinity debit freeze. Explicitly **no** `ownedSpellIds`. `check-limit` is still 5. New observation maps still need a later EOP file after `20260901` (09-23-016). If same-hour 10-27 SDEG opens, unique dated names; it must not ship observation maps.  
SYSTEMS_AFFECTED: persist helpers; future `ownedSpellIds` / `observedSpellIds`; EOP chain  
RECOMMENDED_ACTION: Dual bar / catalog-delete / loot_10 counter / HUD key / shrine settle / leftover-Doka remount keep is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. Do not add required Character spell-ownership fields in those helper PRs. Do not overwrite #1014 `*2026-10-24*` or #1083 `*2026-10-25*` or #1126 `*2026-10-26*` SDEG files. `loot_10_doka` remaining a Doka feat is correct — do not hang a spell reward on it without 09-23-012.  
AUTONOMY: HUMAN_APPROVE — persist shape.  
DEPENDENCIES: SDA-2026-09-23-016; SDA-2026-10-26-201; SDA-2026-10-27-209; PR #1156  
REGRESSION_RISK: HIGH if shrine settle is later given `spellRewardIds` without ownership persist. HIGH if SDEG helpers are treated as license to add `ownedSpellIds` onto a shipped NewActor.  
VALIDATION_REQUIRED: #1156 / #1083 / #1126 files do not mention `ownedSpellIds` / `observedSpellIds` as shipped fields. `mops.toml` `check-limit` stays 5 until 016. Shrine credit still does not append a spell id.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-217  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Enthroned Void kit-first leftovers; kit ids are not grants  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1152](https://github.com/Mr-Melic/stralt/pull/1152) `bossPhantomSpawnHpCommit.ts` locks advertised Phantom Spawn HP against WX stamp 20 and **does not restore decide**. [#1159](https://github.com/Mr-Melic/stralt/pull/1159) `bossPhantomSpawnDecideCommit.ts` locks kit-first Swap from shadowing Phantom Spawn. Unique vs Pale Archivist #1089 / #1102 / #1105 / #1113 (10-26-202) and vs Midnight Bishop Mirror / #1065 `spell_physical` remap. Tests key kit **ids**, never `"Swap"` / `"Phantom Spawn"`. Live `pickBossKitSpell` is still called with an empty cooldown Map so first pool id wins.  
SYSTEMS_AFFECTED: Enthroned Void decide; `bossKits.ts` first-ids; future observe hook  
RECOMMENDED_ACTION: Kit-first leftover is not a grant and not `lifecycle`. Phantom Spawn HP stamp is not a grant and is not `shouldAwardVictory`. Do not remap `spell_physical` here. Hostile kit cast of Swap may observe once 09-23-009 exists; Phantom Spawn **ability** is not a catalog id and never enters `ownedSpellIds`. Union the two Enthroned Void files plus Pale Archivist decide/HP sidecars; one `export function` per name. Do not grow WX / `useBossAI.ts` from this studio.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — combat restack after older boss PRs.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-26-202; SDA-2026-10-27-208; PR #1152; PR #1159  
REGRESSION_RISK: HIGH if Phantom Spawn is later treated as a `spellRewardIds` grant. MEDIUM if the two Enthroned Void helpers concatenate a shared export. LOW for ownership on HEAD (no observe persist).  
VALIDATION_REQUIRED: After 009, a hostile Swap cast observes Swap, not a synthetic Phantom Spawn id. New character does not own the Swap id from fighting Enthroned Void until the stamped route completes. Duplicate-export scan clean across the two Enthroned Void files. Advertised Phantom Spawn HP still occupying the graph after two Strike 10 is not a victory commit.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-218  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Plague Zone soak and modifier lifesteal/heal packets are not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1142](https://github.com/Mr-Melic/stralt/pull/1142) Plague Zone turn-start tick through RES+Shield (`plagueZonePlayerHit.ts`). Distinct from #1079 Mirror Field / #1084 Void Mirror / #1097 Thorned Ground / #1100 leftover-walk lava (10-26-203). [#1148](https://github.com/Mr-Melic/stralt/pull/1148) Vampiric Ground 15% attacker lifesteal and [#1155](https://github.com/Mr-Melic/stralt/pull/1155) Iron Curse healing ×0.5 are modifier execute leftovers, not hostile **casts**. Challenge HP uses HP actually lost so Shield Charm can keep Untouchable. Lethal tick dispatches death and is **not** `shouldAwardVictory`. Live recap still has no `discoveredSpells`.  
SYSTEMS_AFFECTED: soak helpers; modifier execute; challenge Untouchable; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Soaked Untouchable / plague tick / Vampiric Ground lifesteal / Iron Curse heal scale is not `commitSpellDiscoveries`. Observe still requires a successful hostile **cast** of an eligible id. Environmental plague ticks are not spell observation. Union WX call sites onto the helpers; do not grow WX further from this studio (212). Death-gated recap still is not a victory commit.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-26-203; SDA-2026-10-27-209; SDA-2026-10-27-212  
REGRESSION_RISK: HIGH if a soaked lethal plague tick is treated as a win and grants observed ids. MEDIUM if Vampiric Ground lifesteal is parsed as a hostile Drain cast by name.  
VALIDATION_REQUIRED: Shield-soaked Plague Zone tick does not unlock. Lethal plague tick does not call `commitSpellDiscoveries`. Hostile Frost cast then win still unlocks once 009 exists, independent of a same-fight Plague Zone soak.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-27-219  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #958 / #999 / #1072 / #1135 AI increment; inspector lists modules by id  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AEE [#958](https://github.com/Mr-Melic/stralt/pull/958) / [#999](https://github.com/Mr-Melic/stralt/pull/999) / [#1072](https://github.com/Mr-Melic/stralt/pull/1072) / [#1135](https://github.com/Mr-Melic/stralt/pull/1135) (`ENEMY_AI_EVOLUTION_2026-10-26.md`, SYS-108…113 / FUT-126…131) remain the AI increments. Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224). Wave-18 unique `aiHint` strings (`walk_hook_3_1`, `next_spell_exact_chebyshev_9`, `attract_toward_nearest_slide`, `bonus_if_share_hook_3_1_with_caster`, `detonate_if_turn_end_leftover_mp_equals_max`, `negate_hit_if_leftover_ap_eq_1_and_mp_eq_0`, `skip_thorned_ground_on_path_length_2`, `bonus_if_leftover_ap_ge_2_and_mp_ge_1`, `summon_walk_hook_3_1_ap_tax`, `require_leftover_ap_ge_2_and_mp_ge_1`, `cap_remaining_cds_above_4_to_4`, `pack_walk_hook_3_1`, `fold_two_player_side_share_hook_3_1`, …) have no `decide*` branch yet (#1143 SDE-003). Blood Mend `targetType: "self"` is metadata, not a name. 10-26-204 already said the same for #958 / #999 / #1072 / #1135. If same-hour 10-27 AEE / Wave-19 SDE open, unique dated names; do not overwrite.  
SYSTEMS_AFFECTED: AI module inspector; Wave-18 `aiHint` wiring; future Kits / Graph tabs  
RECOMMENDED_ACTION: Consume AEE / 09-23-010. Inspector lists modules by id. Do not emit `shadow_strike`. Do not add a fourth kit table. Missing Wave-18 hint → drop that id, log once (SDE-003). Do not overwrite #1072 / #1135 AEE dated files or any `*2026-10-26*` / `*2026-10-27*` sibling.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-26-204; PR #1143  
REGRESSION_RISK: HIGH if Pack Hook is assigned without `pack_walk_hook_3_1`. MEDIUM if the inspector matches `summon.name` containing “wolf”.  
VALIDATION_REQUIRED: Graph/inspector rows key `summonAI` / module id. Hook Stride is absent from G≤17 kits. Rename “Summon Dire Wolf” does not change hunter vs healer.  
STATUS: NEW  

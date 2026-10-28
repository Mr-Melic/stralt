# ACTION_IDs — 2026-10-28 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-28.md`](./SPELL_ADMIN_DESIGN_2026-10-28.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-28 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791); 10-21 queue-union IDs `116` … `129` live on [#815](https://github.com/Mr-Melic/stralt/pull/815); 10-22 queue-union IDs `130` … `144` live on [#892](https://github.com/Mr-Melic/stralt/pull/892); 10-23 queue-union IDs `145` … `159` live on [#940](https://github.com/Mr-Melic/stralt/pull/940); 10-24 queue-union IDs `160` … `174` live on [#1007](https://github.com/Mr-Melic/stralt/pull/1007); 10-25 queue-union IDs `175` … `189` live on [#1078](https://github.com/Mr-Melic/stralt/pull/1078); 10-26 queue-union IDs `190` … `204` live on [#1140](https://github.com/Mr-Melic/stralt/pull/1140); 10-27 queue-union IDs `205` … `219` live on [#1187](https://github.com/Mr-Melic/stralt/pull/1187). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 / 10-22 / 10-23 / 10-24 / 10-25 / 10-26 / 10-27 / 10-28 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **220–234** (queue after #1187). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **886** at this patch (later 10-27 flock continued through **#1217**). Newest sibling before this work: **#1217** (Broodmother larva-explode contact venom). Calendar: 2026-10-28. Same-hour flock uses unique dated filenames — do not overwrite #1187 SDA, #1198 Wave-19 SDE, #1177 Wave-19 tactical, #1170 / #1139 / #1080 boss bible, #1171 / #1126 SDEG, #1101 CRC, #1106 quality audit `*2026-10-25*` / `*2026-10-26*` / `*2026-10-27*` files, or `*2026-10-28*` siblings. #870 / #946 / #998 / #1074 / #1124 / #1186 `MASTER_ROADMAP.md` are pre-existing oldest-first conflicts (skipped).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-28-220  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1198 Wave-19 SDE stamps; do not pre-own generationMin 19 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1198](https://github.com/Mr-Melic/stralt/pull/1198) is Wave-19 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`, `generationMin: 19`). Unique §11 ids (`spell-camel-stride`, `spell-deca-oath`, `spell-glyph-reel`, `spell-camel-bite`, `spell-hollow-mark`, `spell-wide-plate`, `spell-fuse-skip`, `spell-hollow-sting`, `spell-summon-camel`, `spell-thin-gift`, `spell-cadence-quint`, `spell-prime-toll`, `spell-brick-levy`, `spell-watch-shave`, `spell-lean-gait`, `spell-glyph-cut`, `spell-fresh-plate`, `spell-pack-camel`, `spell-camel-fold`) stay this catalog’s. `spell-pack-camel` is `ENEMY_ONLY`. `spell-camel-fold` is `BOSS_ONLY`. Thin Gift is leftover AP **=== 1 AND** leftover MP **=== 0** heal (one body). Cadence Quint is remaining `n>5` → 5. Wide Plate is leftover **AP ≥ 2 AND MP ≥ 1** negate. Hollow Mark is leftover **0/0** turn-end detonate. Camel Stride is a permutation of **(3,2)**. Deca Oath is Chebyshev **exactly 10** spell gate, not occupy 10. `mpCost: 0` on every unique row. Wave-19 family CORE is #1082 unique + #1132 (via #1189). Unique §11 stay extras until Wave 21. Unique Wave-18 §11 (#1143) stay extras until Wave 20. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-19 unique ids into that array, or hydrating Pack Camel because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 10-27-205 already said the same for Wave-18 `#1143`. Still-open #982 freezes **shipping** Wave-15/16/17/18/19 live rows until 09-23-003.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-19 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-29-099, 10-21-116, 10-22-130, 10-23-145, 10-24-160, 10-25-175, 10-26-190, and 10-27-205. Honour #1198 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship a second Thin Gift or Cadence Quint (see 229). Do not restamp Wave-1…18 doors or #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 extra doors. Do not implement Wave-19 or Wave-20 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Camel / Camel Fold / Court Quarte / Court Tierce.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-10-27-205; SDA-2026-10-28-229; PR #1198; PR #1143; PR #1177  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-19 ids. HIGH if `ENEMY_ONLY` Pack Camel is hydrated because `usableByPlayer !== false`. HIGH if `camel_fold_regent` also grants Camel Stride. HIGH if a Thin Gift / Cadence Quint clone ships beside the #1198 ids.  
VALIDATION_REQUIRED: After a Wave-19 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. A second Thin Gift / Cadence Quint id is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-221  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1170 Wave-20 boss / Rush Table R; no fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1170](https://github.com/Mr-Melic/stralt/pull/1170) is Wave-20 + Rush **Table R**: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`; `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`. Leftover #695 Cadence Trim / Near Hood + leftover #726 Ready Sting + leftover #787 Lean Sting. 10-27-206 anticipated this bible; it is now confirmed. [#1139](https://github.com/Mr-Melic/stralt/pull/1139) Wave-19 / Table Q and [#1080](https://github.com/Mr-Melic/stralt/pull/1080) Wave-18 / Table P already covered by 10-26-191 / 10-27-206. Later 10-27 combat sidecars (#1199…#1217) are execute leftovers, not a fourth kit table. Live combat kits are still `data/bossKits.ts`; Motoko `defaultBossConfigs()` still lists purged `fireball` / `cursed_gust` / `entangle` (`admin.mo` 358+); Admin chips `getSpellConfigs()`. Three sources. Canister `completeBossRushRoom` still must not see `roomIndex > 9`. If a same-hour Wave-21 / Table S bible opens, unique dated restack on `BOSS_AND_SPELL_DISCOVERY.md` — **union**, do not invent an 11th canister room.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses tab; Rush extra tables; future `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #1080 / #1139 / #1170 stamps. Closed signatures never enter `ownedSpellIds`. Do not add a fourth kit source (09-23-011 / 10-27-206 / 10-27-215). Do not restamp Wave-1…20 feat doors. Do not remap `trim_precentor` / `stride_chancellor` / `pair_usher`. Table P/Q/R/S are owner overlays, never an 11th canister room. Quad Span / Hendeca Span / Dodeca Span / Trideca Span / Tetradeca Span stay off until occupy-weight exists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-10-27-206; SDA-2026-10-28-230; PR #1170  
REGRESSION_RISK: HIGH if CHOIR_TRIM hydrates as a catalog grant. MEDIUM if Table S is written as `roomIndex > 9`. MEDIUM if a fourth kit table is added for Eternal Pawn leftovers.  
VALIDATION_REQUIRED: After these bosses exist, a new character does not own CHOIR_SLIDE / CHOIR_BOTH / NAVE_HEAVE / CHOIR_PARCHED / NAVE_STRIDE / NAVE_DUAL / CHOIR_IMPRINT / CHOIR_DAMP / CHOIR_TRIM / NAVE_READY / CHOIR_LEAN / NAVE_NEAR. `completeBossRushRoom` still rejects `roomIndex > 9`. Admin chips still do not invent a fourth kit table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-222  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1176 Wave-18 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1176](https://github.com/Mr-Melic/stralt/pull/1176) is Wave-18 synergy formations (drop 19) in unique `docs/design/ENEMY_FORMATIONS_2026-10-27.md` packing #1138 families (Stave choir, Ring/Hepta, Rime Rank, Last Dual, Rift Fresh, Watch Even, Prime Cap, Hymn Stave, Dock Verse, Gait Brick, Purse Stave, Stave Hold). Dual Keep cannot fake leftover-sum 5. Prior [#1134](https://github.com/Mr-Melic/stralt/pull/1134) Wave-17 drop 18 already covered by 10-27-207. No new formation PR after #1176. If a same-hour Wave-19 drop 20 opens, unique `ENEMY_FORMATIONS_2026-10-28.md`. Live `EnemyFamily` remains the original seven. Dodeca Plug / Tetradeca Plug skip while live cap is 2 (`gameConstants.ts` 300). Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Zone NaN still hides paper ADVANCED (WX 11920).  
SYSTEMS_AFFECTED: future formation overlay; Wave-18/19 family CORE; `ownedSpellIds`; summon cap  
RECOMMENDED_ACTION: Consume CORE ids; clearing a formation is not a grant. Do not copy FSN-* sheets into `starterSpells`. Do not CORE unique Wave-19 §11 (#1198) or Wave-20 family CORE (#1143 / #1177). Honour leftover-AP **and** leftover-MP gates as metadata, never names. Pass a numeric zone before ADVANCED rows can resolve (09-23-010). Do not overwrite `ENEMY_FORMATIONS_2026-10-27.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-27-207; PR #1176; PR #1134  
REGRESSION_RISK: HIGH if a formation clear appends Stave Mend / Sestet Mend / Thin Gift to `ownedSpellIds`. MEDIUM if Dodeca Plug / Tetradeca Plug ships while summon cap is 2.  
VALIDATION_REQUIRED: After FSN-* ids exist as design stamps, a new character owns none of them. Clearing Stave Gate does not grant Stave Mend. Pack Camel / Camel Fold / Court Quarte stay never-owned.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-223  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist later kit-execute/modifier/summon-control Inferno metadata flags  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open sidecars after #1166: [#1199](https://github.com/Mr-Melic/stralt/pull/1199) Mending Mist 5% store regen (`mendingMistStoreHeal.ts`), [#1200](https://github.com/Mr-Melic/stralt/pull/1200) Iron Curse player RES ×1.3 (`ironCursePlayerRes.ts`), [#1202](https://github.com/Mr-Melic/stralt/pull/1202) Swift Winds +2 MP (`swiftWindsStoreMp.ts`), [#1203](https://github.com/Mr-Melic/stralt/pull/1203) / [#1208](https://github.com/Mr-Melic/stralt/pull/1208) Titan’s Vigor +1000 HP and 1–5× rolls, [#1207](https://github.com/Mr-Melic/stralt/pull/1207) Doka Fever +25% enemy HP (`dokaFeverEnemyHp.ts`), [#1210](https://github.com/Mr-Melic/stralt/pull/1210) Arcane Overflow +10 FAIL-roll fizzle (`arcaneOverflowFailBonus.ts`), [#1168](https://github.com/Mr-Melic/stralt/pull/1168) Chaos Initiative per-round reshuffle (`chaosInitiativeTurnOrder.ts`), [#1205](https://github.com/Mr-Melic/stralt/pull/1205) / [#1206](https://github.com/Mr-Melic/stralt/pull/1206) / [#1211](https://github.com/Mr-Melic/stralt/pull/1211) / [#1214](https://github.com/Mr-Melic/stralt/pull/1214) summon-control Inferno CD highlight / arm / kit-select / tick. Unique files vs 10-27 #1148 / #1150 / #1155 / #1158 / #1160 / #1166. Tests assert metadata / kit ids / modifier multipliers, not display names. Concatenating two `pickWx…` copies fails esbuild.  
SYSTEMS_AFFECTED: `engine/*` kit-execute helpers; future SpellDefinition mechanic flags; observe hook  
RECOMMENDED_ACTION: Persist those flags with 09-23-005 (`targetType`, `healAmount`, `chc`, cooldown, modifier multipliers). Union sidecars; **one** `export function` per name. Hostile kit execute may observe (10-22-138); player execute must not. Mending Mist / Iron Curse / Swift Winds / Titan’s Vigor / Doka Fever / Arcane Overflow / Chaos Initiative are map-modifier execute leftovers, not catalog ids and never enter `ownedSpellIds`. Do not add `if (spell.name === "Inferno")` / `"Mending"` branches. Do not grow WX; restack call sites onto the helpers after older combat PRs land.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-10-27-208; SDA-2026-10-28-227  
REGRESSION_RISK: HIGH if two Inferno CD pickers concatenate. HIGH if Titan’s Vigor +1000 HP is treated as a `spellRewardIds` grant. MEDIUM if pack CD filter treats `physical_attack` named “Inferno” as bomber Inferno.  
VALIDATION_REQUIRED: Each sidecar’s “not the display name” test still passes. Duplicate `export function` scan is clean. Hostile Inferno cast observes once 009 exists; player Inferno does not. Pack fallback with id `physical_attack` and name Inferno is not a bomber Inferno CD.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-224  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount leftover-Doka continues; leftover spell-level keep is not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Leftover-Doka remount portal skips remain open through #1157 (10-27-209). Open [#1215](https://github.com/Mr-Melic/stralt/pull/1215) `spellLevelKeepRemountWriteSkip.ts` stamps leftover **spell level** after a parsed `upgradeSpell` `#ok` or a transport throw that is not explicit `upgradeSpell failed`. Motoko `upgradeSpell` (`main.mo` 1034) is `newLevel = currentLevel + 1` and is **not** idempotent. GameFlow `character.spellLevelKeys` stay Play-entry forever; remount hydrates those keys and would retry, double-charging Doka. Distinct from leftover-XP keep (#1099) and leftover-Doka portal keep (#1157). Live recap still has no `discoveredSpells`. `saveBattleStats` still ignores spell-level arrays. `upgradeSpell` is still not a grant writer.  
SYSTEMS_AFFECTED: remount skip helpers; leftover spell-level keep; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Same class as 10-24-166 / 10-25-181 / 10-26-194 / 10-27-209. Discovery must not piggy-back these skips. Union helpers; one `export function` per name. Observe still requires a successful hostile cast; unlock still requires that same-encounter win on the persist lock. Do not treat a remount keep, a leftover-Doka honour, a leftover spell-level honour, or an `upgradeSpell` retry skip as victory or as `ownedSpellIds`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-27-209; PR #1215  
REGRESSION_RISK: HIGH if observe/commit is wired onto a remount skip and double-grants. HIGH if leftover spell-level keep is treated as a learn event. MEDIUM if two skip helpers concatenate the same export name.  
VALIDATION_REQUIRED: Cast then remount-keep does not unlock. Cast then flee still observes without unlock. Duplicate-export scan is clean across #1215, the six leftover-Doka skip files, #1129, and #1156. Leftover spell-level honour does not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-225  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Do not treat Deca Oath as occupy-10; grow closed knownSummonAI with tetradecaspan  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Closed `knownSummonAI` is still `hunter|guardian|archer|kiter|bomber|kamikaze|healer` (`adminGuard.mo` 363–366). Unique Wave-19 §11 (#1198) does **not** add an occupy-weight summon — Deca Oath is a Chebyshev-10 **spell gate**, not occupy 10 (`spell-deca-span` stays tombstoned). #1177 Tetradeca Span is occupy-weight **14** (`tetradecaspan`). 10-27-210 already asked to grow the closed list with queued occupy/post strings and not treat Nona Oath as occupy 9. Runtime empty-AI fallback is still `spell.summonAI || "hunter"` (`summonSpawn.ts` 139). Live cap is still `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). If a same-hour Wave-20 tactical stamps occupy-weight fifteen, grow the **same** closed enum; do not invent `spell-deca-span` / `spell-fifteen-span`.  
SYSTEMS_AFFECTED: `adminGuard.mo` `knownSummonAI`; `adminSafety.ts` client twin; SpellEditor summon section; #1063 / #1132 / #1143 / #1177 / #1198 occupy vs gate cards  
RECOMMENDED_ACTION: When 09-23-002 lands, extend the **same** closed enum on Motoko and client with every queued occupy/post string that a real card stamps: `font` / `dummypost` / `pentaspan` / `septspan` / `octspan` / `gauntpost` / `sixspan` / `ninespan` / `poisepost` / `decspan` / `tallypost` / `hendecaspan` / `scorepost` / `dodecaspan` / `tridecaspan` / **`tetradecaspan`** (plus a later occupy-15 string **only** if a card stamps it). Do not parse `spell.name` (“Deca”, “Ten”, “Fourteen”). Reject activate of occupy-weight > live cap. Do not re-issue 210. Do not treat Deca Oath as `decspan`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-002.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-10-27-210; PR #1198; PR #1177  
REGRESSION_RISK: HIGH if Deca Oath activates as occupy-weight 10 while cap is 2. HIGH if `decspan` is inferred from the display name “Deca Oath”. HIGH if Tetradeca Span activates while cap is 2. MEDIUM if Motoko and client lists drift.  
VALIDATION_REQUIRED: Saving `isSummon=true` + `summonAI="decspan"` is not how Deca Oath ships. Empty `summonAI` still fails both sides. Rename “Summon Deca Oath” does not change AI. Occupy-weight > 2 still fails activate. Tetradeca Span stays activate-blocked.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-226  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour later map snaps / ENC / WDD / WDEAD; not grants  
CATEGORY: special-encounter  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Later map snaps [#1174](https://github.com/Mr-Melic/stralt/pull/1174) Latch Gate, [#1201](https://github.com/Mr-Melic/stralt/pull/1201) Pendulum Censer, [#1209](https://github.com/Mr-Melic/stralt/pull/1209) Hourglass Arch, [#1213](https://github.com/Mr-Melic/stralt/pull/1213) Shift Slab are leftover-crumb layout, not spell catalogs. ENC [#1195](https://github.com/Mr-Melic/stralt/pull/1195) Score/File/Lava/Ready teaches **#1073** verbs, not unique §11: `ENC-SCORE-01` is not Thin Gift; `ENC-FILE-01` is not Camel Stride; `ENC-LAVA-01` is not Fuse Skip; `ENC-READY-01` is not Hollow Mark. WDD [#1172](https://github.com/Mr-Melic/stralt/pull/1172) Wave-19 `WF-*-MATCH_*` (`WF-SPL-MATCH_TUTOR` never writes `ownedSpellIds`). WDEAD [#1183](https://github.com/Mr-Melic/stralt/pull/1183) occupancy/remount rails are not grants. If same-hour 10-28 ENC / WDD / WDEAD open, unique dated names. Live `fog_of_war` is still announce-only.  
SYSTEMS_AFFECTED: encounter tag table; map crumb helpers; future `SPECIAL_ENCOUNTER` stamps  
RECOMMENDED_ACTION: Occupancy unseals / unique-corridor copies / crumb snaps are not grants unless a named door is stamped (`camel_gallery` etc. stay #1198’s). Do not consume `ENC-*` / `WF-*` / ENC-TEACH-19 / ENC-SPELL-36 into unique §11. Do not overwrite #1195 / #1172 / #1183 `*2026-10-27*` files. Do not edit `mapGen.ts` algorithms from this studio. Do not restack `WORLD_DYNAMICS.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-10-27-211; SDA-2026-10-28-228; PR #1198; PR #1195  
REGRESSION_RISK: MEDIUM if a crumb snap is later tagged as Camel Stride’s door. MEDIUM if `ENC-FILE-01` is retagged.  
VALIDATION_REQUIRED: Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab snaps do not append `ownedSpellIds`. `ENC-FILE-01` still teaches File Bite / File verbs, not Camel Stride. `camel_gallery` is the only Camel Stride door once stamped.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-227  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep later combat helpers in engine/*; battle-floor extract is not a studio tab  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `WorldExploration.tsx` is still 19 213 lines. Queued [#1076](https://github.com/Mr-Melic/stralt/pull/1076) / [#1109](https://github.com/Mr-Melic/stralt/pull/1109) extract paint helpers and **shrink** WX — not landed. [#1196](https://github.com/Mr-Melic/stralt/pull/1196) extracts battle floor highlight paint (`combatTileOverlay.ts`) — **not** AdminDashboard, not a sixteenth studio tab. Later kit-execute/soak helpers live in `engine/*`. AdminDashboard is 8 280. `useSpellQueries.ts` is 293 and already the write landing. 10-27-212 already forbade growing WX after #995 and treating Spellbook 44px as a studio tab.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `engine/*` extracts; SpellEditor extract; AdminDashboard  
RECOMMENDED_ACTION: Discovery helpers stay in `engine/*` / `utils/*`. Union WX call sites onto #1076 / #1109 / #1196 after those land — do not inline observe/commit into WX. Do not grow AdminDashboard until activate exists; extract SpellEditor onto `useSpellQueries.ts`. One `export function` per name on restack. Do not treat #1196 battle-floor extract as license to add Discovery / Kits / Graph / Versions tabs.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-10-27-212; SDA-2026-10-28-223  
REGRESSION_RISK: HIGH if observe is inlined into WX and conflicts with #1079 / #1097 / #1182. MEDIUM if a second SpellEditor copy is appended to the dashboard. MEDIUM if battle-floor overlay is restacked into AdminDashboard.  
VALIDATION_REQUIRED: This PR does not touch WX or AdminDashboard. Duplicate-export scan clean. After 009, observe lives in a helper with a single WX call site. Admin still has 15 tabs.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-228  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1198 extra doors; first-grant only  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #1198 extra rooms `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` teach Camel Stride / Deca Oath / Glyph Reel / Hollow Mark / Fuse Skip via observe+win. Closed doors `camel_precentor` (Pack Camel) and `camel_fold_regent` (Camel Fold) never write `ownedSpellIds`. Do not retag `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` / `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. Achievements still Doka-only (`admin.mo` 249–256). 10-27-213 already said the same for #1143 / #1082 / #1132.  
SYSTEMS_AFFECTED: encounter tag table; boss extra-door table; `ownedSpellIds`; recap  
RECOMMENDED_ACTION: Extra doors are first-grant. Do not also hang Thin Gift / Cadence Quint / Camel Fold / Septet Mend on those fights. Pack Camel / Camel Fold / CHOIR_* / Court Quarte / Court Tierce never write `ownedSpellIds`. Do not restamp #890 / #903 / #951 / #1004 / #1011 / #1017 / #1063 / #1082 / #1132 / #1143 extra doors. `survivor` stays leftover. Do not use `unstoppable` / `level_10`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009 / 012.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-012; SDA-2026-10-27-213; SDA-2026-10-28-220; SDA-2026-10-28-221  
REGRESSION_RISK: HIGH if `camel_gallery` also grants Hook Stride. HIGH if `camel_fold_regent` writes owned ids. MEDIUM if Thin Gift and Septet Mend both grant from `camel_gallery`.  
VALIDATION_REQUIRED: Each extra door grants its stamped id at most once. Pack Camel / Camel Fold / CHOIR_TRIM never appear on a new character. `hook_gallery` still teaches Hook Stride, not Camel Stride.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-229  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep Thin Gift ≠ Septet Mend and Cadence Quint ≠ Cadence Quarte  
CATEGORY: catalog-sync  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1198 unique leftover collisions vs already-stamped catalogs: Thin Gift is leftover AP **=== 1 AND** leftover MP **=== 0** heal (one body) — not Septet Mend (both-body leftover **sum === 7**, #1177), not Sestet Mend (both-body leftover **sum === 6 AND unequal**, #1132), not Stave Mend (both-body leftover **sum === 5**, #1063), not Wide Gift (AP≥2 AND MP≥1, #1143), not Gait Gift (AP≥2 AND MP=0, #1082), not Prime Gift (leftover **1/1** heal, #1017). Cadence Quint is remaining `n>5` → **5** — not Cadence Quarte (`n===4` → 0, #1177), not Cadence Quad (`n>4` → 4, #1143), not Cadence Tern (`n>3` → 3, #1082), not Cadence Tierce (`n===3` → 0, #1132), not Cadence Dock (`2→0`, #1063). Wide Plate is leftover **AP ≥ 2 AND MP ≥ 1** negate — not Thin Plate (1/0), not Septet Hood (sum===7 miss), not Sestet Hood. Camel Stride is a permutation of **(3,2)** — not Hook Stride ((3,1)), not Tern Stride (Chebyshev 3 orthogonal), not Knight Stride ((2,1)). Deca Oath is Chebyshev **exactly 10** spell gate — not Nona Oath (9), not Tetradeca Span (occupy 14), not Dec Span (occupy 10). 10-27-214 already kept Wide Gift ≠ Gait Gift and Cadence Quad ≠ Cadence Tern.  
SYSTEMS_AFFECTED: Wave-19 unique catalog; Wave-20 family CORE; leftover feat doors; activate validator  
RECOMMENDED_ACTION: SDE unique §11 wins if a later Wave-20 SDE clones a hole. #1177 already picked different leftovers — do not alias Thin Gift onto Septet Mend or Cadence Quint onto Cadence Quarte. Do not mint `spell-septet-gift` / `spell-cadence-cinque` / `spell-deca-span` / `spell-fifteen-span` / `spell-fourteen-span` / `spell-camel-line` as Wave-19 unique. Do not overwrite `SPELL_PROPOSALS_2026-10-27.md` or `SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-10-27-214; SDA-2026-10-28-220; PR #1198; PR #1177; PR #1143; PR #1132  
REGRESSION_RISK: HIGH if Thin Gift is implemented as sum===7 or AP≥2/MP≥1. HIGH if Cadence Quint is implemented as `n===4→0` or `n>4→4`. HIGH if Deca Oath is implemented as occupy-weight 10. HIGH if Camel Stride is implemented as (3,1).  
VALIDATION_REQUIRED: After these ids exist, leftover predicates match the stamped cards (unit tests on AP/MP leftover and (3,2) geometry, not on `spell.name`). Cadence Floor / Rise / Prime / Cap / Snuff / Dock / Tern / Tierce / Quad / Quint / Quarte remain eleven distinct ids. Thin Gift is one-body leftover 1/0 heal, not Septet Mend’s sum===7.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-230  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Admin UX / EBA / AFDA / CRC; do not add empty studio tabs or a fourth kit source  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Admin UX [#1190](https://github.com/Mr-Melic/stralt/pull/1190) reveal-format / purchase-busy / grant-draft / copy-followup helpers do **not** restack `AdminDashboard.tsx` and are **not** spell rollback. EBA [#1163](https://github.com/Mr-Melic/stralt/pull/1163) re-audit is docs only, **no new EBA IDs**. AFDA [#1193](https://github.com/Mr-Melic/stralt/pull/1193) AFDA-045 unread `apMpLevelThreshold` LS key is not mechanic-flag persist (WX reads `apMpGrowthEveryNLevels`). [#1101](https://github.com/Mr-Melic/stralt/pull/1101) CRC 10-25: **zero** persistent ids `SAFE_TO_REMOVE`; CRC-001 is live Strike still on `OLD_SPELL_IDS` / tombstone — consume 09-23-007, do not twin. Live tabs are still the 15 in AdminDashboard 5611–5626. Three boss kit sources remain. #1196 battle-floor extract is engine, not player UI and not a sixteenth admin tab. 10-27-215 already forbade empty studio tabs. If same-hour 10-28 Admin UX / EBA / AFDA / CRC open, unique dated names.  
SYSTEMS_AFFECTED: AdminDashboard tabs; confirm/toast; CRC ledger; future studio shell  
RECOMMENDED_ACTION: Confirm-chrome is not spell rollback. Unread `apMpLevelThreshold` is not mechanic-flag persist (09-23-005). CRC-001 is not a deletion and not `lifecycle`. Do not ship empty Discovery / Kits / Graph / Versions tabs. Do not add a fourth kit table. Do not overwrite #1163 EBA / #1190 Admin UX / #1193 AFDA `*2026-10-27*` files. `boss_defeated` is not `spellRewardIds`.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-09-23-013; SDA-2026-09-23-015; SDA-2026-10-27-215; SDA-2026-09-23-007  
REGRESSION_RISK: MEDIUM if CRC-001 is treated as license to hard-delete Strike. MEDIUM if empty studio tabs ship before activate exists. HIGH if a fourth kit source is added for Table R.  
VALIDATION_REQUIRED: Strike remains in `spellData.ts` and is still tombstoned on HEAD until 09-23-007. Admin still has 15 tabs. Motoko boss seeds are not a live fourth table.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-231  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1171 SDEG persist locks; Spell Master padding is not ownedSpellIds or lifecycle  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1171](https://github.com/Mr-Melic/stralt/pull/1171) SDEG 10-27: `spell_master_8` counts empty-bar placeholder length (`Array(8).fill(null)`) and catalog-padded hydrate (`spellMasterBarCount.ts`); empty-only catalog seed never backfills a populated canister (`catalogMissingIdSeed.ts`); zone-lock is a browser-global `aestralto_zone_locked` flag dropped by APP_VERSION wipe (`zoneLockPersist.ts`). Explicitly **no** `ownedSpellIds`. If 09-23-003 later grants a discovery id into the library, HEAD hydrate would **pad** empty bar slots with that id and auto-complete Spell Master (100 Doka) without the player arranging eight spells. [#1215](https://github.com/Mr-Melic/stralt/pull/1215) leftover spell-level remount skip is a persist lock, not observation. `check-limit` is still 5. New observation maps still need a later EOP file after `20260901` (09-23-016). If same-hour 10-28 SDEG opens, unique dated names; it must not ship observation maps.  
SYSTEMS_AFFECTED: persist helpers; future `ownedSpellIds` / `observedSpellIds`; EOP chain; Spell Master feat  
RECOMMENDED_ACTION: Dual bar / catalog-delete / loot_10 counter / HUD key / shrine settle / leftover-Doka remount keep / leftover spell-level keep / Spell Master occupancy is not `ownedSpellIds` and not `lifecycle`. New observation maps still go through 09-23-016. After 003, hydrate must **not** pad empty bar slots with newly granted ids (`shouldAppendCatalogToEmptyBarSlots` stays false). Do not add required Character spell-ownership fields in those helper PRs. Do not overwrite #1171 `*2026-10-27*` SDEG files. `spell_master_8` remaining a Doka feat is correct — do not hang a spell reward on it without 09-23-012.  
AUTONOMY: HUMAN_APPROVE — persist shape.  
DEPENDENCIES: SDA-2026-09-23-016; SDA-2026-10-27-216; SDA-2026-10-28-224; PR #1171; PR #1215  
REGRESSION_RISK: HIGH if discovery grants later pad the bar and mint Spell Master. HIGH if SDEG helpers are treated as license to add `ownedSpellIds` onto a shipped NewActor. HIGH if leftover spell-level keep is treated as a learn event.  
VALIDATION_REQUIRED: #1171 / #1215 files do not mention `ownedSpellIds` / `observedSpellIds` as shipped fields. `mops.toml` `check-limit` stays 5 until 016. Empty bar stays empty across catalog growth. Spell Master still requires eight real equipped ids.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-232  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour Eternal Pawn kit-first leftovers; kit ids are not grants  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1204](https://github.com/Mr-Melic/stralt/pull/1204) `bossEternalPawnApDrainDecideCommit.ts` locks kit-first Slow from shadowing AP Drain. [#1212](https://github.com/Mr-Melic/stralt/pull/1212) `bossEternalPawnAdvanceDecideCommit.ts` locks kit-first Slow from shadowing Advance. Unique vs Enthroned Void #1152 / #1159 / #1164 (10-27-217) and Pale Archivist #1089 / #1102 / #1105 / #1113 / #1216. Tests key kit **ids**, never `"Slow"` / `"Advance"` / `"AP Drain"`. Live `pickBossKitSpell` is still called with an empty cooldown Map so first pool id wins. Glyph Trap (#1216) and Broodmother larva-explode (#1217) are **abilities**, not catalog ids.  
SYSTEMS_AFFECTED: Eternal Pawn decide; `bossKits.ts` first-ids; future observe hook  
RECOMMENDED_ACTION: Kit-first leftover is not a grant and not `lifecycle`. Advance / Glyph Trap / larva-explode ability stamps are not grants and are not `shouldAwardVictory`. Do not remap `spell_physical` here. Hostile kit cast of Slow may observe once 09-23-009 exists; Advance **ability** is not a catalog id and never enters `ownedSpellIds`. Union the two Eternal Pawn files plus Enthroned Void / Pale Archivist decide/HP sidecars; one `export function` per name. Do not grow WX / `useBossAI.ts` from this studio.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — combat restack after older boss PRs.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-27-217; SDA-2026-10-28-223; PR #1204; PR #1212  
REGRESSION_RISK: HIGH if Advance is later treated as a `spellRewardIds` grant. MEDIUM if the two Eternal Pawn helpers concatenate a shared export. LOW for ownership on HEAD (no observe persist).  
VALIDATION_REQUIRED: After 009, a hostile Slow cast observes Slow, not a synthetic Advance id. New character does not own the Slow id from fighting Eternal Pawn until the stamped route completes. Duplicate-export scan clean across the two Eternal Pawn files. Advertised Glyph Trap 15 and larva-explode venom are not victory commits.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-233  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Modifier execute leftovers and ability packets are not a victory commit  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#1182](https://github.com/Mr-Melic/stralt/pull/1182) Void Rift turn-start tick through RES+Shield (`voidRiftPlayerTurnStart.ts`). Distinct from #1142 Plague Zone / #1079 Mirror Field / #1084 Void Mirror / #1097 Thorned Ground / #1100 leftover-walk lava (10-27-218). [#1199](https://github.com/Mr-Melic/stralt/pull/1199) Mending Mist 5% regen, [#1200](https://github.com/Mr-Melic/stralt/pull/1200) Iron Curse RES ×1.3, [#1202](https://github.com/Mr-Melic/stralt/pull/1202) Swift Winds +2 MP, [#1203](https://github.com/Mr-Melic/stralt/pull/1203) / [#1208](https://github.com/Mr-Melic/stralt/pull/1208) Titan’s Vigor, [#1207](https://github.com/Mr-Melic/stralt/pull/1207) Doka Fever, [#1210](https://github.com/Mr-Melic/stralt/pull/1210) Arcane Overflow, [#1168](https://github.com/Mr-Melic/stralt/pull/1168) Chaos Initiative, [#1216](https://github.com/Mr-Melic/stralt/pull/1216) Glyph Trap 15, [#1217](https://github.com/Mr-Melic/stralt/pull/1217) Broodmother larva-explode are modifier / ability execute leftovers, not hostile **casts**. Challenge HP uses HP actually lost so Shield Charm can keep Untouchable. Lethal tick dispatches death and is **not** `shouldAwardVictory`. Live recap still has no `discoveredSpells`.  
SYSTEMS_AFFECTED: soak helpers; modifier execute; challenge Untouchable; victory persist; future `commitSpellDiscoveries`  
RECOMMENDED_ACTION: Soaked Untouchable / Void Rift tick / Mending Mist regen / Titan’s Vigor / Doka Fever / Glyph Trap / larva-explode is not `commitSpellDiscoveries`. Observe still requires a successful hostile **cast** of an eligible id. Environmental ticks and advertised ability packets are not spell observation. Union WX call sites onto the helpers; do not grow WX further from this studio (227). Death-gated recap still is not a victory commit.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-10-27-218; SDA-2026-10-28-224; SDA-2026-10-28-227  
REGRESSION_RISK: HIGH if a soaked lethal Void Rift tick is treated as a win and grants observed ids. MEDIUM if Mending Mist regen is parsed as a hostile Heal cast by name. MEDIUM if Glyph Trap 15 is treated as a catalog Inferno.  
VALIDATION_REQUIRED: Shield-soaked Void Rift tick does not unlock. Lethal Void Rift tick does not call `commitSpellDiscoveries`. Hostile Frost cast then win still unlocks once 009 exists, independent of a same-fight Void Rift soak. Glyph Trap / larva-explode do not append `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-28-234  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #1192 AI increment; inspector lists modules by id  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AEE [#1192](https://github.com/Mr-Melic/stralt/pull/1192) (`ENEMY_AI_EVOLUTION_2026-10-27.md`, SYS-114…119 / FUT-132…137) remains the AI increment after #958 / #999 / #1072 / #1135 (10-27-219). Inspector (08-31 §7) must list AI modules by **id**, never `inferSummonArchetype` name fallback (`enemyAI.ts` 203–224). Wave-19 unique `aiHint` strings (`walk_camel_3_2`, `next_spell_exact_chebyshev_10`, `attract_toward_nearest_glyph_tax`, `bonus_if_share_camel_3_2_with_caster`, `detonate_if_turn_end_leftover_ap_and_mp_eq_0`, `negate_hit_if_leftover_ap_ge_2_and_mp_ge_1`, `skip_fuse_detonate_on_path_length_1`, `heal_if_leftover_ap_eq_1_and_mp_eq_0`, `summon_walk_camel_3_2_ap_tax`, `cap_remaining_cds_gt_5_to_5`, `pack_walk_camel_3_2`, `fold_two_player_side_share_camel_3_2`, …) have no `decide*` branch yet (#1198 SDE-003). Thin Gift `healAmount: 0` on the row is metadata so `inferArchetype` does not classify it as healer CORE. 10-27-219 already said the same for Wave-18 hints. If same-hour 10-28 AEE / Wave-20 SDE open, unique dated names; do not overwrite.  
SYSTEMS_AFFECTED: AI module inspector; Wave-19 `aiHint` wiring; future Kits / Graph tabs  
RECOMMENDED_ACTION: Consume AEE / 09-23-010. Inspector lists modules by id. Do not emit `shadow_strike`. Do not add a fourth kit table. Missing Wave-19 hint → drop that id, log once (SDE-003). Do not overwrite #1192 AEE dated files or any `*2026-10-27*` / `*2026-10-28*` sibling.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-27-219; PR #1198; PR #1192  
REGRESSION_RISK: HIGH if Pack Camel is assigned without `pack_walk_camel_3_2`. MEDIUM if the inspector matches `summon.name` containing “wolf”. MEDIUM if Thin Gift lands in non-healer CORE because a later edit sets `healAmount > 0`.  
VALIDATION_REQUIRED: Graph/inspector rows key `summonAI` / module id. Camel Stride is absent from G≤18 kits. Rename “Summon Dire Wolf” does not change hunter vs healer. Thin Gift stays healer-only CORE.  
STATUS: NEW  

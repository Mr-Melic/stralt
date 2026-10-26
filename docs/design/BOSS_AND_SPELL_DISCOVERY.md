# Stralt Boss & Boss-Spell Discovery Design

**Author:** Boss and Boss-Spell Designer (automation)  
**Date:** 2026-10-26 (iterates 2026-10-25 Wave 18 / 2026-10-24 Wave 17 / 2026-10-23 Wave 16 / 2026-10-22 Wave 15 / 2026-10-21 Wave 14 / 2026-09-29 Wave 13 / 2026-09-28 Wave 12 / 2026-09-27 Wave 11 / 2026-09-26 Wave 10 / 2026-09-25 Wave 9 / 2026-09-24 Wave 8 / 2026-09-23 Wave 7 / 2026-09-22 Wave 6 / 2026-09-21 Wave 5 / 2026-09-02 Wave 4 / 2026-09-01 Wave 3 / 2026-08-31 / #137)  
**Status:** PROPOSED (design only — no production code in this change)  
**Scope:** All 19 shipped bosses, Wave-2 through Wave-18 quartets, and Wave-19 quartet. Every special ability classified. Indefinite progression, no level cap.

This document is the design contract for later implementation. It does **not** change combat math, the RAF loop, map generation, turn order, or any runtime module. Implementers must follow the constraints in §2 and the per-boss `STATUS: PROPOSED` sheets.

---

## 0. Changelog — 2026-10-26 cron

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; open #836 holds Wave 14 + Table L; open #903 holds Wave 15 + Table M; open #951 holds Wave 16 + Table N; open #1004 holds Wave 17 + Table O; open #1080 holds Wave 18 + Table P; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 19 + Rush **Table Q**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.15, re-read on 2026-10-26:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true` (2400–2411). File is **19,213** lines. `adminSafety.ts` 712–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 695–721). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808, Wave 14 (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) + Table L from open #836, Wave 15 (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) + Table M from open #903, Wave 16 (`wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`) + Table N from open #951, Wave 17 (`boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`) + Table O from open #1004, **and** Wave 18 (`slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`) + Table P from open #1080.
2. Wave 19: `stride_chancellor`, `dual_treasurer`, `imprint_archdeacon`, `damp_provost`. Not in `BOSS_IDS`. Primary holes: **carry leftover walk MP to next turn start** (Purse Keep is leftover *AP* cap 3; Dual Keep is *both* AP and MP; Haste / Second Wind *grant now*; Timestep is full *now*; Pack Stride *siphons* leftover walk MP `ENEMY_ONLY`; Stride Keep snapshots leftover **walk MP** cap 2 at **end of this turn**, pays at **next own turn start**, once/battle — not a queue splice; leftover 0 still spends the once/battle for 0), **carry leftover AP and leftover MP on one id** (Purse Keep is *AP only*; Stride Keep is *MP only*; Dual Keep snapshots leftover AP cap 2 **and** leftover MP cap 2, pays both at next start, once/battle), **copy remaining CDs from target onto the caster** (Cadence Theft *steals*; Cadence Halve *÷2* on the hostile; Cadence Trim *−1*; Cadence Stretch *×2*; Cadence Flush *zeros ally*; Cadence Imprint writes caster remaining = `max(caster, n)` for **shared ids only** — target keeps every lock; ids the caster does not own are ignored; empty intersection = fizzle, AP spent), **bonus if leftover walk MP ≥ 2** (Dry Sting is leftover *AP = 0*; Ready Sting is leftover AP *and* MP ≥ 1; Lean Sting is leftover AP = 0 *and* MP ≥ 1; Damp Sting deals 8 then +10 iff leftover **walk MP ≥ 2** at resolve).
3. Extra doors on leftover **#695** Stride Keep / Damp Sting **and** leftover **#726** Dual Keep / leftover **#787** Cadence Imprint. **No new #137 spell ids.** Spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Court Keep / Court Dual / Court Imprint stay `NOT_PLAYER_LEARNABLE`. Quad Span / Penta Span / Sept Span / Six Span stay off until occupy-weight exists. Remaining #636 is Quad Span / Court Stretch only. Remaining #695 (except Stride Keep / Damp Sting) / remaining #726 (except Dual Keep) / remaining #787 (except Cadence Imprint) and all #849 / #1063 stay off these sheets.
4. Rush **Table Q** (§10.16): four post-Table-P rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, Table O, or Table P.
5. Stride Keep’s stub is `stride_bursar` — **not** remapped to `stride_chancellor`. Dual Keep’s stub is `dual_bursar` — **not** remapped to `dual_treasurer`. Cadence Imprint’s stub is `imprint_precentor` — **not** remapped to `imprint_archdeacon`. Damp Sting has **no** #695 stub. Do **not** remap `keep_bursar` / `court_keep_regent` / `court_dual_regent` / `court_imprint_regent` / `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `shove_cantor` / `span_quad` / `court_stretch_regent` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `court_hinge_regent`. First grant wins if a stub ever ships.

Shipped + Wave-2–18 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K/L/M/N/O/P holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005). Dual Keep / Stride Keep pay at **next own turn start** — not a queue splice.

Do **not** extra-door leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-quad-span`, `spell-court-stretch`). Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Do **not** extra-door remaining #695 Wave-10 tactical ids (`spell-penta-span` … `spell-court-keep`, except Damp Sting already extra-doored). Penta Span stays off until occupy-weight. Court Keep stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #726 Wave-11 tactical ids (`spell-sept-span` … `spell-court-dual`, except Dual Keep). Sept Span stays off until occupy-weight. Court Dual stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #787 Wave-12 tactical ids (`spell-six-span` … `spell-court-imprint`, except Cadence Imprint). Six Span stays off until occupy-weight. Court Imprint stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #849 Wave-13 tactical ids (`spell-gaunt-mend` … `spell-court-lag`) or #1063 Dry Gait (`spell-dry-gait`, leftover #802). Do **not** grant Purse Keep / Haste-as-grant / Timestep / Pack Stride / Cadence Theft / Halve / Trim / Stretch / Flush / Dry Sting / Ready Sting / Lean Sting / Dry Gait / Both Mend / Parched Mend from Stride / Dual / Imprint / Damp. Do **not** restamp Pair Slide / Both Mend / Heave Mend / Parched Mend as Wave-19-only doors.

---

## 0.1 Changelog — 2026-10-25 cron

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; open #836 holds Wave 14 + Table L; open #903 holds Wave 15 + Table M; open #951 holds Wave 16 + Table N; open #1004 holds Wave 17 + Table O; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 18 + Rush **Table P**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.14, re-read on 2026-10-25:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true` (2400–2411). File is **19,213** lines. `adminSafety.ts` 712–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 695–721). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808, Wave 14 (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) + Table L from open #836, Wave 15 (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) + Table M from open #903, Wave 16 (`wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`) + Table N from open #951, **and** Wave 17 (`boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`) + Table O from open #1004.
2. Wave 18: `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`. Not in `BOSS_IDS`. Primary holes: **translate two adjacent hostiles 1** (Pair Hinge *rotates* 90° around the pair midpoint; Pawn Trade *swaps*; Slide Tile is a *conveyor paint*; Draw Together *attracts*; Court Shove is mass facing; Pair Slide translates **both** 1 cell in the caster→target direction — dests must be `isCellFree` after vacating the pair; no second body or a blocked dest = fizzle, AP spent; occupancy dests, **not** `isSwap`), **heal if caster and target both walked** (Gait Mend is caster *only*; Chase Mend is target *only*; Shove Mend is target *force-moved*; Enter Mend is tile *enter*; Heave Mend is *both force-moved*; Both Mend heals 8 iff **both** have `walkMpSpentThisTurn ≥ 1` — force-move does **not** arm it; 0-heal still spends AP), **heal if caster and target were both force-moved** (Shove Mend is *target only*; Both Mend is *both walked*; Heave Mend heals 8 iff **both** have `forcedMovedThisTurn` — walk MP does **not** arm it), **heal if caster and target both have leftover MP = 0** (Dry Mend is leftover *AP* = 0; Still Mend is caster spent *0 walk MP* this turn; Dry Sting is leftover-AP *damage* bonus; Parched Mend heals 8 iff **both** leftover walk MP **= 0** at resolve).
3. Extra doors on remaining **#636** Pair Slide **and** leftover **#695** Both Mend / **#726** Heave Mend / **#787** Parched Mend. **No new #137 spell ids.** Spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Remaining #636 is Quad Span / Court Stretch only. Remaining #695 / #726 / #787 (except these four doors) and all #849 stay off these sheets.
4. Rush **Table P** (§10.15): four post-Table-O rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, or Table O.
5. Pair Slide has **no** #636 stub. Both Mend’s stub is `both_cantor` — **not** remapped to `both_capitular`. Heave Mend’s stub is `heave_cantor` — **not** remapped to `heave_kitchener`. Parched Mend’s stub is `parched_cantor` — **not** remapped to `parched_preacher`. Do **not** remap `pair_usher` / `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent` / `both_cantor` / `heave_cantor` / `parched_cantor`. First grant wins if a stub ever ships.

Shipped + Wave-2–17 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K/L/M/N/O holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005). Pair Slide dests onto lava / spike / rime / wick stay **illegal AI** until MIMA-001 / 005 — P0 pairs with Peel (Exit Sting is **paint**, not lava).

Do **not** extra-door leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-quad-span`, `spell-court-stretch`). Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Do **not** extra-door remaining #695 Wave-10 tactical ids (`spell-stride-keep` … `spell-court-keep`), remaining #726 Wave-11 tactical ids (`spell-dual-keep` … `spell-court-dual`), remaining #787 Wave-12 tactical ids (`spell-cadence-imprint` … `spell-court-imprint`), or #849 Wave-13 tactical ids (`spell-gaunt-mend` … `spell-court-lag`). Do **not** grant Pair Hinge / Pawn Trade / Slide Tile / Draw Together / Court Shove / Shove Mend / Gait Mend / Chase Mend / Enter Mend / Heave Step / Pair Pace / Home Step / Dry Mend / Still Mend / Dry Sting from Slide / Both / Heave / Parched. Do **not** restamp Boot Lend / Purse Keep / Tick Plate / Last Mute as Wave-18-only doors.

---

## 0.2 Changelog — 2026-10-24 cron

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; open #836 holds Wave 14 + Table L; open #903 holds Wave 15 + Table M; open #951 holds Wave 16 + Table N; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 17 + Rush **Table O**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.13, re-read on 2026-10-24:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true` (2400–2411). File is **19,213** lines. `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 695–721). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808, Wave 14 (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) + Table L from open #836, Wave 15 (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) + Table M from open #903, **and** Wave 16 (`wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`) + Table N from open #951.
2. Wave 17: `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`. Not in `BOSS_IDS`. Primary holes: **+1 current MP to an unmoved ally** (Spare Pace is +1 *now, no gate*; Gift Sill is cell *enter* +MP; Exit Boon is *leave*; Walk Toll is *+1 cost*; Haste is +2 MP *stat*; Leftover Lend / Cadence Lend dump leftover *AP*; Boot Lend adds 1 to an ally’s **current** MP iff `walkMpSpentThisTurn` is 0 — already walked = fizzle, AP spent; forced-move does **not** set the walk flag so a shoved ally can still receive it; cap at their max MP; never write max MP), **carry leftover AP to next turn start** (Timestep is full AP/MP *now*; Purse Cut / Empty Purse / Purse Lock are *their* economy; Leftover Lend dumps to an *ally now*; Late Purse *burns* leftover; Purse Keep is **self**, once/battle, 1 AP, snapshots leftover at **end of this turn**, pays `min(snapshot, 3)` at **next own turn start** — not a queue splice; leftover 0 still spends the once/battle for 0; Dry Sting still sees leftover > 0 this turn while armed), **next DoT tick on you is 0** (Cleanse / Dispel *strip* now; Thin Ward / Ward Plate / Morrow Plate eat *hits*; Tick Hood is W7 different; Far Hood eats a *direct* hit from Chebyshev ≥ 3, not DoT; Tick Plate arms a consume — the next DoT stack tick that would apply HP loss deals 0, then consume; a 0-tick still decrements that stack’s duration; other stacks on later ticks still land; consume in `dotStacks.ts`, not `dealDamage`), **their last resolved spell id is illegal for 1 turn** (Mute Thread fizzles the *next any* id; Once Verse is echo family; Oath Blade other ids fizzle while Strike *hurts*; Hex of Silence is a full-bar *lock*; Cast Hold cannot resolve a *spell* until they walk; Last Mute reads `lastResolvedSpellId` — last id that spent AP for them this battle — and that id is illegal for 1 of **their** turns; no last id = fizzle, AP spent; Strike is illegal **only if** `physical_attack` was that last id).
3. Extra doors on remaining **#636** Boot Lend / Purse Keep / Tick Plate / Last Mute. **No new #137 spell ids.** Spectacular `CHOIR_BOOT` / `NAVE_KEEP` / `NAVE_TICK` / `CHOIR_MUTE` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Remaining #636 (`spell-pair-slide`) stays off (force-move pair; MIMA-005). #695, #726, #787, and #849 stay off these sheets.
4. Rush **Table O** (§10.14): four post-Table-N rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, or Table N.
5. Boot Lend / Tick Plate / Last Mute have **no** #636 stub. Purse Keep’s stub is `keep_bursar` — **not** remapped to `purse_steward`. Do **not** remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ever ships.

Shipped + Wave-2–16 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K/L/M/N holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-quad-span`, `spell-pair-slide`, `spell-court-stretch`). Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Pair Slide waits (force-move pair; MIMA-005). Do **not** extra-door #695 Wave-10 tactical ids (`spell-both-mend` … `spell-court-keep`), #726 Wave-11 tactical ids (`spell-heave-mend` … `spell-court-dual`), #787 Wave-12 tactical ids (`spell-parched-mend` … `spell-court-imprint`), or #849 Wave-13 tactical ids (`spell-gaunt-mend` … `spell-court-lag`). Do **not** grant Spare Pace / Gift Sill / Leftover Lend / Cadence Lend / Haste-as-grant / Purse Cut / Empty Purse / Timestep-as-grant / Late Purse / Tick Hood / Ward Plate / Empty Plate / Morrow Plate / Cleanse / Mute Thread / Once Verse / Oath Blade / Hex of Silence from Boot / Purse / Tick / Mute. Do **not** restamp Gait Wick / Dry Sting / Home Step / Must Span as Wave-17-only doors.

---

## 0.3 Changelog — 2026-10-23 cron

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; open #836 holds Wave 14 + Table L; open #903 holds Wave 15 + Table M; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 16 + Rush **Table N**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.12, re-read on 2026-10-23:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true` (2400–2411). File is **19,213** lines. `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 695–721). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808, Wave 14 (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) + Table L from open #836, **and** Wave 15 (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) + Table M from open #903.
2. Wave 16: `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`. Not in `BOSS_IDS`. Primary holes: **detonate on their next walk MP** (Boot Sting is walked *already*; Post Sting is *unmoved now*; Fuse / Pit Wick are *tile clocks*; Cast Mark detonates on *their cast*; Wound Mark detonates when *they take a hit*; Gait Wick marks a unit so the next ≥ 1 **walk** MP deals 10 then consumes — forced-move does **not** detonate; expiry 2 of their turns for 0), **bonus if leftover AP is 0** (Empty Plate is leftover → *+RES*; Empty Purse / Purse Cut are *economy*; Still Brand / Post Sting are *unmoved*; Lone Sting is *isolated by bodies*; Dry Sting deals 12 and +8 iff the target’s **current leftover AP this turn** is 0), **caster steps adjacent to a targeted ally** (Hinge Step *rotates 90°* around the ally; Relay Dash is walk *max 2*; Morrow Step is delayed *blink*; Cover Step is hit *redirect*; Leash Hook / Ally Reel *pull the ally*; Home Step moves the **caster** to a free Chebyshev-1 of a living ally — dest pick, origin frees, **not** `isSwap`; no free adj = fizzle, AP spent), **next walks this turn must be Manhattan 2** (Must Pace = must walk to *cast*; Even / Odd Stride are *parity*; Walk Toll is *+1 MP per step*; Diag Lock is *diagonal shape*; Rank Lock is *axis*; Must Span makes every walk they start this turn Manhattan **exactly 2** — 1-step and 3-step illegal; 0 walk MP is legal; forced-move any length).
3. Extra doors on remaining **#636** Gait Wick / Dry Sting / Home Step / Must Span. **No new #137 spell ids.** Spectacular `CHOIR_WICK` / `NAVE_DRY` / `CHOIR_HEARTH` / `NAVE_SPAN` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Remaining #636 (`spell-boot-lend` … `spell-pair-slide`), #695, #726, #787, and #849 stay off these sheets.
4. Rush **Table N** (§10.13): four post-Table-M rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, or Table M.
5. Gait Wick / Dry Sting / Home Step / Must Span have **no** #636 stub. Do **not** remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ever ships.

Shipped + Wave-2–15 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K/L/M holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-quad-span`, `spell-boot-lend`, `spell-purse-keep`, `spell-tick-plate`, `spell-last-mute`, `spell-pair-slide`, `spell-court-stretch`). Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Do **not** extra-door #695 Wave-10 tactical ids (`spell-both-mend` … `spell-court-keep`), #726 Wave-11 tactical ids (`spell-heave-mend` … `spell-court-dual`), #787 Wave-12 tactical ids (`spell-parched-mend` … `spell-court-imprint`), or #849 Wave-13 tactical ids (`spell-gaunt-mend` … `spell-court-lag`). Do **not** grant Boot Sting / Post Sting / Fuse / Pit Wick / Empty Plate / Purse Cut / Hinge Step / Morrow Step / Cover Step / Must Pace / Rank Lock / Diag Lock from Wick / Dry / Hearth / Must. Do **not** restamp Shove Mend / Exit Sting / Cadence Stretch / Far Hood as Wave-16-only doors.

---

## 0.4 Changelog — 2026-10-22 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; open #836 holds Wave 14 + Table L; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 15 + Rush **Table M**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.11, re-read on 2026-10-22:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true` (2400–2411). File is **19,213** lines (Wave 14 listed 18,749; this SHA is still 19,213). `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 695–721). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808, **and** Wave 14 (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) + Table L from open #836.
2. Wave 15: `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`. Not in `BOSS_IDS`. Primary holes: **heal if the target was force-moved** (Gait Mend is *caster walked*; Chase Mend is *target walked*; Enter Mend is first *enter*; Heave Mend is *both* caster and target force-moved; Shove Mend heals 8 iff the **target** has `forcedMovedThisTurn` — walk MP does **not** arm it), **first leave deals 8** (Exit Tithe is *AP* on leave; Exit Boon is *positive* on leave; Enter Mend is enter *heal*; Ingress Mark is walk *enter* damage; Shove Sting is *forced-move landing*; Exit Sting paints a cell so the first *leave* — walk or force-move — deals 8 then consumes), **double remaining CDs on one hostile** (Cadence Stall is *+1*; Cadence Flush *zeros ally* remaining; Cadence Crack zeros the *highest one*; Cadence Trim is *−1*; Cadence Stretch sets each remaining ≥ 1 to `remaining * 2`, cap 8, zeros stay 0), **next applied hit from Chebyshev ≥ 3 deals 0** (Sidestep misses *any* range; Near Hood is ≤ 1; Mid / Odd Hood are other bands; Return Sting is 0-to-you *and* half poke; Far Hood consumes only a damaging hit whose attacker is Chebyshev ≥ 3 — 1–2 still land and do **not** consume).
3. Extra doors on remaining **#636** Shove Mend / Exit Sting / Cadence Stretch / Far Hood. **No new #137 spell ids.** Spectacular `CHOIR_JOSTLE` / `NAVE_PEEL` / `CHOIR_DILATE` / `NAVE_HOOD` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Remaining #636 (`spell-quad-span` … `spell-pair-slide` except the four doors), #695, #726, #787, and #849 stay off these sheets.
4. Rush **Table M** (§10.12): four post-Table-L rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, or Table L.
5. #636 stubs `shove_cantor` / `stretch_precentor` belong to Shove Mend / Cadence Stretch MULTI on the tactical sheet — **not** remapped to `jostle_subdeacon` / `dilate_organist`. Exit Sting / Far Hood have **no** stub. First grant wins if a stub ever ships. Do **not** remap `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`.

Shipped + Wave-2–14 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K/L holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-quad-span`, `spell-gait-wick`, `spell-dry-sting`, `spell-home-step`, `spell-must-span`, `spell-boot-lend`, `spell-purse-keep`, `spell-tick-plate`, `spell-last-mute`, `spell-pair-slide`, `spell-court-stretch`). Court Stretch stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #695 Wave-10 tactical ids (`spell-both-mend` … `spell-court-keep`), #726 Wave-11 tactical ids (`spell-heave-mend` … `spell-court-dual`), #787 Wave-12 tactical ids (`spell-parched-mend` … `spell-court-imprint`), or #849 Wave-13 tactical ids (`spell-gaunt-mend` … `spell-court-lag`). Do **not** grant Gait Mend / Chase Mend / Enter Mend / Heave Mend / Exit Tithe / Ingress Mark / Shove Sting / Cadence Flush / Cadence Stall / Sidestep / Quiet Sill from Jostle / Peel / Dilate / Hood. Do **not** restamp Dummy Post / Enter Mend / Split Mend / Quiet Sill as Wave-15-only doors.

---

## 0.5 Changelog — 2026-10-21 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; open #808 holds Wave 13 + Table K; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 14 + Rush **Table L**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.10, re-read on 2026-10-21:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` still maps every `starterSpells` row `isBaseSpell: true`. File is now **18,749** lines (was 19,213 on 2026-09-29). `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753, **and** Wave 13 (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) + Table K from open #808.
2. Wave 14: `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`. Not in `BOSS_IDS`. Primary holes: **1-HP empty-kit taunt post** (Goad / Taunt Oath are *unit-targeted, no body*; Bait Pylon intercepts the next *hostile spell*; Bastion / Span Pylon occupy without a cast-target filter; Dummy Post is a 1-HP pawn, empty kit, Chebyshev ≤ 1 damaging-cast filter), **first-enter heal pad** (Font is a *stationary pulse*; Mend Wick heals the occupant *at tick*; Gait Mend heals iff the *caster walked*; Gift Sill is enter *+MP*; Enter Mend paints a public cell that heals 6 on the first walk **or** forced enter, then expires), **heal 12 split 50/50 with an adjacent ally** (Rally / Blood Mend are *self*; Flank Share splits *damage*; Choir Hymn is W1; Split Mend heals the target 6 and the nearest other ally at Chebyshev ≤ 1 for 6 — isolated target receives the full 12), **tile forbids Strike / `isPhysical`** (Oath Blade *requires* Strike; Strike Hold is *unit-scoped until they walk*; Verse First blocks Strike until a *spell*; Quiet Hex is W1 unit; Quiet Sill paints a cell so the occupant cannot resolve `isPhysical === true` or id `physical_attack` — other spells stay legal).
3. Extra doors on leftover **#563** Dummy Post / Enter Mend / Split Mend **and** one unused **#636** Quiet Sill. **No new #137 spell ids.** Spectacular `CHOIR_EFFIGY` / `NAVE_THRESHOLD` / `CHOIR_SPLIT` / `NAVE_QUIET` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Remaining #636 (`spell-shove-mend` … except Quiet Sill), #695, #726, and #787 stay off these sheets.
4. Rush **Table L** (§10.11): four post-Table-K rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, or Table K.
5. #563 stub `dummy_castellan` belongs to Dummy Post MULTI on the tactical sheet — **not** remapped to `effigy_clerk`. Enter Mend / Split Mend / Quiet Sill have **no** stub. First grant wins if a stub ever ships. Do **not** remap `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`.

Shipped + Wave-2–13 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J/K holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door remaining leftover #563 id `spell-court-hinge` from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door remaining #636 Wave-9 tactical ids (`spell-shove-mend` … `spell-court-stretch` except Quiet Sill), #695 Wave-10 tactical ids (`spell-both-mend` … `spell-court-keep`), #726 Wave-11 tactical ids (`spell-heave-mend` … `spell-court-dual`), or #787 Wave-12 tactical ids (`spell-parched-mend` … `spell-court-imprint`). Do **not** grant Goad / Bait Pylon / Font / Mend Wick / Gait Mend / Oath Blade / Quiet Hex from Effigy / Enter / Split / Quiet. Do **not** restamp Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend as Wave-14-only doors.

---

## 0.6 Changelog — 2026-09-29 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; open #753 holds Wave 12 + Table J; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 13 + Rush **Table K**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.9, re-read on 2026-09-29:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2404 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |
| `WorldExploration.tsx` size | Still **19,213** lines. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663, **and** Wave 12 (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) + Table J from open #753.
2. Wave 13: `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`. Not in `BOSS_IDS`. Primary holes: **reset all remaining CDs on one ally, once/battle** (Cadence Crack is *hostile, highest-one only*; Cadence Break is *self last-id*; Cadence Lend is ally −1; Timestep is *self AP/MP refill*; Cadence Flush zeros **every** remaining CD on a living **ally**), **isolated-target damage bonus** (Split Fang / Crowd Tax *pay the pack*; Wall Sting is barrier-adj; Boot Sting is *caster walked*; Far Sting is *distance*; Lone Sting adds 8 iff the **target** has zero living same-side neighbors at Chebyshev ≤ 1), **delayed absorb that starts next own turn** (Ward Plate absorbs *now*; Surplus Ward is leftover-AP evade; Thin Ward is incoming *cap*; Morrow Step is a *blink*; Morrow Plate *arms now* and grants absorb 10 at the **start of the caster’s next turn**), **dump leftover AP onto an ally** (Tempo Gift grants without dumping yours; Purse Cut *freezes theirs*; Surplus *evades* leftover; Leftover Lend pays 1 AP, then gives `min(remaining, 4)` and zeros the caster).
3. Extra `ENEMY_DISCOVERY` doors on existing **leftover #563** ids only. **No new #137 spell ids.** Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Spectacular `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Dummy Post / Enter Mend / Split Mend stay off these sheets.
4. Rush **Table K** (§10.10): four post-Table-J rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, or Table J.
5. #563 stub `flush_precentor` belongs to Cadence Flush MULTI on the tactical sheet — **not** remapped to `flush_psalmist`. Lone Sting / Morrow Plate / Leftover Lend have **no** stub. First grant wins if a stub ever ships. Do **not** remap `gait_cantor` / `pair_usher` / `dummy_castellan` / `court_hinge_regent`.

Shipped + Wave-2–12 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I/J holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door remaining leftover #563 ids (`spell-dummy-post` / `spell-enter-mend` / `spell-split-mend` / `spell-court-hinge`) from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #636 Wave-9 tactical ids (`spell-shove-mend` … `spell-court-stretch`), #695 Wave-10 tactical ids (`spell-both-mend` … `spell-court-keep`), or #726 Wave-11 tactical ids (`spell-heave-mend` … `spell-court-dual`). Do **not** grant Cadence Crack / Cadence Break / Timestep / Font / Surplus / Boot Sting / Ward Plate / Morrow Step / Purse Cut from Flush / Lone / Plate / Lend. Do **not** restamp Gait Mend / Pair Hinge / Mend Wick / Body Mark as Wave-13-only doors.

---

## 0.7 Changelog — 2026-09-28 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; open #663 holds Wave 11 + Table I; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 12 + Rush **Table J**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.8, re-read on 2026-09-28:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2404 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |
| `WorldExploration.tsx` size | Still **19,213** lines. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638, **and** Wave 11 (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) + Table I from open #663.
2. Wave 12: `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`. Not in `BOSS_IDS`. Primary holes: **heal if the caster spent ≥ 1 walk MP this turn** (Font is a *stationary pulse*; Cover/Rebound kits heal but the *core* is redirect / return-poke; Post Sting bonuses if *unmoved*; Boot Sting damages if walked; Sole *forbids* walk MP; March *requires* a walk before the *next spell*; Gait Mend *heals 8 iff* `walkMpSpentThisTurn ≥ 1`), **90° hinge of two hostiles around their midpoint** (Pivot Foe rotates *one* body around the *caster*; Hinge Tile is enter-swap with the *painter*; Pawn Trade *swaps* two hostiles; Hinge Step rotates the *caster* around an ally; Pair Hinge rotates **both** bodies 90° around **their** midpoint — occupancy dests, not `isSwap`), **delayed tile heal** (Wick Prelate is delayed *damage* still walkable; Crypt is delayed *pit convert*; Font pulses *now*; Mend Wick paints a walkable pad that *heals the occupant at tick*), **unit-scoped next-hit amp** (Mark doubles the next *spell on a tile*; Hex is leave-or-detonate; Glyph is a trap; Body Mark is ×1.5 on the **unit’s** next applied damaging hit).
3. Extra `ENEMY_DISCOVERY` doors on existing **remaining #563** ids only. **No new #137 spell ids.** Gait Mend / Pair Hinge / Mend Wick / Body Mark. Spectacular `CHOIR_INFIRM` / `COURT_YOKE` / `NAVE_SALVE` / `CHOIR_BRAND` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE` (Yoke’s mass director, not a player door).
4. Rush **Table J** (§10.9): four post-Table-I rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, or Table I.
5. #563 stub encounter ids (`gait_cantor`, `pair_usher`) belong to Gait Mend / Pair Hinge MULTI on the tactical sheet — **not** remapped to these boss ids. First grant wins if a stub ever ships. Mend Wick / Body Mark have **no** stub.

Shipped + Wave-2–11 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H/I holds still apply. `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door remaining leftover #563 ids (`spell-cadence-flush` / `spell-lone-sting` / `spell-morrow-plate` / `spell-leftover-lend` / `spell-dummy-post` / `spell-enter-mend` / `spell-split-mend` / `spell-court-hinge`) from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #636 Wave-9 tactical ids (`spell-shove-mend` … `spell-court-stretch`), #695 Wave-10 tactical ids, or #726 Wave-11 tactical ids. Do **not** grant Rank Lock / Must Pace / Gait Seal / Font / Fuse / Mark (tile) / Pivot Foe / Pawn Trade from Infirm / Yoke / Salve / Brand. Do **not** restamp Gait Seal / Diag Lock / Brick Shift / Return Sting as Wave-12-only doors.

---

## 0.8 Changelog — 2026-09-27 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; open #638 holds Wave 10 + Table H; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 11 + Rush **Table I**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.7, re-read on 2026-09-27:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2404 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 711–719 is library-retire include, not a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev `areaRadius`, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |
| `WorldExploration.tsx` size | Still **19,213** lines. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572, **and** Wave 10 (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) + Table H from open #638.
2. Wave 11: `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`. Not in `BOSS_IDS`. Primary holes: **walk-MP forbid, casts still legal** (Rank Lock still *allows* an axis walk; Must Pace *requires* a walk to cast; Stride *taxes* walk MP; Gait Seal *forbids* walk MP while the bar stays legal), **diagonal-only walks** (Rank Lock is rank XOR file — cardinal; Diag Lock is bishop gait `|dx|===|dy|`), **move an existing barrier 1** (Barrier *places* a new brick; Palisade plants *stakes*; Low Lintel *HP-gates* a walk; Brick Shift *relocates* a paid `barrierTiles` key), **next applied hit 0 to you, half to the attacker** (Mirror reflects the *spell*; Cover redirects the *whole hit* to an ally; Sidestep *misses*; Pain Link *shares*; Return Sting consumes *before HP write* and pokes `floor(applied * 0.5)`).
3. Extra `ENEMY_DISCOVERY` / `ELITE` doors on existing **#563** ids only. **No new #137 spell ids.** Gait Seal / Diag Lock / Brick Shift / Return Sting. Spectacular `CHOIR_SOLE` / `NAVE_BIAS` / `NAVE_MASONRY` / `CHOIR_REBOUND` stay `BOSS_ONLY`.
4. Rush **Table I** (§10.8): four post-Table-H rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, or Table H.
5. #563 stub encounter ids (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`) belong to Gait Mend / Pair Hinge / Cadence Flush / Dummy Post / Court Hinge — **not** these sheets. Gait Seal / Diag Lock / Brick Shift / Return Sting have **no** stub. First grant wins if a stub ever ships.

Shipped + Wave-2–10 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G/H holds still apply (rime/well/ram×pit; lock×fosse; bait×goad; surplus×eternal; mill×ram; counter×grandmaster; wedge×queen; levy×archivist; gaze×wedge; span×palisade; cover×bait; lintel×fosse; toll×levy; hinge×grandmaster; veil×bait; oath×conductor; crypt×fosse; march×stride; aisle×span; orbit×hinge). `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door remaining #563 ids (`spell-gait-mend` / `spell-pair-hinge` / `spell-cadence-flush` / `spell-lone-sting` / `spell-morrow-plate` / `spell-mend-wick` / `spell-leftover-lend` / `spell-dummy-post` / `spell-enter-mend` / `spell-body-mark` / `spell-split-mend` / `spell-court-hinge`) from these sheets. Court Hinge stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #636 Wave-9 tactical ids (`spell-shove-mend` … `spell-court-stretch`). Do **not** grant Rank Lock / Must Pace / Open Pit / Span Guard / Gait Mend from Sole / Bias / Brick / Rebound. Do **not** restamp Pit Wick / Must Pace / Triple Span / Pivot Foe as Wave-11-only doors.

---

## 0.9 Changelog — 2026-09-26 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; open #572 holds Wave 9 + Table G; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 10 + Rush **Table H**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1–§0.6, re-read on 2026-09-26:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2404 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–719 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |
| `WorldExploration.tsx` size | Still **19,213** lines. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518, **and** Wave 9 (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) + Table G from open #572.
2. Wave 10: `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`. Not in `BOSS_IDS`. Primary holes: **delayed occupancy pit** (Fosse is *immediate* Open Pit; Wick Prelate is delayed *damage* still walkable; Pit Wick paints a walkable wick that *converts* to a pit after 1 turn), **must-walk before next spell** (Stride taxes *walk MP*; Stride Mute fizzles *if* they walked; Oath is Strike-only; Must Pace fizzles the next spell *unless* `walkMpSpentThisTurn ≥ 1`), **three-post occupy chain** (Span Guard is a *rigid two-cell body*; Twin Span is two independently-walking posts; Triple Span is *three* 1-HP posts that must stay a 4-adj chain), **pivot target 90° around the caster** (Hinge Tile is enter-swap with the *painter*; Hinge Step rotates the *caster* around an ally; Court Hinge is mass pair-hinge `NOT_PLAYER_LEARNABLE`; Pivot Foe occupancy-teleports the *target* 90° clockwise around the caster).
3. Extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` / `ELITE` / `BOSS` doors on existing **#525** ids only. **No new #137 spell ids.** Pit Wick / Must Pace / Triple Span / Pivot Foe. Spectacular `NAVE_COLLAPSE` / `CHOIR_PACE` / `NAVE_TRISPAN` / `CHOIR_ORBIT` stay `BOSS_ONLY`.
4. Rush **Table H** (§10.7): four post-Table-G rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, Table F, or Table G.
5. #525 stub encounter ids (`wick_mason`, `pace_prelate`, `span_triune`, `slip_castellan`) are **not** these sheets. First grant wins if those stubs ever ship. Pivot Foe has no stub.

Shipped + Wave-2–9 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F/G holds still apply (rime/well/ram×pit; lock×fosse; bait×goad; surplus×eternal; mill×ram; counter×grandmaster; wedge×queen; levy×archivist; gaze×wedge; span×palisade; cover×bait; lintel×fosse; toll×levy; hinge×grandmaster; veil×bait; oath×conductor). `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door remaining #525 ids (`spell-wall-sting` / `spell-file-brand` / `spell-boot-sting` / `spell-shove-face` / `spell-knight-slip` / `spell-cadence-crack` / `spell-once-verse` / `spell-tick-hood` / `spell-flank-share` / `spell-spare-pace` / `spell-exit-boon` / `spell-court-shove`) from these sheets. Court Shove stays `NOT_PLAYER_LEARNABLE`. Do **not** extra-door #563 Wave-8 tactical ids (`spell-gait-mend` … `spell-court-hinge`). Do **not** grant Twin Span / Span Guard / Open Pit / Fuse Tile / Must Pace aliases from Crypt / March / Aisle / Orbit. Do **not** restamp Exit Tithe / Hinge Tile / Aim Veil / Oath Blade as Wave-10-only doors.

---

## 0.10 Changelog — 2026-09-25 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; open #518 holds Wave 8 + Table F; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 9 + Rush **Table G**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1 / §0.2 / §0.3 / §0.4, re-read on 2026-09-25:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2404 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–718 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |
| `WorldExploration.tsx` size | Still **19,213** lines. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474, **and** Wave 8 (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) + Table F from open #518.
2. Wave 9: `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`. Not in `BOSS_IDS`. Primary holes: **walk-exit AP tax** (Glyph Tax is *enter* / zone; Hex Toll / Levy brand the *next cast*; Stride taxes *walk MP*; Debt Mark is next-walk +1; Exit Tithe taxes *leaving this painted cell*), **enter-swap with the painter** (Grandmaster is caster↔player at *cast* time; Counter swaps two *other* hostiles and stays; Morrow is delayed self-blink; Hinge Tile swaps the *enterer* with the *painter*), **cannot be primary spell target** (Bait eats the next *spell* aimed at the owner; Cover redirects a *hit* that already chose you; Goad forces the *target*; Aim Veil *rejects* `targetType: "enemy"` aimed at him — AoE / Strike still land), **Strike-only brand** (Conductor silences a *file*; Mute Thread fizzles the *next* spell; Hex of Silence locks the bar `BOSS_ONLY`; Oath Blade brands the *unit* so only `physical_attack` resolves).
3. Extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` / `BOSS` doors on existing **#463** ids only. **No new #137 spell ids.** Exit Tithe / Hinge Tile / Aim Veil / Oath Blade. Spectacular `THRESHOLD_TITHE` / `CHOIR_HINGE` / `NAVE_VEIL` / `STEEL_CANON` stay `BOSS_ONLY`.
4. Rush **Table G** (§10.6): four post-Table-F rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, Table E, or Table F.
5. #463 stub encounter ids (`exit_mason`, `hinge_porter`, `oath_censor`, `about_regent`) are **not** these sheets. `hinge_porter` is Hinge Step’s MULTI child, not Hinge Tile. First grant wins if those stubs ever ship.

Shipped + Wave-2–8 sheets remain `STATUS: PROPOSED`. Table B/C/D/E/F holds still apply (rime/well/ram×pit; lock×fosse; bait×goad; surplus×eternal; mill×ram; counter×grandmaster; wedge×queen; levy×archivist; gaze×wedge; span×palisade; cover×bait; lintel×fosse). `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door #525 Wave-7 tactical ids (`spell-wall-sting` … `spell-court-shove`) from these sheets. Do **not** extra-door #563 Wave-8 tactical ids (`spell-gait-mend` … `spell-court-hinge`). Do **not** grant Twin Span / About Face / File Reel / Hinge Step / Post Sting / Purse Cut / Turn Cap from Toll / Hinge / Veil / Oath. Do **not** restamp Facing Pin / Span Guard / Cover Step / Low Lintel as Wave-9-only doors.

---

## 0.11 Changelog — 2026-09-24 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; open #474 holds Wave 7 + Table E; none of those are on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 8 + Rush **Table F**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1 / §0.2 / §0.3, re-read on 2026-09-24:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2395–2408 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–718 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev, 690–727). Fan Bolt’s cone wire is still unbuilt. Facing (`currentView`) still has no battle-walk writer — #411 fail-closed until that writer exists. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367, Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406, **and** Wave 7 (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) + Table E from open #474.
2. Wave 8: `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`. Not in `BOSS_IDS`. Primary holes: **facing lock** (Wedge is a 90° *damage cone* from *his* facing; Facing Pin locks *your* `currentView`), **two-cell occupy** (Palisade / Barrier / Fosse change *which cells exist*; Span Guard is the *body* occupying origin + one adjacent), **hit redirect to an ally** (Mirror reflects to the caster; Bait eats the next *spell* aimed at the owner; Cover Step sends the next *hit* to an adjacent ally), **HP%-gated walk** (Fosse pits refuse *everyone*; Low Lintel lets a walker through only at HP% ≤ 50).
3. Extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` doors on existing **#411** ids only. **No new #137 spell ids.** Facing Pin / Span Guard / Cover Step / Low Lintel. Spectacular `NAVE_GAZE` / `DOUBLE_SPAN` / `CHOIR_COVER` / `NAVE_LINTEL` stay `BOSS_ONLY`.
4. Grant-line notes (roster only, no sheet rewrite): `weeping_pawn` → `spell-mute-thread`; `eternal_pawn_king` → `spell-queue-cut`; `enthroned_void` → `spell-file-vault` MULTI child — #411 already stamps those `BOSS` / MULTI doors. False Cut stays Lament kit-only (`NOT_PLAYER_LEARNABLE`).
5. Rush **Table F** (§10.5): four post-Table-E rooms. Does **not** rewrite rooms 0–9, Table B, Table C, Table D, or Table E.

Shipped + Wave-2–7 sheets remain `STATUS: PROPOSED`. Table B/C/D/E holds still apply (rime/well/ram×pit; lock×fosse; bait×goad; surplus×eternal; mill×ram; counter×grandmaster; wedge×queen; levy×archivist). `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door #463 Wave-6 tactical ids (`spell-post-sting` … `spell-about-face`) from these sheets. Do **not** grant Oncoming / Glance Cut from Gaze (Facing Pin is the lock). Do **not** grant Twin Span / Span Pylon from Span (Span Guard is rigid two-cell occupy). Do **not** restamp Queue Cut / Mute Thread / File Vault as Wave-8-only doors.

---

## 0.12 Changelog — 2026-09-23 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f`. Open #367 holds Wave 5 + Table C; open #406 holds Wave 6 + Table D; neither is on `main`. This file **unions** those drafts (does not overwrite them) and adds Wave 7 + Rush **Table E**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.1 / §0.2, re-read on 2026-09-23:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2411 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–718 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only (`WorldExploration.tsx` 9389). MIMA-2026-08-31-001 still OPEN. |
| Phase-2 multiplier apply site | `WorldExploration.tsx` 15762 (19,213 lines). |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev, 690–727). Fan Bolt’s cone wire is still unbuilt. |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) + Table C from open #367 **and** Wave 6 (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) + Table D from open #406.
2. Wave 7: `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`. Not in `BOSS_IDS`. Primary holes: **conveyor enter-slide** (Margrave is ice-file *gutter* + 2-tile forced move; Slide Tile is one cell, enter-only, distance 1), **two-hostile swap** (Grandmaster is caster↔player `isSwap`; Pawn Trade swaps two *other* bodies and the caster stays), **facing cone** (Queen is omni-lines; Cinder is a full file; Ram is a shove ray; Fan Bolt is a 90° wedge), **unit next-cast AP tax** (Glyph Tax is a *tile* zone; Drain Courage is immediate −1 current AP; Hex Toll brands the *unit*).
3. Extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` doors on existing **#282** ids only. **No new #137 spell ids.** Slide Tile / Pawn Trade / Fan Bolt / Hex Toll. Spectacular `MILL_RACE` / `FALSE_COUNTER` / `TRIPLE_WEDGE` / `TITHE_STACK` stay `BOSS_ONLY`.
4. Rush **Table E** (§10.4): four post-Table-D rooms. Does **not** rewrite rooms 0–9, Table B, Table C, or Table D.

Shipped + Wave-2–6 sheets remain `STATUS: PROPOSED`. Table B/C/D holds still apply (rime/well/ram×pit; lock×fosse; bait×goad; surplus×eternal). `rime_margrave` / `sinkhole_dowager` stay solo (MIMA-005).

Do **not** extra-door #411 Wave-5 tactical ids (`spell-oncoming` … `spell-act-bell`) from these sheets. Do **not** grant Gale Fan (cone+push) from Wedge (Fan Bolt is the one-body wedge).

---

## 0.13 Changelog — 2026-09-22 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. `origin/main` is still `0f5363f` (no merge since the 2026-09-21 Wave-5 pass). Open #367 holds Wave 5 + Table C and is **not** on `main`; that file **unioned** that draft (did not overwrite it) and added Wave 6 + Rush **Table D**.

Live audit against `0f5363f` (`Merge pull request #332`) — same facts as §0.2, re-read on 2026-09-22:

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2411 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–718 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336). |
| Swap × hazards | `spellEngine.ts` 768 calls `swapPositions`; WX still copies coords only. MIMA-2026-08-31-001 still OPEN. |
| Phase-2 multiplier apply site | `WorldExploration.tsx` 15762 (19,213 lines). |
| Line targeting exists, unread by data | `targeting.ts` 580. `areaShape` still unread (Chebyshev). |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Union of Wave 5 (`ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`) and Rush **Table C** from open #367.
2. Wave 6: `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`. Not in `BOSS_IDS`. Primary holes: **axis walk lock** (Hex is leave-this-tile; Stride taxes walking; Palisade/Fosse block geometry), **bait intercept** (Goad is forced targeting; Grandmaster is illusions), **stationary heal font** (Archbishop wisp walks; Lament well siphons allied pain), **leftover-AP evade** (Eternal drains current AP; Stride taxes walk MP).
3. Extra `MULTI_SOURCE` / `BOSS` doors on existing **#282 / #342** ids only. **No new #137 spell ids.** Rank Lock / Bait Pylon / Mercy Font / Surplus Ward. Spectacular `AXIS_CURFEW` / `FALSE_RELIQUARY` / `CHOIR_FONT` / `AUDIT_TITHE` stay `BOSS_ONLY`.
4. Rush **Table D** (§10.3): four post-Table-C rooms. Does **not** rewrite rooms 0–9, Table B, or Table C.

Shipped + Wave-2–5 sheets remain `STATUS: PROPOSED`. Table B/C holds still apply (rime/well/ram×pit). `cord_familiar` leaves the solo list via D2.

---

## 0.14 Changelog — 2026-09-21 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **still unchanged** since #137. Nineteen days of merges (`58302bc` → `0f5363f`, through #332) did not add a boss id, a `BossAbility` member, or a live catalog spell. That run did **not** duplicate shipped or Wave-2–4 sheets. It re-audited live gaps at `0f5363f`, aligned with same-day tactical Wave 4 (`SPELL_PROPOSALS_2026-09-21.md`, open #342), filled four remaining **primary-mechanic** holes, and wrote Rush **Table C**.

Live audit against `0f5363f` (`Merge pull request #332`):

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` (e.g. 172) so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Frontend catalog forced innate | `WorldExploration.tsx` 2400–2411 maps every `starterSpells` row `isBaseSpell: true`. `adminSafety.ts` 712–718 still does not create a discovery path. |
| `applyAttract` / `applyPushback` unused by casts | `occupancy.ts` 482 / 537; tests only. MIMA-2026-08-31-005 still OPEN (#336 reconfirmed). |
| Swap × hazards | `swapPositions` still copies coords only (`WorldExploration.tsx` ~9389–9401). MIMA-2026-08-31-001 still OPEN. |
| Phase-2 multiplier apply site | `WorldExploration.tsx` 15762 (moved with WX shrinkage; 19,213 lines). |
| Line targeting exists, unread by data | `targeting.ts` 576–617. `areaShape` still unread (Chebyshev, 690–727). |
| Twin Monarchs Dawn “+1 MP” | Applied as AP (`useBossSystem.ts` / MIMA-2026-09-21-002). Copy lie, not a new mechanic. |
| Queen `VOID_TILES` | Still stored, walk switch is lava/ice/spikes only (MIMA-2026-09-02-004). |
| Seeded feats | Still 15 in `defaultAchievements()` (`admin.mo` 309–326). No boss-discovery feats. |

**This pass adds:**

1. Sibling alignment with tactical Wave 4 (#342): extra `MULTI_SOURCE` / `BOSS` doors on existing #120 / #282 / #342 ids only. **No new #137 spell ids.**
2. Grant-line notes (roster only, no sheet rewrite): `starborn_queen` → `spell-cut-in` (#342 already `bossIds: ["starborn_queen"]`); `pale_archivist` also first-wins `spell-after-verse`; `starved_vampire_pawn` also first-wins `spell-sanguine-toll`; `lord_of_static` is a `spell-draw-together` MULTI child. Glyph Snare / Exsanguinate / Shock Glyph stay the #137 count-gates.
3. Wave 5: `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`. Not in `BOSS_IDS`. Primary holes: knockback-away (Hook owns pull-to-caster; Dowager owns pull-to-tile), open pits (walk-block / LoS-open), walk-MP tithe (Hex owns leave-this-tile; Goad owns forced targeting), delayed painted blink (Grandmaster owns instant Swap; Twin Gate already stamps Void Grandmaster).
4. Rush **Table C** (§10.2): four post-Table-B rooms. Does **not** rewrite rooms 0–9 or Table B.

Shipped + Wave-2–4 sheets remain `STATUS: PROPOSED`. Wave-4 Table B still holds ram×pit and attract×hazard pairs.

---

## 0.15 Changelog — 2026-09-02 cron (kept)

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) were unchanged since #137. That run did **not** duplicate shipped, Wave-2, or Wave-3 sheets. It re-audited live gaps, aligned with tactical Wave 2 (#133), filled four **primary-mechanic** holes, and wrote Rush **Table B**.

Live audit against `58302bc` (`main`, after #258 GameKey shop) — facts below were true then and are **still true** at `0f5363f` (see §0):

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. `progression.ts` 308–338. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 remap to `second_lament` is still spec-only. `useBossRush.ts` 127. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` 38–54; decide fns still pass `new Map()` so cooldown is unused |
| Backend `defaultBossConfigs()` stale 12-boss seed | `admin.mo` 350; still `fireball` / `cursed_gust` |
| Long-horizon 2026-09-01 | Combat HP stays static; Guide table is not the fight. Practical XP still exhausts in the mid-teens. |
| Push/pull × hazards | MIMA-2026-08-31-005 still OPEN: `applyAttract` / `applyPushback` have **zero** `resolvePlayerCast` callers. Wave-4 well/rime **position** is legal; ice-tax / fuse-tick on pull is **blocked** until that pair is wired. |
| Swap × hazards | MIMA-2026-08-31-001 still OPEN. Dowager Swap onto rime/fuse does not tick until that pair lands. |

**This pass adds:**

1. Honesty fix: §5.2 lists **10** #137 adaptations (5 `PLAYER_LEARNABLE` + 3 `ACHIEVEMENT_UNLOCK` + 2 `CHALLENGE_UNLOCK`), not 8.
2. Sibling alignment with tactical Wave 2 (`SPELL_PROPOSALS_2026-09-01.md`): extra `MULTI_SOURCE` / `BOSS` doors on existing #133 ids only. **No new #137 spell ids.**
3. Grant-line edits: `cinder_lance` → `spell-file-lance`; `midnight_bishop` → `spell-life-tether` (already `bossIds: ["midnight_bishop"]` on the #133 card).
4. Wave 4: `rime_margrave`, `wick_prelate`, `goad_pretender`, `sinkhole_dowager`. Not in `BOSS_IDS`. Primary holes: ice-slide, delayed fuse, forced targeting, pull-toward-tile.
5. Rush **Table B** (§10.1): four post-clear rooms. Does **not** rewrite `BOSS_RUSH_ROOMS` 0–9 (still out of scope except the room-9 remap).

Shipped + Wave-2 + Wave-3 sheets remain `STATUS: PROPOSED` with the two grant-line edits in §8 / §7.

---

## 1. Intent

Stralt has no level cap. A boss that is interesting at level 8 must still be a tactical fight at level 80. Difficulty comes from **reading the board, spending AP/MP well, and answering a core mechanic** — not from a larger HP number.

Existing shipped data works against that:

| Fact | Where it lives | Why it breaks no-cap |
| :--- | :--- | :--- |
| Catalog HP is absolute (60–600) | `src/frontend/src/types/bossDefaults.ts` | Player HP can grow (`100 * 1.05^(L-1)` when a level-up config exists; `updateCharacter` allows `L * 200 + 100`). A 400 HP rook is a sponge at L1 and a punchbag at L40. |
| Level-diff only multiplies those fixed bases | `getBossEffectiveStats` in `src/frontend/src/engine/progression.ts` (`BOSS_LEVEL_DIFF_STEP = 1.08`) | Even-match (`diff = 0`) returns the catalog unchanged. The Guide table never scales HP to the player. |
| Phase-2 `statMultiplier` stacks on that | `BossPhaseConfig.statMultiplier` | Weeping Pawn / Midnight Bishop use `2.0`. Final Pawn uses **`999`**. That is an invuln hack, not a fight. |
| Backend seed is a different roster | `src/backend/lib/admin.mo` `defaultBossConfigs()` | Stale spell ids (`fireball`, `cursed_gust`) and 12-boss list. Frontend kits in `src/frontend/src/data/bossKits.ts` are the live catalog. Do not “sync” by deploying `backend_extended/`. |

The redesign keeps every current `BossId`, piece type, and kit-spell id. It rewrites **how those fights are meant to feel**, how they scale, and which spectacular tricks the player may ever learn.

---

## 2. Hard constraints (do not violate when implementing)

Copied from live architecture so a later implementer cannot “helpfully” invent stats or reward paths.

1. **No production code in this PR.** Specs only.
2. **Do not touch** the RAF loop, map generation, turn logic, or damage math.
3. **CharacterStats stays 12 fields:** `hp, ap, mp, sp, sr, atk, res, chc, init, resilience, evasion, killCount`. No `wp` / `wr` / `scp`.
4. **Spell targeting and effects use explicit metadata** (`effectType`, `targetType`, `areaShape`, flags such as `isMark` / `isBarrier`). Never name-based heuristics.
5. **Rewards** go through `applyRewards` (`utils/rewardResolver.ts`) and the root recap. Never `updateCharacter` for XP/Doka. Death penalty stays on `saveBattleStats` (Nat-only `applyRewards` cannot subtract).
6. **XP curve** is `100 * 2^(N-1)`. Do not use `100 * 2^N`.
7. **Boss kits** are 3–5 ids from `SPELL_ID_CATALOG` in `bossKits.ts`. Phase 2 must add at least one spell Phase 1 lacks. Do not invent kit spells that are not in `spellData.ts` unless a later spell-catalog PR adds them with explicit metadata.
8. **Canonical actor** is `src/backend/main.mo`. Do not deploy `backend_extended/` (15-field stats).
9. **Admin / debug** stays gated. Boss Guide and admin config editors are not player-facing unlocks.
10. **Current type allows only two phases** (`BossPhaseConfig.phaseNumber: 1 | 2`). Sheets below may describe a third *dramatic beat*. Until the type is extended, that beat is an **enrage overlay or a Phase-2 branch**, not a third `phaseNumber`.
11. **Hazard tiles** are already capped at 50 (`BossState.hazardTiles`). New hazards must respect that cap.
12. **Challenge HP / AP** still go through `recordChallengeDamageTaken` / `recordInBattleChallengeDamage` / `recordChallengeApSpend`.

---

## 3. Scaling bible (indefinite progression)

### 3.1 Relative, not absolute

At encounter start the boss is **level-matched** to the player, then offset by a small intended gap:

```
bossLevel     = playerLevel + relativeOffset     // relativeOffset ∈ {0, +1, +2}
hpBudget      = playerMaxHp * hpRatio            // hpRatio from the table below
atkBudget     = max(playerAtk, 1) * atkRatio
diffMult      = 1.08 ^ (bossLevel - playerLevel) // keep the existing Guide step
phaseMult     = phase.statMultiplier             // compose; never 999
effectiveHp   = round(hpBudget * diffMult * phaseMult)
effectiveAtk  = round(atkBudget * diffMult * min(phaseMult, 1.6))
```

`getBossEffectiveStats` today only applies `diffMult` to the **catalog** HP. The intended change (later PR, not this one) is to **replace catalog HP with `hpBudget` before** applying `diffMult`. Catalog HP in `bossDefaults.ts` becomes a **reference at playerLevel 1 with default 100 HP**, not a live value.

AP and MP stay near current catalog values and remain capped at 20 (`updateCharacter`). Resource pressure is the infinite-progression lever: the player never gets 40 AP, so a fight that taxes AP stays hard at any level.

Do **not** scale:

- Telegraph length (always 1 turn unless a sheet says 2)
- Summon **count** (scale summon **stats**, not the number of bodies)
- Enrage turn index (see §3.3)
- Discoverable-spell observation counts

### 3.2 HP / atk ratios by relative difficulty

Relative difficulty is a 1–10 even-match rating (player vs boss at `diff = 0`). It is **not** a level requirement.

| RELATIVE_DIFFICULTY | hpRatio | atkRatio | Intended even-match length |
| ---: | ---: | ---: | :--- |
| 3 | 1.30 | 0.85 | 6–9 player turns |
| 4 | 1.45 | 0.95 | 8–12 |
| 5 | 1.60 | 1.00 | 10–14 |
| 6 | 1.80 | 1.05 | 12–16 |
| 7 | 2.00 | 1.10 | 12–18 |
| 8 | 2.20 | 1.15 | 14–20 |
| 9 | 2.40 | 1.20 | 16–22 |
| 10 | 2.60 | 1.15 | 16–24 (length from mechanics, not HP) |

Phase-2 `statMultiplier` must stay in **1.15–1.60**. Anything above 1.60 is a sponge. Final Pawn’s `999` is retired in this spec (see that sheet).

Outgoing boss damage that is a **percent of player max HP** (hazards, drains, enrage ticks) uses a **percent**, not a flat 8/15/22. Flat kit-spell numbers in `spellData.ts` already scale with SP; do not also multiply them by player HP or fights explode.

Hazard tick guideline (later wiring, not damage-math rewrite here):

```
hazardTick = max(1, round(playerMaxHp * 0.04))   // lava / shock / void step
spikeTick  = max(1, round(playerMaxHp * 0.03))
```

Until that wiring exists, treat catalog flat ticks as the **level-1 reference**.

### 3.3 Enrage overlay (all bosses)

Enrage is a **turn clock**, not an HP threshold. High-level players with more MP cannot kite forever.

```
enrageTurn = min(28, 14 + relativeDifficulty)
```

At `enrageTurn` and every turn after:

- Boss outgoing damage +8% per stack
- Cap +80% (10 stacks)
- **No HP added**
- One extra telegraph resolves on the same turn as its wind-up (the “you had a turn to step off” rule collapses)

Enrage never grants `DAMAGE_IMMUNE` or `INVINCIBLE_PHASE`.

### 3.4 Rewards that do not explode

Victory XP today is `sum(defeated.level * 20)` then `rewardXpMultiplier`. If minions inherit `playerLevel`, a brood fight mints more XP than the boss.

**Rule:** only the **boss combatant** (and Twin Monarchs’ second body) counts at full `level * 20 * rewardXpMultiplier`. Minions, larvae, ghosts, scrolls, and phantoms count **0** toward `selectDefeatedEnemiesForRewards` unless a sheet explicitly says otherwise (none do).

Doka stays on the existing multipliers (5–10×) through `applyRewards`. Do not add a `playerLevel` Doka exponent. The XP curve is already exponential.

Mastery and discovery rewards are **spells or feats**, not a second Doka funnel. New feat claims still go through `claimAchievementReward` on the persist lock.

### 3.5 What we refuse to scale

- Board size (16×16)
- Kit AP costs
- “See this ability N times” observation counters
- Number of anchors / metronomes / reliquaries (object **HP** may use `0.15 * playerMaxHp`)

---

## 4. Mechanic vocabulary

Every sheet uses these systems. They are **design systems**, not new `BossAbility` enum members until an implementation PR adds them with explicit metadata.

| System | Player-facing rule | Scaling note |
| :--- | :--- | :--- |
| **Phases** | Dramatic beats at HP fractions. Live code: 2 phases. A third beat is an enrage overlay or Phase-2 branch until `phaseNumber` is widened. | Thresholds are fractions of **effective** max HP. |
| **HP thresholds** | `0.70 / 0.40 / 0.15` are the default trio. Individual sheets override. | Never a raw HP number. |
| **Reinforcements** | Extra bodies on a cadence, cap **4** living boss-side units (Final Pawn ghosts: cap **6**, not 11). | Body count fixed; stats use summon scaling. |
| **Destructible objectives** | 1-tile objects, block walk, HP = `0.15 * playerMaxHp`, die to any damaging hit. Destroying them answers a mechanic (drop shield, rotate vuln, delay enrage). | Count fixed; HP relative. |
| **Rotating vulnerabilities** | 3-turn cycle. Window A: +40% from `isPhysical` hits. Window B: +40% from non-physical. Window C: +40% from a named line (rank / file / diagonal). Telegraph the next window on the boss tile. | Percent, not a new damage type. |
| **Arena hazards** | Lava, spikes, shock, void, glyph. Cap 50. Walk damage must use the existing challenge debit helpers. | Tick as % HP (guideline above). |
| **Telegraphed attacks** | 1-turn wind-up: highlighted tiles, then resolve. Stepping off is the answer. | Wind-up does not scale. |
| **Enrage** | §3.3 overlay. | Turn index from relative difficulty. |
| **Target marking** | Prefer existing `spell-mark` / `isMark`. Movement-fail marks are a **new** explicit flag (`isForcedMoveMark`) if ever implemented — do not infer from the name “Hex”. | Mark damage uses the next spell’s metadata. |
| **Movement checks** | “Leave this tile / cross this file / do not stand still.” Failed check = a hazard tick or a free boss attack. | Check is binary. |
| **Summon management** | Shells, explosions, healers. Player summons use existing lifespan rules. Boss summons count against the 4-body cap. | |
| **Resource pressure** | AP drain, MP slow, forced reposition. AP/MP caps (20) make this work at any level. | Drain amounts stay small integers (−1 AP, −2 MP). |
| **Optional mastery** | Extra objective after a normal win. Unlocks a feat and/or a discoverable spell. Never required to leave the map. | |

---

## 5. Discovery classification

Every **special** boss ability (the `BossAbility` enum, not the kit spells already in `spellData.ts`) is one of:

| Class | Meaning |
| :--- | :--- |
| `BOSS_ONLY` | Identity, arena mutation, or too strong in a player kit. The player never receives this ability. |
| `PLAYER_LEARNABLE` | A **bounded adaptation** can be added to `spellData.ts` later, with explicit metadata. Observation + victory required. |
| `ACHIEVEMENT_UNLOCK` | Adaptation is gated on an existing or new feat (`AchievementConfig.condition`). |
| `CHALLENGE_UNLOCK` | Adaptation is gated on a live challenge id from `DEFAULT_CHALLENGES` completed **on that boss**. |

Kit spells (`spell-inferno`, `starter-drain`, …) are **already player-usable**. They are listed under `SPELLS` on each sheet. They are **not** re-classified here. The boss’s **stronger version** of the same fantasy (full-board lava, 11 ghosts) stays `BOSS_ONLY`.

### 5.1 Master classification — all `BossAbility` values

| Ability | Class | Why | Player adaptation (if any) |
| :--- | :--- | :--- | :--- |
| `REFLECT_SHIELD` | `BOSS_ONLY` | `spell-mirror` already covers the player fantasy. A second reflect would stack. | — |
| `SPAWN_MINIONS` | `BOSS_ONLY` | Reinforcement director, not a spell. Player already has five summon ids. | — |
| `LAVA_TRAIL` | `PLAYER_LEARNABLE` | Local, readable, fits existing lava hazard. | `spell-ember-step` |
| `TELEPORT_ADJACENT` | `BOSS_ONLY` | `spell-swap` is the player version. Free self-blink-to-melee would delete positioning. | — |
| `ILLUSION_SPLIT` | `BOSS_ONLY` | Multi-body identity. Player clones would break targeting and victory. | — |
| `KNIGHT_JUMP_IGNORE_WALLS` | `ACHIEVEMENT_UNLOCK` | Spectacular but a **once-per-battle** vault is safe. | `spell-vault` |
| `SPIKE_ON_LAND` | `PLAYER_LEARNABLE` | One-tile trap, existing spike hazard. | `spell-caltrop` |
| `CURSE_ON_HIT` | `BOSS_ONLY` | Passive on-hit. `spell-cursed-wound` already is the player cast. | — |
| `PROMOTE_QUEEN` | `BOSS_ONLY` | Piece-type rewrite mid-fight. | — |
| `ATTACK_ALL_LINES` | `BOSS_ONLY` | Full rank/file/diagonal is an arena nuke. | — |
| `VOID_TILES` | `BOSS_ONLY` | Permanent holes change pathing and map-gen solvability. | — |
| `COMPOUNDING_ROT` | `CHALLENGE_UNLOCK` | Stacking DoT is easy to abuse; lock behind a feat-of-skill. | `spell-rot-brand` |
| `SPLIT_ROOKS` | `BOSS_ONLY` | Second full boss body. | — |
| `ADVANCE_PER_TURN` | `BOSS_ONLY` | Forced AI locomotion, not a player verb. | — |
| `AP_DRAIN` | `BOSS_ONLY` | `spell-drain-courage` already drains 1 AP. A stronger aura would brick the AP cap. | — |
| `TWIN_FLANK` | `BOSS_ONLY` | Dual-body director. | — |
| `MERGE_BISHOPS` | `BOSS_ONLY` | Dual-body director. | — |
| `MAGIC_REFLECT` | `BOSS_ONLY` | Covered by `spell-mirror`. | — |
| `LARVAE_SPAWN` | `BOSS_ONLY` | Director. Player has `summon-bomber` / `summon-archer`. | — |
| `SHELL_ARMOR` | `ACHIEVEMENT_UNLOCK` | Interesting if it requires a **living allied summon**. | `spell-brood-ward` |
| `LARVAE_EXPLODE` | `BOSS_ONLY` | Minion death-nova as a director. `summon-bomber` is the player analog. | — |
| `SHOCK_TILES` | `PLAYER_LEARNABLE` | One charged tile, existing shock state. | `spell-shock-glyph` |
| `CHAIN_LIGHTNING` | `BOSS_ONLY` | Tile-to-tile board chain. `starter-blast` is the player analog. | — |
| `INVINCIBLE_PHASE` | `BOSS_ONLY` | Fight-structure, not a spell. | — |
| `GHOST_SUMMON` | `BOSS_ONLY` | Roster-wide summon. | — |
| `RESONANCE_SHOCKWAVE` | `ACHIEVEMENT_UNLOCK` | Delayed self-nova after taking hits — readable. | `spell-aftershock` |
| `BOARD_SHRINK` | `BOSS_ONLY` | Arena mutation. | — |
| `MAP_ROTATE` | `BOSS_ONLY` | Arena mutation. | — |
| `MIRROR_INVERT` | `BOSS_ONLY` | Arena mutation. | — |
| `BOARD_CLAIM` | `BOSS_ONLY` | Arena mutation. | — |
| `SPELL_MIRROR` | `BOSS_ONLY` | Player already has `spell-mirror`. Boss buffer is stronger. | — |
| `COMBO_REPLAY` | `CHALLENGE_UNLOCK` | Echoing the last cast at half power is a skill toy. | `spell-echo-cast` |
| `LIFE_DRAIN` | `BOSS_ONLY` | `starter-drain` exists. Boss version feeds a growth loop. | — |
| `VAMPIRIC_AOE` | `BOSS_ONLY` | `spell-lifesteal-nova` exists. | — |
| `EXSANGUINATED_DEBUFF` | `PLAYER_LEARNABLE` | Single-target anti-heal / bleed with explicit `debuffStat`. | `spell-exsanguinate` |
| `INK_VEIL` | `BOSS_ONLY` | Vision / accuracy identity. `spell-shadow-veil` is the player analog. | — |
| `SCROLL_SUMMON` | `BOSS_ONLY` | Director. | — |
| `GLYPH_TRAP` | `PLAYER_LEARNABLE` | Close to `spell-mark`; adaptation is a **ground trap**, not a damage amp. | `spell-glyph-snare` |
| `PAGES_OF_DOOM` | `BOSS_ONLY` | Multi-wave director. | — |
| `DAWN_BUFF` | `BOSS_ONLY` | Twin-link. `spell-rallying-cry` is the player analog. | — |
| `DUSK_DOT` | `BOSS_ONLY` | Twin-link. `spell-inferno` is the player analog. | — |
| `MONARCH_ABSORB` | `BOSS_ONLY` | Dual-body director. | — |
| `ANCHOR_TILES` | `BOSS_ONLY` | Objective director. | — |
| `PHANTOM_SPAWN` | `BOSS_ONLY` | Director. | — |
| `AP_DRAIN_PASSIVE` | `BOSS_ONLY` | Aura. Would brick the 20 AP cap on the player bar. | — |
| `DAMAGE_IMMUNE` | `BOSS_ONLY` | Fight-structure. | — |

**Count:** 46 shipped specials. Player-facing **#137 adaptations: 10** (`PLAYER_LEARNABLE` 5 + `ACHIEVEMENT_UNLOCK` 3 + `CHALLENGE_UNLOCK` 2). #120 adds three first-victory `BOSS` grants (Pain Link, Glyph Tax, Blood Familiar) and one witness-only signature (Void Anchor). Wave 3 adds four **design-named** specials, not yet in the enum. Wave 4 adds four more. Wave 5 adds four more. Wave 6 adds four more. Wave 7 adds four more. Wave 8 adds four more. Wave 9 adds four more. Wave 10 adds four more. Wave 11 adds four more. Wave 12 adds four more. Tactical Wave 2 (#133) supplies Wave-4 player doors. Wave 5 reuses #120 / #282 / #342. Wave 6 reuses #282 / #342. Wave 7 reuses **#282 only**. Wave 8 reuses **#411 only**. Wave 9 reuses **#463 only**. Wave 10 reuses **#525 only**. Wave 11 reuses **#563** Gait Seal / Diag Lock / Brick Shift / Return Sting. Wave 12 reuses **remaining #563** Gait Mend / Pair Hinge / Mend Wick / Body Mark. Wave 13 reuses leftover #563 Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Wave 14 reuses leftover #563 Dummy Post / Enter Mend / Split Mend **and** #636 Quiet Sill. Wave 15 reuses remaining #636 Shove Mend / Exit Sting / Cadence Stretch / Far Hood. Wave 16 reuses remaining #636 Gait Wick / Dry Sting / Home Step / Must Span. Wave 17 reuses remaining #636 Boot Lend / Purse Keep / Tick Plate / Last Mute. Wave 18 reuses remaining #636 Pair Slide and leftover #695 Both Mend / #726 Heave Mend / #787 Parched Mend. Wave 19 reuses leftover #695 Stride Keep / Damp Sting and leftover #726 Dual Keep / leftover #787 Cadence Imprint — **no new #137 ids**.

| Proposed special | Class | Player adaptation |
| :--- | :--- | :--- |
| `GRIEF_SIPHON` | `BOSS_ONLY` | — |
| `HOOK_REEL` (full-file / enrage) | `BOSS_ONLY` | Bounded #120 `spell-hook-line` |
| `PALISADE_COVER` (LOS through own stakes) | `BOSS_ONLY` | Bounded #120 `spell-stone-turret` |
| `TETHER_GATE` | `BOSS_ONLY` | — |
| `RIME_SLIDE` (full-file ice slide) | `BOSS_ONLY` | Bounded #133 `spell-rime-tile` |
| `WICK_PATTERN` (3-fuse cross) | `BOSS_ONLY` | Bounded #133 `spell-fuse-tile` |
| `CROWN_GOAD` (taunt on decoy) | `BOSS_ONLY` | Bounded #133 `spell-goad` |
| `WELL_TIDE` (radius-2 tile pull) | `BOSS_ONLY` | Bounded #133 `spell-sinkhole` |
| `WALL_RAM` (4-tile ray / wall-slam) | `BOSS_ONLY` | Bounded #120 `spell-shoulder-bash` |
| `PIT_LATTICE` | `BOSS_ONLY` | Bounded #282 `spell-open-pit` |
| `MARCH_TITHE` | `BOSS_ONLY` | Bounded #282 `spell-stride-brand` |
| `MORROW_ECHO` | `BOSS_ONLY` | Bounded #342 `spell-morrow-step` |
| `AXIS_CURFEW` (board-wide walk axis) | `BOSS_ONLY` | Bounded #282 `spell-rank-lock` |
| `FALSE_RELIQUARY` (punish-on-hit pylon) | `BOSS_ONLY` | Bounded #342 `spell-bait-pylon` |
| `CHOIR_FONT` (multi-file heal pulse) | `BOSS_ONLY` | Bounded #282 `spell-mercy-font` |
| `AUDIT_TITHE` (leftover-AP evade / brand) | `BOSS_ONLY` | Bounded #342 `spell-surplus-ward` |
| `MILL_RACE` (3-cell conveyor chain) | `BOSS_ONLY` | Bounded #282 `spell-slide-tile` |
| `FALSE_COUNTER` (swap player with decoy) | `BOSS_ONLY` | Bounded #282 `spell-pawn-trade` |
| `TRIPLE_WEDGE` (stacked facing cones) | `BOSS_ONLY` | Bounded #282 `spell-fan-bolt` |
| `TITHE_STACK` (stacked next-cast AP tax) | `BOSS_ONLY` | Bounded #282 `spell-hex-toll` |
| `NAVE_GAZE` (board facing lock / glance on the front cell) | `BOSS_ONLY` | Bounded #411 `spell-facing-pin` |
| `DOUBLE_SPAN` (rotate / 3-cell occupy) | `BOSS_ONLY` | Bounded #411 `spell-span-guard` |
| `CHOIR_COVER` (all hits to a martyr) | `BOSS_ONLY` | Bounded #411 `spell-cover-step` |
| `NAVE_LINTEL` (HP%-gated lattice) | `BOSS_ONLY` | Bounded #411 `spell-low-lintel` |
| `THRESHOLD_TITHE` (multi-cell exit-AP lattice) | `BOSS_ONLY` | Bounded #463 `spell-exit-tithe` |
| `CHOIR_HINGE` (two-cell / pet enter-swap) | `BOSS_ONLY` | Bounded #463 `spell-hinge-tile` |
| `NAVE_VEIL` (board primary-target reject) | `BOSS_ONLY` | Bounded #463 `spell-aim-veil` |
| `STEEL_CANON` (duration-2 / Strike-amp brand) | `BOSS_ONLY` | Bounded #463 `spell-oath-blade` |
| `NAVE_COLLAPSE` (5-cell delayed-pit lattice) | `BOSS_ONLY` | Bounded #525 `spell-pit-wick` |
| `CHOIR_PACE` (must-walk twice / no first-consume) | `BOSS_ONLY` | Bounded #525 `spell-must-pace` |
| `NAVE_TRISPAN` (4-post occupy / Rood director) | `BOSS_ONLY` | Bounded #525 `spell-triple-span` |
| `CHOIR_ORBIT` (pivot around Ambit / not the caster) | `BOSS_ONLY` | Bounded #525 `spell-pivot-foe` |
| `CHOIR_SOLE` (seal player + living player-side summons) | `BOSS_ONLY` | Bounded #563 `spell-gait-seal` |
| `NAVE_BIAS` (diag-lock player + living player-side summons) | `BOSS_ONLY` | Bounded #563 `spell-diag-lock` |
| `NAVE_MASONRY` (shift every barrier 1 toward the player) | `BOSS_ONLY` | Bounded #563 `spell-brick-shift` |
| `CHOIR_REBOUND` (next 3 applied hits return) | `BOSS_ONLY` | Bounded #563 `spell-return-sting` |
| `CHOIR_INFIRM` (P2: he heals if **you** walked) | `BOSS_ONLY` | Bounded #563 `spell-gait-mend` |
| `COURT_YOKE` (mass pair-hinge of every adjacent hostile pair) | `BOSS_ONLY` | Bounded #563 `spell-pair-hinge` |
| `NAVE_SALVE` (3-pad heal-wick cross) | `BOSS_ONLY` | Bounded #563 `spell-mend-wick` |
| `CHOIR_BRAND` (mark player **and** a decoy body) | `BOSS_ONLY` | Bounded #563 `spell-body-mark` |
| `CHOIR_FLUSH` (flush every living extra, then they recast) | `BOSS_ONLY` | Bounded #563 `spell-cadence-flush` |
| `CHOIR_LONE` (isolation radius 2 / bonus always if you are alone) | `BOSS_ONLY` | Bounded #563 `spell-lone-sting` |
| `NAVE_PLATE` (plate himself **and** one extra next turn) | `BOSS_ONLY` | Bounded #563 `spell-morrow-plate` |
| `CHOIR_LEND` (dump leftover AP onto every living extra) | `BOSS_ONLY` | Bounded #563 `spell-leftover-lend` |
| `CHOIR_EFFIGY` (two posts / radius-2 filter / Mannequin director) | `BOSS_ONLY` | Bounded #563 `spell-dummy-post` |
| `NAVE_THRESHOLD` (3-pad enter-heal lattice) | `BOSS_ONLY` | Bounded #563 `spell-enter-mend` |
| `CHOIR_SPLIT` (split to every living extra) | `BOSS_ONLY` | Bounded #563 `spell-split-mend` |
| `NAVE_QUIET` (3-cell Strike-forbid file) | `BOSS_ONLY` | Bounded #636 `spell-quiet-sill` |
| `CHOIR_JOSTLE` (shove every extra 1, then mend each that moved) | `BOSS_ONLY` | Bounded #636 `spell-shove-mend` |
| `NAVE_PEEL` (3-cell leave-sting file) | `BOSS_ONLY` | Bounded #636 `spell-exit-sting` |
| `CHOIR_DILATE` (stretch every remaining CD on the player) | `BOSS_ONLY` | Bounded #636 `spell-cadence-stretch` |
| `NAVE_HOOD` (hood himself **and** one extra) | `BOSS_ONLY` | Bounded #636 `spell-far-hood` |
| `CHOIR_WICK` (mark player **and** every living extra) | `BOSS_ONLY` | Bounded #636 `spell-gait-wick` |
| `NAVE_DRY` (dry-sting every player-side body at leftover 0) | `BOSS_ONLY` | Bounded #636 `spell-dry-sting` |
| `CHOIR_HEARTH` (he steps to the extra **and** the extra steps to him) | `BOSS_ONLY` | Bounded #636 `spell-home-step` |
| `NAVE_SPAN` (must-span player **and** living player-side summons) | `BOSS_ONLY` | Bounded #636 `spell-must-span` |
| `CHOIR_BOOT` (lend every living extra; independent unmoved checks) | `BOSS_ONLY` | Bounded #636 `spell-boot-lend` |
| `NAVE_KEEP` (keep himself **and** extras with leftover ≥ 1) | `BOSS_ONLY` | Bounded #636 `spell-purse-keep` |
| `NAVE_TICK` (plate himself **and** one extra) | `BOSS_ONLY` | Bounded #636 `spell-tick-plate` |
| `CHOIR_MUTE` (mute player **and** extras’ last ids) | `BOSS_ONLY` | Bounded #636 `spell-last-mute` |
| `CHOIR_SLIDE` (slide every adj hostile pair) | `BOSS_ONLY` | Bounded #636 `spell-pair-slide` |
| `CHOIR_BOTH` (both-mend every extra that walked) | `BOSS_ONLY` | Bounded #695 `spell-both-mend` |
| `NAVE_HEAVE` (self+extra translate then heave-mend) | `BOSS_ONLY` | Bounded #726 `spell-heave-mend` |
| `CHOIR_PARCHED` (parched-mend every extra at leftover MP 0) | `BOSS_ONLY` | Bounded #787 `spell-parched-mend` |
| `NAVE_STRIDE` (keep himself **and** extras with leftover MP ≥ 1) | `BOSS_ONLY` | Bounded #695 `spell-stride-keep` |
| `NAVE_DUAL` (dual-keep every extra with leftover AP ≥ 1 **and** MP ≥ 1) | `BOSS_ONLY` | Bounded #726 `spell-dual-keep` |
| `CHOIR_IMPRINT` (copy matching remaining CDs from the player onto extras) | `BOSS_ONLY` | Bounded #787 `spell-cadence-imprint` |
| `CHOIR_DAMP` (damp-sting every player-side body at leftover MP ≥ 2) | `BOSS_ONLY` | Bounded #695 `spell-damp-sting` |

Most spectacular mechanics stay boss-only on purpose.

### 5.2 Discoverable spell catalog (adaptations only)

These ids **do not exist** in `spellData.ts` yet. If a later PR adds them, each row must become a real `SpellConfig` with the metadata below — no name checks.

#### `spell-ember-step` — from `LAVA_TRAIL`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Watch Crimson Countess leave lava **3** times in one fight (or across fights; persist a counter). |
| Victory | Defeat Crimson Countess after the observation is complete. |
| Adaptation | 2-tile trail from the caster’s last walk, 2 turns, `effectType: "dot"`, `dotType: "burn"`, `targetType: "ground"`, `areaShape: "line"`, `areaRadius: 2`, AP 3. **Cannot** paint more than 2 tiles. No Phase-2 river. |
| Why not full trail | Full-path lava plus existing Thorned Ground / lava walk would farm challenge damage and brick kiting. |

#### `spell-caltrop` — from `SPIKE_ON_LAND`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Be adjacent to Bone Cavalier on the turn a spike lands, **twice**. |
| Victory | Defeat Bone Cavalier. |
| Adaptation | Place **one** spike tile, 2 turns, `effectType: "defense"`, `targetType: "ground"`, `isBarrier: false`, new flag `isSpikeGlyph: true`, AP 3, range 2. |
| Why not landing spikes | Player knight-jumps do not exist yet; a landing aura would punish summons randomly. |

#### `spell-shock-glyph` — from `SHOCK_TILES`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Stand on or adjacent to a shock tile **3** times without dying. |
| Victory | Defeat Lord of Static. |
| Adaptation | One shock tile, 3 turns, no chain. `targetType: "ground"`, AP 3, range 3. Does **not** set `chainLightningActive`. |
| Why not chain | `CHAIN_LIGHTNING` is `BOSS_ONLY`; `starter-blast` already bounces units. |

#### `spell-exsanguinate` — from `EXSANGUINATED_DEBUFF`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Receive the Exsanguinated debuff **once** (survive it). |
| Victory | Defeat the Starved Vampire Pawn. |
| Adaptation | Single-target, `effectType: "dot"`, `dotType: "bleed"`, 3 turns, `debuffStat: "healRecv"`, `debuffModifier: 0.75` (weaker than Cursed Wound’s 0.5), AP 3, range 2. No self-heal. |
| Why not vampiric AoE | `spell-lifesteal-nova` already exists. |

#### `spell-glyph-snare` — from `GLYPH_TRAP`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Trigger or disarm (step off before detonation) a Pale Archivist glyph **twice**. |
| Victory | Defeat the Pale Archivist. |
| Adaptation | Ground tile, 2 turns; next enemy that **enters** it is Slowed (`debuffStat: "mp"`, −1, 1 turn) and takes a small hit. `targetType: "ground"`. Does **not** double the next spell (`isMark` stays on `spell-mark`). |
| Why not Mark | Mark already doubles damage. A second amp would be the same spell twice. |

#### `spell-vault` — from `KNIGHT_JUMP_IGNORE_WALLS`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | New feat `cavalier_witness` **or** existing `leader_slayer` **plus** one Bone Cavalier kill. Prefer a new condition `boss_vault_seen` so it is explicit. |
| Observation | See a wall-ignoring knight jump **3** times. |
| Victory | Defeat Bone Cavalier. |
| Adaptation | Once per battle (`isTimestep`-style flag `isOncePerBattle: true`), knight-shaped blink, AP 4, `effectType: "teleport"`, `targetType: "ground"`, does **not** leave spikes. |
| Why once | Unlimited wall-ignore deletes map-gen cover. |

#### `spell-brood-ward` — from `SHELL_ARMOR`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | `spell_master` (8 spells equipped) **and** one Broodmother Rook kill. |
| Observation | Break Shell Armor by clearing larvae at least **once**. |
| Victory | Defeat Broodmother Rook. |
| Adaptation | Self buff, `buffStat: "res"`, `buffModifier: 1.25`, duration 3, **ends immediately if the caster has no living allied summon**. AP 3. Weaker than `spell-iron-skin` (1.3) because it can be maintained. |

#### `spell-aftershock` — from `RESONANCE_SHOCKWAVE`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | New feat `fortress_tuner` — take three resonance pulses in one Alabaster fight and win. |
| Observation | Three pulses survived. |
| Victory | Defeat the Alabaster Fortress. |
| Adaptation | After the caster is hit **3** times, emit a radius-1 nova (`areaShape: "circle"`, `areaRadius: 1`, 15 reference damage). Once per battle. No board shrink. |

#### `spell-rot-brand` — from `COMPOUNDING_ROT`

| Field | Value |
| :--- | :--- |
| Class | `CHALLENGE_UNLOCK` |
| Gate | Complete `legendary_1` (`no_damage_taken`) **or** `hard_1` (`no_healing_under_30_damage`) on Fetid Rook. |
| Observation | Reach 3 rot stacks on the player at least once in any Fetid fight (can be a prior death). |
| Victory | Defeat Fetid Rook with the challenge complete. |
| Adaptation | Single-target stack DoT, **max 3 stacks**, 3 dmg/turn reference, `dotType: "venom"`, AP 3. No twin-rook split. |

#### `spell-echo-cast` — from `COMBO_REPLAY`

| Field | Value |
| :--- | :--- |
| Class | `CHALLENGE_UNLOCK` |
| Gate | Complete `legendary_3` (`direct_hit`) on Mirror Sovereign. |
| Observation | Be hit by a replayed combo **once**. |
| Victory | Defeat Mirror Sovereign with `direct_hit` still valid. |
| Adaptation | Next spell the caster owns is recast at **50%** damage / heal, once per battle, AP 4. Cannot echo summons, `spell-timestep`, or `spell-sacrifice`. Explicit denylist in metadata (`echoDenyIds`). |

### 5.3 Proposed feat conditions (not seeded)

These are names for a later achievement PR. They are **not** in `defaultAchievements()` today.

| Proposed id | Condition key | Intent |
| :--- | :--- | :--- |
| `cavalier_witness` | `boss_vault_seen` | Saw wall-jump 3× and won Cavalier. |
| `fortress_tuner` | `resonance_three_pulses` | Three pulses + Alabaster win. |
| `rot_ascetic` | (reuse challenge persist) | Challenge unlock, not a feat. |
| `echo_duelist` | (reuse `legendary_3` on that boss) | Challenge unlock. |
| `anchor_breaker` | `void_anchors_eight` | Optional mastery for Enthroned Void. |
| `ghost_warden` | `final_pawn_no_ghost_wipe` | Optional mastery for Final Pawn. |
| `rime_skater` | `rime_zero_slides` | Optional mastery for Rime Margrave (never ice-slid). |
| `wick_douser` | `fuse_snuffer_before_tick` | Optional mastery for Wick Prelate. |
| `unmasked_pretender` | `goad_never_hit_decoy` | Optional mastery for Goad Pretender. |
| `well_walker` | `sinkhole_zero_pulls` | Optional mastery for Sinkhole Dowager. |
| `ram_unmoved` | `ram_zero_slams` | Optional mastery for Ram Castellan (never wall-slammed). |
| `fosse_dry` | `pit_zero_steps` | Optional mastery for Fosse Warden (never walk-attempt a pit). |
| `stride_still` | `stride_zero_walk_mp` | Optional mastery for Stride Censor (0 walk MP spent). |
| `morrow_unvisited` | `morrow_zero_landings` | Optional mastery for Morrow Herald (never occupy a painted tile). |
| `lock_cardinal` | `rank_lock_zero_illegal_walks` | Optional mastery for Lock Marshal (never attempt an off-axis walk). |
| `unfooled_vicar` | `bait_zero_pylon_hits` | Optional mastery for Bait Vicar (never damage the pylon). |
| `font_breaker` | `choir_font_destroyed_before_second_pulse` | Optional mastery for Font Abbess (kill the font before its second pulse). |
| `spent_auditor` | `surplus_zero_leftover_ap` | Optional mastery for Surplus Auditor (never end a player turn with ≥ 2 leftover AP). |
| `mill_unslid` | `mill_zero_enters` | Optional mastery for Mill Seneschal (never enter a mill cell). |
| `pair_unbroken` | `pawn_trade_zero_swaps` | Optional mastery for Counter Chaplain (never have two player-side bodies swapped). |
| `wedge_sidestep` | `fan_zero_hits` | Optional mastery for Wedge Prior (never take a cone hit). |
| `levy_unbranded` | `hex_toll_zero_inflated_casts` | Optional mastery for Levy Rector (never pay an inflated spell cost). |
| `gaze_averted` | `facing_pin_zero_locked_turns` | Optional mastery for Gaze Beadle (never end a turn with facing pinned). |
| `span_unoccupied` | `span_zero_second_cell_hits` | Optional mastery for Span Chamberlain (never occupy, or be hit from, the extra cell). |
| `cover_unshared` | `cover_zero_redirects` | Optional mastery for Cover Hospitaller (never have a hit redirect off you). |
| `lintel_high` | `lintel_zero_crawls` | Optional mastery for Lintel Sacrist (never walk a lintel cell). |
| `stoop_unleft` | `exit_tithe_zero_leaves` | Optional mastery for Toll Ostiary (never *leave* a tithe cell). |
| `peg_unentered` | `hinge_zero_enters` | Optional mastery for Hinge Precentor (never enter a hinge tile). |
| `cowl_unaimed` | `aim_veil_zero_primary_rejects` | Optional mastery for Veil Verger (never have a primary spell reject on him). |
| `oath_unbranded` | `oath_zero_fizzles` | Optional mastery for Oath Dean (never fizzle a non-Strike under the brand). |
| `crypt_unopened` | `pit_wick_zero_converts_underfoot` | Optional mastery for Crypt Sexton (never occupy a wick at convert). |
| `pace_unfizzled` | `must_pace_zero_fizzles` | Optional mastery for March Prefect (never fizzle a spell under Must Pace). |
| `rood_unoccupied` | `triple_span_zero_post_cells` | Optional mastery for Aisle Canon (never occupy a post cell). |
| `ambit_unpivoted` | `pivot_foe_zero_moves` | Optional mastery for Orbit Succentor (never be pivoted). |
| `sole_unstepped` | `gait_seal_zero_walk_attempts` | Optional mastery for Sole Thurifer (never attempt walk MP under seal). |
| `bias_cardinal_free` | `diag_lock_zero_cardinal_walks` | Optional mastery for Bias Prebendary (never attempt a cardinal walk under lock). |
| `brick_unoccupied_dest` | `brick_shift_zero_dest_occupies` | Optional mastery for Brick Cellarer (never occupy a brick dest cell). |
| `alms_unconsumed` | `return_sting_zero_consumes` | Optional mastery for Rebound Almoner (never consume Return Sting). |
| `infirm_unpaid` | `gait_mend_zero_boss_heals` | Optional mastery for Infirm Chanter (he never successfully Gait Mends). |
| `yoke_unspun` | `pair_hinge_zero_player_moves` | Optional mastery for Yoke Subchanter (never be one of the two rotated bodies). |
| `salve_unsipped` | `mend_wick_zero_ticks_on_you` | Optional mastery for Salve Wicker (never occupy a pad at tick). |
| `brand_unamped` | `body_mark_zero_amped_hits` | Optional mastery for Brand Curate (never take an amped hit while marked). |
| `flush_unspent` | `cadence_flush_zero_success` | Optional mastery for Flush Psalmist (he never zeroes a remaining CD). |
| `lone_clustered` | `lone_sting_zero_isolation_bonus` | Optional mastery for Lone Lector (never take the isolated +8). |
| `plate_unarmored` | `morrow_plate_zero_absorbed` | Optional mastery for Plate Bursar (he never absorbs > 0 from your hits). |
| `lend_unfunded` | `leftover_lend_zero_n` | Optional mastery for Lend Proctor (he never lends `n > 0`). |
| `effigy_unposted` | `dummy_post_zero_plants` | Optional mastery for Effigy Clerk (he never successfully plants a living Dummy Post). |
| `narthex_stolen` | `enter_mend_zero_boss_heals` | Optional mastery for Enter Deacon (you or a player-side summon claim every enter-heal). |
| `pyx_isolated` | `split_mend_zero_shared` | Optional mastery for Split Acolyte (every mend found no adjacent ally). |
| `muffler_offstep` | `quiet_sill_zero_occupied_resolves` | Optional mastery for Quiet Chorister (never occupy a Quiet Sill when you resolve a damaging id). |
| `stole_unmoved` | `shove_mend_zero_heals` | Optional mastery for Jostle Subdeacon (he never successfully heals 8 from a force-moved extra). |
| `stoup_unleft` | `exit_sting_zero_leaves` | Optional mastery for Peel Friar (never *leave* a live Exit Sting cell). |
| `antiphon_unstretched` | `cadence_stretch_zero_success` | Optional mastery for Dilate Organist (he never doubles a remaining CD ≥ 1). |
| `capuche_closed` | `far_hood_zero_far_consumes` | Optional mastery for Hood Recluse (never let a Chebyshev ≥ 3 hit consume Far Hood — walk in to 2, or break the Capuche). |
| `cresset_unstepped` | `gait_wick_zero_walk_detonates` | Optional mastery for Wick Exorcist (never detonate Gait Wick by spending walk MP). |
| `cruet_wet` | `dry_sting_zero_bonus` | Optional mastery for Dry Nuncio (never take the leftover-0 +8). |
| `andiron_unjoined` | `home_step_zero_joins` | Optional mastery for Hearth Legate (he never successfully Home Steps). |
| `ell_honest` | `must_span_zero_illegal_walks` | Optional mastery for Must Preceptor (never start a walk that is not Manhattan 2 under the brand). |
| `caliga_unfunded` | `boot_lend_zero_mp_gifts` | Optional mastery for Boot Subprior (the extra never receives +1 MP). |
| `cista_empty` | `purse_keep_zero_banked` | Optional mastery for Purse Steward (he never banks leftover > 0). |
| `plaster_bitten` | `tick_plate_zero_consumes` | Optional mastery for Tick Infirmarer (never let Tick Plate consume a DoT tick). |
| `tabula_unsigned` | `last_mute_zero_refuses` | Optional mastery for Mute Notary (never have a spell id refused by Last Mute). |
| `litter_unmoved` | `pair_slide_zero_player_moves` | Optional mastery for Slide Porter (never be one of the two translated bodies). |
| `gaiter_unspent` | `both_mend_zero_boss_heals` | Optional mastery for Both Capitular (he never successfully Both Mends 8). |
| `spit_unturned` | `heave_mend_zero_boss_heals` | Optional mastery for Heave Kitchener (he never successfully Heave Mends 8). |
| `flagon_wet` | `parched_mend_zero_boss_heals` | Optional mastery for Parched Preacher (he never successfully Parched Mends 8). |
| `scrip_spent` | `stride_keep_zero_banked` | Optional mastery for Stride Chancellor (he never banks leftover MP ≥ 1). |
| `bourse_spent` | `dual_keep_zero_both_banked` | Optional mastery for Dual Treasurer (he never banks both leftovers ≥ 1). |
| `platen_unprinted` | `cadence_imprint_zero_copies` | Optional mastery for Imprint Archdeacon (he never copies a remaining ≥ 1). |
| `sump_dry` | `damp_sting_zero_bonus` | Optional mastery for Damp Provost (never take the leftover-MP ≥ 2 +10). |

Do not mint Doka from these until `claimAchievementReward` is wired. Suggested feat Doka: 150–300, in line with `leader_slayer` / `critical_striker`.

### 5.4 Sibling contracts (2026-10-26)

Same-week design PRs own adjacent surfaces. This bible does not rewrite them.

| Sibling | Owns | How this bible attaches |
| :--- | :--- | :--- |
| #156 `SPELL_DISCOVERY_ECOSYSTEM` | Default pipeline: hostile **uses** an eligible id → OBSERVED → player **wins that battle** → unlock. Encounter start is not observation. Being hit is not required. | Kit-spell observation (when starters stop being innate) uses that default. **Boss-adaptation count-gates in §5.2 stay** (`see lava 3×`). #156 §3.3 allows count-gates on boss adaptations only. |
| #120 `SPELL_PROPOSALS` (2026-08-31) | 16 tactical ids (`spell-shoulder-bash` … `spell-void-anchor`) | Do **not** invent a second id for the same fantasy. Wave 3 observation sources point at #120 ids. Wave 5 Ram extra-doors **Shoulder Bash**. |
| Tactical Wave 2 (`SPELL_PROPOSALS_2026-09-01.md`) | 16 more ids (`spell-file-lance` … `spell-life-tether`) | Wave 4 extra doors **and** Cinder / Midnight grants reuse these ids. Do not mint `#137-b` aliases. |
| Tactical Wave 3 (`SPELL_PROPOSALS_2026-09-02.md`, #282) | `spell-ley-toll` … `spell-board-tilt` | Do **not** reuse those ids as #137 aliases. `spell-slide-tile` is conveyor, not Margrave ice — Wave 7 Mill extra-doors it. `spell-board-tilt` is `NOT_PLAYER_LEARNABLE` mass shove — not Ram (Ram’s player door is Shoulder Bash) and not Wedge. Wave 5 Fosse / Stride extra-door Open Pit / Stride Brand. Wave 6 Lock extra-doors Rank Lock; Font extra-doors Mercy Font. Wave 7 extra-doors Slide Tile / Pawn Trade / Fan Bolt / Hex Toll. |
| Tactical Wave 4 (open #342, `SPELL_PROPOSALS_2026-09-21.md`) | `spell-gale-fan` … `spell-eclipse-fold` | Do **not** reuse those ids. Gale Fan is cone+push on packs — **not** Ram’s grant and **not** Wedge’s grant (Fan Bolt is the 90° wedge with **no** push). Twin Gate already stamps `void_grandmaster`. Cut In / After Verse / Sanguine Toll / Draw Together / Eclipse Fold are #342 `BOSS` doors on **shipped** ids — roster notes only. Morrow extra-doors `spell-morrow-step`. Wave 6 Bait extra-doors Bait Pylon; Auditor extra-doors Surplus Ward. |
| Tactical Wave 5 (open #411, `SPELL_PROPOSALS_2026-09-22.md`) | `spell-oncoming` … `spell-act-bell` | Wave 8 extra-doors Facing Pin / Span Guard / Cover Step / Low Lintel. Do **not** extra-door Oncoming / Glance Cut / Mute Thread / Queue Cut / File Vault / False Cut from Wave-8 sheets — #411 already stamps Mute Thread on Weeping, Queue Cut on Eternal, File Vault MULTI on Enthroned Void; False Cut stays Lament kit-only. Cover Step is **not** Bait. Span Guard is **not** Twin Span (#463). |
| Tactical Wave 6 (open #463, `SPELL_PROPOSALS_2026-09-23.md`) | `spell-post-sting` … `spell-about-face` | Wave 9 extra-doors Exit Tithe / Hinge Tile / Aim Veil / Oath Blade. Do **not** extra-door Post Sting / Purse Cut / Blind Corner / Hinge Step / File Reel / Twin Span / Cadence Break / Cadence Lend / Split Purse / Spark Whelp / Turn Cap / About Face from these sheets. Twin Span stays ELITE independently-walking posts. About Face stays `NOT_PLAYER_LEARNABLE`. #463 stubs `exit_mason` / `hinge_porter` / `oath_censor` / `about_regent` are **not** these encounter ids — first grant wins if those stubs ship. |
| Tactical Wave 7 (open #525, `SPELL_PROPOSALS_2026-09-24.md`) | `spell-wall-sting` … `spell-court-shove` | Wave 10 extra-doors Pit Wick / Must Pace / Triple Span / Pivot Foe. Do **not** extra-door Wall Sting / File Brand / Boot Sting / Shove Face / Knight Slip / Cadence Crack / Once Verse / Tick Hood / Flank Share / Spare Pace / Exit Boon / Court Shove from these sheets. Court Shove stays `NOT_PLAYER_LEARNABLE`. #525 stubs `wick_mason` / `pace_prelate` / `span_triune` / `slip_castellan` are **not** these encounter ids — first grant wins if those stubs ship. |
| Tactical Wave 8 (open #563, `SPELL_PROPOSALS_2026-09-25.md`) | `spell-gait-mend` … `spell-court-hinge` | Wave 11 extra-doors Gait Seal / Diag Lock / Brick Shift / Return Sting. Wave 12 extra-doors **remaining** Gait Mend / Pair Hinge / Mend Wick / Body Mark. Wave 13 extra-doors leftover Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Wave 14 extra-doors leftover Dummy Post / Enter Mend / Split Mend. Court Hinge stays `NOT_PLAYER_LEARNABLE` and is **not** a Wave-14 door. Dummy Post is **not** Goad / Bait. Enter Mend is **not** Font / Mend Wick / Gait Mend. Split Mend is **not** Rally / Flank Share. #563 stub `dummy_castellan` is **not** remapped to `effigy_clerk`; `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` stay earlier doors — first grant wins if those stubs ship. |
| Tactical Wave 9 (open #636, `SPELL_PROPOSALS_2026-09-26.md`) | `spell-shove-mend` … `spell-court-stretch` | Wave 14 extra-doors **Quiet Sill only**. Wave 15 extra-doors remaining **Shove Mend / Exit Sting / Cadence Stretch / Far Hood**. Wave 16 extra-doors remaining **Gait Wick / Dry Sting / Home Step / Must Span**. Wave 17 extra-doors remaining **Boot Lend / Purse Keep / Tick Plate / Last Mute**. Wave 18 extra-doors remaining **Pair Slide**. Do **not** extra-door remaining #636 ids (`spell-quad-span` / `spell-court-stretch`) from Wave-18 sheets. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. Pair Slide dests onto lava / spike / rime / wick stay illegal AI until MIMA-001 / 005 (same law as Pair Hinge / Yoke); P0 pairs with Peel because Exit Sting is **paint**. Pair Slide is **not** Pair Hinge / Pawn Trade / Slide Tile / Draw Together (translate 1, occupancy dests, **not** `isSwap`). Gait Wick is **not** Boot Sting / Post Sting / Fuse / Pit Wick (next *walk MP*, not already-walked / tile clock). Dry Sting is **not** Empty Plate / Purse Cut / Post Sting / Lone Sting (leftover AP = 0 bonus, not RES / economy / unmoved / isolation). Home Step is **not** Hinge Step / Morrow Step / Cover Step / Swap (caster dest-pick to ally adj, **not** `isSwap`). Must Span is **not** Must Pace / Rank Lock / Diag Lock (Manhattan **exactly 2**, not “must walk to cast” / axis / diagonal). #636 stubs `shove_cantor` / `stretch_precentor` are **not** remapped to `jostle_subdeacon` / `dilate_organist`; `span_quad` / `keep_bursar` / `court_stretch_regent` stay earlier / closed doors — first grant wins if those stubs ship. Pair Slide / Gait Wick / Dry Sting / Home Step / Must Span / Boot Lend / Tick Plate / Last Mute have **no** stub. `keep_bursar` is Purse Keep’s MULTI child — **not** remapped to `purse_steward`. `pair_usher` is Pair Hinge’s MULTI child — **not** remapped to `slide_porter`. |
| Tactical Wave 10 (open #695, `SPELL_PROPOSALS_2026-09-27.md`) | `spell-both-mend` … `spell-court-keep` | Wave 18 extra-doors **Both Mend**. Wave 19 extra-doors leftover **Stride Keep / Damp Sting**. Do **not** extra-door remaining #695 ids (`spell-penta-span` … `spell-court-keep`, except Damp Sting already extra-doored) from Wave-19 sheets. Court Keep stays `NOT_PLAYER_LEARNABLE`. Penta Span stays off until occupy-weight exists. Stride Keep is **not** Purse Keep / Dual Keep / Haste / Timestep / Pack Stride (leftover *walk MP* cap 2, next-start pay). Damp Sting is **not** Dry Sting / Ready Sting / Lean Sting / Dry Gait (leftover *walk MP ≥ 2* bonus, not leftover AP = 0 / both currencies / leftover AP = 0 and MP ≥ 1). #695 stub `both_cantor` is **not** remapped to `both_capitular`; `stride_bursar` is **not** remapped to `stride_chancellor`. Damp Sting has **no** stub. First grant wins if a stub ships. |
| Tactical Wave 11 (open #726, `SPELL_PROPOSALS_2026-09-28.md`) | `spell-heave-mend` … `spell-court-dual` | Wave 18 extra-doors **Heave Mend**. Wave 19 extra-doors leftover **Dual Keep**. Do **not** extra-door remaining #726 ids (`spell-sept-span` … `spell-court-dual`, except Dual Keep) from Wave-19 sheets. Court Dual stays `NOT_PLAYER_LEARNABLE`. Sept Span stays off until occupy-weight exists. Dual Keep is **not** Purse Keep / Stride Keep / Timestep / Leftover Lend (both currencies, next-start pay). Heave Mend is **not** Shove Mend / Both Mend / Heave Step (both *force-moved* heal, not target-only / both-walked / self-relocate). #726 stub `heave_cantor` is **not** remapped to `heave_kitchener`; `dual_bursar` is **not** remapped to `dual_treasurer`. First grant wins if a stub ships. |
| Tactical Wave 12 (open #787, `SPELL_PROPOSALS_2026-09-29.md`) | `spell-parched-mend` … `spell-court-imprint` | Wave 18 extra-doors **Parched Mend**. Wave 19 extra-doors leftover **Cadence Imprint**. Do **not** extra-door remaining #787 ids (`spell-six-span` … `spell-court-imprint`, except Cadence Imprint) from Wave-19 sheets. Court Imprint stays `NOT_PLAYER_LEARNABLE`. Six Span stays off until occupy-weight exists. Cadence Imprint is **not** Theft / Halve / Trim / Stretch / Flush / Last Mute (copy matching remaining onto the caster; target keeps). Parched Mend is **not** Dry Mend / Still Mend / Dry Sting / Both Mend (both leftover *MP* = 0 heal). #802 Dry Gait owns the leftover-MP=0 hole on a later catalog (#1063 says do not *clone* Parched Mend) — first grant wins; do **not** remap `parched_cantor` to a Dry Gait encounter. #787 stub `parched_cantor` is **not** remapped to `parched_preacher`; `imprint_precentor` is **not** remapped to `imprint_archdeacon`. |
| Tactical Wave 13 (open #849, `SPELL_PROPOSALS_2026-10-21.md`) | `spell-gaunt-mend` … `spell-court-lag` | Do **not** extra-door those ids from Wave-15 / Wave-16 / Wave-17 / Wave-18 / Wave-19 sheets. Court Lag stays `NOT_PLAYER_LEARNABLE`. Leftover #695 Stride Keep / Damp Sting are exhausted this pass — next leftover door is leftover #695 Cadence Trim (not Court Keep; skip Penta Span until occupy-weight), then leftover #726 Ready Sting / leftover #787 Lean Sting, **not** #849. |
| Tactical Wave 17 (open #1063, `SPELL_PROPOSALS_2026-10-25.md`) | `spell-orth-stride` … `spell-reach-fold` | Same-week catalog. Do **not** extra-door those unique ids from Wave-18 / Wave-19 sheets. Dry Gait (`spell-dry-gait`, leftover #802) is a first-grant rival of Parched Mend, not a Wave-18 or Wave-19 door. |
| #116 Spell Admin | Persist `ownedSpellIds` / `observedSpellIds`, soft-retire | Observation counters in §5.2 belong next to `achievementProgress`, not `localStorage`. |
| Long Horizon 2026-09-01 | Live formulas still leave boss HP static; HUD XP saturates at 48 | Confirms §3.1 is still the unbuilt no-cap fix. Do not “fix” XP curve from this doc. |
| MIMA 2026-09-21 (#336) | Swap × hazards, push/pull × hazards still OPEN; new Dawn-MP / modifier-HP items | Wave-4/5 **position** may ship; hazard ticks on forced move wait on MIMA-001 / 005. Do not pair Ram / Mill with pits until 005. Pawn Trade landing ticks wait on 001. |
| Encounter Evolution 2026-09-01 / 2026-09-21 | ENC-BOSS-02 / ENC-RUSH-04… remix **existing** rooms | Table B / Table C / Table D / Table E / Table F / Table G / Table H / Table I / Table J / Table K / Table L / Table M / Table N / Table O / Table P / Table Q are **new** post-clear tables, not a rewrite of those remixes. |

**Default vs boss-adaptation observation**

| Route | What “observed” means | Victory |
| :--- | :--- | :--- |
| #156 `ENEMY_DISCOVERY` | Hostile spent AP on that **spell id** (`kind: "cast"`). One use. | Same encounter (unless `allowLaterVictory`) |
| #137 `PLAYER_LEARNABLE` adaptations in §5.2 | Named count-gate on a **boss special** (trail, spike land, shock tile, …), not necessarily a kit-spell cast | Defeat that boss after the count |
| #120 / #133 `BOSS` (`observation` default **false**) | First victory vs listed `bossIds` | That boss defeat. No count-gate. |
| #120 / #133 extra `MULTI_SOURCE` doors | Hostile **use** of that id **or** first victory vs added `bossIds` | First grant wins |
| #137 `ACHIEVEMENT_UNLOCK` / `CHALLENGE_UNLOCK` | Feat condition or live `DEFAULT_CHALLENGES` id on that fight | Feat claim / challenge persist |

A boss may grant **both** a #137 adaptation and a #120 / #133 `BOSS` (or extra-door) id. They are separate grants. First victory can award the sibling id while the #137 count-gate is still incomplete.

**Id collision — do not ship aliases**

| #137 (this bible) | #120 | Verdict |
| :--- | :--- | :--- |
| `spell-ember-step` | `spell-cinder-tile` | **Keep both.** Cinder Tile = one painted burn cell. Ember Step = 2-tile walk trail. Different verbs. |
| `spell-caltrop` | `spell-tripwire` | **Keep both.** Caltrop = visible one-tile spike. Tripwire = hidden enter-trap + root. |
| `spell-glyph-snare` | `spell-glyph-tax` / `spell-root-snare` | **Keep all three.** Snare = enter-slow one tile. Tax = 3×3 AP zone + Mark. Root = unit MP lock. |
| `spell-shock-glyph` | — | No #120 twin. Keep. |
| `spell-exsanguinate` | — | No #120 twin. Keep. |
| `spell-vault` | `spell-mist-step` | **Keep both.** Vault = once/battle knight-shaped blink through walls. Mist Step = 3-tile self-teleport, CD 2, no walls. |
| `spell-brood-ward` / `spell-aftershock` / `spell-rot-brand` / `spell-echo-cast` | — | No #120 twin. Keep. |
| — | `spell-pain-link` | First victory vs `alabaster_fortress` (#120 `BOSS`). Aftershock remains the #137 feat. |
| — | `spell-glyph-tax` | First victory vs `pale_archivist`. Glyph-snare remains the #137 count-gate. |
| — | `spell-blood-familiar` | First victory vs `starved_vampire_pawn`. Exsanguinate remains the #137 count-gate. |
| — | `spell-void-anchor` | `NOT_PLAYER_LEARNABLE`. Witness on `void_grandmaster` only. |
| — | `spell-hook-line` / `spell-stone-turret` | Wave 3 adds `bossIds` as extra `MULTI_SOURCE` doors. First grant wins. |
| — | `spell-file-lance` | Wave 2 Cinder extra door. Full-file / crossing enrage lances stay `BOSS_ONLY`. |
| — | `spell-life-tether` | #133 `BOSS` already lists `midnight_bishop`. This bible now matches that card. Shared-HP twins stay `BOSS_ONLY`; the player spell is breakable and 50/50. |
| — | `spell-rime-tile` / `spell-fuse-tile` / `spell-goad` / `spell-sinkhole` | Wave 4 extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` doors. Spectacular versions (`RIME_SLIDE`, `WICK_PATTERN`, `CROWN_GOAD`, `WELL_TIDE`) stay `BOSS_ONLY`. |
| `RIME_SLIDE` (boss special) | #282 `spell-slide-tile` | **Keep both.** Slide Tile = one conveyor cell, enter-only, distance 1. Margrave gutter = full-file ice + 2-tile forced move. Wave 7 Mill extra-doors Slide Tile; `MILL_RACE` (3-cell chain) stays `BOSS_ONLY`. |
| `WELL_TIDE` (boss special) | #282 `spell-board-tilt` | **Keep both closed to the player.** Board Tilt is already `NOT_PLAYER_LEARNABLE`. Well Tide is the Dowager director. Player door is Sinkhole only. |
| `spell-ember-step` | `spell-rime-tile` / `spell-cinder-tile` | **Keep all three.** Ember = 2-tile burn walk. Cinder = one burn cell. Rime = ice MP tax, 0 HP. |
| — | `spell-shoulder-bash` | Wave 5 Ram extra door. Full-file / wall-slam ram stays `BOSS_ONLY`. |
| — | `spell-open-pit` / `spell-stride-brand` | Wave 5 Fosse / Stride extra doors. Lattice / board-wide tithe stay `BOSS_ONLY`. |
| — | `spell-morrow-step` | Wave 5 Morrow extra door. Echo leftover + same-turn resolve stay `BOSS_ONLY`. |
| — | `spell-rank-lock` | Wave 6 Lock extra door. Board-wide `AXIS_CURFEW` stays `BOSS_ONLY`. Player Rank Lock is one target, 2 turns, walk-only (forced move still legal). |
| — | `spell-bait-pylon` | Wave 6 Bait extra door. `FALSE_RELIQUARY` (Strike/AoE on the pylon reflects) stays `BOSS_ONLY`. Player pylon only intercepts the next hostile **spell** aimed at the owner. |
| — | `spell-mercy-font` | Wave 6 Font extra door (`ACHIEVEMENT` `loot_hunter` **or** this boss — first grant wins). `CHOIR_FONT` multi-file pulse stays `BOSS_ONLY`. Player font is one totem, `spell-font-pulse` kit. |
| — | `spell-surplus-ward` | Wave 6 Auditor extra door (`ACHIEVEMENT` `doka_hoarder` **or** this boss — first grant wins). `AUDIT_TITHE` leftover brand stays `BOSS_ONLY`. Player Surplus Ward is self evade if leftover AP ≥ 2 after pay. |
| — | `spell-gale-fan` | #342 pack ENEMY_DISCOVERY. **Not** Ram’s grant (Shoulder Bash is the one-body shove). |
| — | `spell-twin-gate` | #282 `BOSS` already lists `void_grandmaster`. Morrow is delayed self-blink, not a pad pair. |
| — | `spell-cut-in` / `spell-after-verse` / `spell-sanguine-toll` / `spell-draw-together` | #342 `BOSS` / MULTI on **shipped** Queen / Archivist / Starved / Static. Do not re-stamp. After Verse ≠ Echo Cast. |
| — | `spell-eclipse-fold` | #342 `NOT_PLAYER_LEARNABLE` on Final Pawn kit. Witness only. |
| `WALL_RAM` (boss special) | #282 `spell-board-tilt` | **Keep both closed.** Board Tilt is mass shove of all bodies. Ram is one telegraphed ray + wall-slam. Player door is Shoulder Bash. |
| — | `spell-slide-tile` | Wave 7 Mill extra door. `MILL_RACE` (3-cell mill / hopper director / chain) stays `BOSS_ONLY`. Player Slide Tile is one cell, 3 turns, enter-only, distance 1. |
| — | `spell-pawn-trade` | Wave 7 Counter extra door. `FALSE_COUNTER` (decoy body / player↔decoy) stays `BOSS_ONLY`. Player Pawn Trade is two hostiles, caster stays, radius 3, no decoy. |
| — | `spell-fan-bolt` | Wave 7 Wedge extra door. `TRIPLE_WEDGE` (stacked cones / facing lock) stays `BOSS_ONLY`. Player Fan Bolt is one 90° wedge, 0 push. Do **not** also grant `spell-gale-fan`. |
| — | `spell-hex-toll` | Wave 7 Levy extra door. `TITHE_STACK` (stacked tax / inflated 4+ costs) stays `BOSS_ONLY`. Player Hex Toll is +1 AP on the next spell, 2 turns, no stack. Glyph Tax stays Archivist. |
| — | `spell-facing-pin` | Wave 8 Gaze extra door. `NAVE_GAZE` (board-wide pin / glance on the front cell / Crosier director) stays `BOSS_ONLY`. Player Facing Pin is one target, 2 turns, one literal. Do **not** also grant `spell-oncoming` or `spell-glance-cut`. |
| — | `spell-span-guard` | Wave 8 Span extra door. `DOUBLE_SPAN` (rotate extra cell / 3-cell occupy / Truss director) stays `BOSS_ONLY`. Player Span Guard is origin + one adjacent, 2 turns, rigid (both cells move together if the caster walks). Do **not** grant Twin Span (#463) or Span Pylon (ELITE). |
| — | `spell-cover-step` | Wave 8 Cover extra door. `CHOIR_COVER` (all hits to the martyr / no adjacency / Bier director) stays `BOSS_ONLY`. Player Cover Step is the next hit only, adjacent ally required. Do **not** grant Bait Pylon, Mirror, or Pain Link from this fight. |
| — | `spell-low-lintel` | Wave 8 Lintel extra door. `NAVE_LINTEL` (5-cell lattice / Transom director) stays `BOSS_ONLY`. Player Low Lintel is one cell, 2 turns, HP% ≤ 50. Open Pit stays Fosse. |
| — | `spell-mute-thread` / `spell-queue-cut` / `spell-file-vault` | #411 `BOSS` / MULTI on **shipped** Weeping / Eternal / Enthroned Void. Roster notes only. Do not re-stamp. False Cut stays Lament kit-only. |
| — | `spell-oncoming` / `spell-glance-cut` / `spell-act-tax` / `spell-act-bell` | #411 Wave-5 pack / remaining doors. **Not** Wave-8 grants. |
| — | `spell-exit-tithe` | Wave 9 Toll extra door. `THRESHOLD_TITHE` (5-cell leave-tax / Stoop director) stays `BOSS_ONLY`. Player Exit Tithe is one cell, 2 turns, +1 AP on *voluntary walk leave*. Forced-move exits free. Glyph Tax stays Archivist. Hex Toll stays Levy. |
| — | `spell-hinge-tile` | Wave 9 Hinge extra door. `CHOIR_HINGE` (two painted cells / pet-swap / Peg director) stays `BOSS_ONLY`. Player Hinge Tile is one cell, 2 turns, one enter-swap with the *painter*. Do **not** grant Hinge Step, Pawn Trade, Swap, or Twin Gate from this fight. |
| — | `spell-aim-veil` | Wave 9 Veil extra door. `NAVE_VEIL` (board primary-reject / Cowl director) stays `BOSS_ONLY`. Player Aim Veil is self, 1 round, primary-target reject only. AoE / Strike still land. Do **not** grant Bait, Cover, or Goad from this fight. |
| — | `spell-oath-blade` | Wave 9 Oath extra door (`BOSS`; #463 already listed stub `oath_censor` — first grant wins). `STEEL_CANON` (duration 2 / next Strike +40% / Paten director) stays `BOSS_ONLY`. Player Oath Blade is 1 of their turns, `id === "physical_attack"` only. Do **not** grant Mute Thread or Hex of Silence. |
| — | `spell-hinge-step` / `spell-file-reel` / `spell-twin-span` / `spell-about-face` | #463 remaining. **Not** Wave-9 grants. `hinge_porter` is Hinge Step’s MULTI child, not this Precentor. About Face stays `NOT_PLAYER_LEARNABLE`. Twin Span stays ELITE independently-walking posts. |
| — | `spell-pit-wick` | Wave 10 Crypt extra door. `NAVE_COLLAPSE` (5-cell delayed lattice / Grate director) stays `BOSS_ONLY`. Player Pit Wick is one cell, 1-turn wick + 2-turn pit, LoS open. Open Pit stays Fosse. Fuse Tile stays Wick Prelate. #525 stub `wick_mason` is a first-grant rival, not this id. |
| — | `spell-must-pace` | Wave 10 March extra door (`BOSS`; #525 already listed stub `pace_prelate` — first grant wins). `CHOIR_PACE` (does not consume on first success / Pulpit director) stays `BOSS_ONLY`. Player Must Pace is 2 turns **or** 1 consumed spell attempt. Forced-move is not walk MP. Do **not** grant Stride Brand, Stride Mute, Oath Blade, or Gait Seal. |
| — | `spell-triple-span` | Wave 10 Aisle extra door (`ELITE`; #525 stub `span_triune` — first grant wins). `NAVE_TRISPAN` (4-post occupy / Rood director) stays `BOSS_ONLY`. Player Triple Span is three 1-HP posts, cardinal line of 3, chain walk filter. Do **not** grant Span Guard, Twin Span, or Span Pylon. |
| — | `spell-pivot-foe` | Wave 10 Orbit extra door. `CHOIR_ORBIT` (pivot around Ambit, not the caster / Ambit director) stays `BOSS_ONLY`. Player Pivot Foe is 90° clockwise around the **caster**, dest must be `isCellFree`, occupancy teleport not `isSwap`. Do **not** grant Hinge Tile, Hinge Step, Pawn Trade, Pair Hinge, or Court Hinge. |
| — | `spell-wall-sting` / `spell-file-brand` / `spell-boot-sting` / `spell-shove-face` / `spell-knight-slip` / `spell-cadence-crack` / `spell-once-verse` / `spell-tick-hood` / `spell-flank-share` / `spell-spare-pace` / `spell-exit-boon` / `spell-court-shove` | #525 remaining. **Not** Wave-10 grants. Court Shove stays `NOT_PLAYER_LEARNABLE`. `slip_castellan` stays Knight Slip’s MULTI child, not Cavalier and not Orbit. |
| — | `spell-gait-seal` / `spell-diag-lock` / `spell-brick-shift` / `spell-return-sting` | Wave 11 extra doors. `CHOIR_SOLE` / `NAVE_BIAS` / `NAVE_MASONRY` / `CHOIR_REBOUND` stay `BOSS_ONLY`. |
| — | `spell-gait-mend` / `spell-pair-hinge` / `spell-mend-wick` / `spell-body-mark` | Wave 12 extra doors. `CHOIR_INFIRM` / `COURT_YOKE` / `NAVE_SALVE` / `CHOIR_BRAND` stay `BOSS_ONLY`. |
| — | `spell-cadence-flush` / `spell-lone-sting` / `spell-morrow-plate` / `spell-leftover-lend` | Wave 13 extra doors. `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` stay `BOSS_ONLY`. |
| — | `spell-dummy-post` | Wave 14 Effigy extra door (`ELITE`; #563 stub `dummy_castellan` — first grant wins). `CHOIR_EFFIGY` (two posts / radius-2 / Mannequin director) stays `BOSS_ONLY`. Player Dummy Post is one 1-HP empty-kit pawn, lifespan 3, Chebyshev ≤ 1 damaging-cast filter. Do **not** grant Goad, Bait Pylon, or Cover Step. |
| — | `spell-enter-mend` | Wave 14 Enter extra door. `NAVE_THRESHOLD` (3-pad lattice / Narthex director) stays `BOSS_ONLY`. Player Enter Mend is one cell, 2 turns or first enter, heal 6. Occupant already standing does **not** trigger. Forced-move **does**. Do **not** grant Font, Mend Wick, or Gait Mend. |
| — | `spell-split-mend` | Wave 14 Split extra door. `CHOIR_SPLIT` (split to every extra / Pyx director) stays `BOSS_ONLY`. Player Split Mend is one ally (not self), 12 split 50/50 with the nearest other ally at Chebyshev ≤ 1 — isolated target gets 12. Dummy Post **can** eat 6; AI should skip that. Do **not** grant Rally, Font, or Flank Share. |
| — | `spell-quiet-sill` | Wave 14 Quiet extra door. `NAVE_QUIET` (3-cell file / Muffler director) stays `BOSS_ONLY`. Player Quiet Sill is one cell, 2 turns, occupant cannot resolve `isPhysical` / `physical_attack`. Do **not** grant Oath Blade, Strike Hold, or Quiet Hex. |
| — | `spell-court-hinge` | #563 leftover. **Not** a Wave-14 grant. Stays `NOT_PLAYER_LEARNABLE`. |
| — | `spell-shove-mend` | Wave 15 Jostle extra door (`MULTI_SOURCE`; #636 stub `shove_cantor` — first grant wins). `CHOIR_JOSTLE` (shove every extra / Stole director) stays `BOSS_ONLY`. Player Shove Mend is one ally, 8 iff `forcedMovedThisTurn`, 0-heal still spends AP. Do **not** grant Gait Mend, Chase Mend, Enter Mend, or Heave Mend. |
| — | `spell-exit-sting` | Wave 15 Peel extra door. `NAVE_PEEL` (3-cell file / Stoup director) stays `BOSS_ONLY`. Player Exit Sting is one cell, 2 turns or first leave, 8. Enter does **not** tick. Do **not** grant Exit Tithe, Ingress Mark, Shove Sting, or Quiet Sill. |
| — | `spell-cadence-stretch` | Wave 15 Dilate extra door (`MULTI_SOURCE`; #636 stub `stretch_precentor` — first grant wins). `CHOIR_DILATE` (stretch every remaining player CD / Antiphoner director) stays `BOSS_ONLY`. Player Cadence Stretch is one hostile, remaining ≥ 1 → `×2`, cap 8. Do **not** grant Cadence Flush, Stall, Trim, Crack, or Court Stretch. |
| — | `spell-far-hood` | Wave 15 Hood extra door (`ELITE`). `NAVE_HOOD` (hood himself **and** one extra / Capuche director) stays `BOSS_ONLY`. Player Far Hood is self, next applied damaging hit from Chebyshev ≥ 3 deals 0 then consume. Hits from 1–2 land and do **not** consume. Do **not** grant Sidestep, Near Hood, Mid Hood, Odd Hood, or Return Sting. |
| — | `spell-court-hinge` | #563 leftover. **Not** a Wave-15 grant. Stays `NOT_PLAYER_LEARNABLE`. |
| — | `spell-gait-wick` | Wave 16 Wick extra door. `CHOIR_WICK` (mark player **and** every living extra / Cresset director) stays `BOSS_ONLY`. Player Gait Wick is one unit, next ≥ 1 walk MP deals 10 then consume, 2 of their turns or until walk. Forced-move does **not** detonate. Do **not** grant Boot Sting, Post Sting, Fuse Tile, or Pit Wick. |
| — | `spell-dry-sting` | Wave 16 Dry extra door. `NAVE_DRY` (sting every player-side body at leftover 0 / Cruet director) stays `BOSS_ONLY`. Player Dry Sting is one hostile, 12 + 8 iff leftover AP is 0. Do **not** grant Empty Plate, Purse Cut, Post Sting, or Lone Sting. |
| — | `spell-home-step` | Wave 16 Hearth extra door. `CHOIR_HEARTH` (he steps to the extra **and** the extra steps to him / Andiron director) stays `BOSS_ONLY`. Player Home Step is one living ally, caster dest-pick to free Chebyshev-1, **not** `isSwap`. No free adj = fizzle, AP spent. Do **not** grant Hinge Step, Morrow Step, Cover Step, or Swap. |
| — | `spell-must-span` | Wave 16 Must extra door (`ELITE`). `NAVE_SPAN` (brand player **and** living player-side summons / Ell director) stays `BOSS_ONLY`. Player Must Span is one hostile, rest of their current turn, walks must be Manhattan **exactly 2**. 0 walk MP is legal. Forced-move any length. Do **not** grant Must Pace, Rank Lock, or Diag Lock. |
| — | `spell-boot-lend` | Wave 17 Boot extra door. `CHOIR_BOOT` (lend every extra / Caliga director) stays `BOSS_ONLY`. Player Boot Lend is one unmoved ally, +1 current MP, cap at max. Forced-move does **not** fizzle. Do **not** grant Spare Pace, Gift Sill, Leftover Lend, or Haste. No stub. |
| — | `spell-purse-keep` | Wave 17 Purse extra door (`MULTI_SOURCE`; #636 stub `keep_bursar` — first grant wins). `NAVE_KEEP` (keep himself **and** extras with leftover ≥ 1 / Cista director) stays `BOSS_ONLY`. Player Purse Keep is self, once/battle, cap 3, next own turn start. Do **not** grant Purse Cut, Empty Purse, Timestep, Leftover Lend, or Late Purse. Do **not** remap `keep_bursar`. |
| — | `spell-tick-plate` | Wave 17 Tick extra door. `NAVE_TICK` (plate himself **and** one extra / Plaster director) stays `BOSS_ONLY`. Player Tick Plate is self, next DoT tick 0 then consume. Hits / Far Hood do **not** consume. Do **not** grant Morrow Plate, Tick Hood, Ward Plate, Empty Plate, or Cleanse. No stub. |
| — | `spell-last-mute` | Wave 17 Mute extra door. `CHOIR_MUTE` (mute player **and** extras’ last ids / Tabula director) stays `BOSS_ONLY`. Player Last Mute is one hostile, last resolved id illegal for 1 of their turns. No last id = fizzle, AP spent. Do **not** grant Mute Thread, Once Verse, Oath Blade, or Hex of Silence. No stub. |
| — | `spell-pair-slide` | Wave 18 Slide extra door. `CHOIR_SLIDE` (every adj hostile pair / Litter director) stays `BOSS_ONLY`. Player Pair Slide is one living hostile + nearest other living hostile at Chebyshev exactly 1, both translate 1 in caster→target, dests `isCellFree`, **not** `isSwap`. No second body / blocked dest = fizzle, AP spent. Do **not** grant Pair Hinge, Pawn Trade, Slide Tile, or Draw Together. No stub. Do **not** remap `pair_usher`. |
| — | `spell-both-mend` | Wave 18 Both extra door (`MULTI_SOURCE`; #695 stub `both_cantor` — first grant wins). `CHOIR_BOTH` (mend every extra that walked / Gaiter director) stays `BOSS_ONLY`. Player Both Mend is one ally, 8 iff caster **and** target `walkMpSpentThisTurn ≥ 1`. Force-move does **not** arm. Do **not** grant Gait Mend, Chase Mend, Shove Mend, or Heave Mend. Do **not** remap `both_cantor`. |
| — | `spell-heave-mend` | Wave 18 Heave extra door (`MULTI_SOURCE`; #726 stub `heave_cantor` — first grant wins). `NAVE_HEAVE` (self+extra translate then mend / Spit director) stays `BOSS_ONLY`. Player Heave Mend is one ally, 8 iff caster **and** target `forcedMovedThisTurn`. Walk does **not** arm. Do **not** grant Shove Mend, Both Mend, Heave Step, or Pair Pace. Do **not** remap `heave_cantor`. |
| — | `spell-parched-mend` | Wave 18 Parched extra door (`MULTI_SOURCE`; #787 stub `parched_cantor` — first grant wins). `CHOIR_PARCHED` (mend every extra at leftover MP 0 / Flagon director) stays `BOSS_ONLY`. Player Parched Mend is one ally, 8 iff caster **and** target leftover walk MP = 0. Do **not** grant Dry Mend, Still Mend, Dry Sting, Dry Gait (#802), or Both Mend. Do **not** remap `parched_cantor`. |
| — | `spell-stride-keep` | Wave 19 Stride extra door (`MULTI_SOURCE`; #695 stub `stride_bursar` — first grant wins). `NAVE_STRIDE` (keep himself **and** extras with leftover MP ≥ 1 / Scrip director) stays `BOSS_ONLY`. Player Stride Keep is self, leftover walk MP cap 2, next own turn start, once/battle. Leftover 0 still spends the once/battle for 0. Do **not** grant Purse Keep, Dual Keep, Haste-as-grant, Timestep, or Pack Stride. Do **not** remap `stride_bursar` / `keep_bursar`. |
| — | `spell-dual-keep` | Wave 19 Dual extra door (`MULTI_SOURCE`; #726 stub `dual_bursar` — first grant wins). `NAVE_DUAL` (dual-keep every extra with leftover AP ≥ 1 **and** MP ≥ 1 / Bourse director) stays `BOSS_ONLY`. Player Dual Keep is self, leftover AP cap 2 **and** leftover MP cap 2, next own turn start, once/battle. Skip if either leftover is 0. Do **not** grant Purse Keep, Stride Keep, Timestep, or Leftover Lend. Do **not** remap `dual_bursar` / `keep_bursar` / `stride_bursar`. |
| — | `spell-cadence-imprint` | Wave 19 Imprint extra door (`MULTI_SOURCE`; #787 stub `imprint_precentor` — first grant wins). `CHOIR_IMPRINT` (copy matching remaining from the player onto extras / Platen director) stays `BOSS_ONLY`. Player Cadence Imprint is one enemy, remaining = `max(caster, n)` for **shared ids only**; target keeps every lock. Empty intersection = fizzle, AP spent. Do **not** grant Cadence Theft, Halve, Trim, Stretch, Flush, or Last Mute. Do **not** remap `imprint_precentor` / `trim_precentor`. |
| — | `spell-damp-sting` | Wave 19 Damp extra door (`ENEMY_DISCOVERY`; no #695 stub). `CHOIR_DAMP` (sting every player-side body at leftover MP ≥ 2 / Sump director) stays `BOSS_ONLY`. Player Damp Sting is one enemy, 8 then +10 iff leftover walk MP ≥ 2. Leftover AP does not arm the bonus. Do **not** grant Dry Sting, Ready Sting, Lean Sting, or Dry Gait. |
| — | `spell-quad-span` / `spell-court-stretch` | #636 remaining. **Not** Wave-18 or Wave-19 grants. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Quad Span stays off until occupy-weight exists. `span_quad` / `court_stretch_regent` stay closed. |
| — | `spell-penta-span` … `spell-court-keep` / `spell-sept-span` … `spell-court-dual` / `spell-six-span` … `spell-court-imprint` / `spell-gaunt-mend` … `spell-court-lag` | Remaining #695 / #726 / #787 / #849 except Wave-19 Stride Keep / Dual Keep / Cadence Imprint / Damp Sting. **Not** Wave-19 grants. Court Keep / Court Dual / Court Imprint / Court Lag stay `NOT_PLAYER_LEARNABLE`. Penta / Sept / Six Span stay off until occupy-weight exists. |

#156 Wave-1 ids (`spell-quiet-hex` …) stay on the ecosystem doc. #133 Wave-2 ids stay on `SPELL_PROPOSALS_2026-09-01.md`. #282 Wave-3 ids stay on `SPELL_PROPOSALS_2026-09-02.md`. #342 Wave-4 ids stay on `SPELL_PROPOSALS_2026-09-21.md`. #411 Wave-5 ids stay on `SPELL_PROPOSALS_2026-09-22.md`. #463 Wave-6 ids stay on `SPELL_PROPOSALS_2026-09-23.md`. #525 Wave-7 ids stay on `SPELL_PROPOSALS_2026-09-24.md`. #563 / #636 / #695 / #726 / #787 / #849 stay on their dated files. Do not reuse them as #137 ids. Wave 18 extra-doors Pair Slide from #636, Both Mend from #695, Heave Mend from #726, Parched Mend from #787. Wave 19 extra-doors Stride Keep / Damp Sting from leftover #695, Dual Keep from leftover #726, Cadence Imprint from leftover #787.

---

## 6. Shared AI, arena, and QA rules

### 6.1 AI (all bosses)

Current `useBossAI.ts` **prefers the first off-cooldown kit spell every turn** (`pickBossKitSpell`). That flattens kits into a script. Intended priority, for a later AI pass:

1. Finish a telegraph if one is pending.
2. Answer the core mechanic (drop a shield, spawn if under cap, rotate a window).
3. Cast a kit spell only if it serves that mechanic (slow before a charge, mark before a line).
4. Move / attack.

Until that pass, the sheets describe **intended** AI, not the live first-spell loop.

### 6.2 Arena rules (defaults)

- 16×16 walkable field unless a sheet shrinks it (Alabaster Phase 2).
- Hazard cap 50.
- Boss-side living extras cap 4 (ghosts: 6).
- Portals remain blocked until victory / death — existing Death Realm 1.5s guards still apply after a wipe.
- Destructible objects are **not** enemies: they do not take turns and do not count as `enemiesDefeated`.

### 6.3 QA (defaults — every sheet inherits)

Verify without changing damage math:

1. Phase thresholds fire on **effective** HP fractions, once.
2. Enrage starts on `enrageTurn`, adds no HP, caps at +80%.
3. Minions / larvae / ghosts do not grant `level * 20` XP.
4. Rewards enqueue on `createProgressPersist` and `commit` after `applyRewards`.
5. Challenge HP from hazards / reflects uses the existing record helpers.
6. Discovery counters persist on the backend (or an explicit later store) — **not** only `localStorage`.
7. A player who never observes a learnable ability does not unlock it on a blind kill.
8. Boss Guide still shows the four offsets `[-2, 0, +2, +5]` after relative HP lands.
9. `validateBossKits()` still passes (3–5 catalog spells, Phase 2 adds one).
10. No `wp` / `wr` / `scp` on any payload.

---

## 7. Encounter sheets — shipped bosses

Kit spell ids below are the **live** `BOSS_KITS` entries. Special abilities keep their enum names. New intended systems (telegraphs, rotating vulns, objects) are named in prose until an implementation PR adds metadata.

RELATIVE_DIFFICULTY is the even-match rating from §3.2.

---

### BOSS_ID: `pale_archbishop`

**NAME:** The Pale Archbishop  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** Rotting liturgy. A bishop who turns the nave into a courtroom: curse, martyr, then a mirrored pulpit.  
**CORE_MECHANIC:** Curse on contact + a **Reliquary** that powers Reflect Shield. Destroy the reliquary to drop the mirror; leave it and Phase 2 is a reflect check.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Diagonal pressure, `CURSE_ON_HIT`, kit: Cursed Wound / Shadow Veil. One **Reliquary** (destructible) sits on the opposite color complex. |
| 2 | ≤ 50% | Reflect Shield **only if the Reliquary still stands**. Spawn 2 kneeling wisps (cap 4). Sacrifice + Summon Wisp enter the pool. |
| Enrage | turn 18 | Pulpit Slam telegraph: 1-turn diagonal line through the player. Reliquary (if alive) heals 5% boss HP — still no enrage HP gift beyond that object. |

**SPELLS:** `spell-cursed-wound`, `spell-shadow-veil`, `spell-sacrifice` (P2), `summon-wisp` (P2).  
**DISCOVERABLE_SPELLS:** none. `CURSE_ON_HIT` and `REFLECT_SHIELD` are `BOSS_ONLY` (`spell-cursed-wound` / `spell-mirror` already exist).

**AI:** Close on the player’s color complex. If the Reliquary is down, never recast Reflect. Prefer Sacrifice only when boss HP > 30%.  
**ARENA_RULES:** Chapel palette (`oklch(35% 0.05 270)`). Reliquary on a bishop-reachable tile, not adjacent to spawn.  
**SUMMONS:** Phase 2, 2 wisps, healer AI, count against the 4-cap.  
**PLAYER_COUNTERPLAY:** Break the Reliquary first; curse-cleanse via distance; do not dump a nova into an up shield.  
**MASTERY_OBJECTIVE:** Kill him with the Reliquary still up and without casting a heal (`easy_1` or `hard_1`). Cosmetic feat only — no spell.  
**REWARDS:** Live multipliers 5 Doka / 3 XP. Feat Doka only if mastery is later seeded.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.25** (was 1.4).  
**BALANCE_RISKS:** Reflect + Sacrifice + player `spell-mirror` can loop; shield duration must stay 2 turns. Reliquary HP too high → sponge.  
**QA:** Reliquary death drops shield the same turn. Wisps grant 0 XP. Curse apply still increments challenge damage if the hit lands.  
**STATUS:** PROPOSED

---

### BOSS_ID: `crimson_countess`

**NAME:** Crimson Countess  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** A rook crowned in blood roses. She paints the file she walks.  
**CORE_MECHANIC:** Movement-taxing lava. Phase 2 turns her path into a river. The learnable spell is a **short** ember step, not the river.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Inferno + Life Drain. No lava yet. Telegraph **Rose Charge**: 1-turn rook-file dash. |
| 2 | ≤ 40% | `LAVA_TRAIL` on every move. Enrage + Lifesteal Nova in the kit. |
| Enrage | turn 18 | Charge resolves same turn as telegraph. |

**SPELLS:** `spell-inferno`, `starter-drain`, `spell-enrage` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-ember-step` (`LAVA_TRAIL` → `PLAYER_LEARNABLE`). See §5.2.

**AI:** Prefer files aligned with the player. After a charge, step one tile to leave lava if Phase 2.  
**ARENA_RULES:** Existing lava type, cap 50. Rose Charge tiles highlight before she moves.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Leave the file; do not stand in her wake; anti-heal (`spell-cursed-wound`) to blunt drain.  
**MASTERY_OBJECTIVE:** Win without stepping on lava (movement check).  
**REWARDS:** 5 / 3. Ember Step is the real prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.30** (was 1.5). Lava tick = 4% player max HP (guideline).  
**BALANCE_RISKS:** Lava + Thorned Ground double-taxes Untouchable. Ember Step must not paint 8 tiles.  
**QA:** Lava walk uses `recordInBattleChallengeDamage` while `inBattleRef`. Observation counts **her** trail, not player Ember Step.  
**STATUS:** PROPOSED

---

### BOSS_ID: `void_grandmaster`

**NAME:** The Void Grandmaster  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A king who treats the board as a variation set. Illusions are the puzzle; Swap is the insult.  
**CORE_MECHANIC:** Identify the real body. Hitting a fake wastes the turn and **marks you** (existing `spell-mark` on your tile) so his next blast double-taps.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 60% | `TELEPORT_ADJACENT`, kit blast / swap / mirror. |
| 2 | ≤ 60% | `ILLUSION_SPLIT` — 3 bodies, one real. Teleport remains. Timestep + Frost Nova enter. |
| Enrage | turn 21 | Illusions also teleport; fakes no longer die in one hit (they take 1, then fade). |

**SPELLS:** `starter-blast`, `spell-swap`, `spell-mirror`, `spell-timestep` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none player-owned. #120 `spell-void-anchor` is `NOT_PLAYER_LEARNABLE` / `BOSS_ONLY` — witness-only on this fight so the player learns to combo Hook + Root later, never the group-pull signature. Split and adjacent-teleport stay `BOSS_ONLY`.

**AI:** Swap when the player is set up on a file for a nova. Split as soon as Phase 2 starts, not every turn.  
**ARENA_RULES:** Dimensional palette. Illusions occupy tiles (block walk).  
**SUMMONS:** Illusions are **not** minions and do not count toward the 4-cap; they are `IllusionData`. No XP.  
**PLAYER_COUNTERPLAY:** AoE (`spell-frost-nova`, Inferno DoT on the real one after a reveal). Watch who casts Swap — only the real copy swaps.  
**MASTERY_OBJECTIVE:** Never hit a fake (movement / targeting check).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.25** (was 1.3). Illusion HP = 15% of boss effective HP (real copy uses full).  
**BALANCE_RISKS:** Timestep on a boss resets his AP — once per fight, already in kit. Player Timestep plus his Swap can yo-yo; acceptable.  
**QA:** Killing a fake does not trigger victory. Real copy’s HP is the phase trigger.  
**STATUS:** PROPOSED

---

### BOSS_ID: `bone_cavalier`

**NAME:** Bone Cavalier  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** Fused knight. Cover is a suggestion.  
**CORE_MECHANIC:** Telegraph a knight-landing, then spike the landing ring. Movement check: do not stand on the three landing candidates.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | `KNIGHT_JUMP_IGNORE_WALLS`. Haste in kit. Three tiles glow (possible landings). |
| 2 | ≤ 50% | `SPIKE_ON_LAND` on the landing ring. Enrage + Expose in kit. |
| Enrage | turn 19 | Two jumps in one turn (second is untelegraphed — this is the punishment). |

**SPELLS:** `physical_attack`, `spell-haste`, `spell-enrage` (P2), `spell-expose` (P2).  
**DISCOVERABLE_SPELLS:** `spell-vault` (`ACHIEVEMENT_UNLOCK`), `spell-caltrop` (`PLAYER_LEARNABLE`).

**AI:** Jump to the candidate that flanks (side/rear), not the closest.  
**ARENA_RULES:** Walls stay; he ignores them, the player does not.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Stand off all three glows; punish the landing tile; Expose is a tell to kite.  
**MASTERY_OBJECTIVE:** Never be adjacent on a landing turn.  
**REWARDS:** 5 / 3 plus the two discoverables.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.35** (was 1.6).  
**BALANCE_RISKS:** Player Vault once/battle is enough. Spikes + existing spike walk must both debit challenges.  
**QA:** Landing glow is visible before the jump. Vault cannot be observed from *his* jump to skip the 3-see gate.  
**STATUS:** PROPOSED

---

### BOSS_ID: `weeping_pawn`

**NAME:** The Weeping Pawn  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** Grief as promotion. The pawn is slow until it is a queen.  
**CORE_MECHANIC:** A **Wail Mark** (target mark) on the player every 3 turns — fail a movement check (must leave the marked tile) or take a sob hit. Promotion is the phase change, not a surprise one-shot.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 30% | Slow / Weaken / curse. Wail Mark cadence. High RES, low INIT. |
| 2 | ≤ 30% | `PROMOTE_QUEEN` + `ATTACK_ALL_LINES`. Iron Skin + Rallying Cry in kit. **One-turn telegraph** before the first all-lines volley. |
| Enrage | turn 19 | All-lines loses the telegraph (enrage rule). |

**SPELLS:** `physical_attack`, `spell-slow`, `spell-weaken`, `spell-iron-skin` (P2), `spell-rallying-cry` (P2).  
**DISCOVERABLE_SPELLS:** none. Promote and all-lines are `BOSS_ONLY`. #133 `spell-life-tether` is **not** this pawn — it is Midnight’s shared-HP door.

**AI:** Advance like a pawn until promotion; then sit on a central intersection.  
**ARENA_RULES:** Marked tile is visible (use Mark VFX, not a hidden hex).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Burst before 30%, or step off the mark and stand off-axis after promotion (not on rank, file, *or* diagonal).  
**MASTERY_OBJECTIVE:** Kill in Phase 1 (never allow promotion).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.40** (was **2.0**). Catalog 500 HP is a sponge — retire it for the ratio.  
**BALANCE_RISKS:** All-lines + Starborn Queen teaches the same stance; Weeping’s version is slower and telegraphed. Rallying Cry heal is 20 flat — at high level this is flavor, not a stall. Do not convert that heal to % HP.  
**QA:** Promotion happens once. Mastery fails if Phase 2 flags.  
**STATUS:** PROPOSED

---

### BOSS_ID: `starborn_queen`

**NAME:** Starborn Queen  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen whose body is a sky. Lines are constellations; voids are dead stars.  
**CORE_MECHANIC:** `ATTACK_ALL_LINES` from the start, plus **rotating line vulnerability** — she takes +40% from attacks that travel on this turn’s window (rank → file → diagonal). Void tiles in Phase 2 delete stands.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | All-lines every 2 turns (1-turn telegraph). Kit blast + Mark. Vuln window cycles. |
| 2 | ≤ 50% | `VOID_TILES` (2–3 per pulse, cap 50). Frost Nova + Shadow Veil. |
| Enrage | turn 21 | All-lines every turn, still telegraphed until stack 1 of enrage. |

**SPELLS:** `starter-blast`, `spell-mark`, `spell-frost-nova` (P2), `spell-shadow-veil` (P2).  
**DISCOVERABLE_SPELLS:** none. Lines and void are `BOSS_ONLY`.

**AI:** Stand on intersections. Mark the tile she expects you to dodge *to*.  
**ARENA_RULES:** Void is unwalkable. Do not void the player spawn or the only path to her.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Attack along the glowing vuln window; never end a turn on a constellation line.  
**MASTERY_OBJECTIVE:** Deal the killing blow on a Window C (diagonal) turn.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Void + board shrink (Alabaster) in Boss Rush room 3 pairing with Enthroned Void is already a combined mechanic — do not add more holes in rush.  
**QA:** Vuln window is visible on her tile. Void does not soft-lock movement.  
**STATUS:** PROPOSED

---

### BOSS_ID: `fetid_rook`

**NAME:** The Fetid Rook  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A rook of compost. Hits stack rot; at the threshold it becomes two problems.  
**CORE_MECHANIC:** `COMPOUNDING_ROT` plus a **split** that is a summon-management check, not a HP double-dip.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Venom / Poison. Each connecting hit adds one rot stack (no hidden cap in the boss version). |
| 2 | ≤ 40% | `SPLIT_ROOKS` — **one** extra rook at **50% of remaining HP**, not a second full bar. Twin nova in kit. |
| Enrage | turn 19 | Both bodies gain +8%/turn independently (still +80% cap **per body**). |

**SPELLS:** `spell-venom-strike`, `starter-poison`, `spell-cursed-wound` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-rot-brand` (`CHALLENGE_UNLOCK`).

**AI:** After split, twins take opposite files.  
**ARENA_RULES:** Split rook counts as the second boss body for Twin-style targeting; only the **original id** dropping to 0 is victory if the twin is already dead. If the original dies first, the twin becomes the boss (existing split feel).  
**SUMMONS:** The twin is a split, not a minion. No extra XP.  
**PLAYER_COUNTERPLAY:** End the fight before 5 stacks; focus one body after split.  
**MASTERY_OBJECTIVE:** Win with ≤ 2 rot stacks **and** a qualifying challenge (`hard_1` or `legendary_1`) for the brand.  
**REWARDS:** 5 / 3. Rot Brand is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.00** (keep — split is the escalation).  
**BALANCE_RISKS:** Uncapped boss rot vs player % HP ticks. Boss rot should stay **flat per stack** (existing DoT), not % HP. Player brand caps at 3.  
**QA:** Split once. Twin death ≠ extra `applyRewards`. Observation of 3 stacks can come from a failed attempt.  
**STATUS:** PROPOSED

---

### BOSS_ID: `eternal_pawn_king`

**NAME:** Eternal Pawn King  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A pawn that has walked for centuries. The file in front of him is inevitable.  
**CORE_MECHANIC:** `ADVANCE_PER_TURN` + resource pressure (`AP_DRAIN` in Phase 2). **Promotion rank** is a destructible **Milestone Stone** three tiles ahead of him: destroying it **resets his advance by 2 tiles** (once per stone, 3 stones).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Advance + Slow / Drain Courage. Stones on his file. |
| 2 | ≤ 50% | `AP_DRAIN` (−1 AP on the player at the start of his turn). Iron Skin + Cursed Wound. |
| Enrage | turn 20 | Advance becomes 2 tiles. |

**SPELLS:** `spell-slow`, `spell-drain-courage`, `spell-iron-skin` (P2), `spell-cursed-wound` (P2).  
**DISCOVERABLE_SPELLS:** none. Advance and AP drain aura are `BOSS_ONLY`.

**AI:** Always forward on his file unless blocked; then sidestep one and resume.  
**ARENA_RULES:** If he reaches the player’s back rank, he does **not** promote (Weeping owns that fantasy). He instead gains a 1-turn all-adjacent smash (telegraphed).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break stones, kite off-file, plan 1-AP turns in Phase 2 (`hard_3` is a natural pairing).  
**MASTERY_OBJECTIVE:** Win without letting him advance more than 6 tiles net.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.25** (was 1.3). Drain stays −1 AP, never % of bar.  
**BALANCE_RISKS:** −1 AP + Slow −2 MP can stall new players; keep drain to Phase 2.  
**QA:** Stones are not enemies. Advance does not path through voids created by other rush partners.  
**STATUS:** PROPOSED

---

### BOSS_ID: `midnight_bishop`

**NAME:** Midnight Bishop  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** Two bishops, one soul. Diagonals are jaws.  
**CORE_MECHANIC:** `TWIN_FLANK` until `MERGE_BISHOPS`. Shared HP. Standing on a color complex that **both** can see is a movement fail.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 25% | Twin flank, Cursed Wound / Mirror / Shadow Veil. |
| 2 | ≤ 25% | Merge + `MAGIC_REFLECT`. Swap + Frost Nova. Stat spike is **positioning**, not 2× stats. |
| Enrage | turn 21 | Merged form casts Swap then Nova the same turn. |

**SPELLS:** `spell-cursed-wound`, `spell-mirror`, `spell-shadow-veil`, `spell-swap` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none from #137. #133 `spell-life-tether` (`BOSS` route — first victory, `bossIds: ["midnight_bishop"]`, observation **false**). Shared-HP twins stay `BOSS_ONLY`; the player spell is a 50/50 split that **breaks** at Chebyshev > 3.

**AI:** Twins occupy opposite colors. They never stand on the same complex.  
**ARENA_RULES:** Shared HP bar. Killing “one” is impossible; damage on either body hits the pool.  
**SUMMONS:** none (the twin is a body).  
**PLAYER_COUNTERPLAY:** Stand on a file that only one diagonal can see; burst before merge; physical Strike into Magic Reflect.  
**MASTERY_OBJECTIVE:** Force merge with both bodies at ≥ 20% of the shared bar (no “execute one then merge a stub”).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00 (shared), atkRatio 1.10, offset +1, Phase-2 mult **1.35** (was **2.0**).  
**BALANCE_RISKS:** Shared HP + 2.0 old multiplier was a sponge. Reflect + player Sacrifice can self-kill — keep reflect as **next spell only**, not a % aura.  
**QA:** One victory. One XP grant.  
**STATUS:** PROPOSED

---

### BOSS_ID: `broodmother_rook`

**NAME:** Broodmother Rook  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A hollow rook. The children are the armor.  
**CORE_MECHANIC:** Summon management. `SHELL_ARMOR` while any larva lives. Phase 2 larvae explode.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | 1 larva / pulse, shell on. Archer summon in kit. |
| 2 | ≤ 50% | 2 larvae / pulse, `LARVAE_EXPLODE`, Iron Skin + Nova. |
| Enrage | turn 20 | Larvae spawn on her move tiles (still cap 4 extras: larvae + archer share the cap). |

**SPELLS:** `summon-archer`, `spell-venom-strike`, `spell-iron-skin` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-brood-ward` (`ACHIEVEMENT_UNLOCK`).

**AI:** Never spend a turn spawning if already at cap. Prefer venom on the player when shell is down.  
**ARENA_RULES:** Larvae 1 HP, existing `LarvaData`. Explode = poison DoT on adjacent, existing.  
**SUMMONS:** Larvae + kit archer. Cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Clear larvae at range, then burst the shell-less rook. Do not stand adjacent on death.  
**MASTERY_OBJECTIVE:** Kill her while 0 larvae live (shell down) and keep a player summon alive the whole fight (teaches Brood Ward).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.25** (was 1.4). Catalog 480 + 25 RES is a sponge — RES stays high, HP uses the ratio.  
**BALANCE_RISKS:** Shell + Iron Skin + high RES. Shell should be a **flat damage reduction flag**, not another 30% RES stack, or she becomes unkillable at high player ATK too (wait — high player ATK breaks shells). Prefer: shell = **ignore the first hit each turn** while larvae live. That stays fair at any level.  
**QA:** Shell drops the instant last larva dies. Explode credits challenge HP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `lord_of_static`

**NAME:** Lord of Static  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A king who is a walking circuit.  
**CORE_MECHANIC:** Shock tiles as a growing graph. Phase 2 the graph sparks. Rotating vuln: **odd turns physical, even turns spell** (2-step, not 3 — he is a metronome).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | `SHOCK_TILES` on move. Blast + Haste. |
| 2 | ≤ 40% | `CHAIN_LIGHTNING` across shock clusters. Frost Nova + Expose. |
| Enrage | turn 20 | New shock tiles start already chained. |

**SPELLS:** `starter-blast`, `spell-haste`, `spell-frost-nova` (P2), `spell-expose` (P2).  
**DISCOVERABLE_SPELLS:** `spell-shock-glyph` (`PLAYER_LEARNABLE`). Chain stays `BOSS_ONLY`.

**AI:** Move to extend a connected shock component toward the player, not random.  
**ARENA_RULES:** Existing `ShockTile`. Generation counter already wipes stale VFX — keep it.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Hit him on the vuln step; stand off clusters; Barrier to break a chain line.  
**MASTERY_OBJECTIVE:** Win with ≤ 3 shock tiles existing at victory.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Chain + player standing on a cluster + lava from rush partner (room 2 with Cavalier). Combined mechanic already says Cavalier channels Static — do not also make spikes chain.  
**QA:** Shock-glyph observation counts **his** tiles. `shockTileGeneration` increments on wipe.  
**STATUS:** PROPOSED

---

### BOSS_ID: `final_pawn`

**NAME:** The Final Pawn  
**RELATIVE_DIFFICULTY:** 10  
**THEME:** An ordinary pawn that is the whole graveyard.  
**CORE_MECHANIC:** A meek Phase 1, then a **structured** invuln window while ghosts appear. Not `statMultiplier: 999`. Not 11 simultaneous bosses.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 10% | Physical only. He looks like a trash pawn. Resource pressure: he does almost nothing — the trap is overcommitting AP. |
| 2 | ≤ 10% | `INVINCIBLE_PHASE` for **3 turns** (not infinite). `GHOST_SUMMON` **4** ghosts (was 11), cap 6. Kit: Timestep, Sacrifice, Dire Wolf. |
| Enrage | turn 24 | If ghosts remain, he extends invuln by **1** turn (once). |

**SPELLS:** `physical_attack`, `spell-timestep` (P2), `spell-sacrifice` (P2), `summon-dire-wolf` (P2).  
**DISCOVERABLE_SPELLS:** none.

**AI:** Phase 1: walk and Strike. Phase 2: Timestep immediately, then Sacrifice only if HP > 1 after invuln drops.  
**ARENA_RULES:** Ghosts are faded kits (one ability each), 0 XP, 40% of a normal minion HP budget.  
**SUMMONS:** 4 ghosts + optional wolf, cap 6.  
**PLAYER_COUNTERPLAY:** Save AP/MP for the invuln window; kill ghosts or ignore and burst him when the shield drops; do not spend Timestep in Phase 1.  
**MASTERY_OBJECTIVE:** Win without killing any ghost (`ghost_warden`).  
**REWARDS:** Keep 10 Doka / 5 XP multipliers — this is the roster closer. Ghosts grant 0 XP or the closer would print a full raid table.  
**SCALING_BEHAVIOUR:** hpRatio 2.60, atkRatio 1.15, offset +2, Phase-2 mult **1.20** (**not 999**). Invuln is a flag + turn counter (`invincibleTurnsLeft`), already on `BossState`.  
**BALANCE_RISKS:** 11 ghosts + 999 was untestable and XP-toxic. Sacrifice at 1 HP is a suicide — AI must not.  
**QA:** Invuln expires. Victory when the pawn dies, even if ghosts live. Mastery fails if any ghost HP hits 0.  
**STATUS:** PROPOSED

---

### BOSS_ID: `alabaster_fortress`

**NAME:** The Alabaster Fortress  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A pawn that is a building. You do not chip a wall; you tune it until it cracks.  
**CORE_MECHANIC:** `RESONANCE_SHOCKWAVE` — stored incoming damage becomes a pulse. Phase 2 `BOARD_SHRINK`. Destructible **Buttresses** (2) delay shrink by 2 turns each.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 30% | High RES/SP, low ATK. Resonance every 3 incoming hits (existing counter). Kit: Strike, Iron Skin, Shield. |
| 2 | ≤ 30% | Board shrink + Barrier + Frost Nova. Pulses keep firing. |
| Enrage | turn 21 | Shrink ticks every turn. |

**SPELLS:** `physical_attack`, `spell-iron-skin`, `starter-shield`, `spell-barrier` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-aftershock` (`ACHIEVEMENT_UNLOCK`, §5.2). #120 `spell-pain-link` (`BOSS` route — first victory, no count-gate). Two grants, different verbs.

**AI:** Does not chase. Pulses from center.  
**ARENA_RULES:** Shrink leaves a walkable core; never seals the player in a 1-tile pocket (Boss Rush already punched wall/void seals — keep that promise).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Hit in 2s, step off pulse rings; break buttresses if you need time; DoTs still feed resonance — commit to bursts.  
**MASTERY_OBJECTIVE:** Survive 3 pulses and win (`fortress_tuner`).  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.20**. Catalog RES 60 / SP 40 stay as **ratios of player RES/SP**, not raw 60 at L80.  
**BALANCE_RISKS:** Resonance stored as raw damage explodes at high ATK. Store **hit count**, pulse = `8% playerMaxHp` (or existing flat at L1). Do not store 400 damage and echo it.  
**QA:** Buttresses 0 XP. Shrink + existing map solvability.  
**STATUS:** PROPOSED

---

### BOSS_ID: `chessboard_lich`

**NAME:** The Chessboard Lich  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A king on a floating throne who edits the problem while you solve it.  
**CORE_MECHANIC:** Arena mutation. `MAP_ROTATE` then `MIRROR_INVERT` + `BOARD_CLAIM`. **Claim pylons** (2 destructibles) are the only way to freeze a claim zone.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Rotate every 4 turns (telegraphed: rim tiles flash). Kit: Swap, Mark, Veil, Cursed Wound. |
| 2 | ≤ 50% | Invert safe/hazard colors. Claim a 3×3. Wisp in kit. |
| Enrage | turn 22 | Rotate + invert can coincide. |

**SPELLS:** `spell-cursed-wound`, `spell-swap`, `spell-mark`, `spell-shadow-veil`, `summon-wisp` (P2).  
**DISCOVERABLE_SPELLS:** none. All three specials are `BOSS_ONLY`.

**AI:** Mark the tile you will be rotated onto.  
**ARENA_RULES:** Rotation must preserve a walkable path (same family of bug as #97 / #110 — do not reseal).  
**SUMMONS:** 1 wisp, cap 4.  
**PLAYER_COUNTERPLAY:** Stand near center before rotate; break pylons to pin a claim; physical pressure (low RES).  
**MASTERY_OBJECTIVE:** Win without being swapped.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.25**. Catalog 200 HP is a glass cannon — the ratio makes him a **puzzle timer**, not a 200-HP joke at L1 or a joke at L40.  
**BALANCE_RISKS:** Rotate + Void tiles (rush with Queen) can trap. Combined-mechanic sheet already exists — implementation must test that room.  
**QA:** Claim zone is not an enemy. Invert does not invert void into walls that seal portals.  
**STATUS:** PROPOSED

---

### BOSS_ID: `mirror_sovereign`

**NAME:** The Mirror Sovereign  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A queen of black glass. Your last three casts are hers.  
**CORE_MECHANIC:** `SPELL_MIRROR` then `COMBO_REPLAY`. Target mark on **you**: the next spell you cast is the one she queues.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Mirror next spell. Kit: blast, mirror, mark. |
| 2 | ≤ 50% | Replay last 3-cast buffer (`lastThreeTurnsMirror`). Veil + Swap. |
| Enrage | turn 22 | Replay becomes 100% (was 100% on her side already — player echo is 50%). She also mirrors **physical** Strike. |

**SPELLS:** `starter-blast`, `spell-mirror`, `spell-mark`, `spell-shadow-veil` (P2), `spell-swap` (P2).  
**DISCOVERABLE_SPELLS:** `spell-echo-cast` (`CHALLENGE_UNLOCK` via `legendary_3`).

**AI:** Mark, then wait for you to spend. Replay when the buffer has 3 damaging casts.  
**ARENA_RULES:** Dark glass palette. No extra hazards unless she Marks a glyph.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Cast utility (Slow, Barrier, Shield) into the mirror; vary damage spells; `direct_hit` challenge is the hard unlock.  
**MASTERY_OBJECTIVE:** `legendary_3` on this fight (Chebyshev ≤ 2) — the echo unlock.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Replaying Sacrifice or Timestep is banned for her too (same denylist as echo). Player Inferno replayed is fair (cooldown exists).  
**QA:** Buffer does not persist across fights. Echo deny list is metadata, not `if (name.includes("Sacrifice"))`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `starved_vampire_pawn`

**NAME:** The Starved Vampire Pawn  
**RELATIVE_DIFFICULTY:** 3  
**THEME:** A pawn who is hunger. The fight is a leak, not a wall.  
**CORE_MECHANIC:** `LIFE_DRAIN` growth **capped at 200% of start HP**. Phase 2 AoE drain + Exsanguinated. Optional **Blood Font** (destructible) that, if destroyed, **halves** his heal-from-drain for 3 turns.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Until he has drained `0.5 * playerMaxHp` **or** he is reduced to 1% — whichever first | Drain / Drain Courage. Tiny start HP (ratio 1.30, but start-of-fight HP is the budget; he grows). |
| 2 | After the drain quota or 1% | `VAMPIRIC_AOE`, `EXSANGUINATED_DEBUFF`. Haste + Nova. |
| Enrage | turn 17 | Drain heals no longer diminished by the Font. |

**SPELLS:** `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` (P2), `spell-haste` (P2).  
**DISCOVERABLE_SPELLS:** `spell-exsanguinate` (`PLAYER_LEARNABLE`, §5.2). #120 `spell-blood-familiar` (`BOSS` route — first victory, intended P2 chump-block).

**AI:** Stay at range 2 (drain range). Only step in for Nova.  
**ARENA_RULES:** Font opposite the player spawn.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break the Font; anti-heal; burst before the 200% cap. Do not stand adjacent in Phase 2.  
**MASTERY_OBJECTIVE:** Kill him before he ever reaches 150% start HP.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.30 as **starting** HP, atkRatio 0.85, offset +0, Phase-2 mult 1.0. Catalog 60 is the L1 reference. Cap growth at 2.0× start.  
**BALANCE_RISKS:** Uncapped drain vs high player HP becomes a second Final Pawn. The 200% cap is mandatory. Phase trigger `hpThreshold: 0.01` today never really “phases” if he heals — use the **drain quota** as the real trigger.  
**QA:** Growth cap. Font 0 XP. Exsanguinate observation = receiving the debuff once.  
**STATUS:** PROPOSED

---

### BOSS_ID: `pale_archivist`

**NAME:** The Pale Archivist  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A rook that is a library. Scrolls fight. Ink hides the floor.  
**CORE_MECHANIC:** Summon management + ground traps. `INK_VEIL` / `SCROLL_SUMMON` / `GLYPH_TRAP`, then `PAGES_OF_DOOM` (telegraphed multi-page). Rotating vuln by **spell school you have used most** — he resists that school (existing `spellSchoolUsageCounts`).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 3 scrolls, glyphs, ink. Kit: Mark, Barrier, Archer, Cursed Wound. |
| 2 | ≤ 40% | Pages of Doom (3 telegraphed waves). Veil in kit. Scroll cap 2 new. |
| Enrage | turn 22 | Pages lose gaps between waves. |

**SPELLS:** `spell-cursed-wound`, `spell-mark`, `spell-barrier`, `summon-archer`, `spell-shadow-veil` (P2).  
**DISCOVERABLE_SPELLS:** `spell-glyph-snare` (`PLAYER_LEARNABLE`, §5.2). #120 `spell-glyph-tax` (`BOSS` route — first victory, intended P2 3×3 AP zone). Not the same spell.

**AI:** Glyph the tile you just left. Scrolls kite. Pages aim at last player tile + adjacent.  
**ARENA_RULES:** Ivory stacks. Glyphs visible as faint ink after 1 turn (fairness).  
**SUMMONS:** Scrolls as archers, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Vary schools; trigger glyphs with a summon; Barrier to break a page line.  
**MASTERY_OBJECTIVE:** Win with 0 scroll kills (ignore them) — summon-management restraint.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.20**.  
**BALANCE_RISKS:** School resist + Shadow Veil can stack. Resist is **−20%** to the most-used school, not immunity.  
**QA:** Glyph-snare observation counts his glyphs. Pages are telegraphs, not instant.  
**STATUS:** PROPOSED

---

### BOSS_ID: `twin_monarchs`

**NAME:** The Twin Monarchs  
**RELATIVE_DIFFICULTY:** 9  
**THEME:** Dawn and Dusk on one cord.  
**CORE_MECHANIC:** Two bodies, two jobs (`DAWN_BUFF`, `DUSK_DOT`). `MONARCH_ABSORB` if one dies first. **Kill them within 2 turns of each other** or the survivor is the real boss.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Both alive | Dawn heals/CHC, Dusk burns. One wisp. |
| 2 | First death | Absorb: survivor +40% damage (existing 1.4), both kits. |
| Enrage | turn 23 | Absorb happens **even if both live** (they fuse without a corpse) — punish long fights. |

**SPELLS:** `spell-rallying-cry`, `spell-inferno`, `spell-enrage` (P2), `spell-iron-skin` (P2).  
**DISCOVERABLE_SPELLS:** none.

**AI:** Dawn stays back, Dusk walks. They never stack on one tile.  
**ARENA_RULES:** Two combatants, two HP bars, **one encounter**. Victory when **both** are dead.  
**SUMMONS:** 1 wisp, cap 4.  
**PLAYER_COUNTERPLAY:** Split damage; save a burst to clip the second within 2 turns; interrupt Dawn’s cry.  
**MASTERY_OBJECTIVE:** Simultaneous kill (both die on the same player turn). Extra Doka feat if seeded.  
**REWARDS:** 7 / 5. Both bodies count as boss XP (the one exception in §3.4).  
**SCALING_BEHAVIOUR:** Each body hpRatio **1.40** (together ~2.8, but you can focus), atkRatio 1.20, offset +2, Phase-2 mult **1.35** (was 1.4).  
**BALANCE_RISKS:** Absorb + Enrage + Iron Skin. If the player executes one at 1% and cannot clip the other, the fight should be hard, not hopeless — absorbed HP is **remaining HP of the survivor**, not a full refill.  
**QA:** Recap once. Persist once. `monarchKilledFirst` drives VFX only.  
**STATUS:** PROPOSED

---

### BOSS_ID: `enthroned_void`

**NAME:** The Enthroned Void  
**RELATIVE_DIFFICULTY:** 9  
**THEME:** An empty throne. The mist is the king.  
**CORE_MECHANIC:** `DAMAGE_IMMUNE` until **8 anchors** die. Then a short, vicious Phase 2 with `AP_DRAIN_PASSIVE`. Phantoms are the tax.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Immune until `anchorsDestroyed >= 8` | Anchors + 2 phantoms. Kit: Swap, Slow, Wolf. |
| 2 | After the 8th anchor | Immunity drops. Veil + Frost Nova. −1 AP each of **his** turns (`apDrainLastTurn` guard — once per turn). |
| Enrage | turn 23 | If anchors remain, 2 anchors shatter themselves and he pulses (do not soft-lock a player who cannot find the 8th). |

**SPELLS:** `spell-swap`, `spell-slow`, `summon-dire-wolf`, `spell-shadow-veil` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none. Anchors / immune / aura are `BOSS_ONLY`.

**AI:** Swap the player onto a phantom. Do not recast immunity.  
**ARENA_RULES:** 8 anchors on the rim, walkable access, HP = `0.15 * playerMaxHp` each. Phantoms cap the 4-extra budget with the wolf.  
**SUMMONS:** Phantoms + wolf, cap 4.  
**PLAYER_COUNTERPLAY:** Clear anchors, ignore or kite phantoms, dump the bar when immunity drops; plan 1-AP turns.  
**MASTERY_OBJECTIVE:** Destroy all 8 anchors and win without killing a phantom (`anchor_breaker`).  
**REWARDS:** 8 / 6.  
**SCALING_BEHAVIOUR:** hpRatio 2.40 (Phase 2 bar — Phase 1 HP is irrelevant while immune), atkRatio 1.20, offset +2, Phase-2 mult **1.40** (was 1.6).  
**BALANCE_RISKS:** Immune + rush pairing with Starborn Queen voids. Enrage self-shatter prevents “lost the last anchor in a hole.” Drain once per his turn, not once per action.  
**QA:** 8th anchor triggers Phase 2 the same turn. Anchors 0 XP.  
**STATUS:** PROPOSED

---

## 8. Encounter sheets — Wave 2 (not in `BOSS_IDS`)

These four fill the skipped “boss 15” slot and the systems the shipped 19 only half-cover: a **primary** rotating-vuln charger, a **primary** movement-mark, a **primary** enrage clock with objects, and a **primary** silence-lane summon conductor.

They are **not** in Boss Rush until a later pairing pass. Do not add ids to `BOSS_IDS` in this PR.

---

### BOSS_ID: `cinder_lance`

**NAME:** The Cinder Lance  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** The missing #15. A knight of coals and hoarfrost. Each charge is a sentence; the element he is wearing is the only one that wounds him.  
**CORE_MECHANIC:** Telegraph a **straight 5-tile lance**. Rotating vulnerability: Fire window (burn / Inferno / ember) vs Frost window (Frost Bolt / Nova). Wrong element is −50% (not 0 — never a brick).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Lance every 3 turns. Window swaps every 3 turns. Kit proposal (when added): `spell-inferno`, `starter-frost`, `spell-haste`. |
| 2 | ≤ 45% | Lance leaves a 2-tile cinder **or** rime line matching the window. `spell-expose`, `spell-enrage`. |
| Enrage | turn 20 | Two lances, crossing. |

**SPELLS (proposed kit):** `spell-inferno`, `starter-frost`, `spell-haste`, `spell-expose` (P2), `spell-enrage` (P2). Must stay unique vs Cavalier / Static / Countess sets.  
**DISCOVERABLE_SPELLS:** #133 `spell-file-lance` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["cinder_lance"]`). Observation = he **casts** a lance (`kind: "cast"`, #156 default — one use, same-encounter win). Ember Step / Shock Glyph already cover trail/tile. The **full-file / crossing enrage lances** stay `BOSS_ONLY`.

**AI:** Aim the lance at the player’s **current** tile at telegraph time (dodge is stepping off).  
**ARENA_RULES:** Ember/rime use lava/frost-slow tiles, cap 50.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Carry both a fire and a frost source; step off the glow; hit the glowing window.  
**MASTERY_OBJECTIVE:** Landing blow on the **wrong** window (style) — no spell, just a feat.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25.  
**BALANCE_RISKS:** Players with no frost spell cannot exploit Window B — wrong-element is −50%, not immune, so they can still win.  
**QA:** Telegraph tile set is computed at wind-up and does not follow the player. Kit uniqueness vs `validateBossKits` uniqueness rule (exact set must be unique).  
**STATUS:** PROPOSED

---

### BOSS_ID: `hexed_marker`

**NAME:** The Hexed Marker  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop who writes your next square for you.  
**CORE_MECHANIC:** Target marking + movement checks. Every 2 turns he Marks a tile (`spell-mark`). A **second** mark (`Hex`) says: **leave this tile before his next turn** or the Hex detonates (hazard tick + Slow).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Mark + Hex cadence. Kit: `spell-mark`, `spell-slow`, `spell-barrier`. |
| 2 | ≤ 40% | Two Hex tiles. `spell-expose`, `summon-archer` (the archer stands on a Hex to dare you). |
| Enrage | turn 19 | Hex detonates on **his** turn even if you moved — must also not **end** adjacent to a Hex. |

**SPELLS (proposed kit):** `spell-mark`, `spell-slow`, `spell-barrier`, `spell-expose` (P2), `summon-archer` (P2).  
**DISCOVERABLE_SPELLS:** none. Mark exists. Glyph-snare is Archivist’s. Hex detonation is `BOSS_ONLY` (forced-move director).

**AI:** Hex the tile you are standing on, not a random tile.  
**ARENA_RULES:** Hex VFX distinct from Mark (color).  
**SUMMONS:** 1 archer in P2.  
**PLAYER_COUNTERPLAY:** Always have 1 MP reserved; Barrier between you and the archer; do not greed Mark-amp on a Hex tile.  
**MASTERY_OBJECTIVE:** Detonate 0 Hexes.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20.  
**BALANCE_RISKS:** 0 MP + Hex is a forced hit — he must never Hex on a turn he also Slows if you are already at 0 MP (skip Hex).  
**QA:** Hex fail uses `recordChallengeDamageTaken`. Mark amp still uses `isMark`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `unbound_pendulum`

**NAME:** The Unbound Pendulum  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A king who is a clock. The fight has a published death time.  
**CORE_MECHANIC:** Enrage is the **core**, not the overlay. Three **Metronomes** (destructible). Each broken Metronome **adds +2 to `enrageTurn`** (delay). Ignoring them is a choice.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Tick aura: every 4 turns a **pendulum line** sweeps (telegraphed file). Kit: `spell-timestep` is **not** in his kit (too on-the-nose). Use `spell-slow`, `spell-haste`, `physical_attack`. |
| 2 | ≤ 50% | Sweep every 3 turns. `spell-frost-nova`, `spell-iron-skin`. |
| Enrage | turn **16** base (his identity is early) | Sweeps every turn. Overlay +8% still applies. |

**SPELLS (proposed kit):** `physical_attack`, `spell-slow`, `spell-haste`, `spell-frost-nova` (P2), `spell-iron-skin` (P2).  
**DISCOVERABLE_SPELLS:** none. Clock director is `BOSS_ONLY`. Aftershock stays on Alabaster.

**AI:** Stand on the pendulum pivot (center file).  
**ARENA_RULES:** 3 metronomes on the rim. Breaking all 3 delays enrage to turn 22 — still not infinite.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Spend early turns on metronomes **or** race the clock; never end on the glowing file.  
**MASTERY_OBJECTIVE:** Win with **zero** metronomes broken (pure race).  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 1.20. Early enrage is the difficulty.  
**BALANCE_RISKS:** Player Timestep + Haste can mock a turn-16 clock — that is allowed (mastery of resources). Do not add a “Timestep forbidden” rule.  
**QA:** Each metronome +2 enrage, max +6. Objects 0 XP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `silent_conductor`

**NAME:** The Silent Conductor  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen of mute corridors. Her orchestra is the adds; the lanes are rest markings.  
**CORE_MECHANIC:** Summon management + **silence lanes** (rotating files: on a silenced file, **spells fizzle**, Strike still works). She conducts; the adds play.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 2 musicians (wisp + archer). One silenced file, rotates each of **her** turns. Kit: `spell-rallying-cry`, `summon-wisp`, `spell-weaken`. |
| 2 | ≤ 40% | 3 musicians (add bomber). Two silenced files. `summon-bomber`, `spell-drain-courage`. |
| Enrage | turn 21 | Whole board silenced for **her** turn only (player can still Strike / move). |

**SPELLS (proposed kit):** `spell-rallying-cry`, `summon-wisp`, `spell-weaken`, `summon-bomber` (P2), `spell-drain-courage` (P2).  
**DISCOVERABLE_SPELLS:** none. Silence lanes are `BOSS_ONLY` (would brick the spell bar in the overworld if learned). Brood Ward already covers “armor from pets.”

**AI:** Recast musicians only under cap. Stand off the player’s file so you must enter a lane.  
**ARENA_RULES:** Silence is a **file highlight**, not fog. Fizzle still spends AP (`castResultSpendsAp` includes `"fizzled"`) — that is the resource pressure.  
**SUMMONS:** Wisp / archer / bomber, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Fight from a sounding file; Strike through silence; kill the wisp first; do not dump 8 AP into a fizzle (`hard_3`).  
**MASTERY_OBJECTIVE:** Win without a fizzle.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25.  
**BALANCE_RISKS:** Full-board enrage silence + no Strike equipped. Strike is always on the bar (`physical_attack` is a base spell) — keep that true.  
**QA:** Fizzle spends AP and records `recordChallengeApSpend`. Lanes rotate on her turn, not the player’s.  
**STATUS:** PROPOSED

---

## 8.1 Encounter sheets — Wave 3 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 2: **heal-from-allied-pain** (honest Rush room 9), **forced pull**, **cover / LOS**, **player-summon as a damage key**.

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-3 learnables reuse **#120 ids only**. No new #137 spell ids.

They stay out of the 10-room Rush table except `second_lament`, which is the **remap target** for the live invalid id `weeping_pawn_2`.

---

### BOSS_ID: `second_lament`

**NAME:** The Second Lament  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** The sob left on the tile after Weeping Pawn promotes. A pawn that drinks allied pain and the player’s mistakes.  
**CORE_MECHANIC:** Destructible **Grief Well**. Incoming HP loss on the **player** (combat / reflect / lava) charges the well. On his turn he siphons the well into a heal (`LIFE_DRAIN` family, **capped at 150% start HP**). In Rush room 9, Starved’s drain quota **also** fills this well — that is the live “feeds on HP that Weeping regenerates” line made honest. Destroy the well to stop the loop.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One Grief Well opposite spawn. Kit heals are flat (Blood Mend / no % HP). Siphon once per his turn if well charge ≥ `0.08 * playerMaxHp`. |
| 2 | ≤ 45% | Well, if still up, **cracks**: 2 echo tiles (hazard, mark the tile). `spell-enrage` + `spell-sacrifice`. If the well is already down, he only gains the kit — no free well rebuild. |
| Enrage | turn 18 | Siphon ignores the well (heals `0.04 * playerMaxHp` from the air). Still capped at 150% start HP. |

**SPELLS (proposed kit):** `starter-heal`, `spell-barrier`, `spell-weaken`, `spell-enrage` (P2), `spell-sacrifice` (P2). Unique vs Weeping (`physical` / slow / weaken / iron-skin / rally) and Starved (drain kit).  
**DISCOVERABLE_SPELLS:** none. Siphon / well are `BOSS_ONLY`. `spell-cleanse-rite` and `spell-blood-familiar` stay on their #120 sources. Do not teach a third leech.

**AI:** Stand adjacent to the well. Siphon before kit casts. Sacrifice only if HP > 25% after siphon.  
**ARENA_RULES:** Well is a 1-tile object, HP = `0.15 * playerMaxHp`, not an enemy. Echo tiles count toward the 50-hazard cap.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break the well first; anti-heal is weak here (heals are object-fed, not `healRecv` on him — **explicit: siphon is not reduced by Cursed Wound**). In rush, burst Starved’s Font **and** this well or the jackpot loops.  
**MASTERY_OBJECTIVE:** Destroy the well before he siphons **twice**, then win.  
**REWARDS:** 5 / 3. Rush room 9 keeps its flat 5000 / 2000 through `applyRewards` only — do not also multiply.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.20**. Growth cap 1.50× start (tighter than Starved’s 2.00× so the pair cannot double-stack into a sponge).  
**BALANCE_RISKS:** Room 9 + Starved 200% + this 150% is still two growth loops. Wells/Fonts must both be destructible. Rally-style heals stay **flat**. Enrage siphon must not become a third uncapped drain.  
**QA:** `weeping_pawn_2` string remaps to this id. Well 0 XP. Charge from `recordChallengeDamageTaken` / `recordInBattleChallengeDamage` only (same events that already debit challenges). Killing him with the well up is a normal win.  
**STATUS:** PROPOSED

**Legacy alias:** live `BOSS_RUSH_ROOMS[9].boss2Id` is `"weeping_pawn_2"`. Implementation slice: replace that string with `"second_lament"` (or accept `weeping_pawn_2` as a deprecated alias of this id). Do **not** spawn a second `weeping_pawn`.

---

### BOSS_ID: `hook_regent`

**NAME:** The Hook Regent  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A knight who refuses to close. The board comes to him.  
**CORE_MECHANIC:** Telegraphed **linear hook** (3 tiles, LoS). Resolve pulls the player 2 tiles toward him (`applyAttract` — engine already exists, unused). He pre-paints a **landing ring** of spikes. Movement check: do not end the wind-up turn on the glowing ray. One destructible **Winch**; breaking it **skips the next hook**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Hook every 3 turns, 1-turn telegraph. Kit: Frost / Strike / Haste. |
| 2 | ≤ 45% | After a successful pull he is **off-balance** for 1 turn (rotating vuln: +40% `isPhysical`). Mark + Lifesteal Nova enter. Hook ray extends to 4 tiles. |
| Enrage | turn 20 | Hook resolves same turn as telegraph (overlay rule). Winch, if alive, breaks itself (no soft-lock). |

**SPELLS (proposed kit):** `starter-frost`, `physical_attack`, `spell-haste`, `spell-mark` (P2), `spell-lifesteal-nova` (P2). Unique vs Cavalier (physical / haste / enrage / expose) and Hexed (mark / slow / barrier).  
**DISCOVERABLE_SPELLS:** #120 `spell-hook-line` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["hook_regent"]`). Observation = he **casts** the hook (`kind: "cast"`, #156 default — one use, same-encounter win). The **full-file / 4-tile enrage reel** is `BOSS_ONLY`.

**AI:** Telegraph the ray through the player’s current tile at wind-up; do not track. Prefer hook when Chebyshev > 2 and LoS is clear.  
**ARENA_RULES:** Ray is linear + LoS. Barrier on the ray blocks the pull (existing occupancy). Spikes on the landing ring use the spike hazard type. Winch HP = `0.15 * playerMaxHp`.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step off the glow; Barrier the ray; break the Winch if you must stand still; punish the off-balance turn with Strike.  
**MASTERY_OBJECTIVE:** Never get pulled (0 successful attracts).  
**REWARDS:** 6 / 4 when shipped. Hook Line is the prize (first grant wins if a bishop already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Pull distance **fixed at 2**. Landing-ring spike tick = 3% player max HP guideline.  
**BALANCE_RISKS:** Pull + lava (Countess rush pairing later) is a delete. Do not pair him with Countess or Static until a dedicated pass. Player Hook Line stays 2-tile attract, minRange 2.  
**QA:** Telegraph tiles computed at wind-up. Attract uses `applyAttract`, not a name check. Observation counts his cast, not player Hook Line. Winch 0 XP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `ivory_palisade`

**NAME:** The Ivory Palisade  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A rook that is a wall. You do not siege HP; you open a lane.  
**CORE_MECHANIC:** Three destructible **Palisade stakes**. He has line of sight **through his own stakes**; the player does not. He rebuilds **one** missing stake every 3 turns (never above 3). Phase 2 **closes two files** (lane shrink — not Alabaster’s full-board shrink).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 3 stakes on the approach. Barrier / Expose / Weaken. He peeks through stakes and Strikes / Frosts along the open file. |
| 2 | ≤ 40% | Lane shrink (2 files become unwalkable walls, punched so a path remains). `summon-sentinel` (proposed `usableByEnemy: true` **for this kit only**) + Frost. Sentinel sits behind a stake. |
| Enrage | turn 21 | Rebuilds 1 stake per turn. Lane shrink does **not** tick further (Alabaster owns repeating shrink). |

**SPELLS (proposed kit):** `spell-barrier`, `spell-expose`, `spell-weaken`, `summon-sentinel` (P2), `starter-frost` (P2). Unique vs Fortress (physical / iron-skin / shield / barrier / frost-nova).  
**DISCOVERABLE_SPELLS:** #120 `spell-stone-turret` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["ivory_palisade"]`). Observation = the sentinel **or** a turret-shaped stake rebuild is used (`kind: "cast"` on `summon-sentinel` / future turret id). His **LOS-through-own-stakes** is `BOSS_ONLY`. `spell-ward-plate` stays rook-zone #120 discovery, not a second palisade grant.

**AI:** Never walk through a stake (he peeks). Rebuild only when a stake is down and the 3-turn cadence is up. Sentinel summoned behind cover, not on the player.  
**ARENA_RULES:** Stakes block walk and player LoS. `finalizePlayableLayout` still required after lane shrink — never seal spawn or the only approach. Stake HP = `0.15 * playerMaxHp`. Cap 3 stakes + 1 sentinel (4-body extras: sentinel only; stakes are objects).  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Break a stake to open LoS; fight from the punched path in P2; kill the sentinel before it body-blocks the last lane; DoTs around cover.  
**MASTERY_OBJECTIVE:** Win with **all 3 stakes destroyed at once** (no rebuild between the last break and the killing blow).  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Cover is the difficulty, not HP.  
**BALANCE_RISKS:** Fortress + Palisade in one rush room would be two shrinks. Do not pair them. Sentinel is player-only in live `spellData.ts` — flipping `usableByEnemy` is a **flag**, not a new asset (formations doc already allows this).  
**QA:** Lane shrink leaves a walkable path. Stakes 0 XP. Player LoS checks treat stakes as walls; boss LoS does not. Observation of Stone Turret does not fire from player Barrier.  
**STATUS:** PROPOSED

---

### BOSS_ID: `cord_familiar`

**NAME:** The Cord Familiar  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop whose soul is a leash. The flock is the only blade that can reach him.  
**CORE_MECHANIC:** **Tether gate.** He takes **25% damage** from the player unless a **player-side** summon is alive (any id). He prefers to kill that summon. Phase 2 he hatches a **false familiar** (enemy wisp) that heals him; the 4-cap and the gate stay. This is “pets as a key,” not Brood’s “larvae as armor.”

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Gate on. Mirror / Heal / Wisp. He walks to the player summon, not the player. |
| 2 | ≤ 40% | False familiar (wisp) + Dire Wolf + Sacrifice. Gate still requires a **player** summon — his wisp does not unlock you. |
| Enrage | turn 19 | Gate becomes **50%** damage taken if no player summon (was 25%). Still not immune. |

**SPELLS (proposed kit):** `summon-wisp`, `starter-heal`, `spell-mirror`, `summon-dire-wolf` (P2), `spell-sacrifice` (P2). Unique vs Conductor (rally / wisp / weaken / bomber / drain-courage) and Brood (archer / venom / iron-skin / nova).  
**DISCOVERABLE_SPELLS:** none. Gate / false familiar are `BOSS_ONLY`. `spell-brood-ward` stays Brood. `spell-blood-familiar` stays Starved. `spell-pain-link` stays Fortress. Do not mint a fourth pet card.

**AI:** Priority: kill player summons → recast his wisp if under cap → Mirror when the player is about to dump. Sacrifice only if a player summon is already dead and he is above 30% HP.  
**ARENA_RULES:** If the player brings no summon, the fight is still winnable (25% incoming is slow, not a brick) — that **is** the teach. Enrage at 50% still ends.  
**SUMMONS:** His wisp + wolf, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Keep one cheap summon up (Wisp / Bomber); do not let the wolf eat it for free; Mirror-bait with a utility cast; burst when the gate is open.  
**MASTERY_OBJECTIVE:** Keep a player summon alive the entire fight **and** never kill his false familiar (restraint).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.15. The gate is the clock, not a sponge — 25% incoming on ratio 1.60 is an 8–12 turn fight if you refuse to summon.  
**BALANCE_RISKS:** Players with no summon equipped (post-#156 innate four) must still be able to win. Gate is a reduction, never `DAMAGE_IMMUNE`. His heal is flat Blood Mend, not % HP.  
**QA:** Gate reads `side: "player"` on summons, not name. Killing his wisp does not open the gate. Mastery fails if the player summon’s HP hits 0 at any time.  
**STATUS:** PROPOSED

---

## 8.2 Encounter sheets — Wave 4 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 3: **ice as a slide tax** (Countess owns lava; Cinder owns elemental windows), **delayed tile fuse**, **forced targeting / taunt**, **pull toward a tile** (Hook owns pull-to-caster).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-4 learnables reuse **#133 ids only** (`SPELL_PROPOSALS_2026-09-01.md`). No new #137 spell ids.

They stay out of the 10-room Rush table. Pairing is **Table B** only (§10.1).

**Hazard-on-forced-move prereq:** MIMA-2026-08-31-001 (Swap × hazards) and MIMA-2026-08-31-005 (push/pull × hazards) are still OPEN. Wave-4 **position** changes (slide, well attract, Swap) are legal without those PRs. Ice MP-tax and fuse occupancy ticks **on a forced move** must not be assumed until those pairs land. Until then, rime tax / fuse tick only on **walk enter** and **turn-start occupancy**.

---

### BOSS_ID: `rime_margrave`

**NAME:** The Rime Margrave  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of hoarfrost. The file is a gutter. Step wrong and the ice takes you.  
**CORE_MECHANIC:** Ice **slide**. He paints a cardinal file in rime (`hazardType: "ice"`). Fail the movement check (end the turn on a rime tile, or be pushed/pulled onto one **after** MIMA-005) and you **slide 2 tiles** further along that file (forced move, LoS along the file, stop at occupancy / void / barrier). Distinct from Countess (burn wake), Cinder (element window), and Slow (unit MP debuff). The learnable is **one rime cell**, not the gutter.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Telegraph a 5-tile rime file (1-turn wind-up). Kit: Frost / Slow / Barrier. Slide is 2 tiles, 0 HP. Ice tax is +1 MP for the next walk step (#133 rule). |
| 2 | ≤ 45% | Two rime files (rank **or** file, never both on the same turn). Frost Nova + Expose. One destructible **Brazier**; breaking it **clears rime** for 2 turns (does not stop the next telegraph). |
| Enrage | turn 20 | Slide becomes 3 tiles. Overlay damage still +8%/stack — the ice itself stays 0 HP. |

**SPELLS (proposed kit):** `starter-frost`, `spell-slow`, `spell-barrier`, `spell-frost-nova` (P2), `spell-expose` (P2). Unique vs Cinder (`inferno` / frost / haste / expose / enrage), Hook (frost / physical / haste / mark / nova), Ivory (barrier / expose / weaken / sentinel / frost), Pendulum (physical / slow / haste / nova / iron-skin).  
**DISCOVERABLE_SPELLS:** #133 `spell-rime-tile` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["rime_margrave"]`). Observation = he **paints** rime (`kind: "cast"` on the rime verb, #156 default). `RIME_SLIDE` (full-file gutter + 2-tile forced move) is `BOSS_ONLY`. Ember Step / Cinder Tile stay burn.

**AI:** Telegraph the file the player is on at wind-up; do not track. Prefer Barrier on the **escape** rank after a slide.  
**ARENA_RULES:** Rime uses existing ice hazard type, cap 50. Slide stops at units / barriers / void / map edge. Brazier HP = `0.15 * playerMaxHp`. `finalizePlayableLayout` after any rime paint — never ice-lock spawn.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step off the glow; Barrier the gutter; break the Brazier if you must stand still; Haste to pay the ice tax; do not end adjacent to a wall on a rime file (slide into a wall is still a failed check — ice tax only, no extra HP).  
**MASTERY_OBJECTIVE:** Win with **zero** slides (`rime_skater`).  
**REWARDS:** 6 / 4 when shipped. Rime Tile is the prize (first grant wins if a bishop already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Slide distance **fixed**. Ice tax **fixed at +1 MP**.  
**BALANCE_RISKS:** Slide + Hook is a delete until MIMA-005. Do not pair him with Hook, Countess, or Static. Player Rime Tile is one cell, 3 turns, 0 HP.  
**QA:** Telegraph tiles computed at wind-up. Observation counts his paint, not player Rime Tile. Brazier 0 XP. Ice walk uses the same MP-tax path map ice already uses; challenge HP is **not** credited (0 damage). Forced-move ice tax waits on MIMA-005.  
**STATUS:** PROPOSED

---

### BOSS_ID: `wick_prelate`

**NAME:** The Wick Prelate  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A bishop who lights the floor and waits. The sermon is the countdown.  
**CORE_MECHANIC:** Delayed **fuse** tiles. He telegraphs a pattern; two world turns later the occupied cells detonate (spell-hit, RES+SR, `recordChallengeDamageTaken` — #133 Fuse Tile bind). One destructible **Snuffer**; breaking it **adds +1 to every live fuse’s remaining turns** (once per Snuffer). Distinct from Grave Bell (unit execute), Inferno (immediate DoT), and Fetid rot (stacking, no tile). The learnable is **one cell, radius 0**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Every 3 turns: 1-turn telegraph, then 2 fuses on the player’s tile **at wind-up** and the diagonal escape. Kit: Mark / Poison / Barrier. Mark does **not** amp fuses (explicit: environmental, no `isMark`). |
| 2 | ≤ 40% | `WICK_PATTERN`: 3-fuse **diagonal cross** (his color complex). Inferno + Bomber. Bomber death does **not** arm a fourth fuse (cap the pattern). |
| Enrage | turn 21 | Fuses tick in **1** world turn (was 2). Snuffer, if alive, breaks itself (no soft-lock). |

**SPELLS (proposed kit):** `spell-mark`, `starter-poison`, `spell-barrier`, `spell-inferno` (P2), `summon-bomber` (P2). Unique vs Hexed (mark / slow / barrier / expose / archer), Archivist (cursed / mark / barrier / archer / veil), Conductor (rally / wisp / weaken / bomber / drain), Fetid (venom / poison / cursed / nova).  
**DISCOVERABLE_SPELLS:** #133 `spell-fuse-tile` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["wick_prelate"]`). Observation = he **places** a fuse (`kind: "cast"`). The **3-fuse cross / 1-turn enrage wick** is `BOSS_ONLY`. `spell-ignite-stacks` stays elite ENEMY_DISCOVERY — do not also grant it here. `spell-rot-brand` stays Fetid.

**AI:** Place fuses on the wind-up tile, not the current tile at tick. Recast Bomber only under cap. Never fuse a portal / spawn cell.  
**ARENA_RULES:** Fuse table is **not** `hazardTiles` (those are lava/spikes/void). Cap **8** live fuses (pattern + leftovers). Snuffer HP = `0.15 * playerMaxHp`. Last writer on a cell wins (Barrier replaces fuse).  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. Bomber inferno is kit, not a fuse.  
**PLAYER_COUNTERPLAY:** Leave the glow; Barrier the cell; break the Snuffer to buy a turn; do not Mark-amp greed on a fused tile (it will not amp).  
**MASTERY_OBJECTIVE:** Break the Snuffer **before the first fuse ticks**, then win (`wick_douser`).  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Fuse damage is **flat 22 at L1 reference**, then SP-scaled like other kit hits — **not** % HP. Turns fixed.  
**BALANCE_RISKS:** Fuse + Sinkhole (intended #133 combo) needs occupancy-at-tick, not enter-tick. Swap onto a fuse is MIMA-001. Do not pair with Pendulum until Table B’s “one clock” rule. Player Fuse Tile is one cell, 2 turns, radius 0.  
**QA:** Telegraph computed at wind-up. Observation counts his place, not player Fuse. Snuffer 0 XP. Challenge bind is `recordChallengeDamageTaken` (spell-hit). Caster death does not cancel live fuses.  
**STATUS:** PROPOSED

---

### BOSS_ID: `goad_pretender`

**NAME:** The Goad Pretender  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A pawn in a stolen crown. He insists you look at him. The crown is a lie with a body.  
**CORE_MECHANIC:** Forced targeting. A destructible **Pretender Crown** sits on his tile’s neighbor. While it stands, the player’s next **damaging** action must choose him if he is a legal target (`tauntNextHit` — #133 Goad). Phase 2 he hatches a **decoy** (one extra pawn body, 25% of his effective HP). Goad may point at the **decoy**. Distinct from Grandmaster (three illusions, Swap identity), Cord (player-summon gate), and Hexed (leave-this-tile). The learnable is **one-action taunt on a real caster**, not decoy-goad.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Crown up. Kit: Strike / Shield / Weaken. Taunt duration 1 action. Non-damage tools (Slow, Barrier, Haste, Mark) ignore it. |
| 2 | ≤ 40% | Decoy spawns adjacent. Crown, if still up, can **reattach** Goad to the decoy. Enrage + Iron Skin. If the Crown is already down, Phase 2 is kit-only — no free Crown rebuild. |
| Enrage | turn 19 | Taunt lasts until **his** next turn (was 1 action). Decoy, if alive, also Goads (two legal forced targets — player may hit **either**). |

**SPELLS (proposed kit):** `physical_attack`, `starter-shield`, `spell-weaken`, `spell-enrage` (P2), `spell-iron-skin` (P2). Unique vs Fortress (physical / iron-skin / shield / barrier / frost-nova), Weeping (physical / slow / weaken / iron / rally), Cavalier (physical / haste / enrage / expose), Lament (heal / barrier / weaken / enrage / sacrifice).  
**DISCOVERABLE_SPELLS:** #133 `spell-goad` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["goad_pretender"]`). Observation = he **applies** taunt (`kind: "cast"`). `CROWN_GOAD` (taunt that can attach to the decoy / last until his turn) is `BOSS_ONLY`.

**AI:** Goad when the player is in Strike/spell range of a **lower-HP** ally (decoy, or a rush partner). Skip if he is the only legal damage target. Prefer Weaken into the forced Strike.  
**ARENA_RULES:** Crown is an object, HP = `0.15 * playerMaxHp`, not an enemy. Decoy is a body, counts toward the 4-extra cap, 0 XP. Decoy does **not** share HP with him (Midnight owns shared pools). Killing the decoy is not victory.  
**SUMMONS:** 1 decoy in P2. Cap 4.  
**PLAYER_COUNTERPLAY:** Cast a tool; walk out of range so taunt drops; break the Crown; AoE that already includes him **satisfies** the taunt (#133). Do not dump Sacrifice into the decoy.  
**MASTERY_OBJECTIVE:** Win without ever damaging the decoy (`unmasked_pretender`). Killing him without spawning the decoy (Phase-1 kill) also passes.  
**REWARDS:** 5 / 3 when shipped. Goad is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Decoy HP = 25% of **his** effective max. Taunt does not add damage.  
**BALANCE_RISKS:** Taunt + Palisade (Table B) forces a walk around stakes — that is the intended exam, not a brick (`finalizePlayableLayout` still punches a path). Taunt + Cord gate would require a summon **and** a forced target — do not pair. Player Goad cannot attach to summons the caster does not own.  
**QA:** Targeting UI must read `tauntCasterId` (metadata), not the name “Goad.” Observation counts his cast. Crown 0 XP. Decoy death ≠ victory. AoE that includes the goader consumes the taunt.  
**STATUS:** PROPOSED

---

### BOSS_ID: `sinkhole_dowager`

**NAME:** The Sinkhole Dowager  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A queen whose throne is a drain. The board leans toward a hole she chose.  
**CORE_MECHANIC:** Pull **toward a tile**, not toward her. One destructible **Wellhead**. Every 3 turns she telegraphs a Chebyshev radius-2 sink (1-turn wind-up); resolve pulls each hostile in the radius **1 step toward the well** (`applyAttract`, attractor = the tile — engine exists, unused). Distinct from Hook (single target, toward caster), Void Anchor / Collapse (toward caster + damage), and Swap (pairwise). The learnable is **one radius-2, distance-1 pull**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Wellhead opposite spawn. Kit: Swap / Frost / Barrier. Sink every 3 turns. Breaking the Wellhead **skips the next sink**. |
| 2 | ≤ 45% | Radius stays 2 but she **Marks** the well cell (next **spell** there ×2 — still not fuse/ice). Lifesteal Nova + Shadow Veil. If the Wellhead is down, she may **rebuild it once** (3-turn cadence, never two wells). |
| Enrage | turn 22 | Pull distance becomes **2** (was 1). Wellhead, if alive, cracks into a 1-tile pit (unwalkable, **one** hole — Starborn owns many voids). Overlay +8% still applies. |

**SPELLS (proposed kit):** `spell-swap`, `starter-frost`, `spell-barrier`, `spell-lifesteal-nova` (P2), `spell-shadow-veil` (P2). Unique vs Starborn (blast / mark / frost-nova / veil), Grandmaster (blast / swap / mirror / timestep / frost), Hook (frost / physical / haste / mark / nova), Sovereign (blast / mirror / mark / veil / swap), Enthroned (swap / slow / wolf / veil / frost).  
**DISCOVERABLE_SPELLS:** #133 `spell-sinkhole` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["sinkhole_dowager"]`). Observation = she **casts** the well pull (`kind: "cast"`). `WELL_TIDE` (rebuild + enrage distance-2 + pit) is `BOSS_ONLY`. Hook Line stays Hook Regent / #120.

**AI:** Telegraph the well, not the player. Prefer Swap when the player is radius 3 (just outside). Nova only after a successful cluster (2+ bodies in radius 2 — usually rush, or a player summon).  
**ARENA_RULES:** Wellhead is an object, HP = `0.15 * playerMaxHp`. Enrage pit is one void tile; never pit spawn, portal, or the only approach (`finalizePlayableLayout`). Pull does not go through void. Occupied well cell is legal (attract stops short).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Stand at radius 3; Barrier between you and the hole; break the Wellhead; body-block with a summon; do not Swap yourself onto the Marked well.  
**MASTERY_OBJECTIVE:** Never get pulled (0 successful attracts) (`well_walker`).  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 1.25. Pull distance **fixed at 1** until enrage. Radius **fixed at 2**.  
**BALANCE_RISKS:** Well + Wick fuses is the #133 intended combo — **Table B does not pair them** until occupancy-at-tick is tested. Well + Rime is MIMA-005. Well + Hook is two attract verbs — illegal. Player Sinkhole is distance 1, CD 3, 0 damage.  
**QA:** Telegraph at wind-up. Attract uses `applyAttract` with tile attractor, not a name check. Observation counts her cast. Wellhead 0 XP. Enrage pit does not seal the map. Swap onto the well does **not** tick ice/fuse until MIMA-001.  
**STATUS:** PROPOSED

---

## 8.3 Encounter sheets — Wave 5 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 4: **knockback away from the caster** (Hook owns pull-to-him; Dowager owns pull-to-a-well), **open pits** (Barrier and Palisade both block LoS; pits do not), **walk-MP tithe** (Hex is leave-this-tile; Goad is forced targeting; Still Brand is a discovery pack), **delayed painted blink** (Grandmaster Swap is instant; Twin Gate pads already stamp Void Grandmaster).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-5 learnables reuse **#120 / #282 / #342 ids only**. No new #137 spell ids.

They stay out of rooms 0–9 and Table B. Pairing is **Table C** only (§10.2).

**Hazard-on-forced-move prereq:** MIMA-2026-08-31-001 and MIMA-2026-08-31-005 are still OPEN (#336). Wave-5 **position** (ram landing, delayed blink) is legal without those PRs. Hazard ticks **on a shoved or blinked landing** must not be assumed until those pairs land. Until then, lava/spike/ice tax only on **walk enter** and **turn-start occupancy**.

---

### BOSS_ID: `ram_castellan`

**NAME:** The Ram Castellan  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook who is a siege ram. The file is a corridor. He does not chase; the wall comes to you.  
**CORE_MECHANIC:** Telegraphed **shove away from him**. 1-turn wind-up paints a 4-tile cardinal ray through the player’s tile at telegraph time. Resolve: `applyPushback` **2** along that ray (`from` = his tile). If the landing cell is a wall, Barrier, or map edge, **wall-slam** (spell-hit, `recordChallengeDamageTaken`, L1 reference 12 then SP-scaled — **not** % HP). Distinct from Hook (attract toward caster), Dowager (attract toward a well), Gale Fan (cone + 1-tile pack push), and Board Tilt (mass shove of everyone). The learnable is **one-body melee shove**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Ram every 3 turns. Kit: Strike / Haste / Shield. One destructible **Brace**; breaking it **skips the next ram**. |
| 2 | ≤ 45% | After a successful slam he is **off-balance** 1 turn (rotating vuln: +40% `isPhysical`). Barrier + Rally enter — he plants a wall **behind** you on the ray so the next shove has a slam face. |
| Enrage | turn 20 | Ram resolves same turn as telegraph (overlay rule). Brace, if alive, breaks itself. Push stays **2** (do not scale distance). |

**SPELLS (proposed kit):** `physical_attack`, `spell-haste`, `starter-shield`, `spell-barrier` (P2), `spell-rallying-cry` (P2). Unique vs Cavalier (`physical` / haste / enrage / expose), Goad (`physical` / shield / weaken / enrage / iron-skin), Fortress (`physical` / iron-skin / shield / barrier / frost-nova), Hook (frost / physical / haste / mark / nova), Pendulum (physical / slow / haste / nova / iron-skin).  
**DISCOVERABLE_SPELLS:** #120 `spell-shoulder-bash` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["ram_castellan"]`). Observation = he **casts** the ram (`kind: "cast"`, #156 default — one use, same-encounter win). `WALL_RAM` (4-tile ray / wall-slam extra / planted slam-face) is `BOSS_ONLY`. Do **not** also grant `spell-gale-fan` (cone+push) or `spell-board-tilt` from this fight.

**AI:** Telegraph the ray through the player’s current tile at wind-up; do not track. Prefer ram when Chebyshev ≥ 2 and a wall/Barrier exists 2 tiles behind the player on that file. Skip if the only landing is spawn / portal (`finalizePlayableLayout`).  
**ARENA_RULES:** Ray is linear + LoS. Barrier on the ray **blocks** the shove (existing occupancy). Brace HP = `0.15 * playerMaxHp`. Phase-2 planted Barrier is a 1-tile object, 2 turns, same as kit Barrier.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step off the glow; Barrier the ray; break the Brace if you must stand; punish the off-balance turn with Strike; do not stand with a wall at your back.  
**MASTERY_OBJECTIVE:** Never wall-slam (`ram_unmoved`). A shove that stops on an empty tile still counts as a shove, not a slam — mastery fails only on slam HP.  
**REWARDS:** 6 / 4 when shipped. Shoulder Bash is the prize (first grant wins if a pack already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Push distance **fixed at 2**. Slam is kit-scaled, not % HP.  
**BALANCE_RISKS:** Ram + pits / lava / rime is a delete until MIMA-005. Do not pair with Fosse, Hook, Rime, Dowager, or Countess. Player Shoulder Bash stays 1-tile hostile shove, melee range.  
**QA:** Telegraph tiles computed at wind-up. Push uses `applyPushback`, not a name check. Observation counts his cast, not player Shoulder Bash. Brace 0 XP. Landing lava/spike does **not** tick until MIMA-005. Challenge slam uses `recordChallengeDamageTaken`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `fosse_warden`

**NAME:** The Fosse Warden  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A bishop of the moat. The pit is not darkness; you can see the other bank. You just cannot walk it.  
**CORE_MECHANIC:** **Open pits** — walk-block, **LoS-open** (`isPit: true`, not Barrier). He paints 3 pit tiles (Chebyshev, never on spawn / portal / the only approach). You may Strike and spell **across** them. Walking onto a pit **fails** (MP spent, no move, small spike-tick guideline). One destructible **Causeway** plank; standing on it is the only walk across a pit file. Distinct from Ivory (stakes block player LoS), Barrier (blocks both), Queen void (holes that also eat LoS in the intended VOID_TILES fantasy — still unwired), and Open Pit the spell (one cell). The learnable is **one pit cell**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 3 pits + 1 Causeway. Kit: Barrier / Frost / Slow. He peeks across pits (LoS open) and Frosts the far bank. |
| 2 | ≤ 40% | `PIT_LATTICE`: 5 pits (rebuilds up to 5, never above). Veil + Wisp. Wisp sits on the far bank. Causeway, if down, may **rebuild once** (3-turn cadence). |
| Enrage | turn 21 | Rebuilds 1 pit per turn, cap still 5. Causeway, if alive, cracks (no soft-lock). Lattice does **not** seal spawn (`finalizePlayableLayout`). |

**SPELLS (proposed kit):** `spell-barrier`, `starter-frost`, `spell-slow`, `spell-shadow-veil` (P2), `summon-wisp` (P2). Unique vs Hexed (mark / slow / barrier / expose / archer), Rime (frost / slow / barrier / nova / expose), Palisade (barrier / expose / weaken / sentinel / frost), Dowager (swap / frost / barrier / nova / veil), Conductor (rally / wisp / weaken / bomber / drain).  
**DISCOVERABLE_SPELLS:** #282 `spell-open-pit` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["fosse_warden"]`). Observation = he **paints** a pit (`kind: "cast"`). `PIT_LATTICE` (5 cells / causeway director) is `BOSS_ONLY`. Ivory’s LoS-through-own-stakes stays Palisade.

**AI:** Never walk a pit (he peeks). Frost the player across a pit when LoS is clear. Recast Wisp only under cap, on the far bank. Rebuild Causeway only if the player is stranded with no walk path — never to trap them (`finalizePlayableLayout` after every pit paint).  
**ARENA_RULES:** Pits are **not** `hazardTiles` lava/spikes/void (those cap 50). Cap **5** pits + 1 Causeway object. Causeway HP = `0.15 * playerMaxHp`. Failed walk-onto-pit spends the walk MP and applies the spike-tick guideline through `recordInBattleChallengeDamage` if `inBattleRef`. LoS traces treat pits as empty.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Fight from the bank; shoot across; break a pit? **No** — pits are not damaged; break the **Causeway** only if you need the crossing (or leave it up as your bridge). DoT / Frost around cover.  
**MASTERY_OBJECTIVE:** Never attempt a walk onto a pit (`fosse_dry`). Using the Causeway is allowed.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Pit **count** fixed. Failed-step tick is the spike guideline, not a sponge.  
**BALANCE_RISKS:** Fosse + Ram (shove into pits) waits on MIMA-005. Fosse + Ivory is two walk-block geometries that can seal — illegal. Player Open Pit is one cell, 2 turns, LoS-open.  
**QA:** After every pit paint, spawn and at least one approach stay walk-reachable. Observation counts his paint, not player Open Pit. Causeway 0 XP. Player LoS crosses pits; walk does not. Failed pit-step spends MP and records challenge damage if it ticks.  
**STATUS:** PROPOSED

---

### BOSS_ID: `stride_censor`

**NAME:** The Stride Censor  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A king who taxes motion. The heresy is the second step.  
**CORE_MECHANIC:** **Walk-MP tithe.** At the start of **his** turn, if the player spent ≥ 1 MP on **walking** since his last turn (`movedThisTurn` / walk debit — explicit flag, not “changed tile via Swap”), he brands them (spell-hit, L1 reference 8 then SP-scaled, `recordChallengeDamageTaken`) and Slow. Standing still, tool-casting, and Strike are safe. Distinct from Hex (leave this tile or the Hex detonates — that **requires** a walk), Goad (forced target), Still Brand (pack: punish standing), and Eternal (AP drain aura). The learnable is **one-target moved-this-turn poke**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Tithe on his turn if you walked. Kit: Slow / Haste / Weaken. He Hastes himself and walks to you — he is allowed to move. |
| 2 | ≤ 40% | `MARCH_TITHE`: if **any** player-side body walked (you or a summon), the brand hits the **walker**. Drain Courage + Iron Skin. One destructible **Ledger**; breaking it **skips the next tithe**. |
| Enrage | turn 19 | Tithe also fires if you **Swapped** or were shoved (forced move counts). Ledger, if alive, breaks itself. Overlay +8% still applies. |

**SPELLS (proposed kit):** `spell-slow`, `spell-haste`, `spell-weaken`, `spell-drain-courage` (P2), `spell-iron-skin` (P2). Unique vs Eternal (slow / drain-courage / iron-skin / cursed-wound), Pendulum (physical / slow / haste / nova / iron-skin), Conductor (rally / wisp / weaken / bomber / drain), Cavalier (physical / haste / enrage / expose), Cinder (inferno / frost / haste / expose / enrage).  
**DISCOVERABLE_SPELLS:** #282 `spell-stride-brand` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["stride_censor"]`). Observation = he **applies** the tithe (`kind: "cast"`). `MARCH_TITHE` (any player-side walker / enrage forced-move tax) is `BOSS_ONLY`. Still Brand stays SDE pack. Hex detonation stays Hexed Marker.

**AI:** Walk into Strike range only if the player did **not** walk last cycle (you are the one who should be still). Slow first when they have MP leftover. Skip Drain if they are already at 0 AP.  
**ARENA_RULES:** Ledger is an object, HP = `0.15 * playerMaxHp`. `movedThisTurn` is a battle flag cleared at the start of the player’s turn after the Censor has resolved — Swap in Phase 1 does **not** count (Grandmaster owns Swap identity). Enrage is the only beat that taxes forced move.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** End your turn on the tile you started (0 walk MP); kite with Swap only in P1; Strike / Slow from here; break the Ledger if you must reposition; do not walk a summon either in P2.  
**MASTERY_OBJECTIVE:** Spend **0** walk MP the entire fight (`stride_still`). Summon walks fail it in P2. Swap-only reposition in P1 is allowed.  
**REWARDS:** 5 / 3 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Brand is kit-scaled, not % HP. Walk tax is binary.  
**BALANCE_RISKS:** Stride + Pendulum is two “do not stall / do not walk” clocks — illegal. Stride + Goad forces a walk into the brand — illegal. Players with 0 MP leftover from ice tax can still Strike.  
**QA:** Flag reads walk-MP debit, not `x,y` inequality (Swap / ram / well must not false-positive in P1). Observation counts his tithe, not player Stride Brand. Ledger 0 XP. Challenge brand uses `recordChallengeDamageTaken`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `morrow_herald`

**NAME:** The Morrow Herald  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A queen who arrives tomorrow. The tile she names is already hers; she is merely late.  
**CORE_MECHANIC:** **Delayed painted blink.** Every 3 turns she Marks a landing tile (1-turn paint, distinct VFX from `spell-mark` amp). At the **start of her next turn** she blinks there (`effectParams` delayed teleport — same family as #342 Morrow Step). The vacated tile leaves a 1-turn **echo** hazard (spike guideline). Movement check: do not **end** your turn on the painted landing. Distinct from Grandmaster (instant Swap with you), Twin Gate (two pads, already a Void Grandmaster `BOSS` grant), Vault (once/battle knight blink), and Mist Step (instant 3-tile). The learnable is **paint now, self-teleport next turn start**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Paint every 3 turns. Kit: Swap / Haste / Drain. If you stand on the landing at resolve, you are **shoved 1** toward spawn (`applyPushback`) and she still lands. |
| 2 | ≤ 45% | `MORROW_ECHO`: vacated tile echo lasts **2** turns. Mirror + Dire Wolf. Wolf spawns on the **old** tile (the echo), not the landing. One destructible **Hour-bell**; breaking it **cancels the next pending blink** (paint clears). |
| Enrage | turn 22 | Paint resolves **same turn** (overlay collapses the delay). Hour-bell, if alive, breaks itself. Echo still 2 turns. |

**SPELLS (proposed kit):** `spell-swap`, `spell-haste`, `starter-drain`, `spell-mirror` (P2), `summon-dire-wolf` (P2). Unique vs Grandmaster (blast / swap / mirror / timestep / frost-nova), Sovereign (blast / mirror / mark / veil / swap), Enthroned (swap / slow / veil / frost-nova / wolf), Cord (wisp / heal / mirror / wolf / sacrifice), Lich (cursed / swap / mark / veil / wisp).  
**DISCOVERABLE_SPELLS:** #342 `spell-morrow-step` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["morrow_herald"]`). Observation = she **paints** a landing (`kind: "cast"` on the arming — #342: arming is observation, the later teleport is not a second observe). `MORROW_ECHO` (leftover echo + occupancy shove + Hour-bell director) is `BOSS_ONLY`. Twin Gate stays Void Grandmaster. Vault stays Cavalier.

**AI:** Paint a tile Chebyshev 3 from the player at wind-up, with LoS, never spawn / portal / a pit (if paired later). Skip paint if Hour-bell was broken this cycle. Wolf only under cap, on the vacated tile.  
**ARENA_RULES:** Hour-bell HP = `0.15 * playerMaxHp`. Echo uses spike hazard type, cap 50. Occupied landing: shove the occupant 1 (`applyPushback` from the landing toward spawn), then she occupies. If shove is illegal, she **cancels** and recasts next cycle (never stack two bodies).  
**SUMMONS:** 1 wolf in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Leave the glow; Barrier the landing; break the Hour-bell; Swap her paint onto a useless file; Mirror the Drain after she lands adjacent.  
**MASTERY_OBJECTIVE:** Never occupy a painted landing at any end-of-turn (`morrow_unvisited`). Being shoved off as she lands still **fails** mastery (you were on it).  
**REWARDS:** 6 / 4 when shipped. Morrow Step is the prize (first grant wins if a lurker already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 1.25. Delay **fixed at 1 turn** until enrage. Echo tick is the spike guideline.  
**BALANCE_RISKS:** Morrow + Grandmaster is two teleports — illegal. Morrow + Twin Gate pads is two delayed-position verbs — illegal. Occupancy shove onto lava waits on MIMA-005. Player Morrow Step is self-only, 1-turn delay, no echo.  
**QA:** Paint tiles computed at wind-up. Observation counts arming, not the later blink. Hour-bell 0 XP. Echo 0 XP. Two bodies never share a cell. Challenge echo uses `recordInBattleChallengeDamage` if walked, `recordChallengeDamageTaken` if she slams you.  
**STATUS:** PROPOSED

---

## 8.4 Encounter sheets — Wave 6 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 5: **axis walk lock** (Hex detonates if you *stay*; Stride brands if you *walk*; Palisade and Fosse change *which cells exist*; none constrain the *axis*), **bait intercept** (Goad forces a target; Grandmaster fakes *bodies*; neither eats the next spell aimed at the owner), **stationary heal font** (Archbishop wisp *walks*; Lament well siphons *allied pain*; neither is a planted totem), **leftover-AP evade** (Eternal drains *current* AP; Stride taxes *walk MP*; neither cares that you ended the turn with 2 AP in the bank).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-6 learnables reuse **#282 / #342 ids only**. No new #137 spell ids.

They stay out of rooms 0–9, Table B, and Table C. Pairing is **Table D** only (§10.3).

**Hazard-on-forced-move prereq:** MIMA-2026-08-31-001 and MIMA-2026-08-31-005 are still OPEN (#336). Wave-6 cores do **not** require those PRs (lock is a walk filter; bait is intercept; font is a pulse; surplus is leftover AP). Do not pair Lock with Ram / Hook / Rime / Dowager until 005.

---

### BOSS_ID: `lock_marshal`

**NAME:** The Lock Marshal  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the curfew. The city still has streets. You are allowed one of them.  
**CORE_MECHANIC:** Telegraphed **walk-axis lock**. 1-turn wind-up paints the player’s current rank **or** file (dominant axis of Marshal → player at telegraph time; cardinal preferred). Resolve: for **2 turns** the player may only **walk** to cells that share that axis with their position at resolve (`walkAxisLockTurns` — same family as #282 Rank Lock). Forced movement (Swap / shove / slide / gate) **is allowed**. Distinct from Hex (must *leave* a tile), Stride (tax for walking at all), Root (0 walk), Palisade (LoS cover), Fosse (pits). The learnable is **one-target, 2-turn, walk-only axis lock**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Curfew every 3 turns, 2-turn lock. Kit: Strike / Slow / Mark. One destructible **Compass**; breaking it **clears the current lock**. |
| 2 | ≤ 45% | `AXIS_CURFEW`: lock lasts **3** turns. Iron Skin + Frost Nova. After a lock applies, rotating vuln Window C: +40% from the **locked line** (rank/file hits). Compass, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Curfew resolves same turn as telegraph. Compass, if alive, breaks itself. Lock duration stays 3 (do not scale). Overlay +8%. |

**SPELLS (proposed kit):** `physical_attack`, `spell-slow`, `spell-mark`, `spell-iron-skin` (P2), `spell-frost-nova` (P2). Unique vs Pendulum (`physical` / slow / haste / nova / iron-skin — haste vs mark), Hexed (mark / slow / barrier / expose / archer), Ram (`physical` / haste / shield / barrier / rally), Cavalier (`physical` / haste / enrage / expose).  
**DISCOVERABLE_SPELLS:** #282 `spell-rank-lock` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["lock_marshal"]`). Observation = he **applies** a lock (`kind: "cast"`). `AXIS_CURFEW` (3-turn / line vuln / Compass director) is `BOSS_ONLY`. Player Rank Lock is one enemy, 2 turns, CD 3, walk-only.

**AI:** Telegraph the axis the player already shares. Prefer the file if `|dx| >= |dy|`. Skip if Compass was broken this cycle. Frost Nova only when the player is on the locked line and adjacent-or-2. Never lock the only path to spawn (`finalizePlayableLayout` after apply).  
**ARENA_RULES:** Compass HP = `0.15 * playerMaxHp`. Walk preview and execute both reject off-axis dests. Summon-control walks honor the lock. Cleanse / Absolve / Dispel Thread strip via `cleanseTypes` include `"walkAxisLock"` — not via name.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step off the glow before resolve; Swap / tool-cast from the locked line; break the Compass; Strike along the line (Window C is a gift if you have a line spell); do not path off-axis.  
**MASTERY_OBJECTIVE:** Never attempt an off-axis walk (`lock_cardinal`). Failed preview clicks count. Forced moves off-axis do **not** fail mastery.  
**REWARDS:** 6 / 4 when shipped. Rank Lock is the prize (first grant wins if an elite rook already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Lock **duration** 2 then 3. Axis count is 1.  
**BALANCE_RISKS:** Lock + Fosse / Hex / Palisade can seal. Lock + Ram / Hook / Rime is forced-off-axis onto hazards (MIMA-005). Table D pairs with Wick only, fuses off the locked file. Player Rank Lock cannot paint the whole board.  
**QA:** Telegraph tiles computed at wind-up. Observation counts his apply, not player Rank Lock. Compass 0 XP. Off-axis walk spends no MP (reject before debit). Forced move still legal. Challenge: lock is not a hit.  
**STATUS:** PROPOSED

---

### BOSS_ID: `bait_vicar`

**NAME:** The Bait Vicar  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop who is never the first body you see. The reliquary in front of him is hungry.  
**CORE_MECHANIC:** **Bait pylon.** He plants a 1-HP stationary intercept (`summonAI: "bait"`, lifespan 3, Chebyshev ≤ 2 of him). The **next hostile spell** that would damage / debuff / DoT **him** is redirected to the pylon; the pylon dies on intercept. Distinct from Goad (forced targeting), Grandmaster (fake HP bodies), Mirror (reflect to caster), Pain Link (share). The learnable is **one intercept totem**. Spectacular `FALSE_RELIQUARY`: **Strike or AoE that includes the pylon** also reflects 50% of that hit to the player (`recordChallengeDamageTaken`) — that reflect is `BOSS_ONLY`.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | One pylon. Kit: Mirror / Mark / Shield. If you Strike the pylon, `FALSE_RELIQUARY` reflects (P1: 25% of the Strike, L1 reference). Spell intercept still eats the spell. |
| 2 | ≤ 40% | Weaken + Sentinel. Pylon rebuild 3-turn cadence if dead. Sentinel is a second body (cap 4). Reflect on Strike/AoE becomes 50%. One destructible **Censer**; breaking it **suppresses reflect** until rebuilt (intercept remains). |
| Enrage | turn 19 | Pylon, if dead, replants immediately. Censer, if alive, breaks itself. Overlay +8%. Intercept range stays 2. |

**SPELLS (proposed kit):** `spell-mirror`, `spell-mark`, `starter-shield`, `spell-weaken` (P2), `summon-sentinel` (P2). Unique vs Goad (`physical` / shield / weaken / enrage / iron-skin), Sovereign (blast / mirror / mark / veil / swap), Palisade (barrier / expose / weaken / sentinel / frost), Cord (wisp / heal / mirror / wolf / sacrifice).  
**DISCOVERABLE_SPELLS:** #342 `spell-bait-pylon` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["bait_vicar"]`; #342 is already `ELITE` — first grant wins). Observation = he **plants** a pylon (`kind: "cast"`). `FALSE_RELIQUARY` (Strike/AoE reflect / Censer director) is `BOSS_ONLY`. Player Bait Pylon intercepts the next hostile **spell** aimed at the owner; it does **not** reflect melee.

**AI:** Plant if no pylon lives and Chebyshev to player ≥ 2. Skip plant if Censer was broken this cycle **and** intercept would be the only tool (he still plants for intercept). Sentinel behind him, not in front of the pylon.  
**ARENA_RULES:** Pylon is a summon, 1 HP, 0 XP, lifespan 3. Censer is an object, HP = `0.15 * playerMaxHp`, 0 XP. Intercept order: Bait **before** Mirror (same as #342). AoE that includes owner + pylon: owner share eaten, rest of wedge still hits others. Walks / lava / Sacrifice self-HP do not intercept.  
**SUMMONS:** 1 bait pylon; +1 sentinel in P2. Cap 4. 0 XP. Pylon death ≠ victory.  
**PLAYER_COUNTERPLAY:** Strike him, not the pylon; kill the pylon with a cheap tool **only if** you accept P1 25% reflect; wait the lifespan; aim a wedge so he is outside intercept range 2; break the Censer to stop melee reflect.  
**MASTERY_OBJECTIVE:** Never deal HP to the pylon (`unfooled_vicar`). Intercepted spells still **fail** mastery (the pylon took the hit).  
**REWARDS:** 5 / 3 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Intercept is binary. Reflect is a percent of **that hit**, not of player max HP.  
**BALANCE_RISKS:** Bait + Goad is two targeting tricks — illegal. Bait + Ram collision into the pylon waits on occupancy. Player pylon cannot reflect Strike. `summonAI: "bait"` must be an allowed admin string (unknown AI is rejected today).  
**QA:** Observation counts plant, not intercept. Pylon / Censer / Sentinel 0 XP. Challenge reflect uses `recordChallengeDamageTaken`. Intercepted spell still spends player AP (`recordChallengeApSpend`). Attack Nearest must not prefer the pylon when the Vicar is in range.  
**STATUS:** PROPOSED

---

### BOSS_ID: `font_abbess`

**NAME:** The Font Abbess  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen who does not walk the choir. The bowl walks nowhere. It still sings.  
**CORE_MECHANIC:** **Stationary heal font.** She plants one Mercy Font (`summonAI: "font"`, lifespan 4, `mp: 0`, does not path, kit `spell-font-pulse` only). At the **start of her turn**, if the font lives, it heals **her** for a flat 8 (L1 reference; not % HP). Distinct from Archbishop wisp (walks, Mend+Rally), Lament Grief Well (siphon from allied pain), Bastion (empty wall), Turret (shoots). The learnable is **one stationary ally-pulse totem**. Spectacular `CHOIR_FONT`: P2 pulse also heals **along her file** (every boss-side body on that file, still flat 8) — `BOSS_ONLY`.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | One font behind her. Kit: Heal / Barrier / Wisp. Font pulse heals **her only**. Wisp is a second healer — cap 4, prefer not recasting if font lives. |
| 2 | ≤ 40% | `CHOIR_FONT`: pulse hits her file. Iron Skin + Shield. Font rebuild 4-turn cadence if dead. One destructible **Bowl-lid**; breaking it **silences the next pulse** (font stays, no heal). |
| Enrage | turn 21 | Pulse also hits **adjacent files** (three files). Bowl-lid, if alive, breaks itself. Font HP stays `0.6 *` summon scaling, not a sponge. |

**SPELLS (proposed kit):** `starter-heal`, `spell-barrier`, `summon-wisp`, `spell-iron-skin` (P2), `starter-shield` (P2). Unique vs Archbishop (cursed / veil / sacrifice / wisp), Cord (wisp / heal / mirror / wolf / sacrifice), Conductor (rally / wisp / weaken / bomber / drain), Lament (well director — not this kit).  
**DISCOVERABLE_SPELLS:** #282 `spell-mercy-font` (`ACHIEVEMENT_UNLOCK` `loot_hunter` **or** extra `MULTI_SOURCE` / `BOSS` door: `bossIds: ["font_abbess"]` — first grant wins). Observation = she **plants** a font (`kind: "cast"`). `CHOIR_FONT` (file pulse / Bowl-lid / enrage three files) is `BOSS_ONLY`. Player Mercy Font pulses allies for 8, does not heal the caster unless they are in range as an ally target; kit id `spell-font-pulse` stays `NOT_PLAYER_LEARNABLE`.

**AI:** Plant if no font lives, on a cell Chebyshev ≥ 3 from the player, never spawn / portal. Skip recast Wisp if font lives and extra cap would drop the font. Pulse is the font’s turn, not her kit spell.  
**ARENA_RULES:** Font is a summon, 0 XP, lifespan 4. Bowl-lid is an object, HP = `0.15 * playerMaxHp`. Pulse heal is `spellType: "heal"` — `no_healing` / `hard_1` fail if the **player** receives it (they should not; it is boss-side). Planting is not a heal. `inferSummonArchetype` keys `summonAI === "font"`.  
**SUMMONS:** 1 font; 1 wisp. Cap 4. 0 XP. Font death ≠ victory.  
**PLAYER_COUNTERPLAY:** Kill the font (0.6 HP scale); Null Brand the font; Cursed Wound her so the pulse is half; break the Bowl-lid; Barrier LoS so she cannot recast behind cover.  
**MASTERY_OBJECTIVE:** Destroy the font before its **second** pulse (`font_breaker`). A silenced pulse (Bowl-lid) still **counts as a pulse** for mastery — kill it, do not lid-stall.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Pulse **flat 8** at L1 then SP-scaled; never % HP. One font.  
**BALANCE_RISKS:** Font + Lament / Archbishop is two heal engines — illegal. Font + Brood is larvae + pulse. Table D pairs with Cord: enemy font is **not** a valid Cord gate key. Rally/Mend on her kit stay **flat**.  
**QA:** Observation counts plant, not pulse. Font / Wisp / Bowl-lid 0 XP. Pulse does not enter `applyRewards`. `no_healing` is unaffected unless the player is healed. After plant, `finalizePlayableLayout` still has a path.  
**STATUS:** PROPOSED

---

### BOSS_ID: `surplus_auditor`

**NAME:** The Surplus Auditor  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A king of leftover ink. The crime is the unspent mark.  
**CORE_MECHANIC:** **Leftover-AP evade / brand.** At the **end of the player’s turn**, if current AP ≥ 2, he banks `evadeNextHits: 1` (consume **before** `dealDamage`, same gate as #282 Sidestep / #342 Surplus Ward). If you dump AP to 0–1, he does not evade. Distinct from Eternal (drains AP on *his* cadence), Drain Courage (immediate −1), Stride (walk MP), Glyph Tax (tile). The learnable is **self evade if leftover AP ≥ 2 after paying the spell**. Spectacular `AUDIT_TITHE`: leftover also brands you (spell-hit, L1 reference 8, `recordChallengeDamageTaken`) — `BOSS_ONLY`.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | End-of-turn leftover → his evade. Kit: Drain Courage / Mark / Haste. He Hastes himself; he does **not** Drain if you already dumped to 0 (skip). |
| 2 | ≤ 45% | `AUDIT_TITHE`: leftover also brands. Mirror + Barrier. One destructible **Audit-bell**; breaking it **skips the next leftover check**. |
| Enrage | turn 22 | Leftover threshold drops to **≥ 1** AP. Audit-bell, if alive, breaks itself. Evade still 1 hit (do not stack). Overlay +8%. |

**SPELLS (proposed kit):** `spell-drain-courage`, `spell-mark`, `spell-haste`, `spell-mirror` (P2), `spell-barrier` (P2). Unique vs Eternal (slow / drain-courage / iron-skin / cursed-wound), Stride (slow / haste / weaken / drain-courage / iron-skin), Pendulum (`physical` / slow / haste / nova / iron-skin), Lock (`physical` / slow / mark / iron-skin / frost-nova).  
**DISCOVERABLE_SPELLS:** #342 `spell-surplus-ward` (`ACHIEVEMENT_UNLOCK` `doka_hoarder` **or** extra `MULTI_SOURCE` / `BOSS` door: `bossIds: ["surplus_auditor"]` — first grant wins). Observation = he **banks evade** from leftover (`kind: "cast"` on the check that succeeds). `AUDIT_TITHE` (brand / threshold 1 / Audit-bell) is `BOSS_ONLY`. Player Surplus Ward is self, AP 2, CD 3, leftover ≥ 2 **after pay**, feat-gated in #342.

**AI:** Drain only if player AP ≥ 3 (leave them able to dump). Barrier a file if they like to Strike from it. Skip Mirror if evade is already banked.  
**ARENA_RULES:** Audit-bell HP = `0.15 * playerMaxHp`. Leftover is **current AP at turn end**, after potion / Timestep. Timestep refill **does** count as leftover (you banked). Walk leftover MP is irrelevant. Evade consumes on the next damaging hit only (not lava unless lava is a damaging hit through existing walk tick).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Spend down to 0–1 AP (Strike, tools, a waste Shield); break the Audit-bell; Mark him then dump; do not Timestep into leftover; Drain Courage is *his* tool — yours is spending.  
**MASTERY_OBJECTIVE:** Never end a player turn with ≥ 2 leftover AP (`spent_auditor`). Enrage threshold 1 still fails if you leave ≥ 1.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 1.25. Threshold 2 then 1. Brand is kit-scaled, not % HP. Evade stacks never (last writer 1).  
**BALANCE_RISKS:** Surplus + Eternal is two AP taxes — illegal. Surplus + Stride is 0-walk **and** dump-AP — too tight, illegal. Surplus + Pendulum is dump-AP **and** race the clock — Table D (one leftover check skipped on pendulum-sweep telegraph turns). Sidestep Ward (`critical_striker`) is unconditional evade — do not also grant it here.  
**QA:** Check reads current AP at player turn end, not `movedThisTurn`. Observation counts a successful leftover evade bank, not player Surplus Ward. Audit-bell 0 XP. Challenge brand uses `recordChallengeDamageTaken`. Evade consumes before `dealDamage` (not a miss %).  
**STATUS:** PROPOSED

---

## 8.5 Encounter sheets — Wave 7 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 6: **conveyor enter-slide** (Margrave ice *gutter* forces 2 tiles along a file and taxes MP; Slide Tile is one cell, enter-only, distance 1, no ice), **two-hostile swap** (Grandmaster / Morrow / Dowager use caster↔player `isSwap`; Pawn Trade swaps two *other* bodies and the caster stays), **facing cone** (Queen is omni-lines; Cinder is a full file; Ram is a shove ray; Gale Fan is cone+pack-push — none is a 90° damage wedge with 0 push), **unit next-cast AP tax** (Glyph Tax is a *tile*; Drain Courage is immediate −1 current AP; Surplus cares about leftover AP; Hex Toll brands the *unit* so the next *spell* costs +1).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-7 learnables reuse **#282 ids only**. No new #137 spell ids. No #411 extra doors.

They stay out of rooms 0–9, Table B, Table C, and Table D. Pairing is **Table E** only (§10.4).

**Hazard-on-forced-move prereq:** MIMA-2026-08-31-001 and MIMA-2026-08-31-005 are still OPEN (#336). Mill **position** (enter then push 1) is legal without those PRs. Hazard ticks **on the slide landing** must not be assumed until 005. Pawn Trade landing ticks wait on 001. Until then, lava/spike/ice tax only on **walk enter** and **turn-start occupancy**. Do not pair Mill with Ram / Hook / Rime / Dowager / Countess / Fosse until 005.

---

### BOSS_ID: `mill_seneschal`

**NAME:** The Mill Seneschal  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the mill-race. The floor is a wheel. You are grain only if you step on it.  
**CORE_MECHANIC:** Telegraphed **conveyor**. 1-turn wind-up paints **one** floor cell (Chebyshev ≤ 3, LoS, never spawn / portal). Resolve: that cell is a mill pad for 3 turns. Direction = 8-dir from **him → painted cell** stored on the tile (`slideDistance: 1`). A unit that **enters** (walk dest, push/pull/swap/gate landing) is then `applyPushback` 1 along that dir. Standing on it at paint time does **not** slide (enter-only). Distinct from Rime (full-file ice + 2-tile forced move + MP tax), Fuse (delayed damage, no move), Cinder (burn tick), Twin Gate (teleport pair). The learnable is **one conveyor cell**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One mill cell every 3 turns. Kit: Strike / Slow / Barrier. One destructible **Hopper**; breaking it **clears every mill cell**. |
| 2 | ≤ 45% | `MILL_RACE`: up to **3** mill cells (rebuilds to 3, never above). Expose + Frost Nova. Pads **do not** chain in one enter (same as #282: one slide per enter event). Hopper, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Paint resolves same turn as telegraph. Hopper, if alive, breaks itself. Slide distance stays **1**. Overlay +8%. |

**SPELLS (proposed kit):** `physical_attack`, `spell-slow`, `spell-barrier`, `spell-expose` (P2), `spell-frost-nova` (P2). Unique vs Lock (`physical` / slow / mark / iron-skin / nova), Pendulum (`physical` / slow / haste / nova / iron-skin), Rime (frost / slow / barrier / nova / expose), Ram (`physical` / haste / shield / barrier / rally).  
**DISCOVERABLE_SPELLS:** #282 `spell-slide-tile` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["mill_seneschal"]`). Observation = he **paints** a mill cell (`kind: "cast"`). `MILL_RACE` (3 cells / Hopper director / enrage same-turn paint) is `BOSS_ONLY`. Margrave ice stays Rime. Discovery `spell-file-slide` stays on the ecosystem doc.

**AI:** Paint a cell the player is **about to enter** (adjacent step toward him, or the only approach). Skip if Hopper was broken this cycle. Frost Nova only when the player is adjacent after a slide. Never paint spawn / portal / the only walk path (`finalizePlayableLayout` after paint).  
**ARENA_RULES:** Hopper HP = `0.15 * playerMaxHp`. Cap **3** mill cells. Pads are **not** `hazardTiles` lava/spikes (those cap 50). Enter-slide uses `applyPushback`. `movedThisTurn` = true if they slid ≥ 1. No bounce-loop on the same pad in one enter.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Do not enter the glow; Barrier the cell; break the Hopper; enter from a dir that slides you to safety; Strike from a neighboring file.  
**MASTERY_OBJECTIVE:** Never enter a mill cell (`mill_unslid`). Being shoved/swapped **onto** a pad still **fails** mastery (you entered). Standing on a cell at paint time is allowed.  
**REWARDS:** 6 / 4 when shipped. Slide Tile is the prize (first grant wins if a queen pack already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Slide **distance fixed at 1**. Cell count 1 then 3.  
**BALANCE_RISKS:** Mill + Ram / Hook / Rime / Dowager / Countess / Fosse waits on MIMA-005 (forced move × hazards / two slides / pits). Mill + Lock can seal the only legal step onto a pad — illegal until playtest (held). Player Slide Tile is one cell, 3 turns, enter-only.  
**QA:** Telegraph tiles computed at wind-up. Observation counts his paint, not player Slide Tile. Hopper 0 XP. Landing lava/spike does **not** tick until MIMA-005. Challenge: slide is not a spell-hit unless a dest hazard deals damage through the existing helper.  
**STATUS:** PROPOSED

---

### BOSS_ID: `counter_chaplain`

**NAME:** The Counter Chaplain  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A king who never moves the piece you aimed at. The other body was always the one in front.  
**CORE_MECHANIC:** **Two-hostile swap.** He targets one living **player-side** body (you or a summon) and swaps it with the nearest **other** living player-side body within Chebyshev 3 of that target (`swapTwoHostiles`, **not** `isSwap`). He does not move. If you have no second body, the cast **fizzles** (AP spent) unless Phase 2 has planted a decoy. Distinct from Grandmaster Swap (caster↔you), Morrow (delayed self-blink), Dowager (well pull), Ward Interpose (ally). The learnable is **swap two hostiles, caster stays**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Trade every 3 turns if ≥ 2 player-side bodies. Kit: Swap / Mark / Weaken. If you are solo, he Marks and Weakens — no fake swap. |
| 2 | ≤ 40% | `FALSE_COUNTER`: plants a 1-HP **decoy pawn** (`summonAI` existing, lifespan 3, 0 damage) so a solo player becomes a legal pair. He then prefers swapping **you** with the decoy (puts you onto the decoy’s tile). Sentinel + Haste. One destructible **Abacus**; breaking it **kills the decoy** and suppresses the next trade. |
| Enrage | turn 19 | Trade resolves same turn as telegraph. Abacus, if alive, breaks itself. Search radius stays 3. Overlay +8%. |

**SPELLS (proposed kit):** `spell-swap`, `spell-mark`, `spell-weaken`, `summon-sentinel` (P2), `spell-haste` (P2). Unique vs Grandmaster (blast / swap / mirror / timestep / nova), Sovereign (blast / mirror / mark / veil / swap), Morrow (swap / haste / drain / mirror / wolf), Ivory (barrier / expose / weaken / sentinel / frost), Goad (`physical` / shield / weaken / enrage / iron-skin).  
**DISCOVERABLE_SPELLS:** #282 `spell-pawn-trade` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["counter_chaplain"]`). Observation = he **resolves** a two-body swap (`kind: "cast"`; a P1 fizzle is **not** observation). `FALSE_COUNTER` (decoy pawn / player↔decoy preference / Abacus director) is `BOSS_ONLY`. Kit `spell-swap` stays his self-defense, not the grant.

**AI:** Telegraph both bodies 1 turn (highlight both tiles). Prefer swapping the player onto the decoy / a marked tile. Skip if Abacus was broken this cycle **and** the player is solo. Sentinel behind him, not as the decoy.  
**ARENA_RULES:** Decoy is a summon, 1 HP, 0 XP, lifespan 3. Abacus is an object, HP = `0.15 * playerMaxHp`. Pair swap uses occupancy vacated-pair (both cells legal because they exchange). Never call `swapPositions(targetEnemyId)`. `finalizePlayableLayout` after every trade.  
**SUMMONS:** 1 decoy in P2; +1 sentinel. Cap 4. 0 XP. Decoy death ≠ victory.  
**PLAYER_COUNTERPLAY:** Fight solo in P1 (no pet); kill the decoy before the trade; Self Anchor if owned; break the Abacus; isolate so radius 3 has no pair.  
**MASTERY_OBJECTIVE:** Never have two player-side bodies swapped (`pair_unbroken`). A P1 fizzle does **not** fail it. Being swapped with the decoy **fails** it.  
**REWARDS:** 5 / 3 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Radius **fixed at 3**. One decoy.  
**BALANCE_RISKS:** Counter + Grandmaster is two swap verbs — illegal. Counter + Bait is two targeting tricks — illegal. Counter + Cord: decoy must **not** be a valid Cord gate key (same rule as Font). Landing ticks wait on MIMA-001. Player Pawn Trade cannot plant a decoy.  
**QA:** Observation counts a resolved swap, not kit Swap and not a fizzle. Decoy / Sentinel / Abacus 0 XP. Two bodies never occupy one cell. Challenge: swap is not a spell-hit. Attack Nearest must not prefer the decoy when the Chaplain is in range.  
**STATUS:** PROPOSED

---

### BOSS_ID: `wedge_prior`

**NAME:** The Wedge Prior  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen who only blesses one quarter of the compass. The heresy is standing in the choir’s mouth.  
**CORE_MECHANIC:** Telegraphed **90° cone**. 1-turn wind-up paints a facing (8-dir from him → player tile at telegraph time). Resolve: `areaShape: "cone"`, Chebyshev 1..3, facing **or a 45° neighbor** (90° wedge), LoS, walls/Barriers stop that ray only. Deal kit-scaled damage (L1 reference 10, not % HP) to each hostile in the wedge. Caster tile excluded. Distinct from Queen omni-lines, Cinder full-file lance, Ram shove ray, Frost Nova (circle around target), Gale Fan (cone **plus** pack push). The learnable is **one facing cone, 0 push**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Cone every 3 turns. Kit: Blast / Iron Skin / Mark. One destructible **Lectern**; breaking it **skips the next cone**. |
| 2 | ≤ 45% | `TRIPLE_WEDGE`: after a cone, rotating vuln Window C: +40% from the **facing line** (the cone’s center file). Inferno + Enrage. A second cone may telegraph on the **perpendicular** facing if you are still in the first wedge at resolve (never two cones the same turn). Lectern, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Cone resolves same turn as telegraph. Lectern, if alive, breaks itself. Wedge geometry stays 90° / length 3. Overlay +8%. |

**SPELLS (proposed kit):** `starter-blast`, `spell-iron-skin`, `spell-mark`, `spell-inferno` (P2), `spell-enrage` (P2). Unique vs Static (blast / haste / nova / expose), Queen (blast / mark / nova / veil), Cinder (inferno / frost / haste / expose / enrage), Cavalier (`physical` / haste / enrage / expose).  
**DISCOVERABLE_SPELLS:** #282 `spell-fan-bolt` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["wedge_prior"]`). Observation = she **resolves** a cone (`kind: "cast"`). `TRIPLE_WEDGE` (perp follow-up / line vuln / Lectern director) is `BOSS_ONLY`. Do **not** grant `spell-gale-fan` (cone+push) or `spell-oncoming` (#411). Until `targeting.ts` reads `areaShape`, this sheet is **not** license to ship a Chebyshev blob and call it a cone.

**AI:** Telegraph the facing through the player at wind-up; do not track. Skip if Lectern was broken this cycle. Inferno the landing if you stayed in the wedge. Never cone through spawn (`finalizePlayableLayout`).  
**ARENA_RULES:** Lectern HP = `0.15 * playerMaxHp`. Preview, live gate, and execute share one cone helper (same contract as `computeTargetableTiles` === `isTileCastableLive`). Hits player-side summons in the wedge. Does **not** push.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step to the back-diagonal (outside the 90°); Barrier a spoke; hug her (Chebyshev 0 excluded); break the Lectern; Mark is a gift if you have a line spell on Window C.  
**MASTERY_OBJECTIVE:** Never take a cone hit (`wedge_sidestep`). A summon in the wedge does **not** fail it (you were not hit). Hugging Chebyshev 0 is allowed.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Cone **length 3 / 90° fixed**. Damage is kit-scaled, not % HP.  
**BALANCE_RISKS:** Wedge + Queen is two multi-file directors — illegal. Wedge + Ram / Cinder in the **same** telegraph is two rays — Table E pairs with Cinder only if cone **never occupies the lance glow**. Gale Fan stays a pack door.  
**QA:** Telegraph tiles = the cone at wind-up facing. Observation counts her cone, not player Fan Bolt. Lectern 0 XP. Challenge cone uses `recordChallengeDamageTaken`. `areaShape !== "cone"` must not enter the helper.  
**STATUS:** PROPOSED

---

### BOSS_ID: `levy_rector`

**NAME:** The Levy Rector  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the parish levy. The crime is the expensive prayer. Walking is free.  
**CORE_MECHANIC:** **Next-cast AP tax.** He brands you (`nextCastApTax: 1`, duration 2 turns or until you successfully spend on a **spell**, whichever first). Walk, potions, and Strike (`physical_attack`) do **not** consume it. Distinct from Glyph Tax (tile zone), Drain Courage (immediate −1 current AP), Surplus (leftover AP evade), Ley Toll (your mpCost). The learnable is **+1 AP on the next spell, no stack**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Brand every 3 turns. Kit: Drain Courage / Expose / Poison. One destructible **Tithe-box**; breaking it **clears the current tax**. |
| 2 | ≤ 45% | `TITHE_STACK`: tax becomes **+2** if you already carry a brand (stack cap 2). Cursed Wound + Barrier. Rotating vuln Window B: +40% from non-physical while branded (the cheap-tool window). Tithe-box, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Brand resolves same turn as telegraph. Tithe-box, if alive, breaks itself. Stack cap stays 2. Overlay +8%. |

**SPELLS (proposed kit):** `spell-drain-courage`, `spell-expose`, `starter-poison`, `spell-cursed-wound` (P2), `spell-barrier` (P2). Unique vs Eternal (slow / drain-courage / iron-skin / cursed-wound), Surplus (drain-courage / mark / haste / mirror / barrier), Archivist (cursed / mark / barrier / archer / veil), Hexed (mark / slow / barrier / expose / archer).  
**DISCOVERABLE_SPELLS:** #282 `spell-hex-toll` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["levy_rector"]`). Observation = he **applies** a brand (`kind: "cast"`). `TITHE_STACK` (stack cap 2 / Window B / Tithe-box director) is `BOSS_ONLY`. Player Hex Toll is +1, 2 turns, no stack. Glyph Tax stays Archivist. Act Tax (#411) is not this door.

**AI:** Brand if the player’s bar includes a spell with `apCost >= 3`. Drain only if current AP ≥ 3 (leave a 2-cost tool to burn the tax). Skip brand if Tithe-box was broken this cycle.  
**ARENA_RULES:** Tithe-box HP = `0.15 * playerMaxHp`. Tax applies inside `executeCastAttempt` **after** `applyApCost` map modifiers. If they cannot pay, the cast rejects (`no_ap`) and the tax **remains**. Fizzle that spent AP consumes the tax. Cleanse / Absolve / Dispel Thread strip via `cleanseTypes` include `"nextCastApTax"` — not via name.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Walk and wait 2 turns; burn the tax with a 2-cost tool (Mark, Slow, Shield); break the Tithe-box; Strike (physical does not consume); do not Inferno through a +2 stack.  
**MASTERY_OBJECTIVE:** Never pay an inflated spell cost (`levy_unbranded`). Burning the tax with a 2-cost tool **is** an inflated cast (2→3) and **fails** mastery. Waiting it out, or clearing via Tithe-box / Cleanse, is the pass.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Tax **+1 then stack cap 2**. Duration 2. Not % HP.  
**BALANCE_RISKS:** Levy + Archivist is two AP taxes on casts — illegal. Levy + Surplus / Eternal is two AP resources — illegal. Levy + Conductor silences the cheap-tool file — illegal. Table E pairs with Fosse: one committed poke across a pit, tax is not a pit-step.  
**QA:** Observation counts his apply, not player Hex Toll. Tithe-box 0 XP. Physical Strike does not consume the tax. Challenge: tax is not a hit; a rejected `no_ap` still spent nothing extra.  
**STATUS:** PROPOSED

---

## 8.6 Encounter sheets — Wave 8 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 7: **facing lock** (Wedge paints a 90° *damage cone* from *his* facing; Queen is omni-lines; Facing Pin locks *your* `currentView` so Oncoming/Glance would matter — the lock is the exam), **two-cell occupy** (Palisade stakes, Barrier walls, and Fosse pits change *which cells exist*; Span Guard is the *boss body* occupying origin + one adjacent cell), **hit redirect to an ally** (Mirror reflects the spell to the caster; Bait intercepts the next *spell* aimed at the owner; Cover Step sends the next *hit*, including Strike, to an adjacent ally), **HP%-gated walk** (Fosse pits refuse *everyone*; Low Lintel is walkable only if the walker’s current HP% ≤ 50 — LoS stays open).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-8 learnables reuse **#411 ids only**. No new #137 spell ids. No #463 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, and Table E. Pairing is **Table F** only (§10.5).

**Facing-writer prereq:** #411 requires battle walks (player, enemy, summons) to write `currentView` with the overworld map (`WorldExploration.tsx` 6928–6931). Until that writer exists, Gaze **fail-closed**: a missing `currentView` is treated as unpinned and Oncoming-style bonuses do not fire. Forced-move (push/pull/swap/gate) does **not** rewrite facing. This sheet is **not** license to touch the RAF loop to splice facing.

---

### BOSS_ID: `gaze_beadle`

**NAME:** The Gaze Beadle  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the nave eye. The heresy is looking away. He does not need you in the wedge; he needs you to *admit* the aisle.  
**CORE_MECHANIC:** **Facing lock.** 1-turn wind-up. Resolve: pin the player’s `currentView` to a literal (`front`/`back`/`left`/`right`) for 2 turns (`pinViewDuration: 2`). The literal is the 90° that currently faces *him* at telegraph time (dominant axis; ties fail closed — skip the pin). Walks during the pin **cannot** rewrite `currentView`. Distinct from Wedge (damage cone from *his* facing, you dodge by stepping off), Hex (leave-this-tile), Goad (forced *target*), Rank Lock (walk *axis*). The learnable is **one-target facing pin, 2 turns**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Pin every 3 turns. Kit: Frost / Mark / Iron Skin. One destructible **Crosier**; breaking it **clears the current pin**. |
| 2 | ≤ 45% | `NAVE_GAZE`: while pinned, he may **Glance** the occupant of the cell you face (kit-scaled 10, not % HP) every other turn. Weaken + Veil. Crosier, if down, may rebuild once (4-turn cadence). Rotating vuln Window C: +40% from the **file you are forced to look down**. |
| Enrage | turn 20 | Pin resolves same turn as telegraph. Crosier, if alive, breaks itself. Duration stays **2**. Overlay +8%. |

**SPELLS (proposed kit):** `starter-frost`, `spell-mark`, `spell-iron-skin`, `spell-weaken` (P2), `spell-shadow-veil` (P2). Unique vs Hexed (mark / slow / barrier / expose / archer), Queen (blast / mark / nova / veil), Archivist (cursed / mark / barrier / archer / veil), Hook (frost / physical / haste / mark / nova), Wedge (blast / iron-skin / mark / inferno / enrage).  
**DISCOVERABLE_SPELLS:** #411 `spell-facing-pin` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["gaze_beadle"]`). Observation = he **applies** a pin (`kind: "cast"`; a tie skip is **not** observation). `NAVE_GAZE` (Glance rider / file vuln / Crosier director) is `BOSS_ONLY`. Do **not** grant `spell-oncoming` or `spell-glance-cut` (pack doors). Do **not** grant About Face (#463 `NOT_PLAYER_LEARNABLE`).

**AI:** Telegraph the literal on his tile (compass pip). Prefer pin when the player already faces him (so the lock *sticks* the current mistake). Skip if Crosier was broken this cycle. Glance only while a pin is live and the front cell is occupied. Never pin spawn-facing into a sealed file (`finalizePlayableLayout` is a walk check, not a facing check).  
**ARENA_RULES:** Crosier HP = `0.15 * playerMaxHp`. Pin writes `currentView` and a `facingPinnedUntilTurn` flag — walks do not clear it. Missing `currentView` fail-closed (no pin). Forced-move does not rewrite facing.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Approach on a diagonal (tie skip); break the Crosier; wait 2 turns; Strike (physical does not care about facing); do not stand on the file you are forced to look down in P2.  
**MASTERY_OBJECTIVE:** Never end a player turn with facing pinned (`gaze_averted`). A telegraph you stepped out of before resolve does **not** fail it. Breaking the Crosier after a pin **already applied** still **fails** it (you were pinned).  
**REWARDS:** 6 / 4 when shipped. Facing Pin is the prize (first grant wins if a scribe pack already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Pin **duration 2**. Glance damage is kit-scaled, not % HP.  
**BALANCE_RISKS:** Gaze + Wedge is two facing directors — illegal. Gaze + Queen is facing + omni-lines — illegal. Gaze + Hook is Table F: pin never occupies the hook glow; forced-move does not rewrite facing (the exam is walking after the reel so a *future* pin misses). Player Facing Pin cannot pin the whole board.  
**QA:** Observation counts his apply, not player Facing Pin and not a tie skip. Crosier 0 XP. Challenge Glance uses `recordChallengeDamageTaken`. Missing `currentView` never pins. Walk during pin does not rotate the pip.  
**STATUS:** PROPOSED

---

### BOSS_ID: `span_chamberlain`

**NAME:** The Span Chamberlain  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook who keeps two seats. You always have the wrong half.  
**CORE_MECHANIC:** **Two-cell occupy.** 1-turn wind-up paints one **adjacent** empty cell (cardinal, Chebyshev 1, never spawn / portal). Resolve: he occupies origin **and** that cell for 3 turns (`spanAdjacent: true`). Both cells block walk and LoS as if a body were there. Hits to **either** cell damage him. Distinct from Barrier (empty wall, 0 HP), Palisade (stakes you can destroy), Fosse (LoS-open pits), Nail Down (#371 one cell, no extra body). The learnable is **origin + one adjacent, rigid**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Span every 3 turns, 3-turn duration. Kit: Shield / Expose / Slow. One destructible **Truss**; breaking it **collapses the extra cell**. |
| 2 | ≤ 45% | `DOUBLE_SPAN`: he may **rotate** the extra cell 90° (still cardinal, still one cell) instead of collapsing. Iron Skin + Bomber. Bomber sits on the extra cell (occupancy: the extra cell is still *his* — bomber stands **behind** it, not on it). Truss, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Span resolves same turn as telegraph. Truss, if alive, breaks itself. Extra cells stay **one**. Overlay +8%. |

**SPELLS (proposed kit):** `starter-shield`, `spell-expose`, `spell-slow`, `spell-iron-skin` (P2), `summon-bomber` (P2). Unique vs Ram (`physical` / haste / shield / barrier / rally), Fortress (`physical` / iron-skin / shield / barrier / nova), Goad (`physical` / shield / weaken / enrage / iron-skin), Fosse (barrier / frost / slow / veil / wisp), Palisade (barrier / expose / weaken / sentinel / frost).  
**DISCOVERABLE_SPELLS:** #411 `spell-span-guard` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["span_chamberlain"]`). Observation = he **arms** a span (`kind: "cast"`). `DOUBLE_SPAN` (rotate / bomber-behind / Truss director) is `BOSS_ONLY`. Do **not** grant Twin Span (#463 independently walking posts) or Span Pylon (ELITE stationary summon).

**AI:** Paint the adjacent cell that **cuts the player’s approach file**. Skip if Truss was broken this cycle. Never span onto spawn / the only walk path (`finalizePlayableLayout` after paint — if the extra cell would seal, skip). Bomber never occupies the extra cell.  
**ARENA_RULES:** Truss HP = `0.15 * playerMaxHp`. Extra cell is **not** a second enemy (0 XP, not in `enemiesDefeated`). Both cells share his HP bar. If he walks, the extra cell **translates** with him (rigid). Cap **1** extra cell.  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. Bomber death ≠ extra-cell collapse.  
**PLAYER_COUNTERPLAY:** Hit the extra cell (same HP); break the Truss; walk around the pair; Slow him so he cannot re-paint; do not Attack Nearest into the extra cell if a true body is in Strike range.  
**MASTERY_OBJECTIVE:** Never occupy the extra cell and never deal a damaging hit whose origin tile **is** the extra cell (`span_unoccupied`). Hitting his origin is allowed. Standing adjacent is allowed.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Extra-cell **count 1**. Duration 3.  
**BALANCE_RISKS:** Span + Palisade / Fosse / Lock is two walk prisons — illegal. Span + Mill is occupancy + slide — illegal. Span + Ram is Table F: ram ray never occupies **both** span cells (the shove answers one cell, not a seal). Player Span Guard cannot paint a third cell.  
**QA:** Observation counts his arm, not player Span Guard. Truss / extra cell / Bomber 0 XP. Two bodies never share one cell. Extra cell is not a victory target. `finalizePlayableLayout` after every paint. Attack Nearest prefers the origin when both are in range.  
**STATUS:** PROPOSED

---

### BOSS_ID: `cover_hospitaller`

**NAME:** The Cover Hospitaller  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A king who never takes the blow. The choir is the body.  
**CORE_MECHANIC:** **Hit redirect.** He arms Cover (`coverRedirectNextHit: true`) for 2 turns or until a damaging hit resolves against him, whichever first. The next damaging hit **whose target is him** redirects to an **adjacent living allied** body (Chebyshev 1). If no adjacent ally exists, the arm **stays** (does not dump onto you). Distinct from Mirror (spell reflect to the *caster*), Bait (intercepts the next *spell* aimed at the *owner*, not Strike), Pain Link (% shared). The learnable is **next hit, adjacent ally required**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Arm every 3 turns if an ally is adjacent. Kit: Heal / Mirror / Haste. One destructible **Bier**; breaking it **clears Cover**. If he is solo, he Hastes and Heals — no fake redirect. |
| 2 | ≤ 40% | `CHOIR_COVER`: plants a 1-HP **choir wisp** (lifespan 3, existing `summon-wisp`) so a solo king has a martyr. Redirects **ignore adjacency** while the wisp lives (any hit on him goes to the wisp). Rally enters. Bier, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Arm resolves same turn as telegraph. Bier, if alive, breaks itself. Redirect stays **one hit**. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-mirror`, `spell-haste`, `summon-wisp` (P2), `spell-rallying-cry` (P2). Unique vs Cord (wisp / heal / mirror / wolf / sacrifice), Font (heal / barrier / wisp / iron-skin / shield), Bait (mirror / mark / shield / weaken / sentinel), Conductor (rally / wisp / weaken / bomber / drain), Twins (rally / inferno / enrage / iron-skin).  
**DISCOVERABLE_SPELLS:** #411 `spell-cover-step` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["cover_hospitaller"]`). Observation = he **arms** Cover (`kind: "cast"`; a P1 skip with no adjacent ally is **not** observation). `CHOIR_COVER` (no-adjacency / choir wisp / Bier director) is `BOSS_ONLY`. Do **not** grant Bait Pylon, Pain Link, or a second Mirror.

**AI:** Arm only if an ally is adjacent (P1) or the wisp is alive (P2). Stand adjacent to the wisp. Skip if Bier was broken this cycle. Heal the wisp, not himself, while Cover is live. Wisp is **not** a Cord gate key and **not** a Font pulse target.  
**ARENA_RULES:** Bier HP = `0.15 * playerMaxHp`. Wisp 1 HP, 0 XP, lifespan 3. Redirect is a **retarget**, not a reflect — the hit uses the original spell metadata against the martyr (`recordChallengeDamageTaken` if the martyr is a player-side body; boss-side martyr uses enemy HP through `updateCombatant`). Strike **does** redirect.  
**SUMMONS:** 1 wisp in P2. Cap 4. 0 XP. Wisp death ≠ victory. Cover without a martyr stays armed.  
**PLAYER_COUNTERPLAY:** Fight him solo in P1; kill the wisp before the hit; AoE that tags both; break the Bier; DoT (already-applied DoT ticks do **not** consume Cover — only a new hit does).  
**MASTERY_OBJECTIVE:** Never have a hit redirect off him (`cover_unshared`). A P1 skip with no ally does **not** fail it. Killing the wisp then hitting him is the pass.  
**REWARDS:** 5 / 3 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Redirect **count 1**. One wisp.  
**BALANCE_RISKS:** Cover + Bait / Goad is two targeting tricks — illegal. Cover + Sovereign is redirect + replay — illegal. Cover + Cord: wisp must **not** be a Cord gate. Cover + Font: enemy font is **not** the martyr. Table F pairs with Wick: fuses never paint the martyr tile. Player Cover Step cannot dump onto a non-adjacent ally.  
**QA:** Observation counts his arm, not player Cover Step and not a P1 skip. Bier / Wisp 0 XP. Strike redirects. DoT ticks do not consume the arm. Challenge: redirected player-side hits still use `recordChallengeDamageTaken`. Attack Nearest must not prefer the wisp when the king is in range.  
**STATUS:** PROPOSED

---

### BOSS_ID: `lintel_sacrist`

**NAME:** The Lintel Sacrist  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen of the low door. The proud cannot pass. The wounded already have.  
**CORE_MECHANIC:** **HP%-gated walk.** 1-turn wind-up paints **one** floor cell (Chebyshev ≤ 3, LoS, never spawn / portal). Resolve: that cell is a lintel for 2 turns (`lintelMaxHpPct: 50`). A unit whose current HP / max HP **> 50%** treats it as a walk-block (MP spent, no move, no pit-tick). A unit at **≤ 50%** walks it as floor. LoS stays **open** (you may Strike and spell across). Distinct from Fosse (nobody walks), Barrier (blocks walk **and** LoS), Palisade (stakes), Claim Ward (no swap/blink onto). The learnable is **one cell, 2 turns, 50%**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | One lintel every 3 turns. Kit: Barrier / Poison / Haste. One destructible **Transom**; breaking it **clears every lintel**. |
| 2 | ≤ 40% | `NAVE_LINTEL`: up to **5** lintel cells (rebuilds to 5, never above). Cursed Wound + Archer. Archer sits on the far bank (high-HP players shoot; low-HP players crawl). Transom, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Paint resolves same turn as telegraph. Transom, if alive, breaks itself. Cap stays **5**. Overlay +8%. |

**SPELLS (proposed kit):** `spell-barrier`, `starter-poison`, `spell-haste`, `spell-cursed-wound` (P2), `summon-archer` (P2). Unique vs Wick (mark / poison / barrier / inferno / bomber), Levy (drain / expose / poison / cursed / barrier), Archivist (cursed / mark / barrier / archer / veil), Hexed (mark / slow / barrier / expose / archer), Fosse (barrier / frost / slow / veil / wisp).  
**DISCOVERABLE_SPELLS:** #411 `spell-low-lintel` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["lintel_sacrist"]`). Observation = she **paints** a lintel (`kind: "cast"`). `NAVE_LINTEL` (5-cell lattice / Transom director) is `BOSS_ONLY`. Open Pit stays Fosse. Do **not** grant Act Tax (#411 remaining).

**AI:** Paint the cell that is the **only approach** if the player is above 50% (force a shoot or a bleed). Skip if Transom was broken this cycle. Never paint spawn / seal the last high-HP walk path without a LoS poke (`finalizePlayableLayout` after paint — a high-HP player must still have a walk **or** a LoS shot at her). Archer on the far bank.  
**ARENA_RULES:** Transom HP = `0.15 * playerMaxHp`. Lintels are **not** `hazardTiles` lava/spikes (those cap 50). Cap **5**. Failed high-HP walk spends the walk MP and does **not** apply a spike-tick (this is a door, not a pit). LoS traces treat lintels as empty. Swap / blink onto a lintel: high-HP **rejects**; low-HP allowed.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Fight from the high bank (shoot across); Sacrifice / Inferno yourself to crawl (floor at 1 — `recordChallengeSelfHpLoss`); break the Transom; Poison the archer; do not dump walk MP into a proud step.  
**MASTERY_OBJECTIVE:** Never walk a lintel cell (`lintel_high`). Being swapped/blinked onto one **fails** it (you entered). A failed high-HP walk attempt **fails** it (you tried the door). Shooting across is the pass.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Gate **fixed at 50%**. Cell count 1 then 5.  
**BALANCE_RISKS:** Lintel + Fosse / Palisade / Lock is two walk prisons — illegal. Lintel + Ram / Mill waits on MIMA-005 (shove/slide onto a gate). Table F pairs with Stride: lintel cells never occupy the start tile; a stride-taxed crawl is a **choice**, not a forced walk. Player Low Lintel is one cell.  
**QA:** Observation counts her paint, not player Low Lintel. Transom / Archer 0 XP. High-HP failed walk spends MP, no spike-tick. LoS crosses lintels. `finalizePlayableLayout` after every paint. Challenge: a failed walk is not a hit; Sacrifice self-HP still records `recordChallengeSelfHpLoss`.  
**STATUS:** PROPOSED

---


## 8.7 Encounter sheets — Wave 9 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 8: **walk-exit AP tax** (Glyph Tax / Archivist is *enter* or a 3×3 zone; Hex Toll / Levy brands the *unit’s next cast*; Stride taxes *walk MP spent*; Debt Mark is “next walk +1 AP” with no painted cell; Exit Tithe paints **this** cell and taxes *leaving it*), **enter-swap with the painter** (Grandmaster spends `isSwap` at *cast* time; Counter swaps two *other* hostiles and stays; Morrow paints a *self* landing; Hinge Tile waits for an *enter* then swaps that body with the *painter*), **cannot be primary spell target** (Bait intercepts the next *spell* aimed at the *owner*; Cover retargets a hit that already chose him; Goad rewrites *your* legal target; Aim Veil *rejects* a hostile `targetType: "enemy"` aimed at him — AoE, lines, chains, and Strike still resolve), **Strike-only brand** (Conductor silences a *file*; Mute Thread fizzles whatever is next; Hex of Silence locks the bar and stays `BOSS_ONLY`; Oath Blade brands the *unit* so only `physical_attack` / Attack Nearest / sprite-click Strike resolve).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-9 learnables reuse **#463 ids only**. No new #137 spell ids. No #525 / #563 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, and Table F. Pairing is **Table G** only (§10.6).

**#463 stub note:** `SPELL_PROPOSALS_2026-09-23.md` already names `exit_mason` (Exit Tithe MULTI), `hinge_porter` (Hinge Step MULTI), `oath_censor` (Oath Blade `BOSS`), and `about_regent` (About Face kit). Those stubs are **not** remapped to these sheets. `hinge_porter` stays Hinge Step. First grant wins if a stub ships.

---

### BOSS_ID: `toll_ostiary`

**NAME:** The Toll Ostiary  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the church door. Holy water is free. Leaving is not.  
**CORE_MECHANIC:** **Walk-exit AP tax.** 1-turn wind-up paints **one** floor cell (Chebyshev ≤ 3, LoS, never spawn / portal). Resolve: that cell is a tithe for 2 turns (`exitTitheAp: 1`). A voluntary **walk** that **leaves** it costs +1 AP (in addition to the MP step). 0 leftover AP → the leave is illegal (MP not spent). Forced-move (push / pull / swap / blink / hinge) **exits free**. Distinct from Glyph Tax (enter / zone), Hex Toll (next *cast*), Stride (walk *MP*), Low Lintel (HP% gate). The learnable is **one cell, 2 turns, +1 AP**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One tithe every 3 turns. Kit: Mark / Haste / Shield. One destructible **Stoop**; breaking it **clears every tithe**. |
| 2 | ≤ 45% | `THRESHOLD_TITHE`: up to **5** tithe cells (rebuilds to 5, never above). Slow + Sentinel. Sentinel stands on the *inside* bank (you pay to leave him). Stoop, if down, may rebuild once (4-turn cadence). Rotating vuln Window C: +40% from the **file that contains no tithe**. |
| Enrage | turn 20 | Paint resolves same turn as telegraph. Stoop, if alive, breaks itself. Cap stays **5**. Overlay +8%. |

**SPELLS (proposed kit):** `spell-mark`, `spell-haste`, `starter-shield`, `spell-slow` (P2), `summon-sentinel` (P2). Unique vs Hexed (mark / slow / barrier / expose / archer), Surplus (drain / mark / haste / mirror / barrier), Lock (`physical` / slow / mark / iron-skin / nova), Bait (mirror / mark / shield / weaken / sentinel), Levy (drain / expose / poison / cursed / barrier).  
**DISCOVERABLE_SPELLS:** #463 `spell-exit-tithe` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["toll_ostiary"]`). Observation = he **paints** a tithe (`kind: "cast"`). `THRESHOLD_TITHE` (5-cell lattice / Stoop director) is `BOSS_ONLY`. #463 stub `exit_mason` is a first-grant rival, not this id. Do **not** grant Glyph Tax, Hex Toll, Stride Brand, or Debt Mark from this fight.

**AI:** Paint the cell the player is **about to leave** (their current tile if they have ≥ 1 AP, else the next step toward him). Skip if Stoop was broken this cycle. Never paint spawn. Never seal the only leave with 0-AP + no forced-move tool (`finalizePlayableLayout` after paint — a 0-AP player must still have a Strike / spell from the cell **or** a legal leave).  
**ARENA_RULES:** Stoop HP = `0.15 * playerMaxHp`. Tithes are **not** lava/spike `hazardTiles`. Cap **5**. Failed 0-AP leave spends **nothing** (the walk is illegal). Challenge: a paid leave records `recordChallengeApSpend` for the extra 1.  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Stay and cast from the cell; forced-move off (Swap / Back Step); break the Stoop; dump AP *before* you step on so a later leave is cheap; do not camp a 5-cell lattice at 0 AP.  
**MASTERY_OBJECTIVE:** Never *leave* a tithe cell (`stoop_unleft`). A failed 0-AP leave attempt **fails** it (you tried the door). Being shoved off **does not** fail it (exit is free). Never entering is the pass.  
**REWARDS:** 6 / 4 when shipped. Exit Tithe is the prize (first grant wins if `exit_mason` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Tax **fixed at 1 AP**. Cell count 1 then 5.  
**BALANCE_RISKS:** Toll + Levy / Hex / Stride / Surplus / Eternal is two AP / walk taxes — illegal. Toll + Lintel / Fosse / Palisade / Lock is two walk prisons — illegal. Table G pairs with Cinder: tithe **never** occupies a telegraphed lance tile. Player Exit Tithe cannot paint 5 cells.  
**QA:** Observation counts his paint, not player Exit Tithe and not a later leave. Stoop / Sentinel 0 XP. Forced-move leave is free and does not fail mastery. Extra AP uses `recordChallengeApSpend`. `finalizePlayableLayout` after every paint.  
**STATUS:** PROPOSED

---

### BOSS_ID: `hinge_precentor`

**NAME:** The Hinge Precentor  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop who keeps the pitch. Step onto the mark and you are already in the choir.  
**CORE_MECHANIC:** **Enter-swap with the painter.** 1-turn wind-up paints **one** free cell (Chebyshev ≤ 3, LoS, never spawn / portal). Resolve: that cell is a hinge for 2 turns or until one swap (`hingeTileSwapOnEnter: true`). The next unit that **enters** (walk **or** forced-move) swaps with **him** if he is alive and both landings are legal. Then the tile expires. If he is dead, enter does **nothing**. Distinct from `isSwap` (caster↔enemy at cast time), Pawn Trade (two *other* hostiles, caster stays), Twin Gate (pad pair), Morrow (self landing). Does **not** set `isSwap`. The learnable is **one cell, one swap, painter**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One hinge every 3 turns. Kit: Blast / Barrier / Haste. One destructible **Peg**; breaking it **clears the hinge**. |
| 2 | ≤ 45% | `CHOIR_HINGE`: he may keep **two** hinge cells (still one swap *each*). Weaken + Archer. Archer sits on a hinge (entering the archer’s cell swaps *you* with the Precentor, not the archer). Peg, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Paint resolves same turn as telegraph. Peg, if alive, breaks itself. Cap stays **two** cells. Overlay +8%. |

**SPELLS (proposed kit):** `starter-blast`, `spell-barrier`, `spell-haste`, `spell-weaken` (P2), `summon-archer` (P2). Unique vs Static (blast / haste / nova / expose), Wedge (blast / iron-skin / mark / inferno / enrage), Queen (blast / mark / nova / veil), Hexed (mark / slow / barrier / expose / archer), Counter (swap / mark / weaken / sentinel / haste).  
**DISCOVERABLE_SPELLS:** #463 `spell-hinge-tile` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["hinge_precentor"]`). Observation = he **paints** a hinge (`kind: "cast"`). `CHOIR_HINGE` (two cells / archer-on-hinge / Peg director) is `BOSS_ONLY`. Do **not** grant Hinge Step (`hinge_porter` stays that card’s MULTI child), Pawn Trade, Swap, Twin Gate, or File Reel.

**AI:** Paint the cell that is the **only approach** so a greedy step dumps the player onto his old tile (usually adjacent to a Barrier). Skip if Peg was broken this cycle. Never paint spawn / a sealed pocket (`finalizePlayableLayout` after paint **and** after a swap). Grounded Lock / Claim Ward on either cell: swap illegal, enterer stays, tile expires.  
**ARENA_RULES:** Peg HP = `0.15 * playerMaxHp`. Hinge cells are **not** hazards. Cap **2**. Swap uses occupancy teleport of painter↔enterer — **not** `swapPositions` (that helper is player↔one enemy). Challenge: the swap is movement, not a hit.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP. Archer death ≠ hinge collapse.  
**PLAYER_COUNTERPLAY:** Do not enter; kill him first (tile fades); break the Peg; Barrier the approach; Nail / Claim the landing; Attack Nearest him from a non-hinge cell.  
**MASTERY_OBJECTIVE:** Never enter a hinge tile (`peg_unentered`). Being shoved/swapped onto one **fails** it (you entered). A paint you never step on is the pass.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Cell count 1 then 2. One swap per cell.  
**BALANCE_RISKS:** Hinge + Grandmaster / Counter / Morrow is two swap / blink verbs — illegal. Hinge + Hook / Dowager / Mill / Ram waits on MIMA-001 / 005 (forced-move *is* a legal enter). Table G pairs with Palisade: hinge **never** paints a sealed pocket; swap landing must stay on a punched lane. Player Hinge Tile cannot arm two cells.  
**QA:** Observation counts his paint, not player Hinge Tile and not the swap tick. Peg / Archer 0 XP. Dead painter = no swap. `finalizePlayableLayout` after paint and after swap. Attack Nearest must not prefer the archer when the Precentor is in range.  
**STATUS:** PROPOSED

---

### BOSS_ID: `veil_verger`

**NAME:** The Veil Verger  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A pawn who refuses the pointing finger. You may burn the aisle. You may not name him.  
**CORE_MECHANIC:** **Primary-target reject.** He arms Aim Veil (`aimVeilPrimaryOnly: true`) for 1 of *your* rounds. Hostile spells whose `targetType` is `enemy` (or a self-buff you try to *place on him*) **reject the tile** (`aim_veil_primary`). AoE / line / chain / nova that *includes* his cell **still hits**. Strike / Attack Nearest / sprite-click Strike still hit. Distinct from Shadow Veil (RES/SP), Bait (intercepts a spell aimed at the *owner*), Cover (redirects a resolved hit), Goad (rewrites *your* target). The learnable is **self, 1 round, primary only**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Arm every 3 turns. Kit: Poison / Mirror / Slow. One destructible **Cowl**; breaking it **clears Veil**. |
| 2 | ≤ 40% | `NAVE_VEIL`: while veiled, **Attack Nearest that would pick him must skip** to the next legal hostile (if none, the click fizzles, AP spent). Enrage + Frost Nova (the nova is how *he* answers a veiled aisle). Cowl, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Arm resolves same turn as telegraph. Cowl, if alive, breaks itself. Duration stays **1 round**. Overlay +8%. |

**SPELLS (proposed kit):** `starter-poison`, `spell-mirror`, `spell-slow`, `spell-enrage` (P2), `spell-frost-nova` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Bait (mirror / mark / shield / weaken / sentinel), Cord (wisp / heal / mirror / wolf / sacrifice), Fetid (venom / poison / cursed / nova), Sovereign (blast / mirror / mark / veil / swap).  
**DISCOVERABLE_SPELLS:** #463 `spell-aim-veil` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["veil_verger"]`). Observation = he **arms** Veil (`kind: "cast"`). `NAVE_VEIL` (Attack Nearest skip / Cowl director) is `BOSS_ONLY`. Do **not** grant Bait Pylon, Cover Step, Goad, or Shadow Veil from this fight.

**AI:** Arm when the player has a single-target spell highlighted or is at range 2–4. Skip if Cowl was broken this cycle. Frost Nova when two or more player-side bodies share his radius (prove AoE still works). Mirror only while unveiled (veil + mirror is two answers — skip Mirror if Veil is live).  
**ARENA_RULES:** Cowl HP = `0.15 * playerMaxHp`. Veil is a combatant flag, not a tile. Rejected primaries spend **no** AP (targeting reject, not a fizzle). Attack Nearest skip in P2 **does** spend AP if no other hostile is legal (`recordChallengeApSpend`).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Frost Nova / Inferno / Blast / Lifesteal Nova; walk adjacent and Strike; break the Cowl; wait the round; do not dump Mark on him as a primary (Mark’s live `targetType` is `"enemy"` — it rejects).  
**MASTERY_OBJECTIVE:** Never have a primary spell reject on him (`cowl_unaimed`). A targeting hover that you cancel does **not** fail it. An Attack Nearest skip in P2 **does** fail it (the click named him). AoE that hits him is the pass.  
**REWARDS:** 5 / 3 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Duration **1 round**.  
**BALANCE_RISKS:** Veil + Bait / Cover / Goad / Sovereign is two targeting / reflect tricks — illegal. Veil + Conductor is primary-reject **and** file silence — a brick for a no-AoE bar; illegal. Table G pairs with Wick: fuses are environmental (they still tick) but **never** paint his tile (the exam is AoE / Strike from a different cell, not a fuse under the cowl). Player Aim Veil cannot reject Attack Nearest.  
**QA:** Observation counts his arm, not player Aim Veil. Cowl 0 XP. Rejected primaries spend 0 AP. P2 Attack Nearest skip spends AP if no other target. Challenge: AoE hits still use `recordChallengeDamageTaken`. Mark (`targetType: "enemy"`) rejects.  
**STATUS:** PROPOSED

---

### BOSS_ID: `oath_dean`

**NAME:** The Oath Dean  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A king of canon law. The only legal sentence is steel.  
**CORE_MECHANIC:** **Strike-only brand.** 1-turn wind-up. Resolve: brand the player for **1** of their turns (`oathBladePhysicalOnly: true`). While branded, any spell they resolve whose `id` is **not** `physical_attack` fizzles (AP spent, cooldown does **not** start — live fizzle). Strike / Attack Nearest / sprite-click Strike still resolve. Summon kit casts honor the brand. Distinct from Mute Thread (every next spell), Conductor (file), Hex of Silence (bar lock, `BOSS_ONLY`), Hex Toll (AP tax). Gate is `spell.id === "physical_attack"`, never `spell.name`. The learnable is **1 of their turns**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Brand every 3 turns. Kit: Strike / Expose / Heal. One destructible **Paten**; breaking it **clears the brand**. |
| 2 | ≤ 40% | `STEEL_CANON`: brand duration **2** of their turns **or** the next Strike they land deals +40% (`isPhysical` rider, kit-scaled — not % HP). Inferno + Wolf. Wolf is **not** branded (pets may still cast their kit). Paten, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Brand resolves same turn as telegraph. Paten, if alive, breaks itself. Duration stays **2** in P2. Overlay +8%. |

**SPELLS (proposed kit):** `physical_attack`, `spell-expose`, `starter-heal`, `spell-inferno` (P2), `summon-dire-wolf` (P2). Unique vs Cavalier (`physical` / haste / enrage / expose), Final (`physical` / timestep / sacrifice / wolf), Ram (`physical` / haste / shield / barrier / rally), Goad (`physical` / shield / weaken / enrage / iron-skin), Cinder (inferno / frost / haste / expose / enrage).  
**DISCOVERABLE_SPELLS:** #463 `spell-oath-blade` (`BOSS` / extra door: add `bossIds: ["oath_dean"]`). Observation **false** on first-win (card default). Kit may demonstrate. `STEEL_CANON` (duration 2 / Strike amp / Paten director) is `BOSS_ONLY`. #463 stub `oath_censor` is a first-grant rival, not this id. Do **not** grant Mute Thread, Hex of Silence, or Hex Toll from this fight.

**AI:** Brand when the player’s leftover AP ≥ 3 (they were going to cast). Skip if Paten was broken this cycle. Expose before the branded Strike window. Heal if HP < 40% and no brand is live. Wolf never receives the brand.  
**ARENA_RULES:** Paten HP = `0.15 * playerMaxHp`. Brand is a combatant flag. Fizzle spends AP (`castResultSpendsAp` includes `"fizzled"`) and records `recordChallengeApSpend`. Do **not** lock the HUD bar. Timestep / Sacrifice / summons-from-the-player fizzle.  
**SUMMONS:** 1 wolf in P2, cap 4. 0 XP. Wolf kit still casts (the brand is on the player).  
**PLAYER_COUNTERPLAY:** Just Strike; break the Paten; wait the turn; Attack Nearest; do not dump Inferno into a fizzle (`hard_3`); kill the wolf first if it is the one Exposing you.  
**MASTERY_OBJECTIVE:** Never fizzle a non-Strike under the brand (`oath_unbranded`). A telegraph you answered by waiting does **not** fail it. Casting Inferno into the brand **fails** it.  
**REWARDS:** 6 / 4 when shipped. Oath Blade is the prize (first grant wins if `oath_censor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. P1 duration **1**. P2 duration **2**. Strike amp is kit-scaled.  
**BALANCE_RISKS:** Oath + Conductor / Levy / Surplus is two spell-economy bricks — illegal. Oath + Gaze is facing lock + id lock — illegal. Table G pairs with Ram: brand telegraph **never** occupies the ram ray (the exam is “you must Strike” while he shoves you *off* melee — step back onto a legal Strike tile). Player Oath Blade cannot last 2 turns.  
**QA:** Observation is first-win (card default), not a count-gate. Paten / Wolf 0 XP. Fizzle spends AP and records `recordChallengeApSpend`. Gate is `id === "physical_attack"`. Attack Nearest still resolves. Wolf is not branded.  
**STATUS:** PROPOSED

---

## 8.8 Encounter sheets — Wave 10 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 9: **delayed occupancy pit** (Fosse / Open Pit is *immediate* walk-block, LoS-open; Wick Prelate / Fuse Tile is delayed *damage* and the cell stays walkable; Pit Wick paints a walkable wick that *converts* into an Open Pit after 1 turn — occupancy, not HP), **must-walk before next spell** (Stride taxes *walk MP spent*; Hexed is *leave this tile*; Oath is *id === physical_attack*; Mute Thread fizzles the *next any* spell; Must Pace fizzles the next spell *unless* `walkMpSpentThisTurn ≥ 1` at cast time), **three-post occupy chain** (Span Guard is origin + one adjacent *rigid body*; Twin Span is two independently-walking posts; Triple Span is *three* 1-HP posts that must remain a 4-adjacency chain), **pivot the target 90° around the caster** (Hinge Tile waits for an *enter* then swaps with the painter; Hinge Step rotates the *caster* around an ally; Pawn Trade swaps two *other* hostiles; Pivot Foe occupancy-teleports the *target* 90° clockwise around the caster if dest is free).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-10 learnables reuse **#525 ids only**. No new #137 spell ids. No #563 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, and Table G. Pairing is **Table H** only (§10.7).

**#525 stub note:** `SPELL_PROPOSALS_2026-09-24.md` already names `wick_mason` (Pit Wick MULTI), `pace_prelate` (Must Pace `BOSS`), `span_triune` (Triple Span ELITE), and `slip_castellan` (Knight Slip MULTI). Those stubs are **not** remapped to these sheets. `slip_castellan` stays Knight Slip. First grant wins if a stub ships.

---

### BOSS_ID: `crypt_sexton`

**NAME:** The Crypt Sexton  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A rook of the undercroft. The floor is honest for one breath. Then it is a grave.  
**CORE_MECHANIC:** **Delayed occupancy pit.** 1-turn wind-up paints **one** floor cell (Chebyshev ≤ 3, LoS, never spawn / portal). Resolve: that cell is a **wick** for 1 turn (walkable, LoS open). At the start of his next turn it **converts** to an Open Pit for 2 more turns (`pitTiles`, not `barrierTiles`; LoS ignores pits). Units standing on it at convert are **not** displaced. Distinct from Open Pit (immediate), Fuse Tile (delayed *damage*, still walkable), Lintel (HP% gate, still floor). The learnable is **one cell, 1-turn wick + 2-turn pit**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | One wick every 3 turns. Kit: Barrier / Drain / Slow. One destructible **Grate**; breaking it **clears every wick and pit**. |
| 2 | ≤ 40% | `NAVE_COLLAPSE`: up to **5** wicks / pits (rebuilds toward 5, never above). Inferno + Bomber. Bomber may stand on a *wick* (convert does not kill him; he occupies the later pit). Grate, if down, may rebuild once (4-turn cadence). Rotating vuln Window C: +40% from the **file that contains no pit**. |
| Enrage | turn 21 | Paint resolves same turn as telegraph. Convert still waits **1 turn**. Grate, if alive, breaks itself. Cap stays **5**. Overlay +8%. |

**SPELLS (proposed kit):** `spell-barrier`, `starter-drain`, `spell-slow`, `spell-inferno` (P2), `summon-bomber` (P2). Unique vs Fosse (barrier / frost / slow / veil / wisp), Wick (mark / poison / barrier / inferno / bomber), Levy (drain / expose / poison / cursed / barrier), Span (shield / expose / slow / iron-skin / bomber), Lintel (barrier / poison / haste / cursed / archer).  
**DISCOVERABLE_SPELLS:** #525 `spell-pit-wick` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["crypt_sexton"]`). Observation = he **paints** a wick (`kind: "cast"`). Convert is **not** a second observe. `NAVE_COLLAPSE` (5-cell lattice / Grate director) is `BOSS_ONLY`. #525 stub `wick_mason` is a first-grant rival, not this id. Do **not** grant Open Pit, Fuse Tile, Low Lintel, or Court Shove from this fight.

**AI:** Paint the cell the player will *stand on next turn* (their current tile if leftover MP = 0, else the next step toward him). Skip if Grate was broken this cycle. Never paint spawn. Never convert the only leave into a sealed pocket (`finalizePlayableLayout` after paint **and** after convert).  
**ARENA_RULES:** Grate HP = `0.15 * playerMaxHp`. Wicks / pits are **not** lava/spike `hazardTiles` (they are `pitTiles`). Cap **5**. Convert is occupancy, not HP — no `recordChallengeDamageTaken` at convert. A later walk *into* a pit fails (MP not spent). Challenge: a failed pit-step is a walk reject, not a hit.  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. Bomber death ≠ pit collapse.  
**PLAYER_COUNTERPLAY:** Leave during the wick window; Barrier last-writer fills the pit; break the Grate; Strike from a LoS-open pit file; do not camp a 5-cell lattice at convert.  
**MASTERY_OBJECTIVE:** Never occupy a wick at convert (`crypt_unopened`). Being shoved onto a wick that then converts **fails** it. A paint you leave before convert is the pass. A convert you never stood on is the pass.  
**REWARDS:** 6 / 4 when shipped. Pit Wick is the prize (first grant wins if `wick_mason` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25. Delay **fixed at 1 turn**. Cell count 1 then 5.  
**BALANCE_RISKS:** Crypt + Fosse / Lintel / Palisade / Lock is two walk prisons — illegal. Crypt + Ram / Hook / Dowager / Mill / Rime / Countess waits on MIMA-005 (forced-move onto a wick that then opens). Crypt + Wick is two delayed floors — illegal. Table H pairs with Cinder: wick/pit **never** occupies a telegraphed lance tile. Player Pit Wick cannot paint 5 cells.  
**QA:** Observation counts his paint, not player Pit Wick and not convert. Grate / Bomber 0 XP. Convert does not displace. `finalizePlayableLayout` after paint and after convert. LoS through pits. Barrier last-writer fills.  
**STATUS:** PROPOSED

---

### BOSS_ID: `march_prefect`

**NAME:** The March Prefect  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of processions. The next verse is illegal until your feet have confessed.  
**CORE_MECHANIC:** **Must-walk before next spell.** 1-turn wind-up. Resolve: brand the player (`mustWalkBeforeNextSpell: true`, `mustPaceDuration: 2`). For 2 turns **or** until they successfully resolve a spell, whichever first: if `walkMpSpentThisTurn === 0` at the moment of their next spell, that spell **fizzles** (AP spent, cooldown **does** start — live fizzle). If they already spent ≥ 1 walk MP this turn, the spell resolves and the brand **consumes**. Walk / potions do not consume it. Forced-move is **not** walk MP. Distinct from Stride (tax), Oath (Strike-only), Mute Thread (always fizzle next). Gate is the walk-spend field, never `spell.name`. The learnable is **2 turns or 1 consumed attempt**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Brand every 3 turns. Kit: Slow / Heal / Expose. One destructible **Pulpit**; breaking it **clears the brand**. |
| 2 | ≤ 45% | `CHOIR_PACE`: first successful paced spell does **not** consume (they must walk-then-cast **twice**). Haste + Archer. Archer is **not** branded. Pulpit, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Brand resolves same turn as telegraph. Pulpit, if alive, breaks itself. P2 still does not consume on first success. Overlay +8%. |

**SPELLS (proposed kit):** `spell-slow`, `starter-heal`, `spell-expose`, `spell-haste` (P2), `summon-archer` (P2). Unique vs Toll (mark / haste / shield / slow / sentinel), Hexed (mark / slow / barrier / expose / archer), Levy (drain / expose / poison / cursed / barrier), Stride (slow / haste / weaken / drain / iron-skin), Palisade (barrier / expose / weaken / sentinel / frost).  
**DISCOVERABLE_SPELLS:** #525 `spell-must-pace` (`BOSS` / extra door: add `bossIds: ["march_prefect"]`). Observation **false** on first-win (card default). Kit may demonstrate. `CHOIR_PACE` (no first-consume / Pulpit director) is `BOSS_ONLY`. #525 stub `pace_prelate` is a first-grant rival, not this id. Do **not** grant Stride Brand, Oath Blade, Mute Thread, Gait Seal, or Gait Mend from this fight.

**AI:** Brand when leftover AP ≥ 3 and leftover MP = 0 (they were going to plant). Skip if Pulpit was broken this cycle. Skip if they already walked this turn. Expose after they take the required step.  
**ARENA_RULES:** Pulpit HP = `0.15 * playerMaxHp`. Brand is a combatant flag. Fizzle spends AP (`castResultSpendsAp` includes `"fizzled"`) and records `recordChallengeApSpend`. Missing walk-spend field **fail closed** (treat as 0 → fizzle). Attack Nearest / canvas summon honor the gate. Do **not** lock the HUD bar.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP. Archer is not branded.  
**PLAYER_COUNTERPLAY:** Take a 1-MP step then cast; wait 2 turns; break the Pulpit; Strike (still a spell — must walk first unless you already did); do not dump Inferno into a fizzle (`hard_3`).  
**MASTERY_OBJECTIVE:** Never fizzle a spell under the brand (`pace_unfizzled`). A telegraph you answered by walking first does **not** fail it. Casting with 0 walk MP **fails** it. Waiting out the duration is the pass.  
**REWARDS:** 6 / 4 when shipped. Must Pace is the prize (first grant wins if `pace_prelate` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. P1 consumes on first success. P2 does not. Duration **2**.  
**BALANCE_RISKS:** March + Stride / Oath / Gaze / Levy / Surplus is two spell-economy / walk bricks — illegal. March + Lintel / Fosse / Lock / Palisade / Crypt can deny the required step — illegal. March + Goad forces the walk — illegal. Table H pairs with Conductor: the required 1-MP step **stays on the sounding file** (silence never forces a step off it). Player Must Pace cannot refuse first-consume.  
**QA:** Observation is first-win (card default), not a count-gate. Pulpit / Archer 0 XP. Fizzle spends AP and records `recordChallengeApSpend`. Forced-move does not satisfy the gate. Attack Nearest honors it. Missing walk-spend fail-closed.  
**STATUS:** PROPOSED

---

### BOSS_ID: `aisle_canon`

**NAME:** The Aisle Canon  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the rood screen. Three bodies, one aisle, no gaps.  
**CORE_MECHANIC:** **Three-post occupy chain.** 1-turn wind-up. Resolve: plant **three** 1-HP posts on a cardinal line of 3 (`summonAI: "triplespan"`, `tripleSpanCells: 3`, lifespan 4). Posts walk independently at 1 MP/step but a dest is illegal unless after the step the living posts remain a **4-adjacency connected chain**. If one dies, the remaining two use Twin Span’s adjacent-pair rule. Counts as **three** toward the 4-extra cap. Distinct from Span Guard (rigid two-cell *self*), Twin Span (two posts), Palisade (stakes, not bodies). Empty kit: posts do not Strike. The learnable is **three posts, cardinal line, chain filter**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One triple every 4 turns if cap remaining ≥ 3. Kit: Shield / Mark / Barrier. One destructible **Rood**; breaking it **kills every post**. |
| 2 | ≤ 45% | `NAVE_TRISPAN`: plant **four** posts (full extra cap; skip any kit summon). Iron Skin + Frost Nova (nova is how he answers a packed chain). Rood, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Plant resolves same turn as telegraph. Rood, if alive, breaks itself. Cap stays **4** posts. Overlay +8%. |

**SPELLS (proposed kit):** `starter-shield`, `spell-mark`, `spell-barrier`, `spell-iron-skin` (P2), `spell-frost-nova` (P2). Unique vs Span (shield / expose / slow / iron-skin / bomber), Palisade (barrier / expose / weaken / sentinel / frost), Bait (mirror / mark / shield / weaken / sentinel), Toll (mark / haste / shield / slow / sentinel), Font (heal / barrier / wisp / iron-skin / shield). No P2 summon — posts are the extras.  
**DISCOVERABLE_SPELLS:** #525 `spell-triple-span` (`ELITE` / extra door: add `bossIds: ["aisle_canon"]`). Observation = he **plants** posts (`kind: "cast"`). Later walks / deaths are not a second observe. `NAVE_TRISPAN` (4-post occupy / Rood director) is `BOSS_ONLY`. #525 stub `span_triune` is a first-grant rival, not this id. Do **not** grant Span Guard, Twin Span, Span Pylon, or Dummy Post from this fight.

**AI:** Plant a 3-line that *cuts the approach* (usually the file between spawn and him). Skip if Rood was broken this cycle. Skip if cap remaining < 3 (P1) or < 4 (P2). Skip if the line is not free. Never plant on portals / spawn. Posts walk to stay a chain that blocks the shortest path (`finalizePlayableLayout` after plant — a Strike tile on him must still exist).  
**ARENA_RULES:** Rood HP = `0.15 * playerMaxHp`. Posts are extras, **not** enemies for victory / XP. Empty kit. 4-adj chain filter on walk dest (MIMA-2026-08-31-002). `inferSummonArchetype` keys `summonAI === "triplespan"`, never `name.includes("span")`.  
**SUMMONS:** 3 posts in P1 / 4 in P2, cap 4. 0 XP. Post death ≠ victory.  
**PLAYER_COUNTERPLAY:** Kill one post (chain becomes two); Open Pit a required step; File Lance / Frost Nova the line; break the Rood; walk around a 3-line that is not a wall.  
**MASTERY_OBJECTIVE:** Never occupy a post cell (`rood_unoccupied`). Being pivoted/shoved onto a post cell **fails** it. Killing posts from a non-post cell is the pass.  
**REWARDS:** 6 / 4 when shipped. Triple Span is the prize (first grant wins if `span_triune` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Post count 3 then 4. Post HP uses summon hpScale 0.3 vs player, not catalog sponges.  
**BALANCE_RISKS:** Aisle + Span / Palisade / Fosse / Lock / Mill is two occupy / walk prisons — illegal. Aisle + Cover / Cord is a double body-exam — illegal. Aisle + Crypt / Fosse plants posts on pits — illegal. Table H pairs with Ram: ram ray **never** occupies **all** living posts (answers one). Player Triple Span cannot plant 4.  
**QA:** Observation counts his plant, not player Triple Span and not a later walk. Rood / posts 0 XP. Chain filter on dest. Cap 4. `finalizePlayableLayout` after plant. `summonAI === "triplespan"`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `orbit_succentor`

**NAME:** The Orbit Succentor  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A queen of the choir loft. You were beside her. Now you are behind the pillar.  
**CORE_MECHANIC:** **Pivot target 90° around the caster.** 1-turn wind-up. Resolve: let `dx, dy` be player − him. Dest = him + `(dy, −dx)` (90° clockwise). If dest is `isCellFree`, occupancy-teleport the **player** there (not `isSwap`, not `swapPositions`). If dest is blocked, fizzle (AP spent). He does not move. `movedThisTurn` = true on a successful pivot. Distinct from Hinge Tile (enter-swap), Hinge Step (caster around ally), Pawn Trade (two other hostiles). Does **not** set `isSwap`. Clockwise only (`pivotClockwise: true`). The learnable is **90° around the caster, dest free**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Pivot every 3 turns if dest is free. Kit: Blast / Slow / Mirror. One destructible **Ambit**; breaking it **cancels the next pivot**. |
| 2 | ≤ 45% | `CHOIR_ORBIT`: pivot is around the **Ambit** (if alive), not around him. Expose + Lifesteal Nova. If Ambit is down, P1 rule resumes (around him). Ambit, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Pivot resolves same turn as telegraph. Ambit, if alive, breaks itself (P2 then falls back to around-him). Overlay +8%. |

**SPELLS (proposed kit):** `starter-blast`, `spell-slow`, `spell-mirror`, `spell-expose` (P2), `spell-lifesteal-nova` (P2). Unique vs Hinge (blast / barrier / haste / weaken / archer), Wedge (blast / iron-skin / mark / inferno / enrage), Static (blast / haste / nova / expose), Queen (blast / mark / nova / veil), Veil (poison / mirror / slow / enrage / frost-nova), Cover (heal / mirror / haste / wisp / rally).  
**DISCOVERABLE_SPELLS:** #525 `spell-pivot-foe` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["orbit_succentor"]`). Observation = he **casts** Pivot (`kind: "cast"`), including a blocked-dest fizzle after AP. `CHOIR_ORBIT` (around Ambit / Ambit director) is `BOSS_ONLY`. Do **not** grant Hinge Tile, Hinge Step, Pawn Trade, Pair Hinge, Court Hinge, or Swap from this fight.

**AI:** Pivot when dest is free **and** worse for the player (off melee, onto a Barrier-adjacent cell, off a sounding file). Skip if Ambit was broken this cycle (P1 skip; P2 falls back only if Ambit is *down*, not “broken this cycle” — if it broke this cycle, skip the turn). Never dest onto spawn / a sealed pocket (`finalizePlayableLayout` after pivot). Claim Ward / Grounded Lock on dest: fizzle, AP spent.  
**ARENA_RULES:** Ambit HP = `0.15 * playerMaxHp`. Dest hazard ticks wait on MIMA-001 / 005 — until then dest onto lava/rime/fuse/pit is **illegal AI** (skip). Challenge: the pivot is movement, not a hit. `movedThisTurn` true.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Stand so every clockwise dest is a wall; occupy the dest with a pet; Nail / Claim the dest; break the Ambit; Attack Nearest from the new cell.  
**MASTERY_OBJECTIVE:** Never be pivoted (`ambit_unpivoted`). A blocked dest (he fizzles) is the pass. Being shoved by someone else does **not** fail it. A successful dest **fails** it.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Angle **fixed 90° clockwise**. P2 pivot origin is the Ambit cell.  
**BALANCE_RISKS:** Orbit + Hinge / Grandmaster / Counter / Morrow is two swap / blink verbs — illegal. Orbit + Hook / Dowager / Mill / Ram waits on MIMA-005. Orbit + Crypt / Fosse / Wick / Rime / Countess is dest-onto-hazard — illegal. Orbit + Gaze / Wedge is two facing / cone directors — illegal. Table H pairs with Palisade: dest **never** into a sealed pocket; landing must stay on a punched lane. Player Pivot Foe cannot orbit a third body.  
**QA:** Observation counts his cast (including blocked fizzle). Ambit 0 XP. Dest blocked = fizzle, AP spent. Not `swapPositions`. Clockwise only. `finalizePlayableLayout` after pivot. Attack Nearest uses the new cell.  
**STATUS:** PROPOSED

---

## 8.9 Encounter sheets — Wave 11 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 10: **walk-MP forbid, casts still legal** (Rank Lock still *allows* an axis walk; Must Pace *requires* a walk before the next spell; Stride *taxes* walk MP; Gait Seal *forbids* walk MP until the start of their next turn while spell casts remain legal — forced-move still legal), **diagonal-only walks** (Rank Lock is rank XOR file — cardinal *or* that file; Diag Lock is bishop gait: each walk step must satisfy `|dx|===|dy|` and `dx≠0`), **move an existing barrier 1** (Barrier *places* a new brick; Palisade plants *stakes*, not `barrierTiles`; Low Lintel *HP-gates* a walk on floor; Brick Shift *relocates* a paid `barrierTiles` key Chebyshev 1 onto a free cell), **next applied hit 0 to you, half to the attacker** (Mirror reflects the *spell*; Cover redirects the *whole hit* to an ally; Sidestep *misses*; Pain Link *shares*; Return Sting consumes **before HP write** and pokes `floor(applied * 0.5)` at the attacker).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-11 learnables reuse **#563 ids only**. No new #137 spell ids. No #636 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, and Table H. Pairing is **Table I** only (§10.8).

**#563 stub note:** `SPELL_PROPOSALS_2026-09-25.md` already names `gait_cantor` (Gait Mend), `pair_usher` (Pair Hinge MULTI), `flush_precentor` (Cadence Flush MULTI), `dummy_castellan` (Dummy Post MULTI), and `court_hinge_regent` (Court Hinge kit-only). Those stubs are **not** remapped to these sheets. Gait Seal / Diag Lock / Brick Shift / Return Sting have **no** stub. First grant wins if a stub ships.

---

### BOSS_ID: `sole_thurifer`

**NAME:** The Sole Thurifer  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the incense walk. The censer swings. Your feet do not.  
**CORE_MECHANIC:** **Walk-MP forbid, casts still legal.** 1-turn wind-up. Resolve: brand the player (`forbidWalkMpSpend: true`, `gaitSealDuration: 1`). Until the start of their next turn they cannot spend walk MP. Spell casts, Strike, potions, and **forced-move** (hook / swap / mill / pivot) remain legal. Distinct from Rank Lock (walk allowed on an axis), Must Pace (next *spell* fizzles unless they walked), Stride (tax), Grounded Lock (no swap/blink). Gate is the walk-spend field, never `spell.name`. The learnable is **1 turn, feet only**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Seal every 3 turns. Kit: Poison / Slow / Weaken. One destructible **Thurible**; breaking it **clears the seal**. |
| 2 | ≤ 45% | `CHOIR_SOLE`: seal the player **and** every living player-side summon. Iron Skin + Wisp. Wisp is sealed (cannot walk; can still Mend). Thurible, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Seal resolves same turn as telegraph. Thurible, if alive, breaks itself. P2 still seals pets. Overlay +8%. |

**SPELLS (proposed kit):** `starter-poison`, `spell-slow`, `spell-weaken`, `spell-iron-skin` (P2), `summon-wisp` (P2). Unique vs Stride (slow / haste / weaken / drain / iron-skin), March (slow / heal / expose / haste / archer), Veil (poison / mirror / slow / enrage / frost-nova), Lintel (barrier / poison / haste / cursed / archer), Levy (drain / expose / poison / cursed / barrier).  
**DISCOVERABLE_SPELLS:** #563 `spell-gait-seal` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["sole_thurifer"]`). Observation = he **casts** the seal (`kind: "cast"`). Duration expiry is not a second observe. `CHOIR_SOLE` (pet seal / Thurible director) is `BOSS_ONLY`. Do **not** grant Rank Lock, Must Pace, Stride Brand, Gait Mend, or Grounded Lock from this fight. #563 stub `gait_cantor` is Gait Mend, not this id.

**AI:** Seal when leftover MP ≥ 2 (they were going to step). Skip if Thurible was broken this cycle. Skip if they already have 0 MP. After a seal, kit Slow / Poison — do not waste a turn walking into Strike if they can still cast.  
**ARENA_RULES:** Thurible HP = `0.15 * playerMaxHp`. Seal is a combatant flag. Walk preview / live gate / execute share the reject (MP not spent). Forced-move still legal. Summon-control walks spend the **player** walk pool today — a seal on the player blocks that path (document; do not silently use summon MP). Missing walk-spend field **fail closed** (treat as forbidden). Attack Nearest is a cast — legal under seal.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP. P2 seals the wisp too.  
**PLAYER_COUNTERPLAY:** Cast from the plant; wait 1 turn; break the Thurible; accept a hook/mill/swap as the only reposition; do not dump walk-preview clicks into a reject.  
**MASTERY_OBJECTIVE:** Never attempt walk MP under the seal (`sole_unstepped`). A telegraph you answered by *not* clicking walk is the pass. A rejected walk **fails** it. Forced-move does **not** fail it. Waiting out the duration is the pass.  
**REWARDS:** 6 / 4 when shipped. Gait Seal is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Duration **1**. P1 player only. P2 player + living player-side summons.  
**BALANCE_RISKS:** Sole + Rank Lock / Must Pace / Stride / Hex / Goad / Fosse / Lock / Palisade / Crypt / Lintel is two walk bricks — illegal. Sole + Wedge / Gaze can deny the only plant answer — illegal. Sole + Conductor can silence the plant file — illegal unless a sounding file still reaches him. Table I pairs with Hook: seal **never** resolves on a hook-glow turn (one answer). Reel is forced-move (legal). Player Gait Seal cannot seal pets.  
**QA:** Observation counts his cast, not player Gait Seal and not expiry. Thurible / Wisp 0 XP. Walk reject spends 0 MP. Forced-move legal. Attack Nearest legal. Missing walk-spend fail-closed. Pet seal is P2 only.  
**STATUS:** PROPOSED

---

### BOSS_ID: `bias_prebendary`

**NAME:** The Bias Prebendary  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the quoin. Cardinal steps are heresy. The diagonal is the aisle.  
**CORE_MECHANIC:** **Diagonal-only walks.** 1-turn wind-up. Resolve: brand the player (`walkDiagonalOnlyTurns: 2`). For 2 of their turns, a walk dest is legal only if `|dx|===|dy|` and `dx≠0` from their **current** cell (each step of a path must be diagonal). Forced movement still legal. Distinct from Rank Lock (cardinal axis), Even Stride (even Manhattan), Bias Ray (diagonal *cast* geometry). Gate is the walk dest filter, never `pieceType`. The learnable is **2 turns, walks only**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Brand every 3 turns. Kit: Blast / Mark / Slow. One destructible **Quoin**; breaking it **clears the brand**. |
| 2 | ≤ 45% | `NAVE_BIAS`: brand the player **and** every living player-side summon. Iron Skin + Archer. Archer is branded (diagonal walks). Quoin, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Brand resolves same turn as telegraph. Quoin, if alive, breaks itself. P2 still brands pets. Overlay +8%. |

**SPELLS (proposed kit):** `starter-blast`, `spell-mark`, `spell-slow`, `spell-iron-skin` (P2), `summon-archer` (P2). Unique vs Wedge (blast / iron-skin / mark / inferno / enrage), Hinge (blast / barrier / haste / weaken / archer), Orbit (blast / slow / mirror / expose / nova), Static (blast / haste / nova / expose), Queen (blast / mark / nova / veil).  
**DISCOVERABLE_SPELLS:** #563 `spell-diag-lock` (`ELITE` / extra door: add `bossIds: ["bias_prebendary"]`). Observation = he **casts** the brand (`kind: "cast"`). Later rejected cardinals are not a second observe. `NAVE_BIAS` (pet brand / Quoin director) is `BOSS_ONLY`. Do **not** grant Rank Lock, Must Pace, Gait Seal, or Knight Slip from this fight.

**AI:** Brand when they have a cardinal approach (Chebyshev file/rank aligned, leftover MP ≥ 1). Skip if Quoin was broken this cycle. Skip if they are already on a diagonal to him (brand is weaker). Mark the diagonal they *must* take.  
**ARENA_RULES:** Quoin HP = `0.15 * playerMaxHp`. Brand is a combatant flag. Preview, live gate, and execute of **walks** (not casts) share the filter. Knight Slip / Vault / Swap / Mill / Pivot are not walks. A rejected cardinal spends 0 MP. `finalizePlayableLayout` after brand: a diagonal step toward a Strike tile on him must still exist, or skip the brand.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP. P2 brands the archer too.  
**PLAYER_COUNTERPLAY:** Take diagonal steps; wait 2 turns; break the Quoin; Swap / mill / hook as a cardinal escape; Strike from a diagonal; do not path a 2-step cardinal.  
**MASTERY_OBJECTIVE:** Never attempt a cardinal walk under the brand (`bias_cardinal_free`). A rejected cardinal **fails** it. Diagonal walks are the pass. Forced-move cardinal does **not** fail it. Waiting out the duration is the pass.  
**REWARDS:** 6 / 4 when shipped. Diag Lock is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Duration **2**. P1 player only. P2 player + living player-side summons.  
**BALANCE_RISKS:** Bias + Rank Lock / Must Pace / Sole / Lock / Fosse / Palisade / Crypt / Lintel is two walk prisons — illegal. Bias + Rime / Mill dest-on-gutter waits on MIMA-005 for *hazard* ticks; mill *position* is legal (forced-move). Table I pairs with Mill: mill cells **never** occupy a legal diagonal step. Player Diag Lock cannot brand pets.  
**QA:** Observation counts his cast, not player Diag Lock and not a later reject. Quoin / Archer 0 XP. Cardinal reject spends 0 MP. Forced-move legal. `finalizePlayableLayout` after brand. Pet brand is P2 only.  
**STATUS:** PROPOSED

---

### BOSS_ID: `brick_cellarer`

**NAME:** The Brick Cellarer  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A rook of the undercroft masonry. The wall you paid for is now a door. The door is now a wall.  
**CORE_MECHANIC:** **Move an existing barrier 1.** 1-turn wind-up paints **one** `barrierTiles` brick (never a world wall). Resolve: dest = Chebyshev exactly 1, `isCellFree` (no occupant, not wall, not void, not portal, not another barrier). Move the barrier key. Duration remaining on that brick is unchanged. If no legal dest, fizzle (AP spent). Distinct from Barrier (places a *new* brick), Palisade (stakes, not `barrierTiles`), Low Lintel (HP-gated floor), Open Pit / Nail Down. The learnable is **one brick, distance 1**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Places Barrier, then shifts it every 3 turns if a brick exists. Kit: Barrier / Shield / Frost. One destructible **Mortar**; breaking it **reverts every shifted brick to its paint cell** (if free; else the brick expires). |
| 2 | ≤ 40% | `NAVE_MASONRY`: shift **every** living brick 1 toward the player (skip a brick with no legal dest). Enrage + Sentinel. Sentinel does not count as a brick. Mortar, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Shift resolves same turn as telegraph. Mortar, if alive, breaks itself (revert then). Cap of live bricks stays the Barrier kit’s own (not a new wall of 50). Overlay +8%. |

**SPELLS (proposed kit):** `spell-barrier`, `starter-shield`, `starter-frost`, `spell-enrage` (P2), `summon-sentinel` (P2). Unique vs Palisade (barrier / expose / weaken / sentinel / frost), Aisle (shield / mark / barrier / iron-skin / frost), Fosse (barrier / frost / slow / veil / wisp), Crypt (barrier / drain / slow / inferno / bomber), Font (heal / barrier / wisp / iron-skin / shield), Ram (`physical` / haste / shield / barrier / rally).  
**DISCOVERABLE_SPELLS:** #563 `spell-brick-shift` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["brick_cellarer"]`). Observation = he **casts** a shift (`kind: "cast"`), including a no-dest fizzle after AP. `NAVE_MASONRY` (all-brick shove / Mortar director) is `BOSS_ONLY`. Do **not** grant Barrier (already innate), Palisade Cover, Low Lintel, Open Pit, or Dummy Post from this fight.

**AI:** Shift the brick that *cuts the shortest path* (usually one step toward spawn or onto a flanking file). Skip if Mortar was broken this cycle. Skip if no `barrierTiles`. Never dest onto spawn / portal / a sealed pocket (`finalizePlayableLayout` after shift — a Strike tile on him must still exist). Last-writer: a pit / pad / slide on the dest **blocks** the move (skip).  
**ARENA_RULES:** Mortar HP = `0.15 * playerMaxHp`. World walls are **not** `barrierTiles`. Two-click UX for the player spell; the boss AI picks source then dest. Occupant on dest = illegal (not a shove). Hazard ticks on a later walk *into* the new brick are existing barrier rules, not a new damage type.  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP. Sentinel death ≠ brick collapse.  
**PLAYER_COUNTERPLAY:** Occupy the dest; Open Pit / Nail the dest; break the Mortar (bricks snap back); Strike around a 1-step wall; do not stand in the only dest.  
**MASTERY_OBJECTIVE:** Never occupy a brick dest cell (`brick_unoccupied_dest`). Being shifted-*onto* is impossible (dest must be free). Standing on the dest **before** resolve **fails** it (he skips or you moved there). A fizzle because you occupied dest is the pass.  
**REWARDS:** 7 / 5 when shipped. Brick Shift is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25. Distance **fixed at 1**. P1 one brick. P2 every brick toward the player.  
**BALANCE_RISKS:** Brick + Palisade / Fortress / Fosse / Crypt / Lock / Lintel / Aisle / Span is two wall / walk prisons — illegal. Brick + Mill / Rime / Dowager / Hook dest-onto-hazard waits on MIMA-001 / 005 — dest onto those paints is **illegal AI**. Table I pairs with Gaze: brick dest **never** occupies the pin telegraph. Player Brick Shift cannot mass-shove.  
**QA:** Observation counts his cast (including no-dest fizzle). Mortar / Sentinel 0 XP. World walls illegal source. Dest occupied = skip/fizzle. `finalizePlayableLayout` after shift. Revert on Mortar break.  
**STATUS:** PROPOSED

---

### BOSS_ID: `rebound_almoner`

**NAME:** The Rebound Almoner  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A pawn of alms. You strike the bowl. Half the coin comes back.  
**CORE_MECHANIC:** **Next applied hit 0 to you, half to the attacker.** 1-turn wind-up. Resolve: arm 1 charge (`returnNextHitRatio: 0.5`). The next **applied** damaging hit against him (after existing RES/SR/crit/Mark, before HP write) deals **0** to him and deals `floor(applied * 0.5)` to the **attacker** through existing `dealDamage` (`isPhysical: false`). Charge consumes even if the attacker is already dead after other riders (then the poke fizzles). Distinct from Mirror (reflects the *spell*), Cover (redirect whole hit), Sidestep (miss), Pain Link / Flank Share (share). Self-hits / lava / fuse ticks do **not** consume. The learnable is **1 charge, 0.5 poke**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Arm every 3 turns. Kit: Heal / Expose / Enrage. One destructible **Alms-dish**; breaking it **clears the charge**. |
| 2 | ≤ 45% | `CHOIR_REBOUND`: the next **3** applied hits return (still 0.5 each). Shadow Veil + Wisp. Wisp is **not** armed. Alms-dish, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Arm resolves same turn as telegraph. Alms-dish, if alive, breaks itself. P2 still 3 charges. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-expose`, `spell-enrage`, `spell-shadow-veil` (P2), `summon-wisp` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Oath (`physical` / expose / heal / inferno / wolf), Lament (heal / barrier / weaken / enrage / sacrifice), Font (heal / barrier / wisp / iron-skin / shield), Gaze (frost / mark / iron / weaken / veil).  
**DISCOVERABLE_SPELLS:** #563 `spell-return-sting` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["rebound_almoner"]`). Observation = he **arms** (`kind: "cast"`). Consume / poke is not a second observe. `CHOIR_REBOUND` (3 charges / Alms-dish director) is `BOSS_ONLY`. Do **not** grant Mirror, Cover Step, Sidestep Ward, Pain Link, or Flank Share from this fight.

**AI:** Arm when the player has leftover AP ≥ 2 (a hit is coming) **or** they are adjacent. Skip if Alms-dish was broken this cycle. Skip if already armed. Expose after they spend the swing into 0. Do **not** arm into a DoT tick as the “hit” if a Strike is also coming — Strike is the exam.  
**ARENA_RULES:** Alms-dish HP = `0.15 * playerMaxHp`. Consume **before** HP write. Do not edit `combatMath.ts` beyond passing the already-computed applied value into a consume helper. Challenge: 0 applied is not `recordChallengeDamageTaken`; the poke to the attacker **is** a spell-hit if it deals > 0. Lava / spikes / fuse / wick convert do not consume. DoT **apply** is a damaging hit (consumes); later ticks are not.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP. Wisp is not armed.  
**PLAYER_COUNTERPLAY:** Break the Alms-dish; wait the arm out (if it expires unused at his next arm cadence — charge lasts until consumed or overwritten); poke with a cheap DoT apply to burn the charge; Strike after it is gone; do not dump Inferno into 0 (`hard_3`).  
**MASTERY_OBJECTIVE:** Never consume Return Sting (`alms_unconsumed`). An unused arm that he overwrites is the pass. Being hit while unarmed is the pass. A 0-applied consume **fails** it.  
**REWARDS:** 5 / 3 when shipped. Return Sting is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Ratio **fixed 0.5**. P1 1 charge. P2 3 charges. No HP added.  
**BALANCE_RISKS:** Rebound + Cover / Sovereign / Archbishop / Pain-Link Fortress is two hit-economy / reflect directors — illegal. Rebound + Wick / Countess / Crypt (hazard as the “hit”) is a false exam — illegal (those ticks do not consume, so the arm idles). Table I pairs with Wedge: cone **never** occupies the Alms-dish tile. The cone *is* an applied hit (legal consume). Player Return Sting cannot stack 3 charges.  
**QA:** Observation counts his arm, not player Return Sting and not consume. Alms-dish / Wisp 0 XP. Consume before HP write. 0 applied is not `recordChallengeDamageTaken`. Poke > 0 is a spell-hit. Lava/fuse do not consume. DoT apply consumes; ticks do not.  
**STATUS:** PROPOSED

---


## 8.10 Encounter sheets — Wave 12 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 11: **heal if the caster walked** (Font is a *stationary* pulse; Cover / Rebound *kits* include Mend but their *cores* are redirect / return-poke; Post Sting bonuses if *unmoved*; Boot Sting *damages* if walked; Sole *forbids* walk MP; March *requires* a walk before the *next spell*; Gait Mend heals **8 iff** `walkMpSpentThisTurn ≥ 1` — forced-move does **not** pay), **90° hinge of two hostiles around their midpoint** (Pivot Foe = one body around the *caster*; Hinge Tile = enter-swap with the *painter*; Pawn Trade = *swap* two hostiles; Hinge Step = caster around an ally; Pair Hinge rotates **both** occupancy dests 90° clockwise around the pair midpoint — not `isSwap`, not `swapPositions`), **delayed tile heal** (Wick Prelate = delayed *damage* still walkable; Crypt = delayed *pit convert*; Font pulses *now*; Mend Wick paints a walkable pad that heals the **occupant at tick**, 0 damage), **unit-scoped next-hit amp** (tile Mark doubles the next *spell on a cell*; Hex is leave-or-detonate; Glyph is a trap; Body Mark is ×1.5 on that **unit’s** next applied damaging hit, then consumes).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-12 learnables reuse **remaining #563 ids only**. No new #137 spell ids. No #636 / #695 / #726 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, and Table I. Pairing is **Table J** only (§10.9).

**#563 stub note:** `SPELL_PROPOSALS_2026-09-25.md` already names `gait_cantor` (Gait Mend) and `pair_usher` (Pair Hinge MULTI). Those stubs are **not** remapped to `infirm_chanter` / `yoke_subchanter`. Mend Wick / Body Mark have **no** stub. First grant wins if a stub ships.

---

### BOSS_ID: `infirm_chanter`

**NAME:** The Infirm Chanter  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop of the walking psalm. He mends only after he takes a step. Stand still and the hymn dries up.  
**CORE_MECHANIC:** **Heal if the caster walked.** Every 3 turns he telegraphs a 1-tile **procession** (Chebyshev 1). Resolve: he **must walk** onto that cell (1 MP). If `walkMpSpentThisTurn ≥ 1` after the step, he heals **8** (flat, not % HP — `challengeHealUsedRef` is player-side only). If the step is blocked, the hymn **fizzles** (AP spent, 0 heal). Distinct from Font (stationary pulse), Sole (forbid *your* walk), March (must-walk before *your* next spell), Stride (tax). The learnable is **self heal 8 iff walked**. Forced-move does **not** pay.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Procession every 3 turns. Kit: Heal / Haste / Strike. One destructible **Infirmary**; breaking it **skips the next hymn** (does not refund a fizzle). |
| 2 | ≤ 45% | `CHOIR_INFIRM`: if **you** spent ≥ 1 walk MP on *your* last turn, he also heals 8 at the start of his turn (still flat, still capped so he never exceeds **150% start HP**). Iron Skin + Wisp. Wisp does **not** pay his hymn. Infirmary, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Hymn resolves same turn as telegraph (overlay rule). Infirmary, if alive, breaks itself. P2 siphon still requires *your* walk MP. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-haste`, `physical_attack`, `spell-iron-skin` (P2), `summon-wisp` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Font (heal / barrier / wisp / iron-skin / shield), Rebound (heal / expose / enrage / veil / wisp), March (slow / heal / expose / haste / archer), Oath (`physical` / expose / heal / inferno / wolf), Cord (wisp / heal / mirror / wolf / sacrifice).  
**DISCOVERABLE_SPELLS:** #563 `spell-gait-mend` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["infirm_chanter"]`). Observation = he **casts** the hymn (`kind: "cast"`), including a blocked-step fizzle after AP. `CHOIR_INFIRM` (your-walk siphon / Infirmary director) is `BOSS_ONLY`. Do **not** grant Font, Sole, March, Stride, or Cover from this fight. #563 stub `gait_cantor` is **not** this id.

**AI:** Telegraph a free Chebyshev-1 cell toward cover, not into Strike. Skip if Infirmary was broken this cycle. Skip if already at 150% start. Wisp recast only under cap. Strike when the hymn fizzled.  
**ARENA_RULES:** Infirmary HP = `0.15 * playerMaxHp`. Heal is **flat 8** at L1 reference (SP-scaled like other kit heals — **not** % HP). Growth cap **1.50× start**. Forced-move (hook / mill / swap / hinge / pair-hinge) does **not** set `walkMpSpentThisTurn`. Missing walk-spend field **fail closed** (0 heal).  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP. Wisp Mend is kit, not a hymn.  
**PLAYER_COUNTERPLAY:** Occupy the procession cell; break the Infirmary; stand still in P2 so the siphon is dry; Strike the fizzle turn; do not dump walk MP “for free” in P2.  
**MASTERY_OBJECTIVE:** He never successfully Gait Mends (`infirm_unpaid`). A blocked step / Infirmary skip is the pass. P2 siphon from *your* walk does **not** fail it (that is his director, not the hymn).  
**REWARDS:** 5 / 3 when shipped. Gait Mend is the prize (first grant wins if `gait_cantor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Heal **flat**. Cap 1.50×. Walk distance **1**.  
**BALANCE_RISKS:** Infirm + Sole / March / Stride / Hex / Lock / Bias is two walk exams — illegal. Infirm + Font / Lament is two heal directors — illegal. Table J pairs with Levy: Tithe-box **never** occupies the Infirmary. Player Gait Mend cannot siphon from the foe’s walk.  
**QA:** Observation counts his hymn cast, not player Gait Mend and not P2 siphon. Infirmary / Wisp 0 XP. Forced-move ≠ walk MP. Heal 8 does not flip player `challengeHealUsedRef`. Cap 1.50×. Missing walk-spend fail-closed.  
**STATUS:** PROPOSED

---

### BOSS_ID: `yoke_subchanter`

**NAME:** The Yoke Subchanter  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A knight of the paired verse. Two bodies, one hinge. The midpoint is the choir loft.  
**CORE_MECHANIC:** **90° pair-hinge.** 1-turn wind-up paints **two** living hostiles that are Chebyshev-adjacent (prefer player + a player-side summon; if no summon, skip — never hinge the player with *his* wisp as the pair). Resolve: both occupancy dests rotate **90° clockwise** around their midpoint. Stop / skip a body whose dest is occupied, void, portal, or a world wall (`finalizePlayableLayout` after — a Strike tile on him must still exist). Distinct from Pivot (one body around *him*), Hinge Tile (enter-swap with a *painted cell*), Pawn Trade (*swap*), Orbit (pivot around Ambit). The learnable is **one pair, 90°, clockwise**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Pair every 3 turns if two legal bodies exist. Kit: Swap / Haste / Expose. One destructible **Yoke-pin**; breaking it **skips the next hinge**. |
| 2 | ≤ 40% | `COURT_YOKE`: every Chebyshev-adjacent **hostile pair** on the board hinges (cap 2 pairs / 4 bodies). Iron Skin + Wisp. Wisp is **not** a legal pair-partner with the player (his side). Yoke-pin, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Hinge resolves same turn as telegraph. Yoke-pin, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `spell-swap`, `spell-haste`, `spell-expose`, `spell-iron-skin` (P2), `summon-wisp` (P2). Unique vs Morrow (swap / haste / drain / mirror / wolf), Counter (swap / mark / weaken / sentinel / haste), Dowager (swap / frost / barrier / nova / veil), Grandmaster (blast / swap / mirror / timestep / frost), Enthroned (swap / slow / wolf / veil / frost), Lich (cursed / swap / mark / veil / wisp).  
**DISCOVERABLE_SPELLS:** #563 `spell-pair-hinge` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["yoke_subchanter"]`). Observation = he **casts** a hinge (`kind: "cast"`), including a no-pair skip after AP. `COURT_YOKE` (mass pairs / Yoke-pin director) is `BOSS_ONLY`. Do **not** extra-door `spell-court-hinge`. Do **not** grant Pivot Foe, Hinge Tile, Pawn Trade, or Swap (already innate) from this fight. #563 stub `pair_usher` is **not** this id.

**AI:** Prefer player + living player summon. Skip if Yoke-pin was broken this cycle. Skip if dests fail `isCellFree`. Never dest onto spawn / portal / a sealed pocket. Last-writer: a pit / pad / slide on the dest **blocks** that body (the other may still rotate).  
**ARENA_RULES:** Yoke-pin HP = `0.15 * playerMaxHp`. Occupancy dests, **not** `isSwap` / `swapPositions`. Hazard ticks on dest wait on MIMA-001 / 005 — until then, dest onto rime / fuse / lava / wick is **illegal AI**. Clockwise only. Midpoint is the average of the two cells, rounded toward him on a .5.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP. Wisp is not a player-pair partner.  
**PLAYER_COUNTERPLAY:** Bring no summon (he skips); occupy a dest; break the Yoke-pin; Barrier a dest; do not stand adjacent to your own pet when the glow is up.  
**MASTERY_OBJECTIVE:** Never be one of the two rotated bodies (`yoke_unspun`). A skip because you had no pair is the pass. Occupying a dest so *he* skips is the pass. Being dest-blocked while the other body moves does **not** fail it (you were not dest’d).  
**REWARDS:** 6 / 4 when shipped. Pair Hinge is the prize (first grant wins if `pair_usher` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25. Rotation **90° clockwise**. P1 one pair. P2 cap 2 pairs.  
**BALANCE_RISKS:** Yoke + Hinge / Orbit / Counter / Grandmaster / Morrow / Hook / Dowager / Mill / Ram is two relocate directors / MIMA — illegal. Yoke + Cord is pair-required + summon-gate — illegal. Table J pairs with Veil: dests **never** occupy the Cowl. Player Pair Hinge cannot mass-hinge.  
**QA:** Observation counts his cast (including no-pair skip). Yoke-pin / Wisp 0 XP. Not `swapPositions`. Clockwise only. `finalizePlayableLayout` after hinge. Dest onto hazard is illegal AI until MIMA-001 / 005.  
**STATUS:** PROPOSED

---

### BOSS_ID: `salve_wicker`

**NAME:** The Salve Wicker  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the infirmary wick. The floor will mend whoever is foolish enough to wait.  
**CORE_MECHANIC:** **Delayed tile heal.** Every 3 turns he telegraphs 1 pad (the player’s cell **at wind-up**). Two world turns later the **occupant** heals **6** (flat; player-side heal flips `challengeHealUsedRef` if HP actually increased; enemy-side is his choir). Pad is walkable. Last writer on a cell wins (Barrier / pit / fuse replaces the pad). Distinct from Fuse (delayed *damage*), Pit Wick (converts to *unwalkable*), Font (*now*). The learnable is **one cell, delay 2, heal 6, radius 0**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One pad / 3 turns. Kit: Heal / Mark / Slow. One destructible **Salver**; breaking it **adds +1 to every live pad’s remaining turns** (once per Salver). |
| 2 | ≤ 45% | `NAVE_SALVE`: 3-pad **diagonal cross** on his color complex (player cell at wind-up + two diagonal escapes). Barrier + Wisp. Wisp standing on a pad at tick **is** a legal occupant (heals the wisp, not you). Salver, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Pads tick in **1** world turn (was 2). Salver, if alive, breaks itself (the +1 is wasted — no soft-lock). Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-mark`, `spell-slow`, `spell-barrier` (P2), `summon-wisp` (P2). Unique vs Font (heal / barrier / wisp / iron-skin / shield), Hexed (mark / slow / barrier / expose / archer), Archivist (cursed / mark / barrier / archer / veil), Infirm (heal / haste / physical / iron-skin / wisp), Toll (mark / haste / shield / slow / sentinel), Wick (mark / poison / barrier / inferno / bomber).  
**DISCOVERABLE_SPELLS:** #563 `spell-mend-wick` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["salve_wicker"]`). Observation = he **places** a pad (`kind: "cast"`). The **3-pad cross / 1-turn enrage** is `BOSS_ONLY`. Do **not** grant Fuse Tile, Pit Wick, Font, or Enter Mend from this fight.

**AI:** Place on the wind-up tile, not the current tile at tick. Recast Wisp only under cap. Never pad spawn / portal. Mark does **not** amp pads (explicit: environmental heal, no `isMark`).  
**ARENA_RULES:** Pad table is **not** `hazardTiles` (those are lava/spikes/void). Cap **8** live pads. Salver HP = `0.15 * playerMaxHp`. Heal is **flat 6**, not % HP. Caster death does not cancel live pads.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Leave the glow; Barrier the cell; break the Salver to buy a turn; body-block with a summon if you *want* the heal; do not Mark-amp greed on a pad (it will not amp).  
**MASTERY_OBJECTIVE:** Never occupy a pad at tick (`salve_unsipped`). A Salver delay that lets you step off is the pass. Healing *him* by leaving him on a pad does **not** fail it.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Delay **2** until enrage. Heal **flat 6**.  
**BALANCE_RISKS:** Salve + Wick / Crypt / Font is two delayed-tile / heal directors — illegal. Salve + Infirm / Lament is two heal loops — illegal. Table J pairs with Bait: intercept **never** occupies the pad. Player Mend Wick is one cell, delay 2, radius 0.  
**QA:** Observation counts his place, not player Mend Wick and not tick. Salver / Wisp 0 XP. Player-side HP gain flips `challengeHealUsedRef`. Mark does not amp. Barrier replaces pad.  
**STATUS:** PROPOSED

---

### BOSS_ID: `brand_curate`

**NAME:** The Brand Curate  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A pawn-clerk of the margin. He does not mark the floor. He marks **you**.  
**CORE_MECHANIC:** **Unit-scoped next-hit amp.** 1-turn wind-up. Resolve: brand the player (`bodyMarkMul: 1.5`, 1 charge). The next **applied** damaging hit **against that unit** (after RES/SR/crit, before HP write) deals `floor(applied * 1.5)`, then consumes. Self-hits / lava / fuse / wick-convert do **not** consume. Distinct from tile Mark (`isMark` on a cell, next *spell* there ×2), Hex (leave-or-boom), Glyph (trap), Expose (RES debuff). The learnable is **1 charge, ×1.5, unit**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Brand every 3 turns. Kit: Mark (tile, still in kit as a *different* verb) / Cursed Wound / Slow. One destructible **Stylus**; breaking it **clears the charge**. |
| 2 | ≤ 45% | `CHOIR_BRAND`: brand the player **and** hatch a **decoy clerk** (1 extra pawn body, 25% of his effective HP). The next damaging action that includes **either** marked body consumes **that** body’s charge only. Enrage + Archer. If the Stylus is already down, Phase 2 is kit + decoy — no free Stylus rebuild. Stylus, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Brand resolves same turn as telegraph. Stylus, if alive, breaks itself. P2 still brands the decoy. Overlay +8%. |

**SPELLS (proposed kit):** `spell-mark`, `spell-cursed-wound`, `spell-slow`, `spell-enrage` (P2), `summon-archer` (P2). Unique vs Archivist (cursed / mark / barrier / archer / veil), Hexed (mark / slow / barrier / expose / archer), Gaze (frost / mark / iron / weaken / veil), Wedge (blast / iron-skin / mark / inferno / enrage), Wick (mark / poison / barrier / inferno / bomber).  
**DISCOVERABLE_SPELLS:** #563 `spell-body-mark` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["brand_curate"]`). Observation = he **applies** the unit brand (`kind: "cast"`). Consume is not a second observe. Tile `spell-mark` in his kit is **not** this observe. `CHOIR_BRAND` (decoy brand / Stylus director) is `BOSS_ONLY`. Do **not** grant tile Mark, Hex, Glyph Snare, or Goad from this fight.

**AI:** Brand when leftover player AP ≥ 2 (a hit is coming) **or** they are adjacent. Skip if Stylus was broken this cycle. Skip if already charged. Cursed Wound after they spend the amped Strike. Decoy does **not** share HP (Midnight owns shared pools).  
**ARENA_RULES:** Stylus HP = `0.15 * playerMaxHp`. Consume **before** HP write. Do not edit `combatMath.ts` beyond passing the already-computed applied value into a multiply helper. Challenge: the amped hit **is** `recordChallengeDamageTaken` at the *amped* amount. Lava / spikes / fuse do not consume. DoT **apply** consumes; later ticks do not. Decoy is a body, cap 4, 0 XP. Killing the decoy is not victory.  
**SUMMONS:** 1 decoy in P2 + 1 archer. Cap 4.  
**PLAYER_COUNTERPLAY:** Break the Stylus; wait the charge out; burn it with a cheap DoT apply; AoE that includes him **does** consume; do not dump Sacrifice into a marked decoy.  
**MASTERY_OBJECTIVE:** Never take an amped hit while marked (`brand_unamped`). An unused charge he overwrites is the pass. Being marked and breaking the Stylus (clear) is the pass. A 0-applied consume does **not** exist (mul still consumes) — any consume on **you** fails it. Decoy-consume is the pass.  
**REWARDS:** 6 / 4 when shipped. Body Mark is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Mul **fixed 1.5**. P1 1 charge on the player. P2 player + decoy. Decoy HP = 25% of **his** effective max.  
**BALANCE_RISKS:** Brand + Hexed / Archivist is two mark directors — illegal. Brand + Goad / Veil is two targeting directors — illegal. Brand + Rebound is amp-then-return — illegal. Table J pairs with Oath: Oath telegraph **never** occupies the Stylus. The Strike Oath *allows* **is** the amped hit (one exam). Player Body Mark cannot brand two bodies.  
**QA:** Observation counts his unit-brand cast, not tile Mark and not consume. Stylus / decoy / Archer 0 XP. Consume before HP write. Amped amount is the challenge debit. Lava/fuse do not consume. DoT apply consumes; ticks do not. Decoy death ≠ victory.  
**STATUS:** PROPOSED

---

## 8.11 Encounter sheets — Wave 13 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 12: **reset all remaining CDs on one ally, once/battle** (Cadence Crack = hostile, *highest one* → 0; Cadence Break = *self last-id*; Cadence Lend = ally −1; Timestep = self AP/MP refill; Cadence Flush sets **every** remaining cooldown on a living **ally** to 0 — once/battle on the caster), **isolated-target damage bonus** (Split Fang / Crowd Tax *pay the pack*; Wall Sting is barrier-adj; Boot Sting is *caster walked*; Far Sting is *distance*; Lone Sting deals 10 and adds 8 iff the **target** has zero living same-side neighbors at Chebyshev ≤ 1 — adjacent *hostiles* do not break isolation), **delayed absorb that starts next own turn** (Ward Plate absorbs *now*; Surplus Ward is leftover-AP evade; Thin Ward is incoming *cap*; Morrow Step is a *blink*; Morrow Plate *arms now* and grants absorb 10 at the **start of the caster’s next turn**, then expires at that turn’s end or when 10 is consumed), **dump leftover AP onto an ally** (Tempo Gift grants without dumping yours; Purse Cut *freezes theirs*; Surplus *evades* leftover; Leftover Lend pays 1 AP, then gives `min(remaining, 4)` and zeros the caster — does **not** splice the turn queue).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-13 learnables reuse **leftover #563 ids only**. No new #137 spell ids. No #636 / #695 / #726 extra doors.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, and Table J. Pairing is **Table K** only (§10.10).

**#563 stub note:** `SPELL_PROPOSALS_2026-09-25.md` already names `flush_precentor` (Cadence Flush MULTI). That stub is **not** remapped to `flush_psalmist`. Lone Sting / Morrow Plate / Leftover Lend have **no** stub. Do **not** remap `gait_cantor` / `pair_usher` / `dummy_castellan` / `court_hinge_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `flush_psalmist`

**NAME:** The Flush Psalmist  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the emptied verse. He does not refill his own bar. He dumps the choir’s remaining waits so they may sing again.  
**CORE_MECHANIC:** **Ally, all remaining CDs → 0, once per his battle.** Every 3 turns he telegraphs a living **same-side extra** (prefer Sentinel; else Wisp). Resolve: set **every** remaining entry in that unit’s cooldown map to 0. If the extra has no id with remaining CD > 0, the flush **fizzles** (AP spent). He cannot flush himself (illegal target — that is Cadence Break / Timestep). Distinct from Cadence Crack (hostile, highest-one), Cadence Lend (ally −1). The learnable is **one ally, all remaining CDs, once/battle**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **psalm clerk** extra (Inferno only, starts on CD 3) so a flush target exists. Flush every 3 turns if a legal extra lives. Kit: Haste / Rally / Weaken. One destructible **Psalter**; breaking it **skips the next flush**. |
| 2 | ≤ 45% | `CHOIR_FLUSH`: flush **every** living extra (cap 2 bodies), then each flushed extra may immediately recast **one** kit id that just became legal (no turn-queue splice — same-turn recast, still pays that extra’s AP). Mirror + Sentinel. Psalter, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Flush resolves same turn as telegraph. Psalter, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `spell-haste`, `spell-rallying-cry`, `spell-weaken`, `spell-mirror` (P2), `summon-sentinel` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Conductor (rally / wisp / weaken / bomber / drain), Surplus (drain / mark / haste / mirror / barrier), Bait (mirror / mark / shield / weaken / sentinel), Infirm (heal / haste / physical / iron / wisp).  
**DISCOVERABLE_SPELLS:** #563 `spell-cadence-flush` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["flush_psalmist"]`). Observation = he **casts** the flush (`kind: "cast"`), including a no-CD fizzle after AP. `CHOIR_FLUSH` (mass flush + same-turn recast / Psalter director) is `BOSS_ONLY`. Do **not** grant Cadence Crack, Cadence Break, Timestep, or Cadence Lend from this fight. #563 stub `flush_precentor` is **not** this id.

**AI:** Prefer the extra with the largest remaining CD sum ≥ 2. Skip if Psalter was broken this cycle. Skip if no extra lives. Never flush the player (wrong side). Sentinel recast only under cap.  
**ARENA_RULES:** Psalter HP = `0.15 * playerMaxHp`. Once/battle is a **caster** flag (`oncePerBattleIds`), not a displayed 99-turn bar lock. Do not write `spellLevelKeys`. Do not call `upgradeSpell`. The flushed extra’s recasts in P2 count toward that extra’s AP, not his.  
**SUMMONS:** 1 psalm clerk from pull (Inferno-only, 0 XP, not a victory target) + 1 sentinel in P2. Cap 4. Clerk death ≠ victory.  
**PLAYER_COUNTERPLAY:** Kill the extra before the glow; Quiet Hex / Mute the flushed extra; break the Psalter; isolate so the 4 AP was wasted; do not let Inferno come off CD twice.  
**MASTERY_OBJECTIVE:** He never successfully zeroes a remaining CD (`flush_unspent`). A no-CD fizzle / Psalter skip is the pass. P2 mass flush that finds 0 remaining CDs is the pass.  
**REWARDS:** 6 / 4 when shipped. Cadence Flush is the prize (first grant wins if `flush_precentor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Flush is **all remaining CDs**, not a damage number. Body count **fixed**.  
**BALANCE_RISKS:** Flush + Surplus / Lend / Grandmaster / Conductor is two cadence / leftover-AP directors — illegal. Flush + Timestep-kit identity (Grandmaster) is two once/battle dumps. Table K pairs with Gaze: Crosier / facing-pin cell **never** occupies the Psalter. Player Cadence Flush cannot target hostiles or the caster.  
**QA:** Observation counts his flush cast, not player Cadence Flush and not the extra’s recast. Psalter / extras 0 XP. Cannot self-flush. Missing cooldown map **fail closed** (fizzle). P2 recast does not splice RAF / turn queue.  
**STATUS:** PROPOSED

---

### BOSS_ID: `lone_lector`

**NAME:** The Lone Lector  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop of the solitary reading. The verse is louder when no one stands beside you.  
**CORE_MECHANIC:** **Isolated-target damage bonus.** 1-turn wind-up paints the player. Resolve: deal 10, then if the player has **zero** living same-side combatants at Chebyshev ≤ 1 (the player cell itself is not a neighbor), add 8 **before** existing SP/RES/SR/crit/Mark — pass the already-summed base into `dealDamage`. Adjacent **hostiles** (him, his posts, his extras) do **not** break isolation. The caster standing Chebyshev-1 does not count as a same-side neighbor. Distinct from Boot Sting (he walked), Wall Sting (barrier-adj), Far Sting (distance). The learnable is **10, +8 if isolated, range 3**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Sting every 3 turns. Kit: Blast / Expose / Veil. One destructible **Ambo**; breaking it **skips the next bonus** (the 10 still resolves if he casts). |
| 2 | ≤ 45% | `CHOIR_LONE`: if you are isolated at resolve, the bonus **always** applies and he also Exposes you (kit Expose, 1 turn). Inferno + Archer. Ambo, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Isolation check becomes Chebyshev ≤ **2** (harder to hug a pet). Ambo, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-blast`, `spell-expose`, `spell-shadow-veil`, `spell-inferno` (P2), `summon-archer` (P2). Unique vs Wedge (blast / iron / mark / inferno / enrage), Queen (blast / mark / nova / veil), Orbit (blast / slow / mirror / expose / nova), Hinge (blast / barrier / haste / weaken / archer), Bias (blast / mark / slow / iron / archer), Static (blast / haste / nova / expose).  
**DISCOVERABLE_SPELLS:** #563 `spell-lone-sting` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["lone_lector"]`). Observation = he **casts** the sting (`kind: "cast"`), whether or not the +8 applied. `CHOIR_LONE` (always-bonus-if-alone / radius-2 enrage / Ambo director) is `BOSS_ONLY`. Do **not** grant Boot Sting, Wall Sting, Far Sting, or Body Mark from this fight.

**AI:** Sting when the player has no living same-side neighbor **or** leftover player AP ≤ 1 (they cannot spawn a huddle). Skip if Ambo was broken this cycle **and** the bonus is the only reason to cast (still may Blast). Never paint spawn / portal.  
**ARENA_RULES:** Ambo HP = `0.15 * playerMaxHp`. Isolation is boolean, same-side only. Player-side summons count; enemy-side posts / extras do **not**. Do not edit `combatMath.ts` beyond passing the already-summed 10+8 into `dealDamage`. Challenge: the full applied hit **is** `recordChallengeDamageTaken`.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP. Archer does not break *your* isolation.  
**PLAYER_COUNTERPLAY:** Stand Chebyshev-1 from a living allied summon; hatch a Dummy / Whelp / Wolf before the glow; break the Ambo to drop the +8; Sidestep; do not dismiss the pet to “free AP.”  
**MASTERY_OBJECTIVE:** Never take the isolated +8 (`lone_clustered`). A clustered 10 is the pass. An Ambo skip that drops the bonus is the pass. Enrage radius-2 still fails it if you were alone in that ring.  
**REWARDS:** 5 / 3 when shipped. Lone Sting is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. 10+8 are **flat** L1 reference (SP-scaled like other kit hits — **not** % HP). Isolation is boolean until enrage widens the ring.  
**BALANCE_RISKS:** Lone + Brand / Hexed / Archivist is two mark / unit-amp directors — illegal. Lone + Veil / Goad is two targeting directors — illegal. Table K pairs with Aisle: Triple-span posts **never** occupy the Ambo. Posts are enemy-side — they do **not** break your isolation. Player Lone Sting cannot bonus a clustered target.  
**QA:** Observation counts his sting cast, not the +8 and not player Lone Sting. Ambo / Archer 0 XP. Same-side only. Adjacent hostiles do not break isolation. Amped amount is the challenge debit.  
**STATUS:** PROPOSED

---

### BOSS_ID: `plate_bursar`

**NAME:** The Plate Bursar  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the locked cupboard. He pays for armor he will not wear until the next verse.  
**CORE_MECHANIC:** **Delayed absorb, starts next own turn.** Every 3 turns he **arms** now. At the **start** of his next turn he gains absorb 10 that consumes against incoming **applied** hits (same absorb family as Ward Plate — do not invent a second HP bar). Lasts until 10 is consumed or that turn ends, whichever first. Distinct from Ward Plate (absorb *now*), Surplus Ward, Morrow Step (blink). The decision is **hit him on the arming turn**. The learnable is **self, delay 1, absorb 10**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Arm every 3 turns. Kit: Shield / Iron Skin / Slow. One destructible **Aumbry**; breaking it **cancels a live arm** (does not strip an already-up plate). |
| 2 | ≤ 45% | `NAVE_PLATE`: arm himself **and** one living extra (Sentinel). Heal + Sentinel. Aumbry, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Plate arms **same turn** as telegraph (overlay rule — the “wait a turn” answer collapses). Aumbry, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-shield`, `spell-iron-skin`, `spell-slow`, `starter-heal` (P2), `summon-sentinel` (P2). Unique vs Span (shield / expose / slow / iron / bomber), Toll (mark / haste / shield / slow / sentinel), Aisle (shield / mark / barrier / iron / nova), Font (heal / barrier / wisp / iron / shield), Fortress (physical / iron / shield / barrier / nova), Brick (barrier / shield / frost / enrage / sentinel).  
**DISCOVERABLE_SPELLS:** #563 `spell-morrow-plate` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["plate_bursar"]`). Observation = he **arms** (`kind: "cast"`). The absorb apply at turn start is not a second observe. `NAVE_PLATE` (extra plate / same-turn enrage / Aumbry director) is `BOSS_ONLY`. Do **not** grant Ward Plate, Surplus Ward, Morrow Step, or Return Sting from this fight.

**AI:** Arm when not adjacent **or** leftover player AP ≤ 2 (they cannot dump the unplated turn). Skip if Aumbry was broken this cycle. Skip if already armed or already plated. Sentinel recast only under cap.  
**ARENA_RULES:** Aumbry HP = `0.15 * playerMaxHp`. Delay is **his** next turn start, not a global round count. If he dies before the delay, the arm expires. Absorb is not a heal (`no_healing` stays true; player-side absorb on *you* is N/A here). Do not read `CharacterStats.evasion`. Lava / spikes / fuse do **not** consume the plate (same family as Brand: spell/weapon hits only).  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Hit him on the arming turn; break the Aumbry to cancel a live arm; wait the plated turn out; DoT ticks do not eat the plate; do not dump Sacrifice into a fresh plate.  
**MASTERY_OBJECTIVE:** He never absorbs > 0 from one of your hits (`plate_unarmored`). Killing him on an unplated / arming turn is the pass. Breaking the Aumbry so the arm never applies is the pass. Swinging into a live plate fails it.  
**REWARDS:** 6 / 4 when shipped. Morrow Plate is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Absorb **flat 10**. Delay **1** until enrage.  
**BALANCE_RISKS:** Plate + Morrow Herald is two “morrow” delays — illegal. Plate + Rebound / Cover is two incoming-hit directors — illegal. Plate + Wick / Crypt / Salve is two delay clocks — illegal. Table K pairs with Ram: Brace dest **never** occupies the Aumbry. This turn’s ram is **not** absorbed (delay 1). Player Morrow Plate cannot arm an ally.  
**QA:** Observation counts his arm, not the absorb apply and not player Morrow Plate. Aumbry / Sentinel 0 XP. Death before delay expires the arm. Absorb ≠ heal. Lava/fuse do not consume. Enrage same-turn arm still observes.  
**STATUS:** PROPOSED

---

### BOSS_ID: `lend_proctor`

**NAME:** The Lend Proctor  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A queen of the emptied purse. He keeps nothing. The choir spends what he could have spent.  
**CORE_MECHANIC:** **Dump leftover AP onto an ally.** Every 3 turns he pays 1 AP, then lets `n = min(remaining AP, 4)`, adds `n` to one living extra’s **current** AP this turn (cap at that extra’s max AP), and sets his current AP to 0. He may still walk if he has MP — do **not** splice the turn queue. If no extra lives or `n = 0`, the lend still spends the 1 AP and observes (fizzle-like). Distinct from Tempo Gift (grant without dumping), Purse Cut (freeze *theirs*), Surplus (evade leftover). The learnable is **1 AP, cap 4, zero caster**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **purse clerk** extra (Drain only) so a lend bank exists. Lend every 3 turns. Kit: Haste / Drain / Rally. One destructible **Coffer**; breaking it **skips the next lend**. |
| 2 | ≤ 45% | `CHOIR_LEND`: dump leftover AP onto **every** living extra (still one leftover pool — split `n` left-to-right by lowest id, each capped at 4 / their max). Wisp + Sacrifice. Coffer, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Also drains **1 AP** from the player (resource pressure; `recordChallengeApSpend` if they are in a challenge). Coffer, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `spell-haste`, `starter-drain`, `spell-rallying-cry`, `summon-wisp` (P2), `spell-sacrifice` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Conductor (rally / wisp / weaken / bomber / drain), Surplus (drain / mark / haste / mirror / barrier), Morrow (swap / haste / drain / mirror / wolf), Infirm (heal / haste / physical / iron / wisp).  
**DISCOVERABLE_SPELLS:** #563 `spell-leftover-lend` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["lend_proctor"]`). Observation = he **casts** the lend (`kind: "cast"`), including `n = 0`. `CHOIR_LEND` (split to every extra / enrage player-AP drain / Coffer director) is `BOSS_ONLY`. Do **not** grant Surplus Ward, Purse Cut, Tempo Gift, or Cadence Flush from this fight.

**AI:** Lend when an extra can spend ≥ 2 AP (off-CD Inferno / Drain / Rally). Skip if Coffer was broken this cycle. Skip if leftover after the 1-cost is 0 **and** no extra is below max AP. Never lend to the player.  
**ARENA_RULES:** Coffer HP = `0.15 * playerMaxHp`. Do not end his turn. Do not grant AP above the target’s max. Player `ally` includes player-side summons on the *player* card; his lend targets **his** extras only. Enrage −1 AP on the player is not a heal and is not leftover-lend.  
**SUMMONS:** 1 purse clerk from pull (Drain-only, 0 XP, not a victory target) + 1 wisp in P2. Cap 4. Clerk death ≠ victory. The clerk / wisp is the intended bank.  
**PLAYER_COUNTERPLAY:** Kill the extra before the glow; break the Coffer; Mute the funded extra; isolate so they cannot spend; do not let him Haste then dump.  
**MASTERY_OBJECTIVE:** He never successfully lends `n > 0` (`lend_unfunded`). A Coffer skip / no-extra / `n = 0` is the pass. P2 split that still moves ≥ 1 AP fails it. Enrage −1 on you does **not** fail it (that is his director).  
**REWARDS:** 5 / 3 when shipped. Leftover Lend is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Cap **4**. Body count **fixed**.  
**BALANCE_RISKS:** Lend + Flush / Surplus / Font is two leftover-AP / support dumps — illegal. Lend + Conductor is dump + silence (two bar directors). Table K pairs with Brick: Mortar dest **never** occupies the Coffer. Brick is not leftover-AP. Player Leftover Lend cannot target hostiles.  
**QA:** Observation counts his lend cast, including `n = 0`. Coffer / Wisp 0 XP. No turn-queue splice. Enrage −1 AP hits `recordChallengeApSpend` in a challenge. Cap at target max AP.  
**STATUS:** PROPOSED


## 8.12 Encounter sheets — Wave 14 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 13: **1-HP empty-kit taunt post** (Goad / Taunt Oath = *unit-targeted, no body*; Bait Pylon intercepts the next *hostile spell* aimed at the owner; Bastion / Span Pylon occupy without a cast-target filter; Dummy Post is a 1-HP pawn, 0 AP / 0 MP, empty kit, lifespan 3 — while it lives, a hostile at Chebyshev ≤ 1 who casts a damaging id must choose the post as primary **if** the post is inside that spell’s current range/LoS), **first-enter heal pad** (Font = *stationary pulse*; Mend Wick heals the occupant *at tick*; Gait Mend heals iff the *caster walked*; Gift Sill is enter *+MP*; Enter Mend paints a walkable cell for 2 turns — the first living combatant who **walks or is forced** onto it heals 6, then the paint expires; an occupant already standing when painted does **not** trigger), **heal 12 split 50/50 with an adjacent ally** (Rally / Blood Mend are *self*; Flank Share splits *damage*; Choir Hymn is W1; Split Mend heals the target 6 and the nearest living **other** ally at Chebyshev ≤ 1 for 6 — if no adjacent ally, the target receives the full 12; primary is never the caster), **tile forbids Strike / `isPhysical`** (Oath Blade *requires* Strike and fizzles other ids; Strike Hold is *unit-scoped until they walk*; Verse First blocks Strike until a *spell*; Quiet Hex is W1 unit; Quiet Sill paints a cell for 2 turns — the occupant cannot resolve `isPhysical === true` or id `physical_attack`; other spells stay legal; walk on/off is legal).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-14 learnables reuse leftover **#563** Dummy Post / Enter Mend / Split Mend **and** one unused **#636** Quiet Sill. No new #137 spell ids. No remaining #636 / #695 / #726 / #787 extra doors. Court Hinge stays closed.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, and Table K. Pairing is **Table L** only (§10.11).

**Stub note:** `SPELL_PROPOSALS_2026-09-25.md` already names `dummy_castellan` (Dummy Post MULTI). That stub is **not** remapped to `effigy_clerk`. Enter Mend / Split Mend / Quiet Sill have **no** stub. Do **not** remap `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `effigy_clerk`

**NAME:** The Effigy Clerk  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A pawn of the straw ledger. He does not swing for the choir. He files a body that the verse must address.  
**CORE_MECHANIC:** **1-HP empty-kit taunt post.** Every 3 turns he plants one Dummy Post on a free cell at range ≤ 2 (prefer Chebyshev-1 from the player). The post is a pawn, 1 HP, 0 AP / 0 MP, empty kit, lifespan 3, `summonAI: "dummypost"`. While it lives, any hostile at Chebyshev ≤ 1 who casts a damaging id (`damage > 0` or `isDotSpell`) must choose the post as primary **if** the post is inside that spell’s current range/LoS; otherwise they may cast as normal. Non-damaging ids (Slow / Swap / Mark) ignore the filter. Attack Nearest origin stays the **player** tile. Distinct from Goad (no body), Bait Pylon (next *spell* intercept), Cover (redirect a hit already aimed). The learnable is **one post, 1 HP, radius 1, lifespan 3**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Plant every 3 turns if no Dummy Post lives. Kit: Physical / Barrier / Weaken. One destructible **Mannequin**; breaking it **skips the next plant**. |
| 2 | ≤ 45% | `CHOIR_EFFIGY`: may keep **two** posts (still one plant per cadence; skip only if two already live). Filter radius becomes Chebyshev ≤ **2**. Iron Skin + Sentinel. Mannequin, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Plant resolves same turn as telegraph. Mannequin, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `physical_attack`, `spell-barrier`, `spell-weaken`, `spell-iron-skin` (P2), `summon-sentinel` (P2). Unique vs Fortress (physical / iron / shield / barrier / nova), Weeping (physical / slow / weaken / iron / rally), Bone (physical / haste / enrage / expose), Flush (haste / rally / weaken / mirror / sentinel).  
**DISCOVERABLE_SPELLS:** #563 `spell-dummy-post` (`PLAYER_LEARNABLE` / extra `ELITE` / `ENEMY_DISCOVERY` door: add `bossIds: ["effigy_clerk"]`). Observation = he **plants** (`kind: "cast"`), including a skip if a post already lives in P1. `CHOIR_EFFIGY` (two posts / radius-2 / Mannequin director) is `BOSS_ONLY`. Do **not** grant Goad, Bait Pylon, Cover Step, or Bastion Pylon from this fight. #563 stub `dummy_castellan` is **not** this id.

**AI:** Plant when the player is Chebyshev ≤ 2 and no legal post lives (P1) or fewer than two live (P2). Skip if Mannequin was broken this cycle. Skip if the only free cell is spawn / portal. Sentinel recast only under cap. Never treat the post as a victory target.  
**ARENA_RULES:** Mannequin HP = `0.15 * playerMaxHp`. The post **occupies**. 0 AP means it never walks. Taunt is a **cast target filter**, not `tauntNextHit`. Pacifist: the post dealing 0 damage does not fail the feat; a later enemy hitting the post is not a player-side summon kill. Challenge: a player hit that pops the 1 HP **is** a spell/weapon hit, not `recordChallengeDamageTaken` on the player.  
**SUMMONS:** 1 Dummy Post (P1) / up to 2 (P2) + 1 sentinel in P2. Cap 4. Post / Sentinel 0 XP. Post death ≠ victory.  
**PLAYER_COUNTERPLAY:** Pop the 1 HP; step Chebyshev ≥ 2 (P1) / ≥ 3 (P2); cast a non-damaging id; out-range the post; break the Mannequin; do not dump Sacrifice into straw.  
**MASTERY_OBJECTIVE:** He never successfully plants a living post (`effigy_unposted`). A Mannequin skip / no-free-cell fizzle is the pass. A plant that dies the same turn still fails it (the body existed).  
**REWARDS:** 6 / 4 when shipped. Dummy Post is the prize (first grant wins if `dummy_castellan` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Post HP **1** (fixed). Body count **fixed**. Filter radius is the only P2 / enrage widen.  
**BALANCE_RISKS:** Dummy + Goad / Bait / Cover / Counter / Grandmaster is two taunt / intercept / decoy directors — illegal. Dummy + Quiet Sill is the intended “force melee onto a spell-only tile” exam — **held** (two Wave-14 cores). Table L pairs with Lock: Compass / dummy dest **never** occupies the Mannequin. Off-axis walks are already illegal under Rank Lock — do not also plant off-axis. Player Dummy Post cannot taunt friendly casts.  
**QA:** Observation counts his plant cast, not the filter and not player Dummy Post. Mannequin / post / Sentinel 0 XP. Missing `summonAI` **fail closed** (no plant). Attack Nearest origin stays the player tile. Two posts in P2 still share cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `enter_deacon`

**NAME:** The Enter Deacon  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A rook of the open door. The blessing is public. Whoever steps first drinks.  
**CORE_MECHANIC:** **First-enter heal pad.** Every 3 turns he paints one free walkable cell at range ≤ 3 (prefer a cell the player can reach this turn **and** a cell an extra can reach). The first living combatant who **walks or is forced** onto the cell heals 6 through existing `heal`, then the paint expires. Duration 2 turns or first enter. Occupant already standing when painted does **not** trigger. Swap onto the cell must tick (MIMA-001 — until that lands, treat Swap-enter as **legal position**, heal **blocked**). Distinct from Font (pulse now), Mend Wick (tick heal), Gait Mend (caster walked). The learnable is **one cell, heal 6, first enter**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Paint every 3 turns. Kit: Heal / Mark / Barrier. One destructible **Narthex**; breaking it **skips the next paint** (does not wipe a live pad). |
| 2 | ≤ 45% | `NAVE_THRESHOLD`: paints a **3-pad** cardinal lattice (origin + 2 adjacent; last-writer per cell). Frost Nova + Wisp. Narthex, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Paint resolves same turn as telegraph. Narthex, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-mark`, `spell-barrier`, `spell-frost-nova` (P2), `summon-wisp` (P2). Unique vs Font (heal / barrier / wisp / iron / shield), Infirm (heal / haste / physical / iron / wisp), Plate (shield / iron / slow / heal / sentinel), Salve (delayed *tick* heal — different verb).  
**DISCOVERABLE_SPELLS:** #563 `spell-enter-mend` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["enter_deacon"]`). Observation = he **paints** (`kind: "cast"`). The heal apply is not a second observe. `NAVE_THRESHOLD` (3-pad lattice / Narthex director) is `BOSS_ONLY`. Do **not** grant Font, Mend Wick, Gait Mend, Gift Sill, or Exit Boon from this fight.

**AI:** Paint a cell the player can enter this turn **unless** the player is already closer to a live pad than his extra — then paint on the extra’s path. Skip if Narthex was broken this cycle. Skip if no free walkable cell in range. Wisp recast only under cap.  
**ARENA_RULES:** Narthex HP = `0.15 * playerMaxHp`. Pad table is **not** `hazardTiles`. Last writer on a cell wins (Barrier replaces pad). `no_healing`: a player-side HP up on enter **fails** the challenge. Forced-move counts as enter. Challenge heal is not `recordChallengeDamageTaken`.  
**SUMMONS:** 1 wisp in P2, cap 4. 0 XP. The wisp is the intended thief if you refuse the pad.  
**PLAYER_COUNTERPLAY:** Step on the pad first (steal the 6); break the Narthex; Barrier the cell; Cursed Wound him before he drinks; do not let the wisp beat you to the door.  
**MASTERY_OBJECTIVE:** He (and his extras) never receive the 6 (`narthex_stolen`). A stolen pad / Narthex skip / expired paint is the pass. A boss-side enter that heals 6 fails it.  
**REWARDS:** 5 / 3 when shipped. Enter Mend is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Heal **flat 6** (healRecv). Pad count **1** until P2 lattice **3**.  
**BALANCE_RISKS:** Enter + Font / Salve / Infirm / Mend Wick is two heal-pad / heal directors — illegal. Enter + Crypt / Fosse is two occupancy-tile directors — illegal. Table L pairs with Stride: Ledger **never** occupies the Narthex. Walk-MP tithe applies to a *steal walk*; forced-move enter is still free of walk MP (Stride does not tax it). Player Enter Mend cannot paint under a body (his card is `freeCells: true`).  
**QA:** Observation counts his paint, not the heal and not player Enter Mend. Narthex / Wisp 0 XP. Standing occupant does not trigger. Forced-move does. Swap-enter heal waits on MIMA-001. Barrier last-writer. `no_healing` fails on player-side HP up.  
**STATUS:** PROPOSED

---

### BOSS_ID: `split_acolyte`

**NAME:** The Split Acolyte  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop of the shared cup. Twelve drops. Two mouths — or one, if you leave him alone.  
**CORE_MECHANIC:** **Heal 12 split 50/50 with an adjacent ally.** Every 3 turns he targets one living same-side extra at range ≤ 3 (never himself). Heal the target 6 and the nearest living **other** ally at Chebyshev ≤ 1 for 6 (4-adj, then diagonal, then lowest id — same order as Pair Hinge). If no adjacent ally, the target receives the full 12. Distinct from Rally (self), Font (totem pulse), Flank Share (damage). The learnable is **one ally, 12, split if a neighbor lives**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **cup clerk** extra (Heal only) so a split partner exists. Mend every 3 turns. Kit: Heal / Slow / Expose. One destructible **Pyx**; breaking it **skips the next mend**. |
| 2 | ≤ 45% | `CHOIR_SPLIT`: mend **every** living extra (each extra is a primary once, left-to-right by lowest id; a body may receive 6 as neighbor and 6 as primary in the same cadence). Rally + Wisp. Pyx, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Isolated primaries still get 12 **and** he also Rallies himself (kit Rally, 1 turn). Pyx, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-slow`, `spell-expose`, `spell-rallying-cry` (P2), `summon-wisp` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Font (heal / barrier / wisp / iron / shield), Flush (haste / rally / weaken / mirror / sentinel), Enter (heal / mark / barrier / nova / wisp).  
**DISCOVERABLE_SPELLS:** #563 `spell-split-mend` (`PLAYER_LEARNABLE` / extra `ELITE` / `ENEMY_DISCOVERY` door: add `bossIds: ["split_acolyte"]`). Observation = he **casts** the mend (`kind: "cast"`), including isolated full-12. `CHOIR_SPLIT` (every extra / self-Rally enrage / Pyx director) is `BOSS_ONLY`. Do **not** grant Rally, Font, Flank Share, Gait Mend, or Enter Mend from this fight.

**AI:** Prefer two wounded extras that are already adjacent. If only one extra lives, still mend (full 12) unless Pyx was broken this cycle. Skip if no extra lives. Never primary the player. AI skips a Dummy Post as the *only* adjacent ally (empty-kit pawn eating 6 is a mistake).  
**ARENA_RULES:** Pyx HP = `0.15 * playerMaxHp`. `healAmount: 12` fires healer-inference — CORE only on healer profiles. `no_healing`: any player-side HP up fails the challenge (his mend is boss-side). Player card forbids self as primary (`playerSpellAllowsCasterTile` stays false for `ally`).  
**SUMMONS:** 1 cup clerk from pull (Heal-only, 0 XP, not a victory target) + 1 wisp in P2. Cap 4. Clerk death ≠ victory. The clerk / wisp is the intended neighbor.  
**PLAYER_COUNTERPLAY:** Kill the extra before the glow; isolate so he wastes 12 on one full body; break the Pyx; Cursed Wound both mouths; Mute the primary.  
**MASTERY_OBJECTIVE:** He never successfully splits 6+6 (`pyx_isolated`). An isolated 12 / Pyx skip / no-extra fizzle is the pass. P2 cadence that shares ≥ 1 HP to a neighbor fails it.  
**REWARDS:** 5 / 3 when shipped. Split Mend is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. 12 is **flat** (healRecv per recipient). Body count **fixed**.  
**BALANCE_RISKS:** Split + Font / Cover / Infirm / Lend / Enter is two support-heal / ally dumps — illegal. Table L pairs with Cord: the familiar is the intended neighbor; Cord’s summon-gate **never** occupies the Pyx. Dummy Post extras are not preferred neighbors. Player Split Mend cannot primary the caster.  
**QA:** Observation counts his mend cast, including isolated 12. Pyx / clerk / Wisp 0 XP. Self primary illegal. Dummy Post neighbor skip. `no_healing` is about *player-side* HP, not his extras.  
**STATUS:** PROPOSED

---

### BOSS_ID: `quiet_chorister`

**NAME:** The Quiet Chorister  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the muted stall. The stone does not forbid the hymn. It forbids the fist.  
**CORE_MECHANIC:** **Tile forbids Strike / `isPhysical`.** Every 3 turns he paints one cell at range ≤ 3 (prefer the player’s cell, else the cell they can melee from). Duration 2 turns. `freeCells: false` (may paint under a body). While a combatant occupies it, they cannot resolve `isPhysical === true` **or** id `physical_attack`. Other spells stay legal. Walk on/off is legal. Attack Nearest that would resolve Strike from this cell **must** refuse. Distinct from Oath Blade (other ids fizzle, Strike *hurts*), Strike Hold (unit, until they walk), Quiet Hex (W1). The learnable is **one cell, 2 turns, spell-only tile**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Paint every 3 turns. Kit: Frost / Barrier / Slow. One destructible **Muffler**; breaking it **skips the next paint** (does not wipe a live sill). |
| 2 | ≤ 45% | `NAVE_QUIET`: paints a **3-cell file** toward the player (origin + 2 in the current file; last-writer per cell). Inferno + Mark. Muffler, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Paint resolves same turn as telegraph. Muffler, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-frost`, `spell-barrier`, `spell-slow`, `spell-inferno` (P2), `spell-mark` (P2). Unique vs Queen (blast / nova / mark / veil), Static (blast / haste / nova / expose), Enter (heal / mark / barrier / nova / wisp), Bone (physical / haste / enrage / expose — the pairing exam). He has **no** `physical_attack` in kit.  
**DISCOVERABLE_SPELLS:** #636 `spell-quiet-sill` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["quiet_chorister"]`). Observation = he **paints** (`kind: "cast"`). Occupancy is not a second observe. `NAVE_QUIET` (3-cell file / Muffler director) is `BOSS_ONLY`. Do **not** grant Oath Blade, Strike Hold, Quiet Hex, Verse First, or Ward Cell from this fight.

**AI:** Paint the player’s cell if they are adjacent (melee threat) **or** the cell they can step to for Strike this turn. Skip if Muffler was broken this cycle. Skip if the only in-range cell is spawn / portal. Never paint under himself unless the player is already on him (illegal occupy).  
**ARENA_RULES:** Muffler HP = `0.15 * playerMaxHp`. Filter by `isPhysical` / id `physical_attack`, **never** by name `"Strike"`. Sill table is **not** `hazardTiles`. Brick Shift does not move paint. Challenge: a refused Attack Nearest spends 0 AP (same gate as a range fail). A fizzled Strike from the sill **does** spend AP if they forced the id.  
**SUMMONS:** None required. Cap 4 still holds if a later pairing adds a body.  
**PLAYER_COUNTERPLAY:** Step off; cast Frost / Inferno / Mark from the cell; break the Muffler; Vault off (once/battle); do not Attack Nearest from the stall.  
**MASTERY_OBJECTIVE:** Never occupy a Quiet Sill when you resolve a damaging id (`muffler_offstep`). A paint you stepped off before resolving is the pass. A refused Attack Nearest from the sill is the pass. Resolving Inferno from the sill is the pass (not physical). Resolving Strike / a physical from the sill fails it.  
**REWARDS:** 6 / 4 when shipped. Quiet Sill is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Forbid is **boolean**. Pad count **1** until P2 file **3**.  
**BALANCE_RISKS:** Quiet + Oath is a brick (must Strike + cannot Strike) — illegal. Quiet + Dummy / Goad is the intended force-melee-onto-sill exam — **held** (Dummy is a Wave-14 core; Goad is a second taunt). Table L pairs with Bone: spike-on-land dest **never** occupies the Muffler; Quiet never paints the knight-landing telegraph. Player Quiet Sill cannot last longer than 2 turns.  
**QA:** Observation counts his paint, not occupancy and not player Quiet Sill. Muffler 0 XP. Attack Nearest from the sill refuses. Filter is `isPhysical` / `physical_attack` only. Brick Shift does not move paint.  
**STATUS:** PROPOSED

---

## 8.13 Encounter sheets — Wave 15 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 14: **heal if the target was force-moved** (Gait Mend = caster *walked*; Chase Mend = target *walked*; Enter Mend = first *enter* heal pad; Heave Mend = *both* caster and target force-moved; Split Mend is adjacency split, not a displace gate; Shove Mend heals 8 through existing `heal` iff the target has `forcedMovedThisTurn` — push / pull / swap / hinge / pair-slide / conveyor / this fight’s extra-shove; **walk MP does not arm it**; a 0-heal still spends AP and still observes), **first leave deals 8** (Exit Tithe = *AP* on voluntary walk leave; Exit Boon = *positive* on leave; Enter Mend = enter *heal*; Ingress Mark = walk *enter* damage; Shove Sting = *forced-move landing*; Cinder Tile = enter / stand burn; Exit Sting paints a walkable cell for 2 turns — the first living combatant who **leaves** it, walk or force-move, takes 8 through existing `dealDamage`, then the paint consumes; enter and standing do **not** tick), **double remaining CDs on one hostile** (Cadence Stall = *+1* all remaining; Cadence Flush = ally remaining → 0; Cadence Crack = hostile *highest one* → 0; Cadence Trim = −1; Cadence Imprint copies; Court Stretch is mass `NOT_PLAYER_LEARNABLE`; Cadence Stretch sets each remaining ≥ 1 to `remaining * 2`, cap 8, zeros stay 0 — it does **not** invent CDs), **next applied hit from Chebyshev ≥ 3 deals 0** (Sidestep = next hit *any* range; Near Hood = ≤ 1; Mid / Odd Hood = other bands; Return Sting = 0-to-you *and* half poke; Morrow Plate = delayed *absorb*; Far Hood arms a consume so the next **applied** damaging hit whose attacker is Chebyshev ≥ 3 deals 0 then consume — hits from 1–2 still land and **do not** consume; DoT ticks are Tick Plate’s hole).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-15 learnables reuse remaining **#636** Shove Mend / Exit Sting / Cadence Stretch / Far Hood. No new #137 spell ids. No remaining #636 / #695 / #726 / #787 / #849 extra doors. Court Hinge stays closed. Court Stretch stays closed.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, and Table L. Pairing is **Table M** only (§10.12).

**Stub note:** `SPELL_PROPOSALS_2026-09-26.md` already names `shove_cantor` (Shove Mend MULTI) and `stretch_precentor` (Cadence Stretch MULTI). Those stubs are **not** remapped to `jostle_subdeacon` / `dilate_organist`. Exit Sting / Far Hood have **no** stub. Do **not** remap `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `jostle_subdeacon`

**NAME:** The Jostle Subdeacon  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop of the displaced cup. He does not mend the still. He mends whoever the choir has already moved.  
**CORE_MECHANIC:** **Heal if the target was force-moved.** Every 3 turns he occupancy-shoves one living same-side extra 1 tile toward himself (dest must be `isCellFree` floor — not lava / spike / void / portal / spawn). The extra’s origin becomes free. Write `forcedMovedThisTurn` on that extra (**not** walk MP). Then he Shove Mends that extra (heal 8 through existing `heal` / `healRecv`). If the dest is blocked, the shove fizzles and the mend is 0 (AP still spent; observation still fires). Distinct from Gait Mend (caster walked), Chase Mend (target walked), Enter Mend (tile enter), Heave Mend (both bodies). He never shoves the **player** (MIMA-005 stays off this kit). The learnable is **one ally, 8, force-moved gate**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **jostle clerk** extra (empty kit, 1 HP is **not** Dummy Post — clerk has 0.20 * playerMaxHp, 0 XP) so a shove target exists. Shove+mend every 3 turns. Kit: Heal / Weaken / Haste. One destructible **Stole**; breaking it **skips the next shove+mend**. |
| 2 | ≤ 45% | `CHOIR_JOSTLE`: occupancy-shove **every** living extra 1 toward him (left-to-right by lowest id; skip any whose dest is blocked — no partial on that body), then mend each extra that actually moved. Iron Skin + Wisp. Stole, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Shove+mend resolves same turn as telegraph. Stole, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `starter-heal`, `spell-weaken`, `spell-haste`, `spell-iron-skin` (P2), `summon-wisp` (P2). Unique vs Enter (heal / mark / barrier / nova / wisp), Split (heal / slow / expose / rally / wisp), Infirm (heal / haste / physical / iron / wisp), Cover (heal / mirror / haste / wisp / rally).  
**DISCOVERABLE_SPELLS:** #636 `spell-shove-mend` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["jostle_subdeacon"]`). Observation = he **casts** the shove+mend (`kind: "cast"`), including a 0-heal dest-block. `CHOIR_JOSTLE` (every extra / Stole director) is `BOSS_ONLY`. Do **not** grant Gait Mend, Chase Mend, Enter Mend, Heave Mend, or Split Mend from this fight. #636 stub `shove_cantor` is **not** this id.

**AI:** Shove the extra whose dest toward him is free and who is missing ≥ 8 HP. Skip if Stole was broken this cycle. Skip if no extra lives. Never shove the player. Never mend the player. Dest onto hazard is **illegal** (pick another extra / skip).  
**ARENA_RULES:** Stole HP = `0.15 * playerMaxHp`. Extra shove is occupancy dest, **not** `applyPushback` on the player and **not** `isSwap`. `no_healing`: a successful extra heal does **not** fail the player challenge (boss-side HP). A 0-heal does not flip `challengeHealUsedRef`.  
**SUMMONS:** 1 jostle clerk from pull (0 XP, not a victory target) + 1 wisp in P2. Cap 4. Clerk death ≠ victory. The clerk / wisp is the intended displace target.  
**PLAYER_COUNTERPLAY:** Occupy the dest; kill the extra before the glow; break the Stole; Cursed Wound the extra; Self Anchor on the extra if a later writer stamps it.  
**MASTERY_OBJECTIVE:** He never successfully heals 8 (`stole_unmoved`). A dest-block 0-heal / Stole skip / no-extra fizzle is the pass. A P2 cadence that heals ≥ 1 extra for 8 fails it.  
**REWARDS:** 5 / 3 when shipped. Shove Mend is the prize (first grant wins if `shove_cantor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Heal **flat 8** (healRecv). Body count **fixed**. Shove distance **1**.  
**BALANCE_RISKS:** Jostle + Ram / Hook / Mill / Rime / Dowager is player-side force-move × hazard — illegal until MIMA-005. Jostle + Yoke / Orbit / Hinge / Grandmaster / Morrow is two relocate directors. Jostle + Split / Enter / Font / Infirm is two heal directors. Table M pairs with Counter: Abacus dest **never** occupies the Stole. Counter swaps *player-side* bodies — that does **not** arm his extra (his extra is boss-side). The pairing exam is: they swap **your** pack while he still has to shove **his** clerk onto a free cell. Player Shove Mend cannot target hostiles.  
**QA:** Observation counts his shove+mend cast, including 0-heal. Stole / clerk / Wisp 0 XP. Player is never the shove target. Dest-onto-hazard is skipped, not ticked. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `peel_friar`

**NAME:** The Peel Friar  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A rook of the sting on the way out. Standing is cheap. Leaving is the tithe he actually wants.  
**CORE_MECHANIC:** **First leave deals 8.** Every 3 turns he paints one cell at range ≤ 3 (prefer the player’s cell, else the cell they will peel to). Duration 2 turns. `freeCells: false` (may paint under a body). The first living combatant who **leaves** the cell (walk or force-move) takes 8 through existing `dealDamage` (RES+SR), then the paint consumes. Enter does **not** tick. Standing does **not** tick. Death on the cell is not a leave. Distinct from Exit Tithe (AP), Ingress Mark (enter), Shove Sting (forced-move *landing*), Hex (unit leave-or-detonate). The learnable is **one cell, 2 turns, first leave 8**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Paint every 3 turns. Kit: Physical / Barrier / Expose. One destructible **Stoup**; breaking it **skips the next paint** (does not wipe a live sting). |
| 2 | ≤ 45% | `NAVE_PEEL`: paints a **3-cell file** toward the player (origin + 2 in the current file; last-writer per cell). Frost Nova + Shadow Veil. Stoup, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Paint resolves same turn as telegraph. Stoup, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `physical_attack`, `spell-barrier`, `spell-expose`, `spell-frost-nova` (P2), `spell-shadow-veil` (P2). Unique vs Quiet (frost / barrier / slow / inferno / mark), Effigy (physical / barrier / weaken / iron / sentinel), Bone (physical / haste / enrage / expose), Fetid (venom / poison / cursed / lifesteal).  
**DISCOVERABLE_SPELLS:** #636 `spell-exit-sting` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["peel_friar"]`). Observation = he **paints** (`kind: "cast"`). The later 8 is not a second observe. `NAVE_PEEL` (3-cell file / Stoup director) is `BOSS_ONLY`. Do **not** grant Exit Tithe, Ingress Mark, Shove Sting, Quiet Sill, or Hex from this fight.

**AI:** Paint the player’s cell if they are on a file he can Strike from **or** the cell they must leave to kite. Skip if Stoup was broken this cycle. Skip if the only in-range cell is spawn / portal.  
**ARENA_RULES:** Stoup HP = `0.15 * playerMaxHp`. Sting table is **not** `hazardTiles`. Swap / Home Step / hinge **off** the cell **does** tick. Safe Fall does **not** skip it (paint, not lava/spike). Challenge: the 8 is a spell-hit (`recordChallengeDamageTaken`). Brick Shift does not move paint.  
**SUMMONS:** None required. Cap 4 still holds if a later pairing adds a body.  
**PLAYER_COUNTERPLAY:** Never enter; stand the sting and Strike from it; Barrier the cell; break the Stoup; Vault off (once/battle) and eat the 8 only if you must.  
**MASTERY_OBJECTIVE:** Never leave a live Exit Sting cell (`stoup_unleft`). A paint you never occupied is the pass. Standing through expiry is the pass. A walk leave, Swap leave, or forced-move leave that deals 8 fails it.  
**REWARDS:** 6 / 4 when shipped. Exit Sting is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. 8 follows existing damage growth. Pad count **1** until P2 file **3**.  
**BALANCE_RISKS:** Peel + Hex / Toll is two leave directors — illegal. Peel + Quiet / Enter is two tile-paints on the same exam. Peel + Shove Sting / Ingress Mark is two dest/enter stings. Table M pairs with Cinder: Exit sting **never** occupies a telegraphed lance tile. Standing the window is the intended peel-or-shoot exam. Player Exit Sting cannot last longer than 2 turns.  
**QA:** Observation counts his paint, not the 8 and not player Exit Sting. Stoup 0 XP. Enter does not tick. Death is not a leave. Challenge 8 hits `recordChallengeDamageTaken`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `dilate_organist`

**NAME:** The Dilate Organist  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A queen of the stretched recast. He does not silence the hymn. He makes the next verse late.  
**CORE_MECHANIC:** **Double remaining CDs on one hostile.** Every 3 turns he targets the player (range ≤ 3, LoS). For each id in the target’s cooldown map with remaining **≥ 1**, set remaining to `min(8, remaining * 2)`. Ids at 0 stay 0 (they are legal). Does **not** invent CDs. Does **not** touch once-per-battle flags (Timestep / Purse Keep / Cadence Flush). Distinct from Cadence Stall (+1), Flush (ally → 0), Crack (highest one → 0), Trim (−1), Court Stretch (mass, unowned). The learnable is **one hostile, ×2 remaining, cap 8**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Stretch every 3 turns if the player has at least one remaining ≥ 1. Kit: Slow / Mirror / Mark. One destructible **Antiphoner**; breaking it **skips the next stretch**. |
| 2 | ≤ 45% | `CHOIR_DILATE`: stretch **every** remaining ≥ 1 on the player in one cast (same cap 8). Enrage overlay does **not** also mute. Enrage + Bomber. Antiphoner, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Stretch resolves same turn as telegraph. Antiphoner, if alive, breaks itself. Overlay +8%. |

**SPELLS (proposed kit):** `spell-slow`, `spell-mirror`, `spell-mark`, `spell-enrage` (P2), `summon-bomber` (P2). Unique vs Flush (haste / rally / weaken / mirror / sentinel), Surplus (drain / mark / haste / mirror / barrier), Levy (tax, not stretch), Conductor (silence files).  
**DISCOVERABLE_SPELLS:** #636 `spell-cadence-stretch` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["dilate_organist"]`). Observation = he **casts** the stretch (`kind: "cast"`), including a skip if every remaining is 0. `CHOIR_DILATE` (full player bar / Antiphoner director) is `BOSS_ONLY`. Do **not** grant Cadence Flush, Stall, Trim, Crack, or Court Stretch from this fight. #636 stub `stretch_precentor` is **not** this id.

**AI:** Stretch when the player’s highest remaining is ≥ 2 (Stall owns the +1). Skip if Antiphoner was broken this cycle. Skip if every remaining is 0. Never stretch himself. Bomber recast only under cap.  
**ARENA_RULES:** Antiphoner HP = `0.15 * playerMaxHp`. Cap stretched remaining at **8**. Once-per-battle flags are not CDs. Missing cooldown map **fail closed** (no stretch).  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. The bomber is tempo pressure, not a stretch target.  
**PLAYER_COUNTERPLAY:** Sit on CD-0 ids (Strike / starters); Cadence Break / Flush if you own them; break the Antiphoner; do not show Inferno’s 2 into a stretch glow.  
**MASTERY_OBJECTIVE:** He never successfully doubles a remaining ≥ 1 (`antiphon_unstretched`). An all-zero skip / Antiphoner skip is the pass. A P2 full-bar stretch that rewrites ≥ 1 id fails it.  
**REWARDS:** 6 / 4 when shipped. Cadence Stretch is the prize (first grant wins if `stretch_precentor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Rewrite is **boolean ×2**, cap 8. Body count **fixed**.  
**BALANCE_RISKS:** Dilate + Flush / Conductor / Surplus is two cadence / bar directors — illegal. Dilate + Court Stretch is mass ×2 twice. Table M pairs with Levy: Tithe-box **never** occupies the Antiphoner. Stretch then Hex Toll is late **and** expensive — that is the intended exam, not a brick (Strike stays legal at 0 remaining). Player Cadence Stretch cannot target allies.  
**QA:** Observation counts his stretch cast, including all-zero skip. Antiphoner / Bomber 0 XP. Cap 8. Once-per-battle flags untouched. Missing map fail-closed.  
**STATUS:** PROPOSED

---

### BOSS_ID: `hood_recluse`

**NAME:** The Hood Recluse  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A bishop of the close choir. Long shots find cloth. Two steps find flesh.  
**CORE_MECHANIC:** **Next applied hit from Chebyshev ≥ 3 deals 0.** Every 3 turns he arms Far Hood on himself (self, range 0). The next **applied** damaging hit whose attacker is Chebyshev ≥ 3 from him at resolve deals 0, then consume. Hits from 1–2 still land and **do not** consume. Duration until consume or 2 of his turns. Distinct from Sidestep (any range), Near Hood (≤ 1), Return Sting (0 + half poke), Morrow Plate (delayed absorb). DoT ticks do **not** consume (Tick Plate). The learnable is **self, ≥ 3 miss-once**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Arm every 3 turns if no hood is live. Kit: Shield / Slow / Expose. One destructible **Capuche**; breaking it **skips the next arm** (does not strip a live hood). |
| 2 | ≤ 40% | `NAVE_HOOD`: arms himself **and** one living extra (independent consumes). Iron Skin + Mirror. Capuche, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Arm resolves same turn as telegraph. Capuche, if alive, breaks itself. Overlay +8%. Min Chebyshev stays **3** (do not brick melee). |

**SPELLS (proposed kit):** `starter-shield`, `spell-slow`, `spell-expose`, `spell-iron-skin` (P2), `spell-mirror` (P2). Unique vs Fortress (physical / iron / shield / barrier / nova), Plate (shield / iron / slow / heal / sentinel), Rebound (return poke). He has **no** `physical_attack` in kit — the exam is *your* range, not his Strike.  
**DISCOVERABLE_SPELLS:** #636 `spell-far-hood` (`PLAYER_LEARNABLE` / extra `ELITE` / `ENEMY_DISCOVERY` door: add `bossIds: ["hood_recluse"]`). Observation = he **arms** (`kind: "cast"`). A later consume is not a second observe. `NAVE_HOOD` (self + extra / Capuche director) is `BOSS_ONLY`. Do **not** grant Sidestep, Near Hood, Mid Hood, Odd Hood, Return Sting, or Morrow Plate from this fight.

**AI:** Arm when the nearest hostile is Chebyshev ≥ 3. Skip if Capuche was broken this cycle. Skip if a hood is already live on him (P1). P2: also arm the extra if one lives and is Chebyshev ≥ 3 from you.  
**ARENA_RULES:** Capuche HP = `0.15 * playerMaxHp`. Consume in the incoming-hit pipeline **before** HP write. Do not add a percent miss inside `combatMath.ts`. Bounce hops use the **bouncer’s** cell as attacker. Challenge: a consumed 0 is not `recordChallengeDamageTaken` (no HP loss); a 1–2 hit that lands **is**.  
**SUMMONS:** 1 wisp in P2 only if needed for the extra-hood exam — prefer **no** extra in solo P1. Table M's Hexed Marker is a leave exam, not a hooded extra. Cap 4.  
**PLAYER_COUNTERPLAY:** Walk to Chebyshev 2, then Strike / Inferno; Swap / Home Step into melee; break the Capuche; do not dump Sacrifice from 4.  
**MASTERY_OBJECTIVE:** Never let a Chebyshev ≥ 3 hit consume Far Hood (`capuche_closed`). Walking in to 2 and landing is the pass. A Capuche skip that leaves him unhooded is the pass. A far shot that deals 0 and consumes fails it.  
**REWARDS:** 7 / 4 when shipped. Far Hood is the prize (`ELITE`).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +0, Phase-2 1.20. Gate is **range**, not a percent. Hood count **1** until P2 **2**.  
**BALANCE_RISKS:** Hood + Queen / Static is two range directors — illegal. Hood + Sole / Lock / Fosse can deny the close-in walk — illegal. Hood + Rebound / Cover / Sovereign is two incoming-hit directors. Hood + Bone is L3 (Cavalier already on Table L) — do not restack. Table M pairs with Hex: Hex dest **never** occupies the Capuche. Leaving Hex at range 4 to a cell still ≥ 3 still consumes — walk to 2 after the leave. Vault through walls into 2 is legal as a once/battle answer, not the Table M pair. Player Far Hood cannot last past consume or 2 of their turns.  
**QA:** Observation counts his arm, not the consume and not player Far Hood. Capuche 0 XP. Hits from 1–2 do not consume. DoT does not consume. Bounce uses bouncer cell. Missing `currentView` is irrelevant (range is Chebyshev, not facing).  
**STATUS:** PROPOSED

---

## 8.14 Encounter sheets — Wave 16 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 15: **detonate on their next walk MP** (Boot Sting = walked *already*, damage now; Post Sting = *unmoved now*; Fuse Tile / Pit Wick = *tile clocks*; Cast Mark detonates on *their cast*; Wound Mark detonates when *they take a hit*; Gait Wick marks a unit so the **next** ≥ 1 **walk** MP deals 10 through existing `dealDamage`, then consume — forced-move / Swap / Home Step / hinge do **not** detonate; 2 of their turns then fall off for 0), **bonus if leftover AP is 0** (Empty Plate leftover → *+RES*; Empty Purse / Purse Cut = *economy*; Still Brand / Post Sting = *unmoved*; Lone Sting = isolated by *bodies*; Dry Sting deals 12 and +8 iff the target’s **current leftover AP this turn** is 0 — evaluate leftover after their last AP debit, **before** this card’s own AP debit on the caster), **caster steps adjacent to a targeted ally** (Hinge Step *rotates 90°* around the ally; Relay Dash = walk *max 2*; Morrow Step = delayed *blink*; Cover Step = hit *redirect*; Leash Hook / Ally Reel *pull the ally*; Home Step dest-picks a free Chebyshev-1 of a living ally, moves the **caster**, origin frees, target stays — **not** `isSwap`; no free adj = fizzle, AP spent), **next walks this turn must be Manhattan 2** (Must Pace = must walk to *cast*; Even / Odd Stride = *parity*; Walk Toll = *+1 MP per step*; Diag Lock = *diagonal shape*; Rank Lock = *axis*; Must Span makes every walk they start this turn Manhattan **exactly 2** — 1-step and 3-step illegal; they may spend 0 walk MP; forced-move is legal at any length).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-16 learnables reuse remaining **#636** Gait Wick / Dry Sting / Home Step / Must Span. No new #137 spell ids. No remaining #636 / #695 / #726 / #787 / #849 extra doors. Court Hinge stays closed. Court Stretch stays closed. Quad Span stays off until occupy-weight exists.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, and Table M. Pairing is **Table N** only (§10.13).

**Stub note:** Gait Wick / Dry Sting / Home Step / Must Span have **no** #636 stub. Do **not** remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `wick_exorcist`

**NAME:** The Wick Exorcist  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the unspent step. He does not tax the tile you occupy. He taxes the stride you still intend.  
**CORE_MECHANIC:** **Detonate on their next walk MP.** Every 3 turns he Gait Wicks the player (range ≤ 3, LoS). The next time that unit spends ≥ 1 **walk** MP, deal 10 through existing `dealDamage` (RES+SR), then consume. Forced-move / Swap / Home Step / hinge do **not** detonate. If they never walk before 2 of their turns, the mark falls off for 0. Distinct from Boot Sting (already walked), Post Sting (unmoved now), Fuse / Pit Wick (tile clocks). The learnable is **one unit, next walk 10**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Wick every 3 turns if the player is unmarked. Kit: Poison / Mark / Weaken. One destructible **Cresset**; breaking it **skips the next wick** (does not strip a live mark). |
| 2 | ≤ 45% | `CHOIR_WICK`: mark the player **and** every living extra (independent consumes). Frost + Archer. Cresset, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Wick resolves same turn as telegraph. Cresset, if alive, breaks itself. Overlay +8%. Forced-move still does **not** detonate. |

**SPELLS (proposed kit):** `starter-poison`, `spell-mark`, `spell-weaken`, `starter-frost` (P2), `summon-archer` (P2). Unique vs Hexed (mark / slow / barrier / expose / archer), Wick Prelate (mark / poison / barrier / inferno / bomber), Brand (mark / cursed / slow / enrage / archer), Fetid (venom / poison / cursed / lifesteal), Levy (drain / expose / poison / cursed / barrier).  
**DISCOVERABLE_SPELLS:** #636 `spell-gait-wick` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["wick_exorcist"]`). Observation = he **marks** (`kind: "cast"`). A later 10 / expiry-0 is not a second observe. `CHOIR_WICK` (player + extras / Cresset director) is `BOSS_ONLY`. Do **not** grant Boot Sting, Post Sting, Fuse Tile, Pit Wick, or Must Pace from this fight.

**AI:** Mark when the player’s current MP ≥ 1. Skip if Cresset was broken this cycle. Skip if already marked. Never mark himself. Archer recast only under cap.  
**ARENA_RULES:** Cresset HP = `0.15 * playerMaxHp`. Delayed 10 is a spell-hit (`recordChallengeDamageTaken`). Summon-control walks spend the **player** walk pool today — a player-side summon walk detonates a mark **on the player** only if the marked id is the player (document; do not silently retarget). Strip-able as `effectCategory: "debuff"` if a later writer adds Dispel.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP. P2 extras can be marked; extra death is not a walk.  
**PLAYER_COUNTERPLAY:** Stand. Swap / Vault / Home Step off the cell (not walk MP). Break the Cresset. Cleanse if you own it. Do not 2-step a live wick into March’s required pace without eating 10.  
**MASTERY_OBJECTIVE:** Never detonate Gait Wick by spending walk MP (`cresset_unstepped`). Standing through expiry is the pass. A Cresset skip that leaves you unmarked is the pass. A forced-move that does not detonate is the pass. A walk that deals 10 fails it.  
**REWARDS:** 6 / 4 when shipped. Gait Wick is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. 10 follows existing damage growth. Mark count **1** until P2 **player + extras**.  
**BALANCE_RISKS:** Wick + Sole is a brick (cannot walk, cannot detonate — wait, stand is legal; Sole forbids walk so the mark never pays — boring, not a brick, but two walk-MP directors). Wick + Infirm / Stride is two walk-MP taxes — illegal. Wick + Peel / Toll is two leave/step taxes — illegal. Wick + Boot Sting is already-walked vs next-walk. Table N pairs with March: Pulpit **never** occupies the Cresset. The required pace **is** the detonating walk — that is the intended exam, not a brick (they may spend 0 walk MP and Strike). Player Gait Wick cannot last past consume or 2 of the target’s turns.  
**QA:** Observation counts his mark, not the 10 and not player Gait Wick. Cresset / Archer 0 XP. Forced-move does not detonate. Challenge 10 hits `recordChallengeDamageTaken`. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `dry_nuncio`

**NAME:** The Dry Nuncio  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A knight of the empty purse. He does not freeze leftover. He waits until you have spent it, then the sting is honest.  
**CORE_MECHANIC:** **Bonus if leftover AP is 0.** Every 3 turns he Dry Stings the player (range ≤ 2, LoS). Deal 12 through existing `dealDamage`. If the target’s **current leftover AP this turn** is 0, deal +8 (20 total) through the same helper. Distinct from Empty Plate (+RES), Purse Cut (economy), Post Sting (unmoved), Lone Sting (isolation). The learnable is **one hostile, 12 / +8 if leftover 0**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Sting every 3 turns. Kit: Drain Courage / Frost / Weaken. One destructible **Cruet**; breaking it **skips the next sting**. |
| 2 | ≤ 45% | `NAVE_DRY`: if the player’s leftover is 0, sting **every** living player-side body (independent leftover reads). Inferno + Bomber. Cruet, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Sting resolves same turn as telegraph. Cruet, if alive, breaks itself. Overlay +8%. Gate stays leftover **0** (do not also tax leftover). |

**SPELLS (proposed kit):** `spell-drain-courage`, `starter-frost`, `spell-weaken`, `spell-inferno` (P2), `summon-bomber` (P2). Unique vs Surplus (drain / mark / haste / mirror / barrier), Levy (drain / expose / poison / cursed / barrier), Crypt (barrier / drain / slow / inferno / bomber), Lend (haste / drain / rally / wisp / sacrifice), Eternal (slow / drain / iron / cursed).  
**DISCOVERABLE_SPELLS:** #636 `spell-dry-sting` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["dry_nuncio"]`). Observation = he **casts** the sting (`kind: "cast"`), including a 12 with leftover ≥ 1. The +8 is not a second observe. `NAVE_DRY` (every player-side body / Cruet director) is `BOSS_ONLY`. Do **not** grant Empty Plate, Purse Cut, Post Sting, Lone Sting, or Surplus Ward from this fight.

**AI:** Sting when leftover is 0 **or** 12 still threatens. Skip if Cruet was broken this cycle. Drain Courage first when leftover ≥ 2 (that debit is **their** AP, then leftover is re-read). Never sting himself. Bomber recast only under cap.  
**ARENA_RULES:** Cruet HP = `0.15 * playerMaxHp`. Leftover is the **target’s** current AP after their last debit, before this card’s caster AP debit. Purse Keep does **not** empty the bar (stored leftover is still > 0 until turn end). Challenge: 12 and the +8 are spell-hits (`recordChallengeDamageTaken`).  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. P2 extra stings only if that body’s leftover is 0 (player-side summons often sit at full AP — skip them).  
**PLAYER_COUNTERPLAY:** Keep 1 AP unspent. Break the Cruet. Purse Keep does not hide leftover this turn. Strike from 1 leftover is the pass.  
**MASTERY_OBJECTIVE:** Never take the leftover-0 +8 (`cruet_wet`). A 12 with leftover ≥ 1 is the pass. A Cruet skip is the pass. A P2 extra-sting that deals +8 to **you** fails it.  
**REWARDS:** 5 / 3 when shipped. Dry Sting is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. 12 / +8 follow existing damage growth. Gate is **boolean**.  
**BALANCE_RISKS:** Dry + Surplus / Lend / Purse Keep-as-director is two leftover-AP directors — illegal. Dry + Levy is next-cast tax vs leftover sting — different, but two AP-bar exams; Table N does **not** pair them (Levy already M2). Table N pairs with Eternal: his AP drain **never** occupies the Cruet. Keep 1 AP through the drain, or eat 20 — that is the intended exam. Player Dry Sting cannot target allies.  
**QA:** Observation counts his sting, including 12-only. Cruet / Bomber 0 XP. Leftover read is the target’s bar. Purse Keep still > 0 this turn. Challenge 12 / +8 hit `recordChallengeDamageTaken`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `hearth_legate`

**NAME:** The Hearth Legate  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A queen of the joined file. He does not pull you. He goes home to the extra you failed to isolate.  
**CORE_MECHANIC:** **Caster steps adjacent to a targeted ally.** Every 3 turns he Home Steps to a living extra (range ≤ 4, LoS to that extra). Dest = free Chebyshev-1 of the extra, prefer smallest Chebyshev to his current cell, then lowest `(x,y)`. Origin frees. Extra does not move. If no free adj, fizzle (AP spent; observation still fires). Distinct from Hinge Step (90° around ally), Morrow Step (delayed blink), Cover Step (hit redirect), Swap (`isSwap`). The learnable is **one ally, caster dest-pick adj, not swap**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **hearth clerk** extra (0.20 * playerMaxHp, empty kit, 0 XP) so a join target exists. Home Step every 3 turns. Kit: Sentinel / Shield / Rally. One destructible **Andiron**; breaking it **skips the next step**. |
| 2 | ≤ 45% | `CHOIR_HEARTH`: he steps to the extra **and** the extra occupancy-steps 1 toward him if that dest is `isCellFree` (not a player shove — MIMA-005 stays off). Mirror + Lifesteal Nova. Andiron, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Home Step resolves same turn as telegraph. Andiron, if alive, breaks itself. Overlay +8%. Dest-onto-hazard **ticks him** (MIMA-001 still OPEN — do not paint lava under the clerk). |

**SPELLS (proposed kit):** `summon-sentinel`, `starter-shield`, `spell-rallying-cry`, `spell-mirror` (P2), `spell-lifesteal-nova` (P2). Unique vs Cover (heal / mirror / haste / wisp / rally), Bait (mirror / mark / shield / weaken / sentinel), Flush (haste / rally / weaken / mirror / sentinel), Cord (wisp / heal / mirror / wolf / sacrifice), Goad (physical / shield / weaken / enrage / iron).  
**DISCOVERABLE_SPELLS:** #636 `spell-home-step` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["hearth_legate"]`). Observation = he **casts** the step (`kind: "cast"`), including a dest-block fizzle. `CHOIR_HEARTH` (mutual join / Andiron director) is `BOSS_ONLY`. Do **not** grant Hinge Step, Morrow Step, Cover Step, Swap, or Ally Reel from this fight.

**AI:** Step when Chebyshev to the extra is ≥ 2 and a free adj exists. Skip if Andiron was broken this cycle. Skip if already Chebyshev-1. Never target the player (ally-only). Never call `swapPositions`. Dest onto hazard is **illegal** this kit (pick another adj / skip).  
**ARENA_RULES:** Andiron HP = `0.15 * playerMaxHp`. Occupancy dest, **not** `isSwap`. Quiet Sill / Exit Sting on the landing cell **would** tick — this kit does not paint those. Root blocks **walk**, not this resolve; stamp `effectCategory: "relocate"` so Blink Seal can filter by field.  
**SUMMONS:** 1 hearth clerk from pull (0 XP, not a victory target) + 1 sentinel in P1 kit. Cap 4. Clerk death ≠ victory. The clerk is the intended join target.  
**PLAYER_COUNTERPLAY:** Occupy all adj cells; Barrier / Open Pit the only landing; kill the clerk before the glow; break the Andiron.  
**MASTERY_OBJECTIVE:** He never successfully Home Steps (`andiron_unjoined`). A dest-block fizzle / Andiron skip / no-extra fizzle is the pass. A P2 mutual join that lands him adj fails it.  
**REWARDS:** 6 / 4 when shipped. Home Step is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Dest pick is **occupancy**, 0 damage. Body count **fixed**.  
**BALANCE_RISKS:** Hearth + Yoke / Orbit / Hinge / Grandmaster / Morrow / Jostle / Mill / Ram / Hook is two relocate directors — illegal. Hearth + Countess / Rime is landing × hazard (MIMA-001) — illegal. Table N pairs with Cover: Bier dest **never** occupies the Andiron. He joins the martyr, then Cover sends your **next hit** to the extra — that is the intended exam (Strike the extra, or occupy the landing). Player Home Step cannot target hostiles.  
**QA:** Observation counts his step cast, including fizzle. Andiron / clerk / Sentinel 0 XP. Player is never the target. Dest-onto-hazard is skipped, not ticked. Not `swapPositions`. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `must_preceptor`

**NAME:** The Must Preceptor  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A knight who measures the nave in ells. One tile is a stumble. Two tiles is the rule. Three is greed.  
**CORE_MECHANIC:** **Next walks this turn must be Manhattan 2.** Every 3 turns he Must Spans the player (range ≤ 3, LoS). For the rest of their **current turn**, every walk they start must have Manhattan length **exactly 2**. A 1-step is illegal (0 MP, no move). A 3-step is illegal. They may spend 0 walk MP. Forced-move is legal at any length. Distinct from Must Pace (must walk to *cast*), Rank Lock (axis), Diag Lock (diagonal shape). The learnable is **one hostile, rest of current turn, Manhattan 2**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Brand every 3 turns. Kit: Haste / Slow / Barrier. One destructible **Ell**; breaking it **skips the next brand** (does not strip a live brand). |
| 2 | ≤ 40% | `NAVE_SPAN`: brand the player **and** every living player-side summon (independent filters). Expose + Dire Wolf. Ell, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Brand resolves same turn as telegraph. Ell, if alive, breaks itself. Overlay +8%. Manhattan stays **2** (do not brick stand). |

**SPELLS (proposed kit):** `spell-haste`, `spell-slow`, `spell-barrier`, `spell-expose` (P2), `summon-dire-wolf` (P2). Unique vs Mill (`physical` / slow / barrier / expose / nova), Stride (slow / haste / weaken / drain / iron), Pendulum (`physical` / slow / haste / nova / iron), Lock (`physical` / slow / mark / iron / nova), March (slow / heal / expose / haste / archer).  
**DISCOVERABLE_SPELLS:** #636 `spell-must-span` (`PLAYER_LEARNABLE` / extra `ELITE` / `ENEMY_DISCOVERY` door: add `bossIds: ["must_preceptor"]`). Observation = he **brands** (`kind: "cast"`). A later illegal 1-step is not a second observe. `NAVE_SPAN` (player + summons / Ell director) is `BOSS_ONLY`. Do **not** grant Must Pace, Rank Lock, Diag Lock, Stride Brand, or Gait Seal from this fight.

**AI:** Brand when the player is Chebyshev 1 (they want a 1-step peel) **or** current MP ≥ 2. Skip if Ell was broken this cycle. Skip if a brand is already live this turn. Wolf recast only under cap.  
**ARENA_RULES:** Ell HP = `0.15 * playerMaxHp`. Walk-dest filter on the existing pathing gate. Illegal walk spends **0 MP**. Vault / Home Step / Swap are not walks. If a legal 2-step path is blocked mid-way, the walk is illegal (same as today’s pathing). Missing walk-spend writer **fail closed** (no brand).  
**SUMMONS:** 1 dire wolf in P2, cap 4. 0 XP. P2 summon brands are independent; a branded wolf that 1-steps is refused.  
**PLAYER_COUNTERPLAY:** Stand. Take a legal 2-step. Swap / Home Step / Vault. Break the Ell. Spare Pace does not help a 1-step.  
**MASTERY_OBJECTIVE:** Never start an illegal walk under the brand (`ell_honest`). Standing is the pass. A legal Manhattan-2 walk is the pass. An Ell skip is the pass. A refused 1-step / 3-step fails it.  
**REWARDS:** 6 / 4 when shipped. Must Span is the prize (`ELITE`).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Gate is **Manhattan 2**, not a percent. Brand duration is **rest of current turn**.  
**BALANCE_RISKS:** Must + Sole is a brick (cannot walk **and** must 2-step). Must + Lock / Fosse / Palisade / Lintel / Crypt can deny every 2-step dest — illegal unless a later pass proves one floor dest. Must + March is two walk-gates (must walk to cast **and** the walk must be 2) — held (Wick already owns March on Table N). Table N pairs with Bias: Quoin dest **never** occupies the Ell. The only legal walks are diagonal 1,1 (Manhattan 2 **and** diagonal). Cardinal 2-steps are Bias-illegal; 1-steps are Must-illegal. Stand / Swap / forced-move still answer. Player Must Span cannot last past the target’s current turn.  
**QA:** Observation counts his brand, not the refused walk and not player Must Span. Ell / Wolf 0 XP. Illegal walk spends 0 MP. Forced-move any length. Missing walk writer fail-closed. Vault is not a walk.  
**STATUS:** PROPOSED

---

## 8.15 Encounter sheets — Wave 17 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 16: **+1 current MP to an unmoved ally** (Spare Pace = +1 *now, no gate*; Gift Sill = cell *enter* +MP; Exit Boon = *leave*; Walk Toll = *+1 cost*; Haste = +2 MP *stat*; Leftover Lend / Cadence Lend dump leftover *AP*; Boot Lend adds 1 to an ally’s **current** MP iff `walkMpSpentThisTurn` is 0 — already walked = fizzle, AP spent; forced-move does **not** set the walk flag so a shoved ally can still receive it; cap at their max MP; never write max MP), **carry leftover AP to next turn start** (Timestep = full AP/MP *now*; Purse Cut / Empty Purse / Purse Lock = *their* economy; Leftover Lend dumps to an *ally now*; Late Purse *burns* leftover; Purse Keep is **self**, once/battle, 1 AP, snapshots leftover at **end of this turn**, pays `min(snapshot, 3)` at **next own turn start** — **does not splice the turn queue**; leftover 0 still spends the once/battle for 0; Dry Sting still sees leftover > 0 this turn while the keep is armed), **next DoT tick on you is 0** (Cleanse / Dispel *strip* now; Thin Ward / Ward Plate / Morrow Plate eat *hits*; Tick Hood is W7 different; Far Hood eats a *direct* hit from Chebyshev ≥ 3, not DoT; Tick Plate arms a consume — the next DoT stack tick that would apply HP loss deals 0, then consume; a 0-tick still decrements that stack’s duration; other stacks on later ticks still land; consume in `engine/dotStacks.ts`, not `dealDamage`; `challengeHealUsedRef` is not involved), **their last resolved spell id is illegal for 1 turn** (Mute Thread fizzles the *next any* id; Once Verse is echo family; Oath Blade other ids fizzle while Strike *hurts*; Hex of Silence is a full-bar *lock*; Cast Hold cannot resolve a *spell* until they walk; Last Mute reads `lastResolvedSpellId` — last id that spent AP for them this battle — and that id is illegal for 1 of **their** turns; no last id = fizzle, AP spent; Strike is illegal **only if** `physical_attack` was that last id; observation is the mute **cast**, not the later refuse).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-17 learnables reuse remaining **#636** Boot Lend / Purse Keep / Tick Plate / Last Mute. No new #137 spell ids. No remaining #636 (`spell-quad-span` / `spell-pair-slide` / `spell-court-stretch`) / #695 / #726 / #787 / #849 extra doors. Court Hinge stays closed. Court Stretch stays closed. Quad Span stays off until occupy-weight exists. Pair Slide waits (force-move pair; MIMA-005).

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, and Table N. Pairing is **Table O** only (§10.14).

**Stub note:** Boot Lend / Tick Plate / Last Mute have **no** #636 stub. Purse Keep’s stub is `keep_bursar` — **not** remapped to `purse_steward`. Do **not** remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `boot_subprior`

**NAME:** The Boot Subprior  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop of the unspent stride. He does not walk for you. He funds the step you have not taken.  
**CORE_MECHANIC:** **+1 current MP to an unmoved ally.** Every 3 turns he Boot Lends a living extra (range ≤ 3, LoS). If that extra’s `walkMpSpentThisTurn` is 0, add 1 to their **current** MP this turn (cap at their max MP). If they already walked, fizzle (AP spent; observation still fires). Forced-move does **not** set the walk flag. Distinct from Spare Pace (no gate), Gift Sill (enter cell), Haste (+2 MP stat). The learnable is **one unmoved ally, +1 current MP**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **gait novice** extra (0.20 * playerMaxHp, empty kit, 0 XP) so a lend target exists. Lend every 3 turns. Kit: Haste / Drain / Expose. One destructible **Caliga**; breaking it **skips the next lend**. |
| 2 | ≤ 45% | `CHOIR_BOOT`: lend **every** living extra (independent unmoved checks). Blast + Sentinel. Caliga, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Lend resolves same turn as telegraph. Caliga, if alive, breaks itself. Overlay +8%. Gate stays unmoved (do not also gift walked extras). |

**SPELLS (proposed kit):** `spell-haste`, `starter-drain`, `spell-expose`, `starter-blast` (P2), `summon-sentinel` (P2). Unique vs Lend (haste / drain / rally / wisp / sacrifice), Infirm (heal / haste / physical / iron / wisp), Morrow (swap / haste / drain / mirror / wolf), Static (blast / haste / nova / expose), Ram (physical / haste / shield / barrier / rally), Cover (heal / mirror / haste / wisp / rally), Hearth (sentinel / shield / rally / mirror / nova).  
**DISCOVERABLE_SPELLS:** #636 `spell-boot-lend` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["boot_subprior"]`). Observation = he **casts** the lend (`kind: "cast"`), including a walked fizzle. `CHOIR_BOOT` (every extra / Caliga director) is `BOSS_ONLY`. Do **not** grant Spare Pace, Gift Sill, Leftover Lend, Cadence Lend, or Haste from this fight. Haste in kit is **his** stat buff, not the player door.

**AI:** Lend the novice when `walkMpSpentThisTurn` is 0 **and** current MP < max. Skip if Caliga was broken this cycle. Skip if already at max MP. Never lend the player (ally-only). Never lend himself. Sentinel recast only under cap.  
**ARENA_RULES:** Caliga HP = `0.15 * playerMaxHp`. +1 MP is not damage and is not `recordChallengeApSpend`. Forced-move onto the novice does **not** fizzle a later lend. Do not write max MP. Do not name-check `"Boot"`.  
**SUMMONS:** 1 gait novice from pull (0 XP, not a victory target) + 1 sentinel in P2. Cap 4. Novice death ≠ victory. The novice is the intended lend target.  
**PLAYER_COUNTERPLAY:** Force the novice to walk first (Goad / Must Pace on *them* is not this kit — **you** walk them by occupying so they spend walk MP, or kill them before the glow); break the Caliga; body-block so the gifted 2-step has no dest. Spare Pace on **you** does not fizzle his lend.  
**MASTERY_OBJECTIVE:** The extra never receives +1 MP (`caliga_unfunded`). A walked fizzle / Caliga skip / no-extra fizzle / already-max skip is the pass. A P2 choir lend that pays +1 to **any** extra fails it.  
**REWARDS:** 5 / 3 when shipped. Boot Lend is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Gift is **+1 current MP**, not a percent. Body count **fixed**.  
**BALANCE_RISKS:** Boot + Infirm / March / Stride / Wick / Sole is two walk-MP directors on overlapping bodies — illegal when the player is the walk target (Infirm heals if *he* walked; March/Stride/Wick/Sole tax *your* walk). Table O pairs with Lock: Compass dest **never** occupies the Caliga. He gifts the novice a 2-step; you are axis-locked — occupy the on-axis landing, or let the novice close. Mill / Ram / Hook / Pair Slide do **not** fizzle the lend (forced-move ≠ walk MP) — do not pair as a false answer. Player Boot Lend cannot target hostiles or write max MP.  
**QA:** Observation counts his lend, including fizzle. Caliga / novice / Sentinel 0 XP. Player is never the target. Forced-move does not fizzle. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `purse_steward`

**NAME:** The Purse Steward  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A king of the unspent coin. He does not Timestep the bar full. He banks three for the next office.  
**CORE_MECHANIC:** **Carry leftover AP to next turn start.** Once per battle (every 3 turns he *attempts*; the once/battle is the lid) he Purse Keeps (self, 1 AP). After paying 1, arm a keep. At **his next turn start** (not mid-RAF, not end-of-round wrap), add `min(leftover AP at the end of this turn, 3)` to current AP (cap at max AP). Leftover 0 still spends the once/battle for 0. Distinct from Timestep (full *now*), Leftover Lend (dump to ally *now*), Surplus Ward (evade if leftover ≥ 2). The learnable is **self, once/battle, cap 3, next own turn start**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Keep when leftover after the 1-cost would be ≥ 2. Kit: Timestep / Drain Courage / Barrier — Timestep is the *now* dump, Keep is the *next* bank; both in kit is the contrast, not a second grant. One destructible **Cista**; breaking it **skips the next keep** (does not un-spend a live once/battle). |
| 2 | ≤ 40% | `NAVE_KEEP`: he keeps (if unused) **and** every living extra with leftover ≥ 1 also arms a keep (independent snapshots; extras are not once/battle-locked to his flag). Inferno + Sentinel. Cista, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Keep resolves same turn as telegraph. Cista, if alive, breaks itself. Overlay +8%. Cap stays **3**. Death before next turn start discards the bank. |

**SPELLS (proposed kit):** `spell-timestep`, `spell-drain-courage`, `spell-barrier`, `spell-inferno` (P2), `summon-sentinel` (P2). Unique vs Surplus (drain-courage / mark / haste / mirror / barrier), Lend (haste / drain / rally / wisp / sacrifice), Dry (drain-courage / frost / weaken / inferno / bomber), Crypt (barrier / drain / slow / inferno / bomber), Grandmaster (blast / swap / mirror / timestep / frost), Final (physical / timestep / sacrifice / wolf), Levy (drain-courage / expose / poison / cursed / barrier).  
**DISCOVERABLE_SPELLS:** #636 `spell-purse-keep` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["purse_steward"]`). Observation = he **arms** the keep (`kind: "cast"`), including a 0-snapshot. The next-turn pay is not a second observe. `NAVE_KEEP` (extras also bank / Cista director) is `BOSS_ONLY`. Do **not** grant Purse Cut, Empty Purse, Timestep, Leftover Lend, Late Purse, or Surplus Ward from this fight. #636 stub `keep_bursar` is **not** this id.

**AI:** Keep when leftover after paying 1 would be ≥ 2 **and** unused this battle. Skip if Cista was broken this cycle. Skip if already used. Timestep is the panic *now* dump when HP ≤ 40% and Keep is already spent. Sentinel recast only under cap. Never splice the turn queue.  
**ARENA_RULES:** Cista HP = `0.15 * playerMaxHp`. Snapshot leftover **after** this card’s 1 AP, at end of **his** turn. Keep snapshots **before** leftover-burn cards (Late Purse / Pack Tithe) if those share the end-of-turn pass. Dry Sting still sees leftover > 0 this turn. Death discards the bank. Do not name-check `"Purse"`.  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP. P2 extra-keeps only if that extra’s leftover ≥ 1 (empty-kit extras often sit at full AP — they **do** bank). Extra death before *their* next turn start discards *their* bank.  
**PLAYER_COUNTERPLAY:** Spend him down so leftover snapshots 0; silence / kill before next turn start; break the Cista before he arms; Hex Toll / Stretch the Inferno so banked 3 is not enough on time.  
**MASTERY_OBJECTIVE:** He never banks leftover > 0 (`cista_empty`). A 0-snapshot / Cista skip / already-spent skip is the pass. A next-turn pay of 1–3 fails it. A P2 extra that banks > 0 fails it.  
**REWARDS:** 7 / 4 when shipped. Purse Keep is the prize (`ELITE` / `MULTI_SOURCE`).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +0, Phase-2 1.20. Cap **3** is fixed. Once/battle does not scale.  
**BALANCE_RISKS:** Purse + Surplus / Lend / Dry / Flush is two leftover-AP directors — illegal. Purse + Timestep-as-partner is two now/next dumps (Timestep stays **kit contrast**, not a pair). Table O pairs with Pendulum: Metronome dest **never** occupies the Cista. Dump leftover before snapshot, or the banked 3 recasts Inferno after the next sweep — that is the intended exam (one clock; Keep is not a second clock). Player Purse Keep cannot last past one battle or pay mid-RAF.  
**QA:** Observation counts his arm, including 0-snapshot. Cista / Sentinel 0 XP. Pay is next **own** turn start. Dry leftover still > 0 this turn. Challenge: AP add is not `recordChallengeApSpend`. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `tick_infirmarer`

**NAME:** The Tick Infirmarer  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A rook of the next fever. He does not strip the plague. He eats one pulse and lets the rest work.  
**CORE_MECHANIC:** **Next DoT tick on you is 0.** Every 3 turns he Tick Plates himself (self, range 0) if a DoT stack is on him **or** he expects Inferno/Poison this cycle. The next DoT stack tick that would apply HP loss to him deals 0, then consume. Other stacks on later ticks still land. Direct hits are unaffected. Distinct from Morrow Plate (hits), Far Hood (direct ≥ 3), Cleanse (strip now). The learnable is **self, next DoT tick 0**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Plate every 3 turns once a DoT is on him; if none, skip (still legal, no observe). Kit: Shield / Slow / Rally. One destructible **Plaster**; breaking it **skips the next plate** (does not un-consume a live plate). |
| 2 | ≤ 45% | `NAVE_TICK`: plate himself **and** one extra (bomber if alive). Frost Nova + Bomber. Plaster, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Plate resolves same turn as telegraph. Plaster, if alive, breaks itself. Overlay +8%. Consume stays **one** tick (do not eat the whole DoT). |

**SPELLS (proposed kit):** `starter-shield`, `spell-slow`, `spell-rallying-cry`, `spell-frost-nova` (P2), `summon-bomber` (P2). Unique vs Span (shield / expose / slow / iron / bomber), Hood (shield / slow / expose / iron / mirror), Plate (shield / iron / slow / heal / sentinel), Hearth (sentinel / shield / rally / mirror / nova), Crypt (barrier / drain / slow / inferno / bomber), Conductor (rally / wisp / weaken / bomber / drain-courage), Dilate (slow / mirror / mark / enrage / bomber). He has **no** Inferno — the exam is *your* DoT, plus Fetid rot on **you**.  
**DISCOVERABLE_SPELLS:** #636 `spell-tick-plate` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["tick_infirmarer"]`). Observation = he **arms** the plate (`kind: "cast"`). A later 0-tick is not a second observe. A skip with no DoT is **not** observation. `NAVE_TICK` (himself + extra / Plaster director) is `BOSS_ONLY`. Do **not** grant Morrow Plate, Tick Hood, Ward Plate, Empty Plate, Far Hood, or Cleanse from this fight.

**AI:** Plate when a DoT stack is on him. Skip if Plaster was broken this cycle. Skip if already plated. Skip if no DoT (no observe). Bomber recast only under cap. Never plate the player.  
**ARENA_RULES:** Plaster HP = `0.15 * playerMaxHp`. Consume in the existing DoT tick helper (`engine/dotStacks.ts`), **before** HP write. A 0-tick still decrements that stack’s duration. Lava / shock / spike hazard ticks do **not** consume (not DoT stacks). Far Hood / Return Sting do not consume this plate. `challengeHealUsedRef` is not involved. Do not name-check `"Tick"`.  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. P2 extra-plate is the bomber; bomber death before consume wastes that plate.  
**PLAYER_COUNTERPLAY:** Inferno / Poison him, then wait the plated tick; a second DoT type still lands; break the Plaster before he arms; do not dump a second Inferno on the plated turn.  
**MASTERY_OBJECTIVE:** Never let Tick Plate consume a DoT tick (`plaster_bitten`). Landing a DoT that ticks for > 0 (unplated, or after consume) is the pass. A Plaster skip / no-DoT skip is the pass. A 0-tick consume on him **or** the bomber fails it.  
**REWARDS:** 5 / 3 when shipped. Tick Plate is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Gate is **one tick**, not a percent. Duration until consume or 2 of his turns.  
**BALANCE_RISKS:** Tick + Plate Bursar / Rebound / Hood / Cover / Sovereign is two incoming-mitigation directors — illegal. Tick + Countess is a **false exam** (lava river is a hazard tick, not `dotStacks`). Tick + Wick Prelate fuses are occupancy, not DoT. Table O pairs with Fetid: split-rook dest **never** occupies the Plaster. Inferno him (one tick eaten) while answering compounding rot on **you** — two DoT stories, different targets. Player Tick Plate cannot last past consume or 2 of their turns.  
**QA:** Observation counts his arm, not the 0-tick and not a no-DoT skip. Plaster / Bomber 0 XP. Hazard ticks do not consume. Challenge: the eaten tick is 0 HP (no `recordChallengeDamageTaken` on him from that tick). Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `mute_notary`

**NAME:** The Mute Notary  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A bishop of the last verse. He does not silence the choir. He forbids the line you just signed.  
**CORE_MECHANIC:** **Their last resolved spell id is illegal for 1 turn.** Every 3 turns he Last Mutes the player (range ≤ 3, LoS). Read `lastResolvedSpellId` (last id that spent AP for them this battle). For 1 of **their** turns, that id is illegal (cast refuses, 0 AP). No last id = fizzle (AP spent; observation still fires). Strike is illegal **only if** `physical_attack` was that last id. Distinct from Mute Thread (next *any* id), Oath Blade (other ids fizzle, Strike hurts), Hex of Silence (full bar). The learnable is **one hostile, last id, 1 of their turns**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Mute every 3 turns if a last id exists. Kit: Veil / Drain Courage / Blast. One destructible **Tabula**; breaking it **skips the next mute** (does not clear a live ban). |
| 2 | ≤ 40% | `CHOIR_MUTE`: mute the player **and** every living extra that has a last id (independent reads; empty-kit extras with no last id skip). Sacrifice + Bomber. Tabula, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Mute resolves same turn as telegraph. Tabula, if alive, breaks itself. Overlay +8%. Ban stays **one** id (do not become Hex of Silence). |

**SPELLS (proposed kit):** `spell-shadow-veil`, `spell-drain-courage`, `starter-blast`, `spell-sacrifice` (P2), `summon-bomber` (P2). Unique vs Lone (blast / expose / veil / inferno / archer), Archbishop (cursed / veil / sacrifice / wisp), Queen (blast / mark / nova / veil), Gaze (frost / mark / iron / weaken / veil), Dry (drain-courage / frost / weaken / inferno / bomber), Conductor (rally / wisp / weaken / bomber / drain-courage), Rebound (heal / expose / enrage / veil / wisp).  
**DISCOVERABLE_SPELLS:** #636 `spell-last-mute` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["mute_notary"]`). Observation = he **casts** the mute (`kind: "cast"`), including a no-last-id fizzle. A later refuse is not a second observe. `CHOIR_MUTE` (player + extras / Tabula director) is `BOSS_ONLY`. Do **not** grant Mute Thread, Once Verse, Oath Blade, Hex of Silence, or Cadence Stretch from this fight.

**AI:** Mute when last id exists **and** is not `physical_attack` (or is Strike and they have no second damaging id). Skip if Tabula was broken this cycle. Skip if no last id (still may fizzle for observe if he casts into empty — prefer skip). Bomber recast only under cap. Never mute himself.  
**ARENA_RULES:** Tabula HP = `0.15 * playerMaxHp`. `lastResolvedSpellId` must be written by `executeCastAttempt` / enemy resolve on **successful AP spend** (cast **or** fizzle that spent AP). Missing writer **fail-closed** (no mute; treat as no last id). Refused recast spends **0 AP**. Do not name-check `"Mute"`.  
**SUMMONS:** 1 bomber in P2, cap 4. 0 XP. P2 extra-mutes only if that extra has a last id (usually skip).  
**PLAYER_COUNTERPLAY:** Cast a cheap legal id last (Strike) so mute bans Strike, then Inferno; never cast before the mute (fizzle); break the Tabula; sit on a different id.  
**MASTERY_OBJECTIVE:** Never have a spell id refused by Last Mute (`tabula_unsigned`). A no-last-id fizzle / Tabula skip is the pass. Recasting a *different* id is the pass. A refused Inferno / Strike / other last id fails it.  
**REWARDS:** 6 / 4 when shipped. Last Mute is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Ban is **one id, 1 of their turns**, not a percent.  
**BALANCE_RISKS:** Mute + Conductor / Weeping is two silence directors — illegal. Mute + Oath is a brick when last id is Strike (must Strike **and** Strike is banned). Mute + Flush is cadence + last-id. Table O pairs with Dilate: Antiphoner dest **never** occupies the Tabula. Stretch Inferno late, then mute that same id — recast is late **and** illegal this turn. Strike stays legal if last id was not Strike. Player Last Mute cannot last past 1 of the target’s turns.  
**QA:** Observation counts his mute, including fizzle. Tabula / Bomber 0 XP. Refuse spends 0 AP. Missing last-id writer fail-closed. Challenge: a refused cast that spends 0 AP is not `recordChallengeApSpend`. Cap 4.  
**STATUS:** PROPOSED

---

## 8.16 Encounter sheets — Wave 18 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 17: **translate two adjacent hostiles 1** (Pair Hinge = *90° rotate* around the pair midpoint; Pawn Trade = *swap*; Slide Tile = *conveyor paint*; Draw Together = *attract*; Court Shove = mass facing; Pair Slide translates **both** 1 cell in the caster→target direction — sign of `(tx-cx, ty-cy)` stepped to a unit axis, diagonal stays diagonal; both dests must be `isCellFree` after vacating the pair; caster does not move; no second body or a blocked dest = fizzle, AP spent; occupancy dests, **not** `isSwap` / `swapPositions`), **heal if caster and target both walked** (Gait Mend = caster *only*; Chase Mend = target *only*; Shove Mend = target *force-moved*; Enter Mend = tile *enter*; Heave Mend = *both force-moved*; Both Mend heals 8 iff **both** have `walkMpSpentThisTurn ≥ 1` — force-move does **not** arm; 0-heal still spends AP), **heal if caster and target were both force-moved** (Shove Mend = *target only*; Both Mend = *both walked*; Heave Mend heals 8 iff **both** have `forcedMovedThisTurn` — walk MP does **not** arm), **heal if caster and target both have leftover MP = 0** (Dry Mend = leftover *AP* = 0; Still Mend = caster spent *0 walk MP* this turn; Dry Sting = leftover-AP *damage* bonus; Parched Mend heals 8 iff **both** leftover walk MP **= 0** at resolve after the 3 AP is paid).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-18 learnables reuse remaining **#636** Pair Slide **and** leftover **#695** Both Mend / **#726** Heave Mend / **#787** Parched Mend. No new #137 spell ids. No remaining #636 (`spell-quad-span` / `spell-court-stretch`) / remaining #695 / remaining #726 / remaining #787 / #849 extra doors. Court Hinge stays closed. Court Stretch stays closed. Quad Span stays off until occupy-weight exists. Pair Slide dests onto lava / spike / rime / wick stay illegal AI until MIMA-001 / 005.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, and Table O. Pairing is **Table P** only (§10.15).

**Stub note:** Pair Slide has **no** #636 stub. Both Mend’s stub is `both_cantor` — **not** remapped to `both_capitular`. Heave Mend’s stub is `heave_cantor` — **not** remapped to `heave_kitchener`. Parched Mend’s stub is `parched_cantor` — **not** remapped to `parched_preacher`. Do **not** remap `pair_usher` / `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `flush_precentor` / `gait_cantor` / `court_hinge_regent` / `span_quad` / `keep_bursar` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `slide_porter`

**NAME:** The Slide Porter  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A porter of the paired litter. He does not hinge you 90°. He walks the pair one step onto the paint.  
**CORE_MECHANIC:** **Translate two adjacent hostiles 1.** Every 3 turns he Pair Slides (range ≤ 3, LoS). Target one living hostile; nearest other living hostile at Chebyshev **exactly 1** (4-adj first, then diagonals, then lowest id) translates **with** them 1 cell in the caster→target direction. Both dests must be `isCellFree` after vacating the pair. Distinct from Pair Hinge (90° rotate), Pawn Trade (swap), Slide Tile (conveyor paint). The learnable is **one pair, translate 1, occupancy dests**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Pair every 3 turns if two legal player-side bodies exist (prefer player + a player-side summon; if no summon, skip — never slide the player with *his* wisp as the pair). Kit: Frost / Haste / Weaken. One destructible **Litter**; breaking it **skips the next slide**. |
| 2 | ≤ 40% | `CHOIR_SLIDE`: every Chebyshev-adjacent **hostile pair** slides 1 in the same caster→primary-target direction (cap 2 pairs / 4 bodies). Cursed Wound + Dire Wolf. Wolf is **not** a legal pair-partner with the player (his side). Litter, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Slide resolves same turn as telegraph. Litter, if alive, breaks itself. Overlay +8%. Partial slides stay illegal (blocked dest = whole pair fizzles). |

**SPELLS (proposed kit):** `starter-frost`, `spell-haste`, `spell-weaken`, `spell-cursed-wound` (P2), `summon-dire-wolf` (P2). Unique vs Yoke (swap / haste / expose / iron / wisp), Mill (`physical` / slow / barrier / expose / nova), Jostle (heal / weaken / haste / iron / wisp), Peel (`physical` / barrier / expose / nova / veil), Counter (swap / mark / weaken / sentinel / haste), Hook (frost / `physical` / haste / mark / nova), Gaze (frost / mark / iron / weaken / veil), Rime (frost / slow / barrier / nova / expose).  
**DISCOVERABLE_SPELLS:** #636 `spell-pair-slide` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["slide_porter"]`). Observation = he **casts** the slide (`kind: "cast"`), including a no-pair / blocked-dest fizzle. `CHOIR_SLIDE` (mass pairs / Litter director) is `BOSS_ONLY`. Do **not** grant Pair Hinge, Pawn Trade, Slide Tile, Draw Together, or Court Shove from this fight. Do **not** remap `pair_usher`.

**AI:** Prefer player + living player summon. Skip if Litter was broken this cycle. Skip if dests fail `isCellFree`. Never dest onto spawn / portal / a sealed pocket / lava / spike / rime / wick until MIMA-001 / 005. Last-writer: a pit / pad / Exit Sting on the dest **is legal paint** (Peel card law) — lava is not.  
**ARENA_RULES:** Litter HP = `0.15 * playerMaxHp`. Occupancy dests, **not** `isSwap` / `swapPositions`. Write `forcedMovedThisTurn` on both bodies. Hazard ticks on dest wait on MIMA-001 / 005 — until then, dest onto rime / fuse / lava / wick is **illegal AI**. Exit Sting / Quiet Sill / Fuse on a dest is paint, not a hazard tick. Do not name-check `"Slide"`.  
**SUMMONS:** 1 dire wolf in P2, cap 4. 0 XP. Wolf is not a player-pair partner.  
**PLAYER_COUNTERPLAY:** Bring no summon (he skips); occupy a dest; break the Litter; stay Chebyshev ≥ 2 from every ally; Self Anchor a body that must not move.  
**MASTERY_OBJECTIVE:** Never be one of the two translated bodies (`litter_unmoved`). A skip because you had no pair is the pass. Occupying a dest so *he* fizzles is the pass. Being dest-blocked while the other body would have moved still fails if *you* would have dest’d — whole pair fizzles, so a blocked dest is the pass.  
**REWARDS:** 6 / 4 when shipped. Pair Slide is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Translate **1**. P1 one pair. P2 cap 2 pairs.  
**BALANCE_RISKS:** Slide + Yoke / Counter / Orbit / Hinge / Mill / Ram / Hook / Dowager is two relocate directors — illegal. Slide + Countess / Fosse / Crypt is dest-hazard (MIMA-005 OPEN) — illegal. Slide + Cord is pair-required + summon-gate — illegal. Table P pairs with Peel: Stoup dest **never** occupies the Litter. He slides the pair onto / off an Exit Sting — enter does **not** tick; the *leave* does. Player Pair Slide cannot mass-slide.  
**QA:** Observation counts his cast (including no-pair fizzle). Litter / Wolf 0 XP. Not `swapPositions`. Dest onto hazard is illegal AI until MIMA-001 / 005. Exit Sting leave-tick is paint. Cap 4. `finalizePlayableLayout` after slide.  
**STATUS:** PROPOSED

---

### BOSS_ID: `both_capitular`

**NAME:** The Both Capitular  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A cantor of the shared stride. He does not Gait Mend because *he* walked. Both of you must have spent walk MP.  
**CORE_MECHANIC:** **Heal if caster and target both walked.** Every 3 turns he Both Mends a living extra (range ≤ 3). If **both** he and that extra have `walkMpSpentThisTurn ≥ 1`, heal the extra 8. If either has not walked, 0-heal (AP spent; observation still fires). Distinct from Gait Mend (caster only), Chase Mend (target only), Shove Mend (target force-moved), Heave Mend (both force-moved). The learnable is **one ally, 8 iff both walked**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **gait novice** extra (0.20 * playerMaxHp, empty kit, 0 XP) so a walked target can exist. Mend every 3 turns after he has walked. Kit: Heal / Expose / Barrier. One destructible **Gaiter**; breaking it **skips the next mend**. |
| 2 | ≤ 45% | `CHOIR_BOTH`: if *he* walked, both-mend **every** living extra that also walked (independent flags). Enrage + Archer. Gaiter, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Mend resolves same turn as telegraph. Gaiter, if alive, breaks itself. Overlay +8%. Gate stays both-walked (do not also mend unmoved extras). |

**SPELLS (proposed kit):** `starter-heal`, `spell-expose`, `spell-barrier`, `spell-enrage` (P2), `summon-archer` (P2). Unique vs Infirm (heal / haste / `physical` / iron / wisp), Jostle (heal / weaken / haste / iron / wisp), Split (heal / slow / expose / rally / wisp), Enter (heal / mark / barrier / nova / wisp), Cover (heal / mirror / haste / wisp / rally), Rebound (heal / expose / enrage / veil / wisp), Font (heal / barrier / wisp / iron / shield), Lament (heal / barrier / weaken / enrage / sacrifice).  
**DISCOVERABLE_SPELLS:** #695 `spell-both-mend` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["both_capitular"]`). Observation = he **casts** the mend (`kind: "cast"`), including a 0-heal. `CHOIR_BOTH` (every extra that walked / Gaiter director) is `BOSS_ONLY`. Do **not** grant Gait Mend, Chase Mend, Shove Mend, or Heave Mend from this fight. Do **not** remap `both_cantor`.

**AI:** Walk first when a mend is armed this cycle **and** the novice has already walked (or will walk). Skip if Gaiter was broken this cycle. Skip if he has not walked. Never Both Mend the player (ally-only). Never self-primary if his walk flag is 0. Archer recast only under cap.  
**ARENA_RULES:** Gaiter HP = `0.15 * playerMaxHp`. Force-move does **not** arm the walk flag. A successful heal (HP actually increased) flips `challengeHealUsedRef` on player-side only — his extra heal is not the player’s challenge. Do not name-check `"Both"`.  
**SUMMONS:** 1 gait novice from pull (0 XP, not a victory target) + 1 archer in P2. Cap 4. Novice death ≠ victory. The novice is the intended mend target.  
**PLAYER_COUNTERPLAY:** Keep the novice unmoved (occupy so they cannot walk, or kill them before the glow); break the Gaiter; Root / Gait Seal so *he* cannot walk; Cursed Wound halves the 8.  
**MASTERY_OBJECTIVE:** He never successfully heals 8 (`gaiter_unspent`). A 0-heal / Gaiter skip / no-extra fizzle is the pass. A P2 choir mend that pays 8 to **any** extra fails it.  
**REWARDS:** 5 / 3 when shipped. Both Mend is the prize (first grant wins if `both_cantor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Heal is **8**, not a percent. Body count **fixed**.  
**BALANCE_RISKS:** Both + Infirm / Jostle is two walk-heal directors — illegal. Both + March / Sole / Wick / Must / Stride is two walk-MP directors — illegal. Table P pairs with Static: shock dest **never** occupies the Gaiter. You must walk to take 8 *and* answer the shock graph — standing still denies the heal. Heave / Shove / Pair Slide do **not** arm Both Mend (forced-move ≠ walk MP) — do not pair as a false answer. Player Both Mend cannot target hostiles.  
**QA:** Observation counts his mend, including 0-heal. Gaiter / novice / Archer 0 XP. Player is never the target. Forced-move does not arm. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `heave_kitchener`

**NAME:** The Heave Kitchener  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A cook of the spit. Two bodies accept a shove, then 8. He does not Shove Mend the extra alone.  
**CORE_MECHANIC:** **Heal if caster and target were both force-moved.** Every 3 turns he Heave Mends a living extra (range ≤ 3). If **both** he and that extra have `forcedMovedThisTurn`, heal the extra 8. If either only walked, 0-heal (AP spent; observation still fires). Distinct from Shove Mend (target only), Both Mend (both walked). The learnable is **one ally, 8 iff both force-moved**. P2 `NAVE_HEAVE` occupancy-translates **himself** 1 toward the extra **and** the extra 1 toward him (both dests `isCellFree`), writes both flags, then mends — that double-slide is `BOSS_ONLY`.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | One **spit boy** extra (0.20 * playerMaxHp, empty kit, 0 XP). Mend every 3 turns **only if** both flags are already true (player / mill / ram shoved them). Kit: Heal / Slow / Mark. One destructible **Spit**; breaking it **skips the next mend** (and the P2 translate). |
| 2 | ≤ 40% | `NAVE_HEAVE`: occupancy-translate himself 1 toward the extra **and** the extra 1 toward him, then Heave Mend if both dests landed. Iron Skin + Bomber. Spit, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Translate + mend resolve same turn as telegraph. Spit, if alive, breaks itself. Overlay +8%. Gate stays both-forced (do not also mend unmoved extras). |

**SPELLS (proposed kit):** `starter-heal`, `spell-slow`, `spell-mark`, `spell-iron-skin` (P2), `summon-bomber` (P2). Unique vs Salve (heal / mark / slow / barrier / wisp), Enter (heal / mark / barrier / nova / wisp), Jostle (heal / weaken / haste / iron / wisp), Infirm (heal / haste / `physical` / iron / wisp), Plate (shield / iron / slow / heal / sentinel), Mill (`physical` / slow / barrier / expose / nova).  
**DISCOVERABLE_SPELLS:** #726 `spell-heave-mend` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["heave_kitchener"]`). Observation = he **casts** the mend (`kind: "cast"`), including a 0-heal. The P2 translate is not a second observe. `NAVE_HEAVE` (self+extra translate / Spit director) is `BOSS_ONLY`. Do **not** grant Shove Mend, Both Mend, Heave Step, Pair Pace, or Pair Slide from this fight. Do **not** remap `heave_cantor`.

**AI:** P1 skip unless both flags are true **and** Spit is up. P2 skip the translate if either dest fails `isCellFree` (then skip the mend). Never Heave Mend the player. Bomber recast only under cap. Never dest onto spawn / portal / lava / spike / rime / wick until MIMA-001 / 005.  
**ARENA_RULES:** Spit HP = `0.15 * playerMaxHp`. Walk does **not** arm `forcedMovedThisTurn`. P2 translate writes the flag on **both** bodies (occupancy, not `isSwap`). Player-side HP actually increased → `challengeHealUsedRef` only when the *player* owns Heave Mend, not when he heals his extra. Do not name-check `"Heave"`.  
**SUMMONS:** 1 spit boy from pull (0 XP, not a victory target) + 1 bomber in P2. Cap 4. Spit-boy death ≠ victory.  
**PLAYER_COUNTERPLAY:** Do not shove; occupy a P2 dest; break the Spit; isolate so there is no extra; Root before the relocate. On Table P2, stepping off mill cells denies *your* flag — it does not deny *his* P2 translate.  
**MASTERY_OBJECTIVE:** He never successfully heals 8 (`spit_unturned`). A 0-heal / Spit skip / blocked P2 dest is the pass. A P2 nave mend that pays 8 fails it.  
**REWARDS:** 6 / 4 when shipped. Heave Mend is the prize (first grant wins if `heave_cantor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Heal is **8**. P2 translate is **1**.  
**BALANCE_RISKS:** Heave + Jostle is two force-heal directors — illegal. Heave + Yoke / Counter / Orbit / Hinge / Ram / Hook / Dowager / Slide is two relocate directors — illegal (Mill is the **exception**: mill cells *supply* the P1 flags, which is Table P2’s question). Heave + Countess / Fosse / Crypt is dest-hazard — illegal. Table P pairs with Mill: Hopper dest **never** occupies the Spit. You ride the mill so both flags arm, or you step off and deny P1. Player Heave Mend cannot include the P2 double-slide.  
**QA:** Observation counts his mend, including 0-heal. Spit / spit-boy / Bomber 0 XP. P2 translate is not `swapPositions`. Dest onto hazard is illegal AI until MIMA-001 / 005. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `parched_preacher`

**NAME:** The Parched Preacher  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A preacher of the emptied gait. Both leftover walk pools at 0, then 8. Not Dry Mend (leftover AP).  
**CORE_MECHANIC:** **Heal if caster and target both have leftover MP = 0.** Every 3 turns he Parched Mends a living extra (range ≤ 3). If **both** leftover walk MP **= 0** at resolve (after his 3 AP is paid), heal the extra 8. If either leftover MP ≥ 1, 0-heal (AP spent; observation still fires). Distinct from Dry Mend (leftover AP), Still Mend (caster spent 0 walk MP), Dry Sting (leftover-AP damage bonus), Both Mend (both walked). The learnable is **one ally, 8 iff both leftover MP = 0**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One **flagon novice** extra (0.20 * playerMaxHp, empty kit, `mp: 2`, 0 XP). Mend every 3 turns after *he* sits at leftover MP 0 (he dumps walk, or camps at 0). Kit: Heal / Drain Courage / Haste. One destructible **Flagon**; breaking it **skips the next mend**. |
| 2 | ≤ 45% | `CHOIR_PARCHED`: if *his* leftover MP is 0, parched-mend **every** living extra at leftover MP 0. Frost Nova + Shadow Veil. Flagon, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Mend resolves same turn as telegraph. Flagon, if alive, breaks itself. Overlay +8%. Gate stays leftover-MP 0 (do not also mend extras that banked 1 MP). |

**SPELLS (proposed kit):** `starter-heal`, `spell-drain-courage`, `spell-haste`, `spell-frost-nova` (P2), `spell-shadow-veil` (P2). Unique vs Dry (drain-courage / frost / weaken / inferno / bomber), Cover (heal / mirror / haste / wisp / rally), Morrow (swap / haste / drain / mirror / wolf), Lend (haste / drain / rally / wisp / sacrifice), Boot (haste / drain / expose / blast / sentinel), Font (heal / barrier / wisp / iron / shield), Infirm (heal / haste / `physical` / iron / wisp).  
**DISCOVERABLE_SPELLS:** #787 `spell-parched-mend` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` / `ENEMY_DISCOVERY` door: add `bossIds: ["parched_preacher"]`). Observation = he **casts** the mend (`kind: "cast"`), including a 0-heal. `CHOIR_PARCHED` (every extra at leftover MP 0 / Flagon director) is `BOSS_ONLY`. Do **not** grant Dry Mend, Still Mend, Dry Sting, Dry Gait (#802), or Both Mend from this fight. Do **not** remap `parched_cantor`. First grant of leftover-MP=0 heal wins between Parched Mend and Dry Gait — do not teach both.

**AI:** Dump leftover MP (walk or sit at 0) before the mend. Skip if Flagon was broken this cycle. Skip if his leftover MP ≥ 1. Skip extras with leftover MP ≥ 1. Never Parched Mend the player. Never dump leftover MP **only** to enable this if a Strike would kill.  
**ARENA_RULES:** Flagon HP = `0.15 * playerMaxHp`. Leftover **AP** does not substitute. Dual Keep / Stride Keep **blocks** this until they spend the bank. `healAmount` on the row stays 0 so `inferArchetype` does not treat a kit that only *carries* this id as healer unless HP actually increased. Do not name-check `"Parched"`.  
**SUMMONS:** 1 flagon novice from pull (0 XP, not a victory target). Cap 4. Novice death ≠ victory.  
**PLAYER_COUNTERPLAY:** Keep 1 leftover MP on the novice (or on *him*, if you can Gift Sill / Spare Pace — those are not this kit); break the Flagon; Cursed Wound; kill the novice first.  
**MASTERY_OBJECTIVE:** He never successfully heals 8 (`flagon_wet`). A 0-heal / Flagon skip / leftover-MP ≥ 1 skip is the pass. A P2 choir mend that pays 8 to **any** extra fails it.  
**REWARDS:** 5 / 3 when shipped. Parched Mend is the prize (first grant wins if `parched_cantor` already taught it, or if Dry Gait (#802 / #1063) already occupies leftover-MP=0 heal).  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Heal is **8**. Leftover check is **= 0**, not a percent.  
**BALANCE_RISKS:** Parched + Dry is leftover-MP heal vs leftover-AP sting — **legal**, that is Table P3. Parched + Surplus / Purse / Lend is two leftover-economy directors — illegal. Parched + Both / Infirm is leftover-0 vs must-walk heal — illegal (dumping MP to 0 can still have walked). Table P pairs with Dry: Cruet dest **never** occupies the Flagon. Empty the AP bar *or* keep 1 MP — you cannot answer both bonuses / heals by camping. Player Parched Mend cannot target hostiles. Do not clone Dry Mend (#747) or Dry Gait (#802) into this kit.  
**QA:** Observation counts his mend, including 0-heal. Flagon / novice 0 XP. Leftover AP does not arm. Cap 4.  
**STATUS:** PROPOSED

---

## 8.17 Encounter sheets — Wave 19 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 18: **carry leftover walk MP to next turn start** (Purse Keep = leftover *AP* cap 3; Dual Keep = *both* currencies; Haste / Second Wind = *grant now*; Timestep = full *now*; Pack Stride = pack *siphon*; Stride Keep snapshots leftover **walk MP** cap 2 at **end of this turn**, pays at **next own turn start**, once/battle — not a queue splice; leftover 0 still spends the once/battle for 0), **carry leftover AP and leftover MP on one id** (Purse Keep = *AP only*; Stride Keep = *MP only*; Dual Keep snapshots leftover AP cap 2 **and** leftover MP cap 2, pays both at next start, once/battle), **copy remaining CDs from target onto the caster** (Cadence Theft = *steal*; Cadence Halve = *÷2* on the hostile; Cadence Trim = *−1*; Cadence Stretch = *×2*; Cadence Flush = *zeros ally*; Cadence Imprint writes caster remaining = `max(caster, n)` for **shared ids only** — target keeps every lock; ids the caster does not own are ignored; empty intersection = fizzle, AP spent), **bonus if leftover walk MP ≥ 2** (Dry Sting = leftover *AP = 0*; Ready Sting = leftover AP *and* MP ≥ 1; Lean Sting = leftover AP = 0 *and* MP ≥ 1; Damp Sting deals 8 then +10 iff leftover **walk MP ≥ 2** at resolve).

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-19 learnables reuse leftover **#695** Stride Keep / Damp Sting **and** leftover **#726** Dual Keep / leftover **#787** Cadence Imprint. No new #137 spell ids. No remaining #636 (`spell-quad-span` / `spell-court-stretch`) / remaining #695 (except these two) / remaining #726 (except Dual Keep) / remaining #787 (except Cadence Imprint) / #849 / #1063 extra doors. Court Hinge stays closed. Court Stretch stays closed. Court Keep / Court Dual / Court Imprint stay closed. Quad Span / Penta Span / Sept Span / Six Span stay off until occupy-weight exists.

They stay out of rooms 0–9, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, Table O, and Table P. Pairing is **Table Q** only (§10.16).

**Stub note:** Stride Keep’s stub is `stride_bursar` — **not** remapped to `stride_chancellor`. Dual Keep’s stub is `dual_bursar` — **not** remapped to `dual_treasurer`. Cadence Imprint’s stub is `imprint_precentor` — **not** remapped to `imprint_archdeacon`. Damp Sting has **no** #695 stub. Do **not** remap `keep_bursar` / `court_keep_regent` / `court_dual_regent` / `court_imprint_regent` / `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `shove_cantor` / `span_quad` / `court_stretch_regent`. First grant wins if a stub ships.

---

### BOSS_ID: `stride_chancellor`

**NAME:** The Stride Chancellor  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A chancellor of unspent steps. He does not Purse Keep leftover AP. He banks the walk he refused to take.  
**CORE_MECHANIC:** **Carry leftover walk MP to next turn start.** Every 3 turns he Stride Keeps (self). At **end of this turn** snapshot `min(current leftover MP, 2)` and add that amount to current MP at **his next turn start** (capped at max 20). Once/battle: a second Keep this fight fizzles (AP spent; observation still fires). Distinct from Purse Keep (leftover **AP**), Dual Keep (**both** currencies), Haste (grant **now**). The learnable is **self, leftover MP cap 2, next-start pay**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Keep every 3 turns if leftover MP ≥ 1 **or** the once/battle is still free (0-bank still observes). Kit: Slow / Frost / Iron Skin. One destructible **Scrip**; breaking it **skips the next keep**. One **tempo novice** extra (0.20 * playerMaxHp, empty kit, 0 XP) so Table Q can tax *his* banked kite without a second leftover-economy director. |
| 2 | ≤ 40% | `NAVE_STRIDE`: keep himself **and** every living extra with leftover MP ≥ 1 (independent snapshots; extras are **not** once/battle — CD 4 is the lid). Haste + Wisp. Scrip, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Keep resolves same turn as telegraph. Scrip, if alive, breaks itself. Overlay +8%. Pay stays **next own turn start** (do not splice the queue). |

**SPELLS (proposed kit):** `spell-slow`, `starter-frost`, `spell-iron-skin`, `spell-haste` (P2), `summon-wisp` (P2). Unique vs Stride Censor (slow / haste / weaken / drain / iron), Must (haste / slow / barrier / expose / wolf), Pendulum (`physical` / slow / haste / nova / iron), Lock (`physical` / slow / mark / iron / nova), Mill (`physical` / slow / barrier / expose / nova), Purse (timestep / drain / barrier / inferno / sentinel), Dual (blast / slow / barrier / enrage / sentinel).  
**DISCOVERABLE_SPELLS:** #695 `spell-stride-keep` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["stride_chancellor"]`). Observation = he **casts** the keep (`kind: "cast"`), including a 0-bank / once-spent fizzle. `NAVE_STRIDE` (extras / Scrip director) is `BOSS_ONLY`. Do **not** grant Purse Keep, Dual Keep, Haste-as-grant, Timestep, or Pack Stride from this fight. Do **not** remap `stride_bursar` / `keep_bursar`. Court Keep stays `NOT_PLAYER_LEARNABLE`.

**AI:** Keep when leftover MP ≥ 1 and the once/battle is free. Skip if Scrip was broken this cycle. Skip if leftover MP is 0 **and** he still needs a 2-MP leave this turn. Never Keep as the last action if a hazard tick is armed on his tile. Wisp recast only under cap.  
**ARENA_RULES:** Scrip HP = `0.15 * playerMaxHp`. Snapshot is **end of this turn**, not at cast (he can still spend after arming). Pay is **next own turn start**, not a queue splice, not mid-RAF. Once/battle is a battle flag, not a remaining CD. Do not name-check `"Stride"`.  
**SUMMONS:** 1 tempo novice from pull + 1 wisp in P2, cap 4. 0 XP. Novice death ≠ victory.  
**PLAYER_COUNTERPLAY:** Force a spend before end of turn (Slow / Must Pace / Hex); break the Scrip; kill before next start; Damp Sting while he is holding ≥ 2.  
**MASTERY_OBJECTIVE:** He never successfully banks leftover MP ≥ 1 (`scrip_spent`). A 0-bank / Scrip skip / once-spent fizzle is the pass. A P2 nave keep that pays ≥ 1 to **any** extra fails it.  
**REWARDS:** 6 / 4 when shipped. Stride Keep is the prize (first grant wins if `stride_bursar` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Cap **2**. Pay is next start, not a percent of player HP.  
**BALANCE_RISKS:** Stride + Purse / Dual / Surplus / Lend / Parched is two leftover-economy directors — illegal. Stride + Stride Censor / March / Sole / Wick / Must is two walk-MP directors — illegal. Table Q pairs with Lock: Compass dest **never** occupies the Scrip. Off-axis walk rejects **before** MP debit so leftover is honest. Player Stride Keep cannot mass-keep extras.  
**QA:** Observation counts his cast (including 0-bank). Scrip / novice / wisp 0 XP. Not a queue splice. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `dual_treasurer`

**NAME:** The Dual Treasurer  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A treasurer of both purses. He will not bank AP unless he also banks the walk.  
**CORE_MECHANIC:** **Carry leftover AP and leftover MP on one id.** Every 3 turns he Dual Keeps (self). At **end of this turn** snapshot leftover current AP (cap 2) **and** leftover current walk MP (cap 2). At **his next turn start**, add those snapshots (each still capped at max). Once/battle: a second Dual Keep this fight fizzles (AP spent). Distinct from Purse Keep (**AP only**), Stride Keep (**MP only**). The learnable is **self, both currencies, next-start pay**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Dual Keep every 3 turns if leftover AP ≥ 1 **and** leftover MP ≥ 1 (else skip; 0 on one currency is a skip, not a fizzle). Kit: Blast / Slow / Barrier. One destructible **Bourse**; breaking it **skips the next dual**. One **ledger novice** extra (0.20 * playerMaxHp, empty kit, 0 XP). |
| 2 | ≤ 45% | `NAVE_DUAL`: dual-keep **every** living extra with leftover AP ≥ 1 **and** leftover MP ≥ 1 (independent snapshots; extras are **not** once/battle). Enrage + Sentinel. Bourse, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 21 | Dual resolves same turn as telegraph. Bourse, if alive, breaks itself. Overlay +8%. Pay stays **next own turn start**. Skip still requires **both** leftovers ≥ 1 (do not Dual Keep AP-only). |

**SPELLS (proposed kit):** `starter-blast`, `spell-slow`, `spell-barrier`, `spell-enrage` (P2), `summon-sentinel` (P2). Unique vs Purse (timestep / drain / barrier / inferno / sentinel), Stride Chancellor (slow / frost / iron / haste / wisp), Mill (`physical` / slow / barrier / expose / nova), Must (haste / slow / barrier / expose / wolf), Quiet (frost / barrier / slow / inferno / mark), Static (blast / haste / nova / expose), Surplus (drain / mark / haste / mirror / barrier).  
**DISCOVERABLE_SPELLS:** #726 `spell-dual-keep` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["dual_treasurer"]`). Observation = he **casts** the dual (`kind: "cast"`), including a once-spent fizzle. A skip because either leftover is 0 is **not** a cast. `NAVE_DUAL` (extras / Bourse director) is `BOSS_ONLY`. Do **not** grant Purse Keep, Stride Keep, Timestep, or Leftover Lend from this fight. Do **not** remap `dual_bursar` / `keep_bursar` / `stride_bursar`. Court Dual stays `NOT_PLAYER_LEARNABLE`.

**AI:** Dual Keep only if leftover AP ≥ 1 **and** leftover MP ≥ 1 and the once/battle is free. Skip if Bourse was broken this cycle. Never Dual Keep as the last action if they still need a 2-AP tool **this** turn. Sentinel recast only under cap.  
**ARENA_RULES:** Bourse HP = `0.15 * playerMaxHp`. Snapshot is end of this turn. Pay is next own turn start. Once/battle is a battle flag. Ready Sting still reads **this** turn’s leftover (a Dual Keep that has not yet paid does not itself create leftover). Do not name-check `"Dual"`.  
**SUMMONS:** 1 ledger novice from pull + 1 sentinel in P2, cap 4. 0 XP. Novice death ≠ victory.  
**PLAYER_COUNTERPLAY:** Empty **one** currency before end of turn (Hex Toll the next cast, or walk the leftover MP); break the Bourse; kill before next start.  
**MASTERY_OBJECTIVE:** He never successfully banks **both** leftovers ≥ 1 (`bourse_spent`). A skip / Bourse skip / once-spent fizzle is the pass. A P2 nave dual that pays ≥ 1 AP **and** ≥ 1 MP to **any** extra fails it.  
**REWARDS:** 6 / 4 when shipped. Dual Keep is the prize (first grant wins if `dual_bursar` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25. Caps **2 / 2**. Not a grant.  
**BALANCE_RISKS:** Dual + Purse / Stride / Surplus / Lend / Parched is two leftover-economy directors — illegal. Table Q pairs with Levy: Tithe-box dest **never** occupies the Bourse. Hex Toll taxes the **next spell**, not leftover — you cannot empty AP *into* Dual and also dodge the tax with the same spend. Player Dual Keep cannot mass-keep extras.  
**QA:** Observation counts his cast, not a leftover-0 skip. Bourse / novice / sentinel 0 XP. Not a queue splice. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `imprint_archdeacon`

**NAME:** The Imprint Archdeacon  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A tempo archdeacon who copies your downtime. He does not steal the lock. He writes it onto himself.  
**CORE_MECHANIC:** **Copy remaining CDs from target onto the caster.** Every 3 turns he Cadence Imprints (range ≤ 3, LoS). For each spell id in the **target’s** remaining-CD map with `n > 0`, if **he** also owns that id, write his remaining = `max(his remaining, n)`. Target **keeps** every lock. Ids he does not own are ignored. Empty intersection = fizzle (AP spent; observation still fires). Distinct from Cadence Theft (target *loses* the lock), Halve / Trim / Stretch (rewrite *their* remaining), Flush (zeros *ally*). The learnable is **one enemy, copy matching remaining, target keeps**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Imprint every 3 turns if a shared remaining ≥ 2 exists (prefer the player). Kit: Poison / Mirror / Expose. One destructible **Platen**; breaking it **skips the next imprint**. One **scribe extra** (0.20 * playerMaxHp, kit-empty except a copied id is **not** granted to them in P1). |
| 2 | ≤ 40% | `CHOIR_IMPRINT`: copy matching remaining from the player onto **every** living extra that owns the same id (independent maps; extras start with **no** catalog overlap — P2 `spell-sacrifice` / Wisp is the overlap bait). Sacrifice + Wisp. Platen, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 20 | Imprint resolves same turn as telegraph. Platen, if alive, breaks itself. Overlay +8%. Empty intersection still fizzles (do not invent ids). |

**SPELLS (proposed kit):** `starter-poison`, `spell-mirror`, `spell-expose`, `spell-sacrifice` (P2), `summon-wisp` (P2). Unique vs Archbishop (cursed / veil / sacrifice / wisp), Mute (veil / drain / blast / sacrifice / bomber), Dilate (slow / mirror / mark / enrage / bomber), Flush (haste / rally / weaken / mirror / sentinel), Levy (drain / expose / poison / cursed / barrier), Wick Exorcist (poison / mark / weaken / frost / archer).  
**DISCOVERABLE_SPELLS:** #787 `spell-cadence-imprint` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["imprint_archdeacon"]`). Observation = he **casts** the imprint (`kind: "cast"`), including an empty-intersection fizzle. `CHOIR_IMPRINT` (extras / Platen director) is `BOSS_ONLY`. Do **not** grant Cadence Theft, Halve, Trim, Stretch, Flush, or Last Mute from this fight. Do **not** remap `imprint_precentor` / `trim_precentor`. Court Imprint stays `NOT_PLAYER_LEARNABLE`.

**AI:** Imprint if the player has a matching remaining ≥ 2 (Poison in P1; Sacrifice in P2). Skip if Platen was broken this cycle. Skip if no shared remaining ≥ 2. Never Imprint an extra as primary in P1 (player-only). Wisp recast only under cap.  
**ARENA_RULES:** Platen HP = `0.15 * playerMaxHp`. Once/battle flags and spell levels are **not** CDs. Preview must show which of **his** locks change. Do not name-check `"Imprint"`.  
**SUMMONS:** 1 scribe extra from pull + 1 wisp in P2, cap 4. 0 XP. Extra death ≠ victory.  
**PLAYER_COUNTERPLAY:** Recast the locked id **before** Imprint; Cadence Crack / wait the CD to 0; break the Platen; do not hold Inferno 3 against a tempo bishop if you also own it.  
**MASTERY_OBJECTIVE:** He never copies a remaining ≥ 1 onto himself or an extra (`platen_unprinted`). An empty-intersection fizzle / Platen skip is the pass. A P2 choir copy that writes ≥ 1 onto **any** extra fails it.  
**REWARDS:** 6 / 4 when shipped. Cadence Imprint is the prize (first grant wins if `imprint_precentor` already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.20. Copy is id-match, not a percent.  
**BALANCE_RISKS:** Imprint + Dilate / Flush is two remaining-CD directors — illegal. Table Q pairs with Mute: Tabula dest **never** occupies the Platen. Last Mute is last-id illegal, **not** remaining CD — you can answer one without answering the other. Player Imprint cannot copy ids they do not own.  
**QA:** Observation counts his cast (including empty fizzle). Platen / extra / wisp 0 XP. Target keeps remaining. Cap 4.  
**STATUS:** PROPOSED

---

### BOSS_ID: `damp_provost`

**NAME:** The Damp Provost  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A provost of hoarded gait. He does not Dry Sting an empty AP bar. He taxes the walk you saved.  
**CORE_MECHANIC:** **Bonus if leftover walk MP ≥ 2.** Every 2 turns he Damp Stings (range ≤ 3, LoS). Deal 8. Then if the target’s **current leftover MP ≥ 2**, deal 10 as a second existing `dealDamage` call (two hits, two Mark chances if the tile is marked). Distinct from Dry Sting (leftover **AP = 0**), Ready Sting (leftover AP **and** MP ≥ 1), Lean Sting (leftover AP = 0 **and** MP ≥ 1). The learnable is **one enemy, 8 then +10 iff leftover walk MP ≥ 2**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Damp every 2 turns. Kit: Strike / Poison / Haste. One destructible **Sump**; breaking it **skips the next sting**. |
| 2 | ≤ 45% | `CHOIR_DAMP`: damp-sting **every** player-side body at leftover MP ≥ 2 (independent leftover reads; bodies under 2 eat **only** the 8 if they were a legal primary — choir does **not** 8-tap leftover-1 bodies). Cursed Wound + Archer. Sump, if down, may rebuild once (4-turn cadence). |
| Enrage | turn 19 | Sting resolves same turn as telegraph. Sump, if alive, breaks itself. Overlay +8%. Choir still requires leftover MP ≥ 2 for the +10 (do not also tax leftover 0). |

**SPELLS (proposed kit):** `physical_attack`, `starter-poison`, `spell-haste`, `spell-cursed-wound` (P2), `summon-archer` (P2). Unique vs Bone (`physical` / haste / enrage / expose), Levy (drain / expose / poison / cursed / barrier), Wick Exorcist (poison / mark / weaken / frost / archer), Peel (`physical` / barrier / expose / nova / veil), Fetid (venom / poison / cursed / lifesteal), Dry (drain / frost / weaken / inferno / bomber).  
**DISCOVERABLE_SPELLS:** #695 `spell-damp-sting` (`PLAYER_LEARNABLE` / extra `ENEMY_DISCOVERY` door: add `bossIds: ["damp_provost"]`). Observation = he **casts** the sting (`kind: "cast"`), including an 8-only (no bonus). `CHOIR_DAMP` (every leftover-MP≥2 body / Sump director) is `BOSS_ONLY`. Do **not** grant Dry Sting, Ready Sting, Lean Sting, or Dry Gait from this fight. Damp Sting has **no** #695 stub.

**AI:** Prefer the player. Cast for 8 even if leftover MP < 2 when Strike is out of range. Skip if Sump was broken this cycle. If leftover MP < 2 **and** Strike is in kit at range 1, skip the sting and Strike. Archer recast only under cap.  
**ARENA_RULES:** Sump HP = `0.15 * playerMaxHp`. Leftover is **current MP at resolve**, not “max − spent”. Both hits are spell-hits (`recordChallengeDamageTaken`). Leftover **AP** does not substitute. Do not name-check `"Damp"`.  
**SUMMONS:** 1 archer in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Spend down to 0–1 leftover MP before the sting; sit at 0; Slow so leftover is already 0; break the Sump.  
**MASTERY_OBJECTIVE:** He never lands the leftover-MP ≥ 2 bonus (`sump_dry`). An 8-only sting / Sump skip is the pass. A P2 choir +10 on **any** player-side body fails it.  
**REWARDS:** 5 / 3 when shipped. Damp Sting is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20. Bonus is **10**, not a percent.  
**BALANCE_RISKS:** Damp + Stride / Dual is leftover-MP bank then leftover-MP tax — two leftover-MP directors — illegal as a rush pair (the exam is Table Q3 with Hex, not with Chancellor). Damp + Dry is two leftover-currency stings — held (P3 already owns Dry). Damp + Parched is leftover-MP ≥ 2 poke vs leftover-MP = 0 heal — illegal. Table Q pairs with Hexed: Hex dest **never** occupies the Sump. Leaving the Hex is the spend that can deny the +10. Player Damp Sting cannot choir-tax.  
**QA:** Observation counts his sting, including 8-only. Sump / archer 0 XP. Leftover AP does not arm the bonus. Cap 4.  
**STATUS:** PROPOSED

---
## 9. Roster map

| Id | Diff | Core | Learnable? | Rush room (live) |
| :--- | ---: | :--- | :--- | :--- |
| `pale_archbishop` | 4 | Reliquary + curse | — | 0 |
| `crimson_countess` | 4 | Lava river | Ember Step | 1 |
| `void_grandmaster` | 7 | Illusions | — | 4 |
| `bone_cavalier` | 5 | Knight landings | Vault, Caltrop | 2 |
| `weeping_pawn` | 5 | Wail mark → promote | Mute Thread (#411) | 0 |
| `starborn_queen` | 7 | Lines + void + vuln window | Cut In (#342) | 3 |
| `fetid_rook` | 5 | Rot + split | Rot Brand | 1 |
| `eternal_pawn_king` | 6 | Advance + stones | Queue Cut (#411) | 6 |
| `midnight_bishop` | 7 | Twin flank → merge | Life Tether (#133) | 7 |
| `broodmother_rook` | 6 | Larvae / shell | Brood Ward | 8 |
| `lord_of_static` | 6 | Shock graph | Shock Glyph; Draw Together MULTI (#342) | 2 |
| `final_pawn` | 10 | 3-turn invuln + 4 ghosts | — (Eclipse Fold witness only, #342) | 6 |
| `alabaster_fortress` | 7 | Resonance + shrink | Aftershock, Pain Link (#120) | 8 |
| `chessboard_lich` | 8 | Rotate / invert / claim | — | 5 |
| `mirror_sovereign` | 8 | Mirror + replay | Echo Cast | 4 |
| `starved_vampire_pawn` | 3 | Capped drain | Exsanguinate; Sanguine Toll (#342) | 9 |
| `pale_archivist` | 8 | Glyphs / pages | Glyph Snare; After Verse (#342) | 5 |
| `twin_monarchs` | 9 | Dual kill window | — | 7 |
| `enthroned_void` | 9 | 8 anchors | File Vault MULTI (#411) | 3 |
| `cinder_lance` | 6 | Elemental lance | File Lance (#133) | — (Wave 2) |
| `hexed_marker` | 5 | Hex movement | — | — (Wave 2) |
| `unbound_pendulum` | 8 | Metronome clock | — | — (Wave 2) |
| `silent_conductor` | 7 | Silence lanes | — | — (Wave 2) |
| `second_lament` | 4 | Grief Well siphon | — | **9** (remap `weeping_pawn_2`) |
| `hook_regent` | 6 | Linear hook + winch | Hook Line (#120) | — (Wave 3) |
| `ivory_palisade` | 7 | Stakes / LOS cover | Stone Turret (#120) | — (Wave 3) |
| `cord_familiar` | 5 | Player-summon gate | — | — (Wave 3 / Table D) |
| `rime_margrave` | 6 | Ice file slide | Rime Tile (#133) | — (Wave 4 / Table B) |
| `wick_prelate` | 7 | Delayed fuse pattern | Fuse Tile (#133) | — (Wave 4 / Table B) |
| `goad_pretender` | 5 | Crown taunt + decoy | Goad (#133) | — (Wave 4 / Table B) |
| `sinkhole_dowager` | 8 | Pull toward a well tile | Sinkhole (#133) | — (Wave 4) |
| `ram_castellan` | 6 | File ram + wall-slam | Shoulder Bash (#120) | — (Wave 5 / Table C) |
| `fosse_warden` | 7 | Open pits / causeway | Open Pit (#282) | — (Wave 5 / Table C) |
| `stride_censor` | 5 | Walk-MP tithe | Stride Brand (#282) | — (Wave 5 / Table C) |
| `morrow_herald` | 8 | Delayed painted blink | Morrow Step (#342) | — (Wave 5 / Table C) |
| `lock_marshal` | 6 | Walk-axis curfew | Rank Lock (#282) | — (Wave 6 / Table D) |
| `bait_vicar` | 5 | Bait intercept pylon | Bait Pylon (#342) | — (Wave 6 / Table D) |
| `font_abbess` | 7 | Stationary heal font | Mercy Font (#282) | — (Wave 6 / Table D) |
| `surplus_auditor` | 8 | Leftover-AP evade | Surplus Ward (#342) | — (Wave 6 / Table D) |
| `mill_seneschal` | 6 | Conveyor enter-slide | Slide Tile (#282) | — (Wave 7 / Table E) |
| `counter_chaplain` | 5 | Two-hostile swap | Pawn Trade (#282) | — (Wave 7 / Table E) |
| `wedge_prior` | 7 | Facing 90° cone | Fan Bolt (#282) | — (Wave 7 / Table E) |
| `levy_rector` | 6 | Next-cast AP tax | Hex Toll (#282) | — (Wave 7 / Table E) |
| `gaze_beadle` | 6 | Facing lock | Facing Pin (#411) | — (Wave 8 / Table F) |
| `span_chamberlain` | 6 | Two-cell occupy | Span Guard (#411) | — (Wave 8 / Table F) |
| `cover_hospitaller` | 5 | Hit redirect to ally | Cover Step (#411) | — (Wave 8 / Table F) |
| `lintel_sacrist` | 7 | HP%-gated walk | Low Lintel (#411) | — (Wave 8 / Table F) |
| `toll_ostiary` | 6 | Walk-exit AP tax | Exit Tithe (#463) | — (Wave 9 / Table G) |
| `hinge_precentor` | 6 | Enter-swap with painter | Hinge Tile (#463) | — (Wave 9 / Table G) |
| `veil_verger` | 5 | Primary-target reject | Aim Veil (#463) | — (Wave 9 / Table G) |
| `oath_dean` | 7 | Strike-only brand | Oath Blade (#463) | — (Wave 9 / Table G) |
| `crypt_sexton` | 7 | Delayed occupancy pit | Pit Wick (#525) | — (Wave 10 / Table H) |
| `march_prefect` | 6 | Must-walk before next spell | Must Pace (#525) | — (Wave 10 / Table H) |
| `aisle_canon` | 6 | Three-post occupy chain | Triple Span (#525) | — (Wave 10 / Table H) |
| `orbit_succentor` | 6 | Pivot target 90° | Pivot Foe (#525) | — (Wave 10 / Table H) |
| `sole_thurifer` | 6 | Walk-MP forbid | Gait Seal (#563) | — (Wave 11 / Table I) |
| `bias_prebendary` | 6 | Diagonal-only walks | Diag Lock (#563) | — (Wave 11 / Table I) |
| `brick_cellarer` | 7 | Move existing barrier 1 | Brick Shift (#563) | — (Wave 11 / Table I) |
| `rebound_almoner` | 5 | Next hit 0, half poke | Return Sting (#563) | — (Wave 11 / Table I) |
| `infirm_chanter` | 5 | Heal iff caster walked | Gait Mend (#563) | — (Wave 12 / Table J) |
| `yoke_subchanter` | 7 | Pair-hinge two hostiles | Pair Hinge (#563) | — (Wave 12 / Table J) |
| `salve_wicker` | 6 | Delayed tile heal | Mend Wick (#563) | — (Wave 12 / Table J) |
| `brand_curate` | 6 | Unit next-hit ×1.5 | Body Mark (#563) | — (Wave 12 / Table J) |
| `flush_psalmist` | 6 | Ally all-CD flush | Cadence Flush (#563) | — (Wave 13 / Table K) |
| `lone_lector` | 5 | Isolated-target bonus | Lone Sting (#563) | — (Wave 13 / Table K) |
| `plate_bursar` | 6 | Delayed next-turn absorb | Morrow Plate (#563) | — (Wave 13 / Table K) |
| `lend_proctor` | 5 | Dump leftover AP to ally | Leftover Lend (#563) | — (Wave 13 / Table K) |
| `effigy_clerk` | 6 | 1-HP empty-kit taunt post | Dummy Post (#563) | — (Wave 14 / Table L) |
| `enter_deacon` | 5 | First-enter heal pad | Enter Mend (#563) | — (Wave 14 / Table L) |
| `split_acolyte` | 5 | Split heal with adjacent ally | Split Mend (#563) | — (Wave 14 / Table L) |
| `quiet_chorister` | 6 | Tile forbids Strike | Quiet Sill (#636) | — (Wave 14 / Table L) |
| `jostle_subdeacon` | 5 | Heal if target was force-moved | Shove Mend (#636) | — (Wave 15 / Table M) |
| `peel_friar` | 6 | First leave deals 8 | Exit Sting (#636) | — (Wave 15 / Table M) |
| `dilate_organist` | 6 | Double remaining CDs | Cadence Stretch (#636) | — (Wave 15 / Table M) |
| `hood_recluse` | 7 | Next hit from Chebyshev ≥ 3 is 0 | Far Hood (#636) | — (Wave 15 / Table M) |
| `wick_exorcist` | 6 | Next walk MP detonates 10 | Gait Wick (#636) | — (Wave 16 / Table N) |
| `dry_nuncio` | 5 | Bonus if leftover AP is 0 | Dry Sting (#636) | — (Wave 16 / Table N) |
| `hearth_legate` | 6 | Caster steps adj to an ally | Home Step (#636) | — (Wave 16 / Table N) |
| `must_preceptor` | 6 | Walks must be Manhattan 2 | Must Span (#636) | — (Wave 16 / Table N) |
| `boot_subprior` | 5 | +1 MP if ally unmoved | Boot Lend (#636) | — (Wave 17 / Table O) |
| `purse_steward` | 7 | Carry leftover AP to next turn | Purse Keep (#636) | — (Wave 17 / Table O) |
| `tick_infirmarer` | 5 | Next DoT tick is 0 | Tick Plate (#636) | — (Wave 17 / Table O) |
| `mute_notary` | 6 | Last resolved id illegal 1 turn | Last Mute (#636) | — (Wave 17 / Table O) |
| `slide_porter` | 6 | Translate two adj hostiles 1 | Pair Slide (#636) | — (Wave 18 / Table P) |
| `both_capitular` | 5 | Heal iff caster and target both walked | Both Mend (#695) | — (Wave 18 / Table P) |
| `heave_kitchener` | 6 | Heal iff caster and target both force-moved | Heave Mend (#726) | — (Wave 18 / Table P) |
| `parched_preacher` | 5 | Heal iff both leftover MP = 0 | Parched Mend (#787) | — (Wave 18 / Table P) |
| `stride_chancellor` | 6 | Carry leftover walk MP to next turn | Stride Keep (#695) | — (Wave 19 / Table Q) |
| `dual_treasurer` | 7 | Carry leftover AP and MP to next turn | Dual Keep (#726) | — (Wave 19 / Table Q) |
| `imprint_archdeacon` | 6 | Copy remaining CDs onto the caster | Cadence Imprint (#787) | — (Wave 19 / Table Q) |
| `damp_provost` | 5 | Bonus iff leftover walk MP ≥ 2 | Damp Sting (#695) | — (Wave 19 / Table Q) |

Live rush room 9 still stores `weeping_pawn_2`. Implementation remaps that string to `second_lament`. Do **not** spawn a second `weeping_pawn`.

---

## 10. Boss Rush pairing notes (design only)

Existing `BOSS_RUSH_ROOMS` combined mechanics stay. This spec changes how **each** boss scales and how many extras they spawn. Pairings that become illegal under the new caps:

| Room | Risk under this spec | Intended rule |
| :--- | :--- | :--- |
| 0 Archbishop + Weeping | Reliquary + Wail Mark is fine. | Shared 4-extra cap (wisps only). |
| 1 Countess + Fetid | Lava + rot + split twin. | Twin counts as a body; lava cap 50. Combined “lava is poison” stays flavor. |
| 2 Cavalier + Static | Spikes + shock + chain. | Spikes do **not** chain. Combined “Cavalier is a conductor” = shock on **landing tile only**. |
| 3 Queen + Void | Void tiles + 8 anchors. | Never void an anchor tile. Enrage self-shatter still works. |
| 4 Grandmaster + Sovereign | Illusions + replay. | Replay ignores illusion casts. Fakes do not fill her buffer. |
| 5 Lich + Archivist | Rotate + glyphs. | Glyphs rotate with the board (stay on the same world tile). |
| 6 Eternal + Final | Two pawn kings. Combined “decoy” story. | Final Pawn ghosts **exclude** a second Eternal. Cap 6 extras for the room. |
| 7 Midnight + Twins | Four+ bodies. | Shared-HP twins + two monarchs = 4 bodies, 0 extra summons (skip wisp). |
| 8 Fortress + Brood | Shrink + larvae. | Larvae spawned on walls still count toward cap 4. Shrink cannot seal larvae inside isolated pockets. |
| 9 Starved + Weeping | Dual growth. | **Remap partner to `second_lament`.** Starved 200% cap + Lament 150% cap. Both Font and Grief Well must be destructible. Rally/Mend heals stay **flat**. Combined “feeds on HP the other regenerates” = Starved drain quota charges the well. |

Rush Doka/XP in `BOSS_RUSH_ROOMS` are already large flat numbers (500–5000). Do **not** also multiply by `rewardDokaMultiplier` or by player level. Persist through `buildBossRushPersistInput` → `applyRewards` only.

Wave-2 through Wave-17 bosses stay out of the 10-room table except `second_lament` (room-9 remap). Pairings below are **Table B** (Wave 2–4), **Table C** (Wave 5), **Table D** (Wave 6), **Table E** (Wave 7), **Table F** (Wave 8), **Table G** (Wave 9), **Table H** (Wave 10), **Table I** (Wave 11), **Table J** (Wave 12), **Table K** (Wave 13), **Table L** (Wave 14), **Table M** (Wave 15), **Table N** (Wave 16), and **Table O** (Wave 17). Do not pair `hook_regent` with Countess, Static, or Rime. Do not pair `ivory_palisade` with Fortress. Do not pair `sinkhole_dowager` with Hook (two attract verbs). Do not pair `ram_castellan` with Fosse / Hook / Rime / Dowager. Do not pair `lock_marshal` with Fosse / Hex / Palisade / Ram / Hook / Rime. Do not pair `bait_vicar` with Goad. Do not pair `font_abbess` with Lament / Archbishop. Do not pair `surplus_auditor` with Eternal / Stride. Do not pair `mill_seneschal` with Ram / Hook / Rime / Dowager / Countess / Fosse / Lock. Do not pair `counter_chaplain` with Grandmaster / Bait / Cord. Do not pair `wedge_prior` with Queen / Ram. Do not pair `levy_rector` with Archivist / Surplus / Eternal / Conductor. Do not pair `gaze_beadle` with Wedge / Queen. Do not pair `span_chamberlain` with Palisade / Fosse / Lock / Mill. Do not pair `cover_hospitaller` with Bait / Goad / Sovereign / Cord. Do not pair `lintel_sacrist` with Fosse / Palisade / Lock / Ram / Mill. Do not pair `toll_ostiary` with Levy / Hex / Stride / Surplus / Eternal / Lintel / Fosse / Palisade / Lock. Do not pair `hinge_precentor` with Grandmaster / Counter / Morrow / Hook / Dowager / Mill / Ram. Do not pair `veil_verger` with Bait / Cover / Goad / Sovereign / Conductor. Do not pair `oath_dean` with Conductor / Levy / Surplus / Gaze. Do not pair `crypt_sexton` with Fosse / Lintel / Palisade / Lock / Wick / Ram / Hook / Dowager / Mill / Rime / Countess. Do not pair `march_prefect` with Stride / Oath / Gaze / Levy / Surplus / Lintel / Fosse / Lock / Palisade / Crypt / Goad. Do not pair `aisle_canon` with Span / Palisade / Fosse / Lock / Mill / Cover / Cord / Crypt. Do not pair `orbit_succentor` with Hinge / Grandmaster / Counter / Morrow / Hook / Dowager / Mill / Ram / Crypt / Fosse / Wick / Rime / Countess / Gaze / Wedge. Do not pair `sole_thurifer` with Lock / Stride / March / Hex / Goad / Fosse / Palisade / Crypt / Lintel / Wedge / Gaze / Conductor. Do not pair `bias_prebendary` with Lock / Sole / March / Fosse / Palisade / Crypt / Lintel / Rime. Do not pair `brick_cellarer` with Palisade / Fortress / Fosse / Crypt / Lock / Lintel / Aisle / Span / Mill / Rime / Dowager / Hook. Do not pair `rebound_almoner` with Cover / Sovereign / Archbishop / Fortress / Wick / Countess / Crypt. Do not pair `infirm_chanter` with Sole / March / Stride / Hex / Lock / Bias / Font / Lament. Do not pair `yoke_subchanter` with Hinge / Orbit / Counter / Grandmaster / Morrow / Hook / Dowager / Mill / Ram / Cord. Do not pair `salve_wicker` with Wick / Crypt / Font / Infirm / Lament. Do not pair `brand_curate` with Hexed / Archivist / Goad / Veil / Rebound. Do not pair `flush_psalmist` with Surplus / Lend / Grandmaster / Conductor. Do not pair `lone_lector` with Brand / Hexed / Archivist / Veil / Goad. Do not pair `plate_bursar` with Morrow / Rebound / Cover / Wick / Crypt / Salve. Do not pair `lend_proctor` with Flush / Surplus / Font / Conductor. Do not pair `effigy_clerk` with Goad / Bait / Cover / Counter / Grandmaster / Quiet. Do not pair `enter_deacon` with Font / Salve / Infirm / Mend Wick / Crypt / Fosse. Do not pair `split_acolyte` with Font / Cover / Infirm / Lend / Enter. Do not pair `quiet_chorister` with Oath / Dummy / Goad. Do not pair `jostle_subdeacon` with Ram / Hook / Mill / Rime / Dowager / Yoke / Orbit / Hinge / Grandmaster / Morrow / Split / Enter / Font / Infirm. Do not pair `peel_friar` with Hex / Toll / Quiet / Enter / Ingress / Shove Sting. Do not pair `dilate_organist` with Flush / Conductor / Surplus / Court Stretch. Do not pair `hood_recluse` with Queen / Static / Sole / Lock / Fosse / Rebound / Cover / Sovereign. Do not pair `wick_exorcist` with Sole / Infirm / Stride / Peel / Toll / Boot Sting / Fuse / Pit Wick. Do not pair `dry_nuncio` with Surplus / Lend / Levy / Eternal’s leftover-evade cousins / Purse Keep-as-director. Do not pair `hearth_legate` with Yoke / Orbit / Hinge / Grandmaster / Morrow / Jostle / Mill / Ram / Hook / Countess / Rime. Do not pair `must_preceptor` with Sole / Lock / Fosse / Palisade / Lintel / Crypt / March / Rank Lock. Do not pair `boot_subprior` with Infirm / March / Stride / Wick / Sole / Mill / Ram / Hook / Pair Slide. Do not pair `purse_steward` with Surplus / Lend / Dry / Flush / Timestep-as-partner. Do not pair `tick_infirmarer` with Plate / Rebound / Hood / Cover / Sovereign / Countess / Wick Prelate. Do not pair `mute_notary` with Conductor / Weeping / Oath / Flush.

### 10.1 Rush Table B (post-first-clear, design only)

Unlock: one complete clear of rooms 0–9 (after the room-9 remap). **New table**, new `roomIndex` namespace `B0`–`B3`. Do **not** overwrite `BOSS_RUSH_ROOMS`. Do **not** change ENC-RUSH-04…08 (those remix **existing** rooms 1/2/4/5/8).

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room. Combined Doka/XP are document numbers — same rule as Table A: do not also multiply by `rewardDokaMultiplier`.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| B0 | `cinder_lance` + `hexed_marker` | Charge the glowing window **and** leave the Hex. | Hex **never** occupies a telegraphed lance tile. Wrong-element is still −50%, not immune. |
| B1 | `hook_regent` + `goad_pretender` | Get pulled, or get goaded into walking onto the ray. | Taunt does **not** force standing on the hook glow (player may tool-cast). Not Countess / Static / Rime. Winch and Crown are both objects. |
| B2 | `ivory_palisade` + `silent_conductor` | Fight from a sounding **open** lane. | Silence files are the **punched** lanes, never the staked files. Not Fortress (two shrinks). Sentinel + musicians share cap 4. |
| B3 | `unbound_pendulum` + `wick_prelate` | Race the clock **or** douse the wicks. | Fuses do **not** tick on a pendulum-sweep telegraph turn (one answer at a time). Metronomes delay enrage; Snuffer delays fuses. Shared extra cap: bomber only. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `rime_margrave` + `hook_regent` | Slide + attract. MIMA-005 unwired. |
| `rime_margrave` + `crimson_countess` | Ice + lava on the same files. |
| `sinkhole_dowager` + `wick_prelate` | Intended #133 combo, but occupancy-at-tick + pull is untested. |
| `sinkhole_dowager` + `hook_regent` | Two attract verbs. |
| `goad_pretender` + `cord_familiar` | Taunt + summon-gate is a double brick for a no-pet bar. |
| `ivory_palisade` + `alabaster_fortress` | Two shrinks. |
| `cord_familiar` + `second_lament` | Room 9 already owns the dual-growth jackpot. |
| Wave-4 ids in rooms 0–9 | Table A stays the shipped 19 + lament remap. |

`rime_margrave`, `sinkhole_dowager`, and `cord_familiar` remain **solo portal / dungeon capstone**. Table C does **not** absorb them (MIMA-005 still blocks rime/well pairs; Cord stays out of dual-growth and taunt rooms). Encounter Evolution may still attach a single Wave-4 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.2 Rush Table C (post-Table-B, design only)

Unlock: one complete clear of Table B (B0–B3). **New table**, new `roomIndex` namespace `C0`–`C3`. Do **not** overwrite `BOSS_RUSH_ROOMS` or Table B. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| C0 | `ram_castellan` + `hexed_marker` | Get shoved, or leave the Hex. | Hex **never** occupies a telegraphed ram ray. Slam is spell-hit, not a Hex detonate. Brace and Hex tiles are both objects/marks. |
| C1 | `fosse_warden` + `cinder_lance` | Shoot the glowing window **across** a pit. | Pits **never** occupy a telegraphed lance tile. Causeway is the only walk across. Wrong-element still −50%. Not Ivory (two walk-blocks). |
| C2 | `stride_censor` + `silent_conductor` | Stay still **on a sounding file**. | Silence files rotate onto the player’s **current** file, not a forced walk. Ledger + musicians share cap 4 (musicians only). Not Pendulum. |
| C3 | `morrow_herald` + `goad_pretender` | She lands where the Crown told you to look. | Taunt does **not** force standing on the painted landing (tools still ignore taunt). Hour-bell and Crown are both objects. Not Grandmaster (two teleports). |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `ram_castellan` + `fosse_warden` | Shove into pits. MIMA-005 unwired. |
| `ram_castellan` + `hook_regent` / `sinkhole_dowager` | Two displacement verbs (push vs pull). |
| `ram_castellan` + `rime_margrave` / `crimson_countess` | Shove onto ice / lava. MIMA-005. |
| `fosse_warden` + `ivory_palisade` | Two walk-block geometries; can seal. |
| `stride_censor` + `unbound_pendulum` | Clock vs standing vs walking — three tempos. |
| `stride_censor` + `goad_pretender` | Taunt forces a walk into the tithe. |
| `morrow_herald` + `void_grandmaster` | Two teleports. |
| `morrow_herald` + Twin Gate pads | Two delayed-position verbs. Twin Gate already stamps Grandmaster. |
| Wave-5 ids in rooms 0–9 or B0–B3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. |

`rime_margrave` / `sinkhole_dowager` stay solo until MIMA-005 (Table B hold still applies). `cord_familiar` leaves the solo list in Table D (D2).

### 10.3 Rush Table D (post-Table-C, design only)

Unlock: one complete clear of Table C (C0–C3). **New table**, new `roomIndex` namespace `D0`–`D3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, or Table C. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| D0 | `lock_marshal` + `wick_prelate` | Douse fuses from the **only legal walk file**. | Fuses **never** paint the locked file (Snuffer sits on it). Fuses tick on perpendicular files you Strike/Frost from the file. Compass and Snuffer are both objects. Not Fosse / Hex / Palisade. |
| D1 | `bait_vicar` + `silent_conductor` | Spell the real body from a sounding file; do not feed the pylon. | Silence **never** covers the Vicar’s file (you can still spell him). Pylon sits on a **silenced** file (tempting Strike). Censer + musicians share cap 4 (musicians only). Not Goad. |
| D2 | `font_abbess` + `cord_familiar` | Kill the font; feed **your** pet to the cord. | Enemy font is **not** a valid Cord gate key. Player must summon/own a pet. Font + cord extras share cap 4. Not Lament / Archbishop. |
| D3 | `surplus_auditor` + `unbound_pendulum` | Dump leftover AP **and** race the metronome. | Leftover check **skips** pendulum-sweep telegraph turns (one answer). Metronomes delay enrage; Audit-bell delays surplus. Not Eternal / Stride. Shared extra: bomber only. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `lock_marshal` + `fosse_warden` / `hexed_marker` / `ivory_palisade` | Two walk prisons. |
| `lock_marshal` + `ram_castellan` / `hook_regent` / `rime_margrave` / `sinkhole_dowager` | Forced off-axis onto hazards / attract. MIMA-005. |
| `bait_vicar` + `goad_pretender` | Two targeting tricks. |
| `font_abbess` + `second_lament` / `pale_archbishop` | Two heal engines. Room 9 already owns dual-growth. |
| `surplus_auditor` + `eternal_pawn_king` / `stride_censor` | Two AP / walk-MP taxes. |
| Wave-6 ids in rooms 0–9, B0–B3, or C0–C3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-6 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.4 Rush Table E (post-Table-D, design only)

Unlock: one complete clear of Table D (D0–D3). **New table**, new `roomIndex` namespace `E0`–`E3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, or Table D. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| E0 | `mill_seneschal` + `silent_conductor` | Stay on a sounding file; do not step onto the mill. | Mill cells **never** occupy a sounding file. Hopper sits on a silenced file (tempting a walk). Musicians only (cap 4). Not Lock / Rime. |
| E1 | `counter_chaplain` + `ivory_palisade` | He trades your pet onto the far bank of the stakes. | Swap **never** lands inside a sealed pocket (`finalizePlayableLayout`). Decoy is **not** a stake and is **not** a Cord gate. Sentinel + Chaplain extras share cap 4. Not Grandmaster / Bait / Fortress. |
| E2 | `wedge_prior` + `cinder_lance` | Step out of the cone **and** charge the glowing window. | Cone tiles **never** occupy a telegraphed lance file. Lectern and Brazier are both objects. Wrong-element still −50%. Not Queen / Ram. |
| E3 | `levy_rector` + `fosse_warden` | One committed poke across a pit; do not eat the tax on that poke. | Tax is **not** a pit-step (walk fail does not consume it). Pits **never** occupy his brand telegraph. Tithe-box sits on the near bank. Causeway is the only walk across. Not Archivist / Surplus / Conductor. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `mill_seneschal` + `ram_castellan` / `hook_regent` / `rime_margrave` / `sinkhole_dowager` / `crimson_countess` / `fosse_warden` | Forced move × hazards / two slides / pits. MIMA-005. |
| `mill_seneschal` + `lock_marshal` | Axis lock + mill can seal the only legal step onto a pad. |
| `counter_chaplain` + `void_grandmaster` | Two swap verbs. |
| `counter_chaplain` + `bait_vicar` | Two targeting tricks. |
| `counter_chaplain` + `cord_familiar` | Decoy must not be a Cord gate; still a double body-exam for a no-pet bar. |
| `wedge_prior` + `starborn_queen` / `ram_castellan` | Two multi-file / ray directors. |
| `levy_rector` + `pale_archivist` / `surplus_auditor` / `eternal_pawn_king` / `silent_conductor` | Two AP taxes, or silence of the cheap-tool file. |
| Wave-7 ids in rooms 0–9, B0–B3, C0–C3, or D0–D3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. Table D stays Wave 6. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-7 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.5 Rush Table F (post-Table-E, design only)

Unlock: one complete clear of Table E (E0–E3). **New table**, new `roomIndex` namespace `F0`–`F3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, or Table E. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| F0 | `gaze_beadle` + `hook_regent` | Get reeled, then **do not look** at him. | Pin **never** occupies a telegraphed hook tile. Forced-move does **not** rewrite facing (the exam is the walk *after* the reel). Crosier and Winch are both objects. Not Wedge / Queen / Countess / Static / Rime. |
| F1 | `span_chamberlain` + `ram_castellan` | Shove answers **one** cell of a two-cell body. | Ram ray **never** occupies **both** span cells. Brace and Truss are both objects. Extra cell is not a slam-face. Not Palisade / Fosse / Lock / Mill. |
| F2 | `cover_hospitaller` + `wick_prelate` | Hits bounce to the choir; douse the wicks. | Fuses **never** paint the martyr tile. Snuffer and Bier are both objects. Wisp is not a fuse. Shared extra: bomber only (cap 4). Not Bait / Goad / Sovereign / Cord. |
| F3 | `lintel_sacrist` + `stride_censor` | Stay still on the high bank **or** crawl at ≤ 50%. | Lintel cells **never** occupy the start tile (no forced first-step crawl). Ledger and Transom are both objects. A stride-taxed crawl is a **choice**. Not Fosse / Palisade / Lock / Ram / Mill / Pendulum. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `gaze_beadle` + `wedge_prior` / `starborn_queen` | Two facing / omni-line directors. |
| `span_chamberlain` + `ivory_palisade` / `fosse_warden` / `lock_marshal` | Two walk prisons / width + stakes. |
| `span_chamberlain` + `mill_seneschal` | Occupancy + enter-slide. |
| `cover_hospitaller` + `bait_vicar` / `goad_pretender` / `mirror_sovereign` | Two targeting / reflect tricks. |
| `cover_hospitaller` + `cord_familiar` | Wisp must not be a Cord gate; still a double body-exam for a no-pet bar. |
| `lintel_sacrist` + `fosse_warden` / `ivory_palisade` / `lock_marshal` | Two walk-block geometries. |
| `lintel_sacrist` + `ram_castellan` / `mill_seneschal` | Shove / slide onto a HP% gate. MIMA-005. |
| Wave-8 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, or E0–E3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. Table D stays Wave 6. Table E stays Wave 7. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-8 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.6 Rush Table G (post-Table-F, design only)

Unlock: one complete clear of Table F (F0–F3). **New table**, new `roomIndex` namespace `G0`–`G3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, or Table F. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| G0 | `toll_ostiary` + `cinder_lance` | Charge the glowing window **or** stay on the tithe and poke. | Tithe cells **never** occupy a telegraphed lance tile. Wrong-element still −50%. Stoop and Brazier are both objects. Not Levy / Hex / Stride / Lintel. |
| G1 | `hinge_precentor` + `ivory_palisade` | Enter-swap across the punched lane, not into a sealed pocket. | Hinge **never** paints a sealed pocket. Swap landing must stay on a **punched** lane (`finalizePlayableLayout` after swap). Peg and stakes are both objects. Not Grandmaster / Counter / Morrow / Fortress. |
| G2 | `veil_verger` + `wick_prelate` | You cannot *name* him; douse the wicks with AoE / Strike. | Fuses **never** paint his tile (environmental tick is not a primary-target reject, but the exam is AoE from a different cell). Snuffer and Cowl are both objects. Shared extra: bomber only (cap 4). Not Bait / Cover / Goad / Sovereign / Conductor. |
| G3 | `oath_dean` + `ram_castellan` | You must Strike; he shoves you **off** melee. | Brand telegraph **never** occupies the ram ray. Brace and Paten are both objects. After a slam, a legal Strike tile must still exist (`finalizePlayableLayout`). Not Conductor / Levy / Gaze / Queen / Wedge. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `toll_ostiary` + `levy_rector` / `hexed_marker` / `stride_censor` / `surplus_auditor` / `eternal_pawn_king` | Two AP / walk taxes. |
| `toll_ostiary` + `lintel_sacrist` / `fosse_warden` / `ivory_palisade` / `lock_marshal` | Two walk prisons / doors. |
| `hinge_precentor` + `void_grandmaster` / `counter_chaplain` / `morrow_herald` | Two swap / blink verbs. |
| `hinge_precentor` + `hook_regent` / `sinkhole_dowager` / `mill_seneschal` / `ram_castellan` | Forced-move *is* a legal hinge enter. MIMA-001 / 005. |
| `veil_verger` + `bait_vicar` / `cover_hospitaller` / `goad_pretender` / `mirror_sovereign` | Two targeting / reflect tricks. |
| `veil_verger` + `silent_conductor` | Primary-reject + file silence bricks a no-AoE bar. |
| `oath_dean` + `silent_conductor` / `levy_rector` / `surplus_auditor` / `gaze_beadle` | Two spell-economy / facing locks. |
| Wave-9 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, or F0–F3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. Table D stays Wave 6. Table E stays Wave 7. Table F stays Wave 8. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-9 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.7 Rush Table H (post-Table-G, design only)

Unlock: one complete clear of Table G (G0–G3). **New table**, new `roomIndex` namespace `H0`–`H3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, or Table G. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| H0 | `crypt_sexton` + `cinder_lance` | Stand the wick **this** turn, or shoot the window before it opens. | Wick/pit **never** occupies a telegraphed lance tile. Wrong-element still −50%. Grate and Brazier are both objects. Convert still waits 1 turn. Not Fosse / Wick / Lintel. |
| H1 | `march_prefect` + `silent_conductor` | Take the required 1-MP step **on a sounding file**, then cast. | Silence **never** forces a step off the sounding file. Pulpit sits on a silenced file (tempting a plant). Musicians only (cap 4). Not Stride / Oath / Gaze / Levy. |
| H2 | `aisle_canon` + `ram_castellan` | Ram answers **one** post of a three-post chain. | Ram ray **never** occupies **all** living posts. Brace and Rood are both objects. Extra posts are not slam-faces. Not Span / Palisade / Fosse / Lock / Mill. |
| H3 | `orbit_succentor` + `ivory_palisade` | Pivot onto a punched lane, not into a sealed pocket. | Dest **never** into a sealed pocket (`finalizePlayableLayout` after pivot). Landing must stay on a **punched** lane. Ambit is **not** a stake. Not Hinge / Grandmaster / Counter / Morrow / Fortress. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `crypt_sexton` + `fosse_warden` / `lintel_sacrist` / `ivory_palisade` / `lock_marshal` | Two walk prisons / delayed vs immediate pits. |
| `crypt_sexton` + `wick_prelate` | Two delayed floors (occupancy vs damage). |
| `crypt_sexton` + `ram_castellan` / `hook_regent` / `sinkhole_dowager` / `mill_seneschal` / `rime_margrave` / `crimson_countess` | Forced-move onto a wick that then opens. MIMA-005. |
| `march_prefect` + `stride_censor` / `oath_dean` / `gaze_beadle` / `levy_rector` / `surplus_auditor` | Two spell-economy / walk bricks. |
| `march_prefect` + `lintel_sacrist` / `fosse_warden` / `lock_marshal` / `ivory_palisade` / `crypt_sexton` | Can deny the required step. |
| `march_prefect` + `goad_pretender` | Taunt forces the walk. |
| `aisle_canon` + `span_chamberlain` / `ivory_palisade` / `fosse_warden` / `lock_marshal` / `mill_seneschal` | Two occupy / walk prisons. |
| `aisle_canon` + `cover_hospitaller` / `cord_familiar` | Double body-exam / posts as sponges. |
| `aisle_canon` + `crypt_sexton` / `fosse_warden` | Posts on pits. |
| `orbit_succentor` + `hinge_precentor` / `void_grandmaster` / `counter_chaplain` / `morrow_herald` | Two swap / blink verbs. |
| `orbit_succentor` + `hook_regent` / `sinkhole_dowager` / `mill_seneschal` / `ram_castellan` | Forced-move dest. MIMA-005. |
| `orbit_succentor` + `crypt_sexton` / `fosse_warden` / `wick_prelate` / `rime_margrave` / `crimson_countess` | Dest-onto-hazard. |
| `orbit_succentor` + `gaze_beadle` / `wedge_prior` | Two facing / cone directors. |
| Wave-10 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, or G0–G3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. Table D stays Wave 6. Table E stays Wave 7. Table F stays Wave 8. Table G stays Wave 9. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-10 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

---

### 10.8 Rush Table I (post-Table-H, design only)

Unlock: one complete clear of Table H (H0–H3). **New table**, new `roomIndex` namespace `I0`–`I3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, or Table H. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| I0 | `sole_thurifer` + `hook_regent` | Take the reel (forced-move is legal) **or** plant and eat the ray. | Seal **never** resolves on a hook-glow turn (one answer). Winch and Thurible are both objects. Reel does **not** spend walk MP. Not Rank Lock / Must Pace / Stride / Goad / Hex / Fosse / Conductor. |
| I1 | `bias_prebendary` + `mill_seneschal` | Ride the cardinal mill, then **walk the diagonal**. | Mill cells **never** occupy a legal diagonal step. Hopper and Quoin are both objects. Mill is forced-move (legal under Diag Lock). Bias’s P2 archer counts toward cap 4. Not Rank Lock / Sole / Rime / Lock. |
| I2 | `brick_cellarer` + `gaze_beadle` | Shift the brick that was blocking the look, then **do not look**. | Brick dest **never** occupies the pin telegraph. Crosier and Mortar are both objects. Forced-move does **not** rewrite facing (the exam is the walk *after*). Not Palisade / Fortress / Fosse / Wedge / Queen. |
| I3 | `rebound_almoner` + `wedge_prior` | Arm the bowl, eat the cone, poke half back — **or** break the dish first. | Cone tiles **never** occupy the Alms-dish tile. Lectern and Alms-dish are both objects. The cone *is* an applied hit (legal consume). Not Cover / Sovereign / Archbishop / Queen / Ram. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `sole_thurifer` + `lock_marshal` / `stride_censor` / `march_prefect` / `hexed_marker` / `goad_pretender` / `fosse_warden` / `ivory_palisade` / `crypt_sexton` / `lintel_sacrist` | Two walk bricks / hex-leave vs no-walk. |
| `sole_thurifer` + `wedge_prior` / `gaze_beadle` / `silent_conductor` | Plant answer denied (cone / pin / silence). |
| `bias_prebendary` + `lock_marshal` / `sole_thurifer` / `march_prefect` / `fosse_warden` / `ivory_palisade` / `crypt_sexton` / `lintel_sacrist` | Two walk prisons. |
| `bias_prebendary` + `rime_margrave` | Diagonal into ice gutter. MIMA-005. |
| `brick_cellarer` + `ivory_palisade` / `alabaster_fortress` / `fosse_warden` / `crypt_sexton` / `lock_marshal` / `lintel_sacrist` / `aisle_canon` / `span_chamberlain` | Two wall / walk prisons. |
| `brick_cellarer` + `mill_seneschal` / `rime_margrave` / `sinkhole_dowager` / `hook_regent` | Dest-onto-hazard / attract. MIMA-001 / 005. |
| `rebound_almoner` + `cover_hospitaller` / `mirror_sovereign` / `pale_archbishop` / `alabaster_fortress` | Two hit-economy / reflect directors. |
| `rebound_almoner` + `wick_prelate` / `crimson_countess` / `crypt_sexton` | Hazard ticks do not consume — false exam. |
| Wave-11 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, or H0–H3 | Table A stays the shipped 19 + lament remap. Table B stays Wave 2–4. Table C stays Wave 5. Table D stays Wave 6. Table E stays Wave 7. Table F stays Wave 8. Table G stays Wave 9. Table H stays Wave 10. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-11 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.9 Rush Table J (post-Table-I, design only)

Unlock: one complete clear of Table I (I0–I3). **New table**, new `roomIndex` namespace `J0`–`J3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, or Table I. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| J0 | `infirm_chanter` + `levy_rector` | Walk to pay the hymn, then the **next spell is taxed**. | Tithe-box **never** occupies the Infirmary. Levy’s tax is not a walk reject. Infirmary break does **not** clear Hex Toll. Not Sole / March / Stride / Hex / Font. |
| J1 | `yoke_subchanter` + `veil_verger` | They rotate, then the primary you wanted is **veiled**. | Pair dests **never** occupy the Cowl. Veil reject spends 0 AP. Occupancy dests, not `swapPositions`. Not Hinge / Orbit / Counter / Cover / Goad / Bait. |
| J2 | `salve_wicker` + `bait_vicar` | Enter the salve pad; the pylon **intercepts the path**. | Bait intercept **never** occupies the pad. Pad tick is heal, not damage. Sentinel + Wisp share cap 4. Not Goad / Font / Wick / Crypt. |
| J3 | `brand_curate` + `oath_dean` | Strike is the only legal damage, and it is **amped**. | Oath telegraph **never** occupies the Stylus. The Strike Oath allows **is** the Body Mark consume (one exam). Non-Strike still fizzles (AP spent). Not Hexed / Archivist / Goad / Veil / Conductor / Levy. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `infirm_chanter` + `sole_thurifer` / `march_prefect` / `stride_censor` / `hexed_marker` / `lock_marshal` / `bias_prebendary` | Two walk exams. |
| `infirm_chanter` + `font_abbess` / `second_lament` | Two heal directors. |
| `yoke_subchanter` + `hinge_precentor` / `orbit_succentor` / `counter_chaplain` / `void_grandmaster` / `morrow_herald` / `hook_regent` / `sinkhole_dowager` / `mill_seneschal` / `ram_castellan` | Two relocate directors / MIMA dests. |
| `yoke_subchanter` + `cord_familiar` | Pair-required + summon-gate. |
| `salve_wicker` + `wick_prelate` / `crypt_sexton` / `font_abbess` / `infirm_chanter` | Two delayed-tile / heal directors. |
| `brand_curate` + `hexed_marker` / `pale_archivist` | Two mark directors. |
| `brand_curate` + `goad_pretender` / `veil_verger` / `rebound_almoner` | Two targeting / hit-economy directors. |
| Wave-12 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, or I0–I3 | Table A stays the shipped 19 + lament remap. Tables B–I stay their waves. |
| Wave-13 ids in J0–J3 | Table J stays Infirm / Yoke / Salve / Brand. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-12 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

---


### 10.10 Rush Table K (post-Table-J, design only)

Unlock: one complete clear of Table J (J0–J3). **New table**, new `roomIndex` namespace `K0`–`K3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, or Table J. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| K0 | `flush_psalmist` + `gaze_beadle` | Flush the choir’s bar, then the recast must still honor **facing**. | Crosier / facing-pin cell **never** occupies the Psalter. Missing `currentView` never pins. Flush cannot target him (self illegal). Not Surplus / Lend / Grandmaster / Conductor / Wedge / Queen. |
| K1 | `lone_lector` + `aisle_canon` | Cluster with a pet to deny the +8; the **posts occupy the hug tiles**. | Triple-span posts **never** occupy the Ambo. Posts are enemy-side — they do **not** break your isolation. Sentinel + Archer + posts share cap 4. Not Brand / Hexed / Span / Cover / Cord. |
| K2 | `plate_bursar` + `ram_castellan` | Ram him on the **arming** turn; do not swing the plated turn. | Brace dest **never** occupies the Aumbry. This turn’s ram is **not** absorbed (delay 1). Not Morrow / Rebound / Cover / Wick / Fosse / Hook. |
| K3 | `lend_proctor` + `brick_cellarer` | Dump leftover AP to the pet while the **brick slides the spend lane**. | Mortar dest **never** occupies the Coffer. Lend does not grant AP above max. World walls are not brick sources. Not Flush / Surplus / Font / Palisade / Fosse. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `flush_psalmist` + `surplus_auditor` / `lend_proctor` / `void_grandmaster` / `silent_conductor` | Two cadence / leftover-AP / once-battle dumps. |
| `lone_lector` + `brand_curate` / `hexed_marker` / `pale_archivist` | Two mark / unit-amp directors. |
| `lone_lector` + `veil_verger` / `goad_pretender` | Two targeting directors. |
| `plate_bursar` + `morrow_herald` | Two “morrow” delays. |
| `plate_bursar` + `rebound_almoner` / `cover_hospitaller` | Two incoming-hit directors. |
| `plate_bursar` + `wick_prelate` / `crypt_sexton` / `salve_wicker` | Two delay clocks. |
| `lend_proctor` + `flush_psalmist` / `surplus_auditor` / `font_abbess` / `silent_conductor` | Two leftover-AP / support / bar directors. |
| Wave-13 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, or J0–J3 | Table A stays the shipped 19 + lament remap. Tables B–J stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-13 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.11 Rush Table L (post-Table-K, design only)

Unlock: one complete clear of Table K (K0–K3). **New table**, new `roomIndex` namespace `L0`–`L3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, or Table K. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| L0 | `effigy_clerk` + `lock_marshal` | Plant straw on a **legal axis**; pop it without walking off-axis. | Compass / dummy dest **never** occupies the Mannequin. Off-axis walks already reject (0 MP). Post is not a Rank Lock target. Not Goad / Bait / Cover / Counter / Grandmaster / Quiet / Fosse / Hex / Palisade / Ram / Hook / Rime. |
| L1 | `enter_deacon` + `stride_censor` | Pay walk-MP to **steal** the public 6, or let the extra drink. | Ledger **never** occupies the Narthex. Forced-move enter is free of walk MP (Stride does not tax it) and **does** consume the pad. Not Font / Salve / Infirm / Mend Wick / Crypt / Fosse. |
| L2 | `split_acolyte` + `cord_familiar` | Isolate the cup, or the **familiar** is the neighbor. | Cord’s summon-gate **never** occupies the Pyx. Familiar death ≠ victory. Dummy Post extras are not preferred neighbors. Not Font / Cover / Infirm / Lend / Enter / Counter. |
| L3 | `quiet_chorister` + `bone_cavalier` | Land the knight **off** the stall, or Strike from a legal cell. | Spike-on-land dest **never** occupies the Muffler. Quiet never paints the knight-landing telegraph. Vault once/battle still answers. Not Oath / Dummy / Goad. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `effigy_clerk` + `goad_pretender` / `bait_vicar` / `cover_hospitaller` / `counter_chaplain` / `void_grandmaster` | Two taunt / intercept / decoy directors. |
| `effigy_clerk` + `quiet_chorister` | Intended force-melee-onto-sill exam; two Wave-14 cores. |
| `enter_deacon` + `font_abbess` / `salve_wicker` / `infirm_chanter` / `crypt_sexton` / `fosse_warden` | Two heal-pad or occupancy-tile directors. |
| `split_acolyte` + `font_abbess` / `cover_hospitaller` / `infirm_chanter` / `lend_proctor` / `enter_deacon` | Two support-heal / ally dumps. |
| `quiet_chorister` + `oath_dean` | Must Strike + cannot Strike — a brick. |
| `quiet_chorister` + `goad_pretender` | Force melee onto a spell-only tile — held with Dummy. |
| Wave-14 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, or K0–K3 | Table A stays the shipped 19 + lament remap. Tables B–K stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-14 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.12 Rush Table M (post-Table-L, design only)

Unlock: one complete clear of Table L (L0–L3). **New table**, new `roomIndex` namespace `M0`–`M3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, or Table L. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| M0 | `jostle_subdeacon` + `counter_chaplain` | They swap **your** pack; he still has to shove **his** clerk onto a free cell to bank 8. | Abacus dest **never** occupies the Stole. Counter does **not** arm his extra (`forcedMovedThisTurn` is boss-side only from *his* shove). Not Ram / Hook / Mill / Rime / Dowager / Yoke / Orbit / Hinge / Grandmaster / Morrow / Split / Enter / Font. |
| M1 | `peel_friar` + `cinder_lance` | Stand the sting to shoot the window, or peel and eat 8. | Exit sting **never** occupies a telegraphed lance tile. Wrong-element still −50%. Stoup and Brazier are both objects. Not Hex / Toll / Quiet / Enter. |
| M2 | `dilate_organist` + `levy_rector` | Stretch Inferno late, then the recast is **taxed**. | Tithe-box **never** occupies the Antiphoner. Strike stays legal (remaining 0). Not Flush / Conductor / Surplus. |
| M3 | `hood_recluse` + `hexed_marker` | Leave the Hex **toward** him and land the shot from Chebyshev 2. | Hex **never** occupies the Capuche. Hood min stays Chebyshev **3**. Leaving Hex at range 4 to a cell still ≥ 3 still consumes. Not Queen / Static / Sole / Lock / Fosse / Rebound / Peel (two leave directors on Peel, not here). |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `jostle_subdeacon` + `ram_castellan` / `hook_regent` / `mill_seneschal` / `rime_margrave` / `sinkhole_dowager` | Player-side force-move × hazard. MIMA-005. |
| `jostle_subdeacon` + `yoke_subchanter` / `orbit_succentor` / `hinge_precentor` / `void_grandmaster` / `morrow_herald` | Two relocate directors. |
| `jostle_subdeacon` + `split_acolyte` / `enter_deacon` / `font_abbess` / `infirm_chanter` | Two heal directors. |
| `peel_friar` + `hexed_marker` / `toll_ostiary` | Two leave directors. |
| `peel_friar` + `quiet_chorister` / `enter_deacon` | Two tile-paints. |
| `dilate_organist` + `flush_psalmist` / `silent_conductor` / `surplus_auditor` | Two cadence / bar directors. |
| `hood_recluse` + `starborn_queen` / `lord_of_static` | Two range directors. |
| `hood_recluse` + `sole_thurifer` / `lock_marshal` / `fosse_warden` | Close-in walk denied. |
| `hood_recluse` + `rebound_almoner` / `cover_hospitaller` / `mirror_sovereign` | Two incoming-hit directors. |
| Wave-15 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, or L0–L3 | Table A stays the shipped 19 + lament remap. Tables B–L stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-15 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.13 Rush Table N (post-Table-M, design only)

Unlock: one complete clear of Table M (M0–M3). **New table**, new `roomIndex` namespace `N0`–`N3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, or Table M. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| N0 | `wick_exorcist` + `march_prefect` | The required pace **is** the detonating walk. Stand and Strike, or spend the 2-step and eat 10. | Pulpit **never** occupies the Cresset. Forced-move is not walk MP (Must Pace does not consume; Gait Wick does not detonate). Not Sole / Infirm / Stride / Peel / Toll. |
| N1 | `dry_nuncio` + `eternal_pawn_king` | Keep **1 AP** through the drain, or the sting is 20. | Advance stones **never** occupy the Cruet. Drain Courage debit is **their** AP, then leftover is re-read. Not Surplus / Lend / Levy. |
| N2 | `hearth_legate` + `cover_hospitaller` | He joins the martyr; your **next hit** goes to the extra. | Bier dest **never** occupies the Andiron. Occupy the landing **or** Strike the extra. Not Yoke / Orbit / Hinge / Grandmaster / Morrow / Jostle / Bait / Goad / Cord. |
| N3 | `must_preceptor` + `bias_prebendary` | The only legal walks are diagonal **1,1** (Manhattan 2 **and** diagonal). | Quoin dest **never** occupies the Ell. Cardinal 2-steps are Bias-illegal; 1-steps are Must-illegal. Stand / Swap / forced-move still answer. Not Sole / Lock / Fosse / Palisade / March. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `wick_exorcist` + `sole_thurifer` / `infirm_chanter` / `stride_censor` | Two walk-MP directors. |
| `wick_exorcist` + `peel_friar` / `toll_ostiary` | Two leave / step taxes. |
| `dry_nuncio` + `surplus_auditor` / `lend_proctor` | Two leftover-AP directors. |
| `dry_nuncio` + `levy_rector` | Two AP-bar exams (Levy already M2). |
| `hearth_legate` + `yoke_subchanter` / `orbit_succentor` / `hinge_precentor` / `void_grandmaster` / `morrow_herald` / `jostle_subdeacon` | Two relocate directors. |
| `hearth_legate` + `crimson_countess` / `rime_margrave` | Landing × hazard. MIMA-001. |
| `must_preceptor` + `sole_thurifer` | Cannot walk **and** must 2-step — a brick. |
| `must_preceptor` + `lock_marshal` / `fosse_warden` / `ivory_palisade` / `lintel_sacrist` / `crypt_sexton` | Can deny every Manhattan-2 dest. |
| `must_preceptor` + `march_prefect` | Two walk-gates (Wick already owns March on N0). |
| Wave-16 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, or M0–M3 | Table A stays the shipped 19 + lament remap. Tables B–M stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-16 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

### 10.14 Rush Table O (post-Table-N, design only)

Unlock: one complete clear of Table N (N0–N3). **New table**, new `roomIndex` namespace `O0`–`O3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, or Table N. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| O0 | `boot_subprior` + `lock_marshal` | He gifts the novice a 2-step; you are **axis-locked**. Occupy the on-axis landing. | Compass dest **never** occupies the Caliga. Off-axis walks already reject (0 MP). Forced-move does **not** fizzle the lend. Novice death ≠ victory. Not Infirm / March / Stride / Wick / Sole / Mill / Ram / Hook / Fosse / Hex / Palisade. |
| O1 | `purse_steward` + `unbound_pendulum` | Dump leftover before snapshot, or the banked 3 recasts Inferno after the next **sweep**. | Metronome dest **never** occupies the Cista. Keep is not a second clock (pays at next own turn start, not on sweep). Death discards the bank. Not Surplus / Lend / Dry / Flush. |
| O2 | `tick_infirmarer` + `fetid_rook` | Inferno him (one tick eaten) while answering compounding **rot** on you. | Split-rook dest **never** occupies the Plaster. Rot on you is not this plate (plate is self). Lava / hazard ticks do not consume. Twin counts as a body. Not Plate / Rebound / Hood / Cover / Countess / Wick Prelate. |
| O3 | `mute_notary` + `dilate_organist` | Stretch Inferno late, then mute **that same id**. | Antiphoner dest **never** occupies the Tabula. Strike stays legal if last id was not Strike. Stretch cap 8. Not Conductor / Weeping / Oath / Flush / Surplus / Court Stretch. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `boot_subprior` + `infirm_chanter` / `march_prefect` / `stride_censor` / `wick_exorcist` / `sole_thurifer` | Two walk-MP directors. |
| `boot_subprior` + `mill_seneschal` / `ram_castellan` / `hook_regent` | Forced-move does **not** fizzle the lend — a false answer. |
| `purse_steward` + `surplus_auditor` / `lend_proctor` / `dry_nuncio` / `flush_psalmist` | Two leftover-AP directors. |
| `tick_infirmarer` + `plate_bursar` / `rebound_almoner` / `hood_recluse` / `cover_hospitaller` / `mirror_sovereign` | Two incoming-mitigation directors. |
| `tick_infirmarer` + `crimson_countess` | Lava is a hazard tick, not `dotStacks`. |
| `mute_notary` + `silent_conductor` / `weeping_pawn` | Two silence directors. |
| `mute_notary` + `oath_dean` | Last id Strike + Oath-only Strike — a brick. |
| Wave-17 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, or N0–N3 | Table A stays the shipped 19 + lament remap. Tables B–N stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-17 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

---

### 10.15 Rush Table P (post-Table-O, design only)

Unlock: one complete clear of Table O (O0–O3). **New table**, new `roomIndex` namespace `P0`–`P3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, or Table O. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| P0 | `slide_porter` + `peel_friar` | He slides the pair onto / off an Exit Sting. Enter does **not** tick; the *leave* does. | Stoup dest **never** occupies the Litter. Dest onto lava / spike is illegal AI (MIMA-005). Wolf is not a player-pair partner. Not Yoke / Mill / Ram / Hook / Countess / Fosse / Crypt / Cord. |
| P1 | `both_capitular` + `lord_of_static` | Both of you walk to take 8, while the shock graph taxes standing. | Shock dest **never** occupies the Gaiter. Force-move does **not** arm Both Mend. Novice death ≠ victory. Not Infirm / Jostle / March / Sole / Wick / Must / Stride. |
| P2 | `heave_kitchener` + `mill_seneschal` | Mill cells force-move you; heave heals if **both** he and the extra were forced. | Hopper dest **never** occupies the Spit. P2 `NAVE_HEAVE` translate is occupancy, not mill paint. Not Jostle / Yoke / Ram / Hook / Slide / Countess / Fosse. |
| P3 | `parched_preacher` + `dry_nuncio` | Leftover **MP** = 0 heal vs leftover **AP** = 0 sting. | Cruet dest **never** occupies the Flagon. Leftover AP does not arm Parched. Not Surplus / Purse / Lend / Both / Infirm / Dry Mend clone / Dry Gait (#802) grant. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `slide_porter` + `yoke_subchanter` / `counter_chaplain` / `orbit_succentor` / `hinge_precentor` / `mill_seneschal` / `ram_castellan` / `hook_regent` | Two relocate directors. |
| `slide_porter` + `crimson_countess` / `fosse_warden` / `crypt_sexton` | Dest-hazard (MIMA-005 OPEN). |
| `slide_porter` + `cord_familiar` | Pair-required + summon-gate. |
| `both_capitular` + `infirm_chanter` / `jostle_subdeacon` | Two walk-heal directors. |
| `both_capitular` + `march_prefect` / `sole_thurifer` / `wick_exorcist` / `must_preceptor` / `stride_censor` | Two walk-MP directors. |
| `heave_kitchener` + `jostle_subdeacon` | Two force-heal directors. |
| `heave_kitchener` + `yoke_subchanter` / `ram_castellan` / `hook_regent` / `slide_porter` | Two relocate directors (Mill is the Table P2 exception). |
| `parched_preacher` + `surplus_auditor` / `purse_steward` / `lend_proctor` | Two leftover-economy directors. |
| `parched_preacher` + `both_capitular` / `infirm_chanter` | Leftover-0 vs must-walk heal. |
| Wave-18 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, N0–N3, or O0–O3 | Table A stays the shipped 19 + lament remap. Tables B–O stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-18 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.


### 10.16 Rush Table Q (post-Table-P, design only)

Unlock: one complete clear of Table P (P0–P3). **New table**, new `roomIndex` namespace `Q0`–`Q3`. Do **not** overwrite `BOSS_RUSH_ROOMS`, Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, Table O, or Table P. Do **not** collide ENC-RUSH remixes.

Flat rewards continue the live jackpot curve without a player-level exponent. Persist through `applyRewards` only. Shared 4-extra cap per room.

| Room | Pair | Combined question | Hard rule |
| :--- | :--- | :--- | :--- |
| Q0 | `stride_chancellor` + `lock_marshal` | Bank leftover walk MP while remaining walks this turn are axis-locked. | Compass dest **never** occupies the Scrip. Off-axis walk rejects **before** MP debit. Pay is next start, not a queue splice. Novice death ≠ victory. Not Purse / Dual / Surplus / Lend / Parched / Stride Censor / March / Sole / Wick / Must. |
| Q1 | `dual_treasurer` + `levy_rector` | Bank **both** leftovers, or spend the next spell into Hex Toll. | Tithe-box dest **never** occupies the Bourse. Dual skip if either leftover is 0. Hex Toll is next-cast AP tax, not leftover. Not Purse / Stride / Surplus / Lend / Parched. |
| Q2 | `imprint_archdeacon` + `mute_notary` | Copy matching remaining CDs **and** last resolved id is illegal 1 turn. | Tabula dest **never** occupies the Platen. Imprint is copy, not steal. Last Mute is last-id, not remaining CD. Empty intersection fizzles. Not Dilate / Flush / Cadence Stretch. |
| Q3 | `damp_provost` + `hexed_marker` | Hold leftover walk MP ≥ 2 and eat +10, or spend to leave the Hex. | Hex dest **never** occupies the Sump. Damp leftover is walk **MP ≥ 2**, not leftover AP. Hex leave is the spend that can deny the bonus. Not Dry / Parched / Stride / Dual. |

**Held (illegal until a later pass):**

| Pair | Why illegal now |
| :--- | :--- |
| `stride_chancellor` + `purse_steward` / `dual_treasurer` / `surplus_auditor` / `lend_proctor` / `parched_preacher` | Two leftover-economy directors. |
| `stride_chancellor` + `stride_censor` / `march_prefect` / `sole_thurifer` / `wick_exorcist` / `must_preceptor` | Two walk-MP directors. |
| `dual_treasurer` + `purse_steward` / `stride_chancellor` / `surplus_auditor` / `lend_proctor` / `parched_preacher` | Two leftover-economy directors. |
| `imprint_archdeacon` + `dilate_organist` / `flush_psalmist` | Two remaining-CD directors. |
| `damp_provost` + `stride_chancellor` / `dual_treasurer` | Leftover-MP bank then leftover-MP tax. |
| `damp_provost` + `parched_preacher` | Leftover-MP ≥ 2 poke vs leftover-MP = 0 heal. |
| `damp_provost` + `dry_nuncio` | Two leftover-currency stings (P3 already owns Dry). |
| Wave-19 ids in rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, N0–N3, O0–O3, or P0–P3 | Table A stays the shipped 19 + lament remap. Tables B–P stay their waves. |

`rime_margrave` / `sinkhole_dowager` remain **solo portal / dungeon capstone**. Encounter Evolution may still attach a single Wave-19 id as ENC-BOSS-02 only if a human picks that id — this bible does not rewrite ENC-BOSS-02.

---

## 11. Implementation contract (later PRs)

When someone implements this, split work. Do not land it as one combat rewrite.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| A. Relative HP/ATK budgets | `getBossEffectiveStats` / spawn site that copies `baseStats` | Damage formula, RAF, map-gen |
| B. Retire Final Pawn `999` | `bossDefaults.ts` phase2.statMultiplier → 1.20; ghost count 4 | Turn order |
| C. Enrage overlay | `BossState` + AI priority | Damage math internals (use a multiplier already applied at the existing outgoing-damage site) |
| D. Destructible objects | New explicit type, not `Enemy` | Reward roster (0 XP) |
| E. Telegraphs | Highlight tiles 1 turn, then existing ability | New damage types |
| F. Discoverable spells | New `SpellConfig` rows + persist counters | Name heuristics; `localStorage`-only unlocks |
| G. Backend seed sync | `defaultBossConfigs()` vs frontend kits | `backend_extended/`; 15-field stats |
| H. Phase-3 type | Only if a sheet truly needs `phaseNumber: 3` | Do not widen the type “just in case” |
| I. Rush room 9 remap | `useBossRush.ts` `weeping_pawn_2` → `second_lament` | Do not add Wave 3 ids to `BOSS_IDS` in the same PR as the string fix unless kits ship |
| J. #120 BOSS grants | Persist first-victory ids for Pain Link / Glyph Tax / Blood Familiar | Do not also fire #137 count-gates from that same flag |
| K. #133 extra doors | `bossIds` on File Lance / Life Tether / Rime / Fuse / Goad / Sinkhole | No new #137 ids; first grant wins |
| L. Wave 4 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 4 ids to `BOSS_IDS` without kits |
| M. Rush Table B | New 4-room table after first clear | Do not rewrite rooms 0–9; do not collide ENC-RUSH-04…08 |
| N. Wave 5 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 5 ids to `BOSS_IDS` without kits. No new #137 spell ids. |
| O. Rush Table C | New 4-room table after Table B clear | Do not rewrite rooms 0–9 or B0–B3 |
| P. #342 extra doors | `bossIds` on Morrow Step / Bait Pylon / Surplus Ward; roster notes for Cut In / After Verse / Sanguine Toll / Draw Together | Do not re-stamp #342 `BOSS` doors on shipped ids; first grant wins |
| Q. Wave 6 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 6 ids to `BOSS_IDS` without kits. No new #137 spell ids. `summonAI: "bait"` / `"font"` must be allowed strings. |
| R. Rush Table D | New 4-room table after Table C clear | Do not rewrite rooms 0–9, B0–B3, or C0–C3 |
| S. Wave 7 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 7 ids to `BOSS_IDS` without kits. No new #137 spell ids. Cone requires `areaShape` wire. Pawn Trade must **not** call `swapPositions`. |
| T. Rush Table E | New 4-room table after Table D clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, or D0–D3 |
| U. #282 Wave-7 extra doors | `bossIds` on Slide Tile / Pawn Trade / Fan Bolt / Hex Toll | Do not extra-door #411 ids from Wave-7 kits; do not grant Gale Fan from Wedge; first grant wins |
| V. Wave 8 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 8 ids to `BOSS_IDS` without kits. No new #137 spell ids. Facing pin requires the `currentView` battle-walk writer (#411). Extra cell is not a second enemy. |
| W. Rush Table F | New 4-room table after Table E clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, or E0–E3 |
| X. #411 Wave-8 extra doors | `bossIds` on Facing Pin / Span Guard / Cover Step / Low Lintel; roster notes for Mute Thread / Queue Cut / File Vault | Do not extra-door #463 ids; do not grant Oncoming / Glance Cut from Gaze; do not grant Twin Span / Span Pylon from Span; do not re-stamp Mute Thread / Queue Cut / File Vault; first grant wins |
| Y. Wave 9 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 9 ids to `BOSS_IDS` without kits. No new #137 spell ids. Hinge swap is painter↔enterer occupancy, **not** `swapPositions`. Aim Veil reject is targeting, not a fizzle. Oath gate is `id === "physical_attack"`. |
| Z. Rush Table G | New 4-room table after Table F clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, or F0–F3 |
| AA. #463 Wave-9 extra doors | `bossIds` on Exit Tithe / Hinge Tile / Aim Veil / Oath Blade | Do not extra-door #525 / #563 ids; do not grant Twin Span / About Face / File Reel / Hinge Step / Post Sting from these sheets; do not remap `exit_mason` / `hinge_porter` / `oath_censor`; first grant wins |
| AB. Wave 10 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 10 ids to `BOSS_IDS` without kits. No new #137 spell ids. Pit convert is occupancy, not HP. Must Pace fail-closed on missing walk-spend. Triple Span keys `summonAI === "triplespan"`. Pivot is occupancy teleport, **not** `swapPositions`. |
| AC. Rush Table H | New 4-room table after Table G clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, or G0–G3 |
| AD. #525 Wave-10 extra doors | `bossIds` on Pit Wick / Must Pace / Triple Span / Pivot Foe | Do not extra-door remaining #525 ids or any #563 ids from Wave-10 sheets; do not grant Open Pit / Fuse / Span Guard / Twin Span / Hinge Tile / Knight Slip from Crypt / March / Aisle / Orbit; do not remap `wick_mason` / `pace_prelate` / `span_triune` / `slip_castellan`; first grant wins |
| AE. Wave 11 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 11 ids to `BOSS_IDS` without kits. No new #137 spell ids. Gait Seal fail-closed on missing walk-spend. Diag Lock filters **walks** only. Brick Shift keys `barrierTiles`, never world walls. Return Sting consumes before HP write. |
| AF. Rush Table I | New 4-room table after Table H clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, or H0–H3 |
| AG. #563 Wave-11 extra doors | `bossIds` on Gait Seal / Diag Lock / Brick Shift / Return Sting | Do not extra-door remaining #563 ids or any #636 ids **from Wave-11 sheets**; do not grant Rank Lock / Must Pace / Gait Mend / Mirror / Cover from those sheets; do not remap `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`; first grant wins |
| AH. Wave 12 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 12 ids to `BOSS_IDS` without kits. No new #137 spell ids. Gait Mend fail-closed on missing walk-spend. Pair Hinge is occupancy dests, **not** `swapPositions`. Mend Wick is a pad table, not `hazardTiles`. Body Mark consumes before HP write. |
| AI. Rush Table J | New 4-room table after Table I clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, or I0–I3 |
| AJ. #563 Wave-12 extra doors | `bossIds` on Gait Mend / Pair Hinge / Mend Wick / Body Mark | Do not extra-door leftover #563 ids or any #636 / #695 / #726 ids **from Wave-12 sheets**; do not grant Font / Fuse / Sole / March / Pivot / Hinge Tile / Pawn Trade / tile Mark from Infirm / Yoke / Salve / Brand; do not remap `gait_cantor` / `pair_usher`; first grant wins |
| AK. Wave 13 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 13 ids to `BOSS_IDS` without kits. No new #137 spell ids. Flush cannot target the caster. Isolation is same-side only. Plate delay is *his* next turn start. Lend does not splice the turn queue. |
| AL. Rush Table K | New 4-room table after Table J clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, or J0–J3 |
| AM. #563 Wave-13 extra doors | `bossIds` on Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend | Do not extra-door Dummy Post / Enter Mend / Split Mend / Court Hinge or any #636 / #695 / #726 ids; do not grant Cadence Crack / Break / Timestep / Surplus / Ward Plate / Morrow Step / Purse Cut from Flush / Lone / Plate / Lend; do not remap `flush_precentor` / `gait_cantor` / `pair_usher` / `dummy_castellan`; first grant wins |
| AN. Wave 14 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 14 ids to `BOSS_IDS` without kits. No new #137 spell ids. Dummy taunt is a cast-target filter, not Goad. Enter occupant-already-there does not trigger. Split primary is never the caster. Quiet filter is `isPhysical` / `physical_attack` only. |
| AO. Rush Table L | New 4-room table after Table K clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, or K0–K3 |
| AP. Wave-14 extra doors | `bossIds` on Dummy Post / Enter Mend / Split Mend / Quiet Sill | Do not extra-door Court Hinge or remaining #636 / any #695 / #726 / #787 ids **from Wave-14 sheets**; do not grant Goad / Bait / Font / Mend Wick / Gait Mend / Oath / Quiet Hex from Effigy / Enter / Split / Quiet; do not remap `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `shove_cantor` / `keep_bursar`; first grant wins |
| AQ. Wave 15 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 15 ids to `BOSS_IDS` without kits. No new #137 spell ids. Extra shove never targets the player. Exit enter does not tick. Stretch cap 8. Far Hood 1–2 hits do not consume. |
| AR. Rush Table M | New 4-room table after Table L clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, or L0–L3 |
| AS. Wave-15 extra doors | `bossIds` on Shove Mend / Exit Sting / Cadence Stretch / Far Hood | Do not extra-door Court Hinge / Court Stretch or remaining #636 / any #695 / #726 / #787 / #849 ids; do not grant Gait Mend / Chase Mend / Enter Mend / Heave Mend / Exit Tithe / Ingress Mark / Flush / Stall / Sidestep from Jostle / Peel / Dilate / Hood; do not remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `keep_bursar`; first grant wins |
| AT. Wave 16 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 16 ids to `BOSS_IDS` without kits. No new #137 spell ids. Forced-move does not detonate Gait Wick. Dry leftover is the target’s bar. Home Step is occupancy dest, not `swapPositions`. Must Span illegal walk spends 0 MP. |
| AU. Rush Table N | New 4-room table after Table M clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, or M0–M3 |
| AV. Wave-16 extra doors | `bossIds` on Gait Wick / Dry Sting / Home Step / Must Span | Do not extra-door Court Hinge / Court Stretch / Quad Span or remaining #636 / any #695 / #726 / #787 / #849 ids; do not grant Boot Sting / Post Sting / Fuse / Must Pace / Empty Plate / Hinge Step / Morrow Step / Rank Lock / Diag Lock from Wick / Dry / Hearth / Must; do not remap `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `keep_bursar`; first grant wins |
| AW. Wave 17 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 17 ids to `BOSS_IDS` without kits. No new #137 spell ids. Forced-move does not fizzle Boot Lend. Purse Keep is not a queue splice. Tick consume is `dotStacks`, not `dealDamage`. Last Mute fail-closed on missing last-id writer. |
| AX. Rush Table O | New 4-room table after Table N clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, or N0–N3 |
| AY. Wave-17 extra doors | `bossIds` on Boot Lend / Purse Keep / Tick Plate / Last Mute | Do not extra-door Court Hinge / Court Stretch / Quad Span / Pair Slide or any #695 / #726 / #787 / #849 ids; do not grant Spare Pace / Gift Sill / Leftover Lend / Purse Cut / Timestep / Morrow Plate / Mute Thread / Oath Blade from Boot / Purse / Tick / Mute; do not remap `keep_bursar` / `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `court_stretch_regent`; first grant wins |
| AZ. Wave 18 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 18 ids to `BOSS_IDS` without kits. No new #137 spell ids. Pair Slide dests are occupancy, **not** `swapPositions`. Forced-move does not arm Both Mend. Walk does not arm Heave Mend. Leftover AP does not arm Parched Mend. Dest onto lava / spike is illegal AI until MIMA-001 / 005. |
| BA. Rush Table P | New 4-room table after Table O clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, N0–N3, or O0–O3 |
| BB. Wave-18 extra doors | `bossIds` on Pair Slide / Both Mend / Heave Mend / Parched Mend | Do not extra-door Court Hinge / Court Stretch / Quad Span or remaining #695 / #726 / #787 / any #849 / #1063 ids; do not grant Pair Hinge / Pawn Trade / Slide Tile / Shove Mend / Gait Mend / Chase Mend / Heave Step / Dry Mend / Dry Sting / Dry Gait from Slide / Both / Heave / Parched; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `shove_cantor` / `keep_bursar` / `span_quad` / `court_stretch_regent`; first grant wins (Parched Mend vs Dry Gait leftover-MP=0 heal) |
| BC. Wave 19 kits | New `BossId`s + kits only when `spellData` already has the verbs **or** the kit stays on the live 32 | Do not add Wave 19 ids to `BOSS_IDS` without kits. No new #137 spell ids. Stride Keep / Dual Keep pay at next own turn start, **not** a queue splice. Imprint is id-match copy; target keeps remaining. Damp leftover is walk MP ≥ 2, not leftover AP. |
| BD. Rush Table Q | New 4-room table after Table P clear | Do not rewrite rooms 0–9, B0–B3, C0–C3, D0–D3, E0–E3, F0–F3, G0–G3, H0–H3, I0–I3, J0–J3, K0–K3, L0–L3, M0–M3, N0–N3, O0–O3, or P0–P3 |
| BE. Wave-19 extra doors | `bossIds` on Stride Keep / Dual Keep / Cadence Imprint / Damp Sting | Do not extra-door Court Hinge / Court Stretch / Court Keep / Court Dual / Court Imprint / Quad Span / Penta Span or remaining #695 / #726 / #787 / any #849 / #1063 ids; do not grant Purse Keep / Timestep / Cadence Theft / Halve / Trim / Stretch / Flush / Dry Sting / Ready Sting / Lean Sting / Dry Gait from Stride / Dual / Imprint / Damp; do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar` / `court_keep_regent` / `court_dual_regent` / `court_imprint_regent` / `pair_usher` / `both_cantor` / `parched_cantor` / `span_quad`; first grant wins |

**Spell metadata checklist** for every new discoverable:

- `id`, `effectType`, `spellType`, `targetType`, `areaShape`
- `usableByPlayer: true` only after the unlock gate
- Explicit flags (`isOncePerBattle`, `isSpikeGlyph`, `echoDenyIds`) — never parse `name`
- No `wp` / `wr` / `scp`
- Add the id to `SPELL_ID_CATALOG` **and** `spellData.ts` in the same PR
- `validateBossKits()` must still pass (discoverables are **player** spells, not forced into every kit)

**Persist:** observation counters and unlocks belong next to `achievementProgress` (principal-keyed), not `pbv_boss_configs` in `localStorage`.

**Character-update payloads** still need every `CharacterStats` field including `killCount`.

---

## 12. Global QA matrix

| # | Check | Pass condition |
| :--- | :--- | :--- |
| 1 | No-cap smoke | At playerLevel 1, 10, 25, 50: even-match fight ends in the turn band from §3.2, not 3 turns and not 40. |
| 2 | Diff table | Guide offsets `[-2, 0, +2, +5]` still render; HP column tracks `hpBudget`, not catalog 350. |
| 3 | Enrage | No HP added. +80% cap. Clock from relative difficulty. Pendulum can delay, not delete. |
| 4 | Extra XP | Larvae, ghosts, scrolls, phantoms, wisps, split twins, objects = 0 victory XP. Twins of Midnight share one grant. Twin Monarchs = two boss grants. |
| 5 | Final Pawn | Invuln = 3 turns. 4 ghosts. Multiplier ≠ 999. Victory with ghosts alive. |
| 6 | Starved | HP never exceeds 200% start. Phase 2 can fire from drain quota. |
| 7 | Void | 8th anchor drops immunity same turn. Enrage can self-shatter leftovers. |
| 8 | Discovery | Blind kill does not unlock. Observation + victory (+ feat/challenge where required). |
| 9 | Challenges | Hazard / reflect / lava / spike still hit `recordChallenge*` helpers. Fizzle spends AP. |
| 10 | Kits | Every shipped id still 3–5 catalog spells; Phase 2 adds one; sets unique. |
| 11 | Rush room 9 | `weeping_pawn_2` remaps to `second_lament`. Two growth caps. Both objects destructible. |
| 12 | Actor | No 15-field stats. Canonical `main.mo`. Rewards via `applyRewards`. |
| 13 | Admin | Config editors stay gated. Unlock is not an admin checkbox for normal players. |
| 14 | Typecheck | `pnpm typecheck` / `pnpm check` / `pnpm fix` / `pnpm build` clean when code lands. |
| 15 | Table B | Hex never on lance glow. Silence on punched lanes only. Fuses skip pendulum-sweep turns. Attract pairs still illegal. |
| 16 | Wave-4 objects | Brazier / Snuffer / Crown / Wellhead are not enemies, 0 XP. Decoy death ≠ victory. Enrage pit does not seal spawn. |
| 17 | MIMA prereq | Slide / well / ram / morrow **position** works; ice-tax, fuse-tick, and hazard-on-shove stay off until MIMA-001 / 005. |
| 18 | Table C | Hex never on ram ray. Pits never on lance glow. Silence rotates to the current file (no forced walk). Taunt never forces the painted landing. |
| 19 | Wave-5 objects | Brace / Causeway / Ledger / Hour-bell are not enemies, 0 XP. Pits stay LoS-open. `movedThisTurn` ignores Swap in Stride P1. Two bodies never share Morrow’s landing. |
| 20 | Table D | Fuses never on the locked file. Silence never on the Vicar’s file. Enemy font ≠ Cord gate. Leftover check skips pendulum-sweep telegraph turns. |
| 21 | Wave-6 objects | Compass / Censer / Bowl-lid / Audit-bell are not enemies, 0 XP. Pylon death ≠ victory. Font death ≠ victory. Off-axis walk rejects before MP debit. Leftover reads current AP at turn end. |
| 22 | Table E | Mill never on a sounding file. Swap never into a sealed pocket. Cone never on lance glow. Tax is not a pit-step. |
| 23 | Wave-7 objects | Hopper / Abacus / Lectern / Tithe-box are not enemies, 0 XP. Decoy death ≠ victory. Slide distance 1. Cone is `areaShape: "cone"`, not a Chebyshev blob. Physical Strike does not consume Hex Toll. |
| 24 | Table F | Pin never on hook glow. Ram never occupies both span cells. Fuses never on the martyr tile. Lintel never on the start tile. |
| 25 | Wave-8 objects | Crosier / Truss / Bier / Transom are not enemies, 0 XP. Extra cell is not a victory target. Wisp death ≠ victory. Missing `currentView` never pins. High-HP lintel walk spends MP, no spike-tick. Strike redirects. DoT ticks do not consume Cover. |
| 26 | Table G | Tithe never on lance glow. Hinge never into a sealed pocket. Fuses never on the veiled tile. Brand telegraph never on the ram ray. |
| 27 | Wave-9 objects | Stoop / Peg / Cowl / Paten are not enemies, 0 XP. Forced-move leave is free (Toll). Dead painter = no swap. Rejected primaries spend 0 AP. Oath fizzle spends AP. Gate is `id === "physical_attack"`. |
| 28 | Table H | Wick/pit never on lance glow. Required step stays on the sounding file. Ram never occupies all living posts. Pivot dest never into a sealed pocket. |
| 29 | Wave-10 objects | Grate / Pulpit / Rood / Ambit are not enemies, 0 XP. Convert does not displace or debit challenge HP. Must Pace fizzle spends AP. Forced-move is not walk MP. Posts 0 XP, chain filter on dest. Pivot is not `swapPositions`. Clockwise only. |
| 30 | Table I | Seal never on hook glow. Mill never on a legal diagonal step. Brick dest never on the pin telegraph. Cone never on the Alms-dish. |
| 31 | Wave-11 objects | Thurible / Quoin / Mortar / Alms-dish are not enemies, 0 XP. Walk reject spends 0 MP. Forced-move legal under seal / diag. World walls are not brick sources. Dest occupied = skip. Return consume before HP write. Lava/fuse do not consume. DoT apply consumes; ticks do not. |
| 32 | Table J | Tithe-box never on Infirmary. Pair dests never on the Cowl. Bait intercept never on the pad. Oath telegraph never on the Stylus. |
| 33 | Wave-12 objects | Infirmary / Yoke-pin / Salver / Stylus are not enemies, 0 XP. Forced-move ≠ walk MP. Pair hinge is not `swapPositions`. Pad tick is heal. Body Mark amp is the challenge debit. Decoy death ≠ victory. |
| 34 | Table K | Crosier never on Psalter. Posts never on Ambo. Brace never on Aumbry. Mortar never on Coffer. |
| 35 | Wave-13 objects | Psalter / Ambo / Aumbry / Coffer are not enemies, 0 XP. Cannot self-flush. Isolation is same-side only. Absorb ≠ heal. Lend `n = 0` still observes. Enrage −1 AP hits `recordChallengeApSpend`. |
| 36 | Table L | Compass never on Mannequin. Ledger never on Narthex. Gate never on Pyx. Spike dest never on Muffler. |
| 37 | Wave-14 objects | Mannequin / Narthex / Pyx / Muffler are not enemies, 0 XP. Post death ≠ victory. Standing occupant does not trigger Enter. Split self-primary illegal. Quiet Attack Nearest from the sill refuses. |
| 38 | Table M | Abacus never on Stole. Exit sting never on lance glow. Tithe-box never on Antiphoner. Hex never on Capuche. |
| 39 | Wave-15 objects | Stole / Stoup / Antiphoner / Capuche are not enemies, 0 XP. Player is never the jostle shove target. Enter does not tick Exit Sting. Stretch cap 8. Far Hood 1–2 hits do not consume. DoT does not consume Far Hood. |
| 40 | Table N | Pulpit never on Cresset. Stones never on Cruet. Bier never on Andiron. Quoin never on Ell. |
| 41 | Wave-16 objects | Cresset / Cruet / Andiron / Ell are not enemies, 0 XP. Forced-move does not detonate Gait Wick. Dry leftover is the target’s bar. Home Step is not `swapPositions`. Must Span illegal walk spends 0 MP. Diagonal 1,1 is Manhattan 2. |
| 42 | Table O | Compass never on Caliga. Metronome never on Cista. Split-rook never on Plaster. Antiphoner never on Tabula. |
| 43 | Wave-17 objects | Caliga / Cista / Plaster / Tabula are not enemies, 0 XP. Novice death ≠ victory. Forced-move does not fizzle Boot Lend. Purse Keep is not a queue splice. Tick consume is `dotStacks`. Last Mute refuse spends 0 AP. Missing last-id writer fail-closed. |
| 44 | Table P | Stoup never on Litter. Shock dest never on Gaiter. Hopper never on Spit. Cruet never on Flagon. |
| 45 | Wave-18 objects | Litter / Gaiter / Spit / Flagon are not enemies, 0 XP. Wolf / novice death ≠ victory. Pair Slide is not `swapPositions`. Forced-move does not arm Both Mend. Walk does not arm Heave Mend. Leftover AP does not arm Parched Mend. Dest onto hazard is illegal AI until MIMA-001 / 005. Exit Sting leave-tick is paint. |
| 46 | Table Q | Compass never on Scrip. Tithe-box never on Bourse. Tabula never on Platen. Hex never on Sump. |
| 47 | Wave-19 objects | Scrip / Bourse / Platen / Sump are not enemies, 0 XP. Novice death ≠ victory. Stride Keep / Dual Keep are not queue splices. Dual skip if either leftover is 0. Imprint empty intersection fizzles. Damp leftover AP does not arm the +10. |

---

## 13. Out of scope

- Production TypeScript / Motoko for any of the above.
- New CharacterStats fields.
- Changing `xpForNextLevel`.
- Rewriting Boss Rush room order (except the room-9 **id remap** in slice I). Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, Table O, Table P, and Table Q are additive.
- Making every spectacular mechanic player-usable.
- New #137 spell ids (Wave 3 reuses #120; Wave 4 reuses #133; Wave 5 reuses #120 / #282 / #342; Wave 6 reuses #282 / #342; Wave 7 reuses #282; Wave 8 reuses #411; Wave 9 reuses #463; Wave 10 reuses #525; Wave 11 reuses #563 Gait Seal / Diag Lock / Brick Shift / Return Sting; Wave 12 reuses remaining #563 Gait Mend / Pair Hinge / Mend Wick / Body Mark; Wave 13 reuses leftover #563 Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend; Wave 14 reuses leftover #563 Dummy Post / Enter Mend / Split Mend and #636 Quiet Sill; Wave 15 reuses remaining #636 Shove Mend / Exit Sting / Cadence Stretch / Far Hood; Wave 16 reuses remaining #636 Gait Wick / Dry Sting / Home Step / Must Span; Wave 17 reuses remaining #636 Boot Lend / Purse Keep / Tick Plate / Last Mute; Wave 18 reuses remaining #636 Pair Slide and leftover #695 Both Mend / #726 Heave Mend / #787 Parched Mend; Wave 19 reuses leftover #695 Stride Keep / Damp Sting and leftover #726 Dual Keep / leftover #787 Cadence Imprint).
- Deploying or “fixing” `backend_extended/`.
- Wiring Swap × hazards or push/pull × hazards (MIMA owns those PRs).
- Granting Gale Fan, Twin Gate, Cut In, After Verse, Sanguine Toll, Draw Together, or Eclipse Fold from Wave-5 / Wave-6 / Wave-7 / Wave-8 sheets (#342 already stamped those doors on shipped bosses).
- Extra-dooring #411 Wave-5 tactical ids from Wave-7 sheets (Wave 8 extra-doors Facing Pin / Span Guard / Cover Step / Low Lintel only).
- Extra-dooring #463 Wave-6 tactical ids (`spell-post-sting` … `spell-about-face`) from Wave-8 sheets (Wave 9 extra-doors Exit Tithe / Hinge Tile / Aim Veil / Oath Blade only).
- Granting Oncoming / Glance Cut from Gaze, Twin Span / Span Pylon from Span, or restamping Mute Thread / Queue Cut / File Vault as Wave-8-only doors.
- Extra-dooring #525 Wave-7 or #563 Wave-8 tactical ids from Wave-9 sheets.
- Granting Twin Span / About Face / File Reel / Hinge Step / Post Sting / Purse Cut / Turn Cap from Toll / Hinge / Veil / Oath, or remapping `exit_mason` / `hinge_porter` / `oath_censor` / `about_regent` onto these sheets.
- Extra-dooring remaining #525 ids (Wall Sting / File Brand / Boot Sting / Shove Face / Knight Slip / Cadence Crack / Once Verse / Tick Hood / Flank Share / Spare Pace / Exit Boon / Court Shove) or any #563 ids from Wave-10 sheets.
- Granting Open Pit / Fuse Tile / Span Guard / Twin Span / Hinge Tile / Knight Slip from Crypt / March / Aisle / Orbit, or remapping `wick_mason` / `pace_prelate` / `span_triune` / `slip_castellan` onto these sheets.
- Extra-dooring leftover #563 ids (Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend / Dummy Post / Enter Mend / Split Mend / Court Hinge) or any #636 / #695 / #726 ids **from Wave-12 sheets**.
- Extra-dooring remaining leftover #563 ids (Dummy Post / Enter Mend / Split Mend / Court Hinge) or any #636 / #695 / #726 ids **from Wave-13 sheets**.
- Extra-dooring Court Hinge or remaining #636 (except Quiet Sill) / any #695 / #726 / #787 ids **from Wave-14 sheets**.
- Extra-dooring Court Hinge / Court Stretch or remaining #636 (Quad Span / Gait Wick / Dry Sting / Home Step / Must Span / Boot Lend / Purse Keep / Tick Plate / Last Mute / Pair Slide) / any #695 / #726 / #787 / #849 ids from Wave-15 sheets.
- Extra-dooring Court Hinge / Court Stretch / Quad Span or remaining #636 (Boot Lend / Purse Keep / Tick Plate / Last Mute / Pair Slide) / any #695 / #726 / #787 / #849 ids from Wave-16 sheets.
- Extra-dooring Court Hinge / Court Stretch / Quad Span / Pair Slide or any #695 / #726 / #787 / #849 ids from Wave-17 sheets.
- Extra-dooring Court Hinge / Court Stretch / Quad Span or remaining #695 (except Both Mend) / remaining #726 (except Heave Mend) / remaining #787 (except Parched Mend) / any #849 ids from Wave-18 sheets.
- Extra-dooring Court Hinge / Court Stretch / Court Keep / Court Dual / Court Imprint / Quad Span / Penta Span or remaining #695 (except Stride Keep / Damp Sting) / remaining #726 (except Dual Keep) / remaining #787 (except Cadence Imprint) / any #849 / #1063 ids from Wave-19 sheets.
- Granting Purse Keep / Timestep / Pack Stride / Cadence Theft / Halve / Trim / Stretch / Flush / Dry Sting / Ready Sting / Lean Sting / Dry Gait from Stride / Dual / Imprint / Damp, or remapping `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar` / `court_keep_regent` / `court_dual_regent` / `court_imprint_regent` onto Wave-19 sheets.
- Granting Pair Hinge / Pawn Trade / Slide Tile / Draw Together / Shove Mend / Gait Mend / Chase Mend / Heave Step / Pair Pace / Home Step / Dry Mend / Still Mend / Dry Sting / Dry Gait from Slide / Both / Heave / Parched, or remapping `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` / `keep_bursar` / `shove_cantor` / `span_quad` / `court_stretch_regent` onto Wave-18 sheets.
- Granting Spare Pace / Gift Sill / Leftover Lend / Cadence Lend / Purse Cut / Timestep / Late Purse / Morrow Plate / Tick Hood / Mute Thread / Oath Blade / Once Verse / Hex of Silence from Boot / Purse / Tick / Mute, or remapping `keep_bursar` / `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `court_stretch_regent` onto Wave-17 sheets.
- Granting Boot Sting / Post Sting / Fuse / Pit Wick / Must Pace / Empty Plate / Purse Cut / Hinge Step / Morrow Step / Cover Step / Rank Lock / Diag Lock from Wick / Dry / Hearth / Must, or remapping `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `keep_bursar` / `court_stretch_regent` onto Wave-16 sheets.
- Granting Gait Mend / Chase Mend / Enter Mend / Heave Mend / Exit Tithe / Ingress Mark / Shove Sting / Cadence Flush / Stall / Sidestep / Near Hood from Jostle / Peel / Dilate / Hood, or remapping `shove_cantor` / `stretch_precentor` / `dummy_castellan` / `span_quad` / `keep_bursar` / `court_stretch_regent` onto Wave-15 sheets.
- Granting Goad / Bait Pylon / Font / Mend Wick / Gait Mend / Oath Blade / Quiet Hex from Effigy / Enter / Split / Quiet, or remapping `dummy_castellan` / `flush_precentor` / `gait_cantor` / `pair_usher` / `shove_cantor` / `keep_bursar` / `court_hinge_regent` onto Wave-14 sheets.
- Granting Rank Lock / Must Pace / Gait Mend / Mirror / Cover / Palisade from Sole / Bias / Brick / Rebound, or remapping `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` onto Wave-11 sheets.
- Granting Font / Fuse / Sole / March / Pivot / Hinge Tile / Pawn Trade / tile Mark from Infirm / Yoke / Salve / Brand, or remapping `gait_cantor` / `pair_usher` onto Wave-12 sheets.
- Granting Cadence Crack / Cadence Break / Timestep / Surplus / Ward Plate / Morrow Step / Purse Cut from Flush / Lone / Plate / Lend, or remapping `flush_precentor` / `dummy_castellan` / `gait_cantor` / `pair_usher` onto Wave-13 sheets.

---

## 14. Source map (read-back)

| Topic | File | Notes |
| :--- | :--- | :--- |
| Ability enum + 2-phase type | `src/frontend/src/types/bossTypes.ts` | `phaseNumber: 1 \| 2`; 46 abilities; 19 `BOSS_IDS` |
| Catalog HP / multipliers | `src/frontend/src/types/bossDefaults.ts` | Final Pawn `statMultiplier: 999`; Starved `hp: 60` |
| Live kits | `src/frontend/src/data/bossKits.ts` | 3–5 of `SPELL_ID_CATALOG`; Phase 2 superset rule |
| AI first-spell loop | `src/frontend/src/hooks/useBossAI.ts` | `pickBossKitSpell` currently wins every turn (empty `Map` at 172+) |
| Ability runtime | `src/frontend/src/hooks/useBossSystem.ts` | Pure reducers |
| Level-diff 1.08 | `src/frontend/src/engine/progression.ts` | Does not budget vs player HP today |
| Player spells | `src/frontend/src/data/spellData.ts` | Explicit metadata; `usableByPlayer` flags; still 32 ids |
| Forced innate catalog | `src/frontend/src/components/WorldExploration.tsx` | 2400–2411 `isBaseSpell: true` |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482 / 537 |
| Line targeting unread by data | `src/frontend/src/engine/targeting.ts` | 580; area still Chebyshev `areaRadius` 695–721 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | `easy_1`…`legendary_3` |
| Feats | `src/backend/lib/admin.mo` `defaultAchievements()` | 15 seeded; no boss-discovery feats yet |
| Backend boss seed | `src/backend/lib/admin.mo` `defaultBossConfigs()` | Stale 12-boss / old spell ids |
| Rush pairings | `src/frontend/src/hooks/useBossRush.ts` | 10 rooms; room 9 `weeping_pawn_2` |
| Guide copy | `src/frontend/src/components/BossGuideModal.tsx` | Ability blurbs for players |
| Discovery pipeline | `docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | Use → observe → win default |
| Tactical ids Wave 1 | `docs/automation/SPELL_PROPOSALS_2026-08-31.md` | 16 #120 spells; Wave 3 / Wave 5 Ram observation sources |
| Tactical ids Wave 2 | `docs/automation/SPELL_PROPOSALS_2026-09-01.md` | 16 #133 spells; Wave 4 + Cinder/Midnight doors |
| Tactical ids Wave 3 | `docs/automation/SPELL_PROPOSALS_2026-09-02.md` (#282) | Open Pit / Stride Brand Wave-5 doors; Rank Lock / Mercy Font Wave-6 doors; Slide Tile / Pawn Trade / Fan Bolt / Hex Toll Wave-7 doors; board-tilt is not an alias |
| Tactical ids Wave 4 | `docs/automation/SPELL_PROPOSALS_2026-09-21.md` (#342) | Morrow Step Wave-5 door; Bait Pylon / Surplus Ward Wave-6 doors; Cut In / After Verse / Sanguine Toll on shipped bosses |
| Tactical ids Wave 5 | `docs/automation/SPELL_PROPOSALS_2026-09-22.md` (#411) | Wave 8 extra-doors Facing Pin / Span Guard / Cover Step / Low Lintel. Mute Thread / Queue Cut / File Vault are shipped-id roster notes. False Cut stays Lament kit-only. |
| Tactical ids Wave 6 | `docs/automation/SPELL_PROPOSALS_2026-09-23.md` (#463) | Wave 9 extra-doors Exit Tithe / Hinge Tile / Aim Veil / Oath Blade. Twin Span / About Face / File Reel / Hinge Step stay off these sheets. |
| Tactical ids Wave 7 | `docs/automation/SPELL_PROPOSALS_2026-09-24.md` (#525) | Wave 10 extra-doors Pit Wick / Must Pace / Triple Span / Pivot Foe. Remaining #525 ids stay off these sheets. |
| Tactical ids Wave 8 | `docs/automation/SPELL_PROPOSALS_2026-09-25.md` (#563) | Wave 11 extra-doors Gait Seal / Diag Lock / Brick Shift / Return Sting. Wave 12 extra-doors Gait Mend / Pair Hinge / Mend Wick / Body Mark. Wave 13 extra-doors Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Wave 14 extra-doors Dummy Post / Enter Mend / Split Mend. Court Hinge stays closed. |
| Tactical ids Wave 9 | `docs/automation/SPELL_PROPOSALS_2026-09-26.md` (#636) | Wave 14 extra-doors Quiet Sill only. Wave 15 extra-doors Shove Mend / Exit Sting / Cadence Stretch / Far Hood. Wave 16 extra-doors Gait Wick / Dry Sting / Home Step / Must Span. Wave 17 extra-doors Boot Lend / Purse Keep / Tick Plate / Last Mute. Wave 18 extra-doors Pair Slide. Remaining #636 (Quad Span / Court Stretch) stay off Wave-18 sheets. Quad Span stays off until occupy-weight. Court Stretch stays `NOT_PLAYER_LEARNABLE`. Pair Slide dest-hazard waits on MIMA-005; P0 pairs with Peel (paint). |
| Tactical ids Wave 10 | `docs/automation/SPELL_PROPOSALS_2026-09-27.md` (#695) | Wave 18 extra-doors Both Mend only. Wave 19 extra-doors Stride Keep / Damp Sting. Remaining #695 (Penta Span … Court Keep, except Damp Sting) stay off Wave-19 sheets. Court Keep stays `NOT_PLAYER_LEARNABLE`. Penta Span stays off until occupy-weight. |
| Tactical ids Wave 11 | `docs/automation/SPELL_PROPOSALS_2026-09-28.md` (#726) | Wave 18 extra-doors Heave Mend only. Wave 19 extra-doors Dual Keep. Remaining #726 (Sept Span … Court Dual, except Dual Keep) stay off Wave-19 sheets. Court Dual stays `NOT_PLAYER_LEARNABLE`. Sept Span stays off until occupy-weight. |
| Tactical ids Wave 12 | `docs/automation/SPELL_PROPOSALS_2026-09-29.md` (#787) | Wave 18 extra-doors Parched Mend only. Wave 19 extra-doors Cadence Imprint. Remaining #787 (Six Span … Court Imprint, except Cadence Imprint) stay off Wave-19 sheets. Court Imprint stays `NOT_PLAYER_LEARNABLE`. Six Span stays off until occupy-weight. |
| Tactical ids Wave 13 | `docs/automation/SPELL_PROPOSALS_2026-10-21.md` (#849) | Not Wave-15, Wave-16, Wave-17, Wave-18, or Wave-19 doors. Court Lag stays `NOT_PLAYER_LEARNABLE`. |
| Long horizon | `docs/automation/LONG_HORIZON_2026-09-01.md` | Live boss HP still static; HUD sat at 48 |
| MIMA | `docs/automation/MECHANIC_INTERACTION_MATRIX_2026-09-21.md` (#336) | Swap × hazards, push/pull × hazards still OPEN |
| Encounter rooms | `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-01.md` | ENC-RUSH remixes Table A; Table B / C / D / E / F / G / H / I / J / K / L / M / N / O / P / Q are separate |

---

**Document status:** PROPOSED. 19 shipped + 4 Wave-2 + 4 Wave-3 + 4 Wave-4 + 4 Wave-5 + 4 Wave-6 + 4 Wave-7 + 4 Wave-8 + 4 Wave-9 + 4 Wave-10 + 4 Wave-11 + 4 Wave-12 + 4 Wave-13 + 4 Wave-14 + 4 Wave-15 + 4 Wave-16 + 4 Wave-17 + 4 Wave-18 + 4 Wave-19 sheets. Rush Table B, Table C, Table D, Table E, Table F, Table G, Table H, Table I, Table J, Table K, Table L, Table M, Table N, Table O, Table P, and Table Q are additive. Safe to review, iterate, and implement in sliced PRs. Not a license to land combat code in this change.
# Enemy and Elite Evolution Design — Wave 18

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-26  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Eighteenth daily pass. **32** new world-pack families that consume **SDE Wave 16 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md`, open PR #1017) **except** Pack Orth / Leap Fold, plus **SPELL_PROPOSALS Wave 17 verbs** (`SPELL_PROPOSALS_2026-10-25.md`, open PR #1063) **except** Court Dock (`NOT_PLAYER_LEARNABLE`). Cadence Floor remains **SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Cadence Cap (`n>2` → `2`) is this pass’s SDE CORE, not Cadence Dock (`n===2` → `0`) and not Cadence Snuff (`n===1` → `0`) and not Cadence Prime (`n===0` → `1`). Prime Gift (leftover **exactly 1/1**) is this pass’s SDE CORE, not Stave Mend (both-body leftover **sum === 5**). Dodeca Span (axis-aligned **3×4**, counts as **twelve**) is this pass’s occupy card. SDE Wave 17 unique CORE (`spell-tern-stride` … `spell-lane-fold`, open PR #1082) stays extras until Wave 19. Bosses stay on the existing catalog.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e9f5/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-3823/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (Wave 5, 15 family sheets — open PR #405; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-ef30/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (Wave 6, 13 family sheets — open PR #452; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-a2f2/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (Wave 7, 14 family sheets — open PR #535; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-8b4d/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md) (Wave 8, 17 family sheets — open PR #558; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e247/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-26.md) (Wave 9, 32 family sheets — open PR #625; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-6cce/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-27.md) (Wave 10, 32 family sheets — open PR #686; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e372/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-28.md) (Wave 11, 32 family sheets — open PR #752; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-00a3/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-29.md) (Wave 12, 32 family sheets — open PR #796; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-design-00d4/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-21.md) (Wave 13, 32 family sheets — open PR #840; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-10-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-design-d355/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-22.md) (Wave 14, 31 family sheets — open PR #899; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-10-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-7dfd/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-23.md) (Wave 15, 31 family sheets — open PR #941; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-10-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-c26b/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-24.md) (Wave 16, 31 family sheets — open PR #997; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-design-c5f7/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-25.md) (Wave 17, 32 family sheets — open PR #1073; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 17

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–17. Wave 17 closed as docs in the 2026-10-25 pass (PR #1073). SPELL_PROPOSALS latest on this cron is Wave 17 (#1063). SDE latest unique-CORE lag is Wave 16 (#1017). Same-day SDE Wave 17 (#1082) is **Wave 19** family CORE. This pass consumes **#1017** unique CORE (minus Pack Orth / Leap Fold) plus **#1063** (minus Court Dock). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥16 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`) at `src/frontend/src/components/WorldExploration.tsx`. Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 17 claim | 2026-10-26 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–17 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16821; void 25% reflect (`castHelpers.ts` 335–337) | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 72–84) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / Tally / Score / **Stave** Post count as **1**. Triple = 3 … Hendeca Span = 11. **Dodeca Span = 12** — skip Dodeca until remaining cap ≥ 12 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Stave Mend / Prime Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `dodecaspan` / `stavepost` (and still no `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938; overworld **draw** WX 8067. **Unread as a combat gate.** | Facing families still fail closed. Wave 18 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 18 CORE rows stay `mpCost: 0`. Stave Lend / Stave Sip / Hymn Turn / Watch Drain rewrite **current leftover AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Rime Reel is the **eleventh** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava, then **ice occupancy**). Brick Hold **does not move** the barrier |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–17 force families still fail closed. Wave 18 adds **zero** new force-gated CORE cards |
| `lastResolvedSpellId` | Absent | `verse_staver` (and Waves 10–17 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` / Wave 16 `cast_toller` still wait. Last Mark reads **last leftover AP spent on the painted cell**, not a new persist stat |
| `walkMpSpentThisTurn` | Absent | Stave\* leftover-sum gates / Prime Gift / Dual Plate / Fresh Sting / Even Gait / Gait Toll fail closed until battle walks write leftover MP |
| One next walk Chebyshev **exactly 2**, knight `(2,1)` **excluded** / next-spell exact Chebyshev **7** / pull toward nearest **ice occupancy** / bonus if share **rank only** / cell detonates on **last leftover AP on it** / leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss / 1-tile **Void Rift** skip / leftover AP **equals max AP** poke / allied-summon **walk-off-file** AP tax / heal-if leftover **AP=1 and MP=1** / remaining `n>2→2` / next **walk** +1 AP if leftover **MP=0** / cannot walk if **barrier adjacent** / overwatch snap **steals 1 leftover MP** / leftover-**MP even ≥ 2** poke / bonus if near **ice occupancy** / target’s next **non-Strike spell** deals 0 | Still absent as CORE identities | Wave 18 secondary opportunity (SDE Wave 16 unique CORE leftover). Pack Orth / Leap Fold stay closed |
| Heal-if both bodies leftover AP + leftover MP **=== 5** / remaining `2` → `0` / axis-aligned **3×4** occupy (twelve) / invert leftover on **two allies** (caster stays) / next hit 0 while sum===5 / sting / join / start-turn occupy / cannot-walk-while-sum===5 / +AP+MP if ally sum===5 (**exits** window) / steal leftover AP iff sum===5 / end-turn occupy sum===5 post / bounce among sum===5 / non-Strike illegal unless sum===5 **and** last AP / last-id illegal until sum===5 | Still absent in live catalog | Wave 18 primary opportunity (SPELL_PROPOSALS Wave 17). Court Dock stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Dual Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Rime Cut is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Rank Bite is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16821) | Only live MP-debit hook. Rime Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Cap is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 335–337) | Only live reflect. Hymn Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 18 families exist so those verbs are **sentences**, not extra HP.

**Wave 1 ids — do not re-propose:**  
`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `crimson_spawn`, `shadow_lurker`, `storm_caller`, `glass_sniper`, `cinder_martyr`, `pale_cantor`, `hex_chorister`, `leash_warden`, `null_censor`, `rift_hook`, `brood_chanter`, `glyph_sower`, `blink_cutter`, `coil_arbiter`, `rust_reaver`.

**Wave 2 ids — do not re-propose:**  
`rank_lancer`, `bash_bruiser`, `snare_weaver`, `trip_mason`, `void_anchoret`, `bell_sexton`, `execute_jackal`, `plate_warden`, `pain_suture`, `stone_castellan`, `ricochet_vicar`, `tax_scribe`, `mist_walker`, `leech_familiar`.

**Wave 3 ids — do not re-propose:**  
`fuse_binder`, `coup_duelist`, `ignite_alchemist`, `dim_optic`, `tempo_precentor`, `ash_absolver`, `plus_cutter`, `rime_mason`, `smoke_thurifer`, `sink_chanter`, `hook_chaplain`, `pylon_prelate`, `goad_herald`, `twin_tether`.

**Wave 4 ids — do not re-propose:**  
`ley_tollkeeper`, `fan_prelate`, `pawn_broker`, `recoil_squire`, `twin_porter`, `sidestep_warder`, `far_stinger`, `soul_siphon`, `pit_mason`, `font_cantor`, `share_optic`, `stride_hunter`, `hex_teller`, `slide_mason`, `axis_locksmith`.

**Wave 5 ids — do not re-propose:**  
`gale_deacon`, `twin_sentry`, `pincer_acolyte`, `oblique_cantor`, `pair_binder`, `ledger_siphon`, `shove_chaplain`, `origin_mason`, `bait_prelate`, `morrow_walker`, `surplus_warder`, `sated_knight`, `verse_scribe`, `misstep_herald`, `bitter_censor`.

**Wave 6 ids — do not re-propose:**  
`oncoming_knight`, `pin_cantor`, `glance_ward`, `gait_muter`, `vault_chaplain`, `span_warder`, `span_prelate`, `cadence_thief`, `brand_plate`, `cover_squire`, `lintel_mason`, `act_teller`, `act_sexton`.

**Wave 7 ids — do not re-propose:**  
`post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`.

**Wave 8 ids — do not re-propose:**  
`wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `triple_span`, `cadence_cracker`, `once_cantor`, `hood_lurker`, `share_warden`, `spare_pacer`, `wick_painter`, `boon_mason`, `dull_censor`, `pet_siller`, `leash_cutter`.

**Wave 9 ids — do not re-propose:**  
`gait_mender`, `pair_porter`, `cadence_flusher`, `lone_stinger`, `morrow_warden`, `gait_sealer`, `diag_locksmith`, `brick_shifter`, `wick_mender`, `return_stinger`, `leftover_lender`, `dummy_prelate`, `enter_mender`, `body_marker`, `split_cantor`, `even_warder`, `hold_knight`, `ground_oather`, `walk_toller`, `purse_locker`, `ally_reeler`, `echo_painter`, `blink_sealer`, `gift_siller`, `split_fanger`, `wall_biter`, `cast_marker`, `still_leasher`, `verse_thief`, `ghost_stepper`, `thin_warder`, `clean_cantor`.

**Wave 10 ids — do not re-propose:**  
`shove_mender`, `cadence_stretcher`, `quad_prelate`, `gait_wicker`, `dry_stinger`, `home_stepper`, `must_spanner`, `far_hooder`, `boot_lender`, `quiet_siller`, `exit_stinger`, `purse_keeper`, `tick_plater`, `last_muter`, `pair_slider`, `odd_warder`, `hold_caster`, `unit_oather`, `rebate_warder`, `foe_reeler`, `echo_wiper`, `field_biter`, `wound_marker`, `split_plater`, `first_verser`, `pit_skipper`, `empty_plater`, `kennel_siller`, `chase_mender`, `cadence_staller`, `crown_cutter`, `full_barer`.

**Wave 11 ids — do not re-propose:**  
`both_mender`, `stride_keeper`, `penta_prelate`, `cadence_trimmer`, `near_hooder`, `gait_sipper`, `cast_siller`, `shove_stinger`, `must_stepper`, `ally_stepper`, `damp_stinger`, `pair_pacer`, `verse_taxer`, `tool_holder`, `spent_lender`, `pair_strider`, `boot_holder`, `near_oather`, `paint_reeler`, `nook_biter`, `stride_marker`, `foe_plater`, `lava_skipper`, `still_plater`, `body_siller`, `clash_mender`, `cadence_shaver`, `gait_taxer`, `brick_wiper`, `watch_muter`, `full_purser`, `pet_cutter`.

**Wave 12 ids — do not re-propose:**  
`heave_mender`, `dual_keeper`, `sept_prelate`, `cadence_halver`, `mid_hooder`, `ready_stinger`, `heave_stepper`, `drift_siller`, `drift_holder`, `drift_lender`, `drift_sipper`, `drift_prelate`, `heave_bouncer`, `must_drifter`, `verse_pacer`, `inch_warder`, `rite_holder`, `long_oather`, `cinder_reeler`, `side_biter`, `ingress_marker`, `off_plater`, `spike_skipper`, `tapped_plater`, `brace_chanter`, `bar_mender`, `cadence_pinner`, `still_taxer`, `brick_sprouter`, `watch_feer`, `lone_purser`, `banner_cutter`.

**Wave 13 ids — do not re-propose:**  
`dry_gaiter`, `cadence_imprinter`, `six_prelate`, `odd_hooder`, `lean_stinger`, `parched_stepper`, `parched_siller`, `dry_holder`, `lean_lender`, `parched_sipper`, `lean_prelate`, `parched_bouncer`, `must_leaner`, `verse_leaner`, `lean_holder`, `diag_warder`, `mid_oather`, `void_reeler`, `foe_biter`, `dwell_marker`, `own_plater`, `cinder_skipper`, `full_plater`, `summon_toller`, `still_mender`, `cadence_rester`, `spent_taxer`, `brick_cracker`, `watch_lender`, `pair_purser`, `escort_cutter`, `dry_mender`.

**Wave 14 ids — do not re-propose:**  
`gaunt_mender`, `cadence_lagger`, `oct_prelate`, `even_hooder`, `gaunt_stinger`, `gaunt_stepper`, `gaunt_siller`, `odd_holder`, `gaunt_lender`, `bare_sipper`, `gaunt_prelate`, `gaunt_bouncer`, `must_gaunter`, `verse_gaunter`, `gaunt_holder`, `orth_warder`, `tri_oather`, `brick_reeler`, `lone_biter`, `wake_marker`, `gait_plater`, `glyph_skipper`, `full_gaiter`, `summon_gaiter`, `still_gifter`, `cadence_gracer`, `debt_caster`, `brick_orbiter`, `watch_almer`, `pair_gaiter`, `axis_cutter`.

**Wave 15 ids — do not re-propose:**  
`poise_mender`, `nine_prelate`, `bar_crosser`, `poise_hooder`, `poise_stinger`, `poise_stepper`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_sipper`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`.

**Wave 16 ids — do not re-propose:**  
`tally_mender`, `cadence_primer`, `dec_prelate`, `purse_turner`, `tally_hooder`, `tally_stinger`, `tally_stepper`, `tally_siller`, `tally_holder`, `tally_lender`, `tally_sipper`, `tally_prelate`, `tally_bouncer`, `must_tallier`, `verse_tallier`, `rank_warder`, `penta_oather`, `spike_reeler`, `screen_biter`, `swap_marker`, `odd_plater`, `mire_skipper`, `odd_stinger`, `summon_verser`, `equal_gifter`, `cast_toller`, `brick_stepper`, `watch_banker`, `tied_gaiter`, `portal_cutter`, `shove_gifter`.

**Wave 17 ids — do not re-propose:**  
`score_mender`, `cadence_snuffer`, `hendeca_prelate`, `duel_turner`, `score_hooder`, `score_stinger`, `score_stepper`, `score_siller`, `score_holder`, `score_lender`, `score_sipper`, `score_prelate`, `score_bouncer`, `must_scorer`, `verse_scorer`, `file_warder`, `hexa_oather`, `lava_reeler`, `file_biter`, `strike_marker`, `dry_plater`, `shock_skipper`, `even_stinger`, `summon_ranker`, `lean_gifter`, `cadence_riser`, `still_toller`, `brick_bracer`, `watch_rooter`, `odd_gaiter`, `spike_cutter`, `summon_plater`.

This Wave 18 family pass consumes **#1017** unique CORE (minus Pack Orth / Leap Fold) plus **#1063** (minus Court Dock). **Wave 19** consumes SDE Wave 17 unique CORE (`spell-tern-stride` … `spell-lane-fold`, except Pack Ring / Lane Fold unless a later boss sheet claims them) plus same-day SPELL_PROPOSALS Wave 18 (`SPELL_PROPOSALS_2026-10-26.md`, open PR #1132: Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn + Sestet court; extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`). This run does not mint colliding `wave18:` spell ids. Same-day 2026-10-26 SPELL_PROPOSALS / SDE stay Wave **19** family CORE — do not clone them here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` / `spell-pack-diag` / `spell-far-fold` / `spell-court-snuff` / `spell-pack-orth` / `spell-leap-fold` / `spell-court-dock` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is Wave 16 CORE. Cadence Rise (`n==1` → `2`) is Wave 17. Cadence Snuff (`n==1` → `0`) is Wave 17. Cadence Cap (`n>2` → `2`) is this pass. Cadence Dock (`n===2` → `0`) is this pass’s **other** remaining rewrite — inverse of leaving a 2 after Cap, not a Floor clone. Cadence Tern (`n>3` → `3`) is SDE Wave 17 — Wave 19.

---

## 1. Shared rules (inherit Wave 1 §2)

This pass does **not** retune `pickEnemyLevelFromTiers` percents, RAF, map generation, turn order, or damage math.

Reuse Wave 1:

- Relative band `R = enemy.level - player.level`, `T = tierSize` (default 10).
- Stat ratios after `calcEnemyMaxHp` / `getEnemyBaseStats` — family HP must **survive** battle start.
- Variant floors: BASE min `aiTier` 1, VETERAN 3, ELITE 6, CHAMPION 8.
- Rarity second roll after level pick (`wVeteran` / `wElite` / `wChampion` vs `R/T` + dungeon depth).
- Rewards: 1.00 / 1.15 / 1.35 / 1.60× on existing `level * 20` XP and Doka, **only** through `applyRewards`.
- Explicit `aiProfile` on every family. Non-healers: no `healAmount` in CORE.
- Preferred chassis forced on family roll.
- `usableByEnemy: false` stays false unless a sheet flips **that one id**.
- Proposed spells are `SpellConfig` rows with flags — never `spell.name` heuristics.

**Fifth variant (Wave 2 specified the 2% `wRare` skin):** palette + **one borrowed RARE spell from this family's allowed categories**. Never borrow a forbidden category. Never a new persist stat. This run does not invent a generator.

**Stationary-post / multi-body cap (extend Wave 17):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** Tally Post **or** Dec Span **or** Score Post **or** Hendeca Span **or** **Stave Post** **or** **Dodeca Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / **Stave Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. Dec Span counts as **ten**. Hendeca Span counts as **eleven**. **Dodeca Span counts as twelve.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, Dec Span, Score Post, Hendeca Span, Stave Post, or Dodeca Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-/eight-/nine-/ten-/eleven-/twelve-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, a Dec Span axis-aligned 2×5, a Hendeca Span stretched plus (7-spine × 5-crossbar, center occupied), **or** a Dodeca Span axis-aligned 3×4, never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, Tally Post, Score Post, and Stave Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole). Hendeca Span occupies **every** cell of the stretched plus (no cage hole; **no diagonal cells**). Dodeca Span occupies **every** cell of the 3×4 (no cage hole). Hendeca click is **center**. Dodeca click is the **cell of the 3×4 closest to the caster** (Dec rule).

**Summon-cap prerequisite (extend Wave 17):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Six Span is illegal until remaining cap ≥ 6. Sept Span is illegal until remaining cap ≥ 7. Oct Span is illegal until remaining cap ≥ 8. Nine Span is illegal until remaining cap ≥ 9. Dec Span is illegal until remaining cap ≥ 10. Hendeca Span is illegal until remaining cap ≥ 11. **Dodeca Span is illegal until remaining cap ≥ 12.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post are legal at remaining ≥ 1. Do not spawn `dodeca_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 17):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / Tally\* leftover-sum / Equal Gift / Tied Gait / Score\* leftover-sum / Lean Gift / Dry Plate / Odd Gait / Even Sting / Still Toll / **Stave\*** leftover-sum / **Prime Gift** / **Dual Plate** / **Fresh Sting** / **Even Gait** / **Gait Toll** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Brick Step / Score Step / **Stave Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 17):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / Tally\* leftover-sum / Odd Plate / Odd Sting / Equal Gift / Tied Gait / Score\* leftover-sum / Even Sting / Lean Gift / **Stave\*** leftover-sum / **Prime Gift** / **Dual Plate** / **Fresh Sting** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3** (2/1, 1/2, 3/0, 0/3 — **not** 2/2), **enables** Score when the surviving banks **sum to 4 and are unequal** (4/0, 0/4, 3/1, 1/3 — **not** 2/2), **cannot enable Stave** (max surviving leftover is 2/2 = sum 4), **enables Dual Plate** when both leftover AP and leftover MP are even and ≥ 2 (2/2 is Dual Plate **and** Poise), and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold (2,1) / (1,2) / (3,0) / (0,3) for Tally. Hold (4,0) / (0,4) / (3,1) / (1,3) for Score. Hold (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3) for Stave. Hold leftover **exactly 1/1** for Prime Gift. `leftover AP = 0` and `leftover MP = 0` is **not** a Stave window, **not** a Score window, **not** a Tally window, and **not** a Poise window. Dual Keep 2/2 is Poise (sum 4 **and** a tie) **and** Dual Plate. Dual Keep 3/1 **is** Score. Dual Keep **cannot** sit on sum 5. Tally Lend (2,1)→(3,2) **manufactures Stave**. Stave Lend (3,2)→(4,3) **exits** to 7. Stave Sip (3,2)→(2,2) **manufactures Poise**; (4,1)→(3,1) **manufactures Score**.

**Last-id prerequisite (extend Wave 17):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / Verse Tally / Summon Verse / Verse Score / **Verse Stave** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 17):** Shove Mark / Drift Gift / Heave\* / Drift\* / Shove Gift fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, Score Step, Stave Step, and Home Step do **not** set the flag. Wave 18 adds **zero** new force-gated CORE cards.

**Facing / Struck prerequisites (partial):** Wave 18 adds **zero** facing CORE cards. Last Mark needs **last leftover AP spent while occupying the painted cell** — fail closed until written. Clash Mend / Strike Debter / Cast Toll still wait on `struckThisTurn`. Strike Mark (Wave 17) still waits on Strike-from-cell.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Stave Mend MULTI child `stave_cantor` — first child wins vs `stave_mender` observe. Cadence Dock MULTI child `dock_precentor` — first child wins vs `cadence_docker` observe. Dodeca Span MULTI child `span_dodeca` — first child wins vs `dodeca_prelate` observe. Court Dock stays `court_dock_regent` kit-only. Ring Stride teach room `ring_gallery` — first child wins vs `ring_warder` observe. Hepta Oath teach room `hepta_nave` — first child wins vs `hepta_oather` observe. Rime Reel teach room `frost_aisle` — first child wins vs `rime_reeler` observe. Last Mark teach room `last_pulpit` — first child wins vs `last_marker` observe. Rift Skip teach room `rift_court` — first child wins vs `rift_skipper` observe. Pack Orth stays `lane_precentor` kit-only. Leap Fold stays `leap_fold_regent` kit-only. Prime Gift / Cadence Cap / Dual Plate / Fresh Sting / Summon File / Gait Toll / Brick Hold / Watch Drain / Even Gait / Rime Cut / Cast Plate / Hymn Turn / Stave Hood / Stave Sting / Stave Step / Stave Sill / Stave Hold / Stave Lend / Stave Sip / Stave Post / Stave Bounce / Must Stave / Verse Stave have **no** extra door — do **not** invent `prime_cantor` / `cap_precentor` retag / `lean_cantor` / `rise_precentor` / `even_gallery` retag / restamp `tally_cantor` / `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor` / `prime_precentor` / `score_cantor` / `stave_cantor` / `snuff_precentor` / `dock_precentor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `rank_precentor`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `diag_precentor`, `far_fold_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`, `hoop_precentor`, `lane_fold_regent`, `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` / `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` / `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` / `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`.

---

## 2. Why Wave 18 exists (gaps Waves 1–17 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag). Wave 15 covered leftover SDE Wave 13 unique CORE (minus Pack File / Diag Fold) + SPELL_PROPOSALS Wave 14 (minus Cadence Floor / Court Floor). Wave 16 covered leftover SDE Wave 14 unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) + SPELL_PROPOSALS Wave 15 (minus Court Prime). Wave 17 covered leftover SDE Wave 15 unique CORE (minus Pack Diag / Far Fold) + SPELL_PROPOSALS Wave 16 (minus Court Snuff).

SPELL_PROPOSALS Wave 17 (#1063) then stamped the holes Wave 17 **held**: both-body leftover AP + leftover MP **=== 5** heal (Stave Mend), remaining `2` → `0` (Cadence Dock), axis-aligned twelve-cell occupy (Dodeca Span), and a two-ally leftover invert (Hymn Turn) plus the Stave court. A G≥17 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 16 unique CORE still had no CORE owner after Wave 17. Seventeen of those verbs fill holes Wave 17 tactical does not: one next walk Chebyshev **exactly 2** (knight excluded), next-spell exact Chebyshev **7**, pull toward nearest **ice occupancy**, bonus if share **rank only**, cell detonates on **last leftover AP**, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss, 1-tile **Void Rift** skip, leftover AP **equals max AP** poke, allied-summon **walk-off-file** AP tax, heal-if leftover **exactly 1/1**, remaining `n>2→2`, next **walk** +1 AP if leftover **MP=0**, cannot walk if **barrier adjacent**, overwatch snap **steals 1 leftover MP**, leftover-**MP even ≥ 2** poke, bonus if near **ice occupancy**, target’s next **non-Strike spell** deals 0. Pack Orth and Leap Fold stay closed.

SDE Wave 17 (#1082) unique CORE stays extras until Wave 19. Cadence Tern (`n>3` → `3`) is **not** Cadence Dock. Gait Gift (leftover AP **≥ 2 AND** leftover MP **= 0**) is **not** Stave Mend. Prime Plate (leftover **1/1** negate) is **not** Dual Plate. Ring Stride is **not** File Stride. Dodeca Span is **not** a twelve-cell hold for a later SDE occupy — #1063 filled that hole.

| Unused Wave 17 / SDE Wave 16 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-stave-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 5**) | `score_mender` (both leftover **sum === 4 AND unequal**); `tally_mender` (both leftover **sum === 3**); `poise_mender` (both leftover **AP === MP ≥ 1**); `prime_gifter` (this pass, leftover **exactly 1/1**); `lean_gifter` (leftover **AP=0 and MP≥1**) | Four leftover reads on an **odd** sum that Dual Keep **cannot** fake. Extra door is `stave_cantor` — family is **`stave_mender`**. Do **not** restamp `score_cantor` / `tally_cantor` / `poise_cantor`. |
| `spell-cadence-dock` (remaining `n===2` → `0`; zeros stay 0; `n===1` and `n>2` unchanged) | `cadence_snuffer` (`n==1` → **0**); `cadence_capper` (this pass, `n>2` → **2** — **twos stay 2**); `cadence_thief` (Floor extra: `n>1` → **1**) | Ready-**unlock of a 2**. Extra door is `dock_precentor` — family is **`cadence_docker`**. Do **not** mint `cadence_floorer` / `deuce_precentor`. |
| `spell-dodeca-span` (axis-aligned 3×4, counts as **twelve**) | `hendeca_prelate` (stretched plus = 11, **center click**); `dec_prelate` (2×5 = 10, **same click rule**); `nine_prelate` (solid 3×3 = 9) | Twelve tiles, 4×3 rectangle, empty kit, **nearest-cell click**. Extra door is `span_dodeca` — family is **`dodeca_prelate`**. Skip until remaining cap ≥ 12. |
| `spell-hymn-turn` (invert leftover AP↔MP on **two allies**; caster unchanged) | `duel_turner` (**two hostiles**); `purse_turner` (**one** hostile); Tempo Invert (ally/self); `bar_crosser` (two-body **cross** through the caster) | Two independent **ally** purses. Sum invariant: Stave stays Stave; Score stays Score; Tally stays Tally; Poise stays Poise. Do **not** mint `spell-choir-turn`. Choir Hymn is a Wave-1 heal. |
| `spell-stave-hood` (next hit is 0 **while leftover AP + leftover MP === 5**, any range) | `score_hooder` (sum === 4 unequal); `tally_hooder` (sum === 3); `dual_plater` (this pass, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**) | Hold (3,2). Dual Keep 2/2 is Dual Plate / Poise Hood, **not** this. |
| `spell-stave-sting` (10 + 8 iff leftover AP + leftover MP === 5) | `score_stinger` (sum === 4 unequal); `tally_stinger` (sum === 3); `even_stinger` (leftover AP **even ≥ 2** — (2,2) is Poise, not Stave) | Punish (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3). 2/2 is Poise / Dual Plate. |
| `spell-stave-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 5) | `score_stepper` (sum === 4 unequal); `tally_stepper` (sum === 3); `home_stepper` (**ungated**) | Join the body that **sums to 5**. Relocate, not `isSwap`. |
| `spell-stave-sill` (occupant sum===5 at **start of their turn** takes 8; paint stays) | `score_siller` (sum === 4 unequal); `tally_siller` (sum === 3); `wake_marker` (start-turn occupy **any leftover**, consume) | Tax the camp **on their turn start** if they held a Stave pair. Dual Keep 2/2 **misses**. |
| `spell-stave-hold` (cannot walk while leftover AP + leftover MP === 5) | `score_holder` (while sum === 4 unequal); `tally_holder` (while sum === 3); `brick_holder` (this pass, **barrier adjacent**) | (0,5) has MP but cannot spend it. Spend leftover AP **or** wait. **Do not PAIR with Must Stave.** |
| `spell-stave-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 5 — **exits** to sum 7) | `score_lender` (+1/+1 if sum === 4 unequal — **exits** to 6); `tally_lender` (+1/+1 if sum === 3 — **exits** to 5, **which is this family’s window**) | Cash the window. Tally Lend **manufactures Stave**. |
| `spell-stave-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 5 and leftover AP ≥ 1) | `score_sipper` (steal iff sum === 4 unequal); `tally_sipper` (steal iff sum === 3); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (3,2) → (2,2) **Poise**. Sip (4,1) → (3,1) **Score**. (0,5) fizzles (no AP). |
| `spell-stave-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 5** deals 10 and it dies) | `score_prelate` (sum === 4 unequal); `tally_prelate` (sum === 3); `dummy_prelate` (taunt) | Camp sum===5 on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "stavepost"`. |
| `spell-stave-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===5 hostile) | `score_bouncer` (second body sum === 4 unequal); `tally_bouncer` (second body sum === 3); Chain Lightning (nearest **any**) | Second 12 needs **two** Stave bodies. Missing flag → 12 only. |
| `spell-must-stave` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 5 **and** this spell spends last AP) | `must_scorer` (sum === 4 unequal / last AP); `must_tallier` (sum === 3 / last AP); `stave_holder` (this pass, **walk** needs sum ≠ 5) | Inverse of Stave Hold. Strike stays legal. **Do not PAIR with Stave Hold.** |
| `spell-verse-stave` (last resolved id **illegal until leftover AP + leftover MP === 5**) | `verse_scorer` (until sum === 4 unequal); `verse_tallier` (until sum === 3); `last_muter` (**duration**) | Recast Inferno only after **sum === 5**. 2/2 and 3/1 and 0/0 do **not** lift. |
| `spell-ring-stride` (**next walk** legal only if Chebyshev **exactly 2**, knight `(2,1)` **excluded**) | `file_warder` (**same x**); `rank_warder` (**same y**); `orth_warder` (**orthogonal**); Pair Stride (Manhattan **2**, includes `(1,1)`, excludes `(2,2)`); Knight Stride (**only** `(2,1)`) | Extra room is `ring_gallery` — family is **`ring_warder`**. One step, Chebyshev 2, not a knight hop. Do **not** name it `ring_gallery` or `rank_lancer`. |
| `spell-hepta-oath` (next spell must be Chebyshev **exactly 7**) | `hexa_oather` (exact **6**); `penta_oather` (exact **5**); `long_oather` (**≥ 3**); Sept Span is occupy-weight 7 | Frost at 1–6 or ≥ 8 fizzles. Strike stays legal. Extra room `hepta_nave` is a teach — family is **`hepta_oather`**. Do **not** name it `hepta_nave` or `sept_prelate`. |
| `spell-rime-reel` (pull 1 toward nearest **ice occupancy**) | `lava_reeler` (toward **lava occupancy**); `spike_reeler` (toward **spike occupancy**); `rime_skipper` (ignore rime **leave-tax**); `rime_mason` (**paints** ice) | Eleventh `applyAttract` dest flavor. Extra room `frost_aisle` is a teach — family is **`rime_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no ice fizzles. |
| `spell-rank-bite` (10 + 10 if share **rank only**) | `file_biter` (share **file only**); `axis_biter` (share rank **or** file); File Lance (linear poke) | Bonus on the rank. File-only → 10 only. Family is **`rank_biter`**. Do **not** name it `rank_warder` or `rank_lancer`. |
| `spell-last-mark` (cell detonates if they spend their **last leftover AP** on it; consume) | `strike_marker` (**Strike from**); `cast_marker` (**spell** confirm); `dwell_marker` (**end-turn occupy**); `ingress_marker` (**walk enter**) | Walk-on is free. Spell-from with leftover AP remaining is free. Last AP from the paint pays. Extra room `last_pulpit` is a teach — family is **`last_marker`**. Do **not** name it `last_muter`. |
| `spell-dual-plate` (next hit is 0 **while leftover AP even ≥ 2 AND leftover MP even ≥ 2**; consume on miss) | `dry_plater` (leftover **MP = 0**); `poise_hooder` (leftover AP **===** leftover MP ≥ 1); `even_stinger` (**damage** if leftover AP even ≥ 2); `stave_hooder` (this pass, leftover **sum === 5**) | Hold (2,2) / (2,4) / (4,2) / (4,4). 0 is even — **excluded**. Family is **`dual_plater`**. Do **not** name it `dual_keeper`. |
| `spell-rift-skip` (next **1-tile** walk ignores **Void Rift** walk-tax) | `shock_skipper` (**shock enter-tax**); `rime_skipper` (**rime leave-tax**); `glyph_skipper` (**glyph-tax**); `rift_hook` (**swap**) | Wrong hazard still ticks. Length ≥ 2 pays. Extra room `rift_court` is a teach — family is **`rift_skipper`**. Do **not** name it `rift_hook`. |
| `spell-fresh-sting` (leftover AP **equals that body’s max AP** → bonus damage) | `full_stinger` (leftover AP **≥ 3**, max unread); `even_stinger` (leftover AP **even ≥ 2**); `gaunt_stinger` (both leftover **0**) | They may have spent down to 3 from a higher max — Fresh Sting **misses** that. Family is **`fresh_stinger`**. |
| `spell-summon-file` (allied summons pay +1 **AP** to **walk off the summoner’s file**) | `summon_ranker` (walk **off rank**); `summon_toller` (+1 AP to start **any** walk); `summon_gaiter` (+1 **MP** to start a walk); Pack File (`ENEMY_ONLY` hard lock) | On-file walks are free of this tax. **Do not PAIR with Summon Rank / Summon Toll / Summon Gait.** Family is **`summon_filer`**. |
| `spell-prime-gift` (heal 10 iff leftover **AP exactly 1 AND leftover MP exactly 1**) | `equal_gifter` (target leftover AP === MP ≥ 1); `lean_gifter` (AP=0 and MP≥1); `stave_mender` (this pass, both leftover **sum === 5**); Hollow / Gaunt (0/0) | Healer CORE only. Dual Keep 1/1 **is** this window if it survives. **No extra door** — do not invent `prime_cantor`. Family is **`prime_gifter`**. Do **not** name it `cadence_primer`. |
| `spell-cadence-cap` (remaining `n>2` → `2`; 0/1/2 unchanged) | `cadence_docker` (this pass, `n===2` → **0**); `cadence_snuffer` (`n==1` → **0**); Floor (`n>1` → 1); `cadence_primer` (`n===0` → 1) | Compress a 5 to a 2. Observe via `cadence_thief` / `hex_chorister`. Do **not** restamp `floor_precentor` / `prime_precentor` / `snuff_precentor` / `dock_precentor` / `cap_precentor` (Pack Cap). Family is **`cadence_capper`**. Do **not** name it `cap_warder`. |
| `spell-gait-toll` (next **walk** +1 AP if leftover **MP = 0**) | `still_toller` (next **spell** +1 AP if leftover MP = 0); `walk_toller` (Wave-7 walk-pool flag); `cast_toller` (next spell after a Strike) | Camp-then-walk. Keep 1 walk MP. Family is **`gait_toller`**. |
| `spell-brick-hold` (cannot **walk** while adjacent to a **barrier**) | `brick_bracer` (**negates a hit** while adjacent); `stave_holder` (this pass, leftover **sum === 5**); `brick_stepper` (**relocates through** the barrier) | Cover-camping walk lock. Destroy the barrier and walks resume; lock **stays** until duration. Family is **`brick_holder`**. Do **not** name it `brick_bracer` or `hold_knight`. |
| `spell-watch-drain` (next **overwatch snap** **steals 1 leftover MP** from the **walker**) | `watch_rooter` (**zeros** leftover MP); `watch_sipper` (**steals leftover AP**); `watch_banker` (**banks leftover AP**); Root Snare is a **tile** root | Ending a walker’s remaining walk mid-path **and** handing the MP to the watcher. **Do not PAIR with Watch Root / Watch Sip / Watch Bank.** Family is **`watch_drainer`**. |
| `spell-even-gait` (leftover **MP even and ≥ 2** → bonus damage) | `odd_gaiter` (leftover MP **odd**); `pair_gaiter` (leftover MP **exactly 2**); `even_stinger` (leftover **AP** even ≥ 2); Dry Sting (leftover MP **= 0**, even, **excluded**) | Poke leftover 2/4. 0 and odd leftover → 10 only. Family is **`even_gaiter`**. Do **not** name it `even_warder` or `even_stinger`. |
| `spell-rime-cut` (10 + 10 if target is Chebyshev ≤ 2 from **ice occupancy**) | `spike_cutter` (**spike occupancy**); `hazard_cutter` (**painted** hazard); `portal_cutter` (**world portals**); `rime_reeler` (**pulls**); `rime_skipper` (**ignores tax**) | Threshold poke. Twin Gate pads are **not** ice. Family is **`rime_cutter`**. |
| `spell-cast-plate` (target’s next **non-Strike spell** deals 0; AP still spent) | `summon_plater` (allied summons treat the **next incoming hit** as 0); Mute Thread (silence-ish); Quiet Hex (ungated next-spell +1 AP) | Strike still deals full. Hit them with Strike, or wait the consume. Family is **`cast_plater`**. Do **not** name it `summon_plater` or `cast_toller`. **Do not PAIR with Summon Plate on one BASE kit.** |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-dock` (`NOT_PLAYER_LEARNABLE`; `court_dock_regent` kit — same law as Court Snuff / Court Prime / Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-orth` (ENEMY_ONLY; stays `lane_precentor` CHAMPION SIGNATURE), `spell-leap-fold` (BOSS_ONLY; `leap_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor / Pack Rank / Rank Fold / Court Prime / Pack Diag / Far Fold / Court Snuff stay where Waves 5–17 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 18 CORE rows are `mpCost: 0`. Stave Sip / Stave Lend / Hymn Turn / Watch Drain rewrite **current leftover AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Stave Post / Last Mark / Cadence Dock / Cadence Cap are **not** queue splices.  
Do **not** family a thirteen-cell occupy this pass. Dodeca Span is the twelve-cell card. Hendeca Span already owns eleven. Dec Span already owns ten. Trideca Span (#1132, occupy-weight 13) is Wave 19.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Tern Stride / Octa Oath / Mire Reel / Diag Bite / Summon Mark / Prime Plate / Slide Skip / Capped Sting / Summon Orth / Gait Gift / Cadence Tern / Odd Toll / Brick Tax / Watch Tax / Thin Gait / Lava Cut / Strike Plate / Pack Ring / Lane Fold (SDE Wave 17 unique CORE — Wave 19).  
Do **not** family Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn / Court Tierce (SPELL_PROPOSALS Wave 18 #1132 — Wave 19). Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` stay kit-only.  
Do **not** family remaining CDs `max(1)` floor as a **second** Cadence Floor. SDE already won that hole.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family remaining `n>2` → `2` as a second Cadence Cap. This pass owns that hole via `cadence_capper`.  
Do **not** family leftover 1/1 heal as `spell-score-gift` / `spell-stave-gift`. Prime Gift is this pass.  
Do **not** family leftover AP − leftover MP === 2 as `spell-skew-*`. (3,1) is Score; (4,2) is Stave.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 17 unique CORE as this pass’s CORE.  
Do **not** mint `wave18:` colliding spell ids.  
Do **not** name the Stave Mend family `stave_cantor`, the Dodeca Span family `span_dodeca`, the Ring Stride family `ring_gallery` or `rank_lancer`, the Hepta Oath family `hepta_nave` or `sept_prelate` or `hexa_oather`, the Rime Reel family `frost_aisle` or `lava_reeler`, the Last Mark family `last_pulpit` or `last_muter` or `strike_marker`, the Cadence Dock family `dock_precentor` or `cadence_floorer`, the Cadence Cap family `cap_precentor` or `cadence_primer` or `cap_warder`, the Prime Gift family `prime_cantor` or `cadence_primer` or `equal_gifter`, the Dual Plate family `dual_keeper`, the Rank Bite family `rank_warder` or `rank_lancer` or `file_biter`, the Rift Skip family `rift_hook`, the Summon File family `summon_ranker` or `file_warder`, the Brick Hold family `brick_bracer` or `hold_knight`, the Watch Drain family `watch_rooter`, the Even Gait family `even_stinger` or `even_warder` or `odd_gaiter`, the Rime Cut family `spike_cutter` / `hazard_cutter` / `rime_reeler`, the Cast Plate family `summon_plater` / `cast_toller`, the Hymn Turn family `duel_turner` / `purse_turner`, or the Gait Toll family `walk_toller` / `still_toller` / `cast_toller`.

---

## 3. Encounter synergy packs (Waves 1–18)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** Score Post **or** Stave Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span **or** Hendeca Span **or** Dodeca Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Stave Choir | `stave_mender` + `verse_staver` + `ignite_alchemist` | Sum===5 8, then Inferno is illegal until leftover AP + leftover MP === 5 |
| Dodeca Plug | `dodeca_prelate` + `stave_siller` + `ring_warder` | 3×4 corridor seal, tax a neighbor at turn start, lock the next walk to Chebyshev 2. Skip until remaining cap ≥ 12 |
| Ring Hepta | `ring_warder` + `hepta_oather` + `glass_sniper` | Next walk must be Chebyshev 2 (not knight), next spell must be exact 7, snipe from 7 |
| Rime Rank | `rime_reeler` + `rank_biter` + `glyph_sower` | Pull toward ice, then bite the rank they now share |
| Last Dual | `last_marker` + `dual_plater` + `goad_herald` | Paint the last-AP cell, then camp leftover even/even behind the miss |
| Rift Fresh | `rift_skipper` + `fresh_stinger` + `tide_shade` | Cross the Void Rift tax, then poke leftover AP === max AP |
| Prime Cap | `prime_gifter` + `cadence_capper` + `font_cantor` | Heal the 1/1 window, then compress remaining n>2 → 2 |
| Gait Brick | `gait_toller` + `brick_holder` + `stone_castellan` | Tax the next walk at leftover MP 0, then lock walks while barrier-adjacent |
| Watch Even | `watch_drainer` + `even_gaiter` + `glass_sniper` | Snap steals leftover MP, then poke leftover-MP-even ≥ 2 |
| Rime Kennel | `rime_cutter` + `summon_filer` + `cast_plater` | Threshold poke near ice, then tax pet walks off file **or** zero the next non-Strike — COURT, never PAIR File + Plate on one BASE kit |
| Hymn Stave | `hymn_turner` + `stave_mender` + `stave_stinger` | Invert two ally purses while keeping sum 5, then heal / sting |
| Dock Verse | `cadence_docker` + `verse_staver` + `tax_scribe` | Unlock remaining 2 → 0, then lock recast until they sit Stave |
| Stave Quiet | `stave_stepper` + `stave_mender` + `cover_squire` | Join the sum===5 ally, then cash the six leftover reads |
| Purse Stave | `hymn_turner` + `stave_sipper` + `score_stinger` | Invert, then sip (4,1)→(3,1) **Score**, then sting the manufactured window |
| Stave Gate | `stave_prelate` + `stave_siller` + `stave_stinger` | Post detonates sum===5 occupy; tile taxes start-of-turn; sting the rest |
| Bounce Stave | `stave_bouncer` + `must_staver` + `fuse_binder` | Two Stave bodies, bounce 12+12 onto the wick |
| Stave Hold File | `stave_holder` + `must_staver` + `leash_warden` | Walk **and** tools need leftover sum === 5 — COURT, never PAIR Stave Hold + Must Stave on the same body without a third peeler |
| Lend Hood | `stave_lender` + `stave_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 7), or hold (3,2) through a miss |
| Cap Dock | `cadence_capper` + `cadence_docker` + `verse_staver` | Compress a 5 to a 2, **then** Dock the 2 to 0 on a **later** turn — COURT, never PAIR Cap + Dock on one BASE kit |
| Dual Fresh | `dual_plater` + `fresh_stinger` + `plate_warden` | Camp even/even miss, then poke leftover AP === max |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood), Wave 16 packs (Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen), and Wave 17 packs (Score Choir, Hendeca Plug, File Hexa, Lava File, Strike Dry, Shock Even, Lean Rise, Still Brace, Watch Odd, Spike Kennel, Duel Score, Snuff Verse, Score Quiet, Purse Score, Score Gate, Bounce Score, Score Hold File, Lend Hood).

Do **not** pack as PAIR (COURT later is fine):

- `stave_mender` + `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `dodeca_prelate` + `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `stave_hooder` + `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` as PAIR
- `stave_stinger` + `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` as PAIR
- `stave_stepper` + `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire`
- `stave_siller` + `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker`
- `stave_holder` + `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_staver` as PAIR / `must_scorer` as PAIR
- `stave_lender` + `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `stave_sipper` + `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `stave_prelate` + `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `hendeca_prelate` / `dec_prelate` / `dodeca_prelate`
- `stave_bouncer` + `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_staver` + `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `stave_holder` as PAIR
- `verse_staver` + `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as PAIR
- `ring_warder` + `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR
- `hepta_oather` + `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `sept_prelate` / `hexa_oather`
- `rime_reeler` + `lava_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `rime_skipper` as PAIR / `rime_mason` as PAIR / `rime_cutter` as PAIR
- `rank_biter` + `file_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `rank_warder` as PAIR / `rank_lancer` as PAIR
- `last_marker` + `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `gait_wicker` / `fuse_binder` / `last_muter`
- `dual_plater` + `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `stave_hooder` as PAIR / `score_hooder` as PAIR / `tally_hooder` as PAIR / `poise_hooder` as PAIR / `dual_keeper` as PAIR
- `rift_skipper` + `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `rift_hook` as PAIR
- `fresh_stinger` + `full_stinger` / `even_stinger` / `odd_stinger` / `gaunt_stinger` / `stave_stinger` / `score_stinger` / `tied_gaiter` / `pair_purser` as PAIR
- `summon_filer` + `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `cast_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `prime_gifter` + `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `cadence_primer` as PAIR
- `cadence_capper` + `cadence_docker` as PAIR / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` / `cap_warder`
- `cadence_docker` + `cadence_capper` as PAIR / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`
- `gait_toller` + `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_holder` + `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `stave_holder` as PAIR / `screen_biter` as PAIR
- `watch_drainer` + `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `even_gaiter` + `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `even_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as PAIR / `even_warder` as PAIR
- `rime_cutter` + `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `rime_reeler` as PAIR / `rime_skipper` as PAIR / `null_censor` as PAIR
- `cast_plater` + `summon_plater` as PAIR / `summon_filer` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR / `dual_plater` as PAIR
- `hymn_turner` + `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR

Do **not** spawn Dodeca Plug on a map with no free 12-cell 3×4 (solvability). Do not spawn Rime Rank / Rime Kennel / Rift Fresh on a map with no ice occupancy / no ice occupancy / no Void Rift cell in Chebyshev 6 of a legal floor. Do not spawn Last Dual without a legal last-AP spender in the pack (`goad_herald` / `ember_knight` / `bash_bruiser`). Do not spawn Rime Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Watch Even without an overwatch band (`glass_sniper` / Hold Ground / Far Watch). Twin Gate pads do **not** count as ice, lava, spikes, Void Rift, or `map.portals`.

---

## 4. Family sheets — Wave 18

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-25.md`](https://github.com/Mr-Melic/stralt/pull/1063) (PR #1063) unless marked SDE Wave 16 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-6033/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md), PR #1017).

---

### ENEMY_ID: `stave_mender`

- **NAME:** Stave Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 5**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Stave Mend (`spell-stave-mend`, #1063). Extra door `stave_cantor` — family is **not** that id. Distinct from `score_mender` (both leftover **sum === 4 AND unequal**), `tally_mender` (both leftover **sum === 3**), `poise_mender` (both leftover **AP === MP ≥ 1**), `prime_gifter` (this pass, leftover **exactly 1/1**), `equal_gifter` (target-only tied ≥ 1), `lean_gifter` (leftover **AP=0 and MP≥1**), `gaunt_mender` (both leftover **0**). At most one six-read heal CORE per pack as PAIR vs Score / Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove / Prime.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 5. Peer: Stave Mend only if both leftover sums === 5 **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise / Dual Plate window — Frost / Shield). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 5**. If it tops the meter, the kit leaked toward Frost. Dual Keep **cannot** fake this.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_5"`. VETERAN: skip if either sum ≠ 5. ELITE: prefer self-cast when the caster already sits on (3,2) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-stave-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Score Mend / Tally Mend / Poise Mend / Equal Gift / Lean Gift / Gaunt Mend / Hollow Gift / Prime Gift.
- **SIGNATURE_MECHANICS:** Four leftover reads. Legal pairs (5,0) (0,5) (4,1) (1,4) (3,2) (2,3). Dual Keep 2/2 is **Poise / Dual Plate**, not Stave. Dual Keep **cannot** sit on sum 5. Tally Lend (2,1)→(3,2) **manufactures** Stave. `healAmount` stays 0 on the Stave Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Hymn Turn / Tally Lend is already in the pack (COURT, not PAIR with Score / Tally / Poise / Prime).
- **SYNERGIES:** `hymn_turner`, `verse_staver`, `stave_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 5; dump to 2/2 (Poise); dump to 3/1 (Score); dump to 3/0 (Tally); dump to 1/1 (Prime Gift); dump to 0/0 (Gaunt); Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (3,2) → (2,2) **Poise**; sit Dual Keep; kill the cantor first; do not hold 5 leftover in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-mend` (MULTI: family observe **or** `stave_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_docker`

- **NAME:** Cadence Docker
- **ROLE:** controller (remaining CDs `n===2` → `0`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Dock (`spell-cadence-dock`, #1063). Extra door `dock_precentor` — family is **not** that id. Distinct from `cadence_snuffer` (`n==1` → **0**), `cadence_capper` (this pass, `n>2` → **2** — **twos stay 2**), `cadence_primer` (`n===0` → `1`), Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0). At most one remaining-2 rewrite CORE per pack as PAIR vs Cap / Snuff / Riser / Primer / Thief / Lagger / Staller / Cracker / Flusher.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≠ 2. Peer: Dock only if a nuke remaining is 2. Above: refuse if the only remaining-2 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **handing the remaining-2 bar back for this tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "dock_if_target_has_remaining_cd_eq_2_on_a_nuke"`. VETERAN: skip all-non-2. ELITE: prefer Inferno remaining 2 over Strike-only. CHAMPION: never Dock a bar you will Cap the same turn (Cap is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-dock`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the docked id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Cap / Cadence Snuff / Cadence Rise / Cadence Prime / Cadence Floor / Cadence Crack
- **SIGNATURE_MECHANICS:** Remaining `2` → `0`. Zeros stay 0. `n===1` unchanged (Snuff). `n>2` unchanged (Cap / Floor). Target keeps every spell. Inverse of leaving a 2 after Cap, not Floor.
- **VARIANT_PROGRESSION:** BASE ready-unlock → VETERAN skip-non-2 → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits sitting on remaining 2 (Inferno). Never CHAMPION in a solo pack with Cap.
- **SYNERGIES:** `verse_staver`, `tax_scribe`, `cadence_capper` (COURT, not PAIR), `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast the remaining-2 id **before** Dock; Cap your remaining 5 to 2 then recast before they Dock; Cadence Break your own remaining after
- **PLAYER_COUNTERPLAY:** Spend the remaining-2 Inferno **now**; sit remaining at 1 (Snuff’s problem) or at 3+ (Cap / Floor’s problem)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-dock` (MULTI: family observe **or** `dock_precentor` first-win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 0 when n===2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dodeca_prelate`

- **NAME:** Dodeca Prelate
- **ROLE:** summoner (twelve-cell occupy, axis-aligned 3×4)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate`. Extra door is `span_dodeca` — family is **not** that id. At most one Dodeca Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 12.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 12 (Frost / Strike). Peer: plant only if all 12 cells are free and the 3×4 splits the player from an exit. Above: refuse if the only 3×4 covers the last portal file (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.10, init 0.85, chc 0.60. Identity is **twelve cells of deny along a 3×4**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `dodecaspan` (#1063): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **twelve** cells of an axis-aligned 3×4 as one combatant id; **every cell occupied**. VETERAN: skip if remaining cap < 12. ELITE: Stave Sill a neighbor. CHAMPION: never punch a 3×4 if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-dodeca-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` only if a long-edge gap needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / ninespan / decspan / hendecaspan / driftpost / leanpost / gauntpost / poisepost / tallypost / scorepost / stavepost on this body.
- **SIGNATURE_MECHANICS:** Click is the **cell of the 3×4 closest to the caster** (Dec rule, **not** Hendeca’s center). Facing = 8-dir caster→click. `|dx| >= |dy|` → 4-file × 3-rank. Else 4-rank × 3-file. Shared occupancy: 12. Diagonal walk around the rectangle is the counter vs Hendeca’s plus.
- **VARIANT_PROGRESSION:** BASE corridor plug → VETERAN cap-check → ELITE neighbor tax → CHAMPION solvability refuse
- **RARITY_CURVE:** Standard. +ELITE on corridor maps. Never CHAMPION in a closet.
- **SYNERGIES:** `stave_siller`, `ring_warder`, `rank_lancer`, `quiet_siller`
- **WEAKNESSES:** Occupy any of the 12 before paint; Coup the one HP pool; walk the long-edge gaps
- **PLAYER_COUNTERPLAY:** Stand on a diagonal of the 3×4; blink / Swap around the block; kill the body (all twelve free)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dodeca-span` (MULTI: family observe **or** `span_dodeca` first-win)
- **REWARD_EXPECTATION:** Standard. Occupy-weight is the tax, not extra Doka.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (multi-cell occupy + cap weight 12; live cap is 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hymn_turner`

- **NAME:** Hymn Turner
- **ROLE:** controller (invert leftover AP↔MP on **two allies**; caster unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Hymn Turn (`spell-hymn-turn`, #1063). No extra door. Distinct from `duel_turner` (two **hostiles**), `purse_turner` (one hostile), `bar_crosser` (two-body **cross** through the caster), Tempo Invert (ally/self), Choir Hymn (Wave-1 Discovery **heal**). At most one leftover-invert CORE per pack as PAIR vs Duel / Purse / Bar / Dual Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack size < 3 (caster + two allies). Peer: invert only if one ally sits (5,0) and another (0,5) **or** (3,2)/(2,3). Above: skip if both leftover pairs are already equal (double no-op) or both 0/0.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **turning two ally purses with the caster’s bar untouched**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "hymn_turn_if_two_non_caster_allies_in_r3_and_at_least_one_unequal"`. VETERAN: skip double-equal / double-empty / missing second ally. ELITE: prefer Stave pairs so Stave Mend / Stave Sting still fire. CHAMPION: never invert if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-hymn-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if both allies sit fat-AP after invert
- **ELITE_SPELL_POOL:** none — do **not** add Duel Turn / Purse Turn / Tempo Invert / Bar Cross / Swap as identity
- **SIGNATURE_MECHANICS:** Not `isSwap`. Caster leftover **unchanged**. Sum invariant on each ally. Target rejects self. Nearest other non-caster ally within Chebyshev 3 of the **target**. Player-side summons **count**.
- **VARIANT_PROGRESSION:** BASE two-ally invert → VETERAN skip-noop → ELITE Stave-bias → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Stave / Score is already in the pack (COURT).
- **SYNERGIES:** `stave_mender`, `stave_stinger`, `stave_sipper`, `score_stinger` (after sip manufactures Score)
- **WEAKNESSES:** Isolate (one ally); keep leftover AP === leftover MP on both; Strike before they recast
- **PLAYER_COUNTERPLAY:** Fight without a second ally; sit 2/2 on both (double no-op); Quiet Hex after they invert into a 3-AP spell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hymn-turn` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (nearest-other ally search + two independent leftover inverts; fail closed if caster would invert)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_hooder`

- **NAME:** Stave Hooder
- **ROLE:** protector (next hit is 0 while leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Stave Hood (`spell-stave-hood`, #1063). Distinct from `score_hooder` / `tally_hooder` / `poise_hooder` / `dual_plater` / `odd_plater` / `dry_plater` / `spent_plater`. At most one leftover-window miss CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 5. Peer: Hood only while sitting (3,2) / (5,0) / (0,5) / (4,1) / (1,4) / (2,3). Above: refuse if Dual Keep banks 2/2 (Poise Hood / Dual Plate’s window).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **holding a sum of 5**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "stave_hood_if_leftover_ap_plus_mp_eq_5"`. VETERAN: skip wrong window. ELITE: Hymn Turn to **keep** sum 5. CHAMPION: never lend into a hit you wanted blanked.
- **CORE_SPELL_POOL:** `spell-stave-hood`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** none — do **not** add Score Hood / Tally Hood / Poise Hood / Dual Plate / Spent Plate / Dry Plate
- **SIGNATURE_MECHANICS:** Any range. Charge remains if the hit arrives off-window. Hit at 2/2 lands (Poise Hood / Dual Plate would blank). Hit at 3/1 lands (Score Hood would blank). Hit at 3/0 lands (Tally Hood would blank). Hit at 1/1 lands (Prime Gift / Poise).
- **VARIANT_PROGRESSION:** BASE window-miss → VETERAN skip-wrong → ELITE keep-sum → CHAMPION no-cash-out
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `hymn_turner`, `stave_holder`, `cover_squire`
- **WEAKNESSES:** Wait until they spend a pool off 5; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force a 3/1 (Score); force a 2/2 (Poise / Dual Plate); don’t hit while they sit (3,2)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-hood` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover sum at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_stinger`

- **NAME:** Stave Stinger
- **ROLE:** assassin (10 + 8 iff leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Stave Sting (`spell-stave-sting`, #1063). Distinct from `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `even_stinger` / `fresh_stinger` / `odd_stinger`. At most one leftover-window poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10-only if leftover sum ≠ 5. Peer: bonus only on (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3). Above: skip the bonus path if Dual Keep banks 2/2.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 1.00, res 0.70, init 1.25, chc 1.10. Identity is **poking a sum of 5**. If it tops the meter without the bonus, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "stave_sting_if_target_leftover_sum_eq_5"`. VETERAN: skip bonus on wrong window (10 still lands). ELITE: Hymn Turn a (5,0) into (0,5) still Stave. CHAMPION: never wait a turn if Strike kills.
- **CORE_SPELL_POOL:** `spell-stave-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the in-window body
- **ELITE_SPELL_POOL:** none — do **not** add Score Sting / Tally Sting / Even Sting / Fresh Sting / Gaunt Sting
- **SIGNATURE_MECHANICS:** 10 ungated. +8 only on sum 5. Dual Keep 2/2 is Poise Sting / Even Sting, **not** this.
- **VARIANT_PROGRESSION:** BASE window-poke → VETERAN skip-wrong-bonus → ELITE keep-sum → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep kits sitting off 5.
- **SYNERGIES:** `hymn_turner`, `stave_holder`, `stave_mender`
- **WEAKNESSES:** Sit 3/1 (Score); sit 2/2 (Poise); sit 3/0 (Tally); sit 0/0 (Gaunt)
- **PLAYER_COUNTERPLAY:** Spend off 5; Dual Keep; body-block the 3-range
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-sting` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one leftover-sum gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_stepper`

- **NAME:** Stave Stepper
- **ROLE:** teleporter (relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Stave Step (`spell-stave-step`, #1063). Distinct from `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `home_stepper` / `heave_stepper`. Relocate, not `isSwap`. At most one leftover-window join CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no in-window ally. Peer: join only if a free neighbor exists. Above: skip if joining would land on a portal / fused cell.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.00, sr 1.00, res 0.75, init 1.20, chc 0.80. Identity is **blink to a five-bar ally**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "stave_step_if_ally_leftover_sum_eq_5_and_a_neighbor_is_free"`. VETERAN: skip no-window / no-neighbor. ELITE: Stave Sill the neighbor they will occupy. CHAMPION: never self-target (Mist Step / Phase Slip).
- **CORE_SPELL_POOL:** `spell-stave-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-mark` on the join cell
- **ELITE_SPELL_POOL:** none — do **not** add Score Step / Home Step / Swap / Twin Gate as identity
- **SIGNATURE_MECHANICS:** Self-target forbidden. Does **not** increment `walkMpSpentThisTurn`. Dual Keep cannot open the window.
- **VARIANT_PROGRESSION:** BASE join-five → VETERAN skip-blocked → ELITE neighbor tax → CHAMPION no-self
- **RARITY_CURVE:** Standard. +ELITE when a Stave ally already sits (3,2).
- **SYNERGIES:** `stave_mender`, `stave_siller`, `cover_squire`
- **WEAKNESSES:** Spend the wisp’s pool; occupy every neighbor; Coup
- **PLAYER_COUNTERPLAY:** Occupy the 3×3 around the (3,2) ally; dump them off 5; Root the stepper
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-step` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum gate + existing relocate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_siller`

- **NAME:** Stave Siller
- **ROLE:** hazard creator (start-of-their-turn occupy tax iff leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Stave Sill (`spell-stave-sill`, #1063). Distinct from `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `last_marker`. At most one leftover-window start-turn tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Barrier if they will not start on 5. Peer: paint only if they will camp (3,2) overnight. Above: skip if Dual Keep will dump them to 2/2 before dawn.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.00, sr 1.00, res 1.00, init 0.95, chc 0.70. Identity is **dawn tax on a sum of 5**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "stave_sill_if_foe_will_start_turn_sum_eq_5_on_tile"`. VETERAN: skip if they will not start on 5. ELITE: Stave Hold so they cannot walk off overnight. CHAMPION: never paint a portal.
- **CORE_SPELL_POOL:** `spell-stave-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on a **different** cell (decoy vs sill)
- **ELITE_SPELL_POOL:** none — do **not** add Score Sill / Wake Mark / Last Mark / Ingress
- **SIGNATURE_MECHANICS:** Walk-enter does **not** tax. End-turn occupy does **not** tax (Stave Post). Relocate landing does **not** tax. Dual Keep 2/2 **misses**. Paint lasts 2 turns.
- **VARIANT_PROGRESSION:** BASE dawn-tax → VETERAN skip-wrong-window → ELITE hold-then-tax → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on camp maps.
- **SYNERGIES:** `stave_holder`, `hymn_turner`, `dodeca_prelate`
- **WEAKNESSES:** Walk off (start-turn only); spend a pool; blink
- **PLAYER_COUNTERPLAY:** Step off before dawn; dump to 3/1 (Score Sill’s problem, not this); Dual Keep overnight
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-sill` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + start-turn leftover-sum gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_holder`

- **NAME:** Stave Holder
- **ROLE:** controller (cannot walk while leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Stave Hold (`spell-stave-hold`, #1063). Distinct from `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `brick_holder` (this pass, **barrier adjacent**). **Do not PAIR with `must_staver`.** At most one leftover-window walk lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 5. Peer: Hold only while they sit (0,5) with walk intent. Above: skip if they already sit (5,0) with no leftover MP.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.80, sr 1.00, res 1.10, init 1.00, chc 0.70. Identity is **cannot walk while sitting on five**. If it tops the meter, the kit leaked toward Root Snare.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "stave_hold_if_target_leftover_sum_eq_5_and_wants_to_walk"`. VETERAN: skip wrong window. ELITE: Hymn Turn (0,5)→(5,0) so they lose the walk MP into leftover AP. CHAMPION: never CORE with Must Stave on this body.
- **CORE_SPELL_POOL:** `spell-stave-hold`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` to cut the only blink dest
- **ELITE_SPELL_POOL:** none — do **not** add Score Hold / Must Stave / Brick Hold / Root Snare
- **SIGNATURE_MECHANICS:** Teleport / Swap / Phase Slip / Twin-gate / Stave Step stay legal (no walk MP). (0,5) has MP but cannot spend it. Dual Keep 2/2 is Poise Hold, **not** this.
- **VARIANT_PROGRESSION:** BASE walk-lock → VETERAN skip-wrong → ELITE invert-then-lock → CHAMPION no-must-clone
- **RARITY_CURVE:** Standard. +ELITE vs high-MP kites.
- **SYNERGIES:** `must_staver` (COURT, not PAIR), `leash_warden`, `hymn_turner`
- **WEAKNESSES:** Cast leftover AP to leave 5; blink; wait 2 turns
- **PLAYER_COUNTERPLAY:** Spend leftover AP; Swap; sit 3/1 (Score Hold’s window)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-hold` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (leftover-sum gate in the walk spender)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_lender`

- **NAME:** Stave Lender
- **ROLE:** buffer (+1 AP and +1 MP iff ally leftover AP + leftover MP === 5 — **exits** to 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Stave Lend (`spell-stave-lend`, #1063). Distinct from `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `tempo_precentor`. At most one leftover-window cash-out CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 5. Peer: lend only if both grants can apply in full (else fail closed). Above: skip if Dual Keep already sits 2/2.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.15, chc 0.70. Identity is **cashing five for seven**. If it tops the meter, the kit leaked toward Haste.
- **AI_TIER_PROGRESSION:** Profile `support`. `aiHint: "stave_lend_if_ally_leftover_sum_eq_5"`. VETERAN: skip wrong window / cap-blocked. ELITE: Tally Lend **into** Stave on a different body (COURT). CHAMPION: never lend into a hit you wanted blanked (Stave Hood).
- **CORE_SPELL_POOL:** `spell-stave-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only after the window already closed
- **ELITE_SPELL_POOL:** none — do **not** add Score Lend / Tally Lend / Haste / Tempo Gift as CORE
- **SIGNATURE_MECHANICS:** (3,2)→(4,3). Inequality is preserved. Cannot manufacture Poise / Score / Tally. Tally Lend **manufactures** Stave. Fail closed if either grant cannot apply in full.
- **VARIANT_PROGRESSION:** BASE cash-out → VETERAN skip-blocked → ELITE manufacture-then-cash → CHAMPION no-hood-break
- **RARITY_CURVE:** Standard. +ELITE when Tally Lend is already in the pack (COURT).
- **SYNERGIES:** `stave_hooder`, `tempo_precentor`, `tally_lender` (COURT, not PAIR)
- **WEAKNESSES:** Sit off sum 5; sit 3/1 (Score Lend); sit 2/2 (Poise Lend)
- **PLAYER_COUNTERPLAY:** Spend off 5; Dual Keep; Quiet Hex after they cash into a 3-AP spell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-lend` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_sipper`

- **NAME:** Stave Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover AP + leftover MP === 5 and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Stave Sip (`spell-stave-sip`, #1063). Distinct from `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `soul_siphon`. At most one leftover-window AP steal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 5 or leftover AP is 0. Peer: sip (3,2) to manufacture Poise, or sip (4,1) to manufacture Score. Above: skip (0,5) (no AP).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 1.00, res 0.70, init 1.20, chc 0.90. Identity is **stealing leftover AP off a sum of 5**. If it tops the meter, the kit leaked toward Drain Courage.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "stave_sip_if_target_sum_eq_5_and_leftover_ap_ge_1"`. VETERAN: skip (0,5) / wrong window. ELITE: Score Sting after manufacturing 3/1 (COURT). CHAMPION: never sip if Strike kills.
- **CORE_SPELL_POOL:** `spell-stave-sip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the manufactured window
- **ELITE_SPELL_POOL:** none — do **not** add Score Sip / Tally Sip / Soul Sip / Drain Courage
- **SIGNATURE_MECHANICS:** (3,2)→(2,2) **Poise**. (4,1)→(3,1) **Score**. (2,3)→(1,3) **Score**. (5,0)→(4,0) **Score**. (1,4)→(0,4) **Score**. (0,5) fizzles. Dual Keep 2/2 is Poise Sip, **not** this.
- **VARIANT_PROGRESSION:** BASE steal → VETERAN skip-empty-AP → ELITE manufacture-then-sting → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Score Sting is already in the pack (COURT).
- **SYNERGIES:** `hymn_turner`, `score_stinger` (COURT), `stave_holder`
- **WEAKNESSES:** Sit (0,5); sit 3/1 (Score Sip); sit 2/2 (Poise Sip); Second Wind
- **PLAYER_COUNTERPLAY:** Dump leftover AP first; Dual Keep; sit 0 leftover AP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-sip` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_prelate`

- **NAME:** Stave Prelate
- **ROLE:** summoner (empty-kit post; end-turn occupy detonates iff leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Stave Post (`spell-stave-post`, #1063). Distinct from `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `dodeca_prelate`. `summonAI: "stavepost"`. Counts as **1**. At most one leftover-window end-turn post CORE per pack as PAIR vs those. Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 1. Peer: plant only if they will end the turn on (3,2). Above: skip if Dual Keep will dump them to 2/2 before end-turn.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 0.90, res 1.00, init 0.90, chc 0.60. Identity is **end-turn occupy on a sum of 5**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `stavepost`: `ap: 0`, `mp: 0`, **must not path**, **must not cast**, 1-cell. VETERAN: skip if they will not end on 5. ELITE: Stave Hold so they cannot walk off. CHAMPION: never CORE with Dummy / Score / Tally / Poise / Gaunt Post on this body.
- **CORE_SPELL_POOL:** `spell-stave-post`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` beside the post
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / dummy / scorepost / tallypost / poisepost / gauntpost / dodecaspan / hendecaspan.
- **SIGNATURE_MECHANICS:** Walk-enter / relocate / start-turn do **not** detonate. Dual Keep 2/2 **hurts Poise Post, not this**. Counts as **1**. Summon is observation; later detonate is not a second observe.
- **VARIANT_PROGRESSION:** BASE end-turn mine → VETERAN skip-wrong-window → ELITE hold-then-detonate → CHAMPION no-post-clone
- **RARITY_CURVE:** Standard. +ELITE on camp maps. Never CHAMPION in a pack that already has a post.
- **SYNERGIES:** `stave_siller`, `stave_stinger`, `stave_holder`
- **WEAKNESSES:** Spend a pool before turn end; walk off (walk-safe); Coup the post; blink
- **PLAYER_COUNTERPLAY:** End the turn off the post; dump to 3/1; Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-post` (ENEMY_DISCOVERY, piece observe). Later detonate / death is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (empty-kit summon + end-turn leftover-sum gate; `summonAI: "stavepost"`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stave_bouncer`

- **NAME:** Stave Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest other leftover-AP+MP===5 hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Stave Bounce (`spell-stave-bounce`, #1063). Distinct from `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `heave_bouncer` / `storm_caller`. At most one leftover-window bounce CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 12-only if no second Stave body. Peer: bounce only if a second sum===5 hostile sits in Chebyshev 4. Above: skip if a Strike would kill the primary and no second body exists.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.70, init 1.10, chc 0.90. Identity is **two Stave bodies, 12+12**. If it tops the meter on a lone body, the kit leaked toward Chain Lightning.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "stave_bounce_if_second_sum_eq_5_hostile_in_r4"`. VETERAN: skip bounce-search on missing flag (12 still lands). ELITE: Hymn Turn a second body into Stave before the search. CHAMPION: never wait a turn if Strike kills.
- **CORE_SPELL_POOL:** `spell-stave-bounce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` only if both bodies are already committed
- **ELITE_SPELL_POOL:** none — do **not** add Score Bounce / Chain Lightning / Heave Bounce / Split Fang
- **SIGNATURE_MECHANICS:** Primary leftover unconstrained. Second body must sit sum 5. Dual Keep 2/2 is the **wrong** second body. Missing flag → 12 only.
- **VARIANT_PROGRESSION:** BASE bounce → VETERAN skip-missing-second → ELITE manufacture-second → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs two-body Dual Keep kits sitting off 5.
- **SYNERGIES:** `must_staver`, `fuse_binder`, `hymn_turner`
- **WEAKNESSES:** Isolate (one Stave body); sit the second body on 3/1 or 2/2 or 3/0
- **PLAYER_COUNTERPLAY:** Fight without a second body on 5; dump the bishop off 5; Root
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stave-bounce` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one search + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_staver`

- **NAME:** Must Staver
- **ROLE:** controller (non-Strike illegal unless leftover AP + leftover MP === 5 **and** the spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Must Stave (`spell-must-stave`, #1063). Distinct from `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter`. **Do not PAIR with `stave_holder`.** At most one leftover-window last-AP tool lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 5. Peer: arm only if they sit (3,2) with a 3-cost last packet. Above: skip if they sit (0,5) and a walk would kill (this lock blocks non-Strike from leftover AP 0).
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 1.00, res 1.00, init 1.05, chc 0.80. Identity is **last-packet from a sum of 5**. If it tops the meter, the kit leaked toward Hex of Silence.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_stave_if_target_leftover_sum_eq_5_and_has_a_last_packet_spell"`. VETERAN: skip wrong window. ELITE: Hymn Turn (0,5)→(5,0) so a 5-cost last packet becomes legal. CHAMPION: never CORE with Stave Hold on this body.
- **CORE_SPELL_POOL:** `spell-must-stave`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-hex` only after the lock already lifted
- **ELITE_SPELL_POOL:** none — do **not** add Must Score / Stave Hold / Hex of Silence / Tool Hold
- **SIGNATURE_MECHANICS:** Strike stays legal. Walk stays legal unless a Stave Hold is also up (COURT). Pre-spend leftover. (0,5) blocks every non-Strike (leftover AP is 0). Dual Keep 2/2 is Must Poise, **not** this.
- **VARIANT_PROGRESSION:** BASE last-packet → VETERAN skip-wrong → ELITE invert-then-lock → CHAMPION no-hold-clone
- **RARITY_CURVE:** Standard. +ELITE vs Inferno last-packet kits.
- **SYNERGIES:** `stave_holder` (COURT, not PAIR), `leash_warden`, `hymn_turner`
- **WEAKNESSES:** Strike; blink; wait 2 turns; sit 3/1 (Must Score’s window)
- **PLAYER_COUNTERPLAY:** Strike through; dump leftover AP; Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-stave` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pre-spend leftover sum + last-AP compare in the cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_staver`

- **NAME:** Verse Staver
- **ROLE:** debuffer (last resolved id illegal until leftover AP + leftover MP === 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Verse Stave (`spell-verse-stave`, #1063). Distinct from `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `last_muter` / `summon_verser`. At most one leftover-window last-id lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last resolved id. Peer: lock Inferno until they sit (3,2). Above: skip if they already sit on sum 5 (instant lift — fizzle rider).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **which leftover window lifts the last verse**. If it tops the meter, the kit leaked toward Hex of Silence.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_stave_if_target_last_id_is_their_win_condition"`. VETERAN: skip no-last-id / already-on-5. ELITE: Cadence Dock so the locked id is also remaining 0 (COURT). CHAMPION: never restamp Last Mute.
- **CORE_SPELL_POOL:** `spell-verse-stave`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only after the lock already lifted
- **ELITE_SPELL_POOL:** none — do **not** add Verse Score / Last Mute / Summon Verse / Hex of Silence
- **SIGNATURE_MECHANICS:** Strike is not a spell id for this key. Dual Keep 2/2 does **not** lift. 3/1 does **not** lift (Verse Score). 3/0 does **not** lift (Verse Tally). 0/0 does **not** lift (Verse Gaunt). 1/1 does **not** lift (Prime Gift). Fail closed until `lastResolvedSpellId` exists.
- **VARIANT_PROGRESSION:** BASE last-id lock → VETERAN skip-noop → ELITE dock-then-lock → CHAMPION no-mute-clone
- **RARITY_CURVE:** Standard. +ELITE vs Inferno last-id kits.
- **SYNERGIES:** `cadence_docker`, `stave_mender`, `tax_scribe`
- **WEAKNESSES:** Sit on (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3); recast a different id; wait
- **PLAYER_COUNTERPLAY:** Haste into (3,2); recast Frost instead; Dual Keep does **not** help
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-stave` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (last-id lock + leftover-sum lift; fail closed until writer exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ring_warder`

- **NAME:** Ring Warder
- **ROLE:** controller (next walk legal only if Chebyshev **exactly 2**, knight `(2,1)` **excluded**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Ring Stride (`spell-ring-stride`, #1017). Extra room `ring_gallery` — family is **not** that id. Distinct from `file_warder` (same **x**), `rank_warder` (same **y**), `orth_warder` (any orthogonal), Pair Stride (Manhattan **2**, includes `(1,1)`, excludes `(2,2)`), Knight Stride (**only** `(2,1)`), Inch Stride (Chebyshev **≤ 1**). Do **not** name it `rank_lancer`. At most one next-walk-ring CORE per pack as PAIR vs File / Rank / Orth / Diag / Inch Warder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they must walk Chebyshev 1 to threaten. Peer: arm only if a Chebyshev-2 approach already exists. Above: skip if they must knight-hop and Strike is better. **Do not** assign to chargers who only walk toward the player on Chebyshev 1.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 1.00, res 1.00, init 1.10, chc 0.80. Identity is **one-walk Chebyshev-2 lock, not a knight hop**. If it tops the meter, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_chebyshev_2_not_knight"`. VETERAN: skip if they must walk 1 or knight-hop. ELITE: Rank Bite on a different body after they are stuck on the ring (COURT, not PAIR). CHAMPION: never become Knight Stride or Pair Stride on a failed confirm — fail closed (MP not spent).
- **CORE_SPELL_POOL:** `spell-ring-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-mark` on the only Chebyshev-2 approach
- **ELITE_SPELL_POOL:** none — do **not** add File Stride / Rank Stride / Knight Stride / Pair Stride / Pack Ring
- **SIGNATURE_MECHANICS:** Dest Chebyshev == 2 AND not knight (2,1). Orthogonal 2 and diagonal 2 (2,2) are legal. Forced movement / swap / blink / Twin-gate still legal. Does **not** read `currentView`. Fail closed until a next-walk dest writer exists.
- **VARIANT_PROGRESSION:** BASE ring lock → VETERAN skip-need-step-1 → ELITE combo-bite → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE on open maps with Chebyshev-2 rings. Never CHAMPION in a 1-tile closet.
- **SYNERGIES:** `hepta_oather`, `dodeca_prelate`, `rank_biter` (COURT, not PAIR), `glass_sniper`
- **WEAKNESSES:** Stand Chebyshev 1; occupy every Chebyshev-2 cell; Root before they arm
- **PLAYER_COUNTERPLAY:** Step to Chebyshev 1; body-block the ring; Swap them off the armed origin
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ring-stride` (ENEMY_DISCOVERY: family observe **or** `ring_gallery` teach — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next-walk dest writer; fail closed until it exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hepta_oather`

- **NAME:** Hepta Oather
- **ROLE:** controller (next spell illegal unless Chebyshev = 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Hepta Oath (`spell-hepta-oath`, #1017). Extra room `hepta_nave` — family is **not** that id. Distinct from `hexa_oather` (exact **6**), `penta_oather` (exact **5**), `long_oather` (**≥ 3**), `sept_prelate` (occupy-weight 7). Do **not** name it `hepta_nave` or `sept_prelate`. At most one exact-Chebyshev oath CORE per pack as PAIR vs Hexa / Penta / Quad / Tri / Mid / Long Oather.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they cannot reach 7 this turn. Peer: arm only if a legal 7 already exists (Far Sting / Frost). Above: skip if they sit at 6 or 8 and would fizzle.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, init 1.15, chc 0.80, res 0.70. Identity is **exact-7 prison**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_7"`. VETERAN: skip if they cannot reach 7. ELITE: Far Sting as the gated poke (ADVANCED). CHAMPION: never restamp `span_sept`.
- **CORE_SPELL_POOL:** `spell-hepta-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-far-sting` if already in the catalog for this chassis, else `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the Chebyshev-7 cell
- **ELITE_SPELL_POOL:** none — do **not** add Hexa Oath / Penta Oath / Sept Span / Far Hood / Octa Oath
- **SIGNATURE_MECHANICS:** `physical_attack` stays legal at any range. If they arm then walk to 6, the spell fizzles on confirm (AP not spent for the fizzled spell; Hepta Oath already observed).
- **VARIANT_PROGRESSION:** BASE exact-7 → VETERAN skip-unreachable → ELITE gated-poke → CHAMPION no-occupy-clone
- **RARITY_CURVE:** Standard. +ELITE on long-file maps. Never CHAMPION in a 4-tile room.
- **SYNERGIES:** `ring_warder`, `glass_sniper`, `far_stinger` (COURT)
- **WEAKNESSES:** Close to 6 or 8; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Walk to 6; occupy the 7; Swap them off the line
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hepta-oath` (ENEMY_DISCOVERY: family observe **or** `hepta_nave` teach)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`nextSpellExactChebyshev: 7`; reuse Hexa/Penta/Quad key)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rime_reeler`

- **NAME:** Rime Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest ice occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Rime Reel (`spell-rime-reel`, #1017). Extra room `frost_aisle` — family is **not** that id. Distinct from `lava_reeler` (lava occupancy), `spike_reeler` (spike occupancy), `rime_skipper` (ignore rime **leave-tax**), `rime_mason` (**paints** ice), `void_reeler` (void/portal). Eleventh `applyAttract` dest flavor. At most one attract-toward-occupancy CORE per pack as PAIR vs Lava / Spike / Pit / Brick / Void / Cinder / Paint / Foe / Ally / File Reel.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ice exists. Peer: pull only if the 1-step is not a world portal / void. Above: skip if the 1-step would land them **onto** ice and a later skip family is not in the pack (solvability — pull **toward**, dest is never `map.portals`).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **pull toward ice**. If it tops the meter, the kit leaked toward Hook Line.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_rime"`. VETERAN: skip no-ice / portal-step. ELITE: Rank Bite after they now share a rank (COURT). CHAMPION: never dest `map.portals`.
- **CORE_SPELL_POOL:** `spell-rime-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` only if they are already committed to the toward-tile
- **ELITE_SPELL_POOL:** none — do **not** add Lava Reel / Spike Reel / Rime Skip / Rime Cut / Hook Line
- **SIGNATURE_MECHANICS:** No damage. Ice cells are map-modifier occupancy, **not** painted rime-tile, **not** `map.portals`, **not** lava occupancy. Empty board fizzles (AP spent, observe). Fail closed until `applyAttract` has an ice-occupancy dest.
- **VARIANT_PROGRESSION:** BASE toward-ice → VETERAN skip-empty → ELITE combo-bite → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on maps that already place ice occupancy. Never CHAMPION on an ice-less map.
- **SYNERGIES:** `rank_biter`, `glyph_sower`, `rime_skipper` (COURT, not PAIR — they still get pulled, tax skipped)
- **WEAKNESSES:** Fight on maps without ice; occupy the toward-tile; blink
- **PLAYER_COUNTERPLAY:** Don’t stand 1 toward ice; blink; body-block the toward-cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rime-reel` (ENEMY_DISCOVERY: family observe **or** `frost_aisle` teach). Empty-board fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (eleventh `applyAttract` dest flavor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rank_biter`

- **NAME:** Rank Biter
- **ROLE:** bruiser (10 + 10 if caster and target share a rank)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Rank Bite (`spell-rank-bite`, #1017). Distinct from `file_biter` (share **file only**), `axis_biter` (rank **or** file), `screen_biter` (Bresenham **blocked**), File Lance (linear poke). **Do not PAIR with `rank_warder` or `rank_lancer`.** At most one share-axis bite CORE per pack as PAIR vs File / Axis / Screen / Foe / Side / Lone / Nook / Field / Wall Biter.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10-only if they do not share a rank. Peer: bonus only on the same y. Above: skip the bonus path if a file-only approach is the only legal one (File Bite’s window).
- **STAT_SCALING_RULE:** hp 1.10, sp 1.10, sr 1.00, res 0.90, init 1.05, chc 0.90. Identity is **rank-only bonus**. If it tops the meter without the bonus, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "rank_bite_if_share_rank_only"`. VETERAN: skip bonus on file-only / diagonal. ELITE: Rime Reel onto the rank (COURT). CHAMPION: never become Axis Bite on a failed confirm.
- **CORE_SPELL_POOL:** `spell-rank-bite`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the shared rank
- **ELITE_SPELL_POOL:** none — do **not** add File Bite / Axis Bite / File Lance / Rank Stride
- **SIGNATURE_MECHANICS:** Bonus on the rank. File-only → 10 only. Diagonal → 10 only. Does **not** read `currentView`.
- **VARIANT_PROGRESSION:** BASE rank bonus → VETERAN skip-file-only → ELITE reel-then-bite → CHAMPION no-axis-clone
- **RARITY_CURVE:** Standard. +ELITE on long-rank maps.
- **SYNERGIES:** `rime_reeler`, `glyph_sower`, `rank_warder` (COURT, not PAIR)
- **WEAKNESSES:** Stand off-rank; occupy the rank; Root
- **PLAYER_COUNTERPLAY:** Step to a different rank; body-block the rank; Swap them off the y
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rank-bite` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (share-rank predicate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `last_marker`

- **NAME:** Last Marker
- **ROLE:** anti-melee (cell detonates if occupant spends their **last leftover AP** on it)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Last Mark (`spell-last-mark`, #1017). Extra room `last_pulpit` — family is **not** that id. Distinct from `strike_marker` (**Strike from**), `cast_marker` (**any spell** confirm), `dwell_marker` (**end-turn occupy**), `ingress_marker` (**walk enter**), `last_muter` (**duration silence**). At most one last-AP-on-cell paint CORE per pack as PAIR vs Strike / Swap / Shove / Cast / Wake / Dwell / Ingress Mark.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they will not spend last AP on that cell. Peer: paint only if a last-packet Strike / 2-AP tool is likely. Above: skip if they will walk off before spending last AP.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **last leftover AP spent on the paint**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "last_mark_if_foe_will_spend_last_ap_on_cell"`. VETERAN: skip if they will not spend last AP there. ELITE: Goad so the last packet is a Strike from the paint (COURT). CHAMPION: never restamp Strike Mark.
- **CORE_SPELL_POOL:** `spell-last-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark` on a **different** cell
- **RARE_SPELL_POOL:** `spell-goad` if already in the catalog, else `spell-weaken`
- **ELITE_SPELL_POOL:** none — do **not** add Strike Mark / Cast Mark / Dwell Mark / Ingress
- **SIGNATURE_MECHANICS:** Walk-on is free. Spell-from with leftover AP remaining is free. Last AP from the paint pays, then consume. Fail closed until a last-leftover-AP-on-cell writer exists. Do **not** read `struckThisTurn` as a substitute.
- **VARIANT_PROGRESSION:** BASE last-AP mine → VETERAN skip-wrong-spend → ELITE goad-then-detonate → CHAMPION no-strike-clone
- **RARITY_CURVE:** Standard. +ELITE vs last-packet melee kits.
- **SYNERGIES:** `dual_plater`, `goad_herald`, `fuse_binder`
- **WEAKNESSES:** Spend last AP **off** the cell; walk off; leave leftover AP ≥ 1
- **PLAYER_COUNTERPLAY:** Cast the last packet from a neighbor; leave 1 leftover AP; blink
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-last-mark` (ENEMY_DISCOVERY: family observe **or** `last_pulpit` teach). Later detonate is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + last-leftover-AP-on-cell writer; fail closed until it exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dual_plater`

- **NAME:** Dual Plater
- **ROLE:** protector (next hit is 0 while leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Dual Plate (`spell-dual-plate`, #1017). Distinct from `dry_plater` (leftover **MP = 0**), `poise_hooder` (leftover AP **===** leftover MP ≥ 1), `stave_hooder` (leftover **sum === 5**), `even_stinger` (**damage** if leftover AP even ≥ 2), `dual_keeper` (banks leftover, no miss). At most one leftover-even-even miss CORE per pack as PAIR vs those. Do **not** name it `dual_keeper`. `even-plate` stays tombstoned.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover AP or leftover MP is odd or < 2. Peer: Plate only while sitting (2,2) / (2,4) / (4,2) / (4,4). Above: refuse if leftover is 0/0 (even, **excluded**) or 1/1 (Poise / Prime Gift).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **holding even/even ≥ 2**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "dual_plate_if_leftover_ap_even_ge_2_and_mp_even_ge_2"`. VETERAN: skip odd / zero / 1. ELITE: Dual Keep to **bank** 2/2 (COURT, not PAIR with `dual_keeper` as CORE). CHAMPION: never lend into a hit you wanted blanked.
- **CORE_SPELL_POOL:** `spell-dual-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** none — do **not** add Dry Plate / Poise Hood / Stave Hood / Spent Plate / Even Sting
- **SIGNATURE_MECHANICS:** Any range. Charge remains if the hit arrives off-window. Hit at 3/1 lands (Score Hood). Hit at 3/2 lands (Stave Hood). Hit at 0/0 lands (Gaunt / Hollow). Hit at 1/1 lands (Prime Gift / Poise). Hit at 2/2 blanks (Poise Hood **also** blanks 2/2 — Dual Plate additionally blanks 4/2). 0 is even — **excluded**.
- **VARIANT_PROGRESSION:** BASE even-even miss → VETERAN skip-odd → ELITE bank-then-plate → CHAMPION no-hood-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `fresh_stinger`, `plate_warden`, `cover_squire`
- **WEAKNESSES:** Spend a pool odd; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force leftover AP odd; dump MP to 0; don’t hit while they sit (2,2)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dual-plate` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover-parity gates + consume on miss)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rift_skipper`

- **NAME:** Rift Skipper
- **ROLE:** kiter (next 1-tile walk ignores Void Rift walk-tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Rift Skip (`spell-rift-skip`, #1017). Extra room `rift_court` — family is **not** that id. Distinct from `shock_skipper` (shock enter-tax), `rime_skipper` (rime leave-tax), `glyph_skipper` (glyph-tax), `rift_hook` (**swap**). At most one 1-tile hazard-skip CORE per pack as PAIR vs Shock / Mire / Rime / Glyph / Cinder / Spike / Lava / Pit Skip. Do **not** name it `rift_hook`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no Void Rift cell is adjacent. Peer: skip only for a 1-tile step onto / across a Void Rift tax. Above: skip if they will walk length ≥ 2 (tax still ticks).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 1.00, res 0.70, init 1.20, chc 0.80. Identity is **one-tile Void Rift skip**. If it tops the meter, the kit leaked toward Blink.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "rift_skip_if_next_one_tile_walk_hits_void_rift_tax"`. VETERAN: skip no-rift / length ≥ 2. ELITE: Fresh Sting after they camp leftover AP === max (COURT). CHAMPION: never become Rift Hook / Phase Slip on this body.
- **CORE_SPELL_POOL:** `spell-rift-skip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-mark` on the Void Rift cell
- **ELITE_SPELL_POOL:** none — do **not** add Shock Skip / Rime Skip / Glyph Skip / Rift Hook / Phase Slip
- **SIGNATURE_MECHANICS:** Wrong hazard still ticks. Length ≥ 2 pays. Twin Gate pads are **not** Void Rift. Fail closed until Void Rift walk-tax is a first-class occupancy, not a name.
- **VARIANT_PROGRESSION:** BASE 1-tile skip → VETERAN skip-wrong-hazard → ELITE camp-then-sting → CHAMPION no-blink-clone
- **RARITY_CURVE:** Standard. +ELITE on maps that already place Void Rift occupancy. Never CHAMPION on a rift-less map.
- **SYNERGIES:** `fresh_stinger`, `tide_shade`, `glyph_sower`
- **WEAKNESSES:** Fight on maps without Void Rift; walk length ≥ 2; Root
- **PLAYER_COUNTERPLAY:** Don’t stand across a 1-tile rift; occupy the skip cell; Paper Wind
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rift-skip` (ENEMY_DISCOVERY: family observe **or** `rift_court` teach)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (1-tile Void Rift tax skip flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `fresh_stinger`

- **NAME:** Fresh Stinger
- **ROLE:** assassin (bonus iff leftover AP **equals that body’s max AP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Fresh Sting (`spell-fresh-sting`, #1017). Distinct from `full_stinger` (leftover AP **≥ 3**, max unread), `even_stinger` (leftover AP **even ≥ 2**), `gaunt_stinger` (both leftover **0**), `stave_stinger` (leftover **sum === 5**). At most one leftover-equals-max poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10-only if leftover AP < max. Peer: bonus only if they have not spent leftover AP this turn. Above: skip the bonus path if Dual Keep spent them down to 2 from a higher max.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 1.00, res 0.70, init 1.25, chc 1.10. Identity is **poking an unspent AP bar**. If it tops the meter without the bonus, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "fresh_sting_if_target_leftover_ap_eq_max_ap"`. VETERAN: skip bonus if leftover AP < max (10 still lands). ELITE: Dual Plate so they camp even/even instead of spending (COURT). CHAMPION: never wait a turn if Strike kills.
- **CORE_SPELL_POOL:** `spell-fresh-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the unspent body
- **ELITE_SPELL_POOL:** none — do **not** add Full Sting / Even Sting / Gaunt Sting / Stave Sting
- **SIGNATURE_MECHANICS:** They may have spent down to 3 from a higher max — Fresh Sting **misses** that; Full Sting would hit it. 0 leftover is not max unless max is 0 (illegal). Dual Keep leftover that **survives** turn start **does** count if it equals max.
- **VARIANT_PROGRESSION:** BASE unspent-poke → VETERAN skip-spent → ELITE plate-then-poke → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep kits that bank instead of spend.
- **SYNERGIES:** `dual_plater`, `plate_warden`, `rift_skipper`
- **WEAKNESSES:** Spend 1 leftover AP; Dual Keep down from max; sit leftover 0
- **PLAYER_COUNTERPLAY:** Cast 1 AP first; sit leftover 3 from a max of 6; body-block
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-fresh-sting` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP === max AP gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_filer`

- **NAME:** Summon Filer
- **ROLE:** anti-summon (allied summons pay +1 AP to walk off the summoner’s file)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Summon File (`spell-summon-file`, #1017). Distinct from `summon_ranker` (walk **off rank**), `summon_toller` (+1 AP to start **any** walk), `summon_gaiter` (+1 **MP** to start a walk), Pack File (`ENEMY_ONLY` hard lock). **Do not PAIR with `summon_ranker` / `summon_toller` / `summon_gaiter` / `cast_plater` on one BASE kit.** Drop this id if `summonAI` is empty.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no allied summon. Peer: tax only if a pet will walk off the summoner’s file. Above: skip if pets already sit on-file.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 1.10, init 0.95, chc 0.60. Identity is **pets pay to leave the file**. If it tops the meter, the kit leaked toward Pack File.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "summon_walk_off_file_ap_tax"`. VETERAN: skip no-pet / on-file. ELITE: Kennel Lock parks the pets (COURT). CHAMPION: never CORE with Summon Rank / Summon Toll / Cast Plate on this body.
- **CORE_SPELL_POOL:** `spell-summon-file`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-shield`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Rank / Summon Toll / Summon Gait / Pack File / Cast Plate
- **SIGNATURE_MECHANICS:** On-file walks are free of this tax. Player copy taxes **their** pets leaving **their** file. Forced-move / Swap / Twin Gate do **not** pay this tax.
- **VARIANT_PROGRESSION:** BASE file tax → VETERAN skip-no-pet → ELITE park-then-tax → CHAMPION no-rank-clone
- **RARITY_CURVE:** Standard. +ELITE when a dedicated summoner is already in the pack (COURT, not PAIR with Rank / Toll / Plate).
- **SYNERGIES:** `kennel_siller`, `rime_cutter`, `null_censor`. COURT with `cast_plater` + a third peeler.
- **WEAKNESSES:** Walk pets along the file; Swap the summoner off the file; kill the queen
- **PLAYER_COUNTERPLAY:** Keep pets on the summoner’s file; kill the queen; blink pets (not a walk)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-file` (ELITE). Later taxed walks do not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pet walk-off-file AP tax vs summoner x)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `prime_gifter`

- **NAME:** Prime Gifter
- **ROLE:** healer (heal iff leftover AP **exactly 1 AND** leftover MP **exactly 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Prime Gift (`spell-prime-gift`, #1017). **No extra door** — do not invent `prime_cantor`. Distinct from `equal_gifter` (target leftover AP === MP ≥ 1, **any** tie), `lean_gifter` (AP=0 and MP≥1), `stave_mender` (both leftover **sum === 5**), `score_mender` (both leftover **sum === 4 unequal**), Hollow / Gaunt (0/0), `cadence_primer` (remaining **zeros → 1**). Healer CORE only. Do **not** name it `cadence_primer`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover is not 1/1. Peer: Prime Gift only if leftover is exactly 1/1 **and** missing HP ≥ 10. Above: refuse if Dual Keep banks 2/2 (Poise window). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **exactly 1 leftover AP and 1 leftover MP**. If it tops the meter, the kit leaked toward Frost. Dual Keep 1/1 **is** this window if it survives.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_eq_1_and_mp_eq_1"`. VETERAN: skip if leftover is not 1/1. ELITE: prefer self-cast when the caster already sits 1/1 after the AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-prime-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Equal Gift / Lean Gift / Stave Mend / Score Mend / Gaunt Mend / Hollow Gift
- **SIGNATURE_MECHANICS:** Target-only leftover 1/1. Caster leftover unread unless self-cast. `healAmount` stays 0 on the Prime Gift row. Equal Gift at 2/2 / 3/3 is **not** this. Tally misses 1/1 (sum 2).
- **VARIANT_PROGRESSION:** BASE 1/1-heal → VETERAN skip-wrong-pair → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Dual Keep leftover 1/1 is already in the pack (COURT, not PAIR with Equal / Poise).
- **SYNERGIES:** `cadence_capper`, `font_cantor`, `cover_squire`
- **WEAKNESSES:** Spend the last leftover AP; Dual Keep 2/2; dump to 0/0; Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from 1/1 → 0/1 (Lean Gift’s window, not this); kill the cantor first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-prime-gift` (ELITE, piece observe). No extra door.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover-equals-1 reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_capper`

- **NAME:** Cadence Capper
- **ROLE:** controller (remaining CDs `n>2` → `2`; 0/1/2 unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Cap (`spell-cadence-cap`, #1017). **No extra door** — do **not** restamp `floor_precentor` / `prime_precentor` / `snuff_precentor` / `dock_precentor` / `cap_precentor` (Pack Cap). Distinct from `cadence_docker` (this pass, `n===2` → **0**), `cadence_snuffer` (`n==1` → **0**), `cadence_primer` (`n===0` → `1`), Floor (`n>1` → 1), `cap_warder` (walk cap). Observe via `cadence_thief` / `hex_chorister`. Do **not** name it `cap_warder` or `cadence_primer`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≤ 2. Peer: Cap only if a nuke remaining is ≥ 3. Above: refuse if the only remaining>2 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **compressing a 5 to a 2**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cap_if_target_has_remaining_cd_gt_2_on_a_nuke"`. VETERAN: skip all-≤2. ELITE: prefer Inferno remaining 5 over Strike-only. CHAMPION: never Cap a bar you will Dock the same turn (Dock is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-cap`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the capped id is already remaining 2
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Dock / Cadence Snuff / Cadence Floor / Cadence Prime / Pack Cap
- **SIGNATURE_MECHANICS:** Remaining `n>2` → `2`. Zeros stay 0. Ones stay 1. Twos stay 2. Target keeps every spell. Floor would have written 1. Dock would need a later turn to zero the 2.
- **VARIANT_PROGRESSION:** BASE compress-to-2 → VETERAN skip-already-capped → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits sitting on remaining 5 (Inferno). Never CHAMPION in a solo pack with Dock.
- **SYNERGIES:** `prime_gifter`, `cadence_docker` (COURT, not PAIR), `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast the remaining-5 id **before** Cap; Dock the 2 on a later turn; Cadence Break your own remaining after
- **PLAYER_COUNTERPLAY:** Spend the remaining-5 Inferno **now**; sit remaining at 2 already (Dock’s problem)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-cap` (ENEMY_DISCOVERY: family observe **or** `cadence_thief` / `hex_chorister` G≥16 extra — first child wins). Do **not** restamp `floor_precentor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 2 when n>2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_toller`

- **NAME:** Gait Toller
- **ROLE:** controller (next **walk** +1 AP if leftover **MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Gait Toll (`spell-gait-toll`, #1017). Distinct from `still_toller` (next **spell** +1 AP if leftover MP = 0), `walk_toller` (Wave-7 walk-pool flag), `cast_toller` (next spell after a Strike), `summon_toller` (pets pay +1 AP to start **any** walk). At most one leftover-MP=0 next-walk tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP ≥ 1. Peer: tax only if they will walk with leftover MP 0. Above: skip if they will camp leftover MP 1 (Still Toll’s window is next **spell**, not this).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **camp-then-walk tax**. If it tops the meter, the kit leaked toward Ley Toll.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_walk_ap_tax_if_leftover_mp_eq_0"`. VETERAN: skip leftover MP ≥ 1. ELITE: Brick Hold so they cannot walk around the tax (COURT, not PAIR). CHAMPION: never CORE with Still Toll / Walk Toll / Cast Toll on this body.
- **CORE_SPELL_POOL:** `spell-gait-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` to force the taxed walk
- **ELITE_SPELL_POOL:** none — do **not** add Still Toll / Walk Toll / Cast Toll / Ley Toll / Gait Tax
- **SIGNATURE_MECHANICS:** Relocate / Swap / Twin Gate / Stave Step do **not** pay this tax (not a walk). Fail closed until leftover MP is readable. Keep 1 walk MP to dodge.
- **VARIANT_PROGRESSION:** BASE walk-tax → VETERAN skip-has-mp → ELITE hold-then-tax → CHAMPION no-spell-clone
- **RARITY_CURVE:** Standard. +ELITE vs leftover-MP=0 kites.
- **SYNERGIES:** `brick_holder` (COURT, not PAIR), `stone_castellan`, `ley_tollkeeper` (COURT, not PAIR)
- **WEAKNESSES:** Keep 1 leftover MP; blink; wait the consume
- **PLAYER_COUNTERPLAY:** Hold 1 walk MP; Swap; sit leftover MP 1 and spell instead
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-toll` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (next-walk AP tax gated on leftover MP = 0)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_holder`

- **NAME:** Brick Holder
- **ROLE:** controller (cannot walk while adjacent to a barrier)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Brick Hold (`spell-brick-hold`, #1017). Distinct from `brick_bracer` (**negates a hit** while adjacent), `stave_holder` (leftover **sum === 5**), `brick_stepper` (**relocates through** the barrier), Hold Ground (planted stance). Do **not** name it `brick_bracer` or `hold_knight`. At most one barrier-adjacent walk lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no barrier is adjacent. Peer: Hold only if a living barrier sits Chebyshev 1. Above: skip if they will destroy the barrier this turn.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.80, sr 1.00, res 1.20, init 0.90, chc 0.60. Identity is **cannot walk while camping a wall**. If it tops the meter, the kit leaked toward Root Snare.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "cannot_walk_if_adjacent_barrier"`. VETERAN: skip no-barrier. ELITE: Gait Toll so the first legal walk after they leave also costs (COURT, not PAIR). CHAMPION: never CORE with Brick Brace / Brick Step on this body.
- **CORE_SPELL_POOL:** `spell-brick-hold`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Brick Brace / Brick Step / Stave Hold / Root Snare / Load Bearing
- **SIGNATURE_MECHANICS:** Teleport / Swap / Phase Slip / Twin-gate / Brick Step stay legal (no walk MP). Destroy the barrier and walks resume; lock **stays** until duration. Does **not** negate hits (Brick Brace).
- **VARIANT_PROGRESSION:** BASE wall-walk-lock → VETERAN skip-no-wall → ELITE tax-then-lock → CHAMPION no-brace-clone
- **RARITY_CURVE:** Standard. +ELITE vs cover-camping kits.
- **SYNERGIES:** `gait_toller` (COURT, not PAIR), `stone_castellan`, `cover_squire`
- **WEAKNESSES:** Destroy the barrier; blink; wait the duration
- **PLAYER_COUNTERPLAY:** Coup the wall; Swap off the adjacent cell; sit Chebyshev 2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-hold` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (barrier-adjacent gate in the walk spender)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_drainer`

- **NAME:** Watch Drainer
- **ROLE:** sniper (overwatch snap **steals 1 leftover MP** from the walker)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Watch Drain (`spell-watch-drain`, #1017). Distinct from `watch_rooter` (**zeros** leftover MP), `watch_sipper` (**steals leftover AP**), `watch_banker` (**banks leftover AP**), `watch_feer` (leftover **AP −1**, no transfer), Root Snare (tile root). **Do not PAIR with Watch Root / Watch Sip / Watch Bank.** At most one overwatch leftover-MP steal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no overwatch band exists. Peer: arm only if a walker will enter the band with leftover MP ≥ 1. Above: skip if they will walk leftover MP 0 (nothing to steal).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.70, init 1.20, chc 0.90. Identity is **stealing leftover MP mid-path**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `sniper`. `aiHint: "overwatch_snap_steal_walker_mp"`. VETERAN: skip no-band / leftover MP 0. ELITE: Even Gait after they are left with leftover MP even ≥ 2 or 0 (COURT). CHAMPION: never CORE with Watch Root / Watch Sip on this body.
- **CORE_SPELL_POOL:** `spell-watch-drain`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-far-sting` if already in the catalog, else `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Watch Root / Watch Sip / Watch Bank / Watch Fee / Root Snare
- **SIGNATURE_MECHANICS:** Snap transfers 1 leftover MP to the watcher (capped at max). Walker leftover MP −1 (not below 0). Ending a walker’s remaining walk mid-path. Fail closed until overwatch snap writes leftover MP. Relocate / Swap do **not** snap.
- **VARIANT_PROGRESSION:** BASE steal-snap → VETERAN skip-empty-mp → ELITE even-then-poke → CHAMPION no-zero-clone
- **RARITY_CURVE:** Standard. +ELITE when `glass_sniper` / Hold Ground / Far Watch is already in the pack (COURT, not PAIR).
- **SYNERGIES:** `even_gaiter`, `glass_sniper` (COURT, not PAIR), `cover_squire`
- **WEAKNESSES:** Walk leftover MP 0; blink; sit outside the band
- **PLAYER_COUNTERPLAY:** Walk leftover MP 0; Swap; kill the watcher first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-drain` (ELITE, piece observe). Later snaps do not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (overwatch snap leftover-MP steal; fail closed until snap writer exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `even_gaiter`

- **NAME:** Even Gaiter
- **ROLE:** assassin (bonus iff leftover **MP even and ≥ 2**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Even Gait (`spell-even-gait`, #1017). Distinct from `odd_gaiter` (leftover MP **odd**), `pair_gaiter` (leftover MP **exactly 2**), `even_stinger` (leftover **AP** even ≥ 2), `full_gaiter` (leftover MP **≥ 3**, includes odds), Dry Sting (leftover MP **= 0**, even, **excluded**). Do **not** name it `even_warder` or `even_stinger`. At most one leftover-MP-even poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10-only if leftover MP is odd or 0. Peer: bonus on leftover MP 2/4. Above: skip the bonus path if Watch Drain just stole them to 1 (odd).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 1.00, res 0.70, init 1.25, chc 1.10. Identity is **poking leftover MP even ≥ 2**. If it tops the meter without the bonus, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "even_gait_if_leftover_mp_even_ge_2"`. VETERAN: skip bonus on odd / 0 (10 still lands). ELITE: Watch Drain to leave them even or 0 (COURT). CHAMPION: never wait a turn if Strike kills.
- **CORE_SPELL_POOL:** `spell-even-gait`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the even-MP body
- **ELITE_SPELL_POOL:** none — do **not** add Odd Gait / Pair Gait / Even Sting / Dry Sting / Full Gait
- **SIGNATURE_MECHANICS:** Poke leftover 2/4. 0 and odd leftover → 10 only. Pair Gait is leftover MP **exactly 2** as a **gait**, not a poke. Dual Keep leftover MP 2 **does** count.
- **VARIANT_PROGRESSION:** BASE even-mp poke → VETERAN skip-odd → ELITE drain-then-poke → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs leftover-MP-2 kites.
- **SYNERGIES:** `watch_drainer`, `glass_sniper`, `tide_shade`
- **WEAKNESSES:** Sit leftover MP 1 (Odd Gait); sit leftover MP 0 (Dry Sting); Dual Keep dump
- **PLAYER_COUNTERPLAY:** Spend 1 leftover MP; sit leftover MP 0; body-block
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-even-gait` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-MP even ≥ 2 gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rime_cutter`

- **NAME:** Rime Cutter
- **ROLE:** assassin (10 + 10 if target is Chebyshev ≤ 2 from ice occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Rime Cut (`spell-rime-cut`, #1017). Distinct from `spike_cutter` (spike occupancy), `hazard_cutter` (**painted** hazard; excludes occupancy-only ice), `portal_cutter` (**world portals**), `rime_reeler` (**pulls**), `rime_skipper` (**ignores tax**). At most one occupancy-threshold poke CORE per pack as PAIR vs Spike / Hazard / Portal / Axis / Escort / Leash / Pet / Banner / Crown Cut.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10-only if no ice is within 2. Peer: bonus only if they sit Chebyshev ≤ 2 from ice occupancy. Above: skip the bonus path if Twin Gate pads are the only “ice” (pads are **not** ice).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 1.00, res 0.80, init 1.15, chc 1.00. Identity is **threshold poke near ice**. If it tops the meter without the bonus, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "rime_cut_if_target_chebyshev_le_2_from_ice"`. VETERAN: skip bonus on ice-less / Twin Gate pads. ELITE: Rime Reel onto the threshold (COURT, not PAIR). CHAMPION: never dest `map.portals`.
- **CORE_SPELL_POOL:** `spell-rime-cut`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the ice cell
- **ELITE_SPELL_POOL:** none — do **not** add Spike Cut / Hazard Cut / Portal Cut / Rime Reel / Rime Skip
- **SIGNATURE_MECHANICS:** Ice cells are map-modifier occupancy, **not** painted rime-tile, **not** Twin Gate pads, **not** `map.portals`. Empty board → 10 only.
- **VARIANT_PROGRESSION:** BASE ice-threshold → VETERAN skip-no-ice → ELITE reel-then-cut → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on maps that already place ice occupancy. Never CHAMPION on an ice-less map.
- **SYNERGIES:** `summon_filer`, `cast_plater`, `glyph_sower`. COURT with `rime_reeler` + a third peeler.
- **WEAKNESSES:** Fight on maps without ice; stand Chebyshev 3; blink
- **PLAYER_COUNTERPLAY:** Don’t stand ≤ 2 from ice; Swap off the threshold; occupy the ice cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rime-cut` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (ice occupancy Chebyshev ≤ 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cast_plater`

- **NAME:** Cast Plater
- **ROLE:** protector (target’s next **non-Strike spell** deals 0; AP still spent)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Cast Plate (`spell-cast-plate`, #1017). Distinct from `summon_plater` (allied summons treat the **next incoming hit** as 0), Mute Thread (silence-ish), Quiet Hex (ungated next-spell +1 AP), Split Plate, `dual_plater` (incoming miss). **Do not PAIR with `summon_plater` / `summon_filer` on one BASE kit.** Do **not** name it `summon_plater` or `cast_toller`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if they will Strike instead. Peer: plate only if a non-Strike nuke is likely this round. Above: skip if they will Strike / wait the consume.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 1.10, init 0.95, chc 0.60. Identity is **zeroing the next non-Strike**. If it tops the meter, the kit leaked toward Mute Thread.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_non_strike_spell_damage_zero"`. VETERAN: skip if they will Strike. ELITE: Verse Stave so the locked id is also their last verse (COURT). CHAMPION: never CORE with Summon Plate / Mute Thread on this body.
- **CORE_SPELL_POOL:** `spell-cast-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-shield`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Plate / Mute Thread / Quiet Hex / Split Plate / Dual Plate
- **SIGNATURE_MECHANICS:** Strike still deals full. AP still spent on the fizzled nuke. One consume. Two non-Strike spells — second lands. Fail closed until next-non-Strike-damage-zero is a first-class flag, not a name.
- **VARIANT_PROGRESSION:** BASE nuke-miss → VETERAN skip-will-strike → ELITE verse-then-plate → CHAMPION no-summon-clone
- **RARITY_CURVE:** Standard. +ELITE vs Inferno last-id kits.
- **SYNERGIES:** `rime_cutter`, `verse_staver`, `null_censor`. COURT with `summon_filer` + a third peeler.
- **WEAKNESSES:** Strike; wait the consume; recast a second nuke
- **PLAYER_COUNTERPLAY:** Strike through; wait one spell; kill the queen
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-plate` (ELITE). Later negated spell does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (next-non-Strike-damage-zero consume flag)
- **STATUS:** PROPOSED

---

## 5. Spell-identity matrix (Wave 18)

Forbidden CORE categories keep identity coherent when later spells are assigned. A Wave 18 family may **observe** a forbidden id as a G≥16 extra on a *different* body; it may not wear that id as CORE.

| ENEMY_ID | CORE identity | Forbidden CORE (clone / leak) |
| :--- | :--- | :--- |
| stave_mender | both-body leftover sum===5 heal | Score/Tally/Poise/Gaunt/Hollow/Equal/Lean/Prime/Dry/Still/Heave/Both/Pale/Gift/Shove as CORE, inferno |
| cadence_docker | remaining `2→0` | Cap/Snuff/Rise/Prime/Floor/Stall/Lag/Crack/Flush as CORE, heal |
| dodeca_prelate | 3×4 occupy-weight 12 | hendeca/dec/nine/oct/sept/six/penta/quad/triple/twin/dummy/stavepost, turret, heal |
| hymn_turner | two-ally leftover invert (caster stays) | Duel Turn / Purse Turn / Bar Cross / Tempo Invert / Swap as identity, heal, Choir Hymn |
| stave_hooder | leftover-sum===5 miss | Score/Tally/Poise Hood / Dual/Spent/Gait/Dry/Odd Plate as CORE, heal, evasion field |
| stave_stinger | leftover-sum===5 poke | Score/Tally/Poise/Gaunt/Even/Odd/Fresh Sting as CORE, heal |
| stave_stepper | leftover-sum===5 join | Score/Tally/Poise/Gaunt/Home/Heave/Brick Step / Swap as CORE, heal |
| stave_siller | leftover-sum===5 start-turn tax | Score/Tally/Poise/Gaunt Sill / Wake/Strike/Last/Swap Mark as CORE, heal |
| stave_holder | leftover-sum===5 walk lock | Score/Tally/Poise/Odd/Dry/Brick Hold / Must Stave as CORE, heal |
| stave_lender | leftover-sum===5 +1/+1 cash-out | Score/Tally/Poise/Gaunt Lend / Haste / Tempo Gift as CORE, heal |
| stave_sipper | leftover-sum===5 steal leftover AP | Score/Tally/Poise/Bare Sip / Soul Sip as CORE, heal |
| stave_prelate | isSummon (`stavepost`), leftover-sum===5 end-turn | dummy/scorepost/tallypost/poisepost/gauntpost/dodecaspan, heal, turret |
| stave_bouncer | leftover-sum===5 bounce | Score/Tally/Poise/Gaunt Bounce / Chain Lightning as identity, heal |
| must_staver | leftover-sum===5 last-AP tool lock | Must Score / Must Tally / Must Poise / Stave Hold / Hex of Silence as CORE, heal |
| verse_staver | leftover-sum===5 last-id lock | Verse Score / Verse Tally / Verse Poise / Last Mute / Summon Verse as CORE, heal |
| ring_warder | next-walk Chebyshev 2, not knight | File/Rank/Orth/Diag Stride / Pair Stride / Knight Stride / Pack Ring as CORE, heal |
| hepta_oather | next-spell exact Chebyshev 7 | Hexa/Penta/Quad/Tri/Mid/Long Oath / Sept Span as CORE, heal, isSummon |
| rime_reeler | attract toward ice occupancy | Lava/Spike/Pit/Brick/Void/Cinder Reel / Rime Skip / Rime Cut / Hazard Cut as CORE, heal |
| rank_biter | share-rank-only bonus | File/Axis/Screen/Wall/Foe Bite / File Lance / Rank Stride as CORE, heal |
| last_marker | last-AP-on-cell paint | Strike/Swap/Shove/Cast/Ingress/Wake/Dwell Mark as CORE, heal, isSwap-as-identity |
| dual_plater | leftover AP even≥2 AND leftover MP even≥2 miss | Dry/Spent/Odd/Gait Plate / Poise/Stave Hood as CORE, heal, Dual Keep as identity, evasion field |
| rift_skipper | 1-tile Void Rift tax skip | Shock/Mire/Rime/Glyph/Spike/Lava/Pit Skip / Rift Hook as CORE, heal |
| fresh_stinger | leftover AP equals max AP poke | Full/Even/Odd/Gaunt/Stave/Score Sting as CORE, heal |
| summon_filer | pet walk-off-file AP tax | Summon Rank/Toll/Gait/Verse/Cast/Plate / Pack File as CORE, heal |
| prime_gifter | leftover AP=1 and MP=1 heal | Stave/Score/Tally/Poise/Gaunt/Hollow/Equal/Lean as CORE, isSummon, inferno, Cadence Prime |
| cadence_capper | remaining `n>2→2` | Dock/Snuff/Rise/Prime/Floor/Stall/Lag / Pack Cap as CORE, heal |
| gait_toller | next-walk +1 if leftover MP=0 | Still/Walk/Cast/Summon Toll / Ley Toll / Gait Tax as CORE, heal |
| brick_holder | cannot walk if barrier adjacent | Brick Brace/Step/Nudge / Stave Hold / Load Bearing as CORE, heal |
| watch_drainer | overwatch snap steals leftover MP | Watch Root/Sip/Bank/Fee/Alms / Root Snare as CORE, heal |
| even_gaiter | leftover-MP-even ≥ 2 poke | Odd/Lone/Pair/Full Gait / Even Sting / Dry Sting as CORE, heal |
| rime_cutter | near-ice-occupancy poke | Spike/Hazard/Portal Cut / Rime Reel/Skip as CORE, heal |
| cast_plater | next non-Strike spell deals 0 | Summon Plate / Mute Thread / Quiet Hex / Split Plate / Dual Plate as CORE, heal |

Wave 1–17 matrices in those docs still apply to those ids.

---

## 6. Role coverage after Wave 18

Every requested archetype still has a Wave 1 owner. Wave 18 does not invent a 21st role word. It adds **verbs**.

| Archetype | Wave 18 extra (new verb) |
| :--- | :--- |
| bruiser | `rank_biter` (share-rank-only bonus) |
| sniper | `watch_drainer` (snap steals leftover MP) |
| kiter | `rift_skipper` (1-tile Void Rift skip) |
| assassin | `stave_stinger`, `fresh_stinger`, `even_gaiter`, `rime_cutter` |
| healer | `stave_mender` (both-body sum===5), `prime_gifter` (exactly 1/1) |
| buffer | `stave_lender` (cash-out +1/+1) |
| debuffer | `stave_sipper` (steal leftover AP on sum===5), `verse_staver` (last-id until sum===5) |
| summoner | `dodeca_prelate` (3×4 = 12), `stave_prelate` (end-turn sum===5 post) |
| controller | `cadence_docker`, `cadence_capper`, `hymn_turner`, `stave_holder`, `must_staver`, `ring_warder`, `hepta_oather`, `gait_toller`, `brick_holder` |
| tank | — (Dual Plater is a protector) |
| protector | `stave_hooder`, `dual_plater`, `cast_plater` |
| artillery | `stave_bouncer` |
| kamikaze | — |
| teleporter | `stave_stepper` |
| displacement | `rime_reeler` |
| hazard creator | `stave_siller`, `last_marker` |
| status specialist | — |
| anti-summon | `summon_filer` |
| anti-ranged | `cast_plater` (next non-Strike spell deals 0) |
| anti-melee | `last_marker` (detonate on last leftover AP spent on the cell) |

---

## 7. Implementation notes (not this PR)

Do **not** implement production code from this document.

**Live defects that remain implementation prerequisites, not new families:**

1. Family HP must survive battle start (`WX` 11970–11974 currently overwrites with `calcEnemyMaxHp`).
2. `buildEnemyKit` must receive a **number** zone (`WX` 11920 currently passes `{ name, minLevel, maxLevel }` → NaN → zone 0).
3. Family `res` / `sp` must match `getEnemyBaseStats` integer bands (`spawnPolicy.ts` still writes 0.05–0.75 fractions).
4. `inferArchetype` must read `aiProfile`, not `healAmount` / `family.includes("berserk")`.
5. `inferSummonArchetype` must accept `dodecaspan` / `stavepost` (and still-missing `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) as empty-kit stationary posts, not hunter fallback.
6. Leftover AP / leftover MP / `walkMpSpentThisTurn` / `forcedMovedThisTurn` / caster-authored force-move / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / next-walk dest writers / last-leftover-AP-on-cell writer / overwatch leftover-MP steal writer.
7. Dodeca Span occupy-weight (live cap is 2; skip until remaining ≥ 12). Hendeca Span still skip until remaining ≥ 11. Dec Span still skip until remaining ≥ 10. Nine Span still skip until remaining ≥ 9.
8. `applyAttract` ice-occupancy dest (eleventh flavor after lava).
9. Cadence Cap remaining `n>2→2`. Cadence Dock remaining `2→0`. Cadence Floor is **already owned** by SDE #906 — do not ship a second id. Cadence Prime (`0→1`) is Wave 16. Cadence Rise (`1→2`) is Wave 17. Cadence Snuff (`1→0`) is Wave 17. Cadence Tern (`n>3→3`) is SDE Wave 17 — Wave 19.

**Wave 19 leftover (do not fill today):** SDE Wave 17 unique CORE (`spell-tern-stride`, `spell-octa-oath`, `spell-mire-reel`, `spell-diag-bite`, `spell-summon-mark`, `spell-prime-plate`, `spell-slide-skip`, `spell-capped-sting`, `spell-summon-orth`, `spell-gait-gift`, `spell-cadence-tern`, `spell-odd-toll`, `spell-brick-tax`, `spell-watch-tax`, `spell-thin-gait`, `spell-lava-cut`, `spell-strike-plate`, `spell-pack-ring`, `spell-lane-fold` — except Pack Ring / Lane Fold unless a later boss sheet claims them). Extra doors for those two stay `hoop_precentor` / `lane_fold_regent` — do **not** restamp as family ids. Same-day SPELL_PROPOSALS Wave 18 (#1132) stays Wave 19 family CORE (Sestet Mend leftover **sum === 6 AND unequal**; Cadence Tierce remaining `3→0`; Trideca Span occupy-weight **13**; Psalm Turn mixed-side invert). Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` stay kit-only. Same-day 2026-10-26 SDE, if any, also stays Wave 19. Hold mid-RAF splice, fourth `mpCost` walk snipe, player-owned Hex of Silence, sixth echo, thirteen-cell occupy, remaining zeros → 1 as a **second** Cadence Prime (`spell-cadence-arm` stays tombstoned), leftover 1/1 heal as a **second** Prime Gift (`spell-score-gift` / `spell-stave-gift` stay tombstoned), leftover AP − leftover MP === 2 as `spell-skew-*`. Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec/Hendeca/Dodeca cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / Score Post `scorepost` / Hendeca Span `hendecaspan` / Stave Post `stavepost` / Dodeca Span `dodecaspan` / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `stave_mender` | healer | `spell-stave-mend` | `stave_cantor` |
| `cadence_docker` | controller | `spell-cadence-dock` | `dock_precentor` |
| `dodeca_prelate` | summoner | `spell-dodeca-span` | `span_dodeca` (`summonAI: "dodecaspan"`) |
| `hymn_turner` | controller | `spell-hymn-turn` | — |
| `stave_hooder` | protector | `spell-stave-hood` | — |
| `stave_stinger` | assassin | `spell-stave-sting` | — |
| `stave_stepper` | teleporter | `spell-stave-step` | — |
| `stave_siller` | hazard creator | `spell-stave-sill` | — |
| `stave_holder` | controller | `spell-stave-hold` | — |
| `stave_lender` | buffer | `spell-stave-lend` | — |
| `stave_sipper` | debuffer | `spell-stave-sip` | — |
| `stave_prelate` | summoner | `spell-stave-post` | — (`summonAI: "stavepost"`) |
| `stave_bouncer` | artillery | `spell-stave-bounce` | — |
| `must_staver` | controller | `spell-must-stave` | — |
| `verse_staver` | debuffer | `spell-verse-stave` | — |
| `ring_warder` | controller | `spell-ring-stride` | `ring_gallery` |
| `hepta_oather` | controller | `spell-hepta-oath` | `hepta_nave` |
| `rime_reeler` | displacement | `spell-rime-reel` | `frost_aisle` |
| `rank_biter` | bruiser | `spell-rank-bite` | — |
| `last_marker` | anti-melee | `spell-last-mark` | `last_pulpit` |
| `dual_plater` | protector | `spell-dual-plate` | — |
| `rift_skipper` | kiter | `spell-rift-skip` | `rift_court` |
| `fresh_stinger` | assassin | `spell-fresh-sting` | — |
| `summon_filer` | anti-summon | `spell-summon-file` | — |
| `prime_gifter` | healer | `spell-prime-gift` | — |
| `cadence_capper` | controller | `spell-cadence-cap` | — (observe `cadence_thief` / `hex_chorister`) |
| `gait_toller` | controller | `spell-gait-toll` | — |
| `brick_holder` | controller | `spell-brick-hold` | — |
| `watch_drainer` | sniper | `spell-watch-drain` | — |
| `even_gaiter` | assassin | `spell-even-gait` | — |
| `rime_cutter` | assassin | `spell-rime-cut` | — |
| `cast_plater` | protector / anti-ranged | `spell-cast-plate` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Dock / Pack Orth / Leap Fold stay kit-only.

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–17 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `spell-score-gift` / `spell-stave-gift` / `wave18:` colliding ids.
- No restamp of `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` / `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent` / `hoop_precentor` / `lane_fold_regent` / `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` as family ids.
- Same-day SPELL_PROPOSALS Wave 18 (#1132) was not cloned; it stamps as Wave **19** family CORE.

All **32** sheets: **STATUS: PROPOSED**.

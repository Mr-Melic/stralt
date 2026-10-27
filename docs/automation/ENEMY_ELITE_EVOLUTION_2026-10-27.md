# Enemy and Elite Evolution Design — Wave 19

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-27  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Nineteenth daily pass. **32** new world-pack families that consume **SDE Wave 17 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md`, open PR #1082) **except** Pack Ring / Lane Fold, plus **SPELL_PROPOSALS Wave 18 verbs** (`SPELL_PROPOSALS_2026-10-26.md`, open PR #1132) **except** Court Tierce (`NOT_PLAYER_LEARNABLE`). Cadence Floor remains **SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Cadence Tern (`n>3` → `3`) is this pass’s SDE CORE, not Cadence Tierce (`n===3` → `0`) and not Cadence Dock (`n===2` → `0`) and not Cadence Cap (`n>2` → `2`). Gait Gift (one-body leftover **AP ≥ 2 AND MP = 0**) is this pass’s SDE CORE, not Sestet Mend (both-body leftover **sum === 6 AND unequal**). Prime Plate (leftover **1/1** negate) is this pass’s SDE CORE, not Dual Plate / Sestet Hood. Trideca Span (orthogonal plus **arm 3**, counts as **thirteen**) is this pass’s occupy card. SDE Wave 18 unique CORE (`spell-hook-stride` … `spell-hook-fold`, open PR #1143) stays extras until Wave 20. Bosses stay on the existing catalog.

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
- [`ENEMY_ELITE_EVOLUTION_2026-10-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-bc5c/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-26.md) (Wave 18, 32 family sheets — open PR #1138; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 18

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–18. Wave 18 closed as docs in the 2026-10-26 pass (PR #1138). SPELL_PROPOSALS latest on this cron is Wave 18 (#1132). SDE latest unique-CORE lag is Wave 17 (#1082). Same-day SDE Wave 18 (#1143) is **Wave 20** family CORE. This pass consumes **#1082** unique CORE (minus Pack Ring / Lane Fold) plus **#1132** (minus Court Tierce). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥17 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`) at `src/frontend/src/components/WorldExploration.tsx`. Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 18 claim | 2026-10-27 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–18 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186; `res` is an integer roll) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16821; void 25% reflect (`castHelpers.ts` 335–337) | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 72–84) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / Tally / Score / Stave / **Sestet** Post count as **1**. Triple = 3 … Dodeca Span = 12. **Trideca Span = 13** — skip Trideca until remaining cap ≥ 13 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Sestet Mend / Gait Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `tridecaspan` / `sestetpost` (and still no `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938; overworld **draw** WX 8067. **Unread as a combat gate.** | Facing families still fail closed. Wave 19 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 19 CORE rows stay `mpCost: 0`. Sestet Lend / Sestet Sip / Psalm Turn / Watch Tax rewrite **current leftover AP/MP** or next-spell AP, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Mire Reel is the **twelfth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava / ice, then **painted mire occupancy**). Dest is never `map.portals` |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–18 force families still fail closed. Wave 19 adds **zero** new force-gated CORE cards |
| `lastResolvedSpellId` | Absent | `verse_sesteter` (and Waves 10–18 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` / Wave 16 `cast_toller` still wait. Strike Plate zeros the **next Strike payload**, not a new persist stat |
| `walkMpSpentThisTurn` | Absent | Sestet\* leftover-sum gates / Gait Gift / Prime Plate / Thin Gait / Capped Sting / Odd Toll fail closed until battle walks write leftover MP |
| One next walk Chebyshev **exactly 3**, **orthogonal only** / next-spell exact Chebyshev **8** / pull toward nearest **painted mire occupancy** / bonus if share a **diagonal** / cell detonates on **summon spawn onto** / leftover **1/1** miss / 1-tile **conveyor** skip / leftover MP **equals max MP** poke / allied-summon **walk-diagonal** AP tax / heal-if leftover **AP≥2 AND MP=0** / remaining `n>3→3` / next **walk** +1 AP if leftover **AP is odd** / next walk +1 AP while **barrier adjacent** / overwatch snap **taxes next spell +1 AP** / leftover **AP===1 AND MP===0** poke / bonus if near **lava occupancy** / target’s next **Strike** deals 0 | Still absent as CORE identities | Wave 19 secondary opportunity (SDE Wave 17 unique CORE leftover). Pack Ring / Lane Fold stay closed |
| Heal-if both bodies leftover AP + leftover MP **=== 6 AND unequal** / remaining `3` → `0` / orthogonal plus **arm 3** occupy (thirteen) / invert leftover on **one ally and one hostile** (caster stays) / next hit 0 while sum===6 unequal / sting / join / start-turn occupy / cannot-walk-while-sum===6 unequal / +AP+MP if ally sum===6 unequal (**exits** window) / steal leftover AP iff sum===6 unequal / end-turn occupy sum===6 unequal post / bounce among sum===6 unequal / non-Strike illegal unless sum===6 unequal **and** last AP / last-id illegal until sum===6 unequal | Still absent in live catalog | Wave 19 primary opportunity (SPELL_PROPOSALS Wave 18). Court Tierce stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Prime Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Thin Gait is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Diag Bite is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16821) | Only live MP-debit hook. Mire Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Tern is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 335–337) | Only live reflect. Psalm Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 19 families exist so those verbs are **sentences**, not extra HP.

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

**Wave 18 ids — do not re-propose:**  
`stave_mender`, `cadence_docker`, `dodeca_prelate`, `hymn_turner`, `stave_hooder`, `stave_stinger`, `stave_stepper`, `stave_siller`, `stave_holder`, `stave_lender`, `stave_sipper`, `stave_prelate`, `stave_bouncer`, `must_staver`, `verse_staver`, `ring_warder`, `hepta_oather`, `rime_reeler`, `rank_biter`, `last_marker`, `dual_plater`, `rift_skipper`, `fresh_stinger`, `summon_filer`, `prime_gifter`, `cadence_capper`, `gait_toller`, `brick_holder`, `watch_drainer`, `even_gaiter`, `rime_cutter`, `cast_plater`.

This Wave 19 family pass consumes **#1082** unique CORE (minus Pack Ring / Lane Fold) plus **#1132** (minus Court Tierce). **Wave 20** consumes SDE Wave 18 unique CORE (`spell-hook-stride` … `spell-hook-fold`, except Pack Hook / Hook Fold unless a later boss sheet claims them) plus same-day SPELL_PROPOSALS Wave 19 if that catalog opens. Extra doors stay kit-only (`sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` / `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`). This run does not mint colliding `wave19:` spell ids. Same-day 2026-10-27 SPELL_PROPOSALS / SDE stay Wave **20** family CORE if they open after this stamp — do not clone unique Wave-18 §11 here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` / `spell-pack-diag` / `spell-far-fold` / `spell-court-snuff` / `spell-pack-orth` / `spell-leap-fold` / `spell-court-dock` / `spell-pack-ring` / `spell-lane-fold` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is Wave 16 CORE. Cadence Rise (`n==1` → `2`) is Wave 17. Cadence Snuff (`n==1` → `0`) is Wave 17. Cadence Cap (`n>2` → `2`) is Wave 18. Cadence Dock (`n===2` → `0`) is Wave 18. Cadence Tern (`n>3` → `3`) is this pass. Cadence Tierce (`n===3` → `0`) is this pass’s **other** remaining rewrite — inverse of leaving a 3 after Tern, not a Floor clone. Cadence Quad (`n>4` → `4`) is SDE Wave 18 — Wave 20.

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

**Stationary-post / multi-body cap (extend Wave 18):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** Tally Post **or** Dec Span **or** Score Post **or** Hendeca Span **or** Stave Post **or** Dodeca Span **or** **Sestet Post** **or** **Trideca Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / **Sestet Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. Dec Span counts as **ten**. Hendeca Span counts as **eleven**. Dodeca Span counts as **twelve**. **Trideca Span counts as thirteen.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, Dec Span, Score Post, Hendeca Span, Stave Post, Dodeca Span, Sestet Post, or Trideca Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-…thirteen-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, a Dec Span axis-aligned 2×5, a Hendeca Span stretched plus (7-spine × 5-crossbar, center occupied), a Dodeca Span axis-aligned 3×4, **or** a Trideca Span orthogonal plus arm 3, never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, Tally Post, Score Post, Stave Post, and Sestet Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole). Hendeca Span occupies **every** cell of the stretched plus (no cage hole; **no diagonal cells**). Dodeca Span occupies **every** cell of the 3×4 (no cage hole). Trideca Span occupies **every** cell of the plus (center + four arms of length 3; **no diagonal cells of the bounding 7×7**). Hendeca / Trideca click is **center**. Dodeca click is the **cell of the 3×4 closest to the caster** (Dec rule).

**Summon-cap prerequisite (extend Wave 18):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. … Dodeca Span is illegal until remaining cap ≥ 12. **Trideca Span is illegal until remaining cap ≥ 13.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post are legal at remaining ≥ 1. Do not spawn `trideca_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 18):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / Tally\* leftover-sum / Equal Gift / Tied Gait / Score\* leftover-sum / Lean Gift / Dry Plate / Odd Gait / Even Sting / Still Toll / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / Even Gait / Gait Toll / **Sestet\*** leftover-sum / **Gait Gift** / **Prime Plate** / **Thin Gait** / **Capped Sting** / **Odd Toll** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Brick Step / Score Step / Stave Step / **Sestet Step** / **Tern Stride** / **Slide Skip** are relocates or next-walk locks — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 18):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / Tally\* leftover-sum / Odd Plate / Odd Sting / Equal Gift / Tied Gait / Score\* leftover-sum / Even Sting / Lean Gift / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / **Sestet\*** leftover-sum / **Gait Gift** / **Prime Plate** / **Thin Gait** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3** (2/1, 1/2, 3/0, 0/3 — **not** 2/2), **enables** Score when the surviving banks **sum to 4 and are unequal** (4/0, 0/4, 3/1, 1/3 — **not** 2/2), **cannot enable Stave** (max surviving leftover is 2/2 = sum 4), **cannot enable Sestet** (sum 6), **enables Dual Plate** when both leftover AP and leftover MP are even and ≥ 2 (2/2 is Dual Plate **and** Poise), **enables Gait Gift** when leftover AP ≥ 2 **and** leftover MP = 0 (Dual Keep 2/0 if it can sit there), **enables Prime Plate / Prime Gift** when leftover is **exactly 1/1**, **enables Thin Gait** when leftover is **exactly 1/0**, and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold (2,1) / (1,2) / (3,0) / (0,3) for Tally. Hold (4,0) / (0,4) / (3,1) / (1,3) for Score. Hold (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3) for Stave. Hold leftover **exactly 1/1** for Prime Gift / Prime Plate. Hold leftover **exactly 1/0** for Thin Gait. Hold leftover **AP ≥ 2 AND MP = 0** for Gait Gift. Hold (6,0) / (0,6) / (5,1) / (1,5) / (4,2) / (2,4) for Sestet — Dual Keep **cannot** sit here. `leftover AP = 0` and `leftover MP = 0` is **not** a Sestet window, **not** a Stave window, **not** a Score window, **not** a Tally window, and **not** a Poise window. Dual Keep 2/2 is Poise (sum 4 **and** a tie) **and** Dual Plate. Dual Keep 3/1 **is** Score. Dual Keep **cannot** sit on sum 5 or sum 6. Score Lend (3,1)→(4,2) **manufactures Sestet**. Sestet Lend (4,2)→(5,3) **exits** to 8. Sestet Sip (4,2)→(3,2) **manufactures Stave**; (5,1)→(4,1) **manufactures Stave**; (6,0)→(5,0) **manufactures Stave**. (3,3) is Poise, **not** Sestet (`sestetForbidEqual`).

**Last-id prerequisite (extend Wave 18):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / Verse Tally / Summon Verse / Verse Score / Verse Stave / **Verse Sestet** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 18):** Shove Mark / Drift Gift / Heave\* / Drift\* / Shove Gift fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, Score Step, Stave Step, Sestet Step, Home Step, and Tern Stride dests do **not** set the flag. Wave 19 adds **zero** new force-gated CORE cards. Mire Reel **is** an attract — it needs `applyAttract` wired, not a new persist flag.

**Facing / Struck prerequisites (partial):** Wave 19 adds **zero** facing CORE cards. Strike Plate zeros the **next Strike payload** — fail closed until Strike / `physical_attack` is identifiable by **id**, not name. Clash Mend / Strike Debter / Cast Toll still wait on `struckThisTurn`. Strike Mark (Wave 17) still waits on Strike-from-cell. Summon Mark waits on **summon spawn onto the painted cell**.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Sestet Mend MULTI child `sestet_cantor` — first child wins vs `sestet_mender` observe. Cadence Tierce MULTI child `tierce_precentor` — first child wins vs `cadence_tiercer` observe. Trideca Span MULTI child `span_trideca` — first child wins vs `trideca_prelate` observe. Court Tierce stays `court_tierce_regent` kit-only. Tern Stride teach room `tern_gallery` — first child wins vs `tern_warder` observe. Octa Oath teach room `octa_nave` — first child wins vs `octa_oather` observe. Mire Reel teach room `bog_aisle` — first child wins vs `mire_reeler` observe. Summon Mark teach room `spawn_pulpit` — first child wins vs `summon_marker` observe. Slide Skip teach room `belt_nave` — first child wins vs `slide_skipper` observe. Pack Ring stays `hoop_precentor` kit-only. Lane Fold stays `lane_fold_regent` kit-only. Gait Gift / Cadence Tern / Prime Plate / Diag Bite / Capped Sting / Summon Orth / Odd Toll / Brick Tax / Watch Tax / Thin Gait / Lava Cut / Strike Plate / Psalm Turn / Sestet Hood / Sestet Sting / Sestet Step / Sestet Sill / Sestet Hold / Sestet Lend / Sestet Sip / Sestet Post / Sestet Bounce / Must Sestet / Verse Sestet have **no** extra door — do **not** invent `gait_cantor_gift` / `tern_precentor` / `prime_plater_door` / `lean_cantor` / restamp `gait_cantor` / `stave_cantor` / `score_cantor` / `tally_cantor` / `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor` / `prime_precentor` / `snuff_precentor` / `dock_precentor` / `tierce_precentor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `rank_precentor`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `diag_precentor`, `far_fold_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`, `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`, `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`, `hook_gallery`, `nona_nave`, `mill_aisle`, `idle_pulpit`, `brier_nave`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` / `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` / `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` / `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` / `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`.

---

## 2. Why Wave 19 exists (gaps Waves 1–18 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag). Wave 15 covered leftover SDE Wave 13 unique CORE (minus Pack File / Diag Fold) + SPELL_PROPOSALS Wave 14 (minus Cadence Floor / Court Floor). Wave 16 covered leftover SDE Wave 14 unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) + SPELL_PROPOSALS Wave 15 (minus Court Prime). Wave 17 covered leftover SDE Wave 15 unique CORE (minus Pack Diag / Far Fold) + SPELL_PROPOSALS Wave 16 (minus Court Snuff). Wave 18 covered leftover SDE Wave 16 unique CORE (minus Pack Orth / Leap Fold) + SPELL_PROPOSALS Wave 17 (minus Court Dock).

SPELL_PROPOSALS Wave 18 (#1132) then stamped the holes Wave 18 **held**: both-body leftover AP + leftover MP **=== 6 AND unequal** heal (Sestet Mend), remaining `3` → `0` (Cadence Tierce), orthogonal plus thirteen-cell occupy (Trideca Span), and a mixed-side leftover invert (Psalm Turn) plus the Sestet court. A G≥18 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 17 unique CORE still had no CORE owner after Wave 18. Seventeen of those verbs fill holes Wave 18 tactical does not: one next walk Chebyshev **exactly 3 orthogonal**, next-spell exact Chebyshev **8**, pull toward nearest **painted mire occupancy**, bonus if share a **diagonal**, cell detonates on **summon spawn onto**, leftover **1/1** miss, 1-tile **conveyor** skip, leftover MP **equals max MP** poke, allied-summon **walk-diagonal** AP tax, heal-if leftover **AP≥2 AND MP=0**, remaining `n>3→3`, next **walk** +1 AP if leftover **AP is odd**, next walk +1 AP while **barrier adjacent**, overwatch snap **taxes next spell +1 AP**, leftover **AP===1 AND MP===0** poke, bonus if near **lava occupancy**, target’s next **Strike** deals 0. Pack Ring and Lane Fold stay closed.

SDE Wave 18 (#1143) unique CORE stays extras until Wave 20. Cadence Quad (`n>4` → `4`) is **not** Cadence Tern. Wide Gift (leftover AP **≥ 2 AND** leftover MP **≥ 1**) is **not** Sestet Mend. Thin Plate (leftover **1/0** negate) is **not** Prime Plate. Hook Stride is **not** Tern Stride. Trideca Span is **not** a thirteen-cell hold for a later SDE occupy — #1132 filled that hole.

| Unused Wave 18 / SDE Wave 17 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-sestet-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 6 AND unequal**) | `stave_mender` (both leftover **sum === 5**); `score_mender` (both leftover **sum === 4 AND unequal**); `tally_mender` (both leftover **sum === 3**); `gait_gifter` (this pass, one-body leftover **AP≥2 AND MP=0**); `prime_gifter` (leftover **exactly 1/1**) | Four leftover reads on an **even** sum Dual Keep **cannot** fake, equality banned so (3,3) stays Poise. Extra door is `sestet_cantor` — family is **`sestet_mender`**. Do **not** restamp `stave_cantor` / `score_cantor` / `tally_cantor`. |
| `spell-cadence-tierce` (remaining `n===3` → `0`; zeros stay 0; `n===1`, `n===2`, and `n>3` unchanged) | `cadence_docker` (`n===2` → **0**); `cadence_snuffer` (`n==1` → **0**); `cadence_terner` (this pass, `n>3` → **3** — **threes stay 3**); `cadence_capper` (`n>2` → **2**) | Ready-**unlock of a 3**. Extra door is `tierce_precentor` — family is **`cadence_tiercer`**. Do **not** mint `cadence_floorer` / `tern_precentor`. |
| `spell-trideca-span` (orthogonal plus arm 3, counts as **thirteen**) | `dodeca_prelate` (3×4 = 12, **nearest-cell click**); `hendeca_prelate` (stretched plus = 11, **center click**, asymmetric); `dec_prelate` (2×5 = 10) | Thirteen tiles, plus with unique center, empty kit. Extra door is `span_trideca` — family is **`trideca_prelate`**. Skip until remaining cap ≥ 13. |
| `spell-psalm-turn` (invert leftover AP↔MP on **one same-side non-caster and one opposite-side**; caster unchanged) | `hymn_turner` (**two allies**); `duel_turner` (**two hostiles**); `purse_turner` (**one** hostile); `bar_crosser` (two-body **cross** through the caster) | Mixed-side independent purses. Sum invariant: Sestet stays Sestet; Stave stays Stave. Do **not** mint `spell-mixed-turn`. Choir Hymn is a Wave-1 heal. |
| `spell-sestet-hood` (next hit is 0 **while leftover AP + leftover MP === 6 AND unequal**, any range) | `stave_hooder` (sum === 5); `score_hooder` (sum === 4 unequal); `prime_plater` (this pass, leftover **1/1**) | Hold (4,2). Dual Keep 2/2 is Dual Plate / Poise Hood, **not** this. (3,3) is Poise. |
| `spell-sestet-sting` (10 + 8 iff leftover AP + leftover MP === 6 AND unequal) | `stave_stinger` (sum === 5); `score_stinger` (sum === 4 unequal); `capped_stinger` (this pass, leftover MP **equals max**) | Punish (6,0) / (0,6) / (5,1) / (1,5) / (4,2) / (2,4). 2/2 is Poise / Dual Plate. 3/3 is Poise. |
| `spell-sestet-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 6 AND unequal) | `stave_stepper` (sum === 5); `score_stepper` (sum === 4 unequal); `home_stepper` (**ungated**) | Join the body that **sums to 6 without tying**. Relocate, not `isSwap`. |
| `spell-sestet-sill` (occupant sum===6 unequal at **start of their turn** takes 8; paint stays) | `stave_siller` (sum === 5); `score_siller` (sum === 4 unequal); `wake_marker` (start-turn occupy **any leftover**, consume) | Tax the camp **on their turn start** if they held a Sestet pair. Dual Keep 2/2 **misses**. |
| `spell-sestet-hold` (cannot walk while leftover AP + leftover MP === 6 AND unequal) | `stave_holder` (while sum === 5); `score_holder` (while sum === 4 unequal); `brick_holder` (**barrier adjacent**) | (0,6) has MP but cannot spend it. Spend leftover AP **or** dump to 3/3. **Do not PAIR with Must Sestet.** |
| `spell-sestet-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 6 AND unequal — **exits** to sum 8) | `stave_lender` (+1/+1 if sum === 5 — **exits** to 7); `score_lender` (+1/+1 if sum === 4 unequal — **exits** to 6, **which is this family’s window**) | Cash the window. Score Lend **manufactures Sestet**. |
| `spell-sestet-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 6 AND unequal and leftover AP ≥ 1) | `stave_sipper` (steal iff sum === 5); `score_sipper` (steal iff sum === 4 unequal); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (4,2) → (3,2) **Stave**. Sip (5,1) → (4,1) **Stave**. (0,6) fizzles (no AP). **Sip always manufactures Stave when it lands.** |
| `spell-sestet-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 6 AND unequal** deals 10 and it dies) | `stave_prelate` (sum === 5); `score_prelate` (sum === 4 unequal); `dummy_prelate` (taunt) | Camp sum===6 unequal on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "sestetpost"`. |
| `spell-sestet-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===6-unequal hostile) | `stave_bouncer` (second body sum === 5); `score_bouncer` (second body sum === 4 unequal); Chain Lightning (nearest **any**) | Second 12 needs **two** Sestet bodies. Missing flag → 12 only. |
| `spell-must-sestet` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 6 AND unequal **and** this spell spends last AP) | `must_staver` (sum === 5 / last AP); `must_scorer` (sum === 4 unequal / last AP); `sestet_holder` (this pass, **walk** needs sum ≠ 6 unequal) | Inverse of Sestet Hold. Strike stays legal. **Do not PAIR with Sestet Hold.** |
| `spell-verse-sestet` (last resolved id **illegal until leftover AP + leftover MP === 6 AND unequal**) | `verse_staver` (until sum === 5); `verse_scorer` (until sum === 4 unequal); `last_muter` (**duration**) | Recast Inferno only after **sum === 6 unequal**. 2/2 and 3/2 and 3/3 and 0/0 do **not** lift. |
| `spell-tern-stride` (**next walk** legal only if Chebyshev **exactly 3**, **orthogonal only**) | `ring_warder` (Chebyshev **exactly 2**, knight excluded — includes `(2,2)`); `orth_warder` (**any** orthogonal length); `file_warder` (same **x**); Knight Stride (**only** `(2,1)`) | Extra room is `tern_gallery` — family is **`tern_warder`**. One step, Chebyshev 3, not a knight hop, not a ring. Do **not** name it `tern_gallery` or `ring_warder`. |
| `spell-octa-oath` (next spell must be Chebyshev **exactly 8**) | `hepta_oather` (exact **7**); `hexa_oather` (exact **6**); `oct_prelate` (occupy-weight 8); `long_oather` (**≥ 3**) | Frost at 1–7 or ≥ 9 fizzles. Strike stays legal. Extra room `octa_nave` is a teach — family is **`octa_oather`**. Do **not** name it `octa_nave` or `oct_prelate`. Do **not** mint `spell-octa-span`. |
| `spell-mire-reel` (pull 1 toward nearest **painted mire occupancy**) | `lava_reeler` (toward **lava occupancy**); `rime_reeler` (toward **ice occupancy**); `mire_skipper` (ignore mire **enter-tax**); Mire Sheet (**paints** the cell) | Twelfth `applyAttract` dest flavor. Extra room `bog_aisle` is a teach — family is **`mire_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no painted mire fizzles. |
| `spell-diag-bite` (10 + 10 if share a **diagonal** `\|dx\|==\|dy\|`) | `file_biter` (share **file only**); `rank_biter` (share **rank only**); `axis_biter` (share rank **or** file) | Bonus on the diagonal. Rank-only / file-only → 10 only. Family is **`diag_biter`**. Do **not** name it `diag_warder` or `diag_locksmith`. |
| `spell-summon-mark` (cell detonates when a summon is **spawned onto** it; consume) | `strike_marker` (**Strike from**); `last_marker` (**last leftover AP**); `cast_marker` (**spell** confirm); `ingress_marker` (**walk enter**) | Walk-on is free. Spell-from is free. **Spawn onto** the paint pays. Extra room `spawn_pulpit` is a teach — family is **`summon_marker`**. Do **not** name it `spawn_pulpit` or `last_marker`. |
| `spell-prime-plate` (next hit is 0 **while leftover AP === 1 AND leftover MP === 1**; consume on miss) | `dual_plater` (leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**); `dry_plater` (leftover **MP = 0**); `sestet_hooder` (this pass, leftover **sum === 6 unequal**); `prime_gifter` (leftover **1/1 heal**) | Hold (1,1). Dual Keep 1/1 **is** this window if it survives. Family is **`prime_plater`**. Do **not** name it `prime_gifter` or `dual_plater`. |
| `spell-slide-skip` (next **1-tile** walk ignores **conveyor** auto-push) | `rift_skipper` (**Void Rift** tax); `shock_skipper` (**shock enter-tax**); `mire_skipper` (**mire enter-tax**); Slide Tile **is** the conveyor | Wrong hazard still ticks. Length ≥ 2 pays. Extra room `belt_nave` is a teach — family is **`slide_skipper`**. Do **not** name it `slide_mason` or `rift_skipper`. |
| `spell-capped-sting` (leftover MP **equals that body’s max MP** → bonus damage) | `fresh_stinger` (leftover AP **equals max AP**); `full_stinger` (leftover AP **≥ 3**, max unread); `even_stinger` (leftover AP **even ≥ 2**) | They may have spent AP and still hold max MP — Capped Sting still hits. Family is **`capped_stinger`**. |
| `spell-summon-orth` (allied summons pay +1 **AP** to **walk diagonal**) | `summon_filer` (walk **off file**); `summon_ranker` (walk **off rank**); `summon_toller` (+1 AP to start **any** walk); Pack Orth (`ENEMY_ONLY` hard lock) | Orthogonal walks are free of this tax. **Do not PAIR with Summon File / Summon Rank / Summon Toll.** Family is **`summon_orther`**. |
| `spell-gait-gift` (heal 10 iff leftover **AP ≥ 2 AND leftover MP = 0**) | `prime_gifter` (exactly **1/1**); `lean_gifter` (AP=0 and MP≥1); `sestet_mender` (this pass, both leftover **sum === 6 unequal**); Hollow / Gaunt (0/0) | Healer CORE only. (6,0) is Gait Gift **and** a Sestet pair — Sestet still needs **both** bodies. **No extra door** — do not invent `gait_cantor_gift` / restamp `gait_cantor`. Family is **`gait_gifter`**. |
| `spell-cadence-tern` (remaining `n>3` → `3`; 0/1/2/3 unchanged) | `cadence_tiercer` (this pass, `n===3` → **0**); `cadence_capper` (`n>2` → **2**); `cadence_docker` (`n===2` → **0**); Floor (`n>1` → 1) | Compress a 7 to a 3. Observe via `cadence_thief` / `hex_chorister`. Do **not** restamp `floor_precentor` / `tierce_precentor` / `dock_precentor`. Family is **`cadence_terner`**. Do **not** name it `cadence_tiercer`. |
| `spell-odd-toll` (next **walk** +1 AP if leftover **AP is odd**) | `gait_toller` (next walk if leftover **MP = 0**); `still_toller` (next **spell** if leftover MP = 0); `walk_toller` (Wave-7 walk-pool flag) | Camp leftover 1/3/5 then walk. Keep leftover AP even. Family is **`odd_toller`**. |
| `spell-brick-tax` (next **walk** +1 AP while adjacent to a **barrier**) | `brick_holder` (**forbids** the walk); `brick_bracer` (**negates a hit** while adjacent); `brick_stepper` (**relocates through** the barrier) | Cover-camping walk tax. Destroy the barrier and the tax drops; lock **stays** until duration. Family is **`brick_taxer`**. Do **not** name it `brick_holder` or `tax_scribe`. |
| `spell-watch-tax` (next **overwatch snap** **taxes the walker’s next spell +1 AP**) | `watch_drainer` (**steals 1 leftover MP**); `watch_rooter` (**zeros** leftover MP); `watch_sipper` (**steals leftover AP**); Quiet Hex is an ungated **next-spell** tax | Ending a walker’s remaining walk mid-path **and** charging their next confirm. **Do not PAIR with Watch Drain / Watch Root / Watch Sip.** Family is **`watch_taxer`**. |
| `spell-thin-gait` (leftover **AP === 1 AND leftover MP === 0** → bonus damage) | `even_gaiter` (leftover MP **even ≥ 2**); `odd_gaiter` (leftover MP **odd**); `prime_gifter` / `prime_plater` (**1/1**); Dry Sting (leftover MP **= 0**, leftover AP unconstrained) | Poke leftover 1/0. 1/1 is Prime. 0/0 is Gaunt. Family is **`thin_gaiter`**. Do **not** name it `thin_warder` or `even_gaiter`. |
| `spell-lava-cut` (10 + 10 if target is Chebyshev ≤ 2 from **lava occupancy**) | `rime_cutter` (**ice occupancy**); `spike_cutter` (**spike occupancy**); `hazard_cutter` (**painted** hazard); `lava_reeler` (**pulls**); `lava_skipper` (**ignores tax**) | Threshold poke. Twin Gate pads are **not** lava. Family is **`lava_cutter`**. |
| `spell-strike-plate` (target’s next **Strike** deals 0; AP still spent) | `cast_plater` (next **non-Strike spell** deals 0); `summon_plater` (allied summons treat the **next incoming hit** as 0); Mute Thread (silence-ish) | Tools still deal full. Hit them with Frost, or wait the consume. Family is **`strike_plater`**. Do **not** name it `cast_plater` or `strike_marker`. **Do not PAIR with Cast Plate on one BASE kit.** |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-tierce` (`NOT_PLAYER_LEARNABLE`; `court_tierce_regent` kit — same law as Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-ring` (ENEMY_ONLY; stays `hoop_precentor` CHAMPION SIGNATURE), `spell-lane-fold` (BOSS_ONLY; `lane_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor / Pack Rank / Rank Fold / Court Prime / Pack Diag / Far Fold / Court Snuff / Pack Orth / Leap Fold / Court Dock stay where Waves 5–18 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 19 CORE rows are `mpCost: 0`. Sestet Sip / Sestet Lend / Psalm Turn / Watch Tax rewrite **current leftover AP/MP** or next-spell AP.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Sestet Post / Summon Mark / Cadence Tierce / Cadence Tern are **not** queue splices.  
Do **not** family a fourteen-cell occupy this pass. Trideca Span is the thirteen-cell card. Dodeca Span already owns twelve. Hendeca Span already owns eleven.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Hook Stride / Nona Oath / Slide Reel / Hook Bite / Idle Mark / Thin Plate / Brier Skip / Wide Sting / Summon Hook / Wide Gift / Cadence Quad / Even Toll / Brick Fee / Watch Bind / Prime Gait / Slide Cut / Idle Plate / Pack Hook / Hook Fold (SDE Wave 18 unique CORE — Wave 20).  
Do **not** family leftover AP − leftover MP === 2 as `spell-skew-*`. (3,1) is Score; (4,2) is Sestet.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family leftover 1/1 heal as `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift`. Prime Gift is Wave 18; Gait Gift is this pass.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 18 unique CORE as this pass’s CORE.  
Do **not** mint `wave19:` colliding spell ids.  
Do **not** name the Sestet Mend family `sestet_cantor`, the Trideca Span family `span_trideca`, the Tern Stride family `tern_gallery` or `ring_warder`, the Octa Oath family `octa_nave` or `oct_prelate` or `hepta_oather`, the Mire Reel family `bog_aisle` or `lava_reeler` or `mire_skipper`, the Summon Mark family `spawn_pulpit` or `last_marker` or `strike_marker`, the Cadence Tierce family `tierce_precentor` or `cadence_floorer` or `cadence_terner`, the Cadence Tern family `tern_precentor` or `cadence_tiercer` or `cadence_capper`, the Gait Gift family `gait_cantor` or `prime_gifter` or `sestet_mender`, the Prime Plate family `prime_gifter` or `dual_plater`, the Diag Bite family `diag_warder` or `file_biter` or `rank_biter`, the Slide Skip family `slide_mason` or `rift_skipper`, the Summon Orth family `summon_filer` or `orth_warder`, the Brick Tax family `brick_holder` or `tax_scribe`, the Watch Tax family `watch_drainer`, the Thin Gait family `thin_warder` or `even_gaiter` or `odd_gaiter`, the Lava Cut family `rime_cutter` / `lava_reeler` / `spike_cutter`, the Strike Plate family `cast_plater` / `strike_marker` / `summon_plater`, the Psalm Turn family `hymn_turner` / `duel_turner` / `purse_turner`, the Odd Toll family `gait_toller` / `still_toller` / `walk_toller`, or the Capped Sting family `fresh_stinger` / `cap_warder`.

---

## 3. Encounter synergy packs (Waves 1–19)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** Score Post **or** Stave Post **or** Sestet Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span **or** Hendeca Span **or** Dodeca Span **or** Trideca Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Sestet Choir | `sestet_mender` + `verse_sesteter` + `ignite_alchemist` | Sum===6 unequal 8, then Inferno is illegal until leftover AP + leftover MP === 6 unequal |
| Trideca Plug | `trideca_prelate` + `sestet_siller` + `tern_warder` | Plus-arm-3 corridor seal, tax a neighbor at turn start, lock the next walk to Chebyshev 3 orthogonal. Skip until remaining cap ≥ 13 |
| Tern Octa | `tern_warder` + `octa_oather` + `glass_sniper` | Next walk must be Chebyshev 3 orthogonal, next spell must be exact 8, snipe from 8 |
| Mire Diag | `mire_reeler` + `diag_biter` + `glyph_sower` | Pull toward painted mire, then bite the diagonal they now share |
| Spawn Prime | `summon_marker` + `prime_plater` + `brood_chanter` | Paint the spawn cell, then camp leftover 1/1 behind the miss |
| Slide Cap | `slide_skipper` + `capped_stinger` + `tide_shade` | Cross the conveyor without the push, then poke leftover MP === max MP |
| Gait Tern | `gait_gifter` + `cadence_terner` + `font_cantor` | Heal the AP≥2/MP=0 window, then compress remaining n>3 → 3 |
| Odd Brick | `odd_toller` + `brick_taxer` + `stone_castellan` | Tax the next walk at leftover AP odd, then tax again while barrier-adjacent |
| Watch Thin | `watch_taxer` + `thin_gaiter` + `glass_sniper` | Snap taxes next spell +1 AP, then poke leftover 1/0 |
| Lava Kennel | `lava_cutter` + `summon_orther` + `strike_plater` | Threshold poke near lava, then tax pet diagonal walks **or** zero the next Strike — COURT, never PAIR Orth + Plate on one BASE kit |
| Psalm Sestet | `psalm_turner` + `sestet_mender` + `sestet_stinger` | Invert mixed-side purses while keeping sum 6 unequal, then heal / sting |
| Tierce Verse | `cadence_tiercer` + `verse_sesteter` + `tax_scribe` | Unlock remaining 3 → 0, then lock recast until they sit Sestet |
| Sestet Quiet | `sestet_stepper` + `sestet_mender` + `cover_squire` | Join the sum===6 unequal ally, then cash the six leftover reads |
| Purse Sestet | `psalm_turner` + `sestet_sipper` + `stave_stinger` | Invert, then sip (4,2)→(3,2) **Stave**, then sting the manufactured window |
| Sestet Gate | `sestet_prelate` + `sestet_siller` + `sestet_stinger` | Post detonates sum===6 unequal occupy; tile taxes start-of-turn; sting the rest |
| Bounce Sestet | `sestet_bouncer` + `must_sesteter` + `fuse_binder` | Two Sestet bodies, bounce 12+12 onto the wick |
| Sestet Hold File | `sestet_holder` + `must_sesteter` + `leash_warden` | Walk **and** tools need leftover sum === 6 unequal — COURT, never PAIR Sestet Hold + Must Sestet on the same body without a third peeler |
| Lend Hood | `sestet_lender` + `sestet_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 8), or hold (4,2) through a miss |
| Tern Tierce | `cadence_terner` + `cadence_tiercer` + `verse_sesteter` | Compress a 7 to a 3, **then** Tierce the 3 to 0 on a **later** turn — COURT, never PAIR Tern + Tierce on one BASE kit |
| Prime Thin | `prime_plater` + `thin_gaiter` + `plate_warden` | Camp 1/1 miss, then poke leftover 1/0 after they spend the MP |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood), Wave 16 packs (Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen), Wave 17 packs (Score Choir, Hendeca Plug, File Hexa, Lava File, Strike Dry, Shock Even, Lean Rise, Still Brace, Watch Odd, Spike Kennel, Duel Score, Snuff Verse, Score Quiet, Purse Score, Score Gate, Bounce Score, Score Hold File, Lend Hood), and Wave 18 packs (Stave Choir, Dodeca Plug, Ring Hepta, Rime Rank, Last Dual, Rift Fresh, Prime Cap, Gait Brick, Watch Even, Rime Kennel, Hymn Stave, Dock Verse, Stave Quiet, Purse Stave, Stave Gate, Bounce Stave, Stave Hold File, Lend Hood, Cap Dock, Dual Fresh).

Do **not** pack as PAIR (COURT later is fine):

- `sestet_mender` + `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `trideca_prelate` + `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `sestet_hooder` + `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` / `prime_plater` as PAIR
- `sestet_stinger` + `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `capped_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` / `thin_gaiter` as PAIR
- `sestet_stepper` + `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire`
- `sestet_siller` + `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` / `summon_marker`
- `sestet_holder` + `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_sesteter` as PAIR / `must_staver` as PAIR
- `sestet_lender` + `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `sestet_sipper` + `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `sestet_prelate` + `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate`
- `sestet_bouncer` + `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_sesteter` + `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `sestet_holder` as PAIR
- `verse_sesteter` + `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as PAIR
- `tern_warder` + `ring_warder` / `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR
- `octa_oather` + `hepta_oather` / `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `oct_prelate` / `sept_prelate`
- `mire_reeler` + `lava_reeler` / `rime_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `mire_skipper` as PAIR / `rime_mason` as PAIR / `lava_cutter` as PAIR
- `diag_biter` + `file_biter` / `rank_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `diag_warder` as PAIR / `diag_locksmith` as PAIR
- `summon_marker` + `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `last_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `sestet_siller` / `gait_wicker` / `fuse_binder`
- `prime_plater` + `dual_plater` / `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `sestet_hooder` as PAIR / `stave_hooder` as PAIR / `score_hooder` as PAIR / `prime_gifter` as PAIR
- `slide_skipper` + `rift_skipper` / `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `slide_mason` as PAIR
- `capped_stinger` + `fresh_stinger` / `full_stinger` / `even_stinger` / `odd_stinger` / `gaunt_stinger` / `sestet_stinger` / `stave_stinger` / `tied_gaiter` / `pair_purser` as PAIR
- `summon_orther` + `summon_filer` as PAIR / `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `strike_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `gait_gifter` + `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor`
- `cadence_terner` + `cadence_tiercer` as PAIR / `cadence_capper` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` / `cap_warder`
- `cadence_tiercer` + `cadence_terner` as PAIR / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`
- `odd_toller` + `gait_toller` / `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_taxer` + `brick_holder` / `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `sestet_holder` as PAIR / `screen_biter` as PAIR
- `watch_taxer` + `watch_drainer` / `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `thin_gaiter` + `even_gaiter` / `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `even_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as PAIR / `thin_warder` as PAIR / `prime_plater` as PAIR
- `lava_cutter` + `rime_cutter` / `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `mire_reeler` as PAIR / `lava_reeler` as PAIR / `lava_skipper` as PAIR / `null_censor` as PAIR
- `strike_plater` + `cast_plater` as PAIR / `summon_plater` as PAIR / `summon_orther` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR / `dual_plater` as PAIR
- `psalm_turner` + `hymn_turner` as PAIR / `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR

Do **not** spawn Trideca Plug on a map with no free 13-cell plus (solvability). Do not spawn Mire Diag / Lava Kennel / Slide Cap on a map with no painted mire occupancy / no lava occupancy / no conveyor occupancy in Chebyshev 6 of a legal floor. Do not spawn Spawn Prime without a legal summoner in the pack (`brood_chanter` / `spark_chanter` / player-summon kits). Do not spawn Lava Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Watch Thin without an overwatch band (`glass_sniper` / Hold Ground / Far Watch). Twin Gate pads do **not** count as lava, ice, spikes, painted mire, conveyor, Void Rift, or `map.portals`.

---

## 4. Family sheets — Wave 19

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-26.md`](https://github.com/Mr-Melic/stralt/pull/1132) (PR #1132) unless marked SDE Wave 17 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-12eb/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md), PR #1082).

---

### ENEMY_ID: `sestet_mender`

- **NAME:** Sestet Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Sestet Mend (`spell-sestet-mend`, #1132). Extra door `sestet_cantor` — family is **not** that id. Distinct from `stave_mender` (both leftover **sum === 5**), `score_mender` (both leftover **sum === 4 AND unequal**), `tally_mender` (both leftover **sum === 3**), `gait_gifter` (this pass, one-body leftover **AP≥2 AND MP=0**), `prime_gifter` (leftover **exactly 1/1**), `equal_gifter` (target-only tied ≥ 1), `lean_gifter` (leftover **AP=0 and MP≥1**), `gaunt_mender` (both leftover **0**). At most one six-read heal CORE per pack as PAIR vs Stave / Score / Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove / Prime / Gait.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 6 or either pair is a tie. Peer: Sestet Mend only if both leftover sums === 6 **and** both unequal **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise / Dual Plate / Score-blocked — Frost / Shield) or if either body sits (3,3) (Poise). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 6 without tying**. If it tops the meter, the kit leaked toward Frost. Dual Keep **cannot** fake this.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_6_unequal"`. VETERAN: skip if either sum ≠ 6 or either pair is a tie. ELITE: prefer self-cast when the caster already sits on (4,2) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-sestet-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Lean Gift / Gaunt Mend / Hollow Gift / Prime Gift / Gait Gift.
- **SIGNATURE_MECHANICS:** Four leftover reads + two equality bans. Legal pairs (6,0) (0,6) (5,1) (1,5) (4,2) (2,4). Dual Keep 2/2 is **Poise / Dual Plate**, not Sestet. Dual Keep **cannot** sit on sum 6. Score Lend (3,1)→(4,2) **manufactures** Sestet. A 6 AP / 3 MP bar that pays this 3 AP lands at (3,3) and **fails**. `healAmount` stays 0 on the Sestet Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum-or-tie → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Psalm Turn / Score Lend is already in the pack (COURT, not PAIR with Stave / Score / Tally / Poise / Prime / Gait).
- **SYNERGIES:** `psalm_turner`, `verse_sesteter`, `sestet_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 6; dump to 3/3 (Poise); dump to 3/2 (Stave); dump to 3/1 (Score); dump to 3/0 (Tally); dump to 1/1 (Prime Gift); dump to 0/0 (Gaunt); Dual Keep; Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (4,2) → (3,2) **Stave**; sit Dual Keep; sit 3/3; kill the cantor first; do not hold 6 leftover unequal in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-mend` (MULTI: family observe **or** `sestet_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + equality ban + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_tiercer`

- **NAME:** Cadence Tiercer
- **ROLE:** controller (remaining CDs `n===3` → `0`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Tierce (`spell-cadence-tierce`, #1132). Extra door `tierce_precentor` — family is **not** that id. Distinct from `cadence_docker` (`n===2` → **0**), `cadence_snuffer` (`n==1` → **0**), `cadence_terner` (this pass, `n>3` → **3** — **threes stay 3**), `cadence_capper` (`n>2` → **2**), `cadence_primer` (`n===0` → `1`), Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0). At most one remaining-3 rewrite CORE per pack as PAIR vs Tern / Dock / Snuff / Cap / Riser / Primer / Thief / Lagger / Staller / Cracker / Flusher.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≠ 3. Peer: Tierce only if a nuke remaining is 3. Above: refuse if the only remaining-3 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **handing the remaining-3 bar back for this tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tierce_remaining_cds_eq_3_to_0"`. VETERAN: skip all-non-3. ELITE: prefer Inferno remaining 3 over Strike-only. CHAMPION: never Tierce a bar you will Tern the same turn (Tern is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-tierce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the tierced id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Tern / Cadence Dock / Cadence Snuff / Cadence Cap / Cadence Floor / Cadence Crack
- **SIGNATURE_MECHANICS:** Remaining `3` → `0`. Zeros stay 0. `n===1` unchanged (Snuff). `n===2` unchanged (Dock). `n>3` unchanged (Tern / Cap / Floor). Target keeps every spell. Inverse of leaving a 3 after Tern, not Floor.
- **VARIANT_PROGRESSION:** BASE ready-unlock → VETERAN skip-non-3 → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits sitting on remaining 3 (Inferno). Never CHAMPION in a solo pack with Tern.
- **SYNERGIES:** `verse_sesteter`, `tax_scribe`, `cadence_terner` (COURT, not PAIR), `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast the remaining-3 id **before** Tierce; Tern your remaining 7 to 3 then recast before they Tierce; Cap your remaining 5 to 2 (Dock’s problem); Cadence Break your own remaining after
- **PLAYER_COUNTERPLAY:** Spend the remaining-3 Inferno **now**; sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 4+ (Tern / Cap / Floor’s problem)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-tierce` (MULTI: family observe **or** `tierce_precentor` first-win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 0 when n===3)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `trideca_prelate`

- **NAME:** Trideca Prelate
- **ROLE:** summoner (thirteen-cell occupy, orthogonal plus arm 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate`. Extra door is `span_trideca` — family is **not** that id. At most one Trideca Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 13.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 13 (Frost / Strike). Peer: plant only if all 13 cells are free and the plus splits the player from an exit. Above: refuse if the only plus covers the last portal file (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.10, init 0.85, chc 0.60. Identity is **thirteen cells of deny along a plus**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `tridecaspan` (#1132): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **thirteen** cells of an orthogonal plus arm 3 as one combatant id; **every cell occupied**. VETERAN: skip if remaining cap < 13. ELITE: Sestet Sill a neighbor. CHAMPION: never punch a plus if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-trideca-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` only if a diagonal gap needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / ninespan / decspan / hendecaspan / dodecaspan / driftpost / leanpost / gauntpost / poisepost / tallypost / scorepost / stavepost / sestetpost on this body.
- **SIGNATURE_MECHANICS:** Click is the **center** of the plus (Hendeca rule, **not** Dec / Dodeca’s nearest-cell-to-caster rule). Occupy center + `(0,±1)(0,±2)(0,±3)` + `(±1,0)(±2,0)(±3,0)`. Shared occupancy: 13. Diagonal walk around the bounding 7×7 is the counter vs Hendeca’s shorter plus and Dodeca’s 3×4 rectangle.
- **VARIANT_PROGRESSION:** BASE corridor plug → VETERAN cap-check → ELITE neighbor tax → CHAMPION solvability refuse
- **RARITY_CURVE:** Standard. +ELITE on corridor maps. Never CHAMPION in a closet.
- **SYNERGIES:** `sestet_siller`, `tern_warder`, `rank_lancer`, `quiet_siller`
- **WEAKNESSES:** Occupy any of the 13 before paint; Coup the one HP pool; walk the diagonals of the 7×7
- **PLAYER_COUNTERPLAY:** Stand on a diagonal of the plus; blink / Swap around the block; kill the body (all thirteen free)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-trideca-span` (MULTI: family observe **or** `span_trideca` first-win)
- **REWARD_EXPECTATION:** Standard. Occupy-weight is the tax, not extra Doka.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (multi-cell occupy + cap weight 13; live cap is 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `psalm_turner`

- **NAME:** Psalm Turner
- **ROLE:** controller (invert leftover AP↔MP on **one same-side non-caster and one opposite-side**; caster unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Psalm Turn (`spell-psalm-turn`, #1132). No extra door. Distinct from `hymn_turner` (two **allies**), `duel_turner` (two **hostiles**), `purse_turner` (one hostile), `bar_crosser` (two-body **cross** through the caster), Tempo Invert (ally/self), Choir Hymn (Wave-1 Discovery **heal**). At most one leftover-invert CORE per pack as PAIR vs Hymn / Duel / Purse / Bar / Dual Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack size < 2 living same-side non-casters **or** no opposite-side body in r3. Peer: invert only if the ally sits (6,0) and the hostile (0,6) **or** (4,2)/(2,4). Above: skip if both leftover pairs are already equal (double no-op) or both 0/0.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **turning one ally purse and one hostile purse with the caster’s bar untouched**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "psalm_turn_if_same_side_non_caster_and_opposite_in_r3_and_at_least_one_unequal"`. VETERAN: skip double-equal / double-empty / missing same-side non-caster. ELITE: prefer Sestet pairs so Sestet Mend / Sestet Sting still fire. CHAMPION: never invert if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-psalm-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if the ally sits fat-AP after invert
- **ELITE_SPELL_POOL:** none — do **not** add Hymn Turn / Duel Turn / Purse Turn / Tempo Invert / Bar Cross / Swap as identity
- **SIGNATURE_MECHANICS:** Not `isSwap`. Caster leftover **unchanged**. Sum invariant on each body. Target is the **hostile**. Nearest same-side non-caster within Chebyshev 3 of the **target**. Player-side summons **count**.
- **VARIANT_PROGRESSION:** BASE mixed-side invert → VETERAN skip-noop → ELITE Sestet-bias → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Sestet / Stave is already in the pack (COURT).
- **SYNERGIES:** `sestet_mender`, `sestet_stinger`, `sestet_sipper`, `stave_stinger` (after sip manufactures Stave)
- **WEAKNESSES:** Isolate (no same-side non-caster); keep leftover AP === leftover MP on both; Strike before they recast
- **PLAYER_COUNTERPLAY:** Fight without a second ally; sit 2/2 on both (double no-op); Quiet Hex after they invert into a 3-AP spell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-psalm-turn` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (nearest same-side non-caster search + two independent leftover inverts; fail closed if caster would invert)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_hooder`

- **NAME:** Sestet Hooder
- **ROLE:** protector (next hit is 0 while leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Sestet Hood (`spell-sestet-hood`, #1132). Distinct from `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `dual_plater` / `prime_plater` / `odd_plater` / `dry_plater` / `spent_plater`. At most one leftover-window miss CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 6 or the pair is a tie. Peer: Hood only while sitting (4,2) / (6,0) / (0,6) / (5,1) / (1,5) / (2,4). Above: refuse if Dual Keep banks 2/2 (Poise Hood / Dual Plate’s window) or if leftover is 3/3 (Poise).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **holding a sum of 6 without tying**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "sestet_hood_if_self_leftover_sum_eq_6_unequal"`. VETERAN: skip wrong window. ELITE: Psalm Turn to **keep** sum 6 unequal. CHAMPION: never lend into a hit you wanted blanked.
- **CORE_SPELL_POOL:** `spell-sestet-hood`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** none — do **not** add Stave Hood / Score Hood / Tally Hood / Poise Hood / Dual Plate / Prime Plate / Spent Plate / Dry Plate
- **SIGNATURE_MECHANICS:** Any range. Charge remains if the hit arrives off-window. Hit at 2/2 lands (Poise Hood / Dual Plate would blank). Hit at 3/2 lands (Stave Hood would blank). Hit at 3/1 lands (Score Hood would blank). Hit at 3/3 lands (Poise Hood). Hit at 1/1 lands (Prime Plate / Poise).
- **VARIANT_PROGRESSION:** BASE window-miss → VETERAN skip-wrong → ELITE keep-sum → CHAMPION no-cash-out
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `psalm_turner`, `sestet_holder`, `cover_squire`
- **WEAKNESSES:** Wait until they spend a pool off 6; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force a 3/2 (Stave); force a 3/3 (Poise); force a 2/2 (Poise / Dual Plate); don’t hit while they sit (4,2)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-hood` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover sum + equality ban at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_stinger`

- **NAME:** Sestet Stinger
- **ROLE:** assassin (10 + 8 iff leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Sestet Sting (`spell-sestet-sting`, #1132). Distinct from `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `capped_stinger` / `fresh_stinger` / `even_stinger`. At most one leftover-window poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 6 or the pair is a tie (10 still lands from CORE, but skip if a Strike kills). Peer: Sting the (4,2) bishop. Above: refuse overkill; 10 still if no window.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.90, res 0.70, init 1.25, chc 1.10. Identity is **punishing six unequal leftover**. If it tops the meter ungated, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "sestet_sting_if_target_leftover_sum_eq_6_unequal"`. VETERAN: skip bonus path off-window. ELITE: Psalm Turn into the window. CHAMPION: never Sting a 10 when Strike would kill.
- **CORE_SPELL_POOL:** `spell-sestet-sting`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-poison`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Stave Sting / Score Sting / Capped Sting / Fresh Sting / Poise Sting
- **SIGNATURE_MECHANICS:** 10 ungated + 8 on (6,0)/(0,6)/(5,1)/(1,5)/(4,2)/(2,4). Dual Keep 2/2 is Poise Sting. (3,3) is Poise Sting. (3,2) is Stave Sting.
- **VARIANT_PROGRESSION:** BASE window-poke → VETERAN skip-bonus-off-window → ELITE invert-in → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs leftover-fat casters.
- **SYNERGIES:** `psalm_turner`, `sestet_holder`, `sestet_sipper` (COURT — sip exits to Stave)
- **WEAKNESSES:** Sit 3/3; sit 3/2; sit Dual Keep; Iron Skin
- **PLAYER_COUNTERPLAY:** Dump to 3/3 or 3/2 before the poke; Dual Keep overnight
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-sting` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one leftover-sum-and-unequal gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_stepper`

- **NAME:** Sestet Stepper
- **ROLE:** teleporter (relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Sestet Step (`spell-sestet-step`, #1132). Distinct from `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `home_stepper` / `heave_stepper`. Relocate, not `isSwap`. At most one leftover-window join CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no in-window ally with a free neighbor. Peer: join the (0,6) wisp. Above: skip if joining would land on a fuse / sill you do not own.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.00, res 0.80, init 1.20, chc 0.80. Identity is **blink to a six-unequal-bar ally**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sestet_step_if_ally_leftover_sum_eq_6_unequal_and_a_neighbor_is_free"`. VETERAN: skip missing window / missing neighbor. ELITE: Sestet Sill the dest neighbor. CHAMPION: never land on the last portal file.
- **CORE_SPELL_POOL:** `spell-sestet-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-mark` on the dest
- **ELITE_SPELL_POOL:** none — do **not** add Stave Step / Score Step / Home Step / Swap
- **SIGNATURE_MECHANICS:** Self-target forbidden. Ally leftover 3/3 fizzles (Poise Step). Ally leftover 3/2 fizzles (Stave Step). Dual Keep cannot open this.
- **VARIANT_PROGRESSION:** BASE window-join → VETERAN skip-missing → ELITE neighbor tax → CHAMPION solvability
- **RARITY_CURVE:** Standard. +ELITE when Sestet Sill is already in the pack (COURT).
- **SYNERGIES:** `sestet_mender`, `sestet_siller`, `cover_squire`
- **WEAKNESSES:** Spend the wisp’s pool; occupy every neighbor; Coup
- **PLAYER_COUNTERPLAY:** Sit the ally on 3/3; body-block neighbors; Swap the stepper onto a fuse
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-step` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum-and-unequal gate + existing relocate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_siller`

- **NAME:** Sestet Siller
- **ROLE:** hazard creator (start-of-their-turn occupy tax iff leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Sestet Sill (`spell-sestet-sill`, #1132). Distinct from `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `wake_marker` / `summon_marker`. At most one leftover-window start-turn tile CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they will not start the next turn on 6 unequal. Peer: paint the camp tile. Above: skip if they can walk off overnight and no Hold is in the pack.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 1.00, res 1.00, init 0.95, chc 0.70. Identity is **dawn tax on six unequal**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sestet_sill_if_foe_will_start_turn_sum_eq_6_unequal_on_tile"`. VETERAN: skip if they will leave 6 overnight. ELITE: Sestet Hold so they cannot walk off. CHAMPION: never paint a portal (`isCellFree`).
- **CORE_SPELL_POOL:** `spell-sestet-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Stave Sill / Score Sill / Wake Mark / Summon Mark
- **SIGNATURE_MECHANICS:** Walk-enter does **not** tax. End-turn occupy does **not** tax (that is Sestet Post). Relocate landing does **not** tax. Occupant leftover 3/3 at dawn → no tax (Poise Sill). Dual Keep overnight **cannot** leave them on 6.
- **VARIANT_PROGRESSION:** BASE dawn-tax → VETERAN skip-leave → ELITE lock-walk → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE with Sestet Hold (COURT, not PAIR with Must Sestet on the same body).
- **SYNERGIES:** `sestet_holder`, `sestet_prelate`, `psalm_turner`
- **WEAKNESSES:** Walk off; spend a pool; blink; dump to 3/3
- **PLAYER_COUNTERPLAY:** Leave the tile before turn start; Dual Keep overnight; dump to Stave / Poise
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-sill` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + start-turn leftover-sum-and-unequal gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_holder`

- **NAME:** Sestet Holder
- **ROLE:** controller (cannot walk while leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Sestet Hold (`spell-sestet-hold`, #1132). Distinct from `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `brick_holder`. **Do not PAIR with `must_sesteter`.** At most one leftover-window walk lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 6 or the pair is a tie. Peer: Hold the (0,6) walker. Above: skip if they already sit 3/3 and wanted Poise Hold.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.80, sr 1.10, res 1.15, init 0.90, chc 0.60. Identity is **cannot spend leftover MP to walk while sitting on six unequal**. If it tops the meter, the kit leaked toward Root.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "sestet_hold_if_target_leftover_sum_eq_6_unequal_and_wants_to_walk"`. VETERAN: skip off-window. ELITE: Psalm Turn (0,6)→(6,0) so they lose walk MP into leftover AP. CHAMPION: never Hold a body you will Must Sestet the same turn (COURT later).
- **CORE_SPELL_POOL:** `spell-sestet-hold`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Must Sestet / Stave Hold / Brick Hold / Score Hold
- **SIGNATURE_MECHANICS:** Teleport / Swap / Phase Slip / Twin-gate / Sestet Step (caster relocate) stay legal. Leftover (3,3) does **not** block (Poise Hold). Leftover (3,2) does **not** block (Stave Hold). Dual Keep 2/2 is Poise Hold, not this.
- **VARIANT_PROGRESSION:** BASE walk-lock → VETERAN skip-off-window → ELITE invert-AP → CHAMPION no-Must-same-turn
- **RARITY_CURVE:** Standard. +ELITE vs kite kits. Never CHAMPION in a solo pack with Must Sestet.
- **SYNERGIES:** `must_sesteter` (COURT, not PAIR), `psalm_turner`, `sestet_siller`
- **WEAKNESSES:** Cast leftover AP to leave 6 unequal; dump to 3/3; blink; wait 2 turns
- **PLAYER_COUNTERPLAY:** Spend leftover AP; sit 3/3; Swap off
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-hold` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (leftover-sum-and-unequal gate in the walk spender)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_lender`

- **NAME:** Sestet Lender
- **ROLE:** buffer (+1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP === 6 AND unequal — **exits** to 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal as CORE. CORE is Sestet Lend (`spell-sestet-lend`, #1132). Distinct from `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `tempo_precentor`. At most one leftover-window cash-out CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 6 or the pair is a tie. Peer: cash the (4,2) wisp. Above: skip if exiting the window would deny a Sestet Mend you wanted (CHAMPION honesty).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.85, init 1.15, chc 0.75. Identity is **cashing six unequal for eight**. If it tops the meter, the kit leaked toward Haste.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sestet_lend_if_ally_leftover_sum_eq_6_unequal"`. VETERAN: skip off-window. ELITE: Score Lend **into** Sestet on a **different** body first (COURT). CHAMPION: never cash out a Hood you wanted blanked.
- **CORE_SPELL_POOL:** `spell-sestet-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if both grants would cap
- **ELITE_SPELL_POOL:** none — do **not** add Score Lend / Stave Lend / Haste as identity
- **SIGNATURE_MECHANICS:** (4,2)→(5,3), (5,1)→(6,2), (6,0)→(7,1). Inequality preserved — **cannot** manufacture Poise. Score Lend **manufactures Sestet**. Both grants must land or fail closed.
- **VARIANT_PROGRESSION:** BASE cash-out → VETERAN skip-off-window → ELITE Score-in → CHAMPION no-cash-Hood
- **RARITY_CURVE:** Standard. +ELITE with Score Lend already in the pack (COURT, not PAIR).
- **SYNERGIES:** `sestet_mender` (before cash-out), `sestet_hooder` (COURT), `tempo_precentor`
- **WEAKNESSES:** Sit off sum 6 unequal; sit on 3/3 (Poise Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend)
- **PLAYER_COUNTERPLAY:** Leave 6 before they cash; Dual Keep so they cannot enter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-lend` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_sipper`

- **NAME:** Sestet Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover AP + leftover MP === 6 AND unequal and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Sestet Sip (`spell-sestet-sip`, #1132). Distinct from `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper`. At most one leftover-window AP-steal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP is 0 (the (0,6) pair) or sum ≠ 6 or the pair is a tie. Peer: sip (4,2) → (3,2) **Stave**. Above: skip if the steal would deny a Sestet Sting you wanted (CHAMPION honesty — COURT with Stave Sting instead).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 0.90, res 0.70, init 1.20, chc 0.90. Identity is **sip six unequal into Stave**. If it tops the meter, the kit leaked toward Drain Courage.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "sestet_sip_if_target_sum_eq_6_unequal_and_leftover_ap_ge_1"`. VETERAN: skip (0,6) / off-window. ELITE: Stave Sting after (COURT). CHAMPION: never sip a Hood you wanted blanked.
- **CORE_SPELL_POOL:** `spell-sestet-sip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-drain-courage` only if leftover AP is already 1
- **ELITE_SPELL_POOL:** none — do **not** add Stave Sip / Score Sip / Bare Sip as identity
- **SIGNATURE_MECHANICS:** **Sip always manufactures Stave when it lands.** (4,2)→(3,2), (5,1)→(4,1), (6,0)→(5,0), (2,4)→(1,4), (1,5)→(0,5). (0,6) fizzles. Dual Keep 2/2 is Poise Sip. (3,3) is Poise Sip.
- **VARIANT_PROGRESSION:** BASE window-steal → VETERAN skip-no-AP → ELITE Stave-follow → CHAMPION no-sip-Hood
- **RARITY_CURVE:** Standard. +ELITE when Stave Sting is already in the pack (COURT, not PAIR with Stave Sip).
- **SYNERGIES:** `stave_stinger`, `stave_mender`, `sestet_holder`
- **WEAKNESSES:** Sit on (0,6); sit off sum 6 unequal; sit on 3/3; Second Wind
- **PLAYER_COUNTERPLAY:** Hold leftover AP 0; dump to 3/3 before they sip
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-sip` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_prelate`

- **NAME:** Sestet Prelate
- **ROLE:** summoner (empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Sestet Post (`spell-sestet-post`, #1132). Distinct from `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `dummy_prelate` / `trideca_prelate`. Counts as **1**. `summonAI: "sestetpost"`. At most one leftover-window end-turn post CORE per pack as PAIR vs those. Legal at remaining cap ≥ 1.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if cap is full (Frost). Peer: plant where they will end on (4,2). Above: skip if they can spend a pool before turn end and no Hold is in the pack.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 0.90, res 1.00, init 0.90, chc 0.65. Identity is **end-turn occupy on six unequal**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `sestetpost`: `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **one** cell. VETERAN: skip if they will leave 6 before end-turn. ELITE: Sestet Hold so they cannot walk off. CHAMPION: never plant on a portal.
- **CORE_SPELL_POOL:** `spell-sestet-post`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / dummy / stavepost / scorepost / tallypost / poisepost / gauntpost / tridecaspan / dodecaspan on this body.
- **SIGNATURE_MECHANICS:** **Summon is observation.** Later detonate is not a second observe. Walk-enter does **not** detonate. Relocate landing does **not** detonate. Start-of-turn does **not** detonate (Sestet Sill). Occupant leftover 3/3 at turn end → no detonate (Poise Post). Dual Keep 2/2 **hurts Poise Post, not this**.
- **VARIANT_PROGRESSION:** BASE end-turn mine → VETERAN skip-leave → ELITE lock-walk → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE with Sestet Hold (COURT). Never CHAMPION in a pack that already filled the stationary-post cap.
- **SYNERGIES:** `sestet_siller`, `sestet_stinger`, `sestet_holder`
- **WEAKNESSES:** Spend a pool before turn end; dump to 3/3; walk off; Coup the post
- **PLAYER_COUNTERPLAY:** Leave before end-turn; dump to Stave / Poise; kill the body
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-post` (ENEMY_DISCOVERY, piece observe — **arm**, not detonate)
- **REWARD_EXPECTATION:** Standard. Occupy-weight 1 is the tax, not extra Doka.
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (empty-kit summon + end-turn leftover-sum-and-unequal gate; `summonAI: "sestetpost"` not in live `inferSummonArchetype`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sestet_bouncer`

- **NAME:** Sestet Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest other leftover-AP+MP===6-unequal hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Sestet Bounce (`spell-sestet-bounce`, #1132). Distinct from `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `storm_caller`. At most one leftover-window bounce CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second in-window body **and** a Strike would kill the primary. Peer: open on whoever, splash the (4,2) bishop. Above: skip if isolation makes this Chain Lightning with extra steps.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.75, init 1.10, chc 0.90. Identity is **two Sestet bodies, 24**. If it tops the meter on one body, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sestet_bounce_if_second_sum_eq_6_unequal_hostile_in_r4"`. VETERAN: 12 still lands without a second. ELITE: Psalm Turn a second body in. CHAMPION: never bounce an ally.
- **CORE_SPELL_POOL:** `spell-sestet-bounce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-blast` (ungated nearest-any, never as CORE), `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` only if both bodies already sit in-window
- **ELITE_SPELL_POOL:** none — do **not** add Stave Bounce / Score Bounce / Chain Lightning as identity
- **SIGNATURE_MECHANICS:** Primary leftover unconstrained. Missing bounce keys → 12 only. Second body leftover 3/3 is **not** a bounce target (Poise Bounce). Dual Keep 2/2 is the **wrong** second body.
- **VARIANT_PROGRESSION:** BASE splash-if-second → VETERAN 12-anyway → ELITE invert-second → CHAMPION no-ally
- **RARITY_CURVE:** Standard. +ELITE vs double leftover-fat casters.
- **SYNERGIES:** `psalm_turner`, `must_sesteter`, `fuse_binder`
- **WEAKNESSES:** Isolate (one Sestet body); sit the second on 3/3 or 3/2
- **PLAYER_COUNTERPLAY:** Keep the second body off 6 unequal; spread past Chebyshev 4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sestet-bounce` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one search + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_sesteter`

- **NAME:** Must Sesteter
- **ROLE:** controller (non-Strike illegal unless leftover AP + leftover MP === 6 AND unequal **and** the spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Must Sestet (`spell-must-sestet`, #1132). Distinct from `must_staver` / `must_scorer` / `must_tallier` / `must_poiser`. **Do not PAIR with `sestet_holder`.** At most one leftover-window last-packet CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 6 or the pair is a tie. Peer: lock the (0,6) caster (leftover AP 0 → every non-Strike blocked). Above: skip if the only remaining legal verb is Strike and a walk would kill.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.85, sr 1.05, res 1.10, init 0.95, chc 0.65. Identity is **last-packet from six unequal**. If it tops the meter, the kit leaked toward Mute Thread.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "must_sestet_if_target_leftover_sum_eq_6_unequal_and_has_a_last_packet_spell"`. VETERAN: skip off-window. ELITE: Sestet Hold on (0,6) so they can neither walk nor non-Strike (COURT, not PAIR on one BASE kit). CHAMPION: never Must a body you will Hold the same turn as the only two verbs.
- **CORE_SPELL_POOL:** `spell-must-sestet`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Must Stave / Must Score / Sestet Hold as identity
- **SIGNATURE_MECHANICS:** **Pre-spend leftover.** Strike stays legal. Walk stays legal unless a Sestet Hold is also up. (6,0) spending a 6-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. (3,3) is Must Poise.
- **VARIANT_PROGRESSION:** BASE last-packet lock → VETERAN skip-off-window → ELITE Hold-COURT → CHAMPION no-double-lock-solo
- **RARITY_CURVE:** Standard. +ELITE vs tool kits. Never CHAMPION in a solo pack with Sestet Hold.
- **SYNERGIES:** `sestet_holder` (COURT, not PAIR), `psalm_turner`, `leash_warden`
- **WEAKNESSES:** Strike; blink; wait 2 turns; dump to 3/3
- **PLAYER_COUNTERPLAY:** Strike through; sit 3/3; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-sestet` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pre-spend leftover sum + last-AP compare in the cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_sesteter`

- **NAME:** Verse Sesteter
- **ROLE:** debuffer (last resolved id illegal until leftover AP + leftover MP === 6 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Verse Sestet (`spell-verse-sestet`, #1132). Distinct from `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `last_muter`. At most one leftover-window last-id lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last resolved id, or if they already sit on sum 6 unequal (instant lift — fizzle rider). Peer: lock Inferno until they sit (4,2). Above: skip if their win condition is Strike (Strike is not a spell id for this key).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **which leftover window lifts the last verse**. If it tops the meter, the kit leaked toward Hex of Silence.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_sestet_if_target_last_id_is_their_win_condition"`. VETERAN: skip no-last-id / already-in-window. ELITE: Cadence Tierce so the locked id is also remaining 0. CHAMPION: never lock a last id that is already remaining 0 **and** they sit in-window (double no-op).
- **CORE_SPELL_POOL:** `spell-verse-sestet`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-quiet-hex` only as G≥1 extra, never CORE
- **ELITE_SPELL_POOL:** none — do **not** add Verse Stave / Verse Score / Last Mute / Hex of Silence as identity
- **SIGNATURE_MECHANICS:** Fail closed until `lastResolvedSpellId` exists. Does **not** lift at leftover 0/0 (Verse Gaunt), 2/2 or 3/3 (Verse Poise), 3/0 (Verse Tally), 3/1 (Verse Score), 3/2 (Verse Stave), or 1/1 (Prime Gift). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this. Haste into (4,2) **does**.
- **VARIANT_PROGRESSION:** BASE last-id lock → VETERAN skip-noop → ELITE Tierce-follow → CHAMPION no-double-noop
- **RARITY_CURVE:** Standard. +ELITE vs Inferno kits.
- **SYNERGIES:** `cadence_tiercer`, `sestet_holder`, `tax_scribe`
- **WEAKNESSES:** Sit on (6,0)/(0,6)/(5,1)/(1,5)/(4,2)/(2,4); recast a different id; wait
- **PLAYER_COUNTERPLAY:** Bank six unequal; recast Frost instead of Inferno
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-sestet` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (last-id lock + leftover-sum-and-unequal lift; fail closed until `lastResolvedSpellId`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tern_warder`

- **NAME:** Tern Warder
- **ROLE:** controller (next walk legal only if Chebyshev **exactly 3**, **orthogonal only**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Tern Stride (`spell-tern-stride`, #1082). Extra room `tern_gallery` — family is **not** that id. Distinct from `ring_warder` (Chebyshev **exactly 2**, knight excluded — includes `(2,2)`), `orth_warder` (**any** orthogonal length), `file_warder` (same **x**), Knight Stride (**only** `(2,1)`), Inch Stride (Chebyshev **≤ 1**). Do **not** name it `ring_warder`. At most one next-walk-tern CORE per pack as PAIR vs Ring / File / Rank / Orth / Diag / Inch Warder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they must walk Chebyshev 1 or 2 to threaten. Peer: arm only if a Chebyshev-3 orthogonal approach already exists. Above: skip if they must diagonal-step, knight-step, or step-1 and Strike is better. **Do not** assign to chargers who only walk adjacent.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 1.00, res 1.00, init 1.10, chc 0.80. Identity is **one-walk Chebyshev-3 orthogonal lock, not a ring and not a knight hop**. If it tops the meter, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_chebyshev_3_orthogonal"`. VETERAN: skip if they must walk 1, 2, diagonal, or knight-hop. ELITE: Diag Bite on a different body after they are stuck off the file (COURT, not PAIR). CHAMPION: never become Ring Stride or Knight Stride on a failed confirm — fail closed (MP not spent).
- **CORE_SPELL_POOL:** `spell-tern-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-mark` on the only Chebyshev-3 orthogonal approach
- **ELITE_SPELL_POOL:** none — do **not** add Ring Stride / File Stride / Rank Stride / Knight Stride / Pack Ring
- **SIGNATURE_MECHANICS:** Dest Chebyshev == 3 AND (`dx===0` XOR `dy===0`). `(3,0)` / `(0,3)` legal. `(2,1)` illegal (knight). `(2,2)` illegal (diagonal 2 — Ring Stride’s window). Forced movement / swap / blink / Twin-gate still legal. Does **not** read `currentView`. Fail closed until a next-walk dest writer exists.
- **VARIANT_PROGRESSION:** BASE tern lock → VETERAN skip-need-step-1 → ELITE combo-bite → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE on long-file maps. Never CHAMPION in a 1-tile closet.
- **SYNERGIES:** `octa_oather`, `trideca_prelate`, `diag_biter` (COURT, not PAIR), `glass_sniper`
- **WEAKNESSES:** Stand Chebyshev 1 or 2; occupy every Chebyshev-3 orthogonal cell; Root before they arm
- **PLAYER_COUNTERPLAY:** Step to Chebyshev 1; body-block the file/rank 3; Swap them off the armed origin
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tern-stride` (ENEMY_DISCOVERY: family observe **or** `tern_gallery` teach — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next-walk dest writer; fail closed until it exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octa_oather`

- **NAME:** Octa Oather
- **ROLE:** controller (next spell illegal unless Chebyshev = 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Octa Oath (`spell-octa-oath`, #1082). Extra room `octa_nave` — family is **not** that id. Distinct from `hepta_oather` (exact **7**), `hexa_oather` (exact **6**), `long_oather` (**≥ 3**), `oct_prelate` (occupy-weight 8). Do **not** name it `octa_nave` or `oct_prelate`. Do **not** mint `spell-octa-span`. At most one exact-Chebyshev oath CORE per pack as PAIR vs Hepta / Hexa / Penta / Quad / Tri / Mid / Long Oather.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they cannot reach 8 this turn. Peer: arm only if a legal 8 already exists (Far Sting / Frost). Above: skip if they sit at 7 or 9 and would fizzle.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, init 1.15, chc 0.80, res 0.70. Identity is **exact-8 prison**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_8"`. VETERAN: skip if they cannot reach 8. ELITE: Far Sting as the gated poke (ADVANCED). CHAMPION: never restamp `span_oct`.
- **CORE_SPELL_POOL:** `spell-octa-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-far-sting` if already in the catalog for this chassis, else `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the Chebyshev-8 cell
- **ELITE_SPELL_POOL:** none — do **not** add Hepta Oath / Hexa Oath / Oct Span / Far Hood
- **SIGNATURE_MECHANICS:** `physical_attack` stays legal at any range. If they arm then walk to 7, the spell fizzles on confirm (AP not spent for the fizzled spell; Octa Oath already observed). Exact-8 + Far Sting is a sniper prison — 2 AP / CD 3 / Strike exempt on the oath itself.
- **VARIANT_PROGRESSION:** BASE exact-8 → VETERAN skip-unreachable → ELITE gated-poke → CHAMPION no-occupy-clone
- **RARITY_CURVE:** Standard. +ELITE on long-file maps. Never CHAMPION in a 4-tile room.
- **SYNERGIES:** `tern_warder`, `glass_sniper`, `far_stinger` (COURT)
- **WEAKNESSES:** Close to 7 or 9; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Walk to 7; occupy the 8; Swap them off the line
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octa-oath` (ENEMY_DISCOVERY: family observe **or** `octa_nave` teach)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`nextSpellExactChebyshev: 8`; reuse Hepta/Hexa/Penta/Quad key)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `mire_reeler`

- **NAME:** Mire Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest **painted mire occupancy**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Mire Reel (`spell-mire-reel`, #1082). Extra room `bog_aisle` — family is **not** that id. Distinct from `lava_reeler` (toward **lava occupancy**), `rime_reeler` (toward **ice occupancy**), `spike_reeler` (toward **spike occupancy**), `mire_skipper` (ignore mire **enter-tax**), Mire Sheet (**paints** the cell), Hook Line (toward **caster**). Do **not** name it `bog_aisle` or `lava_reeler`. At most one mire-pull CORE per pack as PAIR vs Lava / Rime / Spike / Pit / Brick / Void / Cinder / Paint / Foe / Ally Reelers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no painted mire in radius. Peer: pull 1 toward the nearest painted mire. Above: skip if the dest would be a world portal (`isCellFree` / dest is **toward**, not onto, `map.portals`).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **the painted mire is the attractor**. If it tops the meter, the kit leaked toward Hook.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "attract_toward_nearest_mire"`. VETERAN: skip empty / no painted mire. ELITE: Diag Bite after they share a diagonal with the mire (COURT). CHAMPION: never dest onto `map.portals`.
- **CORE_SPELL_POOL:** `spell-mire-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-mire-sheet` if already in the catalog, else `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Lava Reel / Rime Reel / Hook Line / Pack Ring
- **SIGNATURE_MECHANICS:** Twelfth `applyAttract` dest flavor. Painted mire cells are spell occupancy, not `HazardTileType`. Twin Gate pads are **not** painted mire. Empty board fizzles (AP spent, observe).
- **VARIANT_PROGRESSION:** BASE mire-pull → VETERAN skip-empty → ELITE combo-bite → CHAMPION no-portal-dest
- **RARITY_CURVE:** Standard. +ELITE on maps that already have painted mire. Never CHAMPION on a dry board.
- **SYNERGIES:** `diag_biter`, `glyph_sower`, `sink_chanter` (COURT, not PAIR)
- **WEAKNESSES:** No painted mire; stand on the mire (already adjacent — no move); Root
- **PLAYER_COUNTERPLAY:** Wipe the paint; stand adjacent to the mire; Barrier between you and the pull
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mire-reel` (ENEMY_DISCOVERY: family observe **or** `bog_aisle` teach — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (`applyAttract` toward nearest painted-mire occupancy; fail closed until a caller exists; dest never `map.portals`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `diag_biter`

- **NAME:** Diag Biter
- **ROLE:** bruiser (10 + 10 if share a **diagonal** `\|dx\|==\|dy\|`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Diag Bite (`spell-diag-bite`, #1082). Distinct from `file_biter` (share **file only**), `rank_biter` (share **rank only**), `axis_biter` (share rank **or** file), File Lance (linear poke). Do **not** name it `diag_warder` or `diag_locksmith`. At most one share-geometry bite CORE per pack as PAIR vs File / Rank / Axis / Screen Biters.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the target is on-rank or on-file and Strike / Rank Bite / File Bite is better. Peer: Bite the diagonal. Above: skip if they sit on-file and a File Bite from another body would teach the wrong lesson (COURT later).
- **STAT_SCALING_RULE:** hp 1.00, sp 1.05, sr 0.95, res 0.90, init 1.10, chc 0.95. Identity is **the diagonal is the bonus**. If it tops the meter on-file, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_share_diagonal_with_caster"`. VETERAN: skip on-rank / on-file (10 still lands; prefer Strike if it kills). ELITE: Mire Reel onto the diagonal (COURT). CHAMPION: never become Axis Bite on a failed diagonal.
- **CORE_SPELL_POOL:** `spell-diag-bite`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add File Bite / Rank Bite / Axis Bite / File Lance
- **SIGNATURE_MECHANICS:** Bonus iff `|dx|==|dy|` and both nonzero (true diagonal). File-only → 10 only. Rank-only → 10 only. Does **not** read `currentView`.
- **VARIANT_PROGRESSION:** BASE diagonal-poke → VETERAN skip-orth → ELITE reel-in → CHAMPION no-axis-clone
- **RARITY_CURVE:** Standard. +ELITE on open boards with long diagonals.
- **SYNERGIES:** `mire_reeler`, `glyph_sower`, `tern_warder` (COURT)
- **WEAKNESSES:** Stand on-file or on-rank; Iron Skin; Swap off the diagonal
- **PLAYER_COUNTERPLAY:** Step onto the file; body-block the diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-diag-bite` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`|dx|==|dy|` predicate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_marker`

- **NAME:** Summon Marker
- **ROLE:** anti-summon / hazard creator (cell detonates when a summon is **spawned onto** it)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Summon Mark (`spell-summon-mark`, #1082). Extra room `spawn_pulpit` — family is **not** that id. Distinct from `strike_marker` (**Strike from**), `last_marker` (**last leftover AP**), `cast_marker` (**spell** confirm), `ingress_marker` (**walk enter**), `dwell_marker` (**end-turn occupy**). Do **not** name it `spawn_pulpit` or `last_marker`. At most one spawn-detonate paint CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no living summoner and the player’s bar has no summon id. Peer: paint the cell they will spawn onto. Above: skip if the only summon id is already on cooldown and a Strike would kill the summoner.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 1.00, res 1.00, init 0.95, chc 0.70. Identity is **spawn onto the paint pays**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_summon_spawned_on_cell"`. VETERAN: skip no-summoner. ELITE: Brood Chanter COURT so a spawn is likely. CHAMPION: never paint a portal.
- **CORE_SPELL_POOL:** `spell-summon-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Strike Mark / Last Mark / Cast Mark / Ingress Mark
- **SIGNATURE_MECHANICS:** **Paint is observation.** Summon-spawn detonate is **not** a second observe. Walk-on is free. Spell-from is free. Last leftover AP on the cell is free (Last Mark’s window). Player summons **do** detonate. Enemy summons **do** detonate.
- **VARIANT_PROGRESSION:** BASE spawn-paint → VETERAN skip-no-summoner → ELITE pack-summoner → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE vs summon kits. Never CHAMPION in a pack with no summoner and a player with no summon id.
- **SYNERGIES:** `brood_chanter`, `prime_plater`, `spark_chanter` (COURT)
- **WEAKNESSES:** Spawn off the paint; Coup the painter; Barrier the cell
- **PLAYER_COUNTERPLAY:** Spawn onto a neighbor; wait the paint out; kill the marker first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-mark` (ENEMY_DISCOVERY: family observe **or** `spawn_pulpit` teach — **paint**, not detonate)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + summon-spawn hook; do not double-observe)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `prime_plater`

- **NAME:** Prime Plater
- **ROLE:** protector (next hit is 0 while leftover AP === 1 AND leftover MP === 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Prime Plate (`spell-prime-plate`, #1082). Distinct from `dual_plater` (leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**), `dry_plater` (leftover **MP = 0**), `sestet_hooder` (this pass, leftover **sum === 6 unequal**), `prime_gifter` (leftover **1/1 heal**). Do **not** name it `prime_gifter` or `dual_plater`. At most one leftover-1/1 miss CORE per pack as PAIR vs Dual / Dry / Sestet Hood / Prime Gift.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover is not 1/1. Peer: Plate only while sitting 1/1. Above: refuse if Dual Keep banks 2/2 (Dual Plate / Poise Hood’s window).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **holding leftover 1/1**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_eq_1_and_mp_eq_1"`. VETERAN: skip even≥2/even≥2 (Dual Plate) and leftover MP = 0 (Dry Plate). ELITE: Thin Gait after they spend the MP (COURT, not PAIR). CHAMPION: never become Dual Plate on a failed 1/1.
- **CORE_SPELL_POOL:** `spell-prime-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Dual Plate / Dry Plate / Sestet Hood / Prime Gift as identity
- **SIGNATURE_MECHANICS:** Dual Keep 1/1 **is** this window if it survives. Hit at 2/2 lands (Dual Plate would blank). Hit at 1/0 lands (Thin Gait’s poke window, not a miss). Hit at 0/0 lands (Gaunt). Charge remains if the hit arrives off-window.
- **VARIANT_PROGRESSION:** BASE 1/1-miss → VETERAN skip-wrong-window → ELITE Thin-follow → CHAMPION no-dual-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `thin_gaiter` (COURT, not PAIR), `plate_warden`, `cover_squire`
- **WEAKNESSES:** Wait until they spend a pool; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force a 2/2 (Dual Plate); force a 1/0 (Thin Gait); don’t hit while they sit 1/1
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-prime-plate` (ENEMY_DISCOVERY, piece observe — **arm**, not the negated hit)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover 1/1 at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `slide_skipper`

- **NAME:** Slide Skipper
- **ROLE:** kiter (next **1-tile** walk ignores **conveyor** auto-push)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Slide Skip (`spell-slide-skip`, #1082). Extra room `belt_nave` — family is **not** that id. Distinct from `rift_skipper` (**Void Rift** tax), `shock_skipper` (**shock enter-tax**), `mire_skipper` (**mire enter-tax**), `slide_mason` (**paints** the conveyor). Do **not** name it `slide_mason` or `rift_skipper`. At most one 1-tile hazard-skip CORE per pack as PAIR vs Rift / Shock / Mire / Rime / Glyph / Cinder / Spike / Lava / Pit Skippers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no conveyor occupancy is on the intended 1-tile dest. Peer: skip the push. Above: skip if they wanted length ≥ 2 (pays).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.20, chc 0.85. Identity is **one tile, ignore the belt**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "skip_slide_tile_push_one_tile"`. VETERAN: skip if no conveyor on the dest. ELITE: Capped Sting after they keep max MP (COURT). CHAMPION: never skip lava/spikes — those still tick.
- **CORE_SPELL_POOL:** `spell-slide-skip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-mark` on the conveyor dest
- **ELITE_SPELL_POOL:** none — do **not** add Rift Skip / Shock Skip / Mire Skip / Brier Skip
- **SIGNATURE_MECHANICS:** Slide Tile **is** the conveyor. Length ≥ 2 pays. Lava / spike taxes still tick. Consume is environmental if they then walk onto a conveyor — the skip is the spell, the ignored push is not a second observe. Painted conveyor cells are spell occupancy, not `HazardTileType`.
- **VARIANT_PROGRESSION:** BASE belt-skip → VETERAN skip-no-belt → ELITE cap-poke → CHAMPION no-lava-skip
- **RARITY_CURVE:** Standard. +ELITE on conveyor maps. Never CHAMPION on a dry board.
- **SYNERGIES:** `capped_stinger`, `tide_shade`, `slide_mason` (COURT, not PAIR)
- **WEAKNESSES:** No conveyor; walk length ≥ 2; Root
- **PLAYER_COUNTERPLAY:** Stand off the belt; Root before they skip; occupy the dest
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-slide-skip` (ENEMY_DISCOVERY: family observe **or** `belt_nave` teach — **arm**, not the ignored push)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next 1-tile walk dest + conveyor occupancy flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `capped_stinger`

- **NAME:** Capped Stinger
- **ROLE:** assassin (leftover MP **equals that body’s max MP** → bonus damage)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Capped Sting (`spell-capped-sting`, #1082). Distinct from `fresh_stinger` (leftover AP **equals max AP**), `full_stinger` (leftover AP **≥ 3**, max unread), `even_stinger` (leftover AP **even ≥ 2**), `sestet_stinger` (sum === 6 unequal). Do **not** name it `fresh_stinger` or `cap_warder`. At most one leftover-max poke CORE per pack as PAIR vs Fresh / Full / Even / Sestet Stingers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the target already walked this turn (leftover MP < max) and Fresh Sting / Strike is better. Peer: poke leftover-max-MP. Above: skip if they spent walk MP and a Strike kills.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.90, res 0.70, init 1.25, chc 1.10. Identity is **they may have spent AP and still hold max MP**. If it tops the meter ungated, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_mp_equals_max"`. VETERAN: skip if leftover MP < max. ELITE: Slide Skip so they keep max MP across a belt (COURT). CHAMPION: never become Fresh Sting on leftover AP === max.
- **CORE_SPELL_POOL:** `spell-capped-sting`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-poison`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Fresh Sting / Full Sting / Even Sting / Sestet Sting
- **SIGNATURE_MECHANICS:** They may have spent AP and still hold max MP — Capped Sting still hits. Fresh Sting would miss that. Dry Sting wants leftover MP = 0.
- **VARIANT_PROGRESSION:** BASE max-MP poke → VETERAN skip-walked → ELITE belt-keep → CHAMPION no-fresh-clone
- **RARITY_CURVE:** Standard. +ELITE vs leftover-fat walkers who have not walked yet.
- **SYNERGIES:** `slide_skipper`, `tide_shade`, `gait_gifter` (COURT — Gait Gift wants leftover MP = 0, the **inverse** window)
- **WEAKNESSES:** Walk 1 MP before the poke; Iron Skin
- **PLAYER_COUNTERPLAY:** Spend 1 walk MP; sit leftover MP 0 (Dry / Gait Gift’s window)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-capped-sting` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover MP === max MP predicate; fail closed until leftover MP exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_orther`

- **NAME:** Summon Orther
- **ROLE:** anti-summon (allied summons pay +1 AP to **walk diagonal**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Summon Orth (`spell-summon-orth`, #1082). Distinct from `summon_filer` (walk **off file**), `summon_ranker` (walk **off rank**), `summon_toller` (+1 AP to start **any** walk), Pack Orth (`ENEMY_ONLY` hard lock). Do **not** name it `summon_filer` or `orth_warder`. **Do not PAIR with Summon File / Summon Rank / Summon Toll.** At most one pet-walk-tax CORE per pack as PAIR vs those. Drop this id if `summonAI` is empty.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no allied summon. Peer: tax diagonal pet walks. Above: skip if Pack Orth / Pack Diag already locks the pack.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 0.90, res 1.05, init 0.90, chc 0.65. Identity is **orthogonal pet walks are free of this tax**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "summon_walk_diagonal_ap_tax"`. VETERAN: skip no-pet. ELITE: Strike Plate so the player’s Strike is also 0 (COURT, not PAIR on one BASE kit). CHAMPION: never become Pack Orth.
- **CORE_SPELL_POOL:** `spell-summon-orth`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Summon File / Summon Rank / Summon Toll / Pack Orth / Strike Plate as identity
- **SIGNATURE_MECHANICS:** Orthogonal walks are free of this tax. Diagonal pet walks pay +1 AP. Not `spell.mpCost`. Fail closed if no allied summon.
- **VARIANT_PROGRESSION:** BASE diagonal-tax → VETERAN skip-no-pet → ELITE Strike-COURT → CHAMPION no-pack-lock
- **RARITY_CURVE:** Standard. +ELITE vs player-summon kits. Never CHAMPION in a pack with no pets and a player with no summon id.
- **SYNERGIES:** `lava_cutter`, `strike_plater` (COURT, not PAIR), `brood_chanter` (COURT, not PAIR)
- **WEAKNESSES:** Walk pets orthogonal; kill the orther; no pets
- **PLAYER_COUNTERPLAY:** Walk summons on-file / on-rank; Coup the orther
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-orth` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (allied-summon walk-diagonal AP tax flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_gifter`

- **NAME:** Gait Gifter
- **ROLE:** healer (heal iff leftover AP ≥ 2 AND leftover MP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Gait Gift (`spell-gait-gift`, #1082). **No extra door** — do not invent `gait_cantor_gift` / restamp `gait_cantor`. Distinct from `sestet_mender` (this pass, both leftover **sum === 6 unequal** — (6,0) is Gait Gift **and** a Sestet pair; Sestet still needs **both** bodies), `prime_gifter` (exactly **1/1**), `lean_gifter` (AP=0 and MP≥1), `stave_mender` (both leftover **sum === 5**), Hollow / Gaunt (0/0). **Healer CORE only.** At most one leftover-window heal CORE per pack as PAIR vs Sestet / Stave / Score / Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Prime.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover is 1/1 (Prime Gift) or AP=0/MP≥1 (Lean Gift) or missing HP < 8. Peer: Gait Gift only if leftover AP ≥ 2 **and** leftover MP = 0 **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise — leftover MP is 2, not 0).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **one body leftover AP≥2 / MP=0**. If it tops the meter, the kit leaked toward Frost. Dual Keep 2/0 **can** fake this if it can sit there; Dual Keep 2/2 **cannot**.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_ge_2_and_mp_eq_0"`. VETERAN: skip 1/1 and AP=0/MP≥1. ELITE: prefer self-cast when the caster already dumped walk MP. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-gait-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Mend / Stave Mend / Prime Gift / Lean Gift / Gaunt Mend
- **SIGNATURE_MECHANICS:** One-body. (6,0) is Gait Gift **and** a Sestet pair — Sestet Mend still requires **both** bodies and `sestetForbidEqual`. `healAmount` stays 0 on the Gait Gift row. Player-side HP actually increased → `challengeHealUsedRef`.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-window → ELITE self-dump-MP → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Odd Toll is already in the pack (COURT — leftover AP odd ≥ 1 with MP 0 is this window after they skip the walk).
- **SYNERGIES:** `odd_toller` (COURT), `cadence_terner`, `font_cantor`
- **WEAKNESSES:** Keep 1 walk MP; sit 1/1 (Prime); sit 0/1 (Lean); Dual Keep 2/2; Cursed Wound
- **PLAYER_COUNTERPLAY:** Hold 1 walk MP; sit 1/1; kill the gifter first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-gift` (ELITE, piece observe — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one-body leftover AP≥2 AND MP=0 + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_terner`

- **NAME:** Cadence Terner
- **ROLE:** controller (remaining CDs `n>3` → `3`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Tern (`spell-cadence-tern`, #1082). No extra door — observe via `cadence_thief` / `hex_chorister`. Distinct from `cadence_tiercer` (this pass, `n===3` → **0**), `cadence_capper` (`n>2` → **2**), `cadence_docker` (`n===2` → **0**), Floor (`n>1` → 1). **Do not PAIR with `cadence_tiercer`.** At most one remaining-above-3 rewrite CORE per pack as PAIR vs Tierce / Cap / Dock / Snuff / Floor / Rise / Prime.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if all remaining are 0/1/2/3 (use Cap / Floor / Prime / Rise / Snuff). Peer: Tern a 7 to a 3. Above: refuse if you will Tierce the same turn (COURT later).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **compressing a long bar to a 3**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cap_remaining_cds_gt_3_to_3"`. VETERAN: skip all-≤3. ELITE: prefer Inferno remaining 5+. CHAMPION: never Tern a bar you will Tierce the same turn.
- **CORE_SPELL_POOL:** `spell-cadence-tern`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the terned id is already remaining 3
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Tierce / Cadence Cap / Cadence Dock / Cadence Floor
- **SIGNATURE_MECHANICS:** Remaining `n>3` → `3`. 0/1/2/3 unchanged. Target keeps every spell. Inverse of Tierce (which **kills** a 3). Cap would have written 2. Floor would have written 1.
- **VARIANT_PROGRESSION:** BASE compress-to-3 → VETERAN skip-already-≤3 → ELITE nuke-bias → CHAMPION no-Tierce-same-turn
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits. Never CHAMPION in a solo pack with Tierce.
- **SYNERGIES:** `cadence_tiercer` (COURT, not PAIR), `verse_sesteter`, `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast the remaining-5 id **before** Tern; Cap your remaining 5 to 2; Floor your remaining 5 to 1
- **PLAYER_COUNTERPLAY:** Sit remaining at 3 (Tierce’s problem) or at 2 (Dock) or at 1 (Snuff) or at 0 (Prime)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-tern` (ENEMY_DISCOVERY: piece observe; Floor extras on `cadence_thief` / `hex_chorister` stay Floor — do not restamp)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 3 when n>3)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_toller`

- **NAME:** Odd Toller
- **ROLE:** controller (next **walk** +1 AP if leftover **AP is odd**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Odd Toll (`spell-odd-toll`, #1082). Distinct from `gait_toller` (next walk if leftover **MP = 0**), `still_toller` (next **spell** if leftover MP = 0), `walk_toller` (Wave-7 walk-pool flag). Do **not** name it `gait_toller` or `walk_toller`. At most one next-walk leftover-AP tax CORE per pack as PAIR vs Gait / Still / Cast / Walk Tollers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP is even (use Gait Toll when leftover MP = 0). Peer: tax leftover 1/3/5 then walk. Above: skip if they will not walk.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **camp leftover AP odd, then the walk costs extra**. If it tops the meter, the kit leaked toward Ley Toll.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tax_next_walk_if_leftover_ap_odd"`. VETERAN: skip leftover AP even. ELITE: Gait Gift COURT after they dump MP and keep leftover AP ≥ 2. CHAMPION: never become Gait Toll on leftover MP = 0 / leftover AP even.
- **CORE_SPELL_POOL:** `spell-odd-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-ley-toll` only as G≥1 extra, never CORE (fourth mpCost snipe stays held)
- **ELITE_SPELL_POOL:** none — do **not** add Gait Toll / Still Toll / Ley Toll as identity
- **SIGNATURE_MECHANICS:** Not `spell.mpCost`. Next **walk** +1 AP if leftover **AP is odd**. Keep leftover AP even. Fizzle after AP if leftover AP even still observes.
- **VARIANT_PROGRESSION:** BASE odd-walk-tax → VETERAN skip-even → ELITE Gift-COURT → CHAMPION no-gait-clone
- **RARITY_CURVE:** Standard. +ELITE vs kite kits.
- **SYNERGIES:** `gait_gifter` (COURT), `brick_taxer` (COURT, not PAIR), `stone_castellan`
- **WEAKNESSES:** Keep leftover AP even; don’t walk; Dual Keep 2/2 (even)
- **PLAYER_COUNTERPLAY:** Spend 1 leftover AP before walking; sit leftover AP 0/2/4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-toll` (ENEMY_DISCOVERY, piece observe — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk +1 AP if leftover AP odd; fail closed until leftover AP exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_taxer`

- **NAME:** Brick Taxer
- **ROLE:** controller (next **walk** +1 AP while adjacent to a **barrier**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Brick Tax (`spell-brick-tax`, #1082). Distinct from `brick_holder` (**forbids** the walk), `brick_bracer` (**negates a hit** while adjacent), `brick_stepper` (**relocates through** the barrier), `tax_scribe` (Wave-2 glyph tax). Do **not** name it `brick_holder` or `tax_scribe`. At most one barrier-adjacent walk-tax CORE per pack as PAIR vs Brick Hold / Brace / Step / Nudge / Orbit / Crack / Sprout / Shift / Wipe.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no adjacent barrier (use Brick Hold only when they must not walk). Peer: tax the cover-camp. Above: skip if they can destroy the barrier this turn and a Strike kills.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.85, sr 1.00, res 1.10, init 0.90, chc 0.65. Identity is **walk still legal, just +1 AP while hugging the wall**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "tax_next_walk_if_adjacent_barrier"`. VETERAN: skip no-adjacent-barrier. ELITE: plant Barrier then tax (self-cover). CHAMPION: never become Brick Hold on a failed tax.
- **CORE_SPELL_POOL:** `spell-brick-tax`, `spell-barrier`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Brick Hold / Brick Brace / Brick Step as identity
- **SIGNATURE_MECHANICS:** Destroy the barrier and the tax drops; lock **stays** until duration. Not `spell.mpCost`. Cover-camping walk tax. Tally Hold / Score Hold / Stave Hold / Sestet Hold are leftover-sum walk locks — this is **geometry**.
- **VARIANT_PROGRESSION:** BASE wall-tax → VETERAN skip-no-wall → ELITE self-cover → CHAMPION no-hold-clone
- **RARITY_CURVE:** Standard. +ELITE on corridor maps with live barriers.
- **SYNERGIES:** `odd_toller` (COURT), `stone_castellan`, `sestet_holder` (COURT, not PAIR)
- **WEAKNESSES:** Destroy the barrier; don’t walk; blink
- **PLAYER_COUNTERPLAY:** Break the wall; Swap off adjacency; don’t walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-tax` (ENEMY_DISCOVERY, piece observe — fizzle after AP if no adjacent barrier still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk +1 AP while adjacent to a barrier)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_taxer`

- **NAME:** Watch Taxer
- **ROLE:** sniper (overwatch snap **taxes the walker’s next spell +1 AP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Watch Tax (`spell-watch-tax`, #1082). Distinct from `watch_drainer` (**steals 1 leftover MP**), `watch_rooter` (**zeros** leftover MP), `watch_sipper` (**steals leftover AP**), Quiet Hex (ungated **next-spell** tax). Do **not** name it `watch_drainer`. **Do not PAIR with Watch Drain / Watch Root / Watch Sip.** At most one overwatch-snap CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player is already in 1–2 (use Strike / Glass Shot). Peer: arm overwatch on the approach file. Above: skip if they will not walk into the band.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.70, init 1.20, chc 0.90. Identity is **ending a walker’s remaining walk mid-path and charging their next confirm**. If it tops the meter, the kit leaked toward Glass Shot.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "overwatch_snap_tax_walker_next_spell"`. VETERAN: skip if already in 1–2. ELITE: Thin Gait after they spend the extra AP into leftover 1/0 (COURT). CHAMPION: never become Watch Drain on a failed snap.
- **CORE_SPELL_POOL:** `spell-watch-tax`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-glass-shot` if already in the catalog, else `spell-expose`
- **ELITE_SPELL_POOL:** none — do **not** add Watch Drain / Watch Root / Watch Sip / Quiet Hex as identity
- **SIGNATURE_MECHANICS:** Overwatch snap. Not `spell.mpCost`. Next **spell** +1 AP on the **walker**. Quiet Hex is an ungated next-spell tax, not an overwatch snap.
- **VARIANT_PROGRESSION:** BASE snap-tax → VETERAN skip-already-close → ELITE Thin-follow → CHAMPION no-drain-clone
- **RARITY_CURVE:** Standard. +ELITE on long-file maps with an overwatch band.
- **SYNERGIES:** `thin_gaiter` (COURT), `glass_sniper` (COURT, not PAIR), `tern_warder`
- **WEAKNESSES:** Don’t walk into the band; Blink / Swap; already in 1–2
- **PLAYER_COUNTERPLAY:** Walk around the band; Strike from outside; Quiet Hex is **not** this
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-tax` (ELITE, piece observe — **arm**)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (overwatch snap + next-spell +1 AP on the walker)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `thin_gaiter`

- **NAME:** Thin Gaiter
- **ROLE:** assassin (leftover AP === 1 AND leftover MP === 0 → bonus damage)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Thin Gait (`spell-thin-gait`, #1082). Distinct from `even_gaiter` (leftover MP **even ≥ 2**), `odd_gaiter` (leftover MP **odd**), `prime_gifter` / `prime_plater` (**1/1**), Dry Sting (leftover MP **= 0**, leftover AP unconstrained), `thin_warder` (Wave-7 challenge absorb). Do **not** name it `thin_warder` or `even_gaiter`. At most one leftover-1/0 poke CORE per pack as PAIR vs Even / Odd / Lone / Pair Gaiters / Prime Plater.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover is 1/1 (Prime Gift window) or leftover MP odd (Odd Gait). Peer: poke leftover 1/0. Above: skip if they sit 0/0 (Gaunt Sting) and a Strike kills.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.90, res 0.70, init 1.25, chc 1.10. Identity is **punishing leftover 1/0**. If it tops the meter ungated, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_1_and_mp_eq_0"`. VETERAN: skip 1/1 and leftover-MP-odd. ELITE: Watch Tax so their next spell spends into 1/0 (COURT). CHAMPION: never become Prime Plate on a failed 1/0.
- **CORE_SPELL_POOL:** `spell-thin-gait`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-poison`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Even Gait / Odd Gait / Prime Plate / Dry Sting as identity
- **SIGNATURE_MECHANICS:** Leftover **exactly 1/0**. 1/1 is Prime Gift / Prime Plate. 0/0 is Gaunt. 1/1 with MP is not this. Dry Sting wants leftover MP = 0 with leftover AP unconstrained.
- **VARIANT_PROGRESSION:** BASE 1/0 poke → VETERAN skip-wrong-window → ELITE Watch-follow → CHAMPION no-prime-clone
- **RARITY_CURVE:** Standard. +ELITE vs leftover-thin casters.
- **SYNERGIES:** `watch_taxer` (COURT), `prime_plater` (COURT, not PAIR), `plate_warden`
- **WEAKNESSES:** Sit 1/1; sit 2/0 (Gait Gift); sit 0/0 (Gaunt); Iron Skin
- **PLAYER_COUNTERPLAY:** Keep 1 walk MP; dump to 0/0; Dual Keep 2/2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-thin-gait` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP===1 AND MP===0 predicate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lava_cutter`

- **NAME:** Lava Cutter
- **ROLE:** assassin (10 + 10 if target is Chebyshev ≤ 2 from **lava occupancy**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Lava Cut (`spell-lava-cut`, #1082). Distinct from `rime_cutter` (**ice occupancy**), `spike_cutter` (**spike occupancy**), `hazard_cutter` (**painted** hazard), `portal_cutter` (**world portals**), `lava_reeler` (**pulls**), `lava_skipper` (**ignores tax**). Do **not** name it `rime_cutter` or `lava_reeler`. At most one occupancy-threshold poke CORE per pack as PAIR vs Rime / Spike / Hazard / Portal Cutters / Lava Reeler.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no lava in 2 of the target (use Rime Cut / Spike Cut). Peer: poke near lava. Above: skip if Twin Gate pads are the only “lava-looking” cells (pads are **not** lava).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.10, sr 0.95, res 0.80, init 1.15, chc 1.00. Identity is **threshold poke near lava occupancy**. If it tops the meter off-lava, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_near_lava_occupancy"`. VETERAN: skip no-lava-in-2. ELITE: Summon Orth COURT so pets cannot diagonal-flee the lava. CHAMPION: never dest a world portal as lava.
- **CORE_SPELL_POOL:** `spell-lava-cut`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Rime Cut / Spike Cut / Hazard Cut / Lava Reel as identity
- **SIGNATURE_MECHANICS:** Twin Gate pads are **not** lava. Painted mire is **not** lava. World portals are Portal Cut’s window. Bonus iff Chebyshev ≤ 2 from **lava occupancy**.
- **VARIANT_PROGRESSION:** BASE lava-poke → VETERAN skip-no-lava → ELITE kennel-COURT → CHAMPION no-portal-as-lava
- **RARITY_CURVE:** Standard. +ELITE on lava maps. Never CHAMPION on a dry board.
- **SYNERGIES:** `summon_orther` (COURT, not PAIR with Strike Plate on one BASE kit), `mire_reeler` (COURT, not PAIR), `null_censor` (COURT, not PAIR)
- **WEAKNESSES:** Leave Chebyshev 2 of lava; Iron Skin; Swap off the band
- **PLAYER_COUNTERPLAY:** Step off the lava ring; blink; occupy the cutter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lava-cut` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev ≤ 2 from lava occupancy)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `strike_plater`

- **NAME:** Strike Plater
- **ROLE:** protector / anti-melee (target’s next **Strike** deals 0; AP still spent)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Strike Plate (`spell-strike-plate`, #1082). Distinct from `cast_plater` (next **non-Strike spell** deals 0), `summon_plater` (allied summons treat the **next incoming hit** as 0), Mute Thread (silence-ish), Quiet Hex (ungated next-spell +1 AP). Do **not** name it `cast_plater` or `strike_marker`. **Do not PAIR with Cast Plate on one BASE kit.** At most one next-payload-zero CORE per pack as PAIR vs Cast Plate / Summon Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if they will not Strike. Peer: zero the next Strike. Above: skip if their win condition is Frost (Cast Plate’s window) and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **Strike / `physical_attack` is the only payload this card zeros**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "next_strike_damage_zero"`. VETERAN: skip if they have no Strike id. ELITE: Summon Orth COURT so pets also pay to flee (COURT, not PAIR). CHAMPION: never become Cast Plate on a failed Strike-zero.
- **CORE_SPELL_POOL:** `spell-strike-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Cast Plate / Summon Plate / Mute Thread / Quiet Hex as identity
- **SIGNATURE_MECHANICS:** Tools still deal full. Hit them with Frost, or wait the consume. Identify Strike by **id** (`physical_attack`), never `spell.name`. AP still spent. Fail closed until Strike is identifiable.
- **VARIANT_PROGRESSION:** BASE Strike-zero → VETERAN skip-no-Strike → ELITE Orth-COURT → CHAMPION no-cast-clone
- **RARITY_CURVE:** Standard. +ELITE vs melee kits.
- **SYNERGIES:** `summon_orther` (COURT, not PAIR), `lava_cutter`, `plate_warden`
- **WEAKNESSES:** Cast Frost / Poison; wait the consume; Coup
- **PLAYER_COUNTERPLAY:** Use a non-Strike spell; wait; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-strike-plate` (ELITE, piece observe — **arm**)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next Strike payload 0 by **id**; fail closed until Strike is identifiable)
- **STATUS:** PROPOSED

---

## 5. Relative scaling (no cap)

`pickEnemyLevelFromTiers` already raises the chance of near / equal / above-player enemies as the player climbs (`combatMath.ts` 54–107). This pass does **not** retune those percents. The `floor(999 / ts)` rail is spawn-math, not a content cap. Variant floors (BASE 1 / VETERAN 3 / ELITE 6 / CHAMPION 8) sit **on top of** `computeAITier`, which still plateaus at label 10 then 30% noise — that plateau is a **label**, not a last enemy. `G = floor(max(0, R) / T)` is unbounded. Wave 19 CORE rows stamp `generationMin: 17` on unique SDE verbs and inherit #1132’s Wave-18 tactical generation. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`. **Still the same family.**

Higher `R` does **not** mean “more HP.” It means: smarter skip predicates, one extra ADVANCED ∪ RARE ∪ ELITE slot, higher variant weight, denser synergy packs. A level-400 Sestet Mender is still a four-read healer. A level-400 Tern Warder is still a Chebyshev-3 orthogonal walk lock.

---

## 6. Implementation prerequisites (not new families)

Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec/Hendeca/Dodeca/**Trideca** cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / Score Post `scorepost` / Hendeca Span `hendecaspan` / Stave Post `stavepost` / Dodeca Span `dodecaspan` / **Sestet Post `sestetpost`** / **Trideca Span `tridecaspan`** / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 7. Next run (Wave 20)

Do not re-propose Waves 1–19 ids unless evolving them; re-check implementation. Wave 20 consumes leftover SDE Wave 18 unique CORE (`spell-hook-stride` … except Pack Hook / Hook Fold unless a boss sheet claims them) plus SPELL_PROPOSALS Wave 19 (#1177: Septet Mend leftover both-body **sum === 7** / Cadence Quarte remaining `4→0` / Tetradeca Span occupy-weight **14** / Feud Turn leftover invert on **caster + one hostile** + Septet court). Extra doors for Pack Hook / Hook Fold stay `hook_precentor` / `hook_fold_regent`. Extra doors for #1177 stay `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. Extra rooms for #1143 unique CORE stay `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave`. Do not mint `wave19:` spell ids. Cadence Floor is SDE-owned — do not mint `cadence_floorer`. Cadence Prime owns remaining `0→1` — do not mint `spell-cadence-arm`. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) are Wave 17. Cadence Dock (`2→0`) and Cadence Cap (`n>2→2`) are Wave 18. Cadence Tern (`n>3→3`) and Cadence Tierce (`3→0`) are this pass. Cadence Quad (`n>4→4`) is SDE Wave 18 — Wave 20 CORE; Cadence Quarte (`4→0`) is SPELL_PROPOSALS #1177 — Wave 20 CORE; **do not name them the same family**. Trideca Span filled thirteen-cell occupy — Tetradeca Span fills fourteen (`summonAI: "tetradecaspan"`; skip until remaining cap ≥ 14). Prime Gift owns leftover 1/1 heal. Gait Gift owns leftover AP≥2/MP=0 heal. Wide Gift (AP≥2/MP≥1) is SDE Wave 18 — Wave 20. Dual Plate owns leftover AP even≥2 AND leftover MP even≥2 miss. Prime Plate owns leftover 1/1 miss. Thin Plate (leftover 1/0 negate) is SDE Wave 18 — Wave 20. Psalm Turn owns mixed-side invert (caster stays). Feud Turn owns caster+hostile invert — Wave 20. Hold mid-RAF splice, fourth mpCost walk snipe, player-owned Hex of Silence, sixth echo, leftover AP − leftover MP === 2 as `spell-skew-*`. `spell-pack-ring` / `spell-lane-fold` / `spell-pack-hook` / `spell-hook-fold` stay never-owned unless a boss sheet claims them. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. Do not ship `spell-parched-mend` beside Dry Gait. Do not mint `spell-sestet-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-septet-gift` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-octa-span` / `spell-mixed-turn` / `spell-cadence-trey` / `cadence_quarter`. Same-day SDE Wave 19 had not opened a PR at authoring (`cursor/spell-discovery-and-evolution-5d97`); if it later claims a unique leftover, **SDE wins** and stamps as Wave **21** family CORE.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `sestet_mender` | healer | `spell-sestet-mend` | `sestet_cantor` |
| `cadence_tiercer` | controller | `spell-cadence-tierce` | `tierce_precentor` |
| `trideca_prelate` | summoner | `spell-trideca-span` | `span_trideca` (`summonAI: "tridecaspan"`) |
| `psalm_turner` | controller | `spell-psalm-turn` | — |
| `sestet_hooder` | protector | `spell-sestet-hood` | — |
| `sestet_stinger` | assassin | `spell-sestet-sting` | — |
| `sestet_stepper` | teleporter | `spell-sestet-step` | — |
| `sestet_siller` | hazard creator | `spell-sestet-sill` | — |
| `sestet_holder` | controller | `spell-sestet-hold` | — |
| `sestet_lender` | buffer | `spell-sestet-lend` | — |
| `sestet_sipper` | debuffer | `spell-sestet-sip` | — |
| `sestet_prelate` | summoner | `spell-sestet-post` | — (`summonAI: "sestetpost"`) |
| `sestet_bouncer` | artillery | `spell-sestet-bounce` | — |
| `must_sesteter` | controller | `spell-must-sestet` | — |
| `verse_sesteter` | debuffer | `spell-verse-sestet` | — |
| `tern_warder` | controller | `spell-tern-stride` | `tern_gallery` |
| `octa_oather` | controller | `spell-octa-oath` | `octa_nave` |
| `mire_reeler` | displacement | `spell-mire-reel` | `bog_aisle` |
| `diag_biter` | bruiser | `spell-diag-bite` | — |
| `summon_marker` | anti-summon | `spell-summon-mark` | `spawn_pulpit` |
| `prime_plater` | protector | `spell-prime-plate` | — |
| `slide_skipper` | kiter | `spell-slide-skip` | `belt_nave` |
| `capped_stinger` | assassin | `spell-capped-sting` | — |
| `summon_orther` | anti-summon | `spell-summon-orth` | — |
| `gait_gifter` | healer | `spell-gait-gift` | — |
| `cadence_terner` | controller | `spell-cadence-tern` | — (observe `cadence_thief` / `hex_chorister`) |
| `odd_toller` | controller | `spell-odd-toll` | — |
| `brick_taxer` | controller | `spell-brick-tax` | — |
| `watch_taxer` | sniper | `spell-watch-tax` | — |
| `thin_gaiter` | assassin | `spell-thin-gait` | — |
| `lava_cutter` | assassin | `spell-lava-cut` | — |
| `strike_plater` | protector / anti-melee | `spell-strike-plate` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Tierce / Pack Ring / Lane Fold stay kit-only.

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–18 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `wave19:` colliding ids.
- No restamp of `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` / `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent` as family ids.
- Same-day SDE Wave 18 (#1143) was not cloned; it stamps as Wave **20** family CORE.

All **32** sheets: **STATUS: PROPOSED**.

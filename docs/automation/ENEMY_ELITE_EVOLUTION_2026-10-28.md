# Enemy and Elite Evolution Design — Wave 20

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-28  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Twentieth daily pass. **32** new world-pack families that consume **SDE Wave 18 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`, open PR #1143) **except** Pack Hook / Hook Fold, plus **SPELL_PROPOSALS Wave 19 verbs** (`SPELL_PROPOSALS_2026-10-27.md`, open PR #1177) **except** Court Quarte (`NOT_PLAYER_LEARNABLE`). Cadence Floor remains **SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Cadence Quad (`n>4` → `4`) is this pass’s SDE CORE, not Cadence Quarte (`n===4` → `0`) and not Cadence Tern (`n>3` → `3`) and not Cadence Cap (`n>2` → `2`). Wide Gift (one-body leftover **AP ≥ 2 AND MP ≥ 1**) is this pass’s SDE CORE, not Septet Mend (both-body leftover **sum === 7**). Thin Plate (leftover **1/0** negate) is this pass’s SDE CORE, not Prime Plate / Dual Plate. Tetradeca Span (axis-aligned **2×7**, counts as **fourteen**) is this pass’s occupy card. SDE Wave 19 unique CORE (`spell-camel-stride` … `spell-camel-fold`, open PR #1198) stays extras until Wave 21. Bosses stay on the existing catalog.

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
- [`ENEMY_ELITE_EVOLUTION_2026-10-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-cc26/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-27.md) (Wave 19, 32 family sheets — open PR #1189; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 19

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–19. Wave 19 closed as docs in the 2026-10-27 pass (PR #1189). SPELL_PROPOSALS latest on this cron is Wave 19 (#1177). SDE latest unique-CORE lag is Wave 18 (#1143). Same-day SDE Wave 19 (#1198) **did** open after Wave 19 authored — unique leftover (`spell-camel-stride` … `spell-camel-fold`) stamps as **Wave 21** family CORE (**SDE wins**). This pass consumes **#1143** unique CORE (minus Pack Hook / Hook Fold) plus **#1177** (minus Court Quarte). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥18 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`) at `src/frontend/src/components/WorldExploration.tsx`. Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 19 claim | 2026-10-28 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–19 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186; `res` is an integer roll) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16821; void 25% reflect (`castHelpers.ts` 335–337) | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 72–84) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / Tally / Score / Stave / Sestet / **Septet** Post count as **1**. Triple = 3 … Trideca Span = 13. **Tetradeca Span = 14** — skip Tetradeca until remaining cap ≥ 14 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Septet Mend / Wide Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `tetradecaspan` / `septetpost` (and still no `tridecaspan` / `sestetpost` / `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938; overworld **draw** WX 8067. **Unread as a combat gate.** | Facing families still fail closed. Wave 20 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 20 CORE rows stay `mpCost: 0`. Septet Lend / Septet Sip / Feud Turn / Watch Bind rewrite **current leftover AP/MP** or next-walk legality, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Slide Reel is the **thirteenth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava / ice / painted mire, then **painted conveyor occupancy**). Dest is never `map.portals` |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–19 force families still fail closed. Wave 20 adds **zero** new force-gated CORE cards |
| `lastResolvedSpellId` | Absent | `verse_septeter` (and Waves 10–19 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` / Wave 16 `cast_toller` still wait. Idle Plate / Thin Plate / Idle Mark do **not** invent a persist stat |
| `walkMpSpentThisTurn` | Absent | Septet\* leftover-sum gates / Wide Gift / Thin Plate / Wide Sting / Prime Gait / Even Toll / Idle Plate fail closed until battle walks write leftover MP |
| One next walk permutation of **(3,1)** / next-spell exact Chebyshev **9** / pull toward nearest **painted conveyor occupancy** / bonus if share a **(3,1)** vector / cell detonates on **end-turn leftover MP === max** / leftover **1/0** miss / pathLength **2** ignores Thorned Ground extra / leftover **AP≥2 AND MP≥1** poke / allied-summon **walk-landing (3,1)** AP tax / heal-if leftover **AP≥2 AND MP≥1** / remaining `n>4→4` / next **walk** +1 AP if leftover **AP even ≥ 2** / next **spell** +1 AP while **barrier adjacent** / overwatch snap **forbids the walker’s next walk** / leftover **1/1** poke / bonus if near **painted conveyor occupancy** / leftover MP **equals max** miss | Still absent as CORE identities | Wave 20 secondary opportunity (SDE Wave 18 unique CORE leftover). Pack Hook / Hook Fold stay closed |
| Heal-if both bodies leftover AP + leftover MP **=== 7** / remaining `4` → `0` / axis-aligned **2×7** occupy (fourteen) / invert leftover on **the caster and one hostile** / next hit 0 while sum===7 / sting / join / start-turn occupy / cannot-walk-while-sum===7 / +AP+MP if ally sum===7 (**exits** window) / steal leftover AP iff sum===7 / end-turn occupy sum===7 post / bounce among sum===7 / non-Strike illegal unless sum===7 **and** last AP / last-id illegal until sum===7 | Still absent in live catalog | Wave 20 primary opportunity (SPELL_PROPOSALS Wave 19). Court Quarte stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Thin Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Brier Skip is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Hook Bite is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16821) | Only live MP-debit hook. Slide Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Quad is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 335–337) | Only live reflect. Feud Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 20 families exist so those verbs are **sentences**, not extra HP.

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

**Wave 19 ids — do not re-propose:**  
`sestet_mender`, `cadence_tiercer`, `trideca_prelate`, `psalm_turner`, `sestet_hooder`, `sestet_stinger`, `sestet_stepper`, `sestet_siller`, `sestet_holder`, `sestet_lender`, `sestet_sipper`, `sestet_prelate`, `sestet_bouncer`, `must_sesteter`, `verse_sesteter`, `tern_warder`, `octa_oather`, `mire_reeler`, `diag_biter`, `summon_marker`, `prime_plater`, `slide_skipper`, `capped_stinger`, `summon_orther`, `gait_gifter`, `cadence_terner`, `odd_toller`, `brick_taxer`, `watch_taxer`, `thin_gaiter`, `lava_cutter`, `strike_plater`.

This Wave 20 family pass consumes **#1143** unique CORE (minus Pack Hook / Hook Fold) plus **#1177** (minus Court Quarte). **Wave 21** consumes SDE Wave 19 unique CORE (`spell-camel-stride` … `spell-camel-fold`, except Pack Camel / Camel Fold unless a later boss sheet claims them) plus same-day SPELL_PROPOSALS Wave 20 if that catalog opens. Extra doors stay kit-only (`septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`). This run does not mint colliding `wave20:` spell ids. Same-day 2026-10-28 SPELL_PROPOSALS / SDE had **not** opened a PR at authoring — if they later claim a unique leftover, **SDE wins** and stamps as Wave **21** family CORE.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` / `spell-pack-diag` / `spell-far-fold` / `spell-court-snuff` / `spell-pack-orth` / `spell-leap-fold` / `spell-court-dock` / `spell-pack-ring` / `spell-lane-fold` / `spell-pack-hook` / `spell-hook-fold` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is Wave 16 CORE. Cadence Rise (`n==1` → `2`) is Wave 17. Cadence Snuff (`n==1` → `0`) is Wave 17. Cadence Cap (`n>2` → `2`) is Wave 18. Cadence Dock (`n===2` → `0`) is Wave 18. Cadence Tern (`n>3` → `3`) is Wave 19. Cadence Tierce (`n===3` → `0`) is Wave 19. Cadence Quad (`n>4` → `4`) is this pass’s SDE CORE. Cadence Quarte (`n===4` → `0`) is this pass’s **other** remaining rewrite — inverse of leaving a 4 after Quad, not a Floor clone. Cadence Quint (`n>5` → `5`) is SDE Wave 19 — Wave 21.

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

**Stationary-post / multi-body cap (extend Wave 19):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** Tally Post **or** Dec Span **or** Score Post **or** Hendeca Span **or** Stave Post **or** Dodeca Span **or** Sestet Post **or** Trideca Span **or** **Septet Post** **or** **Tetradeca Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post / **Septet Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. Dec Span counts as **ten**. Hendeca Span counts as **eleven**. Dodeca Span counts as **twelve**. Trideca Span counts as **thirteen**. **Tetradeca Span counts as fourteen.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, Dec Span, Score Post, Hendeca Span, Stave Post, Dodeca Span, Sestet Post, Trideca Span, Septet Post, or Tetradeca Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-…fourteen-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, a Dec Span axis-aligned 2×5, a Hendeca Span stretched plus (7-spine × 5-crossbar, center occupied), a Dodeca Span axis-aligned 3×4, a Trideca Span orthogonal plus arm 3, **or** a Tetradeca Span axis-aligned 2×7, never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, Tally Post, Score Post, Stave Post, Sestet Post, and Septet Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole). Hendeca Span occupies **every** cell of the stretched plus (no cage hole; **no diagonal cells**). Dodeca Span occupies **every** cell of the 3×4 (no cage hole). Trideca Span occupies **every** cell of the plus (center + four arms of length 3; **no diagonal cells of the bounding 7×7**). Tetradeca Span occupies **every** cell of the 2×7 (no cage hole). Hendeca / Trideca click is **center**. Dodeca / Dec / **Tetradeca** click is the **cell of the rectangle closest to the caster**. A 2×7 **has no unique center**.

**Summon-cap prerequisite (extend Wave 19):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. … Trideca Span is illegal until remaining cap ≥ 13. **Tetradeca Span is illegal until remaining cap ≥ 14.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post / Septet Post are legal at remaining ≥ 1. Do not spawn `tetradeca_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 19):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / Tally\* leftover-sum / Equal Gift / Tied Gait / Score\* leftover-sum / Lean Gift / Dry Plate / Odd Gait / Even Sting / Still Toll / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / Even Gait / Gait Toll / Sestet\* leftover-sum / Gait Gift / Prime Plate / Thin Gait / Capped Sting / Odd Toll / **Septet\*** leftover-sum / **Wide Gift** / **Thin Plate** / **Wide Sting** / **Prime Gait** / **Even Toll** / **Idle Plate** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Brick Step / Score Step / Stave Step / Sestet Step / **Septet Step** / Tern Stride / **Hook Stride** / Slide Skip are relocates or next-walk locks — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 19):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / Tally\* leftover-sum / Odd Plate / Odd Sting / Equal Gift / Tied Gait / Score\* leftover-sum / Even Sting / Lean Gift / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / Sestet\* leftover-sum / Gait Gift / Prime Plate / Thin Gait / **Septet\*** leftover-sum / **Wide Gift** / **Thin Plate** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3** (2/1, 1/2, 3/0, 0/3 — **not** 2/2), **enables** Score when the surviving banks **sum to 4 and are unequal** (4/0, 0/4, 3/1, 1/3 — **not** 2/2), **cannot enable Stave** (max surviving leftover is 2/2 = sum 4), **cannot enable Sestet** (sum 6), **cannot enable Septet** (sum 7), **enables Dual Plate** when both leftover AP and leftover MP are even and ≥ 2 (2/2 is Dual Plate **and** Poise), **enables Gait Gift** when leftover AP ≥ 2 **and** leftover MP = 0 (Dual Keep 2/0 if it can sit there), **enables Wide Gift** when leftover AP ≥ 2 **and** leftover MP ≥ 1 (Dual Keep **cannot** sit here — max is 2/2 but 2/2 has MP≥1 **and** AP≥2, so Dual Keep 2/2 **is** Wide Gift **and** Poise **and** Dual Plate), **enables Prime Plate / Prime Gift** when leftover is **exactly 1/1**, **enables Thin Plate / Thin Gait** when leftover is **exactly 1/0**, and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold (2,1) / (1,2) / (3,0) / (0,3) for Tally. Hold (4,0) / (0,4) / (3,1) / (1,3) for Score. Hold (5,0) / (0,5) / (4,1) / (1,4) / (3,2) / (2,3) for Stave. Hold leftover **exactly 1/1** for Prime Gift / Prime Plate / **Prime Gait**. Hold leftover **exactly 1/0** for Thin Gait / **Thin Plate**. Hold leftover **AP ≥ 2 AND MP = 0** for Gait Gift. Hold leftover **AP ≥ 2 AND MP ≥ 1** for Wide Gift / **Wide Sting**. Hold (6,0) / (0,6) / (5,1) / (1,5) / (4,2) / (2,4) for Sestet — Dual Keep **cannot** sit here except that Dual Keep never reaches sum 6. Hold (7,0) / (0,7) / (6,1) / (1,6) / (5,2) / (2,5) / (4,3) / (3,4) for Septet — Dual Keep **cannot** sit here. `leftover AP = 0` and `leftover MP = 0` is **not** a Septet window, **not** a Sestet window, **not** a Stave window, **not** a Score window, **not** a Tally window, and **not** a Poise window. Dual Keep 2/2 is Poise (sum 4 **and** a tie) **and** Dual Plate **and** Wide Gift. Dual Keep 3/1 **is** Score. Dual Keep **cannot** sit on sum 5, sum 6, or sum 7. Stave Lend (3,2)→(4,3) **manufactures Septet**. Sestet Lend (4,2)→(5,3) **manufactures Septet**. Septet Lend (4,3)→(5,4) **exits** to 9. Septet Sip (4,3)→(3,3) **manufactures Poise**; other successful sips **manufacture Sestet**. (3,3) is Poise, **not** Septet (odd sum never ties — no equality ban needed).

**Last-id prerequisite (extend Wave 19):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / Verse Tally / Summon Verse / Verse Score / Verse Stave / Verse Sestet / **Verse Septet** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 19):** Shove Mark / Drift Gift / Heave\* / Drift\* / Shove Gift fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, Score Step, Stave Step, Sestet Step, Septet Step, Home Step, Tern Stride, and Hook Stride dests do **not** set the flag. Wave 20 adds **zero** new force-gated CORE cards. Slide Reel **is** an attract — it needs `applyAttract` wired, not a new persist flag.

**Facing / Struck prerequisites (partial):** Wave 20 adds **zero** facing CORE cards. Idle Plate / Thin Plate / Idle Mark key leftover MP, not Strike-from-cell. Clash Mend / Strike Debter / Cast Toll still wait on `struckThisTurn`. Strike Mark (Wave 17) still waits on Strike-from-cell. Summon Mark waits on **summon spawn onto the painted cell**.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Septet Mend MULTI child `septet_cantor` — first child wins vs `septet_mender` observe. Cadence Quarte MULTI child `quarte_precentor` — first child wins vs `cadence_quarterer` observe. Tetradeca Span MULTI child `span_tetradeca` — first child wins vs `tetradeca_prelate` observe. Court Quarte stays `court_quarte_regent` kit-only. Hook Stride teach room `hook_gallery` — first child wins vs `hook_warder` observe. Nona Oath teach room `nona_nave` — first child wins vs `nona_oather` observe. Slide Reel teach room `mill_aisle` — first child wins vs `slide_reeler` observe. Idle Mark teach room `idle_pulpit` — first child wins vs `idle_marker` observe. Brier Skip teach room `brier_nave` — first child wins vs `brier_skipper` observe. Pack Hook stays `hook_precentor` kit-only. Hook Fold stays `hook_fold_regent` kit-only. Wide Gift / Cadence Quad / Thin Plate / Hook Bite / Wide Sting / Hook Taxer / Even Toll / Brick Feer / Watch Binder / Prime Gait / Slide Cut / Idle Plate / Feud Turn / Septet Hood / Septet Sting / Septet Step / Septet Sill / Septet Hold / Septet Lend / Septet Sip / Septet Post / Septet Bounce / Must Septet / Verse Septet have **no** extra door — do **not** invent `wide_cantor` / `quad_precentor` / `thin_plater_door` / restamp `septet_cantor` / `sestet_cantor` / `stave_cantor` / `score_cantor` / `tally_cantor` / `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor` / `prime_precentor` / `snuff_precentor` / `dock_precentor` / `tierce_precentor` / `quarte_precentor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `rank_precentor`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `diag_precentor`, `far_fold_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`, `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`, `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`, `hook_gallery`, `nona_nave`, `mill_aisle`, `idle_pulpit`, `brier_nave`, `septet_cantor`, `quarte_precentor`, `span_tetradeca`, `court_quarte_regent`, `hook_precentor`, `hook_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` / `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` / `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` / `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` / `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`.

---

## 2. Why Wave 20 exists (gaps Waves 1–19 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag). Wave 15 covered leftover SDE Wave 13 unique CORE (minus Pack File / Diag Fold) + SPELL_PROPOSALS Wave 14 (minus Cadence Floor / Court Floor). Wave 16 covered leftover SDE Wave 14 unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) + SPELL_PROPOSALS Wave 15 (minus Court Prime). Wave 17 covered leftover SDE Wave 15 unique CORE (minus Pack Diag / Far Fold) + SPELL_PROPOSALS Wave 16 (minus Court Snuff). Wave 18 covered leftover SDE Wave 16 unique CORE (minus Pack Orth / Leap Fold) + SPELL_PROPOSALS Wave 17 (minus Court Dock). Wave 19 covered leftover SDE Wave 17 unique CORE (minus Pack Ring / Lane Fold) + SPELL_PROPOSALS Wave 18 (minus Court Tierce).

SPELL_PROPOSALS Wave 19 (#1177) then stamped the holes Wave 19 **held**: both-body leftover AP + leftover MP **=== 7** heal (Septet Mend), remaining `4` → `0` (Cadence Quarte), axis-aligned fourteen-cell occupy (Tetradeca Span), and a caster-plus-hostile leftover invert (Feud Turn) plus the Septet court. A G≥19 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 18 unique CORE still had no CORE owner after Wave 19. Seventeen of those verbs fill holes Wave 19 tactical does not: one next walk permutation of **(3,1)**, next-spell exact Chebyshev **9**, pull toward nearest **painted conveyor occupancy**, bonus if share a **(3,1)** vector, cell detonates on **end-turn leftover MP === max**, leftover **1/0** miss, pathLength **2** ignores Thorned Ground extra, leftover **AP≥2 AND MP≥1** poke, allied-summon **walk-landing (3,1)** AP tax, heal-if leftover **AP≥2 AND MP≥1**, remaining `n>4→4`, next **walk** +1 AP if leftover **AP even ≥ 2**, next **spell** +1 AP while **barrier adjacent**, overwatch snap **forbids the walker’s next walk**, leftover **1/1** poke, bonus if near **painted conveyor occupancy**, leftover MP **equals max** miss. Pack Hook and Hook Fold stay closed.

SDE Wave 19 (#1198) unique CORE stays extras until Wave 21. Cadence Quint (`n>5` → `5`) is **not** Cadence Quad. Thin Gift (leftover **1/0** heal) is **not** Thin Plate. Camel Stride is **not** Hook Stride. Tetradeca Span is **not** a fourteen-cell hold for a later SDE occupy — #1177 filled that hole. Deca Oath (exact-10 **spell gate**) is **not** Tetradeca Span (occupy-weight 14).

| Unused Wave 19 / SDE Wave 18 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-septet-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 7**) | `sestet_mender` (both leftover **sum === 6 AND unequal**); `stave_mender` (both leftover **sum === 5**); `score_mender` (both leftover **sum === 4 AND unequal**); `wide_gifter` (this pass, one-body leftover **AP≥2 AND MP≥1**); `gait_gifter` (one-body leftover **AP≥2 AND MP=0**); `prime_gifter` (leftover **exactly 1/1**) | Four leftover reads on an **odd** sum Dual Keep **cannot** fake; odd sum never ties so no equality ban. Extra door is `septet_cantor` — family is **`septet_mender`**. Do **not** restamp `sestet_cantor` / `stave_cantor` / `score_cantor`. |
| `spell-cadence-quarte` (remaining `n===4` → `0`; zeros stay 0; `n===1`, `n===2`, `n===3`, and `n>4` unchanged) | `cadence_tiercer` (`n===3` → **0**); `cadence_docker` (`n===2` → **0**); `cadence_snuffer` (`n==1` → **0**); `cadence_quadder` (this pass, `n>4` → **4** — **fours stay 4**); `cadence_terner` (`n>3` → **3** — **fours become 3**); `cadence_capper` (`n>2` → **2**) | Ready-**unlock of a 4**. Extra door is `quarte_precentor` — family is **`cadence_quarterer`**. Do **not** mint `cadence_quarter` / `cadence_floorer` / `quad_precentor`. |
| `spell-tetradeca-span` (axis-aligned 2×7, counts as **fourteen**) | `trideca_prelate` (plus arm 3 = 13, **center click**); `dodeca_prelate` (3×4 = 12, **nearest-cell click**); `hendeca_prelate` (stretched plus = 11, **center click**); `dec_prelate` (2×5 = 10) | Fourteen tiles, rectangle with unique nearest-cell click, empty kit. Extra door is `span_tetradeca` — family is **`tetradeca_prelate`**. Skip until remaining cap ≥ 14. |
| `spell-feud-turn` (invert leftover AP↔MP on **the caster and one hostile**; caster participates) | `psalm_turner` (**one same-side non-caster + one hostile**; caster **unchanged**); `hymn_turner` (**two allies**); `duel_turner` (**two hostiles**); `purse_turner` (**one** hostile); `bar_crosser` (two-body **cross** through the caster) | Caster’s purse flips. Sum invariant: Septet stays Septet; Sestet stays Sestet. Solo caster with a living hostile **does** fire. Do **not** mint `spell-mixed-turn`. Choir Hymn is a Wave-1 heal. |
| `spell-septet-hood` (next hit is 0 **while leftover AP + leftover MP === 7**, any range) | `sestet_hooder` (sum === 6 unequal); `stave_hooder` (sum === 5); `thin_plater` (this pass, leftover **1/0**) | Hold (4,3). Dual Keep 2/2 is Dual Plate / Poise Hood / Wide Gift, **not** this. (3,3) is Poise. Odd sum never ties. |
| `spell-septet-sting` (10 + 8 iff leftover AP + leftover MP === 7) | `sestet_stinger` (sum === 6 unequal); `stave_stinger` (sum === 5); `wide_stinger` (this pass, leftover **AP≥2 AND MP≥1**); `capped_stinger` (leftover MP **equals max**) | Punish (7,0) / (0,7) / (6,1) / (1,6) / (5,2) / (2,5) / (4,3) / (3,4). 2/2 is Poise / Dual Plate / Wide Gift. 3/3 is Poise. (4,2) is Sestet. |
| `spell-septet-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 7) | `sestet_stepper` (sum === 6 unequal); `stave_stepper` (sum === 5); `home_stepper` (**ungated**) | Join the body that **sums to 7**. Relocate, not `isSwap`. |
| `spell-septet-sill` (occupant sum===7 at **start of their turn** takes 8; paint stays) | `sestet_siller` (sum === 6 unequal); `stave_siller` (sum === 5); `idle_marker` (this pass, end-turn leftover **MP === max**, consume) | Tax the camp **on their turn start** if they held a Septet pair. Dual Keep 2/2 **misses**. |
| `spell-septet-hold` (cannot walk while leftover AP + leftover MP === 7) | `sestet_holder` (while sum === 6 unequal); `stave_holder` (while sum === 5); `brick_holder` (**barrier adjacent**) | (0,7) has MP but cannot spend it. Spend leftover AP **or** dump to 4/2. **Do not PAIR with Must Septet.** |
| `spell-septet-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 7 — **exits** to sum 9) | `sestet_lender` (+1/+1 if sum === 6 unequal — **exits** to 8); `stave_lender` (+1/+1 if sum === 5 — **exits** to 7, **which is this family’s window**) | Cash the window. Stave Lend **manufactures Septet**. Sestet Lend **also** manufactures Septet. |
| `spell-septet-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 7 and leftover AP ≥ 1) | `sestet_sipper` (steal iff sum === 6 unequal); `stave_sipper` (steal iff sum === 5); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (4,3) → (3,3) **Poise**. Other successful sips **manufacture Sestet**. (0,7) fizzles (no AP). |
| `spell-septet-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 7** deals 10 and it dies) | `sestet_prelate` (sum === 6 unequal); `stave_prelate` (sum === 5); `dummy_prelate` (taunt) | Camp sum===7 on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "septetpost"`. |
| `spell-septet-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===7 hostile) | `sestet_bouncer` (second body sum === 6 unequal); `stave_bouncer` (second body sum === 5); Chain Lightning (nearest **any**) | Second 12 needs **two** Septet bodies. Missing flag → 12 only. |
| `spell-must-septet` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 7 **and** this spell spends last AP) | `must_sesteter` (sum === 6 unequal / last AP); `must_staver` (sum === 5 / last AP); `septet_holder` (this pass, **walk** needs sum ≠ 7) | Inverse of Septet Hold. Strike stays legal. **Do not PAIR with Septet Hold.** |
| `spell-verse-septet` (last resolved id **illegal until leftover AP + leftover MP === 7**) | `verse_sesteter` (until sum === 6 unequal); `verse_staver` (until sum === 5); `last_muter` (**duration**) | Recast Inferno only after **sum === 7**. 2/2 and 3/2 and 3/3 and 4/2 and 0/0 do **not** lift. |
| `spell-hook-stride` (**next walk** legal only if `(|dx|,|dy|)` is a permutation of **(3,1)**) | `tern_warder` (Chebyshev **exactly 3, orthogonal only** `(±3,0)/(0,±3)`); `knight_warder` (**only** `(2,1)`); `ring_warder` (Chebyshev **exactly 2**, knight excluded) | Extra room is `hook_gallery` — family is **`hook_warder`**. Eight dests `(±3,±1)` and `(±1,±3)`. Do **not** name it `hook_gallery` or `hook_chaplain` or `tern_warder`. |
| `spell-nona-oath` (next spell must be Chebyshev **exactly 9**) | `octa_oather` (exact **8**); `hepta_oather` (exact **7**); `nine_prelate` (occupy-weight 9); `long_oather` (**≥ 3**) | Frost at 1–8 or ≥ 10 fizzles. Strike stays legal. Extra room `nona_nave` is a teach — family is **`nona_oather`**. Do **not** name it `nona_nave` or `nine_prelate`. Do **not** mint `spell-nona-span`. |
| `spell-slide-reel` (pull 1 toward nearest **painted conveyor occupancy**) | `mire_reeler` (toward **painted mire occupancy**); `lava_reeler` (toward **lava occupancy**); `slide_skipper` (ignore conveyor **auto-push**); Slide Tile (**paints** the cell) | Thirteenth `applyAttract` dest flavor. Extra room `mill_aisle` is a teach — family is **`slide_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no painted conveyor fizzles. |
| `spell-hook-bite` (10 + 8 if share a **(3,1)** vector) | `diag_biter` (`\|dx\|==\|dy\|`); `file_biter` (share **file only**); `rank_biter` (share **rank only**); `axis_biter` (share rank **or** file) | Bonus on the hook. Rank-only / file-only / diagonal / knight → 10 only. Family is **`hook_biter`**. Do **not** name it `hook_warder` or `hook_chaplain`. |
| `spell-idle-mark` (cell detonates at **end of turn** if leftover MP **equals max**) | `dwell_marker` (any end-turn occupy); `summon_marker` (**spawn onto**); `wake_marker` (start-of-turn) | They must **not walk**. Extra room `idle_pulpit` is a teach — family is **`idle_marker`**. Do **not** name it `idle_pulpit` or `last_marker`. |
| `spell-thin-plate` (next hit is 0 **while leftover AP === 1 AND leftover MP === 0**; consume on miss) | `prime_plater` (leftover **1/1**); `dual_plater` (leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**); `dry_plater` (leftover **MP = 0**); `thin_gaiter` (leftover **1/0 damage**) | Hold (1,0). Dual Keep 1/0 **is** this window if it survives. Family is **`thin_plater`**. Do **not** name it `thin_gaiter` or `thin_warder` or `prime_plater`. |
| `spell-brier-skip` (next walk of **pathLength exactly 2** ignores Thorned Ground extra) | `slide_skipper` (**conveyor** auto-push, length 1); `rift_skipper` (**Void Rift** tax); `mire_skipper` (**mire enter-tax**) | Length ≥ 3 still pays. Extra room `brier_nave` is a teach — family is **`brier_skipper`**. Do **not** name it `brier_nave` or `slide_skipper`. Thorned Ground is a **map modifier**, not occupancy. |
| `spell-wide-sting` (10 + 8 iff leftover AP **≥ 2 AND** leftover MP **≥ 1**) | `thin_gaiter` (leftover **1/0**); `prime_gaiter` (this pass, leftover **1/1**); `capped_stinger` (leftover MP **equals max**); `fresh_stinger` (leftover AP **equals max**) | Punish a fat leftover. Dual Keep 2/2 **is** this window. Family is **`wide_stinger`**. Do **not** name it `wide_gifter`. |
| `spell-summon-hook` (allied summons pay +1 **AP** if this turn’s walk **landing** is a **(3,1)** from origin) | `summon_orther` (per **diagonal step**); `summon_filer` (walk **off file**); `summon_toller` (+1 AP to start **any** walk); Pack Hook (`ENEMY_ONLY` hard lock) | Orthogonal 1-steps are free of this tax. **Do not PAIR with Summon Orth / Summon File / Summon Toll.** Family is **`hook_taxer`**. Do **not** name it `summon_hooker` / `hook_chaplain` / `hook_warder` / `hook_biter` / `summon_orther`. |
| `spell-wide-gift` (heal 8 iff leftover **AP ≥ 2 AND leftover MP ≥ 1**) | `gait_gifter` (AP≥2 and MP=0); `lean_gifter` (AP=0 and MP≥1); `prime_gifter` (exactly **1/1**); `septet_mender` (this pass, both leftover **sum === 7**); Hollow / Gaunt (0/0) | Healer CORE only. Dual Keep 2/2 **is** Wide Gift **and** Poise **and** Dual Plate. (4,3) is Wide Gift **and** a Septet pair — Septet still needs **both** bodies. **No extra door**. Family is **`wide_gifter`**. |
| `spell-cadence-quad` (remaining `n>4` → `4`; 0/1/2/3/4 unchanged) | `cadence_quarterer` (this pass, `n===4` → **0**); `cadence_terner` (`n>3` → **3**); `cadence_capper` (`n>2` → **2**); Floor (`n>1` → 1) | Compress a 7 to a 4. Observe via `cadence_thief` / `hex_chorister`. Do **not** restamp `floor_precentor` / `quarte_precentor` / `tierce_precentor`. Family is **`cadence_quadder`**. Do **not** name it `cadence_quarterer` or `cadence_quarter`. |
| `spell-even-toll` (next **walk** +1 AP if leftover **AP is even ≥ 2**) | `odd_toller` (leftover **AP odd**); `gait_toller` (next walk if leftover **MP = 0**); `still_toller` (next **spell** if leftover MP = 0) | Camp leftover 2/4/6 then walk. Keep leftover AP odd. Family is **`even_toller`**. Do **not** PAIR with Odd Toll. |
| `spell-brick-fee` (next **non-Strike spell** +1 AP while adjacent to a **barrier**) | `brick_taxer` (next **walk** +1 AP); `brick_holder` (**forbids** the walk); `watch_taxer` (overwatch next-spell +1 AP); Quiet Hex (ungated next-spell tax) | Cover-camping **spell** tax. Strike stays free. Family is **`brick_feer`**. Do **not** name it `brick_taxer` or `watch_feer` or `tax_scribe`. |
| `spell-watch-bind` (overwatch snap **forbids the walker’s next walk**) | `watch_taxer` (next **spell** +1 AP); `watch_rooter` (**zeros** leftover MP now); `watch_drainer` (**steals 1 leftover MP**); Brick Hold (cannot walk **while adjacent to a barrier**) | Ending a walker’s remaining walk mid-path **and** locking the **next** walk. **Do not PAIR with Watch Tax / Watch Root / Watch Drain.** Family is **`watch_binder`**. Do **not** name it `pair_binder` or `fuse_binder` or `watch_taxer`. |
| `spell-prime-gait` (leftover **AP === 1 AND leftover MP === 1** → bonus damage) | `thin_gaiter` (leftover **1/0**); `wide_stinger` (this pass, leftover **AP≥2 AND MP≥1**); `prime_gifter` / `prime_plater` (**1/1** heal / miss) | Poke leftover 1/1. 1/0 is Thin. Dual Keep 1/1 **is** this window. Family is **`prime_gaiter`**. Do **not** name it `prime_gifter` or `cadence_primer` or `thin_gaiter`. |
| `spell-slide-cut` (10 + 10 if target is Chebyshev ≤ 2 from **painted conveyor occupancy**) | `lava_cutter` (**lava occupancy**); `rime_cutter` (**ice occupancy**); `spike_cutter` (**spike occupancy**); `hazard_cutter` (**painted** hazard); `slide_reeler` (**pulls**); `slide_skipper` (**ignores push**) | Threshold poke. Twin Gate pads are **not** conveyor. Family is **`slide_cutter`**. Do **not** name it `slide_reeler` or `slide_skipper` or `slide_mason`. |
| `spell-idle-plate` (next hit is 0 **while leftover MP equals max**; consume on miss) | `thin_plater` (this pass, leftover **1/0**); `dry_plater` (leftover **MP = 0**); `prime_plater` (leftover **1/1**); `capped_stinger` (damage on leftover MP equals max) | Hold leftover MP at max (they have **not walked**). Family is **`idle_plater`**. Do **not** name it `idle_marker` or `thin_plater` or `capped_stinger`. |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-quarte` (`NOT_PLAYER_LEARNABLE`; `court_quarte_regent` kit — same law as Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-hook` (ENEMY_ONLY; stays `hook_precentor` CHAMPION SIGNATURE), `spell-hook-fold` (BOSS_ONLY; `hook_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor / Pack Rank / Rank Fold / Court Prime / Pack Diag / Far Fold / Court Snuff / Pack Orth / Leap Fold / Court Dock / Pack Ring / Lane Fold / Court Tierce stay where Waves 5–19 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 20 CORE rows are `mpCost: 0`. Septet Sip / Septet Lend / Feud Turn / Watch Bind rewrite **current leftover AP/MP** or next-walk legality.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Septet Post / Idle Mark / Cadence Quarte / Cadence Quad are **not** queue splices.  
Do **not** family a fifteen-cell occupy this pass. Tetradeca Span is the fourteen-cell card. Trideca Span already owns thirteen. Dodeca Span already owns twelve. Hendeca Span already owns eleven.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Camel Stride / Deca Oath / Glyph Reel / Camel Bite / Hollow Mark / Wide Plate / Fuse Skip / Hollow Sting / Summon Camel / Thin Gift / Cadence Quint / Prime Toll / Brick Levy / Watch Shave / Lean Gait / Glyph Cut / Fresh Plate / Pack Camel / Camel Fold (SDE Wave 19 unique CORE — Wave 21).  
Do **not** family leftover AP − leftover MP === 2 as `spell-skew-*`. (3,1) is Score; (4,2) is Sestet; (4,3) is Septet; (5,3) would be a later sum-8 family.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family leftover 1/1 heal as `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift`. Prime Gift is Wave 18; Gait Gift is Wave 19; Wide Gift is this pass.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 19 unique CORE as this pass’s CORE.  
Do **not** mint `wave20:` colliding spell ids.  
Do **not** name the Septet Mend family `septet_cantor`, the Tetradeca Span family `span_tetradeca`, the Hook Stride family `hook_gallery` or `tern_warder` or `hook_chaplain`, the Nona Oath family `nona_nave` or `nine_prelate` or `octa_oather`, the Slide Reel family `mill_aisle` or `mire_reeler` or `slide_skipper`, the Idle Mark family `idle_pulpit` or `last_marker` or `idle_plater`, the Cadence Quarte family `quarte_precentor` or `cadence_floorer` or `cadence_quadder` or `cadence_quarter`, the Cadence Quad family `quad_precentor` or `cadence_quarterer` or `cadence_terner`, the Wide Gift family `septet_cantor` or `gait_gifter` or `septet_mender`, the Thin Plate family `thin_gaiter` or `prime_plater` or `thin_warder`, the Hook Bite family `hook_warder` or `diag_biter` or `hook_chaplain`, the Brier Skip family `brier_nave` or `slide_skipper` or `rift_skipper`, the Hook Taxer family `summon_hooker` or `summon_orther` or `hook_chaplain` or `hook_warder` or `hook_biter`, the Brick Feer family `brick_taxer` or `watch_feer` or `tax_scribe`, the Watch Binder family `watch_taxer` or `pair_binder` or `fuse_binder`, the Prime Gait family `prime_gifter` or `cadence_primer` or `thin_gaiter`, the Slide Cut family `slide_reeler` / `slide_skipper` / `lava_cutter`, the Idle Plate family `idle_marker` / `thin_plater` / `capped_stinger`, the Feud Turn family `psalm_turner` / `hymn_turner` / `duel_turner` / `purse_turner`, the Even Toll family `odd_toller` / `gait_toller` / `still_toller`, or the Wide Sting family `wide_gifter` / `thin_gaiter` / `prime_gaiter`.

---

## 3. Encounter synergy packs (Waves 1–20)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** Score Post **or** Stave Post **or** Sestet Post **or** Septet Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span **or** Hendeca Span **or** Dodeca Span **or** Trideca Span **or** Tetradeca Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Septet Choir | `septet_mender` + `verse_septeter` + `ignite_alchemist` | Sum===7 8, then Inferno is illegal until leftover AP + leftover MP === 7 |
| Tetradeca Plug | `tetradeca_prelate` + `septet_siller` + `hook_warder` | 2×7 corridor seal, tax a neighbor at turn start, lock the next walk to (3,1). Skip until remaining cap ≥ 14 |
| Hook Nona | `hook_warder` + `nona_oather` + `glass_sniper` | Next walk must be (3,1), next spell must be exact 9, snipe from 9 |
| Mill Hook | `slide_reeler` + `hook_biter` + `glyph_sower` | Pull toward painted conveyor, then bite the hook cell they now share |
| Idle Thin | `idle_marker` + `thin_plater` + `plate_warden` | Paint the camp cell, then camp leftover 1/0 behind the miss |
| Brier Wide | `brier_skipper` + `wide_stinger` + `tide_shade` | Cross Thorned Ground at length 2, then poke leftover AP≥2/MP≥1 |
| Wide Quad | `wide_gifter` + `cadence_quadder` + `font_cantor` | Heal the AP≥2/MP≥1 window, then compress remaining n>4 → 4 |
| Even Brick | `even_toller` + `brick_feer` + `stone_castellan` | Tax the next walk at leftover AP even ≥ 2, then tax the next spell while barrier-adjacent |
| Watch Prime | `watch_binder` + `prime_gaiter` + `glass_sniper` | Snap forbids next walk, then poke leftover 1/1 |
| Mill Kennel | `slide_cutter` + `hook_taxer` + `idle_plater` | Threshold poke near conveyor, then tax pet (3,1) landings **or** blank a hit while leftover MP is max — COURT, never PAIR Tax + Plate on one BASE kit |
| Feud Septet | `feud_turner` + `septet_mender` + `septet_stinger` | Invert caster + hostile purses while keeping sum 7, then heal / sting |
| Quarte Verse | `cadence_quarterer` + `verse_septeter` + `tax_scribe` | Unlock remaining 4 → 0, then lock recast until they sit Septet |
| Septet Quiet | `septet_stepper` + `septet_mender` + `cover_squire` | Join the sum===7 ally, then cash the seven leftover reads |
| Purse Septet | `feud_turner` + `septet_sipper` + `sestet_stinger` | Invert, then sip (4,3)→(3,3) **Poise** or (5,2)→(4,2) **Sestet**, then sting the manufactured window |
| Septet Gate | `septet_prelate` + `septet_siller` + `septet_stinger` | Post detonates sum===7 occupy; tile taxes start-of-turn; sting the rest |
| Bounce Septet | `septet_bouncer` + `must_septeter` + `fuse_binder` | Two Septet bodies, bounce 12+12 onto the wick |
| Septet Hold File | `septet_holder` + `must_septeter` + `leash_warden` | Walk **and** tools need leftover sum === 7 — COURT, never PAIR Septet Hold + Must Septet on the same body without a third peeler |
| Lend Hood | `septet_lender` + `septet_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 9), or hold (4,3) through a miss |
| Quad Quarte | `cadence_quadder` + `cadence_quarterer` + `verse_septeter` | Compress a 7 to a 4, **then** Quarte the 4 to 0 on a **later** turn — COURT, never PAIR Quad + Quarte on one BASE kit |
| Thin Idle | `thin_plater` + `idle_plater` + `plate_warden` | Camp 1/0 miss, then camp leftover-MP-equals-max miss after they walk the last AP |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood), Wave 16 packs (Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen), Wave 17 packs (Score Choir, Hendeca Plug, File Hexa, Lava File, Strike Dry, Shock Even, Lean Rise, Still Brace, Watch Odd, Spike Kennel, Duel Score, Snuff Verse, Score Quiet, Purse Score, Score Gate, Bounce Score, Score Hold File, Lend Hood), Wave 18 packs (Stave Choir, Dodeca Plug, Ring Hepta, Rime Rank, Last Dual, Rift Fresh, Prime Cap, Gait Brick, Watch Even, Rime Kennel, Hymn Stave, Dock Verse, Stave Quiet, Purse Stave, Stave Gate, Bounce Stave, Stave Hold File, Lend Hood, Cap Dock, Dual Fresh), and Wave 19 packs (Sestet Choir, Trideca Plug, Tern Octa, Mire Diag, Spawn Prime, Slide Cap, Gait Tern, Odd Brick, Watch Thin, Lava Kennel, Psalm Sestet, Tierce Verse, Sestet Quiet, Purse Sestet, Sestet Gate, Bounce Sestet, Sestet Hold File, Lend Hood, Tern Tierce, Prime Thin).

Do **not** pack as PAIR (COURT later is fine):

- `septet_mender` + `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `wide_gifter` as PAIR / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `tetradeca_prelate` + `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `septet_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `septet_hooder` + `sestet_hooder` / `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` / `prime_plater` / `thin_plater` as PAIR / `idle_plater` as PAIR
- `septet_stinger` + `sestet_stinger` / `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `capped_stinger` / `wide_stinger` as PAIR / `prime_gaiter` as PAIR / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` / `thin_gaiter` as PAIR
- `septet_stepper` + `sestet_stepper` / `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire`
- `septet_siller` + `sestet_siller` / `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `idle_marker` as PAIR / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` / `summon_marker`
- `septet_holder` + `sestet_holder` / `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_septeter` as PAIR / `must_sesteter` as PAIR
- `septet_lender` + `sestet_lender` / `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `septet_sipper` + `sestet_sipper` / `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `septet_prelate` + `sestet_prelate` / `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `idle_marker` as PAIR / `bait_prelate` / `tetradeca_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate`
- `septet_bouncer` + `sestet_bouncer` / `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_septeter` + `must_sesteter` / `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `septet_holder` as PAIR
- `verse_septeter` + `verse_sesteter` / `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as PAIR
- `hook_warder` + `tern_warder` / `ring_warder` / `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR / `hook_chaplain` as PAIR / `hook_biter` as PAIR
- `nona_oather` + `octa_oather` / `hepta_oather` / `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `nine_prelate` / `oct_prelate` / `sept_prelate`
- `slide_reeler` + `mire_reeler` / `lava_reeler` / `rime_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `slide_skipper` as PAIR / `slide_cutter` as PAIR / `slide_mason` as PAIR
- `hook_biter` + `diag_biter` / `file_biter` / `rank_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `hook_warder` as PAIR / `hook_chaplain` as PAIR
- `idle_marker` + `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `last_marker` / `summon_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `sestet_siller` / `septet_siller` / `idle_plater` as PAIR / `gait_wicker` / `fuse_binder`
- `thin_plater` + `prime_plater` / `dual_plater` / `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `idle_plater` as PAIR / `septet_hooder` as PAIR / `sestet_hooder` as PAIR / `thin_gaiter` as PAIR
- `brier_skipper` + `slide_skipper` / `rift_skipper` / `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `slide_mason` as PAIR
- `wide_stinger` + `septet_stinger` / `sestet_stinger` / `fresh_stinger` / `full_stinger` / `even_stinger` / `odd_stinger` / `capped_stinger` / `prime_gaiter` as PAIR / `thin_gaiter` as PAIR / `wide_gifter` as PAIR / `tied_gaiter` / `pair_purser` as PAIR
- `hook_taxer` + `summon_orther` as PAIR / `summon_filer` as PAIR / `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `idle_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `hook_warder` as PAIR / `hook_biter` as PAIR
- `wide_gifter` + `septet_mender` / `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `wide_stinger` as PAIR
- `cadence_quadder` + `cadence_quarterer` as PAIR / `cadence_terner` / `cadence_tiercer` / `cadence_capper` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` / `cap_warder`
- `cadence_quarterer` + `cadence_quadder` as PAIR / `cadence_tiercer` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`
- `even_toller` + `odd_toller` as PAIR / `gait_toller` / `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_feer` + `brick_taxer` / `brick_holder` / `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `watch_feer` as PAIR / `septet_holder` as PAIR / `screen_biter` as PAIR
- `watch_binder` + `watch_taxer` / `watch_drainer` / `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `pair_binder` as PAIR / `fuse_binder` as PAIR / `glass_sniper` as PAIR
- `prime_gaiter` + `thin_gaiter` / `even_gaiter` / `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `wide_stinger` as PAIR / `prime_plater` as PAIR / `prime_gifter` as PAIR / `cadence_primer` as PAIR
- `slide_cutter` + `lava_cutter` / `rime_cutter` / `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `slide_reeler` as PAIR / `slide_skipper` as PAIR / `null_censor` as PAIR
- `idle_plater` + `thin_plater` as PAIR / `idle_marker` as PAIR / `hook_taxer` as PAIR / `dry_plater` / `prime_plater` / `capped_stinger` as PAIR / `cast_plater` as PAIR / `summon_plater` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `feud_turner` + `psalm_turner` as PAIR / `hymn_turner` as PAIR / `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR

Do **not** spawn Tetradeca Plug on a map with no free 14-cell 2×7 (solvability). Do not spawn Mill Hook / Mill Kennel / Brier Wide on a map with no painted conveyor occupancy / no Thorned Ground modifier in Chebyshev 6 of a legal floor. Do not spawn Mill Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Watch Prime without an overwatch band (`glass_sniper` / Hold Ground / Far Watch). Twin Gate pads do **not** count as lava, ice, spikes, painted mire, conveyor, Void Rift, or `map.portals`. Thorned Ground is a **map modifier**, not occupancy.

---

## 4. Family sheets — Wave 20

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-27.md`](https://github.com/Mr-Melic/stralt/pull/1177) (PR #1177) unless marked SDE Wave 18 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-4a9e/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-26.md), PR #1143).

---

### ENEMY_ID: `septet_mender`

- **NAME:** Septet Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 7**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Septet Mend (`spell-septet-mend`, #1177). Extra door `septet_cantor` — family is **not** that id. Distinct from `sestet_mender` (both leftover **sum === 6 AND unequal**), `stave_mender` (both leftover **sum === 5**), `score_mender` (both leftover **sum === 4 AND unequal**), `wide_gifter` (this pass, one-body leftover **AP≥2 AND MP≥1**), `gait_gifter` (one-body leftover **AP≥2 AND MP=0**), `prime_gifter` (leftover **exactly 1/1**), `equal_gifter` (target-only tied ≥ 1), `lean_gifter` (leftover **AP=0 and MP≥1**), `gaunt_mender` (both leftover **0**). At most one seven-read heal CORE per pack as PAIR vs Sestet / Stave / Score / Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove / Prime / Gait / Wide.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 7. Peer: Septet Mend only if both leftover sums === 7 **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise / Dual Plate / Wide Gift / Score-blocked — Frost / Shield) or if either body sits (3,3) (Poise) or (4,2) (Sestet). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 7**. If it tops the meter, the kit leaked toward Frost. Dual Keep **cannot** fake this. Odd sum — no equality ban.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_7"`. VETERAN: skip if either sum ≠ 7. ELITE: prefer self-cast when the caster already sits on (4,3) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-septet-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Lean Gift / Gaunt Mend / Hollow Gift / Prime Gift / Gait Gift / Wide Gift.
- **SIGNATURE_MECHANICS:** Four leftover reads. Legal pairs (7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4). Dual Keep 2/2 is **Poise / Dual Plate / Wide Gift**, not Septet. Dual Keep **cannot** sit on sum 7. Stave Lend (3,2)→(4,3) **manufactures** Septet. Sestet Lend (4,2)→(5,3) **manufactures** Septet. A 6 AP / 3 MP bar that pays this 3 AP lands at (3,3) and **fails**. A 7 AP / 2 MP bar that pays 3 AP lands at (4,2) and **fails**. `healAmount` stays 0 on the Septet Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Feud Turn / Stave Lend is already in the pack (COURT, not PAIR with Sestet / Stave / Score / Tally / Poise / Prime / Gait / Wide).
- **SYNERGIES:** `feud_turner`, `verse_septeter`, `septet_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 7; dump to 4/2 (Sestet); dump to 3/3 (Poise); dump to 3/2 (Stave); dump to 3/1 (Score); dump to 3/0 (Tally); dump to 1/1 (Prime Gift); dump to 0/0 (Gaunt); Dual Keep; Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (4,3) → (3,3) **Poise**; sit Dual Keep; sit 4/2; kill the cantor first; do not hold 7 leftover in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-mend` (MULTI: family observe **or** `septet_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_quarterer`

- **NAME:** Cadence Quarterer
- **ROLE:** controller (remaining CDs `n===4` → `0`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Quarte (`spell-cadence-quarte`, #1177). Extra door `quarte_precentor` — family is **not** that id. Distinct from `cadence_tiercer` (`n===3` → **0**), `cadence_docker` (`n===2` → **0**), `cadence_snuffer` (`n==1` → **0**), `cadence_quadder` (this pass, `n>4` → **4** — **fours stay 4**), `cadence_terner` (`n>3` → **3** — **fours become 3**), `cadence_capper` (`n>2` → **2**), `cadence_primer` (`n===0` → `1`), Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0). At most one remaining-4 rewrite CORE per pack as PAIR vs Quad / Tern / Tierce / Dock / Snuff / Cap / Riser / Primer / Thief / Lagger / Staller / Cracker / Flusher. Do **not** mint `cadence_quarter`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≠ 4. Peer: Quarte only if a nuke remaining is 4. Above: refuse if the only remaining-4 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **handing the remaining-4 bar back for this tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "quarte_remaining_cds_eq_4_to_0"`. VETERAN: skip all-non-4. ELITE: prefer Inferno remaining 4 over Strike-only. CHAMPION: never Quarte a bar you will Quad the same turn (Quad is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-quarte`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the quarted id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Quad / Tern / Tierce / Dock / Snuff / Cap / Floor / Prime / Rise
- **SIGNATURE_MECHANICS:** Remaining `n===1` / `n===2` / `n===3` / `n>4` unchanged. Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Quad would have **left** a 4; Tern would have written 3; Cap would have written 2; Floor would have written 1.
- **VARIANT_PROGRESSION:** BASE remaining-4 unlock → VETERAN skip-no-4 → ELITE nuke-bias → CHAMPION no-same-turn-Quad
- **RARITY_CURVE:** Standard. +ELITE when Verse Septet is already in the pack (COURT).
- **SYNERGIES:** `verse_septeter`, `cadence_quadder` (COURT, not PAIR), `tax_scribe`
- **WEAKNESSES:** Sit remaining at 1 / 2 / 3 / 5+; recast before Quarte; Cadence Break
- **PLAYER_COUNTERPLAY:** Recast the remaining-4 nuke first; Floor it to 1; Tern it to 3 (then this does **not** write 0)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-quarte` (MULTI: family observe **or** `quarte_precentor` first-win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 0 when n===4)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tetradeca_prelate`

- **NAME:** Tetradeca Prelate
- **ROLE:** summoner (fourteen-cell occupy, axis-aligned 2×7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `septet_prelate`. Extra door is `span_tetradeca` — family is **not** that id. At most one Tetradeca Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 14.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 14 (Frost / Strike). Peer: plant only if all 14 cells are free and the slab splits the player from an exit. Above: refuse if the only 2×7 covers the last portal file (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.10, init 0.85, chc 0.60. Identity is **fourteen cells of deny along a 2×7**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `tetradecaspan` (#1177): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **fourteen** cells of an axis-aligned 2×7 as one combatant id; **every cell occupied**. VETERAN: skip if remaining cap < 14. ELITE: Septet Sill a neighbor. CHAMPION: never punch a slab if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-tetradeca-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` only if a diagonal gap needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / ninespan / decspan / hendecaspan / dodecaspan / tridecaspan / driftpost / leanpost / gauntpost / poisepost / tallypost / scorepost / stavepost / sestetpost / septetpost on this body.
- **SIGNATURE_MECHANICS:** Click is the **cell of the 2×7 closest to the caster** (Dec / Dodeca rule, **not** Trideca / Hendeca’s center). Long axis is the dominant caster→click axis. Shared occupancy: 14. Diagonals of the bounding box that are **outside** the 2×7 are the counter vs Trideca’s plus.
- **VARIANT_PROGRESSION:** BASE corridor plug → VETERAN cap-check → ELITE neighbor tax → CHAMPION solvability refuse
- **RARITY_CURVE:** Standard. +ELITE on corridor maps. Never CHAMPION in a closet.
- **SYNERGIES:** `septet_siller`, `hook_warder`, `rank_lancer`, `quiet_siller`
- **WEAKNESSES:** Occupy any of the 14 before paint; Coup the one HP pool; walk the unused diagonals of the bounding box
- **PLAYER_COUNTERPLAY:** Stand on a diagonal outside the 2×7; blink / Swap around the block; kill the body (all fourteen free)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tetradeca-span` (MULTI: family observe **or** `span_tetradeca` first-win)
- **REWARD_EXPECTATION:** Standard. Occupy-weight is the tax, not extra Doka.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (multi-cell occupy + cap weight 14; live cap is 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `feud_turner`

- **NAME:** Feud Turner
- **ROLE:** controller (invert leftover AP↔MP on **the caster and one opposite-side hostile**; caster participates)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Feud Turn (`spell-feud-turn`, #1177). No extra door. Distinct from `psalm_turner` (one same-side non-caster + one hostile; caster **unchanged**), `hymn_turner` (two **allies**), `duel_turner` (two **hostiles**), `purse_turner` (one hostile), `bar_crosser` (two-body **cross** through the caster), Tempo Invert (ally/self), Choir Hymn (Wave-1 Discovery **heal**). At most one leftover-invert CORE per pack as PAIR vs Psalm / Hymn / Duel / Purse / Bar / Dual Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no opposite-side body in r3. Peer: invert only if the caster sits (7,0) and the hostile (0,7) **or** (4,3)/(3,4). Above: skip if both leftover pairs are already equal (double no-op) or both 0/0. Solo caster with a living hostile **does** fire (unlike Psalm Turn).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **turning the caster’s purse and one hostile purse**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "feud_turn_if_hostile_in_r3_and_at_least_one_of_caster_or_hostile_is_unequal"`. VETERAN: skip double-equal / double-empty / missing hostile. ELITE: prefer Septet pairs so Septet Mend / Septet Sting still fire. CHAMPION: never invert if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-feud-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if the caster sits fat-AP after invert
- **ELITE_SPELL_POOL:** none — do **not** add Psalm Turn / Hymn Turn / Duel Turn / Purse Turn / Tempo Invert / Bar Cross / Swap as identity
- **SIGNATURE_MECHANICS:** Not `isSwap`. Caster leftover **does change**. Sum invariant on each body. Target is the **hostile**. Player-side summons are **not** the second body. Invert (4,3)→(3,4) **stays Septet**. Invert (4,2)→(2,4) **stays Sestet**. Invert (3,3) is a no-op.
- **VARIANT_PROGRESSION:** BASE caster+hostile invert → VETERAN skip-noop → ELITE Septet-bias → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Septet / Sestet is already in the pack (COURT).
- **SYNERGIES:** `septet_mender`, `septet_stinger`, `septet_sipper`, `sestet_stinger` (after sip manufactures Sestet)
- **WEAKNESSES:** Keep leftover AP === leftover MP on both; Strike before they recast; Quiet Hex after they invert into a 3-AP spell
- **PLAYER_COUNTERPLAY:** Sit 2/2 on both (double no-op); sit the caster on a window they did not want to leave; Quiet Hex
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-feud-turn` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover snapshots + two writes; fail closed if caster would be skipped)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_hooder`

- **NAME:** Septet Hooder
- **ROLE:** protector (next hit is 0 while leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Septet Hood (`spell-septet-hood`, #1177). Distinct from `sestet_hooder` / `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `dual_plater` / `prime_plater` / `thin_plater` / `odd_plater` / `dry_plater` / `spent_plater`. At most one leftover-window miss CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 7. Peer: Hood only while sitting (4,3) / (7,0) / (0,7) / (6,1) / (1,6) / (5,2) / (2,5) / (3,4). Above: refuse if Dual Keep banks 2/2 (Poise Hood / Dual Plate / Wide Gift) or if leftover is 3/3 (Poise) or 4/2 (Sestet Hood).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **holding a sum of 7**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "septet_hood_if_self_leftover_sum_eq_7"`. VETERAN: skip wrong window. ELITE: Feud Turn to **keep** sum 7. CHAMPION: never lend into a hit you wanted blanked.
- **CORE_SPELL_POOL:** `spell-septet-hood`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Hood / Stave Hood / Score Hood / Tally Hood / Poise Hood / Dual Plate / Prime Plate / Thin Plate / Spent Plate / Dry Plate
- **SIGNATURE_MECHANICS:** Any range. Charge remains if the hit arrives off-window. Hit at 2/2 lands (Poise Hood / Dual Plate / Wide Gift would blank or heal). Hit at 4/2 lands (Sestet Hood). Hit at 3/2 lands (Stave Hood). Hit at 3/3 lands (Poise Hood). Hit at 1/0 lands (Thin Plate).
- **VARIANT_PROGRESSION:** BASE window-miss → VETERAN skip-wrong → ELITE keep-sum → CHAMPION no-cash-out
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `feud_turner`, `septet_holder`, `cover_squire`
- **WEAKNESSES:** Wait until they spend a pool off 7; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force a 4/2 (Sestet); force a 3/3 (Poise); force a 2/2 (Poise / Dual Plate / Wide Gift); don’t hit while they sit (4,3)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-hood` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover sum at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_stinger`

- **NAME:** Septet Stinger
- **ROLE:** assassin (10 + 8 iff target leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Septet Sting (`spell-septet-sting`, #1177). Distinct from `sestet_stinger` / `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `wide_stinger` / `prime_gaiter` / `capped_stinger` / `fresh_stinger` / `thin_gaiter`. At most one leftover-window poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 7 (10 still lands). Peer: bonus path only on (4,3) / (7,0) / (0,7) / (6,1) / (1,6) / (5,2) / (2,5) / (3,4). Above: skip bonus if Dual Keep 2/2 (Wide Sting / Even Sting / Poise Sting) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 0.80, res 0.70, init 1.25, chc 1.10. Identity is **poking a sum of 7**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "septet_sting_if_target_leftover_sum_eq_7"`. VETERAN: skip bonus off-window (10 still). ELITE: Feud Turn to **keep** sum 7. CHAMPION: never bonus-poke if Strike kills.
- **CORE_SPELL_POOL:** `spell-septet-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Sting / Wide Sting / Prime Gait / Capped Sting / Fresh Sting / Thin Gait
- **SIGNATURE_MECHANICS:** 10 ungated + 8 on sum 7. Dual Keep 2/2 is the **wrong** window. (4,2) is Sestet Sting. (3,3) is Poise Sting. (3,2) is Stave Sting.
- **VARIANT_PROGRESSION:** BASE window-poke → VETERAN skip-bonus-off-window → ELITE keep-sum → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs fat leftover casters.
- **SYNERGIES:** `feud_turner`, `septet_holder`, `verse_septeter`
- **WEAKNESSES:** Sit off 7; Barrier; sit Dual Keep
- **PLAYER_COUNTERPLAY:** Sit 4/2; sit 3/3; sit 2/2; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-sting` (ENEMY_DISCOVERY, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one leftover-sum gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_stepper`

- **NAME:** Septet Stepper
- **ROLE:** teleporter (relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Septet Step (`spell-septet-step`, #1177). Distinct from `sestet_stepper` / `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper`. Relocate, not `isSwap`. At most one leftover-window join CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no in-window ally or no free neighbor. Peer: join the (0,7) wisp. Above: refuse if the only neighbor covers the last portal file.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.20, chc 0.80. Identity is **blink to a seven-bar ally**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "septet_step_if_ally_leftover_sum_eq_7_and_a_neighbor_is_free"`. VETERAN: skip no-window / no-neighbor. ELITE: Septet Sill a neighbor after landing. CHAMPION: never land on the last portal file.
- **CORE_SPELL_POOL:** `spell-septet-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Step / Stave Step / Home Step / Swap
- **SIGNATURE_MECHANICS:** Self-target forbidden. Ally leftover 4/2 fizzles (Sestet Step). Ally leftover 3/3 fizzles (Poise Step). Dual Keep cannot open this.
- **VARIANT_PROGRESSION:** BASE join-seven → VETERAN skip-no-seat → ELITE neighbor tax → CHAMPION solvability refuse
- **RARITY_CURVE:** Standard. +ELITE when a dedicated healer already sits on 7 (COURT).
- **SYNERGIES:** `septet_mender`, `septet_siller`, `cover_squire`
- **WEAKNESSES:** Spend the wisp’s pool; occupy every neighbor; Coup
- **PLAYER_COUNTERPLAY:** Sit the wisp on 4/2; occupy neighbors; kill the porter first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-step` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum gate + existing relocate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_siller`

- **NAME:** Septet Siller
- **ROLE:** hazard creator (start-of-their-turn occupy tax iff leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Septet Sill (`spell-septet-sill`, #1177). Distinct from `sestet_siller` / `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `idle_marker` / `wake_marker`. At most one leftover-window dawn-tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Barrier if they will not start on 7. Peer: paint the camp tile. Above: skip if Dual Keep overnight cannot leave them on 7 (it cannot) and they already sit 4/2.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 1.00, res 1.00, init 0.95, chc 0.70. Identity is **dawn tax on a sum of 7**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "septet_sill_if_foe_will_start_turn_sum_eq_7_on_tile"`. VETERAN: skip if they will not start on 7. ELITE: Septet Hold so they cannot walk off overnight. CHAMPION: never paint a portal (`isCellFree`).
- **CORE_SPELL_POOL:** `spell-septet-sill`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-barrier`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Sill / Idle Mark / Wake Mark
- **SIGNATURE_MECHANICS:** Walk-enter does **not** tax. End-turn occupy does **not** tax. Occupant leftover 4/2 at dawn → no tax (Sestet Sill). Occupant leftover 3/3 → no tax (Poise Sill). Dual Keep overnight **cannot** leave them on 7.
- **VARIANT_PROGRESSION:** BASE dawn-tax → VETERAN skip-wrong-window → ELITE hold-overnight → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on camp maps.
- **SYNERGIES:** `septet_holder`, `septet_prelate`, `feud_turner`
- **WEAKNESSES:** Walk off; spend a pool; blink; dump to 4/2
- **PLAYER_COUNTERPLAY:** Walk off before dawn; sit 4/2; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-sill` (ENEMY_DISCOVERY, paint observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + start-turn leftover-sum gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_holder`

- **NAME:** Septet Holder
- **ROLE:** controller (cannot spend leftover MP to walk while leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Septet Hold (`spell-septet-hold`, #1177). Distinct from `sestet_holder` / `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `brick_holder` / `must_septeter`. **Do not PAIR with Must Septet.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 7. Peer: lock (0,7) so they cannot walk seven tiles. Above: skip if they already sit 4/2 (Sestet Hold’s window) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.80, sr 1.05, res 1.10, init 0.95, chc 0.65. Identity is **cannot walk while sitting on seven**. If it tops the meter, the kit leaked toward Root.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "septet_hold_if_target_leftover_sum_eq_7_and_wants_to_walk"`. VETERAN: skip wrong window. ELITE: Must Septet COURT so they can neither walk nor non-Strike (COURT, not PAIR). CHAMPION: never become Must Septet on a failed walk-lock.
- **CORE_SPELL_POOL:** `spell-septet-hold`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Must Septet / Sestet Hold / Brick Hold as identity
- **SIGNATURE_MECHANICS:** Teleport / Swap / Phase Slip / Twin-gate / Septet Step do **not** pay walk MP and stay legal. Leftover (4,2) → this lock does **not** block walks. Leftover (3,3) → this lock does **not** block walks. At leftover (0,7) they **have** MP but cannot spend it.
- **VARIANT_PROGRESSION:** BASE walk-lock → VETERAN skip-wrong → ELITE Must-COURT → CHAMPION no-must-clone
- **RARITY_CURVE:** Standard. +ELITE vs walk-heavy kits.
- **SYNERGIES:** `must_septeter` (COURT, not PAIR), `feud_turner`, `leash_warden`
- **WEAKNESSES:** Cast leftover AP to leave 7; dump to 4/2; blink; wait 2 turns
- **PLAYER_COUNTERPLAY:** Spend leftover AP; sit 4/2; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-hold` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (leftover-sum gate in the walk spender)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_lender`

- **NAME:** Septet Lender
- **ROLE:** buffer (+1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP === 7 — exits to 9)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal as CORE. CORE is Septet Lend (`spell-septet-lend`, #1177). Distinct from `sestet_lender` / `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `tempo_precentor`. At most one leftover-window cash CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 7. Peer: cash the (4,3) wisp for a 2-resource bump. Above: skip if either grant cannot apply in full (both must land).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 1.00, res 0.85, init 1.10, chc 0.75. Identity is **cash seven for nine**. If it tops the meter, the kit leaked toward Haste.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "septet_lend_if_ally_leftover_sum_eq_7"`. VETERAN: skip wrong window. ELITE: Stave Lend COURT **into** Septet, then cash (COURT, not PAIR with Stave Lender). CHAMPION: never cash into a hit you wanted blanked (Septet Hood).
- **CORE_SPELL_POOL:** `spell-septet-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `starter-heal` (ungated, never as CORE)
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Lend / Stave Lend / Tempo Gift / Haste as identity
- **SIGNATURE_MECHANICS:** (4,3)→(5,4). Sum 9 is **not** Sestet / Stave / Score / Tally / Poise. Stave Lend **manufactures** Septet. Sestet Lend **also** manufactures Septet. Fail closed if either grant cannot apply in full.
- **VARIANT_PROGRESSION:** BASE cash-out → VETERAN skip-wrong → ELITE Stave-COURT-in → CHAMPION no-cash-into-hood
- **RARITY_CURVE:** Standard. +ELITE when Stave Lender is already in the pack (COURT).
- **SYNERGIES:** `stave_lender` (COURT, not PAIR), `septet_mender`, `tempo_precentor`
- **WEAKNESSES:** Sit off sum 7; sit on 4/2 (Sestet Lend); sit on 3/2 (Stave Lend)
- **PLAYER_COUNTERPLAY:** Sit 4/2; sit 3/3; sit Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-lend` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_sipper`

- **NAME:** Septet Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff target leftover AP + leftover MP === 7 and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Septet Sip (`spell-septet-sip`, #1177). Distinct from `sestet_sipper` / `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper`. At most one leftover-window steal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 7 or leftover AP is 0. Peer: sip (5,2) → (4,2) **Sestet**, or sip (4,3) → (3,3) **Poise**. Above: skip (0,7) (no AP to steal).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.85, res 0.75, init 1.20, chc 1.00. Identity is **sip seven into six or a tie**. If it tops the meter, the kit leaked toward Drain Courage.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "septet_sip_if_target_sum_eq_7_and_leftover_ap_ge_1"`. VETERAN: skip (0,7) / off-window. ELITE: Sestet Sting COURT after manufacturing 4/2 (COURT, not PAIR). CHAMPION: Poise Sting COURT after manufacturing 3/3 from (4,3).
- **CORE_SPELL_POOL:** `spell-septet-sip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Sip / Stave Sip / Bare Sip as identity
- **SIGNATURE_MECHANICS:** Sip does **not** always manufacture Sestet — (4,3) manufactures Poise. Other successful sips manufacture Sestet. Dual Keep 2/2 is the **wrong** window. Do not write `debuffStat: "ap"`.
- **VARIANT_PROGRESSION:** BASE steal → VETERAN skip-no-AP → ELITE Sestet-COURT → CHAMPION Poise-COURT
- **RARITY_CURVE:** Standard. +ELITE vs fat-AP casters.
- **SYNERGIES:** `sestet_stinger` (COURT, not PAIR), `feud_turner`, `septet_holder`
- **WEAKNESSES:** Sit on (0,7); sit off sum 7; sit on 4/2 (Sestet Sip)
- **PLAYER_COUNTERPLAY:** Sit (0,7); sit Dual Keep; Second Wind after
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-sip` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_prelate`

- **NAME:** Septet Prelate
- **ROLE:** summoner (empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Septet Post (`spell-septet-post`, #1177). Distinct from `sestet_prelate` / `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `dummy_prelate` / `idle_marker`. Counts as **1**. `summonAI: "septetpost"`. Do **not** also roll wolf/archer overlay. At most one leftover-window post CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if cap is full (Frost / Strike). Peer: plant where they will end on (4,3). Above: skip if Dual Keep overnight cannot leave them on 7.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.05, init 0.90, chc 0.65. Identity is **end-turn occupy on a sum of 7**. If it tops the meter, the kit leaked toward Dummy Post.
- **AI_TIER_PROGRESSION:** New summon AI `septetpost` (#1177): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, 1-cell body. VETERAN: skip if cap is full. ELITE: Septet Hold so they cannot walk off. CHAMPION: never plant on a portal.
- **CORE_SPELL_POOL:** `spell-septet-post`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** Do **not** unlock dummy / sestetpost / stavepost / scorepost / tallypost / poisepost / gauntpost / leanpost / driftpost / wolf / archer on this body.
- **SIGNATURE_MECHANICS:** Walk-enter does **not** detonate. Relocate landing does **not** detonate. Start-of-turn does **not** detonate. Occupant leftover 4/2 at turn end → no detonate (Sestet Post). Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Observation is the **summon**, not the later detonate.
- **VARIANT_PROGRESSION:** BASE end-turn mine → VETERAN cap-check → ELITE hold-overnight → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on camp maps.
- **SYNERGIES:** `septet_siller`, `septet_stinger`, `septet_holder`
- **WEAKNESSES:** Spend a pool before turn end; dump to 4/2; walk off; Coup the post
- **PLAYER_COUNTERPLAY:** Walk off; sit 4/2; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-post` (ENEMY_DISCOVERY, summon observes — detonate is not a second observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (empty-kit summon + end-turn leftover-sum gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `septet_bouncer`

- **NAME:** Septet Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest other leftover-AP+MP===7 hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Septet Bounce (`spell-septet-bounce`, #1177). Distinct from `sestet_bouncer` / `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `heave_bouncer` / `storm_caller`. At most one leftover-window bounce CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 12 still lands if no second Septet body. Peer: bounce only if a second sum===7 hostile sits in r4. Above: skip if no second in-window body **and** a Strike would kill the primary.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.15, sr 0.90, res 0.75, init 1.10, chc 1.05. Identity is **two Septet bodies, 24**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "septet_bounce_if_second_sum_eq_7_hostile_in_r4"`. VETERAN: skip bounce-search if isolated. ELITE: Feud Turn a second body into Septet before the search. CHAMPION: never bounce if Strike kills the primary and no second body exists.
- **CORE_SPELL_POOL:** `spell-septet-bounce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Sestet Bounce / Chain Lightning / Inferno as identity
- **SIGNATURE_MECHANICS:** Primary leftover unconstrained. Missing bounce keys → 12 only. Second body leftover 4/2 is **not** a bounce target (Sestet Bounce). Dual Keep 2/2 is the **wrong** second body.
- **VARIANT_PROGRESSION:** BASE 12-or-24 → VETERAN skip-isolated → ELITE manufacture-second → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs two-body leftover packs.
- **SYNERGIES:** `must_septeter`, `feud_turner`, `fuse_binder`
- **WEAKNESSES:** Isolate; sit the second body on 4/2 or 3/3 or 3/2
- **PLAYER_COUNTERPLAY:** Fight one-body; sit the second on 4/2; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-septet-bounce` (ENEMY_DISCOVERY, piece observe — 12-only still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one search + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_septeter`

- **NAME:** Must Septeter
- **ROLE:** controller (non-Strike illegal unless leftover AP + leftover MP === 7 **and** the spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Must Septet (`spell-must-septet`, #1177). Distinct from `must_sesteter` / `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `septet_holder`. **Do not PAIR with Septet Hold.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 7. Peer: lock (4,3) so a 4-cost tool is their last packet, or lock (0,7) so **every** non-Strike is illegal (leftover AP is 0). Above: skip if the only remaining legal verb is Strike and a walk would kill.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.85, sr 1.00, res 1.05, init 0.95, chc 0.70. Identity is **last-packet from a sum of 7**. If it tops the meter, the kit leaked toward Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_septet_if_target_leftover_sum_eq_7_and_has_a_last_packet_spell"`. VETERAN: skip wrong window. ELITE: Septet Hold COURT so they can neither walk nor non-Strike (COURT, not PAIR). CHAMPION: never arm if the only remaining legal verb is Strike and a walk would kill.
- **CORE_SPELL_POOL:** `spell-must-septet`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Hold / Must Sestet / Quiet Hex as identity
- **SIGNATURE_MECHANICS:** Strike stays legal. Walk stays legal unless a Septet Hold is also up. Leftover (4,2) → non-Strike still illegal under **this** lock (Must Sestet’s window). Leftover (0,7) **blocks** every non-Strike. 0-AP tools (Timestep) are not “spending last AP”. Shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is distinguished by `septetSumN`.
- **VARIANT_PROGRESSION:** BASE last-packet lock → VETERAN skip-wrong → ELITE Hold-COURT → CHAMPION no-arm-into-Strike-kill
- **RARITY_CURVE:** Standard. +ELITE vs tool-heavy kits.
- **SYNERGIES:** `septet_holder` (COURT, not PAIR), `feud_turner`, `leash_warden`
- **WEAKNESSES:** Strike; blink; wait 2 turns; dump to 4/2
- **PLAYER_COUNTERPLAY:** Strike; sit 4/2; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-septet` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pre-spend leftover sum + last-AP compare in the cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_septeter`

- **NAME:** Verse Septeter
- **ROLE:** debuffer (last resolved id illegal until leftover AP + leftover MP === 7)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Verse Septet (`spell-verse-septet`, #1177). Distinct from `verse_sesteter` / `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `last_muter` / `summon_verser`. At most one leftover-window verse CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last resolved id, or if they already sit on sum 7 (instant lift — fizzle rider). Peer: lock Inferno until they sit (4,3). Above: skip if Dual Keep 2/2 would lift (it does **not**).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.80. Identity is **which leftover window lifts the last verse**. If it tops the meter, the kit leaked toward Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_septet_if_target_last_id_is_their_win_condition"`. VETERAN: skip no-last-id / already-on-7. ELITE: Cadence Quarte COURT so the locked id is also remaining 0. CHAMPION: never lock Strike (Strike is not a spell id for this key).
- **CORE_SPELL_POOL:** `spell-verse-septet`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the locked id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Verse Sestet / Last Mute / Hex of Silence as identity
- **SIGNATURE_MECHANICS:** Does **not** lift at leftover 0/0, 2/2, 3/3, 3/0, 3/1, 3/2, 4/2, 6/0, or 1/1. Dual Keep **cannot** lift this. Fail closed until `lastResolvedSpellId` exists.
- **VARIANT_PROGRESSION:** BASE last-id lock → VETERAN skip-noop → ELITE Quarte-COURT → CHAMPION no-Strike-lock
- **RARITY_CURVE:** Standard. +ELITE when Cadence Quarterer is already in the pack (COURT).
- **SYNERGIES:** `cadence_quarterer` (COURT, not PAIR), `septet_holder`, `tax_scribe`
- **WEAKNESSES:** Sit on (4,3); recast a different id; wait
- **PLAYER_COUNTERPLAY:** Sit (4,3); recast a different id; Dual Keep does **not** lift this
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-septet` (ENEMY_DISCOVERY, piece observe — fail closed until last-id exists)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (last-id lock + leftover-sum lift)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hook_warder`

- **NAME:** Hook Warder
- **ROLE:** controller / kiter (next walk legal only if `(|dx|,|dy|)` is a permutation of (3,1))
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Hook Stride (`spell-hook-stride`, #1143). Extra room `hook_gallery` — family is **not** that id. Distinct from `tern_warder` (Chebyshev **exactly 3, orthogonal only**), `knight_warder` (**only** `(2,1)`), `ring_warder` (Chebyshev **exactly 2**, knight excluded), `hook_chaplain` (Wave 3 pull), `hook_biter` (this pass, bonus poke). At most one (3,1) walk-lock CORE per pack as PAIR vs Tern / Knight / Ring / Hook Chaplain / Hook Bite.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they must orthogonal-3, knight-step, or step-1 to threaten. Peer: arm only if a (3,1) dest threatens. Above: skip if Root is already up and Strike kills.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.80, init 1.20, chc 0.90. Identity is **eight hook dests**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_hook_3_1"`. VETERAN: skip if they must adjacent-walk. ELITE: Hook Bite COURT after landing a hook cell (COURT, not PAIR). CHAMPION: never arm chargers who only walk adjacent. Does **not** read `currentView`.
- **CORE_SPELL_POOL:** `spell-hook-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Tern Stride / Knight Stride / Hook Bite / Pack Hook as identity
- **SIGNATURE_MECHANICS:** Legal dests are the eight cells `(±3,±1)` and `(±1,±3)`. Orthogonal dests including Tern Stride’s `(±3,0)/(0,±3)`, knight dests `(2,1)`, Chebyshev-3 dests `(3,2)` confirm-fail (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Observation is the **arm**, not the later walk.
- **VARIANT_PROGRESSION:** BASE hook-lock → VETERAN skip-must-adjacent → ELITE Bite-COURT → CHAMPION no-charger-kit
- **RARITY_CURVE:** Standard. +ELITE on open boards with free hook cells.
- **SYNERGIES:** `nona_oather`, `hook_biter` (COURT, not PAIR), `glass_sniper`
- **WEAKNESSES:** Stand at Chebyshev 1, 2, or 4; occupy the eight hook cells; Root before they arm
- **PLAYER_COUNTERPLAY:** Occupy hook cells; Root; stand adjacent
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hook-stride` (MULTI: family observe **or** `hook_gallery` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next-walk dest gate on eight cells)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `nona_oather`

- **NAME:** Nona Oather
- **ROLE:** controller (next non-Strike spell illegal unless Chebyshev = 9)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Nona Oath (`spell-nona-oath`, #1143). Extra room `nona_nave` — family is **not** that id. Distinct from `octa_oather` (exact **8**), `hepta_oather` (exact **7**), `nine_prelate` (occupy-weight 9), `long_oather` (**≥ 3**). At most one exact-9 spell-gate CORE per pack as PAIR vs Octa / Hepta / Hexa / Penta / Quad / Long / Nine Prelate. Do **not** mint `spell-nona-span`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they cannot reach 9 this turn (use Strike). Peer: arm only if a legal 9 exists. Above: skip if Root is already up.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.75, init 1.15, chc 0.85. Identity is **exact-9 spell gate**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_9"`. VETERAN: skip if they cannot reach 9. ELITE: Far Sting as the gated poke. CHAMPION: never fizzle Frost at 8.
- **CORE_SPELL_POOL:** `spell-nona-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if they already sit at 9
- **ELITE_SPELL_POOL:** none — do **not** add Octa Oath / Nine Span / Far Hood as identity
- **SIGNATURE_MECHANICS:** `physical_attack` stays legal at any range. If they arm then walk to 8, the spell fizzles on confirm (AP not spent for the fizzled spell; Nona Oath already observed). Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE exact-9 gate → VETERAN skip-no-9 → ELITE Far-Sting → CHAMPION no-fizzle-at-8
- **RARITY_CURVE:** Standard. +ELITE on long-corridor maps.
- **SYNERGIES:** `hook_warder`, `glass_sniper`, `far_stinger`
- **WEAKNESSES:** Close to 8 or 10; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Close to 8; Root; Strike through the gate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-nona-oath` (MULTI: family observe **or** `nona_nave` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell exact Chebyshev 9)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `slide_reeler`

- **NAME:** Slide Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest painted conveyor occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Slide Reel (`spell-slide-reel`, #1143). Extra room `mill_aisle` — family is **not** that id. Distinct from `mire_reeler` (painted mire), `lava_reeler` (lava), `rime_reeler` (ice), `slide_skipper` (ignore auto-push), `slide_cutter` (this pass, bonus poke), `slide_mason` (Wave 4 conveyor paint). At most one conveyor-attract CORE per pack as PAIR vs Mire / Lava / Rime / Spike / Pit / Slide Skip / Slide Cut / Slide Mason.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no painted conveyor in Chebyshev 6. Peer: pull 1 toward the mill. Above: skip if dest would be `map.portals` (fail closed) or a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.80. Identity is **pull toward the mill**. If it tops the meter, the kit leaked toward Undertow.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "attract_toward_nearest_slide"`. VETERAN: skip empty-conveyor. ELITE: Slide Tile COURT then reel (COURT, not PAIR with Slide Mason). CHAMPION: never dest onto a world portal. **Do not** assign to chargers.
- **CORE_SPELL_POOL:** `spell-slide-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Mire Reel / Slide Cut / Slide Skip / Hook Line / Undertow as identity
- **SIGNATURE_MECHANICS:** Thirteenth `applyAttract` dest flavor. Painted conveyor is Slide Tile occupancy, **not** `HazardTileType` lava/ice/spikes and **not** painted mire. Empty-conveyor fizzle still observes (AP spent). Dest is never Twin Gate pads.
- **VARIANT_PROGRESSION:** BASE mill-pull → VETERAN skip-empty → ELITE Tile-COURT → CHAMPION no-portal-dest
- **RARITY_CURVE:** Standard. +ELITE on mill maps.
- **SYNERGIES:** `slide_cutter` (COURT, not PAIR), `glyph_sower`, `hook_biter`
- **WEAKNESSES:** No painted conveyor; Barrier the pull cell; blink off
- **PLAYER_COUNTERPLAY:** Do not stand on a conveyor approach; Barrier; blink
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-slide-reel` (MULTI: family observe **or** `mill_aisle` first-win — empty-conveyor fizzle still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (`applyAttract` toward nearest painted conveyor; fail closed off portals)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hook_biter`

- **NAME:** Hook Biter
- **ROLE:** bruiser (10 + 8 if share a (3,1) vector)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Hook Bite (`spell-hook-bite`, #1143). Distinct from `diag_biter` / `file_biter` / `rank_biter` / `axis_biter` / `hook_warder` / `hook_chaplain`. At most one (3,1) bonus-poke CORE per pack as PAIR vs Diag / File / Rank / Axis / Hook Warder / Hook Chaplain.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the target is on-rank, on-file, or on-diagonal. Peer: bonus path only on a hook cell. Above: skip if Strike kills.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.00, sr 0.85, res 0.85, init 1.15, chc 1.05. Identity is **18 on a hook cell**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_share_hook_3_1_with_caster"`. VETERAN: skip bonus off-hook (10 still). ELITE: Hook Stride COURT onto a hook cell (COURT, not PAIR). CHAMPION: never bonus-poke if Strike kills.
- **CORE_SPELL_POOL:** `spell-hook-bite`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-venom-strike`
- **ELITE_SPELL_POOL:** none — do **not** add Diag Bite / File Bite / Hook Stride / Knight Pierce as identity
- **SIGNATURE_MECHANICS:** Shared rank only, shared file only, shared diagonal, knight `(2,1)`, and `(3,2)` are 10. Off-hook still observes. Extra 8 is a **second** existing `dealDamage` call.
- **VARIANT_PROGRESSION:** BASE hook-poke → VETERAN skip-bonus-off-hook → ELITE Stride-COURT → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Hook Warder is already in the pack (COURT).
- **SYNERGIES:** `hook_warder` (COURT, not PAIR), `slide_reeler`, `shadow_lurker`
- **WEAKNESSES:** Stand on the caster’s rank, file, or diagonal; Barrier the hook cells
- **PLAYER_COUNTERPLAY:** Stand on-rank; Barrier; sit adjacent
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hook-bite` (ENEMY_DISCOVERY, piece observe — off-hook still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (geometry gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `idle_marker`

- **NAME:** Idle Marker
- **ROLE:** hazard creator (cell detonates at turn end if leftover MP equals max)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Idle Mark (`spell-idle-mark`, #1143). Extra room `idle_pulpit` — family is **not** that id. Distinct from `dwell_marker` (any end-turn occupy), `wake_marker` (start-of-turn), `summon_marker` (spawn onto), `last_marker` (last leftover AP), `idle_plater` (this pass, leftover-MP-equals-max **miss**). At most one leftover-MP-equals-max terrain CORE per pack as PAIR vs Dwell / Wake / Summon / Last / Idle Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the occupant will walk. Peer: paint the camp cell. Above: skip if they will spend last AP.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 1.00, res 0.85, init 1.00, chc 0.75. Identity is **they must not walk**. If it tops the meter, the kit leaked toward Dwell Mark.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_turn_end_leftover_mp_equals_max"`. VETERAN: skip if they will walk. ELITE: Root / Brick Hold COURT so they cannot walk. CHAMPION: never detonate on a unit that walked.
- **CORE_SPELL_POOL:** `spell-idle-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-barrier`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Dwell Mark / Idle Plate / Wake Mark as identity
- **SIGNATURE_MECHANICS:** Walk enter, Strike-from, last-AP spend, summon spawn, teleport/swap landing, and end-turn occupy with leftover MP < max do **not** detonate. Observation is the **paint**. Detonate does not second-observe.
- **VARIANT_PROGRESSION:** BASE idle-mine → VETERAN skip-will-walk → ELITE Root-COURT → CHAMPION no-walk-detonate
- **RARITY_CURVE:** Standard. +ELITE vs rooted casters.
- **SYNERGIES:** `thin_plater`, `plate_warden`, `brick_holder`
- **WEAKNESSES:** Walk one tile; spawn off the cell; Barrier last-writer
- **PLAYER_COUNTERPLAY:** Walk one tile; blink; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-idle-mark` (MULTI: family observe **or** `idle_pulpit` first-win — paint observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (painted cell + end-turn leftover-MP-equals-max gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `thin_plater`

- **NAME:** Thin Plater
- **ROLE:** protector (next hit is 0 while leftover AP === 1 AND leftover MP === 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Thin Plate (`spell-thin-plate`, #1143). Distinct from `prime_plater` (leftover **1/1**), `dual_plater` (both even ≥ 2), `dry_plater` (leftover MP = 0, any AP), `thin_gaiter` (leftover **1/0 damage**), `idle_plater` (this pass, leftover MP equals max), `thin_warder` (Wave 9). At most one leftover-1/0 miss CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover is not 1/0. Peer: arm only while sitting (1,0). Above: refuse if leftover is 1/1 (Prime Plate) or leftover MP equals max (Idle Plate).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **holding leftover 1/0**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_eq_1_and_mp_eq_0"`. VETERAN: skip wrong window. ELITE: Thin Gait COURT on the same leftover window (damage, not negate — COURT, not PAIR). CHAMPION: never become Prime Plate on a failed 1/0.
- **CORE_SPELL_POOL:** `spell-thin-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Prime Plate / Dual Plate / Dry Plate / Thin Gait / Idle Plate as identity
- **SIGNATURE_MECHANICS:** Hit while leftover is not 1/0 deals full and leaves the charge. Dual Keep 1/0 **is** this window if it survives. 1/1 is Prime Plate. 0/0 is Gaunt.
- **VARIANT_PROGRESSION:** BASE 1/0-miss → VETERAN skip-wrong → ELITE Gait-COURT → CHAMPION no-prime-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `idle_marker`, `plate_warden`, `thin_gaiter` (COURT, not PAIR)
- **WEAKNESSES:** Hit them after they walk or after they spend the last AP; wait the charge out
- **PLAYER_COUNTERPLAY:** Force a walk; spend the last AP; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-thin-plate` (ENEMY_DISCOVERY, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover 1/0 at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brier_skipper`

- **NAME:** Brier Skipper
- **ROLE:** kiter (next walk of pathLength exactly 2 ignores Thorned Ground extra)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Brier Skip (`spell-brier-skip`, #1143). Extra room `brier_nave` — family is **not** that id. Distinct from `slide_skipper` (conveyor auto-push, length 1), `rift_skipper` (Void Rift tax), `mire_skipper` (mire enter-tax), `shock_skipper` / `spike_skipper` / `rime_skipper` / `glyph_skipper`. At most one Thorned-Ground skip CORE per pack as PAIR vs those. Thorned Ground is a **live map modifier**, not occupancy and not a new `HazardTileType`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if Thorned Ground is not active or they only need a 1-tile walk. Peer: arm only on Thorned Ground maps when a length-2 dest threatens. Above: skip if Root is already up.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.85, res 0.70, init 1.25, chc 1.00. Identity is **length-2 Thorned skip**. If it tops the meter, the kit leaked toward Ghost Step.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "skip_thorned_ground_on_path_length_2"`. VETERAN: skip if Thorned Ground is not active. ELITE: Split Pace after they skip the extra. CHAMPION: never become a universal hazard skip.
- **CORE_SPELL_POOL:** `spell-brier-skip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Slide Skip / Rift Skip / Ghost Step as identity
- **SIGNATURE_MECHANICS:** PathLength 1 already deals 0 (`thornedGroundWalkDamage(1) === 0`). PathLength ≥ 3 still pays. Lava / spike / ice leave-tax / glyph-tax / Void Rift / conveyor auto-push still tick. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE length-2 skip → VETERAN skip-no-thorns → ELITE Split-Pace → CHAMPION no-universal-skip
- **RARITY_CURVE:** Standard. +ELITE on Thorned Ground maps. Never CHAMPION off that modifier.
- **SYNERGIES:** `wide_stinger`, `tide_shade`, `plague_rat`
- **WEAKNESSES:** Force a length-3+ walk; Root; stand so length 2 is not a threat
- **PLAYER_COUNTERPLAY:** Root; stand so length 2 is not a threat; wait the stance
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brier-skip` (MULTI: family observe **or** `brier_nave` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (pathLength 2 + Thorned Ground extra skip; fail closed off other hazards)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wide_stinger`

- **NAME:** Wide Stinger
- **ROLE:** assassin (10 + 8 iff leftover AP ≥ 2 AND leftover MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Wide Sting (`spell-wide-sting`, #1143). Distinct from `thin_gaiter` (leftover **1/0**), `prime_gaiter` (this pass, leftover **1/1**), `capped_stinger` (leftover MP equals max), `fresh_stinger` (leftover AP equals max), `septet_stinger` (sum === 7), `wide_gifter` (this pass, heal on the same leftover window). At most one leftover-AP≥2-and-MP≥1 poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover is 1/0 or 1/1. Peer: bonus path on Dual Keep 2/2 or any fat leftover. Above: skip if leftover is 1/0 (Thin Gait) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **poking a fat leftover**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_ge_2_and_mp_ge_1"`. VETERAN: skip bonus off-window (10 still). ELITE: Wide Gift COURT on the same leftover window (COURT, not PAIR). CHAMPION: never also fire Even Sting’s rider.
- **CORE_SPELL_POOL:** `spell-wide-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Thin Gait / Prime Gait / Wide Gift / Even Sting / Septet Sting as identity
- **SIGNATURE_MECHANICS:** Leftover 1/0, 1/1, 2/0, 0/≥1 are 10. Dual Keep 2/2 **is** this window. Off-window still observes.
- **VARIANT_PROGRESSION:** BASE fat-poke → VETERAN skip-bonus-off-window → ELITE Gift-COURT → CHAMPION no-even-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep kits.
- **SYNERGIES:** `wide_gifter` (COURT, not PAIR), `brier_skipper`, `tempo_precentor`
- **WEAKNESSES:** Spend down to 1 AP or 0 MP before the poke; Barrier
- **PLAYER_COUNTERPLAY:** Spend to 1/0; sit Dual Keep and accept the 18; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wide-sting` (ENEMY_DISCOVERY, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP≥2 and MP≥1 gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hook_taxer`

- **NAME:** Hook Taxer
- **ROLE:** anti-summon (allied summons pay +1 AP if this turn’s walk landing is a (3,1) from origin)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. CORE is Summon Hook (`spell-summon-hook`, #1143). Distinct from `summon_orther` (per **diagonal step**), `summon_filer` (walk **off file**), `summon_toller` (+1 AP to start **any** walk), `hook_warder` / `hook_biter` / `hook_chaplain`, Pack Hook (`ENEMY_ONLY` hard lock). **Do not PAIR with Summon Orth / Summon File / Summon Toll.** Do **not** name it `summon_hooker`. At most one (3,1) pet-tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack is already (3,1)-locked (Pack Hook) or Chebyshev-2-locked (Pack Ring). Peer: arm only if living allied summons exist. Above: skip if Kennel Lock already keeps pets at Chebyshev 1.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 0.95, init 0.95, chc 0.70. Identity is **tax a 3-MP hook landing**. If it tops the meter, the kit leaked toward Kennel Lock.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "summon_walk_hook_3_1_ap_tax"`. VETERAN: skip if no living pets. ELITE: Hook Stride COURT on a different body (COURT, not PAIR). CHAMPION: never become Pack Hook.
- **CORE_SPELL_POOL:** `spell-summon-hook`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Orth / Pack Hook / Summon Toll / Kennel Lock as identity
- **SIGNATURE_MECHANICS:** Chebyshev-1 steps along the path are uncharged. Player-side pets pay the tax too while the aura is up. Observation is the **arm**. Pet walks do not second-observe. Orthogonal 1-steps are free of this tax.
- **VARIANT_PROGRESSION:** BASE pet-hook-tax → VETERAN skip-no-pets → ELITE Stride-COURT → CHAMPION no-pack-clone
- **RARITY_CURVE:** Standard. +ELITE vs pet-heavy kits.
- **SYNERGIES:** `idle_plater` (COURT, not PAIR), `brood_chanter` (COURT, not PAIR), `hook_warder` (COURT, not PAIR)
- **WEAKNESSES:** Walk pets in orthogonal 1-steps; Kennel Lock so they never land (3,1)
- **PLAYER_COUNTERPLAY:** Walk pets adjacent; Kennel Lock; kill the taxer first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-hook` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pet walk-landing (3,1) AP tax; fail closed as Pack Hook)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wide_gifter`

- **NAME:** Wide Gifter
- **ROLE:** healer (heal 8 iff leftover AP ≥ 2 AND leftover MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Wide Gift (`spell-wide-gift`, #1143). No extra door. Distinct from `gait_gifter` (AP≥2 and MP=0), `lean_gifter` (AP=0 and MP≥1), `prime_gifter` (exactly 1/1), `septet_mender` (this pass, both leftover **sum === 7**), `sestet_mender` / `stave_mender` / `equal_gifter` / `gaunt_mender` / `hollow_gifter`. Healer CORE only. At most one leftover-AP≥2-and-MP≥1 heal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover is AP≥2/MP=0 (Gait Gift) or 1/1 (Prime Gift). Peer: Wide Gift only if leftover AP ≥ 2 **and** leftover MP ≥ 1 **and** missing HP ≥ 8. Above: Dual Keep 2/2 **is** this window — heal it; refuse if a Strike from this body would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.15, chc 0.70. Identity is **healing a fat leftover**. If it tops the meter, the kit leaked toward Frost. Dual Keep 2/2 **is** Wide Gift **and** Poise **and** Dual Plate.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_ge_2_and_mp_ge_1"`. VETERAN: skip Gait Gift / Prime Gift windows. ELITE: Wide Sting COURT on the same leftover window (COURT, not PAIR). CHAMPION: refuse if a Strike would kill. **Do not** assign to non-healer CORE. `healAmount` stays 0 on the Wide Gift row.
- **CORE_SPELL_POOL:** `spell-wide-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Gait Gift / Prime Gift / Septet Mend / Sestet Mend / Lean Gift as identity
- **SIGNATURE_MECHANICS:** One-body gate. (4,3) is Wide Gift **and** a Septet pair — Septet still needs **both** bodies. Off-window fizzle still observes. Player-side HP actually increased → `challengeHealUsedRef`.
- **VARIANT_PROGRESSION:** BASE fat-heal → VETERAN skip-gait-or-prime → ELITE Sting-COURT → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Dual Keep / Tempo Gift is already in the pack (COURT).
- **SYNERGIES:** `wide_stinger` (COURT, not PAIR), `font_cantor`, `tempo_precentor`
- **WEAKNESSES:** Spend the target to 1 AP or 0 MP before the cast; Mute Thread
- **PLAYER_COUNTERPLAY:** Spend to 1/0; Mute Thread; kill the cantor first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wide-gift` (ELITE, piece observe — off-window fizzle still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one leftover AP≥2 and MP≥1 read + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_quadder`

- **NAME:** Cadence Quadder
- **ROLE:** controller (remaining CDs `n>4` → `4`; 0/1/2/3/4 unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Quad (`spell-cadence-quad`, #1143). No extra door — observe via `cadence_thief` / `hex_chorister`. Distinct from `cadence_quarterer` (this pass, `n===4` → **0**), `cadence_terner` (`n>3` → **3**), `cadence_capper` (`n>2` → **2**), Floor (`n>1` → 1), `quad_oather` (spell gate exactly 4), `quad_prelate` (occupy-weight 4). At most one remaining-n>4-to-4 rewrite CORE per pack as PAIR vs Quarte / Tern / Tierce / Dock / Snuff / Cap / Floor / Quad Oath / Quad Prelate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if all remaining are 0/1/2/3/4. Peer: Quad only if a nuke remaining is 5+. Above: refuse if a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **capping long CDs to 4**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cap_remaining_cds_gt_4_to_4"`. VETERAN: skip all-already-≤4. ELITE: Cadence Stall COURT first so a 3 becomes >4 then Quad caps it (COURT, not PAIR with Staller). CHAMPION: never Quad a bar you will Quarte the same turn (Quarte is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-quad`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the capped id is already remaining 4
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Quarte / Tern / Cap / Floor / Stall as identity
- **SIGNATURE_MECHANICS:** Fours stay 4. Threes stay 3. Observation is the **arm**. Do **not** restamp `floor_precentor` / `quarte_precentor`.
- **VARIANT_PROGRESSION:** BASE cap-to-4 → VETERAN skip-already-≤4 → ELITE Stall-COURT → CHAMPION no-same-turn-Quarte
- **RARITY_CURVE:** Standard. +ELITE when Cadence Quarterer is already in the pack (COURT).
- **SYNERGIES:** `cadence_quarterer` (COURT, not PAIR), `verse_septeter`, `cadence_thief`
- **WEAKNESSES:** Hold remaining CDs at 4 or below; Paper Wind
- **PLAYER_COUNTERPLAY:** Recast before Quad; sit remaining at 4; Paper Wind
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-quad` (ENEMY_DISCOVERY, piece observe **or** `cadence_thief` / `hex_chorister` G≥18 extras — first child wins; do **not** restamp `floor_precentor`)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 4 when n>4)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `even_toller`

- **NAME:** Even Toller
- **ROLE:** controller (next walk +1 AP if leftover AP is even ≥ 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Even Toll (`spell-even-toll`, #1143). Distinct from `odd_toller` (leftover **AP odd**), `gait_toller` (leftover **MP = 0**), `still_toller` (next **spell** if leftover MP = 0), `walk_toller` (ungated), `even_gaiter` (damage if leftover MP even ≥ 2). **Do not PAIR with Odd Toll.** Not `spell.mpCost`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP is odd or 0/1. Peer: tax the next walk at leftover 2/4/6. Above: skip if leftover AP odd (Odd Toll’s window) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.05, sr 1.00, res 0.85, init 1.10, chc 0.80. Identity is **+1 AP on a fat leftover walk**. If it tops the meter, the kit leaked toward Ley Toll.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tax_next_walk_if_leftover_ap_even_ge_2"`. VETERAN: skip leftover AP odd. ELITE: Tempo Gift COURT so they hold even AP. CHAMPION: never become Odd Toll on a failed even-tax.
- **CORE_SPELL_POOL:** `spell-even-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Odd Toll / Gait Toll / Ley Toll as identity
- **SIGNATURE_MECHANICS:** Leftover AP odd or 0/1 fizzles the tax (Even Toll already observed). Dual Keep 2/2 **is** this window.
- **VARIANT_PROGRESSION:** BASE even-walk-tax → VETERAN skip-odd → ELITE Tempo-COURT → CHAMPION no-odd-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep walkers.
- **SYNERGIES:** `brick_feer`, `stone_castellan`, `tempo_precentor`
- **WEAKNESSES:** Spend to odd leftover AP before walking; Root so they do not walk
- **PLAYER_COUNTERPLAY:** Spend to odd AP; Root; sit 1 leftover AP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-even-toll` (ENEMY_DISCOVERY, piece observe — off-window fizzle still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk +1 AP if leftover AP even ≥ 2; not `spell.mpCost`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_feer`

- **NAME:** Brick Feer
- **ROLE:** controller (next non-Strike spell +1 AP while adjacent to a barrier)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Brick Fee (`spell-brick-fee`, #1143). Distinct from `brick_taxer` (next **walk** +1 AP), `brick_holder` (**forbids** the walk), `brick_bracer` (negate a **hit**), `watch_taxer` (overwatch next-spell +1 AP), `watch_feer` (Wave 12), Quiet Hex (ungated next-spell tax). At most one barrier-adjacent **spell** tax CORE per pack as PAIR vs those. Not `spell.mpCost`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no barrier. Peer: tax the next spell while they camp a corner. Above: skip if they will Strike (untaxed) and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.80, sr 1.05, res 1.15, init 0.90, chc 0.65. Identity is **taxing a cornered caster**. If it tops the meter, the kit leaked toward Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "tax_next_spell_if_adjacent_barrier"`. VETERAN: skip if no barrier. ELITE: Barrier drop adjacent to them. CHAMPION: never become Quiet Hex or Brick Tax.
- **CORE_SPELL_POOL:** `spell-brick-fee`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-barrier`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Brick Tax / Quiet Hex / Watch Tax as identity
- **SIGNATURE_MECHANICS:** Strike / `physical_attack` stays untaxed. No adjacent barrier fizzles the tax (Brick Fee already observed). Destroy the barrier and the tax drops; lock **stays** until duration.
- **VARIANT_PROGRESSION:** BASE corner-spell-tax → VETERAN skip-no-barrier → ELITE Barrier-drop → CHAMPION no-hex-clone
- **RARITY_CURVE:** Standard. +ELITE on barrier maps.
- **SYNERGIES:** `even_toller`, `stone_castellan`, `rime_mason`
- **WEAKNESSES:** Step off the barrier before casting; Strike instead; Paper Wind
- **PLAYER_COUNTERPLAY:** Step off; Strike; Paper Wind
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-fee` (ENEMY_DISCOVERY, piece observe — empty-barrier fizzle still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell +1 AP while adjacent to a barrier; Strike exempt; not `spell.mpCost`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_binder`

- **NAME:** Watch Binder
- **ROLE:** sniper (overwatch snap forbids the walker’s next walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Watch Bind (`spell-watch-bind`, #1143). Distinct from `watch_taxer` (next **spell** +1 AP), `watch_rooter` (zeros leftover **MP now**), `watch_drainer` (steals 1 leftover MP), `pair_binder` / `fuse_binder`, Brick Hold (cannot walk **while adjacent to a barrier**). **Do not PAIR with Watch Tax / Watch Root / Watch Drain.** Not `spell.mpCost`. Does **not** add an evasion roll.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they should lose leftover MP now (Watch Root) or pay next-spell AP (Watch Tax). Peer: paint the choke cell. Above: skip if they will blink / swap instead of walking.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.75, init 1.20, chc 0.90. Identity is **forbidding the next walk after a snap**. If it tops the meter, the kit leaked toward Far Watch.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "overwatch_snap_forbid_walker_next_walk"`. VETERAN: skip if they will not enter. ELITE: Far Watch covering the cell. CHAMPION: never become Watch Root or Brick Hold.
- **CORE_SPELL_POOL:** `spell-watch-bind`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the snap already landed
- **ELITE_SPELL_POOL:** none — do **not** add Watch Tax / Watch Root / Brick Hold as identity
- **SIGNATURE_MECHANICS:** Snap consumes the paint. Observation is the **arm**. The snap is not a second observe. Send a pet to eat the snap.
- **VARIANT_PROGRESSION:** BASE snap-lock → VETERAN skip-will-not-enter → ELITE Far-Watch → CHAMPION no-root-clone
- **RARITY_CURVE:** Standard. +ELITE on choke maps.
- **SYNERGIES:** `prime_gaiter`, `glass_sniper` (COURT, not PAIR), `hood_lurker`
- **WEAKNESSES:** Do not enter the cell; blink / swap instead of walking; send a pet
- **PLAYER_COUNTERPLAY:** Do not enter; blink; send a pet
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-bind` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (overwatch paint + snap forbids next walk; fail closed as Watch Root)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `prime_gaiter`

- **NAME:** Prime Gaiter
- **ROLE:** assassin (10 + 8 iff leftover AP === 1 AND leftover MP === 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Prime Gait (`spell-prime-gait`, #1143). Distinct from `thin_gaiter` (leftover **1/0**), `wide_stinger` (this pass, leftover **AP≥2 AND MP≥1**), `prime_gifter` / `prime_plater` (**1/1** heal / miss), `cadence_primer` (remaining `0→1`), `even_gaiter` / `odd_gaiter`. At most one leftover-1/1 poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover is 1/0 or AP≥2/MP≥1. Peer: bonus path only on (1,1). Above: skip if leftover is 1/0 (Thin Gait) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **poking leftover 1/1**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_1_and_mp_eq_1"`. VETERAN: skip bonus off-window (10 still). ELITE: Prime Plate / Prime Gift COURT on the same leftover window (do **not** CORE all three on one kit — COURT later). CHAMPION: never also fire Thin Gait’s rider.
- **CORE_SPELL_POOL:** `spell-prime-gait`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Thin Gait / Wide Sting / Prime Gift / Prime Plate as identity
- **SIGNATURE_MECHANICS:** Leftover 1/0, 2/0, 0/1, and 2/2 are 10. Dual Keep 1/1 **is** this window if it survives. Off-window still observes.
- **VARIANT_PROGRESSION:** BASE 1/1-poke → VETERAN skip-bonus-off-window → ELITE Plate-COURT → CHAMPION no-thin-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep 1/1 kits.
- **SYNERGIES:** `watch_binder`, `prime_plater` (COURT, not PAIR), `prime_gifter` (COURT, not PAIR)
- **WEAKNESSES:** Spend the last AP or the last MP before the poke; Barrier
- **PLAYER_COUNTERPLAY:** Spend the last AP; sit 1/0; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-prime-gait` (ENEMY_DISCOVERY, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover 1/1 gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `slide_cutter`

- **NAME:** Slide Cutter
- **ROLE:** assassin (10 + 8 if target is Chebyshev ≤ 2 from painted conveyor occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Slide Cut (`spell-slide-cut`, #1143). Distinct from `lava_cutter` (lava occupancy), `rime_cutter` (ice), `spike_cutter` (spikes), `hazard_cutter` (painted hazard), `portal_cutter` (world portals), `slide_reeler` (this pass, pull), `slide_skipper` (ignore auto-push), `slide_mason` (Wave 4). At most one conveyor-threshold poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no painted conveyor in radius 2. Peer: bonus path only near the mill. Above: skip if dest/bonus would count Twin Gate pads (fail closed).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **18 next to a mill**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_near_slide_occupancy"`. VETERAN: skip bonus off-mill (10 still). ELITE: Slide Tile then Slide Cut; Slide Reel COURT onto the mill then Cut (COURT, not PAIR). CHAMPION: never dest/bonus off world portals.
- **CORE_SPELL_POOL:** `spell-slide-cut`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Lava Cut / Slide Reel / Slide Skip / Hazard Cut as identity
- **SIGNATURE_MECHANICS:** Twin Gate pads, `map.portals`, live lava/ice/spikes, and painted mire do **not** count. Off-mill still observes.
- **VARIANT_PROGRESSION:** BASE mill-poke → VETERAN skip-bonus-off-mill → ELITE Reel-COURT → CHAMPION no-portal-bonus
- **RARITY_CURVE:** Standard. +ELITE on mill maps.
- **SYNERGIES:** `slide_reeler` (COURT, not PAIR), `hook_taxer`, `glyph_sower`
- **WEAKNESSES:** Step off the mill; blink; Barrier the conveyor
- **PLAYER_COUNTERPLAY:** Step off; blink; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-slide-cut` (ELITE, piece observe — off-mill still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev ≤ 2 from painted conveyor + second `dealDamage`; fail closed off portals)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `idle_plater`

- **NAME:** Idle Plater
- **ROLE:** protector (next hit is 0 while leftover MP equals max)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Idle Plate (`spell-idle-plate`, #1143). Distinct from `thin_plater` (this pass, leftover **1/0**), `dry_plater` (leftover **MP = 0**), `prime_plater` (leftover **1/1**), `capped_stinger` (damage bonus on leftover MP equals max), `cast_plater` (outgoing non-Strike deals 0), `idle_marker` (this pass, cell detonate). At most one leftover-MP-equals-max miss CORE per pack as PAIR vs those. **Do not PAIR with Hook Taxer.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover MP = 0 (Dry Plate) or leftover 1/0 (Thin Plate). Peer: arm only while leftover MP equals max (they have **not walked**). Above: skip if they will walk first.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **negating a hit because they have not walked**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_mp_equals_max"`. VETERAN: skip if leftover MP < max. ELITE: Idle Mark COURT so a rooted non-walker eats both (COURT, not PAIR). CHAMPION: never become Dry Plate or Capped Sting.
- **CORE_SPELL_POOL:** `spell-idle-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Thin Plate / Dry Plate / Idle Mark / Capped Sting as identity
- **SIGNATURE_MECHANICS:** Walking (leftover MP < max) drops the window; the charge remains until a hit or expiry. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE idle-miss → VETERAN skip-already-walked → ELITE Mark-COURT → CHAMPION no-dry-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits that cannot force a walk.
- **SYNERGIES:** `idle_marker` (COURT, not PAIR), `plate_warden`, `hook_taxer` (COURT, not PAIR)
- **WEAKNESSES:** Force a walk first; wait the charge out
- **PLAYER_COUNTERPLAY:** Force a walk; wait; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-idle-plate` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover MP equals max at impact)
- **STATUS:** PROPOSED

---

## 5. Relative scaling (no cap)

`pickEnemyLevelFromTiers` already raises the chance of near / equal / above-player enemies as the player climbs (`combatMath.ts` 54–107). This pass does **not** retune those percents. The `floor(999 / ts)` rail is spawn-math, not a content cap. Variant floors (BASE 1 / VETERAN 3 / ELITE 6 / CHAMPION 8) sit **on top of** `computeAITier`, which still plateaus at label 10 then 30% noise — that plateau is a **label**, not a last enemy. `G = floor(max(0, R) / T)` is unbounded. Wave 20 CORE rows stamp `generationMin: 18` on unique SDE verbs and inherit #1177’s Wave-19 tactical generation. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`. **Still the same family.**

Higher `R` does **not** mean “more HP.” It means: smarter skip predicates, one extra ADVANCED ∪ RARE ∪ ELITE slot, higher variant weight, denser synergy packs. A level-400 Septet Mender is still a four-read healer. A level-400 Hook Warder is still a (3,1) walk lock.

---

## 6. Implementation prerequisites (not new families)

Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec/Hendeca/Dodeca/Trideca/**Tetradeca** cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / Score Post `scorepost` / Hendeca Span `hendecaspan` / Stave Post `stavepost` / Dodeca Span `dodecaspan` / Sestet Post `sestetpost` / Trideca Span `tridecaspan` / **Septet Post `septetpost`** / **Tetradeca Span `tetradecaspan`** / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 7. Next run (Wave 21)

Do not re-propose Waves 1–20 ids unless evolving them; re-check implementation. Wave 21 consumes leftover SDE Wave 19 unique CORE (`spell-camel-stride` … except Pack Camel / Camel Fold unless a boss sheet claims them) plus SPELL_PROPOSALS Wave 20 if that catalog opens. Extra doors for Pack Camel / Camel Fold stay `camel_precentor` / `camel_fold_regent` (SDE #1198). Extra rooms for #1198 unique CORE stay that catalog’s teach rooms. Do not mint `wave20:` spell ids. Cadence Floor is SDE-owned — do not mint `cadence_floorer`. Cadence Prime owns remaining `0→1` — do not mint `spell-cadence-arm`. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) are Wave 17. Cadence Dock (`2→0`) and Cadence Cap (`n>2→2`) are Wave 18. Cadence Tern (`n>3→3`) and Cadence Tierce (`3→0`) are Wave 19. Cadence Quad (`n>4→4`) and Cadence Quarte (`4→0`) are this pass. Cadence Quint (`n>5→5`) is SDE Wave 19 — Wave 21 CORE; **do not name it `cadence_quadder` or `cadence_quarterer`**. Tetradeca Span filled fourteen-cell occupy — do not mint `spell-fifteen-span` until a later tactical catalog claims it. Prime Gift owns leftover 1/1 heal. Gait Gift owns leftover AP≥2/MP=0 heal. Wide Gift owns leftover AP≥2/MP≥1 heal. Thin Gift (leftover **1/0** heal) is SDE Wave 19 — Wave 21. Dual Plate owns leftover AP even≥2 AND leftover MP even≥2 miss. Prime Plate owns leftover 1/1 miss. Thin Plate owns leftover 1/0 miss. Idle Plate owns leftover-MP-equals-max miss. Psalm Turn owns mixed-side invert (caster stays). Feud Turn owns caster+hostile invert. Hold mid-RAF splice, fourth mpCost walk snipe, player-owned Hex of Silence, sixth echo, leftover AP − leftover MP === 2 as `spell-skew-*`. `spell-pack-ring` / `spell-lane-fold` / `spell-pack-hook` / `spell-hook-fold` / `spell-pack-camel` / `spell-camel-fold` stay never-owned unless a boss sheet claims them. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. Do not ship `spell-parched-mend` beside Dry Gait. Do not mint `spell-sestet-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-septet-gift` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-octa-span` / `spell-nona-span` / `spell-mixed-turn` / `spell-cadence-trey` / `cadence_quarter` / `summon_hooker`. Same-day 2026-10-28 SPELL_PROPOSALS / SDE had **not** opened a PR at authoring; if they later claim a unique leftover, **SDE wins** and stamps as Wave **21** family CORE.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `septet_mender` | healer | `spell-septet-mend` | `septet_cantor` |
| `cadence_quarterer` | controller | `spell-cadence-quarte` | `quarte_precentor` |
| `tetradeca_prelate` | summoner | `spell-tetradeca-span` | `span_tetradeca` (`summonAI: "tetradecaspan"`) |
| `feud_turner` | controller | `spell-feud-turn` | — |
| `septet_hooder` | protector | `spell-septet-hood` | — |
| `septet_stinger` | assassin | `spell-septet-sting` | — |
| `septet_stepper` | teleporter | `spell-septet-step` | — |
| `septet_siller` | hazard creator | `spell-septet-sill` | — |
| `septet_holder` | controller | `spell-septet-hold` | — |
| `septet_lender` | buffer | `spell-septet-lend` | — |
| `septet_sipper` | debuffer | `spell-septet-sip` | — |
| `septet_prelate` | summoner | `spell-septet-post` | — (`summonAI: "septetpost"`) |
| `septet_bouncer` | artillery | `spell-septet-bounce` | — |
| `must_septeter` | controller | `spell-must-septet` | — |
| `verse_septeter` | debuffer | `spell-verse-septet` | — |
| `hook_warder` | controller / kiter | `spell-hook-stride` | `hook_gallery` |
| `nona_oather` | controller | `spell-nona-oath` | `nona_nave` |
| `slide_reeler` | displacement | `spell-slide-reel` | `mill_aisle` |
| `hook_biter` | bruiser | `spell-hook-bite` | — |
| `idle_marker` | hazard creator | `spell-idle-mark` | `idle_pulpit` |
| `thin_plater` | protector | `spell-thin-plate` | — |
| `brier_skipper` | kiter | `spell-brier-skip` | `brier_nave` |
| `wide_stinger` | assassin | `spell-wide-sting` | — |
| `hook_taxer` | anti-summon | `spell-summon-hook` | — |
| `wide_gifter` | healer | `spell-wide-gift` | — |
| `cadence_quadder` | controller | `spell-cadence-quad` | — (observe `cadence_thief` / `hex_chorister`) |
| `even_toller` | controller | `spell-even-toll` | — |
| `brick_feer` | controller | `spell-brick-fee` | — |
| `watch_binder` | sniper | `spell-watch-bind` | — |
| `prime_gaiter` | assassin | `spell-prime-gait` | — |
| `slide_cutter` | assassin | `spell-slide-cut` | — |
| `idle_plater` | protector | `spell-idle-plate` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Quarte / Pack Hook / Hook Fold stay kit-only.

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–19 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `cadence_quarter` / `summon_hooker` / `wave20:` colliding ids.
- No restamp of `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent` as family ids.
- Same-day SDE Wave 19 (#1198) was not cloned; it stamps as Wave **21** family CORE.

All **32** sheets: **STATUS: PROPOSED**.

# Enemy and Elite Evolution Design — Wave 21

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-29  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Twenty-first daily pass. **32** new world-pack families that consume **SDE Wave 19 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`, open PR #1198) **except** Pack Camel / Camel Fold, plus **SPELL_PROPOSALS Wave 20 verbs** (`SPELL_PROPOSALS_2026-10-28.md`, open PR #1251) **except** Court Quinte (`NOT_PLAYER_LEARNABLE`). Cadence Floor remains **SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Cadence Quint (`n>5` → `5`) is this pass’s SDE CORE; Cadence Quinte (`n===5` → `0`) is this pass’s **other** remaining rewrite — **not** the same family (`cadence_quinter` vs `cadence_quintrer`). Thin Gift (one-body leftover **AP === 1 AND MP === 0**) is this pass’s SDE CORE, not Thin Gait / Thin Plate. Camel Stride (next walk permutation of **(3,2)**) is this pass’s SDE CORE, not Hook Stride **(3,1)**. Pentadeca Span (stretched plus longArm **4** / shortArm **3**, counts as **fifteen**, **center click**) is this pass’s occupy card. SDE Wave 20 unique CORE (`spell-giraffe-stride` … `spell-giraffe-fold`, open PR #1255) stays extras until Wave 22. Bosses stay on the existing catalog.

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
- [`ENEMY_ELITE_EVOLUTION_2026-10-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-progression-d76a/docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-28.md) (Wave 20, 32 family sheets — open PR #1248; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 20

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–20. Wave 20 closed as docs in the 2026-10-28 pass (PR #1248). SPELL_PROPOSALS Wave 20 (#1251) **did** open after Wave 20 authored — stamp as this pass’s tactical CORE (**do not clone**). SDE Wave 19 (#1198) unique leftover (`spell-camel-stride` … `spell-camel-fold`) stamps as this pass’s SDE CORE (**SDE wins** unique leftover collisions). Same-day 2026-10-29 SPELL_PROPOSALS / SDE catalogs had **not** opened a PR at authoring. Sibling 2026-10-29 docs that **did** open (#1285 world-dynamics Wave 21, #1287 expansion catalog, #1291 spell/discovery/achievement admin re-audit) are **not** unique leftover catalogs — do not stamp them as family CORE. SDE Wave 20 (#1255: Giraffe / Undeca / Trip / Skew / Deep / Pair / Sext) stays **Wave 22** family CORE. This pass consumes **#1198** unique CORE (minus Pack Camel / Camel Fold) plus **#1251** (minus Court Quinte). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥19 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`) at `src/frontend/src/components/WorldExploration.tsx`. Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 20 claim | 2026-10-29 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–20 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186; `res` is an integer roll) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16821; void 25% reflect (`castHelpers.ts` 335–337) | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 72–84) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / Tally / Score / Stave / Sestet / Septet / **Octave** Post count as **1**. Triple = 3 … Tetradeca Span = 14. **Pentadeca Span = 15** — skip Pentadeca until remaining cap ≥ 15 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Octave Mend / Thin Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `pentadecaspan` / `octavepost` (and still no `tetradecaspan` / `septetpost` / `tridecaspan` / `sestetpost` / `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938; overworld **draw** WX 8067. **Unread as a combat gate.** | Facing families still fail closed. Wave 21 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 21 CORE rows stay `mpCost: 0`. Octave Lend / Octave Sip / Kin Turn / Prime Toll / Brick Levy / Watch Shave rewrite **current leftover AP/MP**, next-walk legality, or next-walk **MP** tax — not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Glyph Reel is the **fourteenth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava / ice / painted mire / painted conveyor, then **painted glyph-tax occupancy**). Dest is never `map.portals` |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–20 force families still fail closed. Wave 21 adds **zero** new force-gated CORE cards |
| `lastResolvedSpellId` | Absent | `verse_octaver` (and Waves 10–20 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` / Wave 16 `cast_toller` still wait. Fresh Plate / Wide Plate / Hollow Mark do **not** invent a persist stat |
| `walkMpSpentThisTurn` | Absent | Octave\* leftover-sum gates / Thin Gift / Wide Plate / Hollow Sting / Lean Gait / Prime Toll / Fresh Plate fail closed until battle walks write leftover MP |
| One next walk permutation of **(3,2)** / next-spell exact Chebyshev **10** / pull toward nearest **painted glyph-tax occupancy** / bonus if share a **(3,2)** vector / cell detonates on **end-turn leftover AP and MP both 0** / leftover **AP≥2 AND MP≥1** miss / pathLength **1** ignores painted fuse / leftover **0/0** poke / allied-summon **walk-landing (3,2)** AP tax / heal-if leftover **1/0** / remaining `n>5→5` / next **walk** +1 AP if leftover **1/1** / next **walk** +1 **MP** while **barrier adjacent** / overwatch snap **−1 leftover MP** / leftover **AP=0 AND MP≥1** poke / bonus if near **painted glyph-tax occupancy** / leftover AP **equals max** miss | Still absent as CORE identities | Wave 21 secondary opportunity (SDE Wave 19 unique CORE leftover). Pack Camel / Camel Fold stay closed |
| Heal-if both bodies leftover AP + leftover MP **=== 8 AND unequal** / remaining `5` → `0` / stretched-plus occupy (fifteen) / invert leftover on **the caster and one same-side ally** / next hit 0 while sum===8 unequal / sting / join / start-turn occupy / cannot-walk-while-sum===8-unequal / +AP+MP if ally sum===8 unequal (**exits** window) / steal leftover AP iff sum===8 unequal / end-turn occupy sum===8 unequal post / bounce among sum===8 unequal / non-Strike illegal unless sum===8 unequal **and** last AP / last-id illegal until sum===8 unequal | Still absent in live catalog | Wave 21 primary opportunity (SPELL_PROPOSALS Wave 20). Court Quinte stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Fresh Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Hollow Sting is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Camel Bite is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16821) | Only live MP-debit hook. Glyph Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Quint is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 335–337) | Only live reflect. Kin Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 21 families exist so those verbs are **sentences**, not extra HP.

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

**Wave 20 ids — do not re-propose:**  
`septet_mender`, `cadence_quarterer`, `tetradeca_prelate`, `feud_turner`, `septet_hooder`, `septet_stinger`, `septet_stepper`, `septet_siller`, `septet_holder`, `septet_lender`, `septet_sipper`, `septet_prelate`, `septet_bouncer`, `must_septeter`, `verse_septeter`, `hook_warder`, `nona_oather`, `slide_reeler`, `hook_biter`, `idle_marker`, `thin_plater`, `brier_skipper`, `wide_stinger`, `hook_taxer`, `wide_gifter`, `cadence_quadder`, `even_toller`, `brick_feer`, `watch_binder`, `prime_gaiter`, `slide_cutter`, `idle_plater`.

This Wave 21 family pass consumes **#1198** unique CORE (minus Pack Camel / Camel Fold) plus **#1251** (minus Court Quinte). **Wave 22** consumes SDE Wave 20 unique CORE (`spell-giraffe-stride` … `spell-giraffe-fold`, except Pack Giraffe / Giraffe Fold unless a later boss sheet claims them) plus same-day SPELL_PROPOSALS Wave 21 if that catalog opens. Extra doors stay kit-only (`octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` / `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`). This run does not mint colliding `wave21:` spell ids. Same-day 2026-10-29 SPELL_PROPOSALS / SDE had **not** opened a PR at authoring — if they later claim a unique leftover, **SDE wins** and stamps as Wave **22** family CORE. #1285 / #1287 / #1291 are not unique leftover catalogs.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` / `spell-pack-diag` / `spell-far-fold` / `spell-court-snuff` / `spell-pack-orth` / `spell-leap-fold` / `spell-court-dock` / `spell-pack-ring` / `spell-lane-fold` / `spell-pack-hook` / `spell-hook-fold` / `spell-pack-camel` / `spell-camel-fold` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is Wave 16 CORE. Cadence Rise (`n==1` → `2`) is Wave 17. Cadence Snuff (`n==1` → `0`) is Wave 17. Cadence Cap (`n>2` → `2`) is Wave 18. Cadence Dock (`n===2` → `0`) is Wave 18. Cadence Tern (`n>3` → `3`) is Wave 19. Cadence Tierce (`n===3` → `0`) is Wave 19. Cadence Quad (`n>4` → `4`) is Wave 20. Cadence Quarte (`n===4` → `0`) is Wave 20. Cadence Quint (`n>5` → `5`) is this pass’s SDE CORE — family **`cadence_quinter`**. Cadence Quinte (`n===5` → `0`) is this pass’s **other** remaining rewrite — family **`cadence_quintrer`**. Cadence Sext (`n>6` → `6`) is SDE Wave 20 — Wave 22.

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

**Stationary-post / multi-body cap (extend Wave 20):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** Tally Post **or** Dec Span **or** Score Post **or** Hendeca Span **or** Stave Post **or** Dodeca Span **or** Sestet Post **or** Trideca Span **or** Septet Post **or** Tetradeca Span **or** **Octave Post** **or** **Pentadeca Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post / Septet Post / **Octave Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. Dec Span counts as **ten**. Hendeca Span counts as **eleven**. Dodeca Span counts as **twelve**. Trideca Span counts as **thirteen**. Tetradeca Span counts as **fourteen**. **Pentadeca Span counts as fifteen.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, Dec Span, Score Post, Hendeca Span, Stave Post, Dodeca Span, Sestet Post, Trideca Span, Septet Post, Tetradeca Span, Octave Post, or Pentadeca Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-…fifteen-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, a Dec Span axis-aligned 2×5, a Hendeca Span stretched plus (7-spine × 5-crossbar, center occupied), a Dodeca Span axis-aligned 3×4, a Trideca Span orthogonal plus arm 3, a Tetradeca Span axis-aligned 2×7, **or** a Pentadeca Span stretched plus (9-spine × 7-crossbar, center occupied), never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, Tally Post, Score Post, Stave Post, Sestet Post, Septet Post, and Octave Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole). Hendeca Span occupies **every** cell of the stretched plus (no cage hole; **no diagonal cells**). Dodeca Span occupies **every** cell of the 3×4 (no cage hole). Trideca Span occupies **every** cell of the plus (center + four arms of length 3; **no diagonal cells of the bounding 7×7**). Tetradeca Span occupies **every** cell of the 2×7 (no cage hole). **Pentadeca Span occupies every cell of the stretched plus (longArm 4 / shortArm 3; no cage hole; no diagonal cells of the bounding 9×7).** Hendeca / Trideca / **Pentadeca** click is **center**. Dodeca / Dec / Tetradeca click is the **cell of the rectangle closest to the caster**. A 2×7 **has no unique center**. A stretched plus **has** a unique center.

**Summon-cap prerequisite (extend Wave 20):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. … Tetradeca Span is illegal until remaining cap ≥ 14. **Pentadeca Span is illegal until remaining cap ≥ 15.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post / Septet Post / Octave Post are legal at remaining ≥ 1. Do not spawn `pentadeca_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 20):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / Tally\* leftover-sum / Equal Gift / Tied Gait / Score\* leftover-sum / Lean Gift / Dry Plate / Odd Gait / Even Sting / Still Toll / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / Even Gait / Gait Toll / Sestet\* leftover-sum / Gait Gift / Prime Plate / Thin Gait / Capped Sting / Odd Toll / Septet\* leftover-sum / Wide Gift / Thin Plate / Wide Sting / Prime Gait / Even Toll / Idle Plate / **Octave\*** leftover-sum / **Thin Gift** / **Wide Plate** / **Hollow Sting** / **Lean Gait** / **Prime Toll** / **Fresh Plate** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Brick Step / Score Step / Stave Step / Sestet Step / Septet Step / **Octave Step** / Tern Stride / Hook Stride / **Camel Stride** / Slide Skip / Fuse Skip are relocates or next-walk locks — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 20):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / Tally\* leftover-sum / Odd Plate / Odd Sting / Equal Gift / Tied Gait / Score\* leftover-sum / Even Sting / Lean Gift / Stave\* leftover-sum / Prime Gift / Dual Plate / Fresh Sting / Sestet\* leftover-sum / Gait Gift / Prime Plate / Thin Gait / Septet\* leftover-sum / Wide Gift / Thin Plate / **Octave\*** leftover-sum / **Thin Gift** / **Wide Plate** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3**, **enables** Score when the surviving banks **sum to 4 and are unequal**, **cannot enable Stave** (max surviving leftover is 2/2 = sum 4), **cannot enable Sestet** (sum 6), **cannot enable Septet** (sum 7), **cannot enable Octave** (sum 8), **enables Dual Plate** when both leftover AP and leftover MP are even and ≥ 2 (2/2 is Dual Plate **and** Poise), **enables Gait Gift** when leftover AP ≥ 2 **and** leftover MP = 0, **enables Wide Gift / Wide Sting / Wide Plate** when leftover AP ≥ 2 **and** leftover MP ≥ 1 (Dual Keep 2/2 **is** Wide Gift **and** Wide Sting **and** Wide Plate **and** Poise **and** Dual Plate), **enables Prime Plate / Prime Gift / Prime Gait / Prime Toll** when leftover is **exactly 1/1**, **enables Thin Plate / Thin Gait / Thin Gift** when leftover is **exactly 1/0**, **enables Lean Gait / Lean Gift** when leftover AP **=== 0 AND leftover MP ≥ 1**, **enables Hollow Sting / Hollow Gift / Hollow Mark / Gaunt** when leftover is **0/0**, **enables Fresh Plate / Fresh Sting** when leftover AP **equals max**, and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift / Hollow Sting / Hollow Mark. Hold 2/2 or 1/1 for Poise. Hold leftover **exactly 1/1** for Prime Gift / Prime Plate / Prime Gait / **Prime Toll**. Hold leftover **exactly 1/0** for Thin Gait / Thin Plate / **Thin Gift**. Hold leftover **AP ≥ 2 AND MP = 0** for Gait Gift. Hold leftover **AP ≥ 2 AND MP ≥ 1** for Wide Gift / Wide Sting / **Wide Plate**. Hold leftover **AP = 0 AND MP ≥ 1** for Lean Gift / **Lean Gait**. Hold leftover AP **equals max** for Fresh Sting / **Fresh Plate**. Hold (8,0) / (0,8) / (7,1) / (1,7) / (6,2) / (2,6) / (5,3) / (3,5) for Octave — Dual Keep **cannot** sit here; (4,4) is Poise; (4,3) is Septet; (4,2) is Sestet; (3,3) is Poise. `leftover AP = 0` and `leftover MP = 0` is **not** an Octave window. Dual Keep 2/2 is Poise (sum 4 **and** a tie) **and** Dual Plate **and** Wide Gift **and** Wide Sting **and** Wide Plate. Dual Keep **cannot** sit on sum 5, sum 6, sum 7, or sum 8. Sestet Lend (4,2)→(5,3) **manufactures Octave**. Septet Lend (4,3)→(5,4) **exits** to 9. Octave Lend (5,3)→(6,4) **exits** to 10. Octave Sip (5,3)→(4,3) **manufactures Septet**; every successful Octave Sip **manufactures Septet**. (4,4) is Poise, **not** Octave (`octaveForbidEqual` is required).

**Last-id prerequisite (extend Wave 20):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / Verse Tally / Summon Verse / Verse Score / Verse Stave / Verse Sestet / Verse Septet / **Verse Octave** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 20):** Shove Mark / Drift Gift / Heave\* / Drift\* / Shove Gift fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, Score Step, Stave Step, Sestet Step, Septet Step, Octave Step, Home Step, Tern Stride, Hook Stride, and Camel Stride dests do **not** set the flag. Wave 21 adds **zero** new force-gated CORE cards. Glyph Reel **is** an attract — it needs `applyAttract` wired, not a new persist flag.

**Facing / Struck prerequisites (partial):** Wave 21 adds **zero** facing CORE cards. Fresh Plate / Wide Plate / Hollow Mark key leftover AP/MP, not Strike-from-cell. Clash Mend / Strike Debter / Cast Toll still wait on `struckThisTurn`. Strike Mark (Wave 17) still waits on Strike-from-cell. Summon Mark waits on **summon spawn onto the painted cell**.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Octave Mend MULTI child `octave_cantor` — first child wins vs `octave_mender` observe. Cadence Quinte MULTI child `quinte_precentor` — first child wins vs `cadence_quintrer` observe. Pentadeca Span MULTI child `span_pentadeca` — first child wins vs `pentadeca_prelate` observe. Court Quinte stays `court_quinte_regent` kit-only. Camel Stride teach room `camel_gallery` — first child wins vs `camel_warder` observe. Deca Oath teach room `deca_nave` — first child wins vs `deca_oather` observe. Glyph Reel teach room `cipher_aisle` — first child wins vs `glyph_reeler` observe. Hollow Mark teach room `hollow_pulpit` — first child wins vs `hollow_marker` observe. Fuse Skip teach room `fuse_nave` — first child wins vs `fuse_skipper` observe. Pack Camel stays `camel_precentor` kit-only. Camel Fold stays `camel_fold_regent` kit-only. Thin Gift / Cadence Quint / Wide Plate / Camel Bite / Hollow Sting / Camel Taxer / Lean Gait / Glyph Cut / Fresh Plate / Prime Toll / Brick Levy / Watch Shave / Kin Turn / Octave Hood / Octave Sting / Octave Step / Octave Sill / Octave Hold / Octave Lend / Octave Sip / Octave Post / Octave Bounce / Must Octave / Verse Octave have **no** extra door — do **not** invent `thin_cantor` / `quint_precentor` / restamp `octave_cantor` / `septet_cantor` / `sestet_cantor` / `stave_cantor` / `score_cantor` / `tally_cantor` / `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor` / `prime_precentor` / `snuff_precentor` / `dock_precentor` / `tierce_precentor` / `quarte_precentor` / `quinte_precentor`. Do **not** name families after extra doors (`octave_cantor`, `quinte_precentor`, `span_pentadeca`, `court_quinte_regent`, `camel_gallery`, `deca_nave`, `cipher_aisle`, `hollow_pulpit`, `fuse_nave`, `camel_precentor`, `camel_fold_regent`, plus every extra door listed in Wave 20 §1). Do **not** restamp Wave 20 extra doors (`septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`). Do **not** restamp Wave 21 boss extra doors from #1244 (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`).

---

## 2. Why Wave 21 exists (gaps Waves 1–20 did not fill)

Wave 1 covered every requested **role word**. Waves 2–20 covered unused engine verbs and each subsequent SPELL_PROPOSALS / leftover SDE unique CORE stamp. Wave 20 consumed leftover SDE Wave 18 unique CORE (minus Pack Hook / Hook Fold) plus SPELL_PROPOSALS Wave 19 (minus Court Quarte).

SPELL_PROPOSALS Wave 20 (#1251) then stamped the holes Wave 20 **held**: both-body leftover AP + leftover MP **=== 8 AND unequal** heal (Octave Mend), remaining `5` → `0` (Cadence Quinte), stretched-plus fifteen-cell occupy (Pentadeca Span), and a caster-plus-ally leftover invert (Kin Turn) plus the Octave court. A G≥20 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 19 unique CORE still had no CORE owner after Wave 20. Seventeen of those verbs fill holes Wave 20 tactical does not: one next walk permutation of **(3,2)**, next-spell exact Chebyshev **10**, pull toward nearest **painted glyph-tax occupancy**, bonus if share a **(3,2)** vector, cell detonates on **end-turn leftover AP and MP both 0**, leftover **AP≥2 AND MP≥1** miss, pathLength **1** ignores painted fuse, leftover **0/0** poke, allied-summon **walk-landing (3,2)** AP tax, heal-if leftover **1/0**, remaining `n>5→5`, next **walk** +1 AP if leftover **1/1**, next **walk** +1 **MP** while **barrier adjacent**, overwatch snap **−1 leftover MP**, leftover **AP=0 AND MP≥1** poke, bonus if near **painted glyph-tax occupancy**, leftover AP **equals max** miss. Pack Camel and Camel Fold stay closed.

SDE Wave 20 (#1255) unique CORE stays extras until Wave 22. Cadence Sext (`n>6` → `6`) is **not** Cadence Quint. Deep Gift (leftover **AP === 1 AND MP ≥ 2**) is **not** Thin Gift. Giraffe Stride is **not** Camel Stride. Pentadeca Span is **not** a fifteen-cell hold for a later SDE occupy — #1251 filled that hole. Undeca Oath (exact-11 **spell gate**) is **not** Pentadeca Span (occupy-weight 15) and **not** Hendeca Span (occupy-weight 11).

| Unused Wave 20 / SDE Wave 19 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-octave-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 8 AND unequal**) | `septet_mender` (both leftover **sum === 7**); `sestet_mender` (both leftover **sum === 6 AND unequal**); `stave_mender` (both leftover **sum === 5**); `wide_gifter` (one-body leftover **AP≥2 AND MP≥1**); `gait_gifter` (one-body leftover **AP≥2 AND MP=0**); `thin_gifter` (this pass, one-body leftover **1/0**); `prime_gifter` (leftover **exactly 1/1**) | Four leftover reads + two inequality checks on an **even** sum Dual Keep **cannot** fake; (4,4) is Poise. Extra door is `octave_cantor` — family is **`octave_mender`**. Do **not** restamp `septet_cantor` / `sestet_cantor` / `stave_cantor`. |
| `spell-cadence-quinte` (remaining `n===5` → `0`; zeros stay 0; `n===1`, `n===2`, `n===3`, `n===4`, and `n>5` unchanged) | `cadence_quarterer` (`n===4` → **0**); `cadence_tiercer` (`n===3` → **0**); `cadence_docker` (`n===2` → **0**); `cadence_snuffer` (`n==1` → **0**); `cadence_quinter` (this pass, `n>5` → **5** — **fives stay 5**); `cadence_quadder` (`n>4` → **4** — **fives become 4**); `cadence_terner` (`n>3` → **3**) | Ready-**unlock of a 5**. Extra door is `quinte_precentor` — family is **`cadence_quintrer`**. Do **not** mint `cadence_fifth` / `cadence_cinque` / name it `cadence_quinter`. |
| `spell-pentadeca-span` (stretched plus longArm 4 / shortArm 3, counts as **fifteen**, **center click**) | `tetradeca_prelate` (2×7 = 14, **nearest-cell click**); `trideca_prelate` (plus arm 3 = 13, **center click**); `hendeca_prelate` (stretched plus longArm 3 / shortArm 2 = 11, **center click**); `penta_prelate` (occupy-weight **5**) | Fifteen tiles, stretched plus with unique center click, empty kit. Extra door is `span_pentadeca` — family is **`pentadeca_prelate`**. Skip until remaining cap ≥ 15. Do **not** mint `spell-fifteen-span`. |
| `spell-kin-turn` (invert leftover AP↔MP on **the caster and one same-side non-caster ally**; caster participates) | `feud_turner` (**caster + one hostile**); `psalm_turner` (**one same-side non-caster + one hostile**; caster **unchanged**); `hymn_turner` (**two allies**; caster **unchanged**); `duel_turner` (**two hostiles**); `purse_turner` (**one** hostile); `bar_crosser` (two-body **cross** through the caster) | Caster’s purse flips with a friend. Sum invariant: Octave stays Octave; Septet stays Septet. Solo caster with no living ally **does not** fire (unlike Feud Turn). Do **not** mint `spell-duet-turn` / `spell-mixed-turn`. |
| `spell-octave-hood` (next hit is 0 **while leftover AP + leftover MP === 8 AND unequal**, any range) | `septet_hooder` (sum === 7); `sestet_hooder` (sum === 6 unequal); `wide_plater` (this pass, leftover **AP≥2 AND MP≥1**) | Hold (5,3). Dual Keep 2/2 is Dual Plate / Poise Hood / Wide Gift / Wide Plate, **not** this. (4,4) is Poise. Even sum — equality ban required. |
| `spell-octave-sting` (10 + 8 iff leftover AP + leftover MP === 8 AND unequal) | `septet_stinger` (sum === 7); `sestet_stinger` (sum === 6 unequal); `wide_stinger` (leftover **AP≥2 AND MP≥1**); `hollow_stinger` (this pass, leftover **0/0**); `lean_gaiter` (this pass, leftover **AP=0 AND MP≥1**) | Punish (8,0) / (0,8) / (7,1) / (1,7) / (6,2) / (2,6) / (5,3) / (3,5). 2/2 is Poise / Dual Plate / Wide. 4/4 is Poise. (4,3) is Septet. |
| `spell-octave-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 8 AND unequal) | `septet_stepper` (sum === 7); `sestet_stepper` (sum === 6 unequal); `home_stepper` (**ungated**) | Join the body that **sums to 8 without tying**. Relocate, not `isSwap`. |
| `spell-octave-sill` (occupant sum===8 unequal at **start of their turn** takes 8; paint stays) | `septet_siller` (sum === 7); `sestet_siller` (sum === 6 unequal); `hollow_marker` (this pass, end-turn leftover **0/0**, consume) | Tax the camp **on their turn start** if they held an Octave pair. Dual Keep 2/2 **misses**. (4,4) **misses**. |
| `spell-octave-hold` (cannot walk while leftover AP + leftover MP === 8 AND unequal) | `septet_holder` (while sum === 7); `sestet_holder` (while sum === 6 unequal); `brick_holder` (**barrier adjacent**) | (0,8) has MP but cannot spend it. Spend leftover AP **or** dump to 4/3. **Do not PAIR with Must Octave.** |
| `spell-octave-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 8 AND unequal — **exits** to sum 10) | `septet_lender` (+1/+1 if sum === 7 — **exits** to 9); `sestet_lender` (+1/+1 if sum === 6 unequal — **exits** to 8, **which is this family’s window**) | Cash the window. Sestet Lend **manufactures Octave**. Septet Lend **exits** to 9. |
| `spell-octave-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 8 AND unequal and leftover AP ≥ 1) | `septet_sipper` (steal iff sum === 7); `sestet_sipper` (steal iff sum === 6 unequal); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (5,3) → (4,3) **Septet**. Every successful Octave Sip **manufactures Septet**. (0,8) fizzles (no AP). |
| `spell-octave-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 8 AND unequal** deals 10 and it dies) | `septet_prelate` (sum === 7); `sestet_prelate` (sum === 6 unequal); `dummy_prelate` (taunt) | Camp sum===8 unequal on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "octavepost"`. |
| `spell-octave-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===8-unequal hostile) | `septet_bouncer` (second body sum === 7); `sestet_bouncer` (second body sum === 6 unequal); Chain Lightning (nearest **any**) | Second 12 needs **two** Octave bodies. Missing flag → 12 only. |
| `spell-must-octave` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 8 AND unequal **and** this spell spends last AP) | `must_septeter` (sum === 7 / last AP); `must_sesteter` (sum === 6 unequal / last AP); `octave_holder` (this pass, **walk** needs sum ≠ 8 unequal) | Inverse of Octave Hold. Strike stays legal. **Do not PAIR with Octave Hold.** |
| `spell-verse-octave` (last resolved id **illegal until leftover AP + leftover MP === 8 AND unequal**) | `verse_septeter` (until sum === 7); `verse_sesteter` (until sum === 6 unequal); `last_muter` (**duration**) | Recast Inferno only after **sum === 8 unequal**. 2/2 and 4/4 and 4/3 and 4/2 and 3/3 and 0/0 do **not** lift. |
| `spell-camel-stride` (**next walk** legal only if `(|dx|,|dy|)` is a permutation of **(3,2)**) | `hook_warder` (**only** `(3,1)`); `tern_warder` (Chebyshev **exactly 3, orthogonal only** `(±3,0)/(0,±3)`); `knight_warder` (**only** `(2,1)`); `ring_warder` (Chebyshev **exactly 2**, knight excluded) | Extra room is `camel_gallery` — family is **`camel_warder`**. Eight dests `(±3,±2)` and `(±2,±3)`. Do **not** name it `camel_gallery` or `hook_warder` or `tern_warder`. |
| `spell-deca-oath` (next spell must be Chebyshev **exactly 10**) | `nona_oather` (exact **9**); `octa_oather` (exact **8**); `dec_prelate` (occupy-weight 10); `long_oather` (**≥ 3**) | Frost at 1–9 or ≥ 11 fizzles. Strike stays legal. Extra room `deca_nave` is a teach — family is **`deca_oather`**. Do **not** name it `deca_nave` or `dec_prelate`. Do **not** mint `spell-deca-span`. |
| `spell-glyph-reel` (pull 1 toward nearest **painted glyph-tax occupancy**) | `slide_reeler` (toward **painted conveyor occupancy**); `brick_reeler` (toward **barrier**); `mire_reeler` (toward **painted mire occupancy**); Glyph Tax **is** the paint | Fourteenth `applyAttract` dest flavor. Extra room `cipher_aisle` is a teach — family is **`glyph_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no painted glyph-tax fizzles. |
| `spell-camel-bite` (10 + 8 if share a **(3,2)** vector) | `hook_biter` (`(3,1)`); `diag_biter` (`\|dx\|==\|dy\|`); `file_biter` (share **file only**); `rank_biter` (share **rank only**); `axis_biter` (share rank **or** file) | Bonus on the camel. Rank-only / file-only / hook / knight → 10 only. Family is **`camel_biter`**. Do **not** name it `camel_warder`. |
| `spell-hollow-mark` (cell detonates at **end of turn** if leftover AP **and** leftover MP are **both 0**) | `idle_marker` (leftover **MP equals max**); `last_marker` (last leftover **AP**); `dwell_marker` (any end-turn occupy); `gaunt_prelate` / `hollow_gifter` (0/0 heal, not a paint) | They must **spend both leftover pools**. Extra room `hollow_pulpit` is a teach — family is **`hollow_marker`**. Do **not** name it `hollow_pulpit` or `hollow_gifter` or `idle_marker`. |
| `spell-wide-plate` (next hit is 0 **while leftover AP ≥ 2 AND leftover MP ≥ 1**; consume on miss) | `thin_plater` (leftover **1/0**); `prime_plater` (leftover **1/1**); `dual_plater` (leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**); `wide_stinger` (same window, **damage**); `wide_gifter` (same window, **heal**); `septet_hooder` (sum === 7 miss) | Hold (2,1) or (2,2) or (5,3). Dual Keep 2/2 **is** this window. Family is **`wide_plater`**. Do **not** PAIR with `wide_gifter` / `wide_stinger` / `dual_keeper`. |
| `spell-fuse-skip` (next walk of **pathLength exactly 1** ignores painted-fuse detonate this enter) | `brier_skipper` (Thorned extra + pathLength **2**, not occupancy); `slide_skipper` (**conveyor** auto-push, length 1); `rift_skipper` (**Void Rift** tax); `fuse_binder` (**paints** the delayed fuse) | Fuse timer still ticks. PathLength ≥ 2 still detonates. Extra room `fuse_nave` is a teach — family is **`fuse_skipper`**. Do **not** name it `fuse_nave` or `fuse_binder` or `brier_skipper`. |
| `spell-hollow-sting` (10 + 8 iff leftover AP **=== 0 AND leftover MP === 0**) | `thin_gaiter` (leftover **1/0**); `wide_stinger` (leftover **AP≥2 AND MP≥1**); `prime_gaiter` (leftover **1/1**); `fresh_stinger` (leftover AP **equals max**); `hollow_gifter` / `gaunt_mender` (**heal** on leftover 0/0) | Punish a spent bar. Dual Keep 2/2 is **not** this. Family is **`hollow_stinger`**. Do **not** name it `hollow_gifter` or `hollow_marker` or `gaunt_stinger`. |
| `spell-summon-camel` (allied summons pay +1 **AP** if this turn’s walk **landing** is a **(3,2)** from origin) | `hook_taxer` (landing **(3,1)**); `summon_orther` (per **diagonal step**); `summon_filer` (walk **off file**); `summon_toller` (+1 AP to start **any** walk); Pack Camel (`ENEMY_ONLY` hard lock) | Orthogonal 1-steps and hook landings are free of this tax. **Do not PAIR with Summon Hook / Summon Orth / Summon File / Summon Toll.** Family is **`camel_taxer`**. Do **not** mint `summon_hooker` / name it `camel_warder` / `camel_biter`. |
| `spell-thin-gift` (heal 8 iff leftover **AP === 1 AND leftover MP === 0**) | `thin_gaiter` (same window, **damage**); `thin_plater` (same window, **miss**); `gait_gifter` (AP≥2 and MP=0); `lean_gifter` (AP=0 and MP≥1); `prime_gifter` (exactly **1/1**); `wide_gifter` (AP≥2 and MP≥1); `octave_mender` (this pass, both leftover **sum === 8 unequal**) | Healer CORE only. Dual Keep 1/0 **is** Thin Gift if it survives. (1,0) is **not** an Octave pair. **No extra door**. Family is **`thin_gifter`**. |
| `spell-cadence-quint` (remaining `n>5` → `5`; 0/1/2/3/4/5 unchanged) | `cadence_quintrer` (this pass, `n===5` → **0**); `cadence_quadder` (`n>4` → **4**); `cadence_terner` (`n>3` → **3**); `cadence_capper` (`n>2` → **2**); Floor (`n>1` → 1) | Compress a 7 to a 5. Observe via `cadence_thief` / `hex_chorister`. Do **not** restamp `quinte_precentor` / `quarte_precentor` / `floor_precentor`. Family is **`cadence_quinter`**. Do **not** name it `cadence_quintrer` or `cadence_quadder` or `cadence_quarterer`. |
| `spell-prime-toll` (next **walk** +1 AP if leftover **AP === 1 AND leftover MP === 1**) | `even_toller` (leftover **AP even ≥ 2**); `odd_toller` (leftover **AP odd**); `gait_toller` (next walk if leftover **MP = 0**); `prime_gaiter` (**damage** on leftover 1/1); `prime_gifter` / `prime_plater` (**1/1** heal / miss) | Camp leftover 1/1 then walk. Family is **`prime_toller`**. Do **not** PAIR with Prime Gait / Prime Gift / Prime Plate as CORE. |
| `spell-brick-levy` (next **walk** +1 **MP** while adjacent to a **barrier**) | `brick_taxer` (next **walk +1 AP**); `brick_feer` (next **spell +1 AP**); `brick_holder` (**forbids** the walk); Frozen/Slime is a **map-modifier** walk-MP doubler | Cover-camping **walk-MP** tax. Not `spell.mpCost`. Family is **`brick_levier`**. Do **not** name it `brick_taxer` or `brick_feer` or `tax_scribe`. |
| `spell-watch-shave` (overwatch snap **−1 leftover MP** on the walker; caster does not gain it) | `watch_binder` (**forbids** the walker’s next walk); `watch_taxer` (next **spell** +1 AP); `watch_rooter` (**zeros** leftover MP now); `watch_drainer` (**steals 1 leftover MP** to the caster) | Ending a walker’s leftover MP mid-path **without** granting it. **Do not PAIR with Watch Bind / Watch Tax / Watch Root / Watch Drain.** Family is **`watch_shaver`**. Do **not** name it `watch_binder` or `watch_taxer`. |
| `spell-lean-gait` (leftover **AP === 0 AND leftover MP ≥ 1** → bonus damage) | `lean_gifter` (same window, **heal**); `thin_gaiter` (leftover **1/0**); `hollow_stinger` (this pass, leftover **0/0**); `wide_stinger` (leftover **AP≥2 AND MP≥1**); `lean_stinger` (Wave 13 leftover-MP=0 sting — different window) | Poke leftover 0/n (n≥1). Dual Keep 0/2 **is** this window if it can sit there. Family is **`lean_gaiter`**. Do **not** name it `lean_gifter` or `lean_stinger` or `thin_gaiter`. |
| `spell-glyph-cut` (10 + 10 if target is Chebyshev ≤ 2 from **painted glyph-tax occupancy**) | `slide_cutter` (**conveyor** occupancy); `lava_cutter` (**lava occupancy**); `rime_cutter` (**ice occupancy**); `spike_cutter` (**spike occupancy**); `hazard_cutter` (**painted** hazard); `glyph_reeler` (**pulls**); `glyph_sower` (**paints**) | Threshold poke. Twin Gate pads are **not** glyph-tax. Family is **`glyph_cutter`**. Do **not** name it `glyph_reeler` or `glyph_sower` or `glyph_skipper`. |
| `spell-fresh-plate` (next hit is 0 **while leftover AP equals max**; consume on miss) | `idle_plater` (leftover **MP equals max**); `fresh_stinger` (same window, **damage**); `dry_plater` (leftover **MP = 0**); `cast_plater` (outgoing non-Strike deals 0) | Hold leftover AP at max (they have **not spent AP**). Family is **`fresh_plater`**. Do **not** name it `fresh_stinger` or `idle_plater` or `full_plater`. |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won / later wave):** `spell-court-quinte` (`NOT_PLAYER_LEARNABLE`; `court_quinte_regent` kit — same law as Court Quarte / Court Tierce / Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-camel` (ENEMY_ONLY; stays `camel_precentor` CHAMPION SIGNATURE), `spell-camel-fold` (BOSS_ONLY; `camel_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor / Pack Rank / Rank Fold / Court Prime / Pack Diag / Far Fold / Court Snuff / Pack Orth / Leap Fold / Court Dock / Pack Ring / Lane Fold / Court Tierce / Court Quarte / Pack Hook / Hook Fold stay where Waves 5–20 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 21 CORE rows are `mpCost: 0`. Octave Sip / Octave Lend / Kin Turn / Prime Toll / Brick Levy / Watch Shave rewrite **current leftover AP/MP**, next-walk legality, or next-walk **MP** tax.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Octave Post / Hollow Mark / Cadence Quinte / Cadence Quint are **not** queue splices.  
Do **not** family a sixteen-cell occupy this pass. Pentadeca Span is the fifteen-cell card. Tetradeca Span already owns fourteen.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Giraffe Stride / Undeca Oath / Trip Reel / Giraffe Bite / Skew Mark / Deep Plate / Trip Skip / Pair Gait / Summon Giraffe / Deep Gift / Cadence Sext / Trip Toll / Brick Split / Watch Clip / Pair Plate / Trip Cut / Giraffe Gate / Pack Giraffe / Giraffe Fold (SDE Wave 20 unique CORE — Wave 22).  
Do **not** family leftover AP − leftover MP === 2 as `spell-skew-*` — SDE #1255 **won** `spell-skew-mark`.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family leftover 1/1 heal as `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift`. Prime Gift is Wave 18; Gait Gift is Wave 19; Wide Gift is Wave 20; Thin Gift is this pass.  
Do **not** family leftover AP === 1 AND MP ≥ 2 as `spell-deep-*` — SDE #1255 **won** Deep Gift / Deep Plate.  
Do **not** family leftover 2/0 as `spell-pair-gait` / `spell-pair-plate` — SDE #1255 **won** those.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 20 unique CORE as this pass’s CORE.  
Do **not** mint `wave21:` colliding spell ids.  
Do **not** name the Octave Mend family `octave_cantor`, the Pentadeca Span family `span_pentadeca` or `penta_prelate` or `tetradeca_prelate`, the Camel Stride family `camel_gallery` or `hook_warder` or `tern_warder`, the Deca Oath family `deca_nave` or `dec_prelate` or `nona_oather`, the Glyph Reel family `cipher_aisle` or `slide_reeler` or `glyph_sower`, the Hollow Mark family `hollow_pulpit` or `hollow_gifter` or `idle_marker`, the Cadence Quinte family `quinte_precentor` or `cadence_quinter` or `cadence_fifth` or `cadence_cinque`, the Cadence Quint family `quint_precentor` or `cadence_quintrer` or `cadence_quadder` or `cadence_quarterer`, the Thin Gift family `octave_cantor` or `thin_gaiter` or `thin_plater` or `gait_gifter`, the Wide Plate family `wide_gifter` or `wide_stinger` or `dual_plater` or `thin_plater`, the Camel Bite family `camel_warder` or `hook_biter`, the Fuse Skip family `fuse_nave` or `fuse_binder` or `brier_skipper`, the Camel Taxer family `summon_hooker` or `hook_taxer` or `camel_warder` or `camel_biter`, the Brick Levier family `brick_taxer` or `brick_feer` or `tax_scribe`, the Watch Shaver family `watch_binder` or `watch_taxer` or `watch_drainer`, the Prime Toll family `prime_gifter` or `prime_gaiter` or `even_toller`, the Glyph Cut family `glyph_reeler` / `glyph_sower` / `slide_cutter` / `lava_cutter`, the Fresh Plate family `fresh_stinger` / `idle_plater` / `full_plater`, the Kin Turn family `feud_turner` / `psalm_turner` / `hymn_turner` / `duel_turner` / `purse_turner`, the Lean Gait family `lean_gifter` / `lean_stinger` / `thin_gaiter`, the Hollow Sting family `hollow_gifter` / `hollow_marker` / `gaunt_stinger`, or the Octave Post family `oct_prelate` / `octa_oather` / `octave_cantor`.

---

## 3. Encounter synergy packs (Waves 1–21)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** Score Post **or** Stave Post **or** Sestet Post **or** Septet Post **or** Octave Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span **or** Hendeca Span **or** Dodeca Span **or** Trideca Span **or** Tetradeca Span **or** Pentadeca Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Octave Choir | `octave_mender` + `verse_octaver` + `ignite_alchemist` | Sum===8 unequal 8, then Inferno is illegal until leftover AP + leftover MP === 8 unequal |
| Pentadeca Plug | `pentadeca_prelate` + `octave_siller` + `camel_warder` | Stretched-plus corridor seal, tax a neighbor at turn start, lock the next walk to (3,2). Skip until remaining cap ≥ 15 |
| Camel Deca | `camel_warder` + `deca_oather` + `glass_sniper` | Next walk must be (3,2), next spell must be exact 10, snipe from 10 |
| Cipher Camel | `glyph_reeler` + `camel_biter` + `glyph_sower` | Pull toward painted glyph-tax, then bite the camel cell they now share |
| Hollow Thin | `hollow_marker` + `thin_gifter` + `plate_warden` | Paint the spent-bar cell, then camp leftover 1/0 behind the miss |
| Fuse Lean | `fuse_skipper` + `lean_gaiter` + `tide_shade` | Step onto a fuse at length 1, then poke leftover AP=0/MP≥1 |
| Thin Quint | `thin_gifter` + `cadence_quinter` + `font_cantor` | Heal the 1/0 window, then compress remaining n>5 → 5 |
| Prime Brick | `prime_toller` + `brick_levier` + `stone_castellan` | Tax the next walk at leftover 1/1, then tax the next walk **MP** while barrier-adjacent |
| Watch Lean | `watch_shaver` + `lean_gaiter` + `glass_sniper` | Snap shaves leftover MP, then poke leftover AP=0/MP≥1 |
| Cipher Kennel | `glyph_cutter` + `camel_taxer` + `fresh_plater` | Threshold poke near glyph-tax, then tax pet (3,2) landings **or** blank a hit while leftover AP is max — COURT, never PAIR Tax + Plate on one BASE kit |
| Kin Octave | `kin_turner` + `octave_mender` + `octave_stinger` | Invert caster + ally purses while keeping sum 8, then heal / sting |
| Quinte Verse | `cadence_quintrer` + `verse_octaver` + `tax_scribe` | Unlock remaining 5 → 0, then lock recast until they sit Octave |
| Octave Quiet | `octave_stepper` + `octave_mender` + `cover_squire` | Join the sum===8-unequal ally, then cash the eight leftover reads |
| Purse Octave | `kin_turner` + `octave_sipper` + `septet_stinger` | Invert, then sip (5,3)→(4,3) **Septet**, then sting the manufactured window |
| Octave Gate | `octave_prelate` + `octave_siller` + `octave_stinger` | Post detonates sum===8-unequal occupy; tile taxes start-of-turn; sting the rest |
| Bounce Octave | `octave_bouncer` + `must_octaver` + `fuse_binder` | Two Octave bodies, bounce 12+12 onto the wick |
| Octave Hold File | `octave_holder` + `must_octaver` + `leash_warden` | Walk **and** tools need leftover sum === 8 unequal — COURT, never PAIR Octave Hold + Must Octave on the same body without a third peeler |
| Lend Hood | `octave_lender` + `octave_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 10), or hold (5,3) through a miss |
| Quint Quinte | `cadence_quinter` + `cadence_quintrer` + `verse_octaver` | Compress a 7 to a 5, **then** Quinte the 5 to 0 on a **later** turn — COURT, never PAIR Quint + Quinte on one BASE kit |
| Wide Fresh | `wide_plater` + `fresh_plater` + `plate_warden` | Camp AP≥2/MP≥1 miss, then camp leftover-AP-equals-max miss after they walk the last MP |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood), Wave 16 packs (Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen), Wave 17 packs (Score Choir, Hendeca Plug, File Hexa, Lava File, Strike Dry, Shock Even, Lean Rise, Still Brace, Watch Odd, Spike Kennel, Duel Score, Snuff Verse, Score Quiet, Purse Score, Score Gate, Bounce Score, Score Hold File, Lend Hood), Wave 18 packs (Stave Choir, Dodeca Plug, Ring Hepta, Rime Rank, Last Dual, Rift Fresh, Prime Cap, Gait Brick, Watch Even, Rime Kennel, Hymn Stave, Dock Verse, Stave Quiet, Purse Stave, Stave Gate, Bounce Stave, Stave Hold File, Lend Hood, Cap Dock, Dual Fresh), Wave 19 packs (Sestet Choir, Trideca Plug, Tern Octa, Mire Diag, Spawn Prime, Slide Cap, Gait Tern, Odd Brick, Watch Thin, Lava Kennel, Psalm Sestet, Tierce Verse, Sestet Quiet, Purse Sestet, Sestet Gate, Bounce Sestet, Sestet Hold File, Lend Hood, Tern Tierce, Prime Thin), and Wave 20 packs (Septet Choir, Tetradeca Plug, Hook Nona, Mill Hook, Idle Thin, Brier Wide, Wide Quad, Even Brick, Watch Prime, Mill Kennel, Feud Septet, Quarte Verse, Septet Quiet, Purse Septet, Septet Gate, Bounce Septet, Septet Hold File, Lend Hood, Quad Quarte, Thin Idle).

Do **not** pack as PAIR (COURT later is fine):

- `octave_mender` + `septet_mender` / `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `wide_gifter` / `thin_gifter` as PAIR / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `pentadeca_prelate` + `tetradeca_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `septet_prelate` / `octave_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `octave_hooder` + `septet_hooder` / `sestet_hooder` / `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` / `prime_plater` / `thin_plater` / `idle_plater` / `wide_plater` as PAIR / `fresh_plater` as PAIR
- `octave_stinger` + `septet_stinger` / `sestet_stinger` / `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `capped_stinger` / `wide_stinger` / `prime_gaiter` / `thin_gaiter` / `lean_gaiter` as PAIR / `hollow_stinger` as PAIR / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter`
- `octave_stepper` + `septet_stepper` / `sestet_stepper` / `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` / `hook_chaplain` / `cover_squire`
- `octave_siller` + `septet_siller` / `sestet_siller` / `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `idle_marker` / `hollow_marker` as PAIR / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` / `summon_marker`
- `octave_holder` + `septet_holder` / `sestet_holder` / `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` / `must_octaver` as PAIR / `must_septeter` as PAIR / `must_sesteter` as PAIR
- `octave_lender` + `septet_lender` / `sestet_lender` / `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `octave_sipper` + `septet_sipper` / `sestet_sipper` / `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper`
- `octave_prelate` + `septet_prelate` / `sestet_prelate` / `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `idle_marker` / `hollow_marker` as PAIR / `bait_prelate` / `pentadeca_prelate` / `tetradeca_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` / `oct_prelate` / `octa_oather`
- `octave_bouncer` + `septet_bouncer` / `sestet_bouncer` / `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_octaver` + `must_septeter` / `must_sesteter` / `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `octave_holder` as PAIR
- `verse_octaver` + `verse_septeter` / `verse_sesteter` / `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser`
- `camel_warder` + `hook_warder` / `tern_warder` / `ring_warder` / `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` / `hook_chaplain` / `camel_biter` as PAIR
- `deca_oather` + `nona_oather` / `octa_oather` / `hepta_oather` / `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate`
- `glyph_reeler` + `slide_reeler` / `mire_reeler` / `lava_reeler` / `rime_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `glyph_cutter` as PAIR / `glyph_sower` as PAIR / `glyph_skipper` as PAIR
- `camel_biter` + `hook_biter` / `diag_biter` / `file_biter` / `rank_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `camel_warder` as PAIR
- `hollow_marker` + `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `last_marker` / `summon_marker` / `idle_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `sestet_siller` / `septet_siller` / `octave_siller` / `hollow_gifter` as PAIR / `hollow_stinger` as PAIR / `gait_wicker` / `fuse_binder`
- `wide_plater` + `thin_plater` / `prime_plater` / `dual_plater` / `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `idle_plater` / `fresh_plater` as PAIR / `octave_hooder` as PAIR / `septet_hooder` as PAIR / `wide_gifter` as PAIR / `wide_stinger` as PAIR / `dual_keeper` as PAIR
- `fuse_skipper` + `brier_skipper` / `slide_skipper` / `rift_skipper` / `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `fuse_binder` as PAIR / `slide_mason`
- `hollow_stinger` + `octave_stinger` / `septet_stinger` / `sestet_stinger` / `fresh_stinger` / `full_stinger` / `even_stinger` / `odd_stinger` / `capped_stinger` / `wide_stinger` / `prime_gaiter` / `thin_gaiter` / `lean_gaiter` as PAIR / `hollow_gifter` as PAIR / `hollow_marker` as PAIR / `gaunt_stinger` as PAIR / `gaunt_mender` as PAIR
- `camel_taxer` + `hook_taxer` as PAIR / `summon_orther` as PAIR / `summon_filer` as PAIR / `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `fresh_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `camel_warder` as PAIR / `camel_biter` as PAIR
- `thin_gifter` + `octave_mender` / `septet_mender` / `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `wide_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `thin_gaiter` as PAIR / `thin_plater` as PAIR
- `cadence_quinter` + `cadence_quintrer` as PAIR / `cadence_quadder` / `cadence_quarterer` / `cadence_terner` / `cadence_tiercer` / `cadence_capper` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` / `cap_warder`
- `cadence_quintrer` + `cadence_quinter` as PAIR / `cadence_quarterer` / `cadence_tiercer` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_quadder`
- `prime_toller` + `even_toller` / `odd_toller` / `gait_toller` / `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` / `prime_gaiter` as PAIR / `prime_gifter` as PAIR / `prime_plater` as PAIR
- `brick_levier` + `brick_taxer` / `brick_feer` / `brick_holder` / `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `watch_feer` / `octave_holder` as PAIR / `screen_biter`
- `watch_shaver` + `watch_binder` / `watch_taxer` / `watch_drainer` / `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `pair_binder` / `fuse_binder` / `glass_sniper`
- `lean_gaiter` + `thin_gaiter` / `even_gaiter` / `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `wide_stinger` / `hollow_stinger` as PAIR / `lean_gifter` as PAIR / `lean_stinger` as PAIR / `prime_gaiter`
- `glyph_cutter` + `lava_cutter` / `rime_cutter` / `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `slide_cutter` / `glyph_reeler` as PAIR / `glyph_skipper` as PAIR / `glyph_sower` as PAIR / `null_censor`
- `fresh_plater` + `wide_plater` as PAIR / `idle_plater` / `thin_plater` / `fresh_stinger` as PAIR / `camel_taxer` as PAIR / `dry_plater` / `prime_plater` / `full_plater` / `cast_plater` / `summon_plater` / `brace_chanter` / `brood_chanter`
- `kin_turner` + `feud_turner` as PAIR / `psalm_turner` as PAIR / `hymn_turner` as PAIR / `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR

Do **not** spawn Pentadeca Plug on a map with no free 15-cell stretched plus (solvability). Do not spawn Cipher Camel / Cipher Kennel / Fuse Lean on a map with no painted glyph-tax occupancy / no painted fuse in Chebyshev 6 of a legal floor. Do not spawn Cipher Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Watch Lean without an overwatch band (`glass_sniper` / Hold Ground / Far Watch). Twin Gate pads do **not** count as lava, ice, spikes, painted mire, conveyor, glyph-tax, Void Rift, or `map.portals`. Thorned Ground is a **map modifier**, not occupancy. Painted fuse / glyph-tax cells are spell occupancy, not `HazardTileType`.

---

## 4. Family sheets — Wave 21

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-28.md`](https://github.com/Mr-Melic/stralt/pull/1251) (PR #1251) unless marked SDE Wave 19 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-27.md`](https://github.com/Mr-Melic/stralt/pull/1198), PR #1198).

---

### ENEMY_ID: `octave_mender`

- **NAME:** Octave Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 8 AND leftover AP ≠ leftover MP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Octave Mend (`spell-octave-mend`, #1251). Extra door `octave_cantor` — family is **not** that id. Distinct from `septet_mender` (both leftover **sum === 7**), `sestet_mender` (both leftover **sum === 6 AND unequal**), `stave_mender` (both leftover **sum === 5**), `wide_gifter` (one-body leftover **AP≥2 AND MP≥1**), `gait_gifter` (one-body leftover **AP≥2 AND MP=0**), `thin_gifter` (this pass, one-body leftover **1/0**), `prime_gifter` (leftover **exactly 1/1**), `equal_gifter` (target-only tied ≥ 1), `lean_gifter` (leftover **AP=0 and MP≥1**), `gaunt_mender` (both leftover **0**). At most one eight-read heal CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove / Prime / Gait / Wide / Thin.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 8 or either body is tied. Peer: Octave Mend only if both leftover sums === 8 **and** both unequal **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise / Dual Plate / Wide Gift / Wide Plate / Score-blocked — Frost / Shield) or if either body sits (4,4) (Poise) or (4,3) (Septet) or (4,2) (Sestet). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 8 without tying**. If it tops the meter, the kit leaked toward Frost. Dual Keep **cannot** fake this. Even sum — `octaveForbidEqual` is required.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip if either sum ≠ 8 or either body is tied. ELITE: prefer self-cast when the caster already sits on (5,3) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-octave-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Septet Mend / Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Lean Gift / Gaunt Mend / Hollow Gift / Prime Gift / Gait Gift / Wide Gift / Thin Gift.
- **SIGNATURE_MECHANICS:** Four leftover reads + two inequality checks. Legal pairs (8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5). Dual Keep 2/2 is **Poise / Dual Plate / Wide Gift / Wide Plate**, not Octave. Dual Keep **cannot** sit on sum 8. Sestet Lend (4,2)→(5,3) **manufactures** Octave. A 7 AP / 3 MP bar that pays this 3 AP lands at (4,3) and **fails**. A 7 AP / 2 MP bar that pays 3 AP lands at (4,2) and **fails**. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails**. `healAmount` stays 0 on the Octave Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum-or-tie → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Kin Turn / Sestet Lend is already in the pack (COURT, not PAIR with Septet / Sestet / Stave / Score / Tally / Poise / Prime / Gait / Wide / Thin).
- **SYNERGIES:** `kin_turner`, `verse_octaver`, `octave_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 8; dump to 4/3 (Septet); dump to 4/2 (Sestet); dump to 4/4 (Poise); dump to 3/3 (Poise); dump to 3/2 (Stave); Dual Keep; Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (5,3) → (4,3) **Septet**; sit Dual Keep; sit 4/4; kill the cantor first; do not hold 8 leftover unequal in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-mend` (MULTI: family observe **or** `octave_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + two inequality checks + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_quintrer`

- **NAME:** Cadence Quintrer
- **ROLE:** controller (remaining CDs `n===5` → `0`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Quinte (`spell-cadence-quinte`, #1251). Extra door `quinte_precentor` — family is **not** that id. Distinct from `cadence_quarterer` (`n===4` → **0**), `cadence_tiercer` (`n===3` → **0**), `cadence_docker` (`n===2` → **0**), `cadence_snuffer` (`n==1` → **0**), `cadence_quinter` (this pass, `n>5` → **5** — **fives stay 5**), `cadence_quadder` (`n>4` → **4** — **fives become 4**), `cadence_terner` (`n>3` → **3** — **fives become 3**), `cadence_capper` (`n>2` → **2**), `cadence_primer` (`n===0` → `1`), Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0). At most one remaining-5 rewrite CORE per pack as PAIR vs Quint / Quad / Quarte / Tern / Tierce / Dock / Snuff / Cap / Riser / Primer / Thief / Lagger / Staller / Cracker / Flusher. Do **not** mint `cadence_fifth` / `cadence_cinque` / name this family `cadence_quinter`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≠ 5. Peer: Quinte only if a nuke remaining is 5. Above: refuse if the only remaining-5 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **handing the remaining-5 bar back for this tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "quinte_remaining_cds_eq_5_to_0"`. VETERAN: skip all-non-5. ELITE: prefer Inferno remaining 5 over Strike-only. CHAMPION: never Quinte a bar you will Quint the same turn (Quint is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-quinte`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the quinted id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Quint / Quad / Quarte / Tern / Tierce / Dock / Snuff / Cap / Floor / Prime / Rise
- **SIGNATURE_MECHANICS:** Remaining `n===1` / `n===2` / `n===3` / `n===4` / `n>5` unchanged. Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Quint would have **left** a 5; Quad would have written 4; Tern would have written 3; Cap would have written 2; Floor would have written 1; Quarte would have needed remaining 4.
- **VARIANT_PROGRESSION:** BASE remaining-5 unlock → VETERAN skip-no-5 → ELITE nuke-bias → CHAMPION no-same-turn-Quint
- **RARITY_CURVE:** Standard. +ELITE when Verse Octave is already in the pack (COURT).
- **SYNERGIES:** `verse_octaver`, `cadence_quinter` (COURT, not PAIR), `tax_scribe`
- **WEAKNESSES:** Sit remaining at 1 / 2 / 3 / 4 / 6+; recast before Quinte; Cadence Break
- **PLAYER_COUNTERPLAY:** Recast; sit remaining 4 (Quarte’s problem) or 6 (Quint’s problem); Cadence Break
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-quinte` (MULTI: family observe **or** `quinte_precentor` first-win — resolve observes even if every remaining was already ≠ 5)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 0 when n===5)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pentadeca_prelate`

- **NAME:** Pentadeca Prelate
- **ROLE:** summoner (stretched plus longArm 4 / shortArm 3 occupy; counts as **fifteen**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Pentadeca Span (`spell-pentadeca-span`, #1251). Extra door `span_pentadeca` — family is **not** that id. Distinct from `tetradeca_prelate` (2×7 = 14, **nearest-cell click**), `trideca_prelate` (plus arm 3 = 13, **center click**), `hendeca_prelate` (stretched plus longArm 3 / shortArm 2 = 11, **center click**), `penta_prelate` (occupy-weight **5**), `octave_prelate` (this pass, 1-cell leftover-sum post). At most one fifteen-cell occupy CORE per pack. Skip until remaining cap ≥ 15. `summonAI: "pentadecaspan"`. Do **not** mint `spell-fifteen-span`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the stretched plus is not free. Peer: place only if the 15-cell plus cuts a file the player must use. Above: skip if any of the 15 is a portal / occupied / off-map.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 1.00, res 1.10, init 0.80, chc 0.60. Identity is **fifteen occupied cells**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "pentadeca_span_if_stretched_plus_free_and_cuts_a_file"`. VETERAN: skip if remaining cap < 15. ELITE: Octave Hold COURT so they cannot walk around the plus. CHAMPION: never also roll wolf/archer overlay.
- **CORE_SPELL_POOL:** `spell-pentadeca-span`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Tetradeca / Trideca / Hendeca / Penta / Dummy / Octave Post as identity
- **SIGNATURE_MECHANICS:** Click is **center**. Footprint is 9-spine × 7-crossbar (1 + 2×4 + 2×3 = 15). Empty kit. Lifespan 4. Destroying the body frees all fifteen. Live cap is 2 — this card **does not ship** until occupy-weight exists.
- **VARIANT_PROGRESSION:** BASE plus-if-free → VETERAN respect-cap → ELITE Hold-COURT → CHAMPION no-overlay
- **RARITY_CURVE:** Standard. Weight 0 until remaining cap ≥ 15. +ELITE on corridor maps with a free stretched plus.
- **SYNERGIES:** `octave_siller`, `camel_warder`, `octave_holder` (COURT)
- **WEAKNESSES:** Coup the body; blink past; File Lance along the long spine; occupy a cell of the plus before the click
- **PLAYER_COUNTERPLAY:** Sit on a plus cell; Coup; blink
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pentadeca-span` (MULTI: family observe **or** `span_pentadeca` first-win)
- **REWARD_EXPECTATION:** Standard. Pentadeca death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (occupy-weight + stretched-plus placer). Same class as Hendeca / Trideca / Tetradeca.
- **STATUS:** PROPOSED

---

### ENEMY_ID: `kin_turner`

- **NAME:** Kin Turner
- **ROLE:** controller (invert leftover AP↔MP on **the caster and one same-side non-caster ally**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Kin Turn (`spell-kin-turn`, #1251). Distinct from `feud_turner` (**caster + one hostile**), `psalm_turner` (**one same-side non-caster + one hostile**; caster **unchanged**), `hymn_turner` (**two allies**; caster **unchanged**), `duel_turner` (**two hostiles**), `purse_turner` (**one** hostile), `bar_crosser` (two-body **cross**). Reroll if no ally. Do **not** mint `spell-duet-turn` / `spell-mixed-turn`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if both inverts would be no-ops (both already AP===MP). Peer: Kin Turn only if at least one of caster or ally is unequal. Above: skip if no non-self ally is in range 3 (unlike Feud Turn, which needs only a hostile).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.25, chc 0.70. Identity is **the caster’s leftover flip plus one ally leftover flip**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `buffer` (not healer — no `healAmount`). `aiHint: "kin_turn_if_ally_in_r3_and_at_least_one_of_caster_or_ally_is_unequal"`. VETERAN: skip both-tied. ELITE: invert into an Octave window already on both bodies (sum invariant). CHAMPION: never self-target (that is Tempo Invert).
- **CORE_SPELL_POOL:** `spell-kin-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Feud Turn / Psalm Turn / Hymn Turn / Duel Turn / Purse Turn / Bar Cross / Tempo Invert as identity
- **SIGNATURE_MECHANICS:** Each body inverts independently, capped at that pool’s max. Invert (5,3)→(3,5) **stays Octave**. Invert (4,3)→(3,4) **stays Septet**. Invert (4,4) is a no-op (Poise stays Poise). Self-target fizzles. Solo caster does **not** fire.
- **VARIANT_PROGRESSION:** BASE invert-if-unequal → VETERAN skip-both-tied → ELITE keep-Octave → CHAMPION no-self
- **RARITY_CURVE:** Standard. +ELITE in Kin Octave. Never CHAMPION in a solo pack.
- **SYNERGIES:** `octave_mender`, `octave_stinger`, `octave_sipper` (COURT)
- **WEAKNESSES:** Keep leftover AP === leftover MP on both; Quiet Hex after they invert into a 3-AP spell; isolate the Turner
- **PLAYER_COUNTERPLAY:** Isolate; sit tied leftover; kill the Turner first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-kin-turn` (ENEMY_DISCOVERY, piece observe — no extra door)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover snapshots + two writes + self-target reject)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_hooder`

- **NAME:** Octave Hooder
- **ROLE:** protector (next hit is 0 while leftover AP + leftover MP === 8 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Octave Hood (`spell-octave-hood`, #1251). Distinct from `septet_hooder` (sum === 7), `sestet_hooder` (sum === 6 unequal), `wide_plater` (this pass, leftover **AP≥2 AND MP≥1**), `thin_plater` (leftover **1/0**). At most one leftover-sum-8-unequal miss CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Wide Plate / Fresh Plate / Thin / Dual / Prime / Idle.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 8 or tied. Peer: arm only while (5,3) / (8,0) / (0,8) / (7,1) / (1,7) / (6,2) / (2,6) / (3,5). Above: skip if Dual Keep 2/2 (Wide Plate / Poise) or (4,4) (Poise).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.55. Identity is **negating a hit because they hold an Octave pair**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip off-window. ELITE: Octave Sill COURT on the same leftover (COURT, not PAIR). CHAMPION: never become Wide Plate or Septet Hood.
- **CORE_SPELL_POOL:** `spell-octave-hood`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Hood / Wide Plate / Thin Plate / Dual Plate as identity
- **SIGNATURE_MECHANICS:** Hold (5,3). Dual Keep 2/2 is Dual Plate / Poise Hood / Wide Gift / Wide Plate, **not** this. (4,4) is Poise. Even sum — equality ban required. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE octave-miss → VETERAN skip-off-window → ELITE Sill-COURT → CHAMPION no-wide-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits that cannot force a spend.
- **SYNERGIES:** `octave_siller` (COURT, not PAIR), `plate_warden`, `octave_lender` (COURT)
- **WEAKNESSES:** Spend a pool so sum leaves 8; sit Dual Keep; wait the charge out
- **PLAYER_COUNTERPLAY:** Spend 1 AP from (5,3); sit Dual Keep; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-hood` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover-sum-8-unequal at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_stinger`

- **NAME:** Octave Stinger
- **ROLE:** assassin (10 + 8 iff leftover AP + leftover MP === 8 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Octave Sting (`spell-octave-sting`, #1251). Distinct from `septet_stinger` (sum === 7), `sestet_stinger` (sum === 6 unequal), `wide_stinger` (leftover **AP≥2 AND MP≥1**), `hollow_stinger` (this pass, leftover **0/0**), `lean_gaiter` (this pass, leftover **AP=0 AND MP≥1**). At most one leftover-sum-8-unequal poke CORE per pack as PAIR vs Septet / Sestet / Wide / Hollow / Lean / Thin / Prime / Fresh / Capped.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 8 or tied. Peer: bonus path only on an Octave pair. Above: skip if leftover is (4,3) (Septet) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **poking leftover sum 8 unequal**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip bonus off-window (10 still). ELITE: Kin Turn COURT to keep sum 8. CHAMPION: never also fire Wide Sting’s rider as identity.
- **CORE_SPELL_POOL:** `spell-octave-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Sting / Wide Sting / Hollow Sting / Lean Gait as identity
- **SIGNATURE_MECHANICS:** Legal bonus pairs (8,0) (0,8) (7,1) (1,7) (6,2) (2,6) (5,3) (3,5). Dual Keep 2/2 is Poise / Dual Plate / Wide. (4,4) is Poise. (4,3) is Septet. Off-window still observes.
- **VARIANT_PROGRESSION:** BASE octave-poke → VETERAN skip-bonus-off-window → ELITE Kin-COURT → CHAMPION no-wide-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep kits that somehow bank 8 (they cannot — +ELITE vs Haste / Tempo Gift / Sestet Lend packs).
- **SYNERGIES:** `kin_turner`, `octave_mender`, `verse_octaver`
- **WEAKNESSES:** Spend off sum 8; sit Dual Keep; Barrier
- **PLAYER_COUNTERPLAY:** Spend a pool; sit 4/4; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-sting` (ELITE, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum-8-unequal gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_stepper`

- **NAME:** Octave Stepper
- **ROLE:** teleporter (land on a free Chebyshev-1 of an ally whose leftover AP + leftover MP === 8 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Octave Step (`spell-octave-step`, #1251). Distinct from `septet_stepper` (sum === 7), `sestet_stepper` (sum === 6 unequal), `home_stepper` (**ungated**). Reroll if no ally. Relocate, not `isSwap`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no ally sits an Octave pair. Peer: step only onto a free Chebyshev-1 of that ally. Above: skip if the landing cell is a fuse / glyph-tax / lava.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.25, chc 0.90. Identity is **joining the Octave body**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "step_adjacent_ally_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip if no free landing. ELITE: Octave Mend COURT after joining. CHAMPION: never Swap-peel (that is Hook Chaplain).
- **CORE_SPELL_POOL:** `spell-octave-step`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-shield`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Step / Home Step / Swap as identity
- **SIGNATURE_MECHANICS:** Does **not** increment `walkMpSpentThisTurn`. Observation is the **arm**. Occupying the landing tiles is the counter.
- **VARIANT_PROGRESSION:** BASE join-octave → VETERAN no-fizzle-landing → ELITE Mend-COURT → CHAMPION no-swap-clone
- **RARITY_CURVE:** Standard. +ELITE in Octave Quiet. Never CHAMPION in a solo pack.
- **SYNERGIES:** `octave_mender`, `cover_squire`, `leash_warden`
- **WEAKNESSES:** Occupy the ring; spend the ally off sum 8; isolate
- **PLAYER_COUNTERPLAY:** Stand on the landing tiles; spend the ally’s leftover; Root
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-step` (ENEMY_DISCOVERY, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (occupancy walk + leftover-sum gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_siller`

- **NAME:** Octave Siller
- **ROLE:** hazard creator (occupant leftover AP + leftover MP === 8 AND unequal at **start of their turn** takes 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Octave Sill (`spell-octave-sill`, #1251). Distinct from `septet_siller` (sum === 7), `sestet_siller` (sum === 6 unequal), `hollow_marker` (this pass, end-turn leftover **0/0**), `idle_marker` (end-turn leftover **MP equals max**). At most one leftover-sum-8-unequal start-turn tax CORE per pack as PAIR vs Septet / Sestet / Hollow Mark / Idle Mark / Wake / Dwell.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they will not camp. Peer: paint the cell they must occupy next turn start. Above: skip if they already sit Dual Keep 2/2 or (4,4).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.05, res 0.80, init 1.10, chc 0.75. **0 HP on the paint.** If it is a damage dealer on **cast turn**, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "paint_sill_if_occupant_will_start_turn_leftover_sum_eq_8_unequal"`. VETERAN: never paint a cell they can ignore. ELITE: Octave Hood COURT so they eat miss **and** sill. CHAMPION: two live sills max; last-writer vs other sills (one tax).
- **CORE_SPELL_POOL:** `spell-octave-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Sill / Hollow Mark / Idle Mark as identity
- **SIGNATURE_MECHANICS:** Dual Keep 2/2 **misses**. (4,4) **misses**. Paint stays after a miss. Observation is the **paint**.
- **VARIANT_PROGRESSION:** BASE camp-tax → VETERAN on-path-only → ELITE Hood-COURT → CHAMPION dual-sill
- **RARITY_CURVE:** Standard. +ELITE in Octave Gate.
- **SYNERGIES:** `octave_prelate`, `octave_stinger`, `octave_hooder` (COURT)
- **WEAKNESSES:** Spend off sum 8 before turn start; leave the cell; Barrier replaces paint
- **PLAYER_COUNTERPLAY:** Step off; spend a pool; Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-sill` (ENEMY_DISCOVERY, piece observe — paint)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (start-of-turn leftover-sum reader on painted occupancy)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_holder`

- **NAME:** Octave Holder
- **ROLE:** controller (cannot walk while leftover AP + leftover MP === 8 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Octave Hold (`spell-octave-hold`, #1251). Distinct from `septet_holder` (while sum === 7), `sestet_holder` (while sum === 6 unequal), `brick_holder` (**barrier adjacent**), `must_octaver` (this pass, **tools** need sum === 8 unequal). **Do not PAIR with Must Octave.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 8 or tied. Peer: Hold only while they sit an Octave pair. Above: skip if Root is already up.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.85, sr 1.05, res 1.05, init 1.00, chc 0.70. Identity is **pinning a fat leftover walk**. If it tops the meter, the kit leaked toward Root.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "forbid_walk_while_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip off-window. ELITE: Must Octave COURT so tools **and** walk need the window (COURT, never PAIR on one BASE kit). CHAMPION: never also Root as identity.
- **CORE_SPELL_POOL:** `spell-octave-hold`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Must Octave / Septet Hold / Brick Hold as identity
- **SIGNATURE_MECHANICS:** (0,8) has MP but cannot spend it on a walk. Spend leftover AP **or** dump to 4/3. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE pin-octave-walk → VETERAN skip-off-window → ELITE Must-COURT → CHAMPION no-root-clone
- **RARITY_CURVE:** Standard. +ELITE in Octave Hold File.
- **SYNERGIES:** `must_octaver` (COURT, not PAIR), `leash_warden`, `snare_weaver`
- **WEAKNESSES:** Spend leftover AP; dump to 4/3; Swap
- **PLAYER_COUNTERPLAY:** Spend leftover AP; Swap; sit Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-hold` (ENEMY_DISCOVERY, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk forbid while leftover-sum-8-unequal)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_lender`

- **NAME:** Octave Lender
- **ROLE:** buffer (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 8 AND unequal — **exits** to sum 10)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. CORE is Octave Lend (`spell-octave-lend`, #1251). Distinct from `septet_lender` (sum === 7 → 9), `sestet_lender` (sum === 6 unequal → **8**, which **manufactures this family’s window**), `tempo_precentor` (ungated +1 AP next turn). Reroll if no ally. At most one leftover-sum-8-unequal lend CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Lean / Spent / Boot / Drift / Tempo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally sits an Octave pair. Peer: Lend only if the cash-out does not feed a lethal Strike this tick. Above: skip if they already sit sum 10.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.80, sr 1.00, res 0.80, init 1.30, chc 0.70. Init is high so the gift lands **before** the ally acts. If this unit tops the damage meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "lend_ap_mp_if_ally_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip off-window. ELITE: gift the Octave Stinger / Mender. CHAMPION: never Tempo-Gift as identity.
- **CORE_SPELL_POOL:** `spell-octave-lend`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-iron-skin` (on the gifted carry)
- **ELITE_SPELL_POOL:** none — do **not** add Septet Lend / Tempo Gift / Sestet Lend as identity
- **SIGNATURE_MECHANICS:** (5,3)→(6,4) **exits** Octave. Sestet Lend (4,2)→(5,3) **manufactures** Octave. Not `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE cash-octave → VETERAN skip-off-window → ELITE gift-the-payoff → CHAMPION no-tempo-clone
- **RARITY_CURVE:** Standard. +VETERAN in Lend Hood.
- **SYNERGIES:** `octave_stinger`, `octave_mender`, `octave_hooder` (COURT)
- **WEAKNESSES:** Isolated 1v1; spend the ally off sum 8 before the lend; kill the Lender first
- **PLAYER_COUNTERPLAY:** Focus the buffer; spend the ally first; Null Field
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-lend` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum gate + +1/+1 write)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_sipper`

- **NAME:** Octave Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover AP + leftover MP === 8 AND unequal and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Octave Sip (`spell-octave-sip`, #1251). Distinct from `septet_sipper` (sum === 7), `sestet_sipper` (sum === 6 unequal), `bare_sipper` (steal iff leftover **MP = 0**). At most one leftover-sum-8-unequal sip CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Bare / Parched / Gait / Drift / Soul / Ledger / Watch.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP = 0 (0,8 fizzles). Peer: Sip only on an Octave pair with leftover AP ≥ 1. Above: prefer sip that manufactures Septet for a Septet Stinger COURT (not PAIR).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 1.00, res 0.75, init 1.20, chc 0.85. Identity is **peeling Octave into Septet**. If it tops the meter, the kit leaked toward Drain.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sip_leftover_ap_if_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: skip (0,8). ELITE: Sip then Septet Sting COURT. CHAMPION: never Bare-Sip as identity.
- **CORE_SPELL_POOL:** `spell-octave-sip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Septet Sip / Bare Sip / Soul Siphon as identity
- **SIGNATURE_MECHANICS:** (5,3)→(4,3) **Septet**. (8,0)→(7,0) **Septet**. Every successful Octave Sip **manufactures Septet**. (0,8) fizzles (no AP). Observation is the **arm** (fizzle after AP still observes).
- **VARIANT_PROGRESSION:** BASE sip-octave → VETERAN skip-no-AP → ELITE Septet-COURT → CHAMPION no-bare-clone
- **RARITY_CURVE:** Standard. +ELITE in Purse Octave.
- **SYNERGIES:** `kin_turner`, `septet_stinger` (COURT, not PAIR), `octave_mender`
- **WEAKNESSES:** Sit (0,8); spend leftover AP first; Dual Keep
- **PLAYER_COUNTERPLAY:** Sit (0,8); spend leftover AP; Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-sip` (ENEMY_DISCOVERY, piece observe — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-sum + leftover-AP≥1 gate + steal 1)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_prelate`

- **NAME:** Octave Prelate
- **ROLE:** summoner (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 8 AND unequal** deals 10 and it dies)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Octave Post (`spell-octave-post`, #1251). Distinct from `septet_prelate` (sum === 7), `sestet_prelate` (sum === 6 unequal), `dummy_prelate` (taunt), `oct_prelate` (occupy-weight **8**), `octa_oather` (exact-8 **spell gate**). At most one leftover-sum-8-unequal post CORE per pack. Counts as **1**. `summonAI: "octavepost"`. Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place on the cell they will camp. Peer: skip if remaining cap < 1. Above: skip if they already sit Dual Keep 2/2 or (4,4) (Poise Post’s window).
- **STAT_SCALING_RULE:** hp 0.95, sp 0.75, sr 1.00, res 1.05, init 0.75, chc 0.60. Identity is **the post**, not a shooter. Empty kit on the post.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "octave_post_if_empty_cell_and_they_will_camp_sum_8_unequal"`. VETERAN: skip if cap reached. ELITE: Octave Sill COURT on a **neighbor** cell (not on the post). CHAMPION: never turret / wolf / archer / bomber on this body.
- **CORE_SPELL_POOL:** `spell-octave-post`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the post)
- **RARE_SPELL_POOL:** `spell-mark` on a tile **beside** the post
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / Dummy / Septet Post as identity
- **SIGNATURE_MECHANICS:** Occupant leftover 4/4 → no detonate (Poise). 4/3 → no detonate (Septet). 4/2 → no detonate (Sestet). 3/3 → no detonate (Poise). 3/2 → no detonate (Stave). 0/0 → no detonate (Gaunt). Empty tile → no detonate, lifespan ticks. Counts as **1**. Observation is the **summon**.
- **VARIANT_PROGRESSION:** BASE camp-post → VETERAN respect-cap → ELITE Sill-neighbor → CHAMPION no-overlay
- **RARITY_CURVE:** Standard. +ELITE in Octave Gate.
- **SYNERGIES:** `octave_siller`, `octave_stinger`, `must_octaver`
- **WEAKNESSES:** Spend off sum 8; Coup the post; sit Dual Keep
- **PLAYER_COUNTERPLAY:** Spend a pool; Coup; do not camp (5,3) on it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-post` (ENEMY_DISCOVERY — summon is observation; later detonate is not a second observe)
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED (new `SUMMON_KIT.octavepost`; do not reuse Dummy / Septet Post)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `octave_bouncer`

- **NAME:** Octave Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===8-unequal hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Octave Bounce (`spell-octave-bounce`, #1251). Distinct from `septet_bouncer` (second body sum === 7), `sestet_bouncer` (second body sum === 6 unequal), `storm_caller` (always bounce), `ricochet_vicar` (conditional bounce). At most one leftover-sum-8-unequal bounce CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Gaunt / Parched / Heave / Storm / Ricochet.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second Octave body. Peer: Bounce only if two player-side bodies sit Octave pairs. Above: refuse Bounce without a second Octave body (12 only is honest — still prefer Frost if the second 12 is the identity).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.20, sr 0.90, res 0.80, init 1.00, chc 1.05.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bounce_if_second_hostile_leftover_ap_plus_mp_eq_8_unequal"`. VETERAN: count occupancy, never name. ELITE: wait one turn if Kin Turn will create the second Octave body. CHAMPION: never Chain-Lightning as identity.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-octave-bounce`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `starter-blast` (only if two bodies already stacked — else skip)
- **RARE_SPELL_POOL:** `thunder_clap`
- **ELITE_SPELL_POOL:** none — honesty is the elite
- **SIGNATURE_MECHANICS:** Second 12 needs **two** Octave bodies. Missing flag → 12 only. Dual Keep 2/2 is **not** a second Octave body.
- **VARIANT_PROGRESSION:** BASE frost+bounce → VETERAN two-body-gate → ELITE wait-for-Kin → CHAMPION no-chain-clone
- **RARITY_CURVE:** Standard. +ELITE in Bounce Octave.
- **SYNERGIES:** `must_octaver`, `fuse_binder`, `kin_turner`
- **WEAKNESSES:** Spend one body off sum 8; sit Dual Keep on one; Barrier
- **PLAYER_COUNTERPLAY:** Desync leftover; Barrier; split so only one Octave pair exists
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-octave-bounce` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (nearest-other leftover-sum-8-unequal bounce)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_octaver`

- **NAME:** Must Octaver
- **ROLE:** controller (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 8 AND unequal **and** this spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Must Octave (`spell-must-octave`, #1251). Distinct from `must_septeter` (sum === 7 / last AP), `must_sesteter` (sum === 6 unequal / last AP), `octave_holder` (this pass, **walk** needs sum ≠ 8 unequal). **Do not PAIR with Octave Hold.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover sum ≠ 8 or tied. Peer: Must only if they have a non-Strike they want this tick. Above: skip if Strike from this body would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.15, chc 0.90. Identity is **locking tools to the Octave window**. If it tops the meter, the kit leaked toward Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "must_octave_if_hostile_has_non_strike_and_leftover_not_sum_8_unequal"`. VETERAN: skip if they only have Strike. ELITE: Octave Hold COURT so walk **and** tools need the window (COURT, never PAIR). CHAMPION: never Hex as identity.
- **CORE_SPELL_POOL:** `spell-must-octave`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-hex` only if they already sit Octave
- **ELITE_SPELL_POOL:** none — do **not** add Must Septet / Octave Hold / Hex as identity
- **SIGNATURE_MECHANICS:** Strike stays legal. Last-AP gate: this spell must spend last AP. Inverse of Octave Hold. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE lock-tools → VETERAN skip-strike-only → ELITE Hold-COURT → CHAMPION no-hex-clone
- **RARITY_CURVE:** Standard. +ELITE in Octave Hold File / Bounce Octave.
- **SYNERGIES:** `octave_holder` (COURT, not PAIR), `octave_bouncer`, `leash_warden`
- **WEAKNESSES:** Strike through the lock; sit Dual Keep; spend to an Octave pair then recast
- **PLAYER_COUNTERPLAY:** Strike; sit Dual Keep; dump to 4/3 then recast
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-octave` (ENEMY_DISCOVERY, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (non-Strike legality + leftover-sum-8-unequal + last-AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_octaver`

- **NAME:** Verse Octaver
- **ROLE:** debuffer (last resolved id **illegal until leftover AP + leftover MP === 8 AND unequal**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Verse Octave (`spell-verse-octave`, #1251). Distinct from `verse_septeter` (until sum === 7), `verse_sesteter` (until sum === 6 unequal), `last_muter` (**duration**). Fails closed until `lastResolvedSpellId` exists. At most one leftover-sum-8-unequal verse CORE per pack as PAIR vs Septet / Sestet / Stave / Score / Tally / Poise / Gaunt / Lean / Pace / Last Mute / Verse Tax / First Verse / Once / Summon Verse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last id. Peer: Verse only if the last id is a nuke. Above: skip if they already sit an Octave pair (the lock would not bite).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 1.00, res 0.75, init 1.15, chc 0.80. Identity is **locking recast until leftover sum 8 unequal**. If it tops the meter, the kit leaked toward Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_octave_if_last_id_is_nuke_and_leftover_not_sum_8_unequal"`. VETERAN: skip if no `lastResolvedSpellId`. ELITE: Cadence Quinte COURT so the unlocked remaining-5 id is **also** their last verse. CHAMPION: never Last Mute as identity.
- **CORE_SPELL_POOL:** `spell-verse-octave`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Verse Septet / Last Mute / Cadence Quinte as identity
- **SIGNATURE_MECHANICS:** Recast Inferno only after **sum === 8 unequal**. 2/2 and 4/4 and 4/3 and 4/2 and 3/3 and 0/0 do **not** lift. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE lock-last-id → VETERAN skip-no-last → ELITE Quinte-COURT → CHAMPION no-mute-clone
- **RARITY_CURVE:** Standard. +ELITE in Octave Choir / Quinte Verse.
- **SYNERGIES:** `octave_mender`, `cadence_quintrer` (COURT), `tax_scribe`
- **WEAKNESSES:** Sit an Octave pair; Strike (ungated); Cadence Break the last id another way
- **PLAYER_COUNTERPLAY:** Sit (5,3); Strike; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-octave` (ENEMY_DISCOVERY, piece observe — arm). Fails closed until `lastResolvedSpellId` writes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (`lastResolvedSpellId` + leftover-sum-8-unequal gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `camel_warder`

- **NAME:** Camel Warder
- **ROLE:** controller / kiter (next walk legal only if `(|dx|,|dy|)` is a permutation of (3,2))
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Camel Stride (`spell-camel-stride`, #1198). Extra room `camel_gallery` — family is **not** that id. Distinct from `hook_warder` (**only** `(3,1)`), `tern_warder` (Chebyshev **exactly 3, orthogonal only**), `knight_warder` (**only** `(2,1)`), `ring_warder` (Chebyshev **exactly 2**, knight excluded), `camel_biter` (this pass, bonus poke). At most one (3,2) walk-lock CORE per pack as PAIR vs Hook / Tern / Knight / Ring / Camel Bite.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they must orthogonal-3, hook-step, knight-step, or step-1 to threaten. Peer: arm only if a (3,2) dest threatens. Above: skip if Root is already up and Strike kills.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.80, init 1.20, chc 0.90. Identity is **eight camel dests**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_camel_3_2"`. VETERAN: skip if they must adjacent-walk. ELITE: Camel Bite COURT after landing a camel cell (COURT, not PAIR). CHAMPION: never arm chargers who only walk adjacent. Does **not** read `currentView`.
- **CORE_SPELL_POOL:** `spell-camel-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Hook Stride / Tern Stride / Knight Stride / Camel Bite / Pack Camel as identity
- **SIGNATURE_MECHANICS:** Legal dests are the eight cells `(±3,±2)` and `(±2,±3)`. Orthogonal dests including Tern Stride’s `(±3,0)/(0,±3)`, hook dests `(3,1)`, knight dests `(2,1)`, Chebyshev-3 dests `(3,0)` confirm-fail (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Observation is the **arm**, not the later walk.
- **VARIANT_PROGRESSION:** BASE camel-lock → VETERAN skip-must-adjacent → ELITE Bite-COURT → CHAMPION no-charger-kit
- **RARITY_CURVE:** Standard. +ELITE on open boards with free camel cells.
- **SYNERGIES:** `deca_oather`, `camel_biter` (COURT, not PAIR), `glass_sniper`
- **WEAKNESSES:** Stand at Chebyshev 1, 2, 3-orthogonal, or 4; occupy the eight camel cells; Root before they arm
- **PLAYER_COUNTERPLAY:** Occupy camel cells; Root; stand adjacent
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-camel-stride` (MULTI: family observe **or** `camel_gallery` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next-walk dest gate on eight cells)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `deca_oather`

- **NAME:** Deca Oather
- **ROLE:** controller (next non-Strike spell illegal unless Chebyshev = 10)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Deca Oath (`spell-deca-oath`, #1198). Extra room `deca_nave` — family is **not** that id. Distinct from `nona_oather` (exact **9**), `octa_oather` (exact **8**), `dec_prelate` (occupy-weight 10), `long_oather` (**≥ 3**). At most one exact-10 spell-gate CORE per pack as PAIR vs Nona / Octa / Hepta / Hexa / Penta / Quad / Long / Dec Prelate. Do **not** mint `spell-deca-span`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they cannot reach 10 this turn (use Strike). Peer: arm only if a legal 10 exists. Above: skip if Root is already up.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, res 0.75, init 1.15, chc 0.85. Identity is **exact-10 spell gate**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_10"`. VETERAN: skip if they cannot reach 10. ELITE: Far Sting as the gated poke. CHAMPION: never fizzle Frost at 9.
- **CORE_SPELL_POOL:** `spell-deca-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if they already sit at 10
- **ELITE_SPELL_POOL:** none — do **not** add Nona Oath / Dec Span / Far Hood as identity
- **SIGNATURE_MECHANICS:** `physical_attack` stays legal at any range. If they arm then walk to 9, the spell fizzles on confirm (AP not spent for the fizzled spell; Deca Oath already observed). Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE exact-10 gate → VETERAN skip-no-10 → ELITE Far-Sting → CHAMPION no-fizzle-at-9
- **RARITY_CURVE:** Standard. +ELITE on long-corridor maps.
- **SYNERGIES:** `camel_warder`, `glass_sniper`, `far_stinger`
- **WEAKNESSES:** Close to 9 or 11; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Close to 9; Root; Strike through the gate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-deca-oath` (MULTI: family observe **or** `deca_nave` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell exact Chebyshev 10)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `glyph_reeler`

- **NAME:** Glyph Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest **painted glyph-tax occupancy**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. CORE is Glyph Reel (`spell-glyph-reel`, #1198). Extra room `cipher_aisle` — family is **not** that id. Distinct from `slide_reeler` (painted **conveyor**), `brick_reeler` (**barrier**), `mire_reeler` (painted **mire**), `glyph_sower` (**paints** glyph-tax), `glyph_cutter` (this pass, threshold poke). At most one glyph-tax pull CORE per pack as PAIR vs Slide / Brick / Mire / Glyph Cut / Glyph Sower.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no painted glyph-tax in radius. Peer: Reel only if ≥1 hostile would move **or** one would land nearer a glyph-tax cell. Above: skip if the hole is safer for the player. Dest is never `map.portals`.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.80.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "attract_toward_nearest_glyph_tax"`. VETERAN: skip empty board. ELITE: Glyph Cut COURT after the pull (COURT, not PAIR). CHAMPION: never dest onto a world portal.
- **CORE_SPELL_POOL:** `spell-glyph-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the glyph-tax cell, `spell-slow` after they land
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Slide Reel / Glyph Cut / Sinkhole as identity
- **SIGNATURE_MECHANICS:** Fourteenth `applyAttract` dest flavor. Twin Gate pads are **not** glyph-tax. Empty board / no painted glyph-tax fizzles after AP (still observes).
- **VARIANT_PROGRESSION:** BASE pull-if-glyph → VETERAN skip-empty → ELITE Cut-COURT → CHAMPION no-portal-dest
- **RARITY_CURVE:** Standard. +ELITE on cipher maps. Weight 0 if pack already has a Glyph Reeler.
- **SYNERGIES:** `glyph_sower` (COURT, not PAIR), `camel_biter`, `glyph_cutter` (COURT, not PAIR)
- **WEAKNESSES:** No painted glyph-tax; Barrier between you and the cell; body-block with a summon
- **PLAYER_COUNTERPLAY:** Spread; occupy the glyph-tax cell first; do not clump at radius 2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-glyph-reel` (MULTI: family observe **or** `cipher_aisle` first-win — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`applyAttract` with nearest painted glyph-tax attractor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `camel_biter`

- **NAME:** Camel Biter
- **ROLE:** bruiser (10 + 8 if share a **(3,2)** vector)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Camel Bite (`spell-camel-bite`, #1198). Distinct from `hook_biter` (`(3,1)`), `diag_biter` (`\|dx\|==\|dy\|`), `file_biter` (share **file only**), `rank_biter` (share **rank only**), `axis_biter` (share rank **or** file), `camel_warder` (this pass, walk lock). At most one (3,2) poke CORE per pack as PAIR vs Hook / Diag / File / Rank / Axis / Camel Warder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they do not share a (3,2). Peer: bonus path only on the camel. Above: skip if dest/bonus would count a hook cell (fail closed).
- **STAT_SCALING_RULE:** hp 0.90, sp 1.10, sr 0.85, res 0.80, init 1.10, chc 1.05. Identity is **18 on the camel**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "bonus_if_share_camel_3_2_with_caster"`. VETERAN: skip bonus off-camel (10 still). ELITE: Camel Stride COURT then Bite (COURT, not PAIR). CHAMPION: never also fire Hook Bite’s rider as identity.
- **CORE_SPELL_POOL:** `spell-camel-bite`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Hook Bite / Camel Stride / Diag Bite as identity
- **SIGNATURE_MECHANICS:** Rank-only / file-only / hook / knight / orthogonal-3 → 10 only. Off-camel still observes.
- **VARIANT_PROGRESSION:** BASE camel-poke → VETERAN skip-bonus-off-camel → ELITE Stride-COURT → CHAMPION no-hook-clone
- **RARITY_CURVE:** Standard. +ELITE on open boards with free camel cells.
- **SYNERGIES:** `camel_warder` (COURT, not PAIR), `glyph_reeler`, `camel_taxer`
- **WEAKNESSES:** Stand off the camel; Barrier; Root
- **PLAYER_COUNTERPLAY:** Stand adjacent or on a hook cell; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-camel-bite` (ELITE, piece observe — off-camel still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (share-(3,2) predicate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hollow_marker`

- **NAME:** Hollow Marker
- **ROLE:** hazard creator (cell detonates at **end of turn** if leftover AP **and** leftover MP are **both 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Hollow Mark (`spell-hollow-mark`, #1198). Extra room `hollow_pulpit` — family is **not** that id. Distinct from `idle_marker` (leftover **MP equals max**), `last_marker` (last leftover **AP**), `dwell_marker` (any end-turn occupy), `hollow_gifter` / `gaunt_mender` (0/0 **heal**), `hollow_stinger` (this pass, 0/0 **poke**). At most one leftover-0/0 paint CORE per pack as PAIR vs Idle / Last / Dwell / Hollow Gift / Hollow Sting / Gaunt.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they will not dump both pools. Peer: paint the cell they will occupy at turn end after spending. Above: skip if Dual Keep 2/2 will survive (not 0/0).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.05, res 0.80, init 1.10, chc 0.75. **0 HP on the paint.**
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_turn_end_leftover_ap_and_mp_eq_0"`. VETERAN: skip if they will hold leftover. ELITE: Hollow Sting COURT on the same 0/0 (COURT, not PAIR). CHAMPION: never Idle Mark as identity.
- **CORE_SPELL_POOL:** `spell-hollow-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Idle Mark / Hollow Sting / Gaunt Mend as identity
- **SIGNATURE_MECHANICS:** They must **spend both leftover pools** for this paint to fire. Dual Keep 2/2 **misses**. Observation is the **paint**; later detonate is not a second observe.
- **VARIANT_PROGRESSION:** BASE spent-bar-paint → VETERAN skip-will-hold → ELITE Sting-COURT → CHAMPION no-idle-clone
- **RARITY_CURVE:** Standard. +ELITE vs kits that dump both leftover pools.
- **SYNERGIES:** `hollow_stinger` (COURT, not PAIR), `thin_gifter`, `plate_warden`
- **WEAKNESSES:** Hold leftover AP or MP; leave the cell; Dual Keep
- **PLAYER_COUNTERPLAY:** Hold 1 leftover; Dual Keep; step off
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hollow-mark` (MULTI: family observe **or** `hollow_pulpit` first-win — paint observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (end-of-turn leftover 0/0 reader on painted occupancy)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wide_plater`

- **NAME:** Wide Plater
- **ROLE:** protector (next hit is 0 while leftover AP ≥ 2 AND leftover MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Wide Plate (`spell-wide-plate`, #1198). Distinct from `thin_plater` (leftover **1/0**), `prime_plater` (leftover **1/1**), `dual_plater` (leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**), `wide_stinger` (same window, **damage**), `wide_gifter` (same window, **heal**), `idle_plater` (leftover **MP equals max**), `fresh_plater` (this pass, leftover AP **equals max**). **Do not PAIR with `wide_gifter` / `wide_stinger` / `dual_keeper`.** Dual Keep 2/2 **can** fake this window.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover is 1/0 (Thin Plate) or 1/1 (Prime Plate). Peer: arm only while leftover AP ≥ 2 AND leftover MP ≥ 1. Above: skip if they will spend both pools first.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **negating a hit because they hold a fat leftover**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_ge_2_and_mp_ge_1"`. VETERAN: skip if leftover AP < 2 or leftover MP = 0. ELITE: Wide Gift COURT on the same leftover window (COURT, not PAIR). CHAMPION: never become Thin Plate or Dual Plate as identity.
- **CORE_SPELL_POOL:** `spell-wide-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Wide Gift / Wide Sting / Dual Plate / Thin Plate as identity
- **SIGNATURE_MECHANICS:** Dual Keep 2/2 **is** this window **and** Poise **and** Dual Plate **and** Wide Gift **and** Wide Sting. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE fat-miss → VETERAN skip-thin-window → ELITE Gift-COURT → CHAMPION no-dual-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep 2/2 kits.
- **SYNERGIES:** `fresh_plater` (COURT, not PAIR), `plate_warden`, `wide_gifter` (COURT, not PAIR)
- **WEAKNESSES:** Spend leftover AP below 2 or leftover MP to 0; wait the charge out
- **PLAYER_COUNTERPLAY:** Spend leftover AP; dump MP; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wide-plate` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover AP≥2 AND MP≥1 at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `fuse_skipper`

- **NAME:** Fuse Skipper
- **ROLE:** kiter (next walk of **pathLength exactly 1** ignores painted-fuse detonate this enter)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Fuse Skip (`spell-fuse-skip`, #1198). Extra room `fuse_nave` — family is **not** that id. Distinct from `brier_skipper` (Thorned extra + pathLength **2**, not occupancy), `slide_skipper` (**conveyor** auto-push, length 1), `rift_skipper` (**Void Rift** tax), `fuse_binder` (**paints** the delayed fuse). At most one fuse-ignore CORE per pack as PAIR vs Brier / Slide / Rift / Fuse Binder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no painted fuse on a length-1 step. Peer: arm only if a length-1 step onto a fuse threatens. Above: skip if they must pathLength ≥ 2 (still detonates).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.80, init 1.25, chc 0.90. Identity is **stepping onto a wick at length 1**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "skip_fuse_detonate_on_path_length_1"`. VETERAN: skip if no fuse in Chebyshev 1. ELITE: Fuse Binder COURT so the wick exists (COURT, not PAIR). CHAMPION: never Brier Skip as identity. Fuse timer still ticks.
- **CORE_SPELL_POOL:** `spell-fuse-skip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-shield`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Brier Skip / Slide Skip / Fuse Tile as identity
- **SIGNATURE_MECHANICS:** PathLength ≥ 2 still detonates. Observation is the **arm**; later ignored detonate is not a second observe. Painted fuse is spell occupancy, not `HazardTileType`.
- **VARIANT_PROGRESSION:** BASE length-1-fuse-step → VETERAN skip-no-fuse → ELITE Binder-COURT → CHAMPION no-brier-clone
- **RARITY_CURVE:** Standard. +ELITE on wick maps. Weight 0 if no painted fuse will exist.
- **SYNERGIES:** `fuse_binder` (COURT, not PAIR), `lean_gaiter`, `mist_walker`
- **WEAKNESSES:** Force a length ≥ 2 walk; wait the fuse tick; occupy the fuse cell
- **PLAYER_COUNTERPLAY:** Do not let them adjacent-step the wick; Bash them length 2 onto it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-fuse-skip` (MULTI: family observe **or** `fuse_nave` first-win — arm observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (pathLength 1 + painted-fuse occupancy ignore this enter)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hollow_stinger`

- **NAME:** Hollow Stinger
- **ROLE:** assassin (10 + 8 iff leftover AP **=== 0 AND leftover MP === 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Hollow Sting (`spell-hollow-sting`, #1198). Distinct from `thin_gaiter` (leftover **1/0**), `wide_stinger` (leftover **AP≥2 AND MP≥1**), `prime_gaiter` (leftover **1/1**), `fresh_stinger` (leftover AP **equals max**), `hollow_gifter` / `gaunt_mender` (**heal** on leftover 0/0), `hollow_marker` (this pass, 0/0 **paint**), `gaunt_stinger` (Wave 14 leftover-MP=0 sting — different window). At most one leftover-0/0 poke CORE per pack as PAIR vs Thin / Wide / Prime / Fresh / Hollow Gift / Hollow Mark / Gaunt.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover is not 0/0. Peer: bonus path only on a spent bar. Above: skip if Dual Keep 2/2 will survive.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **poking a spent bar**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_0_and_mp_eq_0"`. VETERAN: skip bonus off-window (10 still). ELITE: Hollow Mark COURT on the same 0/0 (COURT, not PAIR). CHAMPION: never also fire Thin Gait’s rider as identity.
- **CORE_SPELL_POOL:** `spell-hollow-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Hollow Gift / Hollow Mark / Thin Gait / Gaunt Sting as identity
- **SIGNATURE_MECHANICS:** Dual Keep 2/2 is **not** this. Off-window still observes.
- **VARIANT_PROGRESSION:** BASE spent-poke → VETERAN skip-bonus-off-window → ELITE Mark-COURT → CHAMPION no-thin-clone
- **RARITY_CURVE:** Standard. +ELITE vs kits that dump both leftover pools.
- **SYNERGIES:** `hollow_marker` (COURT, not PAIR), `thin_gifter`, `gaunt_mender` (COURT, not PAIR)
- **WEAKNESSES:** Hold 1 leftover AP or MP; Dual Keep; Barrier
- **PLAYER_COUNTERPLAY:** Hold leftover; Dual Keep; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hollow-sting` (ELITE, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover 0/0 gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `camel_taxer`

- **NAME:** Camel Taxer
- **ROLE:** anti-summon (allied summons pay +1 **AP** if this turn’s walk **landing** is a **(3,2)** from origin)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Summon Camel (`spell-summon-camel`, #1198). Distinct from `hook_taxer` (landing **(3,1)**), `summon_orther` (per **diagonal step**), `summon_filer` (walk **off file**), `summon_toller` (+1 AP to start **any** walk), Pack Camel (`ENEMY_ONLY` hard lock). **Do not PAIR with Summon Hook / Summon Orth / Summon File / Summon Toll.** Family is **not** `summon_hooker` / `camel_warder` / `camel_biter`. **Do not PAIR with Fresh Plater.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no living allied player-summon. Peer: arm only if a pet can land (3,2) this turn. Above: skip if Pack Camel is already live (CHAMPION-only, never owned — do not CORE both).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.10, res 0.85, init 1.10, chc 0.75. Identity is **taxing camel landings**. If it tops the meter, the kit leaked toward Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "summon_walk_camel_3_2_ap_tax"`. VETERAN: skip if no living allied summon. ELITE: Camel Stride COURT so the **player** is also locked (COURT, not PAIR). CHAMPION: never Pack Camel as identity.
- **CORE_SPELL_POOL:** `spell-summon-camel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Hook / Pack Camel / Camel Stride as identity
- **SIGNATURE_MECHANICS:** Orthogonal 1-steps and hook landings are free of this tax. 2 turns. Not `spell.mpCost`. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE tax-camel-landings → VETERAN skip-no-pets → ELITE Stride-COURT → CHAMPION no-pack-clone
- **RARITY_CURVE:** Standard. +ELITE vs summon kits. Weight 0 in a pack with no player summons **and** no dedicated player-summoner on the other side (still legal vs a Wisp).
- **SYNERGIES:** `camel_warder` (COURT, not PAIR), `glyph_cutter`, `kennel_siller` (COURT, not PAIR)
- **WEAKNESSES:** Desummon; walk pets orthogonal-1; kill the Taxer
- **PLAYER_COUNTERPLAY:** Desummon; walk pets adjacent; Null Field
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-camel` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (allied-summon walk-landing (3,2) AP tax overlay)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `thin_gifter`

- **NAME:** Thin Gifter
- **ROLE:** healer (heal 8 iff leftover **AP === 1 AND leftover MP === 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Thin Gift (`spell-thin-gift`, #1198). Distinct from `thin_gaiter` (same window, **damage**), `thin_plater` (same window, **miss**), `gait_gifter` (AP≥2 and MP=0), `lean_gifter` (AP=0 and MP≥1), `prime_gifter` (exactly **1/1**), `wide_gifter` (AP≥2 and MP≥1), `octave_mender` (this pass, both leftover **sum === 8 unequal**). Healer CORE only. **No extra door**. At most one leftover-1/0 heal CORE per pack as PAIR vs Thin Gait / Thin Plate / Gait Gift / Lean / Prime / Wide / Octave / Septet / Sestet / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover is not 1/0. Peer: Thin Gift only if leftover is 1/0 **and** missing HP ≥ 8. Above: refuse if Dual Keep 2/2 (not 1/0) or leftover 1/1 (Prime Gift).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **one body already sitting leftover 1/0**. If it tops the meter, the kit leaked toward Frost. Dual Keep 1/0 **is** this window if it survives. (1,0) is **not** an Octave pair.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_eq_1_and_mp_eq_0"`. VETERAN: skip off-window. ELITE: prefer self-cast when the caster already sits 1/0 after the AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-thin-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Thin Gait / Thin Plate / Gait Gift / Wide Gift / Prime Gift / Octave Mend as identity
- **SIGNATURE_MECHANICS:** `healAmount` stays 0 on the Thin Gift row. Fizzle after AP if leftover is not 1/0 (still observes).
- **VARIANT_PROGRESSION:** BASE 1/0-heal → VETERAN skip-off-window → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep 1/0 kits.
- **SYNERGIES:** `hollow_marker`, `thin_gaiter` (COURT, not PAIR), `thin_plater` (COURT, not PAIR)
- **WEAKNESSES:** Spend the last AP; sit Dual Keep 2/2; sit 1/1; Cursed Wound
- **PLAYER_COUNTERPLAY:** Spend the last AP; sit 2/0 (Gait Gift’s window, not this); kill the cantor first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-thin-gift` (ELITE, piece observe — fizzle after AP still observes). `parched_cantor` is **not** this door.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover 1/0 gate + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_quinter`

- **NAME:** Cadence Quinter
- **ROLE:** controller (remaining CDs `n>5` → `5`; 0/1/2/3/4/5 unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Quint (`spell-cadence-quint`, #1198). Distinct from `cadence_quintrer` (this pass, `n===5` → **0**), `cadence_quadder` (`n>4` → **4**), `cadence_quarterer` (`n===4` → **0**), `cadence_terner` (`n>3` → **3**), `cadence_capper` (`n>2` → **2**), Floor observe extras on `cadence_thief` / `hex_chorister`. **Do not PAIR with Cadence Quintrer.** Do **not** name this family `cadence_quintrer` / `cadence_quadder` / `cadence_quarterer`. No extra door — observe via `cadence_thief` / `hex_chorister`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≤ 5. Peer: Quint only if a nuke remaining is 6+. Above: refuse if the only remaining-6+ id is Strike.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **compressing a 7 to a 5**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cap_remaining_cds_gt_5_to_5"`. VETERAN: skip all-already-≤5. ELITE: prefer Inferno remaining 7 over Strike-only. CHAMPION: never Quint a bar you will Quinte the same turn (Quinte is a different family — COURT later).
- **CORE_SPELL_POOL:** `spell-cadence-quint`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the compressed id is already remaining 5
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Quinte / Quad / Quarte / Tern / Cap / Floor as identity
- **SIGNATURE_MECHANICS:** Remaining 0/1/2/3/4/5 unchanged. Fives **stay** 5. Quad would have written 4; Tern would have written 3; Cap would have written 2; Floor would have written 1; Quinte would have written 0 on a 5.
- **VARIANT_PROGRESSION:** BASE compress-to-5 → VETERAN skip-already-≤5 → ELITE nuke-bias → CHAMPION no-same-turn-Quinte
- **RARITY_CURVE:** Standard. +ELITE when Verse Octave is already in the pack (COURT).
- **SYNERGIES:** `cadence_quintrer` (COURT, not PAIR), `verse_octaver`, `cadence_thief`
- **WEAKNESSES:** Sit remaining at 5 (Quinte’s problem) or ≤4; recast before Quint; Cadence Break
- **PLAYER_COUNTERPLAY:** Recast; sit remaining 5; Cadence Break
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-quint` (ENEMY_DISCOVERY, piece observe **or** `cadence_thief` / `hex_chorister` G≥19 extra — first child wins). Do **not** restamp `quinte_precentor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 5 when n>5)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `prime_toller`

- **NAME:** Prime Toller
- **ROLE:** controller (next **walk** +1 AP if leftover **AP === 1 AND leftover MP === 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Prime Toll (`spell-prime-toll`, #1198). Distinct from `even_toller` (leftover **AP even ≥ 2**), `odd_toller` (leftover **AP odd**), `gait_toller` (next walk if leftover **MP = 0**), `prime_gaiter` (**damage** on leftover 1/1), `prime_gifter` / `prime_plater` (**1/1** heal / miss). At most one leftover-1/1 walk-tax CORE per pack as PAIR vs Even / Odd / Gait / Still / Cast / Walk / Summon / Prime Gait / Prime Gift / Prime Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover is not 1/1. Peer: arm only while they sit 1/1 and will walk. Above: skip if they will Strike instead of walking.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.05, res 0.80, init 1.15, chc 0.75. Identity is **taxing the 1/1 walk**. If it tops the meter, the kit leaked toward Quiet Hex. Not `spell.mpCost`.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_walk_ap_tax_if_leftover_ap_eq_1_and_mp_eq_1"`. VETERAN: skip off-window. ELITE: Prime Gait COURT on the same leftover (COURT, not PAIR). CHAMPION: never Even Toll as identity.
- **CORE_SPELL_POOL:** `spell-prime-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Prime Gait / Prime Gift / Even Toll as identity
- **SIGNATURE_MECHANICS:** Camp leftover 1/1 then walk. Dual Keep 1/1 **is** this window if it survives. Fizzle after AP if leftover is not 1/1 (still observes).
- **VARIANT_PROGRESSION:** BASE 1/1-walk-tax → VETERAN skip-off-window → ELITE Gait-COURT → CHAMPION no-even-clone
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep 1/1 kits.
- **SYNERGIES:** `prime_gaiter` (COURT, not PAIR), `brick_levier`, `stone_castellan`
- **WEAKNESSES:** Spend the last AP or the last MP before the walk; sit Dual Keep 2/2
- **PLAYER_COUNTERPLAY:** Spend leftover AP; sit 1/0; don’t walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-prime-toll` (ENEMY_DISCOVERY, piece observe — fizzle after AP still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk +1 AP overlay gated on leftover 1/1)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_levier`

- **NAME:** Brick Levier
- **ROLE:** controller (next **walk** +1 **MP** while adjacent to a **barrier**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Brick Levy (`spell-brick-levy`, #1198). Distinct from `brick_taxer` (next **walk +1 AP**), `brick_feer` (next **spell +1 AP**), `brick_holder` (**forbids** the walk), Frozen/Slime (map-modifier walk-MP doubler). At most one barrier-adjacent walk-MP tax CORE per pack as PAIR vs Brick Tax / Brick Fee / Brick Hold / Brick Brace / Watch Feer. Not `spell.mpCost`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they are not adjacent to a barrier. Peer: arm only if they will walk while cover-camping. Above: skip if Brick Hold is already live (they cannot walk).
- **STAT_SCALING_RULE:** hp 1.00, sp 0.85, sr 1.05, res 1.10, init 1.00, chc 0.70. Identity is **taxing the cover-camp walk in MP**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_walk_mp_tax_if_adjacent_barrier"`. VETERAN: skip if no adjacent barrier. ELITE: Barrier then Levy. CHAMPION: never Brick Fee as identity.
- **CORE_SPELL_POOL:** `spell-brick-levy`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `starter-frost`
- **ELITE_SPELL_POOL:** none — do **not** add Brick Tax / Brick Fee / Brick Hold as identity
- **SIGNATURE_MECHANICS:** Strike stays free. Frozen/Slime is a **map modifier**, not this flag. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE cover-MP-tax → VETERAN skip-no-barrier → ELITE self-Barrier → CHAMPION no-fee-clone
- **RARITY_CURVE:** Standard. +ELITE on fortress / corridor maps.
- **SYNERGIES:** `prime_toller`, `stone_castellan`, `brick_feer` (COURT, not PAIR)
- **WEAKNESSES:** Step off the barrier; Swap past; don’t walk
- **PLAYER_COUNTERPLAY:** Leave cover; don’t walk; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-levy` (ENEMY_DISCOVERY, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk +1 MP overlay gated on barrier adjacency)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_shaver`

- **NAME:** Watch Shaver
- **ROLE:** sniper (overwatch snap **−1 leftover MP** on the walker; caster does not gain it)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Watch Shave (`spell-watch-shave`, #1198). Distinct from `watch_binder` (**forbids** the walker’s next walk), `watch_taxer` (next **spell** +1 AP), `watch_rooter` (**zeros** leftover MP now), `watch_drainer` (**steals 1 leftover MP** to the caster). **Do not PAIR with Watch Bind / Watch Tax / Watch Root / Watch Drain.** At most one overwatch leftover-MP-shave CORE per pack as PAIR vs those plus Watch Banker / Sipper / Almer / Lender / Feer / Muter / Pair Binder / Fuse Binder / Glass Sniper.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no walker will enter the overwatch band. Peer: arm only if a walk will snap. Above: skip if leftover MP is already 0.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 1.10, res 0.75, init 1.20, chc 0.90. Identity is **shaving leftover MP on snap without stealing it**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "overwatch_snap_shave_walker_leftover_mp"`. VETERAN: skip if no live overwatch band. ELITE: Lean Gait COURT after the shave manufactures leftover AP=0/MP≥1 (COURT, not PAIR on one BASE kit). CHAMPION: never Watch Drain as identity (caster does **not** gain the MP).
- **CORE_SPELL_POOL:** `spell-watch-shave`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex`
- **ELITE_SPELL_POOL:** none — do **not** add Watch Bind / Watch Drain / Watch Root / Watch Tax as identity
- **SIGNATURE_MECHANICS:** Caster does **not** gain the shaved MP. Ending a walker’s leftover MP mid-path. Observation is the **arm**. Not `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE snap-shave → VETERAN skip-no-band → ELITE Lean-COURT → CHAMPION no-drain-clone
- **RARITY_CURVE:** Standard. +ELITE in Watch Lean. Weight 0 without an overwatch band (`glass_sniper` / Hold Ground / Far Watch) **unless** this body provides one.
- **SYNERGIES:** `lean_gaiter` (COURT), `glass_sniper` (COURT, not PAIR), `watch_binder` (COURT, not PAIR)
- **WEAKNESSES:** Don’t walk through the band; sit leftover MP 0; kill the Shaver
- **PLAYER_COUNTERPLAY:** Don’t walk the band; sit leftover MP 0; LoS break
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-shave` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap −1 leftover MP on walker, no grant)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_gaiter`

- **NAME:** Lean Gaiter
- **ROLE:** assassin (10 + 8 iff leftover AP **=== 0 AND leftover MP ≥ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Lean Gait (`spell-lean-gait`, #1198). Distinct from `lean_gifter` (same window, **heal**), `lean_stinger` (Wave 13 leftover-MP=0 sting — **different window**), `thin_gaiter` (leftover **1/0**), `hollow_stinger` (this pass, leftover **0/0**), `wide_stinger` (leftover **AP≥2 AND MP≥1**), `prime_gaiter` (leftover **1/1**). At most one leftover-AP=0/MP≥1 poke CORE per pack as PAIR vs Lean Gift / Lean Sting / Thin / Hollow / Wide / Prime.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover AP ≥ 1 or leftover MP = 0. Peer: bonus path only on leftover 0/n (n≥1). Above: skip if leftover is 0/0 (Hollow Sting) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **poking leftover 0/n**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_0_and_mp_ge_1"`. VETERAN: skip bonus off-window (10 still). ELITE: Watch Shave COURT to manufacture leftover AP=0/MP≥1 (COURT). CHAMPION: never also fire Hollow Sting’s rider as identity.
- **CORE_SPELL_POOL:** `spell-lean-gait`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Lean Gift / Lean Sting / Hollow Sting / Thin Gait as identity
- **SIGNATURE_MECHANICS:** Dual Keep 0/2 **is** this window if it can sit there. 0/0 is Hollow. 1/0 is Thin. Off-window still observes.
- **VARIANT_PROGRESSION:** BASE 0/n-poke → VETERAN skip-bonus-off-window → ELITE Shave-COURT → CHAMPION no-hollow-clone
- **RARITY_CURVE:** Standard. +ELITE vs kits that dump leftover AP and hold MP.
- **SYNERGIES:** `watch_shaver` (COURT), `lean_gifter` (COURT, not PAIR), `fuse_skipper`
- **WEAKNESSES:** Hold leftover AP; dump leftover MP to 0; Barrier
- **PLAYER_COUNTERPLAY:** Hold leftover AP; dump MP; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-gait` (ELITE, piece observe — off-window still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP=0 AND MP≥1 gate + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `glyph_cutter`

- **NAME:** Glyph Cutter
- **ROLE:** assassin (10 + 10 if target is Chebyshev ≤ 2 from **painted glyph-tax occupancy**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Glyph Cut (`spell-glyph-cut`, #1198). Distinct from `slide_cutter` (**conveyor** occupancy), `lava_cutter` (**lava**), `rime_cutter` (**ice**), `spike_cutter` (**spikes**), `hazard_cutter` (**painted** hazard), `portal_cutter` (**world portals**), `glyph_reeler` (this pass, **pull**), `glyph_sower` (**paints**), `glyph_skipper` (ignore glyph-tax). At most one glyph-tax-threshold poke CORE per pack as PAIR vs Slide / Lava / Rime / Spike / Hazard / Portal / Axis / Glyph Reel / Glyph Sower / Glyph Skip.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no painted glyph-tax in radius 2. Peer: bonus path only near the cipher. Above: skip if dest/bonus would count Twin Gate pads or `map.portals` (fail closed).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **20 next to a glyph-tax cell**. If it tops the meter, the kit leaked toward Venom.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_near_glyph_tax_occupancy"`. VETERAN: skip bonus off-cipher (10 still). ELITE: Glyph Tax then Glyph Cut; Glyph Reel COURT onto the cipher then Cut (COURT, not PAIR). CHAMPION: never dest/bonus off world portals.
- **CORE_SPELL_POOL:** `spell-glyph-cut`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Lava Cut / Glyph Reel / Glyph Skip / Hazard Cut as identity
- **SIGNATURE_MECHANICS:** Twin Gate pads, `map.portals`, live lava/ice/spikes, painted mire, and painted conveyor do **not** count. Off-cipher still observes.
- **VARIANT_PROGRESSION:** BASE cipher-poke → VETERAN skip-bonus-off-cipher → ELITE Reel-COURT → CHAMPION no-portal-bonus
- **RARITY_CURVE:** Standard. +ELITE on cipher maps.
- **SYNERGIES:** `glyph_reeler` (COURT, not PAIR), `camel_taxer`, `glyph_sower` (COURT, not PAIR)
- **WEAKNESSES:** Step off the cipher; blink; Barrier the glyph-tax
- **PLAYER_COUNTERPLAY:** Step off; blink; Barrier
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-glyph-cut` (ELITE, piece observe — off-cipher still observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev ≤ 2 from painted glyph-tax + second `dealDamage`; fail closed off portals)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `fresh_plater`

- **NAME:** Fresh Plater
- **ROLE:** protector (next hit is 0 while leftover AP equals max)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Fresh Plate (`spell-fresh-plate`, #1198). Distinct from `idle_plater` (leftover **MP equals max**), `fresh_stinger` (same window, **damage**), `dry_plater` (leftover **MP = 0**), `full_plater` (Wave 13 leftover-full miss — do **not** alias this window), `cast_plater` (outgoing non-Strike deals 0), `wide_plater` (this pass, leftover **AP≥2 AND MP≥1**). **Do not PAIR with Camel Taxer.** At most one leftover-AP-equals-max miss CORE per pack as PAIR vs Idle / Fresh Sting / Wide Plate / Thin / Dry / Prime / Full / Cast / Summon / Brace / Brood.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover AP < max (they have spent AP). Peer: arm only while leftover AP equals max (they have **not spent AP**). Above: skip if they will cast first.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **negating a hit because they have not spent AP**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_equals_max"`. VETERAN: skip if leftover AP < max. ELITE: Fresh Sting COURT so a spent-AP-max body eats both (COURT, not PAIR). CHAMPION: never become Idle Plate or Cast Plate.
- **CORE_SPELL_POOL:** `spell-fresh-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Idle Plate / Fresh Sting / Wide Plate / Cast Plate as identity
- **SIGNATURE_MECHANICS:** Casting (leftover AP < max) drops the window; the charge remains until a hit or expiry. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE fresh-miss → VETERAN skip-already-spent → ELITE Sting-COURT → CHAMPION no-idle-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits that cannot force an AP spend.
- **SYNERGIES:** `fresh_stinger` (COURT, not PAIR), `plate_warden`, `camel_taxer` (COURT, not PAIR)
- **WEAKNESSES:** Force an AP spend first; wait the charge out
- **PLAYER_COUNTERPLAY:** Force a cast; wait; Coup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-fresh-plate` (ELITE, piece observe — arm)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover AP equals max at impact)
- **STATUS:** PROPOSED

---

## 5. Relative scaling (no cap)

`pickEnemyLevelFromTiers` already raises the chance of near / equal / above-player enemies as the player climbs (`combatMath.ts` 54–107). This pass does **not** retune those percents. The `floor(999 / ts)` rail is spawn-math, not a content cap. Variant floors (BASE 1 / VETERAN 3 / ELITE 6 / CHAMPION 8) sit **on top of** `computeAITier`, which still plateaus at label 10 then 30% noise — that plateau is a **label**, not a last enemy. `G = floor(max(0, R) / T)` is unbounded. Wave 21 CORE rows stamp `generationMin: 19` on unique SDE verbs and inherit #1251’s Wave-20 tactical generation. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`. **Still the same family.**

Higher `R` does **not** mean “more HP.” It means: smarter skip predicates, one extra ADVANCED ∪ RARE ∪ ELITE slot, higher variant weight, denser synergy packs. A level-400 Octave Mender is still a four-read healer. A level-400 Camel Warder is still a (3,2) walk lock.

---

## 6. Implementation prerequisites (not new families)

Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec/Hendeca/Dodeca/Trideca/Tetradeca/**Pentadeca** cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / Score Post `scorepost` / Hendeca Span `hendecaspan` / Stave Post `stavepost` / Dodeca Span `dodecaspan` / Sestet Post `sestetpost` / Trideca Span `tridecaspan` / Septet Post `septetpost` / Tetradeca Span `tetradecaspan` / **Octave Post `octavepost`** / **Pentadeca Span `pentadecaspan`** / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 7. Next run (Wave 22)

Do not re-propose Waves 1–21 ids unless evolving them; re-check implementation. Wave 22 consumes leftover SDE Wave 20 unique CORE (`spell-giraffe-stride` … except Pack Giraffe / Giraffe Fold unless a boss sheet claims them) plus SPELL_PROPOSALS Wave 21 if that catalog opens. Extra doors for Pack Giraffe / Giraffe Fold stay `giraffe_precentor` / `giraffe_fold_regent` (SDE #1255). Extra rooms for #1255 unique CORE stay that catalog’s teach rooms (`giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave`). Do not mint `wave21:` spell ids. Cadence Floor is SDE-owned — do not mint `cadence_floorer`. Cadence Prime owns remaining `0→1` — do not mint `spell-cadence-arm`. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) are Wave 17. Cadence Dock (`2→0`) and Cadence Cap (`n>2→2`) are Wave 18. Cadence Tern (`n>3→3`) and Cadence Tierce (`3→0`) are Wave 19. Cadence Quad (`n>4→4`) and Cadence Quarte (`4→0`) are Wave 20. Cadence Quint (`n>5→5`) is this pass’s SDE CORE — family **`cadence_quinter`**. Cadence Quinte (`n===5` → `0`) is this pass’s tactical CORE — family **`cadence_quintrer`**. Cadence Sext (`n>6` → `6`) is SDE Wave 20 — Wave 22 CORE; **do not name it `cadence_quinter` or `cadence_quintrer`**. Pentadeca Span filled fifteen-cell occupy — do not mint `spell-sixteen-span` until a later tactical catalog claims it. Prime Gift owns leftover 1/1 heal. Gait Gift owns leftover AP≥2/MP=0 heal. Wide Gift owns leftover AP≥2/MP≥1 heal. Thin Gift (leftover **1/0** heal) is this pass. Deep Gift (leftover **AP === 1 AND MP ≥ 2**) is SDE Wave 20 — Wave 22. Dual Plate owns leftover AP even≥2 AND leftover MP even≥2 miss. Prime Plate owns leftover 1/1 miss. Thin Plate owns leftover 1/0 miss. Idle Plate owns leftover-MP-equals-max miss. Wide Plate owns leftover AP≥2 AND MP≥1 miss. Fresh Plate owns leftover-AP-equals-max miss. Pair Plate (leftover **2/0** miss) is SDE Wave 20 — Wave 22. Psalm Turn owns mixed-side invert (caster stays). Feud Turn owns caster+hostile invert. Kin Turn owns caster+ally invert. Hold mid-RAF splice, fourth mpCost walk snipe, player-owned Hex of Silence, sixth echo. Leftover AP − leftover MP === 2 is SDE #1255 `spell-skew-mark` — Wave 22; do not mint a second `spell-skew-*`. `spell-pack-ring` / `spell-lane-fold` / `spell-pack-hook` / `spell-hook-fold` / `spell-pack-camel` / `spell-camel-fold` / `spell-pack-giraffe` / `spell-giraffe-fold` stay never-owned unless a boss sheet claims them. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. Do not ship `spell-parched-mend` beside Dry Gait. Do not mint `spell-sestet-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-septet-gift` / `spell-octave-gift` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-fifteen-span` / `spell-sixteen-span` / `spell-octa-span` / `spell-nona-span` / `spell-deca-span` / `spell-undeca-span` / `spell-mixed-turn` / `spell-duet-turn` / `spell-cadence-trey` / `spell-cadence-cinque` / `spell-cadence-fifth` / `cadence_quarter` / `cadence_fifth` / `summon_hooker` / `camel_gallery` as a family id. Same-day 2026-10-29 SPELL_PROPOSALS / SDE had **not** opened a PR at authoring; if they later claim a unique leftover, **SDE wins** and stamps as Wave **22** family CORE. #1285 / #1287 / #1291 are not unique leftover catalogs.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `octave_mender` | healer | `spell-octave-mend` | `octave_cantor` |
| `cadence_quintrer` | controller | `spell-cadence-quinte` | `quinte_precentor` |
| `pentadeca_prelate` | summoner | `spell-pentadeca-span` | `span_pentadeca` (`summonAI: "pentadecaspan"`) |
| `kin_turner` | controller | `spell-kin-turn` | — |
| `octave_hooder` | protector | `spell-octave-hood` | — |
| `octave_stinger` | assassin | `spell-octave-sting` | — |
| `octave_stepper` | teleporter | `spell-octave-step` | — |
| `octave_siller` | hazard creator | `spell-octave-sill` | — |
| `octave_holder` | controller | `spell-octave-hold` | — |
| `octave_lender` | buffer | `spell-octave-lend` | — |
| `octave_sipper` | debuffer | `spell-octave-sip` | — |
| `octave_prelate` | summoner | `spell-octave-post` | — (`summonAI: "octavepost"`) |
| `octave_bouncer` | artillery | `spell-octave-bounce` | — |
| `must_octaver` | controller | `spell-must-octave` | — |
| `verse_octaver` | debuffer | `spell-verse-octave` | — |
| `camel_warder` | controller / kiter | `spell-camel-stride` | `camel_gallery` |
| `deca_oather` | controller | `spell-deca-oath` | `deca_nave` |
| `glyph_reeler` | displacement | `spell-glyph-reel` | `cipher_aisle` |
| `camel_biter` | bruiser | `spell-camel-bite` | — |
| `hollow_marker` | hazard creator | `spell-hollow-mark` | `hollow_pulpit` |
| `wide_plater` | protector | `spell-wide-plate` | — |
| `fuse_skipper` | kiter | `spell-fuse-skip` | `fuse_nave` |
| `hollow_stinger` | assassin | `spell-hollow-sting` | — |
| `camel_taxer` | anti-summon | `spell-summon-camel` | — |
| `thin_gifter` | healer | `spell-thin-gift` | — |
| `cadence_quinter` | controller | `spell-cadence-quint` | — (observe `cadence_thief` / `hex_chorister`) |
| `prime_toller` | controller | `spell-prime-toll` | — |
| `brick_levier` | controller | `spell-brick-levy` | — |
| `watch_shaver` | sniper | `spell-watch-shave` | — |
| `lean_gaiter` | assassin | `spell-lean-gait` | — |
| `glyph_cutter` | assassin | `spell-glyph-cut` | — |
| `fresh_plater` | protector | `spell-fresh-plate` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Quinte / Pack Camel / Camel Fold stay kit-only.

**Naming law (Quint vs Quinte):** `cadence_quinter` is Cadence Quint (`n>5` → `5`, #1198). `cadence_quintrer` is Cadence Quinte (`n===5` → `0`, #1251, extra door `quinte_precentor`). They are **not** the same family. Parallel to Wave 20 `cadence_quadder` (`n>4` → `4`) vs `cadence_quarterer` (`n===4` → `0`).

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–20 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-octave-gift` / `cadence_quarter` / `cadence_fifth` / `cadence_cinque` / `summon_hooker` / `wave21:` colliding ids.
- No restamp of `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` / `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent` as family ids.
- No restamp of Wave 20 extra doors (`septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`).
- No restamp of Wave 21 boss extra doors from #1244 (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`).
- Same-day SDE Wave 20 (#1255) was not cloned; it stamps as Wave **22** family CORE.

All **32** sheets: **STATUS: PROPOSED**.

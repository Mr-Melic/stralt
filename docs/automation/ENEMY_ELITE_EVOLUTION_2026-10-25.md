# Enemy and Elite Evolution Design — Wave 17

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-25  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Seventeenth daily pass. **32** new world-pack families that consume **SDE Wave 15 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md`, open PR #962) **except** Pack Diag / Far Fold, plus **SPELL_PROPOSALS Wave 16 verbs** (`SPELL_PROPOSALS_2026-10-24.md`, open PR #1011) **except** Court Snuff (`NOT_PLAYER_LEARNABLE`). Cadence Floor remains **SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Cadence Rise (`n==1` → `2`) is this pass’s CORE, not Cadence Snuff (`n==1` → `0`) and not Cadence Prime (`n==0` → `1`). SDE Wave 16 unique CORE (`spell-ring-stride` … `spell-leap-fold`, open PR #1017) stays extras until Wave 18. Bosses stay on the existing catalog.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 16

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–16. Wave 16 closed as docs in the 2026-10-24 pass (PR #997). SPELL_PROPOSALS latest on this cron is Wave 16 (#1011). SDE latest unique-CORE lag is Wave 15 (#962). Same-day SDE Wave 16 (#1017) is **Wave 18** family CORE. This pass consumes **#962** unique CORE (minus Pack Diag / Far Fold) plus **#1011** (minus Court Snuff). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥15 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 16 claim | 2026-10-25 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–16 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16821; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / Tally / **Score** Post count as **1**. Triple = 3 … Dec Span = 10. **Hendeca Span = 11** — skip Hendeca until remaining cap ≥ 11 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Score Mend / Lean Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `hendecaspan` / `scorepost` (and still no `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Facing families still fail closed. Wave 17 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 17 CORE rows stay `mpCost: 0`. Score Lend / Score Sip / Duel Turn / Watch Root rewrite **current leftover AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Lava Reel is the **tenth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike, then **lava occupancy**). Brick Brace **does not move** the barrier |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–16 force families still fail closed. Wave 17 adds **zero** new force-gated CORE cards |
| `lastResolvedSpellId` | Absent | `verse_scorer` (and Waves 10–16 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` / Wave 16 `cast_toller` still wait. Strike Mark reads **Strike originating on the painted cell**, not a new persist stat |
| `walkMpSpentThisTurn` | Absent | Score\* leftover-sum gates / Lean Gift / Dry Plate / Odd Gait / Even Sting / Still Toll fail closed until battle walks write leftover MP |
| One next walk **same file** / next-spell exact Chebyshev **6** / pull toward nearest **lava occupancy** / bonus if share **file only** / cell detonates on **Strike from** / leftover-**MP=0** miss / 1-tile **shock** skip / leftover-AP **even ≥ 2** poke / allied-summon **walk-off-rank** AP tax / heal-if leftover **AP=0 and MP≥1** / remaining `1→2` / next spell +1 AP if leftover **MP=0** / next hit 0 if **barrier adjacent** / overwatch snap **zeros leftover MP** / leftover-**MP odd** poke / bonus if near **spike occupancy** / allied-summon **next hit 0** | Still absent as CORE identities | Wave 17 secondary opportunity (SDE Wave 15 unique CORE leftover). Pack Diag / Far Fold stay closed |
| Heal-if both bodies leftover AP + leftover MP **=== 4 AND unequal** / remaining `1` → `0` / stretched-plus **11-cell** occupy / invert leftover on **two hostiles** / next hit 0 while sum===4 unequal / sting / join / start-turn occupy / cannot-walk-while-sum===4-unequal / +AP+MP if ally sum===4 unequal (**exits** window) / steal leftover AP iff sum===4 unequal / end-turn occupy sum===4 unequal post / bounce among sum===4 unequal / non-Strike illegal unless sum===4 unequal **and** last AP / last-id illegal until sum===4 unequal | Still absent in live catalog | Wave 17 primary opportunity (SPELL_PROPOSALS Wave 16). Court Snuff stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Dry Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Spike Cut is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. File Bite is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16821) | Only live MP-debit hook. Lava Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Rise is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Duel Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 17 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 17 family pass consumes **#962** unique CORE (minus Pack Diag / Far Fold) plus **#1011** (minus Court Snuff). **Wave 18** consumes SDE Wave 16 unique CORE (`spell-ring-stride` … `spell-leap-fold`, except Pack Orth / Leap Fold unless a later boss sheet claims them) plus any 2026-10-25 SPELL_PROPOSALS. This run does not mint colliding `wave17:` spell ids. Same-day 2026-10-25 SPELL_PROPOSALS / SDE, if any open during this cron, stay Wave **18** family CORE — do not clone them here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` / `spell-pack-diag` / `spell-far-fold` / `spell-court-snuff` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is Wave 16 CORE. Cadence Rise (`n==1` → `2`) is this pass. Cadence Snuff (`n==1` → `0`) is this pass’s **other** remaining-1 rewrite — inverse of Rise, not a Floor clone. Cadence Cap (`n>2` → `2`) is SDE Wave 16 — Wave 18.

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

**Stationary-post / multi-body cap (extend Wave 16):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** Tally Post **or** Dec Span **or** **Score Post** **or** **Hendeca Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / **Score Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. Dec Span counts as **ten**. **Hendeca Span counts as eleven.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, Dec Span, Score Post, or Hendeca Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-/eight-/nine-/ten-/eleven-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, a Dec Span axis-aligned 2×5, **or** a Hendeca Span stretched plus (7-spine × 5-crossbar, center occupied), never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, Tally Post, and Score Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole). Hendeca Span occupies **every** cell of the stretched plus (no cage hole; **no diagonal cells** — that is the counter vs Nine Span’s square).

**Summon-cap prerequisite (extend Wave 16):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Six Span is illegal until remaining cap ≥ 6. Sept Span is illegal until remaining cap ≥ 7. Oct Span is illegal until remaining cap ≥ 8. Nine Span is illegal until remaining cap ≥ 9. Dec Span is illegal until remaining cap ≥ 10. **Hendeca Span is illegal until remaining cap ≥ 11.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post are legal at remaining ≥ 1. Do not spawn `hendeca_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 16):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / Tally\* leftover-sum / Equal Gift / Tied Gait / **Score\*** leftover-sum / **Lean Gift** / **Dry Plate** / **Odd Gait** / **Still Toll** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Brick Step / **Score Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 16):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / Tally\* leftover-sum / Odd Plate / Odd Sting / Equal Gift / Tied Gait / **Score\*** leftover-sum / **Even Sting** / **Lean Gift** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3** (2/1, 1/2, 3/0, 0/3 — **not** 2/2), **enables** Score when the surviving banks **sum to 4 and are unequal** (4/0, 0/4, 3/1, 1/3 — **not** 2/2), and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold (2,1) / (1,2) / (3,0) / (0,3) for Tally. Hold (4,0) / (0,4) / (3,1) / (1,3) for Score. `leftover AP = 0` and `leftover MP = 0` is **not** a Score window, **not** a Tally window, and **not** a Poise window. Dual Keep 2/2 is Poise (sum 4 **and** a tie). Dual Keep 3/1 **is** Score.

**Last-id prerequisite (extend Wave 16):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / Verse Tally / Summon Verse / **Verse Score** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 16):** Shove Mark / Drift Gift / Heave\* / Drift\* / Shove Gift fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, Score Step, and Home Step do **not** set the flag. Wave 17 adds **zero** new force-gated CORE cards.

**Facing / Struck prerequisites (partial):** Wave 17 adds **zero** facing CORE cards. Strike Mark needs a **Strike originating on the painted cell** (`physical_attack` that spent AP from that tile) — fail closed until written. Clash Mend / Strike Debter / Cast Toll still wait on `struckThisTurn`.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Score Mend MULTI child `score_cantor` — first child wins vs `score_mender` observe. Cadence Snuff MULTI child `snuff_precentor` — first child wins vs `cadence_snuffer` observe. Hendeca Span MULTI child `span_hendeca` — first child wins vs `hendeca_prelate` observe. Court Snuff stays `court_snuff_regent` kit-only. File Stride teach room `file_gallery` — first child wins vs `file_warder` observe. Hexa Oath teach room `hexa_nave` — first child wins vs `hexa_oather` observe. Lava Reel teach room `lava_aisle` — first child wins vs `lava_reeler` observe. Strike Mark teach room `strike_pulpit` — first child wins vs `strike_marker` observe. Shock Skip teach room `shock_nave` — first child wins vs `shock_skipper` observe. Pack Diag stays `diag_precentor` kit-only. Far Fold stays `far_fold_regent` kit-only. Lean Gift / Even Sting / File Bite / Dry Plate / Summon Rank / Cadence Rise / Still Toll / Brick Brace / Watch Root / Odd Gait / Spike Cut / Summon Plate / Duel Turn / Score Hood / Score Sting / Score Step / Score Sill / Score Hold / Score Lend / Score Sip / Score Post / Score Bounce / Must Score / Verse Score have **no** extra door — do **not** invent `lean_cantor` / `rise_precentor` / `even_gallery` retag / restamp `tally_cantor` / `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor` / `prime_precentor` / `score_cantor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `rank_precentor`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `diag_precentor`, `far_fold_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` / `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` / `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`.

---

## 2. Why Wave 17 exists (gaps Waves 1–16 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag). Wave 15 covered leftover SDE Wave 13 unique CORE (minus Pack File / Diag Fold) + SPELL_PROPOSALS Wave 14 (minus Cadence Floor / Court Floor). Wave 16 covered leftover SDE Wave 14 unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) + SPELL_PROPOSALS Wave 15 (minus Court Prime).

SPELL_PROPOSALS Wave 16 (#1011) then stamped the holes Wave 16 **held**: both-body leftover AP + leftover MP **=== 4 AND unequal** heal (Score Mend), remaining `1` → `0` (Cadence Snuff), stretched-plus eleven-cell occupy (Hendeca Span), and a two-hostile leftover invert (Duel Turn) plus the Score court. A G≥16 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 15 unique CORE still had no CORE owner after Wave 16. Seventeen of those verbs fill holes Wave 16 tactical does not: one next walk **same file**, next-spell exact Chebyshev **6**, pull toward nearest **lava occupancy**, bonus if share **file only**, cell detonates on **Strike from**, leftover-**MP=0** miss, 1-tile **shock** skip, leftover-AP **even ≥ 2** poke, allied-summon **walk-off-rank** AP tax, heal-if leftover **AP=0 and MP≥1**, remaining `1→2`, next spell +1 AP if leftover **MP=0**, next hit 0 if **barrier adjacent**, overwatch snap **zeros leftover MP**, leftover-**MP odd** poke, bonus if near **spike occupancy**, allied-summon **next hit 0**. Pack Diag and Far Fold stay closed.

SDE Wave 16 (#1017) unique CORE stays extras until Wave 18. Cadence Cap (`n>2` → `2`) is **not** Cadence Snuff. Prime Gift (leftover **1/1**) is **not** Score Mend. Ring Stride is **not** File Stride. Hendeca Span is **not** an eleven-cell hold — #1011 filled that hole.

| Unused Wave 16 / SDE Wave 15 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-score-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 4 AND unequal**) | `tally_mender` (both leftover **sum === 3**); `poise_mender` (both leftover **AP === MP ≥ 1** — Dual Keep **2/2**); `equal_gifter` (target-only tied ≥ 1); `lean_gifter` (this pass, leftover **AP=0 and MP≥1**) | Four leftover reads **plus** two inequalities. Dual Keep 2/2 is Poise, **not** Score. Extra door is `score_cantor` — family is **`score_mender`**. Do **not** restamp `tally_cantor` / `poise_cantor` / `gaunt_cantor`. |
| `spell-cadence-snuff` (remaining `n===1` → `0`; zeros stay 0; `n>1` unchanged) | `cadence_riser` (this pass, `n==1` → **2**); `cadence_primer` (`n===0` → `1`); `cadence_thief` (Floor extra: `n>1` → **1**) | Ready-**unlock**, the inverse of Rise. Extra door is `snuff_precentor` — family is **`cadence_snuffer`**. Do **not** mint `cadence_floorer` / `rise_precentor`. |
| `spell-hendeca-span` (stretched plus, counts as **eleven**) | `dec_prelate` (2×5 = 10, **rectangle**); `nine_prelate` (solid 3×3 = 9, **square**); `sept_prelate` (stretched plus **longArm 2 / shortArm 1** = 7) | Eleven tiles, 7-spine × 5-crossbar, empty kit, **corridor plug with shoulders**. Extra door is `span_hendeca` — family is **`hendeca_prelate`**. Skip until remaining cap ≥ 11. |
| `spell-duel-turn` (invert leftover AP↔MP on **two** hostiles; caster unchanged) | `purse_turner` (**one** hostile); `bar_crosser` (two-body **cross** through the caster); Tempo Invert (ally/self) | Two independent purses. Sum invariant: Score stays Score; Tally stays Tally; Poise stays Poise. Do **not** mint `spell-twin-turn`. |
| `spell-score-hood` (next hit is 0 **while leftover AP + leftover MP === 4 AND unequal**, any range) | `tally_hooder` (sum === 3); `poise_hooder` (leftover AP === leftover MP ≥ 1); `odd_plater` (leftover AP **odd**) | Hold (3,1). Dual Keep 2/2 is Poise Hood, **not** this. |
| `spell-score-sting` (10 + 8 iff leftover AP + leftover MP === 4 AND unequal) | `tally_stinger` (sum === 3); `poise_stinger` (tied ≥ 1); `even_stinger` (this pass, leftover AP **even ≥ 2** — (2,2) is Poise, not Score) | Punish (4,0) / (0,4) / (3,1) / (1,3). 2/2 is Poise / Tied Gait. |
| `spell-score-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 4 AND unequal) | `tally_stepper` (sum === 3); `poise_stepper` (tied ≥ 1); `home_stepper` (**ungated**) | Join the body that **sums to 4 without tying**. Relocate, not `isSwap`. |
| `spell-score-sill` (occupant sum===4 unequal at **start of their turn** takes 8; paint stays) | `tally_siller` (sum === 3); `poise_siller` (tied ≥ 1); `wake_marker` (start-turn occupy **any leftover**, consume) | Tax the camp **on their turn start** if they held a Score pair. Dual Keep 2/2 **misses**. |
| `spell-score-hold` (cannot walk while leftover AP + leftover MP === 4 AND unequal) | `tally_holder` (while sum === 3); `poise_holder` (while leftover AP === leftover MP ≥ 1); `odd_holder` (while leftover AP is **odd**) | (0,4) has MP but cannot spend it. Spend leftover AP **or** wait. **Do not PAIR with Must Score.** |
| `spell-score-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 4 AND unequal — **exits** to sum 6) | `tally_lender` (+1/+1 if sum === 3 — **exits** to 5); `poise_lender` (+1/+1 if tied ≥ 1 — the **tie survives**) | Cash the window. Inequality is preserved: (3,1)→(4,2). |
| `spell-score-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 4 AND unequal and leftover AP ≥ 1) | `tally_sipper` (steal iff sum === 3); `poise_sipper` (steal iff tied ≥ 1); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (3,1) → (2,1) **Tally**. (0,4) fizzles (no AP). **Sip manufactures Tally.** |
| `spell-score-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 4 AND unequal** deals 10 and it dies) | `tally_prelate` (sum === 3); `poise_prelate` (tied ≥ 1); `dummy_prelate` (taunt) | Camp sum===4 unequal on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "scorepost"`. |
| `spell-score-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===4 unequal hostile) | `tally_bouncer` (second body sum === 3); `poise_bouncer` (second body tied ≥ 1); Chain Lightning (nearest **any**) | Second 12 needs **two** Score bodies. Missing flag → 12 only. |
| `spell-must-score` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 4 AND unequal **and** this spell spends last AP) | `must_tallier` (sum === 3 / last AP); `must_poiser` (tied ≥ 1 / last AP); `score_holder` (this pass, **walk** needs sum ≠ 4 or a tie) | Inverse of Score Hold. Strike stays legal. **Do not PAIR with Score Hold.** |
| `spell-verse-score` (last resolved id **illegal until leftover AP + leftover MP === 4 AND unequal**) | `verse_tallier` (until sum === 3); `verse_poiser` (until tied ≥ 1); `last_muter` (**duration**) | Recast Inferno only after **sum === 4 unequal**. 2/2 and 3/0 and 0/0 do **not** lift. |
| `spell-file-stride` (**next walk** legal only if `dest.x == x_at_arm`) | `rank_warder` (**same y**); `orth_warder` (**orthogonal**); `diag_warder` (**diagonal**); Rank Lock is **all remaining** walks on rank **or** file | Extra room is `file_gallery` — family is **`file_warder`**. One step, same file. Do **not** name it `file_gallery` or `rank_lancer`. |
| `spell-hexa-oath` (next spell must be Chebyshev **exactly 6**) | `penta_oather` (exact **5**); `quad_oather` (exact **4**); `long_oather` (**≥ 3**); Six Span is occupy-weight 6 | Frost at 1–5 or ≥ 7 fizzles. Strike stays legal. Extra room `hexa_nave` is a teach — family is **`hexa_oather`**. Do **not** name it `hexa_nave` or `six_prelate`. |
| `spell-lava-reel` (pull 1 toward nearest **lava occupancy**) | `spike_reeler` (toward **spike occupancy**); `cinder_reeler` (toward **painted** hazard); `lava_skipper` (ignore lava **land tax**) | Tenth `applyAttract` dest flavor. Extra room `lava_aisle` is a teach — family is **`lava_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no lava fizzles. |
| `spell-file-bite` (10 + 10 if share **file only**) | `axis_biter` (share rank **or** file); `screen_biter` (Bresenham **blocked**); File Lance (linear poke) | Bonus on the file. Rank-only → 10 only. |
| `spell-strike-mark` (cell detonates if they **Strike from** it; consume) | `swap_marker` (**teleport** landing); `shove_marker` (**force-move** landing); `cast_marker` (**spell** confirm); `ingress_marker` (**walk enter**) | Walk-on is free. Spell-from is free. Strike from the paint pays. Extra room `strike_pulpit` is a teach — family is **`strike_marker`**. |
| `spell-dry-plate` (next hit is 0 **while leftover MP is 0**; consume on miss) | `gait_plater` (leftover **MP ≥ 1**); `spent_plater` (leftover **AP ≥ 1**); `odd_plater` (leftover AP **odd**) | Keep leftover MP 0. Walk 1 MP and the hit lands; charge **stays**. |
| `spell-shock-skip` (next **1-tile** walk ignores **shock-tile enter-tax**) | `mire_skipper` (**mire enter-tax**); `spike_skipper` (**spikes**); `rime_skipper` (**rime leave-tax**); Shock Glyph is a **boss paint**, not this skip | Wrong hazard still ticks. Length ≥ 2 pays. Extra room `shock_nave` is a teach — family is **`shock_skipper`**. |
| `spell-even-sting` (leftover **AP even and ≥ 2** → bonus damage) | `odd_stinger` (leftover AP **odd**); `tied_gaiter` (both leftover **exactly 2**); `full_stinger` (leftover AP **≥ 3**); Gaunt Sting (both leftover **0** — 0 is even, **excluded**) | Poke leftover 2/4. 0 and odd leftover → 10 only. |
| `spell-summon-rank` (allied summons pay +1 **AP** to **walk off the summoner’s rank**) | `summon_toller` (+1 AP to start **any** walk); `summon_gaiter` (+1 **MP** to start a walk); `summon_verser` (+1 AP to **recast last id**); Pack Rank (`ENEMY_ONLY` hard lock) | On-rank walks are free of this tax. **Do not PAIR with Summon Toll / Summon Gait / Summon Verse.** |
| `spell-lean-gift` (heal 10 iff leftover **AP = 0 and leftover MP ≥ 1**) | `hollow_gifter` (target leftover both 0); `gaunt_mender` (both leftover both 0); `equal_gifter` (target leftover AP === MP ≥ 1); `score_mender` (this pass, both leftover **sum === 4 unequal**); Lean Sting is **damage** | Healer CORE only. Dual Keep **destroys** this window if it banks AP. **No extra door** — do not invent `lean_cantor`. |
| `spell-cadence-rise` (remaining `n==1` → `2`; others unchanged) | `cadence_snuffer` (this pass, `n==1` → **0**); `cadence_staller` (`n>0` → `n+1`); `cadence_lagger` (`n>0` → `n+2`); Floor (`n>1` → 1) | Pad the almost-ready bar. Observe via `cadence_thief` / `hex_chorister`. Do **not** restamp `floor_precentor` / `prime_precentor` / `snuff_precentor`. |
| `spell-still-toll` (next **spell** +1 AP if leftover **MP = 0**) | `cast_toller` (next spell +1 AP if they **Struck** last turn); Quiet Hex (ungated next-spell +1); `spent_taxer` (next spell after a **walk**) | Camp-then-spell. Keep 1 walk MP. |
| `spell-brick-brace` (next hit is 0 if a **barrier is adjacent**) | `screen_biter` (**damage** if Bresenham blocked); `brick_stepper` (**relocates through** the barrier); Load Bearing (absorb) | Cover-camping. Destroy the barrier and the hit lands; charge **stays**. |
| `spell-watch-root` (next **overwatch snap** **zeros leftover MP** on the **walker**) | `watch_banker` (**banks** leftover AP); `watch_sipper` (**steals** leftover AP); `watch_feer` (**debits AP** without transfer); Root Snare is a **tile** root | Ending a walker’s remaining walk mid-path. **Do not PAIR with Watch Bank / Watch Sip / Watch Fee.** |
| `spell-odd-gait` (leftover **MP odd** → bonus damage) | `lone_gaiter` (leftover MP **exactly 1**); `pair_gaiter` (leftover MP **exactly 2**); `odd_stinger` (leftover **AP odd**); Dry Sting (leftover MP **= 0**, even) | Poke leftover 1/3. Even leftover → 10 only. |
| `spell-spike-cut` (10 + 10 if target is Chebyshev ≤ 2 from **spike occupancy**) | `hazard_cutter` (**painted** hazard; Wave 13 **excludes** occupancy-only spikes); `portal_cutter` (**world portals**); `spike_reeler` (**pulls**); `spike_skipper` (**ignores tax**) | Threshold poke. Twin Gate pads are **not** spikes. |
| `spell-summon-plate` (allied summons treat the **next hit as 0**) | `summon_ranker` (this pass, walk-off-rank tax); Brood Ward (boss absorb); `brace_chanter` (RES) | One consume per pet. Hit the summoner. **Do not PAIR with Summon Rank on one BASE kit.** |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-snuff` (`NOT_PLAYER_LEARNABLE`; `court_snuff_regent` kit — same law as Court Prime / Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-diag` (ENEMY_ONLY; stays `diag_precentor` CHAMPION SIGNATURE), `spell-far-fold` (BOSS_ONLY; `far_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor / Pack Rank / Rank Fold / Court Prime stay where Waves 5–16 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 17 CORE rows are `mpCost: 0`. Score Sip / Score Lend / Duel Turn / Watch Root rewrite **current leftover AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Score Post / Strike Mark / Cadence Snuff / Cadence Rise are **not** queue splices.  
Do **not** family a twelve-cell occupy. Hendeca Span is the eleven-cell card. Dec Span already owns ten. Nine Span already owns nine. Oct Span already owns eight.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Ring Stride / Hepta Oath / Rime Reel / Rank Bite / Last Mark / Dual Plate / Rift Skip / Fresh Sting / Summon File / Prime Gift / Cadence Cap / Gait Toll / Brick Hold / Watch Drain / Even Gait / Rime Cut / Cast Plate / Pack Orth / Leap Fold (SDE Wave 16 unique CORE — Wave 18).  
Do **not** family remaining CDs `max(1)` floor as a **second** Cadence Floor. SDE already won that hole.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family remaining `n>2` → `2` as a second Cadence Cap. SDE Wave 16 owns that hole.  
Do **not** family leftover 1/1 heal as `spell-score-gift`. Prime Gift is SDE Wave 16.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 16 unique CORE as this pass’s CORE.  
Do **not** mint `wave17:` colliding spell ids.  
Do **not** name the Score Mend family `score_cantor`, the Hendeca Span family `span_hendeca`, the File Stride family `file_gallery` or `rank_lancer`, the Hexa Oath family `hexa_nave` or `penta_prelate` or `six_prelate`, the Lava Reel family `lava_aisle` or `spike_reeler`, the Strike Mark family `strike_pulpit` or `swap_marker`, the Cadence Snuff family `snuff_precentor` or `cadence_floorer`, the Cadence Rise family `floor_precentor` or `prime_precentor`, the Lean Gift family `lean_cantor` or `equal_gifter`, or the Spike Cut family `hazard_cutter` / `spike_reeler` / `portal_cutter`.

---

## 3. Encounter synergy packs (Waves 1–17)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** Score Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span **or** Hendeca Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Score Choir | `score_mender` + `verse_scorer` + `ignite_alchemist` | Sum===4 unequal 8, then Inferno is illegal until leftover AP + leftover MP === 4 AND unequal |
| Hendeca Plug | `hendeca_prelate` + `score_siller` + `file_warder` | Stretched-plus corridor seal, tax a neighbor at turn start, lock the next walk to the file. Skip until remaining cap ≥ 11 |
| File Hexa | `file_warder` + `hexa_oather` + `glass_sniper` | Next walk must share file, next spell must be exact 6, snipe from 6 |
| Lava File | `lava_reeler` + `file_biter` + `glyph_sower` | Pull toward lava, then bite the file they now share |
| Strike Dry | `strike_marker` + `dry_plater` + `goad_herald` | Paint the Strike cell, then camp leftover MP 0 behind the miss |
| Shock Even | `shock_skipper` + `even_stinger` + `tide_shade` | Cross the shock tax, then poke leftover AP even ≥ 2 |
| Lean Rise | `lean_gifter` + `cadence_riser` + `font_cantor` | Heal the AP=0 / MP≥1 window, then pad remaining 1 → 2 |
| Still Brace | `still_toller` + `brick_bracer` + `stone_castellan` | Tax the next spell at leftover MP 0, then camp adjacent to a barrier |
| Watch Odd | `watch_rooter` + `odd_gaiter` + `glass_sniper` | Snap zeros leftover MP, then poke leftover-MP-odd |
| Spike Kennel | `spike_cutter` + `summon_ranker` + `summon_plater` | Threshold poke near spikes, then tax pet walks off rank **or** plate the next hit — COURT, never PAIR Rank + Plate on one BASE kit |
| Duel Score | `duel_turner` + `score_mender` + `score_stinger` | Invert two purses while keeping sum 4, then heal / sting |
| Snuff Verse | `cadence_snuffer` + `verse_scorer` + `tax_scribe` | Unlock remaining 1 → 0, then lock recast until they sit Score |
| Score Quiet | `score_stepper` + `score_mender` + `cover_squire` | Join the sum===4 unequal ally, then cash the six leftover reads |
| Purse Score | `duel_turner` + `score_sipper` + `tally_stinger` | Invert, then sip (3,1)→(2,1) **Tally**, then sting the manufactured window |
| Score Gate | `score_prelate` + `score_siller` + `score_stinger` | Post detonates sum===4 unequal occupy; tile taxes start-of-turn; sting the rest |
| Bounce Score | `score_bouncer` + `must_scorer` + `fuse_binder` | Two Score bodies, bounce 12+12 onto the wick |
| Score Hold File | `score_holder` + `must_scorer` + `leash_warden` | Walk **and** tools need leftover sum === 4 unequal — COURT, never PAIR Score Hold + Must Score on the same body without a third peeler |
| Lend Hood | `score_lender` + `score_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 6), or hold (3,1) through a miss |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood), and Wave 16 packs (Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen).

Do **not** pack as PAIR (COURT later is fine):

- `score_mender` + `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `hendeca_prelate` + `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `score_hooder` + `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` as PAIR
- `score_stinger` + `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` as PAIR
- `score_stepper` + `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire`
- `score_siller` + `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker`
- `score_holder` + `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_scorer` as PAIR / `must_tallier` as PAIR
- `score_lender` + `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `score_sipper` + `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `score_prelate` + `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `hendeca_prelate` / `dec_prelate`
- `score_bouncer` + `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_scorer` + `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `score_holder` as PAIR
- `verse_scorer` + `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as PAIR
- `file_warder` + `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR / `file_biter` as PAIR
- `hexa_oather` + `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `six_prelate` / `penta_prelate`
- `lava_reeler` + `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `lava_skipper` as PAIR
- `file_biter` + `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `file_warder` as PAIR
- `strike_marker` + `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `gait_wicker` / `fuse_binder`
- `dry_plater` + `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `score_hooder` as PAIR / `tally_hooder` as PAIR / `dry_holder` as PAIR / `dry_stinger` as PAIR
- `shock_skipper` + `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper`
- `even_stinger` + `odd_stinger` / `full_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `score_stinger` / `tied_gaiter` / `pair_purser` as PAIR
- `summon_ranker` + `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `lean_gifter` + `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `lean_stinger` as PAIR
- `cadence_riser` + `cadence_snuffer` as PAIR / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner`
- `cadence_snuffer` + `cadence_riser` as PAIR / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`
- `still_toller` + `cast_toller` / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` / `summon_toller` as PAIR / `walk_toller` as PAIR
- `brick_bracer` + `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `screen_biter` as PAIR
- `watch_rooter` + `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `odd_gaiter` + `lone_gaiter` / `pair_gaiter` / `odd_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as PAIR
- `spike_cutter` + `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `spike_reeler` as PAIR / `spike_skipper` as PAIR / `null_censor` as PAIR
- `summon_plater` + `summon_ranker` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR
- `duel_turner` + `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR

Do **not** spawn Hendeca Plug on a map with no free 11-cell stretched plus (solvability). Do not spawn Lava File / Spike Kennel / Shock Even on a map with no lava occupancy / no spike occupancy / no shock cell in Chebyshev 6 of a legal floor. Do not spawn Strike Dry without a legal Strike in the pack (`goad_herald` / `ember_knight` / `bash_bruiser`). Do not spawn Spike Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Watch Odd without an overwatch band (`glass_sniper` / Hold Ground / Far Watch). Twin Gate pads do **not** count as lava, spikes, or `map.portals`.

---

## 4. Family sheets — Wave 17

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-24.md`](https://github.com/Mr-Melic/stralt/pull/1011) (PR #1011) unless marked SDE Wave 15 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-evolution-bc73/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md), PR #962).

---

### ENEMY_ID: `score_mender`

- **NAME:** Score Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 4 AND leftover AP ≠ leftover MP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Score Mend (`spell-score-mend`, #1011). Extra door `score_cantor` — family is **not** that id. Distinct from `tally_mender` (both leftover **sum === 3**), `poise_mender` (both leftover **AP === MP ≥ 1**), `equal_gifter` (target-only tied ≥ 1), `lean_gifter` (this pass, leftover **AP=0 and MP≥1**), `gaunt_mender` (both leftover **0**). At most one six-read heal CORE per pack as PAIR vs Tally / Poise / Equal / Lean / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 4 **or** either body is tied. Peer: Score Mend only if both leftover sums === 4 **and** both unequal **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise window — Frost / Shield). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 4 without tying**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_4_and_unequal"`. VETERAN: skip if either sum ≠ 4 or either body is tied. ELITE: prefer self-cast when the caster already sits on (3,1) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-score-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Tally Mend / Poise Mend / Equal Gift / Lean Gift / Gaunt Mend / Hollow Gift.
- **SIGNATURE_MECHANICS:** Six leftover reads. Legal pairs (4,0) (0,4) (3,1) (1,3). Dual Keep 2/2 is **Poise**, not Score. Dual Keep 3/1 **is** Score. `healAmount` stays 0 on the Score Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum-or-tie → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Dual Keep / Duel Turn is already in the pack (COURT, not PAIR with Equal / Poise / Tally).
- **SYNERGIES:** `duel_turner`, `verse_scorer`, `score_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 4; dump to 2/2 (Poise); dump to 3/0 (Tally); dump to 0/0 (Gaunt); Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (3,1) → (2,1) **Tally**; kill the cantor first; do not hold 4 leftover AP in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-mend` (MULTI: family observe **or** `score_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (six leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_snuffer`

- **NAME:** Cadence Snuffer
- **ROLE:** controller (remaining CDs `n===1` → `0`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Snuff (`spell-cadence-snuff`, #1011). Extra door `snuff_precentor` — family is **not** that id. Distinct from `cadence_riser` (this pass, `n==1` → **2**), `cadence_primer` (`n===0` → `1`), Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0). At most one remaining-1 rewrite CORE per pack as PAIR vs Riser / Primer / Thief / Lagger / Staller / Cracker / Flusher.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already ≠ 1. Peer: Snuff only if a nuke remaining is 1. Above: refuse if the only remaining-1 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **handing the ready bar back for this tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "snuff_if_target_has_remaining_cd_eq_1_on_a_nuke"`. VETERAN: skip all-non-1. ELITE: prefer Inferno remaining 1 over Strike-only. CHAMPION: never Snuff a bar you will Rise the same turn (Rise is a different family).
- **CORE_SPELL_POOL:** `spell-cadence-snuff`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the snuffed id is already remaining 0
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Rise / Cadence Prime / Cadence Floor / Cadence Crack
- **SIGNATURE_MECHANICS:** Remaining `1` → `0`. Zeros stay 0. `n>1` unchanged. Target keeps every spell. Inverse of Rise, not Floor.
- **VARIANT_PROGRESSION:** BASE ready-unlock → VETERAN skip-non-1 → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits sitting on remaining 1 (Inferno). Never CHAMPION in a solo pack with Rise.
- **SYNERGIES:** `verse_scorer`, `tax_scribe`, `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast the remaining-1 id **before** Snuff; Rise your remaining 1 to 2; Cadence Break your own remaining after
- **PLAYER_COUNTERPLAY:** Spend the almost-ready Inferno **now**; Rise it to 2; Swap the snuffed map onto a decoy (`cadence_swapper` is a different family)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-snuff` (MULTI: family observe **or** `snuff_precentor` first-win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 0 when n===1)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hendeca_prelate`

- **NAME:** Hendeca Prelate
- **ROLE:** summoner (eleven-cell occupy, stretched plus)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate`. Extra door is `span_hendeca` — family is **not** that id. At most one Hendeca Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 11.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 11 (Frost / Strike). Peer: plant only if all 11 cells are free and the plus spine splits the player from an exit. Above: refuse if the only plus covers the last portal file (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.10, init 0.85, chc 0.60. Identity is **eleven cells of deny along a stretched plus**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `hendecaspan` (#1011): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **eleven** cells of a stretched plus as one combatant id; **every cell occupied**; **no diagonal cells**. VETERAN: skip if remaining cap < 11. ELITE: Score Sill a neighbor. CHAMPION: never punch a plus if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-hendeca-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` only if a diagonal gap needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / ninespan / decspan / driftpost / leanpost / gauntpost / poisepost / tallypost / scorepost on this body.
- **SIGNATURE_MECHANICS:** Click is the **center**. Facing = 8-dir caster→click. `|dx| >= |dy|` → 7-file spine × 5-rank crossbar. Else 7-rank × 5-file. Shared center once: 11. Diagonal walk is the counter vs Nine Span’s square.
- **VARIANT_PROGRESSION:** BASE corridor plug → VETERAN cap-check → ELITE neighbor tax → CHAMPION solvability refuse
- **RARITY_CURVE:** Standard. +ELITE on corridor maps. Never CHAMPION in a closet.
- **SYNERGIES:** `score_siller`, `file_warder`, `rank_lancer`, `quiet_siller`
- **WEAKNESSES:** Occupy any of the 11 before paint; Coup the one HP pool; walk the diagonal gaps
- **PLAYER_COUNTERPLAY:** Stand on a diagonal; blink / Swap around the plus; kill the body (all eleven free)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hendeca-span` (MULTI: family observe **or** `span_hendeca` first-win)
- **REWARD_EXPECTATION:** Standard. Occupy-weight is the tax, not extra Doka.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (multi-cell occupy + cap weight 11; live cap is 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `duel_turner`

- **NAME:** Duel Turner
- **ROLE:** controller (invert leftover AP↔MP on **two** hostiles; caster unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Duel Turn (`spell-duel-turn`, #1011). No extra door. Distinct from `purse_turner` (one hostile), `bar_crosser` (two-body **cross** through the caster), Tempo Invert (ally/self). At most one leftover-invert CORE per pack as PAIR vs Purse / Bar / Dual Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack size < 2. Peer: invert only if one body sits (4,0) and another (0,4) **or** (3,1)/(1,3). Above: skip if both leftover pairs are already equal (double no-op) or both 0/0.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **turning two hostile purses**. If it tops the meter, the kit leaked toward Swap.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "duel_turn_if_two_hostiles_leftover_ap_ge_2_and_leftover_mp_eq_0_or_inverse"`. VETERAN: skip double-equal / double-empty. ELITE: prefer Score pairs so Score Mend / Score Sting still fire. CHAMPION: never invert if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-duel-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-weaken` only if both bodies sit fat-AP after invert
- **ELITE_SPELL_POOL:** none — do **not** add Purse Turn / Tempo Invert / Bar Cross / Swap as identity
- **SIGNATURE_MECHANICS:** Not `isSwap`. Caster leftover **unchanged**. Sum invariant on each body. Nearest other hostile within Chebyshev 3 of the **target**.
- **VARIANT_PROGRESSION:** BASE two-purse invert → VETERAN skip-noop → ELITE Score-bias → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Score / Tally is already in the pack (COURT).
- **SYNERGIES:** `score_mender`, `score_stinger`, `score_sipper`, `tally_stinger` (after sip manufactures Tally)
- **WEAKNESSES:** Isolate (one body); keep leftover AP === leftover MP on both; Strike before they recast
- **PLAYER_COUNTERPLAY:** Fight without a second body; sit 2/2 on both (double no-op); Quiet Hex after they invert into a 3-AP spell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-duel-turn` (ENEMY_DISCOVERY, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (nearest-other search + two independent leftover inverts)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_hooder`

- **NAME:** Score Hooder
- **ROLE:** protector (next hit is 0 while leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Score Hood (`spell-score-hood`, #1011). Distinct from `tally_hooder` / `poise_hooder` / `odd_plater` / `dry_plater` / `spent_plater`. At most one leftover-window miss CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover sum ≠ 4 or tied. Peer: Hood only while sitting (3,1) / (4,0) / (0,4) / (1,3). Above: refuse if Dual Keep banks 2/2 (Poise Hood’s window).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.70, sr 1.10, res 1.20, init 0.90, chc 0.60. Identity is **holding a sum of 4 without tying**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "score_hood_if_leftover_ap_plus_mp_eq_4_and_unequal"`. VETERAN: skip wrong window. ELITE: Duel Turn to **keep** sum 4. CHAMPION: never lend into a hit you wanted blanked.
- **CORE_SPELL_POOL:** `spell-score-hood`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier` only if a neighbor needs a door
- **ELITE_SPELL_POOL:** none — do **not** add Tally Hood / Poise Hood / Spent Plate / Dry Plate
- **SIGNATURE_MECHANICS:** Any range. Charge remains if the hit arrives off-window. Hit at 2/2 lands (Poise Hood would blank). Hit at 3/0 lands (Tally Hood would blank).
- **VARIANT_PROGRESSION:** BASE window-miss → VETERAN skip-wrong → ELITE keep-sum → CHAMPION no-cash-out
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `duel_turner`, `score_holder`, `cover_squire`
- **WEAKNESSES:** Wait until they spend a pool off 4; Drain Courage; Coup
- **PLAYER_COUNTERPLAY:** Force a tie (2/2); spend them to Tally (3/0); don’t hit while they sit (3,1)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-hood` (ELITE, piece observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover sum + inequality at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_stinger`

- **NAME:** Score Stinger
- **ROLE:** assassin (10 + 8 iff target leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Score Sting (`spell-score-sting`, #1011). Distinct from `tally_stinger` / `poise_stinger` / `even_stinger` / `odd_stinger` / `tied_gaiter`. At most one leftover-window poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the target is off-window **and** a Strike would kill. Peer: sting (3,1) for 18. Above: skip if they sit 2/2 (Poise) or 3/0 (Tally) and Frost is better.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.90, init 1.25, chc 1.10, res 0.70. Identity is **poking the Score pair**. If it tops the meter ungated, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "score_sting_if_target_leftover_ap_plus_mp_eq_4_and_unequal"`. VETERAN: skip off-window unless 10 still wins. ELITE: Duel Turn first to keep them in Score. CHAMPION: refuse if Strike would kill.
- **CORE_SPELL_POOL:** `spell-score-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on a **different** tile
- **ELITE_SPELL_POOL:** none — do **not** add Tally Sting / Poise Sting / Even Sting / Odd Sting
- **SIGNATURE_MECHANICS:** 10 always. +8 only on (4,0) (0,4) (3,1) (1,3). Dual Keep 2/2 is the **wrong** window.
- **VARIANT_PROGRESSION:** BASE gated poke → VETERAN skip-wrong → ELITE invert-then-poke → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Dual Keep 3/1 is already in the pack.
- **SYNERGIES:** `duel_turner`, `score_holder`, `score_sipper` (manufactures Tally for a different body)
- **WEAKNESSES:** Spend off sum 4; sit 2/2 or 3/0 or 0/0
- **PLAYER_COUNTERPLAY:** Cast 1 from (3,1); dump to 2/2; sit empty
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_stepper`

- **NAME:** Score Stepper
- **ROLE:** teleporter (relocate adjacent to an ally whose leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Score Step (`spell-score-step`, #1011). Distinct from `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `home_stepper` / `brick_stepper`. Relocate, not `isSwap`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally sits Score. Peer: join the (0,4) wisp. Above: skip if every neighbor is occupied.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.00, res 0.80, init 1.20, chc 0.80. Identity is **gated relocate**. If it tops the meter, the kit leaked toward Mist Step.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "score_step_if_ally_sum_eq_4_unequal_and_free_adj"`. VETERAN: skip occupied ring. ELITE: Score Mend from the new cell if **you** also sit Score. CHAMPION: never step onto lava / portal.
- **CORE_SPELL_POOL:** `spell-score-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-mark` on the dest
- **ELITE_SPELL_POOL:** none — do **not** add Swap / Phase Slip / Tally Step / Poise Step
- **SIGNATURE_MECHANICS:** Dest Chebyshev 1 of the Score ally. Hazard **must tick**. `movedThisTurn` = true. Does **not** increment walk-spend.
- **VARIANT_PROGRESSION:** BASE join-window → VETERAN skip-blocked → ELITE mend-after → CHAMPION no-hazard
- **RARITY_CURVE:** Standard. +ELITE when a Score healer is already in the pack (COURT).
- **SYNERGIES:** `score_mender`, `score_lender`, `cover_squire`
- **WEAKNESSES:** Occupy every neighbor; break the ally’s sum or force a tie
- **PLAYER_COUNTERPLAY:** Body-block the ring; Drain the ally off 4; sit them 2/2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (leftover gate + occupy dest)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_siller`

- **NAME:** Score Siller
- **ROLE:** hazard creator (start-of-their-turn occupy tax iff leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Score Sill (`spell-score-sill`, #1011). Distinct from `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `strike_marker`. At most one start-turn leftover-window sill CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Barrier if the tile will be empty. Peer: paint a cell the (3,1) bishop will camp. Above: skip if Dual Keep 2/2 is the only leftover they can hold (Poise Sill’s window).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 1.00, res 0.90, init 1.00, chc 0.70. Identity is **dawn tax on a Score pair**. If it tops the meter on cast turn, the kit leaked — Sill deals **0 on cast**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "score_sill_if_tile_will_be_occupied_by_sum_eq_4_unequal_foe"`. VETERAN: skip empty-and-unreachable. ELITE: Score Hold so they cannot walk off before dawn. CHAMPION: never paint a portal / void.
- **CORE_SPELL_POOL:** `spell-score-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile, `spell-slow`
- **RARE_SPELL_POOL:** `spell-barrier` last-writer vs other paints
- **ELITE_SPELL_POOL:** none — do **not** add Tally Sill / Poise Sill / Wake Mark / Strike Mark
- **SIGNATURE_MECHANICS:** Walk-enter does **not** tax. End-turn occupy does **not** tax. Start-of-their-turn only. Dual Keep 2/2 **misses**. Dual Keep 3/1 **hits**.
- **VARIANT_PROGRESSION:** BASE dawn tax → VETERAN skip-empty → ELITE hold-camp → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on camp maps.
- **SYNERGIES:** `score_holder`, `hendeca_prelate`, `score_prelate` (end-turn is a different clock — COURT)
- **WEAKNESSES:** Spend off 4 before turn start; walk off (start-only); Barrier last-writer
- **PLAYER_COUNTERPLAY:** Dump to 2/2 overnight; don’t camp (3,1) on the paint
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-sill` (ENEMY_DISCOVERY). Paint is observation; later tick is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (start-of-turn leftover sum + inequality)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_holder`

- **NAME:** Score Holder
- **ROLE:** controller (cannot spend walk MP while leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Score Hold (`spell-score-hold`, #1011). Distinct from `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder`. **Do not PAIR with `must_scorer`.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Slow if leftover sum ≠ 4 or tied. Peer: lock (0,4) so they have MP they cannot spend. Above: skip if they already sit 0/0.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 1.00, res 1.00, init 1.05, chc 0.70. Identity is **walk denial while sum is 4 without tying**. If it tops the meter, the kit leaked toward Root.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "score_hold_if_target_leftover_ap_plus_mp_eq_4_unequal_and_wants_to_walk"`. VETERAN: skip wrong window. ELITE: Duel Turn (0,4) stays Score. CHAMPION: never also Must Score on this body.
- **CORE_SPELL_POOL:** `spell-score-hold`, `spell-slow`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-root-snare` only if already in the pack as a different family’s ADVANCED — else skip
- **ELITE_SPELL_POOL:** none — do **not** add Must Score / Tally Hold / Poise Hold
- **SIGNATURE_MECHANICS:** Teleport / Swap / Score Step do **not** pay walk MP and stay legal. Leftover 2/2 walk is Poise Hold’s window, **not** this. Leftover 3/0 walk is Tally Hold’s window, **not** this.
- **VARIANT_PROGRESSION:** BASE walk-lock → VETERAN skip-wrong → ELITE keep-sum → CHAMPION no-tool-lock
- **RARITY_CURVE:** Standard. +ELITE vs kite kits sitting (0,4).
- **SYNERGIES:** `leash_warden`, `duel_turner`, `score_siller`. COURT with `must_scorer` + a third peeler.
- **WEAKNESSES:** Spend leftover AP (cast) to leave sum 4; blink; wait 2
- **PLAYER_COUNTERPLAY:** From (0,4) Duel Turn / Purse Turn into (4,0) then Strike; or wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-hold` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (walk-spend gate + leftover sum + inequality)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_lender`

- **NAME:** Score Lender
- **ROLE:** buffer (+1 AP and +1 MP to an ally whose leftover AP + leftover MP === 4 AND unequal — **exits** to sum 6)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Score Lend (`spell-score-lend`, #1011). Distinct from `tally_lender` / `poise_lender` / `gaunt_lender` / `tempo_precentor`. At most one leftover-window lend CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Haste if the ally is off-window (Haste is ADVANCED, never CORE). Peer: cash (3,1) → (4,2). Above: skip if both pools are already at max.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **cashing a sum of 4 without tying**. If it tops the meter, the kit leaked toward Tempo Gift.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "score_lend_if_ally_sum_eq_4_and_unequal"`. VETERAN: skip off-window. ELITE: Must Score **before** the lend while they still sit on 4. CHAMPION: never lend into a Score Hood you wanted to keep.
- **CORE_SPELL_POOL:** `spell-score-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-enrage`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Tally Lend / Poise Lend / Tempo Gift
- **SIGNATURE_MECHANICS:** Inequality is preserved. (3,1)→(4,2) is **not** Poise, **not** Tally, **not** Score. Poise Lend **keeps** a window; this **spends** one.
- **VARIANT_PROGRESSION:** BASE cash-out → VETERAN skip-wrong → ELITE lock-then-cash → CHAMPION no-hood-break
- **RARITY_CURVE:** Standard. +ELITE when a Score Hold is already in the pack (COURT).
- **SYNERGIES:** `must_scorer`, `dual_keeper` (banks the new leftover), `tempo_precentor` (COURT, not PAIR)
- **WEAKNESSES:** Drain Courage / Slow after the grant; refuse the window so the lend fizzles
- **PLAYER_COUNTERPLAY:** Sit 2/2 so the lend fizzles; kill the buffer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_sipper`

- **NAME:** Score Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Score Sip (`spell-score-sip`, #1011). Distinct from `tally_sipper` / `poise_sipper` / `bare_sipper`. At most one leftover-window sip CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Slow if leftover AP is 0 (the (0,4) pair). Peer: sip (3,1) → (2,1) **Tally**. Above: skip if they sit 2/2 (Poise Sip’s window).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 0.90, init 1.20, chc 0.90, res 0.70. Identity is **manufacturing Tally from Score**. If it tops the meter, the kit leaked toward Soul Sip.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "score_sip_if_target_sum_eq_4_unequal_and_leftover_ap_ge_1"`. VETERAN: skip leftover AP 0. ELITE: Tally Sting after manufacturing 2/1 (COURT, not PAIR with `tally_stinger` on this body). CHAMPION: never sip if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-score-sip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-weaken`
- **ELITE_SPELL_POOL:** none — do **not** add Tally Sip / Poise Sip / Bare Sip / Soul Sip
- **SIGNATURE_MECHANICS:** Sip (3,1)→(2,1) Tally; (4,0)→(3,0) Tally; (1,3)→(0,3) Tally. (0,4) fizzles. Dual Keep 2/2 is the **wrong** window.
- **VARIANT_PROGRESSION:** BASE steal-window → VETERAN skip-no-AP → ELITE manufacture-Tally → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when a Tally Stinger is already in the pack (COURT).
- **SYNERGIES:** `tally_stinger`, `tally_mender`, `duel_turner`, `score_holder`
- **WEAKNESSES:** Sit on (0,4); sit off sum 4; sit on 2/2
- **PLAYER_COUNTERPLAY:** Hold leftover MP 4 and leftover AP 0; dump to a tie; Second Wind after
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_prelate`

- **NAME:** Score Prelate
- **ROLE:** summoner (empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Score Post (`spell-score-post`, #1011). Distinct from `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `hendeca_prelate`. Counts as **1**. `summonAI: "scorepost"`. At most one 1-cell leftover-window post CORE per pack as PAIR vs Tally / Poise / Gaunt / Dummy / Drift / Lean.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if cap is full (Frost). Peer: plant where the (3,1) bishop will end the turn. Above: refuse if Dual Keep 2/2 is the only leftover they can hold (Poise Post’s window).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.70, sr 0.90, res 1.00, init 0.90, chc 0.60. Identity is **end-turn occupy on a sum of 4 without tying**. If it tops the meter on cast turn, the kit leaked — Post deals **0 on cast**.
- **AI_TIER_PROGRESSION:** New summon AI `scorepost`: `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **one** cell. VETERAN: skip if cap is full. ELITE: Score Hold so they cannot walk off. CHAMPION: never plant on a portal / void.
- **CORE_SPELL_POOL:** `spell-score-post`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` as a door on a neighbor
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / dummy / tallypost / poisepost / gauntpost / hendecaspan / decspan on this body.
- **SIGNATURE_MECHANICS:** Walk-enter does **not** detonate. Relocate landing does **not** detonate. Start-of-turn does **not** detonate. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep 3/1 **hurts this**.
- **VARIANT_PROGRESSION:** BASE end-turn mine → VETERAN cap-check → ELITE hold-camp → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on camp maps.
- **SYNERGIES:** `score_holder`, `score_siller` (start-turn is a different clock — COURT), `duel_turner`
- **WEAKNESSES:** Spend a pool before turn end; walk off; Coup the post
- **PLAYER_COUNTERPLAY:** Dump to 2/2 before turn end; don’t camp (3,1) on the body
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-post` (ENEMY_DISCOVERY). Summon is observation; later detonate is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (empty-kit summon + end-turn leftover sum + inequality). `inferSummonArchetype` must accept `scorepost` as an empty-kit stationary post, not hunter fallback.
- **STATUS:** PROPOSED

---

### ENEMY_ID: `score_bouncer`

- **NAME:** Score Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest other leftover-AP+MP===4 unequal hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Score Bounce (`spell-score-bounce`, #1011). Distinct from `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `storm_caller`. At most one leftover-window bounce CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second Score body. Peer: open on whoever, splash the (3,1) bishop. Above: skip if a Strike would kill the primary **and** no second Score body.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, init 1.10, chc 0.85, res 0.75. Identity is **two Score bodies**. If it tops the meter on a solo 12, the kit leaked toward Chain Lightning.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "score_bounce_if_second_sum_eq_4_unequal_hostile_in_r4"`. VETERAN: skip no-second unless 12 still wins. ELITE: Duel Turn a second body into Score first. CHAMPION: never bounce allies.
- **CORE_SPELL_POOL:** `spell-score-bounce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-blast` only if two Score bodies already sit (never as identity)
- **ELITE_SPELL_POOL:** none — do **not** add Chain Lightning as CORE identity / Tally Bounce / Poise Bounce
- **SIGNATURE_MECHANICS:** Primary leftover unconstrained. Second body must sit Score. Dual Keep 2/2 is the **wrong** second body. Missing bounce keys → 12 only.
- **VARIANT_PROGRESSION:** BASE gated bounce → VETERAN skip-solo → ELITE invert-second → CHAMPION no-ally
- **RARITY_CURVE:** Standard. +ELITE when Duel Turn is already in the pack (COURT).
- **SYNERGIES:** `duel_turner`, `must_scorer`, `fuse_binder`
- **WEAKNESSES:** Isolate (one Score body); sit the second body on 2/2 or 3/0 or 0/0
- **PLAYER_COUNTERPLAY:** Keep the second body off Score; kill the queen first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-score-bounce` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_scorer`

- **NAME:** Must Scorer
- **ROLE:** controller (non-Strike illegal unless leftover AP + leftover MP === 4 AND unequal **and** the spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Must Score (`spell-must-score`, #1011). Distinct from `must_tallier` / `must_poiser` / `must_gaunter`. **Do not PAIR with `score_holder`.**
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover sum ≠ 4 or tied. Peer: lock (3,1) so their 3-cost tool is the last packet, or lock (0,4) so every non-Strike is illegal (leftover AP 0). Above: skip if the only remaining legal verb is Strike and a walk would kill.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 1.00, res 1.00, init 1.05, chc 0.70. Identity is **last-packet from a sum of 4 without tying**. If it tops the meter, the kit leaked toward Hex of Silence.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_score_if_target_leftover_sum_eq_4_unequal_and_has_a_last_packet_spell"`. VETERAN: skip wrong window. ELITE: Duel Turn (0,4)→(4,0) so a 4-cost last packet becomes legal for **them** only if you want the dump to Gaunt. CHAMPION: never also Score Hold on this body.
- **CORE_SPELL_POOL:** `spell-must-score`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Must Tally / Must Poise / Score Hold / Hex of Silence
- **SIGNATURE_MECHANICS:** **Pre-spend leftover** (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Strike stays legal. Walk stays legal unless a Score Hold is also up (COURT, not PAIR). Leftover (2,2) does **not** lift (Must Poise’s window). Leftover (3,0) does **not** lift (Must Tally’s window).
- **VARIANT_PROGRESSION:** BASE last-packet lock → VETERAN skip-wrong → ELITE invert-into-legal → CHAMPION no-walk-lock
- **RARITY_CURVE:** Standard. +ELITE vs tool-heavy kits sitting Score.
- **SYNERGIES:** `leash_warden`, `duel_turner`. COURT with `score_holder` + a third peeler.
- **WEAKNESSES:** Strike; blink; wait 2; Duel Turn / Purse Turn yourself
- **PLAYER_COUNTERPLAY:** Strike through the lock; sit 2/2 so this lock never lifts and Must Poise would; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-score` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pre-spend leftover sum + inequality + last-AP compare in the cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_scorer`

- **NAME:** Verse Scorer
- **ROLE:** debuffer (last resolved id illegal until leftover AP + leftover MP === 4 AND unequal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Verse Score (`spell-verse-score`, #1011). Distinct from `verse_tallier` / `verse_poiser` / `verse_gaunter` / `last_muter` / `summon_verser`. At most one leftover-window last-id lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last resolved id. Peer: lock Inferno until they sit (3,1). Above: skip if they already sit Score (instant lift — fizzle rider).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **which leftover window lifts the last verse**. If it tops the meter, the kit leaked toward Hex of Silence.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_score_if_target_last_id_is_their_win_condition"`. VETERAN: skip no-last-id / already-Score. ELITE: Cadence Snuff so the locked id is also remaining 0. CHAMPION: never lock Strike (Strike is not a spell id for this key).
- **CORE_SPELL_POOL:** `spell-verse-score`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-weaken`
- **ELITE_SPELL_POOL:** none — do **not** add Verse Tally / Verse Poise / Last Mute / Summon Verse / Hex of Silence
- **SIGNATURE_MECHANICS:** Dual Keep 2/2 does **not** lift. Dual Keep 3/1 **does**. Sitting 3/0 does **not** lift (Verse Tally). Sitting 0/0 does **not** lift (Verse Gaunt). Fail closed until `lastResolvedSpellId` is written.
- **VARIANT_PROGRESSION:** BASE last-id lock → VETERAN skip-already-lifted → ELITE snuff-then-lock → CHAMPION no-Strike
- **RARITY_CURVE:** Standard. +ELITE vs Inferno kits.
- **SYNERGIES:** `cadence_snuffer`, `score_holder`, `ignite_alchemist`
- **WEAKNESSES:** Sit on (4,0) / (0,4) / (3,1) / (1,3); recast a different id; wait
- **PLAYER_COUNTERPLAY:** Dual Keep 3/1; recast Frost instead of Inferno; dump to Score on purpose to recast
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-score` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (last-id lock + leftover sum + inequality lift)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `file_warder`

- **NAME:** File Warder
- **ROLE:** controller (next walk legal only if `dest.x == x_at_arm`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is File Stride (`spell-file-stride`, #962). Extra room `file_gallery` — family is **not** that id. Distinct from `rank_warder` (same **y**), `orth_warder` (any orthogonal), `diag_warder` (diagonal), Rank Lock (all remaining walks on rank **or** file), Pack File (`ENEMY_ONLY`). Do **not** name it `rank_lancer`. At most one next-walk-axis CORE per pack as PAIR vs Rank / Orth / Diag / Inch Warder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they must change file to threaten. Peer: arm only if a same-file approach already exists. Above: skip if they must change file and Strike is better. **Do not** assign to chargers who only walk toward the player on a rank.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 1.00, res 1.00, init 1.10, chc 0.80. Identity is **one-walk file lock**. If it tops the meter, the kit leaked toward File Lance.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_same_file_only"`. VETERAN: skip if they must change file. ELITE: File Bite on a different body after they are stuck (COURT, not PAIR). CHAMPION: never become Orth Stride or Rank Stride on a failed confirm — fail closed (MP not spent).
- **CORE_SPELL_POOL:** `spell-file-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-mark` on the only same-file approach
- **ELITE_SPELL_POOL:** none — do **not** add Rank Stride / Orth Stride / Rank Lock / Pack File / File Bite
- **SIGNATURE_MECHANICS:** Length is free. Rank-change confirm-fails. Forced movement / swap / blink / Twin-gate still legal. Does **not** read `currentView`. Fail closed until a next-walk dest writer exists.
- **VARIANT_PROGRESSION:** BASE file lock → VETERAN skip-need-rank-change → ELITE combo-bite → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE on corridor maps. Never CHAMPION in a 1-tile closet.
- **SYNERGIES:** `file_biter` (COURT, not PAIR), `hexa_oather`, `hendeca_prelate`, `rank_lancer` (File Lance after they are stuck — COURT)
- **WEAKNESSES:** Stand off-file; occupy the only same-file approach; Root before they arm
- **PLAYER_COUNTERPLAY:** Step to a different file; body-block the file; Swap them off the armed x
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-file-stride` (ENEMY_DISCOVERY: family observe **or** `file_gallery` teach — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (next-walk dest writer; fail closed until it exists)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hexa_oather`

- **NAME:** Hexa Oather
- **ROLE:** controller (next spell illegal unless Chebyshev = 6)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Hexa Oath (`spell-hexa-oath`, #962). Extra room `hexa_nave` — family is **not** that id. Distinct from `penta_oather` (exact **5**), `quad_oather` (exact **4**), `long_oather` (**≥ 3**), `six_prelate` (occupy-weight 6). Do **not** name it `hexa_nave` or `six_prelate`. At most one exact-Chebyshev oath CORE per pack as PAIR vs Penta / Quad / Tri / Mid / Long Oather.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they cannot reach 6 this turn. Peer: arm only if a legal 6 already exists (Far Sting / Frost). Above: skip if they sit at 5 or 7 and would fizzle.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, init 1.15, chc 0.80, res 0.70. Identity is **exact-6 prison**. If it tops the meter, the kit leaked toward Far Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_6"`. VETERAN: skip if they cannot reach 6. ELITE: Far Sting as the gated poke (ADVANCED). CHAMPION: never restamp `span_six`.
- **CORE_SPELL_POOL:** `spell-hexa-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-far-sting` if already in the catalog for this chassis, else `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark` on the Chebyshev-6 cell
- **ELITE_SPELL_POOL:** none — do **not** add Penta Oath / Quad Oath / Six Span / Far Hood
- **SIGNATURE_MECHANICS:** `physical_attack` stays legal at any range. If they arm then walk to 5, the spell fizzles on confirm (AP not spent for the fizzled spell; Hexa Oath already observed).
- **VARIANT_PROGRESSION:** BASE exact-6 → VETERAN skip-unreachable → ELITE gated-poke → CHAMPION no-occupy-clone
- **RARITY_CURVE:** Standard. +ELITE on long-file maps. Never CHAMPION in a 4-tile room.
- **SYNERGIES:** `file_warder`, `glass_sniper`, `far_stinger` (COURT)
- **WEAKNESSES:** Close to 5 or 7; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Walk to 5; occupy the 6; Swap them off the line
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hexa-oath` (ENEMY_DISCOVERY: family observe **or** `hexa_nave` teach)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`nextSpellExactChebyshev: 6`; reuse Penta/Quad key)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lava_reeler`

- **NAME:** Lava Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest lava occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Lava Reel (`spell-lava-reel`, #962). Extra room `lava_aisle` — family is **not** that id. Distinct from `spike_reeler` (spike occupancy), `cinder_reeler` (painted hazard), `lava_skipper` (ignore lava **land tax**), `void_reeler` (void/portal). Tenth `applyAttract` dest flavor. At most one attract-toward-occupancy CORE per pack as PAIR vs Spike / Pit / Brick / Void / Cinder / Paint / Foe / Ally / File Reel.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no lava exists. Peer: pull only if the 1-step is not a world portal / void. Above: skip if the 1-step would land them **onto** lava and a later skip family is not in the pack (solvability — pull **toward**, dest is never `map.portals`).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **pull toward lava**. If it tops the meter, the kit leaked toward Hook Line.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_lava"`. VETERAN: skip no-lava / portal-step. ELITE: File Bite after they now share a file (COURT). CHAMPION: never dest `map.portals`.
- **CORE_SPELL_POOL:** `spell-lava-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` only if they are already committed to the toward-tile
- **ELITE_SPELL_POOL:** none — do **not** add Spike Reel / Cinder Reel / Lava Skip / Hook Line
- **SIGNATURE_MECHANICS:** No damage. Lava cells are map-modifier occupancy, **not** painted cinder, **not** `map.portals`, **not** spike occupancy. Empty board fizzles (AP spent, observe). Fail closed until `applyAttract` has a lava-occupancy dest.
- **VARIANT_PROGRESSION:** BASE toward-lava → VETERAN skip-empty → ELITE combo-bite → CHAMPION no-portal
- **RARITY_CURVE:** Standard. +ELITE on maps that already place lava occupancy. Never CHAMPION on a lava-less map.
- **SYNERGIES:** `file_biter`, `glyph_sower`, `lava_skipper` (COURT, not PAIR — they still get pulled, tax skipped)
- **WEAKNESSES:** Fight on maps without lava; occupy the toward-tile; blink
- **PLAYER_COUNTERPLAY:** Don’t stand 1 toward lava; blink; body-block the toward-cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lava-reel` (ENEMY_DISCOVERY: family observe **or** `lava_aisle` teach). Empty-board fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (tenth `applyAttract` dest flavor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `file_biter`

- **NAME:** File Biter
- **ROLE:** bruiser (10 + 10 if caster and target share a file)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is File Bite (`spell-file-bite`, #962). Distinct from `axis_biter` (rank **or** file), `screen_biter` (Bresenham **blocked**), File Lance (linear poke). **Do not PAIR with `file_warder`.** At most one share-axis bite CORE per pack as PAIR vs Axis / Screen / Foe / Side / Lone / Nook / Field / Wall Biter.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they do not share a file. Peer: bite the file for 20. Above: skip if they share only a rank (Axis Bite’s window) and Frost is better.
- **STAT_SCALING_RULE:** hp 1.10, sp 1.10, sr 0.90, res 1.00, init 1.05, chc 0.85. Identity is **bonus on the file**. If it tops the meter off-file, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_share_file_with_caster"`. VETERAN: skip off-file unless 10 still wins. ELITE: File Stride on a different body first (COURT). CHAMPION: fail closed (10 only), never become Axis Bite.
- **CORE_SPELL_POOL:** `spell-file-bite`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-enrage`
- **ELITE_SPELL_POOL:** none — do **not** add Axis Bite / Screen Bite / File Lance / File Stride
- **SIGNATURE_MECHANICS:** Extra 10 only if `target.x == caster.x` and `dy ≠ 0`. Rank-only or diagonal → 10 only. Off-file 10 still observes.
- **VARIANT_PROGRESSION:** BASE file bonus → VETERAN skip-off-file → ELITE lock-then-bite → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE on corridor maps.
- **SYNERGIES:** `file_warder` (COURT, not PAIR), `lava_reeler`, `hendeca_prelate`
- **WEAKNESSES:** Step off the file; stand on the rank instead; blink
- **PLAYER_COUNTERPLAY:** Leave the file; sit on their rank; Root before they walk onto the file
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-file-bite` (ENEMY_DISCOVERY). Off-file 10 still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `strike_marker`

- **NAME:** Strike Marker
- **ROLE:** anti-melee (cell detonates when a unit Strikes from it)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Strike Mark (`spell-strike-mark`, #962). Extra room `strike_pulpit` — family is **not** that id. Distinct from `swap_marker` (teleport landing), `shove_marker` (force-move landing), `cast_marker` (spell confirm), `ingress_marker` (walk enter). At most one detonate-on-X paint CORE per pack as PAIR vs Swap / Shove / Cast / Ingress / Wake / Dwell / Score Sill.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player has no Strike in kit and no adjacent melee threat. Peer: paint the cell they must Strike from. Above: Goad / Taunt on a different body to force Strike (COURT).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.05, chc 0.75. Identity is **punishing melee from a bait cell**. If it tops the meter on cast turn, the kit leaked — Mark deals **0 on paint**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_strike_from"`. VETERAN: skip if no Strike in the opposing kit. ELITE: Goad a different body (COURT). CHAMPION: never CORE with Swap Mark.
- **CORE_SPELL_POOL:** `spell-strike-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark` on a **different** tile (decoy vs bait)
- **RARE_SPELL_POOL:** `spell-goad` only if already in the pack as a different family’s CORE
- **ELITE_SPELL_POOL:** none — do **not** add Swap Mark / Shove Mark / Cast Mark / Ingress Mark
- **SIGNATURE_MECHANICS:** Walk-enter, spell confirm, push, pull, slide, and teleport **do not** detonate. Strike / `physical_attack` originating on the cell takes 10 (spell, RES+SR) and the paint consumes. Observation is the **paint**. Fail closed until Strike-from-cell is readable.
- **VARIANT_PROGRESSION:** BASE Strike-bait → VETERAN skip-no-melee → ELITE force-Strike → CHAMPION no-swap-clone
- **RARITY_CURVE:** Standard. +ELITE vs melee kits.
- **SYNERGIES:** `goad_herald`, `dry_plater`, `ember_knight`
- **WEAKNESSES:** Spell from the cell (safe); walk onto it (safe); wait the 2; Strike from an adjacent cell
- **PLAYER_COUNTERPLAY:** Don’t Strike from the paint; Frost from it; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-strike-mark` (ENEMY_DISCOVERY: family observe **or** `strike_pulpit` teach). Detonate does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (Strike-from-cell writer)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dry_plater`

- **NAME:** Dry Plater
- **ROLE:** protector (next hit is 0 while leftover MP is 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Dry Plate (`spell-dry-plate`, #962). Distinct from `gait_plater` (leftover **MP ≥ 1**), `spent_plater` (leftover **AP ≥ 1**), `odd_plater` (leftover AP **odd**), `score_hooder` (sum===4 unequal). At most one leftover-window miss CORE per pack as PAIR vs those / Tally Hood / Poise Hood. Do **not** mint `spell-even-plate`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover MP ≥ 1. Peer: Hood only while leftover MP is 0. Above: skip if they must walk that leftover MP to threaten.
- **STAT_SCALING_RULE:** hp 1.20, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **camping at 0 MP**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_mp_eq_0"`. VETERAN: skip leftover MP ≥ 1. ELITE: Still Toll after they camp at 0 MP (COURT). CHAMPION: never CORE with Dry Sting (damage vs negate).
- **CORE_SPELL_POOL:** `spell-dry-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Gait Plate / Spent Plate / Odd Plate / Dry Sting / Score Hood
- **SIGNATURE_MECHANICS:** If leftover MP ≥ 1, the hit lands and the charge **remains**. Does not read `CharacterStats.evasion`. Weaker than Spent Plate while they still have AP.
- **VARIANT_PROGRESSION:** BASE MP-empty miss → VETERAN skip-has-MP → ELITE tax-then-camp → CHAMPION no-sting-clone
- **RARITY_CURVE:** Standard. +ELITE vs burst kits.
- **SYNERGIES:** `still_toller`, `strike_marker`, `ley_tollkeeper` (Undertow to empty their walk pool — COURT)
- **WEAKNESSES:** Hit them while leftover MP ≥ 1; force a walk that spends last MP, then wait; wait the turn start peel
- **PLAYER_COUNTERPLAY:** Don’t dump leftover MP in their face; poke while they still have 1 walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dry-plate` (ENEMY_DISCOVERY). Leftover-MP≥1 full hit does not consume and does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `shock_skipper`

- **NAME:** Shock Skipper
- **ROLE:** kiter (next 1-tile walk ignores shock-tile enter-tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Shock Skip (`spell-shock-skip`, #962). Extra room `shock_nave` — family is **not** that id. Distinct from `mire_skipper` / `spike_skipper` / `rime_skipper` / `lava_skipper` / `glyph_skipper`. Shock Glyph is a **boss paint**, not this skip. At most one 1-tile-hazard-skip CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no shock tile is on the intended 1-tile path. Peer: skip only a length-1 step onto shock occupancy. Above: skip if they would walk length ≥ 2 (still pays).
- **STAT_SCALING_RULE:** hp 0.70, sp 0.80, sr 0.90, init 1.25, chc 0.90, res 0.70. Identity is **length-1 shock skip**. If it tops the meter, the kit leaked toward Phase Slip.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "skip_shock_tile_tax_one_tile"`. VETERAN: skip if no shock on the path. ELITE: Even Sting after they land (COURT). CHAMPION: never ignore lava/spikes.
- **CORE_SPELL_POOL:** `spell-shock-skip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-haste`
- **ELITE_SPELL_POOL:** none — do **not** add Mire Skip / Spike Skip / Shock Glyph / Phase Slip
- **SIGNATURE_MECHANICS:** Shock tiles are map-modifier / boss `SHOCK_TILES` occupancy, **not** Shock Glyph paint. Length ≥ 2 still pays. Lava, spikes, glyph-tax, rime leave-tax, and mire enter-tax still tick. Consume-on-first-walk.
- **VARIANT_PROGRESSION:** BASE 1-tile skip → VETERAN skip-no-shock → ELITE land-then-poke → CHAMPION no-other-hazard
- **RARITY_CURVE:** Standard. +ELITE on maps that already place shock occupancy. Do not skip `finalizePlayableLayout`.
- **SYNERGIES:** `even_stinger`, `tide_shade`, `ley_tollkeeper`
- **WEAKNESSES:** Force a length-2 path; overwrite the cell; Root
- **PLAYER_COUNTERPLAY:** Don’t stand 1 away across shock; Root; make them walk 2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shock-skip` (ENEMY_DISCOVERY: family observe **or** `shock_nave` teach). Observation is the **arm**, not the later walk.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MEDIUM (1-tile shock-tax skip flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `even_stinger`

- **NAME:** Even Stinger
- **ROLE:** assassin (10 + 10 iff target leftover AP is even and ≥ 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Even Sting (`spell-even-sting`, #962). Distinct from `odd_stinger` (leftover AP **odd**), `tied_gaiter` (both leftover **exactly 2**), `full_stinger` (leftover AP **≥ 3**), `score_stinger` (sum===4 unequal). 0 is even — this card **excludes 0**. Overlap with Pair Purse at exactly 2 is documented, not a clone. At most one leftover-AP-parity poke CORE per pack as PAIR vs Odd / Full / Tally / Poise / Gaunt / Score Stinger.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover AP is 0 or odd **and** a Strike would kill. Peer: poke leftover 2/4 for 20. Above: skip if leftover AP is 0 or odd and Frost is better.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.90, init 1.25, chc 1.10, res 0.70. Identity is **poking leftover 2/4**. If it tops the meter ungated, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_target_leftover_ap_even_ge_2"`. VETERAN: skip 0/odd unless 10 still wins. ELITE: Drain Courage to land leftover 2 (COURT). CHAMPION: fail closed (10 only), never become Odd Sting.
- **CORE_SPELL_POOL:** `spell-even-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Odd Sting / Score Sting / Tied Gait / Pair Purse / Gaunt Sting
- **SIGNATURE_MECHANICS:** Extra 10 only on leftover AP 2, 4, 6, …. 0 and odd → 10 only. Odd-or-zero leftover 10 still observes.
- **VARIANT_PROGRESSION:** BASE even-AP poke → VETERAN skip-odd → ELITE drain-then-poke → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE vs Dual Keep leftover 2.
- **SYNERGIES:** `shock_skipper`, `ledger_siphon` (COURT), `plate_warden`
- **WEAKNESSES:** Spend 1 AP to odd the pool; sit at 0 or 1; Dual Keep leftover 1
- **PLAYER_COUNTERPLAY:** Dump leftover AP to 1 or 3; sit empty; Strike first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-even-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_ranker`

- **NAME:** Summon Ranker
- **ROLE:** anti-summon (allied summons pay +1 AP to walk off the summoner’s rank)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Summon Rank (`spell-summon-rank`, #962). Distinct from `summon_toller` (every pet **walk** +1 AP), `summon_gaiter` (pet walk +1 **MP**), `summon_verser` (pets pay +1 AP to **recast last id**), Pack Rank (`ENEMY_ONLY` hard lock). **Do not PAIR with Summon Toll / Summon Gait / Summon Verse / Summon Plate.** Drop this id if `summonAI` is empty.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no allied summon. Peer: arm only if a wolf/archer will walk off rank. Above: skip if they will stay on rank.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 1.00, res 0.90, init 1.05, chc 0.70. Identity is **taxing a file-advance pet**. If it tops the meter, the kit leaked toward Summon Toll.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "summon_walk_off_rank_ap_tax"`. VETERAN: skip no-pet / stay-on-rank. ELITE: Kennel Sill parks the pets (COURT). CHAMPION: never CORE with Pack Rank.
- **CORE_SPELL_POOL:** `spell-summon-rank`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Toll / Summon Gait / Summon Verse / Summon Plate / Pack Rank
- **SIGNATURE_MECHANICS:** Walks that stay on the summoner’s rank at arm time are free of this tax. Strike / spells are **not** walks for this key. Player copy taxes **their** pets — a real downside.
- **VARIANT_PROGRESSION:** BASE off-rank tax → VETERAN skip-no-pet → ELITE park-then-tax → CHAMPION no-hard-lock
- **RARITY_CURVE:** Standard. +ELITE when a dedicated summoner is already in the pack (COURT, not PAIR with Brood).
- **SYNERGIES:** `kennel_siller`, `null_censor`, `spike_cutter` (COURT). COURT with `summon_plater` + a third peeler — never PAIR Rank + Plate on one BASE kit.
- **WEAKNESSES:** Keep pets on the summoner’s rank; Sever Tether; kill the summoner
- **PLAYER_COUNTERPLAY:** Walk pets along the summoner’s rank; kill the queen; don’t file-advance
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-rank` (ELITE). Later walk tax does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (pet walk dest vs summoner rank at arm)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_gifter`

- **NAME:** Lean Gifter
- **ROLE:** healer (heal 10 iff leftover AP = 0 **and** leftover MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Lean Gift (`spell-lean-gift`, #962). No extra door — do **not** invent `lean_cantor`. Distinct from `hollow_gifter` (target leftover both 0), `gaunt_mender` (both leftover both 0), `equal_gifter` (target leftover AP === MP ≥ 1), `score_mender` (both leftover **sum === 4 unequal**), Lean Sting (**damage** if caster leftover AP=0 MP≥1). **Healer CORE only.** At most one leftover-window heal CORE per pack as PAIR vs Score / Tally / Poise / Equal / Hollow / Gaunt / Dry / Still / Pale / Gift / Shove / Lean Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover AP ≥ 1 (Equal Gift window) or leftover MP = 0 (Hollow Gift window). Peer: Lean Gift only if leftover AP=0 and leftover MP ≥ 1 **and** missing HP ≥ 10. Above: refuse if Dual Keep banks AP (destroys this window). Never dump leftover AP **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **spent-AP / remaining-walk heal**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_eq_0_and_mp_ge_1"`. VETERAN: skip leftover AP ≥ 1 or leftover MP = 0. ELITE: Drain Courage to empty leftover AP while they still have MP (COURT). CHAMPION: refuse-overkill.
- **CORE_SPELL_POOL:** `spell-lean-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Score Mend / Tally Mend / Poise Mend / Equal Gift / Hollow Gift / Gaunt Mend / Lean Sting
- **SIGNATURE_MECHANICS:** Target may be self. `healAmount` stays 0 on the Lean Gift row. Dual Keep **destroys** this window if it banks AP. 0=0 stays the gaunt/hollow identity. Player-side HP gain sets `healUsed`.
- **VARIANT_PROGRESSION:** BASE AP=0/MP≥1 heal → VETERAN skip-wrong → ELITE drain-then-heal → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. +ELITE when Drain Courage is already in the pack (COURT).
- **SYNERGIES:** `cadence_riser`, `font_cantor`, `ledger_siphon` (COURT)
- **WEAKNESSES:** Leave them 1 AP; empty their walk pool too (Hollow Gift window, not this); Cursed Wound
- **PLAYER_COUNTERPLAY:** Hold 1 leftover AP; dump both pools to 0; kill the cantor first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-gift` (ELITE). Fizzle still observes. No extra door.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_riser`

- **NAME:** Cadence Riser
- **ROLE:** controller (remaining CDs exactly 1 become 2; others unchanged)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Rise (`spell-cadence-rise`, #962). Observe via `cadence_thief` / `hex_chorister` — do **not** restamp `floor_precentor` / `prime_precentor` / `snuff_precentor`. Distinct from `cadence_snuffer` (this pass, `n==1` → **0**), `cadence_primer` (`n===0` → `1`), `cadence_staller` (`n>0` → `n+1`), Floor (`n>1` → 1). **Do not PAIR with Cadence Snuffer.** At most one remaining-1 rewrite CORE per pack as PAIR vs Snuffer / Primer / Thief / Lagger / Staller.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no remaining is exactly 1. Peer: Rise only if a nuke remaining is 1. Above: refuse if the only remaining-1 id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **padding the almost-ready bar**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bump_remaining_cds_eq_1_to_2"`. VETERAN: skip no-remaining-eq-1. ELITE: prefer Inferno remaining 1. CHAMPION: never Rise a bar you will Snuff the same turn.
- **CORE_SPELL_POOL:** `spell-cadence-rise`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the risen id is already remaining 2
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Snuff / Cadence Prime / Cadence Floor / Cadence Stall / Cadence Lag
- **SIGNATURE_MECHANICS:** `n == 1` → `2`. Zeros stay 0. `n>1` unchanged. Target keeps every spell. Once/battle flags and spell levels are **not** CDs. Do not CORE with Floor (Floor peels n>1, Rise pads the 1s).
- **VARIANT_PROGRESSION:** BASE pad-1 → VETERAN skip-none → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits sitting on remaining 1. Never CHAMPION in a solo pack with Snuff.
- **SYNERGIES:** `lean_gifter`, `hex_chorister` (Floor extra — COURT, not PAIR), `verse_scorer` (COURT)
- **WEAKNESSES:** Recast so remaining is 0 (zeros stay 0); Floor the 2 you just wrote; Snuff the 1 before they Rise; wait the last 1
- **PLAYER_COUNTERPLAY:** Spend the almost-ready Inferno **now**; Snuff it to 0; Floor after they pad
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-rise` (ENEMY_DISCOVERY: family observe **or** `cadence_thief` / `hex_chorister` G≥15 extra). No extra door.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_toller`

- **NAME:** Still Toller
- **ROLE:** controller (next spell +1 AP if leftover MP is 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Still Toll (`spell-still-toll`, #962). Distinct from `cast_toller` (next spell +1 AP if they **Struck** last turn), Quiet Hex (ungated), `spent_taxer` (next spell after a **walk**), `ley_tollkeeper` / `tax_scribe`. At most one next-spell-AP-tax CORE per pack as PAIR vs Cast Toll / Quiet Hex / Spent Tax / Ley / Tax Scribe. Not a fourth `mpCost > 0` walk snipe.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP ≥ 1. Peer: tax only while leftover MP is 0. Above: skip if already sit on Quiet Hex.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **camp-then-spell tax**. If it tops the meter, the kit leaked toward Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tax_next_spell_if_leftover_mp_eq_0"`. VETERAN: skip leftover MP ≥ 1. ELITE: Dry Plate after they camp at 0 MP (COURT). CHAMPION: never CORE with Quiet Hex.
- **CORE_SPELL_POOL:** `spell-still-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-weaken`
- **ELITE_SPELL_POOL:** none — do **not** add Cast Toll / Quiet Hex / Spent Tax / Ley Toll / Walk Toll
- **SIGNATURE_MECHANICS:** Strike / `physical_attack` is **not** a spell for this key (still costs 2). If leftover MP ≥ 1, fizzle (AP spent). This is not `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE MP-empty tax → VETERAN skip-has-MP → ELITE plate-then-tax → CHAMPION no-quiet-hex
- **RARITY_CURVE:** Standard. +ELITE vs caster kits that dump walk MP.
- **SYNERGIES:** `dry_plater`, `brick_bracer`, `ley_tollkeeper` (Undertow to empty their walk pool — COURT, not PAIR)
- **WEAKNESSES:** Keep 1 walk MP; pay the 1 AP; wait 2
- **PLAYER_COUNTERPLAY:** Don’t dump leftover MP before a spell; Strike through the tax; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-toll` (ENEMY_DISCOVERY). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_bracer`

- **NAME:** Brick Bracer
- **ROLE:** protector (next hit is 0 if a barrier is adjacent)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. CORE is Brick Brace (`spell-brick-brace`, #962). Distinct from `screen_biter` (**damage** if Bresenham blocked), `brick_stepper` (**relocates through** the barrier), Load Bearing (absorb), Ward Plate. At most one cover-camp miss CORE per pack as PAIR vs Screen Bite / Brick Step / Stone Castellan. Does **not** move the barrier.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no adjacent barrier. Peer: Hood only while a barrier is Chebyshev 1. Above: skip if HP% < 40 and they should walk.
- **STAT_SCALING_RULE:** hp 1.20, sp 0.70, sr 1.10, res 1.25, init 0.85, chc 0.55. Identity is **cover-camping**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_adjacent_barrier"`. VETERAN: skip no-adjacent-barrier. ELITE: Barrier as a door they hide behind (ADVANCED). CHAMPION: never CORE with Screen Bite.
- **CORE_SPELL_POOL:** `spell-brick-brace`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `physical_attack`
- **RARE_SPELL_POOL:** `starter-shield`
- **ELITE_SPELL_POOL:** none — do **not** add Screen Bite / Brick Step / Brick Nudge / Load Bearing
- **SIGNATURE_MECHANICS:** If no adjacent barrier exists, the hit lands and the charge **remains**. Does not read `CharacterStats.evasion`. Fail closed (hit lands), never become Sidestep.
- **VARIANT_PROGRESSION:** BASE cover-miss → VETERAN skip-open → ELITE paint-door → CHAMPION no-bite-clone
- **RARITY_CURVE:** Standard. +ELITE on maps with live barriers.
- **SYNERGIES:** `still_toller`, `stone_castellan`, `rime_mason`
- **WEAKNESSES:** Destroy the barrier; Brick Nudge it away; hit them after they step off; wait the turn start peel
- **PLAYER_COUNTERPLAY:** Crack the wall; don’t hit while they hug Barrier; wait
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-brace` (ENEMY_DISCOVERY). Observation is the **arm**. No-barrier full hit does not consume and does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (adjacency check at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_rooter`

- **NAME:** Watch Rooter
- **ROLE:** sniper (overwatch snap zeros leftover MP on the walker)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Watch Root (`spell-watch-root`, #962). Distinct from `watch_banker` (**banks** leftover AP), `watch_sipper` (**steals** leftover AP), `watch_feer` (**debits AP**), Root Snare (tile root), Cast Snare (cast-time root). **Do not PAIR with Watch Bank / Watch Sip / Watch Fee / Glass Sniper.** At most one overwatch-snap leftover rewrite CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no snap is likely. Peer: arm only if a hostile will walk into Hold Ground enter-1 **or** Far Watch 3–4. Above: skip if the walker already has leftover MP = 0.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.20, sr 1.00, init 1.20, chc 0.90, res 0.70. Identity is **ending a walker’s remaining walk mid-path**. If it tops the meter, the kit leaked toward Glass Shot.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "overwatch_snap_zero_walker_mp"`. VETERAN: skip no-snap / already-0. ELITE: Still Toll after they sit at 0 MP (COURT). CHAMPION: never also Fee in the same CORE.
- **CORE_SPELL_POOL:** `spell-watch-root`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-mark` on the snap band
- **ELITE_SPELL_POOL:** none — do **not** add Watch Bank / Watch Sip / Watch Fee / Watch Alms / Root Snare
- **SIGNATURE_MECHANICS:** Visible stance, 2 turns. If no overwatch is armed, this card arms a **damage-0** enter-1 snap that only zeros leftover MP. Push/pull into the band **does** snap. Teleport / Swap **does not**. This is not `spell.mpCost`. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE snap-zero-MP → VETERAN skip-no-walk → ELITE tax-then-camp → CHAMPION no-fee-clone
- **RARITY_CURVE:** Standard. +ELITE when Far Watch / Hold Ground is already in the pack (COURT with `glass_sniper`, not PAIR).
- **SYNERGIES:** `odd_gaiter`, `still_toller`, `glass_sniper` (COURT, not PAIR)
- **WEAKNESSES:** Blink in; send a summon; sit still; keep leftover MP 0 already
- **PLAYER_COUNTERPLAY:** Don’t walk into the band; blink; send a pet
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-root` (ELITE). Snap does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (overwatch snap leftover-MP rewrite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_gaiter`

- **NAME:** Odd Gaiter
- **ROLE:** assassin (10 + 10 iff target leftover MP is odd)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Odd Gait (`spell-odd-gait`, #962). Distinct from `lone_gaiter` (leftover MP **exactly 1**), `pair_gaiter` (leftover MP **exactly 2**), `odd_stinger` (leftover **AP odd**), Dry Sting (leftover MP **= 0**, even). Overlap with Lone Gait at exactly 1 is documented, not a clone. At most one leftover-MP-parity poke CORE per pack as PAIR vs Lone / Pair / Odd Sting / Tied / Full Gait / Dry Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover MP is even **and** a Strike would kill. Peer: poke leftover 1/3 for 20. Above: skip if leftover MP is even and Frost is better. Prefer Lone Gait when leftover MP is exactly 1 **and** that id is already on a different body (COURT, not PAIR).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.90, init 1.25, chc 1.10, res 0.70. Identity is **poking leftover 1/3 MP**. If it tops the meter ungated, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "bonus_if_leftover_mp_odd"`. VETERAN: skip even unless 10 still wins. ELITE: Watch Root to leave leftover 1? Root zeros MP (even) — skip; Walk Toll to **leave** leftover 1 (COURT). CHAMPION: fail closed (10 only), never become Odd Sting.
- **CORE_SPELL_POOL:** `spell-odd-gait`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Lone Gait / Pair Gait / Odd Sting / Dry Sting / Tied Gait
- **SIGNATURE_MECHANICS:** Extra 10 on leftover MP 1, 3, 5, …. Even leftover → 10 only. Even leftover 10 still observes.
- **VARIANT_PROGRESSION:** BASE odd-MP poke → VETERAN skip-even → ELITE leave-1 → CHAMPION fail-closed
- **RARITY_CURVE:** Standard. +ELITE vs kite kits sitting leftover 1.
- **SYNERGIES:** `watch_rooter` (COURT — but Root zeros MP, so prefer Walk Toll to leave 1), `purse_scribe`, `walk_toller`
- **WEAKNESSES:** Spend 1 walk MP to even the pool; sit at 0 or 2; Dual Keep a different leftover
- **PLAYER_COUNTERPLAY:** Dump leftover MP to 0 or 2; don’t sit leftover 1 in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-gait` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spike_cutter`

- **NAME:** Spike Cutter
- **ROLE:** assassin (10 + 10 if target is Chebyshev ≤ 2 from spike occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. CORE is Spike Cut (`spell-spike-cut`, #962). Distinct from `hazard_cutter` (**painted** hazard; Wave 13 **excludes** occupancy-only spikes), `portal_cutter` (**world portals**), `spike_reeler` (**pulls**), `spike_skipper` (**ignores tax**). **Do not PAIR with Hazard Cut / Portal Cut / Spike Reel / Spike Skip.** Twin Gate pads are **not** spikes. `ENC-SPIKE-01` stays Spike Skip’s room.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they stand farther than 2 from every spike. Peer: poke the threshold for 20. Above: skip if they stand 3+ and Frost is better.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.20, sr 0.90, init 1.20, chc 1.05, res 0.70. Identity is **threshold poke near spikes**. If it tops the meter far from spikes, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_near_spike_occupancy"`. VETERAN: skip far-from-spike unless 10 still wins. ELITE: Spike Reel on a different body to pull them **toward** a spike (COURT, not PAIR — dest still never lands on a world portal). CHAMPION: never treat Twin Gate pads as spikes. Do not skip portal lock-while-hostile.
- **CORE_SPELL_POOL:** `spell-spike-cut`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mark`
- **ELITE_SPELL_POOL:** none — do **not** add Hazard Cut / Portal Cut / Spike Reel / Spike Skip / Leash Cut
- **SIGNATURE_MECHANICS:** Spike cells are map-modifier occupancy, **not** painted pits. Far-from-spike 10 still observes.
- **VARIANT_PROGRESSION:** BASE threshold poke → VETERAN skip-far → ELITE pull-then-poke → CHAMPION no-pad-clone
- **RARITY_CURVE:** Standard. +ELITE on maps that already place spike occupancy. Never CHAMPION on a spike-less map.
- **SYNERGIES:** `summon_ranker`, `summon_plater`, `glyph_sower`, `spike_reeler` (COURT, not PAIR)
- **WEAKNESSES:** Stand 3+ from every spike; fight in rooms without spikes; blink off the threshold
- **PLAYER_COUNTERPLAY:** Don’t stand on the spike ring; blink; fight elsewhere
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spike-cut` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (spike occupancy Chebyshev ≤ 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_plater`

- **NAME:** Summon Plater
- **ROLE:** protector (allied summons treat the next hit as 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. CORE is Summon Plate (`spell-summon-plate`, #962). Distinct from Brood Ward (boss absorb), `brace_chanter` (RES), Split Plate, Surplus Ward, Own Plate. **Do not PAIR with `summon_ranker` on one BASE kit.** Drop this id if `summonAI` is empty. `healAmount` stays 0. Do not assign to non-summoner CORE.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no allied summon. Peer: plate only if a hit on a pet is likely this round. Above: skip if no hit is likely.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 1.10, init 0.95, chc 0.60. Identity is **a free pet Sidestep**. If it tops the meter, the kit leaked toward Brood Ward.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "summon_next_hit_zero"`. VETERAN: skip no-pet / no-hit. ELITE: Kennel Lock parks the pets (COURT). CHAMPION: never CORE with Summon Rank on this body.
- **CORE_SPELL_POOL:** `spell-summon-plate`, `spell-iron-skin`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `starter-shield`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Rank / Brood Ward / Split Plate / Summon Brace / Surplus Ward
- **SIGNATURE_MECHANICS:** 1 turn. Every living **allied** summon treats the next **applied** damaging hit as 0, then that summon’s charge consumes. The summoner’s own hit is **not** covered. Player copy covers **their** pets. Two hits on the same pet — second lands.
- **VARIANT_PROGRESSION:** BASE pet-miss → VETERAN skip-no-pet → ELITE park-then-plate → CHAMPION no-rank-clone
- **RARITY_CURVE:** Standard. +ELITE when a dedicated summoner is already in the pack (COURT, not PAIR with Brood / Rank).
- **SYNERGIES:** `kennel_siller`, `spike_cutter`, `null_censor`. COURT with `summon_ranker` + a third peeler.
- **WEAKNESSES:** Hit the summoner; wait the turn; two hits on the same pet
- **PLAYER_COUNTERPLAY:** Ignore the pets for one hit; kill the queen; double-tap one wolf
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-plate` (ELITE). Later negated hit does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (per-pet next-hit-zero aura)
- **STATUS:** PROPOSED

---

## 5. Spell-identity matrix (Wave 17)

Forbidden CORE categories keep identity coherent when later spells are assigned. A Wave 17 family may **observe** a forbidden id as a G≥16 extra on a *different* body; it may not wear that id as CORE.

| ENEMY_ID | CORE identity | Forbidden CORE (clone / leak) |
| :--- | :--- | :--- |
| score_mender | both-body leftover sum===4 unequal heal | Tally/Poise/Gaunt/Hollow/Equal/Lean/Dry/Still/Heave/Both/Pale/Gift/Shove as CORE, inferno |
| cadence_snuffer | remaining `1→0` | Rise/Prime/Floor/Stall/Lag/Crack/Flush as CORE, heal |
| hendeca_prelate | stretched-plus occupy-weight 11 | dec/nine/oct/sept/six/penta/quad/triple/twin/dummy/scorepost, turret, heal |
| duel_turner | two-hostile leftover invert | Purse Turn / Bar Cross / Tempo Invert / Swap as identity, heal |
| score_hooder | leftover-sum===4 unequal miss | Tally/Poise Hood / Spent/Gait/Dry/Odd Plate as CORE, heal, evasion field |
| score_stinger | leftover-sum===4 unequal poke | Tally/Poise/Gaunt/Even/Odd Sting / Tied Gait as CORE, heal |
| score_stepper | leftover-sum===4 unequal join | Tally/Poise/Gaunt/Home/Heave/Brick Step / Swap as CORE, heal |
| score_siller | leftover-sum===4 unequal start-turn tax | Tally/Poise/Gaunt Sill / Wake/Strike/Swap Mark as CORE, heal |
| score_holder | leftover-sum===4 unequal walk lock | Tally/Poise/Odd/Dry Hold / Must Score as CORE, heal |
| score_lender | leftover-sum===4 unequal +1/+1 cash-out | Tally/Poise/Gaunt Lend / Haste / Tempo Gift as CORE, heal |
| score_sipper | leftover-sum===4 unequal steal leftover AP | Tally/Poise/Bare Sip / Soul Sip as CORE, heal |
| score_prelate | isSummon (`scorepost`), leftover-sum===4 unequal end-turn | dummy/tallypost/poisepost/gauntpost/hendecaspan, heal, turret |
| score_bouncer | leftover-sum===4 unequal bounce | Tally/Poise/Gaunt Bounce / Chain Lightning as identity, heal |
| must_scorer | leftover-sum===4 unequal last-AP tool lock | Must Tally / Must Poise / Score Hold / Hex of Silence as CORE, heal |
| verse_scorer | leftover-sum===4 unequal last-id lock | Verse Tally / Verse Poise / Last Mute / Summon Verse as CORE, heal |
| file_warder | next-walk same-file | Rank/Orth/Diag Stride / Rank Lock / Pack File / File Bite as CORE, heal |
| hexa_oather | next-spell exact Chebyshev 6 | Penta/Quad/Tri/Mid/Long Oath / Six Span as CORE, heal, isSummon |
| lava_reeler | attract toward lava occupancy | Spike/Pit/Brick/Void/Cinder Reel / Lava Skip / Hazard Cut as CORE, heal |
| file_biter | share-file-only bonus | Axis/Screen/Wall/Foe Bite / File Lance / File Stride as CORE, heal |
| strike_marker | Strike-from-cell paint | Swap/Shove/Cast/Ingress/Wake/Dwell Mark as CORE, heal, isSwap-as-identity |
| dry_plater | leftover-MP=0 miss | Gait/Spent/Odd Plate / Dry Sting / Score Hood as CORE, heal, evasion field |
| shock_skipper | 1-tile shock enter-tax skip | Mire/Rime/Glyph/Spike/Lava/Pit Skip as CORE, heal |
| even_stinger | leftover-AP even ≥ 2 poke | Odd/Full/Tally/Poise/Gaunt/Score Sting as CORE, heal |
| summon_ranker | pet walk-off-rank AP tax | Summon Toll/Gait/Verse/Cast/Plate / Pack Rank as CORE, heal |
| lean_gifter | leftover AP=0 and MP≥1 heal | Score/Tally/Poise/Gaunt/Hollow/Equal as CORE, isSummon, inferno, Lean Sting |
| cadence_riser | remaining `1→2` | Snuff/Prime/Floor/Stall/Lag as CORE, heal |
| still_toller | next-spell +1 if leftover MP=0 | Cast Toll / Quiet Hex / Spent Tax / Ley Toll as CORE, heal |
| brick_bracer | next hit 0 if barrier adjacent | Screen Bite / Brick Step/Nudge / Load Bearing as CORE, heal |
| watch_rooter | overwatch snap zeros leftover MP | Watch Bank/Sip/Fee/Alms / Root Snare as CORE, heal |
| odd_gaiter | leftover-MP-odd poke | Lone/Pair/Full Gait / Odd Sting / Dry Sting as CORE, heal |
| spike_cutter | near-spike-occupancy poke | Hazard/Portal Cut / Spike Reel/Skip as CORE, heal |
| summon_plater | pet next-hit 0 | Summon Rank / Brood Ward / Split Plate / Brace as CORE, heal |

Wave 1–16 matrices in those docs still apply to those ids.

---

## 6. Role coverage after Wave 17

Every requested archetype still has a Wave 1 owner. Wave 17 does not invent a 21st role word. It adds **verbs**.

| Archetype | Wave 17 extra (new verb) |
| :--- | :--- |
| bruiser | `file_biter` (share-file-only bonus) |
| sniper | `watch_rooter` (snap zeros leftover MP) |
| kiter | `shock_skipper` (1-tile shock skip) |
| assassin | `score_stinger`, `even_stinger`, `odd_gaiter`, `spike_cutter` |
| healer | `score_mender` (both-body sum===4 unequal), `lean_gifter` (AP=0 and MP≥1) |
| buffer | `score_lender` (cash-out +1/+1) |
| debuffer | `score_sipper` (steal leftover AP on sum===4 unequal), `verse_scorer` (last-id until sum===4 unequal) |
| summoner | `hendeca_prelate` (stretched plus = 11), `score_prelate` (end-turn sum===4 unequal post) |
| controller | `cadence_snuffer`, `cadence_riser`, `duel_turner`, `score_holder`, `must_scorer`, `file_warder`, `hexa_oather`, `still_toller` |
| tank | — (Dry Plater / Brick Bracer are protectors) |
| protector | `score_hooder`, `dry_plater`, `brick_bracer`, `summon_plater` |
| artillery | `score_bouncer` |
| kamikaze | — |
| teleporter | `score_stepper` |
| displacement | `lava_reeler` |
| hazard creator | `score_siller` |
| status specialist | — |
| anti-summon | `summon_ranker` |
| anti-ranged | — |
| anti-melee | `strike_marker` (detonate on Strike from the cell) |

---

## 7. Implementation notes (not this PR)

Do **not** implement production code from this document.

**Live defects that remain implementation prerequisites, not new families:**

1. Family HP must survive battle start (`WX` 11970–11974 currently overwrites with `calcEnemyMaxHp`).
2. `buildEnemyKit` must receive a **number** zone (`WX` 11920 currently passes `{ name, minLevel, maxLevel }` → NaN → zone 0).
3. Family `res` / `sp` must match `getEnemyBaseStats` integer bands (`spawnPolicy.ts` still writes 0.05–0.75 fractions).
4. `inferArchetype` must read `aiProfile`, not `healAmount` / `family.includes("berserk")`.
5. `inferSummonArchetype` must accept `hendecaspan` / `scorepost` (and still-missing `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) as empty-kit stationary posts, not hunter fallback.
6. Leftover AP / leftover MP / `walkMpSpentThisTurn` / `forcedMovedThisTurn` / caster-authored force-move / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / next-walk dest writers / Strike-from-cell writer.
7. Hendeca Span occupy-weight (live cap is 2; skip until remaining ≥ 11). Dec Span still skip until remaining ≥ 10. Nine Span still skip until remaining ≥ 9.
8. `applyAttract` lava-occupancy dest (tenth flavor after spike).
9. Cadence Rise remaining `1→2`. Cadence Snuff remaining `1→0`. Cadence Floor is **already owned** by SDE #906 — do not ship a second id. Cadence Prime (`0→1`) is Wave 16. Cadence Cap (`n>2→2`) is SDE Wave 16 — Wave 18.

**Wave 18 leftover (do not fill today):** SDE Wave 16 unique CORE (`spell-ring-stride`, `spell-hepta-oath`, `spell-rime-reel`, `spell-rank-bite`, `spell-last-mark`, `spell-dual-plate`, `spell-rift-skip`, `spell-fresh-sting`, `spell-summon-file`, `spell-prime-gift`, `spell-cadence-cap`, `spell-gait-toll`, `spell-brick-hold`, `spell-watch-drain`, `spell-even-gait`, `spell-rime-cut`, `spell-cast-plate`, `spell-pack-orth`, `spell-leap-fold` — except Pack Orth / Leap Fold unless a later boss sheet claims them). Extra rooms stay `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court`. Extra doors stay `lane_precentor` / `leap_fold_regent`. Same-day 2026-10-25 SPELL_PROPOSALS / SDE, if any, stay Wave 18. Hold mid-RAF splice, fourth `mpCost` walk snipe, player-owned Hex of Silence, sixth echo, twelve-cell occupy, remaining zeros → 1 as a **second** Cadence Prime (`spell-cadence-arm` stays tombstoned), leftover 1/1 heal as a **second** Prime Gift (`spell-score-gift` stays tombstoned). Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec/Hendeca cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / Score Post `scorepost` / Hendeca Span `hendecaspan` / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `score_mender` | healer | `spell-score-mend` | `score_cantor` |
| `cadence_snuffer` | controller | `spell-cadence-snuff` | `snuff_precentor` |
| `hendeca_prelate` | summoner | `spell-hendeca-span` | `span_hendeca` (`summonAI: "hendecaspan"`) |
| `duel_turner` | controller | `spell-duel-turn` | — |
| `score_hooder` | protector | `spell-score-hood` | — |
| `score_stinger` | assassin | `spell-score-sting` | — |
| `score_stepper` | teleporter | `spell-score-step` | — |
| `score_siller` | hazard creator | `spell-score-sill` | — |
| `score_holder` | controller | `spell-score-hold` | — |
| `score_lender` | buffer | `spell-score-lend` | — |
| `score_sipper` | debuffer | `spell-score-sip` | — |
| `score_prelate` | summoner | `spell-score-post` | — (`summonAI: "scorepost"`) |
| `score_bouncer` | artillery | `spell-score-bounce` | — |
| `must_scorer` | controller | `spell-must-score` | — |
| `verse_scorer` | debuffer | `spell-verse-score` | — |
| `file_warder` | controller | `spell-file-stride` | `file_gallery` |
| `hexa_oather` | controller | `spell-hexa-oath` | `hexa_nave` |
| `lava_reeler` | displacement | `spell-lava-reel` | `lava_aisle` |
| `file_biter` | bruiser | `spell-file-bite` | — |
| `strike_marker` | anti-melee | `spell-strike-mark` | `strike_pulpit` |
| `dry_plater` | protector | `spell-dry-plate` | — |
| `shock_skipper` | kiter | `spell-shock-skip` | `shock_nave` |
| `even_stinger` | assassin | `spell-even-sting` | — |
| `summon_ranker` | anti-summon | `spell-summon-rank` | — |
| `lean_gifter` | healer | `spell-lean-gift` | — |
| `cadence_riser` | controller | `spell-cadence-rise` | — (observe `cadence_thief` / `hex_chorister`) |
| `still_toller` | controller | `spell-still-toll` | — |
| `brick_bracer` | protector | `spell-brick-brace` | — |
| `watch_rooter` | sniper | `spell-watch-root` | — |
| `odd_gaiter` | assassin | `spell-odd-gait` | — |
| `spike_cutter` | assassin | `spell-spike-cut` | — |
| `summon_plater` | protector | `spell-summon-plate` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Snuff / Pack Diag / Far Fold stay kit-only.

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–16 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `spell-score-gift` / `wave17:` colliding ids.
- No restamp of `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` / `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` as family ids.

All **32** sheets: **STATUS: PROPOSED**.

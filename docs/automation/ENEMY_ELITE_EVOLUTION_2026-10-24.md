# Enemy and Elite Evolution Design — Wave 16

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-24  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Sixteenth daily pass. **31** new world-pack families that consume **SDE Wave 14 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md`, open PR #906) **except** Pack Rank / Rank Fold / Cadence Floor, plus **SPELL_PROPOSALS Wave 15 verbs** (`SPELL_PROPOSALS_2026-10-23.md`, open PR #953) **except** Court Prime (`NOT_PLAYER_LEARNABLE`). Cadence Floor is **already SDE-owned** (`spell-cadence-floor`; observe via `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). SDE Wave 15 unique CORE (`spell-file-stride` … `spell-far-fold`, open PR #962) stays extras until Wave 17. Bosses stay on the existing catalog.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 15

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–15. Wave 15 closed as docs in the 2026-10-23 pass (PR #941). SPELL_PROPOSALS latest on this cron is Wave 15 (#953). SDE latest unique-CORE lag is Wave 14 (#906). Same-day SDE Wave 15 (#962) is **Wave 17** family CORE. This pass consumes **#906** unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) plus **#953** (minus Court Prime). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥14 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 15 claim | 2026-10-24 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–15 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / Poise / **Tally** Post count as **1**. Triple = 3 … Nine Span = 9. **Dec Span = 10** — skip Dec until remaining cap ≥ 10 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Tally Mend / Equal Gift / Shove Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `decspan` / `tallypost` (and still no `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Facing families still fail closed. Wave 16 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096+: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 16 CORE rows stay `mpCost: 0`. Tally Lend / Tally Sip / Purse Turn / Watch Bank rewrite **current leftover AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Spike Reel is the **ninth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit, then **spike occupancy**). Brick Step **relocates through** an adjacent barrier — not a unit bash and not Brick Nudge |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–15 force families still fail closed. Wave 16 **does** add `shove_gifter` — fail closed until the **caster-authored** writer exists. That is leftover consumption, not a new HP family |
| `lastResolvedSpellId` | Absent | `verse_tallier` (and Waves 10–15 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` / Wave 15 `strike_debter` still wait. Wave 16 `cast_toller` reads **Struck last turn**, not a new persist stat |
| `walkMpSpentThisTurn` | Absent | Tally\* leftover-MP gates / Equal Gift / Tied Gait fail closed until battle walks write leftover MP |
| One next walk **same rank** / next-spell exact Chebyshev **5** / pull toward nearest **spike occupancy** / bonus if **Bresenham blocked** / **teleport-landing** detonate / leftover-AP **odd** miss / 1-tile **mire** skip / leftover-AP **odd** poke / allied-summon **recast last id** AP tax / heal-if **target leftover AP === leftover MP ≥ 1** / next spell +1 AP if they **Struck** / step **through** adjacent barrier / overwatch snap **banks** walker leftover AP / leftover AP **and** MP **exactly 2** poke / bonus if near a **world portal** / heal-if **this caster** force-moved the target | Still absent as CORE identities | Wave 16 secondary opportunity (SDE Wave 14 unique CORE leftover). Cadence Floor is **not** a new family — SDE already won `spell-cadence-floor` |
| Heal-if both bodies leftover AP + leftover MP **=== 3** / remaining CDs `0` → `1` / axis-aligned **2×5** occupy (counts as ten) / invert leftover AP↔MP on a **hostile** / sum===3 any-range miss / sum===3 sting / join sum===3 ally / start-turn occupy sum===3 / cannot-walk-while-sum===3 / +AP+MP if ally sum===3 (**exits** window) / steal leftover AP iff sum===3 / end-turn occupy sum===3 post / bounce among sum===3 / non-Strike illegal unless sum===3 **and** last AP / last-id illegal until sum===3 | Still absent in live catalog | Wave 16 primary opportunity (SPELL_PROPOSALS Wave 15). Court Prime stays kit-only |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Odd Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Odd Sting is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Portal Cut is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Spike Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Prime is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Purse Turn is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 16 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 16 family pass consumes **#906** unique CORE (minus Pack Rank / Rank Fold / Cadence Floor) plus **#953** (minus Court Prime). **Wave 17** consumes SDE Wave 15 unique CORE (`spell-file-stride` … `spell-far-fold`, except Pack Diag / Far Fold unless a later boss sheet claims them) plus any 2026-10-24 SPELL_PROPOSALS. This run does not mint colliding `wave16:` spell ids. Same-day 2026-10-24 SPELL_PROPOSALS / SDE, if any open during this cron, stay Wave **17** family CORE — do not clone them here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` / `spell-pack-rank` / `spell-rank-fold` / `spell-court-prime` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (still not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Cadence Prime (`n===0` → `1`) is a **different** ready-lock. Dual Keep leftover that survives is **not** a remaining CD.

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

**Stationary-post / multi-body cap (extend Wave 15):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** Poise Post **or** Nine Span **or** **Tally Post** **or** **Dec Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / **Tally Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Nine Span counts as **nine**. **Dec Span counts as ten.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, Nine Span, Tally Post, or Dec Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-/eight-/nine-/ten-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, a Nine Span solid 3×3, **or** a Dec Span axis-aligned 2×5, never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, Poise Post, and Tally Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**. Dec Span occupies **every** cell of the 2×5 (no cage hole).

**Summon-cap prerequisite (extend Wave 15):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Six Span is illegal until remaining cap ≥ 6. Sept Span is illegal until remaining cap ≥ 7. Oct Span is illegal until remaining cap ≥ 8. Nine Span is illegal until remaining cap ≥ 9. **Dec Span is illegal until remaining cap ≥ 10.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post / Tally Post are legal at remaining ≥ 1. Do not spawn `dec_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 15):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched\* leftover-MP gates / Dry Gait / Gaunt\* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / Hollow Gift / Lone Gait / Poise\* leftover-MP equality / **Tally\*** leftover-sum / **Equal Gift** / **Tied Gait** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / Poise Step / **Tally Step** / **Brick Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 15):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt\* leftover-AP gates / Spent Plate / Full Sting / Hollow Gift / Poise\* leftover-AP equality / **Tally\*** leftover-sum / **Odd Plate** / **Odd Sting** / **Equal Gift** / **Tied Gait** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Sum is integer leftover AP + leftover MP. Dual Keep **enables** Poise when the surviving banks are equal and ≥ 1, **enables** Tally when the surviving banks **sum to 3** (2/1, 1/2, 3/0, 0/3 — **not** 2/2), and **blocks** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold (2,1) / (1,2) / (3,0) / (0,3) for Tally. `leftover AP = 0` and `leftover MP = 0` is **not** a Tally window and **not** a Poise window.

**Last-id prerequisite (extend Wave 15):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / Verse Poise / **Verse Tally** / **Summon Verse** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (extend Wave 15):** Shove Mark / Drift Gift / Heave\* / Drift\* / **Shove Gift** fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and a **caster-authored** bit for Shove Gift). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, Tally Step, Brick Step, and Home Step do **not** set the flag. Wave 16 adds **one** force-gated CORE card (`shove_gifter`). That is leftover consumption, not a new HP family.

**Facing / Struck prerequisites (partial):** Wave 16 adds **zero** facing CORE cards. `cast_toller` needs a **Struck last turn** bit (`struckThisTurn` from a successful Strike that spent AP) — fail closed until written. Clash Mend / Strike Debter still wait on the same writer.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Tally Mend MULTI child `tally_cantor` — first child wins vs `tally_mender` observe. Cadence Prime MULTI child `prime_precentor` — first child wins vs `cadence_primer` observe. Dec Span MULTI child `span_dec` — first child wins vs `dec_prelate` observe. Court Prime stays `court_prime_regent` kit-only. Rank Stride teach room `rank_gallery` — first child wins vs `rank_warder` observe. Penta Oath teach room `penta_nave` — first child wins vs `penta_oather` observe. Spike Reel teach room `spike_aisle` — first child wins vs `spike_reeler` observe. Swap Mark teach room `swap_pulpit` — first child wins vs `swap_marker` observe. Mire Skip teach room `mire_nave` — first child wins vs `mire_skipper` observe. Pack Rank stays `rank_precentor` kit-only. Rank Fold stays `rank_fold_regent` kit-only. Equal Gift / Shove Gift / Purse Turn / Tied Gait / Portal Cut / Watch Bank / Cast Toll / Brick Step / Screen Bite / Odd Plate / Odd Sting / Summon Verse have **no** extra door — do **not** invent `equal_cantor` / `sum_cantor` / `turn_precentor` / restamp `poise_cantor` / `gaunt_cantor` / `parched_cantor` / `floor_precentor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `rank_precentor`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `diag_precentor`, `far_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` / `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`.

---

## 2. Why Wave 16 exists (gaps Waves 1–15 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag). Wave 15 covered leftover SDE Wave 13 unique CORE (minus Pack File / Diag Fold) + SPELL_PROPOSALS Wave 14 (minus Cadence Floor / Court Floor).

SPELL_PROPOSALS Wave 15 (#953) then stamped the holes Wave 15 **held**: both-body leftover AP + leftover MP **=== 3** heal (Tally Mend), remaining `0` → `1` (Cadence Prime), axis-aligned 2×5 occupy (Dec Span, counts as ten), and a hostile leftover invert (Purse Turn) plus the Tally court. A G≥15 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 14 unique CORE still had no CORE owner after Wave 15. Sixteen of those verbs fill holes Wave 15 tactical does not: one next walk **same rank**, next-spell exact Chebyshev **5**, pull toward nearest **spike occupancy**, bonus if **Bresenham blocked**, **teleport-landing** detonate, leftover-AP **odd** miss, 1-tile **mire** skip, leftover-AP **odd** poke, allied-summon **recast last id** AP tax, heal-if **target leftover AP === leftover MP ≥ 1**, next spell +1 AP if they **Struck**, step **through** adjacent barrier, overwatch snap **banks** leftover AP, leftover AP **and** MP **exactly 2** poke, bonus if near a **world portal**, heal-if **this caster** force-moved the target. Pack Rank and Rank Fold stay closed. Cadence Floor stays SDE’s observe extras.

SDE Wave 15 (#962) unique CORE stays extras until Wave 17. Cadence Rise (`n==1` → `2`) is **not** Cadence Prime. Lean Gift is **not** Tally Mend. File Stride is **not** Rank Stride.

| Unused Wave 15 / SDE Wave 14 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-tally-mend` (heal 8 iff **caster and target** leftover AP + leftover MP **=== 3**) | `poise_mender` (both leftover **AP === MP ≥ 1** — even sums 2/4/6); `equal_gifter` (this pass, **target only** leftover AP === leftover MP ≥ 1); `gaunt_mender` (both leftover **0**); `hollow_gifter` (target leftover both 0) | Four leftover reads, one **odd sum**. Dual Keep 2/2 is Poise, **not** Tally. Extra door is `tally_cantor` — family is **`tally_mender`**. Do **not** restamp `poise_cantor` / `gaunt_cantor` / `parched_cantor`. |
| `spell-cadence-prime` (remaining `n===0` → `1`; ones stay 1; `n>1` unchanged) | `cadence_thief` (Floor extra: `n>1` → **1**, zeros stay 0); `cadence_lagger` (`n>0` → `n+2`); `cadence_staller` (`n>0` → `n+1`) | Ready-lock, not compress / pad. Extra door is `prime_precentor` — family is **`cadence_primer`**. Do **not** mint `cadence_floorer`. |
| `spell-dec-span` (axis-aligned 2×5, counts as **ten**) | `nine_prelate` (solid 3×3 = 9, **square**, center occupied); `oct_prelate` (hollow 3×3 = 8, **center hole**) | Ten tiles, one body, empty kit, **corridor plug**. Extra door is `span_dec` — family is **`dec_prelate`**. Skip until remaining cap ≥ 10. |
| `spell-purse-turn` (invert leftover AP↔MP on a **hostile**; caster unchanged) | `bar_crosser` (**two-body** leftover cross); Tempo Invert (**ally/self** one-body) | One hostile purse. Sum invariant: Tally stays Tally; Poise stays Poise. Do **not** mint `spell-foe-invert`. |
| `spell-tally-hood` (next hit is 0 **while leftover AP + leftover MP === 3**, any range) | `poise_hooder` (leftover AP === leftover MP ≥ 1); `spent_plater` (leftover **AP ≥ 1**); `odd_plater` (this pass, leftover AP **odd**) | Hold (2,1). Dual Keep 2/2 is Poise Hood, **not** this. |
| `spell-tally-sting` (10 + 8 iff leftover AP + leftover MP === 3) | `poise_stinger` (leftover AP === leftover MP ≥ 1); `gaunt_stinger` (leftover **both 0**); `odd_stinger` (this pass, leftover AP **odd**); `tied_gaiter` (this pass, leftover **exactly 2/2**) | Punish (2,1) / (1,2) / (3,0) / (0,3). 2/2 is Poise / Tied Gait. |
| `spell-tally-step` (caster lands on a free Chebyshev-1 of an ally with leftover AP + leftover MP === 3) | `poise_stepper` (leftover AP === leftover MP ≥ 1); `gaunt_stepper` (leftover **both 0**); `home_stepper` (**ungated**) | Join the body that **sums to 3**. Relocate, not `isSwap`. |
| `spell-tally-sill` (occupant sum===3 at **start of their turn** takes 8; paint stays) | `poise_siller` (leftover AP === leftover MP ≥ 1); `gaunt_siller` (leftover **both 0**); `wake_marker` (start-turn occupy **any leftover**, consume) | Tax the camp **on their turn start** if they held a sum of 3. Dual Keep 2/2 **misses**. |
| `spell-tally-hold` (cannot walk while leftover AP + leftover MP === 3) | `poise_holder` (while leftover AP === leftover MP ≥ 1); `odd_holder` (while leftover AP is **odd**); `dry_holder` (until leftover **AP = 0**) | (0,3) has MP but cannot spend it. Spend leftover AP **or** wait. **Do not PAIR with Must Tally.** |
| `spell-tally-lend` (+1 AP **and** +1 MP to an ally whose leftover AP + leftover MP === 3 — **exits** to sum 5) | `poise_lender` (+1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**); `gaunt_lender` (+1/+1 if leftover **both 0**) | Cash the window. Poise Lend **keeps**. |
| `spell-tally-sip` (steal 1 leftover AP iff leftover AP + leftover MP === 3 and leftover AP ≥ 1) | `poise_sipper` (steal iff leftover AP === leftover MP ≥ 1); `bare_sipper` (steal iff leftover **MP = 0**) | Sip (2,1) → (1,1) **Poise**. (0,3) fizzles (no AP). |
| `spell-tally-post` (empty-kit body; **end-turn occupy with leftover AP + leftover MP === 3** deals 10 and it dies) | `poise_prelate` (leftover AP === leftover MP ≥ 1); `gaunt_prelate` (leftover **both 0**); `dummy_prelate` (taunt) | Camp sum===3 on the post and eat 10, or spend a pool. Counts as **1**. `summonAI: "tallypost"`. |
| `spell-tally-bounce` (12 to primary; bounce 12 to nearest **other** leftover-AP+MP===3 hostile) | `poise_bouncer` (second body leftover AP === leftover MP ≥ 1); `gaunt_bouncer` (leftover **both 0**); Chain Lightning (nearest **any**) | Second 12 needs **two** sum===3 bodies. Missing flag → 12 only. |
| `spell-must-tally` (remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 3 **and** this spell spends last AP) | `must_poiser` (leftover AP === leftover MP ≥ 1 / last AP); `must_gaunter` (leftover **both 0** / leftover MP=0 last AP); `tally_holder` (this pass, **walk** needs sum ≠ 3) | Inverse of Tally Hold. Strike stays legal. **Do not PAIR with Tally Hold.** |
| `spell-verse-tally` (last resolved id **illegal until leftover AP + leftover MP === 3**) | `verse_poiser` (until leftover AP === leftover MP ≥ 1); `verse_gaunter` (until leftover **both 0**); `last_muter` (**duration**) | Recast Inferno only after **sum === 3**. 1/1 and 0/0 do **not** lift. |
| `spell-rank-stride` (**next walk** legal only if `dest.y == y_at_arm`) | `knight_warder` (**(2,1)**); `orth_warder` (**orthogonal**); `diag_warder` (**diagonal**); Rank Lock is **all remaining** walks on rank **or** file | Extra room is `rank_gallery` — family is **`rank_warder`**. One step, same rank. Do **not** name it `rank_lancer`. |
| `spell-penta-oath` (next spell must be Chebyshev **exactly 5**) | `quad_oather` (exact **4**); `tri_oather` (exact **3**); `long_oather` (**≥ 3**); `mid_oather` (exact **2**) | Frost at 1–4 or ≥ 6 fizzles. Strike stays legal. Extra room `penta_nave` is a teach — family is **`penta_oather`**. Do **not** name it `penta_prelate`. |
| `spell-spike-reel` (pull 1 toward nearest **spike occupancy**) | `pit_reeler` (toward **painted pit**); `brick_reeler` (toward **barrier**); `void_reeler` (toward **void/portal**); Spike Skip (ignore spike **land tax**) | Ninth `applyAttract` dest flavor. Extra room `spike_aisle` is a teach — family is **`spike_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no spike fizzles. |
| `spell-screen-bite` (10 + 10 if a wall **or** barrier sits on Bresenham) | `axis_biter` (share rank/file with **caster**); `wall_biter` (adj **wall**); `foe_biter` (adj **hostile**); Gate Sight (ignore one barrier) | Bonus through **cover**. Clear LoS → 10 only. `LOS: false`. |
| `spell-swap-mark` (cell detonates if they **land from a teleport**; consume) | `shove_marker` (**force-move** landing including push); `ingress_marker` (**walk enter**); `dwell_marker` (**end-turn** occupy); `wake_marker` (**start-turn** occupy) | Walk-on is free. Swap / Twin Gate / blink onto the paint pays. Extra room `swap_pulpit` is a teach — family is **`swap_marker`**. |
| `spell-odd-plate` (next hit is 0 **while leftover AP is odd**; consume on miss) | `spent_plater` (leftover **AP ≥ 1** — even 2 still negates); `poise_hooder` (leftover AP === leftover MP ≥ 1); `tally_hooder` (this pass, leftover **sum === 3**) | Keep leftover 1/3. Spend to even and the hit lands; charge **stays**. |
| `spell-mire-skip` (next **1-tile** walk ignores **mire enter-tax**) | `rime_skipper` (**rime leave-tax**); `glyph_skipper` (**glyph-tax**); `spike_skipper` (**spikes**); `lava_skipper` (**lava**); `pit_skipper` (**pits**) | Wrong hazard still ticks. Length ≥ 2 pays. Extra room `mire_nave` is a teach — family is **`mire_skipper`**. |
| `spell-odd-sting` (leftover **AP odd** → bonus damage) | `full_stinger` (leftover AP **≥ 3**); `tally_stinger` (this pass, leftover **sum === 3**); `poise_stinger` (leftover AP === leftover MP ≥ 1); `gaunt_stinger` (both leftover **0** — 0 is even) | Poke leftover 1/3. Even leftover → 10 only. |
| `spell-summon-verse` (allied summons pay +1 **AP** to **recast last id**) | `summon_caster` (+1 AP to start **any** spell); `summon_toller` (+1 AP to start a **walk**); `summon_gaiter` (+1 **MP** to start a walk) | First cast of any id is free. Recast Inferno pays. **Do not PAIR with Summon Cast / Summon Toll / Summon Gait.** |
| `spell-equal-gift` (heal 10 iff **target** leftover AP === leftover MP **and both ≥ 1**) | `poise_mender` (**caster and target** both tied ≥ 1); `tally_mender` (this pass, both leftover **sum === 3**); `hollow_gifter` (target leftover both 0); `gaunt_mender` (caster and target leftover both 0) | Healer CORE only. Caster leftover unconstrained. Dual Keep 2/2 **enables**. **No extra door** — do not invent `equal_cantor`. |
| `spell-cast-toll` (next **spell** +1 AP if they **Struck** last turn) | `strike_debter` (next **walk** +1 AP after Strike); `spent_taxer` (next **spell** after a **walk**); `debt_caster` (next **walk** after a **spell**); Quiet Hex (ungated next-spell +1) | Spell last turn → fizzle. Strike stays 2 AP. |
| `spell-brick-step` (relocate **through** an adjacent barrier to the far empty floor) | `brick_nudger` (pushes the **barrier** 1 away); `brick_orbiter` (orbit the barrier to another adjacent empty); `brick_cracker` (**removes**); Phase Slip (free blink) | Peek-through-cover. Barrier **stays**. Dest occupied / void / portal fizzles. |
| `spell-watch-bank` (next **overwatch snap** **banks** 1 leftover AP on the **walker**) | `watch_almer` (**grants** the walker +1 AP **now**); `watch_sipper` (**steals** leftover AP); `watch_feer` (**debits** without transfer); Dual Keep (banks leftover **AP and MP**, no overwatch) | Paying yourself later. Dual Keep **wins** if already banking. **Do not PAIR with Watch Alms / Watch Sip / Watch Fee.** |
| `spell-tied-gait` (10 + 10 iff leftover AP **and** leftover MP are both **exactly 2**) | `pair_gaiter` (leftover **MP** exactly 2); `pair_purser` (leftover **AP** exactly 2); `poise_stinger` (leftover AP === leftover MP ≥ 1, including 3/3); `equal_gifter` (**heal** on any tied ≥ 1) | Exact 2/2 poke. 1/1 and 3/3 miss the bonus. |
| `spell-portal-cut` (10 + 10 if target is Chebyshev ≤ 2 from a **`map.portals`** cell) | `hazard_cutter` (**painted hazard**; Wave 13 **excludes** world portals); `void_reeler` (pull toward void/portal); `escort_cutter` (pet in 2) | Threshold poke. Twin Gate pads are **not** `map.portals`. |
| `spell-shove-gift` (heal 10 iff **this caster** force-moved the target this turn) | `drift_gifter` (**anyone’s** force-move); `heave_mender` (**both** caster and target force-moved); `equal_gifter` (this pass, leftover equality) | Healer CORE only. Walk / Swap / Tally Step / Brick Step do **not** count. |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-prime` (`NOT_PLAYER_LEARNABLE`; `court_prime_regent` kit — same law as Court Floor / Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-rank` (ENEMY_ONLY; stays `rank_precentor` CHAMPION SIGNATURE), `spell-rank-fold` (BOSS_ONLY; `rank_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold / Court Floor stay where Waves 5–15 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 16 CORE rows are `mpCost: 0`. Tally Sip / Watch Bank / Purse Turn / Tally Lend rewrite **current leftover AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Tally Post / Swap Mark / Cadence Prime are **not** queue splices.  
Do **not** family an eleven-cell occupy. Dec Span is the ten-cell card. Nine Span already owns nine. Oct Span already owns eight.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family File Stride / Hexa Oath / Lava Reel / File Bite / Strike Mark / Dry Plate / Shock Skip / Even Sting / Summon Rank / Lean Gift / Cadence Rise / Still Toll / Brick Brace / Watch Root / Odd Gait / Spike Cut / Summon Plate / Pack Diag / Far Fold (SDE Wave 15 unique CORE — Wave 17).  
Do **not** family remaining CDs `max(1)` floor as a **second** Cadence Floor. SDE already won that hole.  
Do **not** family remaining zeros → 1 as `spell-cadence-arm`. Cadence Prime owns that hole.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 15 unique CORE as this pass’s CORE.  
Do **not** mint `wave16:` colliding spell ids.  
Do **not** name the Tally Mend family `tally_cantor`, the Dec Span family `span_dec`, the Rank Stride family `rank_gallery` or `rank_lancer`, the Penta Oath family `penta_nave` or `penta_prelate`, the Spike Reel family `spike_aisle` or `pit_reeler`, the Swap Mark family `swap_pulpit` or `shove_marker`, the Cadence Prime family `prime_precentor` or `cadence_floorer`, the Equal Gift family `equal_cantor`, or the Portal Cut family `hazard_cutter` / `axis_cutter`.

---

## 3. Encounter synergy packs (Waves 1–16)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** Tally Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span **or** Dec Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Tally Choir | `tally_mender` + `verse_tallier` + `ignite_alchemist` | Sum===3 8, then Inferno is illegal until leftover AP + leftover MP === 3 |
| Dec Plug | `dec_prelate` + `tally_siller` + `rank_lancer` | 2×5 corridor seal, tax a neighbor at turn start, lance the block. Skip until remaining cap ≥ 10 |
| Rank Penta | `rank_warder` + `penta_oather` + `glass_sniper` | Next walk must share rank, next spell must be exact 5, snipe from 5 |
| Spike Screen | `spike_reeler` + `screen_biter` + `glyph_sower` | Pull toward spikes, then bite through the barrier that sits on Bresenham |
| Swap Brick | `swap_marker` + `brick_stepper` + `mist_walker` | Paint the teleport landing, peek through a wall, blink onto the wick |
| Odd Court | `odd_plater` + `odd_stinger` + `plate_warden` | Leftover-AP-odd miss, then leftover-AP-odd poke through the plate |
| Mire File | `mire_skipper` + `tide_shade` + `ley_tollkeeper` | Cross the mire tax, then the tide slows the landing |
| Verse Kennel | `summon_verser` + `kennel_siller` + `null_censor` | Pets pay AP to recast last id, then they cannot leave — teach contrast vs Cast / Toll / Gait |
| Equal Shove | `equal_gifter` + `shove_gifter` + `bash_bruiser` | Tied-≥1 10, then cash the authored shove |
| Prime Tax | `cadence_primer` + `cast_toller` + `tax_scribe` | Ready-lock zeros to 1, then tax the spell after they Struck |
| Watch Bank Hunt | `watch_banker` + `glass_sniper` + `dim_optic` | Snap banks leftover AP, then the gun / optic punish the dry purse |
| Tied Portal | `tied_gaiter` + `portal_cutter` + `void_mirror` | Poke exact 2/2, then cash the world-portal threshold |
| Tally Quiet | `tally_stepper` + `tally_mender` + `cover_squire` | Join the sum===3 ally, then cash the four leftover-sum 8 |
| Purse Tally | `purse_turner` + `tally_mender` + `tally_stinger` | Invert a hostile purse while keeping sum 3, then heal / sting |
| Tally Gate | `tally_prelate` + `tally_siller` + `tally_stinger` | Post detonates sum===3 occupy; tile taxes start-of-turn; sting the rest |
| Bounce Tally | `tally_bouncer` + `must_tallier` + `fuse_binder` | Two sum===3 bodies, bounce 12+12 onto the wick |
| Tally Hold File | `tally_holder` + `must_tallier` + `leash_warden` | Walk **and** tools need leftover sum === 3 — COURT, never PAIR Tally Hold + Must Tally on the same body without a third peeler |
| Lend Hood | `tally_lender` + `tally_hooder` + `tempo_precentor` | Cash the window with +1/+1 (sum 5), or hold (2,1) through a miss |
| Rank Screen | `rank_warder` + `screen_biter` + `cover_squire` | Same-rank walk then bite through the cover the squire occupies |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel), and Wave 15 packs (Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood).

Do **not** pack as PAIR (COURT later is fine):

- `tally_mender` + `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `dec_prelate` + `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `tally_hooder` + `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` as PAIR
- `tally_stinger` + `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `lone_purser` / `pair_purser` / `full_purser`
- `tally_stepper` + `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire`
- `tally_siller` + `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker`
- `tally_holder` + `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_tallier` as PAIR / `must_poiser` as PAIR
- `tally_lender` + `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `tally_sipper` + `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `tally_prelate` + `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `dec_prelate` / `nine_prelate`
- `tally_bouncer` + `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_tallier` + `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `tally_holder` as PAIR
- `verse_tallier` + `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as PAIR
- `rank_warder` + `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR
- `penta_oather` + `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `penta_prelate`
- `spike_reeler` + `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter`
- `screen_biter` + `axis_biter` / `foe_biter` / `side_biter` / `lone_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter`
- `swap_marker` + `shove_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder`
- `odd_plater` + `spent_plater` / `gait_plater` / `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `poise_hooder` as PAIR / `tally_hooder` as PAIR / `odd_holder` as PAIR
- `mire_skipper` + `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper`
- `odd_stinger` + `full_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `ready_stinger` / `odd_plater` as PAIR
- `summon_verser` + `summon_caster` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `verse_tallier` as PAIR
- `equal_gifter` + `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor`
- `cadence_primer` + `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner`
- `cast_toller` + `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` / `summon_toller` as PAIR / `walk_toller` as PAIR
- `brick_stepper` + `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `tally_stepper` as PAIR
- `watch_banker` + `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `tied_gaiter` + `pair_gaiter` / `lone_gaiter` / `pair_purser` / `full_gaiter` / `poise_stinger` / `tally_stinger` / `equal_gifter` as PAIR
- `portal_cutter` + `hazard_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as PAIR
- `shove_gifter` + `drift_gifter` / `heave_mender` / `equal_gifter` / `tally_mender` / `hollow_gifter` / `still_gifter` / `poise_mender` / `gaunt_mender` / `pale_cantor`
- `purse_turner` + `bar_crosser` as PAIR / `pawn_broker` as PAIR (tile swap is not leftover invert) / `dual_keeper` as PAIR

Do **not** spawn Dec Plug on a map with no free 2×5 rectangle (solvability). Do not spawn Spike Screen / Mire File on a map with no spike occupancy / no mire cell in Chebyshev 6 of a legal floor. Do not spawn Swap Brick without a legal teleport tool in the pack (`mist_walker` / `wraith_bishop` / `twin_porter`). Do not spawn Verse Kennel without a living allied summon **or** a dedicated summoner that is not PAIR-banned. Do not spawn Equal Shove without a legal force tool in the pack (`bash_bruiser` / `sink_chanter` / `hook_chaplain`). Do not spawn Tied Portal in a room with no `map.portals` cell. Twin Gate pads do **not** count.

---

## 4. Family sheets — Wave 16

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-23.md`](https://github.com/Mr-Melic/stralt/pull/953) (PR #953) unless marked SDE Wave 14 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-evolution-2458/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md), PR #906).

---

### ENEMY_ID: `tally_mender`

- **NAME:** Tally Mender
- **ROLE:** healer (heal iff caster **and** target leftover AP + leftover MP **=== 3**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Tally Mend (`spell-tally-mend`, #953). Extra door `tally_cantor` — family is **not** that id. Distinct from `poise_mender` (both leftover **AP === MP ≥ 1**), `equal_gifter` (target-only tied ≥ 1), `gaunt_mender` (both leftover **0**), `hollow_gifter` (target leftover both 0). At most one four-flag heal CORE per pack as PAIR vs Poise / Equal / Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift / Shove.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover sum ≠ 3. Peer: Tally Mend only if both leftover sums === 3 **and** missing HP ≥ 8. Above: refuse if Dual Keep banks 2/2 (Poise window — Frost / Shield). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already summing leftover to 3**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_3"`. VETERAN: skip if either sum ≠ 3. ELITE: prefer self-cast when the caster already sits on (2,1) after the 3 AP arm. CHAMPION: refuse if a Strike from this body would kill.
- **CORE_SPELL_POOL:** `spell-tally-mend`
- **ADVANCED_SPELL_POOL:** `starter-heal` (ungated, never as CORE), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** add Poise Mend / Equal Gift / Gaunt Mend / Hollow Gift.
- **SIGNATURE_MECHANICS:** Four leftover reads. Legal pairs (3,0) (0,3) (2,1) (1,2). Dual Keep 2/2 is **Poise**, not Tally. `healAmount` stays 0 on the Tally Mend row.
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong-sum → ELITE self-window → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE when Dual Keep / Purse Turn is already in the pack (COURT, not PAIR with Equal / Poise).
- **SYNERGIES:** `purse_turner`, `verse_tallier`, `tally_lender` (cashes **out** — COURT later), `cover_squire`
- **WEAKNESSES:** Spend off sum 3; dump to 0/0 (Gaunt); sit 1/1 (Poise); Cursed Wound
- **PLAYER_COUNTERPLAY:** Cast 1 AP from (2,1) → (1,1); kill the cantor first; do not hold 3 leftover AP in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-mend` (MULTI: family observe **or** `tally_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_primer`

- **NAME:** Cadence Primer
- **ROLE:** controller (remaining CDs `n===0` → `1`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Cadence Prime (`spell-cadence-prime`, #953). Extra door `prime_precentor` — family is **not** that id. Distinct from Floor observe extras on `cadence_thief` / `hex_chorister` (`n>1` → 1, zeros stay 0), `cadence_lagger` (`n>0` → `n+2`), `cadence_staller` (`n>0` → `n+1`). At most one ready-lock CORE per pack as PAIR vs Thief / Lagger / Staller / Swapper / Imprinter / Halver.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is already > 0. Peer: Prime only if a nuke remaining is 0. Above: refuse if the only ready id is Strike and a Strike from **you** would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **denying the ready bar for one tick**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "prime_if_target_has_remaining_cd_eq_0_on_a_nuke"`. VETERAN: skip all-nonzero. ELITE: prefer Inferno / Heal remaining 0 over Strike-only. CHAMPION: never Prime a bar you will Crack the same turn (Crack is a different family).
- **CORE_SPELL_POOL:** `spell-cadence-prime`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if the primed id is already remaining 1
- **ELITE_SPELL_POOL:** none — do **not** add Cadence Floor / Cadence Lag / Cadence Crack
- **SIGNATURE_MECHANICS:** Remaining `0` → `1`. Ones stay 1. `n>1` unchanged. Target keeps every spell. Distinct from Floor (compress) and Arm (tombstoned alias).
- **VARIANT_PROGRESSION:** BASE ready-lock → VETERAN skip-nonzero → ELITE nuke-bias → CHAMPION no-double-rewrite
- **RARITY_CURVE:** Standard. +ELITE vs high-CD kits (Inferno). Never CHAMPION in a solo pack with Floor extras.
- **SYNERGIES:** `verse_tallier`, `cast_toller`, `tax_scribe`, `hex_chorister` (Floor extra — COURT, not PAIR)
- **WEAKNESSES:** Recast before Prime; Cadence Break your own remaining to 0 after; wait the remaining 1
- **PLAYER_COUNTERPLAY:** Spend the ready Inferno **now**; Swap the primed map onto a decoy (`cadence_swapper` is a different family)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-prime` (MULTI: family observe **or** `prime_precentor` first-win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, write 1 when n===0)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dec_prelate`

- **NAME:** Dec Prelate
- **ROLE:** summoner (ten-cell occupy, axis-aligned 2×5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate`. Extra door is `span_dec` — family is **not** that id. At most one Dec Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 10.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if remaining cap < 10 (Frost / Strike). Peer: plant only if all 10 cells are free and the rectangle splits the player from an exit. Above: refuse if the only 2×5 covers the last portal file (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.70, sr 0.90, res 1.10, init 0.85, chc 0.60. Identity is **ten cells of deny along one corridor**. If it tops the meter, the kit leaked toward turret.
- **AI_TIER_PROGRESSION:** New summon AI `decspan` (#953): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **ten** cells of an axis-aligned 2×5 as one combatant id; **every cell occupied**. VETERAN: skip if remaining cap < 10. ELITE: Tally Sill a neighbor. CHAMPION: never punch a rectangle if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-dec-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-barrier` only if the far short edge needs a door
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / ninespan / driftpost / leanpost / gauntpost / poisepost / tallypost on this body.
- **SIGNATURE_MECHANICS:** Facing from caster to click. `|dx| >= |dy|` → 5 along x by 2 along y; else 2×5. Click is the cell closest to the caster. Counts as **ten**. Distinct from Nine Span’s square.
- **VARIANT_PROGRESSION:** BASE corridor-plug → VETERAN cap-check → ELITE neighbor-sill → CHAMPION solvability skip
- **RARITY_CURVE:** Standard. +ELITE on corridor / `void_rift` maps. Never spawn while live cap is 2 without occupy-weight.
- **SYNERGIES:** `tally_siller`, `rank_lancer`, `quiet_siller`, `file_reeler`
- **WEAKNESSES:** Occupy any of the 10 before paint; Coup the one HP pool; walk around the long axis
- **PLAYER_COUNTERPLAY:** Stand on a cell of the 2×5; blink around the rectangle; do not fight in a 2-wide hall
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dec-span` (MULTI: family observe **or** `span_dec` first-win). Ten kit is empty — nothing to steal from the block.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "decspan"`; ten-cell 2×5 footprint helper; do not spawn ten initiative seats; solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `purse_turner`

- **NAME:** Purse Turner
- **ROLE:** controller (invert leftover AP↔MP on a **hostile**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `bar_crosser` (two-body leftover **cross**), Tempo Invert (ally/self). At most one hostile-invert CORE per pack as PAIR vs Bar Cross / Dual Keep / Pawn Broker.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: invert if leftover AP ≥ 2 and leftover MP = 0 (or the inverse). Peer: skip if both leftover pools are already equal (no-op). Above: refuse 0/0 (fizzle rider) and refuse if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.15, chc 0.80. Identity is **turning one hostile purse**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "turn_if_target_leftover_ap_ge_2_and_leftover_mp_eq_0_or_inverse"`. VETERAN: skip equal leftover. ELITE: invert (3,0) so Tally Sting still fires (sum invariant). CHAMPION: never invert into a window an ally Poise Stinger would miss unless a Tally Stinger is in COURT.
- **CORE_SPELL_POOL:** `spell-purse-turn`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none — do **not** add Tempo Invert / Bar Cross
- **SIGNATURE_MECHANICS:** Hostile leftover AP ↔ leftover MP; caster unchanged; sum invariant. Caps at each pool’s max. Not `isSwap`.
- **VARIANT_PROGRESSION:** BASE turn-fat-AP → VETERAN skip-noop → ELITE keep-Tally → CHAMPION pack-window
- **RARITY_CURVE:** Standard. +ELITE with a Tally pack (COURT).
- **SYNERGIES:** `tally_mender`, `tally_stinger`, `must_tallier`, `ley_tollkeeper` (wants their MP gone)
- **WEAKNESSES:** Keep leftover AP === leftover MP (no-op); Quiet Hex after they invert into a 3-AP spell
- **PLAYER_COUNTERPLAY:** Sit 1/1 or 2/2; Strike before they recast; do not hold 3 leftover AP and 0 MP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-purse-turn` (ENEMY_DISCOVERY, piece observe — **no** extra door)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (snapshot one leftover pair, two capped writes)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_hooder`

- **NAME:** Tally Hooder
- **ROLE:** protector (next applied hit is 0 while leftover AP + leftover MP === 3, any range)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `poise_hooder` (tied ≥ 1), `spent_plater` (leftover AP ≥ 1), `odd_plater` (leftover AP odd). At most one sum===3 miss CORE per pack as PAIR vs Poise Hood / Spent / Gait / Odd Plate / range Hoods.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: arm only if leftover sum === 3. Peer: skip if leftover is 2/2 (Poise Hood’s window — Iron Skin). Above: refuse if leftover is 0/0.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.85, sr 1.05, res 1.15, init 0.90, chc 0.70. Identity is **holding a sum of 3 through the hit**.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "tally_hood_if_leftover_ap_plus_mp_eq_3"`. VETERAN: skip wrong sum. ELITE: Purse Turn to **keep** sum 3 if an ally can. CHAMPION: never spend the last leftover AP that holds the hood unless a Strike would kill.
- **CORE_SPELL_POOL:** `spell-tally-hood`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-rallying-cry`
- **ELITE_SPELL_POOL:** none — do **not** add Poise Hood / Spent Plate / Odd Plate
- **SIGNATURE_MECHANICS:** One-hit consume. Hit while sum ≠ 3 lands fully; charge **stays**. Any Chebyshev.
- **VARIANT_PROGRESSION:** BASE hold-(2,1) → VETERAN skip-wrong-sum → ELITE keep-sum → CHAMPION refuse-spend
- **RARITY_CURVE:** Standard. +VETERAN in Odd Court / Tally Gate.
- **SYNERGIES:** `purse_turner`, `tally_lender` (exits — COURT later), `cadence_primer`
- **WEAKNESSES:** Wait until they spend a pool off 3; Drain Courage; Coup / execute out of scope
- **PLAYER_COUNTERPLAY:** Hit after they spend; sit through 2/2 (this hood does not fire)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-hood` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one consume flag + leftover sum at impact)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_stinger`

- **NAME:** Tally Stinger
- **ROLE:** assassin (10 + 8 iff target leftover AP + leftover MP === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `poise_stinger` / `gaunt_stinger` / `odd_stinger` / `tied_gaiter` / `full_stinger`. At most one leftover-sum poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 always; bonus only in-window. Peer: skip the id if the target is off-window **and** a Strike would kill. Above: refuse if leftover is 2/2 (Poise Sting’s window — Frost).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the 8 on sum 3**, not a bigger Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "tally_sting_if_target_leftover_ap_plus_mp_eq_3"`. VETERAN: skip off-window if Frost is better. ELITE: path to the (2,1) body, not the nearest. CHAMPION: Purse Turn a (3,1) into (1,3) only if an ally Turner is in COURT.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-tally-sting`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Two `dealDamage` calls when gated. Target leftover 2/2 → 10 only. 0/0 → 10 only.
- **VARIANT_PROGRESSION:** BASE always-10 → VETERAN window-bias → ELITE hunt-(2,1) → CHAMPION pack-invert
- **RARITY_CURVE:** Standard. +VETERAN when a Turner or Holder is already in the pack.
- **SYNERGIES:** `purse_turner`, `tally_holder`, `tally_mender`
- **WEAKNESSES:** Spend off sum 3; sit 1/1 or 0/0
- **PLAYER_COUNTERPLAY:** Dump a pool before they step in; Slow the last tile
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_stepper`

- **NAME:** Tally Stepper
- **ROLE:** teleporter (land adjacent to an ally whose leftover AP + leftover MP === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `poise_stepper` / `gaunt_stepper` / `home_stepper` / `heave_stepper` / `brick_stepper`. At most one leftover-sum relocate CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally sits on sum 3. Peer: step only if a free Chebyshev-1 exists. Above: refuse if every neighbor is lava while HP% < 40.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.20, chc 0.85. Identity is **gated relocate**, not blink-anywhere.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "tally_step_if_ally_sum_eq_3_and_free_adj"`. VETERAN: skip occupied ring. ELITE: pick the neighbor that is not on a fuse. CHAMPION: never land on the only exit (solvability).
- **CORE_SPELL_POOL:** `spell-tally-step`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-shadow-veil`
- **ELITE_SPELL_POOL:** none — do **not** add Swap / Twin Gate / Poise Step
- **SIGNATURE_MECHANICS:** Relocate, not `isSwap`. Dest hazard **must tick**. Self-target illegal. Does **not** write `walkMpSpentThisTurn`.
- **VARIANT_PROGRESSION:** BASE join-(2,1) → VETERAN free-ring → ELITE fuse-avoid → CHAMPION exit-safe
- **RARITY_CURVE:** Standard. Never CHAMPION in a solo pack.
- **SYNERGIES:** `tally_mender`, `tally_lender`, `cover_squire`
- **WEAKNESSES:** Occupy every neighbor; break the ally’s sum before the step
- **PLAYER_COUNTERPLAY:** Body-block the ring; Drain the ally off 3
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (leftover-sum gate + occupy dest)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_siller`

- **NAME:** Tally Siller
- **ROLE:** hazard creator (start-of-turn occupy on leftover sum === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `poise_siller` / `gaunt_siller` / `wake_marker` / `shove_marker` / `swap_marker`. At most one leftover-sum start-tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint the tile the player will occupy at dawn. Peer: skip if the tile is empty and no foe can occupy it this round. Above: paint a choke they must enter, not their current feet (they can spend overnight).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 1.00, res 0.90, init 1.00, chc 0.75. Identity is **dawn tax on sum 3**. Fuse deals 0 on cast — this paint deals 0 on cast too.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tally_sill_if_tile_will_be_occupied_by_sum_eq_3_foe"`. VETERAN: skip empty. ELITE: combo with Tally Hold so they cannot walk off. CHAMPION: never stack two sills on one cell (last-writer is a lie).
- **CORE_SPELL_POOL:** `spell-tally-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile, `spell-slow`
- **RARE_SPELL_POOL:** `spell-barrier` (last-writer fills the paint — teaching contrast)
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Start-of-their-turn occupy. Walk-enter / end-turn / relocate landing do **not** tax. Barrier > sill.
- **VARIANT_PROGRESSION:** BASE paint-feet → VETERAN value-check → ELITE hold-combo → CHAMPION one-sill
- **RARITY_CURVE:** Standard. +ELITE on corridor maps.
- **SYNERGIES:** `tally_holder`, `tally_prelate`, `rank_lancer`, `dec_prelate`
- **WEAKNESSES:** Spend off 3 before turn start; walk off (start-only); Barrier last-writer
- **PLAYER_COUNTERPLAY:** Dump a pool overnight; do not camp (2,1) on the sill
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-sill` (ENEMY_DISCOVERY). Observation is the **paint**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (start-of-turn leftover-sum gate; same class as Poise Sill)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_holder`

- **NAME:** Tally Holder
- **ROLE:** controller (cannot spend walk MP while leftover AP + leftover MP === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `poise_holder` / `odd_holder` / `dry_holder` / `gaunt_holder`. **Do not PAIR with `must_tallier`.** At most one leftover-sum walk-lock CORE per pack as PAIR vs Poise / Odd / Dry / Drift / Gaunt Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: arm only if leftover sum === 3. Peer: skip if leftover is 2/2 (Poise Hold’s window). Above: prefer (0,3) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.95, res 0.90, init 1.10, chc 0.80. Identity is **walk denial while sum is 3**, not a root.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tally_hold_if_target_leftover_ap_plus_mp_eq_3_and_wants_to_walk"`. VETERAN: skip wrong sum. ELITE: pair with Purse Turn in COURT so (0,3) stays (0,3). CHAMPION: never arm if the only remaining legal verb is Strike and a walk would kill **you**.
- **CORE_SPELL_POOL:** `spell-tally-hold`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Must Tally / Poise Hold / Root
- **SIGNATURE_MECHANICS:** Walk that would spend ≥ 1 leftover MP is illegal while sum === 3. Teleport / Swap / Tally Step stay legal. Duration 2 of their turns.
- **VARIANT_PROGRESSION:** BASE lock-(2,1) → VETERAN skip-2/2 → ELITE keep-(0,3) → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. Never CHAMPION as PAIR with Must Tally.
- **SYNERGIES:** `purse_turner`, `leash_warden`, `tally_prelate` (COURT with Must Tally, never PAIR)
- **WEAKNESSES:** Spend leftover AP to leave sum 3; blink; wait 2. From (0,3) they have no leftover AP — wait or own Purse Turn.
- **PLAYER_COUNTERPLAY:** Cast off (2,1); blink; do not hold 0 AP and 3 MP in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-hold` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-spend gate + leftover sum)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_lender`

- **NAME:** Tally Lender
- **ROLE:** buffer (+1 AP **and** +1 MP to an ally on leftover sum === 3 — **exits** to sum 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `poise_lender` (tie **survives**) / `gaunt_lender` (both leftover 0) / `tempo_precentor` (next-turn AP). At most one leftover-sum cash-lend CORE per pack as PAIR vs Poise / Gaunt / Lean / Spent / Drift / Tempo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if ally sum ≠ 3. Peer: lend only if neither pool is already at max. Above: refuse if the ally needed the hood more than the bump (Iron Skin / Frost).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.15, chc 0.75. Identity is **cashing a sum of 3**, not keeping a tie.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "tally_lend_if_ally_sum_eq_3"`. VETERAN: skip wrong window. ELITE: never lend into a hit the ally wanted blanked (Tally Hood). CHAMPION: Dual Keep after in COURT so the new leftover banks.
- **CORE_SPELL_POOL:** `spell-tally-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-rallying-cry`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-haste` only as ADVANCED-adjacent — never CORE (Haste is walk budget)
- **ELITE_SPELL_POOL:** none — do **not** add Poise Lend / Haste / Loan Tempo
- **SIGNATURE_MECHANICS:** Target leftover sum 3 → +1/+1 → sum 5. Window **closes**. Self-cast legal if caster leftover sum === 3 after paying 2 AP.
- **VARIANT_PROGRESSION:** BASE cash-(2,1) → VETERAN skip-wrong → ELITE hood-respect → CHAMPION bank-after
- **RARITY_CURVE:** Standard
- **SYNERGIES:** `tally_hooder` (COURT — lend **or** hood, not both same turn), `must_tallier` (arm **before** the lend), `dual_keeper` (COURT, not PAIR)
- **WEAKNESSES:** Drain Courage after the grant; refuse the window so the lend fizzles
- **PLAYER_COUNTERPLAY:** Sit 1/1 so they waste the arm; kill the buffer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_sipper`

- **NAME:** Tally Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover sum === 3 and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `poise_sipper` / `bare_sipper` / `watch_sipper` / `soul_siphon`. At most one leftover-sum AP-steal CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip (0,3) — no AP to steal. Peer: sip (2,1) to manufacture (1,1) Poise. Above: refuse if leftover sum ≠ 3.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.90, res 0.75, init 1.20, chc 0.90. Identity is **manufacturing Poise from Tally**, not Soul Sip.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tally_sip_if_target_sum_eq_3_and_leftover_ap_ge_1"`. VETERAN: skip leftover AP = 0. ELITE: sip then let a COURT Poise Stinger cash 1/1. CHAMPION: never sip a 3/0 into 2/0 if a Tally Stinger needed the window.
- **CORE_SPELL_POOL:** `spell-tally-sip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `starter-poison`
- **ELITE_SPELL_POOL:** none — do **not** add Poise Sip / Soul Sip / Watch Sip
- **SIGNATURE_MECHANICS:** (2,1) → (1,1) Poise. (3,0) → (2,0) off every named window. (1,2) → (0,2). (0,3) fizzles.
- **VARIANT_PROGRESSION:** BASE steal-(2,1) → VETERAN skip-(0,3) → ELITE make-Poise → CHAMPION keep-Tally
- **RARITY_CURVE:** Standard
- **SYNERGIES:** `poise_stinger` / `poise_mender` (COURT, not PAIR with `tally_stinger`), `tally_holder`
- **WEAKNESSES:** Sit on (0,3); sit off sum 3
- **PLAYER_COUNTERPLAY:** Hold leftover MP only; Second Wind after
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_prelate`

- **NAME:** Tally Prelate
- **ROLE:** summoner (end-turn occupy detonates iff leftover AP + leftover MP === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Replaces random overlay on this body. Distinct from `poise_prelate` / `gaunt_prelate` / `lean_prelate` / `dummy_prelate` / `drift_prelate`. Counts as **1**. `summonAI: "tallypost"`. At most one Tally Post per pack. Legal at remaining cap ≥ 1.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: plant on the tile they will end on. Peer: skip if cap is full. Above: never plant on the only exit (solvability).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.90, res 0.85, init 1.00, chc 0.70. Identity is **end-turn occupy on a sum of 3**.
- **AI_TIER_PROGRESSION:** New summon AI `tallypost` (#953): empty kit, **must not path**, **must not cast**. VETERAN: skip if remaining cap < 1. ELITE: Tally Sill a neighbor. CHAMPION: never plant on the only exit.
- **CORE_SPELL_POOL:** `spell-tally-post`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** Do **not** unlock wolf / archer / dummy / gauntpost / leanpost / driftpost / poisepost / ninespan / decspan
- **SIGNATURE_MECHANICS:** End-turn occupy. Walk-enter / relocate landing / start-of-turn do **not** detonate. Dual Keep 2/2 **hurts Poise Post, not this**. Counts as **1**.
- **VARIANT_PROGRESSION:** BASE plant-feet → VETERAN cap-check → ELITE neighbor-sill → CHAMPION exit-safe
- **RARITY_CURVE:** Standard. Legal at remaining ≥ 1 (unlike Dec / Nine).
- **SYNERGIES:** `tally_holder`, `tally_siller`, `tally_stinger`
- **WEAKNESSES:** Spend a pool before turn end; walk off (walk-safe); Coup the post
- **PLAYER_COUNTERPLAY:** Dump leftover overnight; blink; do not camp (2,1) on the post
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-post` (ENEMY_DISCOVERY). Summon is observation; later detonate is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`summonAI: "tallypost"`; end-turn leftover-sum gate; same class as Poise Post)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tally_bouncer`

- **NAME:** Tally Bouncer
- **ROLE:** artillery (12 to primary; bounce 12 to nearest other leftover-sum===3 hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `poise_bouncer` / `gaunt_bouncer` / `heave_bouncer` / `storm_caller`. At most one leftover-sum bounce CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 12 always. Peer: skip if no second in-window body **and** a Strike would kill the primary. Above: refuse if the only second body is 2/2 (Poise Bounce’s window).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.15, sr 0.90, res 0.75, init 1.10, chc 0.90. Identity is **the second 12**, not a bigger Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tally_bounce_if_second_sum_eq_3_hostile_in_r4"`. VETERAN: skip isolated. ELITE: open on whoever, splash the (2,1) bishop. CHAMPION: never bounce onto an ally.
- **CORE_SPELL_POOL:** `spell-tally-bounce`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-inferno` only if the player is already clustered on two sum===3 bodies, `spell-mark`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Chain Lightning as identity
- **SIGNATURE_MECHANICS:** Primary leftover unconstrained. Second body must sit on sum 3 in Chebyshev ≤ 4. Missing flag → 12 only.
- **VARIANT_PROGRESSION:** BASE 12 → VETERAN second-check → ELITE splash-(2,1) → CHAMPION no-friendly-fire
- **RARITY_CURVE:** Standard. Never CHAMPION in a solo pack.
- **SYNERGIES:** `must_tallier`, `fuse_binder`, `purse_turner`
- **WEAKNESSES:** Isolate (one Tally body); sit the second body on 1/1 or 0/0
- **PLAYER_COUNTERPLAY:** Spread; dump a pool on the second body
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tally-bounce` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one search + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_tallier`

- **NAME:** Must Tallier
- **ROLE:** controller (non-Strike illegal unless leftover sum === 3 **and** the spell spends last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `must_poiser` / `must_gaunter` / `hold_caster` / `tool_holder`. **Do not PAIR with `tally_holder`.** At most one leftover-sum last-AP tool lock CORE per pack as PAIR vs Must Poise / Must Gaunt / Must Lean / Cast Hold / Tool Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: arm only if leftover sum === 3. Peer: skip if leftover is 1/1 (Must Poise’s window). Above: prefer (0,3) — leftover AP is 0, so every non-Strike is blocked.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.15, chc 0.80. Identity is **last-packet from a sum of 3**, not a silence.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_tally_if_target_leftover_sum_eq_3_and_has_a_last_packet_spell"`. VETERAN: skip wrong sum. ELITE: COURT with Tally Hold so (0,3) can neither walk nor non-Strike. CHAMPION: never arm if the only remaining legal verb is Strike and a walk would kill.
- **CORE_SPELL_POOL:** `spell-must-tally`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Must Poise / Tally Hold / Hex of Silence
- **SIGNATURE_MECHANICS:** Pre-spend leftover. Strike stays legal. Walk stays legal unless a Tally Hold is also up. 0-AP tools are not “spending last AP”.
- **VARIANT_PROGRESSION:** BASE lock-(2,1) → VETERAN skip-1/1 → ELITE (0,3)-prison → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard. Never CHAMPION as PAIR with Tally Hold.
- **SYNERGIES:** `tally_holder` (COURT, never PAIR), `purse_turner`, `leash_warden`
- **WEAKNESSES:** Strike; blink; wait 2; Purse Turn yourself
- **PLAYER_COUNTERPLAY:** Strike packet; do not hold a 2-cost tool as last AP on (2,1)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-tally` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (pre-spend leftover sum + last-AP compare in the cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_tallier`

- **NAME:** Verse Tallier
- **ROLE:** debuffer (last resolved id illegal until leftover AP + leftover MP === 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `verse_poiser` / `verse_gaunter` / `last_muter` / `summon_verser`. At most one leftover-sum last-id lock CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if they have no last resolved id. Peer: skip if they already sit on sum 3 (instant lift — fizzle rider). Above: lock Inferno, not Strike (Strike is not a spell id for this key).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.80, init 1.10, chc 0.75. Identity is **which leftover window lifts the last verse**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "verse_tally_if_target_last_id_is_their_win_condition"`. VETERAN: skip no-id / already-lifted. ELITE: Prime so the locked id is also remaining 1. CHAMPION: never lock a last id that is already remaining 0 if a Strike would kill.
- **CORE_SPELL_POOL:** `spell-verse-tally`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-hex` only if last-id writer exists
- **ELITE_SPELL_POOL:** none — do **not** add Verse Poise / Last Mute / Hex of Silence / Summon Verse
- **SIGNATURE_MECHANICS:** 1/1 does **not** lift (Verse Poise). 0/0 does **not** lift (Verse Gaunt). Dual Keep 2/2 does **not** lift. Fail closed until `lastResolvedSpellId` exists.
- **VARIANT_PROGRESSION:** BASE lock-Inferno → VETERAN skip-lifted → ELITE Prime-combo → CHAMPION refuse-overkill
- **RARITY_CURVE:** Standard
- **SYNERGIES:** `cadence_primer`, `tally_holder`, `ignite_alchemist`
- **WEAKNESSES:** Sit on (2,1) / (1,2) / (3,0) / (0,3); recast a different id
- **PLAYER_COUNTERPLAY:** Dump to a Tally pair; recast Frost instead of Inferno
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-tally` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (last-id lock + leftover-sum lift; writer prerequisite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rank_warder`

- **NAME:** Rank Warder
- **ROLE:** controller (next walk legal only if it shares rank)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Rank Stride (`spell-rank-stride`, #906). Extra room `rank_gallery` — family is **not** that id and is **not** `rank_lancer`. Distinct from `knight_warder` ((2,1)) / `orth_warder` / `diag_warder` / `inch_warder`. At most one next-walk-geometry CORE per pack as PAIR vs those / Rank Lancer.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: arm then walk same-rank toward the player. Peer: skip if they must change rank to threaten and Strike is better. Above: refuse if they are a charger who only walks toward the player on a file.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.20, chc 0.85. Identity is **one next walk stuck on the rank**.
- **AI_TIER_PROGRESSION:** Profile `flanker` / `kiter`. `aiHint: "walk_same_rank_only"`. VETERAN: skip if file-advance is the only threaten. ELITE: File Lance after they are stuck (COURT with `rank_lancer`, not PAIR). CHAMPION: never arm if Root is already on them.
- **CORE_SPELL_POOL:** `spell-rank-stride`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Rank Lock / Pack Rank / Knight Stride / Orth Stride
- **SIGNATURE_MECHANICS:** `dest.y == y_at_arm`. Length is free. File-advance confirm-fails (MP not spent). Forced movement / swap / blink still legal. Does **not** read `currentView`.
- **VARIANT_PROGRESSION:** BASE same-rank-walk → VETERAN skip-file-need → ELITE lance-after → CHAMPION no-root-arm
- **RARITY_CURVE:** Standard. +ELITE on corridor / rank-file maps.
- **SYNERGIES:** `rank_lancer` (COURT, not PAIR), `screen_biter`, `cover_squire`, `penta_oather`
- **WEAKNESSES:** Stand off-rank; occupy the only same-rank approach; Root before they arm
- **PLAYER_COUNTERPLAY:** Step to another rank; body-block the file-adjacent cells
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rank-stride` (ENEMY_DISCOVERY; teach room `rank_gallery` first-win vs family observe). Observation is the **arm**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (next-walk dest.y gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `penta_oather`

- **NAME:** Penta Oather
- **ROLE:** controller (next non-Strike spell illegal unless Chebyshev = 5)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Penta Oath (`spell-penta-oath`, #906). Extra room `penta_nave` — family is **not** that id and is **not** `penta_prelate`. Distinct from `quad_oather` (exact 4) / `tri_oather` / `mid_oather` / `long_oather` / `near_oather`. At most one exact-Chebyshev oath CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they cannot sit at 5. Peer: arm only if they can reach 5 this turn. Above: refuse if they are already at 4 (Quad Oath’s window — Frost).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 0.90, res 0.75, init 1.15, chc 0.80. Identity is **exact-5 prison**, not a longer Far Sting.
- **AI_TIER_PROGRESSION:** Profile `kiter` / `caster`. `aiHint: "next_spell_exact_chebyshev_5"`. VETERAN: skip if they cannot reach 5. ELITE: Far Sting as the gated poke (COURT). CHAMPION: never arm then walk to 4.
- **CORE_SPELL_POOL:** `spell-penta-oath`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-far-sting` (G≥3 extra from Wave 4 — allowed category: ranged poke)
- **ELITE_SPELL_POOL:** none — do **not** add Quad Oath / Long Oath / Hexa Oath
- **SIGNATURE_MECHANICS:** Next non-Strike confirms only at Chebyshev exactly 5. Strike stays legal at any range. Arm then walk to 4 → fizzle (AP not spent for the fizzled spell; Penta Oath already observed).
- **VARIANT_PROGRESSION:** BASE sit-5 → VETERAN skip-unreach → ELITE far-poke → CHAMPION no-walk-off
- **RARITY_CURVE:** Standard. +ELITE with `glass_sniper` (COURT).
- **SYNERGIES:** `glass_sniper`, `rank_warder`, `dim_optic`
- **WEAKNESSES:** Close to 4 or 6; Root; Paper Wind
- **PLAYER_COUNTERPLAY:** Walk to 4; Force them off 5; Strike-range them
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-penta-oath` (ENEMY_DISCOVERY; teach room `penta_nave`). Observation is the **arm**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell Chebyshev gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spike_reeler`

- **NAME:** Spike Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest spike occupancy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Spike Reel (`spell-spike-reel`, #906). Extra room `spike_aisle` — family is **not** that id and is **not** `pit_reeler`. Distinct from `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler`. Skip if the map has no spike occupancy. At most one attract-dest CORE per pack as PAIR vs those / Sink Chanter.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if no spike. Peer: skip if the 1-step is a world portal / void. Above: refuse if Hazard Cut would not fire anyway (spikes are **not** painted).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.10, chc 0.80. Identity is **the toward-spike step**, not extra damage.
- **AI_TIER_PROGRESSION:** Profile `caster` / `controller`. `aiHint: "attract_toward_nearest_spike"`. VETERAN: skip empty / portal dest. ELITE: Spike Skip on the landing is a different family (COURT). CHAMPION: dest is never `map.portals`.
- **CORE_SPELL_POOL:** `spell-spike-reel`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-barrier` (block the away-step)
- **ELITE_SPELL_POOL:** none — do **not** add Pit Reel / Void Reel / Hazard Cut
- **SIGNATURE_MECHANICS:** Ninth `applyAttract` dest flavor. Spike cells are map-modifier occupancy, **not** painted pits and **not** `map.portals`. Empty board fizzles (AP spent).
- **VARIANT_PROGRESSION:** BASE pull-toward → VETERAN skip-empty → ELITE landing-tax COURT → CHAMPION never-portal
- **RARITY_CURVE:** Standard. +ELITE on maps that already have spike occupancy. Reroll if the map has none.
- **SYNERGIES:** `glyph_sower`, `screen_biter`, `spike_skipper` (COURT, not PAIR), `rime_mason`
- **WEAKNESSES:** Fight on maps without spikes; occupy the toward-tile; blink
- **PLAYER_COUNTERPLAY:** Stand so the 1-step is a wall; Spike Skip if you own it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spike-reel` (ENEMY_DISCOVERY; teach room `spike_aisle`). Empty-board fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`applyAttract` spike-occupancy dest; never `map.portals`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `screen_biter`

- **NAME:** Screen Biter
- **ROLE:** bruiser (10 + 10 if Bresenham is blocked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `axis_biter` / `wall_biter` / `foe_biter` / `lone_biter`. At most one cover-bonus poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 through clear LoS. Peer: skip if LoS is clear and Frost is better. Above: refuse unless a wall or barrier sits on Bresenham.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.10, sr 0.85, res 0.90, init 1.15, chc 1.00. Identity is **20 through cover**, not a bigger Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker` / `caster`. `aiHint: "bonus_if_bresenham_blocked"`. VETERAN: skip clear LoS. ELITE: Brick Step to peek then bite (COURT). CHAMPION: never destroy the screen they are using.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-screen-bite`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` (self-screen)
- **ELITE_SPELL_POOL:** none — do **not** add Axis Bite / Gate Sight / Cover Step
- **SIGNATURE_MECHANICS:** `LOS: false`. Bonus if a wall **or** barrier sits on Bresenham. Clear LoS → 10 only. Reads occupancy, never names.
- **VARIANT_PROGRESSION:** BASE always-10 → VETERAN cover-bias → ELITE peek-then-bite → CHAMPION keep-screen
- **RARITY_CURVE:** Standard. +ELITE on barrier-rich maps.
- **SYNERGIES:** `brick_stepper`, `cover_squire`, `rank_warder`, `stone_castellan`
- **WEAKNESSES:** Step into LoS; destroy the barrier; stand so Bresenham is empty
- **PLAYER_COUNTERPLAY:** Walk into sight; Crack the wall; do not hide behind it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-screen-bite` (ENEMY_DISCOVERY). Clear-LoS 10 still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (Bresenham occupancy read + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `swap_marker`

- **NAME:** Swap Marker
- **ROLE:** hazard creator (cell detonates on teleport landing)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Swap Mark (`spell-swap-mark`, #906). Extra room `swap_pulpit` — family is **not** that id and is **not** `shove_marker`. Distinct from `shove_marker` (force-move including push) / `ingress_marker` / `dwell_marker` / `wake_marker`. At most one landing-class paint CORE per pack as PAIR vs those / Fuse Binder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint the Twin Gate pad / swap dest they will use. Peer: skip if the player has no swap/blink in kit and no Twin Gate pads live. Above: paint a decoy tile they must blink onto, not their feet (walk is safe).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.00, res 0.80, init 1.05, chc 0.75. Identity is **punishing blink**. Walk-on is the counter.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_teleport_onto"`. VETERAN: skip no-teleport kits. ELITE: COURT with `mist_walker` / `twin_porter`. CHAMPION: never CORE Shove Mark on the same body.
- **CORE_SPELL_POOL:** `spell-swap-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile, `spell-slow`
- **RARE_SPELL_POOL:** `spell-barrier`
- **ELITE_SPELL_POOL:** none — do **not** add Shove Mark / Ingress Mark / Twin Gate as CORE
- **SIGNATURE_MECHANICS:** Swap / Twin Gate / Phase Slip / fold landing detonates. Walk-enter, push, pull, and slide **do not**. Observation is the **paint**.
- **VARIANT_PROGRESSION:** BASE paint-pad → VETERAN skip-no-blink → ELITE porter-combo → CHAMPION no-double-paint
- **RARITY_CURVE:** Standard. Reroll if the pack and the player kit have no teleport class.
- **SYNERGIES:** `mist_walker`, `brick_stepper` (relocate is **not** teleport — teaching contrast), `twin_porter`, `wraith_bishop`
- **WEAKNESSES:** Walk onto it (safe); shove them onto it (safe for this card); wait the 2
- **PLAYER_COUNTERPLAY:** Walk, don’t blink; occupy the paint with a summon walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-swap-mark` (ENEMY_DISCOVERY; teach room `swap_pulpit`). Detonate does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (teleport-class landing table; do not merge with Shove Mark)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_plater`

- **NAME:** Odd Plater
- **ROLE:** protector (next hit is 0 while leftover AP is odd)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `spent_plater` (leftover AP ≥ 1, even 2 still negates) / `poise_hooder` / `tally_hooder` / `odd_holder` (walk lock). At most one leftover-AP-parity miss CORE per pack as PAIR vs those / Odd Holder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: arm then keep leftover 1. Peer: skip if they must spend that odd AP to Strike. Above: refuse if leftover is already even (charge would not consume — Frost / Iron Skin).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.80, sr 1.10, res 1.20, init 0.85, chc 0.65. Identity is **parity miss**, weaker than Spent Plate on even leftover.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_ap_odd"`. VETERAN: skip if they must spend the odd. ELITE: Drain Courage COURT so leftover lands on 1. CHAMPION: never CORE Odd Hold on the same body (walk lock vs hit negate).
- **CORE_SPELL_POOL:** `spell-odd-plate`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-rallying-cry`
- **ELITE_SPELL_POOL:** none — do **not** add Spent Plate / Odd Hold / Tally Hood
- **SIGNATURE_MECHANICS:** Leftover AP odd (1, 3, 5, …) at impact → miss and consume. Even leftover → hit lands, charge **remains**. Does not read `CharacterStats.evasion`.
- **VARIANT_PROGRESSION:** BASE hold-1 → VETERAN skip-spend-need → ELITE drain-combo → CHAMPION no-double-odd
- **RARITY_CURVE:** Standard. +VETERAN in Odd Court.
- **SYNERGIES:** `odd_stinger` (COURT, not PAIR), `plate_warden`, `drain` extras
- **WEAKNESSES:** Hit them after they spend to even; Drain Courage onto 2; wait the turn start peel
- **PLAYER_COUNTERPLAY:** Wait for even leftover; do not dump Inferno into leftover 1
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-plate` (ENEMY_DISCOVERY). Observation is the **arm**. Even-leftover full hit does not consume and does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `mire_skipper`

- **NAME:** Mire Skipper
- **ROLE:** kiter (1-tile walk ignores mire enter-tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. CORE is Mire Skip (`spell-mire-skip`, #906). Extra room `mire_nave` — family is **not** that id. Distinct from `rime_skipper` / `glyph_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper`. Reroll if the map has no mire. At most one 1-tile-hazard-skip CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if no mire is on the intended 1-tile path. Peer: arm then step onto mire. Above: refuse length ≥ 2 paths (they still pay).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.75, init 1.25, chc 0.90. Identity is **crossing the tax you painted**, not extra MP.
- **AI_TIER_PROGRESSION:** Profile `kiter` / `flanker`. `aiHint: "skip_mire_enter_tax_one_tile"`. VETERAN: skip no-mire. ELITE: Mire Sheet then skip (COURT with a mason, not CORE Sheet). CHAMPION: never skip rime / lava / spikes with this id.
- **CORE_SPELL_POOL:** `spell-mire-skip`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-shadow-veil`
- **ELITE_SPELL_POOL:** none — do **not** add Rime Skip / Spike Skip / Ghost Step
- **SIGNATURE_MECHANICS:** Next **length-1** walk ignores mire **enter-tax**. Length ≥ 2 still pays. Rime leave-tax, glyph-tax, lava, and spikes still tick. Teleport / Swap onto mire already pays no enter-tax (Wave 3).
- **VARIANT_PROGRESSION:** BASE skip-1 → VETERAN path-check → ELITE sheet-combo → CHAMPION right-hazard
- **RARITY_CURVE:** Standard. Reroll on maps with no mire / mud occupancy.
- **SYNERGIES:** `tide_shade`, `ley_tollkeeper`, `rime_mason` (COURT — different tax)
- **WEAKNESSES:** Force a length-2 path; overwrite the cell with last-writer paint; Root
- **PLAYER_COUNTERPLAY:** Body-block the 1-tile; make them walk 2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mire-skip` (ENEMY_DISCOVERY; teach room `mire_nave`). Observation is the **arm**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (1-tile walk tax skip; wrong-hazard still ticks)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_stinger`

- **NAME:** Odd Stinger
- **ROLE:** assassin (10 + 10 iff target leftover AP is odd)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `full_stinger`. At most one leftover-AP-parity poke CORE per pack as PAIR vs those / Odd Plater.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 always. Peer: skip if leftover AP is even and Frost is better. Above: refuse leftover 0 (even — Gaunt Sting’s window).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the 10 on leftover 1/3**.
- **AI_TIER_PROGRESSION:** Profile `caster` / `berserker`. `aiHint: "bonus_if_target_leftover_ap_odd"`. VETERAN: skip even. ELITE: path to leftover 1, not leftover 2. CHAMPION: Drain Courage COURT to land leftover 1.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-odd-sting`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Target leftover AP odd → second 10. Even → 10 only. 0 is even. Distinct from Tally Sting (sum === 3, so leftover 3/0 is Tally **and** Odd — do not CORE both).
- **VARIANT_PROGRESSION:** BASE always-10 → VETERAN odd-bias → ELITE hunt-1 → CHAMPION drain-combo
- **RARITY_CURVE:** Standard. +VETERAN in Odd Court.
- **SYNERGIES:** `odd_plater` (COURT, not PAIR), `plate_warden`, `purse_turner` (can make leftover AP odd)
- **WEAKNESSES:** Spend 1 AP to even the pool; sit at 0 or 2
- **PLAYER_COUNTERPLAY:** Dump leftover AP to even; Dual Keep even leftover
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-sting` (ENEMY_DISCOVERY). Even-leftover 10 still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_verser`

- **NAME:** Summon Verser
- **ROLE:** anti-summon (pets pay +1 AP to recast last id)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Distinct from `summon_caster` (every pet **spell** +1 AP) / `summon_toller` (pet **walk** +1 AP) / `summon_gaiter` (pet walk +1 **MP**) / `verse_tallier` (hostile last id **illegal**). **Do not PAIR with Summon Cast / Summon Toll / Summon Gait / Verse Tally.** Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if no allied summon. Peer: arm if a pet will recast Inferno. Above: refuse if they will cast a new id this turn.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 1.00, res 0.85, init 1.05, chc 0.70. Identity is **taxing a second Inferno**, not extra HP on the pets.
- **AI_TIER_PROGRESSION:** Profile `summoner` / `guardian`. `aiHint: "summon_recast_last_id_ap_tax"`. VETERAN: skip no-pet / new-id. ELITE: Kennel Lock COURT so they cannot leave to recast elsewhere. CHAMPION: never CORE Summon Cast on the same body.
- **CORE_SPELL_POOL:** `spell-summon-verse`
- **ADVANCED_SPELL_POOL:** `spell-rallying-cry`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Summon Cast / Summon Toll / Pack Howl
- **SIGNATURE_MECHANICS:** First cast of any id is free of this tax. Strike / `physical_attack` is **not** a spell for this key. Player copy taxes **their** pets. Fail closed until `lastResolvedSpellId` exists on the pet.
- **VARIANT_PROGRESSION:** BASE tax-recast → VETERAN skip-new-id → ELITE kennel-combo → CHAMPION no-double-tax
- **RARITY_CURVE:** Standard. Reroll if the pack has no summoner and no living pet.
- **SYNERGIES:** `kennel_siller` (COURT, not PAIR), `null_censor`, `brood_chanter` (COURT, not PAIR)
- **WEAKNESSES:** Kill pets after one cast; Sever Tether; force them to recast Inferno
- **PLAYER_COUNTERPLAY:** Recast a different id; kill the pet; do not recast Inferno under the tax
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-verse` (ELITE observe). Later recast tax does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (pet last-id + AP tax; name-fallback drop)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `equal_gifter`

- **NAME:** Equal Gifter
- **ROLE:** healer (heal iff **target** leftover AP === leftover MP **and both ≥ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. Distinct from `poise_mender` (caster **and** target tied ≥ 1) / `tally_mender` (both leftover **sum === 3**) / `hollow_gifter` (target leftover both 0) / `gaunt_mender` (caster and target leftover both 0). **No extra door** — do not invent `equal_cantor`. At most one target-tied-≥1 heal CORE per pack as PAIR vs Tally / Poise / Gaunt / Hollow / Dry / Still / Drift / Shove / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover is 0 or they differ. Peer: Equal Gift only if leftover AP === leftover MP ≥ 1 **and** missing HP ≥ 10. Above: refuse 0=0 (Hollow / Gaunt window). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **target already matching leftover ≥ 1**. Caster leftover unread.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_leftover_ap_eq_leftover_mp_ge_1"`. **Healer CORE only.** VETERAN: skip 0 or unequal. ELITE: Tempo Invert COURT to **make** 2/0 into 0/2 (misses this) or 3/1 into 1/3 (still equal — still this). CHAMPION: Dual Keep **preserves** a 2=2 window.
- **CORE_SPELL_POOL:** `spell-equal-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow`
- **ELITE_SPELL_POOL:** none — do **not** add Poise Mend / Tally Mend / Hollow Gift / Gaunt Mend
- **SIGNATURE_MECHANICS:** Target-only tied ≥ 1. Windows 1=1, 2=2, 3=3, …. `healAmount` stays 0 on the row. Distinct from Poise (four leftover reads) and Tally (odd sum).
- **VARIANT_PROGRESSION:** BASE window-heal → VETERAN skip-wrong → ELITE invert-combo → CHAMPION keep-bank
- **RARITY_CURVE:** Standard. +ELITE when Dual Keep is already in the pack (COURT, not PAIR).
- **SYNERGIES:** `dual_keeper` (COURT, not PAIR), `bash_bruiser` (not a heal combo), `cover_squire`
- **WEAKNESSES:** Spend 1 from one pool so they differ; sit at 0/0; Cursed Wound
- **PLAYER_COUNTERPLAY:** Dump one pool; do not hold 2/2 in their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-equal-gift` (ELITE observe — **no** extra door). Fizzle still observes. Player-side HP gain sets `healUsed`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cast_toller`

- **NAME:** Cast Toller
- **ROLE:** controller (next spell +1 AP if they Struck last turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `strike_debter` (next **walk** +1 after Strike) / `spent_taxer` (next **spell** after a **walk**) / `debt_caster` (next **walk** after a **spell**) / `summon_toller` / `ley_tollkeeper`. At most one last-turn-Strike spell-tax CORE per pack as PAIR vs those / Tax Scribe.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if they spelled last turn. Peer: skip if they only walked. Above: refuse if they already sit on Quiet Hex.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.10, chc 0.80. Identity is **Strike-then-spell costs 3**, not Quiet Hex.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tax_next_spell_if_struck_last_turn"`. VETERAN: skip spelled / walked. ELITE: Goad COURT to force Strike. CHAMPION: never CORE Quiet Hex.
- **CORE_SPELL_POOL:** `spell-cast-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-goad` (Wave 3 — allowed category: taunt, COURT not CORE)
- **ELITE_SPELL_POOL:** none — do **not** add Quiet Hex / Strike Debt / Ley Toll (`mpCost > 0`)
- **SIGNATURE_MECHANICS:** Last turn `physical_attack` and no other spell → next **spell** +1 AP. Strike still costs 2. Fail closed until `struckThisTurn` exists. Not `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE tax-after-Strike → VETERAN skip-spell → ELITE goad-combo → CHAMPION no-quiet-hex
- **RARITY_CURVE:** Standard
- **SYNERGIES:** `cadence_primer`, `tax_scribe` (COURT, not PAIR), `goad_herald`, `oncoming_knight`
- **WEAKNESSES:** Spell instead of Strike the turn before; pay the 1 AP; wait 2
- **PLAYER_COUNTERPLAY:** Frost last turn, not Strike; eat the tax
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-toll` (ENEMY_DISCOVERY). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (`struckThisTurn` writer + next-spell AP tax)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_stepper`

- **NAME:** Brick Stepper
- **ROLE:** teleporter (step through an adjacent barrier)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `brick_nudger` (pushes the **barrier**) / `brick_orbiter` / `brick_cracker` / `tally_stepper` / `mist_walker`. At most one through-barrier relocate CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if no adjacent barrier or dest is unsafe. Peer: peek then Screen Bite (COURT). Above: refuse dest void / portal / occupied / lava while HP% < 40.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.20, chc 0.85. Identity is **peek-through-cover**, not a second blink.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "step_through_adjacent_barrier"`. VETERAN: skip no-barrier / unsafe dest. ELITE: Screen Bite after. CHAMPION: never skip `finalizePlayableLayout` on generate — this is a unit relocate, not a tile write.
- **CORE_SPELL_POOL:** `spell-brick-step`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-barrier` (self-door)
- **ELITE_SPELL_POOL:** none — do **not** add Phase Slip / Brick Nudge / Swap
- **SIGNATURE_MECHANICS:** Adjacent barrier cell → relocate to the cell immediately beyond (Chebyshev 2, same axis) if empty floor. Barrier **stays**. Not `isSwap`. Dest hazards tick. Does **not** write `currentView` or `walkMpSpentThisTurn`.
- **VARIANT_PROGRESSION:** BASE peek → VETERAN dest-check → ELITE bite-after → CHAMPION no-map-edit
- **RARITY_CURVE:** Standard. Reroll if the map has no barrier in Chebyshev 1 of a legal floor.
- **SYNERGIES:** `screen_biter`, `stone_castellan`, `swap_marker` (relocate is **not** teleport — teaching contrast), `cover_squire`
- **WEAKNESSES:** Occupy the far cell; destroy the barrier; stand so the only far cell is lava
- **PLAYER_COUNTERPLAY:** Body-block the far tile; Crack the wall
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-step` (ENEMY_DISCOVERY). Fizzle still observes. Landing on lava/spikes is environmental (`recordInBattleChallengeDamage` while `inBattleRef`).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (adjacent-barrier dest; occupancy; not a tile write)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_banker`

- **NAME:** Watch Banker
- **ROLE:** sniper (overwatch snap banks 1 leftover AP on the walker)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `watch_sipper` (steals) / `watch_almer` (grants **now**) / `watch_feer` (debits without transfer) / `watch_lender` / `glass_sniper`. **Do not PAIR with Watch Alms / Watch Sip / Watch Fee / Glass Sniper.** At most one overwatch-bank CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: skip if no snap is likely. Peer: skip if Dual Keep already covers them. Above: arm a damage-0 enter-1 snap that only banks if no overwatch is armed.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 0.90, res 0.75, init 1.20, chc 1.00. Identity is **Dual Keep-lite on a snap**, not extra Far Watch damage.
- **AI_TIER_PROGRESSION:** Profile `kiter` / `caster`. `aiHint: "overwatch_snap_bank_walker_ap"`. VETERAN: skip no-snap / Dual Keep. ELITE: Far Watch / Hold Ground as the damage snap (COURT). CHAMPION: never double-bank with Dual Keep (Dual Keep wins).
- **CORE_SPELL_POOL:** `spell-watch-bank`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Watch Sip / Watch Alms / Dual Keep as CORE
- **SIGNATURE_MECHANICS:** Next hostile who **walks** into the overwatch band banks 1 leftover AP to next turn start (cap 1, AP only). Push/pull into the band **does** snap. Teleport / Swap **does not**. Visible 2-turn stance.
- **VARIANT_PROGRESSION:** BASE bank-snap → VETERAN skip-dualkeep → ELITE damage-snap COURT → CHAMPION no-double-bank
- **RARITY_CURVE:** Standard. +ELITE with `glass_sniper` as COURT (not PAIR).
- **SYNERGIES:** `dim_optic`, `cast_toller`, `cover_squire`
- **WEAKNESSES:** Blink in; send a summon; sit still; Dual Keep already banks
- **PLAYER_COUNTERPLAY:** Don’t walk the band; blink; already Dual Keep
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-bank` (ELITE observe). Observation is the **arm**. Snap does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap + leftover-AP bank; Dual Keep precedence)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tied_gaiter`

- **NAME:** Tied Gaiter
- **ROLE:** assassin (10 + 10 iff leftover AP **and** leftover MP are both exactly 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `pair_gaiter` (leftover **MP** exactly 2) / `pair_purser` (leftover **AP** exactly 2) / `poise_stinger` (tied ≥ 1, including 3/3) / `tally_stinger` / `equal_gifter` (heal on any tied ≥ 1). At most one exact-2/2 poke CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 always. Peer: skip if either leftover is not 2 and Frost is better. Above: refuse 1/1 and 3/3 (Poise Sting’s window).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **exact 2/2**, not any-tie.
- **AI_TIER_PROGRESSION:** Profile `caster` / `kiter`. `aiHint: "bonus_if_leftover_ap_eq_leftover_mp_eq_2"`. VETERAN: skip wrong leftover. ELITE: Drain / Walk Toll COURT to **leave** 2/2. CHAMPION: never CORE Equal Gift (heal vs poke on the same window).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-tied-gait`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Both leftover exactly 2. 1/1 / 3/3 / 2/1 / 0/0 → 10 only. Dual Keep 2/2 **opens** this and Poise.
- **VARIANT_PROGRESSION:** BASE always-10 → VETERAN 2/2-bias → ELITE leave-2/2 → CHAMPION no-heal-CORE
- **RARITY_CURVE:** Standard. +ELITE with Dual Keep COURT (not PAIR with Equal Gifter).
- **SYNERGIES:** `portal_cutter`, `void_mirror`, `purse_scribe`
- **WEAKNESSES:** Spend 1 from either pool; sit at 0/0 or 3/3
- **PLAYER_COUNTERPLAY:** Dump 1 AP or 1 MP; do not camp Dual Keep 2/2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tied-gait` (ELITE observe). Wrong leftover still observes (10 only).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `portal_cutter`

- **NAME:** Portal Cutter
- **ROLE:** assassin (10 + 10 if target is Chebyshev ≤ 2 from a world portal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `hazard_cutter` (painted hazard; **excludes** world portals) / `axis_cutter` / `escort_cutter` / `void_reeler`. At most one portal-occupancy poke CORE per pack as PAIR vs those / Null Censor.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 always. Peer: skip if they stand farther than 2 from every world portal and Frost is better. Above: refuse Twin Gate pads (they are **not** `map.portals`).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.20, chc 1.00. Identity is **threshold poke**, not Hazard Cut.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_near_world_portal"`. VETERAN: skip far. ELITE: Void Reel COURT to pull them **toward** a portal (the 1-step must still not **land on** the portal). CHAMPION: never treat Twin Gate pads as portals; never skip portal lock-while-hostile.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-portal-cut`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none — do **not** add Hazard Cut / Void Reel as CORE
- **SIGNATURE_MECHANICS:** Reads `map.portals` occupancy. Twin Gate pads do **not** trigger. World portals stay impassable.
- **VARIANT_PROGRESSION:** BASE always-10 → VETERAN threshold-bias → ELITE reel-toward → CHAMPION no-twin-gate
- **RARITY_CURVE:** Standard. Reroll in rooms with no `map.portals` cell. +ELITE on portal-threshold maps.
- **SYNERGIES:** `tied_gaiter`, `void_mirror`, `void_reeler` (COURT, not PAIR)
- **WEAKNESSES:** Stand 3+ from every portal; fight in rooms without world portals; blink off the threshold
- **PLAYER_COUNTERPLAY:** Don’t camp the pad; pull the fight to center
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-portal-cut` (ELITE observe). Far-from-portal 10 still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`map.portals` occupancy; Twin Gate exclusion)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `shove_gifter`

- **NAME:** Shove Gifter
- **ROLE:** healer (heal iff **this caster** force-moved the target this turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. Distinct from `drift_gifter` (**anyone’s** force-move) / `heave_mender` (**both** force-moved) / `equal_gifter` / `tally_mender`. At most one caster-authored force-heal CORE per pack as PAIR vs those / Pale. Skip if the pack has no force tool the **gifter** can author — this body needs bash / attract / rescue on **its own kit** as ADVANCED, not a sibling’s bash as CORE.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if this caster did not force-move the target. Peer: Shove Gift only if missing HP ≥ 10 **and** the authored flag is set. Above: refuse walk / Swap / Tally Step / Brick Step (those do **not** count).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.15, chc 0.70. Identity is **10 after your own shove**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_caster_force_moved_target"`. **Healer CORE only.** VETERAN: skip if this caster did not author the move. ELITE: Shoulder Bash / File Slide as ADVANCED then Gift. CHAMPION: never treat walk as force-move; never CORE Drift Gift.
- **CORE_SPELL_POOL:** `spell-shove-gift`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-bash` / `physical_attack` (authored shove — existing push, not a new formula)
- **RARE_SPELL_POOL:** `spell-iron-skin`
- **ELITE_SPELL_POOL:** none — do **not** add Drift Gift / Heave Mend / Equal Gift
- **SIGNATURE_MECHANICS:** Caster-authored shove / pull / slide / self-recoil only. `healAmount` stays 0 on the row. Fail closed until a **caster-authored** force-move bit exists (stricter than `forcedMovedThisTurn`).
- **VARIANT_PROGRESSION:** BASE authored-heal → VETERAN skip-unauthored → ELITE bash-then-gift → CHAMPION no-walk-count
- **RARITY_CURVE:** Standard. +ELITE in Equal Shove pack (needs `bash_bruiser` as a **different** body — the Gifter still must author **its** shove, so the pack bash is for the **player**, the Gifter’s ADVANCED bash is for the **ally**).
- **SYNERGIES:** `bash_bruiser` (player-push COURT), `coil_arbiter`, `hook_chaplain` (rescue is force — COURT)
- **WEAKNESSES:** Do not let the healer be the one who shoves the wounded ally; Cursed Wound; kill the healer
- **PLAYER_COUNTERPLAY:** Peel the Gifter off the wounded; don’t stand where they can bash their ally into you
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shove-gift` (ENEMY_DISCOVERY — **no** extra door). Fizzle still observes. Player-side HP gain sets `healUsed`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (caster-authored force-move bit + existing heal helper)
- **STATUS:** PROPOSED

---

## 5. Identity matrix (Wave 16 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| tally_mender | leftover-sum===3 heal, defense, ungated heal as ADVANCED only | Poise/Equal/Gaunt/Hollow as CORE, isSummon, inferno |
| cadence_primer | remaining `0→1`, damage (frost), debuff, isMark | Floor/Lag/Crack as CORE, heal, isSummon |
| dec_prelate | isSummon (`decspan`), defense, isMark | turret/wolf/archer/ninespan/tallypost, heal |
| purse_turner | hostile leftover invert, damage (frost), debuff | Tempo Invert / Bar Cross as CORE, heal, isSwap |
| tally_hooder | leftover-sum===3 miss, defense, physical | Poise Hood / Spent / Odd Plate as CORE, heal, isSummon |
| tally_stinger | leftover-sum===3 poke, physical, isMark, venom | Poise/Gaunt/Odd/Tied Sting as CORE, heal, isSummon |
| tally_stepper | leftover-sum===3 relocate, damage (frost), veil | isSwap, Poise/Gaunt/Home Step as CORE, heal |
| tally_siller | leftover-sum===3 start-tax paint, damage (frost), isMark | start-any-leftover (Wake), Poise/Gaunt Sill as CORE, heal |
| tally_holder | leftover-sum===3 walk lock, physical, debuff | Must Tally / Poise Hold / Root as CORE, heal, isSummon |
| tally_lender | leftover-sum===3 +1/+1 cash-out, buff, frost | Poise/Gaunt Lend / Haste as CORE, heal, isSummon |
| tally_sipper | leftover-sum===3 AP steal, physical, debuff | Poise/Bare/Watch Sip / Soul Sip as CORE, heal |
| tally_prelate | isSummon (`tallypost`), physical, isMark | dummy/poisepost/gauntpost/decspan, heal, turret |
| tally_bouncer | leftover-sum===3 bounce, frost, inferno-if-clustered | Chain Lightning as identity, heal, isSummon |
| must_tallier | leftover-sum===3 last-AP tool lock, physical, debuff | Must Poise / Tally Hold / Hex of Silence as CORE, heal |
| verse_tallier | leftover-sum===3 last-id lock, frost, debuff | Verse Poise / Last Mute / Summon Verse as CORE, heal |
| rank_warder | next-walk same-rank, physical, debuff | Rank Lock / Pack Rank / Knight/Orth/Diag Stride as CORE, heal |
| penta_oather | next-spell exact Chebyshev 5, frost, far poke | Quad/Tri/Mid/Long/Hexa Oath as CORE, heal, isSummon |
| spike_reeler | attract toward spike occupancy, frost, debuff | Pit/Void/Brick Reel / Hazard Cut as CORE, heal |
| screen_biter | Bresenham-blocked bonus, physical, barrier | Axis/Wall/Foe Bite / Gate Sight as CORE, heal |
| swap_marker | teleport-landing paint, frost, isMark | Shove/Ingress/Dwell/Wake Mark as CORE, heal, isSwap-as-identity |
| odd_plater | leftover-AP-odd miss, defense, physical | Spent Plate / Odd Hold / Tally Hood as CORE, heal, evasion field |
| mire_skipper | 1-tile mire enter-tax skip, physical, frost | Rime/Glyph/Spike/Lava/Pit Skip as CORE, heal |
| odd_stinger | leftover-AP-odd poke, physical, venom | Tally/Poise/Gaunt/Full Sting as CORE, heal |
| summon_verser | pet recast-last-id AP tax, rally, frost | Summon Cast/Toll/Gait / Verse Tally as CORE, heal |
| equal_gifter | target leftover AP===MP≥1 heal, ungated heal as ADVANCED | Poise/Tally/Gaunt/Hollow as CORE, isSummon, inferno |
| cast_toller | next-spell +1 if Struck last turn, frost, goad as RARE | Quiet Hex / Strike Debt / Ley Toll as CORE, heal |
| brick_stepper | through-barrier relocate, physical, barrier | Brick Nudge/Orbit/Crack / Phase Slip / Swap as CORE, heal |
| watch_banker | overwatch snap bank leftover AP, frost, debuff | Watch Sip/Alms/Fee / Dual Keep as CORE, heal |
| tied_gaiter | leftover exactly 2/2 poke, physical, venom | Pair Gait/Purse / Poise Sting / Equal Gift as CORE, heal |
| portal_cutter | near-`map.portals` poke, physical, venom | Hazard Cut / Twin Gate pads / Void Reel as CORE, heal |
| shove_gifter | caster-authored force-move heal, ungated heal as ADVANCED, physical bash | Drift/Heave/Equal/Tally as CORE, walk-as-force, isSummon |

Wave 1–15 matrices in those docs still apply to those ids.

---

## 6. Role coverage after Wave 16

Every requested archetype still has a Wave 1 owner. Wave 16 does not invent a 21st role word. It adds **verbs**.

| Archetype | Wave 16 extra (new verb) |
| :--- | :--- |
| bruiser | `screen_biter` (Bresenham-blocked bonus) |
| sniper | `watch_banker` (snap banks leftover AP) |
| kiter | `mire_skipper` (1-tile mire skip) |
| assassin | `tally_stinger`, `odd_stinger`, `tied_gaiter`, `portal_cutter` |
| healer | `tally_mender` (both-body sum===3), `equal_gifter` (target tied ≥ 1), `shove_gifter` (caster-authored shove) |
| buffer | `tally_lender` (cash-out +1/+1) |
| debuffer | `tally_sipper` (steal leftover AP on sum===3), `verse_tallier` (last-id until sum===3) |
| summoner | `dec_prelate` (2×5 = 10), `tally_prelate` (end-turn sum===3 post) |
| controller | `cadence_primer`, `purse_turner`, `tally_holder`, `must_tallier`, `rank_warder`, `penta_oather`, `cast_toller` |
| tank | — (Odd Plater is protector) |
| protector | `tally_hooder`, `odd_plater` |
| artillery | `tally_bouncer` |
| kamikaze | — |
| teleporter | `tally_stepper`, `brick_stepper` |
| displacement | `spike_reeler` |
| hazard creator | `tally_siller`, `swap_marker` |
| status specialist | — |
| anti-summon | `summon_verser` |
| anti-ranged | — |
| anti-melee | — |

---

## 7. Implementation notes (not this PR)

Do **not** implement production code from this document.

**Live defects that remain implementation prerequisites, not new families:**

1. Family HP must survive battle start (`WX` 11970–11974 currently overwrites with `calcEnemyMaxHp`).
2. `buildEnemyKit` must receive a **number** zone (`WX` 11920 currently passes `{ name, minLevel, maxLevel }` → NaN → zone 0).
3. Family `res` / `sp` must match `getEnemyBaseStats` integer bands (`spawnPolicy.ts` still writes 0.05–0.75 fractions).
4. `inferArchetype` must read `aiProfile`, not `healAmount` / `family.includes("berserk")`.
5. `inferSummonArchetype` must accept `decspan` / `tallypost` (and still-missing `ninespan` / `poisepost` / `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) as empty-kit stationary posts, not hunter fallback.
6. Leftover AP / leftover MP / `walkMpSpentThisTurn` / `forcedMovedThisTurn` / caster-authored force-move / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / next-walk dest writers.
7. Dec Span occupy-weight (live cap is 2; skip until remaining ≥ 10). Nine Span still skip until remaining ≥ 9.
8. `applyAttract` spike-occupancy dest + through-barrier relocate for Brick Step.
9. Cadence Prime remaining `0→1`. Cadence Floor is **already owned** by SDE #906 — do not ship a second id. Cadence Rise (`1→2`) is SDE Wave 15 — Wave 17.

**Wave 17 leftover (do not fill today):** SDE Wave 15 unique CORE (`spell-file-stride`, `spell-hexa-oath`, `spell-lava-reel`, `spell-file-bite`, `spell-strike-mark`, `spell-dry-plate`, `spell-shock-skip`, `spell-even-sting`, `spell-summon-rank`, `spell-lean-gift`, `spell-cadence-rise`, `spell-still-toll`, `spell-brick-brace`, `spell-watch-root`, `spell-odd-gait`, `spell-spike-cut`, `spell-summon-plate`, `spell-pack-diag`, `spell-far-fold` — except Pack Diag / Far Fold unless a boss sheet claims them). Extra rooms stay `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave`. Extra doors stay `diag_precentor` / `far_fold_regent`. Same-day 2026-10-24 SPELL_PROPOSALS / SDE, if any, stay Wave 17. Hold mid-RAF splice, fourth `mpCost` walk snipe, player-owned Hex of Silence, sixth echo, eleven-cell occupy, remaining zeros → 1 as a **second** Cadence Prime (`spell-cadence-arm` stays tombstoned). Facing writer / leftover AP/MP / `walkMpSpentThisTurn` / vacated-cell write / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / Triple/Quad/Penta/Six/Sept/Oct/Nine/Dec cap gates / Dummy Post `dummypost` / Quad `quadspan` / Penta `pentaspan` / Sept `septspan` / Drift `driftpost` / Six `sixspan` / Lean `leanpost` / Oct `octspan` / Gaunt Post `gauntpost` / Poise Post `poisepost` / Nine Span `ninespan` / Tally Post `tallypost` / Dec Span `decspan` / family HP surviving battle start / kit zone as a number remain implementation prerequisites, not new families.

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not ship `spell-parched-mend` beside Dry Gait.

---

## 8. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `tally_mender` | healer | `spell-tally-mend` | `tally_cantor` |
| `cadence_primer` | controller | `spell-cadence-prime` | `prime_precentor` |
| `dec_prelate` | summoner | `spell-dec-span` | `span_dec` |
| `purse_turner` | controller | `spell-purse-turn` | — |
| `tally_hooder` | protector | `spell-tally-hood` | — |
| `tally_stinger` | assassin | `spell-tally-sting` | — |
| `tally_stepper` | teleporter | `spell-tally-step` | — |
| `tally_siller` | hazard creator | `spell-tally-sill` | — |
| `tally_holder` | controller | `spell-tally-hold` | — |
| `tally_lender` | buffer | `spell-tally-lend` | — |
| `tally_sipper` | debuffer | `spell-tally-sip` | — |
| `tally_prelate` | summoner | `spell-tally-post` | — (`summonAI: "tallypost"`) |
| `tally_bouncer` | artillery | `spell-tally-bounce` | — |
| `must_tallier` | controller | `spell-must-tally` | — |
| `verse_tallier` | debuffer | `spell-verse-tally` | — |
| `rank_warder` | controller | `spell-rank-stride` | `rank_gallery` |
| `penta_oather` | controller | `spell-penta-oath` | `penta_nave` |
| `spike_reeler` | displacement | `spell-spike-reel` | `spike_aisle` |
| `screen_biter` | bruiser | `spell-screen-bite` | — |
| `swap_marker` | hazard creator | `spell-swap-mark` | `swap_pulpit` |
| `odd_plater` | protector | `spell-odd-plate` | — |
| `mire_skipper` | kiter | `spell-mire-skip` | `mire_nave` |
| `odd_stinger` | assassin | `spell-odd-sting` | — |
| `summon_verser` | anti-summon | `spell-summon-verse` | — |
| `equal_gifter` | healer | `spell-equal-gift` | — |
| `cast_toller` | controller | `spell-cast-toll` | — |
| `brick_stepper` | teleporter | `spell-brick-step` | — |
| `watch_banker` | sniper | `spell-watch-bank` | — |
| `tied_gaiter` | assassin | `spell-tied-gait` | — |
| `portal_cutter` | assassin | `spell-portal-cut` | — |
| `shove_gifter` | healer | `spell-shove-gift` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Prime / Pack Rank / Rank Fold stay kit-only.

---

## 9. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of Waves 1–15 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `cadence_floorer` / `spell-cadence-arm` / `spell-parched-mend` / `wave16:` colliding ids.
- No restamp of `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` / `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` as family ids.

All **31** sheets: **STATUS: PROPOSED**.

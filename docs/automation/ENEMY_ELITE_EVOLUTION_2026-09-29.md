# Enemy and Elite Evolution Design — Wave 12

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-29  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Twelfth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 11 verbs** (`SPELL_PROPOSALS_2026-09-28.md`, open PR #726): heal-if-**both force-moved**, leftover-**AP and MP** bank, seven-cell stretched-plus occupy, hostile remaining-CD **floor÷2**, next hit from Chebyshev **exactly 2** → 0, leftover **AP ≥ 1 and MP ≥ 1** poke, caster lands adjacent to a **force-moved** ally, occupant cannot be a **relocate dest**, cannot walk until **force-moved**, +1 AP to a force-moved ally, steal leftover AP iff they were force-moved, post detonates on **relocate landing** (walk safe), bounce to another force-moved hostile, remaining walks follow **last forced-move dir**, last-id illegal until they **walk**. Plus **SDE Wave 10 unique CORE** verbs Wave 11 held (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`, open PR #679) because they still have no CORE owner. Bosses stay on the existing catalog. Court Dual / Pack Close / Mid Fold stay **kit-only / ENEMY_ONLY / BOSS_ONLY** — not world-pack CORE.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 11

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Wave 11 closed as docs in the 2026-09-28 pass (PR #752). SPELL_PROPOSALS Wave 11 (PR #726) stamped three holes Wave 11 **held** (heal-if-**both force-moved**; leftover-**AP and MP** bank; seven-cell occupy) plus twelve siblings. SDE Wave 11 (PR #747) then stamped a **new** unique catalog (`spell-diag-stride` … `spell-adj-fold`). Same-day SPELL_PROPOSALS Wave 12 opened as a sibling cron during this run (PR #787, `SPELL_PROPOSALS_2026-09-29.md`: Parched Mend … Court Imprint, including Six Span). This pass still consumes **#726** plus leftover **#679** unique CORE. **Wave 13** consumes #787. Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥11 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 11 claim | 2026-09-29 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–11 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy Post counts as **1**. Triple Span counts as **3**. Quad Span counts as **4**. Penta Span counts as **5**. Sept Span counts as **7** — skip until remaining cap ≥ 7 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Heave Mend / Bar Mend **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / `twinspan` / `spark` / `triplespan` / `dummypost` / `quadspan` / `pentaspan` / **`septspan`** / **`driftpost`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6–11 facing families still fail closed until a battle-walk writer exists. Wave 12 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 12 CORE rows stay `mpCost: 0`. Dual Keep / Drift Sip rewrite **current AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Heave Step / Heave Bounce are occupancy dests, **not** `isSwap`. Cinder Reel is the **fifth** dest flavor of `applyAttract` (File Reel, Ally Reel, Foe Reel, Paint Reel, then hazard) |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` | Absent | Wave 10 `shove_mender`, Wave 11 `shove_stinger`, and Wave 12 heave/drift families fail closed until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / heave-step / conveyor writer sets it. Walk MP must **not** set it |
| `lastForcedMoveDir` | Absent | Wave 12 `must_drifter` fails closed until those same writers also stamp an 8-dir `{dx,dy}`. Walk MP must **not** set it |
| `lastResolvedSpellId` | Absent | Wave 10 `last_muter`, Wave 11 `verse_taxer`, and Wave 12 `verse_pacer` fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` still waits. Wave 12 does not add a Struck family |
| Both-force heal / leftover-AP+MP bank / 7-cell occupy / CD floor÷2 / mid hood / ready sting / heave step / drift sill / drift hold / drift lend / drift sip / drift post / heave bounce / must-drift / verse pace | Still absent in live catalog | Wave 12 primary opportunity (SPELL_PROPOSALS Wave 11) |
| One next walk Chebyshev ≤ 1 / cannot-Strike-until-spell / next-spell range ≥ 3 / pull toward hazard / adj-ally bite / cell-enter detonate / off-turn hit 0 / 1-tile spike walk / leftover-AP-0 +RES / allied summons ignore force / heal-if-spell / one CD does not tick / next-spell +1 AP if camped / grow barrier 1 / overwatch costs walker 1 AP / leftover-AP **exactly 1** poke / bonus vs `isLeader` | Still absent as CORE identities | Wave 12 secondary opportunity (SDE Wave 10 unique CORE) |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Off Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Ingress Mark is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Cinder Reel is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Dual Keep is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Still Tax is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Off Plate is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 12 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 12 family pass consumes **#726** verbs plus leftover **#679** unique CORE. **Wave 13** consumes SPELL_PROPOSALS Wave 12 (PR #787: `spell-parched-mend`, `spell-cadence-imprint`, `spell-six-span`, `spell-odd-hood`, `spell-lean-sting`, `spell-parched-step`, `spell-parched-sill`, `spell-dry-hold`, `spell-lean-lend`, `spell-parched-sip`, `spell-lean-post`, `spell-parched-bounce`, `spell-must-lean`, `spell-verse-lean`, `spell-lean-hold`, `spell-court-imprint`) and any SDE Wave 11 unique CORE that still has no CORE owner. This run does not mint colliding `wave12:` spell ids.

SDE Wave 11 unique CORE (`spell-diag-stride`, `spell-mid-oath`, `spell-void-reel`, `spell-foe-bite`, `spell-dwell-mark`, `spell-own-plate`, `spell-cinder-skip`, `spell-full-plate`, `spell-summon-toll`, `spell-still-mend`, `spell-cadence-rest`, `spell-spent-tax`, `spell-brick-crack`, `spell-watch-lend`, `spell-pair-purse`, `spell-escort-cut`, `spell-dry-mend`, `spell-pack-long`, `spell-adj-fold`) stay **G≥11 extras** on older families this pass. Dedicated families for those verbs wait for Wave 13 if they still have no CORE owner. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` stay never-owned unless a later boss sheet claims them.

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

**Stationary-post / multi-body cap (extend Wave 11):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post counts as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Sept Span counts as **seven**. Drift Post counts as **one**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, or Drift Post body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/seven-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, **or** a Sept Span stretched plus, never two of those. Dummy Post and Drift Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system.

**Summon-cap prerequisite (extend Wave 11):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Sept Span is illegal until remaining cap ≥ 7. Dummy Post / Drift Post are legal at remaining ≥ 1. Do not spawn `sept_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend prerequisite (extend Wave 11):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and, for Ghost Step, the vacated cell) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Force-move prerequisite (extend Wave 11):** Shove Mend / Shove Sting / Heave Mend / Heave Step / Drift Hold peel / Drift Lend / Drift Sip / Drift Post detonate / Heave Bounce / Must Drift **fail closed** until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / heave-step / conveyor resolver writes `forcedMovedThisTurn` on the moved body **and** `lastForcedMoveDir` `{dx,dy}` (8-dir, including diagonal shove). Walk MP and summon-control walks must **not** set either field.

**Last-id prerequisite (extend Wave 11):** Last Mute / Verse Tax / Verse Pace fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Struck prerequisite (unchanged):** Clash Mend still fails closed until a successful Strike / `physical_attack` / `isPhysical: true` resolve writes `struckThisTurn` on the **striker**. Walk / force-move / DoT / lava / spikes must **not** set it. This pass adds **zero** Struck cards.

**Leftover-MP bank prerequisite (extend Wave 11):** Stride Keep (and kit-only Court Keep) fail closed until end-of-turn leftover MP can snapshot and pay at **that unit’s next turn start**. Dual Keep uses the **same next-start pay** for leftover **AP cap 2 and leftover MP cap 2**. Do **not** splice the current actor. Do not share Purse Keep’s leftover-**AP-only** table as Dual Keep’s writer — Dual Keep is one combined snapshot.

**Facing prerequisite (unchanged):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. Shove Face writes facing from this push only. This pass adds **zero** facing cards.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Heave Mend MULTI child `heave_cantor` — first child wins vs `heave_mender` observe. Dual Keep MULTI child `dual_bursar` — first child wins vs `dual_keeper` observe. Sept Span MULTI child `span_sept` — first child wins vs `sept_prelate` observe. Cadence Halve MULTI child `halve_precentor` — first child wins vs `cadence_halver` observe. Court Dual stays `court_dual_regent` kit-only. Inch Stride MULTI child `inch_gallery` — first child wins vs `inch_warder` observe. Pack Close stays `close_precentor` CHAMPION kit. Mid Fold stays `mid_fold_regent` kit-only. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`.

---

## 2. Why Wave 12 exists (gaps Waves 1–11 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + three leftover SDE Wave 6 unique CORE verbs. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE.

SPELL_PROPOSALS Wave 11 (#726) then stamped the holes Wave 11 **held**. A G≥11 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 10 unique CORE still had no CORE owner after Wave 11 (Wave 11 held them as G≥10 stamps). Seventeen of those verbs fill holes Wave 11 tactical does not: one next walk Chebyshev ≤ 1, cannot-Strike-until-spell, next-spell range ≥ 3, pull toward **hazard**, adjacent-**ally** bite, cell-**enter** detonate, next **off-turn** hit 0, 1-tile **spike** walk, leftover-AP-0 +RES, allied summons ignore force, heal-if-**spell**, one remaining CD **does not tick**, next-spell +1 AP if **camped**, grow adjacent **barrier**, overwatch snap costs walker **1 AP**, leftover-AP **exactly 1** poke, bonus vs `isLeader`. Pack Close and Mid Fold stay closed.

| Unused Wave 11 / SDE Wave 10 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-heave-mend` (heal 8 iff **caster and target** both force-moved) | `both_mender` (both **walked**); `shove_mender` (target only); `clash_mender` (Struck); `bar_mender` (this pass, resolved a **spell**) | Heal paid in **two bodies that already accepted a shove**. Walk is 0 HP. Extra door is `heave_cantor` — family is **`heave_mender`**. |
| `spell-dual-keep` (bank leftover **AP and MP**, cap 2/2, next turn start, once/battle) | `purse_keeper` (leftover **AP**); `stride_keeper` (leftover **MP**); Court Dual (mass, never owned) | Leave **both** wallets unspent so next turn kites **and** casts. Extra door is `dual_bursar` — family is **`dual_keeper`**. Not a queue splice. |
| `spell-sept-span` (stretched plus occupy, counts as **seven**) | `penta_prelate` (plus = 5); `quad_prelate` (2×2 = 4); `dummy_prelate` (1 HP, 1 cell) | Seven tiles, one body, empty kit. Extra door is `span_sept` — family is **`sept_prelate`**. Skip until remaining cap ≥ 7. |
| `spell-cadence-halve` (`floor(remaining/2)` on one hostile; 0 stays 0) | `cadence_trimmer` (**−1**); `cadence_stretcher` (**×2**); `cadence_cracker` (highest one → 0); `cadence_pinner` (this pass, **freeze one**) | Compress a 3-CD Inferno to 1. Extra door is `halve_precentor` — family is **`cadence_halver`**. |
| `spell-mid-hood` (next applied hit from Chebyshev **exactly 2** → 0) | `near_hooder` (**≤ 1**); `far_hooder` (**≥ 3**); `sidestep_warder` (next hit **any** range) | Stand on 1 or 3, or waste the 2-step poke. Does not eat DoT. |
| `spell-ready-sting` (10 + 8 iff leftover **AP ≥ 1 and MP ≥ 1**) | `dry_stinger` (leftover **AP = 0**); `damp_stinger` (leftover **MP ≥ 2**); `full_purser` (leftover **AP ≥ 3**); `lone_purser` (this pass, leftover AP **exactly 1**) | Punish the dual bank. Spend one wallet to 0. |
| `spell-heave-step` (caster lands on a free Chebyshev-1 of a **force-moved** ally) | `home_stepper` (**caster** → ally, no force gate); `ally_stepper` (**they** land next to caster); `hook_chaplain` (pulls the ally) | Join the body that already moved. Relocate, not `isSwap`. |
| `spell-drift-sill` (occupant cannot be a **relocate dest**; walk onto is legal) | `quiet_siller` (occupant cannot **Strike**); `cast_siller` (occupant cannot **non-physical**); `body_siller` (**primary** cannot leave) | The **tile** rejects shove/swap landings. Walk through. |
| `spell-drift-hold` (cannot spend walk MP until **force-moved**) | `boot_holder` (cannot walk until **Strike**); `hold_knight` (cannot Strike until **walk**); `gait_sealer` (cannot walk; spells legal) | Need a partner shove, or sit 2 turns. Strike does **not** peel. |
| `spell-drift-lend` (+1 current AP to an ally who **was force-moved**) | `spent_lender` (+1 **MP** if they **walked**); `boot_lender` (**unmoved**); `tempo_precentor` (ungated AP) | Fund the tool after they accepted a shove. |
| `spell-drift-sip` (steal 1 leftover AP iff they **were force-moved**) | `gait_sipper` (steal **MP** iff they **walked**); `ledger_siphon` (ungated AP); Drain Courage (immediate −1 + drain) | Tax the shove they already took. Stand is 0. |
| `spell-drift-post` (empty-kit body; **relocate landing** deals 10 and it dies; **walk onto is safe**) | `dummy_prelate` (taunt, 1 HP); `bait_prelate` (eat); `ingress_marker` (this pass, **walk enter**) | Paint a shove dest. Walking past is legal. Counts as **1**. |
| `spell-heave-bounce` (12 to primary; bounce 1 to nearest **other** force-moved hostile) | Chain Lightning (nearest **any**); `ricochet_vicar` (predicate bounce); `split_fanger` (different split) | Second 12 needs a second force flag. Missing flag → 12 only. |
| `spell-must-drift` (remaining walks follow `lastForcedMoveDir`) | `must_stepper` (Chebyshev **exactly 1**, any dir); `must_spanner` (Manhattan **2**); `inch_warder` (this pass, **one** next ≤ 1) | They got shoved east, so leftover MP continues east — or they stop. Needs `lastForcedMoveDir`. |
| `spell-verse-pace` (last resolved id **illegal until they walk**) | `last_muter` (that id illegal for **duration**); `verse_taxer` (legal but **+1 AP**); `first_verser` (must cast **this** id first) | Recast Inferno only after a step. Forced-move does **not** peel. |
| `spell-inch-stride` (**one** next walk Chebyshev ≤ 1) | `pair_strider` (**exactly** Manhattan 2); `must_spanner` (**all** remaining this turn Manhattan 2); `must_stepper` (all remaining Chebyshev 1) | Extra door is `inch_gallery` — family is **`inch_warder`**. Last writer vs Must Step. |
| `spell-rite-first` (cannot Strike until they resolve a **spell**) | `hold_knight` (cannot Strike until **walk**); `first_verser` (must cast **this** id first); `tool_holder` (cannot **tool** until Strike) | Encounter room `rite_nave` is a teach — family is **`rite_holder`**. |
| `spell-long-oath` (next spell must have range **≥ 3**) | `near_oather` (next spell range **≤ 1**); `unit_oather` (unit **class**); `ground_oather` (ground only); `dim_optic` (**cuts** range) | Frost at 1 fizzles. Strike stays legal. Extra room `reach_nave` is a teach — family is **`long_oather`**. |
| `spell-cinder-reel` (pull 1 toward nearest **hazard**) | `paint_reeler` (toward **paint**); `foe_reeler` (toward a **body**); `file_reeler` (along file toward **caster**) | Fifth `applyAttract` dest flavor. Extra room `ash_aisle` is a teach — family is **`cinder_reeler`**. |
| `spell-side-bite` (10 + 8 if caster has adj **ally**) | `lone_stinger` (0 adj **hostiles-to-target**); `nook_biter` (exactly 1 **block**); `field_biter` (0 blocks) | Fight in the hug. Isolated caster is 10 only. |
| `spell-ingress-mark` (cell paint; detonate on **enter**) | `stride_marker` (detonate on **leave**); `gait_wicker` (**unit** mark); `exit_stinger` (first **leave**); `enter_mender` (enter **heal**) | Stand at paint time is free. Walk-on / shove-on pays 10. |
| `spell-off-plate` (next **off-turn** damaging hit → 0) | `far_hooder` (hit from ≥ 3 → 0); `morrow_warden` (absorb next **own** turn); `sidestep_warder` (next hit **any** turn); `tick_plater` (next **DoT tick**) | Hit them **on their turn**. Slow does **not** consume. |
| `spell-spike-skip` (next **1-tile** walk treats spikes as floor) | `lava_skipper` (**lava**); `pit_skipper` (**pit**); Gap Ward (skips **overwatch** on a 1-tile walk) | Does not ignore lava / pit / void / barriers. Maps stay solvable for the **player**. |
| `spell-tapped-plate` (0 leftover **AP** → +RES) | `still_plater` (0 leftover **MP**); `empty_plater` (Wave 8 leftover-AP RES gate); `dry_stinger` (0 leftover AP **damage**) | Spend the last AP, then plate. |
| `spell-summon-brace` (allied summons ignore forced move, 2 turns) | `kennel_siller` (**summons** cannot leave); `body_siller` (**primary** cannot leave); Grounded Lock (unit no-swap) | Pets stay parked through a bash. Player copy needs a living summon. |
| `spell-bar-mend` (heal 8 iff **target resolved a spell**) | `clash_mender` (Struck); `chase_mender` (walked); `heave_mender` (this pass, both force-moved); `pale_cantor` (unconditional) | Healer CORE only. Strike does **not** count. |
| `spell-cadence-pin` (one remaining CD **does not tick**) | `cadence_staller` (**+1** all); `cadence_halver` (this pass, **÷2**); `cadence_flusher` (all → **0**) | Freeze Inferno at 3. Extra room `pin_nave` is a teach — family is **`cadence_pinner`**. |
| `spell-still-tax` (next spell +1 AP if they **camped last turn**) | `gait_taxer` (next spell +1 if they **walked**); Quiet Hex (always +1); `walk_toller` (+1 **walk MP**) | Cast after walking last turn, or Strike. |
| `spell-brick-sprout` (grow adjacent **barrier** 1 cell) | `brick_shifter` (**slides**); `brick_wiper` (**erases**); Barrier (**paints** a new wall from range) | Lengthen a file. Does not edit `mapGen.ts`. |
| `spell-watch-fee` (next **overwatch snap** also costs the walker 1 AP) | `watch_muter` (snap deals **0**); Far Watch / Hold Ground **are** the snap | The snap still deals. Pay 1 AP or pick another file. |
| `spell-lone-purse` (10 + 8 if leftover AP **exactly 1**) | `dry_stinger` (leftover **= 0**); `full_purser` (leftover **≥ 3**); `ready_stinger` (this pass, leftover AP **and** MP ≥ 1) | Spend down to 1, or spend the last point. |
| `spell-banner-cut` (10 + 10 if target `isLeader`) | `crown_cutter` (`leader_slayer` **grant**, different id); `pet_cutter` (`isSummon`); `coup_duelist` (HP window) | Reads `isLeader`, never `"boss"` in the name. Dummy Post is not a leader. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-dual` (`NOT_PLAYER_LEARNABLE`; `court_dual_regent` kit — same law as Court Keep on `stride_keeper` CHAMPION witness), `spell-pack-close` (ENEMY_ONLY; stays `close_precentor` CHAMPION SIGNATURE), `spell-mid-fold` (BOSS_ONLY; `mid_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Long / Adj Fold stay where Waves 5–12 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 12 CORE rows are `mpCost: 0`. Dual Keep / Drift Sip rewrite **current AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Dual Keep’s delay is **their next turn start**.  
Do **not** family an eight-cell occupy. Sept Span is the seven-cell card. Six Span (`spell-six-span`, #787) waits for Wave 13.  
Do **not** family heal-if-**both leftover AP = 0** as a second id — that hole is SDE Wave 11 Dry Mend (`spell-dry-mend`) and waits for Wave 13.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs **including zeros** (that would invent locks). Halve is `floor(remaining/2)` on remaining ≥ 1. Stall is +1 on remaining ≥ 1. Stretch is ×2 on remaining ≥ 1. Pin freezes **one**.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 11 unique CORE as this pass’s CORE (`spell-diag-stride` …).  
Do **not** mint `wave12:` colliding spell ids.  
Do **not** name the Heave Mend family `heave_cantor`, the Dual Keep family `dual_bursar`, the Sept Span family `span_sept`, the Cadence Halve family `halve_precentor`, the Inch Stride family `inch_gallery`, the Rite First family `rite_nave`, the Long Oath family `reach_nave`, the Cinder Reel family `ash_aisle`, or the Cadence Pin family `pin_nave`.

---

## 3. Encounter synergy packs (Waves 1–12)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Sept Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Heave Choir | `heave_mender` + `drift_lender` + `bash_bruiser` | Shove both bodies, cash the dual-force 8, fund the follow-up |
| Dual Bank | `dual_keeper` + `ready_stinger` + `drift_sipper` | Bank both wallets, poke leftover pair, steal the shoved AP |
| Sept Plug | `sept_prelate` + `drift_siller` + `rank_lancer` | Stretched-plus seal, reject shove-through, lance the file. Skip until remaining cap ≥ 7 |
| Halve Pace | `cadence_halver` + `verse_pacer` + `ignite_alchemist` | 3→1 Inferno still illegal until they walk, then cash stacks |
| Mid Step | `mid_hooder` + `must_drifter` + `glass_sniper` | Force leftover MP along the shove into exact-2 miss, then snipe from 3 |
| Drift Court | `drift_holder` + `must_drifter` + `bash_bruiser` | Nail feet until shove, then only along that vector — COURT, never PAIR Drift Hold + Boot Hold |
| Bounce File | `heave_bouncer` + `pair_slider` + `fuse_binder` | Slide two hostiles, bounce 12+12 onto the wick |
| Drift Gate | `drift_prelate` + `drift_siller` + `shove_stinger` | Post detonates the landing; tile also rejects relocate; sting the rest |
| Heave Quiet | `heave_stepper` + `cover_squire` + `glass_sniper` | Join the shoved gun, cover the file |
| Inch Reach | `inch_warder` + `long_oather` + `far_stinger` | Cap next walk at 1, then forbid confirms under 3 |
| Rite Long | `rite_holder` + `long_oather` + `leash_warden` | Unlock Strike only with a spell that may also be range-illegal |
| Cinder Ingress | `cinder_reeler` + `ingress_marker` + `ember_knight` | Pull onto the enter-paint beside live cinder |
| Side Brace | `side_biter` + `brace_chanter` + `brood_chanter` | Hug bonus, then pets ignore the peel |
| Off Watch | `off_plater` + `watch_feer` + `stone_castellan` | Off-turn miss, then the snap they walk into also costs 1 AP |
| Spike Tapped | `spike_skipper` + `tapped_plater` + `rust_reaver` | Cross the spike, then leftover-AP-0 +RES |
| Bar Pin | `bar_mender` + `cadence_pinner` + `once_cantor` | Cash the unlocking spell, freeze Inferno so they cannot recast |
| Still Sprout | `still_taxer` + `brick_sprouter` + `tax_scribe` | Tax the camped nuke, then lengthen the wall they hid behind |
| Lone Banner | `lone_purser` + `banner_cutter` + `coil_arbiter` | Poke leftover exactly 1, then delete the leader |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), and Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step).

Do **not** pack as PAIR (COURT later is fine):

- `heave_mender` + `both_mender` / `gait_mender` / `chase_mender` / `shove_mender` / `clash_mender` / `enter_mender` / `bar_mender` / `pale_cantor`
- `dual_keeper` + `purse_keeper` / `stride_keeper` / `leftover_lender` / `spare_pacer` / `tempo_precentor`
- `sept_prelate` + `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `cadence_halver` + `cadence_trimmer` / `cadence_shaver` / `cadence_stretcher` / `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender` / `cadence_pinner`
- `mid_hooder` + `near_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `thin_warder` / `off_plater`
- `ready_stinger` + `dry_stinger` / `damp_stinger` / `full_purser` / `lone_purser` / `lone_stinger`
- `heave_stepper` + `home_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire` / `hinge_squire`
- `drift_siller` + `quiet_siller` / `cast_siller` / `body_siller` / `kennel_siller` / `gift_siller`
- `drift_holder` + `boot_holder` / `hold_knight` / `hold_caster` / `gait_sealer` / `snare_weaver` / `tool_holder`
- `drift_lender` + `spent_lender` / `boot_lender` / `spare_pacer` / `gift_siller` / `tempo_precentor` / `leftover_lender`
- `drift_sipper` + `gait_sipper` / `soul_siphon` / `ledger_siphon` / `walk_toller`
- `drift_prelate` + `dummy_prelate` / `bait_prelate` / `ingress_marker` / `shove_stinger` / `fuse_binder`
- `heave_bouncer` + `storm_caller` / `ricochet_vicar` / `split_fanger` / `plus_cutter`
- `must_drifter` + `must_stepper` / `must_spanner` / `pair_strider` / `inch_warder` / `rank_lancer` as PAIR
- `verse_pacer` + `last_muter` / `verse_taxer` / `first_verser` / `hold_caster` / `gait_muter` / `once_cantor`
- `inch_warder` + `must_stepper` / `must_spanner` / `pair_strider` / `even_warder` / `odd_warder` / `axis_locksmith`
- `rite_holder` + `hold_knight` / `first_verser` / `tool_holder` / `boot_holder` / `quiet_siller`
- `long_oather` + `near_oather` / `unit_oather` / `ground_oather` / `dim_optic` / `far_stinger` as PAIR
- `cinder_reeler` + `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter`
- `side_biter` + `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `wall_stinger`
- `ingress_marker` + `stride_marker` / `gait_wicker` / `exit_stinger` / `enter_mender` / `fuse_binder` / `glyph_sower`
- `off_plater` + `far_hooder` / `morrow_warden` / `sidestep_warder` / `tick_plater` / `foe_plater` / `mid_hooder`
- `spike_skipper` + `lava_skipper` / `pit_skipper` / `pit_mason` / `ghost_stepper` / `wick_painter`
- `tapped_plater` + `still_plater` / `empty_plater` / `dry_stinger` / `plate_warden` / `tempo_precentor`
- `brace_chanter` + `kennel_siller` / `body_siller` / `brood_chanter` as PAIR / `leash_warden` as PAIR
- `bar_mender` + `clash_mender` / `heave_mender` / `chase_mender` / `gait_mender` / `both_mender` / `pale_cantor`
- `cadence_pinner` + `cadence_halver` / `cadence_staller` / `cadence_trimmer` / `cadence_flusher` / `cadence_thief`
- `still_taxer` + `gait_taxer` / `gait_sipper` / `walk_toller` / `ley_tollkeeper` / `verse_taxer` / `tax_scribe`
- `brick_sprouter` + `brick_shifter` / `brick_wiper` / `echo_wiper` / `stone_castellan`
- `watch_feer` + `watch_muter` / `far_hooder` / `last_muter` / `glass_sniper` as PAIR
- `lone_purser` + `dry_stinger` / `full_purser` / `ready_stinger` / `purse_keeper` / `empty_plater`
- `banner_cutter` + `crown_cutter` / `pet_cutter` / `coup_duelist` / `coil_arbiter` as PAIR

Do **not** spawn Sept Plug on a map with no 5-long cardinal file plus two ortho pockets (solvability). Do not spawn Drift Gate in a 1-tile closet. Do not spawn Cinder Ingress on a map with no lava / cinder / pit cell.

---

## 4. Family sheets — Wave 12

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-28.md`](https://github.com/Mr-Melic/stralt/pull/726) (PR #726) unless marked SDE Wave 10 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-a53c/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md), PR #679).

---

### ENEMY_ID: `heave_mender`

- **NAME:** Heave Mender
- **ROLE:** healer (heal iff caster **and** target both force-moved)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Heave Mend — `healAmount` forces healer profile until `aiProfile` is explicit. Distinct from `both_mender` (both walked), `shove_mender` (target only), `clash_mender` (Struck), `bar_mender` (spell). Extra door is `heave_cantor` — family is **not** that id. At most one dual-force-heal CORE per pack as PAIR vs Both / Shove / Clash / Bar.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either `forcedMovedThisTurn` is false. Peer: Heave Mend only if both flags **and** missing HP ≥ 8. Above: refuse if either flag is false (Frost / Shield). Never shove **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two shoves already paid**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_caster_and_target_both_forced_moved"`. VETERAN: skip if either flag is false **or** missing HP < 8. ELITE: wait for Drift Lend / Pair Slide. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; walk does **not** arm.
- **CORE_SPELL_POOL:** `spell-heave-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-drift-lend` only if `drift_lender` is **absent**
- **ELITE_SPELL_POOL:** none — dual-force honesty is the elite. Do **not** unlock Both Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff both caster and target have `forcedMovedThisTurn`. Fails closed without force-move writers. Self-cast requires the caster was force-moved.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-unshoved → ELITE wait-for-slide → CHAMPION no-shove-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Heave Choir.
- **SYNERGIES:** `drift_lender`, `bash_bruiser`, `pair_slider`
- **WEAKNESSES:** Root / Drift Sill one body; Cursed Wound halves the 8
- **PLAYER_COUNTERPLAY:** Keep one body unshoved; Root the cantor; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-heave-mend` (MULTI: family observe **or** `heave_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (two booleans on the existing heal path)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dual_keeper`

- **NAME:** Dual Keeper
- **ROLE:** buffer (bank leftover AP **and** leftover MP to next turn start)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `purse_keeper` (leftover **AP**), `stride_keeper` (leftover **MP**), Court Dual (mass, never owned). Extra door is `dual_bursar` — family is **not** that id. At most one leftover-AP+MP-bank CORE per pack as PAIR vs Purse Keep / Stride Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if either leftover is 0. Peer: Keep if leftover AP ≥ 1 **and** leftover MP ≥ 1 **and** they still need a kite+cast next turn. Above: refuse if either leftover is 0 or they must leave a hazard this turn.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **both wallets they chose not to spend**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "dual_keep_if_leftover_ap_ge_1_and_leftover_mp_ge_1_and_once_free"`. VETERAN: skip if either leftover is 0 **or** once/battle is spent. ELITE: Keep then Ready partner next turn. CHAMPION: snapshot is **end of this turn**; death before next start expires the bank; once/battle on the **unit**; never splice RAF.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-dual-keep`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-ready-sting` only if `ready_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — dual-bank honesty is the elite. Do **not** unlock Purse Keep or Stride Keep as identity.
- **SIGNATURE_MECHANICS:** Once/battle, cap 2 leftover AP **and** cap 2 leftover walk MP paid at **next own turn start**. Distinct from Court Dual (mass, never owned).
- **VARIANT_PROGRESSION:** BASE frost-or-bank → VETERAN skip-if-empty → ELITE bank-then-ready → CHAMPION expire-on-death
- **RARITY_CURVE:** Standard. +ELITE in Dual Bank.
- **SYNERGIES:** `ready_stinger`, `drift_sipper`, `far_stinger`
- **WEAKNESSES:** Ready Sting / Dry Sting / Damp Sting the banked pair; kill before next start
- **PLAYER_COUNTERPLAY:** Force a spend of one wallet before end of turn; kill before next start
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dual-keep` (MULTI: family observe **or** `dual_bursar` first-win — first child wins). Do not restamp `keep_bursar` / `stride_bursar`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (end-of-turn snapshot + next-turn-start pay, two currencies; no queue splice)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sept_prelate`

- **NAME:** Sept Prelate
- **ROLE:** summoner (stationary stretched-plus occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `drift_prelate`. Extra door is `span_sept` — family is **not** that id. At most one Sept Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 7.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place origin if a 5-long file plus two ortho pockets seals a corridor. Peer: skip if any of the seven is blocked **or** remaining cap < 7 **or** click is diagonal (facing must be cardinal). Above: place off-axis so Drift Sill / Rank Lance tax the walk-around.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.15, init 0.65, chc 0.70. Sept uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `septspan` (SPELL_PROPOSALS): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **seven** cells as one combatant id. VETERAN: skip if remaining cap < 7. ELITE: Drift Sill a walk-around cell. CHAMPION: never punch a hole if a later pit lands on one cell — whole stretched plus dies.
- **CORE_SPELL_POOL:** `spell-sept-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the plus)
- **RARE_SPELL_POOL:** `spell-drift-sill` only if `drift_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / driftpost on this body.
- **SIGNATURE_MECHANICS:** Origin + 2 cells each way along a cardinal file + 2 ortho at origin. Counts as **seven**. Empty kit. 0 XP on plus death. Brick Shift does **not** move occupy cells.
- **VARIANT_PROGRESSION:** BASE wall → VETERAN respect-cap-7 → ELITE sill-the-wing → CHAMPION whole-plus-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 7. Weight 0 on cramped 1-tile closets (solvability).
- **SYNERGIES:** `drift_siller`, `rank_lancer`, `cast_siller`
- **WEAKNESSES:** Burst the 8 HP; walk around the long axis; Swap past; open field
- **PLAYER_COUNTERPLAY:** Sit on the origin; Ignite the 8; artillery if LoS is open from a far diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sept-span` (MULTI: family observe **or** `span_sept` first-win — first child wins). Sept kit is empty — nothing to steal from the post.
- **REWARD_EXPECTATION:** Standard. Plus death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "septspan"`; seven-cell footprint helper; do not spawn seven initiative seats)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_halver`

- **NAME:** Cadence Halver
- **ROLE:** debuffer / controller (`floor(remaining/2)` on one hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_trimmer` (−1), `cadence_stretcher` (×2), `cadence_cracker` (highest → 0), `cadence_pinner` (freeze one). Extra door is `halve_precentor` — family is **not** that id. At most one hostile-CD-compress CORE per pack as PAIR vs Trim / Stretch / Stall / Crack / Pin.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target’s highest remaining CD is ≤ 1 (halve is a no-op). Peer: Halve Inferno / 3-CD tools. Above: refuse if all remaining CDs are 0 (zeros stay 0; this does **not** invent locks).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **compressed recast**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "halve_hostile_remaining_cds_if_highest_ge_2"`. VETERAN: skip if highest remaining < 2. ELITE: Halve then Verse Pace so the shortened Inferno is still illegal until they walk. CHAMPION: never Halve a 1 (would look like Crack).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-halve`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-verse-pace` only if `verse_pacer` is **absent**
- **ELITE_SPELL_POOL:** none — ÷2 honesty is the elite. Do **not** unlock Trim / Stretch as identity.
- **SIGNATURE_MECHANICS:** `floor(remaining/2)` each remaining CD on one hostile. Zeros stay 0. Does not tick this turn.
- **VARIANT_PROGRESSION:** BASE frost-or-halve → VETERAN skip-if-already-1 → ELITE halve-then-pace → CHAMPION never-fake-crack
- **RARITY_CURVE:** Standard. +ELITE in Halve Pace.
- **SYNERGIES:** `verse_pacer`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Flush their own CDs first; wait the compressed window; Cleanse
- **PLAYER_COUNTERPLAY:** Recast a different id; walk to peel Verse Pace; kill the Halver
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-halve` (MULTI: family observe **or** `halve_precentor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (map remaining CDs; integer divide; skip zeros)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `mid_hooder`

- **NAME:** Mid Hooder
- **ROLE:** protector / tank (next hit from Chebyshev **exactly 2** → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `near_hooder` (≤ 1), `far_hooder` (≥ 3), `sidestep_warder` (any range). At most one exact-2-hood CORE per pack as PAIR vs Near / Far / Sidestep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if the player is already at 1 or 3+. Peer: Hood then sit at Chebyshev 2. Above: refuse if they cannot threaten from 2 this round (the consume would waste).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.80, sr 1.05, res 1.10, init 0.85, chc 0.70. Identity is **the 2-step poke misses**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "mid_hood_if_threat_chebyshev_eq_2"`. VETERAN: skip if no legal 2-range hit in kit. ELITE: Must Drift leftover MP onto 2. CHAMPION: does not eat DoT / lava / spikes.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-mid-hood`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-must-drift` only if `must_drifter` is **absent**
- **ELITE_SPELL_POOL:** none — exact-2 honesty is the elite. Do **not** unlock Near / Far Hood as identity.
- **SIGNATURE_MECHANICS:** Next applied **hit** from Chebyshev exactly 2 deals 0 and consumes. DoT ticks do not consume.
- **VARIANT_PROGRESSION:** BASE shield-or-hood → VETERAN skip-if-not-2 → ELITE shove-onto-2 → CHAMPION no-dot-eat
- **RARITY_CURVE:** Standard. +ELITE in Mid Step.
- **SYNERGIES:** `must_drifter`, `glass_sniper`, `rank_lancer`
- **WEAKNESSES:** Step to 1 or 3; Slow / Mark (0-damage does not consume); wait 2 turns
- **PLAYER_COUNTERPLAY:** Melee on 1; snipe from 3+; throw control first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mid-hood` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (range check on the next damaging instance)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ready_stinger`

- **NAME:** Ready Stinger
- **ROLE:** assassin (bonus iff leftover AP **and** leftover MP both ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `dry_stinger` (leftover AP = 0), `damp_stinger` (leftover MP ≥ 2), `full_purser` (leftover AP ≥ 3), `lone_purser` (leftover AP exactly 1). At most one dual-leftover poke CORE per pack as PAIR vs Dry / Damp / Full / Lone.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if either leftover is 0 (still may cast for 8). Peer: Ready only if both leftovers ≥ 1. Above: refuse the bonus path if Dual Keep just armed and they will spend before snapshot — wait the next turn.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **punish the dual bank**. If it tops the meter without the gate, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "ready_sting_if_target_leftover_ap_ge_1_and_mp_ge_1"`. VETERAN: skip bonus path if either leftover is 0. ELITE: wait for Dual Keep snapshot. CHAMPION: never Ready a 0/0 target as if it were Dry.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-ready-sting`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-expose`
- **RARE_SPELL_POOL:** `spell-dual-keep` only if `dual_keeper` is **absent**
- **ELITE_SPELL_POOL:** none — dual-leftover honesty is the elite.
- **SIGNATURE_MECHANICS:** 10, plus 8 iff leftover AP ≥ 1 **and** leftover MP ≥ 1 at resolve. Spend one wallet to 0.
- **VARIANT_PROGRESSION:** BASE strike-or-ready → VETERAN skip-if-empty-wallet → ELITE wait-for-bank → CHAMPION no-dry-clone
- **RARITY_CURVE:** Standard. +ELITE in Dual Bank.
- **SYNERGIES:** `dual_keeper`, `drift_sipper`, `shadow_lurker`
- **WEAKNESSES:** Spend AP or MP to 0; Root so they cannot hold MP; Shield
- **PLAYER_COUNTERPLAY:** Dump one leftover; Haste is a trap (it grants now — spend it); kill the Stinger
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ready-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + existing damage)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `heave_stepper`

- **NAME:** Heave Stepper
- **ROLE:** teleporter / protector (caster lands adjacent to a **force-moved** ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `home_stepper` (no force gate), `ally_stepper` (they come to you), `hook_chaplain` (pulls the ally). At most one join-the-shove CORE per pack as PAIR vs Home / Ally Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no ally has `forcedMovedThisTurn`. Peer: step onto a free Chebyshev-1 of that ally. Above: refuse if every adj cell is occupied or the ally was not force-moved (Home Step is a different sentence).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 0.90, res 0.85, init 1.15, chc 0.90. Identity is **join the body that already moved**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "heave_step_if_ally_forced_and_free_chebyshev_1"`. VETERAN: skip if no force flag. ELITE: Cover Step the file after landing. CHAMPION: relocate, not `isSwap`; does not increment `walkMpSpentThisTurn`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-heave-step`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-cover-step` only if `cover_squire` is **absent**
- **ELITE_SPELL_POOL:** none — join-the-shove honesty is the elite. Do **not** unlock Home Step as identity.
- **SIGNATURE_MECHANICS:** Occupancy dest onto a free Chebyshev-1 of a force-moved ally. Missing flag → fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE strike-or-join → VETERAN skip-if-unshoved → ELITE join-then-cover → CHAMPION not-a-swap
- **RARITY_CURVE:** Standard. +ELITE in Heave Quiet.
- **SYNERGIES:** `cover_squire`, `glass_sniper`, `bash_bruiser`
- **WEAKNESSES:** Drift Sill the landing; isolate so there is no forced ally; occupy all adj cells
- **PLAYER_COUNTERPLAY:** Do not shove their gun; Root the Stepper; occupy the pocket
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-heave-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest + force-flag gate; not `isSwap`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_siller`

- **NAME:** Drift Siller
- **ROLE:** hazard creator / controller (occupant cannot be a **relocate dest**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `quiet_siller` (cannot Strike), `cast_siller` (cannot non-physical), `body_siller` (primary cannot leave). At most one relocate-forbid-tile CORE per pack as PAIR vs Quiet / Cast / Body.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no shove is incoming. Peer: paint the cell an ally bash would land on. Above: refuse if the player can walk onto the cell without being shoved (the sill is then a no-op vs walk).
- **STAT_SCALING_RULE:** hp 0.95, sp 0.85, sr 1.00, res 1.00, init 0.90, chc 0.75. Identity is **shove cannot complete onto this paint**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "drift_sill_if_ally_would_be_shoved_onto_hazard_or_to_block_a_shove"`. VETERAN: skip if no relocate threat. ELITE: pair with Drift Post so walk is safe and shove is death. CHAMPION: walk onto remains legal.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-drift-sill`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-drift-post` only if `drift_prelate` is **absent**
- **ELITE_SPELL_POOL:** none — relocate-forbid honesty is the elite. Do **not** unlock Quiet Sill as identity.
- **SIGNATURE_MECHANICS:** Occupant cannot be chosen as a push / pull / swap / hinge / pair-slide dest. Walk onto is legal. Blink / Twin-gate still enter.
- **VARIANT_PROGRESSION:** BASE frost-or-sill → VETERAN skip-if-no-shove → ELITE sill-plus-post → CHAMPION walk-still-legal
- **RARITY_CURVE:** Standard. +ELITE in Drift Gate / Sept Plug.
- **SYNERGIES:** `drift_prelate`, `sept_prelate`, `bash_bruiser`
- **WEAKNESSES:** Walk onto; occupy before paint; wait duration
- **PLAYER_COUNTERPLAY:** Walk through; shove a different cell; Swap the Siller onto their paint
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-sill` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (relocate dest filter; walk path must not read the same flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_holder`

- **NAME:** Drift Holder
- **ROLE:** controller (cannot spend walk MP until **force-moved**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `boot_holder` (until Strike), `hold_knight` (Strike until walk), `gait_sealer` (cannot walk; spells legal). At most one force-peel-hold CORE per pack as PAIR vs Boot Hold / Gait Seal.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover MP is already 0 (the hold is a no-op). Peer: Hold a kiter who still has tiles. Above: refuse if a pack partner will immediately Shoulder Bash them (you just paid 3 to set up **their** peel).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.10, chc 0.85. Identity is **they need a partner shove**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "drift_hold_if_target_needs_walk_and_no_ally_shove_in_kit"`. VETERAN: skip if leftover MP is 0 **and** they are in range. ELITE: Hold then Must Drift after the peel. CHAMPION: Strike does **not** peel; duration 2 or until force-moved.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-drift-hold`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-must-drift` only if `must_drifter` is **absent**
- **ELITE_SPELL_POOL:** none — force-peel honesty is the elite. Do **not** unlock Boot Hold as identity.
- **SIGNATURE_MECHANICS:** Cannot spend walk MP until `forcedMovedThisTurn` or 2 of their turns. Spells remain legal.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-already-still → ELITE hold-then-must-drift → CHAMPION strike-does-not-peel
- **RARITY_CURVE:** Standard. +ELITE in Drift Court.
- **SYNERGIES:** `must_drifter`, `bash_bruiser`, `pair_slider`
- **WEAKNESSES:** Accept a shove (that is the peel); sit and cast; Cleanse
- **PLAYER_COUNTERPLAY:** Strike from here; wait 2 turns; shove yourself onto a safe cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-hold` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-spend gate keyed off force flag / duration)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_lender`

- **NAME:** Drift Lender
- **ROLE:** buffer (+1 current AP to an ally who **was force-moved**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `spent_lender` (+1 MP if walked), `boot_lender` (unmoved), `tempo_precentor` (ungated). At most one force-lend CORE per pack as PAIR vs Spent / Boot Lend.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally has `forcedMovedThisTurn`. Peer: Lend only if that ally still needs a 2-AP tool. Above: refuse if they already have leftover AP ≥ their max − 1 (the +1 is wasted).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.90, res 0.80, init 1.20, chc 0.75. Identity is **fund the tool after the shove**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "drift_lend_if_ally_forced_and_needs_2_ap_tool"`. VETERAN: skip if no force flag. ELITE: Lend then Heave Mend the same body. CHAMPION: walk does **not** arm.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-drift-lend`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `starter-shield`
- **RARE_SPELL_POOL:** `spell-heave-mend` only if `heave_mender` is **absent**
- **ELITE_SPELL_POOL:** none — force-lend honesty is the elite.
- **SIGNATURE_MECHANICS:** +1 current AP to a force-moved ally. Missing flag → fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-unshoved → ELITE lend-then-heave → CHAMPION walk-does-not-arm
- **RARITY_CURVE:** Standard. +ELITE in Heave Choir.
- **SYNERGIES:** `heave_mender`, `bash_bruiser`, `glass_sniper`
- **WEAKNESSES:** Isolate so there is no forced ally; Drain Courage the +1; kill the Lender
- **PLAYER_COUNTERPLAY:** Do not get shoved; spend the gifted AP on a bad target; Cursed Wound
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (flag + existing AP grant helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_sipper`

- **NAME:** Drift Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff they **were force-moved**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `gait_sipper` (MP iff walked), `ledger_siphon` (ungated AP), Drain Courage (immediate −1 + drain). At most one force-AP-steal CORE per pack as PAIR vs Gait Sip / Ledger.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if `forcedMovedThisTurn` is false. Peer: Sip only if leftover AP ≥ 1. Above: refuse if leftover AP is 0 (the steal is 0).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.85, res 0.75, init 1.20, chc 0.90. Identity is **tax the shove they already took**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "drift_sip_if_target_forced_and_leftover_ap_ge_1"`. VETERAN: skip if no force flag **or** leftover AP is 0. ELITE: Sip then Ready the remaining MP. CHAMPION: walk does **not** arm; `spell.mpCost` stays 0.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-drift-sip`
- **ADVANCED_SPELL_POOL:** `spell-drain-courage`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-ready-sting` only if `ready_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — force-sip honesty is the elite. Do **not** unlock Gait Sip as identity.
- **SIGNATURE_MECHANICS:** Steal 1 leftover AP iff they were force-moved. Stand / walk = 0.
- **VARIANT_PROGRESSION:** BASE frost-or-sip → VETERAN skip-if-unshoved → ELITE sip-then-ready → CHAMPION walk-does-not-arm
- **RARITY_CURVE:** Standard. +ELITE in Dual Bank.
- **SYNERGIES:** `dual_keeper`, `ready_stinger`, `pair_slider`
- **WEAKNESSES:** Spend AP to 0 before the shove; Shield; kill the Sipper
- **PLAYER_COUNTERPLAY:** Do not get shoved with leftover AP; Dump Tempo; Root
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (flag + leftover AP rewrite; not `spell.mpCost`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_prelate`

- **NAME:** Drift Prelate
- **ROLE:** summoner / hazard creator (post detonates on **relocate landing**; walk is safe)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Replaces random overlay on this body. Distinct from `dummy_prelate` (taunt), `bait_prelate` (eat), `ingress_marker` (walk enter). At most one Drift Post per pack. Counts as **1**. Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place if a shove dest is predictable. Peer: skip if the pack has no relocate id. Above: pair with Drift Sill so walk-around is legal and shove is death.
- **STAT_SCALING_RULE:** hp 0.70, sp 0.70, sr 1.00, res 0.90, init 0.70, chc 0.70. Post uses `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `driftpost`: `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **one** cell. VETERAN: skip if no relocate in pack. ELITE: Sill an adjacent walk-around. CHAMPION: walk onto does **not** detonate; Twin-gate / Phase Slip onto **does** (they are landings).
- **CORE_SPELL_POOL:** `spell-drift-post`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `physical_attack` (on the caster, not the post)
- **RARE_SPELL_POOL:** `spell-drift-sill` only if `drift_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / dummy / bait / sept as identity.
- **SIGNATURE_MECHANICS:** Relocate landing on its cell deals 10 and the post dies. Walk onto is safe. Counts as **1**. 0 XP on post death.
- **VARIANT_PROGRESSION:** BASE paint-dest → VETERAN require-shove-kit → ELITE sill-the-ring → CHAMPION walk-safe
- **RARITY_CURVE:** Standard. +ELITE in Drift Gate. Weight 0 on maps with no 2-step shove lane (solvability).
- **SYNERGIES:** `drift_siller`, `shove_stinger`, `bash_bruiser`
- **WEAKNESSES:** Walk onto; occupy before paint; burst the 8; do not shove
- **PLAYER_COUNTERPLAY:** Walk past; Swap the Prelate onto the post; artillery the 8
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-post` (MULTI_SOURCE). Post kit is empty.
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "driftpost"`; detonate on relocate commit only)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `heave_bouncer`

- **NAME:** Heave Bouncer
- **ROLE:** artillery (12 to primary; bounce to nearest **other** force-moved hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from Chain Lightning (nearest **any**), `ricochet_vicar` (predicate bounce), `split_fanger`. At most one force-bounce CORE per pack as PAIR vs Storm Caller / Ricochet.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack force flags < 2. Peer: Bounce only if a second force-moved hostile is within 4. Above: refuse the bounce path if only one body was shoved (12 only is honest; do not fake Chain Lightning).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.15, sr 0.90, res 0.75, init 1.10, chc 0.90. Identity is **second 12 needs a second flag**. If it tops the meter on the first 12 alone every fight, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "heave_bounce_if_two_hostiles_forced_within_4"`. VETERAN: skip bounce path if flags < 2. ELITE: Pair Slide two bodies first. CHAMPION: ties nearest Chebyshev then lowest id; never hit allies; do not call the live `bounces` walker.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-heave-bounce`
- **ADVANCED_SPELL_POOL:** `starter-blast` only if the bounce path is **disabled** this fight (else it reads as Chain Lightning), `spell-mark`
- **RARE_SPELL_POOL:** `spell-pair-slide` only if `pair_slider` is **absent**
- **ELITE_SPELL_POOL:** none — two-flag honesty is the elite. Do **not** unlock Chain Lightning as identity.
- **SIGNATURE_MECHANICS:** 12 to primary (primary need **not** be force-moved). Bounce 12 to nearest **other** force-moved hostile. Missing second flag → 12 only.
- **VARIANT_PROGRESSION:** BASE frost-or-12 → VETERAN skip-if-one-flag → ELITE slide-then-bounce → CHAMPION no-live-bounce-walker
- **RARITY_CURVE:** Standard. +ELITE in Bounce File.
- **SYNERGIES:** `pair_slider`, `fuse_binder`, `bash_bruiser`
- **WEAKNESSES:** Keep one body unshoved; Shield; spread past 4
- **PLAYER_COUNTERPLAY:** Isolate; Root one body so it cannot be slid; kill the Bouncer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-heave-bounce` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (search + second `dealDamage`; do not reuse live bounce)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_drifter`

- **NAME:** Must Drifter
- **ROLE:** controller (remaining walks follow **last forced-move dir**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `must_stepper` (Chebyshev 1 any dir), `must_spanner` (Manhattan 2), `inch_warder` (one next ≤ 1). At most one forced-dir walk CORE per pack as PAIR vs Must Step / Must Span / Inch.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if `lastForcedMoveDir` is missing. Peer: lock leftover MP along the shove into a file / pit. Above: refuse if leftover MP is 0 (the lock is a no-op).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.85, init 1.15, chc 0.85. Identity is **continue east or stop**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_drift_if_target_has_last_forced_dir_and_leftover_mp_ge_1"`. VETERAN: skip if vector missing. ELITE: after Drift Hold peel. CHAMPION: a later shove **rewrites** the vector; walk spends do not write it.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-must-drift`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-file-lance` only if `rank_lancer` is **absent**
- **ELITE_SPELL_POOL:** none — vector honesty is the elite. Do **not** unlock Must Step as identity.
- **SIGNATURE_MECHANICS:** Remaining walk dests this turn must be exactly 1 step along `lastForcedMoveDir`. Missing key → fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE strike-or-lock → VETERAN skip-if-no-vector → ELITE hold-then-drift → CHAMPION later-shove-rewrites
- **RARITY_CURVE:** Standard. +ELITE in Mid Step / Drift Court.
- **SYNERGIES:** `drift_holder`, `mid_hooder`, `rank_lancer`, `pit_mason`
- **WEAKNESSES:** Spend MP to 0 before the lock; do not get shoved; wait the turn
- **PLAYER_COUNTERPLAY:** Dump leftover MP; Blink off the file; kill the Drifter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-drift` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-dest filter + vector on occupancy commits)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_pacer`

- **NAME:** Verse Pacer
- **ROLE:** debuffer / controller (last resolved id **illegal until they walk**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `last_muter` (duration), `verse_taxer` (+1 AP, legal), `first_verser` (must cast this id first). At most one walk-peel-last-id CORE per pack as PAIR vs Last Mute / Verse Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last-id (opening turn). Peer: Pace only if leftover MP ≥ 1 **and** last-id is their best nuke. Above: refuse if leftover MP is 0 and they are already in range (the lock would be a Last Mute clone).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **recast Inferno only after a step**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "verse_pace_if_target_last_id_is_their_best_nuke"`. VETERAN: skip if no last-id **or** leftover MP is 0 while in range. ELITE: Quiet Sill the peel walk. CHAMPION: forced-move does **not** peel; Strike is a different id — legal.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-pace`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-cadence-halve` only if `cadence_halver` is **absent**
- **ELITE_SPELL_POOL:** none — walk-peel honesty is the elite. Do **not** unlock Last Mute as identity.
- **SIGNATURE_MECHANICS:** Last resolved id rejects until `walkMpSpentThisTurn ≥ 1`. Needs `lastResolvedSpellId`.
- **VARIANT_PROGRESSION:** BASE frost-or-pace → VETERAN skip-if-no-peel-walk → ELITE sill-the-peel → CHAMPION force-does-not-peel
- **RARITY_CURVE:** Standard. +ELITE in Halve Pace.
- **SYNERGIES:** `cadence_halver`, `quiet_siller`, `ignite_alchemist`
- **WEAKNESSES:** Walk 1; cast a different id; Cleanse (`cleanseTypes` include `"versePace"`)
- **PLAYER_COUNTERPLAY:** Step then recast; switch tools; kill the Pacer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-pace` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (confirm gate keyed off last-id + walk peel)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `inch_warder`

- **NAME:** Inch Warder
- **ROLE:** controller (next walk Chebyshev **≤ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `pair_strider` (exactly Manhattan 2), `must_spanner` (all remaining Manhattan 2), `must_stepper` (all remaining Chebyshev 1). Extra door is `inch_gallery` — family is **not** that id. At most one one-walk-≤1 CORE per pack as PAIR vs Pair Stride / Must Span / Must Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if rooted or MP 0. Peer: Inch a kiter with MP ≥ 2. Above: refuse on chargers whose kit is “walk 3 and Strike” if they are already adjacent (the brand is a no-op).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **one next step, not every remaining step**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "force_next_walk_chebyshev_le_1"`. VETERAN: skip if rooted or MP 0. ELITE: then Long Oath so they cannot walk to 3 in one step. CHAMPION: teleport / Swap do **not** consume the brand.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-inch-stride`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-root-snare` only if `snare_weaver` is **absent**
- **RARE_SPELL_POOL:** `spell-long-oath` only if `long_oather` is **absent**
- **ELITE_SPELL_POOL:** none — one-walk honesty is the elite. Do **not** unlock Must Step as identity.
- **SIGNATURE_MECHANICS:** Next walk may only end at Chebyshev ≤ 1 from start. Confirm of a 2+ step fails; MP not spent.
- **VARIANT_PROGRESSION:** BASE frost-or-inch → VETERAN skip-if-still → ELITE inch-then-long → CHAMPION blink-does-not-consume
- **RARITY_CURVE:** Standard. +ELITE in Inch Reach / `inch_gallery`.
- **SYNERGIES:** `long_oather`, `far_stinger`, `ingress_marker`
- **WEAKNESSES:** Blink / Swap off; Strike in place; pay nothing because you wanted a 1-step
- **PLAYER_COUNTERPLAY:** Stay at 1; teleport; kill the Warder
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-inch-stride` (MULTI: family observe **or** `inch_gallery` victory first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (one-walk dest filter; not Must Span’s remaining-walk table)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rite_holder`

- **NAME:** Rite Holder
- **ROLE:** controller (cannot Strike until they resolve a **spell**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `hold_knight` (until walk), `first_verser` (this id first), `tool_holder` (cannot tool until Strike). Extra room `rite_nave` is a teach — family is **not** that id. At most one strike-until-spell CORE per pack as PAIR vs Strike Hold / Verse First / Tool Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if their bar is spells-only (the hold is a no-op). Peer: Hold a melee character with one 2-AP tool. Above: refuse if they already resolved a spell this turn (fizzle).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.10, chc 0.80. Identity is **cast Slow to unlock Strike**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_strike_until_spell"`. VETERAN: skip if already cast or spells-only. ELITE: Long Oath so the unlocking spell may also be range-illegal. CHAMPION: walks remain legal; Hex of Silence must **not** also apply.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-rite-first`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-long-oath` only if `long_oather` is **absent**
- **ELITE_SPELL_POOL:** none — spell-to-unlock-Strike honesty is the elite.
- **SIGNATURE_MECHANICS:** Strike illegal until a `kind === "cast"` that spent AP (not Strike) resolves this turn.
- **VARIANT_PROGRESSION:** BASE frost-or-rite → VETERAN skip-if-already-cast → ELITE rite-then-long → CHAMPION no-silence-stack
- **RARITY_CURVE:** Standard. +ELITE in Rite Long / `rite_nave`.
- **SYNERGIES:** `long_oather`, `leash_warden`, `quiet_siller`
- **WEAKNESSES:** Cast any 2-AP tool; wait the turn; Quiet Hex the unlocking spell
- **PLAYER_COUNTERPLAY:** Mark / Slow to unlock; sit; kill the Holder
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rite-first` (ENEMY_DISCOVERY; `rite_nave` observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (confirm gate until a non-Strike AP spend)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `long_oather`

- **NAME:** Long Oather
- **ROLE:** anti-ranged / controller (next spell min range **3**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `near_oather` (≤ 1), `unit_oather` (unit class), `ground_oather` (ground), `dim_optic` (cuts range). Extra room `reach_nave` is a teach — family is **not** that id. At most one min-range-3 oath CORE per pack as PAIR vs Near Oath / Dim Optic.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they only hold Strike or are already at 4+. Peer: Oath a sniper at Chebyshev 2. Above: refuse if Inch Stride is already on them **and** they have no 3+ tile (the brick is two keys — CHAMPION may stack, BASE must not).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.90, res 0.75, init 1.15, chc 0.85. Identity is **Frost at 1 fizzles**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "next_spell_range_ge_3"`. VETERAN: skip if they only hold Strike. ELITE: Inch then Long. CHAMPION: Strike stays legal at range 1.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-long-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-poison`
- **RARE_SPELL_POOL:** `spell-inch-stride` only if `inch_warder` is **absent**
- **ELITE_SPELL_POOL:** none — min-3 honesty is the elite. Do **not** unlock Near Oath as identity.
- **SIGNATURE_MECHANICS:** Next spell illegal unless Chebyshev(caster, target) ≥ 3. Strike is not a spell for this key.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee-only → ELITE inch-then-long → CHAMPION strike-legal
- **RARITY_CURVE:** Standard. +ELITE in Inch Reach / Rite Long / `reach_nave`.
- **SYNERGIES:** `inch_warder`, `far_stinger`, `rite_holder`
- **WEAKNESSES:** Strike; walk to 3+ before the nuke; wait 2 turns
- **PLAYER_COUNTERPLAY:** Melee; step out; kill the Oather
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-long-oath` (ENEMY_DISCOVERY; `reach_nave` observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell range gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cinder_reeler`

- **NAME:** Cinder Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest **hazard**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. SDE Wave 10. Distinct from `paint_reeler` (paint), `foe_reeler` (body), `file_reeler` (file toward caster), `sink_chanter` (tile attractor). Extra room `ash_aisle` is a teach — family is **not** that id. At most one hazard-attract CORE per pack as PAIR vs Paint / Foe / File Reel.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no lava / cinder / pit cell exists. Peer: Reel a body 1 toward that cell. Above: refuse if the 1-step is blocked or they already stand on the hazard (attract 0).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **fifth `applyAttract` dest**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_hazard"`. VETERAN: skip if no hazard or step blocked. ELITE: Ingress Mark the landing. CHAMPION: Spike Skip does **not** ignore a pull onto spikes (skip is a **walk** flag).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cinder-reel`
- **ADVANCED_SPELL_POOL:** `spell-cinder-tile` only if `usableByEnemy` is flipped for **that one id**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-ingress-mark` only if `ingress_marker` is **absent**
- **ELITE_SPELL_POOL:** none — hazard-dest honesty is the elite. Do **not** unlock Paint Reel as identity.
- **SIGNATURE_MECHANICS:** `applyAttract` 1 toward nearest lava / cinder / pit. Empty board → fizzle (AP spent). Landing ticks existing hazards.
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-no-hazard → ELITE reel-onto-ingress → CHAMPION pull-not-a-walk-skip
- **RARITY_CURVE:** Standard. +ELITE in Cinder Ingress / `ash_aisle`. Weight 0 on maps with no hazard cell.
- **SYNERGIES:** `ingress_marker`, `ember_knight`, `fuse_binder`, `pit_mason`
- **WEAKNESSES:** Occupy the step; Barrier; stand on the hazard already
- **PLAYER_COUNTERPLAY:** Block the 1-step; Swap; kill the Reeler
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cinder-reel` (ENEMY_DISCOVERY; `ash_aisle` observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (fifth attract dest; production caller for `applyAttract`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `side_biter`

- **NAME:** Side Biter
- **ROLE:** bruiser (bonus if caster has adj **ally**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. SDE Wave 10. Distinct from `lone_stinger` (0 adj hostiles-to-target), `nook_biter` (exactly 1 block), `field_biter` (0 blocks), `wall_biter` (any hug). At most one adj-ally-bonus CORE per pack as PAIR vs Lone / Nook / Field / Wall.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if isolated. Peer: Bite only if a living same-side body is Chebyshev 1. Above: refuse isolated 10 if Strike is better this turn.
- **STAT_SCALING_RULE:** hp 1.05, sp 1.05, sr 0.85, res 0.90, init 1.05, chc 0.90. Identity is **18 in the hug, 10 alone**. If it tops the meter while isolated every fight, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `berserker`. `aiHint: "bonus_if_adjacent_ally"`. VETERAN: skip if isolated and Strike is better. ELITE: Brace so the hug body ignores peel. CHAMPION: reads same-side living body, never `"wolf"` in the name.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-side-bite`
- **ADVANCED_SPELL_POOL:** `spell-enrage`, `starter-poison`
- **RARE_SPELL_POOL:** `spell-summon-brace` only if `brace_chanter` is **absent**
- **ELITE_SPELL_POOL:** none — hug honesty is the elite.
- **SIGNATURE_MECHANICS:** 10, plus 8 as a second `dealDamage` if caster has a living same-side Chebyshev-1 body.
- **VARIANT_PROGRESSION:** BASE strike-or-bite → VETERAN skip-if-isolated → ELITE brace-the-hug → CHAMPION no-name-heuristic
- **RARITY_CURVE:** Standard. +ELITE in Side Brace.
- **SYNERGIES:** `brace_chanter`, `brood_chanter`, `leash_warden`
- **WEAKNESSES:** Peel the pack (Pawn Trade / Swap); kill the hug body first; Barrier
- **PLAYER_COUNTERPLAY:** Isolate; Swap the hug body; burst the Biter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-side-bite` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (adj same-side scan + second damage call)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ingress_marker`

- **NAME:** Ingress Marker
- **ROLE:** hazard creator (cell paint detonates on **enter**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `stride_marker` (leave), `gait_wicker` (unit), `exit_stinger` (first leave), `enter_mender` (enter heal), `drift_prelate` (relocate landing). At most one enter-detonate CORE per pack as PAIR vs Stride Mark / Exit / Gait Wick / Drift Post.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they can threaten without entering. Peer: paint the cell they must enter to threaten. Above: standing on it at paint time does **not** detonate — do not paint their feet as if it were Fuse.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **walk-on / shove-on pays 10**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_on_walk_enter_cell"`. VETERAN: skip if they can threaten without entering. ELITE: Inch so the only legal step is onto the paint. CHAMPION: teleport onto **does** enter; do **not** reuse `gaitWickDamage`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-ingress-mark`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-inch-stride` only if `inch_warder` is **absent**
- **ELITE_SPELL_POOL:** none — enter honesty is the elite. Do **not** unlock Stride Mark as identity.
- **SIGNATURE_MECHANICS:** Next unit that **enters** the cell (walk or relocate landing or blink-on) takes 10; paint consumes. Occupant at arm time is free.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-already-in-range → ELITE inch-onto-paint → CHAMPION blink-enters
- **RARITY_CURVE:** Standard. +ELITE in Cinder Ingress.
- **SYNERGIES:** `cinder_reeler`, `inch_warder`, `ember_knight`
- **WEAKNESSES:** Don’t enter; blink past; send a summon in
- **PLAYER_COUNTERPLAY:** Threaten without entering; Swap the Marker onto the paint; wait 2 turns
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ingress-mark` (ENEMY_DISCOVERY). Observation is the **arm**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (enter hook distinct from leave / gait-wick)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `off_plater`

- **NAME:** Off Plater
- **ROLE:** tank (next **off-turn** damaging hit → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 10. Distinct from `far_hooder` (≥ 3), `morrow_warden` (next **own** turn), `sidestep_warder` (any turn), `tick_plater` (DoT tick), `mid_hooder` (exactly 2). At most one off-turn-miss CORE per pack as PAIR vs Far / Morrow / Sidestep / Mid.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if already plated with Sidestep / Far Hood. Peer: Plate then end turn. Above: refuse if they must act on the player’s turn into a snap they cannot afford to consume.
- **STAT_SCALING_RULE:** hp 1.20, sp 0.75, sr 1.10, res 1.20, init 0.80, chc 0.70. Identity is **hit them on their turn**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "next_off_turn_hit_zero"`. VETERAN: skip if Sidestep / Far Hood already up. ELITE: Watch Fee so the snap they walk into also costs 1 AP. CHAMPION: Slow / Mark do **not** consume; only damaging instances; do not implement as `buffStat: "evasion"`.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-off-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-watch-fee` only if `watch_feer` is **absent**
- **ELITE_SPELL_POOL:** none — off-turn honesty is the elite. Do **not** unlock Morrow Plate as identity.
- **SIGNATURE_MECHANICS:** Next damaging `dealDamage` while it is **not** this unit’s turn misses (0 HP, no absorb chew, no DoT apply) then consumes. Timeout 2 turns. Their-turn hits still land.
- **VARIANT_PROGRESSION:** BASE shield-or-plate → VETERAN skip-if-already-hooded → ELITE plate-then-fee → CHAMPION control-does-not-consume
- **RARITY_CURVE:** Standard. +ELITE in Off Watch.
- **SYNERGIES:** `watch_feer`, `stone_castellan`, `goad_herald`
- **WEAKNESSES:** Hit them on **their** turn (overwatch, Goad into reflect); wait 2 turns; throw 0-damage control first
- **PLAYER_COUNTERPLAY:** Act on their window; consume with a cheap hit then the real one; kill the Plater
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-off-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (turn-owner check on the next damaging instance)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spike_skipper`

- **NAME:** Spike Skipper
- **ROLE:** kiter / teleporter-lite (next **1-tile** walk ignores spikes)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. SDE Wave 10. Distinct from `lava_skipper` (lava), `pit_skipper` (pit), Gap Ward (overwatch on a 1-tile walk). At most one spike-skip CORE per pack as PAIR vs Lava / Pit Skip.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no spike on the 1-step approach. Peer: Skip then walk 1 across spikes. Above: refuse if the approach is 2+ tiles (the skip would not pay).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 0.85, res 0.80, init 1.20, chc 0.95. Identity is **1-tile spike as floor**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "next_walk_ignores_spikes"`. VETERAN: skip if no spike on the 1-step. ELITE: Ingress on the far side. CHAMPION: lava / pit / void / Barrier still block and tick; Cinder Reel is **not** a walk skip.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-spike-skip`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-haste` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-ingress-mark` only if `ingress_marker` is **absent**
- **ELITE_SPELL_POOL:** none — spike-class honesty is the elite. Do **not** unlock Lava Skip as identity.
- **SIGNATURE_MECHANICS:** Next walk of Chebyshev 1 ignores spike occupancy and spike tick. Length ≥ 2 still pays.
- **VARIANT_PROGRESSION:** BASE strike-or-skip → VETERAN skip-if-no-spike → ELITE skip-then-ingress → CHAMPION lava-still-ticks
- **RARITY_CURVE:** Standard. +ELITE in Spike Tapped. Weight 0 on maps with no spike cell.
- **SYNERGIES:** `tapped_plater`, `rust_reaver`, `ingress_marker`
- **WEAKNESSES:** Make the approach 2+ tiles; lava instead of spikes; Root
- **PLAYER_COUNTERPLAY:** Force a 2-step; paint lava; kill the Skipper
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spike-skip` (ENEMY_DISCOVERY). Observation is the **arm**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (1-tile walk hazard filter for spikes only)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tapped_plater`

- **NAME:** Tapped Plater
- **ROLE:** tank (0 leftover **AP** → +RES)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 10. Distinct from `still_plater` (leftover **MP** 0), `empty_plater` (Wave 8 leftover-AP RES), `dry_stinger` (leftover AP 0 **damage**). At most one leftover-AP-0 +RES CORE per pack as PAIR vs Still / Empty / Dry.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover AP ≥ 1 (this would fizzle). Peer: last action of the turn when leftover is already 0. Above: refuse if they still need a 2-AP tool this turn.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.10, res 1.15, init 0.80, chc 0.70. Identity is **spend the last AP, then plate**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "self_buff_if_zero_leftover_ap"`. VETERAN: skip if leftover AP ≥ 1. ELITE: Dry partner after they tapped. CHAMPION: Tapped consumes 2 AP so leftover must already be 0 **before** this cast; last RES% writer wins vs Iron Skin.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-tapped-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-dry-sting` only if `dry_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-AP-0 honesty is the elite. Do **not** unlock Still Plate as identity.
- **SIGNATURE_MECHANICS:** If leftover AP is 0 at resolve, +20% RES / 2. If leftover ≥ 1, fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE shield-or-tap → VETERAN skip-if-ap-left → ELITE tap-then-dry → CHAMPION spend-down-first
- **RARITY_CURVE:** Standard. +ELITE in Spike Tapped.
- **SYNERGIES:** `spike_skipper`, `dry_stinger`, `rust_reaver`
- **WEAKNESSES:** Loan Tempo them 1 AP before they arm; Dispel; ignore and snipe
- **PLAYER_COUNTERPLAY:** Gift 1 AP; strip RES; kill the Plater
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tapped-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP read + existing RES buff)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brace_chanter`

- **NAME:** Brace Chanter
- **ROLE:** protector / summoner-support (allied summons ignore forced move)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. SDE Wave 10. Distinct from `brood_chanter` (summon overlay), `kennel_siller` (summons cannot leave), `body_siller` (primary cannot leave). At most one summon-ignore-force CORE per pack as PAIR vs Kennel / Body Sill / Brood as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no living allied summon. Peer: Brace then Side Bite. Above: refuse if the pack has no pet (player copy needs a living summon too).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 0.95, res 0.90, init 1.05, chc 0.75. Identity is **pets stay parked through a bash**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "allied_summons_ignore_forced_move"`. VETERAN: skip if no living allied summon. ELITE: Side Bite the hug. CHAMPION: 2 turns; Grounded Lock is a different key (no-swap on a **unit**).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-summon-brace`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `summon-dire-wolf` only as ADVANCED (CORE is Brace, not a second overlay)
- **RARE_SPELL_POOL:** `spell-side-bite` only if `side_biter` is **absent**
- **ELITE_SPELL_POOL:** none — ignore-force honesty is the elite. Do **not** unlock Kennel Sill as identity.
- **SIGNATURE_MECHANICS:** Allied `isSummon` bodies ignore push / pull / swap / hinge for 2 turns. Walk still legal.
- **VARIANT_PROGRESSION:** BASE frost-or-brace → VETERAN skip-if-no-pet → ELITE brace-then-bite → CHAMPION walk-still-legal
- **RARITY_CURVE:** Standard. +ELITE in Side Brace.
- **SYNERGIES:** `side_biter`, `brood_chanter`, `leash_warden`
- **WEAKNESSES:** Kill the pets first; wait 2 turns; damage still lands
- **PLAYER_COUNTERPLAY:** Burst the whelps; Ignite; kill the Chanter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-brace` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (force-move filter on `isSummon` + same side)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `bar_mender`

- **NAME:** Bar Mender
- **ROLE:** healer (heal iff **target resolved a spell**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. SDE Wave 10. Distinct from `clash_mender` (Struck), `chase_mender` (walked), `heave_mender` (both force-moved), `pale_cantor` (unconditional). At most one spell-gated heal CORE per pack as PAIR vs Clash / Chase / Heave / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if the target has not resolved a spell this turn. Peer: Mend only if they spent AP on a non-Strike cast **and** missing HP ≥ 8. Above: refuse if they only Struck (Strike does **not** count).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **the unlocking spell paid the 8**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_resolved_spell"`. VETERAN: skip if no spell resolve **or** missing HP < 8. ELITE: wait for Rite First so they **must** cast. CHAMPION: `challengeHealUsedRef` flips only when HP increased.
- **CORE_SPELL_POOL:** `spell-bar-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-rite-first` only if `rite_holder` is **absent**
- **ELITE_SPELL_POOL:** none — spell-gate honesty is the elite. Do **not** unlock Clash Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff target resolved a non-Strike AP-spend this turn. Strike does not count.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-no-cast → ELITE rite-then-mend → CHAMPION strike-does-not-count
- **RARITY_CURVE:** Standard. +ELITE in Bar Pin.
- **SYNERGIES:** `cadence_pinner`, `once_cantor`, `rite_holder`
- **WEAKNESSES:** Only Strike; Cursed Wound halves the 8; kill the Mender
- **PLAYER_COUNTERPLAY:** Melee-only window; Root the cantor; isolate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bar-mend` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (spell-resolve flag on the existing heal path)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_pinner`

- **NAME:** Cadence Pinner
- **ROLE:** debuffer (one remaining CD **does not tick**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `cadence_staller` (+1 all), `cadence_halver` (÷2), `cadence_flusher` (all → 0), `cadence_trimmer` (−1). Extra room `pin_nave` is a teach — family is **not** that id. At most one freeze-one-CD CORE per pack as PAIR vs Stall / Halve / Flush / Trim.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no remaining CD ≥ 1. Peer: Pin Inferno at 3. Above: refuse if all remaining are 0 (this does **not** invent a lock).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **Inferno stays at 3**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "pin_one_remaining_cd"`. VETERAN: skip if no remaining ≥ 1. ELITE: Once Verse so they cannot recast a different copy. CHAMPION: Pin does not tick **this** turn; other CDs tick normally.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-pin`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-once-verse` only if `once_cantor` is **absent**
- **ELITE_SPELL_POOL:** none — freeze-one honesty is the elite. Do **not** unlock Stall as identity.
- **SIGNATURE_MECHANICS:** One chosen remaining CD does not decrement at turn end for 1 round. Zeros stay 0.
- **VARIANT_PROGRESSION:** BASE frost-or-pin → VETERAN skip-if-no-cd → ELITE pin-then-once → CHAMPION others-still-tick
- **RARITY_CURVE:** Standard. +ELITE in Bar Pin / `pin_nave`.
- **SYNERGIES:** `bar_mender`, `once_cantor`, `ignite_alchemist`
- **WEAKNESSES:** Flush; recast a different id; wait the pin
- **PLAYER_COUNTERPLAY:** Switch tools; Cadence Crack the pinned id; kill the Pinner
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-pin` (ENEMY_DISCOVERY; `pin_nave` observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one-id tick skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_taxer`

- **NAME:** Still Taxer
- **ROLE:** debuffer (next spell +1 AP if they **camped last turn**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `gait_taxer` (if they **walked**), Quiet Hex (always), `walk_toller` (+1 walk MP), `verse_taxer` (last id +1, no walk gate). At most one camp-tax CORE per pack as PAIR vs Gait Tax / Ley / Verse Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they walked last turn (the tax is a no-op). Peer: Tax a sniper who sat. Above: refuse if they must walk this turn anyway (they peel by stepping).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **cast after walking last turn, or Strike**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "tax_next_spell_if_camped_last_turn"`. VETERAN: skip if they walked last turn. ELITE: Brick Sprout so they want to keep sitting. CHAMPION: `spell.mpCost` stays 0; the tax is **+1 AP** on the next spell.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-still-tax`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-brick-sprout` only if `brick_sprouter` is **absent**
- **ELITE_SPELL_POOL:** none — camp-tax honesty is the elite. Do **not** unlock Gait Tax as identity.
- **SIGNATURE_MECHANICS:** If `walkMpSpentThisTurn` was 0 on **their previous turn**, next spell costs +1 AP. Needs a last-turn walk snapshot (not a persist stat).
- **VARIANT_PROGRESSION:** BASE frost-or-tax → VETERAN skip-if-they-walked → ELITE tax-then-sprout → CHAMPION not-mpcost
- **RARITY_CURVE:** Standard. +ELITE in Still Sprout.
- **SYNERGIES:** `brick_sprouter`, `tax_scribe`, `glass_sniper`
- **WEAKNESSES:** Walk last turn; Strike; Quiet Hex is already always-on (do not stack as the same lesson)
- **PLAYER_COUNTERPLAY:** Step last turn; melee; kill the Taxer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-tax` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (previous-turn walk snapshot; not `spell.mpCost`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_sprouter`

- **NAME:** Brick Sprouter
- **ROLE:** hazard creator (grow adjacent **barrier** 1 cell)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 10. Distinct from `brick_shifter` (slides), `brick_wiper` (erases), Barrier (paints a new wall from range). At most one grow-barrier CORE per pack as PAIR vs Shift / Wipe / Castellan.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no adjacent barrier exists. Peer: grow along a file they must walk. Above: refuse if growth would close the **only** path (maps stay solvable — skip rather than brick the player in).
- **STAT_SCALING_RULE:** hp 1.00, sp 0.80, sr 1.00, res 1.05, init 0.80, chc 0.70. Identity is **lengthen an existing wall**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "grow_adjacent_barrier_1"`. VETERAN: skip if no adj barrier. ELITE: Still Tax the camped nuke behind the new cell. CHAMPION: growth must leave a legal path (`finalizePlayableLayout` still owns solvability; AI skip is the last line). Does not edit `mapGen.ts`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-brick-sprout`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-still-tax` only if `still_taxer` is **absent**
- **ELITE_SPELL_POOL:** none — grow honesty is the elite. Do **not** unlock Brick Shift as identity.
- **SIGNATURE_MECHANICS:** Choose an adjacent existing barrier; paint one extra orthogonal floor cell as barrier for the barrier’s remaining duration. Occupied dest → fizzle.
- **VARIANT_PROGRESSION:** BASE frost-or-grow → VETERAN skip-if-no-wall → ELITE grow-then-tax → CHAMPION never-softlock
- **RARITY_CURVE:** Standard. +ELITE in Still Sprout.
- **SYNERGIES:** `still_taxer`, `tax_scribe`, `stone_castellan`, `rank_lancer`
- **WEAKNESSES:** Occupy the growth cell; Wipe; walk around
- **PLAYER_COUNTERPLAY:** Stand on the dest; Brick Wipe; kill the Sprouter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-sprout` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (one-cell barrier grow; solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_feer`

- **NAME:** Watch Feer
- **ROLE:** anti-melee / sniper overlay (overwatch snap also costs the walker **1 AP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 10. Distinct from `watch_muter` (snap deals 0), Far Watch / Hold Ground (**are** the snap), `far_hooder` (hit from ≥ 3 → 0). At most one overwatch-AP-tax CORE per pack as PAIR vs Watch Mute / Far Hood / Glass as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no overwatch is armed. Peer: Fee then sit on a file. Above: refuse if they can walk a different file (the tax is then optional).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.90, res 0.75, init 1.15, chc 0.90. Identity is **the snap still deals; pay 1 AP or pick another file**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "overwatch_snap_costs_walker_1_ap"`. VETERAN: skip if no overwatch armed. ELITE: Off Plate so the snap also consumes their miss. CHAMPION: snap still deals; Gap Ward (skip overwatch on a 1-tile walk) is a different peel.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-watch-fee`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-off-plate` only if `off_plater` is **absent**
- **ELITE_SPELL_POOL:** none — AP-tax honesty is the elite. Do **not** unlock Watch Mute as identity.
- **SIGNATURE_MECHANICS:** Next overwatch snap also debits the walker 1 current AP (min 0). Missing AP → snap still deals, AP stays 0.
- **VARIANT_PROGRESSION:** BASE frost-or-fee → VETERAN skip-if-no-watch → ELITE fee-then-off-plate → CHAMPION snap-still-deals
- **RARITY_CURVE:** Standard. +ELITE in Off Watch.
- **SYNERGIES:** `off_plater`, `stone_castellan`, `glass_sniper`
- **WEAKNESSES:** Walk another file; Gap Ward; spend AP first so the tax is 0
- **PLAYER_COUNTERPLAY:** Approach off-file; dump AP; kill the Feer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-fee` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch resolve + AP debit on the walker)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lone_purser`

- **NAME:** Lone Purser
- **ROLE:** assassin (bonus if leftover AP **exactly 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. SDE Wave 10. Distinct from `dry_stinger` (leftover = 0), `full_purser` (≥ 3), `ready_stinger` (AP **and** MP ≥ 1), `purse_keeper` (banks leftover). At most one leftover-exactly-1 poke CORE per pack as PAIR vs Dry / Full / Ready.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover AP is 0 or ≥ 2. Peer: Purse only at exactly 1. Above: refuse to treat 0 as Dry or ≥ 3 as Full.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.80, res 0.70, init 1.20, chc 1.10. Identity is **spend down to 1, or spend the last point**. If it tops the meter without the gate, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "lone_purse_if_leftover_ap_eq_1"`. VETERAN: skip if leftover ≠ 1. ELITE: Dual Keep partner so they hold 1+1. CHAMPION: leftover 0 is 10 only, never a Dry clone.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lone-purse`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-expose`
- **RARE_SPELL_POOL:** `spell-banner-cut` only if `banner_cutter` is **absent**
- **ELITE_SPELL_POOL:** none — exactly-1 honesty is the elite.
- **SIGNATURE_MECHANICS:** 10, plus 8 iff leftover AP **exactly 1** at resolve.
- **VARIANT_PROGRESSION:** BASE strike-or-purse → VETERAN skip-if-not-1 → ELITE wait-for-hold-1 → CHAMPION no-dry-clone
- **RARITY_CURVE:** Standard. +ELITE in Lone Banner.
- **SYNERGIES:** `banner_cutter`, `dual_keeper`, `coil_arbiter`
- **WEAKNESSES:** Spend the last AP; sit on 2+; Shield
- **PLAYER_COUNTERPLAY:** Dump the last point; Haste then spend; kill the Purser
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lone-purse` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (exactly-1 leftover AP read)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `banner_cutter`

- **NAME:** Banner Cutter
- **ROLE:** assassin / anti-leader (bonus vs `isLeader`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. SDE Wave 10. Distinct from `crown_cutter` (`leader_slayer` **grant**, different id), `pet_cutter` (`isSummon`), `coup_duelist` (HP window). At most one leader-bonus CORE per pack as PAIR vs Crown / Pet / Coup.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no `isLeader` on the board. Peer: Cut the leader. Above: refuse to treat Dummy Post / Penta / Sept as leaders (`isLeader` false).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 0.85, res 0.75, init 1.15, chc 1.05. Identity is **20 into the banner, 10 into the pack**. If it tops the meter on non-leaders every fight, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_target_is_leader"`. VETERAN: skip bonus path if `isLeader` is false. ELITE: Coil / Goad to keep the leader legal. CHAMPION: reads `isLeader`, never `"boss"` / `"wolf"` in the name.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-banner-cut`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-expose`
- **RARE_SPELL_POOL:** `spell-lone-purse` only if `lone_purser` is **absent**
- **ELITE_SPELL_POOL:** none — leader-flag honesty is the elite. Do **not** unlock Crown Cut as identity.
- **SIGNATURE_MECHANICS:** 10, plus 10 if target `isLeader`. Dummy Post is not a leader.
- **VARIANT_PROGRESSION:** BASE strike-or-cut → VETERAN skip-if-no-banner → ELITE goad-the-leader → CHAMPION no-name-heuristic
- **RARITY_CURVE:** Standard. +ELITE in Lone Banner.
- **SYNERGIES:** `lone_purser`, `coil_arbiter`, `goad_herald`
- **WEAKNESSES:** Hide the leader; Swap; Shield
- **PLAYER_COUNTERPLAY:** Peel with a non-leader body; kill the Cutter first; Ward Plate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-banner-cut` (ELITE)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`isLeader` flag + second damage call)
- **STATUS:** PROPOSED

---

## 5. Older-family amendments (no new ids)

| Older family | Amendment | Why |
| :--- | :--- | :--- |
| `pale_cantor` / `font_cantor` | May keep Bar Mend / Heave Mend as G≥11 extras | CORE owners are `bar_mender` / `heave_mender`. Extra door stays `heave_cantor`. |
| `purse_keeper` / `stride_keeper` | Do **not** steal Dual Keep as CORE | Two-currency bank is a new sentence. Extra door stays `dual_bursar`. |
| `penta_prelate` / `quad_prelate` | Do **not** steal Sept Span as CORE | Seven-cell stretched plus. Extra door stays `span_sept`. |
| `cadence_trimmer` / `cadence_stretcher` | Do **not** steal Cadence Halve / Pin as CORE | ÷2 and freeze-one are new sentences. Extra door stays `halve_precentor`. |
| `near_hooder` / `far_hooder` | Do **not** steal Mid Hood as CORE | Exact 2. |
| `dry_stinger` / `damp_stinger` / `full_purser` | Do **not** steal Ready Sting / Lone Purse as CORE | Dual-leftover and exactly-1. |
| `home_stepper` / `ally_stepper` | Do **not** steal Heave Step as CORE | Force-gated join. |
| `quiet_siller` / `cast_siller` | Do **not** steal Drift Sill as CORE | Relocate-dest forbid. |
| `boot_holder` / `gait_sealer` | Do **not** steal Drift Hold as CORE | Peel is force-move, not Strike. |
| `spent_lender` / `boot_lender` | Do **not** steal Drift Lend as CORE | Force-gated AP. |
| `gait_sipper` | Do **not** steal Drift Sip as CORE | Force-gated leftover AP. |
| `dummy_prelate` / `ingress_marker` (new this pass) | Dummy does **not** steal Drift Post as CORE | Relocate landing vs taunt vs walk-enter. |
| `storm_caller` / `ricochet_vicar` | Do **not** steal Heave Bounce as CORE | Second body must be force-moved. |
| `must_stepper` / `must_spanner` / `pair_strider` | Do **not** steal Must Drift / Inch Stride as CORE | Vector vs one-walk ≤ 1. Extra door stays `inch_gallery`. |
| `last_muter` / `verse_taxer` | Do **not** steal Verse Pace as CORE | Walk peel, not duration / +1 AP. |
| `hold_knight` / `first_verser` / `tool_holder` | Do **not** steal Rite First as CORE | Spell unlocks Strike. Extra room stays `rite_nave`. |
| `near_oather` | Do **not** steal Long Oath as CORE | Min 3, not max 1. Extra room stays `reach_nave`. |
| `paint_reeler` / `foe_reeler` / `file_reeler` | Do **not** steal Cinder Reel as CORE | Fifth dest flavor. Extra room stays `ash_aisle`. |
| `lone_stinger` / `nook_biter` | Do **not** steal Side Bite as CORE | Adj **ally**, not 0 hostiles / 1 block. |
| `stride_marker` / `gait_wicker` | Do **not** steal Ingress Mark as CORE | Enter, not leave. |
| `morrow_warden` / `sidestep_warder` / `far_hooder` | Do **not** steal Off Plate as CORE | Off-turn damaging hit. |
| `lava_skipper` / `pit_skipper` | Do **not** steal Spike Skip as CORE | Hazard class is spikes. |
| `still_plater` / `empty_plater` | Do **not** steal Tapped Plate as CORE | Wallet is leftover **AP**. |
| `brood_chanter` / `kennel_siller` | Do **not** steal Summon Brace as CORE | Ignore force, not cannot-leave. |
| `clash_mender` | Do **not** steal Bar Mend as CORE | Spell resolve, not Struck. |
| `cadence_staller` / `cadence_thief` | May keep Cadence Pin as G≥10 extra | CORE owner is `cadence_pinner`. Extra room stays `pin_nave`. |
| `gait_taxer` / `ley_tollkeeper` | Do **not** steal Still Tax as CORE | Camped last turn, not walked. |
| `brick_shifter` / `brick_wiper` | Do **not** steal Brick Sprout as CORE | Grow, not slide / erase. |
| `watch_muter` | Do **not** steal Watch Fee as CORE | Snap still deals; walker pays 1 AP. |
| `crown_cutter` / `pet_cutter` | Do **not** steal Banner Cut as CORE | `isLeader` vs grant-id vs `isSummon`. |
| `close_precentor` | CHAMPION may keep `spell-pack-close` as SIGNATURE | Never a world-pack CORE. Never owned. |
| `mid_fold_regent` | Kit-only `spell-mid-fold` | Never a world pack. |
| `court_dual_regent` | Kit-only `spell-court-dual` | Never owned. Mass Dual Keep. |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| All prior waves | Sept Span joins the stationary-post / multi-cell cap | One multi-cell system. Counts as seven. Drift Post joins the 1-cell post cap. |

---

## 6. Identity matrix (Wave 12 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| heave_mender | healAmount gated on both force-moved, defense | isSummon, inferno-as-identity, walk-heal as CORE |
| dual_keeper | bank leftover AP **and** MP next turn start, frost, buff | heal, isSummon, leftover-AP-only / leftover-MP-only as CORE, queue splice |
| sept_prelate | isSummon (septspan), defense | turret/wolf/archer/bomber/dummy/triple/quad/penta/driftpost, heal, shard |
| cadence_halver | floorDivideRemainingCds, damage (frost), debuff | heal, isSummon, −1 trim as CORE, invent-CD-on-zero |
| mid_hooder | exact-2 consume shield, defense, physical | healAmount, isSummon, ≤1 / ≥3 hood as CORE, DoT-eat as CORE |
| ready_stinger | leftover-AP≥1 **and** leftover-MP≥1 bonus, damage (physical) | heal, isSummon, leftover-AP-0 as CORE, leftover-AP≥3 as CORE |
| heave_stepper | relocate caster to force-moved ally adj, defense, physical | isSwap, healAmount, inferno, unforced-home-step as CORE |
| drift_siller | tile forbid relocate dest, frost, isMark | heal, isSummon, quiet-sill / cast-sill as CORE |
| drift_holder | forbidWalkUntilForced, physical, frost | heal, isSummon, Strike-until-walk as CORE, root-as-CORE |
| drift_lender | grant current AP if ally force-moved, buff, frost | healAmount, isSummon, walked-lend as identity |
| drift_sipper | steal leftover AP if force-moved, frost, debuff | heal, isSummon, gait-sip-as-identity, spell.mpCost |
| drift_prelate | isSummon (driftpost), defense | turret/wolf/dummy/bait/sept, heal, walk-enter as CORE |
| heave_bouncer | damage gated bounce-to-forced, frost | heal, isSummon, nearest-any bounce as CORE |
| must_drifter | mustWalkForcedDir, damage (physical), debuff | heal, isSummon, Chebyshev-1-any-dir as CORE |
| verse_pacer | lastResolvedId illegal until walk, frost, debuff | heal, isSummon, last-id-duration as CORE, last-id-+1 as CORE |
| inch_warder | nextWalkMaxChebyshev 1, frost, debuff | heal, isSummon, all-remaining-Must-Step as CORE |
| rite_holder | forbidStrikeUntilSpell, frost, physical | heal, isSummon, Strike-until-walk as CORE |
| long_oather | nextSpellMinRange 3, frost, isMark | heal, isSummon, max-1 oath as CORE |
| cinder_reeler | attractTowardNearestHazard, frost, isMark | heal, isSummon, paint-reel / foe-reel as CORE |
| side_biter | adjacentAllyBonusDamage, frost, physical | heal, isSummon, 0-hostile / 1-block as CORE, name `"wolf"` |
| ingress_marker | detonateOnEnterCell, frost, physical | heal, isSummon, leave-detonate as CORE |
| off_plater | offTurnHitZeroCharges, defense, physical | heal, isSummon, any-turn hood as CORE, evasion buff |
| spike_skipper | nextWalkIgnoresSpikes, physical | heal, isSummon, lava-skip as CORE, ghost-step as CORE |
| tapped_plater | leftoverAp0Res, defense, physical | heal, isSummon, leftover-MP-0 +RES as CORE |
| brace_chanter | alliedSummonIgnoreForced, frost, defense | healAmount as CORE, cannot-leave as CORE |
| bar_mender | healAmount gated on target resolved spell, defense | isSummon, inferno, Struck-heal as CORE, walk-heal as CORE |
| cadence_pinner | pinOneRemainingCd, frost, debuff | heal, isSummon, +1-all as CORE, ÷2 as CORE |
| still_taxer | taxNextSpellIfCampedLastTurn, frost, debuff | heal, isSummon, walked-tax as CORE, spell.mpCost |
| brick_sprouter | growBarrierAdjacent, frost | heal, isSummon, slide / erase as CORE |
| watch_feer | overwatchCostsWalkerAp, physical, frost | heal, isSummon, snap-deals-0 as CORE |
| lone_purser | leftoverApExactly1 bonus, physical | heal, isSummon, leftover-0 poke as CORE |
| banner_cutter | isLeaderBonus, physical | heal, isSummon-as-caster-identity, pet-bonus as CORE, name `"boss"` |

Wave 1–11 matrices in those dated docs still apply to those ids.

---

## 7. Role coverage after Wave 12

| Archetype | Wave 1 owner | Wave 12 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | side_biter |
| sniper | glass_sniper | watch_feer |
| kiter | tide_shade | dual_keeper, spike_skipper |
| assassin | shadow_lurker | ready_stinger, lone_purser, banner_cutter |
| healer | pale_cantor | heave_mender (both force-moved), bar_mender (spell) |
| buffer | hex_chorister | dual_keeper, drift_lender, brace_chanter |
| debuffer | bone_scribe | cadence_halver, drift_sipper, verse_pacer, still_taxer, cadence_pinner |
| summoner | brood_chanter | sept_prelate (7-cell post), drift_prelate (1-cell relocate bomb) |
| controller | coil_arbiter | drift_holder, must_drifter, inch_warder, rite_holder, long_oather, drift_siller |
| tank | iron_golem | mid_hooder, off_plater, tapped_plater |
| protector | leash_warden | heave_stepper, brace_chanter |
| artillery | storm_caller | heave_bouncer |
| kamikaze | cinder_martyr | drift_prelate (post death on landing) |
| teleporter | wraith_bishop, blink_cutter | heave_stepper, spike_skipper |
| displacement | rift_hook | cinder_reeler, must_drifter |
| hazard creator | ember_knight, glyph_sower | drift_siller, ingress_marker, brick_sprouter, drift_prelate |
| status specialist | plague_rat | verse_pacer, cadence_pinner |
| anti-summon | null_censor | brace_chanter (protects **their** pets — teach contrast vs Pet Cut) |
| anti-ranged | void_mirror, rust_reaver | long_oather, inch_warder |
| anti-melee | leash_warden | mid_hooder, off_plater, watch_feer, rite_holder |

Every requested archetype still has a Wave 1 owner. Wave 12 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6 through Wave 11 §8, plus Wave 12 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis.
6. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), `forcedMovedThisTurn`, **`lastForcedMoveDir`**, `lastResolvedSpellId`, `struckThisTurn`.
7. `inferSummonArchetype` gains `septspan` and `driftpost` (and still needs `dummypost` / `triplespan` / `quadspan` / `pentaspan` from Waves 8–11).
8. Raise or gate `ENEMY_SUMMON_CAP` before Sept Span (and Penta / Quad / Triple) can spawn. Live cap 2 makes Sept illegal.
9. Wave 1 kits first (live ids), then later verbs one at a time. Wave 12 slice: both-force heal → leftover-AP+MP bank next-turn-start → seven-cell stretched-plus footprint → CD floor÷2 helper → mid-hood consume → ready sting → heave-step relocate → drift sill → drift-hold → drift-lend → drift-sip → drift-post → heave-bounce → must-drift vector filter → verse-pace walk peel → inch-stride one-walk → rite-first → long-oath → cinder-reel attract → side-bite → ingress-mark cell-enter → off-plate → spike-skip → tapped-plate → summon-brace → bar-mend → cadence-pin → still-tax → brick-sprout → watch-fee → lone-purse → banner-cut.
10. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 11 and SDE Wave 10, never names.
11. Register text updates only when hooks land.
12. Discovery: family observe must not double-grant MULTI / feat doors (`heave-mend`, `dual-keep`, `sept-span`, `cadence-halve`, `inch-stride`).
13. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not splice the turn queue for Dual Keep.

---

## 9. Held for a later wave (no ids reserved here)

These need SPELL_PROPOSALS / SDE to stamp ids first, **or** they stay closed. This run does **not** mint colliding `wave12:` spell ids.

- SDE Wave 11 unique CORE (`spell-diag-stride` … `spell-adj-fold`) — Wave 13 families if they still have no CORE owner
- SPELL_PROPOSALS Wave 12 (PR #787, `spell-parched-mend` … `spell-court-imprint`, including Six Span) — Wave 13 consumes those
- Mid-RAF splice of the current actor (AGENTS.md)
- Fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders)
- Sixth echo id
- Player-owned Hex of Silence
- Six-cell occupy (`spell-six-span` on #787; Twin = 2, Triple = 3, Quad = 4, Penta = 5, Sept = 7 this pass)
- Eight-cell occupy
- Heal-if-**both leftover AP = 0** (`spell-dry-mend`, SDE Wave 11 — Wave 13)
- 180° pair hinge (`spell-about-hinge`, never owned)
- Refresh (extend) all remaining CDs **including zeros**
- Pack Tithe / Court Stretch / Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual / About Hinge / Pack Long / Adj Fold as world-pack CORE
- Facing writer families (still blocked on combat `currentView`)
- Cone `areaShape` **reader** family (Gale / Fan still own the unread hole)

---

## 10. What this run did not do

- No production TypeScript / Motoko / Candid.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, 13 Wave 6, 14 Wave 7, 17 Wave 8, 32 Wave 9, 32 Wave 10, or 32 Wave 11 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `spell-court-dual` / `spell-pack-close` / `spell-mid-fold` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-court-stretch` / `spell-pack-tithe` / `spell-about-hinge` / `spell-pack-long` / `spell-adj-fold` world-pack CORE.
- No SDE Wave 11 unique CORE as this pass’s CORE.
- No SPELL_PROPOSALS Wave 12 (`spell-parched-mend` … #787) as this pass’s CORE.
- No `wave12:` colliding spell ids.
- No restamp of claimed feat / challenge / extra-door keys.

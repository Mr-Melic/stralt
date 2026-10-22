# Enemy and Elite Evolution Design — Wave 14

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-22  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Fourteenth daily pass. **31** new world-pack families that consume remaining **SDE Wave 12 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`, open PR #802) **except** Dry Gait (Wave 13 already stamped `spell-dry-gait`), plus **SPELL_PROPOSALS Wave 13 verbs** (`SPELL_PROPOSALS_2026-10-21.md`, open PR #849). Pack Cap / Reach Fold / Court Lag stay **ENEMY_ONLY / BOSS_ONLY / kit-only** — not world-pack CORE. SDE Wave 13 unique CORE (`spell-knight-stride` … `spell-diag-fold`, open PR #837) stays extras until Wave 15. Bosses stay on the existing catalog.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 13

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–13. Wave 13 closed as docs in the 2026-10-21 pass (PR #840). SPELL_PROPOSALS latest is Wave 13 (#849). SDE latest is Wave 13 (#837). This pass consumes remaining **#802** unique CORE (minus Dry Gait, Pack Cap, Reach Fold) plus **#849** (minus Court Lag). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥12 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 13 claim | 2026-10-22 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–13 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt Post count as **1**. Triple = 3. Quad = 4. Penta = 5. Six = 6. Sept = 7. **Oct Span = 8** — skip Oct until remaining cap ≥ 8 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Gaunt Mend / Still Gift **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `octspan` / `gauntpost` (and still no `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Facing families still fail closed. Wave 14 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 14 CORE rows stay `mpCost: 0`. Bare Sip / Gaunt Lend rewrite **current leftover AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Brick Reel is the **seventh** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void, then **barrier**). Gaunt Step is occupancy dest, **not** `isSwap` |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Wave 10–13 force families still fail closed. Wave 14 adds **zero** force-gated CORE |
| `lastResolvedSpellId` | Absent | Wave 10 `last_muter`, Wave 11 `verse_taxer`, Wave 12 `verse_pacer`, Wave 13 `verse_leaner`, and Wave 14 `verse_gaunter` fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` still waits. Wave 14 adds **zero** Struck families |
| `walkMpSpentThisTurn` | Absent | Still Gift / Gaunt* leftover-MP gates fail closed until battle walks write leftover MP |
| One next walk orthogonal / next-spell exact Chebyshev 3 / pull toward nearest **barrier** / isolated-from-all-units bite / start-turn occupy detonate / leftover-MP≥1 hit 0 / 1-tile **glyph-tax** skip / leftover-MP≥3 +RES / allied-summon walk **MP** tax / heal-if-target walk-MP=0 / next own spell skip CD / next walk +1 AP if they **spelled** last turn / orbit adjacent barrier / overwatch snap grants **walker** AP / leftover-MP exactly 2 poke / bonus if target shares axis with a pet | Still absent as CORE identities | Wave 14 secondary opportunity (SDE Wave 12 unique CORE leftover) |
| Heal-if-both leftover AP **and** leftover MP = 0 / remaining CDs `n>0` → `n+2` / eight-cell hollow occupy / even-Chebyshev miss / fully-spent sting / join fully-spent ally / start-turn fully-spent sill / cannot-walk-while-leftover-AP-odd / +AP+MP if ally fully spent / steal leftover AP iff leftover MP=0 / end-turn occupy fully-spent post / bounce among fully-spent / non-Strike illegal unless leftover MP=0 **and** last AP / last-id illegal until both leftover 0 / Strike illegal unless leftover MP=0 **and** last AP | Still absent in live catalog | Wave 14 primary opportunity (SPELL_PROPOSALS Wave 13) |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Gait Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Lone Bite is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Glyph Skip is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Full Gait is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cast Debt is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Brick Reel is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 14 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 14 family pass consumes remaining **#802** unique CORE (minus Dry Gait / Pack Cap / Reach Fold) plus **#849** (minus Court Lag). **Wave 15** consumes SDE Wave 13 unique CORE (`spell-knight-stride` … `spell-diag-fold`, except whatever a later boss sheet claims). This run does not mint colliding `wave14:` spell ids. Same-day 2026-10-22 SPELL_PROPOSALS / SDE, if any open during this cron, stay Wave **15** family CORE — do not clone them here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` stay never-owned unless a later boss sheet claims them.

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

**Stationary-post / multi-body cap (extend Wave 13):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, or Oct Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-/eight-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, **or** an Oct Span hollow 3×3 ring, never two of those. Dummy Post, Drift Post, Lean Post, and Gaunt Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied** by the summon; that hole is not a ninth occupy cell.

**Summon-cap prerequisite (extend Wave 13):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Six Span is illegal until remaining cap ≥ 6. Sept Span is illegal until remaining cap ≥ 7. **Oct Span is illegal until remaining cap ≥ 8.** Dummy Post / Drift Post / Lean Post / Gaunt Post are legal at remaining ≥ 1. Do not spawn `oct_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 13):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched* leftover-MP gates / Dry Gait / **Gaunt Mend** / **Gaunt Sting** / **Gaunt Step** / **Gaunt Sill** / **Gaunt Lend** / **Bare Sip** / **Gaunt Post** / **Gaunt Bounce** / **Must Gaunt** / **Verse Gaunt** / **Gaunt Hold** / **Gait Plate** / **Full Gait** / **Still Gift** / **Pair Gait** / **Summon Gait** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / **Gaunt Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 13):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / **Gaunt Mend** / **Odd Hold** / **Gaunt Lend** / **Bare Sip** / **Gaunt Post** / **Gaunt Bounce** / **Must Gaunt** / **Verse Gaunt** / **Gaunt Hold** fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep pay at **next turn start** — after that pay, leftover is the new current.

**Last-id prerequisite (extend Wave 13):** Last Mute / Verse Tax / Verse Pace / Verse Lean / **Verse Gaunt** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move / facing / Struck prerequisites (unchanged):** Wave 14 adds **zero** force-gated, facing, or Struck CORE cards. Those writers remain implementation prerequisites for Waves 6–13.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Gaunt Mend MULTI child `gaunt_cantor` — first child wins vs `gaunt_mender` observe. Cadence Lag MULTI child `lag_precentor` — first child wins vs `cadence_lagger` observe. Oct Span MULTI child `span_oct` — first child wins vs `oct_prelate` observe. Court Lag stays `court_lag_regent` kit-only. Orth Stride MULTI child `orth_gallery` — first child wins vs `orth_warder` observe. Tri Oath MULTI child `tri_nave` — first child wins vs `tri_oather` observe. Brick Reel MULTI child `brick_aisle` — first child wins vs `brick_reeler` observe. Wake Mark MULTI child `wake_pulpit` — first child wins vs `wake_marker` observe. Brick Orbit MULTI child `orbit_nave` — first child wins vs `brick_orbiter` observe. Pack Cap stays `cap_precentor` kit-only. Reach Fold stays `reach_fold_regent` kit-only. Pack File stays `file_precentor` kit-only. Diag Fold stays `diag_fold_regent` kit-only. Gaunt Mend / Dry Gait / Dry Mend / Still Gift / Hollow Gift have **no** shared extra door — do **not** restamp `parched_cantor` / `gait_cantor` / invent `hollow_cantor` / `dry_cantor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`.

---

## 2. Why Wave 14 exists (gaps Waves 1–13 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait.

SPELL_PROPOSALS Wave 13 (#849) then stamped the holes Wave 13 **held**: both leftover-AP **and** leftover-MP = 0 heal, remaining CDs `n>0` → `n+2`, eight-cell occupy, even-Chebyshev miss, and the fully-spent court. A G≥13 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 12 unique CORE still had no CORE owner after Wave 13 except Dry Gait. Sixteen of those verbs fill holes Wave 13 tactical does not: one next walk **orthogonal**, next-spell exact Chebyshev **3**, pull toward nearest **barrier**, isolated-from-**all-units** bite, **start-turn** occupy detonate, leftover-MP≥1 hit 0, 1-tile **glyph-tax** skip, leftover-MP≥3 +RES, allied-summon walk **MP** tax, heal-if-**target** walk-MP=0, next own spell skip CD, next walk +1 AP if they **spelled** last turn, orbit adjacent barrier, overwatch snap grants **walker** AP, leftover-MP **exactly 2** poke, bonus if target shares **axis** with a pet. Pack Cap and Reach Fold stay closed.

| Unused Wave 13 / SDE Wave 12 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-gaunt-mend` (heal 8 iff **caster and target** leftover **AP = 0 and MP = 0**) | `dry_gaiter` (both leftover **MP = 0**); `dry_mender` (both leftover **AP = 0**); `still_mender` (caster walk-MP spent = 0); `still_gifter` (this pass, **target** walk-MP = 0) | Four leftover flags. Dual Keep **blocks**. Extra door is `gaunt_cantor` — family is **`gaunt_mender`**. Do **not** restamp `parched_cantor`. Hollow Gift (#837) is **target-only** both-pools — Wave 15. |
| `spell-cadence-lag` (remaining `n>0` become `n+2`; zeros stay 0) | `cadence_staller` (**+1** all); `cadence_imprinter` (**copy** matching onto caster); `cadence_halver` (**÷2**); `cadence_gracer` (this pass, **next own** skip CD write) | Pad running locks. Extra door is `lag_precentor` — family is **`cadence_lagger`**. Cadence Swap (#837) is the **map exchange** — Wave 15. |
| `spell-oct-span` (hollow 3×3 ring, counts as **eight**) | `sept_prelate` (stretched plus = 7); `six_prelate` (2×3 = 6); `penta_prelate` (plus = 5) | Eight tiles, one body, empty kit, **center hole walkable**. Extra door is `span_oct` — family is **`oct_prelate`**. Skip until remaining cap ≥ 8. |
| `spell-even-hood` (next hit from **even** Chebyshev → 0) | `odd_hooder` (**odd**); `near_hooder` (**≤ 1**, odd); `mid_hooder` (**exactly 2**, even subset); `far_hooder` (**≥ 3**, mixed) | Stand at odd range. Same-cell (0, even) **misses**. |
| `spell-gaunt-sting` (10 + 8 iff leftover **AP = 0 and leftover MP = 0**) | `dry_stinger` (leftover **AP = 0**); `lean_stinger` (leftover **AP = 0 and MP ≥ 1**); `pair_gaiter` (this pass, leftover **MP exactly 2**) | Punish the fully-spent window. Dual Keep **blocks** the 8. |
| `spell-gaunt-step` (caster lands on a free Chebyshev-1 of an ally with leftover **AP = 0 and MP = 0**) | `parched_stepper` (leftover **MP = 0**); `home_stepper` (**ungated**); `heave_stepper` (**force-moved** ally) | Join the body that already dumped **both** pools. Relocate, not `isSwap`. |
| `spell-gaunt-sill` (occupant fully spent at **start of their turn** takes 8; paint stays) | `wake_marker` (this pass, start-turn occupy **any leftover**, consume); `parched_siller` (cannot spend walk MP); `dwell_marker` (**end-turn** occupy) | Tax the camp **on their turn start**. Dual Keep **saves**. |
| `spell-odd-hold` (cannot walk while leftover AP is **odd**) | `dry_holder` (cannot walk until leftover **AP = 0**); `drift_holder` (until **force-moved**); `gait_sealer` (cannot walk; spells legal) | Leftover 1 / 3 cannot step. Leftover 0 / 2 can. Dry Hold is the stricter cousin. |
| `spell-gaunt-lend` (+1 AP **and** +1 MP to an ally whose leftover **AP = 0 and MP = 0**) | `lean_lender` (+1 **MP** if leftover **AP = 0**); `spent_lender` (+1 **MP** if they **walked**); `drift_lender` (+1 **AP** if **forced**) | Fund a step **and** an action after they emptied both. |
| `spell-bare-sip` (steal 1 leftover AP iff leftover **MP = 0** and leftover AP ≥ 1) | `parched_sipper` (steal leftover **MP** iff leftover **AP = 0**); `gait_sipper` (steal **MP** iff they **walked**); Watch Sip (#837, overwatch snap — Wave 15) | Tax the dry-walk / wet-purse window. Inverse of Parched Sip. |
| `spell-gaunt-post` (empty-kit body; **end-turn occupy with leftover AP = 0 and MP = 0** deals 10 and it dies) | `lean_prelate` (leftover **AP = 0** only); `dummy_prelate` (taunt); `drift_prelate` (**relocate landing**); `dwell_marker` (end-turn occupy, **any leftover**) | Camp 1 leftover AP **or** 1 leftover MP on the post, or dump both and eat 10. Counts as **1**. `summonAI: "gauntpost"`. |
| `spell-gaunt-bounce` (12 to primary; bounce 8 to nearest **other** leftover-AP=0 **and** leftover-MP=0 hostile) | `parched_bouncer` (leftover **MP = 0** only); `heave_bouncer` (**force-moved**); Chain Lightning (nearest **any**) | Second 8 needs **two** leftover-0 flags. Missing flag → 12 only. |
| `spell-must-gaunt` (remaining **non-Strike** spells illegal unless leftover **MP = 0 and this spell spends last AP**) | `must_leaner` (leftover **MP = 0** only); `hold_caster` (**all** spells until they **walk**); `gaunt_holder` (this pass, **Strike** needs leftover MP=0 **and** last AP) | Inverse of Gaunt Hold. Strike stays legal. **Do not PAIR with Gaunt Hold.** |
| `spell-verse-gaunt` (last resolved id **illegal until leftover AP = 0 and leftover MP = 0**) | `verse_leaner` (until leftover **MP = 0**); `verse_pacer` (until they **walk**); `last_muter` (**duration**) | Recast Inferno only after **both** pools are empty. Forced-move does **not** peel. |
| `spell-gaunt-hold` (cannot Strike until leftover **MP = 0 and Strike spends last AP**) | `lean_holder` (leftover **MP = 0** only); `hold_knight` (cannot Strike until **walk**); `must_gaunter` (this pass, **tools** need leftover MP=0 **and** last AP) | Inverse of Must Gaunt. Tools stay legal. **Do not PAIR with Must Gaunt.** |
| `spell-orth-stride` (**next walk** legal only if orthogonal) | `diag_warder` (**requires** diagonal); `inch_warder` (one next ≤ 1, **diagonal 1 legal**); `must_stepper` (all remaining Chebyshev 1); `diag_locksmith` (**forbids** diagonal dests) | Extra door is `orth_gallery` — family is **`orth_warder`**. Opposite of Diag Stride. |
| `spell-tri-oath` (next spell must be Chebyshev **exactly 3**) | `mid_oather` (exact **2**); `long_oather` (**≥ 3**); `near_oather` (**≤ 1**); `mid_hooder` (next **hit** from exactly 2 → 0) | Frost at 1, 2, or ≥ 4 fizzles. Strike stays legal. Extra room `tri_nave` is a teach — family is **`tri_oather`**. |
| `spell-brick-reel` (pull 1 toward nearest **barrier**) | `void_reeler` (toward **void/portal**); `cinder_reeler` (toward **hazard**); `paint_reeler` (toward **paint**); `foe_reeler` (toward a **body**) | Seventh `applyAttract` dest flavor. Extra room `brick_aisle` is a teach — family is **`brick_reeler`**. Dest is **toward**, not onto, a world portal. Empty board fizzles. |
| `spell-lone-bite` (10 + 8 if target has **0 living units of any side** at Chebyshev 1) | `lone_stinger` (0 adj **hostiles** — allies allowed); `foe_biter` (needs adj **hostile**); `side_biter` (needs adj **ally**) | Isolated from **everyone**, including pets and the caster. Neighbor decoy **blocks**. |
| `spell-wake-mark` (cell detonates if they **start their turn** on it; consume) | `dwell_marker` (**end-turn** occupy); `ingress_marker` (**enter**); `gaunt_siller` (this pass, start-turn occupy **and both leftover 0**, paint **stays**); `stride_marker` (**leave**) | Walk-on and walk-off the same turn is free. Extra room `wake_pulpit` is a teach — family is **`wake_marker`**. |
| `spell-gait-plate` (next hit is 0 **while leftover MP ≥ 1**; consume on miss) | `own_plater` (**own-turn**, any MP); `off_plater` (**off-turn**); `near_hooder` (Chebyshev ≤ 1); `full_gaiter` (this pass, leftover MP ≥ 3 **+RES**, not a miss) | Keep 1 walk chip. Drain MP first. |
| `spell-glyph-skip` (next **1-tile** walk ignores **glyph-tax**) | `cinder_skipper` (**cinder**); `spike_skipper` (**spikes**); `lava_skipper` (**lava**); `pit_skipper` (**pits**) | Wrong hazard still ticks. Length ≥ 2 pays. |
| `spell-full-gait` (leftover **MP ≥ 3** → +RES) | `full_plater` (leftover **AP ≥ 3**); `still_plater` (leftover **MP = 0**); `tapped_plater` (leftover AP = 0) | Keep 3 walk MP after the 2-AP arm. Last RES% writer vs Iron Skin. |
| `spell-summon-gait` (allied summons pay +1 **MP** to **start a walk**) | `summon_toller` (+1 **AP**); `walk_toller` (taxes the **caster’s** walk); `kennel_siller` (pets cannot leave) | Pets sit or pay walk MP. Player copy taxes **their** pets. **Do not PAIR with Summon Toll.** |
| `spell-still-gift` (heal 8 iff **target** spent 0 walk MP) | `still_mender` (**caster** spent 0 walk MP); `gaunt_mender` (this pass, both leftover AP **and** MP = 0); `dry_gaiter` (both leftover **MP = 0**) | Healer CORE only. Caster may have walked. Target already walked → fizzle. |
| `spell-cadence-grace` (next own spell **does not start its cooldown**) | `cadence_rester` (own remaining **do not tick**); `cadence_lagger` (this pass, **+2** on them); `cadence_pinner` (freeze **one hostile**) | Free-CD Inferno is the nightmare. Strike is **not** a spell for this key. |
| `spell-cast-debt` (next walk +1 AP if they **spelled** last turn) | `spent_taxer` (next **spell** +1 if they **walked**); `still_taxer` (next spell +1 if they **camped**); Debt Mark (unconditional next-walk tax) | Strike last turn → fizzle. Teleport / Swap do not pay. |
| `spell-brick-orbit` (move one **adjacent** barrier to another adjacent empty cell) | `brick_shifter` (**slides along an axis**); `brick_cracker` (**removes**); `brick_sprouter` (**grows**) | Orbit, not slide. Solvability skip is mandatory. Extra room `orbit_nave` is a teach — family is **`brick_orbiter`**. |
| `spell-watch-alms` (next **overwatch snap** grants the **walker** +1 AP) | `watch_lender` (grants the **watcher**); `watch_feer` (**debits** the walker); `watch_muter` (snap deals **0**) | Paying the walker for snapping is a bait. **Do not PAIR with Watch Fee.** |
| `spell-pair-gait` (10 + 8 if leftover MP **exactly 2**) | `pair_purser` (leftover **AP** exactly 2); `lone_purser` (leftover AP exactly 1); `ready_stinger` (leftover AP **and** MP both ≥ 1); `gaunt_stinger` (this pass, leftover AP **and** MP both = 0) | Spend down to 2 walk MP, or spend the pair. |
| `spell-leash-cut` (10 + 10 if target shares **rank or file** with a living allied summon) | `escort_cutter` (pet at Chebyshev ≤ 2, **any geometry**); `leash_cutter` (Wave 8 **Short Leash** — different verb); `pet_cutter` (bonus on the **pet**); `banner_cutter` (`isLeader`) | Prefer the handler on the file. Family is **`axis_cutter`** — Wave 8 already claimed `leash_cutter`. Dummy Post is not a pet. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-lag` (`NOT_PLAYER_LEARNABLE`; `court_lag_regent` kit — same law as Court Imprint on `imprint` CHAMPION witness), `spell-pack-cap` (ENEMY_ONLY; stays `cap_precentor` CHAMPION SIGNATURE), `spell-reach-fold` (BOSS_ONLY; `reach_fold_regent` kit — never a world pack), `spell-pack-file` / `spell-diag-fold` (SDE Wave 13 never-owned until a boss sheet). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint stay where Waves 5–13 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 14 CORE rows are `mpCost: 0`. Bare Sip / Gaunt Lend rewrite **current leftover AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Gaunt Post / Wake Mark / Cadence Lag are **not** queue splices.  
Do **not** family a nine-cell occupy. Oct Span is the eight-cell card. Sept Span already owns seven.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Hollow Gift / Cadence Swap / Knight Stride / Quad Oath / Pit Reel / Axis Bite / Shove Mark / Spent Plate / Rime Skip / Full Sting / Summon Cast / Strike Debt / Brick Nudge / Watch Sip / Lone Gait / Hazard Cut / Drift Gift (SDE Wave 13 unique CORE — Wave 15).  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs **including zeros**. Lag is `n>0` → `n+2`; zeros stay ready.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 13 unique CORE as this pass’s CORE.  
Do **not** mint `wave14:` colliding spell ids.  
Do **not** name the Gaunt Mend family `gaunt_cantor`, the Cadence Lag family `lag_precentor`, the Oct Span family `span_oct`, the Orth Stride family `orth_gallery`, the Tri Oath family `tri_nave`, the Brick Reel family `brick_aisle`, the Wake Mark family `wake_pulpit`, the Brick Orbit family `orbit_nave`, or the Leash Cut family `leash_cutter`.

---

## 3. Encounter synergy packs (Waves 1–14)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Gaunt Choir | `gaunt_mender` + `verse_gaunter` + `ignite_alchemist` | Dual-dry 8, then Inferno is illegal until both leftover 0 |
| Oct Plug | `oct_prelate` + `gaunt_siller` + `rank_lancer` | Hollow 3×3 seal, tax the hole at turn start, lance the ring. Skip until remaining cap ≥ 8 |
| Even Orth | `even_hooder` + `orth_warder` + `glass_sniper` | Even-range miss + next walk must be orthogonal + snipe from 3 |
| Gaunt Court | `gaunt_stinger` + `bare_sipper` + `odd_holder` | Fully-spent poke, steal leftover AP on dry walk, nail odd leftover AP walks |
| Gaunt Quiet | `gaunt_stepper` + `gaunt_mender` + `cover_squire` | Join the fully-spent ally, then cash the four leftover-0 8 |
| Gaunt Gate | `gaunt_prelate` + `gaunt_siller` + `gaunt_stinger` | Post detonates both-leftover-0 occupy; tile taxes start-of-turn; sting the rest |
| Bounce Ring | `gaunt_bouncer` + `must_gaunter` + `fuse_binder` | Two fully-spent bodies, bounce 12+8 onto the wick |
| Gaunt Hold File | `gaunt_holder` + `must_gaunter` + `leash_warden` | Strike **and** tools need leftover MP = 0 **and** last AP — COURT, never PAIR Gaunt Hold + Must Gaunt on the same body without a third peeler |
| Orth Tri | `orth_warder` + `tri_oather` + `far_stinger` | Next walk must be orthogonal, next spell must be exact 3 |
| Brick Wake | `brick_reeler` + `wake_marker` + `glyph_sower` | Pull toward the wall, paint the start-turn cell |
| Lone Axis | `lone_biter` + `axis_cutter` + `brood_chanter` | Isolation bonus, then axis-pet bonus on the handler |
| Gait Watch | `gait_plater` + `watch_almer` + `stone_castellan` | Leftover-MP≥1 miss, then the snap they walk into funds +1 AP |
| Glyph Full | `glyph_skipper` + `full_gaiter` + `ley_tollkeeper` | Cross the tax tile, then leftover-MP≥3 +RES |
| Still Grace | `still_gifter` + `cadence_gracer` + `once_cantor` | Camped-target heal, then Inferno does not start CD |
| Debt Orbit | `debt_caster` + `brick_orbiter` + `tax_scribe` | Tax the walk after they spelled, then orbit the wall they hid behind |
| Pair Gift | `pair_gaiter` + `still_gifter` + `coil_arbiter` | Poke leftover MP exactly 2, then cash target walk-MP=0 |
| Gait Kennel | `summon_gaiter` + `kennel_siller` + `null_censor` | Pets pay MP to walk, then they cannot leave — teach contrast vs Brace / Toll |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), and Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel).

Do **not** pack as PAIR (COURT later is fine):

- `gaunt_mender` + `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `cadence_lagger` + `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner`
- `oct_prelate` + `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `even_hooder` + `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater`
- `gaunt_stinger` + `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `lone_purser` / `pair_purser` / `pair_gaiter` / `full_purser`
- `gaunt_stepper` + `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire`
- `gaunt_siller` + `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker`
- `odd_holder` + `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver`
- `gaunt_lender` + `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `bare_sipper` + `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon`
- `gaunt_prelate` + `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate`
- `gaunt_bouncer` + `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_gaunter` + `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `gaunt_holder` as PAIR
- `verse_gaunter` + `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor`
- `gaunt_holder` + `lean_holder` / `hold_knight` / `rite_holder` / `tool_holder` / `boot_holder` / `must_gaunter` as PAIR
- `orth_warder` + `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith`
- `tri_oather` + `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR
- `brick_reeler` + `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter`
- `lone_biter` + `foe_biter` / `side_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter`
- `wake_marker` + `dwell_marker` / `ingress_marker` / `gaunt_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder`
- `gait_plater` + `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `full_gaiter` as PAIR
- `glyph_skipper` + `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper`
- `full_gaiter` + `full_plater` / `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden` / `gait_plater` as PAIR
- `summon_gaiter` + `summon_toller` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `still_gifter` + `gaunt_mender` / `still_mender` / `dry_gaiter` / `dry_mender` / `bar_mender` / `pale_cantor`
- `cadence_gracer` + `cadence_rester` / `cadence_lagger` / `cadence_thief` / `cadence_pinner` / `cadence_staller`
- `debt_caster` + `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_orbiter` + `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan`
- `watch_almer` + `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `pair_gaiter` + `pair_purser` / `gaunt_stinger` / `lone_purser` / `dry_stinger` / `ready_stinger`
- `axis_cutter` + `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as PAIR

Do **not** spawn Oct Plug on a map with no free 3×3 ring (solvability). Do not spawn Brick Wake / Brick Orbit on a map with no barrier in Chebyshev 6 of a legal floor. Do not spawn Glyph Full on a map with no glyph-tax / AP-zone cell. Do not spawn Gait Kennel without a living allied summon already on the board **or** a dedicated summoner that is not PAIR-banned.

---

## 4. Family sheets — Wave 14

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-21.md`](https://github.com/Mr-Melic/stralt/pull/849) (PR #849) unless marked SDE Wave 12 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-1c4e/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md), PR #802).

---

### ENEMY_ID: `gaunt_mender`

- **NAME:** Gaunt Mender
- **ROLE:** healer (heal iff caster **and** target leftover **AP = 0 and MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Gaunt Mend (`spell-gaunt-mend`, #849). Extra door `gaunt_cantor` — family is **not** that id. Distinct from `dry_gaiter` (leftover **MP**), `dry_mender` (leftover **AP**), `still_mender` (caster walk-MP spent = 0), `still_gifter` (target walk-MP = 0). Hollow Gift (#837) is **target-only** both-pools — not this CORE. At most one four-flag heal CORE per pack as PAIR vs Dry / Still / Heave / Both / Pale / Gift.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if any leftover ≥ 1. Peer: Gaunt Mend only if all four leftover = 0 **and** missing HP ≥ 8. Above: refuse if Dual Keep / Purse Keep / Stride Keep still banks either pool (Frost / Shield). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already empty on both pools**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_eq_0_and_leftover_mp_eq_0"`. VETERAN: skip if any leftover ≥ 1 **or** missing HP < 8. ELITE: wait for Walk Toll / Drain Courage. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; Dual Keep leftover is **not** empty.
- **CORE_SPELL_POOL:** `spell-gaunt-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-bare-sip` only if `bare_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — four-flag honesty is the elite. Do **not** unlock Dry Gait / Dry Mend / Hollow Gift as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff all four leftover reads = 0 after the 3 AP is paid. Fails closed without leftover writers. Self-cast requires the caster’s leftover AP **and** MP are 0.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-wet → ELITE wait-for-toll → CHAMPION no-dump-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Gaunt Quiet / Gaunt Choir.
- **SYNERGIES:** `gaunt_stepper`, `bare_sipper`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover AP **or** 1 leftover MP; Cursed Wound halves the 8; Dual Keep
- **PLAYER_COUNTERPLAY:** Keep 1 leftover on one pool of one body; Root the cantor; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-mend` (MULTI: family observe **or** `gaunt_cantor` first-win — first child wins). Do **not** restamp `parched_cantor` / `both_cantor` / `heave_cantor` / `gait_cantor`.
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_lagger`

- **NAME:** Cadence Lagger
- **ROLE:** debuffer / controller (remaining CDs `n>0` become `n+2`; zeros stay 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_staller` (+1 all), `cadence_imprinter` (copy matching onto caster), `cadence_halver` (÷2), `cadence_gracer` (next own skip CD write), `cadence_thief` (steals). Extra door is `lag_precentor` — family is **not** that id. Cadence Swap (#837) is the map exchange — not this CORE. At most one remaining-CD-pad CORE per pack as PAIR vs Stall / Imprint / Halve / Grace / Theft.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is 0. Peer: Lag if any remaining ≥ 2 **and** the caster can live without that lock this turn. Above: refuse if the only lock is already ≥ 4 and a Strike would kill, or if Crack already zeroed the map.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **padded downtime**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "lag_if_target_has_remaining_cd_ge_2"`. VETERAN: skip if every remaining is 0. ELITE: Lag then Verse Gaunt the padded id. CHAMPION: never Lag a 1 they needed this turn; zeros stay ready (Lag is **not** a silence of unused tools).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-lag`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-verse-gaunt` only if `verse_gaunter` is **absent**
- **ELITE_SPELL_POOL:** none — pad honesty is the elite. Do **not** unlock Cadence Stall / Swap as identity.
- **SIGNATURE_MECHANICS:** For each of the target’s remaining CDs with `n > 0`, write `n+2`. Zeros stay 0. Target keeps every spell. Once/battle flags and spell levels are not CDs.
- **VARIANT_PROGRESSION:** BASE frost-or-pad → VETERAN skip-if-empty → ELITE pad-then-verse → CHAMPION refuse-self-brick
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Choir.
- **SYNERGIES:** `verse_gaunter`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Recast the locked id **before** Lag; Cadence Crack their highest to 0; sit on all-zero remaining
- **PLAYER_COUNTERPLAY:** Recast Inferno first; Crack; fight with no running CDs
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-lag` (MULTI: family observe **or** `lag_precentor` first-win — first child wins). Do not restamp `imprint_precentor` / `halve_precentor` / `trim_precentor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk remaining map, add 2 when n>0)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `oct_prelate`

- **NAME:** Oct Prelate
- **ROLE:** summoner (stationary hollow 3×3 occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate`. Extra door is `span_oct` — family is **not** that id. At most one Oct Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 8.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place center hole if an 8-cell ring seals a corridor around a player already on the hole. Peer: skip if any of the eight is blocked **or** remaining cap < 8. Above: Gaunt Sill the hole so start-of-turn occupy taxes.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.15, init 0.65, chc 0.70. Oct uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `octspan` (#849): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **eight** Chebyshev-1 neighbors as one combatant id; **center hole stays unoccupied**. VETERAN: skip if remaining cap < 8. ELITE: Gaunt Sill the hole. CHAMPION: never punch a hole if a later pit lands on one ring cell — whole ring dies.
- **CORE_SPELL_POOL:** `spell-oct-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the ring)
- **RARE_SPELL_POOL:** `spell-gaunt-sill` only if `gaunt_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / driftpost / leanpost / gauntpost on this body.
- **SIGNATURE_MECHANICS:** Hollow 3×3: click a free center; all 8 neighbors must be free. Counts as **eight**. Empty kit. 0 XP on ring death. Brick Shift / Brick Orbit do **not** move occupy cells. The hole is walkable / targetable.
- **VARIANT_PROGRESSION:** BASE ring → VETERAN respect-cap-8 → ELITE sill-the-hole → CHAMPION whole-ring-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 8. Weight 0 on cramped boards with no free 3×3 (solvability).
- **SYNERGIES:** `gaunt_siller`, `rank_lancer`, `cast_siller`
- **WEAKNESSES:** Burst the 8 HP; Swap through the hole; sit on a ring cell so the place fizzles; open field
- **PLAYER_COUNTERPLAY:** Occupy a ring cell before they arm; Ignite the 8; artillery if LoS is open from a far diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-oct-span` (MULTI: family observe **or** `span_oct` first-win — first child wins). Oct kit is empty — nothing to steal from the ring.
- **REWARD_EXPECTATION:** Standard. Ring death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "octspan"`; eight-cell hollow footprint helper; do not spawn eight initiative seats; solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `even_hooder`

- **NAME:** Even Hooder
- **ROLE:** tank (next hit from **even** Chebyshev → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `odd_hooder` (odd), `near_hooder` (≤ 1), `mid_hooder` (exactly 2), `far_hooder` (≥ 3), `own_plater` (own-turn any range), `gait_plater` (leftover-MP miss). ELITE observe. At most one even-parity hood CORE per pack as PAIR vs Odd / Near / Mid / Far / Own / Off / Gait Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Hood if the only threat sits at 0 or 2. Peer: skip if the only threat sits at 1 (odd — they land). Above: Hood then Orth Stride so their next walk cannot diagonal-cut to 1.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.80, sr 1.00, res 1.10, init 0.90, chc 0.70. Identity is **parity**, not extra RES. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "even_hood_if_likely_next_hit_even_chebyshev"`. VETERAN: skip if the only threat sits at 1. ELITE: pair with Orth Stride. CHAMPION: consume **before** `dealDamage`; DoT does **not** consume; same-cell (0, even) **misses**.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-even-hood`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-orth-stride` only if `orth_warder` is **absent**
- **ELITE_SPELL_POOL:** none — parity honesty is the elite. Do **not** unlock Odd Hood / Mid Hood as identity.
- **SIGNATURE_MECHANICS:** Next applied damaging hit whose Chebyshev is even (0, 2, 4, …) deals 0 and consumes. Odd (1, 3, 5, …) lands and does **not** consume. Do not read `CharacterStats.evasion`.
- **VARIANT_PROGRESSION:** BASE hood-or-shield → VETERAN skip-if-odd-threat → ELITE hood-then-orth → CHAMPION consume-before-damage
- **RARITY_CURVE:** Standard. +ELITE in Even Orth.
- **SYNERGIES:** `orth_warder`, `glass_sniper`, `must_stepper` (forces odd 1 — they **land**; teach contrast)
- **WEAKNESSES:** Walk to 1; Must Step; melee
- **PLAYER_COUNTERPLAY:** Stand at Chebyshev 1; Attack Nearest from adjacent; DoT
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-even-hood` (ENEMY_DISCOVERY observe+win). Do not restamp `even_gallery` / `odd_gallery`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-hit consume gated on Chebyshev parity)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_stinger`

- **NAME:** Gaunt Stinger
- **ROLE:** assassin (bonus if leftover **AP = 0 and leftover MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `dry_stinger` (leftover AP = 0), `lean_stinger` (leftover AP = 0 **and** MP ≥ 1), `pair_gaiter` (leftover MP exactly 2), `pair_purser` (leftover AP exactly 2). At most one fully-spent poke CORE per pack as PAIR vs Dry / Lean / Pair Gait / Pair Purse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if either leftover ≥ 1. Peer: Sting if both leftover = 0. Above: refuse if Dual Keep still banks; wait for Bare Sip / Walk Toll.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.85, res 0.70, init 1.20, chc 1.10. Identity is **the fully-spent 8**. If it tops the meter without the gate, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_0_and_leftover_mp_eq_0"`. VETERAN: skip if either gate fails and Strike is better. ELITE: wait for Bare Sip. CHAMPION: never dump the player’s leftover **only** to enable this if a Strike would kill.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-gaunt-sting`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-bare-sip` only if `bare_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — dual-dry poke is the elite. Do **not** unlock Dry Sting / Lean Sting as identity.
- **SIGNATURE_MECHANICS:** Deal 10. If leftover AP = 0 **and** leftover MP = 0, extra 8 as a second `dealDamage`. Dual Keep leftover is **not** 0.
- **VARIANT_PROGRESSION:** BASE sting-or-strike → VETERAN skip-if-wet → ELITE wait-for-sip → CHAMPION no-dump-to-enable
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Court / Gaunt Gate.
- **SYNERGIES:** `bare_sipper`, `odd_holder`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover AP **or** 1 leftover MP; Dual Keep; burst the glass pawn
- **PLAYER_COUNTERPLAY:** Keep a 1-chip; Haste; kill it first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-sting` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_stepper`

- **NAME:** Gaunt Stepper
- **ROLE:** kiter / protector (caster lands adjacent to an ally with leftover **AP = 0 and MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** `starter-heal`. Distinct from `parched_stepper` (leftover MP = 0), `home_stepper` (ungated), `heave_stepper` (force-moved ally), `ally_stepper` (they land next to caster). Relocate, not `isSwap`. At most one fully-spent join CORE per pack as PAIR vs Parched / Home / Heave / Ally.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if either leftover ≥ 1 or no free dest. Peer: Step if both leftover = 0 **and** a free Chebyshev-1 exists. Above: Step then Gaunt Mend.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 1.00, res 0.80, init 1.15, chc 0.80. Identity is **join the empty ally**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "gaunt_step_if_ally_both_leftover_eq_0_and_free_adj"`. VETERAN: skip if either leftover ≥ 1 or no free dest. ELITE: Step then Gaunt Mend. CHAMPION: never Step onto the only player↔exit path (solvability).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gaunt-step`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-gaunt-mend` only if `gaunt_mender` is **absent** (healer profile required — skip this rare if the Stepper is not a healer)
- **ELITE_SPELL_POOL:** none — join honesty is the elite. Do **not** unlock Parched Step as identity.
- **SIGNATURE_MECHANICS:** If the target’s leftover AP = 0 **and** leftover MP = 0, relocate the **caster** onto a free Chebyshev-1. No free dest or either leftover ≥ 1 → fizzle (AP spent, caster stays). Does **not** increment `walkMpSpentThisTurn`.
- **VARIANT_PROGRESSION:** BASE frost-or-join → VETERAN skip-if-wet → ELITE join-then-mend → CHAMPION solvability skip
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Quiet.
- **SYNERGIES:** `gaunt_mender`, `cover_squire`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover on the ally; occupy every Chebyshev-1; Root the Stepper
- **PLAYER_COUNTERPLAY:** Body-block the dest ring; Dual Keep the ally; kill the Stepper first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-step` (ENEMY_DISCOVERY observe+win). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest pick, not `swapPositions`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_siller`

- **NAME:** Gaunt Siller
- **ROLE:** hazard creator (occupant fully spent at **start of their turn** takes 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `wake_marker` (start-turn occupy **any leftover**, consume), `parched_siller` (cannot spend walk MP), `dwell_marker` (end-turn occupy). At most one start-turn fully-spent sill CORE per pack as PAIR vs Wake / Parched / Dwell.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if the player can Dual Keep or walk off for 1 MP. Peer: paint the cell they are likely to **begin** on. Above: paint then Odd Hold so leftover AP 1 cannot walk off.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 1.00, init 0.90, chc 0.75. Identity is **start-of-turn tax**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "gaunt_sill_on_likely_fully_spent_camp"`. VETERAN: skip if they can Dual Keep or walk off. ELITE: pair with Odd Hold. CHAMPION: paint **stays** after the 8 (can tax again); Dual Keep leftover is **not** empty.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-gaunt-sill`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-odd-hold` only if `odd_holder` is **absent**
- **ELITE_SPELL_POOL:** none — start-turn honesty is the elite. Do **not** unlock Wake Mark as identity.
- **SIGNATURE_MECHANICS:** Paint one free cell 2 turns. When a body **starts their turn** occupying it, if leftover AP = 0 **and** leftover MP = 0, deal 8 and **keep** the paint. Either leftover ≥ 1 → no damage, paint stays. Enter / leave / end-turn do **not** detonate.
- **VARIANT_PROGRESSION:** BASE paint-or-shield → VETERAN skip-if-they-can-leave → ELITE paint-then-odd-hold → CHAMPION persist-paint
- **RARITY_CURVE:** Standard. +ELITE in Oct Plug / Gaunt Gate.
- **SYNERGIES:** `oct_prelate`, `odd_holder`, `gaunt_prelate`
- **WEAKNESSES:** Dual Keep; walk off before turn start; blink off
- **PLAYER_COUNTERPLAY:** Keep 1 leftover AP **or** MP at turn start; leave the cell; send a summon
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-sill` (ENEMY_DISCOVERY observe+win). Detonate does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile flag on turn-start leftover reads)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_holder`

- **NAME:** Odd Holder
- **ROLE:** controller (cannot walk while leftover AP is **odd**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `dry_holder` (cannot walk until leftover AP = 0), `drift_holder` (until force-moved), `gait_sealer` (cannot walk; spells legal). At most one leftover-AP-parity walk lock CORE per pack as PAIR vs Dry / Drift / Gait Seal.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP is already even. Peer: Hold if leftover AP is 1 or 3 **and** they want to walk. Above: Hold then Bare Sip to flip even leftover AP onto odd.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 0.95, res 0.90, init 1.10, chc 0.80. Identity is **parity of leftover AP**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "odd_hold_if_target_leftover_ap_odd_and_wants_to_walk"`. VETERAN: skip if leftover AP is already even and they have no 3-cost. ELITE: pair with Bare Sip. CHAMPION: leftover 0 (even) **may walk** — that is the teach vs Dry Hold.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-odd-hold`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-bare-sip` only if `bare_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — parity lock is the elite. Do **not** unlock Dry Hold as identity.
- **SIGNATURE_MECHANICS:** 2 of **their** turns: walk confirm fails (MP not spent) while leftover AP is odd (1, 3, 5, …). Even leftover AP (0, 2, 4, …) may walk. Force-move / swap / blink still legal.
- **VARIANT_PROGRESSION:** BASE frost-or-hold → VETERAN skip-if-even → ELITE hold-then-sip → CHAMPION teach-zero-is-even
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Court.
- **SYNERGIES:** `bare_sipper`, `gaunt_stinger`, `must_gaunter`
- **WEAKNESSES:** Spend to leftover 0 or 2; blink; force-move
- **PLAYER_COUNTERPLAY:** Dump to 0 AP then walk; Swap; sit and Strike
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-hold` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm gated on leftover-AP parity)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_lender`

- **NAME:** Gaunt Lender
- **ROLE:** buffer (+1 AP **and** +1 MP if the ally is fully spent)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `lean_lender` (+1 MP if leftover AP = 0), `spent_lender` (+1 MP if they walked), `drift_lender` (+1 AP if forced). At most one dual-pool lend CORE per pack as PAIR vs Lean / Spent / Drift / Boot.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if either leftover ≥ 1. Peer: Lend if both leftover = 0 **and** they need a step or an action. Above: refuse if Gaunt Mend would save a kill this turn (COURT, not PAIR).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 1.00, res 0.80, init 1.20, chc 0.70. Identity is **1/1 after empty**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "lend_1ap_1mp_if_ally_both_leftover_eq_0"`. VETERAN: skip if either leftover ≥ 1. ELITE: Lend then Gaunt Sting a different body. CHAMPION: never Lend the player a 1/1 that enables their lethal.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gaunt-lend`
- **ADVANCED_SPELL_POOL:** `spell-rallying-cry` stays `usableByEnemy: false` unless this sheet flips it — **do not flip**. Use `starter-shield` instead, `spell-slow`
- **RARE_SPELL_POOL:** `spell-gaunt-sting` only if `gaunt_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — dual-lend honesty is the elite. Do **not** unlock Lean Lend as identity.
- **SIGNATURE_MECHANICS:** If leftover AP = 0 **and** leftover MP = 0, grant +1 current AP and +1 current walk MP (HUD pools, not a duration buff). Either leftover ≥ 1 → fizzle (AP spent, no grant). Dual Keep leftover is **not** 0.
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-wet → ELITE lend-then-sting → CHAMPION refuse-player-lethal
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Quiet (COURT with Mender, not PAIR).
- **SYNERGIES:** `gaunt_stinger`, `odd_holder`, `cover_squire`
- **WEAKNESSES:** Keep 1 leftover; Dual Keep; kill the Lender first
- **PLAYER_COUNTERPLAY:** Stay wet; burst the bishop; do not dump both pools next to it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-lend` (ENEMY_DISCOVERY observe+win). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + two pool increments)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `bare_sipper`

- **NAME:** Bare Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover **MP = 0** and leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `parched_sipper` (steal leftover **MP** iff leftover **AP = 0**), `gait_sipper` (steal MP iff they walked), `soul_siphon` (ungated MP). Watch Sip (#837) is overwatch snap — Wave 15. At most one dry-walk AP-steal CORE per pack as PAIR vs Parched / Gait / Drift / Soul.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover MP ≥ 1 or leftover AP = 0. Peer: Sip if leftover MP = 0 **and** leftover AP ≥ 1. Above: Sip then Odd Hold (stealing 1 flips even leftover AP onto odd).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.05, sr 0.90, res 0.70, init 1.15, chc 1.00. Identity is **the steal**, not the 8. If it tops the meter without the gate, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "steal_1_leftover_ap_if_leftover_mp_eq_0"`. VETERAN: skip if leftover MP ≥ 1 or leftover AP = 0 and Strike is better. ELITE: Sip then Odd Hold. CHAMPION: clamp at 0 / kit max; never steal into a player lethal leftover.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-bare-sip`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-venom-strike`
- **RARE_SPELL_POOL:** `spell-odd-hold` only if `odd_holder` is **absent**
- **ELITE_SPELL_POOL:** none — dry-walk steal is the elite. Do **not** unlock Parched Sip as identity.
- **SIGNATURE_MECHANICS:** Deal 8. If leftover MP = 0 **and** leftover AP ≥ 1, steal 1 leftover AP (their current −1, caster current +1). Otherwise 8 only. This is a flag rewrite, **not** `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE sip-or-strike → VETERAN skip-if-wet-walk → ELITE sip-then-odd-hold → CHAMPION clamp-honesty
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Court.
- **SYNERGIES:** `odd_holder`, `gaunt_stinger`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover MP; sit at leftover AP 0; burst the glass pawn
- **PLAYER_COUNTERPLAY:** Keep 1 walk chip; dump AP first; Haste
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bare-sip` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover MP gate + 1 AP steal + existing `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_prelate`

- **NAME:** Gaunt Prelate
- **ROLE:** kamikaze / summoner (empty-kit body; end-turn occupy detonates iff fully spent)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Replaces random overlay on this body. Distinct from `lean_prelate` (leftover AP = 0 only), `dummy_prelate` (taunt), `drift_prelate` (relocate landing), `dwell_marker` (end-turn occupy, any leftover), `wake_marker` (start-turn tile). Counts as **1**. `summonAI: "gauntpost"`. At most one Gaunt Post per pack. Legal at remaining cap ≥ 1.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place on the cell they are likely to **end** on empty. Peer: skip if they can Dual Keep or walk off. Above: place then Gaunt Sill so surviving the end-turn tax still pays at next start.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.70, sr 1.00, res 0.90, init 0.80, chc 0.70. Post uses `getSummonBaseStats` with `damageScale: 0`, HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `gauntpost` (#849): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, 1-cell. VETERAN: skip if Dual Keep / walk-off is free. ELITE: Gaunt Sill the same cell. CHAMPION: leftover AP ≥ 1 **or** leftover MP ≥ 1 is safe (no damage, post stays); death of the occupant does not grant XP from the post.
- **CORE_SPELL_POOL:** `spell-gaunt-post`
- **ADVANCED_SPELL_POOL:** `starter-shield`
- **RARE_SPELL_POOL:** `spell-gaunt-sill` only if `gaunt_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / dummy / leanpost / driftpost / octspan on this body.
- **SIGNATURE_MECHANICS:** Place on a free cell. Counts as **one**. At **end of a unit’s turn**, if that unit occupies this cell and leftover AP = 0 **and** leftover MP = 0, deal 10 and the post dies. Walk-on is legal. Relocate-landing does **not** detonate. Start-of-turn occupy does **not** detonate.
- **VARIANT_PROGRESSION:** BASE mine → VETERAN skip-if-they-can-leave → ELITE mine-then-sill → CHAMPION chip-is-safe
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Gate. Weight 0 if remaining cap < 1.
- **SYNERGIES:** `gaunt_siller`, `gaunt_stinger`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover AP **or** MP; walk off; Dual Keep; burst the 8
- **PLAYER_COUNTERPLAY:** End turn with a 1-chip; leave the cell; Swap the post onto a summon
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-post` (ENEMY_DISCOVERY observe+win). Post kit is empty.
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED (`summonAI: "gauntpost"`; end-turn leftover gate; same class as Lean Post)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_bouncer`

- **NAME:** Gaunt Bouncer
- **ROLE:** artillery (bounce among fully-spent hostiles)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** `starter-heal`. Distinct from `parched_bouncer` (leftover MP = 0 only), `heave_bouncer` (force-moved), `storm_caller` (always bounce), `ricochet_vicar` (predicate bounce). At most one fully-spent bounce CORE per pack as PAIR vs Parched / Heave / Storm / Ricochet.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second fully-spent body in r4. Peer: Bounce if a second leftover-AP=0 **and** leftover-MP=0 hostile exists. Above: wait for Walk Toll on two bodies.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 1.00, res 0.75, init 1.05, chc 0.90. Identity is **the second 8**. If it tops the meter on a single 12, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bounce_if_second_hostile_both_leftover_eq_0_in_r4"`. VETERAN: skip if no second match and Frost is better. ELITE: wait for Must Gaunt. CHAMPION: bounce search is existing helper; missing flag → 12 only (still observes).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gaunt-bounce`
- **ADVANCED_SPELL_POOL:** `spell-inferno` only if the second body is already committed, `spell-slow`
- **RARE_SPELL_POOL:** `spell-must-gaunt` only if `must_gaunter` is **absent**
- **ELITE_SPELL_POOL:** none — dual-dry bounce is the elite. Do **not** unlock Parched Bounce as identity.
- **SIGNATURE_MECHANICS:** Deal 12 to the primary. Bounce once to the nearest **other** hostile whose leftover AP = 0 **and** leftover MP = 0, dealing 8 (search radius 4). No second match → 12 only.
- **VARIANT_PROGRESSION:** BASE frost-or-bounce → VETERAN skip-if-no-second → ELITE wait-for-must → CHAMPION 12-only-honesty
- **RARITY_CURVE:** Standard. +ELITE in Bounce Ring.
- **SYNERGIES:** `must_gaunter`, `fuse_binder`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover on the second body; spread beyond r4; Dual Keep
- **PLAYER_COUNTERPLAY:** Keep a 1-chip on one body; stand 5+ apart; kill the Bouncer first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-bounce` (ENEMY_DISCOVERY observe+win). 12-only still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (existing bounce search with two leftover gates)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_gaunter`

- **NAME:** Must Gaunter
- **ROLE:** controller (non-Strike spells illegal unless leftover **MP = 0 and this spell spends last AP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `must_leaner` (leftover MP = 0 only), `hold_caster` (all spells until they walk), `tool_holder` (tools until Strike), `gaunt_holder` (Strike needs leftover MP=0 **and** last AP). At most one last-AP tool-lock CORE per pack as PAIR vs Must Lean / Cast Hold / Tool / Gaunt Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already sit dry-walk / last-AP. Peer: Must if leftover MP ≥ 1 **or** leftover AP > next spell cost. Above: Must then Gaunt Bounce a different body (COURT, not PAIR with Gaunt Hold).
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 0.95, res 0.90, init 1.05, chc 0.80. Identity is **tools need last AP**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_gaunt_if_target_has_leftover_mp_ge_1_or_leftover_ap_gt_next_spell_cost"`. VETERAN: skip if they already sit dry-walk / last-AP. ELITE: pair with Walk Toll. CHAMPION: Strike stays legal; Absolve / Dispel Thread peel; default **no** duration tick.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-must-gaunt`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-gaunt-bounce` only if `gaunt_bouncer` is **absent**
- **ELITE_SPELL_POOL:** none — last-AP tool lock is the elite. Do **not** unlock Must Lean / Gaunt Hold as identity.
- **SIGNATURE_MECHANICS:** Rest of battle (or until Absolve / Dispel Thread): remaining **non-Strike** spells confirm-fail unless leftover walk MP = 0 **and** leftover AP **after paying that spell** would be 0. Strike remains legal under its own rules.
- **VARIANT_PROGRESSION:** BASE frost-or-must → VETERAN skip-if-already-dry → ELITE must-then-toll → CHAMPION strike-exempt
- **RARITY_CURVE:** Standard. +ELITE in Bounce Ring / Gaunt Hold File (COURT with Holder, not PAIR).
- **SYNERGIES:** `gaunt_bouncer`, `leash_warden`, `walk_toller`
- **WEAKNESSES:** Strike; Absolve; sit dry-walk / last-AP already
- **PLAYER_COUNTERPLAY:** Strike through it; dump MP then spend last AP on Frost; Dispel
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-gaunt` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (confirm gate on leftover MP and post-pay leftover AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_gaunter`

- **NAME:** Verse Gaunter
- **ROLE:** debuffer (last resolved id illegal until leftover **AP = 0 and leftover MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `verse_leaner` (until leftover MP = 0), `verse_pacer` (until they walk), `last_muter` (duration), `verse_taxer` (legal but +1 AP). At most one dual-dry last-id lock CORE per pack as PAIR vs Verse Lean / Pace / Last Mute / Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no last id or last id is Strike. Peer: Verse if last id is their best **and** they hold leftover. Above: Verse after Cadence Lag pads that id (COURT).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **the last id waits for both empty**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "verse_gaunt_if_target_last_id_is_their_best_and_they_hold_leftover"`. VETERAN: skip if no last id or last id is Strike. ELITE: pair with Cadence Lag. CHAMPION: other ids remain legal; Dual Keep **blocks** the unlock; forced-move does **not** peel.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-gaunt`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-cadence-lag` only if `cadence_lagger` is **absent**
- **ELITE_SPELL_POOL:** none — dual-dry last-id is the elite. Do **not** unlock Verse Lean as identity.
- **SIGNATURE_MECHANICS:** Remember the target’s **last resolved spell id** at arm. That id’s confirm fails until leftover AP = 0 **and** leftover MP = 0. Fails closed without `lastResolvedSpellId`.
- **VARIANT_PROGRESSION:** BASE frost-or-verse → VETERAN skip-if-no-last → ELITE verse-then-lag → CHAMPION other-ids-legal
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Choir.
- **SYNERGIES:** `cadence_lagger`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Recast a different id; dump both leftover; Strike
- **PLAYER_COUNTERPLAY:** Cast a cheap id last; dump both pools; Dispel
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-gaunt` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (last-id register + two leftover reads on confirm)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gaunt_holder`

- **NAME:** Gaunt Holder
- **ROLE:** anti-melee (Strike illegal unless leftover **MP = 0 and Strike spends last AP**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `lean_holder` (leftover MP = 0 only), `hold_knight` (cannot Strike until walk), `rite_holder` (cannot Strike until a spell), `must_gaunter` (tools need leftover MP=0 **and** last AP). At most one last-AP Strike lock CORE per pack as PAIR vs Lean Hold / Hold Knight / Must Gaunt.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already sit dry-walk / leftover AP = Strike cost. Peer: Hold if they want Strike with leftover MP ≥ 1 **or** leftover AP ≠ Strike cost. Above: Hold then Must Gaunt on a **different** body (COURT, never PAIR).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.90, sr 0.95, res 0.95, init 1.00, chc 0.80. Identity is **Strike needs last AP**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "gaunt_hold_if_target_wants_strike_with_leftover_mp_or_leftover_ap_ne_strike_cost"`. VETERAN: skip if they already sit dry-walk / leftover AP = 2. ELITE: pair with Walk Toll. CHAMPION: other spells remain legal; 2 of **their** turns.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gaunt-hold`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** none — do **not** rare-pool Must Gaunt onto this body
- **ELITE_SPELL_POOL:** none — last-AP Strike lock is the elite. Do **not** unlock Lean Hold / Must Gaunt as identity.
- **SIGNATURE_MECHANICS:** 2 of **their** turns: confirm of `physical_attack` fails unless leftover walk MP = 0 **and** leftover AP **before paying Strike equals Strike’s AP cost**. Tools stay legal.
- **VARIANT_PROGRESSION:** BASE frost-or-hold → VETERAN skip-if-already-dry → ELITE hold-then-toll → CHAMPION tools-legal
- **RARITY_CURVE:** Standard. +ELITE in Gaunt Hold File (COURT with Must Gaunter).
- **SYNERGIES:** `leash_warden`, `walk_toller`, `must_gaunter` (COURT only)
- **WEAKNESSES:** Dump MP then spend last AP on Strike; tools; Dispel
- **PLAYER_COUNTERPLAY:** Cast Frost / Inferno; dump to leftover AP = Strike cost with leftover MP 0; Dispel
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gaunt-hold` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (Strike confirm gated on leftover MP and leftover AP == cost)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `orth_warder`

- **NAME:** Orth Warder
- **ROLE:** controller (one next walk must be **orthogonal**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `diag_warder` (requires diagonal), `inch_warder` (one next ≤ 1, diagonal 1 legal), `must_stepper` (all remaining Chebyshev 1), `diag_locksmith` (forbids diagonal dests). Extra door is `orth_gallery` — family is **not** that id. At most one next-walk-orthogonal CORE per pack as PAIR vs Diag / Inch / Must Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if only diagonal dests remain and Strike is better. Peer: Orth if a rank/file dest exists. Above: Orth then Even Hood so a 2-walk (even) misses.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.85, sr 1.00, res 0.95, init 1.05, chc 0.80. Identity is **one orthogonal step**. If it tops the meter, the kit leaked. **Do not** assign to kits whose only walk is knight-jump.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "walk_orthogonal_only"`. VETERAN: skip if only diagonal dests remain and Strike is better. ELITE: pair with Even Hood. CHAMPION: Teleport / Swap / Twin-gate / Phase Slip do **not** pay and do **not** consume; fail closed (confirm fails), never become Strike.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-orth-stride`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-even-hood` only if `even_hooder` is **absent**
- **ELITE_SPELL_POOL:** none — orthogonal honesty is the elite. Do **not** unlock Diag Stride as identity.
- **SIGNATURE_MECHANICS:** Stance, 1 turn. The caster’s **next walk** this turn is legal **only** if orthogonal (`|dx|==0 XOR |dy|==0`, length ≥ 1). Diagonal dests fail confirm; MP is not spent. Observation is the **arm**.
- **VARIANT_PROGRESSION:** BASE shield-or-orth → VETERAN skip-if-only-diag → ELITE orth-then-even-hood → CHAMPION teleport-exempt
- **RARITY_CURVE:** Standard. +ELITE in Even Orth / Orth Tri. +ELITE on `orth_gallery` maps.
- **SYNERGIES:** `even_hooder`, `tri_oather`, `rank_lancer`
- **WEAKNESSES:** Stand on a diagonal; Root; occupy the rank and file
- **PLAYER_COUNTERPLAY:** Sit diagonal; Root; Force a knight-jump kit (they skip)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-orth-stride` (MULTI: family observe **or** `orth_gallery` first-win — first child wins). Arm observes; later walk does not.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-walk dest confirm orthogonal)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tri_oather`

- **NAME:** Tri Oather
- **ROLE:** sniper / controller (next spell illegal unless Chebyshev **exactly 3**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `mid_oather` (exact 2), `long_oather` (≥ 3), `near_oather` (≤ 1), `mid_hooder` (exact-2 incoming miss). Extra door is `tri_nave` — family is **not** that id. At most one exact-3 oath CORE per pack as PAIR vs Mid / Long / Near. **Do not** stack with Pack Cap (maxRange 2 vs exact 3) on a BASE kit.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they must stay at 1–2. Peer: Oath then Glass Shot / File Lance / Far Sting at 3. Above: Oath then Orth Stride so they cannot diagonal-cut to 2.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 1.05, res 0.70, init 1.10, chc 0.90. Identity is **exact 3**. If it tops the meter at range 1, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_spell_exact_chebyshev_3"`. VETERAN: skip if they must stay at 1–2. ELITE: next cast is Far Sting / File Lance, not Strike. CHAMPION: Strike stays legal at 1; confirm at 1, 2, or ≥ 4 fails (AP not spent).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-tri-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-orth-stride` only if `orth_warder` is **absent**
- **ELITE_SPELL_POOL:** none — exact-3 honesty is the elite. Do **not** unlock Mid Oath / Pack Cap as identity.
- **SIGNATURE_MECHANICS:** 1 turn. Next **spell** (`damage > 0` or non-physical tool) is illegal unless the target is Chebyshev **exactly 3**. Strike / `physical_attack` stays legal at 1.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee-range → ELITE oath-then-far → CHAMPION strike-exempt
- **RARITY_CURVE:** Standard. +ELITE in Orth Tri. +ELITE on `tri_nave` maps.
- **SYNERGIES:** `orth_warder`, `far_stinger`, `glass_sniper`
- **WEAKNESSES:** Walk to 1, 2, or 4+; Quiet Hex the 3-range poke
- **PLAYER_COUNTERPLAY:** Close to 1; run to 4; Strike them first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tri-oath` (MULTI: family observe **or** `tri_nave` first-win — first child wins). Arm observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-spell range confirm exact 3)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_reeler`

- **NAME:** Brick Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest **barrier**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `void_reeler` (void/portal), `cinder_reeler` (hazard), `paint_reeler` (paint), `foe_reeler` (body), `ally_reeler` (ally), `file_reeler` (file toward caster). Extra door is `brick_aisle` — family is **not** that id. At most one barrier-pull CORE per pack as PAIR vs Void / Cinder / Paint / Foe / Ally / File. Skip if no barrier exists.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no barrier in Chebyshev ≤ 6 of the target. Peer: Reel if the 1-step does **not** seal the only player↔exit path. Above: Reel onto glyph-tax / cinder / ally overwatch.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 1.00, res 1.05, init 0.90, chc 0.75. Identity is **the pull**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_barrier"`. VETERAN: skip if none, or if the 1-step would seal the only player↔exit path. ELITE: pair with Wake Mark. CHAMPION: dest is a barrier tile, not `map.portals`; occupancy / void / world portal fizzle that step; empty-board fizzle still observes.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-brick-reel`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-wake-mark` only if `wake_marker` is **absent**
- **ELITE_SPELL_POOL:** none — barrier-pull honesty is the elite. Do **not** unlock Void Reel as identity.
- **SIGNATURE_MECHANICS:** No damage. Attract the target 1 tile toward the nearest **barrier** cell. No barrier in Chebyshev ≤ 6 → fizzle (AP spent, no move). Seventh `applyAttract` dest flavor.
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-none-or-seal → ELITE reel-then-wake → CHAMPION portal-safe
- **RARITY_CURVE:** Standard. +ELITE in Brick Wake. +ELITE on `brick_aisle` maps. Weight 0 on open boards with no barrier.
- **SYNERGIES:** `wake_marker`, `glyph_sower`, `brick_orbiter` (COURT, not PAIR)
- **WEAKNESSES:** Fight in open boards; occupy the toward-tile; Hook the Reeler off the wall
- **PLAYER_COUNTERPLAY:** Stand off the barrier; body-block the toward-cell; burst the rook
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-reel` (MULTI: family observe **or** `brick_aisle` first-win — first child wins). Empty-board fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (seventh `applyAttract` dest; solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lone_biter`

- **NAME:** Lone Biter
- **ROLE:** assassin / bruiser (bonus if the target is isolated from **all** units)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `lone_stinger` (0 adj **hostiles** — allies allowed), `foe_biter` (needs adj hostile), `side_biter` (needs adj ally). At most one isolation-from-everyone bite CORE per pack as PAIR vs Lone Sting / Foe / Side.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if any neighbor exists. Peer: Bite if 0 living units of any side at Chebyshev 1. Above: refuse if a decoy / pet / the caster is adjacent.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 0.85, res 0.75, init 1.15, chc 1.05. Identity is **the isolated 8**. If it tops the meter in a crowd, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_target_isolated"`. VETERAN: skip if any neighbor and Strike is better. ELITE: Pawn Trade / Sever Tether first (COURT). CHAMPION: neighbor summons, decoys, **and the caster** all count; do not also apply Foe Bite’s adjacent-hostile bonus on G=0.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lone-bite`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-venom-strike`
- **RARE_SPELL_POOL:** none — isolation honesty is the elite
- **ELITE_SPELL_POOL:** none. Do **not** unlock Foe Bite / Lone Sting as identity.
- **SIGNATURE_MECHANICS:** Deal 10. If the target has **0** living units of any side at Chebyshev 1, extra 8 as a second `dealDamage`.
- **VARIANT_PROGRESSION:** BASE bite-or-strike → VETERAN skip-if-crowd → ELITE isolate-then-bite → CHAMPION caster-counts
- **RARITY_CURVE:** Standard. +ELITE in Lone Axis.
- **SYNERGIES:** `axis_cutter`, `brood_chanter`, `pawn_broker`
- **WEAKNESSES:** Park a summon adjacent; stand next to an ally; False Retreat decoy
- **PLAYER_COUNTERPLAY:** Keep a pet at Chebyshev 1; body-block with a decoy; fight in the pack
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lone-bite` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev-1 occupancy count + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wake_marker`

- **NAME:** Wake Marker
- **ROLE:** hazard creator (cell detonates if they **start their turn** on it)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `dwell_marker` (end-turn occupy), `ingress_marker` (enter), `gaunt_siller` (start-turn occupy **and both leftover 0**, paint stays), `stride_marker` (leave). Extra door is `wake_pulpit` — family is **not** that id. At most one start-turn detonate CORE per pack as PAIR vs Dwell / Ingress / Gaunt Sill.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they can walk off for 1 MP before their turn. Peer: paint the cell they are likely to **begin** on. Above: paint then Cast Debt so they cannot leave cheap.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.05, chc 0.80. Identity is **start-of-turn 10**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "detonate_if_start_turn_on_cell"`. VETERAN: skip if they can walk off for 1 MP. ELITE: pair with Cast Debt / Root. CHAMPION: consume-on-first-body; Teleport / Swap onto the cell does **not** detonate until their next turn **starts** there; detonate does not second-observe.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-wake-mark`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-cast-debt` only if `debt_caster` is **absent**
- **ELITE_SPELL_POOL:** none — start-turn honesty is the elite. Do **not** unlock Dwell Mark / Gaunt Sill as identity.
- **SIGNATURE_MECHANICS:** `freeCells: true`. Paint one floor tile 2 turns. If a hostile **begins their turn** occupying the cell, they take 10 (spell, RES+SR) and the paint **consumes**. Enter, leave, and end-turn occupy do **not** detonate.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-they-can-leave → ELITE paint-then-debt → CHAMPION consume-on-first
- **RARITY_CURVE:** Standard. +ELITE in Brick Wake. +ELITE on `wake_pulpit` maps.
- **SYNERGIES:** `brick_reeler`, `glyph_sower`, `debt_caster`
- **WEAKNESSES:** Walk off before your turn; blink off; send a summon to camp it
- **PLAYER_COUNTERPLAY:** Leave the cell; Swap off; park a pet on it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wake-mark` (MULTI: family observe **or** `wake_pulpit` first-win — first child wins). Paint observes; detonate does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (start-of-turn occupy consume; distinct from end-turn Dwell)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_plater`

- **NAME:** Gait Plater
- **ROLE:** tank (next hit is 0 while leftover **MP ≥ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `own_plater` (own-turn, any MP), `off_plater` (off-turn), `near_hooder` (Chebyshev ≤ 1), `full_gaiter` (leftover MP ≥ 3 +RES, not a miss). At most one leftover-MP miss CORE per pack as PAIR vs Own / Off / Full Gait.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if they must spend that MP to leave a hazard. Peer: Plate if leftover MP ≥ 1 after the 2-AP arm. Above: refuse if leftover MP is already 0 (Frost / Shield).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.00, res 1.15, init 0.80, chc 0.70. Identity is **keep 1 walk chip**. If it tops the meter, the kit leaked toward Iron Skin.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_if_leftover_mp_ge_1"`. VETERAN: skip if they must spend that MP to leave a hazard. ELITE: pair with Haste / Debt Mark so they do not want to walk. CHAMPION: leftover MP 0 at impact → hit lands fully **and** the charge remains; Strike and spells both consume when they miss.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-gait-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** none — do **not** rare-pool Full Gait onto this BASE kit
- **ELITE_SPELL_POOL:** none — leftover-MP miss is the elite. Do **not** unlock Own Plate / Full Gait as identity.
- **SIGNATURE_MECHANICS:** 2 turns. The next damaging hit against the caster is 0 **if** leftover MP at impact is ≥ 1; the charge then consumes. Leftover MP 0 → hit lands, charge remains.
- **VARIANT_PROGRESSION:** BASE shield-or-plate → VETERAN skip-if-must-walk → ELITE plate-then-debt → CHAMPION zero-mp-lands
- **RARITY_CURVE:** Standard. +ELITE in Gait Watch.
- **SYNERGIES:** `watch_almer`, `stone_castellan`, `debt_caster`
- **WEAKNESSES:** Drain MP first (Frost / Slow / Soul Sip); wait until they walk to 0; Dispel
- **PLAYER_COUNTERPLAY:** Force a walk; Slow; Dispel; hit them after they dump MP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-plate` (ENEMY_DISCOVERY observe+win). Negated hit does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-hit consume gated on leftover MP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `glyph_skipper`

- **NAME:** Glyph Skipper
- **ROLE:** kiter / anti-hazard (next **1-tile** walk ignores **glyph-tax**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `cinder_skipper` (cinder), `spike_skipper` (spikes), `lava_skipper` (lava), `pit_skipper` (pits), Gap Ward (overwatch). At most one glyph-tax skip CORE per pack as PAIR vs Cinder / Spike / Lava / Pit.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the path is the wrong hazard or length ≥ 2. Peer: Skip if a 1-tile glyph-tax dest exists. Above: Skip then Cast Debt so the 1-step also costs AP.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.80, init 1.15, chc 0.90. Identity is **ignore glyph-tax once**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "skip_glyph_tax_one_tile"`. VETERAN: skip if the path is the wrong hazard or length ≥ 2. ELITE: pair with Cast Debt. CHAMPION: cinder / lava / spikes / pits / void still apply; Teleport / Swap do not consume.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-glyph-skip`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-venom-strike`
- **RARE_SPELL_POOL:** `spell-cast-debt` only if `debt_caster` is **absent**
- **ELITE_SPELL_POOL:** none — glyph-tax skip is the elite. Do **not** unlock Cinder Skip as identity.
- **SIGNATURE_MECHANICS:** Stance, 1 turn. The caster’s next walk of **length 1** does not pay glyph-tax / AP-zone tiles. Length ≥ 2 pays normally.
- **VARIANT_PROGRESSION:** BASE skip-or-strike → VETERAN skip-if-wrong-hazard → ELITE skip-then-debt → CHAMPION wrong-hazard-still-ticks
- **RARITY_CURVE:** Standard. +ELITE in Glyph Full. Weight 0 on maps with no glyph-tax / AP-zone cell.
- **SYNERGIES:** `full_gaiter`, `ley_tollkeeper`, `debt_caster`
- **WEAKNESSES:** Paint lava instead; occupy the 1-step; force a 2-walk
- **PLAYER_COUNTERPLAY:** Change the hazard type; body-block; Root
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-glyph-skip` (ENEMY_DISCOVERY observe+win). Consume walk does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next 1-tile walk ignores glyph-tax flag only)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `full_gaiter`

- **NAME:** Full Gaiter
- **ROLE:** tank (leftover **MP ≥ 3** → +RES)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `full_plater` (leftover **AP ≥ 3**), `still_plater` (leftover MP = 0), `tapped_plater` (leftover AP = 0), `gait_plater` (leftover MP ≥ 1 miss). At most one leftover-MP≥3 RES CORE per pack as PAIR vs Full Plate / Gait Plate / Still Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover MP ≤ 2. Peer: Gait if leftover MP ≥ 3 after the 2-AP arm. Above: refuse if they still need those 3 MP to leave; do not double-cast with Iron Skin (last writer).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.00, res 1.10, init 0.75, chc 0.70. Identity is **keep 3 walk MP**. If it tops the meter, the kit leaked toward Iron Skin.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "res_if_leftover_mp_ge_3"`. VETERAN: skip if leftover MP ≤ 2 (fizzle). ELITE: pair with Glyph Skip so they can leave without spending the 3. CHAMPION: leftover MP ≤ 2 fizzle (AP spent, still observes); last RES% writer vs Iron Skin / Chain Ward.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-full-gait`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin` (do not double-cast same turn), `physical_attack`
- **RARE_SPELL_POOL:** `spell-glyph-skip` only if `glyph_skipper` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP RES is the elite. Do **not** unlock Full Plate / Gait Plate as identity.
- **SIGNATURE_MECHANICS:** If leftover MP at resolve is **≥ 3**, gain `buffStat: "res"`, `buffModifier: 1.20`, 2 turns. Leftover MP ≤ 2 → fizzle.
- **VARIANT_PROGRESSION:** BASE shield-or-gait → VETERAN skip-if-dry-walk → ELITE gait-then-skip → CHAMPION last-writer-honesty
- **RARITY_CURVE:** Standard. +ELITE in Glyph Full.
- **SYNERGIES:** `glyph_skipper`, `ley_tollkeeper`, `gait_plater` (COURT, not PAIR)
- **WEAKNESSES:** Force a 2-walk first; Dispel; ignore and snipe
- **PLAYER_COUNTERPLAY:** Drain MP below 3; Dispel; burst through 1.20
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-full-gait` (ENEMY_DISCOVERY observe+win). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-MP gate + existing RES buff writer)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_gaiter`

- **NAME:** Summon Gaiter
- **ROLE:** anti-summon (allied pets pay +1 **MP** to start a walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Distinct from `summon_toller` (+1 **AP**), `walk_toller` (taxes the **caster**), `kennel_siller` (pets cannot leave), `brace_chanter` (pets ignore force). At most one pet-walk-MP-tax CORE per pack as PAIR vs Toll / Walk Toll / Kennel / Brace / Brood. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no allied summon. Peer: Gait if a living allied summon exists. Above: Gait then Kennel on a **different** family (COURT, not PAIR).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 0.90, init 1.00, chc 0.75. Identity is **pets pay walk MP**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `summoner`. `aiHint: "summon_walk_mp_tax"`. VETERAN: skip if no allied summon. ELITE: pair with Mire / Slow on the pet’s path. CHAMPION: Strike in place is free; Teleport / Swap do **not** pay; player copy taxes **their** pets.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-summon-gait`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-shield`
- **RARE_SPELL_POOL:** none — do **not** rare-pool Summon Toll onto this BASE kit
- **ELITE_SPELL_POOL:** none — pet-walk-MP tax is the elite. Do **not** unlock Summon Toll as identity.
- **SIGNATURE_MECHANICS:** 2 turns. Every living **allied** summon that starts a walk pays **+1 MP** (min 1) in addition to the walk cost. This is a flag, **not** `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE frost-or-gait → VETERAN skip-if-no-pet → ELITE gait-then-mire → CHAMPION teleport-exempt
- **RARITY_CURVE:** Standard. +ELITE in Gait Kennel. Weight 0 if the pack has no summoner and no living pet.
- **SYNERGIES:** `kennel_siller` (COURT), `null_censor`, `axis_cutter`
- **WEAKNESSES:** Park pets; Sever Tether; fight without a summon
- **PLAYER_COUNTERPLAY:** Sit pets; Sever Tether; pay the 1 MP; fight unsummoned
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-gait` (ELITE observe+win)
- **REWARD_EXPECTATION:** Standard. ELITE_POOL.
- **IMPLEMENTATION_COMPLEXITY:** MED (summon walk start MP tax flag; drop if summonAI empty)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_gifter`

- **NAME:** Still Gifter
- **ROLE:** healer (heal if the **target** spent 0 walk MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. Distinct from `still_mender` (**caster** spent 0 walk MP), `gaunt_mender` (both leftover AP **and** MP = 0), `dry_gaiter` (both leftover MP = 0), `dry_mender` (both leftover AP = 0). `healAmount > 0` — **healer CORE only**. At most one target-0-walk heal CORE per pack as PAIR vs Still Mend / Gaunt / Dry Gait / Dry Mend / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if the target already walked. Peer: Gift if target `walkMpSpentThisTurn === 0` **and** missing HP ≥ 8. Above: refuse if dumping the target’s MP **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **the target camped**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_spent_zero_walk_mp"`. VETERAN: skip if the target already walked. ELITE: wait for Root / Planted Stance. CHAMPION: caster walk does **not** gate; player-side HP gain flips `healUsed` only when HP actually increased; fizzle still observes.
- **CORE_SPELL_POOL:** `spell-still-gift`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-cadence-grace` only if `cadence_gracer` is **absent**
- **ELITE_SPELL_POOL:** none — target-camp heal is the elite. Do **not** unlock Still Mend / Gaunt Mend / Hollow Gift as identity.
- **SIGNATURE_MECHANICS:** If the **target** has spent **0 walk MP this turn** at resolve, heal 8. Target may be self. Target already walked → fizzle (AP spent, no heal).
- **VARIANT_PROGRESSION:** BASE gift-or-shield → VETERAN skip-if-they-walked → ELITE wait-for-root → CHAMPION caster-walk-ok
- **RARITY_CURVE:** Standard. +ELITE in Still Grace / Pair Gift.
- **SYNERGIES:** `cadence_gracer`, `once_cantor`, `snare_weaver`
- **WEAKNESSES:** Force the target to walk; Cursed Wound; kill the cantor first
- **PLAYER_COUNTERPLAY:** Walk the wounded body 1 MP; Cursed Wound; burst the Gifter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-gift` (ELITE observe+win). Fizzle still observes. Do **not** invent `gift_cantor`.
- **REWARD_EXPECTATION:** Standard. ELITE_POOL.
- **IMPLEMENTATION_COMPLEXITY:** LOW (target walk-spend read + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_gracer`

- **NAME:** Cadence Gracer
- **ROLE:** buffer (next own spell does not start its cooldown)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_rester` (own remaining do not tick), `cadence_lagger` (+2 on them), `cadence_pinner` (freeze one hostile), `cadence_thief` (steals). At most one next-own-skip-CD CORE per pack as PAIR vs Rest / Lag / Pin / Theft. **Do not** stack with Last Ward on a BASE kit.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the next cast is Strike. Peer: Grace then Inferno / Hold Ground. Above: refuse if Crack already zeroed the next id.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.95, res 0.80, init 1.15, chc 0.85. Identity is **free-CD next tool**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "next_own_spell_skips_cooldown"`. VETERAN: skip if the next cast is Strike. ELITE: next cast is a 3–5 AP CD tool. CHAMPION: already-running remaining CDs still tick; Strike is **not** a spell for this key; 2-turn window.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-grace`
- **ADVANCED_SPELL_POOL:** `spell-inferno`, `spell-slow`
- **RARE_SPELL_POOL:** none — free-CD Inferno is enough. Do **not** rare-pool Last Ward.
- **ELITE_SPELL_POOL:** none — skip-CD honesty is the elite. Do **not** unlock Cadence Rest / Lag as identity.
- **SIGNATURE_MECHANICS:** The caster’s **next spell** this battle (or 2 turns) does not write its cooldown on resolve. Observation is the **arm**. Later CD skip does not second-observe.
- **VARIANT_PROGRESSION:** BASE frost-or-grace → VETERAN skip-if-strike → ELITE grace-then-inferno → CHAMPION running-cds-still-tick
- **RARITY_CURVE:** Standard. +ELITE in Still Grace.
- **SYNERGIES:** `still_gifter`, `once_cantor`, `ignite_alchemist`
- **WEAKNESSES:** Quiet Hex the free-CD spell; Dispel the grace; force Strike
- **PLAYER_COUNTERPLAY:** Quiet Hex Inferno; Dispel; kill the Gracer before the second Inferno
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-grace` (ENEMY_DISCOVERY observe+win)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-spell CD write skip; distinct from remaining-tick skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `debt_caster`

- **NAME:** Debt Caster
- **ROLE:** debuffer (next walk +1 AP if they **spelled** last turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `spent_taxer` (next **spell** +1 if they **walked**), `still_taxer` (next spell if they **camped**), `gait_taxer` (next spell if they walked), Debt Mark (unconditional next-walk tax). At most one spelled-last-turn walk-tax CORE per pack as PAIR vs Spent / Still / Gait / Ley / Tax / Verse Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they only Struck or camped last turn. Peer: Debt if they resolved a non-Strike spell last turn. Above: Debt then Far Watch so walking into 3–4 now costs AP **and** snaps.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.95, res 0.80, init 1.10, chc 0.80. Identity is **tax the walk after a tool**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tax_next_walk_if_spelled_last_turn"`. VETERAN: skip if they only Struck or camped (use Still Tax / Debt Mark — not this CORE). ELITE: pair with Far Watch. CHAMPION: Teleport / Swap / Phase Slip / Twin-gate do **not** pay; fizzle still observes; AI should not stack Debt + Debt Mark + Quiet Hex on G=0.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cast-debt`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** none — do not rare-pool Quiet Hex onto this BASE kit
- **ELITE_SPELL_POOL:** none — spelled-then-walk tax is the elite. Do **not** unlock Spent Tax as identity.
- **SIGNATURE_MECHANICS:** No damage. If the target resolved a non-Strike **spell** last turn, their **next walk of ≥ 1 tile** also costs +1 AP. Only Struck or camped → fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-debt → VETERAN skip-if-no-spell → ELITE debt-then-watch → CHAMPION teleport-exempt
- **RARITY_CURVE:** Standard. +ELITE in Debt Orbit.
- **SYNERGIES:** `brick_orbiter`, `tax_scribe`, `wake_marker`
- **WEAKNESSES:** Blink off; Strike in place; pay the 1 AP; camp after the nuke
- **PLAYER_COUNTERPLAY:** Strike last turn; Swap; pay; sit
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-debt` (ENEMY_DISCOVERY observe+win). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (last-turn spelled flag + next-walk AP tax)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_orbiter`

- **NAME:** Brick Orbiter
- **ROLE:** hazard creator / displacement (move one **adjacent** barrier to another adjacent empty cell)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `brick_shifter` (slides along an axis), `brick_cracker` (removes), `brick_sprouter` (grows), Barrier (place from range). Extra door is `orbit_nave` — family is **not** that id. At most one adjacent-orbit CORE per pack as PAIR vs Crack / Sprout / Shift / Wipe. Solvability skip is mandatory.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if no adjacent barrier or no empty adjacent dest. Peer: Orbit if `findPath` after a hypothetical orbit still reaches exit. Above: Orbit then Brick Reel toward the new dest (COURT, not PAIR).
- **STAT_SCALING_RULE:** hp 1.00, sp 0.75, sr 1.00, res 1.10, init 0.80, chc 0.70. Identity is **orbit the wall**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "orbit_adjacent_barrier"`. VETERAN: skip if no adjacent barrier, no empty adjacent dest, or solvability fails. ELITE: pair with Glyph Tax on the landing. CHAMPION: occupancy / void / portal / existing barrier dest fizzle that move (AP spent); if forced onto a sealed path, fizzle (no tile write).
- **CORE_SPELL_POOL:** `starter-shield`, `spell-brick-orbit`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-brick-reel` only if `brick_reeler` is **absent**
- **ELITE_SPELL_POOL:** none — orbit honesty is the elite. Do **not** unlock Brick Shift / Crack as identity.
- **SIGNATURE_MECHANICS:** Move **one** barrier cell adjacent to the caster onto **another** adjacent empty floor cell. Maps stay solvable (`finalizePlayableLayout` still owns generation; this is a combat write with a skip).
- **VARIANT_PROGRESSION:** BASE shield-or-orbit → VETERAN skip-if-seal → ELITE orbit-then-tax → CHAMPION fizzle-not-write
- **RARITY_CURVE:** Standard. +ELITE in Debt Orbit. +ELITE on `orbit_nave` maps. Weight 0 on open boards with no barrier.
- **SYNERGIES:** `debt_caster`, `tax_scribe`, `brick_reeler` (COURT)
- **WEAKNESSES:** Stand so both adjacent dests are occupied; Hook the caster off the wall
- **PLAYER_COUNTERPLAY:** Body-block dests; Hook them off the wall; burst the rook
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-orbit` (MULTI: family observe **or** `orbit_nave` first-win — first child wins). Solvability fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (adjacent barrier move + solvability skip; do not skip `finalizePlayableLayout`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_almer`

- **NAME:** Watch Almer
- **ROLE:** buffer / sniper support (overwatch snap grants the **walker** +1 AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `watch_lender` (grants the **watcher**), `watch_feer` (**debits** the walker), `watch_muter` (snap deals 0). At most one walker-grant snap CORE per pack as PAIR vs Lend / Fee / Mute / Glass Sniper. **Do not** stack with Watch Fee on a BASE kit.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no snap is likely. Peer: Alms then Far Watch / Hold Ground the same turn. Above: refuse if Watch Mute is already up.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.05, res 0.75, init 1.10, chc 0.90. Identity is **pay the walker**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "overwatch_snap_grants_walker_ap"`. VETERAN: skip if no snap is likely. ELITE: arm Far Watch the same turn. CHAMPION: if the snap deals 0 (Watch Mute), Alms does not grant; consume-on-first-snap; player copy can fund the enemy’s leftover.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-watch-alms`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** none — do not rare-pool Watch Fee onto this body
- **ELITE_SPELL_POOL:** none — walker-grant is the elite. Do **not** unlock Watch Lend / Fee as identity.
- **SIGNATURE_MECHANICS:** 2 turns. The next time an allied overwatch **snap** deals damage (Hold Ground / Far Watch / Tripwire consume), the **walker** who triggered it gains +1 leftover AP this turn.
- **VARIANT_PROGRESSION:** BASE frost-or-alms → VETERAN skip-if-no-snap → ELITE alms-then-watch → CHAMPION mute-blocks-grant
- **RARITY_CURVE:** Standard. +ELITE in Gait Watch. ELITE_POOL.
- **SYNERGIES:** `gait_plater`, `stone_castellan`, `glass_sniper` (COURT, not PAIR)
- **WEAKNESSES:** Blink in (no walk snap); send a summon; Watch Mute first
- **PLAYER_COUNTERPLAY:** Blink; send a pet; Mute; do not walk into Far Watch
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-alms` (ELITE observe+win). Snap does not second-observe.
- **REWARD_EXPECTATION:** Standard. ELITE_POOL.
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap grant on walker leftover AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_gaiter`

- **NAME:** Pair Gaiter
- **ROLE:** assassin (bonus if leftover MP **exactly 2**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `pair_purser` (leftover **AP** exactly 2), `lone_purser` (leftover AP exactly 1), `ready_stinger` (leftover AP **and** MP both ≥ 1), `gaunt_stinger` (leftover AP **and** MP both = 0). At most one leftover-MP-exactly-2 poke CORE per pack as PAIR vs Pair Purse / Gaunt Sting / Lone Purse / Dry / Ready.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP is not 2. Peer: Gait if leftover MP is exactly 2. Above: wait for Frost / Slow to land them on 2.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.95, res 0.70, init 1.15, chc 1.00. Identity is **exact 2 walk MP**. If it tops the meter at leftover 0, the kit leaked toward Dry Sting.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_leftover_mp_eq_2"`. VETERAN: skip if leftover MP is not 2 and Strike is better. ELITE: pair with Slow. CHAMPION: leftover 0, 1, or ≥ 3 is 10 only.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pair-gait`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-still-gift` only if `still_gifter` is **absent** (healer profile required — skip this rare if the Gaiter is not a healer)
- **ELITE_SPELL_POOL:** none — exact-2 MP poke is the elite. Do **not** unlock Pair Purse / Gaunt Sting as identity.
- **SIGNATURE_MECHANICS:** Deal 10. If leftover MP at resolve is **exactly 2**, extra 8 as a second `dealDamage`.
- **VARIANT_PROGRESSION:** BASE frost-or-gait → VETERAN skip-if-not-2 → ELITE gait-then-slow → CHAMPION 10-only-honesty
- **RARITY_CURVE:** Standard. +ELITE in Pair Gift. ELITE_POOL.
- **SYNERGIES:** `still_gifter`, `coil_arbiter`, `soul_siphon`
- **WEAKNESSES:** Spend to 1 or 0; Haste to 3+; sit at 4
- **PLAYER_COUNTERPLAY:** Dump to 1; Haste; keep 3+; burst the bishop
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-gait` (ELITE observe+win)
- **REWARD_EXPECTATION:** Standard. ELITE_POOL.
- **IMPLEMENTATION_COMPLEXITY:** LOW (exact leftover-MP read + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `axis_cutter`

- **NAME:** Axis Cutter
- **ROLE:** anti-summon (bonus if the target shares **rank or file** with a living allied summon)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. CORE is Leash Cut (`spell-leash-cut`, SDE Wave 12). Family is **`axis_cutter`** — Wave 8 already claimed `leash_cutter` for Short Leash. Distinct from `escort_cutter` (pet at Chebyshev ≤ 2, any geometry), `pet_cutter` (bonus on the **pet**), `banner_cutter` (`isLeader`), `crown_cutter` (`leader_slayer` grant). At most one axis-pet poke CORE per pack as PAIR vs Escort / Leash / Pet / Banner / Crown / Null.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no axis pet. Peer: Cut the **handler**, not the pet. Above: refuse if the target **is** the summon (use Summon Bane — not this CORE).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.95, res 0.75, init 1.10, chc 0.95. Identity is **handler on the file**. If it tops the meter on a pet, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "bonus_if_target_shares_axis_with_allied_summon"`. VETERAN: skip if no axis pet and Strike is better. ELITE: File Slide to line the pet up (COURT). CHAMPION: reads `isSummon` on same-axis bodies, never `spell.name` or `"wolf"`; Dummy Post is not a pet; distance on that axis is free.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-leash-cut`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** none — do not rare-pool Escort Cut onto this BASE kit
- **ELITE_SPELL_POOL:** none — axis-pet poke is the elite. Do **not** unlock Escort Cut / Pet Cut as identity.
- **SIGNATURE_MECHANICS:** Deal 10. If the target shares rank **or** file with a living **allied summon** (same side as the target), extra 8 as a second `dealDamage`. If the target **is** the summon, the bonus does **not** apply.
- **VARIANT_PROGRESSION:** BASE frost-or-cut → VETERAN skip-if-no-axis → ELITE line-then-cut → CHAMPION handler-not-pet
- **RARITY_CURVE:** Standard. +ELITE in Lone Axis. ELITE_POOL.
- **SYNERGIES:** `lone_biter`, `brood_chanter`, `summon_gaiter`
- **WEAKNESSES:** Park pets off-axis; Sever Tether; fight without a summon
- **PLAYER_COUNTERPLAY:** Off-axis pets; Sever Tether; unsummoned fight
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-leash-cut` (ELITE observe+win). Do **not** restamp Wave 8 `leash_cutter` observe as this door.
- **REWARD_EXPECTATION:** Standard. ELITE_POOL.
- **IMPLEMENTATION_COMPLEXITY:** MED (axis `isSummon` scan; never name heuristics)
- **STATUS:** PROPOSED

---

## 5. Amendments to earlier waves

None of these restamp ids. They only record Wave 14 ownership so implementers do not clone.

- **Dry Gait** stays Wave 13 `dry_gaiter` CORE. Wave 14 does **not** restamp it onto `gaunt_mender`.
- **`parched_cantor`** stays the dropped #787 Parched Mend MULTI child. It is **not** Gaunt Mend’s door (`gaunt_cantor`) and **not** Dry Gait’s door.
- **`leash_cutter`** stays Wave 8 Short Leash. Leash Cut’s world-pack family is **`axis_cutter`**.
- **`even_warder`** stays Wave 9 Even Stride. Even Hood’s family is **`even_hooder`**.
- **Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold** stay kit-only / never-owned. Extra doors `cap_precentor` / `reach_fold_regent` / `court_lag_regent` / `file_precentor` / `diag_fold_regent` — do not restamp.
- **Hollow Gift / Cadence Swap** stay SDE Wave 13 unique CORE (#837) — Wave 15 families. Do not clone as Gaunt Mend / Cadence Lag.
- **Oct Span** fills Wave 13’s held “eight-cell occupy.” **Gaunt Mend** fills Wave 13’s held “heal-if-both leftover AP and leftover MP = 0.”
- Preferred chassis on family roll is still a Wave 1 prerequisite. Wave 14 does not implement it.

---

## 6. Variant model (mechanical identities, not level brackets)

Every Wave 14 family uses BASE → VETERAN → ELITE → CHAMPION + 2% `wRare` skin (Wave 2 §). Higher variants gain smarter AI, expanded pools, reactive honesty, and pack synergies — **not** a new HP table.

Rarity is the Wave 1 §2.4 second roll after `pickEnemyLevelFromTiers`. Higher player level already raises near / equal / above-player odds through existing same/adjacent/above-tier buckets; those then feed `wVeteran` / `wElite` / `wChampion`. Do not retune percents. Do not treat 999 as endgame.

Rewards stay 1.00 / 1.15 / 1.35 / 1.60× on existing `level * 20` XP and Doka, **only** through `applyRewards`.

---

## 7. Role coverage after Wave 14

| Archetype | Wave 1 owner | Wave 14 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | lone_biter |
| sniper | glass_sniper | tri_oather, watch_almer |
| kiter | tide_shade | gaunt_stepper, glyph_skipper, orth_warder |
| assassin | shadow_lurker | gaunt_stinger, pair_gaiter, lone_biter |
| healer | pale_cantor | gaunt_mender (both leftover AP **and** MP = 0), still_gifter (target walk-MP = 0) |
| buffer | hex_chorister | gaunt_lender, cadence_gracer, watch_almer |
| debuffer | bone_scribe | cadence_lagger, bare_sipper, verse_gaunter, debt_caster |
| summoner | brood_chanter | oct_prelate (8-cell hollow ring), gaunt_prelate (1-cell fully-spent bomb) |
| controller | coil_arbiter | odd_holder, must_gaunter, gaunt_holder, gaunt_siller, orth_warder, tri_oather |
| tank | iron_golem | even_hooder, gait_plater, full_gaiter |
| protector | leash_warden | gaunt_stepper |
| artillery | storm_caller | gaunt_bouncer |
| kamikaze | cinder_martyr | gaunt_prelate (post death on fully-spent occupy) |
| teleporter | wraith_bishop, blink_cutter | gaunt_stepper, glyph_skipper |
| displacement | rift_hook | brick_reeler, brick_orbiter |
| hazard creator | ember_knight, glyph_sower | gaunt_siller, wake_marker, brick_orbiter, gaunt_prelate |
| status specialist | plague_rat | verse_gaunter, must_gaunter, odd_holder |
| anti-summon | null_censor | axis_cutter, summon_gaiter |
| anti-ranged | void_mirror, rust_reaver | tri_oather, orth_warder |
| anti-melee | leash_warden | even_hooder, gait_plater, gaunt_holder |

Every requested archetype still has a Wave 1 owner. Wave 14 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6 through Wave 13 §8, plus Wave 14 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis.
6. Battle-walk writers: `walkMpSpentThisTurn`, leftover AP / leftover MP, vacated cell, `currentView` (facing families still wait), `forcedMovedThisTurn`, `lastForcedMoveDir`, `lastResolvedSpellId`, `struckThisTurn`, `walkMpSpentLastTurn`, spelled-last-turn flag for Cast Debt.
7. `inferSummonArchetype` gains `octspan` and `gauntpost` (and still needs `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost` from Waves 8–13).
8. Raise or gate `ENEMY_SUMMON_CAP` before Oct Span (and Six / Sept / Penta / Quad / Triple) can spawn. Live cap 2 makes Oct illegal.
9. Wave 1 kits first (live ids), then later verbs one at a time. Wave 14 slice: four-flag heal (Gaunt Mend) → remaining CDs `n>0` → `n+2` → eight-cell hollow footprint → even-hood consume → gaunt sting → gaunt-step relocate → gaunt sill → odd-hold → gaunt-lend → bare-sip → gaunt-post → gaunt-bounce → must-gaunt last-AP tool-lock → verse-gaunt dual-dry last-id peel → gaunt-hold last-AP Strike-lock → orth-stride → tri-oath → brick-reel attract → lone-bite → wake-mark start-turn occupy → gait-plate → glyph-skip → full-gait → summon-gait → still-gift → cadence-grace → cast-debt → brick-orbit → watch-alms → pair-gait → leash-cut.
10. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 13 and SDE Wave 12 leftover — never names. Do **not** ship `spell-parched-mend`. Do **not** ship Hollow Gift / Cadence Swap as this pass’s CORE.
11. Register text updates only when hooks land.
12. Discovery: family observe must not double-grant MULTI / feat doors (`gaunt-mend`, `cadence-lag`, `oct-span`, `orth-stride`, `tri-oath`, `brick-reel`, `wake-mark`, `brick-orbit`). Gaunt Mend’s extra door is `gaunt_cantor` — not `parched_cantor`. Still Gift / Dry Gait / Dry Mend have **no** extra door.
13. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not splice the turn queue for Gaunt Post / Wake Mark / Cadence Lag.

---

## 9. Held for a later wave (no ids reserved here)

These need SPELL_PROPOSALS / SDE to stamp ids first, **or** they stay closed. This run does **not** mint colliding `wave14:` spell ids.

- SDE Wave 13 unique CORE (`spell-knight-stride`, `spell-quad-oath`, `spell-pit-reel`, `spell-axis-bite`, `spell-shove-mark`, `spell-spent-plate`, `spell-rime-skip`, `spell-full-sting`, `spell-summon-cast`, `spell-hollow-gift`, `spell-cadence-swap`, `spell-strike-debt`, `spell-brick-nudge`, `spell-watch-sip`, `spell-lone-gait`, `spell-hazard-cut`, `spell-drift-gift`, `spell-pack-file`, `spell-diag-fold`) — Wave 15 families if they still have no CORE owner. Hollow Gift is **target-only** both-pools heal. Cadence Swap is the remaining-map **exchange**.
- Same-day 2026-10-22 SPELL_PROPOSALS / SDE, if any open during this cron — Wave **15** family CORE. Do not clone them here.
- Mid-RAF splice of the current actor (AGENTS.md)
- Fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders)
- Sixth echo id
- Player-owned Hex of Silence
- Nine-cell occupy (Oct Span owns eight)
- Remaining CDs `max(1)` floor
- Heal-if leftover AP **equals** leftover MP (including both nonzero)
- Invert leftover AP with leftover MP on one body
- 180° pair hinge (`spell-about-hinge`, never owned)
- Refresh (extend) all remaining CDs **including zeros** (Lag is `n>0` → `n+2`)
- Pack Tithe / Court Stretch / Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual / About Hinge / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag / Pack File / Diag Fold as world-pack CORE
- Facing writer families (still blocked on combat `currentView`)
- Cone `areaShape` **reader** family (Gale / Fan still own the unread hole)
- `spell-parched-mend` (dropped; Dry Gait owns leftover-MP=0 heal)

---

## 10. What this run did not do

- No production TypeScript / Motoko / Candid.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, 13 Wave 6, 14 Wave 7, 17 Wave 8, 32 Wave 9, 32 Wave 10, 32 Wave 11, 32 Wave 12, or 32 Wave 13 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `spell-court-lag` / `spell-pack-cap` / `spell-reach-fold` / `spell-pack-file` / `spell-diag-fold` / `spell-court-imprint` / `spell-pack-long` / `spell-adj-fold` / `spell-court-dual` / `spell-pack-close` / `spell-mid-fold` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-court-stretch` / `spell-pack-tithe` / `spell-about-hinge` world-pack CORE.
- No SDE Wave 13 unique CORE as this pass’s CORE.
- No `spell-parched-mend` (SDE Wave 12 Dry Gait won leftover-MP=0 heal).
- No `wave14:` colliding spell ids.
- No restamp of claimed feat / challenge / extra-door keys (including `parched_cantor` / `leash_cutter` / `gaunt_cantor` as a family id).
- No family named `gaunt_cantor`, `lag_precentor`, `span_oct`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `leash_cutter`, `court_lag_regent`, `cap_precentor`, or `reach_fold_regent`.

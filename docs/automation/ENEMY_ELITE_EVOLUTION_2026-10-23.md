# Enemy and Elite Evolution Design — Wave 15

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-23  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Fifteenth daily pass. **31** new world-pack families that consume **SDE Wave 13 unique CORE** (`SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md`, open PR #837) **except** Pack File / Diag Fold, plus **SPELL_PROPOSALS Wave 14 verbs** (`SPELL_PROPOSALS_2026-10-22.md`, open PR #890) **except** Cadence Floor (SDE Wave 14 **won** `spell-cadence-floor`) and Court Floor (`NOT_PLAYER_LEARNABLE`). SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, open PR #906) stays extras until Wave 16. Bosses stay on the existing catalog.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 14

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–14. Wave 14 closed as docs in the 2026-10-22 pass (PR #899). SPELL_PROPOSALS latest is Wave 14 (#890). SDE latest is Wave 14 (#906). This pass consumes **#837** unique CORE (minus Pack File / Diag Fold) plus **#890** (minus Cadence Floor / Court Floor). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥13 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 14 claim | 2026-10-23 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–14 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean / Gaunt / **Poise** Post count as **1**. Triple = 3. Quad = 4. Penta = 5. Six = 6. Sept = 7. Oct = 8. **Nine Span = 9** — skip Nine until remaining cap ≥ 9 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Hollow Gift / Drift Gift / Poise Mend **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `ninespan` / `poisepost` (and still no `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Facing families still fail closed. Wave 15 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 15 CORE rows stay `mpCost: 0`. Poise Lend / Poise Sip / Bar Cross / Watch Sip rewrite **current leftover AP/MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Pit Reel is the **eighth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder / Void / Brick, then **pit**). Brick Nudge **pushes an adjacent barrier 1 away** — not a unit bash |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Waves 10–14 force families still fail closed. Wave 15 **does** add `shove_marker` / `drift_gifter` — they fail closed until the writer exists. That is the leftover, not a new HP family |
| `lastResolvedSpellId` | Absent | `verse_poiser` (and Waves 10–14 verse families) fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` still waits. Wave 15 `strike_debter` reads **Struck last turn**, not a new persist stat |
| `walkMpSpentThisTurn` | Absent | Hollow Gift / Poise* leftover-MP gates fail closed until battle walks write leftover MP |
| One next walk (2,1) / next-spell exact Chebyshev 4 / pull toward nearest **pit** / bonus if share **axis with caster** / force-move landing detonate / leftover-AP≥1 miss / 1-tile **rime** skip / leftover-AP≥3 poke / allied-summon **spell** AP tax / heal-if-**target leftover AP and MP both 0** / swap remaining CD maps / next walk +1 AP if they **Struck** / push adjacent barrier 1 / overwatch snap **steals** walker leftover AP / leftover-MP **exactly 1** poke / bonus if target stands on a **painted hazard** / heal-if-**target force-moved** | Still absent as CORE identities | Wave 15 secondary opportunity (SDE Wave 13 unique CORE leftover) |
| Heal-if both bodies leftover AP **===** leftover MP **and leftover AP ≥ 1** / solid nine-cell occupy / two-body leftover AP↔MP cross / tied-≥1 any-range miss / tied-≥1 sting / join tied-≥1 ally / start-turn occupy tied-≥1 / cannot-walk-while-tied-≥1 / +AP+MP if ally tied-≥1 / steal leftover AP iff tied-≥1 / end-turn occupy tied-≥1 post / bounce among tied-≥1 / non-Strike illegal unless tied-≥1 **and** last AP / last-id illegal until tied-≥1 | Still absent in live catalog | Wave 15 primary opportunity (SPELL_PROPOSALS Wave 14). Cadence Floor is **not** a new family — SDE #906 won `spell-cadence-floor` |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Spent Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Axis Bite is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Hazard Cut is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Pit Reel is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Cadence Swap is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Bar Cross is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 15 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 15 family pass consumes **#837** unique CORE (minus Pack File / Diag Fold) plus **#890** (minus Cadence Floor / Court Floor). **Wave 16** consumes SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, except whatever a later boss sheet claims) plus any 2026-10-23 SPELL_PROPOSALS. This run does not mint colliding `wave15:` spell ids. Same-day 2026-10-23 SPELL_PROPOSALS / SDE, if any open during this cron, stay Wave **16** family CORE — do not clone them here.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-lag` / `spell-pack-file` / `spell-diag-fold` / `spell-court-floor` stay never-owned unless a later boss sheet claims them.

**Cadence Floor amendment (not a new family):** SDE Wave 14 (#906) **won** `spell-cadence-floor` (remaining `n>1` → `1`; zeros stay 0). Extra door `floor_precentor` stays #890’s MULTI child — do **not** restamp; do **not** mint `cadence_floorer` / name a family `floor_precentor`. Observe path stays `cadence_thief` / `hex_chorister` G≥14 extras. Dual Keep leftover that survives is **not** a remaining CD.

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

**Stationary-post / multi-body cap (extend Wave 14):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span **or** Gaunt Post **or** Oct Span **or** **Poise Post** **or** **Nine Span** in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post / Drift Post / Lean Post / Gaunt Post / **Poise Post** count as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Oct Span counts as **eight**. **Nine Span counts as nine.** Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, Six Span, Gaunt Post, Oct Span, Poise Post, or Nine Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-/eight-/nine-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, a Sept Span stretched plus, an Oct Span hollow 3×3 ring, **or** a Nine Span solid 3×3, never two of those. Dummy Post, Drift Post, Lean Post, Gaunt Post, and Poise Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system. Oct Span’s **center hole is unoccupied**. Nine Span’s **center is occupied**.

**Summon-cap prerequisite (extend Wave 14):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Six Span is illegal until remaining cap ≥ 6. Sept Span is illegal until remaining cap ≥ 7. Oct Span is illegal until remaining cap ≥ 8. **Nine Span is illegal until remaining cap ≥ 9.** Dummy Post / Drift Post / Lean Post / Gaunt Post / Poise Post are legal at remaining ≥ 1. Do not spawn `nine_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 14):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / Still Mend / Spent Tax / Parched* leftover-MP gates / Dry Gait / Gaunt* leftover-MP gates / Still Gift / Pair Gait / Summon Gait / **Hollow Gift** / **Lone Gait** / **Poise*** leftover-MP equality **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / Parched Step / Gaunt Step / **Poise Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 14):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend / Gaunt* leftover-AP gates / **Spent Plate** / **Full Sting** / **Hollow Gift** / **Poise*** leftover-AP equality fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count. Equality is integer `===`. Dual Keep **enables** every Poise gate when the surviving banks are equal and ≥ 1, and **blocks** every Gaunt / Hollow Gift gate until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. `leftover AP = 0` and `leftover MP = 0` is **not** a Poise window.

**Last-id prerequisite (extend Wave 14):** Last Mute / Verse Tax / Verse Pace / Verse Lean / Verse Gaunt / **Verse Poise** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move prerequisite (new this pass):** Shove Mark / Drift Gift / Heave* / Drift* fail closed until battle force (push / attract / bash / rescue) writes `forcedMovedThisTurn` (and `lastForcedMoveDir` where needed). Walk, Swap, Twin Gate, Poise Step, Gaunt Step, and Home Step do **not** set the flag. Wave 15 adds **two** force-gated CORE cards (`shove_marker`, `drift_gifter`). That is leftover consumption, not a new HP family.

**Facing / Struck prerequisites (partial):** Wave 15 adds **zero** facing CORE cards. `strike_debter` needs a **Struck last turn** bit (`struckThisTurn` from a successful Strike that spent AP) — fail closed until written. Clash Mend still waits on the same writer.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Poise Mend MULTI child `poise_cantor` — first child wins vs `poise_mender` observe. Cadence Floor MULTI child `floor_precentor` — first child stays #890; this pass does **not** mint a Floor family. Nine Span MULTI child `span_nine` — first child wins vs `nine_prelate` observe. Court Floor stays `court_floor_regent` kit-only. Knight Stride teach room `knight_gallery` — first child wins vs `knight_warder` observe. Quad Oath teach room `quad_nave` — first child wins vs `quad_oather` observe. Pit Reel teach room `pit_aisle` — first child wins vs `pit_reeler` observe. Shove Mark teach room `shunt_pulpit` — first child wins vs `shove_marker` observe. Brick Nudge teach room `nudge_nave` — first child wins vs `brick_nudger` observe. Pack File stays `file_precentor` kit-only. Diag Fold stays `diag_fold_regent` kit-only. Hollow Gift / Drift Gift / Cadence Swap have **no** extra door — do **not** invent `hollow_cantor` / `tied_cantor` / `swap_precentor` / restamp `parched_cantor` / `gaunt_cantor` / `imprint_precentor`. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `cap_precentor`, `reach_fold_regent`, `file_precentor`, `diag_fold_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `rank_gallery`, `penta_nave`, `spike_aisle`, `swap_pulpit`, `mire_nave`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master` / `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` / `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` / `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`.

---

## 2. Why Wave 15 exists (gaps Waves 1–14 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + leftover SDE Wave 4 unique CORE. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + leftover SDE Wave 6 unique CORE. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE. Wave 13 covered SPELL_PROPOSALS Wave 12 (minus Parched Mend) + leftover SDE Wave 11 unique CORE + Dry Gait. Wave 14 covered remaining SDE Wave 12 unique CORE (minus Dry Gait / Pack Cap / Reach Fold) + SPELL_PROPOSALS Wave 13 (minus Court Lag).

SPELL_PROPOSALS Wave 14 (#890) then stamped the holes Wave 14 **held**: both-body leftover AP **===** leftover MP **and leftover AP ≥ 1** heal, solid 3×3 occupy (counts as nine), two-body leftover cross, and the tied-≥1 court. A G≥14 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 13 unique CORE still had no CORE owner after Wave 14. Seventeen of those verbs fill holes Wave 14 tactical does not: one next walk **(2,1)**, next-spell exact Chebyshev **4**, pull toward nearest **pit**, bonus if share **axis with caster**, **force-move landing** detonate, leftover-AP≥1 miss, 1-tile **rime** skip, leftover-AP≥3 poke, allied-summon **spell** AP tax, heal-if-**target leftover AP and MP both 0**, **swap remaining CD maps**, next walk +1 AP if they **Struck**, push adjacent barrier 1, overwatch snap **steals** leftover AP, leftover-MP **exactly 1** poke, bonus if target stands on a **painted hazard**, heal-if-**target force-moved**. Pack File and Diag Fold stay closed.

SDE Wave 14 (#906) **won** Cadence Floor. This pass does **not** mint a Floor family. Court Floor stays kit-only.

| Unused Wave 14 / SDE Wave 13 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-poise-mend` (heal 8 iff **caster and target** leftover **AP === MP and leftover AP ≥ 1**) | `gaunt_mender` (both leftover **0**); `hollow_gifter` (this pass, **target** leftover AP **and** MP = 0); `dry_gaiter` (both leftover **MP = 0**); `dry_mender` (both leftover **AP = 0**) | Four leftover reads, two equalities, two ≥1 gates. Dual Keep **enables**. Extra door is `poise_cantor` — family is **`poise_mender`**. Do **not** restamp `gaunt_cantor` / `parched_cantor`. Equal Gift (#906) is **target-only** tied-≥1 — Wave 16. |
| `spell-nine-span` (solid 3×3, counts as **nine**) | `oct_prelate` (hollow 3×3 = 8, **center hole**); `sept_prelate` (stretched plus = 7) | Nine tiles, one body, empty kit, **center occupied**. Extra door is `span_nine` — family is **`nine_prelate`**. Skip until remaining cap ≥ 9. |
| `spell-bar-cross` (caster AP ↔ target MP **and** caster MP ↔ target AP) | Tempo Invert is **one-body ally/self**; Dual Keep **banks**; Swap is **tiles** | Two-body leftover cross. Not `isSwap`. Do **not** mint `spell-tempo-cross`. |
| `spell-poise-hood` (next hit is 0 **while leftover AP === MP ≥ 1**, any range) | `even_hooder` (**even** Chebyshev); `gait_plater` (leftover **MP ≥ 1**); `spent_plater` (this pass, leftover **AP ≥ 1**) | Stand tied ≥ 1. Dump either pool **or** dump to 0/0 and the miss drops. |
| `spell-poise-sting` (10 + 8 iff leftover **AP === MP ≥ 1**) | `gaunt_stinger` (leftover **AP = 0 and MP = 0**); `ready_stinger` (leftover AP **and** MP ≥ 1, **no equality**); `full_stinger` (this pass, leftover **AP ≥ 3**) | Punish the tied window. Dual Keep **opens** the 8. |
| `spell-poise-step` (caster lands on a free Chebyshev-1 of an ally with leftover **AP === MP ≥ 1**) | `gaunt_stepper` (leftover **both 0**); `parched_stepper` (leftover **MP = 0**); `home_stepper` (**ungated**) | Join the body that **matches** leftover ≥ 1. Relocate, not `isSwap`. |
| `spell-poise-sill` (occupant tied ≥ 1 at **start of their turn** takes 8; paint stays) | `gaunt_siller` (leftover **both 0**); `wake_marker` (start-turn occupy **any leftover**, consume) | Tax the camp **on their turn start** if they held a tie. Dual Keep **hurts**. |
| `spell-poise-hold` (cannot walk while leftover AP === MP ≥ 1) | `odd_holder` (while leftover AP is **odd**); `dry_holder` (until leftover **AP = 0**); `gaunt_holder` (**Strike** needs leftover MP=0 **and** last AP) | Tied 1/1 / 2/2 cannot step. Spend one pool **or** dump both. **Do not PAIR with Must Poise.** |
| `spell-poise-lend` (+1 AP **and** +1 MP to an ally whose leftover **AP === MP ≥ 1**) | `gaunt_lender` (+1/+1 if leftover **both 0**); `lean_lender` (+1 **MP** if leftover **AP = 0**) | Fund a step **and** an action while **keeping** the tie (both pools +1). |
| `spell-poise-sip` (steal 1 leftover AP iff leftover **AP === MP ≥ 1**) | `bare_sipper` (leftover **AP** iff leftover **MP = 0**); `watch_sipper` (this pass, overwatch snap steal) | After the steal the target is **no longer tied**. Inverse of keeping Poise Lend. |
| `spell-poise-post` (empty-kit body; **end-turn occupy with leftover AP === MP ≥ 1** deals 10 and it dies) | `gaunt_prelate` (leftover **both 0**); `lean_prelate` (leftover **AP = 0** only); `dummy_prelate` (taunt) | Camp tied ≥ 1 on the post and eat 10, or dump a pool. Counts as **1**. `summonAI: "poisepost"`. |
| `spell-poise-bounce` (12 to primary; bounce 8 to nearest **other** leftover-AP===MP≥1 hostile) | `gaunt_bouncer` (leftover **both 0**); `parched_bouncer` (leftover **MP = 0**); Chain Lightning (nearest **any**) | Second 8 needs **two** tied-≥1 bodies. Missing flag → 12 only. |
| `spell-must-poise` (remaining **non-Strike** spells illegal unless leftover **AP === MP ≥ 1 and this spell spends last AP**) | `must_gaunter` (leftover **both 0** / leftover MP=0 last AP); `hold_caster` (**all** spells until they **walk**); `poise_holder` (this pass, **walk** needs tied ≥ 1) | Inverse of Poise Hold. Strike stays legal. **Do not PAIR with Poise Hold.** |
| `spell-verse-poise` (last resolved id **illegal until leftover AP === MP ≥ 1**) | `verse_gaunter` (until leftover **both 0**); `verse_leaner` (until leftover **MP = 0**); `last_muter` (**duration**) | Recast Inferno only after **matching leftover ≥ 1**. `0 = 0` does **not** lift. Forced-move does **not** peel. |
| `spell-knight-stride` (**next walk** legal only if dest is (2,1)) | `orth_warder` (**orthogonal**); `diag_warder` (**diagonal**); `inch_warder` (one next ≤ 1); Knight Pierce is a **damage** poke; Knight Slip is a **relocate** | Extra room is `knight_gallery` — family is **`knight_warder`**. One step, L-shape. |
| `spell-quad-oath` (next spell must be Chebyshev **exactly 4**) | `tri_oather` (exact **3**); `long_oather` (**≥ 3**); `mid_oather` (exact **2**); `near_oather` (**≤ 1**) | Frost at 1–3 or ≥ 5 fizzles. Strike stays legal. Extra room `quad_nave` is a teach — family is **`quad_oather`**. |
| `spell-pit-reel` (pull 1 toward nearest **pit**) | `brick_reeler` (toward **barrier**); `void_reeler` (toward **void/portal**); `cinder_reeler` (toward **hazard**); Open Pit **paints** the pit | Eighth `applyAttract` dest flavor. Extra room `pit_aisle` is a teach — family is **`pit_reeler`**. Dest is **toward**, not onto, a world portal. Empty board / no pit fizzles. |
| `spell-axis-bite` (10 + 8 if target shares **rank or file with the caster**) | `axis_cutter` (shares axis with a **pet**); `foe_biter` (needs adj **hostile**); `lone_biter` (0 living units of any side at Chebyshev 1) | Handler on the file, no pet required. Neighbor decoy does **not** block. |
| `spell-shove-mark` (cell detonates if they **land from a force-move**; consume) | `wake_marker` (**start-turn** occupy); `ingress_marker` (**walk enter**); `dwell_marker` (**end-turn** occupy); Drift Post is a **summon** | Walk-on is free. Bash / attract / rescue onto the paint pays. Extra room `shunt_pulpit` is a teach — family is **`shove_marker`**. |
| `spell-spent-plate` (next hit is 0 **while leftover AP ≥ 1**; consume on miss) | `gait_plater` (leftover **MP ≥ 1**); `own_plater` (**own-turn**); `poise_hooder` (this pass, leftover **AP === MP ≥ 1**) | Keep 1 action chip. Drain AP first. |
| `spell-rime-skip` (next **1-tile** walk ignores **rime leave-tax**) | `glyph_skipper` (**glyph-tax**); `cinder_skipper` (**cinder**); `spike_skipper` (**spikes**); `lava_skipper` (**lava**); `pit_skipper` (**pits**) | Wrong hazard still ticks. Length ≥ 2 pays. |
| `spell-full-sting` (leftover **AP ≥ 3** → bonus damage) | `full_plater` (leftover AP ≥ 3 → **+RES**); `pair_purser` (leftover AP **exactly 2**); `poise_stinger` (this pass, leftover AP === MP ≥ 1) | Keep 3 leftover AP after the 2-AP arm. Last AP-bank poke vs Full Plate’s RES. |
| `spell-summon-cast` (allied summons pay +1 **AP** to **start a spell**) | `summon_toller` (+1 AP to start a **walk**); `summon_gaiter` (+1 **MP** to start a walk); `kennel_siller` (pets cannot leave) | Pets sit or pay to **cast**. Player copy taxes **their** pets. **Do not PAIR with Summon Toll / Summon Gait.** |
| `spell-hollow-gift` (heal 8 iff **target leftover AP = 0 and leftover MP = 0**) | `gaunt_mender` (**caster and target** leftover both 0); `poise_mender` (this pass, both bodies **tied ≥ 1**); `still_gifter` (**target** spent 0 walk MP); `dry_gaiter` (both leftover **MP = 0**) | Healer CORE only. Caster leftover unconstrained. Dual Keep on the **target** **blocks**. |
| `spell-cadence-swap` (exchange remaining CD **maps** caster ↔ target; unknown ids dropped) | `cadence_imprinter` (**copy** matching onto caster; target keeps); `cadence_lagger` (**+2**); `cadence_halver` (**÷2**); `cadence_thief` (**steals** remaining) | Full-bar trade. Extra door is **not** `imprint_precentor` / `floor_precentor`. Family is **`cadence_swapper`**. Cadence Floor stays SDE’s on `cadence_thief` / `hex_chorister`. |
| `spell-strike-debt` (next walk +1 AP if they **Struck** last turn) | `debt_caster` (next walk +1 AP if they **spelled** last turn); `spent_taxer` (next **spell** +1 if they **walked**) | Spell last turn → fizzle. Teleport / Swap do not pay. |
| `spell-brick-nudge` (push one **adjacent** barrier 1 away) | `brick_orbiter` (orbit to another **adjacent** empty); `brick_shifter` (**slides along an axis**); `brick_cracker` (**removes**) | Push, not orbit. Solvability skip is mandatory. Extra room `nudge_nave` is a teach — family is **`brick_nudger`**. |
| `spell-watch-sip` (next **overwatch snap** **steals** 1 leftover AP from the **walker**) | `watch_almer` (**grants** the walker +1 AP); `watch_feer` (**debits** without transfer); `watch_lender` (grants the **watcher**) | Paying yourself for snapping is a tax. **Do not PAIR with Watch Alms / Watch Fee.** |
| `spell-lone-gait` (10 + 8 if leftover MP **exactly 1**) | `pair_gaiter` (leftover MP **exactly 2**); `lone_purser` (leftover **AP** exactly 1); `full_gaiter` (leftover MP **≥ 3**) | Spend down to 1 walk MP, or spend the last chip. |
| `spell-hazard-cut` (10 + 10 if target stands on a **painted hazard**) | `axis_cutter` (axis with a **pet**); `escort_cutter` (pet at Chebyshev ≤ 2); `banner_cutter` (`isLeader`) | Prefer the body already on cinder / rime / glyph-tax / lava. Dummy Post is not a hazard. |
| `spell-drift-gift` (heal 8 iff **target** was force-moved this turn) | `heave_mender` (**both** caster and target force-moved); `hollow_gifter` (this pass, target leftover both 0); `still_gifter` (target spent 0 walk MP) | Healer CORE only. Caster may be unmoved. Walk / Swap / Poise Step do **not** count. |

**Do not family (closed / boss / ENEMY_ONLY / SDE-won):** `spell-court-floor` (`NOT_PLAYER_LEARNABLE`; `court_floor_regent` kit — same law as Court Lag), `spell-cadence-floor` (SDE #906 **owns** the id; observe via `cadence_thief` / `hex_chorister`; `floor_precentor` stays #890’s door), `spell-pack-file` (ENEMY_ONLY; stays `file_precentor` CHAMPION SIGNATURE), `spell-diag-fold` (BOSS_ONLY; `diag_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold / Court Lag stay where Waves 5–14 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 15 CORE rows are `mpCost: 0`. Poise Sip / Watch Sip / Bar Cross / Poise Lend rewrite **current leftover AP/MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Poise Post / Shove Mark / Cadence Swap are **not** queue splices.  
Do **not** family a ten-cell occupy. Nine Span is the nine-cell card. Oct Span already owns eight.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family Rank Stride / Penta Oath / Spike Reel / Screen Bite / Swap Mark / Odd Plate / Mire Skip / Odd Sting / Summon Verse / Equal Gift / Cast Toll / Brick Step / Watch Bank / Tied Gait / Portal Cut / Shove Gift / Pack Rank / Rank Fold (SDE Wave 14 unique CORE — Wave 16).  
Do **not** family remaining CDs `max(1)` floor as a **second** Cadence Floor. SDE already won that hole.  
Do **not** family remaining zeros → 1 (Cadence Arm).  
Do **not** family one-body AP===MP≥1 heal (Equal Gift, Wave 16).  
Do **not** family hostile one-body leftover invert. Tempo Invert stays ally.  
Do **not** family leftover AP + leftover MP === N (sum window).  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 14 unique CORE as this pass’s CORE.  
Do **not** mint `wave15:` colliding spell ids.  
Do **not** name the Poise Mend family `poise_cantor`, the Nine Span family `span_nine`, the Knight Stride family `knight_gallery`, the Quad Oath family `quad_nave`, the Pit Reel family `pit_aisle`, the Shove Mark family `shunt_pulpit`, the Brick Nudge family `nudge_nave`, the Cadence Floor family `floor_precentor`, or the Axis Bite family `axis_cutter` (Wave 14 already claimed `axis_cutter` for Leash Cut).

---

## 3. Encounter synergy packs (Waves 1–15)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** Gaunt Post **or** Poise Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span **or** Oct Span **or** Nine Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Poise Choir | `poise_mender` + `verse_poiser` + `ignite_alchemist` | Tied-≥1 8, then Inferno is illegal until leftover AP === MP ≥ 1 |
| Nine Plug | `nine_prelate` + `poise_siller` + `rank_lancer` | Solid 3×3 seal, tax a neighbor at turn start, lance the block. Skip until remaining cap ≥ 9 |
| Knight Quad | `knight_warder` + `quad_oather` + `glass_sniper` | Next walk must be (2,1), next spell must be exact 4, snipe from 4 |
| Pit Axis | `pit_reeler` + `axis_biter` + `rime_mason` | Pull toward the pit, then axis bonus, ice the landing |
| Shove Drift | `shove_marker` + `drift_gifter` + `bash_bruiser` | Paint the landing, bash onto it, cash the force-moved heal |
| Spent Full | `spent_plater` + `full_stinger` + `plate_warden` | Leftover-AP≥1 miss, then leftover-AP≥3 poke through the plate |
| Rime File | `rime_skipper` + `rime_mason` + `ley_tollkeeper` | Cross the ice tax, then the mason paints more |
| Cast Kennel | `summon_caster` + `kennel_siller` + `null_censor` | Pets pay AP to spell, then they cannot leave — teach contrast vs Toll / Gait |
| Hollow Swap | `hollow_gifter` + `cadence_swapper` + `once_cantor` | Target-empty 8, then trade Inferno’s remaining onto the cantor |
| Strike Tax | `strike_debter` + `tax_scribe` + `oncoming_knight` | Tax the walk after they Struck, then the scribe taxes the rest |
| Brick Nudge Gate | `brick_nudger` + `trip_mason` + `stone_castellan` | Push the wall 1, trip the new choke |
| Watch Sip Hunt | `watch_sipper` + `glass_sniper` + `dim_optic` | Snap steals leftover AP, then the gun / optic punish the dry purse |
| Lone Hazard | `lone_gaiter` + `hazard_cutter` + `glyph_sower` | Poke leftover MP exactly 1, then cash painted-hazard bonus |
| Poise Quiet | `poise_stepper` + `poise_mender` + `cover_squire` | Join the tied ally, then cash the four leftover-equality 8 |
| Cross Poise | `bar_crosser` + `poise_mender` + `poise_stinger` | Cross leftover pools until a tie appears, then heal / sting |
| Poise Gate | `poise_prelate` + `poise_siller` + `poise_stinger` | Post detonates tied occupy; tile taxes start-of-turn; sting the rest |
| Bounce Poise | `poise_bouncer` + `must_poiser` + `fuse_binder` | Two tied-≥1 bodies, bounce 12+8 onto the wick |
| Poise Hold File | `poise_holder` + `must_poiser` + `leash_warden` | Walk **and** tools need leftover AP === MP ≥ 1 — COURT, never PAIR Poise Hold + Must Poise on the same body without a third peeler |
| Lend Hood | `poise_lender` + `poise_hooder` + `tempo_precentor` | Keep the tie with +1/+1, then any-range miss while tied |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner), Wave 13 packs (Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel), and Wave 14 packs (Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel).

Do **not** pack as PAIR (COURT later is fine):

- `poise_mender` + `gaunt_mender` / `hollow_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `nine_prelate` + `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `poise_hooder` + `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater`
- `poise_stinger` + `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `lone_gaiter` / `pair_gaiter` / `lone_purser` / `pair_purser` / `full_purser`
- `poise_stepper` + `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire`
- `poise_siller` + `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker`
- `poise_holder` + `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_poiser` as PAIR
- `poise_lender` + `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `poise_sipper` + `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as PAIR
- `poise_prelate` + `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `nine_prelate`
- `poise_bouncer` + `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_poiser` + `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `poise_holder` as PAIR
- `verse_poiser` + `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor`
- `knight_warder` + `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith`
- `quad_oather` + `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR
- `pit_reeler` + `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter`
- `axis_biter` + `foe_biter` / `side_biter` / `lone_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter`
- `shove_marker` + `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder`
- `spent_plater` + `gait_plater` / `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `poise_hooder` as PAIR
- `rime_skipper` + `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper`
- `full_stinger` + `full_gaiter` / `full_plater` / `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden` / `poise_stinger` as PAIR / `gaunt_stinger`
- `summon_caster` + `summon_toller` as PAIR / `summon_gaiter` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `hollow_gifter` + `poise_mender` / `gaunt_mender` / `still_mender` / `still_gifter` / `dry_gaiter` / `dry_mender` / `drift_gifter` / `bar_mender` / `pale_cantor`
- `cadence_swapper` + `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner`
- `strike_debter` + `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_nudger` + `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan`
- `watch_sipper` + `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR / `poise_sipper` as PAIR
- `lone_gaiter` + `pair_gaiter` / `lone_purser` / `full_gaiter` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `ready_stinger`
- `hazard_cutter` + `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as PAIR
- `drift_gifter` + `heave_mender` / `hollow_gifter` / `still_gifter` / `poise_mender` / `gaunt_mender` / `pale_cantor`
- `bar_crosser` + `dual_keeper` as PAIR / `pawn_broker` as PAIR (tile swap is not leftover cross)

Do **not** spawn Nine Plug on a map with no free 3×3 square (solvability). Do not spawn Pit Axis / Brick Nudge Gate on a map with no pit / no barrier in Chebyshev 6 of a legal floor. Do not spawn Rime File on a map with no rime / ice cell. Do not spawn Cast Kennel / Lone Hazard without a living allied summon **or** a painted hazard already on the board **or** a dedicated summoner / sower that is not PAIR-banned. Do not spawn Shove Drift without a legal force tool in the pack (`bash_bruiser` / `sink_chanter` / `hook_chaplain`).

---

## 4. Family sheets — Wave 15

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-10-22.md`](https://github.com/Mr-Melic/stralt/pull/890) (PR #890) unless marked SDE Wave 13 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-8100/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md), PR #837).

---

### ENEMY_ID: `poise_mender`

- **NAME:** Poise Mender
- **ROLE:** healer (heal iff caster **and** target leftover **AP === MP and leftover AP ≥ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Poise Mend (`spell-poise-mend`, #890). Extra door `poise_cantor` — family is **not** that id. Distinct from `gaunt_mender` (leftover **both 0**), `hollow_gifter` (target leftover both 0), `dry_gaiter` (leftover **MP**), `dry_mender` (leftover **AP**). Equal Gift (#906) is target-only tied-≥1 — not this CORE. At most one four-flag heal CORE per pack as PAIR vs Gaunt / Hollow / Dry / Still / Heave / Both / Pale / Gift.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover AP ≠ leftover MP **or** leftover AP = 0. Peer: Poise Mend only if all four leftover reads match **and** leftover AP ≥ 1 **and** missing HP ≥ 8. Above: refuse if Dual Keep banks unequal leftover (Frost / Shield). Never dump leftover **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two bodies already matching leftover ≥ 1**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_bodies_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if either leftover AP ≠ leftover MP **or** leftover AP = 0 **or** missing HP < 8. ELITE: wait for Bar Cross / Poise Lend to **make** the tie. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; Dual Keep leftover **is** leftover.
- **CORE_SPELL_POOL:** `spell-poise-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-poise-lend` only if `poise_lender` is **absent**
- **ELITE_SPELL_POOL:** none — four-flag honesty is the elite. Do **not** unlock Gaunt Mend / Hollow Gift / Dry Gait as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff caster and target leftover AP === leftover MP **and leftover AP ≥ 1** after the 3 AP is paid. Fails closed without leftover writers. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — `requireCasterLeftoverApGe1` fails closed.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-untied → ELITE wait-for-cross → CHAMPION no-dump-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Poise Quiet / Poise Choir / Cross Poise.
- **SYNERGIES:** `poise_stepper`, `bar_crosser`, `poise_lender`
- **WEAKNESSES:** Spend 1 leftover AP **or** 1 leftover MP to break the equality; dump both pools to 0 (Gaunt window); Cursed Wound
- **PLAYER_COUNTERPLAY:** Break the tie; Root the cantor; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-mend` (MULTI: family observe **or** `poise_cantor` first-win — first child wins). Do **not** restamp `gaunt_cantor` / `parched_cantor` / `both_cantor` / `heave_cantor` / `gait_cantor`.
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (four leftover reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `nine_prelate`

- **NAME:** Nine Prelate
- **ROLE:** summoner (stationary solid 3×3 occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate`. Extra door is `span_nine` — family is **not** that id. At most one Nine Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 9.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place center if a 9-cell square seals a corridor. Peer: skip if any of the nine is blocked **or** remaining cap < 9. Above: Poise Sill a neighbor so start-of-turn occupy taxes.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.20, init 0.60, chc 0.70. Nine uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 9. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `ninespan` (#890): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **nine** Chebyshev-≤1 cells as one combatant id; **center occupied**. VETERAN: skip if remaining cap < 9. ELITE: Poise Sill a neighbor. CHAMPION: never punch a square if a later pit lands on one cell — whole block dies.
- **CORE_SPELL_POOL:** `spell-nine-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the block)
- **RARE_SPELL_POOL:** `spell-poise-sill` only if `poise_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / six / sept / octspan / driftpost / leanpost / gauntpost / poisepost on this body.
- **SIGNATURE_MECHANICS:** Solid 3×3: click a free center; all 9 Chebyshev-≤1 cells must be free. Counts as **nine**. Empty kit. 0 XP on block death. Brick Shift / Brick Orbit / Brick Nudge do **not** move occupy cells. The center is **not** a cage hole.
- **VARIANT_PROGRESSION:** BASE block → VETERAN respect-cap-9 → ELITE sill-a-neighbor → CHAMPION whole-block-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 9. Weight 0 on cramped boards with no free 3×3 (solvability).
- **SYNERGIES:** `poise_siller`, `rank_lancer`, `cast_siller`
- **WEAKNESSES:** Burst the 9 HP; Swap around the block; sit on a cell so the place fizzles; open field
- **PLAYER_COUNTERPLAY:** Occupy a cell before they arm; Ignite the 9; artillery if LoS is open from a far diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-nine-span` (MULTI: family observe **or** `span_nine` first-win — first child wins). Nine kit is empty — nothing to steal from the block.
- **REWARD_EXPECTATION:** Standard. Block death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "ninespan"`; nine-cell solid footprint helper; do not spawn nine initiative seats; solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `bar_crosser`

- **NAME:** Bar Crosser
- **ROLE:** controller / debuffer (two-body leftover AP↔MP cross)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `dual_keeper` (banks leftover, no swap), `pawn_broker` (tiles), `soul_siphon` (ungated MP steal). Tempo Invert is **one-body ally/self** — not a family CORE here. At most one two-body leftover-cross CORE per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if both leftover pairs are already 0. Peer: Cross if the write would create a Poise tie **or** dump their walk MP onto the caster. Above: refuse if the cross would gift them leftover AP they needed to Strike this turn.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.95, res 0.80, init 1.15, chc 0.80. Identity is **the four-write**, not a bigger Frost.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "cross_leftover_ap_mp_two_body"`. VETERAN: skip if both leftover pairs are 0/0. ELITE: Cross then Poise Sting / Poise Mend an ally. CHAMPION: snapshot both leftover pairs first; never sequential half-writes.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-bar-cross`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-poise-sting` only if `poise_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — honesty is the elite. Do **not** unlock Tempo Invert / Dual Keep as identity.
- **SIGNATURE_MECHANICS:** Simultaneous four-write: caster AP ← target MP, caster MP ← target AP, target AP ← caster MP, target MP ← caster AP, each capped at that pool’s max. Not `isSwap`. Not `invertApMp`.
- **VARIANT_PROGRESSION:** BASE frost-or-cross → VETERAN skip-if-empty → ELITE cross-then-poise → CHAMPION snapshot-four-write
- **RARITY_CURVE:** Standard. +ELITE in Cross Poise.
- **SYNERGIES:** `poise_mender`, `poise_stinger`, `must_poiser`
- **WEAKNESSES:** Sit at 0/0 so the cross is a no-op; Haste after the write; kill the Crosser first
- **PLAYER_COUNTERPLAY:** Dump leftover before they arm; Dual Keep after the write if you wanted the bank back
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-bar-cross` (ENEMY_DISCOVERY). Do not restamp `dual_bursar`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (simultaneous leftover snapshot; fail closed without leftover writers)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_hooder`

- **NAME:** Poise Hooder
- **ROLE:** protector / tank-lite (next hit is 0 while leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `even_hooder` (even Chebyshev), `gait_plater` (leftover MP ≥ 1), `spent_plater` (leftover AP ≥ 1), `own_plater` (own-turn). At most one tied-≥1 miss CORE per pack as PAIR vs Even / Gait / Spent / Own / Off.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Hood then camp the tie. Peer: skip if leftover AP ≠ leftover MP **or** leftover AP = 0. Above: refuse if Dual Keep already holds 3/3 and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 1.05, res 1.10, init 0.90, chc 0.75. Identity is **the miss while tied**, not extra RES.
- **AI_TIER_PROGRESSION:** Profile `guardian` / tank. `aiHint: "hood_if_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if untied. ELITE: Poise Lend self after a spend that would break the tie. CHAMPION: never Hood a 0/0 (that is Gaunt / Hollow).
- **CORE_SPELL_POOL:** `starter-shield`, `spell-poise-hood`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-poise-lend` only if `poise_lender` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next applied hit is 0 while leftover AP === leftover MP ≥ 1, any range. Consume on miss. Dump either pool **or** dump both to 0 and the next hit lands.
- **VARIANT_PROGRESSION:** BASE hood-or-shield → VETERAN skip-if-untied → ELITE re-tie → CHAMPION refuse-0-0
- **RARITY_CURVE:** Standard. +ELITE in Lend Hood.
- **SYNERGIES:** `poise_lender`, `tempo_precentor`, `plate_warden`
- **WEAKNESSES:** Spend 1 leftover AP **or** MP; Drain Courage; wait the consume
- **PLAYER_COUNTERPLAY:** Break the tie then Strike; Expose after the miss consumes
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-hood` (ENEMY_DISCOVERY). Do not retag `even_gallery`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover equality + existing miss flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_stinger`

- **NAME:** Poise Stinger
- **ROLE:** assassin / status specialist (bonus iff leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `gaunt_stinger` (leftover both 0), `ready_stinger` (both ≥ 1, no equality), `full_stinger` (leftover AP ≥ 3), `lone_gaiter` (leftover MP exactly 1). At most one tied-≥1 poke CORE per pack as PAIR vs Gaunt / Ready / Full / Lone Gait / Pair Gait.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if untied. Peer: Sting only if leftover AP === MP ≥ 1. Above: refuse Strike on a target already tied if Sting AP remains.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the 8 rider**, not a bigger Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker` + melee gate. `aiHint: "sting_if_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip rider if untied. ELITE: Bar Cross first if an ally can create the tie. CHAMPION: never dump leftover **only** to fake Gaunt Sting.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-poise-sting`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-expose`
- **RARE_SPELL_POOL:** `spell-bar-cross` only if `bar_crosser` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 10 + 8 iff leftover AP === leftover MP ≥ 1 after the AP is paid. Dual Keep **opens** the 8. 0/0 is Gaunt Sting’s window, not this one.
- **VARIANT_PROGRESSION:** BASE strike-or-sting → VETERAN skip-if-untied → ELITE cross-then-sting → CHAMPION refuse-gaunt-fake
- **RARITY_CURVE:** Standard. +VETERAN when a Crosser or Lender is already in the pack.
- **SYNERGIES:** `bar_crosser`, `poise_lender`, `poise_prelate`
- **WEAKNESSES:** Break the tie; keep Chebyshev ≥ 2; Plate then walk
- **PLAYER_COUNTERPLAY:** Spend one pool; Slow the last tile; do not Dual Keep into their face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover equality rider on existing Strike math)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_stepper`

- **NAME:** Poise Stepper
- **ROLE:** teleporter / protector (join a tied-≥1 ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `gaunt_stepper` (join leftover both 0), `parched_stepper` (leftover MP = 0), `home_stepper` (ungated), `heave_stepper` (force-moved ally). Relocate, not `isSwap`. At most one tied-join CORE per pack as PAIR vs Gaunt / Parched / Home / Heave / Ally Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no tied ally has a free Chebyshev-1. Peer: Step only onto a free adj of a tied-≥1 ally. Above: refuse if the only dest is a fuse / pit.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.20, chc 0.80. Identity is **the join**, not a Swap.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "step_adj_ally_if_target_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if dest occupied / hazard. ELITE: Step then Poise Mend. CHAMPION: never Step onto a Gaunt Post / Poise Post detonate cell.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-poise-step`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-poise-mend` only if `poise_mender` is **absent** (healer CORE leak — skip unless this body is retagged healer)
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Caster lands on a free Chebyshev-1 of an ally with leftover AP === leftover MP ≥ 1. Does **not** increment `walkMpSpentThisTurn`. Does **not** set `forcedMovedThisTurn`.
- **VARIANT_PROGRESSION:** BASE frost-or-join → VETERAN skip-hazard → ELITE join-then-mend → CHAMPION refuse-post
- **RARITY_CURVE:** Standard. +ELITE in Poise Quiet.
- **SYNERGIES:** `poise_mender`, `cover_squire`, `poise_lender`
- **WEAKNESSES:** Occupy the dest; break the ally’s tie; Root the Stepper
- **PLAYER_COUNTERPLAY:** Stand on the only free adj; Cursed Wound the joined pair
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest; leftover gate; not Swap)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_siller`

- **NAME:** Poise Siller
- **ROLE:** hazard creator (start-of-turn tax if occupant leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `gaunt_siller` (leftover both 0), `wake_marker` (start-turn occupy **any leftover**, consume), `dwell_marker` (end-turn), `shove_marker` (force-move landing). At most one tied start-turn tax CORE per pack as PAIR vs Gaunt Sill / Wake / Dwell / Ingress / Shove.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint the tile the player camps. Peer: skip if they already sit 0/0 (Gaunt Sill’s job). Above: paint a choke a Dual Keep user must enter.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.05, chc 0.80. If it is topping the damage meter **on cast turn**, the kit leaked — Sill deals **0 on cast**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "sill_if_occupant_will_be_tied_ge_1_at_turn_start"`. VETERAN: skip if occupant leftover already 0/0. ELITE: paint a cell an ally bash already owns. CHAMPION: two live sills max; never stack two on one cell.
- **CORE_SPELL_POOL:** `spell-poise-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile, `spell-slow`
- **RARE_SPELL_POOL:** `spell-poise-post` only if `poise_prelate` is **absent**
- **ELITE_SPELL_POOL:** none — two-sill discipline is the elite
- **SIGNATURE_MECHANICS:** Occupant whose leftover AP === leftover MP ≥ 1 takes 8 at **start of their turn**. Paint stays. Caster death does **not** cancel. Dual Keep **hurts**.
- **VARIANT_PROGRESSION:** BASE paint-feet → VETERAN skip-0-0 → ELITE combo-paint → CHAMPION dual-sill
- **RARITY_CURVE:** Standard. +ELITE in Poise Gate / Nine Plug.
- **SYNERGIES:** `nine_prelate`, `poise_prelate`, `poise_stinger`
- **WEAKNESSES:** Spend one pool before turn start; leave the cell; Barrier replaces paint
- **PLAYER_COUNTERPLAY:** Step off; dump a pool; Swap the Siller onto their paint
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-sill` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile table + leftover read at **their** turn start)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_holder`

- **NAME:** Poise Holder
- **ROLE:** controller / anti-melee (cannot walk while leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `odd_holder` (leftover AP **odd**), `dry_holder` (until leftover AP = 0), `gaunt_holder` (Strike lock). **Do not PAIR with `must_poiser`.** At most one tied-walk-lock CORE per pack as PAIR vs Odd / Dry / Drift / Gaunt Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Hold then Frost. Peer: skip if they already sit 0/0. Above: refuse if Dual Keep leftover is 1/0 (already untied).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.95, res 0.95, init 1.00, chc 0.80. Identity is **the walk lock**, not extra RES.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "hold_if_target_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if untied. ELITE: Hold then Must Poise is **COURT only** with a third peeler. CHAMPION: never Hold a body that needed to step off lava this turn (solvability / honesty).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-poise-hold`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-root-snare` if present else `spell-mark`
- **RARE_SPELL_POOL:** `spell-must-poise` only if `must_poiser` is **absent** — still **not** a PAIR with this CORE
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Target cannot spend walk MP while leftover AP === leftover MP ≥ 1. Spells stay legal. Spend one pool **or** dump both to walk.
- **VARIANT_PROGRESSION:** BASE frost-or-hold → VETERAN skip-if-untied → ELITE court-with-peeler → CHAMPION refuse-lava-trap
- **RARITY_CURVE:** Standard. +ELITE in Poise Hold File.
- **SYNERGIES:** `leash_warden`, `must_poiser` (COURT), `poise_siller`
- **WEAKNESSES:** Spend one leftover pool; Swap; Haste then dump
- **PLAYER_COUNTERPLAY:** Break the tie; ignore and spell; kill the Holder
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-hold` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-spend gate; leftover equality)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_lender`

- **NAME:** Poise Lender
- **ROLE:** buffer ( +1 AP and +1 MP to a tied-≥1 ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `gaunt_lender` (+1/+1 if leftover both 0), `lean_lender` (+1 MP if leftover AP = 0), `spent_lender` (+1 MP if they walked). At most one tied +1/+1 CORE per pack as PAIR vs Gaunt / Lean / Spent / Boot / Drift Lend.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if no tied ally. Peer: Lend only if leftover AP === MP ≥ 1. Above: refuse if the +1/+1 would push them off a Dual Keep cap they needed.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 1.00, res 0.85, init 1.15, chc 0.75. Identity is **keeping the tie**.
- **AI_TIER_PROGRESSION:** Profile `support`. `aiHint: "lend_ap_mp_if_ally_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if untied. ELITE: Lend then Poise Hood. CHAMPION: never Lend a 0/0 (that is Gaunt Lend).
- **CORE_SPELL_POOL:** `starter-shield`, `spell-poise-lend`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-poise-hood` only if `poise_hooder` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** +1 current AP and +1 current MP to an ally whose leftover AP === leftover MP ≥ 1. Both pools +1 **keeps** the tie. Caps at each pool’s max.
- **VARIANT_PROGRESSION:** BASE shield-or-lend → VETERAN skip-if-untied → ELITE lend-then-hood → CHAMPION refuse-0-0
- **RARITY_CURVE:** Standard. +ELITE in Lend Hood / Cross Poise.
- **SYNERGIES:** `poise_hooder`, `poise_mender`, `tempo_precentor`
- **WEAKNESSES:** Break the ally’s tie before the Lend; kill the Lender first
- **PLAYER_COUNTERPLAY:** Drain Courage the ally; Cursed Wound; burst the Lender
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover writes after a gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_sipper`

- **NAME:** Poise Sipper
- **ROLE:** debuffer (steal 1 leftover AP iff leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `bare_sipper` (steal leftover AP iff leftover **MP = 0**), `parched_sipper` (steal leftover **MP** iff leftover AP = 0), `watch_sipper` (overwatch snap). At most one tied-AP-steal CORE per pack as PAIR vs Bare / Parched / Gait / Watch Sip.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if untied. Peer: Sip only if leftover AP === MP ≥ 1 and leftover AP ≥ 1. Above: refuse if stealing would leave them 0/1 (still able to walk) and a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.95, sr 0.85, res 0.75, init 1.20, chc 0.95. Identity is **breaking the tie by theft**.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "sip_leftover_ap_if_target_tied_ge_1"`. VETERAN: skip if untied. ELITE: Sip then Poise Hold is now a no-op — prefer Sting / Strike. CHAMPION: never Sip a Dual Keep 1/1 if an ally Poise Mender needed that tie.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-poise-sip`
- **ADVANCED_SPELL_POOL:** `spell-drain-courage`
- **RARE_SPELL_POOL:** `spell-poise-sting` only if `poise_stinger` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Steal 1 leftover AP iff leftover AP === leftover MP ≥ 1. After the steal the target is **no longer tied**. Inverse of Poise Lend.
- **VARIANT_PROGRESSION:** BASE strike-or-sip → VETERAN skip-if-untied → ELITE sip-then-strike → CHAMPION refuse-steal-from-choir
- **RARITY_CURVE:** Standard. +ELITE in Poise Court.
- **SYNERGIES:** `odd_holder`, `poise_stinger`, `dim_optic`
- **WEAKNESSES:** Sit untied; Dual Keep after; kill the Sipper
- **PLAYER_COUNTERPLAY:** Spend the tie yourself; Shield; don’t Dual Keep 1/1 in their range
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP steal + equality gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_prelate`

- **NAME:** Poise Prelate
- **ROLE:** summoner / kamikaze-lite (end-turn occupy tied-≥1 detonates the post)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Replaces random overlay on this body. Distinct from `gaunt_prelate` (leftover both 0), `lean_prelate` (leftover AP = 0 only), `dummy_prelate` (taunt), `drift_prelate` (relocate landing). Counts as **1**. `summonAI: "poisepost"`. At most one Poise Post per pack. Legal at remaining cap ≥ 1.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: plant on a camp tile. Peer: skip if remaining cap < 1 **or** a Gaunt Post already fills the stationary cap. Above: plant on Dual Keep feet.
- **STAT_SCALING_RULE:** hp 0.70, sp 0.60, sr 1.00, res 0.70, init 0.80, chc 0.70. Post HP is small. Identity is **the detonate**, not a turret.
- **AI_TIER_PROGRESSION:** New summon AI `poisepost` (#890): empty kit, **must not path**, **must not cast**. VETERAN: skip if remaining cap < 1. ELITE: Poise Sill a neighbor. CHAMPION: never plant on the only exit (solvability).
- **CORE_SPELL_POOL:** `spell-poise-post`
- **ADVANCED_SPELL_POOL:** `starter-shield`
- **RARE_SPELL_POOL:** `spell-poise-sill` only if `poise_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock wolf / archer / dummy / gauntpost / leanpost / driftpost / ninespan
- **SIGNATURE_MECHANICS:** Empty-kit body. End-turn occupy with leftover AP === leftover MP ≥ 1 deals 10 and it dies. Dump a pool and camp free. Counts as **1**.
- **VARIANT_PROGRESSION:** BASE plant → VETERAN respect-cap-1 → ELITE sill-neighbor → CHAMPION refuse-exit
- **RARITY_CURVE:** Standard. +ELITE in Poise Gate. Weight 0 if stationary-post cap already filled.
- **SYNERGIES:** `poise_siller`, `poise_stinger`, `goad_herald`
- **WEAKNESSES:** Dump a leftover pool; Coup the 1 HP; don’t end turn on it while tied
- **PLAYER_COUNTERPLAY:** Step off; spend one pool; burst the post
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-post` (MULTI: summon observe). Later detonate is not a second observe.
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED (`summonAI: "poisepost"`; end-turn leftover gate; same class as Gaunt Post)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `poise_bouncer`

- **NAME:** Poise Bouncer
- **ROLE:** artillery (bounce to a second tied-≥1 hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `gaunt_bouncer` (leftover both 0), `parched_bouncer` (leftover MP = 0), `heave_bouncer` (force-moved), `storm_caller` (always bounce). At most one tied-bounce CORE per pack as PAIR vs Gaunt / Parched / Heave / Storm / Ricochet.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 12 only if no second tied body. Peer: Bounce only if a second leftover-AP===MP≥1 hostile exists in search radius. Above: refuse if the only second body is an allied summon.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 0.90, res 0.75, init 1.10, chc 0.90. Identity is **the second 8**, not a bigger 12.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bounce_if_second_hostile_tied_ge_1"`. VETERAN: skip bounce search if no second tied body. ELITE: Bar Cross a second body first. CHAMPION: never bounce onto a player summon the pack needed alive for Axis Bite.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-poise-bounce`
- **ADVANCED_SPELL_POOL:** `starter-blast` only if bounce count stays 1 extra (do not stack Chain)
- **RARE_SPELL_POOL:** `spell-bar-cross` only if `bar_crosser` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 12 to primary; bounce 8 to nearest **other** leftover-AP===MP≥1 hostile. Missing flag → 12 only. Search radius from #890.
- **VARIANT_PROGRESSION:** BASE 12-or-bounce → VETERAN skip-if-solo → ELITE cross-a-second → CHAMPION refuse-pet-bounce
- **RARITY_CURVE:** Standard. +ELITE in Bounce Poise.
- **SYNERGIES:** `must_poiser`, `fuse_binder`, `bar_crosser`
- **WEAKNESSES:** Stay untied; spread so no second body; Mirror
- **PLAYER_COUNTERPLAY:** Break one body’s tie; sit behind LoS; kill the Bouncer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-poise-bounce` (ENEMY_DISCOVERY). A bounce that finds no second body still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (second-body leftover search; not Chain Lightning nearest-any)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_poiser`

- **NAME:** Must Poiser
- **ROLE:** controller / anti-ranged (non-Strike illegal unless leftover AP === MP ≥ 1 **and** last AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `must_gaunter` (leftover both 0 / leftover MP=0 last AP), `hold_caster` (all spells until walk), `tool_holder` (tools until Strike). **Do not PAIR with `poise_holder`.** At most one tied last-AP tool lock CORE per pack as PAIR vs Must Gaunt / Must Lean / Cast Hold / Tool Hold.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Must then Strike. Peer: skip if they already sit 0/0 (Must Gaunt’s job). Above: refuse if the only lock would silence a heal they needed to live.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.05, chc 0.80. Identity is **the tool lock**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_non_strike_unless_tied_ge_1_and_spends_last_ap"`. VETERAN: skip if already 0/0. ELITE: COURT with Poise Holder only if a third peeler exists. CHAMPION: Strike stays legal — never claim this as a silence of Strike.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-must-poise`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-verse-poise` only if `verse_poiser` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Remaining **non-Strike** spells illegal unless leftover AP === leftover MP ≥ 1 **and this spell spends last AP**. Strike stays legal. Inverse of Poise Hold.
- **VARIANT_PROGRESSION:** BASE strike-or-must → VETERAN skip-0-0 → ELITE court-with-peeler → CHAMPION strike-stays-legal
- **RARITY_CURVE:** Standard. +ELITE in Poise Hold File / Bounce Poise.
- **SYNERGIES:** `leash_warden`, `fuse_binder`, `poise_holder` (COURT)
- **WEAKNESSES:** Strike; dump leftover to 0/0; Swap
- **PLAYER_COUNTERPLAY:** Strike through it; spend last AP on Strike; kill the Poiser
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-poise` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (remaining-spell legality rewrite + leftover + last-AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_poiser`

- **NAME:** Verse Poiser
- **ROLE:** debuffer / controller (last id illegal until leftover AP === MP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `verse_gaunter` (until leftover both 0), `verse_leaner` (until leftover MP = 0), `last_muter` (duration). At most one tied last-id lock CORE per pack as PAIR vs Verse Gaunt / Lean / Pace / Last Mute / Verse Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no last id. Peer: Verse if last remaining CD ≥ 2 **or** last id was Inferno. Above: refuse if last id was Strike (Strike is not the nightmare).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **the recast lock**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "verse_until_target_leftover_ap_eq_leftover_mp_ge_1"`. VETERAN: skip if no `lastResolvedSpellId`. ELITE: Verse after Cadence Swap dumped Inferno onto them. CHAMPION: `0 = 0` does **not** lift — Dual Keep empty is not a peel.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-poise`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-cadence-swap` only if `cadence_swapper` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Last resolved id is illegal until leftover AP === leftover MP ≥ 1. Forced-move does **not** peel. Fail closed without `lastResolvedSpellId`.
- **VARIANT_PROGRESSION:** BASE frost-or-verse → VETERAN skip-if-no-last → ELITE swap-then-verse → CHAMPION 0-0-does-not-lift
- **RARITY_CURVE:** Standard. +ELITE in Poise Choir.
- **SYNERGIES:** `cadence_swapper`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Recast something else; Dual Keep 1/1; wait and match leftover
- **PLAYER_COUNTERPLAY:** Spend into a tie on purpose; Crack Inferno first; kill the Poiser
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-poise` (ENEMY_DISCOVERY). Arming (AP spent) observes, including a no-last-id fizzle.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`lastResolvedSpellId` writer + leftover equality peel)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `knight_warder`

- **NAME:** Knight Warder
- **ROLE:** controller / kiter (next walk legal only if dest is (2,1))
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `orth_warder` (orthogonal), `diag_warder` (diagonal), `inch_warder` (one next ≤ 1), `must_stepper` (all remaining Chebyshev 1). Knight Pierce is damage. Knight Slip is a relocate. Extra room `knight_gallery` — family is **not** that id. At most one next-walk-(2,1) CORE per pack as PAIR vs Orth / Diag / Inch / Must Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no legal (2,1) landing exists for the player. Peer: Stride then snipe. Above: refuse if the only (2,1) landing is lava (honesty).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.90, res 0.85, init 1.20, chc 0.85. Identity is **the L-step gate**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_walk_must_be_knight_21"`. VETERAN: skip if player MP = 0. ELITE: Quad Oath after so the spell is also gated. CHAMPION: never Stride a body with no legal (2,1) floor (solvability).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-knight-stride`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-quad-oath` only if `quad_oather` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** **One** next walk dest must be Chebyshev (2,1) (`|dx|,|dy|` = 2,1 or 1,2). Orthogonal / diagonal / length-1 fizzle the walk. Forced-move does **not** consume the lock.
- **VARIANT_PROGRESSION:** BASE frost-or-stride → VETERAN skip-if-no-MP → ELITE stride-then-oath → CHAMPION refuse-no-landing
- **RARITY_CURVE:** Standard. +ELITE in Knight Quad.
- **SYNERGIES:** `quad_oather`, `glass_sniper`, `blink_cutter`
- **WEAKNESSES:** Don’t walk; Swap; sit still and spell
- **PLAYER_COUNTERPLAY:** Spell from here; Swap; wait the lock
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-knight-stride` (ENEMY_DISCOVERY **or** `knight_gallery` first-win — first child wins). Do not restamp `orth_gallery` / `diag_gallery`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-walk dest predicate; fail closed without a walk writer)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `quad_oather`

- **NAME:** Quad Oather
- **ROLE:** controller / sniper-enabler (next spell must be Chebyshev exactly 4)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `tri_oather` (exact 3), `long_oather` (≥ 3), `mid_oather` (exact 2), `near_oather` (≤ 1). Extra room `quad_nave` — family is **not** that id. At most one exact-4 oath CORE per pack as PAIR vs Tri / Mid / Long / Near. **Do not** stack with Pack Cap (maxRange 2 vs exact 4) on a BASE kit.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if player already sits at 4. Peer: Oath then the Sniper fires. Above: refuse if the only legal 4 is behind LoS they cannot break.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.95, res 0.80, init 1.10, chc 0.80. Identity is **the exact-4 gate**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_spell_must_be_chebyshev_4"`. VETERAN: skip if they have no ranged id. ELITE: Knight Stride after so the walk is also gated. CHAMPION: Strike stays legal — never claim this as a melee silence.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-quad-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-knight-stride` only if `knight_warder` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next spell illegal unless Chebyshev = 4. Frost at 1–3 or ≥ 5 fizzles. Strike stays legal.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee-only → ELITE oath-then-stride → CHAMPION strike-stays-legal
- **RARITY_CURVE:** Standard. +ELITE in Knight Quad.
- **SYNERGIES:** `knight_warder`, `glass_sniper`, `far_stinger`
- **WEAKNESSES:** Strike; step to 3 or 5; Swap
- **PLAYER_COUNTERPLAY:** Melee; change range; kill the Oather
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-quad-oath` (ENEMY_DISCOVERY **or** `quad_nave` first-win — first child wins). Do not restamp `tri_nave` / `mid_nave`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-spell Chebyshev gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pit_reeler`

- **NAME:** Pit Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest pit)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `brick_reeler` (barrier), `void_reeler` (void/portal), `cinder_reeler` (hazard), `paint_reeler` (paint), `foe_reeler` (body). Extra room `pit_aisle` — family is **not** that id. At most one pit-pull CORE per pack as PAIR vs Brick / Void / Cinder / Paint / Foe / Ally / File. Skip if no pit exists.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no pit in Chebyshev 6. Peer: Reel toward the pit, not onto a world portal. Above: skip if the pull would drop them into an unsolvable hole (solvability).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 0.95, init 0.95, chc 0.75. Identity is **the dest flavor**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_pit"`. VETERAN: skip if no pit. ELITE: Open Pit first if `pit_mason` is in pack. CHAMPION: dest is **toward**, never a portal tile.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pit-reel`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-open-pit` only if `pit_mason` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Eighth `applyAttract` dest flavor. Pull 1 toward nearest **pit**. Empty board / no pit fizzles (AP spent, observe). World portals are not pits.
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-no-pit → ELITE paint-then-reel → CHAMPION never-portal
- **RARITY_CURVE:** Standard. +ELITE in Pit Axis. Weight 0 on maps with no pit.
- **SYNERGIES:** `axis_biter`, `rime_mason`, `pit_mason`
- **WEAKNESSES:** No pit; Root; stand adjacent to the pit already
- **PLAYER_COUNTERPLAY:** Fill / leave the pit; Barrier between; kill the Reeler
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pit-reel` (ENEMY_DISCOVERY **or** `pit_aisle` first-win — first child wins). Do not restamp `brick_aisle` / `void_aisle`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`applyAttract` dest = nearest pit; no live caller today)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `axis_biter`

- **NAME:** Axis Biter
- **ROLE:** bruiser (bonus if target shares rank or file with the **caster**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `axis_cutter` (axis with a **pet**), `foe_biter` (adj hostile), `lone_biter` (isolated from everyone), `side_biter` (adj ally). At most one caster-axis bonus CORE per pack as PAIR vs Axis Cut / Foe / Lone / Side Bite.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike off-axis. Peer: Bite only on rank or file. Above: refuse off-axis Strike if a one-step file exists.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.10, sr 0.85, res 0.80, init 1.15, chc 1.00. Identity is **the 8 rider on the file**.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "bonus_if_share_axis_with_caster"`. VETERAN: skip rider off-axis. ELITE: path onto the file before Bite. CHAMPION: never Bite a Dummy Post and call it a pet (that is Axis Cut’s lesson).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-axis-bite`
- **ADVANCED_SPELL_POOL:** `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 10 + 8 if target shares rank **or** file with the caster. Neighbor decoy does **not** block. No pet required.
- **VARIANT_PROGRESSION:** BASE strike-or-bite → VETERAN skip-off-axis → ELITE path-onto-file → CHAMPION refuse-dummy-as-pet
- **RARITY_CURVE:** Standard. +ELITE in Pit Axis.
- **SYNERGIES:** `pit_reeler`, `rank_lancer`, `file_brander`
- **WEAKNESSES:** Step off the file; Smoke LoS; keep Chebyshev knight-offset
- **PLAYER_COUNTERPLAY:** Leave the rank/file; Barrier; kill the Biter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-axis-bite` (ENEMY_DISCOVERY). Do **not** name this family `axis_cutter`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (rank/file predicate + existing damage)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `shove_marker`

- **NAME:** Shove Marker
- **ROLE:** hazard creator (detonate on **force-move landing**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `wake_marker` (start-turn occupy), `ingress_marker` (walk enter), `dwell_marker` (end-turn occupy), `gaunt_siller` / `poise_siller` (leftover gates). Extra room `shunt_pulpit` — family is **not** that id. At most one force-landing detonate CORE per pack as PAIR vs Wake / Dwell / Ingress / Gaunt Sill / Poise Sill. Skip if the pack has no force tool.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint the tile a Bash already threatens. Peer: skip if no `forcedMovedThisTurn` writer (fail closed). Above: paint a cell an ally sink already owns.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 1.00, res 0.80, init 1.05, chc 0.80. Identity is **0 on cast, 8 on landing**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "mark_if_ally_can_force_onto_cell"`. VETERAN: skip if no force ally. ELITE: paint then Bash. CHAMPION: walk-on is **free** — never claim Ingress.
- **CORE_SPELL_POOL:** `spell-shove-mark`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-shoulder-bash` only if `bash_bruiser` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Cell detonates if they **land from a force-move**; consume. Walk-on / Swap / Poise Step do **not** tick. Fail closed without `forcedMovedThisTurn`.
- **VARIANT_PROGRESSION:** BASE paint-or-frost → VETERAN skip-if-no-force → ELITE paint-then-bash → CHAMPION walk-is-free
- **RARITY_CURVE:** Standard. +ELITE in Shove Drift. Weight 0 if pack has no force tool.
- **SYNERGIES:** `bash_bruiser`, `drift_gifter`, `sink_chanter`
- **WEAKNESSES:** Walk onto it; don’t get pushed; Barrier replaces paint
- **PLAYER_COUNTERPLAY:** Step on yourself; Root the Basher; Swap off
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shove-mark` (ENEMY_DISCOVERY **or** `shunt_pulpit` first-win — first child wins). Do not restamp `wake_pulpit` / `dwell_pulpit`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile table + force-landing consume; writer is a prerequisite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spent_plater`

- **NAME:** Spent Plater
- **ROLE:** protector (next hit is 0 while leftover AP ≥ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `gait_plater` (leftover **MP ≥ 1**), `own_plater` (own-turn), `off_plater` (off-turn), `poise_hooder` (leftover AP === MP ≥ 1). At most one leftover-AP miss CORE per pack as PAIR vs Gait / Own / Off / Poise Hood.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Plate then keep 1 leftover AP. Peer: skip if leftover AP = 0. Above: refuse if Dual Keep leftover AP is 0 after the bank pay.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.75, sr 1.05, res 1.15, init 0.85, chc 0.70. Identity is **the miss while leftover AP ≥ 1**, not extra RES.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "plate_if_leftover_ap_ge_1"`. VETERAN: skip if leftover AP = 0. ELITE: Full Sting after they drain AP. CHAMPION: never Plate a 0 leftover AP (that is Tapped Plate).
- **CORE_SPELL_POOL:** `starter-shield`, `spell-spent-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-full-sting` only if `full_stinger` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next hit is 0 while leftover AP ≥ 1; consume on miss. Drain AP first. MP unconstrained.
- **VARIANT_PROGRESSION:** BASE shield-or-plate → VETERAN skip-if-dry-AP → ELITE plate-then-sting → CHAMPION refuse-0-AP
- **RARITY_CURVE:** Standard. +ELITE in Spent Full.
- **SYNERGIES:** `full_stinger`, `plate_warden`, `iron_golem`
- **WEAKNESSES:** Drain Courage; spend last AP; wait the consume
- **PLAYER_COUNTERPLAY:** Spend their AP; Expose after the miss; Ignore and walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spent-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP ≥ 1 miss flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rime_skipper`

- **NAME:** Rime Skipper
- **ROLE:** kiter / hazard specialist (next 1-tile walk ignores rime leave-tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `glyph_skipper` (glyph-tax), `cinder_skipper` (cinder), `spike_skipper` (spikes), `lava_skipper` (lava), `pit_skipper` (pits). At most one rime-skip CORE per pack as PAIR vs Glyph / Cinder / Spike / Lava / Pit Skip. Skip if no rime / ice cell.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Skip then step 1 off ice. Peer: skip if they are not on rime. Above: refuse a length ≥ 2 (that still pays).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.25, chc 0.85. Identity is **the 1-tile ice pass**.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "skip_next_1_tile_rime_leave_tax"`. VETERAN: skip if not on rime. ELITE: Rime Mason paints then Skip. CHAMPION: length ≥ 2 still pays — never lie.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-rime-skip`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-rime-tile` only if `rime_mason` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next **1-tile** walk ignores **rime leave-tax**. Wrong hazard still ticks. Length ≥ 2 pays.
- **VARIANT_PROGRESSION:** BASE frost-or-skip → VETERAN skip-if-not-on-rime → ELITE paint-then-skip → CHAMPION length-2-pays
- **RARITY_CURVE:** Standard. +ELITE in Rime File. Weight 0 on maps with no rime / ice.
- **SYNERGIES:** `rime_mason`, `ley_tollkeeper`, `tide_shade`
- **WEAKNESSES:** Don’t stand on rime; walk 2; other hazards
- **PLAYER_COUNTERPLAY:** Glyph-tax the same cell; Slow; kill the Skipper
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rime-skip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-walk 1-tile rime-tax ignore flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `full_stinger`

- **NAME:** Full Stinger
- **ROLE:** bruiser (leftover AP ≥ 3 → bonus damage)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `full_plater` (leftover AP ≥ 3 → **+RES**), `pair_purser` (leftover AP exactly 2), `poise_stinger` (tied ≥ 1), `gaunt_stinger` (both leftover 0). At most one leftover-AP≥3 poke CORE per pack as PAIR vs Full Plate / Pair Purse / Poise Sting / Gaunt Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover AP < 3. Peer: Sting only if leftover AP ≥ 3. Above: refuse if Dual Keep leftover AP is 2.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 0.85, res 0.80, init 1.10, chc 1.00. Identity is **the leftover-AP≥3 rider**.
- **AI_TIER_PROGRESSION:** Profile `charger`. `aiHint: "sting_if_leftover_ap_ge_3"`. VETERAN: skip rider if leftover AP < 3. ELITE: don’t spend last 3 AP on Shield. CHAMPION: never Sting a 2 leftover AP and call it Pair Purse.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-full-sting`
- **ADVANCED_SPELL_POOL:** `spell-enrage`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Leftover AP ≥ 3 → bonus damage after this spell’s AP is paid. Full Plate is the RES cousin. Last AP-bank poke.
- **VARIANT_PROGRESSION:** BASE strike-or-sting → VETERAN skip-if-AP-lt-3 → ELITE keep-the-bank → CHAMPION refuse-pair-fake
- **RARITY_CURVE:** Standard. +ELITE in Spent Full.
- **SYNERGIES:** `spent_plater`, `plate_warden`, `tempo_precentor`
- **WEAKNESSES:** Drain Courage; spend down to 2; keep range
- **PLAYER_COUNTERPLAY:** Tax their AP; Slow; don’t Dual Keep 3 AP into melee
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-full-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover AP ≥ 3 rider)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_caster`

- **NAME:** Summon Caster
- **ROLE:** anti-summon / controller (allied summons pay +1 AP to **start a spell**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Distinct from `summon_toller` (+1 AP to start a **walk**), `summon_gaiter` (+1 **MP** to start a walk), `kennel_siller` (pets cannot leave). **Do not PAIR with Summon Toll / Summon Gait.** Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no pet. Peer: Cast-tax then Null Brand. Above: skip if the only pet is a Dummy / Poise Post (not a caster).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 1.00, res 0.90, init 0.95, chc 0.75. Identity is **the spell-start tax**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "allied_summons_pay_plus_1_ap_to_start_spell"`. VETERAN: skip if no allied summon. ELITE: Kennel after so they cannot leave either — COURT, not PAIR. CHAMPION: drop if `summonAI` empty.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-summon-cast`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-null-brand` only if `null_censor` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Allied summons pay +1 **AP** to **start a spell**. Walks unconstrained. Player copy taxes **their** pets. Dummy / Posts with empty kits are unaffected (they cannot spell).
- **VARIANT_PROGRESSION:** BASE frost-or-tax → VETERAN skip-if-no-pet → ELITE court-with-kennel → CHAMPION drop-if-empty-ai
- **RARITY_CURVE:** Standard. +ELITE in Cast Kennel. Weight 0 if no allied summon and no dedicated summoner.
- **SYNERGIES:** `kennel_siller`, `null_censor`, `brood_chanter` (COURT)
- **WEAKNESSES:** Don’t summon; dismiss pets; sit and Strike
- **PLAYER_COUNTERPLAY:** Unsummon; spend the extra AP; kill the Caster
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-cast` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (summon spell-start AP tax flag; drop if summonAI empty)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hollow_gifter`

- **NAME:** Hollow Gifter
- **ROLE:** healer (heal iff **target leftover AP = 0 and leftover MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. Distinct from `gaunt_mender` (**caster and target** leftover both 0), `poise_mender` (both bodies tied ≥ 1), `still_gifter` (target spent 0 walk MP), `dry_gaiter` (both leftover MP = 0). **No extra door** — do not invent `hollow_cantor`. At most one target-empty-both-pools heal CORE per pack as PAIR vs Gaunt / Poise / Dry / Still / Drift / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if target leftover ≥ 1 on either pool. Peer: Gift only if target leftover AP **and** MP are 0 **and** missing HP ≥ 8. Above: refuse if Dual Keep still banks the target.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **one empty body**. Caster leftover unconstrained.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_leftover_ap_eq_0_and_leftover_mp_eq_0"`. VETERAN: skip if either leftover ≥ 1 **or** missing HP < 8. ELITE: wait for Drain Courage / Walk Toll. CHAMPION: caster may be wet — never require caster leftover 0 (that is Gaunt Mend).
- **CORE_SPELL_POOL:** `spell-hollow-gift`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-bare-sip` only if `bare_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — do **not** unlock Gaunt Mend / Poise Mend / Dry Gait as identity
- **SIGNATURE_MECHANICS:** Heal 8 iff **target** leftover AP = 0 **and** leftover MP = 0. Dual Keep on the target **blocks**. Healer CORE only. `healAmount` stays 0 on the row so `inferArchetype` does not steal non-healer kits.
- **VARIANT_PROGRESSION:** BASE shield-or-gift → VETERAN skip-if-wet → ELITE wait-for-toll → CHAMPION caster-may-be-wet
- **RARITY_CURVE:** Standard. +ELITE in Hollow Swap.
- **SYNERGIES:** `cadence_swapper`, `once_cantor`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover AP **or** MP on the target; Cursed Wound; Dual Keep
- **PLAYER_COUNTERPLAY:** Keep 1 leftover; Root the Gifter; kill them first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hollow-gift` (ELITE observe). Do **not** restamp `poise_cantor` / `gaunt_cantor` / `parched_cantor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads on the target + heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_swapper`

- **NAME:** Cadence Swapper
- **ROLE:** controller / debuffer (exchange remaining CD maps caster ↔ target)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_imprinter` (copy matching onto caster; target keeps), `cadence_lagger` (+2), `cadence_halver` (÷2), `cadence_thief` (steals remaining). Cadence Floor stays SDE’s on `cadence_thief` / `hex_chorister` — **not** this CORE. At most one remaining-CD-map-exchange CORE per pack as PAIR vs Imprint / Lag / Halve / Theft / Grace / Rest.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if both remaining maps are empty. Peer: Swap if they hold Inferno 3 and the caster’s map is empty. Above: refuse if the swap would gift them a 0 they needed this turn.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **the map trade**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "swap_remaining_cd_maps"`. VETERAN: skip if both maps empty. ELITE: Swap then Verse Poise the dumped id. CHAMPION: unknown ids dropped — never invent a stolen Inferno they did not own.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-swap`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-verse-poise` only if `verse_poiser` is **absent**
- **ELITE_SPELL_POOL:** none — do **not** unlock Cadence Floor / Lag / Imprint as identity
- **SIGNATURE_MECHANICS:** Exchange remaining CD **maps** caster ↔ target. Unknown ids dropped. Once/battle flags and spell levels are **not** CDs. Not tile Swap. Not Cadence Floor.
- **VARIANT_PROGRESSION:** BASE frost-or-swap → VETERAN skip-if-empty → ELITE swap-then-verse → CHAMPION drop-unknown
- **RARITY_CURVE:** Standard. +ELITE in Hollow Swap.
- **SYNERGIES:** `hollow_gifter`, `once_cantor`, `verse_poiser`
- **WEAKNESSES:** Recast Inferno first (zero stays zero on **their** map); sit on empty remaining; kill the Swapper
- **PLAYER_COUNTERPLAY:** Empty your remaining before they arm; Crack; fight with no running CDs
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-swap` (ENEMY_DISCOVERY). Do not restamp `imprint_precentor` / `floor_precentor` / `lag_precentor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (two remaining-CD maps exchanged; drop unknown ids)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `strike_debter`

- **NAME:** Strike Debter
- **ROLE:** tax / controller (next walk +1 AP if they **Struck** last turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `debt_caster` (next walk +1 if they **spelled** last turn), `spent_taxer` (next **spell** +1 if they **walked**), `ley_tollkeeper` (`mpCost` walk snipe — held). At most one Struck-walk-tax CORE per pack as PAIR vs Cast Debt / Spent Tax / Still Tax / Ley.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have not Struck. Peer: Debt only if `struckThisTurn` last turn. Above: refuse if they spelled last turn (Cast Debt’s job).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **the Struck→walk tax**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_walk_plus_1_ap_if_struck_last_turn"`. VETERAN: skip if not Struck. ELITE: Oncoming after so they want to Strike. CHAMPION: Teleport / Swap / Poise Step do **not** pay.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-strike-debt`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-oncoming` only if `oncoming_knight` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next walk +1 AP if they **Struck** last turn. Spell last turn → fizzle. Fail closed without `struckThisTurn`. Not `spell.mpCost`.
- **VARIANT_PROGRESSION:** BASE frost-or-debt → VETERAN skip-if-not-struck → ELITE bait-strike → CHAMPION relocate-does-not-pay
- **RARITY_CURVE:** Standard. +ELITE in Strike Tax.
- **SYNERGIES:** `tax_scribe`, `oncoming_knight`, `goad_herald`
- **WEAKNESSES:** Don’t Strike; Swap instead of walk; sit
- **PLAYER_COUNTERPLAY:** Spell last turn; don’t walk; kill the Debter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-strike-debt` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`struckThisTurn` writer + next-walk AP tax)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_nudger`

- **NAME:** Brick Nudger
- **ROLE:** displacement specialist / hazard creator (push one adjacent barrier 1 away)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `brick_orbiter` (orbit to another adjacent empty), `brick_shifter` (slide along an axis), `brick_cracker` (removes), `brick_sprouter` (grows). Extra room `nudge_nave` — family is **not** that id. At most one adjacent-barrier-push CORE per pack as PAIR vs Orbit / Crack / Sprout / Shift / Wipe. Solvability skip is mandatory.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no adjacent barrier. Peer: Nudge into a choke, never into the only exit. Above: skip if the dest is occupied / off-map / a portal.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.75, sr 1.00, res 1.05, init 0.85, chc 0.70. Identity is **the 1-cell push**.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "push_adjacent_barrier_1"`. VETERAN: skip if dest not empty. ELITE: Trip after the new choke. CHAMPION: never close the only path (solvability).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-brick-nudge`
- **ADVANCED_SPELL_POOL:** `spell-barrier`
- **RARE_SPELL_POOL:** `spell-tripwire` only if `trip_mason` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Push one **adjacent** barrier 1 away into an empty in-bounds non-portal cell. Not orbit. Not a unit bash. Occupied dest fizzles.
- **VARIANT_PROGRESSION:** BASE frost-or-nudge → VETERAN skip-if-blocked → ELITE nudge-then-trip → CHAMPION refuse-exit
- **RARITY_CURVE:** Standard. +ELITE in Brick Nudge Gate. Weight 0 if no barrier in Chebyshev 1 of a legal floor.
- **SYNERGIES:** `trip_mason`, `stone_castellan`, `lintel_mason`
- **WEAKNESSES:** No barrier; occupy the dest; Swap past
- **PLAYER_COUNTERPLAY:** Stand in the dest; Crack the wall first; kill the Nudger
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-nudge` (ENEMY_DISCOVERY **or** `nudge_nave` first-win — first child wins). Do not restamp `orbit_nave` / `crack_nave`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (barrier occupancy push; solvability skip; not `applyPushback` on a unit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_sipper`

- **NAME:** Watch Sipper
- **ROLE:** sniper / debuffer (overwatch snap **steals** 1 leftover AP from the walker)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `watch_almer` (grants the **walker** +1 AP), `watch_feer` (debits without transfer), `watch_lender` (grants the **watcher**), `poise_sipper` (tied leftover AP steal on cast). **Do not PAIR with Watch Alms / Watch Fee.** At most one overwatch-steal CORE per pack as PAIR vs Alms / Fee / Lend / Mute / Poise Sip.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they will not walk. Peer: arm Watch then wait the snap. Above: refuse if leftover AP is already 0 (nothing to steal).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.90, res 0.75, init 1.20, chc 0.90. Identity is **the steal on snap**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "overwatch_snap_steals_walker_leftover_ap"`. VETERAN: skip if leftover AP = 0. ELITE: Dim Optic after so the gun also hurts. CHAMPION: granting the walker is Watch Alms — never clone it.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-watch-sip`
- **ADVANCED_SPELL_POOL:** `spell-slow`
- **RARE_SPELL_POOL:** `spell-short-sight` only if `dim_optic` is **absent**
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** Next **overwatch snap** steals 1 leftover AP from the **walker** (if leftover AP ≥ 1). Fail closed without leftover AP. Snap that finds leftover 0 still observes the arm.
- **VARIANT_PROGRESSION:** BASE frost-or-arm → VETERAN skip-if-dry-AP → ELITE arm-then-optic → CHAMPION refuse-alms-clone
- **RARITY_CURVE:** Standard. +ELITE in Watch Sip Hunt.
- **SYNERGIES:** `glass_sniper`, `dim_optic`, `stone_castellan`
- **WEAKNESSES:** Don’t walk; leftover AP = 0; kill the Sipper before the snap
- **PLAYER_COUNTERPLAY:** Camp; spend leftover AP first; fog LoS
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-sip` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap leftover-AP steal; not a grant)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lone_gaiter`

- **NAME:** Lone Gaiter
- **ROLE:** assassin / kiter (bonus if leftover MP **exactly 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `pair_gaiter` (leftover MP exactly 2), `lone_purser` (leftover **AP** exactly 1), `full_gaiter` (leftover MP ≥ 3), `poise_stinger` (tied ≥ 1). At most one leftover-MP-exactly-1 poke CORE per pack as PAIR vs Pair Gait / Lone Purse / Full Gait / Poise Sting / Gaunt Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover MP ≠ 1. Peer: Gait only if leftover MP = 1. Above: refuse if leftover MP = 2 (Pair Gait’s window).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the last walk chip**.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "sting_if_leftover_mp_eq_1"`. VETERAN: skip rider if leftover MP ≠ 1. ELITE: Walk Toll first to spend them down to 1. CHAMPION: never Gait a 0 leftover MP and call it Gaunt.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lone-gait`
- **ADVANCED_SPELL_POOL:** `spell-mark`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 10 + 8 if leftover MP **exactly 1** after this spell’s AP is paid. Spend down to 1 walk MP, or spend the last chip. Fail closed without leftover MP.
- **VARIANT_PROGRESSION:** BASE strike-or-gait → VETERAN skip-if-not-1 → ELITE tax-down-to-1 → CHAMPION refuse-0-fake
- **RARITY_CURVE:** Standard. +ELITE in Lone Hazard.
- **SYNERGIES:** `hazard_cutter`, `walk_toller`, `glyph_sower`
- **WEAKNESSES:** Keep 2 walk MP; dump to 0; keep range
- **PLAYER_COUNTERPLAY:** Don’t sit on 1 MP; Haste; kill the Gaiter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lone-gait` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover MP === 1 rider)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hazard_cutter`

- **NAME:** Hazard Cutter
- **ROLE:** assassin / anti-melee (bonus if target stands on a **painted hazard**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `axis_cutter` (axis with a **pet**), `escort_cutter` (pet in 2), `banner_cutter` (`isLeader`), `leash_cutter` (Short Leash). At most one painted-hazard bonus CORE per pack as PAIR vs Axis / Escort / Leash / Pet / Banner / Crown Cut. Skip if no painted hazard exists.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike off-hazard. Peer: Cut only if they stand on cinder / rime / glyph-tax / lava / painted pit. Above: refuse a Dummy Post and call it a hazard.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.85, res 0.80, init 1.15, chc 1.00. Identity is **the 10 rider on paint**.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_target_on_painted_hazard"`. VETERAN: skip rider if not on paint. ELITE: Glyph Sower then Cut. CHAMPION: world lava that is **not** painted does **not** count unless the sheet’s key says so — honesty is painted occupancy.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-hazard-cut`
- **ADVANCED_SPELL_POOL:** `spell-mark`
- **RARE_SPELL_POOL:** `spell-cinder-tile` only if `ember_knight` overlay is **absent** as a dedicated sower
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 10 + 10 if target stands on a **painted hazard**. Dummy Post is not a hazard. Reads occupancy flags, never `spell.name`.
- **VARIANT_PROGRESSION:** BASE strike-or-cut → VETERAN skip-if-clean → ELITE paint-then-cut → CHAMPION refuse-dummy
- **RARITY_CURVE:** Standard. +ELITE in Lone Hazard. Weight 0 if no painted hazard and no sower.
- **SYNERGIES:** `glyph_sower`, `lone_gaiter`, `ember_knight`
- **WEAKNESSES:** Step off the paint; Cleanse the tile; keep range
- **PLAYER_COUNTERPLAY:** Leave the cell; Barrier over it; kill the Cutter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hazard-cut` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (painted-hazard occupancy predicate + existing damage)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `drift_gifter`

- **NAME:** Drift Gifter
- **ROLE:** healer (heal iff **target** was force-moved this turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. Distinct from `heave_mender` (**both** caster and target force-moved), `hollow_gifter` (target leftover both 0), `still_gifter` (target spent 0 walk MP), `poise_mender` (tied ≥ 1). At most one target-force heal CORE per pack as PAIR vs Heave / Hollow / Still / Poise / Gaunt / Pale. Skip if the pack has no force tool.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if nobody was forced. Peer: Gift only if `forcedMovedThisTurn` on the target **and** missing HP ≥ 8. Above: refuse if they walked / Swapped / Poise Stepped (those are not force).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **the force-moved 8**. Caster may be unmoved.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_forced_moved_this_turn"`. VETERAN: skip if flag unset **or** missing HP < 8. ELITE: Bash then Gift. CHAMPION: caster unmoved is legal — never require Heave Mend’s both-forced.
- **CORE_SPELL_POOL:** `spell-drift-gift`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-shoulder-bash` only if `bash_bruiser` is **absent** (support leak — skip unless retagged)
- **ELITE_SPELL_POOL:** none — do **not** unlock Heave Mend / Hollow Gift as identity
- **SIGNATURE_MECHANICS:** Heal 8 iff **target** was force-moved this turn. Walk / Swap / Twin Gate / Poise Step / Gaunt Step / Home Step do **not** count. Fail closed without `forcedMovedThisTurn`. Healer CORE only.
- **VARIANT_PROGRESSION:** BASE shield-or-gift → VETERAN skip-if-unmoved → ELITE bash-then-gift → CHAMPION caster-may-be-unmoved
- **RARITY_CURVE:** Standard. +ELITE in Shove Drift. Weight 0 if pack has no force tool.
- **SYNERGIES:** `bash_bruiser`, `shove_marker`, `sink_chanter`
- **WEAKNESSES:** Don’t get pushed; Root the Basher; Cursed Wound
- **PLAYER_COUNTERPLAY:** Walk yourself; refuse the pull; kill the Gifter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-drift-gift` (ENEMY_DISCOVERY). Do **not** invent `hollow_cantor` / restamp `heave_cantor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`forcedMovedThisTurn` writer + heal helper; writer is a prerequisite)
- **STATUS:** PROPOSED

---

## 5. Implementation notes (not this PR)

Do **not** implement production code from this document.

**Live defects that remain implementation prerequisites, not new families:**

1. Family HP must survive battle start (`WX` 11970–11974 currently overwrites with `calcEnemyMaxHp`).
2. `buildEnemyKit` must receive a **number** zone (`WX` 11920 currently passes `{ name, minLevel, maxLevel }` → NaN → zone 0).
3. Family `res` / `sp` must match `getEnemyBaseStats` integer bands (`spawnPolicy.ts` still writes 0.05–0.75 fractions).
4. `inferArchetype` must read `aiProfile`, not `healAmount` / `family.includes("berserk")`.
5. `inferSummonArchetype` must accept `ninespan` / `poisepost` (and still-missing `octspan` / `gauntpost` / `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` / `sixspan` / `leanpost`) as empty-kit stationary posts, not hunter fallback.
6. Leftover AP / leftover MP / `walkMpSpentThisTurn` / `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / `struckThisTurn` / next-walk dest writers.
7. Nine Span occupy-weight (live cap is 2; skip until remaining ≥ 9).
8. `applyAttract` pit dest + barrier-cell push for Brick Nudge.
9. Cadence Swap remaining-map exchange. Cadence Floor is **already owned** by SDE #906 — do not ship a second id.

**Wave 16 leftover (do not fill today):** SDE Wave 14 unique CORE (`spell-rank-stride`, `spell-penta-oath`, `spell-spike-reel`, `spell-screen-bite`, `spell-swap-mark`, `spell-odd-plate`, `spell-mire-skip`, `spell-odd-sting`, `spell-summon-verse`, `spell-equal-gift`, `spell-cast-toll`, `spell-brick-step`, `spell-watch-bank`, `spell-tied-gait`, `spell-portal-cut`, `spell-shove-gift`, `spell-pack-rank`, `spell-rank-fold` — except Pack Rank / Rank Fold unless a boss sheet claims them). Cadence Floor is **not** Wave 16 CORE; it is already SDE-owned. Same-day 2026-10-23 SPELL_PROPOSALS / SDE, if any, stay Wave 16. Hold mid-RAF splice, fourth `mpCost` walk snipe, player-owned Hex of Silence, sixth echo, ten-cell occupy, remaining CDs including zeros → 1 (Cadence Arm), heal-if leftover AP **equals** leftover MP on **one** body (Equal Gift), invert leftover AP with leftover MP on a **hostile** one-body, leftover AP + leftover MP === N.

---

## 6. Index

| ENEMY_ID | ROLE | CORE verb | Extra door / room (not the family id) |
| :--- | :--- | :--- | :--- |
| `poise_mender` | healer | `spell-poise-mend` | `poise_cantor` |
| `nine_prelate` | summoner | `spell-nine-span` | `span_nine` |
| `bar_crosser` | controller | `spell-bar-cross` | — |
| `poise_hooder` | protector | `spell-poise-hood` | — |
| `poise_stinger` | assassin | `spell-poise-sting` | — |
| `poise_stepper` | teleporter | `spell-poise-step` | — |
| `poise_siller` | hazard creator | `spell-poise-sill` | — |
| `poise_holder` | controller | `spell-poise-hold` | — |
| `poise_lender` | buffer | `spell-poise-lend` | — |
| `poise_sipper` | debuffer | `spell-poise-sip` | — |
| `poise_prelate` | summoner | `spell-poise-post` | — (`summonAI: "poisepost"`) |
| `poise_bouncer` | artillery | `spell-poise-bounce` | — |
| `must_poiser` | controller | `spell-must-poise` | — |
| `verse_poiser` | debuffer | `spell-verse-poise` | — |
| `knight_warder` | controller | `spell-knight-stride` | `knight_gallery` |
| `quad_oather` | controller | `spell-quad-oath` | `quad_nave` |
| `pit_reeler` | displacement | `spell-pit-reel` | `pit_aisle` |
| `axis_biter` | bruiser | `spell-axis-bite` | — |
| `shove_marker` | hazard creator | `spell-shove-mark` | `shunt_pulpit` |
| `spent_plater` | protector | `spell-spent-plate` | — |
| `rime_skipper` | kiter | `spell-rime-skip` | — |
| `full_stinger` | bruiser | `spell-full-sting` | — |
| `summon_caster` | anti-summon | `spell-summon-cast` | — |
| `hollow_gifter` | healer | `spell-hollow-gift` | — |
| `cadence_swapper` | controller | `spell-cadence-swap` | — |
| `strike_debter` | controller | `spell-strike-debt` | — |
| `brick_nudger` | displacement | `spell-brick-nudge` | `nudge_nave` |
| `watch_sipper` | sniper | `spell-watch-sip` | — |
| `lone_gaiter` | assassin | `spell-lone-gait` | — |
| `hazard_cutter` | assassin | `spell-hazard-cut` | — |
| `drift_gifter` | healer | `spell-drift-gift` | — |

Not a family this pass: Cadence Floor (`spell-cadence-floor`, SDE #906; observe `cadence_thief` / `hex_chorister`; door `floor_precentor` stays #890). Court Floor / Pack File / Diag Fold stay kit-only.

All **31** sheets: **STATUS: PROPOSED**.

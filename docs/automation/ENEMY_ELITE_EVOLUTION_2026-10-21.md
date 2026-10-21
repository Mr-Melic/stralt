# Enemy and Elite Evolution Design — Wave 13

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-10-21  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Thirteenth daily pass (first run after the 2026-09-29 gap). New world-pack families that consume **SPELL_PROPOSALS Wave 12 verbs** (`SPELL_PROPOSALS_2026-09-29.md`, open PR #787) **except** the leftover-MP=0 heal hole, plus **SDE Wave 11 unique CORE** verbs Wave 12 held (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md`, open PR #747) because they still have no CORE owner. Same-day SDE Wave 12 (PR #802) **won** leftover-MP=0 heal as `spell-dry-gait` and dropped `spell-parched-mend` — this pass stamps **Dry Gait**, not Parched Mend. Bosses stay on the existing catalog. Court Imprint / Pack Long / Adj Fold stay **kit-only / ENEMY_ONLY / BOSS_ONLY** — not world-pack CORE.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 12

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Same live SHA as Waves 4–12. Wave 12 closed as docs in the 2026-09-29 pass (PR #796). No later enemy-evolution PR exists (search through 2026-10-21). SPELL_PROPOSALS latest is still Wave 12 (#787). SDE latest is Wave 12 (#802). This pass consumes **#787** (minus Parched Mend) plus leftover **#747** unique CORE, and **one** #802 unique (`spell-dry-gait`) because SDE won that hole. Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥12 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 12 claim | 2026-10-21 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–12 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy / Drift / Lean Post count as **1**. Triple = 3. Quad = 4. Penta = 5. Six Span = **6**. Sept = 7 — skip Six until remaining cap ≥ 6 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Dry Mend / Still Mend / Dry Gait **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `sixspan` / `leanpost` (and still no `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost`) |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Facing families still fail closed. Wave 13 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 13 CORE rows stay `mpCost: 0`. Parched Sip / Lean Lend rewrite **current leftover MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Parched Step is occupancy dest, **not** `isSwap`. Void Reel is the **sixth** dest flavor of `applyAttract` (File / Ally / Foe / Paint / Cinder, then void/portal) |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` | Absent | Wave 10–12 force families still fail closed. Wave 13 adds **zero** force-gated CORE |
| `lastResolvedSpellId` | Absent | Wave 10 `last_muter`, Wave 11 `verse_taxer`, Wave 12 `verse_pacer`, and Wave 13 `verse_leaner` fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` still waits. Wave 13 adds **zero** Struck families |
| `walkMpSpentThisTurn` | Absent | Still Mend / Spent Tax / Parched* leftover-MP gates fail closed until battle walks write leftover MP |
| Copy matching remaining CDs / six-cell occupy / odd-Chebyshev miss / leftover-AP=0+MP≥1 poke / leftover-MP=0 ally step / tile forbid walk MP / cannot-walk-until-leftover-AP=0 / +MP if leftover AP=0 / steal leftover MP iff leftover AP=0 / end-turn leftover-AP=0 post / bounce among leftover-MP=0 / non-Strike illegal unless leftover MP=0 / last-id illegal until leftover MP=0 / Strike illegal until leftover MP=0 | Still absent in live catalog | Wave 13 primary opportunity (SPELL_PROPOSALS Wave 12) |
| Next walk diagonal-only / next-spell exact Chebyshev 2 / pull toward void/portal / adj-hostile bite / end-turn occupy detonate / own-turn hit 0 / 1-tile cinder skip / leftover-AP≥3 +RES / allied-summon walk AP tax / heal-if-caster-walk-MP=0 / own remaining CDs skip tick / next-spell +1 AP if walked last turn / remove adjacent barrier / overwatch snap grants watcher AP / leftover-AP exactly 2 poke / bonus if target has allied summon in 2 / heal-if-both leftover AP=0 | Still absent as CORE identities | Wave 13 secondary opportunity (SDE Wave 11 unique CORE) |
| Heal-if-both leftover MP=0 | #787 Parched Mend **dropped**; #802 Dry Gait **wins** | Wave 13 CORE is `spell-dry-gait` on `dry_gaiter`. Do **not** ship `spell-parched-mend` |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Own Plate is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Dwell Mark is not CORE here |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Cinder Skip is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Dry Hold is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Spent Tax is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Void Reel is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 13 families exist so those verbs are **sentences**, not extra HP.

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

This Wave 13 family pass consumes **#787** verbs (minus Parched Mend) plus leftover **#747** unique CORE, plus **`spell-dry-gait`** (SDE Wave 12 unique — the winning leftover-MP=0 heal). **Wave 14** consumes remaining SDE Wave 12 unique CORE (`spell-orth-stride` … `spell-reach-fold`, except Dry Gait). This run does not mint colliding `wave13:` spell ids.

`spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` / `spell-pack-long` / `spell-adj-fold` / `spell-court-imprint` / `spell-pack-cap` / `spell-reach-fold` stay never-owned unless a later boss sheet claims them.

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

**Stationary-post / multi-body cap (extend Wave 12):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span **or** Sept Span **or** Drift Post **or** Lean Post **or** Six Span in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post counts as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Six Span counts as **six**. Sept Span counts as **seven**. Drift Post / Lean Post count as **one**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, Penta Span, Sept Span, Drift Post, Lean Post, or Six Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-/six-/seven-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, a Penta Span plus, a Six Span 2×3, **or** a Sept Span stretched plus, never two of those. Dummy Post, Drift Post, and Lean Post are **1-cell** posts; they fill the stationary-post cap but are **not** a multi-cell system.

**Summon-cap prerequisite (extend Wave 12):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. **Six Span is illegal until remaining cap ≥ 6.** Sept Span is illegal until remaining cap ≥ 7. Dummy Post / Drift Post / Lean Post are legal at remaining ≥ 1. Do not spawn `six_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend / leftover-MP prerequisite (extend Wave 12):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark / Dual Keep (MP half) / Verse Pace peel / **Still Mend** / **Spent Tax** / **Parched Step** / **Parched Sill** / **Parched Sip** / **Parched Bounce** / **Must Lean** / **Verse Lean** / **Lean Hold** / **Dry Gait** **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and leftover walk MP) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip / Heave Step / **Parched Step** are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Leftover-AP prerequisite (extend Wave 12):** Dry Hold / Lean Lend / Parched Sip / Lean Sting / Lean Post / Full Plate / Pair Purse / Dry Mend fail closed until leftover AP is readable after this spell’s AP is paid. Dual Keep / Purse Keep pay at **next turn start** — after that pay, leftover is the new current.

**Last-id prerequisite (extend Wave 12):** Last Mute / Verse Tax / Verse Pace / **Verse Lean** fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Force-move / facing / Struck prerequisites (unchanged):** Wave 13 adds **zero** force-gated, facing, or Struck CORE cards. Those writers remain implementation prerequisites for Waves 6–12.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Cadence Imprint MULTI child `imprint_precentor` — first child wins vs `cadence_imprinter` observe. Six Span MULTI child `span_six` — first child wins vs `six_prelate` observe. Court Imprint stays `court_imprint_regent` kit-only. Dry Gait has **no** extra door — do **not** restamp `parched_cantor` (that door is the dropped #787 Parched Mend MULTI child). Diag Stride MULTI child `diag_gallery` — first child wins vs `diag_warder` observe. Mid Oath MULTI child `mid_nave` — first child wins vs `mid_oather` observe. Void Reel MULTI child `void_aisle` — first child wins vs `void_reeler` observe. Dwell Mark MULTI child `dwell_pulpit` — first child wins vs `dwell_marker` observe. Brick Crack MULTI child `crack_nave` — first child wins vs `brick_cracker` observe. Pack Long stays `long_precentor` kit-only. Adj Fold stays `adj_fold_regent` kit-only. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` / `survivor` / `jackpot` / `leader_slayer` / `spell_master`.

---

## 2. Why Wave 13 exists (gaps Waves 1–12 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + three leftover SDE Wave 6 unique CORE verbs. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE. Wave 11 covered SPELL_PROPOSALS Wave 10 + leftover SDE Wave 9 unique CORE. Wave 12 covered SPELL_PROPOSALS Wave 11 + leftover SDE Wave 10 unique CORE.

SPELL_PROPOSALS Wave 12 (#787) then stamped the holes Wave 12 **held**. A G≥12 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 12 (#802) authored **after** #787 and **won** leftover-MP=0 heal as `spell-dry-gait`. Do **not** ship `spell-parched-mend` beside it. Extra door `parched_cantor` is **not** Dry Gait’s door.

SDE Wave 11 unique CORE still had no CORE owner after Wave 12 (Wave 12 held them as G≥11 stamps). Seventeen of those verbs fill holes Wave 12 tactical does not: next walk diagonal-only, next-spell exact Chebyshev 2, pull toward **void/portal**, adjacent-**hostile** bite, end-turn occupy detonate, **own-turn** hit 0, 1-tile **cinder** walk, leftover-AP≥3 +RES, allied-summon walk AP tax, heal-if-caster walk-MP=0, own remaining CDs skip tick, next-spell +1 AP if **walked last turn**, remove adjacent **barrier**, overwatch snap grants watcher **1 AP**, leftover-AP **exactly 2** poke, bonus if target has an allied summon in 2, heal-if-both leftover AP=0. Pack Long and Adj Fold stay closed.

| Unused Wave 12 / SDE Wave 11 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-dry-gait` (heal 8 iff **caster and target** leftover **MP = 0**) | `dry_mender` (both leftover **AP = 0**); `still_mender` (caster walk-MP spent = 0); `heave_mender` (both force-moved); `both_mender` (both walked) | Two bodies dump or camp the **walk** pool, then 8. `#787` Parched Mend is the **same hole** — SDE wins. Extra door `parched_cantor` is **not** this family’s door. Family is **`dry_gaiter`**. |
| `spell-cadence-imprint` (copy matching remaining CDs onto caster; target **keeps**) | `cadence_thief` (**steals**); `cadence_rester` (this pass, **own** remaining skip tick); `cadence_halver` (**÷2** on the hostile); `cadence_pinner` (freeze **one**) | Share downtime. Extra door is `imprint_precentor` — family is **`cadence_imprinter`**. |
| `spell-six-span` (2×3 rectangle, counts as **six**) | `sept_prelate` (stretched plus = 7); `penta_prelate` (plus = 5); `quad_prelate` (2×2 = 4) | Six tiles, one body, empty kit. Extra door is `span_six` — family is **`six_prelate`**. Skip until remaining cap ≥ 6. |
| `spell-odd-hood` (next applied hit from **odd** Chebyshev → 0) | `near_hooder` (**≤ 1**); `mid_hooder` (**exactly 2**, even); `far_hooder` (**≥ 3**, mixed) | Stand at even range. Melee at 1 is **odd** — it whiffs. |
| `spell-lean-sting` (10 + 8 iff leftover **AP = 0 and leftover MP ≥ 1**) | `dry_stinger` (leftover **AP = 0**, no MP gate); `ready_stinger` (leftover **AP ≥ 1 and MP ≥ 1**); `damp_stinger` (leftover **MP ≥ 2**); `pair_purser` (this pass, leftover AP **exactly 2**) | Punish the dry-purse / wet-walk window. |
| `spell-parched-step` (caster lands on a free Chebyshev-1 of an ally with leftover **MP = 0**) | `home_stepper` (**ungated**); `heave_stepper` (**force-moved** ally); `ally_stepper` (**they** land next to caster) | Join the body that already dumped walk MP. Relocate, not `isSwap`. |
| `spell-parched-sill` (occupant cannot spend walk MP; force-move legal) | `drift_siller` (occupant cannot be a **relocate dest**); `gait_sealer` (**unit**); `quiet_siller` / `cast_siller` (confirm-gates) | The **tile** nails feet. Shove still peels. |
| `spell-dry-hold` (cannot spend walk MP until leftover **AP = 0**) | `drift_holder` (until **force-moved**); `boot_holder` (until **Strike**); `gait_sealer` (cannot walk; spells legal) | Dump AP first, then walk. Strike does **not** peel unless it also empties AP. |
| `spell-lean-lend` (+1 current MP to an ally whose leftover **AP = 0**) | `spent_lender` (+1 **MP** if they **walked**); `drift_lender` (+1 **AP** if **forced**); `boot_lender` (**unmoved**) | Fund a step after they emptied the purse. |
| `spell-parched-sip` (steal 1 leftover MP iff leftover **AP = 0**) | `gait_sipper` (steal **MP** iff they **walked**); `drift_sipper` (steal leftover **AP** iff **forced**); `soul_siphon` (ungated MP) | Tax the dry-purse / wet-walk window. |
| `spell-lean-post` (empty-kit body; **end-turn occupy with leftover AP = 0** deals 10 and it dies) | `dummy_prelate` (taunt); `drift_prelate` (**relocate landing**); `dwell_marker` (this pass, end-turn occupy, **any** leftover); `ingress_marker` (**walk enter**) | Camp 1 leftover AP on the post, or dump and eat 10. Counts as **1**. |
| `spell-parched-bounce` (12 to primary; bounce 1 to nearest **other** leftover-MP=0 hostile) | `heave_bouncer` (**force-moved**); Chain Lightning (nearest **any**); `ricochet_vicar` (predicate bounce) | Second 12 needs a second leftover-MP=0 flag. Missing flag → 12 only. |
| `spell-must-lean` (remaining **non-Strike** spells illegal unless leftover **MP = 0**) | `hold_caster` / Cast Hold (**all** spells until they **walk**); `tool_holder` (tools until **Strike**); `must_drifter` (walk **dir**) | Inverse of Cast Hold. Strike stays legal. |
| `spell-verse-lean` (last resolved id **illegal until leftover MP = 0**) | `verse_pacer` (until they **walk**); `last_muter` (**duration**); `verse_taxer` (legal but **+1 AP**) | Recast Inferno only after the walk pool is empty. Forced-move does **not** peel. |
| `spell-lean-hold` (cannot Strike until leftover **MP = 0**) | `hold_knight` (cannot Strike until **walk**); `rite_holder` (cannot Strike until a **spell**); `tool_holder` (cannot **tool** until Strike) | Inverse of Strike Hold. Tools stay legal. |
| `spell-diag-stride` (**next walk** legal only if diagonal) | `inch_warder` (one next ≤ 1, **ortho legal**); `must_stepper` (all remaining Chebyshev 1); `diag_locksmith` (**forbids** diagonal dests) | Extra door is `diag_gallery` — family is **`diag_warder`**. Opposite of Diag Lock. |
| `spell-mid-oath` (next spell must be Chebyshev **exactly 2**) | `long_oather` (next spell range **≥ 3**); `near_oather` (**≤ 1**); `mid_hooder` (next **hit** from exactly 2 → 0) | Frost at 1 or 3 fizzles. Strike stays legal. Extra room `mid_nave` is a teach — family is **`mid_oather`**. |
| `spell-void-reel` (pull 1 toward nearest **void/portal**) | `cinder_reeler` (toward **hazard**); `paint_reeler` (toward **paint**); `foe_reeler` (toward a **body**); `file_reeler` (along file toward **caster**) | Sixth `applyAttract` dest flavor. Extra room `void_aisle` is a teach — family is **`void_reeler`**. Dest is **toward**, not onto, a world portal. |
| `spell-foe-bite` (10 + 8 if target has adj **hostile**) | `side_biter` (adj **ally** of caster); `lone_stinger` (0 adj hostiles-to-target); `nook_biter` (exactly 1 **block**) | Fight in the crowd. Isolated target is 10 only. |
| `spell-dwell-mark` (cell paint; detonate on **end-turn occupy**) | `ingress_marker` (detonate on **enter**); `stride_marker` (detonate on **leave**); `lean_prelate` (this pass, end-turn occupy **and leftover AP = 0**) | Walk-on and walk-off the same turn is free. Extra room `dwell_pulpit` is a teach — family is **`dwell_marker`**. |
| `spell-own-plate` (next **own-turn** damaging hit → 0) | `off_plater` (next **off-turn** hit); `mid_hooder` (hit from exactly 2); `sidestep_warder` (next hit **any** turn) | Hit them **on your turn**. Overwatch / reflect / thorn consume. |
| `spell-cinder-skip` (next **1-tile** walk treats cinder as floor) | `spike_skipper` (**spikes**); `lava_skipper` (**lava**); `pit_skipper` (**pit**) | Does not ignore lava / spikes / pit / void / barriers. |
| `spell-full-plate` (leftover **AP ≥ 3** → +RES) | `tapped_plater` (leftover **AP = 0**); `still_plater` (leftover **MP = 0**); `empty_plater` (Wave 8 leftover-AP RES gate) | Keep 3 AP after the 2-AP arm. |
| `spell-summon-toll` (allied summons pay +1 AP to **start a walk**) | `walk_toller` (taxes the **caster’s** walk); `kennel_siller` (pets cannot leave); `brace_chanter` (pets ignore force) | Pets sit or pay. Player copy taxes **their** pets. |
| `spell-still-mend` (heal 8 iff caster `walkMpSpentThisTurn === 0`) | `dry_gaiter` (both leftover **MP = 0**); `dry_mender` (both leftover **AP = 0**); `bar_mender` (target resolved a **spell**); `pale_cantor` (unconditional) | Healer CORE only. They may still have leftover MP from Dual Keep. |
| `spell-cadence-rest` (own remaining CDs **do not tick** this turn) | `cadence_pinner` (one **hostile** remaining frozen); `cadence_staller` (**+1** all); `cadence_imprinter` (this pass, **copy** matching) | Park Inferno 3 one extra turn. Does not rewrite remaining. |
| `spell-spent-tax` (next spell +1 AP if they **walked last turn**) | `still_taxer` (next spell +1 if they **camped**); `gait_taxer` (next spell +1 if they **walked** — same wallet, different writer); Quiet Hex (always +1) | Strike exempt. Camp last turn → fizzle. |
| `spell-brick-crack` (remove **one** adjacent barrier) | `brick_sprouter` (**grows**); `brick_shifter` (**slides**); `brick_wiper` (**erases** paint) | Open a file. Extra room `crack_nave` is a teach — family is **`brick_cracker`**. Solvability skip. |
| `spell-watch-lend` (next **overwatch snap** grants the watcher +1 AP) | `watch_feer` (snap costs the **walker** 1 AP); `watch_muter` (snap deals **0**); Far Watch / Hold Ground **are** the snap | The snap still deals. Watcher gets a second action. |
| `spell-pair-purse` (10 + 8 if leftover AP **exactly 2**) | `lone_purser` (leftover AP **exactly 1**); `dry_stinger` (leftover **= 0**); `full_purser` (leftover **≥ 3**); `lean_stinger` (this pass, leftover AP **= 0 and** leftover MP ≥ 1) | Spend down to 2, or spend the pair. |
| `spell-escort-cut` (10 + 10 if target has an allied **summon** in Chebyshev ≤ 2) | `banner_cutter` (`isLeader`); `pet_cutter` (bonus on the **pet**); `crown_cutter` (`leader_slayer` grant) | Prefer the handler. Dummy Post is not a pet. |
| `spell-dry-mend` (heal 8 iff **caster and target** leftover **AP = 0**) | `dry_gaiter` (leftover **MP = 0**); `still_mender` (caster walk-MP spent = 0); `heave_mender` (both force-moved) | Healer CORE only. Extra door: **none** — do not invent `dry_cantor`. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-imprint` (`NOT_PLAYER_LEARNABLE`; `court_imprint_regent` kit — same law as Court Dual on `dual_keeper` CHAMPION witness), `spell-pack-long` (ENEMY_ONLY; stays `long_precentor` CHAMPION SIGNATURE), `spell-adj-fold` (BOSS_ONLY; `adj_fold_regent` kit — never a world pack), `spell-pack-cap` / `spell-reach-fold` (SDE Wave 12 never-owned). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Stride / Knight Fold / Court Keep / Pack Close / Mid Fold / Court Dual stay where Waves 5–12 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 13 CORE rows are `mpCost: 0`. Parched Sip / Lean Lend rewrite **current leftover MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Lean Post / Dwell Mark / Cadence Imprint are **not** queue splices.  
Do **not** family an eight-cell occupy. Six Span is the six-cell card. Sept Span already owns seven.  
Do **not** ship `spell-parched-mend` beside Dry Gait.  
Do **not** family heal-if-**both leftover AP and leftover MP = 0** as a second id.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs **including zeros**. Imprint **copies** matching remaining; Rest **skips own tick**; Halve is `floor(remaining/2)` on remaining ≥ 1.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint remaining SDE Wave 12 unique CORE as this pass’s CORE (`spell-orth-stride` … except Dry Gait).  
Do **not** mint `wave13:` colliding spell ids.  
Do **not** name the Cadence Imprint family `imprint_precentor`, the Six Span family `span_six`, the Dry Gait family `parched_cantor`, the Diag Stride family `diag_gallery`, the Mid Oath family `mid_nave`, the Void Reel family `void_aisle`, the Dwell Mark family `dwell_pulpit`, or the Brick Crack family `crack_nave`.

---

## 3. Encounter synergy packs (Waves 1–13)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** Drift Post **or** Lean Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span **or** Six Span **or** Sept Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Imprint Choir | `cadence_imprinter` + `verse_leaner` + `ignite_alchemist` | Copy Inferno 3, then that id is illegal until leftover MP = 0 |
| Six Plug | `six_prelate` + `parched_siller` + `rank_lancer` | 2×3 seal, nail walk-off, lance the long axis. Skip until remaining cap ≥ 6 |
| Odd Lean | `odd_hooder` + `must_leaner` + `glass_sniper` | Odd-range miss + tools need leftover MP = 0 + snipe from 2 |
| Lean Court | `lean_stinger` + `parched_sipper` + `dry_holder` | Dry-purse / wet-walk poke, steal the chip, nail walk until they dump AP |
| Parched Quiet | `parched_stepper` + `dry_gaiter` + `cover_squire` | Join the leftover-MP=0 ally, then cash the dual-dry-MP 8 |
| Dry Gate | `lean_prelate` + `parched_siller` + `lean_stinger` | Post detonates leftover-AP=0 occupy; tile also forbids walk; sting the rest |
| Bounce File | `parched_bouncer` + `must_leaner` + `fuse_binder` | Two leftover-MP=0 bodies, bounce 12+8 onto the wick |
| Lean Hold File | `lean_holder` + `must_leaner` + `leash_warden` | Strike **and** tools need leftover MP = 0 — COURT, never PAIR Lean Hold + Must Lean on the same body without a third peeler |
| Diag Mid | `diag_warder` + `mid_oather` + `far_stinger` | Next walk must be diagonal, next spell must be exact 2 |
| Void Dwell | `void_reeler` + `dwell_marker` + `void_mirror` | Pull toward the void, paint the toward-cell |
| Foe Escort | `foe_biter` + `escort_cutter` + `brood_chanter` | Crowd bonus on the handler, then pet-in-2 bonus |
| Own Watch | `own_plater` + `watch_lender` + `stone_castellan` | Own-turn miss, then the snap they walk into funds +1 AP |
| Cinder Full | `cinder_skipper` + `full_plater` + `ember_knight` | Cross the wake, then leftover-AP≥3 +RES |
| Still Rest | `still_mender` + `cadence_rester` + `once_cantor` | Camped heal, then Inferno remaining does not tick |
| Spent Crack | `spent_taxer` + `brick_cracker` + `tax_scribe` | Tax the tool after they walked, then open the file they hid behind |
| Pair Dry | `pair_purser` + `dry_mender` + `coil_arbiter` | Poke leftover exactly 2, then cash both leftover-AP=0 |
| Toll Kennel | `summon_toller` + `kennel_siller` + `null_censor` | Pets pay AP to walk, then they cannot leave — teach contrast vs Brace |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch), Wave 11 packs (Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step), and Wave 12 packs (Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner).

Do **not** pack as PAIR (COURT later is fine):

- `dry_gaiter` + `dry_mender` / `still_mender` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor`
- `cadence_imprinter` + `cadence_thief` / `cadence_rester` / `cadence_halver` / `cadence_pinner` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer`
- `six_prelate` + `sept_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `odd_hooder` + `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater`
- `lean_stinger` + `dry_stinger` / `damp_stinger` / `ready_stinger` / `lone_purser` / `pair_purser` / `full_purser`
- `parched_stepper` + `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire`
- `parched_siller` + `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `body_siller`
- `dry_holder` + `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver`
- `lean_lender` + `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender`
- `parched_sipper` + `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon`
- `lean_prelate` + `dummy_prelate` / `drift_prelate` / `dwell_marker` / `ingress_marker` / `bait_prelate`
- `parched_bouncer` + `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger`
- `must_leaner` + `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller`
- `verse_leaner` + `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor`
- `lean_holder` + `hold_knight` / `rite_holder` / `tool_holder` / `boot_holder` / `must_leaner` as PAIR
- `diag_warder` + `diag_locksmith` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith`
- `mid_oather` + `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR
- `void_reeler` + `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter`
- `foe_biter` + `side_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter`
- `dwell_marker` + `ingress_marker` / `stride_marker` / `lean_prelate` / `gait_wicker` / `exit_stinger` / `fuse_binder`
- `own_plater` + `off_plater` / `mid_hooder` / `sidestep_warder` / `morrow_warden` / `tick_plater`
- `cinder_skipper` + `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `ember_knight` as PAIR
- `full_plater` + `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden`
- `summon_toller` + `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR
- `still_mender` + `dry_gaiter` / `dry_mender` / `bar_mender` / `heave_mender` / `pale_cantor`
- `cadence_rester` + `cadence_imprinter` / `cadence_pinner` / `cadence_staller` / `cadence_thief`
- `spent_taxer` + `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer`
- `brick_cracker` + `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan`
- `watch_lender` + `watch_feer` / `watch_muter` / `glass_sniper` as PAIR
- `pair_purser` + `lone_purser` / `dry_stinger` / `full_purser` / `lean_stinger` / `ready_stinger`
- `escort_cutter` + `banner_cutter` / `pet_cutter` / `crown_cutter` / `null_censor` as PAIR
- `dry_mender` + `dry_gaiter` / `still_mender` / `heave_mender` / `both_mender` / `pale_cantor`

Do **not** spawn Six Plug on a map with no 2×3 free rectangle (solvability). Do not spawn Void Dwell on a map with no void/portal in Chebyshev 4 of a legal floor. Do not spawn Cinder Full on a map with no cinder / ember-wake cell.

---

## 4. Family sheets — Wave 13

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-29.md`](https://github.com/Mr-Melic/stralt/pull/787) (PR #787) unless marked SDE Wave 11 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-bd29/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md), PR #747) or SDE Wave 12 Dry Gait ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-1c4e/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md), PR #802).

---

### ENEMY_ID: `dry_gaiter`

- **NAME:** Dry Gaiter
- **ROLE:** healer (heal iff caster **and** target leftover **MP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Dry Gait (`spell-dry-gait`, SDE Wave 12) — **not** `spell-parched-mend`. `#787` Parched Mend is a tombstone. Extra door `parched_cantor` is **not** this family’s door. Distinct from `dry_mender` (leftover **AP**), `still_mender` (caster walk-MP spent = 0), `heave_mender` (both force-moved). At most one leftover-MP=0-heal CORE per pack as PAIR vs Dry / Still / Heave / Both / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover MP ≥ 1. Peer: Dry Gait only if both leftover MP = 0 **and** missing HP ≥ 8. Above: refuse if either leftover MP ≥ 1 (Frost / Shield). Never dump leftover MP **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two walk pools already empty**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_leftover_mp_eq_0"`. VETERAN: skip if either leftover MP ≥ 1 **or** missing HP < 8. ELITE: wait for Walk Toll / Must Step. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; leftover AP does **not** substitute.
- **CORE_SPELL_POOL:** `spell-dry-gait`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-parched-sip` only if `parched_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — dual-dry-MP honesty is the elite. Do **not** unlock Dry Mend or Parched Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff both leftover walk MP = 0. Fails closed without leftover-MP writers. Self-cast requires the caster’s leftover MP is 0.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-wet → ELITE wait-for-toll → CHAMPION no-dump-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Parched Quiet.
- **SYNERGIES:** `parched_stepper`, `parched_sipper`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover MP; Cursed Wound halves the 8
- **PLAYER_COUNTERPLAY:** Keep 1 leftover MP on one body; Root the cantor; kill the Gaiter first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dry-gait` (ENEMY_DISCOVERY observe+win). Do **not** restamp `parched_cantor` / `both_cantor` / `heave_cantor`.
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover-MP reads + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_imprinter`

- **NAME:** Cadence Imprinter
- **ROLE:** debuffer / controller (copy matching remaining CDs onto self; target keeps)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_thief` (steals), `cadence_rester` (own remaining skip tick), `cadence_halver` (÷2 on them), `cadence_pinner` (freeze one). Extra door is `imprint_precentor` — family is **not** that id. At most one CD-copy CORE per pack as PAIR vs Theft / Rest / Halve / Pin.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no shared id with remaining ≥ 2. Peer: Imprint if the intersection remaining ≥ 2 **and** the caster can live without that id this turn. Above: refuse if the next intended id would lock, or if Crack already zeroed the intersection.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **shared downtime**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "imprint_if_target_has_matching_remaining_cd_ge_2"`. VETERAN: skip if intersection empty. ELITE: Imprint then Verse Lean the copied id. CHAMPION: never copy a 1 if they needed that tool; death does not refund the copy.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-imprint`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-verse-lean` only if `verse_leaner` is **absent**
- **ELITE_SPELL_POOL:** none — copy honesty is the elite. Do **not** unlock Cadence Theft as identity.
- **SIGNATURE_MECHANICS:** For each of the target’s remaining CDs with `n > 0`, if the caster owns that **id**, write caster remaining = `max(caster remaining, n)`. Target keeps. Ids the caster does not own are ignored.
- **VARIANT_PROGRESSION:** BASE frost-or-copy → VETERAN skip-if-empty → ELITE copy-then-pin → CHAMPION refuse-self-brick
- **RARITY_CURVE:** Standard. +ELITE in Imprint Choir.
- **SYNERGIES:** `verse_leaner`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Recast the locked id **before** Imprint; Cadence Crack their highest to 0; do not share Inferno
- **PLAYER_COUNTERPLAY:** Recast Inferno first; Crack; fight with no shared ids
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-imprint` (MULTI: family observe **or** `imprint_precentor` first-win — first child wins). Do not restamp `halve_precentor` / `trim_precentor` / `long_precentor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (intersect two cooldown maps by id)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `six_prelate`

- **NAME:** Six Prelate
- **ROLE:** summoner (stationary 2×3 occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `sept_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate` / `lean_prelate`. Extra door is `span_six` — family is **not** that id. At most one Six Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 6.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place southwest origin if a 2×3 rectangle seals a corridor. Peer: skip if any of the six is blocked **or** remaining cap < 6. Above: place off-axis so Parched Sill / Rank Lance tax the walk-around.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.15, init 0.65, chc 0.70. Six uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `sixspan` (SPELL_PROPOSALS): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **six** cells as one combatant id. VETERAN: skip if remaining cap < 6. ELITE: Parched Sill a walk-around cell. CHAMPION: never punch a hole if a later pit lands on one cell — whole rectangle dies.
- **CORE_SPELL_POOL:** `spell-six-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the rectangle)
- **RARE_SPELL_POOL:** `spell-parched-sill` only if `parched_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad / penta / sept / driftpost / leanpost on this body.
- **SIGNATURE_MECHANICS:** Cardinal **file** = 2 wide × 3 tall, or **rank** = 3 wide × 2 tall from southwest origin. Counts as **six**. Empty kit. 0 XP on rectangle death. Brick Shift does **not** move occupy cells.
- **VARIANT_PROGRESSION:** BASE wall → VETERAN respect-cap-6 → ELITE sill-the-wing → CHAMPION whole-rect-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 6. Weight 0 on cramped 1-tile closets (solvability).
- **SYNERGIES:** `parched_siller`, `rank_lancer`, `cast_siller`
- **WEAKNESSES:** Burst the 8 HP; walk around the long axis; Swap past; open field
- **PLAYER_COUNTERPLAY:** Sit on the origin; Ignite the 8; artillery if LoS is open from a far diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-six-span` (MULTI: family observe **or** `span_six` first-win — first child wins). Six kit is empty — nothing to steal from the post.
- **REWARD_EXPECTATION:** Standard. Rectangle death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "sixspan"`; six-cell footprint helper; do not spawn six initiative seats)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_hooder`

- **NAME:** Odd Hooder
- **ROLE:** tank (next hit from **odd** Chebyshev → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `near_hooder` (≤ 1), `mid_hooder` (exactly 2), `far_hooder` (≥ 3), `own_plater` (own-turn any range). ELITE observe. At most one odd-parity hood CORE per pack as PAIR vs Near / Mid / Far / Own / Off.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Hood if the only threat sits at 1 or 3. Peer: skip if the only threat sits at 2 (even — they land). Above: Hood then Must Lean so leftover MP = 0 forces a 1-step (odd) poke.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.80, sr 1.00, res 1.10, init 0.90, chc 0.70. Identity is **parity**, not extra RES. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "odd_hood_if_likely_next_hit_odd_chebyshev"`. VETERAN: skip if the only threat sits at 2. ELITE: pair with Must Lean. CHAMPION: consume **before** `dealDamage`; DoT does **not** consume; same-cell (0, even) lands.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-odd-hood`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-must-lean` only if `must_leaner` is **absent**
- **ELITE_SPELL_POOL:** none — parity honesty is the elite. Do **not** unlock Mid Hood as identity.
- **SIGNATURE_MECHANICS:** Next applied damaging hit whose Chebyshev is odd (1, 3, 5, …) deals 0 and consumes. Even (0, 2, 4, …) lands and does **not** consume. Do not read `CharacterStats.evasion`.
- **VARIANT_PROGRESSION:** BASE hood-or-shield → VETERAN skip-if-even-threat → ELITE pair-must-lean → CHAMPION consume-before-damage
- **RARITY_CURVE:** Standard. +ELITE in Odd Lean.
- **SYNERGIES:** `must_leaner`, `glass_sniper`, `leash_warden`
- **WEAKNESSES:** Step to 2 then Strike; wait the consume; Dispel
- **PLAYER_COUNTERPLAY:** Hit from even Chebyshev; Slow then step to 2; do not poke from 1 or 3
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-hood` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-hit consume gated on Chebyshev parity)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_stinger`

- **NAME:** Lean Stinger
- **ROLE:** assassin (bonus iff leftover **AP = 0 and leftover MP ≥ 1**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `dry_stinger` (leftover AP = 0, no MP gate), `ready_stinger` (AP ≥ 1 **and** MP ≥ 1), `damp_stinger` (MP ≥ 2), `pair_purser` (AP exactly 2). At most one dry-purse/wet-walk poke CORE per pack as PAIR vs Dry / Ready / Damp / Pair / Lone / Full.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if either gate fails. Peer: Lean Sting only if leftover AP = 0 **and** leftover MP ≥ 1. Above: refuse the 10-only if Strike is better; wait for Dry Hold.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the two-flag window**. If it tops the meter ungated, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_0_and_leftover_mp_ge_1"`. VETERAN: skip if either gate fails. ELITE: wait for Dry Hold / Drain Courage. CHAMPION: never dump **their own** leftover just to teach the window.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lean-sting`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-parched-sip` only if `parched_sipper` is **absent**
- **ELITE_SPELL_POOL:** none — two-flag honesty is the elite
- **SIGNATURE_MECHANICS:** Deal 10. Extra 8 iff **target** leftover AP = 0 **and** leftover walk MP ≥ 1. After this spell’s cost is **their** leftover, not the caster’s.
- **VARIANT_PROGRESSION:** BASE strike-or-sting → VETERAN skip-if-gates-fail → ELITE wait-for-dry-hold → CHAMPION refuse-10-only
- **RARITY_CURVE:** Standard. +VETERAN in Lean Court.
- **SYNERGIES:** `dry_holder`, `parched_sipper`, `coil_arbiter`
- **WEAKNESSES:** Keep 1 leftover AP; spend the last MP; Purse Keep
- **PLAYER_COUNTERPLAY:** Spend down to 0 MP or keep 1 AP; Slow after the poke
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `parched_stepper`

- **NAME:** Parched Stepper
- **ROLE:** teleporter / protector (caster lands adj to leftover-MP=0 ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `home_stepper` (ungated), `heave_stepper` (force-moved ally), `ally_stepper` (they land next to caster). At most one leftover-MP=0 join CORE per pack as PAIR vs Home / Heave / Ally.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP ≥ 1 or no free dest. Peer: Step only if ally leftover MP = 0 **and** a free Chebyshev-1 exists. Above: refuse if they still have 1 MP, or dest is a hazard they cannot pay.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.20, chc 0.80. Identity is **the gated blink-to-ally**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "parched_step_if_ally_leftover_mp_eq_0_and_free_adj"`. VETERAN: skip if leftover MP ≥ 1 or no free dest. ELITE: Step then Dry Gait. CHAMPION: dest hazards tick; never `isSwap`; self-target illegal.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-parched-step`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-dry-gait` only if `dry_gaiter` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP join honesty is the elite. Do **not** unlock Home Step as identity.
- **SIGNATURE_MECHANICS:** Relocate the **caster** onto a free Chebyshev-1 of an ally whose leftover walk MP = 0. Not `isSwap`. Dest hazards must tick.
- **VARIANT_PROGRESSION:** BASE frost-or-step → VETERAN skip-if-wet → ELITE step-then-gait → CHAMPION dest-tick
- **RARITY_CURVE:** Standard. +ELITE in Parched Quiet.
- **SYNERGIES:** `dry_gaiter`, `cover_squire`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover MP on the ally; occupy every Chebyshev-1; Root the stepper
- **PLAYER_COUNTERPLAY:** Keep 1 leftover MP; occupy adj; do not dump walk MP next to a queen
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-parched-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest pick, not `swapPositions`)
- **STATUS:** PROPOSED


---

### ENEMY_ID: `parched_siller`

- **NAME:** Parched Siller
- **ROLE:** hazard creator (occupant cannot spend walk MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `drift_siller` (occupant cannot be a relocate dest), `gait_sealer` (unit), `quiet_siller` / `cast_siller` (confirm-gates). At most one tile-walk-lock CORE per pack as PAIR vs Drift / Quiet / Cast / Gait Seal.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player can walk around for 1 extra MP. Peer: paint the cell they wanted to leave on foot. Above: paint a choke they must occupy, then Lean Sting while they sit.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 0.95, init 0.85, chc 0.75. Identity is **the painted walk lock**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "parched_sill_on_likely_walk_origin"`. VETERAN: skip if they can walk around. ELITE: paint then Lean Sting. CHAMPION: force-move / swap still legal; paint is observation, later blocked walk is not a second observe.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-parched-sill`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-lean-sting` only if `lean_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — tile-walk-lock honesty is the elite. Do **not** unlock Drift Sill as identity.
- **SIGNATURE_MECHANICS:** Paint one free cell 2 turns. Occupant cannot spend walk MP. Force-move / swap / blink onto or off is legal.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-bypass → ELITE paint-then-sting → CHAMPION force-still-legal
- **RARITY_CURVE:** Standard. +ELITE in Six Plug / Dry Gate.
- **SYNERGIES:** `six_prelate`, `lean_prelate`, `bash_bruiser`
- **WEAKNESSES:** Do not stand on it; swap off; wait the 2
- **PLAYER_COUNTERPLAY:** Step around; Swap; Shoulder Bash off
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-parched-sill` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile flag on walk confirm)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dry_holder`

- **NAME:** Dry Holder
- **ROLE:** controller (cannot walk until leftover AP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `drift_holder` (until force-moved), `boot_holder` (until Strike), `gait_sealer` (cannot walk; spells legal). ELITE observe. At most one leftover-AP-unlocks-walk CORE per pack as PAIR vs Drift / Boot / Gait Seal.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP is already 0. Peer: Hold if leftover AP ≥ 2 and they want to walk. Above: Hold then Lean Sting the dry-purse / wet-walk window.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.05, chc 0.80. Identity is **dump AP first**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "dry_hold_if_target_has_leftover_ap_ge_2_and_wants_to_walk"`. VETERAN: skip if leftover AP already 0. ELITE: pair with Lean Sting. CHAMPION: force-move still legal; duration is **their** turns.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-dry-hold`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-lean-sting` only if `lean_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-AP peel honesty is the elite. Do **not** unlock Drift Hold as identity.
- **SIGNATURE_MECHANICS:** For 2 of the target’s turns, they cannot spend walk MP until leftover AP = 0 on that turn. Dumping AP unlocks walking that turn.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-already-dry → ELITE hold-then-sting → CHAMPION force-still-legal
- **RARITY_CURVE:** Standard. +ELITE in Lean Court.
- **SYNERGIES:** `lean_stinger`, `parched_sipper`, `hex_chorister`
- **WEAKNESSES:** Dump AP on a cheap Strike, then walk; wait 2
- **PLAYER_COUNTERPLAY:** Empty the purse first; Swap; do not camp leftover AP on a painted tile
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dry-hold` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm gated on leftover AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_lender`

- **NAME:** Lean Lender
- **ROLE:** buffer (+1 MP to an ally whose leftover AP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `spent_lender` (+1 MP if they walked), `drift_lender` (+1 AP if forced), `boot_lender` (unmoved), `tempo_precentor` (ungated AP). At most one leftover-AP=0 MP-gift CORE per pack as PAIR vs Spent / Drift / Boot / Tempo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP ≥ 1. Peer: Lend if leftover AP = 0 **and** they still need a step. Above: refuse if leftover AP ≥ 1 or they sit on a hazard they must leave by force.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.90, res 0.80, init 1.15, chc 0.75. Identity is **the gifted step after an empty purse**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "lean_lend_if_ally_leftover_ap_eq_0"`. VETERAN: skip if leftover AP ≥ 1. ELITE: Lend after Dry Hold. CHAMPION: self-target legal if the caster’s leftover AP is 0 after this 2-AP spend.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-lean-lend`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-dry-hold` only if `dry_holder` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-AP gift honesty is the elite
- **SIGNATURE_MECHANICS:** If target leftover AP = 0, add 1 current walk MP (capped at max). Else fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-wet-purse → ELITE lend-after-hold → CHAMPION self-if-dry
- **RARITY_CURVE:** Standard. +VETERAN with Dry Holder already in pack (COURT, not PAIR).
- **SYNERGIES:** `dry_holder`, `parched_stepper`, `odd_hooder`
- **WEAKNESSES:** Keep 1 leftover AP; Slow after the gift
- **PLAYER_COUNTERPLAY:** Keep 1 leftover AP; kill the Lender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-AP read + MP add)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `parched_sipper`

- **NAME:** Parched Sipper
- **ROLE:** debuffer (steal 1 leftover MP iff leftover AP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `gait_sipper` (steal MP iff they walked), `drift_sipper` (steal leftover AP iff forced), `soul_siphon` (ungated MP). At most one leftover-AP=0 MP-steal CORE per pack as PAIR vs Gait / Drift / Soul / Ledger.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover AP ≥ 1 or leftover MP = 0. Peer: Sip if leftover AP = 0 **and** leftover MP ≥ 1. Above: refuse if either gate fails; wait for Dry Hold.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.85, res 0.75, init 1.20, chc 0.90. Identity is **zero-sum 1 MP**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "parched_sip_if_target_leftover_ap_eq_0_and_leftover_mp_ge_1"`. VETERAN: skip if either gate fails. ELITE: Sip then Lean Sting. CHAMPION: do not debit `spell.mpCost`; caster leftover MP this turn only.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-parched-sip`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-lean-sting` only if `lean_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — two-flag steal honesty is the elite
- **SIGNATURE_MECHANICS:** If leftover AP = 0 and leftover walk MP ≥ 1, move 1 leftover MP from them to the caster. Else fizzle.
- **VARIANT_PROGRESSION:** BASE frost-or-sip → VETERAN skip-if-gates-fail → ELITE sip-then-sting → CHAMPION no-mpCost
- **RARITY_CURVE:** Standard. +VETERAN in Lean Court.
- **SYNERGIES:** `lean_stinger`, `dry_holder`, `dry_gaiter`
- **WEAKNESSES:** Keep 1 leftover AP; spend the last MP before the sip
- **PLAYER_COUNTERPLAY:** Keep 1 leftover AP; dump the last MP; kill the Sipper
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-parched-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover reads + 1 MP move)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_prelate`

- **NAME:** Lean Prelate
- **ROLE:** summoner / kamikaze (end-turn occupy + leftover AP = 0 detonates)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. Distinct from `dummy_prelate` (taunt), `drift_prelate` (relocate landing), `dwell_marker` (end-turn occupy, any leftover), `ingress_marker` (walk enter). At most one leftover-AP=0 post CORE per pack as PAIR vs Dummy / Drift / Dwell / Ingress / Bait. Counts as **1**. Legal at remaining cap ≥ 1.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place if they will dump AP on that cell. Peer: skip if they can end with leftover AP ≥ 1 for free. Above: place then Dry Hold so dumping AP is the only peel.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.70, sr 1.00, res 0.90, init 0.70, chc 0.70. Post uses `damageScale: 0`, HP 1. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `leanpost`: `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **one** cell. VETERAN: skip if they can camp leftover AP ≥ 1. ELITE: Dry Hold / Quiet Sill the post. CHAMPION: summon is observation; later detonate is not a second observe.
- **CORE_SPELL_POOL:** `spell-lean-post`
- **ADVANCED_SPELL_POOL:** `starter-frost` (on the prelate, not the post)
- **RARE_SPELL_POOL:** `spell-parched-sill` only if `parched_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / dummy / bait / driftpost / sixspan on this body.
- **SIGNATURE_MECHANICS:** Empty-kit body. Hostile **ends their turn** occupying this cell **and** leftover AP = 0 → 10 and the post dies. Walk onto is safe. Relocate landing is safe. End-turn occupy with leftover AP ≥ 1 is safe.
- **VARIANT_PROGRESSION:** BASE place → VETERAN skip-if-camp-1-AP → ELITE hold-the-cell → CHAMPION observe-on-summon-only
- **RARITY_CURVE:** Standard. +ELITE in Dry Gate. Weight 0 in 1-tile closets (solvability).
- **SYNERGIES:** `parched_siller`, `dry_holder`, `lean_stinger`
- **WEAKNESSES:** End turn with 1 leftover AP; walk off before end; Coup the post
- **PLAYER_COUNTERPLAY:** Camp 1 AP on the post; walk off; burst the 1 HP
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-post` (MULTI observe+win; **no** extra feat door)
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "leanpost"`; end-of-turn occupy + leftover-AP gate + death; not a mid-RAF splice)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `parched_bouncer`

- **NAME:** Parched Bouncer
- **ROLE:** artillery (bounce 1 to another leftover-MP=0 hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `heave_bouncer` (force-moved), Chain Lightning (nearest any), `ricochet_vicar` (predicate bounce). At most one leftover-MP=0 bounce CORE per pack as PAIR vs Heave / Storm / Ricochet / Split.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second leftover-MP=0 body in 4. Peer: Bounce if a second dry-MP hostile exists. Above: refuse the 12-only if Frost is better; wait for Walk Toll.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.90, res 0.80, init 1.10, chc 0.85. Identity is **the second dry-MP body**. If it tops the meter ungated, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "parched_bounce_if_second_leftover_mp_eq_0_in_4"`. VETERAN: skip if no second dry-MP body. ELITE: wait for Must Lean / Walk Toll. CHAMPION: bounce that finds no second body **is** observation; bounce payload 8, not 12.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-parched-bounce`
- **ADVANCED_SPELL_POOL:** `spell-inferno` only if the player is already committed to leftover MP = 0, `spell-mark`
- **RARE_SPELL_POOL:** `spell-must-lean` only if `must_leaner` is **absent**
- **ELITE_SPELL_POOL:** none — second-flag bounce honesty is the elite
- **SIGNATURE_MECHANICS:** 12 to primary. Bounce 1 to the nearest **other** living hostile with leftover walk MP = 0 in Chebyshev ≤ 4. If none, 12 only.
- **VARIANT_PROGRESSION:** BASE frost-or-bounce → VETERAN skip-if-no-second → ELITE wait-for-toll → CHAMPION observe-on-miss
- **RARITY_CURVE:** Standard. +ELITE in Bounce File.
- **SYNERGIES:** `must_leaner`, `fuse_binder`, `walk_toller`
- **WEAKNESSES:** Keep 1 leftover MP on the second body; spread past 4
- **PLAYER_COUNTERPLAY:** Keep 1 leftover MP on one ally/summon; spread; kill the Bouncer first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-parched-bounce` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (search + second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_leaner`

- **NAME:** Must Leaner
- **ROLE:** controller (remaining non-Strike spells illegal unless leftover MP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `hold_caster` (all spells until walk), `tool_holder` (tools until Strike), `must_drifter` (walk dir). ELITE observe. At most one leftover-MP-unlocks-tools CORE per pack as PAIR vs Cast Hold / Tool Hold / Must Drift / Must Step.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover MP is already 0. Peer: Lean if leftover MP ≥ 1 **and** they have a tool. Above: Lean then Lean Hold so Strike **and** tools need leftover MP = 0 — COURT with a third peeler, never PAIR.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.85, init 1.10, chc 0.80. Identity is **dump/camp walk before the tool**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_lean_if_target_has_leftover_mp_ge_1_and_a_tool"`. VETERAN: skip if leftover MP is already 0. ELITE: pair with Odd Hood. CHAMPION: applies to the **target’s** remaining actions, not a mid-RAF splice; gate on `isPhysical`, never `spell.name`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-must-lean`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-odd-hood` only if `odd_hooder` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP tool-lock honesty is the elite
- **SIGNATURE_MECHANICS:** For the rest of that one turn, they cannot confirm a **non-Strike** spell unless leftover walk MP = 0. Strike stays legal.
- **VARIANT_PROGRESSION:** BASE strike-or-lean → VETERAN skip-if-already-dry → ELITE pair-odd-hood → CHAMPION no-name-gate
- **RARITY_CURVE:** Standard. +ELITE in Odd Lean / Bounce File.
- **SYNERGIES:** `odd_hooder`, `verse_leaner`, `glass_sniper`
- **WEAKNESSES:** Dump leftover MP; Strike; wait the turn
- **PLAYER_COUNTERPLAY:** Empty the walk pool; live on Strike; kill the Leaner
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-lean` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (confirm gate on leftover MP + `isPhysical`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_leaner`

- **NAME:** Verse Leaner
- **ROLE:** debuffer / status specialist (last id illegal until leftover MP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `verse_pacer` (until they walk), `last_muter` (duration), `verse_taxer` (legal but +1 AP), `first_verser` (must cast this id first). At most one leftover-MP last-id pin CORE per pack as PAIR vs Pace / Mute / Tax / First / Once.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no last id. Peer: Lean if last id is their best tool. Above: refuse if no last id; wait until they recast Inferno.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **one-id pin with an MP key**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "verse_lean_if_target_last_id_is_their_best_tool"`. VETERAN: skip if no last id. ELITE: Imprint then Lean the copied id. CHAMPION: fails closed without `lastResolvedSpellId`; forced-move does **not** peel.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-lean`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-cadence-imprint` only if `cadence_imprinter` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP last-id honesty is the elite
- **SIGNATURE_MECHANICS:** Target’s last resolved spell id becomes illegal until leftover walk MP = 0. Dumping or camping the walk pool clears the pin.
- **VARIANT_PROGRESSION:** BASE frost-or-pin → VETERAN skip-if-no-last → ELITE imprint-then-pin → CHAMPION force-does-not-peel
- **RARITY_CURVE:** Standard. +ELITE in Imprint Choir.
- **SYNERGIES:** `cadence_imprinter`, `ignite_alchemist`, `must_leaner`
- **WEAKNESSES:** Walk leftover to 0; recast a different id; wait
- **PLAYER_COUNTERPLAY:** Empty the walk pool; swap to a different id; kill the Leaner
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-lean` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (last-id pin + leftover-MP clear)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lean_holder`

- **NAME:** Lean Holder
- **ROLE:** anti-melee / controller (cannot Strike until leftover MP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `hold_knight` (cannot Strike until walk), `rite_holder` (cannot Strike until a spell), `tool_holder` (cannot tool until Strike). At most one leftover-MP-unlocks-Strike CORE per pack as PAIR vs Hold Knight / Rite / Tool / Must Lean.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP is already 0. Peer: Hold if they want Strike with leftover MP ≥ 1. Above: Hold then Must Lean — COURT with a third peeler, never PAIR.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.05, chc 0.80. Identity is **dump/camp walk before the punch**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "lean_hold_if_target_wants_strike_with_leftover_mp_ge_1"`. VETERAN: skip if leftover MP is already 0. ELITE: pair with Odd Hood. CHAMPION: gate on `isPhysical === true`, never `spell.name === "Strike"`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lean-hold`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-odd-hood` only if `odd_hooder` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP Strike-lock honesty is the elite
- **SIGNATURE_MECHANICS:** For 2 of the target’s turns, they cannot confirm `physical_attack` / `isPhysical: true` until leftover walk MP = 0. Tools stay legal.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-already-dry → ELITE pair-odd-hood → CHAMPION no-name-gate
- **RARITY_CURVE:** Standard. +ELITE in Lean Hold File.
- **SYNERGIES:** `must_leaner`, `leash_warden`, `odd_hooder`
- **WEAKNESSES:** Dump leftover MP; tool-cast; wait 2
- **PLAYER_COUNTERPLAY:** Empty the walk pool; live on tools; kill the Holder
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lean-hold` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (Strike confirm gated on leftover MP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `diag_warder`

- **NAME:** Diag Warder
- **ROLE:** controller (next walk must be diagonal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. SDE Wave 11. Distinct from `inch_warder` (one next ≤ 1, ortho legal), `must_stepper` (all remaining Chebyshev 1), `diag_locksmith` (**forbids** diagonal dests). Extra door is `diag_gallery` — family is **not** that id. At most one diagonal-only-walk CORE per pack as PAIR vs Diag Lock / Inch / Must Step / Must Span.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the only remaining dests are orthogonal and Strike is better. Peer: Stride if they must leave a file. Above: Stride then Mid Oath so file-2 may be illegal to walk **and** illegal to nuke.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.85, sr 0.90, res 0.85, init 1.15, chc 0.80. Identity is **diagonal-only next walk**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "walk_diagonal_only"`. VETERAN: skip if only dests are orthogonal and Strike is better. ELITE: pair with Brick Crack. CHAMPION: teleport / Swap / Phase Slip do **not** pay the gate; one walk only.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-diag-stride`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-mid-oath` only if `mid_oather` is **absent**
- **ELITE_SPELL_POOL:** none — diagonal-walk honesty is the elite. Do **not** unlock Diag Lock as identity.
- **SIGNATURE_MECHANICS:** Target’s next walk of ≥ 1 tile is legal only if `|dx| == |dy|` and Chebyshev ≥ 1. Orthogonal dests fail confirm; MP is not spent.
- **VARIANT_PROGRESSION:** BASE frost-or-stride → VETERAN skip-if-only-ortho → ELITE pair-crack → CHAMPION blink-does-not-pay
- **RARITY_CURVE:** Standard. +ELITE in Diag Mid. Extra room `diag_gallery` is a teach.
- **SYNERGIES:** `mid_oather`, `brick_cracker`, `far_stinger`
- **WEAKNESSES:** Walk orthogonally **before** the arm; blink off; Strike in place
- **PLAYER_COUNTERPLAY:** Step ortho first; blink; sit and Strike
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-diag-stride` (MULTI: family observe **or** `diag_gallery` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm gated on `|dx|==|dy|`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `mid_oather`

- **NAME:** Mid Oather
- **ROLE:** anti-ranged / controller (next spell only at Chebyshev 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `long_oather` (≥ 3), `near_oather` (≤ 1), `mid_hooder` (next **hit** from exactly 2 → 0). Extra door is `mid_nave` — family is **not** that id. At most one exact-2 spell-oath CORE per pack as PAIR vs Long / Near / Unit / Ground / Mid Hood.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they must stay at 1 and Strike is better. Peer: Oath if they want a range-3+ nuke. Above: Oath then Diag Stride so walking to 2 may be illegal.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **exact-2 confirm**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_spell_exact_chebyshev_2"`. VETERAN: skip if they must stay at 1 and Strike is better. ELITE: pair with Quiet Hex on the mid-range spell. CHAMPION: Strike stays legal at any range; Frost at 1 or 3 fizzles.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-mid-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-diag-stride` only if `diag_warder` is **absent**
- **ELITE_SPELL_POOL:** none — exact-2 honesty is the elite. Do **not** unlock Long Oath as identity.
- **SIGNATURE_MECHANICS:** Target’s next spell (`damage > 0` or non-Strike tool) is illegal unless the target tile is Chebyshev exactly 2 from the caster. Strike stays legal.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee-better → ELITE pair-hex → CHAMPION strike-exempt
- **RARITY_CURVE:** Standard. +ELITE in Diag Mid. Extra room `mid_nave` is a teach.
- **SYNERGIES:** `diag_warder`, `far_stinger`, `leash_warden`
- **WEAKNESSES:** Step to 1 or 3 before the nuke; Strike through it; Dispel
- **PLAYER_COUNTERPLAY:** Stand at 1 or 3; live on Strike; kill the Oather
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mid-oath` (MULTI: family observe **or** `mid_nave` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-spell confirm gated on exact Chebyshev 2)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `void_reeler`

- **NAME:** Void Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest void/portal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. SDE Wave 11. Distinct from `cinder_reeler` (nearest hazard), `paint_reeler` (paint), `foe_reeler` (body), `file_reeler` (file toward caster). Extra door is `void_aisle` — family is **not** that id. At most one void/portal-attract CORE per pack as PAIR vs Cinder / Paint / Foe / Ally / File / Sink.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no void/portal in 4. Peer: Reel if a legal floor step **toward** exists. Above: refuse if the 1-step dest is a world portal the occupancy layer treats as impassable; paint Dwell Mark on the toward-cell.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.95, res 0.80, init 1.10, chc 0.80. Identity is **the sixth attract dest**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_void"`. VETERAN: skip if no void/portal in 4. ELITE: Reel then Dwell Mark. CHAMPION: dest is **toward**, not onto, unless that toward-cell is already a legal floor hazard the existing tick handles. Twin Gate pads are **not** this dest.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-void-reel`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-dwell-mark` only if `dwell_marker` is **absent**
- **ELITE_SPELL_POOL:** none — void-dest honesty is the elite. Do **not** unlock Cinder Reel as identity.
- **SIGNATURE_MECHANICS:** Pull 1 tile toward the nearest void or portal cell in Chebyshev ≤ 4 of the target. Empty / blocked / world-portal dest: fizzle that step (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-no-void → ELITE reel-then-dwell → CHAMPION toward-not-onto
- **RARITY_CURVE:** Standard. +ELITE in Void Dwell. Extra room `void_aisle` is a teach. Weight 0 on maps with no void/portal.
- **SYNERGIES:** `dwell_marker`, `void_mirror`, `brick_cracker`
- **WEAKNESSES:** Stand with no void in 4; occupy the toward-tile; Self Anchor
- **PLAYER_COUNTERPLAY:** Fight away from the rim; occupy the step; kill the Reeler first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-void-reel` (MULTI: family observe **or** `void_aisle` first-win — first child wins). Empty fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (sixth `applyAttract` dest flavor + occupancy)
- **STATUS:** PROPOSED



---

### ENEMY_ID: `foe_biter`

- **NAME:** Foe Biter
- **ROLE:** bruiser (bonus if target has an adjacent hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. SDE Wave 11. Distinct from `side_biter` (adj **ally** of caster), `lone_stinger` (0 adj hostiles-to-target), `nook_biter` (exactly 1 block). At most one adj-hostile bite CORE per pack as PAIR vs Side / Lone / Nook / Field / Wall.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no adjacent hostile-to-target. Peer: Bite only if a living hostile-to-the-target stands at Chebyshev 1. Above: refuse the 10-only if Strike is equal; wait for Pair Pace.
- **STAT_SCALING_RULE:** hp 0.95, sp 1.10, sr 0.85, res 0.85, init 1.15, chc 0.95. Identity is **the crowd**. If it tops the meter ungated, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `berserker`. `aiHint: "bonus_if_adjacent_hostile"`. VETERAN: skip if no adjacent hostile-to-target. ELITE: wait for Pair Pace / Ally Step. CHAMPION: never also apply Side Bite on the same hit (different keys; do not stack both on G=0).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-foe-bite`
- **ADVANCED_SPELL_POOL:** `spell-enrage`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-escort-cut` only if `escort_cutter` is **absent**
- **ELITE_SPELL_POOL:** none — crowd-bonus honesty is the elite
- **SIGNATURE_MECHANICS:** Deal 10. Extra 8 if a living **hostile-to-the-target** (not the caster, not an ally of the caster) stands at Chebyshev 1 from the target.
- **VARIANT_PROGRESSION:** BASE strike-or-bite → VETERAN skip-if-isolated → ELITE wait-for-pace → CHAMPION no-side-stack
- **RARITY_CURVE:** Standard. +VETERAN in Foe Escort.
- **SYNERGIES:** `escort_cutter`, `pair_pacer`, `brood_chanter`
- **WEAKNESSES:** Peel so the target is isolated; kill the escort first
- **PLAYER_COUNTERPLAY:** Fight one body at a time; Swap the escort off; sit at 2
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-foe-bite` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (adj-hostile scan + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dwell_marker`

- **NAME:** Dwell Marker
- **ROLE:** hazard creator (end-turn occupy detonate)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `ingress_marker` (enter), `stride_marker` (leave), `lean_prelate` (end-turn occupy **and leftover AP = 0**). Extra door is `dwell_pulpit` — family is **not** that id. At most one ungated end-turn-occupy CORE per pack as PAIR vs Ingress / Stride / Lean Post / Gait Wick / Exit / Fuse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they can walk off for 1 MP and still threaten. Peer: paint the cell they want to camp. Above: paint then Diag Stride / Root so they cannot leave.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 1.00, res 0.80, init 1.05, chc 0.80. Identity is **end-turn occupy**. If it tops the meter on paint turn, the kit leaked — Dwell deals **0 on cast**.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "detonate_if_end_turn_on_cell"`. VETERAN: skip if they can walk off for 1 MP. ELITE: pair with Diag Stride. CHAMPION: entering and leaving the same turn does **not** detonate; Swap onto the cell **does** if they stay; observation is the **paint**.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-dwell-mark`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a **different** tile, `spell-slow`
- **RARE_SPELL_POOL:** `spell-diag-stride` only if `diag_warder` is **absent**
- **ELITE_SPELL_POOL:** none — end-turn honesty is the elite. Do **not** unlock Ingress Mark as identity.
- **SIGNATURE_MECHANICS:** Paint one floor tile 2 turns. If a hostile **ends their turn** on that cell, deal 10 and consume. Walk-on / walk-off same turn is free.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-1-MP-leave → ELITE pair-diag → CHAMPION swap-stay-counts
- **RARITY_CURVE:** Standard. +ELITE in Void Dwell. Extra room `dwell_pulpit` is a teach.
- **SYNERGIES:** `void_reeler`, `diag_warder`, `snare_weaver`
- **WEAKNESSES:** Walk off before turn end; blink on and off; send a summon to camp it
- **PLAYER_COUNTERPLAY:** Leave the cell; Swap off; do not camp
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dwell-mark` (MULTI: family observe **or** `dwell_pulpit` first-win — first child wins). Detonate does not second-observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (end-of-turn occupy table; last writer on `"x,y"`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `own_plater`

- **NAME:** Own Plater
- **ROLE:** tank (next hit **on your turn** is 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 11. Distinct from `off_plater` (off-turn), `mid_hooder` (exact 2), `sidestep_warder` (next hit any turn). At most one own-turn negate CORE per pack as PAIR vs Off / Mid / Sidestep / Morrow / Tick.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if they will only be hit on the enemy turn (use Off Plate). Peer: Plate if Hold Ground / Far Watch / reflect is armed. Above: Plate then Watch Lend so the snap they eat also funds +1 AP.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.05, res 1.15, init 0.80, chc 0.70. Identity is **own-turn consume**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "negate_hit_on_own_turn"`. VETERAN: skip if they will only be hit on the enemy turn. ELITE: pair with Hold Ground. CHAMPION: consume before `dealDamage`; hits on other turns are full and do **not** consume.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-own-plate`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-watch-lend` only if `watch_lender` is **absent**
- **ELITE_SPELL_POOL:** none — own-turn honesty is the elite. Do **not** unlock Off Plate as identity.
- **SIGNATURE_MECHANICS:** Next hit the caster receives **during their own turn** (overwatch snap, reflect, hold-ground, thorn, a spell they forced onto themselves) deals 0 and consumes.
- **VARIANT_PROGRESSION:** BASE shield-or-plate → VETERAN skip-if-off-turn-only → ELITE pair-watch → CHAMPION consume-own-turn-only
- **RARITY_CURVE:** Standard. +ELITE in Own Watch.
- **SYNERGIES:** `watch_lender`, `stone_castellan`, `void_mirror`
- **WEAKNESSES:** Hit them on **your** turn; Dispel; wait out 2 turns
- **PLAYER_COUNTERPLAY:** Do not walk into Hold Ground; poke on your turn; Dispel
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-own-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (own-turn hit consume in incoming-hit pipeline)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cinder_skipper`

- **NAME:** Cinder Skipper
- **ROLE:** teleporter / kiter (1-tile walk ignores cinder)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. SDE Wave 11. Distinct from `spike_skipper` (spikes), `lava_skipper` (lava), `pit_skipper` (pit), Gap Ward (overwatch skip). At most one cinder-only skip CORE per pack as PAIR vs Spike / Lava / Pit / Ghost / Ember as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the next walk is not a 1-step across cinder. Peer: Skip then step the wake. Above: refuse a ≥2 walk; paint Ember Wake then skip.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.85, res 0.80, init 1.20, chc 0.85. Identity is **cinder-only, length 1**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "skip_cinder_one_tile"`. VETERAN: skip if the next walk is not a 1-step across cinder. ELITE: paint Ember Wake / Cinder Tile then skip. CHAMPION: lava / spikes / pits / mire / void still damage / block; teleport / Swap do not consume.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-cinder-skip`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-inferno` only if already committed to a cinder cell
- **RARE_SPELL_POOL:** `spell-ember-wake` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — cinder-class honesty is the elite
- **SIGNATURE_MECHANICS:** Next walk of length 1 ignores cinder / burn / ember-wake hazard ticks on the dest cell. Other hazards still apply.
- **VARIANT_PROGRESSION:** BASE strike-or-skip → VETERAN skip-if-not-1-cinder → ELITE paint-then-skip → CHAMPION other-hazards-still-tick
- **RARITY_CURVE:** Standard. +ELITE in Cinder Full. Weight 0 on maps with no cinder / ember-wake.
- **SYNERGIES:** `full_plater`, `ember_knight`, `glyph_sower`
- **WEAKNESSES:** Paint lava instead; force a 2-step; Root
- **PLAYER_COUNTERPLAY:** Do not stand on cinder-only; Root; force a 2-step
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cinder-skip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next 1-tile walk skips one hazard class)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `full_plater`

- **NAME:** Full Plater
- **ROLE:** tank (leftover AP ≥ 3 → +RES)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 11. Distinct from `tapped_plater` (leftover AP = 0), `still_plater` (leftover MP = 0), `empty_plater` (Wave 8 leftover-AP RES gate). At most one leftover-AP≥3 RES CORE per pack as PAIR vs Tapped / Still / Empty / Plate Warden.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if leftover AP ≤ 2 after the 2-AP pay. Peer: Plate if leftover AP ≥ 3 **and** Iron Skin is not already up. Above: refuse if they still need those 3 AP to Strike.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.05, res 1.10, init 0.75, chc 0.70. Identity is **the unspent purse**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "res_if_leftover_ap_ge_3"`. VETERAN: skip if leftover AP ≤ 2. ELITE: pair with Own Plate the same turn. CHAMPION: last RES% writer wins vs Iron Skin; fizzle still observes.
- **CORE_SPELL_POOL:** `starter-shield`, `spell-full-plate`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-own-plate` only if `own_plater` is **absent**
- **ELITE_SPELL_POOL:** none — leftover≥3 honesty is the elite
- **SIGNATURE_MECHANICS:** If leftover AP at resolve is ≥ 3, gain `buffStat: "res"` 1.15 for 2 turns. The 2 AP this spell costs is paid **before** the leftover check.
- **VARIANT_PROGRESSION:** BASE shield-or-plate → VETERAN skip-if-under-3 → ELITE pair-own-plate → CHAMPION last-writer
- **RARITY_CURVE:** Standard. +ELITE in Cinder Full.
- **SYNERGIES:** `cinder_skipper`, `own_plater`, `ember_knight`
- **WEAKNESSES:** Drain Courage / Quiet Hex so leftover drops below 3; Dispel
- **PLAYER_COUNTERPLAY:** Tax the purse; Dispel; do not poke into a camped 3
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-full-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover-AP read + existing RES% buff)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `summon_toller`

- **NAME:** Summon Toller
- **ROLE:** anti-summon / controller (allied pets pay AP to walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `walk_toller` (taxes the caster’s walk), `kennel_siller` (pets cannot leave), `brace_chanter` (pets ignore force). ELITE observe. At most one pet-walk-AP-tax CORE per pack as PAIR vs Walk Toll / Kennel / Brace / Brood.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no allied summon. Peer: Toll if a living allied summon wants to kite. Above: refuse if `summonAI` is empty (Wave 1 name-fallback still live).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.95, res 0.80, init 1.10, chc 0.75. Identity is **pets sit or pay**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "summon_walk_ap_tax"`. VETERAN: skip if no allied summon. ELITE: pair with Kennel Lock — COURT, never PAIR. CHAMPION: teleport / Swap / forced move do **not** pay; drop this id if `summonAI` is empty.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-summon-toll`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-escort-cut` only if `escort_cutter` is **absent**
- **ELITE_SPELL_POOL:** none — pet-tax honesty is the elite. Do **not** unlock Walk Toll as identity.
- **SIGNATURE_MECHANICS:** 2 turns. Every living **allied** summon (same side as caster) that **starts a walk** also pays +1 AP. Player copy taxes **their** pets.
- **VARIANT_PROGRESSION:** BASE frost-or-toll → VETERAN skip-if-no-pet → ELITE court-kennel → CHAMPION drop-if-empty-summonAI
- **RARITY_CURVE:** Standard. +ELITE in Toll Kennel.
- **SYNERGIES:** `kennel_siller`, `null_censor`, `escort_cutter`
- **WEAKNESSES:** Force-move the pets; Sever Tether; sit them still and Strike
- **PLAYER_COUNTERPLAY:** Park pets; Sever Tether; fight without a summon
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-summon-toll` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (allied-summon walk AP tax; not `spell.mpCost`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_mender`

- **NAME:** Still Mender
- **ROLE:** healer (heal if caster spent 0 walk MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. SDE Wave 11. CORE is Still Mend — `healAmount` forces healer profile until `aiProfile` is explicit. Distinct from `dry_gaiter` (both leftover MP = 0), `dry_mender` (both leftover AP = 0), `bar_mender` (target resolved a spell). At most one walk-0-heal CORE per pack as PAIR vs Dry Gait / Dry Mend / Bar / Heave / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if they already walked. Peer: Mend only if `walkMpSpentThisTurn === 0` **and** missing HP ≥ 8. Above: refuse if they already walked (Frost / Shield). Never walk **only** to fail this.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.15, chc 0.70. Identity is **the camped cantor**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_caster_spent_zero_walk_mp"`. VETERAN: skip if they already walked or missing HP < 8. ELITE: pair with Full Plate. CHAMPION: they may still have leftover MP from Dual Keep / Stride Keep; leftover MP does **not** substitute for walk-spent = 0.
- **CORE_SPELL_POOL:** `spell-still-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-full-plate` only if `full_plater` is **absent**
- **ELITE_SPELL_POOL:** none — walk-0 honesty is the elite. Do **not** unlock Dry Gait as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff caster `walkMpSpentThisTurn === 0`. Fails closed without walk-spend writers. Self-cast legal.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-walked → ELITE pair-full-plate → CHAMPION leftover-MP-does-not-count
- **RARITY_CURVE:** Standard. +ELITE in Still Rest.
- **SYNERGIES:** `cadence_rester`, `once_cantor`, `full_plater`
- **WEAKNESSES:** Pull the cantor so they want to walk; Cursed Wound; interrupt before resolve
- **PLAYER_COUNTERPLAY:** Shove the cantor; Cursed Wound; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-mend` (ELITE observe). Do not restamp `parched_cantor` / `heave_cantor` / `both_cantor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk-spend read + existing heal helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_rester`

- **NAME:** Cadence Rester
- **ROLE:** buffer (own remaining CDs do not tick this turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `cadence_imprinter` (copy matching), `cadence_pinner` (one hostile frozen), `cadence_staller` (+1 all), `cadence_thief` (steals). At most one own-remaining-skip-tick CORE per pack as PAIR vs Imprint / Pin / Stall / Theft.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if all remaining are 0–1. Peer: Rest if Inferno remaining ≥ 2 **and** they can live without that tool this turn. Above: refuse if they needed those tools this turn.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **parked remaining**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "own_remaining_cds_do_not_tick"`. VETERAN: skip if all remaining are 0–1. ELITE: Rest then Verse Lean the delayed recast. CHAMPION: does not rewrite remaining (not −1 / +1 / ×2); new locks written this turn still apply.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-rest`
- **ADVANCED_SPELL_POOL:** `spell-inferno` only if remaining ≥ 2 already exists, `spell-slow`
- **RARE_SPELL_POOL:** `spell-verse-lean` only if `verse_leaner` is **absent**
- **ELITE_SPELL_POOL:** none — skip-tick honesty is the elite. Do **not** unlock Cadence Imprint as identity.
- **SIGNATURE_MECHANICS:** This turn only. The caster’s **remaining** cooldown counters do **not** decrement at turn end.
- **VARIANT_PROGRESSION:** BASE frost-or-rest → VETERAN skip-if-nothing-to-protect → ELITE rest-then-lean → CHAMPION no-rewrite
- **RARITY_CURVE:** Standard. +ELITE in Still Rest.
- **SYNERGIES:** `still_mender`, `once_cantor`, `verse_leaner`
- **WEAKNESSES:** Cadence Trim / Pin the same locks; wait the extra turn
- **PLAYER_COUNTERPLAY:** Trim / Pin; fight through the extra turn; kill the Rester
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-rest` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (own remaining skip decrement; not a rewrite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spent_taxer`

- **NAME:** Spent Taxer
- **ROLE:** debuffer (next spell +1 AP if they walked last turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `still_taxer` (taxes if they **camped**), `gait_taxer` (taxes if they walked — same wallet, different writer), Quiet Hex (always +1). At most one walked-last-turn spell-tax CORE per pack as PAIR vs Still Tax / Gait Tax / Ley / Tax Scribe / Verse Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they camped last turn. Peer: Tax if `walkMpSpentLastTurn ≥ 1`. Above: refuse if they camped last turn (use Still Tax) or if they are already Quiet Hexed and the AI would triple-tax.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **pay for last turn’s walk**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tax_next_spell_if_walked_last_turn"`. VETERAN: skip if they camped last turn. ELITE: pair with Diag Stride (they had to walk). CHAMPION: Strike exempt; opposite of Quiet Hex; do not invent `spell.mpCost`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-spent-tax`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-diag-stride` only if `diag_warder` is **absent**
- **ELITE_SPELL_POOL:** none — walked-last-turn honesty is the elite. Do **not** unlock Still Tax as identity.
- **SIGNATURE_MECHANICS:** If the target walked last turn, their next **non-Strike** tool also costs +1 AP. If they camped last turn, fizzle (AP spent).
- **VARIANT_PROGRESSION:** BASE frost-or-tax → VETERAN skip-if-camped → ELITE pair-diag → CHAMPION strike-exempt
- **RARITY_CURVE:** Standard. +ELITE in Spent Crack.
- **SYNERGIES:** `brick_cracker`, `tax_scribe`, `diag_warder`
- **WEAKNESSES:** Camp a turn; Strike; pay the 1 AP
- **PLAYER_COUNTERPLAY:** Camp; live on Strike; pay; kill the Taxer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spent-tax` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`walkMpSpentLastTurn` snapshot + next-tool +1 AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_cracker`

- **NAME:** Brick Cracker
- **ROLE:** hazard creator (remove one adjacent barrier)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. SDE Wave 11. Distinct from `brick_sprouter` (grows), `brick_shifter` (slides), `brick_wiper` (erases paint). Extra door is `crack_nave` — family is **not** that id. At most one adjacent-barrier-remove CORE per pack as PAIR vs Sprout / Shift / Wipe / Castellan.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no adjacent barrier. Peer: Crack if a file opens **and** `findPath` still reaches exit / enemy. Above: refuse if the crack would seal the last path; File Lance through the hole.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.80, sr 1.00, res 1.00, init 0.85, chc 0.75. Identity is **one adjacent cell**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "remove_adjacent_barrier"`. VETERAN: skip if no adjacent barrier, or if the crack would seal the last path. ELITE: pair with File Lance / Mid Oath. CHAMPION: walls that are not barrier-paint are illegal (fizzle); do not edit `mapGen.ts`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-brick-crack`
- **ADVANCED_SPELL_POOL:** `spell-barrier`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-file-lance` only if `rank_lancer` is **absent**
- **ELITE_SPELL_POOL:** none — one-cell honesty is the elite. Do **not** unlock Brick Sprout as identity.
- **SIGNATURE_MECHANICS:** Remove **one** adjacent barrier cell. If removing the cell would seal the only player↔exit / player↔enemy path, AI skips; if forced, fizzle (AP spent, no tile write).
- **VARIANT_PROGRESSION:** BASE frost-or-crack → VETERAN solvability-skip → ELITE pair-lance → CHAMPION paint-only
- **RARITY_CURVE:** Standard. +ELITE in Spent Crack. Extra room `crack_nave` is a teach.
- **SYNERGIES:** `spent_taxer`, `tax_scribe`, `mid_oather`, `void_reeler`
- **WEAKNESSES:** Do not stand so a crack opens a file onto you; re-Barrier
- **PLAYER_COUNTERPLAY:** Re-Barrier; fight in the open; kill the Cracker
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-crack` (MULTI: family observe **or** `crack_nave` first-win — first child wins). Sealing fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (one adjacent barrier erase + solvability skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_lender`

- **NAME:** Watch Lender
- **ROLE:** sniper / buffer (overwatch snap grants watcher AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `watch_feer` (snap costs the **walker** 1 AP), `watch_muter` (snap deals 0). ELITE observe. At most one snap-grants-watcher-AP CORE per pack as PAIR vs Watch Fee / Watch Mute / Glass as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no overwatch is armed. Peer: Lend if Hold Ground / Far Watch is likely this turn. Above: refuse if no snap is armed; pair with Own Plate if the snap would also hit the caster.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.20, chc 0.85. Identity is **the second action after the snap**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `kiter`. `aiHint: "overwatch_snap_grants_watcher_ap"`. VETERAN: skip if no overwatch is armed. ELITE: pair with Far Watch / Hold Ground. CHAMPION: observation is the **arm**; the snap does not second-observe; snap damage / stop still uses its own writer.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-watch-lend`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-own-plate` only if `own_plater` is **absent**
- **ELITE_SPELL_POOL:** none — snap-AP honesty is the elite. Do **not** unlock Watch Fee as identity.
- **SIGNATURE_MECHANICS:** 2 turns or until consumed. The next time an overwatch the caster owns **snaps**, the caster gains +1 AP at snap resolve.
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-no-watch → ELITE pair-far-watch → CHAMPION observe-on-arm
- **RARITY_CURVE:** Standard. +ELITE in Own Watch.
- **SYNERGIES:** `own_plater`, `stone_castellan`, `glass_sniper`
- **WEAKNESSES:** Do not walk into the band; blink in; send a summon
- **PLAYER_COUNTERPLAY:** Do not walk the file; blink; kill the Lender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-lend` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap grants watcher +1 AP; consume)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_purser`

- **NAME:** Pair Purser
- **ROLE:** assassin (bonus if leftover AP is exactly 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn`. SDE Wave 11. Distinct from `lone_purser` (exactly 1), `dry_stinger` (leftover = 0), `full_purser` (≥ 3), `lean_stinger` (AP = 0 **and** MP ≥ 1). ELITE observe. At most one leftover-AP-exactly-2 poke CORE per pack as PAIR vs Lone / Dry / Full / Lean / Ready.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if leftover is not 2. Peer: Purse only if leftover AP is exactly 2. Above: refuse the 10-only if Strike is better; wait for Drain Courage to land them on 2.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.85, res 0.75, init 1.25, chc 1.05. Identity is **the exact-2 window**. If it tops the meter ungated, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_eq_2"`. VETERAN: skip if leftover is not 2. ELITE: wait for Drain Courage / Quiet Hex. CHAMPION: leftover 0, 1, or ≥ 3 is 10 only.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-pair-purse`
- **ADVANCED_SPELL_POOL:** `spell-venom-strike`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — exact-2 honesty is the elite
- **SIGNATURE_MECHANICS:** Deal 10. Extra 8 iff **target** leftover AP at resolve is **exactly 2**.
- **VARIANT_PROGRESSION:** BASE strike-or-purse → VETERAN skip-if-not-2 → ELITE wait-for-drain → CHAMPION refuse-10-only
- **RARITY_CURVE:** Standard. +ELITE in Pair Dry.
- **SYNERGIES:** `dry_mender`, `coil_arbiter`, `ledger_siphon`
- **WEAKNESSES:** Spend to 1 or 0; bank with Purse Keep; sit at 3
- **PLAYER_COUNTERPLAY:** Spend the pair; keep 1; bank; kill the Purser
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-purse` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (exact leftover-AP read + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `escort_cutter`

- **NAME:** Escort Cutter
- **ROLE:** anti-summon (bonus if the target has a pet nearby)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. SDE Wave 11. Distinct from `banner_cutter` (`isLeader`), `pet_cutter` (bonus on the **pet**), `crown_cutter` (`leader_slayer` grant). ELITE observe. At most one handler-plus-pet-in-2 CORE per pack as PAIR vs Banner / Pet / Crown / Null as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no pet in 2. Peer: Cut the **handler** if a living allied summon sits at Chebyshev ≤ 2. Above: refuse if the target **is** the summon (use Summon Bane); prefer the handler.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.90, res 0.80, init 1.20, chc 0.90. Identity is **the escort**, not extra damage. If it tops the meter ungated, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "bonus_if_target_has_allied_summon_in_2"`. VETERAN: skip if no pet in 2. ELITE: prefer the handler, not the pet. CHAMPION: reads `isSummon` on neighbors, never `spell.name` or `"wolf"`; Dummy Post is not a pet.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-escort-cut`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-summon-bane` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — handler-bonus honesty is the elite
- **SIGNATURE_MECHANICS:** Deal 10. Extra 8 if the target has a living **allied summon** (same side as the target) at Chebyshev ≤ 2. If the target **is** the summon, the bonus does **not** apply.
- **VARIANT_PROGRESSION:** BASE strike-or-cut → VETERAN skip-if-no-pet → ELITE prefer-handler → CHAMPION flag-not-name
- **RARITY_CURVE:** Standard. +ELITE in Foe Escort / Toll Kennel.
- **SYNERGIES:** `foe_biter`, `summon_toller`, `brood_chanter`
- **WEAKNESSES:** Park pets at 3+; Sever Tether; fight without a summon
- **PLAYER_COUNTERPLAY:** Park pets; Sever Tether; live without a summon
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-escort-cut` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`isSummon` neighbor scan + optional second `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dry_mender`

- **NAME:** Dry Mender
- **ROLE:** healer (heal iff caster **and** target leftover **AP = 0**)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. SDE Wave 11. Distinct from `dry_gaiter` (leftover **MP = 0**), `still_mender` (caster walk-MP spent = 0), `heave_mender` (both force-moved), `both_mender` (both walked). Extra door: **none** — do not invent `dry_cantor`. At most one leftover-AP=0-heal CORE per pack as PAIR vs Dry Gait / Still / Heave / Both / Pale.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either leftover AP ≥ 1. Peer: Dry Mend only if both leftover AP = 0 **and** missing HP ≥ 8. Above: refuse if either leftover AP ≥ 1. Never dump leftover AP **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two purses already empty**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_both_leftover_ap_eq_0"`. VETERAN: skip if either leftover AP ≥ 1 **or** missing HP < 8. ELITE: wait for Drain Courage / Quiet Hex. CHAMPION: walk / force-move flags do **not** substitute; `challengeHealUsedRef` flips only when HP increased.
- **CORE_SPELL_POOL:** `spell-dry-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-pair-purse` only if `pair_purser` is **absent**
- **ELITE_SPELL_POOL:** none — dual-dry-AP honesty is the elite. Do **not** unlock Dry Gait as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff both leftover AP = 0 after this spell’s 3 AP is paid. Self-cast requires the caster’s leftover AP is 0.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-wet-purse → ELITE wait-for-drain → CHAMPION no-dump-to-enable
- **RARITY_CURVE:** Standard. +ELITE in Pair Dry.
- **SYNERGIES:** `pair_purser`, `coil_arbiter`, `ledger_siphon`
- **WEAKNESSES:** Keep 1 leftover AP; Cursed Wound; kill the cantor first
- **PLAYER_COUNTERPLAY:** Keep 1 leftover AP; Cursed Wound; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dry-mend` (ENEMY_DISCOVERY observe+win). Do **not** invent `dry_cantor`. Do not restamp `parched_cantor`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (two leftover-AP reads + existing heal helper)
- **STATUS:** PROPOSED



---

## 5. Older-family amendments (no new ids)

| Older family | Amendment | Why |
| :--- | :--- | :--- |
| `pale_cantor` / `font_cantor` | May keep Still Mend / Dry Mend / Dry Gait as G≥12 extras | CORE owners are `still_mender` / `dry_mender` / `dry_gaiter`. Extra door `parched_cantor` stays the dropped #787 tombstone — do not restamp. |
| `cadence_thief` / `cadence_halver` / `cadence_pinner` | Do **not** steal Cadence Imprint / Rest as CORE | Copy matching and skip-own-tick are new sentences. Extra door stays `imprint_precentor`. |
| `sept_prelate` / `penta_prelate` / `quad_prelate` | Do **not** steal Six Span as CORE | 2×3 = 6. Extra door stays `span_six`. |
| `near_hooder` / `mid_hooder` / `far_hooder` | Do **not** steal Odd Hood as CORE | Odd parity, not a band. |
| `dry_stinger` / `ready_stinger` / `lone_purser` | Do **not** steal Lean Sting / Pair Purse as CORE | Dry-purse/wet-walk and exactly-2. |
| `home_stepper` / `heave_stepper` / `ally_stepper` | Do **not** steal Parched Step as CORE | Leftover-MP=0 join. |
| `drift_siller` / `quiet_siller` / `gait_sealer` | Do **not** steal Parched Sill as CORE | Tile forbids walk MP. |
| `drift_holder` / `boot_holder` | Do **not** steal Dry Hold as CORE | Peel is leftover AP = 0, not force / Strike. |
| `spent_lender` / `drift_lender` / `boot_lender` | Do **not** steal Lean Lend as CORE | Leftover-AP=0 MP gift. |
| `gait_sipper` / `drift_sipper` | Do **not** steal Parched Sip as CORE | Leftover-AP=0 MP steal. |
| `dummy_prelate` / `drift_prelate` / `dwell_marker` (new this pass) | Dummy / Drift do **not** steal Lean Post as CORE | End-turn leftover-AP=0 vs taunt vs relocate landing vs ungated end-turn. |
| `heave_bouncer` / `storm_caller` / `ricochet_vicar` | Do **not** steal Parched Bounce as CORE | Second body must be leftover-MP=0. |
| `hold_caster` / `tool_holder` / `must_drifter` | Do **not** steal Must Lean as CORE | Tools need leftover MP = 0; Strike stays legal. |
| `verse_pacer` / `last_muter` / `verse_taxer` | Do **not** steal Verse Lean as CORE | Leftover-MP peel, not walk / duration / +1 AP. |
| `hold_knight` / `rite_holder` / `tool_holder` | Do **not** steal Lean Hold as CORE | Strike needs leftover MP = 0. |
| `inch_warder` / `diag_locksmith` / `must_stepper` | Do **not** steal Diag Stride as CORE | Next walk diagonal-only. Extra room stays `diag_gallery`. |
| `long_oather` / `near_oather` / `mid_hooder` | Do **not** steal Mid Oath as CORE | Next **spell** exact 2. Extra room stays `mid_nave`. |
| `cinder_reeler` / `paint_reeler` / `foe_reeler` | Do **not** steal Void Reel as CORE | Sixth dest flavor. Extra room stays `void_aisle`. |
| `side_biter` / `lone_stinger` / `nook_biter` | Do **not** steal Foe Bite as CORE | Adj **hostile-to-target**, not adj ally / 0 hostiles / 1 block. |
| `ingress_marker` / `stride_marker` | Do **not** steal Dwell Mark as CORE | End-turn occupy, not enter / leave. Extra room stays `dwell_pulpit`. |
| `off_plater` / `mid_hooder` / `sidestep_warder` | Do **not** steal Own Plate as CORE | Own-turn damaging hit. |
| `spike_skipper` / `lava_skipper` / `pit_skipper` | Do **not** steal Cinder Skip as CORE | Hazard class is cinder. |
| `tapped_plater` / `still_plater` / `empty_plater` | Do **not** steal Full Plate as CORE | Wallet is leftover **AP ≥ 3**. |
| `walk_toller` / `kennel_siller` / `brace_chanter` | Do **not** steal Summon Toll as CORE | Pets pay AP to walk. |
| `heave_mender` / `bar_mender` / `dry_gaiter` (new this pass) | Do **not** steal Still Mend / Dry Mend as CORE | Walk-spent = 0 vs leftover AP = 0 vs leftover MP = 0. |
| `cadence_pinner` / `cadence_staller` / `cadence_imprinter` (new this pass) | May keep Cadence Rest as G≥11 extra | CORE owner is `cadence_rester`. Extra door stays `imprint_precentor`. |
| `still_taxer` / `gait_taxer` / `ley_tollkeeper` | Do **not** steal Spent Tax as CORE | Walked **last turn**, Strike exempt. |
| `brick_sprouter` / `brick_shifter` / `brick_wiper` | Do **not** steal Brick Crack as CORE | Remove one adjacent. Extra room stays `crack_nave`. |
| `watch_feer` / `watch_muter` | Do **not** steal Watch Lend as CORE | Snap still deals; watcher gains 1 AP. |
| `lone_purser` / `dry_stinger` / `full_purser` | Do **not** steal Pair Purse as CORE | Leftover AP exactly 2. |
| `banner_cutter` / `pet_cutter` / `crown_cutter` | Do **not** steal Escort Cut as CORE | Handler + pet in 2, never `"wolf"` / `isLeader`. |
| `long_precentor` | CHAMPION may keep `spell-pack-long` as SIGNATURE | Never a world-pack CORE. Never owned. |
| `adj_fold_regent` | Kit-only `spell-adj-fold` | Never a world pack. |
| `court_imprint_regent` | Kit-only `spell-court-imprint` | Never owned. Mass Cadence Imprint. |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| All prior waves | Six Span joins the stationary-post / multi-cell cap | One multi-cell system. Counts as six. Lean Post joins the 1-cell post cap. |

---

## 6. Identity matrix (Wave 13 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| dry_gaiter | healAmount gated on both leftover MP = 0, defense | isSummon, inferno-as-identity, leftover-AP heal as CORE, `spell-parched-mend` |
| cadence_imprinter | imprintMatchingCds, frost, debuff | heal, isSummon, steal-as-CORE, skip-own-tick as CORE |
| six_prelate | isSummon (sixspan), defense | turret/wolf/archer/bomber/dummy/triple/quad/penta/sept/driftpost/leanpost, heal, shard |
| odd_hooder | odd-Chebyshev consume shield, defense, physical | healAmount, isSummon, ≤1 / exact-2 / ≥3 hood as CORE, evasion buff |
| lean_stinger | leftover-AP=0 **and** leftover-MP≥1 bonus, damage (physical) | heal, isSummon, leftover-AP≥1 as CORE, leftover-AP-exactly-2 as CORE |
| parched_stepper | relocate caster to leftover-MP=0 ally adj, defense, physical | isSwap, healAmount, inferno, unforced-home-step as CORE |
| parched_siller | tile forbid walk MP, frost, isMark | heal, isSummon, relocate-dest-forbid as CORE, unit-root as CORE |
| dry_holder | forbidWalkUntilLeftoverApEq0, physical, frost | heal, isSummon, force-until-walk as CORE, Strike-until-walk as CORE |
| lean_lender | grant current MP if ally leftover AP = 0, buff, frost | healAmount, isSummon, walked-lend as identity |
| parched_sipper | steal leftover MP if leftover AP = 0, frost, debuff | heal, isSummon, gait-sip-as-identity, spell.mpCost |
| lean_prelate | isSummon (leanpost), defense | turret/wolf/dummy/bait/driftpost/sixspan, heal, relocate-landing as CORE |
| parched_bouncer | damage gated bounce-to-leftover-MP=0, frost | heal, isSummon, nearest-any bounce as CORE, force-bounce as CORE |
| must_leaner | mustNonStrikeUntilLeftoverMpEq0, damage (physical), debuff | heal, isSummon, all-spells-until-walk as CORE |
| verse_leaner | lastResolvedId illegal until leftover MP = 0, frost, debuff | heal, isSummon, last-id-until-walk as CORE, last-id-duration as CORE |
| lean_holder | forbidStrikeUntilLeftoverMpEq0, physical, frost | heal, isSummon, Strike-until-walk as CORE, Strike-until-spell as CORE |
| diag_warder | nextWalkDiagonalOnly, frost, debuff | heal, isSummon, forbid-diagonal as CORE, one-walk-≤1 as CORE |
| mid_oather | nextSpellExactChebyshev 2, frost, isMark | heal, isSummon, min-3 / max-1 oath as CORE, hit-from-2-hood as CORE |
| void_reeler | attractTowardNearestVoidOrPortal, frost, isMark | heal, isSummon, cinder-reel / paint-reel / foe-reel as CORE |
| foe_biter | adjacentHostileBonusDamage, frost, physical | heal, isSummon, adj-ally / 0-hostile / 1-block as CORE, name `"wolf"` |
| dwell_marker | detonateOnEndTurnOccupy, frost, physical | heal, isSummon, enter-detonate as CORE, leftover-AP=0 post as CORE |
| own_plater | ownTurnHitZeroCharges, defense, physical | heal, isSummon, off-turn hood as CORE, evasion buff |
| cinder_skipper | nextWalkIgnoresCinder, physical | heal, isSummon, lava-skip / spike-skip as CORE, ghost-step as CORE |
| full_plater | leftoverApGe3Res, defense, physical | heal, isSummon, leftover-AP-0 +RES as CORE, leftover-MP-0 +RES as CORE |
| summon_toller | alliedSummonWalkApTax, frost, defense | healAmount as CORE, cannot-leave as CORE, caster-walk-toll as CORE |
| still_mender | healAmount gated on caster walkMpSpentThisTurn = 0, defense | isSummon, inferno, leftover-MP heal as CORE, leftover-AP heal as CORE |
| cadence_rester | ownRemainingCdsDoNotTick, frost, buff | heal, isSummon, copy-matching as CORE, +1-all as CORE |
| spent_taxer | taxNextSpellIfWalkedLastTurn, frost, debuff | heal, isSummon, camped-tax as CORE, spell.mpCost |
| brick_cracker | removeAdjacentBarrier, frost | heal, isSummon, grow / slide / erase-as-CORE |
| watch_lender | overwatchSnapGrantsWatcherAp, physical, frost | heal, isSummon, walker-pays-AP as CORE, snap-deals-0 as CORE |
| pair_purser | leftoverApExactly2 bonus, physical | heal, isSummon, leftover-0 / leftover-1 poke as CORE |
| escort_cutter | targetHasAlliedSummonIn2 bonus, physical | heal, isSummon-as-caster-identity, isLeader as CORE, name `"wolf"` |
| dry_mender | healAmount gated on both leftover AP = 0, defense | isSummon, inferno-as-identity, leftover-MP heal as CORE |

Wave 1–12 matrices in those dated docs still apply to those ids.

---

## 7. Role coverage after Wave 13

| Archetype | Wave 1 owner | Wave 13 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | foe_biter |
| sniper | glass_sniper | watch_lender |
| kiter | tide_shade | parched_stepper, cinder_skipper |
| assassin | shadow_lurker | lean_stinger, pair_purser |
| healer | pale_cantor | dry_gaiter (both leftover MP = 0), still_mender (caster walk-MP = 0), dry_mender (both leftover AP = 0) |
| buffer | hex_chorister | lean_lender, cadence_rester, watch_lender |
| debuffer | bone_scribe | cadence_imprinter, parched_sipper, verse_leaner, spent_taxer |
| summoner | brood_chanter | six_prelate (6-cell post), lean_prelate (1-cell leftover-AP=0 bomb) |
| controller | coil_arbiter | dry_holder, must_leaner, lean_holder, parched_siller, diag_warder, mid_oather |
| tank | iron_golem | odd_hooder, own_plater, full_plater |
| protector | leash_warden | parched_stepper |
| artillery | storm_caller | parched_bouncer |
| kamikaze | cinder_martyr | lean_prelate (post death on leftover-AP=0 occupy) |
| teleporter | wraith_bishop, blink_cutter | parched_stepper, cinder_skipper |
| displacement | rift_hook | void_reeler |
| hazard creator | ember_knight, glyph_sower | parched_siller, dwell_marker, brick_cracker, lean_prelate |
| status specialist | plague_rat | verse_leaner, must_leaner |
| anti-summon | null_censor | escort_cutter, summon_toller |
| anti-ranged | void_mirror, rust_reaver | mid_oather, diag_warder |
| anti-melee | leash_warden | odd_hooder, own_plater, lean_holder |

Every requested archetype still has a Wave 1 owner. Wave 13 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6 through Wave 12 §8, plus Wave 13 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis.
6. Battle-walk writers: `walkMpSpentThisTurn`, leftover AP / leftover MP, vacated cell, `currentView` (facing families still wait), `forcedMovedThisTurn`, `lastForcedMoveDir`, `lastResolvedSpellId`, `struckThisTurn`, `walkMpSpentLastTurn`.
7. `inferSummonArchetype` gains `sixspan` and `leanpost` (and still needs `dummypost` / `triplespan` / `quadspan` / `pentaspan` / `septspan` / `driftpost` from Waves 8–12).
8. Raise or gate `ENEMY_SUMMON_CAP` before Six Span (and Sept / Penta / Quad / Triple) can spawn. Live cap 2 makes Six illegal.
9. Wave 1 kits first (live ids), then later verbs one at a time. Wave 13 slice: leftover-MP=0 heal (Dry Gait, **not** Parched Mend) → copy matching remaining CDs → six-cell 2×3 footprint → odd-hood consume → lean sting → parched-step relocate → parched sill → dry-hold → lean-lend → parched-sip → lean-post → parched-bounce → must-lean leftover-MP tool-lock → verse-lean leftover-MP last-id peel → lean-hold leftover-MP Strike-lock → diag-stride → mid-oath → void-reel attract → foe-bite → dwell-mark end-turn occupy → own-plate → cinder-skip → full-plate → summon-toll → still-mend → cadence-rest → spent-tax → brick-crack → watch-lend → pair-purse → escort-cut → dry-mend.
10. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 12, SDE Wave 11, and SDE Wave 12 Dry Gait — never names. Do **not** ship `spell-parched-mend`.
11. Register text updates only when hooks land.
12. Discovery: family observe must not double-grant MULTI / feat doors (`cadence-imprint`, `six-span`, `diag-stride`, `mid-oath`, `void-reel`, `dwell-mark`, `brick-crack`). Dry Gait / Dry Mend have **no** extra door.
13. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not splice the turn queue for Lean Post / Dwell Mark / Cadence Imprint.

---

## 9. Held for a later wave (no ids reserved here)

These need SPELL_PROPOSALS / SDE to stamp ids first, **or** they stay closed. This run does **not** mint colliding `wave13:` spell ids.

- Remaining SDE Wave 12 unique CORE (`spell-orth-stride`, `spell-tri-oath`, `spell-brick-reel`, `spell-lone-bite`, `spell-wake-mark`, `spell-gait-plate`, `spell-glyph-skip`, `spell-full-gait`, `spell-summon-gait`, `spell-still-gift`, `spell-cadence-grace`, `spell-cast-debt`, `spell-brick-orbit`, `spell-watch-alms`, `spell-pair-gait`, `spell-leash-cut`, `spell-pack-cap`, `spell-reach-fold`) — Wave 14 families if they still have no CORE owner. **`spell-dry-gait` is consumed this pass.**
- Mid-RAF splice of the current actor (AGENTS.md)
- Fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders)
- Sixth echo id
- Player-owned Hex of Silence
- Eight-cell occupy
- Heal-if-**both leftover AP and leftover MP = 0**
- Swap remaining CDs caster ↔ target
- 180° pair hinge (`spell-about-hinge`, never owned)
- Refresh (extend) all remaining CDs **including zeros**
- Pack Tithe / Court Stretch / Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual / About Hinge / Pack Long / Adj Fold / Court Imprint / Pack Cap / Reach Fold as world-pack CORE
- Facing writer families (still blocked on combat `currentView`)
- Cone `areaShape` **reader** family (Gale / Fan still own the unread hole)
- `spell-parched-mend` (dropped; Dry Gait owns leftover-MP=0 heal)

---

## 10. What this run did not do

- No production TypeScript / Motoko / Candid.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, 13 Wave 6, 14 Wave 7, 17 Wave 8, 32 Wave 9, 32 Wave 10, 32 Wave 11, or 32 Wave 12 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `spell-court-imprint` / `spell-pack-long` / `spell-adj-fold` / `spell-pack-cap` / `spell-reach-fold` / `spell-court-dual` / `spell-pack-close` / `spell-mid-fold` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-court-stretch` / `spell-pack-tithe` / `spell-about-hinge` world-pack CORE.
- No remaining SDE Wave 12 unique CORE as this pass’s CORE except Dry Gait.
- No `spell-parched-mend` (SDE Wave 12 Dry Gait won leftover-MP=0 heal).
- No `wave13:` colliding spell ids.
- No restamp of claimed feat / challenge / extra-door keys (including `parched_cantor`).

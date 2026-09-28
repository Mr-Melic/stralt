# Enemy and Elite Evolution Design — Wave 11

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-28  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Eleventh daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 10 verbs** (`SPELL_PROPOSALS_2026-09-27.md`, open PR #695): heal-if-**both** walked, leftover-**MP** bank, five-cell plus occupy, hostile remaining-CD **−1**, next hit from Chebyshev **≤ 1** → 0, steal 1 MP iff they walked, occupant cannot resolve **non-physical**, first **forced-move landing** deals 8, remaining walks Chebyshev **exactly 1**, ally lands adjacent to **caster**, leftover-MP **≥ 2** poke, caster+ally translate 1, last-id recast **+1 AP**, cannot resolve non-physical until **Strike**, +1 MP to an ally who **already walked**. Plus **SDE Wave 9 unique CORE** verbs Wave 10 held (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md`, open PR #646) because they still have no CORE owner. Bosses stay on the existing catalog. Court Keep / Pack Stride / Knight Fold stay **kit-only / ENEMY_ONLY / BOSS_ONLY** — not world-pack CORE.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 10

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Wave 10 closed as docs in the 2026-09-27 pass (PR #686). SPELL_PROPOSALS Wave 10 (PR #695) stamped three holes Wave 10 **held** (heal-if-**both** walked; leftover-**MP** bank; five-cell occupy) plus twelve siblings. SDE Wave 10 (PR #679) then stamped a **new** unique catalog (`spell-inch-stride` … `spell-mid-fold`). Same-day SPELL_PROPOSALS Wave 11 (PR #726) already opened as a sibling cron (`spell-heave-mend` … `spell-court-dual`). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥10 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 10 claim | 2026-09-28 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–10 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy Post counts as **1**. Triple Span counts as **3**. Quad Span counts as **4**. Penta Span counts as **5** — skip until remaining cap ≥ 5 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Both Mend / Clash Mend **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / `twinspan` / `spark` / `triplespan` / `dummypost` / `quadspan` / **`pentaspan`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6–10 facing families still fail closed until a battle-walk writer exists. Wave 11 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 11 CORE rows stay `mpCost: 0`. Gait Sip / Stride Keep / Spent Lend rewrite **current MP**, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Ally Step is occupancy dests, **not** `isSwap`. Paint Reel is the **fourth** dest flavor of `applyAttract` (File Reel, Ally Reel, Foe Reel, then paint) |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` | Absent | Wave 10 `shove_mender` and Wave 11 `shove_stinger` fail closed until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / conveyor writer sets it. Walk MP must **not** set it |
| `lastResolvedSpellId` | Absent | Wave 10 `last_muter` and Wave 11 `verse_taxer` fail closed until successful AP-spend writes the id |
| `struckThisTurn` | Absent | Wave 11 `clash_mender` fails closed until a successful Strike / `isPhysical` resolve writes it on the **striker**. Walk / force-move / DoT must **not** set it |
| Both-walk heal / leftover-MP bank / 5-cell occupy / CD −1 / near hood / gait sip / cast sill / shove sting / must-step / ally step / damp sting / pair pace / verse tax / tool hold / spent lend | Still absent in live catalog | Wave 11 primary opportunity (SPELL_PROPOSALS Wave 10) |
| One next walk Manhattan 2 / cannot-walk-until-Strike / next-spell range ≤ 1 / pull toward paint / exactly-one-block bite / cell-leave detonate / incoming 50/50 with adj **enemy** / 1-tile lava walk / leftover-MP-0 +RES / primary cannot leave / heal-if-Struck / ally CD −1 / next-spell +1 AP if walked / erase barrier / next overwatch 0 / leftover-AP ≥ 3 poke / bonus vs player-side summon | Still absent as CORE identities | Wave 11 secondary opportunity (SDE Wave 9 unique CORE) |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Boot Hold is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Ignite is Wave 3 |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Paint Reel is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Gait Sip is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Full Purse is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Foe Plate is not CORE here |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 11 families exist so those verbs are **sentences**, not extra HP.

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

Same-day SPELL_PROPOSALS Wave 11 may open as a sibling cron (#726 already has). This Wave 11 family pass still consumes **#695** verbs plus leftover **#646** unique CORE. **Wave 12** consumes any 2026-09-28 tactical catalog and any SDE Wave 10 unique CORE that still has no CORE owner. This run does not mint colliding `wave11:` spell ids.

SDE Wave 10 unique CORE (`spell-inch-stride`, `spell-rite-first`, `spell-long-oath`, `spell-cinder-reel`, `spell-side-bite`, `spell-ingress-mark`, `spell-off-plate`, `spell-spike-skip`, `spell-tapped-plate`, `spell-summon-brace`, `spell-bar-mend`, `spell-cadence-pin`, `spell-still-tax`, `spell-brick-sprout`, `spell-watch-fee`, `spell-lone-purse`, `spell-banner-cut`, `spell-pack-close`, `spell-mid-fold`) stay **G≥10 extras** on older families this pass. Dedicated families for those verbs wait for Wave 12 if they still have no CORE owner. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` / `spell-court-stretch` / `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` stay never-owned unless a later boss sheet claims them.

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

**Stationary-post / multi-body cap (extend Wave 10):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span **or** Penta Span in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post counts as **one**. Quad Span counts as **four**. Penta Span counts as **five**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, Quad Span, or Penta Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-/five-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, a Quad Span 2×2, **or** a Penta Span plus, never two of those. Dummy Post is a **1-cell** post; it fills the stationary-post cap but is **not** a multi-cell system.

**Summon-cap prerequisite (extend Wave 10):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Penta Span is illegal until remaining cap ≥ 5. Dummy Post is legal at remaining ≥ 1. Do not spawn `penta_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend prerequisite (extend Wave 10):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate / Both Mend / Gait Sip / Spent Lend / Damp Sting / Stride Keep / Gait Tax / Stride Mark **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and, for Ghost Step, the vacated cell) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Pair Pace / Ally Step / Knight Slip are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Force-move prerequisite (extend Wave 10):** Shove Mend / Shove Sting fail closed until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / conveyor resolver writes `forcedMovedThisTurn` on the moved body. Walk MP and summon-control walks must **not** set it.

**Last-id prerequisite (extend Wave 10):** Last Mute / Verse Tax fail closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Struck prerequisite (new this pass):** Clash Mend fails closed until a successful Strike / `physical_attack` / `isPhysical: true` resolve writes `struckThisTurn` on the **striker**. Walk / force-move / DoT / lava / spikes must **not** set it.

**Leftover-MP bank prerequisite (new this pass):** Stride Keep (and kit-only Court Keep) fail closed until end-of-turn leftover MP can snapshot and pay at **that unit’s next turn start**. Do **not** splice the current actor. Do not share Purse Keep’s leftover-**AP** table.

**Facing prerequisite (unchanged):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. Shove Face writes facing from this push only. This pass adds **zero** facing cards.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Both Mend MULTI child `both_cantor` — first child wins vs `both_mender` observe. Stride Keep MULTI child `stride_bursar` — first child wins vs `stride_keeper` observe. Penta Span MULTI child `span_penta` — first child wins vs `penta_prelate` observe. Cadence Trim MULTI child `trim_precentor` — first child wins vs `cadence_trimmer` observe. Court Keep stays `court_keep_regent` kit-only. Pair Stride MULTI child `pair_gallery` — first child wins vs `pair_strider` observe. Pack Stride stays `stride_precentor` CHAMPION kit. Knight Fold stays `knight_fold_regent` kit-only. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `pair_gallery`, `stride_precentor`, `knight_fold_regent`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `inch_gallery`, `rite_nave`, `close_precentor`, `mid_fold_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1` / `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` / `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`.

---

## 2. Why Wave 11 exists (gaps Waves 1–10 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + three leftover SDE Wave 6 unique CORE verbs. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE. Wave 10 covered SPELL_PROPOSALS Wave 9 + leftover SDE Wave 8 unique CORE.

SPELL_PROPOSALS Wave 10 (#695) then stamped the holes Wave 10 **held**. A G≥10 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 9 unique CORE still had no CORE owner after Wave 10 (Wave 10 held them as G≥9 stamps). Seventeen of those verbs fill holes Wave 10 tactical does not: one next walk Manhattan 2, cannot-walk-until-Strike, next-spell range ≤ 1, pull toward **paint**, exactly-one-block bite, cell-leave detonate, incoming 50/50 with adj **enemy**, 1-tile lava walk, leftover-MP-0 +RES, primary cannot leave, heal-if-**Struck**, ally remaining-CD **−1**, next-spell +1 AP if walked, erase adjacent **barrier**, next overwatch snap 0, leftover-AP **≥ 3** poke, bonus vs player-side summon. Pack Stride and Knight Fold stay closed.

| Unused Wave 10 / SDE Wave 9 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-both-mend` (heal 8 iff **caster and target** both walked) | `gait_mender` (caster only); `chase_mender` (target only); `shove_mender` (force-moved); `clash_mender` (this pass, Struck) | Heal paid in **two bodies that already stepped**. One still body is 0 HP. Extra door is `both_cantor` — family is **`both_mender`**. |
| `spell-stride-keep` (bank leftover **walk MP**, cap 2, next turn start, once/battle) | `purse_keeper` (leftover **AP**); `spare_pacer` (+1 **now**); Pack Stride (pack **siphon**, never owned) | Leave tiles unspent so next turn kites. Extra door is `stride_bursar` — family is **`stride_keeper`**. Not a queue splice. |
| `spell-penta-span` (plus occupy, counts as **five**) | `quad_prelate` (2×2 = 4); `triple_span` (3); `twin_span` (2 walking); `dummy_prelate` (1 HP, 1 cell) | Five tiles, one body, empty kit. Extra door is `span_penta` — family is **`penta_prelate`**. Skip until remaining cap ≥ 5. |
| `spell-cadence-trim` (hostile remaining CDs **−1**; 0 stays 0) | `cadence_shaver` (this pass, **ally** −1 all); `cadence_stretcher` (**×2** hostile); `cadence_staller` (**+1** all); `cadence_cracker` (highest one → 0) | Force a recast window. Extra door is `trim_precentor` — family is **`cadence_trimmer`**. |
| `spell-near-hood` (next applied hit from Chebyshev **≤ 1** → 0) | `far_hooder` (**≥ 3**); `sidestep_warder` (next hit **any** range); Fog Hood (cuts **LoS range**) | Walk out to 2, or waste the melee. Does not eat DoT. |
| `spell-gait-sip` (steal 1 current MP iff they **walked**) | `soul_siphon` (no walk gate); `walk_toller` (**+1 walk cost**); `gait_taxer` (this pass, next **spell** +1 AP if walked) | Tax the step they already took. Stand is 0. |
| `spell-cast-sill` (occupant cannot resolve **non-physical**) | `quiet_siller` (occupant cannot **Strike**); `hold_caster` (unit cannot **spell** until walk); `tool_holder` (this pass, unit cannot tool until Strike) | The **tile** is Strike-only. Step off. |
| `spell-shove-sting` (first **forced-move landing** deals 8) | `exit_stinger` (first **leave**); `enter_mender` (enter **heal**); Ingress Mark (W10 SDE, **walk** enter — not this pass) | Set a relocate dest, then shove. Walk is free. |
| `spell-must-step` (remaining walks this turn must be Chebyshev **exactly 1**) | `must_spanner` (Manhattan **2**); `pair_strider` (this pass, **one** next walk Manhattan 2); Inch Stride (W10 SDE, **one** next ≤ 1 — not this pass) | Make the 2-step peel illegal. |
| `spell-ally-step` (ally lands on a free Chebyshev-1 of the **caster**) | `home_stepper` (**caster** → ally); `hook_chaplain` (pulls the ally along a line); `ally_reeler` (pull 1 toward ally) | Bring them **to you**. Relocate, not `isSwap`. |
| `spell-damp-sting` (+10 iff leftover **walk MP ≥ 2**) | `dry_stinger` (leftover **AP = 0**); `full_purser` (this pass, leftover **AP ≥ 3**); `still_plater` (this pass, leftover **MP = 0 → +RES**) | Poke the kiter who **banked** walk. |
| `spell-pair-pace` (caster **and** adj ally both translate 1) | `pair_slider` (two **hostiles**); `pair_porter` (**90°** around midpoint); `home_stepper` / `ally_stepper` (one body) | March as a pair onto paint. Not `isSwap`. |
| `spell-verse-tax` (recasting their **last resolved id** costs +1 AP) | `last_muter` (that id is **illegal**); `gait_taxer` (this pass, next **any** spell +1 if walked); Hex Toll (next **any** +1) | Tax the Inferno they just showed. Needs `lastResolvedSpellId`. |
| `spell-tool-hold` (cannot resolve **non-physical** until they Strike) | `first_verser` (cannot Strike until a **spell**); `hold_caster` (cannot **spell** until walk); `boot_holder` (this pass, cannot **walk** until Strike); `cast_siller` (**tile** forbids non-physical) | Spend 2 AP on Strike to unlock tools. |
| `spell-spent-lend` (+1 current MP to an ally who **has** walked) | `boot_lender` (**unmoved**); `spare_pacer` (+1 **now**, no gate); `gift_siller` (enter +MP) | Fund the **second** step after they committed one. |
| `spell-pair-stride` (**one** next walk Manhattan exactly 2) | `must_spanner` (**all** remaining this turn); `even_warder` / `odd_warder` (parity); `must_stepper` (this pass, Chebyshev **1**) | Extra door is `pair_gallery` — family is **`pair_strider`**. Last writer vs Must Span. |
| `spell-boot-hold` (cannot **walk** until they Strike) | `hold_knight` (cannot **Strike** until walk); `gait_sealer` (cannot walk; spells legal); `tool_holder` (cannot **tool** until Strike) | Encounter room `hold_nave` is a teach — family is **`boot_holder`**. |
| `spell-near-oath` (next spell must have range **≤ 1**) | `unit_oather` (unit **class**); `ground_oather` (ground only); `dim_optic` (**cuts** range) | Frost at 4 fizzles. Strike stays legal. |
| `spell-paint-reel` (pull 1 toward nearest **paint**) | `foe_reeler` (toward a **body**); `ally_reeler` (toward **ally**); `file_reeler` (along file toward **caster**) | Fourth `applyAttract` dest flavor. Wipe paint is the counter. |
| `spell-nook-bite` (10 + 8 if **exactly one** adj block) | `field_biter` (**0** blocks); `wall_biter` / `wall_stinger` (**any** hug); `lone_stinger` (0 adj **bodies**) | Fight in the alcove. Open or two-wall corner is 10 only. |
| `spell-stride-mark` (cell paint; detonate on **walk-leave that cell**) | `gait_wicker` (**unit** mark, any walk MP); `exit_stinger` (first leave of a **different** paint); `wound_marker` (they **take a hit**) | Stand, blink off (clears, 0), or eat 12. Extra room `stride_pulpit` is a teach — family is **`stride_marker`**. |
| `spell-foe-plate` (next incoming hit 50/50 with adj **enemy**) | `split_plater` (share with an **ally**); `twin_tether` (ongoing while Chebyshev ≤ 3); `pain_suture` (redirect whole hit) | Isolate the tank. Missing-neighbor fail closed. |
| `spell-lava-skip` (next **1-tile** walk treats lava as floor) | `pit_skipper` (**pit**); Safe Fall (forced-move skips **hazard ticks**); `ember_knight` (**paints** lava) | Does not ignore pit / void / barriers. Maps stay solvable for the **player**. |
| `spell-still-plate` (0 leftover **walk MP** → +RES) | `empty_plater` (0 leftover **AP**); `dry_stinger` (0 leftover AP **damage**); Planted Stance (0-walk **stance**) | Spend the last tile, then plate. |
| `spell-body-sill` (**primary** cannot leave the cell) | `kennel_siller` (**summons** cannot leave); `snare_weaver` (Root / MP lock); `quiet_siller` (occupant cannot **Strike**) | Player body is nailed. Pets walk freely. Blink / Swap end it. |
| `spell-clash-mend` (heal 8 iff **target Struck**) | `shove_mender` (force-moved); `chase_mender` (walked); `both_mender` (this pass, **both** walked); `pale_cantor` (unconditional) | Healer CORE only. Needs `struckThisTurn`. |
| `spell-cadence-shave` (−1 **all** remaining CDs on an **ally**) | `cadence_trimmer` (this pass, **hostile** −1); `cadence_flusher` (ally all → **0**); `cadence_lender` (−1 **one** ally id) | Recycle Inferno. Extra room `shave_nave` is a teach — family is **`cadence_shaver`**. |
| `spell-gait-tax` (next spell +1 AP if they **walked**) | `gait_sipper` (this pass, steal **MP**); `walk_toller` (+1 **walk MP**); `verse_taxer` (this pass, last **id** +1, no walk gate) | Cast before walking, or Strike. |
| `spell-brick-wipe` (erase adjacent **barrier**) | `brick_shifter` (**slides**); `echo_wiper` (erases **paint**); Dispel Thread (unit buffs) | Open a file. Does not edit `mapGen.ts`. |
| `spell-watch-mute` (next **overwatch snap** deals 0) | `far_hooder` (hit from ≥ 3 → 0); `last_muter` (last **id** illegal); Gap Ward (skip overwatch on a **1-tile** walk) | The snap still consumes. Walk another file. |
| `spell-full-purse` (10 + 8 if leftover AP **≥ 3**) | `dry_stinger` (leftover **= 0**); `purse_keeper` (**banks** leftover); `empty_plater` (0 leftover → +RES) | Punish hoarding. Spend down to 2. |
| `spell-pet-cut` (10 + 10 if **player-side** `isSummon`) | `null_censor` (anti-summon kit); Summon Bane (any `isSummon`); `crown_cutter` (`isLeader`) | Reads `isSummon` + `side`, never `"wolf"` in the name. Dummy Post is a legal summon. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-keep` (`NOT_PLAYER_LEARNABLE`; `court_keep_regent` kit — same law as Court Stretch on `cadence_stretcher` CHAMPION witness), `spell-pack-stride` (ENEMY_ONLY; stays `stride_precentor` CHAMPION SIGNATURE), `spell-knight-fold` (BOSS_ONLY; `knight_fold_regent` kit — never a world pack). Court Stretch / Pack Tithe / About Hinge / Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold / Pack Close / Mid Fold / Court Dual stay where Waves 5–11 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 11 CORE rows are `mpCost: 0`. Gait Sip / Stride Keep / Spent Lend rewrite **current MP**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Stride Keep’s delay is **their next turn start**.  
Do **not** family a seven-cell occupy. Sept Span (`spell-sept-span`, #726) waits for Wave 12. Penta Span is the five-cell card.  
Do **not** family heal-if-**both force-moved** as a second id — that hole stays Wave 12 (`spell-heave-mend` on #726).  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs **including zeros** (that would invent locks). Trim is −1 on remaining ≥ 1. Stall is +1 on remaining ≥ 1. Stretch is ×2 on remaining ≥ 1.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 10 unique CORE as this pass’s CORE (`spell-inch-stride` …).  
Do **not** mint `wave11:` colliding spell ids.  
Do **not** name the Both Mend family `both_cantor`, the Stride Keep family `stride_bursar`, the Penta Span family `span_penta`, the Cadence Trim family `trim_precentor`, the Pair Stride family `pair_gallery`, the Boot Hold family `hold_nave`, the Nook Bite family `nook_court`, the Stride Mark family `stride_pulpit`, or the Cadence Shave family `shave_nave`.

---

## 3. Encounter synergy packs (Waves 1–11)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** bait **or** pylon **or** font **or** span **or** Quad Span **or** Penta Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Both Choir | `both_mender` + `spent_lender` + `spare_pacer` | Fund two walks, then cash the dual-walk 8 |
| Stride Bank | `stride_keeper` + `damp_stinger` + `gait_sipper` | Bank leftover MP, poke ≥ 2 leftover, steal the step |
| Penta Plug | `penta_prelate` + `cast_siller` + `shove_stinger` | Plus seal, Strike-only ring, tax the shove-around. Skip until remaining cap ≥ 5 |
| Trim Tax | `cadence_trimmer` + `verse_taxer` + `ignite_alchemist` | −1 Inferno so they recast into +1 AP, then cash stacks |
| Near Step | `near_hooder` + `must_stepper` + `glass_sniper` | Force a 1-step into melee miss, then snipe from 3 |
| Cast Quiet Court | `cast_siller` + `quiet_siller` + `tool_holder` | Tile forbids tools, tile forbids Strike, unit forbids tools until Strike — COURT, never PAIR Cast+Quiet or Cast+Tool |
| Shove Pace | `shove_stinger` + `pair_pacer` + `bash_bruiser` | Paint the landing, march the pair onto it, bash the rest |
| Ally Quiet | `ally_stepper` + `cast_siller` + `split_cantor` | Pull the gun onto the sill, split-mend the clump |
| Pair File | `pair_pacer` + `rank_lancer` + `glyph_sower` | Translate onto the file, then lance / tax |
| Boot Oath | `boot_holder` + `near_oather` + `leash_warden` | Nail feet until Strike, then forbid long confirms |
| Paint Nook | `paint_reeler` + `nook_biter` + `fuse_binder` | Pull onto the wick alcove, cash exactly-one-block |
| Stride Pulpit | `stride_marker` + `pair_strider` + `gait_sealer` | Paint the cell, force a legal 2-step off it, or nail feet |
| Foe Goad | `foe_plater` + `goad_herald` + `iron_golem` | Taunt into the neighbor so the split is honest |
| Lava Still | `lava_skipper` + `still_plater` + `ember_knight` | Skip the cinder, then leftover-MP-0 +RES |
| Body Clash | `body_siller` + `clash_mender` + `crimson_spawn` | Nail the primary, cash the Struck heal on the bruiser |
| Shave Once | `cadence_shaver` + `once_cantor` + `tempo_precentor` | −1 ally Inferno, lock recast. Do **not** PAIR Shave with Trim |
| Gait Pulpit | `gait_taxer` + `last_muter` + `once_cantor` | Tax the walked spell, then ban the last id |
| Brick Watch | `brick_wiper` + `watch_muter` + `stone_castellan` | Open the file, mute the snap they walk into |
| Full Kennel | `full_purser` + `pet_cutter` + `kennel_siller` | Poke leftover ≥ 3, then delete the pet that cannot leave |
| Sip Step | `gait_sipper` + `must_stepper` + `tide_shade` | Force a 1-step, steal the MP they just spent |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog), and Wave 10 packs (Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch).

Do **not** pack as PAIR (COURT later is fine):

- `both_mender` + `gait_mender` / `chase_mender` / `shove_mender` / `clash_mender` / `enter_mender` / `pale_cantor`
- `stride_keeper` + `purse_keeper` / `leftover_lender` / `spare_pacer` / `tempo_precentor`
- `penta_prelate` + `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `cadence_trimmer` + `cadence_shaver` / `cadence_stretcher` / `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender`
- `near_hooder` + `far_hooder` / `sidestep_warder` / `hood_lurker` / `thin_warder`
- `gait_sipper` + `soul_siphon` / `walk_toller` / `gait_taxer` / `tide_shade` as PAIR
- `cast_siller` + `quiet_siller` / `hold_caster` / `tool_holder` / `first_verser`
- `shove_stinger` + `exit_stinger` / `enter_mender` / `fuse_binder` / `glyph_sower` / `trip_mason`
- `must_stepper` + `must_spanner` / `pair_strider` / `even_warder` / `odd_warder` / `diag_locksmith`
- `ally_stepper` + `home_stepper` / `hook_chaplain` / `ally_reeler` / `hinge_squire` / `cover_squire`
- `damp_stinger` + `dry_stinger` / `full_purser` / `empty_plater` / `still_plater` / `lone_stinger`
- `pair_pacer` + `pair_slider` / `pair_porter` / `pair_strider` / `hinge_squire` / `pawn_broker`
- `verse_taxer` + `last_muter` / `gait_taxer` / `hex_teller` / `gait_muter`
- `tool_holder` + `first_verser` / `hold_caster` / `boot_holder` / `hold_knight` / `quiet_siller` / `cast_siller` / `dull_censor`
- `spent_lender` + `boot_lender` / `spare_pacer` / `gift_siller` / `leftover_lender` / `tempo_precentor`
- `pair_strider` + `must_spanner` / `must_stepper` / `even_warder` / `odd_warder` / `axis_locksmith` / `misstep_herald`
- `boot_holder` + `hold_knight` / `hold_caster` / `gait_sealer` / `first_verser` / `tool_holder` / `snare_weaver`
- `near_oather` + `unit_oather` / `ground_oather` / `dim_optic` / `far_stinger`
- `paint_reeler` + `foe_reeler` / `ally_reeler` / `file_reeler` / `echo_painter` / `sink_chanter`
- `nook_biter` + `field_biter` / `wall_biter` / `wall_stinger` / `lone_stinger`
- `stride_marker` + `gait_wicker` / `exit_stinger` / `wound_marker` / `cast_marker` / `body_marker` / `fuse_binder`
- `foe_plater` + `split_plater` / `twin_tether` / `pain_suture` / `share_warden` / `cover_squire`
- `lava_skipper` + `pit_skipper` / `pit_mason` / `ghost_stepper` / `wick_painter`
- `still_plater` + `empty_plater` / `dry_stinger` / `plate_warden` / `tempo_precentor`
- `body_siller` + `kennel_siller` / `snare_weaver` / `quiet_siller` / `gait_sealer` / `leash_warden`
- `clash_mender` + `shove_mender` / `chase_mender` / `gait_mender` / `both_mender` / `pale_cantor` / `enter_mender`
- `cadence_shaver` + `cadence_trimmer` / `cadence_flusher` / `cadence_lender` / `cadence_thief`
- `gait_taxer` + `gait_sipper` / `walk_toller` / `ley_tollkeeper` / `verse_taxer` / `tax_scribe`
- `brick_wiper` + `brick_shifter` / `echo_wiper` / `rime_mason` / `stone_castellan`
- `watch_muter` + `far_hooder` / `last_muter` / `gait_muter` / `hood_lurker`
- `full_purser` + `dry_stinger` / `purse_keeper` / `empty_plater` / `purse_scribe` / `bone_scribe`
- `pet_cutter` + `null_censor` / `leash_cutter` / `crown_cutter` / `kennel_siller` / `spark_chanter`

Do not spawn Penta Plug in a 1-tile closet (needs a free plus). Do not spawn Near Step on a map with no legal 1-step. Penta / Quad / Dummy posts are battle-time — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 11

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/695) (PR #695) unless marked SDE Wave 9 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-163b/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md), PR #646).

---

### ENEMY_ID: `both_mender`

- **NAME:** Both Mender
- **ROLE:** healer (heal iff caster **and** target both walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Both Mend — `healAmount` forces healer profile until `aiProfile` is explicit. Distinct from `gait_mender` (caster only), `chase_mender` (target only), `shove_mender` (force-moved), `clash_mender` (Struck). Extra door is `both_cantor` — family is **not** that id. At most one dual-walk-heal CORE per pack as PAIR vs Gait / Chase / Shove / Clash.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if either `walkMpSpentThisTurn` is 0. Peer: Both Mend only if both walked **and** missing HP ≥ 8. Above: refuse if either flag is false (Frost / Shield). Never walk **only** to enable this if a Strike would kill.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **two steps already paid**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_caster_and_target_walked"`. VETERAN: skip if either flag is 0 **or** missing HP < 8. ELITE: wait for Spare Pace / Spent Lend. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; force-move does **not** arm.
- **CORE_SPELL_POOL:** `spell-both-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-spent-lend` only if `spent_lender` is **absent**
- **ELITE_SPELL_POOL:** none — dual-walk honesty is the elite. Do **not** unlock Gait Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff both caster and target have `walkMpSpentThisTurn ≥ 1`. Fails closed without walk-spend writers.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-still → ELITE wait-for-fund → CHAMPION no-walk-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Both Choir.
- **SYNERGIES:** `spent_lender`, `spare_pacer`, `must_stepper`
- **WEAKNESSES:** Root / Gait Seal one body; Cursed Wound halves the 8
- **PLAYER_COUNTERPLAY:** Keep one body still; Root the cantor; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-both-mend` (MULTI: family observe **or** `both_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (two booleans on the existing heal path)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stride_keeper`

- **NAME:** Stride Keeper
- **ROLE:** buffer (bank leftover walk MP to next turn start)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `purse_keeper` (leftover **AP**), `spare_pacer` (+1 now), Pack Stride (siphon, never owned). Extra door is `stride_bursar` — family is **not** that id. At most one leftover-MP-bank CORE per pack as PAIR vs Purse Keep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover MP is 0. Peer: Keep if leftover ≥ 1 **and** they still need a kite next turn. Above: refuse if leftover is 0 or they must leave a hazard this turn.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **tiles they chose not to spend**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "bank_leftover_mp_if_ge_1_and_next_turn_needs_kite"`. VETERAN: skip if leftover MP is 0. ELITE: Keep then Damp partner next turn. CHAMPION: snapshot is **end of this turn**; death before next start expires the bank; once/battle on the **unit**; never splice RAF.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-stride-keep`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-damp-sting` only if `damp_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — bank honesty is the elite. Do **not** unlock Purse Keep as identity.
- **SIGNATURE_MECHANICS:** Once/battle, cap 2 leftover walk MP paid at **next own turn start**. Distinct from Court Keep (mass, never owned).
- **VARIANT_PROGRESSION:** BASE frost-or-bank → VETERAN skip-if-empty → ELITE bank-then-damp → CHAMPION expire-on-death
- **RARITY_CURVE:** Standard. +ELITE in Stride Bank.
- **SYNERGIES:** `damp_stinger`, `gait_sipper`, `far_stinger`
- **WEAKNESSES:** Soul Sip / Gait Sip the banked MP; ice so they cannot spend what they kept
- **PLAYER_COUNTERPLAY:** Force them to spend the last tiles; kill before next start
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stride-keep` (MULTI: family observe **or** `stride_bursar` first-win — first child wins). Do not restamp `keep_bursar`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (end-of-turn snapshot + next-turn-start pay; no queue splice)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `penta_prelate`

- **NAME:** Penta Prelate
- **ROLE:** summoner (stationary plus occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `quad_prelate` / `triple_span` / `twin_span` / `span_prelate` / `dummy_prelate`. Extra door is `span_penta` — family is **not** that id. At most one Penta Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 5.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place origin if a plus seals a file. Peer: skip if any of the five is blocked **or** remaining cap < 5. Above: place off-axis so Cast Sill / Shove Sting tax the walk-around.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.15, init 0.65, chc 0.70. Penta uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `pentaspan` (SPELL_PROPOSALS): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **five** cells as one combatant id. VETERAN: skip if remaining cap < 5. ELITE: Cast Sill a walk-around cell. CHAMPION: never punch a hole if a later pit lands on one cell — whole plus dies.
- **CORE_SPELL_POOL:** `spell-penta-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the plus)
- **RARE_SPELL_POOL:** `spell-cast-sill` only if `cast_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple / quad on this body.
- **SIGNATURE_MECHANICS:** Origin + four orthogonal. Counts as **five**. Empty kit. 0 XP on plus death. Brick Shift does **not** move occupy cells.
- **VARIANT_PROGRESSION:** BASE wall → VETERAN respect-cap-5 → ELITE sill-the-ring → CHAMPION whole-plus-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 5. Weight 0 on cramped 1-tile closets (solvability).
- **SYNERGIES:** `cast_siller`, `shove_stinger`, `rank_lancer`
- **WEAKNESSES:** Burst the 8 HP; walk around; Swap past; open field
- **PLAYER_COUNTERPLAY:** Sit on the origin; Ignite the 8; artillery if LoS is open from a diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-penta-span` (MULTI: family observe **or** `span_penta` first-win — first child wins). Penta kit is empty — nothing to steal from the post.
- **REWARD_EXPECTATION:** Standard. Plus death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "pentaspan"`; five-cell footprint helper; do not spawn five initiative seats)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_trimmer`

- **NAME:** Cadence Trimmer
- **ROLE:** controller (hostile remaining CDs −1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_shaver` (ally −1), `cadence_stretcher` (×2), `cadence_staller` (+1), `cadence_cracker` (highest → 0). Extra door is `trim_precentor` — family is **not** that id. At most one hostile-CD-minus CORE per pack as PAIR vs Shave / Stretch / Stall / Crack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is 0 or 1. Peer: Trim if highest remaining ≥ 2 **and** a recast would hurt (Verse Tax partner, or they waste AP now). Above: refuse if highest remaining is 1 (Crack is the zero) or all 0.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.25, chc 0.80. Identity is **force the recast**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "trim_hostile_if_remaining_ge_2_and_recast_hurts"`. VETERAN: skip if highest remaining < 2. ELITE: Trim Inferno, then Verse Tax partner. CHAMPION: zeros stay 0; once-per-battle flags are **not** CDs; never invent locks.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-trim`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-verse-tax` only if `verse_taxer` is **absent**
- **ELITE_SPELL_POOL:** none — −1 honesty is the elite. Do **not** unlock Cadence Shave as identity.
- **SIGNATURE_MECHANICS:** Remaining ≥ 1 → `−1`, 0 stays 0. Distinct from Court Stretch (mass ×2, never owned).
- **VARIANT_PROGRESSION:** BASE frost-or-trim → VETERAN skip-if-1 → ELITE trim-the-nuke → CHAMPION no-invent-CD
- **RARITY_CURVE:** Standard. +ELITE in Trim Tax.
- **SYNERGIES:** `verse_taxer`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Sit on CD-0 ids; Cadence Break / Flush on your side
- **PLAYER_COUNTERPLAY:** Recast before they Trim into a tax; keep cheap legal ids
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-trim` (MULTI: family observe **or** `trim_precentor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (iterate existing cooldown map)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `near_hooder`

- **NAME:** Near Hooder
- **ROLE:** tank / anti-melee (next hit from Chebyshev ≤ 1 → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `knight` **without** heal. Distinct from `far_hooder` (≥ 3), `sidestep_warder` (any range), Fog Hood (LoS cut). ELITE acquisition on the spell. At most one melee-band-miss CORE per pack as PAIR vs Far / Sidestep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no hostile is adjacent. Peer: Near Hood if a hostile can Strike this turn. Above: skip if already Far Hood / Sidestep armed.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.85, sr 1.00, res 1.10, init 0.90, chc 0.80. Identity is **walk out to 2**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "near_hood_if_hostile_adjacent_and_can_strike"`. VETERAN: skip if no adjacent threat. ELITE: Must Step partner so they **must** step into the miss. CHAMPION: hits from ≥ 2 do **not** consume; DoT / lava do not consume; timeout 2 turns.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-near-hood`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-must-step` only if `must_stepper` is **absent**
- **ELITE_SPELL_POOL:** none — melee-band honesty is the elite. Do **not** unlock Far Hood as identity.
- **SIGNATURE_MECHANICS:** Next damaging `dealDamage` from Chebyshev ≤ 1 misses (no HP, no absorb chew, no DoT apply), then consume.
- **VARIANT_PROGRESSION:** BASE strike-or-hood → VETERAN skip-if-far → ELITE force-the-1-step → CHAMPION range-honesty
- **RARITY_CURVE:** Standard. +ELITE in Near Step.
- **SYNERGIES:** `must_stepper`, `glass_sniper`, `leash_warden`
- **WEAKNESSES:** Shoot from 2; DoT; wait 2 turns
- **PLAYER_COUNTERPLAY:** Step to Chebyshev 2; Poison; don’t dump Strike into the hood
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-near-hood` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (range-gated consume shield on existing dealDamage)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_sipper`

- **NAME:** Gait Sipper
- **ROLE:** debuffer (steal 1 current MP iff they walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `soul_siphon` (no walk gate), `walk_toller` (+1 walk cost), `gait_taxer` (next spell +1 AP if walked). At most one walk-gated-MP-steal CORE per pack as PAIR vs Soul Sip / Gait Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if `walkMpSpentThisTurn` is 0. Peer: Sip if they walked **and** current MP ≥ 1. Above: refuse if unmoved or MP is 0.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.20, chc 0.85. Identity is **tax the step they already took**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "steal_mp_if_target_walked_and_mp_ge_1"`. VETERAN: skip if flag is 0. ELITE: Must Step partner so they spend a walk. CHAMPION: steal current MP, not max; caster current MP +1 capped at 20; not `spell.mpCost`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gait-sip`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-drain-courage` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-must-step` only if `must_stepper` is **absent**
- **ELITE_SPELL_POOL:** none — walk-gate honesty is the elite. Do **not** unlock Soul Sip as identity.
- **SIGNATURE_MECHANICS:** If target walked and MP ≥ 1, −1 their current MP, +1 caster current MP. Stand is 0.
- **VARIANT_PROGRESSION:** BASE frost-or-sip → VETERAN skip-if-still → ELITE force-the-step → CHAMPION current-not-max
- **RARITY_CURVE:** Standard. +ELITE in Stride Bank / Sip Step.
- **SYNERGIES:** `must_stepper`, `stride_keeper`, `tide_shade`
- **WEAKNESSES:** Stand; Spare Pace after the steal; Root before they walk
- **PLAYER_COUNTERPLAY:** Don’t walk; spend MP before they sip; kill the bishop
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (integer current-MP rewrite + walk flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cast_siller`

- **NAME:** Cast Siller
- **ROLE:** hazard creator (occupant cannot resolve non-physical)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `quiet_siller` (cannot Strike), `hold_caster` (unit cannot spell until walk), `tool_holder` (unit cannot tool until Strike). At most one tile-forbid-non-physical CORE per pack as PAIR vs Quiet / Tool / Hold Caster.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player’s bar is all Strike. Peer: paint the cell they must occupy. Above: skip if they have no non-physical to lose.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 1.00, init 0.85, chc 0.75. Identity is **the tile is Strike-only**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "paint_cast_sill_if_target_holds_non_physical_and_must_occupy"`. VETERAN: skip if bar is all physical. ELITE: paint a walk-around of Penta / Quad. CHAMPION: last writer vs Barrier / Quiet Sill — **both paint keys may coexist**; execute checks each flag.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cast-sill`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-barrier` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-quiet-sill` only if `quiet_siller` is **absent** (CHAMPION / COURT, never BASE PAIR)
- **ELITE_SPELL_POOL:** none — tile honesty is the elite. Do **not** unlock Tool Hold as identity.
- **SIGNATURE_MECHANICS:** Floor paint 2 turns. Occupant cannot confirm `isPhysical !== true`. Strike stays legal. Step off.
- **VARIANT_PROGRESSION:** BASE frost-or-paint → VETERAN skip-if-strike-bar → ELITE paint-the-ring → CHAMPION coexist-with-quiet
- **RARITY_CURVE:** Standard. +ELITE in Penta Plug / Cast Quiet Court.
- **SYNERGIES:** `penta_prelate`, `quiet_siller`, `tool_holder`
- **WEAKNESSES:** Step off; all-Strike bar; wait 2 turns
- **PLAYER_COUNTERPLAY:** Walk off the sill; Strike through it; Swap past
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-sill` (ENEMY_DISCOVERY). Paint is observation; later occupy is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile flag + confirm reject `no_cast_sill`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `shove_stinger`

- **NAME:** Shove Stinger
- **ROLE:** hazard creator (first forced-move landing deals 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `rook` **without** heal. Distinct from `exit_stinger` (leave), `enter_mender` (enter heal), Ingress Mark (walk enter — SDE Wave 10, not this CORE). At most one force-landing-sting CORE per pack as PAIR vs Exit / Enter / Fuse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no legal relocate dest exists. Peer: paint a cell a bash / pair-pace / ally-step can land. Above: refuse if they will **walk** the cell and no relocate is queued.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 0.90, res 0.85, init 1.10, chc 0.95. Identity is **set dest, then shove**. If it tops the meter without a landing, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "paint_shove_sting_on_forced_landing"`. VETERAN: skip if no relocate dest. ELITE: Pair Pace / Bash partner. CHAMPION: walk dest does **not** sting; standing at paint time does not sting; fails closed without `forcedMovedThisTurn`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-shove-sting`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-pair-pace` only if `pair_pacer` is **absent**
- **ELITE_SPELL_POOL:** none — landing honesty is the elite. Do **not** unlock Exit Sting as identity.
- **SIGNATURE_MECHANICS:** Floor paint 2 turns. First **forced** landing deals 8 (RES+SR), then consume. Walk is free.
- **VARIANT_PROGRESSION:** BASE strike-or-paint → VETERAN skip-if-no-shove → ELITE combo-land → CHAMPION walk-is-free
- **RARITY_CURVE:** Standard. +ELITE in Shove Pace / Penta Plug.
- **SYNERGIES:** `pair_pacer`, `bash_bruiser`, `ally_stepper`
- **WEAKNESSES:** Walk the cell; Self Anchor; don’t get pushed
- **PLAYER_COUNTERPLAY:** Step on it yourself (walk is free); Root the basher; Swap the Stinger onto their paint
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shove-sting` (ENEMY_DISCOVERY). Paint is observation; later landing is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile paint + `forcedMovedThisTurn` landing hook)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_stepper`

- **NAME:** Must Stepper
- **ROLE:** controller (remaining walks this turn must be Chebyshev exactly 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `must_spanner` (Manhattan 2), `pair_strider` (one next Manhattan 2), Inch Stride (one next ≤ 1 — not this CORE). ELITE acquisition on the spell. At most one must-Chebyshev-1 CORE per pack as PAIR vs Must Span / Pair Stride / Even / Odd.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they are already boxed with 0 free Chebyshev-1. Peer: Must Step if adjacent paints exist. Above: skip if they will not walk.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.85, init 1.15, chc 0.90. Identity is **make the cheap 2-step illegal**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_step_if_adjacent_paints_exist"`. VETERAN: skip if they will not walk. ELITE: Near Hood / Shove Sting partner. CHAMPION: 2-step and knight 2-1 jumps are **not** walks; 0 walk legal; forced-move any length legal.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-must-step`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-near-hood` only if `near_hooder` is **absent**
- **ELITE_SPELL_POOL:** none — exact-1 honesty is the elite. Do **not** unlock Must Span as identity.
- **SIGNATURE_MECHANICS:** Rest of their **current turn**. Every walk started must be Chebyshev exactly 1.
- **VARIANT_PROGRESSION:** BASE strike-or-step → VETERAN skip-if-no-walk → ELITE hood-the-1-step → CHAMPION relocate-legal
- **RARITY_CURVE:** Standard. +ELITE in Near Step / Sip Step.
- **SYNERGIES:** `near_hooder`, `gait_sipper`, `shove_stinger`
- **WEAKNESSES:** Stand; blink / Ally Step / Swap; Spare Pace does not help a 2-step
- **PLAYER_COUNTERPLAY:** Don’t walk; take a legal 1-step onto a safe cell; wait the turn out
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-step` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-dest filter on existing pathing)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `ally_stepper`

- **NAME:** Ally Stepper
- **ROLE:** protector / displacement specialist (ally lands adjacent to the caster)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `home_stepper` (caster → ally), `hook_chaplain` (pull ally along a line), `ally_reeler` (pull 1 toward ally), `hinge_squire` (90° around ally). Reroll if no ally. Relocate, **not** `isSwap`. At most one ally-to-caster CORE per pack as PAIR vs those peelers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if already Chebyshev-1. Peer: Ally Step if a free adj cell **rescues or seals**. Above: skip if already adj **or** no free adj (fizzle).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.15, chc 0.80. Identity is **bring them to you**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker` / protector. `aiHint: "step_ally_adj_caster_if_unsafe_or_to_heal_range"`. VETERAN: skip if already adj or no free cell. ELITE: land onto Cast Sill / Shove Sting only if the **player** would take it, never if the carry would. CHAMPION: `effectCategory: "relocate"`; landing hazards **must tick**; do not call `swapPositions`; writes `forcedMovedThisTurn` on the **ally**.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-ally-step`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-split-mend` only if `split_cantor` is **absent** (CHAMPION only if `aiProfile` is explicit protector — **not** if healAmount would flip this body to healer at BASE)
- **ELITE_SPELL_POOL:** none — join-here honesty is the elite. Do **not** unlock Home Step as identity.
- **SIGNATURE_MECHANICS:** Move **the ally** to a free Chebyshev-1 of the caster (4-adj first, then diagonals, then lowest `(x,y)`). Caster does not move. Occupying the ring is the counter.
- **VARIANT_PROGRESSION:** BASE strike-or-pull-in → VETERAN no-fizzle-spend → ELITE land-discipline → CHAMPION relocate-flag
- **RARITY_CURVE:** Standard. +ELITE in Ally Quiet. Never CHAMPION in a solo pack.
- **SYNERGIES:** `cast_siller`, `split_cantor`, `shove_stinger`
- **WEAKNESSES:** Occupy all adj cells; Open Pit the only landing; Blink Seal
- **PLAYER_COUNTERPLAY:** Fill the ring; Root does **not** stop this unless Grounded Lock is up; kill the carry anyway with no-LoS
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ally-step` (ENEMY_DISCOVERY). Cast (including blocked landing after AP) observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest pick; new flag, not `isSwap`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `damp_stinger`

- **NAME:** Damp Stinger
- **ROLE:** assassin (bonus iff leftover walk MP ≥ 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `dry_stinger` (leftover **AP = 0**), `full_purser` (leftover **AP ≥ 3**), `still_plater` (leftover **MP = 0 → +RES**). At most one leftover-MP-poke CORE per pack as PAIR vs Dry / Full / Still.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 8 even if leftover MP < 2 (still kills). Peer: skip if leftover MP < 2 **unless** 8 kills. Above: refuse the card if leftover < 2 and 8 does not kill (path / Strike).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.85, res 0.80, init 1.25, chc 1.05. Identity is **poke the kiter who banked walk**. If it tops the meter on a 0-MP body every time, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "damp_if_target_leftover_mp_ge_2"`. VETERAN: skip if leftover MP < 2 unless lethal. ELITE: Stride Keep partner so they sit on leftover. CHAMPION: two `dealDamage` calls (8 then +10); two Mark chances if the tile is marked.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-damp-sting`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-stride-keep` only if `stride_keeper` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP honesty is the elite. Do **not** unlock Dry Sting as identity.
- **SIGNATURE_MECHANICS:** 8, +10 if leftover walk MP ≥ 2 (18 total). Gate is leftover **MP**, not AP.
- **VARIANT_PROGRESSION:** BASE poke → VETERAN skip-if-dry-feet → ELITE bank-then-sting → CHAMPION two-hit
- **RARITY_CURVE:** Standard. +ELITE in Stride Bank.
- **SYNERGIES:** `stride_keeper`, `gait_sipper`, `tide_shade`
- **WEAKNESSES:** Spend down to 1 MP; Stride Keep does not help the Stinger **this** turn
- **PLAYER_COUNTERPLAY:** End turn with 1 leftover MP; don’t dump walk into Spare Pace then stand
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-damp-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (integer read on leftover MP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_pacer`

- **NAME:** Pair Pacer
- **ROLE:** displacement specialist (caster and adjacent ally translate 1 together)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `pair_slider` (two **hostiles**), `pair_porter` (90° around midpoint), `pair_strider` (one next walk Manhattan 2), `home_stepper` / `ally_stepper` (one body). Relocate, **not** `isSwap`. Reroll if no Chebyshev-1 ally. At most one pair-translate-with-ally CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if dests are blocked. Peer: Pace onto paint / off a file. Above: skip if no Chebyshev-1 ally or a dest is blocked (fizzle).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.10, chc 0.80. Identity is **march as a pair**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "pace_with_adj_ally_onto_paint_or_off_file"`. VETERAN: skip if dest blocked. ELITE: land onto Shove Sting / Cast Sill only if the **player** would take it. CHAMPION: both dests must be free after vacating the pair; writes `forcedMovedThisTurn` on **both**; landing hazards tick.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-pair-pace`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-shove-sting` only if `shove_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — pair-translate honesty is the elite. Do **not** unlock Pair Slide as identity.
- **SIGNATURE_MECHANICS:** Target a living ally at Chebyshev exactly 1. Translate both 1 cell in the caster→ally direction. Diagonal vector steps diagonally.
- **VARIANT_PROGRESSION:** BASE strike-or-pace → VETERAN no-fizzle-spend → ELITE paint-discipline → CHAMPION dual-flag
- **RARITY_CURVE:** Standard. +ELITE in Shove Pace / Pair File. Never CHAMPION in a solo pack.
- **SYNERGIES:** `shove_stinger`, `rank_lancer`, `glyph_sower`
- **WEAKNESSES:** Occupy dests; isolate the pair; Root does not stop unless Grounded Lock
- **PLAYER_COUNTERPLAY:** Split them; Barrier the dest; sit on the line
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-pace` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (pair occupancy dests; not `swapPositions`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `verse_taxer`

- **NAME:** Verse Taxer
- **ROLE:** debuffer (recasting their last resolved id costs +1 AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `last_muter` (id **illegal**), `gait_taxer` (next **any** spell +1 if walked), Hex Toll (next any +1). At most one last-id-tax CORE per pack as PAIR vs Last Mute / Gait Tax.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no last id. Peer: Tax if last id `apCost ≥ 3`. Above: skip if last id is Strike (2+1=3 is still cheap) unless that is their only tool.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is **tax the Inferno they just showed**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tax_last_id_if_cost_ge_3"`. VETERAN: skip if no last id or last id is Strike. ELITE: Trim partner so they recast into the tax. CHAMPION: other ids untaxed; duration 2 of **their** turns or until they spend on that id; fails closed without `lastResolvedSpellId`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-tax`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-cadence-trim` only if `cadence_trimmer` is **absent**
- **ELITE_SPELL_POOL:** none — last-id honesty is the elite. Do **not** unlock Last Mute as identity.
- **SIGNATURE_MECHANICS:** Last successfully resolved id costs `apCost + 1` for 2 of their turns or until they recast it.
- **VARIANT_PROGRESSION:** BASE frost-or-tax → VETERAN skip-if-strike → ELITE trim-then-tax → CHAMPION last-id-writer
- **RARITY_CURVE:** Standard. +ELITE in Trim Tax / Gait Pulpit.
- **SYNERGIES:** `cadence_trimmer`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Cast a cheap unused id; sit on CD-0 tools; wait 2 turns
- **PLAYER_COUNTERPLAY:** Don’t recast Inferno; swap to Frost; kill the Taxer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-tax` (ENEMY_DISCOVERY). Cast observes even on no-last-id fizzle after AP.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`lastResolvedSpellId` + next-confirm AP rewrite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tool_holder`

- **NAME:** Tool Holder
- **ROLE:** controller (cannot resolve non-physical until they Strike)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `first_verser` (cannot Strike until a **spell**), `hold_caster` (cannot spell until **walk**), `boot_holder` (cannot **walk** until Strike), `cast_siller` (**tile** forbids non-physical). At most one unit-forbid-tool-until-Strike CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if their bar is already all physical. Peer: Tool Hold if they need a non-physical first. Above: skip if they have no Strike / `isPhysical` to peel with except waiting.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.90, res 0.85, init 1.15, chc 0.85. Identity is **spend 2 AP on Strike to unlock tools**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tool_hold_if_target_bar_needs_non_physical_first"`. VETERAN: skip if bar is all physical. ELITE: Cast Sill COURT partner (never PAIR). CHAMPION: 2 of their turns or until they successfully spend AP on Strike / `isPhysical`; reject `no_tool_hold`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-tool-hold`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-cast-sill` only if `cast_siller` is **absent** (CHAMPION / COURT)
- **ELITE_SPELL_POOL:** none — Strike-to-unlock honesty is the elite. Do **not** unlock Cast Hold as identity.
- **SIGNATURE_MECHANICS:** Unit lock. Frost / Inferno / heals / summons illegal until they Strike. Distinct from Oath Blade (may **only** Strike).
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-physical-bar → ELITE sill-court → CHAMPION duration-or-peel
- **RARITY_CURVE:** Standard. +ELITE in Cast Quiet Court.
- **SYNERGIES:** `cast_siller`, `quiet_siller`, `near_oather`
- **WEAKNESSES:** Strike then tool; all-Strike bar; Dispel
- **PLAYER_COUNTERPLAY:** Strike to peel; wait 2; don’t show Inferno first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tool-hold` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (unit flag + confirm reject)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spent_lender`

- **NAME:** Spent Lender
- **ROLE:** buffer (+1 current MP to an ally who already walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `boot_lender` (**unmoved**), `spare_pacer` (+1 now, no gate), `gift_siller` (enter +MP). At most one walked-ally-MP-grant CORE per pack as PAIR vs Boot / Spare / Gift.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if ally `walkMpSpentThisTurn` is 0. Peer: Lend if they walked **and** need one more step. Above: refuse if unmoved or already at max MP.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.80, sr 0.90, res 0.80, init 1.15, chc 0.75. Identity is **fund the second step**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "lend_mp_if_ally_already_walked_and_needs_one_more"`. VETERAN: skip if flag is 0. ELITE: Both Mend partner so the second step also arms the heal. CHAMPION: +1 current MP this turn, cap 20; force-move does **not** count as walked.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-spent-lend`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `starter-shield`
- **RARE_SPELL_POOL:** `spell-both-mend` only if `both_mender` is **absent** (CHAMPION only if `aiProfile` stays buffer — do **not** put healAmount on this body at BASE)
- **ELITE_SPELL_POOL:** none — walked-gate honesty is the elite. Do **not** unlock Boot Lend as identity.
- **SIGNATURE_MECHANICS:** +1 current MP iff the ally already spent walk MP this turn.
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-still → ELITE lend-then-both → CHAMPION current-cap
- **RARITY_CURVE:** Standard. +ELITE in Both Choir.
- **SYNERGIES:** `both_mender`, `spare_pacer`, `must_stepper`
- **WEAKNESSES:** Keep the ally still; max MP; Root before they walk
- **PLAYER_COUNTERPLAY:** Kill the walker before the lend; Root; sit on the second tile
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spent-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk flag + current MP grant)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_strider`

- **NAME:** Pair Strider
- **ROLE:** controller (one next walk must be Manhattan exactly 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `must_spanner` (**all** remaining this turn), `must_stepper` (Chebyshev **1**), `even_warder` / `odd_warder` (parity). Extra door is `pair_gallery` — family is **not** that id. SDE Wave 9. At most one one-walk-Manhattan-2 CORE per pack as PAIR vs Must Span / Must Step / Even / Odd / Axis Locksmith (G≥9 extra is **not** CORE).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if rooted or MP = 0. Peer: Pair Stride if they have a 1-tile path **and** a 3-tile path. Above: skip if they will not walk.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.15, chc 0.85. Identity is **one forced 2-step**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "force_exact_manhattan_2"`. VETERAN: skip if rooted or MP = 0. ELITE: Stride Mark partner so the 2-step leaves the painted cell. CHAMPION: constraint ends after that one walk (or 2 turns); last writer vs Must Span; teleport / Swap / shove do not pay.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pair-stride`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-stride-mark` only if `stride_marker` is **absent**
- **ELITE_SPELL_POOL:** none — one-walk honesty is the elite. Do **not** unlock Must Span as identity.
- **SIGNATURE_MECHANICS:** Next **one** walk must be Manhattan exactly 2 (`|dx|+|dy| = 2`). A 1-step cardinal is illegal. Confirm fails closed; MP not spent.
- **VARIANT_PROGRESSION:** BASE frost-or-span → VETERAN skip-if-no-walk → ELITE mark-the-2-step → CHAMPION last-writer
- **RARITY_CURVE:** Standard. +ELITE in Stride Pulpit. +VETERAN in `pair_gallery`.
- **SYNERGIES:** `stride_marker`, `gait_sealer`, `axis_locksmith`
- **WEAKNESSES:** Walk a legal 2; Haste; blink; wait the duration
- **PLAYER_COUNTERPLAY:** Take the 2-step onto a safe cell; don’t walk; Swap off
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-stride` (MULTI: family observe **or** `pair_gallery` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (one-walk length filter; last writer vs Must Span)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `boot_holder`

- **NAME:** Boot Holder
- **ROLE:** controller / anti-kiter (cannot walk until they Strike)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `hold_knight` (cannot **Strike** until walk), `gait_sealer` (cannot walk; spells legal), `tool_holder` (cannot **tool** until Strike), `hold_caster` (cannot **spell** until walk). Encounter room `hold_nave` is a teach — family is **not** that id. SDE Wave 9. At most one walk-until-Strike CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they already Struck or have no Strike. Peer: Boot Hold if they have leftover MP. Above: skip if they have no Strike to peel with.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.85, sr 1.00, res 1.05, init 0.90, chc 0.80. Identity is **nail feet until they spend 2 on Strike**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "forbid_walk_until_strike"`. VETERAN: skip if they already Struck or have no Strike. ELITE: Near Oath partner so the peel Strike is their only legal confirm. CHAMPION: spells stay legal; forced-move does **not** clear the hold; 1 turn + CD 2; do **not** PAIR with Root (`snare_weaver`) — last writer is a brick.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-boot-hold`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-near-oath` only if `near_oather` is **absent**
- **ELITE_SPELL_POOL:** none — walk-lock honesty is the elite. Do **not** unlock Gait Seal as identity.
- **SIGNATURE_MECHANICS:** Target cannot confirm a **walk** until they resolve Strike this turn. Spells stay legal.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-no-strike → ELITE oath-the-peel → CHAMPION relocate-does-not-clear
- **RARITY_CURVE:** Standard. +ELITE in Boot Oath. +VETERAN in `hold_nave`.
- **SYNERGIES:** `near_oather`, `leash_warden`, `body_siller`
- **WEAKNESSES:** Strike then walk; blink; Dispel; cast in place
- **PLAYER_COUNTERPLAY:** Strike to peel; don’t show leftover MP; Swap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-boot-hold` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk confirm reject until Strike this turn)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `near_oather`

- **NAME:** Near Oather
- **ROLE:** controller / anti-ranged (next spell must have range ≤ 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `unit_oather` (unit **class**), `ground_oather` (ground only), `dim_optic` (**cuts** range, confirms still legal). SDE Wave 9. At most one next-spell-range-≤1 CORE per pack as PAIR vs Unit / Ground / Dim.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if their kit is already melee-only. Peer: Near Oath if they hold Frost / Inferno / Far Sting. Above: skip if they only have Strike / self buffs.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.15, chc 0.85. Identity is **long confirms fail closed**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_spell_range_le_1"`. VETERAN: skip if kit is melee-only. ELITE: Boot Hold partner. CHAMPION: longer confirms fail closed, AP not spent; Strike (range 1) remains legal; last writer vs Ground / Unit Oath.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-near-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-boot-hold` only if `boot_holder` is **absent**
- **ELITE_SPELL_POOL:** none — range-class honesty is the elite. Do **not** unlock Short Sight as identity.
- **SIGNATURE_MECHANICS:** Next spell confirm must have effective `range ≤ 1`. 1 turn.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-melee → ELITE hold-the-feet → CHAMPION last-writer
- **RARITY_CURVE:** Standard. +ELITE in Boot Oath.
- **SYNERGIES:** `boot_holder`, `leash_warden`, `tool_holder`
- **WEAKNESSES:** Strike / self buffs; walk in; wait 1; Dispel
- **PLAYER_COUNTERPLAY:** Cast Strike; wait; don’t show Inferno at 4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-near-oath` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (next-confirm range gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `paint_reeler`

- **NAME:** Paint Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest paint)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `foe_reeler` (toward a **body**), `ally_reeler` (toward ally), `file_reeler` (along file toward caster), `echo_painter` (copies paint). SDE Wave 9. Fourth `applyAttract` dest flavor. At most one paint-attract CORE per pack as PAIR vs those reels. Reroll if no living paint.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no paint or both steps blocked. Peer: Reel onto cinder / rime / fuse. Above: skip if Echo Wipe already cleared the board.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.10, chc 0.85. Identity is **the paint is the attractor**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_paint"`. VETERAN: skip if no paint. ELITE: Fuse / Cinder partner. CHAMPION: dest = nearest last-written paint cell, distance 1; blocked / void / portal fizzles the slide (AP spent); do not assign until `applyAttract` has a production cast caller (Ally / Foe first).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-paint-reel`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-fuse-tile` only if `fuse_binder` is **absent**
- **ELITE_SPELL_POOL:** none — paint-dest honesty is the elite. Do **not** unlock Foe Reel as identity.
- **SIGNATURE_MECHANICS:** Attract 1 toward nearest living paint (cinder / rime / wick / echo / fuse). Standing on the caster is not safety.
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-blank → ELITE reel-onto-wick → CHAMPION dest-flavor
- **RARITY_CURVE:** Standard. +ELITE in Paint Nook.
- **SYNERGIES:** `fuse_binder`, `nook_biter`, `echo_painter`
- **WEAKNESSES:** Echo Wipe; occupy the toward-tile; Barrier
- **PLAYER_COUNTERPLAY:** Wipe paint; stand off the dest; don’t cluster into Inferno
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-paint-reel` (ENEMY_DISCOVERY). Blocked slide still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (fourth `applyAttract` dest flavor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `nook_biter`

- **NAME:** Nook Biter
- **ROLE:** artillery (bonus if exactly one adjacent block)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `field_biter` (0 blocks), `wall_biter` / `wall_stinger` (any hug), `lone_stinger` (0 adj **bodies**). Encounter room `nook_court` is a teach — family is **not** that id. SDE Wave 9. At most one exactly-one-block CORE per pack as PAIR vs Field / Wall / Lone.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 even if 0 or ≥ 2 blocks (still kills). Peer: skip if 0 or ≥ 2 unless 10 kills. Above: refuse if not exactly one block and 10 does not kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.85, res 0.80, init 1.15, chc 1.00. Identity is **the alcove**. If it tops the meter in the open every time, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_exactly_one_adj_block"`. VETERAN: skip if 0 or ≥ 2. ELITE: Brick Wipe / Brick Shift partner to leave exactly one wall. CHAMPION: map edge counts as a block; +8 is the same band as Field/Wall so the choice is **which floor**.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-nook-bite`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-brick-wipe` only if `brick_wiper` is **absent**
- **ELITE_SPELL_POOL:** none — exactly-one honesty is the elite. Do **not** unlock Field Bite as identity.
- **SIGNATURE_MECHANICS:** 10, +8 if the target cell has exactly one Chebyshev-1 blocking tile (barrier / void / map edge).
- **VARIANT_PROGRESSION:** BASE poke → VETERAN skip-if-not-nook → ELITE make-the-nook → CHAMPION edge-counts
- **RARITY_CURVE:** Standard. +ELITE in Paint Nook. +VETERAN in `nook_court`.
- **SYNERGIES:** `paint_reeler`, `fuse_binder`, `brick_wiper`
- **WEAKNESSES:** Step into the open or into a two-wall corner; Barrier a second face
- **PLAYER_COUNTERPLAY:** Don’t hug exactly one wall; Brick Shift the hug away
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-nook-bite` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (count adj blocks + existing damage helper)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stride_marker`

- **NAME:** Stride Marker
- **ROLE:** hazard creator / status specialist (cell paint detonates on walk-leave)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `bishop` **without** heal. Distinct from `gait_wicker` (**unit** mark, any walk MP), `exit_stinger` (first leave of a **different** paint), `wound_marker` (they take a hit), `cast_marker` (their cast). Encounter room `stride_pulpit` is a teach — family is **not** that id. SDE Wave 9. At most one cell-leave-detonate CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if rooted, MP = 0, or they are already off the cell. Peer: paint their current cell if they still have walk MP. Above: refuse if they cannot walk (Root / Gait Seal already up).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.85, res 0.80, init 1.20, chc 1.00. Identity is **tax leaving that cell**. If it tops the meter without a detonate, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "detonate_on_walk_leave_cell"`. VETERAN: skip if they cannot walk. ELITE: Pair Stride partner so they **must** take a 2-step off it. CHAMPION: forced-move / blink / swap **clears** without detonate; a later walk from a **different** cell does not detonate; do **not** reuse `gaitWickDamage`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-stride-mark`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-pair-stride` only if `pair_strider` is **absent**
- **ELITE_SPELL_POOL:** none — cell-scope honesty is the elite. Do **not** unlock Gait Wick as identity.
- **SIGNATURE_MECHANICS:** Paint the target’s **current cell** 2 turns. Next ≥ 1 walk MP that **leaves that cell** deals 12, then consume. Stand is 0.
- **VARIANT_PROGRESSION:** BASE strike-or-paint → VETERAN skip-if-nailed → ELITE force-the-leave → CHAMPION relocate-clears
- **RARITY_CURVE:** Standard. +ELITE in Stride Pulpit. +VETERAN in `stride_pulpit`.
- **SYNERGIES:** `pair_strider`, `gait_sealer`, `must_spanner`
- **WEAKNESSES:** Stand; blink / swap off (clears, 0); Dispel; wait it out
- **PLAYER_COUNTERPLAY:** Don’t leave the cell; Swap off; Root is a dead card for them
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stride-mark` (ENEMY_DISCOVERY). Arm observes; detonation is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (cell paint + walk-leave hook; not a unit mark)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `foe_plater`

- **NAME:** Foe Plater
- **ROLE:** tank (next incoming hit 50/50 with adjacent enemy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `split_plater` (share with an **ally**), `twin_tether` (ongoing while Chebyshev ≤ 3), `pain_suture` (redirect whole hit). SDE Wave 9. At most one incoming-split-with-enemy CORE per pack as PAIR vs those. Reroll if no adjacent hostile at spawn.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no adjacent hostile. Peer: Foe Plate if a neighbor exists. Above: skip if isolated (full hit, charge ends).
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.05, res 1.15, init 0.80, chc 0.70. Identity is **park a neighbor**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "split_incoming_adjacent_enemy"`. VETERAN: skip if no adjacent hostile. ELITE: Goad partner so the player hits the plated body. CHAMPION: missing-neighbor at hit time = full hit + charge ends; one hit + CD 3; player copy parks a summon next to a boss — charge is still one hit.
- **CORE_SPELL_POOL:** `spell-iron-skin`, `spell-foe-plate`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — neighbor honesty is the elite. Do **not** unlock Split Plate as identity.
- **SIGNATURE_MECHANICS:** Next applied hit on the caster splits 50/50 with a living **hostile-to-the-caster** Chebyshev-1.
- **VARIANT_PROGRESSION:** BASE plate-or-skin → VETERAN skip-if-alone → ELITE goad-the-hit → CHAMPION isolate-fails-closed
- **RARITY_CURVE:** Standard. +ELITE in Foe Goad.
- **SYNERGIES:** `goad_herald`, `iron_golem`, `foe_reeler`
- **WEAKNESSES:** Isolate them; hit the neighbor first; wait 2
- **PLAYER_COUNTERPLAY:** Pull them off the neighbor; don’t Strike the plated body
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-foe-plate` (ENEMY_DISCOVERY). Cast observes; later shared incoming is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (incoming split helper; neighbor class is **enemy**, not ally)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `lava_skipper`

- **NAME:** Lava Skipper
- **ROLE:** kiter (next 1-tile walk treats lava as floor)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `pit_skipper` (**pit**), Safe Fall (forced-move hazard), `ember_knight` (**paints** lava). SDE Wave 9. At most one lava-ignore CORE per pack as PAIR vs Pit Skip. Weight 0 on maps with no lava / ember-wake / cinder.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no lava on a 1-step. Peer: arm then walk 1 onto lava. Above: skip if they would need a 2-step.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.85, init 1.20, chc 0.90. Identity is **the 1-tile lava walk**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "next_walk_ignores_lava"`. VETERAN: skip if no lava on a 1-step. ELITE: Ember partner paints the dest. CHAMPION: length ≥ 2 does **not** ignore; forced-move does not consume; pit / void / barriers still illegal; maps stay solvable for the **player**.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-lava-skip`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-ember-wake` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — 1-tile-lava honesty is the elite. Do **not** unlock Pit Skip as identity.
- **SIGNATURE_MECHANICS:** Next 1-tile walk this turn treats lava / ember-wake / cinder as floor (no enter tick).
- **VARIANT_PROGRESSION:** BASE strike-or-skip → VETERAN skip-if-no-lava → ELITE paint-then-skip → CHAMPION length-gate
- **RARITY_CURVE:** Standard. +ELITE in Lava Still. Weight 0 on maps with no lava paint.
- **SYNERGIES:** `still_plater`, `ember_knight`, `wick_painter`
- **WEAKNESSES:** Force a 2-step; Root; occupy the far side
- **PLAYER_COUNTERPLAY:** Don’t let them take the 1-step; Open Pit the dest; wait the CD
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lava-skip` (ENEMY_DISCOVERY). Arm observes; the later lava walk is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-walk hazard filter; do not edit `mapGen.ts`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `still_plater`

- **NAME:** Still Plater
- **ROLE:** tank (0 leftover walk MP → +RES)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `empty_plater` (0 leftover **AP**), `dry_stinger` (0 leftover AP **damage**), Planted Stance (0-walk stance). SDE Wave 9. At most one leftover-MP-zero-RES CORE per pack as PAIR vs Empty / Dry.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if leftover MP ≥ 1. Peer: spend walk first, then Plate. Above: refuse if they still need a 2-tile walk.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.75, sr 1.05, res 1.10, init 0.80, chc 0.70. Identity is **spend the last tile, then plate**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "self_buff_if_zero_leftover_mp"`. VETERAN: skip if leftover MP ≥ 1. ELITE: Walk Toll partner so they spend the last MP. CHAMPION: +30% RES for 1 turn; leftover ≥ 1 fizzles (AP spent); last writer vs Empty Plate uses a **different** key (`emptyLeftoverMpRes`).
- **CORE_SPELL_POOL:** `spell-iron-skin`, `spell-still-plate`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-walk-toll` only if `walk_toller` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-MP honesty is the elite. Do **not** unlock Empty Plate as identity.
- **SIGNATURE_MECHANICS:** If leftover **walk MP** is 0 at resolve, +30% RES / 1. Otherwise 0 RES.
- **VARIANT_PROGRESSION:** BASE skin-or-plate → VETERAN skip-if-wet-feet → ELITE spend-then-plate → CHAMPION key-split
- **RARITY_CURVE:** Standard. +ELITE in Lava Still.
- **SYNERGIES:** `lava_skipper`, `ember_knight`, `walk_toller`
- **WEAKNESSES:** Force leftover MP (Haste, Spare Pace); hit before they spend down
- **PLAYER_COUNTERPLAY:** Haste them; don’t let them dump the last tile; Cursed Wound
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-still-plate` (ENEMY_DISCOVERY). Fizzle still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover MP gate + existing RES buff)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `body_siller`

- **NAME:** Body Siller
- **ROLE:** controller / anti-melee (primary cannot leave the cell)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `kennel_siller` (**summons** cannot leave), `snare_weaver` (Root / MP lock), `quiet_siller` (occupant cannot **Strike**), `gait_sealer` (cannot walk; spells legal). ELITE acquisition. SDE Wave 9. At most one primary-cannot-leave CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the in-range body is a summon. Peer: Body Sill the player primary. Above: skip if they can Swap / blink this turn and no Grounded Lock is up.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 0.90, res 0.85, init 1.15, chc 0.85. Identity is **the player body is nailed**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_primary_leave_cell"`. VETERAN: skip if the in-range body is a summon. ELITE: Cinder under their feet. CHAMPION: summons unaffected; blink / Swap / shove still move them and **end** the sill; 1 turn + CD 3; do **not** PAIR with Root.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-body-sill`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-cinder-tile` only if `ember_knight` is **absent** from the pack as a live hook owner
- **ELITE_SPELL_POOL:** none — primary-only honesty is the elite. Do **not** unlock Kennel Sill as identity.
- **SIGNATURE_MECHANICS:** Player primary cannot confirm a walk that leaves their current cell. Pets walk freely.
- **VARIANT_PROGRESSION:** BASE frost-or-sill → VETERAN skip-if-pet → ELITE paint-under → CHAMPION blink-ends
- **RARITY_CURVE:** Standard. +ELITE in Body Clash / Boot Oath.
- **SYNERGIES:** `clash_mender`, `crimson_spawn`, `boot_holder`
- **WEAKNESSES:** Swap / blink; send a summon; Dispel; wait 1
- **PLAYER_COUNTERPLAY:** Blink off; Strike in place; don’t walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-body-sill` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (primary-only leave reject; summons exempt)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `clash_mender`

- **NAME:** Clash Mender
- **ROLE:** healer (heal iff target Struck)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Clash Mend — healer profile until `aiProfile` is explicit. Distinct from `shove_mender` (force-moved), `chase_mender` (walked), `both_mender` (both walked), `pale_cantor` (unconditional). ELITE acquisition. SDE Wave 9. At most one Struck-heal CORE per pack as PAIR vs those menders.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if unstruck or missing HP < 8. Peer: Clash Mend only if `struckThisTurn`. Above: refuse if the ally is full or the flag is false.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **they already Struck**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_struck"`. VETERAN: skip if unstruck or missing HP < 8. ELITE: wait for Crimson / Oath Blade partner. CHAMPION: 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased; walk / force-move / DoT must **not** set the flag.
- **CORE_SPELL_POOL:** `spell-clash-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-enrage` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — Struck honesty is the elite. Do **not** unlock Both Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff the target resolved Strike / `isPhysical` this turn. Fails closed without `struckThisTurn`.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-unstruck → ELITE wait-for-clash → CHAMPION no-walk-as-struck
- **RARITY_CURVE:** Standard. +ELITE in Body Clash.
- **SYNERGIES:** `body_siller`, `crimson_spawn`, `first_verser`
- **WEAKNESSES:** Don’t let the wounded body Strike; Mute Thread their Strike; Cursed Wound
- **PLAYER_COUNTERPLAY:** Kill before the mend; keep the bruiser from Striking; Root is not the gate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-clash-mend` (ELITE observe). Observe even on heal 0.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`struckThisTurn` writer on physical resolve)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_shaver`

- **NAME:** Cadence Shaver
- **ROLE:** buffer (ally −1 all remaining CDs)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_trimmer` (**hostile** −1), `cadence_flusher` (ally all → **0**), `cadence_lender` (−1 **one** ally id), `cadence_thief` (steal 1). Encounter room `shave_nave` is a teach — family is **not** that id. SDE Wave 9. At most one ally-all-minus CORE per pack as PAIR vs Trim / Flush / Lend / Thief. SDE listed `cadence_thief` as a G≥9 extra owner — that is **not** CORE.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if all ally CDs are 0 or 1. Peer: Shave if an ally’s highest remaining ≥ 2. Above: refuse if Flush would be the full reset (this family does not own Flush).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.20, chc 0.75. Identity is **recycle Inferno one turn earlier**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "shave_all_remaining_cds"`. VETERAN: skip if highest remaining < 2. ELITE: Once Verse partner on a **different** body. CHAMPION: 0 stays 0; self is a legal ally; CD 3; do **not** PAIR with Trim.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-shave`
- **ADVANCED_SPELL_POOL:** `spell-haste` only if `usableByEnemy` is flipped for **that one id**, `spell-tempo-gift` only if `tempo_precentor` is **absent**
- **RARE_SPELL_POOL:** `spell-once-verse` only if `once_cantor` is **absent**
- **ELITE_SPELL_POOL:** none — ally-minus honesty is the elite. Do **not** unlock Cadence Trim as identity.
- **SIGNATURE_MECHANICS:** Every kit id on the **ally** with remaining CD ≥ 1 is reduced by 1.
- **VARIANT_PROGRESSION:** BASE frost-or-shave → VETERAN skip-if-1 → ELITE lock-the-recycle → CHAMPION self-legal
- **RARITY_CURVE:** Standard. +ELITE in Shave Once. +VETERAN in `shave_nave`.
- **SYNERGIES:** `once_cantor`, `tempo_precentor`, `ignite_alchemist`
- **WEAKNESSES:** Kill the ally before the shave; Mute Thread the recycled id
- **PLAYER_COUNTERPLAY:** Burst the Inferno queen first; Cadence Break on your side
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-shave` (ENEMY_DISCOVERY). Empty-bar shave still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (iterate ally cooldown map)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_taxer`

- **NAME:** Gait Taxer
- **ROLE:** debuffer (next spell +1 AP if they walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `gait_sipper` (steal **MP**), `walk_toller` (+1 **walk MP**), `verse_taxer` (last **id** +1, no walk gate), `tax_scribe` / `ley_tollkeeper` (G≥9 extras are **not** CORE). SDE Wave 9. At most one walk-gated-spell-tax CORE per pack as PAIR vs those.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if unmoved or they only have Strike. Peer: Tax if they walked. Above: refuse if they have not walked (tax does not apply).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is **cast before walking, or Strike**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "tax_next_spell_if_walked"`. VETERAN: skip if unmoved or Strike-only. ELITE: Last Mute partner. CHAMPION: +1 AP on the **next spell**, not `spell.mpCost`; 1 turn + CD 2; walk-gated.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-gait-tax`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-last-mute` only if `last_muter` is **absent**
- **ELITE_SPELL_POOL:** none — walk-gate honesty is the elite. Do **not** unlock Verse Tax as identity.
- **SIGNATURE_MECHANICS:** If they spent ≥ 1 walk MP this turn, their next spell costs +1 AP.
- **VARIANT_PROGRESSION:** BASE frost-or-tax → VETERAN skip-if-still → ELITE mute-then-tax → CHAMPION not-mpCost
- **RARITY_CURVE:** Standard. +ELITE in Gait Pulpit.
- **SYNERGIES:** `last_muter`, `once_cantor`, `boot_holder`
- **WEAKNESSES:** Cast before walking; Strike; wait 1
- **PLAYER_COUNTERPLAY:** Don’t walk then Inferno; Strike; kill the Taxer
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-tax` (ENEMY_DISCOVERY). Observe even when they have not walked.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (walk flag + next-confirm AP rewrite)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `brick_wiper`

- **NAME:** Brick Wiper
- **ROLE:** hazard creator (erase adjacent barrier)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `brick_shifter` (**slides**), `echo_wiper` (erases **paint**), Dispel Thread (unit buffs). SDE Wave 9. At most one barrier-erase CORE per pack as PAIR vs Shift / Echo Wipe. SDE listed `stone_castellan` / `rime_mason` as G≥9 extras — those are **not** CORE.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no adjacent barrier. Peer: wipe to open a file the pack can lance. Above: skip if wiping would unsolve the only choke the **player** has (solvability — do not edit `mapGen.ts`; skip the cast).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 1.00, init 0.85, chc 0.75. Identity is **open a file**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "erase_adjacent_barrier"`. VETERAN: skip if no adjacent barrier. ELITE: Nook Bite partner after a two-wall corner becomes one. CHAMPION: aimed cell must be in `barrierTiles`; map-gen walls that are not in that set are illegal; empty wipe still spends AP.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-brick-wipe`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-file-lance` only if `rank_lancer` is **absent**
- **RARE_SPELL_POOL:** `spell-nook-bite` only if `nook_biter` is **absent**
- **ELITE_SPELL_POOL:** none — erase honesty is the elite. Do **not** unlock Brick Shift as identity.
- **SIGNATURE_MECHANICS:** Erase one Chebyshev-1 `barrierTiles` cell. Does not slide. Does not erase paint.
- **VARIANT_PROGRESSION:** BASE frost-or-wipe → VETERAN skip-if-blank → ELITE make-the-nook → CHAMPION barrierTiles-only
- **RARITY_CURVE:** Standard. +ELITE in Brick Watch / Paint Nook.
- **SYNERGIES:** `nook_biter`, `watch_muter`, `rank_lancer`
- **WEAKNESSES:** Stand off the opened file; re-drop a turret; Brick Shift the wall away first
- **PLAYER_COUNTERPLAY:** Don’t hug the opened file; Barrier a new face
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-brick-wipe` (ENEMY_DISCOVERY). Empty wipe still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (adjacent `barrierTiles` erase; do not touch `mapGen.ts`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `watch_muter`

- **NAME:** Watch Muter
- **ROLE:** anti-ranged / controller (next overwatch snap deals 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` **without** heal. Distinct from `far_hooder` (hit from ≥ 3 → 0), `last_muter` (last **id** illegal), Gap Ward (skip overwatch on a **1-tile** walk), `hood_lurker` (G≥9 extra is **not** CORE). ELITE acquisition. SDE Wave 9. At most one overwatch-zero CORE per pack as PAIR vs Far Hood / Last Mute / Hood.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no armed overwatch sits on the player path. Peer: Mute if Far Watch / Hold Ground is live. Above: skip if they will not walk a snap.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.20, chc 0.90. Identity is **the snap still consumes, for 0**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_overwatch_deals_zero"`. VETERAN: skip if no armed overwatch. ELITE: Brick Wipe partner so they walk the opened file into a muted snap. CHAMPION: 2 turns; one snap; the overwatch charge is still consumed; DoT / melee are not snaps.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-watch-mute`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `spell-brick-wipe` only if `brick_wiper` is **absent**
- **ELITE_SPELL_POOL:** none — snap honesty is the elite. Do **not** unlock Far Hood as identity.
- **SIGNATURE_MECHANICS:** Next armed overwatch / Far Watch / Hold Ground snap at the target deals 0, then the mute ends.
- **VARIANT_PROGRESSION:** BASE strike-or-mute → VETERAN skip-if-no-watch → ELITE open-then-mute → CHAMPION one-snap
- **RARITY_CURVE:** Standard. +ELITE in Brick Watch.
- **SYNERGIES:** `brick_wiper`, `stone_castellan`, `shadow_lurker`
- **WEAKNESSES:** Do not walk the snap; Dispel; wait 2
- **PLAYER_COUNTERPLAY:** Walk another file; don’t trigger the snap; kill the Muter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-watch-mute` (ELITE observe). Arm observes; the later 0-damage snap is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (overwatch snap consume-to-zero; Far Watch must exist as a reader)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `full_purser`

- **NAME:** Full Purser
- **ROLE:** assassin (bonus if leftover AP ≥ 3)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `dry_stinger` (leftover **= 0**), `purse_keeper` (**banks** leftover), `empty_plater` (0 leftover → +RES). SDE listed `purse_scribe` / `bone_scribe` as G≥9 extras — those are **not** CORE. ELITE acquisition. SDE Wave 9. At most one leftover-AP-≥3 poke CORE per pack as PAIR vs Dry / Purse / Empty.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 even if leftover ≤ 2 (still kills). Peer: skip if leftover ≤ 2 unless 10 kills. Above: refuse if leftover ≤ 2 and 10 does not kill.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.85, res 0.80, init 1.25, chc 1.05. Identity is **punish hoarding leftover**. If it tops the meter on an empty bar every time, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_leftover_ap_ge_3"`. VETERAN: skip if leftover ≤ 2 unless lethal. ELITE: Act Tax / Loan Tempo partner. CHAMPION: base 10 + 8 fixed; evaluate leftover **before** this card’s own AP debit on the **caster**.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-full-purse`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — leftover-≥3 honesty is the elite. Do **not** unlock Dry Sting as identity.
- **SIGNATURE_MECHANICS:** 10, +8 if target leftover AP ≥ 3 (18 total). Inverse of Dry Sting’s empty-bar lesson.
- **VARIANT_PROGRESSION:** BASE poke → VETERAN skip-if-spent → ELITE fill-then-sting → CHAMPION pre-spend-read
- **RARITY_CURVE:** Standard. +ELITE in Full Kennel.
- **SYNERGIES:** `pet_cutter`, `kennel_siller`, `act_teller`
- **WEAKNESSES:** Spend down to 2; Purse Lock their leftover
- **PLAYER_COUNTERPLAY:** Dump the bar before they poke; don’t sit on 4 leftover
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-full-purse` (ELITE observe). Observe even when leftover is 2 (no bonus).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (integer leftover AP gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pet_cutter`

- **NAME:** Pet Cutter
- **ROLE:** anti-summon (bonus vs player-side summon)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `null_censor` (anti-summon kit), Summon Bane (any `isSummon`), `crown_cutter` (`isLeader`), `leash_cutter` (remaining lifespan → 1). SDE listed `spark_chanter` / `leash_warden` as G≥9 extras — those are **not** CORE. ELITE acquisition. SDE Wave 9. At most one player-side-summon-bonus CORE per pack as PAIR vs those. Reroll if the player has no living summon **and** this pack has no Kennel / Spark that will create one.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 10 even on the primary (still kills). Peer: skip if no player-side summon is in range unless 10 kills. Above: refuse the card on the primary if a pet is in range (never waste the bonus).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.10, sr 0.85, res 0.80, init 1.20, chc 1.00. Identity is **delete the pet**. If it tops the meter on the primary every time, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_player_side_summon"`. VETERAN: skip if no player-side summon in range. ELITE: Kennel Sill partner so the pet cannot leave. CHAMPION: reads `isSummon === true` **and** `side === player` (enemy-cast); Dummy Post is a legal summon; never `spell.name` / `"wolf"`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-pet-cut`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-kennel-sill` only if `kennel_siller` is **absent**
- **ELITE_SPELL_POOL:** none — side+summon honesty is the elite. Do **not** unlock Crown Cut as identity.
- **SIGNATURE_MECHANICS:** 10, +10 if the target is a player-side summon (20 total). Player copy: bonus vs an **enemy-side** summon.
- **VARIANT_PROGRESSION:** BASE poke → VETERAN skip-if-no-pet → ELITE nail-the-kennel → CHAMPION side-read
- **RARITY_CURVE:** Standard. +ELITE in Full Kennel.
- **SYNERGIES:** `full_purser`, `kennel_siller`, `still_leasher`
- **WEAKNESSES:** Dismiss / hide the pet; body-block with the primary
- **PLAYER_COUNTERPLAY:** Don’t leave a whelp in range; Short Leash yourself; kill the Cutter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pet-cut` (ELITE observe). Observe even on a non-summon (no bonus).
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (boolean `isSummon` + `side`)
- **STATUS:** PROPOSED

---

## 5. Live-family amendments (do not steal Wave 11 CORE)

| Live / older id | Amendment | Why |
| :--- | :--- | :--- |
| `pale_cantor` | Do **not** steal `spell-both-mend` / `spell-clash-mend` as CORE | Dual-walk and Struck heals are Both / Clash. Pale stays unconditional. |
| `gait_mender` / `chase_mender` / `shove_mender` | Stay one-flag heals | Both Mend is the **and**. |
| `purse_keeper` | Do **not** steal `spell-stride-keep` as CORE | Leftover **MP** bank is Stride Keeper. Purse stays AP. |
| `quad_prelate` / `triple_span` / `dummy_prelate` | Stay 4 / 3 / 1 occupy | Five-cell is Penta. |
| `cadence_stretcher` / `cadence_staller` | Stay ×2 / +1 | Hostile −1 is Trimmer. Ally −1 is Shaver. |
| `far_hooder` | Do **not** steal `spell-near-hood` as CORE | Melee-band miss is Near Hooder. |
| `quiet_siller` | Do **not** steal `spell-cast-sill` as CORE | Tile-forbid-tools is Cast Siller. |
| `home_stepper` | Do **not** steal `spell-ally-step` as CORE | Inverse dest. |
| `dry_stinger` | Do **not** steal `spell-damp-sting` / `spell-full-purse` as CORE | Leftover **MP ≥ 2** and leftover **AP ≥ 3** are new sentences. |
| `must_spanner` | Do **not** steal `spell-must-step` / `spell-pair-stride` as CORE | Chebyshev 1 and one-walk Manhattan 2 are new sentences. |
| `hold_knight` / `hold_caster` / `first_verser` | Do **not** steal Boot Hold / Tool Hold as CORE | Walk-until-Strike and tool-until-Strike are new sentences. |
| `foe_reeler` / `ally_reeler` / `file_reeler` | Do **not** steal Paint Reel as CORE | Fourth dest flavor. |
| `field_biter` / `wall_biter` | Do **not** steal Nook Bite as CORE | Exactly one block. |
| `gait_wicker` | Do **not** steal Stride Mark as CORE | Cell-scoped leave, not a following unit mark. |
| `split_plater` | Do **not** steal Foe Plate as CORE | Neighbor class is **enemy**. |
| `pit_skipper` | Do **not** steal Lava Skip as CORE | Hazard class is lava. |
| `empty_plater` | Do **not** steal Still Plate as CORE | Wallet is leftover **MP**. |
| `kennel_siller` | Do **not** steal Body Sill as CORE | Target class is **primary**. |
| `axis_locksmith` | May keep Pair Stride as G≥9 extra | CORE owner is `pair_strider`. Extra door stays `pair_gallery`. |
| `cadence_thief` | May keep Cadence Shave as G≥9 extra | CORE owner is `cadence_shaver`. |
| `stride_precentor` | CHAMPION may keep `spell-pack-stride` as SIGNATURE | Never a world-pack CORE. Never owned. |
| `knight_fold_regent` | Kit-only `spell-knight-fold` | Never a world pack. |
| `court_keep_regent` | Kit-only `spell-court-keep` | Never owned. Mass leftover-MP bank. |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| All prior waves | Penta Span joins the stationary-post / multi-cell cap | One multi-cell system. Counts as five. |

---

## 6. Identity matrix (Wave 11 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| both_mender | healAmount gated on both walked, defense | isSummon, inferno-as-identity, one-flag walk-heal as CORE |
| stride_keeper | bank leftover walk MP next turn start, frost, buff | heal, isSummon, leftover-AP bank as CORE, queue splice |
| penta_prelate | isSummon (pentaspan), defense | turret/wolf/archer/bomber/dummy/triple/quad, heal, shard |
| cadence_trimmer | trimRemainingCdDelta, damage (frost), debuff | heal, isSummon, ally-shave as CORE, invent-CD-on-zero |
| near_hooder | near-range consume shield, defense, physical | healAmount, isSummon, far-range hood as CORE, DoT-eat as CORE |
| gait_sipper | steal current MP if walked, frost, debuff | heal, isSummon, soul-sip-as-identity, spell.mpCost |
| cast_siller | tile forbid non-physical, frost, isMark | heal, isSummon, unit tool-hold as CORE, quiet-sill as CORE |
| shove_stinger | force-landing paint damage, physical, debuff | heal, isSummon, walk-enter as CORE, leave-sting as CORE |
| must_stepper | mustWalkChebyshev 1, damage (physical), debuff | heal, isSummon, Manhattan-2 as CORE |
| ally_stepper | relocate ally to caster adj, defense, damage (physical) | isSwap, healAmount, inferno, caster-to-ally as CORE |
| damp_stinger | leftover-MP≥2 bonus, damage (physical) | heal, isSummon, leftover-AP-0 as CORE, leftover-AP≥3 as CORE |
| pair_pacer | pair translate with ally, frost, isMark | isSwap, heal, isSummon, hostile-pair-slide as CORE |
| verse_taxer | lastResolvedId +1 AP, frost, debuff | heal, isSummon, last-id-illegal as CORE, walk-gated tax as CORE |
| tool_holder | forbidNonPhysicalUntilPhysical, physical, frost | heal, isSummon, Strike-until-spell as CORE, tile-sill as CORE |
| spent_lender | grant current MP if ally walked, buff, frost | healAmount, isSummon, unmoved-lend as identity |
| pair_strider | one next walk Manhattan 2, frost, debuff | heal, isSummon, all-remaining-Must-Span as CORE |
| boot_holder | forbidWalkUntilStrike, physical, defense | heal, isSummon, Strike-until-walk as CORE, root-as-CORE |
| near_oather | nextSpellRangeMax 1, frost, isMark | heal, isSummon, unit-oath / ground-oath as CORE |
| paint_reeler | attractTowardNearestPaint, frost, isMark | heal, isSummon, foe-reel / ally-reel / file-reel as CORE |
| nook_biter | exactlyOneAdjBlock bonus, frost, physical | heal, isSummon, open-floor / any-hug as CORE |
| stride_marker | detonateOnWalkLeaveCell, frost, physical | heal, isSummon, unit-gait-wick as CORE, hit-detonate as CORE |
| foe_plater | splitIncomingEnemyPct, defense, physical | heal, isSummon, ally-split / life-tether as CORE |
| lava_skipper | nextWalkIgnoresLava, physical | heal, isSummon, pit-skip as CORE, ghost-step as CORE |
| still_plater | emptyLeftoverMpRes, defense, physical | heal, isSummon, leftover-AP-0 +RES as CORE |
| body_siller | forbidPrimaryLeaveCell, frost | heal, summon-leave as CORE, root-as-CORE |
| clash_mender | healAmount gated on target Struck, defense | isSummon, inferno, walk-heal as CORE, force-move heal as CORE |
| cadence_shaver | shaveAllRemainingCds (ally), frost, buff | heal, isSummon, hostile-trim as CORE |
| gait_taxer | taxNextSpellIfWalked, frost, debuff | heal, isSummon, last-id tax as CORE, spell.mpCost |
| brick_wiper | eraseBarrierAdjacent, frost | heal, isSummon, paint-erase as CORE, brick-slide as CORE |
| watch_muter | nextOverwatchDealsZero, physical, frost | heal, isSummon, far-hood as CORE, last-id mute as CORE |
| full_purser | leftoverApBonusMin 3, physical | heal, isSummon, leftover-0 poke as CORE |
| pet_cutter | playerSideSummonBonus, physical | heal, isSummon-as-caster-identity, leader-bonus as CORE, name `"wolf"` |

Wave 1–10 matrices in those dated docs still apply to those ids.

---

## 7. Role coverage after Wave 11

| Archetype | Wave 1 owner | Wave 11 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | — |
| sniper | glass_sniper | — |
| kiter | tide_shade | lava_skipper, stride_keeper |
| assassin | shadow_lurker | damp_stinger, full_purser |
| healer | pale_cantor | both_mender (both walked), clash_mender (Struck) |
| buffer | hex_chorister | spent_lender, cadence_shaver, stride_keeper |
| debuffer | bone_scribe | gait_sipper, verse_taxer, gait_taxer |
| summoner | brood_chanter | penta_prelate (5-cell post) |
| controller | coil_arbiter | cadence_trimmer, must_stepper, tool_holder, pair_strider, boot_holder, near_oather, body_siller |
| tank | iron_golem | near_hooder, foe_plater, still_plater |
| protector | leash_warden | ally_stepper |
| artillery | storm_caller | nook_biter |
| kamikaze | cinder_martyr | — |
| teleporter | wraith_bishop, blink_cutter | ally_stepper, lava_skipper |
| displacement | rift_hook | pair_pacer, paint_reeler |
| hazard creator | ember_knight, glyph_sower | cast_siller, shove_stinger, stride_marker, brick_wiper |
| status specialist | plague_rat | stride_marker |
| anti-summon | null_censor | pet_cutter |
| anti-ranged | void_mirror, rust_reaver | near_oather, watch_muter, boot_holder |
| anti-melee | leash_warden | near_hooder, must_stepper, body_siller, tool_holder |

Every requested archetype still has a Wave 1 owner. Wave 11 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6 through Wave 10 §8, plus Wave 11 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis.
6. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), `forcedMovedThisTurn`, `lastResolvedSpellId`, **`struckThisTurn`**.
7. `inferSummonArchetype` gains `pentaspan` (and still needs `dummypost` / `triplespan` / `quadspan` from Waves 8–10).
8. Raise or gate `ENEMY_SUMMON_CAP` before Penta Span (and Quad / Triple) can spawn. Live cap 2 makes Penta illegal.
9. Wave 1 kits first (live ids), then later verbs one at a time. Wave 11 slice: both-walk heal → leftover-MP bank next-turn-start → five-cell plus footprint → CD −1 helper → near-hood consume → gait sip → cast sill → shove-sting landing → must-step filter → ally-step relocate → leftover-MP poke → pair-pace translate → last-id tax → tool-hold → spent lend → pair-stride one-walk → boot-hold → near-oath → paint-reel attract → nook-bite → stride-mark cell-leave → foe-plate incoming → lava-skip → still-plate → body-sill → clash-mend → cadence-shave → gait-tax → brick-wipe → watch-mute → full-purse → pet-cut.
10. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 10 and SDE Wave 9, never names.
11. Register text updates only when hooks land.
12. Discovery: family observe must not double-grant MULTI / feat doors (`both-mend`, `stride-keep`, `penta-span`, `cadence-trim`, `pair-stride`).
13. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not splice the turn queue for Stride Keep.

---

## 9. Held for a later wave (no ids reserved here)

These need SPELL_PROPOSALS / SDE to stamp ids first, **or** they stay closed. This run does **not** mint colliding `wave11:` spell ids.

- SDE Wave 10 unique CORE (`spell-inch-stride` … `spell-mid-fold`) — Wave 12 families if they still have no CORE owner
- Same-day SPELL_PROPOSALS Wave 11 (2026-09-28, PR #726) — Wave 12 consumes those (`spell-heave-mend`, `spell-dual-keep`, `spell-sept-span`, `spell-cadence-halve`, `spell-mid-hood`, `spell-ready-sting`, `spell-heave-step`, `spell-drift-sill`, `spell-drift-hold`, `spell-drift-lend`, `spell-drift-sip`, `spell-drift-post`, `spell-heave-bounce`, `spell-must-drift`, `spell-verse-pace`, `spell-court-dual`)
- Mid-RAF splice of the current actor (AGENTS.md)
- Fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders)
- Sixth echo id
- Player-owned Hex of Silence
- Seven-cell occupy (Penta Span is five; Sept Span waits)
- 180° pair hinge (`spell-about-hinge`, never owned)
- Refresh (extend) all remaining CDs **including zeros**
- Pack Tithe / Court Stretch / Court Keep / Pack Stride / Knight Fold / Pack Close / Mid Fold / Court Dual / About Hinge as world-pack CORE
- Facing writer families (still blocked on combat `currentView`)
- Cone `areaShape` **reader** family (Gale / Fan still own the unread hole)

---

## 10. What this run did not do

- No production TypeScript / Motoko / Candid.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, 13 Wave 6, 14 Wave 7, 17 Wave 8, 32 Wave 9, or 32 Wave 10 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `spell-court-keep` / `spell-pack-stride` / `spell-knight-fold` / `spell-court-stretch` / `spell-pack-tithe` / `spell-about-hinge` / `spell-pack-close` / `spell-mid-fold` / `spell-court-dual` world-pack CORE.
- No SDE Wave 10 unique CORE as this pass’s CORE.
- No SPELL_PROPOSALS Wave 11 (`spell-heave-mend` …) as this pass’s CORE.
- No `wave11:` colliding spell ids.
- No restamp of claimed feat / challenge / extra-door keys.

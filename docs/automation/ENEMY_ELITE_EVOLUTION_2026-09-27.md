# Enemy and Elite Evolution Design — Wave 10

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-27  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Tenth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 9 verbs** (`SPELL_PROPOSALS_2026-09-26.md`, open PR #636): heal-if-target-was-force-moved, hostile remaining-CD ×2, 2×2 four-cell occupy, unit mark that detonates on next walk MP, leftover-AP-zero poke, caster step-adjacent-to-ally, must-walk-Manhattan-2, next-hit-from-Chebyshev≥3 → 0, +1 MP to an unmoved ally, occupant cannot Strike, first-leave poke, bank leftover AP to next turn start, next DoT tick → 0, last-resolved-id illegal 1 turn, translate two adjacent hostiles 1. Plus **SDE Wave 8 unique CORE** verbs Wave 9 held (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`, open PR #590) because they still have no CORE owner. Bosses stay on the existing catalog. Court Stretch / Pack Tithe / About Hinge stay **boss / closed-class / ENEMY_ONLY** — not world-pack CORE.

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

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 9

Re-read against `HEAD` `0f5363f` (Merge PR #332 — report-findings orchestration). Wave 9 closed as docs in the 2026-09-26 pass (PR #625). SPELL_PROPOSALS Wave 9 (PR #636) stamped three holes Wave 9 **held** (heal-if-target-was-force-moved; remaining-CD **×2**; four-cell occupy) plus twelve siblings. SDE Wave 9 (PR #646) then stamped a **new** unique catalog (`spell-pair-stride` … `spell-knight-fold`). Stamping a verb onto `pale_cantor` / `iron_golem` as a G≥8 extra is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 9 claim | 2026-09-27 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–9 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Dummy Post counts as **1**. Triple Span still counts as **3**. Quad Span counts as **4** — skip until remaining cap ≥ 4 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile. Shove Mend / Chase Mend **must** live only on healer profiles |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / `twinspan` / `spark` / `triplespan` / `dummypost` / **`quadspan`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6–9 facing families still fail closed until a battle-walk writer exists. Wave 10 adds **zero** facing cards |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 10 CORE rows stay `mpCost: 0`. Step Rebate is `rebateNextWalkMp`, not `spell.mpCost` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Pair Slide is occupancy dests, **not** `isSwap`. Foe Reel is the **third** dest flavor of `applyAttract` (File Reel, then Ally Reel) |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| `forcedMovedThisTurn` | Absent | Wave 10 `shove_mender` fails closed until every push / pull / swap / hinge / pair-slide / conveyor writer sets it. Walk MP must **not** set it |
| `lastResolvedSpellId` | Absent | Wave 10 `last_muter` fails closed until successful AP-spend writes the id |
| Force-move heal / CD ×2 / 2×2 occupy / walk-MP wick / dry leftover poke / home step / must-span / far hood / boot lend / quiet sill / exit sting / purse keep / tick plate / last mute / pair slide | Still absent in live catalog | Wave 10 primary opportunity (SPELL_PROPOSALS Wave 9) |
| Odd Manhattan / spell-until-walk / unit-only next spell / walk −1 MP / pull toward other hostile / erase paint / open-floor bonus / detonate-on-hit / incoming 50/50 / Strike-until-spell / 1-tile pit walk / leftover-0 +RES / summon cannot leave / heal-if-target-walked / +1 all remaining CDs / leader bonus / full-bar −1 AP | Still absent as CORE identities | Wave 10 secondary opportunity (SDE Wave 8 unique CORE) |

**Live families (the only `EnemyFamily` union members besides `default`):**

| Id | Spawn overlay (`FAMILY_STAT_MULTS`) | Live combat identity | Why HP/dmg alone is not a family |
| :--- | :--- | :--- | :--- |
| `wraith_bishop` | hp 0.6 / dmg 1.4 / res 0.1 | Kit is still bishop Frost/Poison | Glass-cannon **numbers**, not a new verb |
| `iron_golem` | hp 2.5 / dmg 0.7 / res 0.75 | Kit is still rook Strike/Iron Skin | Sponge **numbers**; Cast Hold is not CORE here |
| `plague_rat` | hp 0.4 / dmg 0.6 / res 0.05 | Kit is still pawn Strike/Venom | Swarm **numbers**; Ignite is Wave 3 |
| `ember_knight` | hp 1.1 / dmg 1.0 / res 0.3 | Melee apply burn (`WX` 16789–16804) | Only live DoT hook. Echo Wipe is not CORE here |
| `tide_shade` | hp 0.8 / dmg 0.9 / res 0.15 | Melee apply slow (`WX` 16805–16818) | Only live MP-debit hook. Step Rebate is not CORE here |
| `bone_scribe` | hp 0.7 / dmg 0.5 / res 0.1 | Kit is still bishop Frost/Poison | Lore debuffer. Full Bar is not CORE here |
| `void_mirror` | hp 1.0 / dmg 0.8 / res 0.2 | 25% reflect (`castHelpers.ts` 336–337) | Only live reflect. Return Sting is Wave 9 |

The 30% overlay never changes kit, AI profile, or preferred chassis. Wave 10 families exist so those verbs are **sentences**, not extra HP.

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

Same-day SPELL_PROPOSALS Wave 10 may open as a sibling cron. This Wave 10 family pass still consumes **#636** verbs plus leftover **#590** unique CORE. **Wave 11** consumes any 2026-09-27 tactical catalog and any SDE Wave 9 unique CORE that still has no CORE owner. This run does not mint colliding `wave10:` spell ids.

SDE Wave 9 unique CORE (`spell-pair-stride`, `spell-boot-hold`, `spell-near-oath`, `spell-paint-reel`, `spell-nook-bite`, `spell-stride-mark`, `spell-foe-plate`, `spell-lava-skip`, `spell-still-plate`, `spell-body-sill`, `spell-clash-mend`, `spell-cadence-shave`, `spell-gait-tax`, `spell-brick-wipe`, `spell-watch-mute`, `spell-full-purse`, `spell-pet-cut`, `spell-pack-stride`, `spell-knight-fold`) stay **G≥9 extras** on older families this pass. Dedicated families for those verbs wait for Wave 11 if they still have no CORE owner. `spell-late-purse` / `spell-pet-share` stay G≥6 extras. `spell-pack-tithe` / `spell-about-hinge` stay never-owned unless a later boss sheet claims them.

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

**Stationary-post / multi-body cap (extend Wave 9):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain **or** Dummy Post **or** Quad Span in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Dummy Post counts as **one**. Quad Span counts as **four**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, Triple Span, Dummy Post, or Quad Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-/four-cell system cap:** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, a Triple Span chain, **or** a Quad Span 2×2, never two of those. Dummy Post is a **1-cell** post; it fills the stationary-post cap but is **not** a multi-cell system.

**Summon-cap prerequisite (extend Wave 9):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Quad Span is illegal until remaining cap ≥ 4. Dummy Post is legal at remaining ≥ 1. Do not spawn `quad_prelate` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay **and** remaining cap 0.

**Walk-spend prerequisite (extend Wave 9):** Gait Mend / Boot Sting / Must Pace / Ghost Step / Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (and, for Ghost Step, the vacated cell) on the turn actor. Forced-move does **not** increment that field. Home Step / Pair Slide / Knight Slip are relocates — they do **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Force-move prerequisite (new this pass):** Shove Mend fails closed until every push / pull / swap / hinge / pair-slide / conveyor resolver writes `forcedMovedThisTurn` on the moved body. Walk MP and summon-control walks must **not** set it.

**Last-id prerequisite (new this pass):** Last Mute fails closed until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend (including fizzles that spent AP).

**Facing prerequisite (unchanged):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. Shove Face writes facing from this push only. This pass adds **zero** facing cards.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Shove Mend MULTI child `shove_cantor` — first child wins vs `shove_mender` observe. Cadence Stretch MULTI child `stretch_precentor` — first child wins vs `cadence_stretcher` observe. Quad Span MULTI child `span_quad` — first child wins vs `quad_prelate` observe. Purse Keep MULTI child `keep_bursar` — first child wins vs `purse_keeper` observe. Court Stretch stays `court_stretch_regent` kit-only. Odd Stride MULTI child `odd_gallery` — first child wins vs `odd_warder` observe. Crown Cut MULTI child `leader_slayer` — first child wins vs `crown_cutter` observe. Full Bar MULTI child `spell_master` — first child wins vs `full_barer` observe. Do **not** name families after extra doors (`gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `even_gallery`, `file_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`). Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` / `pace_prelate` / `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `hard_1` / `legendary_1`.

---

## 2. Why Wave 10 exists (gaps Waves 1–9 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6. Wave 8 covered SPELL_PROPOSALS Wave 7 + three leftover SDE Wave 6 unique CORE verbs. Wave 9 covered SPELL_PROPOSALS Wave 8 + leftover SDE Wave 7 unique CORE.

SPELL_PROPOSALS Wave 9 (#636) then stamped the holes Wave 9 **held**. A G≥9 extra on `pale_cantor` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 8 unique CORE still had no CORE owner after Wave 9 (Wave 9 held them as G≥8 stamps). Seventeen of those verbs fill holes Wave 9 tactical does not: odd-Manhattan walk, spell-until-walk, unit-only next spell, walk −1 MP, pull toward **other hostile**, erase adjacent paint, open-floor bonus, detonate-on-hit, incoming 50/50 with adj ally, Strike-until-spell, 1-tile pit walk, leftover-0 +RES, summon cannot leave, heal-if-**target**-walked, +1 all remaining CDs, leader bonus, full-bar −1 AP. Pack Tithe and About Hinge stay closed.

| Unused Wave 9 / SDE Wave 8 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-shove-mend` (heal 8 iff target was **force-moved**) | `gait_mender` (caster **walked**); `chase_mender` (this pass, target **walked**); `enter_mender` (tile) | Heal paid in **a body already displaced**. Standing and walking are 0 HP. Extra door is `shove_cantor` — family is **`shove_mender`**. |
| `spell-cadence-stretch` (hostile remaining CDs ×2; 0 stays 0) | `cadence_staller` (this pass, **+1** all remaining); `cadence_cracker` (highest one → 0); `cadence_flusher` (ally all → 0) | Double the lock, do not invent CDs. Extra door is `stretch_precentor` — family is **`cadence_stretcher`**. |
| `spell-quad-span` (2×2 occupy, counts as **four**) | `twin_span` (2 walking); `triple_span` (3); `span_prelate` (rigid 2); `dummy_prelate` (1 HP, 1 cell) | Four tiles, one body, empty kit. Extra door is `span_quad` — family is **`quad_prelate`**. Skip until remaining cap ≥ 4. |
| `spell-gait-wick` (unit mark; next **walk MP** deals 10) | `boot_stinger` (already-walked **now**); `fuse_binder` (tile clock); `cast_marker` (**their** cast); `wound_marker` (this pass, **they take a hit**) | Tax the 2-step they still want. Stand is 0. |
| `spell-dry-sting` (+8 iff leftover AP = 0) | `empty_plater` (this pass, 0 leftover → **+RES**); `post_stinger` (unmoved); `lone_stinger` (isolated **bodies**) | Wait until they spend the last 2, then 20. Purse Keep does **not** empty the bar this turn. |
| `spell-home-step` (caster steps to free Chebyshev-1 of an **ally**) | `hinge_squire` (90° around ally); `hook_chaplain` (pulls **the ally**); `ally_reeler` (pull 1 toward ally); `morrow_walker` (delayed blink) | Join them. Occupying the ring is the counter. Relocate, not `isSwap`. |
| `spell-must-span` (remaining walks this turn must be Manhattan **exactly 2**) | `even_warder` / `odd_warder` (**parity**); `must pace` (walk to **cast**); `diag_locksmith` (diagonal **shape**); `walk_toller` (**+1 MP**) | Make the 1-step peel illegal. |
| `spell-far-hood` (next applied hit from Chebyshev **≥ 3** → 0) | `sidestep_warder` (next hit **any** range); Fog Hood (cuts **LoS range**); `thin_warder` (cap 30) | Walk in to 2, or waste the shot at 4. Does not eat DoT. |
| `spell-boot-lend` (+1 current MP to an **unmoved** ally) | `spare_pacer` (+1 **now**, no gate); `gift_siller` (enter +MP); `walk_toller` (**+1 cost**) | Fund the 2-step they have not taken. Forced-move does not block the lend. |
| `spell-quiet-sill` (occupant cannot resolve Strike / `isPhysical`) | `hold_knight` (Strike illegal until **walk**); `first_verser` (this pass, Strike illegal until a **spell**); `dull_censor` (Strike deals **0**) | The **tile** is spell-only. Step off. |
| `spell-exit-sting` (first **leave** deals 8) | `enter_mender` (enter **heal**); `boon_mason` (leave **+MP**); Exit Tithe (leave **AP**); `glyph_sower` (enter AP) | Tax the peel. Standing does not tick. |
| `spell-purse-keep` (bank leftover AP, cap 3, next **own** turn start, once/battle) | `leftover_lender` (dump to **ally**); `purse_locker` (freeze **theirs**); Timestep (full **now**) | Not a queue splice. Extra door is `keep_bursar` — family is **`purse_keeper`**. |
| `spell-tick-plate` (next **DoT tick** on you is 0) | `thin_warder` / `plate_warden` (**hits**); `ash_absolver` (**strip**); Tick Hood (W7, different) | Eat Inferno’s next 8. Two DoT types still land the other. |
| `spell-last-mute` (their **last resolved id** is illegal 1 turn) | `gait_muter` / Mute Thread (next **any** id); `once_cantor` (echo); Hex of Silence (full bar, unowned) | Ban the Inferno they just showed. Needs `lastResolvedSpellId`. |
| `spell-pair-slide` (translate two adj hostiles 1 along caster→target) | `pair_porter` (**90°** around **their** midpoint); `pawn_broker` (**swap**); `slide_mason` (**conveyor**) | Walk the pair onto paint. Not `isSwap`. |
| `spell-odd-stride` (next walk odd Manhattan) | `even_warder` (even only); `diag_locksmith` (diagonal **shape**); `misstep_herald` (cardinal) | Extra door is `odd_gallery` — family is **`odd_warder`**. Last writer vs Even. |
| `spell-cast-hold` (cannot resolve a **spell** until they walk) | `hold_knight` (cannot **Strike** until walk); `gait_sealer` (cannot **walk**; spells legal); Must Pace (spell fizzles unless walked) | Strike stays legal. Root + Hold is a spell lockout — do not PAIR with `snare_weaver`. |
| `spell-unit-oath` (next spell must target a **unit**) | `ground_oather` (inverse, ground only); Aim Veil (cannot be primary) | Frost legal. Barrier / Open Pit fizzle. Last writer vs Ground Oath. |
| `spell-step-rebate` (next walk **−1 MP**, min 0) | `walk_toller` (**+1**); `spare_pacer` (+1 **now**); `gift_siller` (enter) | Not `spell.mpCost`. Extra door `rebate_nave` is a teach — family is **`rebate_warder`**. |
| `spell-foe-reel` (pull 1 toward nearest **other hostile**) | `ally_reeler` (toward **ally**); `file_reeler` (along file toward **caster**); `hook_chaplain` (pull ally adjacent) | Third `applyAttract` dest flavor. Isolate is the counter. |
| `spell-echo-wipe` (erase adjacent **paint**) | `echo_painter` (**copies**); `ash_absolver` (unit); `brick_shifter` (moves a **barrier**) | Paint erase, not a wall. Extra door `wipe_gallery` is a teach — family is **`echo_wiper`**. |
| `spell-field-bite` (10 + 8 if **0** adj blocking tiles) | `wall_biter` (bonus if **adj block**); `wall_stinger` (hugs a **spell barrier**); `lone_stinger` (0 adj **bodies**) | Fight in the open. Hug a pillar. |
| `spell-wound-mark` (detonates when they **take a hit**) | `cast_marker` (detonate on **their cast**); `body_marker` (next hit **×1.5**); tile Mark | DoT / lava do not consume. Extra door `mark_court` is a teach — family is **`wound_marker`**. |
| `spell-split-plate` (next incoming hit 50/50 with adj ally) | `twin_tether` (ongoing split while Chebyshev ≤ 3); `share_warden` (**outgoing** 50/50); `pain_suture` (redirect whole hit) | Isolate the tank. Missing-ally fail closed. |
| `spell-verse-first` (cannot Strike until a **spell** resolves) | `hold_knight` (Strike illegal until **walk**); Oath Blade (other ids fizzle, Strike **hurts**); `dull_censor` (Strike deals 0) | Cast anything cheap, then Strike. |
| `spell-pit-skip` (next **1-tile** walk treats pit as floor) | `pit_mason` (places the pit); Safe Fall (forced-move skips **hazard ticks**); `ghost_stepper` (occupies vacated cell) | Does not ignore lava / void / barriers. Maps stay solvable for the **player**. |
| `spell-empty-plate` (0 leftover AP → +RES 1.20 / 2) | `dry_stinger` (this pass, 0 leftover **damage**); Planted Stance (0 **walk MP**); `purse_locker` (freeze leftover) | Cast as the last action. Gate is pre-spend leftover. |
| `spell-kennel-sill` (hostile **summons** cannot **leave** the cell) | `pet_siller` (summons cannot **enter**); `still_leasher` (pause lifespan); `leash_cutter` (remaining → 1) | Inverse of Pet Sill. Player body walks freely. |
| `spell-chase-mend` (heal 8 iff **target** walked) | `gait_mender` (**caster** walked); `shove_mender` (this pass, **force-moved**); `pale_cantor` (unconditional) | Healer CORE only. Forced-move does not count. |
| `spell-cadence-stall` (+1 **all** remaining CDs; 0 stays 0; once/battle) | `cadence_stretcher` (this pass, **×2**); `cadence_cracker` (highest one → 0); `cadence_thief` (steal 1) | Extra door `stall_nave` is a teach — family is **`cadence_staller`**. |
| `spell-crown-cut` (12 + 12 if `isLeader`) | `coup_duelist` (instant ≤25%); Summon Bane (`isSummon`); `coil_arbiter` G≥8 extra is **not** CORE | Reads `isLeader`, never `"king"` in the name. Extra door is leftover `leader_slayer`. |
| `spell-full-bar` (next spell −1 AP if 8 equipped / enemy kit ≥ 4) | `tempo_precentor` (next-turn +1 AP); Overcast (range); Hex of Silence (full-bar **lock**, unowned) | Extra door is leftover `spell_master`. Does not write extra bar slots. |

**Do not family (closed / boss / ENEMY_ONLY):** `spell-court-stretch` (`NOT_PLAYER_LEARNABLE`; `court_stretch_regent` kit — same law as Court Hinge on `pair_porter` CHAMPION witness), `spell-pack-tithe` (ENEMY_ONLY; stays `cadence_lender` CHAMPION G≥8 SIGNATURE), `spell-about-hinge` (BOSS_ONLY; `about_hinge_regent` kit — never a world pack). Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face / Must Pace / Court Shove / Court Hinge / Pack Still / File Fold stay where Waves 5–9 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 10 CORE rows are `mpCost: 0`. Step Rebate is a **next-walk MP discount**.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor. Purse Keep’s delay is **their next turn start**.  
Do **not** family a five-cell occupy. Quad Span is the four-cell card.  
Do **not** family heal-if-target-**walked** as a second id — that is Chase Mend (`spell-chase-mend`), already this pass.  
Do **not** family 180° pair hinge (`spell-about-hinge` is SDE Wave 8 never-owned).  
Do **not** family refresh (extend) all of a hostile’s remaining CDs **including zeros** (that would invent locks). Stall is +1 on remaining ≥ 1. Stretch is ×2 on remaining ≥ 1.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 9 unique CORE as this pass’s CORE (`spell-pair-stride` …).  
Do **not** mint `wave10:` colliding spell ids.  
Do **not** name the Shove Mend family `shove_cantor`, the Cadence Stretch family `stretch_precentor`, the Quad Span family `span_quad`, the Purse Keep family `keep_bursar`, the Odd Stride family `odd_gallery`, the Step Rebate family `rebate_nave`, the Echo Wipe family `wipe_gallery`, the Wound Mark family `mark_court`, or the Cadence Stall family `stall_nave`.

---

## 3. Encounter synergy packs (Waves 1–10)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Cap one Dummy Post **or** bait **or** pylon **or** font **or** span **or** Quad Span.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Shove Choir | `shove_mender` + `bash_bruiser` + `pair_slider` | Displace first, then cash the 8 |
| Stretch Mute | `cadence_stretcher` + `last_muter` + `ignite_alchemist` | ×2 Inferno, ban the last id, cash stacks in the window |
| Quad Plug | `quad_prelate` + `quiet_siller` + `exit_stinger` | 2×2 seal, spell-only tile around it, tax the peel. Skip until remaining cap ≥ 4 |
| Wick Span | `gait_wicker` + `must_spanner` + `far_hooder` | Force a 2-step, detonate the wick, waste shots at 4 |
| Dry Keep | `dry_stinger` + `purse_keeper` + `act_teller` | Tax the last 2 AP, bank 3, sting the empty bar |
| Home Quiet | `home_stepper` + `quiet_siller` + `split_cantor` | Step onto the sill, split-mend the clump |
| Boot Chase | `boot_lender` + `chase_mender` + `spare_pacer` | Fund the walk, then cash the **target-walked** heal |
| Exit Slide | `exit_stinger` + `pair_slider` + `fuse_binder` | Paint leave, translate the pair onto fuse |
| Tick Empty | `tick_plater` + `empty_plater` + `plague_rat` | Eat the next Inferno tick, then leftover-0 +RES |
| Odd Rebate | `odd_warder` + `rebate_warder` + `walk_toller` | Odd dest, cheap 1-step, tax the remaining even |
| Hold Verse | `hold_caster` + `first_verser` + `gait_sealer` | Spells illegal until walk; Strike illegal until a spell; feet nailed — COURT, never PAIR with `hold_knight` |
| Unit Pit | `unit_oather` + `pit_skipper` + `origin_mason` | Next spell must be a unit; skipper walks the pit they just forced |
| Foe Wound | `foe_reeler` + `wound_marker` + `split_fanger` | Pull onto a body, detonate on the hit, cash the cluster |
| Wipe Field | `echo_wiper` + `field_biter` + `brick_shifter` | Erase the hug-wall, then cash open-floor |
| Split Kennel | `split_plater` + `kennel_siller` + `still_leasher` | Split the hit onto a pet that cannot leave |
| Crown Bar | `crown_cutter` + `full_barer` + `coil_arbiter` | Leader poke, then −1 AP on a full kit |
| Stall Stretch | `cadence_staller` + `last_muter` + `once_cantor` | +1 remaining, ban the last id, lock recast. Do **not** PAIR Stall with Stretch |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark), Wave 8 packs (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood), and Wave 9 packs (Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog).

Do **not** pack as PAIR (COURT later is fine):

- `shove_mender` + `gait_mender` / `chase_mender` / `pale_cantor` / `enter_mender`
- `cadence_stretcher` + `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender`
- `quad_prelate` + `dummy_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `twin_span` / `triple_span` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `gait_wicker` + `boot_stinger` / `post_stinger` / `wound_marker` / `cast_marker` / `fuse_binder`
- `dry_stinger` + `empty_plater` / `lone_stinger` / `post_stinger`
- `home_stepper` + `hinge_squire` / `hook_chaplain` / `ally_reeler` / `morrow_walker` / `cover_squire`
- `must_spanner` + `even_warder` / `odd_warder` / `diag_locksmith` / `axis_locksmith` / `walk_toller`
- `far_hooder` + `sidestep_warder` / `thin_warder` / `hood_lurker`
- `boot_lender` + `spare_pacer` / `gift_siller` / `tempo_precentor`
- `quiet_siller` + `hold_knight` / `first_verser` / `dull_censor` / `pet_siller` / `kennel_siller`
- `exit_stinger` + `enter_mender` / `boon_mason` / `glyph_sower`
- `purse_keeper` + `leftover_lender` / `purse_locker` / `purse_scribe` / `purse_splitter`
- `tick_plater` + `thin_warder` / `plate_warden` / `ash_absolver` / `morrow_warden`
- `last_muter` + `gait_muter` / `once_cantor` / `hold_caster`
- `pair_slider` + `pair_porter` / `pawn_broker` / `slide_mason` / `hinge_squire`
- `odd_warder` + `even_warder` / `diag_locksmith` / `misstep_herald` / `must_spanner`
- `hold_caster` + `hold_knight` / `gait_sealer` / `snare_weaver`
- `unit_oather` + `ground_oather` / `pit_mason` / `origin_mason`
- `rebate_warder` + `walk_toller` / `tide_shade` / `spare_pacer`
- `foe_reeler` + `ally_reeler` / `file_reeler` / `hook_chaplain` / `sink_chanter`
- `echo_wiper` + `echo_painter` / `ember_knight` / `fuse_binder`
- `field_biter` + `wall_biter` / `wall_stinger` / `lone_stinger`
- `wound_marker` + `cast_marker` / `body_marker` / `glyph_sower`
- `split_plater` + `twin_tether` / `share_warden` / `pain_suture` / `cover_squire`
- `first_verser` + `hold_knight` / `oath_censor` / `dull_censor` / `once_cantor`
- `pit_skipper` + `pit_mason` / `wick_painter` / `ghost_stepper`
- `empty_plater` + `dry_stinger` / `plate_warden` / `tempo_precentor`
- `kennel_siller` + `pet_siller` / `still_leasher` / `leash_cutter` / `null_censor`
- `chase_mender` + `gait_mender` / `shove_mender` / `pale_cantor` / `font_cantor`
- `cadence_staller` + `cadence_thief` / `cadence_cracker` (SDE extras live there)
- `crown_cutter` + `coup_duelist` / `coil_arbiter` as PAIR
- `full_barer` + `tempo_precentor` / `bone_scribe` as PAIR

Do not spawn Quad Plug in a 1-tile closet (needs a free 2×2). Do not spawn Odd Rebate on a map with no legal 1-step. Quad Span and Dummy posts are battle-time — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 10

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/636) (PR #636) unless marked SDE Wave 8 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-0978/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md), PR #590).

---

### ENEMY_ID: `shove_mender`

- **NAME:** Shove Mender
- **ROLE:** healer (heal iff target was force-moved)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** `starter-heal` legal only as ADVANCED. CORE is Shove Mend — `healAmount` forces healer profile until `aiProfile` is explicit. Distinct from `gait_mender` (caster walked), `chase_mender` (target walked), `enter_mender` (tile). Extra door is `shove_cantor` — family is **not** that id. At most one force-move-heal CORE per pack as PAIR vs Gait / Chase.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Mend if missing HP ≥ 12 and no force-move flag. Peer: Shove Mend only if `forcedMovedThisTurn`. Above: refuse if the ally is full or the flag is false (Frost / Shield instead).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **displace first**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_forced_moved"`. VETERAN: skip if flag false **or** missing HP < 8. ELITE: wait for Bash / Pair Slide / Hook. CHAMPION: never shove **only** to enable this if a Strike would kill; 0-heal still spends AP; `challengeHealUsedRef` flips only when HP increased.
- **CORE_SPELL_POOL:** `spell-shove-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-pair-slide` only if `pair_slider` is **absent**
- **ELITE_SPELL_POOL:** none — flag honesty is the elite. Do **not** unlock Gait Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff the target was force-moved this turn. Walk MP does **not** arm. Fails closed without `forcedMovedThisTurn` writers.
- **VARIANT_PROGRESSION:** BASE flag-or-shield → VETERAN skip-if-still → ELITE wait-for-displace → CHAMPION no-shove-to-enable
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE in Shove Choir.
- **SYNERGIES:** `bash_bruiser`, `pair_slider`, `shove_chaplain`, `pawn_broker`
- **WEAKNESSES:** Self Anchor; stay off conveyors; Cursed Wound halves the 8
- **PLAYER_COUNTERPLAY:** Don’t get pushed; Root the cantor; kill the Mender first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shove-mend` (MULTI: family observe **or** `shove_cantor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** MED (`forcedMovedThisTurn` on every force-move resolver)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_stretcher`

- **NAME:** Cadence Stretcher
- **ROLE:** debuffer / controller (hostile remaining CDs ×2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_staller` (+1), `cadence_cracker` (highest one → 0), `cadence_flusher` (ally all → 0). Extra door is `stretch_precentor` — family is **not** that id. At most one remaining-CD-multiply CORE per pack as PAIR vs Stall / Crack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if every remaining is 0. Peer: Stretch if highest remaining ≥ 2. Above: refuse if highest remaining is 1 (Stall is the +1 card) or all 0.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.25, chc 0.80. Identity is **turns they lose**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "stretch_if_highest_remaining_cd_ge_2"`. VETERAN: skip if highest remaining < 2. ELITE: Stretch Inferno / Fuse, then Last Mute partner. CHAMPION: cap stretched remaining at 8; once-per-battle flags are **not** CDs; never invent locks on 0.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-stretch`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-last-mute` only if `last_muter` is **absent**
- **ELITE_SPELL_POOL:** none — ×2 honesty is the elite. Do **not** unlock Cadence Stall as identity.
- **SIGNATURE_MECHANICS:** Remaining ≥ 1 → `×2`, 0 stays 0. Cap 8. Distinct from Court Stretch (mass, never owned).
- **VARIANT_PROGRESSION:** BASE frost-or-stretch → VETERAN skip-if-1 → ELITE stretch-the-nuke → CHAMPION cap-8
- **RARITY_CURVE:** Standard. +ELITE in Stretch Mute.
- **SYNERGIES:** `last_muter`, `ignite_alchemist`, `once_cantor`
- **WEAKNESSES:** Sit on CD-0 ids; Cadence Break / Flush on your side; don’t show a 3-turn lock
- **PLAYER_COUNTERPLAY:** Recast before they Stretch; keep cheap legal ids
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-stretch` (MULTI: family observe **or** `stretch_precentor` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (iterate existing cooldown map)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `quad_prelate`

- **NAME:** Quad Prelate
- **ROLE:** summoner (stationary 2×2 occupy) / tank-lite
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Replaces random overlay on this body. Distinct from `twin_span` / `triple_span` / `span_prelate` / `dummy_prelate`. Extra door is `span_quad` — family is **not** that id. At most one Quad Span per pack. **Skip until remaining `ENEMY_SUMMON_CAP` ≥ 4.** Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: place NW origin if a 2×2 seals a file. Peer: skip if any of the four is blocked **or** remaining cap < 4. Above: place off-axis so Quiet Sill / Exit Sting tax the walk-around.
- **STAT_SCALING_RULE:** hp 1.00, sp 0.70, sr 1.00, res 1.15, init 0.65, chc 0.70. Quad uses existing `getSummonBaseStats` with `damageScale: 0`, shared HP 8. If the Prelate tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** New summon AI `quadspan` (SPELL_PROPOSALS): `ap: 0`, `mp: 0`, **must not path**, **must not cast**, occupies **four** cells as one combatant id. VETERAN: skip if remaining cap < 4. ELITE: Quiet Sill a walk-around cell. CHAMPION: never punch a hole if a later pit lands on one cell — whole quad dies.
- **CORE_SPELL_POOL:** `spell-quad-span`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the quad)
- **RARE_SPELL_POOL:** `spell-quiet-sill` only if `quiet_siller` is **absent**
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / dummy / triple on this body.
- **SIGNATURE_MECHANICS:** NW-origin 2×2. Counts as **four**. Empty kit. 0 XP on quad death. Brick Shift does **not** move occupy cells.
- **VARIANT_PROGRESSION:** BASE wall → VETERAN respect-cap-4 → ELITE sill-the-ring → CHAMPION whole-quad-dies
- **RARITY_CURVE:** Standard. +ELITE on `fortress` / corridor maps. Weight 0 until remaining cap ≥ 4. Weight 0 on cramped 1-tile closets (solvability).
- **SYNERGIES:** `quiet_siller`, `exit_stinger`, `rank_lancer`
- **WEAKNESSES:** Burst the 8 HP; walk around; Swap past; open field
- **PLAYER_COUNTERPLAY:** Sit on the NW cell; Ignite the 8; artillery if LoS is open from a diagonal
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-quad-span` (MULTI: family observe **or** `span_quad` first-win — first child wins). Quad kit is empty — nothing to steal from the post.
- **REWARD_EXPECTATION:** Standard. Quad death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (`summonAI: "quadspan"`; four-cell footprint helper; do not spawn four initiative seats)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `gait_wicker`

- **NAME:** Gait Wicker
- **ROLE:** status specialist / assassin (unit mark detonates on next walk MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `bishop` **without** heal. Distinct from `boot_stinger` (already walked **now**), `fuse_binder` (tile), `cast_marker` (their cast), `wound_marker` (they take a hit). At most one walk-MP-detonate CORE per pack as PAIR vs Boot / Fuse / Cast / Wound.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if target MP = 0. Peer: Gait Wick if target still has walk MP. Above: refuse if already marked **or** MP = 0 (Frost / Strike).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.05, sr 0.85, res 0.80, init 1.20, chc 1.00. Identity is **tax the 2-step**. If it tops the meter without a detonate, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "mark_if_target_still_has_walk_mp"`. VETERAN: skip if MP = 0. ELITE: Must Span partner so they **must** walk. CHAMPION: forced-move / blink / Swap do **not** detonate; strip-able `effectCategory: "debuff"`; fails closed without `walkMpSpentThisTurn`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-gait-wick`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-must-span` only if `must_spanner` is **absent**
- **ELITE_SPELL_POOL:** none — walk-MP honesty is the elite. Do **not** unlock Boot Sting as identity.
- **SIGNATURE_MECHANICS:** Mark 2 of their turns. Next ≥ 1 walk MP deals 10, then consume. Stand is 0.
- **VARIANT_PROGRESSION:** BASE strike-or-mark → VETERAN skip-if-no-MP → ELITE force-the-step → CHAMPION relocate-does-not-tick
- **RARITY_CURVE:** Standard. +ELITE in Wick Span.
- **SYNERGIES:** `must_spanner`, `far_hooder`, `gait_sealer`
- **WEAKNESSES:** Stand; blink off; Cleanse; wait 2 turns
- **PLAYER_COUNTERPLAY:** Don’t walk; Home Step / Swap; Dispel the mark
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-gait-wick` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (unit mark + walk-MP hook)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dry_stinger`

- **NAME:** Dry Stinger
- **ROLE:** assassin (bonus iff leftover AP = 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `empty_plater` (0 leftover → **+RES**), `post_stinger` (unmoved), `lone_stinger` (isolated bodies). At most one leftover-zero-poke CORE per pack as PAIR vs Empty Plate.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: 12 even if leftover ≥ 1 (still kills). Peer: skip if leftover ≥ 2 **unless** 12 kills. Above: refuse the card if leftover ≥ 2 and 12 does not kill (path / Strike).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.85, res 0.80, init 1.25, chc 1.05. Identity is **wait until they spend the last 2**. If it tops the meter on a full bar every time, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "sting_if_target_leftover_ap_zero"`. VETERAN: skip if leftover ≥ 2 unless lethal. ELITE: Act Tax / Drain partner. CHAMPION: evaluate leftover **before** this card’s own AP debit on the **caster**; Purse Keep does **not** empty the bar this turn.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-dry-sting`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` only if `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none — leftover honesty is the elite. Do **not** unlock Empty Plate as identity.
- **SIGNATURE_MECHANICS:** 12, +8 if leftover AP = 0 (20 total). Same damage helper. Gate is boolean.
- **VARIANT_PROGRESSION:** BASE poke → VETERAN skip-if-wet → ELITE empty-then-sting → CHAMPION pre-spend-read
- **RARITY_CURVE:** Standard. +ELITE in Dry Keep.
- **SYNERGIES:** `act_teller`, `purse_keeper`, `hex_teller`
- **WEAKNESSES:** Keep 1 AP; Purse Keep does not help the Stinger this turn
- **PLAYER_COUNTERPLAY:** End turn with 1 leftover; don’t dump the bar into Act Tax
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dry-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (integer read on leftover AP)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `home_stepper`

- **NAME:** Home Stepper
- **ROLE:** teleporter / protector (caster steps adjacent to an ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal. Distinct from `hinge_squire` (90° around ally), `hook_chaplain` (pulls the ally), `ally_reeler` (pull 1 toward ally), `morrow_walker` (delayed blink). Reroll if no ally. Relocate, **not** `isSwap`. At most one home-step CORE per pack as PAIR vs those peelers.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if already Chebyshev-1. Peer: Home Step if a free adj cell **seals or rescues**. Above: skip if already adj **or** no free adj (fizzle).
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 0.90, res 0.90, init 1.15, chc 0.80. Identity is **spend 3 to join them**. If it tops the meter, the kit leaked toward Inferno.
- **AI_TIER_PROGRESSION:** Profile `flanker` / protector. `aiHint: "step_adjacent_to_ally_if_seals_or_rescues"`. VETERAN: skip if already adj or no free cell. ELITE: land onto Quiet Sill / Exit Sting only if the **player** would take it, never if the carry would. CHAMPION: `effectCategory: "relocate"` so Blink Seal / Grounded Lock can filter by field; landing hazards **must tick**; do not call `swapPositions`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-home-step`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-split-mend` only if `split_cantor` is **absent** (healer-first risk — CHAMPION only if `aiProfile` is explicit protector, **not** if healAmount would flip this body to healer at BASE)
- **ELITE_SPELL_POOL:** none — join honesty is the elite. Do **not** unlock Leash Hook as identity.
- **SIGNATURE_MECHANICS:** Move **caster** to a free Chebyshev-1 of the targeted ally. Target does not move. Occupying the ring is the counter.
- **VARIANT_PROGRESSION:** BASE strike-or-join → VETERAN no-fizzle-spend → ELITE land-discipline → CHAMPION relocate-flag
- **RARITY_CURVE:** Standard. +ELITE in Home Quiet. Never CHAMPION in a solo pack.
- **SYNERGIES:** `quiet_siller`, `split_cantor`, `leash_warden`
- **WEAKNESSES:** Occupy all adj cells; Open Pit the only landing; Blink Seal
- **PLAYER_COUNTERPLAY:** Fill the ring; Root does **not** stop this unless Grounded Lock is up; kill the carry anyway with no-LoS
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-home-step` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy dest pick; new flag, not `isSwap`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `must_spanner`

- **NAME:** Must Spanner
- **ROLE:** controller (next walks this turn must be Manhattan 2)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `even_warder` / `odd_warder` (parity), `diag_locksmith` (diagonal shape), `walk_toller` (+1 MP). ELITE acquisition on the spell. At most one must-Manhattan-2 CORE per pack as PAIR vs Even / Odd / Diag.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if target MP < 2. Peer: Must Span if they want a 1-step peel. Above: skip if MP < 2 **and** they are already at desired range.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.85, init 1.15, chc 0.90. Identity is **make the cheap tile illegal**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "must_span_if_target_wants_1_step_peel"`. VETERAN: skip if they will not walk. ELITE: Gait Wick partner. CHAMPION: 1-step and 3-step illegal; 0 walk legal; forced-move any length legal; knight 2-1 jumps are **not** walks.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-must-span`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-gait-wick` only if `gait_wicker` is **absent**
- **ELITE_SPELL_POOL:** none — exact-2 honesty is the elite. Do **not** unlock Even Stride as identity.
- **SIGNATURE_MECHANICS:** Rest of their **current turn**. Every walk started must be Manhattan exactly 2.
- **VARIANT_PROGRESSION:** BASE strike-or-span → VETERAN skip-if-no-walk → ELITE wick-the-2-step → CHAMPION relocate-legal
- **RARITY_CURVE:** Standard. +ELITE in Wick Span.
- **SYNERGIES:** `gait_wicker`, `far_hooder`, `pit_mason`
- **WEAKNESSES:** Stand; blink / Home Step / Swap; Spare Pace does not help a 1-step
- **PLAYER_COUNTERPLAY:** Don’t walk; take a legal 2-step onto a safe cell; wait the turn out
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-must-span` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-dest filter on existing pathing)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `far_hooder`

- **NAME:** Far Hooder
- **ROLE:** tank / anti-ranged (next hit from Chebyshev ≥ 3 is 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal (`healAmount` would flip healer-first). Distinct from `sidestep_warder` (any range), Fog Hood (cuts LoS range), `thin_warder` (cap 30). ELITE acquisition on the spell. At most one far-range-zero CORE per pack as PAIR vs Sidestep / Thin.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if a hostile is already Chebyshev ≤ 2. Peer: Far Hood if nearest hostile ≥ 3. Above: skip if someone is already at 2.
- **STAT_SCALING_RULE:** hp 1.10, sp 0.85, sr 1.10, res 1.05, init 0.90, chc 0.75. Identity is **walk in to 2**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "hood_if_nearest_hostile_cheb_ge_3"`. VETERAN: skip if already ≤ 2. ELITE: Gait Seal / Must Span so they cannot close. CHAMPION: consume on incoming-hit pipeline **before** HP write; hits from 1–2 land and **do not** consume; DoTs are Tick Plate’s job; bounce hops use the **bouncer’s** cell.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-far-hood`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-gait-seal` only if `gait_sealer` is **absent**
- **ELITE_SPELL_POOL:** none — range-gate honesty is the elite. Do **not** unlock Sidestep as identity.
- **SIGNATURE_MECHANICS:** Next applied damaging hit from Chebyshev ≥ 3 deals 0, then consume. Until consume or 2 of your turns.
- **VARIANT_PROGRESSION:** BASE frost-or-hood → VETERAN skip-if-close → ELITE nail-feet → CHAMPION bounce-honesty
- **RARITY_CURVE:** Standard. +ELITE in Wick Span.
- **SYNERGIES:** `must_spanner`, `gait_sealer`, `snare_weaver`
- **WEAKNESSES:** Walk to 2 then Strike; Swap into melee; two small hits after they consume
- **PLAYER_COUNTERPLAY:** Close; don’t snipe at 4; Poison (DoT is not the next hit)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-far-hood` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (incoming-hit gate with Chebyshev; do not edit `combatMath.ts`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `boot_lender`

- **NAME:** Boot Lender
- **ROLE:** buffer (+1 current MP to an unmoved ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `spare_pacer` (no gate), `gift_siller` (enter +MP), `tempo_precentor` (next-turn AP). Reroll if no ally. At most one unmoved-MP-gift CORE per pack as PAIR vs Spare / Gift.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the ally already walked. Peer: Boot Lend if `walkMpSpentThisTurn` is 0 **and** they need a 2-step. Above: skip if they are at max MP **or** already walked.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.80, sr 0.90, res 0.80, init 1.30, chc 0.75. Init is high so the gift lands **before** the ally walks. If this unit tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer` (ally-first). `aiHint: "lend_mp_if_ally_unmoved_and_needs_2_step"`. Until that profile exists, do **not** put `starter-heal` on this kit. VETERAN: skip if already walked or at max MP. ELITE: gift the body that has Gait Mend / Chase Mend in kit. CHAMPION: forced-move does **not** set walk-spend — a shoved ally can still receive the lend; do not write max MP.
- **CORE_SPELL_POOL:** `spell-boot-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-gait-mend` only if `gait_mender` is **absent** (healer-first risk — skip unless `aiProfile` is explicit buffer and the id is on the **ally**, not this CORE)
- **ELITE_SPELL_POOL:** none — unmoved honesty is the elite. Do **not** unlock Spare Pace as identity.
- **SIGNATURE_MECHANICS:** +1 current MP this turn if the target has not spent walk MP. Cap at max MP. Fizzle if they already walked.
- **VARIANT_PROGRESSION:** BASE frost-or-lend → VETERAN skip-if-moved → ELITE fund-the-heal-walk → CHAMPION shove-does-not-block
- **RARITY_CURVE:** Standard. +VETERAN in Boot Chase.
- **SYNERGIES:** `chase_mender`, `gait_mender`, `spare_pacer` (COURT)
- **WEAKNESSES:** Force them to walk first; isolated 1v1; Drain the gifted body
- **PLAYER_COUNTERPLAY:** Pair Slide the ally before the lend; kill the Lender; Root after they receive it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-boot-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (boolean + current-MP add; needs `walkMpSpentThisTurn`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `quiet_siller`

- **NAME:** Quiet Siller
- **ROLE:** hazard creator / anti-melee (occupant cannot resolve Strike)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `hold_knight` (unit, until walk), `first_verser` (unit, until a spell), `dull_censor` (Strike deals 0), `pet_siller` / `kennel_siller` (summon enter/leave). At most one Strike-forbid-**tile** CORE per pack as PAIR vs those unit holds.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the cell is empty and no hostile can reach it. Peer: paint the melee tile they want. Above: skip empty cells no one will stand on.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.00, res 0.95, init 1.00, chc 0.80. Identity is **the tile is spell-only**. 0 HP on the paint. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster` / setter. `aiHint: "paint_quiet_sill_on_melee_tile"`. VETERAN: skip if empty and unreachable. ELITE: Goad / Dummy / Home Step partner onto it. CHAMPION: filter by `isPhysical` / id `physical_attack`, **never** by name `"Strike"`; Attack Nearest from this cell must refuse; walk on/off is legal.
- **CORE_SPELL_POOL:** `spell-quiet-sill`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — tile honesty is the elite. Do **not** unlock Strike Hold as identity.
- **SIGNATURE_MECHANICS:** Paint 2 turns. Occupant cannot resolve physical Strike. Spells with `isPhysical` false stay legal.
- **VARIANT_PROGRESSION:** BASE paint-melee-tile → VETERAN skip-if-unreachable → ELITE force-onto-it → CHAMPION isPhysical-gate
- **RARITY_CURVE:** Standard. +ELITE in Home Quiet / Quad Plug.
- **SYNERGIES:** `goad_herald`, `dummy_prelate`, `home_stepper`, `quad_prelate`
- **WEAKNESSES:** Step off; Frost from the cell; Brick Shift does not move paint
- **PLAYER_COUNTERPLAY:** Leave the cell; cast a non-physical id; don’t let Goad park you on it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-quiet-sill` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile paint + cast-from-cell filter)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `exit_stinger`

- **NAME:** Exit Stinger
- **ROLE:** hazard creator (first leave deals 8)
- **BASE_ELIGIBILITY:** New family; preferred chassis `pawn` or `rook`. Distinct from `enter_mender` (enter heal), `boon_mason` (leave +MP), `glyph_sower` (enter AP). At most one leave-damage CORE per pack as PAIR vs Enter Mend / Exit Boon.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint under the player if they occupy a cell. Peer: paint the peel tile they will leave. Above: skip empty cells no one will leave.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.85, init 1.05, chc 0.90. Identity is **tax the peel**. Standing is 0. If it tops the meter on paint-turn, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster` / setter. `aiHint: "paint_exit_sting_on_occupied_or_peel_tile"`. VETERAN: skip empty. ELITE: Pair Slide / Goad onto it. CHAMPION: first leave (walk **or** force-move / Swap / Home Step off) deals 8 then consume; enter does **not** tick; death on the cell is not a leave; Safe Fall does **not** skip paint.
- **CORE_SPELL_POOL:** `spell-exit-sting`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-pair-slide` only if `pair_slider` is **absent**
- **ELITE_SPELL_POOL:** none — leave honesty is the elite. Do **not** unlock Enter Mend as identity.
- **SIGNATURE_MECHANICS:** Paint 2 turns or until first leave. 8 through existing damage helper.
- **VARIANT_PROGRESSION:** BASE paint-feet → VETERAN skip-empty → ELITE slide-onto-it → CHAMPION relocate-is-leave
- **RARITY_CURVE:** Standard. +ELITE in Exit Slide.
- **SYNERGIES:** `pair_slider`, `fuse_binder`, `goad_herald`
- **WEAKNESSES:** Never enter; blink from an adjacent cell; wait 2 turns
- **PLAYER_COUNTERPLAY:** Don’t occupy it; Barrier replace; burst the Stinger
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-exit-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (leave hook on walk + force-move)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `purse_keeper`

- **NAME:** Purse Keeper
- **ROLE:** buffer (bank leftover AP to next turn start)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Distinct from `leftover_lender` (dump to ally), `purse_locker` (freeze theirs), Timestep (full now). Extra door is `keep_bursar` — family is **not** that id. At most one leftover-bank CORE per pack as PAIR vs Lend / Lock. Once/battle.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover after the 1-cost would be 0. Peer: Keep if leftover ≥ 2 **and** next card costs 4+. Above: skip if already used this battle.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **bank 3 for Inferno next turn**. If it tops the meter, the kit leaked. Do **not** splice the queue.
- **AI_TIER_PROGRESSION:** Profile `buffer`. `aiHint: "keep_if_leftover_ge_2_and_next_card_costs_4"`. VETERAN: skip if leftover after 1-cost is 0. ELITE: Stretch a hostile Inferno **this** turn, Keep, recast yours next. CHAMPION: pays at **next own turn start**; snapshot leftover **before** Late Purse / Pack Tithe burn; death discards the bank; Dry Sting does **not** see 0 leftover while armed this turn.
- **CORE_SPELL_POOL:** `spell-purse-keep`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-inferno` (zone ≥ 2 analog via relative band, not NaN kit zone), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-cadence-stretch` only if `cadence_stretcher` is **absent**
- **ELITE_SPELL_POOL:** none — next-turn-start honesty is the elite. Do **not** unlock Leftover Lend as identity.
- **SIGNATURE_MECHANICS:** Once/battle. Cap 3. Not mid-RAF. Not Timestep.
- **VARIANT_PROGRESSION:** BASE frost-or-keep → VETERAN skip-if-empty → ELITE stretch-then-bank → CHAMPION snapshot-order
- **RARITY_CURVE:** Standard. +ELITE in Dry Keep.
- **SYNERGIES:** `cadence_stretcher`, `dry_stinger`, `act_teller`
- **WEAKNESSES:** Kill them before next turn; Hex Toll the recast; Stretch **their** Inferno
- **PLAYER_COUNTERPLAY:** Burst the Keeper; don’t let them end with 3 leftover
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-purse-keep` (MULTI: family observe **or** `keep_bursar` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (once/battle + next-turn-start writer; **not** a queue splice)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tick_plater`

- **NAME:** Tick Plater
- **ROLE:** tank (next DoT tick on you is 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `thin_warder` / `plate_warden` (hits), `ash_absolver` (strip), Tick Hood (W7). At most one next-tick-zero CORE per pack as PAIR vs Thin / Plate / Absolve.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no DoT on self. Peer: Tick Plate if own next tick ≥ 8. Above: skip if no DoT.
- **STAT_SCALING_RULE:** hp 1.25, sp 0.75, sr 1.15, res 1.15, init 0.80, chc 0.70. Identity is **eat Inferno’s next 8**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "plate_if_own_dot_tick_ge_8_this_round"`. VETERAN: skip if no DoT. ELITE: wait until Inferno / Poison lands, then plate. CHAMPION: consume in `engine/dotStacks.ts`, not `dealDamage`; a 0-tick still decrements duration; two DoT types — this eats **one** tick.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-tick-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-absolve` only if `ash_absolver` is **absent**
- **ELITE_SPELL_POOL:** none — one-tick honesty is the elite. Do **not** unlock Thin Ward as identity.
- **SIGNATURE_MECHANICS:** Next DoT stack tick that would apply HP loss deals 0, then consume. Direct hits unaffected.
- **VARIANT_PROGRESSION:** BASE strike-or-plate → VETERAN skip-if-clean → ELITE wait-for-inferno → CHAMPION one-stack-honesty
- **RARITY_CURVE:** Standard. +ELITE in Tick Empty. +ELITE on `plague_zone`.
- **SYNERGIES:** `empty_plater`, `plague_rat`, `ignite_alchemist` (COURT — they want ticks, this eats one)
- **WEAKNESSES:** Two DoT types; Ignite cash-in; wait 2 turns
- **PLAYER_COUNTERPLAY:** Poison + Inferno; don’t dump one DoT into the plate
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tick-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (one consume in the tick loop)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `last_muter`

- **NAME:** Last Muter
- **ROLE:** debuffer / controller (last resolved id illegal 1 turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `gait_muter` / Mute Thread (next **any** id), `once_cantor` (echo), Hex of Silence (full bar, unowned). At most one last-id-ban CORE per pack as PAIR vs Mute / Once. Fails closed without `lastResolvedSpellId`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no last id. Peer: Last Mute if last id is heavy (Inferno / Fuse / 4+ AP). Above: skip if last id is Strike **and** they still have Frost.
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.85, res 0.75, init 1.20, chc 0.85. Identity is **ban the Inferno they just showed**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "mute_if_last_id_is_heavy"`. VETERAN: skip if no last id or last is Strike with Frost still legal. ELITE: Stretch that same id, then mute. CHAMPION: observation is the mute **cast**, not the later refuse; Strike is illegal **only if** `physical_attack` was that last id.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-last-mute`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-cadence-stretch` only if `cadence_stretcher` is **absent**
- **ELITE_SPELL_POOL:** none — last-id honesty is the elite. Do **not** unlock Mute Thread as identity.
- **SIGNATURE_MECHANICS:** 1 of their turns. Cast refuses, no AP. Fizzle if they have never resolved an id.
- **VARIANT_PROGRESSION:** BASE frost-or-mute → VETERAN skip-if-strike → ELITE stretch-then-mute → CHAMPION observe-is-cast
- **RARITY_CURVE:** Standard. +ELITE in Stretch Mute.
- **SYNERGIES:** `cadence_stretcher`, `once_cantor`, `ignite_alchemist`
- **WEAKNESSES:** Cast a cheap legal id last (Strike) so mute bans Strike; never cast (fizzle)
- **PLAYER_COUNTERPLAY:** Show Strike last; wait 1 turn; don’t Inferno into a visible Muter
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-last-mute` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`lastResolvedSpellId` writer + cast gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pair_slider`

- **NAME:** Pair Slider
- **ROLE:** displacement specialist (translate two adj hostiles 1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `king` **without** heal. Distinct from `pair_porter` (90° around **their** midpoint), `pawn_broker` (swap), `slide_mason` (conveyor). At most one pair-translate CORE per pack as PAIR vs Hinge / Trade. Not `isSwap`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if pack size < 2. Peer: Pair Slide if both dests are free **and** land on paint / off a file. Above: skip if isolated or either dest blocked (whole card fizzles).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **walk the pair onto paint**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "slide_two_hostiles_if_adj_onto_paint_or_off_file"`. VETERAN: skip if < 2 bodies or dests blocked. ELITE: dest = Exit Sting / Fuse / Quiet Sill / Cinder. CHAMPION: both dests must be free after vacating; diagonal caster→target with a blocked dest fizzles (no partial); landing hazards **must tick**; Shove Mend **does** arm; Gait Wick does **not** detonate.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pair-slide`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-exit-sting` only if `exit_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — translate honesty is the elite. Do **not** unlock Pair Hinge as identity.
- **SIGNATURE_MECHANICS:** Target one hostile; nearest other at Chebyshev 1; both move 1 along caster→target. Caster stays.
- **VARIANT_PROGRESSION:** BASE frost-or-slide → VETERAN skip-if-blocked → ELITE onto-paint → CHAMPION no-partial
- **RARITY_CURVE:** Standard. +ELITE in Exit Slide / Shove Choir.
- **SYNERGIES:** `exit_stinger`, `fuse_binder`, `shove_mender`, `quiet_siller`
- **WEAKNESSES:** Isolate; Self Anchor; stay Chebyshev ≥ 2 from every ally
- **PLAYER_COUNTERPLAY:** Split; occupy dests; don’t clump
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pair-slide` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy pair translate; new flag, not `isSwap`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `odd_warder`

- **NAME:** Odd Warder
- **ROLE:** controller (next walk odd Manhattan)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `even_warder` (even), `diag_locksmith` (diagonal shape), `misstep_herald` (cardinal), `must_spanner` (exactly 2). Extra door is `odd_gallery` — family is **not** that id. At most one odd-parity CORE per pack as PAIR vs Even / Diag. Last writer on the walk-parity flag.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if rooted or MP = 0. Peer: Odd Stride if they want a 2-step. Above: skip if they cannot walk.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.95, res 0.80, init 1.10, chc 0.80. Identity is **a 2-step is illegal**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "force_odd_manhattan_walk"`. VETERAN: skip if rooted or MP = 0. ELITE: Rank Lock so the legal 1-step is off-axis. CHAMPION: (1,1) diagonal is even (2) and **illegal**; confirm fails closed, MP not spent; teleport / Swap / shove do not pay.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-odd-stride`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-rank-lock` only if `axis_locksmith` is **absent**
- **RARE_SPELL_POOL:** `spell-walk-toll` only if `walk_toller` is **absent**
- **ELITE_SPELL_POOL:** none — odd honesty is the elite. Do **not** unlock Even Stride as identity.
- **SIGNATURE_MECHANICS:** Next walk Manhattan odd `{1,3,5,…}`. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-odd → VETERAN skip-if-no-walk → ELITE lock-the-1-step → CHAMPION diag-is-even
- **RARITY_CURVE:** Standard. +ELITE in Odd Rebate. +ELITE if `odd_gallery` is the announced teach (family is the verb; do not restamp the door).
- **SYNERGIES:** `rebate_warder`, `walk_toller`, `axis_locksmith` (COURT)
- **WEAKNESSES:** Walk 1; Haste; blink; wait
- **PLAYER_COUNTERPLAY:** Take the legal 1-step; don’t combine with Even on the same body
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-odd-stride` (MULTI: family observe **or** `odd_gallery` victory — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk-parity flag; last writer vs Even)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hold_caster`

- **NAME:** Hold Caster
- **ROLE:** anti-ranged / controller (cannot resolve a spell until they walk)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `pawn`. Distinct from `hold_knight` (cannot **Strike** until walk), `gait_sealer` (cannot **walk**; spells legal), Must Pace (spell fizzles unless walked). At most one spell-until-walk CORE per pack as PAIR vs Strike Hold / Gait Seal. Do **not** PAIR with `snare_weaver` (Hold + Root is a full spell lockout).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they already walked or only have Strike. Peer: Cast Hold if they have a non-Strike spell and have not walked. Above: skip if they already walked.
- **STAT_SCALING_RULE:** hp 1.05, sp 0.80, sr 1.00, res 1.05, init 1.05, chc 0.80. Identity is **Strike stays legal**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_spell_until_walk"`. VETERAN: skip if already walked or Strike-only. ELITE: do **not** also Root the same body. CHAMPION: forced-move does **not** clear the hold; 1 turn; needs `walkMpSpentThisTurn`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-cast-hold`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-slow` (not Root as CORE)
- **ELITE_SPELL_POOL:** none — Strike-legal honesty is the elite. Do **not** unlock Strike Hold as identity.
- **SIGNATURE_MECHANICS:** Non-Strike spells refuse until ≥ 1 walk MP this turn. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-hold → VETERAN skip-if-walked → ELITE no-root-stack → CHAMPION shove-does-not-clear
- **RARITY_CURVE:** Standard. +ELITE in Hold Verse (COURT with `first_verser` / `gait_sealer`, never PAIR with `hold_knight`).
- **SYNERGIES:** `first_verser`, `gait_sealer` (COURT), `far_hooder`
- **WEAKNESSES:** Walk 1 then nuke; Strike through it; Dispel
- **PLAYER_COUNTERPLAY:** Take the 1-step; melee; don’t Root yourself into it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cast-hold` (ENEMY_DISCOVERY). SDE extras on `plate_warden` / `iron_golem` are **not** CORE.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (cast gate + walk-spend)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `unit_oather`

- **NAME:** Unit Oather
- **ROLE:** controller (next spell must target a unit)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `ground_oather` (inverse). Last writer vs Ground Oath. At most one unit-only-next-spell CORE per pack as PAIR vs Ground. SDE extras on `pit_mason` / `origin_mason` are **not** CORE.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no ground id. Peer: Unit Oath if they are holding Barrier / Pit / paint. Above: skip if they have no ground id.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.90, res 0.80, init 1.10, chc 0.85. Identity is **Barrier fizzles**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "next_spell_unit_only"`. VETERAN: skip if they have no ground id. ELITE: Cinder / Open Pit in their hand become dead. CHAMPION: `targetType` in `{enemy, ally, self}` confirms; ground / freeCells / line-paint fail closed, AP not spent; Strike remains legal.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-unit-oath`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-open-pit` only if `pit_mason` is **absent**
- **ELITE_SPELL_POOL:** none — unit-only honesty is the elite. Do **not** unlock Ground Oath as identity.
- **SIGNATURE_MECHANICS:** 1 turn. Next spell must target a unit. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-oath → VETERAN skip-if-no-ground → ELITE brick-their-paint → CHAMPION targetType-gate
- **RARITY_CURVE:** Standard. +ELITE in Unit Pit.
- **SYNERGIES:** `pit_skipper`, `origin_mason` (COURT), `echo_wiper`
- **WEAKNESSES:** Strike / Frost / self buffs; wait 1 turn; Dispel
- **PLAYER_COUNTERPLAY:** Hit a body; don’t paint this fight
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-unit-oath` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (next-spell `targetType` gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `rebate_warder`

- **NAME:** Rebate Warder
- **ROLE:** kiter (next walk −1 MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `bishop` **without** heal. Distinct from `walk_toller` (+1 on **them**), `spare_pacer` (+1 now), `gift_siller` (enter). Extra door `rebate_nave` is a teach — family is **not** that id. SDE extras on `tide_shade` / `recoil_squire` are **not** CORE. At most one next-walk-discount CORE per pack as PAIR vs Toll / Spare.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if already adjacent. Peer: Rebate then walk ≥ 1. Above: skip if MP is 0 and they will not walk.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.85, res 0.80, init 1.25, chc 0.95. Identity is **the cheap 1-step**. If it tops the meter without walking, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker` / kiter. `aiHint: "rebate_next_walk_mp"`. VETERAN: skip if already adj and Strike is better. ELITE: Odd Stride partner so the cheap step is the legal odd dest. CHAMPION: not `spell.mpCost`; forced-move does not consume; min 0; one walk.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-step-rebate`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `starter-frost`
- **RARE_SPELL_POOL:** `spell-odd-stride` only if `odd_warder` is **absent**
- **ELITE_SPELL_POOL:** none — one-walk honesty is the elite. Do **not** unlock Walk Toll as identity.
- **SIGNATURE_MECHANICS:** Next walk this turn costs 1 less MP. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-rebate → VETERAN skip-if-adj → ELITE odd-cheap-step → CHAMPION not-mpCost
- **RARITY_CURVE:** Standard. +ELITE in Odd Rebate.
- **SYNERGIES:** `odd_warder`, `boot_stinger`, `tide_shade` (COURT)
- **WEAKNESSES:** Root / Gait Seal; make them Strike instead
- **PLAYER_COUNTERPLAY:** Nail feet; don’t let Rebate + Spare + Exit Boon stack three extra tiles in COURT
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-step-rebate` (ENEMY_DISCOVERY). `rebate_nave` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (next-walk MP discount; needs walk-spend)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `foe_reeler`

- **NAME:** Foe Reeler
- **ROLE:** displacement specialist (pull 1 toward nearest other hostile)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `ally_reeler` (toward **ally**), `file_reeler` (along file toward **caster**), `hook_chaplain` (pull ally adjacent), `sink_chanter` (tile). Third `applyAttract` dest flavor. SDE extras on `hook_chaplain` / `file_reeler` are **not** CORE. At most one toward-other-hostile CORE per pack as PAIR vs Ally / File.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no second hostile. Peer: Foe Reel if the step lands on paint / into a cluster. Above: skip if isolated or the step is blocked.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.00, sr 0.90, res 0.80, init 1.15, chc 0.80. Identity is **cluster them**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "attract_toward_nearest_hostile"`. VETERAN: skip if no second body or dest blocked. ELITE: dest = Wound Mark follow-up / Split Fang / Inferno. CHAMPION: attractor is the **other hostile’s cell**, not self; AP spent on blocked slide; do not call until File Reel / Ally Reel helpers exist (reuse dest flavor).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-foe-reel`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-wound-mark` only if `wound_marker` is **absent**
- **ELITE_SPELL_POOL:** none — other-hostile honesty is the elite. Do **not** unlock Ally Reel as identity.
- **SIGNATURE_MECHANICS:** Attract 1 toward nearest living hostile-to-the-target that is not the caster. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-reel → VETERAN skip-if-isolated → ELITE onto-cluster → CHAMPION dest-is-body
- **RARITY_CURVE:** Standard. +ELITE in Foe Wound.
- **SYNERGIES:** `wound_marker`, `split_fanger`, `ignite_alchemist`
- **WEAKNESSES:** Isolate; occupy the toward-tile; Barrier
- **PLAYER_COUNTERPLAY:** Split summons; don’t stand Chebyshev-1 from the Wisp
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-foe-reel` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (third `applyAttract` dest flavor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `echo_wiper`

- **NAME:** Echo Wiper
- **ROLE:** hazard creator / controller (erase adjacent paint)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `echo_painter` (copies), `ash_absolver` (unit), `brick_shifter` (moves a **barrier**). Extra door `wipe_gallery` is a teach — family is **not** that id. SDE extras on `ember_knight` / `fuse_binder` are **not** CORE. At most one paint-erase CORE per pack as PAIR vs Paint.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no paint. Peer: Echo Wipe the cell the player stands on or must enter. Above: skip if no paint (fizzle).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 1.00, res 0.80, init 1.10, chc 0.80. Identity is **erase the safe tile**. 0 damage. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "erase_last_paint_adjacent"`. VETERAN: skip if no paint. ELITE: wipe Mend Wick (delayed heal) or the only Cinder path. CHAMPION: one cell; last-writer paint table; maps stay solvable (paint erase, not a wall); empty wipe still observes.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-echo-wipe`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-field-bite` only if `field_biter` is **absent**
- **ELITE_SPELL_POOL:** none — erase honesty is the elite. Do **not** unlock Echo Paint as identity.
- **SIGNATURE_MECHANICS:** Erase one adjacent painted hazard (cinder / rime / mire / fuse / wick / glyph). SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-wipe → VETERAN skip-if-clean → ELITE wipe-the-heal-pad → CHAMPION one-cell
- **RARITY_CURVE:** Standard. +ELITE in Wipe Field.
- **SYNERGIES:** `field_biter`, `brick_shifter`, `unit_oather`
- **WEAKNESSES:** Don’t stand on paint; re-paint after; Barrier the cell
- **PLAYER_COUNTERPLAY:** Fight off paint; don’t let them erase the only safe Cinder
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-echo-wipe` (ENEMY_DISCOVERY). `wipe_gallery` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (paint table erase)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `field_biter`

- **NAME:** Field Biter
- **ROLE:** artillery / anti-melee inverse (bonus if **no** adjacent block)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `bishop` **without** heal. Distinct from `wall_biter` (bonus if **adj block**), `wall_stinger` (hugs a **spell barrier**), `lone_stinger` (0 adj **bodies**). SDE extras on `glass_sniper` / `rust_reaver` are **not** CORE. At most one open-floor-bonus CORE per pack as PAIR vs Wall Bite.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they hug a wall and 10 still matters. Peer: Field Bite if 0 adj blocking tiles. Above: skip if they hug a wall and Wall Bite would be the right card (it is not in this CORE).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.10, sr 0.85, res 0.80, init 1.10, chc 1.00. Identity is **fight in the open**. If it always deals 18 in a corridor, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `charger` / caster. `aiHint: "bonus_if_open_floor"`. VETERAN: skip if they hug a blocking tile. ELITE: Brick Shift / Echo Wipe to pull the hug-wall off them. CHAMPION: extra 8 is a second `dealDamage`; Barrier / wall / pit occupancy / span post count as blocking; Echo Wipe is **not** a block.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-field-bite`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-brick-shift` only if `brick_shifter` is **absent**
- **ELITE_SPELL_POOL:** none — open-floor honesty is the elite. Do **not** unlock Wall Bite as identity.
- **SIGNATURE_MECHANICS:** 10, +8 if 0 Chebyshev-1 blocking tiles. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-bite → VETERAN skip-if-hug → ELITE un-hug → CHAMPION blocksWalk-scan
- **RARITY_CURVE:** Standard. +ELITE in Wipe Field. Weight ×1.5 on open `chessboard` / plains; weight 0.5 on corridor mazes.
- **SYNERGIES:** `echo_wiper`, `brick_shifter`, `rust_reaver` (COURT)
- **WEAKNESSES:** Hug a Barrier / pit / span; stand in a corner
- **PLAYER_COUNTERPLAY:** Fight on a wall; don’t let Brick Shift peel your pillar
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-field-bite` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (Chebyshev scan of blocking tiles)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wound_marker`

- **NAME:** Wound Marker
- **ROLE:** debuffer (mark detonates when they take a hit)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cast_marker` (their **cast**), `body_marker` (next hit **×1.5**), tile Mark. Extra door `mark_court` is a teach — family is **not** that id. SDE extras on `hex_chorister` / `fuse_binder` are **not** CORE. At most one detonate-on-hit CORE per pack as PAIR vs Cast / Body.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no follow-up hit this round. Peer: Wound Mark then have an ally Strike. Above: skip if no follow-up.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.05, sr 0.85, res 0.75, init 1.15, chc 0.95. Identity is **arm then poke**. If it tops the meter without a detonate, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "detonate_on_hit"`. VETERAN: skip if no ally poke. ELITE: Foe Reel then pawn Strike. CHAMPION: next damaging **hit** (Strike or spell) deals 10 second `dealDamage` and consume; DoT tick / lava / spikes do **not** detonate; detonation is not a second observe.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-wound-mark`
- **ADVANCED_SPELL_POOL:** `physical_attack`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-foe-reel` only if `foe_reeler` is **absent**
- **ELITE_SPELL_POOL:** none — hit-detonate honesty is the elite. Do **not** unlock Cast Mark as identity.
- **SIGNATURE_MECHANICS:** Mark 2 turns, 1 charge. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-mark → VETERAN skip-if-no-poke → ELITE reel-then-hit → CHAMPION dot-does-not-tick
- **RARITY_CURVE:** Standard. +ELITE in Foe Wound.
- **SYNERGIES:** `foe_reeler`, `split_fanger`, `hold_knight`
- **WEAKNESSES:** Don’t get hit; Cleanse; wait 2 turns; DoT only
- **PLAYER_COUNTERPLAY:** Poison instead of Strike; Dispel; kill the Marker
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wound-mark` (ENEMY_DISCOVERY). `mark_court` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (mark + consume on incoming hit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `split_plater`

- **NAME:** Split Plater
- **ROLE:** protector (next incoming hit 50/50 with adj ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `twin_tether` (ongoing split while Chebyshev ≤ 3), `share_warden` (**outgoing** 50/50), `pain_suture` (redirect whole hit), `cover_squire` (whole redirect). SDE extras on `plate_warden` / `leash_warden` are **not** CORE. Reroll if no ally. At most one incoming-split-hit CORE per pack as PAIR vs Twin / Share / Suture.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no ally at Chebyshev-1. Peer: Split Plate when expecting Inferno. Above: skip if no ally.
- **STAT_SCALING_RULE:** hp 1.15, sp 0.70, sr 1.05, res 1.10, init 0.85, chc 0.70. Identity is **isolate the tank**. Lower HP than golem — the split is the extra life. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "split_incoming_adjacent_ally"`. VETERAN: skip if no ally. ELITE: Goad so the hit is legal. CHAMPION: missing-ally at **hit** time → full hit, charge gone; DoT / lava do not consume; splitting Inferno onto a 1-HP ally is a kill transfer — CHAMPION prefers the highest-HP adj ally, not lowest (SDE said lowest HP; **family CHAMPION overrides to highest HP** so the lesson is “isolate”, not “execute the whelp by accident”). BASE/VETERAN keep SDE lowest-HP so the danger is teachable.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-split-plate`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is **absent**
- **ELITE_SPELL_POOL:** none — one-hit honesty is the elite. Do **not** unlock Life Tether as identity.
- **SIGNATURE_MECHANICS:** 1 charge, 2 turns. Next incoming damaging **hit** split 50/50 with one Chebyshev-1 ally. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-split → VETERAN skip-if-alone → ELITE goad-into-it → CHAMPION highest-HP-ally
- **RARITY_CURVE:** Standard. +ELITE in Split Kennel. Never CHAMPION in a solo pack.
- **SYNERGIES:** `kennel_siller`, `goad_herald`, `pale_cantor`
- **WEAKNESSES:** Isolate the tank; AoE both; wait 2 turns
- **PLAYER_COUNTERPLAY:** Pull the ally off; two independent hits; don’t dump Inferno into a plated pair without breaking adj
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-split-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (incoming pipeline, two bodies, missing-ally fail closed)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `first_verser`

- **NAME:** First Verser
- **ROLE:** controller / anti-melee (cannot Strike until a spell resolves)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `hold_knight` (Strike illegal until **walk**), Oath Blade (other ids fizzle, Strike **hurts**), `dull_censor` (Strike deals 0), `once_cantor` (cannot recast last id). SDE extras on `once_cantor` / `verse_scribe` are **not** CORE. At most one Strike-until-spell CORE per pack as PAIR vs Strike Hold / Dull / Oath.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already cast a spell or have no non-Strike id. Peer: Verse First if they want Strike. Above: skip if they have no non-Strike id.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.85, res 0.80, init 1.15, chc 0.85. Identity is **cast anything cheap, then Strike**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_strike_until_spell"`. VETERAN: skip if they already cast or have no unlock id. ELITE: Quiet Hex after they dump a 2-AP spell to unlock Strike. CHAMPION: 1 turn; Mute Thread on the unlock is COURT, never PAIR.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-verse-first`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-cast-hold` only if `hold_caster` is **absent**
- **ELITE_SPELL_POOL:** none — spell-then-Strike honesty is the elite. Do **not** unlock Strike Hold as identity.
- **SIGNATURE_MECHANICS:** Cannot confirm Strike until a non-Strike spell resolves this turn. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-verse → VETERAN skip-if-unlocked → ELITE tax-the-unlock → CHAMPION 1-turn
- **RARITY_CURVE:** Standard. +ELITE in Hold Verse.
- **SYNERGIES:** `hold_caster`, `gait_sealer`, `quiet_siller` (COURT)
- **WEAKNESSES:** Cast Frost then Strike; wait; Dispel
- **PLAYER_COUNTERPLAY:** Pay 2 AP to unlock melee; don’t also eat Mute on that Frost
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-verse-first` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (Strike gate until a non-Strike resolve)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pit_skipper`

- **NAME:** Pit Skipper
- **ROLE:** teleporter / kiter (next 1-tile walk treats pit as floor)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `pit_mason` (places the pit), Safe Fall (forced-move skips **hazard ticks**), `ghost_stepper` (occupies vacated cell). SDE extras on `pit_mason` / `wick_painter` are **not** CORE. At most one pit-as-floor CORE per pack as PAIR vs Pit Mason. Maps must still have a floor path for the **player**.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if no pit on a 1-tile path. Peer: Pit Skip then walk 1 across. Above: skip if no pit gap.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.95, sr 0.85, res 0.80, init 1.25, chc 1.00. Identity is **the 1-tile pit gap**. If it tops the meter without a pit, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "next_walk_ignores_pit"`. VETERAN: skip if no 1-tile pit path. ELITE: Open Pit then skip it. CHAMPION: walks of length ≥ 2 do **not** consume and stay illegal through the pit; does **not** ignore lava / spikes / void / portals / barriers.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-pit-skip`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-slow`
- **RARE_SPELL_POOL:** `spell-open-pit` only if `pit_mason` is **absent**
- **ELITE_SPELL_POOL:** none — 1-tile-pit honesty is the elite. Do **not** unlock Ghost Step as identity.
- **SIGNATURE_MECHANICS:** Next 1-tile walk treats Open Pit / Pit Wick occupancy as floor. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-skip → VETERAN skip-if-no-pit → ELITE place-then-skip → CHAMPION lava-still-hurts
- **RARITY_CURVE:** Standard. +ELITE in Unit Pit. Weight 0 if the map has no pit and this body cannot place one.
- **SYNERGIES:** `unit_oather`, `origin_mason`, `wick_painter` (COURT)
- **WEAKNESSES:** Don’t leave a 1-tile pit gap; Barrier the far cell; lava on the far side
- **PLAYER_COUNTERPLAY:** Plug the gap; don’t let them Open Pit a corridor you cannot walk
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pit-skip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (1-tile walk exception for pit occupancy only)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `empty_plater`

- **NAME:** Empty Plater
- **ROLE:** tank (0 leftover AP → +RES)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `dry_stinger` (0 leftover **damage**), Planted Stance (0 **walk MP**), `purse_locker` (freeze leftover). SDE extras on `plate_warden` / `tempo_precentor` are **not** CORE. At most one leftover-0-RES CORE per pack as PAIR vs Dry Sting.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they still need a 3 AP spell. Peer: Empty Plate as the last action if leftover is 0 at resolve. Above: skip if leftover ≥ 1 (fizzle — leftover then 0, but the gate was pre-spend).
- **STAT_SCALING_RULE:** hp 1.20, sp 0.75, sr 1.10, res 1.10, init 0.85, chc 0.70. Identity is **dump AP, then plate**. If it tops the meter, the kit leaked toward Strike.
- **AI_TIER_PROGRESSION:** Profile `guardian`. `aiHint: "self_buff_if_zero_leftover_ap"`. VETERAN: skip if they still need a 3 AP spell. ELITE: Leftover Lend partner dumps AP onto an ally then this buffs. CHAMPION: `buffStat: "res"`, `buffModifier: 1.20`, 2 turns; last-writer vs Iron Skin; gate is leftover 0 **pre-spend**.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-empty-plate`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-leftover-lend` only if `leftover_lender` is **absent**
- **ELITE_SPELL_POOL:** none — leftover-0 honesty is the elite. Do **not** unlock Dry Sting as identity.
- **SIGNATURE_MECHANICS:** If leftover AP is 0 at resolve, +20% RES / 2. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-plate → VETERAN skip-if-wet → ELITE dump-then-plate → CHAMPION last-writer-res
- **RARITY_CURVE:** Standard. +ELITE in Tick Empty.
- **SYNERGIES:** `tick_plater`, `leftover_lender`, `goad_herald`
- **WEAKNESSES:** Don’t let them dump AP; Dispel; Pull so they want leftover for Strike
- **PLAYER_COUNTERPLAY:** Keep them wanting a 3-AP tool; strip the RES
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-empty-plate` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (leftover read + RES buff)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `kennel_siller`

- **NAME:** Kennel Siller
- **ROLE:** anti-summon (hostile summons cannot leave the cell)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `pet_siller` (cannot **enter**), `still_leasher` (pause lifespan), `leash_cutter` (remaining → 1). ELITE acquisition on the spell. SDE extras on `glyph_sower` / `leash_warden` are **not** CORE. At most one summon-cannot-leave CORE per pack as PAIR vs Pet Sill / Still Leash.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no hostile summon. Peer: Kennel Sill under a hostile summon. Above: skip if none.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.85, sr 0.90, res 0.80, init 1.10, chc 0.80. Identity is **the wolf stays**. If it tops the meter, the kit leaked. Player body always walks.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "forbid_summon_leave_cell"`. VETERAN: skip if no summon. ELITE: Pet Sill on the escape cell (COURT, not PAIR). CHAMPION: summon **enter** is still legal; teleport / Swap off still work unless Blink Seal; never name-parse the summon.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-kennel-sill`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-sever-tether` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-pet-sill` only if `pet_siller` is **absent**
- **ELITE_SPELL_POOL:** none — leave-forbid honesty is the elite. Do **not** unlock Pet Sill as identity.
- **SIGNATURE_MECHANICS:** Paint 2 turns. Hostile `isSummon` occupying it cannot leave by walking. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-sill → VETERAN skip-if-no-pet → ELITE sill-the-escape → CHAMPION enter-still-legal
- **RARITY_CURVE:** Standard. +ELITE in Split Kennel.
- **SYNERGIES:** `split_plater`, `still_leasher`, `pet_siller` (COURT)
- **WEAKNESSES:** Don’t park pets; Swap / Sever; wait 2 turns
- **PLAYER_COUNTERPLAY:** Fight without pets; don’t plug a corridor with a wolf
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-kennel-sill` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (tile paint + summon-leave filter)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `chase_mender`

- **NAME:** Chase Mender
- **ROLE:** healer (heal iff **target** walked)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **with** healer profile required (`healAmount`). Distinct from `gait_mender` (**caster** walked), `shove_mender` (**force-moved**), `pale_cantor` (unconditional), `font_cantor`. ELITE acquisition on the spell. SDE extras on `pale_cantor` / `font_cantor` are **not** CORE. At most one target-walked-heal CORE per pack as PAIR vs Gait / Shove.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Shield if target `walkMpSpentThisTurn < 1`. Peer: Chase Mend if they walked **and** missing HP ≥ 8. Above: refuse if they have not walked (0-heal fizzle).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.80, sr 1.00, res 0.85, init 1.20, chc 0.70. Identity is **they already spent the tiles**. If it tops the meter, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `healer`. `aiHint: "heal_if_target_walked"`. VETERAN: skip if walk-spend < 1 or missing HP < 8. ELITE: Boot Lend / Spare Pace partner to fund the walk. CHAMPION: forced-move does **not** count; `challengeHealUsedRef` flips only when HP increased; never put this id on a non-healer CORE.
- **CORE_SPELL_POOL:** `spell-chase-mend`, `starter-shield`
- **ADVANCED_SPELL_POOL:** `starter-heal`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-boot-lend` only if `boot_lender` is **absent**
- **ELITE_SPELL_POOL:** none — target-walked honesty is the elite. Do **not** unlock Gait Mend as identity.
- **SIGNATURE_MECHANICS:** Heal 8 iff the **target** spent ≥ 1 walk MP this turn. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE shield-or-chase → VETERAN skip-if-unmoved → ELITE fund-the-walk → CHAMPION shove-does-not-count
- **RARITY_CURVE:** Standard. +ELITE in Boot Chase.
- **SYNERGIES:** `boot_lender`, `spare_pacer`, `gait_mender` (COURT)
- **WEAKNESSES:** Root the ally; Cursed Wound; don’t let them walk
- **PLAYER_COUNTERPLAY:** Nail the carry’s feet; kill the Mender; 0-heal does not fail `no_healing`
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-chase-mend` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (heal gate on target `walkMpSpentThisTurn`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_staller`

- **NAME:** Cadence Staller
- **ROLE:** debuffer / controller (+1 all remaining CDs)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `cadence_stretcher` (×2), `cadence_cracker` (highest one → 0), `cadence_thief` (steal 1). Extra door `stall_nave` is a teach — family is **not** that id. SDE extras on `cadence_thief` are **not** CORE. Once/battle. At most one remaining-CD-+1 CORE per pack as PAIR vs Stretch / Crack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no remaining CDs. Peer: Stall if at least one remaining ≥ 1. Above: skip if all remaining are 0 (use Crack / Mute instead).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.90, res 0.75, init 1.20, chc 0.80. Identity is **Inferno 3 → 4**. If it tops the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `controller`. `aiHint: "stall_all_remaining_cds"`. VETERAN: skip if no remaining ≥ 1. ELITE: do **not** Crack then Stall the same body. CHAMPION: once/battle per caster; ids at 0 untouched; this is **not** Stretch and **not** a lockout.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-stall`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if `usableByEnemy` is flipped for **that one id**
- **RARE_SPELL_POOL:** `spell-last-mute` only if `last_muter` is **absent**
- **ELITE_SPELL_POOL:** none — +1 honesty is the elite. Do **not** unlock Cadence Stretch as identity.
- **SIGNATURE_MECHANICS:** +1 remaining on every kit id with remaining ≥ 1. Once/battle. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-stall → VETERAN skip-if-clean → ELITE no-crack-then-stall → CHAMPION once-battle
- **RARITY_CURVE:** Standard. +ELITE in Stall Stretch (COURT with `last_muter`, never PAIR with `cadence_stretcher`).
- **SYNERGIES:** `last_muter`, `once_cantor`, `cadence_thief` (COURT)
- **WEAKNESSES:** Don’t start CDs; Dispel; Timestep is AP/MP not CD
- **PLAYER_COUNTERPLAY:** Sit on CD-0 ids; recast before they Stall
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-stall` (ELITE observe). `stall_nave` teach is not the family id.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (iterate cooldown map, +1, once/battle)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `crown_cutter`

- **NAME:** Crown Cutter
- **ROLE:** assassin (bonus vs `isLeader`)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king` or `knight`. Distinct from `coup_duelist` (instant ≤25%), Summon Bane (`isSummon`). SDE extra on `coil_arbiter` is **not** CORE. At most one leader-bonus CORE per pack as PAIR vs Coup. MULTI child leftover `leader_slayer` — first child wins vs family observe.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if target is not `isLeader`. Peer: Crown Cut the leader. Above: skip if neither `isLeader` nor (enemy-cast pack-leader flag vs the player primary).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.15, sr 0.85, res 0.80, init 1.20, chc 1.05. Identity is **the king is the wrong body to stand on**. If it always deals 24 to pawns, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker` / charger. `aiHint: "bonus_if_target_is_leader"`. VETERAN: skip if not `isLeader`. ELITE: Foe Reel a king into range. CHAMPION: reads `isLeader`, never `"king"` in the unit name; player copy **never** treats a non-leader player-side body as a leader; extra 12 is a second `dealDamage`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-crown-cut`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-foe-reel` only if `foe_reeler` is **absent**
- **ELITE_SPELL_POOL:** none — leader-flag honesty is the elite. Do **not** unlock Coup as identity.
- **SIGNATURE_MECHANICS:** 12, +12 if `isLeader`. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE strike-or-cut → VETERAN skip-if-pawn → ELITE reel-the-king → CHAMPION isLeader-only
- **RARITY_CURVE:** Standard. +ELITE in Crown Bar. +ELITE when a pack has an `isLeader`.
- **SYNERGIES:** `full_barer`, `coil_arbiter` (COURT), `foe_reeler`
- **WEAKNESSES:** Kill the king last; don’t stand as the only primary; Barrier
- **PLAYER_COUNTERPLAY:** Don’t be the leader in melee; desummon so the flag is on a backliner
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-crown-cut` (MULTI: family observe **or** `leader_slayer` claim — first child wins; duplicate feat callback grants nothing)
- **REWARD_EXPECTATION:** Standard. No extra Doka from the feat grant.
- **IMPLEMENTATION_COMPLEXITY:** LOW (`isLeader` read + second dealDamage)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `full_barer`

- **NAME:** Full Barer
- **ROLE:** buffer (next spell −1 AP if bar is full)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `tempo_precentor` (next-turn +1 AP), Overcast (range), Hex of Silence (full-bar **lock**, unowned). SDE extra on `bone_scribe` is **not** CORE. MULTI child leftover `spell_master` — first child wins vs family observe. At most one full-bar-discount CORE per pack as PAIR vs Tempo. Does **not** write extra `spellBarOrder` slots.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if kit size < 4. Peer: Full Bar then Inferno if kit ≥ 4. Above: skip if kit < 4 (fizzle).
- **STAT_SCALING_RULE:** hp 0.75, sp 0.90, sr 0.85, res 0.75, init 1.20, chc 0.80. Identity is **Inferno at 4 AP**. If it tops the meter without a discount, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `buffer` / caster. `aiHint: "cheaper_if_bar_full"`. VETERAN: skip if kit < 4. ELITE: arm then Inferno / Fuse the same turn. CHAMPION: player gate is ≥ 8 equipped; enemy analog is ≥ 4 assigned kit ids; min cost 1; does not splice the turn; fizzle still observes.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-full-bar`
- **ADVANCED_SPELL_POOL:** `spell-inferno`, `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is **absent**
- **ELITE_SPELL_POOL:** none — full-bar honesty is the elite. Do **not** unlock Hex of Silence as identity.
- **SIGNATURE_MECHANICS:** Next spell this turn costs 1 less AP (min 1) if the bar is full. SDE Wave 8 unique CORE.
- **VARIANT_PROGRESSION:** BASE frost-or-arm → VETERAN skip-if-thin-kit → ELITE arm-then-nuke → CHAMPION min-cost-1
- **RARITY_CURVE:** Standard. +ELITE in Crown Bar.
- **SYNERGIES:** `crown_cutter`, `cadence_stretcher`, `ignite_alchemist`
- **WEAKNESSES:** Keep 7 equipped; Quiet Hex the discounted nuke; wait CD 3
- **PLAYER_COUNTERPLAY:** Unequip to 7; kill the Barer before the nuke; don’t let a 4-id enemy kit pretend to be an 8-id bar without the analog
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-full-bar` (MULTI: family observe **or** `spell_master` claim — first child wins; duplicate feat callback grants nothing)
- **REWARD_EXPECTATION:** Standard. No Doka from the feat grant. Does not write extra bar slots.
- **IMPLEMENTATION_COMPLEXITY:** MED (equipped-count gate + next-spell AP discount)
- **STATUS:** PROPOSED

---

## 5. Wave 1–9 amendments (not new ids)

| Family | Amendment | Why |
| :--- | :--- | :--- |
| `gait_mender` | Do **not** steal `spell-shove-mend` or `spell-chase-mend` as CORE | Caster-walked heal stays Gait. Force-move is Shove Mender. Target-walked is Chase Mender. |
| `pale_cantor` / `font_cantor` | Do **not** steal `spell-chase-mend` as CORE | SDE extras stay G≥8. Chase Mend is `chase_mender`. |
| `cadence_thief` / `cadence_cracker` / `cadence_flusher` | Do **not** steal `spell-cadence-stretch` or `spell-cadence-stall` as CORE | ×2 is Stretcher. +1 is Staller. |
| `twin_span` / `triple_span` / `span_prelate` / `dummy_prelate` | Do **not** steal `spell-quad-span` | Four-cell occupy is Quad Prelate. Skip until cap ≥ 4. |
| `boot_stinger` / `fuse_binder` / `cast_marker` / `wound_marker` | Do **not** steal `spell-gait-wick` | Walk-MP detonate is Gait Wicker. |
| `empty_plater` (this pass) vs `dry_stinger` | Never PAIR | Same leftover-0 gate, inverse payload (RES vs damage). |
| `hinge_squire` / `hook_chaplain` / `ally_reeler` | Do **not** steal `spell-home-step` | Join-the-ally relocate is Home Stepper. |
| `even_warder` / `odd_warder` | Last writer on walk-parity; never PAIR | Odd is this pass. Even stays Wave 9. |
| `hold_knight` | Do **not** steal `spell-cast-hold` or `spell-verse-first` | Strike-until-walk stays Hold Knight. Spell-until-walk is Hold Caster. Strike-until-spell is First Verser. |
| `ground_oather` | Do **not** steal `spell-unit-oath` | Inverse. Last writer. |
| `walk_toller` / `tide_shade` | Do **not** steal `spell-step-rebate` | Discount is Rebate Warder. Toll stays +1. |
| `ally_reeler` / `file_reeler` | Do **not** steal `spell-foe-reel` | Toward **other hostile** is Foe Reeler. |
| `echo_painter` | Do **not** steal `spell-echo-wipe` | Copy vs erase. |
| `wall_biter` | Do **not** steal `spell-field-bite` | Hug vs open floor. |
| `body_marker` / `cast_marker` | Do **not** steal `spell-wound-mark` | Amp vs cast-detonate vs hit-detonate. |
| `twin_tether` / `share_warden` / `pain_suture` | Do **not** steal `spell-split-plate` | Ongoing tether / outgoing share / whole redirect vs one-hit split. |
| `pit_mason` | Do **not** steal `spell-pit-skip` as identity | Place vs skip. COURT is Unit Pit. |
| `plate_warden` / `tempo_precentor` | Do **not** steal `spell-empty-plate` as CORE | Leftover-0 +RES is Empty Plater. |
| `pet_siller` / `still_leasher` | Do **not** steal `spell-kennel-sill` | Enter-forbid / pause vs leave-forbid. |
| `leftover_lender` / `purse_locker` | Do **not** steal `spell-purse-keep` | Dump / freeze vs bank-to-next-turn. |
| `thin_warder` / `ash_absolver` | Do **not** steal `spell-tick-plate` | Hit-cap / strip vs one DoT tick. |
| `gait_muter` / `once_cantor` | Do **not** steal `spell-last-mute` | Next-any / echo vs last-id ban. |
| `pair_porter` / `pawn_broker` | Do **not** steal `spell-pair-slide` | 90° / swap vs translate. |
| `coil_arbiter` | Do **not** steal `spell-crown-cut` as CORE | Leader poke is Crown Cutter. |
| `bone_scribe` | Do **not** steal `spell-full-bar` as CORE | Full-bar discount is Full Barer. |
| `cadence_lender` | CHAMPION may keep `spell-pack-tithe` as SIGNATURE | Never a world-pack CORE. Never owned. |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| All prior waves | Quad Span joins the stationary-post / multi-cell cap | One multi-cell system. Counts as four. |

---

## 6. Identity matrix (Wave 10 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| shove_mender | healAmount gated on forcedMoved, defense | isSummon, inferno-as-identity, walk-heal as CORE |
| cadence_stretcher | stretchRemainingCdMul, damage (frost), debuff | heal, isSummon, stall-+1 as CORE, invent-CD-on-zero |
| quad_prelate | isSummon (quadspan), defense | turret/wolf/archer/bomber/dummy/triple, heal, shard |
| gait_wicker | unit mark on walk MP, damage (physical/frost) | heal, isSummon, tile-fuse as CORE, cast-detonate as CORE |
| dry_stinger | leftover-AP-zero bonus, damage (physical) | heal, isSummon, leftover-0 +RES as CORE |
| home_stepper | relocate to ally adj, defense, damage (physical) | isSwap, healAmount, inferno, enemy-Hook as CORE |
| must_spanner | mustWalkManhattan 2, damage (physical), debuff | heal, isSummon, parity-lock as CORE |
| far_hooder | far-range consume shield, defense, frost | healAmount, isSummon, any-range sidestep as CORE, DoT-eat as CORE |
| boot_lender | grant current MP if unmoved, buff, frost | healAmount, isSummon, spare-pace-as-identity |
| quiet_siller | tile forbid isPhysical, frost, isMark | heal, isSummon, unit Strike-hold as CORE |
| exit_stinger | leave-paint damage, physical, debuff | heal, isSummon, enter-heal as CORE |
| purse_keeper | bank leftover AP next turn start, frost | heal, isSummon, queue splice, leftover-dump as CORE |
| tick_plater | negate next DoT tick, defense, physical | healAmount, isSummon, hit-cap as CORE |
| last_muter | lastResolvedId illegal, frost, debuff | heal, isSummon, next-any mute as CORE, full-bar silence |
| pair_slider | pair translate, frost, isMark, debuff | isSwap, heal, isSummon, 90°-hinge as CORE |
| odd_warder | odd Manhattan walk, frost, debuff | heal, isSummon, even-parity as CORE |
| hold_caster | forbidSpellUntilWalk, physical, defense | heal, isSummon, Strike-hold as CORE, root-as-CORE |
| unit_oather | nextSpellUnitOnly, frost, isMark | heal, isSummon, ground-oath as CORE |
| rebate_warder | rebateNextWalkMp, physical, frost | heal, isSummon, walk-toll as CORE, spell.mpCost |
| foe_reeler | attractTowardNearestHostile, frost, isMark | heal, isSummon, ally-reel / file-reel as CORE |
| echo_wiper | erasePaintAdjacent, frost | heal, isSummon, echo-paint as CORE, barrier-shift as CORE |
| field_biter | openFloorBonus, physical, frost | heal, isSummon, wall-bite as CORE |
| wound_marker | detonateOnHit, frost, physical | heal, isSummon, cast-detonate / body-amp as CORE |
| split_plater | splitIncomingAllyPct, defense, physical | heal, isSummon, life-tether / outgoing-share as CORE |
| first_verser | forbidStrikeUntilSpell, frost, debuff | heal, isSummon, Strike-until-walk as CORE, oath-blade as CORE |
| pit_skipper | nextWalkIgnoresPit, physical | heal, isSummon, lava-skip as CORE, ghost-step as CORE |
| empty_plater | emptyLeftoverRes, defense, physical | heal, isSummon, dry-sting as CORE |
| kennel_siller | forbidSummonLeaveCell, frost | heal, player-body-root as CORE, pet-sill-enter as CORE |
| chase_mender | healAmount gated on target walked, defense | isSummon, inferno, caster-walk heal as CORE, force-move heal as CORE |
| cadence_staller | stallAllRemainingCds, frost, debuff | heal, isSummon, ×2 stretch as CORE |
| crown_cutter | leaderBonusDamage, physical | heal, isSummon, execute-on-HP% as CORE, name `"king"` |
| full_barer | fullBarApDiscount, frost, inferno | heal, isSummon, extra bar slots, Hex of Silence |

Wave 1–9 matrices in those dated docs still apply to those ids.

---

## 7. Role coverage after Wave 10

| Archetype | Wave 1 owner | Wave 10 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | — |
| sniper | glass_sniper | — |
| kiter | tide_shade | rebate_warder, pit_skipper |
| assassin | shadow_lurker | dry_stinger, crown_cutter, gait_wicker |
| healer | pale_cantor | shove_mender (force-move), chase_mender (target walked) |
| buffer | hex_chorister | boot_lender, purse_keeper, full_barer |
| debuffer | bone_scribe | cadence_stretcher, last_muter, cadence_staller, wound_marker |
| summoner | brood_chanter | quad_prelate (4-cell post) |
| controller | coil_arbiter | must_spanner, odd_warder, hold_caster, unit_oather, first_verser |
| tank | iron_golem | far_hooder, tick_plater, empty_plater |
| protector | leash_warden | home_stepper, split_plater |
| artillery | storm_caller | field_biter |
| kamikaze | cinder_martyr | — |
| teleporter | wraith_bishop, blink_cutter | home_stepper, pit_skipper |
| displacement | rift_hook | pair_slider, foe_reeler |
| hazard creator | ember_knight, glyph_sower | quiet_siller, exit_stinger, echo_wiper, kennel_siller |
| status specialist | plague_rat | gait_wicker, tick_plater |
| anti-summon | null_censor | kennel_siller |
| anti-ranged | void_mirror, rust_reaver | far_hooder, hold_caster |
| anti-melee | leash_warden | quiet_siller, first_verser, must_spanner |

Every requested archetype still has a Wave 1 owner. Wave 10 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6 through Wave 9 §5, plus Wave 10 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis.
6. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`forcedMovedThisTurn`**, **`lastResolvedSpellId`**.
7. `inferSummonArchetype` gains `quadspan` (and still needs `dummypost` / `triplespan` from Waves 8–9).
8. Raise or gate `ENEMY_SUMMON_CAP` before Quad Span (and Triple Span) can spawn. Live cap 2 makes Quad illegal.
9. Wave 1 kits first (live ids), then later verbs one at a time. Wave 10 slice: force-move flag → Shove Mend → CD ×2 helper (shared with Court Stretch, never owned) → four-cell footprint → walk-MP wick → leftover-AP poke → home-step relocate → must-span filter → far-hood consume → boot lend → quiet sill → exit sting → purse keep next-turn-start → tick-plate consume → last-id mute → pair-slide translate → odd-stride → cast-hold → unit-oath → step-rebate → foe-reel attract → echo-wipe → field-bite → wound-mark → split-plate incoming → verse-first → pit-skip → empty-plate → kennel-sill → chase-mend → cadence-stall → crown-cut → full-bar.
10. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 9 and SDE Wave 8, never names.
11. Register text updates only when hooks land.
12. Discovery: family observe must not double-grant MULTI / feat doors (`shove-mend`, `cadence-stretch`, `quad-span`, `purse-keep`, `odd-stride`, `crown-cut`, `full-bar`).
13. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not splice the turn queue for Purse Keep.

---

## 9. Held for a later wave (no ids reserved here)

These need SPELL_PROPOSALS / SDE to stamp ids first, **or** they stay closed. This run does **not** mint colliding `wave10:` spell ids.

- SDE Wave 9 unique CORE (`spell-pair-stride` … `spell-knight-fold`) — Wave 11 families if they still have no CORE owner
- Same-day SPELL_PROPOSALS Wave 10 (2026-09-27) if it stamps new verbs — Wave 11 consumes those
- Mid-RAF splice of the current actor (AGENTS.md)
- Fourth `mpCost > 0` walk snipe (Ley Toll / Undertow / Sanguine Toll remain the only paper cast-MP spenders)
- Sixth echo id
- Player-owned Hex of Silence
- Five-cell occupy (Quad Span is four)
- 180° pair hinge (`spell-about-hinge`, never owned)
- Refresh (extend) all remaining CDs **including zeros**
- Pack Tithe / Court Stretch / About Hinge as world-pack CORE
- Facing writer families (still blocked on combat `currentView`)
- Cone `areaShape` **reader** family (Gale / Fan still own the unread hole)

---

## 10. What this run did not do

- No production TypeScript / Motoko / Candid.
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, 13 Wave 6, 14 Wave 7, 17 Wave 8, or 32 Wave 9 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `spell-court-stretch` / `spell-pack-tithe` / `spell-about-hinge` world-pack CORE.
- No SDE Wave 9 unique CORE as this pass’s CORE.
- No `wave10:` colliding spell ids.
- No restamp of claimed feat / challenge / extra-door keys.

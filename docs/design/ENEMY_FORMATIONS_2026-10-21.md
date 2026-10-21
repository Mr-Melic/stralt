# Enemy synergy and formation catalog (drop 13)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-21  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–12 already taught the seven pairing words and Waves 1–11 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 12 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-29.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-29.md) (open as PR #796) and deferred by drop 12 (PR #794): Heave Choir, Dual Bank, Sept Plug, Halve Pace, Mid Step, Drift Court, Bounce File, Drift Gate, Heave Quiet, Inch Reach, Rite Long, Cinder Ingress, Side Brace, Off Watch, Spike Tapped, Bar Pin, Still Sprout, Lone Banner.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794). Family sheets: PR #796. Spell verbs: Wave 11 tactical ids in PR #726 (`spell-heave-mend` … `spell-verse-pace`) plus leftover SDE Wave 10 unique CORE (`spell-inch-stride` … `spell-banner-cut`).

**Hard rules (Wave 12 pack law — plus every older law still stands):**

- Do **not** pack `heave_mender` with `both_mender` / `gait_mender` / `chase_mender` / `shove_mender` / `clash_mender` / `enter_mender` / `bar_mender` / `pale_cantor` as a PAIR (dual-**force** heal vs dual-**walk** vs caster-walked vs target-walked vs target-forced vs Struck vs enter vs spell-resolved vs unconditional). `FSN-BOTH-SPEND` / `FSN-SHOVE-BASH` / `FSN-BODY-CLASH` stay theirs. `FSN-BAR-PIN` owns spell-resolved heal.
- Do **not** pack `dual_keeper` with `purse_keeper` / `stride_keeper` / `leftover_lender` / `spare_pacer` / `tempo_precentor` as a PAIR (leftover-**AP and MP** bank vs leftover-AP vs leftover-MP vs dump vs ungated +1 MP vs next-turn AP). `FSN-DRY-KEEP` stays Purse Keep. `FSN-STRIDE-DAMP` stays Stride Keep. BRIGADE `FSN-DUAL-BANK` is the two-wallet lesson, never a two-bank PAIR.
- Do **not** pack `sept_prelate` with `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Sept counts as **7**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 7. Live cap is **2** — skip `FSN-DRIFT-COURT/SEPT`. `FSN-CAST-QUIET/PENTA` / `FSN-HOLD-VERSE/QUAD` stay theirs.
- Do **not** pack `cadence_halver` with `cadence_trimmer` / `cadence_shaver` / `cadence_stretcher` / `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender` / `cadence_pinner` as a PAIR (`floor(remaining/2)` vs −1 vs ally −1 vs ×2 vs +1 vs highest→0 vs ally all→0 vs steal vs −1 one id vs freeze-one). `FSN-TRIM-TAX` / `FSN-STRETCH-MUTE` / `FSN-BOOT-OATH/SHAVE` stay theirs. `FSN-BAR-PIN` owns Pin, never Halve+Pin.
- Do **not** pack `mid_hooder` with `near_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `thin_warder` / `off_plater` as a PAIR (exactly-2 miss vs ≤1 vs ≥3 vs any-range skip vs Fog Hood vs hit-cap vs off-turn miss). `FSN-NEAR-MUST` / `FSN-WICK-HOOD` stay theirs. `FSN-OFF-FEE` owns Off Plate.
- Do **not** pack `ready_stinger` with `dry_stinger` / `damp_stinger` / `full_purser` / `lone_purser` / `lone_stinger` as a PAIR (leftover **AP ≥ 1 and MP ≥ 1** poke vs leftover AP = 0 vs leftover MP ≥ 2 vs leftover AP ≥ 3 vs leftover AP **exactly 1** vs isolation). `FSN-DRY-TAX` / `FSN-STRIDE-DAMP` stay theirs. `FSN-DRIFT-COURT/BANNER` owns Lone Purse.
- Do **not** pack `heave_stepper` with `home_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire` / `hinge_squire` as a PAIR (join a **force-moved** ally vs caster→ally vs ally→caster vs line rescue vs cover vs 90°). BRIGADE `FSN-HEAVE-QUIET` is the three-body lesson. `FSN-HOME-SILL` / `FSN-ALLY-SILL` stay theirs.
- Do **not** pack `drift_siller` with `quiet_siller` / `cast_siller` / `body_siller` / `kennel_siller` / `gift_siller` as a PAIR (tile rejects **relocate dest** vs cannot-Strike vs cannot-non-physical vs primary cannot leave vs summons cannot leave vs enter +MP). `FSN-CAST-QUIET` / `FSN-ALLY-SILL` stay theirs.
- Do **not** pack `drift_holder` with `boot_holder` / `hold_knight` / `hold_caster` / `gait_sealer` / `snare_weaver` / `tool_holder` as a PAIR (cannot walk until **force-moved** vs until Strike vs cannot Strike until walk vs cannot spell until walk vs cannot walk/spells legal vs Root vs tools-until-Strike). COURT `FSN-DRIFT-COURT` is the multi-lock lesson. `FSN-BOOT-OATH` / `FSN-HOLD-VERSE` stay theirs.
- Do **not** pack `drift_lender` with `spent_lender` / `boot_lender` / `spare_pacer` / `gift_siller` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP if **force-moved** vs +1 MP if walked vs unmoved +1 vs ungated +1 vs enter +MP vs next-turn AP vs dump). `FSN-BOTH-SPEND` / `FSN-BOOT-CHASE` stay theirs.
- Do **not** pack `drift_sipper` with `gait_sipper` / `soul_siphon` / `ledger_siphon` / `walk_toller` as a PAIR (steal leftover AP iff **force-moved** vs steal MP iff walked vs ungated sip vs ungated AP sip vs +1 walk cost). `FSN-STRIDE-BANK` / `FSN-NEAR-STEP/SIP` stay theirs.
- Do **not** pack `drift_prelate` with `dummy_prelate` / `bait_prelate` / `ingress_marker` / `shove_stinger` / `fuse_binder` as a PAIR (relocate-landing detonate / walk safe vs taunt vs eat vs walk-enter vs force-landing 8 vs tile bomb). BRIGADE `FSN-DRIFT-GATE/STING` is the three-body lesson. `FSN-SHOVE-PACE` stays Shove Sting.
- Do **not** pack `heave_bouncer` with `storm_caller` / `ricochet_vicar` / `split_fanger` / `plus_cutter` as a PAIR (bounce to another **force-moved** hostile vs any-nearest bounce vs predicate bounce vs split vs plus-cut). `FSN-HEAVE-CHOIR/BOUNCE` is Bounce File, never a two-bounce PAIR.
- Do **not** pack `must_drifter` with `must_stepper` / `must_spanner` / `pair_strider` / `inch_warder` / `rank_lancer` as a PAIR (remaining walks follow **last forced-move dir** vs Chebyshev exactly 1 vs Manhattan 2 vs one next Manhattan 2 vs one next ≤ 1 vs file thrust). `FSN-NEAR-MUST` / `FSN-WICK-SPAN` stay theirs. `FSN-INCH-OATH` owns Inch.
- Do **not** pack `verse_pacer` with `last_muter` / `verse_taxer` / `first_verser` / `hold_caster` / `gait_muter` / `once_cantor` as a PAIR (last-id **illegal until they walk** vs last-id illegal vs last-id +1 AP vs must cast this id first vs spells-until-walk vs next-any mute vs echo lock). `FSN-TRIM-TAX` / `FSN-STRETCH-MUTE` stay theirs.
- Do **not** pack `inch_warder` with `must_stepper` / `must_spanner` / `pair_strider` / `even_warder` / `odd_warder` / `axis_locksmith` as a PAIR.
- Do **not** pack `rite_holder` with `hold_knight` / `first_verser` / `tool_holder` / `boot_holder` / `quiet_siller` as a PAIR (cannot Strike until they **spell** vs cannot Strike until walk vs must this id first vs tools-until-Strike vs walk-until-Strike vs cannot-Strike tile). CADRE `FSN-RITE-LONG` is the three-lock lesson.
- Do **not** pack `long_oather` with `near_oather` / `unit_oather` / `ground_oather` / `dim_optic` / `far_stinger` as a PAIR (next spell range **≥ 3** vs ≤ 1 vs unit-class vs ground-only vs range shrink vs extras). `FSN-BOOT-OATH` leftover oaths stay theirs. `FSN-INCH-OATH/STING` is Inch Reach, never Long+Far PAIR.
- Do **not** pack `cinder_reeler` with `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` as a PAIR (pull toward **hazard** vs paint vs other hostile vs ally vs file-to-caster vs tile gravity). `FSN-PAINT-NOOK` / `FSN-FOE-FANG` / `FSN-BRAND-REEL` stay theirs.
- Do **not** pack `side_biter` with `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `wall_stinger` as a PAIR (adj-**ally** bite vs isolation vs exactly-one-block vs 0-block vs hug vs barrier-hug). `FSN-PAINT-NOOK` / `FSN-FIELD-WIPE` / `FSN-LONE-NAIL` stay theirs.
- Do **not** pack `ingress_marker` with `stride_marker` / `gait_wicker` / `exit_stinger` / `enter_mender` / `fuse_binder` / `glyph_sower` as a PAIR (cell-**enter** detonate vs cell-leave vs unit walk-MP wick vs first leave vs enter heal vs tile bomb vs Mark). `FSN-STRIDE-PULPIT` / `FSN-WICK-HOOD` / `FSN-EXIT-PAIR` stay theirs.
- Do **not** pack `off_plater` with `far_hooder` / `morrow_warden` / `sidestep_warder` / `tick_plater` / `foe_plater` / `mid_hooder` as a PAIR (next **off-turn** hit 0 vs ≥3 miss vs next-own-turn absorb vs any-range skip vs next DoT tick vs 50/50 with adj enemy vs exactly-2 miss).
- Do **not** pack `spike_skipper` with `lava_skipper` / `pit_skipper` / `pit_mason` / `ghost_stepper` / `wick_painter` as a PAIR (1-tile **spike** as floor vs lava vs pit vs place pit vs ghost occupancy vs delayed pit). `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs.
- Do **not** pack `tapped_plater` with `still_plater` / `empty_plater` / `dry_stinger` / `plate_warden` / `tempo_precentor` as a PAIR (leftover-**AP** 0 → +RES vs leftover-**MP** 0 → +RES vs leftover-AP 0 +RES older vs leftover-AP 0 **damage** vs absorb vs next-turn AP). `FSN-LAVA-STILL` owns Still Plate.
- Do **not** pack `brace_chanter` with `kennel_siller` / `body_siller` / `brood_chanter` / `leash_warden` as a PAIR (allied summons ignore force vs summons cannot leave vs primary cannot leave vs brood overlay vs occupy). `FSN-DRIFT-COURT/BRACE` is Side Brace, never a two-pet PAIR. `FSN-DULL-PET` / `FSN-NULL-BROOD` stay theirs.
- Do **not** pack `bar_mender` with `clash_mender` / `heave_mender` / `chase_mender` / `gait_mender` / `both_mender` / `pale_cantor` as a PAIR.
- Do **not** pack `cadence_pinner` with `cadence_halver` / `cadence_staller` / `cadence_trimmer` / `cadence_flusher` / `cadence_thief` as a PAIR.
- Do **not** pack `still_taxer` with `gait_taxer` / `gait_sipper` / `walk_toller` / `ley_tollkeeper` / `verse_taxer` / `tax_scribe` as a PAIR (camped-last-turn +1 AP vs walked-spell +1 vs steal MP vs +1 walk cost vs leftover-AP tax vs last-id +1 vs glyph tax). `FSN-STRIDE-PULPIT/GAIT` stays Gait Tax. `FSN-BAR-PIN/STILL` is Still Sprout, never Still+Tax PAIR.
- Do **not** pack `brick_sprouter` with `brick_shifter` / `brick_wiper` / `echo_wiper` / `stone_castellan` as a PAIR (grow barrier 1 vs slide vs erase vs erase paint vs turret extras). `FSN-BRICK-WATCH` stays Wipe. `FSN-OFF-FEE/GUN` owns the turret, never Sprout+Gun PAIR.
- Do **not** pack `watch_feer` with `watch_muter` / `far_hooder` / `last_muter` / `glass_sniper` as a PAIR (snap costs walker **1 AP** vs snap deals 0 vs ≥3 miss vs last-id illegal vs extras). `FSN-BRICK-WATCH` stays Watch Mute.
- Do **not** pack `lone_purser` with `dry_stinger` / `full_purser` / `ready_stinger` / `purse_keeper` / `empty_plater` as a PAIR.
- Do **not** pack `banner_cutter` with `crown_cutter` / `pet_cutter` / `coup_duelist` / `coil_arbiter` as a PAIR (bonus vs `isLeader` vs leader-slayer grant vs `isSummon` vs HP window vs AP drain). `FSN-CAST-QUIET/KENNEL` leftover cutters stay theirs. `FSN-DRIFT-COURT/BANNER` is Lone Banner, never Banner+Arbiter PAIR.
- Drop 4–12 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two heal-if-gated CORE as PAIR).

Wave 12 **SPELL_PROPOSALS** (`SPELL_PROPOSALS_2026-09-29.md`, open as PR #787) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 12 tactical verbs (`spell-parched-mend` … `spell-court-imprint`, including Six Span) until that family pass exists (Wave 13). Same-day SDE Wave 11 unique CORE stays G≥11 extras.

Court Dual / Pack Close / Mid Fold stay **boss / closed-class**. Court Dual may witness on CHAMPION `dual_keeper` only — never as a world-pack CORE.

**Do not spawn Heave Mend / Heave Step / Drift Hold / Drift Lend / Drift Sip / Drift Post / Heave Bounce / Must Drift sheets until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / heave-step / conveyor writer sets `forcedMovedThisTurn` and `lastForcedMoveDir` `{dx,dy}` (8-dir).** Walk MP must **not** set either field. Missing field → Heave Mend pays **0**, Drift Lend / Sip pay **0**, Drift Post never detonates, Must Drift is a no-op (fail closed). Until those writers land, show `FSN-BOTH-SPEND` / `FSN-SHOVE-BASH` / `FSN-NEAR-MUST` instead of the matching Wave 12 id.

**Do not spawn Verse Pace sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Pace fizzles (fail closed). Until that writer lands, show `FSN-TRIM-TAX` instead of `FSN-HALVE-PACE`.

**Do not spawn Dual Keep / Ready Sting escorts until leftover-AP and leftover-MP can snapshot at end of turn and pay at that unit’s next turn start.** Do **not** share Purse Keep’s leftover-**AP-only** table as Dual Keep’s writer. Death before next start expires the bank. Missing snapshot → Dual Keep is Frost (fail closed). Until that writer lands, show `FSN-STRIDE-DAMP` / `FSN-DRY-KEEP` instead of `FSN-DUAL-READY`.

**Do not spawn Heave Mend / Dual Keep MP-half / Verse Pace peel until a battle-walk writer exists for `walkMpSpentThisTurn`.** Forced-move / Swap / Home Step / Ally Step / Pair Pace / Pair Slide / Heave Step **does not** increment walk-spend. Verse Pace peels **only** on a spent walk — shove does **not** unlock the last id.

**Do not spawn Sept Plug until `inferSummonArchetype` keys `summonAI === "septspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 7.** Live cap is 2. Name heuristics stay a bug. Sept fills the stationary-post **and** the multi-cell-system cap (7). Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/driftpost onto that body.

**Heave Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Cinder Reel is the **fifth** `applyAttract` dest flavor (File Reel, Ally Reel, Foe Reel, Paint Reel, then hazard). Drift Post walk-on is **safe**; relocate-on detonates.

---

## Grounding (live, 2026-10-21)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–12. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920; zone object at 4683–4687 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| Integer RES/SP live path | `progression.ts` `getEnemyBaseStats` 180–186 |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 (`spellType === "heal"` **or** `healAmount > 0`) |
| `decideEnemyAction` | `enemyAI.ts` 1662–1698 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–224 — **no** `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Heave Step is occupancy dest, **not** `isSwap`. Cinder Reel is the fifth **cast** caller of attract. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 12 CORE rows stay `mpCost: 0`. Dual Keep / Drift Sip rewrite **current AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| `forcedMovedThisTurn` / `lastForcedMoveDir` / `lastResolvedSpellId` / leftover-AP+MP bank | **Absent** — Heave / Drift / Verse Pace / Dual Keep fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / **sept** / **driftpost** bodies **replace** the random overlay. Cap one of those engines. Sept Span **is** the 7-cell post and needs remaining cap ≥ 7.
3. Any `healAmount` steals healer. **Heave Mend / Bar Mend must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Halver, Pinner, Sprouter, Feer, Purser, or Cutter.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Split Mend / Both Mend / Heave Mend / Bar Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 12 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Dual Keep / Drift Sip rewrite current AP/MP.
6. `inferSummonArchetype` must key `summonAI === "septspan"` **and** `"driftpost"` **before** any Sept / Drift-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Sprout that **grows** an already planted barrier (it does not mint a new one from empty floor). Drift Hold / Rite First / Long Oath / Verse Pace are **not** `instantKill`.
8. Heave-step dest / cinder-reel dest / drift-post plant / sept plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Heave Step into a wall is a fizzle (no crush). Cinder Reel dest must leave a walk-off that is **not** the hazard cell.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Drift Sip source per pack, not both stacking past that cap. Dual Keep is a **bank**, not a third tax. Do not also Root + Gait Seal + Drift Hold + Must Drift on the same AP bar.
10. Walk-spend: Dual Keep MP-half / Verse Pace peel **fail closed** until `walkMpSpentThisTurn` exists on the turn actor. Heave Step / Cinder Reel / Drift Post plant **does not** increment it.
11. Force-move: Heave / Drift / Must Drift **fail closed** until `forcedMovedThisTurn` **and** `lastForcedMoveDir` writers exist. Walk MP must not set them.
12. Last-id: Verse Pace **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Pace.

### Relative difficulty (same grades as drops 1–12)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…12 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a force-move tell / a walk-lock / a tile lock) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / clash-bruiser / goad / golem / biter / cutter): pack median + one step.
- Backliner (heave-mend / bar-mend / keep / sip / sill / tax / halve / pin / oath / reel / mark / sprout / fee / lend / stride / oather): pack median.
- Glass (ready, sip, halve, tax, mark, sprout, fee, purse, cutter, ignite, spare, sniper): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 13)

Drop 1–12 overlays still apply. These are **additional jobs** for Wave 12 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-HEAVE-MEND` | `queen` **with** heal | proposed `heave_mender` | `spell-heave-mend`, `starter-shield` | healer; skip if either `forcedMovedThisTurn` is 0 or missing HP < 8; walk does **not** pay |
| `ROLE-DUAL-KEEP` | `bishop` **without** heal | proposed `dual_keeper` | `starter-frost`, `spell-dual-keep` | buffer; skip if leftover AP is 0 **or** leftover MP is 0; bank cap 2/2 to **next own turn start**, once/battle; not a queue splice |
| `ROLE-SEPT` | `rook` **without** heal | proposed `sept_prelate` | `physical_attack`, `spell-sept-span` | `isSummoner` for sept only; post `summonAI: "septspan"`, plus occupy, empty kit, remaining cap ≥ 7; skip if any of seven cells blocked |
| `ROLE-HALVE` | `bishop` **without** heal | proposed `cadence_halver` | `starter-frost`, `spell-cadence-halve` | controller; skip if highest remaining CD < 2; `floor(n/2)`; 0 stays 0; never invent locks |
| `ROLE-MID-HOOD` | `pawn` or `knight` **without** heal | proposed `mid_hooder` | `physical_attack`, `spell-mid-hood` | guardian; skip if no Chebyshev-2 threat; hits from 1 or ≥ 3 do not consume; DoT does not consume |
| `ROLE-READY` | `knight` **without** heal | proposed `ready_stinger` | `physical_attack`, `spell-ready-sting` | flanker; skip if leftover AP < 1 **or** leftover MP < 1 unless 10 still kills; bank does **not** empty leftover this turn |
| `ROLE-HEAVE-STEP` | `queen` **without** heal | proposed `heave_stepper` | `physical_attack`, `spell-heave-step` | protector; skip if no force-moved ally or no free adj of that ally; relocate, **not** `isSwap` |
| `ROLE-DRIFT-SILL` | `rook` **without** heal | proposed `drift_siller` | `starter-frost`, `spell-drift-sill` | setter; occupant cannot be a **relocate dest**; walk onto is legal; shove/swap onto fizzles |
| `ROLE-DRIFT-HOLD` | `rook` **without** heal | proposed `drift_holder` | `physical_attack`, `spell-drift-hold` | controller; cannot **walk** until force-moved; Strike does **not** peel; spells stay legal |
| `ROLE-DRIFT-LEND` | `bishop` **without** heal | proposed `drift_lender` | `spell-drift-lend`, `starter-frost` | buffer (`AI-ROL-05`); +1 current AP if ally **was** force-moved; skip if unshoved or at max AP |
| `ROLE-DRIFT-SIP` | `bishop` **without** heal | proposed `drift_sipper` | `starter-frost`, `spell-drift-sip` | caster; steal 1 leftover AP iff they were force-moved; stand / unshoved is 0; skip if force flag missing |
| `ROLE-DRIFT-POST` | `rook` **without** heal | proposed `drift_prelate` | `physical_attack`, `spell-drift-post` | `isSummoner` for driftpost only; post `summonAI: "driftpost"`, empty kit, remaining cap ≥ 1; relocate landing deals 10 and it dies; **walk onto is safe** |
| `ROLE-HEAVE-BOUNCE` | `queen` **without** heal | proposed `heave_bouncer` | `starter-frost`, `spell-heave-bounce` | artillery; 12 to primary; bounce 1 to nearest **other** force-moved hostile; missing second flag → 12 only |
| `ROLE-MUST-DRIFT` | `knight` **without** heal | proposed `must_drifter` | `physical_attack`, `spell-must-drift` | controller; remaining walks follow `lastForcedMoveDir`; 0 walk legal; skip if dir missing **or** that vector is the only exit |
| `ROLE-VERSE-PACE` | `bishop` **without** heal | proposed `verse_pacer` | `starter-frost`, `spell-verse-pace` | controller; last id **illegal until they walk**; skip if no last id or they already walked; shove does **not** peel |
| `ROLE-INCH` | `bishop` **without** heal | proposed `inch_warder` | `starter-frost`, `spell-inch-stride` | caster; **one** next walk Chebyshev ≤ 1; last writer vs Must Step; 0 walk legal |
| `ROLE-RITE` | `knight` **without** heal | proposed `rite_holder` | `physical_attack`, `spell-rite-first` | controller; cannot Strike until they resolve a **spell**; spells stay legal |
| `ROLE-LONG-OATH` | `bishop` **without** heal | proposed `long_oather` | `starter-frost`, `spell-long-oath` | caster; next spell must have range ≥ 3; Strike remains legal; Frost at 1 fizzles |
| `ROLE-CINDER-REEL` | `queen` **without** heal | proposed `cinder_reeler` | `starter-frost`, `spell-cinder-reel` | caster; pull 1 toward nearest **hazard**; skip if no living hazard or dest blocked / is the hazard cell |
| `ROLE-SIDE-BITE` | `bishop` **without** heal | proposed `side_biter` | `starter-frost`, `spell-side-bite` | artillery; +8 iff caster has adj **ally**; skip if isolated |
| `ROLE-INGRESS` | `pawn` or `bishop` **without** heal | proposed `ingress_marker` | `physical_attack`, `spell-ingress-mark` | setter; cell paint detonates on **enter**; stand at paint time is free; blink / Swap on is 10; skip empty |
| `ROLE-OFF-PLATE` | `rook` **without** heal | proposed `off_plater` | `physical_attack`, `spell-off-plate` | guardian; next **off-turn** damaging hit → 0; skip if they would only be hit on their own turn; Slow does not consume |
| `ROLE-SPIKE-SKIP` | `knight` **without** heal | proposed `spike_skipper` | `physical_attack`, `spell-spike-skip` | flanker; next **1-tile** walk treats spikes as floor; lava / pit / void / barriers still illegal |
| `ROLE-TAPPED-PLATE` | `rook` **without** heal | proposed `tapped_plater` | `physical_attack`, `spell-tapped-plate` | guardian; leftover AP 0 → +RES; skip if leftover ≥ 1 |
| `ROLE-BRACE` | `bishop` **without** heal | proposed `brace_chanter` | `starter-frost`, `spell-summon-brace` | buffer; allied summons ignore forced move, 2 turns; skip if no living allied summon |
| `ROLE-BAR-MEND` | `queen` **with** heal | proposed `bar_mender` | `spell-bar-mend`, `starter-shield` | healer; skip if target did not resolve a **spell** this turn or missing HP < 8; Strike does not pay |
| `ROLE-PIN` | `bishop` **without** heal | proposed `cadence_pinner` | `starter-frost`, `spell-cadence-pin` | controller; one remaining CD **does not tick**; skip if highest remaining < 2; never invent a 0→lock |
| `ROLE-STILL-TAX` | `bishop` **without** heal | proposed `still_taxer` | `starter-frost`, `spell-still-tax` | caster; next spell +1 AP if they **camped last turn**; skip if they walked last turn |
| `ROLE-BRICK-SPROUT` | `rook` **without** heal | proposed `brick_sprouter` | `physical_attack`, `spell-brick-sprout` | setter; grow **one** adjacent barrier 1 cell; skip if none; does not mint a new wall from empty floor |
| `ROLE-WATCH-FEE` | `pawn` **without** heal | proposed `watch_feer` | `physical_attack`, `spell-watch-fee` | controller; next overwatch snap also costs the walker 1 AP (still deals); skip if no overwatch in play |
| `ROLE-LONE-PURSE` | `knight` **without** heal | proposed `lone_purser` | `physical_attack`, `spell-lone-purse` | flanker; skip unless leftover AP is **exactly 1**, unless 10 still kills |
| `ROLE-BANNER-CUT` | `knight` **without** heal | proposed `banner_cutter` | `physical_attack`, `spell-banner-cut` | flanker; +10 iff target `isLeader`; never name-parse `"boss"`; Dummy Post is not a leader |

Drop-2…12 `ROLE-SPARE` / `ROLE-SNIPER` / `ROLE-PUSHER` / `ROLE-IGNITE` / `ROLE-SEAL` / `ROLE-WARDEN` / `ROLE-TANK` / `ROLE-GOAD` / `ROLE-QUIET-SILL` / `ROLE-HAZARD` / `ROLE-KITER` / `ROLE-ONCE` / `ROLE-TEMPO` / `ROLE-TURRET` / `ROLE-BRUISER` / `ROLE-FUSE` / `ROLE-LANCER` / `ROLE-GLYPH` / `ROLE-SPLIT-MEND` / `ROLE-LAST-MUTE` / `ROLE-BOTH-MEND` / `ROLE-SHOVE-STING` / `ROLE-NEAR-HOOD` / `ROLE-PAIR-PACE` are reused below. Do not also roll the random 12% summoner overlay onto Heave-mend, Keep, Halve, Hood, Ready, Step, Sill, Hold, Lend, Sip, Bounce, Drift, Pace, Inch, Rite, Oath, Reel, Bite, Mark, Plate, Skip, Brace, Bar, Pin, Tax, Sprout, Fee, Purse, or Cut. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** triple-span **or** spark **or** dummy **or** quad **or** penta **or** sept **or** driftpost — never two). Sept occupies the stationary-post **and** the multi-cell cap (7). Drift Post occupies the stationary-post cap (1) and is **not** a multi-cell system.

### Fair-fight rules (every sheet)

Same as drops 1–12, plus Wave 12:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, drift-sill that is the only aisle, ingress that is the only aisle, heave-step dest that is the only aisle, sept plus that seals every gallery, or a drift-hold that nails the only exit.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Heave Mend: heal 8 iff **caster and target** both force-moved. Keep one unshoved; it is a Shield queen.
- Dual Keep: banks leftover AP (cap 2) **and** leftover walk MP (cap 2) to next own turn start. Kill them before that start. Not Timestep. Not Purse Keep. Not Stride Keep.
- Sept Span: stretched-plus occupy, counts as 7, empty kit, 8 shared HP. Burst the 8. Walk a far diagonal. Sit on the origin. **Do not spawn until remaining cap ≥ 7.**
- Cadence Halve: remaining ≥ 1 → `floor(n/2)`. Sit on CD-0 ids. Once-per-battle flags are not CDs.
- Mid Hood: next hit from Chebyshev **exactly 2** misses, then consume. Hits from 1 or 3 land. DoT / lava do not consume.
- Ready Sting: 10, +8 if leftover AP ≥ 1 **and** leftover MP ≥ 1. Spend one wallet to 0.
- Heave Step: caster lands on a free Chebyshev-1 of a **force-moved** ally. Occupy the ring. Landing hazards tick. Walk-spend does **not** increment.
- Drift Sill: occupant cannot be a relocate dest. Walk onto is legal. Shove / Swap / Heave Step onto fizzles (AP spent).
- Drift Hold: cannot spend walk MP until force-moved. Strike does **not** peel. Spells stay legal.
- Drift Lend: +1 current AP to an ally who **was** force-moved. Root / Drift Sill the carry first, or isolate.
- Drift Sip: steal 1 leftover AP iff they were force-moved. Unshoved is 0.
- Drift Post: relocate landing deals 10 and it dies. **Walk onto is safe.** Counts as 1.
- Heave Bounce: 12 + bounce 12 to another force-moved hostile. Isolate so the bounce has no flag.
- Must Drift: remaining walks follow last forced-move dir. Stand (0 walk) is legal. Relocate any length is legal.
- Verse Pace: last resolved id illegal until they walk. Shove does **not** peel. Recast a different id, or take the step.
- Inch Stride: **one** next walk Chebyshev ≤ 1. Take a legal 1-step, or stand.
- Rite First: cannot Strike until they resolve a spell. Cast Frost, then Strike. Quiet Sill stays off this PAIR.
- Long Oath: next spell must have range ≥ 3. Frost at 1 fizzles. Strike stays legal.
- Cinder Reel: pull 1 toward nearest hazard. Wipe / step off the hazard. Occupy the toward-tile. Dest must not **be** the hazard.
- Side Bite: 10+8 if caster has adj ally. Isolate the biter.
- Ingress Mark: enter that cell → 10. Stand at paint time is free. Blink / Swap on pays.
- Off Plate: next off-turn damaging hit → 0. Hit them **on their turn**. Slow does not consume.
- Spike Skip: next 1-tile walk treats spikes as floor. Plug the gap. Lava / pit / void still illegal. Maps stay solvable for the **player**.
- Tapped Plate: leftover AP 0 → +RES. Keep them wanting a last AP.
- Summon Brace: allied summons ignore forced move, 2 turns. Fight without pets, or peel the Chanter.
- Bar Mend: heal 8 iff target resolved a **spell**. Don’t tool the carry. Strike does not pay.
- Cadence Pin: one remaining CD does not tick. Sit on CD-0. Flush is not this card.
- Still Tax: next spell +1 AP if they camped last turn. Cast after walking last turn, or Strike.
- Brick Sprout: grow one adjacent barrier 1 cell. Walk the other gallery. Does not edit `mapGen.ts`.
- Watch Fee: next overwatch snap also costs the walker 1 AP. The snap still deals. Walk another file.
- Lone Purse: 10+8 if leftover AP is **exactly 1**. Spend down to 0, or keep 2+.
- Banner Cut: 10+10 if target `isLeader`. Cut escorts first, or never mark a leader.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- Summons stay at cap 2 until a later engineer raises it. Sept is **illegal** at cap 2. Drift Post is legal at remaining ≥ 1.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-HEAVE-LEND` | PAIR | dual-force heal + force-moved AP grant | this drop |
| `FSN-DUAL-READY` | PAIR | leftover-AP+MP bank + leftover-pair poke | this drop |
| `FSN-MID-DRIFT` | PAIR | exact-2 miss + leftover walks follow shove dir | this drop |
| `FSN-CINDER-MARK` | PAIR | pull toward hazard + cell-enter detonate | this drop |
| `FSN-DRIFT-GATE` | CELL | relocate-landing post + tile rejects relocate dest | this drop |
| `FSN-SPIKE-TAP` | CELL | 1-tile spike skip + leftover-AP-0 +RES | this drop |
| `FSN-OFF-FEE` | CELL | off-turn miss + overwatch snap costs 1 AP | this drop |
| `FSN-INCH-OATH` | CELL | next walk ≤ 1 + next spell range ≥ 3 | this drop |
| `FSN-HEAVE-CHOIR` | BRIGADE | shove both, cash the dual-force 8, fund the follow-up | this drop |
| `FSN-DUAL-BANK` | BRIGADE | bank both wallets, poke leftover pair, steal the shoved AP | this drop |
| `FSN-MID-STEP` | BRIGADE | force leftover MP along the shove into exact-2 miss, then snipe from 3 | this drop |
| `FSN-HEAVE-QUIET` | BRIGADE | join the shoved gun, cover the file | this drop |
| `FSN-HALVE-PACE` | CADRE | 3→1 Inferno still illegal until they walk, then cash stacks | this drop |
| `FSN-RITE-LONG` | CADRE | unlock Strike only with a spell that may also be range-illegal | this drop |
| `FSN-BAR-PIN` | CADRE | cash the unlocking spell, freeze Inferno so they cannot recast | this drop |
| `FSN-DRIFT-COURT` | COURT | nail feet until shove, then only along that vector | this drop |

Named packs as variants: `FSN-CINDER-MARK/EMBER` (Cinder Ingress), `FSN-DRIFT-GATE/STING` (Drift Gate full), `FSN-INCH-OATH/STING` (Inch Reach), `FSN-SPIKE-TAP/REAVE` (Spike Tapped), `FSN-OFF-FEE/GUN` (Off Watch), `FSN-HEAVE-CHOIR/BOUNCE` (Bounce File), `FSN-BAR-PIN/STILL` (Still Sprout), `FSN-DRIFT-COURT/SEPT` (Sept Plug — skip until cap ≥ 7), `FSN-DRIFT-COURT/BRACE` (Side Brace), `FSN-DRIFT-COURT/BANNER` (Lone Banner).

---

## Formations

### FSN-HEAVE-LEND

FORMATION_ID: `FSN-HEAVE-LEND`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-HEAVE-MEND` — `queen` **with** heal / proposed `heave_mender` — pack median — back
- `ROLE-DRIFT-LEND` — `bishop` **without** heal / proposed `drift_lender` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Heave Mend is a heal kit; kit band 0 has no heal). Show `FSN-SHOVE-BASH` instead (target-only force heal without the dual gate).
- Mender kit: Heave Mend + Shield. **No** Inferno, no Enrage, no Both / Clash / Shove / Chase / Bar Mend (PAIR bans).
- Lender kit: Drift Lend + Frost. **No** Spent / Spare / Boot Lend / Tempo on PAIR (those are `FSN-HEAVE-CHOIR` / `FSN-BOTH-SPEND`).
- Elite: Lender only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-SHOVE-BASH` **or** `FSN-BOTH-SPEND` (player has seen a force-gated heal **or** a dual-walk heal; this sheet swaps the gate to **two bodies already shoved**).
- Random 30% family lottery is **off**.
- Force-move writers required. Walk does **not** arm Heave Mend.

SPELL_POOL_INTERACTIONS:

- Heave Mend (8 HP) pays only if **both** already have `forcedMovedThisTurn`. One still body is 0 HP — Shield queen.
- Drift Lend is +1 current AP to the Mender **after** she was shoved, so the follow-up tool is funded. It is not ungated Tempo.
- No drain / nova (healAmount → healer inference; the Lender would stop lending).

TACTICAL_PLAN:

- Turn 1: Lender holds until a shove already landed on the Mender; if she is still, Lender Frosts.
- Mender Heave-Mends only if both flags are true **and** missing HP ≥ 8; else Shields.
- Neither body shoves **only** to enable the 8 if a Strike would kill.

SYNERGY:

- Dual-force healer + force-moved buffer. Wave 11 Both Mend standing on Wave 10 Shove. Combination, not a new sprite. Remaining unshoved is a complete answer.

PLAYER_THREAT:

- Slow refill if you bash both bodies. Spike is low. Misplay is Rooting neither and dumping AP into an 8 that just landed.

COUNTERPLAY:

- Keep one body unshoved (Root the queen **or** don’t bash the carry). Cursed Wound halves the 8. Kill the Mender (glass RES). The Lender without a shoved ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Lender that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced shove + dual-heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if either flag is 0.
- Lender: ally-first (`AI-ROL-05`). Until apply actually buffs `targetId`, this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-HEAVE-LEND/E-LEND` — elite Lender, still no Spare Pace on PAIR.
- `FSN-HEAVE-CHOIR` is the BRIGADE with Bruiser — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-DUAL-READY

FORMATION_ID: `FSN-DUAL-READY`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-DUAL-KEEP` — `bishop` **without** heal / proposed `dual_keeper` — pack median — back
- `ROLE-READY` — `knight` **without** heal / proposed `ready_stinger` — pack median or −1 — starts wide

VARIANT_RULES:

- Distinct from `FSN-DRY-TAX` (leftover-**AP** = 0 poke) and `FSN-STRIDE-DAMP` (leftover-**MP** bank + leftover-MP poke). Pressure is **both wallets they chose not to spend**.
- Band 0: Keeper Frost only; Ready is ordinary Strike (Ready Sting is band 1). If kit band is still 0, **do not spawn this id** — show `FSN-STRIDE-DAMP`.
- Elite: Ready only. Keeper never gets Purse Keep or Stride Keep (PAIR bans).
- Unlock after `FSN-STRIDE-DAMP` **or** `FSN-DRY-KEEP` (player has seen leftover-MP **or** leftover-AP as a resource).
- Lone Purse / Dry / Damp stay off PAIR (PAIR bans). Drift Sip stays off (that is `FSN-DUAL-BANK`).
- Leftover-AP+MP bank writer required. Death before next start expires the bank.

SPELL_POOL_INTERACTIONS:

- Dual Keep: once/battle, cap 2 leftover AP **and** cap 2 leftover walk MP paid at next own turn start. Not a queue splice. Not two separate Keep cards.
- Ready Sting: 10, +8 iff leftover AP ≥ 1 **and** leftover MP ≥ 1. Spend **one** wallet to 0 **this** turn; Keep does not empty leftover until next start.
- Frost from Keeper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Keeper Holds Keep if leftover AP ≥ 1 **and** leftover MP ≥ 1 and they still need a kite+cast next turn; else Frosts.
- Ready lurks at 3 and commits when both leftovers are ≥ 1 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-pair bank + leftover-pair poke. Wave 10 Purse Keep and Wave 11 Stride Keep standing on one body. You see both unspent wallets; the knife waits for the pair.

PLAYER_THREAT:

- High if you bank 2 AP and 2 tiles and trade the Ready. Low if you empty one wallet. Not unavoidable: spend the last AP **or** the last tile, or kill the Ready and eat Frost.

COUNTERPLAY:

- Spend leftover AP **or** leftover walk. Kill the Ready (`hp` ~0.75). Force the Keeper to leave a hazard this turn (bank refuses). Dry Sting / Damp Sting the remaining wallet if you brought it.

MAP_REQUIREMENTS:

- `openField` or `arena`. Ready needs a flank path that is not the only exit. Keeper needs a retreat tile.
- No Time Warp (panic + leftover tax).

AI_REQUIREMENTS:

- Keep: buffer; skip if either leftover is 0; heal-less so inference stays caster.
- Ready: flanker + leftover-pair hold.
- Soph 1–2.

VARIANTS:

- `FSN-DUAL-READY/E-READY` — elite Ready, still no Drift Sip on PAIR.
- `FSN-DUAL-BANK` is the BRIGADE with Sip — do not merge.

STATUS: PROPOSED

---

### FSN-MID-DRIFT

FORMATION_ID: `FSN-MID-DRIFT`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-MID-HOOD` — `pawn` or `knight` **without** heal / proposed `mid_hooder` — pack median + 1 — front
- `ROLE-MUST-DRIFT` — `knight` **without** heal / proposed `must_drifter` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-NEAR-MUST` (≤1 miss + force a **1-step**) and `FSN-WICK-HOOD` (Far Hood, hits from ≥ 3 → 0). This is exact-**2** miss + leftover walks follow the **shove dir**.
- Band 0: Hood is a fat Strike body. Drifter is ordinary Strike but **only commits a Must Drift if `lastForcedMoveDir` exists and a legal step along that vector remains**.
- Band 1: Hood gains Mid Hood. Drifter gains Must Drift.
- Elite: Hood only. Drifter stays junior so two elites cannot pin the shove-dir into a closet.
- Unlock after `FSN-NEAR-MUST` **or** `FSN-HOLD-RANGE` (player has seen a range-gated miss **or** a walk lock).
- Near Hood / Far Hood / Must Step / Inch stay off PAIR (PAIR bans).
- If the map has no legal step along a typical shove vector, **reroll this id**.
- `forcedMovedThisTurn` **and** `lastForcedMoveDir` required. Walk MP must not set them.

SPELL_POOL_INTERACTIONS:

- Mid Hood: next damaging `dealDamage` from Chebyshev **exactly 2** misses, then consume. Hits from 1 or 3 land. DoT / lava do not consume.
- Must Drift: remaining walks this turn must follow `lastForcedMoveDir`. Stand (0 walk) is legal. Relocate any length is legal.
- Iron Skin on Hood is RES, not a second miss shield.

TACTICAL_PLAN:

- Hood stands in a **wide** lane and Hoods if a hostile can poke from 2 this turn.
- Drifter Must-Drifts only when a shove already landed **and** a walk-off that is **not** the forced vector remains (stand is the designed answer).
- Never turn-1 Must Drift into a dead-end.

SYNERGY:

- Anti-midrange + movement controller. Wave 11 Near Hood standing on Wave 12 shove-dir. Closing to 1 answers Hood; standing answers Drift — unless you keep walking the shove.

PLAYER_THREAT:

- Readable geometry. Misplay is dumping a 2-step poke into Mid Hood after Must Drift ate the side peel. Recoverable: step to 1 or 3, Poison, wait 2 turns, or stand.

COUNTERPLAY:

- Stand (0 walk legal). Hit from 1 or 3. DoT the Hood. Kill the Drifter (it is not a 2.5× HP golem). Swap / blink (relocate ignores Must Drift).

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with **wide** files. Reject `corridorMaze` (shove-dir in a hallway is a lock **or** useless).
- No lava on the only legal shove-dir step.

AI_REQUIREMENTS:

- Hood: guardian; skip if no Chebyshev-2 threat.
- Drifter: controller; skip if dir missing **or** that vector is the only exit.
- Soph 1–2.

VARIANTS:

- `FSN-MID-DRIFT/PAWN` — Hood chassis `pawn`.
- `FSN-MID-STEP` is the BRIGADE with Glass Sniper — do not merge.

STATUS: PROPOSED

---

### FSN-CINDER-MARK

FORMATION_ID: `FSN-CINDER-MARK`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-CINDER-REEL` — `queen` **without** heal / proposed `cinder_reeler` — pack median — back
- `ROLE-INGRESS` — `pawn` or `bishop` **without** heal / proposed `ingress_marker` — pack median — paints a **flank** cell beside a living hazard, never the only aisle

VARIANT_RULES:

- Distinct from `FSN-PAINT-NOOK` (pull toward **paint** + exactly-one-block) and `FSN-FOE-FANG` (pull toward a **body**). This is pull toward **hazard**, then cash **enter** on a painted cell beside it.
- Band 0: **do not spawn this id** (Cinder Reel needs a living hazard; Ingress Mark is not on default kits). Show `FSN-PAINT-NOOK` or `FSN-EMBER-MEND` instead.
- Reeler kit: Frost + Cinder Reel. **No** Paint / Foe / Ally / File Reel (PAIR bans). **No** Ember body on PAIR (`FSN-CINDER-MARK/EMBER`).
- Marker kit: Ingress Mark + Strike. **No** Stride / Exit / Fuse / Enter Mend (PAIR bans).
- Elite: Marker only. Reeler stays junior so two displacement elites cannot pin.
- Unlock after `FSN-PAINT-NOOK` **or** `FSN-EMBER-RIFT` (player has seen a reel **or** a hazard displacer).
- Weight 0 on maps with no lava / ember-wake / cinder / pit cell. Reroll if no living hazard at spawn.
- Cinder Reel dest: free floor, **not** the hazard cell, not lava / pit / void / portal, player keeps ≥ 1 escape tile.

SPELL_POOL_INTERACTIONS:

- Cinder Reel: pull 1 toward nearest hazard. Fifth `applyAttract` dest. Step off / wipe the hazard is the counter.
- Ingress Mark: cell paint; enter deals 10. Stand at paint time is free. Blink / Swap onto pays. Leave-then-reenter pays.
- Frost after a reel is a tax, not a root.

TACTICAL_PLAN:

- Marker paints a **flank** cell beside the hazard, never the only tile that reaches the Reeler.
- Reeler Reels only when Chebyshev ≥ 2, hazard exists, landing is **not** the hazard **and** not safer for the player, and a walk-off remains.
- Never turn-1 double onto one tile.

SYNERGY:

- Displacement + enter-hazard assassin. Wave 11 Paint Reel’s cousin on **cinder**. The board slams you toward fire; you can still stop short of the paint.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got reeled onto the enter-paint beside lava.” Recoverable: occupy the toward-tile, stand at paint time, keep a tile behind you.

COUNTERPLAY:

- Occupy the toward-tile. Stand on the paint **before** it arms (free). Blink past (pays 10 — optional). Fight off the hazard file. Kill the glass Marker.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with **one** lava/cinder flavor cell **and** one clean approach. Reject lava-painted engagement with no clean aisle (unavoidable).
- No Void Rift tile as a legal landing. Dest must not be the hazard.

AI_REQUIREMENTS:

- Reeler: caster + hazard-attract legality (landing walkable, not the hazard, player retains ≥ 1 escape, skip if no hazard).
- Marker: setter; never mark the only exit; never the hazard cell itself.
- Soph 2–3.

VARIANTS:

- `FSN-CINDER-MARK/EMBER` — BRIGADE **Cinder Ingress**: add `ROLE-HAZARD` (`ember_knight`). Pull onto the enter-paint beside live cinder. Still one clean aisle. At most one Inferno cadence. Unlock after this PAIR **and** `FSN-EMBER-MEND`. Ember melee-burn is the living hazard; it is **not** a second reel.
- `FSN-CINDER-MARK/E-MARK` — elite Marker, still no Stride Mark.

STATUS: PROPOSED

---

### FSN-DRIFT-GATE

FORMATION_ID: `FSN-DRIFT-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-DRIFT-POST` — `rook` **without** heal / proposed `drift_prelate` — pack median
- `ROLE-DRIFT-SILL` — `rook` **without** heal / proposed `drift_siller` — pack median — paints a **gallery** tile, not the only aisle

VARIANT_RULES:

- Distinct from `FSN-SHOVE-PACE` (force-landing 8 + pair translate) and dummy / bait posts. Pressure is **relocate landing detonates**, then a tile that **rejects** the next shove dest. Walk onto the post is **safe**.
- CELL: one Drift Post, one Drift Sill. Siller will not paint both approaches. Prelate will not plant on the only exit.
- Elite: Siller only. Prelate stays junior so two tile-locks cannot seal the pocket.
- Unlock after `FSN-SHOVE-PACE` **or** `FSN-ALLY-SILL` (player has seen a landing tax **or** a tile lock).
- Dummy / Bait / Ingress / Shove Sting / Fuse stay off CELL (PAIR bans). `FSN-DRIFT-GATE/STING` adds Shove Sting as a **third**.
- Drift Post remaining cap ≥ 1. `summonAI === "driftpost"`. Do not also roll wolf.
- Force-move writers required for the detonate. Walk-on must deal **0**.

SPELL_POOL_INTERACTIONS:

- Drift Post: empty-kit body. Relocate landing deals 10 and it dies. Walk onto is safe. Counts as 1.
- Drift Sill: occupant cannot be a relocate dest. Walk through. Shove / Swap / Heave Step onto fizzles (AP spent).
- Do not also attach Quiet Sill / Cast Sill (tile that forbids Strike + tile that forbids tools + tile that forbids landing is COURT-adjacent).

TACTICAL_PLAN:

- Siller paints a **flank choke**, never the only tile that reaches the Prelate.
- Prelate plants on a **second** gallery tile so a shove toward the Siller lands on the post — not toward the only exit.
- Never turn-1 surround.

SYNERGY:

- Landing bomb + anti-relocate tile. Teaching pair for Drift Gate without the sting yet. Information (where is the sill? where is the post?) plus a peel. Walking is the designed answer.

PLAYER_THREAT:

- Frustration and a wasted Swap if you land on the post. Not a lock: walk onto the post, walk through the sill, second approach exists.

COUNTERPLAY:

- Walk onto the post (0). Walk through the sill. Occupy the planned landing. Kill the Siller. Isolate so no legal shove dest remains.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile closet (post + sill on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Prelate: skip if remaining cap < 1 or plant cell is the only player exit; `summonAI === "driftpost"`.
- Siller: never sill the only backliner approach; never also Quiet / Cast.
- Soph 2–3.

VARIANTS:

- `FSN-DRIFT-GATE/STING` — BRIGADE **Drift Gate**: add `ROLE-SHOVE-STING` (`shove_stinger`). Post detonates the landing; tile also rejects relocate; sting the rest. **Never PAIR Drift Post with Shove Sting** — this three-body is the lesson. Unlock after this CELL **and** `FSN-SHOVE-PACE`. `forcedMovedThisTurn` required. Walk-on post is still 0; walk-on sting is still 0.
- `FSN-DRIFT-GATE/E-SILL` — elite Siller, still no Quiet.

STATUS: PROPOSED

---

### FSN-SPIKE-TAP

FORMATION_ID: `FSN-SPIKE-TAP`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SPIKE-SKIP` — `knight` **without** heal / proposed `spike_skipper` — pack median
- `ROLE-TAPPED-PLATE` — `rook` **without** heal / proposed `tapped_plater` — pack median + 1

VARIANT_RULES:

- Distinct from `FSN-LAVA-STILL` (1-tile **lava** skip + leftover-**MP** 0 +RES) and `FSN-DRY-TAX` (leftover-AP 0 **damage**). This is **1-tile spike as floor**, then leftover-**AP** 0 → +RES.
- Weight 0 on maps with no spikes. Reaver body as the file flavor is `FSN-SPIKE-TAP/REAVE`, not this base (PAIR ban vs skipper+reaver as a two-hazard PAIR — the variant is the three-body lesson).
- Elite: Skipper only. Plater stays junior so two elites cannot force a 0-leftover plate on the only bridge.
- Unlock after `FSN-LAVA-STILL` **or** `FSN-SLIP-PIT` (player has seen a skip **or** a pit knight).
- Lava Skip / Pit Skip / Empty Plate / Dry Sting stay off (PAIR bans). Maps stay solvable for the **player** — spike skip does **not** ignore lava / pit / void / barriers.
- Skip is next **1-tile** walk only. A 2-step onto spikes still ticks.

SPELL_POOL_INTERACTIONS:

- Spike Skip: next 1-tile walk treats spikes as floor. Plug the gap. Lava Skip is not this card.
- Tapped Plate: 0 leftover AP → +RES. Spend the last AP, then plate. Dual Keep does **not** empty leftover this turn.
- Iron Skin on the Plater is RES, not a second leftover gate.

TACTICAL_PLAN:

- Skipper takes a 1-tile spike bridge the player does not have to take. It does not camp the only clean aisle.
- Plater walks into a **wide** lane and Plates when leftover AP is 0.
- If the Skipper dies, remaining body is a leftover-AP plate — intended.

SYNERGY:

- Kiter skip + leftover-AP tank. Wave 11 Lava Still’s cousin on **spikes** and the **AP** wallet. The nails are optional geography; the plate is the tax for emptying the bar.

PLAYER_THREAT:

- Positional. Failure is chasing across spikes then dumping Strike into a fresh +RES. Recoverable: take the clean aisle, keep 1 leftover AP.

COUNTERPLAY:

- Don’t chase onto spikes. Keep 1 leftover AP. Frost the Skipper. Walk around the Plater (`mp: 1` golem-poor). DoT chews RES.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with **one** spike flavor bridge **and** one clean approach. Reject spike-painted engagement with no clean aisle (unavoidable).
- Plater needs a retreat tile that is not the spike bridge.

AI_REQUIREMENTS:

- Skipper: flanker; skip if no spike cell is an **optional** 1-step (never the only player path).
- Plater: guardian; skip if leftover AP ≥ 1.
- Soph 2–3.

VARIANTS:

- `FSN-SPIKE-TAP/REAVE` — BRIGADE **Spike Tapped**: add `ROLE-BRUISER` flavor `rust_reaver`. Cross the spike, then leftover-AP-0 +RES. Still one clean aisle. At most one Inferno cadence. Unlock after this CELL **and** `FSN-ROT-CUT`.
- `FSN-SPIKE-TAP/E-SKIP` — elite Skipper, still no Lava Skip.

STATUS: PROPOSED

---

### FSN-OFF-FEE

FORMATION_ID: `FSN-OFF-FEE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-OFF-PLATE` — `rook` **without** heal / proposed `off_plater` — pack median + 1
- `ROLE-WATCH-FEE` — `pawn` **without** heal / proposed `watch_feer` — pack median − 1

VARIANT_RULES:

- Distinct from `FSN-BRICK-WATCH` (erase barrier + mute overwatch) and `FSN-WICK-HOOD` (Far Hood). This zeros the next **off-turn** hit, then the snap they walk into also **costs 1 AP** (and still deals).
- CELL: Plater plates if they would be hit off-turn. Feer fees the snap they walk into. **Do not mint a new overwatch** — if none exists at spawn, Feer Strikes until the player plants one (still a valid soft CELL).
- Elite: Plater only. Feer stays junior.
- Unlock after `FSN-BRICK-WATCH` **or** when the player’s last fight used Barrier / a file overwatch (relative, not a level gate).
- Far Hood / Morrow / Sidestep / Tick / Foe Plate / Mid Hood / Watch Mute stay off (PAIR bans). Turret is `FSN-OFF-FEE/GUN`.
- Off Plate: Slow does **not** consume. Hit them on their turn. Watch Fee: the snap still **deals**. Walk another file.

SPELL_POOL_INTERACTIONS:

- Off Plate: next off-turn damaging hit → 0, then consume. Hits on the Plater’s own turn land.
- Watch Fee: next overwatch snap also costs the walker 1 AP. Hits that are not overwatch land. Timeout 1 trigger.
- Strike from Plater is ordinary. Do not give the Feer Inferno.

TACTICAL_PLAN:

- Plater holds a **wide** lane and Plates if a hostile can Strike this turn **before** the Plater acts.
- Feer camps a gallery file and Fees if overwatch is armed; else Strikes when reachable.
- Never turn-1 plate + fee on a full-HP player in a closet.

SYNERGY:

- Off-turn miss + anti-ranged tax. Wave 11 Watch Mute’s cousin that **still hurts**. You waited for their turn; the snap you walked into also taxed the bar.

PLAYER_THREAT:

- Tempo. Failure is dumping Strike off-turn into a fresh plate, then walking the fee’d file. Recoverable: hit them on their turn, walk a second file, physical the Feer.

COUNTERPLAY:

- Hit the Plater **on their turn**. Don’t overwatch the fee’d file. Walk the other gallery. Kill the Feer (glass pawn). Player Timestep (enemy cannot have it).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with two files. Reject a single-tile tunnel (off-turn miss + fee’d snap on the only file is a lock).
- At least one legal player overwatch plant that is not the only exit **or** a pre-existing file.

AI_REQUIREMENTS:

- Plater: skip if they would only be hit on their own turn.
- Feer: skip if no overwatch in play this fight (then this is a soft Strike pawn — fine).
- Soph 2–3.

VARIANTS:

- `FSN-OFF-FEE/GUN` — BRIGADE **Off Watch**: add `ROLE-TURRET` (`stone_castellan`). Off-turn miss, then the snap they walk into also costs 1 AP. Cap 1 turret, remaining cap ≥ 1. `summonAI === "turret"`. Do not also roll wolf. Unlock after this CELL **and** `FSN-BRICK-WATCH/GUN`. Still no Watch Mute. Still no Brick Sprout on this id (`FSN-BAR-PIN/STILL`).
- `FSN-OFF-FEE/E-PLATE` — elite Plater, still no Far Hood.

STATUS: PROPOSED

---

### FSN-INCH-OATH

FORMATION_ID: `FSN-INCH-OATH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-INCH` — `bishop` **without** heal / proposed `inch_warder` — pack median
- `ROLE-LONG-OATH` — `bishop` **without** heal / proposed `long_oather` — pack median

VARIANT_RULES:

- Distinct from `FSN-NEAR-MUST` (all remaining Chebyshev **exactly** 1) and `FSN-BOOT-OATH` (cannot walk until Strike, then range **≤ 1**). This caps **one** next walk at ≤ 1, then forbids confirms **under 3**.
- CELL: one Inch, one Long Oath. Inch will not fire if no legal 1-step exists. Oather will not Oath if their next legal id is already range ≥ 3 or Strike.
- Elite: Inch only. Oather stays junior so two elites cannot pin a 1-step into a closet **and** fizzle every short confirm.
- Unlock after `FSN-NEAR-MUST` **or** `FSN-BOOT-OATH` (player has seen a walk-shape lock **or** a range oath).
- Must Step / Must Span / Pair Stride / Near Oath / Far Stinger stay off (PAIR bans). `FSN-INCH-OATH/STING` adds Far Stinger as a **third**.
- If the map has no legal Chebyshev-1 step from typical stand, **reroll**.

SPELL_POOL_INTERACTIONS:

- Inch Stride: **one** next walk Chebyshev ≤ 1. Last writer vs Must Step. Stand (0 walk) is legal. Relocate any length is legal.
- Long Oath: next spell must have range ≥ 3. Frost at 1 fizzles. Strike stays legal — that is the designed door when you cannot step to 3.
- Do not also attach Near Oath (range ≤ 1 + range ≥ 3 is a full lockout).

TACTICAL_PLAN:

- Inch Inches only when a 1-step exists **and** a tile at 3 remains after that step (or Strike is legal).
- Oather Oaths if a range<3 id is the next legal **and** a ≥3 lane exists.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.

SYNERGY:

- Movement controller + min-range gun. Wave 11 Must Step standing on Wave 12 Long Oath. Closing answers Inch and pays the Oath — unless you Strike or stop.

PLAYER_THREAT:

- Structured tempo. Failure is dumping Frost at 1 under Oath after Inch ate the 2-step peel. Recoverable: Strike, stand, or walk the legal 1 then cast from 3.

COUNTERPLAY:

- Stand. Strike (always legal). Cast from ≥ 3. Blink / Swap (relocate ignores Inch). Kill the Oather (glass).

MAP_REQUIREMENTS:

- `openField` or `arena` with a **main lane plus one side aisle** and a ≥3 Frost lane. Reject `corridorMaze` (1-step + min-range in a hallway is a lock).
- No lava on the only 1-step.

AI_REQUIREMENTS:

- Inch: skip if no legal 1-step **or** that step is the only exit.
- Oather: skip if their next id is already range ≥ 3 or Strike; never with Near Oath.
- Soph 2–3.

VARIANTS:

- `FSN-INCH-OATH/STING` — BRIGADE **Inch Reach**: add `ROLE-KITER` flavor `far_stinger`. Cap next walk at 1, then forbid confirms under 3, then extras from 3. **Never PAIR Long Oath with Far Stinger** — this three-body is the lesson. Unlock after this CELL **and** `FSN-GLASS-WARD`. Still no Near Oath.
- `FSN-INCH-OATH/E-INCH` — elite Inch, still no Must Step.

STATUS: PROPOSED

---

### FSN-HEAVE-CHOIR

FORMATION_ID: `FSN-HEAVE-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-HEAVE-MEND` — `queen` **with** heal / proposed `heave_mender` — pack median
- `ROLE-DRIFT-LEND` — `bishop` **without** heal / proposed `drift_lender` — pack median
- `ROLE-PUSHER` — `pawn` or `knight` / proposed `bash_bruiser` — pack median + 1 — Shoulder Bash

VARIANT_RULES:

- Unlock after `FSN-HEAVE-LEND`. Wave 12 “Heave Choir.”
- Elite: Bruiser only. Mender and Lender stay junior so two gift elites cannot fund a lock shove.
- Bash is the **one** rare. Spare / Tempo / Spent stay off (PAIR bans vs Drift Lend). Never a two-gift PAIR — this **three-body** is the lesson.
- Heave Mend still needs **both** force-moved. Bash can set **one** flag; the player (or a second shove) must set the other — or the 8 is 0.
- No Inferno on the queen. No Both / Clash / Bar Mend.
- Dest still banned from lava / void. Dest must leave a walk-off.

SPELL_POOL_INTERACTIONS:

- Shoulder Bash: 2-step ray. Skip bash into open floor (VETERAN). Sets `forcedMovedThisTurn` + `lastForcedMoveDir` on the moved body.
- Drift Lend: +1 current AP after the Mender accepted a shove. Heave Mend cashes 8 only if **both** flags are true. Root one body and the 8 is 0.
- Shield on the Mender is RES, not a second heal engine.

TACTICAL_PLAN:

- Bruiser Bashes toward a wall **beside** the engagement, never the last exit, and never **only** to arm Heave if a Strike would kill.
- Lender Lends after the Mender has been shoved. Mender Heave-Mends only if both flags are true.
- If the player never lets both get shoved, this is a softer `FSN-HEAVE-LEND` plus a bash pawn — fine.

SYNERGY:

- Shove both bodies, cash the dual-force 8, fund the follow-up. Combination of Wave 2 bash with Wave 12 Heave / Drift Lend.

PLAYER_THREAT:

- Long refill if you accept two shoves. Spike is low. Interruptible: Root the queen, occupy bash dest, wait the CD.

COUNTERPLAY:

- Keep one body unshoved. Occupy the bash dest. Cursed Wound. Burst the Mender. Isolate so Drift Lend has no legal shoved ally.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells and at least one pillar. Reject `corridorMaze`.
- Mender needs two walk-offs that are not the only player exit.

AI_REQUIREMENTS:

- Same Heave / Drift Lend legality as `FSN-HEAVE-LEND`.
- Bruiser: charger; skip bash into open floor; dest scoring must not use lava; never bash **only** to arm Heave.
- Soph 3–4. `groupTactics` at 4: one focus.
- Ally `targetId` apply required. Force-move writers required.

VARIANTS:

- `FSN-HEAVE-CHOIR/NO-BASH` — fallback to `FSN-HEAVE-LEND` if Bash dest scoring is not ready.
- `FSN-HEAVE-CHOIR/BOUNCE` — CADRE **Bounce File**: replace Bruiser with `ROLE-HEAVE-BOUNCE` + `ROLE-FUSE` + `pair_slider`. Slide two hostiles, bounce 12+12 onto the wick. **Never PAIR Heave Bounce with Storm / Ricochet.** Unlock after this BRIGADE **and** `FSN-HOOK-FUSE`. Missing second force flag → 12 only. Fuse deals 0 on cast. Step off before the tick. Still no lava dest.
- `FSN-SHOVE-BASH` remains the PAIR force-heal; do not merge.

STATUS: PROPOSED

---

### FSN-DUAL-BANK

FORMATION_ID: `FSN-DUAL-BANK`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-DUAL-KEEP` — `bishop` **without** heal / proposed `dual_keeper` — pack median
- `ROLE-READY` — `knight` **without** heal / proposed `ready_stinger` — pack median
- `ROLE-DRIFT-SIP` — `bishop` **without** heal / proposed `drift_sipper` — pack median

VARIANT_RULES:

- Unlock after `FSN-DUAL-READY`. Wave 12 “Dual Bank.”
- Elite: Keeper only. Ready and Sip stay junior.
- Sip is the **one** rare. Gait Sip / Tide / Ledger stay off (PAIR bans). Purse Keep / Stride Keep stay off (PAIR bans).
- Cap applied leftover-AP steal at 1. Sip is the one steal; Keeper Frost refreshes, does not add a third tax.
- Leftover-AP+MP bank + force-move writers required.

SPELL_POOL_INTERACTIONS:

- Keep banks leftover AP **and** leftover MP. Ready pokes leftover pair ≥ 1/1. Sip steals 1 leftover AP iff they **were force-moved**. Spend one wallet answers Ready; unshoved answers Sip; kill-before-next-start answers Keep.
- Do not also Slow (that is a third wallet story).

TACTICAL_PLAN:

- Keep banks if both leftovers ≥ 1. Sip Sips after a shove. Ready commits when both leftovers ≥ 1.
- If the player never banks, this is a softer `FSN-DUAL-READY` plus a Frost bishop — fine.

SYNERGY:

- Bank both wallets, poke leftover pair, steal the shoved AP. Three leftover-pair verbs, one axis.

PLAYER_THREAT:

- Tempo and chip. Failure is banking 2/2, accepting a shove, then eating Ready + Sip. Recoverable: spend one wallet, refuse the shove, kill Ready.

COUNTERPLAY:

- Spend leftover AP **or** leftover walk. Stay unshoved to deny Sip. Kill Ready. Kill Keeper before next start.

MAP_REQUIREMENTS:

- `openField` or `arena`. Reject `corridorMaze`.
- No Time Warp.

AI_REQUIREMENTS:

- Keep / Ready as `FSN-DUAL-READY`.
- Sip: caster; skip if force flag is 0.
- Soph 3–4. Blackboard: `leftoverAp` + `leftoverWalkMp` so Ready and Sip agree.

VARIANTS:

- `FSN-DUAL-BANK/NO-SIP` — fallback to `FSN-DUAL-READY`.
- `FSN-STRIDE-BANK` remains the leftover-MP BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-MID-STEP

FORMATION_ID: `FSN-MID-STEP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-MID-HOOD` — `pawn` or `knight` / proposed `mid_hooder` — pack median + 1
- `ROLE-MUST-DRIFT` — `knight` / proposed `must_drifter` — pack median
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — Frost; minRange 3

VARIANT_RULES:

- Unlock after `FSN-MID-DRIFT`. Wave 12 “Mid Step.”
- Elite: Hood only. Drifter and Sniper stay junior.
- Sniper Mark stays off this BRIGADE (that is `FSN-BROKEN-GLASS`). Must Step / Inch stay off (PAIR bans vs Must Drift).
- Near Hood / Far Hood stay off (PAIR bans).
- If the map has no legal shove-dir step **and** no minRange-3 lane, **reroll**.

SPELL_POOL_INTERACTIONS:

- Must Drift forces leftover MP along the shove into Mid Hood’s exact-2 miss, then Sniper Frosts from 3. Standing answers Drift **and** can sit at 1 (Hood does not eat 1) — that is the designed squeeze, not a lock: Frost is chip, Hood expires, Swap yanks the Sniper.
- One Slow source max. Tide stays off this id.

TACTICAL_PLAN:

- Hood holds the doorway. Drifter Must-Drifts only if a shove dir exists and a tile at 1 or 3 remains. Sniper holds ≥ 3, opposite corner so one Linear does not delete Hood + Sniper.

SYNERGY:

- Force leftover MP along the shove into exact-2 miss, then snipe from 3. Wave 11 Near Step standing on Wave 12 Mid / Drift.

PLAYER_THREAT:

- Frustration and a periodic Frost. Not a lock. Cornering the Sniper still wins.

COUNTERPLAY:

- Stand. Hit from 1 or 3. Collapse the Sniper (`hpMult` ~0.6). Swap / Attract the bishop. DoT. Wait Hood expiry at 1.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel.
- No lava on the only approach to the Sniper.

AI_REQUIREMENTS:

- Hood / Drifter as `FSN-MID-DRIFT`.
- Sniper: caster + minRange 3 + refuse dest ≤ 2.
- Soph 3–4.

VARIANTS:

- `FSN-MID-STEP/FROST-ONLY` — Sniper Frost, no Mark (default).
- `FSN-NEAR-STEP` remains the Near Hood BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-HEAVE-QUIET

FORMATION_ID: `FSN-HEAVE-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-HEAVE-STEP` — `queen` **without** heal / proposed `heave_stepper` — pack median — mid
- `ROLE-WARDEN` flavor cover — `rook` / proposed `cover_squire` — pack median — covers the **file**, not a PAIR with the Stepper
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — Frost; minRange 3

VARIANT_RULES:

- Unlock after `FSN-ALLY-SILL` **and** `FSN-SHOVE-BASH` (player has seen a join-relocate **and** a shove). Wave 12 “Heave Quiet.”
- Elite: Stepper only. Cover and Sniper stay junior.
- **Never PAIR Heave Step with Home / Ally / Hook / Cover / Hinge.** This **three-body** is the lesson: join the **force-moved** gun, then cover the file.
- Home Step / Ally Step stay off (PAIR bans). Quiet Sill stays off (that is `FSN-CAST-QUIET`).
- Heave Step dests are occupancy, not `isSwap`. Whole card fizzles if blocked.
- Force-move writers required. The gun must **already** be force-moved before Heave Step is legal.

SPELL_POOL_INTERACTIONS:

- Heave Step: caster lands on a free Chebyshev-1 of a **force-moved** ally. Occupy the ring. Landing hazards tick. Walk-spend does **not** increment.
- Cover Squire: body-blocks the file the Sniper holds. Iron Skin / Shield is RES.
- Sniper Frost from ≥ 3. Mark stays off (that is `FSN-BROKEN-GLASS`).
- Do not also attach Ally Step (join-unconditional + join-if-shoved is a two-relocate PAIR).

TACTICAL_PLAN:

- Someone (player bash, enemy slide leftover, or a prior shove) force-moves the Sniper. Stepper joins that gun only if a free ring tile exists **and** is not the player’s last exit.
- Cover holds the file so the join is not a free collapse. Sniper holds ≥ 3, opposite corner.
- Never turn-1 surround.

SYNERGY:

- Protector relocate + file cover + gun. Wave 11 Ally Step’s cousin on **already-shoved**. You see the shove; the join is earned.

PLAYER_THREAT:

- Positional. Failure is shoving the gun yourself, then eating Frost from a queen who just landed beside it. Recoverable: occupy the ring, isolate so Heave Step has no legal dest, collapse Cover.

COUNTERPLAY:

- Don’t shove the gun. Occupy the ring. Isolate. Kill Cover. Swap the Sniper after the join (the queen is now the near threat).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Reject a 1-tile tunnel (join + cover on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Stepper: skip if no force-moved ally or no free adj of that ally; never dest the only player exit.
- Cover: guardian interpose; `chokepointCamp` only with a gallery.
- Sniper: caster + minRange 3.
- Soph 3–4. Blackboard: `forcedAllyId`.

VARIANTS:

- `FSN-HEAVE-QUIET/NO-COVER` — fallback: Stepper + Sniper only if Cover would clone `FSN-GLASS-WARD` as a PAIR (banned shape). Still needs a force-moved gun.
- `FSN-ALLY-SILL` remains the teaching CELL; do not merge.

STATUS: PROPOSED

---

### FSN-HALVE-PACE

FORMATION_ID: `FSN-HALVE-PACE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-HALVE` — `bishop` **without** heal / proposed `cadence_halver` — pack median — `isLeader` optional
- `ROLE-VERSE-PACE` — `bishop` **without** heal / proposed `verse_pacer` — pack median
- `ROLE-IGNITE` — `queen` **without** heal / proposed `ignite_alchemist` — pack median — Poison + Ignite

VARIANT_RULES:

- Unlock after `FSN-TRIM-TAX` **or** `FSN-STRETCH-MUTE` (player has seen a CD rewrite **and** a recast tax). Wave 12 “Halve Pace.”
- Elite: Halver-leader only. Pacer and Ignite stay junior.
- `lastResolvedSpellId` **and** `walkMpSpentThisTurn` required. Halve 0 stays 0. Ignite only if matching stacks ≥ 2 (VETERAN). Verse Pace peels **only** on a spent walk — shove does **not** unlock the last id.
- **Never PAIR Halve with Trim / Shave / Stretch / Stall / Crack / Pin.** Pin lives on `FSN-BAR-PIN`.
- Last Mute / Verse Tax stay off this id (PAIR bans). No Inferno on the Halver. One Ignite cadence.

SPELL_POOL_INTERACTIONS:

- Halve `floor(remaining/2)` on Inferno so a 3 becomes 1. Verse Pace makes that recast **illegal until they walk**. Ignite cashes stacks in the panic window.
- Confirm live Inferno CD is a remaining ≥ 2 before Halve (else Frost). Sit on CD-0 ids is a complete answer.
- Poison is the only pack DoT apply. Do not also Venom two rats (that is `FSN-PAPER-PLAGUE`).

TACTICAL_PLAN:

- Turn 1: Pacer holds unless a last id already exists. Halver Halves only if highest remaining ≥ 2 **and** a recast would hurt. Ignite waits for stacks ≥ 2.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- If the player sits on CD-0, this is a Frost choir — intended.

SYNERGY:

- 3→1 Inferno still illegal until they walk, then cash stacks. Wave 11 Trim Tax’s cousin on **divide** instead of −1, plus a walk peel instead of +1 AP.

PLAYER_THREAT:

- High if you recast Inferno into Verse Pace with stacks up. Still interruptible: recast a cheap other id, sit on 0, take the step, kill Ignite.

COUNTERPLAY:

- Recast Frost, not Inferno. Walk to peel Verse Pace (or wait expiry). Kill Ignite (`hp` ~0.75). Kill Pacer. Cleanse stacks. Cursed Wound is irrelevant (no healer).

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Ignite can land.

AI_REQUIREMENTS:

- Halve: skip if highest remaining < 2.
- Verse: skip if no last id or they already walked; shove does not peel.
- Ignite: skip at 1 stack.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-HALVE-PACE/NO-LEADER` — teaching CADRE without boost.
- `FSN-HALVE-PACE/NO-IGNITE` — fallback Frost choir if stack consume is not ready.
- `FSN-TRIM-TAX` remains the −1 CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-RITE-LONG

FORMATION_ID: `FSN-RITE-LONG`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-RITE` — `knight` **without** heal / proposed `rite_holder` — pack median + 1
- `ROLE-LONG-OATH` — `bishop` **without** heal / proposed `long_oather` — pack median
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median + 1 — body-block

VARIANT_RULES:

- Unlock after `FSN-INCH-OATH` **and** `FSN-BOOT-OATH` (player has seen a range oath **and** a Strike/walk lock). Wave 12 “Rite Long.”
- Elite: Rite only. Oather and Warden stay junior.
- **Never PAIR Rite with Hold Knight / First Verse / Tool Hold / Boot Hold / Quiet Sill.** This CADRE: cannot **Strike** until they spell, then next spell must have range ≥ 3. Frost at 1 fizzles. Strike stays the designed unlock **after** a ≥3 confirm — or they waste the rite on a legal long Frost, then Strike.
- Tool Hold / Cast Sill / Near Oath stay off (COURT leftovers). Far Stinger stays off (PAIR ban vs Long).
- Swap peel on the Warden is the **one** rare (legal dest only).

SPELL_POOL_INTERACTIONS:

- Rite First: Strike / `isPhysical` refuses until a **spell** resolves this turn. Spells stay legal — but Long Oath makes those spells range ≥ 3, so Frost at 1 fizzles and a long confirm is the honest tool.
- Long Oath: next spell range ≥ 3. Near Oath (≤ 1) is not this card.
- Warden Iron Skin / Shield is RES. Do not also Gait Seal / Drift Hold (feet nailed twice).

TACTICAL_PLAN:

- Warden interposes on the Oather axis. Rite Rites if the player still wants to melee. Oather Oaths if a range<3 id is the next legal.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**.
- If the Rite dies, remaining pair is a min-range-3 bishop + golem — intended (`FSN-INCH-OATH` leftover without Inch).

SYNERGY:

- Unlock Strike only with a spell that may also be range-illegal. Wave 11 Boot Oath’s inverse: Strike is locked, long confirms are the door.

PLAYER_THREAT:

- Structured tempo. Failure is dumping Inferno at 1 under Oath while Rite forbids the panic Strike. Recoverable: cast from 3, then Strike, or kill Oather.

COUNTERPLAY:

- Cast from ≥ 3 (unlocks Strike). Then melee. Kill the Oather (glass). Walk around the Warden. Player Barrier. Do not also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Oather needs a retreat tile that is not the Warden’s choke **and** a ≥3 Frost lane.
- Never a closed ring. Weight 0 on 1-tile closets.

AI_REQUIREMENTS:

- Rite: skip if they already spelled; never also Quiet / Tool / Boot.
- Oather: skip if their next id is already range ≥ 3 or they have no ≥3 lane.
- Warden: guardian interpose; `chokepointCamp` only with a gallery.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.

VARIANTS:

- `FSN-RITE-LONG/NO-WARD` — BRIGADE-shaped: Rite + Oather only.
- `FSN-BOOT-OATH` remains the walk-until-Strike CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-BAR-PIN

FORMATION_ID: `FSN-BAR-PIN`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BAR-MEND` — `queen` **with** heal / proposed `bar_mender` — pack median — `isLeader` optional
- `ROLE-PIN` — `bishop` **without** heal / proposed `cadence_pinner` — pack median
- `ROLE-ONCE` — `bishop` / proposed `once_cantor` — pack median — echo lock, not a second mute PAIR

VARIANT_RULES:

- Unlock after `FSN-BODY-CLASH` **or** `FSN-HALVE-PACE` (player has seen a gated heal **or** a CD rewrite). Wave 12 “Bar Pin.”
- Elite: Mender-leader only. Pinner and Once stay junior.
- **Never PAIR Bar Mend with Clash / Heave / Chase / Both / Pale.** Strike does **not** pay Bar Mend. The unlocking **spell** does.
- **Never PAIR Pin with Halve / Stall / Trim / Flush.** Halve lives on `FSN-HALVE-PACE`.
- Once Cantor is the echo lock, not a second mute PAIR vs Verse Pace (PAIR ban). No Inferno on the queen.

SPELL_POOL_INTERACTIONS:

- Bar Mend: heal 8 iff the **target resolved a spell** this turn. Don’t tool the carry. Missing flag → 0. Strike / walk / shove do not pay.
- Cadence Pin: one remaining CD **does not tick**. Freeze Inferno at 3 so they cannot recast through the heal window. Sit on CD-0.
- Once Cantor: locks recast of the id they just used. Together: you may spend the spell that pays Bar Mend **and** be unable to recast Inferno — **that is the CADRE question**. Answers: recast a cheap other id, sit on 0, kill Pin, wait the freeze.

TACTICAL_PLAN:

- Pinner Pins only if highest remaining ≥ 2 **and** a recast would hurt. Mender Bar-Mends the **carry** only if a spell resolved and missing HP ≥ 8; else Shields.
- Once waits until a recast would stack with Pin.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**.
- If Pin dies, remaining pair is spell-gated heal + echo — intended.

SYNERGY:

- Cash the unlocking spell, freeze Inferno so they cannot recast. Wave 11 Clash Mend’s cousin on **spell** instead of Strike, plus freeze instead of ÷2.

PLAYER_THREAT:

- High if you Inferno the queen while Pin freezes the recast. Low if you Frost a cheap id or don’t tool the carry. Not a lock: Strike works, sit on 0, Pin is 1-turn.

COUNTERPLAY:

- Don’t spell the carry. Recast Frost, not Inferno. Kill Pin (glass). Kill the Mender. Cursed Wound. Sit on CD-0.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Once can land.

AI_REQUIREMENTS:

- Bar: healer; skip if no spell resolved on the target.
- Pin: skip if highest remaining < 2; never with Halve.
- Once: skip if no last id worth locking.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-BAR-PIN/NO-LEADER` — teaching CADRE without boost.
- `FSN-BAR-PIN/STILL` — CADRE **Still Sprout**: replace Once with `ROLE-STILL-TAX` + `ROLE-BRICK-SPROUT` + `tax_scribe` as a **different** three. Tax the camped nuke, then lengthen the wall they hid behind. **Never PAIR Still Tax with Gait Tax / Tax Scribe. Never PAIR Brick Sprout with Wipe / Shift / Gun.** Unlock after `FSN-BRICK-WATCH` **or** `FSN-GRAVITY-TAX`. Sprout grows an existing barrier 1 — it does not mint a new wall. Walk the other gallery.
- `FSN-BODY-CLASH` remains the Struck CELL; do not merge.

STATUS: PROPOSED

---

### FSN-DRIFT-COURT

FORMATION_ID: `FSN-DRIFT-COURT`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-DRIFT-HOLD` — `rook` **without** heal / proposed `drift_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-DRIFT` — `knight` **without** heal / proposed `must_drifter` — pack median
- `ROLE-PUSHER` — `pawn` or `knight` / proposed `bash_bruiser` — pack median + 1 — Shoulder Bash
- Optional fourth: `ROLE-MID-HOOD` junior **or** omit — if present, Hoods the pocket, not a second walk lock

VARIANT_RULES:

- Unlock after `FSN-MID-DRIFT` **and** a leader-boost CADRE (`FSN-RITE-LONG` or `FSN-BOOT-OATH`). Wave 12 “Drift Court.”
- One elite only: the Hold-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Drift Hold with Boot Hold / Hold Knight / Hold Caster / Gait Seal / Root / Tool Hold.** This COURT is the three-lock lesson: cannot **walk** until force-moved, then leftover walks follow that vector, then a bash sets the vector. Designed answers: stand (0 walk legal), take a legal step along the vector, Strike (spells stay legal — Strike does **not** peel Hold, but it is still a tool), wait 1 turn, kill Hold (glass-er than a golem), occupy bash dest so the vector never writes.
- InstantKill / betrayal stay off. Root stays off (walk lock + Root is a full lockout). `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Hold walks to the gallery **after** a shove peels them, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-DRIFT-COURT/LANE` (variant): drop optional Hood — Hold + Must Drift + Bash only, **only** if the player has already answered `FSN-MID-DRIFT` **and** `FSN-HOOK-SLAM` (otherwise it clones those as a PAIR — banned).

SPELL_POOL_INTERACTIONS:

- Drift Hold: walk MP refuses until `forcedMovedThisTurn`. Strike does **not** peel. Spells stay legal.
- Must Drift: remaining walks follow `lastForcedMoveDir`. Stand is legal. Relocate any length is legal.
- Shoulder Bash: writes both flags. Skip bash into open floor. Dest must leave a walk-off.
- Together: accepting the bash unlocks walk **and** forces the leftover tiles along that dir. Refusing the bash (occupy dest) leaves Hold up and Must Drift dir-less (Must Drift skips). Optional Mid Hood: waste the 2-step poke along the vector — step to 1 or 3.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Hold if they still want to kite. Bash toward a wall **beside** the engagement, never the last exit. Must-Drift only after a dir exists **and** a walk-off that is not that vector remains. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Optional Hood holds the 2-band. If Hold dies, walk opens; Must Drift without Hold is a softer `FSN-MID-DRIFT` leftover — intended. Hold may retreat (`escapeRoute`) after a peel rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Court-scale walk lock without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: occupy bash dest, stand, Strike, wait, kill Hold.

PLAYER_THREAT:

- Highest structured tempo threat in this drop. Still turn-based. Failure is accepting a bash, then walking the forced vector into Mid Hood while Hold is still up. Recoverable next turn.

COUNTERPLAY:

- Occupy bash dest (dir never writes; Hold stays). Stand (0 walk legal). Strike (spells legal). Kill Hold. Blink / Swap (relocate ignores both walk locks). Player Timestep is the designed panic.
- Do **not** also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the forced vector **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if they already were force-moved; never also Root / Seal / Boot.
- Drifter: skip if dir missing **or** that vector is the only exit.
- Bruiser: charger; skip bash into open floor; dest scoring must not use lava.
- Optional Hood: skip if already at 1 or ≥ 3.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-DRIFT-COURT/LANE` — BRIGADE-shaped: Hold + Must Drift + Bash only (ship if Hood gate is not ready). Still no Root.
- `FSN-DRIFT-COURT/NO-HOOD` — COURT of three.
- `FSN-DRIFT-COURT/SEPT` — COURT **Sept Plug**: replace this id’s members with `ROLE-SEPT` + `ROLE-DRIFT-SILL` + `ROLE-LANCER`. Stretched-plus seal, reject shove-through, lance the file. **Skip until remaining cap ≥ 7** (live cap 2). Burst the 8 HP. Walk a far diagonal. Sit on the origin. `summonAI === "septspan"` required. Do not also roll a second post. Needs a 5-long cardinal file plus two ortho pockets. Weight 0 on cramped 1-tile closets.
- `FSN-DRIFT-COURT/BRACE` — COURT **Side Brace**: replace Hold + Drift + Bash with `ROLE-SIDE-BITE` + `ROLE-BRACE` + `brood_chanter`. Hug bonus, then pets ignore the peel. **Never PAIR Side Bite with Lone / Nook. Never PAIR Brace with Kennel / Brood as a two-body.** Unlock after `FSN-KENNEL-LITANY` **or** `FSN-DULL-PET`. Weight ×2 if the player has a living summon. Dummy Post is a legal summon. Cap one brood engine.
- `FSN-DRIFT-COURT/BANNER` — COURT **Lone Banner**: replace Hold + Drift + Hood with `ROLE-LONE-PURSE` + `ROLE-BANNER-CUT` + `coil_arbiter`. Poke leftover AP exactly 1, then delete the leader. **Never PAIR Lone Purse with Dry / Ready. Never PAIR Banner Cut with Crown / Pet / Coup / Arbiter as a two-body.** Unlock after `FSN-DUAL-READY` **or** `FSN-CAST-QUIET/KENNEL`. Dummy Post is not a leader. Arbiter Drain Courage is the **one** AP engine — do not also Tax.
- `FSN-MID-DRIFT` / `FSN-HOOK-SLAM` remain the teaching PAIR/CELL; do not merge ids.
- `FSN-BOOT-OATH` remains the Strike-peel CADRE; this id is the **shove-peel** COURT.
- `FSN-CAST-QUIET` remains the **tile** COURT; this id is the **vector** COURT.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–12 still stand. This drop **meshes**; it does not replace.

```
PAIR:    HEAVE-LEND         DUAL-READY         MID-DRIFT         CINDER-MARK
              \\                 |                   |                  /
CELL:     DRIFT-GATE        SPIKE-TAP          OFF-FEE          INCH-OATH
              \\                 |                   |                  /
BRIGADE:  HEAVE-CHOIR       DUAL-BANK          MID-STEP         HEAVE-QUIET
              \\                 |                   |                  /
CADRE:    HALVE-PACE        RITE-LONG          BAR-PIN
              \\                 |                  /
COURT:                    DRIFT-COURT    DRIFT-COURT/SEPT    DRIFT-COURT/BRACE    DRIFT-COURT/BANNER
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-HEAVE-LEND` | `FSN-SHOVE-BASH` **or** `FSN-BOTH-SPEND` |
| `FSN-DUAL-READY` | `FSN-STRIDE-DAMP` **or** `FSN-DRY-KEEP` |
| `FSN-MID-DRIFT` | `FSN-NEAR-MUST` **or** `FSN-HOLD-RANGE` |
| `FSN-CINDER-MARK` | `FSN-PAINT-NOOK` **or** `FSN-EMBER-RIFT` |
| `FSN-DRIFT-GATE` | `FSN-SHOVE-PACE` **or** `FSN-ALLY-SILL` |
| `FSN-SPIKE-TAP` | `FSN-LAVA-STILL` **or** `FSN-SLIP-PIT` |
| `FSN-OFF-FEE` | `FSN-BRICK-WATCH` **or** seen Barrier / overwatch |
| `FSN-INCH-OATH` | `FSN-NEAR-MUST` **or** `FSN-BOOT-OATH` |
| `FSN-HEAVE-CHOIR` | `FSN-HEAVE-LEND` |
| `FSN-DUAL-BANK` | `FSN-DUAL-READY` |
| `FSN-MID-STEP` | `FSN-MID-DRIFT` |
| `FSN-HEAVE-QUIET` | `FSN-ALLY-SILL` + `FSN-SHOVE-BASH` |
| `FSN-HALVE-PACE` | `FSN-TRIM-TAX` **or** `FSN-STRETCH-MUTE` |
| `FSN-RITE-LONG` | `FSN-INCH-OATH` + `FSN-BOOT-OATH` |
| `FSN-BAR-PIN` | `FSN-BODY-CLASH` **or** `FSN-HALVE-PACE` |
| `FSN-DRIFT-COURT` | `FSN-MID-DRIFT` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 13 packs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-09-29.md`](../automation/SPELL_PROPOSALS_2026-09-29.md) (open as PR #787) stamps **new** verbs with **no family sheets** (`spell-parched-mend` … `spell-court-imprint`, including Six Span). SDE Wave 11 unique CORE still has no CORE owner. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations after Wave 13 elite-evolution families exist.

Do **not** pack `cadence_halver` with `cadence_pinner` as a teaching pair (Wave 12 rule). `FSN-HALVE-PACE` stays the ÷2 lesson; `FSN-BAR-PIN` stays the freeze-one CADRE.

Do **not** pack `heave_mender` with `bar_mender` as a teaching pair. `FSN-HEAVE-LEND` stays the dual-force lesson; `FSN-BAR-PIN` stays the spell-resolved heal.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–12, plus Wave 12 verbs in this order (from elite-evolution §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-MID-DRIFT` band 0 can ship among the first** once family HP survives battle start. `FSN-HEAVE-LEND` needs band 1 heal **and** `forcedMovedThisTurn`.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Heave Mend / Bar Mend must live only on healer profiles.**
4. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`forcedMovedThisTurn`**, **`lastForcedMoveDir`**, **`lastResolvedSpellId`**, leftover-**AP and MP** snapshot paid at next own turn start (Dual Keep — do not share Purse Keep’s AP-only table).
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Heave Step occupancy dests (not `isSwap`). Cinder Reel = fifth attract dest flavor.
6. `inferSummonArchetype` gains `septspan` and `driftpost` (and still needs `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–11). Raise or gate `ENEMY_SUMMON_CAP` before Sept Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Drift Lend / Spare Pace / Split Mend). **`FSN-HEAVE-LEND`, `FSN-HEAVE-CHOIR`, and `FSN-HEAVE-QUIET` must not ship before that apply exists** for the ally tools they name. `FSN-BAR-PIN` is spell-gated heal and waits on a “resolved a spell” flag, not on ally `targetId`.
8. Drift Sill relocate-dest gate (walk-on legal). Drift Hold until force-move. Long Oath / Rite First as refuse-until. Ingress Mark enter hook. Tapped Plate leftover-AP-0. Dual Keep current-AP/MP rewrite.
9. Summoner cooldown fall-through (sept / driftpost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT sept sheets assume the lottery does not add a second engine.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-HEAVE-LEND`, `FSN-HEAVE-CHOIR` | `forcedMovedThisTurn` on **both** bodies; ally `targetId` for Drift Lend |
| `FSN-DUAL-READY`, `FSN-DUAL-BANK` | leftover-AP+MP snapshot + next-turn-start pay; Ready leftover pair ≥ 1/1; Sip force gate |
| `FSN-MID-DRIFT`, `FSN-MID-STEP` | Mid Hood exact-2 consume; Must Drift `lastForcedMoveDir`; legal vector step exists |
| `FSN-CINDER-MARK` | fifth `applyAttract` dest (hazard); Ingress enter hook; dest is not the hazard |
| `FSN-DRIFT-GATE` | Drift Post relocate-detonate / walk-safe; Drift Sill relocate-dest reject; two different tiles |
| `FSN-SPIKE-TAP` | 1-tile spike skip; Tapped leftover-AP-0; one clean aisle |
| `FSN-OFF-FEE` | Off-turn miss; Watch Fee costs 1 AP and still deals |
| `FSN-INCH-OATH` | Inch one Chebyshev-≤1; Long Oath range ≥ 3; Strike remains legal; no Near Oath |
| `FSN-HEAVE-QUIET` | Heave Step occupancy dest (not `isSwap`); gun already force-moved; Cover is a third body |
| `FSN-HALVE-PACE` | `lastResolvedSpellId`; Halve 0-stays-0; Verse Pace walk peel (shove does not); Ignite stack gate ≥ 2 |
| `FSN-RITE-LONG` | Rite until spell; Long Oath range ≥ 3; Strike remains the door after a ≥3 confirm |
| `FSN-BAR-PIN` | spell-resolved flag on the target; Pin 0-stays-0; never Halve on this id |
| `FSN-DRIFT-COURT` | Drift Hold until force-move; Must Drift dir; Bash dest walk-off; never Root |
| `FSN-DRIFT-COURT/SEPT` | `summonAI === "septspan"` **and** remaining cap ≥ 7 (live cap 2 → skip) |

---

## Sources (line-accurate, 2026-10-21)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 203–224, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942; zone object 4683–4687
- Family lottery + HP overwrite: `spawnPolicy.ts` 35–57, 69–128; WX 5864–5866, 11970–11974
- Integer RES/SP: `progression.ts` `getEnemyBaseStats` 180–186
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16819
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 336–337
- Push / attract (no caller): `src/frontend/src/engine/occupancy.ts` 482 / 537; portals impassable at 40
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 266–285, 298–301
- Families: `src/frontend/src/types/gameTypes.ts` 12–20; `currentView` 297
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–291)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Trap still `placeBarrier`: `spellEngine.ts` 442–445
- `areaShape` unread: `targeting.ts` 690–727; `spell.diagonal` 712
- Cast AP-only: `WorldExploration.tsx` `executeCastAttempt` 17096+
- WX still 19,213 lines @ `0f5363f`
- Wave 12 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-29.md` (PR #796) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-09-28.md` (PR #726); leftover SDE Wave 10 unique CORE in PR #679
- Drop 12: `docs/design/ENEMY_FORMATIONS_2026-09-29.md` (PR #794)


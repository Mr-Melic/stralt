# Enemy synergy and formation catalog (drop 15)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-23  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–14 already taught the seven pairing words and Waves 1–13 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 14 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-22.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-22.md) (open as PR #899) and deferred by drop 14 (PR #897): Gaunt Choir, Oct Plug, Even Orth, Gaunt Court, Gaunt Quiet, Gaunt Gate, Bounce Ring, Gaunt Hold File, Orth Tri, Brick Wake, Lone Axis, Gait Watch, Glyph Full, Still Grace, Debt Orbit, Pair Gift, Gait Kennel.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897). Family sheets: PR #899. Spell verbs: Wave 13 tactical ids in PR #849 (`spell-gaunt-mend` … `spell-gaunt-hold`, **except** `spell-court-lag`) plus leftover SDE Wave 12 unique CORE (`spell-orth-stride` … `spell-leash-cut`, **except** Dry Gait / Pack Cap / Reach Fold).

**Hard rules (Wave 14 pack law — plus every older law still stands):**

- Do **not** pack `gaunt_mender` with `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (four leftover-0 flags vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs spell-resolved vs unconditional). `FSN-DRY-STEP` / `FSN-PAIR-DRY` / `FSN-STILL-REST` stay theirs. `FSN-GAUNT-STEP` owns four-flag heal. `FSN-STILL-GRACE` owns target-camp heal. `FSN-GAUNT-QUIET` is the 3-body.
- Do **not** pack `cadence_lagger` with `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (`n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-IMPRINT-CHOIR` / `FSN-STILL-REST` / `FSN-HALVE-PACE` stay theirs. BRIGADE `FSN-GAUNT-CHOIR/LAG` is the pad-then-verse lesson, never a two-CD PAIR.
- Do **not** pack `oct_prelate` with `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Oct counts as **8**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 8. Live cap is **2** — skip `FSN-GAUNT-HOLD/OCT`. `FSN-LEAN-HOLD/SIX` / `FSN-DRIFT-COURT/SEPT` stay theirs.
- Do **not** pack `even_hooder` with `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` as a PAIR (even-Chebyshev miss vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss). `FSN-ODD-MUST` / `FSN-NEAR-MUST` / `FSN-MID-DRIFT` / `FSN-OWN-WATCH` stay theirs. `FSN-GAIT-WATCH` owns Gait Plate.
- Do **not** pack `gaunt_stinger` with `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `lone_purser` / `pair_purser` / `pair_gaiter` / `full_purser` as a PAIR (leftover **AP = 0 and leftover MP = 0** poke vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover AP **exactly 1** vs leftover AP **exactly 2** vs leftover MP **exactly 2** vs leftover AP ≥ 3). `FSN-LEAN-SIP` / `FSN-DRY-TAX` / `FSN-DUAL-READY` / `FSN-PAIR-DRY` stay theirs. `FSN-PAIR-GIFT` owns Pair Gait.
- Do **not** pack `gaunt_stepper` with `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire` as a PAIR (join leftover-**AP=0 and MP=0** ally vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs line rescue vs cover). BRIGADE `FSN-GAUNT-QUIET` is the three-body lesson. `FSN-DRY-STEP` / `FSN-PARCHED-QUIET` / `FSN-HEAVE-QUIET` stay theirs.
- Do **not** pack `gaunt_siller` with `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` as a PAIR (start-turn occupy **and both leftover 0**, paint stays vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy). `FSN-VOID-DWELL` / `FSN-DRY-GATE` stay theirs. `FSN-BRICK-WAKE` owns Wake Mark.
- Do **not** pack `odd_holder` with `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` as a PAIR (cannot walk while leftover AP is **odd** vs until leftover **AP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root). COURT `FSN-LEAN-COURT` stays leftover-AP=0 peel. `FSN-GAUNT-COURT` is the 3-body.
- Do **not** pack `gaunt_lender` with `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **AP = 0 and MP = 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-LEAN-COURT/LEND` / `FSN-HEAVE-LEND` stay theirs. `FSN-GAUNT-QUIET/LEND` is the 3-body.
- Do **not** pack `bare_sipper` with `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` as a PAIR (steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip). `FSN-LEAN-SIP` / `FSN-NEAR-STEP/SIP` stay theirs.
- Do **not** pack `gaunt_prelate` with `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` as a PAIR (end-turn occupy **and leftover AP = 0 and leftover MP = 0** detonate vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait). `FSN-DRY-GATE` stays leftover-AP=0 detonate. `FSN-VOID-DWELL` owns ungated end-turn occupy. `FSN-BRICK-WAKE` owns start-turn occupy.
- Do **not** pack `gaunt_bouncer` with `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**AP=0 and leftover-MP=0** hostile vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-LEAN-HOLD/BOUNCE` / `FSN-HEAVE-CHOIR/BOUNCE` stay theirs. `FSN-GAUNT-HOLD/BOUNCE` is leftover-pair Bounce Ring, never a two-bounce PAIR.
- Do **not** pack `must_gaunter` with `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `gaunt_holder` as a PAIR (non-Strike illegal unless leftover **MP = 0 and this spell spends last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs Strike-until leftover MP=0 **and** last AP). `FSN-ODD-MUST` / `FSN-LEAN-HOLD` / `FSN-HOLD-VERSE` stay theirs.
- Do **not** pack `verse_gaunter` with `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` as a PAIR (last-id illegal until leftover **AP = 0 and leftover MP = 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock). `FSN-IMPRINT-CHOIR` / `FSN-HALVE-PACE` stay theirs.
- Do **not** pack `gaunt_holder` with `lean_holder` / `hold_knight` / `rite_holder` / `tool_holder` / `boot_holder` / `must_gaunter` as a PAIR (cannot Strike until leftover **MP = 0 and Strike spends last AP** vs leftover MP = 0 only vs until walk vs until a spell vs tools-until-Strike vs walk-until-Strike vs tools-until leftover MP=0 **and** last AP). COURT `FSN-GAUNT-HOLD` is the three-lock lesson. `FSN-LEAN-HOLD` / `FSN-RITE-LONG` stay theirs.
- Do **not** pack `orth_warder` with `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` as a PAIR (next walk **orthogonal-only** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal). `FSN-DIAG-OATH` / `FSN-INCH-OATH` / `FSN-NEAR-MUST` stay theirs.
- Do **not** pack `tri_oather` with `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as a PAIR (next spell exact Chebyshev **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0). `FSN-DIAG-OATH` leftover oaths stay theirs. `FSN-MID-DRIFT` owns Mid Hood.
- Do **not** pack `brick_reeler` with `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` as a PAIR (pull toward **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity). `FSN-VOID-DWELL` / `FSN-CINDER-MARK` / `FSN-PAINT-NOOK` / `FSN-FOE-FANG` / `FSN-BRAND-REEL` stay theirs.
- Do **not** pack `lone_biter` with `foe_biter` / `side_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` as a PAIR (isolated from **all** units vs adj-**hostile-to-target** vs adj-**ally** vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug). `FSN-FOE-ESCORT` / `FSN-LONE-NAIL` / `FSN-DRIFT-COURT/BRACE` stay theirs.
- Do **not** pack `wake_marker` with `dwell_marker` / `ingress_marker` / `gaunt_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (start-turn occupy consume vs end-turn occupy vs cell-enter vs start-turn occupy **and both leftover 0** vs unit walk-MP wick vs first leave vs tile bomb). `FSN-VOID-DWELL` / `FSN-CINDER-MARK` / `FSN-EXIT-PAIR` stay theirs.
- Do **not** pack `gait_plater` with `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `full_gaiter` as a PAIR (next hit 0 **while leftover MP ≥ 1** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs exactly-2 miss vs any-range skip vs leftover **MP ≥ 3** +RES). `FSN-OWN-WATCH` / `FSN-OFF-FEE` / `FSN-MID-DRIFT` stay theirs. `FSN-GLYPH-FULL` owns Full Gait.
- Do **not** pack `glyph_skipper` with `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` as a PAIR (1-tile **glyph-tax** as floor vs cinder vs spike vs lava vs pit vs ghost occupancy). `FSN-CINDER-FULL` / `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs.
- Do **not** pack `full_gaiter` with `full_plater` / `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden` / `gait_plater` as a PAIR (leftover **MP ≥ 3** → +RES vs leftover **AP ≥ 3** vs leftover **AP = 0** vs leftover **MP = 0** vs leftover-AP 0 +RES older vs absorb vs leftover-MP miss). `FSN-CINDER-FULL` owns Full Plate. `FSN-SPIKE-TAP` owns Tapped Plate. `FSN-LAVA-STILL` owns Still Plate.
- Do **not** pack `summon_gaiter` with `summon_toller` / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (pets pay **MP** to start a walk vs pets pay **AP** vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-GAUNT-HOLD/KENNEL` is Gait Kennel, never a two-pet PAIR. `FSN-LEAN-HOLD/TOLL` / `FSN-DRIFT-COURT/BRACE` / `FSN-DULL-PET` / `FSN-NULL-BROOD` stay theirs.
- Do **not** pack `still_gifter` with `gaunt_mender` / `still_mender` / `dry_gaiter` / `dry_mender` / `bar_mender` / `pale_cantor` as a PAIR.
- Do **not** pack `cadence_gracer` with `cadence_rester` / `cadence_lagger` / `cadence_thief` / `cadence_pinner` / `cadence_staller` as a PAIR.
- Do **not** pack `debt_caster` with `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` as a PAIR (spelled-**last-turn** next-walk +1 AP vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-SPENT-CRACK` / `FSN-BAR-PIN/STILL` stay theirs. CADRE `FSN-DEBT-ORBIT` is the three-body lesson (debt + orbit + glyph), never Debt+Scribe PAIR.
- Do **not** pack `brick_orbiter` with `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` as a PAIR (orbit adjacent barrier vs remove vs grow vs slide vs erase vs turret extras). `FSN-SPENT-CRACK` / `FSN-BAR-PIN/STILL` / `FSN-BRICK-WATCH` stay theirs. `FSN-GAIT-WATCH/GUN` owns the turret, never Orbit+Gun PAIR.
- Do **not** pack `watch_almer` with `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as a PAIR (snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-OWN-WATCH` / `FSN-OFF-FEE` / `FSN-BRICK-WATCH` stay theirs.
- Do **not** pack `pair_gaiter` with `pair_purser` / `gaunt_stinger` / `lone_purser` / `dry_stinger` / `ready_stinger` as a PAIR.
- Do **not** pack `axis_cutter` with `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as a PAIR (bonus vs handler-on-**rank-or-file** with a pet vs pet at Chebyshev ≤ 2 any geometry vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs Weaken/Expose). `FSN-FOE-ESCORT` / `FSN-DRIFT-COURT/BANNER` / `FSN-CAST-QUIET/KENNEL` stay theirs.
- Drop 4–14 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two heal-if-gated CORE as PAIR).

Wave 15 families now exist (`ENEMY_ELITE_EVOLUTION_2026-10-23.md`, open as PR #941) and consume Wave 14 tactical verbs (`SPELL_PROPOSALS_2026-10-22.md`, PR #890) plus leftover SDE Wave 13 unique CORE. Do **not** mint `FSN-*` ids that require those Wave 15 families in this drop — drop 16 packs them. Same-day SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, PR #906) stays G≥14 extras / never-owned until Wave 16 families.

Court Lag / Pack Cap / Reach Fold / Pack File / Diag Fold stay **boss / closed-class**. Court Lag may witness on CHAMPION `cadence_lagger` only — never as a world-pack CORE. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend (Hollow Gift is **target-only** both-pools — Wave 15).

**Do not spawn Gaunt Mend / Still Gift / Gaunt Sting / Gaunt Step / Gaunt Sill / Odd Hold / Gaunt Lend / Bare Sip / Gaunt Post / Gaunt Bounce / Must Gaunt / Verse Gaunt / Gaunt Hold / Gait Plate / Full Gait / Pair Gait / Summon Gait sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid, and battle walks write `walkMpSpentThisTurn`.** Forced-move / Swap / Home Step / Ally Step / Pair Pace / Pair Slide / Heave Step / Parched Step / **Gaunt Step** **do not** increment walk-spend. Missing field → Gaunt Mend / Still Gift / Gaunt Sting / Bare Sip / Pair Gait pay **0** extra or skip (fail closed). Until those writers land, show `FSN-DRY-STEP` / `FSN-LEAN-SIP` / `FSN-STILL-REST` / `FSN-PAIR-DRY` instead of the matching Wave 14 id.

**Do not spawn Verse Gaunt sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Gaunt fizzles (fail closed). Forced-move does **not** peel Verse Gaunt. Until that writer lands, show `FSN-IMPRINT-CHOIR` instead of `FSN-GAUNT-CHOIR`.

**Do not spawn Cast Debt sheets until a battle-walk writer snapshots a spelled-last-turn flag at turn end.** Strike last turn does not arm Cast Debt. Until that writer lands, show `FSN-SPENT-CRACK` instead of `FSN-DEBT-ORBIT`.

**Do not spawn Oct Plug until `inferSummonArchetype` keys `summonAI === "octspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 8.** Live cap is 2. Name heuristics stay a bug. Oct fills the stationary-post **and** the multi-cell-system cap (8). The center hole stays unoccupied. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost onto that body.

**Do not spawn Gaunt Post sheets until `inferSummonArchetype` keys `summonAI === "gauntpost"` and remaining cap ≥ 1.** End-turn occupy with leftover AP ≥ 1 **or** leftover MP ≥ 1 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Only leftover-AP=0 **and** leftover-MP=0 end-turn occupy detonates.

**Gaunt Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Brick Reel is the **seventh** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void, then **barrier**). Dest is **toward**, not onto, a world portal.

Wave 14 adds **zero** force-gated, facing, or Struck CORE cards. `forcedMovedThisTurn` / `lastForcedMoveDir` / `currentView` / `struckThisTurn` remain implementation prerequisites for Waves 6–13 sheets, not this drop.

---

## Grounding (live, 2026-10-23)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–14. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 (`spellType === "heal"` **or** `healAmount > 0`); `family.includes("berserk")` at 467–472 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1702 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Gaunt Step is occupancy dest, **not** `isSwap`. Brick Reel is the seventh **cast** caller of attract. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 14 CORE rows stay `mpCost: 0`. Bare Sip / Gaunt Lend rewrite **current leftover AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `walkMpSpentLastTurn` / `lastResolvedSpellId` / spelled-last-turn | **Absent** — Gaunt / Still Gift / Verse Gaunt / Cast Debt / Pair Gait fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / **octspan** / **gauntpost** bodies **replace** the random overlay. Cap one of those engines. Oct Span **is** the 8-cell hollow post and needs remaining cap ≥ 8.
3. Any `healAmount` steals healer. **Gaunt Mend / Still Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Halver, Pinner, Sprouter, Feer, Purser, Cutter, Lagger, Gracer, Orbiter, Almer, or Toller.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 14 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Bare Sip / Gaunt Lend rewrite current leftover AP/MP.
6. `inferSummonArchetype` must key `summonAI === "octspan"` **and** `"gauntpost"` **before** any Oct / Gaunt-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Orbit that **moves** an already planted barrier (it does not mint a new one from empty floor, and solvability skip is mandatory). Odd Hold / Must Gaunt / Gaunt Hold / Verse Gaunt / Tri Oath / Orth Stride are **not** `instantKill`.
8. Gaunt-step dest / brick-reel dest / gaunt-post plant / oct plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Gaunt Step into a wall is a fizzle (no crush). Brick Reel dest must leave a walk-off that is **not** the barrier cell **and not** a world portal.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Bare Sip source per pack, not both stacking past that cap. Odd Hold is a **walk lock with an AP-parity key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold on the same AP bar.
10. Walk-spend: Still Gift / Gaunt Step gate **fail closed** until `walkMpSpentThisTurn` exists on the turn actor. Gaunt Step / Brick Reel / Gaunt Post plant **does not** increment it.
11. Last-id: Verse Gaunt **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Gaunt. Dual Keep leftover is **not** empty.
12. Spelled-last-turn: Cast Debt **fail closed** until that flag exists. Strike last turn does **not** arm it. Teleport / Swap do not pay.

### Relative difficulty (same grades as drops 1–14)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…14 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a four-flag leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter): pack median + one step.
- Backliner (gaunt-mend / still-gift / keep / sip / sill / tax / lag / grace / oath / reel / mark / orbit / lend / stride / oather / debt / alms): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 15)

Drop 1–14 overlays still apply. These are **additional jobs** for Wave 14 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-GAUNT-MEND` | `queen` **with** heal | proposed `gaunt_mender` | `spell-gaunt-mend`, `starter-shield` | healer; skip if any leftover AP/MP ≥ 1 or missing HP < 8; Dual Keep leftover is **not** empty; **not** Hollow Gift / Dry Gait |
| `ROLE-CADENCE-LAG` | `bishop` **without** heal | proposed `cadence_lagger` | `starter-frost`, `spell-cadence-lag` | controller; skip if every remaining is 0; zeros stay ready; extra door `lag_precentor` is **not** this family |
| `ROLE-OCT` | `rook` **without** heal | proposed `oct_prelate` | `physical_attack`, `spell-oct-span` | `isSummoner` for oct only; post `summonAI: "octspan"`, hollow 3×3, empty kit, remaining cap ≥ 8; skip if any of eight cells blocked; center hole unoccupied |
| `ROLE-EVEN-HOOD` | `pawn` or `knight` **without** heal | proposed `even_hooder` | `physical_attack`, `spell-even-hood` | guardian; skip if the only threat sits at odd Chebyshev; hits from 1, 3, … land; same-cell (0, even) **misses**; DoT does not consume |
| `ROLE-GAUNT-STING` | `pawn` **without** heal | proposed `gaunt_stinger` | `physical_attack`, `spell-gaunt-sting` | flanker; skip if leftover AP ≥ 1 **or** leftover MP ≥ 1 unless 10 still kills; Dual Keep leftover is **not** 0 |
| `ROLE-GAUNT-STEP` | `queen` **without** heal | proposed `gaunt_stepper` | `physical_attack`, `spell-gaunt-step` | protector; skip if ally leftover AP ≥ 1 or leftover MP ≥ 1 or no free adj; relocate, **not** `isSwap` |
| `ROLE-GAUNT-SILL` | `rook` **without** heal | proposed `gaunt_siller` | `starter-frost`, `spell-gaunt-sill` | setter; skip if they can Dual Keep or walk off; occupant fully spent at **start of their turn** takes 8; paint stays |
| `ROLE-ODD-HOLD` | `knight` **without** heal | proposed `odd_holder` | `physical_attack`, `spell-odd-hold` | controller; skip if leftover AP already even; leftover 0 **may walk** (teach vs Dry Hold) |
| `ROLE-GAUNT-LEND` | `bishop` **without** heal | proposed `gaunt_lender` | `starter-frost`, `spell-gaunt-lend` | buffer; skip if ally leftover AP ≥ 1 or leftover MP ≥ 1; +1 current AP **and** +1 current MP |
| `ROLE-BARE-SIP` | `pawn` **without** heal | proposed `bare_sipper` | `starter-frost`, `spell-bare-sip` | flanker; skip if leftover MP ≥ 1 **or** leftover AP = 0; steal 1 leftover AP |
| `ROLE-GAUNT-POST` | `pawn` **without** heal | proposed `gaunt_prelate` | `physical_attack`, `spell-gaunt-post` | `isSummoner` for gauntpost only; post `summonAI: "gauntpost"`, remaining cap ≥ 1; end-turn leftover-AP=0 **and** leftover-MP=0 occupy detonates; walk-on / chip-safe |
| `ROLE-GAUNT-BOUNCE` | `queen` **without** heal | proposed `gaunt_bouncer` | `starter-frost`, `spell-gaunt-bounce` | artillery; skip bounce without a second leftover-AP=0 **and** leftover-MP=0 hostile in 4 (`AI-TEM-05`) |
| `ROLE-MUST-GAUNT` | `knight` **without** heal | proposed `must_gaunter` | `physical_attack`, `spell-must-gaunt` | controller; skip if leftover MP already 0 **and** leftover AP already equals next spell cost; non-Strike illegal unless leftover MP = 0 **and** last AP; Strike stays legal |
| `ROLE-VERSE-GAUNT` | `bishop` **without** heal | proposed `verse_gaunter` | `starter-frost`, `spell-verse-gaunt` | controller; skip if no `lastResolvedSpellId`; leftover AP = 0 **and** leftover MP = 0 peels; shove does **not** |
| `ROLE-GAUNT-HOLD` | `pawn` or `knight` **without** heal | proposed `gaunt_holder` | `physical_attack`, `spell-gaunt-hold` | controller; skip if leftover MP already 0 **and** leftover AP already equals Strike cost; Strike illegal until leftover MP = 0 **and** last AP; tools stay legal |
| `ROLE-ORTH-STRIDE` | `knight` **without** heal | proposed `orth_warder` | `starter-frost`, `spell-orth-stride` | controller; skip if only dests are diagonal and Strike is better; next walk `|dx|==0 XOR |dy|==0`; blink does not pay |
| `ROLE-TRI-OATH` | `bishop` **without** heal | proposed `tri_oather` | `starter-frost`, `spell-tri-oath` | controller; skip if they must stay at 1–2 and Strike is better; next spell exact Chebyshev 3; Strike stays legal |
| `ROLE-BRICK-REEL` | `rook` **without** heal | proposed `brick_reeler` | `starter-frost`, `spell-brick-reel` | caster; skip if no barrier in 6; dest is **toward**, not onto; seventh `applyAttract` flavor |
| `ROLE-LONE-BITE` | `knight` **without** heal | proposed `lone_biter` | `physical_attack`, `spell-lone-bite` | charger; skip if any living unit of any side at Chebyshev 1 of the target; caster counts; never stack Foe Bite on G=0 |
| `ROLE-WAKE-MARK` | `bishop` **without** heal | proposed `wake_marker` | `starter-frost`, `spell-wake-mark` | setter; skip if they can walk off for 1 MP; 0 on cast; start-turn occupy detonates and consumes; enter+leave same turn is free |
| `ROLE-GAIT-PLATE` | `rook` **without** heal | proposed `gait_plater` | `starter-shield`, `spell-gait-plate` | guardian; skip if leftover MP already 0; leftover MP ≥ 1 miss; leftover MP 0 at impact **lands** |
| `ROLE-GLYPH-SKIP` | `pawn` **without** heal | proposed `glyph_skipper` | `physical_attack`, `spell-glyph-skip` | flanker; skip if the next walk is not a 1-step across glyph-tax; lava/spike/pit/cinder still tick |
| `ROLE-FULL-GAIT` | `rook` **without** heal | proposed `full_gaiter` | `starter-shield`, `spell-full-gait` | guardian; skip if leftover MP ≤ 2 after the 2-AP pay; leftover ≥ 3 → +RES |
| `ROLE-SUMMON-GAIT` | `bishop` **without** heal | proposed `summon_gaiter` | `starter-frost`, `spell-summon-gait` | controller; skip if no allied summon; pets pay +1 MP to start a walk; teleport does not pay |
| `ROLE-STILL-GIFT` | `queen` **with** heal | proposed `still_gifter` | `spell-still-gift`, `starter-shield` | healer; skip if target `walkMpSpentThisTurn ≥ 1` or missing HP < 8; caster walk does **not** gate |
| `ROLE-CADENCE-GRACE` | `bishop` **without** heal | proposed `cadence_gracer` | `starter-frost`, `spell-cadence-grace` | buffer; skip if the next cast is Strike; next own spell does not start CD; running remaining still tick |
| `ROLE-CAST-DEBT` | `bishop` **without** heal | proposed `debt_caster` | `starter-frost`, `spell-cast-debt` | controller; skip if they only Struck or camped last turn; next walk +1 AP; Strike exempt |
| `ROLE-BRICK-ORBIT` | `rook` **without** heal | proposed `brick_orbiter` | `starter-frost`, `spell-brick-orbit` | setter; skip if no adjacent barrier **or** the orbit would seal the last path; paint-only; solvability skip |
| `ROLE-WATCH-ALMS` | `bishop` **without** heal | proposed `watch_almer` | `starter-frost`, `spell-watch-alms` | artillery; skip if no overwatch is armed; snap still deals; **walker** +1 AP |
| `ROLE-PAIR-GAIT` | `bishop` **without** heal | proposed `pair_gaiter` | `physical_attack`, `spell-pair-gait` | flanker; skip if leftover MP is not exactly 2 unless 10 still kills |
| `ROLE-AXIS-CUT` | `bishop` **without** heal | proposed `axis_cutter` | `physical_attack`, `spell-leash-cut` | controller; skip if no allied summon on the **handler’s** rank or file; Dummy Post is not a pet; family is **not** Wave 8 `leash_cutter` |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Lagger, Gracer, Gaiter, Still-Gift, Gaunt-Mend, Oct, or Gaunt-Post.

### Fair-fight rules (every sheet)

Same as drops 1–14, plus Wave 14:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Gaunt Post never detonates on leftover AP ≥ 1 **or** leftover MP ≥ 1.
- Swap / pull / push / gaunt-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip: cap applied MP debuff at **−2**. One Slow **or** one Bare Sip source per pack.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Odd Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct — never two engines). Oct is illegal until remaining cap ≥ 8.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Orbit **must** skip if `findPath` after a hypothetical orbit would not reach an exit. Never seal the last aisle.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-GAUNT-STEP` | PAIR | four-flag healer + four-flag joiner | this drop |
| `FSN-GAUNT-SIP` | PAIR | fully-spent poke + leftover-MP=0 AP steal | this drop |
| `FSN-EVEN-ORTH` | PAIR | even-range miss + next walk orthogonal | this drop |
| `FSN-BRICK-WAKE` | PAIR | pull toward barrier + start-turn occupy paint | this drop |
| `FSN-GAUNT-GATE` | CELL | fully-spent post + start-turn fully-spent sill | this drop |
| `FSN-ORTH-TRI` | CELL | orthogonal-only walk + next-spell exact 3 | this drop |
| `FSN-GLYPH-FULL` | CELL | 1-tile glyph-tax skip + leftover-MP≥3 +RES | this drop |
| `FSN-GAIT-WATCH` | CELL | leftover-MP miss + snap grants walker AP | this drop |
| `FSN-GAUNT-CHOIR` | BRIGADE | four-flag heal + last-id until both leftover 0 + ignite | this drop |
| `FSN-GAUNT-COURT` | BRIGADE | gaunt sting + bare sip + odd hold | this drop |
| `FSN-GAUNT-QUIET` | BRIGADE | gaunt step + gaunt mend + cover | this drop |
| `FSN-STILL-GRACE` | BRIGADE | camped-target heal + next-own skip CD + once | this drop |
| `FSN-LONE-AXIS` | CADRE | isolation bite + handler-on-file cut + brood | this drop |
| `FSN-DEBT-ORBIT` | CADRE | spelled-last-turn walk tax + orbit barrier + glyph tax | this drop |
| `FSN-PAIR-GIFT` | CADRE | leftover-MP exactly 2 poke + target-camp heal + arbiter | this drop |
| `FSN-GAUNT-HOLD` | COURT | Strike-until leftover MP=0 **and** last AP + tools-until leftover MP=0 **and** last AP + warden | this drop |

Named packs as variants: `FSN-GAUNT-GATE/STING` (Gaunt Gate full), `FSN-BRICK-WAKE/GLYPH` (Brick Wake full), `FSN-EVEN-ORTH/GUN` (Even Orth full), `FSN-ORTH-TRI/FAR` (Orth Tri full), `FSN-GLYPH-FULL/LEY` (Glyph Full full), `FSN-GAIT-WATCH/GUN` (Gait Watch full), `FSN-GAUNT-COURT/LEND` (Gaunt Lend escort), `FSN-GAUNT-CHOIR/LAG` (pad then verse), `FSN-GAUNT-QUIET/LEND` (Gaunt Lend escort), `FSN-GAUNT-HOLD/OCT` (Oct Plug — skip until remaining cap ≥ 8; live cap is 2), `FSN-GAUNT-HOLD/BOUNCE` (Bounce Ring leftover-pair), `FSN-GAUNT-HOLD/KENNEL` (Gait Kennel).

---

## Formations

### FSN-GAUNT-STEP

FORMATION_ID: `FSN-GAUNT-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-GAUNT-MEND` — `queen` **with** heal / proposed `gaunt_mender` — pack median — back
- `ROLE-GAUNT-STEP` — `queen` **without** heal / proposed `gaunt_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Gaunt Mend is a heal kit; kit band 0 has no heal). Show `FSN-DRY-STEP` instead (leftover-MP=0 tell without the four leftover-0 8).
- Gaiter kit: Gaunt Mend + Shield. **No** Inferno, no Enrage, no Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). **Not** Hollow Gift. Extra door `gaunt_cantor` is **not** this family.
- Stepper kit: Gaunt Step + Strike. **No** Parched / Home / Heave / Ally Step / Cover on PAIR (those are `FSN-GAUNT-QUIET` / `FSN-PARCHED-QUIET`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-DRY-STEP` **or** `FSN-PAIR-DRY` (player has seen leftover-MP=0 heal **or** leftover-AP=0 heal; this sheet cashes **all four** leftover-0 flags for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Walk-spend does **not** substitute. Dual Keep leftover is **not** empty.

SPELL_POOL_INTERACTIONS:

- Gaunt Mend (8 HP) pays only if **caster and target** leftover AP = 0 **and** leftover MP = 0 after the 3 AP is paid. One wet pool on one body is 0 HP — Shield queen.
- Gaunt Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover AP **and** leftover MP are already 0. It is not Parched Step and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover AP **and** leftover MP are already 0; if the Mender is still wet, Stepper Frosts / Strikes.
- Mender Gaunt-Mends only if all four leftover = 0 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill.

SYNERGY:

- Four-flag healer + four-flag joiner. Wave 13 Dry Step standing on **both** leftover pools. Combination, not a new sprite. Remaining 1 leftover AP **or** 1 leftover MP on either body is a complete answer.

PLAYER_THREAT:

- Slow refill if you empty **both** pools on **both** bodies. Spike is low. Misplay is Rooting neither and dumping the last chip into an 8 that just landed.

COUNTERPLAY:

- Keep 1 leftover AP **or** 1 leftover MP on one body. Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). Dual Keep. The Stepper without a fully-spent ally is Strike / Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced dump + four-flag heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if any leftover ≥ 1.
- Stepper: protector; skip if ally leftover AP ≥ 1 or leftover MP ≥ 1 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-GAUNT-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-GAUNT-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-GAUNT-SIP

FORMATION_ID: `FSN-GAUNT-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-GAUNT-STING` — `pawn` **without** heal / proposed `gaunt_stinger` — pack median or −1 — starts wide
- `ROLE-BARE-SIP` — `pawn` **without** heal / proposed `bare_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-LEAN-SIP` (leftover **AP = 0 and leftover MP ≥ 1** poke + leftover-AP=0 MP steal) and `FSN-DRY-TAX` (leftover-AP = 0 poke, no MP gate). Pressure is the **fully-spent** window: leftover AP = 0 **and** leftover MP = 0, **or** leftover MP = 0 with leftover AP still sitting.
- Band 0: Stinger Strike only; Sipper Frost only (Gaunt Sting / Bare Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-LEAN-SIP`.
- Elite: Stinger only. Sipper never gets Parched Sip or Gait Sip (PAIR bans).
- Unlock after `FSN-LEAN-SIP` **or** `FSN-DRY-TAX` (player has seen leftover-AP poke **or** leftover-pair as a resource).
- Pair Gait / Pair Purse / Lean / Ready stay off PAIR (PAIR bans). Odd Hold stays off (that is `FSN-GAUNT-COURT`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Gaunt Sting: 10, +8 iff **target** leftover AP = 0 **and** leftover MP = 0. Dual Keep leftover is **not** 0.
- Bare Sip: deal 8, then steal 1 leftover AP iff leftover MP = 0 **and** leftover AP ≥ 1. Else 8 only. Inverse of Parched Sip. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover MP = 0 **and** leftover AP ≥ 1; else Frosts.
- Stinger lurks at 3 and commits when both leftover = 0 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Fully-spent poke + leftover-MP=0 AP steal. Wave 13 Lean Sip standing on the **empty walk** instead of the wet walk. You see the dry tile and the leftover purse; the knife waits for both empty **or** the sip flips even leftover AP onto odd for Court.

PLAYER_THREAT:

- High if you dump both pools, then trade the Stinger. Low if you keep 1 leftover AP **or** 1 leftover MP. Not unavoidable: keep a 1-chip, Dual Keep, or kill the Stinger and eat Frost.

COUNTERPLAY:

- Keep 1 leftover AP **or** 1 leftover MP. Kill the Stinger (`hp` ~0.70). Force the Sipper to leave a hazard this turn (sip refuses if leftover MP ≥ 1). Lean Sting the remaining wet-walk if you brought it.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile.
- No Time Warp (panic + leftover tax).

AI_REQUIREMENTS:

- Stinger: flanker + leftover-pair hold (AP=0 and MP=0).
- Sipper: flanker; skip if leftover MP ≥ 1 or leftover AP = 0; heal-less so inference stays caster.
- Soph 1–2.

VARIANTS:

- `FSN-GAUNT-SIP/E-STING` — elite Stinger, still no Odd Hold on PAIR.
- `FSN-GAUNT-COURT` is the BRIGADE with Hold — do not merge.

STATUS: PROPOSED

---

### FSN-EVEN-ORTH

FORMATION_ID: `FSN-EVEN-ORTH`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-EVEN-HOOD` — `pawn` or `knight` **without** heal / proposed `even_hooder` — pack median + 1 — front
- `ROLE-ORTH-STRIDE` — `knight` **without** heal / proposed `orth_warder` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-ODD-MUST` (odd-range miss + leftover-MP tool-lock) and `FSN-DIAG-OATH` (diagonal-only walk + exact-2 oath). Pressure is **parity plus axis**: melee at 2 is even — it whiffs — and the next walk must be orthogonal.
- Band 0: Hood Strike / Shield; Warder Strike only. Orth Stride / Even Hood are band 1. If kit band is still 0, **do not spawn this id** — show `FSN-ODD-MUST`.
- Elite: Hood only. Warder never gets Diag Stride / Inch / Must Step (PAIR bans).
- Unlock after `FSN-ODD-MUST` **or** `FSN-DIAG-OATH` (player has seen a parity hood **or** a next-walk shape lock).
- Own Plate / Off Plate / Odd Hood / Gait Plate stay off PAIR (PAIR bans). Glass Sniper stays off (that is `FSN-EVEN-ORTH/GUN`).
- Extra door `orth_gallery` is **not** this family. Extra door `even_gallery` stays Wave 9 Even Stride.

SPELL_POOL_INTERACTIONS:

- Even Hood: next applied damaging hit whose Chebyshev is even (0, 2, 4, …) deals 0 and consumes. Odd (1, 3, 5, …) lands and does **not** consume. Same-cell (0, even) **misses**. Do not read `CharacterStats.evasion`.
- Orth Stride: stance, 1 turn. The caster’s **next walk** this turn is legal **only** if orthogonal (`|dx|==0 XOR |dy|==0`, length ≥ 1). Diagonal dests fail confirm; MP is not spent. Teleport / Swap do not pay and do not consume.
- Together: standing at 2 to poke the Hood whiffs; standing at 1 lands, but the next walk cannot diagonal-cut back to 2. Strike at 1 is the designed answer.

TACTICAL_PLAN:

- Hood if the only threat sits at 0 or 2. Orth if a rank/file dest exists.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Even-range miss + orthogonal-only next walk. Wave 13 Odd Must standing on the **other** parity, plus the inverse of Diag Stride. Combination, not a new sprite. Step to 1, then Strike, is a complete answer.

PLAYER_THREAT:

- Frustration if you poke from 2. Spike is low. Misplay is diagonal-cutting to 2 after Orth arms, then eating a miss.

COUNTERPLAY:

- Step to Chebyshev 1, then Strike (odd lands; Orth does not stop Strike). Wait the consume. Kill the Hood. Root. Sit diagonal so Orth skips.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with room to stand at 1, 2, **and** 3, plus at least one orthogonal aisle. Reject a 1-tile diagonal-only tunnel (forced even poke + even miss reads as a lock).
- No Time Warp.

AI_REQUIREMENTS:

- Hood: guardian; skip if the only threat sits at odd Chebyshev.
- Warder: controller; skip if only dests are diagonal and Strike is better; **do not** assign to kits whose only walk is knight-jump.
- Soph 1–2.

VARIANTS:

- `FSN-EVEN-ORTH/GUN` — BRIGADE **Even Orth** full: add `ROLE-SNIPER` (`glass_sniper`) junior. Sniper holds minRange 3 (odd — Hood lets it land) so the player is baited to 2, where Hood eats the poke and Orth forbids the diagonal cut back to 1. **Never PAIR Even Hood with Odd Hood. Never PAIR Watch Alms with Glass as a two-body.** Unlock after `FSN-GLASS-WARD` **or** `FSN-ODD-MUST/GUN`.
- `FSN-ORTH-TRI` remains the exact-3 CELL; do not merge.

STATUS: PROPOSED

---

### FSN-BRICK-WAKE

FORMATION_ID: `FSN-BRICK-WAKE`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-BRICK-REEL` — `rook` **without** heal / proposed `brick_reeler` — pack median — back
- `ROLE-WAKE-MARK` — `bishop` **without** heal / proposed `wake_marker` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-VOID-DWELL` (pull toward **void/portal** + **end-turn** occupy) and `FSN-CINDER-MARK` (pull toward **hazard** + cell-**enter** detonate). Pressure is **toward the wall**, then **start-of-turn occupy**.
- Elite: Reeler only. Marker never gets Dwell / Ingress / Gaunt Sill (PAIR bans). Extra door `brick_aisle` / `wake_pulpit` is **not** this family.
- Unlock after `FSN-VOID-DWELL` **or** `FSN-CINDER-MARK` (player has seen a pull dest flavor **or** a tile bomb).
- Void / Cinder / Paint / Foe / Ally / File Reel stay off PAIR (PAIR bans). Glyph Sower stays off (that is `FSN-BRICK-WAKE/GLYPH`).
- Seventh `applyAttract` dest required. Dest is **toward**, not onto, a world portal. Occupancy `portals` stay impassable.
- If the map has no barrier in Chebyshev 6 of a legal floor, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Brick Reel: pull 1 toward the nearest **barrier** cell in Chebyshev ≤ 6. Empty / blocked / world-portal dest: fizzle that step (AP spent). Player keeps ≥ 1 walk-off that is **not** the barrier cell.
- Wake Mark: paint one floor tile 2 turns. 0 on cast. If a hostile **begins their turn** occupying the cell, deal 10 (spell, RES+SR) and the paint **consumes**. Walk-on and walk-off the same turn is free. Swap onto the cell does **not** detonate until their next turn **starts** there.
- Together: Reel toward the wall, paint the toward-cell. Leaving before **your** turn start is the designed answer.

TACTICAL_PLAN:

- Reeler Reels only if a legal floor step toward exists **and** a walk-off remains. Marker paints the toward-cell only if they can still walk off for 1 MP before their next turn.
- Never turn-1 double onto a wall tile with no exit.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Pull toward barrier + start-turn occupy. Wave 13 Void Dwell standing on a new dest flavor **and** a new clock (start of turn, not end). Combination, not a new sprite. Step off before your turn starts is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got reeled toward a pillar, then started my turn on the paint.” Recoverable: walk off, blink, send a summon to camp it.

COUNTERPLAY:

- Walk off before your turn. Occupy the toward-cell. Stand so no barrier is in 6. Burst the Reeler. Park a pet on the paint (it consumes; you walk free).

MAP_REQUIREMENTS:

- `arena`, `fortress`, or `asymmetric` with **at least one barrier** 2 tiles from typical stand, plus open floor the other way. Reject `openField` with no barriers (reroll). Reject `corridorMaze` (reel + start-turn in a hallway is a lock).
- No Void Rift tile as a legal landing. No lava dest.

AI_REQUIREMENTS:

- Reeler: caster + attract legality (landing walkable, not hazard, player retains ≥ 1 escape, skip if landing is safer, skip if no barrier).
- Marker: setter; skip if they can walk off for 1 MP.
- Soph 1–2. Until the seventh `applyAttract` dest exists, this sheet must not ship.

VARIANTS:

- `FSN-BRICK-WAKE/GLYPH` — CELL **Brick Wake** full: add `ROLE-GLYPH` (`glyph_sower`) junior. Glyph Marks a step-off cell on the toward-ray. **Never PAIR Brick Reel with File Reel. Never PAIR Wake with Ingress.** Unlock after `FSN-PAPER-PLAGUE` **or** `FSN-CINDER-MARK`.
- `FSN-DEBT-ORBIT` remains the orbit CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-GAUNT-GATE

FORMATION_ID: `FSN-GAUNT-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-GAUNT-POST` — `pawn` **without** heal / proposed `gaunt_prelate` — pack median — mid
- `ROLE-GAUNT-SILL` — `rook` **without** heal / proposed `gaunt_siller` — pack median — back

VARIANT_RULES:

- Distinct from `FSN-DRY-GATE` (leftover-**AP**=0 post + tile that forbids **walk MP**) and `FSN-VOID-DWELL` (ungated end-turn occupy). Pressure is **two clocks on two leftover-0 flags**: end-turn occupy detonates the post; start-of-turn occupy taxes the sill. Paint stays on the sill; the post dies on detonate.
- CELL: one post, one sill, **two different tiles**. Never paint the post’s cell as the sill on BASE (that is `/STING` BRIGADE with a third body, still two tiles).
- Elite: Siller only. Prelate stays junior so two fully-spent clocks cannot pin.
- Unlock after `FSN-DRY-GATE` **or** `FSN-GAUNT-SIP` (player has seen a leftover-gated post **or** a fully-spent poke).
- Lean Post / Dummy / Drift / Dwell / Wake stay off CELL as PAIR (PAIR bans). Gaunt Sting stays off BASE (that is `/STING`).
- `summonAI === "gauntpost"` required. Remaining cap ≥ 1. Live cap 2 is enough for this 1-cell post.

SPELL_POOL_INTERACTIONS:

- Gaunt Post: place on a free cell. Counts as **one**. At **end of a unit’s turn**, if that unit occupies this cell and leftover AP = 0 **and** leftover MP = 0, deal 10 and the post dies. Walk-on is legal. Relocate landing does **not** detonate. Leftover AP ≥ 1 **or** leftover MP ≥ 1 is safe (no damage, post stays).
- Gaunt Sill: paint one **other** free cell 2 turns. When a body **starts their turn** occupying it, if leftover AP = 0 **and** leftover MP = 0, deal 8 and **keep** the paint. Either leftover ≥ 1 → no damage, paint stays. Enter / leave / end-turn do **not** detonate.
- Together: camp leftover-0 on the post at turn end, **or** start leftover-0 on the sill. Dual Keep / a 1-chip peels both.

TACTICAL_PLAN:

- Prelate places the post on the cell they are likely to **end** on empty, then steps off. Siller paints a **different** likely start cell, never the only tile that reaches the Prelate.
- Never both clocks on the only aisle. Hostiles start ≥ 4 apart.

SYNERGY:

- Fully-spent post + start-turn fully-spent sill. Wave 13 Dry Gate standing on **both** leftover pools and a **start-of-turn** clock. Combination, not a new sprite.

PLAYER_THREAT:

- Chip if you dump both pools on either painted cell. Not a lock: keep a 1-chip, Dual Keep, walk off, blink. Failure is ending **and** starting leftover-0 on the two tiles.

COUNTERPLAY:

- Keep 1 leftover AP **or** 1 leftover MP. Leave both cells. Dual Keep. Burst the 8 HP post. Swap the post onto a summon. Kill the Siller (hp ~0.90).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (post + sill on the only tile is a hardlock).
- Two distinct free floor cells that are not the only player↔exit path.

AI_REQUIREMENTS:

- Prelate: summoner gauntpost; skip if Dual Keep / walk-off is free; fall through to Strike at cap (never skip-lock).
- Siller: setter; skip if they can Dual Keep or walk off; never paint the post’s cell on BASE.
- Soph 2–3.

VARIANTS:

- `FSN-GAUNT-GATE/STING` — BRIGADE **Gaunt Gate** full: add `ROLE-GAUNT-STING` junior. Sting the rest of the board after the post/sill teach. **Never PAIR Gaunt Sting with Lean / Dry / Pair Gait.** Unlock after `FSN-GAUNT-SIP`.
- `FSN-DRY-GATE` remains leftover-AP=0 Gate; this id is the **both-leftover-0** Gate.

STATUS: PROPOSED

---

### FSN-ORTH-TRI

FORMATION_ID: `FSN-ORTH-TRI`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-ORTH-STRIDE` — `knight` **without** heal / proposed `orth_warder` — pack median — mid
- `ROLE-TRI-OATH` — `bishop` **without** heal / proposed `tri_oather` — pack median — back

VARIANT_RULES:

- Distinct from `FSN-DIAG-OATH` (diagonal-only walk + exact **2**) and `FSN-EVEN-ORTH` (even miss + orthogonal walk, **no** oath). Pressure is **next walk orthogonal** and **next spell exact Chebyshev 3**.
- Elite: Oather only. Warder stays junior so two walk-shape elites cannot pin.
- Unlock after `FSN-DIAG-OATH` **or** `FSN-EVEN-ORTH` (player has seen a next-walk shape **or** an exact-range oath).
- Diag / Inch / Must Step / Mid Oath / Long Oath stay off CELL as PAIR (PAIR bans). Far Stinger stays off BASE (that is `/FAR`).
- Extra door `tri_nave` is **not** this family. Pack Cap (maxRange 2) stays off — it fights exact 3.

SPELL_POOL_INTERACTIONS:

- Orth Stride: next walk orthogonal only. Diagonal dests fail confirm.
- Tri Oath: 1 turn. Next **spell** is illegal unless the target is Chebyshev **exactly 3**. Strike / `physical_attack` stays legal at 1. Frost at 1, 2, or ≥ 4 fizzles (AP not spent).
- Together: you cannot diagonal-cut to 2 to dodge the oath, and you cannot Frost from 2. Closing to 1 and Striking is the designed answer.

TACTICAL_PLAN:

- Warder Orths if a rank/file dest exists. Oather Oaths then Frosts at 3 if LoS is open; else holds.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Orthogonal-only walk + exact-3 oath. Wave 13 Diag Oath standing on the inverse walk shape and a longer exact. Combination, not a new sprite.

PLAYER_THREAT:

- Frustration if you try Frost from 2 after Orth. Spike is low. Misplay is standing at 3 with leftover MP ≥ 1 into a Far Sting variant.

COUNTERPLAY:

- Close to 1, then Strike (oath exempts Strike; Orth does not stop Strike). Run to 4. Sit diagonal so Orth skips. Kill the Oather (`hp` ~0.75). Quiet Hex the 3-range poke.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with room to stand at 1, 2, 3, **and** 4, plus at least one orthogonal aisle. Reject a 1-tile tunnel.
- No Time Warp. Extra room `tri_nave` is a teach, not a spawn filter.

AI_REQUIREMENTS:

- Warder: skip if only dests are diagonal.
- Oather: skip if they must stay at 1–2; Strike stays legal.
- Soph 2–3.

VARIANTS:

- `FSN-ORTH-TRI/FAR` — BRIGADE **Orth Tri** full: add `ROLE-STINGER` (`far_stinger`) junior. Far Sting at 3 is the oath consumer. **Never PAIR Tri Oath with Long Oath. Never PAIR Orth with Diag.** Unlock after `FSN-EVEN-ORTH/GUN` **or** `FSN-INCH-OATH/STING`.
- `FSN-DIAG-OATH` remains exact-2 CELL; this id is exact-3.

STATUS: PROPOSED

---

### FSN-GLYPH-FULL

FORMATION_ID: `FSN-GLYPH-FULL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-GLYPH-SKIP` — `pawn` **without** heal / proposed `glyph_skipper` — pack median or −1 — mid
- `ROLE-FULL-GAIT` — `rook` **without** heal / proposed `full_gaiter` — pack median + 1 — front

VARIANT_RULES:

- Distinct from `FSN-CINDER-FULL` (1-tile **cinder** skip + leftover-**AP** ≥ 3 +RES) and `FSN-GAIT-WATCH` (leftover-MP **miss**, not +RES). Pressure is **cross the tax tile**, then **keep 3 walk MP** for +RES.
- Elite: Gaiter only. Skipper stays junior so two leftover-MP elites cannot stack miss + RES.
- Unlock after `FSN-CINDER-FULL` **or** `FSN-SPIKE-TAP` (player has seen a 1-tile hazard skip **or** a leftover-gated +RES).
- Cinder / Spike / Lava / Pit Skip stay off CELL as PAIR (PAIR bans). Full Plate / Gait Plate stay off PAIR (PAIR bans). Ley Toll stays off BASE (that is `/LEY`).
- If the map has no glyph-tax / AP-zone cell, **reroll this id**. Weight 0 on open boards with no tax tile.

SPELL_POOL_INTERACTIONS:

- Glyph Skip: stance, 1 turn. The caster’s next walk of **length 1** does not pay glyph-tax / AP-zone tiles. Length ≥ 2 pays. Cinder / lava / spikes / pits / void still apply. Teleport / Swap do not consume.
- Full Gait: if leftover MP at resolve is **≥ 3**, gain `buffStat: "res"`, `buffModifier: 1.20`, 2 turns. Leftover MP ≤ 2 → fizzle (AP spent). Last RES% writer vs Iron Skin — do not double-cast same turn.
- Together: Skip the 1-step tax so the Gaiter can keep 3 walk MP. Forcing a 2-walk spends the 3 and fizzles Full Gait.

TACTICAL_PLAN:

- Skipper Skips if a 1-tile glyph-tax dest exists. Gaiter Gaits if leftover MP ≥ 3 after the 2-AP arm; else Shields.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Glyph-tax skip + leftover-MP≥3 +RES. Wave 13 Cinder Full standing on a **different** hazard and the **walk** pool. Combination, not a new sprite.

PLAYER_THREAT:

- A 1.20 RES rook that crossed the tax tile for free. Spike is low. Misplay is letting them keep 3 MP after a 1-step.

COUNTERPLAY:

- Force a 2-walk first (Full Gait fizzles). Change the hazard type (cinder still ticks). Body-block the 1-step. Dispel the 1.20. Drain MP below 3. Burst through 1.20.

MAP_REQUIREMENTS:

- `fortress` or `arena` with **one glyph-tax / AP-zone cell** plus a clean aisle. Reject maps with tax on every approach (skip + tax-everywhere is a lock **or** the skip is the only verb).
- One clean aisle must remain that is **not** glyph-tax.

AI_REQUIREMENTS:

- Skipper: flanker; skip if the path is the wrong hazard or length ≥ 2.
- Gaiter: guardian; skip if leftover MP ≤ 2; do not also Iron Skin the same turn.
- Soph 2–3.

VARIANTS:

- `FSN-GLYPH-FULL/LEY` — BRIGADE **Glyph Full** full: add `ROLE-TOLL` (`ley_tollkeeper`) junior. Ley Toll is the **one** rare leftover-AP tax — never a second leftover-MP engine. **Never PAIR Full Gait with Gait Plate. Never PAIR Debt with Ley as a two-body.** Unlock after `FSN-GRAVITY-TAX`.
- `FSN-CINDER-FULL` remains leftover-AP Full; this id is leftover-MP Full.

STATUS: PROPOSED

---

### FSN-GAIT-WATCH

FORMATION_ID: `FSN-GAIT-WATCH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-GAIT-PLATE` — `rook` **without** heal / proposed `gait_plater` — pack median + 1 — front
- `ROLE-WATCH-ALMS` — `bishop` **without** heal / proposed `watch_almer` — pack median — back

VARIANT_RULES:

- Distinct from `FSN-OWN-WATCH` (next **own-turn** hit 0 + snap grants **watcher** AP) and `FSN-OFF-FEE` (off-turn miss + snap **debits** the walker). Pressure is **keep 1 walk chip** (next hit 0) and the snap they walk into **funds the walker** +1 AP.
- Elite: Plater only. Almer stays junior so two watch elites cannot mute **and** grant.
- Unlock after `FSN-OWN-WATCH` **or** walked into Hold Ground / Far Watch this run (relative mastery of overwatch, not a level gate).
- Own Plate / Off Plate / Full Gait stay off CELL as PAIR (PAIR bans). Watch Lend / Fee / Mute / Glass stay off PAIR (PAIR bans). Castellan stays off BASE (that is `/GUN`).
- Do **not** stack Watch Fee on this BASE kit (paying the walker **and** debiting them is a muddle).

SPELL_POOL_INTERACTIONS:

- Gait Plate: 2 turns. The next damaging hit against the caster is 0 **if** leftover MP at impact is ≥ 1; the charge then consumes. Leftover MP 0 → hit lands, charge remains. Strike and spells both consume when they miss.
- Watch Alms: 2 turns. The next time an allied overwatch **snap** deals damage, the **walker** who triggered it gains +1 leftover AP this turn. If the snap deals 0 (Watch Mute), Alms does not grant. Consume-on-first-snap.
- Together: you keep 1 MP so the plate misses, then walking into Far Watch **pays you** 1 AP — bait, not a lock. Blink in (no walk snap) is a complete skip of Alms.

TACTICAL_PLAN:

- Plater Plates if leftover MP ≥ 1 after the 2-AP arm. Almer Alms then arms Far Watch / Hold Ground the same turn if a snap is likely; else Frosts.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-MP miss + walker-grant snap. Wave 13 Own Watch standing on leftover **MP** instead of own-turn, and paying the **walker** instead of the watcher. Combination, not a new sprite. The designed answer is “do not walk into it, or walk after dumping MP.”

PLAYER_THREAT:

- A miss plus a free AP if you snap yourself. Spike is low. Misplay is walking into Far Watch with leftover MP ≥ 1, missing the plate, **and** handing yourself AP you then dump into a bad Inferno.

COUNTERPLAY:

- Drain MP first (Frost / Slow / Soul Sip) so the plate lands. Blink (no walk snap). Send a pet to snap. Watch Mute first. Dispel. Hit them after they dump MP.

MAP_REQUIREMENTS:

- `openField` or `arena` with a Far Watch / Hold Ground tile that is **not** the only aisle. Reject a 1-tile tunnel (forced walk-into-snap + miss reads as a lock).
- No Time Warp.

AI_REQUIREMENTS:

- Plater: guardian; skip if leftover MP already 0 or they must spend that MP to leave a hazard.
- Almer: artillery; skip if no snap is likely; heal-less.
- Soph 2–3.

VARIANTS:

- `FSN-GAIT-WATCH/GUN` — BRIGADE **Gait Watch** full: add `ROLE-TURRET` (`stone_castellan`) junior. Turret faces the same aisle the plate holds. **Never PAIR Watch Alms with Watch Lend. Never PAIR Orbit with Castellan as a two-body.** Unlock after `FSN-SHARD-BATTERY/LANE` **or** `FSN-OWN-WATCH/GUN`. Cap 1 turret. Remaining cap ≥ 1.
- `FSN-OWN-WATCH` remains own-turn Watch; this id is leftover-MP Watch.

STATUS: PROPOSED

---

### FSN-GAUNT-CHOIR

FORMATION_ID: `FSN-GAUNT-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GAUNT-MEND` — `queen` **with** heal / proposed `gaunt_mender` — pack median
- `ROLE-VERSE-GAUNT` — `bishop` **without** heal / proposed `verse_gaunter` — pack median
- `ROLE-HAZARD` — `knight` / proposed `ignite_alchemist` (else live `ember_knight` without Inferno on BASE) — pack median — **one** Inferno cadence

VARIANT_RULES:

- Unlock after `FSN-IMPRINT-CHOIR` **or** `FSN-GAUNT-STEP` (player has seen last-id until leftover MP = 0 **or** four-flag heal). Wave 14 “Gaunt Choir.”
- Elite: Mender only. Verse and Ignite stay junior.
- **Never PAIR Gaunt Mend with Dry / Still / Gift / Pale.** **Never PAIR Verse Gaunt with Verse Lean / Pace / Last Mute.** This BRIGADE is dual-dry 8, then Inferno is illegal until **both** leftover = 0. Designed answers: keep 1 leftover on one pool, recast a cheap id last, dump both leftover to peel Verse, Cursed Wound, kill the Mender.
- Ignite is the **one** rare. Stack gate ≥ 2 public DoT ticks before Inferno. Ember live melee-burn is **off** unless the variant says so (double DoT + four-flag heal is CADRE).
- `lastResolvedSpellId` required. Forced-move does **not** peel Verse Gaunt. Dual Keep leftover is **not** empty.
- Extra door `gaunt_cantor` is first-win vs family observe — do **not** restamp `parched_cantor`.

SPELL_POOL_INTERACTIONS:

- Gaunt Mend: heal 8 iff all four leftover = 0. Dual Keep **blocks**.
- Verse Gaunt: last resolved id illegal until leftover AP = 0 **and** leftover MP = 0. Other ids remain legal. Strike last → Verse skips (VETERAN).
- Inferno: 8/turn × 3, CD 3. Verse of Inferno means you must empty **both** leftover pools before recast — or recast Frost instead.

TACTICAL_PLAN:

- Turn 1: Verse if last id is their best **and** they hold leftover; else Frost. Mender Shields unless all four leftover = 0 **and** missing HP ≥ 8. Ignite holds Inferno until LoS and a public DoT already exists **or** HP% ≤ 50.
- Never dump leftover **only** to enable the 8 if a Strike would kill.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Four-flag heal + last-id until both leftover 0 + ignite. Wave 13 Imprint Choir standing on **both** leftover pools instead of leftover-MP peel. Combination, not a new sprite.

PLAYER_THREAT:

- High if you recast Inferno while holding leftover, then empty both pools into an 8. Low if you keep 1 leftover on one pool **or** recast a cheap id last. Not unavoidable: keep a chip, dump both leftover, Cursed Wound, kill the Mender.

COUNTERPLAY:

- Keep 1 leftover AP **or** MP (Mend skips). Recast a cheap id last (Verse locks the wrong tool). Dump both leftover (Verse peels). Cursed Wound the Mender. Kill the Mender. Kill Ignite before the second Inferno. Dispel.

MAP_REQUIREMENTS:

- `openField` or `arena`. Ignite needs a flank that is not the only exit. Mender needs a retreat tile.
- No Time Warp. No Glass Realm. No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Mender: healer; skip if any leftover ≥ 1.
- Verse: controller; skip if no last id or last id is Strike.
- Ignite: flanker; **not** berserk; one Inferno cadence (`AI-TEM-04`).
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-GAUNT-CHOIR/LAG` — BRIGADE: replace Ignite with `ROLE-CADENCE-LAG`. Pad remaining `n>0` → `n+2`, then Verse the padded id. **Never PAIR Lag with Imprint / Rest / Grace / Stall.** Zeros stay ready (Lag is **not** a silence of unused tools). Unlock after `FSN-IMPRINT-CHOIR`.
- `FSN-IMPRINT-CHOIR` remains leftover-MP last-id; this id is **both-leftover** last-id.

STATUS: PROPOSED

---

### FSN-GAUNT-COURT

FORMATION_ID: `FSN-GAUNT-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GAUNT-STING` — `pawn` **without** heal / proposed `gaunt_stinger` — pack median or −1 — starts wide
- `ROLE-BARE-SIP` — `pawn` **without** heal / proposed `bare_sipper` — pack median
- `ROLE-ODD-HOLD` — `knight` **without** heal / proposed `odd_holder` — pack median + 1 — front

VARIANT_RULES:

- Unlock after `FSN-GAUNT-SIP`. Wave 14 “Gaunt Court.”
- Elite: Stinger only. Sipper and Holder stay junior.
- **Never PAIR Gaunt Sting with Lean / Dry / Pair Gait.** **Never PAIR Bare Sip with Parched Sip.** **Never PAIR Odd Hold with Dry Hold.** This BRIGADE is fully-spent poke, steal leftover AP on dry walk, nail **odd** leftover AP walks. Designed answers: keep 1 leftover MP, dump leftover AP to 0 or 2 (even — Odd Hold peels walk), kill the Stinger.
- Leftover-AP **and** leftover-MP writers required. One Slow **or** one Bare Sip, not both past −1 leftover AP.
- Gaunt Lend stays off BASE (that is `/LEND`).

SPELL_POOL_INTERACTIONS:

- Gaunt Sting: 10 + 8 iff leftover AP = 0 **and** leftover MP = 0.
- Bare Sip: steal 1 leftover AP iff leftover MP = 0 **and** leftover AP ≥ 1. Stealing 1 flips even leftover AP onto odd — that is the Hold setup.
- Odd Hold: 2 of **their** turns, walk confirm fails while leftover AP is odd (1, 3, 5, …). Even leftover AP (0, 2, 4, …) **may walk**. Force-move / swap / blink still legal. Leftover 0 is even — that is the teach vs Dry Hold.

TACTICAL_PLAN:

- Turn 1: Holder Holds if leftover AP is 1 or 3 **and** they want to walk; else Frosts. Sipper Sips if leftover MP = 0 **and** leftover AP ≥ 1. Stinger lurks at 3 and commits when both leftover = 0 **or** HP% ≤ 40.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Fully-spent poke + dry-walk AP steal + leftover-AP-parity walk lock. Wave 13 Lean Court standing on **both** leftover 0 instead of dry-purse/wet-walk, plus parity instead of leftover-AP=0 Dry Hold. Combination, not a new sprite.

PLAYER_THREAT:

- High if you sit leftover AP 1 with leftover MP 0, then get Sipped onto leftover 0 and Stung. Low if you keep 1 leftover MP **or** dump to leftover AP 0/2 and walk. Not unavoidable: keep a walk chip, dump to even leftover AP, blink, kill the Stinger.

COUNTERPLAY:

- Keep 1 leftover MP (Sip and Sting skip the 8). Dump leftover AP to 0 or 2, then walk (Odd Hold peels). Blink / Swap. Kill the Stinger (`hp` ~0.70). Kill the Holder. Sit and Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit. Holder needs a retreat tile.
- Reject a 1-tile tunnel (odd leftover AP + forced walk is a lock). No Time Warp. No Root.

AI_REQUIREMENTS:

- Stinger: flanker; skip if either leftover ≥ 1 unless 10 still kills.
- Sipper: flanker; skip if leftover MP ≥ 1 or leftover AP = 0.
- Holder: controller; skip if leftover AP already even; leftover 0 **may walk**.
- Soph 3–4. `groupTactics` at 4.

VARIANTS:

- `FSN-GAUNT-COURT/LEND` — BRIGADE: replace Holder with `ROLE-GAUNT-LEND`. Fund a step **and** an action after they emptied both. **Never PAIR Gaunt Lend with Lean / Spent / Drift.** Unlock after `FSN-LEAN-COURT/LEND`. CHAMPION Lender never Lends the player a 1/1 that enables their lethal.
- `FSN-GAUNT-SIP` remains the teaching PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-GAUNT-QUIET

FORMATION_ID: `FSN-GAUNT-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GAUNT-STEP` — `queen` **without** heal / proposed `gaunt_stepper` — pack median — mid
- `ROLE-GAUNT-MEND` — `queen` **with** heal / proposed `gaunt_mender` — pack median — back
- `ROLE-COVER` — `rook` / proposed `cover_squire` (else live `iron_golem` junior) — pack median + 1 — front, **off** the join dest ring

VARIANT_RULES:

- Unlock after `FSN-GAUNT-STEP` **and** (`FSN-PARCHED-QUIET` **or** `FSN-HEAVE-QUIET`). Wave 14 “Gaunt Quiet.”
- Elite: Stepper only. Mender and Cover stay junior.
- **Never PAIR Gaunt Step with Parched / Home / Heave / Ally / Cover.** This BRIGADE is the three-body lesson: join the fully-spent ally, then cash the four leftover-0 8, while Cover peels the aisle. Designed answers: keep 1 leftover on one pool, occupy every Chebyshev-1, Cursed Wound, kill the Mender.
- Cover kit: Strike + Shield. **No** Inferno. Ally Shield apply (`targetId`) required before this id ships Cover’s Shield onto the Mender — if missing, Cover is a fat body only (still valid).
- Gaunt Lend stays off BASE (that is `/LEND`). Do not also roll random summoner overlay.

SPELL_POOL_INTERACTIONS:

- Gaunt Step: relocate onto a free Chebyshev-1 of an ally whose leftover AP **and** leftover MP are already 0. Occupancy dest, not `isSwap`. Blocked dest fizzles (AP spent).
- Gaunt Mend: heal 8 iff all four leftover = 0. Dual Keep **blocks**.
- Cover Shield is RES, not reflect. Cover does **not** stand on the dest ring (that would close the designed join).

TACTICAL_PLAN:

- Cover occupies the **gallery** so walking off the dest ring still costs a body. It does not also stand on a Chebyshev-1 of the Mender.
- Stepper Steps only if a free dest exists **and** is not the player’s only exit. Mender Gaunt-Mends only if all four leftover = 0 **and** missing HP ≥ 8.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Join the fully-spent ally + four-flag 8 + cover. Wave 13 Parched Quiet standing on **both** leftover pools. Combination, not a new sprite.

PLAYER_THREAT:

- A join that refills if you emptied both pools. Spike is low. Misplay is ignoring the Mender forever while Cover holds the door.

COUNTERPLAY:

- Keep 1 leftover on one pool. Occupy every Chebyshev-1. Cursed Wound the Mender. Kill the Mender. Walk the gallery. Swap the Stepper off the dest.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with two approach vectors plus a dest ring of ≥ 3 free cells. Reject cramped `corridorMaze` (join in a closet is a lock **or** useless).
- Cover needs a gallery tile that is **not** on the dest ring.

AI_REQUIREMENTS:

- Stepper: skip if ally leftover ≥ 1 or no free dest; CHAMPION never Step onto the only player↔exit path.
- Mender: healer; skip if any leftover ≥ 1.
- Cover: charger that body-blocks the gallery, not a suicide walk onto the dest ring.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4. Ally `targetId` apply for Cover Shield.

VARIANTS:

- `FSN-GAUNT-QUIET/LEND` — BRIGADE: replace Cover with `ROLE-GAUNT-LEND`. Fund 1/1 after empty, then join. **Never PAIR Gaunt Lend with Lean Lend.** Unlock after `FSN-GAUNT-COURT/LEND`.
- `FSN-GAUNT-STEP` remains the teaching PAIR; do not merge.
- `FSN-PARCHED-QUIET` remains leftover-MP Quiet; this id is **both-leftover** Quiet.

STATUS: PROPOSED

---

### FSN-STILL-GRACE

FORMATION_ID: `FSN-STILL-GRACE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-STILL-GIFT` — `queen` **with** heal / proposed `still_gifter` — pack median
- `ROLE-CADENCE-GRACE` — `bishop` **without** heal / proposed `cadence_gracer` — pack median
- `ROLE-CANTOR` — `queen` / proposed `once_cantor` (else default with **no** healAmount on this body) — pack median — echo lock; **no** Inferno on BASE

VARIANT_RULES:

- Unlock after `FSN-STILL-REST` **or** `FSN-GAUNT-STEP` (player has seen caster-walk-spent=0 heal **or** four-flag heal; this sheet heals if the **target** camped). Wave 14 “Still Grace.”
- Elite: Gifter only. Gracer and Once stay junior.
- **Never PAIR Still Gift with Gaunt Mend / Still Mend / Dry Gait / Dry Mend / Pale.** **Never PAIR Grace with Rest / Lag / Theft / Pin.** This BRIGADE is camped-target heal, then Inferno does not start CD. Designed answers: walk the wounded body 1 MP, Quiet Hex the free-CD spell, Dispel the grace, kill the Gifter.
- Once Cantor is the **one** rare echo lock — not a second skip-CD. Inferno on the **Gracer** (ADVANCED) is the free-CD nightmare; BASE sheet may Frost instead if kit band is 1.
- `walkMpSpentThisTurn` required on the **target**. Caster walk does **not** gate Gift. Strike is **not** a spell for Grace.

SPELL_POOL_INTERACTIONS:

- Still Gift: heal 8 iff the **target** spent 0 walk MP this turn at resolve. Target may be self. Target already walked → fizzle (AP spent, no heal).
- Cadence Grace: the caster’s **next spell** does not write its cooldown on resolve. Already-running remaining CDs still tick. 2-turn window.
- Once: echo lock on the free-CD id if attached. Do not also Rest (PAIR ban).

TACTICAL_PLAN:

- Turn 1: Gifter Gifts if the wounded ally (or self) spent 0 walk MP **and** missing HP ≥ 8; else Shields. Gracer Graces then Infernos / Frosts. Once holds.
- Never dump the target’s MP **only** to enable the 8 if a Strike would kill.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Target-camp heal + skip-CD next tool + once. Wave 13 Still Rest standing on the **target’s** walk instead of the caster’s, and skip-CD write instead of skip-own-tick. Combination, not a new sprite.

PLAYER_THREAT:

- An 8 on a camper, then a second Inferno with no CD. Interruptible: walk the wounded body, Quiet Hex Inferno, kill the Gracer before the second Inferno.

COUNTERPLAY:

- Walk the wounded body 1 MP (Gift fizzles). Cursed Wound the Gifter. Quiet Hex Inferno. Dispel Grace. Kill the Gifter. Kill the Gracer. Force Strike (Grace skips).

MAP_REQUIREMENTS:

- `openField` or `arena`. Gifter needs a retreat tile. Once needs LoS that is not the only aisle.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Gifter: healer; skip if the target already walked.
- Gracer: caster; skip if the next cast is Strike; heal-less.
- Once: controller; skip recast of an active echo (`AI-TEM-04`).
- Soph 3–4. `groupTactics` at 4.

VARIANTS:

- `FSN-STILL-GRACE/NO-ONCE` — Gifter + Gracer only (if echo apply is not ready). Still no Rest.
- `FSN-STILL-REST` remains caster-camp Rest; this id is **target**-camp Grace.

STATUS: PROPOSED

---

### FSN-LONE-AXIS

FORMATION_ID: `FSN-LONE-AXIS`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-LONE-BITE` — `knight` **without** heal / proposed `lone_biter` — pack median — starts wide
- `ROLE-AXIS-CUT` — `bishop` **without** heal / proposed `axis_cutter` — pack median
- `ROLE-SUMMONER` — `king` / proposed `brood_chanter` (else live overlay **on this body only**) — pack median − 1 — cap 1 wolf

VARIANT_RULES:

- Unlock after `FSN-FOE-ESCORT` **or** `FSN-NULL-BROOD` (player has seen adj-hostile bite **or** a brood). Wave 14 “Lone Axis.”
- Elite: Biter only. Cutter and Brood stay junior.
- **Never PAIR Lone Bite with Foe / Side / Lone Sting.** **Never PAIR Axis Cut with Escort / Leash / Pet / Banner / Crown / Null as a two-body.** This CADRE is isolation-from-**everyone** bonus, then axis-pet bonus on the **handler**. Designed answers: park a summon adjacent (blocks Lone), park pets **off-axis** (blocks Axis), Sever Tether, fight unsummoned.
- Brood cap 1. Shares `ENEMY_SUMMON_CAP`. Dummy Post is **not** a pet. Do not also roll a second summoner overlay.
- Axis Cut CORE is `spell-leash-cut`. Family is **`axis_cutter`** — Wave 8 `leash_cutter` stays Short Leash. Do not restamp that observe door.
- Weight ×2 if the player has a living summon (the pack is an anti-summon teach). Weight 0 if `summonAI` is empty on the Brood body (Wave 1 name-fallback still live — drop the id).

SPELL_POOL_INTERACTIONS:

- Lone Bite: 10 + 8 if the target has **0** living units of any side at Chebyshev 1. Neighbor summons, decoys, **and the caster** all count. Do not also apply Foe Bite’s adjacent-hostile bonus on G=0.
- Axis Cut (Leash Cut): 10 + 8 if the target shares rank **or** file with a living **allied summon** (same side as the target). If the target **is** the summon, the bonus does **not** apply. Distance on that axis is free.
- Brood wolf: Strike + Venom. Pets do not grant extra XP. Isolation decoy **blocks** Lone; axis alignment **arms** Cut.

TACTICAL_PLAN:

- Brood places the wolf **off** the player’s Chebyshev-1 (so Lone can still fire) **and** on the player’s rank or file (so Cut can fire). That placement is the puzzle — a wolf adjacent to the player blocks Lone and may miss the axis.
- Biter commits when 0 neighbors **or** HP% ≤ 40. Cutter Cuts the **handler**, not the pet.
- Hostiles start ≥ 4 apart. Wolf placement ≥ 2 from the player’s last exit.

SYNERGY:

- Isolation bite + handler-on-file cut + brood. Wave 13 Foe Escort standing on isolation-from-everyone instead of adj-hostile, plus rank/file instead of Chebyshev ≤ 2. Combination, not a new sprite.

PLAYER_THREAT:

- High if you stand alone on a file with a pet. Low if you clump **or** park the pet off-axis. Not unavoidable: neighbor decoy, off-axis pet, Sever Tether, unsummoned fight.

COUNTERPLAY:

- Park a summon adjacent (Lone skips the 8). Park pets off-axis (Cut skips the 8). Sever Tether. Fight without a summon (Cut skips; Lone still threatens isolation). Kill the Biter (`hp` ~0.85). Kill the Brood.

MAP_REQUIREMENTS:

- `chessboard` or `openField` with a 4-tile file **and** a gallery off that file. Reject cramped `corridorMaze` (forced axis + isolation is a lock).
- Brood needs a plant ring of ≥ 3 free cells, none void.

AI_REQUIREMENTS:

- Biter: flanker; skip if any neighbor and Strike is better; CHAMPION caster-counts.
- Cutter: controller; skip if no axis pet; reads `isSummon`, never `"wolf"`; Dummy Post is not a pet.
- Brood: summoner; skip-lock fall-through to Strike; cap 1; do not plant adjacent to the player **and** off-axis (that bricks both bonuses — ELITE brood; BASE may misplace, and that is a teach).
- Soph 4–6. `groupTactics` on. One focus.

VARIANTS:

- `FSN-LONE-AXIS/NO-BROOD` — BRIGADE-shaped CADRE if brood id is not ready. Biter + Cutter only; Cut then needs the **player’s** pet on-axis.
- `FSN-FOE-ESCORT` remains adj-hostile Escort; this id is isolation + axis.

STATUS: PROPOSED

---

### FSN-DEBT-ORBIT

FORMATION_ID: `FSN-DEBT-ORBIT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-CAST-DEBT` — `bishop` **without** heal / proposed `debt_caster` — pack median
- `ROLE-BRICK-ORBIT` — `rook` **without** heal / proposed `brick_orbiter` — pack median + 1
- `ROLE-TAX` — `bishop` / proposed `tax_scribe` (else live `bone_scribe` with Mark only) — pack median — zone AP tax; **no** drain

VARIANT_RULES:

- Unlock after `FSN-SPENT-CRACK` **or** `FSN-BRICK-WAKE` (player has seen walked-then-spell tax **or** a barrier pull). Wave 14 “Debt Orbit.”
- Elite: Orbiter only. Debt and Tax stay junior.
- **Never PAIR Debt with Spent / Still / Gait / Ley / Tax / Verse Tax as a two-body.** **Never PAIR Orbit with Crack / Sprout / Shift / Wipe / Castellan.** This CADRE is tax the walk after they **spelled**, then orbit the wall they hid behind, then glyph-tax the landing. Designed answers: Strike last turn (Debt fizzles), blink / Swap (do not pay), body-block orbit dests, leave the tax zone, solvability skip if the orbit would seal.
- Tax is the **one** rare. Drain Courage is COURT, not this sheet (two AP engines).
- Spelled-last-turn flag required. Strike last turn does **not** arm Debt. Teleport / Swap do not pay.
- If the map has no barrier adjacent to a legal Orbiter stand, **reroll this id**. Solvability skip is mandatory on every Orbit.

SPELL_POOL_INTERACTIONS:

- Cast Debt: no damage. If the target resolved a non-Strike **spell** last turn, their **next walk of ≥ 1 tile** also costs +1 AP. Only Struck or camped → fizzle.
- Brick Orbit: move **one** barrier cell adjacent to the caster onto **another** adjacent empty floor cell. Occupancy / void / portal / existing barrier dest fizzles (AP spent, **no tile write**). If `findPath` after a hypothetical orbit would not reach exit, skip (no write).
- Glyph Tax: +1 AP to **cast** while in the 3×3, 0 damage. Leaving the zone is the answer. Cheap Strike from outside is legal. Tax will not overlap two zones.

TACTICAL_PLAN:

- Turn 1: Debt Debts only if they spelled last turn; else Frosts. Orbiter Orbits only if a dest exists **and** solvability holds. Tax paints a 3×3 on the good LoS tile / orbit landing **only if** an exit from the zone exists.
- Never turn-1 orbit onto the only aisle. Hostiles start ≥ 4 apart.

SYNERGY:

- Spelled-then-walk tax + orbit the wall + zone tax. Wave 13 Spent Crack standing on the **inverse** tax (spell then walk) plus orbit instead of remove. Combination, not a new sprite.

PLAYER_THREAT:

- Tempo and geometry. Failure is Inferno-from-inside after an orbit closed the gallery. Recoverable: Strike last turn, blink, leave the zone, body-block dests.

COUNTERPLAY:

- Strike last turn (Debt fizzles). Swap / blink (do not pay). Body-block both adjacent dests. Leave the tax zone. Burst the Orbiter. Occupy the landing. Kill the Tax if you plan a 5-AP turn.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with **at least one barrier** and ≥ 8 free floor cells. Reject `openField` with no barriers (reroll). Reject `corridorMaze` (orbit in a hallway seals).
- Tax 3×3 must not cover **all** walk-offs from the landing. Orbit dest must leave ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Debt: controller; skip if they only Struck or camped.
- Orbiter: setter; skip if no adjacent barrier, no empty dest, or solvability fails; never write a sealed path.
- Tax: caster; zone the landing **only** if an exit exists; skip recast of an active tax (`AI-TEM-04`).
- Soph 4–6. `groupTactics` on. Blackboard: `plannedOrbitDest`.

VARIANTS:

- `FSN-DEBT-ORBIT/NO-TAX` — Debt + Orbiter only (if zone-AP is not ready). Still no Spent Tax.
- `FSN-SPENT-CRACK` remains walked-tax CADRE; this id is **spelled**-then-walk CADRE.
- `FSN-BRICK-WAKE` remains pull-toward-barrier PAIR; this id **moves** the barrier.

STATUS: PROPOSED

---

### FSN-PAIR-GIFT

FORMATION_ID: `FSN-PAIR-GIFT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-PAIR-GAIT` — `bishop` **without** heal / proposed `pair_gaiter` — pack median − 1 — starts wide
- `ROLE-STILL-GIFT` — `queen` **with** heal / proposed `still_gifter` — pack median
- `ROLE-ARBITER` — `king` / proposed `coil_arbiter` (else default) — pack median — Slow + Frost — **no drain** on BASE

VARIANT_RULES:

- Unlock after `FSN-PAIR-DRY` **or** `FSN-GAUNT-STEP` (player has seen leftover-AP exactly 2 poke **or** four-flag heal). Wave 14 “Pair Gift.”
- Elite: Gaiter only. Gifter and Arbiter stay junior.
- **Never PAIR Pair Gait with Pair Purse / Gaunt Sting / Lone / Dry / Ready.** **Never PAIR Still Gift with Gaunt Mend / Still Mend / Dry Gait / Dry Mend / Pale.** This CADRE is leftover MP **exactly 2** poke, then cash **target walk-MP = 0** for 8. Designed answers: spend leftover MP to 1 or 0, sit at 3+, walk the wounded body 1 MP, Cursed Wound, kill the Gifter.
- Arbiter is the only Slow source. Cap Slow at −2 MP. Drain Courage is the **one** rare **instead of** a second AP engine, and only after `FSN-RIFT-KNOT` has been seen — BASE sheet has **no** drain.
- Extra door: **none** for Still Gift — do not invent `gift_cantor`. Do not restamp `parched_cantor` / `gaunt_cantor`.
- Leftover-MP **and** `walkMpSpentThisTurn` (on the Gift **target**) required.

SPELL_POOL_INTERACTIONS:

- Pair Gait: 10 + 8 iff **target** leftover MP at resolve is **exactly 2**. Leftover 0, 1, or ≥ 3 is 10 only.
- Still Gift: heal 8 iff the **target** spent 0 walk MP this turn. Caster may have walked. Target already walked → fizzle.
- Slow from Arbiter makes spending down to 2 (or 0) expensive but not a stun. Spend the pair, or sit at 3+, **or** walk the wounded body.

TACTICAL_PLAN:

- Turn 1: Arbiter Slow first (high init family). Gaiter lurks at 3 and commits when leftover MP is exactly 2 **or** HP% ≤ 40. Gifter Gifts only if the target spent 0 walk MP **and** missing HP ≥ 8; else Shields.
- Never dump leftover MP **only** to enable the 8 if a Strike would kill.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Exact-2 walk-MP poke + target-camp heal + Slow. Wave 13 Pair Dry standing on leftover **MP** instead of leftover **AP**, plus a heal that needs the **target** to camp. Spend the pair **or** walk the wounded body.

PLAYER_THREAT:

- High if you sit leftover MP 2 and trade the Gaiter, then camp the wounded body into an 8. Low if you spend to 1 or keep 3+. Not unavoidable: spend the pair, walk 1 MP, Cursed Wound, kill the Gaiter and eat Frost.

COUNTERPLAY:

- Spend leftover MP to 1 or 0 (Gait skips the 8). Sit at 3+. Walk the wounded body 1 MP (Gift skips). Cursed Wound the Gifter. Kill the Gaiter (`hp` ~0.75). Kill the Gifter. Occupy the tile the Gaiter wants.

MAP_REQUIREMENTS:

- `openField` or `arena`. Gaiter needs a flank path that is not the only exit. Gifter needs a retreat tile.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Gaiter: flanker; skip if leftover MP is not 2 unless 10 still kills.
- Gifter: healer; skip if the target already walked.
- Arbiter: controller (`AI-ROL-07`) + `AI-TEM-04` (no second Slow).
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-PAIR-GIFT/DRAIN` — COURT caution: Arbiter may hold Drain Courage **only** if `aiProfile` exists so healAmount does not steal controller, leftover lands on 2, and a walk-off remains. Still no Gaunt Mend on this id.
- `FSN-PAIR-DRY` remains the exact-2 **AP** CADRE; this id is exact-2 **MP**.
- `FSN-GAUNT-SIP` remains the fully-spent PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-GAUNT-HOLD

FORMATION_ID: `FSN-GAUNT-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-GAUNT-HOLD` — `pawn` or `knight` **without** heal / proposed `gaunt_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-GAUNT` — `knight` **without** heal / proposed `must_gaunter` — pack median
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median + 1 — on the backliner’s threat axis
- Optional fourth: `ROLE-EVEN-HOOD` junior **or** omit — if present, Hoods the pocket, not a second leftover-MP lock

VARIANT_RULES:

- Unlock after `FSN-GAUNT-SIP` **or** `FSN-ODD-MUST` **and** a leader-boost CADRE (`FSN-LEAN-HOLD` or `FSN-PAIR-GIFT`). Wave 14 “Gaunt Hold File.”
- One elite only: the Hold-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Gaunt Hold with Lean Hold / Hold Knight / Rite / Tool / Boot / Must Gaunt.** This COURT is the three-lock lesson: cannot **Strike** until leftover MP = 0 **and** Strike spends last AP, cannot **tool** until leftover MP = 0 **and** last AP, then a warden peels the aisle. Designed answers: dump leftover MP **and** spend last AP (both locks peel), live on waiting, kill Hold (glass-er than a golem), occupy the warden’s tile so the pocket never closes, blink / Swap (relocate ignores both leftover-MP locks).
- InstantKill / betrayal stay off. Root stays off (walk lock + leftover-MP tool lock + last-AP is a full lockout). Odd Hold stays off (that is `FSN-GAUNT-COURT`). Dry Hold stays off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Hold walks to the gallery after leftover MP = 0 peels them, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-GAUNT-HOLD/LANE` (variant): drop optional Hood — Hold + Must Gaunt + Warden only, **only** if the player has already answered `FSN-GAUNT-SIP` **and** `FSN-LEAN-HOLD` (otherwise it clones those as a PAIR — banned).

SPELL_POOL_INTERACTIONS:

- Gaunt Hold: 2 of the target’s turns, they cannot confirm `physical_attack` / `isPhysical: true` unless leftover walk MP = 0 **and** leftover AP **before paying Strike equals Strike’s AP cost**. Tools stay legal.
- Must Gaunt: remaining **non-Strike** spells confirm-fail unless leftover walk MP = 0 **and** leftover AP **after paying that spell** would be 0. Strike remains legal under its own rules.
- Together: Strike **and** tools need leftover MP = 0 **and** last AP — unless you dump leftover MP and spend last AP, you wait. Warden Shield / Iron Skin / body-block. Optional Even Hood: waste the 2-step poke — step to 1.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Hold if they still want to Strike with leftover MP ≥ 1 **or** leftover AP ≠ Strike cost. Must-Gaunt only after leftover MP ≥ 1 **or** leftover AP > next spell cost. Warden interposes with a **gap**. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Optional Hood holds the even band. If Hold dies, Strike opens (tools still need last AP); Must Gaunt without Hold is a softer `FSN-ODD-MUST` leftover — intended. Hold may retreat (`escapeRoute`) after leftover MP = 0 rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Court-scale leftover-MP **and** last-AP lock without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: dump leftover MP and spend last AP, wait, kill Hold, walk the gallery.

PLAYER_THREAT:

- Highest structured leftover-pair threat in this drop. Still turn-based. Failure is keeping leftover MP ≥ 1 to kite, then neither Strike nor Inferno confirms, while the Warden holds the door. Recoverable next turn after dumping the walk pool **and** spending last AP.

COUNTERPLAY:

- Dump leftover MP and spend last AP (both locks peel). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step to 1 if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover MP already 0 **and** leftover AP already equals Strike cost; never also Root / Seal / Odd Hold / Dry Hold; gate on `isPhysical === true`, never `spell.name === "Strike"`.
- Gaunter: skip if leftover MP already 0 **and** leftover AP already equals next spell cost; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if already at odd Chebyshev.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-GAUNT-HOLD/LANE` — BRIGADE-shaped: Hold + Must Gaunt + Warden only (ship if Hood gate is not ready). Still no Root.
- `FSN-GAUNT-HOLD/NO-HOOD` — COURT of three.
- `FSN-GAUNT-HOLD/OCT` — COURT **Oct Plug**: replace this id’s members with `ROLE-OCT` + `ROLE-GAUNT-SILL` + `ROLE-LANCER`. Hollow 3×3 seal, tax the hole at turn start, lance the ring. **Skip until remaining cap ≥ 8** (live cap 2). Burst the 8 HP. Walk a far diagonal. Sit on a ring cell so the place fizzles. Swap through the hole. `summonAI === "octspan"` required. Center hole stays unoccupied. Do not also roll a second post. Needs a free 3×3 plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 8. Weight 0 on maps with no free 3×3 (solvability).
- `FSN-GAUNT-HOLD/BOUNCE` — COURT **Bounce Ring**: replace Hold + Gaunt + Warden with `ROLE-GAUNT-BOUNCE` + `ROLE-MUST-GAUNT` + `fuse_binder`. Two leftover-AP=0 **and** leftover-MP=0 bodies, bounce 12+8 onto the wick. **Never PAIR Gaunt Bounce with Parched Bounce / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-LEAN-HOLD/BOUNCE` **or** `FSN-GAUNT-SIP`. Missing second leftover-pair flag → 12 only. Player keeps ≥ 1 leftover AP **or** MP on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-GAUNT-HOLD/KENNEL` — COURT **Gait Kennel**: replace Hold + Gaunt + Hood with `ROLE-SUMMON-GAIT` + `kennel_siller` + `null_censor`. Pets pay **MP** to walk, then they cannot leave — teach contrast vs Brace / Toll. **Never PAIR Summon Gait with Summon Toll / Walk Toll / Kennel / Brace / Brood as a two-body.** Unlock after `FSN-LONE-AXIS` **or** `FSN-LEAN-HOLD/TOLL`. Weight ×2 if the player has a living summon. Dummy Post is not a pet. Cap one kennel engine. Teleport / Swap / forced move do **not** pay the gait. Drop this variant if `summonAI` is empty.
- `FSN-LEAN-HOLD` remains the leftover-MP-only COURT; this id is leftover-MP **and** last-AP.
- `FSN-LEAN-HOLD/SIX` remains the 6-cell COURT; `/OCT` is the 8-cell hollow COURT.
- `FSN-ODD-MUST` / `FSN-GAUNT-SIP` remain the teaching PAIR; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–14 still stand. This drop **meshes**; it does not replace.

```
PAIR:    GAUNT-STEP         GAUNT-SIP          EVEN-ORTH         BRICK-WAKE
              \\                 |                   |                  /
CELL:     GAUNT-GATE        ORTH-TRI           GLYPH-FULL        GAIT-WATCH
              \\                 |                   |                  /
BRIGADE:  GAUNT-QUIET       GAUNT-COURT        STILL-GRACE       GAUNT-CHOIR
              \\                 |                   |                  /
CADRE:    LONE-AXIS         DEBT-ORBIT         PAIR-GIFT
              \\                 |                  /
COURT:                    GAUNT-HOLD    GAUNT-HOLD/OCT    GAUNT-HOLD/BOUNCE    GAUNT-HOLD/KENNEL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-GAUNT-STEP` | `FSN-DRY-STEP` **or** `FSN-PAIR-DRY` |
| `FSN-GAUNT-SIP` | `FSN-LEAN-SIP` **or** `FSN-DRY-TAX` |
| `FSN-EVEN-ORTH` | `FSN-ODD-MUST` **or** `FSN-DIAG-OATH` |
| `FSN-BRICK-WAKE` | `FSN-VOID-DWELL` **or** `FSN-CINDER-MARK` |
| `FSN-GAUNT-GATE` | `FSN-DRY-GATE` **or** `FSN-GAUNT-SIP` |
| `FSN-ORTH-TRI` | `FSN-DIAG-OATH` **or** `FSN-EVEN-ORTH` |
| `FSN-GLYPH-FULL` | `FSN-CINDER-FULL` **or** `FSN-SPIKE-TAP` |
| `FSN-GAIT-WATCH` | `FSN-OWN-WATCH` **or** walked into Hold Ground / Far Watch |
| `FSN-GAUNT-CHOIR` | `FSN-IMPRINT-CHOIR` **or** `FSN-GAUNT-STEP` |
| `FSN-GAUNT-COURT` | `FSN-GAUNT-SIP` |
| `FSN-GAUNT-QUIET` | `FSN-GAUNT-STEP` + (`FSN-PARCHED-QUIET` or `FSN-HEAVE-QUIET`) |
| `FSN-STILL-GRACE` | `FSN-STILL-REST` **or** `FSN-GAUNT-STEP` |
| `FSN-LONE-AXIS` | `FSN-FOE-ESCORT` **or** `FSN-NULL-BROOD` |
| `FSN-DEBT-ORBIT` | `FSN-SPENT-CRACK` **or** `FSN-BRICK-WAKE` |
| `FSN-PAIR-GIFT` | `FSN-PAIR-DRY` **or** `FSN-GAUNT-STEP` |
| `FSN-GAUNT-HOLD` | (`FSN-GAUNT-SIP` or `FSN-ODD-MUST`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 15 packs (not this drop)

Sibling [`ENEMY_ELITE_EVOLUTION_2026-10-23.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-23.md) (open as PR #941) names **new** families and packs that consume SPELL_PROPOSALS Wave 14 verbs (`SPELL_PROPOSALS_2026-10-22.md`, PR #890) plus leftover SDE Wave 13 unique CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 14 sheets.

| Wave 15 pack | Members (do not FSN this drop) |
| :--- | :--- |
| Poise Choir | `poise_mender` + `verse_poiser` + `ignite_alchemist` |
| Nine Plug | `nine_prelate` + `poise_siller` + `rank_lancer` (skip until remaining cap ≥ 9; live cap is 2) |
| Knight Quad | `knight_warder` + `quad_oather` + `glass_sniper` |
| Pit Axis | `pit_reeler` + `axis_biter` + `rime_mason` |
| Shove Drift | `shove_marker` + `drift_gifter` + `bash_bruiser` |
| Spent Full | `spent_plater` + `full_stinger` + `plate_warden` |
| Rime File | `rime_skipper` + `rime_mason` + `ley_tollkeeper` |
| Cast Kennel | `summon_caster` + `kennel_siller` + `null_censor` |
| Hollow Swap | `hollow_gifter` + `cadence_swapper` + `once_cantor` |
| Strike Tax | `strike_debter` + `tax_scribe` + `oncoming_knight` |
| Brick Nudge Gate | `brick_nudger` + `trip_mason` + `stone_castellan` |
| Watch Sip Hunt | `watch_sipper` + `glass_sniper` + `dim_optic` |
| Lone Hazard | `lone_gaiter` + `hazard_cutter` + `glyph_sower` |
| Poise Quiet | `poise_stepper` + `poise_mender` + `cover_squire` |
| Cross Poise | `bar_crosser` + `poise_mender` + `poise_stinger` |
| Poise Gate | `poise_prelate` + `poise_siller` + `poise_stinger` |
| Bounce Poise | `poise_bouncer` + `must_poiser` + `fuse_binder` |
| Poise Hold File | `poise_holder` + `must_poiser` + `leash_warden` |
| Lend Hood | `poise_lender` + `poise_hooder` + `tempo_precentor` |

Do **not** pack `gaunt_holder` with `must_gaunter` as a teaching pair (Wave 14 rule). `FSN-GAUNT-SIP` stays the fully-spent poke lesson; `FSN-GAUNT-HOLD` stays the Strike-until leftover MP=0 **and** last-AP COURT. Wave 15 `poise_holder` + `must_poiser` is the next COURT — not this drop.

Do **not** pack `gaunt_mender` with `still_gifter` as a teaching pair. `FSN-GAUNT-STEP` stays the four-flag lesson; `FSN-STILL-GRACE` stays the target-camp BRIGADE. Hollow Gift (`hollow_gifter`) is **target-only** both-pools — Wave 15 Hollow Swap.

Do **not** pack `gaunt_mender` with `dry_gaiter` / `dry_mender`. `FSN-DRY-STEP` stays leftover-MP=0; `FSN-PAIR-DRY` stays leftover-AP=0; this drop owns **both pools empty**. Poise Mend is leftover AP === leftover MP **and leftover AP ≥ 1** — **0 = 0 does not fire**.

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend. Same-day SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, PR #906) stays Wave **16** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–14, plus Wave 14 verbs in this order (from elite-evolution §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-EVEN-ORTH` band 0 can ship among the first** once family HP survives battle start. `FSN-GAUNT-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Gaunt Mend / Still Gift must live only on healer profiles.**
4. Battle-walk writers: `walkMpSpentThisTurn`, leftover AP / leftover MP, vacated cell, `currentView` (facing families still wait), **`walkMpSpentLastTurn`**, **`lastResolvedSpellId`**, **spelled-last-turn** (Cast Debt). Wave 14 adds **zero** force-gated CORE — `forcedMovedThisTurn` / `lastForcedMoveDir` remain prerequisites for Waves 6–13 sheets, not this drop.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Gaunt Step occupancy dests (not `isSwap`). Brick Reel = seventh attract dest flavor (toward, not onto, a world portal).
6. `inferSummonArchetype` gains `octspan` and `gauntpost` (and still needs `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–13). Raise or gate `ENEMY_SUMMON_CAP` before Oct Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Gaunt Lend). **`FSN-GAUNT-QUIET` and `FSN-GAUNT-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-GAUNT-STEP` / `FSN-STILL-GRACE` / `FSN-PAIR-GIFT` are self-gated heals and do **not** wait on Cover’s Shield.
8. Odd Hold while leftover AP is odd. Must Gaunt / Gaunt Hold / Verse Gaunt / Tri Oath / Orth Stride as refuse-until. Gaunt Sill start-turn leftover-pair occupy (paint stays). Wake Mark start-turn occupy (consume). Gaunt Post leftover-pair occupy. Full Gait leftover-MP≥3. Pair Gait exact-2 MP. Even Hood consume-before-damage. Brick Orbit solvability skip.
9. Summoner cooldown fall-through (oct / gauntpost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT oct sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-GAUNT-STEP`, `FSN-GAUNT-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; Gaunt Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-GAUNT-SIP`, `FSN-GAUNT-COURT` | leftover-AP + leftover-MP reads; Gaunt Sting AP=0 **and** MP=0; Sip leftover-MP=0; Odd Hold while leftover AP is odd; leftover 0 may walk |
| `FSN-EVEN-ORTH` | Even Hood exact-even consume; Orth Stride orthogonal dest; Strike remains legal; odd Chebyshev lands; same-cell misses |
| `FSN-BRICK-WAKE` | seventh `applyAttract` dest (barrier); Wake start-turn occupy consume; dest is not the portal; map has a barrier in 6 |
| `FSN-GAUNT-GATE` | Gaunt Post leftover-pair occupy / walk-safe / chip-safe; Gaunt Sill start-turn leftover-pair, paint stays; two different tiles; `summonAI === "gauntpost"` |
| `FSN-ORTH-TRI` | Orth Stride `|dx|==0 XOR |dy|==0`; Tri Oath exact 3; Strike remains legal; blink does not pay |
| `FSN-GLYPH-FULL` | 1-tile glyph-tax skip; Full leftover-MP≥3; one clean aisle; map has a glyph-tax cell |
| `FSN-GAIT-WATCH` | leftover-MP miss; Watch Alms grants **walker** +1 AP and still deals |
| `FSN-GAUNT-CHOIR` | `lastResolvedSpellId`; Gaunt Mend four leftover-0; Verse Gaunt both-leftover peel (shove does not); Ignite stack gate ≥ 2 |
| `FSN-STILL-GRACE` | target `walkMpSpentThisTurn === 0`; Grace skip-CD write (not a remaining-tick skip) |
| `FSN-LONE-AXIS` | isolated-from-all-units scan (caster counts); handler `isSummon` **axis** scan; brood cap 1; Dummy Post is not a pet |
| `FSN-DEBT-ORBIT` | spelled-last-turn flag; Orbit solvability skip; never Debt+Scribe as PAIR |
| `FSN-PAIR-GIFT` | leftover-MP exactly 2; Still Gift target walk-MP = 0; no Gaunt Mend on this id |
| `FSN-GAUNT-HOLD` | Gaunt Hold until leftover MP = 0 **and** last AP; Must Gaunt leftover-MP **and** last-AP tool-lock; never Root; dump leftover MP **and** last AP peels both |
| `FSN-GAUNT-HOLD/OCT` | `summonAI === "octspan"` **and** remaining cap ≥ 8 (live cap 2 → skip); hollow 3×3, center hole unoccupied |

---

## Sources (line-accurate, 2026-10-23)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 203–224, 447–452, 467–472, 1662–1702, 1832–1888
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
- Wave 14 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-22.md` (PR #899) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-21.md` (PR #849); leftover SDE Wave 12 unique CORE in PR #802
- Drop 14: `docs/design/ENEMY_FORMATIONS_2026-10-22.md` (PR #897)

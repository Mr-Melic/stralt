# Enemy synergy and formation catalog (drop 16)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-24  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–15 already taught the seven pairing words and Waves 1–14 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 15 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-23.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-23.md) (open as PR #941) and deferred by drop 15 (PR #956): Poise Choir, Nine Plug, Knight Quad, Pit Axis, Shove Drift, Spent Full, Rime File, Cast Kennel, Hollow Swap, Strike Tax, Brick Nudge Gate, Watch Sip Hunt, Lone Hazard, Poise Quiet, Cross Poise, Poise Gate, Bounce Poise, Poise Hold File, Lend Hood.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956). Family sheets: PR #941. Spell verbs: Wave 14 tactical ids in PR #890 (`spell-poise-mend` … `spell-drift-gift`, **except** `spell-cadence-floor` / `spell-court-floor`) plus leftover SDE Wave 13 unique CORE (`spell-knight-stride` … `spell-drift-gift` siblings, **except** Pack File / Diag Fold).

**Hard rules (Wave 15 pack law — plus every older law still stands):**

- Do **not** pack `poise_mender` with `gaunt_mender` / `hollow_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (tied-≥1 four leftover reads vs leftover-**both 0** vs **target**-both-0 vs **target**-force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs spell-resolved vs unconditional). `FSN-GAUNT-STEP` / `FSN-STILL-GRACE` / `FSN-DRY-STEP` stay theirs. `FSN-POISE-STEP` owns four-flag **tied-≥1** heal. `FSN-HOLLOW-SWAP` owns target-empty both-pools. `FSN-POISE-QUIET` is the 3-body. Dual Keep leftover **enables** every Poise gate when the surviving banks are equal and ≥ 1, and **blocks** every Gaunt / Hollow Gift gate until the bank is spent. `leftover AP = 0` and `leftover MP = 0` is **not** a Poise window.
- Do **not** pack `cadence_swapper` with `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-GAUNT-CHOIR/LAG` / `FSN-IMPRINT-CHOIR` / `FSN-STILL-GRACE` stay theirs. BRIGADE `FSN-HOLLOW-SWAP` is the empty-target heal + map-trade lesson, never a two-CD PAIR. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`.
- Do **not** pack `nine_prelate` with `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Nine counts as **9**. Center is **occupied**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 9. Live cap is **2** — skip `FSN-POISE-HOLD/NINE`. `FSN-GAUNT-HOLD/OCT` stays the hollow-8 COURT.
- Do **not** pack `poise_hooder` with `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` as a PAIR (tied-≥1 any-range miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss). `FSN-EVEN-ORTH` / `FSN-ODD-MUST` / `FSN-GAIT-WATCH` stay theirs. `FSN-SPENT-FULL` owns Spent Plate. `FSN-POISE-QUIET/LEND` owns Lend Hood.
- Do **not** pack `poise_stinger` with `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `lone_gaiter` / `pair_gaiter` / `lone_purser` / `pair_purser` / `full_purser` as a PAIR (leftover **AP === MP ≥ 1** poke vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover AP **exactly 1** vs leftover AP **exactly 2** vs leftover AP ≥ 3 +RES cousin). `FSN-GAUNT-SIP` / `FSN-LEAN-SIP` / `FSN-PAIR-GIFT` stay theirs. `FSN-POISE-SIP` owns tied poke. `FSN-SPENT-FULL` owns Full Sting. `FSN-LONE-HAZARD` owns Lone Gait.
- Do **not** pack `poise_stepper` with `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire` as a PAIR (join leftover-**AP===MP≥1** ally vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs line rescue vs cover). BRIGADE `FSN-POISE-QUIET` is the three-body lesson. `FSN-GAUNT-STEP` / `FSN-GAUNT-QUIET` / `FSN-PARCHED-QUIET` stay theirs.
- Do **not** pack `poise_siller` with `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` as a PAIR (start-turn occupy **and leftover AP === MP ≥ 1**, paint stays vs start-turn occupy **and both leftover 0** vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing**). `FSN-GAUNT-GATE` / `FSN-BRICK-WAKE` / `FSN-VOID-DWELL` stay theirs. `FSN-SHOVE-DRIFT` owns Shove Mark.
- Do **not** pack `poise_holder` with `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_poiser` as a PAIR (cannot walk while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs Strike-until leftover MP=0 **and** last AP vs tools-until tied-≥1 **and** last AP). COURT `FSN-GAUNT-HOLD` stays leftover-MP=0 peel. `FSN-POISE-HOLD` is the 3-body. **Never PAIR Poise Hold + Must Poise.**
- Do **not** pack `poise_lender` with `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **AP === MP ≥ 1** vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-GAUNT-QUIET/LEND` / `FSN-LEAN-COURT/LEND` stay theirs. `FSN-POISE-QUIET/LEND` is the 3-body.
- Do **not** pack `poise_sipper` with `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal). `FSN-GAUNT-SIP` / `FSN-LEAN-SIP` stay theirs. `FSN-WATCH-SIP` owns the snap steal.
- Do **not** pack `poise_prelate` with `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `nine_prelate` as a PAIR (end-turn occupy **and leftover AP === MP ≥ 1** detonate vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait vs 9-cell occupy). `FSN-GAUNT-GATE` stays leftover-pair detonate. `FSN-POISE-GATE` is the tied-≥1 post.
- Do **not** pack `poise_bouncer` with `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**AP===MP≥1** hostile vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-GAUNT-HOLD/BOUNCE` / `FSN-LEAN-HOLD/BOUNCE` stay theirs. `FSN-POISE-HOLD/BOUNCE` is leftover-tied Bounce Poise, never a two-bounce PAIR.
- Do **not** pack `must_poiser` with `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `poise_holder` as a PAIR (non-Strike illegal unless leftover **AP === MP ≥ 1 and this spell spends last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until tied-≥1). `FSN-GAUNT-HOLD` / `FSN-ODD-MUST` / `FSN-LEAN-HOLD` stay theirs.
- Do **not** pack `verse_poiser` with `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` as a PAIR (last-id illegal until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock). `FSN-GAUNT-CHOIR` / `FSN-IMPRINT-CHOIR` stay theirs. `0 = 0` does **not** peel Verse Poise.
- Do **not** pack `knight_warder` with `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` as a PAIR (next walk dest is **(2,1)** vs **orthogonal-only** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal). `FSN-EVEN-ORTH` / `FSN-ORTH-TRI` / `FSN-DIAG-OATH` / `FSN-INCH-OATH` stay theirs.
- Do **not** pack `quad_oather` with `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as a PAIR (next spell exact Chebyshev **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0). `FSN-ORTH-TRI` leftover oaths stay theirs.
- Do **not** pack `pit_reeler` with `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` as a PAIR (pull toward **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity). `FSN-BRICK-WAKE` / `FSN-VOID-DWELL` / `FSN-CINDER-MARK` stay theirs.
- Do **not** pack `axis_biter` with `foe_biter` / `side_biter` / `lone_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` as a PAIR (shares **rank or file with the caster** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs handler-on-**rank-or-file** with a **pet**). `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs. Do **not** name this family `axis_cutter`.
- Do **not** pack `shove_marker` with `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (**force-move landing** consume vs start-turn occupy consume vs end-turn occupy vs cell-enter vs start-turn leftover-pair vs start-turn tied-≥1 vs unit walk-MP wick vs first leave vs tile bomb). `FSN-BRICK-WAKE` / `FSN-GAUNT-GATE` stay theirs.
- Do **not** pack `spent_plater` with `gait_plater` / `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `poise_hooder` as a PAIR (next hit 0 **while leftover AP ≥ 1** vs leftover **MP ≥ 1** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs exactly-2 miss vs any-range skip vs leftover **AP === MP ≥ 1**). `FSN-GAIT-WATCH` / `FSN-OWN-WATCH` / `FSN-EVEN-ORTH` stay theirs.
- Do **not** pack `rime_skipper` with `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` as a PAIR (1-tile **rime** leave-tax skip vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy). `FSN-GLYPH-FULL` / `FSN-CINDER-FULL` / `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs.
- Do **not** pack `full_stinger` with `full_gaiter` / `full_plater` / `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden` / `poise_stinger` as PAIR / `gaunt_stinger` (leftover **AP ≥ 3** poke vs leftover **MP ≥ 3** +RES vs leftover **AP ≥ 3** +RES vs leftover **AP = 0** vs leftover **MP = 0** vs leftover-AP 0 +RES older vs absorb vs tied poke vs leftover-pair poke). `FSN-GLYPH-FULL` owns Full Gait. `FSN-CINDER-FULL` owns Full Plate.
- Do **not** pack `summon_caster` with `summon_toller` as PAIR / `summon_gaiter` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (pets pay **AP** to start a **spell** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-POISE-HOLD/KENNEL` is Cast Kennel, never a two-pet PAIR. `FSN-GAUNT-HOLD/KENNEL` / `FSN-LEAN-HOLD/TOLL` stay theirs.
- Do **not** pack `hollow_gifter` with `poise_mender` / `gaunt_mender` / `still_mender` / `still_gifter` / `dry_gaiter` / `dry_mender` / `drift_gifter` / `bar_mender` / `pale_cantor` as a PAIR.
- Do **not** pack `strike_debter` with `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` as a PAIR (**Struck**-last-turn next-walk +1 AP vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-DEBT-ORBIT` / `FSN-SPENT-CRACK` stay theirs. CADRE `FSN-STRIKE-TAX` is the three-body lesson (Struck-debt + scribe + oncoming), never Debt+Scribe PAIR.
- Do **not** pack `brick_nudger` with `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` as a PAIR (push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras). `FSN-DEBT-ORBIT` / `FSN-GAIT-WATCH/GUN` / `FSN-BRICK-WAKE` stay theirs. `FSN-POISE-HOLD/NUDGE` owns the turret, never Nudge+Gun PAIR.
- Do **not** pack `watch_sipper` with `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR / `poise_sipper` as PAIR (snap **steals** walker leftover AP vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras vs tied leftover-AP steal on **cast**). `FSN-GAIT-WATCH` / `FSN-OWN-WATCH` / `FSN-OFF-FEE` stay theirs.
- Do **not** pack `lone_gaiter` with `pair_gaiter` / `lone_purser` / `full_gaiter` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `ready_stinger` as a PAIR.
- Do **not** pack `hazard_cutter` with `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as a PAIR (bonus vs **painted hazard** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs Weaken/Expose). `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs.
- Do **not** pack `drift_gifter` with `heave_mender` / `hollow_gifter` / `still_gifter` / `poise_mender` / `gaunt_mender` / `pale_cantor` as a PAIR.
- Do **not** pack `bar_crosser` with `dual_keeper` as PAIR / `pawn_broker` as PAIR (two-body leftover AP↔MP **cross** vs leftover **bank** vs **tile** swap). CADRE `FSN-CROSS-POISE` is the 3-body.
- Drop 4–15 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals).

Wave 16 families do **not** exist yet. Same-day 2026-10-23 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-23.md`, open as PR #953) and SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, PR #906) stay Wave **16** family CORE. Do **not** mint `FSN-*` ids that require those Wave 16 families in this drop. Cadence Floor is **already owned** by SDE #906.

Court Floor / Pack File / Diag Fold / Pack Rank / Rank Fold stay **boss / closed-class**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend (Hollow Gift is **target-only** both-pools; Poise Mend is **both bodies tied ≥ 1**).

**Do not spawn Poise Mend / Poise Sting / Poise Step / Poise Sill / Poise Hold / Poise Lend / Poise Sip / Poise Post / Poise Bounce / Must Poise / Verse Poise / Poise Hood / Spent Plate / Full Sting / Lone Gait / Hollow Gift / Bar Cross sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Equality is integer `===`. Missing field → Poise Mend / Poise Sting / Hollow Gift / Bar Cross pay **0** extra or skip (fail closed). Until those writers land, show `FSN-GAUNT-STEP` / `FSN-GAUNT-SIP` / `FSN-STILL-GRACE` / `FSN-PAIR-GIFT` instead of the matching Wave 15 id.

**Do not spawn Verse Poise sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Poise fizzles (fail closed). Forced-move does **not** peel Verse Poise. `0 = 0` does **not** lift. Until that writer lands, show `FSN-GAUNT-CHOIR` instead of `FSN-POISE-CHOIR`.

**Do not spawn Strike Debt sheets until a battle-walk writer snapshots `struckThisTurn` at turn end.** Spell last turn does not arm Strike Debt. Teleport / Swap / Poise Step do not pay. Until that writer lands, show `FSN-DEBT-ORBIT` instead of `FSN-STRIKE-TAX`.

**Do not spawn Shove Mark / Drift Gift sheets until battle force writes `forcedMovedThisTurn`.** Walk / Swap / Twin Gate / Poise Step / Gaunt Step / Home Step do **not** set the flag. Until that writer lands, show `FSN-HOOK-SLAM` / `FSN-EMBER-MEND` instead of `FSN-SHOVE-DRIFT`.

**Do not spawn Nine Plug until `inferSummonArchetype` keys `summonAI === "ninespan"` and remaining `ENEMY_SUMMON_CAP` ≥ 9.** Live cap is 2. Name heuristics stay a bug. Nine fills the stationary-post **and** the multi-cell-system cap (9). The center stays occupied. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost onto that body.

**Do not spawn Poise Post sheets until `inferSummonArchetype` keys `summonAI === "poisepost"` and remaining cap ≥ 1.** End-turn occupy with leftover AP ≠ leftover MP **or** leftover AP = 0 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Only leftover-AP===MP≥1 end-turn occupy detonates.

**Poise Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Pit Reel is the **eighth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick, then **pit**). Dest is **toward**, not onto, a world portal. Brick Nudge **pushes an adjacent barrier 1 away** — not a unit bash, not orbit.

Wave 15 adds **zero** facing CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop.

---

## Grounding (live, 2026-10-24)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–15. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Poise Step is occupancy dest, **not** `isSwap`. Pit Reel is the eighth **cast** caller of attract. Brick Nudge is a barrier-cell push, not `applyPushback` on a unit. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 15 CORE rows stay `mpCost: 0`. Poise Sip / Poise Lend / Bar Cross / Watch Sip rewrite **current leftover AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` | **Absent** — Poise / Hollow Gift / Verse Poise / Strike Debt / Shove Mark / Drift Gift / Bar Cross fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / **ninespan** / **poisepost** bodies **replace** the random overlay. Cap one of those engines. Nine Span **is** the 9-cell solid post and needs remaining cap ≥ 9.
3. Any `healAmount` steals healer. **Poise Mend / Hollow Gift / Drift Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Halver, Pinner, Sprouter, Feer, Purser, Cutter, Lagger, Gracer, Swapper, Orbiter, Nudger, Almer, or Toller.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Hollow Gift / Drift Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 15 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Poise Sip / Watch Sip / Bar Cross / Poise Lend rewrite current leftover AP/MP.
6. `inferSummonArchetype` must key `summonAI === "ninespan"` **and** `"poisepost"` **before** any Nine / Poise-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Nudge that **moves** an already planted barrier (it does not mint a new one from empty floor, and solvability skip is mandatory). Poise Hold / Must Poise / Verse Poise / Quad Oath / Knight Stride are **not** `instantKill`.
8. Poise-step dest / pit-reel dest / poise-post plant / nine plant / brick-nudge dest: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Poise Step into a wall is a fizzle (no crush). Pit Reel dest must leave a walk-off that is **not** the pit cell **and not** a world portal. Brick Nudge dest must be empty, in-bounds, non-portal, and `findPath` after the hypothetical push must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Poise Sip **or** one Watch Sip source per pack, not both stacking past that cap. Poise Hold is a **walk lock with an equality key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise on the same AP bar.
10. Walk-spend: Poise Step / Pit Reel / Poise Post plant / Brick Nudge **do not** increment `walkMpSpentThisTurn`. Hollow Gift / Poise Mend gate leftover pools, not walk-spend.
11. Last-id: Verse Poise **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Poise. Dual Keep leftover **is** leftover; `0 = 0` does **not** lift.
12. Struck-last-turn: Strike Debt **fail closed** until `struckThisTurn` exists. Spell last turn does **not** arm it. Teleport / Swap / Poise Step do not pay.
13. Force-move: Shove Mark / Drift Gift **fail closed** until `forcedMovedThisTurn` exists. Walk / Swap / Poise Step do **not** set it.

### Relative difficulty (same grades as drops 1–15)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…15 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a four-flag leftover tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / nudger): pack median + one step.
- Backliner (poise-mend / hollow-gift / drift-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / debt / watch): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 16)

Drop 1–15 overlays still apply. These are **additional jobs** for Wave 15 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-POISE-MEND` | `queen` **with** heal | proposed `poise_mender` | `spell-poise-mend`, `starter-shield` | healer; skip if leftover AP ≠ leftover MP **or** leftover AP = 0 or missing HP < 8; Dual Keep leftover **is** leftover; **not** Gaunt Mend / Hollow Gift; extra door `poise_cantor` is **not** this family |
| `ROLE-NINE` | `rook` **without** heal | proposed `nine_prelate` | `physical_attack`, `spell-nine-span` | `isSummoner` for nine only; post `summonAI: "ninespan"`, solid 3×3, empty kit, remaining cap ≥ 9; skip if any of nine cells blocked; center occupied |
| `ROLE-BAR-CROSS` | `bishop` **without** heal | proposed `bar_crosser` | `starter-frost`, `spell-bar-cross` | controller; skip if both leftover pairs are 0/0; simultaneous four-write; **not** Dual Keep / tile Swap |
| `ROLE-POISE-HOOD` | `knight` **without** heal | proposed `poise_hooder` | `starter-shield`, `spell-poise-hood` | guardian; skip if leftover AP ≠ leftover MP **or** leftover AP = 0; any-range miss while tied ≥ 1; consume on miss |
| `ROLE-POISE-STING` | `pawn` **without** heal | proposed `poise_stinger` | `physical_attack`, `spell-poise-sting` | flanker; skip if leftover AP ≠ leftover MP **or** leftover AP = 0 unless 10 still kills; Dual Keep **opens** the 8 |
| `ROLE-POISE-STEP` | `queen` **without** heal | proposed `poise_stepper` | `physical_attack`, `spell-poise-step` | protector; skip if ally leftover AP ≠ leftover MP or leftover AP = 0 or no free adj; relocate, **not** `isSwap` |
| `ROLE-POISE-SILL` | `bishop` **without** heal | proposed `poise_siller` | `starter-frost`, `spell-poise-sill` | setter; skip if occupant leftover already 0/0; occupant tied ≥ 1 at **start of their turn** takes 8; paint stays |
| `ROLE-POISE-HOLD` | `knight` **without** heal | proposed `poise_holder` | `physical_attack`, `spell-poise-hold` | controller; skip if leftover AP ≠ leftover MP **or** leftover AP = 0; cannot walk while tied ≥ 1; spells stay legal; **never PAIR with Must Poise** |
| `ROLE-POISE-LEND` | `bishop` **without** heal | proposed `poise_lender` | `starter-frost`, `spell-poise-lend` | buffer; skip if ally leftover AP ≠ leftover MP or leftover AP = 0; +1 current AP **and** +1 current MP (**keeps** the tie) |
| `ROLE-POISE-SIP` | `pawn` **without** heal | proposed `poise_sipper` | `starter-frost`, `spell-poise-sip` | flanker; skip if leftover AP ≠ leftover MP or leftover AP = 0; steal 1 leftover AP (**breaks** the tie) |
| `ROLE-POISE-POST` | `pawn` **without** heal | proposed `poise_prelate` | `physical_attack`, `spell-poise-post` | `isSummoner` for poisepost only; post `summonAI: "poisepost"`, remaining cap ≥ 1; end-turn leftover-AP===MP≥1 occupy detonates; walk-on / dump-a-pool / chip-safe |
| `ROLE-POISE-BOUNCE` | `queen` **without** heal | proposed `poise_bouncer` | `starter-frost`, `spell-poise-bounce` | artillery; skip bounce without a second leftover-AP===MP≥1 hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-POISE` | `knight` **without** heal | proposed `must_poiser` | `physical_attack`, `spell-must-poise` | controller; skip if leftover AP ≠ leftover MP **or** leftover AP = 0; non-Strike illegal unless tied ≥ 1 **and** last AP; Strike stays legal; **never PAIR with Poise Hold** |
| `ROLE-VERSE-POISE` | `bishop` **without** heal | proposed `verse_poiser` | `starter-frost`, `spell-verse-poise` | controller; skip if no `lastResolvedSpellId`; leftover AP === leftover MP ≥ 1 peels; `0 = 0` does **not**; shove does **not** |
| `ROLE-KNIGHT-STRIDE` | `knight` **without** heal | proposed `knight_warder` | `starter-frost`, `spell-knight-stride` | controller; skip if player MP = 0 or no legal (2,1) floor; next walk dest `|dx|,|dy|` = 2,1 or 1,2; extra room `knight_gallery` is **not** this family |
| `ROLE-QUAD-OATH` | `bishop` **without** heal | proposed `quad_oather` | `starter-frost`, `spell-quad-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 4; Strike stays legal; extra room `quad_nave` is **not** this family |
| `ROLE-PIT-REEL` | `rook` **without** heal | proposed `pit_reeler` | `starter-frost`, `spell-pit-reel` | caster; skip if no pit in 6; dest is **toward**, not onto; eighth `applyAttract` flavor; extra room `pit_aisle` is **not** this family |
| `ROLE-AXIS-BITE` | `pawn` **without** heal | proposed `axis_biter` | `physical_attack`, `spell-axis-bite` | charger; skip rider off-axis; 10 + 8 if target shares rank or file with the **caster**; Dummy Post is not a pet; family is **not** Wave 14 `axis_cutter` |
| `ROLE-SHOVE-MARK` | `bishop` **without** heal | proposed `shove_marker` | `starter-frost`, `spell-shove-mark` | setter; skip if no force ally; 0 on cast; force-move landing detonates and consumes; walk-on is **free**; extra room `shunt_pulpit` is **not** this family |
| `ROLE-SPENT-PLATE` | `rook` **without** heal | proposed `spent_plater` | `starter-shield`, `spell-spent-plate` | guardian; skip if leftover AP already 0; leftover AP ≥ 1 miss; leftover AP 0 at impact **lands** |
| `ROLE-RIME-SKIP` | `knight` **without** heal | proposed `rime_skipper` | `physical_attack`, `spell-rime-skip` | flanker; skip if the next walk is not a 1-step across rime; lava/spike/pit/cinder/glyph still tick; length ≥ 2 pays |
| `ROLE-FULL-STING` | `pawn` **without** heal | proposed `full_stinger` | `physical_attack`, `spell-full-sting` | charger; skip rider if leftover AP < 3 unless 10 still kills; leftover ≥ 3 → bonus |
| `ROLE-SUMMON-CAST` | `king` **without** heal | proposed `summon_caster` | `starter-frost`, `spell-summon-cast` | controller; skip if no allied summon; pets pay +1 AP to start a **spell**; teleport does not pay; drop if `summonAI` empty |
| `ROLE-HOLLOW-GIFT` | `queen` **with** heal | proposed `hollow_gifter` | `spell-hollow-gift`, `starter-shield` | healer; skip if target leftover AP ≥ 1 **or** leftover MP ≥ 1 or missing HP < 8; caster leftover unconstrained; Dual Keep on the **target** **blocks** |
| `ROLE-CADENCE-SWAP` | `bishop` **without** heal | proposed `cadence_swapper` | `starter-frost`, `spell-cadence-swap` | controller; skip if both remaining maps empty; exchange remaining CD maps; unknown ids dropped; **not** Cadence Floor / Imprint / Lag |
| `ROLE-STRIKE-DEBT` | `bishop` **without** heal | proposed `strike_debter` | `starter-frost`, `spell-strike-debt` | controller; skip if they only spelled or camped last turn; next walk +1 AP if they **Struck**; Strike exempt |
| `ROLE-BRICK-NUDGE` | `rook` **without** heal | proposed `brick_nudger` | `starter-frost`, `spell-brick-nudge` | setter; skip if no adjacent barrier **or** the dest would seal the last path; paint-only; solvability skip; extra room `nudge_nave` is **not** this family |
| `ROLE-WATCH-SIP` | `bishop` **without** heal | proposed `watch_sipper` | `starter-frost`, `spell-watch-sip` | artillery; skip if leftover AP = 0 **or** no overwatch is armed; snap still deals; **walker** leftover AP −1 |
| `ROLE-LONE-GAIT` | `pawn` **without** heal | proposed `lone_gaiter` | `physical_attack`, `spell-lone-gait` | flanker; skip if leftover MP is not exactly 1 unless 10 still kills |
| `ROLE-HAZARD-CUT` | `pawn` **without** heal | proposed `hazard_cutter` | `physical_attack`, `spell-hazard-cut` | flanker; skip rider if target is not on a **painted** hazard; Dummy Post is not a hazard; world lava that is **not** painted does not count |
| `ROLE-DRIFT-GIFT` | `queen` **with** heal | proposed `drift_gifter` | `spell-drift-gift`, `starter-shield` | healer; skip if target `forcedMovedThisTurn` unset or missing HP < 8; caster may be unmoved; walk / Swap / Poise Step do **not** count |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Swapper, Poise-Mend, Hollow-Gift, Drift-Gift, Nine, or Poise-Post.

### Fair-fight rules (every sheet)

Same as drops 1–15, plus Wave 15:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Poise Post never detonates on leftover AP ≠ leftover MP **or** leftover AP = 0.
- Swap / pull / push / poise-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Poise Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine — never two engines). Nine is illegal until remaining cap ≥ 9.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Nudge **must** skip if `findPath` after a hypothetical push would not reach an exit. Never seal the last aisle.
- Dual Keep **opens** Poise and **closes** Gaunt / Hollow Gift. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-POISE-STEP` | PAIR | tied-≥1 healer + tied-≥1 joiner | this drop |
| `FSN-POISE-SIP` | PAIR | tied-≥1 poke + tied leftover-AP steal | this drop |
| `FSN-KNIGHT-QUAD` | PAIR | next walk (2,1) + next-spell exact 4 | this drop |
| `FSN-PIT-AXIS` | PAIR | pull toward pit + caster-axis bite | this drop |
| `FSN-POISE-GATE` | CELL | tied-≥1 post + start-turn tied-≥1 sill | this drop |
| `FSN-SPENT-FULL` | CELL | leftover-AP≥1 miss + leftover-AP≥3 poke | this drop |
| `FSN-RIME-FILE` | CELL | 1-tile rime skip + ice mason | this drop |
| `FSN-WATCH-SIP` | CELL | overwatch snap steals leftover AP + optic | this drop |
| `FSN-POISE-CHOIR` | BRIGADE | tied-≥1 heal + last-id until tied-≥1 + ignite | this drop |
| `FSN-SHOVE-DRIFT` | BRIGADE | force-landing paint + force-moved heal + bash | this drop |
| `FSN-POISE-QUIET` | BRIGADE | poise step + poise mend + cover | this drop |
| `FSN-HOLLOW-SWAP` | BRIGADE | target-empty both-pools heal + remaining-CD map trade + once | this drop |
| `FSN-LONE-HAZARD` | CADRE | leftover-MP exactly 1 poke + painted-hazard cut + glyph | this drop |
| `FSN-STRIKE-TAX` | CADRE | Struck-last-turn walk tax + glyph tax + oncoming | this drop |
| `FSN-CROSS-POISE` | CADRE | leftover AP↔MP cross + tied heal + tied sting | this drop |
| `FSN-POISE-HOLD` | COURT | walk-until tied-≥1 + tools-until tied-≥1 **and** last AP + warden | this drop |

Named packs as variants: `FSN-POISE-GATE/STING` (Poise Gate full), `FSN-PIT-AXIS/RIME` (Pit Axis full), `FSN-KNIGHT-QUAD/GUN` (Knight Quad full), `FSN-SPENT-FULL/PLATE` (Spent Full full), `FSN-RIME-FILE/LEY` (Rime File full), `FSN-WATCH-SIP/GUN` (Watch Sip Hunt full), `FSN-POISE-QUIET/LEND` (Lend Hood escort), `FSN-POISE-HOLD/NINE` (Nine Plug — skip until remaining cap ≥ 9; live cap is 2), `FSN-POISE-HOLD/BOUNCE` (Bounce Poise leftover-tied), `FSN-POISE-HOLD/KENNEL` (Cast Kennel), `FSN-POISE-HOLD/NUDGE` (Brick Nudge Gate).

---

## Formations

### FSN-POISE-STEP

FORMATION_ID: `FSN-POISE-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-POISE-MEND` — `queen` **with** heal / proposed `poise_mender` — pack median — back
- `ROLE-POISE-STEP` — `queen` **without** heal / proposed `poise_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Poise Mend is a heal kit; kit band 0 has no heal). Show `FSN-GAUNT-STEP` instead (four leftover-0 tell without the tied-≥1 8).
- Mender kit: Poise Mend + Shield. **No** Inferno, no Enrage, no Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `poise_cantor` is **not** this family.
- Stepper kit: Poise Step + Strike. **No** Gaunt / Parched / Home / Heave / Ally Step / Cover on PAIR (those are `FSN-POISE-QUIET` / `FSN-GAUNT-QUIET`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-GAUNT-STEP` **or** `FSN-PAIR-GIFT` (player has seen leftover-both-0 heal **or** leftover-MP exactly 2 poke; this sheet cashes leftover **AP === MP ≥ 1** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Poise Mend (8 HP) pays only if **caster and target** leftover AP === leftover MP **and leftover AP ≥ 1** after the 3 AP is paid. One broken equality on one body is 0 HP — Shield queen.
- Poise Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover AP === leftover MP ≥ 1. It is not Gaunt Step and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover AP === leftover MP ≥ 1; if the Mender is still 0/0 or 2/1, Stepper Frosts / Strikes.
- Mender Poise-Mends only if all four leftover reads match **and** leftover AP ≥ 1 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Gaunt Mend.

SYNERGY:

- Tied-≥1 healer + tied-≥1 joiner. Wave 14 Gaunt Step standing on the **inverse** leftover window. Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP on either body is a complete answer.

PLAYER_THREAT:

- Slow refill if you Dual Keep 1/1 or 2/2 on **both** bodies. Spike is low. Misplay is Rooting neither and holding the tie into an 8 that just landed.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to break the equality. Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a tied ally is Strike / Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced Dual Keep + tied-≥1 heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if leftover AP ≠ leftover MP **or** leftover AP = 0.
- Stepper: protector; skip if ally leftover AP ≠ leftover MP or leftover AP = 0 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-POISE-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-POISE-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-POISE-SIP

FORMATION_ID: `FSN-POISE-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-POISE-STING` — `pawn` **without** heal / proposed `poise_stinger` — pack median or −1 — starts wide
- `ROLE-POISE-SIP` — `pawn` **without** heal / proposed `poise_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-GAUNT-SIP` (leftover **AP = 0 and leftover MP = 0** poke + leftover-MP=0 AP steal) and `FSN-LEAN-SIP` (leftover AP = 0 **and** leftover MP ≥ 1). Pressure is the **tied-≥1** window: leftover AP === leftover MP **and leftover AP ≥ 1**. Dual Keep **opens** both riders.
- Band 0: Stinger Strike only; Sipper Frost only (Poise Sting / Poise Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-GAUNT-SIP`.
- Elite: Stinger only. Sipper never gets Bare Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-GAUNT-SIP` **or** `FSN-POISE-STEP` (player has seen leftover-pair as a resource **or** the tied-≥1 heal).
- Full Sting / Lone Gait / Ready / Pair Gait stay off PAIR (PAIR bans). Poise Hold stays off (that is `FSN-POISE-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Poise Sting: 10, +8 iff **target** leftover AP === leftover MP ≥ 1. Dual Keep leftover **opens** the 8. `0 = 0` is Gaunt Sting’s window, not this one.
- Poise Sip: steal 1 leftover AP iff leftover AP === leftover MP ≥ 1. After the steal the target is **no longer tied**. Inverse of Poise Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover AP === leftover MP ≥ 1; else Frosts.
- Stinger lurks at 3 and commits when leftover AP === leftover MP ≥ 1 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Sip then Sting on the **same** AP bar is banned — Sip **breaks** the tie the Stinger needs.

SYNERGY:

- Tied-≥1 poke + tied leftover-AP steal. Wave 14 Gaunt Sip standing on the **wet equal** window instead of the empty one. You see Dual Keep 1/1; the knife waits for it **or** the sip flips the equality off so Hold never arms.

PLAYER_THREAT:

- High if you Dual Keep 1/1, then trade the Stinger. Low if you break the tie or dump both pools. Not unavoidable: spend 1 leftover AP **or** MP, dump to 0/0, or kill the Stinger and eat Frost.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP. Dump both pools to 0. Kill the Stinger (`hp` ~0.70). Force the Sipper to leave a hazard this turn (sip refuses if untied). Gaunt Sting the remaining 0/0 if you brought it.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile.
- No Time Warp (panic + leftover tax).

AI_REQUIREMENTS:

- Stinger: flanker + leftover-equality hold (AP === MP ≥ 1).
- Sipper: flanker; skip if leftover AP ≠ leftover MP or leftover AP = 0; heal-less so inference stays caster.
- Soph 1–2.

VARIANTS:

- `FSN-POISE-SIP/E-STING` — elite Stinger, still no Poise Hold on PAIR.
- `FSN-POISE-HOLD` is the COURT with Hold — do not merge.

STATUS: PROPOSED

---

### FSN-KNIGHT-QUAD

FORMATION_ID: `FSN-KNIGHT-QUAD`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-KNIGHT-STRIDE` — `knight` **without** heal / proposed `knight_warder` — pack median + 1 — front
- `ROLE-QUAD-OATH` — `bishop` **without** heal / proposed `quad_oather` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-EVEN-ORTH` (even-range miss + orthogonal-only walk) and `FSN-ORTH-TRI` (orthogonal walk + exact-3 oath). Pressure is **L-step plus exact-4 spell**: the next walk must be (2,1), and the next spell must be Chebyshev 4.
- Band 0: Warder Strike / Frost; Oather Frost only. Knight Stride / Quad Oath are band 1. If kit band is still 0, **do not spawn this id** — show `FSN-EVEN-ORTH`.
- Elite: Warder only. Oather never gets Tri / Mid / Long / Near Oath (PAIR bans). Extra door `knight_gallery` / `quad_nave` is **not** this family.
- Unlock after `FSN-EVEN-ORTH` **or** `FSN-ORTH-TRI` (player has seen a next-walk shape lock **or** an exact-N oath).
- Orth / Diag / Inch / Must Step stay off PAIR (PAIR bans). Glass Sniper stays off (that is `FSN-KNIGHT-QUAD/GUN`).
- Strike stays legal on both bodies. Blink / Swap do not pay and do not consume.

SPELL_POOL_INTERACTIONS:

- Knight Stride: stance, 1 turn. The caster’s **next walk** this turn is legal **only** if dest is Chebyshev (2,1) (`|dx|,|dy|` = 2,1 or 1,2). Orthogonal / diagonal / length-1 dests fail confirm; MP is not spent. Forced-move does **not** consume the lock.
- Quad Oath: next spell illegal unless Chebyshev = 4. Frost at 1–3 or ≥ 5 fizzles. Strike stays legal.
- Together: walking 1 to poke lands Strike (legal) but the next walk cannot step 1 again; a Frost from 3 fizzles. Step (2,1) then Strike, **or** sit at 4 and Frost, is the designed answer.

TACTICAL_PLAN:

- Warder Strides if a legal (2,1) floor exists **and** is not lava. Oather Oaths if the player already sits at 3 (bait to 4) **or** at 4 (lock the gun range).
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Next walk (2,1) + next-spell exact 4. Wave 14 Even Orth / Orth Tri standing on an **L-step** plus a **farther** oath. Combination, not a new sprite. Don’t walk, or Strike from here, is a complete answer.

PLAYER_THREAT:

- Frustration if you orthogonal-step after Stride arms, then eat a fizzle. Spike is low. Misplay is Frost from 3 after Oath arms.

COUNTERPLAY:

- Strike (both locks leave Strike legal). Sit still and wait. Step (2,1) onto a clean tile. Change range to 3 or 5. Kill the Warder. Root. Sit with no legal (2,1) floor so Stride skips.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with room to stand at 1, 2, 3, **and** 4, plus at least one (2,1) landing that is not lava / pit / portal. Reject a 1-tile orthogonal-only tunnel (forced L-step with no (2,1) tile is a lock **or** a skip — reroll).
- No Time Warp.

AI_REQUIREMENTS:

- Warder: controller; skip if player MP = 0 or no legal (2,1) floor (solvability); **do not** assign to kits whose only walk is already a knight-jump if that would hide the lock.
- Oather: controller; skip if they have no ranged id and Strike is better.
- Soph 1–2.

VARIANTS:

- `FSN-KNIGHT-QUAD/GUN` — BRIGADE **Knight Quad** full: add `ROLE-SNIPER` (`glass_sniper`) junior. Sniper holds minRange 3–4 so the player is baited to 4, where Oath lets the gun land and Stride forbids the length-1 cut back to 3. **Never PAIR Knight Warder with Orth / Diag. Never PAIR Watch Sip with Glass as a two-body.** Unlock after `FSN-GLASS-WARD` **or** `FSN-EVEN-ORTH/GUN`.
- `FSN-ORTH-TRI` remains the exact-3 CELL; do not merge.

STATUS: PROPOSED

---

### FSN-PIT-AXIS

FORMATION_ID: `FSN-PIT-AXIS`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-PIT-REEL` — `rook` **without** heal / proposed `pit_reeler` — pack median — back
- `ROLE-AXIS-BITE` — `pawn` **without** heal / proposed `axis_biter` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-BRICK-WAKE` (pull toward **barrier** + start-turn occupy) and `FSN-LONE-AXIS` (isolation bite + handler-on-file with a **pet**). Pressure is **toward the pit**, then **caster-axis** bonus. No pet required.
- Elite: Reeler only. Biter never gets Foe / Lone / Side Bite / Axis Cut (PAIR bans). Extra door `pit_aisle` is **not** this family.
- Unlock after `FSN-BRICK-WAKE` **or** `FSN-LONE-AXIS` (player has seen a pull dest flavor **or** an axis bonus).
- Brick / Void / Cinder / Paint / Foe / Ally / File Reel stay off PAIR (PAIR bans). Rime Mason stays off (that is `FSN-PIT-AXIS/RIME`).
- Eighth `applyAttract` dest required. Dest is **toward**, not onto, a world portal. Occupancy `portals` stay impassable. Pits are not portals.
- If the map has no pit in Chebyshev 6 of a legal floor, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Pit Reel: pull 1 toward the nearest **pit** cell in Chebyshev ≤ 6. Empty / blocked / world-portal dest: fizzle that step (AP spent). Player keeps ≥ 1 walk-off that is **not** the pit cell.
- Axis Bite: 10 + 8 if target shares rank **or** file with the caster. Neighbor decoy does **not** block. Dummy Post is not a pet — that is Axis Cut’s lesson, not this sheet.
- Together: Reel onto the Reeler’s file, then Bite. Stepping off the file **before** the Bite is the designed answer.

TACTICAL_PLAN:

- Reeler Reels only if a legal floor step toward exists **and** a walk-off remains **and** the landing is not the pit. Biter paths onto the shared file before Bite; off-axis it Strikes (10, no 8).
- Never turn-1 pull onto the pit tile. Never pull into a closed pocket.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Pull toward pit + caster-axis bite. Wave 14 Brick Wake standing on a new dest flavor **and** Wave 14 Lone Axis standing on **caster** geometry instead of a pet. Combination, not a new sprite. Step off the file is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I stood on the Reeler’s file, got reeled one toward the pit, then ate the +8.” Recoverable: step off-axis, hug the Reeler (minRange 2 if the clone exists — else stay diagonal).

COUNTERPLAY:

- Leave the rank/file. Occupy the only legal landing. Kill the Biter (`hp` ~0.85). Barrier between. Fill / leave the pit so Reel fizzles. Diagonal-only stance.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **one pit in Chebyshev 6** plus open floor the other way. Reject `corridorMaze` (reel + bite in a hallway is a lock).
- No Void Rift tile as a legal landing. No lava dest. Player keeps ≥ 1 walk-off that is not the pit.

AI_REQUIREMENTS:

- Reeler: caster; skip if no pit; dest scoring must not use the portal; skip if landing is safer for the player.
- Biter: charger; skip rider off-axis; never Bite a Dummy Post and call it a pet.
- Soph 1–2.

VARIANTS:

- `FSN-PIT-AXIS/RIME` — BRIGADE **Pit Axis** full: add `rime_mason` junior. Ice the landing **after** the pull, never as the dest. **Never PAIR Pit Reel with Cinder / Brick / Void Reel.** Unlock after `FSN-RIME-FILE` **or** `FSN-BRICK-WAKE/GLYPH`. Still no lava dest. One Slow source.
- `FSN-BRICK-WAKE` remains the barrier-pull PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-POISE-GATE

FORMATION_ID: `FSN-POISE-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-POISE-POST` — `pawn` **without** heal / proposed `poise_prelate` — pack median — `isSummoner` for poisepost only
- `ROLE-POISE-SILL` — `bishop` **without** heal / proposed `poise_siller` — pack median — paints a **different** tile from the post

VARIANT_RULES:

- Distinct from `FSN-GAUNT-GATE` (leftover-**both 0** post + leftover-**both 0** sill). Pressure is **tied-≥1 occupy**: camp Dual Keep 1/1 on the post at **end of turn** and eat 10; sit tied on the sill at **start of your turn** and eat 8. Dump a pool **or** dump both to 0 is a complete answer.
- CELL: one post, one sill. Prelate cap 1 live post. Siller will not stack two sills on one cell.
- Elite: Siller only. Prelate stays junior so two hidden occupy clocks are not a CELL.
- Unlock after `FSN-GAUNT-GATE` **or** `FSN-POISE-SIP` (player has seen leftover-pair occupy **or** the tied-≥1 poke).
- Wake / Dwell / Ingress / Gaunt Sill / Gaunt Post stay off (PAIR bans). Poise Sting stays off the base sheet (that is `FSN-POISE-GATE/STING`).
- `summonAI === "poisepost"` required. Remaining cap ≥ 1. Walk-on is **safe**. Relocate landing is **safe**.

SPELL_POOL_INTERACTIONS:

- Poise Post: empty-kit body. End-turn occupy with leftover AP === leftover MP ≥ 1 deals 10 and it dies. Dump a pool and camp free.
- Poise Sill: occupant whose leftover AP === leftover MP ≥ 1 takes 8 at **start of their turn**. Paint stays. Caster death does **not** cancel. Dual Keep **hurts**.
- Do not also attach Slow (that is a third leftover story). Do not paint the post’s tile (two clocks on one cell is a lock).

TACTICAL_PLAN:

- Prelate plants on a **flank choke**, never on the only tile that reaches the Siller, never on the player’s last exit.
- Siller paints a **different** tile the player camps. It does not Sill a 0/0 occupant (that is Gaunt Sill).
- Hostiles start ≥ 4 apart. The post is not a fourth hostile for spacing vs the player until it exists — place it ≥ 2 from the player’s last exit.

SYNERGY:

- Tied-≥1 post + start-turn tied-≥1 sill. Teaching pair for Poise Hold File without the walk lock yet. Information (where is the post?) plus a start-of-turn tax.

PLAYER_THREAT:

- Frustration and a chip if you Dual Keep on the paint. Not a lock: dump a pool, spells work, second approach exists, walk-on is free.

COUNTERPLAY:

- Dump 1 leftover AP **or** MP before turn end / turn start. Step off. Cast from the cell (Timestep / Inferno / Frost). Kill the Siller (`hp` ~0.80). Coup the 1 HP post. Swap the Prelate onto their own sill once you know the cell.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (post + sill on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Prelate: summoner poisepost; place then does not path; never plant the only backliner approach; CHAMPION refuse-exit.
- Siller: setter; no stack on the post tile; skip if occupant leftover already 0/0.
- Soph 2–3.

VARIANTS:

- `FSN-POISE-GATE/STING` — BRIGADE **Poise Gate** full: add `ROLE-POISE-STING` junior. Sting the body that kept the tie after stepping off the post. **Never PAIR Poise Sting with Gaunt / Full / Lone Gait as a two-body.** Unlock after `FSN-POISE-SIP`.
- `FSN-GAUNT-GATE` remains the leftover-0 CELL; do not merge.

STATUS: PROPOSED

---

### FSN-SPENT-FULL

FORMATION_ID: `FSN-SPENT-FULL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SPENT-PLATE` — `rook` **without** heal / proposed `spent_plater` — pack median + 1 — front
- `ROLE-FULL-STING` — `pawn` **without** heal / proposed `full_stinger` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-GLYPH-FULL` (1-tile glyph-tax skip + leftover-**MP ≥ 3** +RES) and `FSN-GAIT-WATCH` (leftover-**MP** miss). Pressure is leftover-**AP**: keep 1 action chip and the next hit is 0; keep 3 and the poke pays extra.
- CELL: Plate then Sting on **different** AP bars. Drain AP first is the designed answer.
- Elite: Plater only. Stinger stays junior so leftover-AP≥3 poke plus leftover-AP miss is not two elites.
- Unlock after `FSN-GAIT-WATCH` **or** `FSN-GLYPH-FULL` (player has seen leftover-MP miss **or** leftover-MP≥3 +RES).
- Gait Plate / Own Plate / Poise Hood / Full Plate stay off PAIR (PAIR bans). Plate Warden stays off the base sheet (that is `FSN-SPENT-FULL/PLATE`).
- Leftover-AP writer required.

SPELL_POOL_INTERACTIONS:

- Spent Plate: next hit is 0 while leftover AP ≥ 1; consume on miss. Leftover AP 0 at impact **lands**. MP unconstrained.
- Full Sting: leftover AP ≥ 3 → bonus damage after this spell’s AP is paid. Pair Purse is leftover AP **exactly 2** — not this rider. Poise Sting is leftover AP === MP ≥ 1 — not this rider.
- Together: Plate while they still have an action chip; Sting when they Dual Keep 3+. Drain Courage peels both.

TACTICAL_PLAN:

- Plater Plates if leftover AP ≥ 1, else Shields. Stinger holds until leftover AP ≥ 3 **or** HP% ≤ 40.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-AP≥1 miss + leftover-AP≥3 poke. Wave 14 Gait Watch / Glyph Full standing on the **action** pool instead of the walk pool. Combination, not a new sprite. Spend down to 0 leftover AP is a complete answer.

PLAYER_THREAT:

- Frustration if you poke a plated 1-AP body, then eat a 3-AP sting. Spike is a readable leftover-AP window. Misplay is Dual Keep 3 into melee.

COUNTERPLAY:

- Drain Courage / spend last AP. Wait the consume. Kill the Stinger. Keep range. Do not Dual Keep 3 AP into melee. Expose after the miss consumes.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a straight walk; Plater needs a doorway that is not the only exit.
- No Time Warp.

AI_REQUIREMENTS:

- Plater: guardian; skip if leftover AP = 0.
- Stinger: charger; skip rider if leftover AP < 3; never Sting a 2 leftover AP and call it Pair Purse.
- Soph 2–3.

VARIANTS:

- `FSN-SPENT-FULL/PLATE` — BRIGADE **Spent Full** full: add `ROLE-PLATE` (`plate_warden`) junior. Absorb then leftover-AP miss — two defense layers, not a lock. **Never PAIR Spent Plate with Gait / Poise Hood as a two-body.** Unlock after `FSN-PLATE-LINK` **or** `FSN-WARD-MEND`. DoTs chew absorb. Wait expiry.
- `FSN-GLYPH-FULL` remains the leftover-MP CELL; do not merge.

STATUS: PROPOSED

---

### FSN-RIME-FILE

FORMATION_ID: `FSN-RIME-FILE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-RIME-SKIP` — `knight` **without** heal / proposed `rime_skipper` — pack median — flank
- `ROLE-HAZARD` (ice) — `rook` / proposed `rime_mason` (Wave 3) — pack median — paints **rime**, never lava

VARIANT_RULES:

- Distinct from `FSN-GLYPH-FULL` (1-tile **glyph-tax** skip) and `FSN-CINDER-FULL` (cinder skip + leftover-AP≥3 +RES). Pressure is **ice tax then the skip**: the mason paints rime; the skipper’s next 1-tile walk ignores **rime leave-tax**. Length ≥ 2 still pays. Wrong hazard still ticks.
- Elite: Skipper only. Mason stays junior so two ice elites cannot paint the pocket.
- Unlock after `FSN-GLYPH-FULL` **or** `FSN-SPIKE-TAP` (player has seen a 1-tile hazard skip).
- Glyph / Cinder / Spike / Lava / Pit Skip stay off PAIR (PAIR bans). Ley Toll stays off the base sheet (that is `FSN-RIME-FILE/LEY`).
- If the map has no rime / ice cell **and** the mason cannot paint one on a **flank** (not both approaches), **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Rime Skip: next **1-tile** walk ignores **rime leave-tax**. Glyph-tax / lava / spike / pit / cinder still tick. Length ≥ 2 pays.
- Rime tile (mason): paint rime on a floor cell. Leave-tax is the identity, not a stun. One Slow source if Frost is on the skipper — mason does not also Slow.
- Together: paint a flank ice, skip across it, Strike. Walking 2 across ice still pays — honesty.

TACTICAL_PLAN:

- Mason paints a **flank** cell, never both approaches, never the only tile that reaches the Skipper.
- Skipper Skips only if the next walk is a 1-step off that rime. Otherwise Frost / Strike.
- Hostiles start ≥ 4 apart.

SYNERGY:

- 1-tile rime skip + ice mason. Wave 14 Glyph Full standing on a new hazard. Combination, not a new sprite. Don’t stand on rime, or walk 2, is a complete answer.

PLAYER_THREAT:

- Chip if you leave ice the long way. Spike is low. Misplay is treating Skip as a 2-tile ice pass.

COUNTERPLAY:

- Don’t stand on rime. Walk 2 (still pays — that’s the tell). Glyph-tax the same cell. Slow the Skipper. Kill the Mason (paint stops spreading; existing rime stays until expiry).

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with two approaches. One may be ice flavor; one must be clean. Reject ice on every approach + this pack (double hazard).
- Weight 0 on maps with no rime / ice **and** no legal flank paint.

AI_REQUIREMENTS:

- Skipper: flanker / kiter; skip if not on rime; length ≥ 2 still pays — never lie.
- Mason: setter; never paint both approaches; never paint the only backliner path.
- Soph 2–3.

VARIANTS:

- `FSN-RIME-FILE/LEY` — BRIGADE **Rime File** full: add `ley_tollkeeper` junior. Walk-spell +1 after they skip. **Never PAIR Rime Skip with Glyph Skip. Never PAIR Ley with Strike Debt as a two-body.** Unlock after `FSN-DEBT-ORBIT` **or** `FSN-GLYPH-FULL/LEY`. One AP-tax engine.
- `FSN-GLYPH-FULL` remains the glyph-tax CELL; do not merge.

STATUS: PROPOSED

---

### FSN-WATCH-SIP

FORMATION_ID: `FSN-WATCH-SIP`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-SIP` — `bishop` **without** heal / proposed `watch_sipper` — pack median — back, LoS down a **wide** lane
- `ROLE-ANTI-SUMMON` (optic) — `bishop` / proposed `dim_optic` (Wave 3) — pack median — mid, Short Sight / range shred

VARIANT_RULES:

- Distinct from `FSN-GAIT-WATCH` (snap **grants walker** +1 AP) and `FSN-OFF-FEE` (snap **costs** walker 1 AP without transfer). Pressure is **steal on snap**: the overwatch still deals, and 1 leftover AP moves from walker to nowhere (tax, not a grant).
- Elite: Sipper only. Optic stays junior so two range elites cannot snipe-lock.
- Unlock after `FSN-GAIT-WATCH` **or** walked into Hold Ground / Far Watch this run (relative, not a level gate).
- Watch Alms / Watch Fee / Watch Lend / Poise Sip stay off PAIR (PAIR bans). Glass Sniper stays off the base sheet (that is `FSN-WATCH-SIP/GUN`).
- Leftover-AP writer required. Snap that finds leftover 0 still observes the arm.

SPELL_POOL_INTERACTIONS:

- Watch Sip: next **overwatch snap** steals 1 leftover AP from the **walker** if leftover AP ≥ 1. Fail closed without leftover AP. Granting the walker is Watch Alms — never clone it.
- Dim Optic: range shred / Short Sight so the player wants to walk into the lane. It does not also Frost-Slow past −2 if Watch Sip already stole.
- Together: walk the lane, eat the snap, lose the leftover AP chip Spent Plate needed. Sitting is the designed answer.

TACTICAL_PLAN:

- Sipper arms Watch if leftover AP ≥ 1 **and** LoS exists. Optic shreds range so staying at 4 is sad.
- Never turn-1 snap a full-HP player who has not walked — arm, then wait.
- Hostiles start ≥ 4 apart. Opposite corners so one Linear does not delete both.

SYNERGY:

- Overwatch steal + optic. Wave 14 Gait Watch standing on the **inverse** snap (tax, not alms). Combination, not a new sprite. Don’t walk, or spend leftover AP first, is a complete answer.

PLAYER_THREAT:

- Frustration if you walk a plated 1-AP body into the snap. Spike is the snap damage, not a lock. Misplay is walking with leftover AP ≥ 1 into LoS.

COUNTERPLAY:

- Camp. Spend leftover AP first. Fog LoS. Kill the Sipper before the snap. Player Barrier (enemy cannot use it) cuts the lane. Attract / Swap yanks the Sipper into Strike range.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel.
- No lava on the only approach to the Sipper.

AI_REQUIREMENTS:

- Sipper: artillery; skip if leftover AP = 0 or no overwatch is armed.
- Optic: caster; skip recast of an already-active shred (`AI-TEM-04`).
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-SIP/GUN` — BRIGADE **Watch Sip Hunt** full: add `ROLE-SNIPER` (`glass_sniper`) junior. Snap steals leftover AP, then the gun / optic punish the dry purse. **Never PAIR Watch Sip with Watch Alms / Watch Fee. Never PAIR Watch Sip with Glass as a two-body** — the BRIGADE is the three-body. Unlock after `FSN-GLASS-WARD` **or** `FSN-GAIT-WATCH/GUN`.
- `FSN-GAIT-WATCH` remains the grant-walker CELL; do not merge.

STATUS: PROPOSED

---

### FSN-POISE-CHOIR

FORMATION_ID: `FSN-POISE-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-POISE-MEND` — `queen` **with** heal / proposed `poise_mender` — pack median — back
- `ROLE-VERSE-POISE` — `bishop` **without** heal / proposed `verse_poiser` — pack median — mid
- `ROLE-HAZARD` — `knight` / proposed `ignite_alchemist` (Wave 3) — pack median — `spell-inferno` only if kit band 2; else Frost / Mark

VARIANT_RULES:

- Unlock after `FSN-GAUNT-CHOIR` **or** `FSN-POISE-STEP` (player has seen last-id until leftover-both-0 **or** the tied-≥1 heal). Wave 15 “Poise Choir.”
- Elite: Mender only. Verse and Ignite stay junior so two last-id elites cannot silence Inferno forever.
- Verse is the **one** rare. Cadence Swap is `FSN-HOLLOW-SWAP`, not this sheet (two CD engines).
- Inferno lives on the **ignite**, cooldown 3, one target. Mender still has no Inferno. Verse Poise makes last resolved id illegal until leftover AP === leftover MP ≥ 1 — Dual Keep 1/1 peels; dump to 0/0 does **not**.
- No Swap. No Hollow Gift (PAIR bans). No Gaunt Mend (PAIR bans).
- `lastResolvedSpellId` required. Until that writer lands, **do not spawn this id** — show `FSN-GAUNT-CHOIR`.

SPELL_POOL_INTERACTIONS:

- Poise Mend (8) iff both bodies leftover AP === leftover MP ≥ 1. Dual Keep **enables**.
- Verse Poise: last resolved id illegal until leftover AP === leftover MP ≥ 1. Forced-move does **not** peel. `0 = 0` does **not** lift.
- Ignite Inferno (8/turn × 3) after Verse so recast Inferno needs a **tie**. Stack gate ≥ 2 public DoT ticks before a second Inferno (`AI-FUT-02`).
- Together: tied 8, then Inferno is illegal until leftover AP === MP ≥ 1. Readable two-step.

TACTICAL_PLAN:

- Turn 1: Verse if last remaining CD ≥ 2 **or** last id was Inferno; else Frost. Mender Shields unless already tied ≥ 1 and missing HP ≥ 8.
- Ignite holds Inferno until LoS and the player is not already on a walk-hazard.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Tied-≥1 heal + last-id until tied-≥1 + ignite. Wave 14 Gaunt Choir standing on the **inverse** leftover peel. Combination, not a new sprite.

PLAYER_THREAT:

- High if you recast Inferno while sitting 0/0. Still a Dual Keep 1/1 peel. Failure is dumping both pools then eating the delayed Inferno with no recast.

COUNTERPLAY:

- Dual Keep 1/1 (peels Verse, enables Mend — then kill the Mender). Recast something else. Crack Inferno first. Kill the Poiser. Cursed Wound the Mender.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Inferno can land.

AI_REQUIREMENTS:

- Mender: healer; skip if untied.
- Verse: controller; skip if no `lastResolvedSpellId`; `0 = 0` does not lift.
- Ignite: flanker; **not** berserk; one Inferno cadence.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-POISE-CHOIR/NO-IGNITE` — drop Ignite if kit band 2 is not the run’s band (Verse + Mender still a pair).
- `FSN-GAUNT-CHOIR` remains the leftover-0 BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-SHOVE-DRIFT

FORMATION_ID: `FSN-SHOVE-DRIFT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SHOVE-MARK` — `bishop` **without** heal / proposed `shove_marker` — pack median — paints the landing
- `ROLE-DRIFT-GIFT` — `queen` **with** heal / proposed `drift_gifter` — pack median — force-moved 8
- `ROLE-PUSHER` — `pawn` or `knight` / proposed `bash_bruiser` — pack median — Shoulder Bash

VARIANT_RULES:

- Unlock after `FSN-HOOK-SLAM` **or** `FSN-GAUNT-GATE` (player has seen attract/push legality **or** an occupy clock). Wave 15 “Shove Drift.”
- Elite: Pusher only. Marker and Gifter stay junior so two force elites cannot pin.
- Distinct from `FSN-HOOK-FUSE` (Swap + martyr) and `FSN-EMBER-MEND` (burn + self-heal). This sheet is **paint the landing, bash onto it, cash the force-moved heal**. No Swap. No Inferno. No martyr.
- Elite rare: none on BASE. Open Pit / extra bash dest stay off.
- Hook / bash dest still banned from lava / void. Walk-on the paint is **free** — that is the identity, not a lock.
- `forcedMovedThisTurn` required. Until that writer lands, **do not spawn this id**.
- If pack has no force tool, **reroll** (Marker skip-locks).

SPELL_POOL_INTERACTIONS:

- Shove Mark: cell detonates if they **land from a force-move**; consume. Walk-on / Swap / Poise Step do **not** tick.
- Drift Gift: heal 8 iff **target** was force-moved this turn. Caster may be unmoved. Walk / Swap / Poise Step do **not** count. Healer CORE only.
- Shoulder Bash: 2-step ray. Collision bonus vs wall. Dest must leave a walk-off. Bash into open floor is skipped (VETERAN).
- Together: paint, bash onto it (8 on landing), Gift the Basher (or a wounded ally) because they were force-moved. Player walking onto the paint is free.

TACTICAL_PLAN:

- Marker paints a tile a Bash already threatens, never the last exit. Pusher Bashes after the player **or** an ally can land there with a walk-off remaining. Gifter Gifts only if `forcedMovedThisTurn` **and** missing HP ≥ 8; else Shields.
- Never turn-1 double displace onto one tile.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Force-landing paint + force-moved heal + bash. Wave 2 Gravity Choir minus the tax, plus a new clock (landing, not start-of-turn). Combination, not a new sprite. Walk onto it yourself is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I got banged onto paint, then the queen refilled the bruiser.” Recoverable: walk onto the paint, hug the Marker (if minRange 2), Root the Basher, kill the Gifter.

COUNTERPLAY:

- Walk onto the paint (free). Root the Basher. Don’t get pushed. Cursed Wound the Gifter. Kill the Marker (paint expires). Occupy the dest.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze` (bash + landing bomb in a hallway is a lock).
- No Void Rift tile as a legal landing. No lava dest.

AI_REQUIREMENTS:

- Marker: setter; skip if no force ally; walk-on is free — never claim Ingress.
- Gifter: healer; skip if flag unset; caster-may-be-unmoved.
- Pusher: charger; skip bash into open floor; dest scoring must not use lava.
- Soph 3–4. Blackboard: `plannedLanding` so Marker and Pusher agree.

VARIANTS:

- `FSN-SHOVE-DRIFT/KNIGHT` — Pusher chassis `knight` (flank path).
- `FSN-HOOK-SLAM` remains the pull+push CELL; do not merge.

STATUS: PROPOSED

---

### FSN-POISE-QUIET

FORMATION_ID: `FSN-POISE-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-POISE-STEP` — `queen` **without** heal / proposed `poise_stepper` — pack median — mid
- `ROLE-POISE-MEND` — `queen` **with** heal / proposed `poise_mender` — pack median — back
- `ROLE-COVER` — `pawn` or `knight` / proposed `cover_squire` (Wave 6) — pack median + 1 — front, Shield / body-block

VARIANT_RULES:

- Unlock after `FSN-POISE-STEP` **and** (`FSN-GAUNT-QUIET` or `FSN-PARCHED-QUIET`). Wave 15 “Poise Quiet.”
- Two queens, two jobs: Stepper is **join**; Mender is **tied-≥1 8**. Distinct from `FSN-GAUNT-QUIET` (join leftover-both-0). Cover is the **one** rare (ally Shield).
- Elite: Cover only. Stepper and Mender stay junior so two dash elites cannot surround.
- No Inferno. No Hollow Gift / Gaunt Mend (PAIR bans). No Poise Hold (that is `FSN-POISE-HOLD`).
- **Do not ship this id until ally `targetId` apply exists** (Shield on the Mender / Cover). `FSN-POISE-STEP` is self-gated and does **not** wait on Cover’s Shield.
- Leftover-AP **and** leftover-MP writers required. Poise Step occupancy dests (not `isSwap`).

SPELL_POOL_INTERACTIONS:

- Poise Step join + Poise Mend 8. Cover Shields the Mender when the Mender is under 50%, else body-blocks the join dest.
- Haste on Cover is peel tempo, not a sniper haste (no sniper on this sheet).
- No drain on either queen.

TACTICAL_PLAN:

- Cover interposes on the Mender axis. Stepper joins a tied-≥1 ally (Cover if Dual Keep 1/1, else Mender if already tied). Mender Poise-Mends only if all four leftover reads match **and** leftover AP ≥ 1 **and** missing HP ≥ 8.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Tied-≥1 join + tied-≥1 heal + cover. Wave 14 Gaunt Quiet standing on Dual Keep instead of dump-to-0. Combination, not a new sprite.

PLAYER_THREAT:

- Long fight. Spike is low. The fail is never breaking the tie.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP. Occupy the dest. Cursed Wound the Mender. Kill Cover so the join has no body. Walk around; Cover is MP-poor.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `asymmetric` with two approaches. The Stepper’s dest must not be the only player exit.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Stepper: protector; skip-hazard; refuse-post (CHAMPION).
- Mender: healer; skip if untied.
- Cover: guardian interpose + ally Shield.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-POISE-QUIET/LEND` — BRIGADE **Lend Hood** escort: replace Cover with `ROLE-POISE-LEND` + add `ROLE-POISE-HOOD` **or** keep Cover and add Lender junior (still three bodies — drop Cover if four would jump the grade). Keep the tie with +1/+1, then any-range miss while tied. **Never PAIR Poise Lend with Gaunt / Lean Lend. Never PAIR Poise Hood with Spent / Even / Gait Plate as a two-body.** Unlock after `FSN-SPENT-FULL` **or** `FSN-EVEN-ORTH`. Tempo Precentor stays off PAIR (that is the named Lend Hood pack’s third — optional CADRE add, not this variant’s BASE).
- `FSN-POISE-STEP` remains the teaching PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-HOLLOW-SWAP

FORMATION_ID: `FSN-HOLLOW-SWAP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-HOLLOW-GIFT` — `queen` **with** heal / proposed `hollow_gifter` — pack median — back
- `ROLE-CADENCE-SWAP` — `bishop` **without** heal / proposed `cadence_swapper` — pack median — mid
- `ROLE-CANTOR` (once) — `queen` **without** heal / proposed `once_cantor` (Wave 8) — pack median — echo lock; **no** Inferno on this body

VARIANT_RULES:

- Unlock after `FSN-STILL-GRACE` **or** `FSN-POISE-STEP` (player has seen target-camp heal + skip-CD **or** leftover-gated heal). Wave 15 “Hollow Swap.”
- Distinct from `FSN-GAUNT-STEP` (caster **and** target leftover both 0) and `FSN-POISE-CHOIR` (tied-≥1 last-id). Pressure is **target-empty both-pools 8**, then **trade Inferno’s remaining onto the cantor**.
- Elite: Swapper only. Gifter and Once stay junior.
- Cadence Swap is the **one** rare. Verse Poise is `FSN-POISE-CHOIR`, not this sheet (two last-id engines). Cadence Floor stays SDE — not a member.
- Dual Keep on the **target** **blocks** Hollow Gift. Caster leftover unconstrained — never require Gaunt Mend’s four flags.
- No Poise Mend / Gaunt Mend / Drift Gift (PAIR bans). No Imprint / Lag / Grace as PAIR.

SPELL_POOL_INTERACTIONS:

- Hollow Gift: heal 8 iff **target leftover AP = 0 and leftover MP = 0**. Dual Keep leftover **blocks**.
- Cadence Swap: exchange remaining CD **maps** caster ↔ target. Unknown ids dropped. Once/battle flags and spell levels are **not** CDs. Not tile Swap. Not Cadence Floor.
- Once Cantor: echo lock on the dumped id. It does not also Inferno (heal-less so inference stays caster — this body has **no** `healAmount`).
- Together: empty the target, Gift 8, trade Inferno’s remaining onto Once so recast is sad. Keep 1 leftover AP **or** MP on the target is a complete answer.

TACTICAL_PLAN:

- Gifter Shields unless target leftover both 0 **and** missing HP ≥ 8. Swapper Swaps if they hold Inferno 3 and the caster’s map is empty; else Frosts. Once holds and echoes the dumped id.
- Never turn-1 map-trade a full-HP player with empty remaining — Frost first.
- Hostiles start ≥ 4 apart. Two queens, opposite corners.

SYNERGY:

- Target-empty both-pools heal + remaining-CD map trade + once. Wave 14 Still Grace standing on leftover-**pools** instead of walk-spend, plus a full remaining-map trade instead of skip-own-CD. Combination, not a new sprite.

PLAYER_THREAT:

- Long if you empty both pools **and** hold Inferno remaining. Spike is low. Failure is Dual Keep empty then eating Gift, then losing Inferno remaining to Once.

COUNTERPLAY:

- Keep 1 leftover AP **or** MP on yourself (Gift fizzles). Empty your remaining before they arm. Crack Inferno first. Kill the Gifter. Recast something else. Dual Keep **blocks** Gift — then kill Swapper.

MAP_REQUIREMENTS:

- `openField` or `arena`. Gifter needs a retreat tile that is not the Once choke.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Gifter: healer; skip if target wet; caster-may-be-wet.
- Swapper: controller; skip if both maps empty; unknown ids dropped — never invent Inferno.
- Once: caster; heal-less; skip recast of an already-active echo.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4.

VARIANTS:

- `FSN-HOLLOW-SWAP/NO-ONCE` — drop Once if echo apply is not ready (Gifter + Swapper still a pair).
- `FSN-STILL-GRACE` remains the walk-spend BRIGADE; `FSN-GAUNT-CHOIR` remains the leftover-0 last-id BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-LONE-HAZARD

FORMATION_ID: `FSN-LONE-HAZARD`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-LONE-GAIT` — `pawn` **without** heal / proposed `lone_gaiter` — pack median − 1 — glass poke
- `ROLE-HAZARD-CUT` — `pawn` **without** heal / proposed `hazard_cutter` — pack median — painted-hazard bonus
- `ROLE-GLYPH` — `bishop` / proposed `glyph_sower` — pack median — Mark + Poison / cinder paint

VARIANT_RULES:

- Unlock after `FSN-PAIR-GIFT` **or** `FSN-LONE-AXIS` (player has seen leftover-MP exactly 2 poke **or** isolation bite + pet-axis). Wave 15 “Lone Hazard.”
- Elite: Cutter only. Gaiter and Glyph stay junior.
- Distinct from `FSN-LONE-AXIS` (isolation from **all** units + handler-on-file with a **pet**). This sheet is leftover-MP **exactly 1** poke, then cash **painted-hazard** bonus. Dummy Post is not a hazard. World lava that is **not** painted does **not** count.
- Glyph Marks a tile the player can step off. Poison is the DoT; do not also Inferno (cut is the gun).
- Pair Gait / Full Gait / Poise Sting / Axis Cut stay off (PAIR bans). Brood stays off (that is `FSN-LONE-AXIS`).
- Leftover-MP writer required. Weight 0 if no painted hazard **and** Glyph cannot paint one on a **flank**.

SPELL_POOL_INTERACTIONS:

- Lone Gait: 10 + 8 if leftover MP **exactly 1**. Spend down to 1 walk MP, or spend the last chip. Leftover MP 2 is Pair Gait’s window — skip. Leftover MP 0 is Gaunt Sting’s window — skip.
- Hazard Cut: 10 + 10 if target stands on a **painted** hazard (cinder / rime / glyph-tax / painted pit). Reads occupancy flags, never `spell.name`.
- Glyph Mark ×2 on the **next** spell on that tile. Confirm live Mark × Cut before shipping (same caveat as `FSN-MARK-CONFLAGRATION`). Safe reading: Mark then Cut, never Mark + Poison + Cut the same AP bar.
- Together: tax walk MP to 1, paint, Cut. Keep 2 walk MP **or** dump to 0, and step off paint, is a complete answer.

TACTICAL_PLAN:

- Glyph stays at 4, Marks a step-off cell, then paints hazard on a **flank** cell. Gaiter commits when leftover MP = 1. Cutter commits when they stand on paint.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-MP exactly 1 poke + painted-hazard cut + glyph. Wave 14 Pair Gift / Lone Axis standing on last walk chip + paint instead of isolation + pet. Combination, not a new sprite.

PLAYER_THREAT:

- High if you sit on leftover MP 1 **and** paint. Still interruptible: keep 2, dump to 0, step off paint, snipe the Gaiter.

COUNTERPLAY:

- Don’t sit on 1 MP. Leave the paint. Kill the Gaiter (`hp` ~0.75). Frost the Cutter. Glyph is a bishop — walk in. Haste. Do not clump with a wisp on paint.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with two approaches. One may be warm flavor; one must be clean. Reject lava-painted engagement + this pack (double hazard unless the clean aisle exists).
- ≥ 2 walk-offs from the marked cell.

AI_REQUIREMENTS:

- Gaiter: flanker; skip rider if leftover MP ≠ 1; never Gait a 0 leftover MP and call it Gaunt.
- Cutter: flanker; skip rider if not on paint; refuse Dummy Post as hazard.
- Glyph: caster + “do not recast Mark on a vacated tile.”
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-LONE-HAZARD/NO-GLYPH` — BRIGADE-shaped CADRE if paint is already on the map (Gaiter + Cutter). Weight 0 if no painted hazard.
- `FSN-LONE-AXIS` remains the isolation CADRE; `FSN-PAIR-GIFT` remains the leftover-MP-exactly-2 CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-STRIKE-TAX

FORMATION_ID: `FSN-STRIKE-TAX`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-STRIKE-DEBT` — `bishop` **without** heal / proposed `strike_debter` — pack median — back
- `ROLE-TAX` — `bishop` / live `bone_scribe` or proposed `tax_scribe` — pack median — Weaken / Glyph Tax; **no** drain
- `ROLE-GAP-CLOSER` (oncoming) — `knight` / proposed `oncoming_knight` (Wave 6) — pack median — wants to Strike

VARIANT_RULES:

- Unlock after `FSN-DEBT-ORBIT` **or** `FSN-BELL-CUT` (player has seen spelled-last-turn walk tax **or** a delayed clock). Wave 15 “Strike Tax.”
- Elite: Debter only. Scribe and Oncoming stay junior.
- Distinct from `FSN-DEBT-ORBIT` (spelled-**last-turn** next-walk +1 AP + orbit barrier). This sheet taxes the walk **after they Struck**. Spell last turn → fizzle. Teleport / Swap / Poise Step do not pay.
- Tax is the **one** rare. Drain Courage is COURT, not this sheet (two AP engines). Glyph Tax is +1 AP to **cast** while in the 3×3, 0 damage. Leaving the zone is the answer.
- Cast Debt / Spent Tax / Ley stay off PAIR (PAIR bans). Brick Orbit stays off (that is `FSN-DEBT-ORBIT`).
- `struckThisTurn` required. Until that writer lands, **do not spawn this id** — show `FSN-DEBT-ORBIT`.

SPELL_POOL_INTERACTIONS:

- Strike Debt: next walk +1 AP if they **Struck** last turn. Strike itself is exempt.
- Glyph Tax / Weaken: zone AP tax **or** −30% dmg. Tax will not overlap two zones. Frost after landing is a tax, not a root.
- Oncoming: wants a Strike so Debt arms. It does not also Swap (that is `FSN-RIFT-KNOT`).
- Together: Oncoming baits a Strike, Debt taxes the walk away, Tax paints the landing. Don’t Strike, or Swap instead of walk, is a complete answer.

TACTICAL_PLAN:

- Turn 1: Scribe Weakens if the player is already wounded; else holds. Debter Frosts unless they Struck last turn. Oncoming walks a flank and Strikes only when reachable.
- If the player never Strikes, this is a softer `FSN-FROST-KNIFE` plus a Tax bishop — fine.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Struck-last-turn walk tax + glyph tax + oncoming. Wave 14 Debt Orbit standing on **Strike** instead of spell, minus the orbit. Combination, not a new sprite.

PLAYER_THREAT:

- Tempo. Failure is Striking, then walking into Tax for a 5-AP turn. Recoverable: sit, spell, Swap, kill the Debter (`hp` ~0.80).

COUNTERPLAY:

- Don’t Strike. Spell last turn (Debt fizzles). Don’t walk. Kill the Debter. Leave the Tax zone. Occupy the landing. Player Timestep is the designed panic.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- Tax 3×3 must not cover **all** walk-offs from the landing.

AI_REQUIREMENTS:

- Debter: controller; skip if not Struck; relocate does not pay.
- Tax: caster; zone the landing **only** if an exit exists; skip recast of an active tax (`AI-TEM-04`).
- Oncoming: charger / flanker; not berserk.
- Soph 4–6. `groupTactics` on. Blackboard: `plannedLanding` so Tax and Oncoming agree.

VARIANTS:

- `FSN-STRIKE-TAX/NO-TAX` — BRIGADE-shaped CADRE: Debter + Oncoming only (if Glyph Tax is not ready).
- `FSN-DEBT-ORBIT` remains the spelled-last-turn CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-CROSS-POISE

FORMATION_ID: `FSN-CROSS-POISE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BAR-CROSS` — `bishop` **without** heal / proposed `bar_crosser` — pack median — leftover AP↔MP four-write
- `ROLE-POISE-MEND` — `queen` **with** heal / proposed `poise_mender` — pack median — optional `isLeader`
- `ROLE-POISE-STING` — `pawn` **without** heal / proposed `poise_stinger` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-POISE-STEP` **and** `FSN-POISE-SIP`. Wave 15 “Cross Poise.”
- Elite: Crosser only. Mender and Stinger stay junior so two leftover-cross elites cannot pin.
- Distinct from `FSN-POISE-CHOIR` (last-id until tied) and `FSN-PAIR-GIFT` (leftover-MP exactly 2). Pressure is **make the tie**, then cash heal **or** sting. Dual Keep already tied → Cross **skips** (VETERAN).
- Bar Cross is the **one** rare. Dual Keep / tile Swap stay off PAIR (PAIR bans). Tempo Invert is ally/self — not a member.
- No Inferno. No Hollow Gift / Gaunt Mend (PAIR bans). No Poise Hold (COURT).
- Leftover-AP **and** leftover-MP writers required. Simultaneous four-write (snapshot both leftover pairs first; never sequential half-writes).

SPELL_POOL_INTERACTIONS:

- Bar Cross: caster AP ← target MP, caster MP ← target AP, target AP ← caster MP, target MP ← caster AP, each capped at that pool’s max. Not `isSwap`. Not `invertApMp`. Sit at 0/0 so the cross is a no-op.
- Poise Mend 8 iff both bodies leftover AP === leftover MP ≥ 1 after the write.
- Poise Sting 10+8 iff leftover AP === leftover MP ≥ 1 after the write.
- Together: Cross leftover pools until a tie appears, then heal / sting. Spend 1 leftover **after** the write is a complete answer.

TACTICAL_PLAN:

- Crosser Crosses if the write would create a Poise tie **or** dump their walk MP onto the caster; skip if both leftover pairs are 0/0. Mender waits for the tie. Stinger commits after the write if leftover AP === leftover MP ≥ 1.
- Never Cross + Sting + Mend on the same AP bar if that hides the tell — Cross this turn, cash next turn.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover AP↔MP cross + tied heal + tied sting. Wave 15 leftover-equality exam. Combination, not a new sprite. Dual Keep after the write if you wanted the bank back.

PLAYER_THREAT:

- High if you sit 3/0 and get crossed into 0/3 **or** a tie. Still readable. Failure is Dual Keep 1/1 into Sting range after they already tied you.

COUNTERPLAY:

- Sit at 0/0 (cross is a no-op). Haste after the write. Spend 1 leftover after the write. Kill the Crosser (`hp` ~0.80). Dual Keep after the write if you wanted the bank back. Cursed Wound the Mender.

MAP_REQUIREMENTS:

- `openField` or `arena`. Crosser needs LoS at 3 **and** a retreat tile. Stinger needs a flank that is not the only exit.
- No Time Warp.

AI_REQUIREMENTS:

- Crosser: controller; skip if both leftover pairs 0/0; CHAMPION snapshot-four-write.
- Mender: healer; skip if untied; optional `isLeader`.
- Stinger: flanker; skip rider if untied; never dump leftover **only** to fake Gaunt Sting.
- Soph 4–6. `groupTactics` on. Blackboard: `plannedCross` so Mend and Sting wait one turn.

VARIANTS:

- `FSN-CROSS-POISE/NO-MEND` — BRIGADE-shaped CADRE: Crosser + Stinger only (if ally heal apply is missing).
- `FSN-POISE-STEP` / `FSN-POISE-SIP` remain the teaching PAIRs; do not merge.

STATUS: PROPOSED

---

### FSN-POISE-HOLD

FORMATION_ID: `FSN-POISE-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-POISE-HOLD` — `knight` **without** heal / proposed `poise_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-POISE` — `knight` **without** heal / proposed `must_poiser` — pack median — tools-until tied-≥1 **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-POISE-HOOD` junior **or** omit — if present, skip if already untied

VARIANT_RULES:

- Unlock after (`FSN-POISE-SIP` or `FSN-KNIGHT-QUAD`) **and** a leader-boost CADRE. Wave 15 “Poise Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Poise Hold + Must Poise** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP === leftover MP ≥ 1; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-POISE-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Poise Hold: cannot spend walk MP while leftover AP === leftover MP ≥ 1. Spells stay legal. Spend one pool **or** dump both to walk.
- Must Poise: remaining **non-Strike** spells illegal unless leftover AP === leftover MP ≥ 1 **and this spell spends last AP**. Strike stays legal.
- Together: Dual Keep 1/1 cannot walk **and** cannot Inferno unless last AP. Dump leftover to 0/0 peels Hold (untied) but does **not** peel Must unless they also spend last AP on Strike. Dual Keep 1/1 peels Must’s tool-lock if they spend last AP. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover AP === leftover MP ≥ 1; skip if already 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-equality **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover AP **or** MP, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-equality threat in this drop. Still turn-based. Failure is Dual Keep 1/1 to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after breaking the tie **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP (Hold peels). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover AP ≠ leftover MP **or** leftover AP = 0; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if already 0/0; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if already untied.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-POISE-HOLD/LANE` — BRIGADE-shaped: Hold + Must Poise + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-POISE-HOLD/NO-HOOD` — COURT of three.
- `FSN-POISE-HOLD/NINE` — COURT **Nine Plug**: replace this id’s members with `ROLE-NINE` + `ROLE-POISE-SILL` + `ROLE-LANCER`. Solid 3×3 seal, tax a neighbor at turn start, lance the block. **Skip until remaining cap ≥ 9** (live cap 2). Burst the 9 HP. Walk a far diagonal. Sit on a cell so the place fizzles. Swap around the block. `summonAI === "ninespan"` required. Center stays occupied. Do not also roll a second post. Needs a free 3×3 plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 9. Weight 0 on maps with no free 3×3 (solvability).
- `FSN-POISE-HOLD/BOUNCE` — COURT **Bounce Poise**: replace Hold + Must + Warden with `ROLE-POISE-BOUNCE` + `ROLE-MUST-POISE` + `fuse_binder`. Two leftover-AP===MP≥1 bodies, bounce 12+8 onto the wick. **Never PAIR Poise Bounce with Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-GAUNT-HOLD/BOUNCE` **or** `FSN-POISE-SIP`. Missing second tied-≥1 flag → 12 only. Player keeps leftover AP ≠ leftover MP **or** leftover AP = 0 on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-POISE-HOLD/KENNEL` — COURT **Cast Kennel**: replace Hold + Must + Hood with `ROLE-SUMMON-CAST` + `kennel_siller` + `null_censor`. Pets pay **AP** to **spell**, then they cannot leave — teach contrast vs Toll / Gait. **Never PAIR Summon Cast with Summon Toll / Summon Gait / Kennel / Brace / Brood as a two-body.** Unlock after `FSN-LONE-HAZARD` **or** `FSN-GAUNT-HOLD/KENNEL`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot spell). Cap one kennel engine. Teleport / Swap / forced move do **not** pay the cast tax. Drop this variant if `summonAI` is empty.
- `FSN-POISE-HOLD/NUDGE` — COURT **Brick Nudge Gate**: replace Hold + Must + Hood with `ROLE-BRICK-NUDGE` + `ROLE-TRAPPER` (`trip_mason`) + `ROLE-TURRET` (`stone_castellan`). Push the wall 1, trip the new choke, optional turret on the new file. **Never PAIR Brick Nudge with Orbit / Crack / Sprout / Shift / Wipe / Castellan as a two-body** — the COURT is the three-body. Unlock after `FSN-BRICK-WAKE` **or** `FSN-FILE-WIRE`. Solvability skip is mandatory. Weight 0 if no barrier in Chebyshev 1 of a legal floor. Turret cap 1; `mp: 0`; must not path. Trap is **not** `placeBarrier` until that redefine lands — skip this variant until trip is real.
- `FSN-GAUNT-HOLD` remains the leftover-MP **and** last-AP COURT; this id is leftover **AP === MP ≥ 1**.
- `FSN-GAUNT-HOLD/OCT` remains the 8-cell hollow COURT; `/NINE` is the 9-cell solid COURT.
- `FSN-POISE-SIP` / `FSN-KNIGHT-QUAD` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–15 still stand. This drop **meshes**; it does not replace.

```
PAIR:    POISE-STEP         POISE-SIP          KNIGHT-QUAD        PIT-AXIS
              \\                 |                   |                  /
CELL:     POISE-GATE        SPENT-FULL         RIME-FILE         WATCH-SIP
              \\                 |                   |                  /
BRIGADE:  POISE-QUIET       SHOVE-DRIFT        HOLLOW-SWAP       POISE-CHOIR
              \\                 |                   |                  /
CADRE:    LONE-HAZARD       STRIKE-TAX         CROSS-POISE
              \\                 |                  /
COURT:                    POISE-HOLD    POISE-HOLD/NINE    POISE-HOLD/BOUNCE    POISE-HOLD/KENNEL    POISE-HOLD/NUDGE
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-POISE-STEP` | `FSN-GAUNT-STEP` **or** `FSN-PAIR-GIFT` |
| `FSN-POISE-SIP` | `FSN-GAUNT-SIP` **or** `FSN-POISE-STEP` |
| `FSN-KNIGHT-QUAD` | `FSN-EVEN-ORTH` **or** `FSN-ORTH-TRI` |
| `FSN-PIT-AXIS` | `FSN-BRICK-WAKE` **or** `FSN-LONE-AXIS` |
| `FSN-POISE-GATE` | `FSN-GAUNT-GATE` **or** `FSN-POISE-SIP` |
| `FSN-SPENT-FULL` | `FSN-GAIT-WATCH` **or** `FSN-GLYPH-FULL` |
| `FSN-RIME-FILE` | `FSN-GLYPH-FULL` **or** `FSN-SPIKE-TAP` |
| `FSN-WATCH-SIP` | `FSN-GAIT-WATCH` **or** walked into Hold Ground / Far Watch |
| `FSN-POISE-CHOIR` | `FSN-GAUNT-CHOIR` **or** `FSN-POISE-STEP` |
| `FSN-SHOVE-DRIFT` | `FSN-HOOK-SLAM` **or** `FSN-GAUNT-GATE` |
| `FSN-POISE-QUIET` | `FSN-POISE-STEP` + (`FSN-GAUNT-QUIET` or `FSN-PARCHED-QUIET`) |
| `FSN-HOLLOW-SWAP` | `FSN-STILL-GRACE` **or** `FSN-POISE-STEP` |
| `FSN-LONE-HAZARD` | `FSN-PAIR-GIFT` **or** `FSN-LONE-AXIS` |
| `FSN-STRIKE-TAX` | `FSN-DEBT-ORBIT` **or** `FSN-BELL-CUT` |
| `FSN-CROSS-POISE` | `FSN-POISE-STEP` + `FSN-POISE-SIP` |
| `FSN-POISE-HOLD` | (`FSN-POISE-SIP` or `FSN-KNIGHT-QUAD`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 16 packs (not this drop)

Wave 16 families do **not** exist yet. Same-day 2026-10-23 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-23.md`, open as PR #953) and SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, PR #906, **except** Cadence Floor already owned, **except** Pack Rank / Rank Fold unless a later boss sheet claims them) stay Wave **16** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 15 sheets.

Held verbs (do not FSN this drop): Rank Stride, Penta Oath, Spike Reel, Screen Bite, Swap Mark, Odd Plate, Mire Skip, Odd Sting, Summon Verse, Equal Gift, Cast Toll, Brick Step, Watch Bank, Tied Gait, Portal Cut, Shove Gift. Equal Gift is **target-only** tied-≥1 — the one-body cousin of Poise Mend. Do **not** pack `poise_mender` with a future `equal_gifter` as a teaching pair.

Do **not** pack `poise_holder` with `must_poiser` as a teaching pair (Wave 15 rule). `FSN-POISE-SIP` stays the tied-≥1 poke lesson; `FSN-POISE-HOLD` stays the walk-until tied-≥1 **and** last-AP COURT.

Do **not** pack `poise_mender` with `hollow_gifter` as a teaching pair. `FSN-POISE-STEP` stays the both-bodies tied-≥1 lesson; `FSN-HOLLOW-SWAP` stays the target-empty BRIGADE. Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`).

Do **not** pack `poise_mender` with `gaunt_mender` / `dry_gaiter` / `dry_mender`. `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-PAIR-DRY` stays leftover-AP=0; this drop owns leftover **AP === MP ≥ 1**. **0 = 0 does not fire.**

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend. Cadence Floor stays SDE #906. Same-day SDE Wave 14 unique CORE stays Wave **16** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–15, plus Wave 15 verbs in this order (from elite-evolution §5):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-KNIGHT-QUAD` band 0 can ship among the first** once family HP survives battle start. `FSN-POISE-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Poise Mend / Hollow Gift / Drift Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **`forcedMovedThisTurn`** / `lastForcedMoveDir`. Dual Keep leftover **is** leftover.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Poise Step occupancy dests (not `isSwap`). Pit Reel = eighth attract dest flavor (toward, not onto, a world portal). Brick Nudge = adjacent-barrier push 1 (not unit bash, not orbit); solvability skip.
6. `inferSummonArchetype` gains `ninespan` and `poisepost` (and still needs `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–14). Raise or gate `ENEMY_SUMMON_CAP` before Nine Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Poise Lend). **`FSN-POISE-QUIET` and `FSN-POISE-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-POISE-STEP` / `FSN-HOLLOW-SWAP` / `FSN-CROSS-POISE` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Poise Hold while leftover AP === leftover MP ≥ 1. Must Poise / Verse Poise / Quad Oath / Knight Stride as refuse-until. Poise Sill start-turn leftover-equality occupy (paint stays). Shove Mark force-landing occupy (consume). Poise Post leftover-equality occupy. Spent Plate leftover-AP≥1. Full Sting leftover-AP≥3. Lone Gait exact-1 MP. Poise Hood consume-before-damage. Bar Cross simultaneous four-write. Cadence Swap remaining-map exchange. Brick Nudge solvability skip.
9. Summoner cooldown fall-through (nine / poisepost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT nine sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** mint SDE Wave 14 unique CORE as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-POISE-STEP`, `FSN-POISE-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP === leftover MP ≥ 1; `0 = 0` does not fire; Poise Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-POISE-SIP`, `FSN-POISE-GATE` | leftover-AP + leftover-MP reads; Poise Sting AP === MP ≥ 1; Sip leftover equality; Poise Post leftover-equality occupy / walk-safe / dump-safe; Poise Sill start-turn leftover-equality, paint stays; two different tiles; `summonAI === "poisepost"` |
| `FSN-KNIGHT-QUAD` | Knight Stride (2,1) dest; Quad Oath exact 4; Strike remains legal; blink does not pay; a legal (2,1) floor exists |
| `FSN-PIT-AXIS` | eighth `applyAttract` dest (pit); dest is not the portal; map has a pit in 6; Axis Bite caster rank/file, Dummy Post is not a pet |
| `FSN-SPENT-FULL` | leftover-AP≥1 miss; Full leftover-AP≥3; Drain peels both |
| `FSN-RIME-FILE` | 1-tile rime skip; length ≥ 2 pays; one clean aisle; map has a rime / ice cell **or** a legal flank paint |
| `FSN-WATCH-SIP` | leftover-AP steal on overwatch snap; still deals; never grant the walker |
| `FSN-POISE-CHOIR` | `lastResolvedSpellId`; Poise Mend four leftover-equality ≥ 1; Verse Poise leftover-equality peel (`0 = 0` does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-SHOVE-DRIFT` | `forcedMovedThisTurn`; Shove Mark force-landing consume; walk-on is free; Drift Gift target-forced; bash dest legality |
| `FSN-HOLLOW-SWAP` | target leftover AP = 0 **and** leftover MP = 0; Dual Keep on the target **blocks**; Cadence Swap remaining-map exchange; unknown ids dropped |
| `FSN-LONE-HAZARD` | leftover-MP exactly 1; painted-hazard occupancy (not `spell.name`); Dummy Post is not a hazard |
| `FSN-STRIKE-TAX` | `struckThisTurn`; Strike last turn arms; spell last turn fizzles; relocate does not pay; never Debt+Scribe as PAIR |
| `FSN-CROSS-POISE` | simultaneous leftover four-write; Cross then cash next turn; 0/0 is a no-op |
| `FSN-POISE-HOLD` | Poise Hold until leftover AP === leftover MP ≥ 1; Must Poise leftover-equality **and** last-AP tool-lock; never Root; spend 1 leftover **or** dump both peels Hold; last AP on Strike peels Must |
| `FSN-POISE-HOLD/NINE` | `summonAI === "ninespan"` **and** remaining cap ≥ 9 (live cap 2 → skip); solid 3×3, center occupied |

---

## Sources (line-accurate, 2026-10-24)

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
- Wave 15 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-23.md` (PR #941) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-22.md` (PR #890); leftover SDE Wave 13 unique CORE in PR #837
- Drop 15: `docs/design/ENEMY_FORMATIONS_2026-10-23.md` (PR #956)

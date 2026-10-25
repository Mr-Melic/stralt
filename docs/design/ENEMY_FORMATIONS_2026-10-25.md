# Enemy synergy and formation catalog (drop 17)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-25  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–16 already taught the seven pairing words and Waves 1–15 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 16 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-24.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-24.md) (open as PR #997) and deferred by drop 16 (PR #1005): Tally Choir, Dec Plug, Rank Penta, Spike Screen, Swap Brick, Odd Court, Mire File, Verse Kennel, Equal Shove, Prime Tax, Watch Bank Hunt, Tied Portal, Tally Quiet, Purse Tally, Tally Gate, Bounce Tally, Tally Hold File, Lend Hood, Rank Screen.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956), [`ENEMY_FORMATIONS_2026-10-24.md`](./ENEMY_FORMATIONS_2026-10-24.md) (drop 16 — open as PR #1005). Family sheets: PR #997. Spell verbs: Wave 15 tactical ids in PR #953 (`spell-tally-mend` … `spell-court-prime`, **except** Court Prime) plus leftover SDE Wave 14 unique CORE (`spell-rank-stride` … `spell-rank-fold`, **except** Pack Rank / Rank Fold / Cadence Floor). Cadence Floor stays SDE #906.

**Hard rules (Wave 16 pack law — plus every older law still stands):**

- Do **not** pack `tally_mender` with `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (both leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover-**both 0** vs **target**-both-0 vs **target-only** tied ≥ 1 vs **target**-force vs **this-caster** force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs spell-resolved vs leftover-cross vs unconditional). `FSN-POISE-STEP` / `FSN-GAUNT-STEP` / `FSN-HOLLOW-SWAP` / `FSN-STILL-GRACE` / `FSN-DRY-STEP` stay theirs. `FSN-TALLY-STEP` owns four-flag **sum===3** heal. `FSN-EQUAL-SHOVE` owns target-tied-≥1 plus authored shove. Dual Keep leftover **is** leftover: 2/2 **enables Poise and is not Tally**; (2,1) / (1,2) / (3,0) / (0,3) **enables Tally**; 0/0 **enables Gaunt / Hollow Gift and is not Tally**. `leftover AP = 0` and `leftover MP = 0` is **not** a Tally window. `2 = 2` is **not** a Tally window.
- Do **not** pack `cadence_primer` with `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (remaining `n===0` → `1` vs full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-HOLLOW-SWAP` / `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR/LAG` / `FSN-IMPRINT-CHOIR` stay theirs. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`. Cadence Rise stays SDE #962. Cadence Snuff stays Wave **17** family CORE (PR #1011) — do **not** mint `cadence_snuffer`.
- Do **not** pack `dec_prelate` with `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Dec counts as **10**. Every cell of the 2×5 is **occupied**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 10. Live cap is **2** — skip `FSN-TALLY-HOLD/DEC`. `FSN-POISE-HOLD/NINE` stays the solid-9 COURT.
- Do **not** pack `tally_hooder` with `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` as a PAIR (sum===3 any-range miss vs tied-≥1 miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss vs leftover-AP **odd** miss). `FSN-POISE-QUIET/LEND` / `FSN-SPENT-FULL` / `FSN-EVEN-ORTH` stay theirs. `FSN-ODD-COURT` owns Odd Plate. `FSN-TALLY-QUIET/LEND` owns Lend Hood.
- Do **not** pack `tally_stinger` with `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `lone_purser` / `pair_purser` / `full_purser` as a PAIR (leftover **AP + MP === 3** poke vs leftover **AP === MP ≥ 1** vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover **AP odd** vs leftover AP **and** MP **exactly 2** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover AP **exactly 1** vs leftover AP **exactly 2** vs leftover AP ≥ 3 +RES cousin). `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-SPENT-FULL` / `FSN-LONE-HAZARD` stay theirs. `FSN-TALLY-SIP` owns leftover-sum poke. `FSN-TIED-PORTAL` owns exact 2/2. `FSN-ODD-COURT/STING` owns leftover-AP-odd poke.
- Do **not** pack `tally_stepper` with `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire` (join leftover-**sum===3** ally vs leftover-**AP===MP≥1** vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs **through-barrier peek** vs line rescue vs cover). BRIGADE `FSN-TALLY-QUIET` is the three-body lesson. `FSN-POISE-STEP` / `FSN-POISE-QUIET` / `FSN-GAUNT-STEP` stay theirs. `FSN-SWAP-BRICK` owns Brick Step.
- Do **not** pack `tally_siller` with `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` as a PAIR (start-turn occupy **and leftover AP + leftover MP === 3**, paint stays vs start-turn occupy **and leftover AP === MP ≥ 1** vs start-turn occupy **and both leftover 0** vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing** vs **teleport landing**). `FSN-POISE-GATE` / `FSN-GAUNT-GATE` / `FSN-SHOVE-DRIFT` stay theirs. `FSN-SWAP-BRICK` owns Swap Mark.
- Do **not** pack `tally_holder` with `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_tallier` as PAIR / `must_poiser` as PAIR (cannot walk while leftover AP + leftover MP === 3 vs while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs leftover-MP=0 **and** last AP vs tools-until leftover-sum===3 **and** last AP vs tools-until tied-≥1 **and** last AP). COURT `FSN-POISE-HOLD` stays leftover-equality peel. `FSN-TALLY-HOLD` is the 3-body. **Never PAIR Tally Hold + Must Tally.**
- Do **not** pack `tally_lender` with `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **sum === 3** — **exits** to sum 5 vs +1/+1 if leftover **AP === MP ≥ 1** — **keeps** the tie vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-POISE-QUIET/LEND` / `FSN-GAUNT-QUIET/LEND` stay theirs. `FSN-TALLY-QUIET/LEND` is the 3-body.
- Do **not** pack `tally_sipper` with `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **sum === 3** and leftover AP ≥ 1 vs steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal). `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-WATCH-SIP` stay theirs. `FSN-WATCH-BANK` owns the snap **bank**.
- Do **not** pack `tally_prelate` with `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `dec_prelate` / `nine_prelate` as a PAIR (end-turn occupy **and leftover AP + leftover MP === 3** detonate vs leftover-AP===MP≥1 occupy vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait vs 10-cell occupy vs 9-cell occupy). `FSN-POISE-GATE` stays leftover-tied detonate. `FSN-TALLY-GATE` is the leftover-sum post.
- Do **not** pack `tally_bouncer` with `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**sum===3** hostile vs leftover-tied bounce vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-POISE-HOLD/BOUNCE` / `FSN-GAUNT-HOLD/BOUNCE` stay theirs. `FSN-TALLY-HOLD/BOUNCE` is leftover-sum Bounce Tally, never a two-bounce PAIR.
- Do **not** pack `must_tallier` with `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `tally_holder` as a PAIR (non-Strike illegal unless leftover **sum === 3 and this spell spends last AP** vs leftover **AP === MP ≥ 1 and last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until leftover-sum===3). `FSN-POISE-HOLD` / `FSN-GAUNT-HOLD` / `FSN-ODD-MUST` / `FSN-LEAN-HOLD` stay theirs.
- Do **not** pack `verse_tallier` with `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as a PAIR (last-id illegal until leftover **sum === 3** vs until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock vs pets pay +1 AP to **recast last id**). `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR` stay theirs. `0 = 0` does **not** peel Verse Tally. `2 = 2` does **not** peel Verse Tally.
- Do **not** pack `rank_warder` with `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as a PAIR (next walk dest **shares rank** vs **(2,1)** vs **orthogonal-only** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal vs linear file charge). `FSN-KNIGHT-QUAD` / `FSN-EVEN-ORTH` / `FSN-ORTH-TRI` / `FSN-DIAG-OATH` / `FSN-INCH-OATH` stay theirs. Extra room `rank_gallery` is **not** this family.
- Do **not** pack `penta_oather` with `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `penta_prelate` (next spell exact Chebyshev **5** vs exact **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0 vs five-cell occupy). `FSN-KNIGHT-QUAD` leftover oaths stay theirs. Extra room `penta_nave` is **not** this family.
- Do **not** pack `spike_reeler` with `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` as a PAIR (pull toward **spike occupancy** vs **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity). `FSN-PIT-AXIS` / `FSN-BRICK-WAKE` / `FSN-VOID-DWELL` / `FSN-CINDER-MARK` stay theirs. Extra room `spike_aisle` is **not** this family.
- Do **not** pack `screen_biter` with `axis_biter` / `foe_biter` / `side_biter` / `lone_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` as a PAIR (Bresenham **blocked** bonus vs shares **rank or file with the caster** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs handler-on-**rank-or-file** with a **pet**). `FSN-PIT-AXIS` / `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs.
- Do **not** pack `swap_marker` with `shove_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (**teleport landing** consume vs **force-move landing** consume vs start-turn occupy consume vs end-turn occupy vs cell-enter vs start-turn leftover-pair vs start-turn tied-≥1 vs start-turn leftover-sum vs unit walk-MP wick vs first leave vs tile bomb). `FSN-SHOVE-DRIFT` / `FSN-POISE-GATE` / `FSN-BRICK-WAKE` stay theirs. Extra room `swap_pulpit` is **not** this family. Walk-on is **safe**.
- Do **not** pack `odd_plater` with `spent_plater` / `gait_plater` / `own_plater` / `off_plater` / `mid_hooder` / `sidestep_warder` / `poise_hooder` as PAIR / `tally_hooder` as PAIR / `odd_holder` as PAIR / `odd_stinger` as PAIR (next hit 0 **while leftover AP is odd** vs leftover AP ≥ 1 vs leftover **MP ≥ 1** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs exactly-2 miss vs any-range skip vs leftover **AP === MP ≥ 1** vs leftover **sum === 3** vs leftover-AP-odd **walk lock** vs leftover-AP-odd **poke**). `FSN-SPENT-FULL` / `FSN-GAIT-WATCH` stay theirs. `FSN-ODD-COURT` is plate + absorb; `/STING` is the 3-body.
- Do **not** pack `mire_skipper` with `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` as a PAIR (1-tile **mire** enter-tax skip vs rime leave-tax vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy). `FSN-RIME-FILE` / `FSN-GLYPH-FULL` / `FSN-CINDER-FULL` / `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs. Extra room `mire_nave` is **not** this family.
- Do **not** pack `summon_verser` with `summon_caster` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `verse_tallier` as PAIR (pets pay **AP** to **recast last id** vs pets pay **AP** to start a **spell** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay vs hostile last-id **illegal**). `FSN-TALLY-HOLD/KENNEL` is Verse Kennel, never a two-pet PAIR. `FSN-POISE-HOLD/KENNEL` / `FSN-GAUNT-HOLD/KENNEL` / `FSN-LEAN-HOLD/TOLL` stay theirs.
- Do **not** pack `equal_gifter` with `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` as a PAIR. `FSN-TALLY-STEP` stays both-bodies leftover-sum===3. `FSN-POISE-STEP` stays both-bodies tied-≥1. Equal Gift is **target-only** tied ≥ 1. Do **not** invent `equal_cantor`.
- Do **not** pack `cast_toller` with `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` / `summon_toller` as PAIR / `walk_toller` as PAIR (Struck-last-turn next-**spell** +1 AP vs Struck-last-turn next-**walk** +1 vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1 vs pet-walk AP vs caster-walk tax). `FSN-STRIKE-TAX` / `FSN-DEBT-ORBIT` / `FSN-SPENT-CRACK` stay theirs. CADRE `FSN-PRIME-TAX` is the three-body lesson (Prime + Cast Toll + scribe), never Cast-Toll+Scribe PAIR.
- Do **not** pack `brick_stepper` with `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `tally_stepper` as PAIR (step **through** an adjacent barrier vs push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras vs leftover-sum relocate). `FSN-POISE-HOLD/NUDGE` / `FSN-DEBT-ORBIT` / `FSN-GAIT-WATCH/GUN` / `FSN-BRICK-WAKE` stay theirs. `FSN-SWAP-BRICK` owns the peek, never Step+Nudge PAIR.
- Do **not** pack `watch_banker` with `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR (snap **banks** walker leftover AP vs snap **steals** walker leftover AP vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-WATCH-SIP` / `FSN-GAIT-WATCH` / `FSN-OWN-WATCH` / `FSN-OFF-FEE` stay theirs. `FSN-WATCH-BANK/GUN` is Watch Bank Hunt, never Bank+Gun PAIR.
- Do **not** pack `tied_gaiter` with `pair_gaiter` / `lone_gaiter` / `pair_purser` / `full_gaiter` / `poise_stinger` / `tally_stinger` / `equal_gifter` as a PAIR (leftover AP **and** leftover MP **exactly 2** poke vs leftover **MP** exactly 2 vs leftover MP exactly 1 vs leftover **AP** exactly 2 vs leftover MP ≥ 3 +RES vs tied-≥1 poke vs leftover-sum poke vs target-tied-≥1 **heal**). `FSN-PAIR-GIFT` / `FSN-LONE-HAZARD` / `FSN-POISE-SIP` stay theirs.
- Do **not** pack `portal_cutter` with `hazard_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `null_censor` as a PAIR (bonus vs **world portal** Chebyshev ≤ 2 vs **painted hazard** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs Weaken/Expose). `FSN-LONE-HAZARD` / `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs. Twin Gate pads do **not** count.
- Do **not** pack `shove_gifter` with `drift_gifter` / `heave_mender` / `equal_gifter` / `tally_mender` / `hollow_gifter` / `still_gifter` / `poise_mender` / `gaunt_mender` / `pale_cantor` as a PAIR (**this caster** force-moved the target vs **anyone’s** force-move vs **both** force-moved vs target-tied-≥1 vs leftover-sum vs target-empty vs walk-spent=0 vs tied-≥1 four leftover vs leftover-both-0 vs unconditional). `FSN-SHOVE-DRIFT` stays anyone-forced. `FSN-EQUAL-SHOVE` is the 3-body.
- Do **not** pack `purse_turner` with `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR (one-hostile leftover AP↔MP invert vs two-body leftover **cross** vs **tile** swap vs leftover **bank**). CADRE `FSN-CROSS-POISE` stays the 3-body cross. `FSN-PURSE-TALLY` is the 3-body invert.
- Drop 4–16 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two four-flag **sum===3** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals; no two leftover-sum heals).

Wave 17 families do **not** exist yet. Same-day 2026-10-24 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-24.md`, open as PR #1011) and SDE Wave 15 unique CORE (`spell-file-stride` … `spell-far-fold`, PR #962, **except** Pack Diag / Far Fold unless a later boss sheet claims them) stay Wave **17** family CORE. Do **not** mint `FSN-*` ids that require those Wave 17 families in this drop. Cadence Floor is **already owned** by SDE #906. Cadence Rise is **already owned** by SDE #962. Cadence Prime is **this** drop. Cadence Snuff is Wave 17.

Court Prime / Pack Rank / Rank Fold / Court Snuff / Hendeca Span stay **boss / closed-class / later family**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend (Hollow Gift is **target-only** both-pools; Poise Mend is **both bodies tied ≥ 1**; Tally Mend is **both bodies leftover sum === 3**). Do **not** clone Equal Gift as Poise Mend (Equal Gift is **target-only** tied ≥ 1). Do **not** clone Purse Turn as Bar Cross (Purse Turn is **one** hostile invert; Bar Cross is two-body **cross**). Do **not** clone Watch Bank as Watch Sip (Bank **grants a leftover-AP bank**; Sip **steals**).

**Do not spawn Tally Mend / Tally Sting / Tally Step / Tally Sill / Tally Hold / Tally Lend / Tally Sip / Tally Post / Tally Bounce / Must Tally / Verse Tally / Tally Hood / Odd Plate / Odd Sting / Equal Gift / Tied Gait / Purse Turn sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Sum is integer leftover AP + leftover MP. Equality is integer `===`. Missing field → Tally Mend / Tally Sting / Equal Gift / Purse Turn pay **0** extra or skip (fail closed). Until those writers land, show `FSN-POISE-STEP` / `FSN-POISE-SIP` / `FSN-GAUNT-STEP` / `FSN-CROSS-POISE` instead of the matching Wave 16 id.

**Do not spawn Verse Tally / Summon Verse sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Tally fizzles (fail closed). Forced-move does **not** peel Verse Tally. `0 = 0` does **not** lift. `2 = 2` does **not** lift. Until that writer lands, show `FSN-POISE-CHOIR` instead of `FSN-TALLY-CHOIR`.

**Do not spawn Cast Toll sheets until a battle-walk writer snapshots `struckThisTurn` at turn end.** Spell last turn does not arm Cast Toll. Walk last turn does not arm Cast Toll. Teleport / Swap / Tally Step / Brick Step do not pay. Until that writer lands, show `FSN-STRIKE-TAX` instead of `FSN-PRIME-TAX`.

**Do not spawn Shove Gift sheets until battle force writes `forcedMovedThisTurn` and a caster-authored bit.** Walk / Swap / Twin Gate / Tally Step / Brick Step / Poise Step / Gaunt Step / Home Step do **not** set the flag. Anyone-forced is Drift Gift (`FSN-SHOVE-DRIFT`). Until that writer lands, show `FSN-SHOVE-DRIFT` instead of `FSN-EQUAL-SHOVE`.

**Do not spawn Dec Plug until `inferSummonArchetype` keys `summonAI === "decspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 10.** Live cap is 2. Name heuristics stay a bug. Dec fills the stationary-post **and** the multi-cell-system cap (10). Every cell of the 2×5 stays occupied. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost/ninespan/tallypost onto that body.

**Do not spawn Tally Post sheets until `inferSummonArchetype` keys `summonAI === "tallypost"` and remaining cap ≥ 1.** End-turn occupy with leftover sum ≠ 3 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window). Only leftover-sum===3 end-turn occupy detonates.

**Tally Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Spike Reel is the **ninth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit, then **spike occupancy**). Dest is **toward**, not onto, a world portal. Brick Step **relocates through** an adjacent barrier — not a unit bash, not Brick Nudge, not `isSwap`. Swap Mark detonates on **teleport landing**; walk / push / pull / slide do **not**.

Wave 16 adds **zero** facing CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop.

---

## Grounding (live, 2026-10-25)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–16. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Tally Step is occupancy dest, **not** `isSwap`. Spike Reel is the ninth **cast** caller of attract. Brick Step is a through-barrier relocate, not `applyPushback` on a unit and not Brick Nudge. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 16 CORE rows stay `mpCost: 0`. Tally Sip / Tally Lend / Purse Turn / Watch Bank rewrite **current leftover AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` | **Absent** — Tally / Equal Gift / Purse Turn / Verse Tally / Summon Verse / Cast Toll / Shove Gift / Tied Gait / Odd Plate fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / ninespan / poisepost / **tallypost** / **decspan** bodies **replace** the random overlay. Cap one of those engines. Dec Span **is** the 10-cell 2×5 post and needs remaining cap ≥ 10.
3. Any `healAmount` steals healer. **Tally Mend / Equal Gift / Shove Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Primer, Toller, Watcher, Cutter, Turner, Verser, or Bouncer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Tally Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Tally Mend / Hollow Gift / Equal Gift / Drift Gift / Shove Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 16 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Tally Sip / Watch Bank / Purse Turn / Tally Lend rewrite current leftover AP/MP.
6. `inferSummonArchetype` must key `summonAI === "decspan"` **and** `"tallypost"` **before** any Dec / Tally-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Step that **walks through** an already planted barrier (it does not mint a new one from empty floor, and dest occupancy skip is mandatory). Tally Hold / Must Tally / Verse Tally / Penta Oath / Rank Stride are **not** `instantKill`.
8. Tally-step dest / spike-reel dest / tally-post plant / dec plant / brick-step dest: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Tally Step into a wall is a fizzle (no crush). Spike Reel dest must leave a walk-off that is **not** the spike cell **and not** a world portal. Brick Step dest must be empty, in-bounds, non-portal, immediately beyond the adjacent barrier, and `findPath` after the hypothetical relocate must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip / Tally Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Tally Sip **or** one Watch Sip source per pack, not both stacking past that cap. Watch Bank **banks** leftover AP; it is not a steal and does not stack with Dual Keep (Dual Keep wins). Tally Hold is a **walk lock with a leftover-sum key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise + Tally Hold + Must Tally on the same AP bar.
10. Walk-spend: Tally Step / Spike Reel / Tally Post plant / Brick Step / Dec plant **do not** increment `walkMpSpentThisTurn`. Equal Gift / Tally Mend gate leftover pools, not walk-spend.
11. Last-id: Verse Tally / Summon Verse **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Tally. Dual Keep leftover **is** leftover; `0 = 0` does **not** lift; `2 = 2` does **not** lift.
12. Struck-last-turn: Cast Toll **fail closed** until `struckThisTurn` exists. Spell last turn does **not** arm it. Walk last turn does **not** arm it. Teleport / Swap / Tally Step / Brick Step do not pay.
13. Force-move: Shove Gift **fail closed** until `forcedMovedThisTurn` **and** a caster-authored bit exist. Walk / Swap / Tally Step / Brick Step do **not** set it. Anyone-forced remains Drift Gift.

### Relative difficulty (same grades as drops 1–16)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…16 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a leftover-sum tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss / a leftover-AP-odd miss / a remaining-0 tell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / stepper / warder): pack median + one step.
- Backliner (tally-mend / equal-gift / shove-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / primer / watch / turn): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer, optic): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 17)

Drop 1–16 overlays still apply. These are **additional jobs** for Wave 16 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-TALLY-MEND` | `queen` **with** heal | proposed `tally_mender` | `spell-tally-mend`, `starter-shield` | healer; skip if either leftover sum ≠ 3 or missing HP < 8; Dual Keep 2/2 is **Poise, skip**; extra door `tally_cantor` is **not** this family |
| `ROLE-DEC` | `rook` **without** heal | proposed `dec_prelate` | `physical_attack`, `spell-dec-span` | `isSummoner` for dec only; post `summonAI: "decspan"`, axis-aligned 2×5, empty kit, remaining cap ≥ 10; skip if any of ten cells blocked; every cell occupied |
| `ROLE-PURSE-TURN` | `queen` **without** heal | proposed `purse_turner` | `starter-frost`, `spell-purse-turn` | controller; skip if leftover AP === leftover MP (no-op); invert one hostile leftover AP↔MP; **not** Bar Cross / Dual Keep / tile Swap |
| `ROLE-TALLY-HOOD` | `knight` **without** heal | proposed `tally_hooder` | `starter-shield`, `spell-tally-hood` | guardian; skip if leftover sum ≠ 3; any-range miss while sum === 3; consume on miss |
| `ROLE-TALLY-STING` | `pawn` **without** heal | proposed `tally_stinger` | `physical_attack`, `spell-tally-sting` | flanker; skip if leftover sum ≠ 3 unless 10 still kills; Dual Keep **opens** the 8 only on (2,1)/(1,2)/(3,0)/(0,3) |
| `ROLE-TALLY-STEP` | `queen` **without** heal | proposed `tally_stepper` | `starter-frost`, `spell-tally-step` | protector; skip if ally leftover sum ≠ 3 or no free adj; relocate, **not** `isSwap` |
| `ROLE-TALLY-SILL` | `rook` **without** heal | proposed `tally_siller` | `starter-frost`, `spell-tally-sill` | setter; skip if occupant leftover sum already ≠ 3; occupant leftover-sum===3 at **start of their turn** takes 8; paint stays |
| `ROLE-TALLY-HOLD` | `knight` **without** heal | proposed `tally_holder` | `physical_attack`, `spell-tally-hold` | controller; skip if leftover sum ≠ 3; cannot walk while leftover-sum===3; spells stay legal; **never PAIR with Must Tally** |
| `ROLE-TALLY-LEND` | `bishop` **without** heal | proposed `tally_lender` | `starter-frost`, `spell-tally-lend` | buffer; skip if ally leftover sum ≠ 3; +1 current AP **and** +1 current MP (**exits** to sum 5) |
| `ROLE-TALLY-SIP` | `pawn` **without** heal | proposed `tally_sipper` | `physical_attack`, `spell-tally-sip` | flanker; skip if leftover sum ≠ 3 **or** leftover AP = 0; steal 1 leftover AP; (0,3) fizzles |
| `ROLE-TALLY-POST` | `pawn` **without** heal | proposed `tally_prelate` | `physical_attack`, `spell-tally-post` | `isSummoner` for tallypost only; post `summonAI: "tallypost"`, remaining cap ≥ 1; end-turn leftover-sum===3 occupy detonates; walk-on / dump-a-pool / 2/2-safe |
| `ROLE-TALLY-BOUNCE` | `queen` **without** heal | proposed `tally_bouncer` | `starter-frost`, `spell-tally-bounce` | artillery; skip bounce without a second leftover-sum===3 hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-TALLY` | `knight` **without** heal | proposed `must_tallier` | `physical_attack`, `spell-must-tally` | controller; skip if leftover sum ≠ 3; non-Strike illegal unless leftover-sum===3 **and** last AP; Strike stays legal; **never PAIR with Tally Hold** |
| `ROLE-VERSE-TALLY` | `bishop` **without** heal | proposed `verse_tallier` | `starter-frost`, `spell-verse-tally` | controller; skip if no `lastResolvedSpellId`; leftover sum === 3 peels; `0 = 0` does **not**; `2 = 2` does **not**; shove does **not** |
| `ROLE-RANK-STRIDE` | `knight` **without** heal | proposed `rank_warder` | `physical_attack`, `spell-rank-stride` | controller; skip if player MP = 0 or no legal same-rank floor; next walk dest shares **rank** (`dest.y == y_at_arm`); extra room `rank_gallery` is **not** this family |
| `ROLE-PENTA-OATH` | `bishop` **without** heal | proposed `penta_oather` | `starter-frost`, `spell-penta-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 5; Strike stays legal; extra room `penta_nave` is **not** this family |
| `ROLE-SPIKE-REEL` | `bishop` **without** heal | proposed `spike_reeler` | `starter-frost`, `spell-spike-reel` | caster; skip if no spike occupancy in 6; dest is **toward**, not onto; ninth `applyAttract` flavor; extra room `spike_aisle` is **not** this family |
| `ROLE-SCREEN-BITE` | `knight` **without** heal | proposed `screen_biter` | `physical_attack`, `spell-screen-bite` | flanker; skip rider if Bresenham is clear unless 10 still kills; 10 + 10 if a wall **or** barrier sits on Bresenham; Dummy Post is not cover |
| `ROLE-SWAP-MARK` | `bishop` **without** heal | proposed `swap_marker` | `starter-frost`, `spell-swap-mark` | setter; skip if no teleport tool in the pack **or** player kit; 0 on cast; teleport landing detonates and consumes; walk-on is **free**; extra room `swap_pulpit` is **not** this family |
| `ROLE-ODD-PLATE` | `rook` **without** heal | proposed `odd_plater` | `starter-shield`, `spell-odd-plate` | guardian; skip if leftover AP already even; leftover AP odd miss; leftover AP even at impact **lands** and charge **stays** |
| `ROLE-MIRE-SKIP` | `knight` **without** heal | proposed `mire_skipper` | `physical_attack`, `spell-mire-skip` | flanker; skip if the next walk is not a 1-step across mire; rime/lava/spike/glyph still tick; length ≥ 2 pays; extra room `mire_nave` is **not** this family |
| `ROLE-ODD-STING` | `pawn` **without** heal | proposed `odd_stinger` | `physical_attack`, `spell-odd-sting` | charger; skip rider if leftover AP is even unless 10 still kills; leftover AP 0 is even |
| `ROLE-SUMMON-VERSE` | `king` **without** heal | proposed `summon_verser` | `starter-frost`, `spell-summon-verse` | controller; skip if no allied summon; pets pay +1 AP to **recast last id**; first cast of any id is free; drop if `summonAI` empty |
| `ROLE-EQUAL-GIFT` | `queen` **with** heal | proposed `equal_gifter` | `spell-equal-gift`, `starter-shield` | healer; skip if target leftover AP ≠ leftover MP **or** leftover AP = 0 or missing HP < 10; caster leftover unread; **not** Tally / Poise / Hollow |
| `ROLE-CAST-TOLL` | `bishop` **without** heal | proposed `cast_toller` | `starter-frost`, `spell-cast-toll` | controller; skip if they only spelled or walked last turn; next **spell** +1 AP if they **Struck**; Strike still costs 2 |
| `ROLE-BRICK-STEP` | `knight` **without** heal | proposed `brick_stepper` | `physical_attack`, `spell-brick-step` | flanker; skip if no adjacent barrier **or** dest occupied/hazard; relocate through barrier, barrier **stays**; not Nudge, not `isSwap` |
| `ROLE-WATCH-BANK` | `bishop` **without** heal | proposed `watch_banker` | `starter-frost`, `spell-watch-bank` | artillery; skip if Dual Keep already covers them **or** no overwatch is armed; snap still deals; **walker** leftover AP **+1 bank**; **not** Watch Sip |
| `ROLE-TIED-GAIT` | `pawn` **without** heal | proposed `tied_gaiter` | `physical_attack`, `spell-tied-gait` | flanker; skip if leftover AP is not exactly 2 **or** leftover MP is not exactly 2 unless 10 still kills |
| `ROLE-PORTAL-CUT` | `pawn` **without** heal | proposed `portal_cutter` | `physical_attack`, `spell-portal-cut` | flanker; skip rider if target is Chebyshev > 2 from every `map.portals` cell; Twin Gate pads do **not** count |
| `ROLE-SHOVE-GIFT` | `queen` **with** heal | proposed `shove_gifter` | `spell-shove-gift`, `starter-shield` | healer; skip if **this caster** did not force-move the target or missing HP < 10; walk / Swap / Tally Step do **not** count |
| `ROLE-CADENCE-PRIME` | `bishop` **without** heal | proposed `cadence_primer` | `starter-frost`, `spell-cadence-prime` | controller; skip if every remaining is already > 0; remaining `n===0` → `1`; ones stay 1; `n>1` unchanged; extra door `prime_precentor` is **not** this family |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) / `ROLE-MIST` (`mist_walker`) / `ROLE-OPTIC` (`dim_optic`) / `ROLE-PLATE` (`plate_warden`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Primer, Tally-Mend, Equal-Gift, Shove-Gift, Dec, or Tally-Post.

### Fair-fight rules (every sheet)

Same as drops 1–16, plus Wave 16:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Tally Post never detonates on leftover sum ≠ 3.
- Swap / pull / push / tally-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Tally Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack. Watch Bank is a leftover-AP **bank**, not a steal.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Tally Bounce / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Tally Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine **or** tallypost **or** dec — never two engines). Dec is illegal until remaining cap ≥ 10.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Step **must** skip if dest is occupied / hazard / portal, or if `findPath` after a hypothetical relocate would not reach an exit. Never seal the last aisle.
- Dual Keep **opens** Poise on 2/2 or 1/1, **opens** Tally on (2,1)/(1,2)/(3,0)/(0,3), and **closes** Gaunt / Hollow Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold a leftover **sum of 3** for Tally.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-TALLY-STEP` | PAIR | leftover-sum===3 healer + leftover-sum===3 joiner | this drop |
| `FSN-TALLY-SIP` | PAIR | leftover-sum===3 poke + leftover-sum leftover-AP steal | this drop |
| `FSN-RANK-PENTA` | PAIR | next walk same-rank + next-spell exact 5 | this drop |
| `FSN-SPIKE-SCREEN` | PAIR | pull toward spike + Bresenham-blocked bite | this drop |
| `FSN-TALLY-GATE` | CELL | leftover-sum===3 post + start-turn leftover-sum===3 sill | this drop |
| `FSN-ODD-COURT` | CELL | leftover-AP-odd miss + absorb plate | this drop |
| `FSN-MIRE-FILE` | CELL | 1-tile mire skip + ice kiter | this drop |
| `FSN-WATCH-BANK` | CELL | overwatch snap banks leftover AP + optic | this drop |
| `FSN-TALLY-CHOIR` | BRIGADE | leftover-sum===3 heal + last-id until leftover-sum===3 + ignite | this drop |
| `FSN-EQUAL-SHOVE` | BRIGADE | target-tied-≥1 heal + caster-authored force heal + bash | this drop |
| `FSN-TALLY-QUIET` | BRIGADE | tally step + tally mend + cover | this drop |
| `FSN-PURSE-TALLY` | BRIGADE | hostile leftover invert + leftover-sum===3 heal + leftover-sum===3 sting | this drop |
| `FSN-TIED-PORTAL` | CADRE | leftover exact 2/2 poke + world-portal threshold poke + reflect | this drop |
| `FSN-PRIME-TAX` | CADRE | remaining 0→1 + Struck-last-turn spell tax + glyph tax | this drop |
| `FSN-SWAP-BRICK` | CADRE | teleport-landing paint + through-barrier peek + mist step | this drop |
| `FSN-TALLY-HOLD` | COURT | walk-until leftover-sum===3 + tools-until leftover-sum===3 **and** last AP + warden | this drop |

Named packs as variants: `FSN-TALLY-GATE/STING` (Tally Gate full), `FSN-SPIKE-SCREEN/GLYPH` (Spike Screen full), `FSN-RANK-PENTA/GUN` (Rank Penta full), `FSN-ODD-COURT/STING` (Odd Court full), `FSN-MIRE-FILE/LEY` (Mire File full), `FSN-WATCH-BANK/GUN` (Watch Bank Hunt full), `FSN-TALLY-QUIET/LEND` (Lend Hood escort), `FSN-TALLY-HOLD/DEC` (Dec Plug — skip until remaining cap ≥ 10; live cap is 2), `FSN-TALLY-HOLD/BOUNCE` (Bounce Tally leftover-sum), `FSN-TALLY-HOLD/KENNEL` (Verse Kennel), `FSN-TALLY-HOLD/SCREEN` (Rank Screen leftover-tied).

---

## Formations

### FSN-TALLY-STEP

FORMATION_ID: `FSN-TALLY-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-TALLY-MEND` — `queen` **with** heal / proposed `tally_mender` — pack median — back
- `ROLE-TALLY-STEP` — `queen` **without** heal / proposed `tally_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Tally Mend is a heal kit; kit band 0 has no heal). Show `FSN-POISE-STEP` instead (four leftover-tied tell without the leftover-sum 8).
- Mender kit: Tally Mend + Shield. **No** Inferno, no Enrage, no Poise / Gaunt / Hollow / Equal / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `tally_cantor` is **not** this family.
- Stepper kit: Tally Step + Frost. **No** Poise / Gaunt / Parched / Home / Heave / Ally / Brick Step / Cover on PAIR (those are `FSN-TALLY-QUIET` / `FSN-SWAP-BRICK`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-POISE-STEP` **or** `FSN-GAUNT-STEP` (player has seen leftover **AP === MP ≥ 1** heal **or** leftover-both-0 heal; this sheet cashes leftover **AP + MP === 3** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Tally Mend (8 HP) pays only if **caster and target** leftover AP + leftover MP **=== 3** after the 3 AP is paid. Legal pairs (3,0) (0,3) (2,1) (1,2). Dual Keep 2/2 is Poise — Shield queen. Dual Keep 0/0 is Gaunt — Shield queen.
- Tally Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover sum === 3. It is not Poise Step, not Gaunt Step, and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover sum === 3; if the Mender is still 2/2 or 0/0, Stepper Frosts.
- Mender Tally-Mends only if both leftover sums === 3 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Poise Mend or Gaunt Mend.

SYNERGY:

- Leftover-sum===3 healer + leftover-sum===3 joiner. Wave 15 Poise Step standing on the **odd-sum** leftover window. Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP so the sum leaves 3 — or Dual Keep 2/2 — is a complete answer.

PLAYER_THREAT:

- Slow refill if you Dual Keep (2,1) or (0,3) on **both** bodies. Spike is low. Misplay is Rooting neither and holding leftover-sum 3 into an 8 that just landed.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to leave sum 3. Dual Keep 2/2 (Poise window, not this one). Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a leftover-sum ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced Dual Keep + leftover-sum heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 3.
- Stepper: protector; skip if ally leftover sum ≠ 3 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-TALLY-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-TALLY-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-TALLY-SIP

FORMATION_ID: `FSN-TALLY-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-TALLY-STING` — `pawn` **without** heal / proposed `tally_stinger` — pack median or −1 — starts wide
- `ROLE-TALLY-SIP` — `pawn` **without** heal / proposed `tally_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-POISE-SIP` (leftover **AP === MP ≥ 1** poke + tied leftover-AP steal) and `FSN-GAUNT-SIP` (leftover **AP = 0 and leftover MP = 0** poke + leftover-MP=0 AP steal). Pressure is the **leftover-sum===3** window: leftover AP + leftover MP === 3. Dual Keep **opens** both riders on (2,1)/(1,2)/(3,0); (0,3) opens Sting and **fizzles** Sip.
- Band 0: Stinger Strike only; Sipper Strike only (Tally Sting / Tally Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-POISE-SIP`.
- Elite: Stinger only. Sipper never gets Poise Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-POISE-SIP` **or** `FSN-TALLY-STEP` (player has seen leftover-tied as a resource **or** the leftover-sum heal).
- Full Sting / Lone Gait / Tied Gait / Odd Sting / Ready / Pair Gait stay off PAIR (PAIR bans). Tally Hold stays off (that is `FSN-TALLY-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Tally Sting: 10, +8 iff **target** leftover AP + leftover MP === 3. Dual Keep leftover **opens** the 8 on leftover-sum 3. `2 = 2` is Poise Sting’s window, not this one. `0 = 0` is Gaunt Sting’s window, not this one.
- Tally Sip: steal 1 leftover AP iff leftover sum === 3 **and leftover AP ≥ 1**. (2,1) → (1,1) manufactures Poise. (3,0) → (2,0) off every named window. (1,2) → (0,2). (0,3) fizzles. Inverse of Tally Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover sum === 3 and leftover AP ≥ 1; else Strikes.
- Stinger lurks at 3 and commits when leftover sum === 3 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Leftover-sum poke + leftover-sum leftover-AP steal. Wave 15 Poise Sip standing on the **odd-sum** leftover window. Combination, not a new sprite.

PLAYER_THREAT:

- Getting leftover-sum Stung, then Sipped off (2,1) into a Poise window you did not ask for. Spike is one 18. Recoverable: sit (0,3), sit 2/2, dump a pool.

COUNTERPLAY:

- Hold leftover MP only (0,3) — Sip fizzles, Sting still fires so **dump MP too**. Dual Keep 2/2 (Poise, not this). Spend 1 leftover AP off (2,1). Kill the Stinger (glass). The Sipper without leftover-sum is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit.
- No Thorned Ground on the only path to the Sipper.

AI_REQUIREMENTS:

- Stinger: flanker; skip if leftover sum ≠ 3 unless 10 still kills.
- Sipper: flanker; skip leftover AP = 0.
- Soph 1–2.

VARIANTS:

- `FSN-TALLY-SIP/E-STING` — elite Stinger, still no Watch Sip on PAIR.
- `FSN-TALLY-GATE/STING` is the CELL with Post — do not merge.

STATUS: PROPOSED

---

### FSN-RANK-PENTA

FORMATION_ID: `FSN-RANK-PENTA`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-RANK-STRIDE` — `knight` **without** heal / proposed `rank_warder` — pack median + 1 — owns one open rank
- `ROLE-PENTA-OATH` — `bishop` **without** heal / proposed `penta_oather` — pack median — next-spell exact 5

VARIANT_RULES:

- Distinct from `FSN-KNIGHT-QUAD` (next walk **(2,1)** + next-spell exact **4**) and `FSN-EVEN-ORTH` (orthogonal-only + even-Chebyshev miss). This sheet is **same-rank walk** plus **exact Chebyshev 5**. Strike stays legal on both bodies.
- Band 0: both Frost / Strike only; the AI contract still refuses off-rank walks and off-5 spells even before the clone ids exist.
- Band 1: Warder may hold Slow. Oather may hold Slow. Never Inferno. Never Knight Stride / Quad Oath / Rank Lancer on PAIR (PAIR bans). Extra rooms `rank_gallery` / `penta_nave` are **not** these families.
- Elite: Warder only. Oather stays junior so two geometry elites cannot pin.
- Unlock after `FSN-KNIGHT-QUAD` **or** `FSN-ORTH-TRI` (player has seen a next-walk geometry **or** an exact-Chebyshev oath).
- If the map has no 5-tile open rank, **reroll this id**.
- `proposed:spell-file-lance` stays off PAIR (that is `FSN-TALLY-HOLD/DEC` / Rank Lancer COURT).

SPELL_POOL_INTERACTIONS:

- Rank Stride: next walk dest must share rank (`dest.y == y_at_arm`). Length is free. File-advance confirm-fails (MP not spent). Blink / Swap / Tally Step still legal.
- Penta Oath: next non-Strike confirms only at Chebyshev exactly 5. Strike stays legal at any range. Walk to 4 after arm → fizzle (AP not spent for the fizzled spell).
- No Root (that would hide the walk-geometry lesson).

TACTICAL_PLAN:

- Warder arms Rank Stride then walks same-rank. Oather arms Penta Oath then Frosts only if the player sits at 5; else holds.
- Neither body Roots. Neither body also Strides the file.

SYNERGY:

- Same-rank walk + exact-5 spell. Wave 15 Knight Quad standing on a **different** walk geometry and a **longer** oath. Combination, not a new sprite. Step to another rank **or** sit at 4 is a complete answer.

PLAYER_THREAT:

- Readable geometry. Misplay is sharing the rank “for one Frost” then sitting at 5. Recoverable: step off-rank, walk to 4, Strike.

COUNTERPLAY:

- Never share a rank. Sit at 4 or 6. Occupy the only same-rank approach. Blink. Kill the Oather (hp ~0.75). If only the Warder lives, this is a same-rank walk tax without a gun.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with **one 5-tile rank plus a gallery**. Reject a single-tile tunnel (rank + forced melee is a lock).
- No Barrier already occupying the rank at spawn (player Barrier during the fight is the intended cut).

AI_REQUIREMENTS:

- Warder: controller; skip if no legal same-rank floor; never also Knight Stride / Orth / Diag.
- Oather: controller; skip if they cannot reach 5; Strike stays legal.
- Soph 1–2.

VARIANTS:

- `FSN-RANK-PENTA/GUN` — BRIGADE **Rank Penta full**: add `ROLE-SNIPER` (`glass_sniper`). Snipe from 5. Still one Slow source. Unlock after this PAIR. Sniper minRange 3; never Mark on the teaching PAIR.
- `FSN-RANK-PENTA/E-RANK` — elite Warder, still no Lancer on PAIR.
- `FSN-TALLY-HOLD/SCREEN` remains Rank Screen COURT; do not merge.

STATUS: PROPOSED

---

### FSN-SPIKE-SCREEN

FORMATION_ID: `FSN-SPIKE-SCREEN`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SPIKE-REEL` — `bishop` **without** heal / proposed `spike_reeler` — pack median — pull toward spike occupancy
- `ROLE-SCREEN-BITE` — `knight` **without** heal / proposed `screen_biter` — pack median — Bresenham-blocked poke

VARIANT_RULES:

- Distinct from `FSN-PIT-AXIS` (pull toward **pit** + caster-axis bite) and `FSN-BRICK-WAKE` (pull toward **barrier**). This sheet is **spike occupancy** attract plus **cover-bonus** poke. Spikes are map-modifier occupancy, **not** painted pits and **not** `map.portals`.
- Band 0: both Frost / Strike. Band 1: Reeler Slow. Biter Mark. Never Inferno. Never Pit Reel / Axis Bite / Wall Bite on PAIR (PAIR bans). Extra room `spike_aisle` is **not** this family.
- Elite: Biter only. Reeler stays junior so two displacement elites cannot pin.
- Unlock after `FSN-PIT-AXIS` **or** `FSN-BRICK-WAKE` (player has seen an attract dest **or** a cover poke).
- If the map has no spike occupancy in Chebyshev 6 of a legal floor, **reroll this id**.
- Dest must leave a walk-off that is **not** the spike cell **and not** a world portal. Do not ship until the ninth `applyAttract` dest exists.

SPELL_POOL_INTERACTIONS:

- Spike Reel: linear LoS, 1-step toward nearest spike occupancy. Adjacent = immune (same as Hook). Empty board fizzles (AP spent).
- Screen Bite: 10, +10 if a wall **or** barrier sits on Bresenham. Clear LoS → 10 only. Reads occupancy, never names. Dummy Post is not cover.
- Frost after a reel is a tax, not a root.

TACTICAL_PLAN:

- Reeler Reels only when Chebyshev ≥ 2, ray clear, landing is **not** safer for the player, and a walk-off remains.
- Biter walks a flank that puts a pillar on Bresenham, then Bites. It does not destroy the screen it is using.
- Never turn-1 double displace onto one tile.

SYNERGY:

- Pull toward spike + bite through the barrier that sits on Bresenham. Wave 15 Pit Axis standing on a **different** attract dest and a **cover** poke instead of an axis poke.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got reeled toward spikes, then bit through the pillar.” Recoverable: hug the Reeler (immune), keep a tile behind you, walk into LoS.

COUNTERPLAY:

- Stand adjacent to the Reeler. Break LoS. Occupy the toward-tile. Walk into sight so Screen Bite is 10. Spike Skip if you own it. Kill the Reeler (hp ~0.80).

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **spike occupancy plus a pillar / barrier 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze` (reel + bite in a hallway is a lock).
- No Void Rift tile as a legal landing. No lava dest. No world-portal dest.

AI_REQUIREMENTS:

- Reeler: caster + attract legality (landing walkable, not hazard, not portal, player retains ≥ 1 escape, skip if landing is safer).
- Biter: flanker; skip rider if Bresenham is clear unless 10 still kills; never destroy the screen.
- Soph 2–3.

VARIANTS:

- `FSN-SPIKE-SCREEN/GLYPH` — BRIGADE **Spike Screen full**: add `ROLE-GLYPH` (`glyph_sower`). Mark a step-off cell on the toward-tile. Still one Inferno cadence (none on BASE). Unlock after this PAIR.
- `FSN-SPIKE-SCREEN/E-BITE` — elite Biter, still no lava dest.

STATUS: PROPOSED

---

### FSN-TALLY-GATE

FORMATION_ID: `FSN-TALLY-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-TALLY-POST` — `pawn` **without** heal / proposed `tally_prelate` — pack median — leftover-sum===3 end-turn occupy
- `ROLE-TALLY-SILL` — `rook` **without** heal / proposed `tally_siller` — pack median — leftover-sum===3 start-turn occupy

VARIANT_RULES:

- Distinct from `FSN-POISE-GATE` (tied-≥1 post + start-turn tied-≥1 sill) and `FSN-GAUNT-GATE` (leftover-both-0 occupy). Pressure is leftover **sum === 3** occupy at **two different times of day**. Walk-on is **safe** for the post. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window).
- CELL: one post, one sill, two different tiles. Prelate cap 1 live post. Siller will not stack two sills on one cell.
- Elite: Siller only. Prelate stays junior so two hidden occupy elites cannot pin.
- Unlock after `FSN-TALLY-SIP` **or** `FSN-POISE-GATE` (player has seen leftover-sum as a resource **or** a leftover-gated post).
- Do not ship until `summonAI === "tallypost"` (name heuristics stay a bug). Remaining cap ≥ 1.
- Mark as decoy is BRIGADE (`FSN-TALLY-GATE/STING`). Inferno stays off.

SPELL_POOL_INTERACTIONS:

- Tally Post: end-turn occupy deals if leftover AP + leftover MP === 3; **walk-on does not**. Teleport landing does **not** (that is Swap Mark). Spend a pool before turn end is a complete answer.
- Tally Sill: start-of-their-turn occupy deals if leftover sum === 3; paint stays. Spend overnight is a complete answer. Barrier last-writer fills the paint.
- Do not also attach Slow (that is a third leftover story).

TACTICAL_PLAN:

- Prelate plants a post on a **flank choke**, never the only tile that reaches the Siller, never the only exit.
- Siller paints a **different** tile the player will occupy at dawn. Never both paints on one cell.
- If leftover sum is already 2/2 or 0/0, both skip (Frost / Strike).

SYNERGY:

- Leftover-sum post + leftover-sum start-sill. Teaching pair for Tally Gate without the Stinger yet. Information (which tile, which clock) plus a leftover-sum tax.

PLAYER_THREAT:

- Frustration and a chip if you camp leftover-sum 3 on the painted tile at the wrong clock. Not a lock: walk-on is free, second approach exists, leftover-sum is public.

COUNTERPLAY:

- Spend a pool before turn end (post). Spend a pool overnight (sill). Walk onto the post. Dual Keep 2/2. Probe with a summon. Kill the Prelate (cap 1). Swap the Siller onto their own sill once you know the cell.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (post + sill on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Prelate: summoner tallypost; never plant the only backliner approach; remaining cap ≥ 1.
- Siller: setter; never paint both approaches; never paint the only exit.
- Soph 2–3.

VARIANTS:

- `FSN-TALLY-GATE/STING` — BRIGADE **Tally Gate full**: add `ROLE-TALLY-STING`. Post detonates leftover-sum occupy; tile taxes start-of-turn; sting the rest. Still two different tiles. Unlock after this CELL.
- `FSN-TALLY-GATE/LIVE-FROST` — if Post id is not ready, Prelate Frost-only (softer CELL; still two bodies). Do not fake leftover-sum occupy with Slow.

STATUS: PROPOSED

---

### FSN-ODD-COURT

FORMATION_ID: `FSN-ODD-COURT`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-ODD-PLATE` — `rook` **without** heal / proposed `odd_plater` — pack median + 1 — leftover-AP-odd miss
- `ROLE-PLATE` — `rook` / proposed `plate_warden` or live `iron_golem` — pack median — absorb / body

VARIANT_RULES:

- Distinct from `FSN-SPENT-FULL` (leftover **AP ≥ 1** miss + leftover-AP≥3 poke). Odd Plate is **parity**: leftover AP 1/3/5 miss; leftover AP 2 (even, Spent’s window) **lands** and the charge **stays**. **Never PAIR Odd Plate + Odd Sting** — `/STING` is the 3-body.
- CELL: Plate has Odd Plate + Strike. Warden has Strike + Iron Skin. No Inferno. No Odd Hold (walk lock vs hit negate). No Spent Plate / Tally Hood / Poise Hood (PAIR bans).
- Elite: Odd Plate only. Warden stays junior so the puzzle is “who do I shoot after they spend to even,” not two elites.
- Unlock after `FSN-SPENT-FULL` **or** `FSN-TALLY-SIP` (player has seen leftover-AP as a miss key **or** leftover-sum as a resource).
- Leftover-AP writer required. Even leftover at impact **lands**.

SPELL_POOL_INTERACTIONS:

- Odd Plate: leftover AP odd at impact → miss and consume. Even leftover → hit lands, charge remains. Drain Courage onto leftover 1 **opens** the miss. Drain Courage onto leftover 2 **closes** it.
- Ward Plate / Iron Skin is absorb / RES, not a second parity miss. Do not also spawn `spent_plater` on this sheet.
- No drain on the Odd Plater (healAmount).

TACTICAL_PLAN:

- Odd Plate walks into the path and Plates when leftover AP is odd. Warden body-blocks a **wide** lane, not a 1-tile tunnel.
- If leftover AP is even, Odd Plate Iron Skins / Strikes. It does not dump leftover **only** to fake Spent Plate.

SYNERGY:

- Leftover-AP-odd miss + absorb. Wave 15 Spent Full standing on **parity** instead of “any leftover AP ≥ 1.” Combination, not a new sprite. Spend to even is a complete answer.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is dumping Inferno into leftover 1 **and** a fresh absorb.

COUNTERPLAY:

- Wait until leftover AP is even. Drain Courage onto 2. Hit a different body. DoT the plate (DoTs chew absorb; Cursed Wound does not reduce absorb). Walk around (init 0.85 / MP-poor).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Never a closed ring.
- No Thorned Ground on the only path to the Odd Plate.

AI_REQUIREMENTS:

- Odd Plate: guardian; skip if leftover AP already even.
- Warden: charger; no retreat above 40% effective.
- Soph 2–3.

VARIANTS:

- `FSN-ODD-COURT/STING` — BRIGADE **Odd Court full**: add `ROLE-ODD-STING`. Leftover-AP-odd miss, then leftover-AP-odd poke through the plate. **Never a two-body of Plate+Sting.** Unlock after this CELL. Sting skip if leftover AP is even unless 10 still kills.
- `FSN-ODD-COURT/GOLEM` — fallback: live `iron_golem` instead of Plate if absorb is not ready.

STATUS: PROPOSED

---

### FSN-MIRE-FILE

FORMATION_ID: `FSN-MIRE-FILE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-MIRE-SKIP` — `knight` **without** heal / proposed `mire_skipper` — pack median — 1-tile mire enter-tax skip
- `ROLE-KITER` — `bishop` / live `tide_shade` — pack median — frost + slow

VARIANT_RULES:

- Distinct from `FSN-RIME-FILE` (1-tile **rime** leave-tax skip + ice mason). Mire Skip ignores **enter-tax** on a **length-1** walk across mire. Length ≥ 2 still pays. Rime leave-tax, glyph-tax, lava, and spikes still tick. Extra room `mire_nave` is **not** this family.
- CELL: Skipper has Mire Skip + Strike. Shade has Frost + Slow. Never Inferno. Never Rime Skip / Glyph Skip / Spike Skip on PAIR (PAIR bans).
- Elite: Shade only. Skipper stays junior so two skip elites cannot paint the pocket.
- Unlock after `FSN-RIME-FILE` **or** `FSN-TIDE-LOCK` (player has seen a 1-tile hazard skip **or** a kite tax).
- If the map has no mire / mud occupancy in Chebyshev 6 of a legal floor, **reroll this id**.
- Live tide melee −1 MP is a **punish for catching the shade**, not a primary attack — the shade must still refuse to walk in at CELL.
- One Slow source (the shade). Skipper does not also Slow.

SPELL_POOL_INTERACTIONS:

- Mire Skip: next **length-1** walk ignores mire enter-tax. Length ≥ 2 pays. Teleport / Swap onto mire already pays no enter-tax (Wave 3) — that is a legal skip of the tax if the player brought it.
- Frost (−1 MP) plus tide Slow (−2 MP) from **one** Slow source. Cap applied MP debuff at −2. Live tide melee −1 MP counts toward that cap if the player catches the shade.
- Paper Windstorm is a **fair** modifier (also hits the kiter).

TACTICAL_PLAN:

- Skipper arms Mire Skip then steps onto a 1-tile mire cell toward a flank. It does not walk length 2 across two mire cells.
- Shade keeps Chebyshev ≥ 3 and spends AP on Frost / Slow, repositioning 1–2 steps if LoS dies.

SYNERGY:

- 1-tile mire skip + ice kiter. Wave 15 Rime File standing on a **different** hazard tax (enter vs leave). Live `tide_shade` so the pack is not two proposed sprites.

PLAYER_THREAT:

- Frustration and chip, not a lock. The skipper crosses a tax you thought was a wall; the shade punishes a player who treats this as `FSN-RIME-FILE` and walks the length-2 aisle.

COUNTERPLAY:

- Body-block the 1-tile. Force a length-2 path (they still pay). Cut a side aisle and collapse the shade (`hpMult` ~0.8, glass RES). Attract / Swap yanks the shade into Strike range. Do not chase through the Skipper’s tile.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with **wide** files **and** a mire cell. Reject `corridorMaze` (a kiter in a hallway is either helpless or a lock).
- One clean aisle that is **not** mire. No lava on the only approach.

AI_REQUIREMENTS:

- Skipper: flanker; skip if the next walk is not a 1-step across mire; never skip rime / lava / spikes with this id.
- Kiter: caster + keep-range 3.
- Soph 2–3.

VARIANTS:

- `FSN-MIRE-FILE/LEY` — BRIGADE **Mire File full**: add `ley_tollkeeper`. Cross the mire tax, then the tide slows the landing, then Ley Toll taxes leftover AP. Still one Slow source. Unlock after this CELL. Ley Toll remains `mpCost: 0` on this sheet (do not add a fourth `mpCost > 0` walk snipe).
- `FSN-MIRE-FILE/E-TIDE` — elite Shade, still no Inferno.

STATUS: PROPOSED

---

### FSN-WATCH-BANK

FORMATION_ID: `FSN-WATCH-BANK`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-BANK` — `bishop` **without** heal / proposed `watch_banker` — pack median — overwatch snap banks leftover AP
- `ROLE-OPTIC` — `bishop` / proposed `dim_optic` — pack median — range shrink

VARIANT_RULES:

- Distinct from `FSN-WATCH-SIP` (snap **steals** walker leftover AP). Watch Bank **banks** 1 leftover AP on the **walker** to next turn start (cap 1, AP only). Dual Keep **wins** if already banking — skip. Push/pull into the band **does** snap. Teleport / Swap **does not**. **Never PAIR Watch Bank + Glass Sniper** — `/GUN` is the 3-body.
- CELL: Banker has Watch Bank + Frost. Optic has Short Sight (Wave 3) + Frost. Never Inferno. Never Watch Sip / Watch Alms / Watch Fee (PAIR bans).
- Elite: Banker only. Optic stays junior so two overwatch elites cannot pin.
- Unlock after `FSN-WATCH-SIP` **or** walked into Hold Ground / Far Watch this run (relative, not a level gate).
- Visible 2-turn stance. Never arm a hidden snap.

SPELL_POOL_INTERACTIONS:

- Watch Bank: next hostile who **walks** into the overwatch band banks 1 leftover AP. Snap still deals (Frost chip). Dual Keep already covering them → skip. Cap 1 leftover-AP bank, not a steal, not Dual Keep’s AP+MP bank.
- Short Sight: range shrink. Closing is the correct play; the Bank is why walking the band costs a leftover story.
- One Slow source if Slow is chosen (Banker). Optic does not also Slow.

TACTICAL_PLAN:

- Banker arms a **visible** overwatch on a **wide** lane, then Frosts. Optic holds Chebyshev ≥ 3 and shrinks range.
- If Dual Keep is already on the player, Banker Frosts (skip the bank).

SYNERGY:

- Snap banks leftover AP + optic. Wave 15 Watch Sip standing on the **inverse** leftover story (grant a bank vs steal). Combination, not a new sprite. Don’t walk the band is a complete answer.

PLAYER_THREAT:

- Slow poke plus a leftover-AP bank you did not Dual Keep. Not a one-shot. Misplay is walking the band “for one Frost” then finding leftover AP 1 waiting at turn start.

COUNTERPLAY:

- Don’t walk the band. Blink / Swap in (does not snap). Send a summon. Dual Keep already banks (this card skips). Kill the Banker (hp ~0.75). The Optic without a bank is a range-shrink bishop.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel.
- No lava on the only approach to the Optic.

AI_REQUIREMENTS:

- Banker: artillery; skip if Dual Keep already covers them **or** no overwatch is armed; never grant the walker now (that is Watch Alms).
- Optic: caster + refuse dest ≤ 2.
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-BANK/GUN` — BRIGADE **Watch Bank Hunt full**: add `ROLE-SNIPER` (`glass_sniper`). Snap banks leftover AP, then the gun / optic punish the dry purse. **Never a two-body of Bank+Gun.** Unlock after this CELL. Still one Slow source. Sniper minRange 3.
- `FSN-WATCH-BANK/E-BANK` — elite Banker, still no Watch Sip.

STATUS: PROPOSED

---

### FSN-TALLY-CHOIR

FORMATION_ID: `FSN-TALLY-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-TALLY-MEND` — `queen` **with** heal / proposed `tally_mender` — pack median
- `ROLE-VERSE-TALLY` — `bishop` **without** heal / proposed `verse_tallier` — pack median — last-id illegal until leftover-sum===3
- `ROLE-HAZARD` — `knight` / proposed `ignite_alchemist` or live `ember_knight` — pack median — Ignite stacks (or live melee burn if Ignite id is not ready)

VARIANT_RULES:

- Unlock after `FSN-POISE-CHOIR` **or** `FSN-TALLY-STEP`. Wave 16 “Tally Choir.”
- Elite: Mender only. Verse and Ignite stay junior.
- Mender: Tally Mend + Shield. **No** Inferno. **No** Poise / Gaunt / Equal / Hollow Mend (PAIR bans). Extra door `tally_cantor` is **not** this family.
- Verse: Verse Tally + Frost. **No** Verse Poise / Verse Gaunt / Last Mute / Summon Verse (PAIR bans). `lastResolvedSpellId` required. `0 = 0` does **not** peel. `2 = 2` does **not** peel. Forced-move does **not** peel.
- Ignite: `spell-ignite-stacks` if ready, else live ember melee-burn. **No** Inferno on this body if Ignite is present (one fire cadence). Ignite stack gate ≥ 2.
- Do not also roll random summoner overlay onto any body.
- If leftover writers or `lastResolvedSpellId` are missing, **do not spawn this id** — show `FSN-POISE-CHOIR`.

SPELL_POOL_INTERACTIONS:

- Tally Mend (8) iff both leftover sums === 3. Verse Tally: last resolved non-Strike id is **illegal** until leftover AP + leftover MP === 3. Ignite cashes ≥ 2 public DoT stacks.
- Readable three-step: spend into leftover-sum 3 to recast last id **or** sit 2/2 and refuse the 8. Dual Keep 2/2 peels nothing on this sheet (Poise Choir’s peel, not this one).
- One Inferno cadence per pack — Ignite **or** ember burn, not both plus a queen nuke.

TACTICAL_PLAN:

- Turn 1: Verse arms if `lastResolvedSpellId` exists; else Frosts. Mender Shields unless both leftover sums === 3 and missing HP ≥ 8. Ignite holds until ≥ 2 stacks are public.
- If the Mender dies, remaining pair is last-id lock + applicator — intended.

SYNERGY:

- Leftover-sum heal + last-id until leftover-sum + ignite. Wave 15 Poise Choir standing on the **odd-sum** leftover window. Combination, not a new monster.

PLAYER_THREAT:

- High if you Dual Keep (2,1) to recast Inferno **and** feed the 8. Still interruptible: sit 2/2, dump a pool, wait, kill Verse.

COUNTERPLAY:

- Dual Keep 2/2 (Verse does not peel; Mend does not fire). Dump a pool. Recast a **different** id (Summon Verse is a different tax). Kill Verse (glass). Cursed Wound the Mender. Do not clump with a wisp on Ignite.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Ignite can land.

AI_REQUIREMENTS:

- Mender: healer; skip if leftover sum ≠ 3.
- Verse: controller; skip if no `lastResolvedSpellId`; leftover-sum===3 peels.
- Ignite: flanker; **not** berserk; stack gate ≥ 2.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-TALLY-CHOIR/NO-IGNITE` — drop Ignite if stack consume is not ready; keep Mend + Verse (softer BRIGADE).
- `FSN-POISE-CHOIR` remains the tied-≥1 choir; do not merge ids.

STATUS: PROPOSED

---

### FSN-EQUAL-SHOVE

FORMATION_ID: `FSN-EQUAL-SHOVE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-EQUAL-GIFT` — `queen` **with** heal / proposed `equal_gifter` — pack median — target-tied-≥1 10
- `ROLE-SHOVE-GIFT` — `queen` **with** heal / proposed `shove_gifter` — pack median — caster-authored force 10
- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median — Shoulder Bash (player-push)

VARIANT_RULES:

- Unlock after `FSN-SHOVE-DRIFT` **or** `FSN-TALLY-STEP`. Wave 16 “Equal Shove.”
- Distinct from `FSN-SHOVE-DRIFT` (force-landing paint + **anyone-forced** heal). Equal Gift is **target leftover AP === leftover MP ≥ 1**; caster leftover unread. Shove Gift is **this caster** force-moved the target — the pack bash is for the **player**; the Gifter’s ADVANCED bash is for the **ally**. **Never PAIR Equal Gift + Tally Mend / Poise Mend / Shove Gift as a two-body.** The BRIGADE is why both heals exist, with a third peeler (Bash).
- Elite: Pusher only. Gifters stay junior so two heal elites cannot pin.
- Hook / bash dest still banned from lava / void. Prefer landing **off** a leftover-tied tile if a walk-off remains — the identity is the 10 after the shove, not a lock.
- No Root on this sheet. No Inferno. No Swap. No Tally Mend (PAIR bans).
- `forcedMovedThisTurn` **and** a caster-authored bit required. Walk / Swap / Tally Step do **not** count. Until those writers land, show `FSN-SHOVE-DRIFT`.

SPELL_POOL_INTERACTIONS:

- Equal Gift: 10 HP iff **target** leftover AP === leftover MP **and both ≥ 1**. Windows 1=1, 2=2, 3=3. `0 = 0` is Hollow / Gaunt. Dual Keep **preserves** a 2=2 window. Caster leftover unread.
- Shove Gift: 10 HP iff **this caster** force-moved the target this turn. Pack Bash on the **player** does **not** arm the ally-heal. The Gifter must author **its** shove on the wounded ally (ADVANCED bash), not steal the Bruiser’s.
- Shoulder Bash: 2-step ray. Collision bonus vs wall. Dest must leave a walk-off. Bash into open floor is skipped (VETERAN).

TACTICAL_PLAN:

- Equal Gifter Equal-Gifts only if target leftover AP === leftover MP ≥ 1 **and** missing HP ≥ 10; else Shields.
- Shove Gifter Bashes a wounded ally toward a wall **beside** the engagement, then Gifts; never onto lava; never through the player’s last exit.
- Bruiser Bashes the **player** toward a wall if a side step remains. Never turn-1 double displace onto one tile.

SYNERGY:

- Target-tied-≥1 heal + authored-shove heal + bash. Wave 15 Shove Drift standing on a **different** heal key (target leftover vs anyone-forced vs this-caster). Three readable windows.

PLAYER_THREAT:

- Positional and sustain. Failure is Dual Keep 2/2 in Equal Gift’s face **and** letting the Shove Gifter bash its wounded ally. Recoverable: dump one leftover pool, peel the Gifter, hug the Bruiser.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so they differ (Equal Gift fizzles). Peel the Shove Gifter off the wounded. Occupy the bash dest. Kill Equal Gift (glass). Do not stand where they can bash their ally into you.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze`.
- No Void Rift tile as a legal landing. No lava dest.

AI_REQUIREMENTS:

- Equal Gift: healer; skip if leftover AP ≠ leftover MP or leftover AP = 0.
- Shove Gift: healer; skip if this caster did not author the move; ADVANCED bash dest legality.
- Pusher: charger; skip bash into open floor; dest scoring must not use lava.
- Soph 3–4. Blackboard: `plannedLanding` so Bash and Shove Gift do not stack on the player’s last exit.

VARIANTS:

- `FSN-EQUAL-SHOVE/NO-BASH` — drop the Bruiser if push callers are not ready; keep Equal + Shove Gift only if the Gifter’s ADVANCED bash exists (softer BRIGADE). Still no lava dest.
- `FSN-SHOVE-DRIFT` remains the anyone-forced BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-TALLY-QUIET

FORMATION_ID: `FSN-TALLY-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-TALLY-STEP` — `queen` **without** heal / proposed `tally_stepper` — pack median
- `ROLE-TALLY-MEND` — `queen` **with** heal / proposed `tally_mender` — pack median
- `ROLE-COVER` — `pawn` / proposed `cover_squire` — pack median + 1 — body-block / Shield

VARIANT_RULES:

- Unlock after `FSN-TALLY-STEP` **and** (`FSN-POISE-QUIET` or `FSN-GAUNT-QUIET`). Wave 16 “Tally Quiet.”
- Two queens, two jobs: Step is **leftover-sum relocate**; Mend is leftover-sum heal. Cover is the third peeler so this is not a PAIR of Step+Cover (PAIR ban).
- Elite: Cover only. Stepper and Mender stay junior so two leftover-sum elites cannot surround.
- Cover: Shield / Iron Skin / body-block. **No** Inferno. **Do not ship this id until ally `targetId` apply exists** (Shield on the Mender).
- No Tally Lend on BASE (that is `/LEND`). No Brick Step (PAIR ban with Tally Step).
- Random 30% family lottery is **off**. Do not also roll random summoner overlay.

SPELL_POOL_INTERACTIONS:

- Tally Step occupancy dest (not `isSwap`) onto a free Chebyshev-1 of an ally whose leftover sum === 3. Tally Mend 8 iff both leftover sums === 3.
- Cover Shield on the Mender when the Mender is under 50%, else Iron Skin self. Enrage on Cover is allowed; Enrage on the Mender is a waste.
- Dual Keep 2/2 peels both leftover-sum cards. Dual Keep (2,1) **opens** both.

TACTICAL_PLAN:

- Cover interposes on the Mender axis with a **gap**. Stepper joins when leftover sum === 3; else Frosts. Mender Tally-Mends only if both leftover sums === 3 and missing HP ≥ 8; else Shields.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Join leftover-sum ally, then cash the four leftover-sum 8, while Cover occupies. Wave 15 Poise Quiet standing on the **odd-sum** leftover window.

PLAYER_THREAT:

- Getting joined and mended while the doorway is occupied. Spike is low. The fail is never looking at the Mender.

COUNTERPLAY:

- Occupy every Chebyshev-1 of the Mender. Dual Keep 2/2. Dump a pool. Cursed Wound the Mender. Walk around; Cover is MP-poor. Kill Cover to open the gap.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Mender needs a retreat tile that is not Cover’s choke.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Stepper: protector; skip if ally leftover sum ≠ 3 or no free dest.
- Mender: healer; skip if leftover sum ≠ 3.
- Cover: guardian interpose. Ally Shield apply required.
- Soph 3–4. `AI_BACKLINE_PROTECT` on. `groupTactics` at 4.

VARIANTS:

- `FSN-TALLY-QUIET/LEND` — CADRE **Lend Hood escort**: replace Cover with `ROLE-TALLY-LEND` + `ROLE-TALLY-HOOD` + `tempo_precentor`. Cash the window with +1/+1 (sum 5), or hold (2,1) through a miss. **Never PAIR Tally Lend with Poise / Gaunt / Lean / Spent / Drift / Tempo as a two-body.** Unlock after `FSN-TALLY-STEP` **or** `FSN-POISE-QUIET/LEND`. Lend **or** Hood, not both same turn. Tempo is next-turn AP, not leftover. Ally `targetId` required.
- `FSN-TALLY-STEP` remains the teaching PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-PURSE-TALLY

FORMATION_ID: `FSN-PURSE-TALLY`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PURSE-TURN` — `queen` **without** heal / proposed `purse_turner` — pack median — invert one hostile leftover AP↔MP
- `ROLE-TALLY-MEND` — `queen` **with** heal / proposed `tally_mender` — pack median
- `ROLE-TALLY-STING` — `pawn` **without** heal / proposed `tally_stinger` — pack median or −1

VARIANT_RULES:

- Unlock after `FSN-TALLY-STEP` **and** `FSN-TALLY-SIP`. Wave 16 “Purse Tally.”
- Distinct from `FSN-CROSS-POISE` (two-body leftover **cross**). Purse Turn inverts leftover AP↔MP on **one hostile**; caster pools unchanged; sum **invariant**. Equal leftover is a no-op (skip). **Never PAIR Purse Turn + Bar Cross / Dual Keep / Pawn Broker.** The BRIGADE is invert + leftover-sum cash, never a two-invert.
- Elite: Turner only. Mender and Stinger stay junior.
- Turner: Purse Turn + Frost. **No** Inferno. **No** Bar Cross / Tempo Invert (PAIR bans).
- Mender / Stinger: same kits as `FSN-TALLY-STEP` / `FSN-TALLY-SIP`. Still no Poise / Gaunt clones.
- Leftover-AP and leftover-MP writers required.

SPELL_POOL_INTERACTIONS:

- Purse Turn: (3,0) ↔ (0,3); (2,1) ↔ (1,2); (2,2) is a no-op; (0,0) is a no-op. Sum stays 3 so Tally Sting / Tally Mend still fire. Caps at each pool’s max. Not `isSwap`.
- Tally Mend 8 iff both leftover sums === 3. Tally Sting 10+8 iff **target** leftover sum === 3.
- ELITE Turner inverts (3,0) so Tally Sting still fires (sum invariant) instead of dumping the player off the window.

TACTICAL_PLAN:

- Turn 1: Turner inverts if leftover AP ≥ 2 and leftover MP = 0 (or the inverse); skip equal leftover. Stinger lurks at 3. Mender Shields unless both leftover sums === 3.
- Never turn-1 triple on one tile.

SYNERGY:

- Invert a hostile purse while keeping leftover-sum 3, then heal / sting. Wave 15 Cross Poise standing on **one-body invert** instead of two-body cross. Combination, not a new sprite.

PLAYER_THREAT:

- Getting leftover AP 3 turned into leftover MP 3, then Stung for 18, while the queen mends. Recoverable: sit 1/1 or 2/2 (no-op invert **and** not Tally).

COUNTERPLAY:

- Sit 1/1 or 2/2. Strike before they recast. Do not hold 3 leftover AP and 0 MP. Kill the Turner (glass). Ignore the Mender if you are bursting the Stinger.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp.
- ≥ 2 walk-offs from wherever Sting can land.

AI_REQUIREMENTS:

- Turner: controller; skip equal leftover; skip 0/0; never Bar Cross.
- Mender: healer; skip if leftover sum ≠ 3.
- Stinger: flanker; skip if leftover sum ≠ 3 unless 10 still kills.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-PURSE-TALLY/NO-MEND` — drop Mender if leftover-sum heal is not ready; keep Turner + Stinger (softer BRIGADE). Still no Bar Cross.
- `FSN-CROSS-POISE` remains the two-body-cross CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-TIED-PORTAL

FORMATION_ID: `FSN-TIED-PORTAL`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-TIED-GAIT` — `pawn` **without** heal / proposed `tied_gaiter` — pack median — leftover AP **and** leftover MP **exactly 2** poke
- `ROLE-PORTAL-CUT` — `pawn` **without** heal / proposed `portal_cutter` — pack median — world-portal Chebyshev ≤ 2 poke
- `ROLE-DISPLACER` **without Swap** — `queen` or `king` / live `void_mirror` — pack median — 25% reflect + Veil hold

VARIANT_RULES:

- Unlock after `FSN-TALLY-SIP` **or** `FSN-LONE-HAZARD`. Wave 16 “Tied Portal.”
- Distinct from `FSN-LONE-HAZARD` (leftover-MP **exactly 1** + **painted** hazard). Tied Gait is leftover AP **and** leftover MP **exactly 2**. Portal Cut reads `map.portals` occupancy. Twin Gate pads do **not** count. World portals stay impassable.
- Elite: Mirror only. Tied and Portal stay junior so two poke elites cannot 100–0 from full HP.
- Mirror kit: Strike + Shadow Veil. **No Swap** (that is `FSN-EMBER-RIFT` / `FSN-SWAP-BRICK`). Reflect is the live 25% pre-crit hook. Never `spell-mirror` (flag false; full reflect is a hardlock).
- **Never PAIR Tied Gait + Pair Gait / Lone Gait / Pair Purse / Full Gait / Poise Sting / Tally Sting / Equal Gift.** **Never PAIR Portal Cut + Hazard Cut / Axis Cut / Null Censor.**
- If the map has no `map.portals` cell, **reroll this id**.
- No Inferno. No Root. No Pain Link.

SPELL_POOL_INTERACTIONS:

- Tied Gait: 10, +10 iff leftover AP === 2 **and** leftover MP === 2. Dual Keep 2/2 **opens** this **and** Poise. 1/1 / 3/3 / 2/1 / 0/0 → 10 only.
- Portal Cut: 10, +10 if target is Chebyshev ≤ 2 from a world portal. Far → 10 only. Twin Gate pads do not trigger.
- Mirror Veil + 25% reflect. Physical is the open into the Mirror. Player Barrier (enemy cannot use it) cuts the reflect lane.

TACTICAL_PLAN:

- Mirror **does not chase**. It holds a corridor so the player’s spells graze it.
- Tied lurks at 3 and commits when leftover is 2/2 **or** HP% ≤ 40. Portal commits when the player camps a portal threshold.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Exact 2/2 poke + portal-threshold poke + reflect. You cannot shoot the camp **and** you cannot Dual Keep 2/2 on the pad. Combination of live `void_mirror` with two Wave 16 leftover / occupancy pokes.

PLAYER_THREAT:

- High if you Dual Keep 2/2 next to a world portal in a reflect corridor. Low if you walk the gallery, dump 1 leftover, and physical the Mirror. Not unavoidable: sit 3+ from every portal, sit off 2/2, open physical.

COUNTERPLAY:

- Dump 1 leftover AP **or** MP (Tied peels). Stand 3+ from every portal (Portal peels). Open physical on the Mirror. Fight in the open, not the corridor. Do not camp the pad.

MAP_REQUIREMENTS:

- `fortress` corridor **plus gallery**, or `ruinsIslands` with a world portal **and** a second file the player can take. Always a `map.portals` cell. Reject `corridorMaze` with one file (reflect + forced melee is a lock).
- No Void Rift tile as the only stand. Twin Gate pads do **not** satisfy the portal requirement.

AI_REQUIREMENTS:

- Tied: flanker; skip if leftover is not exactly 2/2 unless 10 still kills.
- Portal: flanker; skip if they stand farther than 2 from every world portal; never treat Twin Gate pads as portals.
- Mirror: holder, no chase. Heal-less.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-TIED-PORTAL/NO-MIRROR` — BRIGADE-shaped CADRE: Tied + Portal only (if reflect corridor is missing). Still needs a `map.portals` cell.
- `FSN-LONE-HAZARD` remains the leftover-MP-exactly-1 + painted-hazard CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PRIME-TAX

FORMATION_ID: `FSN-PRIME-TAX`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-CADENCE-PRIME` — `bishop` **without** heal / proposed `cadence_primer` — pack median — remaining `0` → `1`
- `ROLE-CAST-TOLL` — `bishop` **without** heal / proposed `cast_toller` — pack median — Struck-last-turn next-**spell** +1 AP
- `ROLE-DEBUFFER` — `bishop` / live `bone_scribe` or proposed `tax_scribe` — pack median — Weaken / Expose / Glyph Tax; **no** drain

VARIANT_RULES:

- Unlock after `FSN-STRIKE-TAX` **or** `FSN-TALLY-CHOIR`. Wave 16 “Prime Tax.”
- Distinct from `FSN-STRIKE-TAX` (Struck-last-turn next-**walk** +1). Cast Toll taxes the next **spell** after they Struck. Strike still costs 2. Cadence Prime writes remaining `n===0` → `1`; ones stay 1; `n>1` unchanged. **Not** Cadence Floor (compress `n>1` → 1, zeros stay 0 — SDE #906). **Not** Cadence Rise (`n===1` → `2` — SDE #962). **Not** Cadence Snuff (`n===1` → `0` — Wave 17). Extra door `prime_precentor` is **not** this family.
- Elite: Primer only. Toller and Scribe stay junior.
- **Never PAIR Cadence Prime with Swapper / Lagger / Staller / Thief / Rester / Imprinter / Halver / Gracer / Flusher / Stretcher / Trimmer / Pinner.** **Never PAIR Cast Toll with Strike Debt / Debt Caster / Spent Tax / Still Tax / Gait Tax / Ley Toll / Tax Scribe / Verse Tax as a two-body.** The CADRE is why Prime + Toll + Scribe exist.
- Scribe does not also Poison (Prime + Toll is enough). Glyph Tax is the **one** rare, on the Scribe, after `FSN-GRAVITY-TAX` has been seen **or** as this CADRE’s rare — not both Tax **and** Drain Courage on the same AP bar.
- `struckThisTurn` required for Cast Toll. Remaining-CD map required for Prime. Until those writers land, show `FSN-STRIKE-TAX`.
- No Inferno. No Sacrifice. No Quiet Hex on CORE.

SPELL_POOL_INTERACTIONS:

- Cadence Prime: ready Inferno / Heal remaining 0 becomes remaining 1 — recast **next turn**, not now. Target keeps every spell. Skip if every remaining is already > 0.
- Cast Toll: last turn `physical_attack` and no other spell → next **spell** +1 AP. Spell last turn fizzles the arm. Walk last turn fizzles the arm. Relocate does not pay.
- Glyph Tax: +1 AP to **cast** while in the 3×3, 0 damage. Leaving the zone is the answer. Cheap Strike from outside is legal.
- Readable three-step: Strike last turn, get primed, pay the spell tax **or** wait.

TACTICAL_PLAN:

- Turn 1: Primer Primes if a nuke remaining is 0; else Frosts. Toller holds until they Struck last turn. Scribe Weakens if the player is already wounded; else holds.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Ready-lock zeros to 1, then tax the spell after they Struck, then zone AP. Wave 15 Strike Tax standing on a **spell** tax instead of a **walk** tax, plus a remaining-0 lock. Live `bone_scribe` so the pack is not three proposed sprites.

PLAYER_THREAT:

- High if you Strike then Inferno the same window. Still a wait-out. Failure is dumping a 5-AP Inferno after Prime **and** Cast Toll **and** Tax.

COUNTERPLAY:

- Spend the ready Inferno **now** (before Prime). Frost last turn, not Strike (Cast Toll fizzles). Leave the Tax zone. Wait the remaining 1. Kill the Primer (glass). Strike still costs 2.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Tax 3×3 must not cover **all** walk-offs.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Primer: controller; skip all-nonzero; never Floor / Rise / Snuff / Crack the same turn.
- Toller: controller; skip spelled / walked last turn; Strike stays 2 AP.
- Scribe: caster; skip recast Weaken; zone the landing **only** if an exit exists.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-PRIME-TAX/NO-SCRIBE` — fallback to Primer + Toller only (BRIGADE-shaped CADRE if Glyph Tax is not ready). Still never Cast-Toll+Scribe PAIR.
- `FSN-STRIKE-TAX` remains the Struck-walk CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SWAP-BRICK

FORMATION_ID: `FSN-SWAP-BRICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SWAP-MARK` — `bishop` **without** heal / proposed `swap_marker` — pack median — teleport-landing detonate
- `ROLE-BRICK-STEP` — `knight` **without** heal / proposed `brick_stepper` — pack median — through-barrier peek
- `ROLE-MIST` — `knight` / proposed `mist_walker` — pack median — self dash (the teleport tool)

VARIANT_RULES:

- Unlock after `FSN-SHOVE-DRIFT` **or** `FSN-MIST-HUNT`. Wave 16 “Swap Brick.”
- Distinct from `FSN-SHOVE-DRIFT` (force-landing consume; **walk-on is free** there too, but force **does** detonate). Swap Mark detonates on **Swap / Twin Gate / Phase Slip / fold / Mist Step landing**. Walk-enter, push, pull, and slide **do not**. Brick Step relocates **through** an adjacent barrier (Chebyshev 2, same axis) if empty floor; barrier **stays**; **not** Brick Nudge; **not** teleport (teaching contrast — Brick Step does **not** trip Swap Mark). Extra room `swap_pulpit` is **not** this family.
- Elite: Mist only. Marker and Stepper stay junior so two dash elites cannot surround.
- **Never PAIR Swap Mark + Shove Mark / Wake / Dwell / Ingress / Gaunt Sill / Poise Sill / Tally Sill / Fuse as a two-body.** **Never PAIR Brick Step + Brick Nudge / Orbit / Crack / Sprout / Shift / Wipe / Castellan / Tally Step.** The CADRE is why paint + peek + blink exist. Do not spawn without a legal teleport tool in the pack (`mist_walker` / `wraith_bishop` / `twin_porter`).
- Fog of War is **not** required. If it is up, do not also give CHAMPION fog-reentry on this sheet.
- No Inferno. No Root. No Pain Link. No second trapper.

SPELL_POOL_INTERACTIONS:

- Swap Mark: 0 on cast. Teleport landing detonates and consumes. Walk-on is **free**. Observation is the **paint**.
- Brick Step: adjacent barrier → relocate to the cell immediately beyond if empty floor. Dest hazards tick. Does **not** write `walkMpSpentThisTurn` or `currentView`. Does **not** trip Swap Mark (relocate is not teleport).
- Mist Step: self free-cell dash, CD 2, ignores LoS. **Does** trip Swap Mark. Dest must be free, non-void, not the player’s last exit.

TACTICAL_PLAN:

- Marker paints a **flank choke** the player wants to blink onto, never both approaches, never the only tile that reaches the Stepper.
- Stepper peeks through a wall onto a **different** tile from the paint, then Screen-Bites if `/GLYPH` is not this sheet — BASE it Strikes.
- Mist Steps to a rear/side tile that is **not** the painted cell unless ELITE wants the player to copy that landing (never plant the paint on the Mist’s own dest blackboard).
- Never turn-1 surround. Start ≥ 4 apart. Blackboard: `plannedStepDest` so Mist and Stepper do not stack.

SYNERGY:

- Paint the teleport landing, peek through a wall, blink onto the wick. Wave 15 Shove Drift standing on **teleport** instead of force-move, plus a through-barrier relocate that **does not** trip the paint. Combination, not a new monster.

PLAYER_THREAT:

- Getting Veiled and stabbed from a tile that was empty, after blinking onto a painted pad. Spike is a flank Strike plus a chip. Walk-on is the designed skip.

COUNTERPLAY:

- Walk, don’t blink. Occupy the far Brick-Step cell. Destroy the barrier. Stand on the paint with a summon **walk**. Kill the Marker (glass). Root does not stop Mist Step — zone the ring or Barrier the dest instead.
- Guardian body-block. Frost Nova (player) when they appear.

MAP_REQUIREMENTS:

- `asymmetric` or `fortress` courtyard with **two** flanks, **one adjacent barrier**, plus a rear tile that is not the only exit. Reject cramped `corridorMaze` (dash in a closet is a lock **or** useless). Weight 0 if no barrier in Chebyshev 1 of a legal floor.
- No Fog required. No sealed alcove.

AI_REQUIREMENTS:

- Marker: setter; skip if no teleport tool in the pack **or** player kit; never paint both approaches; walk-on is free.
- Stepper: flanker; skip if no adjacent barrier or dest occupied/hazard; dest occupancy skip; never Nudge.
- Mist: flanker + valued Step (VETERAN); dest free, non-void, not last exit.
- Soph 4–6. `groupTactics`: one focus. Blackboard: `plannedStepDest`.
- Proposed: summoner cooldown fall-through if a later variant adds a post — BASE has no summon engine.

VARIANTS:

- `FSN-SWAP-BRICK/NO-MIST` — BRIGADE-shaped CADRE if Mist Step id is not ready; keep Marker + Stepper only if the **player** has a teleport tool equipped (weight ×2). Walk-on remains the answer.
- `FSN-SHOVE-DRIFT` remains the force-landing BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-TALLY-HOLD

FORMATION_ID: `FSN-TALLY-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-TALLY-HOLD` — `knight` **without** heal / proposed `tally_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-TALLY` — `knight` **without** heal / proposed `must_tallier` — pack median — tools-until leftover-sum===3 **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-TALLY-HOOD` junior **or** omit — if present, skip if leftover sum already ≠ 3

VARIANT_RULES:

- Unlock after (`FSN-TALLY-SIP` or `FSN-RANK-PENTA`) **and** a leader-boost CADRE. Wave 16 “Tally Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Tally Hold + Must Tally** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP + leftover MP === 3; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-TALLY-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Tally Hold: cannot spend walk MP while leftover AP + leftover MP === 3. Spells stay legal. Spend one pool so the sum leaves 3 **or** Dual Keep 2/2 **or** dump both to walk. Prefer (0,3) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- Must Tally: remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 3 **and this spell spends last AP**. Strike stays legal.
- Together: Dual Keep (2,1) cannot walk **and** cannot Inferno unless last AP. Dual Keep 2/2 peels Hold (not leftover-sum 3) but does **not** peel Must unless they also spend last AP on Strike. Dump leftover to 0/0 peels Hold. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover sum === 3; skip if already 2/2 or 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-sum **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover so the sum leaves 3, Dual Keep 2/2, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-sum threat in this drop. Still turn-based. Failure is Dual Keep (0,3) to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after leaving leftover-sum 3 **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so the sum leaves 3 (Hold peels). Dual Keep 2/2 (Hold peels; Must needs last AP on Strike). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover sum ≠ 3; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold / Poise Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if leftover sum ≠ 3; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if leftover sum already ≠ 3.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-TALLY-HOLD/LANE` — BRIGADE-shaped: Hold + Must Tally + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-TALLY-HOLD/NO-HOOD` — COURT of three.
- `FSN-TALLY-HOLD/DEC` — COURT **Dec Plug**: replace this id’s members with `ROLE-DEC` + `ROLE-TALLY-SILL` + `ROLE-LANCER`. Axis-aligned 2×5 corridor seal, tax a neighbor at turn start, lance the block. **Skip until remaining cap ≥ 10** (live cap 2). Burst the 10 HP. Walk a far diagonal. Sit on a cell so the place fizzles. Swap around the rectangle. `summonAI === "decspan"` required. Every cell occupied. Do not also roll a second post. Needs a free 2×5 plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 10. Weight 0 on maps with no free 2×5 (solvability). **Never PAIR Dec + Nine / Oct / Tally Post / Lancer as a two-body.**
- `FSN-TALLY-HOLD/BOUNCE` — COURT **Bounce Tally**: replace Hold + Must + Warden with `ROLE-TALLY-BOUNCE` + `ROLE-MUST-TALLY` + `fuse_binder`. Two leftover-sum===3 bodies, bounce 12+12 onto the wick. **Never PAIR Tally Bounce with Poise / Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-POISE-HOLD/BOUNCE` **or** `FSN-TALLY-SIP`. Missing second leftover-sum flag → 12 only. Player keeps leftover sum ≠ 3 on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-TALLY-HOLD/KENNEL` — COURT **Verse Kennel**: replace Hold + Must + Hood with `ROLE-SUMMON-VERSE` + `kennel_siller` + `null_censor`. Pets pay **AP** to **recast last id**, then they cannot leave — teach contrast vs Cast / Toll / Gait. **Never PAIR Summon Verse with Summon Cast / Summon Toll / Summon Gait / Kennel / Brace / Brood / Verse Tally as a two-body.** Unlock after `FSN-TIED-PORTAL` **or** `FSN-POISE-HOLD/KENNEL`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot spell). Cap one kennel engine. First cast of any id is free. Teleport / Swap / forced move do **not** pay the recast tax. Drop this variant if `summonAI` is empty. `lastResolvedSpellId` required.
- `FSN-TALLY-HOLD/SCREEN` — COURT **Rank Screen**: replace Hold + Must + Hood with `ROLE-RANK-STRIDE` + `ROLE-SCREEN-BITE` + `ROLE-COVER`. Same-rank walk then bite through the cover the squire occupies. **Never PAIR Rank Warder + Rank Lancer / Knight Warder / Orth / Diag.** Unlock after `FSN-RANK-PENTA` **or** `FSN-SPIKE-SCREEN`. Cover occupies Bresenham. Still one Slow source. Needs a gallery. Weight 0 on cramped 1-tile closets.
- `FSN-POISE-HOLD` remains the leftover-equality **and** last-AP COURT; this id is leftover **sum === 3**.
- `FSN-POISE-HOLD/NINE` remains the 9-cell solid COURT; `/DEC` is the 10-cell 2×5 COURT.
- `FSN-TALLY-SIP` / `FSN-RANK-PENTA` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–16 still stand. This drop **meshes**; it does not replace.

```
PAIR:    TALLY-STEP         TALLY-SIP          RANK-PENTA         SPIKE-SCREEN
              \\                 |                   |                  /
CELL:     TALLY-GATE        ODD-COURT          MIRE-FILE         WATCH-BANK
              \\                 |                   |                  /
BRIGADE:  TALLY-QUIET       EQUAL-SHOVE        PURSE-TALLY       TALLY-CHOIR
              \\                 |                   |                  /
CADRE:    TIED-PORTAL       PRIME-TAX          SWAP-BRICK
              \\                 |                  /
COURT:                    TALLY-HOLD    TALLY-HOLD/DEC    TALLY-HOLD/BOUNCE    TALLY-HOLD/KENNEL    TALLY-HOLD/SCREEN
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-TALLY-STEP` | `FSN-POISE-STEP` **or** `FSN-GAUNT-STEP` |
| `FSN-TALLY-SIP` | `FSN-POISE-SIP` **or** `FSN-TALLY-STEP` |
| `FSN-RANK-PENTA` | `FSN-KNIGHT-QUAD` **or** `FSN-ORTH-TRI` |
| `FSN-SPIKE-SCREEN` | `FSN-PIT-AXIS` **or** `FSN-BRICK-WAKE` |
| `FSN-TALLY-GATE` | `FSN-POISE-GATE` **or** `FSN-TALLY-SIP` |
| `FSN-ODD-COURT` | `FSN-SPENT-FULL` **or** `FSN-TALLY-SIP` |
| `FSN-MIRE-FILE` | `FSN-RIME-FILE` **or** `FSN-TIDE-LOCK` |
| `FSN-WATCH-BANK` | `FSN-WATCH-SIP` **or** walked into Hold Ground / Far Watch |
| `FSN-TALLY-CHOIR` | `FSN-POISE-CHOIR` **or** `FSN-TALLY-STEP` |
| `FSN-EQUAL-SHOVE` | `FSN-SHOVE-DRIFT` **or** `FSN-TALLY-STEP` |
| `FSN-TALLY-QUIET` | `FSN-TALLY-STEP` + (`FSN-POISE-QUIET` or `FSN-GAUNT-QUIET`) |
| `FSN-PURSE-TALLY` | `FSN-TALLY-STEP` + `FSN-TALLY-SIP` |
| `FSN-TIED-PORTAL` | `FSN-TALLY-SIP` **or** `FSN-LONE-HAZARD` |
| `FSN-PRIME-TAX` | `FSN-STRIKE-TAX` **or** `FSN-TALLY-CHOIR` |
| `FSN-SWAP-BRICK` | `FSN-SHOVE-DRIFT` **or** `FSN-MIST-HUNT` |
| `FSN-TALLY-HOLD` | (`FSN-TALLY-SIP` or `FSN-RANK-PENTA`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 17 packs (not this drop)

Wave 17 families do **not** exist yet. Same-day 2026-10-24 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-24.md`, open as PR #1011) and SDE Wave 15 unique CORE (`spell-file-stride` … `spell-far-fold`, PR #962, **except** Pack Diag / Far Fold unless a later boss sheet claims them) stay Wave **17** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 16 sheets.

Held verbs (do not FSN this drop): Score Mend (both leftover AP + leftover MP **=== 4** **and leftover AP ≠ leftover MP**), Cadence Snuff (remaining `n===1` → `0`), Hendeca Span (stretched-plus eleven; skip until remaining cap ≥ 11; live cap is 2), Duel Turn (invert leftover AP↔MP on **two** hostiles independently), Score Hood / Score Sting / Score Step / Score Sill / Score Hold / Score Lend / Score Sip / Score Post / Score Bounce / Must Score / Verse Score, Court Snuff, File Stride, Hexa Oath, Lava Reel, File Bite, Strike Mark, Dry Plate, Shock Skip, Even Sting, Summon Rank, Lean Gift, Cadence Rise (already SDE #962), Still Toll, Brick Brace, Watch Root, Odd Gait, Spike Cut, Summon Plate, Pack Diag, Far Fold. Score Mend is **both-body leftover sum === 4 and unequal** — Dual Keep 2/2 is Poise, **not** Score. Do **not** pack `tally_mender` with a future `score_mender` as a teaching pair. Do **not** mint `cadence_snuffer` / `cadence_floorer` / `score_mender` / `hendeca_prelate` this drop.

Do **not** pack `tally_holder` with `must_tallier` as a teaching pair (Wave 16 rule). `FSN-TALLY-SIP` stays the leftover-sum poke lesson; `FSN-TALLY-HOLD` stays the walk-until leftover-sum===3 **and** last-AP COURT.

Do **not** pack `tally_mender` with `equal_gifter` as a teaching pair. `FSN-TALLY-STEP` stays the both-bodies leftover-sum===3 lesson; `FSN-EQUAL-SHOVE` stays the target-tied-≥1 BRIGADE. Poise Mend stays leftover **AP === MP ≥ 1** on **both** bodies (`FSN-POISE-STEP`). Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`).

Do **not** pack `tally_mender` with `poise_mender` / `gaunt_mender` / `dry_gaiter` / `dry_mender`. `FSN-POISE-STEP` stays leftover-tied-≥1; `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-PAIR-DRY` stays leftover-AP=0; this drop owns leftover **AP + MP === 3**. **0 = 0 does not fire. 2 = 2 does not fire.**

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend. Do **not** clone Equal Gift as Poise Mend. Cadence Floor stays SDE #906. Cadence Rise stays SDE #962. Same-day SDE Wave 15 unique CORE stays Wave **17** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–16, plus Wave 16 verbs in this order (from elite-evolution §5):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-RANK-PENTA` band 0 can ship among the first** once family HP survives battle start. `FSN-TALLY-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Tally Mend / Equal Gift / Shove Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **`forcedMovedThisTurn`** / `lastForcedMoveDir` / **caster-authored** force bit. Dual Keep leftover **is** leftover. Dual Keep 2/2 is Poise, not Tally. Dual Keep leftover-sum 3 is Tally.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Tally Step occupancy dests (not `isSwap`). Spike Reel = ninth attract dest flavor (toward, not onto, a world portal). Brick Step = through-adjacent-barrier relocate (not unit bash, not Brick Nudge); dest occupancy skip.
6. `inferSummonArchetype` gains `decspan` and `tallypost` (and still needs `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–15). Raise or gate `ENEMY_SUMMON_CAP` before Dec Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Tally Lend). **`FSN-TALLY-QUIET` and `FSN-TALLY-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-TALLY-STEP` / `FSN-EQUAL-SHOVE` / `FSN-PURSE-TALLY` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Tally Hold while leftover AP + leftover MP === 3. Must Tally / Verse Tally / Penta Oath / Rank Stride as refuse-until. Tally Sill start-turn leftover-sum occupy (paint stays). Swap Mark teleport-landing occupy (consume; walk-on free). Tally Post leftover-sum occupy. Odd Plate leftover-AP-odd. Odd Sting leftover-AP-odd. Tally Hood consume-before-damage. Purse Turn one-hostile leftover invert. Cadence Prime remaining-0→1. Watch Bank leftover-AP bank on snap. Brick Step dest occupancy skip.
9. Summoner cooldown fall-through (dec / tallypost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT dec sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** ship Cadence Rise as a family CORE (SDE #962 owns it). Do **not** mint SDE Wave 15 unique CORE / Wave 16 SPELL_PROPOSALS (Score Mend / Cadence Snuff / Hendeca Span / Duel Turn) as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-TALLY-STEP`, `FSN-TALLY-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP + leftover MP === 3; `0 = 0` does not fire; `2 = 2` does not fire; Tally Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-TALLY-SIP`, `FSN-TALLY-GATE` | leftover-AP + leftover-MP reads; Tally Sting leftover-sum===3; Sip leftover-sum **and** leftover AP ≥ 1 ((0,3) fizzles); Tally Post leftover-sum occupy / walk-safe / dump-safe / 2/2-safe; Tally Sill start-turn leftover-sum, paint stays; two different tiles; `summonAI === "tallypost"` |
| `FSN-RANK-PENTA` | Rank Stride same-rank dest; Penta Oath exact 5; Strike remains legal; blink does not pay; a legal same-rank floor **and** a tile at Chebyshev 5 exist |
| `FSN-SPIKE-SCREEN` | ninth `applyAttract` dest (spike occupancy); dest is not the portal; map has a spike in 6; Screen Bite Bresenham occupancy, Dummy Post is not cover |
| `FSN-ODD-COURT` | leftover-AP-odd miss; even leftover lands and charge stays; never Plate+Sting as PAIR (`/STING` is the 3-body) |
| `FSN-MIRE-FILE` | 1-tile mire enter-tax skip; length ≥ 2 pays; one clean aisle; map has a mire cell **or** a legal flank paint |
| `FSN-WATCH-BANK` | leftover-AP **bank** on overwatch snap; still deals; never steal (that is Watch Sip); Dual Keep wins; never Bank+Gun as PAIR |
| `FSN-TALLY-CHOIR` | `lastResolvedSpellId`; Tally Mend leftover-sum===3 on **both** bodies; Verse Tally leftover-sum peel (`0 = 0` does not; `2 = 2` does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-EQUAL-SHOVE` | leftover-AP + leftover-MP on **target** for Equal Gift (caster unread); `forcedMovedThisTurn` **and** caster-authored bit for Shove Gift; bash dest legality; never Equal+Tally as PAIR |
| `FSN-PURSE-TALLY` | one-hostile leftover AP↔MP invert; sum invariant; equal leftover is a no-op; never Bar Cross / Dual Keep PAIR |
| `FSN-TIED-PORTAL` | leftover AP **and** leftover MP exactly 2; `map.portals` occupancy (Twin Gate pads do not count); live 25% reflect; physical is the open |
| `FSN-PRIME-TAX` | remaining `n===0` → `1`; `struckThisTurn`; Strike last turn arms Cast Toll; spell last turn fizzles; relocate does not pay; never Cast-Toll+Scribe as PAIR; never Floor / Rise / Snuff |
| `FSN-SWAP-BRICK` | Swap Mark teleport-landing consume; walk / push / pull / slide are free; Brick Step through-barrier dest occupancy; Mist Step dest legality; relocate does **not** trip Swap Mark |
| `FSN-TALLY-HOLD` | Tally Hold until leftover AP + leftover MP === 3; Must Tally leftover-sum **and** last-AP tool-lock; never Root; spend 1 leftover so the sum leaves 3 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must |
| `FSN-TALLY-HOLD/DEC` | `summonAI === "decspan"` **and** remaining cap ≥ 10 (live cap 2 → skip); axis-aligned 2×5, every cell occupied |

---

## Sources (line-accurate, 2026-10-25)

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
- Wave 16 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-24.md` (PR #997) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-23.md` (PR #953); leftover SDE Wave 14 unique CORE in PR #906
- Drop 16: `docs/design/ENEMY_FORMATIONS_2026-10-24.md` (PR #1005)

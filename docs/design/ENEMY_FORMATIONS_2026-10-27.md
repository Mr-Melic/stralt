# Enemy synergy and formation catalog (drop 19)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-27  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–18 already taught the seven pairing words and Waves 1–17 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 18 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-26.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-26.md) (open as PR #1138) and deferred by drop 18 (PR #1134): Stave Choir, Dodeca Plug, Ring Hepta, Rime Rank, Last Dual, Rift Fresh, Prime Cap, Gait Brick, Watch Even, Rime Kennel, Hymn Stave, Dock Verse, Stave Quiet, Purse Stave, Stave Gate, Bounce Stave, Stave Hold File, Lend Hood, Cap Dock, Dual Fresh.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956), [`ENEMY_FORMATIONS_2026-10-24.md`](./ENEMY_FORMATIONS_2026-10-24.md) (drop 16 — open as PR #1005), [`ENEMY_FORMATIONS_2026-10-25.md`](./ENEMY_FORMATIONS_2026-10-25.md) (drop 17 — open as PR #1075), [`ENEMY_FORMATIONS_2026-10-26.md`](./ENEMY_FORMATIONS_2026-10-26.md) (drop 18 — open as PR #1134). Family sheets: PR #1138. Spell verbs: Wave 17 tactical ids in PR #1063 (`spell-stave-mend` … `spell-court-dock`, **except** Court Dock) plus leftover SDE Wave 16 unique CORE (`spell-ring-stride` … `spell-leap-fold`, **except** Pack Orth / Leap Fold). Cadence Floor stays SDE #906. Cadence Prime stays drop 17 (`FSN-PRIME-TAX`). Cadence Rise / Cadence Snuff stay drop 18. Cadence Cap / Cadence Dock are **this** drop.

**Hard rules (Wave 18 pack law — plus every older law still stands):**

- Do **not** pack `stave_mender` with `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (both leftover **AP + MP === 5** vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover-**both 0** vs **target**-tied ≥ 1 vs leftover **AP=0 and MP≥1** vs leftover **exactly 1/1** vs **this-caster** force vs **anyone’s** force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs leftover-cross vs unconditional). `FSN-SCORE-STEP` / `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` / `FSN-HOLLOW-SWAP` / `FSN-STILL-GRACE` / `FSN-DRY-STEP` / `FSN-LEAN-RISE` stay theirs. `FSN-STAVE-STEP` owns six-flag **sum===5** heal. Dual Keep leftover **is** leftover: 2/2 **enables Poise and Dual Plate and is not Stave**; 1/1 **enables Poise and Prime Gift and is not Stave**; (3,1) / (1,3) / (4,0) / (0,4) **enables Score**; (2,1) / (1,2) / (3,0) / (0,3) **enables Tally**; 0/0 **enables Gaunt / Hollow Gift**. Dual Keep **cannot** sit on sum 5 (max surviving leftover is 2/2 = sum 4). `leftover AP = 0` and `leftover MP = 0` is **not** a Stave window. `2 = 2` is **not** a Stave window. `3 = 1` is **Score, not Stave**. `3 = 0` is **Tally, not Stave**. Tally Lend (2,1)→(3,2) **manufactures Stave**.
- Do **not** pack `cadence_docker` with `cadence_capper` as PAIR / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (remaining `n===2` → `0` vs `n>2` → `2` vs `n===1` → `0` vs `n===1` → `2` vs `n===0` → `1` vs full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-LEAN-RISE` / `FSN-SNUFF-VERSE` / `FSN-PRIME-TAX` / `FSN-HOLLOW-SWAP` / `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR/LAG` / `FSN-IMPRINT-CHOIR` stay theirs. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`. Cadence Prime stays drop 17. Cadence Rise / Cadence Snuff stay drop 18. Cadence Tierce (`n>3` → `3`) stays Wave **19** family CORE (PR #1132 / SDE #1082) — do **not** mint `cadence_tiercer`. **Never PAIR Cap + Dock.**
- Do **not** pack `dodeca_prelate` with `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Dodeca counts as **12**. Every cell of the axis-aligned 3×4 is **occupied**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 12. Live cap is **2** — skip `FSN-STAVE-HOLD/DODECA`. `FSN-SCORE-HOLD/HENDECA` stays the 11-cell stretched-plus COURT. `FSN-TALLY-HOLD/DEC` stays the 10-cell 2×5 COURT. `FSN-POISE-HOLD/NINE` stays the solid-9 COURT.
- Do **not** pack `stave_hooder` with `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` as a PAIR (sum===5 any-range miss vs sum===4 unequal miss vs sum===3 miss vs tied-≥1 miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss vs leftover-AP **odd** miss vs leftover-**MP=0** miss vs leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss). `FSN-SCORE-QUIET/LEND` / `FSN-TALLY-QUIET/LEND` / `FSN-POISE-QUIET/LEND` / `FSN-ODD-COURT` stay theirs. `FSN-LAST-DUAL` owns Dual Plate. `FSN-STAVE-QUIET/LEND` owns Lend Hood.
- Do **not** pack `stave_stinger` with `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` as a PAIR (leftover **AP + MP === 5** poke vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover **AP odd** vs leftover **AP even ≥ 2** vs leftover **AP equals max AP** vs leftover AP **and** MP **exactly 2** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **MP odd** vs leftover **MP even ≥ 2**). `FSN-SCORE-SIP` / `FSN-TALLY-SIP` / `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-TIED-PORTAL` / `FSN-ODD-COURT/STING` / `FSN-SHOCK-EVEN` / `FSN-WATCH-ODD` stay theirs. `FSN-STAVE-SIP` owns leftover-sum-5 poke. `FSN-RIFT-FRESH` owns leftover-AP===max poke. `FSN-WATCH-EVEN` owns leftover-MP-even-≥2 poke.
- Do **not** pack `stave_stepper` with `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire` (join leftover-**sum===5** ally vs leftover-**sum===4 unequal** vs leftover-**sum===3** vs leftover-**AP===MP≥1** vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs **through-barrier peek** vs line rescue vs cover). BRIGADE `FSN-STAVE-QUIET` is the three-body lesson. `FSN-SCORE-STEP` / `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` / `FSN-SWAP-BRICK` stay theirs.
- Do **not** pack `stave_siller` with `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` as a PAIR (start-turn occupy **and leftover AP + leftover MP === 5**, paint stays vs start-turn leftover-sum===4 unequal vs start-turn leftover-sum===3 vs start-turn leftover AP === MP ≥ 1 vs start-turn leftover-both-0 vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing** vs **teleport landing** vs **Strike-from** vs **last leftover AP spent on the cell**). `FSN-SCORE-GATE` / `FSN-TALLY-GATE` / `FSN-POISE-GATE` / `FSN-GAUNT-GATE` / `FSN-SHOVE-DRIFT` / `FSN-SWAP-BRICK` / `FSN-STRIKE-DRY` stay theirs. `FSN-LAST-DUAL` owns Last Mark.
- Do **not** pack `stave_holder` with `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_staver` as PAIR / `must_scorer` as PAIR (cannot walk while leftover AP + leftover MP === 5 vs while leftover-sum===4 unequal vs while leftover-sum===3 vs while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until leftover **MP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs leftover-MP=0 **and** last AP vs **barrier adjacent** vs tools-until leftover-sum===5 **and** last AP vs tools-until leftover-sum===4 unequal **and** last AP). COURT `FSN-SCORE-HOLD` stays leftover-sum===4 unequal peel. `FSN-STAVE-HOLD` is the 3-body. **Never PAIR Stave Hold + Must Stave.**
- Do **not** pack `stave_lender` with `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **sum === 5** — **exits** to sum 7 vs +1/+1 if leftover **sum === 4 AND unequal** — **exits** to 6 vs +1/+1 if leftover **sum === 3** — **exits** to 5 **which is this family’s window** vs +1/+1 if leftover **AP === MP ≥ 1** — **keeps** the tie vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-SCORE-QUIET/LEND` / `FSN-TALLY-QUIET/LEND` / `FSN-POISE-QUIET/LEND` stay theirs. `FSN-STAVE-QUIET/LEND` is the 3-body.
- Do **not** pack `stave_sipper` with `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **sum === 5** and leftover AP ≥ 1 vs steal leftover **AP** iff leftover **sum === 4 AND unequal** vs steal leftover **AP** iff leftover **sum === 3** vs steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal leftover **AP**). `FSN-SCORE-SIP` / `FSN-TALLY-SIP` / `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-WATCH-SIP` stay theirs. `FSN-WATCH-EVEN` owns the snap **steal leftover MP**. Stave Sip on (3,2) → (2,2) **manufactures Poise**. Stave Sip on (4,1) → (3,1) **manufactures Score**.
- Do **not** pack `stave_prelate` with `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `hendeca_prelate` / `dec_prelate` / `dodeca_prelate` as a PAIR (end-turn occupy **and leftover AP + leftover MP === 5** detonate vs leftover-sum===4 unequal occupy vs leftover-sum===3 occupy vs leftover-AP===MP≥1 occupy vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait vs 11-cell occupy vs 10-cell occupy vs 12-cell occupy). `FSN-SCORE-GATE` stays leftover-sum-4-unequal detonate. `FSN-STAVE-GATE` is the leftover-sum-5 post.
- Do **not** pack `stave_bouncer` with `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**sum===5** hostile vs leftover-sum===4 unequal bounce vs leftover-sum===3 bounce vs leftover-tied bounce vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-SCORE-HOLD/BOUNCE` / `FSN-TALLY-HOLD/BOUNCE` / `FSN-POISE-HOLD/BOUNCE` / `FSN-GAUNT-HOLD/BOUNCE` stay theirs. `FSN-STAVE-HOLD/BOUNCE` is leftover-sum-5 Bounce Stave, never a two-bounce PAIR.
- Do **not** pack `must_staver` with `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `stave_holder` as a PAIR (non-Strike illegal unless leftover **sum === 5 and this spell spends last AP** vs leftover **sum === 4 AND unequal and last AP** vs leftover **sum === 3 and last AP** vs leftover **AP === MP ≥ 1 and last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until leftover-sum===5). `FSN-SCORE-HOLD` / `FSN-TALLY-HOLD` / `FSN-POISE-HOLD` / `FSN-GAUNT-HOLD` / `FSN-ODD-MUST` / `FSN-LEAN-HOLD` stay theirs.
- Do **not** pack `verse_staver` with `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as a PAIR (last-id illegal until leftover **sum === 5** vs until leftover **sum === 4 AND unequal** vs until leftover **sum === 3** vs until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock vs pets pay +1 AP to **recast last id**). `FSN-SCORE-CHOIR` / `FSN-TALLY-CHOIR` / `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR` stay theirs. `0 = 0` does **not** peel Verse Stave. `2 = 2` does **not** peel Verse Stave. `3 = 1` does **not** peel Verse Stave. `3 = 0` does **not** peel Verse Stave. `1 = 1` does **not** peel Verse Stave.
- Do **not** pack `ring_warder` with `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR (next walk dest Chebyshev **exactly 2**, knight `(2,1)` **excluded** vs **shares file** vs **shares rank** vs **(2,1)** vs **orthogonal-only** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal vs linear file charge). `FSN-FILE-HEXA` / `FSN-RANK-PENTA` / `FSN-KNIGHT-QUAD` / `FSN-EVEN-ORTH` / `FSN-ORTH-TRI` / `FSN-DIAG-OATH` / `FSN-INCH-OATH` stay theirs. Extra room `ring_gallery` is **not** this family. Orthogonal 2 and diagonal `(2,2)` **are** legal. Knight hop is **not**.
- Do **not** pack `hepta_oather` with `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `sept_prelate` / `hexa_oather` (next spell exact Chebyshev **7** vs exact **6** vs exact **5** vs exact **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0 vs seven-cell occupy vs six-cell occupy). `FSN-FILE-HEXA` leftover oaths stay theirs. Extra room `hepta_nave` is **not** this family.
- Do **not** pack `rime_reeler` with `lava_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `rime_skipper` as PAIR / `rime_mason` as PAIR / `rime_cutter` as PAIR (pull toward **ice occupancy** vs **lava occupancy** vs **spike occupancy** vs **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity vs 1-tile rime skip vs **paints** ice vs threshold poke near ice). `FSN-LAVA-FILE` / `FSN-SPIKE-SCREEN` / `FSN-PIT-AXIS` / `FSN-BRICK-WAKE` / `FSN-VOID-DWELL` / `FSN-CINDER-MARK` stay theirs. Extra room `frost_aisle` is **not** this family. `FSN-STAVE-HOLD/KENNEL` owns Rime Cut.
- Do **not** pack `rank_biter` with `file_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `rank_warder` as PAIR / `rank_lancer` as PAIR (share **rank only** bonus vs share **file only** vs shares **rank or file with the caster** vs Bresenham **blocked** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs handler-on-**rank-or-file** with a **pet** vs next-walk same-rank vs linear rank charge). `FSN-LAVA-FILE` / `FSN-SPIKE-SCREEN` / `FSN-PIT-AXIS` / `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs. **Never PAIR Rank Bite + Rank Stride / Rank Lancer.**
- Do **not** pack `last_marker` with `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` / `last_muter` as a PAIR (**last leftover AP spent on the painted cell** consume vs **Strike originating on the painted cell** vs **teleport landing** vs **force-move landing** vs **spell** confirm vs start-turn occupy consume vs end-turn occupy vs cell-enter vs start-turn leftover-pair vs start-turn tied-≥1 vs start-turn leftover-sum vs start-turn leftover-sum-4-unequal vs start-turn leftover-sum-5 vs unit walk-MP wick vs first leave vs tile bomb vs duration silence). `FSN-STRIKE-DRY` / `FSN-SWAP-BRICK` / `FSN-SHOVE-DRIFT` / `FSN-SCORE-GATE` stay theirs. Extra room `last_pulpit` is **not** this family. Walk-on is **safe**. Spell-from with leftover AP remaining is **safe**.
- Do **not** pack `dual_plater` with `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `stave_hooder` as PAIR / `score_hooder` as PAIR / `tally_hooder` as PAIR / `poise_hooder` as PAIR / `dual_keeper` as PAIR (next hit 0 **while leftover AP even ≥ 2 AND leftover MP even ≥ 2** vs leftover **MP = 0** vs leftover **MP ≥ 1** vs leftover **AP ≥ 1** vs leftover AP **odd** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs leftover **sum === 5** vs leftover **sum === 4 unequal** vs leftover **sum === 3** vs leftover **AP === MP ≥ 1** vs leftover **bank**). `FSN-STRIKE-DRY` / `FSN-ODD-COURT` / `FSN-SPENT-FULL` / `FSN-GAIT-WATCH` stay theirs. `FSN-LAST-DUAL` is paint + leftover-even-even miss; `/GOAD` is the 3-body. Leftover 0 is even **and excluded**.
- Do **not** pack `rift_skipper` with `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `rift_hook` as a PAIR (1-tile **Void Rift** walk-tax skip vs shock enter-tax vs mire enter-tax vs rime leave-tax vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy vs **swap**). `FSN-SHOCK-EVEN` / `FSN-MIRE-FILE` / `FSN-RIME-FILE` / `FSN-GLYPH-FULL` / `FSN-CINDER-FULL` / `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs. Extra room `rift_court` is **not** this family.
- Do **not** pack `fresh_stinger` with `full_stinger` / `even_stinger` / `odd_stinger` / `gaunt_stinger` / `stave_stinger` / `score_stinger` / `tied_gaiter` / `pair_purser` as a PAIR (leftover **AP equals that body’s max AP** poke vs leftover AP **≥ 3** (max unread) vs leftover **AP even ≥ 2** vs leftover AP **odd** vs leftover-both-0 vs leftover-sum===5 vs leftover-sum===4 unequal vs leftover AP **and** MP **exactly 2** vs leftover AP **exactly 2**). `FSN-SHOCK-EVEN` / `FSN-SPENT-FULL` / `FSN-STAVE-SIP` stay theirs. They may have spent down to 3 from a higher max — Fresh Sting **misses** that.
- Do **not** pack `summon_filer` with `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `cast_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (pets pay **AP** to **walk off the summoner’s file** vs pets pay **AP** to **walk off the summoner’s rank** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs pets pay **AP** to **recast last id** vs pets pay **AP** to start a **spell** vs pets **next hit 0** vs target’s next **non-Strike** deals 0 vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-STAVE-HOLD/KENNEL` is Rime Kennel, never a two-pet PAIR. `FSN-SCORE-HOLD/KENNEL` / `FSN-TALLY-HOLD/KENNEL` / `FSN-POISE-HOLD/KENNEL` / `FSN-GAUNT-HOLD/KENNEL` / `FSN-LEAN-HOLD/TOLL` stay theirs.
- Do **not** pack `prime_gifter` with `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `cadence_primer` as a PAIR. `FSN-STAVE-STEP` stays both-bodies leftover-sum===5. `FSN-SCORE-STEP` stays both-bodies leftover-sum===4 unequal. Prime Gift is leftover **exactly 1/1**. Dual Keep 1/1 **is** this window if it survives. Do **not** invent `prime_cantor`. Do **not** name it `cadence_primer`.
- Do **not** pack `cadence_capper` with `cadence_docker` as PAIR / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` / `cap_warder`. `FSN-PRIME-CAP` is remaining `n>2→2` plus Prime Gift. `FSN-DOCK-VERSE` is remaining `2→0` plus Verse Stave. **Never PAIR Cap + Dock.** Do **not** restamp `floor_precentor` / `cap_precentor` (Pack Cap).
- Do **not** pack `gait_toller` with `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` (next-**walk** +1 AP if leftover **MP = 0** vs next-**spell** +1 AP if leftover MP = 0 vs Struck-last-turn next-**spell** +1 vs Wave-7 walk-pool vs pet-walk AP vs Struck-last-turn next-**walk** +1 vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-STILL-BRACE` / `FSN-PRIME-TAX` / `FSN-STRIKE-TAX` / `FSN-DEBT-ORBIT` / `FSN-SPENT-CRACK` stay theirs. CADRE `FSN-GAIT-BRICK` is the three-body lesson (Gait Toll + Brick Hold + Castellan), never Toll+Scribe PAIR.
- Do **not** pack `brick_holder` with `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `stave_holder` as PAIR / `screen_biter` as PAIR (cannot **walk** while adjacent to a **barrier** vs next hit 0 if a **barrier is adjacent** vs step **through** an adjacent barrier vs push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras vs leftover-sum===5 walk lock vs Bresenham-blocked bite). `FSN-STILL-BRACE` / `FSN-SWAP-BRICK` / `FSN-POISE-HOLD/NUDGE` / `FSN-DEBT-ORBIT` / `FSN-GAIT-WATCH/GUN` / `FSN-BRICK-WAKE` / `FSN-SPIKE-SCREEN` stay theirs. `FSN-GAIT-BRICK` owns the camp, never Hold+Brace PAIR. Brick Hold **does not negate hits** and **does not move** the barrier.
- Do **not** pack `watch_drainer` with `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR (snap **steals 1 leftover MP** from the walker vs snap **zeros leftover MP** vs snap **banks** leftover AP vs snap **steals leftover AP** vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-WATCH-ODD` / `FSN-WATCH-BANK` / `FSN-WATCH-SIP` / `FSN-GAIT-WATCH` / `FSN-OWN-WATCH` / `FSN-OFF-FEE` stay theirs. `FSN-WATCH-EVEN/GUN` is Watch Even Hunt, never Drain+Gun PAIR.
- Do **not** pack `even_gaiter` with `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `even_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as a PAIR (leftover **MP even and ≥ 2** poke vs leftover **MP odd** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **AP even ≥ 2** vs leftover AP **and** MP **exactly 2** vs leftover MP ≥ 3 +RES vs leftover MP **= 0**). `FSN-WATCH-ODD` / `FSN-LONE-HAZARD` / `FSN-PAIR-GIFT` / `FSN-SHOCK-EVEN` stay theirs. Leftover MP **0 is even and excluded**.
- Do **not** pack `rime_cutter` with `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `rime_reeler` as PAIR / `rime_skipper` as PAIR / `null_censor` as PAIR (bonus vs **ice occupancy** Chebyshev ≤ 2 vs **spike occupancy** vs **painted hazard** vs **world portal** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs **pulls** toward ice vs ignores rime tax vs Weaken/Expose). `FSN-SCORE-HOLD/KENNEL` / `FSN-LONE-HAZARD` / `FSN-TIED-PORTAL` / `FSN-SPIKE-SCREEN` stay theirs. Twin Gate pads do **not** count.
- Do **not** pack `cast_plater` with `summon_plater` as PAIR / `summon_filer` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR / `dual_plater` as PAIR (target’s next **non-Strike spell** deals 0 vs pets treat the **next hit as 0** vs walk-off-file AP tax vs pets ignore force vs brood overlay vs split absorb vs leftover-MP=0 plate vs pets cannot leave vs leftover even/even miss). `FSN-STAVE-HOLD/KENNEL` is Rime Kennel, never File+Plate PAIR.
- Do **not** pack `hymn_turner` with `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR (invert leftover AP↔MP on **two allies**; caster unchanged vs **two hostiles** vs **one** hostile invert vs two-body leftover **cross** vs **tile** swap vs leftover **bank**). CADRE `FSN-PURSE-SCORE` stays the 3-body two-hostile invert then Score Sip. `FSN-DUEL-SCORE` stays the 3-body two-hostile invert. `FSN-CROSS-POISE` stays the 3-body cross. `FSN-HYMN-STAVE` is the 3-body two-**ally** invert. Choir Hymn is a Wave-1 **heal**.
- Drop 4–18 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two four-flag **sum===3** heals; no two four-flag **sum===4 unequal** heals; no two four-flag **sum===5** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals; no two leftover-sum heals; no two leftover-sum-4-unequal heals; no two leftover-sum-5 heals; no two remaining-1 rewrites as PAIR; no two remaining-2 rewrites as PAIR).

Wave 19 families do **not** exist yet. Same-day 2026-10-26 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-26.md`, open as PR #1132: Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn) and SDE Wave 17 unique CORE (`spell-tern-stride` … `spell-lane-fold`, PR #1082, **except** Pack Ring / Lane Fold unless a later boss sheet claims them) stay Wave **19** family CORE. Do **not** mint `FSN-*` ids that require those Wave 19 families in this drop. Cadence Floor is **already owned** by SDE #906. Cadence Prime is **already owned** by drop 17. Cadence Rise / Cadence Snuff are **already owned** by drop 18. Cadence Cap / Cadence Dock are **this** drop.

Court Dock / Pack Orth / Leap Fold / Court Tierce / Pack Ring / Lane Fold stay **boss / closed-class / later family**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend (Hollow Gift is **target-only** both-pools; Stave Mend is **both bodies leftover sum === 5**). Do **not** clone Equal Gift as Prime Gift (Equal Gift is **target-only** tied ≥ 1; Prime Gift is leftover **exactly 1/1**). Do **not** clone Duel Turn as Hymn Turn (Duel Turn is **two hostiles**; Hymn Turn is **two allies**, caster stays). Do **not** clone Watch Drain as Watch Root or Watch Sip (Drain **steals leftover MP**; Root **zeros leftover MP**; Sip **steals leftover AP**). Do **not** clone Rank Bite as File Bite or Axis Bite (Rank Bite is **rank-only**; File Bite is **file-only**; Axis Bite is rank **or** file). Do **not** clone Dual Plate as Dual Keep or Poise Hood (Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss; Dual Keep is a **bank**; Poise Hood is leftover **AP === MP ≥ 1**). Do **not** clone Brick Hold as Brick Brace (Hold is a **walk lock**; Brace is a **hit miss**).

**Do not spawn Stave Mend / Stave Sting / Stave Step / Stave Sill / Stave Hold / Stave Lend / Stave Sip / Stave Post / Stave Bounce / Must Stave / Verse Stave / Stave Hood / Dual Plate / Fresh Sting / Even Gait / Prime Gift / Gait Toll sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Sum is integer leftover AP + leftover MP. Equality is integer `===`. Inequality is integer `!==`. Missing field → Stave Mend / Stave Sting / Prime Gift / Hymn Turn pay **0** extra or skip (fail closed). Until those writers land, show `FSN-SCORE-STEP` / `FSN-SCORE-SIP` / `FSN-TALLY-STEP` / `FSN-POISE-STEP` instead of the matching Wave 18 id.

**Do not spawn Verse Stave sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Stave fizzles (fail closed). Forced-move does **not** peel Verse Stave. `0 = 0` does **not** lift. `2 = 2` does **not** lift. `3 = 1` does **not** lift. `3 = 0` does **not** lift. `1 = 1` does **not** lift. Until that writer lands, show `FSN-SCORE-CHOIR` instead of `FSN-STAVE-CHOIR` / `FSN-DOCK-VERSE`.

**Do not spawn Last Mark sheets until a battle-walk writer snapshots last leftover AP spent while occupying the painted cell.** Walk-on does not arm Last Mark. Spell-from with leftover AP remaining does not arm Last Mark. Strike-from with leftover AP remaining does not arm Last Mark. Teleport / Swap / Stave Step / Brick Step do not pay. Until that writer lands, show `FSN-STRIKE-DRY` instead of `FSN-LAST-DUAL`.

**Do not spawn Dodeca Plug until `inferSummonArchetype` keys `summonAI === "dodecaspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 12.** Live cap is 2. Name heuristics stay a bug. Dodeca fills the stationary-post **and** the multi-cell-system cap (12). Every cell of the 3×4 stays occupied. **Diagonal walk around the rectangle** is the designed counter vs Hendeca’s plus. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost/ninespan/tallypost/decspan/scorepost/hendecaspan/stavepost onto that body.

**Do not spawn Stave Post sheets until `inferSummonArchetype` keys `summonAI === "stavepost"` and remaining cap ≥ 1.** End-turn occupy with leftover sum ≠ 5 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window). Dual Keep leftover-sum 4 unequal is **safe** (Score Post’s window). Dual Keep leftover-sum 3 is **safe** (Tally Post’s window). Dual Keep 1/1 is **safe**. Only leftover-sum===5 end-turn occupy detonates.

**Stave Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Rime Reel is the **eleventh** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava, then **ice occupancy**). Dest is **toward**, not onto, a world portal. Brick Hold **does not move** the barrier and **does not negate hits** — destroy it and walks resume; lock **stays** until duration.

Wave 18 adds **zero** facing CORE cards **and zero** new force-gated CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop. `forcedMovedThisTurn` remains an implementation prerequisite for Waves 10–16 force sheets, not this drop.

---

## Grounding (live, 2026-10-27)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–18. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920; zone object at 4683–4687 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3 at 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| Integer RES/SP live path | `progression.ts` `getEnemyBaseStats` 180–186 |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 (`spellType === "heal"` **or** `healAmount > 0`); `family.includes("berserk")` at 467–472 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1702 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Stave Step is occupancy dest, **not** `isSwap`. Rime Reel is the eleventh **cast** caller of attract. Brick Hold is a barrier-adjacent **walk lock**, not `applyPushback` and not Brick Brace / Brick Step / Brick Nudge. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 18 CORE rows stay `mpCost: 0`. Stave Sip / Stave Lend / Hymn Turn / Watch Drain rewrite **current leftover AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` / last-AP-on-cell | **Absent** — Stave / Prime Gift / Hymn Turn / Verse Stave / Last Mark / Dual Plate / Fresh Sting / Even Gait / Gait Toll / Watch Drain fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / ninespan / poisepost / tallypost / decspan / scorepost / hendecaspan / **stavepost** / **dodecaspan** bodies **replace** the random overlay. Cap one of those engines. Dodeca Span **is** the 12-cell 3×4 post and needs remaining cap ≥ 12.
3. Any `healAmount` steals healer. **Stave Mend / Prime Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Primer, Toller, Watcher, Cutter, Turner, Verser, Docker, Capper, Bracer, or Bouncer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Tally Lend / Score Lend / Stave Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Tally Mend / Score Mend / Stave Mend / Prime Gift / Lean Gift / Hollow Gift / Equal Gift / Drift Gift / Shove Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 18 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Stave Sip / Watch Drain / Hymn Turn / Stave Lend rewrite current leftover AP/MP.
6. `inferSummonArchetype` must key `summonAI === "dodecaspan"` **and** `"stavepost"` **before** any Dodeca / Stave-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Hold that **locks walks beside an already planted barrier** (it does not mint a new one from empty floor unless the CADRE’s Castellan already owns a door, and destroying the barrier is a complete answer). Stave Hold / Must Stave / Verse Stave / Hepta Oath / Ring Stride are **not** `instantKill`.
8. Stave-step dest / rime-reel dest / stave-post plant / dodeca plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Stave Step into a wall is a fizzle (no crush). Rime Reel dest must leave a walk-off that is **not** the ice cell **and not** a world portal. Dodeca plant must leave a **diagonal** walk-off around the 3×4 (the designed counter vs Hendeca’s plus) and `findPath` after the hypothetical occupy must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Stave Sip **or** one Score Sip **or** one Tally Sip **or** one Watch Sip source per pack, not both stacking past that cap. Watch Drain **steals 1 leftover MP** (not a dump, not an AP steal) and does not stack with Dual Keep past that cap (Dual Keep leftover that survives turn start **is** leftover — Drain then takes 1 MP). Watch Root **zeros leftover MP**; it is drop 18, not this drop. Stave Hold is a **walk lock with a leftover-sum-5 key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise + Tally Hold + Must Tally + Score Hold + Must Score + Stave Hold + Must Stave + Brick Hold on the same AP bar.
10. Walk-spend: Stave Step / Rime Reel / Stave Post plant / Dodeca plant / Brick Hold **do not** increment `walkMpSpentThisTurn`. Prime Gift / Stave Mend gate leftover pools, not walk-spend.
11. Last-id: Verse Stave **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Stave. Dual Keep leftover **is** leftover; `0 = 0` does **not** lift; `2 = 2` does **not** lift; `3 = 1` does **not** lift; `3 = 0` does **not** lift; `1 = 1` does **not** lift.
12. Last-AP-on-cell: Last Mark **fail closed** until last leftover AP spent while occupying the painted cell exists. Walk last turn does **not** arm it. Spell last turn with leftover AP remaining does **not** arm it. Strike last turn with leftover AP remaining does **not** arm it. Teleport / Swap / Stave Step / Brick Step do not pay.
13. Remaining rewrite: Cadence Cap writes `n>2→2`. Cadence Dock writes `2→0`. **Never both on the same AP bar.** Cadence Floor (`n>1→1`) stays SDE #906. Cadence Prime (`0→1`) stays drop 17. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) stay drop 18. Cadence Tierce (`n>3→3`) stays Wave 19.

### Relative difficulty (same grades as drops 1–18)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…18 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a leftover-sum tell / a leftover-sum-4-unequal tell / a leftover-sum-5 tell / a leftover-1/1 tell / a leftover-even-even miss / a leftover-AP===max tell / a leftover-MP-even-≥2 tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss / a leftover-AP-odd miss / a leftover-MP-odd miss / a leftover-AP-even-≥2 miss / a remaining-0 tell / a remaining-1 tell / a remaining-2 tell / a remaining-n>2 tell / a Chebyshev-2 ring / an exact-7 oath / an ice occupancy / a last-AP-on-cell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / stepper / warder / holder): pack median + one step.
- Backliner (stave-mend / prime-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / primer / docker / capper / watch / turn): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer, optic): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 19)

Drop 1–18 overlays still apply. These are **additional jobs** for Wave 18 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-STAVE-MEND` | `queen` **with** heal | proposed `stave_mender` | `spell-stave-mend`, `starter-shield` | healer; skip if either leftover sum ≠ 5 or missing HP < 8; Dual Keep 2/2 is **Poise / Dual Plate, skip**; Dual Keep leftover-sum 4 unequal is **Score, skip**; Dual Keep leftover-sum 3 is **Tally, skip**; Dual Keep 1/1 is **Prime Gift, skip**; extra door `stave_cantor` is **not** this family |
| `ROLE-DODECA` | `rook` **without** heal | proposed `dodeca_prelate` | `physical_attack`, `spell-dodeca-span` | `isSummoner` for dodeca only; post `summonAI: "dodecaspan"`, axis-aligned 3×4, empty kit, remaining cap ≥ 12; skip if any of twelve cells blocked; every cell occupied; click = cell of the 3×4 closest to the caster |
| `ROLE-HYMN-TURN` | `queen` **without** heal | proposed `hymn_turner` | `starter-frost`, `spell-hymn-turn` | controller; skip if pack size < 3 **or** both leftover pairs already equal; invert two **allies**; caster leftover **unchanged**; **not** Duel Turn / Purse Turn / Bar Cross / Dual Keep |
| `ROLE-STAVE-HOOD` | `knight` **without** heal | proposed `stave_hooder` | `starter-shield`, `spell-stave-hood` | guardian; skip if leftover sum ≠ 5; any-range miss while sum===5; consume on miss |
| `ROLE-STAVE-STING` | `pawn` **without** heal | proposed `stave_stinger` | `physical_attack`, `spell-stave-sting` | flanker; skip if leftover sum ≠ 5 unless 10 still kills; Dual Keep **cannot** open the 8 |
| `ROLE-STAVE-STEP` | `queen` **without** heal | proposed `stave_stepper` | `starter-frost`, `spell-stave-step` | protector; skip if ally leftover sum ≠ 5 or no free adj; relocate, **not** `isSwap` |
| `ROLE-STAVE-SILL` | `rook` **without** heal | proposed `stave_siller` | `starter-frost`, `spell-stave-sill` | setter; skip if occupant leftover sum already ≠ 5; occupant leftover-sum===5 at **start of their turn** takes 8; paint stays |
| `ROLE-STAVE-HOLD` | `knight` **without** heal | proposed `stave_holder` | `physical_attack`, `spell-stave-hold` | controller; skip if leftover sum ≠ 5; cannot walk while leftover-sum===5; spells stay legal; **never PAIR with Must Stave** |
| `ROLE-STAVE-LEND` | `bishop` **without** heal | proposed `stave_lender` | `starter-frost`, `spell-stave-lend` | buffer; skip if ally leftover sum ≠ 5; +1 current AP **and** +1 current MP (**exits** to sum 7) |
| `ROLE-STAVE-SIP` | `pawn` **without** heal | proposed `stave_sipper` | `physical_attack`, `spell-stave-sip` | flanker; skip if leftover sum ≠ 5 **or** leftover AP = 0; steal 1 leftover AP; (0,5) fizzles; (3,2)→(2,2) **manufactures Poise**; (4,1)→(3,1) **manufactures Score** |
| `ROLE-STAVE-POST` | `pawn` **without** heal | proposed `stave_prelate` | `physical_attack`, `spell-stave-post` | `isSummoner` for stavepost only; post `summonAI: "stavepost"`, remaining cap ≥ 1; end-turn leftover-sum===5 occupy detonates; walk-on / dump-a-pool / 2/2-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe |
| `ROLE-STAVE-BOUNCE` | `queen` **without** heal | proposed `stave_bouncer` | `starter-frost`, `spell-stave-bounce` | artillery; skip bounce without a second leftover-sum===5 hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-STAVE` | `knight` **without** heal | proposed `must_staver` | `physical_attack`, `spell-must-stave` | controller; skip if leftover sum ≠ 5; non-Strike illegal unless leftover-sum===5 **and** last AP; Strike stays legal; **never PAIR with Stave Hold** |
| `ROLE-VERSE-STAVE` | `bishop` **without** heal | proposed `verse_staver` | `starter-frost`, `spell-verse-stave` | controller; skip if no `lastResolvedSpellId`; leftover sum === 5 peels; `0 = 0` does **not**; `2 = 2` does **not**; `3 = 1` does **not**; `1 = 1` does **not**; shove does **not** |
| `ROLE-RING-STRIDE` | `knight` **without** heal | proposed `ring_warder` | `physical_attack`, `spell-ring-stride` | controller; skip if player MP = 0 or no legal Chebyshev-2 non-knight floor; next walk dest Chebyshev **exactly 2**, knight `(2,1)` **excluded**; extra room `ring_gallery` is **not** this family |
| `ROLE-HEPTA-OATH` | `bishop` **without** heal | proposed `hepta_oather` | `starter-frost`, `spell-hepta-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 7; Strike stays legal; extra room `hepta_nave` is **not** this family |
| `ROLE-RIME-REEL` | `bishop` **without** heal | proposed `rime_reeler` | `starter-frost`, `spell-rime-reel` | caster; skip if no ice occupancy in 6; dest is **toward**, not onto; eleventh `applyAttract` flavor; extra room `frost_aisle` is **not** this family |
| `ROLE-RANK-BITE` | `knight` **without** heal | proposed `rank_biter` | `physical_attack`, `spell-rank-bite` | flanker; skip rider if they do not share **rank only** unless 10 still kills; 10 + 10 if `target.y == caster.y` and `target.x != caster.x`; file-only → 10 only |
| `ROLE-LAST-MARK` | `bishop` **without** heal | proposed `last_marker` | `starter-frost`, `spell-last-mark` | setter; skip if no last-AP spender in the pack **or** player kit; 0 on cast; last leftover AP from the paint detonates and consumes; walk-on is **free**; leftover-AP-remaining spell-from is **free**; extra room `last_pulpit` is **not** this family |
| `ROLE-DUAL-PLATE` | `rook` **without** heal | proposed `dual_plater` | `starter-shield`, `spell-dual-plate` | guardian; skip if leftover AP or leftover MP is odd **or** < 2; leftover even/even ≥ 2 miss; leftover 0 excluded; leftover 1/1 lands |
| `ROLE-RIFT-SKIP` | `bishop` **without** heal | proposed `rift_skipper` | `physical_attack`, `spell-rift-skip` | flanker; skip if the next walk is not a 1-step across Void Rift; shock/mire/rime/lava/spike/glyph still tick; length ≥ 2 pays; extra room `rift_court` is **not** this family |
| `ROLE-FRESH-STING` | `pawn` **without** heal | proposed `fresh_stinger` | `physical_attack`, `spell-fresh-sting` | charger; skip rider if leftover AP ≠ max AP unless 10 still kills; leftover 3 from a higher max **misses** |
| `ROLE-SUMMON-FILE` | `king` **without** heal | proposed `summon_filer` | `starter-frost`, `spell-summon-file` | controller; skip if no allied summon; pets pay +1 AP to **walk off the summoner’s file**; on-file walks are free; drop if `summonAI` empty |
| `ROLE-PRIME-GIFT` | `queen` **with** heal | proposed `prime_gifter` | `spell-prime-gift`, `starter-shield` | healer; skip if leftover is not **exactly 1/1** or missing HP < 10; Dual Keep 1/1 **opens** the window; Dual Keep 2/2 is Poise, skip; **not** Stave / Score / Tally / Equal / Lean / Hollow |
| `ROLE-GAIT-TOLL` | `bishop` **without** heal | proposed `gait_toller` | `starter-frost`, `spell-gait-toll` | controller; skip if leftover MP ≥ 1; next **walk** +1 AP if leftover **MP = 0**; relocate / Swap do not pay |
| `ROLE-BRICK-HOLD` | `rook` **without** heal | proposed `brick_holder` | `physical_attack`, `spell-brick-hold` | controller; skip if no barrier is adjacent; cannot walk while a barrier is adjacent; destroy the barrier and walks resume; lock **stays**; never Brace / Step |
| `ROLE-WATCH-DRAIN` | `bishop` **without** heal | proposed `watch_drainer` | `starter-frost`, `spell-watch-drain` | artillery; skip if leftover MP already 0 **or** no overwatch is armed; snap still deals; **walker** leftover MP **−1**, transferred to watcher; **not** Watch Root / Watch Sip / Watch Bank |
| `ROLE-EVEN-GAIT` | `pawn` **without** heal | proposed `even_gaiter` | `physical_attack`, `spell-even-gait` | flanker; skip if leftover MP is odd **or** leftover MP = 0 unless 10 still kills; leftover MP 0 is even **and excluded** |
| `ROLE-RIME-CUT` | `pawn` **without** heal | proposed `rime_cutter` | `physical_attack`, `spell-rime-cut` | flanker; skip rider if target is Chebyshev > 2 from every ice occupancy cell; Twin Gate pads do **not** count |
| `ROLE-CAST-PLATE` | `king` **without** heal | proposed `cast_plater` | `starter-frost`, `spell-cast-plate` | protector; skip if they will Strike; target’s next **non-Strike** deals 0; AP still spent; Strike still deals full |
| `ROLE-CADENCE-CAP` | `bishop` **without** heal | proposed `cadence_capper` | `starter-frost`, `spell-cadence-cap` | controller; skip if every remaining is already ≤ 2; remaining `n>2` → `2`; zeros stay 0; ones stay 1; twos stay 2; **never PAIR with Dock** |
| `ROLE-CADENCE-DOCK` | `bishop` **without** heal | proposed `cadence_docker` | `starter-frost`, `spell-cadence-dock` | controller; skip if every remaining is already ≠ 2; remaining `n===2` → `0`; zeros stay 0; `n===1` and `n>2` unchanged; extra door `dock_precentor` is **not** this family; **never PAIR with Cap** |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) / `ROLE-MIST` (`mist_walker`) / `ROLE-OPTIC` (`dim_optic`) / `ROLE-PLATE` (`plate_warden`) / `ROLE-SCORE-STING` (`score_stinger`) / `ROLE-TALLY-STING` (`tally_stinger`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Primer, Docker, Capper, Stave-Mend, Prime-Gift, Dodeca, or Stave-Post.

### Fair-fight rules (every sheet)

Same as drops 1–18, plus Wave 18:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier. Dodeca sheets also need **≥ 1 diagonal** walk-off around the 3×4.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Stave Post never detonates on leftover sum ≠ 5.
- Swap / pull / push / stave-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack. Watch Drain is a leftover-MP **steal of 1**, not a dump and not an AP steal.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Stave Bounce / Score Bounce / Tally Bounce / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Stave Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine **or** tallypost **or** dec **or** scorepost **or** hendeca **or** stavepost **or** dodeca — never two engines). Dodeca is illegal until remaining cap ≥ 12.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Hold **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Never seal the last aisle with a new barrier.
- Dual Keep **opens** Poise on 2/2 or 1/1, **opens Dual Plate** on 2/2 (and 4/2 if a later bank exists), **opens Prime Gift** on 1/1, **opens** Tally on (2,1)/(1,2)/(3,0)/(0,3), **opens** Score on (4,0)/(0,4)/(3,1)/(1,3), **cannot open Stave**, and **closes** Gaunt / Hollow Gift / Lean Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold leftover **exactly 1/1** for Prime Gift. Hold a leftover **sum of 3** for Tally. Hold a leftover **sum of 4 without tying** for Score. Hold leftover **AP + MP === 5** for Stave — Dual Keep cannot fake it; Tally Lend can.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-STAVE-STEP` | PAIR | leftover-sum===5 healer + leftover-sum===5 joiner | this drop |
| `FSN-STAVE-SIP` | PAIR | leftover-sum===5 poke + leftover-sum leftover-AP steal | this drop |
| `FSN-RING-HEPTA` | PAIR | next walk Chebyshev 2 (not knight) + next-spell exact 7 | this drop |
| `FSN-RIME-RANK` | PAIR | pull toward ice + share-rank-only bite | this drop |
| `FSN-STAVE-GATE` | CELL | leftover-sum===5 post + start-turn leftover-sum===5 sill | this drop |
| `FSN-LAST-DUAL` | CELL | last-AP-on-cell paint + leftover even/even ≥ 2 miss | this drop |
| `FSN-RIFT-FRESH` | CELL | 1-tile Void Rift skip + leftover-AP===max poke | this drop |
| `FSN-WATCH-EVEN` | CELL | overwatch snap steals leftover MP + leftover-MP-even ≥ 2 poke | this drop |
| `FSN-STAVE-CHOIR` | BRIGADE | leftover-sum===5 heal + last-id until leftover-sum===5 + ignite | this drop |
| `FSN-PRIME-CAP` | BRIGADE | leftover 1/1 heal + remaining n>2→2 + font | this drop |
| `FSN-STAVE-QUIET` | BRIGADE | stave step + stave mend + cover | this drop |
| `FSN-HYMN-STAVE` | BRIGADE | two-ally leftover invert + leftover-sum===5 heal + leftover-sum===5 sting | this drop |
| `FSN-DOCK-VERSE` | CADRE | remaining 2→0 + last-id until leftover-sum===5 + glyph tax | this drop |
| `FSN-GAIT-BRICK` | CADRE | leftover-MP=0 walk tax + barrier-adjacent walk lock + turret | this drop |
| `FSN-PURSE-STAVE` | CADRE | two-ally leftover invert + leftover-sum===5 sip manufactures Score + leftover-sum-4-unequal sting | this drop |
| `FSN-STAVE-HOLD` | COURT | walk-until leftover-sum===5 + tools-until leftover-sum===5 **and** last AP + warden | this drop |

Named packs as variants: `FSN-STAVE-GATE/STING` (Stave Gate full), `FSN-RIME-RANK/GLYPH` (Rime Rank full), `FSN-RING-HEPTA/GUN` (Ring Hepta full), `FSN-LAST-DUAL/GOAD` (Last Dual full — never Mark+Goad PAIR), `FSN-LAST-DUAL/FRESH` (Dual Fresh — never Plate+Sting PAIR), `FSN-RIFT-FRESH/TIDE` (Rift Fresh full), `FSN-WATCH-EVEN/GUN` (Watch Even Hunt full — never Drain+Gun PAIR), `FSN-STAVE-QUIET/LEND` (Lend Hood escort), `FSN-STAVE-HOLD/DODECA` (Dodeca Plug — skip until remaining cap ≥ 12; live cap is 2), `FSN-STAVE-HOLD/BOUNCE` (Bounce Stave leftover-sum===5), `FSN-STAVE-HOLD/KENNEL` (Rime Kennel — never File+Plate PAIR), `FSN-DOCK-VERSE/CAP` (Cap Dock — never Cap+Dock PAIR).

---

## Formations

### FSN-STAVE-STEP

FORMATION_ID: `FSN-STAVE-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-STAVE-MEND` — `queen` **with** heal / proposed `stave_mender` — pack median — back
- `ROLE-STAVE-STEP` — `queen` **without** heal / proposed `stave_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Stave Mend is a heal kit; kit band 0 has no heal). Show `FSN-SCORE-STEP` instead (four leftover-sum-4-unequal tell without the leftover-sum-5 8).
- Mender kit: Stave Mend + Shield. **No** Inferno, no Enrage, no Score / Tally / Poise / Gaunt / Hollow / Equal / Lean / Prime / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `stave_cantor` is **not** this family.
- Stepper kit: Stave Step + Frost. **No** Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Brick Step / Cover on PAIR (those are `FSN-STAVE-QUIET` / `FSN-SWAP-BRICK`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-SCORE-STEP` **or** `FSN-TALLY-STEP` (player has seen leftover **AP + MP === 4 AND unequal** heal **or** leftover **AP + MP === 3** heal; this sheet cashes leftover **AP + MP === 5** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. Dual Keep **cannot** fake this. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 1` does **not** fire. `3 = 0` does **not** fire. `1 = 1` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Stave Mend (8 HP) pays only if **caster and target** leftover AP + leftover MP **=== 5** after the 3 AP is paid. Legal pairs (5,0) (0,5) (4,1) (1,4) (3,2) (2,3). Dual Keep 2/2 is Poise / Dual Plate — Shield queen. Dual Keep leftover-sum 4 unequal is Score — Shield queen. Dual Keep leftover-sum 3 is Tally — Shield queen. Dual Keep 1/1 is Prime Gift — Shield queen.
- Stave Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover sum === 5. It is not Score Step, not Tally Step, not Poise Step, and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).
- Tally Lend is **not** on this PAIR. It **manufactures** Stave on a later COURT (`FSN-STAVE-QUIET/LEND` does not own Tally Lend either).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover sum === 5; if the Mender is still 2/2, leftover-sum 4 unequal, leftover-sum 3, or 1/1, Stepper Frosts.
- Mender Stave-Mends only if both leftover sums === 5 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Score Mend, Tally Mend, Poise Mend, or Prime Gift.

SYNERGY:

- Leftover-sum===5 healer + leftover-sum===5 joiner. Wave 17 Score Step standing on the **next leftover-sum** (5). Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP so the sum leaves 5 **or** Dual Keep 2/2 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump to 1/1 — is a complete answer.

PLAYER_THREAT:

- Slow refill if you sit (3,2) on **both** bodies. Spike is low. Misplay is Rooting neither and holding leftover-sum 5 into an 8 that just landed. Dual Keep cannot accidentally open this.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to leave sum 5. Dual Keep 2/2 (Poise / Dual Plate window, not this one). Dump to leftover-sum 4 unequal (Score window, not this one). Dump to leftover-sum 3 (Tally window, not this one). Dump to 1/1 (Prime Gift window, not this one). Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a leftover-sum-5 ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced leftover-sum-5 heal reads as a lock). Dual Keep cannot manufacture this window, so a tunnel that only Dual-Keeps is **not** this sheet’s lock — still reject cramped closets.

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 5.
- Stepper: protector; skip if ally leftover sum ≠ 5 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-STAVE-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-STAVE-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-STAVE-SIP

FORMATION_ID: `FSN-STAVE-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-STAVE-STING` — `pawn` **without** heal / proposed `stave_stinger` — pack median or −1 — starts wide
- `ROLE-STAVE-SIP` — `pawn` **without** heal / proposed `stave_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-SCORE-SIP` (leftover **AP + MP === 4 AND unequal** poke + leftover-sum leftover-AP steal) and `FSN-TALLY-SIP` (leftover **AP + MP === 3** poke + leftover-sum leftover-AP steal) and `FSN-POISE-SIP` (leftover **AP === MP ≥ 1** poke + tied leftover-AP steal). Pressure is the **leftover-sum===5** window. Dual Keep **cannot** open either rider. (0,5) opens Sting and **fizzles** Sip.
- Band 0: Stinger Strike only; Sipper Strike only (Stave Sting / Stave Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-SCORE-SIP`.
- Elite: Stinger only. Sipper never gets Score Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-SCORE-SIP` **or** `FSN-STAVE-STEP` (player has seen leftover-sum as a resource **or** the leftover-sum-5 heal).
- Full Sting / Fresh Sting / Lone Gait / Tied Gait / Odd Sting / Even Sting / Even Gait / Ready / Pair Gait stay off PAIR (PAIR bans). Stave Hold stays off (that is `FSN-STAVE-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Stave Sting: 10, +8 iff **target** leftover AP + leftover MP === 5. Dual Keep leftover **cannot** open the 8. `2 = 2` is Poise Sting / Dual Plate’s window, not this one. `3 = 1` is Score Sting’s window, not this one. `3 = 0` is Tally Sting’s window, not this one. `0 = 0` is Gaunt Sting’s window, not this one. `1 = 1` is Prime Gift, not a sting window.
- Stave Sip: steal 1 leftover AP iff leftover sum === 5 **and leftover AP ≥ 1**. (5,0) → (4,0) **manufactures Score**. (4,1) → (3,1) **manufactures Score**. (3,2) → (2,2) **manufactures Poise**. (2,3) → (1,3) **manufactures Score**. (1,4) → (0,4) **manufactures Score**. (0,5) fizzles. Inverse of Stave Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover sum === 5 and leftover AP ≥ 1; else Strikes.
- Stinger lurks at 3 and commits when leftover sum === 5 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Leftover-sum-5 poke + leftover-sum leftover-AP steal. Wave 17 Score Sip standing on the **next leftover-sum** (5). Combination, not a new sprite. Stave Sip **manufactures Poise or Score** — that is the teaching tell for `FSN-PURSE-STAVE`.

PLAYER_THREAT:

- Getting leftover-sum-5 Stung, then Sipped off (3,2) into a Poise window you did not ask for, or off (4,1) into Score. Spike is one 18. Recoverable: sit (0,5), sit 2/2, dump a pool.

COUNTERPLAY:

- Hold leftover MP only (0,5) — Sip fizzles, Sting still fires so **dump MP too**. Dual Keep 2/2 (Poise / Dual Plate, not this). Spend 1 leftover AP off (3,2). Kill the Stinger (glass). The Sipper without leftover-sum-5 is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit.
- No Thorned Ground on the only path to the Sipper.

AI_REQUIREMENTS:

- Stinger: flanker; skip if leftover sum ≠ 5 unless 10 still kills.
- Sipper: flanker; skip leftover AP = 0.
- Soph 1–2.

VARIANTS:

- `FSN-STAVE-SIP/E-STING` — elite Stinger, still no Watch Sip on PAIR.
- `FSN-STAVE-GATE/STING` is the CELL with Post — do not merge.

STATUS: PROPOSED

---

### FSN-RING-HEPTA

FORMATION_ID: `FSN-RING-HEPTA`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-RING-STRIDE` — `knight` **without** heal / proposed `ring_warder` — pack median + 1 — owns one Chebyshev-2 ring
- `ROLE-HEPTA-OATH` — `bishop` **without** heal / proposed `hepta_oather` — pack median — next-spell exact 7

VARIANT_RULES:

- Distinct from `FSN-FILE-HEXA` (next walk **same file** + next-spell exact **6**) and `FSN-RANK-PENTA` (next walk **same rank** + next-spell exact **5**) and `FSN-KNIGHT-QUAD` (next walk **(2,1)** + next-spell exact **4**). This sheet is **Chebyshev-2 walk, knight hop excluded** plus **exact Chebyshev 7**. Strike stays legal on both bodies.
- Band 0: both Frost / Strike only; the AI contract still refuses Chebyshev-1 walks, knight hops, and off-7 spells even before the clone ids exist.
- Band 1: Warder may hold Slow. Oather may hold Slow. Never Inferno. Never File Stride / Hexa Oath / Rank Bite / Rank Lancer on PAIR (PAIR bans). Extra rooms `ring_gallery` / `hepta_nave` are **not** these families.
- Elite: Warder only.
- Unlock after `FSN-FILE-HEXA` **or** `FSN-ORTH-TRI` (player has seen a next-walk shape lock **or** an exact-range oath).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Ring Stride: the next **walk** dest must be Chebyshev **exactly 2** from the armed origin, and **must not** be a knight `(2,1)` / `(1,2)`. Orthogonal 2 and diagonal `(2,2)` are legal. Forced movement / Swap / blink / Twin Gate stay legal. Blink does not pay the walk lock.
- Hepta Oath: the next **non-Strike** spell must confirm at Chebyshev **exactly 7**. Frost at 1–6 or ≥ 8 fizzles (AP not spent for the fizzled spell; Hepta Oath already observed). Strike stays legal at any range.
- Together: walk a ring of 2, then the only legal nuke is from 7. Step to Chebyshev 1 **or** occupy every Chebyshev-2 cell **or** walk to 6 or 8 — is a complete answer.

TACTICAL_PLAN:

- Warder arms Ring Stride if a Chebyshev-2 approach already exists; skip if the player must be walked at Chebyshev 1 to threaten.
- Oather arms Hepta Oath if a tile at Chebyshev 7 exists; skip if the room is smaller than 7.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Next-walk Chebyshev-2 (not knight) + next-spell exact 7. Wave 17 File Hexa standing on the **next walk shape** (a ring, not a file) and the **next oath** (7, not 6). Combination, not a new sprite. Pair Stride (Manhattan 2, includes `(1,1)`, excludes `(2,2)`) is **not** this. Knight Stride (**only** `(2,1)`) is **not** this.

PLAYER_THREAT:

- Being forced off Chebyshev 1, then fizzling Frost from 6 while a Far Sting waits at 7. Spike is one legal 7-range poke. Recoverable: stand Chebyshev 1, occupy the ring, walk to 6.

COUNTERPLAY:

- Step to Chebyshev 1. Occupy every Chebyshev-2 cell. Walk to 6 or 8. Strike through. Swap off the armed origin. Kill the Oather (glass). The Warder without a legal ring is Strike.

MAP_REQUIREMENTS:

- `openField` or `asymmetric`. Needs a legal Chebyshev-2 non-knight floor **and** a tile at Chebyshev 7.
- Weight 0 on cramped 1-tile closets and on rooms whose longest Chebyshev is < 7.

AI_REQUIREMENTS:

- Warder: controller; skip if player MP = 0 or no legal Chebyshev-2 non-knight floor.
- Oather: controller; skip if they have no ranged id **or** no tile at 7.
- Soph 1–2.

VARIANTS:

- `FSN-RING-HEPTA/GUN` — Ring Hepta full: add `ROLE-SNIPER` (`glass_sniper`) as a third body. Never two guns. The sniper sits at 7. **Never PAIR Ring + Gun without the Oather peeler.**
- `FSN-FILE-HEXA` remains the same-file / exact-6 PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-RIME-RANK

FORMATION_ID: `FSN-RIME-RANK`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-RIME-REEL` — `bishop` **without** heal / proposed `rime_reeler` — pack median — back
- `ROLE-RANK-BITE` — `knight` **without** heal / proposed `rank_biter` — pack median + 1 — owns one open rank

VARIANT_RULES:

- Distinct from `FSN-LAVA-FILE` (pull toward **lava** + share-**file**-only bite) and `FSN-SPIKE-SCREEN` (pull toward **spikes** + Bresenham-blocked bite). This sheet is **pull toward ice occupancy** plus **share-rank-only bite**. Dest is **toward**, not onto, a world portal.
- Band 0: Reeler Frost only; Biter Strike only. The AI contract still refuses empty-ice pulls and file-only bonus even before the clone ids exist.
- Band 1: Reeler may hold Slow. Biter may hold Iron Skin. Never Inferno. Never Lava Reel / File Bite / Rank Stride / Rank Lancer / Rime Cut on PAIR (PAIR bans). Extra room `frost_aisle` is **not** this family.
- Elite: Biter only.
- Unlock after `FSN-LAVA-FILE` **or** `FSN-SPIKE-SCREEN` (player has seen an occupancy-toward pull **or** a share-axis bite).
- Random 30% family lottery is **off**.
- Map **must** already place ice occupancy. Twin Gate pads do **not** count. Painted rime-tile is **not** ice occupancy.

SPELL_POOL_INTERACTIONS:

- Rime Reel: pull 1 toward nearest **ice occupancy**. Eleventh `applyAttract` dest flavor. Empty board / no ice fizzles (AP spent, observe). Dest that would be a world portal **fails closed** (stay put).
- Rank Bite: 10, +10 iff caster and target share a **rank only** (`target.y == caster.y` and `target.x != caster.x`). File-only → 10 only. Diagonal → 10 only.
- Together: pull onto the rank, then bite the rank they now share. Step off the rank **or** occupy the toward-cell **or** fight on a map without ice — is a complete answer.

TACTICAL_PLAN:

- Reeler pulls only if ice exists in 6 **and** the 1-step is not a portal / void.
- Biter commits the bonus only on a shared rank; otherwise 10 or Strike.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Pull toward ice + share-rank-only bite. Wave 17 Lava File standing on the **next occupancy dest** (ice, not lava) and the **next axis** (rank, not file). Combination, not a new sprite.

PLAYER_THREAT:

- Being slid one toward ice onto the Biter’s rank, then eating 20. Spike is one 20. Recoverable: stand off-rank, occupy the toward-tile, fight ice-less.

COUNTERPLAY:

- Step to a different rank. Occupy the toward-cell. Blink. Body-block the rank. Kill the Biter. The Reeler without ice is Frost.

MAP_REQUIREMENTS:

- `openField`, `ruinsIslands`, or `asymmetric` **with ice occupancy in Chebyshev 6 of a legal floor**.
- Weight 0 on ice-less maps. Weight 0 if the only toward-step is a world portal.
- Reject `corridorMaze` when the only aisle is the ice file (forced 20 reads as a lock).

AI_REQUIREMENTS:

- Reeler: caster; skip no-ice / portal-step. Until `applyAttract` has an ice-occupancy dest, this sheet must not ship.
- Biter: flanker; skip rider if they do not share rank only unless 10 still kills.
- Soph 1–2.

VARIANTS:

- `FSN-RIME-RANK/GLYPH` — Rime Rank full: add `ROLE-GLYPH` (`glyph_sower`) as a third body. Glyph is a paint, not ice occupancy. Never two reels.
- `FSN-LAVA-FILE` remains the lava / file PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-STAVE-GATE

FORMATION_ID: `FSN-STAVE-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-STAVE-POST` — `pawn` **without** heal / proposed `stave_prelate` — pack median or −1 — empty-kit post
- `ROLE-STAVE-SILL` — `rook` **without** heal / proposed `stave_siller` — pack median — start-turn leftover-sum===5 tax

VARIANT_RULES:

- Distinct from `FSN-SCORE-GATE` (leftover-sum===4 unequal post + start-turn leftover-sum===4 unequal sill). This sheet is leftover-**sum===5** occupy at **end of their turn** plus leftover-**sum===5** occupy at **start of their turn** on a **different** tile.
- Band 0: **do not spawn this id**. Show `FSN-SCORE-GATE`.
- Elite: Siller only. Prelate never gets turret / wolf / archer / dummy / scorepost / dodecaspan overlay.
- Unlock after `FSN-SCORE-GATE` **or** `FSN-STAVE-SIP`.
- Two different tiles. Walk-on the post is **safe**. Dump a pool before end-turn is **safe**. Dual Keep 2/2 / leftover-sum 4 unequal / leftover-sum 3 / 1/1 overnight is **safe**.
- `summonAI === "stavepost"` required. Remaining cap ≥ 1.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Stave Post: empty-kit body. End-turn occupy with leftover AP + leftover MP === 5 deals 10 and the post dies. Walk-enter / relocate / start-turn do **not** detonate.
- Stave Sill: occupant leftover-sum===5 at **start of their turn** takes 8; paint stays 2 turns. Walk-enter does **not** tax. Dual Keep 2/2 **misses**.
- Together: camp sum===5 on the post **and** start the next turn on the sill. Spend a pool **or** Dual Keep 2/2 **or** dump to leftover-sum 4 unequal overnight — is a complete answer.

TACTICAL_PLAN:

- Prelate plants only if they will end the turn on (3,2) / (5,0) / (0,5) / (4,1) / (1,4) / (2,3). Skip remaining cap < 1.
- Siller paints a **neighbor** of the post, never the post cell, never a portal.
- Hostiles start ≥ 4 apart. The post is not a third combatant for spacing until it exists.

SYNERGY:

- Leftover-sum===5 post + start-turn leftover-sum===5 sill. Wave 17 Score Gate standing on the **next leftover-sum** (5). Combination, not a new sprite. Two clocks, two tiles, one window.

PLAYER_THREAT:

- Ending the turn on the post at (3,2), then starting the next turn on the sill still at (3,2). Spike is 10 then 8. Recoverable: dump a pool, Dual Keep, walk off.

COUNTERPLAY:

- End the turn off the post. Spend leftover AP **or** leftover MP so the sum leaves 5. Dual Keep 2/2. Dump to leftover-sum 4 unequal (Score Post’s window, not this). Dump to leftover-sum 3. Dump to 1/1. Coup the post. Step off the sill before dawn. The Siller without a leftover-sum-5 camper is Frost.

MAP_REQUIREMENTS:

- `fortress` courtyard or `openField` with two free floor tiles that are not the only exit.
- Weight 0 on 1-tile closets. Player keeps ≥ 2 walk-offs after the post plants.

AI_REQUIREMENTS:

- Prelate: `isSummoner` for stavepost only; skip remaining cap < 1; skip if they will not end on 5.
- Siller: setter; skip if occupant leftover sum already ≠ 5; never paint a portal.
- Soph 2–3.

VARIANTS:

- `FSN-STAVE-GATE/STING` — Stave Gate full: add `ROLE-STAVE-STING`. Three leftover-sum-5 clocks. Never two posts.
- `FSN-SCORE-GATE` remains the leftover-sum-4-unequal CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-LAST-DUAL

FORMATION_ID: `FSN-LAST-DUAL`  
RELATIVE_DIFFICULTY: CELL (kit band 0–1)  
ENEMIES:

- `ROLE-LAST-MARK` — `bishop` **without** heal / proposed `last_marker` — pack median — last-AP-on-cell paint
- `ROLE-DUAL-PLATE` — `rook` **without** heal / proposed `dual_plater` — pack median + 1 — leftover even/even ≥ 2 miss

VARIANT_RULES:

- Distinct from `FSN-STRIKE-DRY` (**Strike-from** paint + leftover-**MP=0** miss). This sheet is **last leftover AP spent on the painted cell** plus leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss.
- Band 0: Marker Frost only; Plater Iron Skin / Strike only. Last Mark / Dual Plate are band 1.
- Elite: Plater only. Marker never gets Strike Mark / Goad on PAIR.
- Unlock after `FSN-STRIKE-DRY` **or** `FSN-SPENT-FULL` (player has seen a cell-detonate paint **or** a leftover-gated miss).
- Last-AP-on-cell writer required. Walk-on is **free**. Spell-from with leftover AP remaining is **free**. Strike-from with leftover AP remaining is **free**.
- Leftover 0 is even **and excluded**. Leftover 1/1 lands (Prime Gift / Poise). Leftover 3/2 lands (Stave Hood). Leftover 3/1 lands (Score Hood).
- Random 30% family lottery is **off**.
- Do **not** spawn without a legal last-AP spender in the pack **or** in the player kit (`goad_herald` / `ember_knight` / `bash_bruiser` / player Strike). Until `/GOAD` ships, the player kit is the spender.

SPELL_POOL_INTERACTIONS:

- Last Mark: 0 on cast. Cell detonates if they spend their **last leftover AP** on it; then consume. Extra room `last_pulpit` is **not** this family.
- Dual Plate: next hit is 0 **while leftover AP even ≥ 2 AND leftover MP even ≥ 2**; consume on miss. Charge remains if the hit arrives off-window. Dual Keep 2/2 **is** this window **and** Poise Hood’s window. Dual Keep **cannot** sit on 4/2 unless a later bank exists.
- Together: paint the last-AP cell, then camp leftover even/even behind the miss. Leave 1 leftover AP **or** spend last AP **off** the cell **or** dump a pool odd — is a complete answer.

TACTICAL_PLAN:

- Marker paints only if a last-packet Strike / 2-AP tool is likely on that cell. Skip if they will walk off first.
- Plater Plates only while sitting (2,2) / (2,4) / (4,2) / (4,4). Skip odd / zero / 1/1.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Last-AP-on-cell paint + leftover even/even ≥ 2 miss. Wave 17 Strike Dry standing on the **next paint key** (last leftover AP, not Strike-from) and the **next miss window** (even/even ≥ 2, not leftover-MP=0). Combination, not a new sprite.

PLAYER_THREAT:

- Spending last AP on the paint while they sit (2,2) behind Dual Plate. Spike is the detonate, not the miss. Recoverable: last-packet from a neighbor, leave 1 leftover AP, dump MP to 0.

COUNTERPLAY:

- Cast the last packet from a neighbor. Leave 1 leftover AP. Walk off (walk-on is free). Force leftover AP odd. Dump MP to 0. Don’t hit while they sit (2,2). Kill the Plater. The Marker without a last-AP spender is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Marker needs a tile that is **not** the player’s only Strike cell.
- Reject a 1-tile tunnel (forced last AP on the paint reads as a lock).

AI_REQUIREMENTS:

- Marker: setter; skip if no last-AP spender; fail closed until last-leftover-AP-on-cell writer exists.
- Plater: guardian; skip odd / zero / 1.
- Soph 2–3.

VARIANTS:

- `FSN-LAST-DUAL/GOAD` — Last Dual full: add `ROLE-PUSHER` (`goad_herald`) as a third body so the last packet is a Strike from the paint. **Never PAIR Mark+Goad.** The CELL of two is this id; `/GOAD` is the 3-body.
- `FSN-LAST-DUAL/FRESH` — Dual Fresh: replace Marker with `ROLE-FRESH-STING` and add `ROLE-PLATE` (`plate_warden`). Camp even/even miss, then poke leftover AP === max. **Never PAIR Dual Plate + Fresh Sting as a two-body.** Unlock after `FSN-RIFT-FRESH` **or** this CELL.
- `FSN-STRIKE-DRY` remains the Strike-from / leftover-MP=0 CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-RIFT-FRESH

FORMATION_ID: `FSN-RIFT-FRESH`  
RELATIVE_DIFFICULTY: CELL (kit band 0–1)  
ENEMIES:

- `ROLE-RIFT-SKIP` — `bishop` **without** heal / proposed `rift_skipper` — pack median — 1-tile Void Rift skip
- `ROLE-FRESH-STING` — `pawn` **without** heal / proposed `fresh_stinger` — pack median or −1 — leftover AP === max AP poke

VARIANT_RULES:

- Distinct from `FSN-SHOCK-EVEN` (1-tile **shock** skip + leftover-**AP even ≥ 2** poke). This sheet is 1-tile **Void Rift** skip plus leftover **AP equals that body’s max AP** poke.
- Band 0: Skipper Frost / Strike only; Stinger Strike only.
- Elite: Stinger only. Skipper never gets Rift Hook / Shock Skip / Phase Slip on PAIR.
- Unlock after `FSN-SHOCK-EVEN` **or** `FSN-STAVE-SIP`.
- Map **must** already place a Void Rift cell in Chebyshev 6 of a legal floor. Twin Gate pads do **not** count. Length ≥ 2 still pays. Wrong hazard still ticks.
- They may have spent down to 3 from a higher max — Fresh Sting **misses** that (Full Sting would hit it).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Rift Skip: next **1-tile** walk ignores **Void Rift** walk-tax. Extra room `rift_court` is **not** this family.
- Fresh Sting: 10, +bonus iff leftover AP **equals that body’s max AP**. Dual Keep leftover that **survives** turn start **does** count if it equals max.
- Together: cross the Void Rift tax, then poke leftover AP === max AP. Walk length ≥ 2 **or** spend 1 leftover AP **or** sit leftover 3 from a max of 6 — is a complete answer.

TACTICAL_PLAN:

- Skipper arms only for a 1-tile step onto / across a Void Rift tax. Skip no-rift / length ≥ 2.
- Stinger lurks at 3 and commits when leftover AP === max **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- 1-tile Void Rift skip + leftover-AP===max poke. Wave 17 Shock Even standing on the **next hazard skip** (Void Rift, not shock) and the **next leftover-AP poke** (equals max, not even ≥ 2). Combination, not a new sprite.

PLAYER_THREAT:

- Being skipped across the rift then Fresh-Stung while sitting on an unspent bar. Spike is one 18-ish. Recoverable: walk length ≥ 2, spend 1 AP first, fight rift-less.

COUNTERPLAY:

- Don’t stand across a 1-tile rift. Occupy the skip cell. Cast 1 AP first. Sit leftover 3 from a max of 6. Kill the Stinger. The Skipper without a rift is Frost.

MAP_REQUIREMENTS:

- `openField` or `ruinsIslands` **with a Void Rift cell in Chebyshev 6 of a legal floor**.
- Weight 0 on rift-less maps. One clean aisle. Player keeps ≥ 2 walk-offs that are not the rift.

AI_REQUIREMENTS:

- Skipper: flanker; skip if the next walk is not a 1-step across Void Rift.
- Stinger: charger; skip rider if leftover AP ≠ max unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-RIFT-FRESH/TIDE` — Rift Fresh full: add live `tide_shade` as a third body (melee slow). Cap applied MP at −2 with one Slow source. Never two skips.
- `FSN-SHOCK-EVEN` remains the shock / leftover-AP-even CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-WATCH-EVEN

FORMATION_ID: `FSN-WATCH-EVEN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-DRAIN` — `bishop` **without** heal / proposed `watch_drainer` — pack median — overwatch leftover-MP steal
- `ROLE-EVEN-GAIT` — `pawn` **without** heal / proposed `even_gaiter` — pack median or −1 — leftover-MP even ≥ 2 poke

VARIANT_RULES:

- Distinct from `FSN-WATCH-ODD` (snap **zeros leftover MP** + leftover-**MP-odd** poke) and `FSN-WATCH-BANK` (snap **banks leftover AP**) and `FSN-WATCH-SIP` (snap **steals leftover AP**). This sheet is snap **steals 1 leftover MP** plus leftover-**MP even ≥ 2** poke.
- Band 0: **do not spawn this id**. Show `FSN-WATCH-ODD`.
- Elite: Gaiter only. Drainer never gets Watch Root / Watch Sip / Watch Bank / Glass Sniper on PAIR.
- Unlock after `FSN-WATCH-ODD` **or** walked into Hold Ground / Far Watch.
- Needs an overwatch band (`glass_sniper` / Hold Ground / Far Watch) **or** the Drainer’s own ADVANCED Far Sting. `/GUN` is the 3-body with `glass_sniper`.
- Relocate / Swap do **not** snap. Leftover MP 0 is even **and excluded**.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Watch Drain: next overwatch snap **steals 1 leftover MP** from the **walker** (not below 0) and hands it to the watcher (capped at max). Snap still deals. Dual Keep leftover that survives turn start **is** leftover — Drain then takes 1 MP.
- Even Gait: 10, +bonus iff leftover **MP even and ≥ 2**. Leftover MP 2/4 fires. Leftover MP 0 and odd leftover → 10 only. Pair Gait is leftover MP **exactly 2** as a **gait**, not this poke.
- Together: snap steals leftover MP, then poke leftover-MP-even ≥ 2. Walk leftover MP 0 **or** spend 1 leftover MP to odd **or** sit outside the band — is a complete answer.

TACTICAL_PLAN:

- Drainer arms only if a walker will enter the band with leftover MP ≥ 1. Skip leftover MP 0.
- Gaiter lurks at 3 and commits when leftover MP is even ≥ 2 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Overwatch leftover-MP steal + leftover-MP-even ≥ 2 poke. Wave 17 Watch Odd standing on the **next snap rewrite** (steal 1 MP, not zero the bar) and the **next leftover-MP poke** (even ≥ 2, not odd). Combination, not a new sprite.

PLAYER_THREAT:

- Walking leftover MP 3 into the band, losing 1, sitting leftover MP 2, then eating Even Gait’s bonus. Spike is one 18. Recoverable: walk leftover MP 0, Swap, sit leftover MP 1.

COUNTERPLAY:

- Walk leftover MP 0. Spend 1 leftover MP to odd. Swap (does not snap). Sit leftover MP 0 (Dry Sting’s window, not this). Kill the Gaiter. The Drainer without a band is Frost.

MAP_REQUIREMENTS:

- `openField` or `fortress` gallery with an overwatch band that is **not** the only aisle.
- Weight 0 on maps with no legal overwatch line of sight.

AI_REQUIREMENTS:

- Drainer: artillery; skip Dual Keep already dumped their MP **or** no overwatch; fail closed until overwatch snap writes leftover MP.
- Gaiter: flanker; skip leftover MP odd or 0 unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-EVEN/GUN` — Watch Even Hunt full: add `ROLE-SNIPER` (`glass_sniper`). **Never PAIR Drain+Gun.** The CELL of two is this id; `/GUN` is the 3-body.
- `FSN-WATCH-ODD` remains the leftover-MP dump / leftover-MP-odd CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-STAVE-CHOIR

FORMATION_ID: `FSN-STAVE-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-STAVE-MEND` — `queen` **with** heal / proposed `stave_mender` — pack median — back
- `ROLE-VERSE-STAVE` — `bishop` **without** heal / proposed `verse_staver` — pack median — last-id until leftover-sum===5
- `ignite_alchemist` (Wave 3) — `pawn` **without** heal — pack median or −1 — DoT stack

VARIANT_RULES:

- Distinct from `FSN-SCORE-CHOIR` (leftover-sum===4 unequal heal + last-id until leftover-sum===4 unequal). This sheet is leftover-**sum===5** heal plus last-id illegal until leftover-**sum===5**.
- Band 0: **do not spawn this id**. Show `FSN-SCORE-CHOIR`.
- Elite: Verser only. Mender never gets Lifesteal Nova. Ignite never gets Inferno (one cadence).
- Unlock after `FSN-SCORE-CHOIR` **or** `FSN-STAVE-STEP`.
- `lastResolvedSpellId` required. Forced-move does **not** peel. `0 = 0` / `2 = 2` / `3 = 1` / `3 = 0` / `1 = 1` do **not** peel.
- Ignite stack gate ≥ 2 before bonus. No Glass Realm.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Stave Mend: 8 iff both leftover sums === 5. Dual Keep cannot fake it.
- Verse Stave: last resolved id **illegal until leftover AP + leftover MP === 5**. Recast Inferno only after **sum === 5**. Strike is not a spell id for this key.
- Ignite: stack ≥ 2. One Inferno cadence in the pack (none — Verser Frosts).
- Together: sum===5 8, then Inferno is illegal until leftover AP + leftover MP === 5. Sit 2/2 **or** leftover-sum 4 unequal **or** dump a pool — is a complete answer for the 8 **and** keeps Inferno locked.

TACTICAL_PLAN:

- Mender Stave-Mends only if both leftover sums === 5 **and** missing HP ≥ 8.
- Verser Verses if `lastResolvedSpellId` is their win condition (Inferno / Far Sting). Skip no-last-id / already-on-5.
- Ignite applies DoT; never detonates the pack.

SYNERGY:

- Leftover-sum===5 heal + last-id until leftover-sum===5 + ignite. Wave 17 Score Choir standing on the **next leftover-sum** (5). Combination, not a new sprite. Dual Keep does **not** help the verse.

PLAYER_THREAT:

- Holding (3,2) into an 8 while Inferno stays locked until you **also** sit sum 5. Spike is the 8 plus DoT. Recoverable: recast Frost instead, sit off 5, kill the Mender.

COUNTERPLAY:

- Recast a different id. Sit off sum 5 (verse stays). Dual Keep 2/2 peels the 8 (Poise, not Stave) and does **not** peel the verse. Cursed Wound. Kill the Mender. Player Timestep is the designed panic.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs range 3 that is not the only exit.
- Reject stacked-DoT closets.

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 5.
- Verser: controller; skip if no `lastResolvedSpellId`; fail closed until that writer exists.
- Ignite: setter; stack gate ≥ 2.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-STAVE-CHOIR/E-VERSE` — elite Verser, still no Last Mute.
- `FSN-SCORE-CHOIR` remains the leftover-sum-4-unequal BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PRIME-CAP

FORMATION_ID: `FSN-PRIME-CAP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PRIME-GIFT` — `queen` **with** heal / proposed `prime_gifter` — pack median — leftover 1/1 heal
- `ROLE-CADENCE-CAP` — `bishop` **without** heal / proposed `cadence_capper` — pack median — remaining n>2 → 2
- `font_cantor` (Wave 4) — `bishop` **without** heal — pack median — mercy font (counts as the stationary post)

VARIANT_RULES:

- Distinct from `FSN-LEAN-RISE` (leftover **AP=0 and MP≥1** heal + remaining `1→2`) and `FSN-PRIME-TAX` (remaining `0→1` + tax). This sheet is leftover **exactly 1/1** heal plus remaining **n>2 → 2**.
- Band 0: **do not spawn this id**. Show `FSN-LEAN-RISE`.
- Elite: Capper only. Gifter never gets Stave Mend / Equal Gift / Lean Gift. Capper never gets Dock / Snuff / Rise / Floor / Prime / Pack Cap.
- Unlock after `FSN-LEAN-RISE` **or** `FSN-PRIME-TAX`.
- Dual Keep 1/1 **opens** Prime Gift. Dual Keep 2/2 is Poise, skip. Dual Keep AP bank **destroys** Lean Gift (not this window).
- **Never PAIR Cap + Dock.** Font is the third peeler.
- Observe Cap via `cadence_thief` / `hex_chorister` G≥16 extra — first child wins. Do **not** restamp `floor_precentor` / `prime_precentor` / `cap_precentor`.
- Random 30% family lottery is **off**. One post (the font). No second engine.

SPELL_POOL_INTERACTIONS:

- Prime Gift: heal 10 iff leftover **AP exactly 1 AND leftover MP exactly 1**. Target-only leftover. Caster leftover unread unless self-cast. `healAmount` stays 0 on the Prime Gift row. Equal Gift at 2/2 / 3/3 is **not** this. Tally misses 1/1 (sum 2).
- Cadence Cap: remaining `n>2` → `2`. Zeros stay 0. Ones stay 1. Twos stay 2. Floor would have written 1. Dock would need a later turn to zero the 2.
- Font: Shield / Iron Skin. Never Inferno.
- Together: heal the 1/1 window, then compress remaining n>2 → 2. Cast 1 AP from 1/1 → 0/1 (Lean Gift’s window, not this) **or** recast the remaining-5 Inferno **now** — is a complete answer.

TACTICAL_PLAN:

- Gifter Prime-Gifts only if leftover is exactly 1/1 **and** missing HP ≥ 10; else Shields.
- Capper Caps only if a nuke remaining is ≥ 3. Skip all-≤2. Never Cap a bar this body will Dock (Dock is a different family).
- Font camps a door, never seals the last aisle.

SYNERGY:

- Leftover 1/1 heal + remaining n>2→2 + font. Wave 17 Lean Rise standing on the **next leftover-heal window** (1/1, not AP=0/MP≥1) and the **next remaining rewrite** (compress to 2, not 1→2). Combination, not a new sprite. Cadence Floor stays SDE #906.

PLAYER_THREAT:

- Sitting Dual Keep 1/1 into a 10 while Inferno remaining 5 becomes remaining 2. Spike is the 10 plus a later Dock from a **different** pack. Recoverable: spend the 1 leftover AP, recast Inferno now, kill the Gifter.

COUNTERPLAY:

- Cast 1 AP from 1/1 → 0/1. Dual Keep 2/2 (Poise, not this). Dump to 0/0 (Gaunt). Recast the remaining-5 Inferno **before** Cap. Sit remaining at 2 already (Dock’s problem). Cursed Wound. Kill the Gifter.

MAP_REQUIREMENTS:

- `openField` or `fortress` courtyard with a font tile that is **not** the only exit.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Gifter: healer; skip if leftover is not 1/1.
- Capper: controller; skip all-≤2; never Dock the same turn.
- Font: `isSummoner` for font only; remaining cap ≥ 1.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-PRIME-CAP/E-CAP` — elite Capper, still no Dock.
- `FSN-LEAN-RISE` remains the leftover-AP=0 / remaining-1→2 BRIGADE; do not merge ids.
- `FSN-DOCK-VERSE/CAP` is the COURT of Cap then Dock on a **later** turn; do not merge this BRIGADE into it.

STATUS: PROPOSED

---

### FSN-STAVE-QUIET

FORMATION_ID: `FSN-STAVE-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-STAVE-STEP` — `queen` **without** heal / proposed `stave_stepper` — pack median — mid
- `ROLE-STAVE-MEND` — `queen` **with** heal / proposed `stave_mender` — pack median — back
- `ROLE-COVER` — `knight` / proposed `cover_squire` — pack median + 1 — Shield escort

VARIANT_RULES:

- Distinct from `FSN-SCORE-QUIET` (score step + score mend + cover). This sheet is leftover-**sum===5** join plus leftover-**sum===5** heal plus Cover.
- Band 0: **do not spawn this id**. Show `FSN-STAVE-STEP`.
- Elite: Cover only. Mender never gets Lifesteal Nova. Stepper never gets Score Step.
- Unlock after `FSN-STAVE-STEP` **and** (`FSN-SCORE-QUIET` or `FSN-TALLY-QUIET`).
- Ally `targetId` for Cover Shield required before this id ships. `FSN-STAVE-STEP` heals are leftover-gated and do **not** wait on Cover’s Shield.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Stave Step: join a leftover-sum===5 ally. Occupancy dest, not `isSwap`.
- Stave Mend: 8 iff both leftover sums === 5.
- Cover: Shield / Iron Skin on the Mender. `spell-rallying-cry` stays false.
- Together: join the sum===5 ally, then cash the six leftover reads behind Cover. Occupy every Chebyshev-1 **or** dump a pool — is a complete answer.

TACTICAL_PLAN:

- Stepper joins only if a free neighbor of a leftover-sum-5 ally exists.
- Mender Stave-Mends only if both leftover sums === 5 **and** missing HP ≥ 8.
- Cover Shields the Mender; never seals the last aisle.

SYNERGY:

- Stave step + stave mend + cover. Wave 17 Score Quiet standing on the **next leftover-sum** (5). Combination, not a new sprite. The PAIR `FSN-STAVE-STEP` taught the two leftover reads; Cover is the third body.

PLAYER_THREAT:

- The Mender is harder to snipe after the Stepper lands adjacent and Cover Shields. Spike is still an 8. Recoverable: occupy the 3×3, dump a pool, Cursed Wound.

COUNTERPLAY:

- Occupy every Chebyshev-1 of the Mender. Spend leftover so the sum leaves 5. Dual Keep 2/2. Kill Cover first (the join still needs a free dest). Kill the Mender. The Stepper without a leftover-sum-5 ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Cover needs a tile that is **not** the player’s only exit.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Stepper: protector; skip if ally leftover sum ≠ 5 or no free dest.
- Mender: healer; skip if either leftover sum ≠ 5.
- Cover: guardian; ally `targetId` apply required.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-STAVE-QUIET/LEND` — Lend Hood escort: replace Cover with `ROLE-STAVE-LEND` + `ROLE-STAVE-HOOD` + `tempo_precentor`. Cash the window with +1/+1 (sum 7), or hold (3,2) through a miss. **Never PAIR Stave Lend + Score Lend / Tally Lend.** Unlock after this BRIGADE. Ally `targetId` for Lend required.
- `FSN-SCORE-QUIET` remains the leftover-sum-4-unequal BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-HYMN-STAVE

FORMATION_ID: `FSN-HYMN-STAVE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-HYMN-TURN` — `queen` **without** heal / proposed `hymn_turner` — pack median — two-ally leftover invert
- `ROLE-STAVE-MEND` — `queen` **with** heal / proposed `stave_mender` — pack median — leftover-sum===5 heal
- `ROLE-STAVE-STING` — `pawn` **without** heal / proposed `stave_stinger` — pack median or −1 — leftover-sum===5 poke

VARIANT_RULES:

- Distinct from `FSN-DUEL-SCORE` (two-**hostile** leftover invert + leftover-sum-4-unequal heal + leftover-sum-4-unequal sting). This sheet is two-**ally** leftover invert (caster unchanged) plus leftover-**sum===5** heal plus leftover-**sum===5** sting.
- Band 0: **do not spawn this id**. Show `FSN-DUEL-SCORE`.
- Elite: Turner only. Mender never gets Lifesteal Nova. Stinger never gets Score Sting.
- Unlock after `FSN-STAVE-STEP` **and** `FSN-STAVE-SIP`.
- Pack size ≥ 3 (caster + two allies). Skip double-equal / double-empty / missing second ally.
- Sum invariant on each ally: Stave stays Stave; Score stays Score; Tally stays Tally; Poise stays Poise. Player-side summons **count**.
- **Never PAIR Hymn Turn + Duel Turn / Purse Turn / Bar Cross.**
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Hymn Turn: invert leftover AP↔MP on **two allies**; caster leftover **unchanged**. Not `isSwap`. Target rejects self. Nearest other non-caster ally within Chebyshev 3 of the **target**.
- Stave Mend: 8 iff both leftover sums === 5. Invert keeps the sum, so a (5,0) ally becomes (0,5) and still Staves.
- Stave Sting: 10 + 8 iff leftover sum === 5. Invert keeps the 8.
- Together: invert two ally purses while keeping sum 5, then heal / sting. Isolate (one ally) **or** sit leftover AP === leftover MP on both (double no-op) — is a complete answer.

TACTICAL_PLAN:

- Turner inverts only if one ally sits (5,0) and another (0,5) **or** (3,2)/(2,3). Skip double-equal / pack size < 3.
- Mender Stave-Mends only if both leftover sums === 5 **and** missing HP ≥ 8.
- Stinger commits when leftover sum === 5 **or** HP% ≤ 40.

SYNERGY:

- Two-ally leftover invert + leftover-sum===5 heal + leftover-sum===5 sting. Wave 17 Duel Score standing on the **next invert target** (allies, not hostiles) and the **next leftover-sum** (5). Combination, not a new sprite. Choir Hymn is a Wave-1 **heal** — not this.

PLAYER_THREAT:

- Watching two (5,0)/(0,5) allies invert into still-Stave, then an 8 and an 18. Spike is the 18. Recoverable: isolate, sit 2/2 on both, Strike before they recast.

COUNTERPLAY:

- Fight without a second ally. Sit 2/2 on both (double no-op). Quiet Hex after they invert into a 3-AP spell. Dump a pool so the sum leaves 5. Kill the Turner. Kill the Mender. The Turner without two allies is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Turner needs Chebyshev 3 to **two** allies that is not the player’s only exit.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Turner: controller; skip pack size < 3 or both leftover pairs already equal; fail closed if caster would invert.
- Mender: healer; skip if either leftover sum ≠ 5.
- Stinger: flanker; skip if leftover sum ≠ 5 unless 10 still kills.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-HYMN-STAVE/E-TURN` — elite Turner, still no Duel Turn.
- `FSN-DUEL-SCORE` remains the two-hostile invert BRIGADE; do not merge ids.
- `FSN-PURSE-STAVE` is the CADRE that **manufactures Score** after invert; do not merge this BRIGADE into it.

STATUS: PROPOSED

---

### FSN-DOCK-VERSE

FORMATION_ID: `FSN-DOCK-VERSE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-CADENCE-DOCK` — `bishop` **without** heal / proposed `cadence_docker` — pack median — remaining 2→0
- `ROLE-VERSE-STAVE` — `bishop` **without** heal / proposed `verse_staver` — pack median — last-id until leftover-sum===5
- `tax_scribe` (Wave 2) — `bishop` **without** heal — pack median — glyph tax

VARIANT_RULES:

- Distinct from `FSN-SNUFF-VERSE` (remaining `1→0` + last-id until leftover-sum===4 unequal). This sheet is remaining **`2→0`** plus last-id until leftover-**sum===5**.
- Band 0: **do not spawn this id**. Show `FSN-SNUFF-VERSE`.
- Elite: Docker only. Verser never gets Last Mute. Scribe never gets Verse Tax as CORE (PAIR ban vs Verse Stave).
- Unlock after `FSN-PRIME-TAX` **or** `FSN-STAVE-CHOIR`.
- `lastResolvedSpellId` required. **Never PAIR Cap + Dock.** Extra door `dock_precentor` is **not** this family. Cadence Floor stays SDE #906. Cadence Prime stays drop 17. Cadence Rise / Snuff stay drop 18.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Cadence Dock: remaining `n===2` → `0`. Zeros stay 0. `n===1` unchanged (Snuff). `n>2` unchanged (Cap / Floor). Inverse of leaving a 2 after Cap, not Floor.
- Verse Stave: last-id illegal until leftover sum === 5. `2 = 2` does **not** lift.
- Tax Scribe: leftover-AP tax. Cap applied with one Slow source. Never a second last-id lock.
- Together: unlock remaining 2 → 0, then lock recast until they sit Stave. Recast the remaining-2 Inferno **now** **or** sit remaining at 1 (Snuff’s problem) or at 3+ (Cap / Floor’s problem) — is a complete answer for Dock. Sit off sum 5 keeps the verse.

TACTICAL_PLAN:

- Docker Docks only if a nuke remaining is 2. Skip all-non-2. Never Dock a bar this body will Cap (Cap is a different family).
- Verser Verses if `lastResolvedSpellId` is their win condition. Skip no-last-id / already-on-5.
- Scribe taxes leftover AP; never Verses.

SYNERGY:

- Remaining 2→0 + last-id until leftover-sum===5 + glyph tax. Wave 17 Snuff Verse standing on the **next remaining rewrite** (ready-unlock of a 2, not 1→0) and the **next leftover-sum peel** (5, not 4 unequal). Combination, not a new sprite.

PLAYER_THREAT:

- Inferno remaining 2 becomes remaining 0 **and** last-id stays locked until sum 5. Spike is a missed recast plus tax. Recoverable: spend the remaining-2 Inferno **now**, recast Frost, sit off 5.

COUNTERPLAY:

- Spend the remaining-2 Inferno **now**. Sit remaining at 1 or at 3+. Recast a different id. Sit off sum 5 (verse stays). Dual Keep does **not** peel the verse. Kill the Docker. Kill the Verser.

MAP_REQUIREMENTS:

- `openField` or `fortress` courtyard. Scribe needs a tile that is not the only exit.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Docker: controller; skip all-non-2; never Cap the same turn.
- Verser: controller; skip if no `lastResolvedSpellId`.
- Scribe: caster; never a second last-id lock.
- Soph 4–6. `groupTactics` on. Optional summon stays off (this CADRE is three casters).

VARIANTS:

- `FSN-DOCK-VERSE/CAP` — Cap Dock: replace Scribe with `ROLE-CADENCE-CAP`. Compress a 5 to a 2, **then** Dock the 2 to 0 on a **later** turn — COURT-shaped, never PAIR Cap + Dock on one BASE kit. Unlock after `FSN-PRIME-CAP` **and** this CADRE. One elite only (the Docker-leader or the Capper, not both).
- `FSN-SNUFF-VERSE` remains the remaining-1→0 CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-GAIT-BRICK

FORMATION_ID: `FSN-GAIT-BRICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-GAIT-TOLL` — `bishop` **without** heal / proposed `gait_toller` — pack median — leftover-MP=0 next-walk +1 AP
- `ROLE-BRICK-HOLD` — `rook` **without** heal / proposed `brick_holder` — pack median + 1 — barrier-adjacent walk lock
- `ROLE-TURRET` — `rook` / proposed `stone_castellan` — pack median — already planted door

VARIANT_RULES:

- Distinct from `FSN-STILL-BRACE` (leftover-MP=0 next-**spell** +1 AP + barrier-adjacent **hit miss** + turret). This sheet is leftover-MP=0 next-**walk** +1 AP plus cannot **walk** while barrier-adjacent plus turret.
- Band 0: **do not spawn this id**. Show `FSN-STILL-BRACE`.
- Elite: Holder only. Toller never gets Still Toll / Walk Toll / Cast Toll / Ley Toll. Holder never gets Brick Brace / Brick Step / Stave Hold / Root.
- Unlock after `FSN-STILL-BRACE` **or** `FSN-LAST-DUAL`.
- Brick Hold **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Holder does **not** mint a new barrier from empty floor — Castellan already owns the door.
- Relocate / Swap / Twin Gate / Stave Step / Brick Step do **not** pay Gait Toll (not a walk) and stay legal under Brick Hold (no walk MP).
- **Never PAIR Gait Toll + Still Toll.** **Never PAIR Brick Hold + Brick Brace.**
- Random 30% family lottery is **off**. One turret. No second engine.

SPELL_POOL_INTERACTIONS:

- Gait Toll: next **walk** +1 AP if leftover **MP = 0**. Keep 1 walk MP to dodge.
- Brick Hold: cannot **walk** while adjacent to a **barrier**. Destroy the barrier and walks resume; lock **stays** until duration. Does **not** negate hits (Brick Brace). Does **not** move the barrier.
- Castellan: turret extras (`mp: 0`, no path). Never Inferno. Never seals the last aisle.
- Together: tax the next walk at leftover MP 0, then lock walks while barrier-adjacent. Keep 1 leftover MP **or** destroy the barrier **or** Swap — is a complete answer.

TACTICAL_PLAN:

- Toller Tolls only if leftover MP is 0 **and** they will walk. Skip leftover MP ≥ 1.
- Holder Holds only if a living barrier sits Chebyshev 1. Skip no-barrier. Never Hold a body that needed to step off lava this turn (solvability).
- Castellan camps a **gap**, never a closed box.

SYNERGY:

- Leftover-MP=0 walk tax + barrier-adjacent walk lock + turret. Wave 17 Still Brace standing on the **next leftover-MP=0 tax** (walk, not spell) and the **next barrier verb** (walk lock, not hit miss). Combination, not a new sprite.

PLAYER_THREAT:

- Camping leftover MP 0 beside the door, then neither walk nor cheap-walk confirms. Spike is +1 AP on the first legal walk after they leave. Recoverable: keep 1 walk MP, Coup the wall, Swap.

COUNTERPLAY:

- Hold 1 leftover MP. Destroy the barrier. Swap / blink off the adjacent cell. Sit Chebyshev 2. Kill Hold. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars **and** an already planted barrier. Never a closed ring.
- Weight 0 on cramped 1-tile closets. Weight 0 if no barrier exists on the generated map.
- Player must have a tile that is **off** the turret axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Toller: controller; skip leftover MP ≥ 1; never Still Toll / Scribe as CORE.
- Holder: controller; skip no-barrier; never Brace / Step / Root; never seal the last aisle.
- Castellan: turret AI (`mp: 0`, no path); `chokepointCamp` only with a gap.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-GAIT-BRICK/NO-GUN` — drop Castellan if turret AI is not ready; Toller + Holder + Cover. Still not a PAIR of Toll+Hold without a third peeler.
- `FSN-STILL-BRACE` remains the leftover-MP=0 **spell** tax / barrier-adjacent **miss** CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PURSE-STAVE

FORMATION_ID: `FSN-PURSE-STAVE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-HYMN-TURN` — `queen` **without** heal / proposed `hymn_turner` — pack median — two-ally leftover invert
- `ROLE-STAVE-SIP` — `pawn` **without** heal / proposed `stave_sipper` — pack median — leftover-sum===5 leftover-AP steal
- `ROLE-SCORE-STING` — `pawn` **without** heal / proposed `score_stinger` — pack median or −1 — leftover-sum-4-unequal poke

VARIANT_RULES:

- Distinct from `FSN-PURSE-SCORE` (two-**hostile** invert + Score Sip manufactures Tally + Tally Sting) and `FSN-HYMN-STAVE` (two-ally invert + Stave Mend + Stave Sting). This sheet is two-**ally** invert, then Stave Sip **manufactures Score**, then Score Sting.
- Band 0: **do not spawn this id**. Show `FSN-HYMN-STAVE`.
- Elite: Turner only. Sipper never gets Score Sip. Score Stinger never gets Stave Sting (PAIR ban).
- Unlock after `FSN-HYMN-STAVE` **or** `FSN-PURSE-SCORE`.
- (0,5) fizzles Sip. (3,2)→(2,2) manufactures **Poise** (wrong sting — Score Sting misses). Prefer invert into (4,1) / (5,0) so Sip manufactures Score.
- **Never PAIR Stave-Sip + Score-Sip.** **Never PAIR Stave-Sting + Score-Sting.** **Never PAIR Hymn Turn + Duel Turn.**
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Hymn Turn: invert two allies; sum invariant; caster unchanged.
- Stave Sip: steal 1 leftover AP iff leftover sum === 5 and leftover AP ≥ 1. (4,1)→(3,1) **manufactures Score**. (5,0)→(4,0) **manufactures Score**. (3,2)→(2,2) **manufactures Poise** — Score Sting then **misses**.
- Score Sting: 10 + 8 iff leftover AP + leftover MP === 4 **AND** leftover AP ≠ leftover MP. Dual Keep leftover **opens** the 8 on leftover-sum 4 unequal.
- Together: invert, then sip (4,1)→(3,1) Score, then sting the manufactured window. Sit (0,5) **or** sit 2/2 **or** dump a pool before Sip — is a complete answer.

TACTICAL_PLAN:

- Turner inverts only if at least one ally is unequal. Prefer (5,0)/(0,5) or (4,1)/(1,4).
- Sipper Sips if leftover sum === 5 and leftover AP ≥ 1; skip (0,5); skip if the manufactured window would be Poise and no Poise Sting is in the pack (it is not).
- Score Stinger commits when leftover sum === 4 unequal **or** HP% ≤ 40.

SYNERGY:

- Two-ally leftover invert + leftover-sum===5 sip manufactures Score + leftover-sum-4-unequal sting. Wave 17 Purse Score standing on the **next invert target** (allies, not hostiles) and the **next manufactured window** (Score, not Tally). Combination, not a new sprite.

PLAYER_THREAT:

- Watching a (4,1) invert stay (4,1), then Sip to (3,1), then Score Sting 18. Spike is one 18. Recoverable: sit (0,5), sit 2/2, dump AP before Sip.

COUNTERPLAY:

- Sit (0,5) — Sip fizzles. Sit 2/2. Spend leftover AP before Sip. Isolate (one ally). Kill the Sipper. Kill the Score Stinger. The Turner without two allies is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Turner needs Chebyshev 3 to two allies.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Turner: controller; skip pack size < 3 or both leftover pairs already equal.
- Sipper: flanker; skip leftover AP = 0; skip if manufactured window is Poise and no Poise Sting is present.
- Score Stinger: flanker; skip if leftover sum ≠ 4 or tied unless 10 still kills.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-PURSE-STAVE/E-SIP` — elite Sipper, still no Score Sip.
- `FSN-PURSE-SCORE` remains the two-hostile / Tally-manufacture CADRE; do not merge ids.
- `FSN-HYMN-STAVE` remains the two-ally / leftover-sum-5 heal BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-STAVE-HOLD

FORMATION_ID: `FSN-STAVE-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-STAVE-HOLD` — `knight` **without** heal / proposed `stave_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-STAVE` — `knight` **without** heal / proposed `must_staver` — pack median — tools-until leftover-sum===5 **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-STAVE-HOOD` junior **or** omit — if present, skip if leftover sum already ≠ 5

VARIANT_RULES:

- Unlock after (`FSN-STAVE-SIP` or `FSN-RING-HEPTA`) **and** a leader-boost CADRE. Wave 18 “Stave Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Stave Hold + Must Stave** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP + leftover MP === 5; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-STAVE-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Stave Hold: cannot spend walk MP while leftover AP + leftover MP === 5. Spells stay legal. Spend one pool so the sum leaves 5 **or** Dual Keep 2/2 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump both to walk. Prefer (0,5) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- Must Stave: remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 5 **and this spell spends last AP**. Strike stays legal.
- Together: Dual Keep cannot open Stave. Sitting (3,2) cannot walk **and** cannot Inferno unless last AP. Dual Keep 2/2 peels Hold (not leftover-sum 5) but does **not** peel Must unless they also spend last AP on Strike. Dump leftover to leftover-sum 4 unequal peels Hold (Score Hold’s window, not this one). Dump leftover to leftover-sum 3 peels Hold. Dump leftover to 0/0 peels Hold. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover sum === 5; skip if already 2/2 or leftover-sum 4 unequal or leftover-sum 3 or 1/1 or 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-sum-5 **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover so the sum leaves 5, Dual Keep 2/2, dump to leftover-sum 4 unequal, dump to leftover-sum 3, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-sum-5 threat in this drop. Still turn-based. Failure is sitting (0,5) to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after leaving leftover-sum 5 **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so the sum leaves 5 (Hold peels). Dual Keep 2/2 (Hold peels; Must needs last AP on Strike). Dump to leftover-sum 4 unequal (Hold peels; Score Hold is a different COURT). Dump to leftover-sum 3 (Hold peels; Tally Hold is a different COURT). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover sum ≠ 5; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold / Poise Hold / Tally Hold / Score Hold / Brick Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if leftover sum ≠ 5; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if leftover sum already ≠ 5.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-STAVE-HOLD/LANE` — BRIGADE-shaped: Hold + Must Stave + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-STAVE-HOLD/NO-HOOD` — COURT of three.
- `FSN-STAVE-HOLD/DODECA` — COURT **Dodeca Plug**: replace this id’s members with `ROLE-DODECA` + `ROLE-STAVE-SILL` + `ROLE-RING-STRIDE`. 3×4 corridor seal, tax a neighbor at turn start, lock the next walk to Chebyshev 2. **Skip until remaining cap ≥ 12** (live cap 2). Burst the 12 HP. Walk a far **diagonal** around the rectangle (the designed counter vs Hendeca’s plus). Sit on a cell so the place fizzles. Swap around the block. `summonAI === "dodecaspan"` required. Every cell occupied. Click = cell of the 3×4 closest to the caster. Do not also roll a second post. Needs a free 12-cell 3×4 plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 12. Weight 0 on maps with no free 12-cell 3×4 (solvability). **Never PAIR Dodeca + Hendeca / Dec / Stave Post / Ring Stride as a two-body.**
- `FSN-STAVE-HOLD/BOUNCE` — COURT **Bounce Stave**: replace Hold + Must + Warden with `ROLE-STAVE-BOUNCE` + `ROLE-MUST-STAVE` + `fuse_binder`. Two leftover-sum===5 bodies, bounce 12+12 onto the wick. **Never PAIR Stave Bounce with Score / Tally / Poise / Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-SCORE-HOLD/BOUNCE` **or** `FSN-STAVE-SIP`. Missing second leftover-sum-5 flag → 12 only. Player keeps leftover sum ≠ 5 on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-STAVE-HOLD/KENNEL` — COURT **Rime Kennel**: replace Hold + Must + Hood with `ROLE-RIME-CUT` + `ROLE-SUMMON-FILE` + `ROLE-CAST-PLATE`. Threshold poke near ice, then tax pet walks off file **or** zero the next non-Strike — **never PAIR File + Plate on one BASE kit**; the COURT is why both pet / cast verbs exist, with a third peeler (Cut). Unlock after `FSN-SCORE-HOLD/KENNEL` **or** `FSN-RIME-RANK`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot walk off-file for AP). Cap one kennel engine. On-file walks are free of the file tax. Hit the summoner (Cast Plate zeros the next **non-Strike**, not the owner’s incoming hit). Twin Gate pads do **not** count as ice. Drop this variant if `summonAI` is empty. Map needs ice occupancy in Chebyshev 6 of a legal floor.
- `FSN-SCORE-HOLD` remains the leftover-sum===4 unequal **and** last-AP COURT; this id is leftover **sum === 5**.
- `FSN-SCORE-HOLD/HENDECA` remains the 11-cell stretched-plus COURT; `/DODECA` is the 12-cell 3×4 COURT.
- `FSN-TALLY-HOLD/DEC` remains the 10-cell 2×5 COURT.
- `FSN-POISE-HOLD/NINE` remains the 9-cell solid COURT.
- `FSN-STAVE-SIP` / `FSN-RING-HEPTA` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–18 still stand. This drop **meshes**; it does not replace.

```
PAIR:    STAVE-STEP         STAVE-SIP          RING-HEPTA          RIME-RANK
              \\                 |                   |                  /
CELL:     STAVE-GATE        LAST-DUAL          RIFT-FRESH         WATCH-EVEN
              \\                 |                   |                  /
BRIGADE:  STAVE-QUIET       PRIME-CAP          HYMN-STAVE         STAVE-CHOIR
              \\                 |                   |                  /
CADRE:    DOCK-VERSE        GAIT-BRICK         PURSE-STAVE
              \\                 |                  /
COURT:                    STAVE-HOLD    STAVE-HOLD/DODECA    STAVE-HOLD/BOUNCE    STAVE-HOLD/KENNEL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-STAVE-STEP` | `FSN-SCORE-STEP` **or** `FSN-TALLY-STEP` |
| `FSN-STAVE-SIP` | `FSN-SCORE-SIP` **or** `FSN-STAVE-STEP` |
| `FSN-RING-HEPTA` | `FSN-FILE-HEXA` **or** `FSN-ORTH-TRI` |
| `FSN-RIME-RANK` | `FSN-LAVA-FILE` **or** `FSN-SPIKE-SCREEN` |
| `FSN-STAVE-GATE` | `FSN-SCORE-GATE` **or** `FSN-STAVE-SIP` |
| `FSN-LAST-DUAL` | `FSN-STRIKE-DRY` **or** `FSN-SPENT-FULL` |
| `FSN-RIFT-FRESH` | `FSN-SHOCK-EVEN` **or** `FSN-STAVE-SIP` |
| `FSN-WATCH-EVEN` | `FSN-WATCH-ODD` **or** walked into Hold Ground / Far Watch |
| `FSN-STAVE-CHOIR` | `FSN-SCORE-CHOIR` **or** `FSN-STAVE-STEP` |
| `FSN-PRIME-CAP` | `FSN-LEAN-RISE` **or** `FSN-PRIME-TAX` |
| `FSN-STAVE-QUIET` | `FSN-STAVE-STEP` + (`FSN-SCORE-QUIET` or `FSN-TALLY-QUIET`) |
| `FSN-HYMN-STAVE` | `FSN-STAVE-STEP` + `FSN-STAVE-SIP` |
| `FSN-DOCK-VERSE` | `FSN-PRIME-TAX` **or** `FSN-STAVE-CHOIR` |
| `FSN-GAIT-BRICK` | `FSN-STILL-BRACE` **or** `FSN-LAST-DUAL` |
| `FSN-PURSE-STAVE` | `FSN-HYMN-STAVE` **or** `FSN-PURSE-SCORE` |
| `FSN-STAVE-HOLD` | (`FSN-STAVE-SIP` or `FSN-RING-HEPTA`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 19 packs (not this drop)

Wave 19 families do **not** exist yet. Same-day 2026-10-26 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-26.md`, open as PR #1132: Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn + Sestet court) and SDE Wave 17 unique CORE (`spell-tern-stride` … `spell-lane-fold`, PR #1082, **except** Pack Ring / Lane Fold unless a later boss sheet claims them) stay Wave **19** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 18 sheets.

Held verbs (do not FSN this drop): Sestet Mend (both leftover AP + leftover MP **=== 6**), Cadence Tierce (remaining `n>3` → `3`), Trideca Span (occupy-weight 13; skip until remaining cap ≥ 13; live cap is 2), Psalm Turn, Court Tierce, Tern Stride, Octa Oath, Mire Reel, Diag Bite, Summon Mark, Prime Plate, Slide Skip, Capped Sting, Summon Orth, Gait Gift, Cadence Tern, Odd Toll, Brick Tax, Watch Tax, Thin Gait, Lava Cut, Strike Plate, Pack Ring, Lane Fold. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` stay kit-only. Do **not** mint `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `psalm_turner` / `cadence_terner` / `gait_gifter` this drop.

Do **not** pack `stave_holder` with `must_staver` as a teaching pair (Wave 18 rule). `FSN-STAVE-SIP` stays the leftover-sum-5 poke lesson; `FSN-STAVE-HOLD` stays the walk-until leftover-sum===5 **and** last-AP COURT.

Do **not** pack `stave_mender` with `prime_gifter` as a teaching pair. `FSN-STAVE-STEP` stays the both-bodies leftover-sum===5 lesson; `FSN-PRIME-CAP` stays the leftover-1/1 BRIGADE. Score Mend stays leftover **AP + MP === 4 AND unequal** on **both** bodies (`FSN-SCORE-STEP`). Tally Mend stays leftover **AP + MP === 3** on **both** bodies (`FSN-TALLY-STEP`). Poise Mend stays leftover **AP === MP ≥ 1** on **both** bodies (`FSN-POISE-STEP`). Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`).

Do **not** pack `stave_mender` with `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `dry_gaiter` / `dry_mender` / `lean_gifter`. `FSN-SCORE-STEP` stays leftover-sum===4 unequal; `FSN-TALLY-STEP` stays leftover-sum===3; `FSN-POISE-STEP` stays leftover-tied-≥1; `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-LEAN-RISE` stays leftover-AP=0 / MP≥1; this drop owns leftover **AP + MP === 5**. **0 = 0 does not fire. 2 = 2 does not fire. 3 = 1 does not fire. 3 = 0 does not fire. 1 = 1 does not fire. Dual Keep cannot fake sum 5.**

Do **not** pack `cadence_docker` with `cadence_capper` as a teaching pair. `FSN-PRIME-CAP` stays remaining `n>2→2`; `FSN-DOCK-VERSE` stays remaining `2→0`. Cadence Snuff stays remaining `1→0` (`FSN-SNUFF-VERSE`). Cadence Rise stays remaining `1→2` (`FSN-LEAN-RISE`). Cadence Prime stays remaining `0→1` (`FSN-PRIME-TAX`). Cadence Floor stays SDE #906.

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend. Do **not** clone Equal Gift as Prime Gift. Do **not** clone Duel Turn as Hymn Turn. Cadence Floor stays SDE #906. Cadence Prime stays drop 17. Cadence Rise / Snuff stay drop 18. Same-day SDE Wave 17 unique CORE / Wave 18 SPELL_PROPOSALS stay Wave **19** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–18, plus Wave 18 verbs in this order (from elite-evolution §7):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-RING-HEPTA` band 0 can ship among the first** once family HP survives battle start. `FSN-STAVE-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Stave Mend / Prime Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **last leftover AP spent while occupying a painted cell**, **`forcedMovedThisTurn`** / `lastForcedMoveDir` / **caster-authored** force bit (force families still wait; this drop adds **zero** new force-gated CORE). Dual Keep leftover **is** leftover. Dual Keep 2/2 is Poise **and** Dual Plate, not Stave. Dual Keep 1/1 is Poise **and** Prime Gift, not Stave. Dual Keep leftover-sum 4 unequal is Score, not Stave. Dual Keep leftover-sum 3 is Tally, not Stave. Dual Keep **cannot** sit on sum 5. Tally Lend (2,1)→(3,2) **manufactures Stave**.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Stave Step occupancy dests (not `isSwap`). Rime Reel = eleventh attract dest flavor (toward, not onto, a world portal). Brick Hold = barrier-adjacent **walk lock** (not unit bash, not Brick Brace, not Brick Step, not Brick Nudge); destroy-the-barrier skip.
6. `inferSummonArchetype` gains `dodecaspan` and `stavepost` (and still needs `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–17). Raise or gate `ENEMY_SUMMON_CAP` before Dodeca Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Stave Lend / Hymn Turn). **`FSN-STAVE-QUIET` and `FSN-STAVE-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-STAVE-STEP` / `FSN-PRIME-CAP` / `FSN-HYMN-STAVE` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Stave Hold while leftover AP + leftover MP === 5. Must Stave / Verse Stave / Hepta Oath / Ring Stride as refuse-until. Stave Sill start-turn leftover-sum-5 occupy (paint stays). Last Mark last-AP-on-cell occupy (consume; walk-on free; leftover-AP-remaining spell-from free). Stave Post leftover-sum-5 occupy. Dual Plate leftover even/even ≥ 2. Fresh Sting leftover-AP === max. Even Gait leftover-MP even ≥ 2. Stave Hood consume-before-damage. Hymn Turn two-ally leftover invert (caster stays). Cadence Cap remaining-n>2→2. Cadence Dock remaining-2→0. Watch Drain leftover-MP steal on snap. Brick Hold dest occupancy skip (no barrier → skip). Gait Toll next-walk +1 AP if leftover MP = 0.
9. Summoner cooldown fall-through (dodeca / stavepost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT dodeca sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** ship Cadence Prime as a family CORE (drop 17 owns it). Do **not** ship Cadence Rise / Cadence Snuff as a family CORE (drop 18 owns them). Do **not** mint SDE Wave 17 unique CORE / Wave 18 SPELL_PROPOSALS (Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn) as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-STAVE-STEP`, `FSN-STAVE-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP + leftover MP === 5; `0 = 0` does not fire; `2 = 2` does not fire; `3 = 1` does not fire; `3 = 0` does not fire; `1 = 1` does not fire; Dual Keep cannot fake sum 5; Stave Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-STAVE-SIP`, `FSN-STAVE-GATE` | leftover-AP + leftover-MP reads; Stave Sting leftover-sum===5; Sip leftover-sum-5 **and** leftover AP ≥ 1 ((0,5) fizzles; (3,2)→(2,2) manufactures Poise; (4,1)→(3,1) manufactures Score); Stave Post leftover-sum-5 occupy / walk-safe / dump-safe / 2/2-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe; Stave Sill start-turn leftover-sum-5, paint stays; two different tiles; `summonAI === "stavepost"` |
| `FSN-RING-HEPTA` | Ring Stride dest Chebyshev == 2 AND not knight; Hepta Oath exact 7; Strike remains legal; blink does not pay; a legal Chebyshev-2 non-knight floor **and** a tile at Chebyshev 7 exist |
| `FSN-RIME-RANK` | eleventh `applyAttract` dest (ice occupancy); dest is not the portal; map has ice in 6; Rank Bite share-rank-only occupancy; never File Bite / Lava Reel on the same PAIR |
| `FSN-LAST-DUAL` | last-leftover-AP-on-cell writer; walk-on free; leftover-AP-remaining spell-from free; leftover even/even ≥ 2 miss; leftover 0 excluded; leftover 1/1 lands; never Mark+Goad as PAIR (`/GOAD` is the 3-body) |
| `FSN-RIFT-FRESH` | 1-tile Void Rift walk-tax skip; length ≥ 2 pays; leftover-AP === max poke; leftover 3 from a higher max misses; one clean aisle; map has a Void Rift cell **or** a legal flank paint |
| `FSN-WATCH-EVEN` | leftover-MP **steal of 1** on overwatch snap; still deals; never zero the bar (that is Watch Root); never steal leftover AP (that is Watch Sip); leftover-MP-even ≥ 2 poke; leftover MP 0 excluded; never Drain+Gun as PAIR |
| `FSN-STAVE-CHOIR` | `lastResolvedSpellId`; Stave Mend leftover-sum===5 on **both** bodies; Verse Stave leftover-sum-5 peel (`0 = 0` does not; `2 = 2` does not; `3 = 1` does not; `1 = 1` does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-PRIME-CAP` | leftover-AP + leftover-MP on **target** for Prime Gift (exactly 1/1); remaining `n>2` → `2`; Dual Keep 1/1 opens Prime Gift; Dual Keep 2/2 is Poise, skip; never Cap+Dock as PAIR; never Floor / Prime / Rise / Snuff |
| `FSN-HYMN-STAVE` | two-ally leftover AP↔MP invert; caster unchanged; sum invariant; equal leftover is a no-op; never Duel Turn / Purse Turn PAIR |
| `FSN-DOCK-VERSE` | remaining `n===2` → `0`; `lastResolvedSpellId`; leftover-sum===5 peels Verse; never Cap / Rise / Prime / Floor the same turn; never Verse-Stave+Scribe as PAIR |
| `FSN-GAIT-BRICK` | leftover-MP=0 next-walk +1 AP; Brick Hold barrier-adjacent walk lock; destroy-barrier skip; turret AI (`mp: 0`, no path); never Hold+Brace PAIR; never Toll+Scribe PAIR |
| `FSN-PURSE-STAVE` | two-ally invert **then** Stave Sip manufactures Score **then** Score Sting; (0,5) fizzles Sip; (3,2)→(2,2) manufactures Poise (wrong sting); never Stave-Sip+Score-Sip PAIR; never Stave-Sting+Score-Sting PAIR |
| `FSN-STAVE-HOLD` | Stave Hold until leftover AP + leftover MP === 5; Must Stave leftover-sum-5 **and** last-AP tool-lock; never Root; spend 1 leftover so the sum leaves 5 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must |
| `FSN-STAVE-HOLD/DODECA` | `summonAI === "dodecaspan"` **and** remaining cap ≥ 12 (live cap 2 → skip); axis-aligned 3×4, every cell occupied; a diagonal walk-off around the rectangle remains |

---

## Sources (line-accurate, 2026-10-27)

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
- Wave 18 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-26.md` (PR #1138) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-25.md` (PR #1063); leftover SDE Wave 16 unique CORE in PR #1017
- Drop 18: `docs/design/ENEMY_FORMATIONS_2026-10-26.md` (PR #1134)

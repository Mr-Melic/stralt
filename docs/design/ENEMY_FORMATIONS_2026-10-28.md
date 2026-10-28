# Enemy synergy and formation catalog (drop 20)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-28  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–19 already taught the seven pairing words and Waves 1–18 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 19 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-27.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-27.md) (open as PR #1189) and deferred by drop 19 (PR #1176): Sestet Choir, Trideca Plug, Tern Octa, Mire Diag, Spawn Prime, Slide Cap, Gait Tern, Odd Brick, Watch Thin, Lava Kennel, Psalm Sestet, Tierce Verse, Sestet Quiet, Purse Sestet, Sestet Gate, Bounce Sestet, Sestet Hold File, Lend Hood, Tern Tierce, Prime Thin.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956), [`ENEMY_FORMATIONS_2026-10-24.md`](./ENEMY_FORMATIONS_2026-10-24.md) (drop 16 — open as PR #1005), [`ENEMY_FORMATIONS_2026-10-25.md`](./ENEMY_FORMATIONS_2026-10-25.md) (drop 17 — open as PR #1075), [`ENEMY_FORMATIONS_2026-10-26.md`](./ENEMY_FORMATIONS_2026-10-26.md) (drop 18 — open as PR #1134), [`ENEMY_FORMATIONS_2026-10-27.md`](./ENEMY_FORMATIONS_2026-10-27.md) (drop 19 — open as PR #1176). Family sheets: PR #1189. Spell verbs: Wave 18 tactical ids in PR #1132 (`spell-sestet-mend` … `spell-court-tierce`, **except** Court Tierce) plus leftover SDE Wave 17 unique CORE (`spell-tern-stride` … `spell-lane-fold`, **except** Pack Ring / Lane Fold). Cadence Floor stays SDE #906. Cadence Prime stays drop 17 (`FSN-PRIME-TAX`). Cadence Rise / Cadence Snuff stay drop 18. Cadence Cap / Cadence Dock stay drop 19. Cadence Tern / Cadence Tierce are **this** drop.

**Hard rules (Wave 19 pack law — plus every older law still stands):**

- Do **not** pack `sestet_mender` with `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (both leftover **AP + MP === 6 AND unequal** vs leftover **AP + MP === 5** vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover-**both 0** vs **target**-tied ≥ 1 vs leftover **AP=0 and MP≥1** vs leftover **exactly 1/1** vs leftover **AP ≥ 2 AND MP = 0** vs **this-caster** force vs **anyone’s** force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs leftover-cross vs unconditional). `FSN-STAVE-STEP` / `FSN-SCORE-STEP` / `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` stay theirs. `FSN-SESTET-STEP` owns six-flag **sum===6 unequal** heal. Dual Keep leftover **is** leftover: 2/2 **enables Poise and Dual Plate and is not Sestet**; 1/1 **enables Poise and Prime Gift / Prime Plate and is not Sestet**; (3,1) / (1,3) / (4,0) / (0,4) **enables Score**; (2,1) / (1,2) / (3,0) / (0,3) **enables Tally**; Dual Keep **cannot** sit on sum 5 (Stave) **or** sum 6 (Sestet); Dual Keep 2/0 **can** open Gait Gift. Score Lend (3,1)→(4,2) **manufactures Sestet**. `leftover AP = 0` and `leftover MP = 0` is **not** a Sestet window. `2 = 2` is **not** a Sestet window. `3 = 3` is **Poise, not Sestet**. `3 = 2` is **Stave, not Sestet**. `3 = 1` is **Score, not Sestet**. `3 = 0` is **Tally, not Sestet**. `1 = 1` is **Prime, not Sestet**.
- Do **not** pack `cadence_tiercer` with `cadence_terner` as PAIR / `cadence_docker` / `cadence_capper` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (remaining `n===3` → `0` vs `n>3` → `3` vs `n===2` → `0` vs `n>2` → `2` vs `n===1` → `0` vs `n===1` → `2` vs `n===0` → `1` vs full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-DOCK-VERSE` / `FSN-PRIME-CAP` / `FSN-SNUFF-VERSE` / `FSN-LEAN-RISE` / `FSN-PRIME-TAX` stay theirs. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`. Cadence Prime stays drop 17. Cadence Rise / Cadence Snuff stay drop 18. Cadence Cap / Cadence Dock stay drop 19. Cadence Quad (`n>4` → `4`) stays Wave **20** family CORE (SDE #1143) — do **not** mint `cadence_quader`. **Never PAIR Tern + Tierce.**
- Do **not** pack `trideca_prelate` with `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Trideca counts as **13**. Every cell of the orthogonal plus arm 3 is **occupied**. Click is the **center** (Hendeca rule, not Dec / Dodeca’s nearest-cell). Skip until remaining `ENEMY_SUMMON_CAP` ≥ 13. Live cap is **2** — skip `FSN-SESTET-HOLD/TRIDECA`. `FSN-STAVE-HOLD/DODECA` stays the 12-cell 3×4 COURT. `FSN-SCORE-HOLD/HENDECA` stays the 11-cell stretched-plus COURT.
- Do **not** pack `sestet_hooder` with `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` / `prime_plater` as a PAIR (sum===6 unequal any-range miss vs sum===5 miss vs sum===4 unequal miss vs sum===3 miss vs tied-≥1 miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss vs leftover-AP **odd** miss vs leftover-**MP=0** miss vs leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss vs leftover **1/1** miss). `FSN-STAVE-QUIET/LEND` / `FSN-SCORE-QUIET/LEND` / `FSN-LAST-DUAL` stay theirs. `FSN-SPAWN-PRIME` owns Prime Plate. `FSN-SESTET-QUIET/LEND` owns Lend Hood.
- Do **not** pack `sestet_stinger` with `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `capped_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` / `thin_gaiter` as a PAIR (leftover **AP + MP === 6 AND unequal** poke vs leftover **AP + MP === 5** vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover **AP odd** vs leftover **AP even ≥ 2** vs leftover **AP equals max AP** vs leftover MP **equals max MP** vs leftover AP **and** MP **exactly 2** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **MP odd** vs leftover **MP even ≥ 2** vs leftover **AP===1 AND MP===0**). `FSN-STAVE-SIP` / `FSN-SCORE-SIP` / `FSN-WATCH-EVEN` / `FSN-RIFT-FRESH` stay theirs. `FSN-SESTET-SIP` owns leftover-sum-6-unequal poke. `FSN-SLIDE-CAP` owns leftover-MP===max poke. `FSN-WATCH-THIN` owns leftover-1/0 poke.
- Do **not** pack `sestet_stepper` with `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire` (join leftover-**sum===6 unequal** ally vs leftover-**sum===5** vs leftover-**sum===4 unequal** vs leftover-**sum===3** vs leftover-**AP===MP≥1** vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs **through-barrier peek** vs line rescue vs cover). BRIGADE `FSN-SESTET-QUIET` is the three-body lesson. `FSN-STAVE-STEP` / `FSN-SCORE-STEP` stay theirs.
- Do **not** pack `sestet_siller` with `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` / `summon_marker` as a PAIR (start-turn occupy **and leftover AP + leftover MP === 6 AND unequal**, paint stays vs start-turn leftover-sum===5 vs start-turn leftover-sum===4 unequal vs start-turn leftover-sum===3 vs start-turn leftover AP === MP ≥ 1 vs start-turn leftover-both-0 vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing** vs **teleport landing** vs **Strike-from** vs **last leftover AP spent on the cell** vs **summon spawn onto**). `FSN-STAVE-GATE` / `FSN-SCORE-GATE` / `FSN-LAST-DUAL` stay theirs. `FSN-SPAWN-PRIME` owns Summon Mark.
- Do **not** pack `sestet_holder` with `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_sesteter` as PAIR / `must_staver` as PAIR (cannot walk while leftover AP + leftover MP === 6 AND unequal vs while leftover-sum===5 vs while leftover-sum===4 unequal vs while leftover-sum===3 vs while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until leftover **MP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs leftover-MP=0 **and** last AP vs **barrier adjacent** vs tools-until leftover-sum===6 unequal **and** last AP vs tools-until leftover-sum===5 **and** last AP). COURT `FSN-STAVE-HOLD` stays leftover-sum===5 peel. `FSN-SESTET-HOLD` is the 3-body. **Never PAIR Sestet Hold + Must Sestet.**
- Do **not** pack `sestet_lender` with `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **sum === 6 AND unequal** — **exits** to sum 8 vs +1/+1 if leftover **sum === 5** — **exits** to 7 vs +1/+1 if leftover **sum === 4 AND unequal** — **exits** to 6 **which is this family’s window** vs +1/+1 if leftover **sum === 3** — **exits** to 5 vs +1/+1 if leftover **AP === MP ≥ 1** — **keeps** the tie vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-STAVE-QUIET/LEND` / `FSN-SCORE-QUIET/LEND` stay theirs. `FSN-SESTET-QUIET/LEND` is the 3-body. Inequality preserved — Sestet Lend **cannot** manufacture Poise.
- Do **not** pack `sestet_sipper` with `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **sum === 6 AND unequal** and leftover AP ≥ 1 vs steal leftover **AP** iff leftover **sum === 5** vs steal leftover **AP** iff leftover **sum === 4 AND unequal** vs steal leftover **AP** iff leftover **sum === 3** vs steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal leftover **AP**). `FSN-STAVE-SIP` / `FSN-SCORE-SIP` / `FSN-WATCH-EVEN` stay theirs. **Sip always manufactures Stave when it lands.** (4,2)→(3,2) **Stave**. (5,1)→(4,1) **Stave**. (6,0)→(5,0) **Stave**. (0,6) fizzles.
- Do **not** pack `sestet_prelate` with `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` as a PAIR (end-turn occupy **and leftover AP + leftover MP === 6 AND unequal** detonate vs leftover-sum===5 occupy vs leftover-sum===4 unequal occupy vs leftover-sum===3 occupy vs leftover-AP===MP≥1 occupy vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait vs 13-cell occupy vs 12-cell occupy vs 11-cell occupy). `FSN-STAVE-GATE` stays leftover-sum-5 detonate. `FSN-SESTET-GATE` is the leftover-sum-6-unequal post.
- Do **not** pack `sestet_bouncer` with `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**sum===6 unequal** hostile vs leftover-sum===5 bounce vs leftover-sum===4 unequal bounce vs leftover-sum===3 bounce vs leftover-tied bounce vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-STAVE-HOLD/BOUNCE` / `FSN-SCORE-HOLD/BOUNCE` stay theirs. `FSN-SESTET-HOLD/BOUNCE` is leftover-sum-6-unequal Bounce Sestet, never a two-bounce PAIR.
- Do **not** pack `must_sesteter` with `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `sestet_holder` as a PAIR (non-Strike illegal unless leftover **sum === 6 AND unequal and this spell spends last AP** vs leftover **sum === 5 and last AP** vs leftover **sum === 4 AND unequal and last AP** vs leftover **sum === 3 and last AP** vs leftover **AP === MP ≥ 1 and last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until leftover-sum===6 unequal). `FSN-STAVE-HOLD` / `FSN-SCORE-HOLD` stay theirs.
- Do **not** pack `verse_sesteter` with `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as a PAIR (last-id illegal until leftover **sum === 6 AND unequal** vs until leftover **sum === 5** vs until leftover **sum === 4 AND unequal** vs until leftover **sum === 3** vs until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock vs pets pay +1 AP to **recast last id**). `FSN-STAVE-CHOIR` / `FSN-SCORE-CHOIR` stay theirs. `0 = 0` does **not** peel Verse Sestet. `2 = 2` does **not**. `3 = 3` does **not**. `3 = 2` does **not**. `3 = 1` does **not**. `1 = 1` does **not**. Dual Keep **cannot** peel Verse Sestet.
- Do **not** pack `tern_warder` with `ring_warder` / `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR (next walk dest Chebyshev **exactly 3**, **orthogonal only** vs Chebyshev **exactly 2**, knight `(2,1)` **excluded** vs **shares file** vs **shares rank** vs **(2,1)** vs **orthogonal-only any length** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal vs linear file charge). `FSN-RING-HEPTA` / `FSN-FILE-HEXA` / `FSN-EVEN-ORTH` stay theirs. Extra room `tern_gallery` is **not** this family. `(3,0)` / `(0,3)` **are** legal. `(2,1)` **is not**. `(2,2)` **is not** (Ring Stride).
- Do **not** pack `octa_oather` with `hepta_oather` / `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `oct_prelate` / `sept_prelate` (next spell exact Chebyshev **8** vs exact **7** vs exact **6** vs exact **5** vs exact **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0 vs eight-cell occupy vs seven-cell occupy). `FSN-RING-HEPTA` leftover oaths stay theirs. Extra room `octa_nave` is **not** this family.
- Do **not** pack `mire_reeler` with `lava_reeler` / `rime_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `mire_skipper` as PAIR / `rime_mason` as PAIR / `lava_cutter` as PAIR (pull toward **painted mire occupancy** vs **lava occupancy** vs **ice occupancy** vs **spike occupancy** vs **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity vs 1-tile mire skip vs **paints** ice vs threshold poke near lava). `FSN-RIME-RANK` / `FSN-LAVA-FILE` / `FSN-SPIKE-SCREEN` stay theirs. Extra room `bog_aisle` is **not** this family. `FSN-SESTET-HOLD/KENNEL` owns Lava Cut.
- Do **not** pack `diag_biter` with `file_biter` / `rank_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `diag_warder` as PAIR / `diag_locksmith` as PAIR (share a **diagonal** `\|dx\|==\|dy\|` bonus vs share **file only** vs share **rank only** vs shares **rank or file with the caster** vs Bresenham **blocked** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs next-walk diagonal vs **forbids** diagonal). `FSN-RIME-RANK` / `FSN-LAVA-FILE` stay theirs. **Never PAIR Diag Bite + Diag Ward / Diag Lock.**
- Do **not** pack `summon_marker` with `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `last_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `sestet_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (**summon spawn onto the painted cell** consume vs **Strike originating on the painted cell** vs **teleport landing** vs **force-move landing** vs **spell** confirm vs start-turn occupy consume vs end-turn occupy vs cell-enter vs **last leftover AP spent on the cell** vs start-turn leftover-pair vs start-turn tied-≥1 vs start-turn leftover-sum vs start-turn leftover-sum-4-unequal vs start-turn leftover-sum-5 vs start-turn leftover-sum-6-unequal vs unit walk-MP wick vs first leave vs tile bomb). `FSN-LAST-DUAL` / `FSN-STRIKE-DRY` / `FSN-SESTET-GATE` stay theirs. Extra room `spawn_pulpit` is **not** this family. Walk-on is **safe**. Spell-from is **safe**.
- Do **not** pack `prime_plater` with `dual_plater` / `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `sestet_hooder` as PAIR / `stave_hooder` as PAIR / `score_hooder` as PAIR / `prime_gifter` as PAIR / `thin_gaiter` as PAIR (next hit 0 **while leftover AP === 1 AND leftover MP === 1** vs leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** vs leftover **MP = 0** vs leftover **MP ≥ 1** vs leftover **AP ≥ 1** vs leftover AP **odd** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs leftover **sum === 6 unequal** vs leftover **sum === 5** vs leftover **sum === 4 unequal** vs leftover **exactly 1/1 heal** vs leftover **1/0 poke**). `FSN-LAST-DUAL` / `FSN-STAVE-QUIET` stay theirs. `FSN-SPAWN-PRIME` is paint + leftover-1/1 miss; `/THIN` is the 3-body. Dual Keep 1/1 **is** this window.
- Do **not** pack `slide_skipper` with `rift_skipper` / `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `slide_mason` as a PAIR (1-tile **conveyor** auto-push skip vs 1-tile **Void Rift** walk-tax skip vs shock enter-tax vs mire enter-tax vs rime leave-tax vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy vs **paints** the conveyor). `FSN-RIFT-FRESH` / `FSN-SHOCK-EVEN` / `FSN-MIRE-FILE` stay theirs. Extra room `belt_nave` is **not** this family. Length ≥ 2 **pays**.
- Do **not** pack `capped_stinger` with `fresh_stinger` / `full_stinger` / `even_stinger` / `odd_stinger` / `gaunt_stinger` / `sestet_stinger` / `stave_stinger` / `tied_gaiter` / `pair_purser` as a PAIR (leftover **MP equals that body’s max MP** poke vs leftover **AP equals max AP** vs leftover AP **≥ 3** (max unread) vs leftover **AP even ≥ 2** vs leftover AP **odd** vs leftover-both-0 vs leftover-sum===6 unequal vs leftover-sum===5 vs leftover AP **and** MP **exactly 2** vs leftover AP **exactly 2**). `FSN-RIFT-FRESH` / `FSN-SESTET-SIP` stay theirs. They may have spent AP and still hold max MP — Capped Sting **still hits**.
- Do **not** pack `summon_orther` with `summon_filer` as PAIR / `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `strike_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (pets pay **AP** to **walk diagonal** vs pets pay **AP** to **walk off the summoner’s file** vs pets pay **AP** to **walk off the summoner’s rank** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs pets pay **AP** to **recast last id** vs pets pay **AP** to start a **spell** vs pets **next hit 0** vs target’s next **Strike** deals 0 vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-SESTET-HOLD/KENNEL` is Lava Kennel, never a two-pet PAIR. `FSN-STAVE-HOLD/KENNEL` stays Rime Kennel.
- Do **not** pack `gait_gifter` with `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` as a PAIR. `FSN-SESTET-STEP` stays both-bodies leftover-sum===6 unequal. `FSN-STAVE-STEP` stays both-bodies leftover-sum===5. Gait Gift is leftover **AP ≥ 2 AND leftover MP = 0** on **one** body. Dual Keep 2/0 **can** open this. Dual Keep 2/2 is Poise, skip. Do **not** invent `gait_cantor_gift`. Do **not** restamp `gait_cantor`.
- Do **not** pack `cadence_terner` with `cadence_tiercer` as PAIR / `cadence_capper` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`. `FSN-GAIT-TERN` is remaining `n>3→3` plus Gait Gift. `FSN-TIERCE-VERSE` is remaining `3→0` plus Verse Sestet. **Never PAIR Tern + Tierce.** Do **not** restamp `floor_precentor` / `tierce_precentor` / `tern_precentor`.
- Do **not** pack `odd_toller` with `gait_toller` / `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` (next-**walk** +1 AP if leftover **AP is odd** vs next-**walk** +1 AP if leftover **MP = 0** vs next-**spell** +1 AP if leftover MP = 0 vs Struck-last-turn next-**spell** +1 vs Wave-7 walk-pool vs pet-walk AP vs Struck-last-turn next-**walk** +1 vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-GAIT-BRICK` / `FSN-STILL-BRACE` / `FSN-PRIME-TAX` stay theirs. CADRE `FSN-ODD-BRICK` is the three-body lesson (Odd Toll + Brick Tax + Castellan), never Toll+Scribe PAIR.
- Do **not** pack `brick_taxer` with `brick_holder` / `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `sestet_holder` as PAIR / `screen_biter` as PAIR (next **walk** +1 AP while adjacent to a **barrier** vs cannot **walk** while adjacent to a **barrier** vs next hit 0 if a **barrier is adjacent** vs step **through** an adjacent barrier vs push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras vs leftover-sum===6 unequal walk lock vs Bresenham-blocked bite). `FSN-GAIT-BRICK` / `FSN-STILL-BRACE` / `FSN-SWAP-BRICK` stay theirs. `FSN-ODD-BRICK` owns the tax, never Tax+Hold PAIR. Brick Tax **does not forbid** the walk and **does not negate hits** — destroy the barrier and the tax drops; lock **stays** until duration.
- Do **not** pack `watch_taxer` with `watch_drainer` / `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR (snap **taxes the walker’s next spell +1 AP** vs snap **steals 1 leftover MP** vs snap **zeros leftover MP** vs snap **banks** leftover AP vs snap **steals leftover AP** vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-WATCH-EVEN` / `FSN-WATCH-ODD` / `FSN-WATCH-BANK` / `FSN-WATCH-SIP` stay theirs. `FSN-WATCH-THIN/GUN` is Watch Thin Hunt, never Tax+Gun PAIR.
- Do **not** pack `thin_gaiter` with `even_gaiter` / `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `even_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as PAIR / `thin_warder` as PAIR / `prime_plater` as PAIR (leftover **AP === 1 AND leftover MP === 0** poke vs leftover **MP even and ≥ 2** vs leftover **MP odd** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **AP even ≥ 2** vs leftover AP **and** MP **exactly 2** vs leftover MP ≥ 3 +RES vs leftover MP **= 0** unconstrained AP vs Wave-7 challenge absorb vs leftover **1/1 miss**). `FSN-WATCH-EVEN` / `FSN-LONE-HAZARD` stay theirs. Leftover 1/1 is **Prime, not this**. Leftover 0/0 is **Gaunt, not this**. Leftover 2/0 is **Gait Gift, not this**.
- Do **not** pack `lava_cutter` with `rime_cutter` / `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `mire_reeler` as PAIR / `lava_reeler` as PAIR / `lava_skipper` as PAIR / `null_censor` as PAIR (bonus vs **lava occupancy** Chebyshev ≤ 2 vs **ice occupancy** vs **spike occupancy** vs **painted hazard** vs **world portal** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs **pulls** toward mire vs **pulls** toward lava vs ignores lava tax vs Weaken/Expose). `FSN-STAVE-HOLD/KENNEL` / `FSN-RIME-RANK` stay theirs. Twin Gate pads do **not** count.
- Do **not** pack `strike_plater` with `cast_plater` as PAIR / `summon_plater` as PAIR / `summon_orther` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR / `dual_plater` as PAIR (target’s next **Strike** deals 0 vs target’s next **non-Strike spell** deals 0 vs pets treat the **next hit as 0** vs walk-diagonal AP tax vs pets ignore force vs brood overlay vs split absorb vs leftover-MP=0 plate vs pets cannot leave vs leftover even/even miss). `FSN-SESTET-HOLD/KENNEL` is Lava Kennel, never Orth+Plate PAIR. Identify Strike by **id** (`physical_attack`), never `spell.name`.
- Do **not** pack `psalm_turner` with `hymn_turner` as PAIR / `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR (invert leftover AP↔MP on **one same-side non-caster and one opposite-side**; caster unchanged vs **two allies** vs **two hostiles** vs **one** hostile invert vs two-body leftover **cross** vs **tile** swap vs leftover **bank**). CADRE `FSN-PURSE-STAVE` stays the 3-body two-**ally** invert then Stave Sip. `FSN-HYMN-STAVE` stays the 3-body two-**ally** invert. `FSN-DUEL-SCORE` stays the 3-body two-hostile invert. `FSN-PSALM-SESTET` is the 3-body mixed-side invert. Choir Hymn is a Wave-1 **heal**. Sum invariant: Sestet stays Sestet; Stave stays Stave.
- Drop 4–19 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two four-flag **sum===3** heals; no two four-flag **sum===4 unequal** heals; no two four-flag **sum===5** heals; no two four-flag **sum===6 unequal** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals; no two leftover-sum heals; no two leftover-sum-4-unequal heals; no two leftover-sum-5 heals; no two leftover-sum-6-unequal heals; no two remaining-1 rewrites as PAIR; no two remaining-2 rewrites as PAIR; no two remaining-3 rewrites as PAIR).

Wave 20 families do **not** exist yet. Same-day 2026-10-27 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-27.md`, open as PR #1177: Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn) and SDE Wave 18 unique CORE (`spell-hook-stride` … `spell-hook-fold`, PR #1143, **except** Pack Hook / Hook Fold unless a later boss sheet claims them) stay Wave **20** family CORE. Do **not** mint `FSN-*` ids that require those Wave 20 families in this drop. Cadence Floor is **already owned** by SDE #906. Cadence Prime is **already owned** by drop 17. Cadence Rise / Cadence Snuff are **already owned** by drop 18. Cadence Cap / Cadence Dock are **already owned** by drop 19. Cadence Tern / Cadence Tierce are **this** drop.

Court Tierce / Pack Ring / Lane Fold / Court Quarte / Pack Hook / Hook Fold stay **boss / closed-class / later family**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend **or** Sestet Mend (Hollow Gift is **target-only** both-pools; Sestet Mend is **both bodies leftover sum === 6 AND unequal**). Do **not** clone Equal Gift as Prime Gift or Gait Gift (Equal Gift is **target-only** tied ≥ 1; Gait Gift is leftover **AP ≥ 2 AND MP = 0** on **one** body). Do **not** clone Hymn Turn as Psalm Turn (Hymn Turn is **two allies**; Psalm Turn is **one ally and one hostile**, caster stays). Do **not** clone Watch Tax as Watch Drain or Watch Root or Watch Sip (Tax **charges next spell +1 AP**; Drain **steals leftover MP**; Root **zeros leftover MP**; Sip **steals leftover AP**). Do **not** clone Diag Bite as File Bite or Rank Bite or Axis Bite (Diag Bite is **diagonal**; File Bite is **file-only**; Rank Bite is **rank-only**; Axis Bite is rank **or** file). Do **not** clone Prime Plate as Dual Plate or Prime Gift (Prime Plate is leftover **1/1 miss**; Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**; Prime Gift is leftover **1/1 heal**). Do **not** clone Brick Tax as Brick Hold (Tax is a **walk +1 AP**; Hold is a **walk lock**). Do **not** clone Cadence Tierce as Cadence Tern (Tierce **kills** a remaining 3; Tern **writes** remaining >3 to 3 and **leaves** threes).

**Do not spawn Sestet Mend / Sestet Sting / Sestet Step / Sestet Sill / Sestet Hold / Sestet Lend / Sestet Sip / Sestet Post / Sestet Bounce / Must Sestet / Verse Sestet / Sestet Hood / Prime Plate / Capped Sting / Thin Gait / Gait Gift / Odd Toll sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Sum is integer leftover AP + leftover MP. Equality is integer `===`. Inequality is integer `!==`. Missing field → Sestet Mend / Sestet Sting / Gait Gift / Psalm Turn pay **0** extra or skip (fail closed). Until those writers land, show `FSN-STAVE-STEP` / `FSN-STAVE-SIP` / `FSN-SCORE-STEP` instead of the matching Wave 19 id.

**Do not spawn Verse Sestet sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Sestet fizzles (fail closed). Forced-move does **not** peel Verse Sestet. `0 = 0` does **not** lift. `2 = 2` does **not** lift. `3 = 3` does **not** lift. `3 = 2` does **not** lift. `3 = 1` does **not** lift. `1 = 1` does **not** lift. Dual Keep **cannot** lift. Until that writer lands, show `FSN-STAVE-CHOIR` instead of `FSN-SESTET-CHOIR` / `FSN-TIERCE-VERSE`.

**Do not spawn Summon Mark sheets until a summon-spawn writer snapshots spawn-onto the painted cell.** Walk-on does not arm Summon Mark. Spell-from does not arm Summon Mark. Last leftover AP on the cell does not arm Summon Mark. Strike-from does not arm Summon Mark. Teleport / Swap / Sestet Step / Brick Step do not pay. Until that writer lands, show `FSN-LAST-DUAL` instead of `FSN-SPAWN-PRIME`.

**Do not spawn Trideca Plug until `inferSummonArchetype` keys `summonAI === "tridecaspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 13.** Live cap is 2. Name heuristics stay a bug. Trideca fills the stationary-post **and** the multi-cell-system cap (13). Every cell of the plus stays occupied. **Diagonal walk around the bounding 7×7** is the designed counter vs Hendeca’s shorter plus and Dodeca’s 3×4 rectangle. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost/ninespan/tallypost/decspan/scorepost/hendecaspan/stavepost/dodecaspan/sestetpost onto that body.

**Do not spawn Sestet Post sheets until `inferSummonArchetype` keys `summonAI === "sestetpost"` and remaining cap ≥ 1.** End-turn occupy with leftover sum ≠ 6 or leftover tied is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window). Dual Keep leftover-sum 5 is **safe** (Stave Post’s window). Dual Keep leftover-sum 4 unequal is **safe** (Score Post’s window). Dual Keep leftover-sum 3 is **safe** (Tally Post’s window). Dual Keep 1/1 is **safe**. Only leftover-sum===6 unequal end-turn occupy detonates.

**Sestet Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Mire Reel is the **twelfth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava / ice, then **painted mire occupancy**). Dest is **toward**, not onto, a world portal. Brick Tax **does not forbid** the walk and **does not negate hits** — destroy the barrier and the tax drops; lock **stays** until duration.

Wave 19 adds **zero** facing CORE cards **and zero** new force-gated CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop. `forcedMovedThisTurn` remains an implementation prerequisite for Waves 10–16 force sheets, not this drop. Strike Plate fails closed until Strike / `physical_attack` is identifiable by **id**.

---

## Grounding (live, 2026-10-28)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–19. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| `decideEnemyAction` | `enemyAI.ts` 1662–1707 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `tridecaspan` / `sestetpost` / `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Sestet Step is occupancy dest, **not** `isSwap`. Mire Reel is the twelfth **cast** caller of attract. Brick Tax is a barrier-adjacent **walk +1 AP**, not `applyPushback` and not Brick Hold / Brick Brace / Brick Step. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 19 CORE rows stay `mpCost: 0`. Sestet Sip / Sestet Lend / Psalm Turn / Watch Tax / Odd Toll / Brick Tax rewrite **current leftover AP/MP** or next-spell / next-walk AP, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` / last-AP-on-cell / summon-spawn-onto | **Absent** — Sestet / Gait Gift / Psalm Turn / Verse Sestet / Summon Mark / Prime Plate / Capped Sting / Thin Gait / Odd Toll / Watch Tax fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / ninespan / poisepost / tallypost / decspan / scorepost / hendecaspan / stavepost / dodecaspan / **sestetpost** / **tridecaspan** bodies **replace** the random overlay. Cap one of those engines. Trideca Span **is** the 13-cell orthogonal-plus post and needs remaining cap ≥ 13.
3. Any `healAmount` steals healer. **Sestet Mend / Gait Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Primer, Toller, Watcher, Cutter, Turner, Verser, Docker, Capper, Terner, Tiercer, Bracer, or Bouncer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Tally Lend / Score Lend / Stave Lend / Sestet Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Tally Mend / Score Mend / Stave Mend / Sestet Mend / Gait Gift / Prime Gift / Lean Gift / Hollow Gift / Equal Gift / Drift Gift / Shove Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 19 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Sestet Sip / Watch Tax / Psalm Turn / Sestet Lend / Odd Toll / Brick Tax rewrite current leftover AP/MP or next confirm AP.
6. `inferSummonArchetype` must key `summonAI === "tridecaspan"` **and** `"sestetpost"` **before** any Trideca / Sestet-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Tax that **charges walks beside an already planted barrier** (it does not mint a new one from empty floor unless the CADRE’s Castellan already owns a door, and destroying the barrier is a complete answer). Sestet Hold / Must Sestet / Verse Sestet / Octa Oath / Tern Stride are **not** `instantKill`.
8. Sestet-step dest / mire-reel dest / sestet-post plant / trideca plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Sestet Step into a wall is a fizzle (no crush). Mire Reel dest must leave a walk-off that is **not** the mire cell **and not** a world portal. Trideca plant must leave a **diagonal** walk-off around the bounding 7×7 (the designed counter vs Hendeca’s plus and Dodeca’s 3×4) and `findPath` after the hypothetical occupy must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip / Sestet Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Sestet Sip **or** one Stave Sip **or** one Score Sip **or** one Tally Sip **or** one Watch Sip source per pack, not both stacking past that cap. Watch Tax **charges next spell +1 AP** (not a leftover steal, not a dump) and does not stack with Dual Keep past that cap. Watch Drain **steals 1 leftover MP**; it is drop 19, not this drop. Sestet Hold is a **walk lock with a leftover-sum-6-unequal key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise + Tally Hold + Must Tally + Score Hold + Must Score + Stave Hold + Must Stave + Sestet Hold + Must Sestet + Brick Hold on the same AP bar.
10. Walk-spend: Sestet Step / Mire Reel / Sestet Post plant / Trideca plant / Brick Tax **do not** increment `walkMpSpentThisTurn`. Gait Gift / Sestet Mend gate leftover pools, not walk-spend.
11. Last-id: Verse Sestet **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Sestet. Dual Keep leftover **is** leftover; Dual Keep **cannot** lift Verse Sestet.
12. Summon-spawn-onto: Summon Mark **fail closed** until spawn-onto the painted cell exists. Walk last turn does **not** arm it. Spell last turn does **not** arm it. Strike last turn does **not** arm it. Last leftover AP on the cell does **not** arm it. Teleport / Swap / Sestet Step / Brick Step do not pay.
13. Remaining rewrite: Cadence Tern writes `n>3→3`. Cadence Tierce writes `3→0`. **Never both on the same AP bar.** Cadence Floor (`n>1→1`) stays SDE #906. Cadence Prime (`0→1`) stays drop 17. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) stay drop 18. Cadence Cap (`n>2→2`) and Cadence Dock (`2→0`) stay drop 19. Cadence Quad (`n>4→4`) stays Wave 20.

### Relative difficulty (same grades as drops 1–19)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…19 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a leftover-sum tell / a leftover-sum-4-unequal tell / a leftover-sum-5 tell / a leftover-sum-6-unequal tell / a leftover-1/1 tell / a leftover-1/0 tell / a leftover-AP≥2/MP=0 tell / a leftover-even-even miss / a leftover-AP===max tell / a leftover-MP===max tell / a leftover-MP-even-≥2 tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss / a leftover-AP-odd miss / a leftover-MP-odd miss / a leftover-AP-even-≥2 miss / a remaining-0 tell / a remaining-1 tell / a remaining-2 tell / a remaining-n>2 tell / a remaining-n>3 tell / a remaining-3 tell / a Chebyshev-3 orthogonal / an exact-8 oath / a painted-mire occupancy / a spawn-onto-cell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / stepper / warder / holder): pack median + one step.
- Backliner (sestet-mend / gait-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / primer / docker / capper / terner / tiercer / watch / turn): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer, optic): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 20)

Drop 1–19 overlays still apply. These are **additional jobs** for Wave 19 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-SESTET-MEND` | `queen` **with** heal | proposed `sestet_mender` | `spell-sestet-mend`, `starter-shield` | healer; skip if either leftover sum ≠ 6 or either pair is a tie or missing HP < 8; Dual Keep 2/2 is **Poise / Dual Plate, skip**; Dual Keep leftover-sum 5 is **Stave, skip**; Dual Keep leftover-sum 4 unequal is **Score, skip**; Dual Keep leftover-sum 3 is **Tally, skip**; Dual Keep 1/1 is **Prime Gift, skip**; extra door `sestet_cantor` is **not** this family |
| `ROLE-TRIDECA` | `rook` **without** heal | proposed `trideca_prelate` | `physical_attack`, `spell-trideca-span` | `isSummoner` for trideca only; post `summonAI: "tridecaspan"`, orthogonal plus arm 3, empty kit, remaining cap ≥ 13; skip if any of thirteen cells blocked; every cell occupied; click = **center** |
| `ROLE-PSALM-TURN` | `queen` **without** heal | proposed `psalm_turner` | `starter-frost`, `spell-psalm-turn` | controller; skip if pack size < 2 living same-side non-casters **or** no opposite-side in r3 **or** both leftover pairs already equal; invert **one ally and one hostile**; caster leftover **unchanged**; sum invariant; **not** Hymn Turn / Duel Turn / Purse Turn / Bar Cross / Dual Keep |
| `ROLE-SESTET-HOOD` | `knight` **without** heal | proposed `sestet_hooder` | `starter-shield`, `spell-sestet-hood` | guardian; skip if leftover sum ≠ 6 or the pair is a tie; any-range miss while sum===6 unequal; consume on miss |
| `ROLE-SESTET-STING` | `pawn` **without** heal | proposed `sestet_stinger` | `physical_attack`, `spell-sestet-sting` | flanker; skip if leftover sum ≠ 6 or tied unless 10 still kills; Dual Keep **cannot** open the 8 |
| `ROLE-SESTET-STEP` | `queen` **without** heal | proposed `sestet_stepper` | `starter-frost`, `spell-sestet-step` | protector; skip if ally leftover sum ≠ 6 or ally tied or no free adj; relocate, **not** `isSwap` |
| `ROLE-SESTET-SILL` | `rook` **without** heal | proposed `sestet_siller` | `starter-frost`, `spell-sestet-sill` | setter; skip if occupant leftover sum already ≠ 6 or tied; occupant leftover-sum===6 unequal at **start of their turn** takes 8; paint stays |
| `ROLE-SESTET-HOLD` | `knight` **without** heal | proposed `sestet_holder` | `physical_attack`, `spell-sestet-hold` | controller; skip if leftover sum ≠ 6 or tied; cannot walk while leftover-sum===6 unequal; spells stay legal; **never PAIR with Must Sestet** |
| `ROLE-SESTET-LEND` | `bishop` **without** heal | proposed `sestet_lender` | `starter-frost`, `spell-sestet-lend` | buffer; skip if ally leftover sum ≠ 6 or tied; +1 current AP **and** +1 current MP (**exits** to sum 8); inequality preserved |
| `ROLE-SESTET-SIP` | `pawn` **without** heal | proposed `sestet_sipper` | `physical_attack`, `spell-sestet-sip` | flanker; skip if leftover sum ≠ 6 **or** leftover AP = 0 **or** tied; steal 1 leftover AP; (0,6) fizzles; (4,2)→(3,2) **manufactures Stave** |
| `ROLE-SESTET-POST` | `pawn` **without** heal | proposed `sestet_prelate` | `physical_attack`, `spell-sestet-post` | `isSummoner` for sestetpost only; post `summonAI: "sestetpost"`, remaining cap ≥ 1; end-turn leftover-sum===6 unequal occupy detonates; walk-on / dump-a-pool / 2/2-safe / leftover-sum-5-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe |
| `ROLE-SESTET-BOUNCE` | `queen` **without** heal | proposed `sestet_bouncer` | `starter-frost`, `spell-sestet-bounce` | artillery; skip bounce without a second leftover-sum===6 unequal hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-SESTET` | `knight` **without** heal | proposed `must_sesteter` | `physical_attack`, `spell-must-sestet` | controller; skip if leftover sum ≠ 6 or tied; non-Strike illegal unless leftover-sum===6 unequal **and** last AP; Strike stays legal; **never PAIR with Sestet Hold** |
| `ROLE-VERSE-SESTET` | `bishop` **without** heal | proposed `verse_sesteter` | `starter-frost`, `spell-verse-sestet` | controller; skip if no `lastResolvedSpellId`; leftover sum === 6 unequal peels; `0 = 0` does **not**; `2 = 2` does **not**; `3 = 3` does **not**; `3 = 2` does **not**; `3 = 1` does **not**; `1 = 1` does **not**; Dual Keep does **not**; shove does **not** |
| `ROLE-TERN-STRIDE` | `knight` **without** heal | proposed `tern_warder` | `physical_attack`, `spell-tern-stride` | controller; skip if player MP = 0 or no legal Chebyshev-3 orthogonal floor; next walk dest Chebyshev **exactly 3**, **orthogonal only**; extra room `tern_gallery` is **not** this family |
| `ROLE-OCTA-OATH` | `bishop` **without** heal | proposed `octa_oather` | `starter-frost`, `spell-octa-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 8; Strike stays legal; extra room `octa_nave` is **not** this family |
| `ROLE-MIRE-REEL` | `bishop` **without** heal | proposed `mire_reeler` | `starter-frost`, `spell-mire-reel` | caster; skip if no painted mire occupancy in 6; dest is **toward**, not onto; twelfth `applyAttract` flavor; extra room `bog_aisle` is **not** this family |
| `ROLE-DIAG-BITE` | `knight` **without** heal | proposed `diag_biter` | `physical_attack`, `spell-diag-bite` | flanker; skip rider if they do not share a **diagonal** unless 10 still kills; 10 + 10 if `\|dx\|==\|dy\|` and not on-axis; file-only / rank-only → 10 only |
| `ROLE-SUMMON-MARK` | `rook` **without** heal | proposed `summon_marker` | `starter-frost`, `spell-summon-mark` | setter; skip if no summoner in the pack **or** player kit; 0 on cast; summon spawn onto the paint detonates and consumes; walk-on is **free**; spell-from is **free**; extra room `spawn_pulpit` is **not** this family |
| `ROLE-PRIME-PLATE` | `knight` **without** heal | proposed `prime_plater` | `starter-shield`, `spell-prime-plate` | guardian; skip if leftover is not **exactly 1/1**; leftover 1/1 miss; leftover 2/2 lands (Dual Plate); leftover 1/0 lands (Thin Gait); Dual Keep 1/1 **opens** |
| `ROLE-SLIDE-SKIP` | `knight` **without** heal | proposed `slide_skipper` | `physical_attack`, `spell-slide-skip` | flanker; skip if the next walk is not a 1-step across conveyor occupancy; lava/spike/mire/rime still tick; length ≥ 2 pays; extra room `belt_nave` is **not** this family |
| `ROLE-CAPPED-STING` | `pawn` **without** heal | proposed `capped_stinger` | `physical_attack`, `spell-capped-sting` | charger; skip rider if leftover MP ≠ max MP unless 10 still kills; leftover AP spent with max MP **still hits** |
| `ROLE-SUMMON-ORTH` | `rook` **without** heal | proposed `summon_orther` | `starter-frost`, `spell-summon-orth` | controller; skip if no allied summon; pets pay +1 AP to **walk diagonal**; orthogonal walks are free; drop if `summonAI` empty |
| `ROLE-GAIT-GIFT` | `queen` **with** heal | proposed `gait_gifter` | `spell-gait-gift`, `starter-shield` | healer; skip if leftover AP < 2 **or** leftover MP ≠ 0 or missing HP < 8; Dual Keep 2/0 **opens**; Dual Keep 2/2 is Poise, skip; Dual Keep 1/1 is Prime Gift, skip; **not** Sestet / Stave / Score / Tally / Equal / Lean / Hollow |
| `ROLE-ODD-TOLL` | `bishop` **without** heal | proposed `odd_toller` | `starter-frost`, `spell-odd-toll` | controller; skip if leftover AP is even; next **walk** +1 AP if leftover **AP is odd**; relocate / Swap do not pay |
| `ROLE-BRICK-TAX` | `rook` **without** heal | proposed `brick_taxer` | `physical_attack`, `spell-brick-tax` | controller; skip if no barrier is adjacent; next **walk** +1 AP while a barrier is adjacent; destroy the barrier and the tax drops; lock **stays**; never Hold / Brace / Step |
| `ROLE-WATCH-TAX` | `bishop` **without** heal | proposed `watch_taxer` | `starter-frost`, `spell-watch-tax` | artillery; skip if already in 1–2 **or** no overwatch is armed; snap still deals; **walker** next spell **+1 AP**; **not** Watch Drain / Watch Root / Watch Sip |
| `ROLE-THIN-GAIT` | `pawn` **without** heal | proposed `thin_gaiter` | `physical_attack`, `spell-thin-gait` | flanker; skip if leftover is not **exactly 1/0** unless 10 still kills; leftover 1/1 is Prime; leftover 0/0 is Gaunt; leftover 2/0 is Gait Gift |
| `ROLE-LAVA-CUT` | `knight` **without** heal | proposed `lava_cutter` | `physical_attack`, `spell-lava-cut` | flanker; skip rider if target is Chebyshev > 2 from every lava occupancy cell; Twin Gate pads do **not** count |
| `ROLE-STRIKE-PLATE` | `rook` **without** heal | proposed `strike_plater` | `starter-frost`, `spell-strike-plate` | protector; skip if they will not Strike; target’s next **Strike** deals 0; AP still spent; Frost still deals full; identify Strike by **id** |
| `ROLE-CADENCE-TERN` | `bishop` **without** heal | proposed `cadence_terner` | `starter-frost`, `spell-cadence-tern` | controller; skip if every remaining is already ≤ 3; remaining `n>3` → `3`; zeros stay 0; ones stay 1; twos stay 2; threes stay 3; **never PAIR with Tierce** |
| `ROLE-CADENCE-TIERCE` | `bishop` **without** heal | proposed `cadence_tiercer` | `starter-frost`, `spell-cadence-tierce` | controller; skip if every remaining is already ≠ 3; remaining `n===3` → `0`; zeros stay 0; `n===1`, `n===2`, and `n>3` unchanged; extra door `tierce_precentor` is **not** this family; **never PAIR with Tern** |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) / `ROLE-MIST` (`mist_walker`) / `ROLE-OPTIC` (`dim_optic`) / `ROLE-PLATE` (`plate_warden`) / `ROLE-STAVE-STING` (`stave_stinger`) / `ROLE-SCORE-STING` (`score_stinger`) / `ROLE-SUMMONER` (`brood_chanter`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Primer, Docker, Capper, Terner, Tiercer, Sestet-Mend, Gait-Gift, Trideca, or Sestet-Post.

### Fair-fight rules (every sheet)

Same as drops 1–19, plus Wave 19:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier. Trideca sheets also need **≥ 1 diagonal** walk-off around the bounding 7×7.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Sestet Post never detonates on leftover sum ≠ 6 or leftover tied.
- Swap / pull / push / sestet-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip / Sestet Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack. Watch Tax is a next-spell **+1 AP**, not a leftover steal.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Sestet Bounce / Stave Bounce / Score Bounce / Tally Bounce / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Sestet Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine **or** tallypost **or** dec **or** scorepost **or** hendeca **or** stavepost **or** dodeca **or** sestetpost **or** trideca — never two engines). Trideca is illegal until remaining cap ≥ 13.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Tax **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Never seal the last aisle with a new barrier.
- Dual Keep **opens** Poise on 2/2 or 1/1, **opens Dual Plate** on 2/2, **opens Prime Gift / Prime Plate** on 1/1, **opens** Tally on (2,1)/(1,2)/(3,0)/(0,3), **opens** Score on (4,0)/(0,4)/(3,1)/(1,3), **opens Gait Gift** on 2/0, **opens Thin Gait** on 1/0, **cannot open Stave**, **cannot open Sestet**, and **closes** Gaunt / Hollow Gift / Lean Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold leftover **exactly 1/1** for Prime Gift / Prime Plate. Hold leftover **exactly 1/0** for Thin Gait. Hold leftover **AP ≥ 2 AND MP = 0** for Gait Gift. Hold a leftover **sum of 3** for Tally. Hold a leftover **sum of 4 without tying** for Score. Hold leftover **AP + MP === 5** for Stave — Dual Keep cannot fake it; Tally Lend can. Hold leftover **AP + MP === 6 AND unequal** for Sestet — Dual Keep cannot fake it; Score Lend can.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-SESTET-STEP` | PAIR | leftover-sum===6 unequal healer + leftover-sum===6 unequal joiner | this drop |
| `FSN-SESTET-SIP` | PAIR | leftover-sum===6 unequal poke + leftover-sum leftover-AP steal | this drop |
| `FSN-TERN-OCTA` | PAIR | next walk Chebyshev 3 orthogonal + next-spell exact 8 | this drop |
| `FSN-MIRE-DIAG` | PAIR | pull toward painted mire + share-diagonal bite | this drop |
| `FSN-SESTET-GATE` | CELL | leftover-sum===6 unequal post + start-turn leftover-sum===6 unequal sill | this drop |
| `FSN-SPAWN-PRIME` | CELL | summon-spawn-onto paint + leftover 1/1 miss | this drop |
| `FSN-SLIDE-CAP` | CELL | 1-tile conveyor skip + leftover-MP===max poke | this drop |
| `FSN-WATCH-THIN` | CELL | overwatch snap taxes next spell +1 AP + leftover-1/0 poke | this drop |
| `FSN-SESTET-CHOIR` | BRIGADE | leftover-sum===6 unequal heal + last-id until leftover-sum===6 unequal + ignite | this drop |
| `FSN-GAIT-TERN` | BRIGADE | leftover AP≥2/MP=0 heal + remaining n>3→3 + font | this drop |
| `FSN-SESTET-QUIET` | BRIGADE | sestet step + sestet mend + cover | this drop |
| `FSN-PSALM-SESTET` | BRIGADE | mixed-side leftover invert + leftover-sum===6 unequal heal + leftover-sum===6 unequal sting | this drop |
| `FSN-TIERCE-VERSE` | CADRE | remaining 3→0 + last-id until leftover-sum===6 unequal + glyph tax | this drop |
| `FSN-ODD-BRICK` | CADRE | leftover-AP-odd walk tax + barrier-adjacent walk tax + turret | this drop |
| `FSN-PURSE-SESTET` | CADRE | mixed-side leftover invert + leftover-sum===6 unequal sip manufactures Stave + leftover-sum-5 sting | this drop |
| `FSN-SESTET-HOLD` | COURT | walk-until leftover-sum===6 unequal + tools-until leftover-sum===6 unequal **and** last AP + warden | this drop |

Named packs as variants: `FSN-SESTET-GATE/STING` (Sestet Gate full), `FSN-MIRE-DIAG/GLYPH` (Mire Diag full), `FSN-TERN-OCTA/GUN` (Tern Octa full), `FSN-SPAWN-PRIME/GOAD` (Spawn Prime full — never Mark+Goad PAIR), `FSN-SPAWN-PRIME/THIN` (Prime Thin — never Plate+Thin PAIR), `FSN-SLIDE-CAP/TIDE` (Slide Cap full), `FSN-WATCH-THIN/GUN` (Watch Thin Hunt full — never Tax+Gun PAIR), `FSN-SESTET-QUIET/LEND` (Lend Hood escort), `FSN-SESTET-HOLD/TRIDECA` (Trideca Plug — skip until remaining cap ≥ 13; live cap is 2), `FSN-SESTET-HOLD/BOUNCE` (Bounce Sestet leftover-sum===6 unequal), `FSN-SESTET-HOLD/KENNEL` (Lava Kennel — never Orth+Plate PAIR), `FSN-TIERCE-VERSE/TERN` (Tern Tierce — never Tern+Tierce PAIR).

---

## Formations

### FSN-SESTET-STEP

FORMATION_ID: `FSN-SESTET-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-SESTET-MEND` — `queen` **with** heal / proposed `sestet_mender` — pack median — back
- `ROLE-SESTET-STEP` — `queen` **without** heal / proposed `sestet_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Sestet Mend is a heal kit; kit band 0 has no heal). Show `FSN-STAVE-STEP` instead (four leftover-sum-5 tell without the leftover-sum-6-unequal 8).
- Mender kit: Sestet Mend + Shield. **No** Inferno, no Enrage, no Stave / Score / Tally / Poise / Gaunt / Hollow / Equal / Lean / Prime / Gait / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `sestet_cantor` is **not** this family.
- Stepper kit: Sestet Step + Frost. **No** Stave / Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Brick Step / Cover on PAIR (those are `FSN-SESTET-QUIET` / `FSN-STAVE-QUIET`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-STAVE-STEP` **or** `FSN-SCORE-STEP` (player has seen leftover **AP + MP === 5** heal **or** leftover **AP + MP === 4 AND unequal** heal; this sheet cashes leftover **AP + MP === 6 AND unequal** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. Dual Keep **cannot** fake this. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 3` does **not** fire. `3 = 2` does **not** fire. `3 = 1` does **not** fire. `1 = 1` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Sestet Mend (8 HP) pays only if **caster and target** leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** after the 3 AP is paid. Legal pairs (6,0) (0,6) (5,1) (1,5) (4,2) (2,4). Dual Keep 2/2 is Poise / Dual Plate — Shield queen. Dual Keep leftover-sum 5 is Stave — Shield queen. Dual Keep leftover-sum 4 unequal is Score — Shield queen. Dual Keep leftover-sum 3 is Tally — Shield queen. Dual Keep 1/1 is Prime Gift — Shield queen. Dual Keep 2/0 is Gait Gift — Shield queen (one-body; this sheet still needs **both**).
- Sestet Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover sum === 6 **and** unequal. It is not Stave Step, not Score Step, not Tally Step, not Poise Step, and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).
- Score Lend is **not** on this PAIR. It **manufactures** Sestet on a later COURT (`FSN-SESTET-QUIET/LEND` does not own Score Lend either).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover sum === 6 unequal; if the Mender is still 2/2, leftover-sum 5, leftover-sum 4 unequal, leftover-sum 3, 3/3, or 1/1, Stepper Frosts.
- Mender Sestet-Mends only if both leftover sums === 6 **and** both unequal **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Stave Mend, Score Mend, Tally Mend, Poise Mend, Prime Gift, or Gait Gift.

SYNERGY:

- Leftover-sum===6 unequal healer + leftover-sum===6 unequal joiner. Wave 18 Stave Step standing on the **next leftover-sum** (6, equality banned). Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP so the sum leaves 6 **or** Dual Keep 2/2 **or** dump to leftover-sum 5 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump to 3/3 **or** dump to 1/1 — is a complete answer.

PLAYER_THREAT:

- Slow refill if you sit (4,2) on **both** bodies. Spike is low. Misplay is Rooting neither and holding leftover-sum 6 unequal into an 8 that just landed. Dual Keep cannot accidentally open this.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to leave sum 6. Dual Keep 2/2 (Poise / Dual Plate window, not this one). Dump to leftover-sum 5 (Stave window, not this one). Dump to leftover-sum 4 unequal (Score window, not this one). Dump to leftover-sum 3 (Tally window, not this one). Dump to 3/3 (Poise window, not this one). Dump to 1/1 (Prime Gift window, not this one). Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a leftover-sum-6-unequal ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced leftover-sum-6-unequal heal reads as a lock). Dual Keep cannot manufacture this window, so a tunnel that only Dual-Keeps is **not** this sheet’s lock — still reject cramped closets.

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 6 or either pair is a tie.
- Stepper: protector; skip if ally leftover sum ≠ 6 or ally tied or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-SESTET-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-SESTET-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-SESTET-SIP

FORMATION_ID: `FSN-SESTET-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SESTET-STING` — `pawn` **without** heal / proposed `sestet_stinger` — pack median or −1 — starts wide
- `ROLE-SESTET-SIP` — `pawn` **without** heal / proposed `sestet_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-STAVE-SIP` (leftover **AP + MP === 5** poke + leftover-sum leftover-AP steal) and `FSN-SCORE-SIP` (leftover **AP + MP === 4 AND unequal** poke + leftover-sum leftover-AP steal). Pressure is the **leftover-sum===6 unequal** window. Dual Keep **cannot** open either rider. (0,6) opens Sting and **fizzles** Sip.
- Band 0: Stinger Strike only; Sipper Strike only (Sestet Sting / Sestet Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-STAVE-SIP`.
- Elite: Stinger only. Sipper never gets Stave Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-STAVE-SIP` **or** `FSN-SESTET-STEP` (player has seen leftover-sum as a resource **or** the leftover-sum-6-unequal heal).
- Full Sting / Fresh Sting / Capped Sting / Thin Gait / Lone Gait / Tied Gait / Odd Sting / Even Sting / Even Gait / Ready / Pair Gait stay off PAIR (PAIR bans). Sestet Hold stays off (that is `FSN-SESTET-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Sestet Sting: 10, +8 iff **target** leftover AP + leftover MP === 6 **AND** leftover AP ≠ leftover MP. Dual Keep leftover **cannot** open the 8. `2 = 2` is Poise Sting / Dual Plate’s window, not this one. `3 = 3` is Poise Sting’s window, not this one. `3 = 2` is Stave Sting’s window, not this one. `3 = 1` is Score Sting’s window, not this one. `3 = 0` is Tally Sting’s window, not this one. `0 = 0` is Gaunt Sting’s window, not this one. `1 = 1` is Prime Gift, not a sting window. `1 = 0` is Thin Gait, not this one.
- Sestet Sip: steal 1 leftover AP iff leftover sum === 6 unequal **and leftover AP ≥ 1**. **Sip always manufactures Stave when it lands.** (6,0) → (5,0) **Stave**. (5,1) → (4,1) **Stave**. (4,2) → (3,2) **Stave**. (2,4) → (1,4) **Stave**. (1,5) → (0,5) **Stave**. (0,6) fizzles. Inverse of Sestet Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover sum === 6 unequal and leftover AP ≥ 1; else Strikes.
- Stinger lurks at 3 and commits when leftover sum === 6 unequal **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Leftover-sum-6-unequal poke + leftover-sum leftover-AP steal. Wave 18 Stave Sip standing on the **next leftover-sum** (6, equality banned). Combination, not a new sprite. Sestet Sip **manufactures Stave** — that is the teaching tell for `FSN-PURSE-SESTET`.

PLAYER_THREAT:

- Getting leftover-sum-6-unequal Stung, then Sipped off (4,2) into a Stave window you did not ask for. Spike is one 18. Recoverable: sit (0,6), sit 2/2, dump a pool.

COUNTERPLAY:

- Hold leftover MP only (0,6) — Sip fizzles, Sting still fires so **dump MP too**. Dual Keep 2/2 (Poise / Dual Plate, not this). Sit 3/3. Spend 1 leftover AP off (4,2). Kill the Stinger (glass). The Sipper without leftover-sum-6-unequal is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit.
- No Thorned Ground on the only path to the Sipper.

AI_REQUIREMENTS:

- Stinger: flanker; skip if leftover sum ≠ 6 or tied unless 10 still kills.
- Sipper: flanker; skip leftover AP = 0; skip tied.
- Soph 1–2.

VARIANTS:

- `FSN-SESTET-SIP/E-STING` — elite Stinger, still no Watch Sip on PAIR.
- `FSN-SESTET-GATE/STING` is the CELL with Post — do not merge.

STATUS: PROPOSED

---

### FSN-TERN-OCTA

FORMATION_ID: `FSN-TERN-OCTA`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-TERN-STRIDE` — `knight` **without** heal / proposed `tern_warder` — pack median + 1 — owns one Chebyshev-3 orthogonal
- `ROLE-OCTA-OATH` — `bishop` **without** heal / proposed `octa_oather` — pack median — next-spell exact 8

VARIANT_RULES:

- Distinct from `FSN-RING-HEPTA` (next walk Chebyshev **exactly 2**, knight hop **excluded** + next-spell exact **7**) and `FSN-FILE-HEXA` (next walk **same file** + next-spell exact **6**). This sheet is **Chebyshev-3 orthogonal walk** plus **exact Chebyshev 8**. Strike stays legal on both bodies.
- Band 0: both Frost / Strike only; the AI contract still refuses Chebyshev-1 / Chebyshev-2 / diagonal / knight hops, and off-8 spells even before the clone ids exist.
- Band 1: Warder may hold Slow. Oather may hold Slow. Never Inferno. Never Ring Stride / Hepta Oath / File Stride / Hexa Oath / Diag Bite / Diag Ward on PAIR (PAIR bans). Extra rooms `tern_gallery` / `octa_nave` are **not** these families.
- Elite: Warder only.
- Unlock after `FSN-RING-HEPTA` **or** `FSN-FILE-HEXA` (player has seen a next-walk shape lock **or** an exact-range oath).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Tern Stride: the next **walk** dest must be Chebyshev **exactly 3** from the armed origin, **and orthogonal** (`dx===0` XOR `dy===0`). `(3,0)` / `(0,3)` are legal. `(2,1)` is illegal (knight). `(2,2)` is illegal (Ring Stride). Forced movement / Swap / blink / Twin Gate stay legal. Blink does not pay the walk lock.
- Octa Oath: the next **non-Strike** spell must confirm at Chebyshev **exactly 8**. Frost at 1–7 or ≥ 9 fizzles (AP not spent for the fizzled spell; Octa Oath already observed). Strike stays legal at any range.
- Together: walk a file/rank of 3, then the only legal nuke is from 8. Step to Chebyshev 1 or 2 **or** occupy every Chebyshev-3 orthogonal cell **or** walk to 7 or 9 — is a complete answer.

TACTICAL_PLAN:

- Warder arms Tern Stride if a Chebyshev-3 orthogonal approach already exists; skip if the player must be walked at Chebyshev 1 to threaten.
- Oather arms Octa Oath if a tile at Chebyshev 8 exists; skip if the room is smaller than 8.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Next-walk Chebyshev-3 orthogonal + next-spell exact 8. Wave 18 Ring Hepta standing on the **next walk shape** (a tern, not a ring) and the **next oath** (8, not 7). Combination, not a new sprite. Ring Stride (Chebyshev 2, includes `(2,2)`, excludes knight) is **not** this. Knight Stride (**only** `(2,1)`) is **not** this. Orth Stride (**any** orthogonal length) is **not** this.

PLAYER_THREAT:

- Being forced off Chebyshev 1–2, then fizzling Frost from 7 while a Far Sting waits at 8. Spike is one legal 8-range poke. Recoverable: stand Chebyshev 1, occupy the tern, walk to 7.

COUNTERPLAY:

- Step to Chebyshev 1 or 2. Occupy every Chebyshev-3 orthogonal cell. Walk to 7 or 9. Strike through. Swap off the armed origin. Kill the Oather (glass). The Warder without a legal tern is Strike.

MAP_REQUIREMENTS:

- `openField` or `asymmetric`. Needs a legal Chebyshev-3 orthogonal floor **and** a tile at Chebyshev 8.
- Weight 0 on cramped 1-tile closets and on rooms whose longest Chebyshev is < 8.

AI_REQUIREMENTS:

- Warder: controller; skip if player MP = 0 or no legal Chebyshev-3 orthogonal floor.
- Oather: controller; skip if they have no ranged id **or** no tile at 8.
- Soph 1–2.

VARIANTS:

- `FSN-TERN-OCTA/GUN` — Tern Octa full: add `ROLE-SNIPER` (`glass_sniper`) as a third body. Never two guns. The sniper sits at 8. **Never PAIR Tern + Gun without the Oather peeler.**
- `FSN-RING-HEPTA` remains the Chebyshev-2 / exact-7 PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-MIRE-DIAG

FORMATION_ID: `FSN-MIRE-DIAG`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-MIRE-REEL` — `bishop` **without** heal / proposed `mire_reeler` — pack median — back
- `ROLE-DIAG-BITE` — `knight` **without** heal / proposed `diag_biter` — pack median + 1 — owns one open diagonal

VARIANT_RULES:

- Distinct from `FSN-RIME-RANK` (pull toward **ice** + share-**rank**-only bite) and `FSN-LAVA-FILE` (pull toward **lava** + share-**file**-only bite). This sheet is **pull toward painted mire occupancy** plus **share-diagonal bite**. Dest is **toward**, not onto, a world portal.
- Band 0: Reeler Frost only; Biter Strike only. The AI contract still refuses empty-mire pulls and rank-only / file-only bonus even before the clone ids exist.
- Band 1: Reeler may hold Slow. Biter may hold Iron Skin. Never Inferno. Never Lava Reel / Rime Reel / File Bite / Rank Bite / Diag Ward / Diag Lock / Lava Cut on PAIR (PAIR bans). Extra room `bog_aisle` is **not** this family.
- Elite: Biter only.
- Unlock after `FSN-RIME-RANK` **or** `FSN-LAVA-FILE` (player has seen an occupancy-toward pull **or** a share-axis bite).
- Random 30% family lottery is **off**.
- Map **must** already place painted mire occupancy. Twin Gate pads do **not** count. Ice occupancy is **not** mire. Lava occupancy is **not** mire.

SPELL_POOL_INTERACTIONS:

- Mire Reel: pull 1 toward nearest **painted mire occupancy**. Twelfth `applyAttract` dest flavor. Empty board / no painted mire fizzles (AP spent, observe). Dest that would be a world portal **fails closed** (stay put).
- Diag Bite: 10, +10 iff caster and target share a **diagonal** (`\|dx\|==\|dy\|` and not on-axis). File-only → 10 only. Rank-only → 10 only.
- Together: pull onto the diagonal, then bite the diagonal they now share. Step off the diagonal **or** occupy the toward-cell **or** fight on a map without painted mire — is a complete answer.

TACTICAL_PLAN:

- Reeler pulls only if painted mire exists in 6 **and** the 1-step is not a portal / void.
- Biter commits the bonus only on a shared diagonal; otherwise 10 or Strike.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Pull toward painted mire + share-diagonal bite. Wave 18 Rime Rank standing on the **next occupancy dest** (mire, not ice) and the **next axis** (diagonal, not rank). Combination, not a new sprite.

PLAYER_THREAT:

- Being slid one toward mire onto the Biter’s diagonal, then eating 20. Spike is one 20. Recoverable: stand off-diagonal, occupy the toward-tile, fight mire-less.

COUNTERPLAY:

- Step off the diagonal. Occupy the toward-cell. Blink. Body-block the diagonal. Kill the Biter. The Reeler without painted mire is Frost.

MAP_REQUIREMENTS:

- `openField`, `ruinsIslands`, or `asymmetric` **with painted mire occupancy in Chebyshev 6 of a legal floor**.
- Weight 0 on mire-less maps. Weight 0 if the only toward-step is a world portal.
- Reject `corridorMaze` when the only aisle is the mire file (forced 20 reads as a lock).

AI_REQUIREMENTS:

- Reeler: caster; skip no-mire / portal-step. Until `applyAttract` has a painted-mire dest, this sheet must not ship.
- Biter: flanker; skip rider if they do not share a diagonal unless 10 still kills.
- Soph 1–2.

VARIANTS:

- `FSN-MIRE-DIAG/GLYPH` — Mire Diag full: add `ROLE-GLYPH` (`glyph_sower`) as a third body. Glyph is a paint, not mire occupancy, unless the glyph **is** the mire paint already on the map. Never two reels.
- `FSN-RIME-RANK` remains the ice / rank PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-SESTET-GATE

FORMATION_ID: `FSN-SESTET-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SESTET-POST` — `pawn` **without** heal / proposed `sestet_prelate` — pack median or −1 — empty-kit post
- `ROLE-SESTET-SILL` — `rook` **without** heal / proposed `sestet_siller` — pack median — start-turn leftover-sum===6 unequal tax

VARIANT_RULES:

- Distinct from `FSN-STAVE-GATE` (leftover-sum===5 post + start-turn leftover-sum===5 sill). This sheet is leftover-**sum===6 unequal** occupy at **end of their turn** plus leftover-**sum===6 unequal** occupy at **start of their turn** on a **different** tile.
- Band 0: **do not spawn this id**. Show `FSN-STAVE-GATE`.
- Elite: Siller only. Prelate never gets turret / wolf / archer / dummy / stavepost / dodecaspan / tridecaspan overlay.
- Unlock after `FSN-STAVE-GATE` **or** `FSN-SESTET-SIP`.
- Two different tiles. Walk-on the post is **safe**. Dump a pool before end-turn is **safe**. Dual Keep 2/2 / leftover-sum 5 / leftover-sum 4 unequal / leftover-sum 3 / 3/3 / 1/1 overnight is **safe**.
- `summonAI === "sestetpost"` required. Remaining cap ≥ 1.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Sestet Post: empty-kit body. End-turn occupy with leftover AP + leftover MP === 6 **AND** unequal deals 10 and the post dies. Walk-enter / relocate / start-turn do **not** detonate.
- Sestet Sill: occupant leftover-sum===6 unequal at **start of their turn** takes 8; paint stays 2 turns. Walk-enter does **not** tax. Dual Keep 2/2 **misses**. Dual Keep leftover-sum 5 **misses**.
- Together: camp sum===6 unequal on the post **and** start the next turn on the sill. Spend a pool **or** Dual Keep 2/2 **or** dump to leftover-sum 5 overnight — is a complete answer.

TACTICAL_PLAN:

- Prelate plants on a camp tile the player wants, never the last exit, never a portal.
- Siller paints a **different** neighbor. Never the post’s cell (that would hide which window detonates).
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-sum-6-unequal post + start-turn leftover-sum-6-unequal sill. Wave 18 Stave Gate standing on the **next leftover-sum** (6, equality banned). Combination, not a new sprite.

PLAYER_THREAT:

- Camping (4,2) on the post at end-turn **and** still sitting (4,2) on the sill at dawn. Spike is 10 then 8. Recoverable: dump a pool overnight, Dual Keep 2/2, walk off.

COUNTERPLAY:

- Leave before end-turn. Dump to leftover-sum 5 (Stave Post’s window, not this). Dual Keep 2/2. Sit 3/3. Kill the post (1 HP pool). Walk-on is free.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with two distinct floor tiles that are not the last exit.
- Weight 0 on 1-tile closets. Two painted cells must both leave ≥ 1 walk-off.

AI_REQUIREMENTS:

- Post: summoner `sestetpost`; skip remaining cap < 1; never path; never also stavepost / dodecaspan / tridecaspan.
- Siller: setter; skip if occupant leftover already off-window; never paint the post’s cell.
- Soph 2–3.

VARIANTS:

- `FSN-SESTET-GATE/STING` — Sestet Gate full: add `ROLE-SESTET-STING` as a third body. Never two posts. **Never PAIR Post + Sting without the Sill peeler.**
- `FSN-STAVE-GATE` remains the leftover-sum-5 CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-SPAWN-PRIME

FORMATION_ID: `FSN-SPAWN-PRIME`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SUMMON-MARK` — `rook` **without** heal / proposed `summon_marker` — pack median — spawn-onto paint
- `ROLE-PRIME-PLATE` — `knight` **without** heal / proposed `prime_plater` — pack median — leftover 1/1 miss

VARIANT_RULES:

- Distinct from `FSN-LAST-DUAL` (last leftover AP on the cell + leftover even/even ≥ 2 miss). This sheet is **summon spawn onto the paint** plus leftover **exactly 1/1** miss. Walk-on is **free**. Spell-from is **free**. Last leftover AP on the cell is **free**.
- Band 0: **do not spawn this id** (Prime Plate needs leftover 1/1). Show `FSN-LAST-DUAL`.
- Elite: Plater only. Marker never gets Last Mark / Strike Mark / Goad.
- Unlock after `FSN-LAST-DUAL` **or** when the player has summoned once this run.
- Weight ×2 if the player has a summon spell **equipped**. Still valid if they do not — Marker Frosts and Plater Iron-Skins.
- **Never PAIR Summon Mark + Goad.** `/GOAD` is the 3-body.
- Dual Keep 1/1 **opens** Prime Plate. Dual Keep 2/2 is Dual Plate, skip.
- Random 30% family lottery is **off**.
- Extra room `spawn_pulpit` is **not** this family.

SPELL_POOL_INTERACTIONS:

- Summon Mark: 0 on cast. Cell detonates when a summon is **spawned onto** it, then consumes. Player summons **do**. Enemy summons **do**. Walk-on / spell-from / last-AP / Strike-from do **not**.
- Prime Plate: next hit is 0 **while leftover AP === 1 AND leftover MP === 1**. Hit at 2/2 lands. Hit at 1/0 lands (Thin Gait’s poke, not a miss). Hit at 0/0 lands (Gaunt). Charge remains if the hit arrives off-window.
- Together: paint the spawn cell, then camp leftover 1/1 behind the miss. Spawn onto a neighbor **or** wait the paint **or** hit off 1/1 — is a complete answer.

TACTICAL_PLAN:

- Marker paints a midpoint spawn cell that is **not** the player’s last exit and **not** a portal.
- Plater Plates only while sitting 1/1; else Iron Skin.
- Optional brood is `/GOAD`, not this base.

SYNERGY:

- Spawn-onto paint + leftover 1/1 miss. Wave 18 Last Dual standing on the **next paint pay** (spawn, not last AP) and the **next leftover miss** (1/1, not even/even). Combination, not a new sprite.

PLAYER_THREAT:

- Spawning a wisp onto the paint, then swinging into a 1/1 plate. Spike is one consumed summon plus a blanked hit. Recoverable: spawn a neighbor, wait, hit at 2/2.

COUNTERPLAY:

- Spawn onto a neighbor. Wait the paint. Hit at 2/2 (Dual Plate’s window, not this). Hit at 1/0. Kill the Marker. Desummon. The Plater without 1/1 is Iron Skin.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 6 free cells near the midpoint. Reject cramped maze (summon-in-a-closet).
- No void on the midpoint ring. Paint must not be a portal.

AI_REQUIREMENTS:

- Marker: setter; skip no-summoner and player-has-no-summon-id (then Frost). Until spawn-onto writer exists, this sheet must not ship.
- Plater: guardian; skip leftover not 1/1.
- Soph 2–3.

VARIANTS:

- `FSN-SPAWN-PRIME/GOAD` — Spawn Prime full: add `ROLE-SUMMONER` (`brood_chanter`) as a third body, cap 1 pet. **Never PAIR Mark + Goad as a two-body.** The COURT of three is why spawn is likely.
- `FSN-SPAWN-PRIME/THIN` — Prime Thin: replace Marker with `ROLE-THIN-GAIT` + `ROLE-PLATE` (`plate_warden`). Camp 1/1 miss, then poke leftover 1/0 after they spend the MP. **Never PAIR Plate + Thin as a two-body.** Unlock after this CELL.
- `FSN-LAST-DUAL` remains the last-AP / even-even CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-SLIDE-CAP

FORMATION_ID: `FSN-SLIDE-CAP`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SLIDE-SKIP` — `knight` **without** heal / proposed `slide_skipper` — pack median — 1-tile conveyor skip
- `ROLE-CAPPED-STING` — `pawn` **without** heal / proposed `capped_stinger` — pack median or −1 — leftover-MP===max poke

VARIANT_RULES:

- Distinct from `FSN-RIFT-FRESH` (1-tile **Void Rift** skip + leftover-**AP===max** poke). This sheet is **1-tile conveyor auto-push skip** plus leftover **MP equals max MP** poke. Length ≥ 2 **pays**. They may have spent AP and still hold max MP — Capped Sting **still hits**.
- Band 0: Skipper Strike only; Stinger Strike only. If kit band is still 0, **do not spawn this id** — show `FSN-RIFT-FRESH`.
- Elite: Stinger only. Skipper never gets Rift Skip / Shock Skip / Mire Skip.
- Unlock after `FSN-RIFT-FRESH` **or** `FSN-SESTET-SIP`.
- Extra room `belt_nave` is **not** this family.
- Map **must** already place conveyor occupancy. Twin Gate pads do **not** count. Void Rift is **not** conveyor.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Slide Skip: next **1-tile** walk ignores **conveyor** auto-push. Length ≥ 2 pays. Lava / spike / mire / rime taxes still tick.
- Capped Sting: 10, +8 iff leftover MP **equals that body’s max MP**. Fresh Sting (leftover AP === max) **misses** a spent-AP / max-MP bar. Dry Sting wants leftover MP = 0.
- Together: cross the belt without the push, then poke leftover-max-MP. Spend 1 walk MP **or** sit leftover MP 0 **or** fight belt-less — is a complete answer.

TACTICAL_PLAN:

- Skipper arms only if a 1-tile conveyor dest exists; skip no-belt.
- Stinger lurks at 3 and commits when leftover MP === max **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- 1-tile conveyor skip + leftover-MP===max poke. Wave 18 Rift Fresh standing on the **next 1-tile skip** (belt, not rift) and the **next leftover-max poke** (MP, not AP). Combination, not a new sprite.

PLAYER_THREAT:

- Crossing the belt without the shove, then eating 18 because leftover MP is still max. Spike is one 18. Recoverable: spend 1 walk MP, sit leftover MP 0.

COUNTERPLAY:

- Spend 1 walk MP. Sit leftover MP 0 (Dry / Gait Gift’s window). Stand off the belt. Root before they skip. Kill the Stinger. The Skipper without a belt is Strike.

MAP_REQUIREMENTS:

- `openField` or `asymmetric` **with conveyor occupancy in Chebyshev 6 of a legal floor**.
- Weight 0 on belt-less maps. One clean aisle must exist that is **not** the belt.
- Reject `corridorMaze` when the only aisle is the belt (forced skip-or-shove reads as a lock).

AI_REQUIREMENTS:

- Skipper: flanker; skip no-conveyor dest; never skip lava as if it were a belt.
- Stinger: flanker; skip leftover MP ≠ max unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-SLIDE-CAP/TIDE` — Slide Cap full: add `ROLE-KITER` (`tide_shade`) as a third body. Live tide melee −1 MP is a **punish for catching the shade**, not a primary attack. Never two skips. Cap Slow at −2 with Capped Sting’s leftover-MP read — one Slow source.
- `FSN-RIFT-FRESH` remains the Void Rift / leftover-AP===max CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-WATCH-THIN

FORMATION_ID: `FSN-WATCH-THIN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-TAX` — `bishop` **without** heal / proposed `watch_taxer` — pack median — overwatch next-spell +1 AP
- `ROLE-THIN-GAIT` — `pawn` **without** heal / proposed `thin_gaiter` — pack median or −1 — leftover 1/0 poke

VARIANT_RULES:

- Distinct from `FSN-WATCH-EVEN` (overwatch snap **steals 1 leftover MP** + leftover-MP-even ≥ 2 poke). This sheet is overwatch snap **taxes the walker’s next spell +1 AP** plus leftover **AP===1 AND MP===0** poke.
- Band 0: Taxer Frost only; Gaiter Strike only. If kit band is still 0, **do not spawn this id** — show `FSN-WATCH-EVEN`.
- Elite: Gaiter only. Taxer never gets Watch Drain / Watch Root / Watch Sip / Glass Shot as CORE.
- Unlock after `FSN-WATCH-EVEN` **or** walked into Hold Ground / Far Watch this run.
- **Never PAIR Watch Tax + Gun.** `/GUN` is the 3-body.
- Leftover 1/1 is Prime, skip Thin. Leftover 0/0 is Gaunt, skip Thin. Leftover 2/0 is Gait Gift, skip Thin.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Watch Tax: overwatch snap still deals. Walker’s **next spell** costs **+1 AP**. Not a leftover steal. Not a leftover dump. Quiet Hex is an ungated next-spell tax, not an overwatch snap.
- Thin Gait: 10, +8 iff leftover **AP === 1 AND leftover MP === 0**. Dual Keep 1/0 **opens**. Dual Keep 1/1 is Prime Plate, skip.
- Together: snap taxes the confirm, then poke leftover 1/0 after they spend into it. Don’t walk into the band **or** sit 1/1 **or** dump to 0/0 — is a complete answer.

TACTICAL_PLAN:

- Taxer arms overwatch on an approach file; skip if already in 1–2.
- Gaiter lurks at 3 and commits when leftover is 1/0 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Overwatch next-spell tax + leftover-1/0 poke. Wave 18 Watch Even standing on the **next snap verb** (tax, not leftover-MP steal) and the **next leftover poke** (1/0, not MP-even). Combination, not a new sprite.

PLAYER_THREAT:

- Walking the band, paying +1 AP on the next Frost, landing leftover 1/0, then eating 18. Spike is one 18. Recoverable: walk around, sit 1/1, dump to 0/0.

COUNTERPLAY:

- Walk around the band. Strike from outside. Sit 1/1 (Prime). Dump to 0/0 (Gaunt). Keep 1 walk MP. Kill the Gaiter. The Taxer without a walk-in is Frost.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with a long file plus a side aisle.
- Weight 0 on cramped 1-tile closets (forced walk-in is a lock).

AI_REQUIREMENTS:

- Taxer: artillery; skip already-in-1–2; never Drain / Root / Sip as CORE.
- Gaiter: flanker; skip leftover not 1/0 unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-THIN/GUN` — Watch Thin Hunt full: add `ROLE-SNIPER` (`glass_sniper`) as a third body. **Never PAIR Tax + Gun as a two-body.** The 3-body is why the band has a gun.
- `FSN-WATCH-EVEN` remains the leftover-MP-steal / leftover-MP-even CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-SESTET-CHOIR

FORMATION_ID: `FSN-SESTET-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SESTET-MEND` — `queen` **with** heal / proposed `sestet_mender` — pack median
- `ROLE-VERSE-SESTET` — `bishop` **without** heal / proposed `verse_sesteter` — pack median
- `ROLE-HAZARD` — `knight` / live `ember_knight` or proposed `ignite_alchemist` — pack median — Inferno only if kit band 2; live melee burn

VARIANT_RULES:

- Distinct from `FSN-STAVE-CHOIR` (leftover-sum===5 heal + last-id until leftover-sum===5). This sheet is leftover-**sum===6 unequal** heal, then Inferno is illegal until leftover AP + leftover MP === 6 unequal.
- Unlock after `FSN-STAVE-CHOIR` **or** `FSN-SESTET-STEP`.
- Elite: Mender only. Verser and Ignite stay junior. Inferno stays 3-turn cooldown, one target.
- No Swap, no martyr, no Mark (those are `FSN-ASH-COURT` / `FSN-EMBER-RIFT`).
- If kit band is still 0, **do not spawn this id**.
- `lastResolvedSpellId` required. Dual Keep **cannot** peel Verse Sestet.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Sestet Mend as `FSN-SESTET-STEP`.
- Verse Sestet: last resolved id **illegal until leftover AP + leftover MP === 6 AND unequal**. `0 = 0` does **not** lift. `2 = 2` does **not**. `3 = 3` does **not**. `3 = 2` does **not**. `3 = 1` does **not**. `1 = 1` does **not**. Dual Keep does **not**. Forced-move does **not**. Recast Frost instead of Inferno is legal.
- Live ember melee 3/turn × 3 plus optional Inferno 8/turn × 3. They may both exist **on different cadences**. Do not Inferno the same turn as a melee apply if that hides the leftover window.
- Ignite stack gate ≥ 2 public DoT ticks before a second Inferno.

TACTICAL_PLAN:

- Verser locks Inferno (or the last nuke id) until they sit (4,2). Mender Sestet-Mends if both leftover sums === 6 unequal; else Shields.
- Ember flanks and holds Inferno until LoS and the leftover window is public **or** Verse has already locked it.
- If the Mender dies, remaining pair is a last-id lock + burn knight — intended.

SYNERGY:

- Leftover-sum-6-unequal heal + last-id until leftover-sum-6-unequal + ignite. Wave 18 Stave Choir standing on the **next leftover-sum** (6, equality banned). Combination, not a new sprite.

PLAYER_THREAT:

- Long burn if the queen lives, plus Inferno locked until you sit (4,2). Spike only if Inferno is up **and** you stand in melee. Interruptible: sit (4,2), recast Frost, kill the scribe.

COUNTERPLAY:

- Bank leftover-sum 6 unequal to peel Verse. Recast Frost. Kill the Mender. Cursed Wound. Frost the ember’s MP. Do not sit (4,2) in their face just to recast Inferno.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with two approaches. One may be warm flavor; one must be clean. Reject lava-painted engagement + Inferno (double hazard).
- Healer needs a retreat tile that is not the ember’s choke.

AI_REQUIREMENTS:

- Mender: healer; skip wrong leftover window.
- Verser: controller; skip no `lastResolvedSpellId`; skip already-in-window.
- Ember: flanker; **not** berserk (berserk + healer is a suicide dive).
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-SESTET-CHOIR/NO-IGNITE` — drop ember if band 2 is not the run’s band; Mender + Verser + Cover.
- `FSN-STAVE-CHOIR` remains the leftover-sum-5 BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-GAIT-TERN

FORMATION_ID: `FSN-GAIT-TERN`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GAIT-GIFT` — `queen` **with** heal / proposed `gait_gifter` — pack median
- `ROLE-CADENCE-TERN` — `bishop` **without** heal / proposed `cadence_terner` — pack median
- `ROLE-CANTOR` — `queen` / proposed `font_cantor` or live default with `starter-heal` — pack median — self-heal + Shield; **or** omit and use Cover

VARIANT_RULES:

- Distinct from `FSN-PRIME-CAP` (leftover **1/1** heal + remaining `n>2→2`). This sheet is leftover **AP ≥ 2 AND leftover MP = 0** heal, then compress remaining `n>3` → `3`.
- Unlock after `FSN-PRIME-CAP` **or** `FSN-SESTET-STEP`.
- Elite: Gifter only. Terner and Font stay junior.
- **Never PAIR Tern + Tierce.** `/TERN` on `FSN-TIERCE-VERSE` is the later COURT.
- Dual Keep 2/0 **opens** Gait Gift. Dual Keep 2/2 is Poise, skip. Dual Keep 1/1 is Prime Gift, skip.
- Cadence Floor / Prime / Rise / Snuff / Cap / Dock stay off this sheet.
- Extra door `gait_cantor` is **not** this family. Do **not** invent `gait_cantor_gift`.
- Random 30% family lottery is **off**.
- Font never gets Inferno. At most one Cantor.

SPELL_POOL_INTERACTIONS:

- Gait Gift (10 HP) pays only if leftover **AP ≥ 2 AND leftover MP = 0**. One-body. (6,0) is Gait Gift **and** a Sestet pair — Sestet Mend still needs **both** bodies and is **not** on this sheet.
- Cadence Tern: remaining `n>3` → `3`. 0/1/2/3 unchanged. Target keeps every spell. Cap would have written 2. Floor would have written 1. Tierce **kills** a 3 — not this turn.
- Font: Blood Mend (self) + Shield (ally). **No** Inferno.

TACTICAL_PLAN:

- Terner Terns a 7 to a 3 if a nuke remaining is 5+. Gifter Gait-Gifts only if leftover AP ≥ 2 and leftover MP = 0; else Shields.
- Font Shields the Gifter when the Gifter is under 50%, else self-mends.
- If the Gifter dies, remaining pair is a remaining-compress bishop + glass healer — intended.

SYNERGY:

- Leftover AP≥2/MP=0 heal + remaining n>3→3 + font. Wave 18 Prime Cap standing on the **next leftover heal** (AP≥2/MP=0, not 1/1) and the **next remaining rewrite** (n>3→3, not n>2→2). Combination, not a new sprite.

PLAYER_THREAT:

- Long fight. Spike is low. Fail is sitting leftover MP 0 with leftover AP ≥ 2 in their face **and** holding remaining 7 so Tern hands it back as a 3.

COUNTERPLAY:

- Hold 1 walk MP. Sit 1/1 (Prime). Sit Dual Keep 2/2 (Poise). Recast the remaining-5 id **before** Tern. Cap your remaining 5 to 2 (Dock’s later problem, not this). Kill the Gifter.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Gifter needs two walk-offs. Never a closed ring.
- No Thorned Ground on the only path to the Gifter.

AI_REQUIREMENTS:

- Gifter: healer; skip leftover MP ≠ 0 or leftover AP < 2.
- Terner: controller; skip all remaining ≤ 3; never Tierce the same turn.
- Font: healer + ally Shield. Same apply gate as `FSN-QUIET-CHOIR`.
- Soph 3–4. `AI_BACKLINE_PROTECT` on.

VARIANTS:

- `FSN-GAIT-TERN/NO-FONT` — Gifter + Terner + Cover.
- `FSN-PRIME-CAP` remains the leftover-1/1 / n>2→2 BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SESTET-QUIET

FORMATION_ID: `FSN-SESTET-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SESTET-STEP` — `queen` **without** heal / proposed `sestet_stepper` — pack median
- `ROLE-SESTET-MEND` — `queen` **with** heal / proposed `sestet_mender` — pack median
- `ROLE-COVER` — `rook` / proposed `cover_squire` or live `iron_golem` — pack median + 1 — body-block

VARIANT_RULES:

- Unlock after `FSN-SESTET-STEP` **and** (`FSN-STAVE-QUIET` or `FSN-SCORE-QUIET`).
- Distinct from `FSN-STAVE-QUIET` (stave step + stave mend + cover). This sheet joins leftover-**sum===6 unequal**, then cashes the six leftover reads.
- Elite: Cover only. Stepper and Mender stay junior.
- Cover: Shield / Iron Skin / body-block. **No** Inferno. Swap peel is the **one** rare (legal dest only).
- **Do not ship this id until ally `targetId` apply exists** for Cover’s Shield. `FSN-SESTET-STEP` heals do **not** wait on it.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Sestet Step / Sestet Mend as `FSN-SESTET-STEP`.
- Cover Iron Skin / Shield on the Mender. Do not also Root.

TACTICAL_PLAN:

- Cover interposes on the Mender axis with a **gap**. Stepper joins when the Mender leftover sum === 6 unequal. Mender Sestet-Mends if both leftover sums === 6 unequal; else Shields.
- If Cover dies, remaining pair is `FSN-SESTET-STEP` — intended.

SYNERGY:

- Sestet step + sestet mend + cover. Wave 18 Stave Quiet standing on the **next leftover-sum** (6, equality banned). Combination, not a new sprite.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is never looking at the Mender while Cover holds the door.

COUNTERPLAY:

- Same leftover dumps as `FSN-SESTET-STEP`. Occupy every Chebyshev-1 of the Mender. Peel Cover to open the gap. Cursed Wound the Mender. Walk around; Cover is MP-poor.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Mender needs a retreat tile that is not Cover’s choke.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Stepper / Mender: same as `FSN-SESTET-STEP`.
- Cover: guardian interpose + optional Swap peel; `chokepointCamp` only with a gap.
- Soph 3–4. `AI_BACKLINE_PROTECT` on. `groupTactics` at 4.

VARIANTS:

- `FSN-SESTET-QUIET/LEND` — Lend Hood escort: replace Cover with `ROLE-SESTET-LEND` + `ROLE-SESTET-HOOD` + `tempo_precentor`. Cash the window with +1/+1 (sum 8), or hold (4,2) through a miss. **Never PAIR Lend + Hood as a two-body.** Unlock after this BRIGADE. Inequality preserved — Lend **cannot** manufacture Poise.
- `FSN-STAVE-QUIET` remains the leftover-sum-5 BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PSALM-SESTET

FORMATION_ID: `FSN-PSALM-SESTET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PSALM-TURN` — `queen` **without** heal / proposed `psalm_turner` — pack median — mixed-side leftover invert
- `ROLE-SESTET-MEND` — `queen` **with** heal / proposed `sestet_mender` — pack median
- `ROLE-SESTET-STING` — `pawn` **without** heal / proposed `sestet_stinger` — pack median or −1

VARIANT_RULES:

- Distinct from `FSN-HYMN-STAVE` (two-**ally** invert + leftover-sum===5 heal + leftover-sum===5 sting). This sheet is invert leftover AP↔MP on **one ally and one hostile** (caster stays), **keeping sum 6 unequal**, then heal / sting.
- Band 0: **do not spawn this id**. Show `FSN-HYMN-STAVE`.
- Elite: Turner only. Mender never gets Stave Mend. Stinger never gets Stave Sting (PAIR bans).
- Unlock after `FSN-SESTET-STEP` **and** `FSN-SESTET-SIP`.
- **Never PAIR Psalm Turn + Hymn Turn / Duel Turn / Purse Turn.**
- Sum invariant: Sestet stays Sestet; Stave stays Stave. Equal leftover on both is a double no-op — skip.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Psalm Turn: invert leftover AP↔MP independently on **one same-side non-caster** and **one opposite-side**. Caster leftover **unchanged**. Not `isSwap`. Player-side summons **count** as same-side if they are allies of the invert-ally, or opposite-side if they are the hostile.
- Sestet Mend / Sestet Sting as `FSN-SESTET-STEP` / `FSN-SESTET-SIP`.
- Together: invert (6,0) ally and (0,6) hostile into the same pairs (still sum 6 unequal), then mend / sting. Sit 2/2 on both **or** isolate (no same-side non-caster) — is a complete answer.

TACTICAL_PLAN:

- Turner inverts only if pack size ≥ 2 living same-side non-casters **and** an opposite-side in r3 **and** at least one pair is unequal. Prefer Sestet pairs so Mend / Sting still fire.
- Mender Sestet-Mends if both leftover sums === 6 unequal. Stinger commits when leftover sum === 6 unequal **or** HP% ≤ 40.

SYNERGY:

- Mixed-side leftover invert + leftover-sum===6 unequal heal + leftover-sum===6 unequal sting. Wave 18 Hymn Stave standing on the **next invert target** (one ally **and** one hostile, not two allies) and the **next leftover-sum** (6 unequal, not 5). Combination, not a new sprite.

PLAYER_THREAT:

- Watching a (0,6) invert into (6,0) and still being Sestet, then eating an 8 mend on them and an 18 sting on you. Spike is one 18. Recoverable: sit 2/2, isolate, dump a pool.

COUNTERPLAY:

- Fight without a second ally. Sit 2/2 on both (double no-op). Sit 3/3. Dump a pool. Kill the Stinger. Kill the Turner. The Mender without two Sestet bodies is Shield.

MAP_REQUIREMENTS:

- `openField` or `arena`. Turner needs Chebyshev 3 to one ally and one hostile.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Turner: controller; skip pack size < 2 same-side non-casters, no opposite-side, or both leftover pairs already equal.
- Mender: healer; skip wrong leftover window.
- Stinger: flanker; skip if leftover sum ≠ 6 or tied unless 10 still kills.
- Soph 3–4. `groupTactics` at 4.

VARIANTS:

- `FSN-PSALM-SESTET/E-TURN` — elite Turner, still no Hymn Turn.
- `FSN-HYMN-STAVE` remains the two-ally / leftover-sum-5 BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-TIERCE-VERSE

FORMATION_ID: `FSN-TIERCE-VERSE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-CADENCE-TIERCE` — `bishop` **without** heal / proposed `cadence_tiercer` — pack median
- `ROLE-VERSE-SESTET` — `bishop` **without** heal / proposed `verse_sesteter` — pack median
- `ROLE-TAX` — `bishop` / proposed `tax_scribe` or live `bone_scribe` — pack median — Weaken / Expose; **no** drain

VARIANT_RULES:

- Unlock after `FSN-PRIME-TAX` **or** `FSN-SESTET-CHOIR`. Wave 19 “Tierce Verse.”
- Distinct from `FSN-DOCK-VERSE` (remaining `2→0` + last-id until leftover-sum===5). This sheet **unlocks remaining 3 → 0**, then locks recast until they sit Sestet.
- Elite: Tiercer only. Verser and Tax stay junior.
- Tax is the **one** rare. Drain Courage is COURT, not this sheet (two AP engines).
- **Never PAIR Tierce + Tern.** `/TERN` is the later COURT.
- **Never PAIR Verse-Sestet + Scribe as a two-body.** The CADRE is why both last-id and glyph tax exist, with a third peeler (Tierce).
- No Inferno on the bishops (heal-less so inference stays caster). No Root.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Cadence Tierce: remaining `n===3` → `0`. Zeros stay 0. `n===1` unchanged (Snuff). `n===2` unchanged (Dock). `n>3` unchanged (Tern / Cap / Floor).
- Verse Sestet as `FSN-SESTET-CHOIR`. Dual Keep **cannot** peel.
- Glyph Tax / Weaken / Expose: 0 damage identity. Leave-the-zone is the answer. Tax will not overlap two zones.
- Together: Tierce a remaining-3 Inferno to 0, then Verse so recast is illegal until leftover-sum 6 unequal. Recast **before** Tierce **or** sit remaining at 1/2/4+ **or** bank leftover-sum 6 unequal — is a complete answer.

TACTICAL_PLAN:

- Turn 1: Tax Weakens if the player is already wounded; else holds. Tiercer Tierces only if a nuke remaining is 3. Verser locks the last id if one exists.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Remaining 3→0 + last-id until leftover-sum===6 unequal + glyph tax. Wave 18 Dock Verse standing on the **next remaining rewrite** (3→0, not 2→0) and the **next leftover peel** (sum 6 unequal, not sum 5). Combination, not a new sprite.

PLAYER_THREAT:

- High if Inferno is sitting on remaining 3 and you wanted it this tick, then Verse locks the recast until (4,2). Still a leftover-bank. Failure is dumping a 5-AP Inferno after Tierce into a Verse lock.

COUNTERPLAY:

- Spend the remaining-3 Inferno **now**. Sit remaining at 1 (Snuff) or 2 (Dock) or 4+ (Tern / Cap / Floor). Bank leftover-sum 6 unequal to peel Verse. Kill the Verser (glass). Leave the tax zone.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- Tax 3×3 must not cover **all** walk-offs.

AI_REQUIREMENTS:

- Tiercer: controller; skip all-non-3; never Tern the same turn.
- Verser: controller; skip no last-id / already-in-window.
- Tax: caster; skip recast Weaken; zone only if an exit exists.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-TIERCE-VERSE/TERN` — Tern Tierce: replace Tax with `ROLE-CADENCE-TERN`. Compress a 7 to a 3, **then** Tierce the 3 to 0 on a **later** turn. **Never PAIR Tern + Tierce on one BASE kit**; the COURT of three (plus Verse) is why both remaining rewrites exist. Unlock after this CADRE. Never both on the same AP bar.
- `FSN-TIERCE-VERSE/NO-TAX` — teaching CADRE: Tiercer + Verser + Cover.
- `FSN-DOCK-VERSE` remains the remaining-2→0 / leftover-sum-5 CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-ODD-BRICK

FORMATION_ID: `FSN-ODD-BRICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-ODD-TOLL` — `bishop` **without** heal / proposed `odd_toller` — pack median
- `ROLE-BRICK-TAX` — `rook` **without** heal / proposed `brick_taxer` — pack median
- `ROLE-TURRET` — `rook` / proposed `stone_castellan` — pack median + 1 — stationary summon

VARIANT_RULES:

- Unlock after `FSN-GAIT-BRICK` **or** `FSN-SPAWN-PRIME`. Wave 19 “Odd Brick.”
- Distinct from `FSN-GAIT-BRICK` (leftover-**MP=0** walk tax + barrier-adjacent **walk lock** + turret). This sheet **taxes the next walk at leftover AP odd**, then **taxes again while barrier-adjacent**. Walks stay legal.
- Elite: Taxer only. Toller and Castellan stay junior.
- Turret cap 1, lifespan 4, `mp: 0`, must not path. Do not also roll wolf/archer. Global summon cap still 2 — this sheet uses 1.
- **Never PAIR Odd Toll + Gait Toll.** **Never PAIR Brick Tax + Brick Hold.** **Never PAIR Toll + Scribe.**
- Brick Tax **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Never seal the last aisle with a new barrier.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Odd Toll: next **walk** +1 AP if leftover **AP is odd**. Keep leftover AP even. Relocate / Swap do not pay.
- Brick Tax: next **walk** +1 AP while adjacent to a **barrier**. Destroy the barrier and the tax drops; lock **stays** until duration. Not Brick Hold (forbids the walk). Not Brick Brace (negates a hit).
- Turret linear shard owns a file. Iron Skin / Shield on the turret, not a second turret.
- Together: camp leftover AP 1/3/5 beside the door, then both walks cost extra. Sit leftover AP even **or** Coup the wall **or** sit Chebyshev 2 — is a complete answer.

TACTICAL_PLAN:

- Toller Tolls if leftover AP is odd; skip leftover AP even.
- Taxer Taxes only if a living barrier sits Chebyshev 1. Skip no-barrier. Never Tax a body that needed to step off lava this turn (solvability).
- Castellan camps a **gap**, never a closed box.

SYNERGY:

- Leftover-AP-odd walk tax + barrier-adjacent walk tax + turret. Wave 18 Gait Brick standing on the **next leftover tax** (AP odd, not MP=0) and the **next barrier verb** (walk +1 AP, not walk lock). Combination, not a new sprite.

PLAYER_THREAT:

- Camping leftover AP odd beside the door, then both walks cost extra. Spike is +1 AP on the first legal walk after they leave, plus another +1 while hugging the wall. Recoverable: keep leftover AP even, Coup the wall, Swap.

COUNTERPLAY:

- Spend 1 leftover AP before walking (even leftover). Destroy the barrier. Swap / blink off the adjacent cell. Sit Chebyshev 2. Kill Tax. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars **and** an already planted barrier. Never a closed ring.
- Weight 0 on cramped 1-tile closets. Weight 0 if no barrier exists on the generated map.
- Player must have a tile that is **off** the turret axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Toller: controller; skip leftover AP even; never Gait Toll / Scribe as CORE.
- Taxer: controller; skip no-barrier; never Hold / Brace / Step / Root; never seal the last aisle.
- Castellan: turret AI (`mp: 0`, no path); `chokepointCamp` only with a gap.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-ODD-BRICK/NO-GUN` — drop Castellan if turret AI is not ready; Toller + Taxer + Cover. Still not a PAIR of Toll+Tax without a third peeler.
- `FSN-GAIT-BRICK` remains the leftover-MP=0 **walk** tax / barrier-adjacent **walk lock** CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PURSE-SESTET

FORMATION_ID: `FSN-PURSE-SESTET`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-PSALM-TURN` — `queen` **without** heal / proposed `psalm_turner` — pack median — mixed-side leftover invert
- `ROLE-SESTET-SIP` — `pawn` **without** heal / proposed `sestet_sipper` — pack median — leftover-sum===6 unequal leftover-AP steal
- `ROLE-STAVE-STING` — `pawn` **without** heal / proposed `stave_stinger` — pack median or −1 — leftover-sum-5 poke

VARIANT_RULES:

- Distinct from `FSN-PURSE-STAVE` (two-**ally** invert + Stave Sip manufactures Score + Score Sting) and `FSN-PSALM-SESTET` (mixed-side invert + Sestet Mend + Sestet Sting). This sheet is mixed-side invert, then Sestet Sip **manufactures Stave**, then Stave Sting.
- Band 0: **do not spawn this id**. Show `FSN-PSALM-SESTET`.
- Elite: Turner only. Sipper never gets Stave Sip. Stave Stinger never gets Sestet Sting (PAIR ban).
- Unlock after `FSN-PSALM-SESTET` **or** `FSN-PURSE-STAVE`.
- (0,6) fizzles Sip. Prefer invert into (4,2) / (6,0) / (5,1) so Sip manufactures Stave.
- **Never PAIR Sestet-Sip + Stave-Sip.** **Never PAIR Sestet-Sting + Stave-Sting.** **Never PAIR Psalm Turn + Hymn Turn.**
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Psalm Turn: invert one ally and one hostile; sum invariant; caster unchanged.
- Sestet Sip: steal 1 leftover AP iff leftover sum === 6 unequal and leftover AP ≥ 1. (4,2)→(3,2) **manufactures Stave**. (5,1)→(4,1) **manufactures Stave**. (6,0)→(5,0) **manufactures Stave**. (0,6) fizzles.
- Stave Sting: 10 + 8 iff leftover AP + leftover MP === 5. Dual Keep leftover **cannot** open the 8. Dual Keep leftover-sum 4 unequal is Score Sting, skip.
- Together: invert, then sip (4,2)→(3,2) Stave, then sting the manufactured window. Sit (0,6) **or** sit 2/2 **or** dump a pool before Sip — is a complete answer.

TACTICAL_PLAN:

- Turner inverts only if at least one pair is unequal. Prefer (6,0)/(0,6) or (4,2)/(2,4).
- Sipper Sips if leftover sum === 6 unequal and leftover AP ≥ 1; skip (0,6); skip if the manufactured window would not be Stave and no Sestet Sting is in the pack (it is not — this sheet wants Stave).
- Stave Stinger commits when leftover sum === 5 **or** HP% ≤ 40.

SYNERGY:

- Mixed-side leftover invert + leftover-sum===6 unequal sip manufactures Stave + leftover-sum-5 sting. Wave 18 Purse Stave standing on the **next invert target** (mixed-side, not two allies) and the **next manufactured window** (Stave, not Score). Combination, not a new sprite.

PLAYER_THREAT:

- Watching a (4,2) invert stay (4,2), then Sip to (3,2), then Stave Sting 18. Spike is one 18. Recoverable: sit (0,6), sit 2/2, dump AP before Sip.

COUNTERPLAY:

- Sit (0,6) — Sip fizzles. Sit 2/2. Spend leftover AP before Sip. Isolate (no same-side non-caster). Kill the Sipper. Kill the Stave Stinger. The Turner without two bodies is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Turner needs Chebyshev 3 to one ally and one hostile.
- Reject 1-tile tunnels.

AI_REQUIREMENTS:

- Turner: controller; skip missing same-side non-caster / missing opposite-side / both leftover pairs already equal.
- Sipper: flanker; skip leftover AP = 0; skip if manufactured window is not Stave and no Stave Sting is present.
- Stave Stinger: flanker; skip if leftover sum ≠ 5 unless 10 still kills.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-PURSE-SESTET/E-SIP` — elite Sipper, still no Stave Sip.
- `FSN-PURSE-STAVE` remains the two-ally / Score-manufacture CADRE; do not merge ids.
- `FSN-PSALM-SESTET` remains the mixed-side / leftover-sum-6-unequal heal BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SESTET-HOLD

FORMATION_ID: `FSN-SESTET-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-SESTET-HOLD` — `knight` **without** heal / proposed `sestet_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-SESTET` — `knight` **without** heal / proposed `must_sesteter` — pack median — tools-until leftover-sum===6 unequal **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-SESTET-HOOD` junior **or** omit — if present, skip if leftover sum already ≠ 6 or tied

VARIANT_RULES:

- Unlock after (`FSN-SESTET-SIP` or `FSN-TERN-OCTA`) **and** a leader-boost CADRE. Wave 19 “Sestet Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Sestet Hold + Must Sestet** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP + leftover MP === 6 unequal; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-SESTET-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Sestet Hold: cannot spend walk MP while leftover AP + leftover MP === 6 **AND** unequal. Spells stay legal. Spend one pool so the sum leaves 6 **or** Dual Keep 2/2 **or** dump to leftover-sum 5 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump to 3/3 **or** dump both to walk. Prefer (0,6) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- Must Sestet: remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 6 AND unequal **and this spell spends last AP**. Strike stays legal.
- Together: Dual Keep cannot open Sestet. Sitting (4,2) cannot walk **and** cannot Inferno unless last AP. Dual Keep 2/2 peels Hold (not leftover-sum 6 unequal) but does **not** peel Must unless they also spend last AP on Strike. Dump leftover to leftover-sum 5 peels Hold (Stave Hold’s window, not this one). Dump leftover to leftover-sum 4 unequal peels Hold. Dump leftover to leftover-sum 3 peels Hold. Dump leftover to 3/3 peels Hold. Dump leftover to 0/0 peels Hold. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover sum === 6 unequal; skip if already 2/2 or leftover-sum 5 or leftover-sum 4 unequal or leftover-sum 3 or 3/3 or 1/1 or 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-sum-6-unequal **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover so the sum leaves 6, Dual Keep 2/2, dump to leftover-sum 5, dump to leftover-sum 4 unequal, dump to leftover-sum 3, dump to 3/3, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-sum-6-unequal threat in this drop. Still turn-based. Failure is sitting (0,6) to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after leaving leftover-sum 6 unequal **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so the sum leaves 6 (Hold peels). Dual Keep 2/2 (Hold peels; Must needs last AP on Strike). Dump to leftover-sum 5 (Hold peels; Stave Hold is a different COURT). Dump to leftover-sum 4 unequal (Hold peels; Score Hold is a different COURT). Dump to leftover-sum 3 (Hold peels; Tally Hold is a different COURT). Dump to 3/3 (Hold peels; Poise Hold is a different COURT). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover sum ≠ 6 or tied; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold / Poise Hold / Tally Hold / Score Hold / Stave Hold / Brick Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if leftover sum ≠ 6 or tied; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if leftover sum already ≠ 6 or tied.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-SESTET-HOLD/LANE` — BRIGADE-shaped: Hold + Must Sestet + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-SESTET-HOLD/NO-HOOD` — COURT of three.
- `FSN-SESTET-HOLD/TRIDECA` — COURT **Trideca Plug**: replace this id’s members with `ROLE-TRIDECA` + `ROLE-SESTET-SILL` + `ROLE-TERN-STRIDE`. Plus-arm-3 corridor seal, tax a neighbor at turn start, lock the next walk to Chebyshev 3 orthogonal. **Skip until remaining cap ≥ 13** (live cap 2). Burst the 13 HP. Walk a far **diagonal** around the bounding 7×7 (the designed counter vs Hendeca’s plus and Dodeca’s 3×4). Sit on a cell so the place fizzles. Swap around the block. `summonAI === "tridecaspan"` required. Every cell occupied. Click = **center**. Do not also roll a second post. Needs a free 13-cell plus plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 13. Weight 0 on maps with no free 13-cell plus (solvability). **Never PAIR Trideca + Dodeca / Hendeca / Sestet Post / Tern Stride as a two-body.**
- `FSN-SESTET-HOLD/BOUNCE` — COURT **Bounce Sestet**: replace Hold + Must + Warden with `ROLE-SESTET-BOUNCE` + `ROLE-MUST-SESTET` + `fuse_binder`. Two leftover-sum===6 unequal bodies, bounce 12+12 onto the wick. **Never PAIR Sestet Bounce with Stave / Score / Tally / Poise / Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-STAVE-HOLD/BOUNCE` **or** `FSN-SESTET-SIP`. Missing second leftover-sum-6-unequal flag → 12 only. Player keeps leftover sum ≠ 6 unequal on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-SESTET-HOLD/KENNEL` — COURT **Lava Kennel**: replace Hold + Must + Hood with `ROLE-LAVA-CUT` + `ROLE-SUMMON-ORTH` + `ROLE-STRIKE-PLATE`. Threshold poke near lava, then tax pet diagonal walks **or** zero the next Strike — **never PAIR Orth + Plate on one BASE kit**; the COURT is why both pet / Strike verbs exist, with a third peeler (Cut). Unlock after `FSN-STAVE-HOLD/KENNEL` **or** `FSN-MIRE-DIAG`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot walk diagonal for AP). Cap one kennel engine. Orthogonal pet walks are free of the diagonal tax. Hit the summoner (Strike Plate zeros the next **Strike**, not the owner’s incoming hit; Frost still deals full). Twin Gate pads do **not** count as lava. Drop this variant if `summonAI` is empty. Map needs lava occupancy in Chebyshev 6 of a legal floor.
- `FSN-STAVE-HOLD` remains the leftover-sum===5 **and** last-AP COURT; this id is leftover **sum === 6 AND unequal**.
- `FSN-STAVE-HOLD/DODECA` remains the 12-cell 3×4 COURT; `/TRIDECA` is the 13-cell plus COURT.
- `FSN-SCORE-HOLD/HENDECA` remains the 11-cell stretched-plus COURT.
- `FSN-SESTET-SIP` / `FSN-TERN-OCTA` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–19 still stand. This drop **meshes**; it does not replace.

```
PAIR:    SESTET-STEP        SESTET-SIP         TERN-OCTA          MIRE-DIAG
              \\                 |                   |                  /
CELL:     SESTET-GATE       SPAWN-PRIME        SLIDE-CAP         WATCH-THIN
              \\                 |                   |                  /
BRIGADE:  SESTET-QUIET      GAIT-TERN          PSALM-SESTET      SESTET-CHOIR
              \\                 |                   |                  /
CADRE:    TIERCE-VERSE      ODD-BRICK          PURSE-SESTET
              \\                 |                  /
COURT:                    SESTET-HOLD   SESTET-HOLD/TRIDECA   SESTET-HOLD/BOUNCE   SESTET-HOLD/KENNEL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-SESTET-STEP` | `FSN-STAVE-STEP` **or** `FSN-SCORE-STEP` |
| `FSN-SESTET-SIP` | `FSN-STAVE-SIP` **or** `FSN-SESTET-STEP` |
| `FSN-TERN-OCTA` | `FSN-RING-HEPTA` **or** `FSN-FILE-HEXA` |
| `FSN-MIRE-DIAG` | `FSN-RIME-RANK` **or** `FSN-LAVA-FILE` |
| `FSN-SESTET-GATE` | `FSN-STAVE-GATE` **or** `FSN-SESTET-SIP` |
| `FSN-SPAWN-PRIME` | `FSN-LAST-DUAL` **or** summoned this run |
| `FSN-SLIDE-CAP` | `FSN-RIFT-FRESH` **or** `FSN-SESTET-SIP` |
| `FSN-WATCH-THIN` | `FSN-WATCH-EVEN` **or** walked into Hold Ground / Far Watch |
| `FSN-SESTET-CHOIR` | `FSN-STAVE-CHOIR` **or** `FSN-SESTET-STEP` |
| `FSN-GAIT-TERN` | `FSN-PRIME-CAP` **or** `FSN-SESTET-STEP` |
| `FSN-SESTET-QUIET` | `FSN-SESTET-STEP` + (`FSN-STAVE-QUIET` or `FSN-SCORE-QUIET`) |
| `FSN-PSALM-SESTET` | `FSN-SESTET-STEP` + `FSN-SESTET-SIP` |
| `FSN-TIERCE-VERSE` | `FSN-PRIME-TAX` **or** `FSN-SESTET-CHOIR` |
| `FSN-ODD-BRICK` | `FSN-GAIT-BRICK` **or** `FSN-SPAWN-PRIME` |
| `FSN-PURSE-SESTET` | `FSN-PSALM-SESTET` **or** `FSN-PURSE-STAVE` |
| `FSN-SESTET-HOLD` | (`FSN-SESTET-SIP` or `FSN-TERN-OCTA`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 20 packs (not this drop)

Wave 20 families do **not** exist yet. Same-day 2026-10-27 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-27.md`, open as PR #1177: Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn + Septet court) and SDE Wave 18 unique CORE (`spell-hook-stride` … `spell-hook-fold`, PR #1143, **except** Pack Hook / Hook Fold unless a later boss sheet claims them) stay Wave **20** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 19 sheets.

Held verbs (do not FSN this drop): Septet Mend (both leftover AP + leftover MP **=== 7**), Cadence Quarte (remaining `n===4` → `0`), Tetradeca Span (occupy-weight 14; skip until remaining cap ≥ 14; live cap is 2), Feud Turn, Court Quarte, Hook Stride, Nona Oath, Slide Reel, Hook Bite, Idle Mark, Thin Plate, Brier Skip, Wide Sting, Summon Hook, Wide Gift, Cadence Quad, Even Toll, Brick Fee, Watch Bind, Prime Gait, Slide Cut, Idle Plate, Pack Hook, Hook Fold. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` stay kit-only. Do **not** mint `septet_mender` / `cadence_quarter` / `tetradeca_prelate` / `feud_turner` / `cadence_quader` this drop.

Do **not** pack `sestet_holder` with `must_sesteter` as a teaching pair (Wave 19 rule). `FSN-SESTET-SIP` stays the leftover-sum-6-unequal poke lesson; `FSN-SESTET-HOLD` stays the walk-until leftover-sum===6 unequal **and** last-AP COURT.

Do **not** pack `sestet_mender` with `gait_gifter` as a teaching pair. `FSN-SESTET-STEP` stays the both-bodies leftover-sum===6 unequal lesson; `FSN-GAIT-TERN` stays the leftover-AP≥2/MP=0 BRIGADE. Stave Mend stays leftover **AP + MP === 5** on **both** bodies (`FSN-STAVE-STEP`). Score Mend stays leftover **AP + MP === 4 AND unequal** on **both** bodies (`FSN-SCORE-STEP`). Tally Mend stays leftover **AP + MP === 3** on **both** bodies (`FSN-TALLY-STEP`). Poise Mend stays leftover **AP === MP ≥ 1** on **both** bodies (`FSN-POISE-STEP`). Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`). Prime Gift stays leftover **exactly 1/1** (`FSN-PRIME-CAP`).

Do **not** pack `sestet_mender` with `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `dry_gaiter` / `dry_mender` / `lean_gifter` / `prime_gifter`. `FSN-STAVE-STEP` stays leftover-sum===5; `FSN-SCORE-STEP` stays leftover-sum===4 unequal; `FSN-TALLY-STEP` stays leftover-sum===3; `FSN-POISE-STEP` stays leftover-tied-≥1; `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-LEAN-RISE` stays leftover-AP=0 / MP≥1; `FSN-PRIME-CAP` stays leftover-1/1; this drop owns leftover **AP + MP === 6 AND unequal**. **0 = 0 does not fire. 2 = 2 does not fire. 3 = 3 does not fire. 3 = 2 does not fire. 3 = 1 does not fire. 3 = 0 does not fire. 1 = 1 does not fire. Dual Keep cannot fake sum 6.**

Do **not** pack `cadence_tiercer` with `cadence_terner` as a teaching pair. `FSN-GAIT-TERN` stays remaining `n>3→3`; `FSN-TIERCE-VERSE` stays remaining `3→0`. Cadence Dock stays remaining `2→0` (`FSN-DOCK-VERSE`). Cadence Cap stays remaining `n>2→2` (`FSN-PRIME-CAP`). Cadence Snuff stays remaining `1→0` (`FSN-SNUFF-VERSE`). Cadence Rise stays remaining `1→2` (`FSN-LEAN-RISE`). Cadence Prime stays remaining `0→1` (`FSN-PRIME-TAX`). Cadence Floor stays SDE #906.

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend **or** Sestet Mend. Do **not** clone Equal Gift as Prime Gift or Gait Gift. Do **not** clone Hymn Turn as Psalm Turn. Cadence Floor stays SDE #906. Cadence Prime stays drop 17. Cadence Rise / Snuff stay drop 18. Cadence Cap / Dock stay drop 19. Same-day SDE Wave 18 unique CORE / Wave 19 SPELL_PROPOSALS stay Wave **20** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–19, plus Wave 19 verbs in this order (from elite-evolution §6):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-TERN-OCTA` band 0 can ship among the first** once family HP survives battle start. `FSN-SESTET-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Sestet Mend / Gait Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **summon spawn onto a painted cell**, **last leftover AP spent while occupying a painted cell**, **`forcedMovedThisTurn`** / `lastForcedMoveDir` / **caster-authored** force bit (force families still wait; this drop adds **zero** new force-gated CORE). Dual Keep leftover **is** leftover. Dual Keep 2/2 is Poise **and** Dual Plate, not Sestet. Dual Keep 1/1 is Poise **and** Prime Gift / Prime Plate, not Sestet. Dual Keep leftover-sum 4 unequal is Score, not Sestet. Dual Keep leftover-sum 3 is Tally, not Sestet. Dual Keep leftover-sum 5 cannot sit (max 2/2 = sum 4). Dual Keep **cannot** sit on sum 6. Dual Keep 2/0 **opens** Gait Gift. Dual Keep 1/0 **opens** Thin Gait. Score Lend (3,1)→(4,2) **manufactures Sestet**. Sestet Sip (4,2)→(3,2) **manufactures Stave**.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Sestet Step occupancy dests (not `isSwap`). Mire Reel = twelfth attract dest flavor (toward, not onto, a world portal). Brick Tax = barrier-adjacent **walk +1 AP** (not unit bash, not Brick Hold, not Brick Brace, not Brick Step); destroy-the-barrier skip.
6. `inferSummonArchetype` gains `tridecaspan` and `sestetpost` (and still needs `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–18). Raise or gate `ENEMY_SUMMON_CAP` before Trideca Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Sestet Lend / Psalm Turn). **`FSN-SESTET-QUIET` and `FSN-SESTET-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-SESTET-STEP` / `FSN-GAIT-TERN` / `FSN-PSALM-SESTET` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Sestet Hold while leftover AP + leftover MP === 6 AND unequal. Must Sestet / Verse Sestet / Octa Oath / Tern Stride as refuse-until. Sestet Sill start-turn leftover-sum-6-unequal occupy (paint stays). Summon Mark spawn-onto occupy (consume; walk-on free; spell-from free). Sestet Post leftover-sum-6-unequal occupy. Prime Plate leftover 1/1. Capped Sting leftover-MP === max. Thin Gait leftover 1/0. Sestet Hood consume-before-damage. Psalm Turn mixed-side leftover invert (caster stays; sum invariant). Cadence Tern remaining-n>3→3. Cadence Tierce remaining-3→0. Watch Tax next-spell +1 AP on snap. Brick Tax dest occupancy skip (no barrier → skip). Odd Toll next-walk +1 AP if leftover AP odd. Strike Plate next Strike payload 0 by **id**.
9. Summoner cooldown fall-through (trideca / sestetpost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT trideca sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** ship Cadence Prime as a family CORE (drop 17 owns it). Do **not** ship Cadence Rise / Cadence Snuff as a family CORE (drop 18 owns them). Do **not** ship Cadence Cap / Cadence Dock as a family CORE (drop 19 owns them). Do **not** mint SDE Wave 18 unique CORE / Wave 19 SPELL_PROPOSALS (Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn) as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-SESTET-STEP`, `FSN-SESTET-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP + leftover MP === 6 **AND** unequal; `0 = 0` does not fire; `2 = 2` does not fire; `3 = 3` does not fire; `3 = 2` does not fire; `3 = 1` does not fire; `1 = 1` does not fire; Dual Keep cannot fake sum 6; Sestet Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-SESTET-SIP`, `FSN-SESTET-GATE` | leftover-AP + leftover-MP reads; Sestet Sting leftover-sum===6 unequal; Sip leftover-sum-6-unequal **and** leftover AP ≥ 1 ((0,6) fizzles; (4,2)→(3,2) manufactures Stave); Sestet Post leftover-sum-6-unequal occupy / walk-safe / dump-safe / 2/2-safe / leftover-sum-5-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe; Sestet Sill start-turn leftover-sum-6-unequal, paint stays; two different tiles; `summonAI === "sestetpost"` |
| `FSN-TERN-OCTA` | Tern Stride dest Chebyshev == 3 AND orthogonal; Octa Oath exact 8; Strike remains legal; blink does not pay; a legal Chebyshev-3 orthogonal floor **and** a tile at Chebyshev 8 exist |
| `FSN-MIRE-DIAG` | twelfth `applyAttract` dest (painted mire occupancy); dest is not the portal; map has painted mire in 6; Diag Bite share-diagonal occupancy; never File Bite / Rank Bite / Lava Reel / Rime Reel on the same PAIR |
| `FSN-SPAWN-PRIME` | summon-spawn-onto writer; walk-on free; spell-from free; leftover 1/1 miss; leftover 2/2 lands; leftover 1/0 lands; never Mark+Goad as PAIR (`/GOAD` is the 3-body) |
| `FSN-SLIDE-CAP` | 1-tile conveyor auto-push skip; length ≥ 2 pays; leftover-MP === max poke; leftover AP spent with max MP still hits; one clean aisle; map has a conveyor cell **or** a legal flank paint |
| `FSN-WATCH-THIN` | leftover next-spell **+1 AP** on overwatch snap; still deals; never steal leftover MP (that is Watch Drain); never steal leftover AP (that is Watch Sip); leftover-1/0 poke; leftover 1/1 excluded (Prime); leftover 0/0 excluded (Gaunt); never Tax+Gun as PAIR |
| `FSN-SESTET-CHOIR` | `lastResolvedSpellId`; Sestet Mend leftover-sum===6 unequal on **both** bodies; Verse Sestet leftover-sum-6-unequal peel (`0 = 0` does not; `2 = 2` does not; `3 = 3` does not; `3 = 2` does not; Dual Keep does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-GAIT-TERN` | leftover-AP + leftover-MP on **target** for Gait Gift (AP ≥ 2 AND MP = 0); remaining `n>3` → `3`; Dual Keep 2/0 opens Gait Gift; Dual Keep 2/2 is Poise, skip; Dual Keep 1/1 is Prime Gift, skip; never Tern+Tierce as PAIR; never Floor / Prime / Rise / Snuff / Cap / Dock |
| `FSN-PSALM-SESTET` | mixed-side leftover AP↔MP invert; caster unchanged; sum invariant; equal leftover is a no-op; never Hymn Turn / Duel Turn / Purse Turn PAIR |
| `FSN-TIERCE-VERSE` | remaining `n===3` → `0`; `lastResolvedSpellId`; leftover-sum===6 unequal peels Verse; never Tern / Cap / Dock / Rise / Prime / Floor the same turn; never Verse-Sestet+Scribe as PAIR |
| `FSN-ODD-BRICK` | leftover-AP-odd next-walk +1 AP; Brick Tax barrier-adjacent walk +1 AP; destroy-barrier skip; turret AI (`mp: 0`, no path); never Tax+Hold PAIR; never Toll+Scribe PAIR |
| `FSN-PURSE-SESTET` | mixed-side invert **then** Sestet Sip manufactures Stave **then** Stave Sting; (0,6) fizzles Sip; never Sestet-Sip+Stave-Sip PAIR; never Sestet-Sting+Stave-Sting PAIR |
| `FSN-SESTET-HOLD` | Sestet Hold until leftover AP + leftover MP === 6 AND unequal; Must Sestet leftover-sum-6-unequal **and** last-AP tool-lock; never Root; spend 1 leftover so the sum leaves 6 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must |
| `FSN-SESTET-HOLD/TRIDECA` | `summonAI === "tridecaspan"` **and** remaining cap ≥ 13 (live cap 2 → skip); orthogonal plus arm 3, every cell occupied; click = center; a diagonal walk-off around the bounding 7×7 remains |

---

## Sources (line-accurate, 2026-10-28)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 203–224, 447–452, 467–472, 1662–1707, 1832–1888
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
- Wave 19 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-27.md` (PR #1189) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-26.md` (PR #1132); leftover SDE Wave 17 unique CORE in PR #1082
- Drop 19: `docs/design/ENEMY_FORMATIONS_2026-10-27.md` (PR #1176)

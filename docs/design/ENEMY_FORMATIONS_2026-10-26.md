# Enemy synergy and formation catalog (drop 18)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-26  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–17 already taught the seven pairing words and Waves 1–16 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 17 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-25.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-25.md) (open as PR #1073) and deferred by drop 17 (PR #1075): Score Choir, Hendeca Plug, File Hexa, Lava File, Strike Dry, Shock Even, Lean Rise, Still Brace, Watch Odd, Spike Kennel, Duel Score, Snuff Verse, Score Quiet, Purse Score, Score Gate, Bounce Score, Score Hold File, Lend Hood.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956), [`ENEMY_FORMATIONS_2026-10-24.md`](./ENEMY_FORMATIONS_2026-10-24.md) (drop 16 — open as PR #1005), [`ENEMY_FORMATIONS_2026-10-25.md`](./ENEMY_FORMATIONS_2026-10-25.md) (drop 17 — open as PR #1075). Family sheets: PR #1073. Spell verbs: Wave 16 tactical ids in PR #1011 (`spell-score-mend` … `spell-court-snuff`, **except** Court Snuff) plus leftover SDE Wave 15 unique CORE (`spell-file-stride` … `spell-far-fold`, **except** Pack Diag / Far Fold / Cadence Floor). Cadence Floor stays SDE #906. Cadence Prime stays drop 17 (`FSN-PRIME-TAX`). Cadence Rise is **this** drop. Cadence Snuff is **this** drop.

**Hard rules (Wave 17 pack law — plus every older law still stands):**

- Do **not** pack `score_mender` with `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (both leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover-**both 0** vs **target**-tied ≥ 1 vs leftover **AP=0 and MP≥1** vs **this-caster** force vs **anyone’s** force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs spell-resolved vs leftover-cross vs unconditional). `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` / `FSN-HOLLOW-SWAP` / `FSN-STILL-GRACE` / `FSN-DRY-STEP` stay theirs. `FSN-SCORE-STEP` owns six-flag **sum===4 unequal** heal. Dual Keep leftover **is** leftover: 2/2 **enables Poise and is not Score**; (3,1) / (1,3) / (4,0) / (0,4) **enables Score**; (2,1) / (1,2) / (3,0) / (0,3) **enables Tally**; 0/0 **enables Gaunt / Hollow Gift and is not Score**. `leftover AP = 0` and `leftover MP = 0` is **not** a Score window. `2 = 2` is **not** a Score window. `3 = 0` is **Tally, not Score**.
- Do **not** pack `cadence_snuffer` with `cadence_riser` as PAIR / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (remaining `n===1` → `0` vs `n===1` → `2` vs `n===0` → `1` vs full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-PRIME-TAX` / `FSN-HOLLOW-SWAP` / `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR/LAG` / `FSN-IMPRINT-CHOIR` stay theirs. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`. Cadence Prime stays drop 17. Cadence Dock (`n===2` → `0`) stays Wave **18** family CORE (PR #1063) — do **not** mint `cadence_docker`.
- Do **not** pack `hendeca_prelate` with `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Hendeca counts as **11**. Every cell of the stretched plus is **occupied**. **No diagonal cells.** Skip until remaining `ENEMY_SUMMON_CAP` ≥ 11. Live cap is **2** — skip `FSN-SCORE-HOLD/HENDECA`. `FSN-TALLY-HOLD/DEC` stays the 10-cell 2×5 COURT. `FSN-POISE-HOLD/NINE` stays the solid-9 COURT.
- Do **not** pack `score_hooder` with `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` as a PAIR (sum===4 unequal any-range miss vs sum===3 miss vs tied-≥1 miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss vs leftover-AP **odd** miss vs leftover-**MP=0** miss). `FSN-TALLY-QUIET/LEND` / `FSN-POISE-QUIET/LEND` / `FSN-ODD-COURT` stay theirs. `FSN-STRIKE-DRY` owns Dry Plate. `FSN-SCORE-QUIET/LEND` owns Lend Hood.
- Do **not** pack `score_stinger` with `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` as a PAIR (leftover **AP + MP === 4 AND unequal** poke vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover **AP odd** vs leftover **AP even ≥ 2** vs leftover AP **and** MP **exactly 2** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **MP odd**). `FSN-TALLY-SIP` / `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-TIED-PORTAL` / `FSN-ODD-COURT/STING` stay theirs. `FSN-SCORE-SIP` owns leftover-sum-4-unequal poke. `FSN-SHOCK-EVEN` owns leftover-AP-even-≥2 poke. `FSN-WATCH-ODD` owns leftover-MP-odd poke.
- Do **not** pack `score_stepper` with `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire` (join leftover-**sum===4 unequal** ally vs leftover-**sum===3** vs leftover-**AP===MP≥1** vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs **through-barrier peek** vs line rescue vs cover). BRIGADE `FSN-SCORE-QUIET` is the three-body lesson. `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` / `FSN-SWAP-BRICK` stay theirs.
- Do **not** pack `score_siller` with `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` as a PAIR (start-turn occupy **and leftover AP + leftover MP === 4 AND unequal**, paint stays vs start-turn leftover-sum===3 vs start-turn leftover AP === MP ≥ 1 vs start-turn leftover-both-0 vs start-turn occupy **any leftover**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing** vs **teleport landing** vs **Strike-from**). `FSN-TALLY-GATE` / `FSN-POISE-GATE` / `FSN-GAUNT-GATE` / `FSN-SHOVE-DRIFT` / `FSN-SWAP-BRICK` stay theirs. `FSN-STRIKE-DRY` owns Strike Mark.
- Do **not** pack `score_holder` with `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `must_scorer` as PAIR / `must_tallier` as PAIR (cannot walk while leftover AP + leftover MP === 4 AND unequal vs while leftover-sum===3 vs while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until leftover **MP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs leftover-MP=0 **and** last AP vs tools-until leftover-sum===4 unequal **and** last AP vs tools-until leftover-sum===3 **and** last AP). COURT `FSN-TALLY-HOLD` stays leftover-sum===3 peel. `FSN-SCORE-HOLD` is the 3-body. **Never PAIR Score Hold + Must Score.**
- Do **not** pack `score_lender` with `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **sum === 4 AND unequal** — **exits** to sum 6 vs +1/+1 if leftover **sum === 3** — **exits** to 5 vs +1/+1 if leftover **AP === MP ≥ 1** — **keeps** the tie vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-TALLY-QUIET/LEND` / `FSN-POISE-QUIET/LEND` stay theirs. `FSN-SCORE-QUIET/LEND` is the 3-body.
- Do **not** pack `score_sipper` with `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **sum === 4 AND unequal** and leftover AP ≥ 1 vs steal leftover **AP** iff leftover **sum === 3** vs steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal). `FSN-TALLY-SIP` / `FSN-POISE-SIP` / `FSN-GAUNT-SIP` / `FSN-WATCH-SIP` stay theirs. `FSN-WATCH-ODD` owns the snap **zero leftover MP**. Score Sip on (3,1) → (2,1) **manufactures Tally**.
- Do **not** pack `score_prelate` with `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `bait_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` as a PAIR (end-turn occupy **and leftover AP + leftover MP === 4 AND unequal** detonate vs leftover-sum===3 occupy vs leftover-AP===MP≥1 occupy vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs bait vs 11-cell occupy vs 10-cell occupy vs 9-cell occupy). `FSN-TALLY-GATE` stays leftover-sum detonate. `FSN-SCORE-GATE` is the leftover-sum-4-unequal post.
- Do **not** pack `score_bouncer` with `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**sum===4 unequal** hostile vs leftover-sum===3 bounce vs leftover-tied bounce vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-TALLY-HOLD/BOUNCE` / `FSN-POISE-HOLD/BOUNCE` / `FSN-GAUNT-HOLD/BOUNCE` stay theirs. `FSN-SCORE-HOLD/BOUNCE` is leftover-sum-4-unequal Bounce Score, never a two-bounce PAIR.
- Do **not** pack `must_scorer` with `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `score_holder` as a PAIR (non-Strike illegal unless leftover **sum === 4 AND unequal and this spell spends last AP** vs leftover **sum === 3 and last AP** vs leftover **AP === MP ≥ 1 and last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until leftover-sum===4 unequal). `FSN-TALLY-HOLD` / `FSN-POISE-HOLD` / `FSN-GAUNT-HOLD` / `FSN-ODD-MUST` / `FSN-LEAN-HOLD` stay theirs.
- Do **not** pack `verse_scorer` with `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as a PAIR (last-id illegal until leftover **sum === 4 AND unequal** vs until leftover **sum === 3** vs until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock vs pets pay +1 AP to **recast last id**). `FSN-TALLY-CHOIR` / `FSN-POISE-CHOIR` / `FSN-GAUNT-CHOIR` stay theirs. `0 = 0` does **not** peel Verse Score. `2 = 2` does **not** peel Verse Score. `3 = 0` does **not** peel Verse Score.
- Do **not** pack `file_warder` with `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR / `file_biter` as PAIR (next walk dest **shares file** vs **shares rank** vs **(2,1)** vs **orthogonal-only** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal vs linear file charge vs share-**file-only** bite). `FSN-RANK-PENTA` / `FSN-KNIGHT-QUAD` / `FSN-EVEN-ORTH` / `FSN-ORTH-TRI` / `FSN-DIAG-OATH` / `FSN-INCH-OATH` stay theirs. Extra room `file_gallery` is **not** this family. `FSN-LAVA-FILE` owns File Bite. **Never PAIR File Stride + File Bite.**
- Do **not** pack `hexa_oather` with `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `six_prelate` / `penta_prelate` (next spell exact Chebyshev **6** vs exact **5** vs exact **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0 vs six-cell occupy vs five-cell occupy). `FSN-RANK-PENTA` leftover oaths stay theirs. Extra room `hexa_nave` is **not** this family.
- Do **not** pack `lava_reeler` with `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `lava_skipper` as a PAIR (pull toward **lava occupancy** vs **spike occupancy** vs **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity vs 1-tile lava skip). `FSN-SPIKE-SCREEN` / `FSN-PIT-AXIS` / `FSN-BRICK-WAKE` / `FSN-VOID-DWELL` / `FSN-CINDER-MARK` stay theirs. Extra room `lava_aisle` is **not** this family.
- Do **not** pack `file_biter` with `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `file_warder` as a PAIR (share **file only** bonus vs shares **rank or file with the caster** vs Bresenham **blocked** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs handler-on-**rank-or-file** with a **pet** vs next-walk same-file). `FSN-SPIKE-SCREEN` / `FSN-PIT-AXIS` / `FSN-LONE-AXIS` / `FSN-FOE-ESCORT` stay theirs.
- Do **not** pack `strike_marker` with `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (**Strike originating on the painted cell** consume vs **teleport landing** consume vs **force-move landing** consume vs **spell** confirm vs start-turn occupy consume vs end-turn occupy vs cell-enter vs start-turn leftover-pair vs start-turn tied-≥1 vs start-turn leftover-sum vs start-turn leftover-sum-4-unequal vs unit walk-MP wick vs first leave vs tile bomb). `FSN-SWAP-BRICK` / `FSN-SHOVE-DRIFT` / `FSN-TALLY-GATE` stay theirs. Extra room `strike_pulpit` is **not** this family. Walk-on is **safe**. Spell-from is **safe**.
- Do **not** pack `dry_plater` with `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `score_hooder` as PAIR / `tally_hooder` as PAIR / `dry_holder` as PAIR / `dry_stinger` as PAIR (next hit 0 **while leftover MP is 0** vs leftover **MP ≥ 1** vs leftover **AP ≥ 1** vs leftover AP **odd** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs leftover **sum === 4 unequal** vs leftover **sum === 3** vs leftover-MP=0 **walk lock** vs leftover-MP=0 **poke**). `FSN-ODD-COURT` / `FSN-SPENT-FULL` / `FSN-GAIT-WATCH` stay theirs. `FSN-STRIKE-DRY` is paint + leftover-MP=0 miss; `/GOAD` is the 3-body.
- Do **not** pack `shock_skipper` with `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` as a PAIR (1-tile **shock** enter-tax skip vs mire enter-tax vs rime leave-tax vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy). `FSN-MIRE-FILE` / `FSN-RIME-FILE` / `FSN-GLYPH-FULL` / `FSN-CINDER-FULL` / `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs. Extra room `shock_nave` is **not** this family.
- Do **not** pack `even_stinger` with `odd_stinger` / `full_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `score_stinger` / `tied_gaiter` / `pair_purser` as a PAIR (leftover **AP even and ≥ 2** poke vs leftover AP **odd** vs leftover AP ≥ 3 vs leftover-sum===3 vs tied-≥1 vs leftover-both-0 vs leftover-sum===4 unequal vs leftover AP **and** MP **exactly 2** vs leftover AP **exactly 2**). `FSN-ODD-COURT/STING` / `FSN-TALLY-SIP` / `FSN-TIED-PORTAL` stay theirs. Leftover AP **0 is even and excluded**.
- Do **not** pack `summon_ranker` with `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (pets pay **AP** to **walk off the summoner’s rank** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs pets pay **AP** to **recast last id** vs pets pay **AP** to start a **spell** vs pets **next hit 0** vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-SCORE-HOLD/KENNEL` is Spike Kennel, never a two-pet PAIR. `FSN-TALLY-HOLD/KENNEL` / `FSN-POISE-HOLD/KENNEL` / `FSN-GAUNT-HOLD/KENNEL` / `FSN-LEAN-HOLD/TOLL` stay theirs.
- Do **not** pack `lean_gifter` with `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `lean_stinger` as a PAIR. `FSN-SCORE-STEP` stays both-bodies leftover-sum===4 unequal. `FSN-TALLY-STEP` stays both-bodies leftover-sum===3. Lean Gift is leftover **AP = 0 and leftover MP ≥ 1**. Dual Keep **destroys** this window if it banks AP. Do **not** invent `lean_cantor`.
- Do **not** pack `cadence_riser` with `cadence_snuffer` as PAIR / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner`. `FSN-LEAN-RISE` is remaining `1→2` plus Lean Gift. `FSN-SNUFF-VERSE` is remaining `1→0` plus Verse Score. **Never PAIR Rise + Snuff.**
- Do **not** pack `still_toller` with `cast_toller` / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` / `summon_toller` as PAIR / `walk_toller` as PAIR (next-**spell** +1 AP if leftover **MP = 0** vs Struck-last-turn next-**spell** +1 vs Struck-last-turn next-**walk** +1 vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1 vs pet-walk AP vs caster-walk tax). `FSN-PRIME-TAX` / `FSN-STRIKE-TAX` / `FSN-DEBT-ORBIT` / `FSN-SPENT-CRACK` stay theirs. CADRE `FSN-STILL-BRACE` is the three-body lesson (Still Toll + Brick Brace + Castellan), never Still-Toll+Scribe PAIR.
- Do **not** pack `brick_bracer` with `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `screen_biter` as PAIR (next hit 0 if a **barrier is adjacent** vs step **through** an adjacent barrier vs push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras vs Bresenham-blocked bite). `FSN-SWAP-BRICK` / `FSN-POISE-HOLD/NUDGE` / `FSN-DEBT-ORBIT` / `FSN-GAIT-WATCH/GUN` / `FSN-BRICK-WAKE` / `FSN-SPIKE-SCREEN` stay theirs. `FSN-STILL-BRACE` owns the camp, never Brace+Step PAIR. Brick Brace **does not move** the barrier.
- Do **not** pack `watch_rooter` with `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `glass_sniper` as PAIR (snap **zeros leftover MP** on the walker vs snap **banks** leftover AP vs snap **steals** leftover AP vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-WATCH-BANK` / `FSN-WATCH-SIP` / `FSN-GAIT-WATCH` / `FSN-OWN-WATCH` / `FSN-OFF-FEE` stay theirs. `FSN-WATCH-ODD/GUN` is Watch Odd Hunt, never Root+Gun PAIR.
- Do **not** pack `odd_gaiter` with `lone_gaiter` / `pair_gaiter` / `odd_stinger` / `tied_gaiter` / `full_gaiter` / `dry_stinger` as a PAIR (leftover **MP odd** poke vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **AP odd** vs leftover AP **and** MP **exactly 2** vs leftover MP ≥ 3 +RES vs leftover MP **= 0**). `FSN-LONE-HAZARD` / `FSN-PAIR-GIFT` / `FSN-ODD-COURT/STING` / `FSN-TIED-PORTAL` stay theirs.
- Do **not** pack `spike_cutter` with `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `spike_reeler` as PAIR / `spike_skipper` as PAIR / `null_censor` as PAIR (bonus vs **spike occupancy** Chebyshev ≤ 2 vs **painted hazard** vs **world portal** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs **pulls** toward spikes vs ignores spike tax vs Weaken/Expose). `FSN-LONE-HAZARD` / `FSN-TIED-PORTAL` / `FSN-SPIKE-SCREEN` stay theirs. Twin Gate pads do **not** count.
- Do **not** pack `summon_plater` with `summon_ranker` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `split_plater` / `still_plater` / `kennel_siller` as PAIR (pets treat the **next hit as 0** vs walk-off-rank AP tax vs pets ignore force vs brood overlay vs split absorb vs leftover-MP=0 plate vs pets cannot leave). `FSN-SCORE-HOLD/KENNEL` is Spike Kennel, never Rank+Plate PAIR.
- Do **not** pack `duel_turner` with `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR (invert leftover AP↔MP on **two hostiles** independently vs **one** hostile invert vs two-body leftover **cross** vs **tile** swap vs leftover **bank**). CADRE `FSN-PURSE-TALLY` stays the 3-body one-hostile invert. `FSN-CROSS-POISE` stays the 3-body cross. `FSN-DUEL-SCORE` is the 3-body two-hostile invert. Hymn Turn (two **allies**) stays Wave **18**.
- Drop 4–17 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two four-flag **sum===3** heals; no two four-flag **sum===4 unequal** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals; no two leftover-sum heals; no two leftover-sum-4-unequal heals; no two remaining-1 rewrites as PAIR).

Wave 18 families do **not** exist yet. Same-day 2026-10-25 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-25.md`, open as PR #1063: Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn) and SDE Wave 16 unique CORE (`spell-ring-stride` … `spell-leap-fold`, PR #1017, **except** Pack Orth / Leap Fold unless a later boss sheet claims them) stay Wave **18** family CORE. Do **not** mint `FSN-*` ids that require those Wave 18 families in this drop. Cadence Floor is **already owned** by SDE #906. Cadence Prime is **already owned** by drop 17. Cadence Rise is **this** drop. Cadence Snuff is **this** drop. Cadence Cap / Cadence Dock stay Wave 18.

Court Snuff / Pack Diag / Far Fold / Pack Orth / Leap Fold / Court Dock stay **boss / closed-class / later family**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend (Hollow Gift is **target-only** both-pools; Score Mend is **both bodies leftover sum === 4 AND unequal**). Do **not** clone Equal Gift as Lean Gift (Equal Gift is **target-only** tied ≥ 1; Lean Gift is leftover **AP=0 and MP≥1**). Do **not** clone Purse Turn as Duel Turn (Purse Turn is **one** hostile invert; Duel Turn is **two** hostiles). Do **not** clone Watch Root as Watch Bank or Watch Sip (Root **zeros leftover MP**; Bank **grants a leftover-AP bank**; Sip **steals leftover AP**). Do **not** clone File Bite as Axis Bite or Screen Bite (File Bite is **file-only**; Axis Bite is rank **or** file; Screen Bite is Bresenham **blocked**).

**Do not spawn Score Mend / Score Sting / Score Step / Score Sill / Score Hold / Score Lend / Score Sip / Score Post / Score Bounce / Must Score / Verse Score / Score Hood / Dry Plate / Even Sting / Odd Gait / Lean Gift / Still Toll sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Sum is integer leftover AP + leftover MP. Equality is integer `===`. Inequality is integer `!==`. Missing field → Score Mend / Score Sting / Lean Gift / Duel Turn pay **0** extra or skip (fail closed). Until those writers land, show `FSN-TALLY-STEP` / `FSN-TALLY-SIP` / `FSN-POISE-STEP` / `FSN-PAIR-DRY` instead of the matching Wave 17 id.

**Do not spawn Verse Score sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Score fizzles (fail closed). Forced-move does **not** peel Verse Score. `0 = 0` does **not** lift. `2 = 2` does **not** lift. `3 = 0` does **not** lift. Until that writer lands, show `FSN-TALLY-CHOIR` instead of `FSN-SCORE-CHOIR` / `FSN-SNUFF-VERSE`.

**Do not spawn Strike Mark sheets until a battle-walk writer snapshots Strike originating on the painted cell.** Walk-on does not arm Strike Mark. Spell-from does not arm Strike Mark. Teleport / Swap / Score Step / Brick Step do not pay. Until that writer lands, show `FSN-SWAP-BRICK` instead of `FSN-STRIKE-DRY`.

**Do not spawn Hendeca Plug until `inferSummonArchetype` keys `summonAI === "hendecaspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 11.** Live cap is 2. Name heuristics stay a bug. Hendeca fills the stationary-post **and** the multi-cell-system cap (11). Every cell of the stretched plus stays occupied. **No diagonal cells** — that is the counter vs Nine Span’s square. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost/ninespan/tallypost/decspan/scorepost onto that body.

**Do not spawn Score Post sheets until `inferSummonArchetype` keys `summonAI === "scorepost"` and remaining cap ≥ 1.** End-turn occupy with leftover sum ≠ 4 **or** a tie is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window). Dual Keep leftover-sum 3 is **safe** (Tally Post’s window). Only leftover-sum===4 unequal end-turn occupy detonates.

**Score Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Lava Reel is the **tenth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike, then **lava occupancy**). Dest is **toward**, not onto, a world portal. Brick Brace **does not move** the barrier — destroy it and the hit lands; charge **stays**.

Wave 17 adds **zero** facing CORE cards **and zero** new force-gated CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop. `forcedMovedThisTurn` remains an implementation prerequisite for Waves 10–16 force sheets, not this drop.

---

## Grounding (live, 2026-10-26)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–17. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Score Step is occupancy dest, **not** `isSwap`. Lava Reel is the tenth **cast** caller of attract. Brick Brace is a barrier-adjacent miss, not `applyPushback` and not Brick Step / Brick Nudge. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 17 CORE rows stay `mpCost: 0`. Score Sip / Score Lend / Duel Turn / Watch Root rewrite **current leftover AP/MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` / Strike-from-cell | **Absent** — Score / Lean Gift / Duel Turn / Verse Score / Strike Mark / Dry Plate / Even Sting / Odd Gait / Still Toll / Watch Root fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / ninespan / poisepost / tallypost / decspan / **scorepost** / **hendecaspan** bodies **replace** the random overlay. Cap one of those engines. Hendeca Span **is** the 11-cell stretched-plus post and needs remaining cap ≥ 11.
3. Any `healAmount` steals healer. **Score Mend / Lean Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Primer, Toller, Watcher, Cutter, Turner, Verser, Riser, Snuffer, Bracer, or Bouncer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Tally Lend / Score Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Tally Mend / Score Mend / Lean Gift / Hollow Gift / Equal Gift / Drift Gift / Shove Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 17 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Score Sip / Watch Root / Duel Turn / Score Lend rewrite current leftover AP/MP.
6. `inferSummonArchetype` must key `summonAI === "hendecaspan"` **and** `"scorepost"` **before** any Hendeca / Score-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Brace that **camps an already planted barrier** (it does not mint a new one from empty floor, and destroying the barrier is a complete answer). Score Hold / Must Score / Verse Score / Hexa Oath / File Stride are **not** `instantKill`.
8. Score-step dest / lava-reel dest / score-post plant / hendeca plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Score Step into a wall is a fizzle (no crush). Lava Reel dest must leave a walk-off that is **not** the lava cell **and not** a world portal. Hendeca plant must leave a **diagonal** walk-off (the designed counter vs Nine Span’s square) and `findPath` after the hypothetical occupy must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip / Tally Sip / Score Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Score Sip **or** one Tally Sip **or** one Watch Sip source per pack, not both stacking past that cap. Watch Root **zeros leftover MP**; it is not a steal and does not stack with Dual Keep (Dual Keep leftover that survives turn start **is** leftover — Root then dumps the MP half). Score Hold is a **walk lock with a leftover-sum-4-unequal key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise + Tally Hold + Must Tally + Score Hold + Must Score on the same AP bar.
10. Walk-spend: Score Step / Lava Reel / Score Post plant / Hendeca plant / Brick Brace **do not** increment `walkMpSpentThisTurn`. Lean Gift / Score Mend gate leftover pools, not walk-spend.
11. Last-id: Verse Score **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Score. Dual Keep leftover **is** leftover; `0 = 0` does **not** lift; `2 = 2` does **not** lift; `3 = 0` does **not** lift.
12. Strike-from: Strike Mark **fail closed** until Strike originating on the painted cell exists. Walk last turn does **not** arm it. Spell last turn does **not** arm it. Teleport / Swap / Score Step / Brick Step do not pay.
13. Remaining-1 rewrite: Cadence Rise writes `1→2`. Cadence Snuff writes `1→0`. **Never both on the same AP bar.** Cadence Floor (`n>1→1`) stays SDE #906. Cadence Prime (`0→1`) stays drop 17. Cadence Cap (`n>2→2`) and Cadence Dock (`2→0`) stay Wave 18.

### Relative difficulty (same grades as drops 1–17)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…17 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a leftover-sum tell / a leftover-sum-4-unequal tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss / a leftover-AP-odd miss / a leftover-MP-odd miss / a leftover-AP-even-≥2 miss / a remaining-0 tell / a remaining-1 tell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / stepper / warder / bracer): pack median + one step.
- Backliner (score-mend / lean-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / primer / snuffer / riser / watch / turn): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer, optic): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 18)

Drop 1–17 overlays still apply. These are **additional jobs** for Wave 17 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-SCORE-MEND` | `queen` **with** heal | proposed `score_mender` | `spell-score-mend`, `starter-shield` | healer; skip if either leftover sum ≠ 4 **or** either body is tied or missing HP < 8; Dual Keep 2/2 is **Poise, skip**; Dual Keep leftover-sum 3 is **Tally, skip**; extra door `score_cantor` is **not** this family |
| `ROLE-HENDECA` | `rook` **without** heal | proposed `hendeca_prelate` | `physical_attack`, `spell-hendeca-span` | `isSummoner` for hendeca only; post `summonAI: "hendecaspan"`, stretched plus 7-spine × 5-crossbar, empty kit, remaining cap ≥ 11; skip if any of eleven cells blocked; every cell occupied; **no diagonal cells** |
| `ROLE-DUEL-TURN` | `queen` **without** heal | proposed `duel_turner` | `starter-frost`, `spell-duel-turn` | controller; skip if pack size < 2 **or** both leftover pairs already equal; invert two hostiles independently; **not** Purse Turn / Bar Cross / Dual Keep / Hymn Turn |
| `ROLE-SCORE-HOOD` | `knight` **without** heal | proposed `score_hooder` | `starter-shield`, `spell-score-hood` | guardian; skip if leftover sum ≠ 4 or tied; any-range miss while sum===4 unequal; consume on miss |
| `ROLE-SCORE-STING` | `pawn` **without** heal | proposed `score_stinger` | `physical_attack`, `spell-score-sting` | flanker; skip if leftover sum ≠ 4 or tied unless 10 still kills; Dual Keep **opens** the 8 only on (4,0)/(0,4)/(3,1)/(1,3) |
| `ROLE-SCORE-STEP` | `queen` **without** heal | proposed `score_stepper` | `starter-frost`, `spell-score-step` | protector; skip if ally leftover sum ≠ 4 or tied or no free adj; relocate, **not** `isSwap` |
| `ROLE-SCORE-SILL` | `rook` **without** heal | proposed `score_siller` | `starter-frost`, `spell-score-sill` | setter; skip if occupant leftover sum already ≠ 4 or tied; occupant leftover-sum===4 unequal at **start of their turn** takes 8; paint stays |
| `ROLE-SCORE-HOLD` | `knight` **without** heal | proposed `score_holder` | `physical_attack`, `spell-score-hold` | controller; skip if leftover sum ≠ 4 or tied; cannot walk while leftover-sum===4 unequal; spells stay legal; **never PAIR with Must Score** |
| `ROLE-SCORE-LEND` | `bishop` **without** heal | proposed `score_lender` | `starter-frost`, `spell-score-lend` | buffer; skip if ally leftover sum ≠ 4 or tied; +1 current AP **and** +1 current MP (**exits** to sum 6; inequality preserved) |
| `ROLE-SCORE-SIP` | `pawn` **without** heal | proposed `score_sipper` | `physical_attack`, `spell-score-sip` | flanker; skip if leftover sum ≠ 4 or tied **or** leftover AP = 0; steal 1 leftover AP; (0,4) fizzles; (3,1)→(2,1) **manufactures Tally** |
| `ROLE-SCORE-POST` | `pawn` **without** heal | proposed `score_prelate` | `physical_attack`, `spell-score-post` | `isSummoner` for scorepost only; post `summonAI: "scorepost"`, remaining cap ≥ 1; end-turn leftover-sum===4 unequal occupy detonates; walk-on / dump-a-pool / 2/2-safe / leftover-sum-3-safe |
| `ROLE-SCORE-BOUNCE` | `queen` **without** heal | proposed `score_bouncer` | `starter-frost`, `spell-score-bounce` | artillery; skip bounce without a second leftover-sum===4 unequal hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-SCORE` | `knight` **without** heal | proposed `must_scorer` | `physical_attack`, `spell-must-score` | controller; skip if leftover sum ≠ 4 or tied; non-Strike illegal unless leftover-sum===4 unequal **and** last AP; Strike stays legal; **never PAIR with Score Hold** |
| `ROLE-VERSE-SCORE` | `bishop` **without** heal | proposed `verse_scorer` | `starter-frost`, `spell-verse-score` | controller; skip if no `lastResolvedSpellId`; leftover sum === 4 AND unequal peels; `0 = 0` does **not**; `2 = 2` does **not**; `3 = 0` does **not**; shove does **not** |
| `ROLE-FILE-STRIDE` | `knight` **without** heal | proposed `file_warder` | `physical_attack`, `spell-file-stride` | controller; skip if player MP = 0 or no legal same-file floor; next walk dest shares **file** (`dest.x == x_at_arm`); extra room `file_gallery` is **not** this family |
| `ROLE-HEXA-OATH` | `bishop` **without** heal | proposed `hexa_oather` | `starter-frost`, `spell-hexa-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 6; Strike stays legal; extra room `hexa_nave` is **not** this family |
| `ROLE-LAVA-REEL` | `bishop` **without** heal | proposed `lava_reeler` | `starter-frost`, `spell-lava-reel` | caster; skip if no lava occupancy in 6; dest is **toward**, not onto; tenth `applyAttract` flavor; extra room `lava_aisle` is **not** this family |
| `ROLE-FILE-BITE` | `knight` **without** heal | proposed `file_biter` | `physical_attack`, `spell-file-bite` | flanker; skip rider if they do not share **file only** unless 10 still kills; 10 + 10 if `target.x == caster.x` and `target.y != caster.y`; rank-only → 10 only |
| `ROLE-STRIKE-MARK` | `bishop` **without** heal | proposed `strike_marker` | `starter-frost`, `spell-strike-mark` | setter; skip if no Strike tool in the pack **or** player kit; 0 on cast; Strike-from landing detonates and consumes; walk-on is **free**; spell-from is **free**; extra room `strike_pulpit` is **not** this family |
| `ROLE-DRY-PLATE` | `rook` **without** heal | proposed `dry_plater` | `starter-shield`, `spell-dry-plate` | guardian; skip if leftover MP already ≥ 1; leftover MP 0 miss; leftover MP ≥ 1 at impact **lands** and charge **stays** |
| `ROLE-SHOCK-SKIP` | `knight` **without** heal | proposed `shock_skipper` | `physical_attack`, `spell-shock-skip` | flanker; skip if the next walk is not a 1-step across shock; mire/rime/lava/spike/glyph still tick; length ≥ 2 pays; extra room `shock_nave` is **not** this family |
| `ROLE-EVEN-STING` | `pawn` **without** heal | proposed `even_stinger` | `physical_attack`, `spell-even-sting` | charger; skip rider if leftover AP is odd **or** leftover AP = 0 unless 10 still kills; leftover AP 0 is even **and excluded** |
| `ROLE-SUMMON-RANK` | `king` **without** heal | proposed `summon_ranker` | `starter-frost`, `spell-summon-rank` | controller; skip if no allied summon; pets pay +1 AP to **walk off the summoner’s rank**; on-rank walks are free; drop if `summonAI` empty |
| `ROLE-LEAN-GIFT` | `queen` **with** heal | proposed `lean_gifter` | `spell-lean-gift`, `starter-shield` | healer; skip if leftover AP ≠ 0 **or** leftover MP = 0 or missing HP < 10; Dual Keep AP bank **destroys** the window; **not** Score / Tally / Poise / Hollow |
| `ROLE-STILL-TOLL` | `bishop` **without** heal | proposed `still_toller` | `starter-frost`, `spell-still-toll` | controller; skip if leftover MP ≥ 1; next **spell** +1 AP if leftover **MP = 0**; Strike still costs 2 |
| `ROLE-BRICK-BRACE` | `knight` **without** heal | proposed `brick_bracer` | `physical_attack`, `spell-brick-brace` | protector; skip if no barrier is adjacent; next hit 0 while a barrier is adjacent; destroy the barrier and the hit lands; charge **stays**; never Step / Nudge |
| `ROLE-WATCH-ROOT` | `bishop` **without** heal | proposed `watch_rooter` | `starter-frost`, `spell-watch-root` | artillery; skip if Dual Keep already dumped their MP **or** no overwatch is armed; snap still deals; **walker** leftover MP **→ 0**; **not** Watch Bank / Watch Sip |
| `ROLE-ODD-GAIT` | `pawn` **without** heal | proposed `odd_gaiter` | `physical_attack`, `spell-odd-gait` | flanker; skip if leftover MP is even unless 10 still kills; leftover MP 0 is even |
| `ROLE-SPIKE-CUT` | `pawn` **without** heal | proposed `spike_cutter` | `physical_attack`, `spell-spike-cut` | flanker; skip rider if target is Chebyshev > 2 from every spike occupancy cell; Twin Gate pads do **not** count |
| `ROLE-SUMMON-PLATE` | `king` **without** heal | proposed `summon_plater` | `starter-frost`, `spell-summon-plate` | protector; skip if no allied summon; pets treat the **next hit as 0**; summoner’s own hit is **not** covered; drop if `summonAI` empty |
| `ROLE-CADENCE-RISE` | `bishop` **without** heal | proposed `cadence_riser` | `starter-frost`, `spell-cadence-rise` | controller; skip if every remaining is already ≠ 1; remaining `n===1` → `2`; zeros stay 0; `n>1` unchanged; **never PAIR with Snuff** |
| `ROLE-CADENCE-SNUFF` | `bishop` **without** heal | proposed `cadence_snuffer` | `starter-frost`, `spell-cadence-snuff` | controller; skip if every remaining is already ≠ 1; remaining `n===1` → `0`; zeros stay 0; `n>1` unchanged; extra door `snuff_precentor` is **not** this family; **never PAIR with Rise** |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) / `ROLE-MIST` (`mist_walker`) / `ROLE-OPTIC` (`dim_optic`) / `ROLE-PLATE` (`plate_warden`) / `ROLE-TALLY-STING` (`tally_stinger`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Primer, Riser, Snuffer, Score-Mend, Lean-Gift, Hendeca, or Score-Post.

### Fair-fight rules (every sheet)

Same as drops 1–17, plus Wave 17:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier. Hendeca sheets also need **≥ 1 diagonal** walk-off around the plus.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Score Post never detonates on leftover sum ≠ 4 **or** a tie.
- Swap / pull / push / score-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Tally Sip / Score Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack. Watch Root is a leftover-MP **dump**, not a steal.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Score Bounce / Tally Bounce / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Score Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine **or** tallypost **or** dec **or** scorepost **or** hendeca — never two engines). Hendeca is illegal until remaining cap ≥ 11.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Brace **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Never seal the last aisle with a new barrier.
- Dual Keep **opens** Poise on 2/2 or 1/1, **opens** Tally on (2,1)/(1,2)/(3,0)/(0,3), **opens** Score on (4,0)/(0,4)/(3,1)/(1,3), and **closes** Gaunt / Hollow Gift / Lean Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold a leftover **sum of 3** for Tally. Hold a leftover **sum of 4 without tying** for Score. Hold leftover **AP = 0 and leftover MP ≥ 1** for Lean Gift (Dual Keep AP bank **destroys** that window).

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-SCORE-STEP` | PAIR | leftover-sum===4 unequal healer + leftover-sum===4 unequal joiner | this drop |
| `FSN-SCORE-SIP` | PAIR | leftover-sum===4 unequal poke + leftover-sum leftover-AP steal | this drop |
| `FSN-FILE-HEXA` | PAIR | next walk same-file + next-spell exact 6 | this drop |
| `FSN-LAVA-FILE` | PAIR | pull toward lava + share-file-only bite | this drop |
| `FSN-SCORE-GATE` | CELL | leftover-sum===4 unequal post + start-turn leftover-sum===4 unequal sill | this drop |
| `FSN-STRIKE-DRY` | CELL | Strike-from paint + leftover-MP=0 miss | this drop |
| `FSN-SHOCK-EVEN` | CELL | 1-tile shock skip + leftover-AP even ≥ 2 poke | this drop |
| `FSN-WATCH-ODD` | CELL | overwatch snap zeros leftover MP + leftover-MP-odd poke | this drop |
| `FSN-SCORE-CHOIR` | BRIGADE | leftover-sum===4 unequal heal + last-id until leftover-sum===4 unequal + ignite | this drop |
| `FSN-LEAN-RISE` | BRIGADE | leftover AP=0 and MP≥1 heal + remaining 1→2 + font | this drop |
| `FSN-SCORE-QUIET` | BRIGADE | score step + score mend + cover | this drop |
| `FSN-DUEL-SCORE` | BRIGADE | two-hostile leftover invert + leftover-sum===4 unequal heal + leftover-sum===4 unequal sting | this drop |
| `FSN-SNUFF-VERSE` | CADRE | remaining 1→0 + last-id until leftover-sum===4 unequal + glyph tax | this drop |
| `FSN-STILL-BRACE` | CADRE | leftover-MP=0 spell tax + barrier-adjacent miss + turret | this drop |
| `FSN-PURSE-SCORE` | CADRE | two-hostile leftover invert + leftover-sum===4 unequal sip manufactures Tally + leftover-sum===3 sting | this drop |
| `FSN-SCORE-HOLD` | COURT | walk-until leftover-sum===4 unequal + tools-until leftover-sum===4 unequal **and** last AP + warden | this drop |

Named packs as variants: `FSN-SCORE-GATE/STING` (Score Gate full), `FSN-LAVA-FILE/GLYPH` (Lava File full), `FSN-FILE-HEXA/GUN` (File Hexa full), `FSN-STRIKE-DRY/GOAD` (Strike Dry full — never Mark+Goad PAIR), `FSN-SHOCK-EVEN/TIDE` (Shock Even full), `FSN-WATCH-ODD/GUN` (Watch Odd Hunt full — never Root+Gun PAIR), `FSN-SCORE-QUIET/LEND` (Lend Hood escort), `FSN-SCORE-HOLD/HENDECA` (Hendeca Plug — skip until remaining cap ≥ 11; live cap is 2), `FSN-SCORE-HOLD/BOUNCE` (Bounce Score leftover-sum===4 unequal), `FSN-SCORE-HOLD/KENNEL` (Spike Kennel — never Rank+Plate PAIR).

---

## Formations

### FSN-SCORE-STEP

FORMATION_ID: `FSN-SCORE-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-SCORE-MEND` — `queen` **with** heal / proposed `score_mender` — pack median — back
- `ROLE-SCORE-STEP` — `queen` **without** heal / proposed `score_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Score Mend is a heal kit; kit band 0 has no heal). Show `FSN-TALLY-STEP` instead (four leftover-sum-3 tell without the leftover-sum-4-unequal 8).
- Mender kit: Score Mend + Shield. **No** Inferno, no Enrage, no Tally / Poise / Gaunt / Hollow / Equal / Lean / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `score_cantor` is **not** this family.
- Stepper kit: Score Step + Frost. **No** Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Brick Step / Cover on PAIR (those are `FSN-SCORE-QUIET` / `FSN-SWAP-BRICK`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-TALLY-STEP` **or** `FSN-POISE-STEP` (player has seen leftover **AP + MP === 3** heal **or** leftover **AP === MP ≥ 1** heal; this sheet cashes leftover **AP + MP === 4 AND unequal** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 0` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Score Mend (8 HP) pays only if **caster and target** leftover AP + leftover MP **=== 4 AND leftover AP ≠ leftover MP** after the 3 AP is paid. Legal pairs (4,0) (0,4) (3,1) (1,3). Dual Keep 2/2 is Poise — Shield queen. Dual Keep leftover-sum 3 is Tally — Shield queen. Dual Keep 0/0 is Gaunt — Shield queen.
- Score Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover sum === 4 **and** unequal. It is not Tally Step, not Poise Step, and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover sum === 4 and unequal; if the Mender is still 2/2 or leftover-sum 3, Stepper Frosts.
- Mender Score-Mends only if both leftover sums === 4 **and** both unequal **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Tally Mend or Poise Mend.

SYNERGY:

- Leftover-sum===4 unequal healer + leftover-sum===4 unequal joiner. Wave 16 Tally Step standing on the **next leftover-sum** (4, always unequal). Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP so the sum leaves 4 **or** Dual Keep 2/2 **or** dump to leftover-sum 3 — is a complete answer.

PLAYER_THREAT:

- Slow refill if you Dual Keep (3,1) or (0,4) on **both** bodies. Spike is low. Misplay is Rooting neither and holding leftover-sum 4 unequal into an 8 that just landed.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to leave sum 4. Dual Keep 2/2 (Poise window, not this one). Dump to leftover-sum 3 (Tally window, not this one). Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a leftover-sum-4-unequal ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced Dual Keep + leftover-sum-4-unequal heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 4 or either body is tied.
- Stepper: protector; skip if ally leftover sum ≠ 4 or tied or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-SCORE-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-SCORE-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-SCORE-SIP

FORMATION_ID: `FSN-SCORE-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SCORE-STING` — `pawn` **without** heal / proposed `score_stinger` — pack median or −1 — starts wide
- `ROLE-SCORE-SIP` — `pawn` **without** heal / proposed `score_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-TALLY-SIP` (leftover **AP + MP === 3** poke + leftover-sum leftover-AP steal) and `FSN-POISE-SIP` (leftover **AP === MP ≥ 1** poke + tied leftover-AP steal). Pressure is the **leftover-sum===4 unequal** window. Dual Keep **opens** both riders on (4,0)/(3,1)/(1,3); (0,4) opens Sting and **fizzles** Sip.
- Band 0: Stinger Strike only; Sipper Strike only (Score Sting / Score Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-TALLY-SIP`.
- Elite: Stinger only. Sipper never gets Tally Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-TALLY-SIP` **or** `FSN-SCORE-STEP` (player has seen leftover-sum as a resource **or** the leftover-sum-4-unequal heal).
- Full Sting / Lone Gait / Tied Gait / Odd Sting / Even Sting / Ready / Pair Gait stay off PAIR (PAIR bans). Score Hold stays off (that is `FSN-SCORE-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Score Sting: 10, +8 iff **target** leftover AP + leftover MP === 4 **AND** leftover AP ≠ leftover MP. Dual Keep leftover **opens** the 8 on leftover-sum 4 unequal. `2 = 2` is Poise Sting’s window, not this one. `3 = 0` is Tally Sting’s window, not this one. `0 = 0` is Gaunt Sting’s window, not this one.
- Score Sip: steal 1 leftover AP iff leftover sum === 4 AND unequal **and leftover AP ≥ 1**. (4,0) → (3,0) **manufactures Tally**. (3,1) → (2,1) **manufactures Tally**. (1,3) → (0,3) **manufactures Tally**. (0,4) fizzles. Inverse of Score Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover sum === 4 unequal and leftover AP ≥ 1; else Strikes.
- Stinger lurks at 3 and commits when leftover sum === 4 unequal **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Leftover-sum-4-unequal poke + leftover-sum leftover-AP steal. Wave 16 Tally Sip standing on the **next leftover-sum** (4, always unequal). Combination, not a new sprite. Score Sip **manufactures Tally** — that is the teaching tell for `FSN-PURSE-SCORE`.

PLAYER_THREAT:

- Getting leftover-sum-4-unequal Stung, then Sipped off (3,1) into a Tally window you did not ask for. Spike is one 18. Recoverable: sit (0,4), sit 2/2, dump a pool.

COUNTERPLAY:

- Hold leftover MP only (0,4) — Sip fizzles, Sting still fires so **dump MP too**. Dual Keep 2/2 (Poise, not this). Spend 1 leftover AP off (3,1). Kill the Stinger (glass). The Sipper without leftover-sum-4-unequal is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit.
- No Thorned Ground on the only path to the Sipper.

AI_REQUIREMENTS:

- Stinger: flanker; skip if leftover sum ≠ 4 or tied unless 10 still kills.
- Sipper: flanker; skip leftover AP = 0.
- Soph 1–2.

VARIANTS:

- `FSN-SCORE-SIP/E-STING` — elite Stinger, still no Watch Sip on PAIR.
- `FSN-SCORE-GATE/STING` is the CELL with Post — do not merge.

STATUS: PROPOSED

---

### FSN-FILE-HEXA

FORMATION_ID: `FSN-FILE-HEXA`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-FILE-STRIDE` — `knight` **without** heal / proposed `file_warder` — pack median + 1 — owns one open file
- `ROLE-HEXA-OATH` — `bishop` **without** heal / proposed `hexa_oather` — pack median — next-spell exact 6

VARIANT_RULES:

- Distinct from `FSN-RANK-PENTA` (next walk **same rank** + next-spell exact **5**) and `FSN-KNIGHT-QUAD` (next walk **(2,1)** + next-spell exact **4**). This sheet is **same-file walk** plus **exact Chebyshev 6**. Strike stays legal on both bodies.
- Band 0: both Frost / Strike only; the AI contract still refuses off-file walks and off-6 spells even before the clone ids exist.
- Band 1: Warder may hold Slow. Oather may hold Slow. Never Inferno. Never Rank Stride / Penta Oath / File Bite / Rank Lancer on PAIR (PAIR bans). Extra rooms `file_gallery` / `hexa_nave` are **not** these families.
- Elite: Warder only. Oather stays junior so two geometry elites cannot pin.
- Unlock after `FSN-RANK-PENTA` **or** `FSN-ORTH-TRI` (player has seen a next-walk geometry **or** an exact-Chebyshev oath).
- If the map has no 6-tile open file, **reroll this id**.
- `proposed:spell-file-lance` stays off PAIR (that is Rank Lancer COURT). **Never PAIR File Stride + File Bite** — File Bite lives on `FSN-LAVA-FILE`.

SPELL_POOL_INTERACTIONS:

- File Stride: next walk dest must share file (`dest.x == x_at_arm`). Length is free. Rank-advance confirm-fails (MP not spent). Blink / Swap / Score Step still legal.
- Hexa Oath: next non-Strike confirms only at Chebyshev exactly 6. Strike stays legal at any range. Walk to 5 after arm → fizzle (AP not spent for the fizzled spell).
- No Root (that would hide the walk-geometry lesson).

TACTICAL_PLAN:

- Warder arms File Stride then walks same-file. Oather arms Hexa Oath then Frosts only if the player sits at 6; else holds.
- Neither body Roots. Neither body also Strides the rank.

SYNERGY:

- Same-file walk + exact-6 spell. Wave 16 Rank Penta standing on a **different** walk geometry and a **longer** oath. Combination, not a new sprite. Step to another file **or** sit at 5 is a complete answer.

PLAYER_THREAT:

- Readable geometry. Misplay is sharing the file “for one Frost” then sitting at 6. Recoverable: step off-file, walk to 5, Strike.

COUNTERPLAY:

- Never share a file. Sit at 5 or 7. Occupy the only same-file approach. Blink. Kill the Oather (hp ~0.75). If only the Warder lives, this is a same-file walk tax without a gun.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with **one 6-tile file plus a gallery**. Reject a single-tile tunnel (file + forced melee is a lock).
- No Barrier already occupying the file at spawn (player Barrier during the fight is the intended cut).

AI_REQUIREMENTS:

- Warder: controller; skip if no legal same-file floor; never also Rank Stride / Orth / Diag / File Bite.
- Oather: controller; skip if they cannot reach 6; Strike stays legal.
- Soph 1–2.

VARIANTS:

- `FSN-FILE-HEXA/GUN` — BRIGADE **File Hexa full**: add `ROLE-SNIPER` (`glass_sniper`). Snipe from 6. Still one Slow source. Unlock after this PAIR. Sniper minRange 3; never Mark on the teaching PAIR.
- `FSN-FILE-HEXA/E-FILE` — elite Warder, still no Lancer / File Bite on PAIR.
- `FSN-RANK-PENTA` remains the same-rank PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-LAVA-FILE

FORMATION_ID: `FSN-LAVA-FILE`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-LAVA-REEL` — `bishop` **without** heal / proposed `lava_reeler` — pack median — pull toward lava occupancy
- `ROLE-FILE-BITE` — `knight` **without** heal / proposed `file_biter` — pack median — share-file-only poke

VARIANT_RULES:

- Distinct from `FSN-SPIKE-SCREEN` (pull toward **spike occupancy** + Bresenham-blocked bite) and `FSN-PIT-AXIS` (pull toward **pit** + caster-axis bite). This sheet is **lava occupancy** attract plus **file-only** poke. Lava is map-modifier occupancy, **not** painted pits, **not** spikes, and **not** `map.portals`. Twin Gate pads do **not** count.
- Band 0: both Frost / Strike. Band 1: Reeler Slow. Biter Mark. Never Inferno. Never Spike Reel / Axis Bite / Screen Bite / File Stride on PAIR (PAIR bans). Extra room `lava_aisle` is **not** this family.
- Elite: Biter only. Reeler stays junior so two displacement elites cannot pin.
- Unlock after `FSN-SPIKE-SCREEN` **or** `FSN-BRICK-WAKE` (player has seen an attract dest **or** a cover poke).
- If the map has no lava occupancy in Chebyshev 6 of a legal floor, **reroll this id**.
- Dest must leave a walk-off that is **not** the lava cell **and not** a world portal. Do not ship until the tenth `applyAttract` dest exists.
- **Never PAIR File Bite + File Stride** — File Stride lives on `FSN-FILE-HEXA`.

SPELL_POOL_INTERACTIONS:

- Lava Reel: linear LoS, 1-step toward nearest lava occupancy. Adjacent = immune (same as Hook). Empty board fizzles (AP spent). Dest is **toward**, not onto.
- File Bite: 10, +10 if they share **file only** (`target.x == caster.x` and `target.y != caster.y`). Rank-only → 10 only. Clear off-axis → 10 only. Reads occupancy, never names.
- Frost after a reel is a tax, not a root.

TACTICAL_PLAN:

- Reeler Reels only when Chebyshev ≥ 2, ray clear, landing is **not** safer for the player, and a walk-off remains.
- Biter walks a flank that **shares the file** after the reel, then Bites. It does not also Stride the file.
- Never turn-1 double displace onto one tile.

SYNERGY:

- Pull toward lava + bite the file they now share. Wave 16 Spike Screen standing on a **different** attract dest and a **file-only** poke instead of a cover poke.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got reeled toward lava, then bit because I still shared the file.” Recoverable: hug the Reeler (immune), keep a tile behind you, step off-file.

COUNTERPLAY:

- Stand adjacent to the Reeler. Break LoS. Occupy the toward-tile. Step off the file so File Bite is 10. Lava Skip if you own it. Kill the Reeler (hp ~0.80).

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **lava occupancy plus a 4-tile file**, plus open floor the other way. Reject `corridorMaze` (reel + bite in a hallway is a lock).
- No Void Rift tile as a legal landing. No spike dest. No world-portal dest. One clean aisle that is **not** lava.

AI_REQUIREMENTS:

- Reeler: caster + attract legality (landing walkable, not hazard, not portal, player retains ≥ 1 escape, skip if landing is safer).
- Biter: flanker; skip rider if they do not share file only unless 10 still kills; never also File Stride.
- Soph 2–3.

VARIANTS:

- `FSN-LAVA-FILE/GLYPH` — BRIGADE **Lava File full**: add `ROLE-GLYPH` (`glyph_sower`). Mark a step-off cell on the toward-tile. Still one Inferno cadence (none on BASE). Unlock after this PAIR.
- `FSN-LAVA-FILE/E-BITE` — elite Biter, still no lava dest.
- `FSN-SPIKE-SCREEN` remains the spike PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-SCORE-GATE

FORMATION_ID: `FSN-SCORE-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SCORE-POST` — `pawn` **without** heal / proposed `score_prelate` — pack median — leftover-sum===4 unequal end-turn occupy
- `ROLE-SCORE-SILL` — `rook` **without** heal / proposed `score_siller` — pack median — leftover-sum===4 unequal start-turn occupy

VARIANT_RULES:

- Distinct from `FSN-TALLY-GATE` (leftover-sum===3 post + start-turn leftover-sum===3 sill) and `FSN-POISE-GATE` (tied-≥1 post + start-turn tied-≥1 sill). Pressure is leftover **sum === 4 AND unequal** occupy at **two different times of day**. Walk-on is **safe** for the post. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post’s window). Dual Keep leftover-sum 3 is **safe** (Tally Post’s window).
- CELL: one post, one sill, two different tiles. Prelate cap 1 live post. Siller will not stack two sills on one cell.
- Elite: Siller only. Prelate stays junior so two hidden occupy elites cannot pin.
- Unlock after `FSN-SCORE-SIP` **or** `FSN-TALLY-GATE` (player has seen leftover-sum-4-unequal as a resource **or** a leftover-gated post).
- Do not ship until `summonAI === "scorepost"` (name heuristics stay a bug). Remaining cap ≥ 1.
- Mark as decoy is BRIGADE (`FSN-SCORE-GATE/STING`). Inferno stays off.

SPELL_POOL_INTERACTIONS:

- Score Post: end-turn occupy deals if leftover AP + leftover MP === 4 AND unequal; **walk-on does not**. Teleport landing does **not** (that is Swap Mark). Strike-from does **not** (that is Strike Mark). Spend a pool before turn end is a complete answer. Dual Keep 2/2 **misses**. Dual Keep leftover-sum 3 **misses**.
- Score Sill: start-of-their-turn occupy deals if leftover sum === 4 AND unequal; paint stays. Spend overnight is a complete answer. Barrier last-writer fills the paint.
- Do not also attach Slow (that is a third leftover story).

TACTICAL_PLAN:

- Prelate plants a post on a **flank choke**, never the only tile that reaches the Siller, never the only exit.
- Siller paints a **different** tile the player will occupy at dawn. Never both paints on one cell.
- If leftover sum is already 2/2 or leftover-sum 3 or 0/0, both skip (Frost / Strike).

SYNERGY:

- Leftover-sum-4-unequal post + leftover-sum-4-unequal start-sill. Teaching pair for Score Gate without the Stinger yet. Information (which tile, which clock) plus a leftover-sum-4-unequal tax.

PLAYER_THREAT:

- Frustration and a chip if you camp leftover-sum 4 unequal on the painted tile at the wrong clock. Not a lock: walk-on is free, second approach exists, leftover-sum is public.

COUNTERPLAY:

- Spend a pool before turn end (post). Spend a pool overnight (sill). Walk onto the post. Dual Keep 2/2. Dump to leftover-sum 3. Probe with a summon. Kill the Prelate (cap 1). Swap the Siller onto their own sill once you know the cell.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (post + sill on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Prelate: summoner scorepost; never plant the only backliner approach; remaining cap ≥ 1.
- Siller: setter; never paint both approaches; never paint the only exit.
- Soph 2–3.

VARIANTS:

- `FSN-SCORE-GATE/STING` — BRIGADE **Score Gate full**: add `ROLE-SCORE-STING`. Post detonates leftover-sum-4-unequal occupy; tile taxes start-of-turn; sting the rest. Still two different tiles. Unlock after this CELL.
- `FSN-SCORE-GATE/LIVE-FROST` — if Post id is not ready, Prelate Frost-only (softer CELL; still two bodies). Do not fake leftover-sum occupy with Slow.
- `FSN-TALLY-GATE` remains the leftover-sum-3 GATE; do not merge ids.

STATUS: PROPOSED

---

### FSN-STRIKE-DRY

FORMATION_ID: `FSN-STRIKE-DRY`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-STRIKE-MARK` — `bishop` **without** heal / proposed `strike_marker` — pack median — Strike-from consume
- `ROLE-DRY-PLATE` — `rook` **without** heal / proposed `dry_plater` — pack median + 1 — leftover-MP=0 miss

VARIANT_RULES:

- Distinct from `FSN-SWAP-BRICK` (teleport-landing consume; **walk-on is free** there too, but teleport **does** detonate) and `FSN-ODD-COURT` (leftover-AP-odd miss). Strike Mark detonates if they **Strike from** the painted cell. Walk-on is **free**. Spell-from is **free**. Dry Plate is leftover **MP = 0** miss; leftover MP ≥ 1 at impact **lands** and the charge **stays**. Extra room `strike_pulpit` is **not** this family.
- CELL: Marker has Strike Mark + Frost. Plater has Dry Plate + Strike. Never Inferno. Never Swap Mark / Shove Mark / Wake / Spent Plate / Odd Plate / Score Hood on PAIR (PAIR bans).
- Elite: Plater only. Marker stays junior so two paint elites cannot pin.
- Unlock after `FSN-SWAP-BRICK` **or** `FSN-SPENT-FULL` (player has seen a landing-paint **or** a leftover-AP miss).
- Do not spawn without a legal Strike in the pack (`goad_herald` / `ember_knight` / `bash_bruiser`) **or** a player Strike in kit. BASE uses the **player** Strike as the trip.
- Leftover-MP writer required. Strike-from writer required. **Never PAIR Strike Mark + Goad** — `/GOAD` is the 3-body.

SPELL_POOL_INTERACTIONS:

- Strike Mark: 0 on cast. Strike originating on the painted cell detonates and consumes. Walk-on is **free**. Spell-from is **free**. Observation is the **paint**.
- Dry Plate: leftover MP 0 at impact → miss and consume. Leftover MP ≥ 1 → hit lands, charge remains. Walk 1 MP **opens** the hit. Dual Keep MP bank **closes** the miss.
- No drain on the Dry Plater (healAmount).

TACTICAL_PLAN:

- Marker paints a **flank choke** the player wants to Strike from, never both approaches, never the only tile that reaches the Plater.
- Plater walks into the path and Plates when leftover MP is 0. If leftover MP ≥ 1, Plater Iron Skins / Strikes. It does not dump leftover MP **only** to fake Gait Plate.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Paint the Strike cell, then camp leftover MP 0 behind the miss. Wave 16 Swap Brick standing on **Strike-from** instead of teleport, plus a leftover-MP=0 miss instead of a through-barrier peek. Combination, not a new sprite. Walk, don’t Strike **or** keep 1 walk MP — is a complete answer.

PLAYER_THREAT:

- Long, structured. Spike is a chip if you Strike from the paint **and** dump leftover MP to 0. Fail is dumping Inferno into leftover MP 0 **and** a fresh miss. Recoverable: walk onto the paint, spell from the paint, keep leftover MP ≥ 1.

COUNTERPLAY:

- Walk, don’t Strike. Cast Frost from the paint (spell-from is free). Keep leftover MP ≥ 1. Drain Courage onto leftover MP 0 **opens** the miss — don’t. Hit a different body. Kill the Marker (glass). The Plater without leftover MP 0 is a fat Strike.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Never a closed ring.
- No Thorned Ground on the only path to the Plater. Paint must not be the only tile that reaches the Plater.

AI_REQUIREMENTS:

- Marker: setter; skip if no Strike tool in the pack **or** player kit; never paint both approaches; walk-on and spell-from are free.
- Plater: guardian; skip if leftover MP already ≥ 1.
- Soph 2–3.

VARIANTS:

- `FSN-STRIKE-DRY/GOAD` — BRIGADE **Strike Dry full**: add `ROLE-PUSHER` (`goad_herald` or `bash_bruiser`) so the pack itself owns a Strike. **Never a two-body of Mark+Goad.** Unlock after this CELL. Still one Slow source.
- `FSN-STRIKE-DRY/GOLEM` — fallback: live `iron_golem` instead of Dry Plate if leftover-MP miss is not ready.
- `FSN-SWAP-BRICK` remains the teleport-landing CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SHOCK-EVEN

FORMATION_ID: `FSN-SHOCK-EVEN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SHOCK-SKIP` — `knight` **without** heal / proposed `shock_skipper` — pack median — 1-tile shock enter-tax skip
- `ROLE-EVEN-STING` — `pawn` **without** heal / proposed `even_stinger` — pack median or −1 — leftover-AP even ≥ 2 poke

VARIANT_RULES:

- Distinct from `FSN-MIRE-FILE` (1-tile **mire** enter-tax skip + ice kiter) and `FSN-ODD-COURT/STING` (leftover-AP-**odd** poke). Shock Skip ignores **enter-tax** on a **length-1** walk across shock. Length ≥ 2 still pays. Mire, rime, glyph, lava, and spikes still tick. Extra room `shock_nave` is **not** this family. Even Sting pokes leftover **AP even and ≥ 2**; leftover AP **0 is even and excluded**.
- CELL: Skipper has Shock Skip + Strike. Stinger has Even Sting + Strike. Never Inferno. Never Mire Skip / Rime Skip / Odd Sting / Score Sting / Tied Gait on PAIR (PAIR bans).
- Elite: Stinger only. Skipper stays junior so two skip elites cannot paint the pocket.
- Unlock after `FSN-MIRE-FILE` **or** `FSN-TALLY-SIP` (player has seen a 1-tile hazard skip **or** a leftover-AP poke).
- If the map has no shock / spark occupancy in Chebyshev 6 of a legal floor, **reroll this id**.
- One Slow source if Slow is chosen (Skipper). Stinger does not also Slow.

SPELL_POOL_INTERACTIONS:

- Shock Skip: next **length-1** walk ignores shock enter-tax. Length ≥ 2 pays. Teleport / Swap onto shock already pays no enter-tax — that is a legal skip of the tax if the player brought it.
- Even Sting: 10, +8 iff leftover AP is even **and ≥ 2**. Leftover AP 0 → 10 only. Leftover AP 1/3 (odd) → 10 only. Dual Keep 2/2 **opens** the 8 (Poise window **and** Even window — Even is the poke, Poise Sting is a different family). Dual Keep leftover-sum 3 with leftover AP 1 (odd) **fizzles** the 8.
- Paper Windstorm is a **fair** modifier (also hits the skipper).

TACTICAL_PLAN:

- Skipper arms Shock Skip then steps onto a 1-tile shock cell toward a flank. It does not walk length 2 across two shock cells.
- Stinger lurks at 3 and commits when leftover AP is even ≥ 2 **or** HP% ≤ 40.

SYNERGY:

- 1-tile shock skip + leftover-AP-even-≥2 poke. Wave 16 Mire File standing on a **different** hazard tax, plus a leftover-AP **parity-and-floor** poke instead of a kite. Combination, not a new sprite. Dump leftover AP to 0 **or** sit odd leftover AP is a complete answer to the sting; body-block the 1-tile is a complete answer to the skip.

PLAYER_THREAT:

- Frustration and chip, not a lock. The skipper crosses a tax you thought was a wall; the stinger punishes Dual Keep 2/2 that you held for Poise.

COUNTERPLAY:

- Body-block the 1-tile. Force a length-2 path (they still pay). Sit leftover AP 0 or odd. Dual Keep leftover-sum 3 with leftover AP 1. Kill the Stinger (glass). Do not chase through the Skipper’s tile.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with **wide** files **and** a shock cell. Reject `corridorMaze` (a skipper in a hallway is either helpless or a lock).
- One clean aisle that is **not** shock. No lava on the only approach.

AI_REQUIREMENTS:

- Skipper: flanker; skip if the next walk is not a 1-step across shock; never skip mire / rime / lava / spikes with this id.
- Stinger: charger; skip rider if leftover AP is odd or 0 unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-SHOCK-EVEN/TIDE` — BRIGADE **Shock Even full**: add `ROLE-KITER` (`tide_shade`). Cross the shock tax, then poke leftover AP even ≥ 2, then the tide slows the landing. Still one Slow source (the shade). Unlock after this CELL. Live tide melee −1 MP counts toward the −2 cap.
- `FSN-SHOCK-EVEN/E-STING` — elite Stinger, still no Odd Sting.
- `FSN-MIRE-FILE` remains the mire CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-WATCH-ODD

FORMATION_ID: `FSN-WATCH-ODD`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-ROOT` — `bishop` **without** heal / proposed `watch_rooter` — pack median — overwatch snap zeros leftover MP
- `ROLE-ODD-GAIT` — `pawn` **without** heal / proposed `odd_gaiter` — pack median or −1 — leftover-MP-odd poke

VARIANT_RULES:

- Distinct from `FSN-WATCH-BANK` (snap **banks** walker leftover AP) and `FSN-WATCH-SIP` (snap **steals** walker leftover AP). Watch Root **zeros leftover MP** on the **walker**. Dual Keep leftover that survives turn start **is** leftover — Root then dumps the MP half. Push/pull into the band **does** snap. Teleport / Swap **does not**. **Never PAIR Watch Root + Glass Sniper** — `/GUN` is the 3-body.
- CELL: Rooter has Watch Root + Frost. Gaiter has Odd Gait + Strike. Never Inferno. Never Watch Bank / Watch Sip / Watch Alms / Watch Fee / Lone Gait / Pair Gait / Odd Sting on PAIR (PAIR bans).
- Elite: Rooter only. Gaiter stays junior so two overwatch elites cannot pin.
- Unlock after `FSN-WATCH-BANK` **or** walked into Hold Ground / Far Watch this run (relative, not a level gate).
- Visible 2-turn stance. Never arm a hidden snap.

SPELL_POOL_INTERACTIONS:

- Watch Root: next hostile who **walks** into the overwatch band has leftover MP set to 0. Snap still deals (Frost chip). Dual Keep already covering them → leftover MP half dumps; AP half stays. Cap leftover-MP dump at the walker’s remaining MP (not a steal, not a bank).
- Odd Gait: 10, +8 iff leftover **MP is odd**. Leftover MP 0 (even, after Root) → 10 only. Leftover MP 1/3 → 18. Root **closes** Odd Gait unless they somehow sit leftover MP 1 after a partial dump that this card does not do (Root zeros — Odd Gait then Frosts). Teaching contrast: **don’t walk the band** keeps leftover MP odd if you already held 1; walking the band dumps to 0 and Odd Gait is 10.
- One Slow source if Slow is chosen (Rooter). Gaiter does not also Slow.

TACTICAL_PLAN:

- Rooter arms a **visible** overwatch on a **wide** lane, then Frosts. Gaiter lurks at 3 and commits when leftover MP is odd **or** HP% ≤ 40.
- If Dual Keep is already on the player, Rooter still snaps (dumps leftover MP). Gaiter then sees leftover MP 0 and Strikes (skip the 8).

SYNERGY:

- Snap zeros leftover MP + leftover-MP-odd poke. Wave 16 Watch Bank standing on the **inverse leftover pool** (dump MP vs bank AP), plus a leftover-MP **parity** poke instead of an optic. Combination, not a new sprite. Don’t walk the band is a complete answer.

PLAYER_THREAT:

- Slow poke plus a leftover-MP dump you did not ask for. Not a one-shot. Misplay is walking the band “for one Frost” then finding leftover MP 0 **and** a 10 you expected to be 18.

COUNTERPLAY:

- Don’t walk the band. Blink / Swap in (does not snap). Send a summon. Sit leftover MP even without walking (dump yourself). Kill the Rooter (hp ~0.75). The Gaiter without leftover-MP-odd is Strike.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel.
- No lava on the only approach to the Rooter.

AI_REQUIREMENTS:

- Rooter: artillery; skip if no overwatch is armed; never bank leftover AP (that is Watch Bank); never steal leftover AP (that is Watch Sip).
- Gaiter: flanker; skip if leftover MP is even unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-ODD/GUN` — BRIGADE **Watch Odd Hunt full**: add `ROLE-SNIPER` (`glass_sniper`). Snap zeros leftover MP, then the gun / gaiter punish the dry purse. **Never a two-body of Root+Gun.** Unlock after this CELL. Still one Slow source. Sniper minRange 3.
- `FSN-WATCH-ODD/E-ROOT` — elite Rooter, still no Watch Bank / Watch Sip.
- `FSN-WATCH-BANK` remains the leftover-AP-bank CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-SCORE-CHOIR

FORMATION_ID: `FSN-SCORE-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SCORE-MEND` — `queen` **with** heal / proposed `score_mender` — pack median
- `ROLE-VERSE-SCORE` — `bishop` **without** heal / proposed `verse_scorer` — pack median — last-id illegal until leftover-sum===4 unequal
- `ROLE-HAZARD` — `knight` / proposed `ignite_alchemist` or live `ember_knight` — pack median — Ignite stacks (or live melee burn if Ignite id is not ready)

VARIANT_RULES:

- Unlock after `FSN-TALLY-CHOIR` **or** `FSN-SCORE-STEP`. Wave 17 “Score Choir.”
- Elite: Mender only. Verse and Ignite stay junior.
- Mender: Score Mend + Shield. **No** Inferno. **No** Tally / Poise / Gaunt / Equal / Hollow / Lean Mend (PAIR bans). Extra door `score_cantor` is **not** this family.
- Verse: Verse Score + Frost. **No** Verse Tally / Verse Poise / Last Mute / Summon Verse (PAIR bans). `lastResolvedSpellId` required. `0 = 0` does **not** peel. `2 = 2` does **not** peel. `3 = 0` does **not** peel. Forced-move does **not** peel.
- Ignite: `spell-ignite-stacks` if ready, else live ember melee-burn. **No** Inferno on this body if Ignite is present (one fire cadence). Ignite stack gate ≥ 2.
- Do not also roll random summoner overlay onto any body.
- If leftover writers or `lastResolvedSpellId` are missing, **do not spawn this id** — show `FSN-TALLY-CHOIR`.

SPELL_POOL_INTERACTIONS:

- Score Mend (8) iff both leftover sums === 4 AND unequal. Verse Score: last resolved non-Strike id is **illegal** until leftover AP + leftover MP === 4 AND unequal. Ignite cashes ≥ 2 public DoT stacks.
- Readable three-step: spend into leftover-sum 4 unequal to recast last id **or** sit 2/2 and refuse the 8 **or** dump to leftover-sum 3 (Tally Choir’s peel, not this one).
- One Inferno cadence per pack — Ignite **or** ember burn, not both plus a queen nuke.

TACTICAL_PLAN:

- Turn 1: Verse arms if `lastResolvedSpellId` exists; else Frosts. Mender Shields unless both leftover sums === 4 unequal and missing HP ≥ 8. Ignite holds until ≥ 2 stacks are public.
- If the Mender dies, remaining pair is last-id lock + applicator — intended.

SYNERGY:

- Leftover-sum-4-unequal heal + last-id until leftover-sum-4-unequal + ignite. Wave 16 Tally Choir standing on the **next leftover-sum** (4, always unequal). Combination, not a new monster.

PLAYER_THREAT:

- High if you Dual Keep (3,1) to recast Inferno **and** feed the 8. Still interruptible: sit 2/2, dump to leftover-sum 3, wait, kill Verse.

COUNTERPLAY:

- Dual Keep 2/2 (Verse does not peel; Mend does not fire). Dump to leftover-sum 3. Recast a **different** id (Summon Verse is a different tax). Kill Verse (glass). Cursed Wound the Mender. Do not clump with a wisp on Ignite.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Ignite can land.

AI_REQUIREMENTS:

- Mender: healer; skip if leftover sum ≠ 4 or tied.
- Verse: controller; skip if no `lastResolvedSpellId`; leftover-sum===4 unequal peels.
- Ignite: flanker; **not** berserk; stack gate ≥ 2.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-SCORE-CHOIR/NO-IGNITE` — drop Ignite if stack consume is not ready; keep Mend + Verse (softer BRIGADE).
- `FSN-TALLY-CHOIR` remains the leftover-sum-3 choir; do not merge ids.

STATUS: PROPOSED

---

### FSN-LEAN-RISE

FORMATION_ID: `FSN-LEAN-RISE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-LEAN-GIFT` — `queen` **with** heal / proposed `lean_gifter` — pack median — leftover AP=0 and MP≥1 10
- `ROLE-CADENCE-RISE` — `bishop` **without** heal / proposed `cadence_riser` — pack median — remaining `1→2`
- Optional third: `font_cantor` junior **or** omit — if present, self-heal font (Wave 4); never a second leftover-gated heal CORE

VARIANT_RULES:

- Unlock after `FSN-PAIR-DRY` **or** `FSN-PRIME-TAX`. Wave 17 “Lean Rise.”
- Distinct from `FSN-SCORE-STEP` (both-bodies leftover-sum===4 unequal) and `FSN-PRIME-TAX` (remaining `0→1`). Lean Gift is leftover **AP = 0 and leftover MP ≥ 1**. Dual Keep **destroys** this window if it banks AP. Cadence Rise writes remaining `n===1` → `2`; zeros stay 0; `n>1` unchanged. **Not** Cadence Snuff (`1→0` — that is `FSN-SNUFF-VERSE`). **Not** Cadence Prime (`0→1` — drop 17). **Not** Cadence Floor (`n>1→1` — SDE #906). Do **not** invent `lean_cantor`. **Never PAIR Lean Gift + Score Mend / Tally Mend / Hollow Gift.** **Never PAIR Rise + Snuff.**
- Elite: Gifter only. Riser and Font stay junior.
- Font is the **one** rare if present, after `FSN-KENNEL-LITANY` has been seen **or** as this BRIGADE’s rare — not both Font **and** Inferno on the same AP bar.
- If leftover writers are missing, **do not spawn this id** — show `FSN-PAIR-DRY`.
- Remaining-CD map required for Rise. Until that writer lands, show `FSN-PRIME-TAX`.

SPELL_POOL_INTERACTIONS:

- Lean Gift (10 HP) pays only if leftover AP = 0 **and** leftover MP ≥ 1. Dual Keep leftover AP **closes** it. Dump leftover AP (cast) **opens** it if leftover MP remains.
- Cadence Rise: remaining 1 becomes remaining 2 — recast **after next turn**, not now. Target keeps every spell. Skip if every remaining is already ≠ 1.
- Font: self-heal if present. **No** Inferno on the Gifter (healAmount + AoE is a lock adjacent).

TACTICAL_PLAN:

- Turn 1: Riser Rises if a nuke remaining is 1; else Frosts. Gifter Lean-Gifts only if leftover AP = 0 and leftover MP ≥ 1 and missing HP ≥ 10; else Shields. Optional Font holds at 4.
- If the Gifter dies, remaining pair is remaining-1 pad + glass font — intended.

SYNERGY:

- Leftover AP=0 / MP≥1 heal + remaining 1→2. Wave 16 Prime Tax standing on a **different** remaining rewrite (pad the almost-ready bar instead of locking zeros to 1), plus a leftover-AP=0 heal Dual Keep **cannot** manufacture. Live `font_cantor` so the pack is not three proposed sprites.

PLAYER_THREAT:

- High if you sit leftover AP 0 with leftover MP 1 **and** a remaining-1 Inferno you wanted to recast **now**. Still interruptible: Dual Keep AP, spend leftover MP, Rise your remaining 1 yourself (player copy), kill Rise.

COUNTERPLAY:

- Dual Keep leftover AP (Lean Gift fizzles). Spend leftover MP. Recast the remaining-1 Inferno **now** (before Rise pads it to 2). Kill the Riser (glass). Cursed Wound the Gifter. Do not dump leftover AP only to feed the 10 if a Strike would kill.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- Gifter needs a retreat tile that is not the Font’s choke.

AI_REQUIREMENTS:

- Gifter: healer; skip if leftover AP ≠ 0 or leftover MP = 0; never also Score / Tally / Hollow.
- Riser: controller; skip all-non-1; never Snuff / Prime / Floor / Crack the same turn.
- Optional Font: healer; `AI_BACKLINE_PROTECT` at soph 4.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-LEAN-RISE/NO-FONT` — drop Font if ally heal apply is missing; keep Gift + Rise (softer BRIGADE).
- `FSN-SNUFF-VERSE` remains the remaining-1→0 CADRE; do not merge ids.
- `FSN-PRIME-TAX` remains the remaining-0→1 CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SCORE-QUIET

FORMATION_ID: `FSN-SCORE-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SCORE-STEP` — `queen` **without** heal / proposed `score_stepper` — pack median — leftover-sum===4 unequal joiner
- `ROLE-SCORE-MEND` — `queen` **with** heal / proposed `score_mender` — pack median — leftover-sum===4 unequal 8
- `ROLE-COVER` — `knight` / proposed `cover_squire` — pack median + 1 — body-block, gallery gap

VARIANT_RULES:

- Unlock after `FSN-SCORE-STEP` **and** (`FSN-TALLY-QUIET` or `FSN-POISE-QUIET`). Wave 17 “Score Quiet.”
- Distinct from `FSN-TALLY-QUIET` (leftover-sum===3 join + leftover-sum===3 heal + cover). This is leftover-sum===4 unequal join + leftover-sum===4 unequal heal + cover. **Never PAIR Score Step + Cover** — the BRIGADE is why both exist, with a third peeler (Mend).
- Elite: Stepper only. Mender and Cover stay junior.
- Cover: Strike + Shield. **No** Inferno. Ally Shield apply required — if missing, Cover **only** body-blocks (softer BRIGADE; still valid).
- Do not also roll random summoner overlay onto any body.
- If leftover writers are missing, **do not spawn this id** — show `FSN-TALLY-QUIET`.

SPELL_POOL_INTERACTIONS:

- Score Step relocates onto a free Chebyshev-1 of an ally whose leftover sum === 4 AND unequal. Cover occupies a gallery so walking off-file still costs a body. Score Mend (8) iff both leftover sums === 4 AND unequal.
- Cover Shield on the Mender when the Mender is under 50%. If ally Shield apply is missing, Cover only body-blocks.
- No drain / nova.

TACTICAL_PLAN:

- Cover forms a moving wall with a **gap** (never a closed box). Mender sits in the pocket. Stepper joins the Mender when leftover-sum===4 unequal, else Frosts.
- If Cover dies, remaining pair is `FSN-SCORE-STEP` — intended.

SYNERGY:

- Join the leftover-sum-4-unequal ally, then cash the six leftover reads, behind a squire. Wave 16 Tally Quiet standing on the **next leftover-sum**. Combination, not a new monster.

PLAYER_THREAT:

- Slow refill behind a body. Spike is low. Fail is Dual Keep (3,1) into the gap **and** an 8. Recoverable: sit 2/2, dump a pool, walk the gallery.

COUNTERPLAY:

- Dual Keep 2/2. Dump to leftover-sum 3. Occupy every Chebyshev-1 of the Mender. Walk the gallery. Kill Cover first if boost is on (CADRE later). Cursed Wound the Mender.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the cover axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Stepper: protector; skip if ally leftover sum ≠ 4 or tied or no free dest.
- Mender: healer; skip if leftover sum ≠ 4 or tied.
- Cover: guardian, `chokepointCamp` only with a gap.
- Soph 3–4. `groupTactics` at 4: one focus. Ally `targetId` for Cover Shield.

VARIANTS:

- `FSN-SCORE-QUIET/LEND` — BRIGADE **Lend Hood escort**: replace Cover with `ROLE-SCORE-LEND` + `ROLE-SCORE-HOOD` + `tempo_precentor`. Cash the window with +1/+1 (sum 6, inequality preserved: (3,1)→(4,2)), or hold (3,1) through a miss. **Never PAIR Score Lend + Tally Lend / Poise Lend / Tempo as a two-body.** Unlock after this BRIGADE. Still one leftover-window lend CORE.
- `FSN-SCORE-QUIET/NO-COVER` — fallback to `FSN-SCORE-STEP` if the run cannot support three backliners.
- `FSN-TALLY-QUIET` remains the leftover-sum-3 Quiet; do not merge ids.

STATUS: PROPOSED

---

### FSN-DUEL-SCORE

FORMATION_ID: `FSN-DUEL-SCORE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-DUEL-TURN` — `queen` **without** heal / proposed `duel_turner` — pack median — two-hostile leftover invert
- `ROLE-SCORE-MEND` — `queen` **with** heal / proposed `score_mender` — pack median — leftover-sum===4 unequal 8
- `ROLE-SCORE-STING` — `pawn` **without** heal / proposed `score_stinger` — pack median or −1 — leftover-sum===4 unequal poke

VARIANT_RULES:

- Unlock after `FSN-SCORE-STEP` **and** `FSN-SCORE-SIP`. Wave 17 “Duel Score.”
- Distinct from `FSN-PURSE-TALLY` (one-hostile leftover invert + leftover-sum===3 heal + leftover-sum===3 sting). Duel Turn inverts leftover AP↔MP on **two** hostiles independently; caster leftover **unchanged**; sum invariant on each body. Score stays Score; Tally stays Tally; Poise stays Poise. **Never PAIR Duel Turn + Purse Turn / Bar Cross / Dual Keep.** **Never PAIR Score Mend + Score Sting as a two-body** — the BRIGADE is why both exist, with a third peeler (Turn).
- Elite: Turner only. Mender and Stinger stay junior so two leftover-gated elites cannot pin.
- No Inferno. No Sacrifice. Hymn Turn (two **allies**) stays Wave 18.
- If leftover writers are missing, **do not spawn this id** — show `FSN-PURSE-TALLY`.

SPELL_POOL_INTERACTIONS:

- Duel Turn: invert leftover AP↔MP on the target **and** the nearest other hostile within Chebyshev 3 of the target. (4,0)+(0,4) stay Score. (3,1)+(1,3) stay Score. (2,2)+(2,2) is a double no-op (skip). Isolate (one body) fizzles the second invert.
- Score Mend (8) iff both leftover sums === 4 AND unequal. Score Sting: 10 + 8 iff leftover sum === 4 AND unequal.
- Readable three-step: invert two purses while keeping sum 4, then heal / sting. Isolate is the answer.

TACTICAL_PLAN:

- Turn 1: Turner inverts only if two hostiles sit Score pairs or (4,0)/(0,4); else Frosts. Mender Shields unless both leftover sums === 4 unequal and missing HP ≥ 8. Stinger lurks at 3 and commits when leftover sum === 4 unequal **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Two-hostile leftover invert + leftover-sum-4-unequal heal + leftover-sum-4-unequal sting. Wave 16 Purse Tally standing on **two** purses instead of one, plus the next leftover-sum. Combination, not a new monster. Isolate is a complete answer.

PLAYER_THREAT:

- High if you Dual Keep (3,1) on **you and a wisp**. Spike is one 18 plus an 8. Recoverable: fight without a second body, sit 2/2 on both, dump a pool.

COUNTERPLAY:

- Isolate (one body). Sit 2/2 on both (double no-op). Dump a pool. Kill the Turner (glass). Cursed Wound the Mender. Desummon so Turn has only the player.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- ≥ 2 walk-offs from wherever Sting can land.

AI_REQUIREMENTS:

- Turner: controller; skip double-equal / double-empty / pack size < 2; never Purse Turn / Bar Cross / Swap as identity.
- Mender: healer; skip if leftover sum ≠ 4 or tied.
- Stinger: flanker; skip if leftover sum ≠ 4 or tied unless 10 still kills.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-DUEL-SCORE/NO-MEND` — drop Mend if band 1 heal is not the run’s band; keep Turn + Sting (softer BRIGADE). Still never Duel+Purse PAIR.
- `FSN-PURSE-SCORE` is the CADRE that **manufactures Tally** after invert; do not merge.
- `FSN-PURSE-TALLY` remains the one-hostile invert BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SNUFF-VERSE

FORMATION_ID: `FSN-SNUFF-VERSE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-CADENCE-SNUFF` — `bishop` **without** heal / proposed `cadence_snuffer` — pack median — remaining `1→0`
- `ROLE-VERSE-SCORE` — `bishop` **without** heal / proposed `verse_scorer` — pack median — last-id illegal until leftover-sum===4 unequal
- `ROLE-DEBUFFER` — `bishop` / live `bone_scribe` or proposed `tax_scribe` — pack median — Weaken / Expose / Glyph Tax; **no** drain

VARIANT_RULES:

- Unlock after `FSN-PRIME-TAX` **or** `FSN-SCORE-CHOIR`. Wave 17 “Snuff Verse.”
- Distinct from `FSN-PRIME-TAX` (remaining `0→1` + Struck-last-turn spell tax) and `FSN-LEAN-RISE` (remaining `1→2`). Cadence Snuff writes remaining `n===1` → `0`; zeros stay 0; `n>1` unchanged. Inverse of Rise, not Floor. Extra door `snuff_precentor` is **not** this family. **Never PAIR Cadence Snuff with Rise / Primer / Thief / Lagger / Staller / Cracker / Flusher.** **Never PAIR Verse Score with Verse Tally / Verse Poise / Last Mute / Summon Verse as a two-body.** The CADRE is why Snuff + Verse + Scribe exist.
- Elite: Snuffer only. Verse and Scribe stay junior.
- Scribe does not also Poison (Snuff + Verse is enough). Glyph Tax is the **one** rare, on the Scribe, after `FSN-GRAVITY-TAX` has been seen **or** as this CADRE’s rare — not both Tax **and** Drain Courage on the same AP bar.
- `lastResolvedSpellId` required for Verse Score. Remaining-CD map required for Snuff. Until those writers land, show `FSN-PRIME-TAX`.
- No Inferno. No Sacrifice. No Quiet Hex on CORE. **Never PAIR Rise + Snuff** — Rise lives on `FSN-LEAN-RISE`.

SPELL_POOL_INTERACTIONS:

- Cadence Snuff: remaining 1 becomes remaining 0 — recast **this tick**. Target keeps every spell. Skip if every remaining is already ≠ 1.
- Verse Score: last resolved non-Strike id is **illegal** until leftover AP + leftover MP === 4 AND unequal. `0 = 0` does **not** peel. `2 = 2` does **not** peel. `3 = 0` does **not** peel.
- Glyph Tax: +1 AP to **cast** while in the 3×3, 0 damage. Leaving the zone is the answer. Cheap Strike from outside is legal.
- Readable three-step: Snuff the almost-ready Inferno so it is legal **now**, then Verse locks recast until they sit Score, then Tax the zone. Spend the remaining-1 Inferno **before** Snuff is a complete answer.

TACTICAL_PLAN:

- Turn 1: Snuffer Snuffs if a nuke remaining is 1; else Frosts. Verse arms if `lastResolvedSpellId` exists; else Frosts. Scribe Weakens if the player is already wounded; else holds.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Ready-unlock remaining 1→0, then lock recast until leftover-sum===4 unequal, then zone AP. Wave 16 Prime Tax standing on the **inverse remaining-1 rewrite** (unlock now vs lock zeros to 1), plus Verse Score instead of Cast Toll. Live `bone_scribe` so the pack is not three proposed sprites.

PLAYER_THREAT:

- High if you sit remaining 1 on Inferno **and** leftover-sum 4 unequal. Still a wait-out. Failure is dumping a 5-AP Inferno after Snuff **and** Verse **and** Tax.

COUNTERPLAY:

- Spend the remaining-1 Inferno **now** (before Snuff). Rise it to 2 (`FSN-LEAN-RISE` tool, or player copy). Dual Keep 2/2 (Verse does not peel). Dump to leftover-sum 3. Leave the Tax zone. Kill the Snuffer (glass). Strike still costs 2.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Tax 3×3 must not cover **all** walk-offs.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Snuffer: controller; skip all-non-1; never Rise / Prime / Floor / Crack the same turn.
- Verse: controller; skip if no `lastResolvedSpellId`; leftover-sum===4 unequal peels.
- Scribe: caster; skip recast Weaken; zone the landing **only** if an exit exists.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-SNUFF-VERSE/NO-SCRIBE` — fallback to Snuff + Verse only (BRIGADE-shaped CADRE if Glyph Tax is not ready). Still never Verse-Score+Scribe PAIR.
- `FSN-PRIME-TAX` remains the remaining-0→1 CADRE; `FSN-LEAN-RISE` remains the remaining-1→2 BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-STILL-BRACE

FORMATION_ID: `FSN-STILL-BRACE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-STILL-TOLL` — `bishop` **without** heal / proposed `still_toller` — pack median — leftover-MP=0 next-spell tax
- `ROLE-BRICK-BRACE` — `knight` **without** heal / proposed `brick_bracer` — pack median — barrier-adjacent miss
- `ROLE-TURRET` — `rook` / proposed `stone_castellan` — pack median + 1 — stationary summon

VARIANT_RULES:

- Unlock after `FSN-STRIKE-DRY` **or** `FSN-WATCH-BANK`. Wave 17 “Still Brace.”
- Distinct from `FSN-PRIME-TAX` (Struck-last-turn next-**spell** +1) and `FSN-SWAP-BRICK` (through-barrier **relocate**). Still Toll taxes the next **spell** if leftover **MP = 0**. Keep 1 walk MP is a complete answer. Brick Brace: next hit 0 if a **barrier is adjacent**; destroy the barrier and the hit lands; charge **stays**. Brick Brace **does not move** the barrier. **Never PAIR Still Toll + Cast Toll / Strike Debt / Spent Tax / Ley Toll / Tax Scribe as a two-body.** **Never PAIR Brick Brace + Brick Step / Nudge / Orbit / Castellan as a two-body.** The CADRE is why tax + miss + turret exist.
- Elite: Castellan only. Toller and Bracer stay junior so two camp elites cannot pin.
- Turret cap 1, lifespan 4, `mp: 0`, must not path. Do not also roll wolf/archer. Global summon cap still 2 — this sheet uses 1.
- No Inferno. No Root. No second trapper. InstantKill / betrayal stay off.

SPELL_POOL_INTERACTIONS:

- Still Toll: leftover MP 0 → next **spell** +1 AP. Strike still costs 2. Walk 1 MP peels. Dual Keep leftover MP **closes** the tax.
- Brick Brace: next hit 0 while a barrier is Chebyshev 1. Destroy the barrier → hit lands, charge remains. Screen Bite is a **damage** rider if Bresenham is blocked — **not** this family.
- Turret linear shard owns a file. Iron Skin / Shield on the turret, not a second turret.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Castellan places the turret on a choke facing the player, then Shields it. Bracer camps **adjacent to the turret’s barrier / a pillar**, never sealing the last aisle. Toller Tolls if leftover MP is 0; else Frosts.
- If the turret dies, the lane opens; Castellan may retreat (`escapeRoute`) rather than suddenly one-shot.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Tax the next spell at leftover MP 0, then camp adjacent to a barrier, behind a stationary gun. Wave 16 Watch Bank standing on a **leftover-MP** tax instead of a leftover-AP bank, plus a barrier-adjacent miss instead of an optic. Combination, not a new monster. Keep 1 walk MP **or** destroy the barrier is a complete answer.

PLAYER_THREAT:

- Positional and tempo. Failure is Inferno-from-leftover-MP-0 after camping the brace. Recoverable: walk 1 MP, destroy the barrier, walk off-axis, burst the turret (glass gun).

COUNTERPLAY:

- Keep leftover MP ≥ 1. Destroy the barrier. Walk off-axis. Burst the turret. Sit on the placement cell. Barrier the lane (player). Kill the Castellan down a gallery. Strike still costs 2.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a file the player can take **and** at least one barrier / pillar. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Turret placement ring: ≥ 3 free cells, none void. Player must have a tile off the shard ray. Bracer must have a barrier in Chebyshev 1 of a legal floor — weight 0 if none.

AI_REQUIREMENTS:

- Toller: controller; skip if leftover MP ≥ 1; Strike stays 2 AP; never Cast Toll / Spent Tax the same turn.
- Bracer: protector; skip if no barrier adjacent; never Step / Nudge / plant a new barrier that seals the last aisle.
- Turret owner: summoner + proposed cap/cooldown fall-through (Frost or Shield, never skip-lock). New summon AI `turret` — do not reuse bomber.
- Soph 4–6. `groupTactics` on. `escapeRoute` (6) on: wounded Castellan walks to the gallery, not through the player.

VARIANTS:

- `FSN-STILL-BRACE/NO-TURRET` — BRIGADE-shaped CADRE: Toller + Bracer only (ship if turret AI is not ready). Still never Brace+Step PAIR. Still never Toll+Scribe PAIR.
- `FSN-PRIME-TAX` remains the Struck-spell CADRE; `FSN-SWAP-BRICK` remains the through-barrier CADRE; do not merge ids.

STATUS: PROPOSED

---

### FSN-PURSE-SCORE

FORMATION_ID: `FSN-PURSE-SCORE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-DUEL-TURN` — `queen` **without** heal / proposed `duel_turner` — pack median — two-hostile leftover invert
- `ROLE-SCORE-SIP` — `pawn` **without** heal / proposed `score_sipper` — pack median — leftover-sum===4 unequal leftover-AP steal
- `ROLE-TALLY-STING` — `pawn` **without** heal / proposed `tally_stinger` — pack median or −1 — leftover-sum===3 poke

VARIANT_RULES:

- Unlock after `FSN-DUEL-SCORE` **or** `FSN-PURSE-TALLY`. Wave 17 “Purse Score.”
- Distinct from `FSN-DUEL-SCORE` (invert, then Score heal / Score sting — **Score stays Score**). This sheet **manufactures Tally**: Score Sip on (3,1) → (2,1) leftover-sum 3, then Tally Sting cashes the 8. Sum invariant on Duel Turn; Sip is the rewrite. **Never PAIR Duel Turn + Purse Turn / Bar Cross.** **Never PAIR Score Sip + Tally Sip / Watch Sip as a two-body.** **Never PAIR Score Sting + Tally Sting as a two-body** — the CADRE is why Sip + Tally Sting exist, with a third peeler (Turn).
- Elite: Turner only. Sipper and Stinger stay junior so two leftover-gated elites cannot pin.
- No Inferno. No Sacrifice. No Score Mend on this sheet (that is `FSN-DUEL-SCORE`).
- If leftover writers are missing, **do not spawn this id** — show `FSN-DUEL-SCORE`.
- One leftover-AP steal source (Sip). Turner does not also Slow past the −2 cap.

SPELL_POOL_INTERACTIONS:

- Duel Turn: invert two hostiles independently. (4,0) stays Score. (3,1) stays Score. Isolate fizzles the second invert.
- Score Sip: steal 1 leftover AP iff leftover sum === 4 AND unequal **and leftover AP ≥ 1**. (3,1) → (2,1) **Tally**. (4,0) → (3,0) **Tally**. (0,4) fizzles.
- Tally Sting: 10 + 8 iff leftover AP + leftover MP === 3. Dual Keep leftover **opens** the 8 on leftover-sum 3. `2 = 2` is Poise, not this one. `4 = 0` is Score, not this one — Sip must fire first.
- Readable three-step: invert, sip (3,1)→(2,1) Tally, sting the manufactured window. Isolate **or** sit (0,4) is a complete answer.

TACTICAL_PLAN:

- Turn 1: Turner inverts only if two hostiles sit Score pairs; else Frosts. Sipper Sips if leftover sum === 4 unequal and leftover AP ≥ 1; else Strikes. Tally Stinger lurks at 3 and commits when leftover sum === 3 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround. Blackboard: `plannedSipTarget` so Sip and Sting agree on the manufactured Tally body.

SYNERGY:

- Invert two purses, then sip (3,1)→(2,1) **Tally**, then sting the manufactured window. Wave 16 Purse Tally standing on **two** purses **plus** a leftover-sum rewrite that **hands the fight to a Wave 16 sting**. Combination, not a new monster. Cross-wave: Score Sip is the factory; Tally Sting is the consumer.

PLAYER_THREAT:

- High if you Dual Keep (3,1) on **you and a wisp**. Spike is one 18 after a sip you did not ask for. Recoverable: isolate, sit (0,4), sit 2/2, dump a pool before Sip.

COUNTERPLAY:

- Isolate (one body). Sit (0,4) — Sip fizzles; Tally Sting also fizzles (leftover-sum 4). Dual Keep 2/2 (neither Score Sip nor Tally Sting fires). Spend leftover AP before Sip. Kill the Sipper (glass). The Tally Stinger without leftover-sum 3 is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- ≥ 2 walk-offs from wherever Sting can land.

AI_REQUIREMENTS:

- Turner: controller; skip double-equal / pack size < 2; ELITE prefer Score pairs so Sip still has a window.
- Sipper: flanker; skip leftover AP = 0; never Watch Sip / Tally Sip the same turn.
- Tally Stinger: flanker; skip if leftover sum ≠ 3 unless 10 still kills; never Score Sting on this body (PAIR bans).
- Soph 4–6. `groupTactics` on. Blackboard: `plannedSipTarget`.

VARIANTS:

- `FSN-PURSE-SCORE/NO-TURN` — BRIGADE-shaped CADRE if Duel Turn id is not ready; keep Sip + Tally Sting only if the player already sits leftover-sum 4 unequal (weight ×2). Still never Score-Sip+Tally-Sip PAIR.
- `FSN-DUEL-SCORE` remains the Score-stays-Score BRIGADE; `FSN-PURSE-TALLY` remains the one-hostile invert BRIGADE; do not merge ids.

STATUS: PROPOSED

---

### FSN-SCORE-HOLD

FORMATION_ID: `FSN-SCORE-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-SCORE-HOLD` — `knight` **without** heal / proposed `score_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-SCORE` — `knight` **without** heal / proposed `must_scorer` — pack median — tools-until leftover-sum===4 unequal **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-SCORE-HOOD` junior **or** omit — if present, skip if leftover sum already ≠ 4 or tied

VARIANT_RULES:

- Unlock after (`FSN-SCORE-SIP` or `FSN-FILE-HEXA`) **and** a leader-boost CADRE. Wave 17 “Score Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Score Hold + Must Score** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP + leftover MP === 4 AND unequal; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-SCORE-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Score Hold: cannot spend walk MP while leftover AP + leftover MP === 4 AND unequal. Spells stay legal. Spend one pool so the sum leaves 4 **or** Dual Keep 2/2 **or** dump to leftover-sum 3 **or** dump both to walk. Prefer (0,4) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- Must Score: remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 4 AND unequal **and this spell spends last AP**. Strike stays legal.
- Together: Dual Keep (3,1) cannot walk **and** cannot Inferno unless last AP. Dual Keep 2/2 peels Hold (not leftover-sum 4 unequal) but does **not** peel Must unless they also spend last AP on Strike. Dump leftover to leftover-sum 3 peels Hold (Tally Hold’s window, not this one). Dump leftover to 0/0 peels Hold. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover sum === 4 AND unequal; skip if already 2/2 or leftover-sum 3 or 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-sum-4-unequal **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover so the sum leaves 4, Dual Keep 2/2, dump to leftover-sum 3, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-sum-4-unequal threat in this drop. Still turn-based. Failure is Dual Keep (0,4) to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after leaving leftover-sum 4 unequal **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so the sum leaves 4 (Hold peels). Dual Keep 2/2 (Hold peels; Must needs last AP on Strike). Dump to leftover-sum 3 (Hold peels; Tally Hold is a different COURT). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover sum ≠ 4 or tied; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold / Poise Hold / Tally Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if leftover sum ≠ 4 or tied; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if leftover sum already ≠ 4 or tied.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-SCORE-HOLD/LANE` — BRIGADE-shaped: Hold + Must Score + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-SCORE-HOLD/NO-HOOD` — COURT of three.
- `FSN-SCORE-HOLD/HENDECA` — COURT **Hendeca Plug**: replace this id’s members with `ROLE-HENDECA` + `ROLE-SCORE-SILL` + `ROLE-FILE-STRIDE`. Stretched-plus corridor seal, tax a neighbor at turn start, lock the next walk to the file. **Skip until remaining cap ≥ 11** (live cap 2). Burst the 11 HP. Walk a far **diagonal** (the designed counter vs Nine Span’s square). Sit on a cell so the place fizzles. Swap around the plus. `summonAI === "hendecaspan"` required. Every cell occupied. **No diagonal cells.** Do not also roll a second post. Needs a free stretched plus plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 11. Weight 0 on maps with no free 11-cell stretched plus (solvability). **Never PAIR Hendeca + Dec / Nine / Score Post / File Stride as a two-body.**
- `FSN-SCORE-HOLD/BOUNCE` — COURT **Bounce Score**: replace Hold + Must + Warden with `ROLE-SCORE-BOUNCE` + `ROLE-MUST-SCORE` + `fuse_binder`. Two leftover-sum===4 unequal bodies, bounce 12+12 onto the wick. **Never PAIR Score Bounce with Tally / Poise / Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-TALLY-HOLD/BOUNCE` **or** `FSN-SCORE-SIP`. Missing second leftover-sum-4-unequal flag → 12 only. Player keeps leftover sum ≠ 4 **or** a tie on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-SCORE-HOLD/KENNEL` — COURT **Spike Kennel**: replace Hold + Must + Hood with `ROLE-SPIKE-CUT` + `ROLE-SUMMON-RANK` + `ROLE-SUMMON-PLATE`. Threshold poke near spikes, then tax pet walks off rank **or** plate the next hit — **never PAIR Rank + Plate on one BASE kit**; the COURT is why both pet verbs exist, with a third peeler (Cut). Unlock after `FSN-TIED-PORTAL` **or** `FSN-TALLY-HOLD/KENNEL`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot walk off-rank for AP). Cap one kennel engine. On-rank walks are free of the rank tax. Hit the summoner (Plate does not cover the owner). Twin Gate pads do **not** count as spikes. Drop this variant if `summonAI` is empty. Map needs spike occupancy in Chebyshev 6 of a legal floor.
- `FSN-TALLY-HOLD` remains the leftover-sum===3 **and** last-AP COURT; this id is leftover **sum === 4 AND unequal**.
- `FSN-TALLY-HOLD/DEC` remains the 10-cell 2×5 COURT; `/HENDECA` is the 11-cell stretched-plus COURT.
- `FSN-POISE-HOLD/NINE` remains the 9-cell solid COURT.
- `FSN-SCORE-SIP` / `FSN-FILE-HEXA` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–17 still stand. This drop **meshes**; it does not replace.

```
PAIR:    SCORE-STEP         SCORE-SIP          FILE-HEXA          LAVA-FILE
              \\                 |                   |                  /
CELL:     SCORE-GATE        STRIKE-DRY         SHOCK-EVEN         WATCH-ODD
              \\                 |                   |                  /
BRIGADE:  SCORE-QUIET       LEAN-RISE          DUEL-SCORE         SCORE-CHOIR
              \\                 |                   |                  /
CADRE:    SNUFF-VERSE       STILL-BRACE        PURSE-SCORE
              \\                 |                  /
COURT:                    SCORE-HOLD    SCORE-HOLD/HENDECA    SCORE-HOLD/BOUNCE    SCORE-HOLD/KENNEL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-SCORE-STEP` | `FSN-TALLY-STEP` **or** `FSN-POISE-STEP` |
| `FSN-SCORE-SIP` | `FSN-TALLY-SIP` **or** `FSN-SCORE-STEP` |
| `FSN-FILE-HEXA` | `FSN-RANK-PENTA` **or** `FSN-ORTH-TRI` |
| `FSN-LAVA-FILE` | `FSN-SPIKE-SCREEN` **or** `FSN-BRICK-WAKE` |
| `FSN-SCORE-GATE` | `FSN-TALLY-GATE` **or** `FSN-SCORE-SIP` |
| `FSN-STRIKE-DRY` | `FSN-SWAP-BRICK` **or** `FSN-SPENT-FULL` |
| `FSN-SHOCK-EVEN` | `FSN-MIRE-FILE` **or** `FSN-TALLY-SIP` |
| `FSN-WATCH-ODD` | `FSN-WATCH-BANK` **or** walked into Hold Ground / Far Watch |
| `FSN-SCORE-CHOIR` | `FSN-TALLY-CHOIR` **or** `FSN-SCORE-STEP` |
| `FSN-LEAN-RISE` | `FSN-PAIR-DRY` **or** `FSN-PRIME-TAX` |
| `FSN-SCORE-QUIET` | `FSN-SCORE-STEP` + (`FSN-TALLY-QUIET` or `FSN-POISE-QUIET`) |
| `FSN-DUEL-SCORE` | `FSN-SCORE-STEP` + `FSN-SCORE-SIP` |
| `FSN-SNUFF-VERSE` | `FSN-PRIME-TAX` **or** `FSN-SCORE-CHOIR` |
| `FSN-STILL-BRACE` | `FSN-STRIKE-DRY` **or** `FSN-WATCH-BANK` |
| `FSN-PURSE-SCORE` | `FSN-DUEL-SCORE` **or** `FSN-PURSE-TALLY` |
| `FSN-SCORE-HOLD` | (`FSN-SCORE-SIP` or `FSN-FILE-HEXA`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 18 packs (not this drop)

Wave 18 families do **not** exist yet. Same-day 2026-10-25 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-25.md`, open as PR #1063) and SDE Wave 16 unique CORE (`spell-ring-stride` … `spell-leap-fold`, PR #1017, **except** Pack Orth / Leap Fold unless a later boss sheet claims them) stay Wave **18** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 17 sheets.

Held verbs (do not FSN this drop): Stave Mend (both leftover AP + leftover MP **=== 5**), Cadence Dock (remaining `n===2` → `0`), Dodeca Span (axis-aligned 3×4 twelve; skip until remaining cap ≥ 12; live cap is 2), Hymn Turn (invert leftover AP↔MP on **two allies**, caster stays), Stave Hood / Stave Sting / Stave Step / Stave Sill / Stave Hold / Stave Lend / Stave Sip / Stave Post / Stave Bounce / Must Stave / Verse Stave, Court Dock, Ring Stride, Hepta Oath, Rime Reel, Rank Bite, Last Mark, Dual Plate, Rift Skip, Fresh Sting, Summon File, Prime Gift (SDE #1017 leftover **exactly 1/1**), Cadence Cap (SDE #1017 remaining `n>2` → `2`), Gait Toll, Brick Hold, Watch Drain, Even Gait, Rime Cut, Cast Plate, Pack Orth, Leap Fold. Stave Mend is **both-body leftover sum === 5** — Dual Keep max surviving leftover is **2/2** (sum 4); Dual Keep **cannot** manufacture sum 5. Do **not** pack `score_mender` with a future `stave_mender` as a teaching pair. Do **not** mint `cadence_docker` / `cadence_floorer` / `stave_mender` / `dodeca_prelate` this drop.

Do **not** pack `score_holder` with `must_scorer` as a teaching pair (Wave 17 rule). `FSN-SCORE-SIP` stays the leftover-sum-4-unequal poke lesson; `FSN-SCORE-HOLD` stays the walk-until leftover-sum===4 unequal **and** last-AP COURT.

Do **not** pack `score_mender` with `lean_gifter` as a teaching pair. `FSN-SCORE-STEP` stays the both-bodies leftover-sum===4 unequal lesson; `FSN-LEAN-RISE` stays the leftover-AP=0 / MP≥1 BRIGADE. Tally Mend stays leftover **AP + MP === 3** on **both** bodies (`FSN-TALLY-STEP`). Poise Mend stays leftover **AP === MP ≥ 1** on **both** bodies (`FSN-POISE-STEP`). Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`).

Do **not** pack `score_mender` with `tally_mender` / `poise_mender` / `gaunt_mender` / `dry_gaiter` / `dry_mender`. `FSN-TALLY-STEP` stays leftover-sum===3; `FSN-POISE-STEP` stays leftover-tied-≥1; `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-PAIR-DRY` stays leftover-AP=0; this drop owns leftover **AP + MP === 4 AND unequal**. **0 = 0 does not fire. 2 = 2 does not fire. 3 = 0 does not fire.**

Do **not** pack `cadence_snuffer` with `cadence_riser` as a teaching pair. `FSN-LEAN-RISE` stays remaining `1→2`; `FSN-SNUFF-VERSE` stays remaining `1→0`. Cadence Prime stays remaining `0→1` (`FSN-PRIME-TAX`). Cadence Floor stays SDE #906.

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend. Do **not** clone Equal Gift as Lean Gift. Cadence Floor stays SDE #906. Cadence Prime stays drop 17. Same-day SDE Wave 16 unique CORE / Wave 17 SPELL_PROPOSALS stay Wave **18** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–17, plus Wave 17 verbs in this order (from elite-evolution §7):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-FILE-HEXA` band 0 can ship among the first** once family HP survives battle start. `FSN-SCORE-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Score Mend / Lean Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **Strike originating on a painted cell**, **`forcedMovedThisTurn`** / `lastForcedMoveDir` / **caster-authored** force bit (force families still wait; this drop adds **zero** new force-gated CORE). Dual Keep leftover **is** leftover. Dual Keep 2/2 is Poise, not Score. Dual Keep leftover-sum 3 is Tally, not Score. Dual Keep leftover-sum 4 unequal is Score.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Score Step occupancy dests (not `isSwap`). Lava Reel = tenth attract dest flavor (toward, not onto, a world portal). Brick Brace = barrier-adjacent miss (not unit bash, not Brick Step, not Brick Nudge); destroy-the-barrier skip.
6. `inferSummonArchetype` gains `hendecaspan` and `scorepost` (and still needs `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–16). Raise or gate `ENEMY_SUMMON_CAP` before Hendeca Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Score Lend). **`FSN-SCORE-QUIET` and `FSN-SCORE-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-SCORE-STEP` / `FSN-LEAN-RISE` / `FSN-DUEL-SCORE` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Score Hold while leftover AP + leftover MP === 4 AND unequal. Must Score / Verse Score / Hexa Oath / File Stride as refuse-until. Score Sill start-turn leftover-sum-4-unequal occupy (paint stays). Strike Mark Strike-from occupy (consume; walk-on free; spell-from free). Score Post leftover-sum-4-unequal occupy. Dry Plate leftover-MP=0. Even Sting leftover-AP even ≥ 2. Odd Gait leftover-MP-odd. Score Hood consume-before-damage. Duel Turn two-hostile leftover invert. Cadence Rise remaining-1→2. Cadence Snuff remaining-1→0. Watch Root leftover-MP dump on snap. Brick Brace dest occupancy skip (no barrier → skip).
9. Summoner cooldown fall-through (hendeca / scorepost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT hendeca sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** ship Cadence Prime as a family CORE (drop 17 owns it). Do **not** mint SDE Wave 16 unique CORE / Wave 17 SPELL_PROPOSALS (Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn) as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-SCORE-STEP`, `FSN-SCORE-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP + leftover MP === 4 AND unequal; `0 = 0` does not fire; `2 = 2` does not fire; `3 = 0` does not fire; Score Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-SCORE-SIP`, `FSN-SCORE-GATE` | leftover-AP + leftover-MP reads; Score Sting leftover-sum===4 unequal; Sip leftover-sum-4-unequal **and** leftover AP ≥ 1 ((0,4) fizzles; (3,1)→(2,1) manufactures Tally); Score Post leftover-sum-4-unequal occupy / walk-safe / dump-safe / 2/2-safe / leftover-sum-3-safe; Score Sill start-turn leftover-sum-4-unequal, paint stays; two different tiles; `summonAI === "scorepost"` |
| `FSN-FILE-HEXA` | File Stride same-file dest; Hexa Oath exact 6; Strike remains legal; blink does not pay; a legal same-file floor **and** a tile at Chebyshev 6 exist |
| `FSN-LAVA-FILE` | tenth `applyAttract` dest (lava occupancy); dest is not the portal; map has lava in 6; File Bite share-file-only occupancy; never File Stride on the same PAIR |
| `FSN-STRIKE-DRY` | Strike-from-cell writer; walk-on free; spell-from free; leftover-MP=0 miss; leftover MP ≥ 1 lands and charge stays; never Mark+Goad as PAIR (`/GOAD` is the 3-body) |
| `FSN-SHOCK-EVEN` | 1-tile shock enter-tax skip; length ≥ 2 pays; leftover-AP even ≥ 2 poke; leftover AP 0 excluded; one clean aisle; map has a shock cell **or** a legal flank paint |
| `FSN-WATCH-ODD` | leftover-MP **dump** on overwatch snap; still deals; never steal (that is Watch Sip); never bank leftover AP (that is Watch Bank); leftover-MP-odd poke; never Root+Gun as PAIR |
| `FSN-SCORE-CHOIR` | `lastResolvedSpellId`; Score Mend leftover-sum===4 unequal on **both** bodies; Verse Score leftover-sum-4-unequal peel (`0 = 0` does not; `2 = 2` does not; `3 = 0` does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-LEAN-RISE` | leftover-AP + leftover-MP on **target** for Lean Gift (AP=0 and MP≥1); remaining `n===1` → `2`; Dual Keep AP bank destroys Lean Gift; never Rise+Snuff as PAIR; never Floor / Prime / Dock |
| `FSN-DUEL-SCORE` | two-hostile leftover AP↔MP invert; sum invariant; equal leftover is a no-op; never Purse Turn / Bar Cross PAIR |
| `FSN-SNUFF-VERSE` | remaining `n===1` → `0`; `lastResolvedSpellId`; leftover-sum===4 unequal peels Verse; never Rise / Prime / Floor the same turn; never Verse-Score+Scribe as PAIR |
| `FSN-STILL-BRACE` | leftover-MP=0 next-spell +1 AP; Brick Brace barrier-adjacent miss; destroy-barrier skip; turret AI (`mp: 0`, no path); never Brace+Step PAIR; never Toll+Scribe PAIR |
| `FSN-PURSE-SCORE` | two-hostile invert **then** Score Sip manufactures Tally **then** Tally Sting; (0,4) fizzles Sip; never Score-Sip+Tally-Sip PAIR; never Score-Sting+Tally-Sting PAIR |
| `FSN-SCORE-HOLD` | Score Hold until leftover AP + leftover MP === 4 AND unequal; Must Score leftover-sum-4-unequal **and** last-AP tool-lock; never Root; spend 1 leftover so the sum leaves 4 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must |
| `FSN-SCORE-HOLD/HENDECA` | `summonAI === "hendecaspan"` **and** remaining cap ≥ 11 (live cap 2 → skip); stretched plus, every cell occupied, **no diagonal cells**; a diagonal walk-off remains |

---

## Sources (line-accurate, 2026-10-26)

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
- Wave 17 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-25.md` (PR #1073) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-24.md` (PR #1011); leftover SDE Wave 15 unique CORE in PR #962
- Drop 17: `docs/design/ENEMY_FORMATIONS_2026-10-25.md` (PR #1075)


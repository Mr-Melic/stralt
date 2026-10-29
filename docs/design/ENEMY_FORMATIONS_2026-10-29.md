# Enemy synergy and formation catalog (drop 21)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-29  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–20 already taught the seven pairing words and Waves 1–19 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 20 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-28.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-28.md) (open as PR #1248) and deferred by drop 20 (PR #1237): Septet Choir, Tetradeca Plug, Hook Nona, Mill Hook, Idle Thin, Brier Wide, Wide Quad, Even Brick, Watch Prime, Mill Kennel, Feud Septet, Quarte Verse, Septet Quiet, Purse Septet, Septet Gate, Bounce Septet, Septet Hold File, Lend Hood, Quad Quarte, Thin Idle.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825), [`ENEMY_FORMATIONS_2026-10-22.md`](./ENEMY_FORMATIONS_2026-10-22.md) (drop 14 — open as PR #897), [`ENEMY_FORMATIONS_2026-10-23.md`](./ENEMY_FORMATIONS_2026-10-23.md) (drop 15 — open as PR #956), [`ENEMY_FORMATIONS_2026-10-24.md`](./ENEMY_FORMATIONS_2026-10-24.md) (drop 16 — open as PR #1005), [`ENEMY_FORMATIONS_2026-10-25.md`](./ENEMY_FORMATIONS_2026-10-25.md) (drop 17 — open as PR #1075), [`ENEMY_FORMATIONS_2026-10-26.md`](./ENEMY_FORMATIONS_2026-10-26.md) (drop 18 — open as PR #1134), [`ENEMY_FORMATIONS_2026-10-27.md`](./ENEMY_FORMATIONS_2026-10-27.md) (drop 19 — open as PR #1176), [`ENEMY_FORMATIONS_2026-10-28.md`](./ENEMY_FORMATIONS_2026-10-28.md) (drop 20 — open as PR #1237). Family sheets: PR #1248. Spell verbs: Wave 19 tactical ids in PR #1177 (`spell-septet-mend` … `spell-court-quarte`, **except** Court Quarte) plus leftover SDE Wave 18 unique CORE (`spell-hook-stride` … `spell-hook-fold`, **except** Pack Hook / Hook Fold). Cadence Floor stays SDE #906. Cadence Prime stays drop 17 (`FSN-PRIME-TAX`). Cadence Rise / Cadence Snuff stay drop 18. Cadence Cap / Cadence Dock stay drop 19. Cadence Tern / Cadence Tierce stay drop 20. Cadence Quad / Cadence Quarte are **this** drop.

**Hard rules (Wave 20 pack law — plus every older law still stands):**

- Do **not** pack `septet_mender` with `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `wide_gifter` as PAIR / `shove_gifter` / `drift_gifter` / `dry_gaiter` / `dry_mender` / `still_mender` / `still_gifter` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (both leftover **AP + MP === 7** vs leftover **AP + MP === 6 AND unequal** vs leftover **AP + MP === 5** vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover-**both 0** vs **target**-tied ≥ 1 vs leftover **AP=0 and MP≥1** vs leftover **exactly 1/1** vs leftover **AP ≥ 2 AND MP = 0** vs leftover **AP ≥ 2 AND MP ≥ 1** vs **this-caster** force vs **anyone’s** force vs leftover-**MP**=0 vs leftover-**AP**=0 vs caster-walk-spent=0 vs **target**-walk-spent=0 vs dual-force vs dual-walk vs leftover-cross vs unconditional). `FSN-SESTET-STEP` / `FSN-STAVE-STEP` / `FSN-SCORE-STEP` / `FSN-TALLY-STEP` / `FSN-POISE-STEP` / `FSN-GAUNT-STEP` stay theirs. `FSN-SEPTET-STEP` owns leftover-**sum===7** heal. Dual Keep leftover **is** leftover: 2/2 **enables Poise and Dual Plate and Wide Gift and is not Septet**; 1/1 **enables Poise and Prime Gift / Prime Plate / Prime Gait and is not Septet**; (3,1) / (1,3) / (4,0) / (0,4) **enables Score**; (2,1) / (1,2) / (3,0) / (0,3) **enables Tally**; Dual Keep **cannot** sit on sum 5 (Stave) **or** sum 6 (Sestet) **or** sum 7 (Septet); Dual Keep 2/0 **can** open Gait Gift; Dual Keep 1/0 **opens Thin Gait / Thin Plate**. Stave Lend (3,2)→(4,3) **manufactures Septet**. Sestet Lend (4,2)→(5,3) **manufactures Septet**. Septet Sip (4,3)→(3,3) **manufactures Poise**; other successful sips **manufacture Sestet**. `leftover AP = 0` and `leftover MP = 0` is **not** a Septet window. `2 = 2` is **not** a Septet window. `3 = 3` is **Poise, not Septet**. `3 = 2` is **Stave, not Septet**. `3 = 1` is **Score, not Septet**. `3 = 0` is **Tally, not Septet**. `1 = 1` is **Prime, not Septet**. `4 = 2` is **Sestet, not Septet**.
- Do **not** pack `cadence_quarterer` with `cadence_quadder` as PAIR / `cadence_tiercer` / `cadence_terner` / `cadence_docker` / `cadence_capper` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_swapper` / `cadence_lagger` / `cadence_staller` / `cadence_thief` / `cadence_rester` / `cadence_imprinter` / `cadence_halver` / `cadence_gracer` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` / `cadence_pinner` as a PAIR (remaining `n===4` → `0` vs `n>4` → `4` vs `n===3` → `0` vs `n>3` → `3` vs `n===2` → `0` vs `n>2` → `2` vs `n===1` → `0` vs `n===1` → `2` vs `n===0` → `1` vs full remaining-CD **map trade** vs `n>0` → `n+2` vs +1 all vs steal vs skip-own-tick vs copy matching vs ÷2 vs next-own skip CD vs ally-all→0 vs ×2 vs −1 vs freeze-one). `FSN-TIERCE-VERSE` / `FSN-GAIT-TERN` / `FSN-DOCK-VERSE` / `FSN-PRIME-CAP` / `FSN-SNUFF-VERSE` / `FSN-LEAN-RISE` / `FSN-PRIME-TAX` stay theirs. Cadence Floor stays SDE #906 — do **not** mint `cadence_floorer`. Cadence Prime stays drop 17. Cadence Rise / Cadence Snuff stay drop 18. Cadence Cap / Cadence Dock stay drop 19. Cadence Tern / Cadence Tierce stay drop 20. Cadence Quint (`n>5` → `5`) stays Wave **21** family CORE (SDE #1198) — do **not** mint `cadence_quinter`. **Never PAIR Quad + Quarte.**
- Do **not** pack `tetradeca_prelate` with `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` / `dec_prelate` / `nine_prelate` / `oct_prelate` / `sept_prelate` / `six_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `gaunt_prelate` / `poise_prelate` / `tally_prelate` / `score_prelate` / `stave_prelate` / `sestet_prelate` / `septet_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Tetradeca counts as **14**. Every cell of the axis-aligned 2×7 is **occupied**. Click is the **cell of the rectangle closest to the caster** (Dec / Dodeca rule, **not** Trideca / Hendeca’s center). Skip until remaining `ENEMY_SUMMON_CAP` ≥ 14. Live cap is **2** — skip `FSN-SEPTET-HOLD/TETRADECA`. `FSN-SESTET-HOLD/TRIDECA` stays the 13-cell plus COURT. `FSN-STAVE-HOLD/DODECA` stays the 12-cell 3×4 COURT.
- Do **not** pack `septet_hooder` with `sestet_hooder` / `stave_hooder` / `score_hooder` / `tally_hooder` / `poise_hooder` / `even_hooder` / `odd_hooder` / `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `dry_plater` / `dual_plater` / `prime_plater` / `thin_plater` as PAIR / `idle_plater` as PAIR (sum===7 any-range miss vs sum===6 unequal miss vs sum===5 miss vs sum===4 unequal miss vs sum===3 miss vs tied-≥1 miss vs even-Chebyshev vs odd vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss vs leftover-MP miss vs leftover-**AP** miss vs leftover-AP **odd** miss vs leftover-**MP=0** miss vs leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss vs leftover **1/1** miss vs leftover **1/0** miss vs leftover-MP-equals-max miss). `FSN-SESTET-QUIET/LEND` / `FSN-SPAWN-PRIME` stay theirs. `FSN-IDLE-THIN` owns Thin Plate. `FSN-SEPTET-QUIET/LEND` owns Lend Hood.
- Do **not** pack `septet_stinger` with `sestet_stinger` / `stave_stinger` / `score_stinger` / `tally_stinger` / `poise_stinger` / `gaunt_stinger` / `dry_stinger` / `lean_stinger` / `damp_stinger` / `ready_stinger` / `full_stinger` / `odd_stinger` / `even_stinger` / `fresh_stinger` / `capped_stinger` / `wide_stinger` as PAIR / `prime_gaiter` as PAIR / `tied_gaiter` / `lone_gaiter` / `pair_gaiter` / `odd_gaiter` / `even_gaiter` / `thin_gaiter` as PAIR (leftover **AP + MP === 7** poke vs leftover **AP + MP === 6 AND unequal** vs leftover **AP + MP === 5** vs leftover **AP + MP === 4 AND unequal** vs leftover **AP + MP === 3** vs leftover **AP === MP ≥ 1** vs leftover **AP = 0 and leftover MP = 0** vs leftover AP = 0 vs leftover AP = 0 **and** MP ≥ 1 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover **AP ≥ 3** vs leftover **AP odd** vs leftover **AP even ≥ 2** vs leftover **AP equals max AP** vs leftover MP **equals max MP** vs leftover **AP ≥ 2 AND MP ≥ 1** vs leftover **AP===1 AND MP===1** vs leftover AP **and** MP **exactly 2** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **MP odd** vs leftover **MP even ≥ 2** vs leftover **AP===1 AND MP===0**). `FSN-SESTET-SIP` / `FSN-WATCH-THIN` / `FSN-SLIDE-CAP` stay theirs. `FSN-SEPTET-SIP` owns leftover-sum-7 poke. `FSN-BRIER-WIDE` owns leftover-AP≥2/MP≥1 poke. `FSN-WATCH-PRIME` owns leftover-1/1 poke.
- Do **not** pack `septet_stepper` with `sestet_stepper` / `stave_stepper` / `score_stepper` / `tally_stepper` / `poise_stepper` / `gaunt_stepper` / `parched_stepper` / `home_stepper` / `heave_stepper` / `ally_stepper` / `brick_stepper` as PAIR / `hook_chaplain` / `cover_squire` (join leftover-**sum===7** ally vs leftover-**sum===6 unequal** vs leftover-**sum===5** vs leftover-**sum===4 unequal** vs leftover-**sum===3** vs leftover-**AP===MP≥1** vs leftover-**both 0** vs leftover-**MP**=0 vs ungated vs force-moved ally vs they-land-next-to-caster vs **through-barrier peek** vs line rescue vs cover). BRIGADE `FSN-SEPTET-QUIET` is the three-body lesson. `FSN-SESTET-STEP` / `FSN-STAVE-STEP` stay theirs.
- Do **not** pack `septet_siller` with `sestet_siller` / `stave_siller` / `score_siller` / `tally_siller` / `poise_siller` / `gaunt_siller` / `wake_marker` / `idle_marker` as PAIR / `parched_siller` / `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `dwell_marker` / `shove_marker` / `swap_marker` / `strike_marker` / `last_marker` / `summon_marker` as a PAIR (start-turn occupy **and leftover AP + leftover MP === 7**, paint stays vs start-turn leftover-sum===6 unequal vs start-turn leftover-sum===5 vs start-turn leftover-sum===4 unequal vs start-turn leftover-sum===3 vs start-turn leftover AP === MP ≥ 1 vs start-turn leftover-both-0 vs start-turn occupy **any leftover**, consume vs **end-turn leftover MP === max**, consume vs tile forbids walk MP vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs end-turn occupy vs **force-move landing** vs **teleport landing** vs **Strike-from** vs **last leftover AP spent on the cell** vs **summon spawn onto**). `FSN-SESTET-GATE` / `FSN-SPAWN-PRIME` stay theirs. `FSN-IDLE-THIN` owns Idle Mark. `FSN-SEPTET-GATE` is the leftover-sum-7 post.
- Do **not** pack `septet_holder` with `sestet_holder` / `stave_holder` / `score_holder` / `tally_holder` / `poise_holder` / `odd_holder` / `dry_holder` / `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` / `gaunt_holder` / `brick_holder` as PAIR / `must_septeter` as PAIR / `must_sesteter` as PAIR (cannot walk while leftover AP + leftover MP === 7 vs while leftover-sum===6 unequal vs while leftover-sum===5 vs while leftover-sum===4 unequal vs while leftover-sum===3 vs while leftover AP === MP ≥ 1 vs while leftover AP is **odd** vs until leftover **AP = 0** vs until leftover **MP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root vs leftover-MP=0 **and** last AP vs **barrier adjacent** vs tools-until leftover-sum===7 **and** last AP vs tools-until leftover-sum===6 unequal **and** last AP). COURT `FSN-SESTET-HOLD` stays leftover-sum===6 unequal peel. `FSN-SEPTET-HOLD` is the 3-body. **Never PAIR Septet Hold + Must Septet.**
- Do **not** pack `septet_lender` with `sestet_lender` / `stave_lender` / `score_lender` / `tally_lender` / `poise_lender` / `gaunt_lender` / `lean_lender` / `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 AP **and** +1 MP if leftover **sum === 7** — **exits** to sum 9 vs +1/+1 if leftover **sum === 6 AND unequal** — **exits** to 8 vs +1/+1 if leftover **sum === 5** — **exits** to 7 **which is this family’s window** vs +1/+1 if leftover **sum === 4 AND unequal** — **exits** to 6 vs +1/+1 if leftover **sum === 3** — **exits** to 5 vs +1/+1 if leftover **AP === MP ≥ 1** — **keeps** the tie vs +1/+1 if leftover **both 0** vs +1 MP if leftover AP = 0 vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-SESTET-QUIET/LEND` stays theirs. `FSN-SEPTET-QUIET/LEND` is the 3-body. Stave Lend **manufactures Septet**. Sestet Lend **also** manufactures Septet.
- Do **not** pack `septet_sipper` with `sestet_sipper` / `stave_sipper` / `score_sipper` / `tally_sipper` / `poise_sipper` / `bare_sipper` / `parched_sipper` / `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` / `watch_sipper` as a PAIR (steal leftover **AP** iff leftover **sum === 7** and leftover AP ≥ 1 vs steal leftover **AP** iff leftover **sum === 6 AND unequal** vs steal leftover **AP** iff leftover **sum === 5** vs steal leftover **AP** iff leftover **sum === 4 AND unequal** vs steal leftover **AP** iff leftover **sum === 3** vs steal leftover **AP** iff leftover **AP === MP ≥ 1** vs steal leftover **AP** iff leftover **MP = 0** vs steal leftover **MP** iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip vs **overwatch snap** steal leftover **AP**). `FSN-SESTET-SIP` stays theirs. (4,3)→(3,3) **Poise**. Other successful sips **manufacture Sestet**. (0,7) fizzles.
- Do **not** pack `septet_prelate` with `sestet_prelate` / `stave_prelate` / `score_prelate` / `tally_prelate` / `poise_prelate` / `gaunt_prelate` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `dwell_marker` / `ingress_marker` / `wake_marker` / `idle_marker` as PAIR / `bait_prelate` / `tetradeca_prelate` / `trideca_prelate` / `dodeca_prelate` / `hendeca_prelate` as a PAIR (end-turn occupy **and leftover AP + leftover MP === 7** detonate vs leftover-sum===6 unequal occupy vs leftover-sum===5 occupy vs leftover-sum===4 unequal occupy vs leftover-sum===3 occupy vs leftover-AP===MP≥1 occupy vs leftover-both-0 occupy vs taunt vs relocate-landing vs leftover-AP=0 occupy vs ungated end-turn occupy vs walk-enter vs start-turn occupy vs **end-turn leftover MP === max** vs bait vs 14-cell occupy vs 13-cell occupy vs 12-cell occupy vs 11-cell occupy). `FSN-SESTET-GATE` stays leftover-sum-6-unequal detonate. `FSN-SEPTET-GATE` is the leftover-sum-7 post.
- Do **not** pack `septet_bouncer` with `sestet_bouncer` / `stave_bouncer` / `score_bouncer` / `tally_bouncer` / `poise_bouncer` / `gaunt_bouncer` / `parched_bouncer` / `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**sum===7** hostile vs leftover-sum===6 unequal bounce vs leftover-sum===5 bounce vs leftover-sum===4 unequal bounce vs leftover-sum===3 bounce vs leftover-tied bounce vs leftover-pair bounce vs leftover-MP=0 bounce vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-SESTET-HOLD/BOUNCE` stays theirs. `FSN-SEPTET-HOLD/BOUNCE` is leftover-sum-7 Bounce Septet, never a two-bounce PAIR.
- Do **not** pack `must_septeter` with `must_sesteter` / `must_staver` / `must_scorer` / `must_tallier` / `must_poiser` / `must_gaunter` / `must_leaner` / `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` / `septet_holder` as a PAIR (non-Strike illegal unless leftover **sum === 7 and this spell spends last AP** vs leftover **sum === 6 AND unequal and last AP** vs leftover **sum === 5 and last AP** vs leftover **sum === 4 AND unequal and last AP** vs leftover **sum === 3 and last AP** vs leftover **AP === MP ≥ 1 and last AP** vs leftover **MP = 0 and last AP** vs leftover MP = 0 only vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile vs walk-until leftover-sum===7). `FSN-SESTET-HOLD` stays theirs.
- Do **not** pack `verse_septeter` with `verse_sesteter` / `verse_staver` / `verse_scorer` / `verse_tallier` / `verse_poiser` / `verse_gaunter` / `verse_leaner` / `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` / `summon_verser` as a PAIR (last-id illegal until leftover **sum === 7** vs until leftover **sum === 6 AND unequal** vs until leftover **sum === 5** vs until leftover **sum === 4 AND unequal** vs until leftover **sum === 3** vs until leftover **AP === MP ≥ 1** vs until leftover **both 0** vs until leftover MP = 0 vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock vs pets pay +1 AP to **recast last id**). `FSN-SESTET-CHOIR` stays theirs. `0 = 0` does **not** peel Verse Septet. `2 = 2` does **not**. `3 = 3` does **not**. `3 = 2` does **not**. `3 = 1` does **not**. `4 = 2` does **not**. `1 = 1` does **not**. Dual Keep **cannot** peel Verse Septet.
- Do **not** pack `hook_warder` with `tern_warder` / `ring_warder` / `file_warder` / `rank_warder` / `knight_warder` / `orth_warder` / `diag_warder` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` / `diag_locksmith` / `rank_lancer` as PAIR / `hook_chaplain` as PAIR / `hook_biter` as PAIR (next walk dest a permutation of **(3,1)** vs Chebyshev **exactly 3, orthogonal only** vs Chebyshev **exactly 2**, knight `(2,1)` **excluded** vs **shares file** vs **shares rank** vs **(2,1)** vs **orthogonal-only any length** vs **requires** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock vs **forbids** diagonal vs linear file charge vs Wave-3 pull vs share-(3,1) bite). `FSN-TERN-OCTA` / `FSN-RING-HEPTA` stay theirs. Extra room `hook_gallery` is **not** this family. `(±3,±1)` / `(±1,±3)` **are** legal. `(3,0)` / `(0,3)` **are not** (Tern). `(2,1)` **is not** (Knight). `(2,2)` **is not** (Ring).
- Do **not** pack `nona_oather` with `octa_oather` / `hepta_oather` / `hexa_oather` / `penta_oather` / `quad_oather` / `tri_oather` / `mid_oather` / `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as PAIR / `nine_prelate` / `oct_prelate` / `sept_prelate` (next spell exact Chebyshev **9** vs exact **8** vs exact **7** vs exact **6** vs exact **5** vs exact **4** vs exact **3** vs exact **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0 vs nine-cell occupy vs eight-cell occupy vs seven-cell occupy). `FSN-TERN-OCTA` leftover oaths stay theirs. Extra room `nona_nave` is **not** this family.
- Do **not** pack `slide_reeler` with `mire_reeler` / `lava_reeler` / `rime_reeler` / `spike_reeler` / `pit_reeler` / `brick_reeler` / `void_reeler` / `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` / `slide_skipper` as PAIR / `slide_cutter` as PAIR / `slide_mason` as PAIR (pull toward **painted conveyor occupancy** vs **painted mire occupancy** vs **lava occupancy** vs **ice occupancy** vs **spike occupancy** vs **pit** vs **barrier** vs void/portal vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity vs 1-tile conveyor skip vs threshold poke near conveyor vs **paints** the conveyor). `FSN-MIRE-DIAG` / `FSN-SLIDE-CAP` stay theirs. Extra room `mill_aisle` is **not** this family. `FSN-SEPTET-HOLD/KENNEL` owns Slide Cut.
- Do **not** pack `hook_biter` with `diag_biter` / `file_biter` / `rank_biter` / `axis_biter` / `screen_biter` / `foe_biter` / `side_biter` / `lone_biter` / `nook_biter` / `field_biter` / `wall_biter` / `axis_cutter` / `hook_warder` as PAIR / `hook_chaplain` as PAIR (share a **(3,1)** vector bonus vs share a **diagonal** `\|dx\|==\|dy\|` vs share **file only** vs share **rank only** vs shares **rank or file with the caster** vs Bresenham **blocked** vs adj-**hostile-to-target** vs adj-**ally** vs isolated from **all** units vs 0 adj **hostiles** vs exactly-one-block vs 0-block vs hug vs next-walk (3,1) vs Wave-3 pull). `FSN-MIRE-DIAG` stays theirs. **Never PAIR Hook Bite + Hook Stride.**
- Do **not** pack `idle_marker` with `strike_marker` / `swap_marker` / `shove_marker` / `cast_marker` / `wake_marker` / `dwell_marker` / `ingress_marker` / `last_marker` / `summon_marker` / `gaunt_siller` / `poise_siller` / `tally_siller` / `score_siller` / `stave_siller` / `sestet_siller` / `septet_siller` / `idle_plater` as PAIR / `gait_wicker` / `fuse_binder` (**end-turn leftover MP equals max** consume vs **Strike originating on the painted cell** vs **teleport landing** vs **force-move landing** vs **spell** confirm vs start-turn occupy consume vs end-turn occupy **any leftover** vs cell-enter vs **last leftover AP spent on the cell** vs **summon spawn onto** vs start-turn leftover-pair vs start-turn tied-≥1 vs start-turn leftover-sum vs start-turn leftover-sum-4-unequal vs start-turn leftover-sum-5 vs start-turn leftover-sum-6-unequal vs start-turn leftover-sum-7 vs leftover-MP-equals-max **miss** vs unit walk-MP wick vs tile bomb). `FSN-SPAWN-PRIME` / `FSN-SESTET-GATE` stay theirs. Extra room `idle_pulpit` is **not** this family. Walk-on is **safe**. Spell-from is **safe**. They must **not walk** (leftover MP stays max).
- Do **not** pack `thin_plater` with `prime_plater` / `dual_plater` / `dry_plater` / `gait_plater` / `spent_plater` / `odd_plater` / `own_plater` / `off_plater` / `idle_plater` as PAIR / `septet_hooder` as PAIR / `sestet_hooder` as PAIR / `thin_gaiter` as PAIR (next hit 0 **while leftover AP === 1 AND leftover MP === 0** vs leftover **1/1** vs leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** vs leftover **MP = 0** vs leftover **MP ≥ 1** vs leftover **AP ≥ 1** vs leftover AP **odd** vs next **own-turn** hit 0 vs next **off-turn** hit 0 vs leftover-MP-equals-max miss vs leftover **sum === 7** vs leftover **sum === 6 unequal** vs leftover **1/0 poke**). `FSN-SPAWN-PRIME` / `FSN-WATCH-THIN` stay theirs. `FSN-IDLE-THIN` is paint + leftover-1/0 miss; `/IDLE` is the 3-body. Dual Keep 1/0 **is** this window.
- Do **not** pack `brier_skipper` with `slide_skipper` / `rift_skipper` / `shock_skipper` / `mire_skipper` / `rime_skipper` / `glyph_skipper` / `cinder_skipper` / `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `slide_mason` as a PAIR (next walk of **pathLength exactly 2** ignores Thorned Ground extra vs 1-tile **conveyor** auto-push skip vs 1-tile **Void Rift** walk-tax skip vs shock enter-tax vs mire enter-tax vs rime leave-tax vs glyph-tax vs cinder vs spike vs lava vs pit vs ghost occupancy vs **paints** the conveyor). `FSN-SLIDE-CAP` / `FSN-RIFT-FRESH` stay theirs. Extra room `brier_nave` is **not** this family. Length ≥ 3 **pays**. Thorned Ground is a **map modifier**, not occupancy.
- Do **not** pack `wide_stinger` with `septet_stinger` / `sestet_stinger` / `fresh_stinger` / `full_stinger` / `even_stinger` / `odd_stinger` / `capped_stinger` / `prime_gaiter` as PAIR / `thin_gaiter` as PAIR / `wide_gifter` as PAIR / `tied_gaiter` / `pair_purser` as PAIR (leftover **AP ≥ 2 AND MP ≥ 1** poke vs leftover-sum===7 vs leftover-sum===6 unequal vs leftover **AP equals max AP** vs leftover AP **≥ 3** vs leftover **AP even ≥ 2** vs leftover AP **odd** vs leftover MP **equals max MP** vs leftover **1/1** vs leftover **1/0** vs leftover **AP≥2/MP≥1 heal** vs leftover AP **and** MP **exactly 2** vs leftover AP **exactly 2**). `FSN-SEPTET-SIP` / `FSN-WATCH-PRIME` stay theirs. Dual Keep 2/2 **is** this window.
- Do **not** pack `hook_taxer` with `summon_orther` as PAIR / `summon_filer` as PAIR / `summon_ranker` as PAIR / `summon_toller` as PAIR / `summon_gaiter` as PAIR / `summon_verser` as PAIR / `summon_caster` as PAIR / `summon_plater` as PAIR / `idle_plater` as PAIR / `walk_toller` / `kennel_siller` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR / `hook_warder` as PAIR / `hook_biter` as PAIR (pets pay **AP** if this turn’s walk **landing** is a **(3,1)** from origin vs pets pay **AP** to **walk diagonal** vs pets pay **AP** to **walk off the summoner’s file** vs pets pay **AP** to **walk off the summoner’s rank** vs pets pay **AP** to start a **walk** vs pets pay **MP** to start a walk vs pets pay **AP** to **recast last id** vs pets pay **AP** to start a **spell** vs pets **next hit 0** vs leftover-MP-equals-max miss vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay vs next-walk (3,1) vs share-(3,1) bite). `FSN-SEPTET-HOLD/KENNEL` is Mill Kennel, never Tax+Plate PAIR. `FSN-SESTET-HOLD/KENNEL` stays Lava Kennel.
- Do **not** pack `wide_gifter` with `septet_mender` / `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `hollow_gifter` / `equal_gifter` / `lean_gifter` / `prime_gifter` / `gait_gifter` / `still_gifter` / `drift_gifter` / `shove_gifter` / `dry_gaiter` / `dry_mender` / `pale_cantor` / `wide_stinger` as PAIR. `FSN-SEPTET-STEP` stays both-bodies leftover-sum===7. `FSN-GAIT-TERN` stays leftover **AP ≥ 2 AND leftover MP = 0**. Wide Gift is leftover **AP ≥ 2 AND leftover MP ≥ 1** on **one** body. Dual Keep 2/2 **is** Wide Gift **and** Poise **and** Dual Plate. Do **not** invent `wide_cantor`.
- Do **not** pack `cadence_quadder` with `cadence_quarterer` as PAIR / `cadence_terner` / `cadence_tiercer` / `cadence_capper` / `cadence_docker` / `cadence_snuffer` / `cadence_riser` / `cadence_primer` / `cadence_thief` / `cadence_lagger` / `cadence_staller` / `cadence_cracker` / `cadence_flusher`. `FSN-WIDE-QUAD` is remaining `n>4→4` plus Wide Gift. `FSN-QUARTE-VERSE` is remaining `4→0` plus Verse Septet. **Never PAIR Quad + Quarte.** Do **not** restamp `floor_precentor` / `quarte_precentor` / `quad_precentor`.
- Do **not** pack `even_toller` with `odd_toller` as PAIR / `gait_toller` / `still_toller` / `cast_toller` / `walk_toller` / `summon_toller` as PAIR / `strike_debter` / `debt_caster` / `spent_taxer` / `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` (next-**walk** +1 AP if leftover **AP is even ≥ 2** vs next-**walk** +1 AP if leftover **AP is odd** vs next-**walk** +1 AP if leftover **MP = 0** vs next-**spell** +1 AP if leftover MP = 0 vs Struck-last-turn next-**spell** +1 vs Wave-7 walk-pool vs pet-walk AP vs Struck-last-turn next-**walk** +1 vs spelled-**last-turn** next-walk +1 vs walked-last-turn next-spell +1 vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-ODD-BRICK` / `FSN-GAIT-BRICK` stay theirs. CADRE `FSN-EVEN-BRICK` is the three-body lesson (Even Toll + Brick Fee + Castellan), never Toll+Scribe PAIR.
- Do **not** pack `brick_feer` with `brick_taxer` / `brick_holder` / `brick_bracer` / `brick_stepper` / `brick_nudger` / `brick_orbiter` / `brick_cracker` / `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` / `watch_feer` as PAIR / `septet_holder` as PAIR / `screen_biter` as PAIR (next **non-Strike spell** +1 AP while adjacent to a **barrier** vs next **walk** +1 AP vs cannot **walk** while adjacent to a **barrier** vs next hit 0 if a **barrier is adjacent** vs step **through** an adjacent barrier vs push adjacent barrier **1 away** vs orbit adjacent empty vs remove vs grow vs slide vs erase vs turret extras vs leftover-sum===7 walk lock vs Bresenham-blocked bite). `FSN-ODD-BRICK` stays theirs. `FSN-EVEN-BRICK` owns the fee, never Fee+Tax PAIR. Brick Fee **does not tax Strike** and **does not forbid** the walk — destroy the barrier and the tax drops; lock **stays** until duration.
- Do **not** pack `watch_binder` with `watch_taxer` / `watch_drainer` / `watch_rooter` / `watch_banker` / `watch_sipper` / `watch_almer` / `watch_lender` / `watch_feer` / `watch_muter` / `pair_binder` as PAIR / `fuse_binder` as PAIR / `glass_sniper` as PAIR (snap **forbids the walker’s next walk** vs snap **taxes the walker’s next spell +1 AP** vs snap **steals 1 leftover MP** vs snap **zeros leftover MP** vs snap **banks** leftover AP vs snap **steals leftover AP** vs snap grants **walker** +1 AP vs grants **watcher** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-WATCH-THIN` / `FSN-WATCH-EVEN` stay theirs. `FSN-WATCH-PRIME/GUN` is Watch Prime Hunt, never Bind+Gun PAIR.
- Do **not** pack `prime_gaiter` with `thin_gaiter` / `even_gaiter` / `odd_gaiter` / `lone_gaiter` / `pair_gaiter` / `wide_stinger` as PAIR / `prime_plater` as PAIR / `prime_gifter` as PAIR / `cadence_primer` as PAIR (leftover **AP === 1 AND leftover MP === 1** poke vs leftover **1/0** vs leftover **MP even and ≥ 2** vs leftover **MP odd** vs leftover MP **exactly 1** vs leftover MP **exactly 2** vs leftover **AP≥2 AND MP≥1** vs leftover **1/1 miss** vs leftover **1/1 heal** vs remaining `0→1`). `FSN-WATCH-THIN` / `FSN-SPAWN-PRIME` stay theirs. Leftover 1/0 is **Thin, not this**. Leftover 2/2 is **Wide Sting / Dual Plate / Wide Gift, not this**. Dual Keep 1/1 **opens** this.
- Do **not** pack `slide_cutter` with `lava_cutter` / `rime_cutter` / `spike_cutter` / `hazard_cutter` / `portal_cutter` / `axis_cutter` / `escort_cutter` / `leash_cutter` / `pet_cutter` / `banner_cutter` / `crown_cutter` / `slide_reeler` as PAIR / `slide_skipper` as PAIR / `null_censor` as PAIR (bonus vs **painted conveyor occupancy** Chebyshev ≤ 2 vs **lava occupancy** vs **ice occupancy** vs **spike occupancy** vs **painted hazard** vs **world portal** vs handler-on-file with a pet vs pet at Chebyshev ≤ 2 vs Wave 8 Short Leash vs bonus on the **pet** vs `isLeader` vs `leader_slayer` grant vs **pulls** toward conveyor vs ignores conveyor auto-push vs Weaken/Expose). `FSN-SESTET-HOLD/KENNEL` / `FSN-MIRE-DIAG` stay theirs. Twin Gate pads do **not** count.
- Do **not** pack `idle_plater` with `thin_plater` as PAIR / `idle_marker` as PAIR / `hook_taxer` as PAIR / `dry_plater` / `prime_plater` / `capped_stinger` as PAIR / `cast_plater` as PAIR / `summon_plater` as PAIR / `brace_chanter` as PAIR / `brood_chanter` as PAIR (next hit 0 **while leftover MP equals max** vs leftover **1/0** miss vs end-turn leftover-MP-equals-max **detonate** vs pet (3,1) landing tax vs leftover **MP = 0** vs leftover **1/1** vs leftover-MP===max **poke** vs target’s next **non-Strike spell** deals 0 vs pets treat the **next hit as 0** vs pets ignore force vs brood overlay). `FSN-IDLE-THIN/IDLE` is Thin Idle, never Plate+Idle PAIR. Identify leftover MP by **bank after this spell’s AP is paid**, never `spell.name`.
- Do **not** pack `feud_turner` with `psalm_turner` as PAIR / `hymn_turner` as PAIR / `duel_turner` as PAIR / `purse_turner` as PAIR / `bar_crosser` as PAIR / `pawn_broker` as PAIR / `dual_keeper` as PAIR (invert leftover AP↔MP on **the caster and one opposite-side hostile**; caster **participates** vs **one same-side non-caster + one hostile**; caster **unchanged** vs **two allies** vs **two hostiles** vs **one** hostile invert vs two-body leftover **cross** vs **tile** swap vs leftover **bank**). CADRE `FSN-PSALM-SESTET` stays the 3-body mixed-side invert with caster unchanged. `FSN-HYMN-STAVE` stays two-**ally**. `FSN-DUEL-SCORE` stays two-hostile. `FSN-FEUD-SEPTET` is the 3-body caster+hostile invert. Choir Hymn is a Wave-1 **heal**. Sum invariant: Septet stays Septet; Sestet stays Sestet.
- Drop 4–20 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two four-flag heals; no two four-flag **tied-≥1** heals; no two four-flag **sum===3** heals; no two four-flag **sum===4 unequal** heals; no two four-flag **sum===5** heals; no two four-flag **sum===6 unequal** heals; no two four-flag **sum===7** heals; no two heal-if-gated CORE as PAIR; no two leftover-equality heals; no two leftover-sum heals; no two leftover-sum-4-unequal heals; no two leftover-sum-5 heals; no two leftover-sum-6-unequal heals; no two leftover-sum-7 heals; no two remaining-1 rewrites as PAIR; no two remaining-2 rewrites as PAIR; no two remaining-3 rewrites as PAIR; no two remaining-4 rewrites as PAIR; no two remaining-n>4 rewrites as PAIR).

Wave 21 families do **not** exist yet. Same-day 2026-10-28 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-28.md`, open as PR #1251: Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn) and SDE Wave 19 unique CORE (`spell-camel-stride` … `spell-camel-fold`, PR #1198, **except** Pack Camel / Camel Fold unless a later boss sheet claims them) stay Wave **21** family CORE. Do **not** mint `FSN-*` ids that require those Wave 21 families in this drop. Cadence Floor is **already owned** by SDE #906. Cadence Prime is **already owned** by drop 17. Cadence Rise / Cadence Snuff are **already owned** by drop 18. Cadence Cap / Cadence Dock are **already owned** by drop 19. Cadence Tern / Cadence Tierce are **already owned** by drop 20. Cadence Quad / Cadence Quarte are **this** drop.

Court Quarte / Pack Hook / Hook Fold / Court Quinte / Pack Camel / Camel Fold stay **boss / closed-class / later family**. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend **or** Sestet Mend **or** Septet Mend (Hollow Gift is **target-only** both-pools; Septet Mend is **both bodies leftover sum === 7**). Do **not** clone Equal Gift as Prime Gift or Gait Gift or Wide Gift (Equal Gift is **target-only** tied ≥ 1; Wide Gift is leftover **AP ≥ 2 AND MP ≥ 1** on **one** body). Do **not** clone Psalm Turn as Feud Turn (Psalm Turn is **one ally and one hostile**, caster stays; Feud Turn is **caster + one hostile**). Do **not** clone Watch Bind as Watch Tax or Watch Drain or Watch Root (Bind **forbids the next walk**; Tax **charges next spell +1 AP**; Drain **steals leftover MP**; Root **zeros leftover MP**). Do **not** clone Hook Bite as Diag Bite or File Bite or Rank Bite (Hook Bite is **(3,1)**; Diag Bite is **diagonal**; File Bite is **file-only**; Rank Bite is **rank-only**). Do **not** clone Thin Plate as Prime Plate or Thin Gait (Thin Plate is leftover **1/0 miss**; Prime Plate is leftover **1/1 miss**; Thin Gait is leftover **1/0 poke**). Do **not** clone Brick Fee as Brick Tax (Fee is a **spell +1 AP**; Tax is a **walk +1 AP**). Do **not** clone Cadence Quarte as Cadence Quad (Quarte **kills** a remaining 4; Quad **writes** remaining >4 to 4 and **leaves** fours). Do **not** clone Idle Mark as Idle Plate (Mark **detonates** the cell; Plate **blanks a hit**).

**Do not spawn Septet Mend / Septet Sting / Septet Step / Septet Sill / Septet Hold / Septet Lend / Septet Sip / Septet Post / Septet Bounce / Must Septet / Verse Septet / Septet Hood / Thin Plate / Wide Sting / Wide Gift / Prime Gait / Even Toll / Idle Plate sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid.** Dual Keep leftover **is** leftover. Sum is integer leftover AP + leftover MP. Equality is integer `===`. Inequality is integer `!==`. Missing field → Septet Mend / Septet Sting / Wide Gift / Feud Turn pay **0** extra or skip (fail closed). Until those writers land, show `FSN-SESTET-STEP` / `FSN-SESTET-SIP` / `FSN-STAVE-STEP` instead of the matching Wave 20 id.

**Do not spawn Verse Septet sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Septet fizzles (fail closed). Forced-move does **not** peel Verse Septet. `0 = 0` does **not** lift. `2 = 2` does **not** lift. `3 = 3` does **not** lift. `3 = 2` does **not** lift. `3 = 1` does **not** lift. `4 = 2` does **not** lift. `1 = 1` does **not** lift. Dual Keep **cannot** lift. Until that writer lands, show `FSN-SESTET-CHOIR` instead of `FSN-SEPTET-CHOIR` / `FSN-QUARTE-VERSE`.

**Do not spawn Idle Mark sheets until an end-turn leftover-MP-equals-max writer snapshots the painted cell.** Walk-on does not arm Idle Mark. Spell-from does not arm Idle Mark. Last leftover AP on the cell does not arm Idle Mark. Strike-from does not arm Idle Mark. Summon spawn onto does not arm Idle Mark. Teleport / Swap / Septet Step / Brick Step do not pay. Until that writer lands, show `FSN-SPAWN-PRIME` instead of `FSN-IDLE-THIN`.

**Do not spawn Tetradeca Plug until `inferSummonArchetype` keys `summonAI === "tetradecaspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 14.** Live cap is 2. Name heuristics stay a bug. Tetradeca fills the stationary-post **and** the multi-cell-system cap (14). Every cell of the 2×7 stays occupied. **Diagonal walk around the bounding box** is the designed counter vs Trideca’s plus and Dodeca’s 3×4. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost/sixspan/gauntpost/octspan/poisepost/ninespan/tallypost/decspan/scorepost/hendecaspan/stavepost/dodecaspan/sestetpost/tridecaspan/septetpost onto that body.

**Do not spawn Septet Post sheets until `inferSummonArchetype` keys `summonAI === "septetpost"` and remaining cap ≥ 1.** End-turn occupy with leftover sum ≠ 7 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Dual Keep 2/2 is **safe** (Poise Post / Dual Plate / Wide Gift’s window). Dual Keep leftover-sum 6 cannot sit. Dual Keep leftover-sum 5 cannot sit. Dual Keep leftover-sum 4 unequal is **safe** (Score Post’s window). Dual Keep leftover-sum 3 is **safe** (Tally Post’s window). Dual Keep 1/1 is **safe**. Only leftover-sum===7 end-turn occupy detonates.

**Septet Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Slide Reel is the **thirteenth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder / Void / Brick / Pit / Spike / Lava / ice / painted mire, then **painted conveyor occupancy**). Dest is **toward**, not onto, a world portal. Brick Fee **does not tax Strike** and **does not forbid** the walk — destroy the barrier and the tax drops; lock **stays** until duration.

Wave 20 adds **zero** facing CORE cards **and zero** new force-gated CORE cards. `currentView` remains an implementation prerequisite for Waves 6–7 glance sheets, not this drop. `forcedMovedThisTurn` remains an implementation prerequisite for Waves 10–16 force sheets, not this drop. Idle Plate fails closed until leftover MP equals max is readable.

---

## Grounding (live, 2026-10-29)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–20. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `tetradecaspan` / `septetpost` / `tridecaspan` / `sestetpost` / `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Septet Step is occupancy dest, **not** `isSwap`. Slide Reel is the thirteenth **cast** caller of attract. Brick Fee is a barrier-adjacent **spell +1 AP**, not `applyPushback` and not Brick Tax / Brick Hold / Brick Brace. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 20 CORE rows stay `mpCost: 0`. Septet Sip / Septet Lend / Feud Turn / Watch Bind / Even Toll / Brick Fee rewrite **current leftover AP/MP** or next-spell / next-walk AP, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 72–84) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / `forcedMovedThisTurn` / last-AP-on-cell / summon-spawn-onto / leftover-MP-equals-max | **Absent** — Septet / Wide Gift / Feud Turn / Verse Septet / Idle Mark / Thin Plate / Wide Sting / Prime Gait / Even Toll / Watch Bind fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / sixspan / leanpost / octspan / gauntpost / ninespan / poisepost / tallypost / decspan / scorepost / hendecaspan / stavepost / dodecaspan / sestetpost / tridecaspan / **septetpost** / **tetradecaspan** bodies **replace** the random overlay. Cap one of those engines. Tetradeca Span **is** the 14-cell 2×7 post and needs remaining cap ≥ 14.
3. Any `healAmount` steals healer. **Septet Mend / Wide Gift must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Primer, Toller, Watcher, Cutter, Turner, Verser, Docker, Capper, Quadder, Quarterer, Bracer, Feer, Binder, or Bouncer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Gaunt Lend / Poise Lend / Tally Lend / Score Lend / Stave Lend / Sestet Lend / Septet Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend / Still Gift / Gaunt Mend / Poise Mend / Tally Mend / Score Mend / Stave Mend / Sestet Mend / Septet Mend / Wide Gift / Gait Gift / Prime Gift / Lean Gift / Hollow Gift / Equal Gift / Drift Gift / Shove Gift (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 20 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Septet Sip / Watch Bind / Feud Turn / Septet Lend / Even Toll / Brick Fee rewrite current leftover AP/MP or next confirm AP.
6. `inferSummonArchetype` must key `summonAI === "tetradecaspan"` **and** `"septetpost"` **before** any Tetradeca / Septet-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Fee that **charges non-Strike spells beside an already planted barrier** (it does not mint a new one from empty floor unless the CADRE’s Castellan already owns a door, and destroying the barrier is a complete answer). Septet Hold / Must Septet / Verse Septet / Nona Oath / Hook Stride are **not** `instantKill`.
8. Septet-step dest / slide-reel dest / septet-post plant / tetradeca plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Septet Step into a wall is a fizzle (no crush). Slide Reel dest must leave a walk-off that is **not** the conveyor cell **and not** a world portal. Tetradeca plant must leave a **diagonal** walk-off around the bounding 2×7 (the designed counter vs Trideca’s plus and Dodeca’s 3×4) and `findPath` after the hypothetical occupy must still reach an exit.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip / Sestet Sip / Septet Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Septet Sip **or** one Sestet Sip **or** one Stave Sip **or** one Score Sip **or** one Tally Sip **or** one Watch Sip source per pack, not both stacking past that cap. Watch Bind **forbids the next walk** (not a leftover steal, not a dump) and does not stack with Dual Keep past that cap. Watch Tax **charges next spell +1 AP**; it is drop 20, not this drop. Septet Hold is a **walk lock with a leftover-sum-7 key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Odd Hold + Must Gaunt + Gaunt Hold + Poise Hold + Must Poise + Tally Hold + Must Tally + Score Hold + Must Score + Stave Hold + Must Stave + Sestet Hold + Must Sestet + Septet Hold + Must Septet + Brick Hold on the same AP bar.
10. Walk-spend: Septet Step / Slide Reel / Septet Post plant / Tetradeca plant / Brick Fee **do not** increment `walkMpSpentThisTurn`. Wide Gift / Septet Mend gate leftover pools, not walk-spend. Brier Skip is a **next-walk tax skip**, not walk-spend.
11. Last-id: Verse Septet **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Septet. Dual Keep leftover **is** leftover; Dual Keep **cannot** lift Verse Septet.
12. Leftover-MP-equals-max: Idle Mark **fail closed** until end-turn leftover MP === max exists. Walk last turn does **not** arm it. Spell last turn does **not** arm it. Strike last turn does **not** arm it. Last leftover AP on the cell does **not** arm it. Summon spawn onto does **not** arm it. Teleport / Swap / Septet Step / Brick Step do not pay.
13. Remaining rewrite: Cadence Quad writes `n>4→4`. Cadence Quarte writes `4→0`. **Never both on the same AP bar.** Cadence Floor (`n>1→1`) stays SDE #906. Cadence Prime (`0→1`) stays drop 17. Cadence Rise (`1→2`) and Cadence Snuff (`1→0`) stay drop 18. Cadence Cap (`n>2→2`) and Cadence Dock (`2→0`) stay drop 19. Cadence Tern (`n>3→3`) and Cadence Tierce (`3→0`) stay drop 20. Cadence Quint (`n>5→5`) stays Wave 21.

### Relative difficulty (same grades as drops 1–20)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…20 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a leftover-sum tell / a leftover-sum-4-unequal tell / a leftover-sum-5 tell / a leftover-sum-6-unequal tell / a leftover-sum-7 tell / a leftover-1/1 tell / a leftover-1/0 tell / a leftover-AP≥2/MP=0 tell / a leftover-AP≥2/MP≥1 tell / a leftover-even-even miss / a leftover-AP===max tell / a leftover-MP===max tell / a leftover-MP-even-≥2 tell / a tied-≥1 leftover tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss / a leftover-MP miss / a leftover-AP miss / a leftover-AP-odd miss / a leftover-AP-even-≥2 miss / a remaining-0 tell / a remaining-1 tell / a remaining-2 tell / a remaining-n>2 tell / a remaining-n>3 tell / a remaining-3 tell / a remaining-n>4 tell / a remaining-4 tell / a (3,1) walk / an exact-9 oath / a painted-conveyor occupancy / an end-turn leftover-MP-equals-max cell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter / stepper / warder / holder): pack median + one step.
- Backliner (septet-mend / wide-gift / keep / sip / sill / tax / swap / oath / reel / mark / lend / stride / oather / primer / docker / capper / quadder / quarterer / watch / turn): pack median.
- Glass (sting, sip, purse, tax, mark, lend, skip, cutter, ignite, spare, sniper, post, bouncer, optic): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 21)

Drop 1–20 overlays still apply. These are **additional jobs** for Wave 20 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-SEPTET-MEND` | `queen` **with** heal | proposed `septet_mender` | `spell-septet-mend`, `starter-shield` | healer; skip if either leftover sum ≠ 7 or missing HP < 8; Dual Keep 2/2 is **Poise / Dual Plate / Wide Gift, skip**; Dual Keep leftover-sum 4 unequal is **Score, skip**; Dual Keep leftover-sum 3 is **Tally, skip**; Dual Keep 1/1 is **Prime Gift, skip**; extra door `septet_cantor` is **not** this family |
| `ROLE-TETRADECA` | `rook` **without** heal | proposed `tetradeca_prelate` | `physical_attack`, `spell-tetradeca-span` | `isSummoner` for tetradeca only; post `summonAI: "tetradecaspan"`, axis-aligned 2×7, empty kit, remaining cap ≥ 14; skip if any of fourteen cells blocked; every cell occupied; click = **nearest cell to caster** |
| `ROLE-FEUD-TURN` | `queen` **without** heal | proposed `feud_turner` | `starter-frost`, `spell-feud-turn` | controller; skip if no opposite-side in r3 **or** both leftover pairs already equal; invert **caster and one hostile**; caster leftover **does change**; sum invariant; **not** Psalm Turn / Hymn Turn / Duel Turn / Purse Turn / Bar Cross / Dual Keep |
| `ROLE-SEPTET-HOOD` | `knight` **without** heal | proposed `septet_hooder` | `starter-shield`, `spell-septet-hood` | guardian; skip if leftover sum ≠ 7; any-range miss while sum===7; consume on miss |
| `ROLE-SEPTET-STING` | `pawn` **without** heal | proposed `septet_stinger` | `physical_attack`, `spell-septet-sting` | flanker; skip if leftover sum ≠ 7 unless 10 still kills; Dual Keep **cannot** open the 8 |
| `ROLE-SEPTET-STEP` | `queen` **without** heal | proposed `septet_stepper` | `starter-frost`, `spell-septet-step` | protector; skip if ally leftover sum ≠ 7 or no free adj; relocate, **not** `isSwap` |
| `ROLE-SEPTET-SILL` | `rook` **without** heal | proposed `septet_siller` | `starter-frost`, `spell-septet-sill` | setter; skip if occupant leftover sum already ≠ 7; occupant leftover-sum===7 at **start of their turn** takes 8; paint stays |
| `ROLE-SEPTET-HOLD` | `knight` **without** heal | proposed `septet_holder` | `physical_attack`, `spell-septet-hold` | controller; skip if leftover sum ≠ 7; cannot walk while leftover-sum===7; spells stay legal; **never PAIR with Must Septet** |
| `ROLE-SEPTET-LEND` | `bishop` **without** heal | proposed `septet_lender` | `starter-frost`, `spell-septet-lend` | buffer; skip if ally leftover sum ≠ 7; +1 current AP **and** +1 current MP (**exits** to sum 9) |
| `ROLE-SEPTET-SIP` | `pawn` **without** heal | proposed `septet_sipper` | `physical_attack`, `spell-septet-sip` | flanker; skip if leftover sum ≠ 7 **or** leftover AP = 0; steal 1 leftover AP; (0,7) fizzles; (4,3)→(3,3) **manufactures Poise**; other successful sips **manufacture Sestet** |
| `ROLE-SEPTET-POST` | `pawn` **without** heal | proposed `septet_prelate` | `physical_attack`, `spell-septet-post` | `isSummoner` for septetpost only; post `summonAI: "septetpost"`, remaining cap ≥ 1; end-turn leftover-sum===7 occupy detonates; walk-on / dump-a-pool / 2/2-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe |
| `ROLE-SEPTET-BOUNCE` | `queen` **without** heal | proposed `septet_bouncer` | `starter-frost`, `spell-septet-bounce` | artillery; skip bounce without a second leftover-sum===7 hostile in search radius (`AI-TEM-05`) |
| `ROLE-MUST-SEPTET` | `knight` **without** heal | proposed `must_septeter` | `physical_attack`, `spell-must-septet` | controller; skip if leftover sum ≠ 7; non-Strike illegal unless leftover-sum===7 **and** last AP; Strike stays legal; **never PAIR with Septet Hold** |
| `ROLE-VERSE-SEPTET` | `bishop` **without** heal | proposed `verse_septeter` | `starter-frost`, `spell-verse-septet` | controller; skip if no `lastResolvedSpellId`; leftover sum === 7 peels; `0 = 0` does **not**; `2 = 2` does **not**; `3 = 3` does **not**; `3 = 2` does **not**; `4 = 2` does **not**; `1 = 1` does **not**; Dual Keep does **not**; shove does **not** |
| `ROLE-HOOK-STRIDE` | `knight` **without** heal | proposed `hook_warder` | `physical_attack`, `spell-hook-stride` | controller; skip if player MP = 0 or no legal (3,1) floor; next walk dest a permutation of **(3,1)**; extra room `hook_gallery` is **not** this family |
| `ROLE-NONA-OATH` | `bishop` **without** heal | proposed `nona_oather` | `starter-frost`, `spell-nona-oath` | controller; skip if they have no ranged id; next spell exact Chebyshev 9; Strike stays legal; extra room `nona_nave` is **not** this family |
| `ROLE-SLIDE-REEL` | `bishop` **without** heal | proposed `slide_reeler` | `starter-frost`, `spell-slide-reel` | caster; skip if no painted conveyor occupancy in 6; dest is **toward**, not onto; thirteenth `applyAttract` flavor; extra room `mill_aisle` is **not** this family |
| `ROLE-HOOK-BITE` | `knight` **without** heal | proposed `hook_biter` | `physical_attack`, `spell-hook-bite` | flanker; skip rider if they do not share a **(3,1)** unless 10 still kills; 10 + 8 if share a (3,1) vector; file-only / rank-only / diagonal / knight → 10 only |
| `ROLE-IDLE-MARK` | `bishop` **without** heal | proposed `idle_marker` | `starter-frost`, `spell-idle-mark` | setter; skip if they will walk; 0 on cast; cell detonates at **end of turn** if leftover MP **equals max**; walk-on is **free**; extra room `idle_pulpit` is **not** this family |
| `ROLE-THIN-PLATE` | `knight` **without** heal | proposed `thin_plater` | `starter-shield`, `spell-thin-plate` | guardian; skip if leftover is not **exactly 1/0**; leftover 1/0 miss; leftover 1/1 lands (Prime Plate); leftover 2/2 lands (Dual Plate); Dual Keep 1/0 **opens** |
| `ROLE-BRIER-SKIP` | `pawn` **without** heal | proposed `brier_skipper` | `physical_attack`, `spell-brier-skip` | flanker; skip if Thorned Ground is not active **or** the next walk is not pathLength 2; length ≥ 3 pays; extra room `brier_nave` is **not** this family |
| `ROLE-WIDE-STING` | `pawn` **without** heal | proposed `wide_stinger` | `physical_attack`, `spell-wide-sting` | charger; skip rider if leftover AP < 2 **or** leftover MP < 1 unless 10 still kills; Dual Keep 2/2 **hits** |
| `ROLE-HOOK-TAX` | `rook` **without** heal | proposed `hook_taxer` | `starter-frost`, `spell-summon-hook` | controller; skip if no allied summon; pets pay +1 AP if this turn’s walk **landing** is a **(3,1)**; orthogonal 1-steps are free; drop if `summonAI` empty |
| `ROLE-WIDE-GIFT` | `queen` **with** heal | proposed `wide_gifter` | `spell-wide-gift`, `starter-shield` | healer; skip if leftover AP < 2 **or** leftover MP < 1 or missing HP < 8; Dual Keep 2/2 **opens**; Dual Keep 2/0 is Gait Gift, skip; Dual Keep 1/1 is Prime Gift, skip; **not** Septet / Sestet / Stave / Score / Tally / Equal / Lean / Hollow |
| `ROLE-EVEN-TOLL` | `bishop` **without** heal | proposed `even_toller` | `starter-frost`, `spell-even-toll` | controller; skip if leftover AP is odd or 0/1; next **walk** +1 AP if leftover **AP is even ≥ 2**; relocate / Swap do not pay |
| `ROLE-BRICK-FEE` | `rook` **without** heal | proposed `brick_feer` | `physical_attack`, `spell-brick-fee` | controller; skip if no barrier is adjacent; next **non-Strike spell** +1 AP while a barrier is adjacent; Strike stays free; destroy the barrier and the tax drops; lock **stays**; never Tax / Hold / Brace |
| `ROLE-WATCH-BIND` | `bishop` **without** heal | proposed `watch_binder` | `starter-frost`, `spell-watch-bind` | artillery; skip if already in 1–2 **or** no overwatch is armed; snap still deals; **forbids the walker’s next walk**; **not** Watch Tax / Watch Drain / Watch Root |
| `ROLE-PRIME-GAIT` | `pawn` **without** heal | proposed `prime_gaiter` | `physical_attack`, `spell-prime-gait` | flanker; skip if leftover is not **exactly 1/1** unless 10 still kills; leftover 1/0 is Thin; leftover 0/0 is Gaunt; leftover 2/2 is Wide Sting |
| `ROLE-SLIDE-CUT` | `knight` **without** heal | proposed `slide_cutter` | `physical_attack`, `spell-slide-cut` | flanker; skip rider if target is Chebyshev > 2 from every painted conveyor occupancy cell; Twin Gate pads do **not** count |
| `ROLE-IDLE-PLATE` | `rook` **without** heal | proposed `idle_plater` | `starter-frost`, `spell-idle-plate` | protector; skip if leftover MP ≠ max; next hit 0 while leftover MP equals max; walking drops the window |
| `ROLE-CADENCE-QUAD` | `bishop` **without** heal | proposed `cadence_quadder` | `starter-frost`, `spell-cadence-quad` | controller; skip if every remaining is already ≤ 4; remaining `n>4` → `4`; zeros stay 0; ones stay 1; twos stay 2; threes stay 3; fours stay 4; **never PAIR with Quarte** |
| `ROLE-CADENCE-QUARTE` | `bishop` **without** heal | proposed `cadence_quarterer` | `starter-frost`, `spell-cadence-quarte` | controller; skip if every remaining is already ≠ 4; remaining `n===4` → `0`; zeros stay 0; `n===1`, `n===2`, `n===3`, and `n>4` unchanged; extra door `quarte_precentor` is **not** this family; **never PAIR with Quad** |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) / `ROLE-ARBITER` (`coil_arbiter`) / `ROLE-TRAPPER` (`trip_mason`) / `ROLE-TURRET` (`stone_castellan`) / `ROLE-MIST` (`mist_walker`) / `ROLE-OPTIC` (`dim_optic`) / `ROLE-PLATE` (`plate_warden`) / `ROLE-SESTET-STING` (`sestet_stinger`) / `ROLE-STAVE-STING` (`stave_stinger`) / `ROLE-SUMMONER` (`brood_chanter`) / `ROLE-FONT` (`font_cantor`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Primer, Docker, Capper, Quadder, Quarterer, Septet-Mend, Wide-Gift, Tetradeca, or Septet-Post.

### Fair-fight rules (every sheet)

Same as drops 1–20, plus Wave 20:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier. Tetradeca sheets also need **≥ 1 diagonal** walk-off around the bounding 2×7.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Septet Post never detonates on leftover sum ≠ 7.
- Swap / pull / push / septet-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Bare Sip / Poise Sip / Tally Sip / Score Sip / Stave Sip / Sestet Sip / Septet Sip / Watch Sip: cap applied MP debuff at **−2**. One Slow **or** one leftover-AP steal source per pack. Watch Bind is a next-walk **lock**, not a leftover steal.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Septet Bounce / Sestet Bounce / Stave Bounce / Score Bounce / Tally Bounce / Poise Bounce / Gaunt Bounce / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Septet Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six **or** gauntpost **or** oct **or** poisepost **or** nine **or** tallypost **or** dec **or** scorepost **or** hendeca **or** stavepost **or** dodeca **or** sestetpost **or** trideca **or** septetpost **or** tetradeca — never two engines). Tetradeca is illegal until remaining cap ≥ 14.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.
- Brick Fee **must** skip if no barrier is adjacent. Destroying the barrier is the designed answer. Never seal the last aisle with a new barrier. Strike stays free.
- Dual Keep **opens** Poise on 2/2 or 1/1, **opens Dual Plate** on 2/2, **opens Wide Gift** on 2/2, **opens Prime Gift / Prime Plate / Prime Gait** on 1/1, **opens** Tally on (2,1)/(1,2)/(3,0)/(0,3), **opens** Score on (4,0)/(0,4)/(3,1)/(1,3), **opens Gait Gift** on 2/0, **opens Thin Gait / Thin Plate** on 1/0, **cannot open Stave**, **cannot open Sestet**, **cannot open Septet**, and **closes** Gaunt / Hollow Gift / Lean Gift until the bank is spent. Dump both pools to 0 for Gaunt / Hollow Gift. Hold 2/2 or 1/1 for Poise. Hold leftover **exactly 1/1** for Prime Gift / Prime Plate / Prime Gait. Hold leftover **exactly 1/0** for Thin Gait / Thin Plate. Hold leftover **AP ≥ 2 AND MP = 0** for Gait Gift. Hold leftover **AP ≥ 2 AND MP ≥ 1** for Wide Gift / Wide Sting. Hold a leftover **sum of 3** for Tally. Hold a leftover **sum of 4 without tying** for Score. Hold leftover **AP + MP === 5** for Stave — Dual Keep cannot fake it; Tally Lend can. Hold leftover **AP + MP === 6 AND unequal** for Sestet — Dual Keep cannot fake it; Score Lend can. Hold leftover **AP + MP === 7** for Septet — Dual Keep cannot fake it; Stave Lend / Sestet Lend can.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-SEPTET-STEP` | PAIR | leftover-sum===7 healer + leftover-sum===7 joiner | this drop |
| `FSN-SEPTET-SIP` | PAIR | leftover-sum===7 poke + leftover-sum leftover-AP steal | this drop |
| `FSN-HOOK-NONA` | PAIR | next walk permutation of (3,1) + next-spell exact 9 | this drop |
| `FSN-MILL-HOOK` | PAIR | pull toward painted conveyor + share-(3,1) bite | this drop |
| `FSN-SEPTET-GATE` | CELL | leftover-sum===7 post + start-turn leftover-sum===7 sill | this drop |
| `FSN-IDLE-THIN` | CELL | end-turn leftover-MP-equals-max paint + leftover 1/0 miss | this drop |
| `FSN-BRIER-WIDE` | CELL | pathLength-2 Thorned Ground skip + leftover-AP≥2/MP≥1 poke | this drop |
| `FSN-WATCH-PRIME` | CELL | overwatch snap forbids next walk + leftover-1/1 poke | this drop |
| `FSN-SEPTET-CHOIR` | BRIGADE | leftover-sum===7 heal + last-id until leftover-sum===7 + ignite | this drop |
| `FSN-WIDE-QUAD` | BRIGADE | leftover AP≥2/MP≥1 heal + remaining n>4→4 + font | this drop |
| `FSN-SEPTET-QUIET` | BRIGADE | septet step + septet mend + cover | this drop |
| `FSN-FEUD-SEPTET` | BRIGADE | caster+hostile leftover invert + leftover-sum===7 heal + leftover-sum===7 sting | this drop |
| `FSN-QUARTE-VERSE` | CADRE | remaining 4→0 + last-id until leftover-sum===7 + glyph tax | this drop |
| `FSN-EVEN-BRICK` | CADRE | leftover-AP-even-≥2 walk tax + barrier-adjacent spell tax + turret | this drop |
| `FSN-PURSE-SEPTET` | CADRE | caster+hostile leftover invert + leftover-sum===7 sip manufactures Sestet/Poise + leftover-sum-6-unequal sting | this drop |
| `FSN-SEPTET-HOLD` | COURT | walk-until leftover-sum===7 + tools-until leftover-sum===7 **and** last AP + warden | this drop |

Named packs as variants: `FSN-SEPTET-GATE/STING` (Septet Gate full), `FSN-MILL-HOOK/GLYPH` (Mill Hook full), `FSN-HOOK-NONA/GUN` (Hook Nona full), `FSN-IDLE-THIN/WARD` (Idle Thin full — never Mark+Plate PAIR without the Warden peeler), `FSN-IDLE-THIN/IDLE` (Thin Idle — never Thin-Plate+Idle-Plate PAIR), `FSN-BRIER-WIDE/TIDE` (Brier Wide full), `FSN-WATCH-PRIME/GUN` (Watch Prime Hunt full — never Bind+Gun PAIR), `FSN-SEPTET-QUIET/LEND` (Lend Hood escort), `FSN-SEPTET-HOLD/TETRADECA` (Tetradeca Plug — skip until remaining cap ≥ 14; live cap is 2), `FSN-SEPTET-HOLD/BOUNCE` (Bounce Septet leftover-sum===7), `FSN-SEPTET-HOLD/KENNEL` (Mill Kennel — never Tax+Plate PAIR), `FSN-QUARTE-VERSE/QUAD` (Quad Quarte — never Quad+Quarte PAIR).

---

## Formations

### FSN-SEPTET-STEP

FORMATION_ID: `FSN-SEPTET-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-SEPTET-MEND` — `queen` **with** heal / proposed `septet_mender` — pack median — back
- `ROLE-SEPTET-STEP` — `queen` **without** heal / proposed `septet_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Septet Mend is a heal kit; kit band 0 has no heal). Show `FSN-SESTET-STEP` instead (four leftover-sum-6-unequal tell without the leftover-sum-7 8).
- Mender kit: Septet Mend + Shield. **No** Inferno, no Enrage, no Sestet / Stave / Score / Tally / Poise / Gaunt / Hollow / Equal / Lean / Prime / Gait / Wide / Dry / Still / Heave / Both / Bar / Gift Mend (PAIR bans). Extra door `septet_cantor` is **not** this family.
- Stepper kit: Septet Step + Frost. **No** Sestet / Stave / Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Brick Step / Cover on PAIR (those are `FSN-SEPTET-QUIET` / `FSN-SESTET-QUIET`).
- Elite: Stepper only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-SESTET-STEP` **or** `FSN-STAVE-STEP` (player has seen leftover **AP + MP === 6 AND unequal** heal **or** leftover **AP + MP === 5** heal; this sheet cashes leftover **AP + MP === 7** on **both** bodies for 8).
- Random 30% family lottery is **off**.
- Leftover-AP **and** leftover-MP writers required. Dual Keep leftover **is** leftover. Dual Keep **cannot** fake this. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 3` does **not** fire. `3 = 2` does **not** fire. `3 = 1` does **not** fire. `4 = 2` does **not** fire. `1 = 1` does **not** fire.

SPELL_POOL_INTERACTIONS:

- Septet Mend (8 HP) pays only if **caster and target** leftover AP + leftover MP **=== 7** after the 3 AP is paid. Legal pairs (7,0) (0,7) (6,1) (1,6) (5,2) (2,5) (4,3) (3,4). Dual Keep 2/2 is Poise / Dual Plate / Wide Gift — Shield queen. Dual Keep leftover-sum 4 unequal is Score — Shield queen. Dual Keep leftover-sum 3 is Tally — Shield queen. Dual Keep 1/1 is Prime Gift — Shield queen. Dual Keep 2/0 is Gait Gift — Shield queen (one-body; this sheet still needs **both**). Odd sum — no equality ban.
- Septet Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover sum === 7. It is not Sestet Step, not Stave Step, not Score Step, not Tally Step, not Poise Step, and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).
- Stave Lend / Sestet Lend are **not** on this PAIR. They **manufacture** Septet on a later COURT (`FSN-SEPTET-QUIET/LEND` does not own Stave Lend either).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover sum === 7; if the Mender is still 2/2, leftover-sum 4 unequal, leftover-sum 3, 3/3, 4/2, or 1/1, Stepper Frosts.
- Mender Septet-Mends only if both leftover sums === 7 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover **only** to enable the 8 if a Strike would kill. Neither body dumps leftover **only** to fake Sestet Mend, Stave Mend, Score Mend, Tally Mend, Poise Mend, Prime Gift, Gait Gift, or Wide Gift.

SYNERGY:

- Leftover-sum===7 healer + leftover-sum===7 joiner. Wave 19 Sestet Step standing on the **next leftover-sum** (7, odd, Dual Keep cannot fake). Combination, not a new sprite. Spend 1 leftover AP **or** 1 leftover MP so the sum leaves 7 **or** Dual Keep 2/2 **or** dump to leftover-sum 6 unequal **or** dump to leftover-sum 5 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump to 3/3 **or** dump to 4/2 **or** dump to 1/1 — is a complete answer.

PLAYER_THREAT:

- Slow refill if you sit (4,3) on **both** bodies. Spike is low. Misplay is Rooting neither and holding leftover-sum 7 into an 8 that just landed. Dual Keep cannot accidentally open this.

COUNTERPLAY:

- Spend 1 leftover AP **or** 1 leftover MP to leave sum 7. Dual Keep 2/2 (Poise / Dual Plate / Wide Gift window, not this one). Dump to leftover-sum 6 unequal (Sestet window, not this one). Dump to leftover-sum 5 (Stave window, not this one). Dump to leftover-sum 4 unequal (Score window, not this one). Dump to leftover-sum 3 (Tally window, not this one). Dump to 3/3 (Poise window, not this one). Dump to 4/2 (Sestet window, not this one). Dump to 1/1 (Prime Gift window, not this one). Dump both pools to 0 (Gaunt window, not this one). Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Mender. Kill the Mender (glass RES). The Stepper without a leftover-sum-7 ally is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced leftover-sum-7 heal reads as a lock). Dual Keep cannot manufacture this window, so a tunnel that only Dual-Keeps is **not** this sheet’s lock — still reject cramped closets.

AI_REQUIREMENTS:

- Mender: healer; skip if either leftover sum ≠ 7.
- Stepper: protector; skip if ally leftover sum ≠ 7 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-SEPTET-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-SEPTET-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-SEPTET-SIP

FORMATION_ID: `FSN-SEPTET-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SEPTET-STING` — `pawn` **without** heal / proposed `septet_stinger` — pack median or −1 — starts wide
- `ROLE-SEPTET-SIP` — `pawn` **without** heal / proposed `septet_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-SESTET-SIP` (leftover **AP + MP === 6 AND unequal** poke + leftover-sum leftover-AP steal) and `FSN-STAVE-SIP` (leftover **AP + MP === 5** poke + leftover-sum leftover-AP steal). Pressure is the **leftover-sum===7** window. Dual Keep **cannot** open either rider. (0,7) opens Sting and **fizzles** Sip.
- Band 0: Stinger Strike only; Sipper Strike only (Septet Sting / Septet Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-SESTET-SIP`.
- Elite: Stinger only. Sipper never gets Sestet Sip or Watch Sip (PAIR bans).
- Unlock after `FSN-SESTET-SIP` **or** `FSN-SEPTET-STEP` (player has seen leftover-sum as a resource **or** the leftover-sum-7 heal).
- Full Sting / Fresh Sting / Capped Sting / Wide Sting / Thin Gait / Prime Gait / Lone Gait / Tied Gait / Odd Sting / Even Sting / Even Gait / Ready / Pair Gait stay off PAIR (PAIR bans). Septet Hold stays off (that is `FSN-SEPTET-HOLD`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Septet Sting: 10, +8 iff **target** leftover AP + leftover MP === 7. Dual Keep leftover **cannot** open the 8. `2 = 2` is Poise Sting / Dual Plate / Wide Sting’s window, not this one. `3 = 3` is Poise Sting’s window, not this one. `3 = 2` is Stave Sting’s window, not this one. `3 = 1` is Score Sting’s window, not this one. `4 = 2` is Sestet Sting’s window, not this one. `0 = 0` is Gaunt Sting’s window, not this one. `1 = 1` is Prime Gait, not this one. `1 = 0` is Thin Gait, not this one.
- Septet Sip: steal 1 leftover AP iff leftover sum === 7 **and leftover AP ≥ 1**. (4,3) → (3,3) **Poise**. Other successful sips **manufacture Sestet**: (7,0) → (6,0) **Sestet**. (6,1) → (5,1) **Sestet**. (5,2) → (4,2) **Sestet**. (3,4) → (2,4) **Sestet**. (2,5) → (1,5) **Sestet**. (1,6) → (0,6) **Sestet**. (0,7) fizzles. Inverse of Septet Lend. Cap applied leftover-AP steal at −1 with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover sum === 7 and leftover AP ≥ 1; else Strikes.
- Stinger lurks at 3 and commits when leftover sum === 7 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Leftover-sum-7 poke + leftover-sum leftover-AP steal. Wave 19 Sestet Sip standing on the **next leftover-sum** (7). Combination, not a new sprite. Septet Sip **manufactures Sestet or Poise** — that is the teaching tell for `FSN-PURSE-SEPTET`.

PLAYER_THREAT:

- Getting leftover-sum-7 Stung, then Sipped off (4,3) into a Poise window you did not ask for, or off (5,2) into a Sestet window. Spike is one 18. Recoverable: sit (0,7), sit 2/2, dump a pool.

COUNTERPLAY:

- Hold leftover MP only (0,7) — Sip fizzles, Sting still fires so **dump MP too**. Dual Keep 2/2 (Poise / Dual Plate / Wide Gift, not this). Sit 3/3. Sit 4/2. Spend 1 leftover AP off (4,3). Kill the Stinger (glass). The Sipper without leftover-sum-7 is Strike.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit.
- No Thorned Ground on the only path to the Sipper.

AI_REQUIREMENTS:

- Stinger: flanker; skip if leftover sum ≠ 7 unless 10 still kills.
- Sipper: flanker; skip leftover AP = 0.
- Soph 1–2.

VARIANTS:

- `FSN-SEPTET-SIP/E-STING` — elite Stinger, still no Watch Sip on PAIR.
- `FSN-SEPTET-GATE/STING` is the CELL with Post — do not merge.

STATUS: PROPOSED

---

### FSN-HOOK-NONA

FORMATION_ID: `FSN-HOOK-NONA`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-HOOK-STRIDE` — `knight` **without** heal / proposed `hook_warder` — pack median + 1 — owns one (3,1) ring
- `ROLE-NONA-OATH` — `bishop` **without** heal / proposed `nona_oather` — pack median — next-spell exact 9

VARIANT_RULES:

- Distinct from `FSN-TERN-OCTA` (next walk Chebyshev **exactly 3, orthogonal only** + next-spell exact **8**) and `FSN-RING-HEPTA` (next walk Chebyshev **exactly 2**, knight hop **excluded** + next-spell exact **7**). This sheet is **(3,1) walk** plus **exact Chebyshev 9**. Strike stays legal on both bodies.
- Band 0: both Frost / Strike only; the AI contract still refuses Chebyshev-1 / Chebyshev-2 / orthogonal-3 / knight hops, and off-9 spells even before the clone ids exist.
- Band 1: Warder may hold Slow. Oather may hold Slow. Never Inferno. Never Tern Stride / Octa Oath / Ring Stride / Hepta Oath / Hook Bite / Hook Chaplain on PAIR (PAIR bans). Extra rooms `hook_gallery` / `nona_nave` are **not** these families.
- Elite: Warder only.
- Unlock after `FSN-TERN-OCTA` **or** `FSN-RING-HEPTA` (player has seen a next-walk shape lock **or** an exact-range oath).
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Hook Stride: the next **walk** dest must be a permutation of **(3,1)** from the armed origin (`(|dx|,|dy|) === (3,1)`). Eight dests `(±3,±1)` and `(±1,±3)`. `(3,0)` / `(0,3)` are illegal (Tern). `(2,1)` is illegal (knight). `(2,2)` is illegal (Ring). Forced movement / Swap / blink / Twin Gate stay legal. Blink does not pay the walk lock.
- Nona Oath: the next **non-Strike** spell must confirm at Chebyshev **exactly 9**. Frost at 1–8 or ≥ 10 fizzles (AP not spent for the fizzled spell; Nona Oath already observed). Strike stays legal at any range.
- Together: walk a hook, then the only legal nuke is from 9. Step to Chebyshev 1 or 2 **or** occupy every hook cell **or** walk to 8 or 10 — is a complete answer.

TACTICAL_PLAN:

- Warder arms Hook Stride if a (3,1) approach already exists; skip if the player must be walked at Chebyshev 1 to threaten.
- Oather arms Nona Oath if a tile at Chebyshev 9 exists; skip if the room is smaller than 9.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Next-walk (3,1) + next-spell exact 9. Wave 19 Tern Octa standing on the **next walk shape** (a hook, not a tern) and the **next oath** (9, not 8). Combination, not a new sprite. Tern Stride (Chebyshev 3 orthogonal) is **not** this. Knight Stride (**only** `(2,1)`) is **not** this.

PLAYER_THREAT:

- Being forced off Chebyshev 1–2, then fizzling Frost from 8 while a Far Sting waits at 9. Spike is one legal 9-range poke. Recoverable: stand Chebyshev 1, occupy the hook, walk to 8.

COUNTERPLAY:

- Step to Chebyshev 1 or 2. Occupy every hook cell. Walk to 8 or 10. Strike through. Swap off the armed origin. Kill the Oather (glass). The Warder without a legal hook is Strike.

MAP_REQUIREMENTS:

- `openField` or `asymmetric`. Needs a legal (3,1) floor **and** a tile at Chebyshev 9.
- Weight 0 on cramped 1-tile closets and on rooms whose longest Chebyshev is < 9.

AI_REQUIREMENTS:

- Warder: controller; skip if player MP = 0 or no legal (3,1) floor.
- Oather: controller; skip if they have no ranged id **or** no tile at 9.
- Soph 1–2.

VARIANTS:

- `FSN-HOOK-NONA/GUN` — Hook Nona full: add `ROLE-SNIPER` (`glass_sniper`) as a third body. Never two guns. The sniper sits at 9. **Never PAIR Hook + Gun without the Oather peeler.**
- `FSN-TERN-OCTA` remains the Chebyshev-3-orthogonal / exact-8 PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-MILL-HOOK

FORMATION_ID: `FSN-MILL-HOOK`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-SLIDE-REEL` — `bishop` **without** heal / proposed `slide_reeler` — pack median — back
- `ROLE-HOOK-BITE` — `knight` **without** heal / proposed `hook_biter` — pack median + 1 — owns one open hook

VARIANT_RULES:

- Distinct from `FSN-MIRE-DIAG` (pull toward **painted mire** + share-**diagonal** bite) and `FSN-LAVA-FILE` (pull toward **lava** + share-**file**-only bite). This sheet is **pull toward painted conveyor occupancy** plus **share-(3,1) bite**. Dest is **toward**, not onto, a world portal.
- Band 0: Reeler Frost only; Biter Strike only. The AI contract still refuses empty-conveyor pulls and rank-only / file-only / diagonal bonus even before the clone ids exist.
- Band 1: Reeler may hold Slow. Biter may hold Iron Skin. Never Inferno. Never Mire Reel / Lava Reel / File Bite / Rank Bite / Diag Bite / Hook Stride / Slide Cut / Slide Skip on PAIR (PAIR bans). Extra room `mill_aisle` is **not** this family.
- Elite: Biter only.
- Unlock after `FSN-MIRE-DIAG` **or** `FSN-SLIDE-CAP` (player has seen an occupancy-toward pull **or** a conveyor skip).
- Random 30% family lottery is **off**.
- Map **must** already place painted conveyor occupancy. Twin Gate pads do **not** count. Ice occupancy is **not** conveyor. Lava occupancy is **not** conveyor. Painted mire is **not** conveyor.

SPELL_POOL_INTERACTIONS:

- Slide Reel: pull 1 toward nearest **painted conveyor occupancy**. Thirteenth `applyAttract` dest flavor. Empty board / no painted conveyor fizzles (AP spent, observe). Dest that would be a world portal **fails closed** (stay put).
- Hook Bite: 10, +8 iff caster and target share a **(3,1)** vector. File-only → 10 only. Rank-only → 10 only. Diagonal → 10 only. Knight `(2,1)` → 10 only.
- Together: pull onto the hook, then bite the hook they now share. Step off the hook **or** occupy the toward-cell **or** fight on a map without painted conveyor — is a complete answer.

TACTICAL_PLAN:

- Reeler pulls only if painted conveyor exists in 6 **and** the 1-step is not a portal / void.
- Biter commits the bonus only on a shared (3,1); otherwise 10 or Strike.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Pull toward painted conveyor + share-(3,1) bite. Wave 19 Mire Diag standing on the **next occupancy dest** (conveyor, not mire) and the **next axis** (hook, not diagonal). Combination, not a new sprite.

PLAYER_THREAT:

- Being slid one toward the mill onto the Biter’s hook, then eating 18. Spike is one 18. Recoverable: stand off-hook, occupy the toward-tile, fight mill-less.

COUNTERPLAY:

- Step off the hook. Occupy the toward-cell. Blink. Body-block the hook. Kill the Biter. The Reeler without painted conveyor is Frost.

MAP_REQUIREMENTS:

- `openField`, `ruinsIslands`, or `asymmetric` **with painted conveyor occupancy in Chebyshev 6 of a legal floor**.
- Weight 0 on mill-less maps. Weight 0 if the only toward-step is a world portal.
- Reject `corridorMaze` when the only aisle is the mill file (forced 18 reads as a lock).

AI_REQUIREMENTS:

- Reeler: caster; skip no-conveyor / portal-step. Until `applyAttract` has a painted-conveyor dest, this sheet must not ship.
- Biter: flanker; skip rider if they do not share a (3,1) unless 10 still kills.
- Soph 1–2.

VARIANTS:

- `FSN-MILL-HOOK/GLYPH` — Mill Hook full: add `ROLE-GLYPH` (`glyph_sower`) as a third body. Glyph is a paint, not conveyor occupancy, unless the glyph **is** the mill paint already on the map. Never two reels.
- `FSN-MIRE-DIAG` remains the mire / diagonal PAIR; do not merge ids.

STATUS: PROPOSED

---

### FSN-SEPTET-GATE

FORMATION_ID: `FSN-SEPTET-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SEPTET-POST` — `pawn` **without** heal / proposed `septet_prelate` — pack median or −1 — empty-kit post
- `ROLE-SEPTET-SILL` — `rook` **without** heal / proposed `septet_siller` — pack median — start-turn leftover-sum===7 tax

VARIANT_RULES:

- Distinct from `FSN-SESTET-GATE` (leftover-sum===6 unequal post + start-turn leftover-sum===6 unequal sill). This sheet is leftover-**sum===7** occupy at **end of their turn** plus leftover-**sum===7** occupy at **start of their turn** on a **different** tile.
- Band 0: **do not spawn this id**. Show `FSN-SESTET-GATE`.
- Elite: Siller only. Prelate never gets turret / wolf / archer / dummy / sestetpost / stavepost / dodecaspan / tridecaspan / tetradecaspan overlay.
- Unlock after `FSN-SESTET-GATE` **or** `FSN-SEPTET-SIP`.
- Two different tiles. Walk-on the post is **safe**. Dump a pool before end-turn is **safe**. Dual Keep 2/2 / leftover-sum 4 unequal / leftover-sum 3 / 3/3 / 4/2 / 1/1 overnight is **safe**. Dual Keep **cannot** sit on sum 7.
- `summonAI === "septetpost"` required. Remaining cap ≥ 1.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Septet Post: empty-kit body. End-turn occupy with leftover AP + leftover MP === 7 deals 10 and the post dies. Walk-enter / relocate / start-turn do **not** detonate.
- Septet Sill: occupant leftover-sum===7 at **start of their turn** takes 8; paint stays 2 turns. Walk-enter does **not** tax. Dual Keep 2/2 **misses**. Dual Keep leftover-sum 4 unequal **misses**. Dual Keep leftover-sum 6 cannot sit.
- Together: camp sum===7 on the post **and** start the next turn on the sill. Spend a pool **or** Dual Keep 2/2 **or** dump to leftover-sum 6 unequal overnight — is a complete answer.

TACTICAL_PLAN:

- Prelate plants on a camp tile the player wants, never the last exit, never a portal.
- Siller paints a **different** neighbor. Never the post’s cell (that would hide which window detonates).
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-sum-7 post + start-turn leftover-sum-7 sill. Wave 19 Sestet Gate standing on the **next leftover-sum** (7). Combination, not a new sprite.

PLAYER_THREAT:

- Camping (4,3) on the post at end-turn **and** still sitting (4,3) on the sill at dawn. Spike is 10 then 8. Recoverable: dump a pool overnight, Dual Keep 2/2, walk off.

COUNTERPLAY:

- Leave before end-turn. Dump to leftover-sum 6 unequal (Sestet Post’s window, not this). Dual Keep 2/2. Sit 3/3. Sit 4/2. Kill the post (1 HP pool). Walk-on is free.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with two distinct floor tiles that are not the last exit.
- Weight 0 on 1-tile closets. Two painted cells must both leave ≥ 1 walk-off.

AI_REQUIREMENTS:

- Post: summoner `septetpost`; skip remaining cap < 1; never path; never also sestetpost / stavepost / dodecaspan / tridecaspan / tetradecaspan.
- Siller: setter; skip if occupant leftover already off-window; never paint the post’s cell.
- Soph 2–3.

VARIANTS:

- `FSN-SEPTET-GATE/STING` — Septet Gate full: add `ROLE-SEPTET-STING` as a third body. Never two posts. **Never PAIR Post + Sting without the Sill peeler.**
- `FSN-SESTET-GATE` remains the leftover-sum-6-unequal CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-IDLE-THIN

FORMATION_ID: `FSN-IDLE-THIN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-IDLE-MARK` — `bishop` **without** heal / proposed `idle_marker` — pack median — end-turn leftover-MP-equals-max paint
- `ROLE-THIN-PLATE` — `knight` **without** heal / proposed `thin_plater` — pack median — leftover 1/0 miss

VARIANT_RULES:

- Distinct from `FSN-SPAWN-PRIME` (summon spawn onto the paint + leftover **exactly 1/1** miss). This sheet is **end-turn leftover MP equals max** plus leftover **exactly 1/0** miss. Walk-on is **free**. Spell-from is **free**. Last leftover AP on the cell is **free**. Summon spawn onto is **free**. They must **not walk** for the Mark.
- Band 0: **do not spawn this id** (Thin Plate needs leftover 1/0). Show `FSN-SPAWN-PRIME`.
- Elite: Plater only. Marker never gets Last Mark / Strike Mark / Idle Plate / Dwell Mark.
- Unlock after `FSN-SPAWN-PRIME` **or** when the player has camped leftover MP this run (relative, not a level gate).
- **Never PAIR Idle Mark + Idle Plate.** `/IDLE` is the 3-body.
- Dual Keep 1/0 **opens** Thin Plate. Dual Keep 1/1 is Prime Plate, skip. Dual Keep 2/2 is Dual Plate / Wide Gift, skip.
- Random 30% family lottery is **off**.
- Extra room `idle_pulpit` is **not** this family.

SPELL_POOL_INTERACTIONS:

- Idle Mark: 0 on cast. Cell detonates at **end of turn** if leftover MP **equals max**, then consumes. Walk-on / spell-from / last-AP / Strike-from / spawn-onto do **not**. Walking (leftover MP < max) is the designed answer.
- Thin Plate: next hit is 0 **while leftover AP === 1 AND leftover MP === 0**. Hit at 1/1 lands (Prime Plate’s window). Hit at 2/2 lands (Dual Plate). Hit at 0/0 lands (Gaunt). Charge remains if the hit arrives off-window.
- Together: paint the camp cell, then camp leftover 1/0 behind the miss. Walk one tile **or** wait the paint **or** hit off 1/0 — is a complete answer.

TACTICAL_PLAN:

- Marker paints a camp tile that is **not** the player’s last exit and **not** a portal.
- Plater Plates only while sitting 1/0; else Iron Skin.
- Optional Warden is `/WARD`, not this base.

SYNERGY:

- End-turn leftover-MP-equals-max paint + leftover 1/0 miss. Wave 19 Spawn Prime standing on the **next paint pay** (idle leftover MP, not spawn-onto) and the **next leftover miss** (1/0, not 1/1). Combination, not a new sprite.

PLAYER_THREAT:

- Camping leftover MP at max on the paint, then swinging into a 1/0 plate. Spike is one consumed camp plus a blanked hit. Recoverable: walk one tile, wait, hit at 1/1.

COUNTERPLAY:

- Walk one tile (Mark misses; leftover MP leaves max). Wait the paint. Hit at 1/1 (Prime Plate’s window, not this). Hit at 2/2. Kill the Marker. The Plater without 1/0 is Iron Skin.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 6 free cells near the camp. Reject cramped maze (camp-in-a-closet).
- No void on the camp ring. Paint must not be a portal.

AI_REQUIREMENTS:

- Marker: setter; skip if they will walk. Until leftover-MP-equals-max writer exists, this sheet must not ship.
- Plater: guardian; skip leftover not 1/0.
- Soph 2–3.

VARIANTS:

- `FSN-IDLE-THIN/WARD` — Idle Thin full: add `ROLE-PLATE` (`plate_warden`) as a third body. Never two markers. **Never PAIR Mark + Plate without the Warden peeler.**
- `FSN-IDLE-THIN/IDLE` — Thin Idle: replace Marker with `ROLE-IDLE-PLATE` and add `ROLE-PLATE`. Camp leftover-1/0 miss, then camp leftover-MP-equals-max miss after they walk the last AP. **Never PAIR Thin Plate + Idle Plate** as a two-body.
- `FSN-SPAWN-PRIME` remains the spawn-onto / leftover-1/1 CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-BRIER-WIDE

FORMATION_ID: `FSN-BRIER-WIDE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-BRIER-SKIP` — `pawn` **without** heal / proposed `brier_skipper` — pack median — pathLength-2 Thorned Ground skip
- `ROLE-WIDE-STING` — `pawn` **without** heal / proposed `wide_stinger` — pack median or −1 — leftover AP≥2/MP≥1 poke

VARIANT_RULES:

- Distinct from `FSN-SLIDE-CAP` (1-tile **conveyor** auto-push skip + leftover-MP===max poke). This sheet is **pathLength exactly 2 ignores Thorned Ground extra** plus leftover **AP ≥ 2 AND MP ≥ 1** poke. Length ≥ 3 still pays. Dual Keep 2/2 **opens** Wide Sting.
- Band 0: Skipper Strike only; Stinger Strike only. If kit band is still 0, **do not spawn this id** — show `FSN-SLIDE-CAP`.
- Elite: Stinger only. Skipper never gets Slide Skip / Rift Skip / Ghost Step.
- Unlock after `FSN-SLIDE-CAP` **or** `FSN-SEPTET-SIP`.
- Map **must** already run Thorned Ground. Extra room `brier_nave` is **not** this family.
- Random 30% family lottery is **off**.
- Lava / spike / ice leave-tax / glyph-tax / Void Rift / conveyor auto-push still tick.

SPELL_POOL_INTERACTIONS:

- Brier Skip: next walk of **pathLength exactly 2** ignores Thorned Ground extra. PathLength 1 already deals 0. PathLength ≥ 3 still pays.
- Wide Sting: 10, +8 iff leftover AP **≥ 2 AND** leftover MP **≥ 1**. Dual Keep 2/2 **hits**. Leftover 1/0 is Thin Gait, 10 only. Leftover 1/1 is Prime Gait, 10 only. Leftover 2/0 is Gait Gift’s window, 10 only.
- Together: skip the thorns at length 2, then poke a fat leftover. Force a length-3+ walk **or** spend to 1 AP or 0 MP — is a complete answer.

TACTICAL_PLAN:

- Skipper arms only on Thorned Ground when a length-2 dest threatens; skip if they only need a 1-tile walk.
- Stinger lurks at 3 and commits the bonus when leftover AP ≥ 2 and leftover MP ≥ 1 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Length-2 Thorned skip + leftover-AP≥2/MP≥1 poke. Wave 19 Slide Cap standing on the **next skip** (Thorned Ground length 2, not conveyor length 1) and the **next leftover poke** (fat leftover, not leftover-MP===max). Combination, not a new sprite.

PLAYER_THREAT:

- Crossing thorns at length 2 then eating 18 on Dual Keep 2/2. Spike is one 18. Recoverable: Root, spend to 1/0, force length 3.

COUNTERPLAY:

- Root. Stand so length 2 is not a threat. Spend to leftover 1/0. Sit leftover 1/1. Force a length-3+ walk (they pay thorns). Kill the Stinger (glass). The Skipper without Thorned Ground is Strike.

MAP_REQUIREMENTS:

- `openField` or `asymmetric` **with Thorned Ground active** and a legal length-2 dest that is not the only exit.
- Weight 0 off Thorned Ground. Weight 0 if the only length-2 dest is a lava / portal tile.
- One clean aisle that is **not** Thorned Ground must remain (the designed answer).

AI_REQUIREMENTS:

- Skipper: flanker; skip if Thorned Ground is not active or next walk is not pathLength 2.
- Stinger: flanker; skip rider if leftover AP < 2 or leftover MP < 1 unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-BRIER-WIDE/TIDE` — Brier Wide full: add `ROLE-KITER` (`tide_shade`) as a third body. Live tide melee −1 MP counts toward the Slow cap. Never two skippers. **Never PAIR Skip + Tide without the Stinger peeler.**
- `FSN-SLIDE-CAP` remains the conveyor / leftover-MP===max CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-WATCH-PRIME

FORMATION_ID: `FSN-WATCH-PRIME`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WATCH-BIND` — `bishop` **without** heal / proposed `watch_binder` — pack median — overwatch snap forbids next walk
- `ROLE-PRIME-GAIT` — `pawn` **without** heal / proposed `prime_gaiter` — pack median or −1 — leftover 1/1 poke

VARIANT_RULES:

- Distinct from `FSN-WATCH-THIN` (overwatch snap **taxes next spell +1 AP** + leftover-**1/0** poke). This sheet is **snap forbids the walker’s next walk** plus leftover **exactly 1/1** poke. Dual Keep 1/1 **opens** Prime Gait. Dual Keep 1/0 is Thin Gait, skip.
- Band 0: Binder Frost only; Gaiter Strike only. If kit band is still 0, **do not spawn this id** — show `FSN-WATCH-THIN`.
- Elite: Gaiter only. Binder never gets Watch Tax / Watch Drain / Watch Root / Watch Sip.
- Unlock after `FSN-WATCH-THIN` **or** walked into Hold Ground / Far Watch this run.
- **Never PAIR Bind + Gun.** `/GUN` is the 3-body.
- Random 30% family lottery is **off**.
- Snap still deals. Send a pet to eat the snap.

SPELL_POOL_INTERACTIONS:

- Watch Bind: overwatch snap **forbids the walker’s next walk**. Blink / Swap / Twin Gate stay legal. Snap consumes the paint. Observation is the **arm**.
- Prime Gait: 10, +8 iff leftover AP === 1 **AND** leftover MP === 1. Leftover 1/0 is Thin Gait, 10 only. Leftover 2/2 is Wide Sting, 10 only. Dual Keep 1/1 **hits**.
- Together: snap the choke, then poke leftover 1/1. Do not enter **or** blink **or** sit off 1/1 — is a complete answer.

TACTICAL_PLAN:

- Binder paints a choke cell that is **not** the only exit.
- Gaiter lurks at 3 and commits the bonus when leftover is 1/1 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Overwatch next-walk lock + leftover-1/1 poke. Wave 19 Watch Thin standing on the **next snap** (forbid walk, not tax next spell) and the **next leftover poke** (1/1, not 1/0). Combination, not a new sprite.

PLAYER_THREAT:

- Walking the choke then eating 18 on Dual Keep 1/1 with no next walk. Spike is one 18 plus a locked next walk. Recoverable: do not enter, blink, sit 1/0, send a pet.

COUNTERPLAY:

- Do not enter the cell. Blink / Swap. Send a pet to eat the snap. Sit leftover 1/0 (Thin Gait’s window, not this). Sit leftover 2/2. Kill the Gaiter (glass). The Binder without an enter is Frost.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with a choke **plus** a side aisle.
- Weight 0 on 1-tile tunnels (snap + walk lock on the only tile is a hardlock). Player must have a tile off the overwatch band.

AI_REQUIREMENTS:

- Binder: artillery; skip if already in 1–2 or no overwatch is armed; never Watch Tax / Watch Root / Watch Drain.
- Gaiter: flanker; skip leftover not 1/1 unless 10 still kills.
- Soph 2–3.

VARIANTS:

- `FSN-WATCH-PRIME/GUN` — Watch Prime Hunt full: add `ROLE-SNIPER` (`glass_sniper`) as a third body. Never two guns. **Never PAIR Bind + Gun without the Gaiter peeler.**
- `FSN-WATCH-THIN` remains the next-spell-tax / leftover-1/0 CELL; do not merge ids.

STATUS: PROPOSED

---

### FSN-SEPTET-CHOIR

FORMATION_ID: `FSN-SEPTET-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SEPTET-MEND` — `queen` **with** heal / proposed `septet_mender` — pack median
- `ROLE-VERSE-SEPTET` — `bishop` **without** heal / proposed `verse_septeter` — pack median — last-id until leftover-sum===7
- `ROLE-HAZARD` — `knight` / live `ember_knight` or proposed `ignite_alchemist` — pack median — Inferno; live melee burn off unless the variant says so

VARIANT_RULES:

- Unlock after `FSN-SESTET-CHOIR` **or** `FSN-SEPTET-STEP`. Wave 20 “Septet Choir.”
- Elite: Verser only. Mender and Ignite stay junior.
- Inferno is the **one** rare. Stack gate ≥ 2 public DoT ticks before the first Inferno (same as drop-1 Mark sheets). One Inferno cadence.
- No Swap. No Drain. No Sestet Mend / Stave Mend / Score Mend / Tally Mend / Poise Mend / Wide Gift on this sheet (PAIR bans).
- `lastResolvedSpellId` required. Dual Keep **cannot** peel Verse Septet.
- If kit band is still 0, **do not spawn this id**.

SPELL_POOL_INTERACTIONS:

- Septet Mend 8 iff both leftover sums === 7. Dual Keep 2/2 is Wide Gift / Poise — Shield.
- Verse Septet: last resolved id **illegal until leftover AP + leftover MP === 7**. `0 = 0` does **not** lift. `2 = 2` does **not**. `3 = 3` does **not**. `3 = 2` does **not**. `4 = 2` does **not**. `1 = 1` does **not**. Dual Keep does **not**. Shove does **not**.
- Ignite / ember Inferno (8/turn × 3, CD 3) is the punish for sitting on 7 to peel Verse. Do not Inferno the same turn as Mend if that hides the leftover window.

TACTICAL_PLAN:

- Turn 1: Verser arms if a last-id exists; else Frosts. Mender Shields unless both already sit on 7. Ignite holds Inferno until LoS and the player is not already on a walk-hazard.
- If the Mender dies, remaining pair is Verse + burn — intended.

SYNERGY:

- Leftover-sum-7 heal + last-id until leftover-sum-7 + ignite. Wave 19 Sestet Choir standing on the **next leftover-sum** (7). Combination, not a new monster. Sit Dual Keep and Inferno still comes.

PLAYER_THREAT:

- Sitting (4,3) to peel Verse, then eating Mend 8 plus Inferno. Spike is one Inferno window. Recoverable: recast a different id, sit off 7, kill the Verser.

COUNTERPLAY:

- Recast a different id (Verse peels without sitting 7). Sit Dual Keep 2/2 (Mend misses; Verse does **not** peel). Dump to 4/2 (Sestet window, not this). Kill the Verser (glass). Frost the ember’s MP. Cursed Wound the Mender.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Inferno can land.

AI_REQUIREMENTS:

- Mender: healer; skip either leftover sum ≠ 7.
- Verser: controller; skip no `lastResolvedSpellId`; Dual Keep does not peel.
- Ignite: flanker; **not** berserk; one Inferno cadence.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-SEPTET-CHOIR/NO-IGNITE` — drop Ignite if Inferno apply is not ready; keep Mend + Verse (softer BRIGADE).
- `FSN-SESTET-CHOIR` remains leftover-sum-6-unequal; do not merge ids.

STATUS: PROPOSED

---

### FSN-WIDE-QUAD

FORMATION_ID: `FSN-WIDE-QUAD`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-WIDE-GIFT` — `queen` **with** heal / proposed `wide_gifter` — pack median
- `ROLE-CADENCE-QUAD` — `bishop` **without** heal / proposed `cadence_quadder` — pack median — remaining `n>4` → `4`
- `ROLE-CANTOR` — `queen` / proposed `font_cantor` or live default with `starter-heal` — pack median — self-heal + Shield

VARIANT_RULES:

- Unlock after `FSN-GAIT-TERN` **or** `FSN-SEPTET-STEP`. Wave 20 “Wide Quad.”
- Elite: Quadder only. Gifter and Font stay junior.
- Dual Keep 2/2 **is** Wide Gift **and** Poise **and** Dual Plate. Dual Keep 2/0 is Gait Gift, skip. Dual Keep 1/1 is Prime Gift, skip.
- **Never PAIR Quad + Quarte.** `/` wait: `FSN-QUARTE-VERSE/QUAD` is the COURT.
- Font: Blood Mend (self) + Shield (ally). **No** Inferno. At most one Font. Extra door `floor_precentor` is **not** this family.
- Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce stay off (PAIR bans).
- If kit band is still 0, **do not spawn this id**.

SPELL_POOL_INTERACTIONS:

- Wide Gift 8 iff leftover **AP ≥ 2 AND leftover MP ≥ 1**. One-body. (4,3) is Wide Gift **and** a Septet pair — Septet still needs **both** bodies (`FSN-SEPTET-STEP`, not this).
- Cadence Quad: remaining `n>4` → `4`. Fours stay 4. Threes stay 3. Quarte would have **killed** a 4; this **writes** a 5+ to 4.
- Font Shields the Gifter when the Gifter is under 50%, else self-mends. Ally `targetId` apply required for Shield.

TACTICAL_PLAN:

- Turn 1: Quadder Quads if a nuke remaining is 5+; else Frosts. Gifter Wide-Gifts only on AP≥2/MP≥1 and missing HP ≥ 8; else Shields. Font Shields the Gifter.
- If the Gifter dies, remaining pair is Quad + glass healer — intended.

SYNERGY:

- Leftover-AP≥2/MP≥1 heal + remaining n>4→4 + font. Wave 19 Gait Tern standing on the **next leftover-heal** (MP≥1, not MP=0) and the **next remaining rewrite** (>4→4, not >3→3). Combination, not a new sprite. Dual Keep 2/2 **opens** the heal.

PLAYER_THREAT:

- Dual Keep 2/2 getting 8, then a 7-CD Inferno compressed to 4. Spike is low. Misplay is sitting fat leftover into Wide Gift forever.

COUNTERPLAY:

- Spend to leftover 1/0 (Gait Gift / Thin Gait window, not this). Sit leftover 1/1 (Prime Gift, not this). Recast the remaining-5+ nuke first. Kill the Gifter (glass). Cursed Wound.

MAP_REQUIREMENTS:

- `openField` or `arena`. Font needs a retreat tile that is not the Gifter’s choke.
- No Thorned Ground on the only path to the Font.

AI_REQUIREMENTS:

- Gifter: healer; skip leftover AP < 2 or leftover MP < 1.
- Quadder: controller; skip all-already-≤4; never Quarte the same turn.
- Font: healer + ally Shield. Same apply gate as `FSN-QUIET-CHOIR`.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4.

VARIANTS:

- `FSN-WIDE-QUAD/NO-FONT` — drop Font if ally Shield apply is missing.
- `FSN-GAIT-TERN` remains leftover-AP≥2/MP=0 + remaining n>3→3; do not merge ids.

STATUS: PROPOSED

---

### FSN-SEPTET-QUIET

FORMATION_ID: `FSN-SEPTET-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SEPTET-STEP` — `queen` **without** heal / proposed `septet_stepper` — pack median
- `ROLE-SEPTET-MEND` — `queen` **with** heal / proposed `septet_mender` — pack median
- `ROLE-COVER` — `pawn` or `knight` / proposed `cover_squire` — pack median + 1 — body-block

VARIANT_RULES:

- Unlock after `FSN-SEPTET-STEP` **and** (`FSN-SESTET-QUIET` or `FSN-STAVE-QUIET`). Wave 20 “Septet Quiet.”
- Elite: Cover only. Stepper and Mender stay junior.
- Cover: Strike + Shield. Swap peel is the **one** rare (legal dest only). No Inferno.
- Septet Lend is `/LEND`, not this base.
- Random 30% family lottery is **off**.
- Ally `targetId` apply required for Cover Shield.

SPELL_POOL_INTERACTIONS:

- Same leftover-sum===7 Mend / Step as `FSN-SEPTET-STEP`. Cover Shield is RES, not a lock.
- Dual Keep 2/2 still cannot open Septet. Cover does not also carry Wide Gift (PAIR bans).

TACTICAL_PLAN:

- Cover interposes on the Mender axis. Stepper joins only when the Mender sits leftover-sum 7. Mender Mends only on the window.
- If Cover dies, remaining pair is a weaker `FSN-SEPTET-STEP` — intended.

SYNERGY:

- Septet step + septet mend + cover. Wave 19 Sestet Quiet standing on the **next leftover-sum** (7). Three bodies, one leftover-sum tell.

PLAYER_THREAT:

- Long fight. Spike is low. The fail is never looking at the Mender.

COUNTERPLAY:

- Same leftover answers as `FSN-SEPTET-STEP`. Peel Cover to open the gap. Cursed Wound the Mender. Walk around; Cover is MP-poor.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Mender must have a retreat tile that is not Cover’s choke.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Stepper / Mender: same as `FSN-SEPTET-STEP`.
- Cover: guardian interpose + optional Swap peel.
- Soph 3–4. `AI_BACKLINE_PROTECT` on. `groupTactics` at 4.

VARIANTS:

- `FSN-SEPTET-QUIET/LEND` — Lend Hood escort: replace Cover with `ROLE-SEPTET-LEND` + `ROLE-SEPTET-HOOD` + `tempo_precentor`. Cash the window with +1/+1 (sum 9), or hold (4,3) through a miss. **Never PAIR Lend + Hood without the Tempo peeler.** Unlock after this BRIGADE.
- `FSN-SESTET-QUIET` remains leftover-sum-6-unequal; do not merge ids.

STATUS: PROPOSED

---

### FSN-FEUD-SEPTET

FORMATION_ID: `FSN-FEUD-SEPTET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-FEUD-TURN` — `queen` **without** heal / proposed `feud_turner` — pack median
- `ROLE-SEPTET-MEND` — `queen` **with** heal / proposed `septet_mender` — pack median
- `ROLE-SEPTET-STING` — `pawn` **without** heal / proposed `septet_stinger` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-SEPTET-STEP` **and** `FSN-SEPTET-SIP`. Wave 20 “Feud Septet.” Distinct from `FSN-PSALM-SESTET` (mixed-side invert, **caster unchanged**).
- Elite: Turner only. Mender and Stinger stay junior.
- Feud Turn is the **one** rare. Invert leftover AP↔MP on **the caster and one hostile**. Caster leftover **does change**. Sum invariant: (4,3)→(3,4) **stays Septet**. (4,2)→(2,4) **stays Sestet**. Solo caster with a living hostile **does** fire.
- **Never PAIR Feud + Psalm / Hymn / Duel / Purse.**
- No Inferno. No Drain. No Sestet Mend on this sheet.

SPELL_POOL_INTERACTIONS:

- Feud Turn: two leftover snapshots + two writes. Equal leftover is a no-op. Player-side summons are **not** the second body.
- Septet Mend / Septet Sting still need leftover-sum 7 **after** the invert. Invert (7,0)→(0,7) **stays** Septet; Invert (4,3)→(3,4) **stays** Septet; Invert (5,2)→(2,5) **stays** Septet.
- Dual Keep 2/2 on both is a double no-op plus Wide Gift / Poise — skip Feud.

TACTICAL_PLAN:

- Turn 1: Turner inverts if a hostile sits in r3 and at least one pair is unequal; prefer Septet pairs. Mender Mends if both leftover sums === 7 after invert. Stinger commits the bonus on leftover-sum 7.
- Hostiles start ≥ 4 apart. Never turn-1 surround.

SYNERGY:

- Caster+hostile leftover invert + leftover-sum-7 heal + leftover-sum-7 sting. Wave 19 Psalm Sestet standing on the **next invert** (caster participates, not caster-stays). Combination, not a new sprite. Sum invariant keeps Septet Septet.

PLAYER_THREAT:

- Sitting (7,0) then getting inverted to (0,7) and Stung 18 while Mend 8 lands. Spike is one 18. Recoverable: sit 2/2 on both, sit the Turner on a window they did not want to leave.

COUNTERPLAY:

- Sit 2/2 on both (double no-op). Sit 3/3. Sit 4/2 (Sestet after invert still Sestet — not this Sting). Kill the Turner (glass). Quiet Hex after they invert into a 3-AP spell.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. Turner needs range 3.
- No Time Warp.

AI_REQUIREMENTS:

- Turner: controller; skip double-equal / double-empty / missing hostile; caster leftover **does** write.
- Mender: healer; skip either leftover sum ≠ 7 **after** invert.
- Stinger: flanker; skip leftover sum ≠ 7 unless 10 still kills.
- Soph 3–4. Blackboard: `plannedInvertPair` so Mend and Sting agree on post-invert leftover.

VARIANTS:

- `FSN-FEUD-SEPTET/NO-STING` — drop Stinger if leftover-sum sting is not ready; keep Turner + Mender (softer BRIGADE).
- `FSN-PSALM-SESTET` remains mixed-side invert with caster unchanged; do not merge ids.

STATUS: PROPOSED

---

### FSN-QUARTE-VERSE

FORMATION_ID: `FSN-QUARTE-VERSE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-CADENCE-QUARTE` — `bishop` **without** heal / proposed `cadence_quarterer` — pack median — remaining `4` → `0`
- `ROLE-VERSE-SEPTET` — `bishop` **without** heal / proposed `verse_septeter` — pack median
- `ROLE-TAX` — `bishop` / proposed `tax_scribe` or live `bone_scribe` — pack median — glyph tax; **no** drain

VARIANT_RULES:

- Unlock after `FSN-PRIME-TAX` **or** `FSN-SEPTET-CHOIR`. Wave 20 “Quarte Verse.”
- Elite: Quarterer only. Verser and Tax stay junior.
- **Never PAIR Quad + Quarte.** `/QUAD` is the COURT.
- Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce stay off (PAIR bans). Extra door `quarte_precentor` is **not** this family.
- Tax is the **one** rare. Drain Courage is COURT, not this sheet (two AP engines).
- `lastResolvedSpellId` required.

SPELL_POOL_INTERACTIONS:

- Cadence Quarte: remaining `n===4` → `0`. Ones / twos / threes / fives+ unchanged. Quad would have **left** a 4; this **kills** a 4.
- Verse Septet: last-id illegal until leftover-sum === 7. Dual Keep cannot peel. `4 = 2` cannot peel.
- Glyph Tax: +1 AP to cast from a 3×3, 0 damage. Leave-the-zone is the answer. Tax will not overlap two zones.

TACTICAL_PLAN:

- Turn 1: Tax paints a 3×3 on the good LoS tile. Quarterer Quartes if a nuke remaining is 4; else Frosts. Verser arms if a last-id exists.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Remaining 4→0 + last-id until leftover-sum-7 + glyph tax. Wave 19 Tierce Verse standing on the **next remaining rewrite** (4→0, not 3→0) and the **next leftover-sum peel** (7, not 6 unequal). Three bishops, three readable windows.

PLAYER_THREAT:

- A remaining-4 Inferno handed back, then last-id locked until they sit (4,3), inside a tax zone. Spike is one returned nuke. Recoverable: recast before Quarte, sit leftover-sum 7, leave the zone, Floor it to 1, Tern it to 3.

COUNTERPLAY:

- Recast the remaining-4 nuke first. Floor it to 1. Tern it to 3 (then this does **not** write 0). Sit leftover-sum 7 (Verse peels). Leave the tax zone. Kill the Quarterer (glass). Dual Keep does **not** peel Verse.

MAP_REQUIREMENTS:

- `openField` or `chessboard` with room to step off the tax 3×3. Tax 3×3 must not cover **all** walk-offs.
- No Time Warp.

AI_REQUIREMENTS:

- Quarterer: controller; skip all-non-4; never Quad the same turn.
- Verser: controller; skip no last-id; Dual Keep does not peel.
- Tax: caster; zone only if an exit exists; skip recast of an active tax (`AI-TEM-04`).
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-QUARTE-VERSE/QUAD` — Quad Quarte: replace Tax with `ROLE-CADENCE-QUAD` as a third body. Compress a 7 to a 4, **then** Quarte the 4 to 0 on a **later** turn. **Never PAIR Quad + Quarte on one BASE kit.** Unlock after this CADRE. Still one remaining rewrite per AP bar.
- `FSN-QUARTE-VERSE/NO-TAX` — fallback to Quarterer + Verser only (BRIGADE-shaped CADRE if zone-AP is not ready).
- `FSN-TIERCE-VERSE` remains remaining 3→0; do not merge ids.

STATUS: PROPOSED

---

### FSN-EVEN-BRICK

FORMATION_ID: `FSN-EVEN-BRICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-EVEN-TOLL` — `bishop` **without** heal / proposed `even_toller` — pack median — leftover-AP-even-≥2 walk tax
- `ROLE-BRICK-FEE` — `rook` **without** heal / proposed `brick_feer` — pack median — barrier-adjacent spell tax
- `ROLE-TURRET` — `rook` / proposed `stone_castellan` — pack median + 1 — stationary summon

VARIANT_RULES:

- Unlock after `FSN-ODD-BRICK` **or** `FSN-IDLE-THIN`. Wave 20 “Even Brick.”
- Elite: Castellan only. Toller and Feer stay junior.
- Turret cap 1, lifespan 4, `mp: 0`, must not path. Do not also roll wolf/archer. Global summon cap still 2 — this sheet uses 1.
- **Never PAIR Even Toll + Odd Toll.** **Never PAIR Brick Fee + Brick Tax.** **Never PAIR Fee + Hold.**
- Dual Keep 2/2 **is** Even Toll’s window.
- Destroying the barrier is the designed answer for Fee. Strike stays free.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Even Toll: next **walk** +1 AP if leftover **AP is even ≥ 2**. Leftover AP odd or 0/1 fizzles the tax (Even Toll already observed). Relocate / Swap do not pay.
- Brick Fee: next **non-Strike spell** +1 AP while adjacent to a **barrier**. Strike / `physical_attack` stays untaxed. No adjacent barrier fizzles the tax. Destroy the barrier and the tax drops; lock **stays** until duration.
- Turret linear shard owns a file. Iron Skin / Shield on the turret, not a second turret.
- Together: tax the next even-AP walk, then tax the next spell while barrier-adjacent. Spend to odd leftover AP **or** step off the barrier **or** Strike — is a complete answer.

TACTICAL_PLAN:

- Turn 1–2: Castellan places the turret on a choke facing the player, then Shields it. Feer Fees if a barrier is already adjacent (the turret’s door, not a new wall on the last aisle). Toller Tolls if leftover AP is even ≥ 2.
- If the turret dies, the lane opens; Castellan may retreat (`escapeRoute` at soph 6) rather than suddenly one-shot.

SYNERGY:

- Leftover-AP-even-≥2 walk tax + barrier-adjacent spell tax + turret. Wave 19 Odd Brick standing on the **next leftover-AP parity** (even ≥ 2, not odd) and the **next brick tax** (spell, not walk). Combination, not a new monster.

PLAYER_THREAT:

- Walking on leftover 2 then casting from a corner beside the turret door. Spike is tempo, not a nuke. Recoverable: spend to odd AP, step off, Strike, destroy the barrier.

COUNTERPLAY:

- Spend leftover AP to odd. Sit leftover 1. Step off the barrier. Strike (untaxed). Destroy the barrier. Burst the turret (glass gun). Walk off-axis. Kill the Toller (glass).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a file the player can take. Never a closed ring.
- Turret placement ring: ≥ 3 free cells, none void. Player must have a tile off the shard ray. A barrier **already** on the map (or the turret’s own door) must exist — Feer does not mint a last-aisle wall.

AI_REQUIREMENTS:

- Toller: controller; skip leftover AP odd or 0/1; never Odd Toll.
- Feer: controller; skip if no barrier is adjacent; never Brick Tax / Brick Hold; never mint a new barrier on the last aisle.
- Turret owner: summoner + proposed cap/cooldown fall-through (Frost or Shield, never skip-lock). New summon AI `turret` — do not reuse bomber.
- Soph 4–6. `groupTactics` on. Blackboard: `ownedFile`.

VARIANTS:

- `FSN-EVEN-BRICK/NO-TURRET` — teaching CADRE without the gun (Toller + Feer + a junior rook body).
- `FSN-ODD-BRICK` remains leftover-AP-odd walk tax + barrier-adjacent **walk** tax; do not merge ids.

STATUS: PROPOSED

---

### FSN-PURSE-SEPTET

FORMATION_ID: `FSN-PURSE-SEPTET`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-FEUD-TURN` — `queen` **without** heal / proposed `feud_turner` — pack median
- `ROLE-SEPTET-SIP` — `pawn` **without** heal / proposed `septet_sipper` — pack median
- `ROLE-SESTET-STING` — `pawn` **without** heal / proposed `sestet_stinger` — pack median − 1 — leftover-sum-6-unequal poke

VARIANT_RULES:

- Unlock after `FSN-FEUD-SEPTET` **or** `FSN-PURSE-SESTET`. Wave 20 “Purse Septet.”
- Elite: Turner only. Sipper and Stinger stay junior.
- **Never PAIR Septet Sip + Sestet Sip.** **Never PAIR Septet Sting + Sestet Sting.** The CADRE is why both leftover-sum stings exist, with a third peeler (Feud).
- Septet Sip (4,3)→(3,3) **manufactures Poise** (Sestet Sting **misses** — Poise Sting is a different sheet). Other successful sips **manufacture Sestet**: (5,2)→(4,2) is the designed Sestet Sting window.
- (0,7) fizzles Sip. Dual Keep cannot open Septet Sip.
- No Inferno. No Drain.

SPELL_POOL_INTERACTIONS:

- Feud Turn inverts caster + hostile (sum invariant). Invert (5,2)→(2,5) **stays** Septet; Sip then (2,5) needs leftover AP ≥ 1 — (2,5) has AP, Sip → (1,5) **Sestet**. Invert (4,3)→(3,4) **stays** Septet; Sip → (2,4) **Sestet**. Invert (4,3) then Sip without invert-first → (3,3) **Poise** (Sting misses).
- Sestet Sting: 10 + 8 iff leftover AP + leftover MP === 6 **AND** unequal. Dual Keep cannot open it. (3,3) is Poise, not this.
- Together: invert, then sip into Sestet, then sting the manufactured window. Sit (0,7) **or** sit 2/2 **or** sit 3/3 after a (4,3) sip — is a complete answer.

TACTICAL_PLAN:

- Turner inverts if a hostile sits in r3. Sipper Sips leftover-sum 7 with leftover AP ≥ 1. Stinger commits the Sestet bonus after a successful manufacture, or 10 if the window missed.
- Hostiles start ≥ 4 apart. Never turn-1 triple on one tile.

SYNERGY:

- Caster+hostile leftover invert + leftover-sum-7 sip manufactures Sestet (or Poise from (4,3)) + leftover-sum-6-unequal sting. Wave 19 Purse Sestet standing on the **next invert** (caster participates) and the **next sip manufacture** (Sestet or Poise, not Stave). Combination, not a new sprite.

PLAYER_THREAT:

- Getting inverted, Sipped off (5,2) into (4,2), then Sestet-Stung 18. Spike is one 18. Recoverable: sit (0,7), sit 2/2, sip-into-Poise from (4,3) and refuse the Sting.

COUNTERPLAY:

- Sit (0,7) — Sip fizzles. Sit Dual Keep 2/2. Sit (4,3) and accept the Poise manufacture (Sestet Sting misses). Kill the Sipper. Kill the Stinger (glass). Quiet Hex after invert.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp.
- ≥ 2 walk-offs after invert.

AI_REQUIREMENTS:

- Turner: skip double-equal / missing hostile.
- Sipper: skip leftover AP = 0; skip leftover sum ≠ 7.
- Stinger: skip leftover sum ≠ 6 or tied unless 10 still kills; never Septet Sting (PAIR bans).
- Soph 4–6. Blackboard: `plannedSipDest` so Sting waits for manufacture.
- `groupTactics` on.

VARIANTS:

- `FSN-PURSE-SEPTET/POISE` — after (4,3) sip, swap Sestet Stinger for a junior `poise_stinger` **only** if the run already answered `FSN-POISE-SIP`. Still not a Sip+Poise-Sip PAIR.
- `FSN-FEUD-SEPTET` remains the teaching BRIGADE; do not merge ids.
- `FSN-PURSE-SESTET` remains mixed-side invert + Sestet Sip manufactures Stave; do not merge ids.

STATUS: PROPOSED

---

### FSN-SEPTET-HOLD

FORMATION_ID: `FSN-SEPTET-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-SEPTET-HOLD` — `knight` **without** heal / proposed `septet_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-SEPTET` — `knight` **without** heal / proposed `must_septeter` — pack median — tools-until leftover-sum===7 **and** last AP
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median — body-block, gallery gap
- Optional fourth: `ROLE-SEPTET-HOOD` junior **or** omit — if present, skip if leftover sum already ≠ 7

VARIANT_RULES:

- Unlock after (`FSN-SEPTET-SIP` or `FSN-HOOK-NONA`) **and** a leader-boost CADRE. Wave 20 “Septet Hold File.”
- One elite only: the Holder-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Septet Hold + Must Septet** — the COURT is why both locks exist, with a third peeler (Warden). Walk **and** tools need leftover AP + leftover MP === 7; Must also needs last AP. Strike stays legal on Must’s body alone.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Holder walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-SEPTET-HOLD/LANE` (variant): drop Hood — Hold + Must + Warden only.

SPELL_POOL_INTERACTIONS:

- Septet Hold: cannot spend walk MP while leftover AP + leftover MP === 7. Spells stay legal. Spend one pool so the sum leaves 7 **or** Dual Keep 2/2 **or** dump to leftover-sum 6 unequal **or** dump to leftover-sum 5 **or** dump to leftover-sum 4 unequal **or** dump to leftover-sum 3 **or** dump to 3/3 **or** dump to 4/2 **or** dump both to walk. Prefer (0,7) — they have MP and cannot spend it, and have no leftover AP to cast off the window.
- Must Septet: remaining **non-Strike** spells illegal unless leftover AP + leftover MP === 7 **and this spell spends last AP**. Strike stays legal. Leftover (0,7) **blocks** every non-Strike.
- Together: Dual Keep cannot open Septet. Sitting (4,3) cannot walk **and** cannot Inferno unless last AP. Dual Keep 2/2 peels Hold (not leftover-sum 7) but does **not** peel Must unless they also spend last AP on Strike. Dump leftover to leftover-sum 6 unequal peels Hold (Sestet Hold’s window, not this one). Dump leftover to leftover-sum 5 peels Hold. Dump leftover to leftover-sum 4 unequal peels Hold. Dump leftover to leftover-sum 3 peels Hold. Dump leftover to 3/3 peels Hold. Dump leftover to 4/2 peels Hold. Dump leftover to 0/0 peels Hold. Both peels are public.
- Warden Iron Skin / Shield. `spell-rallying-cry` stays false.
- Leader boost 10% × fallen escort. Four bodies means a late Holder can become stout — cut the leader early or accept a longer finish.

TACTICAL_PLAN:

- Warden + optional Hood form a moving wall with a **gap** (never a closed box). Holder and Must sit in the pocket behind the gap.
- Holder Holds if leftover sum === 7; skip if already 2/2 or leftover-sum 6 unequal or leftover-sum 5 or leftover-sum 4 unequal or leftover-sum 3 or 3/3 or 4/2 or 1/1 or 0/0. Must Musts if they have a non-Strike they want to silence; Strike stays legal on that body.
- If a Warden dies, the wall opens; the Holder may retreat (`escapeRoute`) rather than suddenly one-shot.

SYNERGY:

- Court-scale leftover-sum-7 **walk lock** plus **tool lock** without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: spend 1 leftover so the sum leaves 7, Dual Keep 2/2, dump to leftover-sum 6 unequal, dump to leftover-sum 5, dump to leftover-sum 4 unequal, dump to leftover-sum 3, dump to 3/3, dump to 4/2, dump both, wait, kill Hold, walk the gallery, Strike.

PLAYER_THREAT:

- Highest structured leftover-sum-7 threat in this drop. Still turn-based. Failure is sitting (0,7) to kite, then neither walk nor Inferno confirms, while the Warden holds the door. Recoverable next turn after leaving leftover-sum 7 **or** dumping both pools **and** spending last AP on Strike.

COUNTERPLAY:

- Spend 1 leftover AP **or** MP so the sum leaves 7 (Hold peels). Dual Keep 2/2 (Hold peels; Must needs last AP on Strike). Dump to leftover-sum 6 unequal (Hold peels; Sestet Hold is a different COURT). Dump to leftover-sum 5 (Hold peels; Stave Hold is a different COURT). Dump to leftover-sum 4 unequal (Hold peels; Score Hold is a different COURT). Dump to leftover-sum 3 (Hold peels; Tally Hold is a different COURT). Dump to 3/3 (Hold peels; Poise Hold is a different COURT). Dump to 4/2 (Hold peels). Dump both pools and Strike (Must peels). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step off if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover sum ≠ 7; never also Root / Seal / Odd Hold / Dry Hold / Gaunt Hold / Poise Hold / Tally Hold / Score Hold / Stave Hold / Sestet Hold / Brick Hold; never Hold a body that needed to step off lava this turn (solvability).
- Must: skip if leftover sum ≠ 7; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if leftover sum already ≠ 7.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-SEPTET-HOLD/LANE` — BRIGADE-shaped: Hold + Must Septet + Warden only (ship if Hood gate is not ready). Still no Root. Still not a PAIR of Hold+Must without the Warden peeler.
- `FSN-SEPTET-HOLD/NO-HOOD` — COURT of three.
- `FSN-SEPTET-HOLD/TETRADECA` — COURT **Tetradeca Plug**: replace this id’s members with `ROLE-TETRADECA` + `ROLE-SEPTET-SILL` + `ROLE-HOOK-STRIDE`. 2×7 corridor seal, tax a neighbor at turn start, lock the next walk to (3,1). **Skip until remaining cap ≥ 14** (live cap 2). Burst the 14 HP. Walk a far **diagonal** around the bounding box (the designed counter vs Trideca’s plus and Dodeca’s 3×4). Sit on a cell so the place fizzles. Swap around the block. `summonAI === "tetradecaspan"` required. Every cell occupied. Click = **nearest cell to caster**. Do not also roll a second post. Needs a free 14-cell 2×7 plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 14. Weight 0 on maps with no free 14-cell 2×7 (solvability). **Never PAIR Tetradeca + Trideca / Dodeca / Septet Post / Hook Stride as a two-body.**
- `FSN-SEPTET-HOLD/BOUNCE` — COURT **Bounce Septet**: replace Hold + Must + Warden with `ROLE-SEPTET-BOUNCE` + `ROLE-MUST-SEPTET` + `fuse_binder`. Two leftover-sum===7 bodies, bounce 12+12 onto the wick. **Never PAIR Septet Bounce with Sestet / Stave / Score / Tally / Poise / Gaunt / Parched / Heave Bounce / Storm / Ricochet.** Unlock after `FSN-SESTET-HOLD/BOUNCE` **or** `FSN-SEPTET-SIP`. Missing second leftover-sum-7 flag → 12 only. Player keeps leftover sum ≠ 7 on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-SEPTET-HOLD/KENNEL` — COURT **Mill Kennel**: replace Hold + Must + Hood with `ROLE-SLIDE-CUT` + `ROLE-HOOK-TAX` + `ROLE-IDLE-PLATE`. Threshold poke near conveyor, then tax pet (3,1) landings **or** blank a hit while leftover MP is max — **never PAIR Tax + Plate on one BASE kit**; the COURT is why both pet / idle-miss verbs exist, with a third peeler (Cut). Unlock after `FSN-SESTET-HOLD/KENNEL` **or** `FSN-MILL-HOOK`. Weight ×2 if the player has a living summon. Dummy / Posts with empty kits are unaffected (they cannot land (3,1) for AP). Cap one kennel engine. Orthogonal pet 1-steps are free of the (3,1) tax. Hit the summoner (Idle Plate zeros the next **hit** while leftover MP is max, not the owner’s incoming Strike; Frost still deals full if they walked). Twin Gate pads do **not** count as conveyor. Drop this variant if `summonAI` is empty. Map needs painted conveyor occupancy in Chebyshev 6 of a legal floor.
- `FSN-SESTET-HOLD` remains the leftover-sum===6 unequal **and** last-AP COURT; this id is leftover **sum === 7**.
- `FSN-SESTET-HOLD/TRIDECA` remains the 13-cell plus COURT; `/TETRADECA` is the 14-cell 2×7 COURT.
- `FSN-STAVE-HOLD/DODECA` remains the 12-cell 3×4 COURT.
- `FSN-SEPTET-SIP` / `FSN-HOOK-NONA` remain the teaching PAIRs; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–20 still stand. This drop **meshes**; it does not replace.

```
PAIR:    SEPTET-STEP        SEPTET-SIP         HOOK-NONA          MILL-HOOK
              \\                 |                   |                  /
CELL:     SEPTET-GATE       IDLE-THIN          BRIER-WIDE         WATCH-PRIME
              \\                 |                   |                  /
BRIGADE:  SEPTET-QUIET      WIDE-QUAD          FEUD-SEPTET        SEPTET-CHOIR
              \\                 |                   |                  /
CADRE:    QUARTE-VERSE      EVEN-BRICK         PURSE-SEPTET
              \\                 |                  /
COURT:                    SEPTET-HOLD   SEPTET-HOLD/TETRADECA   SEPTET-HOLD/BOUNCE   SEPTET-HOLD/KENNEL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-SEPTET-STEP` | `FSN-SESTET-STEP` **or** `FSN-STAVE-STEP` |
| `FSN-SEPTET-SIP` | `FSN-SESTET-SIP` **or** `FSN-SEPTET-STEP` |
| `FSN-HOOK-NONA` | `FSN-TERN-OCTA` **or** `FSN-RING-HEPTA` |
| `FSN-MILL-HOOK` | `FSN-MIRE-DIAG` **or** `FSN-SLIDE-CAP` |
| `FSN-SEPTET-GATE` | `FSN-SESTET-GATE` **or** `FSN-SEPTET-SIP` |
| `FSN-IDLE-THIN` | `FSN-SPAWN-PRIME` **or** camped leftover MP this run |
| `FSN-BRIER-WIDE` | `FSN-SLIDE-CAP` **or** `FSN-SEPTET-SIP` |
| `FSN-WATCH-PRIME` | `FSN-WATCH-THIN` **or** walked into Hold Ground / Far Watch |
| `FSN-SEPTET-CHOIR` | `FSN-SESTET-CHOIR` **or** `FSN-SEPTET-STEP` |
| `FSN-WIDE-QUAD` | `FSN-GAIT-TERN` **or** `FSN-SEPTET-STEP` |
| `FSN-SEPTET-QUIET` | `FSN-SEPTET-STEP` + (`FSN-SESTET-QUIET` or `FSN-STAVE-QUIET`) |
| `FSN-FEUD-SEPTET` | `FSN-SEPTET-STEP` + `FSN-SEPTET-SIP` |
| `FSN-QUARTE-VERSE` | `FSN-PRIME-TAX` **or** `FSN-SEPTET-CHOIR` |
| `FSN-EVEN-BRICK` | `FSN-ODD-BRICK` **or** `FSN-IDLE-THIN` |
| `FSN-PURSE-SEPTET` | `FSN-FEUD-SEPTET` **or** `FSN-PURSE-SESTET` |
| `FSN-SEPTET-HOLD` | (`FSN-SEPTET-SIP` or `FSN-HOOK-NONA`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 21 packs (not this drop)

Wave 21 families do **not** exist yet. Same-day 2026-10-28 SPELL_PROPOSALS (`SPELL_PROPOSALS_2026-10-28.md`, open as PR #1251: Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn + Octave court) and SDE Wave 19 unique CORE (`spell-camel-stride` … `spell-camel-fold`, PR #1198, **except** Pack Camel / Camel Fold unless a later boss sheet claims them) stay Wave **21** family CORE. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations rather than cloning Wave 20 sheets.

Held verbs (do not FSN this drop): Octave Mend (both leftover AP + leftover MP **=== 8 AND unequal**), Cadence Quinte (remaining `n===5` → `0`), Pentadeca Span (occupy-weight 15; skip until remaining cap ≥ 15; live cap is 2), Kin Turn, Court Quinte, Camel Stride, Deca Oath, Glyph Reel, Camel Bite, Hollow Mark, Wide Plate, Fuse Skip, Hollow Sting, Summon Camel, Thin Gift, Cadence Quint, Prime Toll, Brick Levy, Watch Shave, Lean Gait, Glyph Cut, Fresh Plate, Pack Camel, Camel Fold. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` stay kit-only. Do **not** mint `octave_mender` / `cadence_quinter` / `pentadeca_prelate` / `kin_turner` / `cadence_quinte` this drop.

Do **not** pack `septet_holder` with `must_septeter` as a teaching pair (Wave 20 rule). `FSN-SEPTET-SIP` stays the leftover-sum-7 poke lesson; `FSN-SEPTET-HOLD` stays the walk-until leftover-sum===7 **and** last-AP COURT.

Do **not** pack `septet_mender` with `wide_gifter` as a teaching pair. `FSN-SEPTET-STEP` stays the both-bodies leftover-sum===7 lesson; `FSN-WIDE-QUAD` stays the leftover-AP≥2/MP≥1 BRIGADE. Sestet Mend stays leftover **AP + MP === 6 AND unequal** on **both** bodies (`FSN-SESTET-STEP`). Stave Mend stays leftover **AP + MP === 5** on **both** bodies (`FSN-STAVE-STEP`). Score Mend stays leftover **AP + MP === 4 AND unequal** on **both** bodies (`FSN-SCORE-STEP`). Tally Mend stays leftover **AP + MP === 3** on **both** bodies (`FSN-TALLY-STEP`). Poise Mend stays leftover **AP === MP ≥ 1** on **both** bodies (`FSN-POISE-STEP`). Gaunt Mend stays leftover-**both 0** on **both** bodies (`FSN-GAUNT-STEP`). Prime Gift stays leftover **exactly 1/1** (`FSN-PRIME-CAP`). Gait Gift stays leftover **AP ≥ 2 AND MP = 0** (`FSN-GAIT-TERN`).

Do **not** pack `septet_mender` with `sestet_mender` / `stave_mender` / `score_mender` / `tally_mender` / `poise_mender` / `gaunt_mender` / `dry_gaiter` / `dry_mender` / `lean_gifter` / `prime_gifter` / `gait_gifter`. `FSN-SESTET-STEP` stays leftover-sum===6 unequal; `FSN-STAVE-STEP` stays leftover-sum===5; `FSN-SCORE-STEP` stays leftover-sum===4 unequal; `FSN-TALLY-STEP` stays leftover-sum===3; `FSN-POISE-STEP` stays leftover-tied-≥1; `FSN-GAUNT-STEP` stays leftover-both-0; `FSN-DRY-STEP` stays leftover-MP=0; `FSN-LEAN-RISE` stays leftover-AP=0 / MP≥1; `FSN-PRIME-CAP` stays leftover-1/1; `FSN-GAIT-TERN` stays leftover-AP≥2/MP=0; this drop owns leftover **AP + MP === 7**. **0 = 0 does not fire. 2 = 2 does not fire. 3 = 3 does not fire. 3 = 2 does not fire. 3 = 1 does not fire. 3 = 0 does not fire. 4 = 2 does not fire. 1 = 1 does not fire. Dual Keep cannot fake sum 7.**

Do **not** pack `cadence_quarterer` with `cadence_quadder` as a teaching pair. `FSN-WIDE-QUAD` stays remaining `n>4→4`; `FSN-QUARTE-VERSE` stays remaining `4→0`. Cadence Tierce stays remaining `3→0` (`FSN-TIERCE-VERSE`). Cadence Tern stays remaining `n>3→3` (`FSN-GAIT-TERN`). Cadence Dock stays remaining `2→0` (`FSN-DOCK-VERSE`). Cadence Cap stays remaining `n>2→2` (`FSN-PRIME-CAP`). Cadence Snuff stays remaining `1→0` (`FSN-SNUFF-VERSE`). Cadence Rise stays remaining `1→2` (`FSN-LEAN-RISE`). Cadence Prime stays remaining `0→1` (`FSN-PRIME-TAX`). Cadence Floor stays SDE #906.

Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend **or** Poise Mend **or** Tally Mend **or** Score Mend **or** Stave Mend **or** Sestet Mend **or** Septet Mend. Do **not** clone Equal Gift as Prime Gift or Gait Gift or Wide Gift. Do **not** clone Psalm Turn as Feud Turn. Cadence Floor stays SDE #906. Cadence Prime stays drop 17. Cadence Rise / Snuff stay drop 18. Cadence Cap / Dock stay drop 19. Cadence Tern / Tierce stay drop 20. Same-day SDE Wave 19 unique CORE / Wave 20 SPELL_PROPOSALS stay Wave **21** family CORE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–20, plus Wave 20 verbs in this order (from elite-evolution §6):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-HOOK-NONA` band 0 can ship among the first** once family HP survives battle start. `FSN-SEPTET-STEP` needs band 1 heal **and** leftover-AP + leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Septet Mend / Wide Gift must live only on healer profiles.**
4. Battle-walk writers: leftover AP / leftover MP, `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`lastResolvedSpellId`**, **`struckThisTurn`**, **summon spawn onto a painted cell**, **last leftover AP spent while occupying a painted cell**, **end-turn leftover MP equals max**, **`forcedMovedThisTurn`** / `lastForcedMoveDir` / **caster-authored** force bit (force families still wait; this drop adds **zero** new force-gated CORE). Dual Keep leftover **is** leftover. Dual Keep 2/2 is Poise **and** Dual Plate **and** Wide Gift, not Septet. Dual Keep 1/1 is Poise **and** Prime Gift / Prime Plate / Prime Gait, not Septet. Dual Keep leftover-sum 4 unequal is Score, not Septet. Dual Keep leftover-sum 3 is Tally, not Septet. Dual Keep leftover-sum 5 cannot sit (max 2/2 = sum 4). Dual Keep leftover-sum 6 cannot sit. Dual Keep **cannot** sit on sum 7. Dual Keep 2/0 **opens** Gait Gift. Dual Keep 1/0 **opens** Thin Gait / Thin Plate. Dual Keep 2/2 **opens** Wide Gift / Wide Sting. Stave Lend (3,2)→(4,3) **manufactures Septet**. Sestet Lend (4,2)→(5,3) **manufactures Septet**. Septet Sip (4,3)→(3,3) **manufactures Poise**; other successful sips **manufacture Sestet**.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Septet Step occupancy dests (not `isSwap`). Slide Reel = thirteenth attract dest flavor (toward, not onto, a world portal). Brick Fee = barrier-adjacent **spell +1 AP** (not unit bash, not Brick Tax, not Brick Hold, not Brick Brace); destroy-the-barrier skip; Strike exempt.
6. `inferSummonArchetype` gains `tetradecaspan` and `septetpost` (and still needs `tridecaspan` / `sestetpost` / `dodecaspan` / `stavepost` / `hendecaspan` / `scorepost` / `decspan` / `tallypost` / `ninespan` / `poisepost` / `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–19). Raise or gate `ENEMY_SUMMON_CAP` before Tetradeca Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Septet Lend / Feud Turn). **`FSN-SEPTET-QUIET` and `FSN-SEPTET-QUIET/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-SEPTET-STEP` / `FSN-WIDE-QUAD` / `FSN-FEUD-SEPTET` heals are leftover-gated and do **not** wait on Cover’s Shield.
8. Septet Hold while leftover AP + leftover MP === 7. Must Septet / Verse Septet / Nona Oath / Hook Stride as refuse-until. Septet Sill start-turn leftover-sum-7 occupy (paint stays). Idle Mark end-turn leftover-MP-equals-max occupy (consume; walk-on free; they must not walk). Septet Post leftover-sum-7 occupy. Thin Plate leftover 1/0. Wide Sting leftover AP≥2/MP≥1. Prime Gait leftover 1/1. Wide Gift leftover AP≥2/MP≥1. Septet Hood consume-before-damage. Feud Turn caster+hostile leftover invert (caster writes; sum invariant). Cadence Quad remaining-n>4→4. Cadence Quarte remaining-4→0. Watch Bind next-walk lock on snap. Brick Fee dest occupancy skip (no barrier → skip; Strike exempt). Even Toll next-walk +1 AP if leftover AP even ≥ 2. Idle Plate next hit 0 while leftover MP equals max.
9. Summoner cooldown fall-through (tetradeca / septetpost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT tetradeca sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal. Do **not** ship Hollow Gift as Gaunt Mend. Do **not** ship Cadence Floor as a family CORE (SDE #906 owns it). Do **not** ship Cadence Prime as a family CORE (drop 17 owns it). Do **not** ship Cadence Rise / Cadence Snuff as a family CORE (drop 18 owns them). Do **not** ship Cadence Cap / Cadence Dock as a family CORE (drop 19 owns them). Do **not** ship Cadence Tern / Cadence Tierce as a family CORE (drop 20 owns them). Do **not** mint SDE Wave 19 unique CORE / Wave 20 SPELL_PROPOSALS (Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn) as this drop’s CORE.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-SEPTET-STEP`, `FSN-SEPTET-QUIET` | leftover-AP **and** leftover-MP writers on **both** bodies; leftover AP + leftover MP === 7; `0 = 0` does not fire; `2 = 2` does not fire; `3 = 3` does not fire; `3 = 2` does not fire; `3 = 1` does not fire; `4 = 2` does not fire; `1 = 1` does not fire; Dual Keep cannot fake sum 7; Septet Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-SEPTET-SIP`, `FSN-SEPTET-GATE` | leftover-AP + leftover-MP reads; Septet Sting leftover-sum===7; Sip leftover-sum-7 **and** leftover AP ≥ 1 ((0,7) fizzles; (4,3)→(3,3) manufactures Poise; other sips manufacture Sestet); Septet Post leftover-sum-7 occupy / walk-safe / dump-safe / 2/2-safe / leftover-sum-4-unequal-safe / leftover-sum-3-safe; Septet Sill start-turn leftover-sum-7, paint stays; two different tiles; `summonAI === "septetpost"` |
| `FSN-HOOK-NONA` | Hook Stride dest permutation of (3,1); Nona Oath exact 9; Strike remains legal; blink does not pay; a legal (3,1) floor **and** a tile at Chebyshev 9 exist |
| `FSN-MILL-HOOK` | thirteenth `applyAttract` dest (painted conveyor occupancy); dest is not the portal; map has painted conveyor in 6; Hook Bite share-(3,1) occupancy; never File Bite / Rank Bite / Diag Bite / Mire Reel / Lava Reel on the same PAIR |
| `FSN-IDLE-THIN` | end-turn leftover-MP-equals-max writer; walk-on free; they must not walk; leftover 1/0 miss; leftover 1/1 lands; leftover 2/2 lands; never Mark+Idle-Plate as PAIR (`/IDLE` is the 3-body) |
| `FSN-BRIER-WIDE` | pathLength-2 Thorned Ground extra skip; length ≥ 3 pays; leftover-AP≥2/MP≥1 poke; Dual Keep 2/2 hits; one clean aisle; map has Thorned Ground **or** a legal flank that is not Thorned |
| `FSN-WATCH-PRIME` | leftover next-walk **lock** on overwatch snap; still deals; never tax next spell (that is Watch Tax); never steal leftover MP (that is Watch Drain); leftover-1/1 poke; leftover 1/0 excluded (Thin); leftover 2/2 excluded (Wide Sting); never Bind+Gun as PAIR |
| `FSN-SEPTET-CHOIR` | `lastResolvedSpellId`; Septet Mend leftover-sum===7 on **both** bodies; Verse Septet leftover-sum-7 peel (`0 = 0` does not; `2 = 2` does not; `3 = 3` does not; `4 = 2` does not; Dual Keep does not; shove does not); Ignite stack gate ≥ 2 |
| `FSN-WIDE-QUAD` | leftover-AP + leftover-MP on **target** for Wide Gift (AP ≥ 2 AND MP ≥ 1); remaining `n>4` → `4`; Dual Keep 2/2 opens Wide Gift; Dual Keep 2/0 is Gait Gift, skip; Dual Keep 1/1 is Prime Gift, skip; never Quad+Quarte as PAIR; never Floor / Prime / Rise / Snuff / Cap / Dock / Tern / Tierce |
| `FSN-FEUD-SEPTET` | caster+hostile leftover AP↔MP invert; caster writes; sum invariant; equal leftover is a no-op; never Psalm Turn / Hymn Turn / Duel Turn / Purse Turn PAIR |
| `FSN-QUARTE-VERSE` | remaining `n===4` → `0`; `lastResolvedSpellId`; leftover-sum===7 peels Verse; never Quad / Tern / Cap / Dock / Rise / Prime / Floor the same turn; never Verse-Septet+Scribe as PAIR |
| `FSN-EVEN-BRICK` | leftover-AP-even-≥2 next-walk +1 AP; Brick Fee barrier-adjacent spell +1 AP; Strike exempt; destroy-barrier skip; turret AI (`mp: 0`, no path); never Fee+Tax PAIR; never Toll+Scribe PAIR |
| `FSN-PURSE-SEPTET` | caster+hostile invert **then** Septet Sip manufactures Sestet **or** Poise from (4,3) **then** Sestet Sting; (0,7) fizzles Sip; never Septet-Sip+Sestet-Sip PAIR; never Septet-Sting+Sestet-Sting PAIR |
| `FSN-SEPTET-HOLD` | Septet Hold until leftover AP + leftover MP === 7; Must Septet leftover-sum-7 **and** last-AP tool-lock; never Root; spend 1 leftover so the sum leaves 7 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must |
| `FSN-SEPTET-HOLD/TETRADECA` | `summonAI === "tetradecaspan"` **and** remaining cap ≥ 14 (live cap 2 → skip); axis-aligned 2×7, every cell occupied; click = nearest cell to caster; a diagonal walk-off around the bounding box remains |

---

## Sources (line-accurate, 2026-10-29)

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
- Wave 20 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-28.md` (PR #1248) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-10-27.md` (PR #1177); leftover SDE Wave 18 unique CORE in PR #1143
- Drop 20: `docs/design/ENEMY_FORMATIONS_2026-10-28.md` (PR #1237)

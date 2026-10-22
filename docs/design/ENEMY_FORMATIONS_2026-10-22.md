# Enemy synergy and formation catalog (drop 14)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-10-22  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–13 already taught the seven pairing words and Waves 1–12 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 13 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-10-21.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-10-21.md) (open as PR #840) and deferred by drop 13 (PR #825): Imprint Choir, Six Plug, Odd Lean, Lean Court, Parched Quiet, Dry Gate, Bounce File, Lean Hold File, Diag Mid, Void Dwell, Foe Escort, Own Watch, Cinder Full, Still Rest, Spent Crack, Pair Dry, Toll Kennel.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727), [`ENEMY_FORMATIONS_2026-09-29.md`](./ENEMY_FORMATIONS_2026-09-29.md) (drop 12 — open as PR #794), [`ENEMY_FORMATIONS_2026-10-21.md`](./ENEMY_FORMATIONS_2026-10-21.md) (drop 13 — open as PR #825). Family sheets: PR #840. Spell verbs: Wave 12 tactical ids in PR #787 (`spell-cadence-imprint` … `spell-six-span`, **except** `spell-parched-mend`) plus leftover SDE Wave 11 unique CORE (`spell-diag-stride` … `spell-dry-mend`) and SDE Wave 12 **Dry Gait** (`spell-dry-gait`, PR #802 — SDE won leftover-MP=0 heal).

**Hard rules (Wave 13 pack law — plus every older law still stands):**

- Do **not** pack `dry_gaiter` with `dry_mender` / `still_mender` / `heave_mender` / `both_mender` / `gait_mender` / `bar_mender` / `pale_cantor` as a PAIR (leftover-**MP**=0 heal vs leftover-**AP**=0 heal vs caster-walk-spent=0 vs dual-force vs dual-walk vs spell-resolved vs unconditional). `FSN-HEAVE-LEND` / `FSN-BOTH-SPEND` / `FSN-BAR-PIN` stay theirs. `FSN-DRY-STEP` owns leftover-MP=0 heal. `FSN-STILL-REST` owns walk-spent=0 heal. `FSN-PAIR-DRY` owns leftover-AP=0 heal.
- Do **not** pack `cadence_imprinter` with `cadence_thief` / `cadence_rester` / `cadence_halver` / `cadence_pinner` / `cadence_flusher` / `cadence_stretcher` / `cadence_trimmer` as a PAIR (copy matching remaining vs steal vs skip-own-tick vs ÷2 vs freeze-one vs ally-all→0 vs ×2 vs −1). `FSN-HALVE-PACE` / `FSN-BAR-PIN` stay theirs. BRIGADE `FSN-IMPRINT-CHOIR` is the copy-then-pin lesson, never a two-CD PAIR.
- Do **not** pack `six_prelate` with `sept_prelate` / `penta_prelate` / `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `drift_prelate` / `lean_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Six counts as **6**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 6. Live cap is **2** — skip `FSN-LEAN-HOLD/SIX`. `FSN-DRIFT-COURT/SEPT` / `FSN-CAST-QUIET/PENTA` stay theirs.
- Do **not** pack `odd_hooder` with `near_hooder` / `mid_hooder` / `far_hooder` / `sidestep_warder` / `hood_lurker` / `own_plater` / `off_plater` as a PAIR (odd-Chebyshev miss vs ≤1 vs exactly-2 vs ≥3 vs any-range skip vs Fog Hood vs own-turn miss vs off-turn miss). `FSN-NEAR-MUST` / `FSN-MID-DRIFT` / `FSN-WICK-HOOD` stay theirs. `FSN-OWN-WATCH` owns Own Plate.
- Do **not** pack `lean_stinger` with `dry_stinger` / `damp_stinger` / `ready_stinger` / `lone_purser` / `pair_purser` / `full_purser` as a PAIR (leftover **AP = 0 and leftover MP ≥ 1** poke vs leftover AP = 0 vs leftover MP ≥ 2 vs leftover AP ≥ 1 **and** MP ≥ 1 vs leftover AP **exactly 1** vs leftover AP **exactly 2** vs leftover AP ≥ 3). `FSN-DRY-TAX` / `FSN-DUAL-READY` / `FSN-STRIDE-DAMP` stay theirs. `FSN-PAIR-DRY` owns Pair Purse.
- Do **not** pack `parched_stepper` with `home_stepper` / `heave_stepper` / `ally_stepper` / `hook_chaplain` / `cover_squire` as a PAIR (join leftover-**MP**=0 ally vs ungated vs force-moved ally vs they-land-next-to-caster vs line rescue vs cover). BRIGADE `FSN-PARCHED-QUIET` is the three-body lesson. `FSN-HOME-SILL` / `FSN-HEAVE-QUIET` / `FSN-ALLY-SILL` stay theirs.
- Do **not** pack `parched_siller` with `drift_siller` / `quiet_siller` / `cast_siller` / `gait_sealer` / `body_siller` as a PAIR (tile forbids **walk MP** vs relocate dest vs cannot-Strike vs cannot-non-physical vs unit cannot walk/spells legal vs primary cannot leave). `FSN-DRIFT-GATE` / `FSN-CAST-QUIET` stay theirs.
- Do **not** pack `dry_holder` with `drift_holder` / `boot_holder` / `hold_knight` / `gait_sealer` / `snare_weaver` as a PAIR (cannot walk until leftover **AP = 0** vs until force-moved vs until Strike vs cannot Strike until walk vs cannot walk/spells legal vs Root). COURT `FSN-DRIFT-COURT` stays the shove-peel lesson. `FSN-BOOT-OATH` stays Strike-peel.
- Do **not** pack `lean_lender` with `spent_lender` / `boot_lender` / `drift_lender` / `tempo_precentor` / `leftover_lender` as a PAIR (+1 MP if leftover **AP = 0** vs +1 MP if walked vs unmoved +1 vs +1 AP if forced vs ungated +1 vs dump). `FSN-BOTH-SPEND` / `FSN-HEAVE-LEND` stay theirs.
- Do **not** pack `parched_sipper` with `gait_sipper` / `drift_sipper` / `soul_siphon` / `ledger_siphon` as a PAIR (steal leftover MP iff leftover **AP = 0** vs steal MP iff walked vs steal leftover AP iff forced vs ungated sip vs ungated AP sip). `FSN-NEAR-STEP/SIP` / `FSN-DUAL-BANK` stay theirs.
- Do **not** pack `lean_prelate` with `dummy_prelate` / `drift_prelate` / `dwell_marker` / `ingress_marker` / `bait_prelate` as a PAIR (end-turn occupy **and leftover AP = 0** detonate vs taunt vs relocate-landing vs ungated end-turn occupy vs walk-enter vs bait). `FSN-DRIFT-GATE` stays relocate-detonate. `FSN-VOID-DWELL` owns ungated end-turn occupy.
- Do **not** pack `parched_bouncer` with `heave_bouncer` / `storm_caller` / `ricochet_vicar` / `split_fanger` as a PAIR (bounce to another leftover-**MP**=0 hostile vs force-moved bounce vs any-nearest bounce vs predicate bounce vs split). `FSN-HEAVE-CHOIR/BOUNCE` stays Bounce File (force). `FSN-LEAN-HOLD/BOUNCE` is leftover-MP Bounce File, never a two-bounce PAIR.
- Do **not** pack `must_leaner` with `hold_caster` / `tool_holder` / `must_drifter` / `must_stepper` / `cast_siller` as a PAIR (non-Strike illegal unless leftover **MP = 0** vs all spells until walk vs tools until Strike vs remaining walks follow force dir vs remaining Chebyshev 1 vs cannot-non-physical tile). `FSN-HOLD-VERSE` / `FSN-DRIFT-COURT` / `FSN-NEAR-MUST` stay theirs.
- Do **not** pack `verse_leaner` with `verse_pacer` / `last_muter` / `verse_taxer` / `first_verser` / `once_cantor` as a PAIR (last-id illegal until leftover **MP = 0** vs until they walk vs last-id illegal vs last-id +1 AP vs must this id first vs echo lock). `FSN-HALVE-PACE` / `FSN-TRIM-TAX` stay theirs.
- Do **not** pack `lean_holder` with `hold_knight` / `rite_holder` / `tool_holder` / `boot_holder` / `must_leaner` as a PAIR (cannot Strike until leftover **MP = 0** vs until walk vs until a spell vs tools-until-Strike vs walk-until-Strike vs tools-until-leftover-MP=0). COURT `FSN-LEAN-HOLD` is the three-lock lesson. `FSN-RITE-LONG` / `FSN-BOOT-OATH` stay theirs.
- Do **not** pack `diag_warder` with `diag_locksmith` / `inch_warder` / `must_stepper` / `must_spanner` / `axis_locksmith` as a PAIR (next walk **diagonal-only** vs **forbids** diagonal vs one next ≤ 1 vs remaining Chebyshev 1 vs Manhattan 2 vs file lock). `FSN-INCH-OATH` / `FSN-NEAR-MUST` stay theirs.
- Do **not** pack `mid_oather` with `long_oather` / `near_oather` / `unit_oather` / `ground_oather` / `mid_hooder` as a PAIR (next spell exact Chebyshev **2** vs ≥ 3 vs ≤ 1 vs unit-class vs ground-only vs next **hit** from exactly 2 → 0). `FSN-INCH-OATH` leftover oaths stay theirs. `FSN-MID-DRIFT` owns Mid Hood.
- Do **not** pack `void_reeler` with `cinder_reeler` / `paint_reeler` / `foe_reeler` / `ally_reeler` / `file_reeler` / `sink_chanter` as a PAIR (pull toward **void/portal** vs hazard vs paint vs other hostile vs ally vs file-to-caster vs tile gravity). `FSN-CINDER-MARK` / `FSN-PAINT-NOOK` / `FSN-FOE-FANG` / `FSN-BRAND-REEL` stay theirs.
- Do **not** pack `foe_biter` with `side_biter` / `lone_stinger` / `nook_biter` / `field_biter` / `wall_biter` as a PAIR (adj-**hostile-to-target** bite vs adj-**ally** vs isolation vs exactly-one-block vs 0-block vs hug). `FSN-PAINT-NOOK` / `FSN-LONE-NAIL` / `FSN-DRIFT-COURT/BRACE` stay theirs.
- Do **not** pack `dwell_marker` with `ingress_marker` / `stride_marker` / `lean_prelate` / `gait_wicker` / `exit_stinger` / `fuse_binder` as a PAIR (end-turn occupy vs cell-enter vs cell-leave vs leftover-AP=0 occupy vs unit walk-MP wick vs first leave vs tile bomb). `FSN-CINDER-MARK` / `FSN-STRIDE-PULPIT` / `FSN-EXIT-PAIR` stay theirs.
- Do **not** pack `own_plater` with `off_plater` / `mid_hooder` / `sidestep_warder` / `morrow_warden` / `tick_plater` as a PAIR (next **own-turn** hit 0 vs next **off-turn** hit 0 vs exactly-2 miss vs any-range skip vs next-own-turn absorb vs next DoT tick). `FSN-OFF-FEE` / `FSN-MID-DRIFT` stay theirs.
- Do **not** pack `cinder_skipper` with `spike_skipper` / `lava_skipper` / `pit_skipper` / `ghost_stepper` / `ember_knight` as a PAIR (1-tile **cinder** as floor vs spike vs lava vs pit vs ghost occupancy vs live melee burn). `FSN-SPIKE-TAP` / `FSN-LAVA-STILL` / `FSN-SLIP-PIT` stay theirs. `FSN-CINDER-FULL/EMBER` is the 3-body, never Cinder+Ember PAIR.
- Do **not** pack `full_plater` with `tapped_plater` / `still_plater` / `empty_plater` / `plate_warden` as a PAIR (leftover **AP ≥ 3** → +RES vs leftover **AP = 0** → +RES vs leftover **MP = 0** → +RES vs leftover-AP 0 +RES older vs absorb). `FSN-SPIKE-TAP` owns Tapped Plate. `FSN-LAVA-STILL` owns Still Plate.
- Do **not** pack `summon_toller` with `walk_toller` / `kennel_siller` / `brace_chanter` / `brood_chanter` as a PAIR (pets pay AP to **start a walk** vs caster-walk tax vs pets cannot leave vs pets ignore force vs brood overlay). `FSN-LEAN-HOLD/TOLL` is Toll Kennel, never a two-pet PAIR. `FSN-DRIFT-COURT/BRACE` / `FSN-DULL-PET` / `FSN-NULL-BROOD` stay theirs.
- Do **not** pack `still_mender` with `dry_gaiter` / `dry_mender` / `bar_mender` / `heave_mender` / `pale_cantor` as a PAIR.
- Do **not** pack `cadence_rester` with `cadence_imprinter` / `cadence_pinner` / `cadence_staller` / `cadence_thief` as a PAIR.
- Do **not** pack `spent_taxer` with `still_taxer` / `gait_taxer` / `ley_tollkeeper` / `tax_scribe` / `verse_taxer` as a PAIR (walked-**last-turn** +1 AP vs camped-last-turn +1 vs walked-spell +1 vs leftover-AP tax vs glyph tax vs last-id +1). `FSN-BAR-PIN/STILL` / `FSN-STRIDE-PULPIT/GAIT` stay theirs. CADRE `FSN-SPENT-CRACK` is the three-body lesson (tax + crack + glyph), never Spent+Scribe PAIR.
- Do **not** pack `brick_cracker` with `brick_sprouter` / `brick_shifter` / `brick_wiper` / `stone_castellan` as a PAIR (remove adjacent barrier vs grow vs slide vs erase vs turret extras). `FSN-BAR-PIN/STILL` / `FSN-BRICK-WATCH` stay theirs. `FSN-OWN-WATCH/GUN` owns the turret, never Crack+Gun PAIR.
- Do **not** pack `watch_lender` with `watch_feer` / `watch_muter` / `glass_sniper` as a PAIR (snap grants watcher **+1 AP** vs snap costs walker 1 AP vs snap deals 0 vs extras). `FSN-OFF-FEE` / `FSN-BRICK-WATCH` stay theirs.
- Do **not** pack `pair_purser` with `lone_purser` / `dry_stinger` / `full_purser` / `lean_stinger` / `ready_stinger` as a PAIR.
- Do **not** pack `escort_cutter` with `banner_cutter` / `pet_cutter` / `crown_cutter` / `null_censor` as a PAIR (bonus vs handler-with-pet-in-2 vs `isLeader` vs bonus on the **pet** vs `leader_slayer` grant vs Weaken/Expose). `FSN-DRIFT-COURT/BANNER` / `FSN-CAST-QUIET/KENNEL` stay theirs.
- Do **not** pack `dry_mender` with `dry_gaiter` / `still_mender` / `heave_mender` / `both_mender` / `pale_cantor` as a PAIR.
- Drop 4–13 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two leftover-AP+MP banks; no two walk-shape locks; no two force-dir locks; no two leftover-MP=0 heals; no two leftover-AP=0 heals; no two heal-if-gated CORE as PAIR).

Wave 13 **SPELL_PROPOSALS** (`SPELL_PROPOSALS_2026-10-21.md`, open as PR #849) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 13 tactical verbs until that family pass exists (Wave 14). Remaining SDE Wave 12 unique CORE (`spell-orth-stride` … `spell-reach-fold`, except Dry Gait) stays G≥12 extras / never-owned.

Court Imprint / Pack Long / Adj Fold / Pack Cap / Reach Fold stay **boss / closed-class**. Court Imprint may witness on CHAMPION `cadence_imprinter` only — never as a world-pack CORE. Do **not** ship `spell-parched-mend` beside Dry Gait.

**Do not spawn Dry Gait / Still Mend / Dry Mend / Lean Sting / Parched Step / Parched Sill / Dry Hold / Lean Lend / Parched Sip / Lean Post / Parched Bounce / Must Lean / Verse Lean / Lean Hold / Pair Purse / Full Plate sheets until leftover AP and leftover walk MP can be read after this spell’s AP is paid, and battle walks write `walkMpSpentThisTurn`.** Forced-move / Swap / Home Step / Ally Step / Pair Pace / Pair Slide / Heave Step / **Parched Step** **do not** increment walk-spend. Missing field → Dry Gait / Still Mend / Lean Sting / Parched Sip pay **0** or skip (fail closed). Until those writers land, show `FSN-HEAVE-LEND` / `FSN-DUAL-READY` / `FSN-DRY-TAX` instead of the matching Wave 13 id.

**Do not spawn Verse Lean sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Lean fizzles (fail closed). Forced-move does **not** peel Verse Lean. Until that writer lands, show `FSN-HALVE-PACE` instead of `FSN-IMPRINT-CHOIR`.

**Do not spawn Spent Tax sheets until a battle-walk writer snapshots `walkMpSpentLastTurn` at turn end.** Walk **this** turn does not arm Spent Tax. Until that writer lands, show `FSN-BAR-PIN/STILL` instead of `FSN-SPENT-CRACK`.

**Do not spawn Six Plug until `inferSummonArchetype` keys `summonAI === "sixspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 6.** Live cap is 2. Name heuristics stay a bug. Six fills the stationary-post **and** the multi-cell-system cap (6). Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan/pentaspan/septspan/driftpost/leanpost onto that body.

**Do not spawn Lean Post sheets until `inferSummonArchetype` keys `summonAI === "leanpost"` and remaining cap ≥ 1.** End-turn occupy with leftover AP ≥ 1 is **safe**. Walk-on is **safe**. Relocate landing is **safe**. Only leftover-AP=0 end-turn occupy detonates.

**Parched Step dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Void Reel is the **sixth** `applyAttract` dest flavor (File / Ally / Foe / Paint / Cinder, then void/portal). Dest is **toward**, not onto, a world portal.

Wave 13 adds **zero** force-gated, facing, or Struck CORE cards. `forcedMovedThisTurn` / `lastForcedMoveDir` / `currentView` / `struckThisTurn` remain implementation prerequisites for Waves 6–12 sheets, not this drop.

---

## Grounding (live, 2026-10-22)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–13. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 203–224 — **no** `sixspan` / `leanpost` / `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Parched Step is occupancy dest, **not** `isSwap`. Void Reel is the sixth **cast** caller of attract. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 13 CORE rows stay `mpCost: 0`. Parched Sip / Lean Lend rewrite **current leftover MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| Leftover AP / leftover MP / `walkMpSpentThisTurn` / `walkMpSpentLastTurn` / `lastResolvedSpellId` | **Absent** — Dry / Lean / Parched / Verse Lean / Spent Tax fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / penta / sept / driftpost / **sixspan** / **leanpost** bodies **replace** the random overlay. Cap one of those engines. Six Span **is** the 6-cell post and needs remaining cap ≥ 6.
3. Any `healAmount` steals healer. **Dry Gait / Still Mend / Dry Mend must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Halver, Pinner, Sprouter, Feer, Purser, Cutter, Imprinter, Rester, Cracker, or Toller.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Drift Lend / Lean Lend / Split Mend / Both Mend / Heave Mend / Bar Mend / Dry Gait / Still Mend / Dry Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 13 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Parched Sip / Lean Lend rewrite current leftover MP.
6. `inferSummonArchetype` must key `summonAI === "sixspan"` **and** `"leanpost"` **before** any Six / Lean-Post sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Crack that **removes** an already planted barrier (it does not mint a new one from empty floor). Dry Hold / Must Lean / Lean Hold / Verse Lean / Mid Oath / Diag Stride are **not** `instantKill`.
8. Parched-step dest / void-reel dest / lean-post plant / six plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Parched Step into a wall is a fizzle (no crush). Void Reel dest must leave a walk-off that is **not** the void/portal cell.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip / Drift Sip / Parched Sip: cap applied unit MP **or** leftover-AP steal at **−2 / −1 leftover**. One Slow **or** one Parched Sip source per pack, not both stacking past that cap. Dry Hold is a **walk lock with an AP key**, not a third tax. Do not also Root + Gait Seal + Dry Hold + Must Lean + Lean Hold on the same AP bar.
10. Walk-spend: Still Mend / Parched Step gate / Verse Lean peel **fail closed** until `walkMpSpentThisTurn` exists on the turn actor. Parched Step / Void Reel / Lean Post plant **does not** increment it.
11. Last-id: Verse Lean **fail closed** until `lastResolvedSpellId` exists. Forced-move does **not** peel Verse Lean.
12. Last-turn walk: Spent Tax **fail closed** until `walkMpSpentLastTurn` exists. Walk this turn does **not** arm it.

### Relative difficulty (same grades as drops 1–13)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…13 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a leftover-pair tell / a force-move tell / a walk-lock / a tile lock / an own-turn miss) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / hold / plate / skip / bite / goad / golem / cutter): pack median + one step.
- Backliner (gait-mend / still-mend / dry-mend / keep / sip / sill / tax / imprint / rest / oath / reel / mark / crack / lend / stride / oather / toll): pack median.
- Glass (sting, sip, purse, tax, mark, crack, lend, skip, cutter, ignite, spare, sniper, post): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 14)

Drop 1–13 overlays still apply. These are **additional jobs** for Wave 13 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-DRY-GAIT` | `queen` **with** heal | proposed `dry_gaiter` | `spell-dry-gait`, `starter-shield` | healer; skip if either leftover MP ≥ 1 or missing HP < 8; leftover AP does **not** substitute; **not** `spell-parched-mend` |
| `ROLE-IMPRINT` | `bishop` **without** heal | proposed `cadence_imprinter` | `starter-frost`, `spell-cadence-imprint` | controller; skip if intersection remaining < 2; copy matching, target keeps |
| `ROLE-SIX` | `rook` **without** heal | proposed `six_prelate` | `physical_attack`, `spell-six-span` | `isSummoner` for six only; post `summonAI: "sixspan"`, plus occupy, empty kit, remaining cap ≥ 6; skip if any of six cells blocked |
| `ROLE-ODD-HOOD` | `pawn` or `knight` **without** heal | proposed `odd_hooder` | `physical_attack`, `spell-odd-hood` | guardian; skip if the only threat sits at even Chebyshev; hits from 2, 4, … land; DoT does not consume |
| `ROLE-LEAN-STING` | `knight` **without** heal | proposed `lean_stinger` | `physical_attack`, `spell-lean-sting` | flanker; skip if leftover AP ≥ 1 **or** leftover MP < 1 unless 10 still kills; bank does **not** empty leftover this turn |
| `ROLE-PARCHED-STEP` | `queen` **without** heal | proposed `parched_stepper` | `physical_attack`, `spell-parched-step` | protector; skip if ally leftover MP ≥ 1 or no free adj; relocate, **not** `isSwap` |
| `ROLE-PARCHED-SILL` | `rook` **without** heal | proposed `parched_siller` | `starter-frost`, `spell-parched-sill` | setter; skip if they can walk around; occupant cannot spend walk MP; force-move still legal |
| `ROLE-DRY-HOLD` | `knight` **without** heal | proposed `dry_holder` | `physical_attack`, `spell-dry-hold` | controller; skip if leftover AP already 0; dump AP peels walk; Strike does **not** peel unless it also empties AP |
| `ROLE-LEAN-LEND` | `bishop` **without** heal | proposed `lean_lender` | `starter-frost`, `spell-lean-lend` | buffer; skip if ally leftover AP ≥ 1; +1 current MP, not ungated Tempo |
| `ROLE-PARCHED-SIP` | `pawn` **without** heal | proposed `parched_sipper` | `starter-frost`, `spell-parched-sip` | flanker; skip if leftover AP ≥ 1 **or** leftover MP = 0; steal 1 leftover MP |
| `ROLE-LEAN-POST` | `pawn` **without** heal | proposed `lean_prelate` | `physical_attack`, `spell-lean-post` | `isSummoner` for leanpost only; post `summonAI: "leanpost"`, remaining cap ≥ 1; end-turn leftover-AP=0 occupy detonates; walk-on safe |
| `ROLE-PARCHED-BOUNCE` | `queen` **without** heal | proposed `parched_bouncer` | `starter-frost`, `spell-parched-bounce` | artillery; skip bounce without a second leftover-MP=0 hostile in 4 (`AI-TEM-05`) |
| `ROLE-MUST-LEAN` | `knight` **without** heal | proposed `must_leaner` | `physical_attack`, `spell-must-lean` | controller; skip if leftover MP already 0; non-Strike illegal unless leftover MP = 0; Strike stays legal |
| `ROLE-VERSE-LEAN` | `bishop` **without** heal | proposed `verse_leaner` | `starter-frost`, `spell-verse-lean` | controller; skip if no `lastResolvedSpellId`; leftover MP = 0 peels; shove does **not** |
| `ROLE-LEAN-HOLD` | `knight` **without** heal | proposed `lean_holder` | `physical_attack`, `spell-lean-hold` | controller; skip if leftover MP already 0; Strike illegal until leftover MP = 0; tools stay legal |
| `ROLE-DIAG-STRIDE` | `knight` **without** heal | proposed `diag_warder` | `starter-frost`, `spell-diag-stride` | controller; skip if only dests are orthogonal and Strike is better; next walk `|dx|==|dy|`; blink does not pay |
| `ROLE-MID-OATH` | `bishop` **without** heal | proposed `mid_oather` | `starter-frost`, `spell-mid-oath` | controller; skip if they must stay at 1 and Strike is better; next spell exact Chebyshev 2; Strike stays legal |
| `ROLE-VOID-REEL` | `queen` **without** heal | proposed `void_reeler` | `starter-frost`, `spell-void-reel` | caster; skip if no void/portal in 4; dest is **toward**, not onto; sixth `applyAttract` flavor |
| `ROLE-FOE-BITE` | `knight` **without** heal | proposed `foe_biter` | `physical_attack`, `spell-foe-bite` | charger; skip if no adj hostile-to-target; never stack Side Bite on G=0 |
| `ROLE-DWELL` | `bishop` **without** heal | proposed `dwell_marker` | `starter-frost`, `spell-dwell-mark` | setter; skip if they can walk off for 1 MP; 0 on cast; end-turn occupy detonates; enter+leave same turn is free |
| `ROLE-OWN-PLATE` | `rook` **without** heal | proposed `own_plater` | `starter-shield`, `spell-own-plate` | guardian; skip if they will only be hit on the enemy turn; own-turn hit 0; off-turn does not consume |
| `ROLE-CINDER-SKIP` | `knight` **without** heal | proposed `cinder_skipper` | `physical_attack`, `spell-cinder-skip` | flanker; skip if the next walk is not a 1-step across cinder; lava/spike/pit still tick |
| `ROLE-FULL-PLATE` | `rook` **without** heal | proposed `full_plater` | `starter-shield`, `spell-full-plate` | guardian; skip if leftover AP ≤ 2 after the 2-AP pay; leftover ≥ 3 → +RES |
| `ROLE-SUMMON-TOLL` | `bishop` **without** heal | proposed `summon_toller` | `starter-frost`, `spell-summon-toll` | controller; skip if no allied summon; pets pay +1 AP to start a walk; teleport does not pay |
| `ROLE-STILL-MEND` | `queen` **with** heal | proposed `still_mender` | `spell-still-mend`, `starter-shield` | healer; skip if `walkMpSpentThisTurn ≥ 1` or missing HP < 8; leftover MP does **not** substitute |
| `ROLE-CADENCE-REST` | `bishop` **without** heal | proposed `cadence_rester` | `starter-frost`, `spell-cadence-rest` | buffer; skip if all remaining CDs are 0–1; own remaining do not tick; does not rewrite |
| `ROLE-SPENT-TAX` | `bishop` **without** heal | proposed `spent_taxer` | `starter-frost`, `spell-spent-tax` | controller; skip if they camped last turn; next non-Strike +1 AP; Strike exempt |
| `ROLE-BRICK-CRACK` | `rook` **without** heal | proposed `brick_cracker` | `starter-frost`, `spell-brick-crack` | setter; skip if no adjacent barrier **or** the crack would seal the last path; paint-only |
| `ROLE-WATCH-LEND` | `bishop` **without** heal | proposed `watch_lender` | `starter-frost`, `spell-watch-lend` | artillery; skip if no overwatch is armed; snap still deals; watcher +1 AP |
| `ROLE-PAIR-PURSE` | `pawn` **without** heal | proposed `pair_purser` | `physical_attack`, `spell-pair-purse` | flanker; skip if leftover AP is not exactly 2 unless 10 still kills |
| `ROLE-ESCORT-CUT` | `bishop` **without** heal | proposed `escort_cutter` | `physical_attack`, `spell-escort-cut` | controller; skip if no allied summon in 2 of the **handler**; Dummy Post is not a pet |
| `ROLE-DRY-MEND` | `queen` **with** heal | proposed `dry_mender` | `spell-dry-mend`, `starter-shield` | healer; skip if either leftover AP ≥ 1 or missing HP < 8; walk / force flags do **not** substitute |

Drop-1 `ROLE-TANK` / `ROLE-KITER` / `ROLE-HEALER` / `ROLE-ASSASSIN` / `ROLE-HAZARD` / `ROLE-GLYPH` / `ROLE-KAMIKAZE` / `ROLE-CANTOR` / `ROLE-LURKER` / `ROLE-SNIPER` / `ROLE-WARDEN` / `ROLE-LANCER` / `ROLE-PUSHER` / `ROLE-COVER` (`cover_squire`) are reused below. Do not also roll the random 12% summoner overlay onto Clock, Ricochet, Tax, Plate, Cantor, Imprinter, Rester, Gaiter, Still, Dry-Mend, Six, or Lean-Post.

### Fair-fight rules (every sheet)

Same as drops 1–13, plus Wave 13:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, or barrier.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Kamikaze never detonates on a single full-HP player. Lean Post never detonates on leftover AP ≥ 1.
- Swap / pull / push / parched-step dest: free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile.
- Dual Slow / Frost / tide melee MP tax / Parched Sip: cap applied MP debuff at **−2**. One Slow **or** one Parched Sip source per pack.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- `starter-blast` / Parched Bounce / Heave Bounce may bounce player + one summon. Not paired with a second `hitsMultiple` source on the same sheet.
- No Glass Realm on stacked-DoT or Bell sheets. No Time Warp on Mark / leftover / Dry Hold windows.
- Summons stay at cap 2 (live). One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** dummy **or** driftpost **or** leanpost **or** six — never two engines). Six is illegal until remaining cap ≥ 6.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.
- Leftover-gated cards **fail closed** (0 extra, skip, or Frost) when the flag is missing — never invent a lock from a missing writer.

---

## Index (this catalog)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-DRY-STEP` | PAIR | leftover-MP=0 healer + leftover-MP=0 joiner | this drop |
| `FSN-LEAN-SIP` | PAIR | dry-purse/wet-walk poke + leftover-AP=0 MP steal | this drop |
| `FSN-ODD-MUST` | PAIR | odd-range miss + tools-until-leftover-MP=0 | this drop |
| `FSN-VOID-DWELL` | PAIR | pull toward void + end-turn occupy paint | this drop |
| `FSN-DRY-GATE` | CELL | leftover-AP=0 post + tile walk-lock | this drop |
| `FSN-DIAG-OATH` | CELL | diagonal-only walk + next-spell exact 2 | this drop |
| `FSN-CINDER-FULL` | CELL | 1-tile cinder skip + leftover-AP≥3 +RES | this drop |
| `FSN-OWN-WATCH` | CELL | own-turn miss + snap grants watcher AP | this drop |
| `FSN-IMPRINT-CHOIR` | BRIGADE | copy matching CDs + last-id until leftover MP=0 + ignite | this drop |
| `FSN-LEAN-COURT` | BRIGADE | lean sting + parched sip + dry hold | this drop |
| `FSN-PARCHED-QUIET` | BRIGADE | parched step + dry gait + cover | this drop |
| `FSN-STILL-REST` | BRIGADE | camped heal + own remaining skip tick + once | this drop |
| `FSN-FOE-ESCORT` | CADRE | crowd bite + handler cut + brood | this drop |
| `FSN-SPENT-CRACK` | CADRE | walked-last-turn tax + remove barrier + glyph tax | this drop |
| `FSN-PAIR-DRY` | CADRE | leftover-AP exactly 2 poke + leftover-AP=0 heal + arbiter | this drop |
| `FSN-LEAN-HOLD` | COURT | Strike-until-leftover-MP=0 + tools-until-leftover-MP=0 + warden | this drop |

Named packs as variants: `FSN-DRY-GATE/STING` (Dry Gate full), `FSN-VOID-DWELL/MIRROR` (Void Dwell full), `FSN-DIAG-OATH/FAR` (Diag Mid full), `FSN-CINDER-FULL/EMBER` (Cinder Full full), `FSN-OWN-WATCH/GUN` (Own Watch full), `FSN-ODD-MUST/GUN` (Odd Lean full), `FSN-LEAN-COURT/LEND` (Lean Lend escort), `FSN-LEAN-HOLD/SIX` (Six Plug — skip until remaining cap ≥ 6; live cap is 2), `FSN-LEAN-HOLD/BOUNCE` (Bounce File leftover-MP), `FSN-LEAN-HOLD/TOLL` (Toll Kennel).

---

## Formations

### FSN-DRY-STEP

FORMATION_ID: `FSN-DRY-STEP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-DRY-GAIT` — `queen` **with** heal / proposed `dry_gaiter` — pack median — back
- `ROLE-PARCHED-STEP` — `queen` **without** heal / proposed `parched_stepper` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Dry Gait is a heal kit; kit band 0 has no heal). Show `FSN-DUAL-READY` instead (leftover-pair tell without the dual-dry-MP 8).
- Gaiter kit: Dry Gait + Shield. **No** Inferno, no Enrage, no Dry / Still / Heave / Both / Bar Mend (PAIR bans). **Not** `spell-parched-mend`.
- Stepper kit: Parched Step + Strike. **No** Home / Heave / Ally Step / Cover on PAIR (those are `FSN-PARCHED-QUIET` / `FSN-HEAVE-QUIET`).
- Elite: Stepper only. Gaiter never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-DUAL-READY` **or** `FSN-STRIDE-DAMP` (player has seen leftover MP as a resource; this sheet cashes **both** leftover-MP=0 flags for 8).
- Random 30% family lottery is **off**.
- Leftover-MP writers required. Walk-spend does **not** substitute. Extra door `parched_cantor` is **not** this family’s door.

SPELL_POOL_INTERACTIONS:

- Dry Gait (8 HP) pays only if **both** leftover walk MP = 0. One wet body is 0 HP — Shield queen.
- Parched Step relocates the Stepper onto a free Chebyshev-1 of an ally whose leftover MP is already 0. It is not ungated Home Step and not `isSwap`.
- No drain / nova (healAmount → healer inference; the Stepper would stop joining).

TACTICAL_PLAN:

- Turn 1: Stepper holds until an ally leftover MP is already 0; if the Gaiter is still wet, Stepper Frosts / Strikes.
- Gaiter Dry-Gaits only if both leftover MP = 0 **and** missing HP ≥ 8; else Shields.
- Neither body dumps leftover MP **only** to enable the 8 if a Strike would kill.

SYNERGY:

- Dual-dry-MP healer + leftover-MP=0 joiner. Wave 12 Dual Keep standing on a heal verb. Combination, not a new sprite. Remaining 1 leftover MP on either body is a complete answer.

PLAYER_THREAT:

- Slow refill if you empty both walk pools. Spike is low. Misplay is Rooting neither and dumping the last tile into an 8 that just landed.

COUNTERPLAY:

- Keep 1 leftover MP on one body. Cursed Wound halves the 8. Occupy every Chebyshev-1 of the Gaiter. Kill the Gaiter (glass RES). The Stepper without a dry-MP ally is Strike / Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Gaiter needs a tile at range 3 from the Stepper that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced dump + dual-heal reads as a lock).

AI_REQUIREMENTS:

- Gaiter: healer; skip if either leftover MP ≥ 1.
- Stepper: protector; skip if ally leftover MP ≥ 1 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-DRY-STEP/E-STEP` — elite Stepper, still no Cover on PAIR.
- `FSN-PARCHED-QUIET` is the BRIGADE with Cover — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-LEAN-SIP

FORMATION_ID: `FSN-LEAN-SIP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-LEAN-STING` — `knight` **without** heal / proposed `lean_stinger` — pack median or −1 — starts wide
- `ROLE-PARCHED-SIP` — `pawn` **without** heal / proposed `parched_sipper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-DRY-TAX` (leftover-**AP** = 0 poke, no MP gate) and `FSN-DUAL-READY` (leftover **AP ≥ 1 and MP ≥ 1** poke). Pressure is the **dry-purse / wet-walk** window.
- Band 0: Stinger Strike only; Sipper Frost only (Lean Sting / Parched Sip are band 1). If kit band is still 0, **do not spawn this id** — show `FSN-DRY-TAX`.
- Elite: Stinger only. Sipper never gets Gait Sip or Drift Sip (PAIR bans).
- Unlock after `FSN-DRY-TAX` **or** `FSN-DUAL-READY` (player has seen leftover AP **or** leftover-pair as a resource).
- Pair Purse / Ready / Damp / Lone stay off PAIR (PAIR bans). Dry Hold stays off (that is `FSN-LEAN-COURT`).
- Leftover-AP and leftover-MP writers required. Death before resolve expires the window.

SPELL_POOL_INTERACTIONS:

- Lean Sting: 10, +8 iff **target** leftover AP = 0 **and** leftover MP ≥ 1. Spend **one** wallet this turn; Keep does not empty leftover until next start.
- Parched Sip: steal 1 leftover MP iff leftover AP = 0 **and** leftover MP ≥ 1. Else fizzle. Cap applied MP steal at −1 leftover with one Slow source.
- Frost from Sipper is chip, not a third tax past −2.

TACTICAL_PLAN:

- Sipper Sips if leftover AP = 0 **and** leftover MP ≥ 1; else Frosts.
- Stinger lurks at 3 and commits when both flags are true **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Dry-purse/wet-walk poke + leftover-AP=0 MP steal. Wave 10 Dry Sting and Wave 11 Gait Sip standing on one window. You see the empty purse and the leftover tile; the knife waits for the pair.

PLAYER_THREAT:

- High if you dump AP and keep a tile, then trade the Stinger. Low if you keep 1 leftover AP **or** spend the last MP. Not unavoidable: keep 1 AP, dump the last MP, or kill the Stinger and eat Frost.

COUNTERPLAY:

- Keep 1 leftover AP **or** spend leftover walk to 0. Kill the Stinger (`hp` ~0.75). Force the Sipper to leave a hazard this turn (sip refuses). Dry Sting / Ready Sting the remaining wallet if you brought it.

MAP_REQUIREMENTS:

- `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile.
- No Time Warp (panic + leftover tax).

AI_REQUIREMENTS:

- Stinger: flanker + leftover-pair hold (AP=0 and MP≥1).
- Sipper: flanker; skip if either gate fails; heal-less so inference stays caster.
- Soph 1–2.

VARIANTS:

- `FSN-LEAN-SIP/E-STING` — elite Stinger, still no Dry Hold on PAIR.
- `FSN-LEAN-COURT` is the BRIGADE with Hold — do not merge.

STATUS: PROPOSED

---

### FSN-ODD-MUST

FORMATION_ID: `FSN-ODD-MUST`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-ODD-HOOD` — `pawn` or `knight` **without** heal / proposed `odd_hooder` — pack median + 1 — front
- `ROLE-MUST-LEAN` — `knight` **without** heal / proposed `must_leaner` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-NEAR-MUST` (≤1 miss + Chebyshev-1 remaining walks) and `FSN-MID-DRIFT` (exactly-2 miss + force-dir remaining walks). Pressure is **parity**: melee at 1 is odd — it whiffs — and tools need leftover MP = 0.
- Band 0: Hood Strike / Shield; Leaner Strike only. Must Lean is band 1. If kit band is still 0, **do not spawn this id** — show `FSN-NEAR-MUST`.
- Elite: Hood only. Leaner never gets Cast Hold / Tool Hold / Must Drift (PAIR bans).
- Unlock after `FSN-NEAR-MUST` **or** `FSN-MID-DRIFT` (player has seen a range-band miss **or** a remaining-walk lock).
- Own Plate / Off Plate / Mid Hood stay off PAIR (PAIR bans). Glass Sniper stays off (that is `FSN-ODD-MUST/GUN`).
- Leftover-MP writer required for Must Lean. Odd Hood consumes **before** `dealDamage`. DoT does not consume.

SPELL_POOL_INTERACTIONS:

- Odd Hood: next applied damaging hit whose Chebyshev is odd (1, 3, 5, …) deals 0 and consumes. Even (0, 2, 4, …) lands and does **not** consume. Do not read `CharacterStats.evasion`.
- Must Lean: remaining **non-Strike** spells illegal unless leftover walk MP = 0. Strike stays legal. Inverse of Cast Hold.
- Together: standing at 1 to Strike the Hood whiffs; standing at 2 lands and still lets you Strike through Must Lean. Frost at 1 with leftover MP ≥ 1 fizzles.

TACTICAL_PLAN:

- Hood if the only threat sits at 1 or 3. Lean if leftover MP ≥ 1 **and** they have a tool.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Odd-range miss + leftover-MP tool-lock. Wave 11 Near Hood and Wave 10 Cast Hold standing on leftover MP. Combination, not a new sprite. Step to 2, then Strike, is a complete answer.

PLAYER_THREAT:

- Frustration if you poke from 1. Spike is low. Misplay is dumping Inferno from 3 while leftover MP ≥ 1.

COUNTERPLAY:

- Step to Chebyshev 2, then Strike (even lands; Strike stays legal under Must Lean). Dump leftover MP, then tool. Wait the consume. Kill the Hood. Dispel.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with room to stand at 1, 2, **and** 3. Reject a 1-tile tunnel (forced melee at 1 + odd miss reads as a lock).
- No Time Warp.

AI_REQUIREMENTS:

- Hood: guardian; skip if the only threat sits at even Chebyshev.
- Leaner: controller; skip if leftover MP already 0; gate on `isPhysical`, never `spell.name`.
- Soph 1–2.

VARIANTS:

- `FSN-ODD-MUST/GUN` — BRIGADE **Odd Lean**: add `ROLE-SNIPER` (`glass_sniper`) junior. Sniper holds minRange 3 (odd — Hood eats it) so the player is baited to 2, where the Sniper is illegal and Must Lean still taxes tools. **Never PAIR Odd Hood with Far Hood. Never PAIR Watch Lend with Glass as a two-body.** Unlock after `FSN-GLASS-WARD`.
- `FSN-LEAN-HOLD` remains the COURT that also locks Strike; do not merge.

STATUS: PROPOSED

---

### FSN-VOID-DWELL

FORMATION_ID: `FSN-VOID-DWELL`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-VOID-REEL` — `queen` **without** heal / proposed `void_reeler` — pack median — back
- `ROLE-DWELL` — `bishop` **without** heal / proposed `dwell_marker` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-CINDER-MARK` (pull toward **hazard** + cell-**enter** detonate) and `FSN-PAINT-NOOK` (pull toward **paint**). Pressure is **toward the rim**, then **end-turn occupy** on the toward-cell.
- Elite: Reeler only. Marker never gets Ingress / Stride / Lean Post (PAIR bans).
- Unlock after `FSN-CINDER-MARK` **or** `FSN-EMBER-RIFT` (player has seen a pull dest **or** a board that moves).
- Cinder / Paint / Foe / Ally / File Reel stay off PAIR (PAIR bans). Void Mirror stays off (that is `FSN-VOID-DWELL/MIRROR`).
- Sixth `applyAttract` dest required. Dest is **toward**, not onto, a world portal. Occupancy `portals` stay impassable.
- If the map has no void/portal in Chebyshev 4 of a legal floor, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Void Reel: pull 1 toward the nearest void or portal cell in Chebyshev ≤ 4. Empty / blocked / world-portal dest: fizzle that step (AP spent). Player keeps ≥ 1 walk-off that is **not** the void cell.
- Dwell Mark: paint one floor tile 2 turns. 0 on cast. If a hostile **ends their turn** on that cell, deal 10 and consume. Walk-on and walk-off the same turn is free. Swap onto the cell **does** detonate if they stay.
- Together: Reel toward the rim, paint the toward-cell. Leaving before turn end is the designed answer.

TACTICAL_PLAN:

- Reeler Reels only if a legal floor step toward exists **and** a walk-off remains. Marker paints the toward-cell only if they can still walk off for 1 MP.
- Never turn-1 double onto a rim tile with no exit.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Pull toward void + end-turn occupy. Wave 12 Cinder Reel standing on a new dest flavor. Combination, not a new sprite. Step off before end of turn is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I got reeled one step toward the rim and camped the paint.” Recoverable: walk off, occupy the toward-tile so Reel fizzles, send a summon to camp it.

COUNTERPLAY:

- Fight away from the rim (no void in 4 → Reel skips). Occupy the toward-tile. Walk off before turn end. Blink on and off. Kill the Marker (0 on cast — it is a bishop). Self Anchor.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with a **visible** void/portal in Chebyshev 4 of a legal floor **plus** a clean aisle the other way. Weight 0 on maps with no void/portal.
- Reject `corridorMaze` with the only file ending on a portal (reel + dwell in a hallway is a lock).
- Twin Gate pads are **not** this dest.

AI_REQUIREMENTS:

- Reeler: caster; skip if no void/portal in 4 **or** dest is safer for the player; dest scoring must not land **on** the portal.
- Marker: setter; skip if they can walk off for 1 MP; observation is the **paint**.
- Soph 1–2.

VARIANTS:

- `FSN-VOID-DWELL/MIRROR` — BRIGADE **Void Dwell full**: add live `void_mirror` junior (25% reflect, **no** Swap). Reflect camps the toward-corridor. **Never PAIR Void Reel with Cinder Reel.** Unlock after `FSN-MIRROR-REAVE`.
- `FSN-CINDER-MARK` remains the hazard-dest PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-DRY-GATE

FORMATION_ID: `FSN-DRY-GATE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-LEAN-POST` — `pawn` **without** heal / proposed `lean_prelate` — pack median − 1 — plants one cell
- `ROLE-PARCHED-SILL` — `rook` **without** heal / proposed `parched_siller` — pack median — paints a **different** tile

VARIANT_RULES:

- Distinct from `FSN-DRIFT-GATE` (relocate-landing detonate / walk-on **safe**, tile rejects **relocate dest**). This sheet is **end-turn leftover-AP=0 occupy** plus a tile that **forbids walk MP**. Walk-on the post is safe. Relocate landing is safe. Camping 1 leftover AP on the post is safe.
- CELL: one post, one sill, two different tiles. Never paint the post’s cell as the sill (that would hide which peel works).
- Elite: Siller only. Prelate stays junior so two hidden detonates are not a CELL.
- Unlock after `FSN-DRIFT-GATE` **or** `FSN-DRY-TAX` (player has seen a post **or** a leftover-AP poke).
- Dummy / Drift / Dwell / Ingress / Bait stay off (PAIR bans). Lean Sting stays off the base sheet (that is `FSN-DRY-GATE/STING`).
- `summonAI === "leanpost"` required. Remaining cap ≥ 1. Do not also roll wolf/archer/dummy/driftpost/sixspan.
- If pack size would be 1, **reroll**.

SPELL_POOL_INTERACTIONS:

- Lean Post: empty-kit body. Hostile **ends their turn** occupying this cell **and** leftover AP = 0 → 10 and the post dies. Walk onto is safe. Relocate landing is safe. End-turn occupy with leftover AP ≥ 1 is safe.
- Parched Sill: paint one free cell 2 turns. Occupant cannot spend walk MP. Force-move / swap / blink onto or off is legal. Spells stay legal.
- Together: sit on the sill and you cannot walk off; sit on the post with leftover AP = 0 and it detonates. Designed answers: camp 1 AP on the post, walk around the sill, swap off.

TACTICAL_PLAN:

- Prelate places if they will dump AP on that cell; skip if they can end with leftover AP ≥ 1 for free. Siller paints a **flank choke**, never both approaches, never the only tile that reaches the Prelate.
- Never wire both approaches. Never turn-1 surround.
- Hostiles start ≥ 4 apart. Post placement ≥ 2 from the player’s last exit.

SYNERGY:

- Leftover-AP=0 post + tile walk-lock. Teaching pair for Dry Gate without the sting yet. Information (where is the post?) plus a walk lock with an AP key on a different cell.

PLAYER_THREAT:

- Chip if you dump AP on the post. Frustration if you stand on the sill. Not a lock: spells work, second approach exists, camp 1 AP, swap off, Root expires is not required because Root is off this sheet.

COUNTERPLAY:

- End turn with 1 leftover AP on the post. Walk around the sill. Swap / blink off. Burst the 1 HP post. Probe with a summon. Kill the Siller (`hp` ~0.90).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (post + sill on the only tile is a hardlock). Weight 0 in 1-tile closets.
- Two different legal floor cells. Player keeps ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Prelate: summoner leanpost + skip if they can camp leftover AP ≥ 1; proposed cooldown fall-through to Frost (today summoner skip-locks — must not ship as a wasted-turn bug).
- Siller: setter; never paint the post cell; never paint the only backliner approach.
- Soph 2–3.

VARIANTS:

- `FSN-DRY-GATE/STING` — BRIGADE **Dry Gate full**: add `ROLE-LEAN-STING` junior. Sting the rest after they dump AP to peel Hold-adjacent windows. **Never PAIR Lean Sting with Dry / Ready / Pair Purse.** Unlock after `FSN-LEAN-SIP`.
- `FSN-DRIFT-GATE` remains the relocate-detonate CELL; do not merge.

STATUS: PROPOSED

---

### FSN-DIAG-OATH

FORMATION_ID: `FSN-DIAG-OATH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-DIAG-STRIDE` — `knight` **without** heal / proposed `diag_warder` — pack median
- `ROLE-MID-OATH` — `bishop` **without** heal / proposed `mid_oather` — pack median

VARIANT_RULES:

- Distinct from `FSN-INCH-OATH` (one next Chebyshev ≤ 1, **ortho legal**, next spell range ≥ 3) and `FSN-NEAR-MUST` (remaining walks Chebyshev 1). This sheet is **next walk diagonal-only** plus **next spell exact Chebyshev 2**. Strike stays legal at any range. Frost at 1 or 3 fizzles. Orthogonal dests fail confirm; MP is not spent.
- Elite: Oather only. Warder stays junior so two walk-shape elites cannot pin.
- Unlock after `FSN-INCH-OATH` **or** `FSN-NEAR-MUST` (player has seen a walk-shape lock **or** a range oath).
- Diag Lock / Inch / Must Step / Must Span / Axis stay off PAIR (PAIR bans). Long / Near / Unit / Ground Oath / Mid Hood stay off (PAIR bans). Far Stinger stays off the base sheet (that is `FSN-DIAG-OATH/FAR`).
- Teleport / Swap / Phase Slip do **not** pay Diag Stride.

SPELL_POOL_INTERACTIONS:

- Diag Stride: next walk of ≥ 1 tile is legal only if `|dx| == |dy|` and Chebyshev ≥ 1. Sit and Strike is legal. Orthogonal step fizzles (no MP spent).
- Mid Oath: next spell (`damage > 0` or non-Strike tool) is illegal unless the target tile is Chebyshev exactly 2 from the **caster**. Strike stays legal.
- Together: walking to 2 to land the nuke may be illegal if the only step is orthogonal; nuking from 1 or 3 fizzles. Designed answers: sit and Strike, walk diagonally to 2, blink off (does not pay).

TACTICAL_PLAN:

- Warder Strides if they must leave a file. Oather Oaths if they want a range-3+ nuke.
- Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Diagonal-only walk + exact-2 spell. Wave 12 Inch / Long standing on leftover SDE Wave 11 verbs. Combination, not a new sprite. Sit and Strike is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I needed a file step to 2 for Inferno and both were illegal.” Recoverable: Strike in place, walk a diagonal, wait the one walk / one spell.

COUNTERPLAY:

- Sit and Strike. Walk diagonally. Stand at 1 or 3 and live on Strike. Blink off (does not pay Diag Stride). Kill the Oather (`hp` ~0.80). Dispel.

MAP_REQUIREMENTS:

- `chessboard` or `openField` with **diagonal dests available** from typical stand **and** tiles at Chebyshev 1, 2, and 3. Reject a 1-tile orthogonal tunnel (diagonal-only + forced file is a lock **or** a no-op).
- Extra room `diag_gallery` / `mid_nave` may teach; they are not extra hostiles.

AI_REQUIREMENTS:

- Warder: controller; skip if only dests are orthogonal and Strike is better.
- Oather: controller; skip if they must stay at 1 and Strike is better; Strike exempt.
- Soph 2–3.

VARIANTS:

- `FSN-DIAG-OATH/FAR` — BRIGADE **Diag Mid**: add `ROLE-ARTILLERY` junior (`far_stinger` / `glass_sniper`). Gun holds ≥ 3 so the exact-2 oath taxes the close **and** the snipe. **Never PAIR Mid Oath with Long Oath. Never PAIR Odd Hood with Far Hood on this id.** Unlock after `FSN-GLASS-WARD`.
- `FSN-INCH-OATH` remains the ≤1 / ≥3 CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-CINDER-FULL

FORMATION_ID: `FSN-CINDER-FULL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-CINDER-SKIP` — `knight` **without** heal / proposed `cinder_skipper` — pack median
- `ROLE-FULL-PLATE` — `rook` **without** heal / proposed `full_plater` — pack median + 1 — front

VARIANT_RULES:

- Distinct from `FSN-SPIKE-TAP` (1-tile **spike** skip + leftover-**AP=0** +RES) and `FSN-LAVA-STILL` (1-tile **lava** skip + leftover-**MP=0** +RES). This sheet is **cinder-only, length 1** plus leftover-**AP ≥ 3** +RES. Lava / spikes / pits still tick. Teleport / Swap do not consume Skip.
- Elite: Skipper only. Plater stays junior so two skip elites cannot paint every class.
- Unlock after `FSN-SPIKE-TAP` **or** `FSN-LAVA-STILL` (player has seen a 1-tile hazard skip **or** a leftover-RES plate).
- Spike / Lava / Pit / Ghost Skip stay off PAIR (PAIR bans). Ember Knight stays off the base sheet (that is `FSN-CINDER-FULL/EMBER`). Tapped / Still / Empty / Ward Plate stay off (PAIR bans).
- If the map has no cinder / ember-wake cell, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Cinder Skip: next walk of length 1 ignores cinder / burn / ember-wake hazard ticks on the dest cell. A ≥2 walk does not consume and still takes the tick.
- Full Plate: if leftover AP at resolve is ≥ 3, gain `buffStat: "res"` 1.15 for 2 turns. The 2 AP this spell costs is paid **before** the leftover check. Keep 3 AP after the arm.
- Together: cross the wake, then camp 3 AP behind the plate. Drain Courage so leftover drops below 3 is the designed punish of the plate.

TACTICAL_PLAN:

- Skipper Skips then steps the wake. Plater Plates if leftover AP ≥ 3 **and** Iron Skin is not already up; else Shields.
- Never paint lava as the only approach. One wake cell on a **flank**; one clean aisle.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Cinder-class skip + leftover-AP≥3 plate. Wave 12 Spike Tapped standing on a new hazard class and a full purse. Combination, not a new sprite. Walk the clean aisle is a complete answer.

PLAYER_THREAT:

- Chip if you cross the wake without Skip. Long fight if the plate camps 3 AP. Spike is low. Misplay is standing on cinder-only and poking into a camped 3.

COUNTERPLAY:

- Take the clean aisle. Force a 2-step (Skip is length 1). Drain Courage / Quiet Hex so leftover drops below 3. Dispel. Root the Skipper. Kill the Skipper (`hp` ~0.85). Do not stand on cinder-only.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with **one** cinder / ember-wake cell on a flank **and** one clean aisle. Weight 0 on maps with no cinder / ember-wake. Reject lava-painted engagement + this pack (double hazard).
- No Thorned Ground on the only clean aisle.

AI_REQUIREMENTS:

- Skipper: flanker; skip if the next walk is not a 1-step across cinder.
- Plater: guardian; skip if leftover AP ≤ 2.
- Soph 2–3.

VARIANTS:

- `FSN-CINDER-FULL/EMBER` — BRIGADE **Cinder Full full**: add live `ember_knight` junior (melee burn; Inferno only if kit band 2, still one cadence). **Never PAIR Cinder Skip with Ember as a two-body.** Unlock after `FSN-EMBER-MEND` **or** seen ember melee-burn.
- `FSN-SPIKE-TAP` remains the spike CELL; do not merge.

STATUS: PROPOSED

---

### FSN-OWN-WATCH

FORMATION_ID: `FSN-OWN-WATCH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-OWN-PLATE` — `rook` **without** heal / proposed `own_plater` — pack median + 1 — front
- `ROLE-WATCH-LEND` — `bishop` **without** heal / proposed `watch_lender` — pack median — back, LoS down a **wide** lane

VARIANT_RULES:

- Distinct from `FSN-OFF-FEE` (next **off-turn** hit 0 + snap costs the **walker** 1 AP) and `FSN-BRICK-WATCH` (snap deals **0**). This sheet is **own-turn** miss plus snap grants the **watcher** +1 AP. The snap still deals. Hits on the player’s turn are full and do **not** consume Own Plate.
- Elite: Plater only. Lender stays junior so two watch elites cannot mute **and** fee **and** lend.
- Unlock after `FSN-OFF-FEE` **or** when the player has walked into Hold Ground / Far Watch this run (relative, not a level gate).
- Off Plate / Mid Hood / Sidestep / Morrow / Tick stay off PAIR (PAIR bans). Watch Fee / Watch Mute / Glass Sniper stay off PAIR (PAIR bans). Castellan stays off the base sheet (that is `FSN-OWN-WATCH/GUN`).
- Observation is the **arm**. The snap does not second-observe.

SPELL_POOL_INTERACTIONS:

- Own Plate: next hit the caster receives **during their own turn** (overwatch snap, reflect, hold-ground, thorn, a spell they forced onto themselves) deals 0 and consumes. Poke them on **your** turn.
- Watch Lend: 2 turns or until consumed. The next time an overwatch the caster owns **snaps**, the caster gains +1 AP at snap resolve. Snap damage / stop still uses its own writer.
- Together: walking the file on their turn feeds a free miss **and** a second action. Not walking the file is a complete answer.

TACTICAL_PLAN:

- Plater Plates if Hold Ground / Far Watch / reflect is armed. Lender Lends if an overwatch is likely this turn; else Frosts.
- Never both on turn 1 against a full-HP player who has not acted — show the watch band first.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Own-turn miss + snap-AP. Wave 12 Off Watch standing on the inverse turn and the inverse wallet. Combination, not a new sprite. Do not walk the file is a complete answer.

PLAYER_THREAT:

- Positional. Fail state is “I walked the watch band on their turn, the snap whiffed Own Plate, and they spent the gifted AP.” Recoverable: poke on your turn, blink in, send a summon, kill the Lender.

COUNTERPLAY:

- Do not walk into Hold Ground / the file on their turn. Poke the Plater on **your** turn. Blink. Send a summon to trip the snap. Dispel Own Plate. Kill the Lender (`hp` ~0.80).

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel (forced walk-into-watch is a lock).
- Watch band must not be the only approach.

AI_REQUIREMENTS:

- Plater: guardian; skip if they will only be hit on the enemy turn.
- Lender: artillery; skip if no overwatch is armed.
- Soph 2–3.

VARIANTS:

- `FSN-OWN-WATCH/GUN` — BRIGADE **Own Watch full**: add `ROLE-TURRET` junior (`stone_castellan`), cap 1 turret, faces the same file. **Never PAIR Brick Crack with Castellan. Never PAIR Watch Lend with Glass as a two-body.** Unlock after `FSN-SHARD-BATTERY/LANE` **or** `FSN-OFF-FEE/GUN`.
- `FSN-OFF-FEE` remains the off-turn CELL; do not merge.

STATUS: PROPOSED

---

### FSN-IMPRINT-CHOIR

FORMATION_ID: `FSN-IMPRINT-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-IMPRINT` — `bishop` **without** heal / proposed `cadence_imprinter` — pack median
- `ROLE-VERSE-LEAN` — `bishop` **without** heal / proposed `verse_leaner` — pack median
- `ROLE-HAZARD` — `knight` / proposed `ignite_alchemist` (else live `ember_knight` with Inferno) — pack median — Inferno remaining ≥ 2 is the copied id

VARIANT_RULES:

- Unlock after `FSN-HALVE-PACE` **or** `FSN-TRIM-TAX` (player has seen a CD rewrite **or** a last-id pin). Wave 13 “Imprint Choir.”
- Elite: Imprinter only. Leaner and Ignite stay junior so two CD elites cannot steal **and** copy **and** skip-tick.
- Imprint **copies** matching remaining onto the caster; target **keeps**. Rest / Halve / Pin / Theft stay off PAIR (PAIR bans). Verse Pace / Last Mute / Verse Tax / First / Once stay off PAIR (PAIR bans).
- Inferno lives on the **ignite**, cooldown 3. Imprinter does not also Inferno (heal-less bishop stays caster). One Inferno cadence.
- `lastResolvedSpellId` required for Verse Lean. Forced-move does **not** peel. Leftover MP = 0 peels.
- Extra door is `imprint_precentor` — family is **not** that id. Do not restamp `halve_precentor` / `trim_precentor`.

SPELL_POOL_INTERACTIONS:

- Cadence Imprint: for each of the target’s remaining CDs with `n > 0`, if the caster owns that **id**, write caster remaining = `max(caster remaining, n)`. Target keeps. Ids the caster does not own are ignored.
- Verse Lean: last resolved spell id becomes illegal until leftover walk MP = 0.
- Together: copy Inferno 3, then that id is illegal until leftover MP = 0. Recast Inferno **before** Imprint is the designed answer. Missing shared id → Imprint Frosts.

TACTICAL_PLAN:

- Turn 1: Ignite holds Inferno until LoS. Imprinter Imprints if the intersection remaining ≥ 2 **and** the caster can live without that id this turn. Leaner Leans after a last id exists.
- Never Imprint a 1 if they needed that tool. Never both Imprint and Lean on turn 1 against a full-HP player with no last id.
- Hostiles start ≥ 4 apart. One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Copy matching CDs + leftover-MP last-id pin + ignite. Wave 12 Halve Pace standing on copy-not-rewrite. Combination, not a new sprite.

PLAYER_THREAT:

- High if you share Inferno and recast it after Imprint with leftover MP ≥ 1. Low if you recast first, fight with no shared ids, or dump leftover MP. Not a lock: leftover MP = 0 peels Verse Lean; Crack their highest to 0; kill the glass Imprinter.

COUNTERPLAY:

- Recast Inferno **before** Imprint. Fight with no shared ids. Cadence Crack their highest to 0. Dump leftover MP (peels Verse Lean). Kill the Imprinter (`hp` ~0.80). Do not share Inferno.

MAP_REQUIREMENTS:

- `openField` or `arena`. Ignite needs a flank path that is not the only exit. Imprinter needs a retreat tile.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Imprinter: controller; skip if intersection empty.
- Leaner: controller; skip if no last id; leftover-MP peel only.
- Ignite: flanker; **not** berserk; one Inferno cadence.
- Soph 3–4. `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-IMPRINT-CHOIR/NO-IGNITE` — teaching BRIGADE of two if Inferno apply is not ready. Still no Theft.
- `FSN-HALVE-PACE` remains the ÷2 CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-LEAN-COURT

FORMATION_ID: `FSN-LEAN-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-LEAN-STING` — `knight` **without** heal / proposed `lean_stinger` — pack median − 1
- `ROLE-PARCHED-SIP` — `pawn` **without** heal / proposed `parched_sipper` — pack median
- `ROLE-DRY-HOLD` — `knight` **without** heal / proposed `dry_holder` — pack median — cannot walk until leftover AP = 0

VARIANT_RULES:

- Unlock after `FSN-LEAN-SIP`. Wave 13 “Lean Court.”
- Elite: Holder only. Stinger and Sipper stay junior so two leftover-AP elites cannot pin walk **and** poke.
- Dry Hold is the **one** rare walk lock. Drift / Boot / Hold Knight / Gait Seal / Root stay off (PAIR bans). Lean Sting / Parched Sip stay the leftover-AP=0 **and** leftover-MP≥1 pair from `FSN-LEAN-SIP`.
- Dumping AP unlocks walking **that turn**. Strike does **not** peel Hold unless it also empties AP. Force-move still legal.
- Do not also Root. Do not also Drift Hold. Cap applied MP steal at −1 leftover; one Sip source.

SPELL_POOL_INTERACTIONS:

- Dry Hold: 2 of the target’s turns, they cannot spend walk MP until leftover AP = 0 on that turn.
- Lean Sting / Parched Sip fire on the dry-purse / wet-walk window Hold creates. Keep 1 leftover AP **or** spend the last MP — either flag breaks the bonus.
- Holder Frost after Hold is a tax, not a root.

TACTICAL_PLAN:

- Turn 1: Holder Holds if leftover AP ≥ 2 and they want to walk; else Frosts. Sipper / Stinger wait for the window.
- If the player never dumps AP, this is a softer `FSN-LEAN-SIP` plus a walk tax — fine.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Dry-purse/wet-walk poke, steal the chip, nail walk until they dump AP. Wave 12 Drift Court standing on leftover AP instead of force-move.

PLAYER_THREAT:

- Positional and tempo. Failure is camping leftover AP on a painted tile, then eating Sting + Sip. Recoverable: dump AP on a cheap Strike, then walk; keep 1 leftover AP; kill the Holder.

COUNTERPLAY:

- Empty the purse first, then walk. Keep 1 leftover AP (Sting / Sip skip). Spend the last MP. Swap (force-move still legal). Kill the Holder (`hp` ~0.90). Do not camp leftover AP on the sill — there is no sill on this id; do not invent one.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze` (Hold + Sting in a hallway is a lock).
- ≥ 2 walk-offs after they dump AP.

AI_REQUIREMENTS:

- Holder: controller; skip if leftover AP already 0.
- Stinger / Sipper: same as `FSN-LEAN-SIP`.
- Soph 3–4. Blackboard: `dryPurseWindow` so Sting and Sip agree.

VARIANTS:

- `FSN-LEAN-COURT/LEND` — replace Sipper with `ROLE-LEAN-LEND` junior (+1 MP to an ally whose leftover AP = 0). **Never PAIR Lean Lend with Spent / Drift / Boot / Tempo.** Unlock after `FSN-HEAVE-LEND`.
- `FSN-LEAN-SIP` remains the teaching PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-PARCHED-QUIET

FORMATION_ID: `FSN-PARCHED-QUIET`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PARCHED-STEP` — `queen` **without** heal / proposed `parched_stepper` — pack median
- `ROLE-DRY-GAIT` — `queen` **with** heal / proposed `dry_gaiter` — pack median
- `ROLE-COVER` — `rook` / proposed `cover_squire` (else live `iron_golem`) — pack median + 1 — stands **off** the join dests

VARIANT_RULES:

- Unlock after `FSN-DRY-STEP` **and** `FSN-HEAVE-QUIET` (or `FSN-ALLY-SILL`). Wave 13 “Parched Quiet.”
- **Never PAIR Parched Step with Cover / Home / Heave / Ally.** This BRIGADE is the three-body lesson: join the leftover-MP=0 ally, cash the dual-dry-MP 8, Cover peels the side aisle so occupying every Chebyshev-1 costs a body.
- Elite: Cover only. Stepper and Gaiter stay junior.
- Two queens are the **same piece asset** with different kits. Stepper must not receive `starter-heal` or inference makes two healers and the sheet collapses.
- Cover never gets Inferno. Gaiter never gets Dry Mend / Still Mend / Parched Mend.
- Parched Step dests are occupancy, not `isSwap`. Player keeps ≥ 1 walk-off after the body lands.

SPELL_POOL_INTERACTIONS:

- Parched Step: caster lands on a free Chebyshev-1 of an ally with leftover MP = 0. Dest hazards must tick.
- Dry Gait: 8 iff both leftover MP = 0. Cover does **not** need leftover MP = 0 — the 8 is Gaiter + Stepper (or Gaiter self if she is dry).
- Cover Shield / Iron Skin on the Gaiter. Ally `targetId` apply required.

TACTICAL_PLAN:

- Cover occupies the **gallery** so walking off the join ring still costs a body. It does not also stand on a Chebyshev-1 of the Gaiter (that would close the designed answer).
- Stepper Steps only if ally leftover MP = 0 **and** a free dest exists. Gaiter Gaits only if both leftover MP = 0 **and** missing HP ≥ 8.
- If Cover dies, remaining pair is `FSN-DRY-STEP` — intended.

SYNERGY:

- Join the leftover-MP=0 ally, then cash the dual-dry-MP 8, with a peel so the ring is not free. Wave 12 Heave Quiet standing on leftover MP instead of force-move.

PLAYER_THREAT:

- A join that refills if you emptied both walk pools. Spike is low. Misplay is occupying one dest and ignoring the Gaiter forever.

COUNTERPLAY:

- Keep 1 leftover MP on one body. Occupy every Chebyshev-1. Cursed Wound the Gaiter. Kill the Gaiter. Walk the gallery Cover left open. Attract / Swap yanks the Gaiter into Strike range.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `asymmetric` with two approaches. Cover needs a tile that is **not** a Chebyshev-1 of the Gaiter.
- Reject a 1-tile tunnel (join + peel + heal reads as a lock).

AI_REQUIREMENTS:

- Stepper / Gaiter: same as `FSN-DRY-STEP`.
- Cover: charger that body-blocks the gallery, not a suicide walk onto the join dest.
- Soph 3–4. `AI_BACKLINE_PROTECT` at soph 4. Ally `targetId` apply required — **do not ship this id until that apply exists.** `FSN-DRY-STEP` is self-gated heal and does **not** wait on Cover’s Shield.

VARIANTS:

- `FSN-PARCHED-QUIET/NO-COVER` — fallback to `FSN-DRY-STEP` if ally Shield apply is missing.
- `FSN-HEAVE-QUIET` remains the force-join BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-STILL-REST

FORMATION_ID: `FSN-STILL-REST`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-STILL-MEND` — `queen` **with** heal / proposed `still_mender` — pack median
- `ROLE-CADENCE-REST` — `bishop` **without** heal / proposed `cadence_rester` — pack median
- `ROLE-CANTOR` — `queen` / proposed `once_cantor` (else `pale_cantor` **without** a second leftover-heal CORE) — pack median — Once / Shield; **no** Inferno as identity

VARIANT_RULES:

- Unlock after `FSN-DRY-STEP` **or** `FSN-HALVE-PACE` (player has seen a gated heal **or** a CD park). Wave 13 “Still Rest.”
- Elite: Mender only. Rester and Once stay junior.
- Still Mend is caster `walkMpSpentThisTurn === 0`. Leftover MP from Dual Keep does **not** substitute. Dry Gait / Dry Mend / Bar / Heave / Pale as CORE stay off PAIR (PAIR bans).
- Cadence Rest: own remaining CDs **do not tick** this turn. Does not rewrite remaining. Imprint / Pin / Stall / Theft stay off PAIR (PAIR bans).
- Once Cantor is the delayed-echo body, not a second healer CORE. If `once_cantor` is not ready, drop to Shield-only pale **without** `starter-heal` on that body (two healAmount kits collapse inference).
- Band 0: **do not spawn this id**. Show `FSN-DRY-STEP` if leftover-MP writers exist, else `FSN-WARD-MEND`.

SPELL_POOL_INTERACTIONS:

- Still Mend: heal 8 iff caster spent 0 walk MP this turn. Pull / shove the cantor so they want to walk is the designed punish.
- Cadence Rest: park Inferno 3 one extra turn on the Once / Ignite kit if remaining ≥ 2. New locks written this turn still apply.
- Together: camped heal, then Inferno remaining does not tick. Shove the cantor; Trim / Pin the parked locks.

TACTICAL_PLAN:

- Mender stays ≥ 3 back and Still-Mends when under 50% **and** she has not walked; else Shields. Rester Rests if Inferno remaining ≥ 2 **and** they can live without that tool this turn; else Frosts. Once holds.
- If the Mender dies, remaining pair is a CD-park bishop + glass cantor — intended.

SYNERGY:

- Camped heal + skip-own-tick + once. Wave 12 Halve Pace standing on a heal that needs you **not** to walk, plus a CD that needs you **not** to recast.

PLAYER_THREAT:

- Long fight. Spike only if Inferno is up **and** Rest parked it. Interruptible: shove the cantor, Trim the lock, kill the Mender.

COUNTERPLAY:

- Shove / Attract the cantor so she walks (Still Mend skips). Cursed Wound. Cadence Trim / Pin the parked Inferno. Kill the Mender (`hp` ~0.85). Do not dump Inferno into a fresh park.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a retreat tile that is not a one-cell choke. Once needs a tile outside any Frost Nova radius if that rare is later attached.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Mender: healer; skip if already walked or missing HP < 8.
- Rester: buffer; skip if all remaining are 0–1.
- Once: healer or caster depending on kit; **no** second leftover-heal CORE.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4.

VARIANTS:

- `FSN-STILL-REST/NO-ONCE` — Mender + Rester only (if Once kit would steal healer).
- `FSN-DRY-STEP` remains the leftover-MP heal PAIR; do not merge.

STATUS: PROPOSED

---

### FSN-FOE-ESCORT

FORMATION_ID: `FSN-FOE-ESCORT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-FOE-BITE` — `knight` **without** heal / proposed `foe_biter` — pack median + 1
- `ROLE-ESCORT-CUT` — `bishop` **without** heal / proposed `escort_cutter` — pack median
- `ROLE-SUMMONER` — `king` / proposed `brood_chanter` — pack median — `isSummoner`, `summon-dire-wolf` **or** `summon-archer` (not both on BASE)

VARIANT_RULES:

- Unlock after `FSN-NULL-BROOD` **or** `FSN-DRIFT-COURT/BRACE` (player has seen a pet engine **or** a hug bonus). Wave 13 “Foe Escort.”
- Elite: Chanter only. Biter and Cutter stay junior. Leader-boost is the escalation, not three elites.
- Chanter **replaces** the random overlay. Cap 1 living pet (below global cap 2) so the board is Chanter + pet + Biter + Cutter, not two wolves.
- **Never PAIR Foe Bite with Side / Lone / Nook.** **Never PAIR Escort Cut with Banner / Pet / Crown / Null as a two-body.** **Never PAIR Summon Toll with Brood as a two-body** — Toll is `FSN-LEAN-HOLD/TOLL`.
- Cutter prefers the **handler**, not the pet. Dummy Post is not a pet. Reads `isSummon` on neighbors, never `"wolf"`.
- Weight ×2 if the player has a summon spell **equipped**. Still valid if they do not — Biter waits for the Chanter’s pet.
- Proposed fall-through: Chanter Frosts when cap/cooldown hits.

SPELL_POOL_INTERACTIONS:

- Foe Bite: 10 + 8 if a living **hostile-to-the-target** stands at Chebyshev 1 from the target. Isolated target is 10 only. Never also apply Side Bite on the same hit.
- Escort Cut: 10 + 8 if the target has a living **allied summon** at Chebyshev ≤ 2. If the target **is** the summon, the bonus does **not** apply.
- Wolf Venom is the only pack DoT. Cutter does not also Poison.

TACTICAL_PLAN:

- Turn 1–2: Chanter waits for a **legal midpoint** (free, non-hazard, not the player’s only exit); else ring-scan. Biter walks a flank and Bites only if a crowd exists. Cutter Cuts the handler if a pet sits in 2; else Frosts.
- Wolf hunts nearest / lowest HP. Biter holds the player.
- If the player brought no pets, Cutter Frosts and the sheet is a Kennel with a crowd-bite knight.

SYNERGY:

- Crowd bonus on the handler, then pet-in-2 bonus. Wave 12 Side Brace standing on **hostile-to-target** and **handler**, not hug / ignore-force.

PLAYER_THREAT:

- Two-front pressure + pet sniping. Board cannot fill (cap 1 on this sheet). Isolated handler is 10-only Bite.

COUNTERPLAY:

- Peel so the target is isolated. Park pets at 3+. Sever Tether. Kill the wolf (4-turn lifespan) or the Chanter. Ignore the Biter if you are not clumping. Stand on the midpoint. AoE the clump (Biter + wolf).

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 6 free cells near the midpoint. Reject cramped maze (summon-in-a-closet).
- No void on the midpoint ring.

AI_REQUIREMENTS:

- Summoner + proposed cooldown fall-through.
- Biter: charger; skip if no adj hostile-to-target.
- Cutter: controller; skip if no pet in 2; prefer handler.
- Soph 4–6. `groupTactics`: one focus. Do not enable all three to peel the wisp.

VARIANTS:

- `FSN-FOE-ESCORT/ARCHER` — archer pup instead of wolf.
- `FSN-FOE-ESCORT/NO-BROOD` — BRIGADE-shaped CADRE if brood id is not ready: Biter + Cutter only (softer if the player brought a pet; almost a PAIR leftover if they did not — still valid).
- `FSN-NULL-BROOD` remains the anti-summon CADRE; this id is the **crowd / handler** CADRE.

STATUS: PROPOSED

---

### FSN-SPENT-CRACK

FORMATION_ID: `FSN-SPENT-CRACK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SPENT-TAX` — `bishop` **without** heal / proposed `spent_taxer` — pack median
- `ROLE-BRICK-CRACK` — `rook` **without** heal / proposed `brick_cracker` — pack median
- `ROLE-TAX` — `bishop` / proposed `tax_scribe` (else live `bone_scribe` with Mark only) — pack median — zone AP tax; **no** drain

VARIANT_RULES:

- Unlock after `FSN-BAR-PIN/STILL` **or** `FSN-BRICK-WATCH` (player has seen a camped-tax **or** a brick verb). Wave 13 “Spent Crack.”
- Elite: Cracker only. Taxer and Scribe stay junior.
- **Never PAIR Spent Tax with Still Tax / Gait Tax / Ley / Tax Scribe / Verse Tax.** This CADRE is the three-body lesson: tax the tool after they **walked last turn**, then open the file they hid behind, then glyph-tax the landing. Designed answers: camp last turn (Spent Tax fizzles), Strike (exempt), re-Barrier, leave the glyph zone, kill the glass Taxer.
- Glyph Tax is the **one** rare zone. Drain Courage is COURT, not this sheet (two AP engines).
- Brick Crack: remove **one** adjacent barrier. If the crack would seal the last path, AI skips; if forced, fizzle. Walls that are not barrier-paint are illegal. Do not edit `mapGen.ts`. Extra door is `crack_nave` — family is **not** that id.
- `walkMpSpentLastTurn` required. Walk **this** turn does not arm Spent Tax.

SPELL_POOL_INTERACTIONS:

- Spent Tax: if the target walked last turn, their next **non-Strike** tool also costs +1 AP. If they camped last turn, fizzle. Opposite of Still Tax / Quiet Hex.
- Brick Crack: open a file. Solvability skip.
- Glyph Tax: +1 AP to **cast** while in the 3×3, 0 damage. Leaving the zone is the answer. Cheap Strike from outside is legal.
- Together: you walked last turn to hide behind a barrier; Crack opens it; Spent Tax prices the next tool; Glyph prices the landing. Camping last turn skips Spent Tax entirely.

TACTICAL_PLAN:

- Turn 1: Scribe paints a 3×3 on a landing **only** if an exit exists. Taxer holds until `walkMpSpentLastTurn ≥ 1`. Cracker Cracks only if a file opens **and** `findPath` still reaches exit / enemy.
- If the player never walks, this is a softer glyph bishop + a Crack that may have nothing to erase — fine.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Walked-last-turn tax + remove barrier + glyph tax. Wave 12 Still Sprout standing on the inverse (they walked, not camped) plus a brick that **opens** instead of **grows**.

PLAYER_THREAT:

- Tempo. Failure is walking every turn, then paying +1 on Inferno from inside the glyph after the file opened onto you. Recoverable: camp a turn, Strike, re-Barrier, leave the zone, kill the Taxer.

COUNTERPLAY:

- Camp last turn (Spent Tax fizzles). Live on Strike. Pay the 1 AP. Re-Barrier. Leave the glyph zone. Strike from outside. Kill the Taxer (`hp` ~0.80). Do not stand so a crack opens a file onto you.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with **one** painted barrier the Cracker can legally erase **plus** a second file. Reject maps with no adjacent barrier (reroll) **and** maps where the only barrier is the last path (solvability).
- Glyph 3×3 must not cover **all** walk-offs from the landing.
- Extra room `crack_nave` may teach; it is not an extra hostile.

AI_REQUIREMENTS:

- Taxer: controller; skip if they camped last turn.
- Cracker: setter; skip if no adjacent barrier **or** the crack would seal the last path.
- Scribe: caster; zone the landing **only** if an exit exists; skip recast of an active tax (`AI-TEM-04`).
- Soph 4–6. `groupTactics` on. Blackboard: `openedFile`.

VARIANTS:

- `FSN-SPENT-CRACK/NO-GLYPH` — Taxer + Cracker only (if zone-AP is not ready). Still no Still Tax.
- `FSN-BAR-PIN/STILL` remains the camped-tax CADRE; this id is the **walked**-tax CADRE.

STATUS: PROPOSED

---

### FSN-PAIR-DRY

FORMATION_ID: `FSN-PAIR-DRY`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-PAIR-PURSE` — `pawn` **without** heal / proposed `pair_purser` — pack median − 1 — starts wide
- `ROLE-DRY-MEND` — `queen` **with** heal / proposed `dry_mender` — pack median
- `ROLE-ARBITER` — `king` / proposed `coil_arbiter` (else default) — pack median — Slow + Frost — **no drain** on BASE

VARIANT_RULES:

- Unlock after `FSN-LEAN-SIP` **or** `FSN-DRY-STEP` (player has seen leftover-AP poke **or** leftover-MP heal). Wave 13 “Pair Dry.”
- Elite: Purser only. Mender and Arbiter stay junior.
- **Never PAIR Pair Purse with Lone / Dry / Full / Lean / Ready.** **Never PAIR Dry Mend with Dry Gait / Still / Heave / Both / Pale.** This CADRE is leftover AP **exactly 2** poke, then cash **both leftover AP = 0** for 8. Designed answers: spend to 1 or 0, sit at 3, keep 1 leftover AP on one body, Cursed Wound, kill the Mender.
- Arbiter is the only Slow source. Cap Slow at −2 MP. Drain Courage is the **one** rare **instead of** a second AP engine, and only after `FSN-RIFT-KNOT` has been seen — BASE sheet has **no** drain (healAmount would steal healer if it leaked onto the Mender; on the Arbiter it would steal controller). If Drain is attached, it is the tool that lands them on leftover 2, not a second tax past −2.
- Extra door: **none** for Dry Mend — do not invent `dry_cantor`. Do not restamp `parched_cantor`.

SPELL_POOL_INTERACTIONS:

- Pair Purse: 10 + 8 iff **target** leftover AP at resolve is **exactly 2**. Leftover 0, 1, or ≥ 3 is 10 only.
- Dry Mend: heal 8 iff **caster and target** leftover AP = 0 after this spell’s 3 AP is paid. Self-cast requires the caster’s leftover AP is 0. Walk / force-move flags do **not** substitute.
- Slow from Arbiter makes spending down to 2 (or 0) expensive but not a stun. Spend the pair, or sit at 3.

TACTICAL_PLAN:

- Turn 1: Arbiter Slow first (high init family). Purser lurks at 3 and commits when leftover is exactly 2 **or** HP% ≤ 40. Mender Dry-Mends only if both leftover AP = 0 **and** missing HP ≥ 8; else Shields.
- Never dump leftover AP **only** to enable the 8 if a Strike would kill.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Exact-2 poke + leftover-AP=0 heal + Slow. Wave 12 Dual Ready standing on leftover **AP** instead of the leftover-pair, plus a heal that needs **both purses empty**. Spend the pair **or** keep 1.

PLAYER_THREAT:

- High if you sit on leftover 2 and trade the Purser, then empty both purses into an 8. Low if you spend to 1 or keep 3. Not unavoidable: spend the pair, keep 1 leftover AP, Cursed Wound, kill the Purser and eat Frost.

COUNTERPLAY:

- Spend leftover AP to 1 or 0 (Purse skips the 8). Sit at 3. Keep 1 leftover AP on one body (Dry Mend skips). Cursed Wound the Mender. Kill the Purser (`hp` ~0.75). Kill the Mender. Occupy the tile the Purser wants.

MAP_REQUIREMENTS:

- `openField` or `arena`. Purser needs a flank path that is not the only exit. Mender needs a retreat tile.
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Purser: flanker; skip if leftover is not 2 unless 10 still kills.
- Mender: healer; skip if either leftover AP ≥ 1.
- Arbiter: controller (`AI-ROL-07`) + `AI-TEM-04` (no second Slow).
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-PAIR-DRY/DRAIN` — COURT caution: Arbiter may hold Drain Courage **only** if `aiProfile` exists so healAmount does not steal controller, leftover lands on 2, and a walk-off remains. Still no Dry Gait on this id.
- `FSN-LEAN-SIP` remains the dry-purse/wet-walk PAIR; this id is the **exact-2 / dual-dry-AP** CADRE.

STATUS: PROPOSED

---

### FSN-LEAN-HOLD

FORMATION_ID: `FSN-LEAN-HOLD`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-LEAN-HOLD` — `knight` **without** heal / proposed `lean_holder` — pack median + 1 — `isLeader`
- `ROLE-MUST-LEAN` — `knight` **without** heal / proposed `must_leaner` — pack median
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median + 1 — on the backliner’s threat axis
- Optional fourth: `ROLE-ODD-HOOD` junior **or** omit — if present, Hoods the pocket, not a second leftover-MP lock

VARIANT_RULES:

- Unlock after `FSN-ODD-MUST` **and** a leader-boost CADRE (`FSN-RITE-LONG` or `FSN-PAIR-DRY`). Wave 13 “Lean Hold File.”
- One elite only: the Hold-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Lean Hold with Hold Knight / Rite / Tool / Boot / Must Lean.** This COURT is the three-lock lesson: cannot **Strike** until leftover MP = 0, cannot **tool** until leftover MP = 0, then a warden peels the aisle. Designed answers: dump leftover MP (both locks peel), live on waiting, kill Hold (glass-er than a golem), occupy the warden’s tile so the pocket never closes, blink / Swap (relocate ignores both leftover-MP locks).
- InstantKill / betrayal stay off. Root stays off (walk lock + leftover-MP tool lock is a full lockout). Dry Hold stays off (that is `FSN-LEAN-COURT`). `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Hold walks to the gallery after leftover MP = 0 peels them, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-LEAN-HOLD/LANE` (variant): drop optional Hood — Hold + Must Lean + Warden only, **only** if the player has already answered `FSN-ODD-MUST` **and** `FSN-RITE-LONG` (otherwise it clones those as a PAIR — banned).

SPELL_POOL_INTERACTIONS:

- Lean Hold: 2 of the target’s turns, they cannot confirm `physical_attack` / `isPhysical: true` until leftover walk MP = 0. Tools stay legal.
- Must Lean: remaining **non-Strike** spells illegal unless leftover walk MP = 0. Strike stays legal.
- Together: Strike **and** tools need leftover MP = 0 — unless you dump leftover MP, you wait. Warden Shield / Iron Skin / body-block. Optional Odd Hood: waste the 1-step poke — step to 2.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Hold if they still want to Strike with leftover MP ≥ 1. Must-Lean only after leftover MP ≥ 1 **and** they have a tool. Warden interposes with a **gap**. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Optional Hood holds the odd band. If Hold dies, Strike opens; Must Lean without Hold is a softer `FSN-ODD-MUST` leftover — intended. Hold may retreat (`escapeRoute`) after leftover MP = 0 rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Court-scale leftover-MP lock without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: dump leftover MP, wait, kill Hold, walk the gallery.

PLAYER_THREAT:

- Highest structured leftover-MP threat in this drop. Still turn-based. Failure is keeping leftover MP ≥ 1 to kite, then neither Strike nor Inferno confirms, while the Warden holds the door. Recoverable next turn after dumping the walk pool.

COUNTERPLAY:

- Dump leftover MP (both locks peel). Live on waiting. Kill Hold. Blink / Swap. Walk the gallery. Player Timestep is the designed panic. Do **not** also Root yourself. Step to 2 if Hood is up.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if leftover MP already 0; never also Root / Seal / Dry Hold; gate on `isPhysical === true`, never `spell.name === "Strike"`.
- Leaner: skip if leftover MP already 0; Strike stays legal on this body alone — the COURT is why both locks exist.
- Warden: guardian, `chokepointCamp` only with a gap.
- Optional Hood: skip if already at even Chebyshev.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-LEAN-HOLD/LANE` — BRIGADE-shaped: Hold + Must Lean + Warden only (ship if Hood gate is not ready). Still no Root.
- `FSN-LEAN-HOLD/NO-HOOD` — COURT of three.
- `FSN-LEAN-HOLD/SIX` — COURT **Six Plug**: replace this id’s members with `ROLE-SIX` + `ROLE-PARCHED-SILL` + `ROLE-LANCER`. 2×3 seal, nail walk-off, lance the long axis. **Skip until remaining cap ≥ 6** (live cap 2). Burst the 8 HP. Walk a far diagonal. Sit on the origin. `summonAI === "sixspan"` required. Do not also roll a second post. Needs a 2×3 free rectangle plus a gallery. Weight 0 on cramped 1-tile closets. Weight 0 until remaining cap ≥ 6.
- `FSN-LEAN-HOLD/BOUNCE` — COURT **Bounce File** (leftover-MP): replace Hold + Lean + Warden with `ROLE-PARCHED-BOUNCE` + `ROLE-MUST-LEAN` + `fuse_binder`. Two leftover-MP=0 bodies, bounce 12+8 onto the wick. **Never PAIR Parched Bounce with Heave Bounce / Storm / Ricochet.** Unlock after `FSN-HEAVE-CHOIR/BOUNCE` **or** `FSN-ODD-MUST`. Missing second leftover-MP=0 flag → 12 only. Player keeps ≥ 1 leftover MP on one ally/summon. `AI_KAMIKAZE_MIN_TARGETS` respected on the fuse; never solo-detonate on a full-HP player. Reject `corridorMaze`.
- `FSN-LEAN-HOLD/TOLL` — COURT **Toll Kennel**: replace Hold + Lean + Hood with `ROLE-SUMMON-TOLL` + `kennel_siller` + `null_censor`. Pets pay AP to walk, then they cannot leave — teach contrast vs Brace. **Never PAIR Summon Toll with Walk Toll / Kennel / Brace / Brood as a two-body.** Unlock after `FSN-FOE-ESCORT` **or** `FSN-DULL-PET`. Weight ×2 if the player has a living summon. Dummy Post is not a pet. Cap one kennel engine. Teleport / Swap / forced move do **not** pay the toll.
- `FSN-ODD-MUST` / `FSN-RITE-LONG` remain the teaching PAIR/CADRE; do not merge ids.
- `FSN-DRIFT-COURT` remains the **force-peel** COURT; this id is the **leftover-MP-peel** COURT.
- `FSN-DRIFT-COURT/SEPT` remains the 7-cell COURT; `/SIX` is the 6-cell COURT.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–13 still stand. This drop **meshes**; it does not replace.

```
PAIR:    DRY-STEP           LEAN-SIP           ODD-MUST          VOID-DWELL
              \\                 |                   |                  /
CELL:     DRY-GATE          DIAG-OATH          CINDER-FULL       OWN-WATCH
              \\                 |                   |                  /
BRIGADE:  PARCHED-QUIET     LEAN-COURT         STILL-REST        IMPRINT-CHOIR
              \\                 |                   |                  /
CADRE:    FOE-ESCORT        SPENT-CRACK        PAIR-DRY
              \\                 |                  /
COURT:                    LEAN-HOLD     LEAN-HOLD/SIX    LEAN-HOLD/BOUNCE    LEAN-HOLD/TOLL
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-DRY-STEP` | `FSN-DUAL-READY` **or** `FSN-STRIDE-DAMP` |
| `FSN-LEAN-SIP` | `FSN-DRY-TAX` **or** `FSN-DUAL-READY` |
| `FSN-ODD-MUST` | `FSN-NEAR-MUST` **or** `FSN-MID-DRIFT` |
| `FSN-VOID-DWELL` | `FSN-CINDER-MARK` **or** `FSN-EMBER-RIFT` |
| `FSN-DRY-GATE` | `FSN-DRIFT-GATE` **or** `FSN-DRY-TAX` |
| `FSN-DIAG-OATH` | `FSN-INCH-OATH` **or** `FSN-NEAR-MUST` |
| `FSN-CINDER-FULL` | `FSN-SPIKE-TAP` **or** `FSN-LAVA-STILL` |
| `FSN-OWN-WATCH` | `FSN-OFF-FEE` **or** walked into Hold Ground / Far Watch |
| `FSN-IMPRINT-CHOIR` | `FSN-HALVE-PACE` **or** `FSN-TRIM-TAX` |
| `FSN-LEAN-COURT` | `FSN-LEAN-SIP` |
| `FSN-PARCHED-QUIET` | `FSN-DRY-STEP` + (`FSN-HEAVE-QUIET` or `FSN-ALLY-SILL`) |
| `FSN-STILL-REST` | `FSN-DRY-STEP` **or** `FSN-HALVE-PACE` |
| `FSN-FOE-ESCORT` | `FSN-NULL-BROOD` **or** `FSN-DRIFT-COURT/BRACE` |
| `FSN-SPENT-CRACK` | `FSN-BAR-PIN/STILL` **or** `FSN-BRICK-WATCH` |
| `FSN-PAIR-DRY` | `FSN-LEAN-SIP` **or** `FSN-DRY-STEP` |
| `FSN-LEAN-HOLD` | `FSN-ODD-MUST` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 14 packs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-10-21.md`](../automation/SPELL_PROPOSALS_2026-10-21.md) (open as PR #849) stamps **new** verbs with **no family sheets**. Remaining SDE Wave 12 unique CORE (`spell-orth-stride` … `spell-reach-fold`, except Dry Gait already consumed) still has no CORE owner. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations after Wave 14 elite-evolution families exist.

Do **not** pack `lean_holder` with `must_leaner` as a teaching pair (Wave 13 rule). `FSN-ODD-MUST` stays the tools-until-leftover-MP=0 lesson; `FSN-LEAN-HOLD` stays the Strike-until-leftover-MP=0 COURT.

Do **not** pack `dry_gaiter` with `dry_mender` as a teaching pair. `FSN-DRY-STEP` stays the leftover-MP=0 lesson; `FSN-PAIR-DRY` stays the leftover-AP=0 CADRE.

Do **not** ship `spell-parched-mend` beside Dry Gait.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–13, plus Wave 13 verbs in this order (from elite-evolution §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-ODD-MUST` band 0 can ship among the first** once family HP survives battle start. `FSN-DRY-STEP` needs band 1 heal **and** leftover-MP writers.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Dry Gait / Still Mend / Dry Mend must live only on healer profiles.**
4. Battle-walk writers: `walkMpSpentThisTurn`, leftover AP / leftover MP, vacated cell, `currentView` (facing families still wait), **`walkMpSpentLastTurn`**, **`lastResolvedSpellId`**. Wave 13 adds **zero** force-gated CORE — `forcedMovedThisTurn` / `lastForcedMoveDir` remain prerequisites for Waves 6–12 sheets, not this drop.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Parched Step occupancy dests (not `isSwap`). Void Reel = sixth attract dest flavor (toward, not onto, a world portal).
6. `inferSummonArchetype` gains `sixspan` and `leanpost` (and still needs `septspan` / `driftpost` / `pentaspan` / `quadspan` / `dummypost` / `triplespan` from Waves 8–12). Raise or gate `ENEMY_SUMMON_CAP` before Six Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Lean Lend). **`FSN-PARCHED-QUIET` and `FSN-LEAN-COURT/LEND` must not ship before that apply exists** for the ally tools they name. `FSN-DRY-STEP` / `FSN-STILL-REST` / `FSN-PAIR-DRY` are self-gated heals and do **not** wait on Cover’s Shield.
8. Dry Hold until leftover AP = 0. Must Lean / Lean Hold / Verse Lean / Mid Oath / Diag Stride as refuse-until. Dwell Mark end-turn occupy. Lean Post leftover-AP=0 occupy. Full Plate leftover-AP≥3. Pair Purse exact-2. Odd Hood consume-before-damage.
9. Summoner cooldown fall-through (six / leanpost skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT six sheets assume the lottery does not add a second engine.
11. Do **not** ship `spell-parched-mend`. SDE Wave 12 Dry Gait won leftover-MP=0 heal.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-DRY-STEP`, `FSN-PARCHED-QUIET` | leftover-MP writers on **both** bodies; Parched Step occupancy dest (not `isSwap`); ally `targetId` for Cover Shield on Quiet only |
| `FSN-LEAN-SIP`, `FSN-LEAN-COURT` | leftover-AP + leftover-MP reads; Lean Sting AP=0 **and** MP≥1; Sip leftover-AP=0; Dry Hold until leftover AP = 0 |
| `FSN-ODD-MUST` | Odd Hood exact-odd consume; Must Lean leftover-MP tool-lock; Strike remains legal; even Chebyshev lands |
| `FSN-VOID-DWELL` | sixth `applyAttract` dest (void/portal); Dwell end-turn occupy; dest is not the portal; map has a void in 4 |
| `FSN-DRY-GATE` | Lean Post leftover-AP=0 occupy / walk-safe / leftover-AP≥1-safe; Parched Sill walk-MP reject; two different tiles; `summonAI === "leanpost"` |
| `FSN-DIAG-OATH` | Diag Stride `|dx|==|dy|`; Mid Oath exact 2; Strike remains legal; blink does not pay |
| `FSN-CINDER-FULL` | 1-tile cinder skip; Full leftover-AP≥3; one clean aisle; map has a cinder cell |
| `FSN-OWN-WATCH` | Own-turn miss; Watch Lend grants +1 AP and still deals |
| `FSN-IMPRINT-CHOIR` | `lastResolvedSpellId`; Imprint copy-matching; Verse Lean leftover-MP peel (shove does not); Ignite stack gate ≥ 2 |
| `FSN-STILL-REST` | `walkMpSpentThisTurn === 0`; Rest skip-own-tick (not a rewrite) |
| `FSN-FOE-ESCORT` | adj-hostile scan; handler `isSummon` neighbor scan; brood cap 1; Dummy Post is not a pet |
| `FSN-SPENT-CRACK` | `walkMpSpentLastTurn`; Crack solvability skip; never Spent+Scribe as PAIR |
| `FSN-PAIR-DRY` | leftover-AP exactly 2; Dry Mend both leftover AP = 0; no Dry Gait on this id |
| `FSN-LEAN-HOLD` | Lean Hold until leftover MP = 0; Must Lean leftover-MP tool-lock; never Root; dump leftover MP peels both |
| `FSN-LEAN-HOLD/SIX` | `summonAI === "sixspan"` **and** remaining cap ≥ 6 (live cap 2 → skip) |

---

## Sources (line-accurate, 2026-10-22)

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
- Wave 13 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-10-21.md` (PR #840) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-09-29.md` (PR #787); leftover SDE Wave 11 unique CORE in PR #747; SDE Wave 12 Dry Gait in PR #802
- Drop 13: `docs/design/ENEMY_FORMATIONS_2026-10-21.md` (PR #825)

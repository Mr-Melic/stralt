# Enemy synergy and formation catalog (drop 12)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-29  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–11 already taught the seven pairing words and Waves 1–10 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 11 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-28.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-28.md) (open as PR #752) and deferred by drop 11 (PR #727): Both Choir, Stride Bank, Penta Plug, Trim Tax, Near Step, Cast Quiet Court, Shove Pace, Ally Quiet, Pair File, Boot Oath, Paint Nook, Stride Pulpit, Foe Goad, Lava Still, Body Clash, Shave Once, Gait Pulpit, Brick Watch, Full Kennel, Sip Step.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669), [`ENEMY_FORMATIONS_2026-09-28.md`](./ENEMY_FORMATIONS_2026-09-28.md) (drop 11 — open as PR #727). Family sheets: PR #752. Spell verbs: Wave 10 tactical ids in PR #695 (`spell-both-mend` … `spell-spent-lend`) plus SDE Wave 9 unique CORE (`spell-pair-stride` … `spell-pet-cut`).

**Hard rules (Wave 11 pack law — plus every older law still stands):**

- Do **not** pack `both_mender` with `gait_mender` / `chase_mender` / `shove_mender` / `clash_mender` / `enter_mender` / `pale_cantor` as a PAIR (dual-walk heal vs caster-walked vs target-walked vs force-moved vs Struck vs enter vs unconditional). `FSN-GAIT-PACE` / `FSN-SHOVE-BASH` / `FSN-WARD-MEND` stay theirs. `FSN-BODY-CLASH` owns Struck.
- Do **not** pack `stride_keeper` with `purse_keeper` / `leftover_lender` / `spare_pacer` / `tempo_precentor` as a PAIR (leftover-**MP** bank vs leftover-**AP** bank vs dump vs ungated +1 MP vs next-turn AP). BRIGADE `FSN-BOTH-CHOIR` is the two-walk-fund lesson, never a two-bank PAIR. `FSN-DRY-KEEP` stays Purse Keep.
- Do **not** pack `penta_prelate` with `quad_prelate` / `triple_span` / `twin_span` / `dummy_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Penta counts as **5**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 5. Live cap is **2** — skip `FSN-CAST-QUIET/PENTA`. `FSN-HOLD-VERSE/QUAD` / `FSN-TWIN-PLUG` / `FSN-TRIPLE-PLUG` stay theirs.
- Do **not** pack `cadence_trimmer` with `cadence_shaver` / `cadence_stretcher` / `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender` as a PAIR (−1 hostile remaining vs ally −1 vs ×2 vs +1 vs highest→0 vs ally all→0 vs steal vs −1 one id). `FSN-STRETCH-MUTE` / `FSN-FLUSH-DUMP` / `FSN-CRACK-VERSE` stay theirs. `FSN-BOOT-OATH/SHAVE` is Shave Once, never Trim+Shave.
- Do **not** pack `near_hooder` with `far_hooder` / `sidestep_warder` / `hood_lurker` / `thin_warder` as a PAIR (≤1 miss vs ≥3 miss vs any-range skip vs Fog Hood vs hit-cap). `FSN-WICK-HOOD` / `FSN-HOOD-CHOIR` stay theirs.
- Do **not** pack `gait_sipper` with `soul_siphon` / `walk_toller` / `gait_taxer` / `tide_shade` as a PAIR (steal 1 MP if walked vs ungated sip vs +1 walk cost vs next-spell +1 if walked vs melee slow). BRIGADE `FSN-NEAR-STEP/SIP` is Sip Step, never a two-MP-tax PAIR. `FSN-IRON-TIDE` stays theirs.
- Do **not** pack `cast_siller` with `quiet_siller` / `hold_caster` / `tool_holder` / `first_verser` as a PAIR (tile forbids **non-physical** vs tile forbids **Strike** vs unit spells-until-walk vs unit tools-until-Strike vs Strike-until-spell). COURT `FSN-CAST-QUIET` is the three-lock lesson. `FSN-HOME-SILL` / `FSN-HOLD-VERSE` stay theirs.
- Do **not** pack `shove_stinger` with `exit_stinger` / `enter_mender` / `fuse_binder` / `glyph_sower` / `trip_mason` as a PAIR (force-landing 8 vs leave 8 vs enter heal vs tile bomb vs Mark vs wire). `FSN-EXIT-PAIR` / `FSN-SHOVE-BASH` stay theirs.
- Do **not** pack `must_stepper` with `must_spanner` / `pair_strider` / `even_warder` / `odd_warder` / `diag_locksmith` as a PAIR (remaining walks Chebyshev **1** vs Manhattan **2** vs one next Manhattan 2 vs even vs odd vs diagonal). `FSN-WICK-SPAN` / `FSN-DIAG-BRICK` stay theirs. CADRE `FSN-STRIDE-PULPIT` owns Pair Stride.
- Do **not** pack `ally_stepper` with `home_stepper` / `hook_chaplain` / `ally_reeler` / `hinge_squire` / `cover_squire` as a PAIR (ally→caster vs caster→ally vs line rescue vs pull-to-ally vs 90° vs cover). `FSN-HOME-SILL` / `FSN-ALLY-WICK` / `FSN-HINGE-GLANCE` stay theirs.
- Do **not** pack `damp_stinger` with `dry_stinger` / `full_purser` / `empty_plater` / `still_plater` / `lone_stinger` as a PAIR (leftover **walk MP ≥ 2** poke vs leftover **AP = 0** poke vs leftover **AP ≥ 3** poke vs leftover-0 +RES vs leftover-MP-0 +RES vs isolation). `FSN-DRY-TAX` stays Dry. `FSN-LAVA-STILL` owns Still Plate. Full Purse lives on `FSN-CAST-QUIET/KENNEL`.
- Do **not** pack `pair_pacer` with `pair_slider` / `pair_porter` / `pair_strider` / `hinge_squire` / `pawn_broker` as a PAIR (caster+ally translate 1 vs two hostiles vs 90° vs one next Manhattan 2 vs 90° around ally vs swap). `FSN-EXIT-PAIR` / `FSN-PAIR-PEEL` stay theirs.
- Do **not** pack `verse_taxer` with `last_muter` / `gait_taxer` / `hex_teller` / `gait_muter` as a PAIR (last-id +1 AP vs last-id **illegal** vs walked-spell +1 vs leftover-AP tax vs next-any mute). `FSN-STRETCH-MUTE` / `FSN-DRY-TAX` stay theirs. `FSN-STRIDE-PULPIT/GAIT` is Gait Pulpit, never Verse+Last Mute PAIR.
- Do **not** pack `tool_holder` with `first_verser` / `hold_caster` / `boot_holder` / `hold_knight` / `quiet_siller` / `cast_siller` / `dull_censor` as a PAIR. COURT `FSN-CAST-QUIET` and CADRE `FSN-BOOT-OATH` are the multi-lock lessons.
- Do **not** pack `spent_lender` with `boot_lender` / `spare_pacer` / `gift_siller` / `leftover_lender` / `tempo_precentor` as a PAIR (walked-ally +1 MP vs unmoved +1 vs ungated +1 vs enter +MP vs dump vs next-turn AP). BRIGADE `FSN-BOTH-CHOIR` is the three-body lesson. `FSN-BOOT-CHASE` stays Boot Lend.
- Do **not** pack `pair_strider` with `must_spanner` / `must_stepper` / `even_warder` / `odd_warder` / `axis_locksmith` / `misstep_herald` as a PAIR.
- Do **not** pack `boot_holder` with `hold_knight` / `hold_caster` / `gait_sealer` / `first_verser` / `tool_holder` / `snare_weaver` as a PAIR (cannot **walk** until Strike vs cannot Strike until walk vs cannot spell until walk vs cannot walk/spells legal vs Strike-until-spell vs tools-until-Strike vs Root). `FSN-HOLD-VERSE` / `FSN-WIRE-ROOT` stay theirs.
- Do **not** pack `near_oather` with `unit_oather` / `ground_oather` / `dim_optic` / `far_stinger` as a PAIR (next spell range **≤ 1** vs unit-class vs ground-only vs range shrink vs extras). `FSN-FOE-FANG` leftover oaths stay theirs.
- Do **not** pack `paint_reeler` with `foe_reeler` / `ally_reeler` / `file_reeler` / `echo_painter` / `sink_chanter` as a PAIR (pull toward **paint** vs other hostile vs ally vs file-to-caster vs copy paint vs tile gravity). `FSN-FOE-FANG` / `FSN-ALLY-WICK` / `FSN-BRAND-REEL` stay theirs.
- Do **not** pack `nook_biter` with `field_biter` / `wall_biter` / `wall_stinger` / `lone_stinger` as a PAIR (exactly **one** adj block vs 0 blocks vs any hug vs barrier-hug vs isolation). `FSN-FIELD-WIPE` / `FSN-WALL-HUG` / `FSN-LONE-NAIL` stay theirs.
- Do **not** pack `stride_marker` with `gait_wicker` / `exit_stinger` / `wound_marker` / `cast_marker` / `body_marker` / `fuse_binder` as a PAIR (cell-leave detonate vs unit walk-MP wick vs first leave vs hit-detonate vs cast-detonate vs unit amp vs tile bomb). `FSN-WICK-HOOD` / `FSN-EXIT-PAIR` / `FSN-BODY-CAST` stay theirs.
- Do **not** pack `foe_plater` with `split_plater` / `twin_tether` / `pain_suture` / `share_warden` / `cover_squire` as a PAIR (incoming 50/50 with adj **enemy** vs adj **ally** vs ongoing tether vs whole redirect vs share vs cover). `FSN-SHARE-GOAD` / `FSN-PLATE-LINK` stay theirs.
- Do **not** pack `lava_skipper` with `pit_skipper` / `pit_mason` / `ghost_stepper` / `wick_painter` as a PAIR (1-tile lava as floor vs pit as floor vs place pit vs ghost occupancy vs delayed pit). `FSN-SLIP-PIT` stays theirs.
- Do **not** pack `still_plater` with `empty_plater` / `dry_stinger` / `plate_warden` / `tempo_precentor` as a PAIR (leftover-**MP** 0 → +RES vs leftover-**AP** 0 → +RES vs leftover-AP 0 **damage** vs absorb vs next-turn AP).
- Do **not** pack `body_siller` with `kennel_siller` / `snare_weaver` / `quiet_siller` / `gait_sealer` / `leash_warden` as a PAIR (primary cannot leave vs summons cannot leave vs occupant cannot Strike vs Root vs cannot walk vs occupy). `FSN-WIRE-ROOT` / `FSN-HOME-SILL` / `FSN-DULL-PET` stay theirs.
- Do **not** pack `clash_mender` with `shove_mender` / `chase_mender` / `gait_mender` / `both_mender` / `pale_cantor` / `enter_mender` as a PAIR.
- Do **not** pack `cadence_shaver` with `cadence_trimmer` / `cadence_flusher` / `cadence_lender` / `cadence_thief` as a PAIR.
- Do **not** pack `gait_taxer` with `gait_sipper` / `walk_toller` / `ley_tollkeeper` / `verse_taxer` / `tax_scribe` as a PAIR.
- Do **not** pack `brick_wiper` with `brick_shifter` / `echo_wiper` / `rime_mason` / `stone_castellan` as a PAIR (erase barrier vs slide barrier vs erase **paint** vs ice vs turret extras). `FSN-FIELD-WIPE` stays Echo Wipe. BRIGADE `FSN-BRICK-WATCH/GUN` is Brick Watch with the turret, never a two-erase PAIR.
- Do **not** pack `watch_muter` with `far_hooder` / `last_muter` / `gait_muter` / `hood_lurker` as a PAIR (next overwatch snap 0 vs ≥3 hit 0 vs last-id illegal vs next-any mute vs Fog Hood).
- Do **not** pack `full_purser` with `dry_stinger` / `purse_keeper` / `empty_plater` / `purse_scribe` / `bone_scribe` as a PAIR.
- Do **not** pack `pet_cutter` with `null_censor` / `leash_cutter` / `crown_cutter` / `kennel_siller` / `spark_chanter` as a PAIR (bonus vs player-side summon vs lockout kit vs lifespan→1 vs leader poke vs cannot-leave vs spark). `FSN-NULL-WALL` / `FSN-DULL-PET` stay theirs.
- Drop 4–11 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two leftover-MP banks; no two walk-shape locks; no two heal-if-gated CORE as PAIR).

Wave 11 **SPELL_PROPOSALS** (`SPELL_PROPOSALS_2026-09-28.md`, open as PR #726) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 11 tactical verbs (`spell-heave-mend` … `spell-court-dual`, including Sept Span) until that family pass exists (Wave 12). Same-day SDE Wave 10 unique CORE stays G≥10 extras.

Court Keep / Pack Stride / Knight Fold stay **boss / closed-class**. Court Keep may witness on CHAMPION `stride_keeper` only — never as a world-pack CORE.

**Do not spawn Shove Sting sheets until every push / pull / swap / hinge / pair-slide / pair-pace / ally-step / home-step / conveyor writer sets `forcedMovedThisTurn`.** Walk MP must **not** set it. Missing field → Shove Sting deals **0** (fail closed). Until that writer lands, show `FSN-SHOVE-BASH` / `FSN-HOOK-SLAM` instead of `FSN-SHOVE-PACE`.

**Do not spawn Verse Tax sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Verse Tax fizzles (fail closed). Until that writer lands, show `FSN-STRETCH-MUTE` instead of `FSN-TRIM-TAX`.

**Do not spawn Clash Mend sheets until a successful Strike / `physical_attack` / `isPhysical: true` resolve writes `struckThisTurn` on the striker.** Walk / force-move / DoT / lava / spikes must **not** set it. Missing field → Clash Mend pays **0 HP**. Until that writer lands, show `FSN-SHOVE-BASH` instead of `FSN-BODY-CLASH`.

**Do not spawn Both Mend / Gait Sip / Spent Lend / Damp Sting / Must Step / Stride Keep / Cast Sill / Stride Mark / Still Plate / Gait Tax escorts until a battle-walk writer exists for `walkMpSpentThisTurn`.** Forced-move / Swap / Home Step / Ally Step / Pair Pace / Pair Slide **does not** increment walk-spend. Leftover-MP bank (`spell-stride-keep`) also needs an end-of-turn snapshot paid at **that unit’s next turn start** — not a queue splice, not Purse Keep’s leftover-**AP** table.

**Do not spawn Penta Plug until `inferSummonArchetype` keys `summonAI === "pentaspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 5.** Live cap is 2. Name heuristics stay a bug. Penta fills the stationary-post **and** the multi-cell-system cap (5). Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost/quadspan onto that body.

**Ally Step / Pair Pace dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after bodies land. Paint Reel is the **fourth** `applyAttract` dest flavor (File Reel, Ally Reel, Foe Reel, then paint).

---

## Grounding (live, 2026-09-29)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–11. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–224 — **no** `pentaspan` / `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Ally Step / Pair Pace are occupancy dests, **not** `isSwap`. Paint Reel is the fourth **cast** caller of attract. |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 11 CORE rows stay `mpCost: 0`. Gait Sip / Stride Keep / Spent Lend rewrite **current MP**, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| `forcedMovedThisTurn` / `lastResolvedSpellId` / `struckThisTurn` / leftover-MP bank | **Absent** — Shove Sting / Verse Tax / Clash Mend / Stride Keep fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad / **penta** bodies **replace** the random overlay. Cap one of those engines. Penta Span **is** the 5-cell post and needs remaining cap ≥ 5.
3. Any `healAmount` steals healer. **Both Mend / Clash Mend must live only on healer profiles.** Do not put those ids, drain, or nova on Keeper, Sipper, Siller, Stinger, Stepper, Pacer, Taxer, Holder, Lender, Strider, Oather, Reeler, Biter, Marker, Plater, Skipper, Shaver, Wiper, Muter, Purser, or Cutter.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Spent Lend / Split Mend / Both Mend / Clash Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 11 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Gait Sip / Stride Keep / Spent Lend rewrite current MP.
6. `inferSummonArchetype` must key `summonAI === "pentaspan"` **before** any Penta sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Wipe that **erases** an already planted barrier (it does not mint a new one). Tool Hold / Boot Hold / Cast Sill / Near Oath / Body Sill are **not** `instantKill`.
8. Ally-step dest / pair-pace dest / paint-reel dest / penta plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Pair Pace into a wall is a fizzle (no crush). Ally Step dest is a free Chebyshev-1 of the **caster** — occupying the ring is the designed answer.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Gait Sip: cap applied unit MP debuff at **−2**. One Slow **or** one Gait Sip source per pack, not both stacking past that cap. Stride Keep is a **bank**, not a third tax. Do not also Root + Gait Seal + Must Step + Pair Stride + Boot Hold on the same AP bar.
10. Walk-spend: Both Mend / Gait Sip / Spent Lend / Damp Sting / Must Step / Stride Keep / Cast Sill / Stride Mark / Still Plate / Gait Tax **fail closed** until `walkMpSpentThisTurn` exists on the turn actor. Ally Step / Pair Pace / Paint Reel / Penta plant **does not** increment it.
11. Force-move: Shove Sting **fail closed** until `forcedMovedThisTurn` writers exist. Walk MP must not set it.
12. Last-id: Verse Tax **fail closed** until `lastResolvedSpellId` exists.
13. Struck: Clash Mend **fail closed** until `struckThisTurn` exists on the striker.

### Relative difficulty (same grades as drops 1–11)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…11 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a leftover-MP tell / a walk-tax / a walk-lock / a tile lock) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (hood / step / sting / pace / hold / plate / skip / clash-bruiser / goad / golem): pack median + one step.
- Backliner (both-mend / clash-mend / keep / sip / sill / tax / trim / shave / oath / reel / mark / wipe / mute / lend / stride / oather): pack median.
- Glass (damp, sip, trim, tax, mark, wipe, mute, purse, cutter, ignite, spare, sniper): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 12)

Drop 1–11 overlays still apply. These are **additional jobs** for Wave 11 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-BOTH-MEND` | `queen` **with** heal | proposed `both_mender` | `spell-both-mend`, `starter-shield` | healer; skip if either `walkMpSpentThisTurn` is 0 or missing HP < 8; force-move does **not** pay |
| `ROLE-STRIDE-KEEP` | `bishop` **without** heal | proposed `stride_keeper` | `starter-frost`, `spell-stride-keep` | buffer; skip if leftover walk MP is 0; bank cap 2 to **next own turn start**, once/battle; not a queue splice |
| `ROLE-PENTA` | `rook` **without** heal | proposed `penta_prelate` | `physical_attack`, `spell-penta-span` | `isSummoner` for penta only; post `summonAI: "pentaspan"`, plus occupy, empty kit, remaining cap ≥ 5; skip if any of five cells blocked |
| `ROLE-TRIM` | `bishop` **without** heal | proposed `cadence_trimmer` | `starter-frost`, `spell-cadence-trim` | controller; skip if highest remaining CD < 2; 0 stays 0; never invent locks |
| `ROLE-NEAR-HOOD` | `pawn` or `knight` **without** heal | proposed `near_hooder` | `physical_attack`, `spell-near-hood` | guardian; skip if no adjacent threat; hits from ≥ 2 do not consume; DoT does not consume |
| `ROLE-GAIT-SIP` | `bishop` **without** heal | proposed `gait_sipper` | `starter-frost`, `spell-gait-sip` | caster; steal 1 current MP iff they walked; stand is 0; skip if walk-spend missing |
| `ROLE-CAST-SILL` | `rook` **without** heal | proposed `cast_siller` | `starter-frost`, `spell-cast-sill` | setter; occupant cannot resolve **non-physical**; Strike from the cell is legal; step off is legal |
| `ROLE-SHOVE-STING` | `pawn` or `rook` **without** heal | proposed `shove_stinger` | `physical_attack`, `spell-shove-sting` | setter; first **forced-move landing** deals 8; walk is free; skip empty cells |
| `ROLE-MUST-STEP` | `knight` **without** heal | proposed `must_stepper` | `physical_attack`, `spell-must-step` | controller; remaining walks this turn must be Chebyshev exactly 1; 0 walk legal; relocate any length legal |
| `ROLE-ALLY-STEP` | `queen` **without** heal | proposed `ally_stepper` | `physical_attack`, `spell-ally-step` | protector; skip if no free adj of caster; relocate, **not** `isSwap` |
| `ROLE-DAMP` | `knight` **without** heal | proposed `damp_stinger` | `physical_attack`, `spell-damp-sting` | flanker; skip if leftover walk MP < 2 unless 10 still kills; bank does **not** empty leftover this turn |
| `ROLE-PAIR-PACE` | `queen` **without** heal | proposed `pair_pacer` | `starter-frost`, `spell-pair-pace` | caster; skip if no Chebyshev-1 ally or either dest blocked (whole card fizzles); not `isSwap` |
| `ROLE-VERSE-TAX` | `bishop` **without** heal | proposed `verse_taxer` | `starter-frost`, `spell-verse-tax` | controller; skip if no last id or last is Strike with Frost still legal at cost 1 |
| `ROLE-TOOL-HOLD` | `knight` **without** heal | proposed `tool_holder` | `physical_attack`, `spell-tool-hold` | controller; non-physical refuse until they Strike; Strike stays legal |
| `ROLE-SPENT-LEND` | `bishop` **without** heal | proposed `spent_lender` | `spell-spent-lend`, `starter-frost` | buffer (`AI-ROL-05`); +1 current MP if ally **has** walked; skip if unmoved or at max MP |
| `ROLE-PAIR-STRIDE` | `bishop` **without** heal | proposed `pair_strider` | `starter-frost`, `spell-pair-stride` | caster; **one** next walk Manhattan exactly 2; last writer vs Must Span |
| `ROLE-BOOT-HOLD` | `rook` **without** heal | proposed `boot_holder` | `physical_attack`, `spell-boot-hold` | controller; cannot **walk** until they Strike; spells stay legal |
| `ROLE-NEAR-OATH` | `bishop` **without** heal | proposed `near_oather` | `starter-frost`, `spell-near-oath` | caster; next spell must have range ≤ 1; Strike remains legal; Frost at 4 fizzles |
| `ROLE-PAINT-REEL` | `queen` **without** heal | proposed `paint_reeler` | `starter-frost`, `spell-paint-reel` | caster; pull 1 toward nearest **paint**; skip if no living paint or dest blocked |
| `ROLE-NOOK` | `bishop` **without** heal | proposed `nook_biter` | `starter-frost`, `spell-nook-bite` | artillery; +8 iff **exactly one** adj blocking tile; skip if 0 or ≥ 2 |
| `ROLE-STRIDE-MARK` | `pawn` or `bishop` **without** heal | proposed `stride_marker` | `physical_attack`, `spell-stride-mark` | setter; cell paint detonates on **walk-leave that cell**; blink / Swap clear for 0; skip empty |
| `ROLE-FOE-PLATE` | `rook` **without** heal | proposed `foe_plater` | `physical_attack`, `spell-foe-plate` | guardian; skip if no Chebyshev-1 **enemy**; missing-neighbor at hit time → full hit, charge gone |
| `ROLE-LAVA-SKIP` | `knight` **without** heal | proposed `lava_skipper` | `physical_attack`, `spell-lava-skip` | flanker; next **1-tile** walk treats lava as floor; pit / void / barriers still illegal |
| `ROLE-STILL-PLATE` | `rook` **without** heal | proposed `still_plater` | `physical_attack`, `spell-still-plate` | guardian; leftover walk MP 0 → +RES; skip if leftover ≥ 1 |
| `ROLE-BODY-SILL` | `bishop` **without** heal | proposed `body_siller` | `starter-frost`, `spell-body-sill` | caster; **primary** cannot leave the cell; pets walk freely; blink / Swap end it |
| `ROLE-CLASH-MEND` | `queen` **with** heal | proposed `clash_mender` | `spell-clash-mend`, `starter-shield` | healer; skip if target `struckThisTurn` is false or missing HP < 8; walk / shove do not pay |
| `ROLE-SHAVE` | `bishop` **without** heal | proposed `cadence_shaver` | `starter-frost`, `spell-cadence-shave` | buffer; −1 **all** remaining CDs on an **ally**; 0 stays 0; never Trim the player on this overlay |
| `ROLE-GAIT-TAX` | `bishop` **without** heal | proposed `gait_taxer` | `starter-frost`, `spell-gait-tax` | caster; next spell +1 AP if they walked; skip if walk-spend is 0 |
| `ROLE-BRICK-WIPE` | `rook` **without** heal | proposed `brick_wiper` | `physical_attack`, `spell-brick-wipe` | setter; erase **one** adjacent barrier; skip if none; does not mint a new wall |
| `ROLE-WATCH-MUTE` | `pawn` **without** heal | proposed `watch_muter` | `physical_attack`, `spell-watch-mute` | controller; next overwatch snap deals 0 (still consumes); skip if no overwatch in play |
| `ROLE-FULL-PURSE` | `knight` **without** heal | proposed `full_purser` | `physical_attack`, `spell-full-purse` | flanker; skip if leftover AP < 3 unless 10 still kills |
| `ROLE-PET-CUT` | `knight` **without** heal | proposed `pet_cutter` | `physical_attack`, `spell-pet-cut` | flanker; +10 iff target `isSummon` **and** `side === "player"`; never name-parse `"wolf"` |

Drop-2…11 `ROLE-SPARE` / `ROLE-SNIPER` / `ROLE-PUSHER` / `ROLE-IGNITE` / `ROLE-SEAL` / `ROLE-WARDEN` / `ROLE-TANK` / `ROLE-GOAD` / `ROLE-QUIET-SILL` / `ROLE-HAZARD` / `ROLE-KITER` / `ROLE-ONCE` / `ROLE-TEMPO` / `ROLE-TURRET` / `ROLE-BRUISER` / `ROLE-FUSE` / `ROLE-LANCER` / `ROLE-GLYPH` / `ROLE-SPLIT-MEND` / `ROLE-LAST-MUTE` are reused below. Do not also roll the random 12% summoner overlay onto Both-mend, Keep, Trim, Hood, Sip, Sill, Sting, Step, Pace, Tax, Hold, Lend, Strider, Oather, Reel, Nook, Mark, Plate, Skip, Clash, Shave, Wipe, Mute, Purse, or Cut. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** triple-span **or** spark **or** dummy **or** quad **or** penta — never two). Penta occupies the stationary-post **and** the multi-cell cap (5).

### Fair-fight rules (every sheet)

Same as drops 1–11, plus Wave 11:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, cast-sill that is the only aisle, quiet-sill that is the only aisle, pair-pace dest that is the only aisle, penta plus that seals every gallery, or a body-sill that nails the only exit.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Both Mend: heal 8 iff **caster and target** both walked. Keep one still; it is a Shield queen.
- Stride Keep: banks leftover walk MP (cap 2) to next own turn start. Kill them before that start. Not Timestep. Not Purse Keep.
- Penta Span: plus occupy, counts as 5, empty kit, 8 shared HP. Burst the 8. Walk a diagonal. Sit on the origin. **Do not spawn until remaining cap ≥ 5.**
- Cadence Trim: remaining ≥ 1 → `−1`. Sit on CD-0 ids. Once-per-battle flags are not CDs.
- Near Hood: next hit from Chebyshev ≤ 1 → 0. Step to 2. DoT does not consume.
- Gait Sip: steal 1 current MP iff they walked. Stand is 0.
- Cast Sill: occupant cannot resolve non-physical. Strike from the cell. Step off. Cast from an adjacent tile.
- Shove Sting: first forced-move landing deals 8. Walk is free. Occupy the dest.
- Must Step: remaining walks this turn must be Chebyshev 1. Take a legal 1-step, or stand.
- Ally Step: ally joins the caster. Occupy the ring. Landing hazards tick.
- Damp Sting: 10, +8 if leftover walk MP ≥ 2. Spend down to 1 leftover tile.
- Pair Pace: caster and adj ally both translate 1. Isolate. Occupy dests. Whole-card fizzle if blocked.
- Verse Tax: recasting their last resolved id costs +1 AP. Show Strike last. Recast a different id.
- Tool Hold: cannot resolve non-physical until they Strike. Take the 2 AP Strike, then nuke.
- Spent Lend: +1 current MP to an ally who **has** walked. Root the carry first, or isolate.
- Pair Stride: **one** next walk Manhattan exactly 2. Take a legal 2-step, or stand (0 walk legal).
- Boot Hold: cannot walk until they Strike. Strike, then peel. Spells stay legal.
- Near Oath: next spell must have range ≤ 1. Frost at 4 fizzles. Strike stays legal.
- Paint Reel: pull 1 toward nearest paint. Wipe the paint. Occupy the toward-tile.
- Nook Bite: 10+8 if exactly one adj block. Fight in the open or a two-wall corner.
- Stride Mark: leave that cell on a walk → 12. Stand, or blink off (clears, 0).
- Foe Plate: next incoming hit 50/50 with adj **enemy**. Isolate the tank. AoE both.
- Lava Skip: next 1-tile walk treats lava as floor. Plug the gap. Pit / void still illegal. Maps stay solvable for the **player**.
- Still Plate: leftover walk MP 0 → +RES. Keep them wanting a last tile.
- Body Sill: primary cannot leave. Cast from the tile. Pets walk. Blink / Swap end it.
- Clash Mend: heal 8 iff target Struck. Don’t Strike the carry. Walk / shove do not pay.
- Cadence Shave: −1 all remaining on an **ally**. Kill the Shaver. Sit on CD-0.
- Gait Tax: next spell +1 AP if they walked. Cast before walking, or Strike.
- Brick Wipe: erase one adjacent barrier. Re-plant after, or fight without the wall.
- Watch Mute: next overwatch snap deals 0 (still consumes). Walk another file.
- Full Purse: 10+8 if leftover AP ≥ 3. Spend down to 2.
- Pet Cut: 10+10 if player-side `isSummon`. Fight without pets. Dummy Post is a legal summon.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- Summons stay at cap 2 until a later engineer raises it. Penta is **illegal** at cap 2.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-BOTH-SPEND` | PAIR | dual-walk heal + walked-ally MP grant | this drop |
| `FSN-STRIDE-DAMP` | PAIR | leftover-MP bank + leftover-MP poke | this drop |
| `FSN-NEAR-MUST` | PAIR | melee-band miss + force 1-step | this drop |
| `FSN-PAINT-NOOK` | PAIR | pull toward paint + exactly-one-block | this drop |
| `FSN-ALLY-SILL` | CELL | ally-to-caster relocate + Strike-only tile | this drop |
| `FSN-BODY-CLASH` | CELL | primary cannot leave + Struck heal | this drop |
| `FSN-LAVA-STILL` | CELL | 1-tile lava skip + leftover-MP-0 +RES | this drop |
| `FSN-BRICK-WATCH` | CELL | erase barrier + mute overwatch | this drop |
| `FSN-BOTH-CHOIR` | BRIGADE | fund two walks, then cash the dual-walk 8 | this drop |
| `FSN-STRIDE-BANK` | BRIGADE | bank leftover MP, poke ≥ 2 leftover, steal the step | this drop |
| `FSN-NEAR-STEP` | BRIGADE | force a 1-step into melee miss, then snipe from 3 | this drop |
| `FSN-SHOVE-PACE` | BRIGADE | paint the landing, march the pair onto it, bash the rest | this drop |
| `FSN-TRIM-TAX` | CADRE | −1 Inferno so they recast into +1 AP, then cash stacks | this drop |
| `FSN-STRIDE-PULPIT` | CADRE | paint the cell, force a legal 2-step off it, or nail feet | this drop |
| `FSN-BOOT-OATH` | CADRE | nail feet until Strike, then forbid long confirms | this drop |
| `FSN-CAST-QUIET` | COURT | tile forbids tools, tile forbids Strike, unit forbids tools until Strike | this drop |

Named packs as variants: `FSN-PAINT-NOOK/FUSE` (Paint Nook full), `FSN-ALLY-SILL/MEND` (Ally Quiet), `FSN-BODY-CLASH/SPAWN` (Body Clash full), `FSN-LAVA-STILL/EMBER` (Lava Still full), `FSN-BRICK-WATCH/GUN` (Brick Watch full), `FSN-SHOVE-PACE/FILE` (Pair File), `FSN-NEAR-STEP/SIP` (Sip Step), `FSN-BOOT-OATH/GOAD` (Foe Goad), `FSN-BOOT-OATH/SHAVE` (Shave Once), `FSN-STRIDE-PULPIT/GAIT` (Gait Pulpit), `FSN-CAST-QUIET/KENNEL` (Full Kennel), `FSN-CAST-QUIET/PENTA` (Penta Plug — skip until cap ≥ 5).

---

## Formations

### FSN-BOTH-SPEND

FORMATION_ID: `FSN-BOTH-SPEND`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-BOTH-MEND` — `queen` **with** heal / proposed `both_mender` — pack median — back
- `ROLE-SPENT-LEND` — `bishop` **without** heal / proposed `spent_lender` — pack median — mid

VARIANT_RULES:

- Band 0: **do not spawn this id** (Both Mend is a heal kit; kit band 0 has no heal). Show `FSN-GAIT-PACE` instead (caster-walked heal without the dual gate).
- Mender kit: Both Mend + Shield. **No** Inferno, no Enrage, no Clash / Shove / Chase / Gait Mend (PAIR bans).
- Lender kit: Spent Lend + Frost. **No** Spare Pace / Boot Lend / Tempo on PAIR (those are `FSN-BOTH-CHOIR` / `FSN-BOOT-CHASE`).
- Elite: Lender only. Mender never gets Lifesteal Nova (healAmount + AoE is a lock adjacent).
- Unlock after `FSN-GAIT-PACE` **or** `FSN-BOOT-CHASE` (player has seen a walk-gated heal **or** a walked-ally MP grant; this sheet combines them as **two bodies already stepped**).
- Random 30% family lottery is **off**.
- Walk-spend writer required. Force-move does **not** arm Both Mend.

SPELL_POOL_INTERACTIONS:

- Both Mend (8 HP) pays only if **both** already spent walk MP this turn. One still body is 0 HP — Shield queen.
- Spent Lend is +1 current MP to the Mender **after** she walked, so the second tile is funded. It is not ungated Spare Pace.
- No drain / nova (healAmount → healer inference; the Lender would stop lending).

TACTICAL_PLAN:

- Turn 1: Lender holds until the Mender has walked; if the Mender is still, Lender Frosts.
- Mender walks 1, then Both-Mends only if the carry also walked **and** missing HP ≥ 8; else Shields.
- If the Mender is healthy, the Lender **holds** (no invented nuke).

SYNERGY:

- Dual-walk healer + walked-ally buffer. Wave 9 Gait / Chase Mend standing on Wave 11 Both. Combination, not a new sprite. Standing still is a complete answer.

PLAYER_THREAT:

- Slow refill if you let both bodies step. Spike is low. Misplay is Rooting neither and dumping AP into a 8 that just landed.

COUNTERPLAY:

- Keep one body still (Root the queen **or** don’t walk the carry). Cursed Wound halves the 8. Kill the Mender (glass RES). The Lender without a walker is Frost.

MAP_REQUIREMENTS:

- `openField` or `arena`. Mender needs a tile at range 3 from the Lender that is **not** the player’s only exit.
- Reject a 1-tile tunnel (forced walk + dual-heal reads as a lock).

AI_REQUIREMENTS:

- Mender: healer; skip if either flag is 0.
- Lender: ally-first (`AI-ROL-05`). Until apply actually buffs `targetId`, this sheet must not ship.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-BOTH-SPEND/E-LEND` — elite Lender, still no Spare Pace on PAIR.
- `FSN-BOTH-CHOIR` is the BRIGADE with Spare Pace — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-STRIDE-DAMP

FORMATION_ID: `FSN-STRIDE-DAMP`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-STRIDE-KEEP` — `bishop` **without** heal / proposed `stride_keeper` — pack median — back
- `ROLE-DAMP` — `knight` **without** heal / proposed `damp_stinger` — pack median or −1 — starts wide

VARIANT_RULES:

- Distinct from `FSN-DRY-TAX` (leftover-**AP** = 0 poke) and `FSN-DRY-KEEP` (AP bank). Pressure is leftover **walk MP** they chose not to spend.
- Band 0: Keeper Frost only; Damp is ordinary Strike (Damp Sting is band 1). If kit band is still 0, **do not spawn this id** — show `FSN-IRON-TIDE`.
- Elite: Damp only. Keeper never gets Purse Keep (PAIR ban).
- Unlock after `FSN-DRY-TAX` **or** `FSN-WICK-HOOD` (player has seen leftover-as-resource **or** a walk tax).
- Gait Sip stays off PAIR (that is `FSN-STRIDE-BANK`). Spare Pace stays off (PAIR ban vs Keep).
- Leftover-MP bank writer required. Death before next start expires the bank.

SPELL_POOL_INTERACTIONS:

- Stride Keep: once/battle, cap 2 leftover walk MP paid at next own turn start. Not a queue splice.
- Damp Sting: 10, +8 iff leftover walk MP ≥ 2. Spend the last tiles **this** turn; Keep does not empty leftover until next start.
- Frost from Keeper is chip, not a third MP tax past −2.

TACTICAL_PLAN:

- Keeper Holds Keep if leftover ≥ 1 and they still need a kite next turn; else Frosts.
- Damp lurks at 3 and commits when leftover walk MP ≥ 2 **or** HP% ≤ 40.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Leftover-MP bank + leftover-MP poke. Wave 10 Purse Keep’s cousin on the **walk** axis. You see the unspent tiles; the knife waits for them.

PLAYER_THREAT:

- High if you bank 2 tiles and trade the Damp. Low if you spend down to 1. Not unavoidable: walk the last tile, or kill the Damp and eat Frost.

COUNTERPLAY:

- Spend leftover walk. Kill the Damp (`hp` ~0.75). Force the Keeper to leave a hazard this turn (bank refuses). Soul Sip / Gait Sip the banked MP if you brought it.

MAP_REQUIREMENTS:

- `openField` or `arena`. Damp needs a flank path that is not the only exit. Keeper needs a retreat tile.
- No Time Warp (panic + leftover tax).

AI_REQUIREMENTS:

- Keep: buffer; skip leftover 0; heal-less so inference stays caster.
- Damp: flanker + leftover-MP hold.
- Soph 1–2.

VARIANTS:

- `FSN-STRIDE-DAMP/E-DAMP` — elite Damp, still no Gait Sip on PAIR.
- `FSN-STRIDE-BANK` is the BRIGADE with Sip — do not merge.

STATUS: PROPOSED

---

### FSN-NEAR-MUST

FORMATION_ID: `FSN-NEAR-MUST`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-NEAR-HOOD` — `pawn` or `knight` **without** heal / proposed `near_hooder` — pack median + 1 — front
- `ROLE-MUST-STEP` — `knight` **without** heal / proposed `must_stepper` — pack median — mid

VARIANT_RULES:

- Distinct from `FSN-WICK-HOOD` (Far Hood, hits from ≥ 3 → 0) and `FSN-WICK-SPAN` (Must **Span**, Manhattan 2). This is melee-band miss + force a **1-step**.
- Band 0: Hood is a fat Strike body. Stepper is ordinary Strike but **only commits a Must Step if a legal 1-step exists**.
- Band 1: Hood gains Near Hood. Stepper gains Must Step.
- Elite: Hood only. Stepper stays junior so two elites cannot pin the 1-step into a closet.
- Unlock after `FSN-WICK-HOOD` **or** `FSN-HOLD-RANGE` (player has seen a range-gated miss **or** a walk lock).
- Far Hood / Must Span / Pair Stride stay off PAIR (PAIR bans).
- If the map has no legal Chebyshev-1 step from typical stand, **reroll this id**.

SPELL_POOL_INTERACTIONS:

- Near Hood: next damaging `dealDamage` from Chebyshev ≤ 1 misses, then consume. Hits from 2 land. DoT / lava do not consume.
- Must Step: remaining walks this turn must be Chebyshev exactly 1. Stand (0 walk) is legal. Relocate any length is legal.
- Iron Skin on Hood is RES, not a second miss shield.

TACTICAL_PLAN:

- Hood stands in a **wide** lane and Hoods if a hostile can Strike this turn.
- Stepper Must-Steps only when a 1-step toward the Hood exists **and** a walk-off at 2 remains after that step.
- Never turn-1 Must Step into a dead-end.

SYNERGY:

- Anti-melee + movement controller. Wave 10 Far Hood standing on Wave 11 Near. Closing answers one verb and pays the other — unless you stop at 2.

PLAYER_THREAT:

- Readable geometry. Misplay is dumping Strike into an adjacent Hood after Must Step ate the 2-step peel. Recoverable: step to 2, Poison, wait 2 turns.

COUNTERPLAY:

- Stand at Chebyshev 2. Cast from 2. DoT the Hood. Kill the Stepper (it is not a 2.5× HP golem). Swap / blink (relocate ignores Must Step).

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard` with **wide** files. Reject `corridorMaze` (1-step in a hallway is a lock **or** useless).
- No lava on the only 1-step.

AI_REQUIREMENTS:

- Hood: guardian; skip if no adjacent threat.
- Stepper: controller; skip if no legal 1-step **or** that step is the only exit.
- Soph 1–2.

VARIANTS:

- `FSN-NEAR-MUST/PAWN` — Hood chassis `pawn`.
- `FSN-NEAR-STEP` is the BRIGADE with Glass Sniper — do not merge.

STATUS: PROPOSED

---

### FSN-PAINT-NOOK

FORMATION_ID: `FSN-PAINT-NOOK`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-PAINT-REEL` — `queen` **without** heal / proposed `paint_reeler` — pack median — back
- `ROLE-NOOK` — `bishop` **without** heal / proposed `nook_biter` — pack median — camps a **one-block alcove**

VARIANT_RULES:

- Distinct from `FSN-FOE-FANG` (pull toward a **body**) and `FSN-FIELD-WIPE` (0-block poke). This is pull toward **paint** then cash exactly-one-block.
- Band 0: **do not spawn this id** (Paint Reel needs living paint; Nook Bite is not on default kits). Show `FSN-FOE-FANG` or `FSN-FIELD-WIPE` instead.
- Reeler kit: Frost + Paint Reel. **No** Foe / Ally / File Reel (PAIR bans). **No** Fuse on PAIR (`FSN-PAINT-NOOK/FUSE`).
- Nook kit: Frost + Nook Bite. **No** Field / Wall / Lone Bite.
- Elite: Nook only. Reeler stays junior so two displacement elites cannot pin.
- Unlock after `FSN-FOE-FANG` **or** `FSN-FIELD-WIPE` (player has seen a reel **or** a geometry poke).
- Reroll if no living paint at spawn **and** the Reeler cannot plant Mark / a public glyph this turn (identity is pull-toward-paint, not “Frost forever”).
- Paint Reel dest: free floor, not lava / pit / void / portal, player keeps ≥ 1 escape tile. Adjacent to the Reeler is **not** auto-safe (the hole is the paint, not the caster).

SPELL_POOL_INTERACTIONS:

- Paint Reel: pull 1 toward nearest paint. Fourth `applyAttract` dest. Wipe paint is the counter.
- Nook Bite: 10, +8 iff exactly one adjacent blocking tile. Open floor or two-wall corner is 10 only.
- Frost after a reel is a tax, not a root.

TACTICAL_PLAN:

- Reeler Reels only when Chebyshev ≥ 2, paint exists, landing is **not** safer for the player, and a walk-off remains.
- Nook holds the alcove and Bites after the player lands **in** the one-block pocket, never on open floor.
- Never turn-1 double onto one tile.

SYNERGY:

- Displacement + geometry assassin. Wave 10 Foe Reel’s cousin on **paint**. The board slams you toward a nook; you can still step off.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got reeled into the alcove, then ate 18.” Recoverable: wipe paint, hug a second wall, keep a tile behind you.

COUNTERPLAY:

- Echo Wipe / wait paint expiry. Occupy the toward-tile. Fight in the open (Nook is 10). Diagonal-only stance. Kill the glass Nook.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with **one alcove (exactly one adj block)** plus open floor the other way. Reject `corridorMaze` (reel + nook in a hallway is a lock).
- No Void Rift tile as a legal landing. No lava dest.

AI_REQUIREMENTS:

- Reeler: caster + paint-attract legality (landing walkable, not hazard, player retains ≥ 1 escape, skip if no paint).
- Nook: artillery; skip Bite unless exactly one adj block on the **target’s** tile.
- Soph 2–3.

VARIANTS:

- `FSN-PAINT-NOOK/FUSE` — CELL/BRIGADE: add `ROLE-FUSE` (`fuse_binder`). Pull onto the wick alcove, cash exactly-one-block. Still no lava dest. Unlock after this PAIR **and** `FSN-HOOK-FUSE`. Fuse deals 0 on cast. Step off before the tick.
- `FSN-PAINT-NOOK/E-NOOK` — elite Nook, still no Field Bite.

STATUS: PROPOSED

---

### FSN-ALLY-SILL

FORMATION_ID: `FSN-ALLY-SILL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-ALLY-STEP` — `queen` **without** heal / proposed `ally_stepper` — pack median — mid
- `ROLE-CAST-SILL` — `rook` **without** heal / proposed `cast_siller` — pack median — paints a **gallery** tile, not the only aisle

VARIANT_RULES:

- Distinct from `FSN-HOME-SILL` (caster **joins** the ally onto a Quiet Sill). This is ally **comes to the caster**, then a **Strike-only** tile (Cast Sill), not a cannot-Strike tile (Quiet).
- CELL: one Ally Step, one Cast Sill. Stepper will not pull if the dest is the player’s last exit. Siller will not paint both approaches.
- Elite: Stepper only. Siller stays junior so two tile-locks cannot seal the pocket.
- Unlock after `FSN-HOME-SILL` **or** `FSN-ALLY-WICK` (player has seen a join-relocate **or** an ally pull).
- Quiet Sill / Home Step / Tool Hold stay off CELL (PAIR bans / COURT). `FSN-ALLY-SILL/MEND` adds Split Mend, not Quiet.
- Ally Step dests are occupancy, not `isSwap`. Whole card fizzles if blocked.

SPELL_POOL_INTERACTIONS:

- Ally Step: ally lands on a free Chebyshev-1 of the **caster**. Occupy the ring. Landing hazards tick. Walk-spend does **not** increment.
- Cast Sill: occupant cannot resolve **non-physical**. Strike from the cell is legal. Step off. Cast Frost from an adjacent tile.
- Do not also attach Quiet Sill (tile that forbids Strike + tile that forbids tools is COURT `FSN-CAST-QUIET`).

TACTICAL_PLAN:

- Siller paints a **flank choke**, never the only tile that reaches the Stepper.
- Stepper pulls the **gun** (highest-range ally) onto a free ring tile **beside** the sill, not onto the sill itself on CELL (that is BRIGADE `FSN-ALLY-SILL/MEND`).
- Never turn-1 surround.

SYNERGY:

- Protector relocate + hazard tile. Teaching pair for Ally Quiet without the split-mend yet. Information (where is the sill?) plus a peel.

PLAYER_THREAT:

- Frustration and a wasted Inferno if you stand on the sill. Not a lock: Strike works on the sill, second approach exists, step off.

COUNTERPLAY:

- Occupy the ring. Strike from the sill. Cast from off-sill. Kill the Siller. Isolate so Ally Step has no legal dest.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (sill + peel on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Stepper: skip if already adj or no free adj; never dest the only player exit.
- Siller: never sill the only backliner approach; never also Quiet.
- Soph 2–3.

VARIANTS:

- `FSN-ALLY-SILL/MEND` — BRIGADE **Ally Quiet**: add `ROLE-SPLIT-MEND` (`split_cantor`). Pull the gun onto the sill, split-mend the clump. Still no Quiet Sill. Unlock after this CELL **and** `FSN-SPLIT-PAD`. Ally Shield apply required.
- `FSN-ALLY-SILL/E-STEP` — elite Stepper, still no Quiet.

STATUS: PROPOSED

---

### FSN-BODY-CLASH

FORMATION_ID: `FSN-BODY-CLASH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-BODY-SILL` — `bishop` **without** heal / proposed `body_siller` — pack median
- `ROLE-CLASH-MEND` — `queen` **with** heal / proposed `clash_mender` — pack median — `starter-heal` only as ADVANCED

VARIANT_RULES:

- Distinct from `FSN-WIRE-ROOT` (walk lock, casts legal) and `FSN-SHOVE-BASH` (force-move heal). Pressure is **primary cannot leave**, then an 8 if you Strike the carry.
- Band 0: **do not spawn this id** (Clash Mend is a heal kit). Show `FSN-WARD-MEND` instead.
- Siller kit: Body Sill + Frost. **No** Kennel / Root / Quiet / Gait Seal (PAIR bans).
- Mender kit: Clash Mend + Shield. **No** Both / Shove / Chase / Gait Mend. **No** Inferno.
- Elite: Siller only. Mender stays junior so two elites cannot 100–0 from a nailed Strike.
- Unlock after `FSN-SHOVE-BASH` **or** `FSN-HOLD-RANGE` (player has seen a gated heal **or** a walk/Strike lock).
- `struckThisTurn` writer required. Walk / shove / DoT must **not** pay Clash Mend.
- Optional bruiser is BRIGADE `FSN-BODY-CLASH/SPAWN`.

SPELL_POOL_INTERACTIONS:

- Body Sill: player body is nailed. Pets walk freely. Blink / Swap end it. Casts from the tile stay legal.
- Clash Mend: heal 8 iff the **target Struck** this turn. Don’t Strike the bruiser / queen. Missing flag → 0.
- Frost after a nail taxes the nuke, does not add a second walk lock.

TACTICAL_PLAN:

- Siller nails when the player can still cast from that tile **or** blink / Swap. It does not nail a full-HP player on turn 1 in a dead-end.
- Mender Clash-Mends the **carry** only if `struckThisTurn` is true and missing HP ≥ 8; else Shields.
- Hostiles start ≥ 4 apart.

SYNERGY:

- Controller + Struck healer. Wave 10 Shove Mend’s cousin on **Strike** instead of force-move. You see the nail; the 8 is earned.

PLAYER_THREAT:

- High if you melee the queen while nailed. Low if you Frost from the tile or Swap off. Not a lock: spells work, pets walk, blink ends it.

COUNTERPLAY:

- Don’t Strike the carry. Cast from the tile. Blink / Swap. Kill the Mender. Cursed Wound. Face the Siller in a doorway **you** choose after the sill expires.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with two approach vectors. The nailed tile must not be the only player exit.
- No Thorned Ground on the only path to the Mender.

AI_REQUIREMENTS:

- Siller: caster; skip if no walk-off **after expiry** or a legal cast/blink from the tile exists.
- Mender: healer; skip if `struckThisTurn` is false.
- Soph 2–3.

VARIANTS:

- `FSN-BODY-CLASH/SPAWN` — BRIGADE: add `ROLE-BRUISER` (`crimson_spawn`). Nail the primary, cash the Struck heal on the bruiser. Still no Inferno on the queen. Unlock after this CELL **and** `FSN-HEX-BLOOD`. Berserk only below 30% HP.
- `FSN-BODY-CLASH/E-SILL` — elite Siller, still no Root.

STATUS: PROPOSED

---

### FSN-LAVA-STILL

FORMATION_ID: `FSN-LAVA-STILL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-LAVA-SKIP` — `knight` **without** heal / proposed `lava_skipper` — pack median
- `ROLE-STILL-PLATE` — `rook` **without** heal / proposed `still_plater` — pack median + 1

VARIANT_RULES:

- Distinct from `FSN-SLIP-PIT` (pit as floor) and `FSN-DRY-TAX` (leftover-**AP** 0 damage). This is **1-tile lava as floor**, then leftover-**MP** 0 → +RES.
- Weight 0 on maps with no lava / ember-wake / cinder. Ember body as the warm flavor is `FSN-LAVA-STILL/EMBER`, not this base (PAIR ban vs skipper+ember as a two-hazard PAIR — the variant is the three-body lesson).
- Elite: Skipper only. Plater stays junior so two elites cannot force a 0-leftover plate on the only bridge.
- Unlock after `FSN-SLIP-PIT` **or** `FSN-EMBER-MEND` (player has seen a skip **or** a burn knight).
- Pit Skip / Empty Plate / Dry Sting stay off (PAIR bans). Maps stay solvable for the **player** — lava skip does **not** ignore pit / void / barriers.
- Skip is next **1-tile** walk only. A 2-step onto lava still ticks.

SPELL_POOL_INTERACTIONS:

- Lava Skip: next 1-tile walk treats lava as floor. Plug the gap. Safe Fall (forced-move) is not this card.
- Still Plate: 0 leftover walk MP → +RES. Spend the last tile, then plate. Keep does **not** empty leftover this turn.
- Iron Skin on the Plater is RES, not a second leftover gate.

TACTICAL_PLAN:

- Skipper takes a 1-tile lava bridge the player does not have to take. It does not camp the only clean aisle.
- Plater walks into a **wide** lane and Plates when leftover MP is 0.
- If the Skipper dies, remaining body is a leftover-MP plate — intended.

SYNERGY:

- Kiter skip + leftover-MP tank. Wave 9 Pit Skip standing on Wave 11 Still. The cinder is optional geography; the plate is the tax for spending every tile.

PLAYER_THREAT:

- Positional. Failure is chasing across lava then dumping Strike into a fresh +RES. Recoverable: take the clean aisle, keep 1 leftover tile.

COUNTERPLAY:

- Don’t chase onto lava. Keep 1 leftover walk. Frost the Skipper’s MP. Walk around the Plater (`mp: 1` golem-poor). DoT chews RES.

MAP_REQUIREMENTS:

- `ruinsIslands` or `asymmetric` with **one** lava/cinder flavor bridge **and** one clean approach. Reject lava-painted engagement with no clean aisle (unavoidable).
- Plater needs a retreat tile that is not the lava bridge.

AI_REQUIREMENTS:

- Skipper: flanker; skip if no lava cell is a **optional** 1-step (never the only player path).
- Plater: guardian; skip if leftover MP ≥ 1.
- Soph 2–3.

VARIANTS:

- `FSN-LAVA-STILL/EMBER` — BRIGADE: add `ROLE-HAZARD` (`ember_knight`). Skip the cinder, then leftover-MP-0 +RES. Still one clean aisle. At most one Inferno cadence. Unlock after this CELL.
- `FSN-LAVA-STILL/E-SKIP` — elite Skipper, still no Pit Skip.

STATUS: PROPOSED

---

### FSN-BRICK-WATCH

FORMATION_ID: `FSN-BRICK-WATCH`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-BRICK-WIPE` — `rook` **without** heal / proposed `brick_wiper` — pack median
- `ROLE-WATCH-MUTE` — `pawn` **without** heal / proposed `watch_muter` — pack median − 1

VARIANT_RULES:

- Distinct from `FSN-FIELD-WIPE` (erase **paint**) and `FSN-WICK-HOOD` (Far Hood). This erases an adjacent **barrier**, then zeros the next **overwatch snap**.
- CELL: Wiper erases one planted wall (player Barrier or a pre-placed brick). Muter mutes the snap they walk into. **Do not mint a new barrier** to erase — if no barrier exists at spawn, Wiper Frosts / Strikes until the player plants one (still a valid soft CELL).
- Elite: Wiper only. Muter stays junior.
- Unlock after `FSN-FIELD-WIPE` **or** when the player’s last fight used Barrier / a file overwatch (relative, not a level gate).
- Echo Wipe / Brick Shift / Far Hood / Last Mute stay off (PAIR bans). Turret is `FSN-BRICK-WATCH/GUN`.
- Watch Mute: the snap still **consumes**. Walk another file. Gap Ward (skip overwatch on a 1-tile walk) is not this card.

SPELL_POOL_INTERACTIONS:

- Brick Wipe: erase one adjacent barrier. Opens a file. Does not edit `mapGen.ts`.
- Watch Mute: next overwatch snap deals 0. Hits that are not overwatch land. Timeout 1 trigger.
- Strike from Wiper is ordinary. Do not give the Muter Inferno.

TACTICAL_PLAN:

- Wiper walks to an existing wall on a **gallery**, erases it only if a second approach already exists (erasing the only cover the player planted is allowed — that is the identity; erasing the only **exit** is banned).
- Muter camps the opened file and mutes if overwatch is armed; else Strikes when reachable.
- Never turn-1 mute + wipe on a full-HP player in a closet.

SYNERGY:

- Hazard-erase + anti-ranged. Wave 9 Echo Wipe’s cousin on **walls**. You opened the file; they muted the snap you walked into.

PLAYER_THREAT:

- Tempo. Failure is Barrier-overwatch on the file they just opened. Recoverable: walk a second file, re-plant after, physical the Muter.

COUNTERPLAY:

- Don’t overwatch the opened file. Walk the other gallery. Kill the Muter (glass pawn). Re-Barrier after Wipe. Player Timestep (enemy cannot have it).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with two files. Reject a single-tile tunnel (wipe + muted snap on the only file is a lock).
- At least one pre-existing wall **or** a legal player Barrier plant that is not the only exit.

AI_REQUIREMENTS:

- Wiper: skip if no adjacent barrier **or** that barrier is the only player exit wall.
- Muter: skip if no overwatch in play this fight (then this is a soft Strike pawn — fine).
- Soph 2–3.

VARIANTS:

- `FSN-BRICK-WATCH/GUN` — BRIGADE **Brick Watch**: add `ROLE-TURRET` (`stone_castellan`). Open the file, mute the snap they walk into. Cap 1 turret, remaining cap ≥ 1. `summonAI === "turret"`. Do not also roll wolf. Unlock after this CELL **and** `FSN-SHARD-BATTERY/LANE` leftover. Still no Brick Shift.
- `FSN-BRICK-WATCH/E-WIPE` — elite Wiper, still no Echo Wipe.

STATUS: PROPOSED

---

### FSN-BOTH-CHOIR

FORMATION_ID: `FSN-BOTH-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-BOTH-MEND` — `queen` **with** heal / proposed `both_mender` — pack median
- `ROLE-SPENT-LEND` — `bishop` **without** heal / proposed `spent_lender` — pack median
- `ROLE-SPARE` — `pawn` or `bishop` / proposed `spare_pacer` — pack median − 1 — ungated +1 MP

VARIANT_RULES:

- Unlock after `FSN-BOTH-SPEND`. Wave 11 “Both Choir.”
- Elite: Mender only. Lender and Spare stay junior so two gift elites cannot fund a lock walk.
- Spare Pace is the **one** rare. Boot Lend / Tempo / leftover dump stay off (PAIR bans vs Spent). Never a two-gift PAIR — this **three-body** is the lesson.
- Both Mend still needs **both** walked. Spare funds a first tile; Spent funds the **second** after they committed one.
- No Inferno on the queen. No Clash / Shove / Chase Mend.

SPELL_POOL_INTERACTIONS:

- Spare Pace: +1 current MP now, no walk gate. Spent Lend: +1 if they already walked. Together they can fund two tiles — then Both Mend cashes 8. Root one body and the 8 is 0.
- Shield on the Mender is RES, not a second heal engine.
- Dual Slow stays off.

TACTICAL_PLAN:

- Spare Pacers the Mender turn 1 if she has not walked. Spent Lends after she has. Mender Both-Mends only if both flags are true.
- If the player never lets both walk, this is a softer `FSN-BOTH-SPEND` plus a Spare pawn — fine.

SYNERGY:

- Fund two walks, then cash the dual-walk 8. Combination of Wave 8 Spare with Wave 11 Both / Spent.

PLAYER_THREAT:

- Long refill if you let the choir step. Spike is low. Interruptible: Root the queen, kill Spare, wait the CD.

COUNTERPLAY:

- Keep one body still. Cursed Wound. Burst the Mender. Isolate so Spent has no legal walked ally.

MAP_REQUIREMENTS:

- `openField` or `arena` with ≥ 8 free floor cells. Reject `corridorMaze`.
- Mender needs two walk-offs that are not the only player exit.

AI_REQUIREMENTS:

- Same Both / Spent legality as `FSN-BOTH-SPEND`.
- Spare: buffer; skip if already at max MP.
- Soph 3–4. `groupTactics` at 4: one focus.
- Ally `targetId` apply required.

VARIANTS:

- `FSN-BOTH-CHOIR/NO-SPARE` — fallback to `FSN-BOTH-SPEND` if Spare apply is not ready.
- `FSN-BOOT-CHASE` remains the unmoved-lend BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-STRIDE-BANK

FORMATION_ID: `FSN-STRIDE-BANK`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-STRIDE-KEEP` — `bishop` **without** heal / proposed `stride_keeper` — pack median
- `ROLE-DAMP` — `knight` **without** heal / proposed `damp_stinger` — pack median
- `ROLE-GAIT-SIP` — `bishop` **without** heal / proposed `gait_sipper` — pack median

VARIANT_RULES:

- Unlock after `FSN-STRIDE-DAMP`. Wave 11 “Stride Bank.”
- Elite: Keeper only. Damp and Sip stay junior.
- Sip is the **one** rare. Tide Shade stays off this id (`FSN-NEAR-STEP/SIP`). Purse Keep stays off (PAIR ban).
- Cap applied unit MP debuff at −2. Sip is the one steal; Keeper Frost refreshes, does not add a third tax.
- Leftover-MP bank + walk-spend writers required.

SPELL_POOL_INTERACTIONS:

- Keep banks leftover walk. Damp pokes leftover ≥ 2. Sip steals 1 current MP iff they **walked**. Stand answers Sip; spend-down answers Damp; kill-before-next-start answers Keep.
- Do not also Slow (that is a third MP story).

TACTICAL_PLAN:

- Keep banks if leftover ≥ 1. Sip Sips after a walk. Damp commits when leftover ≥ 2.
- If the player never banks, this is a softer `FSN-STRIDE-DAMP` plus a Frost bishop — fine.

SYNERGY:

- Bank leftover MP, poke ≥ 2 leftover, steal the step. Three leftover-MP verbs, one axis.

PLAYER_THREAT:

- Tempo and chip. Failure is banking 2, walking, then eating Damp + Sip. Recoverable: spend tiles, stand, kill Damp.

COUNTERPLAY:

- Spend leftover. Stand to deny Sip. Kill Damp. Kill Keeper before next start.

MAP_REQUIREMENTS:

- `openField` or `arena`. Reject `corridorMaze`.
- No Time Warp.

AI_REQUIREMENTS:

- Keep / Damp as `FSN-STRIDE-DAMP`.
- Sip: caster; skip if walk-spend is 0.
- Soph 3–4. Blackboard: `leftoverWalkMp` so Damp and Sip agree.

VARIANTS:

- `FSN-STRIDE-BANK/NO-SIP` — fallback to `FSN-STRIDE-DAMP`.
- `FSN-NEAR-STEP/SIP` remains Sip Step with Must Step + Tide; do not merge.

STATUS: PROPOSED

---

### FSN-NEAR-STEP

FORMATION_ID: `FSN-NEAR-STEP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-NEAR-HOOD` — `pawn` or `knight` / proposed `near_hooder` — pack median + 1
- `ROLE-MUST-STEP` — `knight` / proposed `must_stepper` — pack median
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` or live `wraith_bishop` — pack median — Frost; minRange 3

VARIANT_RULES:

- Unlock after `FSN-NEAR-MUST`. Wave 11 “Near Step.”
- Elite: Hood only. Stepper and Sniper stay junior.
- Sniper Mark stays off this BRIGADE (that is `FSN-BROKEN-GLASS`). Must Span stays off (PAIR ban vs Must Step).
- Far Hood stays off (PAIR ban).
- If the map has no legal 1-step **and** no minRange-3 lane, **reroll**.

SPELL_POOL_INTERACTIONS:

- Must Step forces a 1-step into Near Hood’s miss, then Sniper Frosts from 3. Standing at 2 answers Hood **and** enters Sniper minRange — that is the designed squeeze, not a lock: Frost is chip, Hood expires, Swap yanks the Sniper.
- One Slow source max. Tide is `FSN-NEAR-STEP/SIP`, not this base.

TACTICAL_PLAN:

- Hood holds the doorway. Stepper Must-Steps only if a 1-step exists and a tile at 2 remains. Sniper holds ≥ 3, opposite corner so one Linear does not delete Hood + Sniper.

SYNERGY:

- Force a 1-step into melee miss, then snipe from 3. Wave 2 Glass Ward standing on Wave 11 Near / Must.

PLAYER_THREAT:

- Frustration and a periodic Frost. Not a lock. Cornering the Sniper still wins.

COUNTERPLAY:

- Eat the Hood miss on purpose, then collapse the Sniper (`hpMult` ~0.6). Swap / Attract the bishop. DoT. Wait Hood expiry at 2.

MAP_REQUIREMENTS:

- `fortress` or `openField` with a **main lane plus one side aisle**. Reject a single-tile tunnel.
- No lava on the only approach to the Sniper.

AI_REQUIREMENTS:

- Hood / Stepper as `FSN-NEAR-MUST`.
- Sniper: caster + minRange 3 + refuse dest ≤ 2.
- Soph 3–4.

VARIANTS:

- `FSN-NEAR-STEP/SIP` — BRIGADE **Sip Step**: replace Sniper with `ROLE-GAIT-SIP` + live `tide_shade` **as a third** only if Must Step remains. **Never PAIR Sip with Tide** — this three-body is the lesson: force a 1-step, steal the MP they just spent, shade kites. One Slow **or** one Sip, cap −2. Unlock after `FSN-STRIDE-BANK` **or** `FSN-TIDE-LOCK`.
- `FSN-NEAR-STEP/FROST-ONLY` — Sniper Frost, no Mark (default).
- `FSN-GLASS-WARD` remains the PAIR gun + peel; do not merge.

STATUS: PROPOSED

---

### FSN-SHOVE-PACE

FORMATION_ID: `FSN-SHOVE-PACE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SHOVE-STING` — `pawn` or `rook` / proposed `shove_stinger` — pack median
- `ROLE-PAIR-PACE` — `queen` **without** heal / proposed `pair_pacer` — pack median
- `ROLE-PUSHER` — `pawn` or `knight` / proposed `bash_bruiser` — pack median + 1 — Shoulder Bash

VARIANT_RULES:

- Unlock after `FSN-SHOVE-BASH` **and** `FSN-EXIT-PAIR` (player has seen force-move cash **and** pair translate). Wave 11 “Shove Pace.”
- Elite: Bruiser only. Stinger and Pacer stay junior so two displacement elites cannot pin.
- `forcedMovedThisTurn` required. Walk MP does **not** arm Shove Sting. Pair Pace is occupancy dests, **not** `isSwap`, and **does** set force-move on both bodies.
- Hook / Swap stay off (that is `FSN-HOOK-SLAM` / `FSN-HOOK-FUSE`). Exit Sting / Fuse stay off (PAIR bans).
- Dest still banned from lava / void. Prefer landing **on the sting cell** if a walk-off remains — that is the identity, not a lock.

SPELL_POOL_INTERACTIONS:

- Pair Pace: caster and adj ally both translate 1 onto the sting. Isolate. Occupied dest = whole-card fizzle.
- Shove Sting: first force-move landing deals 8. Walk onto the cell is free.
- Shoulder Bash: 2-step ray after they land. Skip bash into open floor (VETERAN). Dest must leave a walk-off.

TACTICAL_PLAN:

- Stinger paints a landing. Pacer marches the Bruiser onto it only if both dests are free and a walk-off remains. Bruiser Bashes toward a wall **beside** the engagement, never the last exit.
- If the player never enters the cell, this is a softer `FSN-HOOK-SLAM` plus a sting pawn — fine.

SYNERGY:

- Paint the landing, march the pair onto it, bash the rest. Wave 2 bash standing on Wave 11 sting + pair-pace.

PLAYER_THREAT:

- Positional. Fail state is “I stood on a file, got paced onto a sting, then banged into a pillar.” Recoverable: occupy dests, hug the Stinger (walk is free), isolate the pair.

COUNTERPLAY:

- Occupy both dests. Isolate so Pair Pace has no adj ally. Walk onto the sting (0). Kill the glass Pacer. Slow the Bruiser.

MAP_REQUIREMENTS:

- `arena` or `openField` with ≥ 8 free floor cells and at least one pillar. Reject `corridorMaze`.
- Sting cell must not cover **all** walk-offs.

AI_REQUIREMENTS:

- Stinger: skip if no legal force dest with a walk-off.
- Pacer: skip if < 1 adj ally or either dest blocked.
- Bruiser: charger; skip bash into open floor; dest scoring must not use lava.
- Soph 3–4. Blackboard: `plannedLanding`.

VARIANTS:

- `FSN-SHOVE-PACE/FILE` — CADRE **Pair File**: replace Stinger with `ROLE-LANCER` (`rank_lancer`) + `ROLE-GLYPH` (`glyph_sower`). Translate onto the file, then lance / tax. Still one Inferno cadence off. Unlock after this BRIGADE **and** `FSN-FILE-GUARD`. Needs a 4-tile file. Mark must be step-off.
- `FSN-SHOVE-PACE/E-BASH` — elite Bruiser, still no lava dest.
- `FSN-SHOVE-BASH` remains the PAIR force-heal; do not merge.

STATUS: PROPOSED

---

### FSN-TRIM-TAX

FORMATION_ID: `FSN-TRIM-TAX`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-TRIM` — `bishop` **without** heal / proposed `cadence_trimmer` — pack median — `isLeader` optional
- `ROLE-VERSE-TAX` — `bishop` **without** heal / proposed `verse_taxer` — pack median
- `ROLE-IGNITE` — `queen` **without** heal / proposed `ignite_alchemist` — pack median — Poison + Ignite

VARIANT_RULES:

- Unlock after `FSN-STRETCH-MUTE` **or** `FSN-CRACK-VERSE` (player has seen a CD rewrite **and** a recast tax). Wave 11 “Trim Tax.”
- Elite: Trimmer-leader only. Taxer and Ignite stay junior.
- `lastResolvedSpellId` required. Trim 0 stays 0. Ignite only if matching stacks ≥ 2 (VETERAN).
- **Never PAIR Trim with Shave / Stretch / Stall / Crack.** Shave Once is `FSN-BOOT-OATH/SHAVE`.
- Last Mute stays off this id (`FSN-STRIDE-PULPIT/GAIT`). No Inferno on the Trimmer. One Ignite cadence.

SPELL_POOL_INTERACTIONS:

- Trim −1 remaining on Inferno so they recast **now**. Verse Tax makes that recast +1 AP. Ignite cashes stacks in the panic window.
- Confirm live Inferno CD is a remaining ≥ 2 before Trim (else Frost). Sit on CD-0 ids is a complete answer.
- Poison is the only pack DoT apply. Do not also Venom two rats (that is `FSN-PAPER-PLAGUE`).

TACTICAL_PLAN:

- Turn 1: Taxer holds unless a last id already exists. Trimmer Trims only if highest remaining ≥ 2 **and** a recast would hurt. Ignite waits for stacks ≥ 2.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.
- If the player sits on CD-0, this is a Frost choir — intended.

SYNERGY:

- −1 Inferno so they recast into +1 AP, then cash stacks. Wave 10 Stretch Mute’s cousin on **minus** instead of ×2.

PLAYER_THREAT:

- High if you recast Inferno into Tax with stacks up. Still interruptible: recast a cheap other id, sit on 0, kill Ignite.

COUNTERPLAY:

- Recast Frost, not Inferno. Kill Ignite (`hp` ~0.75). Kill Taxer. Cleanse stacks. Cursed Wound is irrelevant (no healer).

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs from wherever Ignite can land.

AI_REQUIREMENTS:

- Trim: skip if highest remaining < 2.
- Verse: skip if no last id or last is already a cheap Frost.
- Ignite: skip at 1 stack.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-TRIM-TAX/NO-LEADER` — teaching CADRE without boost.
- `FSN-TRIM-TAX/NO-IGNITE` — fallback Frost choir if stack consume is not ready.
- `FSN-STRETCH-MUTE` remains the ×2 CADRE; do not merge.

STATUS: PROPOSED

---

### FSN-STRIDE-PULPIT

FORMATION_ID: `FSN-STRIDE-PULPIT`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-STRIDE-MARK` — `pawn` or `bishop` / proposed `stride_marker` — pack median
- `ROLE-PAIR-STRIDE` — `bishop` / proposed `pair_strider` — pack median
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — cannot walk; casts still legal

VARIANT_RULES:

- Unlock after `FSN-WICK-HOOD` **and** `FSN-HOLD-RANGE` (player has seen a walk detonate **and** a walk lock). Wave 11 “Stride Pulpit.”
- Elite: Marker only. Strider and Seal stay junior.
- Distinct from `FSN-WICK-SPAN` (unit Gait Wick + Must **Span**). This paints a **cell**; leave-that-cell detonates; Pair Stride forces **one** next walk Manhattan 2; Seal nails feet so the 2-step may be illegal — **the designed answers are stand (0 walk legal), blink off the cell (clears, 0), or kill Seal**.
- Must Step / Must Span / Gait Wick stay off (PAIR bans). Fuse stays off.
- Never Seal + Root on this sheet.

SPELL_POOL_INTERACTIONS:

- Stride Mark: cell paint; walk-leave that cell deals 12. Blink / Swap clear for 0. Stand is 0.
- Pair Stride: one next walk must be Manhattan exactly 2. Last writer vs Must Span. 0 walk legal.
- Gait Seal: cannot spend walk MP; casts still legal. Together: you may be unable to take the legal 2-step **and** unable to walk off the mark — **that is the CADRE question**. Answers: blink / Swap (relocate ignores Seal walk-spend), wait 1 turn, kill Seal, strike from the cell (casts legal).

TACTICAL_PLAN:

- Marker paints a cell the player can stand on. Strider Pair-Strides only if a legal 2-step exists **or** blink is in the player kit. Seal if they still have walk MP.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- If Seal dies, the 2-step opens; remaining pair is mark + stride — intended.

SYNERGY:

- Paint the cell, force a legal 2-step off it, or nail feet. Wave 10 Wick Span standing on Wave 11 cell-leave + one-walk-2.

PLAYER_THREAT:

- High if you walk off the mark under Seal. Low if you stand or blink. Not a hardlock: spells work, 0-walk is legal, Seal is 1-turn.

COUNTERPLAY:

- Stand. Blink / Swap off (0). Kill Seal (glass). Cast from the cell. Wait expiry.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **and** a diagonal 2-step. Reject maps with no Manhattan-2 from typical stand (reroll).
- Mark cell must not be the only cell that leaves the file.

AI_REQUIREMENTS:

- Marker: skip empty; never mark the only exit.
- Strider: skip if no legal 2-step **and** the player has no relocate.
- Seal: never with Root; casts still legal.
- Soph 4–6. Blackboard: `markedCell`.

VARIANTS:

- `FSN-STRIDE-PULPIT/NO-SEAL` — BRIGADE-shaped: Mark + Pair Stride only (if Seal would clone `FSN-HOLD-RANGE`).
- `FSN-STRIDE-PULPIT/GAIT` — CADRE **Gait Pulpit**: replace Seal with `ROLE-GAIT-TAX` + `ROLE-LAST-MUTE` + `ROLE-ONCE` as a **different** three. Tax the walked spell, then ban the last id. **Never PAIR Verse Tax with Last Mute / Gait Tax** — this three-body is the lesson. Unlock after `FSN-TRIM-TAX` **or** `FSN-STRETCH-MUTE`. `lastResolvedSpellId` required. Once Cantor is the echo lock, not a second mute PAIR.
- `FSN-WICK-SPAN` remains the unit-wick BRIGADE; do not merge.

STATUS: PROPOSED

---

### FSN-BOOT-OATH

FORMATION_ID: `FSN-BOOT-OATH`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BOOT-HOLD` — `rook` **without** heal / proposed `boot_holder` — pack median + 1
- `ROLE-NEAR-OATH` — `bishop` **without** heal / proposed `near_oather` — pack median
- `ROLE-WARDEN` — `rook` / proposed `leash_warden` or live `iron_golem` — pack median + 1 — body-block

VARIANT_RULES:

- Unlock after `FSN-HOLD-RANGE` **and** `FSN-GLASS-WARD` (player has seen a Strike/walk lock **and** a min-range gun). Wave 11 “Boot Oath.”
- Elite: Hold only. Oather and Warden stay junior.
- **Never PAIR Boot Hold with Hold Knight / Hold Caster / Gait Seal / Tool Hold / Root.** This CADRE: cannot **walk** until Strike, then next spell must have range ≤ 1. Strike stays legal (that is the designed unlock). Frost at 4 fizzles. Warden occupies so you cannot ignore the Hold.
- Tool Hold / Cast Sill stay off (COURT `FSN-CAST-QUIET`). Unit Oath stays off (PAIR ban).
- Swap peel on the Warden is the **one** rare (legal dest only).

SPELL_POOL_INTERACTIONS:

- Boot Hold: walk MP refuses until a Strike / `isPhysical` resolves this turn. Spells stay legal — but Near Oath makes those spells range ≤ 1, so Frost at 4 fizzles and Strike is the honest tool.
- Near Oath: next spell range ≤ 1. Dim Optic (cuts range, confirms still legal) is not this card.
- Warden Iron Skin / Shield is RES. Do not also Gait Seal (feet nailed twice).

TACTICAL_PLAN:

- Warden interposes on the Oather axis. Hold Boots if the player still wants to kite. Oather Oaths if a range>1 id is the next legal.
- Never all three on turn 1 against a full-HP player who has not acted — apply **two**.
- If the Hold dies, remaining pair is a min-range bishop + golem — intended (`FSN-GLASS-WARD` leftover).

SYNERGY:

- Nail feet until Strike, then forbid long confirms. Wave 10 Hold Verse’s cousin without sealing **spells** — Strike is always the door.

PLAYER_THREAT:

- Structured tempo. Failure is dumping Inferno at 4 under Oath while Hold forbids the peel. Recoverable: Strike, then 1-range, or kill Oather.

COUNTERPLAY:

- Strike (unlocks walk). Then 1-range / melee. Kill the Oather (glass). Walk around the Warden. Player Barrier. Do not also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Oather needs a retreat tile that is not the Warden’s choke.
- Never a closed ring. Weight 0 on 1-tile closets.

AI_REQUIREMENTS:

- Hold: skip if they already Struck; never also Root / Seal.
- Oather: skip if their next id is already range ≤ 1 or Strike.
- Warden: guardian interpose; `chokepointCamp` only with a gallery.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.

VARIANTS:

- `FSN-BOOT-OATH/NO-WARD` — BRIGADE-shaped: Hold + Oather only.
- `FSN-BOOT-OATH/GOAD` — CADRE **Foe Goad**: replace Oather + Hold with `ROLE-FOE-PLATE` + `ROLE-GOAD` + live `iron_golem`. Taunt into the neighbor so the split is honest. Isolate the tank. Missing-neighbor fail closed. Unlock after `FSN-SHARE-GOAD` **or** `FSN-NULL-WALL`. Never PAIR Foe Plate with Split Plate / Tether / Suture.
- `FSN-BOOT-OATH/SHAVE` — CADRE **Shave Once**: `ROLE-SHAVE` + `ROLE-ONCE` + `ROLE-TEMPO`. −1 ally Inferno, lock recast. **Do not PAIR Shave with Trim.** Unlock after `FSN-CRACK-VERSE` **or** `FSN-ACT-GIFT`. Tempo gifts the Once body, not the player.
- `FSN-HOLD-VERSE` remains the three-lock COURT; do not merge.

STATUS: PROPOSED

---

### FSN-CAST-QUIET

FORMATION_ID: `FSN-CAST-QUIET`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-CAST-SILL` — `rook` **without** heal / proposed `cast_siller` — pack median — `isLeader`
- `ROLE-QUIET-SILL` — `rook` **without** heal / proposed `quiet_siller` — pack median
- `ROLE-TOOL-HOLD` — `knight` **without** heal / proposed `tool_holder` — pack median
- Optional fourth: `ROLE-NEAR-HOOD` junior **or** omit — if present, Hoods the pocket, not a second tile lock

VARIANT_RULES:

- Unlock after `FSN-ALLY-SILL` **and** a leader-boost CADRE (`FSN-BOOT-OATH` or `FSN-HOLD-VERSE`). Wave 11 “Cast Quiet Court.”
- One elite only: the Cast-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Cast Sill with Quiet Sill / Tool Hold / Hold Caster / First Verse.** This COURT is the three-lock lesson: tile forbids **non-physical**, tile forbids **Strike**, unit cannot resolve non-physical until they Strike. Designed answers: Strike from **off** the Quiet tile, cast from **off** the Cast Sill, Strike to clear Tool Hold, step off both tiles, wait 1 turn, kill Quiet (glass).
- InstantKill / betrayal stay off. Root stays off (tile locks + Root is a full lockout). `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Cast walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-CAST-QUIET/LANE` (variant): drop Tool and optional Hood — Cast Sill + Quiet only, **only** if the player has already answered `FSN-ALLY-SILL` **and** `FSN-HOME-SILL` (otherwise it clones those CELLs as a PAIR — banned).

SPELL_POOL_INTERACTIONS:

- Cast Sill: occupant cannot resolve non-physical. Strike from that cell is legal.
- Quiet Sill: occupant cannot resolve `isPhysical`. Cast Frost from that cell is legal.
- Tool Hold: unit cannot resolve non-physical until they Strike. Strike stays legal **off** Quiet.
- Together: standing on **both** tiles is the fail (no Strike on Quiet, no tool on Cast). The pocket must leave a tile that is on **at most one** sill. Optional Near Hood: waste the adjacent Strike that clears Tool Hold — step to 2, then Strike.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Quiet a **gallery** tile. Cast a **different** gallery tile. Tool the player if they still have a nuke. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Optional Hood holds ≥ 1. If Quiet dies, Strike-from-Cast opens; Cast may retreat (`escapeRoute`) rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Court-scale action lock without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: stand on neither sill, Strike off Quiet, tool off Cast, wait.

PLAYER_THREAT:

- Highest structured tempo threat in this drop. Still turn-based. Failure is dumping Inferno on Cast Sill while Quiet forbids the panic Strike and Tool Hold is up. Recoverable next turn.

COUNTERPLAY:

- Don’t stand on both sills. Strike from off Quiet (clears Tool). Cast from off Cast. Kill Quiet. Step off. Player Timestep is the designed panic.
- Do **not** also Root yourself.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is on **at most one** sill **and** ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Cast: never sill the only aisle; never the same tile as Quiet.
- Quiet: never the same tile as Cast; step-off remains.
- Tool: skip if they already Struck or have only Strike left.
- Optional Hood: skip if already ≥ 2.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Cast-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-CAST-QUIET/LANE` — BRIGADE-shaped: Cast + Quiet only (ship if Tool gate is not ready). Still two different tiles. Still no Root.
- `FSN-CAST-QUIET/NO-HOOD` — COURT of three.
- `FSN-CAST-QUIET/KENNEL` — COURT **Full Kennel**: replace Quiet + Tool + Hood with `ROLE-FULL-PURSE` + `ROLE-PET-CUT` + `ROLE-KENNEL`. Poke leftover AP ≥ 3, then delete the pet that cannot leave. Weight ×2 if the player has a living summon. Dummy Post is a legal summon. Never PAIR Full Purse with Dry / Keep. Never PAIR Pet Cut with Null / Kennel as a two-body. Unlock after `FSN-DULL-PET` **or** `FSN-DRY-TAX`.
- `FSN-CAST-QUIET/PENTA` — COURT **Penta Plug**: replace this id’s members with `ROLE-PENTA` + `ROLE-CAST-SILL` + `ROLE-SHOVE-STING`. Plus seal, Strike-only ring, tax the shove-around. **Skip until remaining cap ≥ 5** (live cap 2). Burst the 8 HP. Walk a diagonal. Sit on the origin. `summonAI === "pentaspan"` required. Do not also roll a second post. `forcedMovedThisTurn` required for the sting. Weight 0 on cramped 1-tile closets (needs a free plus).
- `FSN-HOME-SILL` / `FSN-ALLY-SILL` remain the teaching CELLs; do not merge ids.
- `FSN-HOLD-VERSE` remains the walk/Strike/spell COURT; this id is the **tile** COURT.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–11 still stand. This drop **meshes**; it does not replace.

```
PAIR:    BOTH-SPEND         STRIDE-DAMP         NEAR-MUST         PAINT-NOOK
              \                 |                   |                  /
CELL:     ALLY-SILL        BODY-CLASH         LAVA-STILL       BRICK-WATCH
              \                 |                   |                  /
BRIGADE:  BOTH-CHOIR       STRIDE-BANK         NEAR-STEP        SHOVE-PACE
              \                 |                   |                  /
CADRE:    TRIM-TAX       STRIDE-PULPIT        BOOT-OATH
              \                 |                  /
COURT:                    CAST-QUIET     CAST-QUIET/KENNEL     CAST-QUIET/PENTA
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-BOTH-SPEND` | `FSN-GAIT-PACE` **or** `FSN-BOOT-CHASE` |
| `FSN-STRIDE-DAMP` | `FSN-DRY-TAX` **or** `FSN-WICK-HOOD` |
| `FSN-NEAR-MUST` | `FSN-WICK-HOOD` **or** `FSN-HOLD-RANGE` |
| `FSN-PAINT-NOOK` | `FSN-FOE-FANG` **or** `FSN-FIELD-WIPE` |
| `FSN-ALLY-SILL` | `FSN-HOME-SILL` **or** `FSN-ALLY-WICK` |
| `FSN-BODY-CLASH` | `FSN-SHOVE-BASH` **or** `FSN-HOLD-RANGE` |
| `FSN-LAVA-STILL` | `FSN-SLIP-PIT` **or** `FSN-EMBER-MEND` |
| `FSN-BRICK-WATCH` | `FSN-FIELD-WIPE` **or** seen Barrier / overwatch |
| `FSN-BOTH-CHOIR` | `FSN-BOTH-SPEND` |
| `FSN-STRIDE-BANK` | `FSN-STRIDE-DAMP` |
| `FSN-NEAR-STEP` | `FSN-NEAR-MUST` |
| `FSN-SHOVE-PACE` | `FSN-SHOVE-BASH` + `FSN-EXIT-PAIR` |
| `FSN-TRIM-TAX` | `FSN-STRETCH-MUTE` **or** `FSN-CRACK-VERSE` |
| `FSN-STRIDE-PULPIT` | `FSN-WICK-HOOD` + `FSN-HOLD-RANGE` |
| `FSN-BOOT-OATH` | `FSN-HOLD-RANGE` + `FSN-GLASS-WARD` |
| `FSN-CAST-QUIET` | `FSN-ALLY-SILL` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 12 packs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-09-28.md`](../automation/SPELL_PROPOSALS_2026-09-28.md) (open as PR #726) stamps **new** verbs with **no family sheets** (`spell-heave-mend` … `spell-court-dual`, including Sept Span). SDE Wave 10 unique CORE still has no CORE owner. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations after Wave 12 elite-evolution families exist.

Do **not** pack `cadence_trimmer` with `cadence_shaver` as a teaching pair (Wave 11 rule). `FSN-TRIM-TAX` stays the hostile −1 lesson; `FSN-BOOT-OATH/SHAVE` stays the ally −1 CADRE.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–11, plus Wave 11 verbs in this order (from elite-evolution §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-NEAR-MUST` band 0 can ship among the first** once family HP survives battle start. `FSN-BOTH-SPEND` needs band 1 heal **and** `walkMpSpentThisTurn`.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Both Mend / Clash Mend must live only on healer profiles.**
4. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`forcedMovedThisTurn`**, **`lastResolvedSpellId`**, **`struckThisTurn`**, leftover-**MP** snapshot paid at next own turn start.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Ally Step / Pair Pace occupancy dests (not `isSwap`). Paint Reel = fourth attract dest flavor.
6. `inferSummonArchetype` gains `pentaspan` (and still needs `quadspan` / `dummypost` / `triplespan` from Waves 8–10). Raise or gate `ENEMY_SUMMON_CAP` before Penta Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Spent Lend / Spare Pace / Split Mend). **`FSN-BOTH-SPEND`, `FSN-BOTH-CHOIR`, and `FSN-ALLY-SILL/MEND` must not ship before that apply exists** for the ally tools they name. `FSN-BODY-CLASH` is Strike-gated heal and waits on `struckThisTurn`, not on ally `targetId`.
8. Cast Sill / Quiet Sill `isPhysical` gates (opposite). Tool Hold / Boot Hold / Near Oath as refuse-until. Stride Mark leave hook. Still Plate leftover-MP-0. Gait Sip current-MP rewrite.
9. Summoner cooldown fall-through (penta skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT penta sheets assume the lottery does not add a second engine.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-BOTH-SPEND`, `FSN-BOTH-CHOIR` | `walkMpSpentThisTurn` on **both** bodies; ally `targetId` for Spent / Spare |
| `FSN-STRIDE-DAMP`, `FSN-STRIDE-BANK` | leftover-MP snapshot + next-turn-start pay; Damp leftover ≥ 2; Sip walk gate |
| `FSN-NEAR-MUST`, `FSN-NEAR-STEP` | Near Hood range consume; Must Step Chebyshev-1; legal 1-step exists |
| `FSN-PAINT-NOOK` | fourth `applyAttract` dest (paint); Nook exactly-one-block scan |
| `FSN-ALLY-SILL` | Ally Step relocate (not `isSwap`); Cast Sill non-physical gate; two different tiles |
| `FSN-BODY-CLASH` | `struckThisTurn` on the striker; Body Sill primary-only; pets walk |
| `FSN-LAVA-STILL` | 1-tile lava skip; Still leftover-MP-0; one clean aisle |
| `FSN-BRICK-WATCH` | erase existing barrier only; Watch Mute consumes the snap |
| `FSN-SHOVE-PACE` | `forcedMovedThisTurn`; Pair Pace occupancy dests; sting walk-is-free |
| `FSN-TRIM-TAX` | `lastResolvedSpellId`; Trim 0-stays-0; Ignite stack gate ≥ 2 |
| `FSN-STRIDE-PULPIT` | cell-leave hook; Pair Stride one Manhattan-2; Seal leaves casts legal; no Root |
| `FSN-BOOT-OATH` | Boot Hold until Strike; Near Oath range ≤ 1; Strike remains legal |
| `FSN-CAST-QUIET` | Cast + Quiet on **two different tiles**; Tool until Strike; walk-off on at most one sill; never Root |
| `FSN-CAST-QUIET/PENTA` | `summonAI === "pentaspan"` **and** remaining cap ≥ 5 (live cap 2 → skip) |

---

## Sources (line-accurate, 2026-09-29)

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
- Wave 11 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-28.md` (PR #752) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-09-27.md` (PR #695); SDE Wave 9 unique CORE in PR #646
- Drop 11: `docs/design/ENEMY_FORMATIONS_2026-09-28.md` (PR #727)

# Enemy synergy and formation catalog (drop 11)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-28  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–10 already taught the seven pairing words and Waves 1–9 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 10 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-27.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-27.md) (open as PR #686) and deferred by drop 10 (PR #669): Shove Choir, Stretch Mute, Quad Plug, Wick Span, Dry Keep, Home Quiet, Boot Chase, Exit Slide, Tick Empty, Odd Rebate, Hold Verse, Unit Pit, Foe Wound, Wipe Field, Split Kennel, Crown Bar, Stall Stretch.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612), [`ENEMY_FORMATIONS_2026-09-27.md`](./ENEMY_FORMATIONS_2026-09-27.md) (drop 10 — open as PR #669). Family sheets: PR #686. Spell verbs: Wave 9 tactical ids in PR #636 (`spell-shove-mend` … `spell-pair-slide`) plus SDE Wave 8 unique CORE (`spell-odd-stride` … `spell-full-bar`).

**Hard rules (Wave 10 pack law — plus every older law still stands):**

- Do **not** pack `shove_mender` with `gait_mender` / `chase_mender` / `pale_cantor` / `enter_mender` as a PAIR (force-move heal vs caster-walked vs target-walked vs unconditional vs enter-heal). `FSN-GAIT-PACE` / `FSN-WARD-MEND` / `FSN-SPLIT-PAD` stay theirs.
- Do **not** pack `cadence_stretcher` with `cadence_staller` / `cadence_cracker` / `cadence_flusher` / `cadence_thief` / `cadence_lender` as a PAIR (×2 remaining vs +1 vs highest-one → 0 vs ally all → 0 vs steal vs −1). `FSN-FLUSH-DUMP` / `FSN-CRACK-VERSE` stay theirs.
- Do **not** pack `quad_prelate` with `dummy_prelate` / `bait_prelate` / `pylon_prelate` / `span_prelate` / `twin_span` / `triple_span` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Quad counts as **4**. Skip until remaining `ENEMY_SUMMON_CAP` ≥ 4. Live cap is **2** — skip `FSN-HOLD-VERSE/QUAD`. `FSN-MORROW-POST` / `FSN-TWIN-PLUG` / `FSN-TRIPLE-PLUG` stay theirs.
- Do **not** pack `gait_wicker` with `boot_stinger` / `post_stinger` / `wound_marker` / `cast_marker` / `fuse_binder` as a PAIR (walk-MP detonate vs already-walked vs hit-detonate vs cast-detonate vs tile fuse). `FSN-BOOT-STEP` / `FSN-CAMP-TITHE` / `FSN-BODY-CAST` stay theirs.
- Do **not** pack `dry_stinger` with `empty_plater` / `lone_stinger` / `post_stinger` as a PAIR (leftover-0 **damage** vs leftover-0 **+RES** vs isolation vs unmoved). `FSN-LONE-NAIL` stays theirs.
- Do **not** pack `home_stepper` with `hinge_squire` / `hook_chaplain` / `ally_reeler` / `morrow_walker` / `cover_squire` as a PAIR (join-ally relocate vs 90° vs rescue pull vs pull-to-ally vs delayed blink vs cover). `FSN-HINGE-GLANCE` / `FSN-ALLY-WICK` stay theirs.
- Do **not** pack `must_spanner` with `even_warder` / `odd_warder` / `diag_locksmith` / `axis_locksmith` / `walk_toller` as a PAIR (exactly-2 vs even vs odd vs diagonal vs cardinal file vs +1 MP). `FSN-HOLD-RANGE` / `FSN-DIAG-BRICK` stay theirs.
- Do **not** pack `far_hooder` with `sidestep_warder` / `thin_warder` / `hood_lurker` as a PAIR (hits from ≥ 3 → 0 vs any-range skip vs hit-cap vs Fog Hood). `FSN-HOOD-CHOIR` stays theirs.
- Do **not** pack `boot_lender` with `spare_pacer` / `gift_siller` / `tempo_precentor` as a PAIR (unmoved +1 MP vs ungated +1 vs enter +MP vs next-turn AP). BRIGADE `FSN-BOOT-CHASE` is the three-body lesson, never a two-gift PAIR. `FSN-BOOT-STEP` / `FSN-ACT-GIFT` stay theirs.
- Do **not** pack `quiet_siller` with `hold_knight` / `first_verser` / `dull_censor` / `pet_siller` / `kennel_siller` as a PAIR (tile cannot Strike vs unit until-walk vs until-spell vs Strike 0 vs summon-enter vs summon-leave). `FSN-HOLD-RANGE` / `FSN-DULL-PET` stay theirs.
- Do **not** pack `exit_stinger` with `enter_mender` / `boon_mason` / `glyph_sower` as a PAIR (leave damage vs enter heal vs leave MP vs enter AP). `FSN-SPLIT-PAD` / `FSN-BOON-BOOT` stay theirs.
- Do **not** pack `purse_keeper` with `leftover_lender` / `purse_locker` / `purse_scribe` / `purse_splitter` as a PAIR (bank-to-next-turn vs dump-to-ally vs freeze vs spend-theirs vs grant). `FSN-FLUSH-DUMP` / `FSN-PURSE-MUTE` stay theirs.
- Do **not** pack `tick_plater` with `thin_warder` / `plate_warden` / `ash_absolver` / `morrow_warden` as a PAIR (next DoT tick 0 vs hit-cap vs absorb vs strip vs delayed plate). `FSN-PLATE-LINK` / `FSN-MORROW-POST` stay theirs.
- Do **not** pack `last_muter` with `gait_muter` / `once_cantor` / `hold_caster` as a PAIR (last-id ban vs next-any vs echo vs spell-until-walk). `FSN-GAIT-SNARE` / `FSN-CRACK-VERSE` stay theirs. COURT `FSN-HOLD-VERSE` is the three-lock lesson, never a two-mute PAIR.
- Do **not** pack `pair_slider` with `pair_porter` / `pawn_broker` / `slide_mason` / `hinge_squire` as a PAIR (translate vs 90° hinge vs swap vs conveyor vs 90° around ally). `FSN-PAIR-PEEL` stays theirs.
- Do **not** pack `odd_warder` with `even_warder` / `diag_locksmith` / `misstep_herald` / `must_spanner` as a PAIR (four other walk-shape locks). Last writer vs Even. `FSN-DIAG-BRICK` stays theirs.
- Do **not** pack `hold_caster` with `hold_knight` / `gait_sealer` / `snare_weaver` as a PAIR (spells illegal until walk vs Strike illegal until walk vs cannot walk vs Root). COURT `FSN-HOLD-VERSE` is the three-body lesson. `FSN-WIRE-ROOT` / `FSN-HOLD-RANGE` stay theirs.
- Do **not** pack `unit_oather` with `ground_oather` / `pit_mason` / `origin_mason` as a PAIR (unit-only vs ground-only vs extras). COURT `FSN-FOE-FANG/PIT` is Unit Pit, never a two-oath PAIR.
- Do **not** pack `rebate_warder` with `walk_toller` / `tide_shade` / `spare_pacer` as a PAIR (−1 next walk vs +1 vs melee slow vs ungated +1). BRIGADE `FSN-WICK-SPAN/ODD` is Odd Rebate, never a two-MP-tax PAIR. `FSN-IRON-TIDE` stays theirs.
- Do **not** pack `foe_reeler` with `ally_reeler` / `file_reeler` / `hook_chaplain` / `sink_chanter` as a PAIR (toward **other hostile** vs toward ally vs file-to-caster vs rescue vs tile). `FSN-ALLY-WICK` / `FSN-BRAND-REEL` stay theirs.
- Do **not** pack `echo_wiper` with `echo_painter` / `ember_knight` / `fuse_binder` as a PAIR (erase vs copy vs place vs tile bomb). `FSN-ALLY-WICK` stays theirs.
- Do **not** pack `field_biter` with `wall_biter` / `wall_stinger` / `lone_stinger` as a PAIR (open-floor bonus vs hug-block vs barrier-hug vs isolation). `FSN-WALL-HUG` / `FSN-LONE-NAIL` stay theirs.
- Do **not** pack `wound_marker` with `cast_marker` / `body_marker` / `glyph_sower` as a PAIR (hit-detonate vs cast-detonate vs unit amp vs tile Mark). `FSN-BODY-CAST` stays theirs.
- Do **not** pack `split_plater` with `twin_tether` / `share_warden` / `pain_suture` / `cover_squire` as a PAIR (one-hit 50/50 vs ongoing tether vs outgoing share vs whole redirect vs cover). `FSN-SHARE-GOAD` / `FSN-PLATE-LINK` stay theirs.
- Do **not** pack `first_verser` with `hold_knight` / `oath_censor` / `dull_censor` / `once_cantor` as a PAIR (Strike until a spell vs Strike until walk vs other-id fizzle vs Strike 0 vs echo).
- Do **not** pack `pit_skipper` with `pit_mason` / `wick_painter` / `ghost_stepper` as a PAIR (walk the pit vs place it vs delayed pit vs ghost occupancy). `FSN-SLIP-PIT` stays theirs.
- Do **not** pack `empty_plater` with `dry_stinger` / `plate_warden` / `tempo_precentor` as a PAIR.
- Do **not** pack `kennel_siller` with `pet_siller` / `still_leasher` / `leash_cutter` / `null_censor` as a PAIR (cannot-leave vs cannot-enter vs pause vs cut vs lockout). `FSN-DULL-PET` / `FSN-NULL-WALL` stay theirs.
- Do **not** pack `chase_mender` with `gait_mender` / `shove_mender` / `pale_cantor` / `font_cantor` as a PAIR.
- Do **not** pack `cadence_staller` with `cadence_thief` / `cadence_cracker` as a PAIR (SDE extras live there).
- Do **not** pack `crown_cutter` with `coup_duelist` / `coil_arbiter` as a PAIR (leader poke vs instant ≤25% vs extras). `FSN-BELL-CUT` stays the delayed-clock lesson.
- Do **not** pack `full_barer` with `tempo_precentor` / `bone_scribe` as a PAIR (full-bar −1 AP vs next-turn +1 AP vs lore extras).
- Drop 4–10 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two walk-shape locks).

Wave 10 **SPELL_PROPOSALS** (`SPELL_PROPOSALS_2026-09-27.md`, open as PR #695) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 10 tactical verbs until that family pass exists (Wave 11). Same-day SDE Wave 9 unique CORE stays G≥9 extras.

Court Stretch / Pack Tithe / About Hinge stay **boss / closed-class**. Court Stretch may witness on CHAMPION `cadence_stretcher` only — never as a world-pack CORE.

**Do not spawn Shove Mend sheets until every push / pull / swap / hinge / pair-slide / conveyor writer sets `forcedMovedThisTurn`.** Walk MP must **not** set it. Missing field → Shove Mend pays **0 HP** (fail closed). Until that writer lands, show `FSN-WARD-MEND` / `FSN-HOOK-SLAM` instead of `FSN-SHOVE-BASH` / `FSN-SHOVE-CHOIR`.

**Do not spawn Last Mute sheets until `executeCastAttempt` / enemy resolve writes `lastResolvedSpellId` on successful AP spend.** Missing field → Last Mute fizzles (fail closed). Until that writer lands, show `FSN-GAIT-SNARE` instead of `FSN-STRETCH-MUTE`.

**Do not spawn Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate escorts until a battle-walk writer exists for walk-MP spent this turn.** Missing field → Gait Wick never detonates; Chase Mend pays 0; Boot Lend cannot tell “unmoved”; Cast Hold never clears; Rebate never discounts. Forced-move / Swap / Home Step / Pair Slide **does not** increment walk-spend.

**Do not spawn Quad Plug until `inferSummonArchetype` keys `summonAI === "quadspan"` and remaining `ENEMY_SUMMON_CAP` ≥ 4.** Live cap is 2. Name heuristics stay a bug. Quad fills the stationary-post **and** the multi-cell-system cap (4). Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/triplespan/spark/dummypost onto that body.

**Pair Slide dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after both bodies land. Foe Reel is the **third** `applyAttract` dest flavor (File Reel, then Ally Reel).

---

## Grounding (live, 2026-09-28)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–10. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920; zone object at 4683–4687 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 (`spellType === "heal"` **or** `healAmount > 0`) |
| `decideEnemyAction` | `enemyAI.ts` 1662–1698 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–221 — **no** `quadspan` / `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Pair Slide is occupancy dests, **not** `isSwap`. Foe Reel is the third **cast** caller of attract (File Reel, Ally Reel). |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 10 CORE rows stay `mpCost: 0`. Step Rebate is `rebateNextWalkMp`, not `spell.mpCost`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |
| `forcedMovedThisTurn` / `lastResolvedSpellId` | **Absent** — Shove Mend / Last Mute fail closed |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar / quad bodies **replace** the random overlay. Cap one of those engines. Quad Span **is** the 4-cell post and needs remaining cap ≥ 4.
3. Any `healAmount` steals healer. **Shove Mend / Chase Mend must live only on healer profiles.** Do not put those ids, drain, or nova on Slider, Stretcher, Wicker, Dry, Home, Spanner, Hooder, Lender, Siller, Exit, Keeper, Plater, Muter, Odd, Hold-caster, Oather, Rebate, Reeler, Wiper, Biter, Marker, Verser, Skipper, Empty, Kennel, Staller, Cutter, or Barer.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Boot Lend / Split Mend / Shove Mend / Chase Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 10 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Step Rebate is a next-walk MP discount, not `spell.mpCost`.
6. `inferSummonArchetype` must key `summonAI === "quadspan"` **before** any Quad sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Shift source wall that already exists (Brick **moves** a planted barrier; it does not mint a new one on PAIR). Crown Cut / Cast Hold / Last Mute are **not** `instantKill`.
8. Pair-slide dest / foe-reel dest / home-step landing / quad plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Pair Slide into a wall is a fizzle (no crush). Home Step dest is a free Chebyshev-1 of an **ally** — occupying the ring is the designed answer.
9. Dual Slow / Frost / tide melee / rime / Walk Toll / Step Rebate: cap applied unit MP debuff at **−2**. One Slow **or** one Walk Toll source per pack, not both stacking past that cap. Rebate is a **discount**, not a third tax — do not also Root + Gait Seal + Must Span + Odd Stride + Cast Hold on the same AP bar.
10. Walk-spend: Gait Wick / Boot Lend / Chase Mend / Cast Hold / Step Rebate **fail closed** until `walkMpSpentThisTurn` exists on the turn actor. Pair Slide / Home Step / Foe Reel / Quad plant **does not** increment it.
11. Force-move: Shove Mend **fail closed** until `forcedMovedThisTurn` writers exist. Walk MP must not set it.
12. Last-id: Last Mute **fail closed** until `lastResolvedSpellId` exists.

### Relative difficulty (same grades as drops 1–10)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…10 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a walk-tax / a walk-lock) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (bash / slider / hooder / dry / home / hold-caster / split-plater / empty / cutter / skipper): pack median + one step.
- Backliner (shove-mend / stretcher / muter / wicker / keeper / teller / chase-mend / boot-lend / quiet / exit / tick / odd / rebate / reeler / wiper / marker / verser / oather / kennel / staller / barer / ignite): pack median.
- Glass (dry, wicker, stretcher, muter, teller, keeper, chase, boot, exit, marker, verser, wiper, biter, kennel, barer, ignite, rat): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 11)

Drop 1–10 overlays still apply. These are **additional jobs** for Wave 10 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-SHOVE-MEND` | `queen` **with** heal | proposed `shove_mender` | `spell-shove-mend`, `starter-shield` | healer; skip if `forcedMovedThisTurn` missing or false, or missing HP < 8; walk MP **does not** pay |
| `ROLE-STRETCH` | `bishop` **without** heal | proposed `cadence_stretcher` | `starter-frost`, `spell-cadence-stretch` | controller; skip if highest remaining CD < 2; 0 stays 0; never invent locks |
| `ROLE-QUAD` | `rook` **without** heal | proposed `quad_prelate` | `physical_attack`, `spell-quad-span` | `isSummoner` for quad only; post `summonAI: "quadspan"`, 2×2 occupy, empty kit, remaining cap ≥ 4; skip if any of four cells blocked |
| `ROLE-WICK-GAIT` | `pawn` or `bishop` **without** heal | proposed `gait_wicker` | `physical_attack`, `spell-gait-wick` | controller; skip if target walk MP = 0; stand is 0; relocate does not detonate |
| `ROLE-DRY` | `knight` **without** heal | proposed `dry_stinger` | `physical_attack`, `spell-dry-sting` | flanker; skip if leftover AP ≥ 2 unless 12 kills; Purse Keep does **not** empty the bar this turn |
| `ROLE-HOME` | `queen` **without** heal | proposed `home_stepper` | `physical_attack`, `spell-home-step` | protector / flanker; skip if already adj or no free adj; relocate, **not** `isSwap` |
| `ROLE-MUST-SPAN` | `knight` **without** heal | proposed `must_spanner` | `physical_attack`, `spell-must-span` | controller; remaining walks this turn must be Manhattan exactly 2; 0 walk legal; relocate any length legal |
| `ROLE-FAR-HOOD` | `bishop` **without** heal | proposed `far_hooder` | `starter-frost`, `spell-far-hood` | guardian; skip if nearest hostile already Chebyshev ≤ 2; hits from 1–2 land and do not consume |
| `ROLE-BOOT-LEND` | `bishop` **without** heal | proposed `boot_lender` | `spell-boot-lend`, `starter-frost` | buffer (`AI-ROL-05`); +1 current MP if ally unmoved; skip if already walked or at max MP |
| `ROLE-QUIET-SILL` | `rook` **without** heal | proposed `quiet_siller` | `spell-quiet-sill`, `starter-frost` | setter; occupant cannot resolve `isPhysical`; step off is legal; never name-parse `"Strike"` |
| `ROLE-EXIT` | `pawn` or `rook` **without** heal | proposed `exit_stinger` | `spell-exit-sting`, `physical_attack` | setter; first leave deals 8; enter does not tick; skip empty cells |
| `ROLE-KEEP` | `king` **without** heal | proposed `purse_keeper` | `spell-purse-keep`, `starter-frost` | buffer; bank leftover AP (cap 3) to **next own turn start**, once/battle; not a queue splice |
| `ROLE-TICK` | `rook` **without** heal | proposed `tick_plater` | `physical_attack`, `spell-tick-plate` | guardian; skip if no DoT on self; consume in the tick loop, not `dealDamage` |
| `ROLE-LAST-MUTE` | `bishop` **without** heal | proposed `last_muter` | `starter-frost`, `spell-last-mute` | controller; skip if no last id or last is Strike with Frost still legal |
| `ROLE-SLIDE` | `queen` or `king` **without** heal | proposed `pair_slider` | `starter-frost`, `spell-pair-slide` | caster; skip if < 2 hostiles or either dest blocked (whole card fizzles); not `isSwap` |
| `ROLE-ODD` | `bishop` **without** heal | proposed `odd_warder` | `starter-frost`, `spell-odd-stride` | caster; next walk odd Manhattan; (1,1) diagonal is even and illegal |
| `ROLE-CAST-HOLD` | `rook` or `pawn` **without** heal | proposed `hold_caster` | `physical_attack`, `spell-cast-hold` | controller; non-Strike spells refuse until walk; Strike stays legal; never Root the same body |
| `ROLE-UNIT-OATH` | `bishop` **without** heal | proposed `unit_oather` | `starter-frost`, `spell-unit-oath` | caster; next spell must target a unit; Barrier / Pit fizzle; Strike remains legal |
| `ROLE-REBATE` | `knight` or `bishop` **without** heal | proposed `rebate_warder` | `physical_attack`, `spell-step-rebate` | flanker / kiter; next walk −1 MP (min 0); not `spell.mpCost` |
| `ROLE-FOE-REEL` | `bishop` **without** heal | proposed `foe_reeler` | `starter-frost`, `spell-foe-reel` | caster; pull 1 toward nearest **other hostile**; skip if isolated or dest blocked |
| `ROLE-WIPE` | `bishop` **without** heal | proposed `echo_wiper` | `starter-frost`, `spell-echo-wipe` | setter; erase one adjacent paint; skip if no live paint |
| `ROLE-FIELD` | `knight` or `bishop` **without** heal | proposed `field_biter` | `physical_attack`, `spell-field-bite` | charger; +8 iff 0 adj blocking tiles; skip if they hug a wall |
| `ROLE-WOUND` | `bishop` **without** heal | proposed `wound_marker` | `starter-frost`, `spell-wound-mark` | caster; skip if no follow-up hit this round; DoT / lava do not detonate |
| `ROLE-SPLIT-PLATE` | `rook` **without** heal | proposed `split_plater` | `physical_attack`, `spell-split-plate` | guardian; skip if no Chebyshev-1 ally; missing-ally at hit time → full hit, charge gone |
| `ROLE-VERSE-FIRST` | `bishop` **without** heal | proposed `first_verser` | `starter-frost`, `spell-verse-first` | controller; cannot Strike until a non-Strike spell resolves this turn |
| `ROLE-PIT-SKIP` | `knight` **without** heal | proposed `pit_skipper` | `physical_attack`, `spell-pit-skip` | flanker; next **1-tile** walk treats pit as floor; lava / void / barriers still illegal |
| `ROLE-EMPTY` | `rook` **without** heal | proposed `empty_plater` | `physical_attack`, `spell-empty-plate` | guardian; leftover AP 0 → +RES; skip if leftover ≥ 1 |
| `ROLE-KENNEL` | `bishop` **without** heal | proposed `kennel_siller` | `starter-frost`, `spell-kennel-sill` | caster; hostile summons cannot **leave** the cell; player body walks freely |
| `ROLE-CHASE-MEND` | `queen` **with** heal | proposed `chase_mender` | `spell-chase-mend`, `starter-shield` | healer; skip if target `walkMpSpentThisTurn` < 1 or missing HP < 8; shove does not pay |
| `ROLE-STALL` | `bishop` **without** heal | proposed `cadence_staller` | `starter-frost`, `spell-cadence-stall` | controller; +1 all remaining ≥ 1, once/battle; 0 stays 0 |
| `ROLE-CROWN` | `king` or `knight` **without** heal | proposed `crown_cutter` | `physical_attack`, `spell-crown-cut` | flanker; skip if target is not `isLeader`; never name-parse `"king"` |
| `ROLE-FULL-BAR` | `bishop` **without** heal | proposed `full_barer` | `starter-frost`, `spell-full-bar` | buffer / caster; skip if enemy kit < 4; next spell −1 AP (min 1) |

Drop-2…10 `ROLE-PUSHER` / `ROLE-IGNITE` / `ROLE-TELLER` (`act_teller`) / `ROLE-SPARE` / `ROLE-FUSE` / `ROLE-SEAL` / `ROLE-FANG` (`split_fanger`) / `ROLE-BRICK` / `ROLE-SPLIT-MEND` / `ROLE-RAT` / `ROLE-ARBITER` / `ROLE-ORIGIN` (`origin_mason`) / `ROLE-ONCE` are reused below. Do not also roll the random 12% summoner overlay onto Shove-mend, Stretch, Wicker, Dry, Home, Spanner, Hooder, Lender, Quiet, Exit, Keeper, Tick, Muter, Slider, Odd, Hold-caster, Oather, Rebate, Reeler, Wipe, Field, Wound, Split-plate, Verser, Skipper, Empty, Kennel, Chase, Stall, Crown, or Barer. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** triple-span **or** spark **or** dummy **or** quad — never two). Quad occupies the stationary-post **and** the multi-cell cap (4).

### Fair-fight rules (every sheet)

Same as drops 1–10, plus Wave 10:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, quiet-sill that is the only aisle, pair-slide dest that is the only aisle, quad 2×2 that seals every gallery, or a kennel cell that traps the only pet on the only aisle.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Shove Mend: heal 8 iff target was force-moved this turn. Missing flag → 0. Stand still; it is a Shield queen.
- Cadence Stretch: remaining ≥ 1 → `×2` (cap 8). Sit on CD-0 ids. Once-per-battle flags are not CDs.
- Quad Span: 2×2 occupy, counts as 4, empty kit, 8 shared HP. Burst the 8. Walk around. Sit on the NW cell. **Do not spawn until remaining cap ≥ 4.**
- Gait Wick: next walk MP deals 10. Stand is 0. Blink / Swap / Home Step do not detonate.
- Dry Sting: 12, +8 if leftover AP = 0. End turn with 1 leftover.
- Home Step: caster joins an ally. Occupy the ring. Landing hazards tick.
- Must Span: remaining walks this turn must be Manhattan 2. Take a legal 2-step, or stand.
- Far Hood: next hit from Chebyshev ≥ 3 → 0. Walk in to 2. DoT does not consume.
- Boot Lend: +1 current MP to an unmoved ally. Force them to walk first, or isolate.
- Quiet Sill: occupant cannot Strike. Step off. Cast a non-physical id from the cell.
- Exit Sting: first leave deals 8. Do not occupy it. Wait 2 turns.
- Purse Keep: banks leftover (cap 3) to next own turn start. Kill them before that start. Not Timestep.
- Tick Plate: next DoT tick is 0. Two DoT types still land the other. Ignite cash-in is fair.
- Last Mute: last resolved id illegal 1 turn. Show Strike last. Never-cast → fizzle.
- Pair Slide: translate two adj hostiles 1. Isolate. Occupy dests. Whole-card fizzle if blocked.
- Odd Stride: next walk odd Manhattan. Step 1. Diagonal (1,1) is even — illegal.
- Cast Hold: spells illegal until they walk. Strike stays legal. Take the 1-step then nuke.
- Unit Oath: next spell must target a unit. Frost / Strike legal. Barrier fizzles.
- Step Rebate: next walk −1 MP. Nail feet. Not a third Slow.
- Foe Reel: pull 1 toward nearest other hostile. Split. Occupy the toward-tile.
- Echo Wipe: erase one adjacent paint. Fight off paint. Re-paint after.
- Field Bite: 10+8 if 0 adj blocking tiles. Hug a pillar.
- Wound Mark: next damaging **hit** detonates 10. Poison instead of Strike. DoT does not consume.
- Split Plate: next incoming hit 50/50 with adj ally. Isolate the tank. AoE both.
- Verse First: cannot Strike until a spell resolves. Cast Frost, then Strike.
- Pit Skip: next 1-tile walk treats pit as floor. Plug the gap. Lava still hurts.
- Empty Plate: leftover 0 → +RES. Keep them wanting a 3-AP tool.
- Kennel Sill: hostile summons cannot leave. Fight without pets. Swap / Sever still work.
- Chase Mend: heal 8 iff **target** walked. Root the carry. Shove does not pay.
- Cadence Stall: +1 all remaining ≥ 1, once/battle. Sit on CD-0. Not Stretch.
- Crown Cut: 12+12 if `isLeader`. Don’t be the leader in melee. Never name-parse `"king"`.
- Full Bar: next spell −1 AP if kit ≥ 4 (player analog ≥ 8 equipped). Unequip to 7. Min cost 1.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- Summons stay at cap 2 until a later engineer raises it. Quad is **illegal** at cap 2.
- Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop)

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-SHOVE-BASH` | PAIR | force-move heal + shoulder bash | this drop |
| `FSN-DRY-TAX` | PAIR | leftover-0 poke + leftover AP tax | this drop |
| `FSN-WICK-HOOD` | PAIR | walk-MP wick + far-range 0 | this drop |
| `FSN-TICK-RAT` | PAIR | eat next DoT tick + apply DoT | this drop |
| `FSN-HOME-SILL` | CELL | join-ally relocate + spell-only tile | this drop |
| `FSN-EXIT-PAIR` | CELL | leave-tax + pair translate | this drop |
| `FSN-FOE-FANG` | CELL | pull-to-other-hostile + cluster poke | this drop |
| `FSN-FIELD-WIPE` | CELL | erase paint + open-floor poke | this drop |
| `FSN-SHOVE-CHOIR` | BRIGADE | bash + slide + cash the 8 | this drop |
| `FSN-WICK-SPAN` | BRIGADE | force a 2-step, detonate the wick, waste shots at 4 | this drop |
| `FSN-DRY-KEEP` | BRIGADE | tax the last 2 AP, bank 3, sting the empty bar | this drop |
| `FSN-BOOT-CHASE` | BRIGADE | fund the walk, then cash the target-walked heal | this drop |
| `FSN-STRETCH-MUTE` | CADRE | ×2 Inferno, ban the last id, cash stacks | this drop |
| `FSN-HOME-QUIET` | CADRE | step onto the sill, split-mend the clump | this drop |
| `FSN-FOE-WOUND` | CADRE | pull onto a body, detonate on the hit, cash the cluster | this drop |
| `FSN-HOLD-VERSE` | COURT | spells illegal until walk; Strike illegal until a spell; feet nailed | this drop |

Named packs as variants: `FSN-TICK-RAT/EMPTY` (Tick Empty), `FSN-EXIT-PAIR/FUSE` (Exit Slide), `FSN-FIELD-WIPE/BRICK` (Wipe Field), `FSN-WICK-SPAN/ODD` (Odd Rebate), `FSN-STRETCH-MUTE/STALL` (Stall Stretch), `FSN-FOE-WOUND/KENNEL` (Split Kennel), `FSN-FOE-FANG/PIT` (Unit Pit), `FSN-HOLD-VERSE/CROWN` (Crown Bar), `FSN-HOLD-VERSE/QUAD` (Quad Plug — skip until cap ≥ 4).

---

## Formations

### FSN-SHOVE-BASH

FORMATION_ID: `FSN-SHOVE-BASH`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-PUSHER` — `pawn` or `knight` / proposed `bash_bruiser` — pack median + 1 — front
- `ROLE-SHOVE-MEND` — `queen` **with** heal / proposed `shove_mender` — pack median — back, Chebyshev ≥ 3

VARIANT_RULES:

- Band 0: **do not spawn this id** (Shove Mend is a heal kit; kit band 0 has no heal). Show `FSN-HOOK-SLAM` instead (push without the cash-in heal).
- Band 1: Bruiser has Strike + Shoulder Bash. Mender has Shove Mend + Shield. **No** Inferno. **No** Gait Mend / Chase Mend on either body.
- Elite: Bruiser only. Mender stays junior so two elites cannot bash-then-full-heal a 100–0.
- Unlock after `FSN-HOOK-SLAM` **or** `FSN-WARD-MEND` (player has seen a push **or** a heal body; this sheet combines them as **displace then cash**).
- Random 30% family lottery is **off**.
- Do **not** ship until `forcedMovedThisTurn` writers exist. Missing flag → Mender is a Shield queen (soft PAIR, still valid) — do not pretend the 8 landed.
- Bash dest: free floor, not lava / pit / fuse, player keeps ≥ 1 walk-off. Bash into open floor is skipped (VETERAN).

SPELL_POOL_INTERACTIONS:

- Shoulder Bash is a 2-step ray. Collision bonus vs wall is allowed if a side step remains. The bash **is** the force-move that arms Shove Mend.
- Shove Mend heals 8 iff the **target** was force-moved. Walk MP does not pay. Cursed Wound halves the 8.
- Shield is RES, not reflect. Player physical still works.

TACTICAL_PLAN:

- Bruiser walks a flank and Bashes after the player is on a file, aiming at a wall **beside** the engagement, never the last exit.
- Mender stays at 3 and Shove-Mends the Bruiser only if the flag is true and missing HP ≥ 8. If the flag is false, Shield / hold.
- Never turn-1 bash a full-HP player into a dead-end.

SYNERGY:

- Pusher + force-move healer. Wave 2 bash standing on Wave 10 Shove Mend. The 8 is **earned**; standing still is 0 HP.

PLAYER_THREAT:

- Readable. The scary turn is “I got banged into a pillar and the queen refunded the bruiser.” Not a one-shot.

COUNTERPLAY:

- Don’t get pushed. Hug the Bruiser (bash skip into open floor). Root the Mender. Kill the glass queen (`hp` ~0.85). Self Anchor. Cursed Wound.

MAP_REQUIREMENTS:

- `arena` or `asymmetric` with a wall 2 tiles from typical stand, plus open floor the other way. Reject `corridorMaze` (bash + heal in a hallway is a lock).
- No lava dest. No sealed pocket behind the wall.

AI_REQUIREMENTS:

- Pusher: charger; skip bash into open floor; dest scoring must not use lava; bash **does** set `forcedMovedThisTurn` on the moved body.
- Shove-mend: healer; skip if flag false or missing HP < 8.
- Soph 1–2. `groupTactics` not required.

VARIANTS:

- `FSN-SHOVE-BASH/KNIGHT` — Bruiser chassis `knight` (flank path).
- `FSN-SHOVE-BASH/E-BASH` — elite Bruiser, still no lava dest, still no second healer.

STATUS: PROPOSED

---

### FSN-DRY-TAX

FORMATION_ID: `FSN-DRY-TAX`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-DRY` — `knight` / proposed `dry_stinger` — pack median — starts wide
- `ROLE-TELLER` — `bishop` **without** heal / proposed `act_teller` — pack median — back

VARIANT_RULES:

- Band 0: **do not spawn this id** (Act Tax / Dry Sting are not on default kits). Show `FSN-FROST-KNIFE` instead.
- Teller has Frost + Act Tax (leftover-AP tax from Wave 6). Dry has Strike + Dry Sting. **No** Purse Keep on PAIR (that is `FSN-DRY-KEEP`). **No** Empty Plate (PAIR ban).
- Elite: Dry only. Teller stays junior so two leftover-AP elites cannot empty-then-20 from full HP.
- Unlock after `FSN-FLUSH-DUMP` **or** `FSN-ACT-GIFT` (player has seen leftover AP as a resource).
- Purse Keep does **not** empty the bar this turn — do not pretend Dry sees 0 leftover while Keep is armed.

SPELL_POOL_INTERACTIONS:

- Act Tax makes spending the last 2 expensive or forced. Dry Sting is 12, +8 if leftover AP = 0 (20 total).
- Gate is leftover **before** Dry’s own AP debit on the caster. Keep 1 leftover; the +8 never lands.
- No drain on the Teller (`healAmount` would steal healer).

TACTICAL_PLAN:

- Teller stays at 3–4 and Taxes if leftover ≥ 2. Dry lurks at 3 and **ignores** a wet bar unless 12 kills.
- Hostiles start ≥ 4 apart. Never turn-1 20 on a full-HP full-bar player.

SYNERGY:

- Leftover-0 assassin + leftover AP tax. Wave 6 teller standing on Wave 10 Dry. You see the empty-bar window.

PLAYER_THREAT:

- High if you dump the bar into Act Tax then stand next to the knight. Low if you end with 1 leftover. Not unavoidable.

COUNTERPLAY:

- End turn with 1 leftover. Kill the Dry (`hp` ~0.80). Don’t dump the bar. Frost the knight’s MP.

MAP_REQUIREMENTS:

- `openField` or `arena`. Dry needs a flank that is not the only exit. Teller needs a retreat tile.
- No Time Warp (panic dump into 0 leftover).

AI_REQUIREMENTS:

- Dry: flanker + leftover-AP hold (`ROLE-DRY`).
- Teller: caster; skip Tax if leftover already 0.
- Soph 1–2.

VARIANTS:

- `FSN-DRY-TAX/E-DRY` — elite Dry, still no turn-1 20 on a wet bar.
- `FSN-DRY-KEEP` is the BRIGADE with Purse Keep — do not merge this PAIR into it.

STATUS: PROPOSED

---

### FSN-WICK-HOOD

FORMATION_ID: `FSN-WICK-HOOD`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-WICK-GAIT` — `pawn` or `bishop` **without** heal / proposed `gait_wicker` — pack median
- `ROLE-FAR-HOOD` — `bishop` **without** heal / proposed `far_hooder` — pack median — back

VARIANT_RULES:

- Distinct from `FSN-BOOT-STEP` (already-walked **now**) and `FSN-HOOD-CHOIR` (Fog Hood). Wick detonates on the **next** walk MP. Hood zeros hits from Chebyshev ≥ 3.
- PAIR: one wick, one hood. Wicker will not refresh an already-marked target. Hooder skips if you are already at 2.
- Elite: Hooder only. Wicker stays junior so two elites cannot nail-feet **and** zero the 4-range poke.
- Unlock after `FSN-BOOT-STEP` **or** `FSN-GLASS-WARD` (player has seen a walk tax **or** a min-range gun).
- Must Span stays off PAIR (that is `FSN-WICK-SPAN`). Fuse stays off (PAIR ban).
- Do **not** ship until `walkMpSpentThisTurn` exists. Missing field → Wick never detonates (soft Frost/Strike PAIR).

SPELL_POOL_INTERACTIONS:

- Gait Wick: mark 2 of their turns. Next ≥ 1 walk MP deals 10, then consume. Stand is 0. Relocate does not detonate.
- Far Hood: next applied damaging hit from Chebyshev ≥ 3 deals 0, then consume. Hits from 1–2 land. DoT does not consume.
- Frost from Hooder is chip, not a root.

TACTICAL_PLAN:

- Wicker Marks if the player still has walk MP. Hooder Hoods if nearest hostile ≥ 3.
- If the player stands, Wick is 0 and Hood still eats the snipe — intended. Closing to 2 answers Hood and detonates Wick. That is the PAIR question, not a lock: you choose which verb to pay.

SYNERGY:

- Walk-MP wick + far-range 0. Wave 10 Wick Span minus Must Span. Closing answers one verb and pays the other.

PLAYER_THREAT:

- Positional. Fail is sniping at 4 **and** taking a 2-step. Recoverable: stand, or walk 1 after Hood consumes, or blink (does not detonate).

COUNTERPLAY:

- Stand (Wick 0). Walk in to 2 after Hood consumes. Dispel the mark. Poison (DoT is not the next hit). Kill the Wicker (`hp` ~0.80).

MAP_REQUIREMENTS:

- `openField` or `chessboard` with room to step to Chebyshev 2 **without** being the only exit. Reject a 1-tile tunnel (close **is** the only play → Wick always pays).
- No Time Warp.

AI_REQUIREMENTS:

- Wicker: controller; skip if MP = 0.
- Hooder: guardian; skip if already ≤ 2.
- Soph 1–2.

VARIANTS:

- `FSN-WICK-HOOD/E-HOOD` — elite Hooder, still no Must Span on PAIR.
- `FSN-WICK-SPAN` is the BRIGADE with Must Span — do not merge.

STATUS: PROPOSED

---

### FSN-TICK-RAT

FORMATION_ID: `FSN-TICK-RAT`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-TICK` — `rook` / proposed `tick_plater` — pack median + 1 — front
- `ROLE-DEBUFFER` — `pawn` / live `plague_rat` — pack median − 1 — wide start

VARIANT_RULES:

- Distinct from `FSN-ROT-CUT` (rat + **finisher**) and `FSN-PLATE-LINK` (hit absorb). Pressure is stacked DoT vs a body that **eats one tick**.
- PAIR: rat has Venom + Poison. Plater has Strike + Tick Plate. **No** Empty Plate (PAIR ban). **No** Ignite (that is CADRE `FSN-STRETCH-MUTE`).
- Elite: Plater only. Never an elite rat (CHAMPION puddle + eaten tick hides the lesson).
- Unlock after `FSN-PAPER-PLAGUE` **or** `FSN-ROT-CUT` (player has seen stacked DoT).
- Iron Golem DoT-immunity is a **counter**, not a member.

SPELL_POOL_INTERACTIONS:

- Poison + Venom stack (`appendDotStack`). Tick Plate consumes **one** tick that would apply HP loss, then expires. Two DoT types still land the other.
- Direct hits unaffected. Inferno is off this PAIR (BRIGADE+).
- Rat does **not** carry drain.

TACTICAL_PLAN:

- Rat applies and leaves (VETERAN: refuse melee on a target that already has this rat’s venom).
- Plater Plates when own next tick ≥ 8, else Strikes. If the player never paints, this is a fat rook + glass pawn — fine.

SYNERGY:

- Eat-next-tick tank + applicator. Live `plague_rat` so the pack is not two proposed sprites. Dumping one DoT into the plate is the misplay.

PLAYER_THREAT:

- Slow. Spike is low. A player who never looks at the second DoT loses a tick, not a fight.

COUNTERPLAY:

- Two DoT types. Kill the rat immediately (hp ~0.4). Wait 2 turns. Physical the Plater. Ignite (player-side) cash-in is fair.

MAP_REQUIREMENTS:

- `openField` or `arena`. Rat needs space to apply-and-leave. Plater needs a wide lane.
- No Glass Realm. No Thorned Ground on every approach.

AI_REQUIREMENTS:

- Rat: flanker profile even on pawn (proposed).
- Plater: guardian; skip if no DoT.
- Soph 1–2.

VARIANTS:

- `FSN-TICK-RAT/EMPTY` — BRIGADE: add `ROLE-EMPTY` (`empty_plater`) — Tick Empty. Still no Dry (PAIR ban). Dump AP, eat a tick, leftover-0 +RES.
- `FSN-TICK-RAT/E-PLATE` — elite Plater, wait until Inferno / Poison lands, then plate.

STATUS: PROPOSED

---

### FSN-HOME-SILL

FORMATION_ID: `FSN-HOME-SILL`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-HOME` — `queen` **without** heal / proposed `home_stepper` — pack median
- `ROLE-QUIET-SILL` — `rook` **without** heal / proposed `quiet_siller` — pack median

VARIANT_RULES:

- Distinct from `FSN-HINGE-GLANCE` (90° around ally) and `FSN-HOLD-RANGE` (unit Strike-hold). Home is **self-relocate** onto a free adj of the Siller. Quiet is a **tile** that forbids `isPhysical`.
- CELL: one Home Step, one Quiet Sill. Siller paints a melee tile, then Home Steps onto a **different** adj cell — never both on the only player exit.
- Elite: Siller only. Home stays junior so two dash elites cannot surround.
- Unlock after `FSN-MIST-HUNT` **or** `FSN-HOOK-SLAM` (player has seen a self-relocate **or** a board-move).
- Split Mend stays off CELL (that is `FSN-HOME-QUIET`). Hinge / Hook / Ally Reel stay off (PAIR bans).
- Home Step is relocate, **not** `isSwap`. Occupying the ring is the complete answer.

SPELL_POOL_INTERACTIONS:

- Home Step: caster moves to a free Chebyshev-1 of the targeted ally. Target does not move. Landing hazards **must tick**.
- Quiet Sill: paint 2 turns. Occupant cannot resolve Strike / `isPhysical`. Spells stay legal. Attack Nearest from this cell must refuse.
- Frost after a failed Home is a tax, not a root.

TACTICAL_PLAN:

- Siller paints the melee tile the player wants, **not** both approaches. Home Steps only if a free adj **seals or rescues**, never onto the player’s last exit.
- Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- Join-ally + spell-only tile. Wave 10 Home Quiet minus Split Mend. The queen appears on the sill; you step off and Strike from 2.

PLAYER_THREAT:

- Positional. Fail is standing on the sill and confirming Strike. Recoverable: leave the cell, occupy the ring, Frost from the tile.

COUNTERPLAY:

- Fill the Home landing ring. Step off Quiet. Cast a non-physical id. Open Pit the only landing. Kill the Siller.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with two approaches plus a rear tile that is not the only exit. Reject cramped `corridorMaze` (join in a closet is a lock **or** useless).
- Quiet must not be the only tile that reaches the Home body.

AI_REQUIREMENTS:

- Home: protector / flanker; skip if already adj or no free cell; never land on the last exit.
- Quiet: setter; skip empty unreachable cells; filter by `isPhysical`, never `"Strike"` in the name.
- Soph 2–3.

VARIANTS:

- `FSN-HOME-SILL/E-SILL` — elite Siller, still no Split Mend on CELL.
- `FSN-HOME-QUIET` is the CADRE with Split Mend — do not merge.

STATUS: PROPOSED

---

### FSN-EXIT-PAIR

FORMATION_ID: `FSN-EXIT-PAIR`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-EXIT` — `pawn` or `rook` **without** heal / proposed `exit_stinger` — pack median
- `ROLE-SLIDE` — `queen` or `king` **without** heal / proposed `pair_slider` — pack median

VARIANT_RULES:

- Distinct from `FSN-PAIR-PEEL` (90° hinge) and `FSN-HOOK-SLAM` (hook then bash). This sheet is **paint leave, then translate the pair onto it**.
- CELL: one Exit Sting, one Pair Slide. Slider skips if < 2 player-side bodies **or** dest blocked. If the player brought no summon, Slider Frosts — still a pair.
- Elite: Slider only. Exit stays junior so two displacement elites cannot pin.
- Unlock after `FSN-PAIR-PEEL` **or** `FSN-HOOK-SLAM` (player has seen a pair-move **or** a translate).
- Fuse stays off CELL (that is `FSN-EXIT-PAIR/FUSE`). Porter / Broker / Conveyor / Hinge stay off (PAIR bans).
- Do **not** ship until Pair Slide has occupancy dests (not `isSwap`) and Exit has a leave hook. Dest must leave a walk-off **out of** the sting cell.

SPELL_POOL_INTERACTIONS:

- Exit Sting: first leave (walk **or** force-move / Swap / Home Step off) deals 8, then consume. Enter does not tick. Standing is 0.
- Pair Slide: target one hostile; nearest other at Chebyshev 1; both move 1 along caster→target. Caster stays. Blocked dest = whole-card fizzle.
- Shove Mend **does** arm if a Mender is added later. Gait Wick does **not** detonate on this slide.

TACTICAL_PLAN:

- Exit paints a peel tile or the player’s feet. Slider Slides only if both dests are free **and** at least one landing is the sting **and** a walk-off out remains.
- Never turn-1 slide onto lava. Never slide both bodies onto the only aisle.

SYNERGY:

- Leave-tax + pair translate. Wave 10 Exit Slide minus Fuse. The board walks you onto a tax you can refuse by isolating.

PLAYER_THREAT:

- Positional. Fail is clumping with a wisp on a sting cell. Recoverable: split, occupy dests, never enter.

COUNTERPLAY:

- Isolate (Slider skips). Occupy dests. Don’t occupy the sting. Burst the Exit (`hp` ~0.85). Diagonal stance so no Chebyshev-1 partner exists.

MAP_REQUIREMENTS:

- `arena` or `openField` with ≥ 8 free floor cells. Reject `corridorMaze` (slide in a hallway is a lock).
- Sting  + slide dests must not cover **all** walk-offs.

AI_REQUIREMENTS:

- Exit: setter; skip empty; leave hook on walk **and** force-move.
- Slider: caster; skip if < 2 or dest blocked; dest scoring must not use lava / last exit.
- Soph 2–3. Blackboard: `plannedSlideDest` so Exit and Slider agree.

VARIANTS:

- `FSN-EXIT-PAIR/FUSE` — BRIGADE: add `ROLE-FUSE` (`fuse_binder`) — Exit Slide. Still no lava dest. Fuse deals 0 on cast. Teleport-off the fuse works; walk-on at tick does not.
- `FSN-EXIT-PAIR/E-SLIDE` — elite Slider, still no partial translate.

STATUS: PROPOSED

---

### FSN-FOE-FANG

FORMATION_ID: `FSN-FOE-FANG`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-FOE-REEL` — `bishop` **without** heal / proposed `foe_reeler` — pack median
- `ROLE-FANG` — `knight` or `queen` **without** heal / proposed `split_fanger` — pack median

VARIANT_RULES:

- Distinct from `FSN-ALLY-WICK` (pull **to ally**) and `FSN-PEEL-COURT` (isolation vs cluster as COURT). This CELL is **cluster them, then cash the cluster poke**.
- CELL: Foe Reel + Split Fang. Fang skips the +16 if no second hostile Chebyshev ≤ 1 (Frost / Strike). Reel skips if isolated.
- Elite: Fang only. Reel stays junior so two pull elites cannot pin.
- Unlock after `FSN-ALLY-WICK` **or** `FSN-PEEL-COURT` teaching leftover (player has seen a pull **or** a cluster gun).
- Wound Mark stays off CELL (that is `FSN-FOE-WOUND`). Ally / File / Hook / Sink stay off (PAIR bans).
- Do **not** ship until Foe Reel is a real `applyAttract` dest flavor (attractor = **other hostile’s cell**, not self).

SPELL_POOL_INTERACTIONS:

- Foe Reel: attract 1 toward nearest living hostile-to-the-target that is not the caster. Dest legality as File Reel.
- Split Fang: 16, +16 iff a second hostile Chebyshev ≤ 1. Not a bounce. Dummy can be an illegal cluster — not on this CELL (no dummy).
- Frost after a reel is a tax, not a root.

TACTICAL_PLAN:

- Fang holds at 3. Reel Reels only if the step lands into Fang range **and** a walk-off remains. If the player brought no summon, Reel Frosts and Fang is a 16 — intended soft CELL.

SYNERGY:

- Pull-to-other-hostile + cluster poke. Wave 10 Foe Wound minus Wound Mark. Clumping with a wisp is the tax; spreading is the answer.

PLAYER_THREAT:

- Positional. Fail is standing Chebyshev-1 from your wisp on a file. Recoverable: split, occupy the toward-tile.

COUNTERPLAY:

- Desummon / stand 3+ from the wisp. Occupy the toward-tile. Kill the Fang (`hp` ~0.85). Isolate so Reel skips.

MAP_REQUIREMENTS:

- `openField` or `arena`. Reject `corridorMaze` (reel + fang in a hallway is a lock).
- ≥ 2 walk-offs after a 1-tile attract.

AI_REQUIREMENTS:

- Reel: caster; skip if no second body or dest blocked / lava.
- Fang: artillery / flanker; skip the +16 if no cluster.
- Soph 2–3.

VARIANTS:

- `FSN-FOE-FANG/PIT` — COURT: add `ROLE-UNIT-OATH` + `ROLE-PIT-SKIP` + `origin_mason` as **Unit Pit** only after this CELL is answered. Barrier fizzles; skipper walks a 1-tile pit they just forced. Maps stay solvable for the **player**. Never PAIR Oather with Origin.
- `FSN-FOE-WOUND` is the CADRE with Wound Mark — do not merge.

STATUS: PROPOSED

---

### FSN-FIELD-WIPE

FORMATION_ID: `FSN-FIELD-WIPE`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-WIPE` — `bishop` **without** heal / proposed `echo_wiper` — pack median
- `ROLE-FIELD` — `knight` or `bishop` **without** heal / proposed `field_biter` — pack median

VARIANT_RULES:

- Distinct from `FSN-WALL-HUG` (bonus if **adj block**) and `FSN-ALLY-WICK` (copy paint). Wipe **erases** a hug-wall of paint; Field cashes **open floor**.
- CELL: one wipe, one bite. Wiper skips if no paint (Frost). Biter skips if they hug a blocking tile (Strike).
- Elite: Biter only. Wiper stays junior.
- Unlock after `FSN-WALL-HUG` **or** `FSN-ALLY-WICK` (player has seen hug-bonus **or** paint).
- Brick Shift stays off CELL (that is `FSN-FIELD-WIPE/BRICK`). Echo Paint / Ember / Fuse stay off (PAIR bans).
- Weight ×1.5 on open `chessboard`; weight 0.5 on `corridorMaze`.

SPELL_POOL_INTERACTIONS:

- Echo Wipe: erase one adjacent painted hazard (cinder / rime / mire / fuse / wick / glyph). 0 damage. Maps stay solvable (paint erase, not a wall).
- Field Bite: 10, +8 if 0 Chebyshev-1 blocking tiles. Barrier / wall / pit occupancy / span post count as blocking. Echo Wipe is **not** a block.
- If the map has no paint, Wiper Frosts forever — still a CELL of poke. Do not fake paint.

TACTICAL_PLAN:

- Wiper erases the cell the player stands on **or** the only Cinder path that is **not** the last exit. Biter waits for open floor.
- Never wipe the only safe tile that is also the only walk-off.

SYNERGY:

- Erase the hug-wall, then cash open-floor. Inverse of Wall Bite. Combination, not a new sprite.

PLAYER_THREAT:

- Low spike. Fail is fighting in the open after they peeled your pillar-paint. Recoverable: hug a **world** wall, re-paint, kill the Biter.

COUNTERPLAY:

- Fight on a world wall / pit. Don’t stand on the only Cinder. Burst the Wiper (`hp` ~0.80). Re-paint after.

MAP_REQUIREMENTS:

- `openField`, `arena`, or `chessboard`. Reject a 1-tile closet. Prefer maps with **optional** paint (ember flavor / a glyph), not lava on every approach.
- If no paint exists at spawn, still legal (Frost + 10).

AI_REQUIREMENTS:

- Wiper: caster; skip if no paint; never erase the last walk-off.
- Biter: charger; skip if they hug a blocking tile.
- Soph 2–3.

VARIANTS:

- `FSN-FIELD-WIPE/BRICK` — BRIGADE: add `ROLE-BRICK` (`brick_shifter`) — Wipe Field. Brick slides an **existing** `barrierTiles` cell 1. World walls illegal. Player keeps a gallery after the slide.
- `FSN-FIELD-WIPE/E-BITE` — elite Biter, still no Wall Bite on this id.

STATUS: PROPOSED

---

### FSN-SHOVE-CHOIR

FORMATION_ID: `FSN-SHOVE-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PUSHER` — `pawn` / proposed `bash_bruiser` — pack median + 1
- `ROLE-SLIDE` — `queen` **without** heal / proposed `pair_slider` — pack median
- `ROLE-SHOVE-MEND` — `queen` **with** heal / proposed `shove_mender` — pack median

VARIANT_RULES:

- Unlock after `FSN-SHOVE-BASH`. Wave 10 “Shove Choir.”
- Elite: Bruiser only. Slider and Mender stay junior so two displacement elites cannot pin.
- Two queens, two jobs: Slider has **no** healAmount (stays caster). Mender is the only healer. Same piece asset, different kits.
- Hook / Swap stay off (that is `FSN-HOOK-SLAM` / `FSN-EMBER-RIFT`). Gait / Chase stay off (PAIR bans).
- Bash dest and slide dest still banned from lava / void. Prefer landing that **is** a force-move (arms Mend) if a walk-off remains.

SPELL_POOL_INTERACTIONS:

- Bash **or** Slide can arm Shove Mend. Do not bash **and** slide the same body on the same round (unreadable double displace).
- Shove Mend still pays 0 if the flag is false. Cursed Wound halves the 8.
- Slider never gets Inferno. Bruiser Enrage is off (buffer honesty).

TACTICAL_PLAN:

- Mender waits for a public force-move. Bruiser Bashes toward a wall beside the engagement. Slider Slides only if the player is clumped with a summon **or** the Bruiser just missed.
- If the Mender dies, remaining pair is `FSN-EXIT-PAIR` without the sting — intended.

SYNERGY:

- Displace first, then cash the 8. Three Wave 2/10 verbs, one flag.

PLAYER_THREAT:

- Tempo and sustain. Failure is eating bash+slide then ignoring the queen. Recoverable: isolate, occupy dests, burst the Mender.

COUNTERPLAY:

- Don’t get pushed. Isolate. Cursed Wound the Mender. Root the Bruiser. Stand adjacent (bash skip).

MAP_REQUIREMENTS:

- `arena` or `openField` with ≥ 8 free floor cells and at least one pillar. Reject `corridorMaze`.
- ≥ 2 walk-offs after bash **and** after slide.

AI_REQUIREMENTS:

- Same bash/slide legality as `FSN-SHOVE-BASH` / `FSN-EXIT-PAIR`.
- Mender: healer; skip if flag false.
- Soph 3–4. Blackboard: `plannedDisplace` so only **one** force-move lands per round unless a kill.
- `groupTactics` at 4: one focus.

VARIANTS:

- `FSN-SHOVE-CHOIR/NO-SLIDE` — fallback to `FSN-SHOVE-BASH` if Pair Slide dests are not ready.
- `FSN-SHOVE-CHOIR/NO-MEND` — fallback to a softer bash+slide if `forcedMovedThisTurn` is missing.

STATUS: PROPOSED

---

### FSN-WICK-SPAN

FORMATION_ID: `FSN-WICK-SPAN`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-WICK-GAIT` — `pawn` / proposed `gait_wicker` — pack median
- `ROLE-MUST-SPAN` — `knight` / proposed `must_spanner` — pack median
- `ROLE-FAR-HOOD` — `bishop` **without** heal / proposed `far_hooder` — pack median

VARIANT_RULES:

- Unlock after `FSN-WICK-HOOD`. Wave 10 “Wick Span.”
- Elite: Hooder only. Wicker and Spanner stay junior.
- Must Span is the **one** rare. Even / Odd / Diag / Axis / Toll stay off (PAIR bans). Boot / Post / Wound / Cast / Fuse stay off.
- Spanner skips if they will not walk. Forced-move any length is legal (does not detonate Wick, does not pay Must Span).
- Do **not** ship until walk-MP spent exists.

SPELL_POOL_INTERACTIONS:

- Must Span: remaining walks this turn must be Manhattan exactly 2. 1-step and 3-step illegal. 0 walk legal. Knight 2-1 jumps are **not** walks.
- Wick detonates on that forced 2-step. Hood zeros the shot from 4 if they refuse to close.
- Closing to 2 answers Hood, pays Wick, and must be a legal 2-step (or a relocate).

TACTICAL_PLAN:

- Turn 1: Wicker Marks if walk MP remains. Spanner Must-Spans if they want a 1-step peel. Hooder Hoods if nearest ≥ 3.
- If the player stands, Wick is 0, Must Span expires, Hood still eats the snipe — intended.

SYNERGY:

- Force a 2-step, detonate the wick, waste shots at 4. Three Wave 10 verbs, one walk.

PLAYER_THREAT:

- High if you 1-step peel at 4. Low if you stand or blink. Not a lock: relocate, or take a legal 2-step onto a safe cell.

COUNTERPLAY:

- Stand. Blink / Swap / Home Step (legal, no wick). Take a legal 2-step after Hood consumes. Dispel the mark. Kill the Spanner.

MAP_REQUIREMENTS:

- `openField` or `chessboard` with legal Manhattan-2 dests that are **not** the only exit. Reject maps with no legal 2-step (Must Span becomes a hard walk lock).
- No Time Warp.

AI_REQUIREMENTS:

- Wicker: skip if MP = 0.
- Spanner: skip if they will not walk.
- Hooder: skip if already ≤ 2.
- Soph 3–4. Blackboard: `forcedTwoStep`.

VARIANTS:

- `FSN-WICK-SPAN/ODD` — BRIGADE: replace Must Span with `ROLE-ODD` + `ROLE-REBATE` + `walk_toller` as **Odd Rebate** only after this sheet is answered. Odd dest, cheap 1-step, tax the remaining even. Never PAIR Odd with Must / Even. Never PAIR Rebate with Toll — the three-body is the lesson.
- `FSN-WICK-SPAN/NO-SPAN` — fallback to `FSN-WICK-HOOD` if Must Span filter is not ready.

STATUS: PROPOSED

---

### FSN-DRY-KEEP

FORMATION_ID: `FSN-DRY-KEEP`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-DRY` — `knight` / proposed `dry_stinger` — pack median
- `ROLE-KEEP` — `king` **without** heal / proposed `purse_keeper` — pack median
- `ROLE-TELLER` — `bishop` **without** heal / proposed `act_teller` — pack median

VARIANT_RULES:

- Unlock after `FSN-DRY-TAX`. Wave 10 “Dry Keep.”
- Elite: Dry only. Keeper and Teller stay junior.
- Purse Keep is the **one** rare. Leftover Lend / Lock / Scribe / Splitter stay off (PAIR bans). Empty Plate stays off.
- Keep is once/battle, pays at **next own turn start**, cap 3. Death discards the bank. Dry does **not** see 0 leftover while Keep is armed **this** turn.
- No Inferno on the Keeper at BRIGADE (bank then Inferno is CADRE+). No queue splice.

SPELL_POOL_INTERACTIONS:

- Act Tax → player dumps leftover → Dry 20. Keeper banks **their** leftover for a later 4-AP card, not yours.
- Keep snapshot is leftover **before** Late Purse / Pack Tithe burn. Not Timestep.
- Teller does not also Drain Courage (two AP engines).

TACTICAL_PLAN:

- Teller Taxes if leftover ≥ 2. Dry holds for 0 leftover. Keeper Keeps if leftover ≥ 2 **and** next card costs 4+.
- If the Keeper dies before next turn, the bank is gone — intended.

SYNERGY:

- Tax the last 2 AP, bank 3, sting the empty bar. Leftover AP as a three-body sentence.

PLAYER_THREAT:

- Tempo. Fail is dumping the bar, eating 20, then watching Inferno land next turn from the bank. Interruptible: keep 1 leftover, kill the Keeper.

COUNTERPLAY:

- End with 1 leftover. Burst the Keeper before next turn start. Kill the Dry. Don’t dump into Act Tax.

MAP_REQUIREMENTS:

- `openField` or `arena`. Dry needs a flank. Keeper needs two walk-offs.
- No Time Warp. No Hex of Silence (unowned).

AI_REQUIREMENTS:

- Dry: leftover-AP hold.
- Keeper: buffer; skip if leftover after 1-cost is 0; **not** a queue splice.
- Teller: skip Tax if leftover already 0.
- Soph 3–4.

VARIANTS:

- `FSN-DRY-KEEP/NO-KEEP` — fallback to `FSN-DRY-TAX` if next-turn-start writer is not ready.
- `FSN-DRY-KEEP/INFERNO` — CADRE: Keeper ADVANCED Inferno after a successful Keep. Still one Inferno cadence. Still no Empty Plate.

STATUS: PROPOSED

---

### FSN-BOOT-CHASE

FORMATION_ID: `FSN-BOOT-CHASE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-BOOT-LEND` — `bishop` **without** heal / proposed `boot_lender` — pack median
- `ROLE-CHASE-MEND` — `queen` **with** heal / proposed `chase_mender` — pack median
- `ROLE-SPARE` — `rook` or `pawn` / proposed `spare_pacer` — pack median + 1 — front

VARIANT_RULES:

- Unlock after `FSN-GAIT-PACE` **and** `FSN-BOOT-STEP`. Wave 10 “Boot Chase.”
- Elite: Spare only. Lender and Chase stay junior.
- **Never a PAIR of Boot Lend + Spare Pace** (PAIR ban). The third body (Chase Mend) is why this sheet exists: fund the walk, then cash the **target-walked** heal.
- Gait Mend / Shove Mend / Pale / Font stay off (PAIR bans vs Chase). Gift / Tempo stay off vs Boot.
- Do **not** ship until `walkMpSpentThisTurn` exists. Forced-move does **not** pay Chase and does **not** block Boot Lend (a shoved ally can still receive the lend).

SPELL_POOL_INTERACTIONS:

- Boot Lend: +1 current MP this turn if the target has not spent walk MP. Cap at max MP. Fizzle if they already walked.
- Spare Pace: +1 now, no unmoved gate (Wave 8). Together they can fund a 2-step — that is the BRIGADE, not a PAIR.
- Chase Mend: heal 8 iff the **target** spent ≥ 1 walk MP this turn. Root the Spare; the 8 is 0.

TACTICAL_PLAN:

- Lender inits high and Lends the Spare if unmoved and they need a 2-step. Spare walks. Chase Mends the Spare only if walk-spend ≥ 1 and missing HP ≥ 8, else Shield.
- If the Spare never walks, Chase is a Shield queen and Lender Frosts — intended.

SYNERGY:

- Fund the walk, then cash the target-walked heal. Inverse of Gait Choir (caster-walked). Combination of Wave 8 Spare with Wave 10 Boot / Chase.

PLAYER_THREAT:

- Sustain if the Spare is allowed to walk. Spike is low. Fail is ignoring the Chase queen while the Spare takes free tiles.

COUNTERPLAY:

- Root / Gait Seal the Spare. Kill the Chase (`hp` ~0.85). Pair Slide the ally **before** the lend. Cursed Wound. 0-heal does not fail `no_healing`.

MAP_REQUIREMENTS:

- `openField` or `fortress` courtyard + gallery. Spare needs a 2-step that is not the only player exit.
- No Thorned Ground on the only path to the Chase.

AI_REQUIREMENTS:

- Lender: ally-first buffer; skip if already walked or at max MP. Until `AI-ROL-05` exists, do **not** put `starter-heal` on this kit.
- Chase: healer; skip if walk-spend < 1 or missing HP < 8.
- Spare: charger.
- Soph 3–4. `AI_BACKLINE_PROTECT` at 4.
- Init order: Lender before Spare (family init 1.30 vs frontliner).

VARIANTS:

- `FSN-BOOT-CHASE/NO-SPARE` — CELL-shaped: Lender + Chase only (if Spare would collapse into a banned PAIR reading). Chase then needs the **player** to walk — skip that reading; prefer Shield-only Chase until Spare is present.
- `FSN-BOOT-CHASE/E-SPARE` — elite Spare, still no Gait Mend on the Lender.

STATUS: PROPOSED

---

### FSN-STRETCH-MUTE

FORMATION_ID: `FSN-STRETCH-MUTE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-STRETCH` — `bishop` **without** heal / proposed `cadence_stretcher` — pack median — `isLeader` optional
- `ROLE-LAST-MUTE` — `bishop` **without** heal / proposed `last_muter` — pack median
- `ROLE-IGNITE` — `pawn` or `bishop` **without** heal / proposed `ignite_alchemist` — pack median − 1

VARIANT_RULES:

- Unlock after `FSN-CRACK-VERSE` **or** `FSN-FLUSH-LEND` (player has seen a CD verb **and** a DoT cash). Wave 10 “Stretch Mute.”
- Elite: Stretcher-leader only. Muter and Ignite stay junior. Leader-boost is the escalation, not three elites.
- Stall / Crack / Flush / Thief / Lender stay off (PAIR bans vs Stretch). Gait Muter / Once / Hold-caster stay off vs Last Mute.
- Last Mute is the **one** rare. Ignite is the cash. Stretch ×2 on Inferno / Fuse remaining, then Mute bans the last id, then Ignite consumes stacks in the window.
- Do **not** ship until `lastResolvedSpellId` exists. Missing field → Muter Frosts forever (softer CADRE, still valid).
- No Glass Realm. No Time Warp. One Inferno cadence (player’s) being stretched is the identity, not a second Inferno on the pack.

SPELL_POOL_INTERACTIONS:

- Cadence Stretch: remaining ≥ 1 → `×2`, cap 8, 0 stays 0. Once-per-battle flags are not CDs. Sit on CD-0 ids.
- Last Mute: last resolved id illegal 1 turn. Show Strike last. Cast refuses, no AP.
- Ignite: consume DoTs (Wave 3). Needs ≥ 2 stacks. Stretching Inferno’s CD does **not** add stacks — the alchemist cashes what is already painted.
- Two bishops, both heal-less. Fine.

TACTICAL_PLAN:

- Turn 1: Stretcher Stretches if highest remaining ≥ 2 (prefer Inferno / Fuse). Muter waits for a heavy last id. Ignite holds until stacks ≥ 2.
- One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.
- If the Stretcher dies, boost lands on glass — intended. Remaining pair is Mute + Ignite.

SYNERGY:

- ×2 Inferno, ban the last id, cash stacks in the window. Three CD/DoT verbs, readable three-step.

PLAYER_THREAT:

- High if you show Inferno, eat ×2, then Ignite the ticks. Still interruptible: recast before Stretch, show Strike last, kill the Ignite (`hp` ~glass).

COUNTERPLAY:

- Sit on CD-0. Recast before they Stretch. Show Strike last. Burst the Ignite. Cadence Break / Flush on **your** side. Don’t dump a 3-turn lock into a visible Stretcher.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Stretch: skip if highest remaining < 2.
- Mute: skip if no last id or last is Strike with Frost still legal.
- Ignite: skip if stacks < 2.
- Soph 4–6. `groupTactics` on. Optional `escapeRoute` at soph 6 on the leader variant.

VARIANTS:

- `FSN-STRETCH-MUTE/NO-LEADER` — teaching CADRE without boost.
- `FSN-STRETCH-MUTE/STALL` — COURT: replace Stretch with `ROLE-STALL` + keep Muter + add `once_cantor` — **Stall Stretch**. +1 remaining, ban the last id, lock recast. Do **not** PAIR Stall with Stretch. Do not Crack then Stall the same body.
- `FSN-STRETCH-MUTE/NO-MUTE` — fallback if `lastResolvedSpellId` is missing: Stretch + Ignite only.

STATUS: PROPOSED

---

### FSN-HOME-QUIET

FORMATION_ID: `FSN-HOME-QUIET`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-HOME` — `queen` **without** heal / proposed `home_stepper` — pack median
- `ROLE-QUIET-SILL` — `rook` **without** heal / proposed `quiet_siller` — pack median
- `ROLE-SPLIT-MEND` — `bishop` **with** heal / proposed `split_cantor` — pack median

VARIANT_RULES:

- Unlock after `FSN-HOME-SILL` **and** `FSN-SPLIT-PAD`. Wave 10 “Home Quiet.”
- Elite: Quiet only. Home and Split stay junior.
- Split Mend is the **one** rare. 12, or 6/6 if an adjacent ally. Home landing **onto** Quiet next to Split is the clump. Dummy is usually the wrong adjacent — no dummy on this sheet.
- Hold Knight / First Verser / Dull / Pet / Kennel stay off vs Quiet (PAIR bans). Hinge / Hook / Ally Reel stay off vs Home.
- Do **not** put Split Mend on the Home body (`healAmount` would steal protector).

SPELL_POOL_INTERACTIONS:

- Home Steps onto a free adj of Quiet **or** Split, never onto the player’s last exit.
- Quiet forbids Strike on that cell. Split 6/6 if Home is adj after the step.
- Separate them; the 12 becomes a single Mend on the Cantor and Home is a fat Strike.

TACTICAL_PLAN:

- Quiet paints the melee tile. Home joins Quiet if a free adj seals. Split Mends the clump if adj, else self 12.
- If Quiet dies, remaining pair is join + glass healer — intended.

SYNERGY:

- Step onto the sill, split-mend the clump. Three bodies, one ring.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is Striking from the sill into a 6/6 refill.

COUNTERPLAY:

- Fill the ring. Step off Quiet. Isolate so Split is a single 12 on glass. Cursed Wound the Cantor. Occupy Home’s landing.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Cantor needs two walk-offs. Never a closed ring.
- Quiet must not be the only tile that reaches the Cantor.

AI_REQUIREMENTS:

- Home: skip if already adj or no free cell; ELITE: land onto Quiet only if the **player** would take it, never if the carry would.
- Quiet: setter; `isPhysical` gate.
- Split: healer; 6/6 only if living adjacent ally.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.
- Blackboard: `plannedHomeDest` so Home and Quiet do not stack on the last exit.

VARIANTS:

- `FSN-HOME-QUIET/NO-SPLIT` — fallback to `FSN-HOME-SILL` if ally split apply is missing.
- `FSN-HOME-QUIET/E-SILL` — elite Quiet, still no Kennel / Hold on this id.

STATUS: PROPOSED

---

### FSN-FOE-WOUND

FORMATION_ID: `FSN-FOE-WOUND`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-FOE-REEL` — `bishop` **without** heal / proposed `foe_reeler` — pack median
- `ROLE-WOUND` — `bishop` **without** heal / proposed `wound_marker` — pack median
- `ROLE-FANG` — `knight` / proposed `split_fanger` — pack median + 1 — `isLeader` optional

VARIANT_RULES:

- Unlock after `FSN-FOE-FANG`. Wave 10 “Foe Wound.”
- Elite: Fang-leader only. Reel and Wound stay junior.
- Wound Mark is the **one** rare. Cast Mark / Body Mark / Glyph stay off (PAIR bans). Ally / File / Hook / Sink stay off vs Reel.
- DoT / lava do **not** detonate Wound. The follow-up must be a damaging **hit** (Fang Strike or 16).
- Confirm live Wound × Fang before shipping. Safe reading: Mark, Reel into cluster, Fang hits (detonate + cluster bonus). Never Mark + two hits the same AP bar if that hides the icon.

SPELL_POOL_INTERACTIONS:

- Wound Mark: 2 turns, 1 charge. Next damaging hit deals 10 second `dealDamage` and consume.
- Foe Reel clusters the marked body toward Fang / a wisp.
- Split Fang 16+16 if clustered. Combined with Wound’s 10 is a readable burst, not a 100–0 from full HP at CADRE kits.

TACTICAL_PLAN:

- Turn 1: Wound Marks if a follow-up hit exists this round. Reel Reels toward Fang. Fang commits only when cluster **or** mark is public.
- Never turn-1 triple on one tile. Start ≥ 4 apart.

SYNERGY:

- Pull onto a body, detonate on the hit, cash the cluster. Three Wave 8/10 verbs.

PLAYER_THREAT:

- High if you clump with a wisp on a mark. Low if you spread and Poison. Not unavoidable.

COUNTERPLAY:

- Spread. Poison instead of Strike (does not consume — you can wait it out). Dispel the mark. Occupy the toward-tile. Kill the Marker (`hp` ~0.75). Peel the Fang-leader early if boost is on.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp.
- ≥ 2 walk-offs after a 1-tile attract.

AI_REQUIREMENTS:

- Reel: skip if isolated or dest blocked.
- Wound: skip if no ally poke.
- Fang: skip +16 if no cluster; optional `isLeader`.
- Soph 4–6. `groupTactics` on. Blackboard: `plannedReelDest`.

VARIANTS:

- `FSN-FOE-WOUND/NO-LEADER` — teaching CADRE.
- `FSN-FOE-WOUND/KENNEL` — COURT: replace Fang with `ROLE-SPLIT-PLATE` + `ROLE-KENNEL` + `still_leasher` as **Split Kennel**. Split the hit onto a pet that cannot leave. Never PAIR Kennel with Still / Pet Sill / Null. Isolate the tank; AoE both; fight without pets.
- `FSN-FOE-WOUND/NO-WOUND` — fallback to `FSN-FOE-FANG` if hit-detonate is not ready.

STATUS: PROPOSED

---

### FSN-HOLD-VERSE

FORMATION_ID: `FSN-HOLD-VERSE`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-CAST-HOLD` — `rook` **without** heal / proposed `hold_caster` — pack median + 1 — `isLeader`
- `ROLE-VERSE-FIRST` — `bishop` **without** heal / proposed `first_verser` — pack median
- `ROLE-SEAL` — `pawn` or `bishop` **without** heal / proposed `gait_sealer` — pack median
- Optional fourth: `ROLE-FAR-HOOD` junior **or** omit — if present, Hoods the pocket, not a second walk lock

VARIANT_RULES:

- Unlock after `FSN-HOLD-RANGE` **and** a leader-boost CADRE. Wave 10 “Hold Verse.”
- One elite only: the Hold-leader. Others stay junior so boost is the late scare, not four elites.
- **Never PAIR Hold Caster with Hold Knight / Gait Seal / Root.** This COURT is the three-lock lesson: spells illegal until walk; Strike illegal until a spell; feet nailed. Strike through Cast Hold is legal **until** Verse First lands. Walking clears Cast Hold **and** detonates nothing on this sheet (no Wick).
- InstantKill / betrayal stay off. Root stays off (Hold + Root is a full spell lockout). `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Hold walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-HOLD-VERSE/LANE` (variant): drop Verse and optional Hood — Cast Hold + Seal only, **only** if the player has already answered `FSN-HOLD-RANGE` (otherwise it clones that CADRE).

SPELL_POOL_INTERACTIONS:

- Cast Hold: non-Strike spells refuse until ≥ 1 walk MP this turn. Strike stays legal.
- Verse First: cannot confirm Strike until a non-Strike spell resolves this turn. Cast Frost, then Strike.
- Gait Seal: cannot spend walk MP; casts still legal. Together: you cannot walk to clear Hold, and you cannot Strike until you cast, and you cannot cast until you walk — **this is the COURT question**. The designed answers are: Swap / blink / far gun (Seal leaves those legal), wait 1 turn (all three are 1-turn), kill the Seal (glass), or player Timestep (enemy cannot have it).
- Optional Far Hood: waste the 4-range poke. Walk-in is illegal under Seal — Hood then eats the snipe. Far gun from Chebyshev 3 **after** Hood expires is still a full answer.
- `spell-rallying-cry` stays false.

TACTICAL_PLAN:

- Turn 1–2: Seal if the player still has walk MP. Hold if they have a non-Strike spell. Verse if they want Strike. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell.
- Optional Hood holds ≥ 3. If Seal dies, the walk-off opens; Hold may retreat (`escapeRoute`) rather than suddenly one-shot.
- Leader boost 10% × fallen escort. Cut the leader early or accept a longer finish.

SYNERGY:

- Court-scale action lock without `instantKill`. Sophistication and a fourth body are the unlock, not a new monster. Avoidable: wait, blink, snipe the Seal, or spend the turn on a legal leftover id after one lock expires.

PLAYER_THREAT:

- Highest structured tempo threat in this drop. Still turn-based. Failure is dumping Inferno into Cast Hold while Seal is up and Verse forbids the panic Strike. Recoverable next turn.

COUNTERPLAY:

- Kill the Seal (`hp` glass). Wait 1 turn. Swap / blink / far gun. Show a cheap Frost after Seal expires, then Strike through leftover Hold. Cursed Wound is irrelevant (no healer). Player Timestep is the designed panic.
- Do **not** also Root yourself (player Root + this COURT is a self-lock — that’s on the player).

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Player must have a tile that is legal for Swap / a 4-range shot **or** a wait-turn with ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Hold: skip if already walked or Strike-only; never also Root.
- Verse: skip if they already cast or have no unlock id.
- Seal: walk MP = 0, casts still legal; never with Root / Muter as a fifth verb.
- Optional Hood: skip if already ≤ 2.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Hold-leader.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-HOLD-VERSE/LANE` — BRIGADE-shaped: Hold + Seal only (ship if Verse gate is not ready). Still no Root.
- `FSN-HOLD-VERSE/NO-HOOD` — COURT of three.
- `FSN-HOLD-VERSE/CROWN` — COURT: replace Verse + Seal with `ROLE-CROWN` + `ROLE-FULL-BAR` + `coil_arbiter` as **Crown Bar**. Leader poke, then −1 AP on a full kit. Never PAIR Crown with Coup / Arbiter. Never PAIR Full Bar with Tempo. Arbiter Slow cap −2. Cut the leader.
- `FSN-HOLD-VERSE/QUAD` — COURT: replace this id’s members with `ROLE-QUAD` + `ROLE-QUIET-SILL` + `ROLE-EXIT` as **Quad Plug**. **Skip until remaining cap ≥ 4** (live cap 2). 2×2 seal, spell-only tile around it, tax the peel. Burst the 8 HP. Walk around. Sit on the NW cell. `summonAI === "quadspan"` required. Do not also roll a second post.
- `FSN-HOLD-RANGE` remains the Strike-illegal CADRE; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–10 still stand. This drop **meshes**; it does not replace.

```
PAIR:    SHOVE-BASH          DRY-TAX           WICK-HOOD          TICK-RAT
              \                 |                  |                  /
CELL:     HOME-SILL        EXIT-PAIR          FOE-FANG         FIELD-WIPE
              \                 |                  |                  /
BRIGADE:  SHOVE-CHOIR      DRY-KEEP          WICK-SPAN         BOOT-CHASE
              \                 |                  |                  /
CADRE:    HOME-QUIET     STRETCH-MUTE        FOE-WOUND
              \                 |                  /
COURT:                    HOLD-VERSE     HOLD-VERSE/CROWN     HOLD-VERSE/QUAD
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-SHOVE-BASH` | `FSN-HOOK-SLAM` **or** `FSN-WARD-MEND` |
| `FSN-DRY-TAX` | `FSN-FLUSH-DUMP` **or** `FSN-ACT-GIFT` |
| `FSN-WICK-HOOD` | `FSN-BOOT-STEP` **or** `FSN-GLASS-WARD` |
| `FSN-TICK-RAT` | `FSN-PAPER-PLAGUE` **or** `FSN-ROT-CUT` |
| `FSN-HOME-SILL` | `FSN-MIST-HUNT` **or** `FSN-HOOK-SLAM` |
| `FSN-EXIT-PAIR` | `FSN-PAIR-PEEL` **or** `FSN-HOOK-SLAM` |
| `FSN-FOE-FANG` | `FSN-ALLY-WICK` **or** `FSN-PEEL-COURT` leftover |
| `FSN-FIELD-WIPE` | `FSN-WALL-HUG` **or** `FSN-ALLY-WICK` |
| `FSN-SHOVE-CHOIR` | `FSN-SHOVE-BASH` |
| `FSN-WICK-SPAN` | `FSN-WICK-HOOD` |
| `FSN-DRY-KEEP` | `FSN-DRY-TAX` |
| `FSN-BOOT-CHASE` | `FSN-GAIT-PACE` + `FSN-BOOT-STEP` |
| `FSN-STRETCH-MUTE` | `FSN-CRACK-VERSE` **or** `FSN-FLUSH-LEND` |
| `FSN-HOME-QUIET` | `FSN-HOME-SILL` + `FSN-SPLIT-PAD` |
| `FSN-FOE-WOUND` | `FSN-FOE-FANG` |
| `FSN-HOLD-VERSE` | `FSN-HOLD-RANGE` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 11 packs (not this drop)

Sibling [`SPELL_PROPOSALS_2026-09-27.md`](../automation/SPELL_PROPOSALS_2026-09-27.md) (open as PR #695) stamps **new** verbs with **no family sheets**. SDE Wave 9 unique CORE (`spell-pair-stride` … `spell-knight-fold`) still has no CORE owner. This catalog does **not** mint `FSN-*` ids for them. The next formation drop should write those combinations after Wave 11 elite-evolution families exist.

Do **not** pack `cadence_stretcher` with `cadence_staller` as a teaching pair (Wave 10 rule). `FSN-STRETCH-MUTE` stays the ×2 lesson; `FSN-STRETCH-MUTE/STALL` stays the +1 COURT.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–10, plus Wave 10 verbs in this order (from elite-evolution §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920). **`FSN-TICK-RAT` band 1 can ship among the first** once family HP survives battle start. `FSN-SHOVE-BASH` needs band 1 heal **and** `forcedMovedThisTurn`.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse (`docs/ENEMY_AI_EVOLUTION.md` AI-SYS-04). **Shove Mend / Chase Mend / Split Mend must live only on healer profiles.**
4. Battle-walk writers: `walkMpSpentThisTurn`, vacated cell, `currentView` (facing families still wait), **`forcedMovedThisTurn`**, **`lastResolvedSpellId`**.
5. `effectCategory` callers for `applyPushback` / `applyAttract`. Pair Slide occupancy dests (not `isSwap`). Foe Reel = third attract dest flavor.
6. `inferSummonArchetype` gains `quadspan` (and still needs `dummypost` / `triplespan` from Waves 8–9). Raise or gate `ENEMY_SUMMON_CAP` before Quad Plug can spawn.
7. Ally buff apply (`targetId` on Shield / Iron Skin / Boot Lend / Split Mend). **`FSN-BOOT-CHASE` and `FSN-HOME-QUIET` must not ship before that apply exists** for the ally tools they name. `FSN-SHOVE-BASH` is force-move-gated heal and waits on the flag, not on ally `targetId`.
8. Tick-plate consume in `engine/dotStacks.ts`. Quiet Sill `isPhysical` gate. Gait Wick walk-MP hook. Exit leave hook. Purse Keep next-turn-start writer (**not** a queue splice).
9. Summoner cooldown fall-through (quad skip-lock today).
10. Cap the summoner overlay (`WX` 11932–11942) — not a formation task, but COURT quad sheets assume the lottery does not add a second engine.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order changes, or damage-formula edits. Map **selection** is a filter on already generated maps.

Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-SHOVE-BASH`, `FSN-SHOVE-CHOIR` | `forcedMovedThisTurn` on every force-move resolver; bash dest legality |
| `FSN-DRY-TAX`, `FSN-DRY-KEEP` | leftover-AP read; Keep = next-turn-start, not RAF splice |
| `FSN-WICK-HOOD`, `FSN-WICK-SPAN`, `FSN-BOOT-CHASE` | `walkMpSpentThisTurn`; Wick relocate-does-not-tick |
| `FSN-TICK-RAT` | tick-loop consume; two DoT types still land the other |
| `FSN-HOME-SILL`, `FSN-HOME-QUIET` | Home Step relocate (not `isSwap`); Quiet `isPhysical` gate |
| `FSN-EXIT-PAIR` | leave hook + Pair Slide occupancy dests + walk-off |
| `FSN-FOE-FANG`, `FSN-FOE-WOUND` | third `applyAttract` dest; Wound DoT-does-not-detonate |
| `FSN-FIELD-WIPE` | paint-table erase; Field `blocksWalk` scan |
| `FSN-STRETCH-MUTE` | `lastResolvedSpellId`; Stretch 0-stays-0; Ignite stack gate ≥ 2 |
| `FSN-HOLD-VERSE` | Cast Hold + Verse First + Seal as **three 1-turn locks**, never Root; walk-off or blink remains |
| `FSN-HOLD-VERSE/QUAD` | `summonAI === "quadspan"` **and** remaining cap ≥ 4 (live cap 2 → skip) |

---

## Sources (line-accurate, 2026-09-28)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 203–225, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942; zone object 4683–4687
- Family lottery + HP overwrite: `spawnPolicy.ts` 35–57, 69–128; WX 5864–5866, 11970–11974
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
- Wave 10 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-27.md` (PR #686) §3–§4
- Proposed spells: `docs/automation/SPELL_PROPOSALS_2026-09-26.md` (PR #636); SDE Wave 8 unique CORE in PR #590
- Drop 10: `docs/design/ENEMY_FORMATIONS_2026-09-27.md` (PR #669)

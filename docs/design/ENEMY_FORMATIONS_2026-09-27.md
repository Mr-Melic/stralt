# Enemy synergy and formation catalog (drop 10)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-27  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–9 already taught the seven pairing words and Waves 1–8 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 9 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-26.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-26.md) (open as PR #625) and deferred by drop 9 (PR #612): Gait Choir, Pair Peel, Flush Lend, Morrow Dummy, Seal File, Diag Brick, Wick Mend, Body Cast, Split Pad, Even Toll, Hold Range, Ground Brick, Purse Bell, Ally Wick, Blink Rank, Gift Boot, Cluster Dummy, Wall Corridor, Cast Quiet, Still Sill, Ghost Rear, Thin Goad, Clean Fog, Peel Court.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7 — open as PR #537), [`ENEMY_FORMATIONS_2026-09-25.md`](./ENEMY_FORMATIONS_2026-09-25.md) (drop 8 — open as PR #575), [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (drop 9 — open as PR #612). Family sheets: PR #625. Spell verbs: Wave 8 tactical ids in PR #563 (`spell-gait-mend` … `spell-split-mend`) plus SDE Wave 7 unique CORE (`spell-even-stride` … `spell-clean-blood`).

**Hard rules (Wave 9 pack law — plus every older law still stands):**

- Do **not** pack `gait_mender` with `pale_cantor` / `post_stinger` as a PAIR (walked heal vs unconditional Mend vs unmoved **damage**). `FSN-WARD-MEND` / `FSN-CAMP-TITHE` / `FSN-BOOT-STEP` stay theirs.
- Do **not** pack `pair_porter` with `hinge_squire` / `pivot_ward` / `pawn_broker` / `hook_chaplain` as a PAIR (four other rotate/swap engines). `FSN-HINGE-GLANCE` / `FSN-PIVOT-WICK` / Trade Trap sheets / `FSN-RESCUE-LINE` stay theirs.
- Do **not** pack `cadence_flusher` with `cadence_cracker` / `cadence_breaker` / `cadence_thief` / `cadence_lender` / `verse_thief` as a PAIR (all-bar gift vs highest-one / self / steal / −1 / summon-steal). `FSN-CRACK-VERSE` / `FSN-BREAK-CHOIR` / `FSN-CADENCE-MUTE` stay theirs.
- Do **not** pack `lone_stinger` with `split_fanger` as a PAIR (isolation vs cluster). COURT `FSN-PEEL-COURT` is the four-body lesson, never a two-gun PAIR.
- Do **not** pack `morrow_warden` with `plate_warden` / `surplus_warder` / `morrow_walker` / `thin_warder` as a PAIR (delayed plate vs now-plate vs blink vs hit-cap). `FSN-PLATE-LINK` / `FSN-SATED-PLATE` stay theirs.
- Do **not** pack `gait_sealer` with `snare_weaver` / `gait_muter` as a PAIR (walk lock vs root vs fizzle-if-walked). `FSN-WIRE-ROOT` / `FSN-GAIT-SNARE` stay theirs.
- Do **not** pack `diag_locksmith` with `axis_locksmith` / `even_warder` / `misstep_herald` as a PAIR (four walk-shape locks). `FSN-FILE-GUARD` / `FSN-PINCH-GOAD` stay theirs.
- Do **not** pack `brick_shifter` with `hinge_mason` as a PAIR (slide existing brick vs pad swap).
- Do **not** pack `wick_mender` with `wick_painter` / `fuse_binder` / `hinge_mason` as a PAIR (delayed heal vs delayed pit vs delayed damage vs enter-swap). CADRE `FSN-WICK-FACE` / `FSN-ALLY-WICK` stay the three-body timers.
- Do **not** pack `return_stinger` with `void_mirror` / `pain_suture` / `share_warden` / `cover_squire` as a PAIR (half-return vs 25% extra vs redirect vs 50/50 vs whole-hit cover). `FSN-MIRROR-REAVE` / `FSN-SHARE-GOAD` / `FSN-BRAND-COVER` stay theirs.
- Do **not** pack `leftover_lender` with `purse_scribe` / `purse_splitter` / `tempo_precentor` / `purse_locker` as a PAIR (dump-yours vs spend-theirs vs grant vs freeze). `FSN-PURSE-MUTE` / `FSN-ACT-GIFT` stay theirs.
- Do **not** pack `dummy_prelate` with `bait_prelate` / `goad_herald` / `pylon_prelate` / `span_prelate` / `twin_span` / `triple_span` / `font_cantor` / `stone_castellan` / `spark_chanter` (one post **or** multi-cell system). Dummy counts as **1**. `FSN-BAIT-GATE` / `FSN-TRIPLE-PLUG` / `FSN-TWIN-PLUG` stay theirs. Thin Goad is a **three-body** BRIGADE+ variant, never a dummy+goad PAIR.
- Do **not** pack `enter_mender` with `gift_siller` / `boon_mason` / `glyph_sower` / `pet_siller` as a PAIR (enter HP vs enter MP vs leave MP vs glyph vs summon-sill).
- Do **not** pack `body_marker` with `cast_marker` / `glyph_sower` as a PAIR (unit amp vs detonate-on-cast vs tile Mark). CADRE `FSN-BODY-CAST` is the three-body lesson.
- Do **not** pack `split_cantor` with `pale_cantor` / `share_warden` as a PAIR (split heal vs single Mend vs damage 50/50). `FSN-WARD-MEND` / `FSN-SHARE-GOAD` stay theirs.
- Do **not** pack `hold_knight` with `dull_censor` / `oath_censor` as a PAIR (Strike illegal vs Strike 0 vs other-id fizzle). `FSN-DULL-PET` stays theirs.
- Do **not** pack `ground_oather` with `pit_mason` / `origin_mason` as a PAIR (SDE extras live there).
- Do **not** pack `walk_toller` with `ley_tollkeeper` / `tide_shade` as a PAIR (walk tax vs cast MP vs melee slow). Ley Court sheets / `FSN-IRON-TIDE` stay theirs.
- Do **not** pack `purse_locker` with `tax_scribe` / `ledger_siphon` / `bone_scribe` as a PAIR (SDE extras live there).
- Do **not** pack `ally_reeler` with `file_reeler` / `hook_chaplain` / `sink_chanter` / `pale_cantor` / `cover_squire` as a PAIR (pull-to-ally vs file-to-caster vs rescue vs tile attract vs peel). `FSN-BRAND-REEL` / `FSN-REEL-TITHE` stay theirs.
- Do **not** pack `echo_painter` with `ember_knight` / `fuse_binder` / `glyph_sower` as a PAIR (copy vs place vs Mark). CADRE `FSN-ALLY-WICK` is the three-body lesson.
- Do **not** pack `blink_sealer` with `mist_walker` / `void_anchoret` / `slip_squire` as a PAIR (cannot-blink vs the blink engines). `FSN-MIST-HUNT` / `FSN-SLIP-PIT` stay theirs.
- Do **not** pack `split_fanger` with `glance_ward` / `iron_golem` / `storm_caller` as a PAIR (cluster poke vs glance vs bounce).
- Do **not** pack `wall_biter` with `wall_stinger` / `stone_castellan` / `pit_mason` as a PAIR (blocking-tile vs barrier-hug vs extras). `FSN-WALL-HUG` stays theirs.
- Do **not** pack `still_leasher` with `leash_cutter` / `null_censor` as a PAIR (pause vs cut vs lockout). `FSN-DULL-PET` / `FSN-NULL-WALL` stay theirs.
- Do **not** pack `ghost_stepper` with `blink_cutter` / `rift_hook` / `mist_walker` / `slip_squire` / `morrow_walker` as a PAIR (ghost occupancy vs five other leave/teleport engines).
- Do **not** pack `clean_cantor` with `glass_sniper` / `corner_bishop` as a PAIR (untouched LoS vs min-range vs blocked-LoS). `FSN-GLASS-WARD` / `FSN-CORNER-FOG` stay theirs.
- Drop 4–9 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks; no two leftover-AP engines; no two walk-shape locks).

Wave 9 **SPELL_PROPOSALS** (`SPELL_PROPOSALS_2026-09-26.md`, open as PR #636) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 9 tactical verbs until that family pass exists (Wave 10). Same-day SDE Wave 8 unique CORE stays G≥8 extras.

Court Hinge / Pack Still / File Fold / Mute Thread / Queue Cut / False Cut / Must Pace / Court Shove stay **boss / closed-class**. Court Hinge may witness on CHAMPION `pair_porter` only — never as a world-pack CORE.

**Do not spawn Gait Mend / Ghost Step / Boot escorts until a battle-walk writer exists for walk-MP spent this turn (and, for Ghost Step, the vacated cell).** Missing field → Gait Mend pays **0 HP** (fail closed). Forced-move / Swap / Knight Slip / Pivot / Pair Hinge / Ally Reel **does not** count as walk. Until that writer lands, show `FSN-WARD-MEND` / `FSN-BOOT-STEP` instead of `FSN-GAIT-PACE` / `FSN-GAIT-CHOIR`.

**Do not spawn Dummy Post sheets until `inferSummonArchetype` keys `summonAI === "dummypost"`.** Name heuristics stay a bug. Dummy fills the stationary-post cap (1). Remaining `ENEMY_SUMMON_CAP` must be ≥ 1. Do not also roll wolf/archer/pylon/turret/font/bait/span/twinspan/spark/triplespan onto that body.

**Pair Hinge dests are occupancy, not `isSwap`.** Blocked / lava / pit / fuse dest spends AP (fizzle). Player keeps ≥ 1 walk-off after both bodies land.

---

## Grounding (live, 2026-09-27)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 7–9. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

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
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–221 — **no** `dummypost` / `span` / `twinspan` / `triplespan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** This drop adds **zero** facing cards. |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 / 5855 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — Pair Hinge is occupancy dests, **not** `isSwap`. Ally Reel is the second **cast** caller of attract (File Reel is the first). |
| Occupancy `portals` | impassable (`occupancy.ts` 40) |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ — Wave 9 CORE rows stay `mpCost: 0`. Walk Toll is `nextWalkMpTax`. |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`); `spell.diagonal` at 712 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated dummy / span / twin-span / spark / pylon / turret / familiar bodies **replace** the random overlay. Cap one of those engines. Dummy Post **is** the 1-cell post and needs remaining cap ≥ 1.
3. Any `healAmount` steals healer. **Gait Mend / Mend Wick / Enter Mend / Split Mend must live only on healer profiles.** Do not put those ids, drain, or nova on Porter, Flush, Lone, Morrow, Seal, Diag, Brick, Return, Lender, Dummy, Body, Even, Hold, Oath, Toll, Locker, Reel, Echo, Blink-seal, Gift, Fang, Bite, Cast-mark, Still, Verse, Ghost, Thin, or Clean.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Spare Pace / Cadence Flush / Leftover Lend / Split Mend (healer kit only).
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 9 CORE rows stay `mpCost: 0` (do not add a fourth `mpCost > 0` walk snipe). Walk Toll is a next-walk MP tax, not `spell.mpCost`.
6. `inferSummonArchetype` must key `summonAI === "dummypost"` **before** any Dummy sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies except the **one** Brick Shift source wall that already exists (Brick **moves** a planted barrier; it does not mint a new one on PAIR). Coup / Gait Seal / Diag Lock / Cast Mark are **not** `instantKill`.
8. Pair-hinge dest / ally-reel dest / dummy plant: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. Pair Hinge into a wall is a fizzle (no crush). Ghost Step dest is the **vacated** cell — teleport does not leave it.
9. Dual Slow / Frost / tide melee / rime / Walk Toll: cap applied unit MP debuff at **−2**. One Slow **or** one Walk Toll source per pack, not both stacking past that cap. Do not also Root + Gait Seal + Diag Lock + Even Stride + Strike Hold on the same AP bar.
10. Walk-spend: Gait Mend / Ghost Step **fail closed** until `walkMpSpentThisTurn` (and vacated-cell for Ghost) exists on the turn actor. Pair Hinge / Ally Reel / Dummy plant **does not** increment it.

### Relative difficulty (same grades as drops 1–9)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…9 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a walk-tax / a walk-lock) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (morrow / dummy-owner / hold / bite / ghost / brick / porter / sealer / goad / locksmith / lancer / warden): pack median + one step.
- Backliner (gait-mend / flush / lone / wick-mend / split / even / oath / toll / locker / reel / echo / blink-seal / gift / fang / cast-mark / still / verse / thin / clean / sniper / ignite / muter / far): pack median.
- Glass (lone, flush, lend, wick, split, body, cast-mark, clean, sniper, ignite, dummy): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 10)

Drop 1–9 overlays still apply. These are **additional jobs** for Wave 9 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-GAIT-MEND` | `bishop` **with** heal | proposed `gait_mender` | `spell-gait-mend`, `starter-frost` | healer; skip if `walkMpSpentThisTurn` missing or 0, or missing HP < 8; shove / hinge / reel **do not** pay |
| `ROLE-PAIR` | `queen` **without** heal | proposed `pair_porter` | `starter-frost`, `spell-pair-hinge` | caster; skip if either dest blocked / lava / pit; caster stays; not `isSwap` |
| `ROLE-FLUSH` | `bishop` **without** heal | proposed `cadence_flusher` | `starter-frost`, `spell-cadence-flush` | buffer (`AI-ROL-05`); Flush **ally**, all remaining CDs → 0, **once/battle**; never verse-steal |
| `ROLE-LONE` | `bishop` or `queen` **without** heal | proposed `lone_stinger` | `starter-frost`, `spell-lone-sting` | artillery; skip the +8 if a Chebyshev-1 same-side hostile exists (Frost) |
| `ROLE-MORROW` | `rook` **without** heal | proposed `morrow_warden` | `physical_attack`, `spell-morrow-plate` | charger; arm now, absorb 10 starts **next own turn**; do not stack with Thin / Plate |
| `ROLE-SEAL` | `pawn` or `bishop` **without** heal | proposed `gait_sealer` | `spell-gait-seal`, `starter-frost` | caster; walk MP = 0, **casts still legal**; never with Root / Muter on PAIR |
| `ROLE-DIAG` | `bishop` **without** heal | proposed `diag_locksmith` | `starter-frost`, `spell-diag-lock` | caster; next walks must be `\|dx\|===\|dy\|`; cardinal confirms fail; spells legal |
| `ROLE-BRICK` | `rook` **without** heal | proposed `brick_shifter` | `physical_attack`, `spell-brick-shift` | setter; slide an **existing** `barrierTiles` cell 1; world walls illegal; never mint Barrier on PAIR |
| `ROLE-WICK-MEND` | `bishop` **with** heal | proposed `wick_mender` | `spell-mend-wick`, `starter-frost` | healer / setter; paint a walkable cell; convert heals occupant 8; not a pit; not Fuse |
| `ROLE-RETURN` | `knight` **without** heal | proposed `return_stinger` | `physical_attack`, `spell-return-sting` | flanker; next applied **hit** → 0 on self, `floor(n/2)` to attacker; DoT / lava do not consume |
| `ROLE-LEND` | `bishop` or `queen` **without** heal | proposed `leftover_lender` | `spell-leftover-lend`, `starter-frost` | buffer; dump **your** leftover AP to an ally; your AP → 0; does not splice the turn |
| `ROLE-DUMMY` | `rook` **without** heal | proposed `dummy_prelate` | `physical_attack`, `spell-dummy-post` | `isSummoner` for dummy only; post `summonAI: "dummypost"`, HP 1, empty kit, Chebyshev-1 taunt; skip if remaining cap < 1; no wolf/archer/pylon/turret/font/bait/span overlay |
| `ROLE-ENTER` | `rook` or `bishop` **with** heal | proposed `enter_mender` | `spell-enter-mend`, `starter-frost` | healer / setter; first **walk-enter** heals 6 once; occupant at paint does not trigger; teleport does not |
| `ROLE-BODY` | `bishop` **without** heal | proposed `body_marker` | `starter-frost`, `spell-body-mark` | caster; next hit on **that unit** ×1.5; they cannot walk it off; skip if already marked |
| `ROLE-SPLIT-MEND` | `bishop` **with** heal | proposed `split_cantor` | `spell-split-mend`, `starter-frost` | healer; 12 split 6/6 with adjacent ally, else full 12; Dummy is usually the wrong adjacent |
| `ROLE-EVEN` | `pawn` or `bishop` **without** heal | proposed `even_warder` | `starter-frost`, `spell-even-stride` | caster; next walk even Manhattan; odd-length confirms fail; distinct from Diag / Axis |
| `ROLE-HOLD` | `knight` **without** heal | proposed `hold_knight` | `physical_attack`, `spell-strike-hold` | flanker; target cannot Strike until they walk; other ids remain legal; never Dull / Oath |
| `ROLE-OATH` | `bishop` **without** heal | proposed `ground_oather` | `starter-frost`, `spell-ground-oath` | caster; next non-Strike spell must target empty/ground; Frost fizzles; Barrier / Pit remain legal |
| `ROLE-TOLL` | `bishop` **without** heal | proposed `walk_toller` | `starter-frost`, `spell-walk-toll` | caster; next walk costs +1 MP; not `spell.mpCost`; one tax with Slow cap −2 |
| `ROLE-LOCKER` | `bishop` **without** heal | proposed `purse_locker` | `starter-frost`, `spell-purse-lock` | caster; leftover AP frozen this/next turn; they may still spend refresh; never Empty Purse |
| `ROLE-ALLY-REEL` | `bishop` **without** heal | proposed `ally_reeler` | `starter-frost`, `spell-ally-reel` | caster; pull 1 toward nearest **ally**; skip if dest worse (lava); second `applyAttract` caller |
| `ROLE-ECHO` | `queen` **without** heal | proposed `echo_painter` | `starter-frost`, `spell-echo-paint` | setter; copy last cinder/rime/mire/void onto a neighbor; skip if no live paint |
| `ROLE-BLINK-SEAL` | `bishop` **without** heal | proposed `blink_sealer` | `starter-frost`, `spell-blink-seal` | caster; 2 turns cannot Swap / Phase Slip / pad / Pawn Trade; walks remain legal |
| `ROLE-GIFT` | `rook` **without** heal | proposed `gift_siller` | `physical_attack`, `spell-gift-sill` | setter; first walk-enter grants 1 leftover MP; teleport does not; never healAmount |
| `ROLE-FANG` | `knight` or `queen` **without** heal | proposed `split_fanger` | `physical_attack`, `spell-split-fang` | artillery / flanker; 16 + 16 iff a second hostile Chebyshev ≤ 1; not a bounce |
| `ROLE-BITE` | `rook` or `pawn` **without** heal | proposed `wall_biter` | `physical_attack`, `spell-wall-bite` | charger; +10 iff target Chebyshev-1 from a **blocking** tile (world wall / unwalkable); planted barrier only if it already `blocksWalk` |
| `ROLE-CAST-MARK` | `bishop` **without** heal | proposed `cast_marker` | `starter-frost`, `spell-cast-mark` | caster; detonates 12 if they cast a **non-Strike** spell; Strike / walk / End Turn do not |
| `ROLE-STILL` | `bishop` **without** heal | proposed `still_leasher` | `starter-frost`, `spell-still-leash` | caster; pause hostile summon lifespan 2 of **its** turns; body stays; skip empty board |
| `ROLE-VERSE` | `bishop` **without** heal | proposed `verse_thief` | `starter-frost`, `spell-pet-verse` | caster; steal 1 CD from a hostile **summon kit**; stolen id is **not** granted; skip player body |
| `ROLE-GHOST` | `knight` **without** heal | proposed `ghost_stepper` | `physical_attack`, `spell-ghost-step` | flanker; next **walk** leaves a 1-turn occupancy ghost on the cell left; teleport does not |
| `ROLE-THIN` | `rook` **without** heal | proposed `thin_warder` | `physical_attack`, `spell-thin-ward` | charger; next incoming spell/Strike capped at 30 after RES/SR; DoT after first tick is not “the next hit” |
| `ROLE-CLEAN` | `bishop` or `queen` **without** heal | proposed `clean_cantor` | `starter-frost`, `spell-clean-blood` | artillery; ignore LoS iff untouched last opposing turn; poke for 1 before the snipe; never healAmount |

Drop-2…9 `ROLE-SPARE` / `ROLE-BOOT` / `ROLE-SNIPER` / `ROLE-FAR` (`far_stinger`) / `ROLE-FAN` / `ROLE-IGNITE` / `ROLE-MUTER` / `ROLE-LANCER` / `ROLE-LOCK` / `ROLE-FUSE` / `ROLE-GOAD` / `ROLE-SMOKE` / `ROLE-OPTIC` / `ROLE-COUP` / `ROLE-ONCE` / `ROLE-SILL` / `ROLE-LURKER` are reused below. Do not also roll the random 12% summoner overlay onto Gait-mend, Porter, Flush, Lone, Morrow, Seal, Diag, Brick, Wick-mend, Return, Lender, Enter, Body, Split-mend, Even, Hold, Oath, Toll, Locker, Reel, Echo, Blink-seal, Gift, Fang, Bite, Cast-mark, Still, Verse, Ghost, Thin, or Clean. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** triple-span **or** spark **or** dummy — never two). Dummy occupies the stationary-post cap (1).

### Fair-fight rules (every sheet)

Same as drops 1–9, plus Wave 9:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, dummy aura that is the only aisle, pair-hinge dest that is the only aisle, or a ghost cell that seals the only aisle.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Gait Mend: heal 8 iff caster walk-MP spent this turn ≥ 1. Missing field → 0. Stand still; it is a Frost bishop.
- Pair Hinge: rotate **both** hostiles 90° around **their** midpoint onto the other two cells of their 2×2. Caster stays. Blocked dest = fizzle. Leave a diagonal stance (the 2×2 has no dest).
- Cadence Flush: ally, every remaining CD → 0, once/battle. Sit with the flushed bar already at 0, or kill the Flusher first.
- Lone Sting: 12, +8 iff 0 Chebyshev-1 same-side hostiles. Clump with a summon or walk adjacent to an enemy body.
- Morrow Plate: absorb 10 starts next own turn. Hit them **this** turn. Unused plate expires. DoTs chew it.
- Gait Seal: cannot spend walk MP; casts still legal. Swap / blink / far gun still work. Never pair with Time Warp.
- Diag Lock: next walks must be diagonal. Cardinal step fails. Spells remain legal. A diagonal gallery is the answer.
- Brick Shift: move an existing barrier 1 Chebyshev. World walls illegal. Player keeps a gallery after the slide.
- Mend Wick: paint 1 turn (walkable). Convert heals occupant 8. Step off before convert, or steal the heal.
- Return Sting: next applied hit → 0 on them, half to you. Do not Strike that body; poke a different one; DoT does not consume.
- Leftover Lend: their leftover AP becomes the ally’s. Spend before their dump, or kill the Lender (glass).
- Dummy Post: 1 HP, empty kit, Chebyshev-1 taunt aura. Targeting the aura hits the post. AoE the post. Far Sting over it is fair. Posts are not `countsTowardKillRewards`.
- Enter Mend: first walk-enter heals 6 once. Do not step on it; teleport does not trigger; steal it if you want the 6.
- Body Mark: unit ×1.5 next hit. Cleanse / Absolve / wait the charge / do not dump Inferno into a fresh mark.
- Split Mend: 12, or 6/6 if an ally is adjacent. Separate them; Dummy is usually the wrong adjacent (1 HP, empty kit).
- Even Stride: next walk even Manhattan. Odd-length confirms fail. Step 1 or 3.
- Strike Hold: Strike is **illegal** until they walk. Other ids resolve. Poke from 4; do not rely on Strike.
- Ground Oath: next non-Strike must target empty/ground. Plant a Barrier / Open Pit; Frost fizzles.
- Walk Toll: next walk +1 MP. Cap with Slow at −2 total. Stand, or pay from a Spare / Haste pool.
- Purse Lock: leftover frozen. Spend at turn start before the freeze, or play a 0-leftover bar.
- Ally Reel: pull 1 toward nearest ally. Dest legality as File Reel. Diagonal-only stance / occupy the dest.
- Echo Paint: copies last paint type onto a neighbor. No live paint → Frost. Dispel / leave the copy.
- Blink Seal: 2 turns no Swap / blink / pad. Walks remain legal. Walk off the file.
- Gift Sill: enter +1 leftover MP. Do not enter; teleport does not grant.
- Split Fang: 16+16 if a second hostile is clustered. Spread. Dummy can be the illegal cluster — intended on Cluster Dummy, never on PAIR.
- Wall Bite: 10+10 if they hug a **blocking** tile. Step Chebyshev-2 from world walls.
- Cast Mark: 12 if they cast a non-Strike. Strike / walk / End Turn are the answer.
- Still Leash: pause pet life 2 of **its** turns. Play without pets, or recast after the pause.
- Pet Verse: steal 1 summon CD. Stolen id is not granted. Empty kit / no pet → skip.
- Ghost Step: vacated cell occupies 1 turn. Plug the ring; teleport does not leave it.
- Thin Ward: next incoming hit capped at 30 after RES. Chip; do not dump one 80.
- Clean Blood: ignore LoS if untouched last opposing turn. Poke for 1 before the snipe.
- One Inferno cadence per pack unless a variant explicitly splits targets. Flush Lend’s restored Inferno is the **Alchemist’s** id after a public all-bar gift — still one cadence, two windows on **their** bar, not a second enemy Inferno.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Wick, Seal, Hold, or Clean sheets. No Time Warp on Seal / Diag / Even / Hold / Flush / Cast-mark windows.
- Summons stay at cap 2. Dummy needs remaining ≥ 1. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop + pointer)

Drops 1–9 union lives in [`ENEMY_FORMATIONS_2026-09-26.md`](./ENEMY_FORMATIONS_2026-09-26.md) (this-drop table) plus the drop-8 union. **Do not reuse those ids.** This drop adds:

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-GAIT-PACE` | PAIR | walked heal + current MP gift | this drop |
| `FSN-LONE-NAIL` | PAIR | isolation poke + walk seal | this drop |
| `FSN-FLUSH-DUMP` | PAIR | all-bar CD gift + leftover AP dump | this drop |
| `FSN-MORROW-POST` | PAIR | delayed plate + 1-HP taunt post | this drop |
| `FSN-PAIR-PEEL` | CELL | pair-hinge + isolation poke + walk seal | this drop |
| `FSN-WICK-SEAL` | CELL | delayed tile heal + walk seal | this drop |
| `FSN-SPLIT-PAD` | CELL | split heal + enter-heal pad | this drop |
| `FSN-GAIT-CHOIR` | BRIGADE | walked heal + spare + walked poke | this drop |
| `FSN-FLUSH-LEND` | BRIGADE | flush + leftover dump + ignite | this drop |
| `FSN-SEAL-FILE` | BRIGADE | walk seal + min-range gun + far sting | this drop |
| `FSN-DIAG-BRICK` | BRIGADE | diagonal jail + slide brick + cone | this drop |
| `FSN-BODY-CAST` | CADRE | unit amp + cast-detonate + coup | this drop |
| `FSN-HOLD-RANGE` | CADRE | Strike-illegal + walk seal + far sting | this drop |
| `FSN-ALLY-WICK` | CADRE | pull-to-ally + copy-paint + fuse | this drop |
| `FSN-BLINK-RANK` | CADRE | cannot-blink + axis lock + file lance | this drop |
| `FSN-PEEL-COURT` | COURT | pair-hinge + isolation gun + cluster gun + seal, leader | this drop |

Named Wave 9 packs that live as **variants** (not new ids): Wick Mend full → `FSN-WICK-SEAL/HINGE`; Split Pad dummy → `FSN-SPLIT-PAD/DUMMY`; Morrow Dummy return → `FSN-MORROW-POST/RETURN`; Gift Boot → `FSN-GAIT-CHOIR/GIFT`; Even Toll → `FSN-HOLD-RANGE/EVEN`; Ground Brick → `FSN-DIAG-BRICK/OATH`; Purse Bell → `FSN-FLUSH-DUMP/PURSE`; Cast Quiet → `FSN-BODY-CAST/ONCE`; Still Sill → `FSN-HOLD-RANGE/STILL`; Ghost Rear → `FSN-LONE-NAIL/GHOST`; Thin Goad → `FSN-MORROW-POST/THIN`; Wall Corridor → `FSN-BLINK-RANK/BITE`; Cluster Dummy → `FSN-ALLY-WICK/FANG`; Clean Fog → `FSN-PEEL-COURT/FOG`.

---

## Formations

### FSN-GAIT-PACE

FORMATION_ID: `FSN-GAIT-PACE`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-GAIT-MEND` — `bishop` / proposed `gait_mender` — pack median — back
- `ROLE-SPARE` — `knight` or `bishop` / proposed `spare_pacer` — pack median — mid, Chebyshev ≥ 3

VARIANT_RULES:

- Band 0: **do not spawn this id** (Gait Mend needs a walk-spend writer **and** a heal kit). Show `FSN-WARD-MEND` band 0 instead.
- Band 1: Mend is legal **only if** `walkMpSpentThisTurn` ≥ 1 **and** missing HP ≥ 8; else Frost. Spare Pace writes **current** walk MP this turn, never persisted `CharacterStats.mp`. Spare does not itself trigger Mend (the Mender must walk).
- Elite: Mender only. Spare stays junior so two elites cannot 8-every-turn a locked aisle.
- Unlock after `FSN-WARD-MEND` **or** `FSN-BOOT-STEP` (player has seen a heal pair **or** a walked poke).
- Random 30% family lottery is **off**. No Boot Sting on PAIR (that is `FSN-GAIT-CHOIR`). No `pale_cantor` / `post_stinger`.
- Heal-first inference is **intended** on the Mender. Spare must not carry `healAmount`.

SPELL_POOL_INTERACTIONS:

- Gait Mend 8 iff the bishop already walked. Stand still and it is a Frost gun. Spare +1 walk MP can **enable** a later Mender walk; it does not count as the Mender’s spend.
- Shove / Pair Hinge / Ally Reel / Dummy plant do not pay. Knight Slip does not pay.

TACTICAL_PLAN:

- Spare offers +1 walk to an ally who needs a step. Mender walks 1, then cashes 8 on the lowest-HP ally under `ENEMY_HEAL_ALLY_THRESHOLD_PCT` (self if no ally is missing 8). If the Mender never walks, this is a soft Frost pair — intended.

SYNERGY:

- Walked heal + current MP gift. Wave 9 Gait Choir minus the Boot gun. You pay the step **or** you deny the 8.

PLAYER_THREAT:

- Readable walk-then-heal. Fail is letting the bishop walk for free. Recoverable: Slow the last tile; Root is a different lesson (`FSN-WIRE-ROOT`).

COUNTERPLAY:

- Keep Chebyshev ≥ 3. Burst the glass Mender (hp ~0.85). Do not stand in Frost LoS while they walk. Spare without a walker is `FSN-BOOT-STEP` minus the poke.

MAP_REQUIREMENTS:

- `openField` or `fortress` courtyard with a gallery. Reject a 1-tile tunnel (forced walk on the only cell is a lock).
- No lava on the Mender’s approach. No Time Warp.

AI_REQUIREMENTS:

- Mender: healer; `aiHint: "heal_if_already_walked"`; VETERAN skip if spend < 1 or missing < 8; CHAMPION never walk **only** to enable this if a Strike from an ally would kill.
- Spare: buffer (`AI-ROL-05`); skip at max MP; never persist `CharacterStats.mp`.
- Soph 1–2.

VARIANTS:

- `FSN-GAIT-PACE/BOOT` — BRIGADE: that is `FSN-GAIT-CHOIR`.
- `FSN-GAIT-PACE/E-GAIT` — elite Mender, still no Boot on PAIR.

STATUS: PROPOSED

---

### FSN-LONE-NAIL

FORMATION_ID: `FSN-LONE-NAIL`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-LONE` — `bishop` / proposed `lone_stinger` — pack median — back, LoS down a **wide** lane
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — mid-front

VARIANT_RULES:

- Band 0: Lone Frost only (isolation +8 off). Seal is a body that will nail on band 1. The lesson is “the gun wants you **alone**; the nail wants your feet still.”
- Band 1: Lone Sting +8 only if 0 Chebyshev-1 same-side hostiles; else Frost. Seal: walk MP = 0, casts legal. Never Root. Never Muter.
- Elite: Lone **or** Seal, never both at PAIR.
- Unlock after `FSN-GLASS-WARD` **or** `FSN-TIDE-LOCK` (min-range gun **or** a kite tax).
- Random 30% family lottery is **off**. No Porter on PAIR (that is `FSN-PAIR-PEEL`). No `split_fanger`. No second gun (`glass_sniper` / `far_stinger` — that is `FSN-SEAL-FILE`).

SPELL_POOL_INTERACTIONS:

- Lone 12 / 20 if you have no Chebyshev-1 ally. Clump with a summon and it is Frost. Seal nails the walk so you cannot close the gap on the gun.
- Casts remain legal on the sealed tile. Far poke / Swap / blink still work.

TACTICAL_PLAN:

- Seal nails if the player is on a file toward the Lone. Lone holds min-feel range 3 and Stings only when isolated. If the player brought a pet, this is a softer Frost pair — intended.

SYNERGY:

- Isolation poke + walk seal. Wave 9 Pair Peel minus the hinge. You clump **or** you walk (and the nail says you cannot).

PLAYER_THREAT:

- Readable two-verb. Fail is standing alone and still. Recoverable: summon body-block; Swap the Seal; poke from 4.

COUNTERPLAY:

- Keep a summon Chebyshev-1. Burst the glass Lone (hp ~0.80). Walk a gallery the Seal does not cover. Do not take the only aisle.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel.
- No Time Warp. No lava on the sealed tile.

AI_REQUIREMENTS:

- Lone: artillery; skip +8 on a clump; refuse dest Chebyshev ≤ 2.
- Seal: caster; will not refresh an already-sealed target; spells remain legal.
- Soph 1–2.

VARIANTS:

- `FSN-LONE-NAIL/HINGE` — CELL: that is `FSN-PAIR-PEEL`.
- `FSN-LONE-NAIL/GHOST` — BRIGADE: add `ROLE-GHOST` + `ROLE-LURKER` (named Ghost Rear). Seal stays. Teleport does not leave a ghost. Rear Cut stays a RARE extra, never CORE.
- `FSN-LONE-NAIL/E-SHOT` — elite Lone, still no Fang on PAIR.

STATUS: PROPOSED

---

### FSN-FLUSH-DUMP

FORMATION_ID: `FSN-FLUSH-DUMP`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-FLUSH` — `bishop` / proposed `cadence_flusher` — pack median — back
- `ROLE-LEND` — `bishop` or `queen` **without** heal / proposed `leftover_lender` — pack median — mid-back

VARIANT_RULES:

- Band 0: **do not spawn this id** (Flush and Lend are not on default kits). Show `FSN-HEX-BLOOD` band 0 instead.
- Band 1: Flush once/battle on an **ally**, all remaining CDs → 0. Lend dumps **the Lender’s** leftover AP onto that ally. Never Flush the player. Never verse-steal. Never Empty Purse / Tempo Gift / Purse Lock on this PAIR.
- Elite: Flush **or** Lend, never both at PAIR.
- Unlock after `FSN-CRACK-VERSE` **or** `FSN-ACT-GIFT` (player has seen a CD rewrite **or** an AP dump).
- Random 30% family lottery is **off**. No Ignite on PAIR (that is `FSN-FLUSH-LEND`). No `cadence_cracker` / `cadence_breaker` / `cadence_thief` / `cadence_lender` / `verse_thief`.

SPELL_POOL_INTERACTIONS:

- Flush restores an ally Inferno / Mark CD. Lend funds that recast from leftover AP. The pair does **not** splice the current turn. Player can spend before the dump, or kill glass.
- One Inferno cadence: the flushed id is the **ally’s**, not a second enemy Inferno on this sheet (no Alchemist yet).

TACTICAL_PLAN:

- Lender holds leftover rather than a last Strike. Flusher dumps the ally bar once. If both bars are already 0, this is a Frost pair — intended.

SYNERGY:

- All-bar CD gift + leftover AP dump. Wave 9 Flush Lend minus the cash-in. You interrupt the gift **or** you eat a recast you already answered.

PLAYER_THREAT:

- Tempo scare, not a nuke. Fail is ignoring the Flusher after you already burned Inferno’s CD. Recoverable: kill glass Lender (hp ~0.75); sit at 0 leftover.

COUNTERPLAY:

- Burst the Flusher first. Spend AP at turn start. Do not dump your own Inferno into a fresh Flush window. Spare Pace is not on this sheet.

MAP_REQUIREMENTS:

- `openField` or `arena`. Reject a sealed pocket. No Time Warp on the Flush window.

AI_REQUIREMENTS:

- Flush: buffer; once/battle; skip a bar of 0s; never target the player.
- Lend: buffer; skip at 0 leftover; never splice.
- Soph 1–2.

VARIANTS:

- `FSN-FLUSH-DUMP/IGNITE` — BRIGADE: that is `FSN-FLUSH-LEND`.
- `FSN-FLUSH-DUMP/PURSE` — BRIGADE: add `ROLE-LOCKER` + `ROLE-TELLER` (`act_teller`) (named Purse Bell). Still one leftover-AP engine (Locker **or** Lend, not both). Flusher stays the CD gift.
- `FSN-FLUSH-DUMP/E-FLUSH` — elite Flusher, still no Ignite on PAIR.

STATUS: PROPOSED

---

### FSN-MORROW-POST

FORMATION_ID: `FSN-MORROW-POST`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-MORROW` — `rook` / proposed `morrow_warden` — pack median + 1 — front
- `ROLE-DUMMY` — `rook` / proposed `dummy_prelate` — pack median — plants **one** 1-HP post

VARIANT_RULES:

- Band 0: Morrow Strike only (plate off). Dummy is a body that will plant on band 1. The lesson is “the plate is **next turn**; the post is the swing they want.”
- Band 1: Morrow arms plate (absorb 10 next own turn). Dummy plants then steps off (VETERAN). Post `summonAI: "dummypost"`, HP 1, empty kit, Chebyshev-1 taunt. Skip if remaining cap < 1. No bait / goad / pylon / span / twin / triple / font / turret / spark overlay.
- Elite: Morrow only. Dummy stays junior so two elites cannot 1-HP-lock an aisle.
- Unlock after `FSN-WALL-HUG` **or** `FSN-SHARE-GOAD` (player has seen a post **or** a taunt).
- Random 30% family lottery is **off**. No Return Sting on PAIR (that is `/RETURN`). No `plate_warden` / `thin_warder` / `morrow_walker`.
- Closet with no Chebyshev-1 around the post → **reroll**.

SPELL_POOL_INTERACTIONS:

- Morrow Plate does nothing **this** turn. Hit them now. Dummy taunt rewrites legal targets to the post if you stand Chebyshev-1. Targeting the post hits 1 HP. Far Sting over the aura is fair.
- Do not also attach Goad on PAIR (that is `/THIN`). Return Sting is CELL+.

TACTICAL_PLAN:

- Dummy plants on the aisle, then steps off. Morrow arms and holds. If the player never stands Chebyshev-1 to the post, this is a fat rook + a 1-HP brick — intended.

SYNERGY:

- Delayed plate + 1-HP taunt post. Wave 9 Morrow Dummy minus the half-return. You swing this turn **or** you eat the plate; you ignore the post **or** you waste a hit on 1 HP.

PLAYER_THREAT:

- Readable delay + bait. Fail is dumping Inferno into a fresh next-turn plate while hugging the post. Recoverable: snipe the post (1 HP); hit Morrow this turn; walk Chebyshev-2.

COUNTERPLAY:

- Kill the post. Burst Morrow before next turn (hp ~1.0 family, not golem 2.5). Do not take the only aisle. Player Chain Lightning into the post is fair.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with ring space. Never a 1-tile closet (needs Chebyshev-1 around the post **and** a walk-off).
- No lava on the plant cell. Placement ring: ≥ 1 free Chebyshev-1, none void.

AI_REQUIREMENTS:

- Morrow: charger; arm then hold; VETERAN skip arm if they will die this round anyway.
- Dummy: summoner / setter; plant then step off; cap 1; fall-through Strike, never skip-lock; `summonAI === "dummypost"` (never `name.includes("dummy")`).
- Soph 1–2.

VARIANTS:

- `FSN-MORROW-POST/RETURN` — CELL: add `ROLE-RETURN` (named Morrow Dummy). Return consumes the swing that must hit the aura. DoT / lava do not consume. Still one post.
- `FSN-MORROW-POST/THIN` — BRIGADE: replace Morrow with `ROLE-THIN` + add `ROLE-GOAD` (named Thin Goad). Dummy stays. **Not** a dummy+goad PAIR — three bodies. Cap 30, force the swing into the post. Never Thin+Morrow on the same sheet.
- `FSN-MORROW-POST/E-PLATE` — elite Morrow, still no Return on PAIR.

STATUS: PROPOSED

---

### FSN-PAIR-PEEL

FORMATION_ID: `FSN-PAIR-PEEL`  
RELATIVE_DIFFICULTY: CELL (kit band 0–1)  
ENEMIES:

- `ROLE-PAIR` — `queen` **without** heal / proposed `pair_porter` — pack median — mid
- `ROLE-LONE` — `bishop` / proposed `lone_stinger` — pack median — back
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — front

VARIANT_RULES:

- Unlock after `FSN-LONE-NAIL` **and** (`FSN-PIVOT-WICK` **or** `FSN-HINGE-GLANCE`) so the player has seen isolation+nail **and** a rotate.
- Band 1: Porter Hinge only if **both** dests are free floor with a walk-off. Lone +8 only on isolation **after** the hinge lands (same AP bar as the hinge is **forbidden** — hinge then next enemy turn Sting). Seal nails the body the Porter just isolated.
- No `hinge_squire` / `pivot_ward` / `pawn_broker` / `hook_chaplain`. No Fang. No Dummy (that is `/FANG` on Ally Wick).
- Elite: Porter only.
- Random 30% family lottery is **off**.

SPELL_POOL_INTERACTIONS:

- Pair Hinge is occupancy dests, not Swap. A diagonal stance (player not sharing a 2×2 with a summon) is a full answer. After a legal hinge, the player may be isolated — that is when Lone cashes. Seal is a walk lock, not a stun.

TACTICAL_PLAN:

- Porter rotates the player off a clump. Seal nails the isolated tile. Lone Stings next activation if still isolated. If the hinge fizzles, this is `FSN-LONE-NAIL` leftover — intended.

SYNERGY:

- Pair-hinge + isolation poke + walk seal. Wave 9 Pair Peel. New experience is **who gets peeled**, not a new sprite.

PLAYER_THREAT:

- Three-verb CELL. Fail is hugging your summon in a 2×2. Recoverable: diagonal stance; clump after the hinge; Swap the Seal.

COUNTERPLAY:

- Stand diagonal to your pet. Burst the Porter (no heal). Keep a tile outside the 2×2. Do not take the only aisle.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with at least one open 2×2 of floor plus a gallery. Reject `ruinsIslands` pockets with no 2×2.
- Hinge dests: not lava / pit / void / portal. Player keeps ≥ 1 escape tile after both land.

AI_REQUIREMENTS:

- Porter: caster; skip blocked / worse dest; CHAMPION never hinge into a sealed pocket.
- Lone: skip +8 until isolation is public.
- Seal: no refresh; spells legal.
- Soph 2–3.

VARIANTS:

- `FSN-PAIR-PEEL/SOLO` — drop Seal (teaching CELL if rootTurns-style seal is not ready). Still no Fang.
- `FSN-PAIR-PEEL/COURT` — COURT: that is `FSN-PEEL-COURT`.

STATUS: PROPOSED

---

### FSN-WICK-SEAL

FORMATION_ID: `FSN-WICK-SEAL`  
RELATIVE_DIFFICULTY: CELL (kit band 0–1)  
ENEMIES:

- `ROLE-WICK-MEND` — `bishop` **with** heal / proposed `wick_mender` — pack median — back
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — mid

VARIANT_RULES:

- Unlock after `FSN-WICK-FACE` **or** `FSN-WARD-MEND` (player has seen a delayed tile **or** a heal pair). Distinct from Pit Wick (`FSN-SLIP-PIT`) — this convert **heals**.
- Band 0: Wick Frost only (paint off). Seal body only.
- Band 1: Wick paints a melee-approach cell that is walkable **now**; convert next turn heals occupant 8. Seal nails them **on** the wick **or** nails them off it (VETERAN: skip nail-on-wick if that donates 8 to the player). Never `wick_painter` / Fuse / Hinge Tile on this CELL. Never Root.
- Elite: Wick only.
- Random 30% family lottery is **off**. Heal-first is **intended** on Wick. Seal must not carry `healAmount`.

SPELL_POOL_INTERACTIONS:

- Mend Wick is delayed **heal**, not damage. Steal it by standing on convert. Seal is a walk lock — if they nail you onto the wick, VETERAN AI must not do that to the player (donating 8). They may nail an ally onto it (`/HINGE`).

TACTICAL_PLAN:

- Wick paints a cell the player wants. Seal threatens the feet. If the player never steps on the wick, this is Frost + a nail — intended.

SYNERGY:

- Delayed tile heal + walk seal. Wave 9 Wick Mend minus the porter. You steal the 8 **or** you leave.

PLAYER_THREAT:

- Soft CELL. Fail is standing still on convert while sealed. Recoverable: step off during the wick window; Swap the Seal.

COUNTERPLAY:

- Leave the cell. Burst glass Wick (hp ~0.85). Barrier last-writer fills a **heal** wick the same way it fills a pit — existing honesty.

MAP_REQUIREMENTS:

- `openField` or `fortress` gallery. Wick cell must not be the only aisle. No lava on the paint. No Time Warp.

AI_REQUIREMENTS:

- Wick: healer / setter; paint then hold; never convert under a sealed **player** at VETERAN.
- Seal: skip nail-on-player-wick; ally-onto-wick is `/HINGE`.
- Soph 2–3.

VARIANTS:

- `FSN-WICK-SEAL/HINGE` — BRIGADE: add `ROLE-PAIR` (named Wick Mend). Rotate an **ally** onto the wick; never rotate the player onto a sealed wick without a walk-off.
- `FSN-WICK-SEAL/FUSE` — forbidden on this id (delayed heal vs delayed damage). That mix is `FSN-ALLY-WICK`.

STATUS: PROPOSED

---

### FSN-SPLIT-PAD

FORMATION_ID: `FSN-SPLIT-PAD`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SPLIT-MEND` — `bishop` **with** heal / proposed `split_cantor` — pack median — back
- `ROLE-ENTER` — `rook` or `bishop` **with** heal / proposed `enter_mender` — pack median — plants one public pad

VARIANT_RULES:

- Band 0: **do not spawn this id** (both verbs need heal kits). Show `FSN-WARD-MEND` instead.
- Band 1: Split 12, or 6/6 if an ally is Chebyshev-1; else full 12 on one body. Enter pad: first **walk-enter** heals 6 once. Occupant at paint does not trigger. Teleport / Swap / hinge landing does not. Never Gift Sill / Exit Boon / Glyph / Pet Sill on this CELL. Never `pale_cantor` / `share_warden`.
- Elite: Split only. Enter stays junior (public pad is stealable — do not elite it).
- Unlock after `FSN-WARD-MEND` **and** (`FSN-BOON-BOOT` **or** `FSN-CAMP-TITHE`) so the player has seen a heal pair **and** a painted pad.
- Random 30% family lottery is **off**. Both bodies are healers — `inferArchetype` healer-first is intended. Dummy is `/DUMMY`, not PAIR.

SPELL_POOL_INTERACTIONS:

- Split Mend wants them adjacent. Separate them and one body eats a 12 (you can focus that body). Enter Mend is a public 6 the **player can steal**. Do not also attach Blood Mend self on the Enter body (double heal identity).

TACTICAL_PLAN:

- Enter paints a pad on an approach. Split holds and mends. If the player never clumps the two bishops, Split is a single 12 on the wounded one — readable.

SYNERGY:

- Split heal + enter-heal pad. Wave 9 Split Pad minus the Dummy. You separate **or** you steal the pad.

PLAYER_THREAT:

- Soft CELL. Fail is hugging both healers on the pad. Recoverable: walk around; take the 6 yourself; burst glass Split (hp ~0.85).

COUNTERPLAY:

- Stay Chebyshev-2 from the ally pair. Step on the pad if you are missing HP (it is public). Kill Enter first if the pad is the only aisle — composer must not make it the only aisle.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery. Pad must not be the only approach. No lava on the pad. No Time Warp.

AI_REQUIREMENTS:

- Split: healer; skip 6/6 if the adjacent ally is Dummy (`/DUMMY` exception: Dummy is the wrong adjacent — skip split, full 12 on a living body).
- Enter: setter; paint a cell the player **can** steal; never the only aisle.
- Soph 2–3.

VARIANTS:

- `FSN-SPLIT-PAD/DUMMY` — BRIGADE: add `ROLE-DUMMY` (named Split Pad full). Dummy is usually the wrong adjacent (1 HP, empty kit) — intended teach. Still one post. Remaining cap ≥ 1.
- `FSN-SPLIT-PAD/STILL` — do not attach here (anti-summon is `FSN-HOLD-RANGE/STILL`).

STATUS: PROPOSED

---

### FSN-GAIT-CHOIR

FORMATION_ID: `FSN-GAIT-CHOIR`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-GAIT-MEND` — `bishop` / proposed `gait_mender` — pack median — back
- `ROLE-SPARE` — `knight` or `bishop` / proposed `spare_pacer` — pack median — mid
- `ROLE-BOOT` — `knight` or `pawn` / proposed `boot_stinger` — pack median + 1 — front

VARIANT_RULES:

- Unlock after `FSN-GAIT-PACE` **and** `FSN-BOOT-STEP`. Wave 9 “Gait Choir.”
- Boot Sting 12 / 22 iff **Boot’s** walk-MP spent ≥ 1. Gait Mend 8 iff **Mender’s** walk-MP spent ≥ 1. Spare can enable **one** of them, not both on the same AP bar.
- No `pale_cantor` / `post_stinger`. No second walk-gun. Forced-move does not pay either bonus.
- Elite: Boot **or** Mender, never both.
- At most one rare: none on BASE. Rare Slow on Spare only at CADRE, and then it counts toward the −2 MP cap.
- Random 30% family lottery is **off**.
- **Skip spawn** until the walk-spend writer exists. Missing field → show `FSN-BOOT-SPARE` / `FSN-WARD-MEND`.

SPELL_POOL_INTERACTIONS:

- Buy the step (Spare), sting (Boot), then cash the walked heal (Mender). Inverse of Post Sting (`FSN-CAMP-TITHE`). One Inferno cadence: none on this sheet.

TACTICAL_PLAN:

- Boot walks 1 and Stings. Spare tops up walk MP. Mender walks if missing HP ≥ 8. If the player roots / seals the front, leftover is `FSN-GAIT-PACE`.

SYNERGY:

- Walked heal + spare + walked poke. The choir **buys** the step. New combination of existing Wave 8 Boot / Spare with Wave 9 Gait Mend.

PLAYER_THREAT:

- BRIGADE walk-economy. Fail is letting both bonuses fire because you Slowed the wrong body. Recoverable: seal **or** root one walker; burst glass Mender.

COUNTERPLAY:

- Gait Seal is **not** on this sheet (that is `FSN-SEAL-FILE`). Slow the Boot’s last tile. Stand still vs Mend. Kill Spare first if they are enabling both.

MAP_REQUIREMENTS:

- `openField` or `asymmetric` with galleries. No 1-tile tunnel. No Time Warp.

AI_REQUIREMENTS:

- Boot: flanker; skip +10 if spend 0; never count Slip / shove as walk (`FSN-BOOT-STEP` honesty).
- Spare / Mender: same as `FSN-GAIT-PACE`.
- Soph 3–4. `chokepointCamp` on Boot. `defensiveRetreat` on Mender below 30%.

VARIANTS:

- `FSN-GAIT-CHOIR/GIFT` — CADRE: replace Mender + Spare with `ROLE-GIFT` + `ROLE-TOLL` (named Gift Boot). Boot stays. Tax the walk, refund on the sill, sting the paid step. Never Gift+Enter on the same sheet. Teleport does not grant the sill.
- `FSN-GAIT-CHOIR/NO-SPARE` — teaching BRIGADE if Spare Pace apply is not ready (Boot + Mender only).

STATUS: PROPOSED

---

### FSN-FLUSH-LEND

FORMATION_ID: `FSN-FLUSH-LEND`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-FLUSH` — `bishop` / proposed `cadence_flusher` — pack median — back
- `ROLE-LEND` — `bishop` or `queen` **without** heal / proposed `leftover_lender` — pack median — mid
- `ROLE-IGNITE` — `queen` **without** heal / proposed `ignite_alchemist` — pack median — back, DoT cash

VARIANT_RULES:

- Unlock after `FSN-FLUSH-DUMP` **and** `FSN-HOOD-CHOIR` (CD gift seen **and** a DoT cash seen). Wave 9 “Flush Lend.”
- Ignite only if matching stacks ≥ 2 (VETERAN). Flush once/battle **before** the cash window so Inferno can re-apply, not so Ignite double-fires the same AP bar. Lend funds the Ignite AP. Never two leftover-AP engines. Never `cadence_cracker` on this sheet.
- One Inferno cadence (Alchemist). Poison Arrow is the apply; Ignite is the cash. Player Cleanse / Absolve / wait ticks is the answer.
- Elite: Alchemist only.
- Random 30% family lottery is **off**. No Glass Realm. No Time Warp on the Flush window.

SPELL_POOL_INTERACTIONS:

- Dump leftover AP, flush Inferno CD, cash stacks. Distinct from Tempo Choir (next-turn +1 AP). Lend is **this** bar.

TACTICAL_PLAN:

- Alchemist applies Poison. Lender holds leftover. Flusher dumps the Alchemist bar once. Ignite on a later activation if stacks ≥ 2. Kill the Alchemist and this is `FSN-FLUSH-DUMP`.

SYNERGY:

- Flush + leftover dump + ignite. Tempo scare with a public cash-in. Not a hardlock: Cleanse strips the stacks.

PLAYER_THREAT:

- BRIGADE burst window. Fail is triple-stacking into a flushed Inferno. Recoverable: Absolve; spread; burst glass Lender / Flusher.

COUNTERPLAY:

- Strip DoTs. Kill Alchemist first (hp ~0.75). Sit at 0 leftover so Lend is Frost. Do not also attach Coup (`FSN-BODY-CAST`).

MAP_REQUIREMENTS:

- `plague_zone`-feel: `openField` or `ruinsIslands` with **galleries** (not isolated pockets). No sealed lava ring.

AI_REQUIREMENTS:

- Ignite: caster; `aiHint: "detonate_if_dot_stacks_ge_2"`; read `stackId` / `dotType`, never names.
- Flush / Lend: same as PAIR; Flush targets the Alchemist, not the player.
- Soph 3–4. `groupTactics` at 4.

VARIANTS:

- `FSN-FLUSH-LEND/RAT` — add a junior `plague_rat` only at CADRE, still one Ignite cadence, still one Slow cap (rats do not also Slow).
- `FSN-FLUSH-LEND/NO-FLUSH` — Lend + Ignite only (if once/battle Flush apply is not ready).

STATUS: PROPOSED

---

### FSN-SEAL-FILE

FORMATION_ID: `FSN-SEAL-FILE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — front
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median — back, minRange 3
- `ROLE-FAR` — `bishop` / proposed `far_stinger` — pack median — opposite back (distance-scaled sting)

VARIANT_RULES:

- Unlock after `FSN-LONE-NAIL` **and** `FSN-GLASS-WARD`. Wave 9 “Seal File.”
- Two guns **plus** a nail is legal at BRIGADE because the nail is the third verb (drop-9 law: no two guns as PAIR without a lock third). Seal is that lock. Never a third gun. Never Lone on this sheet (isolation is `FSN-LONE-NAIL` / Peel).
- Sniper Mark is the **one** rare, CADRE only, never with Inferno / `starter-blast`. Far Sting is existing Wave 4 distance-scaled poke — no new formula.
- Elite: Sniper **or** Far, never both.
- Random 30% family lottery is **off**. Never Seal+Root+Muter. Casts remain legal.

SPELL_POOL_INTERACTIONS:

- Nail feet, then out-range. Sniper dies if caught (hp ~0.60). Far punishes the walk you cannot take. Swap / blink / far player gun still work.

TACTICAL_PLAN:

- Seal nails the file toward the Sniper. Sniper Frosts at 3–4. Far pokes the sealed body. If Seal dies, leftover is `FSN-GLASS-WARD` plus a junior Far.

SYNERGY:

- Walk seal + min-range gun + far sting. Controller + artillery, re-keyed as a **nail** instead of Slow (`FSN-TIDE-STORM`).

PLAYER_THREAT:

- BRIGADE kite. Fail is walking the file into both guns while sealed. Recoverable: gallery; Swap the Seal; burst glass Sniper.

COUNTERPLAY:

- Walk a side aisle. Summon body-block. Kill Seal first. Diagonal-only stance vs a rank gun.

MAP_REQUIREMENTS:

- `fortress` / `chessboard` with a 4-tile file **plus** a gallery. Weight 0 on 1-tile closets. No Time Warp.

AI_REQUIREMENTS:

- Seal: no refresh; spells legal.
- Sniper: refuse dest Chebyshev ≤ 2.
- Far: artillery; skip if Chebyshev ≤ 1 (that is melee, not Far).
- Soph 3–4. `chokepointCamp` on Seal.

VARIANTS:

- `FSN-SEAL-FILE/LONE` — replace Far with Lone (still one isolation gun, still the nail). Softer if Far apply is not ready.
- `FSN-SEAL-FILE/NO-MARK` — Sniper Frost only.

STATUS: PROPOSED

---

### FSN-DIAG-BRICK

FORMATION_ID: `FSN-DIAG-BRICK`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-DIAG` — `bishop` / proposed `diag_locksmith` — pack median — mid
- `ROLE-BRICK` — `rook` / proposed `brick_shifter` — pack median + 1 — front, needs an **existing** barrier
- `ROLE-FAN` — `bishop` or `queen` **without** heal / proposed `fan_prelate` — pack median — back, cone on a spoke

VARIANT_RULES:

- Unlock after `FSN-WALL-HUG` **or** `FSN-FILE-GUARD` (player has seen a planted wall **or** a file lock). Wave 9 “Diag Brick.”
- Diag Lock: next walks `|dx|===|dy|`. Brick Shift slides an existing `barrierTiles` cell 1 onto a **diagonal spoke**, never mint Barrier on BASE (Pylon / Hug remain the planters — if no barrier exists, Brick Frosts / Strikes). Fan cone only if `areaShape` reader **or** `hitTiles` honesty exists; else Frost (`/FROST`).
- No `axis_locksmith` / `even_warder` / `misstep_herald` / `hinge_mason`. One cone. One brick.
- Elite: Diag **or** Fan, never both.
- Random 30% family lottery is **off**. Closet with no diagonal gallery → **reroll**.

SPELL_POOL_INTERACTIONS:

- Diagonal jail, then slide the brick onto a spoke, then Fan the spoke. Cardinal walk fails; diagonal gallery is the answer. World walls are **not** Brick sources.

TACTICAL_PLAN:

- Brick needs a planted cell (from a prior Hug leftover, a map barrier if the composer is allowed to treat **spell** barriers only — **not** world walls —, or skip Brick until a Pylon escort at CADRE). Diag paints the lock. Fan holds the remaining spoke.

SYNERGY:

- Diagonal jail + slide brick + cone. Hazard creator + displacement of the **wall**, not the player. Distinct from `FSN-WALL-FILE` (hug-gun + pylon + brand).

PLAYER_THREAT:

- Geometry BRIGADE. Fail is cardinal-walking into a slid brick + cone. Recoverable: walk diagonal; kill Brick before the slide.

COUNTERPLAY:

- Diagonal step. Burst glass Fan. Dispel / wait the barrier. Do not stand on the only spoke.

MAP_REQUIREMENTS:

- `fortress` / `chessboard` with a diagonal gallery **and** at least one `barrierTiles` cell **or** a legal Pylon escort. No diagonal spoke → **reroll**. No Time Warp.

AI_REQUIREMENTS:

- Diag: caster; skip if they already must walk diagonal (waste).
- Brick: setter; skip if no `barrierTiles`; skip a slide that seals the only gallery.
- Fan: artillery; skip cone without a spoke (`AI-TEM-05` honesty).
- Soph 3–4.

VARIANTS:

- `FSN-DIAG-BRICK/OATH` — CADRE: replace Fan with `ROLE-OATH` + `ROLE-ECHO` (named Ground Brick). Next spell must be ground; slide / copy the paint they are forced to use. Frost fizzles. Still one brick. Never Oath+Pit/Origin PAIR.
- `FSN-DIAG-BRICK/FROST` — no cone; ship if `hitTiles` cone is not ready.
- `FSN-DIAG-BRICK/PYLON` — CADRE: add `ROLE-PYLON` so Brick has a source wall. Still one post.

STATUS: PROPOSED

---

### FSN-BODY-CAST

FORMATION_ID: `FSN-BODY-CAST`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-BODY` — `bishop` / proposed `body_marker` — pack median — back
- `ROLE-CAST-MARK` — `bishop` / proposed `cast_marker` — pack median — back
- `ROLE-COUP` — `knight` / proposed `coup_duelist` — pack median + 1 — front

VARIANT_RULES:

- Unlock after `FSN-ROT-CUT` **and** `FSN-CRACK-VERSE` (DoT/amp seen **and** a recast lock seen). Wave 9 “Body Cast.” **Not** a body+cast PAIR — three bodies.
- Body Mark ×1.5 next **hit** on that unit. Cast Mark detonates 12 if they cast a **non-Strike**. Coup instant at ≤25% HP (not Bell, not `instantKill`). Never Body+Cast without Coup (that PAIR is banned). Never `glyph_sower` / Bell / Jackal on this sheet.
- Heal above 25% is the Coup answer. Strike / walk / End Turn is the Cast Mark answer. Absolve / wait is the Body Mark answer.
- Elite: Coup only.
- Leader optional (`isLeader` on Coup). Boost 10% per fallen escort.
- Random 30% family lottery is **off**. No Glass Realm. No Time Warp on the mark window.
- Absorb is **not** HP — Ward Plate can fake a healthy bar (`FSN-PLATE-LINK` leftover). Coup must read HP%, not absorb.

SPELL_POOL_INTERACTIONS:

- Amp the unit, punish the cast, Coup the window. Distinct from `FSN-MARK-CONFLAGRATION` (tile Mark × Inferno). Body Mark does not amp Cast Mark’s 12 (Cast Mark is a detonate, not a “hit” — SPELL_PROPOSALS honesty). Confirm before ship; if live apply would double-dip, Cast Mark does not consume Body Mark.

TACTICAL_PLAN:

- Body marks the player. Cast marks if they still have a non-Strike they want. Coup paths to 1 and waits for ≤25%. If the player only Strikes, Cast Mark never fires — intended.

SYNERGY:

- Unit amp + cast-detonate + coup. Debuffer + finisher, re-keyed as **cast punish** instead of DoT wait (`FSN-ROT-CUT`).

PLAYER_THREAT:

- CADRE execute window. Fail is nuking at 20% into a waiting Coup while a Cast Mark is live. Recoverable: mend above 25%; Strike-only turns; kill glass Body (hp ~0.80).

COUNTERPLAY:

- Heal. Alternate ids (Once Verse is `/ONCE`, not CORE here). Slow the Coup’s last tile. Do not dump Inferno into a fresh Body Mark.

MAP_REQUIREMENTS:

- `arena` / `openField` with a flank path for Coup. No surround pocket. Player keeps ≥ 1 walk-off.

AI_REQUIREMENTS:

- Body: skip if already marked.
- Cast-mark: skip if they will only Strike (planted caster with no gun → Frost).
- Coup: VETERAN skip Coup if HP% > 25; ELITE hunt the marked body; never `instantKill` gate.
- Soph 4–6. `groupTactics` on. `escapeRoute` on wounded Coup.

VARIANTS:

- `FSN-BODY-CAST/ONCE` — add `ROLE-ONCE` + `ROLE-OATH` (named Cast Quiet). Mark the cast, lock recast, force a ground id. Still no Body+Cast PAIR leftover if Coup dies (composer should retreat the remaining pair or reroll).
- `FSN-BODY-CAST/NO-COUP` — BRIGADE-shaped if instant execute is not ready (Body + Once only — **not** Body+Cast).

STATUS: PROPOSED

---

### FSN-HOLD-RANGE

FORMATION_ID: `FSN-HOLD-RANGE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-HOLD` — `knight` / proposed `hold_knight` — pack median + 1 — front
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median — mid
- `ROLE-FAR` — `bishop` / proposed `far_stinger` — pack median — back

VARIANT_RULES:

- Unlock after `FSN-SEAL-FILE` **and** `FSN-DULL-PET` (nail+gun seen **and** Strike-0 seen). Wave 9 “Hold Range.” Distinct from Dull (Strike deals **0**): here Strike is **illegal** until they walk, and Seal says they cannot walk.
- Other ids remain legal (Frost / Swap / summon). Never Hold+Dull+Oath. Never Seal+Root+Muter.
- Elite: Hold **or** Far, never both.
- Leader optional on Hold.
- Random 30% family lottery is **off**. Casts remain legal. Far is the tax for “I will not walk.”

SPELL_POOL_INTERACTIONS:

- Strike illegal until they walk; feet nailed so they cannot pay; Far punishes the stand. The designed answer is a **non-Strike** id from 4, or Swap the Seal, or kill Hold.

TACTICAL_PLAN:

- Hold paints Strike-hold on the player. Seal nails. Far pokes. If the player walks (Seal dead), Hold’s lock expires and this is a Far leftover.

SYNERGY:

- Anti-melee + controller + artillery. New combination: the lock is **on Strike**, the nail is **on walk**, the gun is **on distance**.

PLAYER_THREAT:

- CADRE action-economy. Fail is trying to Strike out of a nail. Recoverable: poke; summon; Swap.

COUNTERPLAY:

- Do not Strike. Burst glass Far. Kill Seal to pay the walk. Guardian summon body-blocks Far LoS.

MAP_REQUIREMENTS:

- `fortress` / `chessboard` file + gallery. No Time Warp. No sealed pocket.

AI_REQUIREMENTS:

- Hold: skip if they will not Strike (already a caster player — Frost / reposition).
- Seal / Far: same as `FSN-SEAL-FILE`.
- Soph 4–6. `bottleneckControl` only if a gallery exists.

VARIANTS:

- `FSN-HOLD-RANGE/EVEN` — replace Hold + Far with `ROLE-EVEN` + `ROLE-TOLL` + `ROLE-MUTER` (named Even Toll). Even Manhattan, then tax the remaining even step, then fizzle-if-walked. **Never** Even+Diag+Axis on the same sheet. Never Seal+Muter PAIR leftover — this variant **drops** Seal.
- `FSN-HOLD-RANGE/STILL` — replace Far with `ROLE-STILL` + `ROLE-SILL` + `ROLE-VERSE` (named Still Sill). Pause the pet, forbid its next cell, steal its CD. Skip if the player brought no pets (composer emits `FSN-DULL-PET` instead). Never Still+Cut+Null PAIR.

STATUS: PROPOSED

---

### FSN-ALLY-WICK

FORMATION_ID: `FSN-ALLY-WICK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-ALLY-REEL` — `bishop` / proposed `ally_reeler` — pack median — mid
- `ROLE-ECHO` — `queen` **without** heal / proposed `echo_painter` — pack median — back
- `ROLE-FUSE` — `queen` **without** heal / proposed `fuse_binder` — pack median — back, delayed **tile** bomb

VARIANT_RULES:

- Unlock after `FSN-WICK-SEAL` **and** `FSN-EMBER-RIFT` (delayed tile seen **and** a pull legality seen). Wave 9 “Ally Wick.”
- Ally Reel pulls 1 toward nearest **ally** (not the caster — that is File Reel / `FSN-BRAND-REEL`). Echo copies last fuse/cinder/rime onto a neighbor. Fuse deals **0 on cast**, ticks occupancy. Never Reel+File/Hook/Sink PAIR. Never Echo+Ember/Fuse/Glyph PAIR — Fuse is the **third** body here (the CADRE lesson).
- Dest / fuse cell: free floor, not lava / void / portal, player keeps ≥ 1 escape tile. Teleport-off works; walk-on at tick does not. Killing the Binder does **not** cancel (SPELL_PROPOSALS).
- Elite: Fuse only.
- Leader optional on Fuse.
- Random 30% family lottery is **off**. No Glass Realm. Cap 2 live fuses max; never two on one cell.

SPELL_POOL_INTERACTIONS:

- Pull toward the ally, onto copied paint / fuse. Distinct from `FSN-GRAVITY-TAX` (pull + slam + zone tax) and `FSN-WICK-FACE` (pit wick + shove-face + fuse).

TACTICAL_PLAN:

- Fuse paints a cell. Echo copies onto a neighbor if the first cell is abandoned. Reel pulls toward the Binder / Echo (nearest ally). If the player never shares a file with the ally, Reel Frosts — intended.

SYNERGY:

- Pull-to-ally + copy-paint + fuse. Hazard creator + displacement specialist. The hole is the **ally**, not a hook.

PLAYER_THREAT:

- CADRE occupancy clock. Fail is standing on a copied wick at tick. Recoverable: step off; Swap the Binder onto their wick; diagonal vs Reel.

COUNTERPLAY:

- Leave the cell. Kill Echo (no paint to copy). Occupy the dest. Burst glass Echo (hp ~0.80).

MAP_REQUIREMENTS:

- `void_rift`-feel corridor **or** `fortress` gallery with two adjacent paint cells. No 1-tile closet. Fuse cell must have a walk-off.

AI_REQUIREMENTS:

- Reel: skip if dest safer for the player; second `applyAttract` caller; dest legality as File Reel.
- Echo: skip if no live paint.
- Fuse: VETERAN skip if player MP ≥ 3 and an open ring exists; ELITE fuse a cell an ally reel already owns.
- Soph 4–6.

VARIANTS:

- `FSN-ALLY-WICK/FANG` — BRIGADE: replace Fuse + Echo with `ROLE-FANG` + `ROLE-DUMMY` (named Cluster Dummy). Pull onto the post, then 16+16 the clump. Still one post. Never Fang+Lone PAIR. Remaining cap ≥ 1. Closet with no Chebyshev-1 around the post → **reroll**.
- `FSN-ALLY-WICK/NO-ECHO` — Reel + Fuse only (if copy-paint is not ready).

STATUS: PROPOSED

---

### FSN-BLINK-RANK

FORMATION_ID: `FSN-BLINK-RANK`  
RELATIVE_DIFFICULTY: CADRE (kit band 1–2)  
ENEMIES:

- `ROLE-BLINK-SEAL` — `bishop` / proposed `blink_sealer` — pack median — mid
- `ROLE-LOCK` — `bishop` / proposed `axis_locksmith` — pack median — mid-back
- `ROLE-LANCER` — `rook` / proposed `rank_lancer` — pack median + 1 — front, file only

VARIANT_RULES:

- Unlock after `FSN-FILE-GUARD` **and** (`FSN-MIST-HUNT` **or** `FSN-SLIP-PIT`) so the player has seen a file **and** a blink. Wave 9 “Blink Rank.”
- Blink Seal: 2 turns no Swap / Phase Slip / pad / Pawn Trade. Walks remain legal. Axis Lock: next walks rank XOR file (existing Wave 4). Lancer: linear approach (`AI-SYS-06`). Never Blink-seal+Mist/Anchor/Slip PAIR. Never two walk-shape locks (no Diag / Even on this sheet).
- Elite: Lancer only.
- Leader optional on Lancer.
- Random 30% family lottery is **off**. Reroll on maps with no 4-tile file.

SPELL_POOL_INTERACTIONS:

- Cannot blink the axis lock, then the file lance punishes the remaining rank/file. Walk a **diagonal** (legal under Axis; Lancer cannot follow off-file).

TACTICAL_PLAN:

- Seal paints blink-lock. Lock paints axis. Lancer approaches on the shared file. If the player never blinks, Seal is a Frost bishop — intended (the lock+lance is `FSN-FILE-GUARD` leftover).

SYNERGY:

- Anti-teleporter + walk-axis lock + file lance. Controller + artillery on a **file**, with blink denied.

PLAYER_THREAT:

- CADRE file. Fail is blinking into the lance after the seal expired while still axis-locked. Recoverable: diagonal walk; burst glass Seal.

COUNTERPLAY:

- Walk diagonal. Kill Seal first if you need Swap. Plug the file with a summon. Do not take the only rank.

MAP_REQUIREMENTS:

- `chessboard` / `fortress` 4-tile file **plus** a diagonal gallery. Tiny `ruinsIslands` pockets → **reroll**. No Time Warp.

AI_REQUIREMENTS:

- Blink-seal: skip if the player has no blink / Swap in kit (Frost).
- Lock: existing axis honesty (spells legal).
- Lancer: charger; approach only along shared x or y.
- Soph 4–6. `chokepointCamp` on Lancer.

VARIANTS:

- `FSN-BLINK-RANK/BITE` — replace Blink-seal with `ROLE-BITE` (named Wall Corridor). Force the wall hug, cash the blocking-tile bonus, keep Lancer + Axis. Never Bite+Hug-gun PAIR. World walls / unwalkable count; planted barrier only if it already `blocksWalk`.
- `FSN-BLINK-RANK/NO-SEAL` — Lock + Lancer only (BRIGADE-shaped if blink-seal apply is missing) — that is `FSN-FILE-GUARD` leftover; prefer emitting that id.

STATUS: PROPOSED

---

### FSN-PEEL-COURT

FORMATION_ID: `FSN-PEEL-COURT`  
RELATIVE_DIFFICULTY: COURT (kit band 2)  
ENEMIES:

- `ROLE-PAIR` — `queen` **without** heal / proposed `pair_porter` — pack median — mid, `isLeader`
- `ROLE-LONE` — `bishop` / proposed `lone_stinger` — pack median — back
- `ROLE-FANG` — `knight` or `queen` **without** heal / proposed `split_fanger` — pack median — opposite flank
- `ROLE-SEAL` — `pawn` or `bishop` / proposed `gait_sealer` — pack median + 1 — front

VARIANT_RULES:

- Unlock after `FSN-PAIR-PEEL` **and** a leader-boost CADRE (`FSN-BODY-CAST` / `FSN-HOLD-RANGE` / `FSN-ALLY-WICK` / `FSN-BLINK-RANK` / any older leader CADRE). Wave 9 “Peel Court” — isolation **and** cluster guns in one pack, **never** as a two-body PAIR.
- **One gun per activation.** Porter rotates. If the player clumps (summon Chebyshev-1 **or** Dummy leftover), Fang may cash 16+16. If isolated, Lone may cash +8. Same AP bar as both guns is **forbidden**. Seal nails the post-hinge tile.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Porter walks to the gallery, not through the player.
- One elite only: the Porter-leader. Guns stay junior so boost is the late scare, not three elites.
- No Dummy on BASE (Cluster Dummy is `FSN-ALLY-WICK/FANG`). No second hinge engine. Dungeon depth may not add a fifth hostile to this id.
- Random 30% family lottery is **off**. Court Hinge may witness on CHAMPION Porter only — never CORE.

SPELL_POOL_INTERACTIONS:

- Pair Hinge occupancy dests. Lone isolation +8. Fang cluster +16. Seal walk lock, casts legal. `spell-rallying-cry` stays false. Leader boost 10% × fallen escort.

TACTICAL_PLAN:

- Turn 1–2: Porter threatens a 2×2. Seal nails a file. Lone and Fang hold opposite answers. If the player stays diagonal to their pet **and** off the file, both guns Frost — intended (COURT is the **choice**, not unavoidable damage).
- If Porter dies, leftover is `FSN-LONE-NAIL` **or** a junior Fang, never both still at COURT pressure (guns lose `groupTactics` when the leader is gone — proposed).

SYNERGY:

- Pair-hinge + isolation gun + cluster gun + seal. The sophistication is **which gun is live**, not a new monster. Higher progression unlocks this composition after Pair Peel.

PLAYER_THREAT:

- Highest decision-structured threat in this drop. Still turn-based. Failure is hugging a pet in a 2×2 on a sealed file. Guns are glass.

COUNTERPLAY:

- Diagonal stance vs the pet. Burst Porter (leader). Snipe Lone (hp ~0.80). Spread vs Fang. Walk a gallery. Player keeps ≥ 1 walk-off after every hinge.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with an open 2×2 **plus** a file the player can refuse. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Hinge dests free, non-void. Player must have a tile off the 2×2.

AI_REQUIREMENTS:

- Porter: leader; skip blocked dest; CHAMPION never hinge into a sealed pocket; Court Hinge kit-only at CHAMPION, never world CORE.
- Lone: skip +8 unless isolation is public **this** activation.
- Fang: skip +16 unless a second hostile Chebyshev ≤ 1 **this** activation; never bounce.
- Seal: no refresh; spells legal.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Porter.
- Proposed: escorts do not path a closed box. After leader death, remaining guns do not both cash the same round.

VARIANTS:

- `FSN-PEEL-COURT/FOG` — replace Fang with `ROLE-CLEAN` + `ROLE-SMOKE` + `ROLE-OPTIC` (named Clean Fog). Untouched LoS ignore through smoke, then range-shrink. **Poke for 1** before the snipe. Never Clean+Sniper+Corner PAIR. Still four bodies? Composer should drop Seal **or** Porter — cap 4 hostiles. Preferred: Porter + Clean + Smoke + Optic (drop Seal and both Wave 9 guns).
- `FSN-PEEL-COURT/NO-FANG` — teaching COURT without cluster (Pair Peel + leader). Prefer emitting leader `FSN-PAIR-PEEL` if Fang apply is not ready.
- `FSN-PEEL-COURT/NO-LEADER` — teaching COURT without boost.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–9 still stand. This drop **meshes**; it does not replace.

```
PAIR:    GAIT-PACE          LONE-NAIL           FLUSH-DUMP          MORROW-POST
              \                 |                    |                    /
CELL:     (Gait Choir teach) PAIR-PEEL         WICK-SEAL         SPLIT-PAD
              \                 |                    |                    /
BRIGADE:  GAIT-CHOIR       SEAL-FILE         FLUSH-LEND         DIAG-BRICK
              \                 |                    |                    /
CADRE:    HOLD-RANGE       BODY-CAST      ALLY-WICK     BLINK-RANK     (WICK-SEAL/HINGE)
              \                 |                    |                    /
COURT:                         PEEL-COURT
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-GAIT-PACE` | `FSN-WARD-MEND` **or** `FSN-BOOT-STEP` |
| `FSN-LONE-NAIL` | `FSN-GLASS-WARD` **or** `FSN-TIDE-LOCK` |
| `FSN-FLUSH-DUMP` | `FSN-CRACK-VERSE` **or** `FSN-ACT-GIFT` |
| `FSN-MORROW-POST` | `FSN-WALL-HUG` **or** `FSN-SHARE-GOAD` |
| `FSN-PAIR-PEEL` | `FSN-LONE-NAIL` + (`FSN-PIVOT-WICK` **or** `FSN-HINGE-GLANCE`) |
| `FSN-WICK-SEAL` | `FSN-WICK-FACE` **or** `FSN-WARD-MEND` |
| `FSN-SPLIT-PAD` | `FSN-WARD-MEND` + (`FSN-BOON-BOOT` **or** `FSN-CAMP-TITHE`) |
| `FSN-GAIT-CHOIR` | `FSN-GAIT-PACE` + `FSN-BOOT-STEP` |
| `FSN-FLUSH-LEND` | `FSN-FLUSH-DUMP` + `FSN-HOOD-CHOIR` |
| `FSN-SEAL-FILE` | `FSN-LONE-NAIL` + `FSN-GLASS-WARD` |
| `FSN-DIAG-BRICK` | `FSN-WALL-HUG` **or** `FSN-FILE-GUARD` |
| `FSN-BODY-CAST` | `FSN-ROT-CUT` + `FSN-CRACK-VERSE` |
| `FSN-HOLD-RANGE` | `FSN-SEAL-FILE` + `FSN-DULL-PET` |
| `FSN-ALLY-WICK` | `FSN-WICK-SEAL` + `FSN-EMBER-RIFT` |
| `FSN-BLINK-RANK` | `FSN-FILE-GUARD` + (`FSN-MIST-HUNT` **or** `FSN-SLIP-PIT`) |
| `FSN-PEEL-COURT` | `FSN-PAIR-PEEL` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 10 packs and leftover spell verbs (not this drop)

Sibling [`docs/automation/SPELL_PROPOSALS_2026-09-26.md`](../automation/SPELL_PROPOSALS_2026-09-26.md) (open as PR #636) stamped Wave 9 verbs that **still have no family**. Elite-evolution Wave 9 left those for Wave 10. This catalog does **not** mint `FSN-*` ids that require Wave 9 tactical verbs.

SDE Wave 8 unique CORE (`spell-odd-stride` … `spell-about-hinge`) stay G≥8 extras on older families until a dedicated Wave 10 family pass exists.

Do **not** pack `lone_stinger` with `split_fanger` as a teaching pair. `FSN-LONE-NAIL` stays the isolation lesson; `FSN-ALLY-WICK/FANG` stays the cluster lesson; `FSN-PEEL-COURT` is the only sheet that may field both guns.

Court Hinge / Pack Still / File Fold / Must Pace / Court Shove stay boss / closed-class. Court Hinge may witness on CHAMPION `pair_porter` only.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–9, plus Wave 9 verbs in this order (from elite-evolution Wave 9 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128 / 270–271).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse. Gait-mend / Wick-mend / Enter / Split-mend **must** be healer profiles. Porter / Flush / Lone / Morrow / Seal / Diag / Brick / Return / Lend / Dummy / Body / Even / Hold / Oath / Toll / Locker / Reel / Echo / Blink-seal / Gift / Fang / Bite / Cast-mark / Still / Verse / Ghost / Thin / Clean **must not** carry `starter-heal`.
4. **Battle-walk walk-MP spent writer** — hard gate for every Gait Mend / Ghost Step / Boot escort sheet. Forced-move / Swap / Slip / Pivot / Pair Hinge / Ally Reel / Dummy plant **does not** increment. Missing field fail closed (Mend 0 / Ghost no occupancy / Boot 12 only).
5. Pair Hinge occupancy dests (not `isSwap`) + dest legality. Ally Reel `applyAttract` caller toward nearest **ally** (File Reel remains the first attract caller). Dummy `summonAI: "dummypost"` allow-list (admin + `inferSummonArchetype` key, never `name.includes("dummy")`) + summoner fall-through + skip if remaining cap < 1. Posts are not `countsTowardKillRewards`.
6. Ally buff apply (`targetId` on Shield / Iron Skin / Spare Pace / Cadence Flush / Leftover Lend / Split Mend). Flush once/battle ally all remaining CDs → 0 (never copy, never Flush the player, never reset Flush itself).
7. Gait Seal `rootTurns`-style walk lock with **casts legal**. Diag Lock walk filter `|dx|===|dy|`. Even Stride even-Manhattan confirm. Strike Hold makes `physical_attack` **illegal** (not 0). Ground Oath targeting reject on unit primary. Blink Seal blocks Swap / blink / pad only.
8. Morrow Plate absorb starts **next own turn** (not now). Thin Ward incoming cap 30 after RES in the hit pipeline — do not rewrite `computeDamage` percents. Return Sting stores applied hit, deals 0 to self, pokes `floor(n/2)` back; DoT / lava do not consume.
9. Mend Wick delayed convert heals occupant (not `pitTiles`, not Fuse). Enter Mend first **walk-enter** 6; paint occupant does not trigger. Gift Sill enter +MP; teleport does not. Brick Shift slides existing `barrierTiles` 1; world walls illegal.
10. Body Mark unit ×1.5 next hit. Cast Mark detonates on **non-Strike** cast only. Echo Paint copies last paint type. Fuse occupancy tick unchanged (`FSN-EMBER-RIFT` honesty). Coup HP% ≤ 25, not absorb, not `instantKill`.
11. Cap the summoner overlay (`WX` 11932–11942). COURT dummy / peel sheets assume the lottery does not add a second engine.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order splices, or damage-formula edits. Map **selection** is a filter on already generated maps. Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-GAIT-PACE`, `FSN-GAIT-CHOIR` | walk-MP spent writer; shove / hinge do not pay Mend or Boot; Spare does not persist `CharacterStats.mp` |
| `FSN-LONE-NAIL`, `FSN-PAIR-PEEL`, `FSN-SEAL-FILE` | isolation Chebyshev-1 scan; Gait Seal leaves casts legal; Pair Hinge dest occupancy + walk-off |
| `FSN-FLUSH-DUMP`, `FSN-FLUSH-LEND` | once/battle ally all-CD → 0; Leftover Lend does not splice; Ignite stack gate ≥ 2 |
| `FSN-MORROW-POST` | next-turn absorb; `summonAI === "dummypost"`; remaining cap ≥ 1; empty-kit post |
| `FSN-WICK-SEAL` | delayed **heal** convert (not pit / Fuse); VETERAN no nail-on-player-wick |
| `FSN-SPLIT-PAD` | Split 6/6 only if living adjacent ally; Enter first walk-enter; teleport does not trigger |
| `FSN-DIAG-BRICK` | Diag walk filter; Brick source is `barrierTiles` not world walls; cone `hitTiles` or Frost-only |
| `FSN-BODY-CAST` | Body Mark unit-scoped; Cast Mark non-Strike only; Coup HP% not absorb |
| `FSN-HOLD-RANGE` | Strike **illegal** until walk; Seal leaves other ids legal; Far skip at Chebyshev ≤ 1 |
| `FSN-ALLY-WICK` | attract toward **ally**; Echo requires live paint; Fuse 0 on cast, dest legality |
| `FSN-BLINK-RANK` | Blink Seal blocks Swap/blink/pad only; Axis spells legal; Lancer file-only |
| `FSN-PEEL-COURT` | one gun per activation; hinge dest legality; leader cuttable; no fifth body |

---

## Sources (line-accurate, 2026-09-27)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 202–221, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942; zone object 4683–4687
- Family lottery + HP overwrite: `spawnPolicy.ts` 35, 49–57, 69–128, 261–271; WX 5864–5866, 11970–11974
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16819
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 336–337
- Push / attract (no caller): `src/frontend/src/engine/occupancy.ts` 482, 537; portals impassable at 40
- Cast AP-only: `WorldExploration.tsx` `executeCastAttempt` 17096+
- Trap-as-barrier: `src/frontend/src/engine/spellEngine.ts` 442–445
- Area Chebyshev: `src/frontend/src/engine/targeting.ts` 690–727 (`spell.diagonal` at 712)
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 266–301
- Families / `currentView`: `src/frontend/src/types/gameTypes.ts` 12–20, 297; overworld wander writer WX 6924–6938
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–291)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 9 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-26.md` (PR #625) §3–§4
- Wave 8 spell verbs this drop consumes: `docs/automation/SPELL_PROPOSALS_2026-09-25.md` (PR #563)
- SDE Wave 7 unique CORE this drop consumes: `docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md` (PR #533)
- Wave 9 spell verbs (unfamilied — not this drop): `docs/automation/SPELL_PROPOSALS_2026-09-26.md` (PR #636)
- Drop 9: `docs/design/ENEMY_FORMATIONS_2026-09-26.md` (PR #612)

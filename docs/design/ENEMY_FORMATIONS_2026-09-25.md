# Enemy synergy and formation catalog (drop 8)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-25  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–7 already taught the seven pairing words and Waves 1–6 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 7 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-24.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (open as PR #535) and deferred by drop 7 (PR #537): Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4, Wave 3 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5, Wave 4 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6, Wave 5 — open as PR #459), [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (drop 7, Wave 6 — open as PR #537). Family sheets: PR #535. Spell verbs: Wave 6 tactical ids in PR #463 (`spell-post-sting` … `spell-turn-cap`).

**Hard rules (Wave 7 pack law — plus every older law still stands):**

- Do **not** pack `post_stinger` with `stride_hunter` / `far_stinger` / `glass_sniper` as a PAIR without a tithe / lock third (two guns, same lesson). `FSN-KICK-STING` / `FSN-GLASS-WARD` stay theirs.
- Do **not** pack `purse_scribe` with `ledger_siphon` / `surplus_warder` as a PAIR (steal vs cut vs evade leftover AP). `FSN-LEDGER-LEY` / `FSN-EVADE-GOAD` stay theirs.
- Do **not** pack `corner_bishop` with a second gun (`glass_sniper` / `far_stinger` / `oblique_cantor`) as a PAIR without a smoke / span / pylon third. `FSN-SMOKE-GLASS` stays fog + min-range.
- Do **not** pack `hinge_squire` with `vault_chaplain` / `hook_chaplain` / `shove_chaplain` / `mist_walker` / `morrow_walker` / `blink_cutter` as a PAIR (six reposition engines). `FSN-VAULT-ORIGIN` / `FSN-RESCUE-LINE` / `FSN-SHOVE-SCHOOL` / `FSN-MIST-HUNT` stay theirs.
- Do **not** pack `file_reeler` with `void_anchoret` / `sink_chanter` / `pair_binder` as a PAIR (three attract engines). `FSN-HOOK-SLAM` / `FSN-WICK-COURT` / `FSN-DRAW-CASH` stay theirs.
- Do **not** pack `twin_span` with `span_warder` / `span_prelate` / `pylon_prelate` / `bait_prelate` / `font_cantor` / `stone_castellan` (two-cell system **or** a second post). Twin Span fills `ENEMY_SUMMON_CAP`.
- Do **not** pack `veil_cantor` with `smoke_thurifer` / `sidestep_warder` as a PAIR (LoS vs untargetable vs miss). Smoke is `FSN-SMOKE-GLASS`; evade is `FSN-EVADE-GOAD`.
- Do **not** pack `cadence_breaker` with `cadence_thief` as a PAIR (reset vs steal). `FSN-CADENCE-MUTE` stays theft.
- Do **not** pack `cadence_lender` with `tempo_precentor` as a PAIR (CD shave vs next-turn AP). `FSN-TEMPO-CHOIR` / `FSN-ACT-GIFT` stay Tempo.
- Do **not** pack `purse_splitter` with `tempo_precentor` / `ledger_siphon` as a PAIR (gift leftover vs next-turn AP vs steal).
- Do **not** pack `tithe_mason` with `tax_scribe` / `origin_mason` / `glyph_sower` as a PAIR (exit tax vs enter tax vs cast-from vs Mark). `FSN-GRAVITY-TAX` / `FSN-MORROW-SNARE` stay theirs.
- Do **not** pack `hinge_mason` with `rift_hook` / `pawn_broker` / `twin_porter` / `trip_mason` as a PAIR (four swap/enter engines). `FSN-TRADE-HOLE` / `FSN-GATE-COURT` / `FSN-WIRE-ROOT` stay theirs.
- Do **not** pack `spark_chanter` with `cinder_martyr` / `brood_chanter` as a PAIR (three death/pet engines). `FSN-HOOK-FUSE` / `FSN-KENNEL-LITANY` stay theirs.
- Do **not** pack `cap_warder` with `plate_warden` / `surplus_warder` / `cover_squire` as a PAIR (three soak engines). `FSN-PLATE-LINK` / `FSN-BRAND-COVER` stay theirs.
- Drop 4–7 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two span bodies; no two AP taxes; no two delayed clocks).

Wave 8 **families** now exist as [`ENEMY_ELITE_EVOLUTION_2026-09-25.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md) (open as PR #558: `wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `triple_span`, `cadence_cracker`, `once_cantor`, `hood_lurker`, `share_warden`, `spare_pacer`, `wick_painter`, `boon_mason`, plus SDE CORE owners). They consume Wave 7 SPELL_PROPOSALS (PR #525), not this catalog’s Wave 7 family pack. This drop does **not** mint `FSN-*` ids for those families — drop 9 writes Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood.

Same-day SPELL_PROPOSALS Wave 8 (`SPELL_PROPOSALS_2026-09-25.md`, open as PR #563) still have **no family sheets**. Do not mint `FSN-*` ids that require Wave 8 spell verbs until that family pass exists.

Mute Thread / Queue Cut / False Cut / Must Pace / Court Shove stay **boss / closed-class**.

**Do not spawn Post Sting sheets until a battle-walk writer exists for walk-MP spent this turn.** Missing field → Post Sting pays **12 only** (fail closed). Forced-move does **not** count as walk. Until that writer lands, show `FSN-GLASS-WARD` / `FSN-SPAN-GUN` instead of `FSN-CAMP-TITHE` / `FSN-POST-TITHE`.

**Do not spawn Hinge Cover / Glance sheets until a battle-walk writer exists for `currentView`.** Overworld wander already writes the field (`WX` 6924–6938); combat walks do not. Missing view → Glance always fizzles and Oncoming never pays +10 (fail closed). Until that writer lands, show `FSN-HINGE-GLANCE` **without** Glance (Frost only) or skip to `FSN-VEIL-GOAD`.

---

## Grounding (live, 2026-09-25)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 4–7. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920; zone object at 4683–4687 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1698 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–221 — **no** `span` / `twinspan` / `spark` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 / 5855 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 (`ENEMY_SUMMON_CAP = 2`) |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 336–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 — File Reel is the first **cast** caller of attract along one axis |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `areaShape` typed, unread | `targeting.ts` 690–727 (area = Chebyshev `areaRadius`) |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated twin-span / spark / span-pylon / bait / font / pylon / turret / familiar bodies **replace** the random overlay. Cap one of those engines. Twin Span **is** the two-cell system and fills the summon cap (two 1-HP posts).
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Post, Purse, Corner, Hinge, Reel, Twin Span, Veil, Break, Lender, Splitter, Tithe, Hinge-tile, Spark, or Cap.** Font on `FSN-LEND-FAN` is the **one** heal engine on that variant.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash / Cover Step / Cadence Lend / Split Purse.
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 7 CORE rows stay `mpCost: 0` (Ley Toll remains the first MP spender; do not add a fourth `mpCost > 0` walk snipe).
6. `inferSummonArchetype` must key `summonAI === "twinspan"` and `"spark"` (and `"span"` / `"bait"` / `"font"` / `"pylon"` / `"turret"`) **before** any Twin Plug / Spark sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost / Shield, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies. Coup / Sated Fang / Act Bell / Post Sting / Purse Cut are **not** `instantKill`.
8. Reel dest / hinge clockwise dest / enter-swap landing: free floor, not lava / spikes / void / portal / pit / live fuse, player keeps ≥ 1 escape tile. File Reel is **not** Hook Line (diagonal is illegal). Hinge Tile does **not** use `isTrap`.
9. Dual Slow / Frost / tide melee / rime: cap applied unit MP debuff at **−2**. One Slow source per pack. Do not also Root + Rank Lock + Facing Pin + Stride Mute + Exit Tithe on the same AP bar.
10. Walk-spend: Post Sting **fails closed** (12 only) until `walkMpSpentThisTurn` (or equivalent) exists on the turn actor. Forced-move / Swap / File Vault / Hinge Step **does not** increment it.

### Relative difficulty (same grades as drops 1–7)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…7 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a leftover-AP tell / a walk-tax) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (post / hinge / reel / tithe / cap / goad / span-owner / cover / lancer / warden): pack median + one step.
- Backliner (purse / corner / veil / break / lender / splitter / spark / locksmith / muter / teller / sniper / gale / font / cantor / tempo): pack median.
- Glass (purse, corner, veil, spark, splitter, glance): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 8)

Drop 1–7 overlays still apply. These are **additional jobs** for Wave 7 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-POST` | `rook` or `pawn` **without** heal | proposed `post_stinger` | `starter-frost`, `spell-post-sting` | artillery; skip the +10 if `walkMpSpentThisTurn` missing or > 0 (Frost / 12-only); never walk then sting the same turn |
| `ROLE-PURSE` | `bishop` or `queen` **without** heal | proposed `purse_scribe` | `starter-frost`, `spell-purse-cut` | caster; skip Cut if target leftover AP < 2 (Frost); never steal AP |
| `ROLE-CORNER` | `bishop` **without** heal | proposed `corner_bishop` | `starter-frost`, `spell-blind-corner` | artillery; Corner only if live `hasLoS` would fail (wall / barrier / smoke / span / pylon); open pit does **not** pay; skip in open field (Frost) |
| `ROLE-HINGE` | `knight` | proposed `hinge_squire` | `physical_attack`, `spell-hinge-step` | flanker; rotate **self** 90° clockwise around a living **ally** (not the player on BASE); skip no-ally / occupied dest / Nail Down |
| `ROLE-REEL` | `rook` | proposed `file_reeler` | `starter-frost`, `spell-file-reel` | caster; Reel only on a shared rank **or** file; skip diagonal; dest must leave a walk-off; 0 damage |
| `ROLE-TWINSPAN` | `rook` or `king` **without** Rally | proposed `twin_span` | `physical_attack`, `spell-twin-span` | `isSummoner` for twin-span only; posts `summonAI: "twinspan"`, HP 1, empty kit, Strike illegal; Chebyshev > 1 after any move → farther post dies; no wolf/archer/pylon/turret/font/bait/span overlay |
| `ROLE-VEIL` | `bishop` or `pawn` **without** heal | proposed `veil_cantor` | `starter-frost`, `spell-aim-veil` | kiter; Veil self 1 round; skip if already veiled; never smoke |
| `ROLE-BREAK` | `bishop` or `queen` **without** heal | proposed `cadence_breaker` | `starter-frost`, `spell-cadence-break` | buffer; Break once/battle on last **owned** id with remaining CD > 0; BASE has **no** Inferno (ELITE may hold one Inferno **after** a public first resolve) |
| `ROLE-LEND` | `bishop` **without** heal | proposed `cadence_lender` | `spell-cadence-lend`, `starter-frost` | buffer (`AI-ROL-05`); Lend the ally with the highest remaining CD; skip no-ally / all remaining 0; never self |
| `ROLE-SPLIT` | `king` or `bishop` **without** Rally | proposed `purse_splitter` | `spell-split-purse`, `starter-frost` | buffer; skip leftover 0 (chrome-only transfer is a wasted turn); skip no adjacent ally; never target a hostile |
| `ROLE-TITHE` | `rook` or `bishop` | proposed `tithe_mason` | `starter-frost`, `spell-exit-tithe` | setter; paint one free floor cell; skip if the player can ignore the cell; never paint the only walk-off |
| `ROLE-HINGETILE` | `bishop` or `pawn` | proposed `hinge_mason` | `starter-frost`, `spell-hinge-tile` | setter; paint then step off (VETERAN); skip if both landings would be illegal; never `isTrap` / `isSwap` |
| `ROLE-SPARK` | `queen` or `king` **without** Rally | proposed `spark_chanter` | `starter-frost`, `spell-spark-whelp` | `isSummoner` for spark only; whelp HP 1, lifespan 1, kit Strike; skip if a whelp already lives; death grant only if owner is **current** |
| `ROLE-CAP` | `rook` or `king` **without** Rally | proposed `cap_warder` | `physical_attack`, `spell-turn-cap` | charger; Cap self before a public swing; skip if already charged; DoT ticks do not consume |

Drop-2…7 `ROLE-LOCK` / `ROLE-MUTER` / `ROLE-ACTTAX` / `ROLE-SMOKE` / `ROLE-SPAN` / `ROLE-COVER` / `ROLE-GLANCE` / `ROLE-ONCOMING` / `ROLE-GOAD` / `ROLE-PYLON` / `ROLE-FUSE` / `ROLE-PIT` / `ROLE-IGNITE` / `ROLE-TEMPO` / `ROLE-FONT` / `ROLE-GALE` / `ROLE-LINTEL` / `ROLE-SNIPER` / `ROLE-ACTBELL` / `ROLE-TANK` are reused below. Do not also roll the random 12% summoner overlay onto Post, Purse, Corner, Hinge, Reel, Veil, Break, Lender, Splitter, Tithe, Hinge-tile, or Cap. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon **or** twin-span **or** spark — never two). Twin Span occupies the two-cell **and** summon caps.

### Fair-fight rules (every sheet)

Same as drops 1–7, plus Wave 7:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, lintel the player cannot enter, tithe cell that is the only aisle, hinge-tile that is the only aisle, or a Twin Span pair that seals the only aisle.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Post Sting: 12, +10 iff caster walk-MP spent this turn is 0. Missing field → 12 only. Push / pull / Swap them off the post **before** they shoot. Walking themselves drops the bonus — that is the tell.
- Purse Cut: 10, +12 iff target **current** AP ≥ 2. Does **not** steal. Spend down to 0–1 before they act. Summons use their own current AP.
- Blind Corner: 10, +12 iff existing `hasLoS` would have failed. Open pit does **not** pay. Occupying bodies block the same way live LoS does. Step into open LoS.
- Hinge Step: teleport **self** to the clockwise adjacent of a living allied pivot. Occupy that cell. Nail Down fizzles (AP spent). Forced-move does not write facing.
- File Reel: legal only on shared rank **or** file. Pull 1 via `applyAttract`. Attract does not write `currentView`. Diagonal is a full answer. Dest must leave a walk-off.
- Twin Span: two 1-HP posts that walk independently while Chebyshev ≤ 1. Break adjacency (push one) and the farther post dies. AoE both. Targeting either cell hits that post. Closet with no adjacent free cell → **reroll**.
- Aim Veil: 1 round. Hostile `targetType: enemy` / `self` aimed at the Cantor **rejects the tile**. AoE / line / chain that already includes the cell still hits. Strike still hits. Attack Nearest must skip. Wait the round.
- Cadence Break: once per battle. Sets remaining CD to 0 on the last **owned** id successfully resolved that still has remaining CD > 0. Cannot reset Break itself. Fizzle after AP **is** observation.
- Cadence Lend: ally highest remaining CD −1 (min 0). Does not copy an id. Cannot lend to self.
- Split Purse: after live AP debit, move 1 leftover current AP to an adjacent ally this turn, capped at their max. Leftover 0 still resolves (chrome) but AI must not choose that.
- Exit Tithe: one free floor cell, 2 turns. Voluntary **walk** that **leaves** the cell costs +1 AP. 0 AP → walk illegal. Forced-move exits **free**. Stay-and-cast is legal. Paint is observation; later exits are not. Extra player AP through `recordChallengeApSpend`.
- Hinge Tile: paint 2 turns. Next enter (walk **or** forced-move) swaps with the **painter** if both landings are legal. Nail Down the painter → swap fizzles, tile expires, enterer stays. Dead painter = free enter. Path around.
- Spark Whelp: on death from any cause, if the owner is the **current** turn actor, owner +1 current AP (capped at max). If not current, the +1 is **lost**. Kill it on **their** turn. Player-side whelp death does not enter `applyRewards`.
- Turn Cap: one charge. Next damaging hit after RES/SR/modifiers is `min(applied, 12)`, then consume. Expires at end of next turn if unused. Two small hits beat it. DoT ticks do not consume. Challenge records the **capped** amount.
- One Inferno cadence per pack unless a variant explicitly splits targets. Break Choir’s second Inferno is the **same** id after a public reset — still one cadence, two windows.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Tithe, Mute, Act Bell, or Cap sheets. No Time Warp on Tithe / Mute / Reel / Hinge / Bell windows.
- Summons stay at cap 2 except Twin Span **uses** that cap. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop + pointer)

Drops 1–7 union lives in [`ENEMY_FORMATIONS_2026-09-24.md`](./ENEMY_FORMATIONS_2026-09-24.md) (this-drop table) plus the drop-6 union. **Do not reuse those ids.** This drop adds:

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-CAMP-TITHE` | PAIR | camp gun + walk-exit tax | this drop |
| `FSN-PURSE-MUTE` | PAIR | leftover-AP poke + walk-fizzle | this drop |
| `FSN-HINGE-GLANCE` | PAIR | 90° self-rotate + new-front poke | this drop |
| `FSN-VEIL-GOAD` | PAIR | untargetable + taunt | this drop |
| `FSN-SPARK-SPLIT` | CELL | death-AP whelp + leftover-AP share | this drop |
| `FSN-HINGE-WICK` | CELL | enter-swap + delayed fuse | this drop |
| `FSN-POST-TITHE` | BRIGADE | camp + exit tax + axis lock | this drop |
| `FSN-PURSE-COURT` | BRIGADE | leftover-AP poke + queue tax + mute | this drop |
| `FSN-CORNER-FOG` | BRIGADE | blocked-LoS poke + smoke + two-cell plug | this drop |
| `FSN-REEL-TITHE` | BRIGADE | file pull + exit tax + oncoming | this drop |
| `FSN-HINGE-COVER` | CADRE | hinge + redirect + glance | this drop |
| `FSN-TWIN-PLUG` | CADRE | walking two-cell + lintel + sniper | this drop |
| `FSN-VEIL-CORNER` | CADRE | veil + blocked-LoS poke + taunt | this drop |
| `FSN-BREAK-CHOIR` | CADRE | self CD reset + ignite + tempo | this drop |
| `FSN-CAP-VEIL` | CADRE | hit cap 12 + veil + taunt | this drop |
| `FSN-REEL-CORNER` | COURT | file pull + blocked-LoS poke + pylon, leader | this drop |

Named Wave 7 packs that live as **variants** (not new ids): Hinge Trap → `FSN-HINGE-WICK/TRAP`; Lend Fan → `FSN-BREAK-CHOIR/LEND`; Spark Purse → `FSN-SPARK-SPLIT/PURSE`; Split Spark → `FSN-SPARK-SPLIT/BELL`.

---

## Formations

### FSN-CAMP-TITHE

FORMATION_ID: `FSN-CAMP-TITHE`  
RELATIVE_DIFFICULTY: PAIR (kit band 0–1)  
ENEMIES:

- `ROLE-POST` — `rook` / proposed `post_stinger` — pack median + 1 — owns one aisle, does **not** walk
- `ROLE-TITHE` — `bishop` / proposed `tithe_mason` — pack median — paints **that** aisle cell

VARIANT_RULES:

- Band 0: Post Frost only (walk-spend field missing → no +10 anyway). Tithe paints a cell the player can step around. The lesson is “the gun wants to stand; leaving the cell costs AP.”
- Band 1: Post Sting is legal **only if** the walk-spend writer exists; else keep Frost. Tithe never paints the only walk-off.
- Elite: Post only. Tithe stays junior so two elites cannot 22-every-turn a locked aisle.
- Unlock after `FSN-SPAN-GUN` **or** `FSN-GLASS-WARD` (player has seen a gun that needs geometry).
- Random 30% family lottery is **off**. No Rank Lock on PAIR (that is `FSN-POST-TITHE`). No second gun.

SPELL_POOL_INTERACTIONS:

- Post Sting 12 / 22 if they camped. Exit Tithe +1 AP to **leave**. Sitting and Frosting is legal. Forced-move off is free and also drops their +10 if you shove **them**.
- Do not also attach Glyph Tax (enter) or Origin (cast-from). One tile-AP story.

TACTICAL_PLAN:

- Tithe paints the aisle in front of the Post. Post holds and Stings if they have not walked. If the player never enters the cell, this is a soft Frost gun — intended.

SYNERGY:

- Camp gun + walk-exit tax. Wave 7 Post Tithe minus the locksmith. You pay to leave **or** you eat the standing poke.

PLAYER_THREAT:

- Readable tempo. Fail is dumping a 5-AP Inferno from the tithe cell. Recoverable: sit, Swap off, shove the Post.

COUNTERPLAY:

- Stay and cast. Swap / Attract the Post off the aisle. Walk a gallery. Kill the glass Tithe (hp ~0.90). Do not take the only aisle.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel (tithe on the only cell is a lock).
- No lava on the painted cell. No Time Warp.

AI_REQUIREMENTS:

- Post: artillery; never walk then sting.
- Tithe: setter; never paint the only walk-off.
- Soph 1–2.

VARIANTS:

- `FSN-CAMP-TITHE/LOCK` — BRIGADE: that is `FSN-POST-TITHE`.
- `FSN-CAMP-TITHE/E-POST` — elite Post, still no Rank Lock.

STATUS: PROPOSED

---

### FSN-PURSE-MUTE

FORMATION_ID: `FSN-PURSE-MUTE`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-PURSE` — `bishop` / proposed `purse_scribe` — pack median — back
- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median — mid-back, opposite corner

VARIANT_RULES:

- Band 0: **do not spawn this id** (Purse Cut and Mute are not default kits). Show `FSN-TIDE-LOCK` instead.
- Purse Cut only if leftover AP ≥ 2. Mute only if they still have a walk they might take. Never both tax the same AP bar as a hardlock: Mute fizzles the **spell after a walk**; Purse punishes **unspent** AP. The answer is spend-then-stand **or** walk-then-Strike (2 AP).
- Elite: Purse only. Muter stays junior.
- Unlock after `FSN-MUTE-PIT` **or** `FSN-LEDGER-LEY` (player has seen walk-fizzle **or** leftover AP).
- No Ledger (steal). No Surplus (evade). No Act Tax on PAIR (that is `FSN-PURSE-COURT`).

SPELL_POOL_INTERACTIONS:

- Purse 10 / 22 if you hold ≥ 2 AP. Mute fizzles the next spell if you walked. Spending Inferno first is a full answer to Purse and makes Mute irrelevant if you then stand.

TACTICAL_PLAN:

- Muter arms if the player is at Chebyshev ≥ 2. Purse waits for leftover ≥ 2 after the player’s spend. Never turn-1 double-tax a full bar from full HP in a closet.

SYNERGY:

- Leftover-AP poke + walk-fizzle. Purse Court minus the queue tax. The loaded bar cannot also walk.

PLAYER_THREAT:

- Tempo, not a one-shot. Fail is holding 4 AP, walking closer, then eating 22 and a fizzle. Recoverable: dump, then stand.

COUNTERPLAY:

- Spend to 0–1 before they act. Cast first, then walk (Mute misses). Kill the Purse (hp ~0.75). Barrier a LoS.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. Reject a 1-tile tunnel (walk is mandatory).
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Purse: skip Cut if leftover < 2.
- Muter: skip if already adjacent and they will Strike.
- Soph 1–2.

VARIANTS:

- `FSN-PURSE-MUTE/TELLER` — BRIGADE: that is `FSN-PURSE-COURT`.
- `FSN-PURSE-MUTE/E-CUT` — elite Purse, still no steal.

STATUS: PROPOSED

---

### FSN-HINGE-GLANCE

FORMATION_ID: `FSN-HINGE-GLANCE`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-HINGE` — `knight` / proposed `hinge_squire` — pack median + 1 — starts wide of a living pivot
- `ROLE-GLANCE` — `queen` **without heal** / proposed `glance_ward` — pack median — the **pivot**

VARIANT_RULES:

- Two bodies, two jobs: Hinge is **self** 90° around the Glance; Glance pokes the cell in front of **their** view after the swing. Distinct from `FSN-VAULT-ORIGIN` (blink **them**) and `FSN-FACE-PIN` (lock facing).
- Band 0: **do not spawn this id** (Hinge / Glance are not default kits).
- If `currentView` is unread in combat, Glance Frosts forever — still a valid soft PAIR (Hinge is the verb). Do **not** fake Glance with Oncoming on this id.
- Elite: Hinge only. Glance stays junior so two dash elites cannot surround.
- Unlock after `FSN-FACE-PIN` **or** `FSN-VAULT-ORIGIN` (player has seen facing **or** an ally blink).
- No Cover on PAIR (that is `FSN-HINGE-COVER`). No Vault / Hook / Mist.

SPELL_POOL_INTERACTIONS:

- Hinge dest is always the clockwise adjacent of the pivot. Glance 16 on **their** front cell. After a swing, that front may be newly occupied — that is the tell, not a lock. Missing view → Glance fizzles after AP.

TACTICAL_PLAN:

- Glance holds. Hinge rotates only if the clockwise cell is free, non-hazard, and not the player’s last exit. Never turn-1 surround. Start ≥ 4 apart.

SYNERGY:

- 90° self-rotate + new-front poke. Hinge Cover minus the redirect. The empty tile behind the pivot becomes a flank.

PLAYER_THREAT:

- Positional. Fail is standing on the only clockwise floor **and** parking a Wisp on your front. Recoverable: occupy the dest, kill the Hinge (hp ~0.95), hug a wall.

COUNTERPLAY:

- Stand on the clockwise cell. Nail Down the Squire. Kill the pivot. Do not clump on your front.

MAP_REQUIREMENTS:

- `asymmetric` or `ruinsIslands` with **two** flanks plus a rear tile that is not the only exit. Reject cramped `corridorMaze` (clockwise dest is a closet lock **or** useless).
- No Fog required. No sealed alcove.

AI_REQUIREMENTS:

- Hinge: skip no-ally / occupied dest; allied pivot only on BASE.
- Glance: skip empty / wall / ally / missing view.
- Soph 1–2. Blackboard: `hingeDest` so they do not stack.

VARIANTS:

- `FSN-HINGE-GLANCE/COVER` — CADRE: that is `FSN-HINGE-COVER`.
- `FSN-HINGE-GLANCE/FROST` — if view is unread: Glance Frost only (soft PAIR).

STATUS: PROPOSED

---

### FSN-VEIL-GOAD

FORMATION_ID: `FSN-VEIL-GOAD`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-VEIL` — `bishop` / proposed `veil_cantor` — pack median — glass backliner
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median + 1 — the body they must swing at

VARIANT_RULES:

- Distinct from `FSN-PINCH-GOAD` (pincer occupancy) and `FSN-EVADE-GOAD` (miss). Veil **rejects the primary tile**; Goad **rewrites the legal damaging target**. Non-damage tools ignore taunt. AoE that includes the Herald satisfies it. Strike still hits the Veil.
- Elite: Goad only. Veil stays junior so two elites cannot hide **and** soak.
- Unlock after `FSN-PINCH-GOAD` **or** `FSN-SMOKE-GLASS` (player has seen taunt **or** a LoS brick).
- No Smoke on this sheet. No Cap on PAIR (that is `FSN-CAP-VEIL`). No Corner (that is `FSN-VEIL-CORNER`).
- Solo Goad is allowed as a teaching fallback if Veil id is not ready (`FSN-VEIL-GOAD/SOLO`).

SPELL_POOL_INTERACTIONS:

- Aim Veil 1 round. Goad next damaging action must choose the Herald if they are a legal Strike target. Absolve **does** strip Goad (`effectCategory: "cc"`). Frost the Herald is legal. Inferno that includes both satisfies taunt **and** hits the Veil.

TACTICAL_PLAN:

- Goad when the Veil is the real threat. Veil self if a primary nuke is aimed. Herald steps so they **are** a legal Strike target. Never turn-1 surround.

SYNERGY:

- Untargetable + taunt. Wave 7 Veil Corner minus the gun. You are offered a legal swing into the tank while the glass rejects the tile.

PLAYER_THREAT:

- Structured, not a spike. Fail is Inferno-the-Veil as a primary. Recoverable: Strike the Herald, AoE both, wait the veil round.

COUNTERPLAY:

- Non-damage first (Slow / Barrier / Absolve). AoE the file. Walk adjacent and Strike the Veil. Kill the Herald (hp ~1.20 but the threat is the taunt).

MAP_REQUIREMENTS:

- `arena` or `openField` with ≥ 2 walk-offs. Reject a closed ring (taunt + no gallery).
- No Thorned Ground on the only path to the Veil.

AI_REQUIREMENTS:

- Veil: skip recast while live.
- Goad: skip if already the only legal target; retreat disabled while taunt is live.
- Soph 1–2.

VARIANTS:

- `FSN-VEIL-GOAD/CORNER` — CADRE: that is `FSN-VEIL-CORNER`.
- `FSN-VEIL-GOAD/SOLO` — teaching PAIR, Goad only.

STATUS: PROPOSED

---

### FSN-SPARK-SPLIT

FORMATION_ID: `FSN-SPARK-SPLIT`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-SPARK` — `queen` **without heal** / proposed `spark_chanter` — pack median — `isSummoner` for spark only
- `ROLE-SPLIT` — `king` / proposed `purse_splitter` — pack median — adjacent to the Chanter when gifting

VARIANT_RULES:

- Distinct from `FSN-KENNEL-LITANY` (wolf) and `FSN-HOOK-FUSE` (martyr Inferno). The whelp is a **current-actor AP battery**. Kill it on **their** turn and the grant is lost.
- CELL: Spark cap 1. Splitter gifts 1 leftover only if leftover ≥ 1 **and** adjacent. No Break on CELL (that is `FSN-SPARK-SPLIT/PURSE`). No Act Bell (that is `/BELL`).
- Elite: Spark only. Splitter stays junior.
- Unlock after `FSN-KENNEL-LITANY` **or** `FSN-ACT-GIFT` (player has seen a pet **or** a next-turn AP gift).
- Do not also roll wolf/archer. Summoner fall-through required (today skip-lock).
- Whelp death is 0 XP. Challenge records HP the player actually lost — not the missed +1.

SPELL_POOL_INTERACTIONS:

- Spark whelp Strike only. Death +1 AP if Chanter is current. Split Purse moves 1 leftover to the Chanter so they can summon **or** Frost after. Do not Tempo on this sheet (next-turn AP is a different lesson).

TACTICAL_PLAN:

- Spark plants the whelp on a tile the player wants to Strike. Splitter stands adjacent and gifts only after a real leftover. If the player waits, the lifespan 1 fade may grant on the Chanter’s turn — **ignore-the-pet until their turn ends** is the designed answer when possible; if fade happens on the Chanter’s turn, that is the honest risk, not a hidden tick.

SYNERGY:

- Death-AP whelp + leftover-AP share. Spark Purse minus Break. You choose when the 1-HP body dies.

PLAYER_THREAT:

- Low spike. Fail is popping the whelp during their Inferno window (not on this CELL — no Inferno). Recoverable: wait.

COUNTERPLAY:

- Kill the whelp on **your** turn. Kill the Splitter. Drain Courage the Splitter before they lend. Do not stand adjacent to both.

MAP_REQUIREMENTS:

- `openField` or `arena`. Whelp placement ≥ 2 from the player’s last exit. Reject a closet (must wait = lock).
- No Time Warp.

AI_REQUIREMENTS:

- Spark: skip if whelp lives; fall through to Frost; `summonAI: "spark"`.
- Split: skip leftover 0 / no adjacent ally.
- Soph 2–3.

VARIANTS:

- `FSN-SPARK-SPLIT/PURSE` — CADRE **Spark Purse**: add `ROLE-BREAK` (reset the follow-up). Still one Inferno cadence. Still kill-on-their-turn.
- `FSN-SPARK-SPLIT/BELL` — CADRE **Split Spark**: add `ROLE-ACTBELL` instead of Break. Gift leftover AP, then arm a turn-start 14 they want to keep. Still no Grave Bell. Unlock after `FSN-ACT-GIFT`.
- `FSN-SPARK-SPLIT/NO-SPLIT` — Spark + Frost only if Splitter apply is missing.

STATUS: PROPOSED

---

### FSN-HINGE-WICK

FORMATION_ID: `FSN-HINGE-WICK`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-HINGETILE` — `bishop` / proposed `hinge_mason` — pack median — paints then steps off
- `ROLE-FUSE` — `queen` **without heal** / proposed `fuse_binder` — pack median — delayed occupancy bomb

VARIANT_RULES:

- Distinct from `FSN-WICK-STEP` (bash onto fuse) and `FSN-TRADE-HOLE` (two-hostile swap + pit). This sheet is **enter-swap onto a wick**. No bash. No pit on CELL (that is `/TRAP`). No `isTrap`. No Swap on either body.
- Elite: Mason only. Fuse stays junior so two displacement elites cannot pin.
- Unlock after `FSN-WICK-STEP` **or** `FSN-TRADE-HOLE` (player has seen fuse **or** a later swap).
- Hook / bash dest still banned from lava. Swap landing must leave a walk-off **and** must not be the fused cell unless a second walk-off exists after the tick (CELL: **never** swap onto the fuse — that is BRIGADE `/TRAP` with a gallery).
- Do not ship until Hinge Tile is **not** `placeBarrier`.

SPELL_POOL_INTERACTIONS:

- Hinge Tile: next enter swaps with the painter. Fuse: 2-turn occupancy bomb, 0 on cast, caster death does **not** cancel. Teleport-off the fuse works; walk-on at tick does not. Nail Down the painter frees the tile.

TACTICAL_PLAN:

- Fuse a choke the player might enter next turn (never a full-HP player’s only tile on turn 1). Mason paints a **different** cell on the approach, then steps off. If the player never enters, this is a soft Frost pair — fine.

SYNERGY:

- Enter-swap + delayed fuse. Hinge Trap minus the pit. Information (where is the paint?) plus a bomb you can step off.

PLAYER_THREAT:

- Frustration if you step on the paint toward the wick. Not a lock: path around, kill the Mason, Nail Down.

COUNTERPLAY:

- Path around. Burst the Mason. Swap the Binder onto their wick. Do not enter the paint.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile tunnel (paint + fuse on the only tile is a hardlock).
- No Time Warp. No slime on both approaches.

AI_REQUIREMENTS:

- Hinge-tile: place then step off; never paint the only backliner approach; skip illegal landings.
- Fuse: skip if player MP ≥ 3 and an open ring exists (VETERAN); never stack two fuses on one cell.
- Soph 2–3.

VARIANTS:

- `FSN-HINGE-WICK/TRAP` — BRIGADE **Hinge Trap**: add `ROLE-PIT` on a **third** approach, never on the swap landing. Still one fuse. Still a gallery. Unlock after `FSN-MUTE-PIT`.
- `FSN-HINGE-WICK/E-TILE` — elite Mason, still no lava dest.

STATUS: PROPOSED

---

### FSN-POST-TITHE

FORMATION_ID: `FSN-POST-TITHE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-POST` — `rook` / proposed `post_stinger` — pack median + 1
- `ROLE-TITHE` — `bishop` / proposed `tithe_mason` — pack median
- `ROLE-LOCK` — `rook` / proposed `axis_locksmith` — pack median — Rank Lock the **file**, not a second tax

VARIANT_RULES:

- Unlock after `FSN-CAMP-TITHE`. Named Wave 7 “Post Tithe.”
- Elite: Post only. Tithe and Lock stay junior so two geometry elites cannot pin.
- Rank Lock is the **one** rare. Walks still happen, only along current rank **or** file. Forced-move still works. Never Lock + Root + Mute on the same AP bar.
- Tithe still must leave a walk-off **off the file** (gallery). Lock never seals that gallery.
- No second gun. No Glyph Tax.

SPELL_POOL_INTERACTIONS:

- Camp the tax cell; walk-off pays AP **and** drops the +10 if **they** had to walk; Rank Lock makes the gallery the designed answer. Sit-and-cast remains legal.

TACTICAL_PLAN:

- Lock the file the Post owns. Tithe paints the cell on that file. Post holds. If the player never shares the file, this is a softer `FSN-CAMP-TITHE` plus a Frost rook — fine.

SYNERGY:

- Camp + exit tax + axis lock. Three Wave 7/4 verbs, one aisle. Combination, not a new monster.

PLAYER_THREAT:

- High if you share the file and hold AP. Low if you take the gallery. Fail is greed on the aisle after PAIR.

COUNTERPLAY:

- Gallery. Sit. Swap the Post. Forced-move off (free). Burst the Tithe. Dispel / wait Rank Lock.

MAP_REQUIREMENTS:

- `chessboard` or `fortress` with a 4-tile file **and** a gallery. Reroll maps with no gallery.
- Tithe  cell must not be the only cell that leaves the file.

AI_REQUIREMENTS:

- Same Post / Tithe contracts as `FSN-CAMP-TITHE`.
- Lock: skip if already locked; skip if the player is already on a dead-end file.
- Soph 3–4. `groupTactics` at 4. Blackboard: `ownedFile`.

VARIANTS:

- `FSN-POST-TITHE/NO-LOCK` — fallback to `FSN-CAMP-TITHE` if Rank Lock is not ready.
- `FSN-POST-TITHE/E-CAMP` — elite Post-leader (CADRE-shaped); still one gun.

STATUS: PROPOSED

---

### FSN-PURSE-COURT

FORMATION_ID: `FSN-PURSE-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PURSE` — `bishop` / proposed `purse_scribe` — pack median
- `ROLE-ACTTAX` — `bishop` / proposed `act_teller` — pack median
- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median

VARIANT_RULES:

- Unlock after `FSN-PURSE-MUTE`. Named Wave 7 “Purse Court.”
- Elite: Purse only. Teller and Muter stay junior.
- Act Tax is the **one** rare. Already-acted → Teller fizzles. Strike **is** taxed. Never a second AP engine (no Ledger, no Glyph Tax, no Drain Courage).
- Three bishops, three jobs: leftover poke / queue tax / walk-fizzle. Distinct from `FSN-LEDGER-LEY` (steal + prime).
- No Inferno. No Time Warp.

SPELL_POOL_INTERACTIONS:

- Cut the loaded bar they cannot spend on a 3-AP nuke after a close. Mute if they walk to dump. Tax if they still have an earlier slot. Spend-then-stand answers all three.

TACTICAL_PLAN:

- Teller taxes if they have a remaining earlier slot. Muter arms at range. Purse Cuts leftover ≥ 2. One of the three peels a wisp (`focusAlreadySet`); the others stay on the player.

SYNERGY:

- Leftover-AP poke + queue tax + mute. The loaded bar is a trap in three axes, all readable.

PLAYER_THREAT:

- Tempo stack. Fail is holding 5 AP, walking, and eating Cut + fizzle + tax. Recoverable: dump first.

COUNTERPLAY:

- Spend to 0–1. Cast then walk. Kill the Purse. Ignore the Teller if you already acted.

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. Three backliners need retreat tiles. Never a closed ring.
- No Glass Realm.

AI_REQUIREMENTS:

- Purse / Muter as PAIR. Teller: skip if they already acted; never splice `turnOrder`.
- Soph 3–4. `groupTactics` on.

VARIANTS:

- `FSN-PURSE-COURT/NO-TELLER` — fallback to `FSN-PURSE-MUTE`.
- `FSN-PURSE-COURT/E-CUT` — elite Purse, still no steal.

STATUS: PROPOSED

---

### FSN-CORNER-FOG

FORMATION_ID: `FSN-CORNER-FOG`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-CORNER` — `bishop` / proposed `corner_bishop` — pack median — blocked-LoS poke
- `ROLE-SMOKE` — `bishop` / proposed `smoke_thurifer` — pack median — places the block
- `ROLE-SPAN` — `rook` / proposed `span_warder` — pack median + 1 — two-cell self plug

VARIANT_RULES:

- Unlock after `FSN-SMOKE-GLASS` **and** `FSN-SPAN-GUN`. Named Wave 7 “Corner Fog.”
- Elite: Corner only. Smoke and Span stay junior.
- One two-cell system. Do not also spawn Twin Span / Span Pylon / Pylon. Smoke is walkable LoS-block, not Barrier.
- Corner skips in open field (Frost). Open pit does **not** pay the +12.
- No second gun. No Glance (that needs facing + a front occupant — different lesson).

SPELL_POOL_INTERACTIONS:

- Smoke / Span make `hasLoS` fail; Blind Corner cashes +12. Step into open LoS. Occupying the smoke cell is a full answer. Barrier on the span second cell **shrinks** the span.

TACTICAL_PLAN:

- Turn 1–2: Span plugs a 2-wide file. Smoke paints the remaining LoS tile. Corner waits for public block. If the player never hides, Corner Frosts — intended.

SYNERGY:

- Blocked-LoS poke + smoke + two-cell plug. Place the block, then cash the +12.

PLAYER_THREAT:

- Geometry. Fail is hiding behind the post they just placed. Recoverable: walk into the open, burst the 1-HP span cell, occupy smoke.

COUNTERPLAY:

- Open LoS. Kill the fog first. Walk through smoke. Kill the Corner (hp ~0.70). File Vault over the span.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 2-wide file. Reroll 1-tile closets (span cannot plug; Corner has nothing to cash).
- Span needs a free adjacent cell. Smoke must not cover **all** walk-offs.

AI_REQUIREMENTS:

- Corner: skip unless LoS would fail.
- Smoke: smoke only cells that currently break a live LoS.
- Span: skip no-free-adjacent; translate only if new second cell is free.
- Soph 3–4. Blackboard: `blockCell`.

VARIANTS:

- `FSN-CORNER-FOG/PYLON` — replace Span with `ROLE-PYLON` only after `FSN-BASTION-GATE` (that is COURT-adjacent). Never both.
- `FSN-CORNER-FOG/NO-SPAN` — Smoke + Corner only if two-cell occupy is not ready.

STATUS: PROPOSED

---

### FSN-REEL-TITHE

FORMATION_ID: `FSN-REEL-TITHE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-REEL` — `rook` / proposed `file_reeler` — pack median
- `ROLE-TITHE` — `bishop` / proposed `tithe_mason` — pack median
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median + 1 — faces the landing

VARIANT_RULES:

- Unlock after `FSN-CAMP-TITHE` **and** (`FSN-FACE-PIN` or seen Oncoming). Named Wave 7 “Reel Tithe.”
- Elite: Reel only. Tithe and Oncoming stay junior so two displacement elites cannot pin.
- Reel dest must be the tithe cell **only if** a gallery walk-off remains. Never reel onto lava / pit / fuse.
- Oncoming fails closed without `currentView`. Until the writer lands, Oncoming Strikes (still a body on the file).
- No Hook / Sink / Pair on this sheet. No Rank Lock (Post Tithe owns that). No second pull.

SPELL_POOL_INTERACTIONS:

- File Reel pull 1 onto the tax; they face the charger or pay to leave. Attract does not write facing — Oncoming uses whatever view they already have. Diagonal-only stance is a full answer to Reel.

TACTICAL_PLAN:

- Tithe paints a cell on the file. Reel only if shared axis, dest walkable, not safer for the player. Oncoming holds the landing wedge. Never turn-1 double displace.

SYNERGY:

- File pull + exit tax + oncoming. Displacement sets up a tax, not a stun.

PLAYER_THREAT:

- Positional. Fail is standing on their rank at range 4. Recoverable: diagonal, occupy the step, sit on the tithe.

COUNTERPLAY:

- Leave the file. Barrier the step. Forced-move (free tithe). Hug so Oncoming’s wedge dies. Kill the Tithe.

MAP_REQUIREMENTS:

- `chessboard` or `arena` with a 4-tile file **plus** a gallery. Reject `corridorMaze` (reel + tithe in a hallway is a lock).
- Tithe 3×1 must not cover all walk-offs from the landing.

AI_REQUIREMENTS:

- Reel: skip diagonal / safer dest / no walk-off.
- Tithe: paint the planned landing only if an exit exists.
- Oncoming: skip missing view / not facing.
- Soph 3–4. Blackboard: `plannedLanding`.

VARIANTS:

- `FSN-REEL-TITHE/NO-FACE` — Oncoming Strike only (if view unread).
- `FSN-REEL-TITHE/E-REEL` — elite Reel, still no lava dest.

STATUS: PROPOSED

---

### FSN-HINGE-COVER

FORMATION_ID: `FSN-HINGE-COVER`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-HINGE` — `knight` / proposed `hinge_squire` — pack median + 1 — `isLeader` optional
- `ROLE-COVER` — `rook` or `king` **without Rally** / proposed `cover_squire` — pack median — the **pivot**
- `ROLE-GLANCE` — `queen` **without heal** / proposed `glance_ward` — pack median — pokes the new front

VARIANT_RULES:

- Unlock after `FSN-HINGE-GLANCE` **and** `FSN-BRAND-COVER`. Named Wave 7 “Hinge Cover.”
- Elite: Hinge-leader only. Cover and Glance stay junior.
- Cover on the pivot: next hit into the Squire redirects to Cover if adjacent. Glance the **player’s** new front after the swing. Do not Cover-Step the same turn as Brand (Brand is not on this sheet).
- No Vault / Hook / Mist. No second Glance gun.
- If `currentView` unread: Glance Frosts; sheet still teaches Hinge + Cover.

SPELL_POOL_INTERACTIONS:

- Swing behind the pivot, then redirect / Glance the new front. Cover bypass: Glance / AoE that never targeted the Squire. Pull the cover off (Leash / Swap).

TACTICAL_PLAN:

- Cover stands as pivot. Hinge rotates if clockwise is free. Glance waits for a public front occupant. If the Hinge dies, remaining pair is Cover + Glance — intended (`FSN-BRAND-COVER` minus Brand).

SYNERGY:

- Hinge + redirect + glance. Three Wave 6–7 verbs. Combination, not a new sprite.

PLAYER_THREAT:

- Structured. Fail is dumping Inferno into the Squire while Cover is adjacent **and** parking a Wisp on your front. Recoverable: occupy clockwise, peel Cover, hug a wall.

COUNTERPLAY:

- Occupy the dest. Nail Down. Hit Glance (glass). AoE that includes Cover. Desummon so Glance has no front occupant.

MAP_REQUIREMENTS:

- `asymmetric` or `fortress` courtyard + gallery. Clockwise dest free at spawn. Glance needs two walk-offs.
- Never a closed ring.

AI_REQUIREMENTS:

- Hinge: allied pivot = Cover; optional `isLeader`.
- Cover: skip no-adj / ally HP% < 20.
- Glance: skip empty front / missing view.
- Soph 4–6. `groupTactics` on. Blackboard: `hingeDest`.

VARIANTS:

- `FSN-HINGE-COVER/NO-GLANCE` — BRIGADE-shaped: Hinge + Cover only (if view unread).
- `FSN-HINGE-COVER/NO-LEADER` — teaching CADRE without boost.

STATUS: PROPOSED

---

### FSN-TWIN-PLUG

FORMATION_ID: `FSN-TWIN-PLUG`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-TWINSPAN` — `rook` / proposed `twin_span` — pack median + 1 — `isLeader` optional
- `ROLE-LINTEL` — `rook` or `bishop` / proposed `lintel_mason` — pack median — healthy bodies cannot bypass
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` (else live `wraith_bishop`, minRange 3) — pack median

VARIANT_RULES:

- Unlock after `FSN-SPAN-GATE` **or** `FSN-SPAN-PLUG`. Named Wave 7 “Twin Plug.”
- Elite: Twin-span owner only. Lintel and Sniper stay junior.
- Twin Span **is** the two-cell system **and** fills `ENEMY_SUMMON_CAP`. Do not also roll wolf/archer/pylon/turret/font/bait/span. Posts HP 1, empty kit, Strike illegal, `summonAI: "twinspan"`.
- Lintel on a gallery tile: walk onto only if walker HP% ≤ 50. LoS open. Missing maxHp fail closed.
- Sniper minRange 3. Distinct from Corner (blocked LoS) — this gun wants the plug to **create** min-range, not a wall bonus.
- Dungeon depth may not add a fifth hostile to this id.

SPELL_POOL_INTERACTIONS:

- Walking two-cell plug + healthy bodies cannot bypass. Break adjacency (push one post) and the farther dies. AoE both. Heal above 50% before crossing the lintel. Sit at Chebyshev 2 vs the sniper.

TACTICAL_PLAN:

- Owner plants both posts on a 2-wide file, then Shields nothing (empty kit — owner Strikes / holds). Lintel paints the gallery. Sniper refuses Chebyshev ≤ 2. If a post dies, the lane opens.

SYNERGY:

- Walking two-cell + lintel + sniper. Span Plug’s stationary post replaced by **independent walkers** that die if separated.

PLAYER_THREAT:

- Highest silent-wall threat in this drop after COURT. Still turn-based. Fail is Strike-the-owner while both posts live and you are healthy. Recoverable: push one post, AoE 1 HP, heal-down to cross, walk to 2.

COUNTERPLAY:

- Break the pair. File Vault over them. Null Censor (not on this pack — player tool). Sit at 2. Kill the Sniper down a gallery.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 2-wide file **plus** a file the player can take. Closet with no adjacent free cell → **reroll**.
- Lintel must not be the only cell that leaves the plug.

AI_REQUIREMENTS:

- Twinspan: summoner + cap fall-through; posts must path **independently** and die if Chebyshev > 1; do **not** reuse `summonAI: "span"`.
- Lintel: paint only if player HP% > 50 **and** a choke; skip if a Pit occupies it.
- Sniper: refuse dest Chebyshev ≤ 2.
- Soph 4–6. `groupTactics` on. `escapeRoute` (6) on the owner: wounded walks to the gallery, not through the player.

VARIANTS:

- `FSN-TWIN-PLUG/NO-LINTEL` — teaching CADRE: Twin + Sniper only.
- `FSN-TWIN-PLUG/NO-LEADER` — no boost.

STATUS: PROPOSED

---

### FSN-VEIL-CORNER

FORMATION_ID: `FSN-VEIL-CORNER`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-VEIL` — `bishop` / proposed `veil_cantor` — pack median — `isLeader` optional
- `ROLE-CORNER` — `bishop` / proposed `corner_bishop` — pack median — cashes blocked LoS
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median + 1

VARIANT_RULES:

- Unlock after `FSN-VEIL-GOAD` **and** `FSN-CORNER-FOG`. Named Wave 7 “Veil Corner.”
- Elite: Veil-leader only. Corner and Goad stay junior.
- Forced Strike into a veiled body; spells must AoE or skip. Corner needs a **public** block — Goad body-block **does** count (occupying body). Smoke is **not** on this sheet (PAIR ban with Veil).
- No Cap on this id (that is `FSN-CAP-VEIL`). No second gun.

SPELL_POOL_INTERACTIONS:

- Goad + Veil as PAIR. Corner +12 if LoS to the **Corner** would fail — standing behind the Herald can cash it. Do not also give Corner Inferno.

TACTICAL_PLAN:

- Goad, then step so the Herald occupies the LoS tile to Corner. Veil self. Corner cashes if blocked. If the player hugs the Corner, +12 dies and this is `FSN-VEIL-GOAD` plus Frost — intended.

SYNERGY:

- Veil + blocked-LoS poke + taunt. Three answers (AoE / Strike Herald / walk into open LoS), none of them a lock.

PLAYER_THREAT:

- High if you primary the Veil from behind the Herald. Low if you Slow / Absolve / hug. Spike is a 22 Corner, not a nuke.

COUNTERPLAY:

- Absolve Goad. AoE both. Strike the Herald. Walk to open LoS. Kill the Corner (hp ~0.70).

MAP_REQUIREMENTS:

- `fortress` or `arena` with pillars (natural LoS blocks) **plus** an open lane. Reroll empty `openField` with no pillar (Corner never cashes — then this is `FSN-VEIL-GOAD` and should reroll).
- ≥ 2 walk-offs. Never a closed ring.

AI_REQUIREMENTS:

- Veil / Goad as PAIR. Corner: skip unless LoS would fail.
- Soph 4–6. `groupTactics` on. Optional `isLeader` on Veil.

VARIANTS:

- `FSN-VEIL-CORNER/NO-LEADER` — teaching CADRE.
- `FSN-VEIL-CORNER/NO-CORNER` — fallback to `FSN-VEIL-GOAD`.

STATUS: PROPOSED

---

### FSN-BREAK-CHOIR

FORMATION_ID: `FSN-BREAK-CHOIR`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BREAK` — `queen` **without heal** / proposed `cadence_breaker` — pack median — `isLeader` optional
- `ROLE-IGNITE` — `queen` **without heal** / proposed `ignite_alchemist` — pack median — cashes DoTs
- `ROLE-TEMPO` — `king` / proposed `tempo_precentor` — pack median — gifts AP so the second cash lands

VARIANT_RULES:

- Unlock after `FSN-STACK-CASH` **and** `FSN-TEMPO-CHOIR`. Named Wave 7 “Break Choir.”
- Elite: Breaker-leader only. Ignite and Tempo stay junior.
- Break is **once/battle**. BASE Breaker has no Inferno — the Alchemist owns Ignite (`spell-ignite-stacks`). ELITE Breaker may hold Inferno **only after** a public first resolve (the reset is the tell, not a hidden second kit). Still one Inferno **cadence** (same id, two windows).
- Tempo gifts the Alchemist or the Breaker the turn **before** the cash. Skip duplicate Tempo. Isolated 1v1 **reroll**.
- No Thief (PAIR ban). No Lender on the base sheet (that is `/LEND`). No Glass Realm. No third DoT.

SPELL_POOL_INTERACTIONS:

- Reset Inferno / Ignite once; gift AP so the second cash lands. Player chooses: kill the Breaker on the 4 AP dump; Mute the second window; Brand the Inferno so even a reset starts later; strip stacks before Ignite.

TACTICAL_PLAN:

- Alchemist applies then waits for stacks ≥ 2. Tempo gifts that body. Breaker resets after the first public Inferno/Ignite resolve. Jackal is not here — this is a cash choir, not an execute.

SYNERGY:

- Self CD reset + ignite + tempo. Setup, gift, second window. Live `plague_rat` is **not** required (Alchemist BASE may apply one stack) — do not add a fourth body.

PLAYER_THREAT:

- High if you eat two Ignites. Still a strip / wait / kill-the-buffer. Failure is ignoring the Breaker after the first cash.

COUNTERPLAY:

- Focus the Breaker. Absolve / Cleanse stacks. Mute. Cursed Wound does not stop Ignite (not a heal). Do not triple-stack.

MAP_REQUIREMENTS:

- `openField` or `arena`. Three backliners need retreat tiles. No Time Warp. No Glass Realm.
- ≥ 2 walk-offs.

AI_REQUIREMENTS:

- Break: once/battle; heal-less; optional `isLeader`.
- Ignite: VETERAN stack gate ≥ 2.
- Tempo: ally-first; skip duplicate; high init so the gift lands first.
- Soph 4–6. `groupTactics` on. `AI_BACKLINE_PROTECT` on Tempo.

VARIANTS:

- `FSN-BREAK-CHOIR/LEND` — CADRE **Lend Fan**: replace Tempo with `ROLE-LEND` **and** replace Ignite with `ROLE-GALE` + `ROLE-FONT` would be four — **no.** Lend Fan is Lender + Gale + Font. Variant swaps Tempo→Lender and Ignite→Gale, then **adds** Font only if that would be four: **replace Breaker with Font** is wrong. Named pack is `cadence_lender` + `gale_deacon` + `font_cantor`. Variant **replaces this whole trio** (do not stack Break + Lend). Unlock after `FSN-GALE-HOLE` **and** `FSN-FONT-IRON`. Still one cone. Still one heal engine (Font pulse). Still no second CD support.
- `FSN-BREAK-CHOIR/NO-TEMPO` — fallback to `FSN-STACK-CASH` plus Breaker if Tempo apply is missing.
- `FSN-BREAK-CHOIR/NO-LEADER` — teaching CADRE.

STATUS: PROPOSED

---

### FSN-CAP-VEIL

FORMATION_ID: `FSN-CAP-VEIL`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-CAP` — `rook` / proposed `cap_warder` — pack median + 1 — `isLeader` optional
- `ROLE-VEIL` — `bishop` / proposed `veil_cantor` — pack median
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median

VARIANT_RULES:

- Unlock after `FSN-VEIL-GOAD` **and** (`FSN-PLATE-LINK` or seen absorb / a 12-cap demo). Named Wave 7 “Cap Veil.”
- Elite: Cap only. Veil and Goad stay junior. Do **not** also spawn `plate_warden` / `cover_squire` / `surplus_warder`.
- Forced swing caps at 12; spells cannot primary the veil. Two small hits beat Cap. DoT ticks do not consume.
- No Inferno dump into a fresh cap on the same round (fair-fight). No Pain Link (COURT only with Goad — not this sheet).

SPELL_POOL_INTERACTIONS:

- Turn Cap then Goad so the forced Strike is the consumed hit. Veil rejects the primary nuke. Poison then Strike is the designed answer. Wait expiry (end of next turn).

TACTICAL_PLAN:

- Cap self. Goad. Veil. Herald steps into Strike range. If Cap dies, remaining pair is `FSN-VEIL-GOAD` — intended.

SYNERGY:

- Hit cap 12 + veil + taunt. You are offered a legal 12 into the tank while the glass rejects the tile.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is dumping Inferno into a fresh cap **and** a veil.

COUNTERPLAY:

- Two chips. Wait expiry. Absolve Goad. AoE. Strike the Veil after the round. Cursed Wound the nothing — they do not heal.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Cap needs a retreat. Never a closed ring.
- No Thorned Ground on the only path to the Veil.

AI_REQUIREMENTS:

- Cap: skip if already charged; no retreat above 40% while Cap is live.
- Veil / Goad as PAIR.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on.

VARIANTS:

- `FSN-CAP-VEIL/NO-VEIL` — BRIGADE-shaped: Cap + Goad only (if Veil id is not ready).
- `FSN-CAP-VEIL/ABSOLVE` — COURT caution: do **not** add Absolver on this id as a fourth (peel is the player’s). Extra cleanse + cap + veil is a sponge, not a lesson.

STATUS: PROPOSED

---

### FSN-REEL-CORNER

FORMATION_ID: `FSN-REEL-CORNER`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-REEL` — `rook` / proposed `file_reeler` — pack median + 1 — `isLeader`
- `ROLE-CORNER` — `bishop` / proposed `corner_bishop` — pack median — blocked-LoS poke
- `ROLE-PYLON` — `rook` / proposed `pylon_prelate` — pack median — stationary 0-damage post
- Optional fourth: `ROLE-TITHE` junior **or** omit — if present, paints the reel landing, not a second file

VARIANT_RULES:

- Unlock after `FSN-REEL-TITHE` **or** `FSN-CORNER-FOG` **and** a leader-boost CADRE. Named Wave 7 “Reel Corner.”
- One elite only: the Reeler-leader. Others stay junior so boost is the late scare, not four elites.
- Pylon cap 1, lifespan 4, `ap: 0`, `mp: 0`, must not path or cast. Do not also roll wolf/archer/turret/font/bait/span/twin-span. Global summon cap still 2 — this sheet uses 1.
- Corner is the **one** elite rare. It fires only if LoS is **publicly** blocked (pylon / Herald body / wall). Solo unmarked open field → Frost, not +12.
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Reeler walks to the gallery, not through the player.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE `FSN-REEL-CORNER/LANE` (variant): drop Corner and optional Tithe — Reel + Pylon only.

SPELL_POOL_INTERACTIONS:

- Pull them behind the post, then shoot the blocked LoS. File Reel dest is the cell **behind** the pylon if a walk-off **around** remains. Pylon is a wall with HP, not a shard (that is `FSN-SHARD-BATTERY`). Tithe on the landing is optional and must not cover the gallery.

TACTICAL_PLAN:

- Turn 1–2: Prelate places the pylon on the file facing the player, then Shields it. Reel waits for shared axis. Corner waits for public block. Optional Tithe paints the landing if an exit exists.
- Leader boost 10% × fallen escort. Cut the Reeler early or accept a longer finish.
- If the pylon dies, the lane opens; Corner Frosts; Reeler may retreat.

SYNERGY:

- File pull + blocked-LoS poke + pylon. Court-scale geometry. Sophistication and a fourth body are the unlock, not a new monster.

PLAYER_THREAT:

- Highest geometry-structured threat in this drop. Still turn-based. Failure is standing on the file behind the post. Bounce / +12 is optional (open LoS).

COUNTERPLAY:

- Diagonal. Burst the 0-damage post. Occupy the landing. Gallery. Swap the Reeler. Sit adjacent to the Corner (min-range analog: hug). Kill the leader down a gallery.
- Player Barrier the reel step is fair.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a file the player can take. Never a closed ring. Weight 0 on cramped 1-tile closets.
- Pylon placement ring: ≥ 3 free cells, none void. Player must have a tile off the file.

AI_REQUIREMENTS:

- Reel: skip diagonal / safer dest / no walk-off; optional `isLeader`.
- Corner: skip unless LoS would fail (`AI-TEM-05`-style predicate).
- Pylon owner: summoner + cap/cooldown fall-through (Frost or Shield, never skip-lock). New summon AI `pylon` — do not reuse bomber or twinspan.
- Optional Tithe: landing only if an exit exists.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Reeler.
- Proposed: escorts do not path a closed box.

VARIANTS:

- `FSN-REEL-CORNER/LANE` — BRIGADE: Reel + Pylon only (ship if Corner predicate is not ready).
- `FSN-REEL-CORNER/NO-TITHE` — COURT of three.
- `FSN-REEL-CORNER/SMOKE` — replace Pylon with Smoke **only** if the run cannot support a summon engine; then this is a softer `FSN-CORNER-FOG` plus Reel — still distinct, but **do not** call it a post.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–7 still stand. This drop **meshes**; it does not replace.

```
PAIR:    CAMP-TITHE         PURSE-MUTE          HINGE-GLANCE         VEIL-GOAD
              \                 |                    |                    /
CELL:     (Post Tithe teach) SPARK-SPLIT         HINGE-WICK         (Veil teach)
              \                 |                    |                    /
BRIGADE:  POST-TITHE       PURSE-COURT        CORNER-FOG         REEL-TITHE
              \                 |                    |                    /
CADRE:    HINGE-COVER      TWIN-PLUG     VEIL-CORNER     BREAK-CHOIR     CAP-VEIL
              \                 |                    |                    /
COURT:                         REEL-CORNER
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-CAMP-TITHE` | `FSN-SPAN-GUN` **or** `FSN-GLASS-WARD` |
| `FSN-PURSE-MUTE` | `FSN-MUTE-PIT` **or** `FSN-LEDGER-LEY` |
| `FSN-HINGE-GLANCE` | `FSN-FACE-PIN` **or** `FSN-VAULT-ORIGIN` |
| `FSN-VEIL-GOAD` | `FSN-PINCH-GOAD` **or** `FSN-SMOKE-GLASS` |
| `FSN-SPARK-SPLIT` | `FSN-KENNEL-LITANY` **or** `FSN-ACT-GIFT` |
| `FSN-HINGE-WICK` | `FSN-WICK-STEP` **or** `FSN-TRADE-HOLE` |
| `FSN-POST-TITHE` | `FSN-CAMP-TITHE` |
| `FSN-PURSE-COURT` | `FSN-PURSE-MUTE` |
| `FSN-CORNER-FOG` | `FSN-SMOKE-GLASS` + `FSN-SPAN-GUN` |
| `FSN-REEL-TITHE` | `FSN-CAMP-TITHE` + (`FSN-FACE-PIN` or seen Oncoming) |
| `FSN-HINGE-COVER` | `FSN-HINGE-GLANCE` + `FSN-BRAND-COVER` |
| `FSN-TWIN-PLUG` | `FSN-SPAN-GATE` **or** `FSN-SPAN-PLUG` |
| `FSN-VEIL-CORNER` | `FSN-VEIL-GOAD` + `FSN-CORNER-FOG` |
| `FSN-BREAK-CHOIR` | `FSN-STACK-CASH` + `FSN-TEMPO-CHOIR` |
| `FSN-CAP-VEIL` | `FSN-VEIL-GOAD` + (`FSN-PLATE-LINK` or seen absorb) |
| `FSN-REEL-CORNER` | (`FSN-REEL-TITHE` or `FSN-CORNER-FOG`) + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 8 packs (PR #558) and leftover spell verbs (not this drop)

Sibling [`docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md) (open as PR #558) stamped world-pack families that consume SPELL_PROPOSALS Wave 7 (PR #525). This catalog already packed Wave 7 families from PR #535. Drop 9 owns the Wave 8 packs; do **not** duplicate those family ids here.

| Named pack (PR #558 §3) | Members | Lesson |
| :--- | :--- | :--- |
| Wall File | `wall_stinger` + `pylon_prelate` + `file_brander` | Plant the wall, cash the hug, then brand the file |
| Boot Spare | `boot_stinger` + `spare_pacer` + `gait_muter` | Buy the step, sting, mute their walk back |
| Face Glance | `face_shover` + `glance_ward` + `oncoming_knight` | Write facing, then Glance / Oncoming the new front |
| Slip Pit | `slip_squire` + `wick_painter` + `file_brander` | Slip off the file; the origin becomes a pit next turn |
| Pivot Wick | `pivot_ward` + `wick_painter` + `axis_locksmith` | Clockwise onto the wick; they cannot walk off the file |
| Triple Plug | `triple_span` + `lintel_mason` + `glass_sniper` | Three-cell plug + healthy bodies cannot bypass |
| Crack Verse | `cadence_cracker` + `once_cantor` + `ignite_alchemist` | Restore Inferno, then ban recasting it |
| Hood Choir | `hood_lurker` + `ignite_alchemist` + `ash_absolver` | Skip the fat tick, then strip leftover stacks |
| Share Goad | `share_warden` + `goad_herald` + `cap_warder` | Forced swing splits, then the ally’s half caps at 12 |
| Boon Boot | `boon_mason` + `boot_stinger` + `spare_pacer` | Refund the leave, sting after the paid step |
| Dull Sill | `dull_censor` + `pet_siller` + `leash_cutter` | Strike deals 0, pets cannot park, remaining life → 1 |
| Wick Face | `wick_painter` + `face_shover` + `fuse_binder` | Shove onto the wick / fuse before convert |
| Brand Reel | `file_brander` + `file_reeler` + `wall_stinger` | Pull onto the file, brand, hug-sting the wall |
| Spare Slip | `spare_pacer` + `slip_squire` + `post_stinger` | Extra MP to stand, or slip to a post |
| Sill Brood | `pet_siller` + `brood_chanter` + `spark_chanter` | Hostile pets cannot enter; Spark still wants to die on **their** turn |

Do **not** pack `triple_span` until `ENEMY_SUMMON_CAP` remaining ≥ 3 (live cap is 2 — honesty gate). Do **not** pack `act_sexton` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-execute lesson; `FSN-ACT-GIFT` stays the turn-start 14 lesson; `FSN-SPARK-SPLIT/BELL` stays leftover-AP → armed 14.

Sibling [`docs/automation/SPELL_PROPOSALS_2026-09-25.md`](../automation/SPELL_PROPOSALS_2026-09-25.md) (open as PR #563) stamped Wave 8 verbs that **still have no family**. Elite-evolution Wave 8 left those for Wave 9. This catalog does **not** mint `FSN-*` ids that require Wave 8 verbs.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–7, plus Wave 7 verbs in this order (from elite-evolution Wave 7 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` 69–128 / 270–271).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse. Post / Purse / Corner / Hinge / Reel / Veil / Break / Lender / Splitter / Tithe / Spark / Cap **must not** carry `starter-heal`.
4. **Battle-walk walk-MP spent writer** — hard gate for every Post Sting sheet. Forced-move / Swap / Vault / Hinge does **not** increment. Missing field fail closed (12 only).
5. **Battle-walk `currentView` writer** — still required for Glance / Oncoming escorts (`FSN-HINGE-GLANCE`, `FSN-HINGE-COVER`, `FSN-REEL-TITHE`). Ties fail closed.
6. Ally buff apply (`targetId` on Shield / Iron Skin / Tempo / Lend / Split). Cover hit-consume pipeline **before** `dealDamage` formula edits (`FSN-HINGE-COVER`).
7. `applyAttract` spell caller for File Reel (shared axis only). Dest legality (not lava / pit / fuse / sealed aisle).
8. Hinge Step occupancy teleport (clockwise adjacent of allied pivot). Hinge Tile enter-swap — **not** `isTrap` / `placeBarrier`. Nail Down fizzles the painter.
9. Twin Span `summonAI: "twinspan"` allow-list (admin + `inferSummonArchetype` key, never `name.includes("Twin")`) + summoner fall-through + Chebyshev-1 death rule. Spark `summonAI: "spark"` + current-actor AP grant on death.
10. Aim Veil targeting reject for `targetType: enemy` / `self` (AoE still hits). Attack Nearest must skip. Turn Cap `min(applied, 12)` after RES/SR — do not edit `combatMath.ts` percents.
11. Exit Tithe leave-cell AP tax (`recordChallengeApSpend` if the walker is the player). Forced-move free. Cadence Break once/battle last-owned-id → 0 remaining (never copy, never reset Break itself).
12. Cap the summoner overlay (`WX` 11932–11942). COURT pylon / CADRE twin-span / spark sheets assume the lottery does not add a second engine.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order splices, or damage-formula edits. Map **selection** is a filter on already generated maps. Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-CAMP-TITHE`, `FSN-POST-TITHE` | walk-MP spent writer; Tithe never the only aisle |
| `FSN-PURSE-MUTE`, `FSN-PURSE-COURT` | leftover-AP reader; Mute not Mute Thread |
| `FSN-HINGE-GLANCE`, `FSN-HINGE-COVER` | Hinge dest occupancy; Glance needs `currentView` or Frost fallback |
| `FSN-VEIL-GOAD`, `FSN-VEIL-CORNER`, `FSN-CAP-VEIL` | Aim Veil targeting reject + Goad legal-target rewrite; Cap `min(12)` |
| `FSN-SPARK-SPLIT` | `summonAI: "spark"` + current-actor grant + summoner fall-through |
| `FSN-HINGE-WICK` | Hinge Tile not `placeBarrier`; fuse dest gallery |
| `FSN-CORNER-FOG` | live `hasLoS` invert; Span second cell; open pit does not pay |
| `FSN-REEL-TITHE`, `FSN-REEL-CORNER` | File Reel `applyAttract` caller + dest legality |
| `FSN-TWIN-PLUG` | `summonAI: "twinspan"`; Chebyshev > 1 kills farther post; fills summon cap |
| `FSN-BREAK-CHOIR` | once/battle remaining CD → 0 on last owned id; Tempo ally apply |
| `FSN-REEL-CORNER` | pylon AI (`ap: 0`, `mp: 0`, no path) + Corner `bounceOn`-style LoS predicate |

---

## Sources (line-accurate, 2026-09-25)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 202–221, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942; zone object 4683–4687
- Family lottery + HP overwrite: `spawnPolicy.ts` 35, 49–57, 69–128, 261–271; WX 5864–5866, 11970–11974
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16819
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 336–337
- Push / attract (no caller): `src/frontend/src/engine/occupancy.ts` 482, 537
- Cast AP-only: `WorldExploration.tsx` `executeCastAttempt` 17096+
- Trap-as-barrier: `src/frontend/src/engine/spellEngine.ts` 442–445
- Area Chebyshev: `src/frontend/src/engine/targeting.ts` 690–727
- Gates, summon cap, kamikaze: `src/frontend/src/data/gameConstants.ts` 200–209, 266–301
- Families / `currentView`: `src/frontend/src/types/gameTypes.ts` 12–20, 297
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–291)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 7 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md` (PR #535) §3–§4
- Wave 8 families (deferred): `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md` (PR #558) §3
- Drop 7: `docs/design/ENEMY_FORMATIONS_2026-09-24.md` (PR #537)

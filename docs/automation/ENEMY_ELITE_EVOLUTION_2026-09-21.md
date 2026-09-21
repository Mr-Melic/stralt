# Enemy and Elite Evolution Design — Wave 4

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-21  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Fourth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 3 verbs** (first `mpCost > 0`, cone `areaShape`, two-hostile swap, self knockback, portal-pair, evade-next-hit, distance-scaled shot, MP steal, walk-block LoS-open pit, stationary healer font, ally range share, moved-this-turn brand, unit next-cast AP tax, conveyor slide, walk-axis lock, mass shove as CHAMPION witness). Bosses stay on the existing catalog.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 3

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 3 closed as docs in the 2026-09-02 pass. SPELL_PROPOSALS Wave 3 (`SPELL_PROPOSALS_2026-09-02.md`) stamped the seven verbs Wave 3 explicitly held. No Wave 1–3 family sheet shipped.

`WorldExploration.tsx` is now **19,213** lines (Wave 3 quoted 19,253). Family overlay **moved** into `engine/spawnPolicy.ts` (extracted, same 30% roll + fractional `res`/`sp`). Line numbers below are this checkout.

| Wave 3 claim | 2026-09-21 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–3 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287; WX 5862–5866 | Still true (extracted, same math) |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true (`enemyAI.ts` 194–199 `Math.floor(levelZone)`) |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Wave 2 still owns player-push/pull; this wave uses **self** push and **conveyor** enter-push |
| `isTrap` | `spellEngine.ts` 442 → `placeBarrier(..., 3)` | Still a fake wall. Wave 2 `trip_mason` still owns the redefine |
| `areaShape` | Typed on `SpellConfig` (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 694–721) | Wave 4 `fan_prelate` is the cone **reader** family |
| `executeCastAttempt` | `WX` 17096–17205: AP gate + debit only | First `mpCost > 0` family is **illegal to ship** without MP debit |
| Portals in occupancy | `occupancy.ts` 13–14, 40: map portals **impassable** | Twin Gate pads must **not** reuse this set |
| `CharacterStats.evasion` | Persisted; unread in combat | Sidestep is `evadeNextHits`, not a miss formula |
| Delayed tile fuse / instant execute / DoT consume / range shrink / AP grant / ally cleanse / ice / smoke / tile-gravity / ally pull / pylon / taunt / shared HP | Still absent in live catalog | Wave 3 still owns those ids |

**Wave 1 ids — do not re-propose:**  
`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `crimson_spawn`, `shadow_lurker`, `storm_caller`, `glass_sniper`, `cinder_martyr`, `pale_cantor`, `hex_chorister`, `leash_warden`, `null_censor`, `rift_hook`, `brood_chanter`, `glyph_sower`, `blink_cutter`, `coil_arbiter`, `rust_reaver`.

**Wave 2 ids — do not re-propose:**  
`rank_lancer`, `bash_bruiser`, `snare_weaver`, `trip_mason`, `void_anchoret`, `bell_sexton`, `execute_jackal`, `plate_warden`, `pain_suture`, `stone_castellan`, `ricochet_vicar`, `tax_scribe`, `mist_walker`, `leech_familiar`.

**Wave 3 ids — do not re-propose:**  
`fuse_binder`, `coup_duelist`, `ignite_alchemist`, `dim_optic`, `tempo_precentor`, `ash_absolver`, `plus_cutter`, `rime_mason`, `smoke_thurifer`, `sink_chanter`, `hook_chaplain`, `pylon_prelate`, `goad_herald`, `twin_tether`.

---

## 1. Shared rules (inherit Wave 1 §2)

This pass does **not** retune `pickEnemyLevelFromTiers` percents, RAF, map generation, turn order, or damage math.

Reuse Wave 1:

- Relative band `R = enemy.level - player.level`, `T = tierSize` (default 10).
- Stat ratios after `calcEnemyMaxHp` / `getEnemyBaseStats` — family HP must **survive** battle start.
- Variant floors: BASE min `aiTier` 1, VETERAN 3, ELITE 6, CHAMPION 8.
- Rarity second roll after level pick (`wVeteran` / `wElite` / `wChampion` vs `R/T` + dungeon depth).
- Rewards: 1.00 / 1.15 / 1.35 / 1.60× on existing `level * 20` XP and Doka, **only** through `applyRewards`.
- Explicit `aiProfile` on every family. Non-healers: no `healAmount` in CORE.
- Preferred chassis forced on family roll.
- `usableByEnemy: false` stays false unless a sheet flips **that one id**.
- Proposed spells are `SpellConfig` rows with flags — never `spell.name` heuristics.

**Fifth variant (Wave 2 specified the 2% `wRare` skin):** palette + **one borrowed RARE spell from this family's allowed categories**. Never borrow a forbidden category. Never a new persist stat. This run does not invent a generator.

**Stationary-post cap (extend Wave 3):** one pylon **or** turret **or** mercy font in the same pack, not two. Font shares `ENEMY_SUMMON_CAP`. Do **not** also roll wolf/archer overlay onto a font body.

---

## 2. Why Wave 4 exists (gaps Waves 1–3 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs** (push, caster-pull, root, trap, linear file, delayed unit execute, absorb, redirect, offensive turret, conditional bounce, zone AP tax, self-dash, sacrificial familiar). Wave 3 covered SPELL_PROPOSALS Wave 2 verbs (tile fuse, instant execute, DoT cash, range shrink, AP grant, ally cleanse, plus `hitTiles`, ice paint, smoke LoS, tile-gravity, ally rescue, 0-damage pylon, taunt, shared HP).

SPELL_PROPOSALS Wave 3 (`SPELL_PROPOSALS_2026-09-02.md`) then stamped the seven holes Wave 3 **held** plus nine sibling verbs. No family owns them yet. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

| Unused Wave 3 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-ley-toll` (first `mpCost > 0`) | `tempo_precentor` (AP next turn); `hex_chorister` (Enrage / Haste) | Tempo gifts **actions**. Haste gifts **walk**. Ley spends **current MP** to prime the next nuke. |
| `spell-fan-bolt` (`areaShape: "cone"`) | `plus_cutter` (`hitTiles` plus); `storm_caller` (always bounce) | Cone is a **facing wedge**. Plus is geometry around a target. Bounce is a table. |
| `spell-pawn-trade` (two hostiles swap, caster stays) | `rift_hook` (caster ↔ player); `blink_cutter` (ally swap) | Broker never moves. The two **player-side** bodies trade. |
| `spell-back-step` (self knockback) | `bash_bruiser` (they move); `mist_walker` (chosen free cell) | Recoil needs a body to kick off. Empty-tile blink is Mist. |
| `spell-twin-gate` (walkable pad pair) | `mist_walker` / `wraith_bishop` / `blink_cutter` | Pads are a **path**, not a body teleport. Map `portals` are impassable — must not reuse that set. |
| `spell-sidestep-ward` (`evadeNextHits`) | `plate_warden` (absorb); `void_mirror` (reflect) | One incoming instance **misses**. Not RES. Not a percent-evasion formula. |
| `spell-far-sting` (distance-scaled) | `glass_sniper` (min-range, **flat**) | Close is worse than Strike. Far is Frost-adjacent. Glass is a gun with a dead zone. |
| `spell-soul-sip` (zero-sum current MP) | `coil_arbiter` (Slow / Frost **debuff**); `tax_scribe` (tile AP) | Sip does not linger. They lose 1 **now**, caster gains 1 **now**. |
| `spell-open-pit` (walk-block, LoS **open**) | `spell-barrier` (solid); `smoke_thurifer` (walkable LoS-block); `pylon_prelate` (unit wall) | Pit is the opposite of Smoke. Artillery loves it. Melee hates it. |
| `spell-mercy-font` (stationary heal totem) | `pale_cantor` (caster heals); `pylon_prelate` (empty kit); `stone_castellan` (shoots); Wisp (walks) | Font does **not** path. Pulse is ally-target heal. Planting is not a heal. |
| `spell-lens-share` (ally `modifiableRange`) | `dim_optic` (range shrink); Lens Shift / Overcast (self) | Share writes the **ally**. Optic writes the **hostile**. |
| `spell-stride-brand` (`movedThisTurn` bonus) | `execute_jackal` (HP% wait); `coup_duelist` (instant 25%) | Brand punishes **leaving the cell**, not a health window. Still Brand (Discovery W2, stand-punish) stays unfamilied. |
| `spell-hex-toll` (next **spell** +1 AP) | `tax_scribe` (tile); `spell-drain-courage` (immediate −1 current AP) | Unit-scoped. Walk does not consume it. Inferno becomes 5. |
| `spell-slide-tile` (enter → auto-push 1) | `rime_mason` (ice MP tax); `sink_chanter` (pull toward tile); `bash_bruiser` (cast push) | Conveyor is **enter**. Ice does not move you. Sink is gravity, not a stored dir. |
| `spell-rank-lock` (walk rank **or** file) | `snare_weaver` (root = 0 walk); `rank_lancer` (linear **attack**) | They may walk. Only on one axis. Forced move still works. |
| `spell-board-tilt` (mass shove, `NOT_PLAYER_LEARNABLE`) | `bash_bruiser` (one body); Void Collapse (attract + 80) | Witness-only scramble. **Not** a new family — CHAMPION of `slide_mason`. |

`spell-font-pulse` is kit-only on the font, not a family.  
`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** family Discovery W2 `spell-still-brand` / `spell-grounded-lock` this pass (stand-punish and anti-blink are different sentences; they stay held).

---

## 3. Encounter synergy packs (Waves 1–4)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one pylon **or** turret **or** font, not two, in the same pack.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Ley Court | `ley_tollkeeper` + `soul_siphon` + `far_stinger` | Steal the 2 MP, prime, sting from 4–5 |
| Fan File | `fan_prelate` + `axis_locksmith` + `snare_weaver` | Axis-lock then cone the wedge |
| Trade Trap | `pawn_broker` + `pit_mason` + `fuse_binder` | Trade the safe body onto pit/fuse |
| Recoil Hunt | `recoil_squire` + `far_stinger` + `sidestep_warder` | Kick to min-range, sting, miss the close |
| Gate Court | `twin_porter` + `slide_mason` + `stride_hunter` | Pad/slide sets `movedThisTurn`, then brand |
| Font Gate | `font_cantor` + `leash_warden` + `iron_golem` | Stationary pulse behind a wall |
| Lens Battery | `share_optic` + `glass_sniper` + `far_stinger` | +range on the gun; Optic is the **counter** pack, not this one |
| Hex Ledger | `hex_teller` + `far_stinger` + `glass_sniper` | Tax the long cast (do **not** add `tax_scribe` as PAIR) |
| Pit File | `pit_mason` + `rank_lancer` + `far_stinger` | LoS tunnel; melee cannot step the file |
| Slide Slam | `slide_mason` + `bash_bruiser` + `stride_hunter` | Push then conveyor then brand |
| Evade Goad | `sidestep_warder` + `goad_herald` + `ash_absolver` | Forced swing misses; Absolve the taunt |
| Push School | `recoil_squire` + `bash_bruiser` + `pit_mason` | Teaching contrast: they move vs you move; pit on the follow |
| Lens Duel | `share_optic` + `dim_optic` + `glass_sniper` | COURT only — last-writer range war |
| Broker Pit | `pawn_broker` + `trip_mason` + `goad_herald` | Taunt the front, trade them onto wire |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), and Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse).

Do **not** pack `twin_porter` with `mist_walker` as a PAIR (two self-teleports). They may share a COURT later.  
Do **not** pack `font_cantor` with `pale_cantor` as a PAIR (two heal sources).  
Do **not** pack `pawn_broker` with `rift_hook` as a PAIR (two swaps).  
Do **not** pack `hex_teller` with `tax_scribe` or `coil_arbiter` as a PAIR (two AP engines — COURT only).  
Do **not** pack `stride_hunter` with `execute_jackal` / `coup_duelist` as a PAIR (three “wait for the window” assassins).  
Do **not** pack `far_stinger` with `glass_sniper` as a PAIR without `share_optic` (two snipers, same lesson). Lens Battery is the COURT that makes the difference readable.  
Do not spawn Fan File on a map with no 3-tile wedge. Do not spawn Gate Court in a 1-tile closet (solvability). Pits are battle-time paints — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 4

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-02.md`](./SPELL_PROPOSALS_2026-09-02.md) unless marked otherwise.

---

### ENEMY_ID: `ley_tollkeeper`

- **NAME:** Ley Tollkeeper
- **ROLE:** buffer (MP spend to prime)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** `starter-heal`. Distinct from `tempo_precentor` (AP grant) and `hex_chorister` (Enrage / Haste). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if `currentMp < 2`. Peer: Ley Toll only if a damaging id is off cooldown **and** leftover MP still allows a 1-step if they need it. Above: skip prime as the last action of the turn if they still need to walk (SPELL_PROPOSALS: never prime-then-stuck).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 1.00, res 0.80, init 1.20, chc 0.90. Identity is **the 2-MP decision**, not a fatter Frost. If Ley Toll ships without an MP debit, this family is illegal.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "prime_if_mp_ge_2_and_nuke_ready"`. VETERAN: skip if `currentMp < 2` or no damaging id ready. ELITE: prime only when Far Sting / Fan / Frost is the follow-up this or next turn. CHAMPION: Soul-Sip pack so the stolen MP **pays** the toll (readable two-body).
- **CORE_SPELL_POOL:** `spell-ley-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `starter-poison`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` (the primed nuke — only if leftover AP/MP can actually fire it)
- **ELITE_SPELL_POOL:** none new — CHAMPION is pack-pay, not a second multiplier
- **SIGNATURE_MECHANICS:** `mpCost: 2`, `nextSpellDamageMul: 1.25`, one charge. Charge consumes even on fizzle. Last writer, no stack. Distinct from Enrage (+40% for 2 **turns**, 0 MP) and Mark (tile ×2). Challenge `hard_3` still counts AP, not MP.
- **VARIANT_PROGRESSION:** BASE frost-or-prime → VETERAN mp-gate → ELITE prime-the-follow-up → CHAMPION sip-pays-toll
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on `arcane_surge` / `arcane_overflow`.
- **SYNERGIES:** `soul_siphon`, `far_stinger`, `fan_prelate`
- **WEAKNESSES:** Ice / slide so they cannot pay; Hex Toll the primed body; force the fizzle
- **PLAYER_COUNTERPLAY:** Walk them off MP; Quiet Hex / Hex Toll; close to min-range of the primed gun
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-ley-toll` (ENEMY_DISCOVERY — family observe is the door)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** MED (MP gate in `executeCastAttempt` / `planPlayerCastAttempt`; enemy MP must exist on the decide context)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `fan_prelate`

- **NAME:** Fan Prelate
- **ROLE:** artillery (cone)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `king` **without** heal. Distinct from `plus_cutter` (plus via `hitTiles`) and `storm_caller` (bounce). Reroll on maps with no 3-tile wedge (tiny `ruinsIslands` pockets).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the wedge covers < 2 hostiles. Peer: Fan Bolt only if two player-side bodies sit in the 90° wedge. Above: refuse Fan without geometry (Frost / Mark instead).
- **STAT_SCALING_RULE:** hp 0.85, sp 1.20, sr 0.90, res 0.80, init 1.00, chc 1.05. Payload is 10×bodies in the wedge, not a bigger Inferno.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cone_if_two_hostiles_in_wedge"`. VETERAN: count cone occupancy via the shared cone helper, never name. ELITE: wait one turn if Axis Lock / Root will hold the wedge. CHAMPION: origin facing so the player cannot hug (Chebyshev 0 excluded).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-mark`
- **ADVANCED_SPELL_POOL:** `spell-fan-bolt`, `starter-blast` (only if two bodies already stacked **and** Fan is on CD — else skip)
- **RARE_SPELL_POOL:** `thunder_clap`
- **ELITE_SPELL_POOL:** none — honesty is the elite. Do **not** fake Fan with a static `hitTiles` list.
- **SIGNATURE_MECHANICS:** `areaShape: "cone"`, radius 3, 8-dir facing or 45° neighbor. Until `targeting.ts` **reads** `areaShape`, this family must not ship as a Chebyshev blob. Distinct from Nova (circle) and Cross Cut (plus).
- **VARIANT_PROGRESSION:** BASE frost+mark → VETERAN cone-gate → ELITE wait-for-lock → CHAMPION facing-discipline
- **RARITY_CURVE:** Standard. +ELITE on `arcane_surge` / `chessboard`.
- **SYNERGIES:** `axis_locksmith`, `snare_weaver`, `slide_mason`
- **WEAKNESSES:** Back-diagonal of the facing; Barrier a spoke; hug the caster
- **PLAYER_COUNTERPLAY:** Step off the wedge; split from the Wisp; LoS break a spoke
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-fan-bolt` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (first `areaShape` reader; preview === live === execute)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pawn_broker`

- **NAME:** Pawn Broker
- **ROLE:** displacement specialist (two-hostile swap)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king` or `queen` **without** heal. Distinct from `rift_hook` (caster ↔ player) and `blink_cutter` (ally swap). Reroll if pack size is 1 **and** the player has no summon (needs two hostiles).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if only one player-side body. Peer: Pawn Trade if the swap puts the player onto pit / fuse / wire / slide **or** puts the Wisp into melee. Above: skip if the swap is safer for the player.
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.85, init 1.25, chc 0.80. **0 damage on the trade.** If it is topping the meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "swap_two_hostiles_if_improves_frontline"`. VETERAN: fizzle-aware (no second body in radius 3 → do not spend). ELITE: trade onto ally hazard, never random. CHAMPION: Goad-ally pack so the frontliner is the one they did not want to be.
- **CORE_SPELL_POOL:** `spell-pawn-trade`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on a landing cell (decoy vs real hazard), `spell-slow` after they land
- **RARE_SPELL_POOL:** `spell-swap` **only if** `rift_hook` is absent (do not double-swap a pack)
- **ELITE_SPELL_POOL:** none — CHAMPION is better trades, not Void Collapse
- **SIGNATURE_MECHANICS:** `swapTwoHostiles` — caster stays. Not `isSwap`. Hazard on landing **must tick**. Distinct from Twin Gate (pads) and Recoil (self push).
- **VARIANT_PROGRESSION:** BASE trade-if-two → VETERAN no-fizzle → ELITE hazard-trade → CHAMPION goad-then-trade
- **RARITY_CURVE:** Standard. +ELITE when the player last battle used a summon (optional history; skip if none).
- **SYNERGIES:** `pit_mason`, `fuse_binder`, `trip_mason`, `goad_herald`
- **WEAKNESSES:** Isolate (one body); Self Anchor; stay outside the pair radius
- **PLAYER_COUNTERPLAY:** Desummon; stand 4+ from the pet; Barrier the landing cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pawn-trade` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy pair swap; new flag, not `swapPositions`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `recoil_squire`

- **NAME:** Recoil Squire
- **ROLE:** kiter / anti-melee (self knockback)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `pawn`. Distinct from `bash_bruiser` (they move) and `mist_walker` (chosen free cell).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if already at range 2–3. Peer: Back Step if adjacent **and** the push cell is free and non-hazard. Above: skip if already at Far-Sting range or the push cell is a pit / lava.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.85, sr 0.90, res 0.85, init 1.30, chc 1.00. MP 4. Threat is **the space it creates**, not Strike.
- **AI_TIER_PROGRESSION:** Profile `flanker` with `aiHint: "self_push_if_adjacent_and_unsafe"`. VETERAN: skip if dest is pit / lava / void. ELITE: step onto own Twin Gate pad / slide (pack). CHAMPION: Back Step then Far Sting next turn (readable two-step; do not put Far Sting on CORE).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-back-step`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-haste` (self, after the kick)
- **RARE_SPELL_POOL:** `spell-shadow-veil`
- **ELITE_SPELL_POOL:** none — CHAMPION is kick-then-sting via pack, not a new formula
- **SIGNATURE_MECHANICS:** `applyPushback` on the **caster**, distance 2, from an adjacent hostile. Corner = 0. Sets `movedThisTurn`. Distinct from Shoulder Bash.
- **VARIANT_PROGRESSION:** BASE kick-if-adjacent → VETERAN dest-check → ELITE pad/slide landing → CHAMPION create-range
- **RARITY_CURVE:** Standard. +ELITE in Recoil Hunt.
- **SYNERGIES:** `far_stinger`, `twin_porter`, `sidestep_warder`, `pit_mason` (pit behind the player so they cannot follow)
- **WEAKNESSES:** Corner them; Root before the kick; occupy the two tiles behind
- **PLAYER_COUNTERPLAY:** Fight in a closet; Slow after they land; do not give them a 2-tile aisle
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-back-step` (CHALLENGE `easy_3` is the official door — family observe is a **second** door; do not double-grant)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (resolver exists; zero cast callers today)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `twin_porter`

- **NAME:** Twin Porter
- **ROLE:** teleporter (portal-pair)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `mist_walker` (self dash), `wraith_bishop` (swap), `blink_cutter` (ally swap). At most one per pack. Weight 0 on 1-tile closets.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: plant pad B behind self if kiting. Peer: skip if dest is adjacent to the player (they will use it). Above: plant B onto a slide / Mark, never onto a pit (pit is not `isCellFree` — teleport fizzles).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.05, res 0.80, init 1.15, chc 0.80. **0 damage on the plant.**
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "gate_behind_self_if_kiting"`. VETERAN: skip if dest is adjacent to the player. ELITE: pad B on a slide / fuse approach, not on the fuse cell itself if last-writer would wipe the pad. CHAMPION: Back-Step-ally onto pad A (pack).
- **CORE_SPELL_POOL:** `spell-twin-gate`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on pad B (amp whoever arrives), `spell-slow`
- **RARE_SPELL_POOL:** `spell-shadow-veil` (after planting)
- **ELITE_SPELL_POOL:** Do **not** unlock Mist Step / Swap as identity
- **SIGNATURE_MECHANICS:** Two **walkable** pads in a new `gatePads` table. Must **not** use occupancy `portals` (impassable). Enter (walk/push/pull/slide/swap) teleports once per event. Barrier replaces a pad. Death-realm portal guards do **not** fire. Second cast replaces this caster’s pair.
- **VARIANT_PROGRESSION:** BASE kite-pad → VETERAN no-gift-to-player → ELITE combo-pad → CHAMPION recoil-onto-A
- **RARITY_CURVE:** Standard. +ELITE on `void_rift` / open `chessboard`.
- **SYNERGIES:** `slide_mason`, `stride_hunter`, `recoil_squire`, `fuse_binder` (fuse the **approach**, not the dest pad)
- **WEAKNESSES:** Occupy dest; Barrier dest; stand off the pads
- **PLAYER_COUNTERPLAY:** Sit on pad B; Barrier it; use the pair yourself
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-twin-gate` (BOSS `void_grandmaster` is the official door — family observe is a **second** door; do not double-grant)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** HIGH (new tile table; walk + forced-move enter; must not touch map generation or world portals)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `sidestep_warder`

- **NAME:** Sidestep Warder
- **ROLE:** kiter / tank-lite (evade next hit)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `plate_warden` (absorb), `void_mirror` (reflect), and `tide_shade` (MP kite).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Sidestep if the player is adjacent and can Strike. Peer: skip if Ward Plate is already up on this body (do not double-layer). Above: Goad-ally pack so the forced swing is the one that misses.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.80, sr 0.95, res 0.90, init 1.25, chc 1.10. **Lower HP than golem** — the miss is the extra life. Do **not** write `buffStat: "evasion"` (unread; would become a damage-math change).
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "evade_if_player_adjacent_and_can_strike"`. VETERAN: skip if already charged. ELITE: evade then Back Step (pack) or stay and waste the Strike. CHAMPION: Goad pack — they must throw the swing you dodge.
- **CORE_SPELL_POOL:** `spell-sidestep-ward`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-shadow-veil`
- **RARE_SPELL_POOL:** `proposed:spell-ward-plate` only if `plate_warden` is absent
- **ELITE_SPELL_POOL:** none — CHAMPION is evade+goad, not percent miss
- **SIGNATURE_MECHANICS:** `evadeNextHits: 1`, timeout 2 turns. Next damaging `dealDamage` / spell-hit **misses** (no HP, no absorb chew, no DoT apply). AoE: first instance vs this unit misses, second hits. 0-damage control does **not** consume. Lava/spikes do not consume. Sacrifice self-HP is not incoming.
- **VARIANT_PROGRESSION:** BASE evade-if-melee → VETERAN no-refresh → ELITE evade-then-leave → CHAMPION bait-the-goad
- **RARITY_CURVE:** Standard. +ELITE in Evade Goad / Recoil Hunt.
- **SYNERGIES:** `goad_herald`, `recoil_squire`, `ash_absolver` (strips Goad after the miss)
- **WEAKNESSES:** Slow / Short Sight first; wait 2 turns; second damaging instance
- **PLAYER_COUNTERPLAY:** Control then hit; AoE twice; kill the Warder with a 0-damage setup
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-sidestep-ward` (ACHIEVEMENT `critical_striker` is the official door — family observe is a **second** door; do not double-grant)
- **REWARD_EXPECTATION:** Standard. No extra Doka for “tankiness.”
- **IMPLEMENTATION_COMPLEXITY:** MED (consume gate **before** `dealDamage`, not inside `computeDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `far_stinger`

- **NAME:** Far Stinger
- **ROLE:** sniper (distance-scaled)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `glass_sniper` (min-range **flat**). Not eligible as the **only** enemy in a 1-pack unless Recoil Hunt already supplies the kicker (if pack size is 1, reroll).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if Chebyshev == 2. Peer: Far Sting if Chebyshev ≥ 3. Above: refuse Sting at dist 2 (Frost instead); refuse if player is at 1 (below `minRange`).
- **STAT_SCALING_RULE:** hp 0.65, sp 1.25, sr 0.85, res 0.70, init 1.10, chc 1.20. Payload = 6 + 4×Chebyshev, bonus cap 16 (14 at 2, 22 at 5). Identity is **the tape measure**, not more Frost.
- **AI_TIER_PROGRESSION:** Profile `caster` with minRange 2. `aiHint: "sting_if_chebyshev_ge_3"`. VETERAN: skip dist 2 if Frost is in kit. ELITE: hold the 4–5 band (never Nova). CHAMPION: Lens-Share ally so the gun reaches 7 still capped by `maxSpellRange`.
- **CORE_SPELL_POOL:** `spell-far-sting`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark`, `spell-expose`
- **RARE_SPELL_POOL:** `proposed:spell-glass-shot` only if `glass_sniper` is absent (do not two-gun a PAIR)
- **ELITE_SPELL_POOL:** none — honesty is the elite. Do not retune live damage math; pass computed base into `dealDamage`.
- **SIGNATURE_MECHANICS:** `modifiableRange: true`, `minRange: 2`, `distanceDamagePerTile`. Short Sight **hurts** this card (decision). Distinct from File Lance (per body on a ray).
- **VARIANT_PROGRESSION:** BASE sting-or-frost → VETERAN dist-gate → ELITE hold-band → CHAMPION shared-lens
- **RARITY_CURVE:** Standard. Never CHAMPION in a solo pack. Weight ×1.5 if the player last battle used a majority range>2 kit (optional; skip if none).
- **SYNERGIES:** `ley_tollkeeper` (prime the sting), `share_optic`, `recoil_squire`, `pit_mason` (LoS tunnel), `axis_locksmith` (lock at dist 5)
- **WEAKNESSES:** Walk to Chebyshev 1; Smoke the file; Barrier
- **PLAYER_COUNTERPLAY:** Close the gap; Short Sight; hug
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-far-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (one Chebyshev multiply before `dealDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `soul_siphon`

- **NAME:** Soul Siphon
- **ROLE:** controller (MP steal)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `coil_arbiter` (Slow / Frost **debuff**) and `tax_scribe` (tile AP).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Sip if target MP ≥ 2. Peer: skip if target MP is 0 or caster is already at max MP **and** has no Ley Toll ally. Above: Sip the Wisp if the Wisp holds the walk budget.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.00, sr 1.10, res 0.80, init 1.30, chc 0.80. **0 HP damage.** If it is killing you with raw damage, the kit is wrong.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "steal_mp_if_target_mp_ge_2"`. VETERAN: skip at target MP 0 (would fizzle). ELITE: Sip then Ley-ally pack. CHAMPION: Sip then Rank-Lock so they cannot spend the last MP walking.
- **CORE_SPELL_POOL:** `spell-soul-sip`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow` (after the steal — lingering vs instant, readable two-axis), `spell-drain-courage`
- **RARE_SPELL_POOL:** `spell-weaken`
- **ELITE_SPELL_POOL:** none — CHAMPION is sip+lock pack, not a 2-MP steal
- **SIGNATURE_MECHANICS:** `stealMpAmount: 1` from **current** MP, add 1 to caster current MP this turn, cap 20. No lingering `debuffStat: "mp"`. Summons with 0 max MP fizzle. Not a heal.
- **VARIANT_PROGRESSION:** BASE steal-if-mp → VETERAN no-fizzle → ELITE pay-the-toll → CHAMPION steal-then-lock
- **RARITY_CURVE:** Standard. +VETERAN in Ley Court.
- **SYNERGIES:** `ley_tollkeeper`, `axis_locksmith`, `rime_mason` (ice tax stacks with stolen current MP — COURT, not PAIR with Arbiter)
- **WEAKNESSES:** Spend MP first; sit at 0; Second Wind after
- **PLAYER_COUNTERPLAY:** Dump walk before its init; Timestep; kill the Siphon first in Ley Court
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-soul-sip` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pit_mason`

- **NAME:** Pit Mason
- **ROLE:** hazard creator (pit) / anti-melee
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `trip_mason` (hidden enter HP+root), `smoke_thurifer` (walkable LoS-block), `pylon_prelate` (unit wall), Barrier (blocks LoS). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: pit the melee approach tile. Peer: skip if the player is already at range 4 with a long kit (you just gave them a LoS tunnel). Above: pit the only step of a Rank-Lock.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.85, sr 1.05, res 1.05, init 0.95, chc 0.80. **0 HP on the paint.**
- **AI_TIER_PROGRESSION:** Profile `caster` / setter. `aiHint: "pit_on_melee_approach"`. VETERAN: never pit a cell the player can ignore (must be on-path). ELITE: pit then Far-Sting-ally through it. CHAMPION: two pits if AP allows (cap 2 live per Mason); last-writer vs Barrier (Barrier fills).
- **CORE_SPELL_POOL:** `spell-open-pit`, `physical_attack`
- **ADVANCED_SPELL_POOL:** `starter-frost`, `spell-mark` on a **different** tile (decoy vs hole)
- **RARE_SPELL_POOL:** `spell-barrier` **only if** a family flip is approved for this id — otherwise skip (Barrier is a different identity; do not steal Smoke)
- **ELITE_SPELL_POOL:** none — CHAMPION is dual-pit discipline
- **SIGNATURE_MECHANICS:** `pitTiles` — `isCellFree` false, Bresenham **ignores** pits. Occupant at paint is **not** displaced. Teleport / Mist Step over works. Distinct from Fuse (occupancy bomb) and Rime (walkable tax).
- **VARIANT_PROGRESSION:** BASE approach-pit → VETERAN on-path-only → ELITE tunnel-for-gun → CHAMPION dual-pit
- **RARITY_CURVE:** Standard. +ELITE on `void_rift` / `corridorMaze`. Weight 0 if pack already has a Pit Mason.
- **SYNERGIES:** `far_stinger`, `rank_lancer`, `pawn_broker`, `axis_locksmith`, `recoil_squire`
- **WEAKNESSES:** Walk around; Barrier fills; Mist Step
- **PLAYER_COUNTERPLAY:** Detour; sit in the hole (you can leave); Swap the Mason onto a cell they wanted to pit
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-open-pit` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy + LoS split; AI pathing and player `findPath` both see pits)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `font_cantor`

- **NAME:** Font Cantor
- **ROLE:** summoner (stationary healer totem)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king`. Replaces random overlay on this body. Distinct from `pale_cantor` (caster heals), `pylon_prelate` (empty kit wall), `stone_castellan` (shoots), `brood_chanter` (mobile pets), Wisp (walks). At most one per pack. Do **not** also roll wolf/archer overlay. Do not co-spawn with `pylon_prelate` or `stone_castellan`.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: plant font behind the highest-threat ally. Peer: skip if cap reached. Above: plant off-axis so the pulse range 2 covers the golem **and** not an easy Strike from the player.
- **STAT_SCALING_RULE:** hp 0.85, sp 1.00, sr 1.00, res 0.90, init 0.75, chc 0.70. Font uses existing `getSummonBaseStats` with `damageScale: 0`, `hpScale: 0.6`. **No `healAmount` on the Cantor CORE** (must not infer healer and skip planting).
- **AI_TIER_PROGRESSION:** New summon AI `font` (SPELL_PROPOSALS): `mp: 0`, **must not path**, kit `spell-font-pulse` only. `inferSummonArchetype` must key `summonAI === "font"`, never `name.includes("font")`. VETERAN: skip if cap reached. ELITE: Shield the font. CHAMPION: Load-Bearing / Chain-Ward if those ids exist; else Iron Skin the font.
- **CORE_SPELL_POOL:** `spell-mercy-font` (**family flip** `usableByEnemy: true` for this id only — SPELL_PROPOSALS ships it player-first / ACHIEVEMENT)
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-iron-skin` (on the font)
- **RARE_SPELL_POOL:** `spell-haste` (on an ally, not the font — font `mp: 0`)
- **ELITE_SPELL_POOL:** Do **not** unlock turret / wolf / archer / bomber / pylon on this body.
- **SIGNATURE_MECHANICS:** Occupies. Lifespan 4. Pulse 8 ally heal range 2. Planting is **not** a heal (`no_healing` / `hard_1` trip on the **pulse**). 0 XP on font death. Cap shares `ENEMY_SUMMON_CAP`.
- **VARIANT_PROGRESSION:** BASE plant → VETERAN respect-cap → ELITE skin-the-font → CHAMPION cover-the-post
- **RARITY_CURVE:** Standard. +ELITE in Font Gate / Quiet Choir. Weight 0 on cramped 1-tile closets.
- **SYNERGIES:** `leash_warden`, `iron_golem`, `hook_chaplain`, `null_censor` is a **counter**
- **WEAKNESSES:** Kill the post (0.6 HP); Null Brand; Cursed Wound the ally it is topping
- **PLAYER_COUNTERPLAY:** Burst the font; sit on the placement cell; Cursed Wound the golem
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-mercy-font` (ACHIEVEMENT `loot_hunter` is the official door — family observe is a **second** door; do not double-grant). `spell-font-pulse` is `NOT_PLAYER_LEARNABLE`.
- **REWARD_EXPECTATION:** Standard. Font death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED (new `SUMMON_KIT.font`; do not reuse wisp / turret / pylon)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `share_optic`

- **NAME:** Share Optic
- **ROLE:** buffer (ally range)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `dim_optic` (range **shrink**) and Lens Shift / Overcast (self). At most one per pack. Reroll if no ally holds `modifiableRange: true` (BASE may self-buff if the Optic itself holds Far Sting — then it is a worse Far Stinger; **prefer reroll**).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Lens Share the ally with the longest `modifiableRange` id. Peer: skip if that ally already has a share. Above: share the Glass / Far gun, not the Frost bishop.
- **STAT_SCALING_RULE:** hp 0.70, sp 0.85, sr 1.00, res 0.80, init 1.35, chc 0.75. Init is high so the share lands **before** the gun acts. If this unit tops the damage meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer` (ally-first). Until that profile exists, do **not** put `starter-heal` on this kit. `aiHint: "range_buff_ally_with_modifiable"`. VETERAN: skip duplicate share. ELITE: share only ids with `modifiableRange: true`. CHAMPION: share then Mark the far tile the gun wants.
- **CORE_SPELL_POOL:** `spell-lens-share`
- **ADVANCED_SPELL_POOL:** `spell-haste` (the gun), `spell-enrage` (the gun)
- **RARE_SPELL_POOL:** `starter-frost` (self, only if isolated 1v1)
- **ELITE_SPELL_POOL:** none — CHAMPION is share+mark
- **SIGNATURE_MECHANICS:** `allyRangeDelta: 2` for 2 turns on the **target**. Does not write the caster’s `modifiableRangeBonusRef` unless target is self. Strike stays unmodified. Short Sight on the gun fights this (add then clamp min 1).
- **VARIANT_PROGRESSION:** BASE share-longest → VETERAN no-stack → ELITE share-the-gun → CHAMPION share-then-mark
- **RARITY_CURVE:** Standard. +VETERAN in Lens Battery. Lens Duel is COURT only with `dim_optic`.
- **SYNERGIES:** `far_stinger`, `glass_sniper`, `void_anchoret` (Hook is range-modifiable if flagged — only if that row sets it)
- **WEAKNESSES:** Isolated 1v1; kill the Optic; Short Sight the gun
- **PLAYER_COUNTERPLAY:** Focus the buffer; walk into minRange; Dim Optic is the player-side lesson (enemy Dim is the counter pack)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-lens-share` (MULTI_SOURCE already stamps bishop observe **or** `double_betrayal` — family observe **is** the bishop child; do not add a third grant)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (target-scoped copy of the existing bonus ref)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `stride_hunter`

- **NAME:** Stride Hunter
- **ROLE:** assassin / status specialist (moved-this-turn)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `execute_jackal` (HP% wait) and `coup_duelist` (instant 25%). Discovery W2 `spell-still-brand` (punish **standing**) stays **unfamilied**.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if `movedThisTurn` is false and range 1. Peer: Stride Brand only if the flag is public. Above: skip Brand if they camped (Frost instead); wait for an ally shove.
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.90, res 0.80, init 1.20, chc 1.05. 8 if they camped (worse than Frost). 8+12 if they stepped (Frost-equal, **two** hits).
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "stride_if_movedThisTurn"`. VETERAN: skip if flag is false and Strike is in kit at range 1. ELITE: path to a body an ally just pushed/slid/gated. CHAMPION: Brand after own Recoil/Bash pack (do not self-push as identity — that is Recoil).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-stride-brand`
- **ADVANCED_SPELL_POOL:** `spell-mark` (both hits can amp), `starter-frost`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** none — honesty is the elite
- **SIGNATURE_MECHANICS:** Reads `movedThisTurn` (walk, push, pull, swap landing, slide, gate teleport). Flag does not exist today — implementers must set it on occupancy commits and clear at **that unit’s** turn start. Forced move on the enemy turn still counts until their next start. Cleanse does **not** clear the flag (not a debuff).
- **VARIANT_PROGRESSION:** BASE brand-or-strike → VETERAN flag-gate → ELITE hunt-the-shove → CHAMPION pack-brand
- **RARITY_CURVE:** Standard. +ELITE in Gate Court / Slide Slam. Never CHAMPION in a solo pack.
- **SYNERGIES:** `slide_mason`, `bash_bruiser`, `twin_porter`, `pawn_broker`, `recoil_squire`
- **WEAKNESSES:** Stand still; Rank Lock / Root so they will not (or cannot) walk; Grounded Lock does not stop **walk**
- **PLAYER_COUNTERPLAY:** Camp; do not step onto slides; kill the Hunter before the shove
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-stride-brand` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (`movedThisTurn` plumbing on occupancy commits)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hex_teller`

- **NAME:** Hex Teller
- **ROLE:** debuffer (next-cast AP tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop`. Distinct from `tax_scribe` (tile) and `spell-drain-courage` (immediate −1 current AP). Distinct from `bone_scribe` (stat shred).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Hex Toll if the player holds any `apCost >= 3`. Peer: skip if the bar is all 2-cost. Above: Toll then Rank-Lock so they waste the window walking.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.00, sr 1.15, res 0.80, init 1.20, chc 0.80. **0 damage.** If it is killing you with raw damage, the kit is wrong.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "ap_tax_if_target_holds_cost_ge_3"`. VETERAN: skip if tax already live. ELITE: Toll the Inferno / Sacrifice / Fan body. CHAMPION: Toll then Drain Courage **after** they pay (visible leftover AP) — readable two-step, still not Glyph Tax.
- **CORE_SPELL_POOL:** `spell-hex-toll`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-drain-courage`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-expose`
- **ELITE_SPELL_POOL:** CHAMPION tax + drain
- **SIGNATURE_MECHANICS:** `nextCastApTax: 1` for 2 turns or until they successfully spend on a **spell**. Walk / potions do not consume. If they cannot pay, reject `no_ap` and the tax **remains**. Fizzle that spent AP consumes it. Absolve / Cleanse / Dispel strip via `cleanseTypes`, not name. Applies after Arcane Surge in `executeCastAttempt`.
- **VARIANT_PROGRESSION:** BASE tax-if-expensive → VETERAN no-refresh → ELITE tax-the-nuke → CHAMPION tax-then-drain
- **RARITY_CURVE:** Standard. +ELITE in Hex Ledger / dungeons. Do **not** PAIR with `tax_scribe` or `coil_arbiter`.
- **SYNERGIES:** `far_stinger`, `glass_sniper`, `fan_prelate`, `ley_tollkeeper` is a **mirror** (your prime vs their tax)
- **WEAKNESSES:** Cast a 2-cost tool to burn the tax; wait 2 turns; Absolve
- **PLAYER_COUNTERPLAY:** Cheap Strike; sit the window; kill the Teller first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hex-toll` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (one flag in the AP gate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `slide_mason`

- **NAME:** Slide Mason
- **ROLE:** displacement specialist (conveyor) / hazard creator
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` **without** heal, or `bishop`. Distinct from `rime_mason` (ice MP tax), `sink_chanter` (pull toward tile), `bash_bruiser` (cast push). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: paint a slide whose stored dir is toward a wall / hazard **or** off melee. Peer: skip if the stored dir is blocked (would no-op). Above: paint the only legal Rank-Lock step.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.90, sr 1.00, res 0.85, init 1.05, chc 0.80. **0 HP on the paint.**
- **AI_TIER_PROGRESSION:** Profile `caster` / setter. `aiHint: "slide_toward_hazard_or_off_melee"`. VETERAN: skip no-op dirs. ELITE: slide toward pit / fuse / cinder **one cell further**. CHAMPION: may cast `spell-board-tilt` (`NOT_PLAYER_LEARNABLE`) only if ≥3 other bodies would move **and** a paint already exists in that dir.
- **CORE_SPELL_POOL:** `spell-slide-tile`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the dest cell of the slide, `spell-slow`
- **RARE_SPELL_POOL:** `proposed:spell-shoulder-bash` only if `bash_bruiser` is absent
- **ELITE_SPELL_POOL:** CHAMPION `spell-board-tilt` (witness only — **never** written to owned ids)
- **SIGNATURE_MECHANICS:** Enter → `applyPushback` 1 along stored 8-dir from caster→cell. Standing at paint does **not** slide. One slide per cell; no bounce-loop in the same enter. Sets `movedThisTurn`. Barrier clears. Distinct from Twin Gate (teleport) and Rank Lock (walk constraint).
- **VARIANT_PROGRESSION:** BASE on-path-slide → VETERAN no-noop → ELITE hazard-dir → CHAMPION mass-tilt
- **RARITY_CURVE:** Standard. +ELITE on lava/spike / `slime_flood`. Weight 0 if pack already has a Slide Mason.
- **SYNERGIES:** `stride_hunter`, `bash_bruiser`, `pit_mason`, `fuse_binder`, `twin_porter`
- **WEAKNESSES:** Do not enter; Barrier the cell; enter from a dir that slides you to safety
- **PLAYER_COUNTERPLAY:** Detour; occupy the cell; Root before you would step
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-slide-tile` (ENEMY_DISCOVERY). `spell-board-tilt` observation may record; **grant never fires**.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (enter hook shared with Twin Gate). CHAMPION tilt is MED–HIGH (farthest-first multi-unit).
- **STATUS:** PROPOSED

---

### ENEMY_ID: `axis_locksmith`

- **NAME:** Axis Locksmith
- **ROLE:** controller (walk-axis lock)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `snare_weaver` (root = 0 walk) and `rank_lancer` (linear **attack**). At most one per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Rank Lock if a linear / cone ally is in the pack **or** a 4-tile file exists. Peer: skip if the player is already on a dead-end file. Above: lock then pit / Fan / File Lance.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.00, sr 1.05, res 0.95, init 1.25, chc 0.80. Init is high so the lock lands **before** the player walk. **0 damage on the lock.**
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "axis_lock_if_linear_spell_in_kit"`. VETERAN: skip if already locked. ELITE: lock the axis a Lancer / Fan / Stinger wants. CHAMPION: lock then Open-Pit the only step (pack).
- **CORE_SPELL_POOL:** `spell-rank-lock`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark` on the locked file
- **RARE_SPELL_POOL:** `proposed:spell-root-snare` only if `snare_weaver` is absent (do not double-stop a pack)
- **ELITE_SPELL_POOL:** none — CHAMPION is lock+pit, not a 3-turn root
- **SIGNATURE_MECHANICS:** `walkAxisLockTurns: 2`. Cardinal caster→target: lock that rank **or** file. Diagonal / knight-offset: dominant axis (`|dx| >= |dy|` → file `x` locked, they may change `y` only). Forced movement **allowed**. Cleanse strips via `walkAxisLock`. Preview and execute both reject illegal dests.
- **VARIANT_PROGRESSION:** BASE lock-if-file → VETERAN no-refresh → ELITE lock-for-ally-gun → CHAMPION lock-then-pit
- **RARITY_CURVE:** Standard. +ELITE on `chessboard` / `fortress` / Fan File.
- **SYNERGIES:** `fan_prelate`, `rank_lancer`, `far_stinger`, `pit_mason`, `tax_scribe` (COURT: lock + tile tax)
- **WEAKNESSES:** Swap / Back Step / Twin Gate / wait 2 turns; the lock does not spend their MP for them
- **PLAYER_COUNTERPLAY:** Teleport off-axis; walk the allowed axis into safety; Absolve
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-rank-lock` (ELITE observe)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (walk stepper + preview parity; do not touch turn order)
- **STATUS:** PROPOSED

---

## 5. Wave 1 / Wave 2 / Wave 3 amendments (not new ids)

| Family | Amendment | Why |
| :--- | :--- | :--- |
| `tempo_precentor` | Do **not** steal `spell-ley-toll` | AP grant ≠ MP spend-to-prime |
| `hex_chorister` | Do **not** steal `spell-ley-toll` or `spell-lens-share` | Enrage / Haste stay. Share Optic owns ally range |
| `plus_cutter` / `storm_caller` | Do **not** steal `spell-fan-bolt` | Plus / bounce ≠ cone reader |
| `rift_hook` / `blink_cutter` | Do **not** steal `spell-pawn-trade` | Caster-swap / ally-swap ≠ two-hostile trade |
| `bash_bruiser` | Do **not** steal `spell-back-step` | They move; Recoil moves **self** |
| `mist_walker` / `wraith_bishop` | Do **not** steal `spell-twin-gate` | Dash / swap ≠ walkable pad pair |
| `plate_warden` / `void_mirror` | Do **not** steal `spell-sidestep-ward` | Absorb / reflect ≠ miss-one-hit |
| `tide_shade` | Do **not** steal Sidestep as identity | Tide stays MP kite |
| `glass_sniper` | Do **not** steal `spell-far-sting` | Flat min-range gun ≠ distance tape |
| `coil_arbiter` | Do **not** steal `spell-soul-sip` | Debuff MP ≠ zero-sum current steal |
| `tax_scribe` | Do **not** steal `spell-hex-toll` | Tile AP ≠ unit next-cast tax |
| `trip_mason` / `rime_mason` / `smoke_thurifer` | Do **not** steal `spell-open-pit` or `spell-slide-tile` | Trap / ice / fog ≠ pit / conveyor |
| `pale_cantor` | Do **not** steal `spell-mercy-font` | Caster heal ≠ stationary pulse |
| `pylon_prelate` / `stone_castellan` / `brood_chanter` | Do **not** steal Mercy Font | Empty wall / turret / mobile pets stay three engines; font is the fourth |
| `dim_optic` | Do **not** steal `spell-lens-share` | Shrink ≠ grant. Lens Duel is COURT only |
| `execute_jackal` / `coup_duelist` | Do **not** steal `spell-stride-brand` | HP windows ≠ moved-this-turn |
| `rank_lancer` | Do **not** steal `spell-rank-lock` as CORE | Lancer **attacks** the file. Locksmith **locks** the walk. CHAMPION Lancer may take Lock only if Locksmith is absent |
| `snare_weaver` | Do **not** steal Rank Lock | Root is 0 walk; lock is one-axis walk |
| `leash_warden` | Unchanged: occupy / Swap peel. Font is planted, not pulled as CORE | Hook Chaplain still owns ally pull |
| All prior waves | Fifth `wRare` 2% skin still applies | Mechanical identity, not a level bracket |
| `slide_mason` CHAMPION | May witness `spell-board-tilt` | Not a 16th family; never player-learnable |

---

## 6. Identity matrix (Wave 4 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| ley_tollkeeper | `mpCost > 0` prime, damage (frost/dot), isMark | heal, isSummon, isSacrifice, absorb |
| fan_prelate | `areaShape: cone`, damage, isMark | heal, melee-only, isSummon, static plus-as-identity |
| pawn_broker | `swapTwoHostiles`, damage (frost), isMark, debuff(mp) | heal, isSummon, `isSwap` as CORE, inferno |
| recoil_squire | `selfPushDistance`, damage (physical), buff(mp), veil | heal, isSummon, player-push as CORE |
| twin_porter | `gatePairDuration`, damage, isMark, debuff | heal, isSummon, map-`portals` reuse, Mist Step as CORE |
| sidestep_warder | `evadeNextHits`, damage (physical), defense | heal, isSummon, `buffStat: evasion`, reflect-as-identity |
| far_stinger | distance-scaled damage, `modifiableRange`, isMark, debuff | heal, isSummon, melee-only, flat glass-shot as CORE |
| soul_siphon | `stealMpAmount`, damage, debuff(ap/mp) | heal, isSummon, linger-mp as identity |
| pit_mason | `pitBlocksWalk` + LoS open, damage, isMark | heal, isSummon, Smoke/Barrier as identity, isTrap |
| font_cantor | isSummon (`font`), defense, buff(mp on **ally**) | turret/wolf/archer/bomber/pylon, healAmount on the **caster**, inferno |
| share_optic | `allyRangeDelta`, buff(mp/dmg), isMark | heal, isSummon, rangeDebuff as CORE, inferno |
| stride_hunter | `movedThisTurnBonus`, damage, isMark | heal, isSummon, HP-execute as CORE, still-brand |
| hex_teller | `nextCastApTax`, damage, debuff | heal, isSummon, tile-tax as identity, inferno |
| slide_mason | `slideDistance` conveyor, damage, isMark, CHAMPION massPush | heal, isSummon, ice-as-identity, isTrap |
| axis_locksmith | `walkAxisLockTurns`, damage, isMark, debuff(mp) | heal, isSummon, root-as-CORE, linear-nuke as identity |

Wave 1 matrix in the 2026-08-31 doc, Wave 2 in 2026-09-01, and Wave 3 in 2026-09-02 still apply to those ids.

---

## 7. Role coverage after Wave 4

| Archetype | Wave 1 owner | Wave 2 extra | Wave 3 extra | Wave 4 extra (new verb) |
| :--- | :--- | :--- | :--- | :--- |
| bruiser | crimson_spawn | rank_lancer, bash_bruiser | — | recoil_squire is **self**-push, not a thicker bruiser |
| sniper | glass_sniper | — | — | far_stinger (distance tape) |
| kiter | tide_shade | — | — | recoil_squire, sidestep_warder |
| assassin | shadow_lurker | execute_jackal | coup_duelist | stride_hunter (moved flag) |
| healer | pale_cantor | — | ash_absolver is **cleanse** | font_cantor is a **totem**, not a second Cantor |
| buffer | hex_chorister | leech_familiar | tempo_precentor (AP) | ley_tollkeeper (MP prime), share_optic (ally range) |
| debuffer | bone_scribe | tax_scribe | dim_optic | hex_teller (next-cast AP), soul_siphon (MP steal) |
| summoner | brood_chanter | stone_castellan, leech_familiar | pylon_prelate | font_cantor (heal totem) |
| controller | coil_arbiter | snare_weaver, void_anchoret | rime/smoke/sink | axis_locksmith, soul_siphon |
| tank | iron_golem | plate_warden | goad_herald | sidestep_warder is evade, not HP |
| protector | leash_warden | pain_suture | hook_chaplain, twin_tether | — |
| artillery | storm_caller | ricochet_vicar, stone_castellan | plus_cutter | fan_prelate (cone) |
| kamikaze | cinder_martyr | — | — | — |
| teleporter | wraith_bishop, blink_cutter | mist_walker | — | twin_porter (pads) |
| displacement | rift_hook | bash_bruiser, void_anchoret | sink, hook_chaplain | pawn_broker, slide_mason, recoil_squire |
| hazard creator | ember_knight, glyph_sower | trip_mason | fuse, rime, smoke | pit_mason, slide_mason |
| status specialist | plague_rat | bell_sexton | ignite_alchemist | stride_hunter |
| anti-summon | null_censor | pain_suture | — | pawn_broker (trade the pet onto a pit) |
| anti-ranged | void_mirror, rust_reaver | rank_lancer | dim_optic, smoke | hex_teller (tax the long cast) |
| anti-melee | leash_warden | pain_suture, trip_mason | goad, pylon | pit_mason, recoil_squire, sidestep_warder, axis_locksmith |

Every requested archetype still has a Wave 1 owner. Wave 4 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation prerequisites (still not this change)

Order from Wave 1 §6, Wave 2 §8, Wave 3 §8, plus Wave 4 verbs:

1. Numeric kit band into `buildEnemyKit` (`WX` 11920) — `currentMap.levelZone` is still an object.
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Ratios live in `spawnPolicy.ts` `applyEnemyFamilyStats` after this extraction.
3. Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128).
4. Explicit `aiProfile` / `familyKit`; stop healer inference and `family.includes("berserk")`.
5. Force preferred chassis on family roll (`maybeApplyEnemyFamilyVariant` still keeps random `pieceType`).
6. Wave 1 kits first (live ids), then Wave 2 verbs, then Wave 3 verbs, then Wave 4 **one at a time:** MP debit in `executeCastAttempt` / `planPlayerCastAttempt` (Ley Toll is illegal without it) → cone `areaShape` reader → two-hostile swap → self pushback caller → `gatePads` table (never `portals`) → `evadeNextHits` before `dealDamage` → distance payload → MP steal → `pitTiles` LoS split → `summonAI: "font"` → ally range ref → `movedThisTurn` flag → next-cast AP tax → slide enter hook → walk-axis preview → CHAMPION mass tilt.
7. Proposed spells are metadata rows. Wire `effectParams` keys from SPELL_PROPOSALS Wave 3, never names.
8. `inferSummonArchetype` must accept `"font"` as a string enum. Do not parse `"Mercy Font"`.
9. Register text updates only when hooks land.
10. Discovery: family observe must not double-grant ACHIEVEMENT / BOSS / CHALLENGE / MULTI_SOURCE doors (`ley-toll` is ENEMY_DISCOVERY; `back-step` / `twin-gate` / `sidestep-ward` / `mercy-font` / `lens-share` already have official doors).

Do **not** retune `pickEnemyLevelFromTiers` percents. Do not treat 999 as endgame. Do not implement `instantKill`. Do not add a parallel reward writer. Do not invent `wp` / `wr` / `scp`. Do not wire `CharacterStats.evasion` as a miss percent. Do not plant Twin Gate into occupancy `portals`.

---

## 9. Held for a later wave (no ids reserved here)

SPELL_PROPOSALS Wave 3 leftover **spell** holes (do not mint colliding `wave4:` spell ids):

- Cone + knockback as **one** id
- Two-**ally** swap (distinct from `pawn_broker` player-side trade and `blink_cutter` ally-swap-with-self)
- Mid-combat initiative rewrite
- Player-owned Echo Cast
- HP+MP hybrid cost
- Facing damage beyond Rear Cut
- Second `mpCost > 0` damage nuke (Ley Toll is the first MP spender, not a snipe)

Discovery W2 still unfamilied (do not steal this pass):

- `spell-still-brand` (punish standing) — opposite of `stride_hunter`
- `spell-grounded-lock` (no swap/blink) — distinct from `axis_locksmith` (walk axis)

---

## 10. What this run did not do

- No production TypeScript / Motoko.
- No re-proposal of the 22 Wave 1, 14 Wave 2, or 14 Wave 3 ids as new families.
- No boss redesign.
- No player or enemy level cap.
- No RAF / mapGen / turn / damage-math edits.
- No reward writers outside `applyRewards`.
- No new persist stats (`wp` / `wr` / `scp` stay gone).
- No `spell-blood-tithe` enemy family (player-first; martyrs already exist).
- No `buffStat: "evasion"` miss formula.
- No Twin Gate reuse of world-portal occupancy.
- No Board Tilt player grant.

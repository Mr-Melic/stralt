# Stralt quantitative game-balance analysis — 2026-09-23

**Role:** quantitative game-balance analyst (cron `0 */48 * * *`).  
**HEAD:** `0f5363f` (`Merge pull request #332`). Unchanged since 2026-09-21 / 2026-09-22.  
**Telemetry:** none. Synthetic only (Monte Carlo 8k spawn rolls; live formulas).  
**This run does not change balance numbers.** No combat, XP, spawn, or shop constants were edited. Findings are ACTION_IDs only.

Prior passes: 2026-09-22 / 2026-09-21 at `0f5363f`; 2026-09-02 at `58302bc`; 2026-09-01 at `dd275aa`.  
Ledger: [`ACTION_IDS_BAL_2026-09-23.md`](./ACTION_IDS_BAL_2026-09-23.md). Durable IDs stay `BAL-*`.

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula |
| :--- | :--- |
| XP N→N+1 | `100 * 2^(N-1)` — `xpCurve.ts` 23–26; `main.mo` `applyRewards` 2126–2132 |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` 89–101 |
| Portal XP | 10 (`PORTAL_TRANSITION_XP`) |
| `applyRewards` ceilings | Doka 100_000 / XP 500_000 (`main.mo` 2119–2120) |
| Spawn level | `pickEnemyLevelFromTiers` tierSize=10, 60/20/10/10 plus ±1 variance 15% (`combatMath.ts` 54–107) |
| Player max HP (HUD) | `floor(100 * (1 + (L-1)*0.05))` — `WorldExploration.tsx` 3400–3406 |
| Player battle AP/MP | `8 + floor(L/25)` / `4 + floor(L/25)` — `progression.ts` 59–83 |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` — `WorldExploration.tsx` 3607–3614 (overwrites spawn HP) |
| Spawn HP / melee | `L*8+20` / `L*2+3` — `WorldExploration.tsx` ~5831 |
| Damage scale | `floor(base * 1.03^spellUpgrade)` — caster **level unused** (`combatMath.ts` 130–137) |
| Spell fail | 20% − 0.1%/level; **physical exempt** (`spellEngine.ts` 641–651) |
| Victory Doka | per-enemy lottery × `enemy.level` (`WorldExploration.tsx` 12379–12414); persist clamped |
| Death | 20% leftover XP, 40% Doka (`deathPenalty.ts` 11–12) |
| Spell upgrade | `10 * 2^currentLevel` (`main.mo` ~1017); summon UI advertises 10× |
| Dungeon Doka FE | `[1, 1.5, 2, 2.5, 3, 4][depth]` (`portalRules.ts` 148–161) |
| Dungeon XP persist | **not** chain-multiplied (`PREAPPLIED_REWARD_MULTIPLIER=1`, `WorldExploration.tsx` 12528–12538) |
| Dungeon BE store | `1 + depth*0.25` (`main.mo` 2918) — not the live payout |
| Boss Rush persist | `max(5, floor(L*1.5))` Doka/kill + kill XP; room table unpaid |
| Challenges | easy 50–75 Doka / 0 XP; hard 150–200 Doka + 400–500 XP; legendary 400–500 Doka + 800–1000 XP |

Monte Carlo: 8000 rolls, default tier config, no `localStorage` override.

Normalized metrics used below:

- **DPA** = advertised damage / AP (upgrade 0, no crit, no RES/SR).
- **E[DPA]** = DPA × (1 − failChance) for non-physical; physical failChance = 0. At L1 failChance = 20%.
- **HPA** = heal / AP.
- **DoT-DPA** = (tick × duration) / AP, delayed.

---

## Ledger status this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| BAL-ENEMY-TIER-OUTLIER | P0 | OPEN |
| BAL-TIER-FLOOR-UPBIAS | P0 | OPEN |
| BAL-ENEMY-KIT-ZONE-OBJECT | P0 | OPEN (was NEW 09-22) |
| BAL-PLAYER-COMBAT-STATS-FLAT | P1 | OPEN |
| BAL-SPELL-FAIL-FLOOR | P1 | OPEN |
| BAL-TIMESTEP-FREE-TURN | P1 | OPEN |
| BAL-SACRIFICE-PERCENT-HP | P1 | OPEN |
| BAL-CHALLENGE-XP-EARLY-BREAK | P1 | OPEN |
| BAL-IAP-VALUE-DOMINANCE | P1 | SUPERSEDED (player GameKey 100 Doka/€) |
| BAL-HP-FORMULA-SPLIT | P1 | OPEN |
| BAL-VICTORY-FLOOR-OVER-MAXHP | P1 | OPEN (PR #386 still open, not in HEAD) |
| BAL-RECAP-XP-BAR-WRONG | P2 | RESOLVED |
| BAL-FAMILY-COMBAT-IDENTITY | P2 | OPEN |
| BAL-DOMINATED-SPELLS | P2 | OPEN |
| BAL-SUMMON-UI-COST-10X | P2 | OPEN |
| BAL-DEATH-DOKA-40 | P2 | OPEN |
| BAL-AP-GROWTH-UNREACHABLE | P2 | OPEN |
| BAL-VOID-COLLAPSE-UNREACHABLE | P2 | OPEN |
| BAL-DUNGEON-MULT-FORMULA-SPLIT | P2 | OPEN |
| BAL-TITAN-VIGOR-FLAT-1000 | P2 | OPEN |
| BAL-JACKPOT-HEAL-1-DOKA | P3 | OPEN |
| BAL-BUFF-SHOP-OVERWORLD-DOMINATED | P3 | OPEN |
| BAL-TWO-SPELL-CATALOGS | P3 | OPEN |
| BAL-MP-UNUSED-ON-STARTERS | P3 | OPEN |
| BAL-BOSS-RUSH-TABLE-UNPAID | P1 | OPEN |
| BAL-STARTER-KIT-NO-GATING | P1 | OPEN |
| BAL-SUMMONER-SATURATION | P2 | OPEN |
| BAL-HARD3-AP8-FREE | P2 | OPEN |
| BAL-BOSS-CATALOG-SPLIT | P2 | OPEN |
| BAL-IAP-PACKAGES-ORPHANED | P3 | OPEN |
| BAL-GAMEKEY-MINT-UNBOUNDED | P2 | OPEN |
| BAL-CREATE-VITALS-MISMATCH | P3 | OPEN |
| **BAL-BOSS-GUIDE-VS-COMBAT** | P2 | **NEW** |
| **BAL-RANGE-CAP-FAVORS-STRIKE** | P2 | **NEW** |
| **BAL-PLAYER-CC-DEAD-ON-BAR** | P1 | **NEW** |
| **BAL-PLAYER-SUMMON-NO-CAP** | P1 | **NEW** |

---

## What moved since 2026-09-22

Formulas and HEAD did not move. This pass re-read call sites and normalized the starter kit.

1. **`resolvePlayerCast` never writes `debuffStat`.** Enemy/summon `resolveSpellCast` does (`spellEngine.ts` 529–548). The player damage loop (`spellEngine.ts` 876–1028) deals damage and returns. Slow, Frost Bolt MP−1, Weaken, Expose, Shadow Veil, Drain Courage, Cursed Wound healRecv, and Life Drain SP shred are **advertising-only on the player bar**. New ID `BAL-PLAYER-CC-DEAD-ON-BAR`.
2. **`maxSpellRange = 5` plus physical fail-exemption.** Strike grows `1 → 5` by L40. Frost is `4` at L1 and hits the cap at L10 (`+1` tile ever). Combined with 20% fizzle, Strike is the only fail-proof ranged option that actually gains reach. New ID `BAL-RANGE-CAP-FAVORS-STRIKE`.
3. **Boss Guide `1.08^(boss−player)` is UI-only** (`progression.ts` 249–272). Combat uses catalog `baseStats.hp` (frontend Pale Archbishop 350; backend 500). New ID `BAL-BOSS-GUIDE-VS-COMBAT`.
4. **Player summons have no alive-cap.** Enemy summons cap at 2 with a 2-turn cooldown (`gameConstants.ts` 298–301). All five player summon spells cost 2–3 AP, have no cooldown, and are innate. New ID `BAL-PLAYER-SUMMON-NO-CAP` (parallel to EBMA spawn-cap; filed here because it is a dominant strategy, not only a kit hole).

`BAL-ENEMY-KIT-ZONE-OBJECT` re-verified: `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WorldExploration.tsx` 11920 still passes `{name,minLevel,maxLevel}`. `Math.floor(object)` is NaN → zone 0.

---

## Scenario snapshot (live spawn, 8k rolls, typical 3-pack)

| Band | Player L | Mean enemy L | p(enemy>player) | XP/fight (3) | Fights/level | Combat mean eHP | Sac (full) | p(sac oneshot) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 10.84 | 0.927 | 660 | 0.15 | 74 | 60 | 0.36 | 254 | no |
| Mid | 8 | 11.05 | 0.434 | 660 | 19.4 | 75 | 81 | 0.76 | 258 | no |
| Mid | 10 | 11.16 | 0.292 | 660 | 77.6 | 75 | 87 | 0.82 | 260 | **yes** |
| Late | 15 | 17.91 | 0.505 | 1080 | 1517 | 92 | 102 | 0.76 | 399 | yes |
| Stress | 25 | 26.66 | 0.500 | 1620 | 1.04e6 | 114 | 132 | 0.80 | 580 | yes |

L1 enemy histogram: 71% in 1–10, 18% 11–20, 6% 21–30, ~5% 31+. Max 80.

Same-level 4-pack (lower bound, not live spawn): L1 80 XP / 1.25 fights; L10 800 XP / 64 fights; L15 1200 XP / 1365 fights.

Cumulative leftover-scale 1→15 = 1,638,300. HUD `xpForNextLevel` saturates at L48 (`MAX_SAFE_INTEGER`). Persist still uses bigint.

Challenge at L1 if completed: `hard_1` +500 XP → L3 leftover 200; `legendary_1` +1000 XP → L4 leftover 300.

---

## Normalized ability comparison (starter catalog, L1, upgrade 0)

Fail-adjusted E[DPA] uses 20% fizzle. Physical Strike is exempt. Player CC columns assume **advertised** effects; live player bar currently delivers **damage/heal only** (`BAL-PLAYER-CC-DEAD-ON-BAR`).

| Spell | AP | Payload | DPA / HPA | E[DPA] L1 | Live player extra | Verdict |
| :--- | ---: | :--- | ---: | ---: | :--- | :--- |
| Strike | 2 | 10 dmg, range 1 | 5.0 | **5.0** | none | Fail-proof filler; range grows to 5 |
| Frost Bolt | 3 | 20 dmg, range 4 | 6.67 | 5.33 | MP−1 **not applied** | Best single-target nuke if you accept fizzle |
| Cursed Wound | 3 | 22 dmg | 7.33 | 5.87 | healRecv **not applied** | Highest raw DPA; extra is dead |
| Shadow Veil | 3 | 18 dmg | 6.00 | 4.80 | RES/SP **not applied** | Dominated by Cursed Wound |
| Expose | 3 | 15 dmg | 5.00 | 4.00 | RES/SP **not applied** | Dominated |
| Chain Lightning | 4 | 20 × up to 3 | 5–15 | 4–12 | — | Dominant in 3+ packs |
| Poison Arrow | 2 | 4×3 DoT | 6.0 delayed | 4.80 | stacks (no CD) | Dominates Venom; stack engine |
| Venom Strike | 3 | 4×3 DoT, range 2 | 4.0 delayed | 3.20 | stacks | **Strictly dominated** by Poison |
| Inferno | 5 | 8×3 DoT, CD 3 | 4.8 delayed | 3.84 | — | Dominated by Frost as a nuke |
| Sacrifice | 3 | `floor(HP×0.2)×3` | 20 at 100 HP | 16.0 | 20% self HP | Oneshots same-level combat HP |
| Blood Mend | 3 | 12 HP + CHC | 4.0 HPA | 3.20 | — | Dominated by Rally on HPA |
| Rallying Cry | 4 | 20 HP + CHC | 5.0 HPA | 4.00 | — | Better heal/AP than Blood Mend |
| Life Drain | 3 | 10 dmg + 5 HP | 3.3 dmg + 1.7 HPA | — | SP shred **dead** | Strictly worse than Frost+Mend split |
| Shield | 2 | +30% RES 3t | — | — | live (buff path) | **Strictly dominates** Iron Skin |
| Iron Skin | 3 | +30% RES 3t | — | — | live | Dominated |
| Timestep | 0 | full AP+MP, 1×/battle | ∞ | ∞ | live | Extra turn; dominant |
| Dire Wolf | 3 | hunter, lifespan 4 | board actor | 2.4 after fail | **no cap** | Dominant vs any 3-AP nuke |

Healing vs wallet (overworld only):

| Source | Cost | HP | Doka per HP at L1 (max 100) |
| :--- | :--- | :--- | ---: |
| Overworld Doka→HP | 1 Doka : 3 HP | any missing | **0.33** |
| Jackpot heal | 1 Doka | full bar | 0.01 |
| Health Potion | 50 Doka | 30% (30 HP) | 1.67 (**5×** overworld) |
| Greater Potion | 120 Doka | 70% | 1.71 |
| Blood Mend | 3 AP, 0 Doka | 12 | AP, not Doka |
| Passive regen | 0 | 1 HP / 10 s out of battle | 0 |

BuffShop HP potions are dominated out of combat. In combat they are the only paid heal that does not spend AP (and they fail `easy_1` / `hard_1`).

---

## Domain notes

### Player progression

Create writes AP 10 / MP 5 (`startingChampionStats.ts` 7–21). Battle init overwrites to 8 / 4. HUD HP is linear +5%/level; `getPlayerBaseStats` HP is compounding `100 × 1.05^(L−1)` and is **not** the HUD. Atk/res/init/chc/evasion/resilience persist but `calcScaledDamage` ignores caster level and player ATK. SP 8 does apply to non-physical damage (+8%).

AP +1 / 25 levels. Persist cap 20 (`adminGuard.mo` `MAX_PERSISTED_AP`). Formula AP 21 at L325 cannot persist. L15 needs 1.6M cumulative leftover XP — the wall is XP, not AP.

All 32 `starterSpells` are forced `isBaseSpell: true` (`WorldExploration.tsx` 2396–2404). There is no loadout economy.

### Enemy scaling

L1–10 share **tier 0**. Floor bias: at L1, 15% variance cannot go below 0, adjacent −1 is clamped, so mass is uptiered. Mean enemy ≈ 11, 93% above the player, tail to 80. Combat HP at mean L11 ≈ 74 vs player 100. Spawn placeholder HP for L11 is 108, then battle start overwrites to 74.

Family 30% overwrites `res` to 0.05–0.75 (fraction) vs integer combat RES ~10 at L10 rook; `hpMult` is applied to spawn HP then discarded by `calcEnemyMaxHp`. Piece identity is mostly visual + kit (and kits are stuck at zone 0).

AI tier: 30% chance uniform 1–10 regardless of enemy level (`computeAITier`). Betrayal (tier 10) can appear on L1 packs.

Backend `getEnemyHPForLevel`: `(30+(tier-1)*20) * (1 + L*0.05)` — unused by the live client.

### Damage / AP efficiency

Damage does not scale with player level. Enemy HP does. Without Sacrifice / summons / Chain Lightning, TTK rises while DPA stays flat. Spell upgrades are +3%/level on a `10 * 2^n` Doka cost; L10 upgrade is 10_240 Doka for +34% damage (`1.03^10`). One persist jackpot (100_000) buys that many times over; median fights do not.

### Healing efficiency

In-battle Blood Mend 12/3 AP vs Rally 20/4 AP. Overworld 1:3 Doka heal dominates potions. Jackpot heal is 1 Doka full HP (0.5% of Doka→HP clicks). Mending Mist is 5% max HP / tick on a map modifier — comparable to a free Blood Mend on a 100 HP bar.

### Summons

`getSummonBaseStats` at spell level 0: Wolf 80 HP / 2 AP; Sentinel `120 * 1.5 = 180` HP; Wisp 42 HP. Lifespan 4 + floor(spellLevel/2), with per-spell override. Player can place Wolf+Archer+Wisp in one 8-AP turn. Each gets a turn. Enemy summoner chance `0.12 + playerLevel*0.02` is 100% at L44. Upgrade UI charges 10× but canister charges 1× (`spellUpgrade.ts` 103–125).

### Crowd control

On the **player bar**, CC is currently a description string. Frost Nova still deals 15 AoE. Slow/Weaken never land from `resolvePlayerCast`. That makes “control mage” a dominated fantasy: the real levers are Sacrifice, Timestep, summons, and Chain Lightning.

### XP curve

Doubling per level vs linear-in-enemy-level income. Live uptier at L1 makes the first level free (660 XP vs 100 needed). L10 is ~78 three-packs. L15 is ~1.5k three-packs. Challenge XP is a larger grant than many early fights.

### Doka acquisition

Raw E[multiplier] ≈ **50,006.88**, of which **50,000** is the 0.01% jackpot band `uniform(1..1e9)`. Non-jackpot E[mult] ≈ 6.88. Persist EV per enemy ≈ `enemy.level * 6.88 + 10` (the +10 is `0.0001 * 100_000`). L1 3-pack persist mean ≈ 254. Median ≈ `2 * enemy.level` per enemy (90.45% band is 1–3).

Shrine altar is a flat 300 (`WorldExploration.tsx` 11308). Ground coins: 40% map chance, `max(1, round((5 + avgEnemyLevel*2) * U(0.8,1.2)))`, count `ceil(enemies/3)`. Dungeon complete bonus `maxDepth * 50` (150–250 for depth 3–5). Achievements pay 50–1000 once. All of these are rounding error next to one clamped jackpot.

Admin `validateDokaGrant` still allows 10_000_000, bypassing `applyRewards` 100_000 (`BAL-GAMEKEY-MINT-UNBOUNDED`). Player-hint GameKey mint remains blocked.

### Spell-upgrade costs

`10, 20, 40, …` through `10 * 2^13 = 81_920` then `163_840` which exceeds a single `applyRewards` credit but is payable from wallet. Summon UI shows 100, 200, … but `upgradeSpell` charges 10, 20, ….

### Shops

Player IAP is GameKey at 100 Doka/€. Seeded `ShopPackage` ladder (`pkg_10` = 10 Doka / 1.00€ = 10 Doka/€) is unused (`processPendingPurchases` no-op). BuffShop 50–150 Doka for potions/elixirs; overworld heal is 1:3.

### Death penalties

20% leftover XP (not cumulative — at L15 leftover is usually small relative to the 163_840 threshold). 40% of **all** Doka. After a jackpot the death tax is the real sink; after median fights it is a few dozen Doka. Respawn HP is 50% of linear max (L1 = 50).

### Dungeon multipliers

Live Doka ×1.5…4; live XP ×1. Backend record stores ×1.25…2.25 and is not the payout. Depth also adds `DUNGEON_TIER_BOOST * 10` enemy levels and `[0,2,3,4,4,5]` extra enemies. Depth 5 is more enemies +30 levels, not more XP multiplier. Titan’s Vigor is a flat +1000 HP (`MAP_MODIFIER_TITANS_VIGOR_HP_BONUS`) on a 74-HP mean L1 pack — a difficulty spike that does not scale.

### Boss Rush

Advertised room table sums 21_000 Doka / 8_500 XP. Persist is kill XP (`level*20`) plus `max(5, floor(L*1.5))` Doka per kill, `roomMultiplier = 1`. `completeBossRushRoom` ignores client reward fields. Frontend boss HP 60–600, reward ×5 Doka / ×3 XP; backend 100–800 HP, ×10–50 / ×8–40.

Boss Guide table scales HP by `1.08^diff` (diff +5 → ×1.47). Combat does not.

### Challenges

`hard_3` is `maxApUsedInTurn <= 8`. Player AP is 8 until L25, so the constraint is free for the entire early/mid game. `hard_1` 500 XP at L1 is a five-threshold skip if the player never heals and stays under 30 damage — Sacrifice’s self-hit now counts (`recordChallengeSelfHpLoss`), so Sacrifice fails Untouchable / under-30.

### Achievements

Default feats pay 50–1000 Doka (`admin.mo` 309–326). `doka_1000` pays 200; `doka_10000` pays 1000. Wallet feats wait for `applyRewards` commit. Pacifist 500 Doka is still client-trusted on spell-type tags (EBMA overlap). Feat Doka is trivial vs persist EV.

---

## Dominant strategies / useless options / walls

**Dominant**

1. Sacrifice at high HP (oneshot same-level combat HP; ~36% of live L1 spawns, ~80% from L8).
2. Timestep extra turn (0 AP).
3. Fill the board with uncapped summons (3 AP each).
4. Chain Lightning into 3+ packs.
5. Poison Arrow stacked (2 AP, no CD) if the fight lasts 3 turns.
6. Accept `hard_1` / `legendary_*` at L1 for more XP than the XP curve wants to give.
7. Overworld Doka→HP instead of BuffShop potions.

**Useless / dominated**

- Venom Strike vs Poison Arrow.
- Iron Skin vs Shield.
- Shadow Veil / Expose vs Cursed Wound (and their extra effects do not apply from the player bar).
- Inferno as a 5-AP single-target “blast” (0 upfront).
- MP on every starter (`mpCost = 0`).
- Void Collapse (AP 12, minLevel 30, other catalog).
- ShopPackage euro ladder.
- Backend dungeon multiplier and `getEnemyHPForLevel`.

**Progression wall:** XP doubling from ~L10. Combat is not the wall; the leftover bar is.

**Trivial progression:** L1 (mean enemy 11, 660 XP vs 100 needed; one fight can skip L2). Challenge XP can skip to L3–L4.

**Excessive grind:** L15+ without jackpot Doka and without challenge XP.

**Reward loop:** jackpot persist 100_000 Doka / death 40% of wallet / upgradeSpell exponential. Median Doka is tiny; EV is the lottery.

**Difficulty spike:** L1 tail to enemy 80; Titan’s Vigor +1000 HP; zone-0 kits still, so spikes are HP/level not kit.

**Difficulty collapse:** Sacrifice, Timestep, summon board, and challenge XP.

**Scaling anomaly:** player damage flat vs enemy HP linear; player Doka EV linear-in-enemy-level with a billion-band; XP exponential.

**Mathematically dominated choices:** listed in the ability table. Also BuffShop 50 Doka for 30 HP vs 10 Doka overworld for the same 30 HP at L1.

---

## Recommendations (no numbers shipped this run)

Each row: current → evidence → problem → recommended range → expected effect → risk → confidence.

| ID | Current | Recommended range | Effect | Risk | Conf. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | 0.01% × U(1,1e9) × level, persist cap 100k | Drop 1e9 band; persist EV ≈ few × enemy.level (e.g. max mult 50–200) | Removes random millionaire; death 40% becomes a real tax on earned Doka | Players who like jackpot flavor | HIGH |
| BAL-XP-EXPONENTIAL-WALL | 100×2^(N−1) vs 20×enemy.level | Superlinear but slower after L8 (e.g. 100×1.35^(N−1) or piecewise) | L10–15 stays a climb, not a stop | Early game currently free; do not also buff L1 XP | HIGH |
| BAL-TIER-FLOOR-UPBIAS | L1–10 same tier; down-tier clamped | Asymmetric floor: allow below-player, cap L1 max ~player+3 or separate tutorial tier | L1 is a fight, not a lottery of L80 pawns | Too-easy if cap is tight | HIGH |
| BAL-ENEMY-KIT-ZONE-OBJECT | `levelZone` object → NaN → kit 0 | Pass a numeric zone (`floor((L-1)/10)` or `setCurrentZoneTier`) | Late kits (Inferno, Iron Skin, Rally) actually appear | Enemy difficulty up | HIGH |
| BAL-DMG-NO-LEVEL-SCALE | `1.03^upgrade` only | Small caster-level term **or** drop enemy HP growth to match | TTK stable as levels rise | Can explode with Sacrifice | HIGH |
| BAL-SACRIFICE-PERCENT-HP | 60% current HP as damage | Flat or vs missing/max HP, or coeff 1.0–1.5× lost HP | Not a 3-AP win button | If too weak, leftover flavor | HIGH |
| BAL-PLAYER-CC-DEAD-ON-BAR | Player debuffs never apply | Apply `debuffStat` on player hit; floor victim AP/MP at 1 | Control mage exists | Stacking Frost+Slow | HIGH |
| BAL-PLAYER-SUMMON-NO-CAP | Unlimited 2–3 AP summons | Alive cap 2–3; 1–2 turn CD | Summons are a slot, not a board flood | Occupancy tests | HIGH |
| BAL-STARTER-KIT-NO-GATING | 32 innate spells | Gate 8–12; rest found / bought | Loadout choices exist | Discovery UX | MED |
| BAL-BOSS-RUSH-TABLE-UNPAID | 21k/8.5k advertised, persist ~kill XP + 1.5L Doka | Persist a fraction of the table **or** stop showing it | Recap matches canister | XP wall interaction | HIGH |
| BAL-CHALLENGE-XP-EARLY-BREAK | 500–1000 XP at L1 | Scale challenge XP with `xpThreshold` (e.g. 20–40% of current need) | Challenges stay optional spice | Feels stingy if too low | HIGH |
| BAL-HARD3-AP8-FREE | ≤8 AP/turn vs AP 8 | `<= max(3, floor(AP*0.6))` or raise player AP later | Constraint exists before L25 | Challenge feel | MED |
| BAL-SPELL-FAIL-FLOOR | 20% until L201 | 5–10% at L1, 0 by L20–30, **or** drop fail | Spells compete with Strike | Reliability | MED |
| BAL-RANGE-CAP-FAVORS-STRIKE | cap 5; Strike gains 4 tiles, Frost 1 | Raise cap **or** grow by spell upgrade not character level; don’t let Strike out-range Frost | Casters keep reach identity | Targeting tests | MED |
| BAL-BOSS-GUIDE-VS-COMBAT | Guide ×1.08^Δ, combat flat catalog | Drive combat from the same helper **or** label the table “illustration” | Guide stops lying | Boss HP retune | MED |
| BAL-HP-FORMULA-SPLIT | linear HUD vs 1.05^(L−1) formula | One HP curve | Admin/preview match HUD | Persist HP cap | MED |
| BAL-VICTORY-FLOOR-OVER-MAXHP | `50+10L` > maxHP from L10 | `min(floor, maxHp)` (PR #386) | No overheal after win | Recap heal ordering | HIGH |
| BAL-DEATH-DOKA-40 | 40% all Doka | 10–20% **or** tax unspent jackpot only after lottery retune | Death is a setback, not a wipe after EV spike | Too soft | MED |
| BAL-SUMMON-UI-COST-10X | UI 10× canister | Show canister cost | No fake 100 Doka price | Copy only | HIGH |
| BAL-TITAN-VIGOR-FLAT-1000 | +1000 HP | `+0.5–1.0 × combat maxHP` | Modifier scales | Too weak/strong | MED |
| BAL-DUNGEON-MULT-FORMULA-SPLIT | FE table vs BE `1+0.25d`; XP unscaled | One table; decide whether XP is multiplied | HUD = persist | Double-pay if stacked wrong | HIGH |
| BAL-BUFF-SHOP-OVERWORLD-DOMINATED | 50 Doka / 30% vs 1:3 | Combat-only potions **or** cut overworld heal | Shop has a niche | Economy sink | MED |
| BAL-JACKPOT-HEAL-1-DOKA | 1 Doka full HP | Remove or 20–40% of missing HP | Doka→HP stays the heal | Flavor | MED |
| BAL-AP-GROWTH-UNREACHABLE | cap 20 vs formula 21 at 325 | Raise cap **or** stop growing at 20 | Persist matches battle | Irrelevant before XP wall | LOW |
| BAL-CREATE-VITALS-MISMATCH | create 10/5 vs battle 8/4 | Create 8/4 | Forge matches first fight | Cosmetic | HIGH |
| BAL-GAMEKEY-MINT-UNBOUNDED | admin 10M vs applyRewards 100k | Align grant cap with persist or a documented exception | No silent 100× mint | Ops grants | MED |
| BAL-IAP-PACKAGES-ORPHANED | euro ladder seeded, no-op | Delete from player UI **or** wire (not both) | No fake shop | None if delete | HIGH |
| BAL-TWO-SPELL-CATALOGS / VOID / BOSS-CATALOG | `admin.mo` fireball/void_collapse vs `spellData.ts` | One catalog | Admin preview = combat | Content pass | MED |
| BAL-FAMILY-COMBAT-IDENTITY | hpMult/res overwritten | Apply family to combat HP/RES **or** stop rolling families | Families are not skins | Balance pass | MED |
| BAL-MP-UNUSED-ON-STARTERS | all `mpCost=0` | Put MP on 4–6 spells | MP is a resource | Timestep refunds MP | MED |
| BAL-TIMESTEP-FREE-TURN | 0 AP full reset | Cost 2–4 AP **or** restore half | Extra turn is a choice | Identity | MED |
| BAL-DOMINATED-SPELLS | Venom, Iron Skin, Expose | Differentiate or retire | Every spell has a job | Feel | MED |

Do **not** auto-implement numeric ranges. `BAL-ENEMY-KIT-ZONE-OBJECT` and `BAL-PLAYER-CC-DEAD-ON-BAR` are wiring bugs (advertised behavior missing), not retunes; they still need a human because they raise enemy/player power.

---

## ACTION blocks

ACTION_ID: BAL-DOKA-LOTTERY-BILLION
TITLE: Replace the 1e9 Doka jackpot band
CATEGORY: economy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 12379-12414; applyRewardsResult.ts 46-62; main.mo 2119
CURRENT_BEHAVIOUR: Per-enemy roll; 0.01% band is uniform 1..1_000_000_000 times enemy.level. Raw E[mult]≈50006.88. Client clamps persist to 100_000 so jackpot persist EV is 10 Doka/enemy plus non-jackpot ≈level×6.88. Recap can still show the raw roll.
DESIRED_BEHAVIOUR: Remove the billion band. Keep a small rare spike (max multiplier tens–low hundreds) so persist EV is a few×enemy.level without a 100_000 spike.
EVIDENCE: Monte Carlo bands in WorldExploration; E[mult] 50006.88 of which 50000 is the jackpot. L1 3-pack persist mean ≈254 is almost entirely that +10/enemy jackpot term plus uptiered enemy.level.
RECOMMENDED_ACTION: Redesign the table; do not only lower the persist cap (that already exists and still mints 100k).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if jackpot flavor is intended; persist tests for clampApplyRewardsDeltas
VALIDATION_REQUIRED: EV unit test on the new table; recap vs persist match; import gate
STATUS: OPEN
ACTION_ID: BAL-XP-EXPONENTIAL-WALL
TITLE: Slow the XP doubling after the early game
CATEGORY: progression
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: xpCurve.ts; main.mo applyRewards 2126-2132
CURRENT_BEHAVIOUR: N→N+1 = 100×2^(N-1). Kill XP = 20×enemy.level. Live 3-pack at L1 is 660 XP (0.15 fights); L10 77.6 fights; L15 1517 fights; L25 ~1e6 fights.
DESIRED_BEHAVIOUR: Keep a climb after L8 without making L15 a stop. Example target: L10 in tens of fights, L15 in low hundreds, not thousands.
EVIDENCE: 8k spawn MC this run; xpThresholdBigInt; computeVictoryExp.
RECOMMENDED_ACTION: Change the curve in xpCurve.ts and Motoko together. Do not also raise L1 kill XP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — leftover XP, recap, death 20%, HUD saturation L48
VALIDATION_REQUIRED: applyXpDelta / applyRewards twins; recapXpAfterGrant; longHorizonSim
STATUS: OPEN
ACTION_ID: BAL-DMG-NO-LEVEL-SCALE
TITLE: Player damage ignores character level
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 130-137; spellEngine.ts calcScaledDamageInline 1038-1044
CURRENT_BEHAVIOUR: floor(base×1.03^upgrade). Caster level argument is unused. Enemy combat HP grows 5%/level linear.
DESIRED_BEHAVIOUR: A small caster-level term, or flatten enemy HP growth to match. Do not stack this with an un-nerfed Sacrifice.
EVIDENCE: calcScaledDamage signature; calcEnemyMaxHp vs calcScaledDamage.
RECOMMENDED_ACTION: Human pick one axis (player dmg up or enemy HP slower). Retune Sacrifice in the same change.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: computeDamage tests; Sacrifice TTK at L1/L10/L25
STATUS: OPEN
ACTION_ID: BAL-ENEMY-TIER-OUTLIER
TITLE: Cap the far-tier spawn tail
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts pickEnemyLevelFromTiers 54-107
CURRENT_BEHAVIOUR: 10% mass is ±3..6 tiers (30–60 levels) after a 15% ±1 variance. L1 max 80 this run.
DESIRED_BEHAVIOUR: Soft cap distance by player level (e.g. L1 cannot roll above ~L6–L12) or shrink the ±3..6 band.
EVIDENCE: 8k MC L1 max 80; hist 5% at 31+.
RECOMMENDED_ACTION: Change pickEnemyLevelFromTiers; keep dungeon DUNGEON_TIER_BOOST as the explicit hard mode.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Monte Carlo L1/L10/L25; spawnPolicy tests
STATUS: OPEN
ACTION_ID: BAL-TIER-FLOOR-UPBIAS
TITLE: L1–10 share tier 0 and cannot down-tier
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 54-107
CURRENT_BEHAVIOUR: playerTier = floor((L-1)/10). At L1, −1 tier clamps to 0. Mean enemy 10.84, p(enemy>player)=0.927.
DESIRED_BEHAVIOUR: Separate the first 5–10 player levels from the L10 band, or allow below-player rolls that are not clamped to the same 1–10 bucket as L10.
EVIDENCE: L1 and L8 mean enemy both ~11 this run.
RECOMMENDED_ACTION: Redesign the floor. Do not only change percents (60/20/10/10 still sit in 1–10).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: MC L1 vs L10 means must diverge
STATUS: OPEN
ACTION_ID: BAL-ENEMY-KIT-ZONE-OBJECT
TITLE: Pass a numeric zone into buildEnemyKit
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11920; enemyAI.ts 163-199
CURRENT_BEHAVIOUR: buildEnemyKit(piece, currentMap.levelZone) with a LevelZone object. Math.floor(object) is NaN. Every kit is zone 0 (Strike/Frost only).
DESIRED_BEHAVIOUR: Pass floor((playerLevel-1)/10) or the existing setCurrentZoneTier number.
EVIDENCE: enemyAI.ts builder(Math.max(0, Math.floor(levelZone))); WX 11920; longHorizonSim kitsLiveCallSite.
RECOMMENDED_ACTION: Wiring fix only. Do not change kit contents in the same PR without a retune.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — late Inferno/heal kits appear
VALIDATION_REQUIRED: kitForZoneInput(object) vs numeric; an L25 fight shows venom/iron-skin/inferno
STATUS: OPEN
ACTION_ID: BAL-PLAYER-COMBAT-STATS-FLAT
TITLE: Persisted ATK/RES/CHC/evasion do not drive outgoing damage
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; combatMath.ts calcScaledDamage; WorldExploration computeDamage 3295-3366
CURRENT_BEHAVIOUR: Create writes atk 15, res 10, chc 5, evasion 5. Outgoing damage uses spell base × upgrade × SP (spells only) × RES/SR on the target. Player ATK unused. Incoming uses character RES.
DESIRED_BEHAVIOUR: Either wire ATK/CHC/evasion into computeDamage or stop showing them as combat stats on the forge.
EVIDENCE: computeDamage; CharacterStats 12-field persist.
RECOMMENDED_ACTION: Human pick wire vs hide. Do not invent a second damage formula.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: forge vs first-hit breakdown
STATUS: OPEN
ACTION_ID: BAL-SPELL-FAIL-FLOOR
TITLE: 20% spell fizzle until high level
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts 641-651; WorldExploration.tsx 3646-3650; DEFAULT_LEVELUP_CONFIG
CURRENT_BEHAVIOUR: 20% − 0.1%/level, 0% at L201. Physical Strike exempt. L15 is still 18.6%.
DESIRED_BEHAVIOUR: 5–10% at L1, near 0 by L20–30, or remove fail.
EVIDENCE: spellFailChance; physical exemption.
RECOMMENDED_ACTION: Tune spellFailBaseChance / reduction. Pair with Strike range cap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1/L10 fail chance unit tests
STATUS: OPEN
ACTION_ID: BAL-TIMESTEP-FREE-TURN
TITLE: Timestep is a free extra turn
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts 216-231; spellEngine.ts 721-734
CURRENT_BEHAVIOUR: 0 AP, 0 MP, restores AP and MP, once per battle, innate.
DESIRED_BEHAVIOUR: Cost 2–4 AP, or restore half, or once per N battles.
EVIDENCE: isTimestep branch returns "no_ap" so the caller does not debit.
RECOMMENDED_ACTION: Do not delete the spell. Change cost or restore amount.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: timestepUsedRef still blocks a second cast
STATUS: OPEN
ACTION_ID: BAL-SACRIFICE-PERCENT-HP
TITLE: Sacrifice deals 60% of current HP
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts 749-758; spellData.ts 233-250
CURRENT_BEHAVIOUR: floor(currentHP×0.2)×3. Same-level combat eHP is 50% of player linear HP, so ratio is 1.20 from L1–L100. Live L1 spawn oneshot rate 0.36 because of uptier.
DESIRED_BEHAVIOUR: Damage in the 0.8–1.0× same-level eHP band at full HP, not 1.2×, or scale vs missing HP.
EVIDENCE: sac vs eHP table this run.
RECOMMENDED_ACTION: Change the 0.2 / ×3 pair. Keep self-hit on challenge damage.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: L1/L10/L100 oneshot vs same-level and vs live mean spawn
STATUS: OPEN
ACTION_ID: BAL-CHALLENGE-XP-EARLY-BREAK
TITLE: Hard/legendary XP skips early levels
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts 44-109
CURRENT_BEHAVIOUR: hard_1 500 XP, legendary_1 1000 XP, independent of level. At L1 that is L3 leftover 200 / L4 leftover 300.
DESIRED_BEHAVIOUR: Scale with current xpThreshold (e.g. 25–40% of N→N+1).
EVIDENCE: applyXpDelta(0,1,500) and (0,1,1000).
RECOMMENDED_ACTION: Change rewards table, not completion predicates.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 and L10 grant vs threshold
STATUS: OPEN
ACTION_ID: BAL-IAP-VALUE-DOMINANCE
TITLE: Player shop Doka/€ (superseded)
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: dokaGameKey.ts DOKA_PER_EURO=100; admin.mo ShopPackage ladder
CURRENT_BEHAVIOUR: Live player buy path is GameKey 100 Doka/€. Seeded packages are a no-op.
DESIRED_BEHAVIOUR: Keep GameKey as the IAP path; do not revive the euro ladder without a design pass.
EVIDENCE: processPendingPurchases no-op; DOKA_PER_EURO.
RECOMMENDED_ACTION: None on the player shop. See BAL-IAP-PACKAGES-ORPHANED.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: none
STATUS: SUPERSEDED
ACTION_ID: BAL-HP-FORMULA-SPLIT
TITLE: HUD HP is linear; getPlayerBaseStats HP is compounding
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 3400-3406; progression.ts 74-80
CURRENT_BEHAVIOUR: HUD floor(100×(1+(L-1)×0.05)). Formula round(100×1.05^(L-1)) unused for HUD, used for battle AP/MP companion.
DESIRED_BEHAVIOUR: One HP function for HUD, persist cap, and death respawn.
EVIDENCE: L10 HUD 145 vs compounding 155.
RECOMMENDED_ACTION: Pick linear (current live) and delete the compounding HP path, or vice versa.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — persistHpWriteCap
VALIDATION_REQUIRED: respawnHpAfterDeath matches HUD/2
STATUS: OPEN
ACTION_ID: BAL-VICTORY-FLOOR-OVER-MAXHP
TITLE: Victory HP floor exceeds max HP from L10
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: deathPenalty.ts victoryResourceFloor 144-155; longHorizonSim victoryHpFloor
CURRENT_BEHAVIOUR: floor HP = 50+10L. Linear max HP = floor(100×(1+(L-1)×0.05)). Exceeds from L10 (150 vs 145). PR #386 is open, not in this HEAD.
DESIRED_BEHAVIOUR: min(floor, maxHp).
EVIDENCE: victoryHpFloor(10)=150 > linearPlayerMaxHp(10)=145.
RECOMMENDED_ACTION: Cap at persist/HUD max. Let #386 land or reimplement the one-line min.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: longHorizonSim.test victoryFloorExceedsMax
STATUS: OPEN
ACTION_ID: BAL-RECAP-XP-BAR-WRONG
TITLE: Recap XP bar after grant
CATEGORY: hud
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx recapXpAfterGrant 12451-12455
CURRENT_BEHAVIOUR: Recap uses recapXpAfterGrant leftover/level/needed.
DESIRED_BEHAVIOUR: Already matches applyRewards leftover semantics.
EVIDENCE: handleBattleEnd recapXp; xpCurve.ts recapXpAfterGrant.
RECOMMENDED_ACTION: None.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: none
STATUS: RESOLVED
ACTION_ID: BAL-FAMILY-COMBAT-IDENTITY
TITLE: Family hpMult/res do not survive battle start
CATEGORY: spawn
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spawnPolicy.ts FAMILY_STAT_MULTS; WorldExploration calcEnemyMaxHp 3607-3614
CURRENT_BEHAVIOUR: 30% family overwrites hp and res at spawn; battle start sets HP from calcEnemyMaxHp. Family res 0.05–0.75 vs integer RES.
DESIRED_BEHAVIOUR: Apply family to combat HP and RES, or stop rolling combat-affecting families.
EVIDENCE: spawnPolicy applyFamily; calcEnemyMaxHp overwrite.
RECOMMENDED_ACTION: One identity path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: iron_golem combat HP vs default
STATUS: OPEN
ACTION_ID: BAL-DOMINATED-SPELLS
TITLE: Several starter spells are strictly worse copies
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts
CURRENT_BEHAVIOUR: Venom Strike = Poison Arrow DoT at +1 AP and −2 range. Iron Skin = Shield at +1 AP. Expose 15/3 vs Cursed Wound 22/3. Inferno 0+24/5 vs Frost 20/3.
DESIRED_BEHAVIOUR: Each spell has a job (range, CD, extra effect that actually applies, or retire).
EVIDENCE: Normalized table this run.
RECOMMENDED_ACTION: Differentiate or hide from the innate bar. Pair with BAL-PLAYER-CC-DEAD-ON-BAR so extras exist.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: DPA table after change
STATUS: OPEN
ACTION_ID: BAL-SUMMON-UI-COST-10X
TITLE: Summon upgrade UI is 10× the canister charge
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants.ts SUMMON_UPGRADE_COST_MULTIPLIER; spellUpgrade.ts 103-141
CURRENT_BEHAVIOUR: UI 100×2^n; upgradeSpell 10×2^n. spellUpgradeUiSpend already debit-corrects the wallet.
DESIRED_BEHAVIOUR: Show 10×2^n, or actually charge 100×2^n (do not do both silently).
EVIDENCE: spellUpgradeCanisterSpend.
RECOMMENDED_ACTION: Copy fix preferred over charging 10× more.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if copy-only
VALIDATION_REQUIRED: spellUpgrade tests
STATUS: OPEN
ACTION_ID: BAL-DEATH-DOKA-40
TITLE: Death deletes 40% of all Doka
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: deathPenalty.ts 11-12
CURRENT_BEHAVIOUR: 40% wallet, 20% leftover XP. After a 100k persist jackpot, death is −40k. After median fights, death is −a few dozen.
DESIRED_BEHAVIOUR: 10–20% or a cap, after the lottery is retuned. Do not nerf death while jackpots still mint 100k.
EVIDENCE: computeDeathPenalty; applyRewards clamp.
RECOMMENDED_ACTION: Sequence after BAL-DOKA-LOTTERY-BILLION.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: deathPenalty tests; unpaid death slot
STATUS: OPEN
ACTION_ID: BAL-AP-GROWTH-UNREACHABLE
TITLE: Formula AP exceeds persist cap at L325
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts 71; adminGuard.mo MAX_PERSISTED_AP=20; maxPersistedAp 649-654
CURRENT_BEHAVIOUR: AP = 8+floor(L/25). L300=20, L325=21. Persist min(ap, 20) unless grandfathered.
DESIRED_BEHAVIOUR: Cap growth at 20 or raise persist cap. Irrelevant before the XP wall.
EVIDENCE: formulaAp(325)=21.
RECOMMENDED_ACTION: Defer until XP curve lets anyone reach L300.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: persistApWriteCap tests
STATUS: OPEN
ACTION_ID: BAL-VOID-COLLAPSE-UNREACHABLE
TITLE: Void Collapse is not on the live bar and costs 12 AP
CATEGORY: content
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: admin.mo 190; starterSpells; PLAYER_BASE_AP=8
CURRENT_BEHAVIOUR: Backend catalog AP 12, minLevel 30, attract_multi. Not in spellData.ts. Player AP is 8 until L25 (AP 9).
DESIRED_BEHAVIOUR: Port into starterSpells at an affordable AP, or stop treating it as a built-in.
EVIDENCE: isBuiltInSpellId("void_collapse"); starterSpells has no matching id.
RECOMMENDED_ACTION: Catalog union with BAL-TWO-SPELL-CATALOGS.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: cannot equip / cannot cast at L1
STATUS: OPEN
ACTION_ID: BAL-DUNGEON-MULT-FORMULA-SPLIT
TITLE: Three dungeon multipliers, XP unscaled on persist
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: portalRules.ts 148-161; WorldExploration.tsx 12528-12538; main.mo 2918
CURRENT_BEHAVIOUR: FE Doka table 1/1.5/2/2.5/3/4. Persist XP uses PREAPPLIED=1 so chain does not multiply XP. BE dungeonRecords store 1+0.25×depth.
DESIRED_BEHAVIOUR: One table. Explicitly choose whether XP is multiplied. Recap multiplier must match persist.
EVIDENCE: dungeonDokaMultiplierFor vs updateDungeonProgress; PREAPPLIED comment.
RECOMMENDED_ACTION: Delete or ignore BE bestRewardMultiplier for payout; document FE as source of truth.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if XP suddenly ×4 at depth 5 (L15 wall interaction)
VALIDATION_REQUIRED: persist-doka tests; recap dungeonMultiplier
STATUS: OPEN
ACTION_ID: BAL-TITAN-VIGOR-FLAT-1000
TITLE: Titan’s Vigor is +1000 HP on ~50–110 combat HP enemies
CATEGORY: modifiers
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants.ts 331-333; mapModifiers.ts titans_vigor
CURRENT_BEHAVIOUR: Flat +1000 HP (then ×1–5). Mean L1 combat HP 74.
DESIRED_BEHAVIOUR: Bonus as a multiple of combat maxHP (0.5–1.0×) or per-level.
EVIDENCE: MAP_MODIFIER_TITANS_VIGOR_HP_BONUS=1000 vs calcEnemyMaxHp.
RECOMMENDED_ACTION: Replace the flat constant.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: modifier unit test
STATUS: OPEN
ACTION_ID: BAL-JACKPOT-HEAL-1-DOKA
TITLE: Jackpot heal is full HP for 1 Doka
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: itemShop.ts JACKPOT_HEAL_DOKA_COST=1
CURRENT_BEHAVIOUR: 0.5% of Doka→HP clicks restore full HP for 1 Doka vs 1:3 otherwise.
DESIRED_BEHAVIOUR: Remove, or restore 20–40% missing HP.
EVIDENCE: itemShop.ts 27-31, 53-66.
RECOMMENDED_ACTION: After lottery retune; flavor-only if EV is already broken.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: jackpot heal tests
STATUS: OPEN
ACTION_ID: BAL-BUFF-SHOP-OVERWORLD-DOMINATED
TITLE: BuffShop potions cost 5× overworld Doka→HP at L1
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BuffShop.tsx BUFF_ITEMS; itemShop.ts dokaHealAmounts
CURRENT_BEHAVIOUR: Health Potion 50 Doka for 30% (30 HP at L1) = 1.67 Doka/HP. Overworld 0.33 Doka/HP. In battle, potions do not spend AP.
DESIRED_BEHAVIOUR: Combat-only, or price near 0.4–0.6 Doka/HP, or cut overworld heal in battle (already battle-blocked).
EVIDENCE: healL table this run.
RECOMMENDED_ACTION: Keep potions as the in-battle Doka heal; do not buff overworld.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: BuffShop purchase tests
STATUS: OPEN
ACTION_ID: BAL-TWO-SPELL-CATALOGS
TITLE: Admin default spells are not starterSpells
CATEGORY: content
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: admin.mo default spells; data/spellData.ts; data/bossKits.ts
CURRENT_BEHAVIOUR: Backend seeds vampire_bite, void_collapse, fireball, … Frontend combat uses starterSpells / BOSS_KITS ids.
DESIRED_BEHAVIOUR: One list.
EVIDENCE: admin.mo 179-190 vs SPELL_ID_CATALOG.
RECOMMENDED_ACTION: Content union; do not silently map names.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: validateBossKits; admin preview cast
STATUS: OPEN
ACTION_ID: BAL-MP-UNUSED-ON-STARTERS
TITLE: Every starter spell costs 0 MP
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts mpCost BigInt(0) on all rows
CURRENT_BEHAVIOUR: MP grows with AP every 25 levels and is refunded by Timestep, but nothing spends it. Haste/Slow advertise MP buffs.
DESIRED_BEHAVIOUR: Put MP on 4–6 spells (nukes/summons).
EVIDENCE: starterSpells scan.
RECOMMENDED_ACTION: After Timestep retune so refund is not free MP too.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: canAffordCast
STATUS: OPEN
ACTION_ID: BAL-BOSS-RUSH-TABLE-UNPAID
TITLE: Boss Rush room table is not persisted
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: useBossRush.ts BOSS_RUSH_ROOMS; WorldExploration.tsx 12749-12757; bossRushProgress.ts completeBossRushRoom 0,0
CURRENT_BEHAVIOUR: Table sums 21_000 Doka / 8_500 XP. Persist is max(5, floor(L×1.5)) Doka per kill + kill XP. roomMultiplier=1.
DESIRED_BEHAVIOUR: Persist a stated fraction of the table, or stop rendering dokaReward/xpReward as earnings.
EVIDENCE: dokaPerEnemy vs BOSS_RUSH_ROOMS[0].dokaReward=500.
RECOMMENDED_ACTION: Recap copy first (low risk) or wire a capped grant (interacts with XP wall).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if 8500 XP is paid at L1
VALIDATION_REQUIRED: bossRushProgress tests; applyRewards clamp
STATUS: OPEN
ACTION_ID: BAL-STARTER-KIT-NO-GATING
TITLE: All 32 starter spells are innate
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 2396-2404; spellData.ts starterSpells
CURRENT_BEHAVIOUR: Every catalog row is isBaseSpell true. Timestep, Sacrifice, five summons, Chain Lightning all at L1.
DESIRED_BEHAVIOUR: Innate 8–12; rest discovered or purchased. Keep Strike + one heal + one control.
EVIDENCE: starterSpells.length 32; map isBaseSpell true.
RECOMMENDED_ACTION: Gating only; do not delete spells.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH for existing saves (isBaseSpell)
VALIDATION_REQUIRED: spell bar hydrate; upgradeSpell retired-spell rule
STATUS: OPEN
ACTION_ID: BAL-SUMMONER-SATURATION
TITLE: Enemy summoner chance hits 100% at L44
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11932-11942; gameConstants.ts 298-301
CURRENT_BEHAVIOUR: 0.12 + playerLevel×0.02 per non-summon enemy. Comment says levelZone; code uses playerLevel. Cap 2 alive, CD 2 turns.
DESIRED_BEHAVIOUR: Use zone, asymptote ~20–40%, keep cap 2.
EVIDENCE: summonerChance(44)=1.0.
RECOMMENDED_ACTION: Change the linear term. Keep ENEMY_SUMMON_CAP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 vs L25 roll rate
STATUS: OPEN
ACTION_ID: BAL-HARD3-AP8-FREE
TITLE: Never spend more than 8 AP is free while AP is 8
CATEGORY: challenges
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts 81-86, 126-127; PLAYER_BASE_AP=8
CURRENT_BEHAVIOUR: maxApUsedInTurn <= 8. Player AP is 8 until L25. Pays 150 Doka / 450 XP.
DESIRED_BEHAVIOUR: Threshold as a fraction of current max AP, or a lower absolute (5–6) while AP is 8.
EVIDENCE: formulaAp(1..24)=8.
RECOMMENDED_ACTION: Predicate only; keep rewards on BAL-CHALLENGE-XP-EARLY-BREAK.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: isChallengeCompleted tests
STATUS: OPEN
ACTION_ID: BAL-BOSS-CATALOG-SPLIT
TITLE: Frontend vs backend boss HP and reward multipliers
CATEGORY: content
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: types/bossDefaults.ts; admin.mo defaultBossConfigs
CURRENT_BEHAVIOUR: FE Pale Archbishop 350 HP, ×5 Doka / ×3 XP. BE 500 HP, ×10 / ×8. Spell ids also diverge (BOSS_KITS vs fireball).
DESIRED_BEHAVIOUR: Live combat and admin seed the same BossConfig.
EVIDENCE: bossDefaults.ts 23-32 vs admin.mo 353-368.
RECOMMENDED_ACTION: Pick FE kits + stats as live; stop seeding BE spell ids that are not in SPELL_ID_CATALOG.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: validateBossKits; Boss Guide vs battle HP
STATUS: OPEN
ACTION_ID: BAL-IAP-PACKAGES-ORPHANED
TITLE: ShopPackage euro ladder is seeded and unused
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: admin.mo 267-281; processPendingPurchases
CURRENT_BEHAVIOUR: pkg_10 is 10 Doka / 100 cents (10 Doka/€) vs GameKey 100 Doka/€. Player path does not buy packages.
DESIRED_BEHAVIOUR: Remove from player-facing UI, or document admin-only.
EVIDENCE: default packages; iapShopCopy tests for GameKey.
RECOMMENDED_ACTION: Do not wire packages at the old prices.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: none
STATUS: OPEN
ACTION_ID: BAL-GAMEKEY-MINT-UNBOUNDED
TITLE: Admin Doka grant cap is 100× applyRewards
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard.mo validateDokaGrant 1-10_000_000; main.mo applyRewards 100_000
CURRENT_BEHAVIOUR: redeemGameKey / adminAddDokaToUser can credit up to 10M outside applyRewards.
DESIRED_BEHAVIOUR: Documented ops exception, or cap grants at 100k unless a separate admin flag.
EVIDENCE: MAX_DOKA_GRANT vs APPLY_REWARDS_MAX_DOKA_DELTA.
RECOMMENDED_ACTION: Human/ops policy. Do not silently cut live GameKey payouts.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: adminSafety grant tests
STATUS: OPEN
ACTION_ID: BAL-CREATE-VITALS-MISMATCH
TITLE: Forge shows AP 10 / MP 5; battle uses 8 / 4
CATEGORY: hud
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts 7-21; progression.ts PLAYER_BASE_AP/MP
CURRENT_BEHAVIOUR: Create payload 10/5. persistApWriteCap grandfathers 10. Battle init overwrites to 8/4.
DESIRED_BEHAVIOUR: Forge 8/4.
EVIDENCE: startingChampionStats.test; getPlayerBaseStats(1).
RECOMMENDED_ACTION: Change startingChampionStats only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: startingChampionStats tests
STATUS: OPEN
ACTION_ID: BAL-BOSS-GUIDE-VS-COMBAT
TITLE: Boss Guide 8%/level is not combat HP
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts getBossEffectiveStats 249-338; WorldExploration boss HP 11970; types/bossDefaults.ts
CURRENT_BEHAVIOUR: Guide HP = round(base×1.08^(bossLevel-playerLevel)). Combat uses catalog baseStats.hp (FE 350, BE 500) plus phase2.statMultiplier at the HP threshold. longHorizonSim.bossGuideVsCombat already prints the split.
DESIRED_BEHAVIOUR: Combat consumes getBossEffectiveStats, or the Guide labels the table as non-authoritative.
EVIDENCE: progression.ts comments 266-272; DEFAULT_BOSS_CONFIGS pale_archbishop hp 350.
RECOMMENDED_ACTION: Prefer labeling first (low risk). Wiring combat to 1.08^Δ is a full boss retune.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if combat is scaled without a HP pass
VALIDATION_REQUIRED: Boss Guide row vs in-fight maxHp
STATUS: NEW
ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 grows Strike more than casters
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx getEffectiveSpellRange 3652-3667; DEFAULT_LEVELUP_CONFIG maxSpellRange=5, spellRangeGrowthLevels=10
CURRENT_BEHAVIOUR: effective = min(base + floor(L/10), 5). Strike 1→2 at L10 →5 at L40. Frost 4→5 at L10 and stops. Strike never fizzles.
DESIRED_BEHAVIOUR: Cap ≥ 6–8, or grow range from spell upgrade, or stop growing Strike past 2–3.
EVIDENCE: range table this run; spellFail exemption.
RECOMMENDED_ACTION: Change maxSpellRange or exclude isPhysical from level bonus.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — targeting.parity tests
VALIDATION_REQUIRED: getEffectiveSpellRange L1/L10/L40 Strike vs Frost
STATUS: NEW
ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player casts do not apply debuffStat
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 876-1028 vs resolveSpellCast 529-548
CURRENT_BEHAVIOUR: Enemy/summon path writes Slow/Frost/Weaken/Expose/Shadow Veil/Drain Courage/Cursed Wound extras. Player damage loop deals damage and returns. Advertised CC is dead on the bar. Buffs (Shield, Iron Skin, Haste) still apply via the earlier buff branch.
DESIRED_BEHAVIOUR: After a successful player hit (and on pure-debuff spells), apply debuffStat like resolveSpellCast. Floor combined AP/MP debuffs at 1 so Frost+Slow cannot zero a unit.
EVIDENCE: No applyEffect in the player damage loop; applyEffect exists only on the shared/enemy path. Matches EBMA-2026-09-02-004; filed here because it changes the DPA/CC table.
RECOMMENDED_ACTION: Wiring + AP/MP floor. Do not change Slow/−2 or Frost/−1 numbers in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: player Slow writes mp debuff; two MP debuffs cannot pass the floor; Haste still stacks; Archer kit Slow still works
STATUS: NEW
ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive-cap or cooldown
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts 547-688; gameConstants.ts ENEMY_SUMMON_CAP=2; WorldExploration spawnPlayerSummon
CURRENT_BEHAVIOUR: Five innate summons, AP 2–3, no cooldown. Enemy side is capped at 2 with a 2-turn CD. An 8-AP turn places Wolf+Archer+Wisp, each with its own turn.
DESIRED_BEHAVIOUR: Alive cap 2 or 3; 1–2 turn cooldown per summon spell. Keep kit identities and lifespan formulas.
EVIDENCE: ENEMY_SUMMON_CAP vs no player check; summon rows omit cooldown. Parallel to EBMA-2026-09-02-002.
RECOMMENDED_ACTION: Cap at spawn; add CD. Do not change hpScale numbers here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — occupancy fallback
VALIDATION_REQUIRED: fourth summon rejected if cap=3; recast during CD on_cooldown
STATUS: NEW
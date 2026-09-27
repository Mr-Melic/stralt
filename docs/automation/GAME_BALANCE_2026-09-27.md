# Quantitative game-balance analysis — 2026-09-27

**Analyst:** Stralt quantitative game-balance (cron `0 */48 * * *`)
**This run:** 2026-09-27 00:05 UTC
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — unchanged since 2026-09-21)
**Prior reports:** [`GAME_BALANCE_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/640) (#640), #582 (09-25), #505 (09-24), #472 (09-23)
**Gameplay / balance numbers:** **not modified.** Report-only.

No live telemetry collectors exist at this HEAD (same as TBC WAITING_FOR_TELEMETRY). Findings are **formula + Monte Carlo**, not observed win rates.

**Queued (not in HEAD):** #386 victory HP floor cap; #528 / #555 player `debuffStat` after damage.

---

## Method

- Re-read live formulas in `src/frontend` + `src/backend/main.mo`.
- Monte Carlo: 8 000 packs × 3 enemies, mulberry32 seed **20260927**, `pickEnemyLevelFromTiers` with default admin weights (60 / 20 / 10 leftover-10, `tierSize` 10, ±1 variance 15% each side).
- Victory XP uses the **live** path: `sum(level×20)×1.5` because WorldExploration `boostMode` is stuck at `"xp"`.
- Persist Doka EV uses clamped lottery (jackpot band persist 100 000, not 1e9).
- Ability table: advertised `calcScaledDamage` vs live `resolvePlayerCast` → `calculatePlayerDamage` (upgrade scale **and** crit applied twice). Target RES/SR = 0.

---

## Scenario snapshot (live spawn, 3-enemy pack)

XP/fight includes locked 1.5×. Persist Doka EV ≈ `3 × (meanLevel × 6.877 + 10)`.

| Band | Player L | Mean enemy L | p(eL > L) | XP/fight live | Fights/level | Mean eHP | Sac (full) | p(sac OS) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 10.84 | 0.926 | 976 | 0.10 | 74 | 60 | 0.36 | 254 | no |
| Mid | 8 | 10.86 | 0.431 | 977 | 13.1 | 74 | 81 | 0.77 | 254 | no |
| Mid | 10 | 10.86 | 0.288 | 978 | 52.4 | 74 | 87 | 0.82 | 254 | **yes** |
| Late | 15 | 17.86 | 0.499 | 1608 | 1019 | 92 | 102 | 0.76 | 399 | yes |
| Stress | 25 | 26.73 | 0.502 | 2405 | 6.97e5 | 114 | 132 | 0.79 | 581 | yes |
| Stress | 50 | 45.95 | ~0.50 | 4136 | 1.36e13 | 162 | 207 | 0.91 | 978 | yes |

HUD max HP = `floor(100×(1+(L−1)×0.05))`. Combat AP/MP = 8/4 until L25. Sac = `floor(maxHP×0.2)×3`. Enemy HP = `floor(50×(1+(eL−1)×0.05))`.

---

## 2026-09-27 vs 2026-09-26

- **HEAD unchanged** (`0f5363f`). All prior `BAL-*` formulas re-read; none flipped.
- Spawn MC (new seed): L1 mean **10.84** (was 11.10), p(level above player) **0.926** (was 0.933). Same up-bias class.
- New P2: `BAL-AI-TIER-VARIANCE-30` — 30% of `computeAITier` rolls uniform 1–10; L1 enemies ~18% erratic-eligible, ~3.2% betrayal-eligible.
- New P3: `BAL-AI-TIER-GATES-DEAD` — `ENEMY_AI_TIER_GATES` (instantKill 9, groupTactics 4, …) is **unreferenced**; live WX hardcodes `aiTier >= 5` and `>= 10`.
- Boost dual-store restated under `BAL-BOOST-LOCKED-XP-150`: App state is passed into GameFlow as `_boostMode` (unused); WX owns a second `useState("xp")` with `_setBoostMode` never called. Mounting `BoostToggle` in App would still not move WX math.
- #386 / #528 / #555 still not in HEAD.

---

## Domain findings (compact)

### Player progression

XP curve `100 × 2^(N−1)` (`xpCurve.ts`, `main.mo` `applyRewards`). L1→2 is **one** boosted 3-pack (~976 XP vs 100 need) — **trivial**. L15→16 needs 1.64e6 XP ≈ **1019 fights**. L25 is a hard wall (~7e5 fights). Player combat ATK/RES/INIT persist but **spell damage ignores caster level** (`calcScaledDamage` discards `_casterLevel`). Battle AP/MP stay 8/4 until `floor(L/25)`. HUD HP is linear 5%/level; `getPlayerBaseStats` HP is `100×1.05^(L−1)` (L25: 220 vs 323). Create payload AP 10 / MP 5 vs battle 8/4.

### Enemy scaling

Same-tier 60% + leftover **10%** (admin `threeOrMorePercent=5` unused) + 15% ±1 variance. L1–10 share one tier → L1 mean ~11, **93% of spawns above the player**. Dungeon adds `DUNGEON_TIER_BOOST[depth]×10` levels and extras `[0,2,3,4,4,5]`. Piece multipliers affect SP/SR/INIT/RES/CHC only; HP is level-linear. ~30% family variants **overwrite** RES with 0.05–0.75 (then treated as percent → ~0% mitigation). Backend `getEnemyHPForLevel` (tier 30+20) is unused by combat.

### Damage

Live player hits: `calcScaledDamageInline` then WX `computeDamage` scales **again** and multiplies crit **again**. Upgrade 0 crit = **4× advertised**. Upgrade 5 Frost: advertised 23, live 26, live crit **106**. Enemy fallback Crush = `12 × max(1, level/5) × enrage` vs kit Strike 10 — at mean L11 Crush ≈ 26 (2.6× kit). Enemy RES/SR grow with level; rook RES can hit 100 at L78 (full immunity). No cap. Hazards: lava 8–15 + Burning 3×3, spikes 5–10, **bypass RES**.

### AP efficiency (upgrade 0, RES=0)

| Spell | AP | Live non-crit | Live crit | dmg/AP | Dominated by |
| :--- | ---: | ---: | ---: | ---: | :--- |
| Strike | 2 | 10 | 40 | 5.0 | Frost on a single target unless SR≫RES |
| Frost Bolt | 3 | 20 | 80 | 6.67 | — (MP −1 never applied on bar) |
| Chain Lightning | 4 | 20 | 80 | 5.0 | Frost unless ≥2 extra bounces hit |
| Poison Arrow | 2 | 12 over 3t | 12 | 6.0 | Frost (DoT ignores upgrades) |
| Blood Mend | 3 | 12 heal | 24 | 4.0 HP/AP | Overworld Doka heal (`ceil(hp/3)` Doka) |
| Life Drain | 3 | 10 + 5 | 40 + 5 | 3.3 | Frost; SP debuff dead |
| Sacrifice | 3 | 60 at L1 | — | 20 | Oneshots 36% of L1 spawns from full HP |
| Timestep | 0 | full AP/MP | — | ∞ | Entire resource economy (once/battle) |

Starter `mpCost` is 0 on the bar (`BAL-MP-UNUSED-ON-STARTERS`). `maxSpellRange=5`: Frost already 4, so range growth almost only helps Strike (`1→5` by L40).

### Healing

Blood Mend advertises +15% CHC for 2 turns; `resolvePlayerCast` heal branch heals only — **no buff**. Overworld Doka heal `ceil(hp/3)` Doka (30 HP = 10 Doka) vs potion 50 Doka for 30% max HP — shop heal is dominated out of battle. Jackpot heal costs **1 Doka**. Iron Curse halves healing; Titans Vigor is flat **+1000 HP**.

### Summons

Player summons: AP deducted; **no alive-cap**. Enemy summons capped at 2, cooldown 2 turns. Summoner chance = `0.12 + playerLevel×0.02` (named “per level zone” but uses **player level**) → 14% at L1, **100% at L44+**. Summon UI upgrade cost 10× canister debit. Lifespan `4 + floor(level/2)`.

### Crowd control

Player `debuffStat` (Frost −1 MP, Drain −20% SP, Slow, Weaken, …) is **not applied** after the damage loop. Enemy AI **does** apply `debuffStat`. #528 / #555 still queued. Swap/Mark/Barrier/Mirror work as special branches.

### XP curve

Doubling per level with fight XP ~linear in enemy level. Early trivial, mid steep, late impossible. Portal +10 XP is ~1% of a live fight. Recap bar uses `recapXpAfterGrant` — **RESOLVED**.

### Doka

Client lottery: comments say `0.0001%`; `roll < 0.0001` is **0.01%**. Unclamped jackpot EV ~`level×5e8`; persist clamped to 100 000. Persist EV ~`level×6.88+10` per kill. Doka boost never applies (`boostMode` stuck XP). Admin grant cap 10 000 000 bypasses applyRewards 100 000.

### Spell-upgrade costs

Canister: `10 × 2^currentLevel` (L0=10 … L10=10 240). Admin `spellLevelingCostMultiplier` (2.0) and `spellDmgGrowthPercent` (3) **unused**. Live dmg uses hardcoded `1.03^upgrade`. AP field: Motoko `apMpLevelThreshold` vs frontend `apMpGrowthEveryNLevels`.

### Shops

Player IAP is GameKey at **100 Doka/€**. Seed `shopPackages` / `initiatePurchase` always `#err`. Buff potions 50–150 Doka; battle elixir +3 AP vs base 8. Rename 100 Doka. Overworld heal dominates potions.

### Death

20% leftover XP, **40% of all Doka**. At L1 after ~10 fights (~2540 persist Doka) a death drops ~1 016 Doka — several fights of EV. Respawn HP 50% of linear max. Unpaid pending in `localStorage`.

### Dungeon multipliers

FE Doka: `[1, 1.5, 2, 2.5, 3, 4][depth]`. Live persist passes `PREAPPLIED_REWARD_MULTIPLIER=1` so **XP is not chain-multiplied**. Complete bonus `maxDepth×50`. Depth-5 extras +5 enemies and +30 levels.

### Boss Rush

Room table Doka/XP (500–… / 200–…) **unpaid**. Persist: `max(5, floor(L×1.5))` Doka/kill + kill XP. `completeBossRushRoom` ignores client reward args. Guide `getBossEffectiveStats` (±8%/level) is UI-only.

### Challenges

Easy: 50–75 Doka, 0 XP. Hard: 150–200 Doka + 400–500 XP. Legendary: 400–500 Doka + 800–1000 XP. At L1 a hard XP grant is ~half a fight; at L15 legendary XP is less than one fight. `hard_3` (≤8 AP/turn) is **free** until L25 (base AP 8). Early spawn Crush/Sacrifice make under-30-damage / Untouchable harsh vs uptier packs.

### Achievements

One-shot Doka 50–1000 (`admin.mo` defaults). `doka_1000` / `doka_10000` / `level_10` wait until `applyRewards` commits. Pacifist 500 Doka is large vs persist EV.

---

## Dominant strategies / walls (this HEAD)

1. **Frost (and crit) + Sacrifice** beat the starter bar; Chain is single-target dominated; Poison ignores upgrades.
2. **Timestep** is a free extra turn.
3. **Spawn uptier** makes L1 a mid-tier fight; L8–10 sit in the same spawn band (difficulty collapse then XP wall).
4. **Doka lottery** (clamped) still dwarfs shops; GameKey 100/€ is the paid path.
5. **40% Doka death** taxes the lottery, not leftover XP.
6. **Exponential XP** vs linear fight XP = late-game freeze.
7. **Player CC extras dead** → advertised control kit is damage-only.
8. **Player summon no cap** vs enemy cap 2.
9. **BoostToggle unmounted + dual store** → always 1.5× XP, never 1.5× Doka.

---

## Recommendations (ranges, not applied)

Do **not** ship these from this PR. Human approval required.

| ID | Recommended range | Expected effect | Risk | Confidence |
| :--- | :--- | :--- | :--- | :--- |
| BAL-TIER-FLOOR-UPBIAS | Same-tier 70–80%; leftover 3–5% actually using `threeOrMorePercent`; floor enemy L at `max(1, player−2)` | L1 mean ~3–6 | Early too easy | HIGH |
| BAL-XP-EXPONENTIAL-WALL | Piecewise: 100×1.15^(N−1) or 100×N^2 after L10 | L15 fights/level ~15–40 | Economy retune | HIGH |
| BAL-DOKA-LOTTERY-BILLION | Jackpot `1e4–5e4`; comment=code; or server-side roll | Shop/IAP meaningful | Feels stingy | HIGH |
| BAL-PLAYER-DMG-DOUBLE-PASS | Scale **once**; crit **once** | Crit 2× not 4× | DPS drop | HIGH |
| BAL-DMG-NO-LEVEL-SCALE | `base × 1.03^upgrade × (1+0.02×(L−1))` or similar | Player keeps up with eHP | Overkill | HIGH |
| BAL-SACRIFICE-PERCENT-HP | Flat 15–25 or 20% of **missing** not current | No L1 60-dmg nuke | Sac feels weak | HIGH |
| BAL-BOOST-LOCKED-XP-150 | Single boostMode; mount toggle; default 1.0× | Honest 1.5× as a choice | −33% XP if default off | HIGH |
| BAL-AI-TIER-VARIANCE-30 | Variance ±1 only, or 5% not 30% | No L1 betrayal/erratic | Less chaos | MEDIUM |

Full ACTION blocks: [`ACTION_IDS_BAL_2026-09-27.md`](./ACTION_IDS_BAL_2026-09-27.md).

---

## Explicit non-actions

- No XP / Doka / spawn / spell / shop / death / AP number edits.
- No auto-implement of recommended ranges.
- `BAL-RECAP-XP-BAR-WRONG` remains RESOLVED.
- `BAL-IAP-VALUE-DOMINANCE` remains SUPERSEDED (GameKey 100 Doka/€).

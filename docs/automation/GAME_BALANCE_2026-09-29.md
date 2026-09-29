# Quantitative game-balance analysis — 2026-09-29

**Analyst:** Stralt quantitative game-balance (cron `0 */48 * * *`)
**This run:** 2026-09-29 00:02 UTC
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — unchanged since 2026-09-21)
**Prior reports:** [`GAME_BALANCE_2026-09-28.md`](https://github.com/Mr-Melic/stralt/pull/736) (#736), #675 (09-27), #640 (09-26), #582 (09-25), #505 (09-24), #472 (09-23)
**Gameplay / balance numbers:** **not modified.** Report-only.

No live telemetry collectors exist at this HEAD (same as TBC WAITING_FOR_TELEMETRY). Findings are **formula + Monte Carlo**, not observed win rates.

**Queued (not in HEAD):** #386 victory HP floor cap; #528 / #555 player `debuffStat` after damage; #692 Blood Mend CHC buff on self-heal.

---

## Method

- Re-read live formulas in `src/frontend` + `src/backend/main.mo`.
- Monte Carlo: 8 000 packs × 3 enemies, mulberry32 seed **20260929**, `pickEnemyLevelFromTiers` with default admin weights (60 / 20 / 10 leftover-10, `tierSize` 10, ±1 variance 15% each side).
- Victory XP uses the **live** path: `sum(level×20)×1.5` because WorldExploration `boostMode` is stuck at `"xp"`.
- Persist Doka EV uses the **analytic** clamped lottery (`level×6.877 + 10` per kill, jackpot band persist 100 000). Direct MC of the 0.01% jackpot is too noisy at 8k packs.
- Ability table: advertised `calcScaledDamage` vs live `resolvePlayerCast` → `calculatePlayerDamage` (upgrade scale **and** crit applied twice). Create SP **8** applies on the second pass for non-physical hits. Target RES/SR = 0.
- Pack-size pass: overworld `rollOverworldEnemyCount` is 1..8 (mean **4.52**); colliding with **one** enemy still pulls **all** map enemies into the fight.
- Challenge offer: battle init indexes `DEFAULT_CHALLENGES` uniformly (9 rows). Shrine: 25% of dungeon-chain maps credit a flat **300** Doka.

---

## Scenario snapshot (live spawn, 3-enemy pack)

XP/fight includes locked 1.5×. Analytic persist Doka EV ≈ `3 × (meanLevel × 6.877 + 10)`.

Mean overworld pack (4.52) is ~**1.51×** these XP/Doka columns. Depth-5 dungeon extras add +5 enemies on top.

| Band | Player L | Mean enemy L | p(eL > L) | XP/fight live | Fights/level | Mean eHP | Sac (full) | p(sac OS) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 10.85 | 0.928 | 976 | 0.10 | 74 | 60 | 0.36 | 254 | no |
| Mid | 8 | 10.83 | 0.429 | 975 | 13.1 | 74 | 81 | 0.76 | 253 | no |
| Mid | 10 | 11.07 | 0.290 | 996 | 51.4 | 75 | 87 | 0.81 | 258 | **yes** |
| Late | 15 | 17.86 | 0.503 | 1608 | 1019 | 92 | 102 | 0.76 | 399 | yes |
| Stress | 25 | 26.83 | 0.499 | 2415 | 6.95e5 | 114 | 132 | 0.79 | 584 | yes |
| Stress | 50 | 46.04 | 0.277 | 4144 | 1.36e13 | 162 | 207 | 0.91 | 980 | yes |

HUD max HP = `floor(100×(1+(L−1)×0.05))`. Combat AP/MP = 8/4 until L25. Sac = `floor(maxHP×0.2)×3`. Enemy HP = `floor(50×(1+(eL−1)×0.05))`.

L1 AI-tier (same seed): p(erratic-eligible)=**0.177**, p(betrayal-eligible)=**0.029**. Max spawn 80. Mean pack **4.517**.

---

## 2026-09-29 vs 2026-09-28

- **HEAD unchanged** (`0f5363f`). All prior `BAL-*` formulas re-read; none flipped. Recap still uses `recapXpAfterGrant`.
- Spawn MC (new seed): L1 mean **10.85** (was 10.91), p(level above player) **0.928** (was 0.931). Same up-bias class.
- New P1: `BAL-CHALLENGE-UNIFORM-OFFER` — every fight rolls 1 of 9 challenges with **no tier weight** (33% legendary). Opt-in; a completed L1 legendary is ~1× a boosted 3-pack and 8–10× the L1→2 threshold. Always-accept extra-XP EV ≈ **+450** (+46% on 976). Distinct from `BAL-CHALLENGE-XP-EARLY-BREAK` (magnitudes vs **offer rate**).
- New P2: `BAL-SHRINE-300-DUNGEON` — 25% of dungeon-chain maps; altar pays **300** Doka (one-shot). ~1.18× a persist 3-pack at L1 (254); overworld never rolls shrines. EV/dungeon map = 75 plus any fight.
- Yesterday’s `BAL-IDLE-HP-REGEN-FREE` / `BAL-PACK-SIZE-REWARD-SWING` / `BAL-MODIFIER-GRAVITY-FOG-DEAD` remain OPEN (no longer NEW).
- Ability table this run includes create **SP 8** on the second damage pass (Frost live non-crit **21**, crit **86**; 09-28 quoted 20/80 ignoring SP).
- #386 / #528 / #555 / #692 still not in HEAD.

---

## Domain findings (compact)

### Player progression

XP curve `100 × 2^(N−1)` (`xpCurve.ts`, `main.mo` `applyRewards`). L1→2 is **one** boosted 3-pack (~976 XP vs 100 need) — **trivial**. A mean 4.5-pack is ~1.47k XP. L15→16 needs 1.64e6 XP ≈ **1019** 3-pack fights. L25 is a hard wall (~7e5 fights). Player combat ATK/RES/INIT persist but **spell damage ignores caster level** (`calcScaledDamage` discards `_casterLevel`). Create **SP 8** is a flat +8% on the second pass and never grows. Battle AP/MP stay 8/4 until `floor(L/25)`. HUD HP is linear 5%/level; `getPlayerBaseStats` HP is `100×1.05^(L−1)` (L25: 220 vs 323). Create payload AP 10 / MP 5 vs battle 8/4.

Idle regen + overworld Doka heal (`ceil(missing/3)` Doka) make between-fight attrition free (`BAL-IDLE-HP-REGEN-FREE`).

### Enemy scaling

Same-tier 60% + leftover **10%** (admin `threeOrMorePercent=5` unused) + 15% ±1 variance. L1–10 share one tier → L1 mean ~11, **93% of spawns above the player**. Dungeon adds `DUNGEON_TIER_BOOST[depth]×10` levels and extras `[0,2,3,4,4,5]`. Piece multipliers affect SP/SR/INIT/RES/CHC only; battle HP is `calcEnemyMaxHp(level)` so family `hpMult` is discarded. ~30% family variants **overwrite** RES with 0.05–0.75 (then treated as percent → ~0% mitigation). Backend `getEnemyHPForLevel` (tier 30+20) is unused by combat.

### Damage

Live player hits: `calcScaledDamageInline` then WX `computeDamage` scales **again** and multiplies the **same** crit flag **again**. Upgrade 0 crit = **4× advertised**. Create SP 8 then +8% on the second pass (Frost crit 86 vs 80 without SP). Upgrade 5 Frost: advertised 23; live non-crit ~26; live crit ~106 before SP. Enemy fallback Crush = `12 × max(1, level/5) × enrage` vs kit Strike 10 — at mean L11 Crush ≈ 26 (2.6× kit). Enemy RES/SR grow with level; rook RES can hit 100 at L78 (full immunity). No cap. Hazards: lava 8–15 + Burning 3×3, spikes 5–10, **bypass RES**. Titans Vigor then multiplies that damage by 1–5. Blood Moon ×1.25 stacks on the already doubled-pass number.

### AP efficiency (upgrade 0, RES=0, create SP 8)

| Spell | AP | Live non-crit | Live crit | dmg/AP | Dominated by |
| :--- | ---: | ---: | ---: | ---: | :--- |
| Strike | 2 | 10 | 40 | 5.0 | Frost on a single target unless SR≫RES (physical skips SP) |
| Frost Bolt | 3 | 21 | 86 | 7.0 | — (MP −1 never applied on bar) |
| Chain Lightning | 4 | 21 | 86 | 5.25 | Frost unless ≥2 extra bounces hit |
| Poison Arrow | 2 | 12 over 3t | 12 | 6.0 | Frost (DoT ignores upgrades and SP) |
| Blood Mend | 3 | 12 heal | 24 | 4.0 HP/AP | Overworld Doka heal (`ceil(hp/3)` Doka) + idle regen |
| Life Drain | 3 | ~10 + 5 | ~40 + 5 | 3.3 | Frost; SP debuff dead |
| Sacrifice | 3 | 60 at L1 | — | 20 | Oneshots 36% of L1 spawns from full HP |
| Timestep | 0 | full AP/MP | — | ∞ | Entire resource economy (once/battle) |

Starter `mpCost` is 0 on the bar (`BAL-MP-UNUSED-ON-STARTERS`). `maxSpellRange=5`: Frost already 4, so range growth almost only helps Strike (`1→5` by L40). Default auto-bar is `ownedSpells.slice(0,8)` (Strike…Frost+Swap) — Timestep and Sacrifice are owned (`BAL-STARTER-KIT-NO-GATING`) but not on the first bar.

### Healing

Blood Mend advertises +15% CHC for 2 turns; `resolvePlayerCast` heal branch heals only then **returns** — **no buff** (`spellEngine.ts` 654–672). Queued #692. Overworld Doka heal `ceil(hp/3)` Doka (99 missing HP ≈ 33 Doka) vs potion 50 Doka for 30% max HP — shop heal is dominated out of battle. Jackpot heal costs **1 Doka**. Idle +1 HP/10s. Iron Curse halves healing; Titans Vigor is flat **+1000 HP** plus 1–5× damage.

### Summons

Player summons: AP deducted; **no alive-cap**. Enemy summons capped at 2, cooldown 2 turns. Summoner chance = `0.12 + playerLevel×0.02` rolled **independently per enemy** (comment says pack / levelZone) → L1 14% each, 3-pack P(≥1)=36%, mean 4.52-pack **~49%**, 8-pack **70%**; **100% of enemies** at L44+. Summon UI upgrade cost 10× canister debit. Lifespan `4 + floor(level/2)`.

### Crowd control

Player `debuffStat` (Frost −1 MP, Drain −20% SP, Slow, Weaken, …) is **not applied** after the damage loop. Enemy AI **does** apply `debuffStat`. #528 / #555 still queued. Swap/Mark/Barrier/Mirror work as special branches.

### XP curve

Doubling per level with fight XP ~linear in enemy level. Early trivial, mid steep, late impossible. Portal +10 XP is ~1% of a live 3-pack fight. Recap bar uses `recapXpAfterGrant` — **RESOLVED**.

### Doka

Client lottery: comments say `0.0001%`; `roll < 0.0001` is **0.01%**. Unclamped jackpot EV ~`level×5e8`; persist clamped to 100 000. Persist EV ~`level×6.88+10` per kill. Doka boost never applies (`boostMode` stuck XP). Doka Fever ×2 then clamp. Admin grant cap 10 000 000 bypasses applyRewards 100 000. Ground loot: 40% of maps, `ceil(n/3)` piles, value `(5 + avgLevel×2)×(0.8..1.2)` → L1 EV ~**21** Doka/map (~8% of a persist 3-pack). Shrine (dungeon only) is a much larger no-combat credit (see NEW ID).

### Spell-upgrade costs

Canister: `10 × 2^currentLevel` (L0=10 … L10=10 240). Admin `spellLevelingCostMultiplier` (2.0) and `spellDmgGrowthPercent` (3) **unused**. Live dmg uses hardcoded `1.03^upgrade`. AP field: Motoko `apMpLevelThreshold` vs frontend `apMpGrowthEveryNLevels`.

### Shops

Player IAP is GameKey at **100 Doka/€**. Seed `shopPackages` / `initiatePurchase` always `#err`. Buff potions 50–150 Doka; battle elixir +3 AP vs base 8. Rename 100 Doka. Overworld heal dominates potions. Idle regen dominates both for non-urgent HP.

### Death

20% leftover XP, **40% of all Doka**. At L1 after ~10 mean-pack fights (~3800 persist Doka) a death drops ~1 520 Doka. Respawn HP 50% of linear max, then idle regen fills. Unpaid pending in `localStorage`.

### Dungeon multipliers

FE Doka: `[1, 1.5, 2, 2.5, 3, 4][depth]`. Backend `updateDungeonProgress` stores `1 + 0.25×depth` (depth 5 → 2.25, not 4). Live persist passes `PREAPPLIED_REWARD_MULTIPLIER=1` so **XP is not chain-multiplied**. Complete bonus `maxDepth×50`. Depth-5 extras +5 enemies and +30 levels. Shrine 25% / 300 Doka is dungeon-only.

### Boss Rush

Room table Doka/XP (500–5000 / 200–1200) **unpaid**. Persist: `max(5, floor(L×1.5))` Doka/kill + kill XP. `completeBossRushRoom` ignores client reward args. Guide `getBossEffectiveStats` (±8%/level) is UI-only.

### Challenges

Easy: 50–75 Doka, 0 XP. Hard: 150–200 Doka + 400–500 XP. Legendary: 400–500 Doka + 800–1000 XP. **Offer is uniform across 9 rows** (NEW). At L1 a hard XP grant is ~half a 3-pack fight; at L15 legendary XP is less than one fight. `hard_3` (≤8 AP/turn) is **free** until L25 (base AP 8). Early spawn Crush/Sacrifice make under-30-damage / Untouchable harsh vs uptier packs.

### Achievements

One-shot Doka 50–1000 (`admin.mo` defaults). `doka_1000` / `doka_10000` / `level_10` wait until `applyRewards` commits. Pacifist 500 Doka is large vs persist EV and needs a heal/buff-only win (betrayal / suicide). `spell_master_8` is reachable immediately because all `starterSpells` are innate (first-8 auto-bar).

### Map modifiers (this run)

Live: slime/frozen MP×2, thorns, void rift 3/tick, arcane surge AP−1, plague 1/tick, paper windstorm, blood moon ×1.25, mirror field 20% reflect, titans +1000 HP and dmg ×1–5, glass ×2, mending 5% max/turn, swift +2 MP, iron curse, vampiric 15%, null field, chaos shuffle, doka fever HP+25% and Doka×2. Time Warp is a timer flag in WX. Blood Moon also plants spike hazards. **Dead:** gravity_well, fog_of_war.

---

## Dominant strategies / walls (this HEAD)

1. **Frost (and crit) + Sacrifice** beat the starter bar; Chain is single-target dominated; Poison ignores upgrades. Default first-8 bar already includes Frost.
2. **Timestep** is a free extra turn (owned, not on the auto-bar).
3. **Spawn uptier** makes L1 a mid-tier fight; L8–10 sit in the same spawn band (difficulty collapse then XP wall).
4. **Whole-map packs** (1–8, mean 4.5) swing XP/Doka 8×; analysis 3-packs understate the mean.
5. **Uniform legendary offers** let an opt-in player add ~one extra fight of XP on 33% of battles at L1.
6. **Doka lottery** (clamped) still dwarfs shops; shrine 300 and GameKey 100/€ sit beside it.
7. **40% Doka death** taxes the lottery, not leftover XP. Idle regen taxes death HP in minutes.
8. **Exponential XP** vs linear fight XP = late-game freeze.
9. **Player CC extras dead** → advertised control kit is damage-only.
10. **BoostToggle unmounted + dual store** → always 1.5× XP, never 1.5× Doka.

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
| BAL-CHALLENGE-UNIFORM-OFFER | Weights 60/30/10 easy/hard/legendary, or XP = 10–25% of fight | Legendary not an L1 skip | Less challenge chase | HIGH |
| BAL-SHRINE-300-DUNGEON | 40–80 Doka at depth 1, scaling to 150–250 at depth 5 | Shrine ≠ a free fight | Dungeon feels poorer | HIGH |
| BAL-PACK-SIZE-REWARD-SWING | Fight the collided group (Chebyshev ≤2) or roll 2–4 | XP/Doka less lottery | Smaller maps feel empty | HIGH |
| BAL-IDLE-HP-REGEN-FREE | Battle-only regen, or 1/60s, or shrine-only | Healing items / Doka heal matter | Between-fight downtime | HIGH |

Full ACTION blocks: [`ACTION_IDS_BAL_2026-09-29.md`](./ACTION_IDS_BAL_2026-09-29.md).

---

## Explicit non-actions

- No XP / Doka / spawn / spell / shop / death / AP number edits.
- No auto-implement of recommended ranges.
- `BAL-RECAP-XP-BAR-WRONG` remains RESOLVED.
- `BAL-IAP-VALUE-DOMINANCE` remains SUPERSEDED (GameKey 100 Doka/€).
- Did not mint a portal-XP ID (still ~1% of a fight; narrative only).
- Did not mint a ground-Doka ID (L1 EV ~21/map; flavor vs fight persist).
- Did not mint a Titans damage twin (`BAL-TITAN-VIGOR-FLAT-1000` still covers ×1–5).

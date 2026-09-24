# Stralt quantitative game-balance analysis — 2026-09-24

**Role:** quantitative game-balance analyst (cron `0 */48 * * *`).  
**HEAD:** `0f5363f` (`Merge pull request #332`). Unchanged since 2026-09-21.  
**Telemetry:** none. Synthetic only (Monte Carlo 8k spawn rolls; live formulas).  
**This run does not change balance numbers.** Combat, XP, spawn, shop, and Doka constants were not edited.

Prior passes: 2026-09-23 / 09-22 / 09-21 at `0f5363f`; 2026-09-02 at `58302bc`; 2026-09-01 at `dd275aa`.  
Open sibling: PR #472 (`GAME_BALANCE_2026-09-23.md`). This file is a new dated report; it does not overwrite that PR.

Durable IDs stay `BAL-*`. Ledger: [`ACTION_IDS_BAL_2026-09-24.md`](./ACTION_IDS_BAL_2026-09-24.md).

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula |
| :--- | :--- |
| XP N→N+1 | `100 * 2^(N-1)` — `xpCurve.ts`; `main.mo` `applyRewards` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` `computeVictoryExp` |
| Portal XP | 10 (`PORTAL_TRANSITION_XP`) |
| `applyRewards` ceilings | Doka 100_000 / XP 500_000 |
| Spawn level | `pickEnemyLevelFromTiers` tierSize=10, 60/20/10/10 plus ±1 variance 15% |
| Player max HP (HUD) | `floor(100 * (1 + (L-1)*0.05))` — `WorldExploration.tsx` 3400–3406 |
| Player battle AP/MP | `8 + floor(L/25)` / `4 + floor(L/25)` |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` — overwrites spawn HP |
| Spawn HP / placeholder melee | `L*8+20` / `L*2+3` — unused once battle kits fire |
| Spell scale (function) | `floor(base * 1.03^upgrade)`; **caster level unused** |
| **Live player hit (this run)** | that scale **twice**, plus crit **twice** — see `BAL-PLAYER-DMG-DOUBLE-PASS` |
| Spell fail | 20% − 0.1%/level; physical exempt |
| Victory Doka | per-enemy lottery × `enemy.level`; persist clamped |
| Death | 20% leftover XP, 40% all Doka |
| Spell upgrade | `10 * 2^currentLevel`; summon UI advertises 10× |
| Dungeon Doka FE | `[1, 1.5, 2, 2.5, 3, 4][depth]` |
| Dungeon XP persist | not chain-multiplied (`PREAPPLIED_REWARD_MULTIPLIER=1`) |
| Dungeon BE store | `1 + depth*0.25` — not the live payout |
| Boss Rush persist | `max(5, floor(L*1.5))` Doka/kill + kill XP; room table unpaid |
| Challenges | easy 50–75 Doka / 0 XP; hard 150–200 Doka + 400–500 XP; legendary 400–500 Doka + 800–1000 XP |

Normalized metrics:

- **DPA** = payload / AP at upgrade 0, no crit (advertised).
- **Live DPA** = damage that actually writes HP after the double pass (same inputs).
- **E[DPA]** = DPA × (1 − failChance); Strike failChance = 0; L1 failChance = 20%.
- **HPA** = heal / AP.
- **DoT-DPA** = (tick × duration) / AP, delayed.

Monte Carlo: 8000 rolls, default tier config, no `localStorage` override.

---

## Ledger this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| **BAL-PLAYER-DMG-DOUBLE-PASS** | P0 | **NEW** |
| BAL-ENEMY-TIER-OUTLIER | P0 | OPEN |
| BAL-TIER-FLOOR-UPBIAS | P0 | OPEN |
| BAL-ENEMY-KIT-ZONE-OBJECT | P0 | OPEN |
| BAL-PLAYER-COMBAT-STATS-FLAT | P1 | OPEN |
| BAL-SPELL-FAIL-FLOOR | P1 | OPEN |
| BAL-TIMESTEP-FREE-TURN | P1 | OPEN |
| BAL-SACRIFICE-PERCENT-HP | P1 | OPEN |
| BAL-CHALLENGE-XP-EARLY-BREAK | P1 | OPEN |
| BAL-IAP-VALUE-DOMINANCE | P1 | SUPERSEDED |
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
| BAL-BOSS-GUIDE-VS-COMBAT | P2 | OPEN (was NEW 09-23) |
| BAL-RANGE-CAP-FAVORS-STRIKE | P2 | OPEN (was NEW 09-23) |
| BAL-PLAYER-CC-DEAD-ON-BAR | P1 | OPEN (was NEW 09-23) |
| BAL-PLAYER-SUMMON-NO-CAP | P1 | OPEN (was NEW 09-23) |
| **BAL-FALLBACK-CRUSH-OUTSCALES-KIT** | P1 | **NEW** |
| **BAL-HAZARD-FLAT-DAMAGE** | P2 | **NEW** |

---

## What moved since 2026-09-23

Formulas and HEAD did not move. This pass traced the **player damage write**, not only `calcScaledDamage`.

1. **Player hits scale and crit twice.** `resolvePlayerCast` (`spellEngine.ts` 882–892) computes `rawDmg = calcScaledDamageInline(base)` then `preCritDmg = isCrit ? rawDmg * 2 : rawDmg`. `applyDamageToEnemy` (`castHelpers.ts` 321–330) then calls `calculatePlayerDamage(preCritDmgBM, …, isCrit)` which runs `computeDamage` (`WorldExploration.tsx` 3308–3339): `calcScaledDamage` **again** and `if (isCrit) dmg *= 2` **again**. At upgrade 0 a crit is **4×** advertised, not 2×. At spell level 10, `1.03^10` is applied twice (`1.34² ≈ 1.81` vs intended 1.34). Mark ×2 is applied on the first `calculatePlayerDamage` (death check) then **deleted**, so the HP write often misses Mark. New ID `BAL-PLAYER-DMG-DOUBLE-PASS`.
2. **Fallback Crush outscales kit Strike.** When the AI melee/fallback path fires (`WorldExploration.tsx` 16710–16721), damage is `12 * max(1, enemy.level/5) * enrage`. Kit `physical_attack` stays 10 forever (`calcScaledDamage` ignores caster level). At enemy L10 Crush = 24; at L25 Crush = 60 vs Strike 10. Missing the kit is stronger than landing it. New ID `BAL-FALLBACK-CRUSH-OUTSCALES-KIT`.
3. **Hazards are flat and bypass RES.** Lava 8–15 plus Burning 3×3 (`WorldExploration.tsx` 11429–11452); spikes 5–10 (11469). Writes `setCharacterStats` directly, not `playerTakesDamage`. Share of max HP falls as the linear HP curve grows. New ID `BAL-HAZARD-FLAT-DAMAGE`.

Re-verified unchanged:

- `buildEnemyKit(piece, currentMap.levelZone)` still passes a `{name,minLevel,maxLevel}` object (`WorldExploration.tsx` 11920) → zone-0 kits (`BAL-ENEMY-KIT-ZONE-OBJECT`).
- `resolvePlayerCast` still never writes `debuffStat` (`BAL-PLAYER-CC-DEAD-ON-BAR`).
- Summon AP **is** deducted now (`castResultSpendsAp("summon") === true`). The 09-23 “free AP” comment in `spellEngine.ts` 817 is stale; the live hole is still **no alive-cap** (`BAL-PLAYER-SUMMON-NO-CAP`).
- Recap still uses `recapXpAfterGrant` (`BAL-RECAP-XP-BAR-WRONG` RESOLVED).
- Player GameKey remains 100 Doka/€ (`BAL-IAP-VALUE-DOMINANCE` SUPERSEDED). Admin grant cap 10_000_000 still bypasses `applyRewards` 100_000.
- PR #386 (victory HP floor cap) still not in HEAD.

---

## Scenario snapshot (live spawn, 8k rolls, typical 3-pack)

| Band | Player L | Mean enemy L | p(enemy>player) | XP/fight (3) | Fights/level | Combat mean eHP | Sac (full) | p(sac oneshot) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 11.01 | 0.934 | 660 | 0.15 | 75 | 60 | 0.35 | 257 | no |
| Mid | 8 | 11.02 | 0.437 | 660 | 19.4 | 75 | 81 | 0.76 | 257 | no |
| Mid | 10 | 11.00 | 0.286 | 660 | 77.6 | 75 | 87 | 0.82 | 257 | **yes** |
| Late | 15 | 17.83 | 0.497 | 1080 | 1517 | 92 | 102 | 0.76 | 398 | yes |
| Stress | 25 | 26.71 | 0.498 | 1620 | 1.04e6 | 114 | 132 | 0.79 | 581 | yes |

L1 histogram: 70% in 1–10, 18% 11–20, 6% 21–30, ~6% 31+. Max 80.

Same-level 4-pack (lower bound, not live spawn): L1 80 XP / 1.25 fights; L10 800 XP / 64 fights; L15 1200 XP / 1365 fights.

Cumulative leftover-scale 1→15 = 1,638,300. HUD `xpForNextLevel` saturates at L48. Persist still uses bigint.

Challenge at L1 if completed: `hard_1` +500 XP → L3 leftover 200; `legendary_1` +1000 XP → L4 leftover 300.

Persist Doka EV per enemy ≈ `enemy.level * 6.88 + 10` (the +10 is `0.0001 * 100_000` from the clamped jackpot). Median ≈ `2 * enemy.level` (90.5% band is 1–3).

---

## Normalized ability comparison (starter catalog, L1, upgrade 0)

Fail-adjusted E[DPA] uses 20% fizzle. Physical Strike is exempt. **Live extra** = what `resolvePlayerCast` actually writes. Crit column is **live HP write** vs advertised 2×.

| Spell | AP | Payload | DPA / HPA | E[DPA] L1 | Live extra | Live crit vs advertised | Verdict |
| :--- | ---: | :--- | ---: | ---: | :--- | :--- | :--- |
| Strike | 2 | 10 dmg, range 1 | 5.0 | **5.0** | none | ~4× vs 2× | Fail-proof filler; range grows to 5 |
| Frost Bolt | 3 | 20 dmg, range 4 | 6.67 | 5.33 | MP−1 **not applied** | ~4× | Best ST nuke if you accept fizzle |
| Cursed Wound | 3 | 22 dmg | 7.33 | 5.87 | healRecv **not applied** | ~4× | Highest raw DPA; extra dead |
| Shadow Veil | 3 | 18 dmg | 6.00 | 4.80 | RES/SP **not applied** | ~4× | Dominated by Cursed Wound |
| Expose | 3 | 15 dmg | 5.00 | 4.00 | RES/SP **not applied** | ~4× | Dominated |
| Chain Lightning | 4 | 20 × up to 3 | 5–15 | 4–12 | — | ~4× | Dominant in 3+ packs |
| Frost Nova | 4 | 15 AoE r2 | ~11 if 3 | ~9 | MP−1 **not applied** | ~4× | Strong clustered |
| Lifesteal Nova | 5 | 20 AoE + 50% drain | ~12 if 3 | ~10 | drain heal live | ~4× | Strong clustered sustain |
| Poison Arrow | 2 | 4×3 DoT | 6.0 delayed | 4.80 | stacks, no CD | DoT ignores crit | Dominates Venom |
| Venom Strike | 3 | 4×3 DoT, range 2 | 4.0 delayed | 3.20 | stacks | — | **Strictly dominated** |
| Inferno | 5 | 8×3 DoT, CD 3 | 4.8 delayed | 3.84 | — | — | Dominated as a nuke |
| Weaken | 3 | advertised −30% dmg | 0.33 live | 0.26 | **1 dmg, no debuff** | 4 dmg on crit | Dead spell |
| Sacrifice | 3 | `floor(HP×0.2)×3` | 20 at 100 HP | 16.0 | 20% self HP | n/a (separate path) | Oneshots same-level eHP |
| Blood Mend | 3 | 12 HP + CHC | 4.0 HPA | 3.20 | live (heal branch) | crit 2× heal | Dominated by Rally on HPA |
| Rallying Cry | 4 | 20 HP + CHC | 5.0 HPA | 4.00 | live | crit 2× heal | Better HPA |
| Life Drain | 3 | 10 dmg + 5 HP | 3.3 + 1.7 | — | SP shred **dead**; 50% of **live** dmg heals | crit inflates heal | Worse than Frost+Mend split |
| Shield | 2 | +30% RES 3t | — | — | live (buff path) | — | **Strictly dominates** Iron Skin |
| Iron Skin | 3 | +30% RES 3t | — | — | live | — | Dominated |
| Timestep | 0 | full AP+MP, 1×/battle | ∞ | ∞ | live, `no_ap` | — | Extra turn; dominant |
| Dire Wolf | 3 | hunter, lifespan 4 | board actor | 2.4 after fail | **no cap**; AP **is** charged | — | Dominant vs any 3-AP nuke |
| Mark | 2 | next hit ×2 | — | — | often **no HP write bonus** | — | Consumed on the pre-pass |

Spell-upgrade live vs intended (Frost Bolt, SP 8, typical L1 RES/SR, no crit / crit):

| Spell level | Intended | Live write | Intended crit | Live crit |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 20 | 20 | ~39 | ~80 |
| 5 | 22 | 26 | ~45 | ~106 |
| 10 | 26 | 34 | ~52 | ~138 |
| 20 | 35 | 65 | ~71 | ~261 |

Upgrade cost is still `10 * 2^n` (L0→1 = 10; L9→10 = 5120; cumulative to L10 = 10_230). Live write at L10 is already ~1.8× base from the squared scale **before** crit.

Healing vs wallet (overworld only):

| Source | Cost | HP | Doka per HP at L1 (max 100) |
| :--- | :--- | :--- | ---: |
| Overworld Doka→HP | 1 Doka : 3 HP | missing | **0.33** |
| Jackpot heal | 1 Doka | full bar | 0.01 |
| Health Potion | 50 Doka | 30% (30 HP) | 1.67 (**5×** overworld) |
| Greater Potion | 120 Doka | 70% | 1.71 |
| Blood Mend | 3 AP, 0 Doka | 12 | AP, not Doka |
| Break-even potion vs 1:3 | 50 Doka | 150 HP needed | L81 (maxHP 500, 30% = 150) |

---

## Domain notes

### Player progression

Create writes AP 10 / MP 5 (`startingChampionStats.ts`). Battle init overwrites to 8 / 4. HUD HP is linear +5%/level; `getPlayerBaseStats` HP is compounding `100 × 1.05^(L−1)` and is **not** the HUD. Atk/res/init/chc/evasion persist but outgoing damage ignores ATK. SP 8 applies once, on the **second** pass.

AP +1 / 25 levels. Persist cap 20. L15 needs 1.6M cumulative leftover XP — the wall is XP, not AP.

All 32 `starterSpells` are forced `isBaseSpell: true`. There is no loadout economy.

### Enemy scaling

L1–10 share **tier 0**. Floor bias: at L1, down-tier clamps to 0. Mean enemy ≈ 11, 93% above the player, tail to 80. Combat HP at mean L11 ≈ 75 vs player 100.

Family 30% overwrites `res` to 0.05–0.75 (fraction). Combat uses `1 - res/100`, so 0.75 is **0.75%** reduction, not 75%. `hpMult` is applied to spawn HP then discarded by `calcEnemyMaxHp`.

Kits stay zone 0 (Strike / Frost). AI tier: 30% chance uniform 1–10 regardless of enemy level.

Backend `getEnemyHPForLevel` is unused by the live client.

**Kit vs fallback:** pawn/knight/rook kits deal Strike 10. If the AI takes the melee fallback, Crush scales with level. Enrage ×6 applies to both.

### Damage / AP efficiency

Character level still unused in `calcScaledDamage`. The new hole is the **double pass** on the player write. Enemy casts (`WorldExploration.tsx` 16464–16473) scale **once** and crit **once**. Player crits are twice as large as enemy crits of the same base.

Without Sacrifice / summons / Chain Lightning / the 4× crit, TTK still rises because enemy HP is linear and kit Strike is flat 10.

### Healing efficiency

Heal spells use the heal branch (single scale, crit 2× heal) — they do **not** go through the double damage pass. Drain heal is `0.5 * live finalDmg`, so a crit Life Drain heals ~2× the advertised 5 because the damage under it was 4×.

Overworld 1:3 dominates potions until ~L81. Jackpot heal is 1 Doka full HP (0.5% of Doka→HP clicks).

### Summons

`getSummonBaseStats` at spell level 0: Wolf 80 HP / 2 AP; Sentinel `120 * 1.5 = 180` HP; Wisp 42 HP. Lifespan 4 + floor(spellLevel/2). Player can place Wolf+Archer+Wisp in one 8-AP turn (AP **is** charged). Enemy summoner chance `0.12 + playerLevel * 0.02` is 100% at L44. Upgrade UI 10× vs canister 1×.

### Crowd control

On the **player bar**, CC is a description string. Frost Nova still deals 15 AoE. Slow/Weaken never land from `resolvePlayerCast`. Control mage is a dominated fantasy: the real levers are Sacrifice, Timestep, summons, Chain Lightning, and **crit 4×**.

### XP curve

Doubling per level vs linear-in-enemy-level income. Live uptier at L1 makes the first level free (660 XP vs 100 needed). L10 ≈ 78 three-packs. L15 ≈ 1.5k three-packs. Challenge XP is a larger grant than many early fights.

### Doka acquisition

Raw E[multiplier] ≈ **50,007**, of which **50,000** is the 0.01% jackpot band `uniform(1..1e9)`. Comments in `WorldExploration.tsx` 12388–12390 still say “0.0001%”; the predicate `roll < 0.0001` is **0.01%**. Non-jackpot E[mult] ≈ 6.88. Persist EV per enemy ≈ `level * 6.88 + 10`.

Shrine altar 300 (`WorldExploration.tsx` 11308). Ground coins: 40% map chance, `max(1, round((5 + avgEnemyLevel*2) * U(0.8,1.2)))`, count `ceil(enemies/3)`. Dungeon complete `maxDepth * 50`. Achievements 50–1000 once. All rounding error next to one clamped jackpot (100_000).

Admin `validateDokaGrant` 10_000_000 vs `applyRewards` 100_000.

### Spell-upgrade costs

`10, 20, 40, …` through `10 * 2^13 = 81_920`. Live double-scale makes paid levels stronger than the advertised +3%/level, so the exponential price is buying a squared curve.

### Shops

Player IAP is GameKey at 100 Doka/€. Seeded `ShopPackage` ladder is unused (`processPendingPurchases` no-op). BuffShop 50–150 Doka.

### Death penalties

20% leftover XP, 40% of **all** Doka. After a jackpot the death tax is the real sink. Respawn HP is 50% of linear max (L1 = 50).

### Dungeon multipliers

Live Doka ×1.5…4; live XP ×1. BE record stores ×1.25…2.25. Depth also adds `DUNGEON_TIER_BOOST * 10` enemy levels and `[0,2,3,4,4,5]` extra enemies. Titan’s Vigor is a flat +1000 HP on a ~75 HP mean L1 pack.

### Boss Rush

Advertised room table sums 21_000 Doka / 8_500 XP. Persist is kill XP plus `max(5, floor(L*1.5))` Doka per kill. Frontend boss HP 60–600, reward ×5 / ×3; backend 100–800, ×10–50 / ×8–40. Guide `1.08^Δ` is UI-only.

### Challenges

`hard_3` is `maxApUsedInTurn <= 8`. Player AP is 8 until L25, so the constraint is free. `hard_1` 500 XP at L1 is a five-threshold skip. Sacrifice self-hit counts toward Untouchable / under-30. Lava/spikes **do** increment challenge damage (they call `recordInBattleChallengeDamage`) even though they bypass RES.

### Achievements

Default feats pay 50–1000 Doka. Wallet feats wait for `applyRewards` commit. Feat Doka is trivial vs persist EV.

### Hazards

Lava 8–15 + Burning 3/turn × 3 (up to 24 raw) vs L1 100 HP (~24%) vs L25 220 HP (~11%). Spikes 5–10. Neither uses `playerTakesDamage`, so Shield Charm / RES do not apply. Difficulty **collapses** as HP grows; lava is a bigger share of `easy_3` / `hard_1` budgets at L1 than at L15.

---

## Dominant strategies / useless options / walls

**Dominant**

1. Sacrifice at high HP (oneshot same-level combat HP; ~35% of live L1 spawns, ~80% from L8).
2. Timestep extra turn (0 AP).
3. Fill the board with uncapped summons (3 AP each, now correctly charged).
4. Chain Lightning into 3+ packs.
5. **Land crits** — live 4×, not 2× (`BAL-PLAYER-DMG-DOUBLE-PASS`).
6. Poison Arrow stacked (2 AP, no CD) if the fight lasts 3 turns.
7. Accept `hard_1` / `legendary_*` at L1 for more XP than the curve wants to give.
8. Overworld Doka→HP instead of BuffShop potions.

**Useless / dominated**

- Venom Strike vs Poison Arrow.
- Iron Skin vs Shield.
- Shadow Veil / Expose vs Cursed Wound (extras do not apply from the player bar).
- Weaken / Slow from the player bar (1 dmg, no debuff).
- Mark as a damage setup (consumed before the HP write).
- Inferno as a 5-AP single-target blast (0 upfront).
- Kit Strike vs fallback Crush at mid/high enemy level.
- MP on every starter (`mpCost = 0`).
- Void Collapse (AP 12, minLevel 30, other catalog).
- ShopPackage euro ladder.
- Backend dungeon multiplier and `getEnemyHPForLevel`.

**Progression wall:** XP doubling from ~L10. Combat is not the wall; the leftover bar is.

**Trivial progression:** L1 (mean enemy 11, 660 XP vs 100 needed). Challenge XP can skip to L3–L4. Crit 4× plus Sacrifice collapses mid-fight TTK.

**Excessive grind:** L15+ without jackpot Doka and without challenge XP.

**Reward loop:** jackpot persist 100_000 / death 40% of wallet / upgradeSpell exponential. Median Doka is tiny; EV is the lottery.

**Difficulty spike:** L1 tail to enemy 80; Titan’s Vigor +1000 HP; zone-0 kits still, so spikes are HP/level not kit; fallback Crush on high-level enemies.

**Difficulty collapse:** Sacrifice, Timestep, summon board, challenge XP, crit 4×, flat hazards vs growing HP, kit Strike 10 vs growing player HP.

**Scaling anomaly:** player damage function ignores level, but live player write squares upgrades and doubles crits; enemy kit damage stays 10; fallback Crush *does* scale; XP exponential; Doka EV is a lottery.

**Mathematically dominated choices:** listed in the ability table. Also BuffShop 50 Doka for 30 HP vs 10 Doka overworld for the same 30 HP at L1.

---

## Recommendations (no numbers shipped this run)

Each row: current → evidence → problem → recommended range → expected effect → risk → confidence.

| ID | Current | Recommended range | Effect | Risk | Conf. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BAL-PLAYER-DMG-DOUBLE-PASS | scale+crit in resolver **and** in `computeDamage` | One scale, one crit; Mark consumed after the HP write | Crits 2×; upgrades +3%/level as advertised; Mark works | Lowers player burst | HIGH |
| BAL-DOKA-LOTTERY-BILLION | 0.01% × U(1,1e9) × level, persist cap 100k | Drop 1e9 band; max mult tens–low hundreds | Removes random millionaire | Jackpot flavor | HIGH |
| BAL-XP-EXPONENTIAL-WALL | 100×2^(N−1) vs 20×enemy.level | Slower after L8 (e.g. 100×1.35^(N−1) or piecewise) | L10–15 stays a climb | Early game currently free | HIGH |
| BAL-TIER-FLOOR-UPBIAS | L1–10 same tier; down-tier clamped | Separate tutorial band; L1 max ~player+3 | L1 is a fight | Too-easy if cap is tight | HIGH |
| BAL-ENEMY-KIT-ZONE-OBJECT | `levelZone` object → NaN → kit 0 | Pass `floor((L-1)/10)` | Late kits appear | Enemy difficulty up | HIGH |
| BAL-DMG-NO-LEVEL-SCALE | function ignores caster level | Small caster-level term **or** flatten enemy HP | TTK stable | Stacks with unfixed 4× crit | HIGH |
| BAL-FALLBACK-CRUSH-OUTSCALES-KIT | Crush `12*(L/5)` vs Strike 10 | Fallback = kit Strike, or scale Strike with level | Kit identity | Enemy TTK | HIGH |
| BAL-SACRIFICE-PERCENT-HP | 60% current HP as damage | 0.8–1.0× same-level eHP, or vs missing HP | Not a 3-AP win button | Flavor | HIGH |
| BAL-PLAYER-CC-DEAD-ON-BAR | Player debuffs never apply | Apply `debuffStat` on hit; floor AP/MP at 1 | Control mage exists | Stacking Frost+Slow | HIGH |
| BAL-PLAYER-SUMMON-NO-CAP | Unlimited 2–3 AP summons | Alive cap 2–3; 1–2 turn CD | Summons are a slot | Occupancy tests | HIGH |
| BAL-STARTER-KIT-NO-GATING | 32 innate spells | Gate 8–12 | Loadout choices | Discovery UX | MED |
| BAL-BOSS-RUSH-TABLE-UNPAID | 21k/8.5k advertised | Persist a fraction **or** stop showing it | Recap matches canister | XP wall | HIGH |
| BAL-CHALLENGE-XP-EARLY-BREAK | 500–1000 XP at L1 | 20–40% of current need | Optional spice | Feels stingy | HIGH |
| BAL-HARD3-AP8-FREE | ≤8 AP vs AP 8 | `<= max(3, floor(AP*0.6))` | Constraint exists | Challenge feel | MED |
| BAL-SPELL-FAIL-FLOOR | 20% until L201 | 5–10% at L1, 0 by L20–30 | Spells compete with Strike | Reliability | MED |
| BAL-RANGE-CAP-FAVORS-STRIKE | cap 5; Strike gains 4 tiles | Cap ≥ 6–8 or don’t grow Strike | Casters keep reach | Targeting tests | MED |
| BAL-HAZARD-FLAT-DAMAGE | lava 8–15, ignore RES | Scale with maxHP (8–12%) **and** `playerTakesDamage` | Hazards stay relevant; RES matters | Challenge under-30 | MED |
| BAL-BOSS-GUIDE-VS-COMBAT | Guide ×1.08^Δ, combat flat | Drive combat from helper **or** label | Guide stops lying | Boss HP retune | MED |
| BAL-HP-FORMULA-SPLIT | linear HUD vs 1.05^(L−1) | One HP curve | Admin/preview match HUD | Persist HP cap | MED |
| BAL-VICTORY-FLOOR-OVER-MAXHP | `50+10L` > maxHP from L10 | `min(floor, maxHp)` (PR #386) | No overheal after win | Recap heal | HIGH |
| BAL-DEATH-DOKA-40 | 40% all Doka | 10–20% **after** lottery retune | Death is a setback | Too soft | MED |
| BAL-SUMMON-UI-COST-10X | UI 10× canister | Show canister cost | No fake 100 Doka price | Copy only | HIGH |
| BAL-TITAN-VIGOR-FLAT-1000 | +1000 HP | `+0.5–1.0 × combat maxHP` | Modifier scales | Too weak/strong | MED |
| BAL-DUNGEON-MULT-FORMULA-SPLIT | FE table vs BE `1+0.25d` | One table | HUD = persist | Double-pay | HIGH |
| BAL-BUFF-SHOP-OVERWORLD-DOMINATED | 50 Doka / 30% vs 1:3 | Combat-only potions | Shop has a niche | Economy sink | MED |
| BAL-JACKPOT-HEAL-1-DOKA | 1 Doka full HP | Remove or 20–40% missing | Doka→HP stays the heal | Flavor | MED |
| BAL-AP-GROWTH-UNREACHABLE | cap 20 vs formula 21 at 325 | Defer until XP wall moves | Persist matches battle | Irrelevant now | LOW |
| BAL-CREATE-VITALS-MISMATCH | create 10/5 vs battle 8/4 | Create 8/4 | Forge matches first fight | Cosmetic | HIGH |
| BAL-GAMEKEY-MINT-UNBOUNDED | admin 10M vs applyRewards 100k | Documented exception or align | No silent 100× mint | Ops grants | MED |
| BAL-IAP-PACKAGES-ORPHANED | euro ladder seeded, no-op | Delete from player UI | No fake shop | None if delete | HIGH |
| BAL-TWO-SPELL-CATALOGS / VOID / BOSS-CATALOG | `admin.mo` vs `spellData.ts` | One catalog | Admin preview = combat | Content pass | MED |
| BAL-FAMILY-COMBAT-IDENTITY | hpMult/res overwritten | Apply family to combat **or** stop rolling | Families are not skins | Balance pass | MED |
| BAL-MP-UNUSED-ON-STARTERS | all `mpCost=0` | MP on 4–6 spells | MP is a resource | Timestep refunds MP | MED |
| BAL-TIMESTEP-FREE-TURN | 0 AP full reset | Cost 2–4 AP **or** restore half | Extra turn is a choice | Identity | MED |
| BAL-DOMINATED-SPELLS | Venom, Iron Skin, Expose, Weaken | Differentiate or retire | Every spell has a job | Feel | MED |
| BAL-ENEMY-TIER-OUTLIER | ±3..6 tiers; L1 max 80 | Soft cap by player level | No L80 pawn on map 1 | Dungeon boosts stay | HIGH |
| BAL-PLAYER-COMBAT-STATS-FLAT | ATK unused | Wire ATK **or** hide on forge | Stats mean something | Second formula | MED |
| BAL-SUMMONER-SATURATION | 100% at L44 | Asymptote 20–40%, use zone | Not every pack summons | Cap 2 already | MED |

Do **not** auto-implement numeric ranges. `BAL-PLAYER-DMG-DOUBLE-PASS` and `BAL-ENEMY-KIT-ZONE-OBJECT` / `BAL-PLAYER-CC-DEAD-ON-BAR` are wiring bugs (advertised behavior missing or doubled). They still need a human because they change burst / enemy power.

---

## ACTION blocks

ACTION_ID: BAL-PLAYER-DMG-DOUBLE-PASS
TITLE: Player damage scales and crits twice before HP write
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 882-892 and 990-998; castHelpers.ts applyDamageToEnemy 321-330; WorldExploration.tsx computeDamage 3308-3339
CURRENT_BEHAVIOUR: Resolver computes rawDmg = floor(base×1.03^upgrade), doubles on crit, then applyDamageToEnemy calls calculatePlayerDamage on that already-scaled/crit value with isCrit still true, which scales and crits again. Upgrade 0 crit ≈ 4× advertised. Upgrade 10 live write ≈ 1.81× base vs intended 1.34×. Mark ×2 is applied then deleted on the first calculatePlayerDamage, so the HP write often has no Mark.
DESIRED_BEHAVIOUR: Single scale, single crit, single RES/SR pass. Consume Mark after the HP write (or only in computeDamage). Death detection must use the same number as the write.
EVIDENCE: 2026-09-24 sim: Frost L0 crit intended ~39 live ~80; L10 non-crit intended 26 live 34; L20 non-crit intended 35 live 65. Enemy path (WX 16464-16473) scales once.
RECOMMENDED_ACTION: Stop calling calculatePlayerDamage from resolvePlayerCast (use applyDamageToEnemy only), **or** pass unscaled base into computeDamage and do not pre-double crit. Pair tests. Do not retune 1.03 or CHC in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — every player hit, Mark, drain heal (50% of live dmg), recap hits/crits
VALIDATION_REQUIRED: Strike 10 non-crit stays 10; Strike crit is 20 not 40; Frost L10 non-crit matches 1.03^10 once; Mark ×2 on the HP write; drain heal = 50% of that write
STATUS: NEW

ACTION_ID: BAL-FALLBACK-CRUSH-OUTSCALES-KIT
TITLE: Fallback Crush scales with enemy level; kit Strike does not
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 16710-16721; enemyAI.ts estimateDamage 494-508; spellData.ts physical_attack damage 10
CURRENT_BEHAVIOUR: Kit physical_attack is 10 forever (calcScaledDamage ignores caster level). Fallback Crush = 12 × max(1, enemy.level/5) × enrage. L1: 12 vs 10. L10: 24 vs 10. L25: 60 vs 10. Enrage ×6 applies to both (Crush 360 at L25).
DESIRED_BEHAVIOUR: Fallback uses the same Strike formula as the kit, **or** kit Strike gains the Crush level term. Missing the spell must not deal more than landing it.
EVIDENCE: 2026-09-24 crushVsStrike table. estimateDamage melee fallback already uses 12*(L/5).
RECOMMENDED_ACTION: Point fallback at physical_attack + calcScaledDamage, or add a caster-level term to Strike in the same pass as BAL-DMG-NO-LEVEL-SCALE.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — enemy TTK, charger tests
VALIDATION_REQUIRED: enemy L1/L10/L25 Strike vs Crush; enrage ×6
STATUS: NEW

ACTION_ID: BAL-HAZARD-FLAT-DAMAGE
TITLE: Lava/spikes are flat HP and bypass RES
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11429-11469
CURRENT_BEHAVIOUR: Lava 8–15 plus Burning 3/turn × 3. Spikes 5–10. Direct setCharacterStats; not playerTakesDamage. L1 lava up to ~24% of 100 HP; L25 lava 15 is ~7% of 220. Shield Charm / RES do not apply. Challenge damage **is** recorded.
DESIRED_BEHAVIOUR: Scale with linear maxHP (e.g. 8–12% per lava step) and route through playerTakesDamage so RES/shield work. Keep challenge recording.
EVIDENCE: 11429 comment `8-15`; 11469 `5-10`; playerTakesDamage is 3424+ and unused here.
RECOMMENDED_ACTION: Percent of maxHP + playerTakesDamage. Recheck easy_3 / hard_1 after the change.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — Untouchable / under-30 / under-50
VALIDATION_REQUIRED: lava hits RES; L1 vs L25 share of maxHP; challenge totalDamage increments
STATUS: NEW

ACTION_ID: BAL-DOKA-LOTTERY-BILLION
TITLE: Replace the 1e9 Doka jackpot band
CATEGORY: economy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 12379-12414; applyRewardsResult.ts; main.mo 2119
CURRENT_BEHAVIOUR: Per-enemy roll; `roll < 0.0001` (0.01%) band is uniform 1..1_000_000_000 times enemy.level. Raw E[mult]≈50007. Persist clamp 100_000 so jackpot persist EV is 10 Doka/enemy plus non-jackpot ≈level×6.88. Recap can still show the raw roll. Comments still say 0.0001%.
DESIRED_BEHAVIOUR: Remove the billion band. Keep a small rare spike (max multiplier tens–low hundreds) so persist EV is a few×enemy.level without a 100_000 spike.
EVIDENCE: L1 3-pack persist mean ≈257 this run is almost entirely that +10/enemy term plus uptiered enemy.level.
RECOMMENDED_ACTION: Redesign the table; do not only lower the persist cap.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: HIGH if jackpot flavor is intended; persist clamp tests
VALIDATION_REQUIRED: EV unit test on the new table; recap vs persist match
STATUS: OPEN

ACTION_ID: BAL-XP-EXPONENTIAL-WALL
TITLE: Slow the XP doubling after the early game
CATEGORY: progression
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: xpCurve.ts; main.mo applyRewards 2126-2132
CURRENT_BEHAVIOUR: N→N+1 = 100×2^(N-1). Kill XP = 20×enemy.level. Live 3-pack at L1 is 660 XP (0.15 fights); L10 77.6 fights; L15 1517 fights; L25 ~1e6 fights.
DESIRED_BEHAVIOUR: Keep a climb after L8 without making L15 a stop. Example: L10 in tens of fights, L15 in low hundreds.
EVIDENCE: 8k spawn MC this run; xpThresholdBigInt; computeVictoryExp.
RECOMMENDED_ACTION: Change xpCurve.ts and Motoko together. Do not also raise L1 kill XP.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — leftover XP, recap, death 20%, HUD saturation L48
VALIDATION_REQUIRED: applyXpDelta / applyRewards twins; recapXpAfterGrant; longHorizonSim
STATUS: OPEN

ACTION_ID: BAL-DMG-NO-LEVEL-SCALE
TITLE: Damage function ignores character level
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 130-137; spellEngine.ts calcScaledDamageInline 1038-1044
CURRENT_BEHAVIOUR: floor(base×1.03^upgrade). `_casterLevel` unused. Enemy combat HP grows 5%/level linear. Kit Strike stays 10.
DESIRED_BEHAVIOUR: A small caster-level term, or flatten enemy HP. Must not ship while crits are 4× (`BAL-PLAYER-DMG-DOUBLE-PASS`) or Sacrifice is 1.2× same-level eHP.
EVIDENCE: calcScaledDamage signature; calcEnemyMaxHp vs kit Strike 10.
RECOMMENDED_ACTION: Fix double-pass first. Then pick one axis (player dmg up or enemy HP slower) and retune Sacrifice in the same change.
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
EVIDENCE: 8k MC L1 max 80; hist ~6% at 31+.
RECOMMENDED_ACTION: Change pickEnemyLevelFromTiers; keep dungeon DUNGEON_TIER_BOOST as explicit hard mode.
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
CURRENT_BEHAVIOUR: playerTier = floor((L-1)/10). At L1, −1 tier clamps to 0. Mean enemy 11.01, p(enemy>player)=0.934. L8 mean still 11.02.
DESIRED_BEHAVIOUR: Separate the first 5–10 player levels from the L10 band, or allow below-player rolls that are not clamped to 1–10.
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
FILES_OR_SYSTEMS: WorldExploration.tsx 11920; enemyAI.ts 194-199
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
CURRENT_BEHAVIOUR: Create writes atk 15, res 10, chc 5, evasion 5. Outgoing damage uses spell base × (double) upgrade × SP (spells only) × RES/SR on the target. Player ATK unused. Incoming uses character RES except hazards.
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
CURRENT_BEHAVIOUR: 0 AP, 0 MP, restores AP and MP, once per battle, innate. Returns "no_ap" so the caller does not debit.
DESIRED_BEHAVIOUR: Cost 2–4 AP, or restore half, or once per N battles.
EVIDENCE: isTimestep branch returns "no_ap".
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
CURRENT_BEHAVIOUR: floor(currentHP×0.2)×3. Same-level combat eHP is 50% of player linear HP, so ratio is 1.20 from L1–L100. Live L1 spawn oneshot rate 0.35 because of uptier. Separate path: not double-scaled.
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
FILES_OR_SYSTEMS: deathPenalty.ts victoryResourceFloor 144-155
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
FILES_OR_SYSTEMS: WorldExploration.tsx recapXpAfterGrant
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
CURRENT_BEHAVIOUR: 30% family overwrites hp and res at spawn; battle start sets HP from calcEnemyMaxHp. Family res 0.05–0.75 vs integer RES; combat uses res/100 so iron_golem 0.75 is 0.75% reduction.
DESIRED_BEHAVIOUR: Apply family to combat HP and RES (as percents 5–75), or stop rolling combat-affecting families.
EVIDENCE: spawnPolicy applyFamily; computeDamage resFactor = 1 - effectiveRes/100.
RECOMMENDED_ACTION: One identity path.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: iron_golem combat HP vs default; RES 75 not 0.75
STATUS: OPEN

ACTION_ID: BAL-DOMINATED-SPELLS
TITLE: Several starter spells are strictly worse copies
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts
CURRENT_BEHAVIOUR: Venom Strike = Poison Arrow DoT at +1 AP and −2 range. Iron Skin = Shield at +1 AP. Expose 15/3 vs Cursed Wound 22/3. Inferno 0+24/5 vs Frost 20/3. Weaken is 1 live damage and no debuff.
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
FILES_OR_SYSTEMS: gameConstants.ts SUMMON_UPGRADE_COST_MULTIPLIER; spellUpgrade.ts
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
FILES_OR_SYSTEMS: progression.ts; adminGuard.mo MAX_PERSISTED_AP=20
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
FILES_OR_SYSTEMS: admin.mo; starterSpells; PLAYER_BASE_AP=8
CURRENT_BEHAVIOUR: Backend catalog AP 12, minLevel 30. Not in spellData.ts. Player AP is 8 until L25.
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
FILES_OR_SYSTEMS: gameConstants.ts 331-333
CURRENT_BEHAVIOUR: Flat +1000 HP (then ×1–5). Mean L1 combat HP 75.
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
FILES_OR_SYSTEMS: itemShop.ts
CURRENT_BEHAVIOUR: 0.5% of Doka→HP clicks restore full HP for 1 Doka vs 1:3 otherwise.
DESIRED_BEHAVIOUR: Remove, or restore 20–40% missing HP.
EVIDENCE: itemShop.ts jackpot branch.
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
CURRENT_BEHAVIOUR: Health Potion 50 Doka for 30% (30 HP at L1) = 1.67 Doka/HP. Overworld 0.33 Doka/HP. Break-even vs 1:3 at L81. In battle, potions do not spend AP.
DESIRED_BEHAVIOUR: Combat-only, or price near 0.4–0.6 Doka/HP.
EVIDENCE: potionVsOverworld table this run.
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
CURRENT_BEHAVIOUR: Backend seeds vampire_bite, void_collapse, fireball, … Frontend combat uses starterSpells / BOSS_KITS ids. OLD_SPELL_NAMES_SET also strips several backend ids from the player pool.
DESIRED_BEHAVIOUR: One list.
EVIDENCE: admin.mo vs SPELL_ID_CATALOG; WX 2356-2388.
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
FILES_OR_SYSTEMS: useBossRush.ts BOSS_RUSH_ROOMS; WorldExploration.tsx 12749-12757
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
CURRENT_BEHAVIOUR: FE Pale Archbishop 350 HP, ×5 Doka / ×3 XP. BE 500 HP, ×10 / ×8. Spell ids also diverge.
DESIRED_BEHAVIOUR: Live combat and admin seed the same BossConfig.
EVIDENCE: bossDefaults.ts vs admin.mo.
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
FILES_OR_SYSTEMS: admin.mo; processPendingPurchases
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
FILES_OR_SYSTEMS: progression.ts getBossEffectiveStats; WorldExploration boss HP 11970; types/bossDefaults.ts
CURRENT_BEHAVIOUR: Guide HP = round(base×1.08^(bossLevel-playerLevel)). Combat uses catalog baseStats.hp (FE 350, BE 500) plus phase2.statMultiplier at the HP threshold.
DESIRED_BEHAVIOUR: Combat consumes getBossEffectiveStats, or the Guide labels the table as non-authoritative.
EVIDENCE: progression.ts comments; DEFAULT_BOSS_CONFIGS pale_archbishop hp 350.
RECOMMENDED_ACTION: Prefer labeling first (low risk). Wiring combat to 1.08^Δ is a full boss retune.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH if combat is scaled without a HP pass
VALIDATION_REQUIRED: Boss Guide row vs in-fight maxHp
STATUS: OPEN

ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 grows Strike more than casters
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx getEffectiveSpellRange 3652-3667; DEFAULT_LEVELUP_CONFIG
CURRENT_BEHAVIOUR: effective = min(base + floor(L/10), 5). Strike 1→2 at L10 →5 at L40. Frost 4→5 at L10 and stops. Strike never fizzles.
DESIRED_BEHAVIOUR: Cap ≥ 6–8, or grow range from spell upgrade, or stop growing Strike past 2–3.
EVIDENCE: 2026-09-24 range table; spellFail exemption.
RECOMMENDED_ACTION: Change maxSpellRange or exclude isPhysical from level bonus.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — targeting.parity tests
VALIDATION_REQUIRED: getEffectiveSpellRange L1/L10/L40 Strike vs Frost
STATUS: OPEN

ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player casts do not apply debuffStat
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 876-1028 vs resolveSpellCast 529-548
CURRENT_BEHAVIOUR: Enemy/summon path writes Slow/Frost/Weaken/Expose extras. Player damage loop deals damage and returns. Advertised CC is dead on the bar. Buffs still apply. Zero-damage Weaken floors to 1 via calcScaledDamage.
DESIRED_BEHAVIOUR: After a successful player hit (and on pure-debuff spells), apply debuffStat like resolveSpellCast. Floor combined AP/MP debuffs at 1.
EVIDENCE: No applyEffect in the player damage loop.
RECOMMENDED_ACTION: Wiring + AP/MP floor. Do not change Slow/−2 or Frost/−1 numbers in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: player Slow writes mp debuff; two MP debuffs cannot pass the floor; Haste still stacks; Archer kit Slow still works
STATUS: OPEN

ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive-cap or cooldown
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts 547-688; gameConstants.ts ENEMY_SUMMON_CAP=2; WorldExploration spawnPlayerSummon
CURRENT_BEHAVIOUR: Five innate summons, AP 2–3 (now deducted via castResultSpendsAp), no cooldown. Enemy side is capped at 2 with a 2-turn CD. An 8-AP turn places Wolf+Archer+Wisp, each with its own turn.
DESIRED_BEHAVIOUR: Alive cap 2 or 3; 1–2 turn cooldown per summon spell. Keep kit identities and lifespan formulas.
EVIDENCE: ENEMY_SUMMON_CAP vs no player check; summon rows omit cooldown. AP debit verified 2026-09-24 (challengeCompletion.ts 330-331).
RECOMMENDED_ACTION: Cap at spawn; add CD. Do not change hpScale numbers here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — occupancy fallback
VALIDATION_REQUIRED: fourth summon rejected if cap=3; recast during CD on_cooldown; AP still deducted
STATUS: OPEN

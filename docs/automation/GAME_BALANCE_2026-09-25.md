# Stralt quantitative game-balance analysis — 2026-09-25

**Role:** quantitative game-balance analyst (cron `0 */48 * * *`).
**HEAD:** `0f5363f` (`Merge pull request #332`). Unchanged since 2026-09-21.
**Telemetry:** none. Synthetic only (Monte Carlo 8k spawn rolls; live formulas).
**This run does not change balance numbers.** Combat, XP, spawn, shop, and Doka constants were not edited.

Prior passes: 2026-09-24 / 09-23 / 09-22 / 09-21 at `0f5363f`; 2026-09-02 at `58302bc`; 2026-09-01 at `dd275aa`.
Open siblings: PR #505 (`GAME_BALANCE_2026-09-24.md`), PR #472 (`GAME_BALANCE_2026-09-23.md`). This file is a new dated report; it does not overwrite those PRs.

Durable IDs stay `BAL-*`. Ledger: [`ACTION_IDS_BAL_2026-09-25.md`](./ACTION_IDS_BAL_2026-09-25.md).

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula |
| :--- | :--- |
| XP N→N+1 | `100 * 2^(N-1)` — `xpCurve.ts`; `main.mo` `applyRewards` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` `computeVictoryExp` |
| Portal XP | 10 (`PORTAL_TRANSITION_XP`) |
| `applyRewards` ceilings | Doka 100_000 / XP 500_000 |
| Spawn level | `pickEnemyLevelFromTiers` tierSize=10, 60/20/10/**remainder 10** plus ±1 variance 15% |
| Player max HP (HUD) | `floor(100 * (1 + (L-1)*0.05))` — `WorldExploration.tsx` 3400–3406 |
| Player battle AP/MP | `8 + floor(L/25)` / `4 + floor(L/25)`; persist cap 20 |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` — overwrites spawn HP |
| Spawn HP / placeholder melee | `L*8+20` / `L*2+3` — unused once battle kits fire |
| Spell scale (function) | `floor(base * 1.03^upgrade)`; **caster level unused** |
| Live player hit | that scale **twice**, plus crit **twice** (`BAL-PLAYER-DMG-DOUBLE-PASS`) |
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

Monte Carlo: 8000 rolls, default tier config, `random.seed(20260925)`, no `localStorage` override.

Queued PRs **not in HEAD** that would change some CC findings if they merge first: #528 (Weaken/Slow on highlighted hostiles), #555 (`debuffStat` after player damage hits). This report is vs `origin/main` `0f5363f`.

---

## Ledger this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| BAL-PLAYER-DMG-DOUBLE-PASS | P0 | OPEN (was NEW 09-24) |
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
| BAL-BOSS-GUIDE-VS-COMBAT | P2 | OPEN |
| BAL-RANGE-CAP-FAVORS-STRIKE | P2 | OPEN |
| BAL-PLAYER-CC-DEAD-ON-BAR | P1 | OPEN |
| BAL-PLAYER-SUMMON-NO-CAP | P1 | OPEN |
| BAL-FALLBACK-CRUSH-OUTSCALES-KIT | P1 | OPEN (was NEW 09-24) |
| BAL-HAZARD-FLAT-DAMAGE | P2 | OPEN (was NEW 09-24) |
| **BAL-HEAL-ADVERTISED-BUFF-DEAD** | P1 | **NEW** |
| **BAL-ENEMY-MITIGATION-UNCAPPED** | P1 | **NEW** |
| **BAL-TIER-THREE-MORE-UNUSED** | P3 | **NEW** |

---

## What moved since 2026-09-24

Formulas and HEAD did not move. This pass traced **heal extras**, **enemy RES/SR caps**, and the **unused `threeOrMorePercent` field**.

1. **Heal spells drop their advertised buff, and the stored modifier would invert CHC.** Blood Mend and Rallying Cry advertise +15% CHC (`buffStat: "chc"`, `buffModifier: 0.15`). `resolvePlayerCast` heal branch (`spellEngine.ts` 655–672) heals and returns `"cast"` without `applyEffect`. Shield uses `buffModifier: 1.3` (multiplicative). `getStatModifier` multiplies non-AP/MP stats, so `0.15` would become **×0.15 CHC (−85%)** if anyone wired the heal buff through the shield path. New ID `BAL-HEAL-ADVERTISED-BUFF-DEAD`.
2. **Enemy RES/SR have no 100 cap.** `getEnemyBaseStats` rolls `res` in `[2, 4+L×0.9] × pieceMult`. Rook max RES hits 100 at **L78**; king SR hits 100 at **L96**. Combat is `max(1, round(dmg × (1 − res/100) × (1 − sr/100)))`, so late tank pieces take **1 damage** from every kit hit (Strike 10, Frost 20, even the 4× player crit path). New ID `BAL-ENEMY-MITIGATION-UNCAPPED`.
3. **`threeOrMorePercent: 5` is unused.** `pickEnemyLevelFromTiers` computes leftover `100 − same − adj − twoAway` = **10%**, ignoring the config field. Combined with floor clamp this is extra tail mass, not a separate spawn model. New ID `BAL-TIER-THREE-MORE-UNUSED`.

Re-verified unchanged:

- Double-pass player damage (`spellEngine.ts` 882–892 then `WorldExploration.tsx` 3308–3339). Frost L0 crit intended 40, live 80.
- `buildEnemyKit(piece, currentMap.levelZone)` still passes `{name,minLevel,maxLevel}` (`WorldExploration.tsx` 11920) → zone-0 kits.
- `resolvePlayerCast` still never writes `debuffStat` on HEAD. Queued #528 / #555 would partially resurrect CC; they are not merged.
- Summon AP **is** deducted (`castResultSpendsAp("summon") === true`). No alive-cap.
- Recap still uses `recapXpAfterGrant` (`BAL-RECAP-XP-BAR-WRONG` RESOLVED).
- Player GameKey remains 100 Doka/€. Admin grant cap 10_000_000 still bypasses `applyRewards` 100_000.
- PR #386 (victory HP floor cap) still not in HEAD. Floor is `50 + L×10` vs linear max `floor(100×(1+(L−1)×0.05))` — exceeds max from **L10** (150 vs 145).
- Lottery comments still say `0.0001%` while `roll < 0.0001` is **0.01%**.

---

## Scenario snapshot (live spawn, 8k rolls, typical 3-pack)

| Band | Player L | Mean enemy L | p(enemy>player) | XP/fight (3) | Fights/level | Combat mean eHP | Sac (full) | p(sac oneshot) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 11.02 | 0.929 | 661 | 0.15 | 75 | 60 | 0.35 | 257 | no |
| Mid | 8 | 10.91 | 0.430 | 654 | 19.6 | 75 | 81 | 0.77 | 255 | no |
| Mid | 10 | 10.60 | 0.287 | 636 | 80.5 | 74 | 87 | 0.83 | 249 | **yes** |
| Late | 15 | 18.08 | 0.504 | 1085 | 1510 | 92 | 102 | 0.76 | 403 | yes |
| Stress | 25 | 27.13 | 0.506 | 1628 | 1.03e6 | 115 | 132 | 0.78 | 590 | yes |

L1 histogram (10-level buckets): 71.1% in 1–10, 17.4% 11–20, 5.5% 21–30, ~6% 31+. Min 1, max 80.

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
| Weaken | 3 | advertised −30% dmg | 0.33 live | 0.26 | **1 dmg, no debuff** | 4 dmg on crit | Dead spell on HEAD |
| Sacrifice | 3 | `floor(HP×0.2)×3` | 20 at 100 HP | 16.0 | 20% self HP | n/a (separate path) | Oneshots same-level eHP |
| Blood Mend | 3 | 12 HP + CHC | 4.0 HPA | 3.20 | **CHC buff never applied** | crit 2× heal | Heal live; extra dead |
| Rallying Cry | 4 | 20 HP + CHC | 5.0 HPA | 4.00 | **CHC buff never applied** | crit 2× heal | Better HPA; extra dead |
| Life Drain | 3 | 10 dmg + 5 HP | 3.3 + 1.7 | — | SP shred **dead**; 50% of **live** dmg heals | crit inflates heal | Worse than Frost+Mend split |
| Shield | 2 | +30% RES 3t | — | — | live (buff path) | — | **Strictly dominates** Iron Skin |
| Iron Skin | 3 | +30% RES 3t | — | — | live | — | Dominated |
| Timestep | 0 | full AP+MP, 1×/battle | ∞ | ∞ | live, `no_ap` | — | Extra turn; dominant |
| Dire Wolf | 3 | hunter, lifespan 4 | board actor | 2.4 after fail | **no cap**; AP **is** charged | — | Dominant vs any 3-AP nuke |
| Mark | 2 | next hit ×2 | — | — | often **no HP write bonus** | — | Consumed on the pre-pass |

Spell-upgrade live vs intended (Frost Bolt, no SP/RES, this run):

| Spell level | Intended | Live write | Intended crit | Live crit |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 20 | 20 | 40 | 80 |
| 5 | 23 | 26 | 46 | 104 |
| 10 | 26 | 34 | 52 | 136 |
| 20 | 36 | 65 | 72 | 260 |

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

Create writes AP 10 / MP 5 (`startingChampionStats.ts`). Battle init overwrites to 8 / 4. HUD HP is linear +5%/level; `getPlayerBaseStats` HP is compounding `100 × 1.05^(L−1)` and is **not** the HUD. Atk/res/init/chc/evasion persist but outgoing damage ignores ATK. SP 8 applies once, on the **second** pass. Create CHC is 5; combat fail is independent.

AP +1 / 25 levels. Persist cap `MAX_PERSISTED_AP = 20`. Formula `8 + floor(L/25)` hits 21 at L325 and is clamped — the last +1 is unreachable. L15 needs 1.6M cumulative leftover XP — the wall is XP, not AP.

All 32 `starterSpells` are forced `isBaseSpell: true`. There is no loadout economy.

### Enemy scaling

L1–10 share **tier 0**. Floor bias: at L1, down-tier clamps to 0. Mean enemy ≈ 11, 93% above the player, tail to 80. Combat HP at mean L11 ≈ 75 vs player 100.

Family 30% overwrites `res` to 0.05–0.75 (fraction). Combat uses `1 - res/100`, so 0.75 is **0.75%** reduction, not 75%. `hpMult` is applied to spawn HP then discarded by `calcEnemyMaxHp`.

Kits stay zone 0 (Strike / Frost). AI tier: 30% chance uniform 1–10 regardless of enemy level.

Backend `getEnemyHPForLevel` is unused by the live client.

**Kit vs fallback:** pawn/knight/rook kits deal Strike 10. If the AI takes the melee fallback, Crush = `12 × max(1, L/5) × enrage`. L10 Crush 24 vs Strike 10. L25 Crush 60 vs Strike 10.

**Mitigation cap (new):** rook RES max ≥ 100 at L78; king SR max ≥ 100 at L96. Hits floor at 1 HP. This is a late-game difficulty **collapse** for kit damage and a spike for any path that still uses Sacrifice (percent HP, ignores RES).

### Damage / AP efficiency

Character level still unused in `calcScaledDamage`. The live hole is the **double pass** on the player write. Enemy casts (`WorldExploration.tsx` 16464–16473) scale **once** and crit **once**. Player crits are twice as large as enemy crits of the same base.

Without Sacrifice / summons / Chain Lightning / the 4× crit, TTK still rises because enemy HP is linear and kit Strike is flat 10 — until RES/SR hit 100, then TTK becomes “chip 1 forever” unless Sacrifice is used.

### Healing efficiency

Heal spells use the heal branch (single scale, crit 2× heal) — they do **not** go through the double damage pass. Advertised CHC on Blood Mend / Rallying Cry is **dead**. Drain heal is `0.5 * live finalDmg`, so a crit Life Drain heals ~2× the advertised 5 because the damage under it was 4×.

Overworld 1:3 dominates potions until ~L81. Jackpot heal is 1 Doka full HP (0.5% of Doka→HP clicks).

### Summons

`getSummonBaseStats` at spell level 0: Wolf 80 HP / 2 AP; Sentinel `120 × 1.5 = 180` HP; Wisp `70 × 0.6 = 42` HP; Archer `60 × 0.7 = 42`; Bomber `50 × 0.5 = 25`. Lifespan 4 + floor(spellLevel/2) in the canonical function (per-spell `summonLifespan` is the spawn-path override). Player can place Wolf+Archer+Wisp in one 8-AP turn (AP **is** charged). Enemy summon cap is 2; player has none. Enemy summoner chance `0.12 + playerLevel * 0.02` is 100% at L44. Upgrade UI 10× vs canister 1×.

### Crowd control

On the **player bar**, CC is a description string. Frost Nova still deals 15 AoE. Slow/Weaken never land from `resolvePlayerCast` on HEAD. Control mage is a dominated fantasy: the real levers are Sacrifice, Timestep, summons, Chain Lightning, and **crit 4×**.

### XP curve

Doubling per level vs linear-in-enemy-level income. Live uptier at L1 makes the first level free (661 XP vs 100 needed). L10 ≈ 80 three-packs. L15 ≈ 1.5k three-packs. Challenge XP is a larger grant than many early fights.

### Doka acquisition

Raw E[multiplier] ≈ **50,007**, of which **50,000** is the 0.01% jackpot band `uniform(1..1e9)`. Comments in `WorldExploration.tsx` 12388–12390 still say “0.0001%”; the predicate `roll < 0.0001` is **0.01%**. Non-jackpot E[mult] ≈ 6.88. Persist EV per enemy ≈ `level * 6.88 + 10`.

Shrine altar 300. Ground coins: 40% map chance, `max(1, round((5 + avgEnemyLevel*2) * U(0.8,1.2)))`, count `ceil(enemies/3)`. Dungeon complete `maxDepth * 50`. Achievements 50–1000 once. All rounding error next to one clamped jackpot (100_000).

Admin `validateDokaGrant` 10_000_000 vs `applyRewards` 100_000.

### Spell-upgrade costs

`10, 20, 40, …` through `10 * 2^13 = 81_920`. Live double-scale makes paid levels stronger than the advertised +3%/level, so the exponential price is buying a squared curve.

### Shops

Player IAP is GameKey at 100 Doka/€. Seeded `ShopPackage` ladder is unused (`processPendingPurchases` no-op). BuffShop 50–150 Doka. Battle Elixir +3 AP (80) vs Timestep (0 AP, full restore) is dominated in battle. Swift Boots +2 MP (90) vs Haste (2 AP, +2 MP if the additive path fires) is a Doka vs AP trade.

### Death penalties

20% leftover XP, 40% of **all** Doka. After a jackpot the death tax is the real sink. Respawn HP is 50% of linear max (L1 = 50).

### Dungeon multipliers

Live Doka ×1.5…4; live XP ×1. Depth also adds `DUNGEON_TIER_BOOST * 10` enemy levels (`[0,1,2,2,3,3]`) and `[0,2,3,4,4,5]` extra enemies. Titan’s Vigor is a flat +1000 HP on **all** combatants plus a 1–5× damage roll.

### Boss Rush

Advertised room table sums 21_000 Doka / 8_500 XP. Persist is kill XP plus `max(5, floor(L*1.5))` Doka per kill. Frontend boss HP 60–600, reward ×5 / ×3; backend 100–800, ×10–50 / ×8–40. Guide `1.08^Δ` is UI-only.

### Challenges

`hard_3` is `maxApUsedInTurn <= 8`. Player AP is 8 until L25, so the constraint is free. `hard_1` 500 XP at L1 is a five-threshold skip. Sacrifice self-hit counts toward Untouchable / under-30. Lava/spikes **do** increment challenge damage (`recordInBattleChallengeDamage`) even though they bypass RES.

### Achievements

Default feats pay 50–1000 Doka. Wallet feats wait for `applyRewards` commit. Feat Doka is trivial vs persist EV. `level_10` is 300 Doka after an XP wall that already takes ~80 three-packs at the L10 band — the feat is a rounding error on the lottery, not a progression reward.

---

## Representative scenarios

### Early (player L1)

- Mean pack is **tier-0 with up-tail**, not “level 1 mobs.” Combat eHP ~75 vs player 100. Sacrifice 60 oneshots ~35% of live spawns (the rest are the uptier).
- First level is **trivial**: 661 XP vs 100 needed. Then the curve doubles.
- Dominant: Timestep, Sacrifice vs same-level leftovers, Chain Lightning, uncapped summons, Strike (fail-proof).
- Useless: Venom Strike, Iron Skin, Weaken/Slow, advertised Blood Mend CHC.

### Mid (player L8–10)

- Still mostly fighting the **same tier-0 pool** (mean enemy ~11). Linear HP has grown for the player (L10 max 145) and Sacrifice (87) oneshots ~82% of the pack.
- XP wall starts: ~20 fights at L8, ~80 at L10. Victory HP floor 150 exceeds max 145 at L10 (`BAL-VICTORY-FLOOR-OVER-MAXHP`).
- Challenge `hard_1` / `legendary_1` skip multiple levels if completed.

### Later (player L15–25)

- Mean enemy tracks the player (~18 / ~27) but the tail still reaches 90–100. Fights/level 1.5k → 1e6.
- Kit Strike 10 vs eHP 92–115 is a long TTK unless Sacrifice / 4× crit / summons / Chain Lightning fire.
- At L25 Crush fallback is 60. Player AP is still 8 (next point L25 exactly: `floor(25/25)=1` → AP 9).
- Beyond L78, rook RES can roll 100 and kit damage floors at 1 (`BAL-ENEMY-MITIGATION-UNCAPPED`). Sacrifice still oneshots because it ignores RES.

---

## New findings (full recs)

### BAL-HEAL-ADVERTISED-BUFF-DEAD

- **Current:** Blood Mend (3 AP, 12 HP, `buffModifier: 0.15` CHC 2t) and Rallying Cry (4 AP, 20 HP, same CHC encoding). Heal branch applies HP only.
- **Evidence:** `spellData.ts` 85–101 and 417–435; `spellEngine.ts` 655–672 (heal + return, no `applyEffect`). Contrast Shield `buffModifier: 1.3` at `spellEngine.ts` 697–710. `getStatModifier` multiplies CHC (`statusEffects.ts` 45–62).
- **Problem:** Advertised identity is dead. If a later PR “fixes” it by reusing the shield path without recoding 0.15 → 1.15, CHC becomes ×0.15.
- **Recommended range:** Apply `chc` as **+15 percentage points** additive, **or** store `buffModifier: 1.15` and multiply. Do not mix with Shield’s 1.3 factor encoding.
- **Expected effect:** Crit-heal identity exists; Rallying Cry stops being a strict HPA clone of a bigger Mend.
- **Risk:** Medium — CHC 1→~16 would raise live 4× crit rate if the double-pass remains.
- **Confidence:** HIGH.

### BAL-ENEMY-MITIGATION-UNCAPPED

- **Current:** `res = roll(2, 4+L×0.9, pieceMult)`, `sr = roll(2, 4+L×1.0, pieceMult)`. No cap. Combat `1 − stat/100`, floor 1 dmg.
- **Evidence:** `progression.ts` 175–186; `spellEngine.ts` computeDamage 393–407; this-run table: rook RES 100 at L78, knight 84, king 107; king SR 100 at L96, rook 79.
- **Problem:** Linear HP + flat kit damage already inflates TTK. Hitting 100 RES/SR **collapses** kit/Frost/Chain into 1-chip. Sacrifice (percent HP, no RES) becomes the unique answer — a dominated-strategy lock.
- **Recommended range:** Cap effective RES and SR at **60–75** (keep a 25–40% damage floor), **or** convert rolls to a 0–40 band that matches family fractions after a unit fix.
- **Expected effect:** Late tanks stay tanky without immunity. Sacrifice remains strong but not mandatory.
- **Risk:** Medium — existing L70+ saves (if any) get squishier.
- **Confidence:** HIGH.

### BAL-TIER-THREE-MORE-UNUSED

- **Current:** `DEFAULT_TIER_CONFIG.threeOrMorePercent = 5`, but `pickEnemyLevelFromTiers` uses leftover `100−60−20−10 = 10` (`combatMath.ts` 72–75, 90–97). Dist 3–6 tiers, then `Math.max(0, …)` so L1 never goes down.
- **Evidence:** Config field is never read (`_threeMore` is computed, name-prefixed unused). MC L1: 5.5% in 21–30, ~6% in 31+.
- **Problem:** Admin “5% far tier” is actually 10%. Doubles the outlier mass that `BAL-ENEMY-TIER-OUTLIER` already flags.
- **Recommended range:** Honor the 5% field **and** split leftover instead of dumping it all into ±3..6. Soft-cap chosen level at playerLevel + 2×tierSize for overworld.
- **Expected effect:** Fewer L80 vs L1 packs. Slightly slower L1 XP (already trivial).
- **Risk:** Low if the 60/20/10 split is kept.
- **Confidence:** HIGH.

---

## Action blocks

ACTION_ID: BAL-DOKA-LOTTERY-BILLION
TITLE: Victory Doka jackpot EV dwarfs every other sink and source
CATEGORY: economy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 12385-12415; applyRewardsResult.ts APPLY_REWARDS_MAX_DOKA_DELTA; main.mo applyRewards
CURRENT_BEHAVIOUR: Per enemy, roll < 0.0001 (0.01%) × uniform 1..1e9 × enemy.level. Comments say 0.0001%. Persist clamps the whole applyRewards call at 100_000 Doka. Raw E[mult] ≈ 50007; persist EV ≈ level×6.88 + 10.
DESIRED_BEHAVIOUR: Jackpot band ≤ 0.001% or payout cap in the 200–2000 × level band. Recap must match persist. Fix the percent comment.
EVIDENCE: 2026-09-25 MC persist 3-pack EV L1=257 vs median ~66. One jackpot persist = 100_000 = ~390 L1 3-packs.
RECOMMENDED_ACTION: Replace uniform 1e9 with a bounded table. Do not retune XP in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — wallet, death 40% tax, IAP relative value, jackpot achievement
VALIDATION_REQUIRED: persist ≤ 100_000; recap == persist; no applyRewards #err on jackpot
STATUS: OPEN

---

ACTION_ID: BAL-XP-EXPONENTIAL-WALL
TITLE: XP curve doubles per level while kill XP is linear in enemy level
CATEGORY: progression
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: xpCurve.ts; main.mo applyRewards; rewardResolver.ts computeVictoryExp
CURRENT_BEHAVIOUR: Threshold 100×2^(N-1). Kill XP = sum(level×20). Live 3-pack at L1 ≈ 661 XP (0.15 fights); L10 ≈ 80 fights; L15 ≈ 1510 fights; L25 ≈ 1.03e6 fights. HUD saturates at L48.
DESIRED_BEHAVIOUR: Super-linear income or sub-exponential thresholds so L15 is tens of fights, not thousands.
EVIDENCE: 2026-09-25 MC table. Cumulative 1→15 leftover-scale = 1,638,300.
RECOMMENDED_ACTION: Keep persist leftover semantics. Change either the 2^(N-1) exponent or attach a player-level term to kill XP. Do not change both at once.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — every recap, challenge skip, portal 10 XP
VALIDATION_REQUIRED: L1 still not a 20-fight slog; L15 fights/level in 20–80; bigint path still levels past 48
STATUS: OPEN

---

ACTION_ID: BAL-DMG-NO-LEVEL-SCALE
TITLE: calcScaledDamage ignores caster level
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 130-137; spellEngine.ts calcScaledDamageInline 1038-1044
CURRENT_BEHAVIOUR: floor(base × 1.03^upgrade). `_casterLevel` unused. Kit Strike stays 10 at every enemy level.
DESIRED_BEHAVIOUR: Include a small caster-level term (e.g. × (1 + 0.03×(L-1))) **or** retune bases once double-pass is gone.
EVIDENCE: Parameter is prefixed `_casterLevel`. Enemy kit Strike 10 vs Crush 12×(L/5).
RECOMMENDED_ACTION: Fix BAL-PLAYER-DMG-DOUBLE-PASS first, then add at most one level term. Pair with fallback Crush.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — TTK, Sacrifice relative power
VALIDATION_REQUIRED: Strike L1 stays ~10; L25 kit Strike in 18–30 if a 3%/level term is chosen
STATUS: OPEN

---

ACTION_ID: BAL-PLAYER-DMG-DOUBLE-PASS
TITLE: Player damage scales and crits twice before HP write
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast 882-892 and 990-998; castHelpers.ts applyDamageToEnemy 321-330; WorldExploration.tsx computeDamage 3308-3339
CURRENT_BEHAVIOUR: Resolver computes rawDmg = floor(base×1.03^upgrade), doubles on crit, then applyDamageToEnemy calls calculatePlayerDamage on that already-scaled/crit value with isCrit still true, which scales and crits again. Upgrade 0 crit ≈ 4× advertised. Upgrade 10 live write ≈ 1.81× base vs intended 1.34×. Mark ×2 is applied then deleted on the first calculatePlayerDamage, so the HP write often misses Mark.
DESIRED_BEHAVIOUR: Single scale, single crit, single RES/SR pass. Consume Mark after the HP write (or only in computeDamage). Death detection must use the same number as the write.
EVIDENCE: 2026-09-25 sim: Frost L0 crit intended 40 live 80; L10 non-crit intended 26 live 34; L20 non-crit intended 36 live 65. Enemy path (WX 16464-16473) scales once.
RECOMMENDED_ACTION: Stop calling calculatePlayerDamage from resolvePlayerCast (use applyDamageToEnemy only), **or** pass unscaled base into computeDamage and do not pre-double crit. Pair tests. Do not retune 1.03 or CHC in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — every player hit, Mark, drain heal (50% of live dmg), recap hits/crits
VALIDATION_REQUIRED: Strike 10 non-crit stays 10; Strike crit is 20 not 40; Frost L10 non-crit matches 1.03^10 once; Mark ×2 on the HP write; drain heal = 50% of that write
STATUS: OPEN

---

ACTION_ID: BAL-ENEMY-TIER-OUTLIER
TITLE: Far-tier rolls can spawn L80 vs L1
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts pickEnemyLevelFromTiers 54-107
CURRENT_BEHAVIOUR: ±3..6 tiers (30–60 levels) on the leftover band. L1 MC max 80. Combat HP L80 = floor(50×(1+79×0.05)) = 247 vs player 100.
DESIRED_BEHAVIOUR: Soft-cap overworld |Δlevel| at ~20, or split the leftover across ±2 and ±3 only.
EVIDENCE: 2026-09-25 L1 histogram ~6% in 31+. Sacrifice oneshot rate 0.35 because of this tail.
RECOMMENDED_ACTION: Cap chosenTier at playerTier+2 on overworld. Keep dungeon DUNGEON_TIER_BOOST as the explicit spike.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — early XP (already trivial) and Doka EV
VALIDATION_REQUIRED: L1 max enemy ≤ 30; mean still ~8–12 if upbias remains
STATUS: OPEN

---

ACTION_ID: BAL-TIER-FLOOR-UPBIAS
TITLE: L1–10 share tier 0; down-rolls clamp to 0
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 57-69, 84-89
CURRENT_BEHAVIOUR: playerTier = floor((L-1)/10). Variance ±1 15% each way. Negative tiers clamp to 0. L1 mean enemy 11.02, p(above)=0.929.
DESIRED_BEHAVIOUR: L1 mean near 1–4, p(above) ≤ 0.5, or a dedicated tutorial band that cannot roll tier 2+.
EVIDENCE: 2026-09-25 MC. L8 still mean 10.91 (same pool).
RECOMMENDED_ACTION: Use playerLevel as the band center with symmetric ±, not floor-tier index.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — first-hour difficulty and XP
VALIDATION_REQUIRED: L1 mean in 2–6; L8 mean in 6–12
STATUS: OPEN

---

ACTION_ID: BAL-ENEMY-KIT-ZONE-OBJECT
TITLE: buildEnemyKit receives a zone object, so kits stay zone 0
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11920; enemyAI.ts buildEnemyKit 194-199
CURRENT_BEHAVIOUR: levelZone is {name,minLevel,maxLevel}. Math.floor(object) is NaN; Math.max(0, NaN) is NaN; kit builders treat it as 0. Enemies keep Strike/Frost.
DESIRED_BEHAVIOUR: Pass a numeric zone index (or minLevel). Higher zones unlock the kit tables already written in ENEMY_KITS.
EVIDENCE: Signature is (pieceType, levelZone: number). Call site passes currentMap.levelZone.
RECOMMENDED_ACTION: Pass currentMap.levelZone.minLevel or a derived index. Snapshot kits in tests for zone 0 vs 2.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — every enemy cast identity
VALIDATION_REQUIRED: zone-0 pawn still Strike; zone-2 pawn kit changes as ENEMY_KITS specifies
STATUS: OPEN

---

ACTION_ID: BAL-PLAYER-COMBAT-STATS-FLAT
TITLE: Persisted ATK/RES/INIT/CHC do not drive outgoing damage
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; combatMath.ts calcScaledDamage; WorldExploration computeDamage
CURRENT_BEHAVIOUR: Create ATK 15, RES 10, CHC 5, SP 8. Outgoing damage uses spell base + upgrade + SP on the second pass. ATK unused. Level unused.
DESIRED_BEHAVIOUR: Either wire ATK into physical Strike, or stop showing ATK as a combat stat.
EVIDENCE: computeDamage never reads characterStats.atk.
RECOMMENDED_ACTION: Pick one: deprecate ATK on HUD, or add ATK/100 to physical hits after double-pass is fixed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Strike damage with ATK 15 vs 0
STATUS: OPEN

---

ACTION_ID: BAL-SPELL-FAIL-FLOOR
TITLE: 20% fizzle until L201, physical exempt
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration spellFailChance; spellEngine.ts 642-651
CURRENT_BEHAVIOUR: 20 − 0.1×level percent, floor 0 at L201. Strike isPhysical skips the roll. Magic E[DPA] is 80% of advertised at L1.
DESIRED_BEHAVIOUR: 5–10% at L1, 0% by L20–40, or fail only on hard casts.
EVIDENCE: Strike E[DPA] 5.0 vs Frost 5.33 after fail despite 2× payload.
RECOMMENDED_ACTION: Lower base to 8–10 or scale reduction to 1%/level. Keep physical exempt or not, but document it.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — magic vs Strike identity
VALIDATION_REQUIRED: L1 fail rate; Strike still never fizzles if that is intended
STATUS: OPEN

---

ACTION_ID: BAL-TIMESTEP-FREE-TURN
TITLE: Timestep restores full AP/MP and spends 0 AP
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts spell-timestep; spellEngine.ts 722-733; challengeCompletion.ts castResultSpendsAp
CURRENT_BEHAVIOUR: apCost 0, returns "no_ap", once per battle. Extra full turn.
DESIRED_BEHAVIOUR: Cost 4–6 AP **or** restore half **or** keep once-per-battle but exclude from opening-turn challenges.
EVIDENCE: Return "no_ap" is explicit so the caller does not deduct.
RECOMMENDED_ACTION: Charge AP equal to the restored amount minus 1, or make it a next-turn delay.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — every opener, hard_3
VALIDATION_REQUIRED: one Timestep per battle; AP after cast is not above max
STATUS: OPEN

---

ACTION_ID: BAL-SACRIFICE-PERCENT-HP
TITLE: Sacrifice oneshots same-level combat HP and ignores RES
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts 749-763
CURRENT_BEHAVIOUR: floor(currentHP × 0.2) × 3, no RES/SR, no fail (isSacrifice before fail? Fail runs first unless isPhysical — Sacrifice is not physical, so it can fizzle). Damage path skips computeDamage.
DESIRED_BEHAVIOUR: Cap at 25–40% of target max HP, **or** apply RES, **or** use a flat 25–40 + 5% current HP.
EVIDENCE: L1 full 60 vs same-level eHP 50. Live spawn oneshot rate 0.35 because of uptier. L10 sac 87 vs mean eHP 74, oneshot 0.83.
RECOMMENDED_ACTION: Route through computeDamage without the double-pass. Keep self-HP loss for challenge identity.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — opener identity, Untouchable
VALIDATION_REQUIRED: L1 vs L1 eHP not a guaranteed kill at full HP; lava/challenge still records self-loss
STATUS: OPEN

---

ACTION_ID: BAL-CHALLENGE-XP-EARLY-BREAK
TITLE: Hard/legendary challenge XP skips multiple early levels
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts DEFAULT_CHALLENGES; rewardResolver persist
CURRENT_BEHAVIOUR: hard_1 +500 XP, legendary_1 +1000 XP, 0 XP on easy. L1→2 is 100, L2→3 is 200.
DESIRED_BEHAVIOUR: Challenge XP ≤ one threshold at the player’s current level, or scale with level.
EVIDENCE: hard_1 at L1 → L3 leftover 200; legendary_1 → L4 leftover 300.
RECOMMENDED_ACTION: `min(advertised, xpForNextLevel(level))` or a 50/100/150 XP ladder.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — recap, achievement defer
VALIDATION_REQUIRED: L1 hard_1 does not jump to L3; L15 still feels worth taking
STATUS: OPEN

---

ACTION_ID: BAL-IAP-VALUE-DOMINANCE
TITLE: Player shop IAP vs lottery (superseded on GameKey path)
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: dokaGameKey.ts DOKA_PER_EURO=100
CURRENT_BEHAVIOUR: Player buy path is GameKey at 100 Doka/€. Lottery persist jackpot is 100_000. SUPERSEDED as “packages cheaper than play.”
DESIRED_BEHAVIOUR: Keep GameKey as the only player mint; jackpot must not dwarf paid 10€ = 1000 Doka.
EVIDENCE: 1000 Doka = 10€ vs one persist jackpot 100_000.
RECOMMENDED_ACTION: Leave IAP. Fix BAL-DOKA-LOTTERY-BILLION.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: N/A
VALIDATION_REQUIRED: none
STATUS: SUPERSEDED

---

ACTION_ID: BAL-HP-FORMULA-SPLIT
TITLE: HUD HP is linear; getPlayerBaseStats HP is compounding
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 3400-3406; progression.ts 74-80
CURRENT_BEHAVIOUR: HUD maxHp = floor(100×(1+(L-1)×0.05)). getPlayerBaseStats = round(100×1.05^(L-1)). L25 HUD 220 vs compounding 323.
DESIRED_BEHAVIOUR: One formula. Prefer linear to match enemy combat HP.
EVIDENCE: Both live. Battle AP/MP come from getPlayerBaseStats; HP bar from linear.
RECOMMENDED_ACTION: Point HUD and persist at the same helper.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — death respawn 50% of linear
VALIDATION_REQUIRED: L1=100, L10 HUD=145, respawn 50% of the chosen formula
STATUS: OPEN

---

ACTION_ID: BAL-VICTORY-FLOOR-OVER-MAXHP
TITLE: Victory HP floor exceeds linear max from L10
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: longHorizonSim.ts victoryHpFloor; WorldExploration handleBattleEnd heal
CURRENT_BEHAVIOUR: Floor 50+L×10. Linear max floor(100×(1+(L-1)×0.05)). L10: 150 > 145. PR #386 caps this; not in HEAD.
DESIRED_BEHAVIOUR: min(floor, maxHp).
EVIDENCE: longHorizonSim.test.ts asserts L10 floor > max. HEAD still uncapped.
RECOMMENDED_ACTION: Merge or reimplement #386. Do not raise maxHp to match the floor.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L10 post-victory HP ≤ 145
STATUS: OPEN

---

ACTION_ID: BAL-RECAP-XP-BAR-WRONG
TITLE: Recap XP bar used the wrong leftover math
CATEGORY: hud
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 12451 recapXpAfterGrant
CURRENT_BEHAVIOUR: Recap uses recapXpAfterGrant (leftover + grant via applyXpDelta).
DESIRED_BEHAVIOUR: Already the persist leftover model.
EVIDENCE: Re-read 2026-09-25: recapXpAfterGrant still the call site.
RECOMMENDED_ACTION: None.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: N/A
VALIDATION_REQUIRED: none
STATUS: RESOLVED

---

ACTION_ID: BAL-FAMILY-COMBAT-IDENTITY
TITLE: Family res 0.05–0.75 is treated as percent
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spawnPolicy.ts FAMILY_STAT_MULTS; WorldExploration generateEnemies; computeDamage
CURRENT_BEHAVIOUR: Family overwrites res to 0.1–0.75. Combat 1−res/100 → 0.1–0.75% reduction. hpMult is applied to spawn HP then overwritten by calcEnemyMaxHp.
DESIRED_BEHAVIOUR: Store family res as 10–75 (percent) **or** divide by 1 not 100. Apply hpMult to combat HP.
EVIDENCE: wraith_bishop res 0.1, iron_golem-style tanks 0.75. Combat treats 0.75 as 0.75%.
RECOMMENDED_ACTION: Multiply family res by 100 at write, or change the combat divisor for that field only after a unit test.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — family TTK
VALIDATION_REQUIRED: iron-style family takes ~25–40% less kit damage, not 0.75%
STATUS: OPEN

---

ACTION_ID: BAL-DOMINATED-SPELLS
TITLE: Several starter spells are strictly worse than a sibling
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts starterSpells
CURRENT_BEHAVIOUR: Venom Strike 3 AP 4×3 vs Poison Arrow 2 AP 4×3. Iron Skin 3 AP same +30% RES as Shield 2 AP. Expose/Shadow Veil extras never apply so they lose to Cursed Wound 22 dmg.
DESIRED_BEHAVIOUR: Each sibling needs a unique live lever (range, CD, extra that actually applies).
EVIDENCE: Table above.
RECOMMENDED_ACTION: After CC wiring (#555) re-score. Until then retire or buff the dominated extras, not the winners.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: no 3-AP spell with identical extra and worse payload than a 2-AP sibling
STATUS: OPEN

---

ACTION_ID: BAL-SUMMON-UI-COST-10X
TITLE: Summon upgrade UI advertises 10× the canister charge
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellUpgrade.ts spellUpgradeUiSpend; main.mo upgradeSpell
CURRENT_BEHAVIOUR: Canister 10×2^level. UI shows 10× that for summons. Wallet debit uses canister spend.
DESIRED_BEHAVIOUR: UI === canister.
EVIDENCE: AGENTS.md; spellUpgrade.ts comment on 10×.
RECOMMENDED_ACTION: Show canister cost. Do not actually charge 10× without a wallet retune.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW — display vs persist already diverges toward the cheaper charge
VALIDATION_REQUIRED: summon L0→1 costs 10 Doka on HUD and canister
STATUS: OPEN

---

ACTION_ID: BAL-DEATH-DOKA-40
TITLE: Death deletes 40% of all Doka
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: deathPenalty.ts DEATH_DOKA_PENALTY_RATE=0.4
CURRENT_BEHAVIOUR: 40% of wallet, 20% leftover XP. After a 100_000 jackpot, death costs 40_000 — more than any shop sink.
DESIRED_BEHAVIOUR: 10–20% Doka **or** tax only combat-earned Doka above a floor.
EVIDENCE: Rate constants. Jackpot persist 100_000.
RECOMMENDED_ACTION: Retune after lottery. Do not lower death tax while jackpots remain.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — primary Doka sink
VALIDATION_REQUIRED: unpaid death path still applies 20/40 if persist fails
STATUS: OPEN

---

ACTION_ID: BAL-AP-GROWTH-UNREACHABLE
TITLE: Persist AP cap 20 blocks the last formula point
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard.mo MAX_PERSISTED_AP=20; maxPersistedAp
CURRENT_BEHAVIOUR: 8+floor(L/25). Hits 20 at L300, 21 at L325 then clamp 20. XP wall makes L300 unreachable in practice.
DESIRED_BEHAVIOUR: Either raise the cap or accelerate AP so 10–12 is reachable by L40.
EVIDENCE: PLAYER_BASE_AP 8, threshold 25, cap 20.
RECOMMENDED_ACTION: +1 AP every 10 levels, cap 12, if the XP wall is also addressed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — Timestep / hard_3
VALIDATION_REQUIRED: L1 persist AP 8 (create 10 grandfathered); L25 persist 9
STATUS: OPEN

---

ACTION_ID: BAL-VOID-COLLAPSE-UNREACHABLE
TITLE: void_collapse is a built-in id with no starter definition
CATEGORY: content
PRIORITY: P2
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: adminSafety.ts isBuiltInSpellId; spellData.ts; SpellbookModal color map
CURRENT_BEHAVIOUR: Cannot delete void_collapse; it is not in starterSpells. Players never own it unless admin injects it.
DESIRED_BEHAVIOUR: Ship it in a gated catalog **or** stop treating it as built-in.
EVIDENCE: isBuiltInSpellId("void_collapse") true; starterSpells has no matching id.
RECOMMENDED_ACTION: Add a gated spell or remove the built-in lock.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: admin cannot delete if kept built-in; player bar does not list it at L1
STATUS: OPEN

---

ACTION_ID: BAL-DUNGEON-MULT-FORMULA-SPLIT
TITLE: Frontend Doka chain mult ≠ backend store formula; XP not multiplied
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: portalRules.ts DUNGEON_DOKA_MULTIPLIERS; rewardResolver PREAPPLIED_REWARD_MULTIPLIER=1; main.mo dungeon store
CURRENT_BEHAVIOUR: Live Doka ×[1,1.5,2,2.5,3,4]. Live XP ×1. Backend record 1+depth×0.25.
DESIRED_BEHAVIOUR: One table. Decide whether XP should scale (today it does not).
EVIDENCE: dungeonDokaMultiplierFor vs PREAPPLIED_REWARD_MULTIPLIER.
RECOMMENDED_ACTION: Document XP×1 as intended or multiply XP on the persist path with the same table.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — dungeon EV
VALIDATION_REQUIRED: depth 5 Doka ×4 on persist; XP either ×1 or ×4 consistently
STATUS: OPEN

---

ACTION_ID: BAL-TITAN-VIGOR-FLAT-1000
TITLE: Titan's Vigor adds +1000 HP to every combatant
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: mapModifiers.ts titans_vigor; gameConstants MAP_MODIFIER_TITANS_VIGOR_HP_BONUS=1000
CURRENT_BEHAVIOUR: +1000 HP all combatants; damage × uniform 1..5. L1 enemy ~75→1075. Player 100→1100.
DESIRED_BEHAVIOUR: +20–40% maxHP, damage roll 1.2–1.8×, **or** +1000 only on enemies.
EVIDENCE: onBattleStart loop over combatants; onDamageDealt ×1..5.
RECOMMENDED_ACTION: Percent HP. Keep the damage roll but cap at 2×.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — modifier identity
VALIDATION_REQUIRED: L1 enemy HP after modifier in 90–150 if percent, not 1075
STATUS: OPEN

---

ACTION_ID: BAL-JACKPOT-HEAL-1-DOKA
TITLE: Jackpot heal restores full HP for 1 Doka
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: itemShop.ts JACKPOT_HEAL_DOKA_COST=1
CURRENT_BEHAVIOUR: 0.5% of Doka→HP clicks, cost 1, full bar. Overworld 1:3 already dominates potions.
DESIRED_BEHAVIOUR: Cost 10–30 **or** heal 30–50%.
EVIDENCE: JACKPOT_HEAL_DOKA_COST=1; achievement jackpot_heal +200 Doka.
RECOMMENDED_ACTION: Raise cost after lottery retune so it is not a rounding-error full heal.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: cannot jackpot-heal in battle if that remains the rule
STATUS: OPEN

---

ACTION_ID: BAL-BUFF-SHOP-OVERWORLD-DOMINATED
TITLE: Potions cost 5× overworld Doka→HP until ~L81
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BuffShop.tsx BUFF_ITEMS; WorldExploration Doka→HP 1:3
CURRENT_BEHAVIOUR: Health Potion 50 Doka for 30% (30 HP at L1) = 1.67 Doka/HP vs 0.33 overworld. Battle Elixir 80 vs Timestep 0.
DESIRED_BEHAVIOUR: Potions cheaper **or** overworld 1:3 disabled in dungeon/boss, **or** potions unique (cleanse, shield).
EVIDENCE: 50 Doka / 30 HP = 1.67; break-even at 150 HP = L81 30%.
RECOMMENDED_ACTION: Cut potion prices to 10–15 **or** keep prices and kill overworld 1:3 in combat-adjacent maps.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — wallet sinks
VALIDATION_REQUIRED: L1 potion not strictly worse than 17 overworld clicks for the same HP
STATUS: OPEN

---

ACTION_ID: BAL-TWO-SPELL-CATALOGS
TITLE: Admin/backend spell ids diverge from starterSpells
CATEGORY: content
PRIORITY: P3
CONFIDENCE: MEDIUM
FILES_OR_SYSTEMS: spellData.ts; backend admin.mo default bosses fireball/cursed_gust
CURRENT_BEHAVIOUR: Boss seeds reference fireball, cursed_gust, entangle — not starter ids. Live kits look up starterSpells.
DESIRED_BEHAVIOUR: One catalog or an explicit alias map.
EVIDENCE: admin.mo pale_archbishop spellPoolIds vs starterSpells ids.
RECOMMENDED_ACTION: Alias table or rewrite seeds to starter ids after kit-zone fix.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — boss kits empty if lookup fails
VALIDATION_REQUIRED: bishop boss has ≥1 damaging spell in combat
STATUS: OPEN

---

ACTION_ID: BAL-MP-UNUSED-ON-STARTERS
TITLE: Every starter mpCost is 0
CATEGORY: combat
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts
CURRENT_BEHAVIOUR: mpCost BigInt(0) on all 32 starters. MP is movement/timestep only.
DESIRED_BEHAVIOUR: Put 1–2 MP on 3–5 spells **or** stop showing MP as a spell cost.
EVIDENCE: Full catalog grep: no non-zero mpCost in starterSpells.
RECOMMENDED_ACTION: Optional. Do not add MP costs until Timestep is retuned.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: none until a cost is added
STATUS: OPEN

---

ACTION_ID: BAL-BOSS-RUSH-TABLE-UNPAID
TITLE: Advertised Boss Rush room Doka/XP are not persisted
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: useBossRush.ts BOSS_RUSH_ROOMS; bossRushProgress.ts completeBossRushRoom(0,0)
CURRENT_BEHAVIOUR: Table sums 21_000 Doka / 8_500 XP. completeBossRushRoom ignores client rewards. Persist is kill XP + max(5, floor(L×1.5)) Doka/kill.
DESIRED_BEHAVIOUR: Pay the table through applyRewards after currentRoom advances, **or** stop showing the table numbers.
EVIDENCE: AGENTS.md; frontend already passes 0,0.
RECOMMENDED_ACTION: Persist table on room advance **or** replace UI with “kill loot only.”
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — rush EV
VALIDATION_REQUIRED: room 0 clear credits 500 Doka if table is paid; none if UI is stripped
STATUS: OPEN

---

ACTION_ID: BAL-STARTER-KIT-NO-GATING
TITLE: All 32 starterSpells are forced innate
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 2396-2404; spellData.ts isBaseSpell
CURRENT_BEHAVIOUR: Every starter is isBaseSpell true. No discovery, no loadout cap beyond the 8-spell achievement.
DESIRED_BEHAVIOUR: 4–6 L1 innates; rest gated by level/boss/achievement.
EVIDENCE: map over starterSpells sets isBaseSpell true.
RECOMMENDED_ACTION: Gate summons, Timestep, Sacrifice, Chain Lightning. Keep Strike + one heal + one nuke.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — new-player power
VALIDATION_REQUIRED: L1 bar < 10 spells; gated ids not castable
STATUS: OPEN

---

ACTION_ID: BAL-SUMMONER-SATURATION
TITLE: Enemy summoner chance hits 100% at L44
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants.ts ENEMY_SUMMONER_CHANCE_BASE=0.12 PER_LEVEL=0.02; WorldExploration.tsx 11932-11938
CURRENT_BEHAVIOUR: 0.12+L×0.02. L1=14%, L44=100%. Enemy cap 2 summons.
DESIRED_BEHAVIOUR: Cap at 25–40% **or** scale with zone not player level.
EVIDENCE: 0.12+44×0.02=1.00.
RECOMMENDED_ACTION: min(0.35, 0.08+0.01×zone). Keep ENEMY_SUMMON_CAP=2.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — board clutter
VALIDATION_REQUIRED: L1 still can roll a summoner; L50 not 100%
STATUS: OPEN

---

ACTION_ID: BAL-HARD3-AP8-FREE
TITLE: hard_3 “≤8 AP per turn” is free until L25
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts hard_3; getPlayerBaseStats AP 8
CURRENT_BEHAVIOUR: maxApUsedInTurn <= 8. Player max AP is 8 until L25. Timestep restores AP but the spend that turn can still be tracked — if Timestep is 0 AP, the constraint stays free.
DESIRED_BEHAVIOUR: ≤5 AP **or** “no Timestep” **or** scale cap with maxAp-2.
EVIDENCE: PLAYER_BASE_AP=8; hard_3 rewards 150 Doka + 450 XP.
RECOMMENDED_ACTION: Cap at 5 or exclude until AP > 8.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L1 6-AP turn fails; 4-AP turn succeeds
STATUS: OPEN

---

ACTION_ID: BAL-BOSS-CATALOG-SPLIT
TITLE: Frontend vs backend boss HP and reward multipliers differ
CATEGORY: content
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: types/bossDefaults.ts; backend lib/admin.mo defaultBossConfigs
CURRENT_BEHAVIOUR: FE 60–600 HP, reward ×5 Doka / ×3 XP. BE 100–800 HP, ×10–50 / ×8–40. Live combat uses FE if that catalog is loaded.
DESIRED_BEHAVIOUR: One seed.
EVIDENCE: pale_archbishop BE hp 500 vs FE sheets 60–600 range.
RECOMMENDED_ACTION: Generate FE from BE or vice versa. Guide curve stays UI-only until wired.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — boss TTK
VALIDATION_REQUIRED: same id has same hp and multipliers in both catalogs
STATUS: OPEN

---

ACTION_ID: BAL-IAP-PACKAGES-ORPHANED
TITLE: ShopPackage ladder is seeded but processPendingPurchases is a no-op
CATEGORY: economy
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: main.mo processPendingPurchases; DokaGameKeyShop
CURRENT_BEHAVIOUR: Returns 0. Player path is GameKey.
DESIRED_BEHAVIOUR: Delete the ladder **or** wire it. Do not leave two IAP stories.
EVIDENCE: AGENTS.md processPendingPurchases no-op.
RECOMMENDED_ACTION: Keep GameKey; hide package UI.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: Buy Doka does not call initiatePurchase
STATUS: OPEN

---

ACTION_ID: BAL-GAMEKEY-MINT-UNBOUNDED
TITLE: GameKey grant is not the applyRewards 100_000 ceiling
CATEGORY: economy
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: adminGuard validateDokaGrant 1–10_000_000; redeemGameKey
CURRENT_BEHAVIOUR: Admin can approve up to 10_000_000 Doka on a key. applyRewards rejects >100_000. Redeem credits the **caller**, not the requester.
DESIRED_BEHAVIOUR: Align grant cap with persist (100_000) **or** document GameKey as the unbounded mint.
EVIDENCE: validateDokaGrant vs applyRewards dokaDelta > 100_000.
RECOMMENDED_ACTION: Cap GameKey at 100_000 unless a designer signs off on 10M.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — IAP packs
VALIDATION_REQUIRED: 100_001 grant rejected; 100_000 redeem commits
STATUS: OPEN

---

ACTION_ID: BAL-CREATE-VITALS-MISMATCH
TITLE: Create AP 10 / MP 5 overwritten by battle 8 / 4
CATEGORY: progression
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; progression.ts getPlayerBaseStats
CURRENT_BEHAVIOUR: Forge shows 10/5. First battle uses 8/4. persistApWriteCap grandfathers stored 10.
DESIRED_BEHAVIOUR: Forge shows 8/4 **or** battle uses 10/5.
EVIDENCE: startingChampionStats ap 10; PLAYER_BASE_AP 8.
RECOMMENDED_ACTION: Point forge at getPlayerBaseStats(1).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: create payload AP matches first battle AP
STATUS: OPEN

---

ACTION_ID: BAL-BOSS-GUIDE-VS-COMBAT
TITLE: Boss Guide 1.08^Δ is UI-only
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: BossGuideModal.tsx; progression.ts boss level-diff helper
CURRENT_BEHAVIOUR: Guide shows a curve. Combat uses catalog baseStats.hp, not 1.08^Δ.
DESIRED_BEHAVIOUR: Wire the curve **or** remove it from the guide.
EVIDENCE: progression.ts documents the curve; battle start uses bossConf.baseStats.hp ?? calcEnemyMaxHp.
RECOMMENDED_ACTION: Pick one source. Do not apply 1.08 on top of catalog HP without a retune.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — boss TTK
VALIDATION_REQUIRED: guide HP equals combat HP for Δ=0 and Δ=5
STATUS: OPEN

---

ACTION_ID: BAL-RANGE-CAP-FAVORS-STRIKE
TITLE: maxSpellRange 5 grows Strike 1→5 by L40; Frost 4→5 at L10
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: levelUpConfig maxSpellRange=5, spellRangeGrowthLevels=10
CURRENT_BEHAVIOUR: Range grows toward 5 every 10 levels. Strike (1) gains +4. Frost (4) gains +1. Melee identity disappears.
DESIRED_BEHAVIOUR: Physical stays 1–2 **or** growth only applies to spells with range ≥ 2.
EVIDENCE: physical_attack range 1; starter-frost range 4; cap 5.
RECOMMENDED_ACTION: Exclude isPhysical from range growth.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — Attack Nearest / Striker
VALIDATION_REQUIRED: L40 Strike range still 1 or 2; Frost 5
STATUS: OPEN

---

ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player resolvePlayerCast never applies debuffStat
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast; queued PRs #528 #555 not in HEAD
CURRENT_BEHAVIOUR: Frost MP−1, Weaken −30% dmg, Slow −2 MP, Expose res_sp are description-only on HEAD. Damage still lands. Weaken with damage 0 still deals 1 via max(1, floor(0)).
DESIRED_BEHAVIOUR: Apply debuffStat after a successful hit. Additive AP/MP vs multiplicative dmg/res as statusEffects.ts already does.
EVIDENCE: No applyEffect in the damage loop. Heal/buff paths do apply buffs (except heal CHC — separate ID).
RECOMMENDED_ACTION: Land #555/#528 or equivalent. Do not retune Weaken AP until the extra is live.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — enemy TTK, Haste/Slow stacking
VALIDATION_REQUIRED: Frost Bolt applies MP−1; Weaken 0.7 dmg on the next enemy hit; Slow additive −2 MP
STATUS: OPEN

---

ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive-cap; enemy cap is 2
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: gameConstants ENEMY_SUMMON_CAP=2; spellEngine.ts summon branch; spawnPlayerSummon
CURRENT_BEHAVIOUR: AP is charged. No player alive-cap. 8 AP can drop Wolf+Archer+Wisp (3+3+2).
DESIRED_BEHAVIOUR: Player cap 1–2 alive, matching enemy, **or** rising cost per living summon.
EVIDENCE: ENEMY_SUMMON_CAP exists; no PLAYER_SUMMON_CAP. stale comment at spellEngine.ts 817 says no-AP (wrong).
RECOMMENDED_ACTION: Cap 2. Reject spawn with abort (no AP) when full.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — board state, pacifist_run
VALIDATION_REQUIRED: third summon aborts; AP not spent; enemy cap still 2
STATUS: OPEN

---

ACTION_ID: BAL-FALLBACK-CRUSH-OUTSCALES-KIT
TITLE: Fallback Crush scales with enemy level; kit Strike does not
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 16710-16721; spellData.ts physical_attack damage 10
CURRENT_BEHAVIOUR: Kit physical_attack is 10 forever. Fallback Crush = 12 × max(1, enemy.level/5) × enrage. L1: 12 vs 10. L10: 24 vs 10. L25: 60 vs 10. Enrage ×6 → Crush 360 at L25.
DESIRED_BEHAVIOUR: Fallback uses the same Strike formula as the kit, **or** kit Strike gains the Crush level term. Missing the spell must not deal more than landing it.
EVIDENCE: 2026-09-25 crush vs Strike. Enemy kit path scales once at upgrade 0.
RECOMMENDED_ACTION: Point fallback at physical_attack + calcScaledDamage, or add a caster-level term to Strike in the same pass as BAL-DMG-NO-LEVEL-SCALE.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — enemy TTK, charger tests
VALIDATION_REQUIRED: enemy L1/L10/L25 Strike vs Crush; enrage ×6
STATUS: OPEN

---

ACTION_ID: BAL-HAZARD-FLAT-DAMAGE
TITLE: Lava/spikes are flat HP and bypass RES
CATEGORY: combat
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11429-11469
CURRENT_BEHAVIOUR: Lava 8–15 plus Burning 3/turn × 3. Spikes 5–10. Direct setCharacterStats; not playerTakesDamage. L1 lava up to ~15% of 100 HP; L25 lava 15 is ~7% of 220. Shield Charm / RES do not apply. Challenge damage **is** recorded.
DESIRED_BEHAVIOUR: Scale with linear maxHP (e.g. 8–12% per lava step) and route through playerTakesDamage so RES/shield work. Keep challenge recording.
EVIDENCE: 11429 comment `8-15`; 11469 `5-10`; playerTakesDamage is 3424+ and unused here.
RECOMMENDED_ACTION: Percent of maxHP + playerTakesDamage. Recheck easy_3 / hard_1 after the change.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — Untouchable / under-30 / under-50
VALIDATION_REQUIRED: lava hits RES; L1 vs L25 share of maxHP; challenge totalDamage increments
STATUS: OPEN

---

ACTION_ID: BAL-HEAL-ADVERTISED-BUFF-DEAD
TITLE: Blood Mend / Rallying Cry never apply CHC; 0.15 would invert if wired as a factor
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts starter-heal and spell-rallying-cry; spellEngine.ts 655-672; statusEffects.ts getStatModifier
CURRENT_BEHAVIOUR: Heal branch heals and returns. buffStat chc / buffModifier 0.15 never applyEffect. Shield uses 1.3 as a multiplicative factor. getStatModifier multiplies CHC, so 0.15 would be −85% CHC.
DESIRED_BEHAVIOUR: Apply +15 percentage points CHC for 2 turns, **or** store 1.15 and multiply. Heal crit stays 2× HP (not the damage double-pass).
EVIDENCE: 2026-09-25 read of heal branch vs Shield branch 697-710. Encoded 0.15 vs 1.3.
RECOMMENDED_ACTION: One encoding for percent buffs (always 1+p). Apply from the heal branch before return. Tests: Mend at CHC 1 → effective 16 (additive) or ×1.15 (factor), never ×0.15.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — crit rate if double-pass remains
VALIDATION_REQUIRED: Blood Mend does not change CHC today (document); after fix, next Strike crit chance matches the chosen encoding; HP still 12/24
STATUS: NEW

---

ACTION_ID: BAL-ENEMY-MITIGATION-UNCAPPED
TITLE: Enemy RES/SR can roll 100+ and floor kit damage at 1
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts getEnemyBaseStats 175-186; spellEngine.ts computeDamage 393-407
CURRENT_BEHAVIOUR: res roll [2, 4+L×0.9]×pieceMult with no cap. Rook max RES 100 at L78; king 107 at L107. SR similar (king 100 at L96). Hits are max(1, round(dmg×(1−res/100)×(1−sr/100))). Sacrifice ignores this.
DESIRED_BEHAVIOUR: Cap effective RES and SR at 60–75, **or** retune rolls to a 0–40 band.
EVIDENCE: 2026-09-25 closed-form table. Family identity bug is separate (0.05–0.75 written as percent).
RECOMMENDED_ACTION: Clamp after the roll. Do not mix with family×100 in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — late tanks
VALIDATION_REQUIRED: L78 rook res ≤ cap; Strike still deals ≥ 25% of raw; Sacrifice unchanged
STATUS: NEW

---

ACTION_ID: BAL-TIER-THREE-MORE-UNUSED
TITLE: threeOrMorePercent config is ignored; leftover band is 10%
CATEGORY: spawn
PRIORITY: P3
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts DEFAULT_TIER_CONFIG and pickEnemyLevelFromTiers 72-97
CURRENT_BEHAVIOUR: threeOrMorePercent=5 never read. Leftover 100-60-20-10=10% goes to dist 3..6. L1 cannot down-tier.
DESIRED_BEHAVIOUR: Honor the 5% field; do not dump remainder into the farthest band.
EVIDENCE: `_threeMore` is computed from leftover, config key unused. L1 MC 5.5% in 21–30 plus ~6% 31+.
RECOMMENDED_ACTION: `const three = min(leftover, cfg.threeOrMorePercent)` and park unused percent in same-tier. Combine with BAL-ENEMY-TIER-OUTLIER cap.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: with default config, far-tier rate is 5% not 10%; admin 0% far-tier actually 0
STATUS: NEW

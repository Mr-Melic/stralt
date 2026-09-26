# Stralt quantitative game-balance analysis — 2026-09-26

**Role:** quantitative game-balance analyst (cron `0 */48 * * *`).
**HEAD:** `0f5363f` (`Merge pull request #332`). Unchanged since 2026-09-21.
**Telemetry:** none. Synthetic only (Monte Carlo 8k spawn rolls; live formulas).
**This run does not change balance numbers.** Combat, XP, spawn, shop, and Doka constants were not edited.

Prior passes: 2026-09-25 / 09-24 / 09-23 / 09-22 / 09-21 at `0f5363f`; 2026-09-02 at `58302bc`; 2026-09-01 at `dd275aa`.
Open siblings: PR #582 (`GAME_BALANCE_2026-09-25.md`), PR #505 (`GAME_BALANCE_2026-09-24.md`), PR #472 (`GAME_BALANCE_2026-09-23.md`). This file is a new dated report; it does not overwrite those PRs.

Durable IDs stay `BAL-*`. Ledger: [`ACTION_IDS_BAL_2026-09-26.md`](./ACTION_IDS_BAL_2026-09-26.md).

---

## Method

Authoritative sources (not comments, not `backend_extended`):

| Topic | Live formula |
| :--- | :--- |
| XP N→N+1 | `100 * 2^(N-1)` — `xpCurve.ts`; `main.mo` `applyRewards` |
| Kill XP | `sum(enemy.level * 20)` — `rewardResolver.ts` `computeVictoryExp` |
| **Live victory XP** | that sum **× 1.5 always** (`boostMode` stuck at `"xp"`) |
| Portal XP | 10 (`PORTAL_TRANSITION_XP`) |
| `applyRewards` ceilings | Doka 100_000 / XP 500_000 |
| Spawn level | `pickEnemyLevelFromTiers` tierSize=10, 60/20/10/**remainder 10** plus ±1 variance 15% |
| Player max HP (HUD) | `floor(100 * (1 + (L-1)*g))` with `g = statGrowthPercent/100` — `WorldExploration.tsx` 3400–3406 |
| Player battle AP/MP | `getPlayerBaseStats`: `8 + floor(L / apMpGrowthEveryNLevels)` / `4 + same`; persist cap 20 |
| Enemy combat HP | `floor(50 * (1 + (L-1)*0.05))` — overwrites spawn HP |
| Spawn HP / placeholder melee | `L*8+20` / `L*2+3` — unused once battle kits fire |
| Spell scale (function) | `floor(base * 1.03^upgrade)`; **caster level unused**; admin `spellDmgGrowthPercent` unused |
| Live player hit | that scale **twice**, plus crit **twice** (`BAL-PLAYER-DMG-DOUBLE-PASS`) |
| Spell fail | 20% − 0.1%/level; physical exempt |
| Victory Doka | per-enemy lottery × `enemy.level`; persist clamped; Doka boost **never** applied |
| Death | 20% leftover XP, 40% all Doka |
| Spell upgrade | `baseCost * 2^currentLevel` (hardcoded ×2); admin `spellLevelingCostMultiplier` unused |
| Dungeon Doka FE | `[1, 1.5, 2, 2.5, 3, 4][depth]` |
| Dungeon XP persist | not chain-multiplied (`PREAPPLIED_REWARD_MULTIPLIER=1`) |
| Dungeon BE store | `1 + depth*0.25` — not the live payout |
| Boss Rush persist | `max(5, floor(L*1.5))` Doka/kill + kill XP; room table unpaid |
| Challenges | easy 50–75 Doka / 0 XP; hard 150–200 Doka + 400–500 XP; legendary 400–500 Doka + 800–1000 XP |
| Shrine altar | 300 Doka one-shot; ground spawn base 5; complete bonus `maxDepth*50` |
| Player IAP | GameKey, 100 Doka/€; admin grant cap 10_000_000 |

Normalized metrics:

- **DPA** = payload / AP at upgrade 0, no crit (advertised).
- **Live DPA** = damage that actually writes HP after the double pass (same inputs).
- **E[DPA]** = DPA × (1 − failChance); Strike failChance = 0; L1 failChance = 20%.
- **HPA** = heal / AP.
- **DoT-DPA** = (tick × duration) / AP, delayed.
- **XP/fight (live)** = `3 × meanEnemy × 20 × 1.5` for a typical 3-pack (boost locked).

Monte Carlo: 8000 rolls, default tier config, `random.seed(20260926)`, no `localStorage` override.

Queued PRs **not in HEAD** that would change some CC findings if they merge first: #528 (Weaken/Slow on highlighted hostiles), #555 (`debuffStat` after player damage hits), #386 (victory HP floor cap). This report is vs `origin/main` `0f5363f`.

---

## Ledger this run

| ID | Priority | Status |
| :--- | :--- | :--- |
| BAL-DOKA-LOTTERY-BILLION | P0 | OPEN |
| BAL-XP-EXPONENTIAL-WALL | P0 | OPEN |
| BAL-DMG-NO-LEVEL-SCALE | P0 | OPEN |
| BAL-PLAYER-DMG-DOUBLE-PASS | P0 | OPEN |
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
| BAL-FALLBACK-CRUSH-OUTSCALES-KIT | P1 | OPEN |
| BAL-HAZARD-FLAT-DAMAGE | P2 | OPEN |
| BAL-HEAL-ADVERTISED-BUFF-DEAD | P1 | OPEN (was NEW 09-25) |
| BAL-ENEMY-MITIGATION-UNCAPPED | P1 | OPEN (was NEW 09-25) |
| BAL-TIER-THREE-MORE-UNUSED | P3 | OPEN (was NEW 09-25) |
| **BAL-BOOST-LOCKED-XP-150** | P1 | **NEW** |
| **BAL-LEVELUP-KNOBS-DEAD** | P2 | **NEW** |

---

## What moved since 2026-09-25

Formulas and HEAD did not move. This pass traced **victory boost wiring** and **admin LevelUpConfig knobs vs live combat/upgrade**.

1. **Victory XP is always ×1.5; the Doka boost is unreachable.** `App.tsx` 360–362 / 497–501 owns a toggle and passes it to `GameFlow`. `GameFlow.tsx` 48–49 discards both props (`_boostMode` / `_onBoostToggle`). `BoostToggle.tsx` has **zero importers**. `WorldExploration.tsx` 2098 holds `boostMode` at `"xp"` with `_setBoostMode` unused. `handleBattleEnd` 12374–12377 therefore always does `derivedBaseXp * 1.5`; the `boostMode === "rewards"` branch at 12438–12441 never runs. Dead-code audits already called the unused pill; they did not file a `BAL-*` or correct fights-to-level. New ID `BAL-BOOST-LOCKED-XP-150`. Prior scenario tables used unboosted XP and **overstated** fights/level by 50%. The exponential wall remains.
2. **Two admin LevelUp knobs are display-only.** `upgradeSpell` (`main.mo` 1017–1023) does `cost := cost * 2` in a loop; `spellLevelingCostMultiplier` (default 2.0, admin 1–10) is never read. `calcScaledDamage` / `calcScaledDamageInline` hardcode `1.03 ** upgrade`; `spellDmgGrowthPercent` (default 3) is never read. Canister `apMpLevelThreshold` is not the field `getPlayerBaseStats` reads (`apMpGrowthEveryNLevels`); a `localStorage` blob saved from admin can change the Motoko name and leave battle AP on the TypeScript default 25. New ID `BAL-LEVELUP-KNOBS-DEAD`.

Re-verified unchanged:

- Double-pass player damage (`spellEngine.ts` 882–892 then `calculatePlayerDamage` → `WorldExploration.tsx` 3308–3339). Frost L0 crit intended 40, live **80** (crit applied twice on an identity scale).
- `buildEnemyKit(piece, currentMap.levelZone)` still passes `{name,minLevel,maxLevel}` (`WorldExploration.tsx` 11920) → zone-0 kits.
- `resolvePlayerCast` still never writes `debuffStat` on HEAD. Queued #528 / #555 would partially resurrect CC; they are not merged.
- Summon AP **is** deducted (`castResultSpendsAp("summon") === true`). No alive-cap.
- Recap still uses `recapXpAfterGrant` (`BAL-RECAP-XP-BAR-WRONG` RESOLVED).
- Player GameKey remains 100 Doka/€. Admin grant cap 10_000_000 still bypasses `applyRewards` 100_000.
- PR #386 still not in HEAD. Floor `50 + L×10` exceeds linear max from **L10** (150 vs 145).
- Lottery comments still say `0.0001%` while `roll < 0.0001` is **0.01%**.
- Heal CHC extras still dead; rook RES still hits 100 at L78; `threeOrMorePercent` still unused.

---

## Scenario snapshot (live spawn, 8k rolls, seed 20260926, typical 3-pack)

XP/fight columns: **raw** = `3 × meanL × 20`; **live** = raw × 1.5 (boost locked). Fights/level uses **live**. Persist Doka EV is unboosted (Doka branch dead).

| Band | Player L | Mean enemy L | p(enemy>player) | XP/fight raw | XP/fight live | Fights/level (live) | Combat mean eHP | Sac (full) | p(sac oneshot) | Persist Doka EV (3) | Victory floor > maxHP |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| Early | 1 | 11.10 | 0.933 | 666 | **999** | **0.10** | 75 | 60 | 0.35 | 259 | no |
| Mid | 8 | 11.27 | 0.444 | 676 | **1015** | **12.6** | 75 | 81 | 0.75 | 263 | no |
| Mid | 10 | 11.18 | 0.294 | 671 | **1006** | **50.9** | 75 | 87 | 0.81 | 261 | **yes** |
| Late | 15 | 17.93 | 0.510 | 1076 | **1614** | **1015** | 92 | 102 | 0.76 | 400 | yes |
| Stress | 25 | 26.96 | 0.500 | 1617 | **2426** | **6.92e5** | 115 | 132 | 0.79 | 586 | yes |

L1 histogram (10-level buckets): 70.1% in 1–10, 18.4% 11–20, 5.4% 21–30, ~6.1% 31+. Min 1, max 80.

Same-level 4-pack (lower bound, not live spawn, **with** 1.5×): L1 120 XP / 0.83 fights; L10 1200 XP / 42.7 fights; L15 1800 XP / 910 fights.

Cumulative leftover-scale 1→15 = 1,638,300. HUD `xpForNextLevel` saturates at L48. Persist still uses bigint.

Challenge at L1 if completed: `hard_1` +500 XP → L3 leftover 200; `legendary_1` +1000 XP → L4 leftover 300. Challenge XP is **not** multiplied by the 1.5 boost (added after `finalExp` in the recap/persist sum).

Persist Doka EV per enemy ≈ `enemy.level * 6.88 + 10` (the +10 is `0.0001 * 100_000` from the clamped jackpot). Median ≈ `2 * enemy.level` (90.5% band is 1–3). Raw unclamped EV still ≈ `level × 50007`.

Doka Fever (`MAP_MODIFIER_DOKA_FEVER_REWARD_MULTIPLIER = 2`) doubles `rawDoka` **before** the 100_000 clamp (`WorldExploration.tsx` 12420–12427). Unclamped EV doubles; persist EV is still capped per call.

---

## Normalized ability comparison (starter catalog, L1, upgrade 0)

Fail-adjusted E[DPA] uses 20% fizzle. Physical Strike is exempt. **Live extra** = what `resolvePlayerCast` actually writes. Crit column is **live HP write** vs advertised 2× (no SP/RES).

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

Spell-upgrade live vs intended (Frost Bolt, no SP/RES, floor chain, this run):

| Spell level | Intended | Live write | Intended crit | Live crit |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 20 | 20 | 40 | **80** |
| 5 | 23 | 26 | 46 | **106** |
| 10 | 26 | 34 | 52 | **138** |
| 20 | 36 | 65 | 72 | **260** |

(09-25 table used 104/136 at L5/L10 live crit; those multiplied live-non-crit ×4. The live path crits **before** the second scale, so L5 is `scale(46)×2 = 106`.)

Upgrade cost is still `10 * 2^n` (L0→1 = 10; L9→10 = 5120; cumulative to L10 = 10_230). Changing admin `spellLevelingCostMultiplier` does nothing.

Healing vs wallet (overworld only):

| Source | Cost | HP | Doka per HP at L1 (max 100) |
| :--- | :--- | :--- | ---: |
| Overworld Doka→HP | 1 Doka : 3 HP | missing | **0.33** |
| Jackpot heal | 1 Doka | full bar | 0.01 |
| Health Potion | 50 Doka | 30% (30 HP) | 1.67 (**5×** overworld) |
| Greater Potion | 120 Doka | 70% | 1.71 |
| Blood Mend | 3 AP, 0 Doka | 12 | AP, not Doka |
| Break-even potion vs 1:3 | 50 Doka | 150 HP needed | L81 (maxHP 500, 30% = 150) |
| Shrine altar | 0 (path) | — | 300 Doka, ~116 fights of persist EV at L1 mean |

---

## Domain notes

### Player progression

Create writes AP 10 / MP 5 (`startingChampionStats.ts` 7–20). Battle init overwrites to 8 / 4 via `getPlayerBaseStats` (`WorldExploration.tsx` 12105–12116). HUD HP is linear +5%/level from `statGrowthPercent`; `getPlayerBaseStats` HP is compounding `100 × 1.05^(L−1)` and is **not** the HUD. Atk/res/init/chc/evasion persist but outgoing damage ignores ATK. SP 8 applies once, on the **second** pass. Create CHC is 5; combat fail is independent.

AP +1 / 25 levels **if** `apMpGrowthEveryNLevels` is present on the in-memory config. Persist cap `MAX_PERSISTED_AP = 20`. Formula `8 + floor(L/25)` hits 21 at L325 and is clamped. L15 still needs 1.6M cumulative leftover XP — the wall is XP, not AP. The locked 1.5× XP boost cuts mid-game fights ~33% vs the unboosted tables; it does not change the doubling per level.

All 32 `starterSpells` are forced `isBaseSpell: true`. There is no loadout economy.

### Enemy scaling

L1–10 share **tier 0**. Floor bias: at L1, down-tier clamps to 0. Mean enemy ≈ 11.1, 93% above the player, tail to 80. Combat HP at mean L11 ≈ 75 vs player 100.

Family 30% overwrites `res` to 0.05–0.75 (fraction). Combat uses `1 - res/100`, so 0.75 is **0.75%** reduction, not 75%. `hpMult` is applied to spawn HP then discarded by `calcEnemyMaxHp`.

Kits stay zone 0 (Strike / Frost). AI tier: 30% chance uniform 1–10 regardless of enemy level.

Backend `getEnemyHPForLevel` is unused by the live client.

**Kit vs fallback:** pawn/knight/rook kits deal Strike 10. If the AI takes the melee fallback, Crush = `12 × max(1, L/5) × enrage`. L10 Crush 24 vs Strike 10. L25 Crush 60 vs Strike 10 (`WorldExploration.tsx` 16710–16721).

**Mitigation cap:** rook RES max ≥ 100 at L78; king SR max ≥ 100 at L96. Hits floor at 1 HP. Difficulty **collapse** for kit damage; spike for Sacrifice (percent HP, ignores RES).

### Damage / AP efficiency

Character level still unused in `calcScaledDamage` (`combatMath.ts` 130–137) and `calcScaledDamageInline` (`spellEngine.ts` 1038–1043). Admin `spellDmgGrowthPercent` is unused. The live hole is the **double pass** on the player write. Enemy casts (`WorldExploration.tsx` 16464–16473) scale **once** and crit **once**. Player crits are twice as large as enemy crits of the same base.

Without Sacrifice / summons / Chain Lightning / the 4× crit, TTK still rises because enemy HP is linear and kit Strike is flat 10 — until RES/SR hit 100, then TTK becomes “chip 1 forever” unless Sacrifice is used.

### Healing efficiency

Heal spells use the heal branch (single scale, crit 2× heal) — they do **not** go through the double damage pass. Advertised CHC on Blood Mend / Rallying Cry is **dead**. Drain heal is `0.5 * live finalDmg`, so a crit Life Drain heals ~2× the advertised 5 because the damage under it was 4×.

Overworld 1:3 dominates potions until ~L81. Jackpot heal is 1 Doka full HP (0.5% of Doka→HP clicks).

### Summons

`getSummonBaseStats` at spell level 0: Wolf 80 HP / 2 AP; Sentinel `120 × 1.5 = 180` HP; Wisp `70 × 0.6 = 42` HP; Archer `60 × 0.7 = 42`; Bomber `50 × 0.5 = 25`. Lifespan 4 + floor(spellLevel/2) in the canonical function. Player can place Wolf+Archer+Wisp in one 8-AP turn (AP **is** charged). Enemy summon cap is 2; player has none. Enemy summoner chance `0.12 + playerLevel * 0.02` is 100% at L44. Upgrade UI 10× vs canister 1×.

### Crowd control

On the **player bar**, CC is a description string. Frost Nova still deals 15 AoE. Slow/Weaken never land from `resolvePlayerCast` on HEAD. Control mage is a dominated fantasy: the real levers are Sacrifice, Timestep, summons, Chain Lightning, and **crit 4×**.

### XP curve

Threshold doubles every level. With the locked 1.5×, L1 is still trivial (one 3-pack overshoots 1→2). L8 is ~13 live fights; L10 ~51; L15 ~1000. Challenge XP at L1 (`hard_1` 500, `legendary_1` 1000) still skips 1–3 levels in one recap (`BAL-CHALLENGE-XP-EARLY-BREAK`). Portal +10 is a rounding error vs a 999-XP pack.

### Doka acquisition

Lottery is the wallet. Persist EV ~259 per L1 3-pack. Unclamped jackpot is a 0.01% roll of `level × U(1, 1e9)` — comments still say 0.0001%. Achievements (50–1000) and shrine (300) are small vs a few persist packs, huge vs a failed persist-median (2×level). GameKey 100 Doka/€ ≈ 0.4 live L1 packs per euro — not dominant vs combat EV once persist works; still dominant vs BuffShop 1:3. Admin grant 10M vs `applyRewards` 100k.

Death takes **40% of all Doka** and 20% of leftover XP. One death after a clamped jackpot (`100_000`) deletes 40_000 — more than 150 L1 persist packs.

### Spell-upgrade costs

Canister: `10 * 2^n`. Summon UI advertises 10×. Admin multiplier ignored. Cumulative to L10 = 10_230 Doka ≈ 40 L1 persist packs — affordable because lottery EV is high. Live damage at L10 is already ~1.3× intended before the second crit.

### Shops

BuffShop potions are 5× worse Doka/HP than overworld 1:3 until ~L81. Battle Elixir +3 AP (80 Doka) vs Timestep (0 Doka, once). ShopPackage IAP catalog is orphaned; GameKey is the player path. Rename is a flat 100 Doka.

### Death penalties

20% leftover XP is mild at L1 (bar is 100) and irrelevant at L15 relative to the 1.6M threshold. 40% wallet is the real punishment and interacts with the lottery (a jackpot persist then death is a huge swing).

### Dungeon multipliers

Live Doka: 1 / 1.5 / 2 / 2.5 / 3 / 4 by depth. Extra enemies `[0,2,3,4,4,5]` and tier boost `[0,1,2,2,3,3]×10` levels. XP persist uses multiplier 1. Complete bonus `maxDepth*50` (250 at depth 5) is one persist pack. Backend store `1+depth*0.25` is not the payout.

### Boss Rush

Room table advertises 500–3000 Doka and 200–600 XP. Persist is kill XP + `max(5, floor(L*1.5))` Doka per kill. Table is unpaid (`completeBossRushRoom` ignores client rewards). Guide `1.08^Δ` is UI-only.

### Challenges

Easy: Doka only. Hard/legendary: 400–1000 XP, which at L1 is a multi-level skip and at L15 is <0.1% of the bar. `hard_3` (≤8 AP/turn) is free while the player has 8 AP (until L25). Opening player turn is counted.

### Achievements

50–1000 Doka, one-shot. `level_10` pays 300 after 51_200 leftover-scale XP into L10 (~51 live 3-packs) — dominated as a Doka source. `doka_10000` pays 1000 after the wallet is already large. `pacifist_run` 500 is two persist packs.

---

## Dominant / dominated / walls (this HEAD)

**Dominant:** Strike (fail-proof + range growth + 4× crit), Sacrifice (percent HP), Timestep (extra turn), player summons (no cap), Chain Lightning / clustered AoE, overworld 1:3 heal, lottery persist EV, locked 1.5× XP.

**Dominated / dead:** Weaken/Slow/Frost extras on the player bar; Iron Skin vs Shield; Venom vs Poison; BuffShop vs Doka→HP; Boss Rush room table; Doka boost toggle; admin cost/dmg knobs; Mark’s advertised ×2 (consumed on pre-pass); heal CHC lines.

**Walls:** XP doubling (L15+). **Trivial:** L1 (one pack levels you, even before challenges). **Spikes:** L1 uptier (93% above player), L78+ RES/SR 100. **Collapses:** kit damage once mitigation hits 100; Doka boost never available. **Reward loop:** lottery → death 40% → lottery. **Grind:** L15 still ~1000 live packs despite the 1.5×.

---

## Recommendations (ranges, not patches)

Do **not** auto-implement. Human picks one ID.

| Finding | Current | Recommended range | Expected effect | Risk | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Lottery | 0.01% × U(1,1e9)×L | 0.01% × U(50,200)×L **or** drop jackpot | Wallet from combat, not one roll | Low if persist EV kept ~5–15×L | HIGH |
| XP curve | `100*2^(N-1)` | `100*N^1.4` to `100*N^1.6` **or** `80*1.35^(N-1)` | L15 in tens of fights, not 1000 | High (all HUD/persist tests) | HIGH |
| Player dmg scale | unused L; 1.03^upgrade twice | one pass; `base*(1+0.03*L)` or `*1.03^(L-1)` | TTK tracks linear eHP | Medium | HIGH |
| Double-pass | scale+crit twice | one write | Crit is 2× not 4× | Medium (feel) | HIGH |
| Spawn floor | L1 mean 11.1, p(above)=0.93 | same-tier floor 70%+ with down-tier no-op replaced by same | L1 is a tutorial | Medium | HIGH |
| Kit zone | object → zone 0 | `currentMap.levelZone.minLevel` or depth | Kits grow | Medium | HIGH |
| Boost | XP 1.5 always | wire one `boostMode` **or** bake 1.5 into the XP formula and delete the pill | Honest UI; Doka boost if intended | Low if baked | HIGH |
| LevelUp knobs | multiplier/dmg% ignored | read them **or** remove from admin | Studio edits do something | Low | HIGH |
| Victory floor | `50+L*10` | `min(floor, maxHP)` (#386) | Post-fight HP ≤ max | Low | HIGH |
| Heal CHC | dead + 0.15 invert | apply +15pp **or** store 1.15 | Advertised extra exists | Medium | HIGH |
| RES/SR | uncapped to 100 | cap 60–75 | Kit damage stays meaningful | Medium | HIGH |

---

## ACTION blocks — NEW this run

ACTION_ID: BAL-BOOST-LOCKED-XP-150
TITLE: Victory XP is always ×1.5; Doka boost and BoostToggle never apply
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: App.tsx 360-362 and 497-501; GameFlow.tsx 48-49; WorldExploration.tsx 2098 and 12374-12441; BoostToggle.tsx (zero importers)
CURRENT_BEHAVIOUR: App toggles a prop GameFlow discards. WX `boostMode` is useState("xp") with unused setter. Every victory credits `derivedBaseXp * 1.5`. `boostMode === "rewards"` (Doka ×1.5) is dead. Challenge XP is not multiplied.
DESIRED_BEHAVIOUR: Single source of boostMode that WX reads, **or** delete the pill and document a permanent 1.5× XP in the curve. If a Doka boost exists, it must change persist deltas.
EVIDENCE: 2026-09-26 HEAD `0f5363f`. Grep: BoostToggle has no import. GameFlow `_boostMode`. WX `_setBoostMode`. Live L1 3-pack ~999 XP vs unboosted 666; L10 fights/level 50.9 vs 76.3 unboosted.
RECOMMENDED_ACTION: Human: either wire App state into handleBattleEnd, or bake 1.5 into computeVictoryExp and remove the toggle. Do not ship a lying HUD pill.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — removing 1.5 without a curve retune lengthens L8–L15 by 50%
VALIDATION_REQUIRED: Recap XP matches persist with the chosen rule; toggling the pill (if kept) changes the next victory; Doka recap changes only when Doka mode is selected
STATUS: NEW

ACTION_ID: BAL-LEVELUP-KNOBS-DEAD
TITLE: spellLevelingCostMultiplier and spellDmgGrowthPercent are admin-only; AP threshold field is split
CATEGORY: progression
PRIORITY: P2
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: main.mo 625-627 and 1017-1023; combatMath.ts 130-137; spellEngine.ts 1038-1043; progression.ts 59-72; WorldExploration.tsx 2307-2314; AdminDashboard.tsx LevelUp draft
CURRENT_BEHAVIOUR: Upgrade cost is `base * 2^n` regardless of `spellLevelingCostMultiplier` (validated 1–10). Damage scale is hardcoded `1.03^upgrade` regardless of `spellDmgGrowthPercent` (validated ≤50). Battle AP uses `apMpGrowthEveryNLevels`; canister/admin persist `apMpLevelThreshold`. WX loads `pbv_levelup_config` by object spread, so a Motoko-shaped blob does not move AP growth.
DESIRED_BEHAVIOUR: Live formulas read the same fields the admin form writes, **or** those fields are removed from the dashboard.
EVIDENCE: 2026-09-26 grep: `spellLevelingCostMultiplier` / `spellDmgGrowthPercent` appear in admin, mocks, migrations, bindgen — not in `upgradeSpell` or `calcScaledDamage`. `getPlayerBaseStats` only reads `apMpGrowthEveryNLevels`.
RECOMMENDED_ACTION: Map `apMpLevelThreshold` → growth divisor on load. Use `cost * multiplier` (or `multiplier^n` if that is the intended geometric). Use `(1 + spellDmgGrowthPercent/100)^upgrade` in the single remaining scale pass (after BAL-PLAYER-DMG-DOUBLE-PASS).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW if defaults stay 2 and 3; HIGH if someone already set multiplier 10 expecting no effect
VALIDATION_REQUIRED: Admin multiplier 3 makes L0→1 cost 30 (or 10*3^0 per chosen rule); dmg% 5 with one scale pass matches `floor(base*1.05^u)`; AP every 30 levels at L30 is 9
STATUS: NEW

---

## ACTION blocks — reissued OPEN (stable IDs)

ACTION_ID: BAL-DOKA-LOTTERY-BILLION
TITLE: Victory Doka jackpot is 0.01% × U(1,1e9) × enemy.level; persist clamps to 100k
CATEGORY: economy
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 12388-12414; applyRewardsResult.ts clamp; main.mo applyRewards
CURRENT_BEHAVIOUR: Comments say 0.0001%; `roll < 0.0001` is 0.01%. Unclamped EV ≈ L×50007. Persist EV ≈ L×6.88+10. Fever can ×2 before clamp.
DESIRED_BEHAVIOUR: Jackpot band U(50,200)×L or remove; comments match probabilities.
EVIDENCE: 2026-09-26 re-read of handleBattleEnd; L1 3-pack persist EV 259
RECOMMENDED_ACTION: Retune bands; keep clamp as a safety net not the design
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — wallets
VALIDATION_REQUIRED: No persist call >100k; median Doka/kill in a stated band
STATUS: OPEN

ACTION_ID: BAL-XP-EXPONENTIAL-WALL
TITLE: XP threshold doubles every level while kill XP is linear in enemy level
CATEGORY: progression
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: xpCurve.ts; rewardResolver.ts computeVictoryExp; WorldExploration.tsx 12374-12377
CURRENT_BEHAVIOUR: Need 100×2^(N-1). Live 3-pack ~999 XP at L1 (with locked 1.5×), ~1614 at L15. Fights L15 ≈ 1015; L25 ≈ 6.9e5.
DESIRED_BEHAVIOUR: Polynomial or ~1.35× geometric so L20 is tens of hours not years
EVIDENCE: MC seed 20260926; cumulative 1→15 = 1,638,300
RECOMMENDED_ACTION: Change threshold with HUD+canister together; do not only raise kill XP (hits 500k clamp)
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: applyRewards leftover matches HUD; L15 fights in a stated band
STATUS: OPEN

ACTION_ID: BAL-DMG-NO-LEVEL-SCALE
TITLE: Player spell damage ignores character level
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 130-137; spellEngine.ts 1038-1043
CURRENT_BEHAVIOUR: `_casterLevel` unused. Scale is upgrade-only 1.03^u. Enemy HP is linear in L.
DESIRED_BEHAVIOUR: One level term on the single remaining pass
EVIDENCE: Parameter prefixed `_casterLevel`
RECOMMENDED_ACTION: After removing double-pass, add a human-chosen per-level factor
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH
VALIDATION_REQUIRED: L1 Strike 10 unchanged; L10 Strike in a stated band
STATUS: OPEN

ACTION_ID: BAL-PLAYER-DMG-DOUBLE-PASS
TITLE: Player hits scale and crit twice
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts 882-892 and 990-995; WorldExploration.tsx 3295-3339
CURRENT_BEHAVIOUR: `calcScaledDamageInline` then crit, then `calculatePlayerDamage` scales and crits again. Frost L0 crit 80 vs advertised 40. Mark consumed on first pass.
DESIRED_BEHAVIOUR: One scale, one crit, Mark on the write
EVIDENCE: Floor chain 2026-09-26; enemy path scales once
RECOMMENDED_ACTION: Pass base (not pre-crit) into computeDamage; crit once
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — TTK lengthens
VALIDATION_REQUIRED: Frost L0 non-crit 20, crit 40; Mark ×2 on the HP write
STATUS: OPEN

ACTION_ID: BAL-ENEMY-TIER-OUTLIER
TITLE: Far-tier roll can spawn L80 next to L1
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts pickEnemyLevelFromTiers 90-97
CURRENT_BEHAVIOUR: Leftover 10% picks dist 3..6. L1 MC max 80 (~6% in 31+).
DESIRED_BEHAVIOUR: Cap |Δtier| at 1 for L<10, or 2 globally
EVIDENCE: seed 20260926 max 80
RECOMMENDED_ACTION: Clamp chosenTier vs playerTier
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 max enemy ≤ 20 (or stated cap)
STATUS: OPEN

ACTION_ID: BAL-TIER-FLOOR-UPBIAS
TITLE: L1 cannot down-tier; mean spawn ~11 with 93% above player
CATEGORY: spawn
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: combatMath.ts 66-97
CURRENT_BEHAVIOUR: `Math.max(0, adjusted+side)` clamps down-rolls to tier 0. 15% variance also up-only at floor. L1 mean 11.10, p(above)=0.933.
DESIRED_BEHAVIOUR: Same-tier mass ≥70% at L1; down-tier becomes same-tier not up
EVIDENCE: 8k seed 20260926; hist 70.1% in 1–10
RECOMMENDED_ACTION: If playerTier==0, skip negative side; fold leftover into same-tier
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — L1 easier
VALIDATION_REQUIRED: L1 mean in 5–8; p(above) ≤ 0.5
STATUS: OPEN

ACTION_ID: BAL-ENEMY-KIT-ZONE-OBJECT
TITLE: buildEnemyKit receives a LevelZone object so kits stay zone 0
CATEGORY: combat
PRIORITY: P0
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 11920; enemyAI.ts 194-199
CURRENT_BEHAVIOUR: `Math.floor({name,minLevel,maxLevel})` is NaN → 0. Late maps still Strike/Frost.
DESIRED_BEHAVIOUR: Pass a number (`minLevel`, depth, or AI tier)
EVIDENCE: longHorizonSim.ts comment; WX call site
RECOMMENDED_ACTION: `buildEnemyKit(piece, Number(zone.minLevel) || 0)`
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — late kits suddenly online
VALIDATION_REQUIRED: zone-0 pawn Strike only; zone with minLevel 40 includes late ids
STATUS: OPEN

ACTION_ID: BAL-PLAYER-COMBAT-STATS-FLAT
TITLE: Persisted ATK/RES/INIT/CHC/evasion do not drive outgoing damage
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: startingChampionStats.ts; combatMath.ts calcScaledDamage; WorldExploration computeDamage
CURRENT_BEHAVIOUR: Create ATK 15 / CHC 5. Damage uses spell base + upgrade + SP on second pass. Fail chance is independent of CHC except crit roll.
DESIRED_BEHAVIOUR: ATK or a documented combat stat on the damage path, or stop showing them as combat power
EVIDENCE: 12-field stats vs `_casterLevel` unused
RECOMMENDED_ACTION: Human: wire ATK as a small percent or remove from HUD combat claims
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Changing ATK changes a hit, or HUD copy no longer implies it
STATUS: OPEN

ACTION_ID: BAL-SPELL-FAIL-FLOOR
TITLE: 20% fizzle at L1, −0.1%/level, 0% at L201; Strike exempt
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 3648-3649; spellEngine.ts 641-651
CURRENT_BEHAVIOUR: Magical starters lose 20% of casts at the level where you have them. Physical Strike never fails. 0% only at L201 (unreachable under the XP wall).
DESIRED_BEHAVIOUR: 5–10% at L1, 0% by L20–30, or fail only on a documented school
EVIDENCE: DEFAULT_LEVELUP_CONFIG
RECOMMENDED_ACTION: Raise reduction or lower base; keep Strike exemption documented
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L1 Frost fail in stated %; L30 fail in stated %
STATUS: OPEN

ACTION_ID: BAL-TIMESTEP-FREE-TURN
TITLE: Timestep restores full AP/MP for 0 AP, once per battle
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts spell-timestep; spellEngine.ts 731-733; WorldExploration consumeTimestep 9350-9353
CURRENT_BEHAVIOUR: `apCost` 0, returns `no_ap` so caller does not debit. Extra full turn. Innate on the 32-spell starter bar.
DESIRED_BEHAVIOUR: Cost 2–4 AP **or** half restore **or** not innate
EVIDENCE: starterSpells includes timestep
RECOMMENDED_ACTION: Human pick cost vs restore vs gating
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM — pace
VALIDATION_REQUIRED: One Timestep per battle still; AP after cast matches rule
STATUS: OPEN

ACTION_ID: BAL-SACRIFICE-PERCENT-HP
TITLE: Sacrifice deals 60% current HP as damage and ignores RES
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts 749-763
CURRENT_BEHAVIOUR: `floor(hp*0.2)*3`. L1 full bar 60 vs mean eHP 75 (oneshot 35%). L8+ oneshot ~75–81% of live spawns. Same-level combat HP 50 is always oneshot from full.
DESIRED_BEHAVIOUR: Flat 15–25 **or** 10% HP ×2, and apply RES
EVIDENCE: MC p_oneshot table; dealDamage path
RECOMMENDED_ACTION: Retune; keep challenge self-HP recording
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — primary execute
VALIDATION_REQUIRED: L1 full Sacrifice < mean L1 eHP; RES reduces it
STATUS: OPEN

ACTION_ID: BAL-CHALLENGE-XP-EARLY-BREAK
TITLE: Hard/legendary challenge XP skips early levels
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: challengeCompletion.ts DEFAULT_CHALLENGES; challengeRewards.ts
CURRENT_BEHAVIOUR: hard_1 500 XP / legendary_1 1000 at L1 (need 100). Not ×1.5. At L15, 1000 is 0.06% of the bar.
DESIRED_BEHAVIOUR: Scale with `xpForNextLevel` (10–20%) or drop XP on easy/hard until L5
EVIDENCE: applyXpDelta(0,1,500) → L3 leftover 200
RECOMMENDED_ACTION: Percent of current threshold
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L1 hard_1 does not skip past L2; L15 still pays a visible slice
STATUS: OPEN

ACTION_ID: BAL-HP-FORMULA-SPLIT
TITLE: HUD HP is linear; getPlayerBaseStats HP is exponential and unused for the bar
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 3400-3406; progression.ts 74-80
CURRENT_BEHAVIOUR: HUD `100*(1+(L-1)*0.05)`. Formula HP `round(100*1.05^(L-1))` (L15: 198 vs 170). Battle AP uses the formula function; HP HUD does not.
DESIRED_BEHAVIOUR: One HP function for HUD, persist cap, death respawn, and formula
EVIDENCE: L15 170 vs 198
RECOMMENDED_ACTION: Pick linear (current HUD) and delete exponential HP, or the reverse
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: HUD max, persist cap, respawnHpAfterDeath share one helper
STATUS: OPEN

ACTION_ID: BAL-VICTORY-FLOOR-OVER-MAXHP
TITLE: Victory resource floor HP exceeds linear max from L10
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: deathPenalty.ts victoryResourceFloor; PR #386 (open, not in HEAD)
CURRENT_BEHAVIOUR: Floor `50+L*10`. L10: 150 vs max 145. L25: 300 vs 220.
DESIRED_BEHAVIOUR: `min(floor, maxHP)` as in #386
EVIDENCE: 2026-09-26 floor vs player_hp table; #386 still open
RECOMMENDED_ACTION: Merge or reimplement the cap; do not raise maxHP to match the floor
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: LOW
VALIDATION_REQUIRED: L10 victory HP ≤ 145
STATUS: OPEN

ACTION_ID: BAL-HEAL-ADVERTISED-BUFF-DEAD
TITLE: Blood Mend / Rallying Cry never apply CHC; 0.15 would invert if wired as a factor
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts; spellEngine.ts 655-672; statusEffects.ts getStatModifier
CURRENT_BEHAVIOUR: Heal branch returns after HP. Shield uses 1.3. 0.15 × CHC would be −85%.
DESIRED_BEHAVIOUR: +15pp or 1.15 factor; one encoding
EVIDENCE: 09-25 finding; 09-26 re-read heal vs shield
RECOMMENDED_ACTION: Apply before return; tests for CHC
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Mend does not ×0.15 CHC
STATUS: OPEN

ACTION_ID: BAL-ENEMY-MITIGATION-UNCAPPED
TITLE: Enemy RES/SR can roll 100+ and floor kit damage at 1
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: progression.ts getEnemyBaseStats 175-186
CURRENT_BEHAVIOUR: Rook max RES 100 at L78; king SR 100 at L96.
DESIRED_BEHAVIOUR: Cap 60–75
EVIDENCE: closed-form 09-26
RECOMMENDED_ACTION: Clamp after roll; separate from family fraction bug
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L78 rook res ≤ cap
STATUS: OPEN

ACTION_ID: BAL-PLAYER-CC-DEAD-ON-BAR
TITLE: Player-bar CC extras never apply from resolvePlayerCast
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellEngine.ts resolvePlayerCast; PRs #528 #555 (open)
CURRENT_BEHAVIOUR: Frost MP−1, Weaken −30% dmg, Slow, Cursed Wound extras are copy. Damage still lands.
DESIRED_BEHAVIOUR: applyEffect/debuffStat on HOSTILE hits
EVIDENCE: HEAD has no debuffStat write on the damage loop; #555/#528 still open
RECOMMENDED_ACTION: Land one of the queued PRs, restacked; do not duplicate
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Frost Bolt reduces enemy MP next turn
STATUS: OPEN

ACTION_ID: BAL-PLAYER-SUMMON-NO-CAP
TITLE: Player summons have no alive cap; enemy cap is 2
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: summon spawn path; enemy summon cap
CURRENT_BEHAVIOUR: 8 AP can drop Wolf+Archer+Wisp. AP is charged. No alive-cap.
DESIRED_BEHAVIOUR: Cap 1–2 alive player summons
EVIDENCE: 09-24/09-25 re-verify AP deducted, cap missing
RECOMMENDED_ACTION: Mirror enemy cap 2
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Third summon rejected or replaces
STATUS: OPEN

ACTION_ID: BAL-STARTER-KIT-NO-GATING
TITLE: All 32 starterSpells are forced innate
CATEGORY: progression
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: spellData.ts starterSpells
CURRENT_BEHAVIOUR: isBaseSpell true on the whole array. Timestep, Sacrifice, Chain Lightning, summons at L1.
DESIRED_BEHAVIOUR: 4–8 innate; rest from discovery
EVIDENCE: array length vs isBaseSpell
RECOMMENDED_ACTION: Gate with existing discovery; do not drop ids
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: HIGH — new-player kit
VALIDATION_REQUIRED: Fresh profile bar length in a stated band
STATUS: OPEN

ACTION_ID: BAL-BOSS-RUSH-TABLE-UNPAID
TITLE: Boss Rush room Doka/XP table is not the persist path
CATEGORY: economy
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: useBossRush.ts BOSS_RUSH_ROOMS; completeBossRushRoom in main.mo
CURRENT_BEHAVIOUR: UI 500–3000 Doka / 200–600 XP. Canister ignores client rewards. Persist = kill XP + max(5, floor(L*1.5)) Doka/kill.
DESIRED_BEHAVIOUR: Pay the table through applyRewards after room advance, or stop showing it
EVIDENCE: AGENTS.md completeBossRushRoom ignores client; frontend passes 0,0
RECOMMENDED_ACTION: Server-side table or honest UI
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: Recap Doka equals canister; table or copy matches
STATUS: OPEN

ACTION_ID: BAL-FALLBACK-CRUSH-OUTSCALES-KIT
TITLE: Fallback Crush scales with enemy.level; zone-0 kit Strike is flat 10
CATEGORY: combat
PRIORITY: P1
CONFIDENCE: HIGH
FILES_OR_SYSTEMS: WorldExploration.tsx 16710-16721
CURRENT_BEHAVIOUR: Crush `12*max(1,L/5)*enrage`. L25 Crush 60 vs kit 10.
DESIRED_BEHAVIOUR: Fallback uses kit damage **or** kits scale; not both identities
EVIDENCE: kit Strike 10 vs formula
RECOMMENDED_ACTION: After kit-zone fix, make fallback = kit melee
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: MEDIUM
VALIDATION_REQUIRED: L25 pawn melee in a stated band vs Strike
STATUS: OPEN

---

P2/P3 OPEN IDs (full records in [`ACTION_IDS_BAL_2026-09-26.md`](./ACTION_IDS_BAL_2026-09-26.md)): `BAL-FAMILY-COMBAT-IDENTITY`, `BAL-DOMINATED-SPELLS`, `BAL-SUMMON-UI-COST-10X`, `BAL-DEATH-DOKA-40`, `BAL-AP-GROWTH-UNREACHABLE`, `BAL-VOID-COLLAPSE-UNREACHABLE`, `BAL-DUNGEON-MULT-FORMULA-SPLIT`, `BAL-TITAN-VIGOR-FLAT-1000`, `BAL-JACKPOT-HEAL-1-DOKA`, `BAL-BUFF-SHOP-OVERWORLD-DOMINATED`, `BAL-TWO-SPELL-CATALOGS`, `BAL-MP-UNUSED-ON-STARTERS`, `BAL-SUMMONER-SATURATION`, `BAL-HARD3-AP8-FREE`, `BAL-BOSS-CATALOG-SPLIT`, `BAL-IAP-PACKAGES-ORPHANED`, `BAL-GAMEKEY-MINT-UNBOUNDED`, `BAL-CREATE-VITALS-MISMATCH`, `BAL-BOSS-GUIDE-VS-COMBAT`, `BAL-RANGE-CAP-FAVORS-STRIKE`, `BAL-HAZARD-FLAT-DAMAGE`, `BAL-TIER-THREE-MORE-UNUSED`.

SUPERSEDED: `BAL-IAP-VALUE-DOMINANCE` (player shop is GameKey 100 Doka/€). RESOLVED: `BAL-RECAP-XP-BAR-WRONG`.

---

## Explicit non-actions

- No enemy HP / damage / AP / MP / init edits.
- No spell cost, damage, or rarity edits.
- No XP / Doka curve edits.
- No GameKey price or grant edits.
- No spawn-table edits.
- No commit of numeric ranges from this file.

# Emergent Build & Meta Analysis — 2026-10-27

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior pass on `main`:** 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`)  
**Prior pass (unmerged):** 2026-10-26 draft PR #1117 (`EMERGENT_META_2026-10-26.md`; `EBMA-2026-10-26-001` … `004`, `006` … `026`)  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-10-27.md`](./ACTION_IDS_EBMA_2026-10-27.md).

---

## 0. What changed since 2026-10-26

`origin/main` is still `0f5363f` (commit date 2026-09-03). About 24 hours after the 10-26 pass, **no combat gate on `main` moved.** Cited close/escalate vehicles (`#327`/`#370`, `#443`, `#496`, `#528`/`#555`, `#550`, `#581`, `#596`, `#597`/`#598`/`#709`/`#865`, `#644`/`#647`, `#658`/`#913`, `#659`, `#692`, `#699`, `#700`/`#856`, `#714`/`#749`/`#861`, `#766`/`#868`, `#810`, `#842`, `#905`/`#917`/`#922`/`#921`/`#915`, `#911`, `#924`, `#947`, `#967`, `#972`, `#973`, `#974`, `#985`/`#989`, `#1026`/`#1034`, `#1033`/`#1039`, `#1040`, `#1042`) are still **OPEN drafts**. Priorities on 001–026 are not escalated. **No 027.** This pass re-read the live player / summon / enemy / challenge paths and reissued IDs with current line numbers.

026 (Striker aim-tile) stays. It was named on 10-23; the live hole is unchanged (`WX` 17178–17185). Vehicle `#327` (oldest; `#370` is a later copy) is still open.

| Gate | 2026-10-26 live `main` | 2026-10-27 live `main` | Meta effect |
| :--- | :--- | :--- | :--- |
| DoT append | no cap (`appendDotStack` 31–37) | unchanged | Still BROKEN |
| Player summon cap | none (`spawnPlayerSummon` 9582–9635) | unchanged | Still DOMINANT occupancy |
| Pacifist execute | `recordPlayerSpellType` only (`WX` 17015–17033) | unchanged | Still DOMINANT economy |
| Player `debuffStat` | damage loop drops it (`resolvePlayerCast` 876–1028) | unchanged | Control kit still dead on the bar |
| Drain no-heal | counted | still counted | **005 stays closed** |
| Timestep / Mirror | inert on self tile | unchanged | Still UNDERPOWERED advertised identity |
| `hard_3` | `maxApUsedInTurn <= 8` vs 8-AP bar | unchanged | Still DOMINANT early-game challenge |
| Striker aim-tile | click only (`WX` 17178–17185) | unchanged | Keep **026**. `#327`/`#370` are **not** live |
| `summonTurnBudget` | leftover-0-AP **live**; Slow/Haste ignored | unchanged (`WX` 14520–14529) | Keep **019** for Slow/Haste only |
| Player turn-start modifiers | `playerTurnStartModifierTarget` → `undefined` | unchanged (`WX` 14262–14274) | Keep **025**. `#443` is **not** live |
| Chain Lightning bounce | once per occupant (`castHelpers.ts` 430–461) | unchanged | Keep **024**. `#766` is **not** live |
| Catalog = ownership | `usableByPlayer !== false` | unchanged (`adminSafety.ts` 712–719) | Discovery still inert |
| Enemy kit zone | object → NaN → zone 0 | unchanged (`WX` 11920) | Enemies still weaker than the data file |

New **queued** vehicles since the 10-26 ledger was written (all still **OPEN drafts**, none merged). They do **not** change live classification:

| PR | What it would restore | Treat as | Merge rule |
| :--- | :--- | :--- | :--- |
| `#1123` | Summon-hunter LoS-blocked Venom with stalk fallback | **006** / **001** adjacent | Hold ticks with **001**. Do not close 006 or mint 027 |
| `#1136` | Tax player-controlled summon walk landings like enemy apply | MIMA/CRP hazard | Swap × lava stays MIMA. **Not 027** |
| `#1142` | Soak Plague Zone turn-start like `playerTakesDamage` | MIMA/CRP / **025** adjacent | Not Mist/Winds. Do not close 025. **Not 027** |
| `#1148` | Vampiric Ground 15% attacker lifesteal (helper; WX unwired) | **008** / **005** adjacent | Not live. If WX restacks without `healUsed`, reopen 005. Do not mint 027 |
| `#1150` / `#1158` / `#1166` | Summon-bomber Inferno available-list / WX summon pack CD filter / `applyCast` cooldown arm (WX unwired) | **010** adjacent | Not `planSummonControlCast`. Do not close 010 |
| `#1155` | Iron Curse advertised healing ×0.5 | healRecv restore | Not a player combo ID. Do not mint 027 |
| `#1160` | Glass Realm advertised ×2 on Strike and incoming (helper; WX unwired) | **008** adjacent | Advertised identity. Do not close 008. Do not double-apply with `enemyTakesDamage` leftover. **Not 027** |
| `#1113` / `#1152` / `#1159` / `#1164` | Pale Archivist / Enthroned Void spawn HP and kit-first Swap | Boss identity restore | Not a player combo ID. Do not mint 027 |
| `#1168` | Chaos Initiative advertised per-round reshuffle | Map-modifier restore | Not a player combo ID. Do not mint 027 |

Still queued from 10-21 … 10-26 morning (unchanged, still OPEN): `#1054`/`#1081`/`#1085`/`#1087`/`#1090`/`#1091` pack pathing (not 009); `#1095`/`#1096` archer LoS Poison (hold ticks); `#1098` archer LoS Slow (not 004/019); `#1058`/`#1094`/`#1104` boss identity; `#1107` pack melee CHC (not 022); `#1079`/`#1084`/`#1097`/`#1100` hazard soak (**not 027**). Also still OPEN: `#905`/`#917`/`#922`/`#921`/`#915` extra 004 (WX unwired); `#913` extra 021; `#911` pack-kit fill (not 009); `#924` enemy-heal CHC (not 012); `#978` pack-buff decide (not 012); `#878` summon-kit Slow (not 004 player-bar); `#856` extra 006 DoT-tick (hold with `#700` until 001); `#947` WX enemy DoT ticks (hold until 001); `#967` pack DoT decide (not 009/006 ticks); `#972` pack Inferno CD (not player 010); `#973` lethal-reflect drain heal (not 005); `#974` pack-enemy buff (not 012); `#842` hostile kit attach (ticks wait on 001); `#861` empty auto-summon kit fill (003); `#868` boss-kit CL bounce (**not** 024); `#799` bomber kamikaze (006 half); `#865` summon-kit buffStat (020 pick-one); `#692` CHC self-heal (012); `#810` canister level/stack 99 (**not** 001); `#327` / `#370` Striker AoE/bounce (**026**); `#443` player turn-start modifiers (025 helper, WX unwired); `#985`/`#989` pack-heal decide (not 012); `#1026`/`#1034` pack-healer Frost approach/guard (not 009); `#1033`/`#1039` pack-healer Inferno fallback (hold ticks until 001; not player 010); `#1040` CURSE_ON_HIT (boss identity, not a combo ID); `#1042` Paper Windstorm melee miss skip (MIMA/CRP, not 027).

`#762` is still combat-rule-parity kit decide/execute, not 014. Do not duplicate it.

Closed, do not re-open:

- Pacifist failing on spell-range preview
- BuffShop mid-fight potions paying no-heal
- Inf-HP summon catalog writes
- Player-controlled summons ignoring Void Rift ticks
- Free player summon placement (0 AP)
- Attack Nearest Inferno cooldown skip on the player bar
- Drain HP restores paying no-heal (**005**)
- Sacrifice skipping Untouchable / under-N-damage
- Bomber Inferno as a **Day-1** launder (kit AP 1 < Inferno 5; slvl 12 and 014 still open 010)
- Control-mode summon leftover 0 AP across lifespan turns (budget reset is live; Slow/Haste still 019)

---

## 1. Access model (what a player can actually bring)

There is still no observe → win → unlock path. “Discovered enemy spells” and “achievement/challenge spells” remain design docs, not live systems.

| Source | What enters the library | Spell grant? |
| :--- | :--- | :--- |
| `starterSpells` | All starter ids forced `isBaseSpell: true` (`WX` 2395–2408) | Always owned |
| `getSpellConfigs()` | Every `usableByPlayer !== false` id (`adminSafety.ts` 712–719; `WX` 2412–2440) | Catalog membership **is** ownership |
| Achievements | Doka only (`admin.mo` `defaultAchievements` 309–325) | No |
| Challenges | Doka / XP / badge (`challengeCompletion.ts` 44–109) | No |
| Recap / `applyRewards` | XP + Doka | No |
| `upgradeSpell` | Levels a known id; charges `10 * 2^level` (summon UI advertises 10×) | Must not grant |
| GameKey shop | Admin-approved keys | No spells |
| BuffShop | Battle Elixir +3 AP, Swift Boots +2 MP, potions, Fury, Shield Charm | No spells |

Real loadout constraint: **8-slot bar**. The broken strategies below are 8-slot legal.

Backend seed (`admin.mo` `defaultSpells` 168–191) that actually fires on the player path:

| Id | On paper | Live `resolvePlayerCast` | Class |
| :--- | :--- | :--- | :--- |
| `shadow_strike` | 35 dmg / 3 AP / CD 2 / diagonal | Damage loop | STRONG_BUT_HEALTHY |
| `thunder_clap` | 25 AoE / 4 AP / CD 3 | Damage loop via `multiTarget` → `hitsMultiple` | STRONG_BUT_HEALTHY |
| `void_collapse` | 80 AoE + pull / 12 AP / `minLevel` 30 | AoE damage only. Attract unused. 12 AP needs ~level 100 (`8 + floor(level/25)`). `minLevel` is **not** checked. `effectType` `"attract_multi"` is **not** in Pacifist `offCats` | NICHE until ~100, then STRONG_BUT_HEALTHY damage / DOMINANT Pacifist payload |
| `soul_rend` | DoT + 25 upfront | `effectType === "dot"`; no `dotDamagePerTurn` → 0 tick | UNDERPOWERED (inert) |
| `vampire_bite` | Drain 20 / heal 20 | `effectType: "heal"` → 20 damage, **no heal**, Pacifist-legal | UNDERPOWERED heal + **DOMINANT** Pacifist payload |
| `reflect_barrier` | Reflect next spell | Generic `buff` without `buffStat` / `isMirror` / self | UNDERPOWERED (inert) |

Enemy kits (`ENEMY_KITS` in `enemyAI.ts` 163–185) reuse starter ids. Seeing a bishop cast Frost teaches nothing and unlocks nothing.

---

## 2. Live gates (combo truth table)

| Gate | File | Live behavior |
| :--- | :--- | :--- |
| DoT append | `engine/dotStacks.ts` 31–37; `statusEffects.ts` `mergeIncomingEffect` 92–99; `WX` `applyActiveEffect` 1871–1892 | Same-type stacks add; no cap; independent durations |
| Player DoT apply | `spellEngine.ts` `resolvePlayerCast` 777–814 | Sets `dotDamagePerTurn` |
| Player damage debuffs | same, 876–1028 | **Does not** call `applyEffect` for `debuffStat` |
| 0-damage floor | `combatMath.ts` `calcScaledDamage` 130–136; `spellEngine.ts` 1038–1044 | `max(1, …)` so Slow/Weaken poke 1 and stay Pacifist-legal |
| Controlled-summon / `resolveSpellCast` | `spellEngine.ts` 507–574 | Buffs stamp `targetId: caster.id` then **return before heal**. Debuffs **do** apply. DoTs tick |
| Enemy / boss inline debuffs | `WX` ~16594 / ~16676 | Apply; same `effectName` replaces; different names with the same `stat` add (`getStatModifier` 45–63) |
| Summon cap | `gameConstants.ts` `ENEMY_SUMMON_CAP = 2` (300) | Enemy only. Player spawn has no alive-cap. Comment at `enemyAI.ts` 1828–1830 (“player-side summonCount gate”) is still false |
| Summon spell CD | `spellData.ts` 547–690 | No `cooldown` on the five kits |
| Kit CD | `summonControlCast.ts` `planSummonControlCast` 221–258 | AP, range, live geometry — **not** cooldown |
| Kit AP vs cost | `getSummonBaseStats` (`progression.ts` 229–232) | Bomber 1 vs Inferno 5; Wisp 2 vs Mend 3 / Rally 4; Wolf 2 vs Venom 3; Sentinel 2 vs Iron Skin 3. Archer 2 vs Poison 2 **does** fire. Bomber reaches 5 AP at spell level 12 (`SUMMON_AP_PER_LEVELS = 3`) |
| Player summon AP | `challengeCompletion.ts` 330–331; `WX` 17162 | Charged |
| Control-mode budget | `summonTurnBudget` 356–363; `WX` 14520–14529 | Resets from `maxAp`/`maxMp` each summon turn. **Ignores** Slow/Haste |
| Pacifist execute | `WX` `recordPlayerSpellType` 17015–17033 | Offensive list: damage/drain/aoe/dot/pushback/attract/cc/teleport. `"summon"`, `"heal"`, `"debuff"`, `"defense"`, `"buff"`, `"attract_multi"` do not flip. Kit casts never call the hook |
| Challenge heal | self-heal spells (`WX` 17190–17196); potions; drain via `onPlayerHealed` | Wisp cannot currently restore player HP (015) |
| `hard_3` | `challengeCompletion.ts` 80–86, 126–127 | `maxApUsedInTurn <= 8`. Battle AP is 8 at levels 1–24 (`PLAYER_BASE_AP` 8, `gameConstants.ts` 131) |
| Striker | `WX` 17178–17185; `challengeCompletion.ts` 387–397 | One check: player (or summon) vs **clicked tile**. AoE occupants and bounce hops are not counted |
| Timestep | `spellEngine.ts` 634–636 then 680–718 vs 721–733 | `self`+`buff` hits shield branch on the caster tile; `restoreApMp` never runs |
| Mirror | `spellEngine.ts` 917–926 | `activateMirror` is inside the enemy-target loop |
| Haste | `spellData.ts` 314–331; `WX` 14275 then 14350–14365 | Duration-1 row is ticked away before restore. Walk spends `currentBattleMp`. Swift Boots **does** bump the live pool (3579–3581) |
| Player turn-start modifiers | `battleSetup.ts` 364–368; `WX` 14262–14274 | Looks for `id === "player"` in `combatantsRef`. Player is not there. Mending Mist / Swift Winds / Void Rift `onTurnStart` skip. Plague is hardcoded separately (14313–14334) |
| Battle Elixir | `WX` 3575–3577 | +3 AP this turn (amplifies 001, does not own it) |
| `res_sp` | Expose / Shadow Veil vs `getStatModifier` exact key | Dead alias. Damage reads `"res"` / `"sr"` / `"sp"` |
| Fallback melee RES | `WX` 16703–16728 | Raw `characterStats.res`. Shield product skipped. Spell hits **do** use `getStatModifier` (16486–16490) |
| Ally Enrage outgoing | `WX` 9171–9183, 14997–15004 | `dealDamage` hardcodes `casterId: "player"`. Badge without 1.4× |
| Chain Lightning | `spellData.ts` 69–83; `castHelpers.ts` 124–136 and 430–461 | `hitsMultiple` already full-hits every occupant in Chebyshev range, then **each** occupant retriggers 50%/25% hops |
| Titan / Glass | `enemyTakesDamage` `WX` 3499 | Main bar uses `calculatePlayerDamage` and skips the hook. Sacrifice `dealDamage` **does** take the lottery |
| Upgrade damage | `calcScaledDamage` 130–136 | `base * 1.03^level`, floor 1. DoT literals do not scale |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72 | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `levelZone` is `{name,minLevel,maxLevel}` (4683–4687). `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` 419–431 | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1). Optional: Battle Elixir (+3 AP this turn). Optional: player-controlled Archer (`resolveSpellCast` Poison). Optional: `hard_3`.

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 under Surge; more with Elixir).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. `hard_3` accepts a full 8-AP Poison dump.

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll. Archer is a starter summon. Elixir is BuffShop.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast.

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout.

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep, Elixir, or Surge. **Do not merge `#700` or `#856` or `#947` first.** `#810` (canister spell-level 99) is not this cap. See `EBMA-2026-10-27-001`.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf / Sentinel / Archer / Bomber / Wisp. No alive-cap. No summon-spell cooldown. Placement AP **is** charged.

**COMBO_SEQUENCE:**

1. An 8-AP turn still buys Wolf + Archer + Wisp (3+3+2).
2. Each unit gets its own turn and lifespan (Wolf/Archer 4, Sentinel/Wisp 5, Bomber 3).
3. Recast every turn. Occupancy unseal and Void Rift ticks are closed; they are not a cap.
4. Archer Poison is the live kit amplifier for 001 (2 AP vs 2 cost). Other kits are mostly `no_ap` until 014.

**ACCESS_REQUIREMENTS:** All five kits are starters.

**WHY_IT_IS_STRONG:** Action economy. Extra bodies are extra turns, extra occupancy, extra Poison from Archers. The 2026-08-31 free-place hole stays closed; the flood is paid but uncapped.

**COUNTERPLAY:** Kill the summons (they have lifespan). Enemy summon cap is 2 with a 2-turn cadence — the player is not under the same rule. Zone-0 kits rarely pressure the board.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1. Spell-leveling adds summon HP/AP/MP/lifespan; it does not add a cap.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears and safer Pacifist wins (003). Occupancy can still stall a fight; it no longer seals exits.

**RECOMMENDED_RESPONSE:** Cap alive player-side summons (2 or 3) and add a short per-summon-spell cooldown. Keep five kit identities. See `EBMA-2026-10-27-002`. Pair Bomber AP (014) with kit Inferno CD (010).

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow-1 / attract_multi — **DOMINANT**

**COMPONENTS:** Feat “Win a battle using only heal or buff spells” (500 Doka). Execute flip is only `recordPlayerSpellType`. Kit casts never call it. Auto-summon AI never calls it.

**COMBO_SEQUENCE:**

1. Cast Wolf / Archer / Wisp (`effectType: "summon"` — not in `offCats`).
2. Let the summon kill. Or Bite (typed `"heal"`, deals 20). Or Mark (`"debuff"`) then a legal poke. Or Slow/Weaken (0 listed damage → 1 via floor, still `"debuff"`).
3. Late-game Void Collapse (`"attract_multi"`, 80 AoE) is also legal if the bar can pay 12 AP.
4. `checkAndFireAchievement("pacifist_run")` on overworld victory **and** Boss Rush room-clear.
5. Queued `#861` would let auto-summon kits actually fire without flipping the feat.

**ACCESS_REQUIREMENTS:** Starters + seeded Bite. No achievement-spell unlock required — the feat **is** the payout.

**WHY_IT_IS_STRONG:** Advertised constraint is heal/buff-only. Live constraint is “don’t use an `offCats` effectType on the player bar.” Summon damage, Bite, Mark, and 1-damage Slow are invisible. 500 Doka is the largest non-`doka_10000` feat.

**COUNTERPLAY:** None. It is a once-per-account flag, but it is free with the Day-1 summon kit.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1. Boss Rush pays the same flag per room-clear path.

**PERSISTENCE/ECONOMY_IMPACT:** 500 Doka from a fight that used offensive summons. Invalidates “heal/buff only” as a real constraint.

**RECOMMENDED_RESPONSE:** Fail unless every resolved player spell is heal, buff, Timestep, or (optionally) Mirror. Flip on the summon spell, summon damage, kit offense, and Bite even while heal metadata is wrong. Treat `attract_multi` as offensive. Do **not** call `applyHealBuffSideEffect` from range preview. `#714` is kit-only; `#749` is the unwired AI helper; `#861` fills empty auto-summon kits. See `EBMA-2026-10-27-003`.

---

### 3.4 `hard_3` vs the 8-AP bar — **DOMINANT** (early-game challenge economy)

**COMPONENTS:** Challenge “Never spend more than 8 AP in any single turn” (150 Doka + 450 XP). Battle AP is 8 at levels 1–24.

**COMBO_SEQUENCE:** Accept `hard_3`. Spend the whole bar. Peak cannot exceed 8. Persist the reward. Combine with a Poison dump (001).

**ACCESS_REQUIREMENTS:** 1-in-9 challenge offer, must be accepted.

**WHY_IT_IS_STRONG:** The cap equals the entire bar. There is no “play cheap” decision until AP grows at level 25.

**COUNTERPLAY:** None at levels 1–24 other than declining the offer.

**RELATIVE_PROGRESSION_CONTEXT:** 450 XP at level 1 is two level-ups plus leftover (`100 * 2^(N-1)`).

**PERSISTENCE/ECONOMY_IMPACT:** Free hard-tier payout on the same turn as the DoT integral.

**RECOMMENDED_RESPONSE:** Relativize the cap to the live battle bar. Keep 150/450. Do not change Poison AP. See `EBMA-2026-10-27-016`.

---

### 3.5 Chain Lightning bounce-from-every-occupant — **DOMINANT** (packed rooms; advertised as STRONG_BUT_HEALTHY)

**COMPONENTS:** Starter Chain Lightning — 20 damage, 4 AP, `hitsMultiple: true`, `bounces: 2`, Chebyshev range 4.

**COMBO_SEQUENCE:** Click any hostile in a 3+ pack. `getAoETargets` already full-hits every occupant in range. `applyDamageToEnemy` then fires a 50%/25% hop chain from **each** of those occupants.

**ACCESS_REQUIREMENTS:** Starter.

**WHY_IT_IS_STRONG:** Advertised identity is “primary then bounce to 2 nearest.” Live identity is “AoE every occupant, then N bounce chains.” Bounce hops go through `enemyTakesDamage`, so Titan/Glass can lottery the extra hops while the primary write does not.

**COUNTERPLAY:** Spread out (enemy AI does not). Zone-0 packs still clump.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1. Upgrade 3%/level scales the primary; hops inherit `finalDmg`.

**PERSISTENCE/ECONOMY_IMPACT:** Packed-room clears beat Thunder Clap without using a second slot identity.

**RECOMMENDED_RESPONSE:** Run the bounce chain **once per cast**, from the clicked primary only. Keep 20/4/`bounces: 2`. Do not nerf Thunder Clap because CL becomes honest. `#766` is the **player** vehicle. `#868` is a **boss-kit** bounce restore onto player-side summons — advertised identity, not this ID. See `EBMA-2026-10-27-024`.

---

### 3.6 Striker + AoE / bounce from an adjacent click — **DOMINANT** (legendary challenge economy)

**COMPONENTS:** Challenge `legendary_3` “Win using only spells cast on targets within 2 tiles” (400 Doka + 800 XP, badge Striker). Starter Chain Lightning (`hitsMultiple` + `bounces: 2`). Also Frost Nova / Lifesteal Nova splash.

**COMBO_SEQUENCE:**

1. Accept Striker. Click an adjacent hostile with Chain Lightning (Chebyshev 1 from the player).
2. `executeCastAttempt` records Striker once against `targetTile` (`WX` 17178–17185). Distance 1 passes.
3. `getAoETargets` full-hits every hostile in Chebyshev 4 of that tile — occupants can be 5+ from the player.
4. `applyDamageToEnemy` bounce hops (`castHelpers.ts` 430–461) never call `applyChallengeDirectHit`.
5. Victory persists 400 Doka / 800 XP. Kit casts on a summon tile use the **summon** as caster (`WX` 9874–9883) — Archer Poison range 4 still fails Striker when the *click* is > 2; the hole is player-bar AoE/bounce, not kit range (that half is already gated).

**ACCESS_REQUIREMENTS:** Starter CL. 1-in-9 legendary offer, must be accepted. No achievement-spell unlock.

**WHY_IT_IS_STRONG:** Advertised constraint is every landed hit within 2 tiles. Live constraint is the aim tile. Packed-room CL (024) then pays legendary XP on the same click. Invalidates Strike / adjacent-only play as the intended kit.

**COUNTERPLAY:** None once the offer is accepted other than not using AoE. The banner stays on-track.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1. 800 XP at level 1 is three level-ups plus leftover.

**PERSISTENCE/ECONOMY_IMPACT:** Repeatable legendary payout through `applyRewards`. Distinct from Pacifist (003, once-per-account) and `hard_3` (016, AP bar). This is the challenge-accounting half of dishonest CL, not a CL number nerf.

**RECOMMENDED_RESPONSE:** Fail Striker if **any** occupant or bounce hop is Chebyshev > 2 from the caster. Keep 400/800. Do not nerf CL 20/4 or Frost Nova radius. Nearby-only splash must still complete. `#327` is the oldest vehicle; `#370` is a later copy — pick one. See `EBMA-2026-10-27-026`.

---

### 3.7 Timestep / Mirror self-tile no-op — **UNDERPOWERED** (advertised STRONG_BUT_HEALTHY)

**COMPONENTS:** Timestep (0 AP, once/battle, restore AP/MP). Mirror (4 AP, reflect next single-target). Both `targetType: "self"`. Highlight already allows the caster tile.

**COMBO_SEQUENCE:** Click the highlighted self tile. Timestep matches `isShieldSpell` (`self`+`buff`) and returns `"cast"` without `buffStat` before `isTimestep`. Mirror’s `activateMirror` sits inside the enemy-target loop, so a self tile spends 4 AP and never arms the consume.

**ACCESS_REQUIREMENTS:** Starters.

**WHY_IT_IS_STRONG:** It is **not** strong. 09-02 classified both STRONG_BUT_HEALTHY from metadata. Live they are dead.

**COUNTERPLAY:** N/A.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1 identity spells.

**PERSISTENCE/ECONOMY_IMPACT:** Players who keep them on the 8-slot bar waste slots. Do not leave them dead as a fake `hard_3` brake.

**RECOMMENDED_RESPONSE:** Restore, do not nerf. `#496` is the vehicle. `#581` keeps 0 AP under Surge min-1 after restore. Do not nerf Timestep because it amplifies one Poison dump (001 owns the integral). See `EBMA-2026-10-27-017`.

---

### 3.8 Player-bar control kit is dead; stacking denial is latent — **UNDERPOWERED** now / **BROKEN** if wired without a cap

**COMPONENTS:** Slow (−2 MP, 2 turns), Frost Bolt (−1 MP, 1 turn), Drain Courage (−1 AP, 1 turn), Frost Nova, Weaken, Expose, Shadow Veil, Life Drain SP shred.

**COMBO_SEQUENCE (live):** Cast Slow at an enemy. Damage loop floors 0 → 1, records `"debuff"`, applies **no** MP row. Pacifist-legal poke.

**COMBO_SEQUENCE (if 004 wires without a cap, then 009 + 018 land):** Frost + Slow + Drain Courage add via `getStatModifier`. Duration-1 rows become load-bearing. Enemy bishops later gain Poison. Combined AP/MP can approach 0.

**ACCESS_REQUIREMENTS:** Starters. Controlled Archer Slow **already** writes `stat: "mp"` via `resolveSpellCast`.

**WHY_IT_IS_STRONG:** Live: it is not (except Pacifist 1-damage Slow). Latent: permanent control / AP-MP denial once the restore path exists.

**COUNTERPLAY:** Live N/A. After a cap: cannot drop below 1 AP and 1 MP from debuffs.

**RELATIVE_PROGRESSION_CONTEXT:** Restore advertised kit. Cap is the safety rail, not a nerf of a live player-bar combo.

**PERSISTENCE/ECONOMY_IMPACT:** None until wired.

**RECOMMENDED_RESPONSE:** Apply `debuffStat`, skip the 1-floor on 0-damage debuffs, cap stacked AP/MP. `#528`/`#555` are the wire. New sidecars `#905`/`#917`/`#922`/`#921`/`#915` are highlight/execute gates with WX unwired — do not treat them as closing 004 and do not concatenate. Pair 009, 018, 021. See `EBMA-2026-10-27-004`.

---

### 3.9 Ally Enrage on a Wolf is a badge — **UNDERPOWERED**

**COMPONENTS:** Enrage (`targetType: "ally"`, `buffStat: "dmg"`, 1.4×, 2 turns) + any player-side summon hit.

**COMBO_SEQUENCE:** Player-bar Enrage on a Wolf **does** write. Kit/AI `dealDamage` hardcodes `casterId: "player"`. `getStatModifier(casterId, "dmg")` never sees the Wolf row.

**ACCESS_REQUIREMENTS:** Starters.

**WHY_IT_IS_STRONG:** It is not. Self-cast Enrage on the player **is** STRONG_BUT_HEALTHY and must not be flattened.

**COUNTERPLAY:** N/A.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1 ally identity.

**PERSISTENCE/ECONOMY_IMPACT:** None.

**RECOMMENDED_RESPONSE:** Pass the summon id as `casterId`. Do not change 1.4. Do not close ally targeting to “fix” the flood (002). `#699` is the vehicle. See `EBMA-2026-10-27-023`.

---

### 3.10 Wisp / Sentinel kits do not do what they say — **UNDERPOWERED**

**COMPONENTS:** Wisp Blood Mend / Rally; Sentinel Shield / Iron Skin; kit AP vs cost.

**COMBO_SEQUENCE:**

1. Wisp AP 2 cannot pay Mend 3 / Rally 4 (014).
2. Even with AP, `resolveSpellCast` takes `buffStat` and returns before `healAmount` (015). Control-cast always passes `targetEnemy`. Player is not in `combatantsRef`.
3. Sentinel Shield on a clicked Wolf stamps `targetId: caster.id` (020). Player-bar Shield on the same Wolf **does** land.
4. `ctx.heal` only writes player HP for player ids; recorded no-heal delta is ref-after-setState (0).

**ACCESS_REQUIREMENTS:** Starter summons.

**WHY_IT_IS_STRONG:** They are not. Advertised healer/guardian identity is missing. Pacifist with Wisp should remain **legal** once heals work, and must **fail** no-heal.

**COUNTERPLAY:** N/A.

**RELATIVE_PROGRESSION_CONTEXT:** Day-1 kit identities.

**PERSISTENCE/ECONOMY_IMPACT:** No-heal challenges stay honest only after 015 records a real HP delta.

**RECOMMENDED_RESPONSE:** Restore AP (014), targeting/heal order (015), ally `targetId` (020). Do not nerf heal amounts. See those IDs.

---

### 3.11 Player turn-start map modifiers skip the player — **UNDERPOWERED**

**COMPONENTS:** Mending Mist (5% max HP / turn), Swift Winds (+2 MP / turn), Void Rift `onTurnStart` (−3). `playerTurnStartModifierTarget` looks for `id === "player"` in `combatantsRef`.

**COMBO_SEQUENCE:** Player turn starts. Helper returns `undefined`. `applyTurnStart` is skipped. Plague is hardcoded on the strip (honest). Mist/Winds/Rift registry ticks never commit to player HP/MP. Enemies **do** get Mist/Rift on their turn-start path.

**ACCESS_REQUIREMENTS:** Map-modifier roll. Not an unlock.

**WHY_IT_IS_STRONG:** It is not, for the player. Enemies receiving Mist while the player does not **lengthens** the already-unbounded DoT integral (001) by healing the wrong side.

**COUNTERPLAY:** N/A for the player. After restore, Mist is 5%/turn — not immortality vs a Poison dump. Count it for no-heal.

**RELATIVE_PROGRESSION_CONTEXT:** Map lottery identity. `#443` already exists as the vehicle and is still not live (helper only; WX unwired).

**PERSISTENCE/ECONOMY_IMPACT:** Untouchable / no-heal stay misaligned with advertised Void Rift / Mist until the player strip is wired. Do not double-apply Plague (hardcoded 2 plus registry 1).

**RECOMMENDED_RESPONSE:** Restore, do not nerf. Treat `#443` as the vehicle. Do not use `combatants[0]`. Pair Swift Winds with the live MP pool (018). See `EBMA-2026-10-27-025`.

---

### 3.12 Queued hostile / AI kit restores would append DoTs onto the player — **BROKEN if merged before 001** (not live)

**COMPONENTS:** `#842` hostile catalog kits + `#856` / `#700` `dotDamagePerTurn` on `executeSummonAction` + queued `#947` WX pack-enemy advertised ticks + live `appendDotStack` with no cap. Optional `#861` empty-kit fill for player auto-summons.

**COMBO_SEQUENCE (if those PRs land first):** Enemy Archer / hunter minions (and player auto-summon Archers) apply Poison/Venom that **tick**. Each recast appends. The player becomes the uncapped integral target. That is the reverse of 001 and is why 006 is blocked.

**ACCESS_REQUIREMENTS:** Not live. Requires merging the queued vehicles.

**WHY_IT_IS_STRONG:** Same linear stack math as 001, now aimed at the player, with no cleanse on zone-0 kits.

**COUNTERPLAY:** None until 001 exists.

**RELATIVE_PROGRESSION_CONTEXT:** Would hit as soon as those drafts merge, independent of player level.

**PERSISTENCE/ECONOMY_IMPACT:** Deaths / unpaid 20/40 XP-Doka spikes. Not a player farm — a trap.

**RECOMMENDED_RESPONSE:** Do not invent a new ID. Hold `#700`, `#856`, and `#947` until 001. `#842` may attach kits; ticks wait. `#967` is decide-only. `#861` may fill empty auto-summon lists; Pacifist 003 still owns the feat flip. See `EBMA-2026-10-27-006`.

---

## 4. Healthy packages — do not nerf

These are strong or interesting and should stay that way once advertised effects actually fire.

| Package | Class | Why leave it |
| :--- | :--- | :--- |
| Shadow Strike 35 / 3 AP / CD 2 | STRONG_BUT_HEALTHY | Honest burst. Not a dump-to-nerf when 007 lands |
| Thunder Clap 25 AoE / 4 / CD 3 | STRONG_BUT_HEALTHY | Distinct from Chain Lightning once 024 is honest |
| Self Enrage 1.4× / 2 turns | STRONG_BUT_HEALTHY | Do not flatten because ally Enrage starts working (023) |
| Shield + Iron Skin 1.3 × 1.3 | STRONG_BUT_HEALTHY | Different names, multiplicative RES. Do not flatten because melee starts respecting it (022) |
| Mark ×2 + crit ×2 | STRONG_BUT_HEALTHY | Two slots, two rolls, one tile. Counterplay: don’t stand on the mark |
| Sacrifice 20% HP → 3× | STRONG_BUT_HEALTHY | Self-risk. Titan/Glass lottery is 008 MONITOR, not a Sacrifice nerf |
| Archer Poison as a **single** stack | STRONG_BUT_HEALTHY | Kit identity. 001 caps stacks; do not delete Archer Poison |
| Haste +2 MP (once restored) | STRONG_BUT_HEALTHY | Do not nerf +2 because 018 makes it real |
| Expose 0.8 RES/SP (once 021) | STRONG_BUT_HEALTHY | Advertised shred. Do not nerf 0.8 because the product becomes real |
| Wisp heal (once 014+015) | STRONG_BUT_HEALTHY / Pacifist-legal | Advertised healer. Must fail no-heal, must stay Pacifist-legal |
| Boss-kit Chain Lightning bounce (`#868`) | STRONG_BUT_HEALTHY once restored | Advertised 50%/25% onto player-side summons. Not a player CL nerf |
| Nearby-only Striker splash (after 026) | STRONG_BUT_HEALTHY | Adjacent Frost Nova that stays within 2 tiles is the intended legendary play |
| Barrier 3-turn block | NICHE | Not permanent control |
| Swap | NICHE | One-shot displace. Teleport **does** flip Pacifist |

---

## 5. Classification index

| Package | Class | IDs |
| :--- | :--- | :--- |
| Unbounded Poison/Venom/Inferno recast | BROKEN | 001 (006 blocked) |
| Player summon flood | DOMINANT | 002, 010, 014 |
| Pacifist + summons / Bite / Mark / Slow-1 / attract_multi | DOMINANT | 003, 013 |
| `hard_3` vs 8-AP bar | DOMINANT | 016 |
| Chain Lightning bounce-per-occupant | DOMINANT | 024 |
| Striker + AoE/bounce from adjacent click | DOMINANT | 026 |
| Catalog = ownership (no discovery) | DOMINANT progression (not a combat combo) | 007 |
| Enemy zone-0 kits | UNDERPOWERED enemies → inflates player packages | 009, 011 |
| Player-bar Slow/Frost/Weaken | UNDERPOWERED (latent denial) | 004, 018, 021 |
| Timestep / Mirror | UNDERPOWERED | 017 |
| Haste / duration-1 AP-MP | UNDERPOWERED | 018, 019 |
| Bite heal / Soul Rend / Reflect | UNDERPOWERED | 013 |
| Kit AP mismatch | UNDERPOWERED | 014 |
| Wisp heal targeting | UNDERPOWERED | 015 |
| Sentinel ally Shield | UNDERPOWERED | 020 |
| `res_sp` shred | UNDERPOWERED | 021 |
| Shield vs fallback melee | UNDERPOWERED | 022 |
| Ally Enrage outgoing | UNDERPOWERED | 023 |
| Blood Mend / Rally CHC | UNDERPOWERED | 012 |
| Mending Mist / Swift Winds on player | UNDERPOWERED | 025 |
| Titan × Glass × Sacrifice | NICHE lottery | 008 MONITOR |
| Void Collapse before AP 12 | NICHE | — (Pacifist payload is 003) |
| Shadow Strike / Thunder Clap / self Enrage / Shield | STRONG_BUT_HEALTHY | do not nerf |

Search categories with **no live infinite**:

- Infinite resource loop: none. Timestep is once/battle and currently inert.
- Permanent control: Barrier is 3 turns. Slow on the player bar does not apply.
- Displacement loops: Gravity Well is a placeholder. Attract metadata is unused.
- Healing immortality: Mending Mist does not hit the player (025). Drain is AP-gated and counted for no-heal.
- Cooldown circumvention on the **player bar**: Attack Nearest Inferno is closed. Remaining launder is kit Inferno at slvl 12 / after 014 (010).
- Achievement-spell unlocks: none exist. Feats pay Doka only. Pacifist (003) and Striker (026) are achievement × existing kit.
- Enemy-discovery spell unlocks: none exist.

---

## 6. ACTION index (2026-10-27)

Reissues 001–004, 006–026. **005 stays closed.** **No 027.** Combat gates on `main` did not move.

| ID | Title | Priority | Autonomy |
| :--- | :--- | :--- | :--- |
| 001 | Cap or refresh same-source player DoT stacks | P0 | HUMAN_APPROVE |
| 002 | Player summon alive-cap and summon-spell cooldown | P0 | HUMAN_APPROVE |
| 003 | Pacifist Run matches advertised heal/buff-only | P0 | HUMAN_APPROVE |
| 004 | Apply player `debuffStat`, skip 1-floor, cap AP/MP denial | P1 | HUMAN_APPROVE |
| 006 | Write `dotDamagePerTurn` (and Slow) on summon-AI applyEffect | P2 | HUMAN_APPROVE |
| 007 | Keep catalog ≠ ownership | P1 | HUMAN_APPROVE |
| 008 | Monitor Titan × Glass × Sacrifice | P2 | MONITOR |
| 009 | Pass a numeric zone into `buildEnemyKit` | P1 | HUMAN_APPROVE |
| 010 | Honor kit-spell cooldowns | P1 | HUMAN_APPROVE |
| 011 | Retarget enemy summoner chance | P2 | HUMAN_APPROVE |
| 012 | Apply Blood Mend / Rally CHC to the crit roll | P3 | HUMAN_APPROVE |
| 013 | Restore Bite / Soul Rend / Reflect metadata | P2 | HUMAN_APPROVE |
| 014 | Align summon kit AP with advertised kit spells | P1 | HUMAN_APPROVE |
| 015 | Let Wisp heal the player and record the HP delta | P1 | HUMAN_APPROVE |
| 016 | Relativize `hard_3` to the live battle bar | P1 | HUMAN_APPROVE |
| 017 | Resolve Timestep and Mirror on the highlighted self tile | P0 | HUMAN_APPROVE |
| 018 | Duration-1 AP/MP effects must change the live pool | P1 | HUMAN_APPROVE |
| 019 | Apply Slow and Haste to the control-mode summon pool | P1 | HUMAN_APPROVE |
| 020 | Stamp Sentinel kit Shield on the clicked ally | P2 | HUMAN_APPROVE |
| 021 | Honor catalog `res_sp` shreds | P1 | HUMAN_APPROVE |
| 022 | Apply Shield RES to enemy fallback melee | P2 | HUMAN_APPROVE |
| 023 | Apply ally Enrage to player-side summon outgoing damage | P1 | HUMAN_APPROVE |
| 024 | Gate Chain Lightning bounce to the clicked primary | P1 | HUMAN_APPROVE |
| 025 | Commit player turn-start map modifiers onto the player strip | P2 | HUMAN_APPROVE |
| 026 | Count every AoE/bounce occupant toward Striker | P1 | HUMAN_APPROVE |

Implementers: do not modify balance from this document unless a human or orchestrator explicitly picks an ID. Prefer the queued vehicle PRs listed in §0 over a second copy.

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast BROKEN; 3.5 CL bounce DOMINANT; Enrage+Mark+crit STRONG_BUT_HEALTHY |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 004+009 without a cap |
| AP/MP denial chains | Latent 3.8; live Archer Slow is kit identity (walk pool still 019) |
| Summon abuse | 3.2 flood; kit Inferno launder at slvl 12 (010) |
| Cooldown circumvention | Player-bar Inferno **closed**; remaining launder is kit CD (010) |
| Healing loops | Drain counted (005 closed); Wisp cannot heal the player (015); Mist skips player (025) |
| Defensive immortality | Shield+Iron Skin duration-gated (healthy); melee currently ignores it (022) |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name |
| Displacement loops | Swap identity healthy; attract metadata unused |
| Hazard combinations | Swap × lava is MIMA, not EBMA. Paper Windstorm melee miss is `#1042` (not 027). Leftover-walk lava/spikes soak is `#1100`; Mirror Field / Void Mirror soak are `#1079`/`#1084`; Thorned Ground / Void Rift walk soak is `#1097`; player-controlled summon walk tax is `#1136`; Plague Zone soak is `#1142` — all MIMA/CRP, **not 027** |
| Achievement-spell combinations | No spell grants. Pacifist is 003. Striker + AoE/bounce is **026** |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |

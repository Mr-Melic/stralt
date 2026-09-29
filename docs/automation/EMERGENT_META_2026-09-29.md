# Emergent Build & Meta Analysis — 2026-09-29

**Analyzer:** Emergent Build & Meta Analyzer  
**Automation:** `7b2f2b58-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */72 * * *`)  
**HEAD:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior merged pass on `main`:** 2026-09-02 (`EMERGENT_META_2026-09-02.md`; ACTION_IDs `EBMA-2026-09-02-001` … `013`)  
**Prior unmerged passes (same HEAD, draft PRs only):** 2026-09-21 `#365`, 2026-09-22 `#414`, 2026-09-23 `#456`, 2026-09-24 `#522`, 2026-09-25 `#584`, 2026-09-26 `#627`, 2026-09-27 `#676`, 2026-09-28 `#721`  
**Gameplay code:** not modified. Balance was not changed.

This is a combination audit. Individual rows can look fair while two or three of them delete the rest of the kit.

Intervention is recommended only when a strategy:

- invalidates alternatives
- removes counterplay
- produces infinite / degenerate loops
- destroys progression or economy

Strong interesting synergy is left alone.

ACTION_IDs: [`ACTION_IDS_EBMA_2026-09-29.md`](./ACTION_IDS_EBMA_2026-09-29.md).

Prior IDs were **not implemented on `main`**. They are reissued with current line numbers. Escalate only where a cited gate actually moved. **005 stays closed.**

New this pass: (1) auto-summon AI (`executeSummonAction`) still never flips Pacifist — `#714` covers control-mode kit only; `#749` is the unique-helper vehicle for the AI half and is **not wired** into WorldExploration. (2) Chain Lightning `hitsMultiple` × `bounces: 2` double-dips: `applyDamageToEnemy` retriggers 50%/25% hops on **every** in-range occupant (`#766`). 09-28 classified CL as STRONG_BUT_HEALTHY from the card text; live packed rooms take full AoE **plus** extra bounce stacks.

---

## 0. What changed since 2026-09-28 / last merge

`origin/main` is still `0f5363f`. Every combat gate cited on 2026-09-28 still matches on a re-read of the live files. No restore PR merged.

Queued restores that are **not** on `main` (do not duplicate; do not treat as live):

| Ticket | Queued PR | What it would restore |
| :--- | :--- | :--- |
| 017 | `#496` Timestep / Mirror on the highlighted self tile | Once-per-battle AP/MP reset and next-hit reflect |
| 017 follow-on | `#581` keep 0-AP Timestep free under Arcane Surge | After 017, `applyApCost` min-1 would charge Timestep 1 AP on Surge/Overflow maps |
| 004 | `#528` Weaken/Slow on highlighted hostiles; `#555` advertised `debuffStat` after player hits | Player-bar control kit. Still needs the AP/MP stack cap in 004 |
| 015 | `#550` Wisp Blood Mend HP after the kit buff branch | Heal half of Blood Mend / Rally on `resolveSpellCast`. Targeting + amount-record still in 015 |
| — | `#443` player turn-start map-modifier HP/MP | Mending Mist on the **player**. Live `playerTurnStartModifierTarget` returns `undefined` because `syncCombatants` seeds `enemiesWithSpells` (no `id === "player"`) |
| 018 | `#596` Haste MP on the live player pool this turn | Duration-1 Haste currently never changes `currentBattleMp` |
| 019 | `#598` Slow / Haste on the summon walk/cast pool | `summonTurnBudget` resets from `maxAp`/`maxMp` only |
| 020 | `#597` and **`#709`** Sentinel Shield on the clicked ally summon | Duplicate vehicles. `resolveSpellCast` stamps `targetId: caster.id` |
| 013 Bite | `#644` treat catalog `spellType: "drain"` as player lifesteal | Vampire Bite (`effectType: "heal"`, `spellType: "drain"`) would drain/heal. Pacifist `offCats` still misses `"heal"` until 003 |
| 013 Soul Rend | `#647` land Soul Rend damage instead of a 0-tick DoT | Upfront 25 would fire. DoT tick still needs `dotDamagePerTurn` |
| 021 | `#658` honor catalog `res_sp` shreds in `getStatModifier` | Expose / Shadow Veil would actually cut RES and SP |
| 022 | `#659` apply Shield RES to enemy fallback melee | Crush / Fire Bolt fallback currently uses raw `characterStats.res` |
| 003 (kit half) | **`#714`** fail Pacifist after offensive **control-mode** kit casts | Control-mode Poison / Strike / Inferno would flip the feat. Bite / Mark / Slow-1 / `attract_multi` / the summon **spell** itself still would not |
| 003 (AI half) | **`#749`** (new since 09-28) auto-summon Pacifist helper | Unique-file tests only. `executeSummonAction` still has no `recordSpellType` on `main`. **WX wiring deferred** |
| 006 | **`#700`** copy kit Shield/Slow/Poison metadata on auto-summon casts | Restores AI DoT ticks **and** Slow stat. **Must not merge before 001** |
| **023** | **`#699`** apply ally Enrage to summon outgoing damage | Kit + auto-summon `dealDamage` currently pass `"player"` |
| **024** | **`#766`** (new since 09-28) bounce Chain Lightning once from the clicked primary | Live `applyDamageToEnemy` bounce runs per `hitsMultiple` occupant |

Combat-rule-parity occupant tickets (`#601`, `#607`, `#649` Trap, `#708` highlight/execute AP, `#757` summon-control highlight / enemy heal, `#762` kit AP+range decide vs execute) are **not** combo balance. Do not open EBMA IDs those PRs already own. Swap landing tax (`#754` / leftover-walk `#761`) is MIMA, not EBMA.

Closed on `main` (do not re-open):

- Pacifist failing on spell-range preview
- BuffShop mid-fight potions paying no-heal
- Inf-HP summon catalog writes
- Player-controlled summons ignoring Void Rift ticks
- Free player summon placement (0 AP)
- Attack Nearest Inferno cooldown skip on the player bar
- Drain no-heal (`onPlayerHealed` → `recordChallengeHealFromHpRestore`)
- Bomber Inferno as a **Day-1** cooldown launder (Bomber spawn AP 1 cannot pay Inferno 5)
- Preview pacifist, Sacrifice Untouchable as an EBMA ticket

---

## 1. Access model (what a player can actually bring)

There is still no observe → win → unlock path. “Discovered enemy spells” and “achievement/challenge spells” remain design docs, not live systems.

| Source | What enters the library | Spell grant? |
| :--- | :--- | :--- |
| `starterSpells` | All starter ids forced `isBaseSpell: true` (`WX` 2395–2408) | Always owned |
| `getSpellConfigs()` | Every `usableByPlayer !== false` id (`adminSafety.ts` 712–719; `WX` 2412–2440, minus `OLD_SPELL_NAMES_SET` at 2356–2388) | Catalog membership **is** ownership |
| Achievements | Doka only (`admin.mo` `defaultAchievements` 309–325) | No |
| Challenges | Doka / XP / badge | No |
| Recap / `applyRewards` | XP + Doka | No |
| `upgradeSpell` | Levels a known id; canister `10 * 2^level` | Must not grant |
| GameKey shop | Admin-approved keys | No spells |

Real loadout constraint: **8-slot bar**. The broken strategies below are 8-slot legal. `spell_master_8` (100 Doka) is a catalog-dump participation trophy, not a discovery combo.

Backend seed (`admin.mo` `defaultSpells` 168–191) that actually fires on the player path:

| Id | On paper | Live `resolvePlayerCast` | Class |
| :--- | :--- | :--- | :--- |
| `shadow_strike` | 35 dmg / 3 AP / CD 2 / diagonal | Damage loop | STRONG_BUT_HEALTHY |
| `thunder_clap` | 25 AoE / 4 AP / CD 3 | Damage loop via `hitsMultiple` | STRONG_BUT_HEALTHY |
| `void_collapse` | 80 AoE + pull / 12 AP / `minLevel` 30 | AoE damage only. Attract unused. 12 AP needs ~level 100 (`8 + floor(level/25)`). `minLevel` is **not** checked. `effectType` is `"attract_multi"` (not in Pacifist `offCats`) | NICHE until ~100, then STRONG_BUT_HEALTHY + Pacifist hole |
| `soul_rend` | DoT + 25 upfront | `effectType === "dot"` takes the DoT branch; no `dotDamagePerTurn` → 0 tick. Queued `#647` restores the 25 | UNDERPOWERED (inert) |
| `vampire_bite` | Drain 20 / heal 20 | Player `isDrainSpell` is `effectType === "drain"` (`spellEngine.ts` 633). Bite is `effectType: "heal"` + `spellType: "drain"` → 20 damage, **no heal**. Pacifist-legal even after `#714`. Queued `#644` would heal via `spellType` | UNDERPOWERED heal + **DOMINANT** Pacifist payload |
| `reflect_barrier` | Reflect next spell | Generic `buff` without `buffStat` / `isMirror` / `targetType: "self"` | UNDERPOWERED (inert) |

Enemy kits (`ENEMY_KITS` in `enemyAI.ts` 163–185) reuse starter ids. Seeing a bishop cast Frost teaches nothing and unlocks nothing.

---

## 2. Live gates (combo truth table)

| Gate | File | Live behavior |
| :--- | :--- | :--- |
| DoT append | `engine/dotStacks.ts` `appendDotStack` 31–37; `statusEffects.ts` `mergeIncomingEffect` 92–99; `WX` `applyActiveEffect` 1871–1892 | Same-type stacks add; no cap; independent durations |
| Player DoT apply | `spellEngine.ts` `resolvePlayerCast` 777–814 | Sets `dotDamagePerTurn` |
| Player damage debuffs | same, 876–1028 | **Does not** call `applyEffect` for `debuffStat` |
| Controlled-summon / enemy `resolveSpellCast` debuffs | `spellEngine.ts` 529–548 | **Does** apply `debuffStat`. Player-controlled Archer Slow is live **on the effect list** |
| `getStatModifier` keys | `statusEffects.ts` 45–63 | Exact `stat` match. `"res_sp"` never aliases `"res"` / `"sp"`. Expose / Shadow Veil are dead even after 004 writes them |
| `resolveSpellCast` heal vs buff | 507–558 | `buffStat` returns **before** `healAmount`. Wisp Blood Mend / Rally never heal. Buff `targetId` is **always** `caster.id` |
| Enemy / boss inline debuffs | `WX` inline | Apply; same `effectName` replaces; different names with the same `stat` add |
| Duration-1 AP/MP | `WX` `applyActiveEffect` 1871–1922 vs walk/cast `currentBattleMp`; turn start `processActiveEffects` 14275 **then** restore 14350–14365 | Haste (+2 MP, duration 1) never bumps the live pool. Next player turn ticks the row to 0 before restore. Swift Boots **does** bump (`WX` 3579–3581). Enemy Drain Courage AP −1 (duration 1) expires the same way |
| Summon turn budget | `summonTurnBudget` 356–363; `WX` 14520–14529 | Control-mode summons reset `currentAp`/`currentMp` from `maxAp`/`maxMp` only. Slow/Haste modifiers are ignored. Duration-1 ally Haste on a summon expires in `processActiveEffects` before the budget |
| Summon outgoing `dmg` | `WX` `playerSpellContext` `dealDamage` 9171–9183; summon-AI ctx 14997–15004 | Both pass `casterId: "player"` into `enemyTakesDamage` (3492–3494). Ally Enrage on a wolf is ignored. Self-cast Enrage still uses `"player"` and is fine |
| Summon cap | `gameConstants.ts` `ENEMY_SUMMON_CAP = 2` (300) | Enemy only. Player `spawnPlayerSummon` (`WX` 9582–9635) has no alive-cap. Comment at `enemyAI.ts` 1830 (“player-side summonCount gate”) is still false |
| Summon spell CD | `spellData.ts` 547–690 | No `cooldown` on the five kits |
| Summon kit CD | `summonControlCast.ts` `planSummonControlCast` 221–270 | AP, range, live geometry — **not** cooldown |
| Kit AP vs kit spell | `getSummonBaseStats` 229–232; `unitDef.ap` | Bomber 1 vs Inferno 5; Wisp 2 vs Mend 3 / Rally 4; Wolf 2 vs Venom 3; Sentinel 2 vs Iron Skin 3. Archer 2 vs Poison 2 **does** fire. Bomber AP = `1 + floor(slvl / 3)` → Inferno payable at **slvl 12** |
| Player summon AP | `challengeCompletion.ts` 330–331; `WX` 17162 | Charged |
| Pacifist execute | `WX` `recordPlayerSpellType` 17015–17033 | Offensive list: damage/drain/aoe/dot/pushback/attract/cc/teleport. **Not** summon/heal/debuff/defense/buff/`attract_multi`. Control-mode kit casts never call this hook on `main` (`#714` would). Auto-summon `executeSummonAction` never calls it (`#749` helper not wired) |
| Pacifist preview | `targeting.ts` 83–85 | Does not flip |
| Challenge heal (spells) | `WX` 17190–17196 | `targetType === "self" && effectType === "heal"` |
| Challenge heal (potions) | `challengeCompletion.ts` 231–236 | Counted in battle |
| Challenge heal (drain) | `WX` 9502–9508 `onPlayerHealed` | Counted when `healAmt > 0`. **005 closed** |
| Wisp / summon heal | `WX` `ctx.heal`; control-cast `WX` 9849–9869 | Only writes player HP for player ids; control-cast always targets `targetEnemy`; recorded delta is ref-after-setState (0) |
| Mending Mist on player | `battleSetup.ts` 364–368; `WX` 14262–14273 | Helper finds `id === "player"` in `combatantsRef` → `undefined` (`syncCombatants` seeds enemies only). Hook exists; player HP is not committed. `#443` is the restore |
| Summon-AI DoT | `summonExecutor.ts` 191–203 | `applyEffect` without `dotDamagePerTurn` or `stat`/`modifier`. `#700` would copy them |
| Player-controlled summon DoT | `WX` `castControlledSummonSpell` → `resolveSpellCast` | Ticks (Archer Poison) |
| Timestep | `spellEngine.ts` 634–636 then 680–718 then 721–733 | `self`+`buff` is `isShieldSpell`. No `buffStat` → silent `"cast"` **before** `isTimestep`. Inert on the live self-tile path |
| Mirror | `spellEngine.ts` 917–926 | `activateMirror` sits inside `if (targetEnemy \|\| hitsMultiple)`. Self tile spends 4 AP and never activates |
| Sacrifice | `spellEngine.ts` 749–763 | 20% `characterStats.hp` → 3× via `dealDamage` → `enemyTakesDamage` (Enrage / Titan / Glass apply). Mark / crit do not |
| Shield vs enemy spells | `WX` 16486–16490 | `getStatModifier("player", "res")` **does** apply |
| Shield vs fallback melee | `WX` 16703–16728 | `meleeRes` is raw `characterStats.res`. Shield / Iron Skin skipped. Shield Charm HP still absorbs (16751) |
| Chain Lightning bounce | `castHelpers.ts` 430–461; loop `spellEngine.ts` 1005–1015 | `hitsMultiple` calls `applyDamageToEnemy` per occupant; bounce retriggers from **each** hit. Queued `#766` gates to the clicked primary |
| Upgrade damage | `combatMath.ts` `calcScaledDamage` 130–136 | `base * 1.03^level`. Floors 0 to 1. Does **not** scale `dotDamagePerTurn` literals |
| Battle AP | `progression.ts` `getPlayerBaseStats` 59–72 | Floor 8; +1 every `apMpGrowthEveryNLevels` (default 25) |
| `hard_3` | `challengeCompletion.ts` 80–86, 126–127 | `maxApUsedInTurn <= 8`. Levels 1–24 cannot fail it |
| Enemy kit zone | `WX` 11920 + `buildEnemyKit` 194–199 | `currentMap.levelZone` is `{name,minLevel,maxLevel}` (`WX` 4683–4687). `Math.floor(object)` is `NaN`. Every kit stays zone 0 |
| Enemy summoner roll | `WX` 11932–11942 | `0.12 + playerLevel * 0.02` **per enemy**. 100% at level 44+. Global alive cap still 2 |
| Null Field | `mapModifiers.ts` 419–431 | Suppresses buff/debuff only. DoTs still apply |
| `minLevel` | `resolvePlayerCast` | Not enforced |

---

## 3. Combination reports

### 3.1 Unbounded player DoT recast — **BROKEN**

**COMPONENTS:** Poison Arrow (2 AP, 4/turn, 3 turns, no CD) + Venom Strike (3 AP, 4/turn, 3 turns, no CD) + Inferno (5 AP, 8/turn, 3 turns, CD 3). Optional: Arcane Surge / Arcane Overflow (−1 AP, min 1; both stack to still min 1). Optional: player-controlled Archer (`resolveSpellCast` Poison). Optional: BuffShop Battle Elixir (+3 AP this turn). Optional: `hard_3` (max AP used ≤ 8).

**COMBO_SEQUENCE:**

1. Equip Poison + Venom + Inferno (and optionally an Archer).
2. Each player turn: dump leftover AP into Poison recasts (4 stacks at 8 AP; 8 stacks under Surge; 5+ with Elixir).
3. Mix Venom / Inferno when the extra tick is worth the AP.
4. Stacks append (`appendDotStack`). They do not refresh. A 10-turn boss fight is a damage integral, not a 4+4+8 ceiling.
5. `hard_3` accepts `maxApUsedInTurn <= 8`. A full 8-AP Poison dump is legal for 150 Doka + 450 XP. At levels 1–24 the bar **is** 8, so the challenge cannot fail.

**ACCESS_REQUIREMENTS:** Starter library. Arcane Surge is a map-modifier roll. Archer is a starter summon. Elixir is a BuffShop item, not a spell unlock.

**WHY_IT_IS_STRONG:** Cost-to-stack is linear; duration is independent; there is no same-source cap. Long fights (boss, dungeon chain, boss rush) make the last recast strictly better than a front-loaded nuke. Inferno’s CD only gates the 8-tick, not Poison. Null Field does not suppress DoTs. Upgrade 3%/level never touches the 4-tick literal, so stack count is the real scaling.

**COUNTERPLAY:** Kill faster than the integral. RES reduces each tick once (summed). Enemy kits are stuck at zone 0, so they rarely apply cleanse or pressure that forces the player off the recast. Timestep cannot currently add a second dump (017). Haste cannot currently add walk MP for reposition (018).

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Late-game the **stack count** is the scaling, not the upgrade curve.

**PERSISTENCE/ECONOMY_IMPACT:** Faster clears → more `applyRewards` XP/Doka. Soft-destroys “spend Doka on spell levels” for damage spells because recast beats 3%/level on a 4-tick. `hard_3` converts the same dump into a challenge payout (016).

**RECOMMENDED_RESPONSE:** Same-source refresh or a small per-target / per-name cap. Keep Poison + Venom + Inferno as three different types that can coexist. Do not flatten DoT identity. Do not nerf Timestep, Battle Elixir, or Arcane Surge because they amplify one extra recast. See `EBMA-2026-09-29-001`. **Do not merge `#700` first** — AI Archer Poison would append the same uncapped integral onto the player.

---

### 3.2 Player summon flood — **DOMINANT**

**COMPONENTS:** Dire Wolf (3 AP) + Archer (3 AP) + Sentinel (3) + Bomber (2) + Wisp (2). No alive-cap. No summon-spell cooldown. Lifespan from `getSummonBaseStats` (`4 + floor(slvl / 2)`).

**COMBO_SEQUENCE:**

1. Turn 1 at 8 AP: Wolf + Archer + Wisp, or Wolf + two Wisps, or four Bombers.
2. Each summon gets its own turn (`type: "summon"`), own AP/MP budget, and (if player-controlled) a kit that goes through `resolveSpellCast` — including live Slow / ticking Poison **on the effect list**.
3. Next player turn: spawn again. Nothing evicts the previous wave except lifespan.

**ACCESS_REQUIREMENTS:** All five kits are starters. 8-slot bar is the only limiter.

**WHY_IT_IS_STRONG:** Action-economy multiplier. One player turn buys three extra turns of units that occupy tiles, body-block, and (when controlled) apply real DoTs and Slow. Enemy summons are capped at 2 with a 2-turn cadence; the player is not. AP cost only slows the first dump. Blitz (`legendary_2`, under 5 turns, 450 Doka / 900 XP) is the natural payout. Live **damage** is still Archer Poison + Wolf Strike; Sentinel/Wisp/Bomber kits are mostly occupancy until 014/015/020. Ally Enrage on a Wolf is currently a badge (023); after `#699` the flood’s Strike packets actually take 1.4× — still duration-gated, not a reason to skip the cap.

**COUNTERPLAY:** Focus the Wisp (enemy AI already scores it high). AoE (Thunder Clap / Chain Lightning / Lifesteal Nova). Lifespan expiry. Occupancy / portal-reserved cells prevent sealing exits. Void Rift now ticks controlled summons.

**RELATIVE_PROGRESSION_CONTEXT:** Spell-level buys HP (+10%/level), AP (+1/3 levels), MP, and lifespan. Cheap Doka upgrades on summon ids make the flood tankier without touching the missing cap. Pacifist 500 Doka funds the first spike.

**PERSISTENCE/ECONOMY_IMPACT:** Pacifist (3.3) converts the flood into 500 Doka. Summon UI advertises 10× upgrade cost; canister still charges `10 * 2^level`.

**RECOMMENDED_RESPONSE:** Player alive-cap (2–3) and a short summon-spell cooldown. Keep five identities. See `EBMA-2026-09-29-002`. Do not also give AI summons ticking DoTs until 001 lands (`006` / `#700`). Do not close ally-buff targeting as a substitute for a cap. Do not treat 019/020/023 as a flood nerf — those restore advertised kit identity.

---

### 3.3 Pacifist Run + summons / Bite / Mark / Slow-1 / attract_multi — **DOMINANT** (economy) — *escalated (AI path)*

**COMPONENTS:** Achievement `pacifist_run` (500 Doka, “Win a battle using only heal or buff spells”, `admin.mo` 324) + any of: damage summon (Wolf / Archer / Bomber) + Vampire Bite (`effectType: "heal"`, 20 damage) + Mark (`effectType: "debuff"`) + Slow / Weaken (`effectType: "debuff"`, `damage: 0` floors to 1) + Barrier / Mirror (`defense`) + Void Collapse (`attract_multi`).

**COMBO_SEQUENCE:**

1. Equip heals/buffs plus any of Bite, Mark, Barrier, Mirror, Slow, or a summon kit.
2. Cast them. `recordPlayerSpellType` only flips on `damage|drain|aoe|dot|pushback|attract|cc|teleport`.
3. Bite deals 20 through the damage loop and records `"heal"`.
4. Control-mode kit casts (`castControlledSummonSpell` → `resolveSpellCast`) **never** call that hook on `main`, so Archer Poison / Wolf Strike keep the feat. Queued `#714` flips after those kit resolves. It still treats Slow as legal, still misses Bite / Mark / `attract_multi`, and still misses the summon **spell** (`effectType: "summon"`).
5. **Auto-summon AI** (`handleSummonTurn` → `executeSummonAction`) also never calls `recordSpellType`. Leaving the Archer on AI still farms 500 Doka. Queued `#749` is a unique helper + tests; WorldExploration is not wired.
6. Recap fires `clientTrustedVictoryAchievementConditions` (`WX` 12483–12497) **and** Boss Rush room-clear uses the same list. Claim 500 Doka.

**ACCESS_REQUIREMENTS:** Starters + backend Bite if the catalog dump is live + the feat on the canister.

**WHY_IT_IS_STRONG:** The condition is implemented as “the player character did not resolve a listed `effectType`,” not “the player side dealt no damage / used only heal or buff.” Bite is a 20-damage spell that the feat treats as a heal. Control-mode **and** auto-summon AI are both invisible. That is the opposite of the advertised intent. `#644` would make Bite actually heal; it would still record `"heal"` and stay Pacifist-legal until 003. `#714` is necessary and not sufficient. `#749` is necessary for the AI half and not sufficient for Bite/Mark.

**COUNTERPLAY:** None on `main`. After `#714`, kit-clears fail the feat; AI-clears still would not until `#749` is wired. Bite / Mark / Slow-1 / Void Collapse / spawn-without-kit still have none.

**RELATIVE_PROGRESSION_CONTEXT:** 500 Doka is `upgradeSpell` fuel. A single legal pacifist clear funds several damage-spell levels or a summon-level spike (including the Bomber slvl-12 Inferno gate in 3.7).

**PERSISTENCE/ECONOMY_IMPACT:** Direct. `claimAchievementReward` credits the persist-lock wallet. Once per account, but the first 500 is a free spike if the player knows the hole.

**RECOMMENDED_RESPONSE:** Fail the feat unless every resolved **player** spell is heal, buff, Timestep, or (optionally) Mirror. Count player-side summon damage / offensive kit casts **and** the summon spell itself **and** auto-summon AI offense. Vampire Bite must fail it even while its heal metadata is still wrong, and **still fail it after `#644`**. Treat `"attract_multi"` as offensive. Keep preview off. Do not change the Doka amount. See `EBMA-2026-09-29-003`. Treat `#714` as the control-mode kit vehicle and `#749` as the AI vehicle — do not land a second copy of either hook; still ship Bite/Mark/Slow-1/`attract_multi`/summon-spell.

---

### 3.4 No-heal challenge + drain / Wisp — drain **closed** / Wisp still **DOMINANT** if it ever heals

Drain HP restores now set `healUsed` via `onPlayerHealed` (`WX` 9502–9508). BuffShop potions are counted. **Do not re-open 005.**

Live Wisp Blood Mend / Rally still do not restore player HP (`resolveSpellCast` returns on `buffStat` before `healAmount`; control-cast always passes `targetEnemy`). Queued `#550` / 015 would make Wisp a real heal; 015 must record `restoredHp > 0` so no-heal stays honest. Advertised Pacifist is heal/buff, so a working Wisp heal should **remain legal** for Pacifist and **fail** no-heal.

Vampire Bite’s heal is still inert on `main`. `#644` would make Bite fail no-heal via drain — that is the advertised spell, not a nerf.

---

### 3.5 Dead player-bar control kit — **UNDERPOWERED** (player bar) / **STRONG_BUT_HEALTHY** (controlled Archer Slow on the effect list)

**COMPONENTS:** Slow (`mp` −2 / 2), Frost Bolt (`mp` −1 / 1), Weaken (`dmg` 0.7 / 2), Expose / Shadow Veil (`res_sp`), Drain Courage (`ap` −1 / 1), Cursed Wound (`healRecv` 0.5), Life Drain (`sp` 0.8). Archer kit: Poison + Slow.

**COMBO_SEQUENCE (player bar):** Player casts any of the above through `resolvePlayerCast`. Damage (if any) applies. `debuffStat` is never written. Slow/Weaken `damage: 0` still poke 1 (`calcScaledDamage` floor) and stay Pacifist-legal.

**COMBO_SEQUENCE (controlled Archer):** Player-controlled Archer casts Slow through `resolveSpellCast` 529–548. The MP debuff **does** land on the effect list. Walk pool ignores it (019). AI Archer Slow still goes through `executeSummonAction` without `stat` (cosmetic until `#700`).

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost on the bar; Archer kit is a summon slot.

**WHY_IT_IS_STRONG:** The player bar is not. The cards advertise control that the player path cannot deliver. The **intended** Slow identity currently lives only on a controlled Archer, which is interesting synergy and should be kept if 002 caps the flood.

**COUNTERPLAY:** N/A on the bar. Kill the Archer to remove live Slow.

**RELATIVE_PROGRESSION_CONTEXT:** Upgrading Slow / Weaken on the bar spends Doka on a missing half of the spell. Expose / Shadow Veil also need 021 after the write.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend. Does not break the wallet.

**RECOMMENDED_RESPONSE:** Wire `debuffStat` after the player damage loop (do not skip damage). Skip the 1-floor on 0-damage debuffs. Then cap stacked AP/MP denial so the restored kit cannot lock a target at 0 AP/MP forever. See `EBMA-2026-09-29-004`. This is a restore, not a nerf. Do not strip Archer Slow. If `#528`/`#555` merge, keep 004 for the cap only.

---

### 3.6 Latent enemy AP/MP denial (Bishop + Archer Slow) — **NICHE** live / **DOMINANT** if kits grow

**COMPONENTS:** Bishop Frost Bolt + enemy Archer Slow (enemy summon kit). Same-stat additives in `getStatModifier` (`statusEffects.ts` 45–63).

**COMBO_SEQUENCE (if kits were zone-correct):** Frost (−1 MP, 1 turn) + Slow (−2 MP, 2 turns) = −3 on a 4-MP player. Refresh each enemy turn. Duration-1 Frost currently expires before restore (018), so even a restored kit needs the live-pool rail.

**LIVE SEQUENCE:** `buildEnemyKit(..., currentMap.levelZone)` stays zone 0. Bishops have Frost only. Slow is not on the bishop. Multiple Frosts **replace** by `effectName`. Live denial is −1 MP for 1 turn, and that −1 never hits the next-turn pool.

**ACCESS_REQUIREMENTS:** Live: any bishop pack. Latent: zone ≥ 1 kits + enemy Archer summon.

**WHY_IT_IS_STRONG (latent):** Player mobility is the positional game. −3 MP on a 4-MP pool is near-root. Different spell names stack; same name refreshes.

**COUNTERPLAY (latent):** Kill the bishop / archer; Haste (+2 MP, 1 turn — after 018); Timestep (once — after 017); Null Field (suppresses buffs/debuffs).

**RELATIVE_PROGRESSION_CONTEXT:** Zone growth is supposed to add Slow / Inferno / heals and never does.

**PERSISTENCE/ECONOMY_IMPACT:** None live.

**RECOMMENDED_RESPONSE:** Do **not** nerf Frost or Slow. Pass a numeric zone into `buildEnemyKit` so intended kits exist (`EBMA-2026-09-29-009`). If that ships, add a same-stat AP/MP stack cap on the enemy path (`004` covers both sides) and confirm duration-1 Frost still reduces next-turn MP (`018`). If `#700` lands Slow `stat` on AI Archers before 004’s cap, the latent denial becomes live on the **player** from a capped-2 enemy summon board — still duration-gated, still needs the floor.

---

### 3.7 Inferno cooldown circumvention via summons — **NICHE** Day-1 / **DOMINANT** at Bomber slvl 12 or after 014

**COMPONENTS:** Player Inferno (CD 3, 5 AP) + Bomber kit (`summonKit: ["spell-inferno"]`, spawn AP 1) + player-controlled `resolveSpellCast` (ticks).

**COMBO_SEQUENCE (Day-1):** Cast player Inferno; bar locks 3 turns. Spawn a Bomber. `planSummonControlCast` returns `no_ap` because Inferno costs 5 and Bomber has 1. **Not a live launder.**

**COMBO_SEQUENCE (slvl 12, no 014):** `getSummonBaseStats` AP = `1 + floor(12 / 3)` = 5. Controlled Bomber pays Inferno every summon turn. `planSummonControlCast` still has no cooldown map. Player Inferno CD is irrelevant.

**ACCESS_REQUIREMENTS:** Starter Bomber. Slvl 12 is canister `10 * (2^12 - 1) = 40_950` Doka if the player actually pays each step — reachable from Pacifist 500 + challenge farm + GameKey, not from a fresh slot.

**WHY_IT_IS_STRONG (late):** The only starter spell with a real cooldown can be laundered through a 2-AP spawn once the kit can pay. Combined with 3.1 this is extra uncapped burn.

**COUNTERPLAY:** Kill the Bomber (0.5 HP scale). Lifespan still grows with slvl (`4 + floor(12/2) = 10` turns).

**RELATIVE_PROGRESSION_CONTEXT:** Early: occupancy body-block only. Mid/late: upgrade-gated Inferno engine unless 010 lands first.

**PERSISTENCE/ECONOMY_IMPACT:** Indirect (faster clears) once payable.

**RECOMMENDED_RESPONSE:** Per-summon cooldown map for kit ids that declare `cooldown`. Do not ship Bomber 5 AP (014) without this lock. Do not wait for 014 — slvl 12 already opens it. See `EBMA-2026-09-29-010`.

---

### 3.8 Titan’s Vigor × Glass Realm × Sacrifice — **STRONG_BUT_HEALTHY** (monitor)

**COMPONENTS:** Map modifiers Titan’s Vigor (`+1000` HP on `applyBattleStart`; `onDamageDealt` 1–5×) + Glass Realm (×2 on the same hook) + Sacrifice (20% current `characterStats.hp` × 3). Optional interaction: Chain Lightning **bounce** already uses `enemyTakesDamage` (024), so a bounce hop on a Glass+Titan map can take the lottery while the primary `hitsMultiple` write does not.

**COMBO_SEQUENCE:**

1. Roll both modifiers (independent map rolls; not guaranteed).
2. Sacrifice reads `characterStats.hp` (Titan’s store-HP bump may not be on that object — `applyBattleStart` mutates `combatantsRef`, which does not include the player).
3. `dealDamage` → `enemyTakesDamage` → `applyDamageDealt` applies Titan roll then Glass.

**WHY_IT_IS_STRONG:** Lottery on a path that already ignores Mark/crit. Main-bar nukes (Strike, Shadow Strike, primary Chain Lightning) **do not** go through `enemyTakesDamage`, so they do **not** get the 1–5× / ×2. The scary packet is Sacrifice-only **plus** CL bounce hops (024). Vampiric Ground is on the same hook, so it also misses the main bar.

**COUNTERPLAY:** Don’t stand next to the target (range 1). Mirror (after 017). Don’t pick Sacrifice on a Glass map. After 024, bounce hops stop stacking per occupant so the lottery is one chain, not N.

**RELATIVE_PROGRESSION_CONTEXT:** Modifier luck, not a loadout.

**PERSISTENCE/ECONOMY_IMPACT:** None beyond a lucky one-shot.

**RECOMMENDED_RESPONSE:** Monitor. Do not nerf Sacrifice or the modifiers unless play data shows every Glass+Titan map is a skip-or-Sacrifice binary. Occupant-required Sacrifice (`#607`) is CRP, not this ID. See `EBMA-2026-09-29-008`. Do not flatten Titan because CL bounce currently shares the hook — 024 owns the extra hops.

---

### 3.9 Enrage + Mark + Crit + Fury / Blood Moon — **STRONG_BUT_HEALTHY** (player bar)

**COMPONENTS:** Enrage (×1.4 dmg, 2 turns, 3 AP) + Mark (×2 next hit, 2 AP) + CHC crit (×2) + Fury potion (×1.25, 3 turns) + Blood Moon (×1.25, map). Optional: player Enrage on an allied Wolf (`targetType: "ally"` resolves in `resolvePlayerCast` 676–718) — **badge only until 023**. Optional: Expose 15 upfront (the RES/SP shred is dead — 021).

**COMBO_SEQUENCE:** Enrage → Mark tile → nuke (Shadow Strike 35 or Chain Lightning). Setup is 5 AP before the hit; 8 AP bar leaves 3 for the nuke (Shadow Strike fits). Ally-Enrage on a Wolf is a second payload on the summon’s turn **only after `#699`**.

**WHY_IT_IS_STRONG:** Multipliers compose on the **player** path. Shadow Strike (backend seed) is the best payload. Ally-Enrage targeting is honest; the outgoing multiply is missing (023). Expose does **not** currently multiply this package. Chain Lightning in packed rooms currently **also** double-dips bounce (024) — that is a separate degenerate, not a reason to nerf Mark/Enrage.

**COUNTERPLAY:** RES/SR. Don’t stand on the marked tile. Kill the caster during the setup turn. Paper Windstorm miss. Mirror (after 017). Kill the Wolf.

**RECOMMENDED_RESPONSE:** Preserve the player-bar burst identity. Do not touch Mark, Enrage numbers, or ally-buff targeting because the product is large. Restore Expose via 004+021; restore summon outgoing via 023; gate CL bounce via 024. Do not also nerf any of them when they start working.

---

### 3.10 Shield + Iron Skin (+ Sentinel / ally target) — **STRONG_BUT_HEALTHY** vs spells / **UNDERPOWERED** vs fallback melee

**COMPONENTS:** Both `buffStat: "res"`, `buffModifier: 1.3`, different `effectName` → multiplicative 1.69× RES for 3 turns. Sentinel kit can apply both (to itself — 020). Player Shield/Iron Skin can land on an allied summon (`resolvePlayerCast` 676–718).

**WHY_IT_IS_STRONG (spell path):** Enemy kit casts at `WX` 16486–16490 multiply `characterStats.res` by `getStatModifier("player", "res")`. Durable, not immortal. Costs 5 AP (or a Sentinel turn). Null Field suppresses. Duration is short.

**WHY_IT_IS_WEAK (fallback melee):** `WX` 16722–16728 uses raw `characterStats.res`. Crush / Fire Bolt ignore Shield and Iron Skin. Shield Charm HP absorb still works. Zone-0 knights often go through the **spell** Strike path, so this is not every melee; it is the `kind === "melee" || !didAct` fallback.

**RECOMMENDED_RESPONSE:** Preserve the 1.69× identity. Restore the melee path (`EBMA-2026-09-29-022` / `#659`). Do not flatten Shield+Iron Skin because the product is 1.69.

---

### 3.11 Timestep + Haste + Rally — **UNDERPOWERED** live (inert) / **STRONG_BUT_HEALTHY** after 017+018+012

**COMPONENTS:** Timestep (once, restores formula AP/MP + additives) + Haste (+2 MP, 1 turn) + Rally / Blood Mend (heal + advertised CHC).

**LIVE:** Timestep never reaches `restoreApMp` on a legal self tile (`isShieldSpell` returns first). Haste never bumps `currentBattleMp`. Blood Mend / Rally heal on the player bar; CHC never reaches the crit roll. Kit Blood Mend never heals (015).

**AFTER RESTORE:** One extra full bar per fight is a real decision, not a loop. Combined with 3.1 it is an amplifier (one extra Poison dump); the loop is still the missing DoT cap, not Timestep.

**RECOMMENDED_RESPONSE:** Restore Timestep/Mirror (`017` / `#496`), Haste live pool (`018` / `#596`), and CHC as +15 points (`012`). Do not nerf any of them after restore. Do not leave Timestep dead as a `hard_3` brake (`016`).

---

### 3.12 Swap / Barrier / Mirror — **STRONG_BUT_HEALTHY** (Swap has a hazard hole; Mirror inert on self)

**COMPONENTS:** Swap (3 AP, `effectType: "teleport"` — **does** flip Pacifist), Barrier (3 AP, 3-turn tile; copy says 2), Mirror (4 AP, next single-target reflect; `activatePlayerMirror` is wired but never called from a self tile).

**WHY_IT_IS_STRONG:** Positional and reactive. Swap onto lava/ice/rift does **not** run walk hazards (MIMA / queued `#754` `#761`, not EBMA). That is a challenge-integrity hole (Untouchable) more than a damage loop.

**RECOMMENDED_RESPONSE:** Do not nerf Swap. Hazard landing belongs to the MIMA ticket. Pacifist-legal Barrier is owned by 003. Mirror restore is 017.

---

### 3.13 Backend catalog + 8-slot bar — **NICHE** (discovery still inert)

There is no achievement-spell or enemy-discovery combination on the live path. The only extra combo space from the canister is Shadow Strike / Thunder Clap / late Void Collapse sitting next to starters, plus inert Bite / Soul Rend / Reflect. That is a **catalog dump**, not a discovery reward.

**RECOMMENDED_RESPONSE:** Do not invent unlocks in this PR. Point implementers at existing `SDA-2026-08-31-002` … `004` / `SDE-2026-08-31-001` … `003`. See `EBMA-2026-09-29-007`. Restore Bite / Soul Rend / Reflect metadata so the dump is at least honest (`013`). `#644` / `#647` are vehicles for Bite drain and Soul Rend upfront — not a second implementation.

---

### 3.14 Late-game enemy summoner density — **STRONG_BUT_HEALTHY**

**COMPONENTS:** `ENEMY_SUMMONER_CHANCE_BASE + level * 0.02` per enemy + Wolf/Archer kits + `ENEMY_SUMMON_CAP = 2`.

**WHY_IT_IS_STRONG:** By level 44 every trash mob is a summoner. The cap and 2-turn cadence keep this from flooding. Comment in `gameConstants.ts` 295–297 still says “~12% of packs.” AI enemy summons still do not tick DoTs (until `#700`).

**RECOMMENDED_RESPONSE:** Retarget the roll to pack-level / zone if the board feels noisy. Not a P0. See `EBMA-2026-09-29-011`. If `#700` merges after 001, density stays a feel ticket, not a DoT integral.

---

### 3.15 Ally-buff summons (Enrage / Shield / Haste on kits) — **UNDERPOWERED** Enrage outgoing / **STRONG_BUT_HEALTHY** targeting honesty

**COMPONENTS:** `resolvePlayerCast` ally branch (676–718) + Enrage / Shield / Iron Skin / Haste + any player-side summon.

**WHY_IT_IS_STRONG (targeting):** The spells already said “ally.” Landing them on a Wolf or Sentinel is the identity working. 1.69× Sentinel RES is large but duration-gated and Null-Field-vulnerable **when the effect is on the right id** (020). Ally Haste on a summon expires before `summonTurnBudget` (019).

**WHY_IT_IS_WEAK (Enrage packet):** `playerSpellContext.dealDamage` (`WX` 9171–9183) and the player-side summon-AI ctx (`WX` 14997–15004) both call `enemyTakesDamage(..., "player")`. `enemyTakesDamage` multiplies by `getStatModifier(casterId, "dmg")` (3492–3494). Enrage on the wolf never changes Strike / kit damage. Self-cast Enrage on the player path is unchanged and healthy.

**RECOMMENDED_RESPONSE:** Preserve targeting. Do not close ally targeting to “fix” 3.2. Cap the flood instead. Restore summon-pool Haste/Slow via 019. Restore outgoing Enrage via 023 / `#699`. After 023, 1.4× Wolf is STRONG_BUT_HEALTHY — do not nerf 1.4 because it starts working.

---

### 3.16 Expose / Shadow Veil `res_sp` shred — **UNDERPOWERED**

**COMPONENTS:** Expose (`debuffStat: "res_sp"`, 0.8 / 2, 15 dmg) + Shadow Veil (`res_sp`, 0.85 / 2, 18 dmg) + intended follow-up (Mark + Shadow Strike, or any SR/RES-sensitive nuke). Enemy / controlled-summon `resolveSpellCast` **does** write `stat: "res_sp"` if those ids are on a kit.

**COMBO_SEQUENCE:** Cast Expose. Damage 15 lands. `getStatModifier(target, "res")` and `getStatModifier(target, "sp")` stay 1 because they look for exact `"res"` / `"sp"`. The advertised −20% RES and SP never happen. Same for Shadow Veil −15%. Wiring 004 without 021 leaves the player-bar write equally inert.

**ACCESS_REQUIREMENTS:** Starters. 8-slot opportunity cost.

**WHY_IT_IS_STRONG:** It is not. The intended shred × Mark × Shadow Strike package is the healthy burst identity with a missing half, not a broken loop.

**COUNTERPLAY:** N/A (player is missing the tool).

**RELATIVE_PROGRESSION_CONTEXT:** Doka spent on Expose buys 15 damage and a lie.

**PERSISTENCE/ECONOMY_IMPACT:** Wasted upgrade spend.

**RECOMMENDED_RESPONSE:** Alias `res_sp` (and any documented dual key) onto both `res` and `sp` inside `getStatModifier`, **or** write two effects at apply time. Do not change 0.8 / 0.85. Do not land a second copy if `#658` merges. Complements 004; do not wait on 004 for enemy-applied shreds. See `EBMA-2026-09-29-021`.

---

### 3.17 Chain Lightning `hitsMultiple` × bounce-from-every-occupant — **DOMINANT** (packed rooms) — *new*

**COMPONENTS:** Chain Lightning (`starter-blast`, 4 AP, 20 dmg, `hitsMultiple: true`, `bounces: 2`) + `getAoETargets` range expansion from the click (`castHelpers.ts` 124–136) + `applyDamageToEnemy` bounce (`castHelpers.ts` 430–461) called once **per** occupant from `resolvePlayerCast` (`spellEngine.ts` 1005–1015). Optional: Enrage / Mark / crit / Fury / Blood Moon on the primary writes. Optional: Titan/Glass on bounce hops only (`enemyTakesDamage`).

**COMBO_SEQUENCE:**

1. Click any hostile in a 3-pack (or larger) inside Chebyshev range 4.
2. `hitsMultiple` already deals full scaled damage to every occupant in range.
3. Each of those `applyDamageToEnemy` calls then sorts other hostiles by Manhattan distance and deals `floor(finalDmg * 0.5)` and `floor(finalDmg * 0.25)` again.
4. Three occupants ≈ three full hits **plus** three bounce chains. Advertised identity is “primary then bounce to 2 nearest.”

**ACCESS_REQUIREMENTS:** Starter library. Day-1. 8-slot legal.

**WHY_IT_IS_STRONG:** Packed rooms (dungeon extras, bishop packs, Boss Rush) make leftover-AP CL strictly better than Strike / Shadow Strike. The extra hops also travel `enemyTakesDamage`, so Glass × Titan can lottery the **bounce** while the primary write does not. This invalidates single-target in any fight with 3+ hostiles in range 4. It is not interesting synergy — it is the same spell paying twice.

**COUNTERPLAY:** Spread out (enemy kits do not). RES on each hop. Paper Windstorm on the primary. Kill the pack before the second CL. Mirror does not eat AoE.

**RELATIVE_PROGRESSION_CONTEXT:** Available at level 1. Upgrade 3%/level scales both the full hits **and** the extra hops.

**PERSISTENCE/ECONOMY_IMPACT:** Faster packed clears → more `applyRewards`. Soft-pushes the 8-slot bar toward CL over Thunder Clap (which is honest AoE without bounce stacking).

**RECOMMENDED_RESPONSE:** Gate bounce to the occupant of the **clicked** tile so hops run once per cast. Keep `bounces: 2` and the 50%/25% formula. Do not nerf 20/4. Do not remove `hitsMultiple`. Treat `#766` as this vehicle — do not land a second bounce helper (`#441` already owns `pickChainBounceTargets`). After restore, re-classify CL STRONG_BUT_HEALTHY. See `EBMA-2026-09-29-024`.

---

## 4. Classification board (player-accessible)

| Package | Class | Intervene? |
| :--- | :--- | :--- |
| Poison recast / Poison+Venom+Inferno (+ Arcane Surge / Elixir) (+ `hard_3`) | BROKEN | Yes — cap / refresh |
| Player summon flood (5 kits, no cap/CD) | DOMINANT | Yes — cap + kit CD |
| Pacifist + summon / Bite / Mark / Slow-1 / attract_multi / auto-summon AI | DOMINANT | Yes — advertised categories; `#714` kit + `#749` AI; keep preview fix |
| Chain Lightning hitsMultiple × bounce-from-every-occupant | DOMINANT | Yes — gate bounce to clicked primary (`#766`); do not nerf 20/4 |
| No-heal + drain | closed | Do not re-open |
| No-heal + Wisp | latent DOMINANT | Count real heals when 015 lands |
| Inferno via Bomber | NICHE Day-1 / DOMINANT at slvl 12 | Yes — kit cooldown before AP raise |
| Shadow Strike + Mark + Enrage (player bar) | STRONG_BUT_HEALTHY | No |
| Ally Enrage on kits (outgoing) | UNDERPOWERED live | Restore 023; then healthy |
| Shield + Iron Skin vs spells | STRONG_BUT_HEALTHY | No |
| Shield + Iron Skin vs fallback melee | UNDERPOWERED | Restore melee RES (022) |
| Ally Haste on kits | UNDERPOWERED live | Restore 018/019, then healthy |
| Timestep / Mirror on self | UNDERPOWERED (inert) | Restore 017; then healthy; do not nerf |
| Sacrifice + Titan + Glass | STRONG_BUT_HEALTHY | Monitor |
| Thunder Clap | STRONG_BUT_HEALTHY | No |
| Chain Lightning after 024 | STRONG_BUT_HEALTHY | After `#766` only |
| Swap / Barrier | STRONG_BUT_HEALTHY | Hazard landing is MIMA |
| Enemy summoner density (capped 2) | STRONG_BUT_HEALTHY | Soft formula fix |
| Controlled Archer Slow (effect list) | STRONG_BUT_HEALTHY | Restore the bar and the walk pool; keep the kit |
| Bishop Frost only (zone 0) | NICHE | Restore zone number |
| Void Collapse (12 AP) | NICHE | Don’t enforce `minLevel` as a surprise nerf |
| Player Slow/Weaken/Expose/Frost/Courage | UNDERPOWERED | Restore `debuffStat` + 0-floor skip + `res_sp` |
| Soul Rend / Vampire Bite heal / Reflect Barrier | UNDERPOWERED | Metadata, not a nerf |
| Blood Mend / Rally CHC half | UNDERPOWERED | Wire `chc` as +15 points |
| Kit Blood Mend / Rally / Sentinel Shield-on-ally | UNDERPOWERED | Targeting + heal order + AP |
| AI summon DoTs / AI Bomber kamikaze / AI Slow | UNDERPOWERED | Only after DoT cap (DoTs); Slow restore is 004/006 adjacent; `#700` waits on 001 |
| `hard_3` at AP 8 | DOMINANT (challenge) | Relativize the cap |
| Expose / Shadow Veil shred | UNDERPOWERED | Alias `res_sp` |

---

## 5. What not to touch

- RAF loop, map generation, turn order, damage formula (`calcScaledDamage` 3%/level).
- Mark, Enrage 1.4, Timestep-once (after restore), Mirror identity, Barrier geometry, Swap’s teleport identity, ally-buff targeting.
- Chain Lightning 20/4/`bounces: 2` numbers — 024 is a double-apply gate, not a damage nerf.
- 3% upgrade curve. Economy bugs around summon advertised cost vs canister debit are already owned by persist work.
- Inventing observe-to-unlock in this automation. That is SDA / SDE.
- Reverting the Pacifist preview fix.
- GameKey shop numbers (out of combat-combo scope).
- Occupancy dual-path unseal / Void Rift summon tick / drain no-heal / Attack Nearest Inferno CD (closed correctly).
- Nerf Battle Elixir or Arcane Surge because they amplify Poison recast (001 owns the integral).
- Duplicate implementations of `#496`, `#528`, `#555`, `#550`, `#596`, `#598`, `#597`/`#709`, `#644`, `#647`, `#658`, `#659`, `#714`, `#749`, `#700`, `#699`, `#766`, `#441`.
- CRP `#762` kit AP+range decide/execute (not 014). MIMA `#754`/`#761` Swap landing.

---

## 6. Prior ACTION_ID disposition

| Prior | 2026-09-29 | Notes |
| :--- | :--- | :--- |
| 001 DoT cap | Reissued as 001 | Still true; `#700` must wait |
| 002 Summon cap + CD | Reissued as 002 | AP still charged; cap/CD still missing |
| 003 Pacifist | Reissued as 003 | **Escalated** — `#714` control-mode; `#749` AI helper unwired; Bite/Mark/Slow-1/`attract_multi`/summon-spell remain |
| 004 Player debuff + stack cap | Reissued as 004 | Bar still dead; `#528`/`#555` still unmerged |
| 005 Challenge drain | **Stays closed** | Drain counted. Wisp is 015 |
| 006 AI DoT ppt | Reissued as 006 | `#700` is the vehicle; **blocked on 001** |
| 007 Catalog ≠ ownership | Reissued as 007 | Still inert; point at SDA/SDE |
| 008 Titan × Glass | Reissued as 008 | Still Sacrifice-only hook (+ CL bounce hops, owned by 024) |
| 009 Numeric zone | Reissued as 009 | Call site still passes the object |
| 010 Kit cooldown | Reissued as 010 | Still escalated — slvl 12 Bomber pays Inferno without 014 |
| 011 Enemy summoner chance | Reissued as 011 | Still per-enemy × player level |
| 012 CHC buff restore | Reissued as 012 | Heal branch still returns without writing CHC |
| 013 Bite / Soul Rend / Reflect | Reissued as 013 | `#644` Bite drain; `#647` Soul Rend 25; Reflect still inert |
| 014 Kit AP align | Reissued as 014 | Still true; pair Bomber with 010; `#762` is CRP decide/execute, not this ID |
| 015 Wisp heal targeting | Reissued as 015 | `#550` buff-before-heal only |
| 016 `hard_3` relative cap | Reissued as 016 | Levels 1–24 still cannot fail |
| 017 Timestep / Mirror self tile | Reissued as 017 | `#496` still unmerged |
| 018 Duration-1 live pool | Reissued as 018 | `#596` still unmerged |
| 019 Summon walk/cast pool | Reissued as 019 | `#598` still unmerged |
| 020 Sentinel kit ally target | Reissued as 020 | `#597` **and** `#709` — pick one |
| 021 `res_sp` alias | Reissued as 021 | `#658` still unmerged |
| 022 Shield melee RES | Reissued as 022 | `#659` still unmerged |
| 023 Ally Enrage outgoing | Reissued as 023 | `#699` still unmerged |
| — | **New 024** | Chain Lightning bounce-from-every-occupant (`#766`) |

---

## 7. Search checklist (this pass)

| Pattern | Result |
| :--- | :--- |
| Excessive damage/AP combinations | 3.1 DoT recast; 3.9 burst (healthy on the player bar); **3.17 CL bounce double-dip** |
| Infinite / near-infinite loops | DoT append has no cap; summon recast limited only by AP + lifespan |
| Permanent control | Player-bar denial dead; latent after 009+004+018 |
| AP/MP denial chains | Latent 3.6; live Archer Slow is kit identity (walk ignored) |
| Summon abuse | 3.2 flood; 3.7 Inferno launder at slvl 12; 3.15 Enrage badge |
| Cooldown circumvention | 3.7 late; Attack Nearest Inferno **closed**; Day-1 Bomber **closed** |
| Healing loops | Drain **closed**; Wisp inert until 015; Bite heal inert until `#644`/013 |
| Defensive immortality | Shield+Iron Skin duration-gated vs spells; skipped on fallback melee |
| Status stacking | DoT append BROKEN; non-DoT replace-by-name; `res_sp` never stacks because it never applies |
| Displacement loops | Swap identity healthy; hazard landing is MIMA; Void Collapse attract unused |
| Hazard combinations | Swap × lava is MIMA, not EBMA |
| Achievement-spell combinations | No spell grants. Pacifist is an achievement × existing kit combo (now also auto-summon AI). `spell_master_8` is catalog dump |
| Enemy-discovery spell combinations | Discovery inert. Catalog dump is not discovery |

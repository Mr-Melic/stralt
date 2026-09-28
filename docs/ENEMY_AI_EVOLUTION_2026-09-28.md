# Advanced Enemy AI Evolution — 2026-09-28 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-28  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-28.md`](./automation/ACTION_IDS_AEE_2026-09-28.md)

This increment re-reads the live engine one day after the 2026-09-27 catalog. SYS-01…65 and FUT-01…83 stay **PROPOSED** on their own files; they are **not** re-filed here except where a 09-27 fact is **wrong** (SYS-61’s “pack never calls `applyDamageDealt`”; SYS-63’s “pack spell does not soak Shield Charm”). New work is: the pack→player spell mitigation pipeline (SP then RES, then `playerTakesDamage` RES **again**, plus shield), the `enemyTakesDamage` return that discards registry output, the melee HP fork, initiative-strip dummy combat stats, acting-side Paper Windstorm miss rates, and player-only Fury / Blood Moon / Mirror Field / Titan's Vigor paths.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Not on this checkout. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Not on this checkout. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |
| [#644](https://github.com/Mr-Melic/stralt/pull/644) (draft) | (player drain) | Catalog `spellType` drain as player lifesteal. Not live; do not give enemies drain-as-heal until it ships **and** SYS-38 exists. |
| [#647](https://github.com/Mr-Melic/stralt/pull/647) (draft) | (Soul Rend apply) | Do not emit Soul Rend in kits until apply lands real damage (SYS-02 / SYS-39 class). |
| [#649](https://github.com/Mr-Melic/stralt/pull/649) (draft) | (Trap tiles) | Ground trap legality is player-side until a profile + SYS-13 exist. |
| [#654](https://github.com/Mr-Melic/stralt/pull/654) (draft) | (void holes) | Map-gen void vs live gate. Occupancy already refuses `voidTiles` in `isCellFree`. |
| [#658](https://github.com/Mr-Melic/stralt/pull/658) (draft) | (RES/SP shreds) | Catalog shreds in `getStatModifier`. Scoring may read the result after it ships; do not change `calcScaledDamage`. |
| [#659](https://github.com/Mr-Melic/stralt/pull/659) (draft) | (Shield RES melee) | Distinct from SYS-63 `shieldHpRef` **and** from this file’s SYS-66 (`playerTakesDamage` soak on spells). |
| [#700](https://github.com/Mr-Melic/stralt/pull/700) (draft) | (player auto-summon kit metadata) | Player-side Shield/Slow/Poison copy. Not pack decide. |
| [#709](https://github.com/Mr-Melic/stralt/pull/709) (draft) | (Sentinel Shield on ally) | Player click-heal RES. Not pack healer apply (SYS-05). |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-09-28)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…27: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only; `applyApCost` at WX 10335 / 17129), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-28 grep of the module). Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*` (SYS-37 / FUT-43).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 128–137). That fork is honesty: player upgrade `maxRange` is not an enemy kit field.

### 1.2 Line numbers vs 2026-09-27 (P0 sites did not move)

| Fact | 2026-09-27 | Live (2026-09-28) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** |
| Executor gate `side === "player"` | WX 14980 | **14980** (SYS-55) |
| `aiTier >= 5` erratic | WX 15508 | **15508** |
| `aiTier >= 10` betrayal | WX 15595 | **15595** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423**; `battleSetup.ts` **394–406** (SYS-58) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply SP then RES | WX 16475–16537 | **16475–16537** (SYS-37 formula) **then** `playerTakesDamage` (SYS-66) |
| `playerTakesDamage` RES + shield | (SYS-63 melee-only soak) | WX **3429–3438** (SYS-66 supersedes spell-path split) |
| `enemyTakesDamage` registry | WX 3499–3516 | **3499–3516**; **returns `dmg` not `_dmgAfterMods`** at **3538** (SYS-67) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| Pack melee private HP write | WX 16763–16766 | **16763–16766** (SYS-68) |
| Shield melee soak | WX 16750–16761 | **16750–16761** (still melee-only in this block) |
| Strip AP=`level` | WX 17402–17411 | **17402–17411**; also `res: 0`, `sp: 0`, `chc: 2`, `atk: e.level * 2` (SYS-69) |
| Paper Windstorm pack 50% miss | WX 16491 / 16729 | **unchanged**; **player** miss is **30%** at **9563–9568** (SYS-70) |
| Fury / Blood Moon | (not called out) | `spellEngine.ts` **895–898**; WX fury **3588** / **14290** (SYS-71) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| Pack snapshot fields | WX 16279–16301 | **16279–16301** — still no `res`/`sp`/`sr`/`currentAp` |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 38–54 | **unchanged** |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…09-27 honesty. Then this file’s SYS-66…71. Do not start FUT-84+ first.

### 1.3 Still true — do not re-file (parent / 09-21…09-27)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for **AP/MP**. SYS-54. This file’s SYS-69 is the **remaining** dummy combat stats on the same strip (`res`/`sp`/`chc`/`atk`).
- Hostile summons skip the paid executor. SYS-55.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only. SYS-58.
- Pack/summon Plague+Void store ticks. SYS-60. Do not implement SYS-59’s “pack immunity.”
- Glass/Vampiric on pack→**player** still skip `applyDamageDealt`. SYS-61 remains true for that hit. SYS-67 covers pack→**summon**.
- Pack dest-commit vs reserved. SYS-62.
- Shield Charm remaining is public. SYS-63 snapshot still required; **spell-path “no soak” is superseded by SYS-66**.
- Enumerator `applyApCost`. SYS-64.
- Null Field vs non-DoT. SYS-65.
- Hidden crit. FUT-57.
- Parent FUT-21 (Paper Windstorm expected miss) is still a one-line stub. This file’s SYS-70 is the **asymmetric rate**, not a re-file of FUT-21.
- `engine/summonAI.ts` `runSummonAI` remains unused.

`hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.

### 1.4 New honesty gaps (this increment)

1. **SYS-37’s one-pass SP×RES formula is not what pack→player spells deal.** Apply first multiplies by `(1 - plSpEff/100) * (1 - plResEff/100)` (WX **16475–16537**). For the player (not a summon) it then calls `playerTakesDamage` (**16566–16569**), which applies **player RES again** (`Math.max(1, round(dmg * (1 - effRes/100)))` at **3429–3432**) and **soaks `shieldHpRef`** (**3433–3438**). SYS-37 told scorers to stop at the first pair. SYS-63 said pack **spell** apply does not soak shield — that is **false** once the hit goes through `playerTakesDamage`. Live HUD SR (`characterStats.sr`) is **not** in this pipeline; pack apply uses **SP as if it were incoming mitigation**. Killable-now that uses one RES pass, or SR, overestimates damage (a cheat). SYS-66.

2. **`enemyTakesDamage` always runs `applyDamageDealt` but returns the pre-mod `dmg`.** Store HP uses `_dmgAfterMods` (**3517**); the function returns `dmg` (**3538**). Pack spell/melee vs a **player-side summon** routes through this helper (16550–16557, 16734–16742), so Glass Realm ×2, Vampiric Ground 15%, and Titan's Vigor 1–5× **do** hit those summons. SYS-61’s “pack never calls the registry” is true only for pack→**player**. Callers then set `actualDmg = dmg` (16558), so logs / challenge / EV that trust the return lie when Glass doubled the store hit. Player-summon `dealDamage` (WX **15002–15003**) also returns the input `amount` and hard-codes casterId `"player"`. SYS-67.

3. **Pack melee vs the player is a second HP pipeline.** Comment at **16773–16776**: melee does **not** use `playerTakesDamage`. It applies raw `characterStats.res` **without** `getStatModifier` (**16722–16728**), soaks shield in this block (**16750–16761**), then `setCharacterStats` (**16763–16766**). No SP term (physical — matches player `computeDamage`). No second RES. If a later PR “unifies” melee into `playerTakesDamage` without removing this soak, Shield Charm absorbs twice. Distinct from open #659 (RES on melee formula). SYS-68.

4. **Initiative strip dummy combat stats.** SYS-54 is AP=`enemy.level` / MP=`level/2` (`resolveEnemyApMp`, `summonIntegration.ts` 195–209; strip WX **17402–17411**). The same mapper also writes `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2` for every non-player row. FUT-32 / SYS-10 must **not** treat those as visible RES/SP/CHC/ATK. Player row copies live RES/SP/CHC — that half is honest. SYS-69.

5. **Paper Windstorm is not one public miss chance.** Registry copy says “ranged spell reach halved” (`mapModifiers.ts` 249–257) and is a no-op marker. Player `spellEngine` miss callback is **30%** (WX **9563–9568**). Pack kit ranged and Fire Bolt are **50%** when `spellRange > 1` (**16491–16495**, **16729–16732**). FUT-21 must use the **acting side’s** live rate, not 50% for the player and not a range-halve that targeting does not apply to AI (`enemySpellRange` is still `Number(spell.range)`). SYS-70.

6. **Fury Potion, Blood Moon, Mirror Field, and Titan's Vigor are path-specific.** `spellEngine.ts` 895–906 multiplies **player** outgoing damage by Blood Moon 1.25 and Fury 1.25, and may 20% reflect on Mirror Field. Pack frost never enters that function. Titan's Vigor `onDamageDealt` (`mapModifiers.ts` 311–315) only runs inside `applyDamageDealt` (SYS-61/67). ADV-01 may read **public** Fury (`furyRef` log at 3588 / wear-off 14290) as *player* threat. Pack outgoing EV must not steal 1.25 or a 1–5× Titan roll on pack→player hits. SYS-71.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, ally-heal fallback, double RES, discarded `_dmgAfterMods`, melee fork, strip dummy RES, 30 vs 50 Windstorm, Fury-on-pack-frost) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-66…71.

### 1.6 What this increment does **not** change

Do not implement FUT-84+ before P0 honesty + 09-21…09-27 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas. Do not copy #495 / #498 / #644…#659 / #700 / #709 into this docs-only change. Do not edit the parent catalog. Do not “fix difficulty” by dropping the second RES pass only for the AI, by giving pack frost Blood Moon, or by scoring Titan's 5× as certain.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-27 ids.** This file starts at SYS-66 / FUT-84. SYS-61 stays on PR #689 as pack→player Glass; **scoring rules in this file supersede SYS-61 for pack→summon**. SYS-63 stays the shield **snapshot**; **spell-path soak is SYS-66**.
2. **Killable-now uses the apply pipeline of that hit**, not a shared “RES once” helper. Pack→player spell ≠ pack→player melee ≠ pack→summon ≠ player→enemy.
3. **`applyDamageDealt` output is the store HP**, not the helper’s return value, until the return is changed. Score the store.
4. **One soak function.** Spell hits that call `playerTakesDamage` must not also run the melee soak block. Melee stays on one soak until it is unified.
5. **SYS-10 / FUT-32 read HUD-true fields.** Strip enemy `res: 0` is not RES 0 in apply. Missing ⇒ module off, not “they have no armor.”
6. **Public miss chance is per acting side.** Do not invent a range-halve the live gate does not use.
7. **Player-only outgoing multipliers stay player-only** until the apply site is shared. Pack ADV-01 may *respect* them as threat; pack EV may not *claim* them.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`.

---

## 3. System proposals (2026-09-28)

### AI-SYS-66

**AI_ID:** AI-SYS-66  
**NAME:** Pack→player spell mitigation is SP × RES × `playerTakesDamage` RES (and shield)  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-05 / TGT-06 / SYS-37 / SYS-63  
**DECISION_RULES:** SYS-37 documented received damage as `scaled * (1 − visSp/100) * (1 − visRes/100)` matching WX **16475–16537**. For `!isSummonTarget` the next call is `playerTakesDamage` (**16566**), which (1) multiplies by player RES again (**3429–3432**, floor 1 before soak) and (2) absorbs `shieldHpRef` (**3433–3438**). SYS-63’s “pack spell does not soak” is **superseded**: spells vs the player **do** soak; pack **melee** soaks in a different block (SYS-68). Do **not** score `characterStats.sr` on this hit — live pack apply never reads SR. Do not drop the second RES only for the AI to “feel late-game.” If a later PR removes the inner RES so `playerTakesDamage` is soak-only, flip a ctx flag; until then EV uses both passes. Summon targets skip this function (SYS-67).  
**SCORING_MODEL:** `afterFirst = scaled * (1-sp/100) * (1-res/100)`; `afterSecond = max(1, round(afterFirst * (1-res/100)))` then `incomingAfterSoak = max(0, afterSecond - visibleShield)` (SYS-63 remaining). Killable-now vs HP uses `incomingAfterSoak`.  
**SPELL_REQUIREMENTS:** Damage/drain profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** All pack casters hitting the player.  
**PLAYER_COUNTERPLAY:** Stack RES (it applies twice today) and Shield Charm; bishops that treat you as raw `spell.damage` are cheating.  
**EDGE_CASES:** `Math.max(1, …)` before soak means a 0.2 post-RES packet becomes 1 then may soak to 0. Mirror consume (SYS-50) happens **before** `playerTakesDamage` (16496–16528) — reflected self-hit is SYS-67’s enemy path, not this formula. Open #659 does not change this spell path.  
**IMPLEMENTATION_COMPLEXITY:** Low (document the live pipeline + tests; do not change `calcScaledDamage`).  
**TEST_SCENARIOS:** Player RES 50, SP 0, shield 0, scaled 100 → first pass 50, second pass 25, not 50. Player RES 0, shield 20, scaled 12 → soak 12, HP 0 from this hit. SR 80, SP 0, RES 0 → EV ignores SR.  
**STATUS:** PROPOSED

### AI-SYS-67

**AI_ID:** AI-SYS-67  
**NAME:** `applyDamageDealt` store HP vs discarded return; pack→summon **does** use the registry  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-61 / FUT-79  
**DECISION_RULES:** SYS-61 is correct for pack→**player** (no `applyDamageDealt`). Pack→**player-summon** calls `enemyTakesDamage` (WX **16550–16557**, **16734–16742**), which **always** runs `mapModifierRegistry.applyDamageDealt` (**3499–3516**). Glass ×2, Vampiric 15%, Titan's 1–5× therefore modify **store** HP (`newHp = enemy.hp - _dmgAfterMods`, **3517**). The helper **returns `dmg`** (**3538**), and WX sets `actualDmg = dmg` (**16558**). Player-summon `dealDamage` returns the input amount and casterId `"player"` (**15002–15003**) — Glass on those hits is player-as-caster, which is the public rule. Killable-now against a wisp must use **post-registry store HP**, not the return. Do not copy Glass onto pack→player to “match.” Do not treat a Titan 5× roll as known at decide time (same class as FUT-57).  
**SCORING_MODEL:** `modDmg = applyDamageDealt` iff that function will run. Expected Titan = mean of 1..5 only if a T6 module is attached **and** the hit uses the registry; default killableNow uses ×1. Return value is not HP.  
**SPELL_REQUIREMENTS:** Damage profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All damage roles vs summons; player-side hunter/archer vs hostiles.  
**PLAYER_COUNTERPLAY:** Glass currently spikes hits **on your wisp** (and your hits on them), not pack frost on **you**.  
**EDGE_CASES:** CasterId `"player"` on player-summon hits is honest. Hostile summons that skip the executor (SYS-55) use pack apply: vs player → SYS-66; vs wisp → this row. DoT ticks that skip the registry stay skip.  
**IMPLEMENTATION_COMPLEXITY:** Low (flag per apply site + stop trusting the return).  
**TEST_SCENARIOS:** Glass on, pack frost vs wisp: store HP subtracts ×2; `actualDmg` log may still show ×1 — EV must follow the store. Glass on, pack frost vs player: EV not ×2 (SYS-61). Titan's on, pack vs wisp: killableNow does not assume ×5.  
**STATUS:** PROPOSED

### AI-SYS-68

**AI_ID:** AI-SYS-68  
**NAME:** Pack melee vs player is a private HP write (one RES, one soak, no `playerTakesDamage`)  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-05 / SYS-63 / SYS-66  
**DECISION_RULES:** WX **16704–16786**: `kind === "melee" || !didAct` then Chebyshev `nd <= 1` (Fire Bolt still P0 SYS-05). Vs the player: RES = raw `characterStats.res` **without** `getStatModifier` (**16722–16728**); shield soak in this block (**16750–16761**); HP via `setCharacterStats` (**16763–16766**), not `playerTakesDamage`. Vs a summon: `enemyTakesDamage` (SYS-67), comment **16735** “no shield.” After this module: (1) melee EV uses this pipeline, not SYS-66’s second RES; (2) status-effect RES shreds (`getStatModifier`) do **not** currently apply to pack melee — do not score them until apply does (open #658/#659 may change that); (3) unifying melee into `playerTakesDamage` **must delete** the inline soak or Shield Charm double-absorbs. SYS-42 still forbids this fallback on allied `targetId`.  
**SCORING_MODEL:** `meleeRecv = max(1, round(raw * (1 - rawRes/100)))` then soak. No SP. No second RES.  
**SPELL_REQUIREMENTS:** Melee / `physical_attack`. Kit-less Crush/Fire Bolt stay illegal (SYS-05).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** charger, flanker, berserker, generic adjacent.  
**PLAYER_COUNTERPLAY:** Weaken-RES currently shreds **spells** more than pack melee. Play the split; AI must not pretend melee also double-RES.  
**EDGE_CASES:** Ember Knight family burn after melee (**16789–16799**) is a tagged family hook (09-01 FUT-08), not this pipeline. Enrage 6× still multiplies `rawFB`.  
**IMPLEMENTATION_COMPLEXITY:** Low (split EV by apply site).  
**TEST_SCENARIOS:** Player RES 50, effect ×0.5 RES, scaled melee 100 → EV uses 50% of 100 (raw RES), not 25% (SYS-66) and not 75% (modified RES). Shield 20, melee 12 → HP 0 from this hit, soak once.  
**STATUS:** PROPOSED

### AI-SYS-69

**AI_ID:** AI-SYS-69  
**NAME:** Initiative strip dummy ATK/RES/SP/CHC are not SYS-10  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-54 companion)  
**DECISION_RULES:** WX **17402–17411** maps non-player rows through `resolveEnemyApMp` (SYS-54 AP/MP) **and** `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2`. Pack snapshot (`16279–16301`) also omits those fields. FUT-32 / ADV-01 / TGT-05 must not read strip enemy RES as 0 (that would treat every bishop as unarmored **and** is a lie relative to `enemy.res` used when the **player** hits them). Player strip RES/SP/CHC copy `characterStats` — legal for SYS-66. Missing enemy RES on the strip ⇒ this module **off** for enemy-side mitigation, not “RES 0.” Boss peer dummy `res: 0` remains SYS-46.  
**SCORING_MODEL:** N/A (source of truth). Numeric RES/SP/SR come from SYS-10 combatant fields, never the dummy mapper.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All (authoring / snapshot).  
**PLAYER_COUNTERPLAY:** N/A (correctness). The strip lying to the **player** about enemy RES is a HUD bug, not an AI tier.  
**EDGE_CASES:** Do not “fix” scoring by copying `level * 2` ATK into ADV-01. `chc: 2` on the strip is not FUT-57’s roll.  
**IMPLEMENTATION_COMPLEXITY:** Low (do not wire the mapper into ctx).  
**TEST_SCENARIOS:** Enemy `res === 40` in store, strip shows 0 → estimateDamage vs that enemy (player-side summon hunting it) uses 40 once SYS-10 exists, or the module is off — never 0 from the strip.  
**STATUS:** PROPOSED

### AI-SYS-70

**AI_ID:** AI-SYS-70  
**NAME:** Paper Windstorm miss rate is per acting side; range is not halved for AI  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for FUT-21  
**DECISION_RULES:** Announce text / registry comment (`mapModifiers.ts` 249–257) say reach halved; the hook is a no-op. Player execute miss is **30%** (WX **9563–9568**). Pack kit `spellRange > 1` miss is **50%** (**16491–16495**); Fire Bolt fallback is also 50% (**16729**). `enemySpellRange` / `aiCanCast` do **not** halve range. After this module: enumerator range stays `Number(spell.range)` (SYS-20). Expected miss uses **0.5** for pack ranged, **0.3** for player-side summon execute that goes through `spellEngine`. Do not score a range-2 frost as range-1. Do not use 50% on player ADV-04 “will my frost land.” Melee `range <= 1` skips the pack miss (Crush).  
**SCORING_MODEL:** `ev *= (1 - pMiss_actingSide)` when FUT-21 is attached; default killableNow stays non-miss (same class as FUT-57: do not assume the miss **or** the hit as certain).  
**SPELL_REQUIREMENTS:** Ranged `enemySpellRange > 1`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the modifier is announced.  
**ENEMY_ARCHETYPES:** caster, artillery, kiter; player-side archer.  
**PLAYER_COUNTERPLAY:** Windstorm is harsher on **their** kit shots (50%) than on yours (30%).  
**EDGE_CASES:** `lineOfSight === false` aura still rolls miss if `range > 1`. Do not peek RNG.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Pack frost range 3, Windstorm on → still legal at dist 3; FUT-21 EV ×0.5, not ×0.7. Player frost through spellEngine → FUT-21 ×0.7 if a player-side module exists. Dist 3 with a fictional “range halved to 1” scorer is a **bug**.  
**STATUS:** PROPOSED

### AI-SYS-71

**AI_ID:** AI-SYS-71  
**NAME:** Fury / Blood Moon / Mirror Field / Titan's Vigor follow their live apply site  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for ADV-01 / SYS-61 / SYS-67  
**DECISION_RULES:** `spellEngine.ts` **895–906** applies Blood Moon ×1.25, Fury ×1.25, and Mirror Field 20% reflect on **player** casts only. Pack apply never calls `spellEngine`. Titan's Vigor ×1..5 is `onDamageDealt` (`mapModifiers.ts` 311–315) → `applyDamageDealt` only (SYS-67). Public Fury (BuffShop log **3588**, wear-off **14290**) may feed ADV-01 **player threat**. Pack outgoing EV must not multiply 1.25. Mirror Field 20% is **not** SYS-50’s consume-once Mirror token (WX 16496) — do not merge them. Missing / hidden ⇒ that term is 0. Do not roll Titan's at decide time.  
**SCORING_MODEL:** Player-outgoing threat may include public 1.25 when the icon/log is up. Pack→player damage EV excludes Blood Moon/Fury/Titan's. Pack→summon Titan's/Glass only via SYS-67 expected-value rules.  
**SPELL_REQUIREMENTS:** None (modifiers).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the modifier/item is announced.  
**ENEMY_ARCHETYPES:** All; ADV-01 consumers especially tank/kiter.  
**PLAYER_COUNTERPLAY:** Pop Fury; chargers should respect your next Strike, not grow a matching 1.25 on their frost.  
**EDGE_CASES:** Heal spells skip Fury/Blood Moon in `spellEngine` (`!isHealSpell`). Pack self-heal (16648) never had them. Registry `mirror_field` / `blood_moon` / `gravity_well` / `fog_of_war` placeholder hooks (`mapModifiers.ts` 270–296) are **not** pack brains — do not invent fog vision cheats.  
**IMPLEMENTATION_COMPLEXITY:** Low (flags per apply site).  
**TEST_SCENARIOS:** Fury on, pack frost vs player → EV unscaled. Fury on, ADV-01 player threat up. Titan's on, pack vs player → EV ×1. Titan's on, pack vs wisp → SYS-67, not ×5 killableNow.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-28)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…83.

### AI-FUT-84

**AI_ID:** AI-FUT-84  
**NAME:** Killable-now uses the pack→player spell pipeline (double RES + soak)  
**ROLE:** target / adaptive  
**SOPHISTICATION:** T6 (TGT-06; SYS-66)  
**DECISION_RULES:** When SYS-66 is wired, casters use `incomingAfterSoak` against player HP. Chargers still use SYS-68 for melee. Do not mix: a bishop must not use melee EV for frost. Shield remaining is SYS-63/FUT-81; this module adds the **second RES**. Hidden crit stays FUT-57 (non-crit).  
**SCORING_MODEL:** SYS-66 formula; `killableNow` false if `incomingAfterSoak < hp`.  
**SPELL_REQUIREMENTS:** Damage/drain.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.6` when player visRes > 0 or shield > 0. Never `if (level >= 40)`.  
**ENEMY_ARCHETYPES:** caster, artillery, generic.  
**PLAYER_COUNTERPLAY:** 50 RES + 1 HP + shield 0 can survive a “lethal” frost the old one-pass scorer would spend.  
**EDGE_CASES:** SP 0, RES 0, shield 0 → equals SYS-37. Summon target → FUT-85.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-66.  
**TEST_SCENARIOS:** RES 50, SP 0, HP 30, scaled 100 → not killableNow (25 recv). Same without second pass would be 50 and would wrongly kill.  
**STATUS:** PROPOSED

### AI-FUT-85

**AI_ID:** AI-FUT-85  
**NAME:** Glass / Titan's on pack→summon only, expected not max  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (TGT-06; SYS-67)  
**DECISION_RULES:** FUT-79 stays pack→player (no registry). This module attaches when the target is a player-side summon **and** SYS-67’s flag says `applyDamageDealt` will run. Default killableNow uses ×1 (Titan) / live Glass multiplier only if it is **deterministic** (Glass is ×2, no roll). Titan's 1–5 is not killableNow; optional T6 EV may use mean 3 **without** flipping killableNow (FUT-57 pattern). Vampiric self-heal EV on the **pack caster** only if the registry actually heals that caster on this hit.  
**SCORING_MODEL:** `storeDmg = glass? 2*raw : raw` for Glass; Titan default raw.  
**SPELL_REQUIREMENTS:** Damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when Glass or Titan's is announced **and** a player summon is alive.  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Park the wisp in Glass; they may look lethal on the wisp and still tickle you.  
**EDGE_CASES:** No summon → term 0. Hostile summon as target is SYS-55 pack apply vs enemy-side — not this module.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-67.  
**TEST_SCENARIOS:** Glass on, wisp 10 HP, raw 6 → killableNow (12 store). Titan's on, wisp 10 HP, raw 6 → not killableNow.  
**STATUS:** PROPOSED

### AI-FUT-86

**AI_ID:** AI-FUT-86  
**NAME:** Adjacent charger uses melee pipeline, not spell double-RES  
**ROLE:** role / resources  
**SOPHISTICATION:** T6 (ROL-02 / RES-03; SYS-68)  
**DECISION_RULES:** When dist ≤ 1 and both frost and melee are legal, compare **SYS-68 melee recv** vs **SYS-66 spell recv**. Artillery still prefers ranged dest (FUT-63). Chargers/berserkers pick the hit that actually kills under its own pipeline. Do not pick frost because one-pass EV looked bigger if apply would double-RES it below kill.  
**SCORING_MODEL:** `U(action) = killableNow_pipeline(action) ? wKill : dmg_pipeline`.  
**SPELL_REQUIREMENTS:** Melee and/or ranged damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.5` for explicit charger/assassin (SYS-04).  
**ENEMY_ARCHETYPES:** charger, assassin, berserker; artillery inverts (FUT-63).  
**PLAYER_COUNTERPLAY:** High RES makes their frost worse than Crush; stand in melee if you stacked RES.  
**EDGE_CASES:** Failed frost must not Fire-Bolt (SYS-05 / SYS-42). Shield soak differs per path (SYS-66 vs SYS-68) — both soak today, melee once in its block, spell once in `playerTakesDamage`.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-66/68.  
**TEST_SCENARIOS:** Dist 1, RES 50, frost scaled 100 (25 after SYS-66), melee 12 (6 after SYS-68), HP 20 → neither kills; do not pick frost as kill. HP 6 → melee killableNow, frost not.  
**STATUS:** PROPOSED

### AI-FUT-87

**AI_ID:** AI-FUT-87  
**NAME:** Do not plan around strip enemy RES 0  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (ADV-01 / TGT-05; SYS-69)  
**DECISION_RULES:** Player-side summons that hunt pack units (hunter/archer) must not read initiative `res: 0`. If SYS-10 has numeric enemy RES, use it (player `computeDamage` path: RES+SR). If not, module off — today’s estimateDamage (ignore RES) is the safe default, not strip 0. Pack ADV-01 “player threat” uses player strip ATK/SP/CHC (honest), not enemy dummy ATK.  
**SCORING_MODEL:** Missing enemy RES ⇒ no mitigation term (current). Strip 0 ⇒ **must not** be copied.  
**SPELL_REQUIREMENTS:** Damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` when SYS-10 exists.  
**ENEMY_ARCHETYPES:** player-side hunter/archer; pack casters ignore this (they hit the player).  
**PLAYER_COUNTERPLAY:** Your iron golem’s RES should matter to the wolf once SYS-10 exists.  
**EDGE_CASES:** SYS-54 AP=`level` on the same row stays illegal for SYS-07.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Fixture strip res 0, store res 40, SYS-10 on → EV uses 40. SYS-10 off → EV ignores RES, not 0 from strip.  
**STATUS:** PROPOSED

### AI-FUT-88

**AI_ID:** AI-FUT-88  
**NAME:** Expected Windstorm miss uses acting-side rate  
**ROLE:** spell contract  
**SOPHISTICATION:** T6 (completes FUT-21; SYS-70)  
**DECISION_RULES:** Parent FUT-21 is a stub. After SYS-70, pack ranged EV `*= 0.5` when Windstorm is public; player-side summon execute `*= 0.7`. KillableNow stays non-miss (do not require the hit). Range is not halved. Kit-less Fire Bolt still must not exist (SYS-05); if it did, it would also be 50% — do not keep it as “the 50% shot.”  
**SCORING_MODEL:** `ev = mitigated * (1-pMiss)`; `killableNow` uses mitigated with pMiss=0.  
**SPELL_REQUIREMENTS:** Ranged damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` when Windstorm is announced.  
**ENEMY_ARCHETYPES:** caster, artillery, kiter.  
**PLAYER_COUNTERPLAY:** Walk into range-2; they still have range-3 and a coin flip, not a truncated reach.  
**EDGE_CASES:** Adjacent Crush does not roll pack miss.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-70.  
**TEST_SCENARIOS:** Pack frost, Windstorm, HP equals non-miss EV → killableNow true, but U(frost) half of calm-map frost. Dist 3 legal.  
**STATUS:** PROPOSED

### AI-FUT-89

**AI_ID:** AI-FUT-89  
**NAME:** Visible Fury / Blood Moon as player threat, not pack damage  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (ADV-01 / ADV-04; SYS-71)  
**DECISION_RULES:** When Fury turns remain or Blood Moon is announced **and** the HUD/log would show it, tanks/kiters raise **player outgoing** threat (ADV-01) and may refuse dist 1 (FUT-62 leftover AP sibling). Pack frost/melee EV stays unscaled (SYS-71). Mirror Field 20% is a **player-cast** reflect — pack does not assume their frost bounces (that is SYS-50/FUT-67 for the consume-once token).  
**SCORING_MODEL:** `playerThreat *= 1.25` when Fury or Blood Moon is public; pack `estimateDamage` unchanged.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.7` when the public flag is on.  
**ENEMY_ARCHETYPES:** tank, kiter, protector. Berserker inverts.  
**PLAYER_COUNTERPLAY:** Pop Fury to shove them off; they should not grow matching damage.  
**EDGE_CASES:** Fury worn off this player-turn start (14290) before pack acts → term 0. Hidden potion in inventory not yet used → off.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-71 / SYS-10.  
**TEST_SCENARIOS:** Fury on, charger adjacent, player ATK high → prefer not to sit in Strike if a step exists. Pack frost EV equals Fury-off frost.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI. `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05) **and** SYS-42.

Mitigation modifiers (RES, SP-as-used-by-pack-apply, shield, Glass, Titan's, Windstorm, Fury) are **not spells**. They still need an apply-site flag (SYS-66…71) before any module uses them.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until profiled):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`, `starter-drain` (as a **heal**).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

Open #647 Soul Rend / #649 Trap stay out of kits until apply + profile exist. Open #700 / #709 are player-summon apply, not pack kit emit.

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**, SYS-42).  
2. 09-21 SYS-22…32.  
3. 09-22 SYS-33…35 (including open #495).  
4. 09-23 SYS-36…41.  
5. 09-24 SYS-42…47 (including open #498).  
6. 09-25 SYS-48…53.  
7. 09-26 SYS-54…59 (do not implement SYS-59 pack immunity).  
8. 09-27 SYS-60…65 (SYS-61 pack→player Glass stays; SYS-63 snapshot stays).  
9. SYS-66, SYS-67, SYS-68, SYS-69, SYS-70, SYS-71 (this file).  
10. Parent T2–T5 roles / team / adaptive. FUT-84 with SYS-66; FUT-85 with SYS-67; FUT-86 with SYS-68; FUT-87 with SYS-69; FUT-88 with SYS-70 / FUT-21; FUT-89 with SYS-71.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits. Scoring **reads** RES/SP/shield/modifiers; it does not change `calcScaledDamage` and does not drop the second RES “for AI.”

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-DOUBLERES | Pack frost vs player, RES 50, SP 0, scaled 100 | Recv 25 after two RES passes, not 50 (SYS-66 / FUT-84). |
| TS-SPELLSHIELD | Pack frost vs player, shield 20, scaled 12 | Soak via `playerTakesDamage`; SYS-63 “spell does not soak” is wrong (SYS-66). |
| TS-NOSR | Player SR 80, SP 0, RES 0 | Pack frost EV ignores SR (SYS-66). |
| TS-GLASSWISP | Glass on, pack frost vs wisp | Store ×2; return/`actualDmg` may be ×1; EV follows store (SYS-67 / FUT-85). |
| TS-GLASSPLAYER | Glass on, pack frost vs player | EV not ×2 (SYS-61 still). |
| TS-TITANMAX | Titan's on, pack vs wisp, raw 6, HP 10 | not killableNow from assumed ×5 (SYS-67). |
| TS-MELEERES | Pack melee vs player, RES 50, RES-effect ×0.5 | EV uses raw 50%, not modified 25% and not double RES (SYS-68 / FUT-86). |
| TS-STRIP0 | Strip enemy res 0, store res 40 | Hunter EV must not copy 0 (SYS-69 / FUT-87). |
| TS-WIND50 | Pack frost, Windstorm, dist 3 | Legal at 3; FUT-88 ×0.5, not range 1 (SYS-70). |
| TS-WIND30 | Player spellEngine Windstorm | Miss p=0.3, not 0.5 (SYS-70). |
| TS-FURYPACK | Fury on, pack frost vs player | EV unscaled (SYS-71 / FUT-89). |
| TS-FURYTHREAT | Fury on | Player threat up for tank/kiter (FUT-89). |

09-21…09-27 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Pack→player spell: SP×RES then `playerTakesDamage` RES + shield; SYS-63 spell-path was wrong | AI-SYS-66 |
| `applyDamageDealt` return discarded; pack→summon **does** use registry | AI-SYS-67 |
| Pack melee private HP write / soak / raw RES | AI-SYS-68 |
| Strip dummy ATK/RES/SP/CHC (SYS-54 sibling) | AI-SYS-69 |
| Paper Windstorm 30% vs 50%; range not halved | AI-SYS-70 |
| Fury / Blood Moon / Mirror Field / Titan's path-specific | AI-SYS-71 |
| Killable-now with double RES + soak | AI-FUT-84 |
| Glass/Titan's on wisp only, expected not max | AI-FUT-85 |
| Charger compares melee vs spell pipelines | AI-FUT-86 |
| Ignore strip enemy RES 0 | AI-FUT-87 |
| Acting-side Windstorm expected miss | AI-FUT-88 |
| Visible Fury as player threat, not pack damage | AI-FUT-89 |

Parent §19 still maps the original capability list onto POS / TGT / RES / ROL / TEM / ADV. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)` and not from pretending pack frost uses one RES pass, Glass ×2 on the player, or Fury 1.25.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**):

| Request | Parent id |
| :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 |
| tank … protector | ROL-01…10 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 |

This increment adds apply-pipeline honesty (SYS-66…71) so those modules cannot cheat when they attach — especially as absolute levels grow without a cap — plus T6 scorers (FUT-84…89) that keep appearing as relative difficulty rises.

Every row above is **STATUS: PROPOSED**. No production AI in this change.

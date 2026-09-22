# Advanced Enemy AI Evolution — 2026-09-22 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-22  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (SYS-22…32, FUT-36…47 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-22.md`](./automation/ACTION_IDS_AEE_2026-09-22.md)

This increment re-reads the live engine one day after the 2026-09-21 catalog. SYS-22…32 and FUT-36…47 stay **PROPOSED** on that file; they are **not** re-filed here. New work is: WX line-number confirmation, honesty gaps 09-21 missed, and T6+ scorers that keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms).

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

---

## 1. Re-read (2026-09-22)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment (healer/guardian LoS), not a new id.

### 1.2 Line numbers vs 2026-09-21 (WX barely moved)

| Fact | 2026-09-21 | Live (2026-09-22) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5864–5866 | **5864–5866** (SYS-29 on 09-21) |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11934 | **11932–11943** |
| Summon empty occupied | WX 15156 | **15156** |
| Summon `reevaluate` | WX 15257–15276 | **15257–15276** |
| Erratic `aiTier >= 5` | WX 15507 | **15507–15591** |
| Betrayal `aiTier >= 10` | WX 15594 | **15594+** |
| Minion `ap: 0, mp: 0` | WX 16154–16159 | **16154–16159** |
| Pack snapshot | WX 16273–16302 | **16273–16302** |
| Dest-commit | WX 16416–16423 | **16416–16423** |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply SP then RES | WX 16475–16537 | **16475–16537** |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16710–16715** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| Wisp prepend | 1682–1690 | **1682–1690** |
| `findKitSpell` assigned fallback | 1741–1745 | **1741–1745** |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169+ | **unchanged** |
| `isTileCastableLive` ally = player | `targeting.ts` 540 | **527–544** |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Next 09-21 honesty: **AEE-2026-09-21-002** (healer LoS) and **AEE-2026-09-21-004** (summon occupied + available-only kit).

### 1.3 Still true — do not re-file (09-21 / parent)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08. Prepend 1682–1690 is not a reader — **AI-SYS-30** on 09-21.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02.
- Heal-first `inferArchetype` (447–452). SYS-04.
- Hazard avoid only below 50% HP (425–441). POS-04.
- Retreat `kind: "skip"` while moving. POS-02.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP (`summonExecutor.ts` 125–126). SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. **AI-SYS-29** on 09-21.
- `findKitSpell` assigned fallback. **AI-SYS-32** on 09-21.
- `playerCastPlan` twin for enemies. **AI-SYS-26** on 09-21.
- Thorned `pathLength` / `applyApCost` / stacked Frozen+Slime vs budget 3. **AI-SYS-31** on 09-21.
- Visible Mirror. **AI-FUT-37** on 09-21.
- Pack leftover-AP. **AI-FUT-38** on 09-21.

`engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **Summon `allyCount` is hardcoded player-side.** WX 15175–15176: `allyCount: summonCombatants.filter(c => c.side === "player")`. `decideSummonAction` itself filters by `summon.side` (1768–1774), so the field is unused today. TEM modules that read `ctx.allyCount` would invert sides for an enemy-side wolf. SYS-33.
2. **Apply `targetCell` uses React `playerPosition`, not the ref.** WX 16438 after dest-commit. Pack snapshot already copies `playerPositionRef` (16293–16302). Summon targets use `resolvedTarget.{x,y}`. Same-turn dest vs a stale player tile is a miss or a false in-range. SYS-34.
3. **`estimateDamage` ignores SP; apply uses SP then RES.** 09-21 FUT-44 says read RES/SR via `getEffectiveStat`. Live apply (WX 16475–16537) also applies **SP** (`plSpEff`) before RES. Player-side summons have `plSpEff = 0`. Killable-now / lethal lookahead stay optimistic vs a high-SP player. SYS-35. Do not change `calcScaledDamage`.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, AP, ally heal, focus, healer LoS, kit CD, summon occupied) still has no decide-layer tests. Do not treat geometry/walkMp as SYS-05.

### 1.6 What this increment does **not** change

Do not implement FUT-48+ before P0 honesty + 09-21 SYS-22…32. Do not start T6 bait/rotation before SYS-05 / SYS-23 / SYS-26 (09-21 numbers).

---

## 2. Design additions (normative)

1. **Do not recycle 09-21 ids.** SYS-22…32 and FUT-36…47 are owned by [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md). This file starts at SYS-33 / FUT-48.
2. **Snapshot side fields match the acting unit.** `allyCount` / `enemyCount` use `summon.side`, not a hardcoded player filter.
3. **Apply measures to the live player tile.** Same source as the decide snapshot (`playerPositionRef`).
4. **Killable-now uses the same visible mitigation apply uses** (SP then RES for non-physical; RES for physical; summons have no SP). Scoring reads; resolution stays `calcScaledDamage`.
5. **T6+ still stacks** on the parent enumerator. No integer tier table.

---

## 3. System proposals (2026-09-22)

### AI-SYS-33

**NAME:** Summon snapshot side counts  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** WX 15175–15178 currently sets `allyCount` to combatants with `side === "player"` for **every** summon. Use the acting summon’s side, matching `decideSummonAction` (1768–1774). Occupied + cooldown filter remain 09-21 SYS / SYS-14.  
**SCORING_MODEL:** TEM modules that read `allyCount` see same-side living units.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All summons.  
**PLAYER_COUNTERPLAY:** N/A (correctness).  
**EDGE_CASES:** Player-controlled summon (`side === "player"`) still counts player-side as allies. Field unused today — fix before TEM-02/07 attach to summons.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Enemy wolf, 2 enemy pieces + player + wisp → `allyCount` is enemy-side, not player+wisp.  
**STATUS:** PROPOSED

### AI-SYS-34

**NAME:** Apply target cell is the live tile  
**ROLE:** system  
**SOPHISTICATION:** all  
**DECISION_RULES:** WX 16438 uses React `playerPosition`. After dest-commit, range/LoS must use `playerPositionRef.current` (and the summon’s current `x,y` for summon targets). Do not read hidden queued player input.  
**SCORING_MODEL:** N/A.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** Already-resolved player position only.  
**EDGE_CASES:** Summon targets already use `resolvedTarget.{x,y}` — keep that.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** State (8,8), ref (8,9), dest-commit frost range 1 → measure to (8,9).  
**STATUS:** PROPOSED

### AI-SYS-35

**NAME:** Killable-now EV includes visible SP  
**ROLE:** system  
**SOPHISTICATION:** T1+ (completes 09-21 FUT-44 / parent TGT-05)  
**DECISION_RULES:** `estimateDamage` (490–509) is `calcScaledDamage * enrage`. Apply uses SP then RES (WX 16475–16537). 09-21 FUT-44 wires RES/SR via `getEffectiveStat`. This module adds the **SP** term for non-physical hits and sets summon SP to 0 (apply 16475–16477). Hidden crit is not visible — do not bake 2×. Enrage 6× is public. Do **not** change `calcScaledDamage`.  
**SCORING_MODEL:** `killableNow` iff estimated **received** HP ≥ current HP.  
**SPELL_REQUIREMENTS:** `isPhysical` / `damage` metadata.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for damaging decide.  
**ENEMY_ARCHETYPES:** All damage dealers.  
**PLAYER_COUNTERPLAY:** Stack SP; the bishop should stop treating you as one-shot.  
**EDGE_CASES:** Physical kit → RES only (no SP). Mirror bounce uses **enemy** RES (FUT-37 on 09-21).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10 snapshot + 09-21 FUT-44.  
**TEST_SCENARIOS:** Frost 8 scaled, player SP 50 / RES 0 → received 4; HP 5 → not killableNow.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-22)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or 09-21 FUT-36…47.

### AI-FUT-48

**NAME:** Drain self-heal EV  
**ROLE:** resource / role  
**SOPHISTICATION:** T2  
**DECISION_RULES:** Apply already heals the caster when `spellType === "drain" && healAmount` (WX 16626–16638). `pickBestDamageSpell` ignores `healAmount`. When own HP fraction < `ENEMY_HEAL_ALLY_THRESHOLD_PCT`, add `healAmount` (capped at missing HP) to the drain’s score. Do not infer “healer” from drain (SYS-04).  
**SCORING_MODEL:** `U += wSelfHeal * healedHp` on drain actions.  
**SPELL_REQUIREMENTS:** Drain + `healAmount`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ −0.1`.  
**ENEMY_ARCHETYPES:** artillery, assassin, generic — not ROL-04 override.  
**PLAYER_COUNTERPLAY:** Burst before the drain turn.  
**EDGE_CASES:** Full HP → heal term 0.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-35.  
**TEST_SCENARIOS:** Queen 40% HP, frost vs drain equal damage → drain wins. Queen 100% HP → frost.  
**STATUS:** PROPOSED

### AI-FUT-49

**NAME:** Summoner kit fall-through  
**ROLE:** role  
**SOPHISTICATION:** T2 (ROL-06)  
**DECISION_RULES:** `decideSummonerAction` (1832–1906) **skips** the whole turn when the spell is missing, cap is reached, or cooldown is live. Fall through to `decideEnemyAction` with the non-summon kit. WX 16375 routes `isSummoner` only to `decideSummonerAction` — fall-through must happen inside that function or the call site must chain. Placement dest must be unoccupied (SYS-14).  
**SCORING_MODEL:** Summon EV vs kit EV; cap ⇒ summon EV = −∞.  
**SPELL_REQUIREMENTS:** One summon id **and** a profiled non-summon kit id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Overlay stays ratio-capped (FUT-23). Fall-through is always-on honesty.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Force the cap, then fight a bishop, not a skip.  
**EDGE_CASES:** Do not skip LoS to place a wolf through a wall.  
**IMPLEMENTATION_COMPLEXITY:** Medium.  
**TEST_SCENARIOS:** Cap 2 reached, frost legal → frost. CD live, melee adjacent → melee.  
**STATUS:** PROPOSED

### AI-FUT-50

**NAME:** Pack healer ward is enemy-side  
**ROLE:** positioning  
**SOPHISTICATION:** T2 (POS-07)  
**DECISION_RULES:** `decideHealer` 1142 comment says “prefer the player”; `allies` are `side === "enemy"` (1674–1676). Ward = lowest-HP non-self ally, preferring non-summon **enemy** pieces, then allied summons. Do not path a pack healer to guard the player. Reuse guardian `pickBestAlly` (2113–2120).  
**SCORING_MODEL:** `+wGuard` on the enemy-side ward cell.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Backline attach T2.  
**ENEMY_ARCHETYPES:** healer, protector.  
**PLAYER_COUNTERPLAY:** Snipe the piece the healer actually stands in front of.  
**EDGE_CASES:** Solo healer, no allies → skip backline (already requires `allies.length > 0`).  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Pack healer + rook + player; threat is player → guard cell is between rook and player.  
**STATUS:** PROPOSED

### AI-FUT-51

**NAME:** Public effect hygiene (duplicate DoT / debuff)  
**ROLE:** team  
**SOPHISTICATION:** T3 (TEM-04)  
**DECISION_RULES:** Once SYS-10 snapshots `activeEffects`, a second venom/slow/expose on the same target scores ~0. First-caster poison, second-caster frost. Requires SYS-02 DoT EV so the first poison is visible (`damage: 0` today). Match `dotStacks.ts` stacking; do not invent.  
**SCORING_MODEL:** `−wDup` if the same `debuffStat` / `dotType` is already public on the target.  
**SPELL_REQUIREMENTS:** DoT/debuff profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2`.  
**ENEMY_ARCHETYPES:** controller, caster.  
**PLAYER_COUNTERPLAY:** Cleanse; they will re-apply once.  
**EDGE_CASES:** Different `dotType` may stack if apply stacks.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10 / SYS-02.  
**TEST_SCENARIOS:** Target already slowed, two controllers → second picks damage.  
**STATUS:** PROPOSED

### AI-FUT-52

**NAME:** Remembered last public player dest (bait tile)  
**ROLE:** adaptive  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Store the player’s **last committed** walk dest (public). Next enemy turn, tiles the player just left score as “likely re-entry” for AoE / wait. Do not store hover, click-intent, or fog. Ring buffer length 1.  
**SCORING_MODEL:** `+wBait` if dest equals last player dest and a legal AoE covers it.  
**SPELL_REQUIREMENTS:** Optional AoE profile.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1`, low `pMin` so it can appear on any relatively hard pack.  
**ENEMY_ARCHETYPES:** artillery, controller, bomber.  
**PLAYER_COUNTERPLAY:** Do not step back onto the tile you left.  
**EDGE_CASES:** First turn of battle → term 0. Summon dests are not the player dest.  
**IMPLEMENTATION_COMPLEXITY:** Medium (one public field on battle ctx).  
**TEST_SCENARIOS:** Player walked (5,5)→(5,6); bomber holds blast covering (5,6) vs empty (4,4).  
**STATUS:** PROPOSED

### AI-FUT-53

**NAME:** Pack ability rotation blackboard  
**ROLE:** team  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Pack blackboard records which kit id was cast last turn (public log). Next ally prefers a **different** profiled id if EV within 15% (frost then poison, not double frost). Not a hidden cooldown. Combined with FUT-51 for true duplicate-debuff skip.  
**SCORING_MODEL:** `−wRepeat` if same spellId as last allied cast on the same target this round.  
**SPELL_REQUIREMENTS:** At least two profiled kit ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0`. Kit width must be relative (SYS-09) or rotation is a no-op on zone-0 single-spell kits.  
**ENEMY_ARCHETYPES:** synergistic packs (T3+) that rolled T6.  
**PLAYER_COUNTERPLAY:** Cleanse the first debuff; the second is a different verb.  
**EDGE_CASES:** Solo enemy → term 0. Same id legal if it is the only payable spell.  
**IMPLEMENTATION_COMPLEXITY:** Medium.  
**TEST_SCENARIOS:** Two bishops, both frost+poison, first cast frost → second prefers poison if both legal.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged from parent / 09-21: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI (`targeting.ts` 128–137). `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05).

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**).  
2. 09-21 SYS-22…32 (healer LoS, kit CD, summon occupied, resource plan, family `aiTier`, focus prepend).  
3. SYS-33, SYS-34, SYS-35 (this file).  
4. Parent T2–T5 roles / team / adaptive.  
5. FUT-48…51 then T6 FUT-52/53.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-SUMSIDE | Enemy wolf snapshot | `allyCount` is enemy-side (SYS-33). |
| TS-PREF | `playerPosition` ≠ `playerPositionRef` | Range uses ref (SYS-34). |
| TS-SPEV | SP 50, frost would “kill” pre-SP only | not killableNow (SYS-35). |
| TS-DRAIN | 40% HP queen, frost vs drain | Drain (FUT-48). |
| TS-SUMFALL | Summon cap reached, frost legal | Frost, not skip (FUT-49). |
| TS-WARD | Pack healer + rook | Guard rook, not the player (FUT-50). |
| TS-DUP | Target already slowed | Second controller does not slow (FUT-51). |
| TS-BAIT | Last player dest (5,6) | Bomber covers (5,6) (FUT-52). |
| TS-ROTATE | First bishop frost | Second prefers poison (FUT-53). |

09-21 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Summon `allyCount` hardcoded player | AI-SYS-33 |
| Stale `playerPosition` in apply | AI-SYS-34 |
| Killable-now ignores SP | AI-SYS-35 |
| Drain self-heal EV | AI-FUT-48 |
| Summoner skip-the-turn | AI-FUT-49 |
| Pack healer “guards the player” comment lie | AI-FUT-50 |
| Duplicate DoT hygiene | AI-FUT-51 |
| Last public player dest | AI-FUT-52 |
| Pack spell rotation | AI-FUT-53 |

Parent §19 still maps the original capability list onto POS / TGT / RES / ROL / TEM / ADV. 09-21 maps combat-parity holes onto SYS-22…32 / FUT-36…47.

Every row above is **STATUS: PROPOSED**. No production AI in this change.

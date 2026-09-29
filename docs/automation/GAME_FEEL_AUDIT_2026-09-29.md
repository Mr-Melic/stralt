# Game Feel & Combat Feedback Audit — 2026-09-29

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-7277b3ed-ed8f-4e09-95e7-f21eef84ed4f`  
**Schedule:** cron `0 */48 * * *` (twelfth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**, 2026-09-28 queued in **#735**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 09-28 ledgers. No combat-feel code landed on `main` since those runs.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (**#768** is the 2026-09-29 WAITING report; #725 was 09-28). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: every remaining unique hole lives in `WorldExploration.tsx` or `BattleUIPanel.tsx`, which older still-open PRs already own (#327 Striker is the oldest WX sibling; #363 / #419 already queue feel floats; UX siblings touch the spell bar). Unioning those files across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, #678, and #735 already own** their surfaces — do not re-implement them here.

---

## Prior ledger status

| ID | Title | Status this run |
| :--- | :--- | :--- |
| GFCF-2026-08-31-001 | Screen-space juice anchors | **Shipped** (#149) |
| GFCF-2026-08-31-002 | Player-facing reject copy | **Shipped** (#149 / 09-01) |
| GFCF-2026-08-31-003 | `applyDamageToEnemy` IMPACT juice | **Still open.** Highest remaining unique P0. Not auto-implemented (MEDIUM double-spawn vs bounce / `enemyTakesDamage`) |
| GFCF-2026-08-31-004 | Draw armed hit-flash | **Still open.** `getHitFlashAlpha` still has zero render call sites (`effects.ts` 331) |
| GFCF-2026-08-31-005 | Hit-stop `timeScaleRef` | **Still deferred.** RAF freeze |
| GFCF-2026-08-31-006 | Walk reject floats | **Shipped** (09-01) |
| GFCF-2026-08-31-007 | In-battle feats on recap | **Shipped** (#159 / `recapUnlocks.ts`) |
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped (`rewardFeel.ts`). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295). Needs a recap flag, not leftover-XP inference |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8514–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF. Mirror Field / shield absorb stay here. Void Mirror *numbers* stay #735 |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t`. **Does not cover** Shield Charm / Fury (this ledger) |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` still invisible. #554 owns the walk *block* |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` 9344 `triggerVfx: () => { /* no-op */ }`. Drain heal remains log-only |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 … 005 | Summon-control / Windstorm / potions / AN no-AP | **Queued in #363** |
| GFCF-2026-09-21-001 … 004 | AN off-turn / summon kit / Sacrifice | **Queued in #363** |
| GFCF-2026-09-21-005 + 09-22-001 … 009 | AN no-target / melee / boss ability / shrine / … | **Queued in #419** |
| GFCF-2026-09-23-001 … 005 | Enemy heal / hostile spawn / Time's up / ice / portal XP | **Queued in #478** |
| GFCF-2026-09-24-001 … 004 | Void Rift cell / modifier HP / Swap puff / Mark tint | **Queued in #523** |
| GFCF-2026-09-25-001 … 005 | Timestep / Mirror activate / Betrayal / hitsMultiple / Occupied | **Queued in #571** |
| GFCF-2026-09-26-001 … 004 | Sealed portal / ability minions / boss teleport / bounce hover | **Queued in #610** |
| GFCF-2026-09-27-001 … 004 | Mirror consume / enemy walk puff / enemy hazard / betrayal 6× | **Queued in #678** |
| GFCF-2026-09-28-001 … 004 | Void Mirror number / Shell Armor why / Mark consume / erratic | **Queued in #735** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 items as NEW. Do not re-implement those WX call sites on this branch. Hover crit omission stays a matrix note (09-28: do not twin).

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`). Slot AP digits still show catalog cost (this ledger) so a “cancel” can be the player not trusting the number |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode still silent on `main` (#363 / #419). Null Field eats a buff with no player-facing line (this ledger) — that can look like a dead button |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806). Chaos Initiative reshuffles the strip with no why (this ledger) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–09-28; 200+ open sibling PRs; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#768).

---

## What changed since 2026-09-28 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, and **#735** are still open. This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes, grouped under 012, or never filed.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, **not** in #735, and **not** in 003–015:

1. **Shield Charm remaining HP and Fury remaining turns never enter the status system.** Both live in refs (`WX` 1588–1591). Use IMPACT stays #363 / 09-02-004. Absorb log stays 011. Fury expiry is log-only (`WX` 14290–14293) — 09-28 called that a non-hole *because HUD ATK is enough*; ATK is not labeled as Fury, and remaining turns are invisible. Distinct from 012 (digits on `activeEffects` pills). Distinct from 09-02-004 (the drink float).
2. **Spell-slot AP digits show catalog `spell.apCost`, not live `resolveCastApCost`.** Execute and Attack Nearest already run `applyApCost` (`targeting.ts` 1097–1109; `WX` 17129 / 17245 / 18872). The button enablement is live. The carved `4AP` (`BattleUIPanel.tsx` 635 / 812) is not. Arcane Surge / Arcane Overflow (`mapModifiers.ts` 210–217 / 319–324) therefore lie on ANTICIPATION. Distinct from 010 (walk MP Manhattan vs path). Distinct from 09-22-008 (0 AP click ignore).
3. **Null Field / Arcane Overflow `applyEffectApplication` veto is debug-only.** `applyActiveEffect` (`WX` 1874–1885) returns after `logDebugInfo("MODIFIER", "suppressed: …")` with no `logBattleEntry` and no float. Null Field announce (`mapModifiers.ts` 419–432) is honest (PXA). The *this application was eaten* moment is not. Distinct from canvas `"✦ FIZZLED! ✦"` (`WX` 17337–17347), which is a different fail path. Distinct from PXA-002 (announce vs hook).
4. **Chaos Initiative reshuffles the initiative strip with no why.** `applyTurnOrderSort` runs when the turn index wraps to 0 (`WX` 14717–14721). Map Effects already lists the modifier. The strip jump has no log or short float. Distinct from 09-22-009 (optional “Your turn” banner) and 09-28-004 (erratic pack).

09-28-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8514) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control until #363. Enemy walk until #678 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523) | Mark + rift still blind |
| Spell selection | Footer highlight; blue range; CD overlay digits | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click silent (#419). **Slot AP digit is catalog, not Surge (this ledger)** | Cost ANTICIPATION lies under Surge |
| Target highlight | Hover `-dmg` (non-crit `computeDamage`; Mark already doubles) | Live entity-first gate | Cast or float | — | Hover ignores crit (matrix note). hitsMultiple / bounce rings wait on #571 / #610 | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode wait on #363 / #419. **Buff suppress is debug-only (this ledger)** | Better; queued PRs still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (#419). Boss ability mute (#419). Reflect mute (#735) | **Primary IMPACT still broken** |
| Healing | — | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363 | — | Spell heal path still 014 | Player OK; enemy heal mute |
| AP/MP spend | Hover MP; AP bars 0.3s; **slot AP catalog** | Immediate decrement via live `applyApCost` | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Timestep HUD-only (#571). **Slot digit disagrees with debit (this ledger)** | HUD only; digit can lie |
| Crits | Hover uses non-crit | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Erratic why waits on #735 | Leader overlay yes |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363 | — | Hostile kit spawn mute (#478). Ability minion mute (#610) | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji from `activeEffects` only; panel `{turns}t` | Log on tick/expiry | — | **Shield Charm / Fury never appear (this ledger).** Duration digits still 012 | Readable but item buffs are invisible |
| Spell observation | Hover dmg + inspect | Swap / Mirror / Shell wait on queued PRs | Windstorm still log-only until #363 | — | **Null Field eat is debug-only (this ledger).** No “you were hit by X” toast | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy | Fixed on `main`; copy queued |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610) | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (#419) | Solid shell |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute (#419); portal +10 XP silent | — | Recap heal allowed | Shrine + portal XP still the holes |
| Initiative | Strip + timer | Chaos reshuffle at round wrap (`WX` 14717) | Strip jumps | — | **No shuffle why (this ledger).** Your-turn banner waits on #419 | Strip can surprise |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Highest unique P0 (003).

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF. Leave 011.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have.

7. **`BattleUIPanel` AP digits do not call `resolveCastApCost`.** Execute already does. ANTICIPATION ≠ ACTION (this ledger).

8. **Item-shop combat buffs (Shield / Fury) are refs, not `ActiveEffect`s.** Status chrome never sees them (this ledger).

9. **`applyEffectApplication` false is `logDebugInfo` only.** Null Field’s live veto has no player-facing line (this ledger).

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (Shield/Fury chips, suppress float, Chaos log) and/or `BattleUIPanel.tsx` (live AP digit). Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on WX; UX siblings own the spell bar. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates. Live AP *gate* is theirs; the *digit* is this ledger |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate. Potion *use* IMPACT stays 09-02-004; Shield/Fury *ongoing* is this ledger |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork |
| #419 | 09-22 AN floats + melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009. Do not duplicate |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005 |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004 |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013 |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005 |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004 |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004 |
| #725 | TBC WAITING_FOR_TELEMETRY (09-28) | Docs. Do not invent feel-telemetry |
| #735 | 09-28 silent feel audit | **Owns** 09-28-001…004. Do not duplicate |
| #768 | TBC WAITING_FOR_TELEMETRY (09-29) | Docs. Do not invent feel-telemetry |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-29.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and the dated files on #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 (those eight are not on `main`).

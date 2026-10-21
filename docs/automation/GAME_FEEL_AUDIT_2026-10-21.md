# Game Feel & Combat Feedback Audit — 2026-10-21

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-96277ea1-40a8-41b9-9503-1d352d1843c5`  
**Schedule:** cron `0 */48 * * *` (thirteenth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**, 2026-09-28 queued in **#735**, 2026-09-29 queued in **#772**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 09-29 ledgers. No combat-feel code landed on `main` since those runs. Cron gap since 09-29; this is the next unique-NEW pass, not a rewrite of #772.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (**#833** is the 2026-10-21 WAITING report; #768 was 09-29). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas or recap wiring: every remaining unique hole lives in `WorldExploration.tsx` or `PostBattleRecap.tsx`, which older still-open PRs already own (#327 Striker is the oldest WX sibling; #363 / #419 already queue feel floats; #354 / #421 / #485 touch recap chrome). Unioning those files across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, #678, #735, and #772 already own** their surfaces — do not re-implement them here.

A cooldown-slot arm flash was considered and **rejected** as spectacle: remaining overlay + `"On cooldown"` reject already exist.

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
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t`. **Does not cover** apply floats (this ledger) or Shield Charm / Fury chips (#772) |
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
| GFCF-2026-09-29-001 … 004 | Shield/Fury chips / slot AP digit / Null Field veto / Chaos shuffle | **Queued in #772** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 items as NEW. Do not re-implement those WX call sites on this branch. Hover crit omission stays a matrix note (09-28: do not twin). Do not add a cooldown-slot pulse (overlay + reject already exist).

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`). Slot AP digits still show catalog cost (#772) so a “cancel” can be the player not trusting the number |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799). Final Boss Rush clear is log-only (this ledger) — a drop after room 9 can be “I already won?” not difficulty |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode still silent on `main` (#363 / #419). Null Field eats a buff with no player-facing line (#772) |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806). Chaos Initiative reshuffles the strip with no why (#772) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–09-29; 200+ open sibling PRs; no player population. Cron gap is not a mechanic release |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#833).

---

## What changed since 2026-09-29 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, and **#772** are still open. Sibling combat/persist PRs since 09-29 (#754 Swap landing tax, #799 bomber/Inferno share, #803 Boss Rush `complete(9)` persist) are **not on `main`** and are mechanic-truth, not this ledger.

This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes, grouped under 012, or never filed.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, **not** in #735, **not** in #772, and **not** in 003–015:

1. **Boss Rush final clear has no Complete cue.** Mid-run room-advance mute stays #419 / 09-22-005. Dungeon-chain complete already logs `🏆 Dungeon Chain COMPLETE! Bonus: N Doka!` (`WX` 6374–6377) *then* the white-gateway line. Boss Rush last-room (`WX` 12697–12727) and `subscribeRunComplete` (`WX` 1308–1338) only log the gateway. Sanctuary *step* toast (`WX` 6142) fires later, after the player walks the white portal. Recap of the last room still titles `Boss Rush - Room N` (`WX` 12877) — it does not say the run is over. Distinct from 009 (PHASE 2 / Weeping Pawn). Distinct from sealed progression (#610 / 09-26-001). Distinct from #803 persist `complete(9)` (mechanic).
2. **Challenge outcome never renders on PostBattleRecap.** Fields are typed (`PostBattleRecap.tsx` 16–18) and **never read in JSX**. Dungeon-chain bonus *is* rendered (`PostBattleRecap.tsx` 448–493). Regular victory passes `completedChallenges: challengeCompleted ? ["Battle Challenge"] : []` (`WX` 12469) and discards `_completedChallengeName` (`WX` 12321–12323); it does not pass `dokaFromChallenges`. Boss-rush recap passes live names + split Doka (`WX` 12890–12892) and Recap still ignores them. Empty list is both “no offer” and “failed” — a fail line needs an accepted flag. Challenge HUD stays a non-hole. Distinct from feat recap (#159 / GFCF-007). Distinct from Recap Doka Fever (non-hole).
3. **Buff/debuff APPLY has log + pills, no canvas IMPACT.** `applyActiveEffect` (`WX` 1871–1920) logs magnitude/duration; emoji pills appear (`WX` 8240 / 8356). Haste / Slow / Weaken / Shield / enemy `debuffStat` / DoT-apply all share this mute IMPACT. Distinct from 012 (digits on existing pills). Distinct from Mark consume (#735). Distinct from Mirror activate (#571). Distinct from Null Field veto (#772). **Do not** float from the movement-RAF callers (player lava Burning `WX` 11444; player ice Frozen `WX` 11457) — those stay 011 / 09-23-004. Enemy ice Frozen (`WX` 16918) is off-RAF and may share this ID’s helper.
4. **True status / DoT expiry has no wore-off canvas cue, and the non-DoT log lies.** `tickNonDotEffects` (`statusEffects.ts` 125–133, 146–169) returns every decremented row, including `newDur > 0`. `processActiveEffects` (`WX` 2001–2013) logs `"expired"` for each. DoT stacks that hit 0 drop in `tickDotStacks` (`dotStacks.ts` 113–122) with no wore-off line — only the `[DOT]` damage log while stacks remain. Distinct from 012 (digits while active). Distinct from Fury chip (#772). Distinct from summon `"Fades"` (#419). Do **not** “fix” tick math; gate the existing log/float to true drop.

09-29-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8514) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control until #363. Enemy walk until #678 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523) | Mark + rift still blind |
| Spell selection | Footer highlight; blue range; CD overlay digits | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click silent (#419). Slot AP digit is catalog (#772). CD overlay present — no extra pulse | Cost ANTICIPATION lies under Surge |
| Target highlight | Hover `-dmg` (non-crit `computeDamage`; Mark already doubles) | Live entity-first gate | Cast or float | — | Hover ignores crit (matrix note). hitsMultiple / bounce rings wait on #571 / #610 | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode wait on #363 / #419. Buff suppress waits on #772 | Better; queued PRs still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (#419). Boss ability mute (#419). Reflect mute (#735) | **Primary IMPACT still broken** |
| Healing | — | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363 | — | Spell heal path still 014. Enemy heal mute (#478) | Player OK; enemy heal mute |
| AP/MP spend | Hover MP; AP bars 0.3s; **slot AP catalog** | Immediate decrement via live `applyApCost` | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Timestep HUD-only (#571) | HUD only; digit can lie |
| Crits | Hover uses non-crit | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Erratic why waits on #735 | Leader overlay yes |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport; Game Over 20/40 lines exist | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363 | — | Hostile kit spawn mute (#478). Ability minion mute (#610). Fade mute (#419) | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji from `activeEffects`; panel `{turns}t` | Log on apply; **apply float missing (this ledger)**; expiry log lies every tick (this ledger) | Pill vanishes | Shield Charm / Fury wait on #772. Duration digits still 012 | Apply/expiry INFORMATION thin |
| Spell observation | Hover dmg + inspect | Swap / Mirror / Shell wait on queued PRs | Windstorm still log-only until #363 | — | Null Field eat waits on #772. No “you were hit by X” toast | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy | Fixed on `main`; copy queued |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610). **BR complete mute (this ledger)** | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (#419). **Challenge rows unread (this ledger)** | Shell good; challenge missing |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute (#419); portal +10 XP silent | — | Recap heal allowed. Challenge Doka baked into totals on the regular path | Shrine + portal XP still the holes |
| Initiative | Strip + timer | Chaos reshuffle at round wrap (`WX` 14717) | Strip jumps | — | Shuffle why waits on #772. Your-turn banner waits on #419 | Strip can surprise |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Highest unique P0 (003).

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF. Leave 011. Do not hang apply-floats on those callers.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have.

7. **`BattleUIPanel` AP digits do not call `resolveCastApCost`.** Execute already does (#772).

8. **Item-shop combat buffs (Shield / Fury) are refs, not `ActiveEffect`s.** Status chrome never sees them (#772).

9. **Boss Rush final clear has no Complete cue** (this ledger). Dungeon-chain already has a trophy log.

10. **PostBattleRecap ignores `completedChallenges` / `dokaFromChallenges`** (this ledger). Dungeon bonus already renders.

11. **`applyActiveEffect` IMPACT is log + emoji only** (this ledger), except RAF hazard callers which stay frozen.

12. **Non-DoT “expired” log fires on every decrement** (this ledger). DoT drop is silent.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (Boss Rush banner, apply/expiry floats) and/or `PostBattleRecap.tsx` (challenge rows). Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on WX; UX siblings (#354 / #421 / #485) own recap chrome. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, cooldown overlay, #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates |
| #354 | Feats on recap chrome | UX. Union Recap if 002 is wired later |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork |
| #419 | 09-22 AN floats + melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009 including BR *room-advance* banner. Do not duplicate. Final-clear Complete is this ledger |
| #421 | leftover XP / Game Over 20/40 copy | UX. Game Over 20/40 already on `main` |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005 |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004 |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013 |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005 |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004 |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004 |
| #735 | 09-28 silent feel audit | **Owns** 09-28-001…004 |
| #754 | Tax Swap landings | Mechanic. Swap *puff* stays #523 |
| #772 | 09-29 silent feel audit | **Owns** 09-29-001…004. Do not duplicate |
| #799 | Bomber kamikaze / Inferno share | Combat truth. Do not re-file as GFCF |
| #803 | Boss Rush `complete(9)` persist | Persist order. Banner is this ledger |
| #833 | TBC WAITING_FOR_TELEMETRY (10-21) | Docs. Do not invent feel-telemetry |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-10-21.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and the dated files on #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 (those nine are not on `main`).

# Game Feel & Combat Feedback Audit — 2026-10-23

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-20d26ff6-8be4-4778-bf34-2ab6b483e6fb`  
**Schedule:** cron `0 */48 * * *` (fifteenth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**, 2026-09-28 queued in **#735**, 2026-09-29 queued in **#772**, 2026-10-21 queued in **#845**, 2026-10-22 queued in **#894**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 10-22 ledgers. No combat-feel code landed on `main` since those runs. This is the next unique-NEW pass, not a rewrite of #894.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (**#928** is the 2026-10-23 WAITING report; #871 was 10-22). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: remaining unique holes live in `WorldExploration.tsx` (shock-tile overlay, shrine altar, board-shrink rim) or the boss-ability apply block (Dawn +AP float). Oldest WX owner is still **#327**; **#363** / **#419** already queue feel floats; **#379** / **#417** / **#592** / **#728** already own `SummonControlPanel.tsx`. Unioning those files across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, #678, #735, #772, #845, and #894 already own** their surfaces — do not re-implement them here.

Hover-crit omission stays a matrix note (09-28: do not twin). Cooldown-slot pulse stays rejected as spectacle. Challenge HUD stays a non-hole (`shouldShowChallengeHud`). Rest-*entry* toasts stay a non-hole; rest-*exit* stays #894. Fury/Blood Moon hover stays #894. Heal-body hover stays #894. Summon End Turn leftover title stays #894.

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
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` still invisible. Toast fires *after* the wait (`WX` 13486). #554 owns the walk *block* |
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
| GFCF-2026-10-21-001 … 004 | BR Complete / recap challenges / apply float / true expiry | **Queued in #845** |
| GFCF-2026-10-22-001 … 004 | Rest-exit / Fury-Blood Moon hover / heal hover / summon End Turn title | **Queued in #894** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 items as NEW. Do not re-implement those WX call sites on this branch. Hover crit omission stays a matrix note. Do not add a cooldown-slot pulse.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`). Slot AP digits still show catalog cost (#772). Hover `-dmg` can lie under Fury / Blood Moon (#894) so a “cancel” can be distrust of the preview |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799). Shock tiles and the Alabaster rim are still invisible (this ledger) — a drop on Lord of Static / Alabaster Fortress can be “I never saw the threat,” not difficulty |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode still silent on `main` (#363 / #419). Rest-exit has a 400ms silent wait (#894) that can look like a dead portal click. Invisible shrine altar can look like a dead center tile |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806). Chaos Initiative reshuffles the strip with no why (#772) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–10-22; 200+ open sibling PRs; no player population. Cron tick is not a mechanic release |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#928).

---

## What changed since 2026-10-22 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, **#772**, **#845**, and **#894** are still open. Sibling combat/persist/map PRs since 10-22 (#895–#927 execute-share, remount-wipe, portal snaps) are **not on `main`** and are mechanic-truth, not this ledger.

This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes (“Map modifiers: log + panel”, “Ground Doka juice”, “Rest *entry* toasts”), grouped under boss-ability *juice* (#419), or never filed as a *tile telegraph*.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, **not** in #735, **not** in #772, **not** in #845, **not** in #894, and **not** in 003–015:

1. **Lord of Static shock tiles are stored and used, never drawn.** `applyShockTiles` (`useBossSystem.ts` 710–735) writes `newShockTiles` + `newBossState.activeShockTiles` and logs `"leaves a shock tile at (x,y)!"`. Phase-2 `CHAIN_LIGHTNING` (`useBossAI.ts` 875–886) reads `bossState.activeShockTiles.length` and deals `damageToPlayer`. WX merges `res.newBossState` (`WX` 16079–16086) and applies `damageToPlayer` (`WX` 16025–16039) but **never paints** `activeShockTiles` / `res.newShockTiles` (zero frontend render readers outside `useBossAI` / `useBossSystem` / types). Lava / spikes / void from `res.newHazardTiles` *do* enter `currentMap.hazardTiles` (`WX` 16088–16101) and the floor overlay (`WX` 7417+). Distinct from 09-24-001 (Void Rift *modifier* cell). Distinct from 09-22-002 (ability *number* juice). Distinct from 09-26-003 (boss teleport/jump puff). Do **not** fold unread `damageToTargets` into this ID — that is mechanic-truth (chain never damages other units).
2. **Shrine altar is an unmarked center floor tile.** Dungeon-chain rooms roll a 25% shrine (`WX` 5020–5030) and store `shrineAltarPosRef = (floor(N/2), floor(N/2))` — the same cell as spawn. `_isShrineRoom` is written and **never read in JSX**. Grep of draw code: set / step / null only — no overlay, no nearby label (dungeon portals already have one at `WX` 7916–7941). Stepping the cell pays 300 Doka with no juice until #419 / 09-22-003. Distinct from that IMPACT ID (this is ANTICIPATION: the player cannot see *where* or *that* the room is a shrine). Distinct from ground Doka (visible loot). Distinct from rest-entry toasts (6142 / 6205). PXA still owns covenant honesty (`covenantBuffMapsRef` is written and unread).
3. **Alabaster Fortress crushing rim has no overlay.** `applyBoardShrink` (`useBossSystem.ts` 876–899) deals 5 HP when the player is in the outer 2-tile ring (`x < 2 || x > 13 || y < 2 || y > 13`). `decideAlabasterFortressAction` (`useBossAI.ts` 1062–1071) only returns the ability when `damageToPlayer > 0`, so the “you stay in the safe zone” log never plays as a warning. WX applies the 5 HP with no juice until #419. There is no floor tint for the lethal ring. Distinct from 009 (PHASE 2 banner). Distinct from 09-26-001 (sealed *portal*). Distinct from 09-24-001 (one rift cell). Distinct from 001 this ledger (shock overlay).
4. **Boss-ability AP *grants* have no canvas float.** 09-22-002 already asked for `"-N AP"` when `playerApModifier < 0`. Dawn (`useBossSystem.ts` 1283–1288) returns `playerApModifier: 2` with log `"Dawn briefly blesses you with +2 AP!"`. WX (`WX` 16042–16046) adds any non-zero modifier to the HUD bar and does not float. Distinct from 09-22-002 (drain polarity). Distinct from 09-02-004 (potion drink). Distinct from 09-25-001 (Timestep). Distinct from #376 (the *other* Dawn roll logs `+1 MP` while writing AP — MIMA, not this ID). Do **not** file Dawn’s `damageToPlayer: -10` “heal” here: WX only applies `damageToPlayer > 0`, so that branch is a lying log (MIMA).

10-22-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8514) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control until #363. Enemy walk until #678 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523). **Shock tiles undrawn (this ledger). Alabaster rim undrawn (this ledger). Shrine altar undrawn (this ledger)** | Several live cells still blind |
| Spell selection | Footer highlight; blue range; CD overlay digits | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click silent (#419). Slot AP digit is catalog (#772) | Cost ANTICIPATION lies under Surge |
| Target highlight | Hover `-dmg` omits Fury/Blood Moon (#894). Mark already doubles | Live entity-first gate | Cast or float | — | Hover ignores crit (matrix note). hitsMultiple / bounce rings wait on #571 / #610. Self/ally heal preview waits on #894 | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode wait on #363 / #419. Buff suppress waits on #772 | Better; queued PRs still needed |
| Damage | Hover `-dmg` can lie under Fury/Blood Moon | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (#419). Boss ability mute (#419). Reflect mute (#735). Shock *number* stays #419; shock *cell* is this ledger | **Primary IMPACT still broken** |
| Healing | Slot title `Heals: N HP`; body hover waits on #894 | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363 | — | Spell heal path still 014. Enemy heal mute (#478). Dawn −10 HP “heal” is unread (MIMA) | Player OK after commit; preview thin |
| AP/MP spend | Hover MP; AP bars 0.3s; **slot AP catalog** | Immediate decrement via live `applyApCost` | Elixir/boots wait on #363. **Dawn +AP HUD-only (this ledger)** | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Drain polarity waits on #419. Timestep HUD-only (#571). Summon End Turn leftover untitled (#894) | HUD only; digit can lie |
| Crits | Hover uses non-crit | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Erratic why waits on #735. Bomber detonate uses death pipeline shatter | Leader overlay yes |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport (`WX` 13486); Game Over 20/40 lines exist | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363 | — | Hostile kit spawn mute (#478). Ability minion mute (#610). Fade mute (#419) | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji from `activeEffects`; panel `{turns}t` | Apply float waits on #845; expiry log lies every tick (#845) | Pill vanishes | Shield Charm / Fury wait on #772. Duration digits still 012 | Apply/expiry INFORMATION thin |
| Spell observation | Hover dmg + inspect | Swap / Mirror / Shell wait on queued PRs | Windstorm still log-only until #363 | — | Null Field eat waits on #772. No “you were hit by X” toast | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy | Fixed on `main`; copy queued |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610). BR complete mute (#845). **Shock / rim telegraphs missing (this ledger)** | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (#419). Challenge rows unread (#845) | Shell good; challenge missing |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine *juice* mute (#419); **shrine *tile* mute (this ledger)**; portal +10 XP silent | — | Recap heal allowed. Challenge Doka baked into totals on the regular path | Shrine ANTICIPATION still missing |
| Initiative | Strip + timer | Chaos reshuffle at round wrap (`WX` 14717) | Strip jumps | — | Shuffle why waits on #772. Your-turn banner waits on #419 | Strip can surprise |
| Rest / chain | Rest *entry* toast; dungeon portal nearby label (`WX` 7916–7941) | Rest-*exit* 400ms timeout (`WX` 6236) | Map swap; no sound/toast until #894 | HUD `Dungeon N/M` if armed | Chain *progress* log exists; rest-exit re-arm does not | Rest-exit mute (#894) |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Highest unique P0 (003).

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF. Leave 011.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have. Shock *numbers* stay in that ID; shock *cells* are this ledger.

7. **`BattleUIPanel` AP digits do not call `resolveCastApCost`.** Execute already does (#772).

8. **Item-shop combat buffs (Shield / Fury) are refs, not `ActiveEffect`s.** Status chrome never sees them (#772). Hover `-dmg` also ignores Fury’s 1.25× (#894).

9. **Boss Rush final clear has no Complete cue** (#845). Dungeon-chain already has a trophy log.

10. **PostBattleRecap ignores `completedChallenges` / `dokaFromChallenges`** (#845).

11. **`applyActiveEffect` IMPACT is log + emoji only** (#845), except RAF hazard callers which stay frozen.

12. **Non-DoT “expired” log fires on every decrement** (#845). DoT drop is silent.

13. **Rest-exit is a silent 400ms map swap** (#894). Rest-entry and dungeon-enter already speak.

14. **Hover `-dmg` is not the execute formula for Fury / Blood Moon** (#894).

15. **Shock tiles have log coordinates and no floor tint** (this ledger). Lava/spikes already use `newHazardTiles`.

16. **Shrine rooms have no altar overlay and no room chrome** (this ledger). Claim *juice* stays #419.

17. **Alabaster crushing rim is computed, damaging, and undrawn** (this ledger).

18. **Dawn +AP is HUD-only** (this ledger). Drain polarity stays #419.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (shock overlay, shrine altar, board-shrink rim, Dawn +AP float). Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on WX. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, cooldown overlay, #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates |
| #354 | Feats on recap chrome | UX. Union Recap if #845-002 is wired later |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy for the +1 MP roll. Do not fork. +AP *float* is this ledger |
| #379 / #417 | Walk occupancy / hover MP | Own `SummonControlPanel.tsx`. Union leftover-AP title later (#894) |
| #419 | 09-22 AN floats + melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009 including shrine *juice* and ability *numbers*. Altar *tile* / +AP *grant* / shock *cell* / rim *tint* are this ledger |
| #421 | leftover XP / Game Over 20/40 copy | UX. Game Over 20/40 already on `main` |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005 |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004. Void Rift *cell* stays there; shock *tiles* are this ledger |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013 |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005 |
| #592 | 44px summon End Turn | A11y. Union title string later (#894) |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004 |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004 |
| #728 | Summon End Turn double-fire gate | Combat. Leftover-AP *title* is #894 |
| #735 | 09-28 silent feel audit | **Owns** 09-28-001…004 |
| #754 | Tax Swap landings | Mechanic. Swap *puff* stays #523 |
| #772 | 09-29 silent feel audit | **Owns** 09-29-001…004 |
| #799 | Bomber kamikaze / Inferno share | Combat truth. Shatter already runs on `hp<=0` |
| #803 | Boss Rush `complete(9)` persist | Persist order. Banner is #845 |
| #845 | 10-21 silent feel audit | **Owns** 10-21-001…004. Do not duplicate |
| #850–#927 | Boss/summon kit execute share, remount-wipe, portal snaps | Combat/persist/map truth, not on `main`. Do not re-file as GFCF |
| #871 | TBC WAITING_FOR_TELEMETRY (10-22) | Docs. Superseded as the current WAITING report by **#928** |
| #894 | 10-22 silent feel audit | **Owns** 10-22-001…004. Do not duplicate |
| #928 | TBC WAITING_FOR_TELEMETRY (10-23) | Docs. Do not invent feel-telemetry |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-10-23.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and the dated files on #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 (those eleven are not on `main`).

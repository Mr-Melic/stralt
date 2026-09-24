# Game Feel & Combat Feedback Audit — 2026-09-24

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-adc62e53-57d0-4ba7-9a84-79c4d1a2a81e`  
**Schedule:** cron `0 */48 * * *` (seventh ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 / 09-22 / 09-23 ledgers. No combat-feel code landed on `main` in the last 48h.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY`. Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: every remaining unique hole lives in `WorldExploration.tsx`, which older still-open PRs already own (#327 Striker is the oldest WX sibling; #363 / #419 already queue feel floats). Unioning that file across the queue is not an extremely small, low-risk correction. **#363, #419, and #478 already own** their surfaces — do not re-implement them here.

---

## Prior ledger status

| ID | Title | Status this run |
| :--- | :--- | :--- |
| GFCF-2026-08-31-001 | Screen-space juice anchors | **Shipped** (#149) |
| GFCF-2026-08-31-002 | Player-facing reject copy | **Shipped** (#149 / 09-01) |
| GFCF-2026-08-31-003 | `applyDamageToEnemy` IMPACT juice | **Still open.** Highest remaining unique P0. Not auto-implemented (MEDIUM double-spawn vs bounce / `enemyTakesDamage`). **Also covers** hitsAllies `__player__` (log + `spell_hit`, no number) — do not twin |
| GFCF-2026-08-31-004 | Draw armed hit-flash | **Still open.** `getHitFlashAlpha` still has zero render call sites (`effects.ts` 331). `triggerHitFlash` is armed from `playerTakesDamage` / `enemyTakesDamage` only |
| GFCF-2026-08-31-005 | Hit-stop `timeScaleRef` | **Still deferred.** RAF freeze |
| GFCF-2026-08-31-006 | Walk reject floats | **Shipped** (09-01) |
| GFCF-2026-08-31-007 | In-battle feats on recap | **Shipped** (#159 / `recapUnlocks.ts`) |
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped (`rewardFeel.ts`). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295). `BattleRecapData` has no `previousLevel` / `didLevelUp` — chrome needs a flag, not a guess from leftover XP |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* (`WX` 6496–6504) |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8521–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF (`WX` 11428–11482). Do **not** add juice on that RAF path here |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` (`WX` 13378) still invisible; HP restored immediately |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` 9344 `triggerVfx: () => { /* no-op */ }`. Drain heal remains log-only (`castHelpers.ts` 473–487) |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 | Summon-control walk floats | **Queued in #363** (not on `main`) |
| GFCF-2026-09-02-003 | Paper Windstorm miss float | **Queued in #363** |
| GFCF-2026-09-02-004 | Potion / item IMPACT | **Queued in #363** (`handleUseItem` still log-only at `WX` 3545–3563) |
| GFCF-2026-09-02-005 | Attack Nearest no-AP hotkey | **Queued in #363** (`main` still only floats cooldown at `WX` 17251–17262) |
| GFCF-2026-09-21-001 | Attack Nearest off-turn float | **Queued in #363** |
| GFCF-2026-09-21-002 | Summon-control kit fail float | **Queued in #363** |
| GFCF-2026-09-21-003 | Summon-control kit no-target | **Queued in #363** |
| GFCF-2026-09-21-004 | Sacrifice damage number | **Queued in #363** |
| GFCF-2026-09-21-005 | Attack Nearest no-legal-target canvas float | **Queued in #419** (footer flash only on `main` at `WX` 17300 / 17317) |
| GFCF-2026-09-22-001 | Enemy melee IMPACT juice | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-002 | Boss-ability damage / AP canvas | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-003 | Shrine altar pickup juice | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-004 | Attack Nearest mode / no-spell float | **Queued in #419** as IMPLEMENTED_THIS_PR (not on `main`) |
| GFCF-2026-09-22-005 | Boss Rush room-advance banner | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-006 | Victory-persist portal float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-007 | Summon lifespan fade float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-008 | 0 AP Attack / spell-slot click float | **Queued in #419** as NEW / RECOMMEND |
| GFCF-2026-09-22-009 | Optional “Your turn” banner | **Queued in #419** as NEW / RECOMMEND (do not lengthen turns) |
| GFCF-2026-09-23-001 | Enemy/boss self-heal green number | **Queued in #478**. **Also** the drain self-heal branches (`WX` 16626–16638 enemy; `WX` 15873–15885 boss) — same IMPACT, do not twin |
| GFCF-2026-09-23-002 | Hostile summon puff + SFX | **Queued in #478** |
| GFCF-2026-09-23-003 | Player 30s timer `"Time's up!"` | **Queued in #478** |
| GFCF-2026-09-23-004 | Ice Frozen (RAF freeze) | **Queued in #478** |
| GFCF-2026-09-23-005 | Portal +10 XP after commit | **Queued in #478** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 items as NEW. Do not re-implement those WX call sites on this branch.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`) |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode / no-target still silent on `main` (#363 / #419). Invisible Void Rift / Mark tiles would look like “random” illegal or unexplained HP loss |
| Long turns around certain mechanics | **No series** | 30s turn timer exists (`WX` 14765–14806); expiry itself has no canvas copy (#478 / 09-23-003) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–09-23; 150+ open sibling PRs; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY`.

---

## What changed since 2026-09-23 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, and **#478** are still open/draft. Later same-day PRs (#483 timer/End Turn race, #485 Feat Unlocked copy, #501 leftover-walk rAF) do not land feel juice on `main`. This run searched for silent ANTICIPATION / IMPACT paths that those ledgers listed as explicit non-holes or never filed.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, and **not** in 003–015:

1. **Void Rift cell is invisible.** `voidRiftTile` is React state (`WX` 2348) used only by `applyBattleWalkHazards` / turn-start standing damage. It is **never read in the canvas pass**. The warp log prints grid coords (`WX` 14389–14391: `"Void Rift warps tile (x,y)! Avoid it!"`). Players have no visible grid numbers. Map gen also paints **lava** overlays when `void_rift` is triggered (`WX` 6705–6709) — those tiles are real lava (011), not the rift cell. ANTICIPATION fails: you cannot see the tile you are told to avoid.
2. **Map-modifier HP has no canvas number (off the movement RAF).** Thorned Ground / Void Rift *walk* (`applyBattleWalkHazards` `WX` 9906–9928) and Plague Zone / Void Rift *standing* ticks (`WX` 14313–14324 player; mirrored on summon/enemy turns ~14449 / ~14545 / ~14646) write HP + log. They do **not** call `playerTakesDamage` / `spawnDamageAtTile`. Distinct from 011 (lava/spikes **inside** the movement RAF). Juice here is safer than 011 because it is not on the walk tick.
3. **Swap has no IMPACT.** `swapPositions` (`WX` 9389–9401) writes both coordinates the same frame. No puff, no float, no camera punch. The camera follows the player, so the world jumps. Distinct from walk (600ms path) and from 09-22-007 (summon fade).
4. **Mark tiles are invisible.** `placeMark` (`WX` 9404) inserts `"x,y"` into `markedTilesRef`. `computeDamage` doubles on that key (`WX` 3331–3334) and then deletes it (`WX` 3391–3392). The floor pass draws lava/ice/spikes overlays (`WX` 7417+) but never `markedTilesRef`. Hover can show `×2 mark` in the breakdown without a tile reason. Distinct from Void Rift (different mechanic; Mark is a player spell).

09-23-001…005 stay queued. Primary-hit juice (003) remains the highest unique P0. Enemy drain self-heal is **absorbed into 09-23-001**, not a twin.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8521) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control still log-only until #363 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. **Mark / Void Rift cells have no overlay** | Mark + rift are blind |
| Spell selection | Footer/panel highlight; blue range | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click still silent (09-22-008) | Clear enough |
| Target highlight | Hover `-dmg` on enemy (non-crit `computeDamage`) | Live entity-first gate | Cast or float | — | Hover ignores crit; no AoE ring; marked hover can show ×2 with no tile tint | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode / no-target wait on #363 / #419 | Better; queued PRs still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary `applyDamageToEnemy` mute (003). Enemy melee mute (09-22-001). Boss ability mute (09-22-002). **Modifier HP mute (this ledger)** | **Primary + melee + modifier IMPACT still broken** |
| Healing | — | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363; **enemy/boss self-heal + drain log-only** (09-23-001) | — | Spell heal path still 014 | Player OK; enemy heal mute |
| AP/MP spend | Hover MP; AP bars 0.3s | Immediate decrement | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit | HUD only |
| Crits | Hover uses non-crit `computeDamage` | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Screen-space shatter from #149 | Leader > regular |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363; fade wait on 09-22-007 | — | **Hostile spawn is mute.** Expiry is log-only | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji (4 + overflow); panel has `{turns}t` | Log on tick/expiry. Ice Frozen is log-only in RAF | — | No remaining-turns on canvas. Fury expiry is log-only (`WX` 14293) | Readable but thin |
| Spell observation | Hover dmg + inspect | Swap snaps with no puff | Windstorm still log-only until #363 | — | No “you were hit by X” toast. Barrier fade logs `"Barrier at 3,5"` | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy | Fixed on `main`; copy queued |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (09-22-006) | Solid shell |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute (09-22-003); **portal +10 XP silent after commit**; dungeon-complete has gold log, no pickup juice | — | Recap heal allowed | Shrine + portal XP are the holes |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Player spells play hit/crit *sound* and write the log. Bounce / DoT / helper damage uses `enemyTakesDamage`, which *does* spawn juice. Same hit, two feels. hitsAllies `__player__` is this path (log + sound, no number) — fix under 003, not a new ID.

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** RAF uses `tick(16)` and never reads `timeScaleRef`. Do **not** implement here.

4. **Lava / spikes** still move HP inside the movement RAF without `playerTakesDamage`. Reflect / shield stay log-first on those paths.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have.

7. **Enemy / boss self-heal + drain** (09-23-001) skip the green number that player `heal()` already has.

8. **Void Rift cell and Mark tiles are not drawn.** Logs / hover breakdowns cannot substitute for a tile tint.

9. **Thorned / Plague / rift-walk HP** skip `playerTakesDamage` off the RAF — numbers are cheap here (unlike 011).

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (and, for Void Rift / Mark, the existing floor overlay pass). Oldest WX owner is **#327**; **#363** / **#419** / **#478** already queue feel work on that file. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, #363 / #419 / #478 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite. |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates. |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate. |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork. |
| #419 | 09-22 AN floats + NEW melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009. Do not duplicate. `NO_TARGET_COPY` === `#363 SUMMON_NO_TARGET_COPY` string. |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF. |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005. Do not duplicate. Drain self-heal stays under 001. |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork. |
| #462 | TBC WAITING_FOR_TELEMETRY | Docs. Do not invent feel-telemetry. |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-24.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, #363’s `ACTION_IDS_GFCF_2026-09-21.md`, #419’s `ACTION_IDS_GFCF_2026-09-22.md`, and #478’s `ACTION_IDS_GFCF_2026-09-23.md` (the last three are not on `main`).

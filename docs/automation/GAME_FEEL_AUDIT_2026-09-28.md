# Game Feel & Combat Feedback Audit — 2026-09-28

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-e2719604-245e-424a-8e72-e49140568f3b`  
**Schedule:** cron `0 */48 * * *` (eleventh ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 09-27 ledgers. No combat-feel code landed on `main` since those runs.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (#661 was the 2026-09-27 WAITING report; **#725** is the 2026-09-28 WAITING report). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: every remaining unique hole lives in `WorldExploration.tsx` (or the WX `onPlayerReflectedDamage` callback), which older still-open PRs already own (#327 Striker is the oldest WX sibling; #363 / #419 already queue feel floats). Unioning that file across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, and #678 already own** their surfaces — do not re-implement them here.

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
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped (`rewardFeel.ts`). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295). `BattleRecapData` has no `previousLevel` / `didLevelUp` — chrome needs a flag from the WX recap builder, not a leftover-XP guess |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* (`WX` 6496–6504) |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8521–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF (`WX` 11428–11482). Mirror Field reflect (`WX` 9538–9561) stays under this ID. Shield absorb is log-only inside `playerTakesDamage` (`WX` 3433–3438) — same ID. Do **not** add juice on the lava RAF path here. Void Mirror / Reflect Shield *numbers* are this ledger |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` (`WX` 13378) still invisible; HP restored immediately. #554 owns the walk *block*, not the wait chrome. Silent Death Realm *portal* return stays here — do not twin |
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
| GFCF-2026-09-21-005 | Attack Nearest no-legal-target canvas float | **Queued in #419** |
| GFCF-2026-09-22-001 | Enemy melee IMPACT juice | **Queued in #419** |
| GFCF-2026-09-22-002 | Boss-ability damage / AP canvas | **Queued in #419** |
| GFCF-2026-09-22-003 | Shrine altar pickup juice | **Queued in #419** |
| GFCF-2026-09-22-004 | Attack Nearest mode / no-spell float | **Queued in #419** (IMPLEMENTED_THIS_PR, not on `main`) |
| GFCF-2026-09-22-005 | Boss Rush room-advance banner | **Queued in #419** |
| GFCF-2026-09-22-006 | Victory-persist portal float | **Queued in #419**. Distinct from sealed-progression (#610) |
| GFCF-2026-09-22-007 | Summon lifespan fade float | **Queued in #419** |
| GFCF-2026-09-22-008 | 0 AP Attack / spell-slot click float | **Queued in #419** |
| GFCF-2026-09-22-009 | Optional “Your turn” banner | **Queued in #419** |
| GFCF-2026-09-23-001 | Enemy/boss self-heal green number | **Queued in #478**. Drain self-heal stays here |
| GFCF-2026-09-23-002 | Hostile summon puff + SFX | **Queued in #478**. Kit path `commitHostileSummon` only — boss `res.spawns` is #610 |
| GFCF-2026-09-23-003 | Player 30s timer `"Time's up!"` | **Queued in #478** |
| GFCF-2026-09-23-004 | Ice Frozen (RAF freeze) | **Queued in #478**. Player RAF only — enemy ice landing is #678 |
| GFCF-2026-09-23-005 | Portal +10 XP after commit | **Queued in #478** |
| GFCF-2026-09-24-001 | Draw the live Void Rift cell | **Queued in #523** |
| GFCF-2026-09-24-002 | Map-modifier HP numbers off-RAF | **Queued in #523**. Player thorned / plague / rift-walk — not enemy hazard landing |
| GFCF-2026-09-24-003 | Swap puff | **Queued in #523**. Player Swap only — boss teleport is #610; enemy walk is #678 |
| GFCF-2026-09-24-004 | Mark tile tint | **Queued in #523**. Armed-tile ANTICIPATION — consume IMPACT is this ledger |
| GFCF-2026-09-25-001 | Timestep restore / `"Already used"` | **Queued in #571** |
| GFCF-2026-09-25-002 | Mirror activate float | **Queued in #571**. Activate only — consume/reflect IMPACT is #678 |
| GFCF-2026-09-25-003 | Betrayal IMPACT juice | **Queued in #571**. Victim number only — betrayer 6× transform is #678 |
| GFCF-2026-09-25-004 | hitsMultiple victim hover | **Queued in #571**. Bounce preview is #610 |
| GFCF-2026-09-25-005 | Occupied summon dest float | **Queued in #571** |
| GFCF-2026-09-26-001 | Sealed progression portal float | **Queued in #610** |
| GFCF-2026-09-26-002 | Boss ability minion/ghost puff | **Queued in #610** |
| GFCF-2026-09-26-003 | Boss teleport / knight-jump puff | **Queued in #610**. Ability `res.newBossPosition` only — regular AI dest is #678 |
| GFCF-2026-09-26-004 | Bounce-victim hover | **Queued in #610** |
| GFCF-2026-09-27-001 | Player Mirror consume/reflect IMPACT | **Queued in #678**. Enemy HP — not Void Mirror / Reflect Shield onto the player |
| GFCF-2026-09-27-002 | Enemy in-battle walk puff | **Queued in #678**. Do not add a 600ms tween |
| GFCF-2026-09-27-003 | Enemy lava / spikes / ice landing | **Queued in #678** |
| GFCF-2026-09-27-004 | Betrayal enrage 6× canvas | **Queued in #678**. Survivor only |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 items as NEW. Do not re-implement those WX call sites on this branch.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`) |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799). Invincible / `damageImmune` logs also never become banners (WX never *reads* those flags — MIMA). Shell Armor *does* apply on the player-spell path (this ledger) |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist) |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Sealed progression portal is log-only until #610. Attack Nearest AP / mode / no-target still silent on `main` (#363 / #419). Void Mirror / Reflect Shield look like a “free” hit that secretly hurt the player (this ledger) |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806). Post-leader erratic is a snap-walk, so “why is the pack wild” can be missed rather than a long think |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–09-27; 200+ open sibling PRs; no player population |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#725).

---

## What changed since 2026-09-27 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, and **#678** are still open. This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes, grouped incorrectly, or never filed.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, and **not** in 003–015:

1. **Void Mirror / Reflect Shield player IMPACT is mute.** `applyDamageToEnemy` writes player HP and calls `onPlayerReflectedDamage` (`castHelpers.ts` 335–376). WX only records challenge damage (`WX` 9496–9501). No number, flash, or shake. Distinct from 011 (Mirror *Field* 20% at `WX` 9538–9561). Distinct from 09-27-001 (player Mirror consume onto the *attacker*).
2. **Shell Armor is applied on the player-spell path and still has no canvas why.** 09-26 / 09-27 grouped it with unread invincible / `damageImmune`. `castHelpers.ts` 347–361 **does** halve `finalDmg` while larvae live. A `"Shell Armor"` float is not a lie on that path. Invincible / `damageImmune` stay MIMA.
3. **Mark consume has no IMPACT/INFORMATION.** `computeDamage` doubles (`WX` 3331–3335); `calculatePlayerDamage` deletes the key (`WX` 3390–3393). 09-24-004 is the armed-tile tint only.
4. **Post-leader erratic is log-only.** `allEnemiesErraticRef` flips with a log (`WX` 15507–15518). `LEADER DEFEATED!` overlay already exists. The pack-panic *why* does not. Distinct from 09-27-002 (walk puff) and 009 (phase).

09-27-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8521) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control empty path still log-only until #363; occupied dest until #571. Enemy battle walk is a snap until #678 | Weak anticipation; enemy ACTION mute until #678 |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523). Mark *consume* still mute (this ledger) | Mark + rift are blind; consume is mute |
| Spell selection | Footer/panel highlight; blue range; CD overlay digits on slots | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click still silent (09-22-008). hitsMultiple victims not in the ring (#571). Bounce victims not in the ring (#610) | Range ≠ blast ≠ bounce |
| Target highlight | Hover `-dmg` on enemy (non-crit `computeDamage`; Mark already doubles the preview) | Live entity-first gate | Cast or float | — | Hover ignores crit; no hitsMultiple ring; no bounce ring; Mark consume has no “why it vanished” | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode / no-target wait on #363 / #419. Sealed portal waits on #610 | Better; queued PRs still needed |
| Damage | Hover `-dmg` | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (09-22-001). Boss ability mute (09-22-002). Modifier HP mute (#523). Betrayal victim mute (#571). Mirror reflect mute (#678). Enemy hazard mute (#678). **Void Mirror / Reflect Shield mute (this ledger)** | **Primary IMPACT still broken**; bounce is the exception |
| Healing | — | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363; enemy/boss self-heal + drain log-only (09-23-001) | — | Spell heal path still 014. HUD Doka-to-HP toasts | Player OK; enemy heal mute |
| AP/MP spend | Hover MP; AP bars 0.3s; CD overlay | Immediate decrement | Elixir/boots wait on #363 | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Timestep restore HUD-only (#571) | HUD only |
| Crits | Hover uses non-crit `computeDamage` | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Screen-space shatter from #149. **Erratic pack why is log-only (this ledger)** | Leader overlay yes; pack panic no |
| Player death | HP bar | Recap + 1.5s timer | Toast after teleport | Death Realm | Timer invisible; body looks alive. #554 blocks walks | Modal, not a moment |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363; fade wait on 09-22-007 | — | Hostile kit spawn mute (#478). Ability minion spawn mute (#610) | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji (4 + overflow); panel has `{turns}t` | Log on tick/expiry. Player ice Frozen is log-only in RAF. Enemy ice landing is log-only until #678 | — | No remaining-turns on canvas | Readable but thin |
| Spell observation | Hover dmg + inspect | Swap snaps with no puff (#523). Mirror *up* is log-only (#571). Mirror *consume* is log-only (#678). **Shell Armor why is log-only (this ledger)** | Windstorm still log-only until #363 | — | No “you were hit by X” toast. Bounce extra hits are numbered but untelegraphed until #610 | Log / inspect only |
| Spell discovery | Full spellbook | — | — | — | No unknown-spell fog | Product gap (SDA/PXA) |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N” | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159) | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy | Fixed on `main`; copy queued |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610). Ability minions mute (#610). Shell Armor why mute (this ledger) | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (09-22-006) | Solid shell |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine mute (09-22-003); portal +10 XP silent after commit; dungeon-complete has gold log | — | Recap heal allowed. Sealed portal after flee/partial clear is log-only (#610) | Shrine + portal XP + sealed are the holes |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Player spells play hit/crit *sound* and write the log. Bounce / DoT / helper / Sacrifice-*enemy* / bomber blast use `enemyTakesDamage`, which *does* spawn juice. Same hit, two feels. hitsAllies `__player__` is this path — fix under 003, not a new ID.

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** RAF uses `tick(16)` and never reads `timeScaleRef`. Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF without `playerTakesDamage`. Reflect / shield stay log-first on those paths (Mirror Field reflect included). *Enemy* hazard landing is #678. Void Mirror / Reflect Shield *player numbers* are this ledger — do not fold them into the RAF path.

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have.

7. **Enemy / boss self-heal + drain** (09-23-001) skip the green number that player `heal()` already has.

8. **Void Rift cell and Mark tiles are not drawn** (#523). Mark *consume* is this ledger.

9. **Thorned / Plague / rift-walk HP** skip `playerTakesDamage` off the RAF (#523 / 09-24-002).

10. **Betrayal victim** skips `enemyTakesDamage` (#571). Betrayer 6× inflate is #678.

11. **hitsMultiple hover is click-range, not victim-set** (#571). Bounce hover is #610.

12. **Boss ability minions** skip the puff that player summons already have (#610).

13. **Player Mirror consume** skips `spawnDamageAtTile` on the attacker (#678).

14. **Enemy battle walk** skips the tween that overworld wander already has (#678). Do **not** add a 600ms path — puff only.

15. **`onPlayerReflectedDamage` is challenge-only** (this ledger). HP already moved; IMPACT did not.

16. **Shell Armor halves the spell hit and only logs** (this ledger). Invincible / `damageImmune` still unread — do not banner those.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (`onPlayerReflectedDamage`, Shell Armor float, Mark consume, erratic edge). Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on that file. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, #363 / #419 / #478 / #523 / #571 / #610 / #678 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite. Bounce *preview* stays #610; Striker *execute* range stays #327 |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy. Do not fork |
| #419 | 09-22 AN floats + NEW melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009. Do not duplicate |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005. Do not duplicate. Drain self-heal stays under 001. Kit hostile spawn stays under 002. Player ice RAF stays under 004 |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004. Do not duplicate. Mark *tint* stays 004; consume is this ledger |
| #541 | Swap live tile + abort leftover walk | Combat truth. Puff stays #523 / 09-24-003 |
| #551 | Mark on highlighted empty tiles | Combat truth. Tint stays #523 / 09-24-004 |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013 |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005. Do not duplicate. Mirror *activate* stays 002. Betrayal *victim* stays 003 |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004. Do not duplicate. Boss teleport stays 003 |
| #661 | TBC WAITING_FOR_TELEMETRY (09-27) | Docs. Do not invent feel-telemetry |
| #725 | TBC WAITING_FOR_TELEMETRY (09-28) | Docs. Do not invent feel-telemetry |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004. Do not duplicate. Player Mirror consume stays 001. Enemy walk puff stays 002 |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-09-28.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, #363’s `ACTION_IDS_GFCF_2026-09-21.md`, #419’s `ACTION_IDS_GFCF_2026-09-22.md`, #478’s `ACTION_IDS_GFCF_2026-09-23.md`, #523’s `ACTION_IDS_GFCF_2026-09-24.md`, #571’s `ACTION_IDS_GFCF_2026-09-25.md`, #610’s `ACTION_IDS_GFCF_2026-09-26.md`, and #678’s `ACTION_IDS_GFCF_2026-09-27.md` (the last seven are not on `main`).

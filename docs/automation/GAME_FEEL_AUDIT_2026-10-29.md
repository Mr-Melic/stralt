# Game Feel & Combat Feedback Audit — 2026-10-29

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-3300fda7-8e7f-4bee-a4d7-b3c5b05855d9`  
**Schedule:** cron `0 */48 * * *` (twenty-first ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**, 2026-09-28 queued in **#735**, 2026-09-29 queued in **#772**, 2026-10-21 queued in **#845**, 2026-10-22 queued in **#894**, 2026-10-23 queued in **#954**, 2026-10-24 queued in **#1003**, 2026-10-25 queued in **#1061**, 2026-10-26 queued in **#1133**, 2026-10-27 queued in **#1184**, 2026-10-28 queued in **#1227**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 10-28 ledgers. No combat-feel code landed on `main` since those runs. This is the next unique-NEW pass, not a rewrite of #1227.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (**#1277** is the 2026-10-29 WAITING report; **#1232** was 10-28). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas or recap wiring: remaining unique holes live in `WorldExploration.tsx` (`handleBattleEnd` recap payload, `handleBossRushRoomClear` recap / unused `_currentRoom`) plus `PostBattleRecap.tsx` Depth defaults and `useBossRush.ts` resume-read catch. Oldest WX owner is still **#327**; **#363** / **#419** already queue feel floats. **#845** / **#354** own Recap chrome. **#803** owns `useBossRush.ts` abort persist order. Unioning those files across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, #678, #735, #772, #845, #894, #954, #1003, #1061, #1133, #1184, and #1227 already own** their surfaces — do not re-implement them here.

Hover-crit omission stays a matrix note (09-28: do not twin). Cooldown-slot pulse stays rejected as spectacle. Challenge HUD ongoing chrome stays a non-hole (`shouldShowChallengeHud`); recap rows stay #845; rising-edge *fail* stays #1003; offer *log* / unaccepted *expire* stay #1061. Rest-*entry* toasts stay a non-hole; rest-*exit* stays #894. Dungeon nearby labels stay a non-hole; white / Boss Rush nearby stay #1003; Death Realm *Escape* nearby stays #1061; Death Realm *HUD chip* stays #1133. Do not label rest. Do not steal the `boss` star-burst. Spellbook upgrade toast stays #1003. Shop persist-*fail* stays #1061. Heal persist-*fail* after a success toast stays #1133. Victory persist-*fail* after recap stays #1133. Fury/Blood Moon hover stays #894. Ground Doka float-before-commit stays a listed 10-26 non-hole (`#err` releases the same coin). Portal +10 *success* float stays #478; *level-up sound* stays #1184; *fail toast* stays #1184. Death-save fail stays #1184. Dungeon/BR *run-ended on death* stays #1184. Dungeon-complete persist-*fail* stays #1227. Feat unlock *confirm* stays #1227. BR room-advance persist-*fail* stays #1227. BR *entry* log stays #1227. Do not re-file `#803` abort persist. White / rest gen-fail stays AQA / GMI. BoostToggle disconnected from WX stays PXA.

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
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped on *recap* (`rewardFeel.ts` / `WX` 12514). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295). Portal +10 can also level with **no** sound (#1184). Spell-*book* upgrade IMPACT is #1003 |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8514–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF. Mirror Field / shield absorb stay here. Void Mirror *numbers* stay #735. Thorn/rift *numbers* stay #523 |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` still invisible. Toast fires *after* the wait (`WX` 13486). #554 owns the walk *block*. Nearby *Escape* is #1061. HUD *chip* is #1133 |
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
| GFCF-2026-10-23-001 … 004 | Shock cell / shrine tile / Alabaster rim / Dawn +AP | **Queued in #954** |
| GFCF-2026-10-24-001 … 004 | White nearby / BR nearby / spell-upgrade toast / challenge-fail rising-edge | **Queued in #1003** |
| GFCF-2026-10-25-001 … 004 | Death Realm Escape nearby / challenge offer log / unaccepted expire / shop Buy persist-fail | **Queued in #1061** |
| GFCF-2026-10-26-001 … 004 | In-battle lava skip Game Over / heal persist-fail / victory persist-fail / Death Realm HUD chip | **Queued in #1133** |
| GFCF-2026-10-27-001 … 004 | Death-save fail / portal level-up sound / run-ended on death / portal XP persist-fail | **Queued in #1184** |
| GFCF-2026-10-28-001 … 004 | Dungeon-complete persist-fail / feat unlock confirm / BR room-advance persist-fail / BR entry log | **Queued in #1227** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 / #1184 / #1227 items as NEW. Do not re-implement those WX call sites on this branch. Hover crit omission stays a matrix note. Do not add a cooldown-slot pulse. Do not add a rest nearby label. Do not tint `boardClaimZone`. Do not reveal Ink Veil glyphs. Do not paint unread illusions / larvae / `void` overlays. Do not steal the `boss` star-burst. Do not pulse Death Realm chrome every frame. Do not toast every shop Buy or overworld-heal *success*. Do not label overworld black/blue/red. Do not twin Ground Doka as a persist-fail ID. Do not re-file `#803` `abortBossRush` persist order as GFCF. White / rest *gen-fail* after `cleanupMap` stays AQA / GMI (Death Realm already has a fallback + toast). Enemy-AI `decide/apply` throw stays an exception path. BoostToggle disconnected from WX (`GameFlow` `_boostMode` unused; WX `_setBoostMode` unused, always `"xp"`) stays PXA — do not add recap “+50% XP” chrome for a control the player never sees. Unused `enemy_death` / `leader_boost` / `combo` SFX stay dead hooks — do not add spectacle.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only (`clickTrace.ts` 1–8; WX `recordClickOutcome` DEV-gated) | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`). Slot AP digits still show catalog cost (#772). Hover `-dmg` can lie under Fury / Blood Moon (#894) so a “cancel” can be distrust of the preview |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed. A dungeon recap that always says Depth 1/? (this ledger) can look like “every floor paid the same 1.5×, so later floors are not worth the flee risk.” A mute per-kill Doka row (this ledger) can look like “I cannot tell which enemy paid.” A BR recap that never names the two bosses (this ledger) can look like a normal trash fight |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799). Shock tiles and the Alabaster rim are still invisible (#954). BR *entry* is a silent `cleanupMap` until #1227. Dying mid-Rush has no “run ended” line until #1184. A resume-read fail that silently restarts Room 1 (this ledger) looks like “the run wiped itself,” not difficulty |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist). Spell *upgrade* commits without a toast until #1003 |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode still silent on `main` (#363 / #419). Rest-exit has a 400ms silent wait (#894). Invisible shrine altar can look like a dead center tile (#954). Challenge *fail* is HUD-only until #1003. Overworld heal *success* toast then silent rollback until #1133. Portal XP fail is `console.warn` after the map already swapped until #1184. A trophy log then a frozen wallet looks like “the first portal ate my click” until #1227 |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806) and the footer already pulses at ≤7s. Chaos Initiative reshuffles the strip with no why (#772) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–10-28; **959** open sibling PRs; no player population. Cron tick is not a mechanic release. #1277 is TBC WAITING, not feel |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#1277). `longHorizonSim.ts` 532–536 still reports `telemetry.available: false`. WX 16443–16446 is still an empty `if (action.intent)` comment, not an emit.

---

## What changed since 2026-10-28 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, **#772**, **#845**, **#894**, **#954**, **#1003**, **#1061**, **#1133**, **#1184**, and **#1227** are still open. Sibling TBC PR **#1277** (WAITING_FOR_TELEMETRY, 2026-10-29) is **not on `main`** — docs, not this ledger. Open PRs vs `main` at this run: **959**.

This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes (“dungeon HUD `Dungeon N/M`”, “recap Doka total”, “BR recap `mapTitle` Room N”, “BR HUD chip”, “BR mount cache so startBossRush can resume”) while a *different* recap field, a *different* boss-name cue, or a *different* resume-read fail stayed mute.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, **not** in #735, **not** in #772, **not** in #845, **not** in #894, **not** in #954, **not** in #1003, **not** in #1061, **not** in #1133, **not** in #1184, **not** in #1227, and **not** in 003–015:

1. **Dungeon-chain recap badge always says Depth 1/?.** `handleBattleEnd` copies `dungeonMultiplier: chainMult \|\| 1` (`WX` 12470) and never sets `dungeonDepth` / `dungeonMaxDepth`. `PostBattleRecap` paints the badge whenever `dungeonMultiplier > 1` (`PostBattleRecap.tsx` 448–493) and defaults `Depth {data.dungeonDepth ?? 1}/{data.dungeonMaxDepth ?? "?"}`. `dungeonDokaMultiplierFor(true, 1) === 1.5` (`portalRules.ts` 155–162 / test), so **every** in-chain fight — including depth 5 at 4× — shows “Depth 1/?”. Live HUD already tells the truth (`⚔️ Dungeon {dungeonChainDepth}/{dungeonChainMaxDepth}` at `WX` 17562–17575). Nearby dungeon label already says `Continue Chain (N/M)` (`WX` 7916–7941). Distinct from dungeon-enter / progress / trophy *logs* (non-holes). Distinct from dungeon-complete persist-*fail* (#1227). Distinct from recap challenge *rows* (#845). Distinct from 008 recap LEVEL UP chrome.
2. **Overworld recap discards the per-enemy Doka rows it just computed.** `handleBattleEnd` builds `dokaBreakdown` with the jackpot tiers (`WX` 12380–12415), sums it into `rawDoka`, then passes `dokaBreakdown: []` (`WX` 12468). Boss Rush recap on the same overlay **does** pass rows (`WX` 12885–12889). `resolveBattleRewards` also returns `dokaBreakdown: []` (`rewardResolver.ts` 222) — the live overlay uses the WX payload, not that helper’s empty array. 90% of rolls are 1–3×; the 0.01% `level * [1, 1e9]` band is why the rows were emptied (`applyRewardsResult.ts` 41–44). Recap total is already clamped (`WX` 12447–12450). Distinct from Doka Fever ×2 (announce + recap *total* stay enough). Distinct from recap challenge *rows* (#845 — those fields are unread; this ID is the *empty array* on a field the UI already renders). Distinct from Ground Doka float. Distinct from dungeon-complete bonus (#1227).
3. **Boss Rush room-clear recap never names the two bosses just beaten.** `handleBossRushRoomClear` loads `const _currentRoom = BOSS_RUSH_ROOMS[currentRoomIndex]` (`WX` 12693) and does not put `boss1Name` / `boss2Name` on the recap. Payload has `mapTitle: \`Boss Rush - Room ${currentRoomIndex + 1}\`` and **no** `bossDefeated` (`WX` 12876–12895). Overworld `handleBattleEnd` *does* set `bossDefeated: currentBossConfigRef.current?.name` (`WX` 12471), which drives the recap `BOSS DEFEATED` banner (`PostBattleRecap.tsx` 148–176). `spawnBossRushRoom` never writes `currentBossConfigRef` (`WX` 5288–5378), so the existing `if (activeBossConf) logBattleEntry("☠️ BOSS DEFEATED: …")` (`WX` 12917–12919) also never fires on a Rush room. Distinct from BR *Complete* (#845). Distinct from room-advance *banner* (#419). Distinct from BR *entry* log (#1227). Distinct from BR *nearby* (#1003). Distinct from 009 PHASE 2. Distinct from run-*ended on death* (#1184).
4. **Boss Rush resume-read fail is console-only and then starts Room 1.** `startBossRush` catch on `getBossRushState` is `console.error("[BossRush] Failed to read resume room:", e)` (`useBossRush.ts` 270–272). Fallback is `resumeRoomFromPersisted(currentRoomRef.current)` (`useBossRush.ts` 275–277). Mount load catch is also console-only (`useBossRush.ts` 203–205) and never sets `active`. Dual-fail (or a principal that never hydrated) leaves `resumeRoom === 0`; HUD then says `Boss Rush — Room 1 / 10`. Distinct from room-advance *persist-fail after the next room spawned* (#1227-003 — that ID is the write after a successful clear). Distinct from BR *entry* log (#1227-004 — that ID is the missing dungeon-enter-style cue on a *successful* start). Distinct from abort persist order (#803). Distinct from run-*ended on death* (#1184). Do not change `resumeRoomFromPersisted` math.

10-28-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8514) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control until #363. Enemy walk until #678 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523). Shock / shrine / Alabaster undrawn (#954). Ice/lava/spikes already tint | Several live cells still blind |
| Spell selection | Footer highlight; blue range; CD overlay digits | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click silent (#419). Slot AP digit is catalog (#772) | Cost ANTICIPATION lies under Surge |
| Target highlight | Hover `-dmg` omits Fury/Blood Moon (#894). Mark already doubles | Live entity-first gate | Cast or float | — | Hover ignores crit (matrix note). hitsMultiple / bounce rings wait on #571 / #610. Self/ally heal preview waits on #894 | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode wait on #363 / #419. Buff suppress waits on #772. Challenge *fail* wait on #1003. Unaccepted offer expire waits on #1061 | Better; queued PRs still needed |
| Damage | Hover `-dmg` can lie under Fury/Blood Moon | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (#419). Boss ability mute (#419). Reflect mute (#735). Shock *number* stays #419; shock *cell* is #954 | **Primary IMPACT still broken** |
| Healing | Slot title `Heals: N HP`; body hover waits on #894 | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363 | — | Spell heal path still 014. Enemy heal mute (#478). Dawn −10 HP “heal” is unread (MIMA). Overworld Doka-heal success toasts then persist-fail reverts until #1133 | Player OK after commit; fail lies until #1133 |
| AP/MP spend | Hover MP; AP bars 0.3s; **slot AP catalog** | Immediate decrement via live `applyApCost` | Elixir/boots wait on #363. Dawn +AP HUD-only (#954) | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Drain polarity waits on #419. Timestep HUD-only (#571). Summon End Turn leftover untitled (#894) | HUD only; digit can lie |
| Crits | Hover uses non-crit | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Erratic why waits on #735. Bomber detonate uses death pipeline shatter. `enemy_death` / `leader_boost` SFX exist and are never played — dead hooks, not mute mechanics | Leader overlay yes |
| Player death | HP bar | Recap **or** Game Over **or** 1.5s timer depending on path | Toast after teleport (`WX` 13486); Game Over 20/40 on the *modal* path | Death Realm | Timer invisible (013). Exit swirls unlabeled until #1061. Lava/spike in-battle skips Game Over until #1133. Floor has no HUD chip until #1133. Death-save fail until #1184. Dungeon/BR death never names the ended run until #1184 | Split climax; persist + run copy queued |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363; fade already logs `fades away...` | Fade canvas waits on #419 | Hostile kit spawn mute (#478). Ability minion mute (#610). 0/0 auto-end 500ms is re-entrancy, next-turn log speaks — not filed | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji from `activeEffects`; panel `{turns}t` | Apply float waits on #845; expiry log lies every tick (#845) | Pill vanishes | Shield Charm / Fury wait on #772. Duration digits still 012 | Apply/expiry INFORMATION thin |
| Spell observation | Hover dmg + inspect | Swap / Mirror / Shell wait on queued PRs | Windstorm still log-only until #363 | — | Null Field eat waits on #772. Enemy AI already logs `casts {name}` | Log / inspect only |
| Spell discovery | Full spellbook | Upgrade button shows cost / next DMG | Digits + Doka HUD only until #1003. Fail is `console.warn` | — | No unknown-spell fog (SDA). Feat *claim* already toasts. Unlock toast can lie before `markAchievementUnlocked` confirms (#1227) | Book upgrade mute until #1003; unlock confirm mute until #1227 |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant. Portal hydrate can bump `level` with no sound until #1184 | — | Recap still says “Level N”. Spell-book upgrade is #1003 | Recap sound yes; portal mute until #1184; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159). Claim toasts Doka **and** claim-fail. Unlock mutate has no `onError` / `#err` check until #1227 | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy. Challenge *fail* wait on #1003. Challenge *offer* / *expire* wait on #1061 | Unlock *show* OK; unlock *confirm* mute until #1227 |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610). BR complete mute (#845). Shock / rim telegraphs missing (#954). BR *death* does not say the run ended until #1184. BR *entry* mute until #1227. BR *room-advance persist* mute until #1227. **BR room-clear recap never names the two bosses (this ledger). Resume-read fail silently restarts Room 1 (this ledger)** | Weak climax; recap + resume mute |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (#419). Challenge rows unread (#845). Persist *fail* is debug-only until #1133. **Dungeon badge Depth 1/? (this ledger). Overworld per-kill Doka rows emptied (this ledger)** | Shell good; recap *why* still lies |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine *juice* mute (#419); shrine *tile* mute (#954); portal +10 XP silent until #478 | — | Recap heal allowed. Shop persist-fail waits on #1061. Heal persist-fail waits on #1133. Portal XP persist-fail waits on #1184. Death-penalty persist-fail waits on #1184. Dungeon-complete trophy log then silent persist-fail waits on #1227. **Dungeon ×N badge names the wrong floor (this ledger). Per-kill Doka rows computed then dropped (this ledger)** | Recap *why* still missing on chain depth + per-kill Doka |
| Initiative | Strip + timer (footer pulses ≤7s) | Chaos reshuffle at round wrap (`WX` 14717) | Strip jumps | — | Shuffle why waits on #772. Your-turn banner waits on #419 | Strip can surprise |
| Rest / chain / portals | Rest *entry* toast; dungeon nearby (`WX` 7916–7941); white / BR nearby wait on #1003; Death Realm Escape wait on #1061; BR HUD after `bossRushState.active`; dungeon HUD `Dungeon N/M` (`WX` 17575) | Rest-*exit* 400ms timeout (`WX` 6236). Portal XP persist after map swap (`WX` 6805). BR entry returns before `map_transition` until #1227 | Map swap; no sound/toast until #894 on rest-exit. Portal fail waits on #1184. BR entry log waits on #1227 | HUD `Dungeon N/M` if armed; Death Realm chip waits on #1133 | Chain *progress* log exists; rest-exit re-arm does not. Dungeon/BR death drops those chips with no run-ended line until #1184. **Recap Depth 1/? contradicts the live HUD chip (this ledger)** | Dungeon labeled on HUD; recap lies |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Highest unique P0 (003).

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused (`effects.ts` 331).

3. **`triggerHitStop` is inert.** Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF. Leave 011. In-battle lethal lava also skips Game Over (#1133).

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have. Shock *numbers* stay in that ID; shock *cells* are #954.

7. **`BattleUIPanel` AP digits do not call `resolveCastApCost`.** Execute already does (#772).

8. **Item-shop combat buffs (Shield / Fury) are refs, not `ActiveEffect`s.** Status chrome never sees them (#772). Hover `-dmg` also ignores Fury’s 1.25× (#894).

9. **Boss Rush final clear has no Complete cue** (#845). Dungeon-chain already has a trophy log. Dying mid-Rush also has no *ended* cue (#1184). **Entry** has no dungeon-enter-style log (#1227). **Room-advance persist** is console-only after spawn (#1227). **Room-clear recap never names the two bosses (this ledger). Resume-read fail silently restarts Room 1 (this ledger).**

10. **PostBattleRecap ignores `completedChallenges` / `dokaFromChallenges`** (#845). **`dokaBreakdown` is wired and overworld passes `[]` (this ledger).** **Dungeon badge defaults Depth 1/? (this ledger).**

11. **`applyActiveEffect` IMPACT is log + emoji only** (#845), except RAF hazard callers which stay frozen.

12. **Non-DoT “expired” log fires on every decrement** (#845). DoT drop is silent.

13. **Rest-exit is a silent 400ms map swap** (#894). Rest-entry and dungeon-enter already speak.

14. **Hover `-dmg` is not the execute formula for Fury / Blood Moon** (#894).

15. **Shock tiles have log coordinates and no floor tint** (#954). Lava/spikes already use `newHazardTiles`. Ice already tints.

16. **Shrine rooms have no altar overlay and no room chrome** (#954). Claim *juice* stays #419.

17. **Alabaster crushing rim is computed, damaging, and undrawn** (#954).

18. **Dawn +AP is HUD-only** (#954). Drain polarity stays #419.

19. **White sanctuary portals are an unlabeled pale swirl** (#1003). Dungeon nearby labels already exist.

20. **Boss Rush entry / progression portals skip the dungeon nearby-label pattern** (#1003). Room-advance banner stays #419; Complete stays #845. *Entry log / SFX* is #1227.

21. **Spellbook upgrade is a mute level-up** (#1003). Character recap sound stays 008. Portal character level-up is #1184.

22. **Challenge fail has no rising-edge cue** (#1003). HUD chrome stays a non-hole; recap rows stay #845.

23. **Death Realm exits are unlabeled overworld-colored swirls** (#1061). Arrival toast is not a nearby label. Wait chrome stays 013. HUD *chip* is #1133.

24. **Challenge offer never writes the battle log** (#1061). HUD after accept stays a non-hole.

25. **First action silently expires an unaccepted offer** (#1061). Fail-after-accept stays #1003.

26. **Shop Buy persist-fail is a silent inventory/wallet rollback** (#1061). Unaffordable stays a disabled button. Spell-upgrade fail stays #1003. Heal persist-fail after a *success* toast is #1133.

27. **In-battle lava/spike death skips Game Over 20/40** (#1133). Modal path stays a non-hole. Persist-*fail* of that same penalty is #1184.

28. **Victory persist-fail is debug-only after recap already showed the grant** (#1133). Portal *block* during in-flight persist stays #419. Portal XP *fail* after the map swapped is #1184. Dungeon-complete trophy log then silent persist-fail is #1227.

29. **Death Realm floor has no `Dungeon N/M`-style chip** (#1133). Escape nearby stays #1061.

30. **Death-penalty persist-fail is console-only after Game Over showed 20/40** (#1184).

31. **Portal +10 XP can level up with no `level_up` sound** (#1184). Recap sound stays 008.

32. **Dungeon / Boss Rush death never names the ended run** (#1184). BR Complete stays #845.

33. **Portal +10 XP persist-fail is `console.warn` after the map already swapped** (#1184). Success float stays #478.

34. **Dungeon-complete bonus persist-fail is silent after the trophy log** (#1227).

35. **Feat unlock toast / recap fires before `markAchievementUnlocked` confirms** (#1227).

36. **Boss Rush room-advance persist-fail is console-only after the next room spawned** (#1227).

37. **Boss Rush overworld-portal *entry* has no log / `map_transition` / banner** (#1227).

38. **Dungeon-chain recap badge always says Depth 1/?** (this ledger). Live HUD chip already tells the truth.

39. **Overworld recap empties `dokaBreakdown` after computing jackpot rows** (this ledger). BR recap already passes rows.

40. **Boss Rush room-clear recap never sets `bossDefeated` / never uses `_currentRoom` names** (this ledger). Overworld recap already has the banner.

41. **Boss Rush resume-read fail is console-only then Room 1** (this ledger). Mount cache is the designed fallback; dual-fail has no player cue.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (`handleBattleEnd` recap fields, `handleBossRushRoomClear` `bossDefeated` / roomDef names) plus `PostBattleRecap.tsx` Depth defaults and `useBossRush.ts` resume-read catch. Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on WX; **#845** / **#354** own Recap; **#803** owns `useBossRush.ts` abort persist order. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, cooldown overlay, #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 / #1184 / #1227 surfaces. BoostToggle stays PXA. `enemy_death` SFX stays unplayed.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates |
| #354 | Feats on recap chrome | UX. Union Recap if #845-002 or this ledger’s Depth / breakdown is wired later |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy for the +1 MP roll. Do not fork. +AP *float* is #954 |
| #379 / #417 | Walk occupancy / hover MP | Own `SummonControlPanel.tsx`. Union leftover-AP title later (#894) |
| #408 | Shop consume after in-flight buy | Persist. Union BuffShop if #1061-004 is wired later |
| #419 | 09-22 AN floats + melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009 including shrine *juice*, ability *numbers*, BR *room-advance banner*, and victory-persist *portal block* |
| #421 | leftover XP / Game Over 20/40 copy | UX. Game Over 20/40 already on `main` for the *modal* path. Lava skip is #1133. Death-save fail is #1184. Run-ended copy is #1184 |
| #434 | BuffShop Use on player turn | Combat. Use button already `title=`s `"Wait for your turn"` on `main` |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005 including portal +10 *success* float |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork. Spell-upgrade toast is #1003. Unlock *confirm* is #1227 |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004 |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013. Nearby Escape is #1061. HUD chip is #1133 |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005 |
| #592 | 44px summon End Turn | A11y. Union title string later (#894) |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004. Sealed *log* stays there; BR *nearby* is #1003 |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004 |
| #728 | Summon End Turn double-fire gate | Combat. Leftover-AP *title* is #894 |
| #735 | 09-28 silent feel audit | **Owns** 09-28-001…004 |
| #754 | Tax Swap landings | Mechanic. Swap *puff* stays #523 |
| #772 | 09-29 silent feel audit | **Owns** 09-29-001…004 |
| #799 | Bomber kamikaze / Inferno share | Combat truth. Shatter already runs on `hp<=0` |
| #803 | Boss Rush `complete(9)` persist | Persist order. Banner is #845. `abortBossRush` fail stays persist — do not re-file as GFCF. Run-*ended copy* is #1184. Room-*advance persist fail* is #1227. Resume-*read fail* is this ledger — union, do not overwrite abort order |
| #845 | 10-21 silent feel audit | **Owns** 10-21-001…004. Recap *challenge rows* stay there; fail *rising-edge* is #1003. BR *Complete* stays 001 there. This ledger’s Depth / `dokaBreakdown` / `bossDefeated` are **other Recap fields** — union, do not steal 002 |
| #850–#1165 | Boss/summon kit execute share, remount-wipe, portal snaps, pack-enemy buffs, leftover-XP wipe, TBC WAITING | Combat/persist/map/docs truth, not on `main`. Do not re-file as GFCF |
| #894 | 10-22 silent feel audit | **Owns** 10-22-001…004. Do not duplicate |
| #954 | 10-23 silent feel audit | **Owns** 10-23-001…004. Do not duplicate |
| #1003 | 10-24 silent feel audit | **Owns** 10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge. Do not duplicate |
| #1061 | 10-25 silent feel audit | **Owns** 10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail. Do not duplicate |
| #1108 | TBC WAITING_FOR_TELEMETRY (10-26) | Docs. Prior WAITING report |
| #1133 | 10-26 silent feel audit | **Owns** 10-26-001…004. Lava skip Game Over, heal persist-fail, victory persist-fail, Death Realm HUD chip. Do not duplicate |
| #1148 / #1155 / #1160 | Vampiric Ground / Iron Curse / Glass Realm commits | Combat truth *off* `main`. Stay MIMA on this HEAD |
| #1165 | TBC WAITING_FOR_TELEMETRY (10-27) | Docs. Prior WAITING report |
| #1184 | 10-27 silent feel audit | **Owns** 10-27-001…004. Death-save fail, portal level-up sound, run-ended on death, portal XP persist-fail. Do not duplicate |
| #1166–#1217 | Summon CD share, Chaos shuffle commit, kit-first Slow, map snaps, persist remounts | Combat/persist/map truth, not on `main`. Do not re-file as GFCF |
| #1227 | 10-28 silent feel audit | **Owns** 10-28-001…004. Dungeon-complete persist-fail, feat unlock confirm, BR room-advance persist-fail, BR entry log. Do not duplicate |
| #1232 | TBC WAITING_FOR_TELEMETRY (10-28) | Docs. Prior WAITING report |
| #1277 | TBC WAITING_FOR_TELEMETRY (10-29) | Docs. Current WAITING report. Do not invent feel-telemetry |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-10-29.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and the dated files on #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 / #1133 / #1184 / #1227 (those seventeen are not on `main`).
